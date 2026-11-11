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
    PA.toTexture(scene, 'lv_salle_herses', drawSalle(22, false));
    PA.toTexture(scene, 'lv_salle_gardes', drawSalle(20, true));
    PA.toTexture(scene, 'lv_fence', drawFence(false));
    PA.toTexture(scene, 'lv_gate', drawFence(true));
    PA.toTexture(scene, 'lv_backdrop', drawBackdrop(scene));
    // flèche des meurtrières, goutte des gargouilles, fleur-plateforme (soleil)
    PA.sprite(scene, 'lv_arrow', ['k.........', 'kkkkkkkkwk', 'k.........']);
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
