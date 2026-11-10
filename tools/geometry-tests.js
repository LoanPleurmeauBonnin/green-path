/** Nécessite tools/bot.js. Diagnostic géométrique, PAS une preuve de traversée complète sans danger.
 * Téléporte à des surfaces candidates ; désactive les morts. Utiliser une origine localhost de test.
 */
GP.runGeometryTest = function (index, simIndex) {
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Tests locaux uniquement');
  var game = GP.game, oldData = GP.Progression.data, oldMem = GP.Save._mem, oldNow = Date.now;
  var storage = GP.Save.storage(), raw = storage && storage.getItem(GP.Config.SAVE_KEY);
  var oldState = GP.Weather.state, oldSim = GP.Weather.simIndex, oldPush = GP.Cloud.schedulePush;
  var now = performance.now(), start = now, epoch = Date.now();
  game.loop.sleep(); Date.now = function () { return epoch + now - start; };
  function step(n) { for (var i = 0; i < n; i++) { now += 1000 / 60; game.headlessStep(now, 1000 / 60); } }
  try {
    GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true;
    GP.Cloud.schedulePush = function () {};
    GP.Weather.simIndex = simIndex - 1; GP.Weather.nextSim();
    game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); });
    game.scene.start('Game', { index: index }); step(2);
    var g = game.scene.getScene('Game'); g.saveRun = function () {};
    var bad = GP.TestBot.reach(g, step);
    delete g.saveRun;
    return { level: g.loc.id, weather: GP.Weather.get().simName, total: g.L.pixels.length, unreachable: bad };
  } finally {
    var g = game.scene.getScene('Game'); delete g.saveRun;
    game.scene.stop('Game');
    GP.Progression.data = oldData; GP.Save._mem = oldMem; GP.Cloud.schedulePush = oldPush;
    GP.Weather.state = oldState; GP.Weather.simIndex = oldSim;
    if (storage) { if (raw === null) storage.removeItem(GP.Config.SAVE_KEY); else storage.setItem(GP.Config.SAVE_KEY, raw); }
    game.scene.start('Menu'); step(1); Date.now = oldNow; game.loop.wake();
  }
};
