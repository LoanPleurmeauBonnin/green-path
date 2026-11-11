/**
 * Lint (GP.Lint) — contrôle de cohérence d'un niveau (document GZone), sans simulation : objets qui flottent, sortent du niveau ou
 * se chevauchent, départ ou pixels dans la matière, danger sans panneau avant sa première rencontre, lanternes trop espacées.
 * Il complète GP.Solvability (qui répond à « le niveau est-il finissable ? ») par « le niveau est-il lisible et cohérent ? ».
 *   GP.Lint.check(d) → [{ level: 'erreur' | 'avertissement', code, msg, list?, i?, x?, y? }]
 * Partagé par l'éditeur (bouton Vérifier, garde-fou de publication) et par tests/editor.test.js.
 */
GP.Lint = (function () {
  var T = 16;
  var sizes = null;
  /** Taille d'un sprite en pixels (16×16 si inconnu). */
  function size(id) {
    if (!sizes) { sizes = {}; Object.keys(GP.SPRITES || {}).forEach(function (sh) { GP.SPRITES[sh].forEach(function (s) { sizes[s.id] = { w: s.w, h: s.h }; }); }); }
    return sizes[id] || { w: T, h: T };
  }
  // objets qui ne reposent pas sur le sol : ciel, suspendus, incrustés, ambiance
  var FLOATING_OK = /ciel_|lustre|banderole|drapeau|suspen|guirlande|fenetre|vitrail|rosace|papillon|oiseau|mouette|anneau|courant|vapeur|fumee|nuage|pixel|lune|soleil|etoile|enseigne|horloge|cloche|lanterne_haute|arche|cable|chaine|grue_fleche/i;

  /** Les surfaces portantes (haut des blocs, ponts, appuis, colonnes, rampes) : { x0, x1, y } en tuiles. */
  function surfaces(d) {
    var out = [];
    (d.plateformes || []).forEach(function (p) {
      if (p.type === 'masse') { if (!p.fond && !p.pilier) out.push({ x0: p.x, x1: p.x + (p.w || 1), y: p.y }); }
      else if (p.type === 'rampe') { var n = Math.max(1, Math.round(p.x1 - p.x0)); for (var i = 0; i < n; i++) out.push({ x0: p.x0 + i, x1: p.x0 + i + 1, y: p.y0 + (p.y1 - p.y0) * (i + 0.5) / n }); }
      else if (p.type === 'colonne') out.push({ x0: p.x, x1: p.x + 2, y: p.y_top });
      else if (p.type && typeof p.y === 'number') out.push({ x0: p.x, x1: p.x + (p.w || 1), y: p.y });
    });
    (d.mobiles || []).forEach(function (m) { out.push({ x0: Math.min(m.x1, m.x2 === undefined ? m.x1 : m.x2), x1: Math.max(m.x1, m.x2 === undefined ? m.x1 : m.x2) + (m.w || 2), y: m.y1 }); out.push({ x0: m.x1, x1: m.x1 + (m.w || 2), y: m.y2 === undefined ? m.y1 : m.y2 }); });
    // un appui posé sur un décor (dôme, serre…) porte les objets du même décor
    return out;
  }
  function supported(sf, x0, x1, bottomY) {
    return sf.some(function (s) { return x1 > s.x0 + 0.01 && x0 < s.x1 - 0.01 && Math.abs(s.y - bottomY) <= 0.55; });
  }
  /** Vrai si le point (tx, ty) est dans la matière d'un bloc plein. */
  function inSolid(d, tx, ty) {
    return (d.plateformes || []).some(function (p) {
      if (p.type !== 'masse' || p.fond || p.pilier) return false;
      var bottom = p.fill_to !== undefined ? p.fill_to : (p.to !== undefined ? p.to : d.hauteur);
      return tx >= p.x && tx < p.x + (p.w || 1) && ty > p.y + 0.05 && ty < bottom;
    });
  }

  function check(d) {
    var out = [], sf = surfaces(d), W = d.largeur, H = d.hauteur;
    function add(level, code, msg, list, i, o) { out.push({ level: level, code: code, msg: msg, list: list, i: i, x: o && (o.x !== undefined ? o.x : o.x1), y: o && (o.y !== undefined ? o.y : o.y1) }); }

    // départ et arrivée
    if (!d.spawn) add('erreur', 'depart', 'Départ manquant.');
    else {
      if (inSolid(d, d.spawn.x + 0.5, d.spawn.y + 0.5)) add('erreur', 'depart-solide', 'Le départ est dans la matière.', 'spawn', undefined, d.spawn);
      if (!supported(sf, d.spawn.x, d.spawn.x + 1, d.spawn.y + 1) && !supported(sf, d.spawn.x, d.spawn.x + 1, d.spawn.y + 2) && !supported(sf, d.spawn.x, d.spawn.x + 1, d.spawn.y + 3))
        add('erreur', 'depart-vide', 'Le départ n’a pas de sol dans les trois tuiles dessous.', 'spawn', undefined, d.spawn);
    }
    if (!d.arrivee || !d.arrivee.declencheur) add('erreur', 'arrivee', 'Arrivée manquante.');

    // listes d'objets : dans le niveau, hors matière, posés sur une surface
    [['pixels', 'pixel'], ['checkpoints', 'lanterne'], ['signes', 'panneau'], ['dangers', 'danger'], ['decor', 'décor'], ['ennemis', 'ennemi']].forEach(function (pair) {
      (d[pair[0]] || []).forEach(function (o, i) {
        var x = o.x !== undefined ? o.x : o.x1, y = o.y !== undefined ? o.y : o.y1;
        if (typeof x !== 'number' || typeof y !== 'number') return;
        var s = size(o.sprite || o.sprite_off), w = Math.max(1, (o.w || s.w / T));
        if (x < 0 || y < 0 || x + 0.01 >= W || y > H) { add('erreur', 'hors', 'Un ' + pair[1] + ' est hors du niveau (x ' + x + ', y ' + y + ').', pair[0], i, o); return; }
        if (pair[0] === 'pixels' && inSolid(d, x + 0.5, y + 0.5)) add('erreur', 'pixel-solide', 'Un pixel est dans la matière (x ' + x + ', y ' + y + ').', pair[0], i, o);
        if ((pair[0] === 'checkpoints' || pair[0] === 'dangers') && o.kind !== 'eau_mortelle' && inSolid(d, x + 0.5, y + 0.5)) add('erreur', 'objet-solide', 'Un ' + pair[1] + ' est dans la matière (x ' + x + ', y ' + y + ').', pair[0], i, o);
        // flottants : lanternes, panneaux, dangers au sol et décors qui ne sont pas suspendus
        var grounded = pair[0] === 'checkpoints' || pair[0] === 'signes' || (pair[0] === 'dangers' && o.kind !== 'eau_mortelle' && o.kind !== 'cyclique') || pair[0] === 'decor';
        if (grounded && o.layer !== 'inlay' && !FLOATING_OK.test(o.sprite || '') && o.kind !== 'eau_mortelle') {
          var ok = supported(sf, x, x + w, y + 1) || supported(sf, x, x + w, y + 1.5) || supported(sf, x, x + w, y + 0.5);
          // posé sur un autre décor du même plan (banc sur un perron, objet sur un appui) : accepté si un appui existe sous le décor
          if (!ok) add('avertissement', 'flottant', 'Un ' + pair[1] + ' semble flotter : rien ne le porte (x ' + x + ', y ' + y + ', ' + (o.sprite || '') + ').', pair[0], i, o);
        }
      });
    });

    // décors qui se chevauchent
    var rects = (d.decor || []).map(function (o, i) {
      var s = size(o.sprite); return { i: i, o: o, x: o.x * T, y: (o.y + 1) * T - s.h, w: s.w, h: s.h, layer: o.layer || '' };
    });
    var reported = 0;
    for (var a = 0; a < rects.length && reported < 12; a++) for (var b = a + 1; b < rects.length && reported < 12; b++) {
      var A = rects[a], B = rects[b]; if (A.layer !== B.layer) continue;
      var ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x), oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ox > 0 && oy > 0 && ox * oy > 0.45 * Math.min(A.w * A.h, B.w * B.h)) { add('avertissement', 'chevauche', 'Deux décors se chevauchent (' + A.o.sprite + ' et ' + B.o.sprite + ', x ' + A.o.x + ').', 'decor', a, A.o); reported++; }
    }

    // blocs doublés
    var masses = (d.plateformes || []).filter(function (p) { return p.type === 'masse' && !p.fond; });
    masses.forEach(function (p, i) {
      for (var j = i + 1; j < masses.length; j++) { var q = masses[j]; if (q.x < p.x + (p.w || 1) && p.x < q.x + (q.w || 1) && q.y === p.y) { add('avertissement', 'bloc-double', 'Deux blocs se superposent à x ' + Math.max(p.x, q.x) + ', y ' + p.y + '.', 'plateformes', d.plateformes.indexOf(q), q); break; } }
    });

    // un panneau avant la première rencontre de chaque danger ou ennemi
    var firsts = {};
    (d.dangers || []).concat((d.ennemis || []).filter(function (e) { return !e.inoffensif && e.type !== 'ambiance'; })).forEach(function (h) {
      var x = h.x !== undefined ? h.x : h.x1, key = (h.sprite || '') + '|' + (h.kind || h.type || '');
      if (h.kind === 'eau_mortelle') key = 'eau';
      if (firsts[key] === undefined || x < firsts[key].x) firsts[key] = { x: x, h: h };
    });
    Object.keys(firsts).forEach(function (k) {
      var f = firsts[k], x = f.x;
      if (!(d.signes || []).some(function (s) { return s.x <= x + 0.5 && x - s.x <= 12; })) add('avertissement', 'sans-panneau', 'Aucun panneau avant la première rencontre de « ' + (f.h.sprite || k) + ' » (x ' + x + ').', f.h.type ? 'ennemis' : 'dangers', undefined, f.h);
    });

    // lanternes : trop espacées
    var stops = [d.spawn ? d.spawn.x : 0].concat((d.checkpoints || []).map(function (c) { return c.x; }), [d.arrivee && d.arrivee.declencheur ? d.arrivee.declencheur.x : W]).sort(function (p, q) { return p - q; });
    for (var s = 1; s < stops.length; s++) if (stops[s] - stops[s - 1] > 60) add('avertissement', 'lanternes', 'Plus de 60 tuiles sans lanterne entre x ' + stops[s - 1] + ' et x ' + stops[s] + '.');
    if (!(d.checkpoints || []).length) add('avertissement', 'sans-lanterne', 'Aucune lanterne : pas de point de reprise.');
    if ((d.pixels || []).length < 1) add('erreur', 'sans-pixel', 'Il faut au moins un pixel.');
    return out;
  }

  return { check: check, surfaces: surfaces, size: size };
})();
