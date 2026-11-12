/**
 * ScoreScene — classement (Supabase, voir GP.Cloud). Pseudo, étoiles, temps cumulé.
 * Hors ligne : la dernière version vue est affichée, avec son âge ; sinon « classement indisponible hors ligne ».
 * Écran à mise en page fixe (480×270, centré). Échap / B : retour.
 */
GP.Scenes.Score = class ScoreScene extends Phaser.Scene {
  constructor() { super('Score'); }

  txt(x, y, s, color) { return this.add.text(x, y, s, { fontFamily: GP.Config.FONT, fontSize: '8px', color: color || GP.PAL.w }); }

  create() {
    var self = this, P = GP.PAL, W = GP.Config.DW, H = GP.Config.HEIGHT;
    this.alive = true;
    this.cameras.main.fadeIn(250, 20, 24, 46);
    GP.UI.backdrop(this, 0.85);
    this.txt(W / 2, 12, 'CLASSEMENT', P.g).setOrigin(0.5, 0);
    this.state = this.txt(W / 2, 26, 'CHARGEMENT…', P.m).setOrigin(0.5, 0);
    this.rows = [];
    var me = GP.Cloud.isAccount ? GP.Cloud.pseudo : null;
    this.foot = this.txt(W / 2, H - 52, me ? GP.t('TOI : ') + me : 'JOUE EN INVITÉ : CRÉE UN PSEUDO DANS OPTIONS POUR APPARAÎTRE ICI.', P.c)
      .setOrigin(0.5, 0).setWordWrapWidth(440).setAlign('center');
    GP.UI.backIcon(this, function () { self.leave(); });
    var kb = this.input.keyboard;
    kb.on('keydown-ESC', function () { self.leave(); });
    kb.on('keydown-ENTER', function () { self.leave(); });
    this.events.once('shutdown', function () { self.alive = false; kb.removeAllListeners(); });

    GP.Cloud.scoreboard(20).then(function (r) { if (self.alive) self.show(r); });
  }

  show(r) {
    var P = GP.PAL, W = GP.Config.DW, me = GP.Cloud.pseudo;
    if (!r.ok) { this.state.setText('CLASSEMENT INDISPONIBLE HORS LIGNE').setColor(P.o); return; }
    if (r.source === 'cache') this.state.setText('HORS LIGNE · VERSION VUE IL Y A ' + Math.max(1, Math.round(r.age / 60000)) + ' MIN').setColor(P.o);
    else this.state.setText('EN DIRECT').setColor(P.g);
    if (!r.rows.length) { this.txt(W / 2, 110, 'PERSONNE AU CLASSEMENT POUR L\'INSTANT.', P.m).setOrigin(0.5, 0); return; }
    function fmt(ms) { var s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
    var y0 = 44, dy = 16, self = this;
    this.txt(46, y0, '#', P.m); this.txt(76, y0, 'PSEUDO', P.m); this.txt(330, y0, 'ÉTOILES', P.m).setOrigin(1, 0); this.txt(432, y0, 'TEMPS', P.m).setOrigin(1, 0);
    r.rows.slice(0, 10).forEach(function (row, i) {
      var y = y0 + 16 + i * dy, mine = me && row.pseudo.toLowerCase() === me.toLowerCase(), c = mine ? P.y : (i < 3 ? P.w : P.m);
      if (mine) self.add.rectangle(40, y - 3, 400, 14, GP.int(P.G), 0.6).setOrigin(0);
      self.txt(46, y, String(row.rank), c); self.txt(76, y, row.pseudo, c);
      self.txt(330, y, String(row.total_stars), c).setOrigin(1, 0); self.txt(432, y, fmt(row.total_time_ms), c).setOrigin(1, 0);
    });
  }

  leave() {
    var self = this; GP.Sfx.play('back');
    this.input.keyboard.removeAllListeners();
    this.cameras.main.fadeOut(200, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('Menu'); });
  }
};
