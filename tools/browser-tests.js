/** Tests d'intégration sur une origine LOCALE dédiée, ?dev=1. Ne pas lancer sur une partie personnelle.
 * Charger par <script src="tools/browser-tests.js"> via la console, puis GP.runBrowserTests().
 * Pas de réseau d'écriture : synchronisation et proposition de compte neutralisées pendant le test.
 */
GP.runBrowserTests = function () {
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Tests réservés à localhost/?dev=1');
  var game = GP.game, report = [], now = performance.now(), oldData = GP.Progression.data;
  var oldNow = Date.now, epoch = Date.now(), startTime = now;
  var oldMem = GP.Save._mem, storage = GP.Save.storage(), raw = storage && storage.getItem(GP.Config.SAVE_KEY);
  var oldPush = GP.Cloud.schedulePush, oldAsk = GP.Cloud.shouldAsk, oldState = GP.Weather.state, oldSim = GP.Weather.simIndex;
  var oldMuted = oldData.muted;
  function check(name, value) { report.push({ name: name, ok: !!value }); if (!value) throw new Error(name); }
  function step(n) { for (var i = 0; i < n; i++) { now += 1000 / 60; game.step(now, 1000 / 60); } }
  function start(key, data) { game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); game.scene.start(key, data); step(2); return game.scene.getScene(key); }
  function level(index) { var g = start('Game', { index: index }); g.introMs = 0; return g; }
  game.loop.sleep(); Date.now = function () { return epoch + now - startTime; };
  GP.Cloud.schedulePush = function () {}; GP.Cloud.shouldAsk = function () { return false; };
  GP.Weather.simIndex = -1; GP.Weather.nextSim();
  GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true;
  try {
    var menu = start('Menu'); menu.start(); check('Nouvelle partie : introduction', menu.mode === 'intro');
    GP.Progression.data.introSeen = true;
    var creator = start('Character', { from: 'start' }); creator.validate(); step(40);
    check('Avatar validé → carte', game.scene.isActive('Map') && !!GP.Progression.data.character);
    var map = game.scene.getScene('Map'); map.openPanel(0); check('Fiche patrimoniale avec règle', map.sheet.pages.some(function (p) { return p.title === 'SOURCE → RÈGLE'; }));
    map.panelPrimary(); step(35);
    if (!game.scene.isActive('Game')) report.push({ debug: { kind: map.panelKind, action: map.panelAction, status: GP.Progression.status(0), scenes: game.scene.getScenes(true).map(function (s) { return s.scene.key; }), gameStatus: game.scene.getScene('Game').sys.settings.status } });
    check('Fiche → niveau', game.scene.isActive('Game'));
    var g = game.scene.getScene('Game'); g.introMs = 0; step(20);
    check('Collision au sol', g.player.body.blocked.down);
    var y = g.player.y; g.bot = { step: function () { return { jump: true }; } }; step(10);
    check('Saut physique', g.player.y < y - 10); g.bot = null;
    g.collect(g.pixels[0], true); var count = g.pc.count; g.collect(g.pixels[0], true);
    check('Collecte idempotente et reconstruction', count === 1 && g.pc.count === 1 && g.pc.rate() > 0);
    var l = g.lanterns[0]; g.player.body.reset(l.x, l.y); g.checkWorld();
    check('Checkpoint de proximité', g.checkpointIndex === 0);
    g.player.body.reset(g.W - 10, 0); g.checkWorld(); check('Pas de checkpoint distant', g.checkpointIndex === 0);
    g.saveRun(); g = level(0);
    check('Reprise : pixels, image et lanterne', g.pc.count === 1 && g.pixels[0].taken && g.checkpointIndex === 0 && Math.abs(g.player.x - l.x) < 1);
    g.invuln = 0; g.die('CHUTE !'); step(50);
    check('Mort → réapparition, pixels gardés', g.deaths === 1 && !g.dying && g.pc.count === 1 && g.invuln > 0);
    g.pause(); var before = g.time_ms; step(30); check('Pause : chrono arrêté', g.time_ms === before);
    g.openHelp(); g.help.close(); check('Aide → pause', !!g.pauseMenu); g.quit(); step(40);
    g = level(0); check('Retour en niveau : aucun ancien menu', !g.pauseMenu && !g.help && !g.paused && !g.physics.world.isPaused);
    g.pause(); g.resume(); check('Pause et reprise après réentrée', !g.pauseMenu && !g.paused);
    // Changement de météo pendant une pousse : aucune ancienne animation ne réactive une ronce sèche.
    function weather(i) { GP.Weather.simIndex = i - 1; var st = GP.Weather.nextSim(); g.applyWeather(st); }
    weather(2); step(10); weather(0); step(10); weather(2); step(90);
    check('Pluie rapide : ronces visibles et actives', g.rainThorns.every(function (t) { return t.img.visible && t.active; }));
    weather(0); step(50); check('Soleil : ronces inactives, fleurs solides', g.rainThorns.every(function (t) { return !t.active && !t.img.visible; }) && g.sunPlats.every(function (p) { return p.body.enable; }));
    // Fin contrôlée : teste le flux et l'intégrité, pas une traversée humaine des obstacles.
    g.pixels.forEach(function (p) { g.collect(p, true); }); step(160);
    check('Image complète → résultat et sauvegarde', game.scene.isActive('Result') && !!GP.Progression.data.completed['jardin-des-plantes'] && !GP.Progression.data.runs['jardin-des-plantes']);
    game.scene.getScene('Result').leave('Map'); step(40);
    check('Résultat → carte, étape suivante disponible', game.scene.isActive('Map') && GP.Progression.canEnter(1));
    for (var i = 1; i < 3; i++) {
      g = level(i); g.time_ms = 90000; g.pixels.forEach(function (p) { g.collect(p, true); }); step(160);
      check('Transition et résultat ' + GP.LOCATIONS[i].id, game.scene.isActive('Result') && !!GP.Progression.data.completed[GP.LOCATIONS[i].id]);
    }
    check('12 lieux non simulés : 3 terminables, 9 à venir', GP.Progression.completedCount() === 3 && GP.LOCATIONS.filter(function (l) { return !l.playable; }).length === 9);
    check('Sauvegarde rechargée : 3 résultats', Object.keys(GP.Save.load().completed).length === 3);
    check('Carte découpée pour textures mobiles', GP.MapArt.worldKeys.length === 2 && GP.MapArt.worldKeys.every(function (k) { return game.textures.get(k).getSourceImage().width <= 2048; }));
  } catch (e) { report.push({ name: 'STOP : ' + e.message, ok: false, stack: e.stack }); }
  finally {
    GP.Cloud.schedulePush = oldPush; GP.Cloud.shouldAsk = oldAsk; GP.Weather.state = oldState; GP.Weather.simIndex = oldSim;
    GP.Progression.data = oldData; GP.Progression.data.muted = oldMuted; GP.Progression.justCompleted = null;
    GP.Save._mem = oldMem;
    if (storage) { if (raw === null) storage.removeItem(GP.Config.SAVE_KEY); else storage.setItem(GP.Config.SAVE_KEY, raw); }
    start('Menu'); Date.now = oldNow; game.loop.wake();
  }
  return report;
};
