/** Change le nom du cache hors ligne de sw.js : à lancer AVANT chaque publication (npx vercel --prod).
 * Sans cela, les navigateurs déjà venus continuent de servir l'ancienne copie du jeu (cache d'abord).
 * node tools/bump-sw.cjs
 */
'use strict';
const fs = require('node:fs'), path = require('node:path');
const file = path.join(__dirname, '..', 'sw.js');
const src = fs.readFileSync(file, 'utf8');
const d = new Date(), pad = n => String(n).padStart(2, '0');
const stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
const next = src.replace(/var CACHE = 'greenpath-offline-v(\d+)-gzones-[0-9-]+';/, (m, v) => "var CACHE = 'greenpath-offline-v" + v + '-gzones-' + stamp + "';");
if (next === src) { console.error('Nom de cache introuvable dans sw.js'); process.exit(1); }
fs.writeFileSync(file, next);
console.log('Cache hors ligne : ' + /var CACHE = '([^']+)'/.exec(next)[1]);
