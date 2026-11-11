'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const ROOT = path.join(__dirname, '..');
function harness() {
  const dom = {}, events = new EventEmitter(), keys = new EventEmitter(), seen = [];
  let pad = null;
  const c = { console, document: { documentElement: {} }, navigator: { language: 'fr', getGamepads: () => pad ? [pad] : [] },
    location: { search: '' }, addEventListener: (e, fn) => { dom[e] = fn; }, matchMedia: () => ({ matches: false }),
    Phaser: { Input: { Keyboard: { KeyCodes: { A: 65, D: 68, Q: 81, S: 83, W: 87, Z: 90, F: 70 } } } }, GP: {} };
  c.window = c; vm.createContext(c);
  const load = f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), c, { filename: f });
  ['js/config.js', 'js/data/lang/en.js', 'js/systems/I18n.js', 'js/systems/Settings.js', 'js/systems/Controls.js', 'js/systems/Prompts.js', 'js/systems/MapTravel.js'].forEach(load);
  c.GP.game = { scene: { getScenes: () => [{ scene: { key: 'Menu' }, input: { keyboard: keys } }] } };
  ['ENTER', 'SPACE', 'RIGHT', 'LEFT', 'UP', 'DOWN', 'H', 'M', 'R', 'ESC'].forEach(k => keys.on('keydown-' + k, () => seen.push(k)));
  c.GP.Prompts.start(); c.GP.Pad.start({ events });
  return { G: c.GP, load, c, seen, keys,
    connect: () => { pad = { connected: true, id: 'Standard controller', axes: [0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) }; return pad; },
    disconnect: () => { pad = null; }, tick: t => events.emit('prestep', t),
    pointer: type => dom.pointerdown({ pointerType: type }),
    keyboard: (repeat = false) => dom.keydown({ key: 'ArrowLeft', repeat }) };
}
test('Périphérique : connexion et drift sous 0,65 ne changent ni UI ni mouvement', () => {
  const h = harness(), p = h.connect(); h.tick(0);
  assert.equal(h.G.Prompts.device, 'keyboard');
  for (const x of [0.1, -0.3, 0.6, -0.6, 0]) { p.axes[0] = x; h.tick(16); assert.equal(h.G.Prompts.device, 'keyboard'); assert.equal(h.G.Pad.state.right, false); }
});
test('Périphérique : clavier → manette → clavier, maintien et répétitions sans vol de focus', () => {
  const h = harness(), p = h.connect(); p.buttons[0].pressed = true; h.tick(0);
  assert.equal(h.G.Prompts.device, 'gamepad'); assert.deepEqual(h.seen, ['ENTER']);
  h.keyboard(); h.tick(500); assert.equal(h.G.Prompts.device, 'keyboard'); assert.equal(h.seen.length, 1);
  p.buttons[0].pressed = false; h.tick(520); p.buttons[0].pressed = true; h.tick(540);
  assert.equal(h.G.Prompts.device, 'gamepad'); h.keyboard(true); assert.equal(h.G.Prompts.device, 'gamepad');
  h.disconnect(); h.tick(560); assert.equal(h.G.Prompts.device, 'keyboard');
});
test('Stick : hystérésis, relâchement et inversion volontaire', () => {
  const h = harness(), p = h.connect(); p.axes[0] = 0.8; h.tick(0); assert.equal(h.G.Pad.state.right, true);
  h.keyboard(); p.axes[0] = 0.5; h.tick(500); assert.equal(h.G.Prompts.device, 'keyboard');
  p.axes[0] = 0.34; h.tick(520); assert.equal(h.G.Pad.state.right, false);
  p.axes[0] = 0.55; h.tick(540); assert.equal(h.G.Pad.state.right, false);
  p.axes[0] = -0.9; h.tick(560); assert.equal(h.G.Pad.state.left, true); assert.equal(h.G.Prompts.device, 'gamepad');
});
test('Pointeur : un clic revient au clavier, le tactile a ses indications propres', () => {
  const h = harness(); h.G.Prompts.use('gamepad'); h.pointer('mouse'); assert.equal(h.G.Prompts.device, 'keyboard');
  h.pointer('touch'); assert.equal(h.G.Prompts.device, 'touch'); assert.equal(h.G.Prompts.format('{jump}'), '↑');
});
test('Commandes : schéma central utilisé pour aide, pages et actions secondaires', () => {
  const h = harness(), p = h.connect();
  p.buttons[h.G.Prompts.BUTTONS.help].pressed = true; h.tick(0); assert.ok(h.seen.includes('H'));
  p.buttons[4].pressed = true; h.tick(20); assert.ok(h.seen.includes('LEFT'));
  p.buttons[5].pressed = true; h.tick(40); assert.ok(h.seen.includes('RIGHT'));
  assert.equal(h.G.Prompts.format('{jump} {pause} {help}'), '[A] [START] [Y]');
  p.id = 'Sony DualSense'; p.buttons[1].pressed = true; h.tick(60);
  assert.equal(h.G.Prompts.format('{confirm}'), '[CROIX]');
});
test('Remapping : libellés actualisés, commandes de menus non réaffectées', () => {
  const h = harness(), G = h.G; let notices = 0; const scene = { events: new EventEmitter() };
  G.Prompts.watch(scene, () => notices++);
  assert.equal(G.Settings.setKey('jump', 0, 70).ok, true); assert.equal(G.Prompts.format('{jump}'), 'F');
  assert.equal(G.Prompts.format('{confirm}'), 'ENTRÉE'); assert.equal(notices, 1);
  scene.events.emit('shutdown'); G.Prompts.refresh(); assert.equal(notices, 1);
});
test('Bindings : objets détruits et scènes fermées ne reçoivent plus de mise à jour', () => {
  const G = harness().G, scene = { events: new EventEmitter() }, text = new EventEmitter(); let draws = 0;
  text.scene = scene; text.setText = () => { draws++; };
  G.Prompts.bind(scene, text, '{jump}'); G.Prompts.use('gamepad'); assert.equal(draws, 2);
  text.emit('destroy'); G.Prompts.use('keyboard'); assert.equal(draws, 2); assert.equal(scene.events.listenerCount('shutdown'), 0);
});
test('Traduction : les modèles sont traduits avant substitution des commandes', () => {
  const G = harness().G; G.I18n.setLang('en');
  assert.equal(G.Prompts.format('{jump} : SAUTER'), 'SPACE: JUMP');
  G.Prompts.use('gamepad'); assert.equal(G.Prompts.format('REJOUER {replay}'), 'REPLAY [X]');
});
test('Carte : inversion immédiate depuis la position courante, sans téléportation', () => {
  const G = harness().G, m = new G.MapTravel(1, 12, 120, 190);
  m.step(-1); m.tick(50); const x = m.x; m.step(1);
  assert.equal(m.x, x); m.tick(16); assert.ok(m.x > x); assert.equal(m.target, 1);
  for (let i = 0; i < 100; i++) { const before = m.x; m.step(i % 2 ? 1 : -1); m.tick(16); assert.ok(Math.abs(m.x - before) <= 95 * 0.016 + 1e-8); }
});
test('Carte : retarget clic, annulation de fiche différée, limites et arrivée exacte', () => {
  const G = harness().G, m = new G.MapTravel(0, 12, 120, 190);
  m.to(5, true); m.tick(50); m.step(-1); assert.equal(m.open, false);
  for (let i = 0; i < 100; i++) m.tick(16);
  assert.equal(m.x, 120); assert.equal(m.moving, false); m.step(-1); assert.equal(m.x, 120);
  m.to(11); for (let i = 0; i < 2000; i++) m.tick(16); assert.equal(m.x, 120 + 11 * 190);
  m.step(1); assert.equal(m.moving, false);
});
test('Profil du rail : plusieurs pentes montantes et descendantes, continuité pixel', () => {
  const h = harness(); h.load('js/systems/PixelArt.js'); h.load('js/systems/MapArt.js'); const M = h.G.MapArt;
  assert.ok(M.columns.filter(c => c.kind === 'up').length >= 3); assert.ok(M.columns.filter(c => c.kind === 'down').length >= 3);
  for (let x = 1; x < M.WIDTH; x++) if (!M.inGap(x) && !M.inGap(x - 1)) assert.ok(Math.abs(M.vergeY(x) - M.vergeY(x - 1)) <= 1, 'discontinuité à ' + x);
});
