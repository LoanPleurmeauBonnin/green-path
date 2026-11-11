/**
 * MenuScene — écran titre : continuer / commencer, personnaliser l'avatar, réinitialiser, à propos.
 */
GP.Scenes.Menu = class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  txt(x, y, s, color, size, extra) {
    return this.add.text(x, y, s, Object.assign({ fontFamily: GP.Config.FONT, fontSize: (size || 8) + 'px', color: color || GP.PAL.w }, extra || {}));
  }

  create() {
    var W = GP.Config.DW, H = GP.Config.HEIGHT, self = this;
    this.modal = null; this.about = null;
    this.cameras.main.fadeIn(400, 20, 24, 46);

    GP.UI.backdrop(this, 0.72);

    // titre
    this.txt(W / 2 + 3, 43, 'GREEN PATH', GP.PAL.k, 32).setOrigin(0.5);
    var title = this.txt(W / 2, 40, 'GREEN PATH', GP.PAL.g, 32).setOrigin(0.5);
    if (!GP.reducedMotion) this.tweens.add({ targets: title, y: 38, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.txt(W / 2, 70, 'NANTES', GP.PAL.c, 8).setOrigin(0.5);

    // ligne verte + personnage qui marche
    var g = this.add.graphics();
    var DX = GP.Config.DX;
    for (var x = 20 - DX; x < W - 20 + DX; x += 8) { g.fillStyle(GP.int(GP.PAL.h), 1); g.fillRect(x, 96, 6, 4); g.fillStyle(GP.int(GP.PAL.g), 1); g.fillRect(x + 1, 97, 4, 2); }
    var hero = this.add.sprite(20 - DX, 99, 'hero_idle').setOrigin(0.5, 1).play('hero-walk');
    if (!GP.reducedMotion) this.tweens.add({ targets: hero, x: W - 20 + DX, duration: 7000, repeat: -1, onRepeat: function () { hero.x = 20 - DX; } });

    // menu
    this.mode = 'main';
    this.sel = 0;
    this.items = [];
    this.buildMain();

    this.hint = this.txt(W / 2, H - 14, '', GP.PAL.m, 8).setOrigin(0.5);
    GP.Prompts.bind(this, this.hint, '{navY} CHOISIR  {confirm} VALIDER  {back} RETOUR');

    // sélecteur de langue : petit bouton en haut à droite de l'écran (FR ↔ EN), touche L
    var lb = this.add.rectangle(W + DX - 6, 6 - 0, 30, 15, GP.int(GP.PAL.d), 0.95).setOrigin(1, 0).setStrokeStyle(2, GP.int(GP.PAL.k)).setInteractive({ useHandCursor: true });
    var lt = this.txt(W + DX - 21, 10, GP.I18n.lang.toUpperCase(), GP.PAL.w, 8).setOrigin(0.5, 0);
    lb.on('pointerover', function () { lb.setFillStyle(GP.int(GP.PAL.G), 0.95); });
    lb.on('pointerout', function () { lb.setFillStyle(GP.int(GP.PAL.d), 0.95); });
    lb.on('pointerdown', function () { self.toggleLang(); });

    var kb = this.input.keyboard;
    kb.on('keydown-UP', function () { self.move(-1); });
    kb.on('keydown-DOWN', function () { self.move(1); });
    kb.on('keydown-W', function () { self.move(-1); });
    kb.on('keydown-S', function () { self.move(1); });
    kb.on('keydown-ENTER', function () { self.activate(); });
    kb.on('keydown-SPACE', function () { self.activate(); });
    kb.on('keydown-ESC', function () {
      if (self.modal) { self.modal.close(); return; }
      if (self.mode !== 'main') { GP.Sfx.play('back'); self.buildMain(); }
    });
    kb.on('keydown-L', function () { if (!self.modal) self.toggleLang(); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
    kb.on('keydown-M', function () { GP.Progression.muted = !GP.Progression.muted; });
  }

  /** FR ↔ EN : on garde le choix et on refait l'écran (les textes déjà affichés restent dans l'ancienne langue sinon). */
  toggleLang() {
    GP.Sfx.play('select');
    GP.Settings.set({ lang: GP.I18n.lang === 'fr' ? 'en' : 'fr' });
    this.input.keyboard.removeAllListeners();
    this.scene.restart();
  }

  clear() {
    this.items.forEach(function (it) { it.box.destroy(); it.label.destroy(); });
    if (this.about) { this.about.forEach(function (o) { o.destroy(); }); this.about = null; }
    this.items = [];
  }

  setItems(list, top, step) {
    var self = this, W = GP.Config.DW;
    this.clear();
    list.forEach(function (def, i) {
      var y = top + i * (step || 26);
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
    if (this.modal) return;
    var it = this.items[this.sel];
    if (it) { GP.Sfx.play('confirm'); it.def.action.call(this); }
  }

  buildMain() {
    var self = this, has = GP.Save.hasProgress();
    this.mode = 'main';
    var list = [{ label: has ? 'CONTINUER' : 'COMMENCER', action: function () { self.start(); } }];
    list.push({ label: "PERSONNALISER L'AVATAR", action: function () { self.openCreator('menu'); } });
    if (has) list.push({ label: 'RÉINITIALISER', action: function () { self.buildConfirm(); } });
    list.push({ label: 'CLASSEMENT', action: function () { self.goTo('Score'); } });
    list.push({ label: 'OPTIONS', action: function () { self.goTo('Options'); } });
    list.push({ label: 'CRÉDITS', action: function () { self.buildCredits(); } });
    this.setItems(list, 116, 23);
  }

  buildConfirm() {
    var self = this;
    this.mode = 'confirm';
    this.setItems([
      { label: 'OUI, EFFACER', action: function () { GP.Progression.reset(); GP.Character.build(self, GP.Character.defaultConfig()); GP.Sfx.play('back'); self.buildMain(); } },
      { label: 'ANNULER', action: function () { self.buildMain(); } }
    ], 150);
    this.about = [this.txt(GP.Config.DW / 2, 120, 'EFFACER TOUTE LA PROGRESSION ?', GP.PAL.o, 8).setOrigin(0.5)];
  }

  /** Fenêtre CRÉDITS : l'équipe et les rôles. */
  buildCredits() {
    this.goTo('About', { section: 0 });
  }

  /** Fenêtre CONFIDENTIALITÉ (pages), depuis les crédits. */
  openPrivacy() {
    this.goTo('About', { section: 1 });
  }

  /** Introduction du gardien de la ligne verte, montrée une seule fois : après le premier COMMENCER, avant le créateur. */
  buildIntro(page) {
    var self = this, W = GP.Config.DW;
    this.mode = 'intro';
    var pages = GP.UI.paginate(this, [GP.L('intro')], 356, 64), cur = page || 0;
    this.setItems([{ label: 'CONTINUER', action: function () {
      if (cur < pages.length - 1) { self.buildIntro(cur + 1); return; }
      GP.Progression.data.introSeen = true; GP.Progression.persist(); self.start();
    } }], 232);
    var box = this.add.rectangle(W / 2, 168, 384, 100, GP.int(GP.PAL.d), 0.95).setStrokeStyle(2, GP.int(GP.PAL.k));
    var title = this.txt(62, 128, GP.t('LE VOYAGE') + ' ' + (cur + 1) + '/' + pages.length, GP.PAL.g, 8);
    var t = this.txt(62, 146, pages[cur], GP.PAL.w, 8, { wordWrap: { width: 356 }, lineSpacing: 4 });
    this.about = [box, title, t];
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
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(key, data || {}); });
  }
};
