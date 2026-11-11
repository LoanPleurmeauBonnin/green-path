/* Cadre de test responsive : vraies dimensions CSS internes, pas une émulation de téléphone. */
(function () {
  var q = new URLSearchParams(location.search), f = document.querySelector('iframe');
  var w = Math.max(320, Math.min(2560, Number(q.get('w')) || 1920));
  var h = Math.max(270, Math.min(1440, Number(q.get('h')) || 1080));
  f.width = w; f.height = h; f.src = '../index.html?dev=1';
  function fit() { f.style.transform = 'scale(' + Math.min(innerWidth / w, innerHeight / h) + ')'; }
  window.addEventListener('resize', fit); fit();
})();
