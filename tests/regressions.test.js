'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function harness() {
  const c = { console, location: { search: '?dev=1' }, matchMedia: () => ({ matches: false }), addEventListener() {}, document: {}, setTimeout, URL, Blob };
  c.window = c; c.GP = {}; vm.createContext(c);
  c.load = f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), c, { filename: f });
  ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/data/locations.js', 'js/data/levels.js', 'js/systems/WeatherRules.js',
    'js/systems/WeatherShelters.js', 'js/data/sprites/palette.js', 'js/data/sprites/carte.js', 'js/data/sprites/commun.js',
    'js/systems/MapArt.js', 'js/systems/MapTravel.js', 'js/systems/MapDecor.js'].forEach(c.load);
  return c;
}
test('Équilibrage : les valeurs physiques et temps cibles existants sont conservés', () => {
  const G = harness().GP;
  assert.equal(G.Tuning.worldGravity, 950); assert.equal(G.Tuning.player.speed, 110); assert.equal(G.Tuning.player.jump, -320);
  assert.equal(G.Tuning.player.coyote, 90); assert.equal(G.Tuning.player.buffer, 110);
  assert.deepEqual(Array.from(G.LOCATIONS.filter(l => l.playable).map(l => l.parTime)), [90, 110, 100]);
});
test('Piédestaux : modèle et rendu atteignent la vraie surface des 12 nœuds, aller/retour', () => {
  const G = harness().GP, M = G.MapArt;
  for (let i = 0; i < 12; i++) {
    const m = new G.MapTravel(i, 12, M.nodeX(0), M.GAP, M.walkY);
    assert.equal(m.y, M.pathY(M.nodeX(i)) - 8);
    if (i < 11) { m.to(i + 1); for (let n = 0; n < 200; n++) m.tick(16); assert.equal(m.y, M.walkY(M.nodeX(i + 1))); }
    m.to(i); for (let n = 0; n < 200; n++) m.tick(16);
    assert.equal(m.x, M.nodeX(i)); assert.equal(m.y, M.walkY(m.x));
  }
});
test('Piédestal : montée en marches et inversion sans saut de position logique', () => {
  const G = harness().GP, M = G.MapArt, x = M.nodeX(2);
  assert.ok(M.walkY(x - 15) > M.walkY(x - 7));
  assert.equal(M.walkY(x - 6), M.walkY(x));
  const m = new G.MapTravel(1, 12, M.nodeX(0), M.GAP, M.walkY); m.to(2);
  for (let i = 0; i < 115; i++) m.tick(1000 / 60);
  const old = [m.x, m.y]; m.step(-1); assert.deepEqual([m.x, m.y], old); m.tick(16);
  assert.ok(m.x < old[0]); assert.equal(m.y, M.walkY(m.x));
});
test('Piédestal : les quatre états conservent le même contour de marche', () => {
  const sprites = harness().GP.SPRITES.carte;
  const profile = s => Array.from({ length: s.w }, (_, x) => s.rows.findIndex(row => row[x] !== '.'));
  const states = sprites.filter(s => s.id.startsWith('carte_piedestal_'));
  states.forEach(s => assert.deepEqual(profile(s), profile(states[0])));
});
test('Décor : uniquement la haie et la barrière isolées reçoivent des terminaisons', () => {
  const G = harness().GP, all = Object.values(G.SPRITES).flat(), snapshot = JSON.stringify(G.SPRITES);
  const hedge = all.find(s => s.id === 'carte_haie'), fence = all.find(s => s.id === 'carte_barriere_bois');
  const h = G.MapDecor.finishRows(hedge), f = G.MapDecor.finishRows(fence);
  assert.equal(h[0].length, 24); assert.ok(h[2].startsWith('....')); assert.ok(h[13].startsWith('..'));
  f.forEach(row => { assert.equal(row[0], 'k'); assert.equal(row.at(-1), 'k'); });
  for (const id of ['carte_lampadaire', 'commun_arbre_moyen', 'commun_buisson_a', 'commun_buisson_b']) {
    const s = all.find(v => v.id === id); assert.deepEqual(Array.from(G.MapDecor.finishRows(s)), Array.from(s.rows));
  }
  assert.equal(JSON.stringify(G.SPRITES), snapshot);
  [h, f].forEach(rows => rows.forEach(row => Array.from(row).forEach(ch => assert.ok(ch === '.' || G.SPRITE_PAL[ch]))));
});
test('Abris : extérieur, partiel, complet et canaux pluie/neige/vent indépendants', () => {
  const S = harness().GP.WeatherShelters;
  const zones = [{ id: 'a', x: 10, y: 20, w: 40, h: 30, rain: 1, snow: 1, wind: 0.5 },
    { id: 'b', x: 60, y: 20, w: 40, h: 30, rain: 0.5, snow: 0.5, wind: 0.25 }];
  assert.equal(S.at(zones, 9, 21).rain, 0); assert.equal(S.at(zones, 11, 21).rain, 1);
  assert.equal(S.at(zones, 70, 21).rain, 0.5); assert.equal(S.at(zones, 70, 21).wind, 0.25);
  assert.equal(S.at(zones, 50, 21).rain, 0); assert.equal(S.at(zones, 20, 50).rain, 0);
});
test('Abris : chevauchements bornés et indépendants de l’ordre des zones', () => {
  const S = harness().GP.WeatherShelters;
  const a = { x: 0, y: 0, w: 50, h: 50, rain: 0.5, snow: 0.4, wind: 1 }, b = { x: 0, y: 0, w: 50, h: 50, rain: 1, snow: 0.8, wind: 0.2 };
  for (const zones of [[a, b], [b, a]]) { const v = S.at(zones, 10, 10); assert.equal(v.rain, 1); assert.equal(v.snow, 0.8); assert.equal(v.wind, 1); }
  assert.equal(S.at([{ ...a, rain: Infinity, wind: 4 }], 10, 10).rain, 0);
  assert.equal(S.at([{ ...a, wind: 4 }], 10, 10).wind, 1);
});
test('Abris : transition progressive à durée bornée, initialisation immédiate après reprise', () => {
  const S = harness().GP.WeatherShelters; let v = { rain: 0, snow: 0, wind: 0 };
  const target = { rain: 1, snow: 1, wind: 0.5, id: 'porch' };
  v = S.approach(v, target, 50); assert.ok(v.rain > 0 && v.rain < 1);
  for (let i = 0; i < 6; i++) v = S.approach(v, target, 50); assert.equal(v.rain, 1);
  const exit = S.approach(v, { rain: 0, snow: 0, wind: 0 }, 50); assert.ok(exit.rain > 0 && exit.rain < 1);
  assert.equal(S.approach(exit, target, 0, true).rain, 1);
});
test('Abris : sol sec, poussée réduite, neige protégée sans changer le saut', () => {
  const G = harness().GP, base = G.Tuning.player, rain = { rain: true, wind: 80, windSign: 1 };
  const outside = G.WeatherRules.physics(rain, base), inside = G.WeatherRules.physics(rain, base, { rain: 1, snow: 1, wind: 0.5 });
  assert.equal(outside.accelGround, 650); assert.equal(inside.accelGround, 1100); assert.equal(inside.airPush, 55);
  const snow = G.WeatherRules.physics({ snow: true }, base, { rain: 1, snow: 1, wind: 1 });
  assert.equal(snow.accelGround, 1100); assert.equal(snow.accelAir, 700); assert.equal(base.jump, -320);
});
test('Abris : masque de précipitations et physique utilisent la même géométrie', () => {
  const G = harness().GP;
  for (const L of Object.values(G.LEVELS)) for (const zone of L.shelters) {
    const x = zone.x + zone.w / 2, y = zone.y + zone.h / 2;
    assert.equal(G.WeatherShelters.exposure(L.shelters, x, y, false), 1 - G.WeatherShelters.at(L.shelters, x, y).rain);
    assert.equal(G.WeatherShelters.exposure(L.shelters, x, y, true), 1 - G.WeatherShelters.at(L.shelters, x, y).snow);
  }
  assert.equal(G.LEVELS.cathedrale.shelters.length, 0); assert.equal(G.LEVELS.chateau.shelters.length, 2);
});
test('Relevé de playtest : volontaire, mémoire seule et signaux distincts des notes humaines', () => {
  const c = harness(), G = c.GP; c.load('tools/playtest.js');
  G.Prompts = { device: 'keyboard' };
  const g = { scene: { key: 'Game' }, loc: { id: 'chateau', parTime: 100 }, TUNE: G.Tuning.player, events: new EventEmitter(),
    player: { x: 40, y: 224 }, pc: { count: 0, total: 26 }, time_ms: 0, deaths: 0, paused: true, introMs: 0, shelter: {} };
  const session = G.Playtest.start(g, { id: 'P01' });
  for (let i = 0; i < 400; i++) g.events.emit('update', i * 50, 50);
  assert.equal(session.report.samples.length, 0); g.paused = false;
  for (let i = 0; i < 310; i++) { g.time_ms += 50; g.events.emit('update', g.time_ms, 50); }
  assert.equal(session.report.kind, 'simulation'); assert.equal(session.report.signals.length, 1); assert.equal(session.report.notes.length, 0);
  session.note('Lecture du panneau observée.'); assert.equal(session.report.notes[0].origin, 'observer-entered');
  g.events.emit('playtest-event', { type: 'finish' }); assert.equal(session.report.status, 'finished'); assert.equal(g.events.listenerCount('update'), 0);
});
