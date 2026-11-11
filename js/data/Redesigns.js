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
 * 2 · Cathédrale Saint-Pierre-et-Saint-Paul. Le parvis et la façade (le portail s'ouvre sous un tympan de pierre), la grande nef
 * (sol de dalles, colonnes grimpables, escalier vers les galeries), les galeries des vitraux (balustrades portées par des piliers),
 * puis les toits : les corniches reposent sur des empilements de contreforts, gardées par des gargouilles, jusqu'à la tour et sa rosace.
 */
GP.Redesigns[2] = (function () {
  var K = GP.Kit, b = new K.Builder({ sol_y: 22, hauteur: 24 });
  var PIERRE = { top_sprite: 'cathedrale_pierre_haut', fill_sprite: 'cathedrale_pierre_blanche_pleine_2' };
  var NEF = { top_sprite: 'cathedrale_dalle_nef', fill_sprite: 'cathedrale_pierre_blanche_pleine_2' };
  var CORN = ['cathedrale_corniche_g', 'cathedrale_corniche_m', 'cathedrale_corniche_d'];
  var COL = { sprite_chapiteau: 'cathedrale_colonne_chapiteau', sprite_fut: 'cathedrale_colonne_fut', sprite_base: 'cathedrale_colonne_base' };

  // Le parvis, la façade et le portail
  b.ground(0, 17, PIERRE);
  b.deco('cathedrale_tour_facade', 0, 21, { layer: 'sol' });
  b.deco('cathedrale_arc_brise_porte', 12, 21);
  b.deco('cathedrale_statue_niche', 9, 21);
  b.mass(10, 13, 7, PIERRE, { fill_to: 18, grab: false, note: 'tympan au-dessus du portail' });
  b.deco('cathedrale_clocheton', 10.5, 12);
  b.deco('cathedrale_clocheton', 14.5, 12);
  // La nef : voûte, sol de dalles, rebord à gravir, colonnes, escalier
  b.mass(17, 0, 78, PIERRE, { fill_to: 3, grab: false, bas_sprite: 'cathedrale_pierre_bas', note: 'voûte de la nef' });
  b.ground(17, 83, NEF);
  b.mass(21, 18.5, 3, PIERRE, { grab: true, note: 'marche de 3,5 tuiles : accroche ↑' });
  b.column(30, 17, COL); b.column(42, 14, COL);
  b.ramp(50, 22, 58, 14, PIERRE);
  // Les galeries des vitraux
  [[58, 14, 9, [58, 62, 66]], [70, 12, 8, [70, 74, 77]], [81, 10, 6, [81, 86]]].forEach(function (g) {
    b.plat.push({ id: b.uid('gal'), type: 'galerie', x: g[0], y: g[1], w: g[2], sprite: 'cathedrale_galerie_balustrade', piliers: g[3], sprite_fut: 'cathedrale_colonne_fut', sol_y: 22, grab: true });
  });
  b.mass(87, 9, 1, PIERRE, { grab: true });
  b.mass(88, 8, 12, PIERRE, { grab: true, note: 'palier devant la porte des toits' });
  b.mass(95, 0, 5, PIERRE, { fill_to: 4, grab: false, note: 'linteau de la porte des toits' });
  b.deco('cathedrale_arc_brise_porte', 96, 7);
  for (var i = 0; i < 11; i++) b.deco(i % 2 ? 'cathedrale_vitrail_haut_2' : 'cathedrale_vitrail_haut_1', 19 + i * 7, 2, { layer: 'inlay' });
  // Les toits : une corniche sur un empilement de contreforts
  b.ground(100, 58, PIERRE);
  function roof(x, y, w) {
    b.row(x, y, w, CORN, { grab: true });
    var cx = x + Math.floor(w / 2);
    for (var by = y + 2; by <= 21; by += 3) b.deco('cathedrale_contrefort', cx, Math.min(by, 21));
  }
  roof(103, 6, 3); roof(109, 7, 5); roof(117, 5, 3); roof(123, 4, 6);
  // La tour, sa rosace et ses clochetons
  b.mass(129, 6, 29, PIERRE, { grab: true, note: 'terrasse de la tour' });
  b.deco('cathedrale_rosace', 137, 12, { layer: 'inlay' });
  b.deco('cathedrale_clocheton', 131, 5); b.deco('cathedrale_clocheton', 143, 5);
  // Dangers : pointes au sol, cierge de la galerie, gargouilles
  [[34, 'cathedrale_pointes_pierre_1', 3], [46, 'cathedrale_pointes_pierre_2', 2], [67, 'cathedrale_pointes_pierre_1', 3], [78, 'cathedrale_pointes_pierre_2', 3],
   [100, 'cathedrale_pointes_pierre_1', 3], [106, 'cathedrale_pointes_pierre_2', 3], [114, 'cathedrale_pointes_pierre_1', 3], [120, 'cathedrale_pointes_pierre_2', 3]]
    .forEach(function (d) { b.danger(d[1], d[0], 21, 'mortel', { w: d[2] }); });
  b.danger('cathedrale_cierge_flamme', 84, 9, 'mortel');
  [[105, 5], [119, 4]].forEach(function (g) { b.danger('cathedrale_gargouille', g[0], g[1], 'cyclique', { cycle: { periode_s: 2.5, projectile: 'ciel_goutte_pluie', portee_tuiles: 3, direction: 'gauche' } }); });
  b.bird('pigeon_z3', 68, 78, 12, 2.55); b.bird('pigeon_z4', 108, 114, 7, 2.98);
  // Pixels, lanternes, panneaux
  [[7, 20], [9, 19], [21, 17], [30, 15], [42, 12], [46, 19, 1], [52, 17], [60, 12], [64, 20], [73, 10, 1], [82, 8], [104, 4], [111, 5, 1], [118, 3, 1], [125, 2], [136, 4], [138, 3], [140, 4]]
    .forEach(function (p) { b.px(p[0], p[1], p[2]); });
  b.lantern(59, 13).lantern(90, 7).lantern(127, 3);
  b.sign(8, 21, 'Entre dans la cathédrale par le portail.', 'signes_panneau_fleches');
  b.sign(18, 21, 'Maintiens ↑ près d’un rebord en l’air pour t’y accrocher et grimper !', 'signes_panneau_fleches');
  b.sign(24, 21, 'Cierges et pointes : saute par-dessus.'); b.sign(27, 21, 'Maintiens ↑ contre une colonne pour y grimper.');
  b.sign(60, 13, 'Les pigeons volent bas : maintiens ↓ pour passer dessous.', 'signes_panneau_fleches');
  b.sign(82, 9, 'Le cierge brûle : saute par-dessus.');
  b.sign(98, 7, 'La gargouille crache : passe entre deux jets.');
  b.zone('Le Parvis', 0, 17).zone('La Nef : colonnes et cierges', 17, 58).zone('La Galerie des Vitraux', 58, 100).zone('Les Toits et Gargouilles', 100, 129).zone('La Terrasse de la Rosace', 129, 158);
  return b.out();
})();

/**
 * 4 · Île Feydeau. Le quai Turenne, puis les hôtels d'armateurs : chaque balcon de fer forgé est accroché à la façade d'un hôtel
 * (plus de poteaux plantés dans l'eau), les gabares s'enfoncent sous le poids du joueur pour traverser le bras de Loire, et la
 * proue de pierre ferme l'île. Les balcons penchés font glisser (glisse_tuiles_s).
 */
GP.Redesigns[4] = (function () {
  var K = GP.Kit, b = new K.Builder({ sol_y: 14, hauteur: 18 });
  var QUAI = { top_sprite: 'feydeau_sol_haut_1', fill_sprite: 'feydeau_sol_plein' };
  var BALC = ['feydeau_balcon_fer_g', 'feydeau_balcon_fer_m', 'feydeau_balcon_fer_d'];
  var quais = [[0, 36], [63, 11], [74, 5], [94, 5], [112, 6], [152, 28]];
  quais.forEach(function (q) { b.ground(q[0], q[1], QUAI); });
  function onQuai(x) { return quais.some(function (q) { return x >= q[0] && x < q[0] + q[1]; }); }
  // balcons : x, y, largeur, glisse (tuiles/s ; + vers la droite)
  [[14, 11, 5, 1.2], [22, 10, 3, 1.2], [39, 11, 4, 1.2], [47, 10, 4, -1.2], [55, 9, 5, 1.2], [65, 11, 4, 1.2], [121, 11, 4, 1.2], [135, 11, 4, 0], [135, 9, 3, 0], [143, 9, 4, 1.2], [159, 11, 5, -1.2]]
    .forEach(function (c) { b.row(c[0], c[1], c[2], BALC, c[3] ? { glisse_tuiles_s: c[3] } : {}); });
  // une façade d'hôtel derrière chaque groupe de balcons (le pied dans l'eau si le balcon est au-dessus du bras de Loire)
  var hotels = [13, 16.5, 21, 38.5, 46.5, 54.5, 58, 63.5, 120.5, 134.5, 142.5, 157.5, 161];
  hotels.forEach(function (x, i) { b.deco(i % 3 === 1 ? 'feydeau_hotel_armateur_b_penchee' : 'feydeau_hotel_armateur_a', x, onQuai(x + 1.5) ? 13 : 14, { layer: 'fond' }); });
  [14, 18, 159, 163].forEach(function (x) { b.deco('feydeau_mascaron', x, 10, { layer: 'inlay' }); });
  // les gabares : appuis qui s'enfoncent
  [80, 87, 101, 107, 128].forEach(function (x, i) {
    var id = 'gabare' + (i + 1);
    b.plat.push({ type: 'pad', id: id, x: x, y: 14, w: 4, solid: 'top', sur: id, mecanique: { type: 'flotteur', enfonce_tuiles: 1.5, duree_s: 1.5, remonte_s: 2 } });
    b.decor.push({ sprite: 'petit_bateau', x: x, y: 14.25, id: id + 'a' }); b.decor.push({ sprite: 'petit_bateau', x: x + 2, y: 14.25, id: id + 'b' });
  });
  [[6, 'feydeau_bollard'], [8, 'feydeau_ancre'], [31, 'feydeau_bollard'], [66, 'feydeau_bollard'], [75, 'feydeau_ancre'], [113, 'feydeau_bollard'], [154, 'feydeau_bollard']]
    .forEach(function (d) { b.deco(d[1], d[0], 13); });
  // l'eau du bras de Loire : trois rangées de profondeur
  [[36, 27], [79, 2], [84, 3], [91, 3], [99, 2], [105, 2], [111, 1], [118, 34]].forEach(function (w) { [15, 16, 17].forEach(function (y) { b.water(w[0], w[1], y); }); });
  [[29, 13], [88, 13], [103, 13], [122, 10]].forEach(function (p) { b.danger('feydeau_obstacle_ancre_pointes', p[0], p[1], 'mortel'); });
  b.enemy({ id: 'mouette_z2', sprite: 'ciel_oiseau', type: 'patrouille_horizontale', x1: 44, x2: 53, y: 8.875, vitesse: 3.5, touche: 'debout', esquive: 'accroupi' });
  b.enemy({ id: 'mouette_z4a', sprite: 'ciel_oiseau', type: 'patrouille_horizontale', x1: 126, x2: 133, y: 12.875, vitesse: 3.5, touche: 'debout', esquive: 'accroupi' });
  b.enemy({ id: 'mouette_z4b', sprite: 'ciel_oiseau', type: 'patrouille_horizontale', x1: 140, x2: 148, y: 7.875, vitesse: 3.5, touche: 'debout', esquive: 'accroupi' });
  [[10, 13], [17, 9], [21, 8], [29, 11], [41, 9], [48, 8], [58, 6, 1], [67, 9], [82, 12], [91, 13], [96, 12], [109, 11], [124, 9], [130, 11], [136, 6, 1], [144, 7], [147, 7], [160, 9], [163, 9], [168, 13]]
    .forEach(function (p) { b.px(p[0], p[1], p[2]); });
  b.lantern(34, 13).lantern(72, 13).lantern(114, 13).lantern(145, 8);
  b.sign(5, 13, 'Les balcons penchés te font glisser : saute dans le sens de la pente pour aller plus loin.', 'signes_panneau_fleches');
  b.sign(26, 13, 'Les pointes piquent : saute par-dessus.'); b.sign(39, 10, 'Les mouettes rasent les balcons : maintiens ↓ pour passer dessous.');
  b.sign(76, 13, 'Les bateaux s’enfoncent : ne reste pas immobile.');
  b.zone('Le Quai Turenne', 0, 36).zone('Les Hôtels d’Armateurs', 36, 74).zone('La Traversée des Gabares', 74, 112).zone('La Cour du Temple du Goût', 112, 152).zone('La Proue de Pierre', 152, 180);
  return b.out();
})();
