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
          var device = GP.Prompts && GP.Prompts.device;
          out[a] = !GP.Pad.capture && ((device !== 'gamepad' && keys[a].some(function (k) { return k.isDown; })) ||
            (device !== 'gamepad' && !!(touch && touch[a])) || (!!pad[a] && (!device || device === 'gamepad')));
        });
        return out;
      }
    };
  }
};

GP.Pad = (function () {
  var ENTER = 0.65, RELEASE = 0.35, state = { left: false, right: false, up: false, down: false, jump: false, dash: false }, prev = {}, held = {}, started = false;
  var KEYCODE = { UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39, ENTER: 13, SPACE: 32, ESC: 27, H: 72, M: 77, R: 82, PAGEUP: 33, PAGEDOWN: 34 };

  function pads() { try { return (navigator.getGamepads && navigator.getGamepads()) || []; } catch (e) { return []; } }
  function first() { var l = pads(); for (var i = 0; i < l.length; i++) if (l[i] && l[i].connected) return l[i]; return null; }
  function btn(p, i) { return !!(p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.6)); }

  /** Émet un événement clavier synthétique sur les scènes actives (menus, fenêtres, aide). */
  function emit(name) {
    if (!GP.game || GP.Pad.capture || (GP.Prompts && GP.Prompts.device !== 'gamepad')) return;
    GP.game.scene.getScenes(true).forEach(function (sc) {
      if (sc.input && sc.input.keyboard) sc.input.keyboard.emit('keydown-' + name, { keyCode: KEYCODE[name], fromGamepad: true });
    });
  }

  function poll(time) {
    var p = first(), now = {};
    if (!p) {
      state.left = state.right = state.up = state.down = state.jump = false; prev = {}; held = {}; GP.Pad.connected = false;
      if (GP.Prompts) GP.Prompts.padDisconnected(); return;
    }
    GP.Pad.connected = true;
    var B = GP.Prompts ? GP.Prompts.BUTTONS : { confirm: 0, back: 1, secondary: 2, help: 3, previous: 4, next: 5, pause: 9, up: 12, down: 13, left: 14, right: 15 };
    var ax = p.axes[0] || 0, ay = p.axes[1] || 0;
    now.LEFT = ax < -(prev.LEFT ? RELEASE : ENTER) || btn(p, B.left); now.RIGHT = ax > (prev.RIGHT ? RELEASE : ENTER) || btn(p, B.right);
    now.UP = ay < -(prev.UP ? RELEASE : ENTER) || btn(p, B.up); now.DOWN = ay > (prev.DOWN ? RELEASE : ENTER) || btn(p, B.down);
    now.A = btn(p, B.confirm); now.B = btn(p, B.back); now.X = btn(p, B.secondary); now.Y = btn(p, B.help);
    now.LB = btn(p, B.previous); now.RB = btn(p, B.next); now.START = btn(p, B.pause);
    var buttons = p.buttons.map(function (_, i) { return btn(p, i); });
    var intent = Object.keys(now).some(function (k) { return now[k] && !prev[k]; }) || buttons.some(function (v, i) { return v && !(prev.buttons && prev.buttons[i]); });
    if (intent && GP.Prompts) GP.Prompts.padActivity(p);
    if (GP.Pad.capture) {
      state.left = state.right = state.up = state.down = state.jump = state.dash = false;
      if (GP.Account && GP.Account.isOpen) GP.Account.padInput(now, prev, time);
      else if (now.B && !prev.B && GP.game) GP.game.scene.getScenes(true).forEach(function (sc) {
        if (sc.input && sc.input.keyboard) sc.input.keyboard.emit('keydown-ESC', { keyCode: 27, fromGamepad: true });
      });
      now.buttons = buttons; prev = now; return;
    }
    state.left = now.LEFT; state.right = now.RIGHT; state.up = now.UP; state.down = now.DOWN; state.jump = now.A;
    state.dash = !!(buttons[5] || buttons[7]);   // dash : bouton RB ou gâchette droite (RT)
    // événements de menu : à l'appui, puis répétition (0,4 s puis toutes les 0,13 s) pour les directions
    ['UP', 'DOWN', 'LEFT', 'RIGHT'].forEach(function (d) {
      if (now[d] && !prev[d]) { emit(d); held[d] = time + 400; }
      else if (now[d] && time > held[d]) { emit(d); held[d] = time + 130; }
    });
    if (now.A && !prev.A) emit('ENTER');   // une seule validation (pas deux écrans traversés d'un coup)
    if (now.B && !prev.B) emit('ESC');
    if (now.START && !prev.START) emit('ESC');
    if (now.Y && !prev.Y) emit('H');
    if (now.X && !prev.X) {
      var sc = GP.game && GP.game.scene.getScenes(true)[0], key = sc && sc.scene.key;
      emit(key === 'Result' ? 'R' : key === 'Character' ? 'SPACE' : 'M');
    }
    var scene = GP.game && GP.game.scene.getScenes(true)[0], options = scene && scene.scene && scene.scene.key === 'Options';
    if (now.LB && !prev.LB) emit(options ? 'PAGEUP' : 'LEFT');
    if (now.RB && !prev.RB) emit(options ? 'PAGEDOWN' : 'RIGHT');
    now.buttons = buttons;
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
