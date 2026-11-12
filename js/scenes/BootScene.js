/**
 * BootScene — génère toutes les textures (personnage, icônes, étoiles, météo, carte) puis lance le menu.
 */
GP.Scenes.Boot = class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  /**
   * Le travail est découpé en étapes exécutées l'une après l'autre : entre deux, le navigateur repeint l'écran de chargement
   * (la barre avance avec le vrai travail au lieu de geler).
   */
  create() {
    var self = this, PA = GP.PixelArt, steps = [];
    steps.push(function () {
      GP.Progression.init();
      // Sprites des planches : une texture par sprite et par image
      GP.Sprites.build(self);
    });
    // Personnage : généré par calques depuis la configuration sauvegardée
    steps.push(function () { GP.Character.build(self, GP.Progression.data.character || GP.Character.defaultConfig()); });
    steps.push(function () { self.makeIcons(PA); });
    steps.push(function () { GP.WeatherFX.makeTextures(self); });   // météo : icônes, ombres de nuages, halos
    steps.push(function () { GP.UI.makeTextures(self); });          // flèches des touches
    steps.push(function () { GP.LevelArt.makeTextures(self); });    // décor des niveaux
    steps.push(function () { GP.MapArt.build(self); });             // carte

    var i = 0, stopped = false;
    this.events.once('shutdown', function () { stopped = true; });
    function next() {
      if (stopped) return;
      if (i >= steps.length) { self.done(); return; }
      steps[i++]();
      if (GP.setLoading) GP.setLoading(Math.round(i / steps.length * 96));
      // une image pour peindre la barre, puis l'étape suivante (repli par minuterie si l'onglet est en arrière-plan : rAF y est suspendu)
      var go = false;
      function once() { if (go) return; go = true; next(); }
      requestAnimationFrame(function () { setTimeout(once, 0); });
      setTimeout(once, 60);
    }
    next();
  }

  /** Nœuds de la carte, badges, étoiles, étincelle. */
  makeIcons(PA) {
    var styles = { available: ['g', 'w'], completed: ['y', 'w'], locked: ['e', 'm'], coming: ['p', 'm'] };
    Object.keys(styles).forEach(function (st) {
      var o = PA.canvas(22, 22);
      PA.disc(o.ctx, 11, 11, 10, 'k');
      PA.disc(o.ctx, 11, 11, 8, styles[st][0]);
      PA.rect(o.ctx, 5, 6, 2, 1, styles[st][1]); PA.rect(o.ctx, 6, 5, 3, 1, styles[st][1]);
      if (st === 'coming') { for (var i = 4; i < 18; i += 4) PA.rect(o.ctx, i, 17, 2, 1, 'k'); }
      PA.toTexture(this, 'node_' + st, o.cv);
    }, this);

    // badges
    var b = PA.canvas(10, 10);
    PA.disc(b.ctx, 5, 5, 4, 'k'); PA.disc(b.ctx, 5, 5, 3, 'w');
    PA.rect(b.ctx, 3, 5, 1, 1, 'G'); PA.rect(b.ctx, 4, 6, 1, 1, 'G'); PA.rect(b.ctx, 5, 5, 1, 1, 'G'); PA.rect(b.ctx, 6, 4, 1, 1, 'G'); PA.rect(b.ctx, 7, 3, 1, 1, 'G');
    PA.toTexture(this, 'badge_done', b.cv);
    var lk = PA.canvas(10, 10);
    PA.disc(lk.ctx, 5, 5, 4, 'k');
    PA.rect(lk.ctx, 3, 5, 5, 3, 'm'); PA.rect(lk.ctx, 4, 3, 1, 2, 'm'); PA.rect(lk.ctx, 6, 3, 1, 2, 'm'); PA.rect(lk.ctx, 4, 3, 3, 1, 'm');
    PA.toTexture(this, 'badge_lock', lk.cv);

    // anneau de pulsation, ombre
    var r = PA.canvas(30, 30); PA.ellipse(r.ctx, 15, 15, 13, 13, 'g'); PA.ellipse(r.ctx, 15, 15, 12, 12, 'w');
    PA.toTexture(this, 'ring', r.cv);
    var sh = PA.canvas(12, 4); PA.disc(sh.ctx, 6, 2, 2, 'rgba(20,24,46,0.45)'); sh.ctx.fillStyle = 'rgba(20,24,46,0.45)'; sh.ctx.fillRect(3, 1, 6, 2);
    PA.toTexture(this, 'shadow', sh.cv);

    // étoiles 7×7 (obtenue / vide) et étincelle du dévoilement
    var star = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', 'kyk.kyk', 'kk...kk'];
    PA.sprite(this, 'star_on', star);
    PA.sprite(this, 'star_off', star.map(function (row) { return row.replace(/y/g, 'e'); }));
    PA.sprite(this, 'spark', ['.w.', 'wyw', '.w.']);
  }

  /** Tout est prêt : la barre se complète, puis le menu (ou le niveau de test). */
  done() {
    if (GP.finishLoading) GP.finishLoading();   // la barre de l'écran de chargement se complète puis disparaît

    if (GP.SOLO_LEVEL !== undefined) this.scene.start('Game', { index: GP.SOLO_LEVEL });   // niveau-1.html : directement dans le niveau
    else if (GP.Config.DEV_LEVEL) {
      GP.Weather.simIndex = -1; GP.Weather.nextSim();
      this.scene.start('Game', { index: GP.LOCATIONS.findIndex(function (l) { return l.id === GP.Config.DEV_LEVEL; }) });
    } else this.scene.start(GP.BOOT_NEXT || 'Menu');
  }
};
