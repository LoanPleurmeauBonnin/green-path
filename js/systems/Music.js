/**
 * Music (GP.Music) — musique d'ambiance originale, composée par code en WebAudio (aucun fichier audio, aucun droit à vérifier).
 * Un pad lent (Am7 → Fmaj7 → Cmaj7 → G6) et de rares notes de pentatonique mineure avec un écho doux. Très discrète.
 * Elle démarre au premier geste du joueur (règle des navigateurs), se coupe avec SON (menu, touche M) ou avec OPTIONS → MUSIQUE,
 * et s'arrête quand l'onglet est masqué.
 */
GP.Music = (function () {
  var CHORDS = [[45, 57, 60, 64, 67], [41, 53, 60, 64, 69], [48, 55, 59, 64, 67], [43, 55, 62, 64, 71]];   // notes MIDI
  var SCALE = [69, 72, 74, 76, 79, 81];                       // la, do, ré, mi, sol, la : pentatonique mineure de la
  var CHORD_LEN = 8;                                          // secondes par accord
  var ctx = null, master = null, voices = null, started = false, timer = null, nextChord = 0, chordIdx = 0, nextNote = 0, level = 0;

  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function audible() {
    var muted = GP.Progression && GP.Progression.data && GP.Progression.muted;
    return !muted && !(GP.Settings && GP.Settings.music === false) && !document.hidden;
  }

  function build() {
    ctx = GP.Sfx.context();
    if (!ctx) return false;
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    voices = ctx.createBiquadFilter(); voices.type = 'lowpass'; voices.frequency.value = 1400; voices.connect(master);
    var echo = ctx.createDelay(1); echo.delayTime.value = 0.55;
    var fb = ctx.createGain(); fb.gain.value = 0.38;
    var wet = ctx.createGain(); wet.gain.value = 0.5;
    voices.connect(echo); echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(master);
    return true;
  }

  /** Une note de pad : deux oscillateurs légèrement désaccordés, attaque et relâchement lents. */
  function pad(m, t, len) {
    [['triangle', -5], ['sine', 5]].forEach(function (w) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = w[0]; o.frequency.value = hz(m); o.detune.value = w[1];
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.011, t + 2); g.gain.setValueAtTime(0.011, t + len - 1); g.gain.linearRampToValueAtTime(0.0001, t + len + 2.5);
      o.connect(g); g.connect(voices); o.start(t); o.stop(t + len + 2.6);
    });
  }
  /** Une note isolée, douce, qui s'éteint dans l'écho. */
  function bell(m, t) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
    o.connect(g); g.connect(voices); o.start(t); o.stop(t + 3.1);
  }

  function tick() {
    if (!ctx) return;
    var on = audible(), want = on ? 1 : 0;
    if (want !== level) { level = want; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(want, ctx.currentTime, 0.6); }   // fondu, pas de coupure sèche
    if (!on) { nextChord = Math.max(nextChord, ctx.currentTime); nextNote = Math.max(nextNote, ctx.currentTime); return; }
    if (ctx.state === 'suspended') ctx.resume();
    var now = ctx.currentTime;
    while (nextChord < now + 3) {                              // programme les accords 3 s à l'avance
      CHORDS[chordIdx].forEach(function (m) { pad(m, nextChord, CHORD_LEN); });
      chordIdx = (chordIdx + 1) % CHORDS.length; nextChord += CHORD_LEN;
    }
    while (nextNote < now + 3) {
      if (nextNote > now) bell(SCALE[Math.floor(Math.random() * SCALE.length)], nextNote);
      nextNote += 2.5 + Math.random() * 3.5;
    }
  }

  var api = {
    /** Démarre (après un geste du joueur) ; sans effet si déjà lancée ou si l'audio est indisponible. */
    start: function () {
      if (started) return;
      try { if (!build()) return; started = true; nextChord = nextNote = ctx.currentTime + 0.5; timer = setInterval(tick, 500); tick(); } catch (e) { started = false; }
    },
    /** Attend le premier geste (clic, touche, toucher) puis démarre. */
    arm: function () {
      function go() { api.start(); if (started) ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.removeEventListener(ev, go, true); }); }
      ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { window.addEventListener(ev, go, true); });
    }
  };
  api.arm();
  return api;
})();
