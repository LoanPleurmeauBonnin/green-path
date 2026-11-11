/**
 * Content (GP.Content) — niveaux modifiés et textures créées avec l'éditeur (editor.html), publiés dans Supabase.
 *
 * Le jeu reste jouable hors ligne et sans compte : le contenu publié est gardé dans le navigateur (« greenpath.content »),
 * appliqué tout de suite au démarrage, puis rafraîchi en tâche de fond (délai 4 s, échec silencieux). Un contenu invalide
 * ou qui fait échouer la construction du niveau est ignoré : le niveau d'origine reste jouable.
 *   - niveau modifié  : un document « GZone » complet remplace celui du niveau (GP.GZONES) ; le niveau est reconstruit.
 *   - texture créée   : un sprite { w, h, rows (lettres de GP.SPRITE_PAL), frames_rows? } ajouté à la planche « perso »,
 *                       ou qui remplace le sprite existant de même identifiant.
 * Garde-fous : ?sans-edits=1 dans l'adresse ignore tout le contenu publié (retour au jeu d'origine).
 */
GP.Content = (function () {
  var KEY = 'greenpath.content';
  var applied = { levels: {}, textures: {} };    // version appliquée par niveau / texture
  var disabled = /[?&]sans-edits=1/.test(window.location.search || '');
  var originals = {};                            // sprites remplacés : copie de l'original, pour revenir en arrière
  var origDocs = {};                             // documents de niveau d'origine (avant remplacement)

  function store() { try { return window.localStorage; } catch (e) { return null; } }
  function readCache() {
    var s = store(), d = null;
    try { d = s && JSON.parse(s.getItem(KEY)); } catch (e) { d = null; }
    return d && typeof d === 'object' ? d : null;
  }
  function writeCache(data) {
    var s = store(); if (!s) return;
    try { s.setItem(KEY, JSON.stringify(data)); } catch (e) { /* stockage plein ou bloqué */ }
  }

  // ---------- Validation ----------
  /** Vrai si la valeur ne contient que des nombres finis et bornés, des textes courts, et pas plus de 9 niveaux d'imbrication. */
  function sane(v, depth) {
    if (depth > 9) return false;
    if (v === null || typeof v === 'boolean') return true;
    if (typeof v === 'number') return Number.isFinite(v) && Math.abs(v) < 100000;
    if (typeof v === 'string') return v.length <= 5000;
    if (Array.isArray(v)) return v.length <= 6000 && v.every(function (x) { return sane(x, depth + 1); });
    if (typeof v === 'object') {
      var keys = Object.keys(v);
      return keys.length <= 120 && keys.every(function (k) { return k.length <= 60 && sane(v[k], depth + 1); });
    }
    return false;
  }
  function isNum(v) { return typeof v === 'number' && Number.isFinite(v); }

  /** Vérifie un document de niveau ; renvoie null s'il est bon, sinon la raison (texte français). */
  function checkLevel(d, index) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return 'document absent';
    if (!sane(d, 0)) return 'valeur hors limites ou trop volumineuse';
    if (d.num !== index + 1) return 'numéro de niveau incorrect';
    if (!isNum(d.largeur) || d.largeur < 20 || d.largeur > 400) return 'largeur entre 20 et 400 tuiles';
    if (!isNum(d.hauteur) || d.hauteur < 10 || d.hauteur > 60) return 'hauteur entre 10 et 60 tuiles';
    if (!d.spawn || !isNum(d.spawn.x) || !isNum(d.spawn.y)) return 'départ manquant';
    if (!d.arrivee || !d.arrivee.declencheur || !isNum(d.arrivee.declencheur.x) || !isNum(d.arrivee.declencheur.y)) return 'arrivée manquante';
    if (!d.arrivee.monument || typeof d.arrivee.monument !== 'object') return 'monument d’arrivée manquant';
    if (!d.fond || !d.fond.ciel || !Array.isArray(d.fond.couches)) return 'fond manquant';
    if (typeof d.sourceHash !== 'string') return 'révision manquante';
    var lists = ['plateformes', 'dangers', 'pixels', 'checkpoints', 'signes', 'zones'];
    for (var i = 0; i < lists.length; i++) if (!Array.isArray(d[lists[i]])) return 'liste « ' + lists[i] + ' » manquante';
    var pos = ['plateformes', 'dangers', 'pixels', 'checkpoints', 'signes', 'decor', 'ennemis'];
    for (var j = 0; j < pos.length; j++) {
      var list = d[pos[j]] || [];
      for (var k = 0; k < list.length; k++) {
        var o = list[k];
        if (!o || typeof o !== 'object') return 'objet invalide dans « ' + pos[j] + ' »';
        if (!['x', 'x0', 'x1'].some(function (k) { return isNum(o[k]); })) return 'abscisse invalide dans « ' + pos[j] + ' »';
        if (pos[j] !== 'ennemis' && !['y', 'y_top', 'y0', 'y1'].some(function (k) { return isNum(o[k]); })) return 'ordonnée invalide dans « ' + pos[j] + ' »';
      }
    }
    if (d.pixels.length < 1 || d.pixels.length > 400) return 'entre 1 et 400 pixels';
    if (d.checkpoints.length > 12) return '12 lanternes au plus';
    return null;
  }

  /** Vérifie un sprite créé (taille 1 à 64, lettres de la palette ou « . »). */
  function checkSprite(doc) {
    if (!doc || typeof doc !== 'object' || !sane(doc, 0)) return 'sprite invalide';
    if (!Number.isInteger(doc.w) || !Number.isInteger(doc.h) || doc.w < 1 || doc.h < 1 || doc.w > 64 || doc.h > 64) return 'taille entre 1 et 64 pixels';
    var sets = [doc.rows].concat(doc.frames_rows || []);
    if (doc.frames_rows && (!Array.isArray(doc.frames_rows) || doc.frames_rows.length > 8)) return '8 images au plus';
    for (var s = 0; s < sets.length; s++) {
      var rows = sets[s];
      if (!Array.isArray(rows) || rows.length !== doc.h) return 'hauteur des lignes incorrecte';
      for (var y = 0; y < rows.length; y++) {
        if (typeof rows[y] !== 'string' || rows[y].length !== doc.w) return 'largeur des lignes incorrecte';
        for (var x = 0; x < doc.w; x++) { var ch = rows[y].charAt(x); if (ch !== '.' && !GP.SPRITE_PAL[ch]) return 'couleur inconnue « ' + ch + ' »'; }
      }
    }
    return null;
  }

  // ---------- Application ----------
  function findSprite(id) {
    var sheets = Object.keys(GP.SPRITES || {});
    for (var i = 0; i < sheets.length; i++) {
      var list = GP.SPRITES[sheets[i]];
      for (var j = 0; j < list.length; j++) if (list[j].id === id) return list[j];
    }
    return null;
  }

  /** Ajoute ou remplace les sprites créés. map : { id: { w, h, rows, frames_rows?, anchor?, tile_x?, label?, famille? } }. */
  function applyTextures(map) {
    var count = 0;
    Object.keys(map || {}).forEach(function (id) {
      var doc = map[id];
      if (checkSprite(doc)) return;
      var cur = findSprite(id);
      if (cur) {
        if (!originals[id]) originals[id] = { w: cur.w, h: cur.h, rows: cur.rows, frames_rows: cur.frames_rows };
        cur.w = doc.w; cur.h = doc.h; cur.rows = doc.rows;
        if (doc.frames_rows) cur.frames_rows = doc.frames_rows; else delete cur.frames_rows;
      } else {
        if (!GP.SPRITES.perso) GP.SPRITES.perso = [];
        var s = { id: id, w: doc.w, h: doc.h, rows: doc.rows, anchor: doc.anchor || 'top-left', tile_x: !!doc.tile_x, label: doc.label || id, custom: true };
        if (doc.frames_rows) s.frames_rows = doc.frames_rows;
        GP.SPRITES.perso.push(s);
      }
      count++;
    });
    return count;
  }

  /** Remplace un niveau par sa version publiée et le reconstruit. Renvoie null si tout va bien, sinon la raison de l'échec. */
  function applyLevel(id, doc, version) {
    var i = GP.GZoneLevels.ids.indexOf(id);
    if (i < 0) return 'niveau inconnu';
    var why = checkLevel(doc, i);
    if (why) return why;
    var d = JSON.parse(JSON.stringify(doc));
    d.refonte = d.retouche = d.equilibre = true;      // les retouches du code sont déjà dans le document publié
    d.sourceHash = 'edit' + (version || 0) + '-' + String(d.sourceHash || '').slice(-20);
    var before = GP.LEVELS[id], gbefore = GP.GZONES[i];
    if (!origDocs[id] && !gbefore.__edit) origDocs[id] = gbefore;
    d.__edit = true;
    try {
      GP.GZONES[i] = d;
      GP.LEVELS[id] = GP.GZoneLevels.make(d, id);
      var loc = GP.LOCATIONS[i];
      if (loc && d.temps_ref_s) { GP.Tuning.parTimes[id] = d.temps_ref_s; loc.parTime = d.temps_ref_s; }
    } catch (e) {
      GP.LEVELS[id] = before; GP.GZONES[i] = gbefore;
      return 'construction impossible';
    }
    applied.levels[id] = version || 0;
    return null;
  }

  function applyAll(data) {
    if (disabled || !data || typeof data !== 'object') return;
    applyTextures(data.textures);
    Object.keys(data.levels || {}).forEach(function (id) {
      var e = data.levels[id];
      if (e && applied.levels[id] !== e.version) applyLevel(id, e.doc, e.version);
    });
  }

  /** Essai d'un brouillon : textures publiées + niveau brouillon de l'éditeur ; bouton de retour vers l'éditeur. */
  function testDraft() {
    var s = store(), t = null;
    try { t = s && JSON.parse(s.getItem('greenpath.editor.test')); } catch (e) { t = null; }
    var cache = readCache();
    if (cache) applyTextures(cache.textures);
    if (t && t.textures) applyTextures(t.textures);
    if (t && t.level === GP.Config.TEST_DRAFT && t.doc) {
      var why = applyLevel(t.level, t.doc, 0);
      if (why) window.__testDraftError = why;
    }
    var a = document.createElement('a');
    a.href = 'editor.html?level=' + encodeURIComponent(GP.Config.TEST_DRAFT);
    a.textContent = '← RETOUR À L’ÉDITEUR';
    a.style.cssText = 'position:fixed;top:6px;left:50%;transform:translateX(-50%);z-index:50;background:#14182e;color:#f4d35e;border:2px solid #f4d35e;padding:6px 10px;font:700 12px monospace;text-decoration:none';
    document.body.appendChild(a);
  }

  var api = {
    disabled: disabled,
    checkLevel: checkLevel, checkSprite: checkSprite, applyLevel: applyLevel, applyTextures: applyTextures,
    /** Version publiée d'un niveau (0 = niveau d'origine). */
    version: function (id) { return applied.levels[id] || 0; },
    originalSprite: function (id) { return originals[id] || null; },
    /** Document d'origine d'un niveau (copie), même si une version publiée l'a remplacé dans cette page. */
    originalDoc: function (id) { var i = GP.GZoneLevels.ids.indexOf(id); var d = origDocs[id] || GP.GZONES[i]; return d ? JSON.parse(JSON.stringify(d)) : null; },

    /** Au démarrage : applique le contenu gardé dans le navigateur (instantané), puis rafraîchit en tâche de fond. */
    init: function () {
      if (GP.Config.TEST_DRAFT) { testDraft(); return; }
      applyAll(readCache());
      if (disabled || !GP.Cloud || !GP.Cloud.enabled) return;
      GP.Cloud.rpc('gp_content_get', {}).then(function (r) {
        if (!r.ok || !r.data || typeof r.data !== 'object') return;
        var data = { levels: r.data.levels || {}, textures: r.data.textures || {} };
        writeCache(data);
        // niveaux : appliqués tout de suite (le niveau est reconstruit à chaque entrée) ; textures : à la prochaine ouverture
        Object.keys(data.levels).forEach(function (id) {
          var e = data.levels[id];
          if (e && applied.levels[id] !== e.version) applyLevel(id, e.doc, e.version);
        });
        // un niveau dont la version publiée a disparu (réinitialisé) revient à l'original à la prochaine ouverture
      }).catch(function () { /* hors ligne : on garde ce qui est en cache */ });
    },

    /** Contenu publié actuellement en cache (pour l'éditeur). */
    cached: function () { return readCache() || { levels: {}, textures: {} }; },
    /** Met à jour le cache local après une publication ou une réinitialisation faite depuis l'éditeur. */
    setCached: function (data) { writeCache(data); }
  };
  return api;
})();
