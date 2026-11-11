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
test('Redesigns : la liste des niveaux redessinés', () => { assert.ok(nums.includes(2) && nums.includes(4)); });
for (const n of nums) {
  test('Niveau ' + n + ' redessiné : finissable, cohérent, repères conservés', () => {
    const d = G.GZONES[n - 1], L = G.LEVELS[G.GZoneLevels.ids[n - 1]];
    assert.ok(d.refonte && d.retouche && d.equilibre, 'les retouches de l’ancien document ne s’appliquent plus');
    const issues = c.GP.Lint.check(d);
    assert.deepEqual(Array.from(issues, i => i.level + ' ' + i.msg), [], 'cohérence');
    d.roofs = (L && L.roofs) || [];
    const r = solver.solve(d);
    assert.ok(r.exit, 'arrivée atteignable'); assert.equal(r.missing.length, 0, 'pixels'); assert.equal(r.lights.length, 0, 'lanternes');
    assert.equal(d.zones.length, 5); assert.ok(d.pixels.length >= 15 && d.checkpoints.length >= 2);
    assert.ok(d.pixels.every((p, i) => p.id === i + 1 && p.detail_image >= 1 && p.detail_image <= 3));
  });
}
