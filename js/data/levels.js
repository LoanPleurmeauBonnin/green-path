/**
 * Niveaux — constructeur + définitions. Ajouter un niveau = ajouter une définition ici (le moteur ne change pas).
 *
 * Repères : tuiles de 16 px, 17 lignes (0 en haut, 16 en bas). Un sol de hauteur h occupe les lignes 17-h à 16.
 * Les objets « posés » (ronce, lanterne, panneau, décor) se placent tout seuls sur le sol de leur colonne.
 *
 *   L.ground(x, w, h, 'pave')    sol d'herbe et de terre (ou pavés de gare), colonnes x..x+w-1, hauteur h tuiles
 *   L.block(x, y, w, h)          blocs de pierre pleins (ligne du haut y)
 *   L.topiary(x, y, w, h)        butte de feuillage taillé, pleine (on peut monter dessus)
 *   L.plat(x, y, w, 'bridge')    plateforme à sens unique (rebord d'herbe par défaut, ou pont de planches)
 *   L.thorn(x, w)                ronces posées sur le sol
 *   L.pix(x, y) / L.pixRow(x, y, n)   pixels à ramasser (centre de la case x, y)
 *   L.check(x)                   lanterne = point de contrôle
 *   L.hint(x, texte)             panneau d'apprentissage
 *   L.deco(x, clé, { dx, dy, depth }) / L.scatter(graine)   décor (à la main / verdure au hasard sur l'herbe)
 *   L.start(x)                   départ du joueur
 * Mécaniques des niveaux suivants (une nouvelle par niveau, puis combinées) :
 *   L.climb(x, haut, bas)        colonne à escalader (lignes haut..bas) — Cathédrale
 *   L.crumble(x, y, w)           rebord qui s'effrite sous les pieds puis revient — Cathédrale
 *   L.gargoyle(x, y, période)    gargouille qui laisse tomber une goutte (annoncée) — Cathédrale
 *   L.slit(x, y, dir, période)   meurtrière : flèches à hauteur de tête, s'accroupir pour passer — Château
 *   L.gate(x, ouvert, fermé)     herse qui monte et descend (bloque le passage, ne blesse pas) — Château
 *   L.barrel(x0, x1, vitesse)    tonneau qui roule d'un bout à l'autre (sauter par-dessus) — Château, Bouffay
 *   L.mover(x, y, w, dx, dy, s)  plateforme mobile à sens unique (étal) — Bouffay
 * Réactions à la météo (annoncées) : L.rainThorn(x) ronce qui pousse s'il pleut ; L.sunPlat(x, y, w) fleur-plateforme
 * au soleil (jamais indispensable) ; options L.weatherText, L.rainGargoyle (gargouilles plus fréquentes).
 * Habillage : L.skin (tuiles d'une planche) ; capacités : L.abilities { crouch, grab, climb }.
 *
 * Mécaniques introduites une à une ; les niveaux suivants les combinent.
 */
GP.LevelBuilder = {
  create: function (width, fn, rows) {
    rows = rows || 17;
    var L = {
      width: width, rows: rows, grid: new Int8Array(width * rows),
      plats: [], thorns: [], pixels: [], checks: [], hints: [], deco: [], startX: 2, startRow: 13,
      climbs: [], crumbles: [], gargoyles: [], slits: [], gates: [], barrels: [], movers: [], rainThorns: [], sunPlats: [],
      abilities: {}, skin: null, shelters: []
    };
    function set(x, y, v) { if (x >= 0 && x < width && y >= 0 && y < rows) L.grid[y * width + x] = v; }
    /** Première ligne pleine de la colonne x (sol, pierre, topiaire, pavés), ou 17 s'il n'y en a pas (trou). */
    L.top = function (x) { for (var y = 0; y < rows; y++) { var v = L.grid[y * width + x]; if (v && v !== 3) return y; } return rows; };   // 3 = sens unique, ne compte pas
    var api = {
      ground: function (x, w, h, style) { for (var i = x; i < x + w; i++) for (var y = rows - h; y < rows; y++) set(i, y, style === 'pave' ? 5 : 1); },
      topiary: function (x, y, w, h) { for (var i = x; i < x + w; i++) for (var j = y; j < y + h; j++) set(i, j, 4); },
      block: function (x, y, w, h) { for (var i = x; i < x + w; i++) for (var j = y; j < y + h; j++) set(i, j, 2); },
      plat: function (x, y, w, kind) { L.plats.push({ x: x, y: y, w: w, kind: kind || 'grass' }); for (var i = x; i < x + w; i++) set(i, y, 3); },
      thorn: function (x, w) { for (var i = x; i < x + (w || 1); i++) L.thorns.push({ x: i, y: L.top(i) - 1 }); },
      pix: function (x, y) { L.pixels.push({ x: x, y: y }); },
      pixRow: function (x, y, n) { for (var i = 0; i < n; i++) L.pixels.push({ x: x + i, y: y }); },
      check: function (x) { L.checks.push({ x: x, y: L.top(x) - 1 }); },
      hint: function (x, text) { L.hints.push({ x: x, y: L.top(x) - 1, text: text }); },
      deco: function (x, key, o) { o = o || {}; L.deco.push({ x: x, y: L.top(x) - 1, key: key, dx: o.dx || 0, dy: o.dy || 0, depth: o.depth }); },
      start: function (x) { L.startX = x; L.startRow = L.top(x) - 1; },
      climb: function (x, top, bottom) { L.climbs.push({ x: x, top: top, bottom: bottom === undefined ? L.top(x) - 1 : bottom }); },
      crumble: function (x, y, w) { L.crumbles.push({ x: x, y: y, w: w || 1 }); },
      gargoyle: function (x, y, period) { L.gargoyles.push({ x: x, y: y, period: period || 2600 }); },
      slit: function (x, y, dir, period, offset, range) { L.slits.push({ x: x, y: y, dir: dir || -1, period: period || 1400, offset: offset || 0, range: range || 10 }); },
      gate: function (x, open, closed, floorRow) { L.gates.push({ x: x, y: floorRow === undefined ? L.top(x) - 1 : floorRow - 1, open: open || 1800, closed: closed || 1600 }); },
      barrel: function (x0, x1, speed) { L.barrels.push({ x0: x0, x1: x1, y: L.top(x0) - 1, speed: speed || 45 }); },
      mover: function (x, y, w, dx, dy, period) { L.movers.push({ x: x, y: y, w: w, dx: dx || 0, dy: dy || 0, period: period || 3000 }); },
      rainThorn: function (x) { L.rainThorns.push({ x: x, y: L.top(x) - 1 }); },
      sunPlat: function (x, y, w) { L.sunPlats.push({ x: x, y: y, w: w || 1 }); },
      /** x/y/w/h en pixels monde ; coefficients pluie, neige, vent indépendants. */
      shelter: function (id, x, y, w, h, protection) {
        L.shelters.push({ id: id, x: x, y: y, w: w, h: h, rain: protection.rain, snow: protection.snow, wind: protection.wind });
      },
      /** Verdure au hasard, seulement là où il n'y a ni objet de jeu ni trou. */
      scatter: function (seed) {
        var rnd = GP.PixelArt.rng(seed), busy = {};
        L.thorns.concat(L.checks, L.hints, L.rainThorns).forEach(function (o) { busy[o.x] = busy[o.x - 1] = busy[o.x + 1] = true; });
        L.plats.forEach(function (p) { for (var i = p.x - 1; i <= p.x + p.w; i++) busy[i] = true; });
        L.deco.forEach(function (d) { busy[d.x] = busy[d.x - 1] = busy[d.x + 1] = true; });   // décor posé à la main
        for (var x = 1; x < width - 1; x++) {
          var t = L.top(x);
          if (t >= rows || busy[x] || L.top(x - 1) !== t || L.top(x + 1) !== t) continue;
          if (L.grid[t * width + x] !== 1) continue;   // verdure seulement sur l'herbe (pas sur les pavés ni la pierre)
          var r = rnd();
          if (r < 0.13) L.deco.push({ x: x, y: t - 1, key: rnd() < 0.55 ? 'lv_tree' : 'lv_tree2', dx: 0, back: true });
          else if (r < 0.25) L.deco.push({ x: x, y: t - 1, key: 'lv_bush', dx: 0 });
          else if (r < 0.32) L.deco.push({ x: x, y: t - 1, key: 'lv_rock', dx: Math.floor(rnd() * 4) - 2 });
          if (rnd() < 0.55) L.deco.push({ x: x, y: t - 1, key: ['lv_flower_r', 'lv_flower_y', 'lv_flower_w', 'lv_tuft'][Math.floor(rnd() * 4)], dx: Math.floor(rnd() * 10) - 5 });
        }
      }
    };
    fn(api, L);
    return L;
  }
};

GP.LEVELS = {};

/**
 * NIVEAU 1 — JARDIN DES PLANTES (136 tuiles). On sort de la gare et on entre dans le jardin ; obstacles : ronces.
 * Décor stylisé d'après des photos de repérage (dessins originaux) : parvis de la gare (pavés, arrêt de tram aux
 * panneaux de verre verts, bâtiment de verre, pin), puis le jardin (portail, bassin et jet d'eau, massifs, topiaire,
 * personnage en bois), et le Palmarium en silhouette au fond.
 * Image à reconstruire : la photo pixélisée du Palmarium, révélée du bas vers le haut, comme une croissance.
 * Les positions des trous, marches et pixels ont été vérifiées avec la vraie physique (tools/bot.js).
 */
GP.LEVELS['jardin-des-plantes'] = (function () {
  var L = GP.LevelBuilder.create(136, function (L) {
    // 1. Parvis de la gare : courir et ramasser
    L.ground(0, 23, 3, 'pave');
    L.start(2);
    L.deco(9, 'lv_glass', { depth: 1 });
    L.deco(5, 'lv_tram', { depth: 3 });
    // Auvent déjà dessiné : toit à y=182..188 ; protection partielle, côtés ouverts.
    L.shelter('gare-auvent-1', 66, 188, 44, 36, { rain: 0.5, snow: 0.5, wind: 0.25 });
    L.deco(15, 'lv_pine', { depth: 2 }); L.deco(21, 'lv_pine', { depth: 2, dx: 6 });
    L.hint(3, '{move} : COURIR');
    L.pixRow(8, 13, 5);
    // 2. Une marche, puis un trou de 3 tuiles : sauter
    L.hint(18, '{jump} : SAUTER');
    L.ground(23, 8, 4, 'pave');
    L.deco(27, 'lv_tram', { depth: 3 });
    L.shelter('gare-auvent-2', 418, 172, 44, 36, { rain: 0.5, snow: 0.5, wind: 0.25 });
    L.pix(25, 11);
    L.pix(31, 11); L.pix(32, 9); L.pix(33, 9);         // sur l'arc du saut
    // 3. Entrée du jardin : lanterne, puis une ronce isolée, puis une double ronce
    L.ground(34, 27, 4);
    L.deco(35, 'lv_gate', { depth: 3 });
    L.check(36);
    L.hint(38, 'LANTERNE = POINT DE CONTRÔLE');
    L.hint(43, 'ATTENTION AUX RONCES !');
    L.thorn(46, 1); L.pix(46, 9);
    L.thorn(52, 2); L.pix(52, 9); L.pix(53, 9);
    // 4. Rebords d'herbe à deux hauteurs : sauter plus haut
    L.hint(58, 'MAINTIENS {jump} : PLUS HAUT');
    L.ground(61, 20, 3);
    L.plat(64, 12, 4); L.pix(65, 11); L.pix(66, 11);
    L.plat(69, 10, 4); L.pix(70, 9); L.pix(71, 9);     // accessible seulement depuis le premier rebord
    L.pix(76, 10); L.pix(77, 10);
    // 5. Bassin et jet d'eau, massifs de fleurs, topiaire au-dessus d'une fosse de ronces, deuxième lanterne
    L.ground(81, 4, 4); L.check(82);
    L.deco(83, 'lv_fountain', { depth: 3 });
    L.ground(85, 4, 5); L.pix(86, 11); L.deco(86, 'lv_flowerbed', { depth: 4, dy: 1 });
    L.ground(89, 4, 6); L.pix(90, 10); L.deco(90, 'lv_flowerbed', { depth: 4, dy: 1 });
    L.ground(93, 7, 3);
    L.topiary(96, 11, 2, 3);                           // butte de feuillage taillé : une plateforme
    L.thorn(93, 3); L.thorn(98, 2);
    L.pix(94, 7); L.pix(95, 7); L.pix(98, 8); L.pix(99, 7);
    L.ground(100, 7, 6); L.check(102);
    L.deco(104, 'lv_woodman', { depth: 3 });
    // 6. Dernière ligne droite : trou, pont de planches, ronce ; le Palmarium au fond
    L.ground(107, 4, 4);
    L.pix(111, 11); L.pix(112, 9); L.pix(113, 9);
    L.ground(114, 3, 4);
    L.plat(117, 13, 5, 'bridge'); L.pix(118, 12); L.pix(120, 12);
    L.ground(122, 14, 4);
    L.thorn(126, 1); L.pix(126, 9);
    L.pix(130, 12); L.pix(131, 12);
    // réactions à la météo de Nantes
    L.rainThorn(56); L.rainThorn(79); L.rainThorn(133);   // pluie : des ronces poussent (on les saute, elles sont annoncées)
    L.sunPlat(31, 12, 3);                                 // soleil : une fleur fait un pont au-dessus du premier trou
    L.sunPlat(75, 11, 2);                                 // … et une autre aide à attraper les pixels hauts
    L.scatter(1934);
  });
  L.weatherText = { rain: 'LES RONCES POUSSENT', sun: 'DES FLEURS FONT DES PLATEFORMES' };
  L.id = 'jardin-des-plantes';
  L.reveal = 'bottomUp';          // ordre de révélation de l'image (grammaire du lieu)
  L.backdrop = { x: 129, key: 'lm_jardin-des-plantes', scale: 3 };   // la serre en silhouette, au fond
  return L;
})();

/**
 * NIVEAU 3 — CHÂTEAU. Adaptation de niveau_03_chateau.json, pas import littéral.
 * Cinq espaces liés : douves, châtelet, échafaudage, chemin de ronde, cour.
 * Les deux premiers ponts sont levants ; les coupures du rempart sont des passerelles de réparation.
 * Validation humaine en attente : docs/LEVEL_REDESIGN.md.
 */
GP.LEVELS['chateau'] = (function () {
  var L = GP.LevelBuilder.create(170, function (L) {
    // 1. Ouvrage d'entrée : fosse sèche puis douves. Les paliers sont réversibles.
    L.ground(0, 12, 5);
    // Les deux ponts-levis enjambent de vraies douves (la première fosse était sèche, avec des marches : incohérent).
    L.ground(16, 6, 5); L.ground(26, 44, 5);
    L.start(2);
    L.hint(8, 'ATTENDS LE PONT BAISSÉ · LA CHAÎNE ANNONCE SON MOUVEMENT');
    L.check(32);

    // 2. Deux seuils sous de vraies masses de maçonnerie, séparés par un avant-corps ouvert.
    L.block(40, 5, 4, 7); L.gate(42, 2600, 1600, 15);
    L.block(56, 5, 4, 7); L.gate(58, 2800, 1600, 15);
    L.shelter('chateau-passage-1', 40 * 16, 12 * 16, 4 * 16, 3 * 16 + 1, { rain: 1, snow: 1, wind: 0.5 });
    L.shelter('chateau-passage-2', 56 * 16, 12 * 16, 4 * 16, 3 * 16 + 1, { rain: 1, snow: 1, wind: 0.5 });
    L.hint(35, 'LA HERSE BLOQUE LE PASSAGE · ATTENDS SUR LE PALIER');
    L.hint(47, '{down} : ACCROUPIS-TOI SOUS LA FLÈCHE');
    L.slit(53, 14, -1, 1800, 0, 6);
    L.check(69);

    // 3. Chantier attaché à la courtine : marches, planches, corniche, planches, rempart.
    L.ground(70, 12, 5); L.ground(75, 2, 6); L.ground(77, 5, 7);
    L.plat(82, 12, 4, 'bridge'); L.plat(88, 10, 4); L.plat(95, 11, 4, 'bridge');
    L.ground(101, 13, 11);
    L.hint(72, 'LES PLANCHES SONT FIXÉES AU MUR · {jump} : MONTER');
    L.check(104);

    // 4. Chemin de ronde : deux tabliers fixes de réparation, pas deux ponts-levis sans porte.
    L.plat(114, 9, 3, 'bridge'); L.ground(117, 9, 11);
    L.plat(126, 9, 3, 'bridge'); L.ground(129, 13, 11);
    L.barrel(118, 124, 40);   // un premier tonneau sur le tablier, avant celui du chemin de ronde
    L.barrel(131, 139, 45);
    L.hint(108, 'CHEMIN DE RONDE · ATTENTION AU TONNEAU');

    // 5. Descente réversible vers la cour : aucun grand saut de retour obligatoire.
    L.ground(142, 2, 10); L.ground(144, 2, 9); L.ground(146, 2, 8); L.ground(148, 22, 7);
    L.hint(153, 'IMAGE COMPLÈTE PUIS ARCHE · LE RETOUR RESTE POSSIBLE');
    L.deco(159, 'chateau_grand_logis', { depth: 1 });
    L.deco(151, 'chateau_caisse', { depth: 3 });
    // Vingt fragments, réimplantés pour les appuis réels (pas la convention bas-gauche du JSON).
    [[8,14], [14,14], [24,14], [30,14], [37,14], [46,14], [51,14], [65,14], [73,14], [79,12],
      [83,11], [90,9], [98,10], [105,8], [112,8], [115,8], [124,8], [138,8], [150,12], [161,12]]
      .forEach(function (p) { L.pix(p[0], p[1]); });
  }, 20);
  L.id = 'chateau';
  L.revision = 'chateau-architecture-1';
  L.reveal = 'fortification';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: 'castle_pave', fill: ['castle_rubble_1', 'castle_rubble_2'],
    left: 'castle_rubble_1', right: 'castle_rubble_2', block: ['castle_rubble_1', 'castle_rubble_2'],
    blockTop: 'castle_rubble_1', blockBottom: 'chateau_mur_bas',
    ledge: ['chateau_corniche_pierre_g', 'chateau_corniche_pierre_m', 'chateau_corniche_pierre_d'],
    bridge: ['castle_deck_g', 'castle_deck_m', 'castle_deck_d']
  };
  L.thornKey = 'commun_pointes_fer_1'; L.thornText = 'AÏE, LES POINTES !';
  L.sky = { farKey: 'chateau_chateau_silhouette_tile_x', farBottom: 236 };
  L.architecture = 'chateau';
  L.zones = [
    { x: 0, end: 34, name: 'DOUVES' }, { x: 34, end: 70, name: 'CHÂTELET' },
    { x: 70, end: 106, name: 'ÉCHAFAUDAGES' }, { x: 106, end: 142, name: 'CHEMIN DE RONDE' },
    { x: 142, end: 170, name: 'COUR DU GRAND LOGIS' }
  ];
  L.bridges = [{ x: 12, y: 15, w: 4, open: 3000, closed: 2000, warning: 500 },
    { x: 22, y: 15, w: 4, open: 3000, closed: 2000, warning: 500 }];
  L.water = [{ x: 12, y: 18, w: 4, h: 2 }, { x: 22, y: 18, w: 4, h: 2 }, { x: 82, y: 18, w: 19, h: 2 },
    { x: 114, y: 18, w: 3, h: 2 }, { x: 126, y: 18, w: 3, h: 2 }];
  L.exit = { x: 167, y: 13, key: 'signes_arche_arrivee' };
  L.weatherText = { wind: 'LE VENT FAIT ROULER LES TONNEAUX' };
  return L;
})();

/**
 * NIVEAU 2 — CATHÉDRALE SAINT-PIERRE-ET-SAINT-PAUL (120 tuiles). Nouvelles capacités : GRIMPER aux colonnes et
 * S'ACCROCHER aux rebords. Gargouilles qui laissent tomber des gouttes (plus souvent sous la pluie), corniches qui
 * s'effritent au-dessus de pointes de pierre, tour à gravir, puis la nef et la façade. Révélation : du bas vers le haut.
 */
GP.LEVELS['cathedrale'] = (function () {
  var L = GP.LevelBuilder.create(120, function (L) {
    // 1. Grimper à une colonne
    L.ground(0, 22, 3);
    L.start(2);
    L.hint(4, '{up} : GRIMPE AUX COLONNES');
    L.climb(9, 7, 13);
    L.plat(10, 7, 4);
    L.pix(9, 9); L.pix(11, 6); L.pix(12, 6);
    // 2. S'accrocher à un rebord trop haut pour un saut
    L.hint(16, 'SAUTE CONTRE LE MUR ET ACCROCHE-TOI');
    L.ground(22, 6, 7);
    L.pix(24, 9); L.pix(25, 9);
    L.ground(28, 12, 3);
    L.check(29);
    // 3. Gargouilles : la goutte se forme, puis tombe
    L.hint(30, 'UNE GOUTTE SE FORME : ATTENDS');
    L.block(32, 5, 1, 1); L.gargoyle(32, 5, 2400);
    L.block(36, 5, 1, 1); L.gargoyle(36, 5, 2400);
    L.pix(34, 13); L.pix(38, 13);
    // 4. Corniches qui s'effritent au-dessus des pointes
    L.ground(40, 2, 3); L.check(40);
    L.hint(41, "LES CORNICHES S'EFFRITENT : AVANCE");
    L.ground(42, 11, 2);
    L.thorn(42, 11);
    L.crumble(43, 11, 2); L.crumble(47, 11, 2); L.crumble(51, 11, 2);
    L.pix(44, 10); L.pix(48, 10); L.pix(52, 10);
    // 5. La tour : colonne, sommet, rebord haut, puis redescente
    L.ground(53, 10, 3);
    L.climb(62, 8, 13);
    L.ground(63, 4, 9);
    L.pix(62, 10); L.pix(64, 7); L.pix(65, 7);
    L.plat(68, 5, 3); L.pix(69, 4); L.pix(70, 4);
    L.ground(67, 13, 3);
    L.check(73);
    L.block(70, 2, 1, 1); L.gargoyle(70, 2, 2000);
    // 6. Un dernier mur à saisir, puis la nef
    L.ground(80, 5, 7);
    L.pix(81, 9); L.pix(83, 9);
    L.ground(85, 35, 3);
    L.pix(90, 13); L.pix(94, 13); L.pix(98, 13);
    L.plat(100, 11, 3); L.pix(101, 10); L.pix(102, 10);
  });
  L.id = 'cathedrale';
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true, climb: true };
  L.skin = {
    top: 'cathedrale_pierre_haut', fill: ['cathedrale_pierre_blanche_pleine_1', 'cathedrale_pierre_blanche_pleine_2', 'cathedrale_pierre_blanche_pleine_3'],
    left: 'cathedrale_pierre_gauche', right: 'cathedrale_pierre_droite', block: ['cathedrale_pierre_blanche_pleine_1'],
    ledge: ['cathedrale_corniche_g', 'cathedrale_corniche_m', 'cathedrale_corniche_d']
  };
  L.thornKey = 'cathedrale_pointes_pierre_1'; L.thornText = 'AÏE, LES POINTES DE PIERRE !';
  L.sky = { farKey: 'cathedrale_nef_fond_tile_x', farBottom: 240 };
  L.backdrop = { x: 108, key: 'cathedrale_tour_facade', scale: 1, tint: false };
  L.rainGargoyle = true;
  L.weatherText = { rain: 'LES GARGOUILLES COULENT PLUS SOUVENT' };
  return L;
})();

/**
 * NIVEAU 4 — QUARTIER DU BOUFFAY (110 tuiles). Nouvelle mécanique : les ÉTALS QUI BOUGENT (plateformes mobiles,
 * à l'horizontale puis à la verticale), combinés avec les tonneaux et les balcons. Révélation : ossature puis remplissage
 * (ici du bas vers le haut, en attendant l'ordre propre au pan de bois).
 */
GP.LEVELS['bouffay'] = (function () {
  var L = GP.LevelBuilder.create(110, function (L) {
    // 1. Place : premiers pixels
    L.ground(0, 20, 3);
    L.start(2);
    L.hint(4, 'MONTE SUR LES ÉTALS QUI BOUGENT');
    L.pixRow(6, 13, 3);
    L.deco(12, 'bouffay_maison_pans_a', { depth: 1 }); L.deco(16, 'bouffay_fontaine_place', { depth: 3 });
    // 2. Un étal glisse au-dessus du caniveau
    L.mover(20, 12, 3, 5, 0, 4000);
    L.pix(22, 11); L.pix(25, 11);
    L.ground(28, 15, 3);
    L.check(29);
    // 3. Tonneaux qui roulent dans la ruelle
    L.barrel(31, 41, 50);
    L.pix(33, 10); L.pix(37, 10);
    L.deco(35, 'bouffay_maison_pans_b', { depth: 1 }); L.deco(40, 'bouffay_enseigne_potence_pain', { depth: 3, dy: -40 });
    // 4. Un étal qui monte jusqu'aux toits
    L.hint(42, 'CERTAINS ÉTALS MONTENT');
    L.mover(44, 13, 2, 0, -5, 4200);
    L.pix(45, 10);
    L.ground(47, 8, 8);
    L.pix(49, 8); L.pix(51, 8);
    L.ground(55, 10, 3);
    L.check(56);
    L.plat(58, 11, 3); L.pix(59, 10); L.pix(60, 10);
    L.deco(62, 'bouffay_maison_pans_c', { depth: 1 });
    // 5. Deux étals à la suite, puis la grande rue
    L.mover(65, 12, 2, 3, 0, 3000);
    L.mover(70, 11, 2, 2, -1, 3500);
    L.pix(67, 11); L.pix(71, 10);
    L.ground(74, 36, 3);
    L.check(75);
    L.barrel(80, 90, 55);
    L.pix(83, 10); L.pix(87, 10);
    L.pix(95, 13); L.pix(96, 13); L.pix(97, 13);
    L.plat(99, 11, 3, 'bridge'); L.pix(100, 10); L.pix(101, 10);
    L.deco(104, 'bouffay_linge_etendu', { depth: 3, dy: -48 });
  });
  L.id = 'bouffay';
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true, climb: true };
  L.skin = {
    top: ['bouffay_pave_ruelle_haut_1', 'bouffay_pave_ruelle_haut_2', 'bouffay_pave_ruelle_haut_3'], fill: 'bouffay_pave_plein',
    left: 'bouffay_pave_gauche', right: 'bouffay_pave_droite', block: 'bouffay_pave_plein',
    ledge: ['bouffay_balcon_bois_g', 'bouffay_balcon_bois_m', 'bouffay_balcon_bois_d'],
    bridge: ['bouffay_auvent_ardoise_g', 'bouffay_auvent_ardoise_m', 'bouffay_auvent_ardoise_d'],
    mover: ['bouffay_etal_marche_g', 'bouffay_etal_marche_m', 'bouffay_etal_marche_d']
  };
  L.thornKey = 'bouffay_tessons_sol'; L.thornText = 'AÏE, DES TESSONS !';
  L.sky = { farKey: 'bouffay_ruelle_fond_tile_x', farBottom: 236 };
  L.weatherText = { wind: 'LE VENT FAIT ROULER LES TONNEAUX' };
  return L;
})();
