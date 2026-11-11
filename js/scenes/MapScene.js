/**
 * MapScene — carte du monde en vue de côté (sélecteur de niveaux façon plateforme).
 * Le héros marche de gauche à droite d'étape en étape le long de la ligne verte ; la caméra le suit.
 * Commandes : < / > (ou A / D) étape précédente / suivante, Entrée ou Espace fiche du lieu, clic sur un nœud,
 * H aide, Échap retour au menu (ou ferme la fenêtre), M son. Mode test (?dev=1) : W météo simulée.
 *
 * Profondeurs : ciel -40 à -30 · terrain 0 · décor 2-4 · monuments 5-8 · ligne 6 · nœuds 9-12 · héros 19-21
 *               météo 30-34 · interface 50-61 · fenêtres 100+
 */
GP.Scenes.Map = class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }

  txt(x, y, s, color, extra) {
    return this.add.text(x, y, s, Object.assign({ fontFamily: GP.Config.FONT, fontSize: '8px', color: color || GP.PAL.w }, extra || {}));
  }

  create() {
    var self = this;
    this.locs = GP.LOCATIONS;
    this.P = GP.Progression;
    this.moving = false;
    this.panel = null;
    this.help = null; this.sheet = null; this.toastObj = null;
    this.hover = -1;
    this.revealing = -1;
    this.cur = Math.min(this.P.data.current, this.locs.length - 1);
    this.travel = new GP.MapTravel(this.cur, this.locs.length, this.nx(0), GP.MapArt.GAP, GP.MapArt.walkY);
    this.alive = true;   // faux après la fermeture de la scène (réponses réseau tardives)
    this.events.once('shutdown', function () { self.alive = false; });

    this.cameras.main.fadeIn(350, 20, 24, 46);
    this.cameras.main.setBounds(0, 0, GP.MapArt.WIDTH, GP.Config.HEIGHT);
    this.sky = GP.LevelArt.sky(this, -40, { city: true, farBottom: 176, nearBottom: 186 });
    GP.MapArt.worldKeys.forEach(function (key, i) { self.add.image(i * GP.LevelArt.CHUNK, 0, key).setOrigin(0).setDepth(0); });
    this.makeDecor();
    this.pathG = this.add.graphics().setDepth(6);
    this.makeMonuments();
    this.makeNodes();
    this.makeHero();
    this.makeHud();
    this.makeWeather();

    // un niveau vient d'être terminé : on dévoile son monument à l'arrivée
    var just = this.P.takeJustCompleted();
    var ji = just ? this.indexOf(just) : -1;
    if (ji >= 0) this.revealing = ji;
    this.refresh();
    if (ji >= 0) this.time.delayedCall(500, function () { self.reveal(ji); });
    // après le premier niveau terminé : proposer pseudo + sauvegarde + classement (une seule fois ; on peut jouer en invité)
    if (GP.Cloud.shouldAsk()) this.time.delayedCall(ji >= 0 ? 3200 : 900, function () {
      if (self.alive && !self.panel && GP.Cloud.shouldAsk()) GP.Account.open({ mode: 'choose' });
    });

    var kb = this.input.keyboard;
    function move(d, ev) { if (!(ev && ev.repeat && GP.Prompts.device === 'gamepad')) self.step(d); }
    kb.on('keydown-LEFT', function (ev) { move(-1, ev); });
    kb.on('keydown-A', function (ev) { move(-1, ev); });
    kb.on('keydown-RIGHT', function (ev) { move(1, ev); });
    kb.on('keydown-D', function (ev) { move(1, ev); });
    kb.on('keydown-ENTER', function () { self.onConfirm(); });
    kb.on('keydown-SPACE', function () { self.onConfirm(); });
    kb.on('keydown-ESC', function () { self.onEsc(); });
    kb.on('keydown-H', function () { if (!self.panel) self.openHelp(); else if (self.panelKind === 'help') self.closePanel(); });
    kb.on('keydown-M', function () { self.P.muted = !self.P.muted; self.toast(self.P.muted ? 'SON COUPÉ' : 'SON ACTIVÉ'); });
    if (GP.Config.DEV_TOOLS) kb.on('keydown-W', function () { self.cycleWeather(); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
  }

  update(time, delta) {
    this.sky.update(this.cameras.main, delta);
    if (this.panel || GP.Pad.capture || !this.travel.moving) return;
    var arrived = this.travel.tick(delta);
    this.moving = this.travel.moving;
    this.placeHero(this.travel.x);
    if (arrived) {
      this.cur = this.travel.target; this.P.setCurrent(this.cur);
      this.startIdle(); this.updateBar(); GP.Sfx.play('select');
      if (this.travel.open) this.openPanel(this.cur);
    }
  }

  indexOf(id) {
    for (var i = 0; i < this.locs.length; i++) if (this.locs[i].id === id) return i;
    return -1;
  }
  nx(i) { return GP.MapArt.nodeX(i); }
  ny(i) { return GP.MapArt.pathY(this.nx(i)); }

  // ---------- décor ----------
  /**
   * Décor de la planche « carte » et de « commun » posé sur le talus derrière le chemin, entre les étapes
   * (jamais sur un pont, jamais devant un monument) ; lampadaires allumés la nuit ; bateau sous les ponts.
   */
  makeDecor() {
    var self = this, M = GP.MapArt, S = GP.Sprites, rnd = GP.PixelArt.rng(2024);
    var SETS = [
      ['commun_arbre_grand', 'carte_maisonnette_1', 'carte_lampadaire', 'commun_buisson_a'],
      ['commun_arbre_moyen', 'carte_banc', 'carte_lampadaire', 'carte_haie'],
      ['carte_maisonnette_2', 'commun_arbre_petit', 'carte_lampadaire', 'carte_barriere_bois'],
      ['commun_arbre_grand', 'carte_panneau_directionnel', 'carte_lampadaire', 'commun_buisson_b']
    ];
    this.lights = [];
    for (var i = 0; i < this.locs.length - 1; i++) {
      var mid = this.nx(i) + M.GAP / 2, set = SETS[i % SETS.length];
      [-62, -30, 18, 50].forEach(function (dx, k) {
        var x = mid + dx + Math.round(rnd() * 6 - 3), key = set[k];
        if (!S.has(key) || M.inGap(x) || M.inGap(x - 18) || M.inGap(x + 18)) return;
        S.add(self, x, M.vergeY(x), GP.MapDecor.key(self, key)).setOrigin(0.5, 1).setDepth(k === 0 ? 2 : 3);
        if (key === 'carte_lampadaire') self.lights.push([x, M.vergeY(x) - 25, 0.7]);
      });
    }
    if (S.has('carte_drapeau')) S.add(this, this.nx(this.locs.length - 1) + 40, M.vergeY(this.nx(this.locs.length - 1) + 40), 'carte_drapeau').setOrigin(0.5, 1).setDepth(3);
    // bateau sous chaque pont
    M.BRIDGES.forEach(function (bi) {
      if (!S.has('carte_bateau')) return;
      var bx = self.nx(bi) + M.GAP / 2, boat = S.add(self, bx - 10, M.WATER + 12, 'carte_bateau').setOrigin(0.5, 1).setDepth(1);
      if (!GP.reducedMotion) self.tweens.add({ targets: boat, x: bx + 10, duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        onYoyo: function () { boat.setFlipX(true); }, onRepeat: function () { boat.setFlipX(false); } });
    });
    // reflets sur l'eau
    for (var n = 0; n < 30; n++) {
      var s = this.add.rectangle(Math.random() * M.WIDTH, M.WATER + 12 + Math.random() * 18, 3, 1, GP.int(GP.PAL.w), 0).setOrigin(0).setDepth(1);
      if (!GP.reducedMotion) this.tweens.add({ targets: s, alpha: 0.8, duration: 900, yoyo: true, repeat: -1, delay: Math.random() * 2500, repeatDelay: 500 + Math.random() * 2000 });
    }
  }

  // ---------- ligne verte : faite (vert plein) ou à faire (pointillé gris) ----------
  drawPath() {
    var g = this.pathG, P = this.P, M = GP.MapArt;
    g.clear();
    for (var i = 0; i < this.locs.length - 1; i++) {
      var done = !!P.data.completed[this.locs[i].id], a = this.nx(i), b = this.nx(i + 1);
      for (var x = a; x <= b; x += 1) {
        var y = M.pathY(x);
        if (done) { g.fillStyle(GP.int(GP.PAL.h), 1); g.fillRect(x, y - 2, 1, 4); g.fillStyle(GP.int(GP.PAL.g), 1); g.fillRect(x, y - 1, 1, 2); }
        else if ((x - a) % 8 < 4) { g.fillStyle(GP.int(GP.PAL.k), 1); g.fillRect(x, y - 1, 1, 3); g.fillStyle(GP.int(GP.PAL.m), 1); g.fillRect(x, y, 1, 1); }
      }
    }
  }

  // ---------- monuments : gris tant que le niveau n'est pas terminé ----------
  makeMonuments() {
    var self = this;
    this.lms = this.locs.map(function (l, i) {
      var key = GP.MapArt.monument(l, true), sc = key.indexOf('lm_') === 0 ? 1.5 : 1;   // sprite 48×44, ou dessin de secours 32×28
      var im = self.add.image(self.nx(i), GP.MapArt.vergeY(self.nx(i)), key).setOrigin(0.5, 1).setScale(sc).setDepth(5);
      im.baseScale = sc;
      return im;
    });
  }

  /** Dévoilement : halo bref (une seule fois, pas de clignotement), fondu gris → couleur, « pop », étincelles. */
  reveal(i) {
    var self = this, l = this.locs[i], img = this.lms[i], rm = GP.reducedMotion;
    var cy = img.y - img.displayHeight / 2;
    var color = this.add.image(img.x, img.y, GP.MapArt.monument(l, false)).setOrigin(0.5, 1).setScale(img.baseScale).setDepth(6).setAlpha(0);
    GP.Sfx.play('unlock');
    if (!rm) {
      var glow = this.add.image(img.x, cy, 'wx_glow').setDepth(7).setBlendMode(Phaser.BlendModes.ADD).setScale(4).setAlpha(0);
      this.tweens.add({ targets: glow, alpha: 0.6, duration: 350, yoyo: true, hold: 150, onComplete: function () { glow.destroy(); } });
      this.tweens.add({ targets: [img, color], scale: img.baseScale * 1.15, duration: 170, yoyo: true, delay: 420, ease: 'Quad.easeOut' });
      for (var k = 0; k < 14; k++) {
        var ang = k / 14 * Math.PI * 2, d = 30 + (k % 3) * 8;
        var sp = this.add.image(img.x, cy, 'spark').setDepth(8);
        this.tweens.add({ targets: sp, x: img.x + Math.cos(ang) * d, y: cy + Math.sin(ang) * d * 0.8, alpha: 0, duration: 750, delay: 380, ease: 'Quad.easeOut', onComplete: function (tw, t) { t[0].destroy(); } });
      }
      if (!this.moving && !this.panel) {
        this.hero.play('hero-cheer');
        this.time.delayedCall(1300, function () { if (!self.moving && !self.panel) self.startIdle(); });
      }
    }
    this.tweens.add({
      targets: color, alpha: 1, duration: rm ? 400 : 800, delay: rm ? 0 : 300,
      onComplete: function () { img.setTexture(GP.MapArt.monument(l, false)); color.destroy(); self.revealing = -1; }
    });
  }

  // ---------- nœuds ----------
  makeNodes() {
    var self = this;
    this.nodes = [];
    this.locs.forEach(function (l, i) {
      var x = self.nx(i), y = self.ny(i);
      // piédestal de la planche « carte » : disponible, terminé, verrouillé, à venir
      var img = self.add.image(x, y + 6, 'carte_piedestal_disponible').setOrigin(0.5, 1).setDepth(10).setInteractive({ useHandCursor: true });
      var num = self.txt(x, y - 2, String(i + 1), GP.PAL.k).setOrigin(0.5).setDepth(11);
      var badge = self.add.image(x + 12, y - 8, 'badge_done').setDepth(12).setVisible(false);
      var stars = [0, 1, 2].map(function (k) { return self.add.image(x - 8 + k * 8, y + 16, 'star_off').setDepth(12).setVisible(false); });
      img.on('pointerover', function () { self.hover = i; self.updateBar(); });
      img.on('pointerout', function () { if (self.hover === i) { self.hover = -1; self.updateBar(); } });
      img.on('pointerdown', function () { if (!self.panel) self.goTo(i, true); });
      self.nodes.push({ img: img, num: num, badge: badge, stars: stars });
    });
  }

  /** Met à jour l'apparence de tout ce qui dépend de la progression. */
  refresh() {
    var self = this, P = this.P;
    this.locs.forEach(function (l, i) {
      var st = P.status(i), n = self.nodes[i];
      n.img.setTexture('carte_piedestal_' + MapScene.PEDESTAL[st]);
      n.num.setColor(st === 'locked' || st === 'coming' ? GP.PAL.w : GP.PAL.k).setVisible(st !== 'locked');   // le piédestal verrouillé porte déjà un cadenas
      n.badge.setVisible(st === 'completed');
      var got = P.stars(i);
      n.stars.forEach(function (s, k) { s.setVisible(st === 'completed').setTexture(k < got ? 'star_on' : 'star_off'); });
      if (i !== self.revealing) self.lms[i].setTexture(GP.MapArt.monument(l, st !== 'completed'));
    });
    this.drawPath();
    if (this.hud) {
      this.hudCount.setText(P.completedCount() + '/' + (GP.LAST_PLAYABLE + 1) + ' NIVEAUX');
      this.hudStars.setText(P.totalStars() + '/' + GP.Stars.maxTotal());
      this.updateBar();
    }
  }

  // ---------- héros ----------
  makeHero() {
    var x = this.travel.x, y = this.travel.y;
    this.heroShadow = this.add.image(x, y, 'shadow').setDepth(19);
    this.hero = this.add.sprite(x, y, 'hero_idle').setOrigin(0.5, 1).setDepth(20);
    this.cameras.main.centerOn(x, GP.Config.HEIGHT / 2);
    this.cameras.main.startFollow(this.hero, true, 0.1, 0.1, 0, 0);
    this.cameras.main.setDeadzone(60, GP.Config.HEIGHT);
    this.startIdle();
  }

  startIdle() { this.hero.play('hero-idle'); }
  stopIdle() { this.hero.stop(); }

  placeHero(x) {
    var y = this.travel.y;   // surface logique partagée, piédestaux inclus
    this.hero.setPosition(x, y); this.heroShadow.setPosition(x, y);
  }

  /** Marche le long du chemin jusqu'à l'étape j ; si openOnArrival, ouvre la fiche à l'arrivée. */
  goTo(j, openOnArrival) {
    this.travel.to(j, openOnArrival);
    this.syncTravel();
    if (!this.moving) {
      this.cur = this.travel.target; this.P.setCurrent(this.cur); this.placeHero(this.travel.x);
      this.startIdle(); this.updateBar();
      if (openOnArrival) this.openPanel(this.cur);
    }
  }

  syncTravel() {
    this.moving = this.travel.moving;
    if (!this.moving) return;
    this.hero.play('hero-walk').setFlipX(this.nx(this.travel.target) < this.travel.x);
    GP.Sfx.play('step');
  }

  step(d) {
    if (this.panel) { if (this.panelKind === 'notice') this.sheetGo(d); return; }
    this.travel.step(d);
    this.syncTravel();
  }

  onConfirm() {
    if (this.panel) { this.panelPrimary(); return; }
    if (!this.moving) this.openPanel(this.cur);
  }

  onEsc() {
    if (this.panel) { this.closePanel(); return; }
    if (this.moving) return;
    var self = this;
    GP.Sfx.play('back');
    this.cameras.main.fadeOut(250, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Menu'); });
  }

  // ---------- interface (fixe à l'écran) ----------
  makeHud() {
    var self = this, W = GP.Config.WIDTH, H = GP.Config.HEIGHT;
    function fix(o, d) { return o.setScrollFactor(0).setDepth(d || 51); }
    var g = fix(this.add.graphics(), 50);
    g.fillStyle(GP.int(GP.PAL.k), 1); g.fillRect(4, 4, 112, 42);
    g.fillStyle(GP.int(GP.PAL.d), 1); g.fillRect(6, 6, 108, 38);
    fix(this.txt(11, 10, 'GREEN PATH', GP.PAL.g));
    this.hudCount = fix(this.txt(11, 21, '', GP.PAL.m));
    fix(this.add.image(14, 35, 'star_on'));
    this.hudStars = fix(this.txt(22, 32, '', GP.PAL.y));

    // barre du bas : nom de l'étape + état, bouton d'aide à droite
    var bar = fix(this.add.graphics(), 50);
    bar.fillStyle(GP.int(GP.PAL.k), 1); bar.fillRect(0, H - 22, W, 22);
    bar.fillStyle(GP.int(GP.PAL.d), 1); bar.fillRect(0, H - 20, W, 20);
    this.barName = fix(this.txt(6, H - 15, '', GP.PAL.w));
    this.barState = fix(this.txt(6, H - 15, '', GP.PAL.y));
    GP.UI.button(this, W - 4 - 128, H - 19, 128, 'COMMENT JOUER ?', function () { if (!self.panel && !self.moving) self.openHelp(); })
      .objs.forEach(function (o) { o.setDepth(52); });
    this.hud = true;
    this.navHint = fix(this.txt(W / 2, H - 35, '', GP.PAL.m, { backgroundColor: GP.PAL.k, padding: { x: 4, y: 3 } })).setOrigin(0.5);
    GP.Prompts.bind(this, this.navHint, '{navX} ÉTAPES  {confirm} FICHE  {help} AIDE');
  }

  updateBar() {
    var i = this.hover >= 0 ? this.hover : this.cur, l = this.locs[i], st = this.P.status(i);
    var label = MapScene.LABELS[st];
    // 41 caractères tiennent à gauche du bouton d'aide ; le nom est tronqué pour laisser la place à l'état
    var room = 41 - (label ? label.length + 2 : 0);
    var name = String(i + 1).padStart(2, '0') + ' ' + GP.t(l.name.toUpperCase());   // traduit avant de couper
    if (name.length > room) name = name.slice(0, room - 1) + '.';
    this.barName.setText(name);
    this.barState.setText(label).setX(6 + (name.length + 2) * 8)
      .setColor({ completed: GP.PAL.y, available: GP.PAL.g, locked: GP.PAL.m, coming: GP.PAL.l }[st]);
  }

  toast(msg, color) {
    var W = GP.Config.WIDTH;
    if (this.toastObj) this.toastObj.destroy();
    var t = this.txt(W / 2, 64, ' ' + msg + ' ', color || GP.PAL.w, { backgroundColor: GP.PAL.k, padding: { x: 2, y: 3 } })
      .setOrigin(0.5).setDepth(60).setScrollFactor(0);
    this.toastObj = t;
    this.tweens.add({ targets: t, alpha: 0, delay: 3200, duration: 400, onComplete: function () { t.destroy(); } });
  }

  // ---------- météo ----------
  makeWeather() {
    var self = this;
    this.wx = GP.WeatherFX.apply(this, { depth: 30, fixed: true, noShadows: true, lights: this.lights });
    this.wxWidget = GP.WeatherFX.widget(this, GP.Config.WIDTH - 4, 4, 50, { right: true });
    this.applyWeather(GP.Weather.get());
    GP.Weather.load(function (s) { if (self.alive) self.applyWeather(s); });
    // météo en direct : la scène suit les mises à jour (toutes les 5 min, ou retour du réseau)
    var unsub = GP.Weather.subscribe(function (s) { if (self.alive) self.applyWeather(s); });
    this.events.once('shutdown', unsub);
  }
  applyWeather(st) { this.sky.set(st); this.wx.set(st); this.wxWidget.set(st); }

  /** Outil de test : météos simulées, puis retour à la vraie météo. */
  cycleWeather() {
    var self = this, s = GP.Weather.nextSim();
    if (s) { this.applyWeather(s); this.toast('MÉTÉO TEST : ' + s.simName); return; }
    this.toast('MÉTÉO RÉELLE');
    GP.Weather.load(function (st) { if (self.alive) self.applyWeather(st); });
  }

  // ---------- fenêtres : aide et fiche du lieu ----------
  openHelp(page) {
    if (this.panel || this.moving) return;
    var self = this;
    this.help = GP.UI.help(this, page || 0, { onClose: function () { self.panel = null; self.panelKind = null; self.help = null; } });
    this.panel = this.help.objs;
    this.panelKind = 'help';
  }

  /**
   * Fiche du lieu. Avant réussite : une page (image grise, nom, notice, étoiles, JOUER).
   * Après réussite : pages BILAN (photo reconstruite, chiffres, étoiles) puis FICHE DU LIEU (texte complet).
   */
  openPanel(i) {
    if (this.panel) return;
    var self = this, l = this.locs[i], st = this.P.status(i), UI = GP.UI;
    var compact = st !== 'completed';
    var m = UI.modal(this, 'ÉTAPE ' + String(i + 1).padStart(2, '0') + ' / 12', '', compact ?
      { x: 32, y: 8, w: 416, h: 140, offsetY: 57, dim: 0.22 } : { offsetY: 10 });
    this.modalObj = m;
    this.panel = m.objs;
    this.panelKind = 'notice';
    this.panelIndex = i;
    this.panelAction = this.P.canEnter(i) ? 'play' : null;

    var pages = [];
    if (st === 'completed') {
      pages.push({ title: 'BILAN', draw: function (add) { self.drawDebrief(add, i); } });
      GP.UI.paginate(this, (l.summary || [l.notice]).map(function (p) { return GP.t(p); }), 412, 156).forEach(function (txt, k, all) {
        pages.push({ title: 'FICHE DU LIEU' + (all.length > 1 ? ' ' + (k + 1) : ''), draw: function (add) {
          add(UI.txt(self, 34, 40, txt, GP.PAL.w, { wordWrap: { width: 412 }, lineSpacing: 4 }));
        } });
      });
    } else {
      var info = [GP.t(l.name.toUpperCase()), GP.t(l.element.label.toUpperCase()), GP.t(l.notice)];
      if (st === 'coming') info.push(GP.t('NIVEAU PAS ENCORE DISPONIBLE'));
      if (st === 'locked') info.push(GP.t("TERMINE L'ÉTAPE PRÉCÉDENTE"));
      UI.paginate(this, info, 292, 78).forEach(function (text) {
        pages.push({ title: 'À RECONSTRUIRE', draw: function (add) { self.drawContext(add, i, text); } });
      });
    }
    if (l.grammar) GP.UI.paginate(this, [GP.t(l.grammar)], compact ? 388 : 412, compact ? 78 : 156).forEach(function (text) {
      pages.push({ title: 'SOURCE → RÈGLE', draw: function (add) { add(UI.txt(self, compact ? 46 : 34, compact ? 36 : 40, text, GP.PAL.w, { wordWrap: { width: compact ? 388 : 412 }, lineSpacing: 4 })); } });
    });
    this.sheet = { pages: pages, page: 0, content: [], m: m, compact: compact };

    // boutons du bas
    var footer = compact ? 126 : 212;
    if (this.panelAction) {
      var play = UI.button(this, 150, footer, 120, '', function () { self.panelPrimary(); }, { primary: true }); m.add(play.objs);
      GP.Prompts.bind(this, play.label, (st === 'completed' ? 'REJOUER' : 'JOUER') + ' {confirm}');
    }
    m.add(UI.button(this, 280, footer, 70, 'FERMER', function () { self.closePanel(); }).objs);
    if (pages.length > 1) {
      m.add(UI.button(this, compact ? 46 : 34, footer, 24, '<', function () { self.sheetGo(-1); }).objs);
      m.add(UI.button(this, compact ? 410 : 422, footer, 24, '>', function () { self.sheetGo(1); }).objs);
    }
    this.sheetRender();

    GP.Sfx.play('select');
    this.stopIdle();
    this.hero.play('hero-cheer');
  }

  sheetGo(d) {
    var sh = this.sheet;
    if (!sh || sh.pages.length < 2) return;
    var n = Math.max(0, Math.min(sh.pages.length - 1, sh.page + d));
    if (n === sh.page) return;
    sh.page = n; GP.Sfx.play('step'); this.sheetRender();
  }

  sheetRender() {
    var sh = this.sheet, m = sh.m, self = this, P = GP.PAL;
    sh.content.forEach(function (o) { o.destroy(); }); sh.content = [];
    function add(o) { if (Array.isArray(o)) { o.forEach(add); return o; } m.add(o); sh.content.push(o); return o; }
    var pg = sh.pages[sh.page];
    m.titleRight.setText((sh.pages.length > 1 ? (sh.page + 1) + '/' + sh.pages.length + ' ' : '') + pg.title)
      .setColor(this.P.status(this.panelIndex) === 'completed' ? P.y : P.m);
    pg.draw(add);
    if (sh.pages.length > 1) for (var k = 0; k < sh.pages.length; k++)
      add(self.add.rectangle(GP.Config.DW / 2 - (sh.pages.length - 1) * 5 + k * 10, sh.compact ? 119 : 203, 6, 6, GP.int(k === sh.page ? P.g : P.e)).setOrigin(0.5));
  }

  /** Fiche courte au-dessus du rail ; la notice complète est paginée, jamais tronquée. */
  drawContext(add, i, text) {
    var l = this.locs[i], P = GP.PAL, UI = GP.UI;
    add(this.add.rectangle(46, 36, 72, 76, GP.int(P.k)).setOrigin(0));
    var mk = GP.MapArt.monument(l, true);
    add(this.add.image(82, 72, mk).setScale(mk.indexOf('lm_') === 0 ? 1.5 : 1));
    add(UI.txt(this, 130, 36, text, P.w, { wordWrap: { width: 292 }, lineSpacing: 4 }));
    if (l.playable) for (var k = 0; k < 3; k++) add(this.add.image(72 + k * 10, 104, 'star_off'));
  }

  /** Page BILAN : la photo reconstruite en grand, les chiffres et les étoiles. */
  drawDebrief(add, i) {
    var l = this.locs[i], c = this.P.data.completed[l.id] || {}, P = GP.PAL, UI = GP.UI, self = this;
    var key = GP.PixelCollection.photoKey(this, l.id), lv = GP.LEVELS && GP.LEVELS[l.level];
    add(this.add.rectangle(34, 40, 152, 104, GP.int(P.k)).setOrigin(0));
    add(this.add.image(110, 92, key).setScale(3));
    add(UI.txt(this, 34, 150, 'IMAGE RECONSTRUITE', P.g));
    add(UI.txt(this, 34, 162, l.element.label.toUpperCase(), P.m, { wordWrap: { width: 152 }, lineSpacing: 3 }));
    function fmt(n) { n = Math.round(n); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); }
    add(UI.txt(this, 200, 40, l.name.toUpperCase(), P.g, { wordWrap: { width: 246 }, lineSpacing: 3 }));
    var y0 = l.name.length > 28 ? 66 : 56, total = lv ? lv.pixels.length : c.pixels;
    [['PIXELS', (c.pixels || 0) + '/' + (total || 0)], ['RECONSTRUCTION', Math.round((c.rate || 0) * 100) + ' %'],
     ['MEILLEUR TEMPS', c.time ? fmt(c.time) : '-'], ['MORTS (MINIMUM)', c.deaths === null || c.deaths === undefined ? '-' : String(c.deaths)]].forEach(function (r, k) {
      add(UI.txt(self, 200, y0 + k * 12, r[0], P.m)); add(UI.txt(self, 340, y0 + k * 12, r[1], P.w));
    });
    // chaque étoile correspond à un critère précis (meilleurs résultats enregistrés)
    var ok = [(c.rate || 0) >= 1, c.deaths === 0, !!(c.time && l.parTime && c.time <= l.parTime)];
    ['IMAGE COMPLÈTE', 'SANS MOURIR', 'SOUS LE TEMPS CIBLE'].forEach(function (t, k) {
      add(self.add.image(205, y0 + 59 + k * 13, ok[k] ? 'star_on' : 'star_off'));
      add(UI.txt(self, 214, y0 + 56 + k * 13, t, ok[k] ? P.w : P.m));
    });
  }

  closePanel() {
    if (!this.panel) return;
    if (this.panelKind === 'help') { this.help.close(); return; }
    this.modalObj.destroy();
    this.panel = null; this.sheet = null;
    GP.Sfx.play('back');
    this.startIdle();
    this.panelKind = null;
  }

  panelPrimary() {
    if (this.panelKind !== 'notice') return;
    if (this.panelAction !== 'play') { this.closePanel(); return; }
    var self = this, i = this.panelIndex, l = this.locs[i];
    if (!GP.LEVELS || !GP.LEVELS[l.level]) { GP.Sfx.play('error'); this.toast('NIVEAU EN CONSTRUCTION'); return; }
    GP.Sfx.play('confirm');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Game', { index: i }); });
  }
};

/** Libellés d'état (rien pour une étape simplement jouable). */
/** Piédestal de la planche « carte » selon l'état de l'étape. */
GP.Scenes.Map.PEDESTAL = { available: 'disponible', completed: 'termine', locked: 'verrouille', coming: 'avenir' };

GP.Scenes.Map.LABELS = { completed: 'TERMINÉ', available: '', locked: 'VERROUILLÉ', coming: 'À VENIR' };
