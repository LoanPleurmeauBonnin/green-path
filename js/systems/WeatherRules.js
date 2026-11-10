/**
 * WeatherRules (GP.WeatherRules) — la météo réelle de Nantes change l'environnement de Green Path,
 * et les niveaux y réagissent. Un seul moteur pour tous les niveaux ; chaque niveau ajoute ses réactions
 * (ronces qui poussent, fleurs-plateformes, gargouilles qui crachent plus souvent…) dans sa définition.
 *
 * Règles de sûreté : chaque effet est ANNONCÉ (bandeau à l'entrée, message si la météo change en cours de route),
 * borné (on peut toujours contrer le vent, le sol glisse sans devenir de la glace), et un niveau reste
 * toujours finissable. Sans réseau ni donnée : météo neutre (aucun effet).
 *
 *   var env = GP.WeatherRules.env(state);     // { rain, storm, snow, fog, night, sun, wind, windSign, neutral, key }
 *   var phy = GP.WeatherRules.physics(env);   // { accelGround, accelAir, airPush, sight }
 *   GP.WeatherRules.announce(env, level)      // lignes de texte pour le bandeau
 */
GP.WeatherRules = {
  /** Ramène l'état météo (WeatherManager) à quelques états de jeu. */
  env: function (st) {
    var e = { rain: false, storm: false, snow: false, fog: false, night: false, sun: false, wind: 0, windSign: 0, neutral: true, key: 'neutre' };
    if (!st || st.source === 'fallback') return e;
    e.neutral = false;
    e.storm = st.cat === 'storm';
    e.rain = e.storm || st.cat === 'rain' || st.cat === 'drizzle';
    e.snow = st.cat === 'snow';
    e.fog = st.cat === 'fog';
    e.night = !st.isDay;
    e.sun = st.isDay && st.cat === 'clear';
    // le vent souffle VERS windDir + 180° ; on garde sa composante horizontale à l'écran (est = droite)
    var toward = (st.windDir + 180) * Math.PI / 180, sx = Math.sin(toward);
    e.wind = st.wind >= 20 && Math.abs(sx) > 0.3 ? st.wind : 0;
    e.windSign = e.wind ? (sx > 0 ? 1 : -1) : 0;
    e.key = e.storm ? 'orage' : e.rain ? 'pluie' : e.snow ? 'neige' : e.fog ? 'brume' : e.sun ? 'soleil' : e.wind ? 'vent' : (e.night ? 'nuit' : 'nuages');
    return e;
  },

  /** Effets communs sur le moteur (bornés). base = réglages normaux du moteur. */
  physics: function (env, base) {
    var p = { accelGround: base.accelGround, accelAir: base.accelAir, airPush: 0, sight: 0 };
    if (env.rain) p.accelGround = env.storm ? 560 : 650;          // sol mouillé : on glisse un peu en s'arrêtant
    if (env.snow) { p.accelGround = 430; p.accelAir = 520; }       // neige : plus d'inertie
    if (env.wind) p.airPush = env.windSign * Math.min(110, (env.wind - 15) * 2.5);   // en l'air seulement, toujours contrable
    if (env.fog) p.sight = 90;                                     // brume : pixels visibles de près
    else if (env.night) p.sight = 130;                             // nuit : un peu plus loin, les lanternes éclairent
    return p;
  },

  /** Phrases d'annonce (≤ 44 caractères chacune), effets communs puis réactions propres au niveau. */
  announce: function (env, L) {
    var out = [];
    if (env.neutral) return ['MÉTÉO NEUTRE (HORS LIGNE)'];
    var head = { orage: 'ORAGE SUR NANTES', pluie: 'IL PLEUT SUR NANTES', neige: 'IL NEIGE SUR NANTES', brume: 'BRUME SUR NANTES',
      soleil: 'GRAND SOLEIL SUR NANTES', vent: 'GRAND VENT SUR NANTES', nuit: 'NUIT SUR NANTES', nuages: 'CIEL NUAGEUX SUR NANTES' }[env.key];
    out.push(head);
    if (env.rain) out.push('LE SOL GLISSE');
    if (env.snow) out.push('LA NEIGE FAIT DÉRAPER');
    if (env.wind) out.push('LE VENT POUSSE LES SAUTS VERS LA ' + (env.windSign > 0 ? 'DROITE' : 'GAUCHE'));
    if (env.fog) out.push('LES PIXELS SE VOIENT DE PRÈS');
    else if (env.night) out.push('LES LANTERNES ÉCLAIRENT LA NUIT');
    var r = (L && L.weatherText) || {};
    if (env.rain && r.rain) out.push(r.rain);
    if (env.sun && r.sun) out.push(r.sun);
    if (env.wind && r.wind) out.push(r.wind);
    return out;
  }
};
