/**
 * PixelCollection — l'image à reconstruire pendant un niveau.
 *
 * Source : la photo pixélisée du lieu (GP.IMAGES[id], 48×32, 16 couleurs, voir tools/pixelize.swift et CREDITS.md) ;
 * à défaut, le monument de la planche de sprites (48×44), ou le dessin par code (lm_<id>, 32×28).
 * Les cases de l'image sont triées dans l'ordre de la grammaire du lieu,
 * puis répartis en autant de groupes que de pixels à ramasser dans le niveau. Chaque pixel ramassé révèle
 * le groupe suivant ; les cases encore cachées restent en silhouette sombre.
 *
 *   var pc = new GP.PixelCollection(scene, 'jardin-des-plantes', 32, 'bottomUp');
 *   pc.key        clé de la texture d'aperçu (à afficher dans le HUD)
 *   pc.reveal()   révèle le groupe suivant, renvoie sa couleur moyenne (pour l'étincelle)
 *   pc.rate()     taux de reconstruction 0..1
 */
GP.PixelCollection = function (scene, locId, total, order) {
  var cells = GP.PixelCollection.cells(scene, locId), w = cells.w, h = cells.h;

  GP.PixelCollection.sortCells(cells, order);

  this.total = Math.max(1, total);
  this.count = 0;
  this.groups = [];
  for (var g = 0; g < this.total; g++) {
    var from = Math.floor(g * cells.length / this.total), to = Math.floor((g + 1) * cells.length / this.total);
    this.groups.push(cells.slice(from, to));
  }
  this.cells = cells;
  this.key = 'pc_view';
  if (scene.textures.exists(this.key)) scene.textures.remove(this.key);
  this.tex = scene.textures.createCanvas(this.key, w, h);
  this.draw();
};

/** Ordres géométriques déterministes ; les régions du Château sont une interprétation stylisée, pas un relevé. */
GP.PixelCollection.sortCells = function (cells, order) {
  var w = cells.w, h = cells.h;
  function phase(c) {
    if (c.y >= h * 0.6) return 0;    // assise et masse basse
    if (c.x >= w * 0.28 && c.x < w * 0.72) return 1;   // courtine centrale
    return 2;                     // élévation latérale des tours
  }
  var ORDERS = {
    // croissance : du bas vers le haut ; dans une ligne, du centre vers les bords
    bottomUp: function (a, b) { return (b.y - a.y) || (Math.abs(a.x - w / 2) - Math.abs(b.x - w / 2)); },
    topDown: function (a, b) { return (a.y - b.y) || (a.x - b.x); },
    leftRight: function (a, b) { return (a.x - b.x) || (b.y - a.y); },
    fortification: function (a, b) { return phase(a) - phase(b) || (b.y - a.y) || (a.x - b.x); }
  };
  cells.sort(ORDERS[order] || ORDERS.bottomUp);
  return cells;
};

/** Cases colorées de l'image du lieu : photo pixélisée si elle existe, sinon le monument dessiné. */
GP.PixelCollection.cells = function (scene, locId) {
  var cells = [], im = GP.IMAGES && GP.IMAGES[locId], x, y;
  if (im) {
    for (y = 0; y < im.h; y++) for (x = 0; x < im.w; x++) {
      var hex = im.palette[parseInt(im.data.charAt(y * im.w + x), 16)], n = parseInt(hex.slice(1), 16);
      cells.push({ x: x, y: y, r: n >> 16 & 255, g: n >> 8 & 255, b: n & 255 });
    }
    cells.w = im.w; cells.h = im.h;
    return cells;
  }
  var src = scene.textures.get(GP.PixelCollection.fallbackKey(locId)).getSourceImage(), tmp = GP.PixelArt.canvas(src.width, src.height);
  tmp.ctx.drawImage(src, 0, 0);
  var data = tmp.ctx.getImageData(0, 0, src.width, src.height).data;
  for (y = 0; y < src.height; y++) for (x = 0; x < src.width; x++) {
    var i = (y * src.width + x) * 4;
    if (data[i + 3] > 0) cells.push({ x: x, y: y, r: data[i], g: data[i + 1], b: data[i + 2] });
  }
  cells.w = src.width; cells.h = src.height;
  return cells;
};

/** Image de secours tant qu'aucune photo n'est validée : le monument de la planche (48×44), sinon le dessin par code. */
GP.PixelCollection.fallbackKey = function (locId) {
  var loc = GP.LOCATIONS.filter(function (l) { return l.id === locId; })[0];
  return loc ? GP.MapArt.monument(loc, false) : 'lm_' + locId;
};

/** Clé d'une texture de l'image complète du lieu (photo pixélisée, ou monument dessiné à défaut). */
GP.PixelCollection.photoKey = function (scene, locId) {
  var im = GP.IMAGES && GP.IMAGES[locId];
  if (!im) return GP.PixelCollection.fallbackKey(locId);
  var key = 'photo_' + locId;
  if (!scene.textures.exists(key)) {
    var o = GP.PixelArt.canvas(im.w, im.h);
    GP.PixelCollection.cells(scene, locId).forEach(function (c) { o.ctx.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')'; o.ctx.fillRect(c.x, c.y, 1, 1); });
    scene.textures.addCanvas(key, o.cv);
  }
  return key;
};

GP.PixelCollection.prototype.draw = function () {
  var ctx = this.tex.getContext();
  ctx.clearRect(0, 0, this.tex.width, this.tex.height);
  // cases cachées : gris très sombre tiré de la luminance (l'image « en mémoire » reste devinable)
  this.cells.forEach(function (c) {
    var v = Math.round((0.3 * c.r + 0.59 * c.g + 0.11 * c.b) * 0.22 + 28);
    ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + (v + 14) + ')'; ctx.fillRect(c.x, c.y, 1, 1);
  });
  for (var g = 0; g < this.count; g++) this.groups[g].forEach(function (c) {
    ctx.fillStyle = 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')'; ctx.fillRect(c.x, c.y, 1, 1);
  });
  this.tex.refresh();
};

/** Révèle le groupe suivant ; renvoie sa couleur moyenne (entier Phaser). */
GP.PixelCollection.prototype.reveal = function () {
  if (this.count >= this.total) return 0xf4d35e;
  var grp = this.groups[this.count++], r = 0, g = 0, b = 0;
  grp.forEach(function (c) { r += c.r; g += c.g; b += c.b; });
  this.draw();
  var n = grp.length || 1;
  return grp.length ? Phaser.Display.Color.GetColor(Math.round(r / n), Math.round(g / n), Math.round(b / n)) : 0xf4d35e;
};

GP.PixelCollection.prototype.rate = function () { return this.count / this.total; };
GP.PixelCollection.prototype.done = function () { return this.count >= this.total; };
