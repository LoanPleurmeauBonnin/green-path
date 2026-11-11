/** Terminaisons ciblées de modules ouverts utilisés seuls. Les matrices importées restent intactes. */
GP.MapDecor = {
  finishRows: function (sprite) {
    var rows = sprite.rows.map(function (r) { return r.split(''); });
    if (sprite.id === 'carte_haie') {
      var insets = [9, 7, 4, 2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 4], out = [];
      for (var y = 0; y < sprite.h; y++) {
        var row = [], inset = insets[y];
        for (var x = 0; x < sprite.w + 8; x++) {
          var sx = Math.max(0, Math.min(sprite.w - 1, x - 4));
          var c = rows[y][sx];
          if (x < inset || x >= sprite.w + 8 - inset) c = '.';
          else if (x === inset || x === sprite.w + 7 - inset) c = y === sprite.h - 1 ? 'h' : 'k';
          else if (x < 4 || x >= sprite.w + 4) c = y < 5 ? 'g' : (y > 11 ? 'h' : 'G');
          row.push(c);
        }
        out.push(row.join(''));
      }
      return out;
    }
    if (sprite.id === 'carte_barriere_bois') {
      for (var r = 0; r < sprite.h; r++) [0, sprite.w - 4].forEach(function (x) {
        var post = r === 0 || r === sprite.h - 1 ? 'kkkk' : 'kYWk';
        for (var i = 0; i < 4; i++) rows[r][x + i] = post[i];
      });
    }
    return rows.map(function (r) { return r.join(''); });
  },
  key: function (scene, original) {
    if (original !== 'carte_haie' && original !== 'carte_barriere_bois') return original;
    var key = original + '_terminee';
    if (!scene.textures.exists(key)) {
      var sprite = GP.SPRITES.carte.filter(function (s) { return s.id === original; })[0];
      var rows = this.finishRows(sprite), o = GP.PixelArt.canvas(rows[0].length, rows.length);
      rows.forEach(function (row, y) { Array.from(row).forEach(function (ch, x) {
        if (ch !== '.') { o.ctx.fillStyle = GP.SPRITE_PAL[ch]; o.ctx.fillRect(x, y, 1, 1); }
      }); });
      GP.PixelArt.toTexture(scene, key, o.cv);
    }
    return key;
  }
};
