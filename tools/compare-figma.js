/**
 * Contrôle objectif du personnage : compare le rendu de la configuration par défaut (pose de repos)
 * à la grille 15×19 relevée dans Figma (nœud 6:19). Lancer : node tools/compare-figma.js
 * Deux couleurs sont jugées identiques si chaque canal diffère d'au plus 4 (arrondis d'export Figma).
 */
global.window = global;
global.GP = {};
require('../js/config.js');
GP.PixelArt = { canvas: function () { throw new Error('canvas non disponible'); } };
require('../js/systems/CharacterSprite.js');

// Grille Figma : M = fond (transparent)
var PAL = { A: '#170e3b', B: '#2e5153', C: '#39417f', D: '#438a6a', E: '#536ab6', F: '#5a2539', G: '#894648',
  H: '#c17958', I: '#c27757', J: '#e8b485', K: '#e8b683', L: '#fcd0a1', M: null, N: '#fffdfe' };
var FIGMA = [
  'MMMMAAAAAAAAMMM', 'MMMAGGGFAFGGAMM', 'MMAGIIGGFAFGIAM', 'MAGIIGGFFFFFGIA', 'AGHGGFFIIIIIFGA',
  'AGGFFIIKKKKKIFA', 'AFFIIKAAKKAAKAA', 'AFKIKKNAKKNAKAM', 'MAKIKLNALLNALAM', 'MMAAIKKKKKKKIAM',
  'MMMAIIIIIIIIAMM', 'MMADDDDDDBDDDAM', 'MADDDDDDDBDDDDA', 'MADDBDDDDBDDBDA', 'MAJJCCCCCCCCCJA',
  'MMAACEEEEEEECAM', 'MMMACECCCCCEAMM', 'MMMACEAAAACEAMM', 'MMMAAAAMMAAAAMM'
];
function rgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function same(a, b) {
  if (!a || !b) return !a && !b;
  var x = rgb(a), y = rgb(b);
  return Math.abs(x[0] - y[0]) <= 4 && Math.abs(x[1] - y[1]) <= 4 && Math.abs(x[2] - y[2]) <= 4;
}
var g = GP.Character.compose(GP.Character.defaultConfig(), 'idle0'), ok = 0, total = 0, diff = [];
for (var y = 0; y < 19; y++) {
  var line = '';
  for (var x = 0; x < 15; x++) {
    total++;
    var want = PAL[FIGMA[y][x]], got = g[y][x];
    if (same(want, got)) { ok++; line += '.'; } else { line += 'X'; diff.push([y, x, FIGMA[y][x], got]); }
  }
  console.log(String(y).padStart(2) + ' ' + line);
}
console.log('Identiques : ' + ok + '/' + total + ' = ' + (100 * ok / total).toFixed(1) + ' %');
diff.forEach(function (d) { console.log('  ligne ' + d[0] + ' col ' + d[1] + ' : Figma ' + d[2] + ' (' + PAL[d[2]] + '), jeu ' + d[3]); });
process.exit(ok / total >= 0.95 ? 0 : 1);
