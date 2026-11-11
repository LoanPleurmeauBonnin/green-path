'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function context(){const c={console,location:{search:'',hostname:'localhost'},document:{},matchMedia:()=>({matches:false})};c.window=c;vm.createContext(c);
for(const f of ['js/config.js','js/data/tuning.js','js/systems/PixelArt.js','js/data/locations.js','js/data/levels.js','js/data/gzones.js','js/data/GZoneLevels.js','js/systems/SaveManager.js','js/systems/LevelMechanics.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);return c.GP;}
test('GZones : douze parcours et ordre explicite, Château conservé',()=>{const G=context();assert.equal(G.LOCATIONS.length,12);assert.equal(G.LAST_PLAYABLE,11);assert.ok(G.LOCATIONS.every(l=>l.playable&&G.LEVELS[l.level]));assert.equal(G.LOCATIONS[9].id,'pommeraye');assert.equal(G.LOCATIONS[10].id,'memorial');assert.equal(G.LEVELS.chateau,G.LevelPrototypes.chateau);});
test('GZones : collecte, checkpoints, dimensions et sortie issus des documents',()=>{const G=context();for(let i=0;i<12;i++){if(i===2)continue;const d=G.GZONES[i],L=G.LEVELS[G.LOCATIONS[i].level];assert.equal(L.width,d.largeur);assert.equal(L.rows,d.hauteur);assert.equal(L.pixels.length,d.pixels.length);assert.equal(L.checks.length,d.checkpoints.length);assert.ok(L.exit);assert.ok(L.revision);}});
test('Boss : seuls 6/9/12, phases et condition de victoire sans contournement par collecte',()=>{const G=context();const boss=G.LOCATIONS.filter(l=>G.LEVELS[l.level].boss);assert.deepEqual(Array.from(boss.map(l=>l.id)),['machines','hangar','tour-lu']);for(const l of boss){const L=G.LEVELS[l.level];assert.equal(L.boss.goals.length,L.boss.phases);assert.equal(G.LevelMechanics.canFinish(L,true,true,false),false);assert.equal(G.LevelMechanics.canFinish(L,true,true,true),true);assert.equal(G.LevelMechanics.canFinish(L,false,true,true),false);}});
test('Sauvegarde : permutation des seuls indices Pommeraye/Mémorial une fois, résultats conservés',()=>{const G=context();assert.equal(G.Save.sanitize({current:9}).current,10);assert.equal(G.Save.sanitize({current:10}).current,9);assert.equal(G.Save.sanitize({current:11}).current,11);assert.equal(G.Save.sanitize({route:'gzones-1',current:9}).current,9);const d=G.Save.sanitize({completed:{cathedrale:{rate:1,pixels:22,stars:3,time:88}}});assert.equal(d.completed.cathedrale.stars,3);assert.equal(d.v,1);});
test('Boss : reprise bornée sur objectifs prédéfinis, pas de coordonnées issues du stockage',()=>{const G=context(),L=G.LEVELS.machines,signature=G.Save.runSignature(L);let d=G.Save.sanitize({runs:{machines:{signature,taken:[0],boss:{phase:2,x:Infinity}}}});assert.deepEqual(JSON.parse(JSON.stringify(d.runs.machines.boss)),{phase:2});d=G.Save.sanitize({runs:{machines:{signature,taken:[],boss:{phase:999}}}});assert.equal(d.runs.machines.boss,undefined);});

test('Niveau 1 (refonte) : ordre d’apprentissage, lanternes espacées, pixels et dangers posés sur une surface', () => {
  const G = require('../tools/balance.cjs').load(true), d = G.GZONES[0];
  assert.equal(d.pixels.length, 15);
  assert.equal(d.checkpoints.map(c => c.x).join(' '), '42 85 115');
  // au plus 45 tuiles entre départ, lanternes et arrivée
  const stops = [d.spawn.x].concat(d.checkpoints.map(c => c.x), [d.arrivee.declencheur.x]);
  for (let i = 1; i < stops.length; i++) assert.ok(stops[i] - stops[i - 1] <= 45, 'écart ' + stops[i - 1] + '→' + stops[i]);
  // aucun pixel sur le point de départ
  assert.ok(!d.pixels.some(p => p.x === d.spawn.x && p.y === d.spawn.y));
  // première rencontre de chaque danger dans l'ordre voulu : ronces, eau, oiseau, jet
  const first = k => Math.min(...d.dangers.filter(k).map(h => h.x));
  const ronce = first(h => h.kind === 'mortel'), eau = first(h => h.kind === 'eau_mortelle'), jet = first(h => h.kind === 'cyclique');
  const oiseau = Math.min(...d.ennemis.filter(e => e.type === 'patrouille_horizontale').map(e => e.x1));
  assert.ok(ronce < eau && eau < oiseau && oiseau < jet, [ronce, eau, oiseau, jet].join(' '));
  // le premier bassin est couvert par un pont, le premier jet est au sec
  assert.ok(d.plateformes.some(p => p.type === 'pont' && p.x <= eau && p.x + p.w >= eau + 3));
  assert.ok(!d.dangers.some(h => h.kind === 'eau_mortelle' && h.x <= jet && h.x + (h.w || 1) > jet));
  // un panneau précède chaque première rencontre
  [ronce, oiseau, jet].forEach(x => assert.ok(d.signes.some(s => s.x < x && x - s.x <= 4), 'panneau avant x=' + x));
  // chaque oiseau vole 1,625 tuile au-dessus d'une surface : debout touché, accroupi sauf
  const tops = d.plateformes.filter(p => p.type === 'masse');
  d.ennemis.filter(e => e.esquive === 'accroupi').forEach(e => {
    const top = Math.min(...tops.filter(p => p.x < e.x2 && p.x + p.w > e.x1 + 1).map(p => p.y));
    assert.equal(e.y, top - 1.625, e.id);
  });
});
