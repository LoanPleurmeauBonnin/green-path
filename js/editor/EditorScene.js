/**
 * EditorScene — la vue du niveau dans l'éditeur (editor.html) : le niveau dessiné par le vrai moteur de rendu (GP.GZoneArt),
 * les objets (dangers, ennemis, pixels, lanternes, panneaux…) posés par-dessus, la sélection, le déplacement à la souris,
 * le zoom et le déplacement de la vue. Les panneaux HTML (EditorUI.js) pilotent l'état partagé GP.Ed.
 * Tout objet du document est une « entité » { sel: { list, i }, rect } : sel désigne l'objet, rect sa zone en pixels du monde.
 */
GP.EdGeom = (function () {
  var T = 16;
  function info(id) { return (GP.Sprites && GP.Sprites.info && GP.Sprites.info(id)) || null; }
  function size(id) { var i = info(id); return i ? { w: i.w, h: i.h } : { w: T, h: T }; }

  /** Zone en pixels d'un objet d'une liste du document (x, y en tuiles ; les objets sont ancrés en bas à gauche de leur case). */
  function rect(list, o, d) {
    var s;
    switch (list) {
      case 'plateformes':
        if (o.type === 'masse') { var bottom = o.fill_to !== undefined ? o.fill_to : (o.to !== undefined ? o.to : d.hauteur); return { x: o.x * T, y: o.y * T, w: (o.w || 1) * T, h: Math.max(T, (bottom - o.y) * T) }; }
        if (o.type === 'rampe') { var top = Math.min(o.y0, o.y1); return { x: o.x0 * T, y: top * T, w: (o.x1 - o.x0) * T, h: Math.max(T, ((o.bottom || d.hauteur) - top) * T) }; }
        if (o.type === 'colonne') return { x: o.x * T, y: o.y_top * T, w: 2 * T, h: Math.max(T, (o.sol_y - o.y_top) * T) };
        if (o.type === 'galerie') return { x: o.x * T, y: o.y * T, w: (o.w || 2) * T, h: T };
        if (o.type) return { x: o.x * T, y: o.y * T, w: (o.w || 1) * T, h: 8 };
        s = size(o.sprite); return { x: o.x * T, y: (o.y + 1) * T - s.h, w: s.w, h: s.h };   // décor sans type
      case 'mobiles': s = size(o.sprite); return { x: o.x1 * T, y: o.y1 * T, w: Math.max((o.w || 2) * T, s.w), h: Math.max(8, s.h) };
      case 'ennemis': s = size(o.sprite); var ex = (o.x !== undefined ? o.x : o.x1) * T, ey = (o.y !== undefined ? o.y : o.y1) * T + T; return { x: ex, y: ey - s.h, w: s.w, h: s.h };
      case 'pixels': return { x: o.x * T, y: o.y * T, w: T, h: T };
      case 'anneaux': var cx = (o.cx !== undefined ? o.cx : o.x) * T, cy = (o.cy !== undefined ? o.cy : o.y) * T; return { x: cx - 16, y: cy - 16, w: 32, h: 32 };
      case 'courants': return { x: o.x * T, y: Math.min(o.y1, o.y2) * T, w: o.w * T, h: Math.max(T, Math.abs(o.y2 - o.y1) * T) };
      case 'eau': return { x: o.x * T, y: o.y * T, w: (o.w || 1) * T, h: Math.max(T, (d.hauteur - o.y) * T) };
      default: s = size(o.sprite || o.sprite_off); return { x: o.x * T, y: (o.y + 1) * T - s.h, w: (o.w ? Math.max(o.w * T, s.w) : s.w), h: s.h };   // décor, dangers, boosts, signes, lanternes
    }
  }

  /** Les entités d'un document, dans l'ordre d'empilement (les petits objets sont choisis en premier au clic). */
  function entities(d) {
    var out = [];
    ['plateformes', 'decor', 'dangers', 'ennemis', 'boosts', 'mobiles', 'anneaux', 'courants', 'eau', 'signes', 'checkpoints', 'pixels'].forEach(function (list) {
      (d[list] || []).forEach(function (o, i) { if (o && typeof o === 'object') out.push({ sel: { list: list, i: i }, rect: rect(list, o, d), obj: o }); });
    });
    if (d.spawn) out.push({ sel: { list: 'spawn' }, rect: { x: d.spawn.x * T, y: (d.spawn.y + 1) * T - 24, w: 16, h: 24 }, obj: d.spawn });
    if (d.arrivee && d.arrivee.declencheur) { var a = d.arrivee.declencheur; out.push({ sel: { list: 'arrivee' }, rect: { x: a.x * T, y: (a.y + 1) * T - 32, w: 32, h: 32 }, obj: a }); }
    return out;
  }

  /** L'objet désigné par une sélection. */
  function get(d, sel) {
    if (!sel) return null;
    if (sel.list === 'spawn') return d.spawn;
    if (sel.list === 'arrivee') return d.arrivee && d.arrivee.declencheur;
    return (d[sel.list] || [])[sel.i] || null;
  }

  var DX = ['x', 'x0', 'x1', 'x2', 'cx'], DY = ['y', 'y0', 'y1', 'y2', 'cy', 'y_top'];
  /** Copie de l'objet d'origine déplacée de (dx, dy) tuiles : on décale toutes les coordonnées connues (un ennemi garde sa course). */
  function moved(orig, dx, dy) {
    var o = JSON.parse(JSON.stringify(orig));
    DX.forEach(function (k) { if (typeof o[k] === 'number') o[k] = round(o[k] + dx); });
    DY.forEach(function (k) { if (typeof o[k] === 'number') o[k] = round(o[k] + dy); });
    ['top_y'].forEach(function (k) { if (o.cycle && typeof o.cycle[k] === 'number') o.cycle[k] = round(o.cycle[k] + dy); });
    return o;
  }
  function round(v) { return Math.round(v * 1000) / 1000; }

  /** Les listes dont les coordonnées doivent rester entières (cases du moteur). */
  var INTEGER = { plateformes: true, pixels: true, checkpoints: true };
  return { T: T, rect: rect, entities: entities, get: get, moved: moved, size: size, INTEGER: INTEGER, round: round };
})();

GP.Scenes.Editor = class EditorScene extends Phaser.Scene {
  constructor() { super('Editor'); }

  create() {
    var self = this, cam = this.cameras.main, G = GP.EdGeom;
    GP.Ed.scene = this;
    cam.setBackgroundColor('#8fc4ec');
    this.layerObjs = [];
    this.grid = this.add.graphics().setDepth(90);
    this.ov = this.add.graphics().setDepth(100);
    this.zoom = 2; cam.setZoom(2);
    this.ents = [];
    this.drag = null; this.pan = null;

    this.input.mouse.disableContextMenu();
    this.input.on('pointerdown', function (p) { self.down(p); });
    this.input.on('pointermove', function (p) { self.move(p); });
    this.input.on('pointerup', function (p) { self.up(p); });
    // molette et pavé tactile comme Figma : deux doigts ou molette = déplacer ; pincer (ou Ctrl/Cmd + molette) = zoomer vers le curseur
    this.input.on('wheel', function (p, o, dx, dy, dz, ev) {
      var e = ev || (p.event) || {}, cam = self.cameras.main;
      if (e.ctrlKey || e.metaKey) self.setZoom(self.zoom * Math.exp(-dy * 0.012), p);
      else { cam.setScroll(cam.scrollX + dx / cam.zoom, cam.scrollY + dy / cam.zoom); self.viewChanged(); }
    });
    this.events.on('postupdate', function () { var c = self.cameras.main; if (c.scrollX !== self.lsx || c.scrollY !== self.lsy) { self.lsx = c.scrollX; self.lsy = c.scrollY; self.viewChanged(); } });
    this.mini = document.getElementById('ed-mini'); this.initMini();
    this.scale.on('resize', function () { self.drawGrid(); });
    GP.Ed.sceneReady();
  }

  // ---------- Dessin du niveau ----------
  rebuild() {
    var d = GP.Ed.doc, self = this, G = GP.EdGeom;
    if (!d) return;
    this.layerObjs.forEach(function (o) { if (o && o.destroy) o.destroy(); });
    this.layerObjs = [];
    var before = new Set(this.children.list), L = null;
    try {
      var c = JSON.parse(JSON.stringify(d)); c.refonte = c.retouche = c.equilibre = true;
      L = GP.GZoneLevels.make(c, GP.Ed.id);
      GP.Ed.buildError = null;
    } catch (e) { GP.Ed.buildError = e.message; GP.Ed.refreshStatus(); this.ents = G.entities(d); this.drawGrid(); this.drawSel(); return; }
    var plan = GP.GZoneRuntime.plan(L);
    try { GP.GZoneArt.build(this, L, plan); } catch (e) { GP.Ed.buildError = 'Dessin : ' + e.message; }
    this.children.list.slice().forEach(function (o) { if (!before.has(o)) self.layerObjs.push(o); });
    this.overlay(d, plan);
    this.ents = G.entities(d);
    this.drawGrid(); this.drawSel(); this.drawMiniBase();
    GP.Ed.refreshStatus();
  }

  put(key, x, y, ox, oy, depth, alpha) {
    if (!key || !this.textures.exists(key)) return null;
    var im = this.add.image(Math.round(x), Math.round(y), key).setOrigin(ox, oy).setDepth(depth);
    if (alpha !== undefined) im.setAlpha(alpha);
    this.layerObjs.push(im); return im;
  }
  rect(x, y, w, h, color, alpha, depth) { var r = this.add.rectangle(x, y, w, h, color, alpha).setOrigin(0).setDepth(depth || 50); this.layerObjs.push(r); return r; }

  /** Ligne de tuiles g/m/d (ponts, bords) en une image, comme le fait le jeu. */
  rowImage(key, set, w) {
    var src = set.map(function (k) { return this.textures.exists(k) ? this.textures.get(k).getSourceImage() : null; }, this);
    var h = src[1] ? src[1].height : 8, o = GP.PixelArt.canvas(w * 16, h);
    for (var j = 0; j < w; j++) { var im = src[j === 0 ? 0 : (j === w - 1 ? 2 : 1)]; if (im) o.ctx.drawImage(im, j * 16, 0); }
    GP.PixelArt.toTexture(this, key, o.cv);
    return key;
  }

  /** Les objets que le moteur de rendu des volumes ne dessine pas : ponts, dangers, ennemis, pixels, lanternes, panneaux, départ, arrivée. */
  overlay(d, plan) {
    var self = this, T = 16, i;
    (plan.surfaces || []).forEach(function (s, n) {
      if (!Number.isFinite(s.y) || s.column || (s.visuals && s.visuals.length)) return;
      var w = Math.ceil(s.w || 1);
      if (s.sprite_set) self.put(self.rowImage('ed_surf_' + n, s.sprite_set, w), s.x * T, s.y * T, 0, 0, 9);
      else if (s.sprite && self.textures.exists(s.sprite)) {
        var im = self.textures.get(s.sprite).getSourceImage(), o = GP.PixelArt.canvas(w * T, im.height);
        for (var x = 0; x < w * T; x += im.width) o.ctx.drawImage(im, x, 0);
        GP.PixelArt.toTexture(self, 'ed_surf_' + n, o.cv); self.put('ed_surf_' + n, s.x * T, s.y * T, 0, 0, 9);
      } else self.rect(s.x * T, s.y * T, w * T, 5, 0xd2b484, 1, 9);
    });
    (d.dangers || []).forEach(function (h) {
      if (h.kind === 'eau_mortelle') { self.rect(h.x * T, h.y * T, (h.w || 1) * T, T, 0x3b6ea5, 0.85, 8); return; }
      var key = GP.GZoneArt.key(self, h.sprite);
      if (!self.put(key, h.x * T, (h.y + 1) * T, 0, 1, 8)) self.rect(h.x * T, h.y * T, (h.w || 1) * T, T, 0xb5523b, 0.8, 8);
    });
    (d.eau || []).forEach(function (w) { self.rect(w.x * T, w.y * T, w.w * T, (d.hauteur - w.y) * T, 0x3b6ea5, 0.7, 8); });
    (d.ennemis || []).forEach(function (e) {
      var x = (e.x !== undefined ? e.x : e.x1) * T, y = (e.y !== undefined ? e.y : e.y1) * T + T;
      if (!self.put(GP.GZoneArt.key(self, e.sprite), x, y, 0, 1, 10)) self.rect(x, y - 16, 16, 16, 0xe8873a, 0.8, 10);
      if (e.x2 !== undefined && e.x1 !== undefined) self.rect(e.x1 * T, y - 2, (e.x2 - e.x1) * T + 16, 2, 0xe8873a, 0.7, 10);
      if (e.y2 !== undefined && e.y1 !== undefined && e.type === 'patrouille_verticale') self.rect(x + 7, e.y1 * T + 16, 2, (e.y2 - e.y1) * T, 0xe8873a, 0.7, 10);
    });
    (d.boosts || []).forEach(function (b) { self.put(GP.GZoneArt.key(self, b.sprite), b.x * T, (b.y + 1) * T, 0, 1, 8); });
    (d.mobiles || []).forEach(function (m) {
      var w = Math.ceil(m.w || 2);
      if (m.sprite_set) self.put(self.rowImage('ed_mob_' + m.id, m.sprite_set, w), m.x1 * T, m.y1 * T, 0, 0, 9, 0.9);
      else self.rect(m.x1 * T, m.y1 * T, w * T, 6, 0x7fb3d5, 0.9, 9);
      if (m.x2 !== undefined) self.rect(Math.min(m.x1, m.x2) * T, m.y1 * T + 6, Math.abs(m.x2 - m.x1) * T + w * T, 1, 0x7fb3d5, 0.6, 9);
    });
    (d.anneaux || []).forEach(function (r) {
      var g = self.add.graphics().setDepth(32), x = (r.cx !== undefined ? r.cx : r.x) * T, y = (r.cy !== undefined ? r.cy : r.y) * T;
      g.lineStyle(2, r.couleur === 'bleu' ? 0x7fb3d5 : r.couleur === 'vert' ? 0x5cbf3f : 0xb5523b); g.strokeCircle(x, y, 16); self.layerObjs.push(g);
    });
    (d.courants || []).forEach(function (c) { self.rect(c.x * T, Math.min(c.y1, c.y2) * T, c.w * T, Math.abs(c.y2 - c.y1) * T, 0xf4d35e, 0.18, 8); });
    (d.signes || []).forEach(function (s) { self.put(self.textures.exists(s.sprite) ? s.sprite : (self.textures.exists('commun_panneau') ? 'commun_panneau' : null), s.x * T, (s.y + 1) * T, 0, 1, 7); });
    (d.checkpoints || []).forEach(function (c) { self.put(GP.GZoneArt.key(self, c.sprite_off || 'commun_lanterne_eteinte'), c.x * T, (c.y + 1) * T, 0, 1, 7); });
    (d.pixels || []).forEach(function (p) { self.put(GP.GZoneArt.key(self, p.sprite || 'commun_pixel'), p.x * T, p.y * T, 0, 0, 8); });
    if (d.spawn) { self.put('hero_idle', d.spawn.x * T + 8, (d.spawn.y + 1) * T, 0.5, 1, 20); }
    if (d.arrivee && d.arrivee.declencheur) { var a = d.arrivee.declencheur; self.put(GP.GZoneArt.key(self, 'signes_arche_arrivee'), a.x * T, (a.y + 1) * T, 0, 1, 7); }
  }

  drawGrid() {
    var d = GP.Ed.doc, g = this.grid, cam = this.cameras.main;
    g.clear();
    if (!d) return;
    var W = d.largeur * 16, H = d.hauteur * 16;
    if (GP.Ed.showGrid) {
      g.lineStyle(1 / cam.zoom, 0x14182e, 0.16);
      for (var x = 0; x <= d.largeur; x++) { g.lineBetween(x * 16, 0, x * 16, H); }
      for (var y = 0; y <= d.hauteur; y++) { g.lineBetween(0, y * 16, W, y * 16); }
      g.lineStyle(1 / cam.zoom, 0x14182e, 0.4);
      for (x = 0; x <= d.largeur; x += 10) g.lineBetween(x * 16, 0, x * 16, H);
    }
    g.lineStyle(2 / cam.zoom, 0xe8873a, 1); g.strokeRect(0, 0, W, H);
    if (d.sol_y !== undefined) { g.lineStyle(1 / cam.zoom, 0x2f8f45, 0.7); g.lineBetween(0, d.sol_y * 16, W, d.sol_y * 16); }
  }

  /** Cadres de la sélection (poignée de largeur si un seul objet), objet survolé, aperçu du bloc ou du motif, rectangle de sélection. */
  drawSel() {
    var g = this.ov, cam = this.cameras.main, G = GP.EdGeom, self = this, z = cam.zoom;
    g.clear();
    var d = GP.Ed.doc; if (!d) return;
    var sels = GP.Ed.sels(), single = sels.length === 1;
    this.ents.forEach(function (e) {
      if (!sels.some(function (x) { return x.list === e.sel.list && x.i === e.sel.i; })) return;
      var r = e.rect;
      g.lineStyle(2 / z, 0xf4d35e, 1); g.strokeRect(r.x, r.y, r.w, r.h);
      if (single && self.hasWidth(e.sel, e.obj)) { g.fillStyle(0xf4d35e, 1); g.fillRect(r.x + r.w - 3 / z, r.y + r.h / 2 - 5 / z, 6 / z, 10 / z); }
    });
    if (this.hover) { g.lineStyle(1 / z, 0xffffff, 0.8); g.strokeRect(this.hover.x, this.hover.y, this.hover.w, this.hover.h); }
    if (this.preview) { g.lineStyle(2 / z, 0x5cbf3f, 1); g.fillStyle(0x5cbf3f, 0.25); g.fillRect(this.preview.x, this.preview.y, this.preview.w, this.preview.h); g.strokeRect(this.preview.x, this.preview.y, this.preview.w, this.preview.h); }
    if (this.marquee) { var m = this.marquee; g.lineStyle(1 / z, 0x7fb3d5, 1); g.fillStyle(0x7fb3d5, 0.18); g.fillRect(m.x, m.y, m.w, m.h); g.strokeRect(m.x, m.y, m.w, m.h); }
  }

  hasWidth(sel, o) { return typeof o.w === 'number' || (sel.list === 'ennemis' && typeof o.x2 === 'number'); }

  // ---------- Vue ----------
  setZoom(z, p) {
    var cam = this.cameras.main;
    z = Math.max(0.15, Math.min(8, z));
    var wx = p ? p.worldX : cam.midPoint.x, wy = p ? p.worldY : cam.midPoint.y;
    cam.setZoom(z); this.zoom = z;
    if (p) cam.setScroll(wx - (p.x - cam.x - cam.width / 2) / z - cam.width / 2, wy - (p.y - cam.y - cam.height / 2) / z - cam.height / 2);
    else cam.centerOn(wx, wy);
    this.drawGrid(); this.drawSel(); this.viewChanged(); GP.Ed.refreshStatus(); GP.Ed.refreshZoom();
  }
  zoomBy(f) { this.setZoom(this.zoom * f); }
  centerOn(tx, ty) { this.cameras.main.centerOn(tx * 16, ty * 16); this.viewChanged(); }
  fit() {
    var d = GP.Ed.doc, cam = this.cameras.main; if (!d) return;
    var z = Math.min(cam.width / (d.largeur * 16 + 32), cam.height / (d.hauteur * 16 + 32));
    this.setZoom(Math.max(0.15, z)); cam.centerOn(d.largeur * 8, d.hauteur * 8); this.viewChanged();
  }
  /** Cadre des rectangles donnés (en pixels du monde) dans la vue. */
  zoomToRects(rects) {
    var cam = this.cameras.main, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rects.forEach(function (r) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); });
    var z = Math.min(4, Math.max(0.5, Math.min(cam.width / ((x1 - x0) + 160), cam.height / ((y1 - y0) + 160))));
    this.setZoom(z); cam.centerOn((x0 + x1) / 2, (y0 + y1) / 2); this.viewChanged();
  }
  // mini-carte : le niveau en petit, le cadre de la vue, clic ou glisser pour s'y rendre
  initMini() {
    var self = this, m = this.mini; if (!m) return;
    var go = function (ev) { var r = m.getBoundingClientRect(), d = GP.Ed.doc; if (!d) return; self.cameras.main.centerOn((ev.clientX - r.left) / r.width * d.largeur * 16, (ev.clientY - r.top) / r.height * d.hauteur * 16); self.viewChanged(); };
    var down = false;
    m.onpointerdown = function (ev) { down = true; m.setPointerCapture(ev.pointerId); go(ev); };
    m.onpointermove = function (ev) { if (down) go(ev); };
    m.onpointerup = function () { down = false; };
  }
  drawMiniBase() {
    var d = GP.Ed.doc, m = this.mini; if (!d || !m) return;
    var w = 220, h = Math.max(30, Math.min(90, Math.round(220 * d.hauteur / d.largeur)));
    m.width = w; m.height = h; this.miniBase = GP.EdThumb.draw(d, { w: w, h: h });
    this.viewChanged();
  }
  viewChanged() {
    var m = this.mini, d = GP.Ed.doc, cam = this.cameras.main; if (!m || !d || !this.miniBase) return;
    var c = m.getContext('2d'); c.clearRect(0, 0, m.width, m.height); c.drawImage(this.miniBase, 0, 0);
    var sx = m.width / (d.largeur * 16), sy = m.height / (d.hauteur * 16), vw = cam.width / cam.zoom, vh = cam.height / cam.zoom;
    c.strokeStyle = '#f4d35e'; c.lineWidth = 1.5; c.fillStyle = 'rgba(244,211,94,0.12)';
    c.fillRect(cam.scrollX + cam.width / 2 - vw / 2 > 0 ? (cam.scrollX + cam.width / 2 - vw / 2) * sx : 0, 0, 0, 0);
    var rx = (cam.scrollX + cam.width / 2 - vw / 2) * sx, ry = (cam.scrollY + cam.height / 2 - vh / 2) * sy;
    c.fillRect(rx, ry, vw * sx, vh * sy); c.strokeRect(rx, ry, vw * sx, vh * sy);
  }

  // ---------- Souris ----------
  snap(v, list) {
    var st = GP.Ed.snap;
    if (GP.EdGeom.INTEGER[list]) return Math.round(v);
    return st ? Math.round(v / st) * st : Math.round(v * 16) / 16;
  }
  /** L'entité sous le point : la plus petite zone, hors calques masqués ou verrouillés. */
  pick(wx, wy) {
    var best = null, ba = Infinity;
    this.ents.forEach(function (e) {
      if (!GP.Ed.layerOn(e.sel.list) || GP.Ed.locked(e.sel.list)) return;
      var r = e.rect;
      if (wx >= r.x - 2 && wx <= r.x + r.w + 2 && wy >= r.y - 2 && wy <= r.y + r.h + 2) { var a = r.w * r.h; if (a <= ba) { ba = a; best = e; } }
    });
    return best;
  }
  onHandle(p) {
    var sels = GP.Ed.sels(); if (sels.length !== 1) return false;
    var o = GP.EdGeom.get(GP.Ed.doc, sels[0]); if (!o || !this.hasWidth(sels[0], o)) return false;
    var e = this.ents.filter(function (en) { return en.obj === o; })[0]; if (!e) return false;
    var r = e.rect, z = this.cameras.main.zoom;
    return Math.abs(p.worldX - (r.x + r.w)) < 8 / z && Math.abs(p.worldY - (r.y + r.h / 2)) < 10 / z;
  }

  down(p) {
    var G = GP.EdGeom, tool = GP.Ed.tool, cam = this.cameras.main, tx = p.worldX / 16, ty = p.worldY / 16, shift = p.event && (p.event.shiftKey || p.event.metaKey);
    this.hover = null;
    if (p.rightButtonDown() || p.middleButtonDown() || GP.Ed.space || tool === 'pan') { this.pan = { x: p.x, y: p.y, sx: cam.scrollX, sy: cam.scrollY }; return; }
    if (tool === 'select') {
      if (this.onHandle(p)) {
        var s0 = GP.Ed.sels()[0], o = G.get(GP.Ed.doc, s0);
        this.drag = { mode: 'resize', sel: s0, obj: o, orig: JSON.parse(JSON.stringify(o)), x0: tx, y0: ty, moved: false };
        return;
      }
      var hit = this.pick(p.worldX, p.worldY);
      if (hit) {
        var already = GP.Ed.isSelected(hit.sel.list, hit.sel.i);
        if (shift) GP.Ed.select(hit.sel, true); else if (!already) GP.Ed.select(hit.sel);
        var group = GP.Ed.sels().map(function (x) { var ob = G.get(GP.Ed.doc, x); return ob ? { sel: x, obj: ob, orig: JSON.parse(JSON.stringify(ob)) } : null; }).filter(Boolean);
        if (!shift || already) this.drag = { mode: 'move', group: group, x0: tx, y0: ty, moved: false };
      } else {
        // rectangle de sélection (Maj : on ajoute à la sélection)
        if (!shift) GP.Ed.select(null);
        this.drag = { mode: 'marquee', x0: p.worldX, y0: p.worldY, add: shift, base: GP.Ed.sels() };
        this.marquee = { x: p.worldX, y: p.worldY, w: 0, h: 0 }; this.drawSel();
      }
    } else if (tool === 'erase') {
      var h = this.pick(p.worldX, p.worldY);
      if (h) { GP.Ed.select(h.sel); GP.Ed.removeSel(); }
    } else if (tool === 'place') {
      GP.Ed.placeAt(Math.floor(tx), Math.floor(ty), tx, ty);
    } else if (tool === 'stamp') {
      GP.Ed.stampAt(Math.floor(tx), Math.floor(ty));
    } else if (tool === 'block') {
      this.drag = { mode: 'block', x0: Math.floor(tx), y0: Math.floor(ty), moved: true };
      this.preview = { x: this.drag.x0 * 16, y: this.drag.y0 * 16, w: 16, h: (GP.Ed.doc.hauteur - this.drag.y0) * 16 }; this.drawSel();
    }
  }

  move(p) {
    var G = GP.EdGeom, cam = this.cameras.main, tx = p.worldX / 16, ty = p.worldY / 16;
    GP.Ed.cursor = { x: tx, y: ty }; GP.Ed.refreshStatus();
    if (this.pan) { cam.setScroll(this.pan.sx - (p.x - this.pan.x) / cam.zoom, this.pan.sy - (p.y - this.pan.y) / cam.zoom); this.viewChanged(); return; }
    if (this.drag) {
      var dr = this.drag;
      if (dr.mode === 'move') {
        var lead = dr.group[0], dx = this.snap(tx - dr.x0, lead.sel.list), dy = this.snap(ty - dr.y0, lead.sel.list);
        if (!dr.moved && !dx && !dy) return;
        dr.moved = true;
        dr.group.forEach(function (it) {
          var ddx = G.INTEGER[it.sel.list] ? Math.round(dx) : dx, ddy = G.INTEGER[it.sel.list] ? Math.round(dy) : dy;
          Object.keys(it.obj).forEach(function (k) { delete it.obj[k]; }); Object.assign(it.obj, G.moved(it.orig, ddx, ddy));
        });
        this.lazyRebuild();
      } else if (dr.mode === 'resize') {
        var dw = this.snap(tx - dr.x0, dr.sel.list);
        dr.moved = true;
        if (typeof dr.orig.w === 'number') dr.obj.w = Math.max(G.INTEGER[dr.sel.list] ? 1 : 0.25, G.round(dr.orig.w + dw));
        else if (typeof dr.orig.x2 === 'number') dr.obj.x2 = G.round(Math.max(dr.orig.x1, dr.orig.x2 + dw));
        this.lazyRebuild();
      } else if (dr.mode === 'block') {
        var w = Math.max(1, Math.floor(tx) - dr.x0 + 1), x = dr.x0;
        if (Math.floor(tx) < dr.x0) { x = Math.floor(tx); w = dr.x0 - x + 1; }
        this.preview = { x: x * 16, y: dr.y0 * 16, w: w * 16, h: (GP.Ed.doc.hauteur - dr.y0) * 16 }; dr.x = x; dr.w = w; this.drawSel();
      } else if (dr.mode === 'marquee') {
        this.marquee = { x: Math.min(dr.x0, p.worldX), y: Math.min(dr.y0, p.worldY), w: Math.abs(p.worldX - dr.x0), h: Math.abs(p.worldY - dr.y0) }; this.drawSel();
      }
      return;
    }
    var tool = GP.Ed.tool, h = tool === 'select' || tool === 'erase' ? this.pick(p.worldX, p.worldY) : null;
    var nh = h ? h.rect : null;
    if ((nh && !this.hover) || (!nh && this.hover) || (nh && this.hover && (nh.x !== this.hover.x || nh.y !== this.hover.y))) { this.hover = nh; this.drawSel(); }
  }

  up() {
    this.pan = null;
    var dr = this.drag; this.drag = null; this.preview = null; var mq = this.marquee; this.marquee = null;
    if (!dr) { this.drawSel(); return; }
    if (dr.mode === 'block') { GP.Ed.addBlock(dr.x !== undefined ? dr.x : dr.x0, dr.y0, dr.w || 1); }
    else if (dr.mode === 'marquee') {
      if (mq && (mq.w > 3 || mq.h > 3)) {
        var found = [];
        this.ents.forEach(function (e) {
          if (!GP.Ed.layerOn(e.sel.list) || GP.Ed.locked(e.sel.list)) return;
          var r = e.rect; if (r.x < mq.x + mq.w && r.x + r.w > mq.x && r.y < mq.y + mq.h && r.y + r.h > mq.y) found.push(e.sel);
        });
        var base = dr.add ? dr.base : [];
        found.forEach(function (f) { if (!base.some(function (b) { return b.list === f.list && b.i === f.i; })) base = base.concat([f]); });
        GP.Ed.setSelection(base);
      } else this.drawSel();
    }
    else if (dr.moved) { this.rebuild(); GP.Ed.commit(dr.mode === 'resize' ? 'Redimensionner' : (dr.group && dr.group.length > 1 ? 'Déplacer ' + dr.group.length + ' objets' : 'Déplacer')); }
    this.drawSel();
  }

  /** Reconstruction différée pendant un glisser (au plus une fois toutes les 70 ms). */
  lazyRebuild() {
    var self = this, now = Date.now();
    if (this.lastBuild && now - this.lastBuild < 70) { if (!this.pendingBuild) this.pendingBuild = setTimeout(function () { self.pendingBuild = null; self.lastBuild = Date.now(); self.rebuild(); }, 70); return; }
    this.lastBuild = now; this.rebuild();
  }
};
