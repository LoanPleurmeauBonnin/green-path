/* Copie locale cohérente du jeu. Jamais de cache des API, pseudos ou codes de sauvegarde. */
'use strict';
// Le réseau passe d'abord (voir « fetch » plus bas) : en ligne, c'est toujours la dernière version. Changer ce nom à chaque
// publication (node tools/bump-sw.cjs) purge en plus l'ancienne copie hors ligne et remplace le service worker installé.
var CACHE = 'greenpath-offline-v6-gzones-20261112-1031';
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
// Réseau d'abord : en ligne, le jeu affiche TOUJOURS la dernière version publiée (jamais une ancienne copie qui traîne) et
// la copie locale est rafraîchie au passage. Hors ligne, ou si le réseau met plus de 4 s : la copie locale.
function withTimeout(promise, ms) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () { reject(new Error('lent')); }, ms);
    promise.then(function (r) { clearTimeout(timer); resolve(r); }, function (e) { clearTimeout(timer); reject(e); });
  });
}
self.addEventListener('fetch', function (event) {
  var req = event.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async function () {
    var cache = await caches.open(CACHE), key = req, target = req;
    if (req.mode === 'navigate') {
      var path = new URL('index.html', self.registration.scope);
      if (url.pathname === path.pathname || url.pathname === new URL(self.registration.scope).pathname) { key = path.href; target = path.href; }
    }
    var cached = await cache.match(key, { ignoreSearch: true });
    var network = fetch(target, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) cache.put(key, res.clone()).catch(function () { /* stockage plein : on sert quand même */ });
      return res;
    });
    network.catch(function () { /* évite une erreur non gérée quand la copie locale a déjà répondu */ });
    try { return await withTimeout(network, cached ? 4000 : 20000); }
    catch (e) { return cached || network; }
  })());
});
