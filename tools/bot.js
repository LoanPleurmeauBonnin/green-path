/**
 * Robot de test : parcourt un niveau tout seul pour vérifier qu'il est franchissable de bout en bout.
 * Usage (console du navigateur, niveau ouvert) : GP.TestBot.attach(GP.game.scene.getScene('Game'))
 * Règles : avance toujours ; saute (appui long) avant un trou, un mur, une ronce, un rebord ou un pixel en hauteur.
 * Il mesure aussi la hauteur et la longueur du premier saut. Ce fichier n'est pas chargé par le jeu.
 */
window.GP = window.GP || {};
GP.TestBot = {
  attach: function (scene) {
    var bot = { hold: 0, log: [], jumps: 0, firstJump: null, x0: 0, y0: 0 };
    bot.step = function (s) {
      var b = s.player.body, L = s.L, dt = 16;
      var front = b.x + b.width, feet = b.y + b.height, onGround = b.blocked.down;
      var col = function (px) { return Math.floor(px / 16); };
      var curTop = L.top(col(b.x + b.width / 2));
      var out = { left: false, right: true, jump: false };
      // mesure du premier saut
      if (bot.firstJump && !bot.firstJump.done) {
        bot.firstJump.minFeet = Math.min(bot.firstJump.minFeet, feet);
        if (onGround && s.time_ms - bot.firstJump.t > 100) { bot.firstJump.done = true; bot.firstJump.dist = b.x - bot.firstJump.x; bot.firstJump.height = bot.firstJump.feet - bot.firstJump.minFeet; }
      }
      if (bot.hold > 0) { bot.hold -= dt; out.jump = true; return out; }
      if (!onGround) return out;
      var why = null;
      var c4 = col(front + 4), t4 = L.top(c4);
      if (t4 >= 17 && !s.layer.getTileAt(c4, curTop - 0)) why = 'trou';
      if (t4 > curTop + 1 && t4 < 17 && L.thorns.some(function (t) { return t.x >= c4 && t.x <= c4 + 2; })) why = 'fosse';
      for (var d = 2; d <= 18 && !why; d += 4) { var c = col(front + d); if (L.top(c) < curTop) why = 'mur'; }
      if (!why && s.thorns.some(function (t) { return t.x > front - 4 && t.x < front + 22 && t.y > b.y - 4; })) why = 'ronce';
      if (!why && s.pixels.some(function (p) { return !p.taken && p.x > b.x - 8 && p.x < front + 30 && p.y < b.y - 2; })) why = 'pixel';
      if (why) {
        out.jump = true; bot.hold = 320; bot.jumps++;
        bot.log.push(why + '@' + col(b.x));
        if (!bot.firstJump) bot.firstJump = { x: b.x, feet: feet, minFeet: feet, t: s.time_ms };
      }
      return out;
    };
    scene.bot = bot;
    return bot;
  }
};

/**
 * Test d'accessibilité : pour chaque pixel, essaie de l'atteindre en marchant ou en sautant (appui long)
 * depuis plusieurs points de départ à sa gauche, sur la surface située dessous. Les ronces sont ignorées
 * (on teste la géométrie). stepFn(n) doit faire avancer le jeu de n images. Renvoie la liste des pixels inaccessibles.
 */
GP.TestBot.reach = function (g, stepFn) {
  var L = g.L, p = g.player, b = p.body, saved = g.pixels, bad = [];
  var die = g.die; g.die = function () {};   // pas de mort pendant le test (chaque essai repart d'un point choisi)
  g.invuln = 1e9; g.pixels = []; g.introMs = 0;
  function surfaces(col, belowY) {
    var out = [], t = L.top(col);
    if (t < 17) out.push(t * 16);
    L.plats.forEach(function (pl) { if (col >= pl.x && col < pl.x + pl.w) out.push(pl.y * 16); });
    return out.filter(function (y) { return y > belowY; }).sort(function (a, b) { return a - b; });
  }
  // Manières d'essayer : marcher, saut long, saut + s'accrocher puis se hisser, grimper (colonne) puis aller à droite.
  var PLANS = [
    function (f, d) { return { right: d > 0, jump: false }; },
    function (f, d) { return { right: d > 0, jump: f > 1 && f <= 23 }; },
    function (f, d) { return { right: d > 0, jump: (f > 1 && f <= 23) || (f > 50 && f < 56) }; },
    function (f, d) { return { right: f > 100 && d > 0, up: f > 1 && f < 140, jump: false }; }
  ];
  function reset(x0, s) {
    g.hanging = null; g.climbing = null; g.setCrouch(false); b.setAllowGravity(true); b.enable = true;
    b.reset(x0, s); p.setAlpha(1);
  }
  saved.forEach(function (px) {
    var ok = false;
    for (var d = -24; d <= 84 && !ok; d += 6) {
      var x0 = px.x - d, s = surfaces(Math.floor(x0 / 16), px.y - 2)[0];
      if (s === undefined) continue;
      PLANS.forEach(function (plan) {
        if (ok) return;
        reset(x0, s);
        var f = 0;
        g.bot = { step: function () { f++; var o = plan(f, d); o.left = !o.right && d < 0 && f > 1; return o; } };
        for (var i = 0; i < 170 && !ok; i++) {
          stepFn(1);
          if (b.x < px.x + 5 && b.x + b.width > px.x - 5 && b.y < px.y + 5 && b.y + b.height > px.y - 5) ok = true;
        }
      });
    }
    if (!ok) bad.push([Math.floor(px.x / 16), Math.floor(px.y / 16)]);
  });
  reset(g.respawn.x, g.respawn.y);
  g.pixels = saved; g.bot = null; g.invuln = 0; g.die = die;
  return bad;
};
