/**
 * GREEN PATH — configuration globale.
 * Pas de modules ES (incompatibles avec file://) : tout vit dans l'espace de noms GP.
 */
window.GP = window.GP || {};

GP.Scenes = {};

GP.Config = {
  WIDTH: 480,
  HEIGHT: 270,
  FONT: '"Press Start 2P", monospace',
  SAVE_KEY: 'greenpath.save',
  SAVE_VERSION: 1,
  /** Outils de test (météo simulée W, fin de niveau K) : actifs seulement si l'adresse contient ?dev=1. */
  DEV_TOOLS: /[?&]dev=1\b/.test((window.location && window.location.search) || ""),
  /** Météo réelle (Open-Meteo) : Nantes, centre-ville. */
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

/** Convertit '#rrggbb' en entier Phaser. */
GP.int = function (hex) { return parseInt(hex.replace('#', ''), 16); };
