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
 *
 * Mécaniques introduites une à une (niveau 1) ; les niveaux suivants les combineront.
 */
GP.LevelBuilder = {
  create: function (width, fn) {
    var L = {
      width: width, rows: 17, grid: new Int8Array(width * 17),
      plats: [], thorns: [], pixels: [], checks: [], hints: [], deco: [], startX: 2, startRow: 13
    };
    function set(x, y, v) { if (x >= 0 && x < width && y >= 0 && y < 17) L.grid[y * width + x] = v; }
    /** Première ligne pleine de la colonne x (sol, pierre, topiaire, pavés), ou 17 s'il n'y en a pas (trou). */
    L.top = function (x) { for (var y = 0; y < 17; y++) { var v = L.grid[y * width + x]; if (v && v !== 3) return y; } return 17; };   // 3 = sens unique, ne compte pas
    var api = {
      ground: function (x, w, h, style) { for (var i = x; i < x + w; i++) for (var y = 17 - h; y < 17; y++) set(i, y, style === 'pave' ? 5 : 1); },
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
      /** Verdure au hasard, seulement là où il n'y a ni objet de jeu ni trou. */
      scatter: function (seed) {
        var rnd = GP.PixelArt.rng(seed), busy = {};
        L.thorns.concat(L.checks, L.hints).forEach(function (o) { busy[o.x] = busy[o.x - 1] = busy[o.x + 1] = true; });
        L.plats.forEach(function (p) { for (var i = p.x - 1; i <= p.x + p.w; i++) busy[i] = true; });
        L.deco.forEach(function (d) { busy[d.x] = busy[d.x - 1] = busy[d.x + 1] = true; });   // décor posé à la main
        for (var x = 1; x < width - 1; x++) {
          var t = L.top(x);
          if (t >= 17 || busy[x] || L.top(x - 1) !== t || L.top(x + 1) !== t) continue;
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
    L.deco(15, 'lv_pine', { depth: 2 }); L.deco(21, 'lv_pine', { depth: 2, dx: 6 });
    L.hint(3, '< > OU Q/D : COURIR');
    L.pixRow(8, 13, 5);
    // 2. Une marche, puis un trou de 3 tuiles : sauter
    L.hint(18, 'ESPACE : SAUTER');
    L.ground(23, 8, 4, 'pave');
    L.deco(27, 'lv_tram', { depth: 3 });
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
    L.hint(58, 'MAINTIENS ESPACE : PLUS HAUT');
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
    L.scatter(1934);
  });
  L.id = 'jardin-des-plantes';
  L.reveal = 'bottomUp';          // ordre de révélation de l'image (grammaire du lieu)
  L.backdrop = { x: 129, key: 'lm_jardin-des-plantes', scale: 3 };   // la serre en silhouette, au fond
  return L;
})();
