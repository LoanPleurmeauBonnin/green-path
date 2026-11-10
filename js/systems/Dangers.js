/**
 * Dangers (GP.Dangers) — mécaniques et ennemis des niveaux 4 à 12 (Feydeau, Graslin, Machines, Chantiers, Buren, Hangar,
 * Mémorial, Pommeraye, Tour LU) et esprits de la garde du Château. Un seul fichier, créé par GameScene.makeMechanics() à partir de la définition du niveau
 * (briques de js/data/levels.js : L.patrol, L.tide, L.boat, L.liar, L.faller, L.jet, L.beam, L.spring, L.seq, L.belt,
 * L.cart, L.ring + L.align, L.borne + L.cplat, L.pond, L.rot, L.muse, L.mold, L.glass, L.memo, L.draft).
 *
 *   update(dt)          fait vivre tout ce qui bouge (appelé à chaque image)
 *   input(c)            touches de la dernière image (pour la séquence de danse de Graslin)
 *   check(hit)          renvoie le message de mort si le joueur touche un danger, sinon null
 *
 * Météo : chaque niveau peut déclarer L.wxm = { rain: {...}, sun: {...}, wind: {...} } ; f('nom') multiplie, a('nom') ajoute.
 * Tout est annoncé à l'écran, jamais caché : un danger a toujours un signe avant d'agir (ombre, souffle, tremblement).
 */
GP.Dangers = function (scene) {
  var L = scene.L, S = GP.Sprites, self = this, H = scene.H;
  this.s = scene; this.t = 0;
  function has(k) { return scene.textures.exists(k); }

  // ---------- Ennemis : esprits (patrouille) et robots (poursuite) ----------
  this.patrols = (L.patrols || []).map(function (p) {
    var key = { esprit: 'lv_esprit', robot: 'lv_robot' }[p.kind] || 'lv_esprit';
    var feet = (p.y + 1) * 16, img = scene.add.image(p.x0 * 16 + 8, feet, key).setOrigin(0.5, 1).setDepth(9);
    if (p.kind === 'esprit') img.setAlpha(0.85);
    return { img: img, x0: p.x0 * 16 + 8, x1: p.x1 * 16 + 8, feet: feet, kind: p.kind, speed: p.speed || 30, dir: 1, pause: 0, home: p.x0 * 16 + 8, bob: p.x0 * 97 };
  });

  // ---------- Eau qui monte (marée) et mares décoratives ----------
  this.tides = (L.tides || []).map(function (t) {
    var w = (t.x1 - t.x0) * 16;
    var body = scene.add.rectangle(t.x0 * 16, t.low * 16, w, 300, 0x3b6ea5, 0.5).setOrigin(0, 0).setDepth(25);
    var line = scene.add.rectangle(t.x0 * 16, t.low * 16, w, 2, 0xa6d4f2, 0.95).setOrigin(0, 0).setDepth(25);
    return { def: t, body: body, line: line, y: t.low * 16 };
  });
  (L.ponds || []).forEach(function (p) {
    scene.add.rectangle(p.x0 * 16, p.row * 16, (p.x1 - p.x0) * 16, 300, 0x3b6ea5, 0.45).setOrigin(0, 0).setDepth(25);
    scene.add.rectangle(p.x0 * 16, p.row * 16, (p.x1 - p.x0) * 16, 2, 0xa6d4f2, 0.9).setOrigin(0, 0).setDepth(25);
  });

  // ---------- Bateaux qui s'enfoncent sous le poids du joueur ----------
  this.boats = (L.boats || []).map(function (b) {
    var plat = scene.add.image(b.x * 16, b.y * 16, 'lv_tileset').setOrigin(0, 0).setDisplaySize(b.w * 16, 8).setVisible(false);
    scene.platformBody(plat, true);
    var spr = has('petit_bateau_0') ? scene.add.sprite(b.x * 16 + b.w * 8, b.y * 16 - 6, 'petit_bateau_0').setOrigin(0.5, 0).setDepth(9) : scene.add.image(b.x * 16, b.y * 16, 'lv_rock').setOrigin(0, 0).setDepth(9);
    if (spr.play && scene.anims.exists('petit_bateau')) spr.play('petit_bateau');
    return { plat: plat, spr: spr, y0: b.y * 16, w: b.w * 16, x: b.x * 16, sink: 0 };
  });

  // ---------- Visages sculptés qui mentent (faux indices) et brouillent les pixels proches ----------
  this.liars = (L.liars || []).map(function (l) {
    var img = has('feydeau_mascaron') ? scene.add.image(l.x * 16 + 8, l.y * 16 + 8, 'feydeau_mascaron').setDepth(7) : scene.add.image(l.x * 16 + 8, l.y * 16 + 8, 'lv_rock').setDepth(7);
    var t = GP.UI.txt(scene, img.x, img.y - 12, ' ' + l.text + ' ', GP.PAL.o, { backgroundColor: GP.PAL.d, padding: { x: 3, y: 4 } }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
    t.x = Phaser.Math.Clamp(t.x, t.width / 2 + 4, scene.W - t.width / 2 - 4);
    return { x: img.x, y: img.y, text: t, shown: false, blur: l.blur !== false };
  });

  // ---------- Conteneurs qui tombent de la grue (ombre au sol 0,9 s avant) ----------
  this.fallers = (L.fallers || []).map(function (f) {
    var floor = L.top(f.x) * 16, x = f.x * 16 + 8, y0 = f.y * 16;
    var cable = scene.add.rectangle(x, 0, 2, y0, 0x14182e, 1).setOrigin(0.5, 0).setDepth(8);
    var img = scene.add.image(x, y0, 'lv_conteneur').setOrigin(0.5, 0).setDepth(9);
    var shadow = scene.add.rectangle(x, floor - 1, 34, 3, 0x14182e, 0.55).setDepth(6).setVisible(false);
    return { x: x, y0: y0, floor: floor, period: f.period || 3600, t: -(f.offset || 0), state: 'hang', img: img, cable: cable, shadow: shadow, vy: 0 };
  });

  // ---------- Jets (vapeur, eau) : un souffle les annonce, puis la colonne est dangereuse 1,2 s ----------
  this.jets = (L.jets || []).map(function (j) {
    var floor = L.top(j.x) * 16, x = j.x * 16 + 8;
    var col = scene.add.rectangle(x, floor, 12, 10, 0x6fb7ee, 0.9).setOrigin(0.5, 1).setDepth(10).setVisible(false);
    var core = scene.add.rectangle(x, floor, 6, 10, 0xffffff, 0.95).setOrigin(0.5, 1).setDepth(10).setVisible(false);
    var puff = S && S.has('vapeur') ? S.add(scene, x, floor, 'vapeur') : null;
    if (puff) { puff.setDepth(10).setVisible(false); if (puff.setOrigin) puff.setOrigin(0.5, 1); }
    return { x: x, floor: floor, h: (j.h || 4) * 16, period: j.period || 3000, t: -(j.offset || 0), state: 'idle', col: col, core: core, puff: puff };
  });

  // ---------- Projecteurs : une colonne de lumière qui balaie ----------
  this.beams = (L.beams || []).map(function (b, i) {
    var cone = scene.add.rectangle(b.x0 * 16, 24, 12, H - 24, 0xfff3a0, 0.28).setOrigin(0.5, 0).setDepth(10);
    var core = scene.add.rectangle(b.x0 * 16, 24, 3, H - 24, 0xffffff, 0.6).setOrigin(0.5, 0).setDepth(10);
    return { def: b, cone: cone, core: core, x: b.x0 * 16, ph: i * 1.7 };
  });

  // ---------- Ressorts (parasols de café) : on rebondit à 4,5 tuiles ----------
  this.springs = (L.springs || []).map(function (sp) {
    var floor = (sp.y + 1) * 16, x = sp.x * 16 + 8;
    var spr = has('graslin_parasol_cafe') ? scene.add.image(x, floor, 'graslin_parasol_cafe').setOrigin(0.5, 1).setDepth(8) : scene.add.image(x, floor, 'lv_rock').setOrigin(0.5, 1).setDepth(8);
    var plat = scene.add.image(x - 14, floor - 28, 'lv_tileset').setOrigin(0, 0).setDisplaySize(28, 6).setVisible(false);
    scene.platformBody(plat, true);
    return { x: x, top: floor - 28, spr: spr, cool: 0 };
  });

  // ---------- Rideau de théâtre : il s'ouvre quand on joue la bonne séquence (< > v ^) ----------
  var SYM = { L: '<', R: '>', D: 'V', J: '^' };
  this.seqs = (L.seqs || []).map(function (q) {
    var floor = L.top(q.x) * 16, x = q.x * 16 + 8;
    var img = scene.add.image(x, floor, 'lv_rideau').setOrigin(0.5, 1).setDepth(7);
    scene.platformBody(img, false);
    var txt = GP.UI.txt(scene, x - 30, floor - 62, '', GP.PAL.y, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 4 } }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
    return { x: x, floor: floor, img: img, txt: txt, pattern: q.pattern, idx: 0, open: false, sym: SYM };
  });
  this.prev = { left: false, right: false, down: false, jump: false };

  // ---------- Tapis et rouages : le sol entraîne le joueur ----------
  this.belts = (L.belts || []).map(function (b) {
    var y = L.top(b.x0) * 16, strip = scene.add.tileSprite(b.x0 * 16, y, (b.x1 - b.x0) * 16, 8, b.dir < 0 ? 'lv_tapis_g' : 'lv_tapis').setOrigin(0, 0).setDepth(6);
    return { def: b, strip: strip };
  });

  // ---------- Chariots de grue : ils avancent seulement quand on est dessus, puis reviennent doucement ----------
  var cartSet = (L.skin && (L.skin.cart || L.skin.mover || L.skin.ledge)) || null;
  this.carts = (L.carts || []).map(function (c, i) {
    var img = scene.add.image(c.x * 16, c.y * 16, cartSet ? scene.rowTexture('lv_cart_' + i, cartSet, c.w) : 'lv_tileset').setOrigin(0, 0).setDepth(9);
    scene.physics.add.existing(img);
    var b = img.body; b.setAllowGravity(false); b.setImmovable(true);
    b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false;
    scene.physics.add.collider(scene.player, img);
    return { img: img, body: b, x0: c.x * 16, dx: c.dx * 16, w: c.w * 16, y: c.y * 16 };
  });

  // ---------- Anneaux : on les traverse en l'air (rouge = élan, bleu = hauteur), chaque passage change la couleur ----------
  var RC = { red: 0xff6b5b, blue: 0x6ea8ff };
  this.rcolors = RC;
  this.rings = (L.rings || []).map(function (r) {
    var cx = r.x * 16 + 8, cy = r.y * 16 + 8;
    var col = L.top(r.x) < 17 ? L.top(r.x) * 16 : H;                       // le mât est planté dans le sol, ou au fond de l'eau
    scene.add.rectangle(cx, cy + 18, 5, col - cy - 18, 0x8a94a6, 1).setOrigin(0.5, 0).setDepth(7);
    scene.add.rectangle(cx - 1, cy + 18, 1, col - cy - 18, 0xc7ced9, 1).setOrigin(0.5, 0).setDepth(7);
    var img = scene.add.image(cx, cy, 'lv_anneau_' + (r.color || 'red')).setDepth(8);   // anneau néon, rouge ou bleu
    var halo = has('lv_halo') ? scene.add.image(cx, cy, 'lv_halo').setBlendMode(Phaser.BlendModes.ADD).setTint(RC[r.color] || RC.red).setAlpha(0.35).setScale(1.7).setDepth(7) : null;   // lueur néon
    return { img: img, halo: halo, x: img.x, y: img.y, color: r.color || 'red', cool: 0 };
  });
  this.aligns = (L.aligns || []).map(function (a) {
    var set = (L.skin && (L.skin.bridge || L.skin.ledge)) || null, n = a.bridge.w;
    var img = scene.add.image(a.bridge.x * 16, a.bridge.y * 16, set ? scene.rowTexture('lv_align_' + a.bridge.x, set, n) : 'lv_tileset').setOrigin(0, 0).setDepth(9).setAlpha(0);
    var body = scene.platformBody(img, true); body.enable = false;
    return { def: a, img: img, body: body, shown: false };
  });

  // ---------- Muses du théâtre : la statue s'éclaire 0,5 s, puis lance une note à hauteur de tête ----------
  this.muses = (L.muses || []).map(function (m) {
    var floor = L.top(m.x) * 16, x = m.x * 16 + 8;
    var img = scene.add.image(x, floor, has('graslin_muse_statue') ? 'graslin_muse_statue' : 'lv_rock').setOrigin(0.5, 1).setDepth(8);
    if (m.dir > 0) img.setFlipX(true);
    return { x: x, floor: floor, img: img, dir: m.dir || -1, period: m.period || 2600, t: -(m.offset || 0) };
  });
  this.notes = [];

  // ---------- Moisissure : une plaque s'étend sur le sol (visible), reste, puis recule ----------
  this.molds = (L.molds || []).map(function (m) {
    var floor = L.top(m.x) * 16;
    var body = scene.add.rectangle(m.x * 16, floor, 1, 9, 0x6a7a2a, 0.95).setOrigin(0, 1).setDepth(10);
    var edge = scene.add.rectangle(m.x * 16, floor - 7, 1, 2, 0xa9bd4f, 1).setOrigin(0, 1).setDepth(10);
    return { x: m.x * 16, w: m.w * 16, floor: floor, period: m.period || 8000, t: -(m.offset || 0), body: body, edge: edge, p: 0 };
  });

  // ---------- Bornes de couleur (Buren) : en marchant sur une borne, on allume les passerelles néon de sa couleur (les autres s'éteignent) ----------
  // Sous la pluie, une couleur autre que le bleu ne reste allumée que 5 s (elle clignote avant de s'éteindre).
  var CC = { blue: ['#3d9bff', '#cfe6ff'], green: ['#4dff9c', '#d4ffe8'], red: ['#ff4f66', '#ffd0d6'] };
  this.cstart = L.cstart || 'blue'; this.ccolor = this.cstart; this.ctimer = 0;
  Object.keys(CC).forEach(function (k) {
    var o = GP.PixelArt.canvas(12, 20), cx = o.ctx;
    cx.fillStyle = '#0d1226'; cx.fillRect(0, 8, 12, 12); cx.fillStyle = '#6f7a8e'; cx.fillRect(1, 9, 10, 11); cx.fillStyle = '#c7ced9'; cx.fillRect(1, 9, 2, 11);
    cx.fillStyle = '#0d1226'; cx.fillRect(1, 0, 10, 9); cx.fillStyle = CC[k][0]; cx.fillRect(2, 1, 8, 7); cx.fillStyle = CC[k][1]; cx.fillRect(3, 2, 3, 2);
    GP.PixelArt.toTexture(scene, 'lv_borne_' + k, o.cv);
  });
  this.cbornes = (L.cbornes || []).map(function (r) {
    var fl = L.top(r.x) * 16, img = scene.add.image(r.x * 16 + 8, fl, 'lv_borne_' + r.color).setOrigin(0.5, 1).setDepth(8);
    var halo = has('lv_halo') ? scene.add.image(r.x * 16 + 8, fl - 14, 'lv_halo').setBlendMode(Phaser.BlendModes.ADD).setTint(parseInt(CC[r.color][0].slice(1), 16)).setAlpha(0.4).setDepth(7) : null;
    return { x: r.x * 16 + 8, floor: fl, color: r.color, img: img, halo: halo };
  });
  this.cplats = (L.cplats || []).map(function (r, i) {
    var key = 'lv_cplat_' + i, o = GP.PixelArt.canvas(r.w * 16, 10), c = CC[r.color], cx = o.ctx;
    cx.globalAlpha = 0.25; cx.fillStyle = c[0]; cx.fillRect(0, 0, r.w * 16, 10);
    cx.globalAlpha = 1; cx.fillRect(0, 2, r.w * 16, 5); cx.fillStyle = c[1]; cx.fillRect(1, 3, r.w * 16 - 2, 2);
    GP.PixelArt.toTexture(scene, key, o.cv);
    var img = scene.add.image(r.x * 16, r.y * 16, key).setOrigin(0, 0).setDepth(9);
    return { img: img, body: scene.platformBody(img, true), color: r.color };
  });
  this.setColor = function (c) {
    self.ccolor = c; self.ctimer = (c !== self.cstart && scene.env && scene.env.rain) ? 5000 : 0;
    self.cplats.forEach(function (p) { var on = p.color === c; p.body.enable = on; p.img.setAlpha(on ? 1 : 0.13); });
    self.cbornes.forEach(function (r) { if (r.halo) r.halo.setAlpha(r.color === c ? 0.8 : 0.25); });
  };
  if (this.cplats.length) this.setColor(this.cstart);

  // ---------- Dalles de verre : elles se fissurent 0,8 s après qu'on s'y pose, tombent, et reviennent 3 s plus tard ----------
  var glassSet = ['memorial_sol_dalle_verre', 'memorial_sol_dalle_verre', 'memorial_sol_dalle_verre'];
  this.glasses = (L.glasses || []).map(function (g, i) {
    var img = scene.add.image(g.x * 16, g.y * 16, scene.rowTexture('lv_glass_' + i, glassSet, g.w)).setOrigin(0, 0).setDepth(9).setAlpha(0.92);
    return { img: img, body: scene.platformBody(img, true), x: img.x, w: g.w * 16, state: 'solid', timer: 0 };
  });

  // ---------- Mémoire : une stèle à lire, puis une porte de lumière qui s'ouvre si on rejoue la séquence (sans danger) ----------
  var WORD = { D: 'BAS', J: 'HAUT' };
  this.memos = (L.memos || []).map(function (q) {
    var sfl = L.top(q.stele) * 16, sx = q.stele * 16 + 8, gfl = L.top(q.gate) * 16, gx = q.gate * 16 + 8;
    scene.add.image(sx, sfl, has('memorial_stele_gravee') ? 'memorial_stele_gravee' : 'lv_rock').setOrigin(0.5, 1).setDepth(7);
    var glow = scene.add.rectangle(sx, sfl - 28, 6, 6, 0xfff3a0, 0.9).setDepth(8);
    var barrier = scene.add.image(gx, gfl, 'lv_tileset').setOrigin(0.5, 1).setDisplaySize(10, 56).setVisible(false);
    scene.platformBody(barrier, false);
    var gate = scene.add.rectangle(gx, gfl, 10, 56, 0xbfe4ff, 0.55).setOrigin(0.5, 1).setDepth(7);
    var steleTxt = GP.UI.txt(scene, sx, sfl - 44, ' ' + q.pattern.map(function (c) { return WORD[c]; }).join(' - ') + ' ', GP.PAL.y, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 4 } }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
    var gateTxt = GP.UI.txt(scene, gx - 24, gfl - 62, '', GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 4 } }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
    return { sx: sx, gx: gx, gate: gate, barrier: barrier, steleTxt: steleTxt, gateTxt: gateTxt, glow: glow, pattern: q.pattern, idx: 0, open: false };
  });

  // ---------- Courants d'air ascendants : gravité très allégée (saut jusqu'à 7 tuiles, on flotte) ----------
  this.drafts = (L.drafts || []).map(function (d) {
    var x0 = d.x0 * 16, y0 = d.y0 * 16, w = (d.x1 - d.x0) * 16, h = (d.y1 - d.y0) * 16;
    var col = scene.add.rectangle(x0, y0, w, h, 0x7fe0d0, 0.16).setOrigin(0, 0).setDepth(12);
    var sparks = [], n = Math.max(5, Math.round(w / 5)), rnd = GP.PixelArt.rng(d.x0 * 31 + d.y0);
    for (var i = 0; i < n; i++) sparks.push({ r: scene.add.rectangle(x0 + rnd() * w, y0 + rnd() * h, 2, 3, 0xfff3a0, 0.85).setDepth(12), v: 25 + rnd() * 40 });
    return { x0: x0, x1: x0 + w, y0: y0, y1: y0 + h, col: col, sparks: sparks };
  });

  // ---------- Pourriture : chaque pixel vert mûrit, est jaune (récoltable) puis brunit et s'efface ----------
  if (L.rot) scene.pixels.forEach(function (px, i) { px.rot = { t: (i * 1471) % 9000 }; px.locked = true; px.dim = true; });
};

GP.Dangers.prototype = {
  /** Produit des réglages météo du niveau (L.wxm) actifs en ce moment. */
  f: function (name) {
    var e = this.s.env, w = this.s.L.wxm || {}, v = 1;
    ['rain', 'sun', 'wind'].forEach(function (k) { if (e[k] && w[k] && w[k][name] !== undefined) v *= w[k][name]; });
    return v;
  },
  /** Somme des réglages météo additifs (ex. hauteur de l'eau en tuiles). */
  a: function (name) {
    var e = this.s.env, w = this.s.L.wxm || {}, v = 0;
    ['rain', 'sun', 'wind'].forEach(function (k) { if (e[k] && w[k] && w[k][name] !== undefined) v += w[k][name]; });
    return v;
  },

  /** Après une mort : les anneaux retrouvent leur couleur de départ (le pont déjà apparu reste). */
  reset: function () {
    var self = this;
    this.s.player.body.setGravityY(0);
    if (this.cplats.length) this.setColor(this.cstart);
    (this.s.L.rings || []).forEach(function (r, i) { var o = self.rings[i]; o.color = r.color; o.img.setTexture('lv_anneau_' + r.color); if (o.halo) o.halo.setTint(self.rcolors[r.color]); o.cool = 0; });
  },

  input: function (c) {
    var p = this.prev;
    this.edge = { left: c.left && !p.left, right: c.right && !p.right, down: c.down && !p.down, jump: c.jump && !p.jump };
    this.prev = { left: !!c.left, right: !!c.right, down: !!c.down, jump: !!c.jump };
    var self = this;
    this.memoryInput();
    this.seqs.forEach(function (q) {
      if (q.open) return;
      var pl = self.s.player;
      if (!(pl.x > q.x - 70 && pl.x < q.x - 6)) return;
      var want = q.pattern[q.idx], e = self.edge;
      var got = e.left ? 'L' : e.right ? 'R' : e.down ? 'D' : e.jump ? 'J' : null;
      if (!got) return;
      if (got === want) {
        q.idx++; GP.Sfx.play('step');
        if (q.idx >= q.pattern.length) {
          q.open = true; q.img.body.enable = false; GP.Sfx.play('confirm');
          self.s.tweens.add({ targets: q.img, alpha: 0, y: q.floor - 40, duration: 500 });
          self.s.toast('LE RIDEAU S\'OUVRE !', GP.PAL.g);
        }
      } else { q.idx = 0; GP.Sfx.play('error'); self.s.toast('RATÉ : RECOMMENCE LA SÉQUENCE', GP.PAL.o); }
    });
  },

  /** Touches pour les portes de mémoire : BAS (↓) et HAUT (saut). */
  memoryInput: function () {
    var self = this, e = this.edge, p = this.s.player;
    this.memos.forEach(function (q) {
      if (q.open || !(p.x > q.gx - 90 && p.x < q.gx - 6)) return;
      var got = e.down ? 'D' : e.jump ? 'J' : null;
      if (!got) return;
      if (got === q.pattern[q.idx]) {
        q.idx++; GP.Sfx.play('step');
        if (q.idx >= q.pattern.length) {
          q.open = true; q.barrier.body.enable = false; GP.Sfx.play('confirm');
          self.s.tweens.add({ targets: q.gate, alpha: 0, duration: 600 });
          self.s.toast('LA PORTE DE LUMIÈRE S\'OUVRE', GP.PAL.g);
        }
      } else { q.idx = 0; GP.Sfx.play('error'); self.s.toast('RELIS LA STÈLE ET RECOMMENCE', GP.PAL.o); }
    });
  },

  update: function (dt) {
    var self = this, s = this.s, p = s.player, b = p.body, k = dt / 1000, H = s.H;
    this.t += dt;
    var onGround = b.blocked.down || b.touching.down;

    // ennemis
    this.patrols.forEach(function (e) {
      var sp = e.speed * self.f('enemy'), img = e.img;
      e.bob += dt;
      if (e.kind === 'robot') {
        var dx = p.x - img.x, near = Math.abs(dx) < 96 && Math.abs(p.y - e.feet) < 40;
        if (near) { img.x += Math.sign(dx) * sp * k; e.dir = dx > 0 ? 1 : -1; }
        else img.x += Math.sign(e.home - img.x) * Math.min(Math.abs(e.home - img.x), sp * 0.5 * k);
        img.x = Phaser.Math.Clamp(img.x, e.x0, e.x1);
      } else {
        img.x += e.dir * sp * k;
        if (img.x > e.x1) { img.x = e.x1; e.dir = -1; }
        else if (img.x < e.x0) { img.x = e.x0; e.dir = 1; }
      }
      img.setFlipX(e.dir < 0);
      img.y = e.feet - (e.kind === 'esprit' && !GP.reducedMotion ? 3 + Math.sin(e.bob / 400) * 3 : 0);
    });

    // marée : la surface monte et descend lentement (plus haute sous la pluie, plus basse au soleil)
    this.tides.forEach(function (t) {
      var d = t.def, high = d.high - self.a('tide'), ph = self.t / d.period * Math.PI * 2, kk = 0.5 - 0.5 * Math.cos(ph);
      t.y = d.low * 16 + (high * 16 - d.low * 16) * kk;
      t.body.y = t.y; t.line.y = t.y;
    });

    // bateaux : ils s'enfoncent de 14 px en 1,6 s sous le joueur, puis remontent
    this.boats.forEach(function (bt) {
      var on = b.touching.down && b.bottom <= bt.plat.y + 3 && b.right > bt.x && b.x < bt.x + bt.w;
      bt.sink = Phaser.Math.Clamp(bt.sink + (on ? 14 / 1600 * self.f('boat') : -14 / 1200) * dt, 0, 14);
      bt.plat.y = bt.y0 + bt.sink; bt.plat.body.updateFromGameObject();
      bt.spr.y = bt.plat.y - 6;
    });

    // visages menteurs
    this.liars.forEach(function (l) {
      var near = Math.abs(p.x - l.x) < 56 && Math.abs(p.y - l.y) < 80;
      if (near !== l.shown) { l.shown = near; s.tweens.add({ targets: l.text, alpha: near ? 1 : 0, duration: 160 }); }
      if (l.blur) s.pixels.forEach(function (px) {
        if (px.taken || px.rot) return;
        var close = near && Math.abs(px.x - l.x) < 110;
        px.dim = close; if (close) px.img.setAlpha(0.15);
      });
    });

    // conteneurs
    this.fallers.forEach(function (f) {
      var period = f.period * self.f('fall');
      f.t += dt;
      if (f.state === 'hang') {
        f.cable.height = f.img.y;
        if (f.t > period - 900) f.shadow.setVisible(true);
        if (f.t > period) { f.state = 'fall'; f.vy = 0; f.shadow.setVisible(false); f.cable.setVisible(false); }
      } else if (f.state === 'fall') {
        f.vy = Math.min(f.vy + 900 * k, 520); f.img.y += f.vy * k;
        if (f.img.y + 22 >= f.floor) { f.img.y = f.floor - 22; f.state = 'land'; f.t = 0; GP.Sfx.play('step'); }
      } else if (f.state === 'land') {
        if (f.t > 800) { f.state = 'back'; f.t = 0; s.tweens.add({ targets: f.img, alpha: 0, duration: 300 }); }
      } else if (f.state === 'back' && f.t > 400) {
        f.img.y = f.y0; f.img.setAlpha(0); s.tweens.add({ targets: f.img, alpha: 1, duration: 400 });
        f.cable.setVisible(true); f.cable.height = f.y0; f.state = 'hang'; f.t = 0;
      }
    });

    // jets
    this.jets.forEach(function (j) {
      j.t += dt;
      var period = j.period, ph = ((j.t % period) + period) % period;
      var state = j.t < 0 ? 'idle' : ph < period - 1800 ? 'idle' : ph < period - 1200 ? 'warn' : 'on';
      if (state !== j.state) {
        j.state = state;
        if (j.puff) { j.puff.setVisible(state === 'warn'); }
        j.col.setVisible(state === 'on'); j.core.setVisible(state === 'on');
        if (state === 'on') { j.hh = j.h * self.f('jet'); j.col.setSize(12, j.hh); j.core.setSize(6, j.hh); }
      }
    });

    // projecteurs
    this.beams.forEach(function (bm) {
      var d = bm.def, ph = self.t / 1000 * (d.speed || 0.5) * self.f('beam') + bm.ph, kk = 0.5 - 0.5 * Math.cos(ph);
      bm.x = d.x0 * 16 + (d.x1 - d.x0) * 16 * kk;
      bm.cone.x = bm.x; bm.core.x = bm.x;
    });

    // ressorts
    this.springs.forEach(function (sp) {
      sp.cool -= dt;
      if (sp.cool <= 0 && b.touching.down && Math.abs(p.x - sp.x) < 18 && Math.abs(b.bottom - sp.top) < 4) {
        b.setVelocityY(-380 * self.f('spring')); s.jumping = true; sp.cool = 300; GP.Sfx.play('select');
        if (!GP.reducedMotion) s.tweens.add({ targets: sp.spr, scaleY: 0.85, duration: 90, yoyo: true });
      }
    });

    // rideau : la séquence à jouer s'affiche quand on s'approche
    this.seqs.forEach(function (q) {
      var near = !q.open && p.x > q.x - 90 && p.x < q.x - 6;
      if (near) q.txt.setText(' ' + q.pattern.map(function (c, i) { return i < q.idx ? '*' : q.sym[c]; }).join(' ') + ' ');
      q.txt.setAlpha(near ? 1 : 0);
    });

    // tapis
    this.belts.forEach(function (bl) {
      var d = bl.def, v = d.dir * (d.speed || 45) * self.f('belt');
      bl.strip.tilePositionX -= v * k;
      if (onGround && b.right > d.x0 * 16 && b.x < d.x1 * 16 && b.bottom <= (s.L.top(d.x0) * 16) + 4) p.x += v * k;
    });

    // chariots
    this.carts.forEach(function (c) {
      var on = b.touching.down && b.bottom <= c.img.y + 3 && b.right > c.img.x && b.x < c.img.x + c.w;
      var vx = on ? 42 * self.f('mover') : -22;
      if (c.img.x + vx * k > c.x0 + c.dx) vx = 0;
      if (c.img.x + vx * k < c.x0) vx = 0;
      c.body.setVelocityX(vx);
    });

    // anneaux
    this.rings.forEach(function (r) {
      r.cool -= dt;
      if (r.cool > 0 || onGround) return;
      if (Math.abs(p.x - r.x) < 11 && Math.abs((b.y + 8) - r.y) < 32) {
        r.cool = 700;
        var dir = b.velocity.x < -5 ? -1 : 1;
        if (r.color === 'red') { b.setVelocityX(dir * 250 * self.f('ring')); b.setVelocityY(Math.min(b.velocity.y, -160)); s.boost = 700; }
        else { b.setVelocityY(-400 * self.f('ring')); }
        GP.Sfx.play('select');
        r.color = r.color === 'red' ? 'blue' : 'red'; r.img.setTexture('lv_anneau_' + r.color); if (r.halo) r.halo.setTint(self.rcolors[r.color]);
      }
    });
    this.aligns.forEach(function (a) {
      if (a.shown) return;
      var all = a.def.rings.every(function (i) { return self.rings[i].color === self.rings[a.def.rings[0]].color; });
      if (all) { a.shown = true; a.body.enable = true; s.tweens.add({ targets: a.img, alpha: 0.95, duration: 600 }); GP.Sfx.play('unlock'); s.toast('LES ANNEAUX SONT ALIGNÉS : LE PAYSAGE APPARAÎT !', GP.PAL.g); }
    });

    // Muses et notes (à hauteur de tête : s'accroupir ou sauter les évite)
    this.muses.forEach(function (m) {
      m.t += dt;
      var ph = ((m.t % m.period) + m.period) % m.period;
      if (m.t >= 0 && ph > m.period - 500) m.img.setTint(0xf4d35e); else m.img.clearTint();
      if (m.t >= 0 && ph < dt) self.notes.push({ img: s.add.image(m.x + m.dir * 9, m.floor - 17, 'lv_note').setDepth(9), vx: m.dir * 85, life: 11 * 16 / 85 * 1000 });
    });
    this.notes = this.notes.filter(function (n) {
      var sp = self.f('note');
      n.img.x += n.vx * sp * k; n.life -= dt * sp;
      if (n.life <= 0 || s.solidAt(n.img.x + (n.vx > 0 ? 5 : -5), n.img.y)) { n.img.destroy(); return false; }
      return true;
    });

    // moisissure
    this.molds.forEach(function (m) {
      m.t += dt * self.f('mold');
      var ph = ((m.t % m.period) + m.period) % m.period / m.period;
      m.p = ph < 0.35 ? ph / 0.35 : ph < 0.65 ? 1 : (1 - ph) / 0.35;
      var w = Math.max(1, m.w * m.p), vis = m.p > 0.02;
      m.body.setSize(w, 9).setVisible(vis); m.edge.setSize(w, 2).setVisible(vis);
    });

    // bornes de couleur : marcher dessus allume les passerelles de sa couleur ; sous la pluie le bleu revient après 5 s
    if (this.cplats.length) {
      this.cbornes.forEach(function (r) { if (Math.abs(p.x - r.x) < 9 && Math.abs(b.bottom - r.floor) < 6 && self.ccolor !== r.color) { self.setColor(r.color); GP.Sfx.play('confirm'); } });
      if (this.ctimer > 0) {
        this.ctimer -= dt;
        if (this.ctimer <= 0) self.setColor(this.cstart);
        else if (this.ctimer < 1500) this.cplats.forEach(function (q) { if (q.color === self.ccolor) q.img.setAlpha(GP.reducedMotion ? 0.55 : (Math.floor(self.ctimer / 100) % 2 ? 1 : 0.35)); });
      }
    }

    // dalles de verre
    this.glasses.forEach(function (c) {
      var on = c.state === 'solid' && b.touching.down && b.bottom <= c.img.y + 2 && b.right > c.img.x && b.x < c.img.x + c.w;
      if (on) { c.state = 'cracking'; c.timer = 800 * self.f('glass'); GP.Sfx.play('step'); c.img.setTint(0xd8ecff); }
      if (c.state === 'cracking') {
        c.timer -= dt; c.img.x = c.x + (GP.reducedMotion ? 0 : (Math.floor(c.timer / 60) % 2 ? 1 : -1));
        if (c.timer <= 0) { c.state = 'gone'; c.timer = 3000 * self.f('glassback'); c.body.enable = false; c.img.x = c.x; s.tweens.add({ targets: c.img, alpha: 0, y: c.img.y + 8, duration: 220 }); }
      } else if (c.state === 'gone') {
        c.timer -= dt;
        if (c.timer <= 0) { c.state = 'solid'; c.body.enable = true; s.tweens.killTweensOf(c.img); c.img.setAlpha(0.92).clearTint().setPosition(c.x, c.body.y); }
      }
    });

    // mémoire : la séquence apparaît près de la stèle, un point d'interrogation près de la porte
    this.memos.forEach(function (q) {
      var nearS = Math.abs(p.x - q.sx) < 70, nearG = !q.open && p.x > q.gx - 90 && p.x < q.gx - 6;
      q.steleTxt.setAlpha(nearS ? 1 : 0);
      if (nearG) q.gateTxt.setText(' ' + q.pattern.map(function (c, i) { return i < q.idx ? '*' : '?'; }).join(' ') + ' ');
      q.gateTxt.setAlpha(nearG ? 1 : 0);
    });

    // courants d'air : la gravité est allégée de moitié dedans
    var inDraft = false;
    this.drafts.forEach(function (d) {
      if (p.x > d.x0 && p.x < d.x1 && p.y > d.y0 && p.y < d.y1 + 16) inDraft = true;
      d.sparks.forEach(function (sp) { sp.r.y -= sp.v * k; if (sp.r.y < d.y0) sp.r.y = d.y1; });
    });
    if (this.drafts.length) b.setGravityY(inDraft ? -600 : 0);

    // pourriture des pixels
    if (s.L.rot) s.pixels.forEach(function (px) {
      if (px.taken || !px.rot) return;
      px.rot.t += dt * self.f('rot');
      var ph = px.rot.t % 11600;
      if (ph < 1600) { px.locked = true; px.img.setTint(0x9bdc6a).setAlpha(0.8); }
      else if (ph < 6800) { px.locked = false; px.img.clearTint().setAlpha(1); }
      else if (ph < 8600) { px.locked = true; px.img.setTint(0x7a4a2a).setAlpha(0.9); }
      else { px.locked = true; px.img.setAlpha(0); }
    });
  },

  /** Contact avec un danger : renvoie le message de mort, ou null. */
  check: function (hit) {
    var i, e, b = this.s.player.body, H = this.s.H;
    for (i = 0; i < this.patrols.length; i++) {
      e = this.patrols[i];
      var h = e.kind === 'robot' ? 11 : 14, y = e.kind === 'esprit' ? e.img.y - 16 : e.feet - h;
      if (hit(e.img.x - 5, y, 10, h)) return e.kind === 'robot' ? 'UN ROBOT T\'A ATTRAPÉ !' : 'UN ESPRIT DE LA GARDE !';
    }
    for (i = 0; i < this.tides.length; i++) {
      e = this.tides[i];
      if (b.right > e.def.x0 * 16 && b.x < e.def.x1 * 16 && b.bottom > e.y + 5) return 'L\'EAU A MONTÉ ! GAGNE LA HAUTEUR';
    }
    for (i = 0; i < this.fallers.length; i++) {
      e = this.fallers[i];
      if (e.state === 'fall' && hit(e.x - 14, e.img.y, 28, 22)) return 'UN CONTENEUR TOMBE !';
    }
    for (i = 0; i < this.jets.length; i++) {
      e = this.jets[i];
      if (e.state === 'on' && hit(e.x - 5, e.floor - e.hh, 10, e.hh)) return 'UN JET ! ATTENDS LE SOUFFLE';
    }
    for (i = 0; i < this.beams.length; i++) {
      e = this.beams[i];
      if (hit(e.x - 5, 24, 10, H - 24)) return 'LA LUMIÈRE T\'A REPÉRÉ !';
    }
    for (i = 0; i < this.notes.length; i++) {
      e = this.notes[i].img;
      if (hit(e.x - 4, e.y - 5, 8, 10)) return 'UNE NOTE DE MUSIQUE ! ACCROUPIS-TOI';
    }
    for (i = 0; i < this.molds.length; i++) {
      e = this.molds[i];
      if (e.p > 0.25 && hit(e.x, e.floor - 9, e.w * e.p, 9)) return 'DE LA MOISISSURE ! CONTOURNE-LA';
    }
    return null;
  }
};
