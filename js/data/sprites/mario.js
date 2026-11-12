/* Planche « mario » — sprites dessinés par code (novembre 2026) pour les niveaux construits comme des niveaux de plateforme classiques :
 * blocs de brique et de pixel doré, tuyaux de fonte, marches de pierre, champignons-plateformes et rebondissants, collines, gobelin.
 * Les couleurs sont celles de la palette du jeu (GP.SPRITE_PAL). Chaque sprite est un tableau de lignes de lettres, « . » = transparent. */
window.GP = window.GP || {};
GP.SPRITES = GP.SPRITES || {};
GP.SPRITES["mario"] = (function () {
  function grid(w, h) { var g = []; for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push('.'); g.push(r); } return g; }
  function put(g, x, y, c) { if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c; }
  function rect(g, x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) put(g, x + i, y + j, c); }
  function frame(g, x, y, w, h, c) { rect(g, x, y, w, 1, c); rect(g, x, y + h - 1, w, 1, c); rect(g, x, y, 1, h, c); rect(g, x + w - 1, y, 1, h, c); }
  function out(id, g, extra) { return Object.assign({ id: id, w: g[0].length, h: g.length, anchor: 'top-left', tile_x: false, rows: g.map(function (r) { return r.join(''); }) }, extra || {}); }
  function ellipse(g, cx, cy, rx, ry, c) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = c; } }
  var list = [];

  // Brique : briques décalées, mortier sombre, reflet en haut à gauche
  (function () {
    var g = grid(16, 16); rect(g, 0, 0, 16, 16, 'o'); frame(g, 0, 0, 16, 16, 'k');
    [4, 8, 12].forEach(function (y) { rect(g, 1, y, 14, 1, 'r'); });
    [[8, 1, 3], [4, 5, 3], [12, 5, 3], [8, 9, 3], [4, 13, 2], [12, 13, 2]].forEach(function (b) { rect(g, b[0], b[1], 1, b[2], 'r'); });
    [[1, 1, 3], [1, 5, 3], [1, 9, 3], [1, 13, 2]].forEach(function (b) { rect(g, b[0], b[1], 2, 1, 'Y'); });
    list.push(out('mario_brique', g));
  })();
  // Bloc à pixel : doré, « ? » blanc, rivets aux quatre coins
  (function () {
    var g = grid(16, 16); rect(g, 0, 0, 16, 16, 'y'); frame(g, 0, 0, 16, 16, 'k');
    rect(g, 1, 1, 14, 1, 'z'); rect(g, 1, 1, 1, 14, 'z'); rect(g, 2, 14, 13, 1, 'o'); rect(g, 14, 2, 1, 13, 'o');
    [[3, 3], [12, 3], [3, 12], [12, 12]].forEach(function (p) { put(g, p[0], p[1], 'k'); });
    var q = ['.xxxx.', 'xx..xx', '....xx', '...xx.', '..xx..', '..xx..', '......', '..xx..'];
    q.forEach(function (row, j) { for (var i = 0; i < row.length; i++) if (row.charAt(i) === 'x') { put(g, 5 + i + 1, 4 + j + 1, 'o'); put(g, 5 + i, 4 + j, 'w'); } });
    list.push(out('mario_bloc_pixel', g));
  })();
  // Bloc vide : pierre grise (le pixel a été pris)
  (function () {
    var g = grid(16, 16); rect(g, 0, 0, 16, 16, 'S'); frame(g, 0, 0, 16, 16, 'k'); rect(g, 1, 1, 14, 1, 'R'); rect(g, 1, 1, 1, 14, 'R'); rect(g, 2, 14, 13, 1, 'e'); rect(g, 14, 2, 1, 13, 'e');
    [[3, 3], [12, 3], [3, 12], [12, 12]].forEach(function (p) { put(g, p[0], p[1], 'k'); });
    list.push(out('mario_bloc_vide', g));
  })();
  // Marche : bloc de pierre biseauté (escaliers)
  (function () {
    var g = grid(16, 16); rect(g, 0, 0, 16, 16, 'a'); frame(g, 0, 0, 16, 16, 'k'); rect(g, 1, 1, 14, 2, 'T'); rect(g, 1, 1, 2, 14, 'T'); rect(g, 3, 13, 12, 2, 'S'); rect(g, 13, 3, 2, 12, 'S');
    put(g, 14, 1, 'a'); put(g, 1, 14, 'a'); rect(g, 5, 5, 6, 6, 't'); frame(g, 5, 5, 6, 6, 'a');
    list.push(out('mario_marche', g));
  })();
  // Tuyau de fonte : 32 px de large en deux demi-tuiles (g, d) ; haut avec collerette, corps plus étroit ; reflet à gauche, ombre à droite
  function shade(gx) { return gx <= 1 ? 'L' : gx <= 4 ? 'V' : gx <= 20 ? 'g' : gx <= 26 ? 'G' : 'H'; }
  (function () {
    [['g', 0], ['d', 16]].forEach(function (h) {
      var top = grid(16, 16), body = grid(16, 16), off = h[1];
      for (var x = 0; x < 16; x++) {
        var gx = off + x;
        for (var y = 0; y < 16; y++) put(top, x, y, shade(gx));
        if (gx >= 2 && gx <= 29) for (var y2 = 0; y2 < 16; y2++) put(body, x, y2, shade(gx));
      }
      rect(top, 0, 0, 16, 1, 'k'); rect(top, 0, 15, 16, 1, 'k'); rect(top, h[0] === 'g' ? 0 : 15, 0, 1, 16, 'k');
      rect(body, h[0] === 'g' ? 2 : 13, 0, 1, 16, 'k');
      list.push(out('mario_tuyau_h' + h[0], top)); list.push(out('mario_tuyau_c' + h[0], body));
    });
  })();
  // Champignon-plateforme : chapeau rouge à pois blancs en trois morceaux (g, m, d), et sa tige
  (function () {
    function cap(kind) {
      var g = grid(16, 8); rect(g, 0, 0, 16, 8, 'r');
      rect(g, 0, 0, 16, 1, 'k'); rect(g, 0, 7, 16, 1, 'k'); rect(g, 0, 1, 16, 1, 'o');
      [[3, 3], [10, 4], [13, 2]].forEach(function (p) { rect(g, p[0], p[1], 2, 2, 'w'); });
      if (kind === 'g') { rect(g, 0, 0, 1, 8, 'k'); put(g, 0, 0, '.'); put(g, 0, 7, '.'); put(g, 1, 0, 'k'); rect(g, 1, 1, 1, 1, 'o'); put(g, 0, 1, 'k'); rect(g, 0, 2, 1, 5, 'k'); }
      if (kind === 'd') { rect(g, 15, 0, 1, 8, 'k'); put(g, 15, 0, '.'); put(g, 15, 7, '.'); put(g, 14, 0, 'k'); }
      return g;
    }
    list.push(out('mario_champi_g', cap('g'))); list.push(out('mario_champi_m', cap('m'))); list.push(out('mario_champi_d', cap('d')));
    var s = grid(16, 16); rect(s, 5, 0, 6, 16, 'T'); rect(s, 5, 0, 1, 16, 'k'); rect(s, 10, 0, 1, 16, 'k'); rect(s, 6, 0, 1, 16, 'w'); rect(s, 9, 0, 1, 16, 'R');
    list.push(out('mario_champi_tige', s));
    // grand champignon rebondissant : 32×16, chapeau rond sur tige courte
    var b = grid(32, 24); ellipse(b, 16, 11, 16, 11, 'k'); ellipse(b, 16, 11, 15, 10, 'r'); rect(b, 0, 12, 32, 12, '.');
    rect(b, 0, 11, 32, 1, 'k'); rect(b, 1, 10, 30, 1, 'r');
    [[6, 5], [14, 3], [21, 6], [25, 3]].forEach(function (p) { rect(b, p[0], p[1], 3, 3, 'w'); });
    for (var x = 0; x < 32; x++) for (var y = 12; y < 24; y++) { b[y][x] = '.'; }
    rect(b, 11, 12, 10, 12, 'T'); rect(b, 11, 12, 1, 12, 'k'); rect(b, 20, 12, 1, 12, 'k'); rect(b, 13, 12, 1, 12, 'w'); rect(b, 18, 12, 1, 12, 'R'); rect(b, 0, 11, 32, 1, 'k');
    for (var xx = 0; xx < 32; xx++) { if (xx < 2 || xx > 29) put(b, xx, 11, 'k'); }
    list.push(out('mario_champi_rebond', b, { anchor: 'bottom-center' }));
  })();
  // Colline : demi-ellipse verte à deux yeux (décor de fond)
  (function () {
    var g = grid(64, 28); ellipse(g, 32, 28, 32, 28, 'G'); ellipse(g, 32, 28, 31, 27, 'P'); ellipse(g, 32, 28, 22, 20, 'Q'); rect(g, 0, 27, 64, 1, '.');
    [[27, 11], [36, 11]].forEach(function (p) { rect(g, p[0], p[1], 2, 5, 'k'); put(g, p[0], p[1], 'w'); });
    list.push(out('mario_colline', g, { anchor: 'bottom-center' }));
  })();
  // Gobelin (ennemi au sol) : chapeau brun, visage clair, sourcils froncés, pieds noirs
  (function () {
    var g = grid(16, 16); ellipse(g, 8, 9, 8, 8, 'k'); ellipse(g, 8, 9, 7, 7, 'W'); rect(g, 0, 10, 16, 6, '.');
    rect(g, 3, 9, 10, 4, 'Y'); rect(g, 4, 6, 2, 3, 'w'); rect(g, 10, 6, 2, 3, 'w'); put(g, 5, 8, 'k'); put(g, 10, 8, 'k'); put(g, 4, 5, 'k'); put(g, 5, 5, 'k'); put(g, 10, 5, 'k'); put(g, 11, 5, 'k');
    rect(g, 4, 11, 8, 1, 'k'); rect(g, 2, 12, 5, 3, 'k'); rect(g, 9, 12, 5, 3, 'k'); rect(g, 3, 12, 3, 2, 'X'); rect(g, 10, 12, 3, 2, 'X'); rect(g, 7, 0, 2, 1, 'k');
    ellipse(g, 8, 4, 5, 3, 'W'); rect(g, 6, 3, 2, 1, 'F');
    list.push(out('mario_gobelin', g, { anchor: 'bottom-center' }));
  })();
  // Mât d'arrivée : mât gris, boule dorée, fanion rouge
  (function () {
    var g = grid(24, 64); rect(g, 11, 6, 2, 58, 'm'); rect(g, 11, 6, 1, 58, 'w'); rect(g, 12, 6, 1, 58, 'S'); ellipse(g, 12, 4, 3, 3, 'k'); ellipse(g, 12, 4, 2, 2, 'y');
    for (var j = 0; j < 12; j++) rect(g, 13, 10 + j, Math.max(1, 10 - Math.abs(j - 6)), 1, j < 1 || j > 10 ? 'k' : 'r'); rect(g, 8, 62, 8, 2, 'S');
    list.push(out('mario_mat', g, { anchor: 'bottom-center' }));
  })();
  return list;
})();
