/** Contrôleur de faisabilité des niveaux : le joueur peut-il aller du départ à l'arrivée, et ramasser chaque pixel ?
 * node tools/solvability.cjs [numéro de niveau]
 *
 * Méthode (skill « level-design ») : mesurer le vrai joueur, puis vérifier l'accessibilité au lieu de la supposer.
 * Le joueur est simulé avec les constantes du jeu (gravité, saut, vitesse, accélérations, demi-gravité d'apex, saut
 * variable) contre la géométrie des niveaux, au pixel : course, chute, sauts de toutes les sortes (maintenu ou court,
 * direction changée en vol), accroche et hissage sur un rebord, accroupi sous un plafond bas, colonnes à grimper, anneaux,
 * parasols. Les plateformes mobiles sont des surfaces posées à plusieurs positions de leur trajet (approximation
 * généreuse : « atteignable » veut dire « atteignable si le timing est bon »). Les courants d'air du niveau 12 ne sont
 * pas modélisés. Pièges et eau sont mortels ; les pièges cycliques et les ennemis sont ignorés (timing).
 * Résultat : un niveau « bloqué » l'est vraiment ; un niveau « faisable » l'est sous les hypothèses ci-dessus.
 */
'use strict';
const fs = require('node:fs'), path = require('node:path');
const { load } = require('./balance.cjs');

/** Le contrôleur partagé (js/systems/Solvability.js) : même code que l'éditeur. */
const { solve, world } = require('../js/systems/Solvability.js');
module.exports = { solve, world };

if (require.main === module) {
  const G_ = load(true), only = Number(process.argv[2]) || 0;
  console.log('Niveau                          arrivée  pixels hors d\'atteinte        points de contrôle  x max');
  G_.GZONES.forEach(d => {
    if (only && d.num !== only) return;
    if (d.num === 3) { console.log(String(d.num).padStart(2), d.nom.slice(0, 28).padEnd(28), '(Château : ancien moteur, non contrôlé)'); return; }
    const L = G_.LEVELS[G_.GZoneLevels.ids[d.num - 1]]; d.roofs = (L && L.roofs) || [];
    const r = solve(d);
    console.log(String(d.num).padStart(2), d.nom.slice(0, 28).padEnd(28), (r.exit ? 'OUI' : 'NON').padEnd(8), (r.missing.length + '/' + d.pixels.length + ' ' + r.missing.slice(0, 6).join(' ')).padEnd(34), (r.lights.length ? 'hors : ' + r.lights.join(' ') : 'ok').padEnd(18), r.farthest + '/' + d.largeur);
  });
}
