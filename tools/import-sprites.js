/**
 * import-sprites.js — convertit les planches de sprites exportées (Claude Design, format JSON)
 * en scripts chargeables en file:// par le jeu. Aucune dépendance.
 *
 * Usage : node tools/import-sprites.js <dossier export/> [<dossier des Planche *.dc.html>]
 *   Entrée : export/<planche>.json = { sheet, sprites: [{ id, w, h, anchor, tile_x, frames, rows | frames_rows }] }
 *            (chaque pixel = une lettre de la palette PAL des planches, « . » = transparent)
 *   Sortie : js/data/sprites/<planche>.js  →  GP.SPRITES['<planche>'] = [...]
 *            js/data/sprites/palette.js    →  GP.SPRITE_PAL = { lettre: '#rrggbb', ... }
 * Vérifie : palette identique sur toutes les planches, aucune lettre inconnue, tailles des lignes, ids uniques.
 */
var fs = require('fs'), path = require('path');
var input = require('./lib/sprite-input');
var src = process.argv[2] || path.join(process.env.HOME, 'Downloads/sprites/export');
var htmlDir = process.argv[3] || path.dirname(src);
var out = path.join(__dirname, '..', 'js', 'data', 'sprites');
fs.mkdirSync(out, { recursive: true });

// 1. Palette : lue dans les planches HTML (table PAL), doit être la même partout
var pal = null;
fs.readdirSync(htmlDir).filter(function (f) { return /^Planche .*\.dc\.html$/.test(f); }).forEach(function (f) {
  var p = input.palette(fs.readFileSync(path.join(htmlDir, f), 'utf8'));
  if (!p) return;
  if (pal && JSON.stringify(p) !== JSON.stringify(pal)) throw new Error('Palette différente dans ' + f);
  pal = p;
});
if (!pal) throw new Error('Palette PAL introuvable dans ' + htmlDir);

// 2. Planches
var ids = Object.create(null), total = 0, outputs = [];
fs.readdirSync(src).filter(function (f) { return /\.json$/.test(f); }).sort().forEach(function (f) {
  var j = JSON.parse(fs.readFileSync(path.join(src, f), 'utf8')), sheet = j.sheet || path.basename(f, '.json');
  j.sheet = sheet; input.sheet(j);
  j.sprites.forEach(function (s) {
    if (ids[s.id]) throw new Error('id en double : ' + s.id);
    ids[s.id] = sheet;
    var frames = s.frames_rows || [s.rows];
    if (frames.length !== (s.frames || 1)) throw new Error(s.id + ' : nombre d\'images incohérent');
    frames.forEach(function (rows) {
      if (rows.length !== s.h) throw new Error(s.id + ' : ' + rows.length + ' lignes au lieu de ' + s.h);
      rows.forEach(function (r) {
        if (r.length !== s.w) throw new Error(s.id + ' : ligne de ' + r.length + ' au lieu de ' + s.w);
        for (var i = 0; i < r.length; i++) if (r[i] !== '.' && !pal[r[i]]) throw new Error(s.id + ' : lettre inconnue « ' + r[i] + ' »');
      });
    });
    total++;
  });
  var js = '/* Planche « ' + sheet + ' » — sprites générés avec Claude Design, importés par tools/import-sprites.js. Ne pas modifier à la main. */\n' +
    'window.GP = window.GP || {};\nGP.SPRITES = GP.SPRITES || {};\nGP.SPRITES[' + JSON.stringify(sheet) + '] = ' + JSON.stringify(j.sprites) + ';\n';
  outputs.push({ sheet: sheet, js: js });
  console.log('  ' + sheet + ' : ' + j.sprites.length + ' sprites');
});
outputs.forEach(function (o) { fs.writeFileSync(path.join(out, o.sheet + '.js'), o.js); });
fs.writeFileSync(path.join(out, 'palette.js'),
  '/* Palette commune des planches de sprites (40 couleurs, « . » = transparent). */\nwindow.GP = window.GP || {};\nGP.SPRITE_PAL = ' + JSON.stringify(pal, null, 0) + ';\n');
console.log(total + ' sprites, palette de ' + Object.keys(pal).length + ' couleurs → ' + out);
