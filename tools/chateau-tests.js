/** Recette contrôlée du Château dans Phaser 3.90. Pas un essai humain.
 * Charger en local ?dev=1 puis GP.runChateauTests(). Les téléportations sont réservées aux tests de composants.
 * GP.runChateauRoute() exécute séparément un parcours scripté sans téléportation après le départ.
 * Ces outils sont exclus de la publication, sauvegarde/cloud restaurés à la fin de chaque recette.
 */
(function () {
  function fixture(run) {
    if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Tests locaux uniquement');
    var game = GP.game, data = GP.Progression.data, mem = GP.Save._mem, just = GP.Progression.justCompleted;
    var storage = GP.Save.storage(), raw = storage && storage.getItem(GP.Config.SAVE_KEY);
    var push = GP.Cloud.schedulePush, state = GP.Weather.state, sim = GP.Weather.simIndex;
    var now = performance.now(), oldNow = Date.now, elapsed = 0, epoch = Date.now();
    game.loop.sleep(); Date.now = function () { return epoch + elapsed; };
    function tick(n) { for (var i = 0; i < (n || 1); i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); } }
    function start(fresh) {
      if (fresh) GP.Progression.data = GP.Save.defaults();
      GP.Progression.data.muted = true;
      game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); });
      game.scene.start('Game', { index: GP.LOCATIONS.findIndex(function (l) { return l.id === 'chateau'; }) }); tick(2);
      var g = game.scene.getScene('Game'); g.introMs = 0; return g;
    }
    function weather(g, i, reverse) {
      if (i < 0) { GP.Weather.simIndex = -1; GP.Weather.state = GP.Weather.fallback(); }
      else { GP.Weather.simIndex = i - 1; GP.Weather.nextSim(); }
      if (reverse) GP.Weather.state = Object.assign({}, GP.Weather.state, { windDir: (GP.Weather.state.windDir + 180) % 360 });
      g.applyWeather(GP.Weather.get(), true); g.updateShelter(0, true);
    }
    GP.Cloud.schedulePush = function () {}; GP.Weather.simIndex = -1; GP.Weather.nextSim();
    try { return run({ tick: tick, start: start, weather: weather, game: game }); }
    finally {
      game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); tick();
      GP.Progression.data = data; GP.Progression.justCompleted = just; GP.Save._mem = mem;
      GP.Cloud.schedulePush = push; GP.Weather.state = state; GP.Weather.simIndex = sim;
      if (storage) { if (raw === null) storage.removeItem(GP.Config.SAVE_KEY); else storage.setItem(GP.Config.SAVE_KEY, raw); }
      game.scene.start('Menu', {}); tick(2); Date.now = oldNow; game.loop.wake();
    }
  }

  GP.runChateauTests = function () {
    return fixture(function (f) {
      var report = [], g = f.start(true), tick = f.tick;
      function check(name, ok) { report.push({ name: name, ok: !!ok }); if (!ok) throw new Error(name); }
      try {
        tick(20);
        check('Monde 170×20 et caméra verticale', g.W === 2720 && g.H === 320 && g.cameras.main.getBounds().height === 320);
        check('Départ sur le sol et 20 fragments', g.player.body.blocked.down && g.pc.total === 20);
        var oldY = g.player.y;
        g.bot = { step: function () { return { jump: true }; } }; tick(10); g.bot = null;
        check('Saut réel sans retoucher GP.Tuning', g.player.y < oldY - 10 && g.TUNE.jump === -320);
        g = f.start(true); tick(3);
        var b = g.bridges[0]; g.player.body.reset(b.x * 16 + 32, b.y * 16); b.clock = b.open - 20; tick(50);
        check('Pont occupé : aucun relevage sous le joueur', b.body.enable && b.angle === 0 && g.deaths === 0);
        g.player.body.reset(40, 240); b.clock = b.open - 20; tick(30);
        check('Pont relevé : pas de collision fantôme', !b.body.enable && b.angle === -90);
        g.pause(); var before = b.clock; tick(60);
        check('Pause : cycle du pont arrêté', b.clock === before); g.resume();
        g = f.start(true); tick(3);
        var gate = g.gates[0]; gate.img.y = gate.floor - 48; gate.down = false; gate.t = gate.open - 20;
        g.player.body.reset(gate.img.x, gate.floor); tick(60);
        check('Herse : fermeture différée sous le joueur, non létale', !gate.body.enable && g.deaths === 0);
        g.player.body.reset(24 * 16, 304); g.checkWorld();
        check('Douves : contact détecté même sans chute hors monde', g.dying && g.deaths === 1); tick(50);
        check('Mort : retour au point sûr', !g.dying && Math.abs(g.player.x - 40) < 1);
        var zone = g.L.shelters[0], sx = zone.x + 8;
        for (var wi of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]) {
          g.player.body.reset(sx, 240); f.weather(g, wi);
          check('Météo ' + wi + ' : abri sec et pluie/neige masquées', g.phy.accelGround === 1100 &&
            g.wx.exposureAt(sx - g.cameras.main.scrollX, 230 - g.cameras.main.scrollY, false) === 0 &&
            g.wx.exposureAt(sx - g.cameras.main.scrollX, 230 - g.cameras.main.scrollY, true) === 0);
        }
        g.player.body.reset(sx, 240); f.weather(g, 4);
        check('Vent droit : protection partielle', g.phy.airPush === 55); f.weather(g, 4, true);
        check('Vent gauche : même protection', g.phy.airPush === -55);
        g.player.body.reset(112 * 16, 144); f.weather(g, 2);
        check('Rempart ouvert : pluie active', g.shelter.rain === 0 && g.phy.accelGround === 650);
        f.weather(g, 6); check('Rempart ouvert : neige active', g.phy.accelGround === 430);
        g = f.start(true); var lantern = g.lanterns[2];
        g.player.body.reset(lantern.x, lantern.y); g.checkWorld(); g.collect(g.pixels[0], true); g.saveRun();
        g = f.start(false);
        check('Checkpoint 3 : reprise et fragment conservés', g.checkpointIndex === 2 && g.pc.count === 1 && Math.abs(g.player.x - lantern.x) < 1);
        g.player.body.reset(g.L.exit.x * 16 + 8, g.L.exit.y * 16); g.checkWorld();
        check('Arche fermée et zone manquante indiquée', !g.finished && g.exit.label.text.indexOf('DOUVES') >= 0);
        g.player.body.reset(40, 240); g.pixels.forEach(function (p) { g.collect(p, true); });
        check('Dernier fragment : pas de réussite à distance', g.pc.done() && !g.finished);
        g = f.start(false);
        check('Reprise avec image complète : arche encore requise', g.pc.done() && !g.finished);
        g.player.body.reset(g.L.exit.x * 16 + 8, g.L.exit.y * 16); g.checkWorld();
        check('Image complète + arche : réussite', g.finished); tick(160);
        check('Résultat enregistré et reprise effacée', f.game.scene.isActive('Result') && !!GP.Progression.data.completed.chateau && !GP.Progression.data.runs.chateau);
      } catch (e) { report.push({ name: 'STOP : ' + e.message, ok: false, stack: e.stack }); }
      return report;
    });
  };

  /** Parcours scripté : physique normale, dangers actifs, sans téléportation ni collecte forcée.
   * Les points sont des objectifs du contrôleur, PAS des positions imposées au corps.
   */
  GP.runChateauRoute = function (simIndex, reverse, returnTrip) {
    return fixture(function (f) {
      var g = f.start(true); f.weather(g, simIndex === undefined ? 0 : simIndex, reverse);
      var goals = [[8,15], [18,15], [30,15], [37,15], [46,15], [54,15], [65,15], [73,15],
        [76,14], [79,13], [83,12], [90,10], [98,11], [104,9], [112,9], [119,9], [124,9], [130,9],
        [138,9], [140,9], [143,10], [145,11], [147,12], [150,13], [162,13], [167.5,13]];
      if (returnTrip) {
        var path = goals.slice(0, -1);
        goals = path.concat(path.slice().reverse().filter(function (p) { return p[0] !== 138 && p[0] !== 140; }), [[2,15]]);
      }
      var deathReasons = [];
      g.events.on('playtest-event', function (e) { if (e.type === 'death') deathReasons.push(e.reason); });
      var goal = 0, hold = 0, frames = 0, lastX = g.player.x, stuck = 0;
      g.bot = { step: function () {
        if (g.hanging) return { up: true };
        var b = g.player.body, point = goals[goal], ground = b.blocked.down || b.touching.down;
        if (!point) return {};
        var tx = point[0] * 16 + 8, ty = point[1] * 16, dx = tx - g.player.x;
        if (Math.abs(dx) < 4 && Math.abs(b.bottom - ty) < 3 && ground) { goal++; hold = 0; return {}; }
        var aim = dx - b.velocity.x * 0.1;
        var out = { right: aim > 2, left: aim < -2,
          down: ground && g.player.x >= 46 * 16 && g.player.x <= 54 * 16, jump: false };
        if (hold > 0) { hold--; out.jump = true; }
        for (var bridge of g.bridges) {
          if (dx > 0 && b.right <= bridge.x * 16 && bridge.x * 16 - b.right < 20 && !bridge.body.enable) out.right = false;
          if (dx < 0 && b.x >= (bridge.x + bridge.w) * 16 && b.x - (bridge.x + bridge.w) * 16 < 20 && !bridge.body.enable) out.left = false;
        }
        for (var gate of g.gates) {
          if (dx > 0 && g.player.x < gate.img.x - 22 && gate.img.x - g.player.x < 36 && gate.body.enable) out.right = false;
        }
        var aheadX = dx > 0 ? b.right + 12 : b.x - 12;
        var rising = ground && ty < b.bottom - 4 && g.solidAt(aheadX, b.y + 8);
        var tile = g.layer.getTileAtWorldXY(aheadX, b.bottom + 3);
        var bridgeAhead = g.bridges.some(function (pl) { return pl.body.enable && aheadX >= pl.x * 16 && aheadX < (pl.x + pl.w) * 16 && Math.abs(pl.y * 16 - b.bottom) < 4; });
        var gap = ground && Math.abs(dx) > 20 && (!tile || tile.index < 0) && !bridgeAhead;
        var barrel = ground && g.barrels.some(function (r) { return Math.abs(r.img.x - g.player.x) < 36 && Math.abs(r.img.y - b.bottom) < 4; });
        if (!hold && !g.jumpWasDown && !out.down && (out.left || out.right) && (rising || gap || barrel)) { hold = 24; out.jump = true; }
        // Au retour, observer le tonneau depuis la marche sûre avant de remonter sur le rempart.
        if (returnTrip && point[0] === 130 && g.player.x > 142 * 16 && ground &&
          !g.barrels.some(function (r) { return r.dir < 0 && r.img.x < 134 * 16; })) {
          out.left = false; out.jump = false; hold = 0;
        }
        return out;
      } };
      while (frames++ < 18000 && goal < goals.length && !g.finished && g.deaths === 0) {
        f.tick();
        if (Math.abs(g.player.x - lastX) < 0.1) stuck++; else stuck = 0;
        lastX = g.player.x;
        if (stuck > 900) break;
      }
      var result = { kind: 'scripted-route', weather: GP.Weather.get().simName || 'NEUTRE', reverse: !!reverse, returnTrip: !!returnTrip,
        reachedGoal: goal, goals: goals.length, x: g.player.x, y: g.player.y, deaths: g.deaths,
        collected: g.pc.count, total: g.pc.total, finished: g.finished,
        returnedToStart: !!returnTrip && goal >= goals.length && g.deaths === 0, seconds: g.time_ms / 1000,
        missing: g.pixels.filter(function (p) { return !p.taken; }).map(function (p) { return [p.x / 16, p.y / 16]; }),
        deathReasons: deathReasons, body: { grounded: g.player.body.blocked.down || g.player.body.touching.down, hanging: !!g.hanging } };
      g.bot = null; return result;
    });
  };
})();
