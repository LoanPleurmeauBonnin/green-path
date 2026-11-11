/**
 * Settings (GP.Settings) — réglages du joueur gardés dans le navigateur (clé « greenpath.settings »), à part de la
 * sauvegarde de progression : langue et touches. Rien n'est envoyé nulle part.
 *
 *   GP.Settings.lang                'fr' | 'en'
 *   GP.Settings.keys                { left: [code, …], right, jump, up, down } (codes de touches Phaser)
 *   GP.Settings.set({ lang: 'en' }) / GP.Settings.setKey(action, slot, code) / GP.Settings.resetKeys()
 *   GP.Settings.clearAll()          efface réglages, sauvegarde et météo mémorisée
 */
GP.Settings = (function () {
  var KEY = 'greenpath.settings', KC = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32, A: 65, D: 68, Q: 81, S: 83, W: 87, Z: 90 };
  /** Touches par défaut : 3 emplacements par action (AZERTY : Q Z ; QWERTY : A W). */
  var DEFAULT_KEYS = {
    left: [KC.LEFT, KC.Q, KC.A], right: [KC.RIGHT, KC.D, 0], jump: [KC.SPACE, KC.W, KC.Z], up: [KC.UP, 0, 0], down: [KC.DOWN, KC.S, 0]
  };
  /** Touches réservées au menu et à l'aide : on ne peut pas les affecter à une action de jeu. */
  var RESERVED = [27, 13, 72, 77, 9];   // Échap, Entrée, H, M, Tab

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function storage() { try { return window.localStorage; } catch (e) { return null; } }

  var S = {
    DEFAULT_KEYS: DEFAULT_KEYS, RESERVED: RESERVED, ACTIONS: ['left', 'right', 'jump', 'up', 'down'],
    lang: 'fr', keys: clone(DEFAULT_KEYS),

    load: function () {
      var st = storage(), d = null;
      try { d = st && JSON.parse(st.getItem(KEY)); } catch (e) { d = null; }
      // langue par défaut : français, ou anglais si le navigateur n'est pas en français
      var nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
      this.lang = d && (d.lang === 'fr' || d.lang === 'en') ? d.lang : (nav === 'fr' ? 'fr' : 'en');
      this.keys = clone(DEFAULT_KEYS);
      if (d && d.keys) this.ACTIONS.forEach(function (a) {
        var k = d.keys[a];
        if (Array.isArray(k)) S.keys[a] = [0, 1, 2].map(function (i) { var c = Math.floor(Number(k[i]) || 0); return c > 0 && c < 256 && RESERVED.indexOf(c) < 0 ? c : 0; });
        if (!S.keys[a].some(Boolean)) S.keys[a] = clone(DEFAULT_KEYS[a]);   // toujours au moins une touche
      });
      if (GP.I18n) GP.I18n.setLang(this.lang);
    },
    save: function () {
      if (GP.Prompts) GP.Prompts.refresh();
      var st = storage(); if (!st) return;
      try { st.setItem(KEY, JSON.stringify({ lang: this.lang, keys: this.keys })); } catch (e) { /* stockage plein ou bloqué */ }
    },
    set: function (o) { if (o.lang) { this.lang = o.lang; if (GP.I18n) GP.I18n.setLang(o.lang); } this.save(); },

    /** Action qui utilise déjà ce code de touche (ou null). */
    owner: function (code) {
      for (var i = 0; i < this.ACTIONS.length; i++) if (this.keys[this.ACTIONS[i]].indexOf(code) >= 0) return this.ACTIONS[i];
      return null;
    },
    /**
     * Affecte une touche à un emplacement. Renvoie { ok, reason, stolenFrom } :
     * touche réservée refusée ; si une autre action l'utilisait, elle la perd (sauf si c'était sa dernière touche).
     */
    setKey: function (action, slot, code) {
      if (RESERVED.indexOf(code) >= 0) return { ok: false, reason: 'reserved' };
      var other = this.owner(code), stolen = null;
      if (other && !(other === action && this.keys[action][slot] === code)) {
        var o = this.keys[other];
        if (o.filter(Boolean).length <= 1) return { ok: false, reason: 'last', other: other };
        o[o.indexOf(code)] = 0; stolen = other;
      }
      this.keys[action][slot] = code;
      this.save();
      return { ok: true, stolenFrom: stolen };
    },
    clearKey: function (action, slot) {
      var k = this.keys[action];
      if (k.filter(Boolean).length <= 1) return false;   // on garde au moins une touche
      k[slot] = 0; this.save(); return true;
    },
    resetKeys: function () { this.keys = clone(DEFAULT_KEYS); this.save(); },

    /** Efface tout ce que le jeu garde dans le navigateur (RGPD : droit à l'effacement). */
    clearAll: function () {
      var st = storage();
      if (st) try { ['greenpath.save', 'greenpath.save.corrupt', 'greenpath.weather', 'greenpath.iostip', KEY].forEach(function (k) { st.removeItem(k); }); } catch (e) { /* ignoré */ }
      if (GP.Cloud) GP.Cloud.clearLocal();
      if (GP.Progression) GP.Progression.reset();
      this.keys = clone(DEFAULT_KEYS);
      var nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
      this.lang = nav === 'fr' ? 'fr' : 'en';
      if (GP.I18n) GP.I18n.setLang(this.lang);
    }
  };
  return S;
})();
