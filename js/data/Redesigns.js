/**
 * Redesigns (GP.Kit, GP.Redesigns) — les niveaux 2 à 12 redessinés (novembre 2026), construits avec une petite boîte à outils.
 *
 * Principe : une plateforme est un VRAI objet du lieu (arc-boutant, balcon, passerelle, conteneur, anneau…), pas un grand bloc de
 * pierre uni. Le décor est un sprite de la planche ; son « dessus » praticable est mesuré sur ses pixels (GP.Kit.segments) et devient
 * un appui à sens unique (type « pad », comme les topiaires et la serre du niveau 1). Les gros blocs ne servent qu'aux vrais murs et
 * au sol. Chaque objet est posé sur une surface (contrôlé par GP.Lint) et chaque niveau est contrôlé par GP.Solvability
 * (tools/solvability.cjs, bouton Vérifier de l'éditeur).
 *
 * GP.Redesigns[n] = propriétés qui remplacent celles du document importé (js/data/gzones.js) : voir GZoneLevels.redesign().
 */
GP.Kit = (function () {
  var T = 16, bySprite = null, cache = {};
  function sprite(id) {
    if (!bySprite) { bySprite = {}; Object.keys(GP.SPRITES || {}).forEach(function (k) { GP.SPRITES[k].forEach(function (s) { bySprite[s.id] = s; }); }); }
    return bySprite[id] || null;
  }
  /** Hauteur du dessus de chaque colonne de pixels (−1 si vide). */
  function tops(s) {
    var rows = s.frames_rows ? s.frames_rows[0] : s.rows, t = [];
    for (var x = 0; x < s.w; x++) { var y = 0; while (y < s.h && rows[y].charAt(x) === '.') y++; t.push(y >= s.h ? -1 : y); }
    return t;
  }
  /** Tronçons praticables du dessus d'un sprite : colonnes voisines dont le dessus varie d'un pixel au plus, au moins minW px de large. */
  function segments(id, minW) {
    var key = id + '|' + (minW || 6); if (cache[key]) return cache[key];
    var s = sprite(id), out = [];
    if (s) {
      var t = tops(s), x = 0;
      while (x < s.w) {
        if (t[x] < 0) { x++; continue; }
        var x1 = x, mn = t[x], mx = t[x];
        while (x1 + 1 < s.w && t[x1 + 1] >= 0 && Math.max(mx, t[x1 + 1]) - Math.min(mn, t[x1 + 1]) <= 1) { x1++; mn = Math.min(mn, t[x1]); mx = Math.max(mx, t[x1]); }
        if (x1 - x + 1 >= (minW || 6)) out.push({ x0: x, x1: x1 + 1, top: Math.round((mn + mx) / 2) });
        x = x1 + 1;
      }
    }
    return (cache[key] = out);
  }

  function Builder(cfg) {
    this.cfg = cfg; this.plat = []; this.decor = []; this.dang = []; this.enn = []; this.pix = []; this.chk = []; this.sig = []; this.zones = []; this.count = {};
  }
  Builder.prototype = {
    uid: function (p) { this.count[p] = (this.count[p] || 0) + 1; return p + this.count[p]; },
    /** Bloc plein de (x, y) jusqu'au bas du niveau (ou fill_to). mat : { top_sprite, fill_sprite, bas_sprite? }. */
    mass: function (x, y, w, mat, extra) { var o = Object.assign({ id: this.uid('m'), type: 'masse', x: x, y: y, w: w }, mat, extra || {}); this.plat.push(o); return o; },
    /** Sol sur toute la largeur donnée, au niveau du sol du niveau. */
    ground: function (x, w, mat, extra) { return this.mass(x, this.cfg.sol_y, w, mat, Object.assign({ note: 'sol' }, extra || {})); },
    /** Rangée de tuiles g/m/d traversable par le bas (corniche, balcon, passerelle, ponton, planches). set : [g, m, d]. */
    row: function (x, y, w, set, extra) { var o = Object.assign({ id: this.uid('r'), type: 'pont', x: x, y: y, w: w, sprite_set: set }, extra || {}); this.plat.push(o); return o; },
    /** Appui invisible (à sens unique) à (x, y), w tuiles de large, par-dessus un décor ou un fond. */
    pad: function (x, y, w, sur) { var o = { id: this.uid('pad'), type: 'pad', x: x, y: y, w: w, solid: 'top' }; if (sur) o.sur = sur; this.plat.push(o); return o; },
    /** Rampe de (x0, y0) à (x1, y1), pente de 45° au plus, en marches de 4 px. */
    ramp: function (x0, y0, x1, y1, mat, extra) { var o = Object.assign({ type: 'rampe', id: this.uid('rampe'), x0: x0, y0: y0, x1: x1, y1: y1 }, mat, extra || {}); this.plat.push(o); return o; },
    /** Colonne grimpable : chapiteau en y_top, fût jusqu'au sol. */
    column: function (x, yTop, sprites) { var o = Object.assign({ id: this.uid('col'), type: 'colonne', x: x, y_top: yTop, sol_y: this.cfg.sol_y, grab: true }, sprites); this.plat.push(o); return o; },
    /**
     * Décor posé en (x, y) : le sprite repose sur le bas de la case y (comme tous les objets). opts.pads : le dessus devient praticable
     * (appuis mesurés sur le sprite) ; opts.minW : largeur minimale d'un tronçon (px, 6 par défaut) ; opts.layer : 'sol' | 'inlay'.
     */
    deco: function (id, x, y, opts) {
      opts = opts || {};
      var s = sprite(id), o = { sprite: id, x: x, y: y }, self = this;
      if (opts.layer) o.layer = opts.layer;
      if (opts.pads) {
        o.id = opts.name || this.uid('d');
        var top = (y + 1) - (s ? s.h : 16) / T;
        segments(id, opts.minW).forEach(function (g, i) { self.pad(Math.round((x + g.x0 / T) * 1000) / 1000, Math.round((top + g.top / T) * 10000) / 10000, Math.round(((g.x1 - g.x0) / T) * 1000) / 1000, o.id).id = o.id + '_p' + i; });
      }
      this.decor.push(o); return o;
    },
    danger: function (id, x, y, kind, extra) { var o = Object.assign({ sprite: id, x: x, y: y, kind: kind || 'mortel' }, extra || {}); this.dang.push(o); return o; },
    water: function (x, w, y) { var o = { sprite: 'jardin_bassin_surface', x: x, y: y === undefined ? this.cfg.sol_y + 1 : y, w: w, kind: 'eau_mortelle', note: 'chute = retour checkpoint' }; this.dang.push(o); return o; },
    enemy: function (o) { this.enn.push(o); return o; },
    /** Oiseau qui vole 1,625 tuile au-dessus d'une surface : touche le joueur debout, passe au-dessus du joueur accroupi. */
    bird: function (id, x1, x2, surface, speed) { return this.enemy({ id: id, sprite: 'ciel_oiseau', type: 'patrouille_horizontale', x1: x1, x2: x2, y: surface - 1.625, vitesse: speed || 2.6, touche: 'debout', esquive: 'accroupi' }); },
    px: function (x, y, hard) { this.pix.push({ x: x, y: y, difficulte: hard ? 'risque' : 'facile' }); return this; },
    lantern: function (x, y) { this.chk.push({ x: x, y: y, sprite_off: 'commun_lanterne_eteinte', sprite_on: 'commun_lanterne_allumee' }); return this; },
    sign: function (x, y, text, sprite) { this.sig.push({ sprite: sprite || 'signes_panneau_saut', x: x, y: y, texte: text }); return this; },
    zone: function (nom, x0, x1) { this.zones.push({ n: this.zones.length + 1, nom: nom, x: [x0, x1] }); return this; },
    /** Propriétés à fusionner dans le document : identifiants, groupes de l'image et listes. */
    out: function (extra) {
      var n = this.pix.length, per = Math.ceil(n / 3);
      return Object.assign({
        plateformes: this.plat, dangers: this.dang, ennemis: this.enn, decor: this.decor, signes: this.sig, zones: this.zones,
        pixels: this.pix.map(function (p, i) { return Object.assign({ id: i + 1, sprite: 'commun_pixel', detail_image: Math.floor(i / per) + 1 }, p); }),
        checkpoints: this.chk.map(function (c, i) { return Object.assign({ id: i + 1 }, c); })
      }, extra || {});
    }
  };
  return { sprite: sprite, segments: segments, Builder: Builder };
})();

GP.Redesigns = {};

/**
 * 5 · Théâtre Graslin. Le niveau est un plan de tronçons (GP.LevelGen) : on apprend une chose à la fois, sur un sol qui ne change
 * de hauteur que par marches d'une tuile. Terrasses de café (rangées à 3 tuiles) → premier trou → bloc → perron (escalier) → tremplin
 * parasol → les huit colonnes (blocs de 3 tuiles, pointes) → oiseaux et pontons → le fronton.
 */
GP.Redesigns[5] = (function () {
  var THEME = {
    ground: { top_sprite: 'graslin_sol_haut_1', fill_sprite: 'graslin_sol_plein' },
    block: { top_sprite: 'graslin_sol_haut_2', fill_sprite: 'graslin_sol_plein' },
    rowSet: ['graslin_terrasse_cafe_g', 'graslin_terrasse_cafe_m', 'graslin_terrasse_cafe_d'],
    spikes: 'commun_pointes_fer_1', bounceSprite: 'graslin_parasol_cafe', monument: 'graslin_monument_graslin', signSprite: 'signes_panneau_saut',
    decor: ['graslin_table_cafe', 'graslin_lampadaire_ornemente', 'graslin_muse_statue', 'commun_fleur_jaune', 'commun_fleur_rouge'],
    signs: {
      row: 'Monte sur les terrasses de café pour attraper les pixels.', gap: 'Un trou : prends de l’élan et maintiens le saut.',
      block: 'Un obstacle plein : saute par-dessus.', up: 'Les marches du perron : saute de l’une à l’autre.', bounce: 'Saute sur un parasol : il te fait rebondir.',
      spikes: 'Les pointes piquent : saute par-dessus.', bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', stones: 'Les pontons te portent : saute de l’un à l’autre.',
      wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.', fin: 'Franchis l’arche sous le fronton pour terminer.'
    }
  };
  return GP.LevelGen.generate({
    num: 5, largeur: 224, hauteur: 22, groundY: 16, seed: 5, theme: THEME, pixels: 24, tempsRef: 105,
    plan: [
      ['mark', 'Les Terrasses de Café'], ['rest', 8], ['row', 7, 3], ['rest', 4], ['gap', 3], ['block', 1], ['rest', 5, 'lantern'],
      ['mark', 'Le Grand Perron'], ['up', 4], ['rest', 4], ['block', 2], ['up', 3], ['rest', 3], ['bounce'], ['rest', 5, 'lantern'],
      ['mark', 'Les Huit Colonnes'], ['spikes', 2], ['block', 3], ['spikes', 3], ['block', 3, 2], ['gap', 4], ['rest', 4, 'lantern'],
      ['mark', 'Les Muses et les Lustres'], ['bird', 6], ['stones', 10], ['rest', 4, 'lantern'], ['spikes', 3], ['bird', 7], ['row', 6, 3], ['rest', 4],
      ['mark', 'Le Fronton'], ['down', 3], ['rest', 5, 'lantern'], ['gap', 3], ['block', 2], ['rest', 6]
    ]
  });
})();
