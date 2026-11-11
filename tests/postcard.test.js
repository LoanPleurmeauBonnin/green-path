'use strict';
// Carte postale de fin de partie : phrase, météo, pseudo, nom du fichier, enregistrement unique (sans Phaser ni navigateur).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');

function setup(opts = {}) {
  const store = {};
  const storage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
  const c = { console, Date, Math, JSON, Number, String, Object, Array, Promise, URL, window: null, GP: {}, localStorage: storage };
  c.window = c; c.document = { documentElement: {} }; vm.createContext(c);
  const load = f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), c, { filename: f });
  ['js/config.js', 'js/data/lang/en.js', 'js/systems/I18n.js', 'js/systems/WeatherManager.js'].forEach(load);
  const n = opts.levels || 12, done = {};
  c.GP.LOCATIONS = Array.from({ length: n }, (_, i) => ({ id: 'l' + i, playable: true }));
  c.GP.Save = { storage: () => storage };
  c.GP.Progression = {
    data: { completed: done },
    completedCount: () => Object.keys(done).length,
    totalStars: () => Object.values(done).reduce((s, x) => s + x.stars, 0)
  };
  c.GP.Weather.get = () => opts.weather || { temp: 14, code: 3, isDay: true, source: 'live', time: Date.now() };
  load('js/systems/Postcard.js');
  const finish = (stars = 3) => c.GP.LOCATIONS.forEach(l => { done[l.id] = { stars }; });
  return { G: c.GP, store, finish, done, c };
}
const fin = (o = {}) => Object.assign({ date: '2026-11-12T10:42:00', meteo: { disponible: true, code: 3, temperature: 14, estJour: true }, etoiles: 34, total: 36, niveauxTermines: 12, pseudo: '' }, o);

test('Phrase : le modèle de la spécification, ciel couvert', () => {
  const { G } = setup();
  assert.equal(G.Postcard.sentence(fin(), 'fr'), 'Nantes reconstruite le 12 novembre, sous un ciel couvert, 34 étoiles sur 36.');
});

test('Phrase : un mot du ciel pour chaque météo, jour et nuit', () => {
  const { G } = setup();
  const sky = (code, estJour) => G.Postcard.skyPhrase({ disponible: true, code, estJour }, 'fr');
  assert.equal(sky(0, true), 'sous un grand soleil');
  assert.equal(sky(0, false), 'sous un ciel étoilé');
  assert.equal(sky(2, true), 'sous un ciel voilé');
  assert.equal(sky(3, true), 'sous un ciel couvert');
  assert.equal(sky(45, true), 'sous la brume');
  assert.equal(sky(53, true), 'sous la pluie');
  assert.equal(sky(63, true), 'sous la pluie');
  assert.equal(sky(95, true), "sous l'orage");
  assert.equal(sky(73, true), 'sous la neige');
});

test('Phrase : sans météo on ne l’invente pas, une seule étoile au singulier, partie courte', () => {
  const { G } = setup();
  assert.equal(G.Postcard.sentence(fin({ meteo: { disponible: false } }), 'fr'), 'Nantes reconstruite le 12 novembre, 34 étoiles sur 36.');
  assert.equal(G.Postcard.sentence(fin({ etoiles: 1 }), 'fr'), 'Nantes reconstruite le 12 novembre, sous un ciel couvert, 1 étoile sur 36.');
  assert.equal(G.Postcard.sentence(fin({ niveauxTermines: 4, total: 12, etoiles: 11 }), 'fr'),
    '4 lieux de Nantes reconstruits le 12 novembre, sous un ciel couvert, 11 étoiles sur 12.');
});

test('Phrase : version anglaise', () => {
  const { G } = setup();
  assert.equal(G.Postcard.sentence(fin(), 'en'), 'Nantes rebuilt on 12 November, under an overcast sky, 34 stars out of 36.');
  assert.equal(G.Postcard.sentence(fin({ meteo: { disponible: true, code: 61, temperature: 9, estJour: false }, etoiles: 1 }), 'en'),
    'Nantes rebuilt on 12 November, in the rain, 1 star out of 36.');
});

test('Pseudo : lettres, chiffres, espaces et tirets, 16 caractères au plus', () => {
  const { G } = setup();
  assert.equal(G.Postcard.cleanPseudo('  Léa-Rose  42 '), 'Léa-Rose 42');
  assert.equal(G.Postcard.cleanPseudo('<b>Zoé</b>;'), 'bZoéb');
  assert.equal(G.Postcard.cleanPseudo('a'.repeat(40)).length, 16);
  assert.equal(G.Postcard.cleanPseudo(null), '');
});

test('Fichier : nom avec la date de fin', () => {
  const { G } = setup();
  assert.equal(G.Postcard.fileName(fin()), 'green-path-nantes-2026-11-12.png');
});

test('Fin de partie : rien tant que tout n’est pas terminé, puis enregistrée une seule fois', () => {
  const t = setup();
  assert.equal(t.G.Postcard.record(), null);
  assert.equal(t.store['greenpath.postcard'], undefined);
  t.finish(3);
  const first = t.G.Postcard.record();
  assert.equal(first.etoiles, 36); assert.equal(first.total, 36); assert.equal(first.niveauxTermines, 12);
  assert.equal(first.meteo.disponible, true); assert.equal(first.meteo.code, 3); assert.equal(first.meteo.estJour, true);
  assert.match(first.date, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/);
  // plus tard : même carte, même météo (pas celle du moment)
  t.G.Weather.get = () => ({ temp: -2, code: 73, isDay: false, source: 'live', time: Date.now() });
  t.done.l0.stars = 1;
  assert.deepEqual(t.G.Postcard.record(), first);
  assert.deepEqual(t.G.Postcard.get(), first);
});

test('Fin de partie : une météo de secours n’est jamais enregistrée comme réelle', () => {
  const t = setup({ weather: { temp: 13, code: 2, isDay: true, source: 'fallback', time: Date.now() } });
  t.finish();
  const f = t.G.Postcard.record();
  assert.equal(f.meteo.disponible, false);
  assert.equal(t.G.Postcard.sentence(f, 'fr').includes('sous'), false);
});

test('Fin de partie : pseudo gardé localement, effaçable, donnée abîmée ignorée', () => {
  const t = setup();
  t.finish();
  t.G.Postcard.record();
  assert.equal(t.G.Postcard.setPseudo('  Loan ').pseudo, 'Loan');
  assert.equal(t.G.Postcard.get().pseudo, 'Loan');
  assert.equal(JSON.parse(t.store['greenpath.postcard']).pseudo, 'Loan');
  t.G.Postcard.clear();
  assert.equal(t.G.Postcard.get(), null);
  t.store['greenpath.postcard'] = '{"date":"nimporte quoi"}';
  assert.equal(t.G.Postcard.clean(JSON.parse(t.store['greenpath.postcard'])), null);
});

test('Cloud : la fin de partie et le pseudo de la carte ne font pas partie de la sauvegarde envoyée', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js/systems/Cloud.js'), 'utf8');
  assert.equal(/postcard/i.test(src), false);
  const save = fs.readFileSync(path.join(ROOT, 'js/systems/SaveManager.js'), 'utf8');
  assert.equal(/postcard/i.test(save), false);
});
