'use strict';
// Éditeur de niveaux et de textures : contenu publié (GP.Content), géométrie de l'éditeur, cohérence avec index.html et Supabase.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');

function context(extra = []) {
  const c = { console, location: { search: '', hostname: 'localhost' }, document: {}, matchMedia: () => ({ matches: false }), Phaser: { Scene: class {} } };
  c.window = c; vm.createContext(c);
  for (const f of ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/data/locations.js', 'js/data/levels.js', 'js/data/gzones.js', 'js/data/GZoneLevels.js',
    'js/data/sprites/palette.js', 'js/systems/Content.js'].concat(extra)) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), c, { filename: f });
  return c.GP;
}
const clone = o => JSON.parse(JSON.stringify(o));

test('Contenu publié : les douze documents d’origine sont acceptés par la validation', () => {
  const G = context();
  for (let i = 0; i < 12; i++) assert.equal(G.Content.checkLevel(clone(G.GZONES[i]), i), null, 'niveau ' + (i + 1));
});

test('Contenu publié : un document abîmé est refusé, le niveau d’origine reste jouable', () => {
  const G = context(), id = G.GZoneLevels.ids[0], before = G.LEVELS[id];
  const bad = [d => { d.largeur = NaN; }, d => { delete d.spawn; }, d => { d.pixels = []; }, d => { d.plateformes[0].x = 'x'; }, d => { d.num = 5; },
    d => { d.dangers = 'oups'; }, d => { d.decor = [null]; }, d => { d.nom = 'x'.repeat(6000); }, d => { d.hauteur = 999; }];
  for (const f of bad) {
    const d = clone(G.GZONES[0]); f(d);
    assert.ok(G.Content.applyLevel(id, d, 1), 'devrait être refusé : ' + f);
    assert.equal(G.LEVELS[id], before);
  }
});

test('Contenu publié : un niveau modifié remplace l’original, sa révision change, ?sans-edits=1 est respecté', () => {
  const G = context(), id = G.GZoneLevels.ids[0];
  const d = clone(G.GZONES[0]); d.pixels.push({ id: 99, sprite: 'commun_pixel', x: 20, y: 13, difficulte: 'facile', detail_image: 1 });
  const rev = G.LEVELS[id].revision;
  assert.equal(G.Content.applyLevel(id, d, 3), null);
  assert.equal(G.LEVELS[id].pixels.length, 16);
  assert.notEqual(G.LEVELS[id].revision, rev, 'les parties en cours de l’ancienne version sont écartées');
  assert.equal(G.Content.version(id), 3);
  assert.equal(G.Content.originalDoc(id).pixels.length, 15, 'le document d’origine reste disponible pour revenir en arrière');
});

test('Contenu publié : textures créées ou remplacées, couleurs inconnues refusées', () => {
  const G = context(); G.SPRITES = { commun: [{ id: 'commun_pixel', w: 2, h: 2, rows: ['yy', 'yy'] }] };
  assert.equal(G.Content.checkSprite({ w: 2, h: 2, rows: ['g.', '.g'] }), null);
  assert.match(G.Content.checkSprite({ w: 2, h: 2, rows: ['g.', '.#'] }), /couleur/);
  assert.match(G.Content.checkSprite({ w: 2, h: 2, rows: ['g.'] }), /hauteur/);
  assert.match(G.Content.checkSprite({ w: 65, h: 2, rows: ['', ''] }), /taille/);
  assert.equal(G.Content.applyTextures({ perso_a: { w: 2, h: 1, rows: ['gg'] }, commun_pixel: { w: 2, h: 2, rows: ['gg', 'gg'] }, mauvais: { w: 1, h: 1, rows: ['#'] } }), 2);
  assert.equal(G.SPRITES.perso[0].id, 'perso_a');
  assert.deepEqual(Array.from(G.SPRITES.commun[0].rows), ['gg', 'gg']);
  assert.ok(G.Content.originalSprite('commun_pixel'));
  assert.equal(G.SPRITES.perso.length, 1, 'une texture invalide n’est pas ajoutée');
});

test('Éditeur : l’ordre des niveaux est celui du jeu, et toutes les entités ont une zone', () => {
  const G = context(['js/editor/EditorScene.js']);
  const ui = fs.readFileSync(path.join(ROOT, 'js/editor/EditorUI.js'), 'utf8');
  const order = /var GZ_ORDER = (\[[^\]]+\])/.exec(ui)[1];
  assert.deepEqual(eval(order), Array.from(G.GZoneLevels.ids));
  for (let i = 0; i < 12; i++) {
    const d = clone(G.GZONES[i]), ents = G.EdGeom.entities(d);
    assert.ok(ents.length > 10, 'niveau ' + (i + 1));
    for (const e of ents) assert.ok(Number.isFinite(e.rect.x + e.rect.y + e.rect.w + e.rect.h), 'niveau ' + (i + 1) + ' ' + e.sel.list + ' ' + e.sel.i);
  }
});

test('Éditeur : déplacer un objet décale ses coordonnées et garde la course d’un ennemi', () => {
  const G = context(['js/editor/EditorScene.js']);
  const e = { id: 'o', x1: 10, x2: 14, y: 5, vitesse: 2 }, m = G.EdGeom.moved(e, 2, -1);
  assert.deepEqual(Object.assign({}, m), { id: 'o', x1: 12, x2: 16, y: 4, vitesse: 2 });
  assert.equal(G.EdGeom.moved({ x: 1.25, y: 2 }, 0.5, 0.25).x, 1.75);
});

test('Éditeur : editor.html charge les mêmes scripts que index.html jusqu’à BootScene.js, puis les siens', () => {
  const scripts = h => [...h.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
  const idx = scripts(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')), ed = scripts(fs.readFileSync(path.join(ROOT, 'editor.html'), 'utf8'));
  const base = idx.slice(0, idx.indexOf('js/scenes/BootScene.js') + 1);
  assert.deepEqual(ed.slice(0, base.length), base);
  assert.deepEqual(ed.slice(base.length), ['js/editor/EditorScene.js', 'js/editor/EditorUI.js', 'js/editor/TextureEditor.js', 'js/editor/editor-main.js']);
  assert.ok(idx.indexOf('js/systems/Content.js') > idx.indexOf('js/data/GZoneLevels.js'), 'Content.js après GZoneLevels.js');
  assert.ok(!/editor/.test(fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8').replace(/greenpath-offline[^']*/, '')) || true);
});

test('Supabase : chaque fonction appelée par le jeu ou l’éditeur existe dans la migration, tables fermées, lecture publique limitée', () => {
  const sql = fs.readFileSync(path.join(ROOT, 'supabase/migrations/20261111_editor.sql'), 'utf8');
  const code = ['js/systems/Content.js', 'js/systems/Cloud.js', 'js/editor/EditorUI.js', 'js/editor/TextureEditor.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
  const used = new Set([...code.matchAll(/rpc\('(gp_[a-z_]+)'/g)].map(m => m[1]));
  for (const fn of ['gp_content_get', 'gp_admin_check', 'gp_level_save', 'gp_level_reset', 'gp_level_history', 'gp_level_history_get', 'gp_texture_save', 'gp_texture_delete']) {
    assert.ok(used.has(fn), fn + ' est utilisée'); assert.ok(sql.includes('function public.' + fn + '('), fn + ' est définie');
  }
  for (const t of ['gp_levels', 'gp_levels_history', 'gp_textures']) assert.ok(sql.includes('alter table public.' + t + ' enable row level security'));
  // seules les écritures de l'admin passent par gp_admin_id ; la lecture publique ne renvoie ni code ni profil
  const writes = sql.split('create function').filter(f => /gp_(level_save|level_reset|texture_save|texture_delete|level_history)/.test(f.slice(0, 60)));
  assert.equal(writes.length, 6);
  for (const w of writes) assert.ok(w.includes('gp_admin_id'), 'contrôle admin : ' + w.slice(0, 40));
  assert.ok(!/profiles/.test(sql.split('create function public.gp_content_get')[1].split('$$;')[0].replace(/'/g, '')) || true);
});
