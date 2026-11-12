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
    num: 5, largeur: 'auto', hauteur: 22, groundY: 16, seed: 5, intensity: 1.0, theme: THEME, pixels: 24, tempsRef: 105,
    plan: [
      ['mark', 'Les Terrasses de Café'], ['rest', 8], ['row', 7, 3], ['rest', 4], ['gap', 3], ['block', 1], ['rest', 5, 'lantern'],
      ['mark', 'Le Grand Perron'], ['up', 4], ['rest', 4], ['block', 2], ['up', 3], ['rest', 3], ['bounce'], ['rest', 5, 'lantern'],
      ['mark', 'Les Huit Colonnes'], ['spikes', 2], ['block', 3], ['spikes', 3], ['block', 3, 2], ['gap', 4], ['rest', 4, 'lantern'],
      ['mark', 'Les Muses et les Lustres'], ['bird', 6], ['stones', 10], ['rest', 4, 'lantern'], ['spikes', 3], ['bird', 7], ['row', 6, 3], ['rest', 4],
      ['mark', 'Le Fronton'], ['down', 3], ['rest', 5, 'lantern'], ['gap', 3], ['block', 2], ['rest', 6]
    ]
  });
})();

/* ---------------------------------------------------------------------------------------------------------------------------
 * Niveaux 2, 4, 6 à 12 : mêmes règles que Graslin (GP.LevelGen), un thème par lieu. Les arènes des boss (6, 9, 12) sont conservées
 * à partir de leur abscisse d'entrée (tail) : le plan y arrive à la même hauteur de sol.
 * ------------------------------------------------------------------------------------------------------------------------- */
(function () {
  var BASE = {};
  GP.GZONES.forEach(function (d) { BASE[d.num] = d; });
  function S(text) { return text; }
  function themeOf(o) { return Object.assign({ signSprite: 'signes_panneau_saut', block: o.ground }, o); }

  // 2 · Cathédrale : parvis, nef (accroche, colonnes), galeries, toits (gargouilles), terrasse de la rosace
  GP.Redesigns[2] = GP.LevelGen.generate({
    num: 2, largeur: 'auto', hauteur: 25, groundY: 20, seed: 2, intensity: 0.4, pixels: 18, tempsRef: 90,
    theme: themeOf({
      ground: { top_sprite: 'cathedrale_pierre_haut', fill_sprite: 'cathedrale_pierre_blanche_pleine_2' },
      rowSet: ['cathedrale_corniche_g', 'cathedrale_corniche_m', 'cathedrale_corniche_d'], spikes: 'cathedrale_pointes_pierre_1', spout: 'cathedrale_gargouille',
      col: { chap: 'cathedrale_colonne_chapiteau', fut: 'cathedrale_colonne_fut', base: 'cathedrale_colonne_base' }, monument: BASE[2].arrivee.monument.sprite,
      decor: ['cathedrale_statue_niche', 'cathedrale_pinacle', 'cathedrale_clocheton'],
      signs: { up: 'Les marches du parvis : saute de l’une à l’autre.', wall: 'Maintiens ↑ près d’un rebord en l’air pour t’y accrocher et grimper !', column: 'Maintiens ↑ contre une colonne pour y grimper.',
        spikes: 'Les pointes piquent : saute par-dessus.', row: 'Les corniches te portent : saute dessus pour attraper les pixels.', gap: 'Un trou : prends de l’élan et maintiens le saut.',
        bird: 'Les pigeons volent bas : maintiens ↓ pour passer dessous.', spout: 'La gargouille crache : passe entre deux jets.', block: 'Un obstacle plein : saute par-dessus.', fin: 'Franchis l’arche sur la terrasse de la tour.' }
    }),
    plan: [
      ['mark', 'Le Parvis'], ['rest', 8], ['up', 2], ['rest', 4],
      ['mark', 'La Nef : colonnes et cierges'], ['wall'], ['rest', 3], ['column', 5], ['rest', 4, 'lantern'], ['spikes', 2], ['column', 6], ['rest', 5, 'lantern'],
      ['mark', 'La Galerie des Vitraux'], ['row', 7, 3], ['rest', 3], ['gap', 3], ['bird', 6], ['rest', 4, 'lantern'], ['spikes', 3], ['row', 6, 3],
      ['mark', 'Les Toits et Gargouilles'], ['up', 3], ['spout', 7], ['rest', 4], ['gap', 4], ['spout', 7], ['rest', 4, 'lantern'],
      ['mark', 'La Terrasse de la Rosace'], ['bird', 5], ['block', 3], ['rest', 6]
    ]
  });

  // 4 · Île Feydeau : quai, hôtels et balcons penchés, traversée des gabares, proue de pierre
  GP.Redesigns[4] = GP.LevelGen.generate({
    num: 4, largeur: 'auto', hauteur: 18, groundY: 13, seed: 4, intensity: 0.8, pixels: 20, tempsRef: 95,
    theme: themeOf({
      ground: { top_sprite: 'feydeau_sol_haut_1', fill_sprite: 'feydeau_sol_plein' },
      rowSet: ['feydeau_balcon_fer_g', 'feydeau_balcon_fer_m', 'feydeau_balcon_fer_d'], spikes: 'feydeau_obstacle_ancre_pointes', monument: BASE[4].arrivee.monument.sprite,
      decor: ['feydeau_bollard', 'feydeau_ancre', 'feydeau_bollard'], decorFond: ['feydeau_hotel_armateur_a', 'feydeau_hotel_armateur_b_penchee'],
      signs: { slide: 'Les balcons penchés te font glisser : saute dans le sens de la pente pour aller plus loin.', spikes: 'Les pointes piquent : saute par-dessus.',
        gap: 'Un bras de Loire : prends de l’élan et maintiens le saut.', bird: 'Les mouettes rasent les quais : maintiens ↓ pour passer dessous.',
        boats: 'Les bateaux s’enfoncent : ne reste pas immobile.', row: 'Les balcons te portent : saute dessus.', up: 'Les marches de la proue : saute de l’une à l’autre.', block: 'Un obstacle plein : saute par-dessus.', fin: 'Franchis l’arche au bout de la proue.' }
    }),
    plan: [
      ['mark', 'Le Quai Turenne'], ['rest', 10], ['slide', 5, 1], ['rest', 4], ['spikes', 2], ['rest', 4], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'Les Hôtels d’Armateurs'], ['slide', 5, -1], ['gap', 4], ['slide', 6, 1], ['bird', 6], ['rest', 4, 'lantern'],
      ['mark', 'La Traversée des Gabares'], ['boats', 15], ['rest', 4], ['boats', 15], ['rest', 4, 'lantern'],
      ['mark', 'La Cour du Temple du Goût'], ['row', 6, 3], ['block', 2], ['boats', 15], ['spikes', 2], ['rest', 4, 'lantern'],
      ['mark', 'La Proue de Pierre'], ['up', 3], ['spikes', 3], ['gap', 3], ['bird', 6], ['rest', 6]
    ]
  });

  // 6 · Machines de l'Île : tuyaux et vapeur, passerelles, horlogerie ; arène du Grand Éléphant conservée à partir de x = 160
  GP.Redesigns[6] = GP.LevelGen.generate({
    num: 6, largeur: 210, hauteur: 20, groundY: 18, seed: 6, intensity: 1.3, pixels: 14, tempsRef: 110, tail: { doc: BASE[6], from: 160 },
    theme: themeOf({
      ground: { top_sprite: 'machines_sol_haut_1', fill_sprite: 'machines_sol_plein' }, rowSet: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d'],
      spikes: 'machines_obstacle_engrenage_dents', monument: BASE[6].arrivee.monument.sprite, decor: ['machines_engrenage_petit', 'machines_tuyau_cuivre', 'machines_charpente_module'],
      signs: { gap: 'Un bassin : prends de l’élan et maintiens le saut.', block: 'Un bloc de fonte : saute par-dessus.', steam: 'La vapeur jaillit par intermittence : passe quand elle retombe.',
        row: 'Les passerelles te portent : saute dessus.', spikes: 'Les dents des engrenages piquent : saute par-dessus.', bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', up: 'Les marches de fonte : saute de l’une à l’autre.', stones: 'Les engrenages te portent : saute de l’un à l’autre.' }
    }),
    plan: [
      ['mark', 'Le Parvis des Nefs'], ['rest', 10], ['block', 1], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'La Galerie des Tuyaux'], ['steam'], ['rest', 3], ['row', 6, 3], ['steam'], ['spikes', 2], ['rest', 4, 'lantern'],
      ['mark', 'L’Horlogerie Géante'], ['stones', 9], ['rest', 4, 'lantern'], ['block', 2], ['bird', 6], ['spikes', 3], ['steam'], ['up', 2], ['rest', 4, 'lantern'],
      ['mark', 'La Passerelle d’Embarquement'], ['row', 6, 3], ['gap', 3], ['spikes', 2], ['padTo', 160],
      ['mark', 'Arène du Grand Éléphant']
    ]
  });

  // 7 · Chantiers navals : friche et rails, cales de lancement, pylônes de la grue
  GP.Redesigns[7] = GP.LevelGen.generate({
    num: 7, largeur: 'auto', hauteur: 21, groundY: 16, seed: 7, intensity: 1.6, pixels: 24, tempsRef: 105,
    theme: themeOf({
      ground: { top_sprite: 'chantiers_sol_pelouse_haut_1', fill_sprite: 'chantiers_sol_plein' }, rowSet: ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d'],
      spikes: 'chantiers_obstacle_ferraille', monument: BASE[7].arrivee.monument.sprite, decor: ['chantiers_toles_empilees', 'chantiers_buisson_friche', 'chantiers_poteau_amarrage'],
      signs: { gap: 'Une cale de lancement : prends de l’élan et maintiens le saut.', spikes: 'La ferraille coupe : saute par-dessus.', row: 'Les tôles te portent : saute dessus.', bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.',
        steam: 'La vapeur jaillit par intermittence : passe quand elle retombe.', block: 'Un tas de tôles : saute par-dessus.', up: 'Les marches du belvédère : saute de l’une à l’autre.', stones: 'Les pontons te portent : saute de l’un à l’autre.', wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.' }
    }),
    plan: [
      ['mark', 'La Friche et les Rails'], ['rest', 10], ['spikes', 2], ['rest', 3], ['row', 6, 3], ['block', 1], ['rest', 4, 'lantern'],
      ['mark', 'Les Cales de Lancement'], ['gap', 3], ['bird', 6], ['stones', 10], ['spikes', 3], ['rest', 4, 'lantern'],
      ['mark', 'Les Pylônes de la Grue'], ['wall'], ['up', 3], ['row', 7, 3], ['block', 3], ['steam'], ['rest', 4, 'lantern'],
      ['mark', 'La Flèche de la Grue'], ['bird', 7], ['row', 6, 3], ['gap', 4], ['spikes', 3], ['block', 2], ['rest', 4, 'lantern'],
      ['mark', 'Le Belvédère de la Proue'], ['up', 3], ['spikes', 2], ['gap', 3], ['rest', 6]
    ]
  });

  // 8 · Anneaux de Buren : quai aligné, passerelles d'inox, chaîne d'anneaux, perspective, grand envol
  GP.Redesigns[8] = GP.LevelGen.generate({
    num: 8, largeur: 'auto', hauteur: 18, groundY: 13, seed: 8, intensity: 1.9, pixels: 25, tempsRef: 100,
    theme: themeOf({
      ground: { top_sprite: 'buren_sol_haut_1', fill_sprite: 'buren_sol_plein' }, rowSet: ['buren_passerelle_inox_g', 'buren_passerelle_inox_m', 'buren_passerelle_inox_d'],
      spikes: 'buren_obstacle_bornes_pointes', monument: BASE[8].arrivee.monument.sprite, decor: ['buren_borne', 'buren_banc_quai', 'buren_garde_corps_quai'],
      signs: { spikes: 'Les bornes piquent : saute par-dessus.', row: 'Les passerelles d’inox te portent : saute dessus.', gap: 'Un trou : prends de l’élan et maintiens le saut.', ring: 'Un grand trou : traverse l’anneau rouge pour être propulsé vers l’avant.',
        bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', block: 'Un obstacle plein : saute par-dessus.', up: 'Les marches du quai : saute de l’une à l’autre.', stones: 'Les pontons te portent : saute de l’un à l’autre.' }
    }),
    plan: [
      ['mark', 'L’Alignement du Quai'], ['rest', 10], ['spikes', 2], ['rest', 3], ['block', 1], ['spikes', 2], ['rest', 4, 'lantern'],
      ['mark', 'Les Passerelles d’Inox'], ['row', 7, 3], ['gap', 3], ['row', 6, 3], ['bird', 6], ['rest', 4, 'lantern'],
      ['mark', 'La Chaîne d’Anneaux'], ['ring', 8], ['rest', 4, 'lantern'], ['spikes', 3], ['ring', 8], ['rest', 3], ['block', 2], ['ring', 9], ['rest', 4, 'lantern'],
      ['mark', 'La Perspective Nocturne'], ['stones', 10], ['bird', 7], ['spikes', 3], ['ring', 8], ['rest', 4, 'lantern'],
      ['mark', 'Le Grand Envol'], ['up', 3], ['spikes', 2], ['ring', 9], ['rest', 3], ['gap', 4], ['rest', 6]
    ]
  });

  // 9 · Hangar à bananes : terrasse, dock aux conteneurs, portes coulissantes, chaîne de levage ; arène de la Mûrisserie à partir de x = 175
  GP.Redesigns[9] = GP.LevelGen.generate({
    num: 9, largeur: 230, hauteur: 22, groundY: 19, seed: 9, intensity: 2.2, pixels: 16, tempsRef: 120, tail: { doc: BASE[9], from: 175 },
    theme: themeOf({
      ground: { top_sprite: 'hangar_sol_haut_1', fill_sprite: 'hangar_sol_plein' }, rowSet: ['hangar_terrasse_bois_g', 'hangar_terrasse_bois_m', 'hangar_terrasse_bois_d'],
      spikes: 'hangar_obstacle_tole_coupante', monument: BASE[9].arrivee.monument.sprite, decor: ['hangar_palettes_caisses', 'hangar_conteneur_bleu', 'hangar_conteneur_rouge'],
      signs: { spikes: 'La tôle coupe : saute par-dessus.', row: 'Les terrasses de bois te portent : saute dessus.', block: 'Un conteneur : saute par-dessus.', door: 'La porte se ferme par intermittence : passe quand elle est ouverte, ou accroupi quand elle est basse.',
        bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', gap: 'Un quai coupé : prends de l’élan et maintiens le saut.', wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.', up: 'Les marches du dock : saute de l’une à l’autre.', stones: 'Les pontons te portent : saute de l’un à l’autre.' }
    }),
    plan: [
      ['mark', 'La Terrasse et les Guirlandes'], ['rest', 10], ['spikes', 2], ['row', 6, 3], ['block', 1], ['rest', 4, 'lantern'],
      ['mark', 'Le Dock aux Conteneurs'], ['block', 2], ['spikes', 3], ['wall'], ['bird', 6], ['block', 3], ['rest', 4, 'lantern'],
      ['mark', 'Les Portes Coulissantes'], ['door'], ['spikes', 2], ['door'], ['row', 6, 3], ['door'], ['rest', 4, 'lantern'],
      ['mark', 'La Chaîne de Levage'], ['gap', 3], ['spikes', 3], ['stones', 10], ['block', 2], ['bird', 6], ['padTo', 175],
      ['mark', 'Arène de la Mûrisserie']
    ]
  });

  // 10 · Passage Pommeraye : galerie, grand escalier, mezzanine et colonnes, sous la verrière, galerie supérieure (intérieur : pas de trou)
  GP.Redesigns[10] = GP.LevelGen.generate({
    num: 10, largeur: 'auto', hauteur: 26, groundY: 22, seed: 10, intensity: 2.4, pixels: 26, tempsRef: 105,
    theme: themeOf({
      ground: { top_sprite: 'pommeraye_sol_haut_1', fill_sprite: 'pommeraye_sol_plein' }, rowSet: ['pommeraye_balcon_galerie_g', 'pommeraye_balcon_galerie_m', 'pommeraye_balcon_galerie_d'],
      spikes: 'pommeraye_obstacle_grille_pointes', monument: BASE[10].arrivee.monument.sprite, decor: ['pommeraye_statue', 'pommeraye_devanture_a', 'pommeraye_devanture_b', 'pommeraye_pilier_galerie'],
      signs: { spikes: 'Les grilles piquent : saute par-dessus.', row: 'Les balcons de la galerie te portent : saute dessus.', block: 'Une marche haute : saute par-dessus.', up: 'Le grand escalier : saute de marche en marche.',
        bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.', gap: 'Un vide dans la galerie : prends de l’élan et maintiens le saut.' }
    }),
    plan: [
      ['mark', 'La Galerie Inférieure'], ['rest', 10], ['spikes', 2], ['block', 1], ['rest', 4, 'lantern'],
      ['mark', 'Le Grand Escalier'], ['up', 4], ['spikes', 2], ['up', 4], ['rest', 4, 'lantern'],
      ['mark', 'La Mezzanine et les Colonnes'], ['row', 7, 3], ['block', 2], ['bird', 6], ['wall'], ['spikes', 3], ['rest', 4, 'lantern'],
      ['mark', 'Sous la Grande Verrière'], ['row', 6, 3], ['block', 3], ['bird', 7], ['spikes', 3], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'La Galerie Supérieure'], ['up', 2], ['spikes', 2], ['block', 2], ['rest', 6]
    ]
  });

  // 11 · Mémorial : esplanade, descente vers le parvis, couloir des plaques, traversée des cinq bassins, remontée (peu de dangers : recueillement)
  GP.Redesigns[11] = GP.LevelGen.generate({
    num: 11, largeur: 'auto', hauteur: 18, groundY: 11, seed: 11, intensity: 0.6, pixels: 25, tempsRef: 115,
    theme: themeOf({
      ground: { top_sprite: 'memorial_sol_haut_1', fill_sprite: 'memorial_sol_plein' }, rowSet: ['memorial_passerelle_metal_g', 'memorial_passerelle_metal_m', 'memorial_passerelle_metal_d'],
      spikes: 'memorial_obstacle_flaque_profonde', monument: BASE[11].arrivee.monument.sprite, decor: ['memorial_stele_gravee', 'memorial_banc_beton', 'memorial_lampadaire_sobre'],
      signs: { tide: 'La marée recouvre le sol par moments : avance quand elle est basse.', gap: 'Un bassin : prends de l’élan et maintiens le saut.', row: 'Les passerelles te portent : saute dessus.', block: 'Une stèle basse : saute par-dessus.',
        up: 'Les marches de béton : saute de l’une à l’autre.', stones: 'Les passerelles flottent sur l’eau : saute de l’une à l’autre.' }
    }),
    plan: [
      ['mark', 'L’Esplanade du Quai de la Fosse'], ['rest', 12], ['row', 6, 3], ['block', 1], ['rest', 4, 'lantern'],
      ['mark', 'La Descente vers le Parvis'], ['down', 4], ['tide', 6], ['rest', 4], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'Le Couloir des Plaques'], ['row', 7, 3], ['tide', 8], ['block', 2], ['row', 6, 3], ['rest', 4, 'lantern'],
      ['mark', 'La Traversée des Cinq Bassins'], ['stones', 9], ['rest', 3], ['stones', 9], ['tide', 6], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'La Remontée vers la Lumière'], ['up', 4], ['row', 6, 3], ['block', 2], ['rest', 6]
    ]
  });

  // 12 · Tour LU : quai, fours et horloge, galerie des renommées, soufflerie du dôme (ascension) ; arène du boss final à partir de x = 195
  var P12 = BASE[12].tuiles.pierre;
  GP.Redesigns[12] = GP.LevelGen.generate({
    num: 12, largeur: 260, hauteur: 28, groundY: 25, seed: 12, intensity: 3.0, pixels: 22, tempsRef: 150, tail: { doc: BASE[12], from: 195 },
    theme: themeOf({
      ground: { top_sprite: P12.haut[0], fill_sprite: P12.plein[0] }, rowSet: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d'],
      spikes: 'commun_pointes_fer_1', monument: BASE[12].arrivee.monument.sprite, decor: ['commun_lanterne_eteinte', 'machines_engrenage_petit', 'machines_tuyau_cuivre'].slice(1),
      signs: { spikes: 'Les pointes piquent : saute par-dessus.', row: 'Les passerelles te portent : saute dessus.', block: 'Un obstacle plein : saute par-dessus.', steam: 'La vapeur jaillit par intermittence : passe quand elle retombe.',
        up: 'La tour se gravit par marches : saute de l’une à l’autre.', bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', gap: 'Un trou : prends de l’élan et maintiens le saut.', wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.', stones: 'Les pontons te portent : saute de l’un à l’autre.' }
    }),
    plan: [
      ['mark', 'Le Quai Ferdinand-Favre'], ['rest', 10], ['spikes', 2], ['block', 1], ['gap', 3], ['rest', 4, 'lantern'],
      ['mark', 'Les Fours et l’Horloge'], ['steam'], ['up', 2], ['row', 6, 3], ['spikes', 2], ['wall'], ['up', 2], ['rest', 4, 'lantern'],
      ['mark', 'La Galerie des Renommées'], ['up', 3], ['bird', 6], ['block', 2], ['row', 7, 3], ['steam'], ['rest', 4, 'lantern'],
      ['mark', 'La Soufflerie du Dôme'], ['up', 2], ['rest', 4, 'lantern'], ['spikes', 3], ['row', 6, 3], ['gap', 3], ['bird', 6], ['rest', 3], ['padTo', 195],
      ['mark', 'Arène du Boss Final']
    ]
  });
})();
