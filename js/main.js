/**
 * Point d'entrée : attend la police pixel puis lance Phaser.
 */
(function () {
  var started = false;
  /** Avancement réel de la barre de l'écran de chargement (0 à 100), piloté par BootScene étape par étape. */
  GP.setLoading = function (pct) {
    var fill = document.querySelector('#loading .ld-fill');
    if (fill) fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
  };
  /** Fin de l'écran de chargement : la barre se complète à 100 % (au moins 0,6 s après l'ouverture de la page) puis l'écran disparaît. */
  GP.finishLoading = function () {
    var loading = document.getElementById('loading');
    if (!loading || loading.classList.contains('done')) return;
    var wait = Math.max(0, 600 - (window.performance && performance.now ? performance.now() : 600));
    setTimeout(function () {
      GP.setLoading(100);
      loading.classList.add('done');                       // l'écran s'efface après un court instant
      setTimeout(function () { if (loading.parentNode) loading.remove(); }, 650);
    }, wait);
  };
  function start() {
    if (started) return;
    started = true;
    GP.Settings.load();   // langue et touches du joueur, avant la création des scènes
    setTimeout(boot, 60);   // une image de répit : la barre de chargement est déjà peinte et avance
  }
  function boot() {
    GP.Prompts.start();
    GP.Content.init();   // niveaux et textures publiés avec l'éditeur (cache local, puis réseau en tâche de fond)
    if (!GP.Config.DEV_LEVEL) GP.Cloud.init();   // le banc local ne charge pas le compte personnel
    GP.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      callbacks: { postBoot: function (game) {
        game.canvas.setAttribute('tabindex', '0');
        game.canvas.setAttribute('aria-label', 'Green Path');
        game.canvas.setAttribute('aria-describedby', 'instructions');
      } },
      width: GP.Config.WIDTH,
      height: GP.Config.HEIGHT,
      backgroundColor: GP.PAL.k,
      pixelArt: true,
      roundPixels: true,
      antialias: false,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      physics: { default: 'arcade', arcade: { debug: false } },
      scene: [GP.Scenes.Boot, GP.Scenes.Menu, GP.Scenes.About, GP.Scenes.Character, GP.Scenes.Options, GP.Scenes.Score, GP.Scenes.Map, GP.Scenes.Game, GP.Scenes.Result, GP.Scenes.Postcard]
    });
    GP.game.events.once('ready', checkOrientation);
    GP.Pad.start(GP.game);   // manette : menus et niveaux
    iosTip();
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
  // Sur HTTPS/localhost, une première visite complète prépare les rechargements sans réseau.
  // file:// garde son fonctionnement autonome ; aucun service worker n'y est nécessaire.
  GP.offlineReady = Promise.resolve(false);
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !GP.Config.DEV_TOOLS) {
    GP.offlineReady = navigator.serviceWorker.register('./sw.js').then(function () {
      return navigator.serviceWorker.ready.then(function () { return true; });
    }).catch(function () { return false; });
    // Mise à jour : quand une nouvelle copie du jeu prend le contrôle, la page se recharge une fois, sauf en plein
    // niveau (la partie serait interrompue : la mise à jour s'appliquera au prochain chargement).
    var hadController = !!navigator.serviceWorker.controller, reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || reloaded) return;   // première installation : rien à recharger
      reloaded = true;
      if (!(GP.game && GP.game.scene && GP.game.scene.isActive('Game'))) window.location.reload();
    });
  }
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', function () { setTimeout(checkOrientation, 150); });
  // Au premier toucher (un geste de l'utilisateur est obligatoire) : plein écran puis verrouillage en paysage,
  // au mieux (Android, iPad récent). Sur iPhone Safari, le navigateur n'a pas de plein écran : voir l'astuce ci-dessous.
  window.addEventListener('touchend', function fs() {
    window.removeEventListener('touchend', fs);
    var el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen, p;
    try { p = req ? req.call(el, { navigationUI: 'hide' }) : null; } catch (e) { p = null; }
    var lock = function () { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); } catch (e) { /* refusé */ } };
    if (p && p.then) p.then(lock, function () {}); else lock();
  });

  /** iPhone / iPad dans Safari (pas installé) : on explique une seule fois comment jouer sans barres. */
  function iosTip() {
    var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var standalone = window.navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches);
    var box = document.getElementById('ios-tip'), seen = false;
    try { seen = !!window.localStorage.getItem('greenpath.iostip'); } catch (e) { /* ignoré */ }
    if (!ios || standalone || seen || !box) return;
    document.getElementById('ios-tip-text').textContent = GP.Settings.lang === 'fr'
      ? "POUR JOUER EN PLEIN ÉCRAN : TOUCHE PARTAGER, PUIS « SUR L'ÉCRAN D'ACCUEIL »."
      : 'TO PLAY FULLSCREEN: TAP SHARE, THEN "ADD TO HOME SCREEN".';
    box.hidden = false;
    var close = function () { box.hidden = true; try { window.localStorage.setItem('greenpath.iostip', '1'); } catch (e) { /* ignoré */ } };
    box.addEventListener('click', close); setTimeout(close, 9000);
  }

  // La police doit être prête avant de créer les textes Phaser ; repli après 1,5 s.
  setTimeout(start, 1500);
  if (document.fonts && document.fonts.load) {
    document.fonts.load('8px "Press Start 2P"').then(start, start);
  } else start();
})();
