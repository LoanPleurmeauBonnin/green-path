/** QA du polish : origine locale dédiée, ?dev=1, manette API simulée (pas un test matériel).
 * Le stockage de progression et les réglages sont restaurés ; aucune écriture cloud.
 */
GP.runPolishTests = function () {
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Tests locaux uniquement');
  var game = GP.game, report = [], oldData = GP.Progression.data, oldMem = GP.Save._mem, st = GP.Save.storage();
  var raw = st && st.getItem(GP.Config.SAVE_KEY), settingsRaw = st && st.getItem('greenpath.settings');
  var oldKeys = JSON.parse(JSON.stringify(GP.Settings.keys)), oldLang = GP.Settings.lang;
  var oldDevice = GP.Prompts.device, oldProfile = GP.Prompts.profile, oldNow = Date.now, epoch = Date.now(), now = performance.now(), origin = now;
  var oldAsk = GP.Cloud.shouldAsk, oldPush = GP.Cloud.schedulePush, oldSim = GP.Weather.simIndex, oldWeather = GP.Weather.state;
  var oldGuest = GP.Cloud.chooseGuest, oldScore = GP.Cloud.scoreboard;
  var oldJust = GP.Progression.justCompleted;
  var oldPads = Object.getOwnPropertyDescriptor(navigator, 'getGamepads');
  var pad = null;
  Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: function () { return pad ? [pad] : []; } });
  function check(name, ok) { report.push({ name: name, ok: !!ok }); if (!ok) throw new Error(name); }
  function tick(n) { for (var i = 0; i < (n || 1); i++) { now += 1000 / 60; game.step(now, 1000 / 60); } }
  function start(key, data) { game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); game.scene.start(key, data || {}); tick(2); return game.scene.getScene(key); }
  function button(i) { pad.buttons[i].pressed = true; tick(); pad.buttons[i].pressed = false; tick(); }
  function keyboard() { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift', keyCode: 16, bubbles: true })); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift', keyCode: 16, bubbles: true })); }
  function key(type, code, name) { window.dispatchEvent(new KeyboardEvent(type, { key: name, keyCode: code, which: code, bubbles: true, cancelable: true })); }
  function texts(objects) { return objects.filter(function (o) { return o.type === 'Text'; }).map(function (o) { return o.text; }); }
  game.loop.sleep(); var paused = game.isPaused; game.isPaused = false;
  Date.now = function () { return epoch + now - origin; };
  GP.Cloud.shouldAsk = function () { return false; }; GP.Cloud.schedulePush = function () {};
  GP.Settings.keys = JSON.parse(JSON.stringify(GP.Settings.DEFAULT_KEYS));
  GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true; GP.Progression.justCompleted = null;
  GP.Weather.simIndex = -1; GP.Weather.nextSim(); GP.Prompts.use('keyboard'); GP.Settings.set({ lang: 'fr' });
  try {
    var map = start('Map');
    check('Carte : commandes clavier initiales', map.navHint.text.indexOf('ENTRÉE') >= 0);
    var before = map.hero.x; key('keydown', 39, 'ArrowRight'); tick(2); key('keyup', 39, 'ArrowRight'); tick();
    check('Clavier DOM : droite déplace la carte', map.hero.x > before);
    before = map.hero.x; key('keydown', 37, 'ArrowLeft'); tick(2); key('keyup', 37, 'ArrowLeft'); tick();
    check('Clavier DOM : gauche inverse la carte', map.hero.x < before);
    map.travel.to(0, false); tick(20);
    pad = { connected: true, id: 'QA standard', mapping: 'standard', axes: [0, 0], buttons: Array.from({ length: 17 }, function () { return { pressed: false, value: 0 }; }) };
    tick(); pad.axes[0] = 0.6; tick(); pad.axes[0] = 0; tick();
    check('Connexion et drift : aucun basculement', GP.Prompts.device === 'keyboard' && !map.moving);
    button(3); check('Manette : Y ouvre le livre, aide synchronisée', !!map.help && GP.Prompts.device === 'gamepad' && map.navHint.text.indexOf('[A]') >= 0);
    button(5); check('Manette : RB tourne la page', map.help.page() === 1 && texts(map.help.objs).indexOf('A') >= 0);
    keyboard(); check('Livre ouvert : retour clavier sans fermer', map.help.page() === 1 && texts(map.help.objs).indexOf('ESPACE') >= 0);
    GP.Settings.setKey('jump', 0, 70); check('Livre ouvert : remapping actualisé', texts(map.help.objs).indexOf('F') >= 0);
    map.help.close(); map.step(1); tick(20); var x = map.hero.x; map.step(-1);
    check('Carte : inversion sans déplacement instantané', map.hero.x === x); tick();
    check('Carte : mouvement inverse dès la frame suivante', map.hero.x < x);
    for (var r = 0; r < 50; r++) { x = map.hero.x; map.step(r % 2 ? 1 : -1); tick(); check('Inversion rapide ' + r, Math.abs(map.hero.x - x) <= 95 / 60 + 0.001); }
    map.travel.to(0, false); tick(200);
    check('Carte : arrivée exacte et piédestal suivi', map.hero.x === map.nx(0) && map.hero.y === GP.MapArt.walkY(map.hero.x) && map.travel.y === map.hero.y);
    for (var i = 0; i < 12; i++) {
      map.openPanel(i);
      var safe = true;
      for (var p = 0; p < map.sheet.pages.length; p++) {
        map.sheet.page = p; map.sheetRender();
        safe = safe && map.sheet.content.filter(function (o) { return o.type === 'Text'; }).every(function (o) { return o.y + o.height <= 172; });
      }
      check('Fiche compacte centrée sans débordement : ' + i, safe && map.modalObj.titleLeft.y === 73);
      map.closePanel();
    }
    var g = start('Game', { index: 0 }); g.introMs = 0;
    var jumpSign = g.signs[g.L.hints.findIndex(function (h) { return h.text.indexOf('{jump}') >= 0; })];
    check('Tutoriel : touche remappée', jumpSign && jumpSign.text.text.indexOf('F') >= 0);
    tick(20); key('keydown', 70, 'f'); tick(5);
    check('Clavier DOM : saut avec la touche remappée', g.player.body.velocity.y < 0);
    key('keyup', 70, 'f'); tick();
    pad.axes[0] = 0.9; tick();
    check('En jeu : basculement manette, tutoriel et pause', jumpSign.text.text.indexOf('[A]') >= 0 && g.pauseButton.label.text.indexOf('START') >= 0 && g.ctl.read().right);
    keyboard(); tick(); check('En jeu : clavier reprend, stick maintenu ne vole pas le focus', GP.Prompts.device === 'keyboard' && jumpSign.text.text.indexOf('F') >= 0 && !g.ctl.read().right);
    pad.axes[0] = 0; tick(); button(9);
    check('Pause manette : B annoncé', g.paused && g.pauseMenu.titleRight.text.indexOf('[B]') >= 0);
    button(0); check('Pause manette : A reprend', !g.paused);
    var fits = true;
    for (i = 0; i < GP.Weather.SIMS.length; i++) {
      GP.Weather.simIndex = i - 1; var weather = GP.Weather.nextSim(); g.wxWidget.set(weather);
      fits = fits && g.wxWidget.height === 26 && g.wxWidget.left >= 194 && texts(g.wxWidget.objects).length === 2;
    }
    g.wxWidget.set(GP.Weather.fallback());
    check('Météo : deux lignes, secours explicite, aucun conflit HUD/pause', fits && texts(g.wxWidget.objects)[0].indexOf('NEUTRE') >= 0 && g.wxWidget.source === 'fallback');
    var options = start('Options'); options.mode = 'keys'; options.build();
    check('Options : commandes manette sans remapping clavier contradictoire', options.title.text === 'COMMANDES MANETTE' && !options.rowsList[0].keys);
    keyboard(); check('Options : retour au remapping clavier', options.rowsList[0].keys === true);
    var ev = { keyCode: 13 }; options.activate(ev); options.onAnyKey(ev);
    check('Remapping : la validation ne se capture pas elle-même', !!options.capturing);
    options.onAnyKey({ keyCode: 71 }); check('Remapping : une nouvelle touche reste configurable', GP.Settings.keys.left[0] === 71 && !options.capturing);
    var guest = false; GP.Cloud.chooseGuest = function () { guest = true; };
    GP.Account.open({ mode: 'choose' }); button(13);
    check('Dialogue HTML : commandes manette synchronisées', document.querySelector('.acct-controls').textContent.indexOf('[A]') >= 0);
    button(13); button(0);
    check('Dialogue HTML : invité accessible sans clavier ni requête', guest && !GP.Account.isOpen && !GP.Pad.capture);
    GP.Account.open({ mode: 'create' }); keyboard();
    check('Dialogue HTML : retour clavier et TAB annoncé', document.querySelector('.acct-controls').textContent.indexOf('TAB') >= 0);
    button(1); check('Dialogue HTML : B ferme sans action dans la scène derrière', !GP.Account.isOpen && game.scene.isActive('Options'));
    var result = start('Result', { index: 0, pixels: 32, total: 32, deaths: 0, time: 60 });
    check('Résultat : A carte et X rejouer', texts(result.children.list).some(function (t) { return t === 'CARTE [A]'; }) && texts(result.children.list).some(function (t) { return t === 'REJOUER [X]'; }));
    check('Résultat large : boutons alignés sur le panneau', result.children.list.some(function (o) { return o.type === 'Rectangle' && o.width === 140 && o.y === 234 && o.x === 30 + GP.Config.DX; }));
    keyboard(); check('Résultat : libellés clavier restaurés', texts(result.children.list).some(function (t) { return t === 'CARTE ENTRÉE'; }));
    button(2); tick(40); check('Résultat : X rejoue réellement', game.scene.isActive('Game'));
    var character = start('Character'); button(2);
    check('Avatar : X anime et commandes actualisées', character.poseIdx === 1 && texts(character.children.list).some(function (t) { return t.indexOf('[X] ANIMER') >= 0; }));
    GP.Cloud.scoreboard = function () { return Promise.resolve({ ok: true, rows: [], source: 'live', age: 0 }); };
    var score = start('Score'); check('Classement : bouton B affiché', texts(score.children.list).some(function (t) { return t === 'RETOUR [B]'; }));
    check('Classement large : bouton retour centré', score.children.list.some(function (o) { return o.type === 'Rectangle' && o.width === 140 && o.y === 248 && o.x + 70 === GP.Config.WIDTH / 2; }));
    keyboard(); check('Classement : retour clavier affiché', texts(score.children.list).some(function (t) { return t === 'RETOUR ÉCHAP'; }));
    check('Progression : aucun changement de format', GP.Progression.data.v === GP.Config.SAVE_VERSION);
  } catch (e) { report.push({ name: 'STOP : ' + e.message, ok: false, stack: e.stack }); }
  finally {
    game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); tick();
    if (oldPads) Object.defineProperty(navigator, 'getGamepads', oldPads); else delete navigator.getGamepads;
    GP.Account.close('closed');
    GP.Cloud.scoreboard = oldScore; GP.Cloud.chooseGuest = oldGuest; GP.Cloud.shouldAsk = oldAsk; GP.Cloud.schedulePush = oldPush; GP.Weather.simIndex = oldSim; GP.Weather.state = oldWeather;
    GP.Progression.data = oldData; GP.Progression.justCompleted = oldJust; GP.Save._mem = oldMem; GP.Settings.keys = oldKeys; GP.Settings.lang = oldLang; GP.I18n.setLang(oldLang);
    GP.Prompts.use(oldDevice, oldProfile);
    if (st) { if (raw === null) st.removeItem(GP.Config.SAVE_KEY); else st.setItem(GP.Config.SAVE_KEY, raw); if (settingsRaw === null) st.removeItem('greenpath.settings'); else st.setItem('greenpath.settings', settingsRaw); }
    start('Menu'); Date.now = oldNow; game.isPaused = paused; game.loop.wake();
  }
  return report;
};

/** Export du rendu Phaser, pas une capture du navigateur. Permet de relire les pixels du jeu
 * à la taille CSS du cadre même lorsque la capture desktop est indisponible.
 */
GP.capturePolish = function (name) {
  return new Promise(function (resolve) {
    var game = GP.game, paused = game.isPaused, running = game.loop.running, originalNow = Date.now;
    var now = performance.now(), epoch = Date.now(), elapsed = 0;
    game.loop.sleep(); game.isPaused = false;
    Date.now = function () { return epoch + elapsed; };
    for (var i = 0; i < 40; i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); }
    game.renderer.snapshot(function (image) {
      var canvas = document.createElement('canvas'), scale = innerHeight / GP.Config.HEIGHT;
      canvas.width = Math.round(GP.Config.WIDTH * scale); canvas.height = innerHeight;
      var ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      var link = document.createElement('a'); link.download = name + '.png'; link.href = canvas.toDataURL(); link.click();
      resolve({ width: canvas.width, height: canvas.height });
    });
    game.step(now + elapsed + 16.67, 16.67); Date.now = originalNow; game.isPaused = paused;
    if (running) game.loop.wake();
  });
};

/** Planche des écrans rendus dans le viewport courant. Pas une capture desktop ni une émulation matérielle. */
GP.capturePolishSheet = async function (extras) {
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) throw new Error('Tests locaux uniquement');
  var game = GP.game, oldData = GP.Progression.data, oldMem = GP.Save._mem, st = GP.Save.storage(), raw = st && st.getItem(GP.Config.SAVE_KEY);
  var oldPush = GP.Cloud.schedulePush, oldAsk = GP.Cloud.shouldAsk, oldState = GP.Weather.state, oldSim = GP.Weather.simIndex, oldScore = GP.Cloud.scoreboard;
  var oldDevice = GP.Prompts.device, oldProfile = GP.Prompts.profile, oldLang = GP.I18n.lang, oldNow = Date.now;
  var oldKeys = GP.Settings.keys;
  var oldJust = GP.Progression.justCompleted;
  var oldPads = Object.getOwnPropertyDescriptor(navigator, 'getGamepads');
  var neutralPad = { connected: true, id: 'QA standard', mapping: 'standard', axes: [0, 0], buttons: Array.from({ length: 17 }, function () { return { pressed: false, value: 0 }; }) };
  Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: function () { return [neutralPad]; } });
  var running = game.loop.running, paused = game.isPaused, now = performance.now(), epoch = Date.now(), elapsed = 0;
  var frames = [], names = [], meta = { viewport: [innerWidth, innerHeight], game: [GP.Config.WIDTH, GP.Config.HEIGHT] };
  function step(n) { for (var i = 0; i < n; i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); } }
  function start(key, data) { game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); game.scene.start(key, data); step(2); return game.scene.getScene(key); }
  async function shot(name) {
    step(40);
    var im = await new Promise(function (resolve) { game.renderer.snapshot(resolve); step(1); });
    frames.push(im); names.push(name);
  }
  game.loop.sleep(); game.isPaused = false; Date.now = function () { return epoch + elapsed; };
  GP.Cloud.schedulePush = function () {}; GP.Cloud.shouldAsk = function () { return false; };
  GP.Cloud.scoreboard = function () { return Promise.resolve({ ok: true, rows: [], source: 'live', age: 0 }); };
  GP.Settings.keys = JSON.parse(JSON.stringify(GP.Settings.DEFAULT_KEYS));
  GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true; GP.Progression.justCompleted = null;
  GP.Weather.simIndex = -1; GP.Weather.nextSim(); GP.Prompts.use('keyboard'); GP.I18n.setLang('fr');
  try {
    if (extras) {
      start('Character'); await shot('AVATAR / CLAVIER');
      GP.Prompts.use('gamepad', 'standard'); await shot('AVATAR / MANETTE');
      GP.Prompts.use('keyboard'); var keys = start('Options'); keys.mode = 'keys'; keys.build(); await shot('COMMANDES / CLAVIER');
      start('Result', { index: 0, pixels: 32, total: 32, deaths: 0, time: 60 }); await shot('RÉSULTAT / CLAVIER');
      GP.Prompts.use('gamepad', 'standard'); await shot('RÉSULTAT / MANETTE');
      start('Score'); await Promise.resolve(); await shot('CLASSEMENT / MANETTE');
    } else {
    var menu = start('Menu'); menu.buildIntro(); await shot('INTRO / CLAVIER');
    var map = start('Map'); await shot('CARTE / CLAVIER');
    map.openPanel(0); await shot('CONTEXTE COMPACT'); map.closePanel();
    map.openHelp(1); await shot('LIVRE / CLAVIER');
    GP.Prompts.use('gamepad', 'standard'); await shot('LIVRE / MANETTE'); map.help.close();
    var options = start('Options'); options.mode = 'keys'; options.build(); await shot('COMMANDES / MANETTE');
    var g = start('Game', { index: 0 }); g.introMs = 0; GP.Prompts.use('keyboard'); step(160); await shot('HUD / CLAVIER');
    GP.Prompts.use('gamepad', 'standard'); g.pause(); await shot('PAUSE / MANETTE');
    }
    var W = GP.Config.WIDTH * 2, H = GP.Config.HEIGHT * 2 + 24, cv = document.createElement('canvas');
    cv.width = W * 2; cv.height = H * Math.ceil(frames.length / 2);
    var ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#14182e'; ctx.fillRect(0, 0, cv.width, cv.height);
    frames.forEach(function (im, i) {
      var x = i % 2 * W, y = Math.floor(i / 2) * H;
      ctx.fillStyle = '#f4f7f2'; ctx.font = '14px monospace'; ctx.fillText(names[i] + ' — ' + innerWidth + '×' + innerHeight, x + 8, y + 17);
      ctx.drawImage(im, x, y + 24, W, H - 24);
    });
    var link = document.createElement('a'); link.download = 'polish-' + innerWidth + 'x' + innerHeight + (extras ? '-extras' : '') + '.png'; link.href = cv.toDataURL(); link.click();
    return meta;
  } finally {
    game.scene.getScenes(true).forEach(function (s) { game.scene.stop(s.scene.key); }); step(1);
    if (oldPads) Object.defineProperty(navigator, 'getGamepads', oldPads); else delete navigator.getGamepads;
    GP.Progression.data = oldData; GP.Progression.justCompleted = oldJust; GP.Save._mem = oldMem; GP.Cloud.schedulePush = oldPush; GP.Cloud.shouldAsk = oldAsk; GP.Cloud.scoreboard = oldScore;
    GP.Weather.state = oldState; GP.Weather.simIndex = oldSim; GP.Settings.keys = oldKeys; GP.I18n.setLang(oldLang); GP.Prompts.use(oldDevice, oldProfile);
    if (st) { if (raw === null) st.removeItem(GP.Config.SAVE_KEY); else st.setItem(GP.Config.SAVE_KEY, raw); }
    start('Menu'); Date.now = oldNow; game.isPaused = paused; if (running) game.loop.wake();
  }
};

/** Tous les raccords inclinés, lus dans les textures réellement dessinées au boot. */
GP.captureSlopeSheet = function () {
  var M = GP.MapArt, rows = [];
  M.columns.forEach(function (c, i) { if (c.kind === 'up' || c.kind === 'down') rows.push({ kind: c.kind, x: i * 16 }); });
  var cellW = 288, cellH = 324, canvas = document.createElement('canvas');
  canvas.width = cellW * 3; canvas.height = cellH * Math.ceil(rows.length / 3);
  var ctx = canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#14182e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  rows.forEach(function (row, n) {
    var x = n % 3 * cellW, y = Math.floor(n / 3) * cellH;
    ctx.fillStyle = '#f4f7f2'; ctx.font = '12px monospace'; ctx.fillText(row.kind + ' / x=' + row.x, x + 8, y + 16);
    ctx.save(); ctx.beginPath(); ctx.rect(x, y + 24, cellW, 300); ctx.clip();
    M.worldKeys.forEach(function (key, k) {
      var source = GP.game.textures.get(key).getSourceImage();
      ctx.drawImage(source, x + (k * GP.LevelArt.CHUNK - row.x + 32) * 3, y + 24 - 140 * 3, source.width * 3, source.height * 3);
    });
    ctx.restore();
  });
  var link = document.createElement('a'); link.download = 'polish-pentes.png'; link.href = canvas.toDataURL(); link.click();
  return rows;
};
