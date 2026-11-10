/**
 * GameScene — moteur de plateforme réutilisable (physique Arcade). Reçoit { index } : le lieu de GP.LOCATIONS,
 * dont la définition de niveau est GP.LEVELS[loc.level].
 *
 * Commandes : < > ou Q/A et D courir · Espace, haut, W ou Z sauter (maintenir = plus haut) · Échap pause.
 * Tactile : boutons à l'écran. Mode test (?dev=1) : N météo simulée (W sert au saut), K tout ramasser.
 *
 * Règles : ramasser tous les pixels reconstruit l'image et termine le niveau. Ronce ou chute = une mort :
 * +1 au compteur MORTS et retour à la dernière lanterne allumée (les pixels ramassés sont gardés).
 * La météo ne change que l'image, jamais la physique.
 *
 * Profondeurs : ciel -40 à -30 · serre -5 · bâtiments 1 · arbres 2 · décor 4 · terrain 5 · ronces 6
 *               lanternes, panneaux 7 · pixels 8 · joueur 20 · météo 30-34 · HUD 50+ · fenêtres 100+
 */
GP.Scenes.Game = class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'Game', physics: { arcade: { gravity: { y: 950 } } } }); }

  init(data) {
    this.index = (data && data.index) || 0;
    this.loc = GP.LOCATIONS[this.index];
    this.L = GP.LEVELS[this.loc.level];
    this.bot = null;   // robot de test (tools/bot.js), jamais actif en jeu normal
  }

  create() {
    var self = this, L = this.L, T = 16;
    this.W = L.width * T; this.H = L.rows * T;
    this.TUNE = { speed: 110, accelGround: 1100, accelAir: 700, jump: -320, cut: 0.45, coyote: 90, buffer: 110, maxFall: 420, invuln: 1000 };
    this.deaths = 0; this.time_ms = 0; this.paused = false; this.finished = false; this.invuln = 0;
    this.introMs = 1700;   // bandeau d'introduction : le joueur attend, le chrono ne tourne pas encore
    this.dying = false;
    this.coyote = 0; this.buffer = 0; this.jumping = false;
    this.alive = true;
    this.events.once('shutdown', function () { self.alive = false; });

    this.cameras.main.fadeIn(350, 20, 24, 46);
    this.cameras.main.setBounds(0, 0, this.W, GP.Config.HEIGHT);

    this.makeBackground();
    this.makeTerrain();
    this.makeObjects();
    this.makePlayer();
    this.makeHud();
    this.makeWeather();
    this.makeInput();
    this.makeTouch();
  }

  // ---------- Décor ----------
  makeBackground() {
    var L = this.L;
    this.sky = GP.LevelArt.sky(this, -40);
    if (L.backdrop) {
      var bx = L.backdrop.x * 16, top = L.top(L.backdrop.x) * 16;
      this.add.image(bx, top + 2, L.backdrop.key).setOrigin(0.5, 1).setScale(L.backdrop.scale).setDepth(-5)
        .setTintFill(0x2b3a55).setAlpha(0.55);
    }
  }

  makeTerrain() {
    var L = this.L, data = [];
    GP.LevelArt.renderTerrain(this, 'lv_terrain', L);
    this.add.image(0, 0, 'lv_terrain').setOrigin(0).setDepth(5);
    // carte de collision : 1 terre, 2 pierre, 3 sens unique (tuiles invisibles)
    for (var y = 0; y < L.rows; y++) {
      var row = [];
      for (var x = 0; x < L.width; x++) { var v = L.grid[y * L.width + x]; row.push(v ? v - 1 : -1); }   // 1→0 terre, 2→1 pierre, 3→2 sens unique, 4→3 topiaire, 5→4 pavés
      data.push(row);
    }
    var map = this.make.tilemap({ data: data, tileWidth: 16, tileHeight: 16 });
    var ts = map.addTilesetImage('lv_tileset');
    this.layer = map.createLayer(0, ts, 0, 0).setVisible(false);
    this.layer.setCollision([0, 1, 3, 4]);
    this.layer.forEachTile(function (t) { if (t.index === 2) t.setCollision(false, false, true, false); });
  }

  makeObjects() {
    var self = this, L = this.L;
    L.deco.forEach(function (d) {
      var img = self.add.image(d.x * 16 + 8 + d.dx, (d.y + 1) * 16 + 1 + (d.dy || 0), d.key).setOrigin(0.5, 1).setDepth(d.depth !== undefined ? d.depth : (d.back ? 2 : 4));
      if (d.key === 'lv_fountain') {
        // jet d'eau : il monte et redescend doucement (fixe si mouvement réduit)
        var jet = self.add.image(img.x, img.y - 14, 'lv_jet').setOrigin(0.5, 1).setDepth(img.depth - 0.5);
        if (!GP.reducedMotion) self.tweens.add({ targets: jet, scaleY: 0.8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    });
    this.thorns = L.thorns.map(function (t) {
      self.add.image(t.x * 16, (t.y + 1) * 16, 'lv_thorn').setOrigin(0, 1).setDepth(6);
      return { x: t.x * 16 + 2, y: t.y * 16 + 8, w: 12, h: 8 };    // zone de contact réduite
    });
    this.lanterns = L.checks.map(function (c) {
      var img = self.add.image(c.x * 16 + 8, (c.y + 1) * 16, 'lv_lantern_off').setOrigin(0.5, 1).setDepth(7);
      return { x: c.x * 16 + 8, y: (c.y + 1) * 16, img: img, lit: false };
    });
    this.signs = L.hints.map(function (h) {
      self.add.image(h.x * 16 + 8, (h.y + 1) * 16, 'lv_sign').setOrigin(0.5, 1).setDepth(7);
      var t = GP.UI.txt(self, h.x * 16 + 8, h.y * 16 - 4, ' ' + h.text + ' ', GP.PAL.w, { backgroundColor: GP.PAL.d, padding: { x: 3, y: 4 } })
        .setOrigin(0.5, 1).setDepth(40).setAlpha(0);
      // la bulle reste entière à l'écran, même près du bord du niveau
      t.x = Phaser.Math.Clamp(t.x, t.width / 2 + 4, self.W - t.width / 2 - 4);
      return { x: h.x * 16 + 8, text: t, shown: false };
    });
    this.pixels = L.pixels.map(function (p) {
      var img = self.add.image(p.x * 16 + 8, p.y * 16 + 8, 'lv_pixel').setDepth(8);
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

  // ---------- Interface ----------
  makeHud() {
    var P = GP.PAL, D = 50;
    function fix(o, d) { return o.setScrollFactor(0).setDepth(d || D); }
    var g = fix(this.add.graphics());
    g.fillStyle(GP.int(P.k), 1); g.fillRect(4, 4, 214, 72);
    g.fillStyle(GP.int(P.d), 1); g.fillRect(6, 6, 210, 68);
    g.fillStyle(GP.int(P.k), 1); g.fillRect(8, 8, 100, 68 - 4);
    // image à reconstruire, agrandie ×2 (photo 48×32 → 96×64)
    var tex = this.textures.get(this.pc.key).getSourceImage(), sc = 2;
    this.hudImg = fix(this.add.image(58, 40, this.pc.key).setScale(Math.min(sc, 96 / tex.width, 64 / tex.height)), D + 1);
    this.hudPix = fix(GP.UI.txt(this, 116, 14, '', P.y), D + 1);
    this.hudTime = fix(GP.UI.txt(this, 116, 34, '', P.w), D + 1);
    this.hudDeaths = fix(GP.UI.txt(this, 116, 54, '', P.m), D + 1);
    this.updateHud();
    // bandeau d'introduction
    var b = GP.UI.txt(this, GP.Config.WIDTH / 2, 118, ' ÉTAPE ' + String(this.index + 1).padStart(2, '0') + ' · ' + this.loc.name.toUpperCase() + ' ', P.g,
      { backgroundColor: P.k, padding: { x: 6, y: 6 } }).setOrigin(0.5).setScrollFactor(0).setDepth(80);
    this.tweens.add({ targets: b, alpha: 0, delay: this.introMs - 300, duration: 300, onComplete: function () { b.destroy(); } });
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
      lights: this.lanterns.map(function (l) { return [l.x, l.y - 17, 0.8]; })
    });
    this.wxWidget = GP.WeatherFX.widget(this, GP.Config.WIDTH - 158, 4, 50);
    this.applyWeather(GP.Weather.get());
    GP.Weather.load(function (s) { if (self.alive) self.applyWeather(s); });
  }

  /** Ciel (bandes, étoiles, nuages : LevelArt.sky), puis filtre et pluie via WeatherFX. Jamais la physique. */
  applyWeather(st) {
    this.weather = st;
    this.sky.set(st);
    this.wx.set(st); this.wxWidget.set(st);
  }

  // ---------- Entrées ----------
  makeInput() {
    var self = this, kb = this.input.keyboard;
    this.keys = kb.addKeys({ left: 'LEFT', right: 'RIGHT', up: 'UP', a: 'A', q: 'Q', d: 'D', z: 'Z', w: 'W', space: 'SPACE' });
    this.touch = { left: false, right: false, down: false, jump: false };   // « down » (accroupi) servira au niveau 3
    this.jumpWasDown = false;
    kb.on('keydown-ESC', function () { self.onEsc(); });
    kb.on('keydown-H', function () { if (self.help) self.help.close(); });
    kb.on('keydown-M', function () { GP.Progression.muted = !GP.Progression.muted; self.toast(GP.Progression.muted ? 'SON COUPÉ' : 'SON ACTIVÉ'); });
    kb.on('keydown-UP', function () { if (self.pauseMenu) self.pauseMove(-1); });
    kb.on('keydown-DOWN', function () { if (self.pauseMenu) self.pauseMove(1); });
    kb.on('keydown-ENTER', function () { if (self.pauseMenu) self.pauseItems[self.pauseSel].cb(); });
    if (GP.Config.DEV_TOOLS) {
      kb.on('keydown-N', function () {
        var s = GP.Weather.nextSim();
        if (s) { self.applyWeather(s); self.toast('MÉTÉO TEST : ' + s.simName); }
        else { self.toast('MÉTÉO RÉELLE'); GP.Weather.load(function (st) { if (self.alive) self.applyWeather(st); }); }
      });
      kb.on('keydown-K', function () { if (!self.paused && !self.finished) self.pixels.forEach(function (p) { if (!p.taken) self.collect(p, true); }); });
    }
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
  }

  /** Boutons à l'écran sur appareil tactile (gauche, droite, saut, pause). */
  /** Boutons à l'écran sur écran tactile (gauche, droite, accroupi, saut, pause) : voir GP.UI.touchPad. */
  makeTouch() {
    var self = this;
    GP.UI.touchPad(this, this.touch, function () { self.onEsc(); });
  }

  // ---------- Boucle ----------
  update(time, delta) {
    this.sky.update(this.cameras.main, delta);
    if (this.paused || this.finished || this.dying || !this.player) return;
    var dt = Math.min(delta, 50), p = this.player, b = p.body, k = this.keys, U = this.TUNE;
    if (this.introMs > 0) { this.introMs -= dt; b.setVelocityX(0); return; }
    this.time_ms += dt;

    // entrées (clavier, tactile ou robot de test)
    var bot = this.bot ? this.bot.step(this) : null;
    var left = bot ? bot.left : (k.left.isDown || k.a.isDown || k.q.isDown || this.touch.left);
    var right = bot ? bot.right : (k.right.isDown || k.d.isDown || this.touch.right);
    var jumpDown = bot ? bot.jump : (k.space.isDown || k.up.isDown || k.z.isDown || k.w.isDown || this.touch.jump);
    var jumpPressed = jumpDown && !this.jumpWasDown, jumpReleased = !jumpDown && this.jumpWasDown;
    this.jumpWasDown = jumpDown;

    // course : accélération douce vers la vitesse cible
    var dir = (right ? 1 : 0) - (left ? 1 : 0), onGround = b.blocked.down;
    var target = dir * U.speed, a = (onGround ? U.accelGround : U.accelAir) * dt / 1000;
    b.setVelocityX(b.velocity.x + Phaser.Math.Clamp(target - b.velocity.x, -a, a));
    if (dir) p.setFlipX(dir < 0);

    // saut : temps de grâce au bord (coyote), tampon d'appui, saut variable
    this.coyote = onGround ? U.coyote : this.coyote - dt;
    this.buffer = jumpPressed ? U.buffer : this.buffer - dt;
    if (onGround) this.jumping = false;
    if (this.buffer > 0 && this.coyote > 0) {
      b.setVelocityY(U.jump); this.buffer = 0; this.coyote = 0; this.jumping = true;
      GP.Sfx.play('step');
    }
    if (jumpReleased && this.jumping && b.velocity.y < 0) { b.setVelocityY(b.velocity.y * U.cut); this.jumping = false; }

    // animation
    var anim = !onGround ? 'hero-jump' : (Math.abs(b.velocity.x) > 12 ? 'hero-walk' : 'hero-idle');
    if (p.anims.getName() !== anim) p.play(anim);

    // invulnérabilité : transparence fixe (pas de clignotement)
    if (this.invuln > 0) { this.invuln -= dt; if (this.invuln <= 0) p.setAlpha(1); }

    this.checkWorld();
    this.updateHud();
  }

  /** Contacts : ronces, chute, lanternes, panneaux, pixels. */
  checkWorld() {
    var self = this, p = this.player, b = p.body;
    var bx = b.x, by = b.y, bw = b.width, bh = b.height;
    if (by > this.H + 10) { this.die('CHUTE !'); return; }
    if (this.invuln <= 0) {
      for (var i = 0; i < this.thorns.length; i++) {
        var t = this.thorns[i];
        if (bx < t.x + t.w && bx + bw > t.x && by < t.y + t.h && by + bh > t.y) { this.die('AÏE, LES RONCES !'); return; }
      }
    }
    this.lanterns.forEach(function (l) {
      if (!l.lit && p.x >= l.x - 6) {
        l.lit = true; l.img.setTexture('lv_lantern_on');
        self.respawn = { x: l.x, y: l.y };
        GP.Sfx.play('confirm');
        self.toast('POINT DE CONTRÔLE');
      }
    });
    this.signs.forEach(function (s) {
      var near = Math.abs(p.x - s.x) < 40;
      if (near !== s.shown) { s.shown = near; self.tweens.add({ targets: s.text, alpha: near ? 1 : 0, duration: 160 }); }
    });
    this.pixels.forEach(function (px) {
      if (!px.taken && bx < px.x + 5 && bx + bw > px.x - 5 && by < px.y + 5 && by + bh > px.y - 5) self.collect(px);
    });
  }

  /** Ramassage : le pixel s'envole vers l'image du HUD, qui révèle le groupe suivant. */
  collect(px, quiet) {
    px.taken = true;
    this.tweens.killTweensOf(px.img);
    px.img.destroy();
    var color = this.pc.reveal(), cam = this.cameras.main, self = this;
    if (!quiet) GP.Sfx.play('select');
    if (!GP.reducedMotion && !quiet) {
      var sp = this.add.image(px.x - cam.scrollX, px.y - cam.scrollY, 'spark').setScrollFactor(0).setDepth(70).setTint(color).setScale(2);
      this.tweens.add({ targets: sp, x: 26, y: 24, scale: 1, duration: 450, ease: 'Quad.easeIn', onComplete: function () { sp.destroy(); } });
    }
    this.updateHud();
    if (this.pc.done()) this.finish();
  }

  /**
   * Mort (ronce ou chute) : +1 au compteur MORTS, courte animation (pose de saut, petit bond, fondu ;
   * pas de clignotement), retour à la dernière lanterne, puis brève invulnérabilité en transparence fixe.
   */
  die(msg) {
    var self = this, p = this.player, U = this.TUNE;
    if (this.dying) return;
    this.dying = true;
    this.deaths++;
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
        p.body.reset(self.respawn.x, self.respawn.y);
        p.setAlpha(0.45);
        self.invuln = U.invuln;
        self.jumping = false; self.buffer = 0;
        self.dying = false;
      }
    });
  }

  finish() {
    var self = this;
    if (this.finished) return;
    this.finished = true;
    this.physics.pause();
    this.player.play('hero-cheer');
    GP.Sfx.play('unlock');
    var t = GP.UI.txt(this, GP.Config.WIDTH / 2, 110, 'IMAGE COMPLÈTE !', GP.PAL.g, { fontSize: '16px', backgroundColor: GP.PAL.k, padding: { x: 6, y: 6 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(80).setScale(0.6);
    this.tweens.add({ targets: t, scale: 1, duration: GP.reducedMotion ? 1 : 260, ease: 'Back.easeOut' });
    this.time.delayedCall(1700, function () {
      self.cameras.main.fadeOut(350, 20, 24, 46);
      self.cameras.main.once('camerafadeoutcomplete', function () {
        self.scene.start('Result', { index: self.index, pixels: self.pc.count, total: self.pc.total, deaths: self.deaths, time: self.time_ms / 1000 });
      });
    });
  }

  // ---------- Pause ----------
  onEsc() {
    if (this.finished) return;
    if (this.help) { this.help.close(); return; }
    if (this.pauseMenu) this.resume(); else this.pause();
  }

  pause() {
    var self = this;
    this.paused = true;
    this.physics.pause();
    this.player.anims.pause();
    var m = this.pauseMenu = GP.UI.modal(this, 'PAUSE', 'ÉCHAP : REPRENDRE', { x: 120, y: 56, w: 240, h: 128 });
    this.pauseItems = [
      { label: 'REPRENDRE', cb: function () { self.resume(); } },
      { label: 'COMMENT JOUER ?', cb: function () { self.openHelp(); } },
      { label: 'QUITTER VERS LA CARTE', cb: function () { self.quit(); } }
    ];
    this.pauseBtns = this.pauseItems.map(function (it, i) {
      var b = GP.UI.button(self, 150, 90 + i * 26, 180, it.label, it.cb, { primary: i === 0 });
      m.add(b.objs);
      b.box.on('pointerover', function () { self.pauseSel = i; self.pauseHover(); });
      return b;
    });
    this.pauseSel = 0; this.pauseHover();
    GP.Sfx.play('select');
  }
  pauseMove(d) { this.pauseSel = (this.pauseSel + d + 3) % 3; GP.Sfx.play('step'); this.pauseHover(); }
  pauseHover() { var s = this.pauseSel; this.pauseBtns.forEach(function (b, i) { b.hover(i === s); }); }

  resume() {
    if (this.pauseMenu) { this.pauseMenu.destroy(); this.pauseMenu = null; }
    this.paused = false;
    this.physics.resume();
    this.player.anims.resume();
    GP.Sfx.play('back');
  }

  openHelp() {
    var self = this;
    if (this.pauseMenu) { this.pauseMenu.destroy(); this.pauseMenu = null; }
    this.help = GP.UI.help(this, 1, { onClose: function () { self.help = null; self.pause(); } });
  }

  quit() {
    var self = this;
    GP.Sfx.play('back');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Map'); });
  }
};
