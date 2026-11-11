/** Automatisation Chromium optionnelle (Playwright installé séparément, sans dépendance de jeu).
 * Serveur local requis : python3 -m http.server 8130 --bind 127.0.0.1
 * PLAYWRIGHT_MODULE=/chemin/node_modules/playwright node tools/run-chateau-qa.cjs
 * N'écrit aucun résultat cloud. Parcours scriptés distincts des tests de composants téléportés.
 */
'use strict';
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.GREENPATH_QA_URL || 'http://127.0.0.1:8130';
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)) throw new Error('Origine locale dédiée uniquement');
const output = path.join(__dirname, '..', 'docs', 'screenshots');
async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const result = { kind: 'automated-browser', formats: [], routes: [], errors: [], consoleErrors: [], missingAssets: [], cloudWrites: [] };
  try {
    for (const [width, height] of [[1920, 1080], [1366, 768], [844, 390]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.route('https://api.open-meteo.com/**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({
        current: { temperature_2m: 14, weather_code: 2, is_day: 1, wind_speed_10m: 8, wind_direction_10m: 250, precipitation: 0, cloud_cover: 40 }
      }) }));
      await context.route('**/rest/v1/**', route => {
        if (route.request().method() !== 'GET') result.cloudWrites.push(route.request().url());
        return route.abort();
      });
      const page = await context.newPage();
      page.on('pageerror', e => result.errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') result.consoleErrors.push(m.text()); });
      page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.missingAssets.push(r.url() + ' ' + r.status()); });
      await page.goto(base + '/?dev=1');
      await page.waitForFunction(() => window.GP?.game?.scene?.isActive('Menu'));
      for (const file of ['playtest', 'regression-tests', 'polish-tests', 'browser-tests', 'chateau-tests', 'bot', 'geometry-tests']) {
        await page.addScriptTag({ url: base + '/tools/' + file + '.js' });
      }
      const format = { width, height, suites: {} };
      for (const [label, fn] of [['socle', 'runBrowserTests'], ['regression', 'runRegressionTests'], ['polish', 'runPolishTests'], ['chateau', 'runChateauTests']]) {
        const checks = await page.evaluate(fn => GP[fn](), fn);
        format.suites[label] = { passed: checks.filter(c => c.ok).length, total: checks.filter(c => c.name).length,
          failed: checks.filter(c => c.name && !c.ok) };
      }
      if (width === 1920) {
        for (const sim of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]) {
          result.routes.push(await page.evaluate(sim => GP.runChateauRoute(sim), sim));
        }
        result.routes.push(await page.evaluate(() => GP.runChateauRoute(4, true)));
        result.routes.push(await page.evaluate(() => GP.runChateauRoute(0, false, true)));
        format.geometry = [];
        for (const index of [0, 1, 2]) for (const sim of [2, 4, 6]) {
          format.geometry.push(await page.evaluate(([i, s]) => GP.runGeometryTest(i, s), [index, sim]));
        }
      }

      // Planches de composition : positions imposées, physique arrêtée. Aucune preuve de parcours humain.
      const sheet = await page.evaluate(() => {
        const game = GP.game; game.loop.sleep(); GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true;
        GP.Cloud.schedulePush = function () {}; GP.Weather.simIndex = -1; GP.Weather.nextSim();
        game.scene.getScenes(true).forEach(s => game.scene.stop(s.scene.key)); game.scene.start('Game', { index: 2 });
        let now = performance.now(); const tick = n => { for (let i = 0; i < n; i++) game.step(now += 1000 / 60, 1000 / 60); };
        tick(2); const g = game.scene.getScene('Game'); g.introMs = 0;
        g.updateMechanics(0);
        g.introCard.objects.forEach(o => { game.scene.getScene('Game').tweens.killTweensOf(o); o.destroy(); });
        g.physics.pause(); g.paused = true; g.cameras.main.stopFollow();
        const W = game.canvas.width, H = game.canvas.height, margin = 20;
        const cv = document.createElement('canvas'); cv.width = W * 2; cv.height = (H + margin) * 4;
        const ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false; ctx.fillStyle = '#14182e'; ctx.fillRect(0, 0, cv.width, cv.height);
        const views = [[8,15,0,'DOUVES / SOLEIL'], [48,15,2,'CHÂTELET / PLUIE'], [84,12,2,'ÉCHAFAUDAGES / PLUIE'],
          [121,9,4,'CHEMIN DE RONDE / VENT'], [159,13,0,'COUR / ARCHE FERMÉE'], [42,15,6,'PASSAGE COUVERT / NEIGE'],
          [121,9,8,'REMPART / ORAGE'], [159,13,1,'COUR / NUIT']];
        views.forEach(([col, floor, sim, title], i) => {
          g.player.body.reset(col * 16 + 8, floor * 16); GP.Weather.simIndex = sim - 1; g.applyWeather(GP.Weather.nextSim(), true); g.updateShelter(0, true);
          g.cameras.main.centerOn(col * 16 + 65, floor * 16 - 80); g.sky.update(g.cameras.main, 16); g.updateExit(); tick(65);
          const x = (i % 2) * W, y = Math.floor(i / 2) * (H + margin);
          ctx.fillStyle = '#f4f7f2'; ctx.font = '10px monospace'; ctx.fillText(title, x + 8, y + 13);
          ctx.drawImage(game.canvas, x, y + margin);
        });
        return cv.toDataURL('image/png').split(',')[1];
      });
      fs.mkdirSync(output, { recursive: true });
      fs.writeFileSync(path.join(output, `chateau-${width}x${height}.png`), Buffer.from(sheet, 'base64'));
      // Banc direct : événements clavier de navigateur (pas du matériel physique) et isolation du compte.
      // Quitter l'application AVANT d'installer les données témoins : son pagehide sauvegarde normalement la partie.
      await page.goto(base + '/data/fallback.json');
      const personal = await page.evaluate(() => {
        const save = JSON.stringify({ v: 1, completed: { 'jardin-des-plantes': { rate: 1, stars: 2, pixels: 32 } }, current: 1, unlocked: 1 });
        const cloud = JSON.stringify({ pseudo: 'QA_FIXTURE', code: 'A'.repeat(20), choice: 'account', dirty: true });
        localStorage.setItem('greenpath.save', save); localStorage.setItem('greenpath.cloud', cloud);
        return { save, cloud };
      });
      await page.goto(base + '/?dev=1&level=chateau');
      await page.waitForFunction(() => window.GP?.game?.scene?.isActive('Game') && GP.game.scene.getScene('Game').introMs <= 0);
      format.preview = await page.evaluate(() => ({ isolated: GP.Config.SAVE_KEY === 'greenpath.dev.chateau',
        noAccountLoaded: !GP.Cloud.enabled && !GP.Cloud.isAccount }));
      const from = await page.evaluate(() => GP.game.scene.getScene('Game').player.x);
      await page.keyboard.down('ArrowRight'); await page.waitForTimeout(400); await page.keyboard.up('ArrowRight');
      format.preview.keyboardMove = await page.evaluate(x => GP.game.scene.getScene('Game').player.x > x + 12, from);
      await page.keyboard.down('Space'); await page.waitForTimeout(150);
      format.preview.keyboardJump = await page.evaluate(() => GP.game.scene.getScene('Game').player.y < 230);
      await page.keyboard.up('Space');
      async function press(key) {
        // Appui et relâchement sur des frames distinctes, comme un appui humain, sans prétendre au matériel réel.
        await page.keyboard.press(key, { delay: 80 });
        // Laisser aussi à l'entrée Phaser le temps de consommer keyup avant le prochain appui.
        await page.waitForTimeout(100);
      }
      format.previewWeather = { before: await page.evaluate(() => GP.Weather.simIndex), sequence: [] };
      for (let i = 0; i < 8; i++) {
        const old = await page.evaluate(() => GP.Weather.simIndex);
        await press('n');
        await page.waitForFunction(old => GP.Weather.simIndex !== old, old, { timeout: 5000 });
        format.previewWeather.sequence.push(await page.evaluate(() => GP.Weather.simIndex));
      }
      format.preview.stormSelectable = await page.evaluate(() => GP.Weather.get().cat === 'storm');
      await press('v');
      format.preview.reverseWind = await page.evaluate(() => GP.game.scene.getScene('Game').env.windSign === -1);
      await press('k');
      format.preview.collectionNeedsExit = await page.evaluate(() => { const g = GP.game.scene.getScene('Game'); return g.pc.done() && !g.finished; });
      await press('r');
      await page.waitForFunction(() => GP.game.scene.isActive('Game') && GP.game.scene.getScene('Game').pc.count === 0);
      format.preview.restart = true;
      await press('k');
      await page.evaluate(() => { const g = GP.game.scene.getScene('Game'); g.player.body.reset(g.L.exit.x * 16 + 8, g.L.exit.y * 16); g.checkWorld(); });
      await page.waitForFunction(() => GP.game.scene.isActive('Result'));
      format.preview.personalDataUntouched = await page.evaluate(saved => localStorage.getItem('greenpath.save') === saved.save &&
        localStorage.getItem('greenpath.cloud') === saved.cloud, personal);
      result.formats.push(format);
      await context.close();
    }
  } finally { await browser.close(); }
  const report = path.join(__dirname, '..', 'docs', 'chateau-qa.json');
  fs.writeFileSync(report, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length || result.consoleErrors.length || result.missingAssets.length || result.cloudWrites.length ||
    result.routes.some(r => r.returnTrip ? !r.returnedToStart : !r.finished) ||
    result.formats.some(f => Object.values(f.suites).some(s => s.failed.length) || Object.values(f.preview).some(v => !v) ||
      (f.geometry || []).some(g => g.unreachable.length))) process.exitCode = 1;
}
main().catch(e => { console.error(e); process.exitCode = 1; });
