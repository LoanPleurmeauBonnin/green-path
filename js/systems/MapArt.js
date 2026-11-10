/**
 * MapArt — carte du monde en vue de côté (sélecteur de niveaux façon plateforme), assemblée avec les tuiles
 * de la planche « carte » (GP.SPRITES.carte), et monuments dessinés par code (secours).
 *
 * Un long plateau : un chemin de terre (le centre reste libre pour la ligne verte) qui monte et descend par pas
 * de 8 px grâce aux tuiles de pente, de la terre, un quai de pierre, l'eau ; deux bras d'eau franchis par un pont.
 * Les 12 étapes sont espacées de 190 px.
 *
 * Textures créées :
 *   lm_<id>, lm_<id>_gris   monument dessiné par code (secours si le lieu n'a pas de sprite), 32×28
 *   world_map               le terrain de la carte (WIDTH × 270)
 */
GP.MapArt = (function () {
  var PA = GP.PixelArt, T = 16;
  var GAP = 190, X0 = 120, H = 270, WATER = 216;
  /** Haut de la tuile de chemin à chaque étape (pas de 8 px : une tuile de pente par pas). */
  var TOPS = [184, 176, 168, 176, 176, 184, 184, 176, 176, 184, 192, 184];
  /** Bras d'eau franchis par un pont de 3 tuiles (entre deux étapes de même hauteur) : Château → Feydeau, Machines → Graslin. */
  var BRIDGES = [3, 7];
  var WIDTH = X0 * 2 + GAP * (TOPS.length - 1), COLS = Math.ceil(WIDTH / T);

  function nodeX(i) { return X0 + i * GAP; }

  /**
   * Colonnes : { top, kind } où kind = 'flat' | 'up' (pente montante) | 'down' (pente descendante) | 'gap' (eau).
   * Les changements de hauteur se font au milieu de chaque tronçon, une tuile de pente par pas de 8 px.
   */
  var COLUMNS = (function () {
    var cols = [];
    for (var c = 0; c < COLS; c++) {
      var x = c * T + 8, i = Math.max(0, Math.min(TOPS.length - 1, Math.floor((x - X0) / GAP)));
      if (x < X0) i = 0;
      cols.push({ top: TOPS[i], kind: 'flat', seg: i });
    }
    for (var i = 0; i < TOPS.length - 1; i++) {
      var mid = Math.floor((nodeX(i) + GAP / 2) / T), d = (TOPS[i + 1] - TOPS[i]) / 8, n = Math.abs(d), k;
      for (c = mid; c < COLS && c < Math.floor(nodeX(i + 1) / T); c++) cols[c].top = TOPS[i];
      if (BRIDGES.indexOf(i) >= 0) { for (k = -1; k <= 1; k++) cols[mid + k].kind = 'gap'; continue; }
      for (k = 0; k < n; k++) {
        var cc = mid + k;
        if (d < 0) cols[cc] = { top: TOPS[i] - 8 * (k + 1), kind: 'up' };
        else cols[cc] = { top: TOPS[i] + 8 * k, kind: 'down' };
      }
      for (c = mid + n; c < Math.floor(nodeX(i + 1) / T) + 1 && c < COLS; c++) if (cols[c].kind === 'flat') cols[c].top = TOPS[i + 1];
    }
    return cols;
  })();

  /** y de la ligne verte (centre du chemin) à l'abscisse x ; le héros y pose les pieds. */
  function pathY(x) {
    var c = Math.max(0, Math.min(COLS - 1, Math.floor(x / T))), col = COLUMNS[c], t = (x - c * T) / T;
    if (col.kind === 'up') return Math.round(col.top + 4 + 8 * (1 - t));
    if (col.kind === 'down') return Math.round(col.top + 4 + 8 * t);
    return col.top + 4;
  }
  /** Vrai si x est au-dessus de l'eau (sous un pont). */
  function inGap(x) { var c = Math.floor(x / T); return c >= 0 && c < COLS && COLUMNS[c].kind === 'gap'; }
  /** Haut du talus d'herbe derrière le chemin (pour poser le décor) à l'abscisse x. */
  function vergeY(x) { return pathY(x) - 4; }

  // ---------- Monuments (32×28) ----------
  var LM = {
    jardin: function (R, D) {
      R(2, 24, 28, 3, 't'); R(4, 12, 24, 12, 'k'); R(5, 13, 22, 10, 'l');
      for (var x = 5; x < 27; x += 5) R(x, 13, 1, 10, 'w');
      R(5, 17, 22, 1, 'w');
      R(9, 8, 14, 5, 'k'); R(10, 9, 12, 4, 'l'); R(13, 5, 6, 4, 'k'); R(14, 6, 4, 3, 'l'); R(15, 2, 2, 3, 'k');
      R(5, 20, 22, 3, 'G'); R(8, 19, 3, 2, 'g'); R(18, 18, 3, 3, 'g'); R(13, 20, 3, 2, 'g');
    },
    chateau: function (R) {
      R(2, 14, 28, 13, 'k'); R(3, 15, 26, 11, 'c'); R(21, 15, 8, 11, 'C');
      for (var x = 3; x < 29; x += 4) R(x, 13, 2, 2, 'c');
      [1, 23].forEach(function (x) {
        R(x, 8, 8, 19, 'k'); R(x + 1, 9, 6, 17, 'c'); R(x + 5, 9, 2, 17, 'C');
        R(x - 1, 3, 10, 5, 'k'); R(x, 4, 8, 3, 'r'); R(x + 2, 1, 4, 3, 'k'); R(x + 3, 2, 2, 2, 'r');
        R(x + 3, 13, 2, 3, 'd');
      });
      R(12, 18, 8, 9, 'k'); R(13, 19, 6, 8, 'd'); R(14, 19, 4, 1, 't');
    },
    cathedrale: function (R, D) {
      R(6, 13, 20, 14, 'k'); R(7, 14, 18, 12, 'c');
      [2, 20].forEach(function (x) {
        R(x, 6, 10, 21, 'k'); R(x + 1, 7, 8, 20, 'c'); R(x + 6, 7, 3, 20, 'C');
        for (var i = 0; i < 4; i++) R(x + 1 + i * 2, 3, 1, 4, 'k');
        R(x + 4, 11, 2, 5, 'd'); R(x + 4, 19, 2, 4, 'd');
      });
      D(16, 17, 3, 'k'); D(16, 17, 2, 'l');
      R(14, 21, 4, 6, 'd'); R(15, 20, 2, 1, 'd');
    },
    bouffay: function (R) {
      for (var i = 0; i < 8; i++) { R(13 - i, 4 + i, 2 * i + 6, 1, 'k'); R(14 - i, 4 + i, 2 * i + 4, 1, 'r'); }
      R(5, 12, 22, 15, 'k'); R(6, 13, 20, 13, 'c');
      R(6, 18, 20, 1, 'k'); R(6, 22, 20, 1, 'k');
      [10, 15, 21].forEach(function (x) { R(x, 13, 1, 13, 'k'); });
      R(7, 14, 3, 3, 'l'); R(17, 14, 3, 3, 'l'); R(22, 14, 3, 3, 'l');
      R(7, 19, 3, 3, 'l'); R(22, 19, 3, 3, 'l');
      R(12, 20, 3, 7, 'd');
    },
    feydeau: function (R) {
      var cols = ['c', 't', 'C'], hs = [16, 20, 14], xs = [1, 11, 21];
      xs.forEach(function (x, i) {
        var h = hs[i];
        R(x, 27 - h, 10, h, 'k'); R(x + 1, 28 - h, 8, h - 2, cols[i]);
        R(x - 1, 25 - h, 12, 3, 'p');
        for (var yy = 31 - h; yy < 24; yy += 5) { R(x + 2, yy, 2, 3, 'l'); R(x + 6, yy, 2, 3, 'l'); }
      });
    },
    pommeraye: function (R) {
      R(3, 10, 26, 17, 'k'); R(4, 11, 24, 15, 't'); R(4, 11, 24, 2, 'C');
      R(11, 14, 10, 13, 'k'); R(12, 15, 8, 12, 'd'); R(13, 16, 6, 1, 'l');
      R(6, 6, 20, 5, 'k'); R(7, 7, 18, 3, 'l');
      for (var x = 7; x < 25; x += 4) R(x, 7, 1, 3, 'w');
      R(5, 15, 4, 4, 'k'); R(6, 16, 2, 2, 'l'); R(23, 15, 4, 4, 'k'); R(24, 16, 2, 2, 'l');
      R(13, 22, 6, 1, 't'); R(14, 24, 4, 1, 't');
    },
    graslin: function (R) {
      R(2, 24, 28, 3, 'k'); R(3, 25, 26, 2, 'C');
      for (var i = 0; i < 5; i++) { var w = 6 + i * 5; R(Math.round(16 - w / 2) - 1, 5 + i, w + 2, 1, 'k'); R(Math.round(16 - w / 2), 5 + i, w, 1, 'c'); }
      R(4, 10, 24, 14, 'k'); R(5, 11, 22, 12, 'c');
      for (var x = 6; x < 27; x += 4) { R(x, 11, 2, 13, 'w'); R(x + 1, 11, 1, 13, 'C'); }
      R(14, 18, 4, 6, 'd');
      [10, 15, 20].forEach(function (x) { R(x, 2, 2, 3, 'w'); });
    },
    memorial: function (R) {
      R(0, 24, 32, 4, 'b'); R(0, 23, 32, 1, 'l'); R(2, 21, 28, 3, 'e'); R(2, 21, 28, 1, 'm');
      for (var x = 3; x < 29; x += 3) { var h = 6 + ((x * 7) % 5); R(x - 1, 20 - h, 3, h + 1, 'k'); R(x, 21 - h, 1, h, (x % 2) ? 'l' : 'w'); }
      R(5, 26, 4, 1, 'l'); R(18, 27, 5, 1, 'l');
    },
    machines: function (R) {
      R(5, 8, 19, 13, 'k'); R(6, 9, 17, 11, 'e'); R(6, 9, 17, 2, 'm');
      R(21, 9, 8, 11, 'k'); R(22, 10, 6, 9, 'e');
      R(27, 17, 4, 9, 'k'); R(28, 17, 2, 8, 'e');
      R(24, 12, 2, 2, 'w'); R(25, 13, 1, 1, 'k');
      R(17, 10, 5, 8, 'k'); R(18, 11, 3, 6, 'm');
      R(7, 21, 5, 6, 'k'); R(8, 21, 3, 5, 'e'); R(17, 21, 5, 6, 'k'); R(18, 21, 3, 5, 'e');
      R(27, 20, 4, 1, 'w'); R(9, 13, 1, 1, 'y'); R(13, 15, 1, 1, 'y'); R(11, 17, 1, 1, 'y');
    },
    chantiers: function (R) {
      R(10, 24, 12, 3, 'k'); R(11, 25, 10, 1, 'e');
      R(14, 5, 4, 20, 'k'); R(15, 6, 2, 19, 'y');
      R(2, 2, 26, 4, 'k'); R(3, 3, 24, 2, 'y'); R(26, 5, 1, 12, 'k'); R(25, 16, 3, 3, 'k');
      R(21, 5, 5, 3, 'k'); R(7, 6, 7, 4, 'k'); R(8, 6, 5, 3, 'e');
      for (var y = 8; y < 24; y += 3) R(15, y, 2, 1, 'k');
    },
    buren: function (R, D, O) {
      var tops = [14, 10, 7, 9, 12, 15];
      tops.forEach(function (t, i) {
        var x = 2 + i * 5;
        R(x, t + 3, 2, 25 - t - 3, 'e'); R(x, t + 3, 1, 25 - t - 3, 'm');
        O(x + 1, t, 3, 3, 'w'); O(x + 1, t, 2, 2, 'l');
      });
      R(0, 26, 32, 2, 'b');
    },
    // Tour LU : tour de brique et de pierre coiffée d'une coupole à lanternon (dessin original, stylisé)
    tourlu: function (R, D) {
      R(8, 24, 16, 4, 'k'); R(9, 25, 14, 2, 't');
      R(10, 11, 12, 14, 'k'); R(11, 12, 10, 12, 'c'); R(11, 12, 2, 12, 'C'); R(13, 15, 6, 4, 'd'); R(14, 20, 4, 4, 'd');
      R(9, 9, 14, 3, 'k'); R(10, 10, 12, 1, 'y');
      D(16, 8, 5, 'k'); D(16, 8, 4, 'b'); R(14, 5, 2, 2, 'l');
      R(15, 1, 2, 4, 'k'); R(15, 2, 2, 1, 'y');
    },
    hangar: function (R) {
      R(1, 13, 30, 14, 'k'); R(2, 14, 28, 12, 't'); R(2, 14, 28, 2, 'C');
      R(0, 10, 32, 4, 'k'); R(1, 11, 30, 2, 'r');
      [4, 12, 20].forEach(function (x) { R(x, 18, 6, 9, 'k'); R(x + 1, 19, 4, 8, 'd'); });
      R(11, 5, 10, 2, 'y'); R(9, 6, 3, 3, 'y'); R(20, 6, 3, 3, 'y'); R(11, 7, 10, 1, 'k');
    }
  };
  var LM_BY_ID = {
    'jardin-des-plantes': 'jardin', 'chateau': 'chateau', 'cathedrale': 'cathedrale', 'bouffay': 'bouffay',
    'feydeau': 'feydeau', 'pommeraye': 'pommeraye', 'graslin': 'graslin', 'memorial': 'memorial',
    'machines': 'machines', 'chantiers': 'chantiers', 'buren': 'buren', 'hangar': 'hangar', 'tour-lu': 'tourlu'
  };

  function drawLandmark(id) {
    var o = PA.canvas(32, 28), ctx = o.ctx;
    function Rr(x, y, w, h, c) { PA.rect(ctx, x, y, w, h, c); }
    function D(cx, cy, r, c) { PA.disc(ctx, cx, cy, r, c); }
    function O(cx, cy, rx, ry, c) { PA.ellipse(ctx, cx, cy, rx, ry, c); }
    LM[LM_BY_ID[id]](Rr, D, O);
    return o.cv;
  }

  /** Version grise (luminance, sans teinte, légèrement éclaircie) : le monument « en mémoire ». */
  function toGrey(cv) {
    var o = PA.canvas(cv.width, cv.height);
    o.ctx.drawImage(cv, 0, 0);
    var img = o.ctx.getImageData(0, 0, cv.width, cv.height), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = Math.round((0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) * 0.8 + 38);
      d[i] = d[i + 1] = d[i + 2] = v;
    }
    o.ctx.putImageData(img, 0, 0);
    return o.cv;
  }

  /** Image source d'un sprite de planche (ou null). */
  function img(scene, key) { return scene.textures.exists(key) ? scene.textures.get(key).getSourceImage() : null; }

  /** Terrain de la carte à partir des tuiles de la planche « carte ». */
  function drawWorld(scene) {
    var o = PA.canvas(WIDTH, H), ctx = o.ctx, rnd = PA.rng(77);
    function put(key, x, y) { var im = img(scene, key); if (im) ctx.drawImage(im, x, y); }
    /** Dessine seulement dans la bande [y, y + h) de la colonne x. */
    function clip(x, y, h, fn) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, T, h); ctx.clip(); fn(); ctx.restore(); }
    // eau (toute la largeur, derrière le quai)
    for (var x = 0; x < WIDTH; x += T) { put('carte_eau_surface', x, WATER + 6); for (var y = WATER + 22; y < H; y += T) put('carte_eau_profonde', x, y); }
    COLUMNS.forEach(function (col, c) {
      var x = c * T;
      if (col.kind === 'gap') return;
      // Chaque couche est découpée à sa bande : la terre ne remonte jamais au-dessus du chemin,
      // et du talus on ne garde que l'herbe (pas sa terre), sinon on voit des bandes marron sur les pentes.
      clip(x, col.top + T, WATER - col.top - T, function () {
        for (var y = WATER - 2 * T; y > col.top; y -= T) put('carte_falaise_a', x, y);   // terre sous le chemin
        put('carte_falaise_b', x, WATER - T);                                           // pierre du quai
      });
      put('carte_falaise_pied', x, WATER);                                              // pied du quai dans l'eau
      clip(x, col.top - 6, 7, function () { put('carte_plateau_herbe_haut_' + (1 + (c % 3)), x, col.top - 6); });   // talus d'herbe
      var tile = col.kind === 'up' ? 'carte_chemin_pente_montante' : col.kind === 'down' ? 'carte_chemin_pente_descendante'
        : 'carte_chemin_plat_' + (1 + Math.floor(rnd() * 3));
      put(tile, x, col.top);
      // bord de falaise au-dessus d'un bras d'eau
      var left = c > 0 && COLUMNS[c - 1].kind === 'gap', right = c < COLS - 1 && COLUMNS[c + 1].kind === 'gap';
      if (left || right) { ctx.fillStyle = GP.PAL.k; ctx.fillRect(right ? x + T - 1 : x, col.top + 1, 1, WATER + 9 - col.top); }
    });
    // ponts de bois au-dessus des bras d'eau
    BRIDGES.forEach(function (i) {
      var mid = Math.floor((nodeX(i) + GAP / 2) / T);
      put('carte_pont_bois', (mid - 1) * T, COLUMNS[mid - 2].top);
    });
    return o.cv;
  }

  /** Texture du monument d'un lieu (sprite de planche, ou dessin de secours), en couleur ou en gris. */
  function monument(loc, grey) {
    if (loc.sprite && GP.Sprites && GP.Sprites.has(loc.sprite)) return loc.sprite + (grey ? '_gris' : '');
    return 'lm_' + loc.id + (grey ? '_gris' : '');
  }

  /** Crée les textures des monuments de secours (couleur et gris) et le terrain de la carte. */
  function build(scene) {
    GP.LOCATIONS.forEach(function (l) {
      if (!LM_BY_ID[l.id]) return;
      var cv = drawLandmark(l.id);
      PA.toTexture(scene, 'lm_' + l.id, cv);
      PA.toTexture(scene, 'lm_' + l.id + '_gris', toGrey(cv));
    });
    PA.toTexture(scene, 'world_map', drawWorld(scene));
  }

  return { build: build, nodeX: nodeX, pathY: pathY, vergeY: vergeY, inGap: inGap, monument: monument, WIDTH: WIDTH, WATER: WATER, GAP: GAP, BRIDGES: BRIDGES };
})();
