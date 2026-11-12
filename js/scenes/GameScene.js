/**
 * GameScene — moteur de plateforme réutilisable (physique Arcade). Reçoit { index } : le lieu de GP.LOCATIONS,
 * dont la définition de niveau est GP.LEVELS[loc.level] (js/data/levels.js).
 *
 * Commandes : < > ou Q/A et D courir · Espace, W ou Z sauter (maintenir = plus haut) · ↑ grimper / se hisser
 *             · ↓ ou S s'accroupir / descendre · Échap pause. Tactile : joystick et bouton de saut à l'écran (GP.UI.touchPad).
 * Mode test (?dev=1) : N météo simulée (W sert au saut), K tout ramasser.
 *
 * Règles : ramasser tous les pixels reconstruit l'image ; si L.exit existe, rejoindre aussi l'arche. Ronce, pointes, flèche, goutte,
 * tonneau ou chute = une mort : +1 au compteur MORTS et retour à la dernière lanterne (pixels gardés).
 * Capacités introduites une par niveau (L.abilities) : s'accroupir (Château), s'accrocher aux rebords et grimper
 * aux colonnes (Cathédrale), plateformes mobiles (Bouffay).
 * Météo réelle → environnement (GP.WeatherRules) : sol qui glisse, vent qui pousse les sauts, pixels visibles
 * de près dans la brume, et réactions propres au niveau. Toujours annoncé, toujours finissable.
 *
 * Profondeurs : ciel -40 à -30 · serre -5 · bâtiments 1 · arbres 2 · décor 3-4 · terrain 5 · pièges 6
 *               lanternes, panneaux 7 · pixels 8 · plateformes 9 · joueur 20 · météo 30-34 · HUD 50+ · fenêtres 100+
 */
GP.Scenes.Game = class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'Game', physics: { arcade: { gravity: { y: GP.Tuning.worldGravity } } } }); }

  init(data) {
    this.restarting = false;
    this.index = (data && data.index) || 0;
    this.secret = !!(data && data.secret);   // niveau secret « La Ligne Verte » : lieu à part, hors de la liste des 12 étapes
    this.loc = this.secret ? GP.SECRET_LOCATION : GP.LOCATIONS[this.index];
    this.L = GP.LEVELS[this.loc.level];
    this.leaving = false;
    this.bot = null;   // robot de test (tools/bot.js), jamais actif en jeu normal
  }

  create() {
    var self = this, L = this.L, T = 16;
    this.pauseMenu = null; this.help = null; this.toastObj = null; this.upLock = false;
    this.checkpointIndex = -1; this.saveMs = 0;
    this.W = L.width * T; this.H = L.rows * T;
    this.ab = L.abilities || {};
    this.TUNE = Object.assign({}, GP.Tuning.player);
    this.shelter = { rain: 0, snow: 0, wind: 0, id: null };
    this.surfaceMotion = 0;
    this.phy = { accelGround: this.TUNE.accelGround, accelAir: this.TUNE.accelAir, airPush: 0, sight: 0 };
    this.env = GP.WeatherRules.env(null);
    this.deaths = 0; this.time_ms = 0; this.paused = false; this.finished = false; this.invuln = 0;
    this.introMs = 1700;   // bandeau d'introduction : le joueur attend, le chrono ne tourne pas encore
    this.slideMs = 0; this.slideDir = 1; this.dying = false; this.crouching = false; this.climbing = null; this.hanging = null;
    this.coyote = 0; this.buffer = 0; this.jumping = false; this.lastVy = 0; this.hangReleased = false; this.boost = 0;
    this.maxTime = (L.maxTime || 180) * 1000; this.timeWarned = false; this.timedOut = false;   // limite douce : 3 min par défaut, plus pour les niveaux qui en demandent
    this.alive = true;
    this.events.once('shutdown', function () { self.alive = false; });

    this.cameras.main.fadeIn(350, 20, 24, 46);
    this.cameras.main.setBounds(0, 0, this.W, L.rows === 17 ? GP.Config.HEIGHT : Math.max(this.H, GP.Config.HEIGHT));

    this.makeBackground();
    this.makeTerrain();
    this.makeObjects();
    this.makePlayer();
    this.makeMechanics();
    this.makeStructures();
    this.makeSilhouettes();   // après les structures : les niveaux générés (GZone) n'ont leur sol qu'à ce moment
    this.makeHud();
    GP.UI.soundIcon(this, GP.Config.WIDTH - 26, 46, 60);   // pictogramme du son, sous la météo
    this.makeWeather();
    this.makeInput();
    this.makeTouch();
    this.restoreRun();
    this.updateShelter(0, true);   // recalcul à partir du point sûr, jamais un état ancien sérialisé
    if (!this.secret) GP.Progression.setCurrent(this.index);   // le niveau secret ne change pas la position du héros sur la carte
    var saveRun = function () { if (!self.finished) self.saveRun(); };
    window.addEventListener('pagehide', saveRun);
    window.addEventListener('blur', saveRun);
    this.events.once('shutdown', function () {
      window.removeEventListener('pagehide', saveRun); window.removeEventListener('blur', saveRun);
    });
    this.showIntro();
    if (this.pc.done() && !L.exit) this.finish();
    this.updateExit();
  }

  /** Reprise au dernier point sûr ; les pixels restent acquis, même après un refresh. */
  saveRun() {
    if (this.restarting || this.secret) return;   // le niveau secret ne se sauvegarde pas ; « rejouer le niveau » : la sauvegarde a été effacée, on ne la recrée pas
    GP.Progression.data.runs[this.loc.id] = { signature: GP.Save.runSignature(this.L),
      taken: this.pixels.reduce(function (a, p, i) { if (p.taken) a.push(i); return a; }, []),
      checkpoint: this.checkpointIndex, time: this.time_ms, deaths: this.deaths };
    if (this.gz && this.gz.boss) GP.Progression.data.runs[this.loc.id].boss = this.gz.boss.snapshot();
    GP.Progression.persist();
  }

  restoreRun() {
    if (this.secret) return;
    var r = GP.Progression.data.runs[this.loc.id], self = this;
    if (!r || r.signature !== GP.Save.runSignature(this.L)) return;
    r.taken.forEach(function (i) { var p = self.pixels[i]; if (p && !p.taken) { p.taken = true; p.img.destroy(); self.pc.reveal(); } });
    this.time_ms = r.time; this.deaths = r.deaths;
    this.checkpointIndex = r.checkpoint;
    this.lanterns.forEach(function (l, i) { if (i <= r.checkpoint) { l.lit = true; l.img.setTexture(self.key('commun_lanterne_allumee', 'lv_lantern_on')); } });
    var l = this.lanterns[r.checkpoint];
    if (l) this.respawn = { x: l.x, y: l.y };
    this.player.body.reset(this.respawn.x, this.respawn.y);
    if (this.gz && this.gz.boss) this.gz.boss.restore(r.boss);
    this.updateHud();
  }

  // ---------- Décor ----------
  makeBackground() {
    var L = this.L;
    this.sky = GP.LevelArt.sky(this, -40, L.sky || {});
    var self = this;
    (L.rooms || []).forEach(function (r) { self.add.image(r.x * 16, 0, r.key).setOrigin(0, 0).setDepth(-20); });   // salles intérieures : fond de pierre devant le ciel
    this.gzPlan = L.gzone ? GP.GZoneRuntime.plan(L) : null;
    if (L.gzone) GP.GZoneArt.build(this, L, this.gzPlan);
    this.architecture = L.architecture === 'chateau' ? GP.CastleArt.build(this, L) : null;
    var prev = null;   // bandeaux : grandes images posées dans le décor, à la suite les unes des autres (titre du Mémorial)
    (L.bandeaux || []).forEach(function (bd) { var im = this.add.image(bd.suit && prev ? prev.x + prev.width : bd.x * 16, bd.y * 16, bd.key).setOrigin(0, 0.5).setDepth(-5); prev = im; }, this);
    if (L.backdrop) {
      var bx = L.backdrop.x * 16, top = L.top(L.backdrop.x) * 16, img = this.add.image(bx, top + 2, L.backdrop.key).setOrigin(0.5, 1).setScale(L.backdrop.scale).setDepth(-5);
      if (L.backdrop.tint !== false) img.setTintFill(0x2b3a55).setAlpha(0.55);
    }
  }

  /** Silhouettes posées sur le sol réel de la colonne x (cherché dans le terrain) : L.silhouettes = [{ x, key, depth }] (sculptures en silhouette du Jardin des Plantes : lv_sil_*). */
  makeSilhouettes() {
    var L = this.L, self = this;
    (L.silhouettes || []).forEach(function (sl) {
      var x = sl.x, row = 17;
      for (; x > 0 && row >= 17; x--) for (var r = 0; r < 17; r++) if (self.solidAt(x * 16 + 8, r * 16 + 8)) { row = r; break; }
      if (row >= 17 || !self.textures.exists(sl.key)) return;
      self.add.image((x + 1) * 16 + 8, row * 16 + 1, sl.key).setOrigin(0.5, 1).setDepth(sl.depth === undefined ? 3 : sl.depth);
    });
  }

  makeTerrain() {
    var L = this.L, data = [];
    var self = this;
    (L.gzone ? [] : GP.LevelArt.renderTerrain(this, 'lv_terrain', L)).forEach(function (k, i) {   // morceaux de 2048 px (limite des textures sur téléphone)
      self.add.image(i * GP.LevelArt.CHUNK, 0, k).setOrigin(0).setDepth(5);
    });
    // carte de collision : 1 terre, 2 pierre, 3 sens unique, 4 topiaire, 5 pavés (tuiles invisibles)
    for (var y = 0; y < L.rows; y++) {
      var row = [];
      for (var x = 0; x < L.width; x++) { var v = L.grid[y * L.width + x]; row.push(v ? v - 1 : -1); }
      data.push(row);
    }
    var map = this.make.tilemap({ data: data, tileWidth: 16, tileHeight: 16 });
    var ts = map.addTilesetImage('lv_tileset');
    this.layer = map.createLayer(0, ts, 0, 0).setVisible(false);
    this.layer.setCollision([0, 1, 3, 4]);
    this.layer.forEachTile(function (t) { if (t.index === 2) t.setCollision(false, false, true, false); });
  }

  /** Vrai si la case du monde (x, y en px) est pleine (sol, pierre…), sens unique exclu. */
  solidAt(x, y) {
    if (this.gz) return this.gz.solidAt(x, y);
    var t = this.layer.getTileAtWorldXY(x, y);
    return !!(t && t.index >= 0 && t.index !== 2);
  }

  /** Sprite de planche s'il existe, sinon texture de secours. */
  key(spriteId, fallback) { return this.textures.exists(spriteId) ? spriteId : fallback; }

  makeObjects() {
    var self = this, L = this.L, S = GP.Sprites;
    L.deco.forEach(function (d) {
      var img = S.has(d.key) && S.info(d.key).frames > 1 ? S.add(self, 0, 0, d.key) : self.add.image(0, 0, d.key);
      img.setPosition(d.x * 16 + 8 + d.dx, (d.y + 1) * 16 + 1 + (d.dy || 0)).setOrigin(0.5, 1).setDepth(d.depth !== undefined ? d.depth : (d.back ? 2 : 4));
      if (d.key === 'lv_fountain') {
        // jet d'eau : il monte et redescend doucement (fixe si mouvement réduit)
        var jet = self.add.image(img.x, img.y - 14, 'lv_jet').setOrigin(0.5, 1).setDepth(img.depth - 0.5);
        if (!GP.reducedMotion) self.tweens.add({ targets: jet, scaleY: 0.8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    });
    if (L.supports) L.plats.forEach(function (p) {                      // chaque corniche repose sur deux piliers de pierre (rien ne flotte dans le vide)
      [p.x * 16 + 1, (p.x + p.w) * 16 - 7].forEach(function (px) {
        var floor = Math.min(self.H, L.top(Math.floor((px + 3) / 16)) * 16), y0 = (p.y + 1) * 16 - 4;
        if (floor <= y0) return;
        self.add.rectangle(px, y0, 6, floor - y0, 0x5f5a4b, 1).setOrigin(0, 0).setDepth(3);
        self.add.rectangle(px + 1, y0, 4, floor - y0, 0xcfc7b2, 1).setOrigin(0, 0).setDepth(3);
        self.add.rectangle(px + 1, y0, 1, floor - y0, 0xeee6d0, 1).setOrigin(0, 0).setDepth(3);
      });
    });
    var thornKey = L.thornKey || 'lv_thorn';
    this.thorns = L.thorns.map(function (t) {
      self.add.image(t.x * 16 + 8, (t.y + 1) * 16, thornKey).setOrigin(0.5, 1).setDepth(6);
      return { x: t.x * 16 + 2, y: t.y * 16 + 8, w: 12, h: 8 };    // zone de contact réduite
    });
    var lanOff = this.key('commun_lanterne_eteinte', 'lv_lantern_off');
    this.lanterns = L.checks.map(function (c) {
      var img = self.add.sprite(c.x * 16 + 8, (c.y + 1) * 16, lanOff).setOrigin(0.5, 1).setDepth(7);   // sprite : animée une fois allumée
      return { x: c.x * 16 + 8, y: (c.y + 1) * 16, img: img, lit: false };
    });
    var signKey = this.key('commun_panneau', 'lv_sign');
    this.signs = L.hints.map(function (h) {
      self.add.image(h.x * 16 + 8, (h.y + 1) * 16, signKey).setOrigin(0.5, 1).setDepth(7);
      var t = GP.UI.txt(self, h.x * 16 + 8, h.y * 16 - 4, '', GP.PAL.w, { backgroundColor: GP.PAL.d, padding: { x: 6, y: 5 }, lineSpacing: 5, align: 'center', wordWrap: { width: Math.min(300, GP.Config.WIDTH - 24) } })   // lignes aérées : les panneaux longs restent lisibles
        .setOrigin(0.5, 1).setDepth(40).setAlpha(0);
      GP.Prompts.bind(self, t, ' ' + h.text + ' ');
      return { x: h.x * 16 + 8, top: h.y * 16 - 4, low: (h.y + 1) * 16 + 4, text: t, shown: false };
    });
    this.pixels = L.pixels.map(function (p) {
      var img = S.has('commun_pixel') ? S.add(self, p.x * 16 + 8, p.y * 16 + 8, 'commun_pixel') : self.add.image(p.x * 16 + 8, p.y * 16 + 8, 'lv_pixel');
      img.setOrigin(0.5).setDepth(8);
      if (!GP.reducedMotion) self.tweens.add({ targets: img, y: img.y - 2, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: (p.x * 70) % 500 });
      return { x: p.x * 16 + 8, y: p.y * 16 + 8, img: img, taken: false };
    });
    this.pc = new GP.PixelCollection(this, this.loc.id, this.pixels.length, L.reveal);
  }

  makePlayer() {
    var L = this.L;
    this.respawn = { x: L.startX * 16 + 8, y: (L.startRow + 1) * 16 };
    var p = this.player = this.physics.add.sprite(this.respawn.x, this.respawn.y, 'hero_idle').setOrigin(0.5, 1).setDepth(20);
    p.body.setSize(8, 16).setOffset(4, 3);
    p.body.setMaxVelocity(400, this.TUNE.maxFall);
    p.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, -200, this.W, this.H + 400);
    this.physics.world.setBoundsCollision(true, true, false, false);
    this.physics.add.collider(p, this.layer);
    p.play('hero-idle');
    this.cameras.main.startFollow(p, true, 0.12, 0.12, 0, 30);
  }

  // ---------- Mécaniques ----------
  /** Corps immobile servant de plateforme (sens unique si oneWay). */
  platformBody(img, oneWay) {
    this.physics.add.existing(img);
    var b = img.body;
    b.setAllowGravity(false); b.setImmovable(true); b.moves = false;
    if (oneWay) { b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false; }
    this.physics.add.collider(this.player, img);
    return b;
  }

  /** Image composée d'une rangée de tuiles g / m / d (rebords, étals). */
  rowTexture(key, set, w) {
    var src = set.map(function (k) { return this.textures.exists(k) ? this.textures.get(k).getSourceImage() : null; }, this);
    var h = src[1] ? src[1].height : 8, o = GP.PixelArt.canvas(w * 16, h);
    for (var j = 0; j < w; j++) { var im = src[j === 0 ? 0 : (j === w - 1 ? 2 : 1)]; if (im) o.ctx.drawImage(im, j * 16, 0); }
    GP.PixelArt.toTexture(this, key, o.cv);
    return key;
  }

  makeMechanics() {
    var self = this, L = this.L, S = GP.Sprites, sk = L.skin || {};
    var ledge = sk.ledge || ['commun_rebord_herbe_g', 'commun_rebord_herbe_m', 'commun_rebord_herbe_d'];

    // colonnes à escalader
    this.climbZones = L.climbs.map(function (c) {
      for (var r = c.top; r <= c.bottom; r++) self.add.image(c.x * 16, r * 16, self.key('cathedrale_colonne_fut', 'lv_tileset')).setOrigin(0).setDepth(4);
      if (S.has('cathedrale_colonne_chapiteau')) self.add.image(c.x * 16 + 8, c.top * 16, 'cathedrale_colonne_chapiteau').setOrigin(0.5, 1).setDepth(4);
      return { x0: c.x * 16 + 1, x1: c.x * 16 + 15, y0: c.top * 16 - 4, y1: (c.bottom + 1) * 16, cx: c.x * 16 + 8 };
    });

    // rebords qui s'effritent
    this.crumbles = L.crumbles.map(function (c, i) {
      var img = self.add.image(c.x * 16, c.y * 16, self.rowTexture('lv_crumble_' + i, ledge, c.w)).setOrigin(0).setDepth(9);
      var b = self.platformBody(img, true);
      return { img: img, body: b, x: img.x, timer: 0, state: 'solid' };
    });

    // plateformes mobiles (étals)
    var mset = sk.mover || ['bouffay_etal_marche_g', 'bouffay_etal_marche_m', 'bouffay_etal_marche_d'];
    this.movers = L.movers.map(function (m, i) {
      var img = self.add.image(m.x * 16, m.y * 16, self.rowTexture('lv_mover_' + i, mset, m.w)).setOrigin(0).setDepth(9);
      self.physics.add.existing(img);
      var b = img.body;
      b.setAllowGravity(false); b.setImmovable(true);
      b.checkCollision.down = false; b.checkCollision.left = false; b.checkCollision.right = false;
      self.physics.add.collider(self.player, img);
      return { img: img, body: b, x0: img.x, y0: img.y, dx: m.dx * 16, dy: m.dy * 16, period: m.period, phase: i * 0.7 };
    });

    // herses : bloquent le passage quand elles sont baissées (elles ne blessent pas)
    this.gates = L.gates.map(function (g, i) {
      // La herse fait toute la largeur du passage (4 tuiles) : le sprite de 2 tuiles est répété deux fois.
      var gk = self.key('chateau_herse', 'lv_tileset');
      if (self.textures.exists(gk) && !self.textures.exists('lv_herse_large')) {
        var src = self.textures.get(gk).getSourceImage(), o = GP.PixelArt.canvas(src.width * 2, src.height);
        o.ctx.drawImage(src, 0, 0); o.ctx.drawImage(src, src.width, 0); GP.PixelArt.toTexture(self, 'lv_herse_large', o.cv);
      }
      var floor = (g.y + 1) * 16, img = self.add.image(g.x * 16, floor, self.textures.exists('lv_herse_large') ? 'lv_herse_large' : gk).setOrigin(0.5, 1).setDepth(4);   // derrière le mur : elle y remonte
      var b = self.platformBody(img, false);
      return { img: img, body: b, floor: floor, open: g.open, closed: g.closed, t: i * 700, down: true };
    });

    // tonneaux qui roulent
    this.barrels = L.barrels.map(function (r) {
      var img = S.has('bouffay_tonneau_roulant') ? S.add(self, r.x0 * 16 + 8, (r.y + 1) * 16, 'bouffay_tonneau_roulant') : self.add.image(r.x0 * 16 + 8, (r.y + 1) * 16, 'lv_rock');
      img.setOrigin(0.5, 1).setDepth(9);
      return { img: img, x0: r.x0 * 16 + 8, x1: r.x1 * 16 + 8, dir: 1, speed: r.speed };
    });

    // meurtrières (flèches à hauteur de tête) et gargouilles (gouttes)
    this.arrows = [];
    this.slits = L.slits.map(function (s) {
      var img = self.add.image(s.x * 16 + 8, (s.y + 1) * 16 - 8, self.key('chateau_meurtriere', 'lv_arrow')).setDepth(6);
      return { img: img, x: s.x * 16 + 8, feet: (s.y + 1) * 16, dir: s.dir, period: s.period, t: -s.offset, life: s.range * 16 / 130 * 1000 };
    });
    this.drops = [];
    this.gargoyles = L.gargoyles.map(function (g, i) {
      var gk = L.gargoyleKey || 'cathedrale_gargouille', img = self.add.image(g.x * 16 + 8, g.y * 16 + 16, self.key(gk, 'lv_rock')).setOrigin(0.5, 1).setDepth(6);
      return { img: img, x: g.x * 16 + 8 + (L.gargoyleKey ? 0 : (img.flipX ? -6 : 6)), y: g.y * 16 + 14, period: g.period, t: -i * 500, warned: false };
    });

    // réactions à la météo (créées maintenant, activées selon la météo)
    var rk = L.thornKey || 'lv_thorn';
    this.rainThorns = L.rainThorns.map(function (t) {
      var img = self.add.image(t.x * 16 + 8, (t.y + 1) * 16, rk).setOrigin(0.5, 1).setDepth(6).setScale(1, 0).setVisible(false);
      return { img: img, box: { x: t.x * 16 + 2, y: t.y * 16 + 8, w: 12, h: 8 }, active: false };
    });
    this.sunPlats = L.sunPlats.map(function (p) {
      var img = self.add.image(p.x * 16, p.y * 16, 'lv_flowerplat').setOrigin(0).setDepth(9).setScale(p.w, 1).setVisible(false);
      var b = self.platformBody(img, true); b.enable = false;
      return { img: img, body: b };
    });
    if (L.railing) for (var rx = 0; rx < L.width; rx++) { var rt = L.top(rx); if (rt >= 13 && rt < 17) this.add.image(rx * 16, rt * 16 - 16, 'lv_gardecorps').setOrigin(0).setDepth(3); }   // garde-corps du quai, en décor
    this.dangers = new GP.Dangers(this);   // esprits, eau qui monte, conteneurs, jets, projecteurs, anneaux, pourriture…
  }

  /** Ouvrages optionnels. Les niveaux 1/2 n'en définissent aucun : leur flux ne change pas. */
  makeStructures() {
    var self = this, L = this.L, sk = L.skin || {};
    this.gz = L.gzone ? new GP.GZoneRuntime(this) : null;
    this.bridges = (L.bridges || []).map(function (def, i) {
      var bridge = Object.assign({ clock: 0, angle: 0, lowered: true }, def);
      var key = self.rowTexture('lv_drawbridge_' + i, sk.bridge, def.w);
      // 2 px de recouvrement vertical évitent l'accrochage au flanc de la rive : le collider
      // Tilemap est résolu avant ce corps indépendant, notamment à faible vitesse sur la neige.
      bridge.surfaceY = def.y * 16 - 2;
      bridge.img = self.add.image(def.x * 16, bridge.surfaceY, key).setOrigin(0).setDepth(9);
      // Corps séparé du tablier pivotant : sa rotation ne déforme pas une AABB praticable.
      bridge.support = self.add.zone(def.x * 16, bridge.surfaceY, def.w * 16, 6).setOrigin(0);
      bridge.body = self.platformBody(bridge.support, true);
      bridge.chain = self.add.graphics().setDepth(10);
      return bridge;
    });
    this.water = (L.water || []).map(function (w) {
      var g = self.add.graphics().setDepth(6), x = w.x * 16, y = w.y * 16;
      g.fillStyle(GP.int(GP.PAL.n)); g.fillRect(x, y, w.w * 16, w.h * 16);
      g.fillStyle(GP.int(GP.PAL.b)); g.fillRect(x, y, w.w * 16, 5);
      for (var dx = 2; dx < w.w * 16 - 4; dx += 12) { g.fillStyle(GP.int(GP.PAL.l)); g.fillRect(x + dx, y + 1, 6, 1); }
      return { x: x, y: y + 3, w: w.w * 16, h: w.h * 16 - 3 };
    });
    this.exit = null;
    if (L.exit) {
      var e = L.exit, img = this.add.image(e.x * 16 + 8, e.y * 16, e.key).setOrigin(0.5, 1).setDepth(7);
      var label = GP.UI.txt(this, img.x + 16, img.y - 56, '', GP.PAL.c, {
        align: 'left', lineSpacing: 5, backgroundColor: GP.PAL.k, padding: { x: 6, y: 5 }, wordWrap: { width: 190 }   // lignes alignées à gauche dans un cadre ancré à droite de l'arche : lisible
      }).setOrigin(1, 1).setDepth(40);
      // Flèche qui rebondit au-dessus de l'arche quand l'image est complète (à la place d'un texte).
      var arrow = this.add.graphics().setDepth(41).setVisible(false), ay = img.y - img.height - 6;
      arrow.fillStyle(GP.int(GP.PAL.k)); arrow.fillRect(-5, -10, 10, 7); arrow.fillTriangle(-9, -4, 9, -4, 0, 5);
      arrow.fillStyle(GP.int(GP.PAL.g)); arrow.fillRect(-3, -9, 6, 5); arrow.fillTriangle(-7, -5, 7, -5, 0, 2);
      arrow.setPosition(img.x, ay);
      if (!GP.reducedMotion) this.tweens.add({ targets: arrow, y: ay + 4, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.exit = { img: img, label: label, arrow: arrow, count: -1, x: img.x - 12, y: img.y - 32, w: 24, h: 34 };
    }
  }

  atExit() {
    if (!this.exit || !this.player) return false;
    var b = this.player.body, e = this.exit;
    return b.right > e.x && b.x < e.x + e.w && b.bottom > e.y && b.y < e.y + e.h;
  }

  updateExit() {
    var e = this.exit;
    if (!e) return;
    var bossDone = !this.gz || !this.gz.boss || this.gz.boss.done;
    var complete = this.pc.done() && bossDone;
    if (e.count !== this.pc.count || e.bossDone !== bossDone) {
      e.count = this.pc.count;
      e.bossDone = bossDone;
      var missing = this.pixels.find(function (p) { return !p.taken; });
      var zone = missing && (this.L.zones || []).find(function (z) { return missing.x >= z.x * 16 && missing.x < z.end * 16; });
      e.label.setText(!bossDone ? 'TERMINE L’ÉPREUVE DU BOSS' : complete ? '' :
        'IL MANQUE ' + (this.pc.total - this.pc.count) + ' PIXELS' + (zone ? '\nÀ CHERCHER : ' + zone.name : ''));
      e.img.setTint(complete ? GP.int(GP.PAL.g) : GP.int(GP.PAL.m));
    }
    e.label.setVisible(!complete && Math.abs(this.player.x - e.img.x) < 160);
    if (e.arrow) e.arrow.setVisible(complete);
  }

  // ---------- Interface ----------
  makeHud() {
    var P = GP.PAL, D = 50;
    function fix(o, d) { return o.setScrollFactor(0).setDepth(d || D); }
    var g = fix(this.add.graphics());
    g.fillStyle(GP.int(P.k), 1); g.fillRect(4, 4, 186, 48);
    g.fillStyle(GP.int(P.d), 1); g.fillRect(6, 6, 182, 44);
    g.fillStyle(GP.int(P.k), 1); g.fillRect(8, 8, 52, 36);
    // image à reconstruire, agrandie (photo 48×32 ×2, ou monument de la planche)
    var tex = this.textures.get(this.pc.key).getSourceImage();
    this.hudImg = fix(this.add.image(34, 26, this.pc.key).setScale(Math.min(1, 48 / tex.width, 32 / tex.height)), D + 1);
    this.hudPix = fix(GP.UI.txt(this, 68, 10, '', P.y), D + 1);
    this.hudTime = fix(GP.UI.txt(this, 68, 23, '', P.w), D + 1);
    this.hudDeaths = fix(GP.UI.txt(this, 68, 36, '', P.m), D + 1);
    var self = this;
    // Bouton PAUSE : seulement sur écran tactile. Au clavier c'est Échap, à la manette Start (pas de bouton à l'écran).
    this.pauseButton = null;
    if (GP.UI.isTouch()) {
      this.pauseButton = GP.UI.button(this, GP.Config.WIDTH - 66, 4, 62, 'PAUSE', function () { self.onEsc(); }, { height: 28 });
      this.pauseButton.objs.forEach(function (o) { o.setDepth(D + 1); });
    }
    this.shelterLabel = fix(GP.UI.txt(this, 8, 58, '', P.c, { backgroundColor: P.k, padding: { x: 3, y: 3 }, wordWrap: { width: 184 } }), D + 1).setAlpha(0);
    this.updateHud();
  }

  /** Bandeau d'entrée : l'étape, puis ce que la météo de Nantes change aujourd'hui. */
  showIntro() {
    var self = this, P = GP.PAL, UI = GP.UI, lines = GP.WeatherRules.announce(this.env, this.L);
    var head = this.secret ? 'NIVEAU SECRET' : 'ÉTAPE ' + String(this.index + 1).padStart(2, '0') + ' / 12';
    this.introMs = lines.length > 1 ? 2600 : 1900;
    var maxW = Math.min(400, GP.Config.WIDTH - 32);
    var title = UI.txt(this, 0, 0, head, P.g, { fontSize: '12px' }).setOrigin(0.5, 0);
    var name = UI.txt(this, 0, 0, this.loc.name.toUpperCase(), P.w, { align: 'center', wordWrap: { width: maxW - 24 } }).setOrigin(0.5, 0);
    var weather = UI.txt(this, 0, 0, lines.map(GP.t).join(' · '), P.c, { align: 'center', lineSpacing: 3, wordWrap: { width: maxW - 24 } }).setOrigin(0.5, 0);
    var w = Math.min(maxW, Math.max(180, title.width + 24, name.width + 24, weather.width + 24));
    var h = title.height + name.height + weather.height + 38, cx = GP.Config.WIDTH / 2, cy = GP.Config.HEIGHT / 2, top = cy - h / 2;
    var bg = this.add.rectangle(cx, cy, w, h, GP.int(P.k), 0.94).setStrokeStyle(1, GP.int(P.G));
    title.setPosition(cx, top + 10); name.setPosition(cx, title.y + title.height + 6); weather.setPosition(cx, name.y + name.height + 8);
    var objects = [bg, title, name, weather];
    this.introCard = { x: cx, y: cy, width: w, height: h, objects: objects };
    objects.forEach(function (o) {
      o.setScrollFactor(0).setDepth(o === bg ? 80 : 81).setAlpha(0);
      self.tweens.add({ targets: o, alpha: 1, duration: GP.reducedMotion ? 1 : 180 });
      self.tweens.add({ targets: o, alpha: 0, delay: self.introMs - 300, duration: 300, onComplete: function () { o.destroy(); } });
    });
  }

  updateHud() {
    var s = Math.floor(this.time_ms / 1000);
    this.hudPix.setText('PIXELS ' + this.pc.count + '/' + this.pc.total);
    this.hudTime.setText('TEMPS ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'));
    this.hudDeaths.setText('MORTS ' + this.deaths);
  }

  toast(msg, color) {
    if (this.toastObj) this.toastObj.destroy();
    var t = GP.UI.txt(this, GP.Config.WIDTH / 2, 92, ' ' + msg + ' ', color || GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 2, y: 3 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(60);
    this.toastObj = t;
    this.tweens.add({ targets: t, alpha: 0, delay: 2200, duration: 400, onComplete: function () { t.destroy(); } });
  }

  // ---------- Météo ----------
  makeWeather() {
    var self = this;
    this.wx = GP.WeatherFX.apply(this, {
      depth: 30, fixed: true, noShadows: true,
      rainDepth: 4.5,  // les murs/linteaux solides masquent eux-mêmes les précipitations
      exposureAt: function (x, y, snow) {
        return GP.WeatherShelters.exposure(self.L.shelters, x + self.cameras.main.scrollX, y + self.cameras.main.scrollY, snow);
      },
      lights: this.lanterns.map(function (l) { return [l.x, l.y - 17, 0.8]; })
    });
    // La météo laisse la place du bouton PAUSE sur tactile ; sinon elle s'aligne sur le bord droit.
    this.wxWidget = GP.WeatherFX.widget(this, GP.Config.WIDTH - (GP.UI.isTouch() ? 72 : 4), 4, 50, { right: true });
    this.applyWeather(GP.Weather.get(), true);
    GP.Weather.load(function (s) { if (self.alive) self.applyWeather(s); });
    // météo en direct : la scène suit les mises à jour (toutes les 5 min, ou retour du réseau)
    var unsub = GP.Weather.subscribe(function (s) { if (self.alive) self.applyWeather(s); });
    this.events.once('shutdown', unsub);
  }

  /** De nuit, le voile sombre passe devant le décor : pixels et anneaux (néon) passent devant lui pour rester lisibles. */
  setNuit(nuit) {
    if (!this.L.nightFond) return;
    var d = nuit ? 31 : 8;
    this.pixels.forEach(function (px) { px.img.setDepth(d); });
    (this.dangers ? this.dangers.rings : []).forEach(function (r) {
      r.img.setDepth(d);
      if (r.halo) r.halo.setDepth(nuit ? 30.5 : 7).setAlpha(nuit ? 0.7 : 0.35);
    });
  }

  /**
   * La météo de Nantes change l'environnement : ciel, pluie, lumière (WeatherFX), puis les règles de jeu
   * (GP.WeatherRules) et les réactions du niveau. Si elle change en cours de partie, on l'annonce.
   */
  applyWeather(st, first) {
    var self = this, prev = this.env.key;
    this.weather = st;
    this.sky.set(st);
    this.wx.set(st); this.wxWidget.set(st);
    this.setNuit(!st.isDay);
    this.env = GP.WeatherRules.env(st);
    if (this.L.noWind) { this.env.wind = 0; this.env.windSign = 0; if (this.env.key === 'vent') this.env.key = this.env.night ? 'nuit' : 'nuages'; }            // niveau sans vent (retour de l'équipe)
    if (this.architecture) this.architecture.flags.forEach(function (flag) {
      // Inclinaison bornée, fixe en mouvement réduit. Le repère indique aussi un vent gauche.
      flag.setFlipX(self.env.windSign < 0).setAngle(GP.reducedMotion ? 0 : -self.env.windSign * Math.min(20, self.env.wind / 3));
    });
    this.phy = GP.WeatherRules.physics(this.env, this.TUNE, this.shelter);
    // ronces de pluie : elles poussent (1,2 s, visibles) avant de devenir dangereuses
    this.rainThorns.forEach(function (t) {
      var rain = self.env.rain && self.coverAt(t.box.x + 6, t.box.y + 4).rain < 1;
      if (t.wantRain === rain) return;
      t.wantRain = rain;
      self.tweens.killTweensOf(t.img); t.active = false;
      if (rain) {
        t.img.setVisible(true);
        self.tweens.add({ targets: t.img, scaleY: 1, duration: first ? 1 : 1200, onComplete: function () { t.active = t.wantRain; } });
      } else if (t.img.visible) { self.tweens.add({ targets: t.img, scaleY: 0, duration: 600, onComplete: function () { t.img.setVisible(false); } }); }
    });
    // fleurs-plateformes au soleil (raccourcis, jamais indispensables)
    this.sunPlats.forEach(function (p) { p.img.setVisible(self.env.sun); p.body.enable = self.env.sun; });
    if (!first && prev !== this.env.key) this.toast(GP.WeatherRules.announce(this.env, this.L).slice(0, 2).join(' · '));
  }

  coverAt(x, y) { return GP.WeatherShelters.at(this.L.shelters, x, y); }

  updateShelter(delta, instant) {
    if (!this.player) return;
    var b = this.player.body, x = b.x + b.width / 2;
    var floor = this.coverAt(x, b.bottom - 1), air = this.coverAt(x, b.y + b.height / 2);
    var target = { rain: floor.rain, snow: floor.snow, wind: air.wind, id: floor.id || air.id };
    var previous = this.shelter.id;
    this.shelter = GP.WeatherShelters.approach(this.shelter, target, Math.min(delta, GP.Tuning.shelter.maxDeltaMs), instant);
    this.phy = GP.WeatherRules.physics(this.env, this.TUNE, this.shelter);
    if (this.shelterLabel) {
      this.shelterLabel.setText(target.rain >= 1 ? 'ABRI · AU SEC' : 'ABRI · PROTECTION PARTIELLE');
      this.shelterLabel.setAlpha(Math.max(this.shelter.rain, this.shelter.snow, this.shelter.wind) * 0.9);
    }
    if (previous !== target.id) this.events.emit('playtest-event', { type: 'shelter', id: target.id });
  }

  // ---------- Entrées ----------
  makeInput() {
    var self = this, kb = this.input.keyboard;
    this.ctl = GP.Controls.attach(this);   // clavier (touches réaffectables), tactile et manette
    this.touch = { left: false, right: false, up: false, down: false, jump: false };
    this.jumpWasDown = false; this.upWasDown = false;
    kb.on('keydown-ESC', function () { self.onEsc(); });
    kb.on('keydown-H', function () {
      if (self.help) self.help.close();
      else if (!self.finished) { if (!self.paused) self.pause(); self.openHelp(); }
    });
    kb.on('keydown-M', function () { GP.Progression.muted = !GP.Progression.muted; self.toast(GP.Progression.muted ? 'SON DÉSACTIVÉ' : 'SON ACTIVÉ'); });
    kb.on('keydown-UP', function () { if (self.pauseMenu) self.pauseMove(-1); });
    kb.on('keydown-DOWN', function () { if (self.pauseMenu) self.pauseMove(1); });
    kb.on('keydown-ENTER', function () { if (self.pauseMenu) self.pauseItems[self.pauseSel].cb(); });
    // météo de test : mode ?dev=1, ou compte admin connecté (touche N, ou ligne MÉTÉO du menu pause)
    if (GP.Config.DEV_TOOLS || GP.Cloud.isAdmin) kb.on('keydown-N', function () { if (!self.pauseMenu && !self.finished) self.cycleWeather(); });
    if (GP.Config.DEV_TOOLS) {
      kb.on('keydown-K', function () { if (!self.paused && !self.finished) self.pixels.forEach(function (p) { if (!p.taken) self.collect(p, true); }); });
      if (GP.Config.DEV_LEVEL) {
        kb.on('keydown-R', function () {
          delete GP.Progression.data.runs[self.loc.id]; GP.Progression.persist();
          self.scene.restart({ index: self.index });
        });
        kb.on('keydown-V', function () {
          var st = Object.assign({}, GP.Weather.get()); st.windDir = (st.windDir + 180) % 360;
          GP.Weather.state = st; self.applyWeather(st); self.toast('MÉTÉO TEST : VENT INVERSÉ');
        });
      }
    }
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
  }

  /** Boutons à l'écran sur écran tactile (gauche, droite, accroupi, saut, pause) : voir GP.UI.touchPad. */
  makeTouch() {
    var self = this;
    GP.UI.touchPad(this, this.touch, function () { self.onEsc(); });
  }

  /** Zone d'escalade (colonne) sous le joueur, ou null. */
  climbZoneAt(b) {
    var cx = b.x + b.width / 2;
    for (var i = 0; i < this.climbZones.length; i++) {
      var z = this.climbZones[i];
      if (z.active === false) continue;
      if (cx >= z.x0 && cx <= z.x1 && b.bottom > z.y0 && b.y < z.y1) return z;
    }
    return null;
  }

  /** Taille de la boîte de collision : debout (8×16) ou accroupi (8×10). */
  setCrouch(on) {
    var b = this.player.body;
    if (on === this.crouching) return;
    if (!on && (this.solidAt(b.x + 1, b.y - 7) || this.solidAt(b.right - 1, b.y - 7))) return;   // plafond : on reste accroupi
    this.crouching = on;
    if (on) b.setSize(8, 10).setOffset(4, 9); else b.setSize(8, 16).setOffset(4, 3);
  }

  // ---------- Boucle ----------
  update(time, delta) {
    this.sky.update(this.cameras.main, delta);
    if (this.L.farSwitch && this.sky.far) {                                   // fond qui change selon l'endroit (extérieur puis intérieur du théâtre)
      var fx = this.player.x / 16, fk = this.L.farSwitch[0][1];
      var fl = '';
      this.L.farSwitch.forEach(function (f) { if (fx >= f[0]) { fk = f[1]; fl = f[2] || ''; } });
      if (fk !== this.farKeyNow && this.textures.exists(fk)) {
        var first = !this.farKeyNow; this.farKeyNow = fk; this.sky.far.setTexture(fk);
        if (!first && fl) this.toast(fl, GP.PAL.y);                               // on annonce le changement de décor
      }
    }
    if (this.paused || this.finished || this.dying || !this.player) return;
    var dt = Math.min(delta, 50), p = this.player, b = p.body, U = this.TUNE;
    this.updateShelter(dt);
    var X = this.phy;
    this.updateMechanics(dt);
    this.dangers.update(dt);
    if (GP.Config.DEV_TOOLS) {   // mode test : la tuile du joueur s'affiche sous la météo, pour dire « le problème est à la tuile 64 »
      if (!this.devTile) this.devTile = GP.UI.txt(this, GP.Config.WIDTH - 6, 66, '', GP.PAL.y, { backgroundColor: GP.PAL.k, padding: { x: 3, y: 2 } }).setOrigin(1, 0).setScrollFactor(0).setDepth(60);
      this.devTile.setText('TUILE ' + Math.floor(this.player.x / 16) + ' / ' + Math.floor(this.player.y / 16));
    }
    if (this.dying) return;
    if (this.introMs > 0) { this.introMs -= dt; b.setVelocityX(0); return; }
    this.time_ms += dt;
    if (!this.timeWarned && this.time_ms > this.maxTime - 30000) { this.timeWarned = true; this.toast('PLUS QUE 30 SECONDES', GP.PAL.y); }
    if (this.time_ms >= this.maxTime) { this.timeUp(); return; }
    this.saveMs += dt;
    if (this.saveMs >= 5000) { this.saveMs = 0; this.saveRun(); }

    // entrées (clavier, tactile ou robot de test)
    var bot = this.bot ? this.bot.step(this) : null;
    var c = bot ? null : this.ctl.read(this.touch);
    var left = bot ? bot.left : c.left;
    var right = bot ? bot.right : c.right;
    var down = bot ? !!bot.down : c.down;
    var upKey = bot ? !!bot.up : c.up;
    var zone = this.ab.climb ? this.climbZoneAt(b) : null;
    // ↑ fait sauter, sauf là où il sert à grimper (colonne, rebord) ; sur téléphone le bouton de saut fait les deux
    var jumpKey = bot ? bot.jump : c.jump;
    var up = upKey || ((zone || this.hanging) && jumpKey && !(left || right));
    // après une escalade, ↑ encore enfoncé ne doit pas déclencher un saut : il faut d'abord le relâcher
    if (!upKey) this.upLock = false;
    var jumpDown = jumpKey || (upKey && !zone && !this.hanging && !this.climbing && !this.upLock);
    var jumpPressed = jumpDown && !this.jumpWasDown, jumpReleased = !jumpDown && this.jumpWasDown;
    var upPressed = up && !this.upWasDown;
    this.jumpWasDown = jumpDown; this.upWasDown = up;
    var dir = (right ? 1 : 0) - (left ? 1 : 0), onGround = b.blocked.down || b.touching.down;
    this.dangers.input({ left: left, right: right, down: down, jump: jumpPressed });

    // --- tolérances invisibles (Celeste) : coin de plafond au sommet du saut, bord de mur frôlé de justesse ---
    if (onGround && dir && U.stepUp && !this.hanging && !this.climbing && (dir > 0 ? b.blocked.right : b.blocked.left)) this.ledgeAssist(dir, U.stepUp);
    if (!onGround && !this.hanging && !this.climbing) {
      if (b.blocked.up && this.lastVy < -40 && U.headCorner) this.headCorner(dir);
      else if (dir && U.ledgeAssist && (dir > 0 ? b.blocked.right : b.blocked.left) && b.velocity.y > -100) this.ledgeAssist(dir);
    }

    // --- accroché à un rebord : ↑ ou saut pour se hisser, ↓ pour lâcher ---
    if (this.hanging) {
      b.setVelocity(0, 0); b.setGravityY(0);
      // se hisser : ↑, saut, ou pousser de nouveau vers le mur (après l'avoir relâché depuis l'accroche)
      if (dir !== this.hangDir) this.hangReleased = true;
      if (upPressed || jumpPressed || (this.hangReleased && dir === this.hangDir)) {
        var h = this.hanging; this.hanging = null; b.setAllowGravity(true);
        b.reset(h.x, h.top); this.jumpWasDown = true; this.upLock = true;
      } else if (down) { this.hanging = null; b.setAllowGravity(true); b.setVelocityX(-this.hangDir * 40); }
      this.animate(onGround); this.afterMove(dt); return;
    }

    // --- sur une colonne : ↑ / ↓ pour grimper, saut + direction pour s'en élancer ---
    if (!this.climbing && zone && up && !(onGround && !upKey && jumpKey)) {
      this.climbing = zone; this.setCrouch(false); b.setAllowGravity(false); b.setVelocity(0, 0);
    }
    if (this.climbing) {
      var z = this.climbing;
      b.setVelocityX(0); p.x += (z.cx - p.x) * 0.3;
      b.setVelocityY(up ? -U.climbSpeed : down ? U.climbSpeed : 0);
      if ((jumpPressed && dir) || !this.climbZoneAt(b) || (down && onGround)) {
        this.climbing = null; b.setAllowGravity(true); this.upLock = true;
        if (jumpPressed && dir) { b.setVelocity(dir * U.speed, U.jump * 0.85); this.jumping = true; }
        else if (b.bottom <= z.y0 + 6) b.setVelocityY(-150);   // en haut de la colonne : petit élan pour monter sur le rebord
      }
      this.animate(onGround); this.afterMove(dt); return;
    }

    // --- accroupi (↓) : plus bas, plus lent, pas de saut ---
    if (this.ab.crouch) this.setCrouch(onGround && down);

    // course : accélération douce vers la vitesse cible (le sol mouillé ou enneigé glisse un peu plus)
    var max = this.crouching ? U.crouchSpeed : U.speed;
    var target = dir * max + (onGround ? this.surfaceMotion : 0), a = (onGround ? X.accelGround : X.accelAir) * dt / 1000;
    if (this.boost > 0) this.boost = onGround ? 0 : this.boost - dt;   // élan d'un anneau rouge : on garde sa vitesse en l'air
    if (this.slideMs > 0) { this.slideMs -= dt; b.setVelocityX(this.slideDir * 175); }                     // peau de banane : on glisse tout droit
    else if (!(this.boost > 0)) b.setVelocityX(b.velocity.x + Phaser.Math.Clamp(target - b.velocity.x, -a, a));
    if (!onGround && X.airPush) b.setVelocityX(Phaser.Math.Clamp(b.velocity.x + X.airPush * dt / 1000, -180, 180));   // le vent pousse les sauts
    if (this.gz && this.gz.impulseMs > 0 && !onGround) b.setVelocityX(this.gz.impulseVX);
    if (dir) p.setFlipX(dir < 0);

    // saut : temps de grâce au bord (coyote), tampon d'appui, saut variable
    this.coyote = onGround ? U.coyote : this.coyote - dt;
    this.buffer = jumpPressed ? U.buffer : this.buffer - dt;
    if (onGround) this.jumping = false;
    if (this.gz && this.gz.justBoosted) { this.buffer = 0; this.coyote = 0; this.jumping = true; }
    // accroupi : le saut se relève d'abord (s'il y a la place sous le plafond), puis saute
    if (this.buffer > 0 && this.coyote > 0 && this.crouching) this.setCrouch(false);
    if (this.buffer > 0 && this.coyote > 0 && !this.crouching) {
      b.setVelocityY(U.jump); this.buffer = 0; this.coyote = 0; this.jumping = true;
      GP.Sfx.play('step');
      this.events.emit('playtest-event', { type: 'jump', x: p.x, y: p.y });
    }
    if (jumpReleased && this.jumping && b.velocity.y < 0) { b.setVelocityY(b.velocity.y * U.cut); this.jumping = false; }

    // --- s'accrocher à un rebord : en l'air, contre un mur, les mains à hauteur de son sommet ---
    if (this.ab.grab && !onGround && b.velocity.y > -80 && dir && (this.gz || (dir > 0 ? b.blocked.right : b.blocked.left))) this.tryGrab(dir);

    // demi-gravité près du sommet : tant que le saut est maintenu, on flotte un peu (viser l'atterrissage est plus facile)
    var apex = !onGround && !this.hanging && jumpDown && Math.abs(b.velocity.y) < U.apexThreshold;
    b.setGravityY(apex ? -(1 - U.apexGravityMult) * GP.Tuning.worldGravity : 0);

    this.animate(onGround);
    this.afterMove(dt);
  }

  /**
   * Coin de plafond : le sommet du saut frôle l'angle d'un bloc. Au lieu d'un arrêt net, on glisse la tête de 1 à 4 px sur
   * le côté (d'abord dans le sens de la marche) dès qu'une place est libre, et on garde la vitesse verticale.
   */
  headCorner(dir) {
    var p = this.player, b = p.body, max = this.TUNE.headCorner, order = dir ? [dir, -dir] : [1, -1];
    for (var k = 1; k <= max; k++) {
      for (var i = 0; i < order.length; i++) {
        var x = b.x + order[i] * k;
        if (this.boxFree(x, b.y - 1, b.width, b.height)) {
          p.x += order[i] * k; b.updateFromGameObject(); b.setVelocityY(this.lastVy);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Bord de mur frôlé : en l'air, poussé contre un mur dont le dessus est à 8 px au plus sous les pieds (là où l'accroche ne
   * se déclenche pas encore), on monte dessus au lieu de buter.
   */
  ledgeAssist(dir, max) {
    var p = this.player, b = p.body, N = max || this.TUNE.ledgeAssist, fx = dir > 0 ? b.right + 1 : b.x - 2;
    for (var d = 0; d <= N; d++) {
      var y = b.bottom - 1 - d;
      if (!this.solidAt(fx, y) || this.solidAt(fx, y - 1)) continue;
      var lift = b.bottom - y;                      // y = première ligne pleine du rebord
      for (var yy = y - 1; yy >= y - b.height; yy -= 4) if (this.solidAt(fx, yy)) return false;   // pas de place sur le rebord
      if (!this.boxFree(b.x, b.y - lift, b.width, b.height)) return false;
      var vx = b.velocity.x, vy = b.velocity.y;
      p.y -= lift; b.updateFromGameObject(); b.setVelocity(Math.max(Math.abs(vx), 40) * dir, Math.max(vy, 0));
      return true;
    }
    return false;
  }

  /** Vrai si le rectangle (x, y, w, h) ne touche aucun bloc plein (échantillons aux coins et au milieu des côtés). */
  boxFree(x, y, w, h) {
    var xs = [x + 0.5, x + w / 2, x + w - 0.5], ys = [y + 0.5, y + h / 2, y + h - 0.5];
    for (var i = 0; i < xs.length; i++) for (var j = 0; j < ys.length; j++) if (this.solidAt(xs[i], ys[j])) return false;
    return true;
  }

  tryGrab(dir) {
    if (this.gz) {
      var body = this.player.body;
      var candidates = this.gz.solids.concat(this.gz.surfaces);
      for (var i = 0; i < candidates.length; i++) {
        var s = candidates[i], edge = dir > 0 ? s.body.x : s.body.right;
        if (!s.body.enable || s.grab === false || Math.abs((dir > 0 ? body.right : body.x) - edge) > 7 || body.y < s.body.y - 8 || body.y > s.body.y + 12) continue;
        var x = edge + dir * 8;
        if (this.solidAt(x, s.body.y - 8)) continue;
        this.hanging = { x: x, top: s.body.y }; this.hangDir = dir; this.hangReleased = false;
        body.setAllowGravity(false); body.setVelocity(0, 0); body.reset(this.player.x, s.body.y + 14); this.jumping = false;
        return;
      }
      return;
    }
    var b = this.player.body, wx = dir > 0 ? b.right + 2 : b.x - 2, c = Math.floor(wx / 16);
    for (var r = Math.floor((b.y - 10) / 16); r <= Math.floor((b.y + 12) / 16); r++) {
      var top = r * 16;
      if (!this.solidAt(c * 16 + 8, top + 8) || this.solidAt(c * 16 + 8, top - 8) || this.solidAt(b.x + 4, top - 8)) continue;
      if (b.y < top - 8 || b.y > top + 12) continue;
      this.hanging = { x: c * 16 + 8, top: top };
      this.hangDir = dir; this.hangReleased = false;
      b.setAllowGravity(false); b.setVelocity(0, 0);
      b.reset(this.player.x, top + 14);
      this.jumping = false;
      return;
    }
  }

  animate(onGround) {
    var p = this.player, b = p.body;
    var anim = this.hanging ? 'hero-hang' : this.climbing ? 'hero-climb' : this.crouching ? 'hero-crouch'
      : !onGround ? 'hero-jump' : (Math.abs(b.velocity.x) > 12 ? 'hero-walk' : 'hero-idle');
    if (p.anims.getName() !== anim) p.play(anim);
    if (this.climbing && !b.velocity.y) p.anims.pause(); else if (p.anims.isPaused) p.anims.resume();
  }

  afterMove(dt) {
    var p = this.player;
    this.lastVy = p.body.velocity.y;   // avant la prochaine collision : sert à la correction de coin de plafond
    // invulnérabilité : transparence fixe (pas de clignotement)
    if (this.invuln > 0) { this.invuln -= dt; if (this.invuln <= 0) p.setAlpha(1); }
    this.checkWorld();
    this.updateHud();
  }

  /** Pièges et plateformes animés (indépendants du joueur). */
  updateMechanics(dt) {
    var self = this, p = this.player, b = p.body, t = this.time_ms + this.introMs;
    if (this.gz) this.gz.update(dt);
    this.bridges.forEach(function (bridge) {
      var x = bridge.x * 16, y = bridge.surfaceY, w = bridge.w * 16;
      var occupied = b.right > x - 4 && b.x < x + w + 4 && b.bottom >= y - 6 && b.y < y + 12;
      bridge.body.enable = GP.LevelMechanics.bridge(bridge, dt, occupied);
      bridge.img.setAngle(bridge.angle).setTint(bridge.warned ? GP.int(GP.PAL.y) : 0xffffff);
      var a = bridge.angle * Math.PI / 180, ex = Math.round(x + w * Math.cos(a)), ey = Math.round(y + w * Math.sin(a));
      var chain = bridge.chain; chain.clear(); chain.fillStyle(GP.int(bridge.warned ? GP.PAL.y : GP.PAL.m));
      var ax = x - 2, ay = y - w, n = Math.max(Math.abs(ex - ax), Math.abs(ey - ay));
      for (var k = 0; k <= n; k += 3) chain.fillRect(Math.round(ax + (ex - ax) * k / (n || 1)), Math.round(ay + (ey - ay) * k / (n || 1)), 2, 2);
    });
    // plateformes mobiles : position sinusoïdale, vitesse calculée pour suivre (le joueur est transporté)
    // (vitesse = dérivée du mouvement aller-retour, plus une petite correction de dérive : pas d'à-coups)
    this.movers.forEach(function (m) {
      var w = Math.PI * 2 / m.period * 1000, ph = (self.time.now / m.period + m.phase) * Math.PI * 2, k = 0.5 - 0.5 * Math.cos(ph), v = 0.5 * Math.sin(ph) * w;
      m.body.setVelocity(m.dx * v + (m.x0 + m.dx * k - m.body.x) * 3, m.dy * v + (m.y0 + m.dy * k - m.body.y) * 3);
    });
    // rebords qui s'effritent : 0,6 s après qu'on s'y pose (ils tremblent), ils tombent puis reviennent 3 s plus tard
    this.crumbles.forEach(function (c) {
      var on = c.state === 'solid' && b.touching.down && b.bottom <= c.img.y + 2 && b.right > c.img.x && b.x < c.img.x + c.img.width;
      if (c.state === 'solid' && on) { c.state = 'shaking'; c.timer = 600; GP.Sfx.play('step'); }
      if (c.state === 'shaking') {
        c.timer -= dt; c.img.x = c.x + (GP.reducedMotion ? 0 : (Math.floor(c.timer / 60) % 2 ? 1 : -1));
        if (c.timer <= 0) { c.state = 'gone'; c.timer = 3000; c.body.enable = false; c.img.x = c.x; self.tweens.add({ targets: c.img, alpha: 0, y: c.img.y + 10, duration: 250 }); }
      } else if (c.state === 'gone') {
        c.timer -= dt;
        if (c.timer <= 0) { c.state = 'solid'; c.body.enable = true; self.tweens.killTweensOf(c.img); c.img.setAlpha(1).setY(c.body.y); }
      }
    });
    // herses : montent (ouvertes) puis redescendent ; si le joueur est dessous, elles attendent
    this.gates.forEach(function (g) {
      g.t += dt;
      var cycle = g.open + g.closed, ph = g.t % cycle, wantDown = ph >= g.open;
      var under = b.right > g.img.x - g.img.width / 2 - 4 && b.x < g.img.x + g.img.width / 2 + 4 && b.bottom > g.floor - 52 && b.y < g.floor;
      g.down = wantDown && !(under && g.img.y < g.floor);
      var targetY = g.down ? g.floor : g.floor - 48;
      g.img.y += Phaser.Math.Clamp(targetY - g.img.y, -dt * 0.14, dt * 0.14);
      g.body.updateFromGameObject(); g.body.enable = g.down;
      if (!wantDown && ph > g.open - 500) g.img.setTint(GP.int(GP.PAL.y)); else g.img.clearTint();
    });
    // tonneaux
    this.barrels.forEach(function (r) {
      var wind = self.env.wind ? 1 + 0.25 * (1 - self.coverAt(r.img.x, r.img.y - 6).wind) : 1;
      r.img.x += r.dir * r.speed * wind * dt / 1000;
      if (r.img.x > r.x1) { r.img.x = r.x1; r.dir = -1; } else if (r.img.x < r.x0) { r.img.x = r.x0; r.dir = 1; }
      r.img.setFlipX(r.dir < 0);
    });
    // meurtrières : la fente s'éclaire 0,35 s avant de tirer
    this.slits.forEach(function (s) {
      s.t += dt;
      var ph = ((s.t % s.period) + s.period) % s.period;
      if (s.t >= 0 && ph > s.period - 350) s.img.setTint(0xf4d35e); else s.img.clearTint();
      if (s.t >= 0 && ph < dt) {
        var a = self.add.image(s.x, s.feet - 14, 'lv_arrow').setDepth(7).setFlipX(s.dir < 0);
        self.arrows.push({ img: a, vx: s.dir * 130, life: s.life });   // portée limitée (s.range tuiles)
      }
    });
    this.arrows = this.arrows.filter(function (a) {
      a.img.x += a.vx * dt / 1000; a.life -= dt;
      if (a.life <= 0 || self.solidAt(a.img.x + (a.vx > 0 ? 5 : -5), a.img.y)) { a.img.destroy(); return false; }
      return true;
    });
    // gargouilles : une goutte se forme (annonce) puis tombe ; plus souvent sous la pluie
    this.gargoyles.forEach(function (g) {
      var rain = self.env.rain && self.L.rainGargoyle ? 1 - self.coverAt(g.x, g.y).rain : 0;
      var period = g.period * (1 - 0.4 * rain);
      if (self.L.rainOnly && !self.env.rain) { g.t = 0; return; }                  // vitres cassées : ça ne goutte que sous la pluie
      g.t += dt;
      if (g.t > period - 500 && !g.warned) { g.warned = true; g.warn = self.add.image(g.x, g.y + 4, 'lv_drop').setDepth(7).setAlpha(0.6); }
      if (g.t > period) {
        g.t = 0; g.warned = false; if (g.warn) { g.warn.destroy(); g.warn = null; }
        self.drops.push({ img: self.add.image(g.x, g.y + 4, 'lv_drop').setDepth(7), vy: 0 });
      }
    });
    this.drops = this.drops.filter(function (d) {
      d.vy = Math.min(d.vy + 600 * dt / 1000, 300); d.img.y += d.vy * dt / 1000;
      if (d.img.y > self.H || self.solidAt(d.img.x, d.img.y + 3)) { d.img.destroy(); return false; }
      return true;
    });
  }

  /** Contacts : pièges, chute, lanternes, panneaux, pixels. */
  checkWorld() {
    var self = this, p = this.player, b = p.body;
    var bx = b.x, by = b.y, bw = b.width, bh = b.height;
    function hit(x, y, w, h) { return bx < x + w && bx + bw > x && by < y + h && by + bh > y; }
    if (by > this.H + 10) { this.die('CHUTE !'); return; }
    for (var wi = 0; wi < this.water.length; wi++) {
      var water = this.water[wi]; if (hit(water.x, water.y, water.w, water.h)) { this.die('DANS LES DOUVES !'); return; }
    }
    if (this.invuln <= 0) {
      var ouch = this.L.thornText || 'AÏE, LES RONCES !';
      for (var i = 0; i < this.thorns.length; i++) { var t = this.thorns[i]; if (hit(t.x, t.y, t.w, t.h)) { this.die(ouch); return; } }
      for (i = 0; i < this.rainThorns.length; i++) { var r = this.rainThorns[i]; if (r.active && hit(r.box.x, r.box.y, r.box.w, r.box.h)) { this.die('LES RONCES ONT POUSSÉ !'); return; } }
      for (i = 0; i < this.arrows.length; i++) { var a = this.arrows[i].img; if (hit(a.x - 5, a.y - 1, 10, 3)) { this.die('UNE FLÈCHE ! ACCROUPIS-TOI'); return; } }
      for (i = 0; i < this.drops.length; i++) { var d = this.drops[i].img; if (hit(d.x - 2, d.y - 2, 4, 4)) { this.die('LA GARGOUILLE T\'A EU !'); return; } }
      for (i = 0; i < this.barrels.length; i++) { var br = this.barrels[i].img; if (hit(br.x - 5, br.y - 12, 10, 12)) { this.die('ATTENTION AU TONNEAU !'); return; } }
      var dm = this.dangers.check(hit);
      if (dm) { this.die(dm); return; }
    }
    var lanOn = this.key('commun_lanterne_allumee', 'lv_lantern_on');
    this.lanterns.forEach(function (l, i) {
      if (!l.lit && Math.abs(p.x - l.x) <= 14 && Math.abs(p.y - l.y) <= 20) {
        l.lit = true;
        if (GP.Sprites.has('commun_lanterne_allumee') && GP.Sprites.info('commun_lanterne_allumee').frames > 1) l.img.setTexture('commun_lanterne_allumee_0').play('commun_lanterne_allumee');
        else l.img.setTexture(lanOn);
        self.respawn = { x: l.x, y: l.y };
        self.checkpointIndex = i;
        self.saveRun();
        self.events.emit('playtest-event', { type: 'checkpoint', index: i, x: l.x, y: l.y });
        GP.Sfx.play('confirm');
        self.toast('POINT DE CONTRÔLE');
      }
    });
    this.signs.forEach(function (s) {
      var cam = self.cameras.main;
      s.text.x = Phaser.Math.Clamp(s.x, cam.scrollX + s.text.width / 2 + 6, cam.scrollX + GP.Config.WIDTH - s.text.width / 2 - 6);
      // Panneau très haut dans le niveau : le texte passerait sous le HUD, on le met sous le panneau (dans le sol).
      var under = s.top - s.text.height - cam.scrollY < 56;
      s.text.setOrigin(0.5, under ? 0 : 1); s.text.y = under ? s.low : s.top;
      var near = Math.abs(p.x - s.x) < 40;
      if (near !== s.shown) { s.shown = near; self.tweens.add({ targets: s.text, alpha: near ? 1 : 0, duration: 160 }); }
    });
    var sight = this.phy.sight;
    this.pixels.forEach(function (px) {
      if (px.taken) return;
      if (!px.locked && hit(px.x - 5, px.y - 5, 10, 10)) { self.collect(px); return; }
      // brume ou nuit : les pixels lointains s'effacent (une lueur reste toujours visible)
      if (sight && !px.dim) { var dd = Math.abs(px.x - p.x) + Math.abs(px.y - p.y) * 0.5; px.img.setAlpha(Phaser.Math.Clamp(1 - (dd - sight) / 50, 0.15, 1)); }
      else if (px.img.alpha !== 1 && !px.dim) px.img.setAlpha(1);
    });
    this.updateExit();
    if (this.L.exit && GP.LevelMechanics.canFinish(this.L, this.pc.done(), this.atExit(), !this.gz || !this.gz.boss || this.gz.boss.done)) this.finish();
  }

  /** Ramassage : le pixel s'envole vers l'image du HUD, qui révèle le groupe suivant. */
  collect(px, quiet) {
    if (px.taken || this.finished) return;
    px.taken = true;
    this.tweens.killTweensOf(px.img);
    px.img.destroy();
    var color = this.pc.reveal(), cam = this.cameras.main, self = this;
    if (!quiet) GP.Sfx.play('pixel');
    if (!GP.reducedMotion && !quiet) {
      var sp = this.add.image(px.x - cam.scrollX, px.y - cam.scrollY, 'spark').setScrollFactor(0).setDepth(70).setTint(color).setScale(2);
      this.tweens.add({ targets: sp, x: 26, y: 24, scale: 1, duration: 450, ease: 'Quad.easeIn', onComplete: function () { sp.destroy(); } });
    }
    this.updateHud();
    this.saveRun();
    this.events.emit('playtest-event', { type: 'collect', count: this.pc.count, x: px.x, y: px.y });
    if (this.pc.done()) {
      if (!this.L.exit) this.finish();
      else { this.updateExit(); if (!quiet) GP.Sfx.play('unlock'); }
    }
  }

  /**
   * Mort : +1 au compteur MORTS, courte animation (pose de saut, petit bond, fondu ; pas de clignotement),
   * retour à la dernière lanterne, puis brève invulnérabilité en transparence fixe.
   */
  die(msg) {
    var self = this, p = this.player, U = this.TUNE;
    if (this.dying) return;
    this.dying = true;
    if (this.gz) this.gz.impulseMs = 0;
    this.deaths++;
    this.events.emit('playtest-event', { type: 'death', reason: msg, x: p.x, y: p.y });
    this.saveRun();
    this.hanging = null; this.climbing = null; this.setCrouch(false);
    GP.Sfx.play('error');
    this.toast(msg, GP.PAL.o);
    this.updateHud();
    p.body.setVelocity(0, 0); p.body.setAllowGravity(false); p.body.enable = false;
    p.play('hero-jump');
    var fell = p.y > this.H;
    this.tweens.add({
      targets: p, y: fell ? p.y : p.y - 14, alpha: 0, duration: GP.reducedMotion ? 200 : 450, ease: 'Quad.easeOut',
      onComplete: function () {
        p.body.enable = true; p.body.setAllowGravity(true);
        if (self.crouching) { self.crouching = false; p.body.setSize(8, 16).setOffset(4, 3); }
        p.body.reset(self.respawn.x, self.respawn.y);
        self.dangers.reset();
        p.setAlpha(0.45);
        self.invuln = U.invuln;
        self.jumping = false; self.buffer = 0;
        self.updateShelter(0, true);
        self.dying = false;
      }
    });
  }

  finish() {
    var self = this;
    if (this.finished) return;
    if (!GP.LevelMechanics.canFinish(this.L, this.pc.done(), this.atExit(), !this.gz || !this.gz.boss || this.gz.boss.done)) return;
    this.finished = true;
    this.events.emit('playtest-event', { type: 'finish', timeMs: this.time_ms, deaths: this.deaths, count: this.pc.count });
    this.physics.pause();
    this.player.play('hero-cheer');
    GP.Sfx.play('unlock');
    var t = GP.UI.txt(this, GP.Config.WIDTH / 2, 110, 'IMAGE COMPLÈTE !', GP.PAL.g, { fontSize: '16px', backgroundColor: GP.PAL.k, padding: { x: 6, y: 6 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(80);
    if (this.secret) {   // niveau secret : on garde le meilleur temps à part (jamais dans les étoiles) et on retourne à la carte
      try { var old = JSON.parse(localStorage.getItem('gp_secret') || 'null'); var tps = Math.round(this.time_ms / 1000); if (!old || tps < old.time) localStorage.setItem('gp_secret', JSON.stringify({ time: tps, deaths: this.deaths })); } catch (e) { /* sans stockage : pas de record */ }
      t.setText('MAÎTRE DE LA LIGNE VERTE !');
      this.time.delayedCall(2600, function () {
        self.cameras.main.fadeOut(350, 20, 24, 46);
        self.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Map'); });
      });
      return;
    }
    this.time.delayedCall(1700, function () {
      self.cameras.main.fadeOut(350, 20, 24, 46);
      self.cameras.main.once('camerafadeoutcomplete', function () {
        self.scene.start('Result', { index: self.index, pixels: self.pc.count, total: self.pc.total, deaths: self.deaths, time: self.time_ms / 1000 });
      });
    });
  }

  /**
   * Limite de temps atteinte (3 min par défaut, L.maxTime pour les niveaux plus longs) : le niveau s'arrête, sans rien enregistrer
   * (ni étoile, ni étape débloquée), et propose REJOUER (R) ou la CARTE (Entrée). Le temps passé en pause n'est pas compté.
   */
  timeUp() {
    var self = this;
    if (this.timedOut || this.finished) return;
    this.timedOut = true; this.finished = true;
    this.restarting = true;   // plus de sauvegarde : le temps écoulé n'enregistre rien et la reprise repart du début
    delete GP.Progression.data.runs[this.loc.id]; GP.Progression.persist();
    this.physics.pause();
    if (this.toastObj) { this.toastObj.destroy(); this.toastObj = null; }
    GP.Sfx.play('error');
    var m = GP.UI.modal(this, 'TEMPS ÉCOULÉ', '', { x: 120, y: 48, w: 240, h: 150 });
    m.add(GP.UI.txt(this, 240, 92, this.pc.count + ' PIXELS SUR ' + this.pc.total, GP.PAL.w).setOrigin(0.5, 0));
    m.add(GP.UI.txt(this, 240, 108, 'PAS D\'ÉTOILE : ESSAIE ENCORE !', GP.PAL.o).setOrigin(0.5, 0));
    var bRe = GP.UI.button(this, 150, 132, 180, 'REJOUER (R)', function () { self.leaveTimeUp('Game'); }, { primary: true });
    var bCa = GP.UI.button(this, 150, 154, 180, 'CARTE (ENTRÉE)', function () { self.leaveTimeUp('Map'); });
    m.add(bRe.objs); m.add(bCa.objs);
    var kb = this.input.keyboard;
    kb.removeAllListeners();
    kb.on('keydown-R', function () { self.leaveTimeUp('Game'); });
    kb.on('keydown-ENTER', function () { self.leaveTimeUp('Map'); });
    kb.on('keydown-SPACE', function () { self.leaveTimeUp('Map'); });
  }

  leaveTimeUp(key) {
    var self = this;
    if (this.leaving) return;
    this.leaving = true;
    GP.Sfx.play(key === 'Map' ? 'back' : 'confirm');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(key, key === 'Game' ? { index: self.index } : undefined); });
  }

  // ---------- Pause ----------
  onEsc() {
    if (this.finished) return;
    if (this.help) { this.help.close(); return; }
    if (this.pauseMenu) this.resume(); else this.pause();
  }

  /** Outil de test (admin ou ?dev=1) : météo simulée suivante, puis retour à la vraie météo. */
  cycleWeather() {
    var self = this, s = GP.Weather.nextSim();
    if (s) { this.applyWeather(s); this.toast('MÉTÉO TEST : ' + s.simName); return; }
    this.toast('MÉTÉO RÉELLE');
    GP.Weather.load(function (st) { if (self.alive) self.applyWeather(st); });
  }
  weatherLabel() {
    var sim = GP.Weather.simIndex >= 0 && GP.Weather.state && GP.Weather.state.simName;
    return GP.t('MÉTÉO') + ' : ' + (sim ? GP.t(sim) : GP.t('RÉELLE'));
  }

  pause() {
    var self = this;
    if (this.pauseMenu) return;
    this.saveRun();
    this.paused = true;
    this.physics.pause();
    this.player.anims.pause();
    var admin = GP.Cloud.isAdmin || GP.Config.DEV_TOOLS;   // ligne de plus pour tester la météo
    var m = this.pauseMenu = GP.UI.modal(this, 'PAUSE', '', admin ? { x: 100, y: 34, w: 280, h: 186 } : { x: 100, y: 44, w: 280, h: 160 });
    var unwatch = GP.Prompts.watch(this, function () { m.titleRight.setText(GP.Prompts.format('{back} : REPRENDRE')); });
    m.titleRight.setText(GP.Prompts.format('{back} : REPRENDRE'));
    var destroy = m.destroy;
    m.destroy = function () { unwatch(); destroy(); };
    this.pauseItems = [
      { label: 'REPRENDRE', cb: function () { self.resume(); } },
      { label: 'AU POINT DE CONTRÔLE', cb: function () { self.backToCheckpoint(); } },   // repart de la dernière lanterne, les pixels pris restent acquis
      { label: 'REJOUER LE NIVEAU', cb: function () { self.restartLevel(); } },           // solution de secours (blocage, bogue) : on repart du début
      { label: 'COMMENT JOUER ?', cb: function () { self.openHelp(); } },
      { label: 'QUITTER VERS LA CARTE', cb: function () { self.quit(); } }
    ];
    if (admin) this.pauseItems.splice(4, 0, { label: this.weatherLabel(), weather: true, cb: function () { self.cycleWeather(); self.pauseBtns[4].label.setText(self.weatherLabel()); } });
    this.pauseBtns = this.pauseItems.map(function (it, i) {
      var b = GP.UI.button(self, 130, (admin ? 66 : 76) + i * 24, 220, it.label, it.cb, { primary: i === 0 });
      m.add(b.objs);
      b.box.on('pointerover', function () { self.pauseSel = i; self.pauseHover(); });
      return b;
    });
    this.pauseSel = 0; this.pauseHover();
    GP.Sfx.play('select');
  }
  pauseMove(d) { this.pauseSel = (this.pauseSel + d + this.pauseItems.length) % this.pauseItems.length; GP.Sfx.play('step'); this.pauseHover(); }
  pauseHover() { var s = this.pauseSel; this.pauseBtns.forEach(function (b, i) { b.hover(i === s); }); }

  resume() {
    if (this.pauseMenu) { this.pauseMenu.destroy(); this.pauseMenu = null; }
    this.paused = false;
    this.physics.resume();
    this.player.anims.resume();
    GP.Sfx.play('back');
  }

  /** Pause → « au point de contrôle » : le joueur revient à la dernière lanterne allumée (ou au départ), sans perdre ses pixels. */
  backToCheckpoint() {
    var p = this.player;
    this.resume();
    p.body.setVelocity(0, 0);
    p.body.reset(this.respawn.x, this.respawn.y);
    this.hanging = null; this.climbing = null; this.jumping = false; this.buffer = 0;
    p.setAlpha(0.45); this.invuln = this.TUNE.invuln;
    this.updateShelter(0, true);
    this.toast('POINT DE CONTRÔLE');
  }

  /** Pause → « rejouer le niveau » : on efface la reprise sauvegardée (pixels, lanterne, temps, morts) et on repart du début. */
  restartLevel() {
    var self = this;
    if (this.restarting) return;
    this.restarting = true;
    delete GP.Progression.data.runs[this.loc.id];
    GP.Progression.persist();
    GP.Sfx.play('confirm');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Game', { index: self.index }); });
  }

  openHelp() {
    var self = this;
    if (this.pauseMenu) { this.pauseMenu.destroy(); this.pauseMenu = null; }
    this.help = GP.UI.help(this, 1, { onClose: function () { self.help = null; self.pause(); } });
  }

  quit() {
    var self = this;
    this.saveRun();
    GP.Sfx.play('back');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Map'); });
  }
};
