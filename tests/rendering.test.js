'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
function harness() {
  const c = { console, location: { search: '', hostname: 'localhost' }, document: {}, matchMedia: () => ({ matches: false }) };
  c.window = c; vm.createContext(c);
  const load = f => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'), c, { filename: f });
  ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/data/locations.js', 'js/data/levels.js', 'js/data/gzones.js',
    'js/data/GZoneLevels.js', 'js/data/levelStyles.js', 'js/systems/GZoneRuntime.js', 'js/systems/GZoneArt.js'].forEach(load);
  for (const f of fs.readdirSync(path.join(__dirname, '../js/data/sprites')).filter(f => f.endsWith('.js'))) load('js/data/sprites/' + f);
  const info = Object.fromEntries(Object.values(c.GP.SPRITES).flat().map(s => [s.id, s]));
  c.GP.Sprites = { info: key => info[key] };
  return { G: c.GP, info };
}
test('Associations : deux identifiants absents ne relient jamais un décor anonyme', () => {
  const { G } = harness(), surfaces = [{ id: 'p17' }, {}], visuals = [{ sprite: 'decoration' }, { id: 'autre' }];
  G.GZoneRuntime.associate(surfaces, visuals);
  assert.equal(surfaces[0].visuals.length, 0); assert.equal(surfaces[1].visuals.length, 0);
});
test('Associations : groupes a/b bornés, pas de capture de gear10 par gear1', () => {
  const { G } = harness(), surfaces = [{ id: 'gear1', sur: 'gear1' }, { id: 'gabare1' }];
  const visuals = [{ id: 'gear1a' }, { id: 'gear1b' }, { id: 'gear10a' }, { id: 'gabare1a' }, { id: 'gabare1b' }, {}];
  G.GZoneRuntime.associate(surfaces, visuals);
  assert.deepEqual(Array.from(surfaces[0].visuals.map(v => v.id)), ['gear1a', 'gear1b']);
  assert.deepEqual(Array.from(surfaces[1].visuals.map(v => v.id)), ['gabare1a', 'gabare1b']);
});
test('Associations : pads statiques composés permis, double propriétaire mobile refusé', () => {
  const { G } = harness(), visuals = [{ id: 'serre' }];
  const surfaces = [{ id: 'gauche', sur: 'serre' }, { id: 'droite', sur: 'serre' }];
  G.GZoneRuntime.associate(surfaces, visuals); assert.equal(surfaces[0].visuals[0], surfaces[1].visuals[0]);
  surfaces[1].mecanique = { type: 'va-et-vient' };
  assert.throws(() => G.GZoneRuntime.associate(surfaces, visuals), /plusieurs plateformes/);
});
test('Plans réels : galeries indépendantes, bateaux groupés, conteneurs anonymes explicitement attribués', () => {
  const { G } = harness();
  const cathedral = G.GZoneRuntime.plan(G.LEVELS.cathedrale);
  assert.ok(cathedral.surfaces.filter(s => s.type === 'galerie').every(s => s.visuals.length === 0 && s.sprite === 'cathedrale_galerie_balustrade'));
  const boats = G.GZoneRuntime.plan(G.LEVELS.feydeau).surfaces.filter(s => /^gabare\d$/.test(s.id));
  assert.equal(boats.length, 5); assert.ok(boats.every(s => s.visuals.length === 2));
  const cargo = G.GZoneRuntime.plan(G.LEVELS.hangar);
  assert.equal(cargo.surfaces.find(s => s.id === 'c2').visuals.length, 2);
  assert.ok(cargo.surfaces.find(s => s.id === 'c2').visuals.every(v => v.surfaceId === 'c2'));
  const lu = G.GZoneRuntime.plan(G.LEVELS['tour-lu']);
  assert.ok(lu.surfaces.filter(s => s.raw).every(s => s.visuals.length === 0));
});
test('Plans réels : aucune plateforme sans texture ni assemblage visible déclaré', () => {
  const { G, info } = harness(), source = JSON.stringify(G.GZONES);
  for (const loc of G.LOCATIONS.filter(l => l.id !== 'chateau')) {
    const plan = G.GZoneRuntime.plan(G.LEVELS[loc.level]);
    for (const s of plan.surfaces) {
      assert.ok(s.sprite_set || s.sprite || s.visuals.length, loc.id + '/' + s.id);
      if (s.sprite) assert.ok(info[s.sprite], s.sprite);
      if (s.sprite_set) s.sprite_set.forEach(k => assert.ok(info[k], k));
    }
  }
  assert.equal(JSON.stringify(G.GZONES), source, 'les documents sources restent immuables');
});
test('Matériaux : toutes les masses ont un rôle et des textures explicites, jamais gz_soil', () => {
  const { G, info } = harness();
  for (const d of G.GZONES) for (const p of d.plateformes.filter(p => p.type === 'masse')) {
    const m = G.LevelStyles.material(d, p);
    assert.ok(['natural', 'quay', 'masonry', 'metal'].includes(m.kind));
    if (m.kind === 'metal') continue;
    assert.ok(m.top && m.fill);
    for (const field of ['top', 'fill', 'left', 'right', 'bottom', 'topLeft', 'topRight']) if (m[field]) {
      for (const key of [].concat(m[field])) assert.ok(info[key] || /^gz_quay_/.test(key), d.num + '/' + p.id + '/' + key);
    }
  }
});
test('Lustres : largeur native, centre et hauteur du trajet conservés', () => {
  const { G, info } = harness(), L = G.LEVELS.pommeraye, plan = G.GZoneRuntime.plan(L);
  for (const original of L.gzone.plateformes.filter(p => /^lustre[123]$/.test(p.id || '') && p.type)) {
    const surface = plan.surfaces.find(s => s.id === original.id);
    assert.equal(surface.w * 16, info.pommeraye_lustre.w);
    assert.equal(surface.x + surface.w / 2, original.x + original.w / 2);
    assert.equal(surface.y, original.y);
  }
});
test('Chantiers : les piles larges sont métalliques, les vraies pelouses restent naturelles', () => {
  const { G } = harness(), d = G.GZONES[6];
  for (const id of ['p16', 'p18', 'p41', 'p42']) {
    const p = d.plateformes.find(p => p.id === id);
    assert.equal(G.LevelStyles.material(d, p).kind, 'metal');
    assert.equal(G.LevelStyles.material(d, Object.assign({}, p, { w: 12 })).kind, 'metal');
  }
  for (const id of ['p1', 'p2', 'p3', 'p43']) assert.equal(G.LevelStyles.material(d, { id }).kind, 'natural');
  for (const id of ['p7', 'p8', 'p9', 'p10']) assert.equal(G.LevelStyles.material(d, { id }).kind, 'quay');
});
test('Contours : pas de joint interne, retour vertical uniquement sur la partie exposée', () => {
  const { G } = harness(), a = { x: 0, y: 16, w: 16, h: 32 }, b = { x: 16, y: 0, w: 16, h: 48 };
  const plain = x => JSON.parse(JSON.stringify(x));
  assert.deepEqual(plain(G.GZoneArt.edges(a, 'right', [a, b])), []);
  assert.deepEqual(plain(G.GZoneArt.edges(b, 'left', [a, b])), [[0, 16]]);
  assert.deepEqual(plain(G.GZoneArt.edges(a, 'top', [a, b])), [[0, 16]]);
});
test('Habillage : application idempotente et salles du Château limitées aux abris existants', () => {
  const { G } = harness(), L = G.LEVELS.chateau;
  G.LevelStyles.apply(L); G.LevelStyles.apply(L);
  assert.equal(L.rooms.length, 2); assert.equal(L.sky.farKey, 'lv_fond_chateau');
  L.rooms.forEach((r, i) => { const z = L.shelters[i]; assert.equal(r.x * 16, z.x); assert.equal(r.y, z.y); assert.equal(r.w, z.w); assert.equal(r.h, z.h - 1); });
  G.LevelStyles.apply(G.LEVELS['jardin-des-plantes']);
  assert.equal(G.LEVELS['jardin-des-plantes'].sky.farKey, 'lv_fond_parc');
});
