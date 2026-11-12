/**
 * LevelArt — décor des niveaux en vue de côté (inspiration plateforme 16 bits, dessin original généré par code).
 *
 * Textures (créées une fois au démarrage) :
 *   lv_sky_<day|cloudy|grey|storm|night>  ciel en bandes 480×270          lv_stars  étoiles et lune
 *   lv_mount, lv_hills                     montagnes / collines (parallaxe, raccord horizontal)
 *   lv_cloud                               nuage
 *   lv_thorn, lv_lantern_on/off, lv_sign, lv_pixel                         éléments de jeu
 *   lv_tree, lv_tree2, lv_bush, lv_rock, lv_flower_r/y/w, lv_tuft         verdure
 *   lv_tileset                             tuiles invisibles de collision (1 terre, 2 pierre, 3 sens unique)
 * Le terrain d'un niveau est peint dans une seule grande image : renderTerrain(scene, key, level).
 */
GP.LevelArt = (function () {
  var PA = GP.PixelArt, T = 16;

  // Couleurs propres au décor (complètent GP.PAL).
  var C = {
    dirt: '#a0643a', dirtD: '#7a4527', dirtL: '#c88850',
    stone: '#8c94a3', stoneL: '#bcc3cf', stoneD: '#5d6475',
    mount: '#6f8fcf', mountL: '#8eabe0', snow: '#e9f1fb',
    hill: '#62b25d', hillD: '#4c9a4e', leafL: '#9cf0c0', bramble: '#5b3f6e', brambleD: '#3d2a4f'
  };
  var SKIES = {
    day: ['#4d8fe0', '#5c9be6', '#6ea8ec', '#82b6f0', '#99c6f4', '#b3d6f7', '#cde6fa'],
    cloudy: ['#6f9bd0', '#7aa4d5', '#87addb', '#96b8e0', '#a6c4e5', '#b8d0ea', '#cbdcef'],
    grey: ['#8a94a6', '#939dae', '#9ca6b6', '#a7b0bf', '#b2bac7', '#bec5d0', '#cbd1da'],
    storm: ['#3f4659', '#474f63', '#50586d', '#5a6277', '#656d82', '#71798d', '#7e8699'],
    night: ['#0c1130', '#111a40', '#16224e', '#1c2b5c', '#24356a', '#2d4078', '#384c86']
  };

  function R(ctx, x, y, w, h, c) { PA.rect(ctx, x, y, w, h, c); }
  function P(ctx, x, y, c) { PA.rect(ctx, x, y, 1, 1, c); }

  // ---------- Ciel ----------
  function drawSky(kind) {
    var o = PA.canvas(480, 270), bands = SKIES[kind], bh = Math.ceil(270 / bands.length);
    for (var i = 0; i < bands.length; i++) {
      R(o.ctx, 0, i * bh, 480, bh, bands[i]);
      // trame de transition (une ligne de pixels alternés) : bandes nettes, rendu pixel
      if (i < bands.length - 1) for (var x = 0; x < 480; x += 2) P(o.ctx, x + (i % 2), (i + 1) * bh - 1, bands[i + 1]);
    }
    return o.cv;
  }
  function drawStars() {
    var o = PA.canvas(480, 180), rnd = PA.rng(42);
    for (var i = 0; i < 70; i++) { var c = rnd() < 0.2 ? '#fff6c8' : '#dfe8ff'; P(o.ctx, Math.floor(rnd() * 480), Math.floor(rnd() * 170), c); }
    for (i = 0; i < 6; i++) { var x = Math.floor(rnd() * 470), y = Math.floor(rnd() * 150); P(o.ctx, x, y, '#ffffff'); P(o.ctx, x - 1, y, '#9fb3e6'); P(o.ctx, x + 1, y, '#9fb3e6'); P(o.ctx, x, y - 1, '#9fb3e6'); P(o.ctx, x, y + 1, '#9fb3e6'); }
    PA.disc(o.ctx, 400, 34, 11, '#f4efc8');
    // croissant : on efface un disque décalé
    o.ctx.globalCompositeOperation = 'destination-out'; PA.disc(o.ctx, 406, 29, 9, '#000'); o.ctx.globalCompositeOperation = 'source-over';
    return o.cv;
  }

  // ---------- Montagnes et collines (largeur 320, raccord horizontal) ----------
  function drawMountains() {
    var w = 320, h = 110, o = PA.canvas(w, h), peaks = [[40, 92], [130, 70], [215, 100], [290, 64]];
    for (var x = 0; x < w; x++) {
      var top = h, side = 0;
      peaks.forEach(function (p) {
        var dx = Math.min(Math.abs(x - p[0]), w - Math.abs(x - p[0]));
        var t = h - p[1] + dx * 0.9;
        if (t < top) { top = t; side = ((x - p[0] + w * 1.5) % w) - w / 2 < 0 ? -1 : 1; }
      });
      top = Math.round(top);
      R(o.ctx, x, top, 1, h - top, side < 0 ? C.mountL : C.mount);
      if (h - top > 60) R(o.ctx, x, top, 1, Math.min(6 + (x % 3), h - top), C.snow);
    }
    return o.cv;
  }
  function drawHills() {
    var w = 320, h = 70, o = PA.canvas(w, h), humps = [[50, 46, 40], [160, 30, 52], [260, 50, 36]];
    for (var x = 0; x < w; x++) {
      var top = h;
      humps.forEach(function (p) {
        var dx = Math.min(Math.abs(x - p[0]), w - Math.abs(x - p[0]));
        if (dx < p[2]) top = Math.min(top, h - p[1] * Math.sqrt(1 - (dx / p[2]) * (dx / p[2])));
      });
      top = Math.round(top);
      R(o.ctx, x, top, 1, h - top, C.hill);
      P(o.ctx, x, top, GP.PAL.k);
    }
    var rnd = PA.rng(5);
    for (var i = 0; i < 16; i++) { var xx = Math.floor(rnd() * w), yy = 40 + Math.floor(rnd() * 26); R(o.ctx, xx, yy, 2, 3, C.hillD); }
    return o.cv;
  }

  // ---------- Petits éléments (tableaux de pixels) ----------
  var SPRITES = {
    lv_thorn: ['....w......w....', '...kpk....kpk...', '..kpppk..kpkpk..', '.wkphpkwkpk.kpw.', '..kpkhkpppkhhpk.', '.kppk.kphpk.kpk.',
      'wkphpkkpkpkkphkw', '.kpkhppkhkpppkk.', 'kphkpkhpkpkhkpk.', 'kpppkpkppkhppphk', 'khppphpkpphpkppk', 'kkkkkkkkkkkkkkkk'],
    lv_pixel: ['kkkkkkkk', 'kwwyyyyk', 'kwyyyyyk', 'kyyyyyyk', 'kyyyyyok', 'kyyyyook', 'kyyooook', 'kkkkkkkk'],
    lv_sign: ['kkkkkkkkkkkkkkkk', 'ktttttttttttttCk', 'ktttttkkkttttttk', 'kttttkttCkttttCk', 'ktttttttkktttttk', 'kttttttkkttttttk', 'ktttttttttttttCk',
      'kttttttkkttttttk', 'kCtttttttttttCCk', 'kkkkkkkkkkkkkkkk', '......kddk......', '......kddk......', '......kddk......', '......kddk......', '.....kkddkk.....', '....kkkkkkkk....'],
    lv_flower_r: ['.r.', 'ryr', '.r.', '.h.', 'hh.'],
    lv_flower_y: ['.y.', 'ywy', '.y.', '.h.', '.hh'],
    lv_flower_w: ['.w.', 'wyw', '.w.', '.h.', 'hh.'],
    lv_tuft: ['.g...g.', '.g.g.g.', 'gGgGgGg', 'GGGGGGG'],
    lv_rock: ['....kkkkk.....', '..kkmmmmmkk...', '.kmmwmmmmmekk.', 'kmmmmmmmmmeeek', 'kmmmmmmmmeeeek', 'kemmmmmmeeeeek', 'keeeeeeeeeeek.', '.kkkkkkkkkkkk.']
  };
  function lantern(on) {
    var g = on ? 'y' : 'e', g2 = on ? 'w' : 'm';
    return ['...kkkk...', '..kGGGGk..', '.kGgGGGGk.', 'kkkkkkkkkk', '.k' + g + g + g + g + g + g + 'k.', '.k' + g + g2 + g2 + g + g + g + 'k.', '.k' + g + g2 + g + g + g + g + 'k.',
      '.k' + g + g + g + g + g + g + 'k.', '.k' + g + g + g + g + g + g + 'k.', 'kkkkkkkkkk', '...kddk...', '...kddk...', '...kddk...', '...kddk...', '...kddk...', '...kddk...',
      '...kddk...', '...kddk...', '...kddk...', '...kddk...', '..kkddkk..', '.kkkkkkkk.'];
  }

  function drawTree(big) {
    var w = big ? 46 : 32, h = big ? 58 : 42, r = big ? 16 : 11, o = PA.canvas(w, h), ctx = o.ctx, cx = w / 2, cy = r + 2;
    // tronc
    R(ctx, cx - 4, cy + r - 4, 8, h - (cy + r - 4), GP.PAL.k); R(ctx, cx - 3, cy + r - 4, 6, h - (cy + r - 4) - 1, C.dirtD); R(ctx, cx - 2, cy + r - 4, 2, h - (cy + r - 4) - 1, C.dirt);
    // feuillage rond cerclé de noir, avec deux bosses
    PA.disc(ctx, cx, cy, r + 1, GP.PAL.k); PA.disc(ctx, cx - r + 3, cy + 4, Math.round(r / 2) + 1, GP.PAL.k); PA.disc(ctx, cx + r - 3, cy + 4, Math.round(r / 2) + 1, GP.PAL.k);
    PA.disc(ctx, cx, cy, r, GP.PAL.G); PA.disc(ctx, cx - r + 3, cy + 4, Math.round(r / 2), GP.PAL.G); PA.disc(ctx, cx + r - 3, cy + 4, Math.round(r / 2), GP.PAL.G);
    PA.disc(ctx, cx - Math.round(r / 3), cy - Math.round(r / 3), Math.round(r / 2), GP.PAL.g);
    P(ctx, cx - Math.round(r / 2), cy - Math.round(r / 2), C.leafL); P(ctx, cx - Math.round(r / 2) + 1, cy - Math.round(r / 2), C.leafL);
    for (var x = cx - r + 2; x < cx + r - 2; x++) if ((x * 7) % 5 === 0) P(ctx, x, cy + r - 3, GP.PAL.h);
    return o.cv;
  }
  function drawBush() {
    var o = PA.canvas(34, 16), ctx = o.ctx;
    [[8, 10, 6], [17, 8, 8], [26, 10, 6]].forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2] + 1, GP.PAL.k); });
    [[8, 10, 6], [17, 8, 8], [26, 10, 6]].forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2], GP.PAL.G); });
    PA.disc(ctx, 14, 5, 2, GP.PAL.g); PA.disc(ctx, 6, 8, 1, GP.PAL.g); PA.disc(ctx, 24, 8, 1, GP.PAL.g);
    R(ctx, 0, 15, 34, 1, GP.PAL.k);
    o.ctx.clearRect(0, 16, 34, 1);
    return o.cv;
  }
  function drawCloud() {
    var o = PA.canvas(42, 20), ctx = o.ctx, parts = [[10, 12, 7], [20, 8, 8], [31, 12, 7]];
    parts.forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2] + 1, '#7f9cc8'); });
    parts.forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2], '#ffffff'); });
    R(ctx, 4, 15, 34, 3, '#dfe9f7'); R(ctx, 4, 18, 34, 1, '#7f9cc8');
    PA.disc(ctx, 17, 6, 2, '#ffffff');
    return o.cv;
  }

  /** Tuiles de collision (non affichées) : 1 terre, 2 pierre, 3 sens unique, 4 topiaire, 5 pavés. */
  function drawTileset() { var o = PA.canvas(T * 6, T); R(o.ctx, 0, 0, T * 6, T, '#ff00ff'); return o.cv; }

  // ---------- Décors propres au niveau 1 (dessins originaux, stylisés d'après des photos de repérage) ----------
  /** Arrêt de tram : deux panneaux de verre verts et un auvent en champignon. */
  function drawTramStop() {
    var o = PA.canvas(48, 46), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 2, 4, 44, 6, k); R(ctx, 3, 5, 42, 4, '#dfe6ea'); R(ctx, 3, 8, 42, 1, GP.PAL.m);      // auvent
    R(ctx, 21, 9, 6, 8, k); R(ctx, 22, 9, 4, 8, GP.PAL.e);                                       // pied du champignon
    [6, 28].forEach(function (x) {                                                                // panneaux de verre verts
      R(ctx, x, 16, 14, 28, k); R(ctx, x + 1, 17, 12, 26, '#57b88a'); R(ctx, x + 1, 17, 12, 3, '#8fd9b3');
      R(ctx, x + 3, 22, 1, 16, '#c4f0d8');
    });
    R(ctx, 22, 17, 4, 27, k); R(ctx, 23, 17, 2, 27, GP.PAL.m);
    R(ctx, 4, 44, 40, 2, k);
    R(ctx, 8, 12, 32, 3, GP.PAL.g); R(ctx, 8, 12, 32, 1, k);                                    // bandeau vert de la station
    return o.cv;
  }
  /** Bâtiment de verre à façade en résille (fond de la gare). */
  function drawGlassBuilding() {
    var w = 120, h = 92, o = PA.canvas(w, h), ctx = o.ctx;
    R(ctx, 0, 0, w, h, GP.PAL.k); R(ctx, 2, 2, w - 4, h - 2, '#7fb6d0');
    for (var y = 2; y < h; y += 6) for (var x = 2 + ((y / 6) % 2) * 4; x < w - 2; x += 8) { R(ctx, x, y, 4, 4, '#a9d4e6'); P(ctx, x, y, '#e6f4fa'); }
    for (y = 2; y < h; y += 3) for (x = (y % 6) ? 6 : 2; x < w - 2; x += 8) P(ctx, x, y, '#4f7f99');   // résille
    R(ctx, 0, 30, w, 2, GP.PAL.k); R(ctx, 0, 62, w, 2, GP.PAL.k);
    return o.cv;
  }
  /** Pin parasol : tronc fin et couronne sombre et plate. */
  function drawPine() {
    var o = PA.canvas(44, 70), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 20, 18, 5, 52, k); R(ctx, 21, 18, 3, 52, C.dirtD); R(ctx, 21, 30, 1, 30, C.dirt);
    R(ctx, 13, 26, 8, 2, k); R(ctx, 25, 22, 8, 2, k);
    [[22, 12, 14, 9], [10, 16, 9, 6], [34, 14, 9, 6]].forEach(function (c) {
      for (var y = -c[3]; y <= c[3]; y++) for (var x = -c[2]; x <= c[2]; x++)
        if ((x * x) / (c[2] * c[2]) + (y * y) / (c[3] * c[3]) <= 1) P(ctx, c[0] + x, c[1] + y, (y < -c[3] / 3) ? '#3f7a4a' : GP.PAL.h);
    });
    return o.cv;
  }
  /** Bassin et jet d'eau (le jet est une image à part, animée). */
  function drawFountain() {
    var o = PA.canvas(64, 18), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 0, 6, 64, 12, k); R(ctx, 1, 7, 62, 10, C.stone); R(ctx, 1, 7, 62, 2, C.stoneL);
    R(ctx, 4, 4, 56, 4, k); R(ctx, 5, 5, 54, 2, GP.PAL.b); R(ctx, 8, 5, 6, 1, GP.PAL.l); R(ctx, 40, 5, 8, 1, GP.PAL.l);
    R(ctx, 29, 2, 6, 4, k); R(ctx, 30, 3, 4, 3, C.stoneL);
    return o.cv;
  }
  function drawJet() {
    var o = PA.canvas(12, 32), ctx = o.ctx;
    R(ctx, 5, 4, 2, 28, GP.PAL.l); R(ctx, 4, 8, 4, 22, 'rgba(127,179,213,0.7)'); R(ctx, 5, 6, 1, 20, GP.PAL.w);
    P(ctx, 2, 3, GP.PAL.l); P(ctx, 9, 2, GP.PAL.l); P(ctx, 1, 7, GP.PAL.w); P(ctx, 10, 6, GP.PAL.w); R(ctx, 4, 0, 4, 3, GP.PAL.w);
    return o.cv;
  }
  /** Massif de fleurs. */
  function drawFlowerBed() {
    var o = PA.canvas(40, 12), ctx = o.ctx, rnd = PA.rng(3), cols = ['y', 'r', 'w', 'o', 'p'];
    R(ctx, 0, 6, 40, 6, GP.PAL.k); R(ctx, 1, 7, 38, 4, C.dirtD);
    for (var i = 0; i < 26; i++) { var x = 1 + Math.floor(rnd() * 37), y = 2 + Math.floor(rnd() * 6); P(ctx, x, y + 1, GP.PAL.G); P(ctx, x, y, cols[Math.floor(rnd() * 5)]); }
    return o.cv;
  }
  /** Personnage en bois (sculpture du jardin, stylisée). */
  function drawWoodMan() {
    var o = PA.canvas(20, 44), ctx = o.ctx, k = GP.PAL.k;
    PA.disc(ctx, 10, 6, 5, k); PA.disc(ctx, 10, 6, 4, C.dirtL);
    R(ctx, 5, 11, 10, 16, k); R(ctx, 6, 12, 8, 14, C.dirt); R(ctx, 6, 16, 8, 1, C.dirtD); R(ctx, 6, 21, 8, 1, C.dirtD);
    R(ctx, 1, 12, 5, 3, k); R(ctx, 2, 13, 4, 1, C.dirtL); R(ctx, 14, 9, 5, 3, k); R(ctx, 15, 10, 3, 1, C.dirtL);
    R(ctx, 6, 26, 3, 16, k); R(ctx, 11, 26, 3, 16, k); R(ctx, 7, 26, 1, 15, C.dirt); R(ctx, 12, 26, 1, 15, C.dirt);
    R(ctx, 4, 42, 12, 2, k);
    // lattes de bois : de fines rayures sur le corps et les jambes
    for (var y = 14; y < 26; y += 3) R(ctx, 6, y, 8, 1, C.dirtD);
    for (y = 29; y < 42; y += 3) { R(ctx, 7, y, 1, 1, C.dirtD); R(ctx, 12, y, 1, 1, C.dirtD); }
    return o.cv;
  }

  // ---------- Silhouettes du jardin (dessins originaux : inspirées des sculptures de l'été au Jardin des Plantes) ----------
  /** Trait épais, pixel par pixel (sert à dessiner les silhouettes). */
  function line(ctx, x0, y0, x1, y1, c, t) {
    var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)), h = Math.floor(t / 2);
    for (var i = 0; i <= n; i++) {
      var f = n ? i / n : 0;
      R(ctx, Math.round(x0 + (x1 - x0) * f) - h, Math.round(y0 + (y1 - y0) * f) - h, t, t, c);
    }
  }
  /** Personnage orange qui marche à grands pas, du lierre sur le dos. */
  function drawMarcheurOrange() {
    var o = PA.canvas(46, 52), ctx = o.ctx, k = GP.PAL.k, orange = GP.PAL.o, rnd = PA.rng(8), verts = [GP.PAL.G, GP.PAL.g, '#1f6a3c'];
    var traits = [[21, 28, 37, 47, 4], [37, 47, 43, 47, 3], [21, 28, 7, 47, 4], [7, 47, 2, 47, 3], [21, 28, 25, 14, 5], [25, 17, 37, 25, 3], [25, 17, 12, 24, 3]];
    traits.forEach(function (t) { line(ctx, t[0], t[1], t[2], t[3], k, t[4] + 2); });
    PA.disc(ctx, 27, 9, 6, k); R(ctx, 31, 8, 7, 4, k);
    traits.forEach(function (t) { line(ctx, t[0], t[1], t[2], t[3], orange, t[4]); });
    PA.disc(ctx, 27, 9, 5, orange); R(ctx, 32, 9, 5, 2, orange); P(ctx, 29, 8, k);    // tête, nez, œil
    // lierre : de petites feuilles le long du dos, de la jambe arrière et de la tête
    [[22, 15, 20, 28], [20, 28, 7, 46], [22, 5, 25, 11]].forEach(function (s) {
      for (var i = 0; i < 9; i++) {
        var f = i / 8;
        R(ctx, Math.round(s[0] + (s[2] - s[0]) * f) - 3 - (rnd() < 0.5 ? 1 : 0), Math.round(s[1] + (s[3] - s[1]) * f), 2, 2, verts[Math.floor(rnd() * 3)]);
      }
    });
    return o.cv;
  }
  /** Personnage jaune « en 8 » à côté d'une grande main jaune. */
  function drawDuoJaune() {
    var o = PA.canvas(48, 40), ctx = o.ctx, k = GP.PAL.k, y = GP.PAL.y;
    PA.disc(ctx, 9, 10, 8, k); PA.disc(ctx, 9, 29, 9, k); R(ctx, 5, 15, 9, 6, k);
    PA.disc(ctx, 9, 10, 7, y); PA.disc(ctx, 9, 29, 8, y); R(ctx, 6, 15, 7, 6, y);
    R(ctx, 14, 23, 2, 9, GP.PAL.o);
    R(ctx, 6, 8, 2, 3, k); R(ctx, 11, 8, 2, 3, k); R(ctx, 8, 13, 3, 1, k);            // visage
    // la main : une paume et quatre doigts
    var main = [[27, 20, 19, 19], [27, 10, 4, 12], [32, 6, 4, 16], [37, 8, 4, 14], [42, 13, 4, 9]];
    main.forEach(function (r) { R(ctx, r[0] - 1, r[1] - 1, r[2] + 2, r[3] + 2, k); });
    main.forEach(function (r) { R(ctx, r[0], r[1], r[2], r[3], y); });
    R(ctx, 28, 22, 17, 1, GP.PAL.o); R(ctx, 41, 24, 3, 12, GP.PAL.o);
    return o.cv;
  }
  /** Grand personnage orange : chevelure ronde, visage souriant, main sur le nez, et un ruban vert qui retombe jusqu'au sol. */
  function drawPersonnageRuban() {
    var o = PA.canvas(42, 60), ctx = o.ctx, k = GP.PAL.k, peau = '#e8905a', clair = '#f2b088', vert = '#a6e04a';
    var bras = [[9, 25, 5, 45, 4], [21, 24, 28, 26, 3], [28, 26, 22, 18, 3]], jambes = [[10, 40, 10, 58, 5], [20, 40, 20, 58, 5]];
    var cheveux = [[13, 10, 7], [21, 8, 6], [8, 13, 5], [26, 12, 5], [17, 6, 5]];
    bras.concat(jambes).forEach(function (t) { line(ctx, t[0], t[1], t[2], t[3], k, t[4] + 2); });
    R(ctx, 7, 21, 17, 21, k); PA.disc(ctx, 16, 16, 7, k);
    cheveux.forEach(function (c) { PA.disc(ctx, c[0], c[1], c[2] + 1, k); });
    bras.forEach(function (t) { line(ctx, t[0], t[1], t[2], t[3], peau, t[4]); });
    jambes.forEach(function (t) { line(ctx, t[0], t[1], t[2], t[3], clair, t[4]); });
    R(ctx, 8, 22, 15, 19, peau); R(ctx, 8, 32, 15, 9, clair);
    cheveux.forEach(function (c) { PA.disc(ctx, c[0], c[1], c[2], peau); });
    PA.disc(ctx, 16, 16, 6, peau);
    R(ctx, 11, 13, 3, 2, GP.PAL.w); R(ctx, 18, 13, 3, 2, GP.PAL.w); P(ctx, 12, 14, k); P(ctx, 19, 14, k);   // yeux
    R(ctx, 16, 14, 1, 4, k); P(ctx, 12, 19, k); R(ctx, 13, 20, 4, 1, k); P(ctx, 17, 19, k);                 // nez et sourire
    // le ruban vert : un long fil qui descend du nez, fait une boucle dans l'herbe, et un second plus fin
    function fil(pts) { for (var i = 0; i < pts.length - 1; i++) line(ctx, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], vert, 2); }
    fil([[18, 17], [19, 28], [21, 40], [18, 52], [22, 58], [34, 57], [39, 50], [34, 46]]);
    fil([[24, 28], [27, 38], [26, 48], [30, 56]]);
    return o.cv;
  }
  /** Oiseau en topiaire (buisson taillé en forme de gros oiseau, bec jaune pointé vers la gauche). */
  function drawOiseauTopiaire() {
    var o = PA.canvas(46, 39), ctx = o.ctx, k = GP.PAL.k;
    PA.disc(ctx, 26, 25, 13, k); PA.disc(ctx, 12, 12, 9, k);
    PA.disc(ctx, 26, 25, 12, GP.PAL.G); PA.disc(ctx, 12, 12, 8, GP.PAL.G);
    PA.disc(ctx, 30, 30, 8, '#1f6a3c'); PA.disc(ctx, 21, 19, 5, GP.PAL.g); PA.disc(ctx, 10, 9, 3, GP.PAL.g);
    R(ctx, 0, 12, 6, 5, k); R(ctx, 1, 13, 5, 3, GP.PAL.y); R(ctx, 1, 15, 4, 1, GP.PAL.o);   // bec
    R(ctx, 10, 11, 3, 3, GP.PAL.w); R(ctx, 10, 12, 2, 2, k);                                  // œil
    R(ctx, 38, 14, 5, 3, k); R(ctx, 38, 15, 4, 1, GP.PAL.G);                                 // plumes de la queue
    for (var x = 18; x < 36; x += 5) P(ctx, x, 36, GP.PAL.g);
    return o.cv;
  }

  // ---------- Plantes du jardin ----------
  /** Massif de cannas rouges et de feuillage argenté. */
  function drawMassifRouge() {
    var o = PA.canvas(30, 24), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 2, 21, 26, 3, k); R(ctx, 3, 22, 24, 1, C.dirtD);
    var fleurs = [[4, 12], [9, 6], [14, 10], [19, 4], [24, 9], [28, 14]];
    fleurs.forEach(function (f) { R(ctx, f[0], f[1] + 2, 1, 20 - f[1] - 2, GP.PAL.G); });
    [[6, 18, 6], [15, 19, 7], [24, 18, 6]].forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2], '#c5ccd0'); PA.disc(ctx, b[0] - 1, b[1] - 1, Math.round(b[2] / 2), '#e8eef0'); });
    fleurs.forEach(function (f) { R(ctx, f[0] - 1, f[1], 3, 3, GP.PAL.r); P(ctx, f[0], f[1] - 1, GP.PAL.r); P(ctx, f[0], f[1] + 1, GP.PAL.y); });
    return o.cv;
  }
  /** Buisson d'hortensias (roses, blancs et bleus). */
  function drawHortensia() {
    var o = PA.canvas(34, 22), ctx = o.ctx, k = GP.PAL.k, rnd = PA.rng(33), cols = ['#e59bb5', GP.PAL.w, '#9fc4ea'];
    var boules = [[9, 13, 8], [22, 12, 9], [16, 9, 8]];
    boules.forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2] + 1, k); });
    R(ctx, 2, 18, 28, 4, k);
    boules.forEach(function (b) { PA.disc(ctx, b[0], b[1], b[2], GP.PAL.G); });
    R(ctx, 3, 18, 26, 3, GP.PAL.G);
    for (var i = 0; i < 18; i++) { var x = 3 + Math.floor(rnd() * 26), y = 3 + Math.floor(rnd() * 14); R(ctx, x, y, 3, 2, cols[Math.floor(rnd() * 3)]); }
    return o.cv;
  }
  /** Touffe de hautes herbes à épis clairs. */
  function drawHerbesHautes() {
    var o = PA.canvas(24, 28), ctx = o.ctx, tiges = [[4, 7], [9, 3], [14, 6], [19, 9], [12, 12]];
    tiges.forEach(function (t) { line(ctx, 12, 27, t[0], t[1], GP.PAL.g, 1); PA.disc(ctx, t[0], t[1], 2, '#ece6d4'); P(ctx, t[0], t[1] - 2, GP.PAL.w); });
    R(ctx, 6, 24, 12, 4, GP.PAL.G); R(ctx, 8, 23, 8, 1, GP.PAL.g);
    return o.cv;
  }
  // ---------- Château des ducs de Bretagne (dessins originaux, d'après des descriptions et des photos de repérage) ----------
  /** Triangle plein (toit pointu). */
  function toit(ctx, x, y, larg, haut, c) {
    for (var j = 0; j < haut; j++) { var l = Math.round(larg * (j + 1) / haut); R(ctx, x + Math.round((larg - l) / 2), y + j, l, 1, c); }
  }
  /** Fond lointain du château (largeur 480, raccord horizontal) : courtines de schiste sombre, tours rondes, logis blanc en tuffeau et toits d'ardoise. */
  function drawFondChateau() {
    var w = 480, h = 120, o = PA.canvas(w, h), ctx = o.ctx, mur = '#7d869c', murC = '#8d96ab', ombre = '#6a728a', ardoise = '#58607a', tuffeau = '#e6e0d0', i, x;
    R(ctx, 0, 70, w, h - 70, mur); R(ctx, 0, 70, w, 4, murC); R(ctx, 0, 74, w, 5, ombre);
    for (x = 0; x < w; x += 8) R(ctx, x + 1, 74, 6, 4, ardoise);                                                   // mâchicoulis sous le chemin de ronde
    for (x = 3; x < w; x += 14) R(ctx, x, 92 + (x % 3), 2, 5, ombre);                                               // quelques pierres sombres
    [[36, 28], [300, 30], [430, 26]].forEach(function (t) {                                                         // tours rondes à toit en terrasse
      R(ctx, t[0], 44, t[1], h - 44, mur); R(ctx, t[0], 44, 7, h - 44, murC); R(ctx, t[0] + t[1] - 6, 44, 6, h - 44, ombre);
      R(ctx, t[0] - 2, 40, t[1] + 4, 5, murC); for (i = t[0]; i < t[0] + t[1]; i += 6) R(ctx, i, 45, 4, 4, ardoise);
      R(ctx, t[0] + t[1] / 2 - 1, 58, 2, 7, ardoise);
    });
    toit(ctx, 168, 18, 46, 30, ardoise);                                                                           // la tour du Fer-à-Cheval : toit pointu
    R(ctx, 172, 48, 38, h - 48, mur); R(ctx, 172, 48, 6, h - 48, murC); R(ctx, 204, 48, 6, h - 48, ombre);
    R(ctx, 100, 38, 64, h - 38, tuffeau);                                                                          // logis blanc
    R(ctx, 96, 30, 72, 10, ardoise); R(ctx, 100, 40, 64, 2, '#c9c2b0');
    for (i = 0; i < 3; i++) { R(ctx, 108 + i * 20, 22, 10, 12, tuffeau); toit(ctx, 107 + i * 20, 15, 12, 8, ardoise); }   // lucarnes
    for (i = 0; i < 4; i++) { R(ctx, 108 + i * 14, 52, 6, 10, '#8a93a8'); R(ctx, 108 + i * 14, 76, 6, 10, '#8a93a8'); }
    toit(ctx, 330, 22, 40, 24, ardoise); R(ctx, 334, 46, 32, h - 46, tuffeau);                                        // un second pavillon
    R(ctx, 340, 56, 6, 9, '#8a93a8'); R(ctx, 354, 56, 6, 9, '#8a93a8');
    return o.cv;
  }
  /** Salle intérieure du château (fond de tuffeau, voûte, piliers, fenêtres en arc, bannières à hermines, torches). largeur en tuiles ; cheminee : grande cheminée au centre. */
  function drawSalle(wT, cheminee) {
    var w = wT * 16, h = 272, o = PA.canvas(w, h), ctx = o.ctx, k = GP.PAL.k, pierre = '#a9a08a', joint = '#958c76', ombre = '#5f5a4b', bois = '#6b4230', x, y;
    R(ctx, 0, 0, w, h, pierre);
    for (y = 0; y < h; y += 8) { R(ctx, 0, y, w, 1, joint); for (x = ((y / 8) % 2) * 8; x < w; x += 16) R(ctx, x, y, 1, 8, joint); }   // appareil de pierre
    R(ctx, 0, 0, w, 34, ombre); R(ctx, 0, 34, w, 2, k); R(ctx, 0, 36, w, 6, bois); R(ctx, 0, 42, w, 1, k);                         // voûte sombre et poutre
    for (x = 0; x < w; x += 12) R(ctx, x, 30 - (x % 24 ? 0 : 3), 6, 4 + (x % 24 ? 0 : 3), '#7a735f');                                  // nervures
    var pas = 96;
    for (x = 0; x + pas <= w; x += pas) {
      R(ctx, x, 0, 12, h, k); R(ctx, x + 1, 0, 10, h, '#c9c0a6'); R(ctx, x + 9, 0, 2, h, ombre); R(ctx, x - 2, 42, 16, 5, k); R(ctx, x - 1, 43, 14, 3, '#b3aa90');
      var cx = x + 54;                                                                                                                  // fenêtre en arc entre deux piliers
      PA.disc(ctx, cx, 76, 12, k); R(ctx, cx - 12, 76, 24, 34, k); PA.disc(ctx, cx, 76, 10, '#9fc4ea'); R(ctx, cx - 10, 76, 20, 32, '#9fc4ea');
      R(ctx, cx, 66, 1, 42, k); R(ctx, cx - 10, 88, 20, 1, k); R(ctx, cx - 13, 110, 26, 4, k); R(ctx, cx - 12, 110, 24, 2, ombre);
      R(ctx, x + 16, 62, 14, 38, k); R(ctx, x + 17, 63, 12, 36, GP.PAL.w);                                                              // bannière à hermines
      [[21, 70], [25, 78], [21, 86], [25, 94]].forEach(function (m) { R(ctx, x + m[0], m[1], 2, 4, k); P(ctx, x + m[0] - 1, m[1] + 4, k); P(ctx, x + m[0] + 2, m[1] + 4, k); });
      var tx = x + 84;                                                                                                                  // torche murale
      R(ctx, tx, 122, 2, 10, k); R(ctx, tx - 2, 120, 6, 3, k); PA.disc(ctx, tx + 1, 116, 4, GP.PAL.o); PA.disc(ctx, tx + 1, 117, 2, GP.PAL.y);
      ctx.globalAlpha = 0.18; PA.disc(ctx, tx + 1, 118, 16, GP.PAL.y); ctx.globalAlpha = 1;
    }
    if (cheminee) {                                                                                                                      // grande cheminée de la salle des gardes
      var mx = Math.round(w / 2) - 28;
      R(ctx, mx, 110, 56, 100, k); R(ctx, mx + 2, 112, 52, 96, '#8f8774'); R(ctx, mx + 10, 150, 36, 58, k); R(ctx, mx + 12, 152, 32, 56, '#2b2f3f');
      PA.disc(ctx, mx + 28, 198, 7, GP.PAL.o); PA.disc(ctx, mx + 28, 200, 4, GP.PAL.y); R(ctx, mx - 4, 106, 64, 6, k); R(ctx, mx - 3, 107, 62, 3, ombre);
    }
    R(ctx, 0, 0, 8, h, '#5d6475'); R(ctx, w - 8, 0, 8, h, '#5d6475'); R(ctx, 8, 0, 1, h, k); R(ctx, w - 9, 0, 1, h, k);                   // montants des portes d'entrée et de sortie
    return o.cv;
  }
  // ---------- Ennemis et accessoires des niveaux de la ville (dessins originaux) ----------
  /** Esprit de la garde : un fantôme pâle qui flotte. */
  function drawEsprit() {
    var o = PA.canvas(16, 22), ctx = o.ctx, k = GP.PAL.k, c = '#d4e6ff', c2 = '#a9c4ea';
    PA.disc(ctx, 8, 8, 7, k); R(ctx, 1, 8, 14, 11, k);
    PA.disc(ctx, 8, 8, 6, c); R(ctx, 2, 8, 12, 10, c); R(ctx, 10, 9, 4, 9, c2);
    for (var x = 2; x < 14; x += 4) { R(ctx, x, 18, 2, 3, k); R(ctx, x, 18, 2, 2, c); }           // bas de drap en festons
    R(ctx, 5, 7, 2, 3, k); R(ctx, 10, 7, 2, 3, k); R(ctx, 7, 12, 3, 2, k);                           // yeux et bouche
    return o.cv;
  }
  /** Petit robot de la galerie (chenilles, œil jaune, antenne rouge). */
  function drawRobot() {
    var o = PA.canvas(16, 16), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 3, 1, 1, 3, k); R(ctx, 2, 0, 3, 2, GP.PAL.r);
    R(ctx, 1, 4, 14, 8, k); R(ctx, 2, 5, 12, 6, '#8f98a8'); R(ctx, 2, 5, 12, 1, '#c7ced9');
    R(ctx, 4, 6, 8, 3, k); R(ctx, 5, 7, 6, 1, GP.PAL.y);
    R(ctx, 0, 12, 16, 4, k); R(ctx, 1, 13, 14, 2, '#5d6475'); for (var x = 2; x < 15; x += 3) P(ctx, x, 13, '#9aa2ae');
    return o.cv;
  }
  /** Araignée mécanique vue d'ensemble (32×18, tournée vers la droite) : abdomen de bronze, tête d'acier à yeux rouges et HUIT pattes articulées. */
  function drawAraignee() {
    var o = PA.canvas(32, 18), ctx = o.ctx, k = GP.PAL.k;
    function lin(x0, y0, x1, y1) { var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, er = dx - dy; for (;;) { P(ctx, x0, y0, k); if (x0 === x1 && y0 === y1) break; var e2 = 2 * er; if (e2 > -dy) { er -= dy; x0 += sx; } if (e2 < dx) { er += dx; y0 += sy; } } }
    var legs = [[[12, 8], [8, 2], [3, 5]], [[12, 9], [5, 5], [0, 10]], [[12, 10], [5, 11], [1, 16]], [[13, 11], [9, 14], [7, 17]]];
    legs.forEach(function (l) {
      lin(l[0][0], l[0][1], l[1][0], l[1][1]); lin(l[1][0], l[1][1], l[2][0], l[2][1]);                      // pattes de gauche (quatre)
      lin(31 - l[0][0] + 3, l[0][1], 31 - l[1][0] + 3, l[1][1]); lin(31 - l[1][0] + 3, l[1][1], 31 - l[2][0] + 3, l[2][1]);   // pattes de droite (quatre)
    });
    PA.disc(ctx, 13, 9, 6, k); PA.disc(ctx, 13, 9, 5, '#c89a5e'); R(ctx, 9, 6, 6, 1, '#e8c28a'); R(ctx, 9, 12, 8, 1, '#a5723f'); P(ctx, 11, 9, '#6f7a8e'); P(ctx, 14, 9, '#6f7a8e'); P(ctx, 12, 7, '#6f7a8e');   // abdomen
    R(ctx, 18, 6, 7, 7, k); R(ctx, 19, 7, 5, 5, '#8f98a8'); P(ctx, 21, 8, GP.PAL.r); P(ctx, 22, 8, GP.PAL.r); P(ctx, 21, 10, GP.PAL.r); P(ctx, 22, 10, GP.PAL.r);   // tête et yeux rouges
    return o.cv;
  }
  /** Toile d'araignée au sol (16×16) : demi-toile à rayons et fils concentriques, à ne pas toucher. */
  function drawToile() {
    var o = PA.canvas(16, 16), ctx = o.ctx, w = '#dfe6f0', wO = '#8f98a8', r, a;
    for (r = 3; r <= 7; r += 2) for (a = 0; a <= 180; a += 6) P(ctx, Math.round(8 - Math.cos(a * Math.PI / 180) * r), Math.round(15 - Math.sin(a * Math.PI / 180) * r), r === 7 ? w : wO);   // fils concentriques
    for (a = 0; a <= 180; a += 30) for (r = 1; r <= 7; r++) P(ctx, Math.round(8 - Math.cos(a * Math.PI / 180) * r), Math.round(15 - Math.sin(a * Math.PI / 180) * r), w);   // rayons
    R(ctx, 1, 15, 14, 1, wO);
    return o.cv;
  }
  /** Conteneur de chantier qui tombe de la grue. */
  function drawConteneur(w) {
    w = w || 34;
    var o = PA.canvas(w, 22), ctx = o.ctx, k = GP.PAL.k, c = '#c4562e', cl = '#e07a4a', m = Math.floor(w / 2);
    R(ctx, 0, 2, w, 20, k); R(ctx, 1, 3, w - 2, 18, c); R(ctx, 1, 3, w - 2, 2, cl);
    for (var x = 4; x < w - 2; x += 4) R(ctx, x, 5, 1, 15, '#8f3a1f');
    R(ctx, m - 2, 0, 4, 3, k); R(ctx, m - 1, 0, 2, 2, GP.PAL.m);                                     // crochet
    return o.cv;
  }
  /** Rideau de théâtre (à ouvrir en jouant la bonne séquence). */
  function drawRideau() {
    var o = PA.canvas(18, 50), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 0, 0, 18, 50, k); R(ctx, 1, 1, 16, 48, '#a8323c');
    for (var x = 2; x < 17; x += 4) { R(ctx, x, 1, 1, 48, '#d2565f'); R(ctx, x + 2, 1, 1, 48, '#7a2029'); }
    R(ctx, 0, 0, 18, 4, k); R(ctx, 1, 1, 16, 2, GP.PAL.y);
    return o.cv;
  }
  /** Tapis roulant ou rail de rouages : chevrons jaunes sur fond sombre (16×8, à répéter). gauche = chevrons vers la gauche. */
  function drawTapis(gauche) {
    var o = PA.canvas(16, 8), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 0, 0, 16, 8, '#3a4258'); R(ctx, 0, 0, 16, 1, k); R(ctx, 0, 7, 16, 1, k);
    for (var i = 0; i < 2; i++) {
      var x = 2 + i * 8, d = gauche ? -1 : 1, c = gauche ? x + 2 : x;      // pointe du chevron à gauche ou à droite
      P(ctx, c, 2, '#f4d35e'); P(ctx, c + d, 3, '#f4d35e'); P(ctx, c + 2 * d, 4, '#f4d35e'); P(ctx, c + d, 5, '#f4d35e'); P(ctx, c, 6, '#f4d35e');
    }
    return o.cv;
  }
  /** La Tour LU : fût de briques, bandeaux blancs, coupole turquoise et or (dessin original, forme générale seulement). */
  function drawTourLU() {
    // D'après des photos de la tour actuelle (Wikimédia Commons) : bas peint en bleu jusqu'à la fenêtre (cadres blancs, pilastres de brique, balcon de pierre),
    // éventail rose et mauve avec un groupe sculpté crème, corniche, coupole crème à fenêtre sombre et emblème doré, balustrade, lanterne, flèche.
    var o = PA.canvas(76, 176), ctx = o.ctx, k = GP.PAL.k, cr = '#efe6d0', crL = '#faf3e0', crO = '#d8ccb0', crS = '#bfb294', ro = '#f0d0dc', mv = '#cdb4d8', or = '#f4d35e';
    var bl = '#7fb5ea', blM = '#6aa0dc', blO = '#5b8fcb', br = '#a5523f', gr = '#8a8a9c', x, y, i;
    function fut(y0, y1, x0, x1) { R(ctx, x0 - 1, y0, x1 - x0 + 2, y1 - y0, k); R(ctx, x0, y0, x1 - x0, y1 - y0, cr); R(ctx, x0, y0, 6, y1 - y0, crL); R(ctx, x1 - 16, y0, 8, y1 - y0, crO); R(ctx, x1 - 8, y0, 8, y1 - y0, crS); }
    // flèche, lanterne et coupole (du haut vers le bas)
    R(ctx, 37, 0, 2, 5, k); R(ctx, 37, 0, 1, 4, or); R(ctx, 34, 4, 8, 3, k); R(ctx, 35, 5, 6, 1, '#c0453a');
    R(ctx, 32, 6, 12, 8, k); R(ctx, 33, 7, 10, 6, cr); PA.disc(ctx, 38, 9, 4, k); PA.disc(ctx, 38, 9, 3, cr); R(ctx, 36, 8, 4, 3, '#4a5a7a');
    R(ctx, 30, 14, 16, 4, k); R(ctx, 31, 15, 14, 2, cr); for (x = 31; x < 45; x += 3) R(ctx, x, 15, 1, 2, crS);       // balustrade de la lanterne
    PA.disc(ctx, 38, 40, 19, k); PA.disc(ctx, 38, 40, 18, cr); ctx.clearRect(0, 48, 76, 6);
    R(ctx, 29, 28, 18, 18, k); PA.disc(ctx, 38, 28, 9, k); R(ctx, 30, 29, 16, 17, '#2f3d5e'); PA.disc(ctx, 38, 29, 8, '#2f3d5e');   // fenêtre sombre de la coupole
    R(ctx, 33, 32, 10, 2, or); R(ctx, 35, 30, 1, 8, or); R(ctx, 40, 30, 1, 8, or); R(ctx, 33, 38, 10, 1, or);          // emblème doré
    R(ctx, 44, 24, 10, 24, crO); R(ctx, 51, 28, 5, 20, crS);
    // corniche et fût haut
    R(ctx, 17, 47, 42, 4, k); R(ctx, 18, 48, 40, 2, cr);
    fut(51, 168, 19, 57);
    R(ctx, 22, 53, 3, 14, crS); R(ctx, 51, 53, 3, 14, crS);                                                       // pilastres sous la corniche
    // éventail rose et mauve
    for (y = 58; y < 86; y++) { var hw = Math.min(17, 4 + Math.round((y - 58) * 0.7)); R(ctx, 38 - hw, y, hw * 2, 1, ro); }
    for (i = -5; i <= 5; i++) for (y = 58; y < 86; y++) { var rx = Math.round(38 + i * (y - 52) / 5.5); if (rx > 21 && rx < 55) P(ctx, rx, y, mv); }
    R(ctx, 30, 70, 16, 12, k); R(ctx, 31, 71, 14, 10, cr); R(ctx, 33, 73, 10, 6, crO); R(ctx, 29, 74, 3, 3, cr); R(ctx, 44, 74, 3, 3, cr);   // groupe sculpté
    R(ctx, 17, 86, 42, 4, k); R(ctx, 18, 87, 40, 2, cr);                                                            // corniche sous l'éventail
    // bas peint en bleu, jusqu'à la fenêtre
    for (y = 90; y < 164; y++) {
      if (y < 94 && (y + (y % 3)) % 2) continue;
      R(ctx, 19, y, 38, 1, bl); R(ctx, 33, y, 12, 1, blM); R(ctx, 45, y, 12, 1, blO);
    }
    // fenêtre : cadres blancs, pilastres de brique rouge, balcon de pierre
    R(ctx, 28, 92, 20, 20, k); R(ctx, 29, 93, 18, 18, cr); R(ctx, 29, 93, 3, 18, br); R(ctx, 44, 93, 3, 18, br);
    R(ctx, 33, 94, 10, 16, k); R(ctx, 34, 95, 8, 14, '#aab8c8'); R(ctx, 37, 95, 2, 14, '#ffffff'); R(ctx, 34, 100, 8, 1, '#ffffff'); R(ctx, 34, 105, 8, 1, '#ffffff');
    R(ctx, 26, 112, 24, 6, k); R(ctx, 27, 113, 22, 4, cr); for (x = 28; x < 48; x += 3) R(ctx, x, 114, 1, 3, crS);        // balcon de pierre
    R(ctx, 29, 118, 18, 3, k); R(ctx, 30, 119, 16, 1, cr);
    // soubassement de pierre grise
    R(ctx, 17, 164, 42, 12, k); R(ctx, 18, 165, 40, 11, gr); R(ctx, 18, 165, 40, 2, '#b4b4c4'); R(ctx, 46, 165, 12, 11, '#6f6f82');
    return o.cv;
  }
  /** Petit-beurre (plateformes de la Tour LU) : biscuit doré à bords dentelés et petits trous ; g / m / d = bout gauche, milieu, bout droit (16×10). */
  function drawPetitBeurre(part) {
    var o = PA.canvas(16, 12), ctx = o.ctx, k = '#7a4418', or = '#e7b567', clair = '#f4cf8a', fonce = '#c88a3e', x;
    var x0 = part === 'g' ? 1 : 0, x1 = part === 'd' ? 15 : 16;
    R(ctx, x0, 1, x1 - x0, 10, k); R(ctx, x0 + (part === 'g' ? 1 : 0), 2, x1 - x0 - (part === 'g' || part === 'd' ? 1 : 0), 8, or);
    R(ctx, x0, 2, x1 - x0, 1, clair); R(ctx, x0, 9, x1 - x0, 1, fonce);
    for (x = 0; x < 16; x += 4) { R(ctx, x, 0, 2, 1, k); R(ctx, x + 2, 1, 2, 1, or); R(ctx, x, 11, 2, 1, k); R(ctx, x + 2, 10, 2, 1, or); }   // bords dentelés du vrai petit-beurre
    R(ctx, 3, 4, 2, 2, k); R(ctx, 11, 4, 2, 2, k); R(ctx, 7, 6, 2, 2, k);                                      // piqûres
    return o.cv;
  }
  /** Bitume du quartier de la Tour LU : tuile du dessus (avec ou sans peinture blanche), tuile pleine et bords (16×16). */
  function drawBitume(kind) {
    var o = PA.canvas(16, 16), ctx = o.ctx, k = '#1d1f2b', as = '#4b4f5c', asC = '#6a6f80', asF = '#3a3d49', i;
    var rnd = PA.rng(kind.length * 17 + (kind.charCodeAt(0) || 3));
    R(ctx, 0, 0, 16, 16, kind === 'plein' || kind === 'g' || kind === 'd' ? asF : as);
    for (i = 0; i < 9; i++) P(ctx, Math.floor(rnd() * 16), Math.floor(rnd() * 16), i % 2 ? asC : '#2b2e3a');                  // gravillons
    if (kind === 'h1' || kind === 'h2') { R(ctx, 0, 0, 16, 1, k); R(ctx, 0, 1, 16, 2, asC); }                                  // bordure claire sur le dessus
    if (kind === 'h2') { R(ctx, 3, 5, 10, 2, '#e8e8ee'); }                                                                  // peinture blanche
    if (kind === 'g') R(ctx, 0, 0, 1, 16, k);
    if (kind === 'd') R(ctx, 15, 0, 1, 16, k);
    return o.cv;
  }
  var LETTRES = { S: ['111', '100', '111', '001', '111'], T: ['111', '010', '010', '010', '010'], O: ['111', '101', '101', '101', '111'], P: ['111', '101', '111', '100', '100'] };
  /** Panneaux de rue (16×32) : kind = 'stop', 'sens' (sens interdit) ou 'cedez' ; poteau gris planté dans le trottoir. */
  function drawPanneau(kind) {
    var o = PA.canvas(16, 34), ctx = o.ctx, k = '#1d1f2b', rouge = '#c0392b', blanc = '#f4f4fa', i, l;
    R(ctx, 7, 14, 2, 20, k); R(ctx, 7, 14, 1, 20, '#a0a8b4'); R(ctx, 8, 14, 1, 20, '#6f7a8e');
    if (kind === 'stop') {
      for (i = 0; i < 14; i++) { var ins = i < 4 ? 4 - i : (i > 9 ? i - 9 : 0); R(ctx, ins, i, 16 - 2 * ins, 1, k); }
      for (i = 1; i < 13; i++) { var in2 = i < 4 ? 4 - i + 1 : (i > 9 ? i - 9 + 1 : 1); R(ctx, in2, i, 16 - 2 * in2, 1, rouge); }
      'STOP'.split('').forEach(function (ch, n) { LETTRES[ch].forEach(function (row, ry) { row.split('').forEach(function (b, rx) { if (b === '1') P(ctx, 2 + n * 3 + rx - (n > 1 ? 0 : 0), 4 + ry, blanc); }); }); });
    } else if (kind === 'sens') {
      PA.disc(ctx, 8, 7, 7, k); PA.disc(ctx, 8, 7, 6, rouge); R(ctx, 3, 6, 10, 3, blanc);
    } else {
      for (i = 0; i < 12; i++) { var w = 16 - i * 1.3; R(ctx, Math.round(8 - w / 2), i, Math.round(w), 1, i === 0 ? k : rouge); }
      for (i = 2; i < 9; i++) { var w2 = 11 - i * 1.2; R(ctx, Math.round(8 - w2 / 2), i, Math.max(1, Math.round(w2)), 1, blanc); }
    }
    return o.cv;
  }
  /** Feu tricolore (12×34) : boîtier noir sur poteau, feu rouge allumé. */
  function drawFeu() {
    var o = PA.canvas(12, 34), ctx = o.ctx, k = '#1d1f2b';
    R(ctx, 5, 16, 2, 18, k); R(ctx, 5, 16, 1, 18, '#a0a8b4');
    R(ctx, 2, 0, 8, 17, k); R(ctx, 3, 1, 6, 15, '#2b2e3a');
    PA.disc(ctx, 6, 4, 2, '#ff5d52'); PA.disc(ctx, 6, 8, 2, '#5a4a1a'); PA.disc(ctx, 6, 12, 2, '#1d4a2a');
    R(ctx, 0, 1, 2, 3, k); R(ctx, 10, 1, 2, 3, k);
    return o.cv;
  }
  /** Abribus (32×34) : toit, parois vitrées, banc et poteau d'arrêt. */
  function drawAbribus() {
    var o = PA.canvas(32, 34), ctx = o.ctx, k = '#1d1f2b', verre = '#a9cde6';
    R(ctx, 0, 0, 32, 4, k); R(ctx, 1, 1, 30, 2, '#6f7a8e');
    R(ctx, 1, 4, 2, 30, k); R(ctx, 29, 4, 2, 30, k); R(ctx, 3, 4, 26, 24, k); R(ctx, 4, 5, 24, 22, verre); R(ctx, 4, 5, 24, 2, '#d4e8f6');
    R(ctx, 15, 5, 1, 22, '#7fa6c4'); R(ctx, 6, 22, 20, 3, k); R(ctx, 7, 23, 18, 1, '#c27a42');                              // banc
    R(ctx, 5, 28, 2, 6, k); R(ctx, 25, 28, 2, 6, k);
    return o.cv;
  }
  /** Anneau néon vu en perspective (ellipse épaisse, cœur blanc, halo) : c1 = couleur, c2 = cœur clair. */
  function neon(ctx, cx, cy, rx, ry, c1, c2, s, halo) {
    var steps = Math.ceil(ry * 8);
    function bande(t, couleur, alpha) {
      ctx.globalAlpha = alpha; ctx.fillStyle = couleur;
      for (var a = 0; a < steps; a++) { var ang = a / steps * Math.PI * 2; ctx.fillRect(Math.round(cx + Math.cos(ang) * (rx + t)), Math.round(cy + Math.sin(ang) * (ry + t)), 1, 1); }
      ctx.globalAlpha = 1;
    }
    var g = Math.max(3, Math.round(12 * s)), m = Math.max(1, Math.round(5 * s)), k = Math.max(1, Math.round(2 * s)), t;
    for (t = -g; t <= g; t++) bande(t, c1, halo === undefined ? 0.13 : halo);
    for (t = -m; t <= m; t++) bande(t, c1, 1);
    for (t = -k; t <= k; t++) bande(t, c2, 1);
  }
  /** Fond de nuit de Buren (largeur 960, raccord horizontal approximatif) : la Loire, la rive éclairée de Nantes et la file d'anneaux néon qui s'éloigne vers l'horizon. */
  function drawBuren(jour) {
    var w = 960, h = 240, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(77), HOR = 168, x, y, i;
    var K = jour ? { eau: '#5f9fc9', vague: '#8cc4e0', bat: '#b9a98f', toit: '#d6c8ae', fen: ['#7d8da6', '#9fb0c8'], dome: '#a89877', halo: 0.05, refl: 0.1 }
                 : { eau: '#141d44', vague: '#26346b', bat: '#1a2349', toit: '#2a3668', fen: ['#f4d35e', '#ffe9a0'], dome: '#222d5c', halo: 0.13, refl: 0.18 };
    R(ctx, 0, HOR, w, h - HOR, K.eau);                                                                       // eau
    for (i = 0; i < 110; i++) R(ctx, Math.floor(rnd() * w), HOR + 4 + Math.floor(rnd() * (h - HOR - 6)), 8 + Math.floor(rnd() * 18), 1, K.vague);
    x = 0;
    while (x < w) {                                                                                              // rive d'en face : immeubles sombres aux fenêtres allumées
      var bw = 18 + Math.floor(rnd() * 26), bh = 22 + Math.floor(rnd() * 32);
      R(ctx, x, HOR - bh, bw, bh, K.bat); R(ctx, x, HOR - bh, bw, 2, K.toit);
      for (y = HOR - bh + 5; y < HOR - 4; y += 7) for (var wx = x + 3; wx < x + bw - 3; wx += 6) if (rnd() < 0.45) R(ctx, wx, y, 2, 3, rnd() < 0.8 ? K.fen[0] : K.fen[1]);
      x += bw + Math.floor(rnd() * 4);
    }
    PA.disc(ctx, 690, HOR - 40, 15, K.dome); R(ctx, 675, HOR - 40, 31, 40, K.dome); R(ctx, 689, HOR - 60, 2, 8, K.dome);   // une coupole
    var VPX = 905, VPY = 112, couleurs = [['#3d9bff', '#bfe0ff'], ['#4dff9c', '#c9ffe3'], ['#ff4f66', '#ffc2ca']];
    for (i = 8; i >= 0; i--) {                                                                                   // du plus loin au plus proche
      var s = Math.pow(0.78, i), cx = VPX - (VPX - 130) * s, cy = VPY + (HOR - VPY) * s * 0.85, ry = 96 * s, rx = ry * 0.78, c = couleurs[i % 3];
      ctx.globalAlpha = K.refl; ctx.fillStyle = c[0]; ctx.fillRect(Math.round(cx - 2), HOR, Math.max(2, Math.round(5 * s)), h - HOR); ctx.globalAlpha = 1;     // reflet sur l'eau
      neon(ctx, cx, cy, rx, ry, c[0], c[1], s, K.halo);
    }
    return o.cv;
  }
  /** Garde-corps du quai (16×16, se répète) : montants et deux lisses en acier, comme le long de la Loire. */
  function drawGardeCorps() {
    var o = PA.canvas(16, 16), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 0, 3, 16, 3, k); R(ctx, 0, 4, 16, 1, '#aab4c4');          // main courante
    R(ctx, 0, 9, 16, 3, k); R(ctx, 0, 10, 16, 1, '#8a94a6');         // lisse basse
    R(ctx, 6, 2, 4, 14, k); R(ctx, 7, 3, 2, 13, '#6f7a8e'); R(ctx, 7, 3, 1, 13, '#c7ced9');   // montant
    return o.cv;
  }
  /** Anneau de jeu en néon (rouge ou bleu), de face : 44×44, anneau de 36 px au centre. */
  function drawAnneauJeu(rouge) {
    var o = PA.canvas(52, 52), ctx = o.ctx;
    neon(ctx, 26, 26, 17, 17, rouge ? '#ff4f66' : '#3d9bff', rouge ? '#ffd0d6' : '#cfe6ff', 0.9);
    return o.cv;
  }
  /** Halo lumineux rond (sert derrière les anneaux de jeu, en mode additif). */
  function drawHalo() {
    var o = PA.canvas(64, 64), ctx = o.ctx, g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
    return o.cv;
  }
  /**
   * Fond du Passage Pommeraye (480×236, se répète) : galerie de trois niveaux à balustrades de fer, arcades, statues dans des niches,
   * murs ocre et verrière à nervures de métal tout en haut. Dessiné d'après des vues du passage consultées sur Wikipédia (référence uniquement).
   */
  function drawFondPommeraye() {
    var w = 480, h = 272, o = PA.canvas(w, h), ctx = o.ctx, k = '#2b2230', i, x, n;
    var mur = '#d6ae6e', murO = '#b88c52', murC = '#e8c98c', arcO = '#6b4a2f', arcL = '#f4d9a0', fer = '#3b3040', pierre = '#eae6dc', pierreO = '#b8b2a4';
    R(ctx, 0, 0, w, h, mur);
    var verre = ctx.createLinearGradient(0, 0, 0, 38); verre.addColorStop(0, '#cfe6f6'); verre.addColorStop(1, '#a9cde6');
    ctx.fillStyle = verre; ctx.fillRect(0, 0, w, 38);                                                        // verrière
    for (x = 0; x < w; x += 24) { R(ctx, x, 0, 2, 38, fer); }                                                // nervures verticales
    for (x = 0; x < w; x += 48) for (n = 0; n < 38; n += 2) { R(ctx, x + Math.floor(n * 0.6), n, 1, 1, fer); R(ctx, x + 48 - Math.floor(n * 0.6), n, 1, 1, fer); }   // croisillons
    R(ctx, 0, 36, w, 3, k); R(ctx, 0, 39, w, 5, murO); R(ctx, 0, 44, w, 2, murC);                              // corniche sous la verrière
    var niveaux = [[48, 96], [100, 152], [158, 224]];                                                          // les trois niveaux : [haut, bas] des arcades
    niveaux.forEach(function (nv, lv) {
      var top = nv[0], bot = nv[1], hh = bot - top;
      for (i = 0; i < 5; i++) {                                                                                // une travée de 96 px, cinq fois
        var x0 = i * 96;
        R(ctx, x0, top, 3, hh, murO); R(ctx, x0 + 3, top, 2, hh, murC);                                       // pilastre
        [x0 + 12, x0 + 60].forEach(function (ax, j) {                                                          // deux arcades par travée
          var aw = 24, ah = hh - 14;
          R(ctx, ax, top + 12, aw, ah - 12, arcO); PA.disc(ctx, ax + aw / 2, top + 12, aw / 2, arcO); R(ctx, ax + 3, top + 14, aw - 6, ah - 14, arcL);
          PA.disc(ctx, ax + aw / 2, top + 14, aw / 2 - 3, arcL); R(ctx, ax + aw / 2 - 1, top + 12, 2, ah, arcO);
        });
        if (lv < 2) {                                                                                          // statue dans sa niche, entre les arcades
          var sx = x0 + 48;
          R(ctx, sx - 7, top + 10, 14, hh - 14, arcO); PA.disc(ctx, sx, top + 10, 7, arcO);
          R(ctx, sx - 6, bot - 12, 12, 4, pierreO); R(ctx, sx - 4, top + 22, 8, bot - 34, pierre); PA.disc(ctx, sx, top + 19, 4, pierre); R(ctx, sx - 1, top + 22, 2, bot - 34, pierreO); R(ctx, sx - 6, top + 26, 2, 12, pierre); R(ctx, sx + 4, top + 26, 2, 12, pierre);
        }
      }
      R(ctx, 0, bot - 6, w, 2, k); for (x = 0; x < w; x += 6) R(ctx, x, bot - 12, 2, 6, fer);                  // balustrade de fer
      R(ctx, 0, bot - 12, w, 2, fer); R(ctx, 0, bot - 4, w, 4, murO);
    });
    // niveau inférieur du passage, visible par les ouvertures du plancher : sol de dalles sombres, devantures éclairées et lampes
    R(ctx, 0, 236, w, 36, '#4a2a22'); for (x = 0; x < w; x += 24) { R(ctx, x, 236, 12, 12, '#5d352b'); R(ctx, x + 12, 248, 12, 12, '#5d352b'); R(ctx, x, 260, 12, 12, '#5d352b'); }
    R(ctx, 0, 234, w, 3, k); for (x = 12; x < w; x += 60) { R(ctx, x, 238, 26, 18, '#f4d9a0'); R(ctx, x, 238, 26, 3, '#c0453a'); R(ctx, x + 2, 244, 22, 10, '#fff3c8'); }   // vitrines allumées en contrebas
    return o.cv;
  }
  /** Façade d'immeuble (hôtel d'armateur de Feydeau, immeubles de la place Graslin) : pierre claire, fenêtres, balcons de fer, mascarons, toit d'ardoise à lucarnes. */
  function facade(ctx, x, w, top, bot, o, rnd) {
    var fer = '#2b2230', r, f, c, hh = bot - top;
    R(ctx, x, top, w, hh, o.wall); R(ctx, x, top, w, 3, o.wallO); R(ctx, x + w - 3, top + 3, 3, hh - 3, o.wallO); R(ctx, x, top + 3, 1, hh - 3, o.wallO);
    var fh = 22, floors = Math.floor((hh - 22) / fh), cols = Math.max(2, Math.floor((w - 6) / 14)), gap = (w - 6) / cols;
    for (f = 0; f < floors; f++) {
      var y = top + 8 + f * fh;
      R(ctx, x, y + fh - 3, w, 1, o.wallO);                                                                    // bandeau entre étages
      for (c = 0; c < cols; c++) {
        var wx = Math.round(x + 3 + c * gap + (gap - 8) / 2);
        R(ctx, wx - 1, y, 10, 15, o.wallO); R(ctx, wx, y + 1, 8, 13, o.win); R(ctx, wx, y + 1, 8, 2, o.winL); R(ctx, wx + 3, y + 1, 1, 13, o.wallO);   // fenêtre à deux battants
        if (o.masc && f === 0) R(ctx, wx + 2, y - 3, 4, 3, o.wall === '#e4d4a8' ? '#f4ecd0' : '#efe6d2');         // mascaron au-dessus
      }
      if (f === 1 || (o.allBalc && f > 0)) { R(ctx, x + 1, y + 13, w - 2, 2, fer); for (c = 0; c < w - 2; c += 4) R(ctx, x + 1 + c, y + 9, 1, 5, fer); }   // balcon de fer forgé
    }
    for (r = 0; r < 14; r++) { var ins = Math.floor((14 - r) * 0.5); R(ctx, x + ins, top - 14 + r, w - 2 * ins, 1, r % 4 === 0 ? o.roofO : o.roof); }   // toit mansardé
    R(ctx, x + 2, top - 1, w - 4, 1, o.roofO);
    for (c = 0; c < Math.floor(w / 24); c++) { var dx = x + 8 + c * 22; R(ctx, dx, top - 12, 8, 8, o.wallO); R(ctx, dx + 1, top - 11, 6, 6, o.win); R(ctx, dx - 1, top - 14, 10, 2, o.roofO); }   // lucarnes
    if (rnd() < 0.7) { R(ctx, x + Math.floor(w * (0.2 + rnd() * 0.5)), top - 22, 4, 10, o.wallO); }              // cheminée
  }
  function drawFondImmeubles(o, seed) {
    var w = 480, h = 236, c = PA.canvas(w, h), ctx = c.ctx, rnd = PA.rng(seed), x = 0, widths = [48, 60, 72, 84], list = [];
    while (x < w) { var bw = widths[Math.floor(rnd() * widths.length)]; if (w - x - bw < 48) bw = w - x; list.push([x, bw]); x += bw; }
    list.forEach(function (b) { facade(ctx, b[0], b[1], h - 112 - Math.floor(rnd() * 34), h, o, rnd); });
    if (o.dome) { R(ctx, o.dome - 14, h - 160, 28, 12, o.wallO); PA.disc(ctx, o.dome, h - 160, 14, o.roof); R(ctx, o.dome - 1, h - 186, 2, 12, o.roofO); R(ctx, o.dome - 4, h - 176, 8, 4, o.winL); }   // dôme d'angle
    return c.cv;
  }
  /** Fond de Feydeau : hôtels d'armateurs en tuffeau clair, balcons de fer forgé et mascarons, toits d'ardoise. */
  function drawFondFeydeau() { return drawFondImmeubles({ wall: '#e4d4a8', wallO: '#c4b283', win: '#3a4a6a', winL: '#6a7fa0', roof: '#5a6178', roofO: '#3f4560', masc: true }, 21); }
  /** Fond de la place Graslin : immeubles de pierre grise, balcons à chaque étage, toits de zinc et dôme d'angle. */
  function drawFondGraslin() { return drawFondImmeubles({ wall: '#d9cdb4', wallO: '#b5a98e', win: '#40506e', winL: '#7084a6', roof: '#7d8a9a', roofO: '#56627a', masc: false, allBalc: true, dome: 330 }, 33); }
  /** Fond du quartier de la Tour LU : immeubles nantais en tuffeau crème (comme l'île Feydeau), toits d'ardoise, balcons de fer. Les arbres sont des décors posés au sol (voir lv_arbre_rue). */
  function drawFondQuartier() {
    var base = { wall: '#e4d4a8', wallO: '#c4b283', win: '#3a4a6a', winL: '#6a7fa0', roof: '#5a6178', roofO: '#3f4560', masc: true };
    var alt = { wall: '#ecdfb8', wallO: '#cbbb8c', win: '#3a4a6a', winL: '#6a7fa0', roof: '#6a7186', roofO: '#4a5068', masc: true, allBalc: true };
    var w = 480, h = 236, c = PA.canvas(w, h), ctx = c.ctx, rnd = PA.rng(52), x = 0, n = 0, widths = [48, 60, 72];
    while (x < w) { var bw = widths[Math.floor(rnd() * widths.length)]; if (w - x - bw < 48) bw = w - x; facade(ctx, x, bw, h - 100 - Math.floor(rnd() * 30), h, n % 2 ? alt : base, rnd); x += bw; n++; }
    return c.cv;
  }
  /** Arbre d'alignement de rue (32×64) : tronc, houppier rond et grille d'arbre au pied ; posé au sol comme un décor. */
  function drawArbreRue() {
    var o = PA.canvas(32, 64), ctx = o.ctx, k = '#1d1f2b';
    R(ctx, 14, 30, 4, 32, k); R(ctx, 15, 30, 2, 32, '#7a4e2a'); R(ctx, 15, 30, 1, 32, '#a5683f');
    PA.disc(ctx, 16, 18, 15, k); PA.disc(ctx, 16, 18, 14, '#2f7a42'); PA.disc(ctx, 11, 14, 8, '#3f8a4f'); PA.disc(ctx, 21, 12, 7, '#4fa862'); PA.disc(ctx, 20, 22, 6, '#2a6a3a');
    R(ctx, 9, 60, 14, 4, k); R(ctx, 10, 61, 12, 2, '#6f7a8e');                                                  // grille d'arbre
    return o.cv;
  }
  /** Vitrail : plomb sombre et petits carreaux de verre colorés (bleu en haut, rouge et or en bas), dans une forme d'arc brisé ; w × h en pixels. */
  function vitrail(ctx, x, y, w, h, rnd, arc) {
    var pal = [['#3f62b8', '#5b7fd8', '#2f4a96'], ['#b83b46', '#d85b66'], ['#e6b83a', '#f4d35e'], ['#3f9a6a', '#5bbf8a'], ['#7a4ab8', '#9a6ad8']], cx, cy, r;
    function dedans(px, py) { if (py >= arc) return Math.abs(px - w / 2) <= w / 2; var dy = arc - py; return Math.abs(px - w / 2) <= (w / 2) * Math.sqrt(Math.max(0, 1 - (dy / arc) * (dy / arc))); }
    for (r = 0; r < h; r++) for (var c = 0; c < w; c++) if (dedans(c, r)) R(ctx, x + c, y + r, 1, 1, '#2b2433');
    for (cy = 0; cy < h; cy += 6) for (cx = 0; cx < w; cx += 6) {
      if (!dedans(cx + 2, cy + 2)) continue;
      var kind = cy < h * 0.35 ? 0 : (cy < h * 0.7 ? 1 + Math.floor(rnd() * 2) : 2 + Math.floor(rnd() * 3)), col = pal[kind][Math.floor(rnd() * pal[kind].length)];
      for (r = 0; r < 5; r++) for (var q = 0; q < 5; q++) if (dedans(cx + q, cy + r)) R(ctx, x + cx + q, y + cy + r, 1, 1, col);
    }
    R(ctx, x + Math.floor(w / 2), y + 4, 1, h - 4, '#2b2433');                                                   // meneau central
  }
  /** Fond de la nef (480×236, se répète) : piliers à nervures, grands vitraux en arc brisé, rosace, triforium et sol de dalles. Dessiné d'après des vues de l'intérieur de la cathédrale (référence uniquement). */
  function drawFondNef() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(34), mur = '#cfc7b2', murO = '#b9b09a', x, y, i;
    R(ctx, 0, 0, w, h, mur);
    for (y = 0; y < h; y += 12) { R(ctx, 0, y, w, 1, '#c2b9a2'); for (x = ((y / 12) % 2) * 12; x < w; x += 24) R(ctx, x, y, 1, 12, '#c2b9a2'); }   // appareil de pierre
    for (i = 0; i < 4; i++) {                                                                                      // quatre travées de 120 px
      var bx = i * 120 + 22;
      if (i === 2) {                                                                                                // rosace
        var rx = bx + 38, ry = 78;
        PA.disc(ctx, rx, ry, 31, '#2b2433'); var cols = ['#3f62b8', '#b83b46', '#e6b83a', '#5b7fd8', '#7a4ab8', '#3f9a6a'];
        for (var a = 0; a < 12; a++) { var an = a / 12 * Math.PI * 2; for (var d = 5; d < 28; d += 3) R(ctx, Math.round(rx + Math.cos(an) * d) - 1, Math.round(ry + Math.sin(an) * d) - 1, 3, 3, cols[(a + (d > 15 ? 1 : 0)) % cols.length]); }
        PA.disc(ctx, rx, ry, 5, '#e6b83a'); PA.disc(ctx, rx, ry, 2, '#fff3a0');
        R(ctx, rx - 31, ry + 36, 62, 3, murO);
      } else { vitrail(ctx, bx + 12, 28, 52, 136, rnd, 30); }
      R(ctx, bx + 8, 24, 60, 3, murO);                                                                              // appui
    }
    for (i = 0; i < 5; i++) {                                                                                      // piliers
      var px = i * 120 - 7;
      R(ctx, px, 0, 18, h, murO); R(ctx, px + 2, 0, 5, h, '#d9d0bb'); R(ctx, px + 13, 0, 5, h, '#8f8672'); R(ctx, px + 8, 0, 1, h, '#a39a85');
      R(ctx, px - 3, 10, 24, 6, '#a39a85'); R(ctx, px - 3, 10, 24, 1, '#d9d0bb'); R(ctx, px - 2, h - 42, 22, 6, '#a39a85');
    }
    R(ctx, 0, h - 62, w, 3, '#a39a85');                                                                            // triforium
    for (x = 0; x < w; x += 12) { R(ctx, x + 2, h - 58, 8, 14, '#8f8672'); PA.disc(ctx, x + 6, h - 58, 4, '#8f8672'); }
    R(ctx, 0, h - 44, w, 44, '#b3aa92'); for (x = 0; x < w; x += 24) R(ctx, x, h - 44, 1, 44, '#9a917b'); R(ctx, 0, h - 28, w, 1, '#9a917b');   // sol de dalles
    return o.cv;
  }
  /** Plaque de verre debout (14×30), cadre sombre, verre bleuté et reflet : elle s'allume au passage dans le niveau du Mémorial. */
  function drawPlaque() {
    var o = PA.canvas(14, 30), ctx = o.ctx, k = '#1d1f2b';
    R(ctx, 0, 0, 14, 30, k); R(ctx, 1, 1, 12, 28, '#a9cde6'); R(ctx, 1, 1, 12, 3, '#d4e8f6'); R(ctx, 3, 6, 1, 18, '#ffffff'); R(ctx, 5, 10, 1, 10, '#ffffff'); R(ctx, 3, 8, 8, 1, '#7fa6c4'); R(ctx, 3, 12, 6, 1, '#7fa6c4'); R(ctx, 3, 16, 7, 1, '#7fa6c4'); R(ctx, 3, 20, 5, 1, '#7fa6c4');
    return o.cv;
  }
  /** Fissure de voûte qui suinte (14×10) : lèvre de pierre sombre et trace d'humidité ; la goutte se forme en dessous. */
  function drawFuite() {
    var o = PA.canvas(14, 10), ctx = o.ctx, k = '#1d1f2b';
    R(ctx, 2, 0, 10, 3, k); R(ctx, 4, 3, 6, 2, '#6f7a8e'); R(ctx, 6, 5, 2, 3, '#5b8fcb'); R(ctx, 6, 8, 2, 1, '#cfe6ff'); R(ctx, 3, 0, 8, 1, '#8f8672');
    return o.cv;
  }
  /** Banc d'église (32×20, vu de côté) : dossier, assise et agenouilloir en bois sombre. */
  function drawBancEglise() {
    var o = PA.canvas(32, 20), ctx = o.ctx, k = '#1d1f2b', b = '#7a4e2a', bC = '#a5683f', bO = '#5a3820';
    R(ctx, 0, 0, 32, 20, 'rgba(0,0,0,0)');
    R(ctx, 22, 0, 6, 17, k); R(ctx, 23, 1, 4, 15, b); R(ctx, 23, 1, 1, 15, bC);                                    // dossier
    R(ctx, 3, 9, 25, 4, k); R(ctx, 4, 10, 23, 2, bC);                                                             // assise
    R(ctx, 2, 13, 4, 7, k); R(ctx, 3, 13, 2, 7, bO); R(ctx, 23, 13, 4, 7, k); R(ctx, 24, 13, 2, 7, bO);              // pieds
    R(ctx, 0, 15, 8, 3, k); R(ctx, 1, 16, 6, 1, b);                                                                // agenouilloir
    return o.cv;
  }
  // ---------- Machines de l'île : grands décors dessinés par code d'après des photos (Wikimédia Commons) ----------
  /** Rend le dessin « pixel » : pas de flou (transparence seuillée) et contour sombre tout autour. */
  function finir(cv) {
    var w = cv.width, h = cv.height, src = cv.getContext('2d').getImageData(0, 0, w, h), o = PA.canvas(w + 4, h + 4), W2 = w + 4, i, x, y;
    var out = o.ctx.createImageData(W2, h + 4);
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) { i = (y * w + x) * 4; if (src.data[i + 3] > 130) { var j = ((y + 2) * W2 + x + 2) * 4; out.data[j] = src.data[i]; out.data[j + 1] = src.data[i + 1]; out.data[j + 2] = src.data[i + 2]; out.data[j + 3] = 255; } }
    var res = o.ctx.createImageData(W2, h + 4); res.data.set(out.data);
    function op(px, py) { return px >= 0 && py >= 0 && px < W2 && py < h + 4 && out.data[(py * W2 + px) * 4 + 3] === 255; }
    for (y = 0; y < h + 4; y++) for (x = 0; x < W2; x++) { if (op(x, y)) continue; if (op(x + 1, y) || op(x - 1, y) || op(x, y + 1) || op(x, y - 1)) { var k = (y * W2 + x) * 4; res.data[k] = 23; res.data[k + 1] = 14; res.data[k + 2] = 59; res.data[k + 3] = 255; } }
    o.ctx.putImageData(res, 0, 0);
    return o.cv;
  }
  function ell(ctx, cx, cy, rx, ry, col, rot) { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2); ctx.fill(); }
  function poly(ctx, pts, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); ctx.fill(); }
  function seg(ctx, x0, y0, x1, y1, wd, col) { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }

  /** Le Grand Éléphant (128×100) : corps de bois clair ridé, trompe articulée noire, grandes défenses, grande oreille, balcon de bois sur le dos. */
  function drawElephant() {
    var o = PA.canvas(128, 100), c = o.ctx, bois = '#c89a5e', boisO = '#a5723f', boisC = '#dbb47a', acier = '#6f7a8e', noir = '#2b2e3a', i;
    [[26, 14], [40, 14], [70, 14], [84, 14]].forEach(function (l, n) { poly(c, [[l[0], 62], [l[0] + l[1], 62], [l[0] + l[1] - 1, 96], [l[0] + 1, 96]], n % 2 ? boisO : bois); R(c, l[0], 80, l[1], 3, acier); R(c, l[0] - 1, 94, l[1] + 2, 4, acier); });   // pattes à articulations d'acier
    ell(c, 58, 52, 42, 28, bois); ell(c, 58, 64, 40, 16, boisO);                                                   // corps
    for (i = 0; i < 6; i++) seg(c, 22 + i * 12, 44, 28 + i * 12, 64, 1, '#8a5a30');                               // rides du bois
    R(c, 34, 40, 36, 3, boisC);
    ell(c, 98, 42, 20, 22, bois); ell(c, 100, 36, 14, 14, boisC);                                                  // tête
    ell(c, 84, 40, 14, 24, '#e8d8b0'); ell(c, 84, 40, 11, 21, '#d8c090'); seg(c, 84, 22, 84, 56, 1, '#8a5a30'); seg(c, 78, 28, 90, 50, 1, '#8a5a30');   // grande oreille (parchemin)
    R(c, 104, 33, 3, 3, noir); R(c, 105, 33, 1, 1, '#fff'); seg(c, 100, 28, 110, 32, 2, boisO);
    for (i = 0; i < 8; i++) { var tx = 112 + i * 1.1, ty = 52 + i * 5, rr = 5.2 - i * 0.25; ell(c, tx, ty, rr, rr * 0.9, i % 2 ? noir : acier); }          // trompe articulée
    ell(c, 120, 92, 3.5, 3, noir);
    seg(c, 104, 58, 118, 66, 5, '#f0e4c4'); seg(c, 118, 66, 126, 54, 4, '#f0e4c4');                                                                 // défense courbe vers l'avant
    R(c, 38, 18, 32, 18, '#8a5a30'); R(c, 40, 20, 28, 14, '#c27a42'); R(c, 36, 14, 36, 5, '#e8873a'); R(c, 36, 12, 36, 3, '#c0453a');                // balcon et auvent
    for (i = 0; i < 6; i++) R(c, 41 + i * 5, 24, 2, 9, noir);
    R(c, 38, 36, 32, 3, boisO);
    return finir(o.cv);
  }
  /** Le Carrousel des Mondes Marins (84×128) : tour d'acier à trois étages, rideaux rouges, grand toit à frise bleue, lanterne et girouette. */
  function drawCarrousel() {
    var o = PA.canvas(84, 128), c = o.ctx, acier = '#4a5068', acierC = '#8a90a8', rouge = '#a5523f', i;
    R(c, 6, 66, 4, 62, acier); R(c, 74, 66, 4, 62, acier); R(c, 40, 66, 4, 62, acier);                           // montants
    for (i = 0; i < 3; i++) { seg(c, 8, 68 + i * 20, 42, 88 + i * 20, 2, acier); seg(c, 42, 68 + i * 20, 76, 88 + i * 20, 2, acier); }   // croisillons
    R(c, 4, 88, 76, 4, acierC); R(c, 4, 112, 76, 4, acierC);                                                      // planchers
    R(c, 16, 52, 8, 36, '#c0453a'); R(c, 60, 52, 8, 36, '#c0453a');                                                // rideaux rouges
    ell(c, 42, 54, 36, 12, rouge); R(c, 6, 54, 72, 6, '#6a3a28');                                                  // dessous du grand toit
    poly(c, [[2, 50], [82, 50], [66, 26], [18, 26]], rouge);                                                       // toit
    R(c, 6, 40, 72, 9, '#3f62b8'); for (i = 0; i < 6; i++) R(c, 8 + i * 12, 41, 8, 7, i % 2 ? '#5b7fd8' : '#e6b83a');   // frise de peintures
    for (i = 0; i < 8; i++) PA.disc(c, 6 + i * 10, 38, 2, '#3f8a4f');                                              // guirlande
    R(c, 28, 18, 28, 9, '#c0453a'); poly(c, [[32, 18], [52, 18], [48, 8], [36, 8]], '#e8873a'); R(c, 41, 0, 2, 9, acier); poly(c, [[43, 1], [50, 3], [43, 5]], '#f4d35e');   // lanterne et girouette
    return finir(o.cv);
  }
  /** L'Arbre aux Hérons (96×128) : arbre d'acier sombre aux branches courbes, feuillage de pin, passerelle, héron perché au sommet. */
  function drawArbreHerons() {
    var o = PA.canvas(96, 128), c = o.ctx, acier = '#2b2e3a', acierC = '#6f7a8e', vert = '#3f8a4f', vertC = '#5fae6a', i;
    seg(c, 46, 126, 46, 60, 9, acier); seg(c, 46, 70, 18, 40, 6, acier); seg(c, 46, 70, 78, 36, 6, acier); seg(c, 46, 60, 40, 24, 5, acier);   // tronc et branches
    for (i = 0; i < 5; i++) R(c, 44, 66 + i * 12, 5, 2, acierC);                                                    // anneaux d'acier
    [[18, 38, 18], [78, 34, 20], [40, 22, 16], [58, 52, 14], [28, 56, 12]].forEach(function (b) { ell(c, b[0], b[1], b[2], b[2] * 0.6, vert); ell(c, b[0] - 3, b[1] - 3, b[2] * 0.6, b[2] * 0.35, vertC); });   // houppiers de pin
    seg(c, 46, 100, 16, 84, 4, acier); seg(c, 46, 100, 78, 82, 4, acier); ell(c, 14, 80, 12, 7, vert); ell(c, 80, 78, 13, 7, vert);   // branches basses
    // le héron, au sommet
    seg(c, 40, 30, 40, 40, 2, '#f4d35e'); seg(c, 46, 30, 46, 40, 2, '#f4d35e');                                  // pattes
    poly(c, [[26, 24], [38, 22], [38, 30], [30, 32]], '#8fa0b8'); ell(c, 46, 25, 12, 6, '#aab8c8'); ell(c, 44, 24, 8, 4, '#8fa0b8');   // queue, corps, aile
    seg(c, 54, 22, 60, 12, 3, '#aab8c8'); seg(c, 60, 12, 58, 5, 3, '#aab8c8'); ell(c, 59, 4, 3, 2.5, '#cfd8e4'); poly(c, [[61, 3], [74, 5], [61, 6]], '#f4d35e'); R(c, 59, 3, 1, 1, '#1d1f2b');   // cou en S, tête et long bec
    return finir(o.cv);
  }
  /** La Gardienne des Ténèbres (128×100) : buste de femme en bronze aux cheveux en spirale de bélier, sur un corps d'araignée d'acier à huit pattes. */
  function drawGardienne() {
    var o = PA.canvas(128, 100), c = o.ctx, acier = '#2b2e3a', acierC = '#4a5068', bronze = '#c89a5e', bronzeO = '#a5723f', i;
    [[-1, 1], [-1, -1], [1, 1], [1, -1]].forEach(function (d) { for (var k = 0; k < 2; k++) {                       // huit pattes articulées (quatre de chaque côté, deux jeux)
      var sx = 64 + d[0] * (10 + k * 12), kx = 64 + d[0] * (30 + k * 18), ky = 44 - (d[1] > 0 ? 0 : 6) + k * 4, ex = 64 + d[0] * (48 + k * 12), ey = 94;
      seg(c, sx, 72, kx, ky + (d[1] > 0 ? 0 : -4), 4, acier); seg(c, kx, ky + (d[1] > 0 ? 0 : -4), ex, ey, 3, acierC); } });
    ell(c, 64, 76, 32, 14, acier); ell(c, 64, 72, 26, 9, acierC); ell(c, 80, 66, 16, 7, '#6f7a8e');               // abdomen d'acier
    poly(c, [[52, 72], [76, 72], [72, 40], [56, 40]], bronze); R(c, 56, 44, 16, 4, bronzeO); R(c, 54, 56, 22, 3, bronzeO);   // buste
    seg(c, 72, 48, 100, 52, 7, bronze); seg(c, 100, 52, 112, 52, 6, '#3b3b4f'); ell(c, 116, 52, 5, 4, bronze);    // bras tendus vers l'avant
    ell(c, 62, 30, 9, 11, bronze); R(c, 66, 28, 2, 2, acier);                                                     // visage
    ell(c, 52, 22, 14, 16, bronzeO); ell(c, 52, 22, 10, 12, bronze); ell(c, 52, 22, 6, 8, bronzeO); ell(c, 52, 22, 3, 4, bronze);   // cheveux en spirale de bélier
    return finir(o.cv);
  }
  /**
   * Fond de la Galerie des Machines (480×236, se répète) : grande verrière à treillis d'acier, portiques de béton gris, poutres, ouverture lumineuse avec des arbres au bout, plancher clair.
   * Dessiné d'après des photos du hangar consultées sur Wikimédia Commons (référence uniquement).
   */
  function drawFondHangar() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(61), acier = '#2f3646', beton = '#8d8678', betonC = '#a69f90', betonO = '#6b6558', x, y, i;
    var verre = ctx.createLinearGradient(0, 0, 0, 78); verre.addColorStop(0, '#e8f1f8'); verre.addColorStop(1, '#c9dcea'); ctx.fillStyle = verre; ctx.fillRect(0, 0, w, 78);   // verrière
    for (y = 6; y < 78; y += 14) R(ctx, 0, y, w, 1, acier);                                                         // pannes
    for (x = 0; x < w; x += 40) for (i = 0; i < 78; i++) { P(ctx, x + Math.floor(i * 0.55), i, acier); P(ctx, x + 40 - Math.floor(i * 0.55), i, acier); }   // treillis en croix
    R(ctx, 0, 76, w, 4, acier); R(ctx, 0, 80, w, 2, '#4a5268');                                                     // grande poutre
    R(ctx, 0, 82, w, h - 82, '#a9a294');                                                                           // mur du fond de béton
    for (x = 0; x < w; x += 4) for (y = 82; y < 188; y += 6) if (rnd() < 0.05) P(ctx, x, y, betonO);                  // grain
    for (i = 0; i < 2; i++) {                                                                                      // ouverture lumineuse avec arbres, une par demi-largeur
      var ox = i * 240 + 150;
      R(ctx, ox, 96, 56, 90, '#e8f1f8'); R(ctx, ox, 96, 56, 4, acier);
      [[8, 170, 14], [28, 176, 16], [44, 172, 12]].forEach(function (t) { PA.disc(ctx, ox + t[0], t[1], t[2], '#3f8a4f'); PA.disc(ctx, ox + t[0] - 3, t[1] - 3, t[2] * 0.6, '#5fae6a'); });
      R(ctx, ox, 184, 56, 6, betonO);
    }
    for (i = 0; i < 8; i++) {                                                                                      // portiques : poteaux de béton et poutres
      var px = i * 60 + 6;
      R(ctx, px, 82, 14, 108, beton); R(ctx, px, 82, 4, 108, betonC); R(ctx, px + 11, 82, 3, 108, betonO);
      R(ctx, px - 3, 104, 20, 6, betonC); R(ctx, px - 3, 104, 20, 1, '#c8c1b0'); R(ctx, px - 3, 109, 20, 1, betonO);
    }
    R(ctx, 0, 100, w, 8, beton); R(ctx, 0, 100, w, 2, betonC); R(ctx, 0, 107, w, 1, betonO);                          // poutre longue
    R(ctx, 0, 138, w, 5, beton); R(ctx, 0, 138, w, 1, betonC);
    for (i = 0; i < 4; i++) { var ax = i * 120 + 30; R(ctx, ax, 112, 3, 26, acier); R(ctx, ax + 20, 112, 3, 26, acier); seg(ctx, ax + 2, 112, ax + 22, 138, 2, acier); seg(ctx, ax + 22, 112, ax + 2, 138, 2, acier); }   // contreventements d'acier
    R(ctx, 0, 190, w, h - 190, '#d6c7a2');                                                                         // plancher clair
    for (y = 190; y < h; y += 7) R(ctx, 0, y, w, 1, '#bfae88');
    for (x = 0; x < w; x += 30) R(ctx, x, 190, 1, h - 190, '#bfae88');
    return o.cv;
  }
  /** Fond de l'intérieur du théâtre Graslin (480×236, se répète) : salle bleue et or, plafond peint, trois rangs de balcons à loges séparées par des cloisons basses, pilastres dorés, rideaux rouges, parquet. */
  // Les trois lieux intérieurs du théâtre Graslin, d'après des photos de la salle (Wikimédia Commons, référence seulement) : crème, or, rouge sombre, fauteuils vert-bleu, rangées de petites lumières blanches.
  var CREME = '#e8d9b0', CREME_O = '#c9b588', OR = '#d9a93c', OR_C = '#f2d57e', OR_O = '#a8801f', ROUGE = '#8a2331', ROUGE_C = '#b8404f', SOMBRE = '#241618';
  function lumiere(ctx, x, y) { R(ctx, x - 1, y - 1, 3, 3, 'rgba(255,240,190,0.45)'); R(ctx, x, y, 1, 1, '#fffbe8'); }   // petite lampe blanche et son halo
  /** Foyer (480×236) : galerie de promenade crème et or, pilastres, hautes portes éclairées, lustres, tapis rouge. */
  function drawFondFoyer() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, x, y, i;
    R(ctx, 0, 0, w, h, CREME); for (y = 0; y < 190; y += 12) R(ctx, 0, y, w, 1, '#d8c89c');
    R(ctx, 0, 0, w, 20, OR_O); R(ctx, 0, 20, w, 3, OR); R(ctx, 0, 23, w, 2, OR_O);                                  // frise dorée sous le plafond
    for (x = 8; x < w; x += 60) { R(ctx, x, 22, 4, 4, OR); R(ctx, x + 2, 26, 1, 4, OR_O); }                           // pendentifs
    for (i = 0; i < 4; i++) {                                                                                     // hautes portes-fenêtres éclairées, entre des pilastres dorés
      var px = i * 120;
      R(ctx, px, 26, 8, 164, OR); R(ctx, px, 26, 2, 164, OR_C); R(ctx, px + 6, 26, 2, 164, OR_O);
      R(ctx, px + 22, 62, 76, 128, OR_O); R(ctx, px + 25, 66, 70, 124, '#f6e7b8'); R(ctx, px + 25, 66, 70, 14, '#fff4cc');
      PA.disc(ctx, px + 60, 66, 35, '#f6e7b8'); R(ctx, px + 25, 66, 70, 2, OR);
      R(ctx, px + 59, 66, 2, 124, OR); R(ctx, px + 25, 120, 70, 2, OR);
      R(ctx, px + 22, 60, 76, 4, OR); lumiere(ctx, px + 60, 56);
    }
    for (i = 0; i < 2; i++) { var lx = 120 + i * 240; R(ctx, lx, 25, 1, 22, OR_O); R(ctx, lx - 14, 47, 29, 3, OR); for (x = -12; x <= 12; x += 6) { R(ctx, lx + x, 50, 2, 8, OR_C); lumiere(ctx, lx + x + 1, 60); } PA.disc(ctx, lx, 46, 5, OR); }   // lustres
    R(ctx, 0, 168, w, 22, '#6a1f2b'); R(ctx, 0, 168, w, 2, OR); for (x = 0; x < w; x += 20) R(ctx, x + 4, 172, 12, 14, '#7d2a38');   // soubassement de velours rouge
    R(ctx, 0, 190, w, h - 190, '#efe4c8'); for (x = 0; x < w; x += 28) for (y = 190; y < h; y += 14) { R(ctx, x + ((y / 14) % 2 ? 14 : 0), y, 14, 14, '#d3c6a4'); }   // dallage clair
    R(ctx, 0, 192, w, 24, ROUGE); R(ctx, 0, 192, w, 2, OR);                                                          // tapis rouge
    return o.cv;
  }
  /** Salle (480×236) : trois étages de balcons ondulés à devant crème orné d'or, rangées de petites lumières, loges sombres, plafond peint en haut, fauteuils vert-bleu en bas. */
  function drawFondSalle() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(31), x, y, i, n;
    R(ctx, 0, 0, w, h, SOMBRE);
    var pl = ctx.createLinearGradient(0, 0, 0, 56); pl.addColorStop(0, '#d9c3a0'); pl.addColorStop(0.5, '#e8b9a0'); pl.addColorStop(1, '#8fa8c8'); ctx.fillStyle = pl; ctx.fillRect(0, 0, w, 56);   // plafond peint
    for (i = 0; i < 8; i++) { var cx = rnd() * w, cy = 8 + rnd() * 36; PA.disc(ctx, cx, cy, 10 + rnd() * 8, 'rgba(250,236,214,0.85)'); PA.disc(ctx, cx + 12, cy + 3, 8, 'rgba(240,222,196,0.8)'); }
    R(ctx, 0, 54, w, 4, OR_O); R(ctx, 0, 56, w, 3, OR); R(ctx, 0, 59, w, 2, OR_O);                                  // corniche dorée
    var etages = [[62, 98], [100, 136], [138, 174]];
    etages.forEach(function (e, k) {
      var top = e[0], bot = e[1];
      for (x = 0; x < w; x += 40) { R(ctx, x + 18, top + 6, 4, bot - top - 10, '#3a2326'); }                         // cloisons des loges
      for (x = 0; x < w; x += 4) { var off = Math.round(2 * Math.sin(x / 480 * Math.PI * 4)); R(ctx, x, bot - 14 + off, 4, 14, CREME); R(ctx, x, bot - 14 + off, 4, 2, OR_C); R(ctx, x, bot - 3 + off, 4, 3, OR_O); }   // devant de balcon ondulé
      for (x = 0; x < w; x += 20) { var o2 = Math.round(2 * Math.sin(x / 480 * Math.PI * 4)); R(ctx, x + 6, bot - 11 + o2, 8, 6, OR); R(ctx, x + 8, bot - 10 + o2, 4, 4, CREME_O); }   // médaillons dorés
      for (x = 10; x < w; x += 20) lumiere(ctx, x, top + 2 + (k === 0 ? 2 : 0));                                    // rangée de petites lumières
      for (x = 8; x < w; x += 80) { R(ctx, x, top + 4, 7, bot - top - 20, ROUGE); R(ctx, x, top + 4, 7, 2, ROUGE_C); }   // rideaux de loge
    });
    for (x = 0; x < w; x += 120) { R(ctx, x, 62, 6, 112, OR); R(ctx, x, 62, 2, 112, OR_C); }                          // colonnettes dorées
    R(ctx, 0, 174, w, 62, '#1a0f11');
    var sg = drawSieges(); for (x = 0; x < w; x += 60) ctx.drawImage(sg, x, 150);   // les grands fauteuils sont dans le décor du fond (le sol reste dégagé)
    ctx.fillStyle = 'rgba(26,15,17,0.35)'; ctx.fillRect(0, 150, w, 42);               // un peu assombris : le personnage et les pixels ressortent
    return o.cv;
  }
  /** Scène (480×236) : arc de scène doré, grands rideaux rouges ouverts de chaque côté, décor peint au fond, lampes de rampe. */
  function drawFondScene() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, x, y, i;
    R(ctx, 0, 0, w, h, SOMBRE);
    var d = ctx.createLinearGradient(0, 30, 0, 190); d.addColorStop(0, '#9cc0e6'); d.addColorStop(1, '#f0dcc0'); ctx.fillStyle = d; ctx.fillRect(90, 30, 300, 160);   // décor peint : ciel
    PA.disc(ctx, 330, 90, 14, '#f8e8a8');
    for (x = 90; x < 390; x += 2) { var hy = 150 + Math.round(10 * Math.sin(x / 30)); R(ctx, x, hy, 2, 190 - hy, '#6a9a5a'); }   // collines peintes
    for (i = 0; i < 6; i++) { var tx = 120 + i * 48; R(ctx, tx, 96, 10, 70, '#efe4c8'); R(ctx, tx - 3, 92, 16, 5, '#d8c89c'); R(ctx, tx - 3, 164, 16, 5, '#d8c89c'); }   // colonnes peintes
    R(ctx, 0, 0, w, 30, ROUGE); for (x = 0; x < w; x += 6) { R(ctx, x, 24, 3, 8, ROUGE_C); } R(ctx, 0, 30, w, 3, OR); for (x = 4; x < w; x += 12) R(ctx, x, 33, 2, 6, OR_O);   // lambrequin rouge à franges d'or
    [[0, 90], [390, 90]].forEach(function (c) {                                                                   // grands rideaux relevés
      for (x = 0; x < c[1]; x++) { var sh = (x % 14 < 7) ? ROUGE : '#6e1a28'; R(ctx, c[0] + x, 33, 1, 157 - Math.round(Math.abs(Math.sin((x + c[0]) / 14)) * 6), sh); }
    });
    R(ctx, 84, 33, 8, 157, OR); R(ctx, 84, 33, 2, 157, OR_C); R(ctx, 388, 33, 8, 157, OR); R(ctx, 394, 33, 2, 157, OR_O);   // montants dorés de l'arc
    R(ctx, 0, 190, w, h - 190, '#8a5a30'); for (y = 190; y < h; y += 7) R(ctx, 0, y, w, 1, '#6a4220'); for (x = 0; x < w; x += 24) R(ctx, x, 190, 1, h - 190, '#6a4220');   // plancher de la scène
    for (x = 20; x < w; x += 40) lumiere(ctx, x, 188);                                                            // lampes de rampe
    return o.cv;
  }
  /** Rangée de deux grands fauteuils de théâtre vus de face (64×42, plus hauts que le personnage) : dossier arrondi en velours vert-bleu capitonné, liseré d'or, assise, accoudoirs de bois. */
  function drawSieges() {
    var o = PA.canvas(64, 42), ctx = o.ctx;
    for (var i = 0; i < 2; i++) {
      var x = i * 32 + 2;
      R(ctx, x, 6, 28, 26, '#2f7f7a'); R(ctx, x + 3, 2, 22, 5, '#2f7f7a'); R(ctx, x + 6, 0, 16, 3, '#2f7f7a');          // dossier arrondi
      R(ctx, x, 6, 28, 2, OR); R(ctx, x + 3, 2, 22, 1, OR); R(ctx, x + 6, 0, 16, 1, OR);                              // liseré d'or
      R(ctx, x + 4, 11, 20, 16, '#3a9690'); for (var cx = x + 6; cx < x + 24; cx += 6) for (var cy = 13; cy < 27; cy += 6) R(ctx, cx, cy, 2, 2, '#245f5b');   // capiton
      R(ctx, x - 1, 24, 30, 10, '#245f5b'); R(ctx, x - 1, 24, 30, 2, '#4aa59f');                                      // assise
      R(ctx, x - 3, 16, 5, 22, '#5a3a22'); R(ctx, x - 3, 16, 5, 2, '#7a5232'); R(ctx, x + 26, 16, 5, 22, '#5a3a22'); R(ctx, x + 26, 16, 5, 2, '#7a5232');   // accoudoirs
      R(ctx, x + 1, 36, 5, 6, '#3a2616'); R(ctx, x + 22, 36, 5, 6, '#3a2616');                                         // pieds
    }
    return finir(o.cv);
  }
  /** Balcon de théâtre (w tuiles × 28) : balustrade dorée, tablette, devant crème à médaillons d'or, dessous doré. Habille une plateforme dont le dessus est à 8 px du haut. */
  function drawBalcon(wt) {
    var w = wt * 16, o = PA.canvas(w, 28), ctx = o.ctx, x;
    R(ctx, 0, 0, w, 2, OR_C); for (x = 1; x < w - 1; x += 5) R(ctx, x, 2, 2, 6, OR);                                  // main courante et balustres
    R(ctx, 0, 8, w, 3, OR); R(ctx, 0, 8, w, 1, OR_C);                                                               // tablette = la plateforme
    R(ctx, 0, 11, w, 13, CREME); R(ctx, 0, 11, w, 1, CREME_O);
    for (x = 4; x < w - 6; x += 12) { R(ctx, x, 14, 8, 6, OR); R(ctx, x + 2, 15, 4, 4, CREME_O); R(ctx, x, 14, 8, 1, OR_C); }   // médaillons dorés
    R(ctx, 0, 24, w, 4, OR_O); R(ctx, 0, 24, w, 1, OR);
    return finir(o.cv);
  }
  /** Sol du foyer (576×16) : dallage damier crème et gris, tapis rouge au milieu. */
  function drawSolFoyer() {
    var o = PA.canvas(576, 16), ctx = o.ctx, x;
    for (x = 0; x < 576; x += 16) { R(ctx, x, 0, 16, 16, (x / 16) % 2 ? '#d3c6a4' : '#efe4c8'); }
    R(ctx, 0, 0, 576, 2, '#b9ab85'); R(ctx, 0, 3, 576, 7, ROUGE); R(ctx, 0, 3, 576, 1, OR); R(ctx, 0, 9, 576, 1, OR);
    return o.cv;
  }
  /** Sol de la salle (768×16) : moquette rouge sombre, galon doré, motifs. */
  function drawSolSalle() {
    var o = PA.canvas(768, 16), ctx = o.ctx, x;
    R(ctx, 0, 0, 768, 16, '#5e1a26'); R(ctx, 0, 0, 768, 2, OR); R(ctx, 0, 2, 768, 1, OR_O);
    for (x = 4; x < 768; x += 16) { R(ctx, x, 7, 8, 2, '#7d2a38'); R(ctx, x + 2, 5, 4, 6, '#7d2a38'); }
    return o.cv;
  }
  /** Plancher de la scène (384×16) : lames de bois, joints, bord clair devant. */
  function drawSolScene() {
    var o = PA.canvas(384, 16), ctx = o.ctx, x;
    R(ctx, 0, 0, 384, 16, '#9a6a3a'); R(ctx, 0, 0, 384, 2, '#c4905a'); R(ctx, 0, 7, 384, 1, '#6a4220'); R(ctx, 0, 14, 384, 2, '#5e3a1a');
    for (x = 12; x < 384; x += 36) { R(ctx, x, 2, 1, 5, '#6a4220'); R(ctx, x + 18, 8, 1, 6, '#6a4220'); }
    return o.cv;
  }
  /** Lampe de rampe (10×14) : pied de cuivre et globe lumineux. */
  function drawRampe() {
    var o = PA.canvas(10, 14), ctx = o.ctx;
    R(ctx, 4, 6, 2, 8, '#6a4a1a'); R(ctx, 2, 12, 6, 2, '#6a4a1a'); PA.disc(ctx, 5, 4, 4, '#fff1a8'); PA.disc(ctx, 5, 4, 2, '#ffffff');
    return finir(o.cv);
  }
  /** Grue Titan (portique à tour treillis, flèche à droite, contre-flèche et contrepoids à gauche) : x = pied de la tour, y = sol, h = hauteur de la tour. */
  function grueTitan(ctx, x, y, h, clair, fonce) {
    var top = y - h, i;
    R(ctx, x - 7, top, 3, h, fonce); R(ctx, x + 4, top, 3, h, fonce);                                              // montants de la tour
    for (i = 0; i < h - 6; i += 10) { seg(ctx, x - 6, top + i, x + 6, top + i + 10, 1.4, clair); seg(ctx, x + 6, top + i, x - 6, top + i + 10, 1.4, clair); R(ctx, x - 7, top + i, 14, 1, fonce); }   // treillis en croix
    R(ctx, x - 12, y - 6, 24, 6, fonce);                                                                            // pied
    R(ctx, x - 6, top - 8, 14, 8, clair); R(ctx, x - 4, top - 6, 5, 3, '#dfeaf2');                                  // cabine
    R(ctx, x - 40, top - 2, 112, 3, fonce); R(ctx, x - 40, top, 112, 2, clair);                                     // flèche et contre-flèche
    for (i = 0; i < 100; i += 8) { seg(ctx, x - 36 + i, top + 2, x - 28 + i, top + 8, 1, fonce); seg(ctx, x - 28 + i, top + 8, x - 20 + i, top + 2, 1, fonce); }   // treillis de la flèche
    R(ctx, x - 40, top + 2, 112, 1, fonce); R(ctx, x - 44, top - 4, 12, 12, fonce);                                 // contrepoids
    seg(ctx, x + 60, top + 2, x + 60, top + 36, 1, '#3a3a3a'); R(ctx, x + 58, top + 36, 5, 4, '#3a3a3a');           // câble et crochet
    seg(ctx, x, top - 8, x + 70, top, 1, '#5a5a5a'); seg(ctx, x, top - 8, x - 40, top, 1, '#5a5a5a');               // haubans
  }
  /** Fond du Parc des Chantiers (480×236, se répète) : d'après les anciens chantiers navals de l'île de Nantes (Wikimédia Commons et sites officiels, référence seulement) : la grue Titan jaune (1954) et la grue Titan grise (1966), les cales de lancement (rails dans l'herbe), la Loire et l'autre rive. */
  function drawFondChantiers() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(55), x, y, i;
    var ciel = ctx.createLinearGradient(0, 0, 0, 130); ciel.addColorStop(0, '#bcd8ee'); ciel.addColorStop(1, '#e8f1f6'); ctx.fillStyle = ciel; ctx.fillRect(0, 0, w, 130);
    for (i = 0; i < 4; i++) { var cx = 30 + i * 125 + rnd() * 30, cy = 24 + rnd() * 40; PA.disc(ctx, cx, cy, 12, 'rgba(255,255,255,0.85)'); PA.disc(ctx, cx + 14, cy + 2, 9, 'rgba(255,255,255,0.8)'); }
    R(ctx, 0, 118, w, 30, '#9aa6ae');                                                                               // l'autre rive : bâtiments bas
    for (x = 0; x < w; x += 22) { var bh = 8 + Math.floor(rnd() * 16); R(ctx, x, 148 - bh, 20, bh, rnd() < 0.5 ? '#8a969e' : '#a9b3b9'); for (y = 150 - bh; y < 146; y += 5) R(ctx, x + 3, y, 3, 2, '#d6dde2'); }
    R(ctx, 0, 148, w, 34, '#7f9db4'); for (y = 152; y < 182; y += 5) for (x = Math.floor(rnd() * 20); x < w; x += 22 + Math.floor(rnd() * 14)) R(ctx, x, y, 6 + Math.floor(rnd() * 8), 1, '#a8c2d2');   // la Loire
    R(ctx, 0, 182, w, 4, '#c9bfa6');                                                                                // quai
    grueTitan(ctx, 340, 186, 104, '#9aa2a8', '#6f767c');                                                            // grue Titan grise, au loin
    R(ctx, 0, 186, w, h - 186, '#6fa24a'); for (i = 0; i < 500; i++) R(ctx, Math.floor(rnd() * w), 188 + Math.floor(rnd() * 48), 1 + Math.floor(rnd() * 2), 1, rnd() < 0.5 ? '#5c8f3c' : '#80b25a');   // pelouse
    grueTitan(ctx, 110, 204, 150, '#f2c200', '#b88a00');                                                            // grue Titan jaune, au premier plan
    R(ctx, 0, 206, w, 14, '#a79e8c'); for (x = 0; x < w; x += 8) R(ctx, x, 206, 1, 14, '#8c8472');                    // cale de lancement : bande de ballast
    R(ctx, 0, 210, w, 2, '#4a4a4a'); R(ctx, 0, 216, w, 2, '#4a4a4a'); for (x = 2; x < w; x += 10) R(ctx, x, 208, 4, 12, '#6a5a44');   // rails et traverses
    [[40, 168], [250, 172], [420, 166]].forEach(function (t) { R(ctx, t[0] - 1, t[1], 3, 40, '#5a4630'); PA.disc(ctx, t[0], t[1] - 6, 14, '#4f8a3c'); PA.disc(ctx, t[0] - 4, t[1] - 2, 9, '#5f9c48'); });   // quelques arbres
    return o.cv;
  }
  /** Garde du Château (20×32, tourné vers la droite) : casque d'acier à plumet rouge et fente de visière, cotte de mailles, tunique blanche à mouchetures d'hermine, bouclier, lance à fanion. */
  function drawGarde() {
    var o = PA.canvas(20, 32), c = o.ctx;
    R(c, 5, 29, 4, 3, '#4a4a52'); R(c, 11, 29, 4, 3, '#4a4a52');                                                    // bottes
    R(c, 5, 19, 4, 10, '#7a828c'); R(c, 11, 19, 4, 10, '#7a828c');                                                  // jambes en mailles
    R(c, 4, 10, 12, 12, '#f2f0e8'); R(c, 4, 20, 12, 2, '#c9c6b8');                                                 // tunique blanche
    [[6, 13], [10, 16], [13, 12], [7, 19]].forEach(function (m) { R(c, m[0], m[1], 2, 2, '#2a2a2e'); });          // mouchetures d'hermine
    R(c, 3, 9, 14, 3, '#9aa4ae');                                                                                   // épaulières
    R(c, 6, 1, 8, 9, '#aeb8c2'); R(c, 6, 1, 8, 2, '#d0d8e0'); R(c, 8, 5, 6, 2, '#2a2a2e');                         // casque et fente de visière
    R(c, 9, -1, 2, 3, '#c0392b'); R(c, 8, 0, 4, 2, '#c0392b');                                                      // plumet
    R(c, 14, 12, 5, 8, '#f2f0e8'); R(c, 14, 12, 5, 1, '#2a2a2e'); R(c, 16, 14, 1, 4, '#2a2a2e');                   // bouclier d'hermine
    R(c, 1, 2, 1, 28, '#6a4a2a'); R(c, 0, 0, 3, 4, '#c0392b');                                                      // lance et fanion
    return finir(o.cv);
  }
  /** Corps de la tour LU (wt×ht tuiles) : mur de briques couleur biscuit, bandeaux crème, fenêtres en arc. Habille la masse sous le belvédère et ses paliers. */
  function drawTourCorps(wt, ht) {
    var w = wt * 16, h = ht * 16, o = PA.canvas(w, h), ctx = o.ctx, x, y;
    R(ctx, 0, 0, w, h, '#c98f55');
    for (y = 0; y < h; y += 6) { R(ctx, 0, y, w, 1, '#a86f3a'); for (x = (y / 6) % 2 ? 0 : 8; x < w; x += 16) R(ctx, x, y, 1, 6, '#a86f3a'); }
    for (y = 14; y < h - 10; y += 48) { R(ctx, 0, y, w, 4, '#ecd9a8'); R(ctx, 0, y + 4, w, 1, '#b99a60'); }                // bandeaux crème
    for (y = 26; y < h - 24; y += 48) for (x = 8; x < w - 14; x += 26) { R(ctx, x, y, 12, 18, '#ecd9a8'); R(ctx, x + 2, y + 2, 8, 16, '#2c3e66'); R(ctx, x + 2, y + 2, 8, 2, '#4a6196'); R(ctx, x + 5, y + 2, 1, 16, '#ecd9a8'); }   // fenêtres
    return o.cv;
  }
  /** Sol d'un monument du niveau secret (wpx × hpx) : surface (haut) et masse (dessous) propres à chaque lieu. */
  function drawSolSection(kind, w, h) {
    var o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(w * 7 + h), x, y;
    var T = {
      herbe: ['#7a5232', '#4f9a3c', '#6fbf52', '#5e3f26'], pierre: ['#d9d4c4', '#e8e4d6', '#f4f1e6', '#b3ad99'], tuffeau: ['#d8c89a', '#e8dcb4', '#f2e8c8', '#b9a574'],
      quai: ['#cfc6aa', '#e0d8be', '#efe8d2', '#a89f84'], moquette: ['#5e1a26', '#d9a93c', '#f2d57e', '#7d2a38'], metal: ['#4a5560', '#6a7a88', '#8fa0b0', '#38424c'],
      chantier: ['#a79e8c', '#6fa24a', '#8cc060', '#8a8070'], buren: ['#8a949c', '#3a8bd8', '#7ac0f8', '#6a747c'], hangar: ['#b9b9b2', '#f2c200', '#ffe066', '#9a9a94'],
      pommeraye: ['#efe4c8', '#a8301c', '#d8503a', '#d3c6a4'], memorial: ['#a3a39e', '#c4c4bd', '#dcdcd6', '#868681'], tourlu: ['#3a3f4a', '#2a2e38', '#ffffff', '#4a505c']
    }[kind] || ['#888', '#aaa', '#ccc', '#666'];
    R(ctx, 0, 0, w, h, T[0]);
    if (kind !== 'herbe' && kind !== 'chantier') for (y = 8; y < h; y += 8) { R(ctx, 0, y, w, 1, T[3]); for (x = ((y / 8) % 2) * 8; x < w; x += 16) R(ctx, x, y, 1, 8, T[3]); }      // joints (briques, dalles, plaques) ; la terre n'en a pas
    for (x = 0; x < w * h / 90; x++) R(ctx, Math.floor(rnd() * w), Math.floor(rnd() * h), 1, 1, T[3]);                              // grain
    if (kind === 'pommeraye') for (y = 16; y < h; y += 16) for (x = ((y / 16) % 2) * 16; x < w; x += 32) R(ctx, x, y, 16, 16, T[3]);   // damier
    R(ctx, 0, 0, w, 5, T[1]); R(ctx, 0, 0, w, 2, T[2]); R(ctx, 0, 5, w, 1, T[3]);                                                   // surface
    if (kind === 'herbe' || kind === 'chantier') for (x = 0; x < w; x += 3) R(ctx, x, 5, 1, 1 + Math.floor(rnd() * 3), T[1]);       // herbes qui pendent
    if (kind === 'hangar') for (x = 0; x < w; x += 12) R(ctx, x, 1, 5, 3, '#1c1c1c');                                              // bande de sécurité jaune et noire
    if (kind === 'tourlu') for (x = 6; x < w; x += 24) R(ctx, x, 2, 10, 1, '#ffffff');                                              // marquage routier
    if (kind === 'moquette') for (x = 4; x < w; x += 12) { R(ctx, x, 9, 4, 2, T[3]); R(ctx, x + 1, 8, 2, 4, T[3]); }
    return o.cv;
  }
  /** Seuil entre deux monuments du niveau secret (48×56, transparent) : deux piliers de pierre et un linteau vert « ligne verte ». */
  function drawSeuil() {
    var o = PA.canvas(48, 56), ctx = o.ctx, x;
    R(ctx, 2, 10, 8, 46, '#b9b3a0'); R(ctx, 38, 10, 8, 46, '#b9b3a0'); R(ctx, 2, 10, 2, 46, '#d6d1c0'); R(ctx, 38, 10, 2, 46, '#d6d1c0'); R(ctx, 8, 10, 2, 46, '#8a8574'); R(ctx, 44, 10, 2, 46, '#8a8574');
    R(ctx, 0, 4, 48, 8, '#2f8a52'); R(ctx, 0, 4, 48, 2, '#5cc07e'); R(ctx, 0, 10, 48, 2, '#1f5e38');
    for (x = 4; x < 44; x += 8) R(ctx, x, 7, 4, 2, '#fff4d8');                                  // pointillé de la ligne verte
    return finir(o.cv);
  }
  /** Héron mécanique en vol (30×20, tourné vers la droite) : corps d'acier gris-bleu, longues ailes, cou tendu et long bec jaune, pattes qui pendent. */
  function drawHeronVol() {
    var o = PA.canvas(30, 20), c = o.ctx;
    poly(c, [[6, 8], [14, 1], [22, 6], [18, 10]], '#8fa0b8');                                                      // aile levée
    poly(c, [[4, 10], [12, 17], [20, 12], [16, 9]], '#6f7a8e');                                                    // aile basse
    ell(c, 14, 10, 8, 4, '#aab8c8');                                                                               // corps
    seg(c, 21, 9, 25, 6, 3, '#aab8c8'); ell(c, 26, 5, 2.4, 2, '#cfd8e4'); poly(c, [[27, 4], [30, 5], [27, 6]], '#f4d35e');   // cou, tête, long bec
    seg(c, 8, 12, 3, 16, 1.5, '#f4d35e'); seg(c, 10, 12, 5, 18, 1.5, '#f4d35e');                                  // pattes
    return finir(o.cv);
  }
  // ---------- Bananes : vraies bananes en croissant (jaune, bouts bruns, queue verte), formes lissées puis contour pixel ----------
  function courbe(ctx, x0, y0, cx, cy, x1, y1, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); ctx.stroke(); }
  /** Une banane en croissant d'un point à un autre (cx, cy : courbure) : liseré brun, corps jaune, reflet clair, bout brun et queue verte. */
  function banane(ctx, x0, y0, cx, cy, x1, y1, w) {
    courbe(ctx, x0, y0, cx, cy, x1, y1, w + 2.4, '#8a6a14');                                                       // liseré qui sépare les bananes entre elles
    courbe(ctx, x0, y0, cx, cy, x1, y1, w, '#f4d35e');
    courbe(ctx, x0 + 0.8, y0 + 0.6, cx - 1, cy + 0.4, x1 + 0.4, y1 - 1, Math.max(1, w * 0.3), '#fff0a0');            // reflet
    ell(ctx, x1, y1, w * 0.45, w * 0.45, '#5a3a14');                                                                // bout brun
    ell(ctx, x0, y0, w * 0.42, w * 0.42, '#8aa63a');                                                                // queue verte
  }
  /** Caisse de bananes (36×28) : caisse de bois à lattes, étiquette verte avec une banane peinte, et des bananes en croissant bien distinctes qui dépassent. */
  function drawCaisseBananes() {
    var o = PA.canvas(26, 21), c = o.ctx;
    c.scale(0.72, 0.72);                                                                                           // dessinée en 36×28 puis réduite : plus petite (retour de l'équipe)
    banane(c, 3, 13, 9, 1, 17, 11, 5); banane(c, 11, 12, 18, 0, 26, 11, 5); banane(c, 19, 12, 27, 1, 33, 12, 5); banane(c, 8, 14, 17, 4, 30, 13, 4);   // bananes qui dépassent
    c.fillStyle = '#d8b078'; c.fillRect(1, 13, 34, 15); c.fillStyle = '#f0cf98'; c.fillRect(1, 13, 34, 3);               // caisse
    c.fillStyle = '#a5723f'; c.fillRect(1, 19, 34, 1); c.fillRect(1, 24, 34, 1); c.fillRect(3, 13, 2, 15); c.fillRect(31, 13, 2, 15);   // lattes et montants
    c.fillStyle = '#3f8a4f'; c.fillRect(10, 16, 16, 9); banane(c, 13, 20, 18, 25, 23, 20, 3);                            // étiquette verte, banane peinte
    return finir(o.cv);
  }
  /** Régime de bananes suspendu (32×42) : tige brune en haut et quatre grosses bananes en croissant, bien séparées, qui pendent en éventail. */
  function drawRegime() {
    var o = PA.canvas(32, 42), c = o.ctx;
    c.fillStyle = '#6b4e2a'; c.fillRect(14, 0, 4, 9);
    [[-3, -12], [-1, -4], [1, 4], [3, 12]].forEach(function (k) { banane(c, 16, 9, 16 + k[1] * 1.7, 22, 16 + k[0] * 4.2, 38, 5); });
    ell(c, 16, 10, 6, 3.4, '#8aa63a');
    return finir(o.cv);
  }
  /** Peau de banane façon Mario Kart (24×32) : une banane jaune bien ronde, dressée, dont la peau s'ouvre en trois pans au pied (deux sur les côtés, un devant) ; bout brun en haut. */
  function drawPeau() {
    var o = PA.canvas(26, 34), c = o.ctx;
    poly(c, [[11, 23], [3, 22], [0, 29], [5, 31], [11, 27]], '#f4d35e'); poly(c, [[10, 24.5], [4, 24], [2, 28], [5, 29.5], [10, 27]], '#fff3b8');        // pan gauche, retombant (intérieur crème)
    poly(c, [[15, 23], [23, 22], [26, 29], [21, 31], [15, 27]], '#f4d35e'); poly(c, [[16, 24.5], [22, 24], [24, 28], [21, 29.5], [16, 27]], '#fff3b8');   // pan droit
    poly(c, [[8, 26], [18, 26], [19, 32], [13, 33.5], [7, 32]], '#ffe680'); poly(c, [[10, 27.5], [16, 27.5], [16.5, 31], [13, 32], [9.5, 31]], '#fff6cc');   // pan de devant
    courbe(c, 13, 25, 7, 20, 8, 13, 8, '#f4d35e'); courbe(c, 8, 14, 9, 7, 16, 3, 6, '#f4d35e'); ell(c, 8, 14, 3.6, 3.6, '#f4d35e');                  // corps : base ronde puis courbe qui s'effile vers le haut
    courbe(c, 10.5, 24, 6, 20, 6.5, 14, 2.2, '#fff0a0'); courbe(c, 6.6, 13, 7.5, 8, 13, 4, 1.6, '#fff0a0');                                          // reflet
    courbe(c, 15.5, 24, 10, 20, 11.5, 14, 2, '#d8b030');                                                                                           // côté ombré
    ell(c, 17, 2.6, 2.4, 2, '#6b4e2a'); c.fillStyle = '#6b4e2a'; c.fillRect(17, 0, 3, 2);                                                           // bout brun
    return finir(o.cv);
  }
  /**
   * Fond du Hangar à Bananes (480×236, se répète) vu du quai des Antilles : long hangar blanc et bas à toit sombre, grue Titan grise à treillis, Anneaux de Buren au loin, Loire.
   * D'après des photos du lieu consultées sur Wikimédia Commons (référence uniquement). Le haut est transparent : le ciel de la météo reste visible.
   */
  function drawFondHangarQuai() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, k = '#2b2e3a', acier = '#8a90a0', x, y, i;
    R(ctx, 0, 196, w, 40, '#5d86b0'); R(ctx, 0, 196, w, 2, '#9fc0e0'); for (x = 0; x < w; x += 22) R(ctx, x + (x % 3) * 4, 204 + (x % 5) * 3, 10, 1, '#7fa6cc');   // la Loire
    for (x = 0; x < w; x += 30) R(ctx, x, 188 - (x % 7), 26, 10, '#a7b3c4');                                          // rive lointaine
    [[60, 150], [330, 130]].forEach(function (g) {                                                                  // grues Titan grises (mât à treillis, flèche, contrepoids)
      var gx = g[0], gh = g[1];
      R(ctx, gx, 196 - gh, 6, gh, acier); R(ctx, gx + 14, 196 - gh, 6, gh, acier);
      for (y = 196 - gh; y < 196; y += 14) { for (i = 0; i < 14; i++) { P(ctx, gx + 6 + Math.floor(i * 8 / 14), y + i, acier); P(ctx, gx + 14 - Math.floor(i * 8 / 14), y + i, acier); } }
      R(ctx, gx - 46, 196 - gh - 8, 112, 5, acier); R(ctx, gx - 46, 196 - gh - 3, 112, 1, k); R(ctx, gx + 20, 196 - gh - 18, 3, 14, acier);   // flèche
      for (i = 0; i < 12; i++) { P(ctx, gx - 46 + i * 9, 196 - gh - 8 + (i % 2) * 4, k); }
      R(ctx, gx + 42, 196 - gh - 14, 22, 10, '#6f7684'); R(ctx, gx - 40, 196 - gh - 3, 2, 22, k); R(ctx, gx - 42, 196 - gh + 19, 6, 4, k);   // contrepoids, câble et crochet
    });
    var rx = 240, ry = 168;                                                                                         // un anneau de Buren (cercle d'acier)
    for (i = 0; i < 360; i += 3) { var a = i * Math.PI / 180; for (var t = 0; t < 3; t++) P(ctx, Math.round(rx + Math.cos(a) * (22 - t)), Math.round(ry + Math.sin(a) * (30 - t)), t === 0 ? '#e8edf5' : '#cfd6e2'); }
    R(ctx, 0, 170, w, 28, '#ece9e2'); R(ctx, 0, 168, w, 3, k); R(ctx, 0, 171, w, 1, '#c9c5bb');                         // le long hangar blanc et son toit sombre
    for (x = 8; x < w; x += 20) { R(ctx, x, 178, 12, 9, k); R(ctx, x + 1, 179, 10, 7, '#7f95ab'); R(ctx, x + 6, 179, 1, 7, k); }   // baies vitrées
    R(ctx, 0, 190, w, 8, '#4a4f5c'); R(ctx, 140, 173, 54, 6, '#c0453a'); R(ctx, 142, 174, 50, 1, '#f4d35e');             // soubassement sombre et enseigne
    return o.cv;
  }
  /** Rails encastrés dans le pavage du quai (16×4) : rail clair et traverses sombres. */
  function drawRails() {
    var o = PA.canvas(16, 4), ctx = o.ctx;
    R(ctx, 0, 0, 16, 1, '#c9cfdb'); R(ctx, 0, 1, 16, 1, '#6f7684'); R(ctx, 1, 2, 2, 2, '#4a4f5c'); R(ctx, 9, 2, 2, 2, '#4a4f5c');
    return o.cv;
  }
  /** Garde-corps en acier corten du quai (32×18) : poutre rouille à tranche claire sur deux poteaux. */
  function drawCorten() {
    var o = PA.canvas(32, 18), ctx = o.ctx, k = '#2b1a10';
    R(ctx, 3, 5, 4, 13, k); R(ctx, 4, 5, 2, 13, '#7a3a20'); R(ctx, 25, 5, 4, 13, k); R(ctx, 26, 5, 2, 13, '#7a3a20');
    R(ctx, 0, 1, 32, 6, k); R(ctx, 0, 2, 32, 4, '#a0502c'); R(ctx, 0, 2, 32, 1, '#c8703c'); R(ctx, 0, 5, 32, 1, '#7a3a20');
    return o.cv;
  }
  /** Flèche de grue grise vue de côté (88×16) : deux membrures et treillis en zigzag ; les caisses de bananes sont suspendues dessous. */
  function drawFlecheGrue() {
    var o = PA.canvas(88, 16), ctx = o.ctx, k = '#2b2e3a', a = '#8a90a0', i;
    R(ctx, 0, 0, 88, 3, k); R(ctx, 0, 1, 88, 1, '#b4bac8'); R(ctx, 0, 11, 88, 3, k); R(ctx, 0, 12, 88, 1, a);
    for (i = 0; i < 88; i += 8) { for (var t = 0; t < 8; t++) { P(ctx, i + t, 3 + Math.floor(t * 8 / 8), k); P(ctx, i + 8 - t, 3 + Math.floor(t * 8 / 8), a); } }
    R(ctx, 34, 13, 20, 3, '#6f7684'); R(ctx, 41, 14, 6, 2, k);                                                      // chariot du crochet
    return o.cv;
  }
  /** Façade de boutique du passage (64×56) : auvent rayé, enseigne avec une icône, vitrine et porte. kind : 'boulangerie', 'chaussettes' ou 'sacs'. */
  function drawBoutique(kind) {
    var o = PA.canvas(64, 56), ctx = o.ctx, k = '#2b2230', i;
    var C = { boulangerie: ['#c0453a', '#f4ecd0', '#8a5a30'], chaussettes: ['#3f62b8', '#f4f4fa', '#2f4a96'], sacs: ['#3f8a4f', '#f4ecd0', '#2e6a3a'], vetements: ['#8b4fb8', '#f4ecd0', '#5e3a8a'], chapeaux: ['#e8873a', '#f4f4fa', '#9a5a20'] }[kind];
    R(ctx, 0, 0, 64, 56, k); R(ctx, 1, 1, 62, 55, '#e8d6a8');                                                     // cadre de pierre
    R(ctx, 3, 3, 58, 11, C[2]); R(ctx, 3, 3, 58, 2, k); R(ctx, 3, 12, 58, 2, k);                                  // enseigne
    if (kind === 'boulangerie') { R(ctx, 8, 6, 14, 4, '#e8b24a'); R(ctx, 8, 6, 14, 1, '#f4d060'); for (i = 0; i < 3; i++) R(ctx, 11 + i * 4, 7, 1, 2, '#8a5a30'); R(ctx, 32, 5, 4, 6, '#d89a4a'); R(ctx, 36, 6, 4, 5, '#e8b24a'); R(ctx, 40, 5, 4, 6, '#d89a4a'); }   // baguette et croissants
    else if (kind === 'chaussettes') { [[10, '#c0453a'], [26, '#f4d35e'], [42, '#3fbfb0']].forEach(function (s) { R(ctx, s[0], 5, 4, 7, s[1]); R(ctx, s[0], 10, 8, 3, s[1]); R(ctx, s[0], 6, 4, 1, '#f4f4fa'); R(ctx, s[0], 8, 4, 1, '#f4f4fa'); }); }   // chaussettes rayées
    else if (kind === 'vetements') { [[8, '#c0453a'], [26, '#3fbfb0'], [44, '#f4d35e']].forEach(function (s) { R(ctx, s[0], 5, 3, 3, s[1]); R(ctx, s[0] + 9, 5, 3, 3, s[1]); R(ctx, s[0] + 3, 6, 6, 6, s[1]); R(ctx, s[0] + 1, 8, 10, 1, '#f4f4fa'); }); }   // chemises et robes
    else if (kind === 'chapeaux') { [[8, '#2b2e3a'], [27, '#c0453a'], [46, '#f4d35e']].forEach(function (s) { R(ctx, s[0] + 3, 4, 8, 5, s[1]); R(ctx, s[0], 9, 14, 2, s[1]); R(ctx, s[0] + 3, 8, 8, 1, '#f4f4fa'); }); }   // chapeaux
    else { [[10, '#c0453a'], [28, '#f4d35e'], [46, '#3f62b8']].forEach(function (s) { R(ctx, s[0], 7, 9, 5, s[1]); R(ctx, s[0] + 2, 4, 1, 3, k); R(ctx, s[0] + 6, 4, 1, 3, k); R(ctx, s[0] + 2, 4, 5, 1, k); }); }   // sacs à main
    for (i = 0; i < 8; i++) { R(ctx, 3 + i * 8, 14, 8, 8, i % 2 ? C[1] : C[0]); R(ctx, 3 + i * 8, 21, 8, 2, k); }   // auvent rayé
    R(ctx, 5, 24, 36, 30, k); R(ctx, 6, 25, 34, 28, '#fff3c8'); R(ctx, 6, 25, 34, 3, '#fffbe8');                    // vitrine éclairée
    if (kind === 'boulangerie') { for (i = 0; i < 4; i++) { R(ctx, 8 + i * 8, 38, 6, 3, '#c98a42'); R(ctx, 8 + i * 8, 37, 6, 1, '#e8b870'); } R(ctx, 7, 44, 32, 2, '#8a5a30'); for (i = 0; i < 5; i++) { R(ctx, 8 + i * 6, 40, 4, 4, '#d89a4a'); } }
    else if (kind === 'vetements') { for (i = 0; i < 4; i++) { var vc = ['#c0453a', '#3fbfb0', '#f4d35e', '#8b6bb8'][i]; R(ctx, 9 + i * 8, 28, 2, 3, '#7a5a3a'); R(ctx, 8 + i * 8, 30, 4, 12, vc); R(ctx, 7 + i * 8, 40, 6, 6, vc); } R(ctx, 7, 46, 32, 2, '#8a5a30'); }   // mannequins en robes
    else if (kind === 'chapeaux') { for (i = 0; i < 4; i++) { var hc = ['#2b2e3a', '#c0453a', '#3f62b8', '#f4d35e'][i]; R(ctx, 10 + i * 8, 34, 5, 4, hc); R(ctx, 8 + i * 8, 38, 9, 2, hc); R(ctx, 12 + i * 8, 40, 1, 6, '#7a5a3a'); } R(ctx, 7, 46, 32, 2, '#8a5a30'); }   // chapeaux sur des présentoirs
    else if (kind === 'chaussettes') { for (i = 0; i < 5; i++) { var cc = ['#c0453a', '#3f62b8', '#f4d35e', '#3fbfb0', '#8b6bb8'][i]; R(ctx, 8 + i * 6, 30, 3, 8, cc); R(ctx, 8 + i * 6, 35, 5, 3, cc); } R(ctx, 7, 46, 32, 2, '#8a5a30'); }
    else { for (i = 0; i < 4; i++) { var bc = ['#c0453a', '#3f62b8', '#f4d35e', '#8b6bb8'][i]; R(ctx, 8 + i * 8, 36, 7, 6, bc); R(ctx, 10 + i * 8, 33, 1, 3, k); R(ctx, 13 + i * 8, 33, 1, 3, k); R(ctx, 10 + i * 8, 33, 4, 1, k); } R(ctx, 7, 46, 32, 2, '#8a5a30'); }
    R(ctx, 44, 24, 16, 32, k); R(ctx, 45, 25, 14, 30, '#6a4a2a'); R(ctx, 47, 27, 10, 12, '#9fc0e0'); R(ctx, 56, 42, 2, 2, '#f4d35e');   // porte vitrée et poignée
    return o.cv;
  }
  /** Tapis rouge à liseré doré (16×4) posé sur le sol de la galerie. */
  function drawTapisRouge() {
    var o = PA.canvas(16, 4), ctx = o.ctx;
    R(ctx, 0, 0, 16, 4, '#8a1f2b'); R(ctx, 0, 0, 16, 1, '#e0b64a'); R(ctx, 0, 3, 16, 1, '#6a1520'); R(ctx, 4, 1, 8, 1, '#a82a38');
    return o.cv;
  }
  /** Portes du théâtre Graslin (64×64) : double porte de bois sombre sous un fronton doré aux deux masques, rideaux rouges de chaque côté. */
  function drawPortesTheatre() {
    var o = PA.canvas(64, 64), ctx = o.ctx, k = '#2b2230', or = '#e0b64a';
    R(ctx, 0, 0, 64, 64, k); R(ctx, 1, 1, 62, 63, '#cfc7b2'); R(ctx, 3, 3, 58, 12, '#27396e'); R(ctx, 3, 3, 58, 2, or); R(ctx, 3, 13, 58, 2, or);       // fronton bleu et or
    PA.disc(ctx, 22, 9, 4, '#f4e6b0'); PA.disc(ctx, 42, 9, 4, '#f4e6b0'); R(ctx, 20, 9, 1, 1, k); R(ctx, 24, 9, 1, 1, k); R(ctx, 40, 9, 1, 1, k); R(ctx, 44, 9, 1, 1, k); R(ctx, 21, 11, 3, 1, k); R(ctx, 41, 10, 3, 1, k);   // les deux masques
    R(ctx, 6, 18, 14, 46, '#8a2331'); R(ctx, 44, 18, 14, 46, '#8a2331'); for (var i = 0; i < 4; i++) { R(ctx, 8 + i * 3, 18, 1, 46, '#a8404f'); R(ctx, 46 + i * 3, 18, 1, 46, '#a8404f'); }   // rideaux rouges
    R(ctx, 20, 20, 24, 44, k); R(ctx, 21, 21, 11, 43, '#5a3820'); R(ctx, 32, 21, 11, 43, '#5a3820'); R(ctx, 30, 40, 2, 4, or); R(ctx, 33, 40, 2, 4, or); R(ctx, 23, 24, 6, 8, '#7a4e2a'); R(ctx, 35, 24, 6, 8, '#7a4e2a');   // double porte
    return o.cv;
  }
  /**
   * Façade du théâtre Graslin (208×132) : péristyle de huit colonnes corinthiennes, entablement, huit statues sur l'attique, et grandes toiles colorées tendues entre les colonnes
   * (jaune, vert, bleu, violet, rouge…) comme sur les photos de la place. Dessinée d'après des photos (Wikimédia Commons), référence uniquement.
   */
  function drawFacadeGraslin() {
    var o = PA.canvas(208, 132), ctx = o.ctx, k = '#2b2230', pierre = '#e8dcc0', pierreO = '#c9bb98', pierreC = '#f4ecd6', i, x, y;
    var toiles = ['#d8c93a', '#2f9a5a', '#2f5fc0', '#2b3a90', '#7a2f8a', '#a02a3a', '#e0a030'];
    R(ctx, 8, 14, 192, 14, k); R(ctx, 9, 15, 190, 12, pierre); R(ctx, 9, 15, 190, 2, pierreC); R(ctx, 9, 25, 190, 2, pierreO);                         // attique
    for (i = 0; i < 8; i++) { var sx = 16 + i * 24; R(ctx, sx + 4, 4, 5, 11, '#f4f4fa'); PA.disc(ctx, sx + 6, 4, 3, '#f4f4fa'); R(ctx, sx + 3, 8, 7, 2, '#f4f4fa'); R(ctx, sx + 4, 10, 1, 5, pierreO); }   // huit Muses sur le toit
    R(ctx, 4, 28, 200, 8, k); R(ctx, 5, 29, 198, 6, pierre); R(ctx, 5, 29, 198, 1, pierreC); R(ctx, 5, 33, 198, 2, pierreO);                         // entablement
    for (x = 8; x < 200; x += 6) R(ctx, x, 30, 2, 3, pierreO);                                                                                          // denticules
    R(ctx, 6, 36, 196, 4, pierreO);                                                                                                                        // architrave
    for (i = 0; i < 7; i++) { var tx = 22 + i * 24; R(ctx, tx, 40, 20, 78, toiles[i]); R(ctx, tx, 40, 20, 3, 'rgba(255,255,255,0.25)'); for (y = 44; y < 118; y += 10) R(ctx, tx + 2, y, 16, 1, 'rgba(0,0,0,0.12)'); }   // toiles tendues
    for (i = 0; i < 8; i++) {                                                                                                                           // huit colonnes corinthiennes
      var cx = 12 + i * 24;
      R(ctx, cx, 40, 10, 78, k); R(ctx, cx + 1, 40, 8, 78, pierre); R(ctx, cx + 1, 40, 2, 78, pierreC); R(ctx, cx + 7, 40, 2, 78, pierreO);
      for (y = 44; y < 114; y += 4) R(ctx, cx + 3, y, 1, 3, pierreO);                                                                                  // cannelures
      R(ctx, cx - 2, 38, 14, 5, k); R(ctx, cx - 1, 39, 12, 3, pierreC); R(ctx, cx - 2, 116, 14, 4, k); R(ctx, cx - 1, 117, 12, 2, pierre);          // chapiteau et base
    }
    for (i = 0; i < 4; i++) { R(ctx, 0, 120 + i * 3, 208, 3, i % 2 ? pierreO : pierre); R(ctx, 0, 120 + i * 3, 208, 1, k); }                              // marches
    return o.cv;
  }
  var POLICE_MEM = {
    A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'], B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'], D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'], G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
    I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'], L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'], R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'], T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'], "'": ['00100', '00100', '01000', '00000', '00000', '00000', '00000']
  };
  /** Écrit un texte en grosses lettres de la police ci-dessus (échelle sc) : lettre claire et ombre portée. */
  function lettresMemorial(ctx, txt, x0, y0, sc, col, ombre, off) {
    off = off === undefined ? 1 : off;
    var cx = x0;
    for (var c = 0; c < txt.length; c++) {
      var ch = txt[c]; if (ch === ' ') { cx += 4 * sc; continue; }
      var g = POLICE_MEM[ch];
      for (var gy = 0; gy < 7; gy++) for (var gx = 0; gx < 5; gx++) if (g[gy][gx] === '1') { R(ctx, cx + gx * sc + off, y0 + gy * sc + off, sc, sc, ombre); R(ctx, cx + gx * sc, y0 + gy * sc, sc, sc, col); }
      cx += (ch === "'" ? 3 : 6) * sc;
    }
    return cx - x0;
  }
  /**
   * Fond extérieur du Mémorial (480×236, se répète) : tout le long du niveau, un grand mur d'acier corten (terracotta rouillé) en panneaux de 160 px séparés par des joints,
   * marbrures de rouille, bandeau de béton clair en haut et socle de béton. D'après des photos du lieu (Wikimédia Commons, référence uniquement).
   */
  function drawFondMemorialCorten() {
    var w = 480, h = 236, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(12), x, y, i;
    R(ctx, 0, 0, w, h, '#9a4a2c');
    for (i = 0; i < 2600; i++) { var px = Math.floor(rnd() * w), py = Math.floor(rnd() * h); R(ctx, px, py, 1 + Math.floor(rnd() * 4), 1 + (rnd() < 0.3 ? 1 : 0), rnd() < 0.5 ? '#8a3f24' : '#b0603a'); }   // marbrures de rouille
    for (x = 0; x < w; x += 160) { R(ctx, x, 0, 2, h, '#6a321e'); R(ctx, x + 2, 0, 1, h, '#b8663c'); for (y = 12; y < h; y += 40) { P(ctx, x + 6, y, '#6a321e'); P(ctx, x + 154, y, '#6a321e'); } }   // joints et boulons
    R(ctx, 0, 0, w, 16, '#c4c4bd'); for (x = 0; x < w; x += 60) R(ctx, x, 0, 1, 16, '#aeaea8'); R(ctx, 0, 16, w, 2, '#6a321e');   // bandeau de béton en haut
    R(ctx, 0, 204, w, 32, '#b9b9b2'); R(ctx, 0, 204, w, 2, '#8a8a84'); for (x = 0; x < w; x += 40) R(ctx, x, 206, 1, 30, '#a0a09a');   // socle de béton
    return o.cv;
  }
  /** Titre géant du Mémorial : « MEMORIAL DE L'ABOLITION DE L'ESCLAVAGE » sur une seule ligne, aussi long que le niveau (comme une grande image zoomée). Renvoie deux moitiés (limite de texture des téléphones). */
  function drawTitreMemorial() {
    var txt = "MEMORIAL DE L'ABOLITION DE L'ESCLAVAGE", unit = lettresMemorial(PA.canvas(1, 1).ctx, txt, 0, 0, 1, '#000', '#000'), sc = Math.floor(2780 / unit);
    var w = unit * sc, h = 7 * sc + 8, o = PA.canvas(w, h);
    lettresMemorial(o.ctx, txt, 0, 0, sc, '#ecece8', '#5a2814', Math.round(sc / 2));
    var half = Math.ceil(w / 2), a = PA.canvas(half, h), c = PA.canvas(w - half, h);
    a.ctx.drawImage(o.cv, 0, 0); c.ctx.drawImage(o.cv, -half, 0);
    return [a.cv, c.cv];
  }
  /** Note de musique lancée par les Muses du théâtre. */
  function drawNote() {
    var o = PA.canvas(10, 12), ctx = o.ctx, k = GP.PAL.k, y = GP.PAL.y;
    R(ctx, 6, 0, 2, 9, k); R(ctx, 7, 0, 3, 3, k); R(ctx, 7, 1, 2, 1, y); PA.disc(ctx, 4, 9, 3, k); PA.disc(ctx, 4, 9, 2, y); R(ctx, 6, 1, 1, 8, y);
    return o.cv;
  }
  /** Fond du Jardin des Plantes : rangées d'arbres, claires au loin puis plus foncées (raccord horizontal, largeur 320). */
  function drawFondParc() {
    var w = 320, h = 120, o = PA.canvas(w, h), ctx = o.ctx, rnd = PA.rng(14), i;
    function boule(cx, cy, r, c) { [-w, 0, w].forEach(function (dx) { PA.disc(ctx, cx + dx, cy, r, c); }); }
    for (i = 0; i < 16; i++) boule(Math.round(i * 20 + rnd() * 10), 46 + Math.floor(rnd() * 14), 14 + Math.floor(rnd() * 8), '#5d9a78');
    R(ctx, 0, 62, w, h - 62, '#5d9a78');
    for (i = 0; i < 10; i++) { var tx = Math.round(i * 32 + rnd() * 14); R(ctx, tx, 70, 3, 40, C.dirtD); }              // quelques troncs
    for (i = 0; i < 12; i++) boule(Math.round(i * 27 + rnd() * 12), 72 + Math.floor(rnd() * 12), 15 + Math.floor(rnd() * 9), '#3f7a4a');
    R(ctx, 0, 90, w, h - 90, '#3f7a4a');
    for (i = 0; i < 7; i++) boule(Math.round(i * 46 + rnd() * 20), 66 + Math.floor(rnd() * 8), 4, '#efb8c8');         // arbres en fleurs (magnolias)
    for (i = 0; i < 40; i++) P(ctx, Math.floor(rnd() * w), 60 + Math.floor(rnd() * 40), GP.PAL.G);
    return o.cv;
  }
  /** Barrière en bois (et portail du jardin). */
  function drawFence(gate) {
    var w = gate ? 48 : 32, o = PA.canvas(w, 16), ctx = o.ctx, k = GP.PAL.k;
    R(ctx, 0, 5, w, 3, k); R(ctx, 0, 6, w, 1, GP.PAL.t); R(ctx, 0, 10, w, 3, k); R(ctx, 0, 11, w, 1, GP.PAL.t);
    for (var x = 1; x < w; x += 8) { R(ctx, x, 1, 4, 15, k); R(ctx, x + 1, 2, 2, 13, GP.PAL.t); }
    if (gate) { R(ctx, 16, 0, 16, 2, k); R(ctx, 18, 0, 12, 1, GP.PAL.y); }
    return o.cv;
  }

  function makeTextures(scene) {
    if (scene.textures.exists('lv_tileset')) return;
    Object.keys(SKIES).forEach(function (k) { PA.toTexture(scene, 'lv_sky_' + k, drawSky(k)); });
    PA.toTexture(scene, 'lv_stars', drawStars());
    PA.toTexture(scene, 'lv_mount', drawMountains());
    PA.toTexture(scene, 'lv_hills', drawHills());
    PA.toTexture(scene, 'lv_cloud', drawCloud());
    Object.keys(SPRITES).forEach(function (k) { PA.sprite(scene, k, SPRITES[k]); });
    PA.sprite(scene, 'lv_lantern_on', lantern(true));
    PA.sprite(scene, 'lv_lantern_off', lantern(false));
    PA.toTexture(scene, 'lv_tree', drawTree(true));
    PA.toTexture(scene, 'lv_tree2', drawTree(false));
    PA.toTexture(scene, 'lv_bush', drawBush());
    PA.toTexture(scene, 'lv_tileset', drawTileset());
    PA.toTexture(scene, 'lv_tram', drawTramStop());
    PA.toTexture(scene, 'lv_glass', drawGlassBuilding());
    PA.toTexture(scene, 'lv_pine', drawPine());
    PA.toTexture(scene, 'lv_fountain', drawFountain());
    PA.toTexture(scene, 'lv_jet', drawJet());
    PA.toTexture(scene, 'lv_flowerbed', drawFlowerBed());
    PA.toTexture(scene, 'lv_woodman', drawWoodMan());
    PA.toTexture(scene, 'lv_sil_orange', drawMarcheurOrange());
    PA.toTexture(scene, 'lv_sil_jaune', drawDuoJaune());
    PA.toTexture(scene, 'lv_sil_ruban', drawPersonnageRuban());
    PA.toTexture(scene, 'lv_sil_oiseau', drawOiseauTopiaire());
    PA.toTexture(scene, 'lv_massif_rouge', drawMassifRouge());
    PA.toTexture(scene, 'lv_hortensia', drawHortensia());
    PA.toTexture(scene, 'lv_herbes_hautes', drawHerbesHautes());
    PA.toTexture(scene, 'lv_fond_parc', drawFondParc());
    PA.toTexture(scene, 'lv_fond_chateau', drawFondChateau());
    PA.toTexture(scene, 'lv_esprit', drawEsprit());
    PA.toTexture(scene, 'lv_robot', drawRobot());
    PA.toTexture(scene, 'lv_conteneur', drawConteneur());
    PA.toTexture(scene, 'lv_conteneur_long', drawConteneur(50));
    PA.toTexture(scene, 'lv_rideau', drawRideau());
    PA.toTexture(scene, 'lv_tapis', drawTapis(false));
    PA.toTexture(scene, 'lv_tapis_g', drawTapis(true));
    PA.toTexture(scene, 'lv_note', drawNote());
    PA.toTexture(scene, 'lv_fond_buren_nuit', drawBuren(false));
    PA.toTexture(scene, 'lv_fond_buren_jour', drawBuren(true));
    PA.toTexture(scene, 'lv_halo', drawHalo());
    ['g', 'm', 'd'].forEach(function (p) { PA.toTexture(scene, 'lv_pb_' + p, drawPetitBeurre(p)); });
    ['h1', 'h2', 'plein', 'g', 'd'].forEach(function (p) { PA.toTexture(scene, 'lv_bit_' + p, drawBitume(p)); });
    ['stop', 'sens', 'cedez'].forEach(function (p) { PA.toTexture(scene, 'lv_pan_' + p, drawPanneau(p)); });
    PA.toTexture(scene, 'lv_feu', drawFeu());
    PA.toTexture(scene, 'lv_abribus', drawAbribus());
    PA.toTexture(scene, 'lv_arbre_rue', drawArbreRue());
    PA.toTexture(scene, 'lv_fond_nef', drawFondNef());
    PA.toTexture(scene, 'lv_fond_hangar', drawFondHangar());
    [3, 5].forEach(function (n) { PA.toTexture(scene, 'lv_balcon_' + n, drawBalcon(n)); }); PA.toTexture(scene, 'lv_sol_foyer', drawSolFoyer()); PA.toTexture(scene, 'lv_sol_salle', drawSolSalle()); PA.toTexture(scene, 'lv_sol_scene', drawSolScene()); PA.toTexture(scene, 'lv_rampe', drawRampe());
    PA.toTexture(scene, 'lv_fond_chantiers', drawFondChantiers()); PA.toTexture(scene, 'lv_garde', drawGarde()); PA.toTexture(scene, 'lv_seuil', drawSeuil());
    Object.keys(GP.SOL_NEEDS || {}).forEach(function (k) { var n = GP.SOL_NEEDS[k]; PA.toTexture(scene, k, drawSolSection(n.kind, n.w * 16, n.h * 16)); });   // sols du niveau secret
    [[10, 13], [5, 11], [5, 9], [5, 7], [5, 5], [6, 3], [8, 2]].forEach(function (d) { PA.toTexture(scene, 'lv_tcorps_' + d[0] + '_' + d[1], drawTourCorps(d[0], d[1])); });
    PA.toTexture(scene, 'lv_fond_foyer', drawFondFoyer()); PA.toTexture(scene, 'lv_fond_salle', drawFondSalle()); PA.toTexture(scene, 'lv_fond_scene', drawFondScene());
    PA.toTexture(scene, 'lv_elephant', drawElephant());
    PA.toTexture(scene, 'lv_carrousel', drawCarrousel());
    PA.toTexture(scene, 'lv_arbre_herons', drawArbreHerons());
    PA.toTexture(scene, 'lv_gardienne', drawGardienne());
    PA.toTexture(scene, 'lv_banc_eglise', drawBancEglise());
    PA.toTexture(scene, 'lv_fuite', drawFuite());
    PA.toTexture(scene, 'lv_plaque', drawPlaque());
    PA.toTexture(scene, 'lv_araignee', drawAraignee());
    PA.toTexture(scene, 'lv_toile', drawToile());
    PA.toTexture(scene, 'lv_caisse_bananes', drawCaisseBananes());
    PA.toTexture(scene, 'lv_regime', drawRegime());
    PA.toTexture(scene, 'lv_peau', drawPeau());
    var titre = drawTitreMemorial(); PA.toTexture(scene, 'lv_titre_memorial_a', titre[0]); PA.toTexture(scene, 'lv_titre_memorial_b', titre[1]);
    PA.toTexture(scene, 'lv_fond_memorial_corten', drawFondMemorialCorten());
    PA.toTexture(scene, 'lv_facade_graslin', drawFacadeGraslin());
    ['boulangerie', 'chaussettes', 'sacs', 'vetements', 'chapeaux'].forEach(function (b) { PA.toTexture(scene, 'lv_boutique_' + b, drawBoutique(b)); });
    PA.toTexture(scene, 'lv_tapis_rouge', drawTapisRouge());
    PA.toTexture(scene, 'lv_portes_theatre', drawPortesTheatre());
    PA.toTexture(scene, 'lv_fond_hangar_quai', drawFondHangarQuai());
    PA.toTexture(scene, 'lv_rails', drawRails());
    PA.toTexture(scene, 'lv_corten', drawCorten());
    PA.toTexture(scene, 'lv_fleche_grue', drawFlecheGrue());
    PA.toTexture(scene, 'lv_heron_vol', drawHeronVol());
    PA.toTexture(scene, 'lv_fond_pommeraye', drawFondPommeraye());
    PA.toTexture(scene, 'lv_fond_feydeau', drawFondFeydeau());
    PA.toTexture(scene, 'lv_fond_graslin', drawFondGraslin());
    PA.toTexture(scene, 'lv_fond_quartier', drawFondQuartier());
    PA.toTexture(scene, 'lv_gardecorps', drawGardeCorps());
    PA.toTexture(scene, 'lv_anneau_red', drawAnneauJeu(true));
    PA.toTexture(scene, 'lv_anneau_blue', drawAnneauJeu(false));
    PA.toTexture(scene, 'lv_tour_lu', drawTourLU());
    PA.toTexture(scene, 'lv_salle_herses', drawSalle(22, false));
    PA.toTexture(scene, 'lv_salle_gardes', drawSalle(20, true));
    PA.toTexture(scene, 'lv_fence', drawFence(false));
    PA.toTexture(scene, 'lv_gate', drawFence(true));
    PA.toTexture(scene, 'lv_backdrop', drawBackdrop(scene));
    // flèche des meurtrières, goutte des gargouilles, fleur-plateforme (soleil)
    PA.sprite(scene, 'lv_arrow', ['rr............', 'krr.........w.', 'kkkkkkkkkkkkww', 'krr.........w.', 'rr............']);   // flèche plus grosse : empennage rouge, pointe claire
    PA.sprite(scene, 'lv_drop', ['.l.', 'lfl', 'lbl', '.l.']);
    PA.sprite(scene, 'lv_flowerplat', ['..kkkkkkkkkkkk..', '.kyyrryyyyrryyk.', 'kyyrrrryyrrrryyk', 'kGyyrryyyyrryyGk', '.kGGGGGGGGGGGGk.', '..kkkkkkkkkkkk..']);
  }

  /** Fond fixe du menu et du créateur : ciel, montagnes, collines, sol d'herbe avec la ligne verte. */
  function drawBackdrop(scene) {
    var o = PA.canvas(480, 270), ctx = o.ctx;
    function img(key) { return scene.textures.get(key).getSourceImage(); }
    ctx.drawImage(img('lv_sky_day'), 0, 0);
    for (var x = 0; x < 480; x += 320) { ctx.drawImage(img('lv_mount'), x, 112); ctx.drawImage(img('lv_hills'), x - 60, 168); }
    [[30, 210, 'lv_tree'], [90, 222, 'lv_bush'], [400, 210, 'lv_tree2'], [440, 210, 'lv_tree'], [330, 224, 'lv_bush']].forEach(function (d) {
      var im = img(d[2]); ctx.drawImage(im, d[0] - im.width / 2, d[1] + 16 - im.height);
    });
    R(ctx, 0, 238, 480, 32, C.dirt); R(ctx, 0, 238, 480, 1, GP.PAL.k); R(ctx, 0, 239, 480, 4, GP.PAL.g); R(ctx, 0, 243, 480, 2, GP.PAL.G);
    for (x = 0; x < 480; x += 6) R(ctx, x, 252, 4, 2, GP.PAL.g);
    for (x = 3; x < 480; x += 11) R(ctx, x, 258 + (x % 7), 2, 2, C.dirtD);
    return o.cv;
  }

  /**
   * Ciel en couches, piloté par la météo, pour une caméra qui défile (carte et niveaux) :
   *   var sky = GP.LevelArt.sky(scene, -40); sky.set(etatMeteo); sky.update(camera, delta) à chaque image.
   * Ciel en bandes (jour, nuageux, gris, orage, nuit étoilée avec lune), montagnes et collines en parallaxe,
   * nuages dont le nombre suit la nébulosité et qui dérivent avec le vent (visuel uniquement).
   */
  function sky(scene, depth, opts) {
    opts = opts || {};
    var D = depth === undefined ? -40 : depth, W = GP.Config.WIDTH;
    var SP = GP.Sprites && GP.Sprites.has('ciel_jour_1');           // ciel de la planche « ciel » si elle est chargée
    var city = !!opts.city && GP.Sprites && GP.Sprites.has('carte_batiments_lointains');
    var o = { clouds: [], stars: [], state: null, lastX: undefined, bands: [] };
    if (SP) for (var b = 0; b < 5; b++) o.bands.push(scene.add.tileSprite(0, b * 54, W, 54, 'ciel_jour_' + (b + 1)).setOrigin(0).setScrollFactor(0).setDepth(D));   // répété : remplit toute la largeur
    else o.img = scene.add.image(0, 0, 'lv_sky_day').setOrigin(0).setScrollFactor(0).setDepth(D);
    if (SP) {
      var rs = PA.rng(5);
      for (var k = 0; k < 40; k++) o.stars.push(scene.add.image(Math.floor(rs() * W), Math.floor(rs() * 150), 'ciel_etoile_' + (1 + k % 3)).setScrollFactor(0).setDepth(D + 1).setVisible(false));
      o.astro = scene.add.image(W - 80, 40, 'ciel_soleil').setScrollFactor(0).setDepth(D + 2).setVisible(false);
    } else o.starImg = scene.add.image(0, 0, 'lv_stars').setOrigin(0).setScrollFactor(0).setDepth(D + 1).setVisible(false);
    // lointain : la ville (carte) ou des montagnes (niveaux), puis des collines
    if (opts.farKey && scene.textures.exists(opts.farKey)) {
      // fond propre au lieu (silhouette du château, nef de la cathédrale, ruelle du Bouffay…)
      var fi = scene.textures.get(opts.farKey).getSourceImage();
      o.far = scene.add.tileSprite(0, opts.farBottom || 240, W, fi.height, opts.farKey).setOrigin(0, 1).setScrollFactor(0).setDepth(D + 5);
      o.near = scene.add.tileSprite(0, opts.nearBottom || 250, W, 40, 'commun_collines_vertes').setOrigin(0, 1).setScrollFactor(0).setDepth(D + 10).setVisible(!!opts.hills);
      city = true;
    } else if (city) {
      o.far = scene.add.tileSprite(0, opts.farBottom || 178, W, 110, 'carte_batiments_lointains').setOrigin(0, 1).setScrollFactor(0).setDepth(D + 5);
      o.near = scene.add.tileSprite(0, opts.nearBottom || 190, W, 40, 'carte_collines_proches').setOrigin(0, 1).setScrollFactor(0).setDepth(D + 10);
    } else {
      o.far = scene.add.tileSprite(0, 120, W, 110, 'lv_mount').setOrigin(0).setScrollFactor(0).setDepth(D + 5);
      o.near = scene.add.tileSprite(0, 176, W, 70, 'lv_hills').setOrigin(0).setScrollFactor(0).setDepth(D + 10);
    }
    var CLOUDS = { day: ['ciel_nuage_blanc_a', 'ciel_nuage_blanc_b', 'ciel_nuage_blanc_c'], cloudy: ['ciel_nuage_blanc_b', 'ciel_nuage_gris_c', 'ciel_nuage_blanc_a'],
      grey: ['ciel_nuage_gris_a', 'ciel_nuage_gris_b', 'ciel_nuage_gris_c'], storm: ['ciel_nuage_orage_a', 'ciel_nuage_orage_b', 'ciel_nuage_gris_b'],
      night: ['ciel_nuage_nuit_a', 'ciel_nuage_nuit_b', 'ciel_nuage_nuit_a'] };
    o.set = function (st) {
      var kind = skyKind(st), rnd = PA.rng(11), FILE = { day: 'jour', cloudy: 'nuageux', grey: 'gris', storm: 'orage', night: 'nuit' }[kind];
      o.state = st;
      if (opts.farNightKey && o.far) o.far.setTexture(kind === 'night' ? opts.farNightKey : opts.farKey);   // fond propre au lieu : version de nuit ou de jour
      if (SP) {
        o.bands.forEach(function (im, i) { im.setTexture('ciel_' + FILE + '_' + (i + 1)); });
        var starry = kind === 'night' && st.cloud < 70;
        o.stars.forEach(function (s) { s.setVisible(starry); });
        o.astro.setVisible(kind === 'night' || (kind === 'day' || kind === 'cloudy')).setTexture(kind === 'night' ? 'ciel_lune_croissant' : 'ciel_soleil');
      } else { o.img.setTexture('lv_sky_' + kind); o.starImg.setVisible(kind === 'night' && st.cloud < 70); }
      // nuages : nombre selon la nébulosité, forme selon le temps
      o.clouds.forEach(function (c) { c.destroy(); }); o.clouds = [];
      var n = Math.round(st.cloud / 100 * 7) + (st.cat === 'clear' ? 1 : 0);
      for (var i = 0; i < n; i++) {
        var key = SP ? CLOUDS[kind][i % 3] : 'lv_cloud';
        o.clouds.push(scene.add.image(rnd() * (W + 40) - 20, 18 + rnd() * 90, key).setScrollFactor(0).setDepth(D + 3).setScale(!SP && rnd() < 0.4 ? 2 : 1));
      }
      if (!SP) o.clouds.forEach(function (c) { if (kind === 'grey' || kind === 'storm' || kind === 'night') c.setTint(kind === 'night' ? 0x8090b8 : 0xc0c6d2); });
    };
    o.update = function (cam, delta) {
      var cx = cam.scrollX, st = o.state;
      o.far.tilePositionX = Math.round(cx * (city ? 0.25 : 0.15));   // arrondi : pas de scintillement des pixels
      o.near.tilePositionX = Math.round(cx * (city ? 0.5 : 0.4));
      var drift = st ? Math.sin((st.windDir + 180) * Math.PI / 180) * (4 + st.wind * 0.3) : 4;
      var dt = Math.min(delta || 16, 50) / 1000, dcam = cx - (o.lastX === undefined ? cx : o.lastX);
      o.lastX = cx;
      o.clouds.forEach(function (c) {
        c.x += (GP.reducedMotion ? 0 : drift * dt) - dcam * 0.08;
        if (c.x > W + 40) c.x -= W + 80; if (c.x < -40) c.x += W + 80;
      });
    };
    return o;
  }

  // ---------- Terrain d'un niveau ----------
  /**
   * Découpe l'image du terrain en morceaux de 2048 px de large : certains téléphones ne gèrent pas de textures plus
   * larges (le terrain d'un long niveau disparaîtrait). Renvoie les clés des textures, de gauche à droite.
   */
  var CHUNK = 2048;
  function chunks(scene, key, cv) {
    var n = Math.max(1, Math.ceil(cv.width / CHUNK)), keys = [];
    for (var i = 0; i < n; i++) {
      var c = PA.canvas(Math.min(CHUNK, cv.width - i * CHUNK), cv.height);
      c.ctx.drawImage(cv, -i * CHUNK, 0);
      PA.toTexture(scene, key + '_' + i, c.cv);
      keys.push(key + '_' + i);
    }
    return keys;
  }

  /**
   * Terrain d'un niveau habillé avec les tuiles d'une planche (L.skin) :
   *   { top: [..], fill: [..], left, right, block, blockTop, blockBottom, ledge: [g, m, d], bridge: [g, m, d] }
   * Une case pleine sans voisin au-dessus prend une tuile « top », un bord gauche/droit la tuile de bord, sinon « fill ».
   */
  function renderSkin(scene, key, L) {
    var W = L.width * T, H = L.rows * T, o = PA.canvas(W, H), ctx = o.ctx, sk = L.skin;
    function im(k) { return scene.textures.exists(k) ? scene.textures.get(k).getSourceImage() : null; }
    function put(k, x, y) { var i = im(k); if (i) ctx.drawImage(i, x, y); }
    function at(x, y) { if (y >= L.rows) return 1; if (x < 0 || x >= L.width || y < 0) return 0; return L.grid[y * L.width + x]; }
    function solid(x, y) { var v = at(x, y); return v === 1 || v === 2 || v === 4 || v === 5; }
    function pick(list, cx, cy) { return Array.isArray(list) ? list[(cx * 7 + cy * 3) % list.length] : list; }
    for (var cy = 0; cy < L.rows; cy++) for (var cx = 0; cx < L.width; cx++) {
      var v = at(cx, cy), x0 = cx * T, y0 = cy * T;
      if (v === 2) {
        // bloc : créneaux en haut, linteau en bas (s'il y en a dans la planche), sinon pierre pleine
        var bk = !solid(cx, cy - 1) && cy > 0 && sk.blockTop ? sk.blockTop : (!solid(cx, cy + 1) && sk.blockBottom ? sk.blockBottom : (sk.block || sk.fill));
        put(pick(bk, cx, cy), x0, y0); continue;
      }
      if (v !== 1 && v !== 5) continue;
      if (!solid(cx, cy - 1)) put(pick(sk.top, cx, cy), x0, y0);
      else if (!solid(cx - 1, cy) && sk.left) put(sk.left, x0, y0);
      else if (!solid(cx + 1, cy) && sk.right) put(sk.right, x0, y0);
      else put(pick(sk.fill, cx, cy), x0, y0);
    }
    L.plats.forEach(function (p) {
      var set = p.kind === 'bridge' ? (sk.bridge || sk.ledge) : sk.ledge;
      for (var j = 0; j < p.w; j++) put(set[j === 0 ? 0 : (j === p.w - 1 ? 2 : 1)], (p.x + j) * T, p.y * T);
    });
    return chunks(scene, key, o.cv);
  }

  function renderTerrain(scene, key, L) {
    if (L.skin) return renderSkin(scene, key, L);
    var W = L.width * T, H = L.rows * T, o = PA.canvas(W, H), ctx = o.ctx, k = GP.PAL.k;
    function at(x, y) { return (x < 0 || x >= L.width || y >= L.rows) ? (y >= L.rows ? 1 : 0) : (y < 0 ? 0 : L.grid[y * L.width + x]); }
    function solid(x, y) { var v = at(x, y); return v === 1 || v === 2 || v === 4 || v === 5; }
    for (var cy = 0; cy < L.rows; cy++) for (var cx = 0; cx < L.width; cx++) {
      var v = at(cx, cy), x0 = cx * T, y0 = cy * T, rnd = PA.rng(cx * 131 + cy * 7);
      if (v === 1) {
        // terre et cailloux
        R(ctx, x0, y0, T, T, C.dirt);
        for (var i = 0; i < 3; i++) { var px = Math.floor(rnd() * 13), py = Math.floor(rnd() * 13); R(ctx, px + x0, py + y0, 2, 2, C.dirtD); P(ctx, px + x0, py + y0, C.dirtL); }
        var up = solid(cx, cy - 1), lf = solid(cx - 1, cy), rt = solid(cx + 1, cy);
        if (!lf) { R(ctx, x0, y0, 1, T, k); R(ctx, x0 + 1, y0, 1, T, C.dirtD); }
        if (!rt) { R(ctx, x0 + T - 1, y0, 1, T, k); R(ctx, x0 + T - 2, y0, 1, T, C.dirtD); }
        if (!up) {
          // herbe : liseré noir, bande verte, coulures qui débordent sur la terre
          R(ctx, x0, y0, T, 1, k); R(ctx, x0, y0 + 1, T, 3, GP.PAL.g); R(ctx, x0, y0 + 4, T, 1, GP.PAL.G);
          for (var dx = 0; dx < T; dx++) {
            var len = ((cx * 16 + dx) * 7 % 5 === 0) ? 3 : (((cx * 16 + dx) % 3 === 0) ? 2 : 1);
            R(ctx, x0 + dx, y0 + 5, 1, len, GP.PAL.G); P(ctx, x0 + dx, y0 + 5 + len, GP.PAL.h);
          }
          for (dx = 1; dx < T; dx += 4) P(ctx, x0 + dx, y0 + 1, C.leafL);
          if (!lf) { ctx.clearRect(x0, y0, 1, 1); R(ctx, x0, y0 + 1, 1, 6, k); }
          if (!rt) { ctx.clearRect(x0 + T - 1, y0, 1, 1); R(ctx, x0 + T - 1, y0 + 1, 1, 6, k); }
        }
      } else if (v === 5) {
        // pavés de gare : dalles grises, joints sombres, bordure claire en surface
        R(ctx, x0, y0, T, T, '#9aa2ae'); R(ctx, x0, y0 + 7, T, 1, '#6f7785'); R(ctx, x0 + ((cy % 2) ? 3 : 11), y0, 1, T, '#6f7785');
        P(ctx, x0 + 5, y0 + 3, '#b9c0ca'); P(ctx, x0 + 12, y0 + 11, '#b9c0ca');
        if (!solid(cx, cy - 1)) { R(ctx, x0, y0, T, 1, k); R(ctx, x0, y0 + 1, T, 3, '#d5dae1'); R(ctx, x0, y0 + 4, T, 1, '#6f7785'); }
        if (!solid(cx - 1, cy)) R(ctx, x0, y0, 1, T, k);
        if (!solid(cx + 1, cy)) R(ctx, x0 + T - 1, y0, 1, T, k);
      } else if (v === 4) {
        // topiaire : butte de feuillage taillé (forme générique, ne reproduit aucune œuvre)
        R(ctx, x0, y0, T, T, GP.PAL.G);
        for (var q = 0; q < 6; q++) { var lx = Math.floor(rnd() * 14), ly = Math.floor(rnd() * 14); R(ctx, x0 + lx, y0 + ly, 2, 2, (q % 2) ? GP.PAL.g : GP.PAL.h); }
        var tu = solid(cx, cy - 1), tl = solid(cx - 1, cy), tr = solid(cx + 1, cy);
        if (!tu) { R(ctx, x0, y0, T, 1, k); R(ctx, x0, y0 + 1, T, 2, GP.PAL.g); P(ctx, x0 + 4, y0 + 1, C.leafL); }
        if (!tl) { R(ctx, x0, y0, 1, T, k); if (!tu) { ctx.clearRect(x0, y0, 3, 2); ctx.clearRect(x0, y0, 1, 4); P(ctx, x0 + 1, y0 + 2, k); P(ctx, x0 + 2, y0 + 1, k); P(ctx, x0, y0 + 4, k); } }
        if (!tr) { R(ctx, x0 + T - 1, y0, 1, T, k); if (!tu) { ctx.clearRect(x0 + T - 3, y0, 3, 2); ctx.clearRect(x0 + T - 1, y0, 1, 4); P(ctx, x0 + T - 2, y0 + 2, k); P(ctx, x0 + T - 3, y0 + 1, k); P(ctx, x0 + T - 1, y0 + 4, k); } }
      } else if (v === 2) {
        // bloc de pierre biseauté
        R(ctx, x0, y0, T, T, k); R(ctx, x0 + 1, y0 + 1, T - 2, T - 2, C.stone);
        R(ctx, x0 + 1, y0 + 1, T - 2, 2, C.stoneL); R(ctx, x0 + 1, y0 + 1, 2, T - 2, C.stoneL);
        R(ctx, x0 + 1, y0 + T - 3, T - 2, 2, C.stoneD); R(ctx, x0 + T - 3, y0 + 1, 2, T - 2, C.stoneD);
        P(ctx, x0 + 6, y0 + 6, C.stoneD); P(ctx, x0 + 9, y0 + 9, C.stoneD);
      }
    }
    // plateformes à sens unique : rebord d'herbe (dessous en dents de scie) ou pont de planches
    L.plats.forEach(function (p) {
      for (var j = 0; j < p.w; j++) {
        var x0 = (p.x + j) * T, y0 = p.y * T, first = j === 0, last = j === p.w - 1;
        if (p.kind === 'bridge') {
          R(ctx, x0, y0, T, 7, k); R(ctx, x0, y0 + 1, T, 5, GP.PAL.t); R(ctx, x0, y0 + 4, T, 2, GP.PAL.C);
          R(ctx, x0 + 7, y0 + 1, 1, 5, k);
          R(ctx, x0 + 3, y0 + 7, 2, 3, k); R(ctx, x0 + 11, y0 + 7, 2, 3, k);
        } else {
          R(ctx, x0, y0, T, 10, k); R(ctx, x0, y0 + 1, T, 3, GP.PAL.g); R(ctx, x0, y0 + 4, T, 1, GP.PAL.G); R(ctx, x0, y0 + 5, T, 4, C.dirt);
          for (var dx = 0; dx < T; dx++) {
            var d = 4 - Math.abs((dx % 8) - 4);      // dents de scie
            R(ctx, x0 + dx, y0 + 9, 1, d, C.dirtD); P(ctx, x0 + dx, y0 + 9 + d, k);
          }
          for (dx = 2; dx < T; dx += 5) P(ctx, x0 + dx, y0 + 1, C.leafL);
          if (first) { R(ctx, x0, y0, 1, 10, k); ctx.clearRect(x0, y0, 1, 1); }
          if (last) { R(ctx, x0 + T - 1, y0, 1, 10, k); ctx.clearRect(x0 + T - 1, y0, 1, 1); }
        }
      }
    });
    return chunks(scene, key, o.cv);
  }

  /** Ciel selon la météo : nuit, orage, gris (pluie, bruine, neige, brume, couvert), nuageux, jour. */
  function skyKind(st) {
    if (!st.isDay) return 'night';
    if (st.cat === 'storm') return 'storm';
    if (st.cat === 'rain' || st.cat === 'drizzle' || st.cat === 'snow' || st.cat === 'fog' || st.cat === 'overcast') return 'grey';
    if (st.cat === 'cloudy') return 'cloudy';
    return 'day';
  }

  return { CHUNK: CHUNK, chunks: chunks, makeTextures: makeTextures, renderTerrain: renderTerrain, skyKind: skyKind, sky: sky, TILE: T, C: C };
})();
