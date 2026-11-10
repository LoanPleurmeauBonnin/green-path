/**
 * Controls (GP.Controls) et Pad (GP.Pad) — entrées du joueur : clavier (touches réaffectables, GP.Settings),
 * boutons tactiles et manette.
 *
 *   var ctl = GP.Controls.attach(scene);       // crée les touches de la scène (à faire dans create)
 *   var c = ctl.read(scene.touch);             // { left, right, up, down, jump } : vrai tant que la commande est tenue
 *
 * Manette (API Gamepad du navigateur, rien à installer) : croix ou stick gauche = bouger, A = sauter / valider,
 * B = retour, Start = pause. Dans les menus, elle émet les mêmes événements que le clavier
 * (keydown-UP, -DOWN, -LEFT, -RIGHT, -ENTER, -SPACE, -ESC) : les écrans n'ont rien à gérer en plus.
 */
GP.Controls = {
  attach: function (scene) {
    var K = scene.input.keyboard, keys = {};
    GP.Settings.ACTIONS.forEach(function (a) {
      keys[a] = GP.Settings.keys[a].filter(Boolean).map(function (code) { return K.addKey(code, true); });
    });
    return {
      keys: keys,
      read: function (touch) {
        var out = {}, pad = GP.Pad.state;
        GP.Settings.ACTIONS.forEach(function (a) {
          out[a] = keys[a].some(function (k) { return k.isDown; }) || !!(touch && touch[a]) || !!pad[a];
        });
        return out;
      }
    };
  }
};

GP.Pad = (function () {
  var DEAD = 0.45, state = { left: false, right: false, up: false, down: false, jump: false }, prev = {}, held = {}, started = false;
  var KEYCODE = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ENTER: 13, SPACE: 32, ESC: 27 };

  function pads() { try { return (navigator.getGamepads && navigator.getGamepads()) || []; } catch (e) { return []; } }
  function first() { var l = pads(); for (var i = 0; i < l.length; i++) if (l[i] && l[i].connected) return l[i]; return null; }
  function btn(p, i) { return !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.6)); }

  /** Émet un événement clavier synthétique sur les scènes actives (menus, fenêtres, aide). */
  function emit(name) {
    if (!GP.game || GP.Pad.capture) return;
    GP.game.scene.getScenes(true).forEach(function (sc) {
      if (sc.input && sc.input.keyboard) sc.input.keyboard.emit('keydown-' + name, { keyCode: KEYCODE[name] });
    });
  }

  function poll(time) {
    var p = first(), now = {};
    if (!p) { state.left = state.right = state.up = state.down = state.jump = false; GP.Pad.connected = false; return; }
    GP.Pad.connected = true;
    var ax = p.axes[0] || 0, ay = p.axes[1] || 0;
    now.LEFT = ax < -DEAD || btn(p, 14); now.RIGHT = ax > DEAD || btn(p, 15);
    now.UP = ay < -DEAD || btn(p, 12); now.DOWN = ay > DEAD || btn(p, 13);
    now.A = btn(p, 0); now.B = btn(p, 1); now.START = btn(p, 9);
    state.left = now.LEFT; state.right = now.RIGHT; state.up = now.UP; state.down = now.DOWN; state.jump = now.A;
    // événements de menu : à l'appui, puis répétition (0,4 s puis toutes les 0,13 s) pour les directions
    ['UP', 'DOWN', 'LEFT', 'RIGHT'].forEach(function (d) {
      if (now[d] && !prev[d]) { emit(d); held[d] = time + 400; }
      else if (now[d] && time > held[d]) { emit(d); held[d] = time + 130; }
    });
    if (now.A && !prev.A) { emit('ENTER'); emit('SPACE'); }
    if (now.B && !prev.B) emit('ESC');
    if (now.START && !prev.START) emit('ESC');
    prev = now;
  }

  return {
    state: state, connected: false, capture: false,
    /** À appeler une fois (main.js) : branche la lecture de la manette sur la boucle du jeu. */
    start: function (game) {
      if (started) return; started = true;
      game.events.on('prestep', function (time) { poll(time); });
      window.addEventListener('gamepadconnected', function () { GP.Pad.connected = true; });
    }
  };
})();
