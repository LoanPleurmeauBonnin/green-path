/* Données d'import uniquement : aucun JavaScript des planches n'est exécuté. */
'use strict';
exports.palette = function (html) {
  var m = /\bPAL\s*=\s*\{([^}]*)\}/.exec(html);
  if (!m) return null;
  var out = Object.create(null);
  m[1].split(',').forEach(function (part, i, all) {
    if (!part.trim() && i === all.length - 1) return;
    var entry = /^\s*(?:([A-Za-z])|'([A-Za-z])'|"([A-Za-z])")\s*:\s*(['"])(#[0-9a-fA-F]{6})\4\s*$/.exec(part);
    if (!entry) throw new Error('Palette : données littérales attendues (lettre: couleur hexadécimale)');
    var k = entry[1] || entry[2] || entry[3];
    if (out[k]) throw new Error('Couleur en double : ' + k);
    out[k] = entry[5];
  });
  if (!Object.keys(out).length) throw new Error('Palette vide');
  return out;
};
exports.sheet = function (j) {
  if (!j || typeof j.sheet !== 'string' || !/^[a-z][a-z0-9_]{0,39}$/.test(j.sheet)) throw new Error('Nom de planche invalide');
  if (!Array.isArray(j.sprites) || j.sprites.length > 1000) throw new Error('Liste de sprites invalide');
  j.sprites.forEach(function (s) {
    if (!s || typeof s.id !== 'string' || !/^[a-z][a-z0-9_]{0,99}$/.test(s.id) || !Number.isInteger(s.w) || !Number.isInteger(s.h) ||
        s.w < 1 || s.h < 1 || s.w > 2048 || s.h > 2048) throw new Error('Sprite invalide');
  });
  return j;
};
