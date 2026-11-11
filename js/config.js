/**
 * GREEN PATH — configuration globale.
 * Pas de modules ES (incompatibles avec file://) : tout vit dans l'espace de noms GP.
 */
window.GP = window.GP || {};

GP.Scenes = {};

GP.Config = {
  /** Zone de jeu : 270 px de haut ; la largeur s'adapte à l'écran (de 480 en 16:9 jusqu'à 640 sur un téléphone très long)
   *  pour remplir tout l'écran sans bandes. DW = largeur de conception des menus et fenêtres (480), centrés dans la zone. */
  WIDTH: 480,
  HEIGHT: 270,
  DW: 480,
  DX: 0,
  FONT: '"Press Start 2P", monospace',
  SAVE_KEY: 'greenpath.save',
  SAVE_VERSION: 1,
  /** Outils de test (météo simulée W, fin de niveau K) : actifs seulement si l'adresse contient ?dev=1. */
  DEV_TOOLS: /[?&]dev=1\b/.test((window.location && window.location.search) || ""),
  /** Météo réelle (Open-Meteo) : Nantes, centre-ville. */
  /** Supabase (comptes « pseudo seul », sauvegarde, classement). La clé « publishable » est faite pour être publique ;
   *  aucune clé secrète n'est utilisée. Voir supabase/README.md. url vide = fonctions en ligne désactivées (mode invité). */
  CLOUD: { url: 'https://jvmswcgkfgnjxccmfksd.supabase.co', key: 'sb_publishable_ji86dnYkwOQHBjqBgSQxuQ_Vc5jKeas', timeoutMs: 4000 },
  WEATHER: { lat: 47.2184, lon: -1.5536, tz: 'Europe/Paris', timeoutMs: 4000, refreshMin: 5, cacheKey: 'greenpath.weather' }
};

/** Vrai si le système demande moins d'animations (accessibilité). */
GP.reducedMotion = (function () {
  try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
})();

/** Palette unique du projet (16+ couleurs). Toute couleur du jeu vient d'ici. */
GP.PAL = {
  k: '#14182e', // encre
  d: '#2b3a55', // bleu nuit
  b: '#3b6ea5', // Loire
  l: '#7fb3d5', // reflets
  w: '#f4f7f2', // blanc
  c: '#efe3bd', // tuffeau clair
  C: '#e0cf9c', // tuffeau ombre
  t: '#d2b484', // pierre
  r: '#b5523b', // brique / ardoise chaude
  g: '#2fbf71', // LIGNE VERTE
  G: '#1e8a4f', // vert moyen
  h: '#145a3a', // vert sombre
  y: '#f4d35e', // jaune
  o: '#e8873a', // orange
  s: '#f0c8a0', // peau
  p: '#7a5c8e', // violet ardoise
  e: '#6b7280', // gris
  m: '#aab4c0', // gris clair
  P: '#8fbf6a', // parc
  Q: '#7aad5a', // parc ombre
  v: '#5f9a48', // herbe sombre (touffes)
  n: '#2f5a8c', // eau profonde
  f: '#d6eef5', // écume
  a: '#c9b27a'  // sable mouillé
};

// Largeur de la zone de jeu selon le rapport d'écran (côté long / côté court, donc identique en portrait et en paysage).
(function () {
  var w = window.innerWidth || 480, h = window.innerHeight || 270, a = Math.max(w, h) / Math.max(1, Math.min(w, h));
  GP.Config.WIDTH = Math.max(480, Math.min(640, Math.round(270 * a))) & ~1;
  GP.Config.DX = (GP.Config.WIDTH - GP.Config.DW) / 2;
})();

/** Convertit '#rrggbb' en entier Phaser. */
GP.int = function (hex) { return parseInt(hex.replace('#', ''), 16); };

/** Banc local du niveau en chantier : sauvegarde séparée et cloud désactivé avant son initialisation.
 * Ne change ni le déverrouillage normal, ni une sauvegarde personnelle, ni le site public.
 */
(function () {
  var loc = window.location || {};
  var level = /[?&]level=(jardin-des-plantes|cathedrale|chateau|feydeau|graslin|machines|chantiers|buren|hangar|pommeraye|memorial|tour-lu)(?:&|$)/.exec(loc.search || '');
  if (!GP.Config.DEV_TOOLS || !/^(localhost|127\.0\.0\.1)$/.test(loc.hostname || '') || !level) return;
  GP.Config.DEV_LEVEL = level[1];
  GP.Config.SAVE_KEY = 'greenpath.dev.' + level[1];
  GP.Config.CLOUD.url = ''; GP.Config.CLOUD.key = '';
})();
