/**
 * Stars — objectif de fin de niveau : 0 à 3 étoiles.
 * Règle (à ajuster au playtest) : chaque critère rempli rapporte une étoile.
 *   ★   niveau terminé (image reconstruite à 100 %)
 *   ★   sans mourir (aucune ronce, aucune chute)
 *   ★   temps inférieur ou égal au temps cible du lieu (loc.parTime, en secondes)
 * Sans image complète : 0 étoile (le niveau n'est pas terminé).
 * Fonction pure : aucune dépendance au moteur. Appelée par ResultScene à la fin d'un niveau.
 */
GP.Stars = {
  MAX: 3,

  /** result = { rate: 0..1, deaths: nombre de morts (ronces, chutes), time: secondes } (hits accepté aussi) */
  compute: function (result, loc) {
    var r = result || {};
    if ((Number(r.rate) || 0) < 1) return 0;
    var stars = 1;
    if ((Number(r.deaths !== undefined ? r.deaths : r.hits) || 0) === 0) stars++;
    var par = loc && Number(loc.parTime);
    if (par > 0 && Number(r.time) > 0 && Number(r.time) <= par) stars++;
    return stars;
  },

  /** Total d'étoiles possibles sur les niveaux jouables. */
  maxTotal: function () { return (GP.LAST_PLAYABLE + 1) * this.MAX; }
};
