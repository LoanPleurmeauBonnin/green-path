/**
 * Sprites (GP.Sprites) — transforme les planches importées (GP.SPRITES, lettres de GP.SPRITE_PAL) en textures Phaser.
 *
 * Pour chaque sprite : une texture <id> (première image) ; s'il a plusieurs images, <id>_0, <id>_1… et une
 * animation « <id> » qui les enchaîne. Les monuments (*_monument_*) ont aussi une version grise <id>_gris.
 *   GP.Sprites.build(scene)                     au démarrage (BootScene)
 *   GP.Sprites.info(id)                         { w, h, anchor, tile_x, frames } ou null
 *   GP.Sprites.add(scene, x, y, id)             image placée selon son ancre (top-left, bottom-center, center)
 *   GP.Sprites.has(id)
 * Les sprites viennent de Claude Design (voir CREDITS.md, déclaration d'usage de l'IA).
 */
GP.Sprites = (function () {
  var INFO = {}, rgb = {};

  function color(ch) {
    if (!rgb[ch]) { var n = parseInt(GP.SPRITE_PAL[ch].slice(1), 16); rgb[ch] = [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    return rgb[ch];
  }

  /** Dessine une image (tableau de lignes de lettres) dans un canvas ; grey = luminance (monument « en mémoire »). */
  function canvasOf(s, rows, grey) {
    var o = GP.PixelArt.canvas(s.w, s.h), img = o.ctx.createImageData(s.w, s.h), d = img.data;
    for (var y = 0; y < s.h; y++) {
      var r = rows[y];
      for (var x = 0; x < s.w; x++) {
        var ch = r.charAt(x);
        if (ch === '.' || !GP.SPRITE_PAL[ch]) continue;
        var c = color(ch), i = (y * s.w + x) * 4;
        if (grey) { var v = Math.round((0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]) * 0.8 + 38); d[i] = d[i + 1] = d[i + 2] = v; }
        else { d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; }
        d[i + 3] = 255;
      }
    }
    o.ctx.putImageData(img, 0, 0);
    return o.cv;
  }

  function build(scene) {
    if (!GP.SPRITES || !GP.SPRITE_PAL) return;
    Object.keys(GP.SPRITES).forEach(function (sheet) {
      GP.SPRITES[sheet].forEach(function (s) {
        var frames = s.frames_rows || [s.rows];
        INFO[s.id] = { w: s.w, h: s.h, anchor: s.anchor, tile_x: !!s.tile_x, frames: frames.length, sheet: sheet };
        GP.PixelArt.toTexture(scene, s.id, canvasOf(s, frames[0]));
        if (/_monument_/.test(s.id)) GP.PixelArt.toTexture(scene, s.id + '_gris', canvasOf(s, frames[0], true));
        if (frames.length > 1) {
          frames.forEach(function (rows, f) { GP.PixelArt.toTexture(scene, s.id + '_' + f, canvasOf(s, rows)); });
          if (scene.anims.exists(s.id)) scene.anims.remove(s.id);
          scene.anims.create({
            key: s.id, repeat: -1, frameRate: frames.length >= 4 ? 8 : 3,
            frames: frames.map(function (r, f) { return { key: s.id + '_' + f }; })
          });
        }
      });
    });
  }

  var ORIGIN = { 'top-left': [0, 0], 'bottom-center': [0.5, 1], 'center': [0.5, 0.5] };

  return {
    build: build,
    has: function (id) { return !!INFO[id]; },
    info: function (id) { return INFO[id] || null; },
    origin: function (id) { return ORIGIN[(INFO[id] || {}).anchor] || [0, 0]; },
    /** Image (ou sprite animé si plusieurs images) placée selon l'ancre du sprite. */
    add: function (scene, x, y, id) {
      var inf = INFO[id], o = ORIGIN[inf ? inf.anchor : 'top-left'] || [0, 0];
      var obj = inf && inf.frames > 1 ? scene.add.sprite(x, y, id + '_0').play(id) : scene.add.image(x, y, id);
      return obj.setOrigin(o[0], o[1]);
    }
  };
})();
