'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ROOT = path.join(__dirname, '..');

function context() {
  const data = new Map(), timeouts = new Map(); let seq = 0;
  const c = { console, URL, Uint8Array, Promise, Date, Math, Number, JSON,
    navigator: { language: 'fr', getGamepads: () => [] }, document: { documentElement: {} },
    location: { search: '', protocol: 'http:' },
    localStorage: { getItem: k => data.get(k) || null, setItem: (k, v) => data.set(k, v), removeItem: k => data.delete(k) },
    setTimeout: fn => { timeouts.set(++seq, fn); return seq; }, clearTimeout: id => timeouts.delete(id),
    setInterval: () => 1, addEventListener() {}, matchMedia: () => ({ matches: false }),
    crypto: { getRandomValues: b => b.fill(7) } };
  c.window = c; c.GP = {}; c.data = data; c.timeouts = timeouts;
  vm.createContext(c);
  c.load = file => vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), c, { filename: file });
  ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/systems/CharacterSprite.js', 'js/data/locations.js',
    'js/data/levels.js', 'js/systems/SaveManager.js', 'js/systems/Stars.js', 'js/systems/ProgressionManager.js',
    'js/systems/WeatherManager.js', 'js/systems/WeatherRules.js', 'js/systems/Cloud.js'].forEach(c.load);
  return c;
}
const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };

test('Sauvegardes : clés héritées et nombres non finis ne cassent pas le chargement', () => {
  const c = context(), G = c.GP;
  const save = G.Save.sanitize(JSON.parse('{"completed":{"toString":{},"__proto__":{},"jardin-des-plantes":{"pixels":"Infinity","rate":1,"time":"Infinity","deaths":"Infinity"}},"current":"Infinity"}'));
  assert.equal(Object.keys(save.completed).length, 1);
  assert.equal(save.completed['jardin-des-plantes'].pixels, 0);
  assert.equal(save.completed['jardin-des-plantes'].time, null);
  assert.equal(save.current, 0);
});
test('Sauvegardes : anciennes données conservées et JSON corrompu mis de côté', () => {
  const c = context(), G = c.GP;
  const save = G.Save.sanitize({ completed: { 'jardin-des-plantes': { pixels: 32, rate: 1 } }, current: 1 });
  assert.equal(save.completed['jardin-des-plantes'].stars, 1);
  assert.equal(save.unlocked, 1);
  c.data.set(G.Config.SAVE_KEY, '{broken');
  assert.equal(G.Save.load().unlocked, 0);
  assert.equal(c.data.get(G.Config.SAVE_KEY + '.corrupt'), '{broken');
});
test('Sauvegardes : repli mémoire après quota dépassé, sans relire un ancien état', () => {
  const c = context(), G = c.GP;
  G.Save.storage(); c.data.set(G.Config.SAVE_KEY, JSON.stringify(G.Save.defaults()));
  c.localStorage.setItem = () => { throw Error('quota'); };
  const d = G.Save.defaults(); d.current = 2;
  assert.equal(G.Save.save(d), false); assert.equal(G.Save.load().current, 2);
});
test('Reprise : indices dédupliqués, checkpoint borné, définition de niveau identique requise', () => {
  const c = context(), G = c.GP, L = G.LEVELS['jardin-des-plantes'];
  const d = { runs: { 'jardin-des-plantes': { signature: G.Save.runSignature(L), taken: [0, 0, -1, 999, 1], checkpoint: 100, time: 600, deaths: 2 } } };
  const r = G.Save.sanitize(d).runs['jardin-des-plantes'];
  assert.deepEqual(Array.from(r.taken), [0, 1]); assert.equal(r.checkpoint, L.checks.length - 1);
  d.runs['jardin-des-plantes'].signature = 'changed'; assert.equal(Object.keys(G.Save.sanitize(d).runs).length, 0);
});
test('Progression : déblocage, records par critère, fin de reprise et étoiles cohérentes', () => {
  const G = context().GP; G.Progression.init();
  G.Progression.data.runs['jardin-des-plantes'] = {};
  G.Progression.complete(0, 32, 1, 2, 120, 0);
  G.Progression.complete(0, 32, 1, 2, 60, 2);
  assert.equal(G.Progression.data.unlocked, 1);
  assert.equal(G.Progression.data.completed['jardin-des-plantes'].stars, 3);
  assert.equal(G.Progression.data.completed['jardin-des-plantes'].deaths, 0);
  assert.equal(G.Progression.data.runs['jardin-des-plantes'], undefined);
  assert.equal(G.Stars.compute({ rate: 0.9, deaths: 0, time: 1 }, G.LOCATIONS[0]), 0);
});
test('Météo : JSON incomplet / null / chaînes / cache corrompu → secours neutre', async () => {
  for (const current of [null, {}, { temperature_2m: null }, { temperature_2m: 12, weather_code: '63' }]) {
    const c = context(), G = c.GP;
    c.data.set(G.Config.WEATHER.cacheKey, JSON.stringify({ time: Date.now(), wind: 'Infinity' }));
    c.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ current }) });
    let result; G.Weather.refresh(s => { result = s; }); await flush();
    assert.equal(result.source, 'fallback'); assert.equal(G.WeatherRules.env(result).neutral, true);
  }
});
test('Météo : normalisation, requête unique, cache périmé signalé, erreurs HTTP et réseau', async () => {
  const c = context(), G = c.GP; let count = 0;
  c.fetch = () => { count++; return Promise.resolve({ ok: true, json: () => Promise.resolve({ current: {
    temperature_2m: 100, weather_code: 63, is_day: 1, wind_speed_10m: 900, wind_direction_10m: -90, precipitation: 900, cloud_cover: 900
  } }) }); };
  const results = []; G.Weather.refresh(s => results.push(s)); G.Weather.refresh(s => results.push(s)); await flush();
  assert.equal(count, 1); assert.equal(results.length, 2); assert.equal(results[0].wind, 80);
  assert.equal(results[0].temp, 60); assert.equal(results[0].windDir, 270); assert.equal(results[0].precip, 10);
  for (const fetch of [() => Promise.reject(Error('offline')), () => Promise.resolve({ ok: false, status: 503 })]) {
    c.fetch = fetch; G.Weather.refresh(); await flush(); assert.equal(G.Weather.get().source, 'stale');
  }
});
test('Météo : réponse tardive ignorée après délai et cache non écrasé', async () => {
  const c = context(), G = c.GP; let resolve;
  c.fetch = () => new Promise(r => { resolve = r; });
  G.Weather.refresh(); Array.from(c.timeouts.values()).forEach(fn => fn());
  resolve({ ok: true, json: () => Promise.resolve({ current: { temperature_2m: 15, weather_code: 0, is_day: 1, wind_speed_10m: 0, wind_direction_10m: 0, precipitation: 0, cloud_cover: 0 } }) });
  await flush(); assert.equal(G.Weather.get().source, 'fallback'); assert.equal(c.data.has(G.Config.WEATHER.cacheKey), false);
});
test('Mapping : soleil, pluie, neige, brume, nuit et vent restent opérants et bornés', () => {
  const G = context().GP, base = { accelGround: 1100, accelAir: 700 };
  G.Weather.SIMS.forEach(() => {
    const s = G.Weather.nextSim(), e = G.WeatherRules.env(s), p = G.WeatherRules.physics(e, base);
    assert.ok(Number.isFinite(p.airPush) && Math.abs(p.airPush) <= 110); assert.ok(p.accelGround >= 430);
    if (e.rain || e.snow) assert.ok(p.accelGround < base.accelGround);
    if (e.fog || e.night) assert.ok(p.sight > 0);
  });
});
test('Cloud : enveloppes invalides sans exception, pseudos et lignes de classement filtrés', async () => {
  const c = context(), G = c.GP; G.Progression.init();
  c.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve(null) });
  assert.equal((await G.Cloud.restore('Joueur', 'A'.repeat(20))).ok, false);
  assert.equal((await G.Cloud.register('<script>')).error, 'pseudo_invalid');
  c.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([{ pseudo: {}, rank: 1 }, { pseudo: '<img>', rank: 2 },
    { pseudo: 'Joueur', rank: 1, total_stars: 3, levels: 1, total_time_ms: 9000 }]) });
  const r = await G.Cloud.scoreboard(); assert.equal(r.rows.length, 1); assert.equal(r.rows[0].pseudo, 'Joueur');
});
test('Cloud : une suppression refusée ne déconnecte pas ; une ancienne synchro ne valide pas de nouvelles données', async () => {
  const c = context(), G = c.GP; G.Progression.init();
  c.data.set('greenpath.cloud', JSON.stringify({ pseudo: 'Joueur', code: 'A'.repeat(20), choice: 'account' })); G.Cloud.init();
  c.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: false, error: 'server' }) });
  assert.equal((await G.Cloud.deleteAccount()).ok, false); assert.equal(G.Cloud.isAccount, true);
  let release; c.fetch = () => new Promise(r => { release = r; });
  const push = G.Cloud.push(); G.Cloud.schedulePush();
  release({ ok: true, json: () => Promise.resolve({ ok: true }) }); await push;
  assert.equal(JSON.parse(c.data.get('greenpath.cloud')).dirty, true);
});
test('Import : aucun code exécuté ; traversée de chemin, dimensions et expressions rejetées', () => {
  const input = require('../tools/lib/sprite-input');
  assert.equal(input.palette("const PAL = { k:'#14182e', w: '#f4f7f2', };").k, '#14182e');
  assert.throws(() => input.palette("PAL = { k: (() => { throw 'executed'; })() };"), /littérales/);
  assert.throws(() => input.sheet({ sheet: '../config', sprites: [] }), /planche/);
  assert.throws(() => input.sheet({ sheet: 'valid', sprites: [{ id: 'x', w: 1e9, h: 2 }] }), /Sprite/);
  assert.throws(() => input.sheet({ sheet: 'valid', sprites: [{ w: 1, h: 2 }] }), /Sprite/);
});
test('Assets : scripts syntaxiquement valides, liens locaux présents, 447 sprites et photo 48×32/16 valides', () => {
  const c = context();
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
  walk(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).forEach(f => new vm.Script(fs.readFileSync(f, 'utf8'), { filename: f }));
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) assert.ok(fs.existsSync(path.join(ROOT, m[1])), m[1]);
  fs.readdirSync(path.join(ROOT, 'js/data/sprites')).forEach(f => c.load('js/data/sprites/' + f));
  const sprites = Object.values(c.GP.SPRITES).flat(); assert.equal(sprites.length, 447);
  sprites.forEach(s => (s.frames_rows || [s.rows]).forEach(rows => {
    assert.equal(rows.length, s.h, s.id); rows.forEach(row => {
      assert.equal(row.length, s.w, s.id); for (const ch of row) assert.ok(ch === '.' || c.GP.SPRITE_PAL[ch], s.id + ':' + ch);
    });
  }));
  c.load('assets/locations/jardin-des-plantes.js'); const im = c.GP.IMAGES['jardin-des-plantes'];
  assert.equal(im.w, 48); assert.equal(im.h, 32); assert.equal(im.palette.length, 16); assert.equal(im.data.length, 1536);
  for (const ch of im.data) assert.ok(im.palette[parseInt(ch, 16)]);
});
test('Reconstruction : ordre fortification déterministe sans perte de cases', () => {
  const c = context(); c.load('js/systems/PixelCollection.js');
  const cells = [{ x: 0, y: 0 }, { x: 5, y: 2 }, { x: 1, y: 9 }]; cells.w = cells.h = 10;
  c.GP.PixelCollection.sortCells(cells, 'fortification');
  assert.equal(cells[0].y, 9); assert.equal(cells[1].x, 5); assert.equal(cells[2].x, 0);
});
test('Parcours : 12 lieux, 3 accessibles, 4 définitions ; aucun pixel dans une tuile pleine', () => {
  const G = context().GP;
  assert.equal(G.LOCATIONS.length, 12); assert.equal(G.LOCATIONS.filter(l => l.playable).length, 3); assert.equal(Object.keys(G.LEVELS).length, 4);
  Object.values(G.LEVELS).forEach(L => {
    assert.equal(L.grid.length, L.rows * L.width);
    L.pixels.forEach(p => { const tile = L.grid[p.y * L.width + p.x]; assert.ok(!tile || tile === 3, L.id + ':' + p.x + ',' + p.y); });
  });
});
test('Manette : une validation, capture bloquée et nouvel appui après déconnexion', () => {
  const c = context(); let pad = null, tick; const events = [];
  c.navigator.getGamepads = () => pad ? [pad] : [];
  c.GP.game = { scene: { getScenes: () => [{ input: { keyboard: { emit: e => events.push(e) } } }] } };
  c.load('js/systems/Controls.js'); c.GP.Pad.start({ events: { on: (e, fn) => { tick = fn; } } });
  pad = { connected: true, axes: [0, 0], buttons: [{ pressed: true }] }; tick(0);
  assert.deepEqual(events, ['keydown-ENTER']);
  c.GP.Pad.capture = true; tick(16); assert.equal(c.GP.Pad.state.jump, false);
  pad = null; tick(32); c.GP.Pad.capture = false;
  pad = { connected: true, axes: [0, 0], buttons: [{ pressed: true }] }; tick(48);
  assert.equal(events.length, 2);
});
test('CSP : pas de script distant ni eval applicatif ; service worker syntaxiquement valide', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(html.includes("script-src 'self'")); assert.ok(!html.includes('unsafe-eval'));
  new vm.Script(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8'));
  const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  assert.ok(config.headers[0].headers.some(h => h.key === 'Content-Security-Policy' && h.value.includes("frame-ancestors 'none'")));
});
