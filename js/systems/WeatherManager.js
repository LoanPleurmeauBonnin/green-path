/**
 * WeatherManager (GP.Weather) — météo réelle de Nantes via Open-Meteo (sans clé d'API).
 *
 * - Requête « current » : température, code WMO, jour/nuit, vent, précipitations, nébulosité.
 * - En direct : demandée au démarrage puis toutes les 5 min (délai maximum 4 s, AbortController).
 * - Hors ligne ou API indisponible : la dernière donnée reçue (gardée dans localStorage) reste affichée ;
 *   valeurs neutres de secours seulement si rien n'a jamais été reçu (jour/nuit déduit de l'heure de l'appareil).
 * - État normalisé : { temp, code, cat, label, icon, isDay, wind, windDir, precip, cloud, source }
 *   où source vaut 'live' (réseau), 'stale' (hors ligne, dernière donnée), 'fallback' (secours) ou 'sim' (test).
 * WeatherRules traduit cet état validé en règles de jeu bornées.
 */
GP.Weather = (function () {
  var CFG = GP.Config.WEATHER;

  function valid(raw) {
    return !!raw && ['temp', 'code', 'wind', 'windDir', 'precip', 'cloud'].every(function (k) {
      return typeof raw[k] === 'number' && Number.isFinite(raw[k]);
    }) && typeof raw.isDay === 'boolean' && Number.isInteger(raw.code) && raw.code >= 0 && raw.code <= 99;
  }

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
      temp: Math.round(Math.max(-60, Math.min(60, raw.temp))), code: raw.code,
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
    { name: 'NUIT PLUIE', temp: 8, code: 61, isDay: false, wind: 25, windDir: 220, precip: 1.2, cloud: 100 },
    { name: 'ORAGE', temp: 10, code: 95, isDay: true, wind: 65, windDir: 270, precip: 6, cloud: 100 }
  ];

  function readCache() {
    try {
      var raw = window.localStorage.getItem(CFG.cacheKey);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!valid(d) || !Number.isFinite(d.time) || d.time <= 0 || d.time > Date.now() + 60000) return null;
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
    get: function () {
      if (this.state) return this.state;
      var last = readCache();                        // en attendant le réseau : la dernière météo reçue
      return last ? make(last, 'stale') : fallback();
    },

    /**
     * Météo « en direct » : demandée au réseau au démarrage puis toutes les 5 minutes (refreshMin).
     * Si le réseau ne répond pas, on garde la DERNIÈRE donnée reçue, quel que soit son âge (source 'stale',
     * affichée « HORS LIGNE · IL Y A N MIN ») ; valeurs neutres de secours seulement si rien n'a jamais été reçu.
     * load(cb) : renvoie l'état courant s'il a moins de refreshMin minutes, sinon interroge le réseau. cb appelé une fois.
     */
    load: function (cb) {
      var self = this;
      if (this.simIndex >= 0) { if (cb) cb(this.state); return; }
      this.startPolling();
      if (this.state && (this.state.source === 'live') && Date.now() - this.state.time < CFG.refreshMin * 60000) { if (cb) cb(this.state); return; }
      this.refresh(cb);
    },

    /** Interroge Open-Meteo (délai 4 s), met à jour l'état et prévient les abonnés. */
    refresh: function (cb) {
      if (this.pending) { if (cb) this.pending.push(cb); return; }
      this.pending = cb ? [cb] : [];
      var self = this, done = false;
      function finish(st) {
        if (done) return; done = true;
        var callbacks = self.pending; self.pending = null;
        if (self.simIndex >= 0) st = self.state;   // une météo de test reste affichée
        self.state = st;
        callbacks.forEach(function (fn) { try { fn(st); } catch (e) { /* scène fermée */ } });
        self.notify(st);
      }
      function offline() {
        var last = readCache();
        finish(last ? make(last, 'stale') : fallback());
      }
      if (!window.fetch) { offline(); return; }
      var ctrl = window.AbortController ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); offline(); }, CFG.timeoutMs);
      fetch(url(), ctrl ? { signal: ctrl.signal } : {})
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function (j) {
          if (done) return;   // une réponse après le délai ne doit pas écraser le cache
          clearTimeout(timer);
          var c = j && j.current;
          if (!c || c.temperature_2m === undefined) throw new Error('réponse incomplète');
          var raw = { temp: c.temperature_2m, code: c.weather_code, isDay: c.is_day === 1, wind: c.wind_speed_10m,
                      windDir: c.wind_direction_10m, precip: c.precipitation, cloud: c.cloud_cover, time: Date.now() };
          if (!valid(raw) || (c.is_day !== 0 && c.is_day !== 1)) throw new Error('réponse invalide');
          writeCache(raw);
          finish(make(raw, 'live'));
        })
        .catch(function () { clearTimeout(timer); offline(); });
    },

    /** Abonnement aux changements de météo (rafraîchissement automatique). Renvoie la fonction de désabonnement. */
    listeners: [],
    subscribe: function (fn) {
      var self = this; this.listeners.push(fn);
      return function () { self.listeners = self.listeners.filter(function (f) { return f !== fn; }); };
    },
    notify: function (st) { this.listeners.slice().forEach(function (f) { try { f(st); } catch (e) { /* une scène fermée */ } }); },
    startPolling: function () {
      var self = this;
      if (this.timer) return;
      this.timer = setInterval(function () { if (self.simIndex < 0) self.refresh(); }, CFG.refreshMin * 60000);
      // retour du réseau : on redemande tout de suite
      window.addEventListener('online', function () { if (self.simIndex < 0) self.refresh(); });
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
