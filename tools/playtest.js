/** Relevé volontaire local. Rien n'est chargé/enregistré par défaut dans le jeu public.
 * Console, niveau ouvert : var session = GP.Playtest.start(scene, { id:'P01', kind:'human' });
 * session.note('...'); session.stop(); session.download();
 * Un log d'événements ne constitue JAMAIS une observation humaine en soi.
 */
GP.Playtest = {
  start: function (scene, options) {
    if (!GP.Config.DEV_TOOLS || !scene || scene.scene.key !== 'Game') throw new Error('Ouvrir un niveau en mode dev pour le relevé local');
    options = options || {};
    var report = { v: 1, id: /^[A-Za-z0-9_-]{1,20}$/.test(options.id || '') ? options.id : 'session',
      kind: options.kind === 'human' ? 'human-declared' : 'simulation', level: scene.loc.id,
      tuning: GP.Tuning.version, parameters: Object.assign({ gravity: GP.Tuning.worldGravity }, scene.TUNE),
      parTime: scene.loc.parTime, events: [], samples: [], notes: [], signals: [], zoneTimes: {}, status: 'recording' };
    var active = true, elapsed = 0, sampleMs = 0, stillMs = 0, signalled = false, x = scene.player.x, count = scene.pc.count;
    function event(data) {
      if (!active) return;
      report.events.push(Object.assign({ atMs: scene.time_ms }, data));
      if (data.type === 'finish') stop('finished');
    }
    function update(time, delta) {
      if (!active || scene.paused || scene.finished || scene.dying || scene.introMs > 0) return;
      var dt = Math.min(delta, 50), zone = Math.floor(scene.player.x / 320);
      elapsed += dt; sampleMs += dt; report.zoneTimes[zone] = (report.zoneTimes[zone] || 0) + dt;
      if (Math.abs(scene.player.x - x) < 16 && count === scene.pc.count) stillMs += dt;
      else { x = scene.player.x; count = scene.pc.count; stillMs = 0; signalled = false; }
      if (stillMs >= 15000 && !signalled) {
        report.signals.push({ atMs: scene.time_ms, type: 'immobility-15s', zone: zone, interpretation: 'à examiner, pas un blocage humain prouvé' }); signalled = true;
      }
      if (sampleMs < 250) return; sampleMs = 0;
      report.samples.push({ atMs: scene.time_ms, x: Math.round(scene.player.x), y: Math.round(scene.player.y), zone: zone,
        remaining: scene.pc.total - scene.pc.count, deaths: scene.deaths, device: GP.Prompts.device,
        weather: scene.weather ? { source: scene.weather.source, code: scene.weather.code, wind: scene.weather.wind } : null,
        shelter: Object.assign({}, scene.shelter) });
    }
    function stop(status) {
      if (!active) return report; active = false; report.status = status || 'stopped'; report.activeMs = Math.round(elapsed);
      report.levelTimeMs = scene.time_ms; report.remaining = scene.pc.total - scene.pc.count; report.deaths = scene.deaths;
      scene.events.off('update', update); scene.events.off('playtest-event', event); scene.events.off('shutdown', shutdown);
      return report;
    }
    function shutdown() { stop('scene-stopped'); }
    scene.events.on('update', update); scene.events.on('playtest-event', event); scene.events.once('shutdown', shutdown);
    return {
      report: report, stop: stop,
      note: function (text) { report.notes.push({ atMs: scene.time_ms, origin: 'observer-entered', text: String(text).slice(0, 1000) }); },
      download: function () {
        var link = document.createElement('a'), url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
        link.download = 'greenpath-playtest-' + report.id + '.json'; link.href = url; link.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }
    };
  }
};
