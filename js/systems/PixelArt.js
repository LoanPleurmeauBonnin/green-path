/**
 * PixelArt — helpers de dessin pixel par pixel sur canvas 2D.
 * Tout le visuel de la Phase 1 (carte, personnage, icônes) est généré ici,
 * sans charger de fichier image (compatible file://).
 */
GP.PixelArt = {
  C: GP.PAL,

  canvas: function (w, h) {
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { cv: cv, ctx: ctx };
  },

  /**
   * Enregistre un canvas comme texture Phaser.
   * Si la texture existe déjà avec la même taille, on REDESSINE dedans (sans la supprimer) : supprimer une texture
   * qu'un sprite affiche encore (ou dont une animation tourne) fait planter le rendu (écran noir, ex. après RÉINITIALISER).
   */
  toTexture: function (scene, key, cv) {
    var ex = scene.textures.exists(key) ? scene.textures.get(key) : null;
    if (ex && ex.getCanvas && ex.getSourceImage().width === cv.width && ex.getSourceImage().height === cv.height) {
      var c = ex.getCanvas(), ctx = c.getContext('2d');
      ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(cv, 0, 0);
      ex.refresh();
      return;
    }
    if (ex) scene.textures.remove(key);
    scene.textures.addCanvas(key, cv);
  },

  /** Couleur : clé de palette (« g ») ou valeur CSS. */
  col: function (c) { return GP.PAL[c] || c; },

  rect: function (ctx, x, y, w, h, c) {
    ctx.fillStyle = this.col(c);
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  },

  disc: function (ctx, cx, cy, r, c) {
    ctx.fillStyle = this.col(c);
    for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++)
      if (x * x + y * y <= r * r + r * 0.6) ctx.fillRect(cx + x, cy + y, 1, 1);
  },

  /** Contour d'ellipse pixel. */
  ellipse: function (ctx, cx, cy, rx, ry, c) {
    ctx.fillStyle = this.col(c);
    for (var a = 0; a < 6.283; a += 0.12)
      ctx.fillRect(Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), 1, 1);
  },

  /** Sprite depuis un tableau de chaînes (« . » = transparent). */
  sprite: function (scene, key, rows) {
    var w = rows[0].length, h = rows.length, o = this.canvas(w, h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var ch = rows[y][x];
      if (ch !== '.' && GP.PAL[ch]) { o.ctx.fillStyle = GP.PAL[ch]; o.ctx.fillRect(x, y, 1, 1); }
    }
    this.toTexture(scene, key, o.cv);
  },

  /** Générateur pseudo-aléatoire déterministe (mulberry32). */
  rng: function (seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
};
