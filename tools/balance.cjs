/** Mesure de la courbe de difficulté des douze niveaux (obstacles par 100 tuiles) et contrôle des obstacles ajoutés.
 * node tools/balance.cjs          affiche le tableau « avant / après » (avant = documents importés, après = équilibrage)
 * Sans dépendance. L'indice est un repère de conception, pas une mesure de difficulté humaine : il ne remplace pas un
 * test avec de vrais joueurs. Pondération : obstacle isolé 1 · ennemi 1,5 · jet cyclique 1,5 · fosse 0,7 · plateforme
 * mobile 0,3 · dalle fragile ou de mémoire 0,5 · anneau 0,5 (alternant 1,5).
 */
'use strict';
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const root = path.join(__dirname, '..');

/** Charge le jeu comme les tests (sans Phaser) ; avec ou sans l'équilibrage appliqué. */
function load(withBalance) {
  const c = { console, location: { search: '', hostname: 'localhost' }, document: {}, matchMedia: () => ({ matches: false }) };
  c.window = c; vm.createContext(c);
  const files = ['js/config.js', 'js/data/tuning.js', 'js/systems/PixelArt.js', 'js/data/locations.js', 'js/data/levels.js', 'js/data/gzones.js'];
  if (withBalance) {   // sprites (mesure des appuis) et niveaux redessinés avant GZoneLevels, comme dans index.html
    ['palette', 'commun', 'carte', 'ciel', 'signes', 'jardin', 'cathedrale', 'chateau', 'centre', 'ile', 'bouffay', 'retouches', 'mario'].forEach(s => files.push('js/data/sprites/' + s + '.js'));
    files.push('js/systems/PixelArt.js', 'js/data/LevelGen.js', 'js/data/Redesigns.js', 'js/data/GZoneLevels.js');
  }
  files.forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), c));
  return c.GP;
}

/** Regroupe des tuiles contiguës d'une même rangée en segments. */
function spans(list) {
  const s = list.map(h => ({ x: h.x, y: h.y, w: h.w || 1 })).sort((a, b) => a.y - b.y || a.x - b.x), out = [];
  let last = null;
  for (const h of s) {
    if (last && last.y === h.y && h.x <= last.x1 + 1) last.x1 = Math.max(last.x1, h.x + h.w - 1);
    else { last = { x0: h.x, x1: h.x + h.w - 1, y: h.y }; out.push(last); }
  }
  return out;
}

function metrics(d) {
  const dg = d.dangers || [], mort = spans(dg.filter(x => x.kind === 'mortel'));
  const discrete = mort.filter(s => s.x1 - s.x0 + 1 < 3).length;
  let pits = mort.filter(s => s.x1 - s.x0 + 1 >= 3).length;
  const water = spans(dg.filter(x => x.kind === 'eau_mortelle')).map(s => s.x0 + '-' + s.x1);
  pits += new Set(water.concat((d.eau || []).map(e => e.x + '-' + (e.x + e.w - 1)))).size;
  const cyc = dg.filter(x => x.kind === 'cyclique').length;
  const en = (d.ennemis || []).filter(e => !e.inoffensif && e.type !== 'ambiance').length;
  const mob = (d.plateformes || []).filter(p => p.mecanique && ['chariot', 'va-et-vient', 'ascenseur', 'oscillation', 'rotation', 'flotteur'].includes(p.mecanique.type)).length +
    (d.mobiles || []).filter(m => m.kind !== 'colonne').length;
  const frag = (d.plateformes || []).filter(p => p.mecanique && (p.mecanique.fragile || (p.mecanique.type === 'dalle_memoire' && p.mecanique.solide))).length +
    (d.mobiles || []).filter(m => m.fragile_s).length;
  const rings = (d.anneaux || []).reduce((n, r) => n + (r.couleur === 'alternant' ? 1.5 : 0.5), 0);
  const S = discrete + 1.5 * cyc + 1.5 * en + 0.7 * pits + 0.3 * mob + 0.5 * frag + rings;
  return { discrete, pits, cyc, en, mob, frag, rings, S, per100: S / d.largeur * 100 };
}

/** Un obstacle ajouté doit rester franchissable : sol plat sur ±3 cases, 4 cases libres au-dessus, loin du reste. */
function checkAddition(d, h) {
  const errors = [], H = d.hauteur;
  const cells = new Set(), tops = [];
  for (const p of d.plateformes) {
    if (p.type === 'masse' && !p.pilier && !p.fond) {
      const bottom = p.fill_to !== undefined ? p.fill_to : (p.to !== undefined ? p.to : H);
      for (let i = 0; i < (p.w || 1); i++) for (let y = Math.floor(p.y); y < Math.ceil(bottom); y++) cells.add((p.x + i) + ',' + y);
      tops.push({ x0: p.x, x1: p.x + (p.w || 1) - 1, y: p.y });
    } else if (p.type === 'pont' && !p.mecanique) tops.push({ x0: p.x, x1: p.x + Math.ceil(p.w || 1) - 1, y: p.y });
  }
  const topAt = x => tops.filter(t => x >= t.x0 && x <= t.x1).reduce((m, t) => (m === null || t.y < m ? t.y : m), null);
  const ground = h.y + 1;
  for (let dx = -3; dx <= 3; dx++) if (topAt(h.x + dx) !== ground) errors.push('sol non plat en x=' + (h.x + dx));
  for (let dx = -2; dx <= 2; dx++) for (let y = h.y - 3; y <= h.y; y++) if (cells.has((h.x + dx) + ',' + y)) errors.push('tête dans un bloc en ' + (h.x + dx) + ',' + y);
  const near = (x, y, r, what) => { if (Math.abs(x - h.x) <= r && Math.abs(y - h.y) <= 3) errors.push('trop près de ' + what + ' (' + x + ',' + y + ')'); };
  for (const o of d.dangers) if (o !== h && o.kind !== 'eau_mortelle') for (let i = 0; i < (o.w || 1); i++) near(o.x + i, o.y, 4, 'un danger');
  for (const c of d.checkpoints) near(c.x, c.y, 3, 'un point de contrôle');
  for (const p of d.pixels) near(p.x, p.y, 1, 'un pixel');
  for (const p of d.plateformes) if (p.type === 'pad' && h.x >= p.x - 2 && h.x <= p.x + (p.w || 1) + 1 && Math.abs((p.y || 0) - ground) <= 3) errors.push('trop près d\'un appui ' + p.id);
  for (const r of d.anneaux || []) if (Math.abs((r.cx === undefined ? r.x : r.cx) - h.x) <= 4) errors.push('trop près d\'un anneau ' + r.id);
  if (Math.abs(d.spawn.x - h.x) <= 4 || Math.abs(d.arrivee.declencheur.x - h.x) <= 5) errors.push('trop près du départ ou de l\'arrivée');
  return errors;
}

module.exports = { load, metrics, checkAddition, spans };

if (require.main === module) {
  const before = load(false), after = load(true);
  console.log('Niveau                          avant S/100t   après S/100t   obstacles isolés   ennemis   jets   fosses');
  after.GZONES.forEach((d, i) => {
    const a = metrics(before.GZONES[i]), b = metrics(d);
    console.log(String(d.num).padStart(2), d.nom.slice(0, 28).padEnd(28), a.per100.toFixed(1).padStart(8), b.per100.toFixed(1).padStart(14),
      String(b.discrete).padStart(14), String(b.en).padStart(10), String(b.cyc).padStart(6), String(b.pits).padStart(7));
  });
  let bad = 0;
  Object.keys(after.GZoneLevels.balance).forEach(n => (after.GZoneLevels.balance[n].ajouter || []).forEach(h => {
    const d = after.GZONES[n - 1], e = checkAddition(d, d.dangers.find(x => x.x === h.x && x.y === h.y && x.sprite === h.sprite));
    if (e.length) { bad++; console.log('✖ niveau ' + n + ' obstacle (' + h.x + ',' + h.y + ') : ' + e.join(' ; ')); }
  }));
  console.log(bad ? bad + ' obstacle(s) ajouté(s) à revoir' : 'Obstacles ajoutés : tous sur sol plat et dégagé.');
}
