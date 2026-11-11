/** Web Worker de l'éditeur : lance le contrôle de faisabilité (js/systems/Solvability.js) sans figer l'interface. */
self.GP = {};
importScripts('../systems/Solvability.js');
self.onmessage = function (e) {
  var t = Date.now();
  try { self.postMessage({ ok: true, result: self.GP.Solvability.solve(e.data.doc), ms: Date.now() - t }); }
  catch (err) { self.postMessage({ ok: false, error: String(err && err.message || err) }); }
};
