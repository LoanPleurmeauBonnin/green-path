/**
 * ResultScene — écran de fin de niveau. Reçoit { index, pixels, total, deaths, time }.
 * Calcule les étoiles (GP.Stars.compute), enregistre le résultat (GP.Progression.complete : garde le meilleur,
 * débloque l'étape suivante) puis propose CARTE (Entrée) ou REJOUER (R). De retour sur la carte,
 * le monument est dévoilé s'il s'agit d'une première réussite.
 */
GP.Scenes.Result = class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }

  init(data) { this.r = data || {}; }

  create() {
    var self = this, r = this.r, P = GP.PAL, UI = GP.UI, W = GP.Config.DW, H = GP.Config.HEIGHT;
    var loc = GP.LOCATIONS[r.index], rate = r.total ? r.pixels / r.total : 0, deaths = r.deaths || 0;
    var stars = GP.Stars.compute({ rate: rate, deaths: deaths, time: r.time }, loc);
    var res = GP.Progression.complete(r.index, r.pixels, rate, stars, Math.round(r.time * 10) / 10, deaths);
    this.leaving = false;

    this.cameras.main.fadeIn(350, 20, 24, 46);
    UI.backdrop(this, 0.6);
    this.add.rectangle(20, 12, 440, 246, GP.int(P.k)).setOrigin(0);
    this.add.rectangle(22, 14, 436, 242, GP.int(P.d)).setOrigin(0);
    this.add.rectangle(22, 33, 436, 1, GP.int(P.G)).setOrigin(0);
    UI.txt(this, 32, 20, 'IMAGE RECONSTRUITE', P.g);
    var campaignDone = res.allDone && GP.Progression.completedCount() === GP.LOCATIONS.filter(function (l) { return l.playable; }).length;
    UI.txt(this, 450, 20, campaignDone ? 'PARCOURS COMPLÉTÉ !' : res.unlockedNew ? 'ÉTAPE SUIVANTE DÉBLOQUÉE !' : 'ÉTAPE ' + String(r.index + 1).padStart(2, '0'), res.unlockedNew || campaignDone ? P.y : P.m).setOrigin(1, 0);

    // la photo reconstruite en grand (×4 ; le monument dessiné si la photo n'est pas encore intégrée)
    var key = GP.PixelCollection.photoKey(this, loc.id), src = this.textures.get(key).getSourceImage();
    var sc = Math.min(4, 192 / src.width, 128 / src.height);
    this.add.rectangle(30, 40, 196, 132, GP.int(P.k)).setOrigin(0);
    var img = this.add.image(128, 106, key).setScale(sc);
    if (!GP.reducedMotion) { img.setScale(sc * 0.85); this.tweens.add({ targets: img, scale: sc, duration: 500, ease: 'Back.easeOut' }); }
    UI.txt(this, 30, 180, loc.element.label.toUpperCase(), P.m, { wordWrap: { width: 196 }, lineSpacing: 3 });

    // chiffres
    var s = Math.round(r.time), par = loc.parTime || 0;
    function fmt(n) { return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); }
    UI.txt(this, 238, 40, loc.name.toUpperCase(), P.g, { wordWrap: { width: 212 }, lineSpacing: 3 });
    var y0 = loc.name.length > 26 ? 66 : 56;
    [['PIXELS', r.pixels + '/' + r.total], ['RECONSTRUCTION', Math.round(rate * 100) + ' %'],
     ['TEMPS', fmt(s) + (par ? ' / ' + fmt(par) : '')], ['MORTS', String(deaths)]].forEach(function (row, i) {
      UI.txt(self, 238, y0 + i * 12, row[0], P.m);
      UI.txt(self, 362, y0 + i * 12, row[1], P.w);
    });

    // étoiles : elles s'allument une à une
    var crit = ['IMAGE COMPLÈTE', 'SANS MOURIR', 'SOUS LE TEMPS CIBLE'], got = [rate >= 1, rate >= 1 && deaths === 0, rate >= 1 && par > 0 && r.time <= par];
    crit.forEach(function (c, i) {
      var y = y0 + 54 + i * 14;
      var st = self.add.image(243, y + 3, 'star_off').setScale(1.5);
      UI.txt(self, 254, y, c, P.m);
      if (got[i]) self.time.delayedCall(500 + i * 450, function () {
        st.setTexture('star_on'); GP.Sfx.play('confirm');
        if (!GP.reducedMotion) { st.setScale(2.6); self.tweens.add({ targets: st, scale: 1.5, duration: 220, ease: 'Back.easeOut' }); }
      });
    });

    // notice courte
    var full = GP.t(loc.notice), notice = full.length > 110 ? full.slice(0, full.lastIndexOf(' ', 107)) + '…' : full;
    UI.txt(this, 238, y0 + 102, notice, P.c, { wordWrap: { width: 212 }, lineSpacing: 3 });

    // boutons
    var bCarte = UI.button(this, 30 + GP.Config.DX, 234, 140, '', function () { self.leave('Map'); }, { primary: true });
    var bRe = UI.button(this, 182 + GP.Config.DX, 234, 150, '', function () { self.leave('Game'); });
    GP.Prompts.bind(this, bCarte.label, 'CARTE {confirm}');
    GP.Prompts.bind(this, bRe.label, 'REJOUER {replay}');
    [bCarte, bRe].forEach(function (b) { b.objs.forEach(function (o) { o.setDepth(10); }); });

    var kb = this.input.keyboard;
    kb.on('keydown-ENTER', function () { self.leave('Map'); });
    kb.on('keydown-SPACE', function () { self.leave('Map'); });
    kb.on('keydown-R', function () { self.leave('Game'); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
  }

  leave(key) {
    var self = this;
    if (this.leaving) return;
    this.leaving = true;
    GP.Sfx.play(key === 'Map' ? 'back' : 'confirm');
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(key, key === 'Game' ? { index: self.r.index } : undefined); });
  }
};
