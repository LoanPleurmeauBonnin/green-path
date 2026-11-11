/**
 * ProgressionManager — règles de progression linéaire.
 * Statuts d'un lieu :
 *   'completed'  terminé (rejouable)
 *   'available'  jouable maintenant
 *   'locked'     jouable plus tard (verrouillé)
 *   'coming'     pas encore développé (« À VENIR »)
 */
GP.Progression = {
  data: null,
  justCompleted: null,

  init: function () { this.data = GP.Save.load(); },
  persist: function () { GP.Save.save(this.data); },

  status: function (i) {
    var loc = GP.LOCATIONS[i];
    if (!loc.playable) return 'coming';
    if (this.data.completed[loc.id]) return 'completed';
    return i <= this.data.unlocked ? 'available' : 'locked';
  },

  canEnter: function (i) {
    var s = this.status(i);
    return s === 'available' || s === 'completed';
  },

  completedCount: function () { return Object.keys(this.data.completed).length; },

  /** Somme des meilleures étoiles obtenues. */
  totalStars: function () {
    var c = this.data.completed;
    return Object.keys(c).reduce(function (n, id) { return n + (c[id].stars || 0); }, 0);
  },

  /** Étoiles du lieu i (0 si non terminé). */
  stars: function (i) { var c = this.data.completed[GP.LOCATIONS[i].id]; return c ? c.stars || 0 : 0; },

  /**
   * Enregistre un niveau terminé (garde le meilleur de chaque critère) et débloque la suite.
   * Un premier succès est mémorisé dans justCompleted : la carte joue alors le dévoilement du monument.
   */
  complete: function (i, pixels, rate, stars, time, deaths) {
    var loc = GP.LOCATIONS[i], prev = this.data.completed[loc.id];
    var cur = { pixels: pixels || 0, rate: rate || 1, stars: Math.min(3, Math.max(0, stars || 0)), time: time > 0 ? time : null, deaths: deaths >= 0 ? deaths : null };
    if (prev) {
      cur.pixels = Math.max(prev.pixels, cur.pixels);
      cur.rate = Math.max(prev.rate, cur.rate);
      cur.stars = Math.max(prev.stars || 0, cur.stars);
      if (prev.time && (!cur.time || prev.time < cur.time)) cur.time = prev.time;
      if (prev.deaths !== null && prev.deaths !== undefined && (cur.deaths === null || prev.deaths < cur.deaths)) cur.deaths = prev.deaths;
    } else this.justCompleted = loc.id;
    cur.stars = Math.max(cur.stars, GP.Stars.compute(cur, loc));   // cohérent avec les records par critère du bilan
    this.data.completed[loc.id] = cur;
    delete this.data.runs[loc.id];
    var next = i + 1, unlockedNew = false;
    if (next <= GP.LAST_PLAYABLE && this.data.unlocked < next) { this.data.unlocked = next; unlockedNew = true; }
    this.persist();
    if (GP.Cloud) GP.Cloud.schedulePush();   // sauvegarde en ligne si le joueur a un compte (silencieux sinon)
    return { unlockedNew: unlockedNew, allDone: i >= GP.LAST_PLAYABLE, first: !prev, stars: cur.stars };
  },

  /** Renvoie puis oublie l'id du lieu tout juste terminé (dévoilement à jouer une seule fois). */
  takeJustCompleted: function () { var id = this.justCompleted || null; this.justCompleted = null; return id; },

  setCharacter: function (cfg) { this.data.character = GP.Character.sanitize(cfg); this.persist(); },

  setCurrent: function (i) { this.data.current = i; this.persist(); },

  reset: function () { GP.Save.reset(); if (GP.Postcard) GP.Postcard.clear(); this.data = GP.Save.defaults(); this.justCompleted = null; },

  get muted() { return this.data.muted; },
  set muted(v) { this.data.muted = !!v; this.persist(); }
};
