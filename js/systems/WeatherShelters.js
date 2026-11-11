/** Couvertures rectangulaires en coordonnées MONDE, indépendantes des collisions/sauvegardes.
 * Chaque canal 0..1 signifie une protection ; les recouvrements prennent le maximum, jamais une somme.
 */
GP.WeatherShelters = {
  clamp: function (v) { return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0; },
  at: function (zones, x, y) {
    var out = { rain: 0, snow: 0, wind: 0, id: null };
    (zones || []).forEach(function (z) {
      if (x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h) return;
      ['rain', 'snow', 'wind'].forEach(function (k) { out[k] = Math.max(out[k], GP.WeatherShelters.clamp(z[k])); });
      out.id = z.id;
    });
    return out;
  },
  approach: function (current, target, delta, instant) {
    var k = instant ? 1 : Math.min(1, Math.max(0, delta) / GP.Tuning.shelter.transitionMs);
    function move(a, b) { return a + Math.max(-k, Math.min(k, b - a)); }
    return { rain: move(current.rain, target.rain), snow: move(current.snow, target.snow), wind: move(current.wind, target.wind), id: target.id };
  },
  /** Masque spatial : toutes les portions d'une goutte sont échantillonnées, pas seulement sa tête. */
  exposure: function (zones, x, y, snow) {
    var max = 0, field = snow ? 'snow' : 'rain';
    for (var i = 0; i < (zones || []).length; i++) {
      var z = zones[i];
      if (x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) max = Math.max(max, this.clamp(z[field]));
    }
    return 1 - max;
  }
};
