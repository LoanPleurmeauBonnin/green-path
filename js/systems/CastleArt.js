/** Architecture du Château, dessin stylisé original : pas un relevé ni une restitution historique.
 * Maçonnerie défensive grise, encadrements clairs, échafaudage bois et Grand Logis de la planche existante.
 * Les volumes de fond sont visuels ; les linteaux/appuis jouables restent dans LevelBuilder.
 */
GP.CastleArt = (function () {
  function makeTextures(scene) {
    if (scene.textures.exists('castle_rubble_1')) return;
    [1, 2].forEach(function (n) {
      var o = GP.PixelArt.canvas(16, 16), c = o.ctx, P = GP.PAL;
      c.fillStyle = P.e; c.fillRect(0, 0, 16, 16);
      for (var y = 0; y < 16; y += 8) {
        c.fillStyle = P.d; c.fillRect(0, y + 7, 16, 1);
        for (var x = (y / 8 % 2) * 8 - 16; x < 16; x += 16) {
          c.fillRect(x, y, 1, 7); c.fillStyle = (y + x + n * 4) % 12 ? P.m : P.t;
          c.fillRect(x + 2, y + 1, 9, 1); c.fillStyle = P.d;
        }
      }
      GP.PixelArt.toTexture(scene, 'castle_rubble_' + n, o.cv);
    });
    var paving = GP.PixelArt.canvas(16, 16), pc = paving.ctx;
    pc.fillStyle = GP.PAL.e; pc.fillRect(0, 0, 16, 16);
    pc.fillStyle = GP.PAL.d; pc.fillRect(0, 8, 16, 1); pc.fillRect(7, 1, 1, 7); pc.fillRect(12, 9, 1, 7);
    pc.fillStyle = GP.PAL.k; pc.fillRect(0, 0, 16, 1);
    pc.fillStyle = GP.PAL.m; pc.fillRect(0, 1, 16, 2);
    GP.PixelArt.toTexture(scene, 'castle_pave', paving.cv);
    ['g', 'm', 'd'].forEach(function (side) {
      var deck = GP.PixelArt.canvas(16, 8), dc = deck.ctx;
      dc.fillStyle = GP.PAL.k; dc.fillRect(0, 0, 16, 8);
      dc.fillStyle = GP.PAL.t; dc.fillRect(0, 1, 16, 4);
      dc.fillStyle = GP.PAL.r; dc.fillRect(0, 5, 16, 2);
      dc.fillStyle = GP.PAL.k; dc.fillRect(7, 2, 1, 3);
      if (side !== 'm') dc.fillRect(side === 'g' ? 0 : 15, 1, 1, 6);
      GP.PixelArt.toTexture(scene, 'castle_deck_' + side, deck.cv);
    });
  }

  function build(scene, L) {
    makeTextures(scene);
    var o = GP.PixelArt.canvas(L.width * 16, L.rows * 16), c = o.ctx, P = GP.PAL;
    function rect(x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
    function masonry(x, y, w, h, dark) {
      rect(x, y, w, h, P.k); rect(x + 1, y + 1, w - 2, h - 1, dark ? P.d : P.e);
      for (var row = 0; row < h - 2; row += 8) {
        rect(x + 1, y + row + 7, w - 2, 1, dark ? P.k : P.d);
        for (var col = 2 + (row / 8 % 2) * 8; col < w - 2; col += 16) {
          rect(x + col, y + row + 1, 1, 6, dark ? P.k : P.d);
          rect(x + col + 2, y + row + 2, Math.min(7, w - col - 3), 1, dark ? P.e : P.m);
        }
      }
      rect(x + 1, y + 1, w - 2, 3, P.m);
    }
    function slit(x, y) {
      rect(x - 3, y - 2, 7, 18, P.t); rect(x - 1, y, 3, 14, P.k); rect(x - 4, y + 5, 9, 2, P.k);
    }
    function merlons(x, y, w) {
      for (var dx = 0; dx < w; dx += 16) {
        rect(x + dx, y - 8, 9, 8, P.k); rect(x + dx + 1, y - 7, 7, 7, P.e);
        rect(x + dx + 1, y - 7, 7, 2, P.m);
      }
    }
    function tower(x, top, floor, w) {
      masonry(x, top + 8, w, floor - top - 8, false);
      rect(x + 1, top + 9, 5, floor - top - 9, P.d); rect(x + w - 7, top + 9, 6, floor - top - 9, P.d);
      merlons(x, top + 8, w);
      for (var y = top + 32; y < floor - 32; y += 40) slit(x + w / 2, y);
      rect(x - 2, floor - 9, w + 4, 9, P.d); rect(x - 1, floor - 9, w + 2, 2, P.m);
    }
    function arch(x, ceiling, floor, w) {
      // Vue de face d'une baie : les côtés restent derrière le passage, jamais deux obstacles ajoutés.
      rect(x, ceiling, w, floor - ceiling, P.k);
      rect(x + 2, ceiling + 5, w - 4, floor - ceiling - 5, P.d);
      rect(x - 4, ceiling + 7, 4, floor - ceiling - 7, P.t);
      rect(x + w, ceiling + 7, 4, floor - ceiling - 7, P.t);
      rect(x - 2, ceiling + 2, w + 4, 4, P.c);
      rect(x - 5, ceiling + 5, 5, 3, P.c); rect(x + w, ceiling + 5, 5, 3, P.c);
    }
    function beam(x0, y0, x1, y1, color, size) {
      var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (var i = 0; i <= n; i++) rect(Math.round(x0 + (x1 - x0) * i / (n || 1)), Math.round(y0 + (y1 - y0) * i / (n || 1)), size || 2, size || 2, color);
    }

    // Abord et châtelet : enceinte continue, deux tours encadrant une liaison basse.
    masonry(0, 222, 192, 18, true); merlons(0, 222, 192);
    tower(10 * 16, 152, 240, 32);
    tower(20 * 16, 144, 240, 32);
    masonry(34 * 16, 154, 36 * 16, 86, true);
    tower(38 * 16, 64, 240, 8 * 16);
    tower(54 * 16, 64, 240, 8 * 16);
    arch(40 * 16, 192, 240, 64); arch(56 * 16, 192, 240, 64);
    merlons(46 * 16, 154, 8 * 16);
    // Les chaînes des deux ponts sont attachées aux petites tours de leur rive gauche.

    // Courtine arrière du chantier, montants bois et contreventements : une ossature, pas des aiguilles de pierre.
    masonry(72 * 16, 112, 34 * 16, 208, true);
    merlons(72 * 16, 112, 34 * 16);
    [[82,12,4], [88,10,4], [95,11,4]].forEach(function (p) {
      var x = p[0] * 16, y = p[1] * 16, w = p[2] * 16, bottom = 290;
      [x + 2, x + w - 5].forEach(function (bx) {
        rect(bx, y + 5, 4, bottom - y - 5, P.k); rect(bx + 1, y + 5, 2, bottom - y - 5, P.t);
      });
      for (var sy = y + 20; sy < bottom - 16; sy += 32) {
        beam(x + 4, sy, x + w - 4, sy + 28, P.t, 2);
        beam(x + w - 4, sy, x + 4, sy + 28, P.r, 2);
      }
      rect(x, y + 8, w, 3, P.t);
    });
    // Parapet du chemin de ronde derrière le héros : les tabliers ont des consoles attachées aux culées.
    [[101,114], [117,126], [129,142]].forEach(function (range) {
      var x = range[0] * 16, w = (range[1] - range[0]) * 16;
      masonry(x, 122, w, 22, false); merlons(x, 122, w);
    });
    [[114,117], [126,129]].forEach(function (range) {
      var x = range[0] * 16, right = range[1] * 16;
      beam(x - 16, 176, x + 12, 151, P.t, 3); beam(right + 14, 176, right - 12, 151, P.t, 3);
    });
    // Cour : un mur bas et ses joints suffisent à lier l'arrivée au Grand Logis de la planche.
    masonry(148 * 16, 191, 22 * 16, 17, true);
    var keys = GP.LevelArt.chunks(scene, 'castle_architecture', o.cv);
    keys.forEach(function (key, i) { scene.add.image(i * GP.LevelArt.CHUNK, 0, key).setOrigin(0).setDepth(1); });

    // Bannières : le vent reste lisible sur les parties ouvertes, sans animation obligatoire.
    var flags = [36, 64, 110, 140].map(function (x) {
      var y = x < 70 ? 170 : 96;
      scene.add.rectangle(x * 16, y + 15, 2, 42, GP.int(P.k)).setDepth(3);
      return scene.add.image(x * 16, y, 'chateau_banniere_hermine').setOrigin(0, 0).setDepth(3);
    });
    return { flags: flags };
  }
  return { makeTextures: makeTextures, build: build };
})();
