'use strict';
const { test } = require('node:test'), assert = require('node:assert/strict');
const { load, metrics, checkAddition } = require('../tools/balance.cjs');

const before = load(false), after = load(true);
const A = after.GZONES.map(metrics), B = before.GZONES.map(metrics);

test('Équilibrage : les obstacles ajoutés sont sur un sol plat et dégagé, loin du reste', () => {
  const table = after.GZoneLevels.balance;
  Object.keys(table).forEach(n => (table[n].ajouter || []).forEach(h => {
    const d = after.GZONES[n - 1], placed = d.dangers.find(x => x.x === h.x && x.y === h.y && x.sprite === h.sprite);
    assert.ok(placed, 'niveau ' + n + ' : obstacle (' + h.x + ',' + h.y + ') absent');
    assert.deepEqual(checkAddition(d, placed), [], 'niveau ' + n + ' obstacle (' + h.x + ',' + h.y + ')');
  }));
});

test('Équilibrage : début plus doux, pic du niveau 6 écrêté, niveau 7 renforcé', () => {
  // Niveau 1 : refonte du 11 novembre 2026 (GZoneLevels.REDESIGNS). L'indice compte ses bassins sous les ponts et son jet
  // d'apprentissage au sec comme des obstacles : il monte (12,6) alors que chaque danger est d'abord montré sans risque.
  // Son plafond est donc propre à la refonte ; les niveaux 2 et 3 gardent la règle d'origine.
  assert.ok(A[0].per100 <= 13, 'niveau 1 : ' + A[0].per100.toFixed(1));
  [1, 2].forEach(i => assert.ok(A[i].per100 <= 10, 'niveau ' + (i + 1) + ' : ' + A[i].per100.toFixed(1)));
  assert.ok(A[1].per100 < B[1].per100);
  assert.ok(A[5].per100 < B[5].per100);
  assert.ok(A[6].per100 > B[6].per100);
});

test('Équilibrage : retraits ciblés, rien d’autre ne disparaît', () => {
  const table = after.GZoneLevels.balance;
  Object.keys(table).forEach(n => {
    if ((after.GZoneLevels.redesigns || {})[n]) return;   // niveau redessiné : ses dangers ne viennent plus du document importé
    const removed = (table[n].retirer || []).length, added = (table[n].ajouter || []).length;
    assert.equal(after.GZONES[n - 1].dangers.length, before.GZONES[n - 1].dangers.length - removed + added, 'niveau ' + n);
  });
});

test('Mémorial : toujours sans ennemi ni pointe (niveau contemplatif)', () => {
  const d = after.GZONES[10];
  assert.equal(A[10].discrete, 0);
  assert.equal(A[10].en, 0);
  assert.ok(d.dangers.every(h => h.kind !== 'mortel'));
});

test('Équilibrage : les vitesses d’ennemis restent bornées (jouables)', () => {
  after.GZONES.forEach(d => (d.ennemis || []).forEach(e => { if (e.vitesse) assert.ok(e.vitesse >= 2 && e.vitesse <= 5.5, d.num + ' ' + e.id + ' ' + e.vitesse); }));
});
