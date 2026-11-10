/**
 * Point d'entrée : attend la police pixel puis lance Phaser.
 */
(function () {
  var started = false;
  function start() {
    if (started) return;
    started = true;
    var loading = document.getElementById('loading');
    if (loading) loading.remove();
    GP.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      width: GP.Config.WIDTH,
      height: GP.Config.HEIGHT,
      backgroundColor: GP.PAL.k,
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [GP.Scenes.Boot, GP.Scenes.Menu, GP.Scenes.Character, GP.Scenes.Map, GP.Scenes.Game, GP.Scenes.Result]
    });
    GP.game.events.once('ready', checkOrientation);
  }
  /** Écran tactile tenu en portrait ? (même règle que le CSS de #rotate) */
  function portrait() {
    return !!(window.matchMedia && window.matchMedia('(orientation: portrait) and (pointer: coarse)').matches);
  }
  /** Met le jeu en pause tant que le téléphone est en portrait, le relance en paysage. */
  function checkOrientation() {
    if (!GP.game || !GP.game.loop) return;
    var loop = GP.game.loop;
    if (portrait()) { if (loop.running) loop.sleep(); }      // sleep() arrête la boucle (et donc le chrono du niveau)
    else if (!loop.running) loop.wake();
  }
  GP.checkOrientation = checkOrientation;
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', function () { setTimeout(checkOrientation, 150); });
  // Verrouillage en paysage : au mieux, après le premier toucher (beaucoup de navigateurs le refusent : sans conséquence).
  window.addEventListener('touchend', function lock() {
    window.removeEventListener('touchend', lock);
    try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); } catch (e) { /* refusé */ }
  });

  // La police doit être prête avant de créer les textes Phaser ; repli après 1,5 s.
  setTimeout(start, 1500);
  if (document.fonts && document.fonts.load) {
    document.fonts.load('8px "Press Start 2P"').then(start, start);
  } else start();
})();
