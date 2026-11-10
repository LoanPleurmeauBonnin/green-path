/**
 * OptionsScene — langue, son, plein écran, touches du clavier, manette, confidentialité, effacement des données.
 * Haut/Bas : choisir · Gauche/Droite : changer · Entrée : valider · Échap : retour. Manette : croix, A, B (voir GP.Pad).
 * Écran à mise en page fixe (480×270, centré) : voir GP.UI.backdrop.
 */
GP.Scenes.Options = class OptionsScene extends Phaser.Scene {
  constructor() { super('Options'); }

  init(data) { this.startSel = (data && data.sel) || 0; this.startMode = (data && data.mode) || 'main'; }

  txt(x, y, s, color) {
    return this.add.text(x, y, s, { fontFamily: GP.Config.FONT, fontSize: '8px', color: color || GP.PAL.w });
  }

  create() {
    var self = this, P = GP.PAL, W = GP.Config.DW, H = GP.Config.HEIGHT;
    this.cameras.main.fadeIn(250, 20, 24, 46);
    GP.UI.backdrop(this, 0.85);
    this.mode = this.startMode; this.sel = this.startSel; this.slot = 0; this.capturing = null; this.modal = null; this.confirm = false;
    this.title = this.txt(W / 2, 12, 'OPTIONS', P.g).setOrigin(0.5, 0);
    this.hint = this.add.text(W / 2, H - 22, '', { fontFamily: GP.Config.FONT, fontSize: '8px', color: P.m, align: 'center', wordWrap: { width: 440 }, lineSpacing: 3 }).setOrigin(0.5, 0);
    this.layer = [];
    this.build();

    var kb = this.input.keyboard;
    kb.on('keydown-UP', function () { self.move(-1); });
    kb.on('keydown-DOWN', function () { self.move(1); });
    kb.on('keydown-LEFT', function () { self.side(-1); });
    kb.on('keydown-RIGHT', function () { self.side(1); });
    kb.on('keydown-ENTER', function () { self.activate(); });
    kb.on('keydown-SPACE', function () { self.activate(); });
    kb.on('keydown-ESC', function () { self.back(); });
    kb.on('keydown', function (ev) { self.onAnyKey(ev); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); GP.Pad.capture = false; });
  }

  // ---------- lignes ----------
  /** Lignes de l'écran courant : { label, value(), act(), left(), right() }. */
  rows() {
    var self = this;
    if (this.confirm) return [
      { label: 'OUI, EFFACER', act: function () { GP.Settings.clearAll(); self.confirm = false; self.toast('DONNÉES EFFACÉES'); self.scene.restart({ sel: 0 }); } },
      { label: 'ANNULER', act: function () { self.confirm = false; self.build(); } }
    ];
    if (this.mode === 'keys') return this.keyRows();
    var fsOk = this.fsSupported(), isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    return [
      { label: 'LANGUE', value: function () { return GP.I18n.lang === 'fr' ? 'FRANÇAIS' : 'ENGLISH'; }, arrows: true,
        act: function () { self.lang(); }, left: function () { self.lang(); }, right: function () { self.lang(); } },
      { label: 'SON', value: function () { return GP.Progression.muted ? 'COUPÉ' : 'ACTIVÉ'; }, arrows: true,
        act: function () { self.sound(); }, left: function () { self.sound(); }, right: function () { self.sound(); } },
      { label: 'PLEIN ÉCRAN', value: function () { return fsOk ? (isFs ? 'DÉSACTIVER' : 'ACTIVER') : 'NON DISPONIBLE ICI'; },
        act: function () { self.fullscreen(); } },
      { label: 'COMPTE', value: function () { return GP.Cloud.isAccount ? GP.Cloud.pseudo : 'INVITÉ'; },
        act: function () { GP.Account.open({ mode: GP.Cloud.isAccount ? 'manage' : 'choose', onDone: function () { if (self.sys && self.sys.isActive()) self.build(); } }); } },
      { label: 'TOUCHES', value: function () { return '>'; }, act: function () { self.mode = 'keys'; self.sel = 0; self.slot = 0; self.build(); } },
      { label: 'MANETTE', value: function () { return GP.Pad.connected ? 'DÉTECTÉE' : 'NON DÉTECTÉE'; }, act: function () {} },
      { label: 'CONFIDENTIALITÉ', value: function () { return '>'; }, act: function () { self.privacy(); } },
      { label: 'EFFACER MES DONNÉES', value: function () { return ''; }, act: function () { self.confirm = true; self.sel = 1; self.build(); } },
      { label: 'RETOUR', value: function () { return ''; }, act: function () { self.leave(); } }
    ];
  }

  /** Écran des touches : une ligne par action, 3 emplacements, puis « par défaut » et retour. */
  keyRows() {
    var self = this, names = { left: 'GAUCHE', right: 'DROITE', jump: 'SAUTER', up: 'GRIMPER', down: "S'ACCROUPIR" };
    var rows = GP.Settings.ACTIONS.map(function (a) { return { action: a, label: names[a], keys: true }; });
    rows.push({ label: 'TOUCHES PAR DÉFAUT', act: function () { GP.Settings.resetKeys(); self.toast('TOUCHES PAR DÉFAUT'); self.build(); } });
    rows.push({ label: 'RETOUR', act: function () { self.mode = 'main'; self.sel = 4; self.build(); } });
    return rows;
  }

  build() {
    var self = this, P = GP.PAL, W = GP.Config.DW;
    this.layer.forEach(function (o) { o.destroy(); }); this.layer = [];
    this.rowsList = this.rows();
    this.sel = Math.max(0, Math.min(this.sel, this.rowsList.length - 1));
    this.title.setText(this.confirm ? 'EFFACER LES DONNÉES DE CE NAVIGATEUR ?' : (this.mode === 'keys' ? 'TOUCHES' : 'OPTIONS'));
    var top = this.mode === 'keys' && !this.confirm ? 56 : (this.confirm ? 100 : 30), step = this.mode === 'keys' && !this.confirm ? 24 : (this.confirm ? 26 : 22);
    if (this.mode === 'keys' && !this.confirm) {
      ['ACTION', 'TOUCHE 1', 'TOUCHE 2', 'TOUCHE 3'].forEach(function (h, i) { self.layer.push(self.txt(i ? 207 + (i - 1) * 83 : 70, 38, h, P.m).setOrigin(i ? 0.5 : 0, 0)); });
    }
    if (this.confirm && GP.Cloud.isAccount) this.layer.push(this.txt(W / 2, 60, "TON COMPTE EN LIGNE N'EST PAS SUPPRIMÉ : OPTIONS > COMPTE.", P.o).setOrigin(0.5, 0));
    this.rowsList.forEach(function (r, i) {
      var y = top + i * step, wide = self.confirm ? 240 : 360, x0 = (W - wide) / 2;
      var bg = self.add.rectangle(x0, y - 3, wide, 20, GP.int(P.d), 0.9).setOrigin(0).setStrokeStyle(2, GP.int(P.k)).setInteractive({ useHandCursor: true });
      r.bg = bg; self.layer.push(bg);
      bg.on('pointerover', function () { if (!self.capturing && !self.modal) { self.sel = i; self.refresh(); } });
      bg.on('pointerdown', function () { if (self.capturing || self.modal) return; self.sel = i; self.refresh(); if (!r.keys) self.activate(); else self.activate(); });
      if (self.confirm) { r.t = self.txt(W / 2, y + 3, r.label, P.w).setOrigin(0.5, 0); self.layer.push(r.t); return; }
      r.t = self.txt(x0 + 10, y + 3, r.label, P.w); self.layer.push(r.t);
      if (r.keys) {
        r.cells = [0, 1, 2].map(function (k) {
          var cx = 207 + k * 83, cell = self.add.rectangle(cx, y - 1, 78, 16, GP.int(P.k), 0.6).setStrokeStyle(2, GP.int(P.k)).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
          var t = self.txt(cx, y + 3, '', P.c).setOrigin(0.5, 0);
          cell.on('pointerdown', function () { if (self.capturing || self.modal) return; self.sel = i; self.slot = k; self.refresh(); self.activate(); });
          self.layer.push(cell, t);
          return { cell: cell, t: t };
        });
      } else {
        r.v = self.txt(x0 + wide - 10, y + 3, '', P.c).setOrigin(1, 0); self.layer.push(r.v);
      }
    });
    this.refresh();
  }

  refresh() {
    var P = GP.PAL, self = this;
    this.rowsList.forEach(function (r, i) {
      var on = i === self.sel;
      r.bg.setFillStyle(GP.int(on ? P.G : P.d), 0.95).setStrokeStyle(2, GP.int(on ? P.g : P.k));
      r.t.setColor(on ? P.w : P.m);
      if (r.v) r.v.setText(r.value ? (on && r.arrows ? '< ' + GP.t(r.value()) + ' >' : GP.t(r.value())) : '').setColor(on ? P.w : P.c);
      if (r.cells) r.cells.forEach(function (c, k) {
        var code = GP.Settings.keys[r.action][k], sel = on && self.slot === k, cap = self.capturing && self.capturing.row === i && self.capturing.slot === k;
        c.t.setText(cap ? '...' : GP.I18n.keyName(code)).setColor(sel ? P.w : (code ? P.c : P.e));
        c.cell.setStrokeStyle(2, GP.int(sel ? P.g : P.k)).setFillStyle(GP.int(sel ? P.G : P.k), sel ? 0.95 : 0.6);
      });
    });
    var h = this.capturing ? 'APPUIE SUR UNE TOUCHE (ÉCHAP : ANNULER)' : (this.mode === 'keys' && !this.confirm ? 'ENTRÉE : CHANGER   SUPPR : VIDER' : (this.confirm ? '' : 'HAUT/BAS  < > CHANGER  ENTRÉE'));
    this.hint.setText(h);
    if (!this.confirm && this.mode === 'main' && this.sel === 5) this.hint.setText((GP.Pad.connected ? '' : 'APPUIE SUR UN BOUTON DE LA MANETTE.  ') + 'MANETTE : STICK OU CROIX = BOUGER, A = SAUTER / VALIDER, START = PAUSE, B = RETOUR');
  }

  // ---------- actions ----------
  move(d) {
    if (this.capturing || this.modal) return;
    this.sel = (this.sel + d + this.rowsList.length) % this.rowsList.length; GP.Sfx.play('step'); this.refresh();
  }
  side(d) {
    if (this.capturing || this.modal) return;
    var r = this.rowsList[this.sel];
    if (r.keys) { this.slot = (this.slot + d + 3) % 3; GP.Sfx.play('step'); this.refresh(); return; }
    var f = d < 0 ? r.left : r.right; if (f) f();
  }
  activate() {
    if (this.modal || this.capturing) return;
    var r = this.rowsList[this.sel];
    if (r.keys) { this.capturing = { row: this.sel, slot: this.slot }; GP.Pad.capture = true; GP.Sfx.play('select'); this.refresh(); return; }
    if (r.act) { GP.Sfx.play('confirm'); r.act(); }
  }
  back() {
    if (this.modal) { this.modal.close(); return; }
    if (this.capturing) { this.endCapture(); return; }
    if (this.confirm) { this.confirm = false; this.build(); return; }
    if (this.mode === 'keys') { this.mode = 'main'; this.sel = 4; this.build(); return; }
    this.leave();
  }
  leave() {
    var self = this; GP.Sfx.play('back');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(200, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Menu'); });
  }

  endCapture() { this.capturing = null; GP.Pad.capture = false; this.refresh(); }

  /** Touche pressée pendant une réaffectation. */
  onAnyKey(ev) {
    var c = this.capturing;
    if (!c) return;
    var code = ev.keyCode, row = this.rowsList[c.row];
    if (ev.preventDefault) ev.preventDefault();
    if (code === 27) { this.endCapture(); return; }
    if (code === 8 || code === 46) { if (!GP.Settings.clearKey(row.action, c.slot)) this.toast('DERNIÈRE TOUCHE DE CETTE ACTION'); this.endCapture(); return; }
    var res = GP.Settings.setKey(row.action, c.slot, code);
    if (!res.ok) this.toast(res.reason === 'reserved' ? 'TOUCHE RÉSERVÉE' : 'DERNIÈRE TOUCHE DE CETTE ACTION');
    this.endCapture();
  }

  lang() {
    GP.Sfx.play('select');
    GP.Settings.set({ lang: GP.I18n.lang === 'fr' ? 'en' : 'fr' });
    this.input.keyboard.removeAllListeners();
    this.scene.restart({ sel: this.sel });
  }
  sound() { GP.Progression.muted = !GP.Progression.muted; GP.Sfx.play('select'); this.refresh(); }

  fsSupported() { var e = document.documentElement; return !!(e.requestFullscreen || e.webkitRequestFullscreen); }
  fullscreen() {
    var d = document, e = d.documentElement, self = this;
    if (!this.fsSupported()) { this.toast("IPHONE : PARTAGER > SUR L'ÉCRAN D'ACCUEIL"); return; }
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (e.requestFullscreen || e.webkitRequestFullscreen).call(e, { navigationUI: 'hide' });
    } catch (err) { /* refusé par le navigateur */ }
    setTimeout(function () { if (self.sys && self.sys.isActive()) self.build(); }, 350);
  }

  privacy() {
    var self = this;
    this.modal = GP.UI.pagedText(this, 'CONFIDENTIALITÉ', [1, 2, 3, 4, 5, 6].map(function (i) { return GP.L('privacy' + i); }), { onClose: function () { self.modal = null; } });
  }

  toast(msg) {
    if (this.toastObj) this.toastObj.destroy();
    var t = this.txt(GP.Config.DW / 2, 236, ' ' + msg + ' ', GP.PAL.w).setOrigin(0.5).setBackgroundColor(GP.PAL.k).setDepth(60);
    this.toastObj = t;
    this.tweens.add({ targets: t, alpha: 0, delay: 1800, duration: 400, onComplete: function () { t.destroy(); } });
  }
};
