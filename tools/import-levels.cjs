/** Compile les documents JSON fournis, jamais du code. Pas de dépendance npm.
 * node tools/import-levels.cjs /chemin/vers/Niveaux
 * Le fichier produit est un asset généré ; les modifications de conception vivent dans GZoneLevels.js.
 */
'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const input = process.argv[2];
if (!input) throw new Error('Dossier des douze JSON requis');
const files = fs.readdirSync(input).filter(n => /^niveau_\d\d_[a-z_]+\.json$/.test(n)).sort();
if (files.length !== 12) throw new Error('Douze documents attendus');
const docs = files.map((name, i) => {
  const raw = fs.readFileSync(path.join(input, name), 'utf8'), d = JSON.parse(raw);
  if (d.num !== i + 1 || d.tile !== 16 || !['niveau/2', 'niveau/3'].includes(d.format) ||
    !Number.isInteger(d.largeur) || d.largeur < 50 || d.largeur > 500 || !Number.isInteger(d.hauteur) || d.hauteur < 17 || d.hauteur > 40 ||
    !Array.isArray(d.plateformes) || !Array.isArray(d.pixels) || !d.spawn || !d.arrivee) throw new Error('Document invalide : ' + name);
  d.sourceFile = name; d.sourceHash = crypto.createHash('sha256').update(raw).digest('hex');
  return d;
});
const target = path.join(__dirname, '..', 'js/data/gzones.js');
fs.writeFileSync(target, '/** Généré par tools/import-levels.cjs depuis les 12 pièces jointes. Ne pas éditer à la main. */\nGP.GZONES = ' + JSON.stringify(docs, null, 2) + ';\n');
console.log('Douze GZones compilées : ' + target);
