'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createHash } = require('node:crypto');
function harness(search = '', hostname = 'localhost') {
  const c = { console, location: { search, hostname }, document: {}, matchMedia: () => ({ matches: false }) };
  c.window = c; vm.createContext(c);
  for (const f of ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/data/locations.js', 'js/data/levels.js',
    'js/systems/SaveManager.js', 'js/systems/WeatherRules.js', 'js/systems/WeatherShelters.js', 'js/systems/LevelMechanics.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), c, { filename: f });
  }
  return c.GP;
}
test('Château : autres définitions strictement identiques au socle e57f7a7', () => {
  const G = harness(), expected = {
    'jardin-des-plantes': '17e9109ecc7e24919d091d894c244d37c749df532bd3a5879982315932f78072',
    cathedrale: '36d1491733425982831f74871e8ce309e30eee098c734a050bc3614784482556',
    bouffay: 'd926820aed17a00f7d1333a26e64bce28a2fe0f9696dcd1c55bbd58745857d86'
  };
  for (const [id, hash] of Object.entries(expected)) assert.equal(createHash('sha256').update(JSON.stringify(G.LEVELS[id])).digest('hex'), hash);
});
test('Constructeur : hauteur optionnelle, sols et trous suivent le nombre de lignes', () => {
  const G = harness();
  const L = G.LevelBuilder.create(10, b => { b.ground(0, 3, 5); b.start(1); }, 20);
  assert.equal(L.grid.length, 200); assert.equal(L.top(1), 15); assert.equal(L.top(6), 20); assert.equal(L.startRow, 14);
  assert.equal(G.LevelBuilder.create(4, () => {}).rows, 17);
});
test('Château : cinq zones, vingt fragments, trois lanternes et deux ponts, sans danger dans la fosse-école', () => {
  const L = harness().LEVELS.chateau;
  assert.equal(L.width, 170); assert.equal(L.rows, 20); assert.equal(L.zones.length, 5);
  assert.equal(L.pixels.length, 20); assert.equal(L.checks.length, 3); assert.equal(L.bridges.length, 2);
  assert.ok(L.water.every(w => w.x >= 22)); assert.equal(L.top(12), 17); assert.equal(L.top(14), 16);
  assert.equal(L.exit.x, 167); assert.equal(L.exit.y, L.top(L.exit.x));
  assert.ok(L.pixels.every(p => p.x >= 0 && p.x < L.width && p.y >= 0 && p.y < L.rows));
});
test('Pont : préavis, rotation non praticable et maintien sous les pieds', () => {
  const M = harness().LevelMechanics, b = { open: 3000, closed: 2000, warning: 500 };
  assert.equal(M.bridge(b, 2550, false), true); assert.equal(b.warned, true);
  assert.equal(M.bridge(b, 450, true), true); assert.equal(b.clock, 0); assert.equal(b.angle, 0);
  M.bridge(b, 3000, false); assert.equal(b.lowered, false); assert.equal(b.angle, -90);
  assert.equal(M.bridge(b, 1900, false), false);
  assert.equal(M.bridge(b, 100, false), false); assert.ok(b.angle > -90 && b.angle < 0);
  assert.equal(M.bridge(b, 350, false), true); assert.equal(b.angle, 0);
});
test('Arche : collecte complète ET présence requises, flux ancien conservé sans arche', () => {
  const G = harness(), M = G.LevelMechanics;
  for (const complete of [false, true]) for (const atExit of [false, true]) {
    assert.equal(M.canFinish(G.LEVELS.chateau, complete, atExit), complete && atExit);
    assert.equal(M.canFinish(G.LEVELS.cathedrale, complete, atExit), complete);
  }
});
test('Château : chaque abri possède un linteau solide et un sol, pas de protection sur le rempart', () => {
  const G = harness(), L = G.LEVELS.chateau;
  for (const z of L.shelters) {
    for (let x = z.x / 16; x < (z.x + z.w) / 16; x++) {
      assert.equal(L.grid[(z.y / 16 - 1) * L.width + x], 2);
      assert.equal(L.grid[15 * L.width + x], 1);
    }
    const cover = G.WeatherShelters.at(L.shelters, z.x + 8, 232);
    const phy = G.WeatherRules.physics({ rain: true, wind: 80, windSign: -1 }, G.Tuning.player, cover);
    assert.equal(phy.accelGround, 1100); assert.equal(phy.airPush, -55);
  }
  assert.equal(G.WeatherShelters.at(L.shelters, 110 * 16, 140).rain, 0);
});
test('Reprise : révision du Château ciblée, formats et signatures des autres lieux préservés', () => {
  const G = harness(), L = G.LEVELS.chateau;
  const old = Object.assign({}, L); delete old.revision;
  assert.notEqual(G.Save.runSignature(old), G.Save.runSignature(L));
  assert.equal(G.Config.SAVE_VERSION, 1);
  const d = G.Save.sanitize({ completed: { chateau: { rate: 1, pixels: 26, stars: 2, time: 95 } },
    runs: { chateau: { signature: G.Save.runSignature(old), taken: [0] } } });
  assert.equal(d.completed.chateau.stars, 2); assert.equal(d.runs.chateau, undefined);
  assert.ok(!G.Save.runSignature(G.LEVELS.cathedrale).startsWith('chateau-'));
});
test('Banc de test : activation locale explicite, sauvegarde distincte et cloud désactivé', () => {
  const local = harness('?dev=1&level=chateau');
  assert.equal(local.Config.DEV_LEVEL, 'chateau'); assert.equal(local.Config.SAVE_KEY, 'greenpath.dev.chateau');
  assert.equal(local.Config.CLOUD.url, '');
  for (const [search, host] of [['?level=chateau', 'localhost'], ['?dev=1&level=chateau', 'green-path-game.vercel.app'],
    ['?dev=1&level=inconnu', 'localhost'], ['?dev=1&level=chateau-other', 'localhost']]) {
    const G = harness(search, host); assert.equal(G.Config.DEV_LEVEL, undefined); assert.equal(G.Config.SAVE_KEY, 'greenpath.save');
  }
});
