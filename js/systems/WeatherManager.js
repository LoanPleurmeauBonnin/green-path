/**
 * WeatherManager (GP.Weather) — météo réelle de Nantes via Open-Meteo (sans clé d'API).
 *
 * - Requête « current » : température, code WMO, jour/nuit, vent, précipitations, nébulosité.
 * - Délai maximum 4 s (AbortController) ; résultat mis en cache 30 min dans localStorage.
 * - Hors ligne ou API indisponible : valeurs de secours (jour/nuit déduit de l'heure de l'appareil).
 * - État normalisé : { temp, code, cat, label, icon, isDay, wind, windDir, precip, cloud, source }
 *   où source vaut 'live' (réseau), 'cache' ou 'fallback' (secours), ou 'sim' (outil de test).
 * La météo est purement visuelle : elle ne modifie jamais la physique du jeu.
 */
GP.Weather = (function () {
  var CFG = GP.Config.WEATHER;

  /** Codes WMO → catégorie, libellé court (≤ 10 caractères) et icône. */
  function categorize(code) {
    code = Number(code) || 0;
    if (code === 0) return { cat: 'clear', label: 'DÉGAGÉ', icon: 'sun' };
    if (code <= 2) return { cat: 'cloudy', label: 'NUAGEUX', icon: 'part' };
    if (code === 3) return { cat: 'overcast', label: 'COUVERT', icon: 'cloud' };
    if (code === 45 || code === 48) return { cat: 'fog', label: 'BRUME', icon: 'fog' };
    if (code >= 51 && code <= 57) return { cat: 'drizzle', label: 'BRUINE', icon: 'rain' };
    if (code >= 61 && code <= 67) return { cat: 'rain', label: 'PLUIE', icon: 'rain' };
    if (code >= 80 && code <= 82) return { cat: 'rain', label: 'AVERSES', icon: 'rain' };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { cat: 'snow', label: 'NEIGE', icon: 'snow' };
    if (code >= 95) return { cat: 'storm', label: 'ORAGE', icon: 'storm' };
    return { cat: 'cloudy', label: 'NUAGEUX', icon: 'part' };
  }

  /** Construit l'état complet à partir des valeurs brutes. */
  function make(raw, source) {
    var c = categorize(raw.code);
    var isDay = !!raw.isDay;
    var icon = c.icon;
    if (!isDay && icon === 'sun') icon = 'moon';
    if (!isDay && icon === 'part') icon = 'moonpart';
    return {
      temp: Math.round(Number(raw.temp) || 0), code: Number(raw.code) || 0,
      cat: c.cat, label: c.label, icon: icon, isDay: isDay,
      wind: Math.max(0, Math.min(80, Number(raw.wind) || 0)),         // km/h, borné 0–80
      windDir: ((Number(raw.windDir) || 0) % 360 + 360) % 360,          // d'où vient le vent (°)
      precip: Math.max(0, Math.min(10, Number(raw.precip) || 0)),      // mm, borné 0–10
      cloud: Math.max(0, Math.min(100, Number(raw.cloud) || 0)),       // %
      source: source, time: raw.time || Date.now()
    };
  }

  /** Valeurs de secours : temps doux et nuageux de Nantes, jour entre 7 h et 19 h. */
  function fallback() {
    var h = new Date().getHours();
    return make({ temp: 13, code: 2, isDay: h >= 7 && h < 19, wind: 15, windDir: 250, precip: 0, cloud: 45 }, 'fallback');
  }

  /** Météos simulées (touche W, outils de test). */
  var SIMS = [
    { name: 'SOLEIL', temp: 24, code: 0, isDay: true, wind: 8, windDir: 90, precip: 0, cloud: 0 },
    { name: 'NUIT', temp: 9, code: 0, isDay: false, wind: 5, windDir: 250, precip: 0, cloud: 5 },
    { name: 'PLUIE', temp: 11, code: 63, isDay: true, wind: 18, windDir: 250, precip: 2.5, cloud: 95 },
    { name: 'NUAGES', temp: 14, code: 3, isDay: true, wind: 20, windDir: 270, precip: 0, cloud: 85 },
    { name: 'VENT', temp: 12, code: 2, isDay: true, wind: 60, windDir: 240, precip: 0.6, cloud: 60 },
    { name: 'BRUME', temp: 6, code: 45, isDay: true, wind: 2, windDir: 0, precip: 0, cloud: 100 },
    { name: 'NEIGE', temp: -1, code: 73, isDay: true, wind: 10, windDir: 30, precip: 1, cloud: 100 },
    { name: 'NUIT PLUIE', temp: 8, code: 61, isDay: false, wind: 25, windDir: 220, precip: 1.2, cloud: 100 }
  ];

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CFG.cacheKey);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || typeof d.time !== 'number') return null;
      return d;
    } catch (e) { return null; }
  }
  function writeCache(raw) {
    try { window.localStorage.setItem(CFG.cacheKey, JSON.stringify(raw)); } catch (e) { /* stockage indisponible */ }
  }

  function url() {
    return 'https://api.open-meteo.com/v1/forecast?latitude=' + CFG.lat + '&longitude=' + CFG.lon +
      '&current=temperature_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover' +
      '&timezone=' + encodeURIComponent(CFG.tz);
  }

  var api = {
    state: null,
    SIMS: SIMS,
    simIndex: -1,
    categorize: categorize,
    fallback: fallback,

    /** État courant (secours tant que rien n'est chargé). */
    get: function () { return this.state || fallback(); },

    /**
     * Charge la météo puis appelle cb(state). Ordre : cache récent → réseau → secours.
     * cb est toujours appelé une seule fois.
     */
    load: function (cb) {
      var self = this, done = false;
      function finish(st) { if (done) return; done = true; self.state = st; if (cb) cb(st); }
      if (this.simIndex >= 0) { finish(this.state); return; }
      var cached = readCache();
      if (cached && Date.now() - cached.time < CFG.cacheMin * 60000) { finish(make(cached, 'cache')); return; }
      if (!window.fetch) { finish(fallback()); return; }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); finish(fallback()); }, CFG.timeoutMs);
      fetch(url(), ctrl ? { signal: ctrl.signal } : {})
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) {
          clearTimeout(timer);
          var c = j && j.current;
          if (!c || c.temperature_2m === undefined) throw new Error('réponse incomplète');
          var raw = { temp: c.temperature_2m, code: c.weather_code, isDay: c.is_day === 1, wind: c.wind_speed_10m,
                      windDir: c.wind_direction_10m, precip: c.precipitation, cloud: c.cloud_cover, time: Date.now() };
          writeCache(raw);
          finish(make(raw, 'live'));
        })
        .catch(function () { clearTimeout(timer); finish(fallback()); });
    },

    /** Outil de test : passe à la météo simulée suivante (puis revient à la vraie météo). */
    nextSim: function () {
      this.simIndex++;
      if (this.simIndex >= SIMS.length) { this.simIndex = -1; this.state = null; return null; }
      var s = SIMS[this.simIndex];
      this.state = make(s, 'sim');
      this.state.simName = s.name;
      return this.state;
    }
  };
  return api;
})();
