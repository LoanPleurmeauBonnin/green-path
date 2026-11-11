/* Copie locale cohérente du jeu. Jamais de cache des API, pseudos ou codes de sauvegarde. */
'use strict';
// Ce nom DOIT changer à chaque publication (node tools/bump-sw.cjs) : sinon les navigateurs déjà venus gardent
// indéfiniment l'ancienne copie du jeu (le service worker sert d'abord le cache).
var CACHE = 'greenpath-offline-v6-gzones-20261111-1557';
self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    var base = self.registration.scope, index = new URL('index.html', base).href;
    var response = await fetch(index, { cache: 'reload' });
    if (!response.ok) throw new Error('Installation hors ligne incomplète');
    var html = await response.text();
    var urls = [index, new URL('./', base).href, new URL('assets/fonts/PressStart2P-Regular.ttf', base).href];
    // Toutes les dépendances directes sont locales ; les images de niveau sont des scripts JS.
    var re = /(?:src|href)="([^"#]+)"/g, match;
    while ((match = re.exec(html))) {
      var url = new URL(match[1], index);
      if (url.origin === self.location.origin && url.href.indexOf(base) === 0) urls.push(url.href);
    }
    var cache = await caches.open(CACHE);
    try { await cache.addAll(Array.from(new Set(urls))); }
    catch (e) { await caches.delete(CACHE); throw e; }
    // La nouvelle copie prend la main sans attendre la fermeture de tous les onglets (la page se recharge : voir main.js).
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k.indexOf('greenpath-offline-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', function (event) {
  var req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async function () {
    var cache = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      var path = new URL('index.html', self.registration.scope);
      if (url.pathname === path.pathname || url.pathname === new URL(self.registration.scope).pathname) {
        var index = await cache.match(path.href);
        if (index) return index;
      }
    }
    return (await cache.match(req, { ignoreSearch: true })) || fetch(req);
  })());
});
