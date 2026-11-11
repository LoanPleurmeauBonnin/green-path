'use strict';
const { test } = require('node:test'), assert = require('node:assert/strict');
const { load } = require('../tools/balance.cjs'), { solve } = require('../tools/solvability.cjs');

const G = load(true);
// Le Château (3) garde l'ancien moteur : hors du contrôleur.
G.GZONES.forEach(d => {
  if (d.num === 3) return;
  test('Faisabilité niveau ' + d.num + ' : arrivée, pixels et points de contrôle atteignables', () => {
    const L = G.LEVELS[G.GZoneLevels.ids[d.num - 1]]; d.roofs = (L && L.roofs) || [];
    const r = solve(d);
    assert.ok(r.exit, 'arrivée hors d’atteinte (x max ' + r.farthest + '/' + d.largeur + ')');
    assert.equal(r.missing.length, 0, 'pixels hors d’atteinte : ' + Array.from(r.missing).join(' '));
    assert.equal(r.lights.length, 0, 'points de contrôle hors d’atteinte : ' + Array.from(r.lights).join(' '));
  });
});

test('Faisabilité : les retouches de géométrie visent des plateformes qui existent', () => {
  const rep = G.GZoneLevels.repairs;
  Object.keys(rep).forEach(n => {
    const ids = new Set(G.GZONES[n - 1].plateformes.map(p => p.id));
    Object.keys(rep[n].modifier || {}).forEach(id => assert.ok(ids.has(id), 'niveau ' + n + ' : ' + id));
  });
});
