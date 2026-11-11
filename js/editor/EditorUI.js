/**
 * EditorUI (GP.Ed) — l'état de l'éditeur de niveaux et ses panneaux HTML : barre du haut, outils, palettes, inspecteur,
 * annuler/rétablir, brouillon automatique, essai, publication (Supabase, réservé à l'admin), historique, import/export JSON.
 * La vue du niveau est la scène Phaser « Editor » (EditorScene.js) ; l'éditeur de textures est dans TextureEditor.js.
 * Un niveau est un document GZone (voir js/data/gzones.js) : l'éditeur modifie ses listes (plateformes, décor, dangers, ennemis,
 * pixels, lanternes, panneaux…) sans jamais exécuter son contenu.
 */
GP.Ed = (function () {
  var IDS = ['jardin-des-plantes', 'cathedrale', 'chateau', 'feydeau', 'graslin', 'machines', 'chantiers', 'buren', 'hangar', 'memorial', 'pommeraye', 'tour-lu'];
  var GZ_ORDER = ['jardin-des-plantes', 'cathedrale', 'chateau', 'feydeau', 'graslin', 'machines', 'chantiers', 'buren', 'hangar', 'pommeraye', 'memorial', 'tour-lu'];   // ordre de GP.GZONES
  var PONT = ['commun_pont_planches_g', 'commun_pont_planches_m', 'commun_pont_planches_d'];
  var LAYERS = [['plateformes', 'Blocs'], ['decor', 'Décors'], ['dangers', 'Dangers'], ['ennemis', 'Ennemis'], ['pixels', 'Pixels'], ['checkpoints', 'Lanternes'], ['signes', 'Panneaux'], ['autres', 'Autres']];
  var CATS = [
    { k: 'blocs', label: 'Blocs' }, { k: 'appuis', label: 'Appuis' }, { k: 'decor', label: 'Décors' }, { k: 'dangers', label: 'Dangers' },
    { k: 'ennemis', label: 'Ennemis' }, { k: 'pixels', label: 'Pixels' }, { k: 'lanternes', label: 'Lanternes' }, { k: 'panneaux', label: 'Panneaux' }
  ];
  var FILTER = { dangers: /pointe|ronce|obstacle|vapeur|jet_eau|ferraille|tole|dents|bielle|piston|cierge|borne|gargouille|bassin|hazard|risque/i,
    ennemis: /oiseau|mouette|tonneau|papillon|animal|heron|rat|elephant|moisissure|vortex|ennemi/i };

  var S = {
    online: false, idx: -1, id: null, doc: null, last: '', undo: [], redo: [], dirty: false, sel: null, tool: 'select', snap: 0.5, showGrid: true, space: false,
    report: null, checking: false, cat: 'decor', brush: null, mat: 'herbe', vis: {}, cursor: null, scene: null, buildError: null, version: 0, mode: 'level', msg: '', msgKind: '', search: '', all: false
  };
  var UI = {};   // éléments du DOM

  // ---------- Petits outils DOM ----------
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function btn(label, cb, cls, title) { var b = el('button', { type: 'button', class: 'btn' + (cls ? ' ' + cls : ''), text: label, title: title || '' }); b.addEventListener('click', cb); return b; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function modal(title, body, buttons) {
    var root = document.getElementById('ed-modal'), box = el('div', { class: 'box' });
    root.textContent = ''; root.hidden = false; root.appendChild(box);
    box.appendChild(el('h3', { text: title })); box.appendChild(body);
    var row = el('div', { class: 'row' });
    (buttons || []).forEach(function (b) { row.appendChild(b); });
    row.appendChild(btn('Fermer', function () { root.hidden = true; root.textContent = ''; }));
    box.appendChild(row);
    return { close: function () { root.hidden = true; root.textContent = ''; } };
  }

  // ---------- Sprites ----------
  var RGB = {};
  function rgb(ch) { if (!RGB[ch]) { var n = parseInt(GP.SPRITE_PAL[ch].slice(1), 16); RGB[ch] = [n >> 16 & 255, n >> 8 & 255, n & 255]; } return RGB[ch]; }
  function allSprites() {
    var out = [];
    Object.keys(GP.SPRITES || {}).forEach(function (sheet) { GP.SPRITES[sheet].forEach(function (s) { out.push({ id: s.id, w: s.w, h: s.h, rows: s.frames_rows ? s.frames_rows[0] : s.rows, sheet: sheet, s: s }); }); });
    return out;
  }
  /** Miniature d'un sprite (canvas à taille réelle, agrandi en CSS sans lissage). */
  function thumb(rows, w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var ctx = c.getContext('2d'), img = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var ch = rows[y].charAt(x); if (ch === '.' || !GP.SPRITE_PAL[ch]) continue;
      var col = rgb(ch), i = (y * w + x) * 4; img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2]; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    var k = Math.max(1, Math.min(3, Math.floor(44 / Math.max(w, h)))); c.style.width = (w * k) + 'px'; c.style.height = (h * k) + 'px';
    return c;
  }

  // ---------- Messages et état ----------
  function say(text, kind) { S.msg = text; S.msgKind = kind || ''; refreshStatus(); }
  function refreshStatus() {
    var d = S.doc, bar = UI.status; if (!bar) return;
    bar.textContent = '';
    function item(t, cls) { bar.appendChild(el('span', { class: cls || '', text: t })); }
    if (S.mode === 'tex') { item('Textures : ' + (GP.TexEd ? GP.TexEd.statusText() : '')); if (S.msg) item(S.msg, S.msgKind); return; }
    if (d) {
      item((S.cursor ? 'x ' + Math.floor(S.cursor.x) + '  y ' + Math.floor(S.cursor.y) : 'x –  y –'));
      item('zoom ×' + (S.scene ? Math.round(S.scene.zoom * 100) / 100 : 2));
      item('pas ' + (S.snap || 'libre'));
      item(d.largeur + '×' + d.hauteur + ' tuiles · ' + (d.pixels || []).length + ' pixels');
      var sel = S.sel && GP.EdGeom.get(d, S.sel); if (sel) item('sélection : ' + S.sel.list + (S.sel.i !== undefined ? ' #' + S.sel.i : ''));
      item(S.dirty ? '● modifié (brouillon enregistré)' : '✓ à jour', S.dirty ? 'warn' : 'ok');
      item(GP.Content.version(S.id) ? 'publié v' + GP.Content.version(S.id) : 'niveau d’origine');
    }
    if (S.buildError) item('Erreur : ' + S.buildError, 'warn');
    if (S.msg) item(S.msg, S.msgKind);
    item(S.online ? 'en ligne' : 'hors ligne : brouillons seulement', S.online ? 'ok' : 'warn');
  }

  // ---------- Document ----------
  function nextId(list, prefix) {
    var n = 1, used = {}; (S.doc[list] || []).forEach(function (o) { if (o && o.id !== undefined) used[o.id] = true; });
    while (used[prefix + n]) n++; return prefix + n;
  }
  function nextNum(list) { var m = 0; (S.doc[list] || []).forEach(function (o) { if (typeof o.id === 'number') m = Math.max(m, o.id); }); return m + 1; }

  function draftKey(id) { return 'greenpath.editor.draft.' + id; }
  function saveDraft() {
    try { localStorage.setItem(draftKey(S.id), JSON.stringify({ doc: S.doc, savedAt: Date.now() })); } catch (e) { say('Brouillon trop gros pour le navigateur : exporte le JSON.', 'warn'); }
  }
  var draftTimer = null;
  function commit(label) {
    var now = JSON.stringify(S.doc);
    if (now === S.last) { refreshInspector(); return; }
    S.undo.push(S.last); if (S.undo.length > 60) S.undo.shift();
    S.redo = []; S.last = now; S.dirty = true;
    clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 400);
    if (S.scene) S.scene.rebuild();
    refreshInspector(); refreshTop(); refreshStatus();
    if (label) say(label, '');
  }
  function restore(json) {
    S.doc = JSON.parse(json); S.last = json; S.sel = null;
    clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 400); S.dirty = true;
    if (S.scene) S.scene.rebuild();
    refreshInspector(); refreshTop();
  }
  function undo() { if (!S.undo.length) return; S.redo.push(S.last); restore(S.undo.pop()); say('Annulé', ''); }
  function redo() { if (!S.redo.length) return; S.undo.push(S.last); restore(S.redo.pop()); say('Rétabli', ''); }

  function select(sel) { S.sel = sel; if (S.scene) S.scene.drawSel(); refreshInspector(); refreshStatus(); }
  function removeSel() {
    var sel = S.sel; if (!sel || !S.doc) return;
    if (sel.list === 'spawn' || sel.list === 'arrivee') { say('Le départ et l’arrivée ne se suppriment pas : déplace-les.', 'warn'); return; }
    S.doc[sel.list].splice(sel.i, 1); S.sel = null; commit('Supprimé');
  }
  function dupSel() {
    var sel = S.sel; if (!sel || sel.i === undefined) return;
    var o = clone(S.doc[sel.list][sel.i]);
    if (typeof o.id === 'number') o.id = nextNum(sel.list); else if (typeof o.id === 'string') o.id = o.id.replace(/\d*$/, '') + (Date.now() % 100000);
    ['x', 'x1', 'x2', 'x0', 'cx'].forEach(function (k) { if (typeof o[k] === 'number') o[k] += 2; });
    S.doc[sel.list].push(o); S.sel = { list: sel.list, i: S.doc[sel.list].length - 1 }; commit('Dupliqué');
  }

  // ---------- Poser des objets ----------
  function placeAt(cx, cy, tx, ty) {
    var d = S.doc, b = S.brush, x = S.scene ? S.scene.snap(tx, 'decor') : cx, y = cy, o, list;
    if (!d) return;
    var cat = S.cat;
    if (cat === 'appuis') {
      var kind = b || 'pont';
      if (kind === 'pont') { list = 'plateformes'; o = { id: nextId('plateformes', 'pont'), type: 'pont', x: cx, y: cy, w: 3, sprite_set: PONT }; }
      else if (kind === 'pad') { list = 'plateformes'; o = { id: nextId('plateformes', 'pad'), type: 'pad', x: cx, y: cy, w: 2, solid: 'top' }; }
      else if (kind === 'rampe') { list = 'plateformes'; o = { id: nextId('plateformes', 'rampe'), type: 'rampe', x0: cx, y0: cy, x1: cx + 8, y1: cy - 8, fill_sprite: 'commun_terre_1', top_sprite: 'commun_herbe_haut_1' }; }
      else if (kind === 'eau') { list = 'dangers'; o = { sprite: 'jardin_bassin_surface', x: cx, y: cy, w: 3, kind: 'eau_mortelle' }; }
      else return;
    } else if (!b) { say('Choisis d’abord un élément dans la palette.', 'warn'); return; }
    else if (cat === 'decor') { list = 'decor'; o = { sprite: b, x: x, y: y }; }
    else if (cat === 'dangers') { list = 'dangers'; o = { sprite: b, x: x, y: y, kind: 'mortel' }; }
    else if (cat === 'ennemis') { list = 'ennemis'; o = { id: nextId('ennemis', 'e'), sprite: b, type: 'patrouille_horizontale', x1: cx, x2: cx + 4, y: y, vitesse: 2 }; }
    else if (cat === 'pixels') { list = 'pixels'; o = { id: nextNum('pixels'), sprite: 'commun_pixel', x: cx, y: cy, difficulte: 'facile', detail_image: 1 }; }
    else if (cat === 'lanternes') { list = 'checkpoints'; o = { id: nextNum('checkpoints'), x: cx, y: cy, sprite_off: 'commun_lanterne_eteinte', sprite_on: 'commun_lanterne_allumee' }; }
    else if (cat === 'panneaux') { list = 'signes'; o = { sprite: b, x: cx, y: cy, texte: 'Nouveau panneau' }; }
    else return;
    if (!Array.isArray(d[list])) d[list] = [];
    d[list].push(o); S.sel = { list: list, i: d[list].length - 1 };
    commit('Ajouté : ' + list);
  }
  function materials() {
    var out = [{ k: 'herbe', label: 'Herbe et terre', props: { style: 'herbe' } }], seen = { herbe: 1 };
    (S.doc.plateformes || []).forEach(function (p) {
      if (p.type !== 'masse') return;
      var k = p.style === 'herbe' && !p.top_sprite ? 'herbe' : p.tuiles ? 'tuiles:' + p.tuiles : (p.top_sprite || '') + '|' + (p.fill_sprite || '');
      if (seen[k]) return; seen[k] = 1;
      var props = p.tuiles ? { tuiles: p.tuiles } : { top_sprite: p.top_sprite, fill_sprite: p.fill_sprite };
      out.push({ k: k, label: p.tuiles ? 'Matériau ' + p.tuiles : (p.top_sprite || p.fill_sprite || 'bloc').replace(/_/g, ' '), props: props });
    });
    return out;
  }
  function addBlock(x, y, w) {
    var m = materials().filter(function (e) { return e.k === S.mat; })[0] || materials()[0];
    var o = Object.assign({ id: nextId('plateformes', 'm'), type: 'masse', x: x, y: y, w: w }, clone(m.props));
    S.doc.plateformes.push(o); S.sel = { list: 'plateformes', i: S.doc.plateformes.length - 1 };
    commit('Bloc ajouté');
  }
  function layerOn(list) {
    var main = { plateformes: 1, decor: 1, dangers: 1, ennemis: 1, pixels: 1, checkpoints: 1, signes: 1 };
    var k = main[list] ? list : 'autres';
    return S.vis[k] !== false;
  }

  // ---------- Chargement d'un niveau ----------
  function load(id) {
    var i = GZ_ORDER.indexOf(id); if (i < 0) return;
    if (S.dirty && S.id && !confirm('Des modifications ne sont pas publiées (elles restent dans le brouillon). Changer de niveau ?')) { refreshTop(); return; }
    S.idx = i; S.id = id; S.undo = []; S.redo = []; S.sel = null; S.dirty = false; S.report = null;
    var base = clone(GP.GZONES[i]); delete base.__edit;
    var draft = null; try { draft = JSON.parse(localStorage.getItem(draftKey(id))); } catch (e) { draft = null; }
    if (draft && draft.doc && JSON.stringify(draft.doc) !== JSON.stringify(base) && !GP.Content.checkLevel(draft.doc, i) &&
        confirm('Un brouillon de ce niveau existe (' + new Date(draft.savedAt).toLocaleString('fr-FR') + '). Le reprendre ?')) { S.doc = draft.doc; S.dirty = true; }
    else S.doc = base;
    S.last = JSON.stringify(S.doc);
    try { history.replaceState(null, '', '?level=' + id); } catch (e) { /* ignoré */ }
    if (S.scene) { S.scene.rebuild(); S.scene.fit(); }
    var warn = id === 'chateau' ? 'Le Château joué aujourd’hui est une version à part (js/data/levels.js) : publier ce document le remplace par la version « GZone ».' : '';
    say(warn, warn ? 'warn' : '');
    refreshAll();
  }

  // ---------- Essai, publication, historique, JSON ----------
  function validate() {
    var why = GP.Content.checkLevel(S.doc, S.idx);
    if (why) { say('Niveau invalide : ' + why, 'warn'); return false; }
    return true;
  }
  function stripped() { var d = clone(S.doc); delete d.__edit; return d; }
  // ---------- Contrôle : faisabilité (simulation du joueur) et cohérence (lint) ----------
  /** Lance le contrôle du document courant ; résout { issues, solver, ms }. Les erreurs bloquent la publication. */
  function check() {
    var json = S.last, d = JSON.parse(json);
    S.checking = true; refreshTop();
    var issues = GP.Lint.check(d), roofs = [];
    try { var c = clone(d); c.refonte = c.retouche = c.equilibre = true; roofs = GP.GZoneLevels.make(c, S.id).roofs || []; } catch (e) { issues.push({ level: 'erreur', code: 'construction', msg: 'Le niveau ne peut pas être construit : ' + e.message }); }
    d.roofs = roofs;
    return new Promise(function (resolve) {
      var done = false, w = null;
      function finish(solver, ms, err) {
        if (done) return; done = true; if (w) w.terminate();
        if (solver) {
          if (!solver.exit) issues.push({ level: 'erreur', code: 'arrivee-inatteignable', msg: 'L’arrivée est inatteignable : le joueur ne peut pas finir le niveau.', list: 'arrivee', x: d.arrivee.declencheur.x, y: d.arrivee.declencheur.y });
          solver.missing.forEach(function (m) {
            var id = m.split('@')[0], idx = d.pixels.findIndex(function (p) { return String(p.id) === id; }), p = d.pixels[idx] || {};
            issues.push({ level: 'erreur', code: 'pixel-inatteignable', msg: 'Le pixel ' + m + ' est inatteignable.', list: 'pixels', i: idx, x: p.x, y: p.y });
          });
          solver.lights.forEach(function (m) { var xy = m.split(','), idx = d.checkpoints.findIndex(function (c) { return c.x === +xy[0] && c.y === +xy[1]; });
            issues.push({ level: 'erreur', code: 'lanterne-inatteignable', msg: 'La lanterne (' + m + ') est inatteignable.', list: 'checkpoints', i: idx, x: +xy[0], y: +xy[1] }); });
        } else issues.push({ level: 'avertissement', code: 'simulation', msg: 'La simulation du joueur n’a pas pu tourner (' + (err || 'indisponible') + ') : la faisabilité n’est pas vérifiée.' });
        S.checking = false;
        S.report = { json: json, at: Date.now(), issues: issues, solver: solver, ms: ms };
        refreshTop(); refreshInspector(); refreshStatus();
        resolve(S.report);
      }
      try {
        w = new Worker('js/editor/solvability-worker.js');
        w.onmessage = function (e) { if (e.data.ok) finish(e.data.result, e.data.ms); else finish(null, 0, e.data.error); };
        w.onerror = function (e) { finish(null, 0, e.message); };
        w.postMessage({ doc: d });
        setTimeout(function () { finish(null, 0, 'délai dépassé (60 s)'); }, 60000);
      } catch (e) { finish(null, 0, e.message); }
    });
  }
  function reportFresh() { return !!S.report && S.report.json === S.last; }
  function counts(r) { return { err: r.issues.filter(function (i) { return i.level === 'erreur'; }).length, warn: r.issues.filter(function (i) { return i.level !== 'erreur'; }).length }; }
  /** Garde-fou : un niveau qui a des erreurs de faisabilité ne se publie pas sans une confirmation explicite. Résout vrai si on peut publier. */
  function guard() {
    var p = reportFresh() ? Promise.resolve(S.report) : check();
    return p.then(function (r) {
      var c = counts(r);
      if (!c.err) return c.warn ? confirm('Le contrôle signale ' + c.warn + ' avertissement(s) (voir le panneau Contrôle). Publier quand même ?') : true;
      return new Promise(function (resolve) {
        var list = el('div', { class: 'list' });
        r.issues.filter(function (i) { return i.level === 'erreur'; }).forEach(function (i) { list.appendChild(el('div', { text: '✖ ' + i.msg })); });
        var m = modal('Publication bloquée : ' + c.err + ' erreur(s)', el('div', {}, [el('p', { text: 'Les joueurs pourraient être bloqués ou perdre leur progression. Corrige ces erreurs (clique-les dans le panneau Contrôle pour les voir dans le niveau), puis republie.' }), list]),
          [btn('Publier malgré tout', function () { m.close(); resolve(confirm('Dernière confirmation : publier un niveau qui a des erreurs de faisabilité ?')); }, 'danger')]);
        document.querySelector('#ed-modal .row .btn:last-child').addEventListener('click', function () { resolve(false); });
      });
    });
  }
  function goTo(issue) {
    if (issue.list && issue.i !== undefined && issue.i >= 0) select({ list: issue.list, i: issue.i });
    else if (issue.list === 'spawn' || issue.list === 'arrivee') select({ list: issue.list });
    if (S.scene && issue.x !== undefined) S.scene.centerOn(issue.x, issue.y);
  }

  function test() {
    if (!validate()) return;
    var data = { level: S.id, doc: stripped(), textures: GP.TexEd ? GP.TexEd.drafts() : {} };
    try { localStorage.setItem('greenpath.editor.test', JSON.stringify(data)); } catch (e) { say('Brouillon trop gros pour l’essai : publie-le d’abord.', 'warn'); return; }
    window.open('index.html?test=' + encodeURIComponent(S.id), '_blank');
  }
  function publish() {
    if (!S.online) { say('Hors ligne : impossible de publier.', 'warn'); return; }
    if (!validate()) return;
    say('Contrôle avant publication…', '');
    guard().then(function (ok) { if (ok) doPublish(); else say('Publication annulée.', 'warn'); });
  }
  function doPublish() {
    if (!confirm('Publier « ' + S.doc.nom + ' » ? Tous les joueurs joueront cette version (tu pourras revenir à l’original ou à une version précédente).')) return;
    say('Publication…', '');
    GP.Cloud.rpc('gp_level_save', { p_code: GP.Cloud.code, p_level: S.id, p_doc: stripped() }).then(function (r) {
      if (!r.ok) { say(r.error === 'offline' ? 'Pas de connexion : réessaie.' : 'Erreur serveur : la migration Supabase est-elle appliquée ?', 'warn'); return; }
      if (!r.data.ok) { say(r.data.error === 'forbidden' ? 'Refusé : ce compte n’est pas admin.' : 'Document refusé (' + r.data.error + ').', 'warn'); return; }
      var cache = GP.Content.cached(); cache.levels[S.id] = { doc: stripped(), version: r.data.version }; GP.Content.setCached(cache);
      GP.Content.applyLevel(S.id, stripped(), r.data.version);
      S.dirty = false; try { localStorage.removeItem(draftKey(S.id)); } catch (e) { /* ignoré */ }
      say('Publié : version ' + r.data.version + '.', 'ok'); refreshTop(); refreshStatus();
    });
  }
  function resetOriginal() {
    if (!S.online) { say('Hors ligne : impossible.', 'warn'); return; }
    if (!confirm('Revenir au niveau d’origine pour tous les joueurs ? (la version publiée reste dans l’historique)')) return;
    GP.Cloud.rpc('gp_level_reset', { p_code: GP.Cloud.code, p_level: S.id }).then(function (r) {
      if (!r.ok || !r.data.ok) { say('Échec de la réinitialisation.', 'warn'); return; }
      var cache = GP.Content.cached(); delete cache.levels[S.id]; GP.Content.setCached(cache);
      S.doc = GP.Content.originalDoc(S.id); delete S.doc.__edit; commit('Niveau d’origine rétabli (visible par les joueurs à la prochaine ouverture)');
    });
  }
  function history() {
    if (!S.online) { say('Hors ligne : l’historique est sur le serveur.', 'warn'); return; }
    GP.Cloud.rpc('gp_level_history', { p_code: GP.Cloud.code, p_level: S.id }).then(function (r) {
      if (!r.ok || !r.data.ok) { say('Historique indisponible.', 'warn'); return; }
      var list = el('div', { class: 'list' }), m;
      (r.data.items || []).forEach(function (it) {
        list.appendChild(el('div', { onclick: function () {
          GP.Cloud.rpc('gp_level_history_get', { p_code: GP.Cloud.code, p_id: it.id }).then(function (g) {
            if (!g.ok || !g.data.ok) { say('Version introuvable.', 'warn'); return; }
            var why = GP.Content.checkLevel(g.data.doc, S.idx); if (why) { say('Version invalide : ' + why, 'warn'); return; }
            S.doc = g.data.doc; delete S.doc.__edit; commit('Version ' + it.version + ' chargée (non publiée)'); m.close();
          });
        } }, [el('span', { text: 'Version ' + it.version }), el('span', { class: 'hint', text: new Date(it.saved_at).toLocaleString('fr-FR') })]));
      });
      if (!(r.data.items || []).length) list.appendChild(el('div', { text: 'Aucune version publiée.' }));
      m = modal('Historique de ' + S.doc.nom, list, []);
    });
  }
  function exportJson() {
    var blob = new Blob([JSON.stringify(stripped(), null, 1)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'niveau-' + S.id + '.json'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  }
  function importJson() {
    var f = el('input', { type: 'file', accept: 'application/json,.json' });
    f.addEventListener('change', function () {
      var file = f.files[0]; if (!file) return;
      file.text().then(function (t) {
        var d; try { d = JSON.parse(t); } catch (e) { say('JSON illisible.', 'warn'); return; }
        var why = GP.Content.checkLevel(d, S.idx); if (why) { say('Import refusé : ' + why, 'warn'); return; }
        S.doc = d; commit('Importé');
      });
    });
    f.click();
  }
  function editJson() {
    var ta = el('textarea', { spellcheck: 'false' }); ta.value = JSON.stringify(stripped(), null, 1);
    var m = modal('Document complet du niveau (JSON)', el('div', {}, [el('p', { class: 'hint', text: 'Pour les réglages avancés : fond, zones, mécaniques, boss. Vérifié avant d’être appliqué.' }), ta]),
      [btn('Appliquer', function () {
        var d; try { d = JSON.parse(ta.value); } catch (e) { say('JSON invalide : ' + e.message, 'warn'); return; }
        var why = GP.Content.checkLevel(d, S.idx); if (why) { say('Refusé : ' + why, 'warn'); return; }
        S.doc = d; commit('JSON appliqué'); m.close();
      }, 'primary')]);
  }

  // ---------- Panneaux ----------
  function refreshTop() {
    var top = UI.top; top.textContent = '';
    top.appendChild(el('a', { href: 'index.html', class: 'btn', text: '← Jeu', style: 'text-decoration:none' }));
    var modeBtn = btn(S.mode === 'level' ? 'Textures' : 'Niveaux', function () { setMode(S.mode === 'level' ? 'tex' : 'level'); }, 'on', 'Basculer entre l’éditeur de niveaux et de textures');
    top.appendChild(modeBtn);
    top.appendChild(el('span', { class: 'sep' }));
    if (S.mode === 'tex') { top.appendChild(el('span', { class: 'hint', text: 'Éditeur de textures' })); return; }
    var sel = el('select', { 'aria-label': 'Niveau' });
    GZ_ORDER.forEach(function (id, i) {
      var o = el('option', { value: id, text: String(i + 1).padStart(2, '0') + ' · ' + (GP.GZONES[i] && GP.GZONES[i].nom || id) + (GP.Content.version(id) ? ' ✎' : '') }); if (id === S.id) o.selected = true; sel.appendChild(o);
    });
    sel.addEventListener('change', function () { load(sel.value); });
    top.appendChild(sel);
    top.appendChild(btn('↶', undo, '', 'Annuler (Ctrl+Z)')); top.appendChild(btn('↷', redo, '', 'Rétablir (Ctrl+Y)'));
    top.appendChild(el('span', { class: 'sep' }));
    var rep = S.report, chip = S.checking ? '… contrôle' : !rep ? 'Vérifier' : !reportFresh() ? 'Revérifier' : counts(rep).err ? '✖ ' + counts(rep).err + ' erreur(s)' : counts(rep).warn ? '⚠ ' + counts(rep).warn + ' avertissement(s)' : '✔ Faisable';
    var cb = btn(chip, function () { if (!S.checking) check(); }, rep && reportFresh() ? (counts(rep).err ? 'danger' : counts(rep).warn ? '' : 'on') : '', 'Simule un joueur du départ à l’arrivée (pixels, lanternes) et contrôle la cohérence du niveau');
    top.appendChild(cb);
    top.appendChild(btn('▶ Tester', test, '', 'Joue ce brouillon dans un nouvel onglet (rien n’est publié ni enregistré)'));
    top.appendChild(btn('Publier', publish, 'primary', 'Tous les joueurs jouent cette version'));
    top.appendChild(btn('Original', resetOriginal, 'danger', 'Revenir au niveau d’origine'));
    top.appendChild(btn('Historique', history));
    top.appendChild(el('span', { class: 'sep' }));
    top.appendChild(btn('JSON', editJson)); top.appendChild(btn('Importer', importJson)); top.appendChild(btn('Exporter', exportJson));
  }

  function setTool(t) { S.tool = t; if (S.scene) { S.scene.preview = null; S.scene.drawSel(); } refreshLeft(); }

  function refreshLeft() {
    var L = UI.left; if (S.mode !== 'level') return; L.textContent = '';
    L.appendChild(el('h3', { text: 'Outils' }));
    var tools = el('div', { class: 'row' });
    [['select', 'Sélection', 'V'], ['block', 'Bloc', 'B'], ['place', 'Poser', 'P'], ['erase', 'Gomme', 'X'], ['pan', 'Main', 'H']].forEach(function (t) {
      tools.appendChild(btn(t[1], function () { setTool(t[0]); }, S.tool === t[0] ? 'on' : '', 'Raccourci : ' + t[2]));
    });
    L.appendChild(tools);
    var snap = el('select', { 'aria-label': 'Pas' });
    [[1, 'Pas : 1 tuile'], [0.5, 'Pas : ½ tuile'], [0.25, 'Pas : ¼ tuile'], [0.125, 'Pas : ⅛ tuile'], [0, 'Pas : libre (1 px)']].forEach(function (o) { var op = el('option', { value: String(o[0]), text: o[1] }); if (o[0] === S.snap) op.selected = true; snap.appendChild(op); });
    snap.addEventListener('change', function () { S.snap = parseFloat(snap.value); refreshStatus(); });
    var row = el('div', { class: 'row' }, [snap, btn('Grille', function () { S.showGrid = !S.showGrid; if (S.scene) S.scene.drawGrid(); refreshLeft(); }, S.showGrid ? 'on' : '')]);
    L.appendChild(row);
    L.appendChild(el('div', { class: 'row' }, [btn('−', function () { S.scene.setZoom(S.scene.zoom * 0.8); }), btn('Tout voir', function () { S.scene.fit(); }), btn('+', function () { S.scene.setZoom(S.scene.zoom * 1.25); })]));
    L.appendChild(el('p', { class: 'hint', text: 'Molette : zoom · clic droit ou Espace : déplacer la vue · Suppr : effacer · Ctrl+D : dupliquer · flèches : ajuster.' }));
    L.appendChild(el('h3', { text: 'Calques' }));
    var lay = el('div', { class: 'layers' });
    LAYERS.forEach(function (l) {
      var cb = el('input', { type: 'checkbox' }); cb.checked = S.vis[l[0]] !== false;
      cb.addEventListener('change', function () { S.vis[l[0]] = cb.checked; });
      lay.appendChild(el('label', {}, [cb, l[1]]));
    });
    L.appendChild(lay);
    L.appendChild(el('h3', { text: 'Palette' }));
    var tabs = el('div', { class: 'tabs' });
    CATS.forEach(function (c) { tabs.appendChild(btn(c.label, function () { S.cat = c.k; S.brush = c.k === 'blocs' ? null : S.brush; S.tool = c.k === 'blocs' ? 'block' : 'place'; refreshLeft(); }, S.cat === c.k ? 'on' : '')); });
    L.appendChild(tabs);
    var pal = el('div', { class: 'palette' }); renderPalette(pal); L.appendChild(pal);
    if (S.cat !== 'blocs' && S.cat !== 'appuis' && S.cat !== 'pixels' && S.cat !== 'lanternes') {
      var search = el('input', { type: 'text', placeholder: 'Chercher un sprite…', value: S.search, style: 'width:100%;margin-top:6px' });
      search.addEventListener('input', function () { S.search = search.value; pal.textContent = ''; renderPalette(pal); });
      L.insertBefore(search, pal);
    }
  }
  function renderPalette(pal) {
    var cat = S.cat;
    if (cat === 'blocs') {
      var sel = el('select', { 'aria-label': 'Matériau', style: 'grid-column:1/-1' });
      materials().forEach(function (m) { var o = el('option', { value: m.k, text: m.label }); if (m.k === S.mat) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', function () { S.mat = sel.value; });
      pal.style.display = 'block'; pal.appendChild(sel); pal.appendChild(el('p', { class: 'hint', text: 'Glisse sur la grille pour tracer un bloc plein jusqu’au bas du niveau.' })); return;
    }
    pal.style.display = '';
    if (cat === 'appuis') {
      [['pont', 'Pont'], ['pad', 'Appui'], ['rampe', 'Rampe'], ['eau', 'Eau mortelle']].forEach(function (a) {
        var sw = el('div', { class: 'sw' + (S.brush === a[0] ? ' on' : ''), onclick: function () { S.brush = a[0]; S.tool = 'place'; refreshLeft(); } }, [el('span', { text: a[1] })]); sw.style.minHeight = '40px'; pal.appendChild(sw);
      }); return;
    }
    if (cat === 'pixels' || cat === 'lanternes') {
      pal.style.display = 'block'; pal.appendChild(el('p', { class: 'hint', text: cat === 'pixels' ? 'Clique dans le niveau pour poser un pixel (le nombre de pixels règle la photo reconstruite).' : 'Clique pour poser une lanterne (point de reprise).' }));
      S.brush = cat; return;
    }
    var q = S.search.toLowerCase(), f = FILTER[cat], list = allSprites().filter(function (s) {
      if (q && s.id.indexOf(q) < 0) return false;
      if (cat === 'panneaux') return /panneau|signes/.test(s.id);
      if (f && !S.all && !f.test(s.id)) return false;
      return true;
    }).slice(0, 260);
    list.forEach(function (s) {
      var sw = el('div', { class: 'sw' + (S.brush === s.id ? ' on' : ''), title: s.id + ' (' + s.w + '×' + s.h + ')', onclick: function () { S.brush = s.id; S.tool = 'place'; refreshLeft(); } }, [thumb(s.rows, s.w, s.h), el('span', { text: s.id })]);
      pal.appendChild(sw);
    });
    if (f) { var all = el('label', { class: 'hint', style: 'grid-column:1/-1' }, [el('input', { type: 'checkbox', onchange: function (e) { S.all = e.target.checked; refreshLeft(); } }), ' Afficher tous les sprites']); all.firstChild.checked = S.all; pal.appendChild(all); }
    if (!list.length) pal.appendChild(el('p', { class: 'hint', text: 'Aucun sprite.' }));
  }

  function field(label, input) { return [el('label', { text: label, title: label }), input]; }
  function numInput(obj, key, cb) {
    var i = el('input', { type: 'number', step: '0.125', value: String(obj[key]) });
    i.addEventListener('change', function () { var v = parseFloat(i.value); if (Number.isFinite(v)) { obj[key] = v; cb(); } else i.value = String(obj[key]); });
    return i;
  }
  /** Un champ de formulaire adapté à la valeur (nombre, texte, case à cocher, JSON pour les listes et objets). */
  function valueInput(obj, key) {
    var v = obj[key], i;
    if (typeof v === 'number') return numInput(obj, key, function () { commit(); });
    if (typeof v === 'boolean') { i = el('input', { type: 'checkbox' }); i.checked = v; i.addEventListener('change', function () { obj[key] = i.checked; commit(); }); return i; }
    if (typeof v === 'string') {
      i = el('input', { type: 'text', value: v });
      if (key === 'sprite' || /sprite/.test(key)) i.setAttribute('list', 'ed-sprites');
      i.addEventListener('change', function () { obj[key] = i.value; commit(); }); return i;
    }
    i = el('textarea', { spellcheck: 'false', style: 'min-height:44px' }); i.value = JSON.stringify(v);
    i.addEventListener('change', function () { try { obj[key] = JSON.parse(i.value); commit(); } catch (e) { say('JSON invalide pour « ' + key + ' ».', 'warn'); i.value = JSON.stringify(obj[key]); } });
    return i;
  }
  function refreshInspector() {
    var R = UI.right; if (S.mode !== 'level') return; R.textContent = '';
    var d = S.doc; if (!d) return;
    var dl = document.getElementById('ed-sprites');
    if (!dl) { dl = el('datalist', { id: 'ed-sprites' }); allSprites().forEach(function (s) { dl.appendChild(el('option', { value: s.id })); }); document.body.appendChild(dl); }
    var o = GP.EdGeom.get(d, S.sel);
    R.appendChild(el('h3', { text: o ? 'Objet sélectionné' : 'Aucune sélection' }));
    if (o) {
      R.appendChild(el('p', { class: 'hint', text: S.sel.list + (S.sel.i !== undefined ? ' · n° ' + S.sel.i : '') + (o.id !== undefined ? ' · id ' + o.id : '') }));
      var g = el('div', { class: 'grid2' });
      var keys = Object.keys(o), first = ['id', 'sprite', 'type', 'kind', 'x', 'y', 'w'];
      keys.sort(function (a, b) { var ia = first.indexOf(a), ib = first.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
      keys.forEach(function (k) { field(k, valueInput(o, k)).forEach(function (n) { g.appendChild(n); }); });
      R.appendChild(g);
      var add = el('div', { class: 'row' }), kk = el('input', { type: 'text', placeholder: 'propriété', style: 'width:96px' }), vv = el('input', { type: 'text', placeholder: 'valeur (JSON)', style: 'width:96px' });
      add.appendChild(kk); add.appendChild(vv);
      add.appendChild(btn('+', function () { if (!kk.value) return; var val; try { val = JSON.parse(vv.value); } catch (e) { val = vv.value; } o[kk.value] = val; commit(); }, '', 'Ajouter une propriété'));
      R.appendChild(add);
      R.appendChild(el('div', { class: 'row' }, [btn('Dupliquer', dupSel), btn('Supprimer', removeSel, 'danger')]));
    } else R.appendChild(el('p', { class: 'hint', text: 'Clique un objet du niveau pour modifier ses propriétés.' }));
    if (S.report) {
      R.appendChild(el('h3', { text: 'Contrôle' + (reportFresh() ? '' : ' (périmé)') }));
      var rl = el('div', { class: 'list', style: 'max-height:200px' });
      if (!S.report.issues.length) rl.appendChild(el('div', { text: '✔ Aucun problème. Faisable (' + S.report.solver.farthest + ' tuiles atteintes, ' + (S.report.ms / 1000).toFixed(1) + ' s).' }));
      S.report.issues.forEach(function (i) { rl.appendChild(el('div', { style: i.level === 'erreur' ? 'color:#f08a7a' : 'color:#e8c872', onclick: function () { goTo(i); } }, [el('span', { text: (i.level === 'erreur' ? '✖ ' : '⚠ ') + i.msg })])); });
      R.appendChild(rl);
    }
    R.appendChild(el('h3', { text: 'Niveau' }));
    var lg = el('div', { class: 'grid2' });
    var nom = el('input', { type: 'text', value: d.nom || '' }); nom.addEventListener('change', function () { d.nom = nom.value; commit(); refreshTop(); });
    field('nom', nom).forEach(function (n) { lg.appendChild(n); });
    ['largeur', 'hauteur', 'sol_y', 'temps_ref_s'].forEach(function (k) { if (typeof d[k] === 'number') field(k, numInput(d, k, function () { commit(); })).forEach(function (n) { lg.appendChild(n); }); });
    if (d.spawn) { field('départ x', numInput(d.spawn, 'x', commit)).concat(field('départ y', numInput(d.spawn, 'y', commit))).forEach(function (n) { lg.appendChild(n); }); }
    if (d.arrivee && d.arrivee.declencheur) { field('arrivée x', numInput(d.arrivee.declencheur, 'x', commit)).concat(field('arrivée y', numInput(d.arrivee.declencheur, 'y', commit))).forEach(function (n) { lg.appendChild(n); }); }
    R.appendChild(lg);
    var warn = []; if ((d.pixels || []).length < 1) warn.push('Il faut au moins un pixel.'); if (!(d.checkpoints || []).length) warn.push('Aucune lanterne : pas de point de reprise.');
    warn.forEach(function (w) { R.appendChild(el('p', { class: 'hint warn', style: 'color:#e8873a', text: '⚠ ' + w })); });
  }
  function refreshAll() { refreshTop(); refreshLeft(); refreshInspector(); refreshStatus(); }

  function setMode(m) {
    S.mode = m;
    document.getElementById('game').style.display = m === 'level' ? '' : 'none';
    document.getElementById('ed-tex').hidden = m === 'level';
    if (m === 'tex') GP.TexEd.mount(UI.left, UI.right, document.getElementById('ed-tex')); else { GP.TexEd.unmount(); if (S.scene) S.scene.scale.refresh(); refreshAll(); }
    refreshTop(); refreshStatus();
  }

  // ---------- Clavier ----------
  function onKey(ev) {
    var t = ev.target, typing = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    if (ev.key === ' ' && !typing) { S.space = ev.type === 'keydown'; if (S.mode === 'level') ev.preventDefault(); }
    if (ev.type !== 'keydown' || typing || S.mode !== 'level') return;
    var k = ev.key.toLowerCase(), mod = ev.ctrlKey || ev.metaKey;
    if (mod && k === 'z') { ev.preventDefault(); ev.shiftKey ? redo() : undo(); }
    else if (mod && k === 'y') { ev.preventDefault(); redo(); }
    else if (mod && k === 'd') { ev.preventDefault(); dupSel(); }
    else if (mod && k === 's') { ev.preventDefault(); saveDraft(); say('Brouillon enregistré.', 'ok'); }
    else if (k === 'delete' || k === 'backspace') { ev.preventDefault(); removeSel(); }
    else if (k === 'escape') { S.brush = null; setTool('select'); select(null); }
    else if (k === 'v') setTool('select'); else if (k === 'b') { S.cat = 'blocs'; setTool('block'); } else if (k === 'p') setTool('place');
    else if (k === 'x') setTool('erase'); else if (k === 'h') setTool('pan'); else if (k === 'g') { S.showGrid = !S.showGrid; S.scene.drawGrid(); refreshLeft(); }
    else if (k === '+' || k === '=') S.scene.setZoom(S.scene.zoom * 1.25); else if (k === '-') S.scene.setZoom(S.scene.zoom * 0.8);
    else if (k === 'f') S.scene.fit();
    else if (/^arrow/.test(k) && S.sel && S.sel.i !== undefined || (/^arrow/.test(k) && S.sel && (S.sel.list === 'spawn' || S.sel.list === 'arrivee'))) {
      ev.preventDefault();
      var step = ev.shiftKey ? 1 : (S.snap || 0.0625), dx = k === 'arrowleft' ? -step : k === 'arrowright' ? step : 0, dy = k === 'arrowup' ? -step : k === 'arrowdown' ? step : 0;
      if (GP.EdGeom.INTEGER[S.sel.list]) { dx = Math.round(dx) || (dx ? Math.sign(dx) : 0); dy = Math.round(dy) || (dy ? Math.sign(dy) : 0); }
      var o = GP.EdGeom.get(S.doc, S.sel), m = GP.EdGeom.moved(o, dx, dy);
      Object.keys(o).forEach(function (kk) { delete o[kk]; }); Object.assign(o, m); commit();
    }
  }

  var api = {
    get doc() { return S.doc; }, get id() { return S.id; }, get tool() { return S.tool; }, get snap() { return S.snap; }, get showGrid() { return S.showGrid; },
    get space() { return S.space; }, get sel() { return S.sel; }, set scene(v) { S.scene = v; }, get scene() { return S.scene; },
    set cursor(v) { S.cursor = v; }, get cursor() { return S.cursor; }, set buildError(v) { S.buildError = v; }, get buildError() { return S.buildError; },
    ids: IDS, order: GZ_ORDER, allSprites: allSprites, thumb: thumb, el: el, btn: btn, modal: modal, clone: clone, say: say,
    get online() { return S.online; }, get mode() { return S.mode; },
    check: check, guard: guard, get report() { return S.report; }, reportFresh: reportFresh, undo: undo, redo: redo, select: select, commit: commit, removeSel: removeSel, placeAt: placeAt, addBlock: addBlock, layerOn: layerOn, refreshStatus: refreshStatus,
    refreshAll: refreshAll, refreshLeft: refreshLeft, setMode: setMode,

    init: function (online) {
      S.online = online;
      UI.top = document.getElementById('ed-top'); UI.left = document.getElementById('ed-left'); UI.right = document.getElementById('ed-right'); UI.status = document.getElementById('ed-status');
      document.addEventListener('keydown', onKey); document.addEventListener('keyup', onKey);
      window.addEventListener('beforeunload', function (e) { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });
      var m = /[?&]level=([a-z-]+)/.exec(location.search), start = m && GZ_ORDER.indexOf(m[1]) >= 0 ? m[1] : GZ_ORDER[0];
      S.startId = start; refreshTop();
    },
    /** La scène Phaser est prête : on charge le niveau de départ. */
    sceneReady: function () { if (!S.doc) load(S.startId); else { S.scene.rebuild(); S.scene.fit(); } }
  };
  return api;
})();
