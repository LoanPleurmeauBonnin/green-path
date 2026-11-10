/** Recette contrôlée du moteur, pas un playtest humain. Charger aussi tools/playtest.js. */
GP.runRegressionTests = function () {
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Recette locale uniquement');
  var game = GP.game, report = [], st = GP.Save.storage(), raw = st && st.getItem(GP.Config.SAVE_KEY), oldMem = GP.Save._mem;
  var oldData = GP.Progression.data, oldJust = GP.Progression.justCompleted, oldPush = GP.Cloud.schedulePush, oldAsk = GP.Cloud.shouldAsk;
  var oldWeather = GP.Weather.state, oldSim = GP.Weather.simIndex, oldNow = Date.now, oldLang = GP.I18n.lang, oldPaused = game.isPaused;
  var oldPads = Object.getOwnPropertyDescriptor(navigator, 'getGamepads'), oldDevice = GP.Prompts.device, oldProfile = GP.Prompts.profile;
  var originalZones = {}; Object.keys(GP.LEVELS).forEach(function (id) { originalZones[id] = GP.LEVELS[id].shelters; });
  var pad = { connected: true, id: 'QA standard', axes: [0, 0], buttons: Array.from({ length: 17 }, function () { return { pressed: false, value: 0 }; }) };
  Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: function () { return [pad]; } });
  var now = performance.now(), elapsed = 0, epoch = Date.now();
  function tick(n) { for (var i = 0; i < (n || 1); i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); } }
  function start(key, data) { game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); game.scene.start(key, data || {}); tick(2); return game.scene.getScene(key); }
  function check(name, ok) { report.push({ name: name, ok: !!ok }); if (!ok) throw new Error(name); }
  function button(i) { pad.buttons[i].pressed = true; tick(); pad.buttons[i].pressed = false; tick(); }
  function press(code, name) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: name, keyCode: code, which: code, bubbles: true, cancelable: true })); tick(2);
    window.dispatchEvent(new KeyboardEvent('keyup', { key: name, keyCode: code, which: code, bubbles: true })); tick();
  }
  function weather(g, index) { GP.Weather.simIndex = index - 1; g.applyWeather(GP.Weather.nextSim()); }
  function sample(g, x, y, instant) { g.player.body.reset(x, y); g.updateShelter(50, !!instant); }
  function normalized(s) { return s.replace(/\s/g, ''); }
  game.loop.sleep(); game.isPaused = false; Date.now = function () { return epoch + elapsed; };
  GP.Cloud.schedulePush = function () {}; GP.Cloud.shouldAsk = function () { return false; };
  GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true; GP.Progression.justCompleted = null;
  GP.Weather.simIndex = 1; GP.Weather.nextSim(); GP.Prompts.use('keyboard');
  try {
    var menu = start('Menu'); menu.buildCredits(); tick(40);
    check('Menu → écran de crédits distinct', game.scene.isActive('About'));
    for (var lang of ['fr', 'en']) {
      GP.I18n.setLang(lang); var about = start('About');
      for (var i = 0; i < 3; i++) {
        about.selectSection(i); var section = about.sections[i], all = [];
        for (var p = 0; p < section.pages.length; p++) {
          about.pageIndex = p; about.render(); all.push(about.body.text);
          check('Lecture sans débordement ' + lang + '/' + i + '/' + p, about.body.height <= 114 && about.body.width <= 416 && about.body.y + about.body.height <= 207);
        }
        check('Contenu conservé ' + lang + '/' + i, normalized(all.join('')) === normalized(section.paragraphs.join('')));
      }
    }
    GP.I18n.setLang('fr'); var about = start('About'); press(39, 'ArrowRight');
    check('Clavier : pagination des crédits', about.pageIndex === 1 || about.sectionIndex === 1);
    press(40, 'ArrowDown'); check('Clavier : sélection de rubrique', about.sectionIndex === 1 || about.sectionIndex === 2);
    about.selectSection(0); button(13);
    check('Manette : rubrique confidentialité', about.sectionIndex === 1); button(13);
    check('Manette : rubrique sources', about.sectionIndex === 2); button(1); tick(2);
    check('Manette : retour menu', game.scene.isActive('Menu'));
    var options = start('Options');
    check('Options : cinq lignes espacées', options.rowsList.length === 5 && options.rowsList.every(function (r, i, rows) { return !i || r.bg.y - rows[i - 1].bg.y - r.bg.height >= 8; }));
    press(9, 'Tab'); check('Clavier : Tab change le groupe Options', options.group === 1); press(9, 'Tab');
    button(5); check('Options : RB change le groupe sans changer la langue', options.group === 1 && GP.I18n.lang === 'fr');
    check('Options : trois lignes données/aide', options.rowsList.length === 3);
    options.sel = 1; options.privacy(); tick(2);
    check('Options → confidentialité dans le même lecteur', game.scene.isActive('About') && game.scene.getScene('About').sectionIndex === 1);
    game.scene.getScene('About').leave(); tick(2); options = game.scene.getScene('Options');
    check('Confidentialité → Options au même groupe', game.scene.isActive('Options') && options.group === 1 && options.sel === 1);
    var map = start('Map');
    for (i = 0; i < 12; i++) {
      map.goTo(i, false); tick(160);
      check('Piédestal atteint ' + i, map.hero.x === map.nx(i) && map.hero.y === GP.MapArt.walkY(map.nx(i)) && map.travel.y === map.hero.y);
    }
    map.step(-1); tick(110); var x = map.hero.x, y = map.hero.y; map.step(1);
    check('Inversion : pas de téléportation X/Y', map.hero.x === x && map.hero.y === y); tick();
    check('Inversion : modèle et sprite restent sur la surface', map.hero.x > x && map.hero.y === map.travel.y);
    map.goTo(10, false); tick(200); map.openPanel(10);
    check('Fiche centrée conformément au choix utilisateur', map.modalObj.titleLeft.y === 73);
    var g = start('Game', { index: 2 });
    check('Étape : centrage et séparation du HUD', g.introCard.x === GP.Config.WIDTH / 2 && g.introCard.y === 135 && g.introCard.y - g.introCard.height / 2 > 52 && g.introCard.width <= 400);
    check('Étape : textes au-dessus du fond', g.introCard.objects.slice(1).every(function (o) { return o.depth > g.introCard.objects[0].depth; }));
    g.introMs = 0; weather(g, 2); sample(g, 900, 224, true);
    check('Pluie : extérieur inchangé', g.phy.accelGround === 650 && g.shelter.rain === 0);
    sample(g, 936, 224); check('Entrée : protection progressive', g.shelter.rain > 0 && g.shelter.rain < 1); tick(30);
    check('Passage : sec et collisions conservées', g.phy.accelGround === 1100 && g.shelter.rain === 1 && g.solidAt(936, 160) && g.player.body.blocked.down);
    var cam = g.cameras.main;
    check('Pluie : aucune goutte sous le passage avec caméra décalée', g.wx.exposureAt(936 - cam.scrollX, 210 - cam.scrollY, false) === 0);
    weather(g, 4); check('Vent : poussée réduite de moitié', g.phy.airPush === 55);
    weather(g, 6); check('Neige : inertie sèche sous le linteau', g.phy.accelGround === 1100 && g.phy.accelAir === 700);
    weather(g, 2); check('Changement météo en abri : état cohérent', g.shelter.rain === 1 && g.phy.accelGround === 1100);
    sample(g, 980, 224); check('Sortie : pas de bascule physique brutale', g.shelter.rain > 0 && g.shelter.rain < 1); tick(30);
    check('Sortie : pluie habituelle retrouvée', g.shelter.rain === 0 && g.phy.accelGround === 650);
    var zones = g.L.shelters;
    g.L.shelters = zones.concat([{ id: 'qa-overlap', x: 912, y: 176, w: 48, h: 49, rain: 0.5, snow: 0.5, wind: 1 }]);
    sample(g, 936, 224, true); check('Chevauchement : maximum par canal', g.shelter.rain === 1 && g.shelter.wind === 1);
    g.L.shelters = zones;
    // Fixture de reprise : un checkpoint est couvert sans déplacer ses coordonnées ni migrer de sauvegarde.
    var lantern = g.lanterns[0]; g.checkpointIndex = 0; g.collect(g.pixels[0], true); var expectedTaken = g.pc.count; g.saveRun();
    g.L.shelters = zones.concat([{ id: 'qa-resume', x: lantern.x - 24, y: lantern.y - 48, w: 48, h: 49, rain: 1, snow: 1, wind: 0.5 }]);
    g = start('Game', { index: 2 });
    check('Reprise : protection recalculée au checkpoint couvert (fixture)', g.pc.count === expectedTaken && g.shelter.rain === 1 && g.phy.accelGround === 1100);
    check('Sauvegarde : pas de champ météo ajouté', !Object.prototype.hasOwnProperty.call(GP.Save.load().runs.chateau, 'shelter'));
    g.L.shelters = zones; g.updateShelter(0, true);
    check('Reprise extérieure : aucune ancienne protection conservée', g.shelter.rain === 0);
    GP.Weather.simIndex = 1; GP.Weather.nextSim(); g = start('Game', { index: 0 }); g.introMs = 0; sample(g, 88, 224, true);
    check('Auvent existant : protection partielle', g.shelter.rain === 0.5 && g.shelter.wind === 0.25 && g.phy.accelGround === 875);
    var session = GP.Playtest.start(g, { id: 'QA', kind: 'simulation' }); tick(30); g.collect(g.pixels[1], true); session.stop();
    check('Instrumentation : collecte réelle enregistrée, pas de notes humaines inventées', session.report.events.some(function (e) { return e.type === 'collect'; }) && session.report.notes.length === 0 && session.report.kind === 'simulation');
  } catch (e) { report.push({ name: 'STOP : ' + e.message, ok: false, stack: e.stack }); }
  finally {
    game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); tick();
    Object.keys(originalZones).forEach(function (id) { GP.LEVELS[id].shelters = originalZones[id]; });
    if (oldPads) Object.defineProperty(navigator, 'getGamepads', oldPads); else delete navigator.getGamepads;
    GP.Progression.data = oldData; GP.Progression.justCompleted = oldJust; GP.Save._mem = oldMem;
    GP.Cloud.schedulePush = oldPush; GP.Cloud.shouldAsk = oldAsk; GP.Weather.state = oldWeather; GP.Weather.simIndex = oldSim;
    GP.I18n.setLang(oldLang); GP.Prompts.use(oldDevice, oldProfile);
    if (st) { if (raw === null) st.removeItem(GP.Config.SAVE_KEY); else st.setItem(GP.Config.SAVE_KEY, raw); }
    start('Menu'); Date.now = oldNow; game.isPaused = oldPaused; game.loop.wake();
  }
  return report;
};

/** Exports du rendu Phaser dans le viewport courant, données météo de simulation. */
GP.captureRegressionSheet = async function () {
  if (!GP.Config.DEV_TOOLS) throw new Error('Export QA en mode dev uniquement');
  var game = GP.game, st = GP.Save.storage(), raw = st && st.getItem(GP.Config.SAVE_KEY), oldMem = GP.Save._mem;
  var oldData = GP.Progression.data, oldJust = GP.Progression.justCompleted, oldWeather = GP.Weather.state, oldSim = GP.Weather.simIndex;
  var oldLang = GP.I18n.lang, oldDevice = GP.Prompts.device, oldProfile = GP.Prompts.profile, oldNow = Date.now, oldPaused = game.isPaused;
  var oldPush = GP.Cloud.schedulePush, oldAsk = GP.Cloud.shouldAsk, now = performance.now(), elapsed = 0, epoch = Date.now();
  var frames = [], names = [], running = game.loop.running;
  function tick(n) { for (var i = 0; i < (n || 1); i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); } }
  function start(key, data) { game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); game.scene.start(key, data || {}); tick(2); return game.scene.getScene(key); }
  async function shot(name) { tick(40); frames.push(await new Promise(function (ok) { game.renderer.snapshot(ok); tick(); })); names.push(name); }
  game.loop.sleep(); game.isPaused = false; Date.now = function () { return epoch + elapsed; };
  GP.Cloud.schedulePush = function () {}; GP.Cloud.shouldAsk = function () { return false; };
  GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true; GP.Progression.justCompleted = null;
  GP.Weather.simIndex = -1; GP.Weather.nextSim(); GP.I18n.setLang('fr'); GP.Prompts.use('keyboard');
  try {
    var about = start('About'); await shot('CRÉDITS'); about.selectSection(1); await shot('CONFIDENTIALITÉ');
    about.selectSection(2); await shot('SOURCES ET LICENCES');
    var options = start('Options'); await shot('OPTIONS / JEU'); options.group = 1; options.sel = 0; options.build(); await shot('OPTIONS / DONNÉES');
    var map = start('Map'); map.goTo(2, false); tick(260); await shot('PIÉDESTAL / POSITION LOGIQUE');
    map.openPanel(2); await shot('FICHE CENTRÉE');
    var g = start('Game', { index: 0 }); await shot('ENTRÉE / ÉTAPE CENTRÉE');
    GP.Weather.simIndex = 1; GP.Weather.nextSim(); g = start('Game', { index: 2 }); g.introMs = 0;
    g.player.body.reset(936, 224); g.cameras.main.centerOn(936, 135); tick(170); await shot('CHÂTEAU / PASSAGE SEC');
    GP.Weather.simIndex = 1; GP.Weather.nextSim(); g = start('Game', { index: 0 }); g.introMs = 0;
    g.player.body.reset(88, 224); tick(170); await shot('JARDIN / AUVENT PARTIEL');
    // Lecture isolée des modules, sans toucher aux textures originales.
    map = start('Map'); var W = GP.Config.WIDTH;
    map.add.rectangle(W / 2, 135, 420, 230, GP.int(GP.PAL.k), 1).setScrollFactor(0).setDepth(200);
    GP.UI.txt(map, W / 2, 34, 'MODULE / TERMINAISON', GP.PAL.g).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    ['carte_haie', 'carte_barriere_bois'].forEach(function (key, i) {
      [key, GP.MapDecor.key(map, key)].forEach(function (texture, j) {
        map.add.image(W / 2 - 100 + j * 200, 94 + i * 92, texture).setScale(4).setScrollFactor(0).setDepth(201);
      });
    });
    await shot('EXTRÉMITÉS CIBLÉES / AVANT-APRÈS');
    var cellW = GP.Config.WIDTH * 2, cellH = 564, canvas = document.createElement('canvas');
    canvas.width = cellW * 2; canvas.height = cellH * Math.ceil(frames.length / 2);
    var ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#14182e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    frames.forEach(function (image, i) {
      var x = i % 2 * cellW, y = Math.floor(i / 2) * cellH;
      ctx.fillStyle = '#f4f7f2'; ctx.font = '14px monospace'; ctx.fillText(names[i] + ' — ' + innerWidth + '×' + innerHeight, x + 8, y + 17);
      ctx.drawImage(image, x, y + 24, cellW, 540);
    });
    var link = document.createElement('a'); link.download = 'regressions-' + innerWidth + 'x' + innerHeight + '.png'; link.href = canvas.toDataURL(); link.click();
    return { viewport: [innerWidth, innerHeight], frames: frames.length };
  } finally {
    game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); tick();
    GP.Progression.data = oldData; GP.Progression.justCompleted = oldJust; GP.Save._mem = oldMem;
    GP.Cloud.schedulePush = oldPush; GP.Cloud.shouldAsk = oldAsk; GP.Weather.state = oldWeather; GP.Weather.simIndex = oldSim;
    GP.I18n.setLang(oldLang); GP.Prompts.use(oldDevice, oldProfile);
    if (st) { if (raw === null) st.removeItem(GP.Config.SAVE_KEY); else st.setItem(GP.Config.SAVE_KEY, raw); }
    start('Menu'); Date.now = oldNow; game.isPaused = oldPaused; if (running) game.loop.wake();
  }
};
