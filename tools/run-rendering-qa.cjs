/** Recette du rendu réel : pixels, propriété des images et synchronisation avec les corps.
 * Les positions de capture sont imposées ; ce n'est pas une traversée humaine.
 */
'use strict';
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const base = 'http://127.0.0.1:8130';
const ids = ['jardin-des-plantes','cathedrale','chateau','feydeau','graslin','machines','chantiers','buren','hangar','pommeraye','memorial','tour-lu'];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { kind: 'render-and-binding-regression', formats: [], errors: [], consoleErrors: [], missing: [], cloudWrites: [] };
  try {
    for (const [width, height] of [[1920,1080], [1366,768], [844,390]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.route('**/rest/v1/**', r => { report.cloudWrites.push(r.request().method()); return r.abort(); });
      await context.route('https://api.open-meteo.com/**', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ current: {
        temperature_2m: 20, weather_code: 0, is_day: 1, wind_speed_10m: 5, wind_direction_10m: 90, precipitation: 0, cloud_cover: 0
      } }) }));
      const page = await context.newPage();
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
      page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) report.missing.push(r.url()); });
      await page.goto(base + '/?dev=1');
      await page.waitForFunction(() => window.GP?.game?.scene.isActive('Menu'));
      for (const file of ['playtest','regression-tests','polish-tests','browser-tests']) await page.addScriptTag({ url: base + '/tools/' + file + '.js' });
      const format = { width, height, suites: {}, levels: [] };
      for (const [name, fn] of [['regression','runRegressionTests'], ['polish','runPolishTests'], ['flow','runBrowserTests']]) {
        const checks = await page.evaluate(fn => GP[fn](), fn);
        format.suites[name] = { passed: checks.filter(c => c.ok).length, total: checks.filter(c => c.name).length, failed: checks.filter(c => c.name && !c.ok) };
      }
      for (const id of ids) {
        await page.goto(base + '/?dev=1&level=' + id);
        await page.waitForFunction(() => window.GP?.game?.scene.getScene('Game')?.player);
        format.levels.push(await page.evaluate(() => {
          const game = GP.game, g = game.scene.getScene('Game'), checks = [];
          game.loop.sleep(); let now = performance.now(), elapsed = 0;
          const originalNow = Date.now, epoch = originalNow(); Date.now = () => epoch + elapsed;
          const tick = n => { for (let i = 0; i < n; i++) { elapsed += 1000 / 60; game.step(now + elapsed, 1000 / 60); } };
          const check = (name, ok) => checks.push({ name, ok: !!ok });
          try {
            g.introMs = 0; g.invuln = 1e9;
            const terrain = g.children.list.filter(o => o.texture && /^lv_terrain_/.test(o.texture.key));
            check('single-active-terrain', terrain.length === Math.ceil(g.W / GP.LevelArt.CHUNK));
            check('texture-chunks', terrain.every(o => o.texture.getSourceImage().width <= 2048));
            if (g.gz) {
              check('material-renderer-active', g.terrainArt.renderer === 'gz-materials');
              check('no-placeholder-platforms', g.gz.surfaces.every(s => !s.placeholder && (s.img || s.visuals.length)));
              check('no-anonymous-id-match', g.gz.surfaces.every(s => s.def.visuals.every(v => v.id || v.surfaceId)));
              const anonymous = g.gzPlan.visuals.filter(v => !v.id && !v.surfaceId && v.rendered).map(v => ({ img: v.rendered, x: v.rendered.x, y: v.rendered.y }));
              tick(90);
              check('unowned-decor-stationary', anonymous.every(v => v.img.x === v.x && v.img.y === v.y));
              check('images-follow-their-body', g.gz.surfaces.every(s => (!s.img || Math.abs(s.img.x - s.body.x - s.imageOffsetX) < 0.01) &&
                s.visuals.every(v => Math.abs(v.img.x - s.body.x - v.dx) < 0.01 && Math.abs(v.img.y - s.body.y - v.dy) < 0.01)));
              check('all-visible-bodies-covered', g.gz.surfaces.every(s => {
                const images = (s.img ? [s.img] : []).concat(s.visuals.map(v => v.img));
                const boxes = images.map(img => img.getBounds());
                return Math.min(...boxes.map(b => b.x)) <= s.body.x + 1 && Math.max(...boxes.map(b => b.right)) >= s.body.right - 1;
              }));
              if (g.loc.id === 'cathedrale') check('three-visible-galleries', g.gz.surfaces.filter(s => s.def.type === 'galerie').every(s => s.img && s.img.displayWidth === s.w && s.def.visuals.length === 0));
              if (g.loc.id === 'feydeau') {
                const boat = g.gz.surfaces.find(s => s.def.id === 'gabare1');
                check('two-native-boat-pieces', boat.visuals.length === 2 && !boat.img);
                const x = boat.visuals[0].img.x, y = boat.visuals[0].img.y;
                g.player.body.reset(boat.body.x + boat.w / 2, boat.body.y - 1); tick(20);
                check('boat-follows-sinking', boat.visuals[0].img.x === x && boat.visuals[0].img.y > y && Math.abs(boat.visuals[0].img.y - boat.body.y - boat.visuals[0].dy) < 0.01);
              }
              if (g.loc.id === 'pommeraye') check('chandeliers-native-width', g.gz.surfaces.filter(s => /^lustre\d$/.test(s.def.id || '')).every(s => s.w === GP.Sprites.info('pommeraye_lustre').w && s.visuals.length === 1 && !!s.cable));
              if (g.loc.id === 'chantiers') {
                for (const id of ['p16','p18','p41','p42']) {
                  const m = g.terrainArt.masses.find(m => m.id === id), [x,y,w,h] = m.rect;
                  const px = Math.floor(x + w / 2), py = Math.floor(y + Math.min(h - 4, 40)), chunk = Math.floor(px / 2048);
                  const rgba = g.textures.get('lv_terrain_' + chunk).getSourceImage().getContext('2d').getImageData(px % 2048, py, 1, 1).data;
                  const color = '#' + Array.from(rgba.slice(0,3)).map(v => v.toString(16).padStart(2,'0')).join('');
                  check('metal-pixels-' + id, m.material === 'metal' && [GP.PAL.k,GP.PAL.d,GP.PAL.e,GP.PAL.m].includes(color));
                }
                check('natural-park-kept', ['p1','p2','p3','p43'].every(id => g.terrainArt.masses.find(m => m.id === id).material === 'natural'));
              }
              if (g.loc.id === 'jardin-des-plantes') {
                check('park-backdrop-connected', g.L.sky.farKey === 'lv_fond_parc');
                check('new-garden-art-connected', ['lv_sil_orange','lv_sil_jaune','lv_sil_ruban','lv_massif_rouge','lv_hortensia','lv_herbes_hautes'].every(key => g.children.list.some(o => o.texture && o.texture.key === key)));
                const m = g.terrainArt.masses.find(m => m.id === 'p19'), [x,y] = m.rect;
                const actual = g.textures.get('lv_terrain_0').getSourceImage().getContext('2d').getImageData(x,y,16,16).data;
                const expected = g.textures.get('commun_herbe_haut_gauche').getSourceImage().getContext('2d').getImageData(0,0,16,16).data;
                check('real-native-corner-pixels', Array.from(actual).every((v,i) => v === expected[i]));
              }
            } else {
              check('castle-backdrop-connected', g.L.sky.farKey === 'lv_fond_chateau');
              check('two-clipped-rooms', g.children.list.filter(o => o.getData && /^lv_salle_/.test(o.getData('sourceArt') || '')).length === 2);
            }
          } finally { Date.now = originalNow; }
          return { id: g.loc.id, checks };
        }));
      }
      // Vues de contrôle, pas un playtest : position/horloge imposées pour comparer les rendus.
      const png = await page.evaluate(() => {
        const game = GP.game; game.loop.sleep(); GP.Progression.data = GP.Save.defaults(); GP.Progression.data.muted = true;
        GP.Weather.simIndex = -1; GP.Weather.nextSim(); let now = performance.now();
        const tick = n => { for (let i = 0; i < n; i++) game.step(now += 1000 / 60, 1000 / 60); };
        const W = GP.Config.WIDTH, cv = document.createElement('canvas'); cv.width = W * 3; cv.height = 294 * 2;
        const ctx = cv.getContext('2d'); ctx.fillStyle = '#14182e'; ctx.fillRect(0,0,cv.width,cv.height); ctx.imageSmoothingEnabled = false;
        const views = [[0,48,12,'JARDIN / CONTINUITE ET BORDURES'],[6,79,14,'CHANTIERS / SUPPORT LARGE'],[6,183,9,'CHANTIERS / OSSATURE'],[1,73,12,'CATHEDRALE / GALERIES'],[3,82,14,'FEYDEAU / FLOTTEURS'],[2,42,15,'CHATEAU / SALLE REUTILISEE']];
        views.forEach(([index,col,floor,title], i) => {
          game.scene.getScenes(true).forEach(s => game.scene.stop(s.scene.key)); game.scene.start('Game', { index }); tick(2);
          const g = game.scene.getScene('Game'); g.introMs = 0; g.invuln = 1e9; g.introCard.objects.forEach(o => { g.tweens.killTweensOf(o); o.destroy(); });
          g.paused = true; g.physics.pause(); g.cameras.main.stopFollow(); g.player.body.reset(col*16+8,floor*16); g.cameras.main.centerOn(col*16+55,floor*16-80);
          g.cameras.main.fadeEffect.reset(); g.wx.tint.setFillStyle(0xffffff); g.sky.update(g.cameras.main,16); if (g.gz) g.gz.update(0); tick(2);
          const x=i%3*W,y=Math.floor(i/3)*294; ctx.fillStyle='#f4f7f2'; ctx.font='11px monospace'; ctx.fillText(title,x+6,y+16); ctx.drawImage(game.canvas,x,y+24);
        });
        return cv.toDataURL('image/png').split(',')[1];
      });
      fs.writeFileSync(path.join(__dirname, '../docs/screenshots/render-fix-' + width + 'x' + height + '.png'), Buffer.from(png, 'base64'));
      report.formats.push(format); await context.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, '../docs/rendering-qa.json'), JSON.stringify(report,null,2) + '\n');
  const failed = report.formats.flatMap(f => f.levels.flatMap(l => l.checks.filter(c => !c.ok).map(c => ({ width:f.width, level:l.id, check:c.name }))));
  console.log(JSON.stringify({ formats: report.formats.map(f => ({width:f.width,passed:f.levels.reduce((n,l)=>n+l.checks.filter(c=>c.ok).length,0),total:f.levels.reduce((n,l)=>n+l.checks.length,0),suites:f.suites})),failed,errors:report.errors,consoleErrors:report.consoleErrors,missing:report.missing,cloudWrites:report.cloudWrites },null,2));
  if (failed.length || report.errors.length || report.consoleErrors.length || report.missing.length || report.cloudWrites.length || report.formats.some(f => Object.values(f.suites).some(s => s.failed.length))) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
