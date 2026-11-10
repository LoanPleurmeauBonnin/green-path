/**
 * Cloud (GP.Cloud) — comptes « pseudo seul », sauvegarde et classement (Supabase, voir supabase/README.md).
 *
 * Le jeu reste entièrement jouable sans compte et hors ligne : le mode invité (progression dans le navigateur) est la
 * valeur par défaut, et chaque appel réseau a un délai de 4 s et échoue en silence.
 *   - Compte = un pseudo + un code secret de 20 caractères généré ici ; le serveur ne garde que le haché du code.
 *   - La progression et l'avatar sont envoyés après chaque niveau (tentative différée, reprise au retour du réseau).
 *   - Le classement est mis en cache : hors ligne, la dernière version vue est affichée (« classement indisponible »).
 * Réponses des méthodes : Promise<{ ok, error?, ... }>, error = 'offline' | 'server' | code renvoyé par le serveur.
 */
GP.Cloud = (function () {
  var KEY = 'greenpath.cloud', SBKEY = 'greenpath.scoreboard', CFG = GP.Config.CLOUD;
  var ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // sans 0 O 1 I : lisible à la main
  var st = { pseudo: null, code: null, choice: null, dirty: false }, timer = null;

  function store() { try { return window.localStorage; } catch (e) { return null; } }
  function load() {
    var s = store(), d = null;
    st = { pseudo: null, code: null, choice: null, dirty: false };
    try { d = s && JSON.parse(s.getItem(KEY)); } catch (e) { d = null; }
    if (d && typeof d === 'object') {
      st.pseudo = typeof d.pseudo === 'string' ? d.pseudo : null;
      st.code = typeof d.code === 'string' && d.code.length >= 20 ? d.code : null;
      st.choice = d.choice === 'account' || d.choice === 'guest' ? d.choice : null;
      st.dirty = !!d.dirty;
      if (!st.pseudo || !st.code) { st.pseudo = st.code = null; if (st.choice === 'account') st.choice = null; }
    }
  }
  function save() {
    var s = store(); if (!s) return;
    try { s.setItem(KEY, JSON.stringify(st)); } catch (e) { /* stockage plein ou bloqué */ }
  }

  /** Appel d'une fonction du serveur (RPC) avec délai ; ne lève jamais d'exception. */
  function rpc(name, body) {
    if (!CFG || !CFG.url || !window.fetch) return Promise.resolve({ ok: false, error: 'offline' });
    var ctrl = window.AbortController ? new AbortController() : null, done = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); fin({ ok: false, error: 'offline' }); }, CFG.timeoutMs || 4000);
      function fin(r) { if (done) return; done = true; clearTimeout(timer); resolve(r); }
      fetch(CFG.url + '/rest/v1/rpc/' + name, {
        method: 'POST', headers: { apikey: CFG.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)); })
        .then(function (j) { fin({ ok: true, data: j }); })
        .catch(function () { fin({ ok: false, error: 'offline' }); });
    });
  }

  /** Code secret : 20 caractères tirés avec le générateur aléatoire sécurisé du navigateur. */
  function makeCode() {
    var c = window.crypto || window.msCrypto;
    if (!c || !c.getRandomValues) return null;
    var b = new Uint8Array(20), out = '';
    c.getRandomValues(b);
    for (var i = 0; i < 20; i++) out += ALPHABET.charAt(b[i] & 31);
    return out;
  }
  function normCode(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function groupCode(c) { return c ? c.replace(/(.{5})(?=.)/g, '$1-') : ''; }

  /** Progression locale → liste pour le serveur. */
  function payload() {
    var d = GP.Progression.data, list = [];
    Object.keys(d.completed).forEach(function (id) {
      var c = d.completed[id];
      list.push({ level: id, stars: c.stars || 0, pixels: c.pixels || 0, best_time_ms: c.time ? Math.round(c.time * 1000) : null, deaths: c.deaths === null || c.deaths === undefined ? null : c.deaths });
    });
    return list;
  }

  /** Fusionne la sauvegarde du serveur dans la progression locale (on garde toujours le meilleur de chaque critère). */
  function merge(remote) {
    var d = GP.Progression.data;
    (remote.progress || []).forEach(function (g) {
      var loc = GP.LOCATIONS.filter(function (l) { return l.id === g.level && l.playable; })[0];
      if (!loc) return;
      var cur = d.completed[g.level], t = g.best_time_ms ? g.best_time_ms / 1000 : null;
      var m = { pixels: Math.max(cur ? cur.pixels : 0, g.pixels || 0), rate: 1, stars: Math.max(cur ? cur.stars || 0 : 0, g.stars || 0),
        time: cur && cur.time && (!t || cur.time < t) ? cur.time : t,
        deaths: cur && cur.deaths !== null && cur.deaths !== undefined && (g.deaths === null || g.deaths === undefined || cur.deaths < g.deaths) ? cur.deaths : (g.deaths === undefined ? null : g.deaths) };
      d.completed[g.level] = m;
    });
    if (remote.avatar && typeof remote.avatar === 'object') d.character = GP.Character.sanitize(remote.avatar);
    d.introSeen = true;
    GP.Progression.data = GP.Save.sanitize(d);   // recalcule les étapes débloquées
    GP.Progression.persist();
  }

  var api = {
    get pseudo() { return st.pseudo; },
    get code() { return st.code; },
    get codeGrouped() { return groupCode(st.code); },
    get isAccount() { return !!(st.pseudo && st.code); },
    get choice() { return st.choice; },
    get enabled() { return !!(CFG && CFG.url); },
    groupCode: groupCode, normCode: normCode,

    init: function () {
      load();
      var self = this;
      window.addEventListener('online', function () { if (st.dirty) self.push(); });
      if (this.isAccount && st.dirty) setTimeout(function () { self.push(); }, 3000);
    },

    /** Le joueur a choisi de jouer en invité (on ne redemande pas ; il peut créer un pseudo plus tard dans OPTIONS). */
    chooseGuest: function () { st.choice = 'guest'; save(); },

    /** À demander une fois : après le premier niveau terminé, si rien n'a été choisi. */
    shouldAsk: function () { return this.enabled && !st.choice && GP.Progression.completedCount() >= 1; },

    /** Crée le compte : { ok, pseudo, code } ou { ok:false, error: pseudo_taken | pseudo_invalid | offline | no_crypto }. */
    register: function (pseudo) {
      var code = makeCode();
      if (!code) return Promise.resolve({ ok: false, error: 'no_crypto' });
      return rpc('gp_register', { p_pseudo: pseudo, p_code: code }).then(function (r) {
        if (!r.ok) return r;
        if (!r.data.ok) return { ok: false, error: r.data.error };
        st.pseudo = r.data.pseudo; st.code = code; st.choice = 'account'; st.dirty = true; save();
        api.push();
        return { ok: true, pseudo: st.pseudo, code: code };
      });
    },

    /** Retrouve un compte avec son pseudo et son code (sur un autre appareil) ; fusionne la progression. */
    restore: function (pseudo, code) {
      var c = normCode(code);
      return rpc('gp_login', { p_pseudo: pseudo, p_code: c }).then(function (r) {
        if (!r.ok) return r;
        if (!r.data.ok) return { ok: false, error: r.data.error };
        st.pseudo = r.data.pseudo; st.code = c; st.choice = 'account'; st.dirty = true; save();
        merge(r.data);
        api.push();
        return { ok: true, pseudo: st.pseudo };
      });
    },

    /** Envoie progression et avatar (différé de 1,5 s pour regrouper). Silencieux si pas de compte ou hors ligne. */
    schedulePush: function () {
      if (!this.isAccount) return;
      st.dirty = true; save();
      clearTimeout(timer); timer = setTimeout(function () { api.push(); }, 1500);
    },
    push: function () {
      if (!this.isAccount) return Promise.resolve({ ok: false, error: 'no_account' });
      return rpc('gp_save', { p_code: st.code, p_avatar: GP.Progression.data.character, p_progress: payload() }).then(function (r) {
        if (r.ok && r.data.ok) { st.dirty = false; save(); api.lastSync = Date.now(); return { ok: true }; }
        if (r.ok && r.data.error === 'not_found') return { ok: false, error: 'not_found' };   // compte supprimé côté serveur
        return { ok: false, error: r.ok ? r.data.error : r.error };
      });
    },

    /** Oublie le compte sur cet appareil (la sauvegarde reste en ligne). */
    forget: function () { st.pseudo = st.code = null; st.choice = 'guest'; st.dirty = false; save(); },

    /** Supprime le compte en ligne (pseudo, avatar, progression) puis l'oublie ici. */
    deleteAccount: function () {
      if (!this.isAccount) return Promise.resolve({ ok: true });
      return rpc('gp_delete', { p_code: st.code }).then(function (r) {
        if (!r.ok) return r;
        api.forget(); return { ok: true };
      });
    },

    /** Classement : { ok, rows, source: 'live' | 'cache', age } ou { ok:false } sans rien en cache. */
    scoreboard: function (limit) {
      return rpc('gp_scoreboard', { p_limit: limit || 20 }).then(function (r) {
        var s = store();
        if (r.ok && Array.isArray(r.data)) {
          try { if (s) s.setItem(SBKEY, JSON.stringify({ time: Date.now(), rows: r.data })); } catch (e) { /* ignoré */ }
          return { ok: true, rows: r.data, source: 'live', age: 0 };
        }
        var c = null; try { c = s && JSON.parse(s.getItem(SBKEY)); } catch (e) { c = null; }
        if (c && Array.isArray(c.rows)) return { ok: true, rows: c.rows, source: 'cache', age: Date.now() - c.time };
        return { ok: false, error: 'offline' };
      });
    },
    /** Efface ce que le jeu garde de ses échanges en ligne dans ce navigateur. */
    clearLocal: function () { st = { pseudo: null, code: null, choice: null, dirty: false }; var s = store(); try { if (s) { s.removeItem(KEY); s.removeItem(SBKEY); } } catch (e) { /* ignoré */ } },
    rpc: rpc
  };
  return api;
})();
