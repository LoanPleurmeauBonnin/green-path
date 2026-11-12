/** Source unique des commandes affichées. Aucun choix de périphérique n'est sauvegardé.
 * Les touches de jeu viennent de Settings ; la navigation de menu reste indépendante du remapping.
 * bind/watch sont libérés avec la scène. Les événements synthétiques de Pad ne sont pas des événements DOM.
 */
GP.Prompts = (function () {
  var device = 'keyboard', profile = 'standard', listeners = [], started = false;
  var MENU = { navX: [37, 39], navY: [38, 40], fields: [9], sections: [9], confirm: [13], back: [27], pause: [27], help: [72], mute: [77], replay: [82], preview: [32], pages: [37, 39] };
  var PAD = { left: '←', right: '→', up: '↑', down: '↓', move: '← →', navX: '← →', navY: '↑ ↓', fields: '↑ ↓', sections: 'LB/RB', pages: 'LB/RB',
    jump: 'A', dash: 'RB / RT', confirm: 'A', back: 'B', pause: 'START', help: 'Y', mute: 'X', replay: 'X', preview: 'X' };
  // Indices de l'API Gamepad standard : utilisés aussi par Controls, pas seulement par les libellés.
  var BUTTONS = { confirm: 0, back: 1, secondary: 2, help: 3, previous: 4, next: 5, pause: 9, up: 12, down: 13, left: 14, right: 15 };
  function notify() { listeners.slice().forEach(function (fn) { fn(); }); }
  function use(next, p) {
    var changed = device !== next || (p && profile !== p);
    device = next; if (p) profile = p;
    if (changed) notify();
  }
  function key(code) {
    var arrows = { 37: '←', 38: '↑', 39: '→', 40: '↓' };
    return arrows[code] || GP.I18n.keyName(code);
  }
  function labels(action) {
    if (device === 'gamepad') {
      var label = PAD[action] || action;
      if (profile === 'sony') label = ({ A: 'CROIX', B: 'ROND', X: 'CARRÉ', Y: 'TRIANGLE', START: 'OPTIONS', 'LB/RB': 'L1/R1' })[label] || label;
      return [GP.t(label)];
    }
    if (device === 'touch') return [({ move: '← →', jump: '↑', dash: 'BOUTON ›', up: '↑', down: '↓', pause: 'PAUSE', confirm: 'TOUCHER', back: 'FERMER', help: 'AIDE', pages: '← →' })[action] || labelsKeyboard(action).join(' / ')];
    return labelsKeyboard(action);
  }
  function labelsKeyboard(action) {
    if (action === 'move') return [key(GP.Settings.keys.left.filter(Boolean)[0]), key(GP.Settings.keys.right.filter(Boolean)[0])];
    var codes = MENU[action] || (GP.Settings.keys[action] && GP.Settings.keys[action].filter(Boolean).slice(0, 1)) || [];
    return codes.map(key);
  }
  function format(template) {
    return GP.t(template).replace(/\{([A-Za-z]+)\}/g, function (_, action) {
      var text = labels(action).join(' / ');
      return device === 'gamepad' && !/[←→↑↓]/.test(text) ? '[' + text + ']' : text;
    });
  }
  function watch(scene, fn) {
    listeners.push(fn);
    var off = function () { listeners = listeners.filter(function (f) { return f !== fn; }); scene.events.off('shutdown', off); };
    scene.events.once('shutdown', off);
    return off;
  }
  return {
    BUTTONS: BUTTONS,
    get device() { return device; }, get profile() { return profile; },
    name: function () { return GP.t(device === 'gamepad' ? 'MANETTE' : device === 'touch' ? 'TACTILE' : 'CLAVIER'); },
    use: use, labels: labels, format: format, refresh: notify, watch: watch,
    bind: function (scene, object, template) {
      function draw() { if (object.scene) object.setText(format(typeof template === 'function' ? template() : template)); }
      var off = watch(scene, draw); object.once('destroy', off); draw(); return object;
    },
    start: function () {
      if (started) return; started = true;
      function instructions() {
        var node = document.getElementById && document.getElementById('instructions');
        if (node) node.textContent = format('Navigation : {navX}, {navY}, {confirm} pour valider, {back} pour revenir. En jeu : {move} pour courir, {jump} pour sauter, {up} pour grimper, {down} pour s\'accroupir, {pause} pour la pause, {help} pour l\'aide. Le jeu reste visuel et n\'est pas entièrement accessible aux lecteurs d\'écran.');
      }
      listeners.push(instructions); instructions();
      window.addEventListener('keydown', function (ev) {
        if (!ev.repeat && !ev.isComposing && ev.key !== 'Unidentified') use('keyboard');
      }, true);
      // Un clic est une intention ; le simple survol de la souris ne change pas les indications.
      window.addEventListener('pointerdown', function (ev) { use(ev.pointerType === 'touch' ? 'touch' : 'keyboard'); }, true);
    },
    padActivity: function (pad) { use('gamepad', /054c|dualsense|dualshock|playstation|sony/i.test(pad.id || '') ? 'sony' : 'standard'); },
    padDisconnected: function () { if (device === 'gamepad') use('keyboard'); }
  };
})();
