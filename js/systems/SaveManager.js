/**
 * SaveManager — persistance localStorage robuste.
 * - Tolère l'absence/le blocage de localStorage (repli en mémoire).
 * - Valide et assainit toute donnée lue ; une sauvegarde corrompue est mise de côté
 *   (clé « .corrupt ») puis remplacée par une sauvegarde neuve.
 */
GP.Save = {
  _mem: null,
  _storage: undefined,

  storage: function () {
    if (this._storage !== undefined) return this._storage;
    try {
      var s = window.localStorage, k = '__gp_probe';
      s.setItem(k, '1'); s.removeItem(k);
      this._storage = s;
    } catch (e) { this._storage = null; }
    return this._storage;
  },

  defaults: function () {
    return { v: GP.Config.SAVE_VERSION, completed: {}, runs: {}, unlocked: 0, current: 0, muted: false, character: null, introSeen: false, updated: 0 };
  },

  /** Retourne toujours un objet valide. */
  load: function () {
    var raw = null, st = this.storage();
    try { raw = this._mem !== null ? this._mem : (st ? st.getItem(GP.Config.SAVE_KEY) : null); } catch (e) { raw = this._mem; }
    if (!raw) return this.defaults();
    try {
      return this.sanitize(JSON.parse(raw));
    } catch (e) {
      try { if (st) st.setItem(GP.Config.SAVE_KEY + '.corrupt', raw); } catch (e2) {}
      return this.defaults();
    }
  },

  sanitize: function (d) {
    var out = this.defaults();
    if (!d || typeof d !== 'object') return out;
    function num(v, min, max, fallback) {
      var n = Number(v);
      return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
    }
    var ids = Object.create(null), locs = GP.LOCATIONS;
    locs.forEach(function (l, i) { ids[l.id] = i; });
    var maxDone = -1;
    if (d.completed && typeof d.completed === 'object') {
      Object.keys(d.completed).forEach(function (id) {
        if (!(id in ids) || !locs[ids[id]].playable) return;
        var c = d.completed[id] || {};
        var pixels = Math.floor(num(c.pixels, 0, 1000, 0));
        var rate = num(c.rate, 0, 1, 0);
        // Anciennes sauvegardes (avant les étoiles) : un niveau terminé vaut au moins 1 étoile.
        var stars = c.stars === undefined ? 1 : Math.floor(num(c.stars, 0, 3, 0));
        var time = num(c.time, 0, 36000, 0) || null;
        var deaths = c.deaths === undefined ? (c.hits === undefined ? null : c.hits) : c.deaths;
        deaths = deaths === null ? null : Math.floor(num(deaths, 0, 100000, 0));
        out.completed[id] = { pixels: pixels, rate: rate, stars: stars, time: time, deaths: deaths };
        maxDone = Math.max(maxDone, ids[id]);
      });
    }
    // Reprises locales uniquement : aucune coordonnée arbitraire issue du stockage.
    locs.forEach(function (l) {
      var L = GP.LEVELS && GP.LEVELS[l.level], r = d.runs && d.runs[l.id];
      if (!l.playable || !L || !r || r.signature !== GP.Save.runSignature(L) || !Array.isArray(r.taken)) return;
      var taken = r.taken.filter(function (v, i, a) { return Number.isInteger(v) && v >= 0 && v < L.pixels.length && a.indexOf(v) === i; });
      out.runs[l.id] = { signature: r.signature, taken: taken,
        checkpoint: Math.floor(num(r.checkpoint, -1, L.checks.length - 1, -1)),
        time: num(r.time, 0, 36000000, 0), deaths: Math.floor(num(r.deaths, 0, 100000, 0)) };
    });
    var unlocked = Math.floor(num(d.unlocked, 0, GP.LAST_PLAYABLE, 0));
    unlocked = Math.max(unlocked, Math.min(GP.LAST_PLAYABLE, maxDone + 1));
    out.unlocked = Math.min(GP.LAST_PLAYABLE, Math.max(0, unlocked));
    var cur = Math.floor(num(d.current, 0, locs.length - 1, 0));
    out.current = Math.min(locs.length - 1, Math.max(0, cur));
    out.muted = !!d.muted;
    out.character = (d.character && typeof d.character === 'object' && GP.Character) ? GP.Character.sanitize(d.character) : null;
    // introduction déjà vue, ou ancienne sauvegarde d'un joueur qui a déjà commencé
    out.introSeen = !!d.introSeen || !!out.character || Object.keys(out.completed).length > 0;
    out.updated = num(d.updated, 0, Date.now(), 0);
    return out;
  },

  runSignature: function (L) {
    return L.width + ':' + L.pixels.map(function (p) { return p.x + ',' + p.y; }).join(';') + ':' +
      L.checks.map(function (p) { return p.x + ',' + p.y; }).join(';');
  },

  save: function (data) {
    data.updated = Date.now();
    var raw = JSON.stringify(data), st = this.storage();
    this._mem = raw;
    try { if (st) st.setItem(GP.Config.SAVE_KEY, raw); return true; } catch (e) { return false; }
  },

  /** Vrai si une sauvegarde contenant une progression existe. */
  hasProgress: function () {
    var d = this.load();
    return Object.keys(d.completed).length > 0 || d.current > 0;
  },

  reset: function () {
    this._mem = null;
    try { var st = this.storage(); if (st) st.removeItem(GP.Config.SAVE_KEY); } catch (e) {}
  }
};
