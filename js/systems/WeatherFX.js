/**
 * WeatherFX — rendu visuel de la météo, partagé par la carte et (Phase 2) les niveaux.
 *
 *   var fx = GP.WeatherFX.apply(scene, { depth: 30, lights: [[x, y, échelle], ...], fixed: false, noShadows: false });
 *   (fixed : caméra qui défile, effets collés à l'écran ; noShadows : pas d'ombres de nuages au sol, vue de côté)
 *   fx.set(GP.Weather.get());   // à rappeler quand la météo change
 *
 * Couches (de bas en haut) :
 *   ombres de nuages   nombre selon la nébulosité, dérive selon le vent
 *   filtre jour/nuit   rectangle en mode MULTIPLY (nuit bleu profond, grand soleil chaud léger)
 *   lumières           halos des lampadaires, visibles seulement la nuit
 *   pluie / neige      densité selon les précipitations, inclinaison selon le vent
 *   brume              voile clair
 * Purement visuel : aucun effet sur la physique. Pas de flash (pas d'éclair).
 * prefers-reduced-motion : environ trois fois moins de particules, nuages fixes, pas de pulsation.
 */
GP.WeatherFX = (function () {
  var PA = GP.PixelArt;

  // ---------- Textures ----------
  var ICONS = {
    sun: ['....y.y.....', '.y..yyy..y..', '..yyyyyyy...', '..yyywyyy...', 'yyyywwyyyyy.', '..yyyyyyy...', '..yyyyyyy...', '.y..yyy..y..', '....y.y.....', '............', '............', '............'],
    moon: ['....ccc.....', '..cccc......', '.cccc.......', '.ccc........', 'cccc........', 'cccc........', 'cccc......c.', '.cccc....cc.', '.cccccccccc.', '..cccccccc..', '....cccc....', '............'],
    cloud: ['............', '............', '....mmm.....', '...mwwwm....', '.mmwwwwwmm..', 'mwwwwwwwwwm.', 'mwwwwwwwwwwm', 'mmwwwwwwwwmm', '.mmmmmmmmmm.', '............', '............', '............'],
    part: ['.y.y........', '..yyy.......', 'yyywy.......', '.yyyymmm....', '.y.ymwwwm...', '..mmwwwwwmm.', '.mwwwwwwwwwm', '.mwwwwwwwwwm', '.mmwwwwwwwmm', '..mmmmmmmmm.', '............', '............'],
    moonpart: ['..ccc.......', '.cc.........', 'ccc.........', 'cccc.mmm....', '.ccmmwwwm...', '..mmwwwwwmm.', '.mwwwwwwwwwm', '.mwwwwwwwwwm', '.mmwwwwwwwmm', '..mmmmmmmmm.', '............', '............'],
    rain: ['....mmm.....', '...mwwwm....', '.mmwwwwwmm..', 'mwwwwwwwwwm.', 'mmwwwwwwwmm.', '.mmmmmmmmm..', '..l...l.....', '.l...l...l..', '.....l..l...', '...l....l...', '..l..l......', '............'],
    snow: ['....mmm.....', '...mwwwm....', '.mmwwwwwmm..', 'mwwwwwwwwwm.', 'mmwwwwwwwmm.', '.mmmmmmmmm..', '..w...w.....', '.....w...w..', '.w.......w..', '....w..w....', '..w.........', '............'],
    fog: ['............', '............', '.mmmmmmmm...', '............', '...mmmmmmmmm', '............', 'mmmmmmmmm...', '............', '..mmmmmmmmm.', '............', '.mmmmmm.....', '............'],
    storm: ['....eee.....', '...emmme....', '.eemmmmmee..', 'emmmmmmmmme.', 'eemmmmmmmee.', '.eeeyyeeee..', '....yy......', '...yy.......', '...yyyy.....', '.....yy.....', '.....y......', '............']
  };

  function makeTextures(scene) {
    if (scene.textures.exists('wx_glow')) return;
    Object.keys(ICONS).forEach(function (k) { PA.sprite(scene, 'wx_' + k, ICONS[k]); });
    // ombre de nuage : ellipse tramée (dither) pour un rendu pixel
    var o = PA.canvas(96, 44), rnd = PA.rng(7);
    for (var y = 0; y < 44; y++) for (var x = 0; x < 96; x++) {
      var dx = (x - 48) / 46, dy = (y - 22) / 20, d = dx * dx + dy * dy;
      var bump = 0.12 * Math.sin(x / 7) + 0.1 * Math.cos(y / 5);
      if (d < 0.75 + bump || (d < 1 + bump && (x + y) % 2 === 0)) { o.ctx.fillStyle = GP.PAL.k; o.ctx.fillRect(x, y, 1, 1); }
    }
    PA.toTexture(scene, 'wx_cshadow', o.cv);
    // halo de lampadaire
    var g = PA.canvas(24, 24);
    for (y = 0; y < 24; y++) for (x = 0; x < 24; x++) {
      var r = Math.hypot(x - 11.5, y - 11.5);
      if (r < 5 || (r < 8 && (x + y) % 2 === 0) || (r < 11 && (x % 2 === 0 && y % 2 === 0))) { g.ctx.fillStyle = '#ffd98a'; g.ctx.fillRect(x, y, 1, 1); }
    }
    PA.toTexture(scene, 'wx_glow', g.cv);
  }

  // ---------- Règles (entrée météo → paramètres visuels) ----------
  /** Couleur du filtre MULTIPLY : catégorie de temps, puis assombrie la nuit. */
  function tintFor(st) {
    var base = {
      clear: 0xfff3dc, cloudy: 0xf4f2ec, overcast: 0xd9dde5, fog: 0xe4e6ea,
      drizzle: 0xcfd6e0, rain: 0xbec8d6, storm: 0xa9b3c4, snow: 0xe8eef6
    }[st.cat] || 0xffffff;
    if (st.isDay) return base;
    var night = 0x4d5b9c, c1 = Phaser.Display.Color.IntegerToColor(base), c2 = Phaser.Display.Color.IntegerToColor(night);
    return Phaser.Display.Color.GetColor(c1.red * c2.red / 255, c1.green * c2.green / 255, c1.blue * c2.blue / 255);
  }

  /** Nombre de particules selon le type et la quantité de précipitations. */
  function particleCount(st) {
    var n = 0;
    if (st.cat === 'drizzle') n = 45;
    else if (st.cat === 'rain') n = Math.round(Math.min(170, 50 + st.precip * 40));
    else if (st.cat === 'storm') n = 170;
    else if (st.cat === 'snow') n = Math.round(Math.min(120, 50 + st.precip * 25));
    else if (st.precip > 0) n = Math.round(Math.min(80, st.precip * 40));   // averse isolée
    if (GP.reducedMotion) n = Math.round(n / 3);
    return n;
  }

  /** Vecteur de dérive à l'écran (le vent vient de windDir : on va vers windDir + 180°). */
  function windVector(st) {
    var a = (st.windDir + 180) * Math.PI / 180;
    return { x: Math.sin(a), y: -Math.cos(a), speed: st.wind };
  }

  // ---------- Mise en place ----------
  function apply(scene, opts) {
    opts = opts || {};
    makeTextures(scene);
    var W = opts.width || GP.Config.WIDTH, H = opts.height || GP.Config.HEIGHT, D = opts.depth || 30;
    var fx = { state: null, clouds: [], drops: [], lights: [] };
    fx.exposureAt = opts.exposureAt || function () { return 1; };

    fx.tint = scene.add.rectangle(0, 0, W, H, 0xffffff, 1).setOrigin(0).setDepth(D + 1).setBlendMode(Phaser.BlendModes.MULTIPLY);
    fx.tintColor = 0xffffff;
    (opts.lights || []).forEach(function (p) {
      fx.lights.push(scene.add.image(p[0], p[1], 'wx_glow').setScale(p[2] || 1).setDepth(D + 2).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0));
    });
    fx.rain = scene.add.graphics().setDepth(opts.rainDepth === undefined ? D + 3 : opts.rainDepth);
    fx.fog = scene.add.rectangle(0, 0, W, H, 0xf4f7f2, 1).setOrigin(0).setDepth(D + 4).setAlpha(0);
    // caméra qui défile (niveaux) : filtre, pluie et brume restent collés à l'écran ; les halos restent dans le monde
    if (opts.fixed) [fx.tint, fx.rain, fx.fog].forEach(function (o) { o.setScrollFactor(0); });

    function setClouds(st) {
      var n = opts.noShadows ? 0 : Math.round(st.cloud / 100 * 6), rnd = PA.rng(99);
      while (fx.clouds.length < n) {
        var c = scene.add.image(rnd() * W, 20 + rnd() * (H - 60), 'wx_cshadow').setDepth(D).setScale(1 + rnd() * 0.8, 1 + rnd() * 0.5);
        if (opts.fixed) c.setScrollFactor(0);
        fx.clouds.push(c);
      }
      while (fx.clouds.length > n) fx.clouds.pop().destroy();
      var alpha = st.isDay ? (st.cat === 'overcast' || st.cat === 'rain' || st.cat === 'storm' ? 0.1 : 0.16) : 0.08;
      fx.clouds.forEach(function (c) { c.setAlpha(alpha); });
    }

    function setDrops(st) {
      var n = particleCount(st), snow = st.cat === 'snow';
      fx.drops = [];
      for (var i = 0; i < n; i++) fx.drops.push({ x: Math.random() * W, y: Math.random() * H, len: snow ? 1 : 3 + Math.floor(Math.random() * 3), v: 0.6 + Math.random() * 0.6 });
      fx.snow = snow;
    }

    fx.set = function (st) {
      if (!st) return;
      fx.state = st;
      // filtre : fondu doux vers la nouvelle couleur (pas de changement brutal)
      var from = Phaser.Display.Color.IntegerToColor(fx.tintColor), to = Phaser.Display.Color.IntegerToColor(tintFor(st));
      fx.tintColor = tintFor(st);
      if (fx.tintTween) fx.tintTween.stop();
      fx.tintTween = scene.tweens.addCounter({
        from: 0, to: 100, duration: GP.reducedMotion ? 1 : 900,
        onUpdate: function (tw) {
          var c = Phaser.Display.Color.Interpolate.ColorWithColor(from, to, 100, tw.getValue());
          fx.tint.setFillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1);
        }
      });
      fx.lights.forEach(function (l) { scene.tweens.add({ targets: l, alpha: st.isDay ? 0 : 0.55, duration: 900 }); });
      scene.tweens.add({ targets: fx.fog, alpha: st.cat === 'fog' ? 0.3 : (st.cat === 'snow' ? 0.08 : 0), duration: 900 });
      setClouds(st);
      setDrops(st);
      var wv = windVector(st);
      fx.wind = wv;
    };

    fx.update = function (time, delta) {
      var st = fx.state; if (!st) return;
      var dt = Math.min(delta, 50) / 1000, wv = fx.wind;
      // ombres de nuages : 3 à 35 px/s selon le vent
      if (!GP.reducedMotion) {
        var sp = 3 + wv.speed * 0.4;
        fx.clouds.forEach(function (c) {
          c.x += wv.x * sp * dt; c.y += wv.y * sp * dt * 0.5;
          var mw = c.displayWidth / 2, mh = c.displayHeight / 2;
          if (c.x > W + mw) c.x = -mw; if (c.x < -mw) c.x = W + mw;
          if (c.y > H + mh) c.y = -mh; if (c.y < -mh) c.y = H + mh;
        });
      }
      // pluie / neige : inclinaison = composante horizontale du vent
      var g = fx.rain; g.clear();
      if (!fx.drops.length) return;
      var slant = Math.max(-1.2, Math.min(1.2, wv.x * wv.speed / 30));
      var fall = fx.snow ? 22 : 190, speedK = GP.reducedMotion ? 0.6 : 1;
      var color = fx.snow ? 0xf4f7f2 : (st.isDay ? 0x7fa8d8 : 0xa8c0e4);
      var lastAlpha = -1;
      fx.drops.forEach(function (d) {
        var vy = fall * d.v * speedK * dt;
        d.y += vy;
        d.x += (fx.snow ? slant * 0.5 + Math.sin((time / 600) + d.v * 10) * 0.3 : slant) * vy;
        if (d.y > H) { d.y -= H + 6; d.x = Math.random() * W; }
        if (d.x > W) d.x -= W; if (d.x < 0) d.x += W;
        for (var k = 0; k < d.len; k++) {
          var x = Math.round(d.x - slant * k), y = Math.round(d.y - k);
          var alpha = fx.exposureAt(x, y, fx.snow);
          if (alpha > 0) {
            if (alpha !== lastAlpha) { g.fillStyle(color, 0.9 * alpha); lastAlpha = alpha; }
            g.fillRect(x, y, 1, 1);
          }
        }
      });
    };

    var onUpdate = function (t, d) { fx.update(t, d); };
    scene.events.on('update', onUpdate);
    fx.destroy = function () { scene.events.off('update', onUpdate); };
    scene.events.once('shutdown', fx.destroy);
    return fx;
  }

  // ---------- Widget (température, condition, icône, source) ----------
  // Deux lignes : condition (NEUTRE si secours), puis EN DIRECT / HORS LIGNE / TEST.
  // L'état conserve la provenance exacte et l'âge du cache sans imposer une troisième ligne au HUD.
  var SOURCE = {
    live: { color: GP.PAL.g }, stale: { color: GP.PAL.o }, fallback: { color: GP.PAL.o }, sim: { color: GP.PAL.p }
  };
  /** Deux lignes, largeur mesurée après traduction, ancrage droit optionnel. */
  function widget(scene, x, y, depth, opts) {
    opts = opts || {};
    var w = 0, h = 26, D = depth || 50;
    var bg = scene.add.graphics().setDepth(D);
    var icon = scene.add.image(0, y + 9, 'wx_part').setDepth(D + 1);
    function t(yy, c) { return scene.add.text(0, y + yy, '', { fontFamily: GP.Config.FONT, fontSize: '8px', color: c }).setDepth(D + 1); }
    var t1 = t(4, GP.PAL.w), t2 = t(15, GP.PAL.m);
    t1.setText('…');
    var all = [bg, icon, t1, t2];
    all.forEach(function (o) { o.setScrollFactor(0); });
    var api = {
      objects: all, height: h,
      get width() { return w; },
      set: function (st) {
        icon.setTexture('wx_' + st.icon);
        // NEUTRE signale le secours (valeurs locales), contrairement à une observation météo en cache.
        t1.setText(st.temp + '°C ' + GP.t(st.source === 'fallback' ? 'NEUTRE' : st.label));
        var source = st.source === 'live' ? 'EN DIRECT' : st.source === 'sim' ? 'TEST · SIMULATION' : 'HORS LIGNE';
        api.source = st.source;
        t2.setText(source).setColor((SOURCE[st.source] || SOURCE.fallback).color);
        w = Math.ceil(Math.max(22 + t1.width, 6 + t2.width) + 6);
        var left = opts.right ? x - w : x;
        bg.clear(); bg.fillStyle(GP.int(GP.PAL.k), 1); bg.fillRect(left, y, w, h);
        bg.fillStyle(GP.int(GP.PAL.d), 1); bg.fillRect(left + 2, y + 2, w - 4, h - 4);
        icon.x = left + 10; t1.x = left + 22; t2.x = left + 6;
        api.left = left;
      }
    };
    return api;
  }

  return { apply: apply, widget: widget, makeTextures: makeTextures, tintFor: tintFor, particleCount: particleCount };
})();
