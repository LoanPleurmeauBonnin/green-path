/**
 * MenuScene — écran titre : continuer / commencer, personnaliser l'avatar, réinitialiser, à propos.
 */
GP.Scenes.Menu = class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  txt(x, y, s, color, size, extra) {
    return this.add.text(x, y, s, Object.assign({ fontFamily: GP.Config.FONT, fontSize: (size || 8) + 'px', color: color || GP.PAL.w }, extra || {}));
  }

  create() {
    var W = GP.Config.WIDTH, H = GP.Config.HEIGHT, self = this;
    this.cameras.main.fadeIn(400, 20, 24, 46);

    this.add.image(0, 0, GP.UI.backdropKey(this)).setOrigin(0);
    this.add.rectangle(0, 0, W, H, GP.int(GP.PAL.k), 0.72).setOrigin(0);

    // titre
    this.txt(W / 2 + 3, 43, 'GREEN PATH', GP.PAL.k, 32).setOrigin(0.5);
    var title = this.txt(W / 2, 40, 'GREEN PATH', GP.PAL.g, 32).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 38, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.txt(W / 2, 70, 'NANTES', GP.PAL.c, 8).setOrigin(0.5);

    // ligne verte + personnage qui marche
    var g = this.add.graphics();
    for (var x = 20; x < W - 20; x += 8) { g.fillStyle(GP.int(GP.PAL.h), 1); g.fillRect(x, 96, 6, 4); g.fillStyle(GP.int(GP.PAL.g), 1); g.fillRect(x + 1, 97, 4, 2); }
    var hero = this.add.sprite(20, 96, 'hero_idle').setOrigin(0.5, 1).play('hero-walk');
    this.tweens.add({ targets: hero, x: W - 20, duration: 7000, repeat: -1, onRepeat: function () { hero.x = 20; } });

    // menu
    this.mode = 'main';
    this.sel = 0;
    this.items = [];
    this.buildMain();

    this.hint = this.txt(W / 2, H - 14, 'HAUT/BAS + ENTRÉE  -  OU CLIC', GP.PAL.m, 8).setOrigin(0.5);

    var kb = this.input.keyboard;
    kb.on('keydown-UP', function () { self.move(-1); });
    kb.on('keydown-DOWN', function () { self.move(1); });
    kb.on('keydown-W', function () { self.move(-1); });
    kb.on('keydown-S', function () { self.move(1); });
    kb.on('keydown-ENTER', function () { self.activate(); });
    kb.on('keydown-SPACE', function () { self.activate(); });
    kb.on('keydown-ESC', function () { if (self.mode !== 'main') { GP.Sfx.play('back'); self.buildMain(); } });
    kb.on('keydown-M', function () { GP.Progression.muted = !GP.Progression.muted; });
  }

  clear() {
    this.items.forEach(function (it) { it.box.destroy(); it.label.destroy(); });
    if (this.about) { this.about.forEach(function (o) { o.destroy(); }); this.about = null; }
    this.items = [];
  }

  setItems(list, top) {
    var self = this, W = GP.Config.WIDTH;
    this.clear();
    list.forEach(function (def, i) {
      var y = top + i * 26;
      var box = self.add.rectangle(W / 2, y, 240, 20, GP.int(GP.PAL.d), 0.95).setStrokeStyle(2, GP.int(GP.PAL.k));
      var label = self.txt(W / 2, y + 1, def.label, GP.PAL.w, 8).setOrigin(0.5);
      box.setInteractive({ useHandCursor: true });
      box.on('pointerover', function () { self.sel = i; self.refreshSel(); });
      box.on('pointerdown', function () { self.sel = i; self.activate(); });
      self.items.push({ box: box, label: label, def: def });
    });
    this.sel = 0;
    this.refreshSel();
  }

  refreshSel() {
    this.items.forEach(function (it, i) {
      var on = i === this.sel;
      it.box.setFillStyle(GP.int(on ? GP.PAL.G : GP.PAL.d), 0.95);
      it.box.setStrokeStyle(2, GP.int(on ? GP.PAL.g : GP.PAL.k));
      it.label.setColor(on ? GP.PAL.w : GP.PAL.m);
      it.label.setText((on ? '> ' : '  ') + it.def.label.replace(/^[> ]+/, ''));
    }, this);
  }

  move(d) {
    if (!this.items.length) return;
    this.sel = (this.sel + d + this.items.length) % this.items.length;
    GP.Sfx.play('step');
    this.refreshSel();
  }

  activate() {
    var it = this.items[this.sel];
    if (it) { GP.Sfx.play('confirm'); it.def.action.call(this); }
  }

  buildMain() {
    var self = this, has = GP.Save.hasProgress();
    this.mode = 'main';
    var list = [{ label: has ? 'CONTINUER' : 'COMMENCER', action: function () { self.start(); } }];
    list.push({ label: "PERSONNALISER L'AVATAR", action: function () { self.openCreator('menu'); } });
    if (has) list.push({ label: 'RÉINITIALISER', action: function () { self.buildConfirm(); } });
    list.push({ label: 'CRÉDITS', action: function () { self.buildCredits(); } });
    this.setItems(list, 138);
  }

  buildConfirm() {
    var self = this;
    this.mode = 'confirm';
    this.setItems([
      { label: 'OUI, EFFACER', action: function () { GP.Progression.reset(); GP.Character.build(self, GP.Character.defaultConfig()); GP.Sfx.play('back'); self.buildMain(); } },
      { label: 'ANNULER', action: function () { self.buildMain(); } }
    ], 150);
    this.about = [this.txt(GP.Config.WIDTH / 2, 120, 'EFFACER TOUTE LA PROGRESSION ?', GP.PAL.o, 8).setOrigin(0.5)];
  }

  /** Fenêtre CRÉDITS : l'équipe et les rôles. */
  buildCredits() {
    var self = this, W = GP.Config.WIDTH, P = GP.PAL;
    this.mode = 'about';
    this.setItems([{ label: 'RETOUR', action: function () { self.buildMain(); } }], 232);
    var box = this.add.rectangle(W / 2, 156, 360, 108, GP.int(P.d), 0.95).setStrokeStyle(2, GP.int(P.k));
    this.about = [box,
      this.txt(W / 2, 112, 'CRÉDITS', P.g, 8).setOrigin(0.5),
      this.txt(W / 2, 134, 'FLORINE RACINE', P.w, 8).setOrigin(0.5),
      this.txt(W / 2, 146, 'UX/UI DESIGNER, GAME DESIGN', P.m, 8).setOrigin(0.5),
      this.txt(W / 2, 170, 'LOAN PLEURMEAU', P.w, 8).setOrigin(0.5),
      this.txt(W / 2, 182, 'DÉVELOPPEUR WEB, IA OPS', P.m, 8).setOrigin(0.5),
      this.txt(W / 2, 200, 'ESD NANTES - PATRIMOINE.EXE', P.l, 8).setOrigin(0.5)];
  }

  /** Introduction du gardien de la ligne verte, montrée une seule fois : après le premier COMMENCER, avant le créateur. */
  buildIntro() {
    var self = this, W = GP.Config.WIDTH;
    this.mode = 'intro';
    this.setItems([{ label: 'CONTINUER', action: function () {
      GP.Progression.data.introSeen = true; GP.Progression.persist(); self.start();
    } }], 232);
    var box = this.add.rectangle(W / 2, 156, 420, 118, GP.int(GP.PAL.d), 0.95).setStrokeStyle(2, GP.int(GP.PAL.k));
    var t = this.txt(W / 2 - 200, 104,
      "Psst… par ici ! Je suis le gardien de la ligne verte. Cette nuit, un grand coup de vent a soufflé sur Nantes. Ses monuments se sont envolés en mille pixels ! Le château, la cathédrale, le jardin… 12 lieux attendent qu'on les reconstruise. Suis la ligne verte, ramasse les pixels et rends à Nantes ses monuments pour débloquer une illustration spéciale.",
      GP.PAL.w, 8, { wordWrap: { width: 400 }, lineSpacing: 4 });
    this.about = [box, t];
  }

  start() {
    if (!GP.Progression.data.introSeen) { this.buildIntro(); return; }
    if (!GP.Progression.data.character) { this.openCreator('start'); return; }
    this.goTo('Map');
  }

  openCreator(from) { this.goTo('Character', { from: from }); }

  goTo(key, data) {
    var self = this;
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(key, data); });
  }
};
