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
 * 5 · Théâtre Graslin — « monde 1-1 ». Un niveau écrit à la main comme un niveau de plateforme classique, avec les sprites de la planche
 * « mario » : un sol continu coupé de trous, des rangées de briques et de blocs à pixel à 3 tuiles du sol, des tuyaux de fonte de 2 et 3 tuiles,
 * des gobelins qui patrouillent au sol, des champignons-plateformes au-dessus des trous, un champignon rebondissant vers un étage de pixels,
 * un escalier-pyramide et un mât d'arrivée. Tout reste jouable avec les gestes actuels (courir, sauter, accroupi, accroche) : pas d'écrasement
 * d'ennemi ni de bloc à frapper, les « blocs » sont des appuis pleins sur lesquels on monte, et leurs pixels flottent au-dessus.
 */
GP.Redesigns[5] = (function () {
  var K = GP.Kit, b = new K.Builder({ sol_y: 16, hauteur: 22 }), G0 = 16, W = 212;
  var PAV = { top_sprite: 'graslin_sol_haut_1', fill_sprite: 'graslin_sol_plein' };
  var BRI = { top_sprite: 'mario_brique', fill_sprite: 'mario_brique' }, BLP = { top_sprite: 'mario_bloc_pixel', fill_sprite: 'mario_bloc_pixel' }, MAR = { top_sprite: 'mario_marche', fill_sprite: 'mario_marche' };
  var CHAMPI = ['mario_champi_g', 'mario_champi_m', 'mario_champi_d'];
  function ground(x0, x1) { b.mass(x0, G0, x1 - x0, PAV, { note: 'sol' }); }
  /** Un bloc d'une tuile qui flotte à y (appui plein : on monte dessus, on passe dessous). */
  function blk(x, y, m) { b.mass(x, y, 1, m, { fill_to: y + 1, grab: true, note: 'bloc' }); }
  /** Une rangée de blocs : 'b' brique, 'p' bloc à pixel, 'v' bloc vide ; les pixels flottent 2 tuiles au-dessus des blocs à pixel. */
  function blocks(x, y, pattern, coins) { pattern.split('').forEach(function (c, i) { blk(x + i, y, c === 'p' ? BLP : c === 'v' ? { top_sprite: 'mario_bloc_vide', fill_sprite: 'mario_bloc_vide' } : BRI); if (c === 'p' && coins) b.px(x + i, y - 2); }); }
  /** Tuyau de fonte : 2 tuiles de large, h tuiles de haut (2 ou 3 : on le franchit d'un saut). */
  function pipe(x, h) {
    b.mass(x, G0 - h, 1, { top_sprite: 'mario_tuyau_hg', fill_sprite: 'mario_tuyau_cg' }, { note: 'tuyau' });
    b.mass(x + 1, G0 - h, 1, { top_sprite: 'mario_tuyau_hd', fill_sprite: 'mario_tuyau_cd' }, { note: 'tuyau' });
  }
  /** Escalier de marches de pierre : n marches d'1 tuile, montantes (dir 1) ou descendantes (dir −1) en partant de x. */
  function stairs(x, n, dir) { for (var i = 0; i < n; i++) b.mass(x + i, G0 - (dir > 0 ? i + 1 : n - i), 1, MAR, { note: 'marche' }); }
  function gap(x, w) { for (var yy = G0 + 1; yy < 22; yy++) b.water(x, w, yy); }
  /** Champignon-plateforme : chapeau à y, tige jusqu'au fond. */
  function shroom(x, y, w) { b.row(x, y, w, CHAMPI); for (var yy = y + 1; yy <= 21; yy++) b.deco('mario_champi_tige', x + Math.floor(w / 2), yy, { layer: 'fond' }); }
  function goblin(id, x1, x2) { b.enemy({ id: id, sprite: 'mario_gobelin', type: 'patrouille_horizontale', x1: x1, x2: x2, y: G0 - 1, vitesse: 2, touche: 'debout' }); }
  function arc(x, y, n, h) { for (var i = 0; i < n; i++) b.px(x + i, Math.round(y - Math.sin(Math.PI * (i + 0.5) / n) * h)); }

  // ----- 1 · La place s'ouvre (0–46) : courir, un premier gobelin, des blocs, deux tuyaux
  b.zone('La place s’ouvre', 0, 46);
  ground(0, 46);
  b.deco('mario_colline', 9, 15, { layer: 'fond' }); b.deco('commun_buisson_a', 22, 15); b.deco('commun_buisson_a', 33, 15);
  [[7, 4], [26, 3], [41, 5]].forEach(function (c) { b.deco('ciel_nuage_blanc_a', c[0], c[1], { layer: 'fond' }); });
  b.sign(4, 15, 'Cours vers la droite et saute : les pixels te montrent le chemin.', 'signes_panneau_fleches');
  blocks(15, 13, 'bpbpb', true);
  b.sign(21, 15, 'Les gobelins patrouillent : saute par-dessus.');
  goblin('gobelin1', 25, 31); b.px(27, 11); b.px(29, 11);
  b.sign(33, 15, 'Les tuyaux de fonte : saute dessus ou par-dessus.');
  pipe(36, 2); b.px(37, 12); pipe(41, 3); b.px(41, 11);
  b.lantern(45, 15);

  // ----- 2 · Les terrasses (46–96) : un premier trou, un étage de blocs, des champignons, la pyramide
  b.zone('Les terrasses de café', 46, 96);
  b.sign(44, 15, 'Un trou d’eau : prends de l’élan et maintiens le saut.');
  gap(46, 3); arc(46, 13, 3, 3);
  ground(49, 62); blocks(53, 13, 'bpbpbpb', true); goblin('gobelin2', 51, 58);
  b.sign(60, 15, 'Les champignons te portent : saute de l’un à l’autre.');
  gap(62, 9); shroom(63, 15, 3); shroom(68, 15, 3); b.px(64, 13); b.px(69, 13);
  ground(71, 124);
  b.sign(72, 15, 'Une pyramide de pierre : monte marche après marche.');
  stairs(76, 4, 1); stairs(82, 4, -1);
  b.px(77, 11); b.px(79, 9); b.px(81, 9); b.px(84, 11);
  goblin('gobelin3', 88, 93); b.lantern(90, 15);

  // ----- 3 · Sous les arcades (96–146) : tuyaux et gobelins, étage de briques à deux niveaux
  b.zone('Sous les arcades', 96, 146);
  pipe(98, 2); goblin('gobelin4', 101, 105); pipe(107, 3); b.px(98, 12); b.px(107, 11); b.px(108, 11);
  blocks(112, 13, 'bbpbb', true); blocks(118, 10, 'bpb', true); goblin('gobelin5', 112, 120);
  b.sign(121, 15, 'Un trou large : prends de l’élan.');
  gap(124, 4); arc(124, 13, 4, 3); ground(128, 146);
  b.sign(129, 15, 'Un champignon rebondissant : saute dessus pour monter haut.');
  (b.boosts = b.boosts || []).push({ sprite: 'mario_champi_rebond', x: 133, y: 15, w: 2, hauteur: 4.5, top: 14.5 });
  b.deco('mario_champi_rebond', 133, 15);
  b.row(136, 11, 6, CHAMPI); b.px(137, 9); b.px(139, 9, true); b.px(141, 9);
  b.lantern(130, 15);

  // ----- 4 · Les colonnes (146–190) : une allée de tuyaux de tailles variées, des trous entre eux
  b.zone('Les huit colonnes', 146, 190);
  ground(146, 170); pipe(150, 2); pipe(156, 3); goblin('gobelin6', 159, 163); pipe(166, 2); b.px(150, 12); b.px(156, 11); b.px(166, 12); b.px(157, 11);
  gap(170, 4); shroom(171, 15, 2); arc(170, 13, 4, 3);
  ground(174, 190); pipe(177, 3); pipe(183, 2); b.px(178, 11); b.px(184, 12);
  b.lantern(176, 15);

  // ----- 5 · Le fronton (190–212) : l'escalier, le saut dans le vide, le mât et l'arche
  b.zone('Le fronton', 190, 212);
  ground(190, W);
  stairs(190, 6, 1); b.px(191, 11); b.px(193, 9); b.px(195, 8);
  b.sign(188, 15, 'Gravis l’escalier du fronton, puis saute vers l’arche.');
  b.deco('mario_mat', 205, 15); b.lantern(198, 15);
  // les motifs de l'éditeur sur ce niveau reprennent ses sprites
  GP.LevelGen.registerTheme(5, {
    ground: PAV, block: BRI, rowSet: CHAMPI, spikes: 'commun_pointes_fer_1', bounceSprite: 'mario_champi_rebond', monument: 'graslin_monument_graslin', signSprite: 'signes_panneau_saut',
    decor: ['commun_buisson_a', 'commun_fleur_jaune', 'commun_fleur_rouge'], col: { chap: 'cathedrale_colonne_chapiteau', fut: 'cathedrale_colonne_fut', base: 'cathedrale_colonne_base' },
    signs: { row: 'Les champignons te portent : saute dessus.', gap: 'Un trou d’eau : prends de l’élan et maintiens le saut.', block: 'Un bloc : saute par-dessus.', up: 'Des marches : saute de l’une à l’autre.', bounce: 'Saute sur un champignon : il te fait rebondir.',
      spikes: 'Les pointes piquent : saute par-dessus.', bird: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.', stones: 'Les champignons te portent : saute de l’un à l’autre.', wall: 'Maintiens ↑ près d’un rebord pour t’y accrocher.' }
  });
  var d = b.out({
    largeur: W, hauteur: 22, sol_y: G0, spawn: { x: 1, y: G0 - 1 }, temps_ref_s: 100, boosts: b.boosts || [], anneaux: [], courants: [], eau: [], mobiles: [], rails: [],
    arrivee: { monument: { sprite: 'graslin_monument_graslin', x: 207, y: G0 - 1 }, arche: { sprite: 'signes_arche_arrivee', x: 210, y: G0 - 1 }, declencheur: { x: 211, y: G0 - 1 } }
  });
  return d;
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
