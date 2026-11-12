#!/usr/bin/env node
/**
 * Audit des niveaux joués (sans navigateur, Node 18+) : charge les données de niveau dans un bac à sable (vm), puis pour chaque
 * étape, dans l'ordre du jeu, compte les obstacles, rappelle les capacités débloquées (GP.Tuning.player.unlock) et vérifie :
 *   erreurs  : départ ou pixel dans un bloc plein, lanterne hors sol, mur marqué avant son niveau d'introduction, aucun pixel ni lanterne ;
 *   alertes  : trou plus large qu'un saut sans appui (plateforme, bateau, mobile…) ni dash, écart de plus de 45 tuiles entre lanternes.
 * Usage : node tools/audit-niveaux.cjs [id-du-niveau]    (code de sortie 1 s'il y a une erreur ; les alertes ne bloquent pas)
 */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const list = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1]);
const sb = { console, Phaser: {}, setTimeout, clearTimeout };
sb.window = sb; sb.self = sb; sb.location = { search: '', hostname: 'localhost', protocol: 'http:' };
sb.navigator = {}; sb.document = { getElementById() { return null; }, addEventListener() {}, querySelector() { return null; } };
vm.createContext(sb);
// données seulement : ni moteur Phaser, ni scènes, ni images (les modules d'interface sont ignorés)
for (const s of list.slice(0, list.indexOf('js/data/levels-ville.js') + 1)) {
  if (/vendor|scenes\/|assets\/locations|Music\.js/.test(s)) continue;
  try { vm.runInContext(fs.readFileSync(path.join(root, s), 'utf8'), sb, { filename: s }); } catch (e) { console.log('(ignoré : ' + s + ' — ' + e.message.slice(0, 70) + ')'); }
}
const run = code => vm.runInContext(code, sb);
const locs = run('GP.LOCATIONS.map(function (l) { return { id: l.id, level: l.level || l.id }; })');
const U = run('GP.Tuning.player.unlock'), JUMP = 4;
const only = process.argv[2];
let errors = 0, warns = 0;
const rows = [];

locs.concat([{ id: 'ligne-verte', level: 'ligne-verte' }]).forEach((loc, i) => {
  if (only && loc.id !== only) return;
  const L = run('GP.LEVELS[' + JSON.stringify(loc.level) + ']');
  if (!L) { console.log('✖ ' + loc.id + ' : niveau absent'); errors++; return; }
  const no = loc.id === 'ligne-verte' ? 99 : i + 1, W = L.width, R = L.rows;
  const cell = (x, y) => (x < 0 || x >= W || y < 0 || y >= R) ? 0 : L.grid[y * W + x];
  const solid = (x, y) => { const v = cell(x, y); return v && v !== 3; };
  const err = m => { errors++; console.log('✖ ' + String(no).padStart(2) + ' ' + loc.id + ' : ' + m); };
  const warn = m => { warns++; console.log('! ' + String(no).padStart(2) + ' ' + loc.id + ' : ' + m); };
  const dash = no >= U.dash, wall = no >= U.wall;

  const gridless = !L.grid.some(v => v);   // niveau construit depuis un document GZone : la grille est vide, les contrôles de sol ne s'y appliquent pas
  if (gridless) console.log('  (' + no + ' ' + loc.id + ' : niveau GZone, contrôles de sol ignorés)');
  if (!gridless && solid(L.startX, L.startRow)) err('départ dans un bloc plein');
  (L.pixels || []).forEach(p => { if (!gridless && solid(p.x, p.y)) err('pixel dans un bloc plein (' + p.x + ',' + p.y + ')'); });
  (L.checks || []).forEach(c => { if (!gridless && (solid(c.x, c.y) || !solid(c.x, c.y + 1) && cell(c.x, c.y + 1) !== 3)) err('lanterne qui ne repose pas sur le sol (x ' + c.x + ')'); });
  if (!(L.pixels || []).length) err('aucun pixel');
  if (!(L.checks || []).length) err('aucune lanterne (point de contrôle)');
  if ((L.walls || []).length && !wall) err('murs marqués avant leur niveau d’introduction (n° ' + U.wall + ')');
  if (L.abilities && L.abilities.dash === false && no >= U.dash) warn('dash coupé par le niveau');

  // lanternes : écart maximal
  const cx = [0].concat((L.checks || []).map(c => c.x).sort((a, b) => a - b), [W]);
  let gap = 0; for (let k = 1; k < cx.length; k++) gap = Math.max(gap, cx[k] - cx[k - 1]);
  if (gap > 45) warn('écart de ' + gap + ' tuiles sans lanterne');

  // trous : colonnes sans sol ; franchissables avec un appui (plateforme, bateau, mobile, ressort…) ou, au besoin, le dash
  const aids = [].concat((L.plats || []).map(p => [p.x, p.x + p.w]), (L.boats || []).map(b => [b.x, b.x + b.w]), (L.movers || []).map(m => [m.x - m.dx, m.x + m.w + m.dx]),
    (L.springs || []).map(s => [s.x - 1, s.x + 2]), (L.cplats || []).map(c => [c.x, c.x + c.w]), (L.crumbles || []).map(c => [c.x, c.x + c.w]), (L.carts || []).map(c => [c.x, c.x + c.w + (c.dx || 0)]),
    (L.cranes || []).map(c => [c.x - 2, c.x + 2 + (c.dx || 0)]), (L.climbs || []).map(c => [c.x, c.x + 1]), (L.walls || []).map(w => [w.x, w.x + 1]), (L.rings || []).map(r => [r.x - 1, r.x + 1]), (L.drafts || []).map(d => [d.x0, d.x1]),
    (L.elephants || []).map(e => [e.west, e.east]), (L.glasses || []).map(g => [g.x, g.x + g.w]), (L.aligns || []).map(a => [a.bridge.x, a.bridge.x + a.bridge.w]));
  let x = 0;
  while (!gridless && x < W) {
    if (L.top(x) < R) { x++; continue; }
    let e = x; while (e < W && L.top(e) >= R) e++;
    const len = e - x, helped = aids.some(a => a[1] >= x && a[0] <= e);
    if (!helped && len > (dash ? JUMP + 2 : JUMP)) warn('trou de ' + len + ' tuiles sans appui (x ' + x + '→' + (e - 1) + ')');
    x = e;
  }

  const n = k => (L[k] || []).length;
  const danger = ['thorns', 'spikes', 'patrols', 'muses', 'molds', 'gargoyles', 'slits', 'gates', 'barrels', 'gardes', 'fallers', 'jets', 'beams', 'hangers', 'peaux', 'regimes', 'elephants', 'tides', 'liars']
    .reduce((a, k) => a + n(k), 0);
  rows.push([String(no).padStart(2), loc.id.padEnd(19), String(W).padStart(4), String(n('pixels')).padStart(3), String(n('checks')).padStart(3), String(danger).padStart(3),
    String(n('walls')).padStart(2), String(n('spikes')).padStart(2), dash ? 'dash' : '    ', wall ? 'mur' : '   ', Object.keys(L.abilities || {}).filter(k => L.abilities[k]).join(',')]);
});
console.log('\n n° niveau              larg px  lan dng mur pic  dash mur  capacités du niveau');
rows.forEach(r => console.log(r.join(' ')));
console.log(errors ? '\nAudit : ' + errors + ' erreur(s), ' + warns + ' alerte(s)' : '\nAudit : aucune erreur, ' + warns + ' alerte(s)');
process.exit(errors ? 1 : 0);
