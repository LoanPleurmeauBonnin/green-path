/**
 * CharacterScene — créateur de personnage.
 * Haut/Bas : choisir une ligne · Gauche/Droite : changer · Espace : animation d'aperçu
 * Entrée : valider (ligne VALIDER) ou valeur suivante · Échap : retour
 * Reçoit { from: 'start' | 'menu' } : après validation, 'start' ouvre la carte, 'menu' revient au menu.
 */
GP.Scenes.Character = class CharacterScene extends Phaser.Scene {
  constructor() { super('Character'); }

  init(data) { this.from = (data && data.from) || 'menu'; }

  txt(x, y, s, color, extra) {
    return this.add.text(x, y, s, Object.assign({ fontFamily: GP.Config.FONT, fontSize: '8px', color: color || GP.PAL.w }, extra || {}));
  }

  create() {
    var self = this, W = GP.Config.WIDTH, H = GP.Config.HEIGHT, C = GP.Character, P = GP.PAL;
    this.cfg = Object.assign({}, GP.Progression.data.character || C.defaultConfig());
    this.sel = 0;
    this.presetIdx = 0;
    this.poseIdx = 0;
    this.lastKey = null;
    this.leaving = false;

    this.cameras.main.fadeIn(300, 20, 24, 46);
    this.add.image(0, 0, GP.UI.backdropKey(this)).setOrigin(0);
    this.add.rectangle(0, 0, W, H, GP.int(P.k), 0.82).setOrigin(0);
    this.txt(14, 10, 'TON AVATAR', P.g);
    this.txt(14, 21, "IL T'ACCOMPAGNE TOUT LE PARCOURS", P.m);

    // carte d'aperçu
    this.add.rectangle(14, 34, 152, 190, GP.int(P.k)).setOrigin(0);
    this.add.rectangle(16, 36, 148, 186, GP.int(P.d)).setOrigin(0);
    this.preview = this.add.image(90, 204, 'cp_idle0').setOrigin(0.5, 1).setScale(8);
    this.add.zone(16, 36, 148, 186).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerdown', function () { self.nextPose(); });

    // lignes
    this.rows = [];
    var y0 = 34, dy = 14;
    C.OPTIONS.forEach(function (opt, i) { self.makeRow(i, y0 + i * dy, opt.label, { opt: opt }); });
    var n = C.OPTIONS.length;
    this.makeRow(n, y0 + n * dy, 'MODÈLE', { kind: 'preset' });
    this.makeRow(n + 1, y0 + (n + 1) * dy, 'ALÉATOIRE', { kind: 'random' });
    this.makeRow(n + 2, y0 + (n + 2) * dy, 'VALIDER', { kind: 'ok' });

    this.txt(W / 2, H - 14, 'HAUT/BAS  < > CHANGER  ESPACE ANIMER', P.m).setOrigin(0.5);

    var kb = this.input.keyboard;
    kb.on('keydown-UP', function () { self.move(-1); });
    kb.on('keydown-W', function () { self.move(-1); });
    kb.on('keydown-DOWN', function () { self.move(1); });
    kb.on('keydown-S', function () { self.move(1); });
    kb.on('keydown-LEFT', function () { self.change(self.sel, -1); });
    kb.on('keydown-A', function () { self.change(self.sel, -1); });
    kb.on('keydown-RIGHT', function () { self.change(self.sel, 1); });
    kb.on('keydown-D', function () { self.change(self.sel, 1); });
    kb.on('keydown-ENTER', function () { self.activate(self.sel); });
    kb.on('keydown-SPACE', function () { self.nextPose(); });
    kb.on('keydown-ESC', function () { self.leave('Menu'); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); });

    this.rebuildPreview();
    this.refreshRows();
  }

  // ---------- lignes ----------
  makeRow(i, y, label, def) {
    var self = this, P = GP.PAL;
    var bg = this.add.rectangle(176, y, 290, 13, GP.int(P.d), 0).setOrigin(0).setInteractive({ useHandCursor: true });
    var lab = this.txt(182, y + 3, label, P.m);
    var row = { def: def, bg: bg, label: lab };
    if (def.opt) {
      row.sw = this.add.rectangle(318, y + 3, 8, 8, 0).setOrigin(0).setVisible(false);
      row.val = this.txt(386, y + 3, '', P.w).setOrigin(0.5, 0);
      row.l = this.txt(302, y + 3, '<', P.g).setPadding(4, 3, 4, 3).setInteractive({ useHandCursor: true });
      row.r = this.txt(452, y + 3, '>', P.g).setPadding(4, 3, 4, 3).setInteractive({ useHandCursor: true });
      row.l.on('pointerdown', function () { self.sel = i; self.change(i, -1); });
      row.r.on('pointerdown', function () { self.sel = i; self.change(i, 1); });
    } else if (def.kind === 'preset') {
      row.val = this.txt(386, y + 3, '', P.w).setOrigin(0.5, 0);
      row.l = this.txt(302, y + 3, '<', P.g).setPadding(4, 3, 4, 3).setInteractive({ useHandCursor: true });
      row.r = this.txt(452, y + 3, '>', P.g).setPadding(4, 3, 4, 3).setInteractive({ useHandCursor: true });
      row.l.on('pointerdown', function () { self.sel = i; self.change(i, -1); });
      row.r.on('pointerdown', function () { self.sel = i; self.change(i, 1); });
    }
    bg.on('pointerover', function () { self.sel = i; self.refreshRows(); });
    bg.on('pointerdown', function () { self.sel = i; self.refreshRows(); if (!def.opt && def.kind !== 'preset') self.activate(i); });
    this.rows.push(row);
  }

  refreshRows() {
    var C = GP.Character, P = GP.PAL, self = this;
    this.rows.forEach(function (r, i) {
      var on = i === self.sel, def = r.def;
      r.bg.setFillStyle(GP.int(def.kind === 'ok' ? P.G : P.d), on ? 1 : (def.kind === 'ok' ? 0.7 : 0));
      r.label.setColor(on ? P.w : (def.kind === 'ok' ? P.g : P.m));
      if (def.opt) {
        var e = def.opt.list.filter(function (x) { return x.id === self.cfg[def.opt.key]; })[0] || def.opt.list[0];
        r.val.setText(e.name).setColor(on ? P.w : P.c);
        var sw = C.swatch(def.opt, e.id);
        if (def.opt.sw) { r.sw.setVisible(true).setFillStyle(GP.int(sw || P.s)); r.sw.setStrokeStyle(1, GP.int(P.k)); r.sw.x = 386 - e.name.length * 4 - 12; }
        else r.sw.setVisible(false);
        r.l.setAlpha(on ? 1 : 0.4); r.r.setAlpha(on ? 1 : 0.4);
      } else if (def.kind === 'preset') {
        r.val.setText('MODÈLE ' + (self.presetIdx + 1) + '/8').setColor(on ? P.w : P.c);
        r.l.setAlpha(on ? 1 : 0.4); r.r.setAlpha(on ? 1 : 0.4);
      }
    });
  }

  move(d) {
    this.sel = (this.sel + d + this.rows.length) % this.rows.length;
    GP.Sfx.play('step');
    this.refreshRows();
  }

  change(i, d) {
    var C = GP.Character, def = this.rows[i].def;
    if (def.opt) {
      var list = def.opt.list, idx = 0;
      list.forEach(function (e, k) { if (e.id === this.cfg[def.opt.key]) idx = k; }, this);
      this.cfg[def.opt.key] = list[(idx + d + list.length) % list.length].id;
    } else if (def.kind === 'preset') {
      this.presetIdx = (this.presetIdx + d + C.PRESETS.length) % C.PRESETS.length;
      this.cfg = Object.assign({}, C.PRESETS[this.presetIdx]);
    } else return;
    GP.Sfx.play('step');
    this.rebuildPreview();
    this.refreshRows();
  }

  activate(i) {
    var def = this.rows[i].def;
    if (def.kind === 'random') {
      this.cfg = GP.Character.randomConfig();
      GP.Sfx.play('select');
      this.rebuildPreview();
      this.refreshRows();
    } else if (def.kind === 'ok') this.validate();
    else this.change(i, 1);
  }

  // ---------- aperçu ----------
  rebuildPreview() { GP.Character.build(this, this.cfg, 'cp_'); this.lastKey = null; }

  nextPose() { this.poseIdx = (this.poseIdx + 1) % 4; this.lastKey = null; GP.Sfx.play('step'); }

  update(time) {
    var poses = [
      { name: 'REPOS', frames: ['idle0', 'idle1'], ms: 500 }, { name: 'MARCHE', frames: ['walk0', 'walk1', 'walk2', 'walk3'], ms: 140 },
      { name: 'SAUT', frames: ['jump'], ms: 300 }, { name: 'JOIE', frames: ['cheer0', 'cheer1'], ms: 280 }
    ], p = poses[this.poseIdx];
    var key = 'cp_' + p.frames[Math.floor(time / p.ms) % p.frames.length];
    if (key !== this.lastKey && this.textures.exists(key)) { this.preview.setTexture(key); this.lastKey = key; }
  }

  // ---------- sortie ----------
  validate() {
    GP.Progression.setCharacter(this.cfg);
    GP.Character.build(this, this.cfg);
    GP.Sfx.play('unlock');
    this.leave(this.from === 'start' ? 'Map' : 'Menu');
  }

  leave(next) {
    var self = this;
    if (this.leaving) return;
    this.leaving = true;
    if (next === 'Menu') GP.Sfx.play('back');
    this.cameras.main.fadeOut(250, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(next); });
  }
};
