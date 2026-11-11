/**
 * Dangers (GP.Dangers) — mécaniques et ennemis des niveaux 4 à 12 (Feydeau, Graslin, Machines, Chantiers, Buren, Hangar,
 * Mémorial, Pommeraye, Tour LU) et esprits de la garde du Château. Un seul fichier, créé par GameScene.makeMechanics() à partir de la définition du niveau
 * (briques de js/data/levels.js : L.patrol, L.tide, L.boat, L.liar, L.faller, L.jet, L.beam, L.spring, L.seq, L.belt,
 * L.cart, L.ring + L.align, L.borne + L.cplat, L.elephant, L.hanger, L.crane, L.plaque, L.regime, L.peau, L.caisse, L.pond, L.rot, L.muse, L.mold, L.glass, L.memo, L.draft).
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
  /** Hauteur réellement dessinée d'une image (dernière ligne non transparente) : sert à poser un objet exactement sur le sol, sans espace sous le dessin. */
  function realBottom(img) {
    var src = img.texture.getSourceImage(), cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height;
    var cx = cv.getContext('2d'); cx.drawImage(src, 0, 0);
    var d = cx.getImageData(0, 0, src.width, src.height).data;
    for (var y = src.height - 1; y >= 0; y--) for (var x = 0; x < src.width; x++) if (d[(y * src.width + x) * 4 + 3] > 0) return y + 1;
    return src.height;
  }

  // ---------- Ennemis : esprits (patrouille), robots (poursuite), araignées et statues (elles n'avancent que si on ne les regarde pas, comme les anges qui pleurent) ----------
  this.patrols = (L.patrols || []).map(function (p) {
    var key = { esprit: 'lv_esprit', robot: 'lv_robot', araignee: 'lv_araignee', oiseau: 'lv_heron_vol', statue: L.statueKey || 'pommeraye_statue' }[p.kind] || 'lv_esprit';
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
    var img = scene.add.image(x, y0, f.key || 'lv_conteneur').setOrigin(0.5, 0).setDepth(9);
    var shadow = scene.add.rectangle(x, floor - 1, img.width, 3, 0x14182e, 0.55).setDepth(6).setVisible(false);
    return { x: x, y0: y0, floor: floor, period: f.period || 3600, t: -(f.offset || 0), state: 'hang', img: img, cable: cable, shadow: shadow, vy: 0, h: realBottom(img), w: img.width, msg: f.msg || 'UN CONTENEUR TOMBE !' };
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

  // ---------- Projecteurs « 1-2-3 soleil » : trois projecteurs en haut de l'écran ; ils chauffent doucement, puis allumés il faut rester immobile (au sol), éteints on peut avancer ----------
  this.spot = null;
  if (L.spotZone) {
    var SW = GP.Config.WIDTH, gfx = scene.add.graphics().setScrollFactor(0).setDepth(32.5), nuit = scene.add.rectangle(0, 0, SW, H, 0x000000, 0).setOrigin(0).setScrollFactor(0).setDepth(31.5);   // au-dessus du filtre de nuit (31) pour que le jaune reste vif
    var lab = GP.UI.txt(scene, SW / 2, 78, '', GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 4 } }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(40).setAlpha(0);
    this.spot = { zone: L.spotZone, gfx: gfx, nuit: nuit, lab: lab, xs: [SW * 0.18, SW * 0.5, SW * 0.82], phase: 'off', t: 2500, k: 0, n: 0, grace: 0 };
  }

  // ---------- Ressorts (parasols de café) : on rebondit à 4,5 tuiles ----------
  this.springs = (L.springs || []).map(function (sp) {
    var floor = (sp.y + 1) * 16, x = sp.x * 16 + 8;
    var skey = L.springKey || 'graslin_parasol_cafe', spr = has(skey) ? scene.add.image(x, floor, skey).setOrigin(0.5, 1).setDepth(8) : scene.add.image(x, floor, 'lv_rock').setOrigin(0.5, 1).setDepth(8);
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

  // ---------- Plaques de verre (Mémorial) : elles s'allument doucement quand on s'approche et affichent un fait daté ; une plaque allumée le reste ----------
  this.plaques = (L.plaques || []).map(function (q) {
    var x = q.x * 16 + 8, fl = q.floor * 16;
    var img = scene.add.image(x, fl, 'lv_plaque').setOrigin(0.5, 1).setDepth(7).setAlpha(0.6);
    var halo = has('lv_halo') ? scene.add.image(x, fl - 16, 'lv_halo').setBlendMode(Phaser.BlendModes.ADD).setTint(0xfff3a0).setScale(1.6).setAlpha(0).setDepth(6) : null;
    var txt = GP.UI.txt(scene, x, fl - 40, ' ' + q.text + ' ', GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 4 }, wordWrap: { width: 220 }, lineSpacing: 3 }).setOrigin(0.5, 1).setDepth(40).setAlpha(0);
    return { x: x, img: img, halo: halo, txt: txt, lit: false };
  });

  // ---------- Régimes de bananes (Hangar) : suspendus à une corde, ils se balancent ; au plus bas ils passent à hauteur de tête (accroupi, on passe dessous) ----------
  this.regimes = (L.regimes || []).map(function (r) {
    var px = r.x * 16 + 8, py = 12, len = r.floor * 16 - 33 - py;                       // au plus bas, le bas du régime est à 12 px du sol : accroupi (10 px) on passe dessous
    var rope = scene.add.line(0, 0, px, py, px, py + len, 0x6b4e2a, 1).setOrigin(0, 0).setLineWidth(1).setDepth(8);
    var img = scene.add.image(px, py + len, 'lv_regime').setOrigin(0.5, 0.5).setDepth(9);
    return { px: px, py: py, len: len, rope: rope, img: img, def: r };
  });

  // ---------- Peaux de banane (Hangar), comme dans Mario : on marche dessus, on glisse tout droit sans contrôle ; les peaux fixes sont visibles ----------
  this.peaux = (L.peaux || []).map(function (q) {
    return { x: q.x * 16 + 8, img: scene.add.image(q.x * 16 + 8, L.top(q.x) * 16, 'lv_peau').setOrigin(0.5, 1).setDepth(7), cool: 0 };
  });

  // ---------- Piles de caisses de bananes (Hangar) : un escalier de caisses ; le dessus de chaque pile est une plateforme ----------
  this.caisses = (L.caisses || []).map(function (q) {
    var cx = q.x * 16 + 8, fl = q.floor * 16, topY = fl - 23 * q.tiers + 3, t;
    for (t = 1; t <= q.tiers; t++) scene.add.image(cx, fl - 23 * t, 'lv_caisse_bananes').setOrigin(0.5, 0).setDepth(8 - t * 0.01);
    var pl = scene.add.image(cx - 13, topY, 'lv_tileset').setOrigin(0, 0).setDisplaySize(26, 4).setVisible(false);
    scene.platformBody(pl, true);
    return { x: cx, topY: topY };
  });

  // ---------- Grue des Chantiers : un conteneur suspendu à un câble, sous un chariot qui roule sur la flèche ; on monte dessus pour franchir le vide ----------
  this.cranes = (L.cranes || []).map(function (c) {
    var x0 = c.x * 16, y0 = c.y * 16, cw = c.key ? scene.textures.get(c.key).getSourceImage().width : 50;
    scene.add.rectangle(x0 - 6, 0, Math.abs(c.dx) * 16 + cw + 12, 7, 0xf4d35e, 1).setOrigin(0, 0).setDepth(8);               // flèche jaune au-dessus du niveau
    scene.add.rectangle(x0 - 6, 6, Math.abs(c.dx) * 16 + cw + 12, 2, 0x8a6d1a, 1).setOrigin(0, 0).setDepth(8);
    var trolley = scene.add.rectangle(x0 + cw / 2, 3, 12, 9, 0x2b2e3a, 1).setDepth(9);
    var cable = scene.add.rectangle(x0 + cw / 2, 8, 2, y0, 0x2b2e3a, 1).setOrigin(0.5, 0).setDepth(8);
    var img = scene.add.image(x0, y0, c.key || 'lv_conteneur_long').setOrigin(0, 0).setDepth(9);
    var pl = scene.add.image(x0, y0, 'lv_tileset').setOrigin(0, 0).setDisplaySize(cw, 4).setVisible(false);
    scene.physics.add.existing(pl);
    var b = pl.body; b.setAllowGravity(false); b.setImmovable(true); b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false;
    scene.physics.add.collider(scene.player, pl);
    return { def: c, x0: x0, y0: y0, cw: cw, trolley: trolley, cable: cable, img: img, body: b };
  });

  // ---------- Araignées suspendues (Machines) : elles descendent du plafond au bout d'un fil quand on ne les regarde pas, se figent si on les regarde, remontent quand on s'éloigne ----------
  this.hangers = (L.hangers || []).map(function (h) {
    var x = h.x * 16 + 8, yMin = 30, yMax = h.floor * 16 - 12;                                             // son bas s'arrête à hauteur de tête : accroupi, on passe dessous
    var thread = scene.add.rectangle(x, 0, 1, yMin, 0xdfe6f0, 1).setOrigin(0.5, 0).setDepth(8);
    var img = scene.add.image(x, yMin, 'lv_araignee').setOrigin(0.5, 1).setDepth(9);
    return { x: x, yMin: yMin, yMax: yMax, y: yMin, thread: thread, img: img, frozen: false };
  });

  // ---------- Le Grand Éléphant (Machines) : il traverse le canal d'une rive à l'autre ; on grimpe sur lui par la croupe, le dos, le toit, l'oreille puis les défenses ----------
  this.elephants = (L.elephants || []).map(function (e) {
    var floorY = 15 * 16 + 8, x0 = e.west * 16 - 10, dx = e.east * 16 + 16 - 128 - x0;                    // pieds dans l'eau du canal
    var img = scene.add.image(x0, floorY, 'lv_elephant').setOrigin(0, 1).setDepth(7), topY = floorY - img.height;
    var parts = [[8, 58, 18], [22, 32, 18], [40, 12, 34], [78, 24, 20], [102, 66, 24]].map(function (q) {   // [x, y, largeur] dans l'image : croupe, dos, toit du balcon, oreille, défenses
      var pl = scene.add.image(x0 + q[0] + 2, topY + q[1] + 2, 'lv_tileset').setOrigin(0, 0).setDisplaySize(q[2], 4).setVisible(false);
      scene.physics.add.existing(pl);
      var b = pl.body; b.setAllowGravity(false); b.setImmovable(true); b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false;
      scene.physics.add.collider(scene.player, pl);
      return { body: b, ox: q[0] + 2 };
    });
    return { img: img, x0: x0, dx: dx, period: e.period, parts: parts };
  });

  // ---------- Dalles de verre : elles se fissurent 0,8 s après qu'on s'y pose, tombent, et reviennent 3 s plus tard ----------
  var glassSet = ['memorial_sol_dalle_verre', 'memorial_sol_dalle_verre', 'memorial_sol_dalle_verre'];
  this.glasses = (L.glasses || []).map(function (g, i) {
    var img = scene.add.image(g.x * 16, g.y * 16, scene.rowTexture('lv_glass_' + i, glassSet, g.w)).setOrigin(0, 0).setDepth(9).setAlpha(0.92);
    return { img: img, body: scene.platformBody(img, true), x: img.x, w: g.w * 16, state: 'solid', timer: 0 };
  });

  // ---------- Frise de dates (Mémorial) : des blocs datés ; on les allume en les frappant de la tête (comme Mario) ou en sautant dessus, dans l'ordre de l'histoire ; frise complète = la porte s'ouvre ----------
  this.frises = (L.frises || []).map(function (f) {
    var gfl = L.top(f.porte) * 16, gx = f.porte * 16 + 8, ordre = f.blocs.map(function (q) { return q[2]; }).sort(function (u, v) { return u - v; });
    var blocs = f.blocs.map(function (q, i) {
      var x = q[0] * 16, y = q[1] * 16;
      var body = scene.add.image(x, y, 'lv_tileset').setOrigin(0, 0).setDisplaySize(16, 16).setVisible(false);
      scene.platformBody(body, false);
      var rect = scene.add.rectangle(x + 8, y + 8, 16, 16, 0x8a8a84).setDepth(8).setStrokeStyle(1, 0x3a3a38);
      var t = GP.UI.txt(scene, x + 8, y - 2 - (i % 2) * 13, String(q[2]), GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 2, y: 2 } }).setOrigin(0.5, 1).setDepth(9);
      return { x: x, y: y, year: q[2], rang: ordre.indexOf(q[2]), rect: rect, txt: t, lit: false, cool: 0 };
    });
    var barrier = scene.add.image(gx, gfl, 'lv_tileset').setOrigin(0.5, 1).setDisplaySize(10, 200).setVisible(false);   // mur de lumière du sol au plafond : impossible à sauter
    scene.platformBody(barrier, false);
    var gate = scene.add.rectangle(gx, gfl, 10, 200, 0xbfe4ff, 0.55).setOrigin(0.5, 1).setDepth(7);
    return { blocs: blocs, barrier: barrier, gate: gate, next: 0, open: false };
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
    this.s.slideMs = 0;
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
      if (q.open || !(p.x > Math.min(q.sx, q.gx) - 24 && p.x < q.gx - 6)) return;   // de la stèle jusqu'à la porte
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

    // projecteurs « 1-2-3 soleil » : off (on avance) → warn (ça chauffe) → on (immobile au sol sinon repéré)
    var sp = this.spot;
    if (sp) {
      var actif = p.x > sp.zone.x0 * 16 && p.x < sp.zone.x1 * 16 && !s.dying && !s.finished;
      if (!actif) { sp.phase = 'off'; sp.t = 2000; sp.grace = 0; }
      else {
        sp.t -= dt;
        if (sp.t <= 0) {
          if (sp.phase === 'off') { sp.phase = 'warn'; sp.t = 900; }
          else if (sp.phase === 'warn') { sp.phase = 'on'; sp.t = [1800, 2200, 1600][sp.n % 3]; sp.grace = 350; sp.n++; }
          else { sp.phase = 'off'; sp.t = [3400, 2600, 4000][sp.n % 3] * self.f('spot'); }
        }
        if (sp.phase === 'on') {
          sp.grace -= dt;
          if (sp.grace <= 0 && onGround && (Math.abs(b.velocity.x) > 18 || b.velocity.y < -60)) { sp.phase = 'off'; sp.t = 2500; s.die('REPÉRÉ PAR LE PROJECTEUR !'); }
        }
      }
      var cible = sp.phase === 'on' ? 0.62 : sp.phase === 'warn' ? 0.22 : 0;
      sp.k += (cible - sp.k) * Math.min(1, dt / 160);
      sp.gfx.clear();
      sp.xs.forEach(function (lx) {
        sp.gfx.fillStyle(0xffd21a, Math.min(1, sp.k * 0.95)).fillTriangle(lx, 14, lx - 56, H, lx + 56, H);            // faisceau d'un jaune uni, assez transparent pour qu'on voie le personnage
        sp.gfx.fillStyle(0x6a6a70, 1).fillRect(lx - 6, 6, 12, 8); sp.gfx.fillStyle(sp.phase === 'off' ? 0x8a8a90 : 0xffe04a, 1).fillRect(lx - 4, 12, 8, 3);
      });
      sp.nuit.setAlpha(sp.k * 0.3);
      p.setDepth(sp.k > 0.05 ? 33 : 20);   // le personnage passe devant le faisceau : on le voit toujours
      var txt = !actif ? '' : sp.phase === 'on' ? 'NE BOUGE PAS !' : sp.phase === 'warn' ? 'LE PROJECTEUR CHAUFFE…' : '';
      sp.lab.setText(txt).setAlpha(txt ? 1 : 0);
    }

    // ennemis
    this.patrols.forEach(function (e) {
      var sp = e.speed * self.f('enemy'), img = e.img;
      e.bob += dt;
      if (e.kind === 'araignee' || e.kind === 'statue') {
        var ax = p.x - img.x, proche = Math.abs(ax) < 170 && Math.abs(p.y - e.feet) < 50;
        var regard = ax > 0 ? p.flipX : !p.flipX;                                  // le joueur tourne la tête vers elle ?
        e.frozen = proche && (regard || Math.abs(ax) < 18);                          // tant qu'on la croise (à moins de 18 px), elle reste figée : pas de mort injuste
        if (proche && !regard) { img.x += Math.sign(ax) * sp * k; e.dir = ax > 0 ? 1 : -1; }
        img.x = Phaser.Math.Clamp(img.x, e.x0, e.x1);
        if (e.frozen) img.setTint(0x9fb0d0); else img.clearTint();               // figée : teinte de pierre
      } else if (e.kind === 'oiseau') {
        img.x += e.dir * sp * k;                                                                       // le héron va et vient, et plonge régulièrement à hauteur de tête
        if (img.x > e.x1) { img.x = e.x1; e.dir = -1; } else if (img.x < e.x0) { img.x = e.x0; e.dir = 1; }
        img.y = e.feet - 6 - 34 * (0.5 - 0.5 * Math.cos((self.t + e.bob) / 2800 * Math.PI * 2));
      } else if (e.kind === 'robot') {
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
      if (e.kind !== 'oiseau') img.y = e.feet - (e.kind === 'esprit' && !GP.reducedMotion ? 3 + Math.sin(e.bob / 400) * 3 : 0);
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
        if (f.img.y + f.h >= f.floor) { f.img.y = f.floor - f.h; f.state = 'land'; f.t = 0; GP.Sfx.play('step'); }
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

    // araignées suspendues : descente à 45 px/s si le joueur est proche et ne les regarde pas ; figées s'il les regarde ; remontée à 30 px/s sinon
    this.hangers.forEach(function (h) {
      var dxh = Math.abs(p.x - h.x), proche = dxh < 110, regard = h.x > p.x ? !p.flipX : p.flipX;
      h.frozen = proche && (regard || dxh < 12);
      if (proche && !regard) h.y = Math.min(h.yMax, h.y + 45 * self.f('enemy') * k);
      else if (!proche) h.y = Math.max(h.yMin, h.y - 30 * k);
      h.img.y = h.y; h.thread.setSize(1, h.y);
      if (h.frozen) h.img.setTint(0x9fb0d0); else h.img.clearTint();
    });

    // régimes de bananes : pendule (±26°), plus lent sous la pluie (corde mouillée)
    this.regimes.forEach(function (r) {
      var th = 0.46 * Math.sin((self.t + r.def.offset) / (r.def.period * self.f('regime')) * Math.PI * 2), x = r.px + r.len * Math.sin(th), y = r.py + r.len * Math.cos(th);
      r.img.setPosition(x, y).setRotation(-th * 0.6); r.rope.setTo(r.px, r.py, x, y); r.x = x; r.y = y;
    });

    // peaux de banane : glissade de 0,75 s dans le sens où l'on allait (1,3 fois plus longue sous la pluie)
    this.peaux.forEach(function (q) {
      q.cool -= dt;
      if (onGround && q.cool <= 0 && s.slideMs <= 0 && Math.abs(p.x - q.x) < 10 && !s.dying) {
        var dir = Math.sign(b.velocity.x) || (p.flipX ? -1 : 1);
        s.slideDir = dir; s.slideMs = 750 * self.f('peau'); q.cool = 1200; p.setFlipX(dir < 0); GP.Sfx.play('error');
      }
    });

    // plaques de verre du Mémorial : on s'approche, elles s'allument (et le restent) ; leur texte s'affiche tant qu'on est à côté
    var proche = null;   // une seule plaque parle à la fois : la plus proche (sinon les textes se superposent)
    this.plaques.forEach(function (q) { if (Math.abs(p.x - q.x) < 36 && (!proche || Math.abs(p.x - q.x) < Math.abs(p.x - proche.x))) proche = q; });
    this.plaques.forEach(function (q) {
      var near = q === proche;
      if (Math.abs(p.x - q.x) < 36 && !q.lit) { q.lit = true; q.img.setAlpha(1); if (q.halo) q.halo.setAlpha(0.7); GP.Sfx.play('step'); }
      q.txt.setAlpha(near ? 1 : 0);
    });

    // grue : va-et-vient sinusoïdal du conteneur (le joueur est transporté, comme sur un étal mobile)
    this.cranes.forEach(function (c) {
      var d = c.def, per = d.period / self.f('mover'), w = Math.PI * 2 / per * 1000, ph = (self.t + d.offset) / per * Math.PI * 2, kk = 0.5 - 0.5 * Math.cos(ph), v = 0.5 * Math.sin(ph) * w;
      var tx = c.x0 + d.dx * 16 * kk, ty = c.y0 + d.dy * 16 * kk;
      c.body.setVelocity(d.dx * 16 * v + (tx - c.body.x) * 3, d.dy * 16 * v + (ty - c.body.y) * 3);
      c.img.setPosition(c.body.x, c.body.y); c.trolley.x = c.body.x + c.cw / 2; c.cable.x = c.body.x + c.cw / 2; c.cable.setSize(2, Math.max(1, c.body.y - 8));
    });

    // Grand Éléphant : va-et-vient lent (il s'arrête à chaque rive), les plateformes de son dos transportent le joueur
    this.elephants.forEach(function (el) {
      var w = Math.PI * 2 / el.period * 1000, ph = self.t / el.period * Math.PI * 2, kk = 0.5 - 0.5 * Math.cos(ph), v = 0.5 * Math.sin(ph) * w;
      el.img.x = el.x0 + el.dx * kk;
      el.parts.forEach(function (q) { q.body.setVelocity(el.dx * v + (el.x0 + el.dx * kk + q.ox - q.body.x) * 3, 0); });
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

    // frise de dates : un bloc s'allume quand la tête le frappe par en dessous ou qu'on atterrit dessus ; dans l'ordre il reste doré, sinon tout s'éteint et on recommence
    this.frises.forEach(function (f) {
      if (f.open) return;
      f.blocs.forEach(function (q) {
        q.cool -= dt;
        var dessus = b.right > q.x + 2 && b.x < q.x + 14;
        var tete = dessus && b.top >= q.y + 8 && b.top <= q.y + 19 && b.bottom > q.y + 16;   // par la position (pas par les drapeaux de collision, qui peuvent manquer une image sur un écran rapide)
        var pied = dessus && (b.touching.down || b.blocked.down) && b.bottom <= q.y + 3 && b.bottom >= q.y - 3;
        if (!(tete || pied) || q.cool > 0 || q.lit) return;
        q.cool = 500;
        if (q.rang === f.next) {
          q.lit = true; f.next++; q.rect.setFillStyle(0xffe9a0); GP.Sfx.play('confirm');
          if (f.next >= f.blocs.length) { f.open = true; f.barrier.body.enable = false; s.tweens.add({ targets: f.gate, alpha: 0, duration: 600 }); s.toast("LA FRISE EST COMPLÈTE : LA PORTE S'OUVRE", GP.PAL.g); }
        } else {
          f.next = 0; GP.Sfx.play('error'); s.toast("PAS DANS L'ORDRE : RECOMMENCE LA FRISE", GP.PAL.o);
          f.blocs.forEach(function (o) { o.lit = false; o.rect.setFillStyle(0x8a8a84); });
          q.rect.setFillStyle(0xd06040); s.time.delayedCall(450, function () { q.rect.setFillStyle(0x8a8a84); });   // le bloc se trompe : il rougit un instant
        }
      });
    });

    // mémoire : la séquence apparaît près de la stèle, un point d'interrogation près de la porte
    this.memos.forEach(function (q) {
      if (!q.open && p.x > q.gx + 14) { q.open = true; q.barrier.body.enable = false; q.gate.setAlpha(0); }   // déjà de l'autre côté (reprise au point de contrôle) : la porte reste ouverte, on peut revenir lire la stèle
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
      if (e.kind === 'oiseau') { if (hit(e.img.x - 11, e.img.y - 16, 22, 11)) return 'UN HÉRON T\'A ATTRAPÉ !'; continue; }
      if (e.frozen) continue;                                                      // figée (le joueur la regarde) : sans danger, on peut la frôler
      var h = e.kind === 'robot' ? 11 : (e.kind === 'araignee' ? 10 : (e.kind === 'statue' ? Math.max(14, Math.round(e.img.displayHeight) - 4) : 14)), y = e.kind === 'esprit' ? e.img.y - 16 : e.feet - h;
      if (hit(e.img.x - (e.kind === 'araignee' ? 9 : (e.kind === 'statue' ? 7 : 5)), y, e.kind === 'araignee' ? 18 : (e.kind === 'statue' ? 14 : 10), h)) return e.kind === 'robot' ? 'UN ROBOT T\'A ATTRAPÉ !' : (e.kind === 'araignee' ? 'UNE ARAIGNÉE T\'A ATTRAPÉE !' : (e.kind === 'statue' ? 'UNE STATUE T\'A ATTRAPÉ !' : 'UN ESPRIT DE LA GARDE !'));
    }
    for (i = 0; i < this.hangers.length; i++) {
      e = this.hangers[i];
      if (!e.frozen && hit(e.x - 9, e.y - 10, 18, 10)) return 'UNE ARAIGNÉE T\'A ATTRAPÉE !';
    }
    for (i = 0; i < this.tides.length; i++) {
      e = this.tides[i];
      if (b.right > e.def.x0 * 16 && b.x < e.def.x1 * 16 && b.bottom > e.y + 5) return 'L\'EAU A MONTÉ ! GAGNE LA HAUTEUR';
    }
    for (i = 0; i < this.fallers.length; i++) {
      e = this.fallers[i];
      if (e.state === 'fall' && hit(e.x - e.w / 2, e.img.y, e.w, e.h)) return e.msg;
    }
    for (i = 0; i < this.regimes.length; i++) {
      e = this.regimes[i];
      if (hit(e.x - 10, e.y - 14, 20, 35)) return 'UN RÉGIME DE BANANES T\'A TOUCHÉ !';
    }
    for (i = 0; i < this.jets.length; i++) {
      e = this.jets[i];
      if (e.state === 'on' && hit(e.x - 5, e.floor - e.hh, 10, e.hh)) return 'UN JET ! ATTENDS LE SOUFFLE';
    }
    for (i = 0; i < this.beams.length; i++) {
      e = this.beams[i];
      if (hit(e.x - 4, 24, 8, H - 24)) return 'LA LUMIÈRE T\'A REPÉRÉ !';
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
