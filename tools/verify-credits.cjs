#!/usr/bin/env node
/**
 * Contrôle des crédits (docs/credits.json) : recalcule l'empreinte SHA-1 des fichiers du dépôt (police, Phaser, logo, images
 * pixélisées) et la compare à celle enregistrée. Avec --online, interroge aussi l'API de Wikimedia Commons pour chaque photo
 * (empreinte de l'original et licence) afin de détecter un changement depuis la vérification. Sans dépendance : Node 18+.
 * Usage : node tools/verify-credits.cjs [--online]
 */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'credits.json'), 'utf8'));
const sha1 = f => crypto.createHash('sha1').update(fs.readFileSync(path.join(root, f))).digest('hex');
let bad = 0, ok = 0;
function check(label, good, detail) { if (good) ok++; else { bad++; console.log('✖ ' + label + (detail ? ' — ' + detail : '')); } }

for (const e of data.elements) {
  const name = e.nom || e.lieu;
  if (e.fichier && e.sha1_fichier) check(name + ' (' + e.fichier + ')', sha1(e.fichier) === e.sha1_fichier, 'empreinte différente');
  if (e.fichier_du_jeu && e.sha1_fichier_du_jeu) check(name + ' (' + e.fichier_du_jeu + ')', sha1(e.fichier_du_jeu) === e.sha1_fichier_du_jeu, 'empreinte différente');
  if (e.type === 'image-commons') check(name + ' : licence retenue, page et auteur renseignés', !!e.licence_retenue && !!e.page && !!e.auteur);
}

async function online() {
  const imgs = data.elements.filter(e => e.type === 'image-commons');
  for (const e of imgs) {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=sha1|extmetadata&iiextmetadatafilter=LicenseShortName&titles=' + encodeURIComponent('File:' + e.titre_commons);
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'credit-check/1.0 (educational, low rate)' } });
      const j = await r.json(), ii = Object.values(j.query.pages)[0].imageinfo[0];
      check(e.lieu + ' : original Commons inchangé', ii.sha1 === e.sha1_original_commons, 'sha1 Commons ' + ii.sha1);
      check(e.lieu + ' : licence Commons inchangée', ii.extmetadata.LicenseShortName.value === e.licence_api, 'licence Commons « ' + ii.extmetadata.LicenseShortName.value + ' »');
    } catch (err) { console.log('… ' + e.lieu + ' : API injoignable (' + err.message + ')'); }
    await new Promise(r => setTimeout(r, 400));
  }
}
(async () => {
  if (process.argv.includes('--online')) await online();
  console.log(bad ? bad + ' échec(s), ' + ok + ' contrôle(s) réussi(s)' : 'Crédits : ' + ok + ' contrôle(s) réussi(s)');
  process.exit(bad ? 1 : 0);
})();
