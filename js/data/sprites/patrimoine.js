/* Planche « patrimoine » — sprites dessinés par code (novembre 2026) pour le niveau de Graslin : bloc de tuffeau, bloc au blason de l'hermine
 * (les trois mouchetures de la Bretagne), colonne cannelée à chapiteau (demi-tuiles gauche et droite) et pigeon de la place.
 * Palette du jeu (GP.SPRITE_PAL) ; chaque sprite est un tableau de lignes de lettres, « . » = transparent. */
window.GP = window.GP || {};
GP.SPRITES = GP.SPRITES || {};
GP.SPRITES["patrimoine"] = (function () {
  function grid(w, h) { var g = []; for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push('.'); g.push(r); } return g; }
  function put(g, x, y, c) { if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c; }
  function rect(g, x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) put(g, x + i, y + j, c); }
  function ellipse(g, cx, cy, rx, ry, c) { for (var y = 0; y < g.length; y++) for (var x = 0; x < g[0].length; x++) { var dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry; if (dx * dx + dy * dy <= 1) g[y][x] = c; } }
  function out(id, g, extra) { return Object.assign({ id: id, w: g[0].length, h: g.length, anchor: 'top-left', tile_x: false, rows: g.map(function (r) { return r.join(''); }) }, extra || {}); }
  var list = [];

  // Tuffeau : pierre de taille claire, assises décalées, joints plus sombres
  function tuffeau() {
    var g = grid(16, 16); rect(g, 0, 0, 16, 16, 'c');
    [5, 10].forEach(function (y) { rect(g, 0, y, 16, 1, 't'); });
    [[8, 0, 5], [3, 5, 5], [12, 5, 5], [8, 10, 6]].forEach(function (j) { rect(g, j[0], j[1], 1, j[2], 't'); });
    [[2, 2], [11, 3], [5, 7], [13, 8], [2, 12], [9, 13]].forEach(function (p) { put(g, p[0], p[1], 'C'); });
    rect(g, 0, 0, 16, 1, 'T'); rect(g, 0, 0, 1, 16, 'T'); rect(g, 0, 15, 16, 1, 'a'); rect(g, 15, 0, 1, 16, 'a');
    return g;
  }
  list.push(out('patrimoine_tuffeau', tuffeau()));
  // Bloc au blason : tuffeau, cadre doré, écu blanc aux trois mouchetures d'hermine (le « bloc à pixel »)
  (function () {
    var g = tuffeau(); rect(g, 2, 2, 12, 12, 'o'); rect(g, 3, 3, 10, 10, 'y'); rect(g, 3, 3, 10, 1, 'z'); rect(g, 3, 3, 1, 10, 'z');
    rect(g, 4, 4, 8, 8, 'w'); rect(g, 4, 4, 8, 1, 'T');
    [[6, 5], [10, 5], [8, 8]].forEach(function (p) { put(g, p[0], p[1], 'k'); put(g, p[0], p[1] + 1, 'k'); put(g, p[0] - 1, p[1] + 2, 'k'); put(g, p[0] + 1, p[1] + 2, 'k'); });
    rect(g, 2, 2, 12, 1, 'k'); rect(g, 2, 13, 12, 1, 'k'); rect(g, 2, 2, 1, 12, 'k'); rect(g, 13, 2, 1, 12, 'k');
    list.push(out('patrimoine_blason', g));
  })();
  // Colonne cannelée de 32 px en deux demi-tuiles : chapiteau (haut) et fût (corps) ; reflet à gauche, ombre à droite
  (function () {
    function tone(x) { var f = x % 4; return x < 6 ? 'T' : x > 25 ? 'a' : f === 1 ? 'T' : f === 3 ? 't' : 'c'; }
    [['g', 0], ['d', 16]].forEach(function (h) {
      var top = grid(16, 16), body = grid(16, 16), off = h[1];
      for (var x = 0; x < 16; x++) {
        var gx = off + x;
        if (gx >= 4 && gx <= 27) for (var y = 3; y < 16; y++) put(top, x, y, tone(gx));
        for (var y2 = 0; y2 < 3; y2++) put(top, x, y2, y2 === 2 ? 'a' : 'T');   // abaque
        if (gx >= 5 && gx <= 26) for (var y3 = 0; y3 < 16; y3++) put(body, x, y3, tone(gx));
      }
      // volutes du chapiteau
      [[5, 4], [26, 4]].forEach(function (v) { var lx = v[0] - off; put(top, lx, 5, 'C'); put(top, lx, 6, 'C'); put(top, lx + (v[0] < 16 ? 1 : -1), 7, 'C'); });
      rect(top, 4 - off > 0 ? 4 - off : 0, 11, 0, 0, 'k');
      // contours
      rect(top, 0, 0, 16, 1, 'k'); if (h[0] === 'g') { rect(top, 0, 0, 1, 3, 'k'); rect(top, 4, 3, 1, 13, 'k'); } else { rect(top, 15, 0, 1, 3, 'k'); rect(top, 27 - off, 3, 1, 13, 'k'); }
      rect(body, h[0] === 'g' ? 5 : 26 - off, 0, 1, 16, 'k');
      list.push(out('patrimoine_colonne_h' + h[0], top)); list.push(out('patrimoine_colonne_c' + h[0], body));
    });
  })();
  // Pigeon de la place : gris, col irisé, bec et pattes orangés (regarde à droite)
  (function () {
    var g = grid(16, 16); ellipse(g, 7, 10, 6, 4, 'k'); ellipse(g, 7, 10, 5, 3, 'm'); ellipse(g, 11, 7, 3.5, 3.5, 'k'); ellipse(g, 11, 7, 2.5, 2.5, 'm');
    rect(g, 9, 9, 3, 2, 'p'); rect(g, 2, 8, 5, 2, 'e'); rect(g, 3, 10, 6, 1, 'e'); rect(g, 1, 11, 3, 1, 'e'); rect(g, 6, 12, 5, 1, 'T');
    put(g, 12, 6, 'k'); put(g, 12, 5, 'o'); rect(g, 14, 7, 2, 1, 'y'); put(g, 15, 8, 'o'); rect(g, 5, 14, 1, 2, 'o'); rect(g, 9, 14, 1, 2, 'o'); rect(g, 4, 15, 3, 1, 'o'); rect(g, 8, 15, 3, 1, 'o');
    list.push(out('patrimoine_pigeon', g, { anchor: 'bottom-center' }));
  })();
  return list;
})();
