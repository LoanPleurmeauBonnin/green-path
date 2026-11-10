/**
 * Ui (GP.UI) — éléments d'interface partagés par la carte et les niveaux, au style de l'écran d'accueil :
 * fond bleu nuit, bordure sombre, texte blanc, titres et sélection en vert.
 *
 *   GP.UI.button(scene, x, y, w, label, cb, { primary, color })   bouton (survol vert comme le menu)
 *   GP.UI.modal(scene, titre, titreDroite)                          fenêtre ; renvoie { add, objs, destroy }
 *   GP.UI.help(scene, page, { onClose })                            aide « Comment jouer ? » sur 4 pages
 * Tous les objets ont scrollFactor 0 : ils restent fixes même quand la caméra défile (niveaux).
 */
GP.UI = (function () {
  var P = GP.PAL, D = 100;

  function txt(scene, x, y, s, color, extra) {
    return scene.add.text(x, y, s, Object.assign({ fontFamily: GP.Config.FONT, fontSize: '8px', color: color || P.w }, extra || {}));
  }

  // ---------- Textures : flèches des touches, icônes ----------
  function makeTextures(scene) {
    if (scene.textures.exists('ui_arr_r')) return;
    var r = ['.k.....', '.kk....', '.kkk...', '.kkkk..', '.kkk...', '.kk....', '.k.....'];
    function rot(rows) { var n = rows.length, out = []; for (var y = 0; y < n; y++) { var s = ''; for (var x = 0; x < n; x++) s += rows[n - 1 - x][y]; out.push(s); } return out; }
    var dn = rot(r), l = rot(dn), up = rot(l);
    GP.PixelArt.sprite(scene, 'ui_arr_r', r);
    GP.PixelArt.sprite(scene, 'ui_arr_d', dn);
    GP.PixelArt.sprite(scene, 'ui_arr_l', l);
    GP.PixelArt.sprite(scene, 'ui_arr_u', up);
  }

  // ---------- Bouton ----------
  function button(scene, x, y, w, label, cb, opts) {
    opts = opts || {};
    var base = opts.color || (opts.primary ? P.g : P.m);
    var box = scene.add.rectangle(x, y, w, 16, GP.int(P.d), 1).setOrigin(0).setStrokeStyle(2, GP.int(P.k)).setInteractive({ useHandCursor: true });
    var t = txt(scene, x + w / 2, y + 5, label, base).setOrigin(0.5, 0);
    function hover(on) {
      box.setFillStyle(GP.int(on ? P.G : P.d), 1).setStrokeStyle(2, GP.int(on ? P.g : P.k));
      t.setColor(on ? P.w : base);
    }
    box.on('pointerover', function () { hover(true); });
    box.on('pointerout', function () { hover(false); });
    box.on('pointerdown', function () { cb(); });
    [box, t].forEach(function (o) { o.setScrollFactor(0); });
    return { objs: [box, t], hover: hover, box: box, label: t };
  }

  // ---------- Fenêtre ----------
  function modal(scene, titleLeft, titleRight, opts) {
    opts = opts || {};
    var W = GP.Config.WIDTH, H = GP.Config.HEIGHT, objs = [];
    var x = opts.x || 20, y = opts.y || 12, w = opts.w || 440, h = opts.h || 226;
    function add(o) {
      if (Array.isArray(o)) { o.forEach(add); return o; }
      o.setDepth(D + (o.depthBoost || 0)).setScrollFactor(0); objs.push(o); return o;
    }
    add(scene.add.rectangle(0, 0, W, H, GP.int(P.k), 0.6).setOrigin(0).setInteractive());
    add(scene.add.rectangle(x, y, w, h, GP.int(P.k)).setOrigin(0));
    add(scene.add.rectangle(x + 2, y + 2, w - 4, h - 4, GP.int(P.d)).setOrigin(0));
    add(scene.add.rectangle(x + 2, y + 21, w - 4, 1, GP.int(P.G)).setOrigin(0));
    var tl = add(txt(scene, x + 10, y + 8, titleLeft, P.g));
    var tr = add(txt(scene, x + w - 10, y + 8, titleRight || '', P.m).setOrigin(1, 0));
    objs.forEach(function (o) { o.setAlpha(0); scene.tweens.add({ targets: o, alpha: 1, duration: 120 }); });
    return {
      add: function (o) { var r = add(o); return r; },
      objs: objs, titleRight: tr, titleLeft: tl,
      destroy: function () { objs.forEach(function (o) { o.destroy(); }); objs.length = 0; }
    };
  }

  /** Touche de clavier dessinée en pixel : label texte ou flèche ('<', '>', '^', 'v'). Renvoie la largeur. */
  function key(scene, add, x, y, label) {
    var arrows = { '<': 'ui_arr_l', '>': 'ui_arr_r', '^': 'ui_arr_u', 'v': 'ui_arr_d' };
    var w = arrows[label] ? 15 : Math.max(15, label.length * 8 + 8);
    add(scene.add.rectangle(x, y, w, 15, GP.int(P.k)).setOrigin(0));
    add(scene.add.rectangle(x + 1, y + 1, w - 2, 12, GP.int(P.c)).setOrigin(0));
    add(scene.add.rectangle(x + 1, y + 11, w - 2, 2, GP.int(P.t)).setOrigin(0));   // ombre du bas de la touche
    if (arrows[label]) add(scene.add.image(x + 8, y + 7, arrows[label]));
    else add(txt(scene, x + w / 2, y + 3, label, P.k).setOrigin(0.5, 0));
    return w;
  }

  // ---------- Aide sur 4 pages ----------
  var PAGES = [
    {
      title: 'LA CARTE', rows: [
        [['<', '>'], 'CHANGER DE NIVEAU (OU A / D)'],
        [['CLIC'], 'ALLER JUSQU\'À UNE ÉTAPE'], [['ENTRÉE'], 'OUVRIR LA FICHE DU LIEU, JOUER'],
        [['ÉCHAP'], 'FERMER, REVENIR AU MENU'], [['M'], 'COUPER / REMETTRE LE SON'], [['H'], 'OUVRIR CETTE AIDE']
      ]
    },
    {
      title: 'DANS UN NIVEAU', rows: [
        [['<', '>'], 'COURIR (OU Q/A ET D)'], [['ESPACE'], 'SAUTER (OU W, Z) ; MAINTENIR = PLUS HAUT'],
        [['v'], "S'ACCROUPIR SOUS LES FLÈCHES (OU S)"], [['^'], 'GRIMPER AUX COLONNES, SE HISSER SUR UN REBORD'],
        [['ÉCHAP'], 'PAUSE'], [[], 'SUR TÉLÉPHONE : BOUTONS À L\'ÉCRAN, EN PAYSAGE']
      ]
    },
    {
      title: 'BUT DU JEU', icons: true, rows: [
        [['#lv_pixel'], 'RAMASSE LES PIXELS : CHACUN RÉVÈLE UNE PARTIE DE LA PHOTO DU LIEU.'],
        [['#lv_thorn'], 'RONCES, POINTES, FLÈCHES, TONNEAUX, CHUTE = UNE MORT : RETOUR À LA LANTERNE.'],
        [['#lv_lantern_on'], 'LANTERNE ALLUMÉE = POINT DE CONTRÔLE.'],
        [['#star_on', '#star_on', '#star_on'], 'IMAGE COMPLÈTE, SANS MOURIR, SOUS LE TEMPS CIBLE.']
      ]
    },
    {
      title: 'MÉTÉO', icons: true, rows: [
        [['#wx_sun', '#wx_moon', '#wx_rain', '#wx_snow'], 'LA VRAIE MÉTÉO DE NANTES CHANGE LE JEU : ANNONCÉ À CHAQUE NIVEAU.'],
        [['#wx_rain'], 'PLUIE : LE SOL GLISSE, LES RONCES POUSSENT. NEIGE : ON DÉRAPE.'],
        [['#wx_cloud'], 'VENT : IL POUSSE LES SAUTS. BRUME, NUIT : PIXELS VISIBLES DE PRÈS.'],
        [['#wx_sun'], 'SOLEIL : DES FLEURS FONT DES PLATEFORMES.'],
        [[], 'EN DIRECT TOUTES LES 5 MIN ; HORS LIGNE, LA DERNIÈRE MÉTÉO REÇUE.']
      ]
    }
  ];

  /**
   * Ouvre l'aide à la page donnée. Navigation : boutons, flèches gauche/droite (ou Q/A et D).
   * Renvoie { objs, close(), page() }. L'appelant gère Échap / H (il appelle close()).
   */
  function help(scene, page, opts) {
    opts = opts || {};
    makeTextures(scene);
    var cur = Math.max(0, Math.min(PAGES.length - 1, page || 0));
    var m = modal(scene, 'COMMENT JOUER ?', '');
    var content = [];
    function addC(o) { if (Array.isArray(o)) { o.forEach(addC); return o; } m.add(o); content.push(o); return o; }

    function render() {
      content.forEach(function (o) { o.destroy(); }); content = [];
      var pg = PAGES[cur];
      m.titleRight.setText((cur + 1) + '/' + PAGES.length + ' ' + pg.title);
      var y = 44;
      pg.rows.forEach(function (row) {
        var x = 34, keys = row[0];
        keys.forEach(function (k) {
          if (k.charAt(0) === '#') { var im = addC(scene.add.image(x, y + 7, k.slice(1)).setOrigin(0, 0.5)); x += im.width + 4; }
          else x += key(scene, addC, x, y, k) + 4;
        });
        var tx = keys.length ? Math.max(pg.icons ? 100 : 150, x + 6) : 34;
        var t = addC(txt(scene, tx, y + 4, row[1], P.w, { wordWrap: { width: 446 - tx }, lineSpacing: 4 }));
        y += Math.max(18, t.height + 10);
      });
      // points de pagination
      for (var i = 0; i < PAGES.length; i++)
        addC(scene.add.rectangle(GP.Config.WIDTH / 2 - 15 + i * 10, 203, 6, 6, GP.int(i === cur ? P.g : P.e)).setOrigin(0.5));
      prev.label.setAlpha(cur > 0 ? 1 : 0.35);
      next.label.setAlpha(cur < PAGES.length - 1 ? 1 : 0.35);
    }
    function go(d) {
      var n = Math.max(0, Math.min(PAGES.length - 1, cur + d));
      if (n === cur) return;
      cur = n; GP.Sfx.play('step'); render();
    }
    var prev = button(scene, 34, 214, 110, '< PRÉCÉDENT', function () { go(-1); });
    var close = button(scene, 195, 214, 90, 'FERMER', function () { handle.close(); });
    var next = button(scene, 336, 214, 110, 'SUIVANT >', function () { go(1); }, { primary: true });
    m.add(prev.objs); m.add(close.objs); m.add(next.objs);

    var kb = scene.input.keyboard, L = function () { go(-1); }, R = function () { go(1); };
    var evL = ['keydown-LEFT', 'keydown-A', 'keydown-Q'], evR = ['keydown-RIGHT', 'keydown-D'];
    evL.forEach(function (e) { kb.on(e, L); }); evR.forEach(function (e) { kb.on(e, R); });

    var handle = {
      objs: m.objs, open: true,
      page: function () { return cur; },
      close: function () {
        if (!handle.open) return;
        handle.open = false;
        evL.forEach(function (e) { kb.off(e, L); }); evR.forEach(function (e) { kb.off(e, R); });
        m.destroy();
        GP.Sfx.play('back');
        if (opts.onClose) opts.onClose();
      }
    };
    render();
    GP.Sfx.play('select');
    return handle;
  }

  /** Écran tactile (doigt) : les boutons à l'écran ne s'affichent que dans ce cas. */
  function isTouch() {
    try { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); } catch (e) { return false; }
  }

  /**
   * Manette tactile (niveaux) : gauche, droite, accroupi (bas) à gauche ; saut à droite ; PAUSE en haut à droite.
   * Écrit l'état dans l'objet state ({ left, right, down, jump }) ; plusieurs doigts à la fois.
   * N'apparaît que sur écran tactile (pointer: coarse). Renvoie la liste des objets (ou []).
   */
  function touchPad(scene, state, onPause) {
    if (!isTouch()) return [];
    makeTextures(scene);
    scene.input.addPointer(3);
    var H = GP.Config.HEIGHT, W = GP.Config.WIDTH, objs = [];
    function btn(x, y, r, icon, key) {
      var c = scene.add.circle(x, y, r, GP.int(P.d), 0.55).setStrokeStyle(2, GP.int(P.k)).setScrollFactor(0).setDepth(55).setInteractive();
      var im = scene.add.image(x, y, icon).setScale(2).setScrollFactor(0).setDepth(56).setTint(0xf4f7f2);
      function on() { state[key] = true; c.setFillStyle(GP.int(P.G), 0.8); }
      function off() { state[key] = false; c.setFillStyle(GP.int(P.d), 0.55); }
      c.on('pointerdown', on); c.on('pointerup', off); c.on('pointerout', off);
      objs.push(c, im);
    }
    btn(26, H - 30, 19, 'ui_arr_l', 'left');
    btn(70, H - 30, 19, 'ui_arr_r', 'right');
    btn(114, H - 26, 15, 'ui_arr_d', 'down');
    btn(W - 32, H - 34, 24, 'ui_arr_u', 'jump');
    if (onPause) { var pz = button(scene, W - 64, 46, 60, 'PAUSE', onPause); pz.objs.forEach(function (o) { o.setDepth(55); objs.push(o); }); }
    return objs;
  }

  /** Fond des écrans fixes (menu, créateur, résultat) : le fond d'accueil de la planche « carte », sinon le décor généré. */
  function backdropKey(scene) { return scene.textures.exists('carte_fond_accueil') ? 'carte_fond_accueil' : 'lv_backdrop'; }

  return { isTouch: isTouch, touchPad: touchPad, backdropKey: backdropKey, txt: txt, button: button, modal: modal, help: help, key: key, makeTextures: makeTextures, PAGES: PAGES };
})();
