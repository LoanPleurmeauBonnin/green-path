'use strict';
// Niveaux redessinés (js/data/Redesigns.js) : chacun est finissable (pixels, lanternes, arrivée) et cohérent (aucune erreur ni avertissement du lint).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { load } = require('../tools/balance.cjs');
const solver = require('../js/systems/Solvability.js');
const G = load(true);
const c = { window: null }; c.window = c; vm.createContext(c); c.GP = G;
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/systems/Lint.js'), 'utf8'), c);

const nums = Object.keys(G.Redesigns).map(Number);
for (const n of nums) {
  test('Niveau ' + n + ' redessiné : finissable, cohérent, repères conservés', () => {
    const d = G.GZONES[n - 1], L = G.LEVELS[G.GZoneLevels.ids[n - 1]];
    assert.ok(d.refonte && d.retouche && d.equilibre, 'les retouches de l’ancien document ne s’appliquent plus');
    const issues = c.GP.Lint.check(d);
    assert.deepEqual(Array.from(issues, i => i.level + ' ' + i.msg), [], 'cohérence');
    d.roofs = (L && L.roofs) || [];
    const r = solver.solve(d);
    assert.ok(r.exit, 'arrivée atteignable'); assert.equal(r.missing.length, 0, 'pixels'); assert.equal(r.lights.length, 0, 'lanternes');
    const ex = d.arrivee.declencheur, mo = d.arrivee.monument;
    assert.ok(Number.isFinite(ex.x) && Number.isFinite(ex.y) && ex.x > 0 && ex.x < d.largeur && Number.isFinite(mo.x), 'arrivée dans le niveau');
    assert.ok(Number.isFinite(d.spawn.x) && Number.isFinite(d.spawn.y), 'départ');
    assert.equal(d.zones.length, 5); assert.ok(d.pixels.length >= 15 && d.checkpoints.length >= 2);
    assert.ok(d.pixels.every((p, i) => p.id === i + 1 && p.detail_image >= 1 && p.detail_image <= 3));
  });
}

test('Niveaux redessinés : tous les niveaux sauf le Château, chaque sprite cité existe, la signature de chaque lieu est là', () => {
  assert.deepEqual(nums.sort((a, b) => a - b), [2, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const used = d => {
    const ids = new Set();
    const walk = (o, key) => { if (Array.isArray(o)) o.forEach(x => walk(x, key)); else if (o && typeof o === 'object') Object.keys(o).forEach(k => walk(o[k], k)); else if (typeof o === 'string' && /^(sprite|sprite_.*|top_sprite|fill_sprite|bas_sprite)$/.test(key || '')) ids.add(o); };
    ['plateformes', 'dangers', 'ennemis', 'decor', 'signes', 'checkpoints', 'pixels', 'boosts'].forEach(k => walk(d[k], k));
    (d.plateformes || []).forEach(p => (p.sprite_set || []).forEach(s => ids.add(s)));
    return [...ids];
  };
  for (const n of nums) {
    const d = G.GZONES[n - 1];
    const missing = used(d).filter(id => !G.Kit.sprite(id) && id !== 'ciel_goutte_pluie');
    assert.deepEqual(missing, [], 'niveau ' + n + ' : sprites inconnus');
  }
  const has = (n, f) => assert.ok(f(G.GZONES[n - 1]), 'niveau ' + n);
  has(2, d => d.plateformes.some(p => p.type === 'colonne') && d.dangers.some(h => h.kind === 'cyclique'));    // accroche, colonnes, gargouilles
  has(4, d => d.plateformes.some(p => p.mecanique && p.mecanique.type === 'flotteur') && d.plateformes.some(p => p.glisse_tuiles_s));   // gabares, balcons penchés
  has(5, d => d.boosts.length >= 1 && d.ennemis.some(e => e.sprite === 'mario_gobelin') && d.plateformes.some(p => p.top_sprite === 'mario_tuyau_hg') && d.plateformes.some(p => p.top_sprite === 'mario_bloc_pixel'));   // monde 1-1 : champignon rebondissant, gobelins, tuyaux, blocs
  has(6, d => d.boss && d.valves && d.valves.length >= 3);                                                    // Grand Éléphant
  has(8, d => d.anneaux.length >= 3);                                                                         // anneaux
  has(9, d => d.boss && d.lampes_uv && d.dangers.some(h => /porte/.test(h.sprite)));                          // moisissure, portes
  has(11, d => d.dangers.some(h => h.cycle && h.cycle.type === 'maree'));                                     // marée
  has(12, d => d.boss);                                                                                       // boss final
  // les arènes de boss gardent leur place : le boss de chaque niveau commence là où le plan s'arrête
  [[6, 160], [9, 175], [12, 195]].forEach(([n, S]) => {
    const d = G.GZONES[n - 1]; assert.ok(d.zones[d.zones.length - 1].x[0] === S, 'niveau ' + n + ' : arène à x=' + S);
  });
});

test('Générateur : mêmes règles partout (≥ 3 tuiles de sol avant un danger, une lanterne toutes les 45 tuiles)', () => {
  for (const n of nums) assert.deepEqual(Array.from(G.LevelGen.notes(n)), [], 'niveau ' + n);
});

test('Éditeur : les motifs de conception se posent sur chaque niveau redessiné (objets finis, sol de 3 tuiles de chaque côté)', () => {
  for (const n of nums) {
    const d = G.GZONES[n - 1]; let ok = 0;
    for (const m of G.LevelGen.MOTIFS) {
      let st = null; try { st = G.LevelGen.stamp(n, m[0], d.sol_y, d.hauteur); } catch (e) { st = null; }   // un motif absent du thème du lieu (colonne…) est simplement refusé
      if (!st) continue; ok++;
      const all = [].concat(st.plateformes, st.dangers, st.pixels, st.signes, st.checkpoints, st.ennemis);
      assert.ok(all.every(o => [o.x, o.x0, o.x1].some(Number.isFinite)), 'niveau ' + n + ' ' + m[0]);
      assert.ok(st.width >= 9, 'niveau ' + n + ' ' + m[0] + ' : 3 tuiles de sol de chaque côté');
    }
    assert.ok(ok >= 16, 'niveau ' + n + ' : ' + ok + ' motifs');
  }
});
