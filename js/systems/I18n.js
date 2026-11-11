/**
 * I18n (GP.I18n, raccourcis GP.t et GP.L) — français (langue source) et anglais.
 *
 * Principe : le code garde ses textes en FRANÇAIS. Tout texte Phaser passe par GP.I18n.tr() (Text.setText est
 * enveloppé) : en anglais, on cherche la phrase exacte dans le dictionnaire (js/data/lang/en.js), puis des modèles
 * à nombres (« PIXELS 3/32 »), ligne par ligne. Une phrase absente reste en français : jamais de texte vide ni de plantage,
 * et un nouveau texte ajouté dans un niveau fonctionne tout de suite (traduction à ajouter après).
 *   GP.t('TEXTE FR')   traduit une phrase (à utiliser avant de couper ou mesurer un texte)
 *   GP.L('intro')      texte long par identifiant (introduction, confidentialité) dans la langue courante
 *   GP.I18n.setLang('en')   change la langue (les écrans déjà affichés se refont en relançant la scène)
 */
GP.I18n = (function () {
  var lang = 'fr', cache = {}, missing = {};

  function dict() { return (GP.EN && GP.EN.words) || {}; }

  function lookup(core) {
    var d = dict(), v = d[core];
    if (v !== undefined) return v;
    var pats = (GP.EN && GP.EN.patterns) || [];
    for (var i = 0; i < pats.length; i++) { var m = pats[i][0].exec(core); if (m) return pats[i][1](m, tr); }
    if (core.indexOf('\n') >= 0) return core.split('\n').map(function (l) { return l.trim() ? tr(l) : l; }).join('\n');
    return undefined;
  }

  /** Traduit une phrase (en français, renvoyée telle quelle). Garde les espaces autour. */
  function tr(s) {
    if (lang === 'fr' || typeof s !== 'string' || !s) return s;
    var c = cache[s];
    if (c !== undefined) return c;
    var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), out = s;
    if (m[2]) {
      var v = lookup(m[2]);
      if (v === undefined) { missing[m[2]] = true; v = m[2]; }
      out = m[1] + v + m[3];
    }
    if (Object.keys(cache).length < 4000) cache[s] = out;
    return out;
  }

  /** Ajoute au dictionnaire les notices et résumés des lieux (clés = texte français actuel de js/data/locations.js). */
  function buildPlaces() {
    var places = GP.EN && GP.EN.places, w = dict();
    if (!places || !GP.LOCATIONS) return;
    GP.LOCATIONS.forEach(function (l) {
      var p = places[l.id]; if (!p) return;
      if (p.notice && l.notice) w[l.notice] = p.notice;
      if (p.grammar && l.grammar) w[l.grammar] = p.grammar;
      if (p.summary && l.summary) l.summary.forEach(function (para, i) { if (p.summary[i]) w[para] = p.summary[i]; });
    });
  }

  var api = {
    tr: tr,
    get lang() { return lang; },
    setLang: function (l) { lang = (l === 'en') ? 'en' : 'fr'; cache = {}; document.documentElement.lang = lang; if (lang === 'en') buildPlaces(); },
    /** Phrases rencontrées sans traduction (aide au développement : GP.I18n.missing()). */
    missing: function () { return Object.keys(missing); },
    /** Texte long par identifiant. */
    L: function (id) {
      var t = (lang === 'en' && GP.EN && GP.EN.texts && GP.EN.texts[id]) || (GP.FR && GP.FR[id]);
      return t === undefined ? id : t;
    },
    /** Noms de touches (GAUCHE, ESPACE…) : le nom français est traduit comme n'importe quelle phrase. */
    keyName: function (code) {
      var K = Phaser.Input.Keyboard.KeyCodes, names = { 13: 'ENTRÉE', 27: 'ÉCHAP', 37: 'GAUCHE', 38: 'HAUT', 39: 'DROITE', 40: 'BAS', 32: 'ESPACE', 16: 'MAJ', 17: 'CTRL', 18: 'ALT', 8: 'EFFACER', 46: 'SUPPR', 9: 'TAB' };
      if (!code) return '-';
      if (names[code]) return tr(names[code]);
      for (var k in K) if (K[k] === code) return k.length > 1 && /^(ZERO|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE)$/.test(k) ? String(['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'].indexOf(k)) : k;
      return 'K' + code;
    }
  };

  // Phaser.GameObjects.Text : toutes les chaînes affichées (y compris à la création) passent par tr().
  if (window.Phaser && Phaser.GameObjects && Phaser.GameObjects.Text) {
    var orig = Phaser.GameObjects.Text.prototype.setText;
    Phaser.GameObjects.Text.prototype.setText = function (v) {
      if (typeof v === 'string') v = tr(v);
      else if (Array.isArray(v)) v = v.map(function (x) { return typeof x === 'string' ? tr(x) : x; });
      return orig.call(this, v);
    };
  }
  GP.t = tr; GP.L = api.L;
  return api;
})();
