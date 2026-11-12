/**
 * Sfx — petits bruitages synthétisés en WebAudio (aucun fichier audio).
 * Le contexte audio n'est créé qu'après un geste utilisateur.
 */
GP.Sfx = {
  ctx: null,
  tones: {
    step:    [[330, 0.05, 'square']],
    select:  [[440, 0.06, 'square'], [660, 0.08, 'square']],
    pixel:   [[988, 0.05, 'square'], [1319, 0.10, 'square']],   // pixel ramassé : deux notes aiguës, plus claires que « select »
    confirm: [[523, 0.07, 'square'], [659, 0.07, 'square'], [784, 0.12, 'square']],
    back:    [[330, 0.06, 'square'], [220, 0.09, 'square']],
    error:   [[160, 0.12, 'sawtooth']],
    unlock:  [[392, 0.08, 'square'], [523, 0.08, 'square'], [659, 0.08, 'square'], [1047, 0.18, 'square']]
  },
  /** Contexte audio partagé avec la musique (créé à la demande ; null si indisponible). */
  context: function () {
    try {
      if (!this.ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
      return this.ctx;
    } catch (e) { return null; }
  },
  play: function (name) {
    if (GP.Progression && GP.Progression.data && GP.Progression.muted) return;
    try {
      if (!this.ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; this.ctx = new AC(); }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      var t = this.ctx.currentTime;
      (this.tones[name] || []).forEach(function (n) {
        var o = GP.Sfx.ctx.createOscillator(), g = GP.Sfx.ctx.createGain();
        o.type = n[2]; o.frequency.value = n[0];
        g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1]);
        o.connect(g); g.connect(GP.Sfx.ctx.destination);
        o.start(t); o.stop(t + n[1]); t += n[1] * 0.9;
      });
    } catch (e) { /* audio indisponible : sans conséquence */ }
  }
};
