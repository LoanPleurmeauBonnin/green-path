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
    var box = scene.add.rectangle(x, y, w, opts.height || 16, GP.int(P.d), 1).setOrigin(0).setStrokeStyle(2, GP.int(P.k)).setInteractive({ useHandCursor: true });
    // Libellé centré dans le bouton, quelle que soit la hauteur (le +1 compense le bas vide de la police).
    var t = txt(scene, x + w / 2, y + (opts.height || 16) / 2 + 1, label, base, { align: 'center', lineSpacing: 2 }).setOrigin(0.5);
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

  /** Bouton retour en icône (flèche), en haut à gauche, à la même place et au même style que le bouton compte de l'accueil. */
  function backIcon(scene, cb, y, x) {
    var dx = GP.Config.DX; y = y === undefined ? 6 : y; x = x === undefined ? 6 - dx : x;
    if (!scene.textures.exists('ui_back')) GP.PixelArt.sprite(scene, 'ui_back', ['...k.....', '..kwk....', '.kwwkkkkk', 'kwwwwwwwk', '.kwwkkkkk', '..kwk....', '...k.....']);
    var box = scene.add.rectangle(x, y, 22, 15, GP.int(P.d), 0.95).setOrigin(0).setStrokeStyle(2, GP.int(P.k)).setInteractive({ useHandCursor: true }).setDepth(50);
    var img = scene.add.image(x + 11, y + 7.5, 'ui_back').setOrigin(0.5).setDepth(51);
    box.on('pointerover', function () { box.setFillStyle(GP.int(P.G), 0.95); });
    box.on('pointerout', function () { box.setFillStyle(GP.int(P.d), 0.95); });
    box.on('pointerdown', function () { cb(); });
    return { objs: [box, img], box: box };
  }

  // ---------- Fenêtre ----------
  function modal(scene, titleLeft, titleRight, opts) {
    opts = opts || {};
    var W = GP.Config.WIDTH, H = GP.Config.HEIGHT, objs = [];
    var x = opts.x === undefined ? 20 : opts.x, y = opts.y === undefined ? 12 : opts.y, w = opts.w || 440, h = opts.h || 226, dx = GP.Config.DX;
    // Les fenêtres sont dessinées sur 480 px de large et centrées : chaque objet ajouté est décalé de DX.
    function add(o) {
      if (Array.isArray(o)) { o.forEach(add); return o; }
      o.setDepth(D + (o.depthBoost || 0)).setScrollFactor(0); o.x += dx; o.y += opts.offsetY || 0; objs.push(o);
      o.once('destroy', function () { var i = objs.indexOf(o); if (i >= 0) objs.splice(i, 1); });
      return o;
    }
    var dim = scene.add.rectangle(0, 0, W, H, GP.int(P.k), opts.dim === undefined ? 0.6 : opts.dim).setOrigin(0).setInteractive().setDepth(D).setScrollFactor(0);
    objs.push(dim);
    add(scene.add.rectangle(x, y, w, h, GP.int(P.k)).setOrigin(0));
    add(scene.add.rectangle(x + 2, y + 2, w - 4, h - 4, GP.int(P.d)).setOrigin(0));
    add(scene.add.rectangle(x + 2, y + 21, w - 4, 1, GP.int(P.G)).setOrigin(0));
    var tl = add(txt(scene, x + 10, y + 8, titleLeft, P.g));
    var tr = add(txt(scene, x + w - 10, y + 8, titleRight || '', P.m).setOrigin(1, 0));
    objs.forEach(function (o) { var alpha = o.alpha; o.setAlpha(0); scene.tweens.add({ targets: o, alpha: alpha, duration: 120 }); });
    return {
      add: function (o) { var r = add(o); return r; },
      objs: objs, titleRight: tr, titleLeft: tl,
      destroy: function () { objs.slice().forEach(function (o) { o.destroy(); }); objs.length = 0; }
    };
  }

  /** Touche de clavier dessinée en pixel : label texte ou flèche ('<', '>', '^', 'v'). Renvoie la largeur. */
  function key(scene, add, x, y, label) {
    var arrows = { '<': 'ui_arr_l', '>': 'ui_arr_r', '^': 'ui_arr_u', 'v': 'ui_arr_d' };
    var w = arrows[label] ? 15 : Math.max(15, label.length * 8 + 8);
    if (GP.Prompts.device === 'gamepad') {
      var colors = { A: P.G, B: P.r, X: P.b, Y: P.y }, color = colors[label];
      var cap = scene.add.graphics(); cap.fillStyle(GP.int(color || P.d)); cap.lineStyle(1, GP.int(P.g));
      if (color) { cap.fillCircle(x + 8, y + 7, 7); cap.strokeCircle(x + 8, y + 7, 7); }
      else { cap.fillRoundedRect(x, y, w, 15, 4); cap.strokeRoundedRect(x, y, w, 15, 4); }
      add(cap);
      if (arrows[label]) add(scene.add.image(x + 8, y + 7, arrows[label]).setTintFill(GP.int(P.w)));
      else add(txt(scene, x + w / 2, y + 3, label, label === 'Y' ? P.k : P.w).setOrigin(0.5, 0));
      return w;
    }
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
        [['@navX'], 'CHANGER DE NIVEAU'],
        [['@confirm'], 'OUVRIR LA FICHE DU LIEU, JOUER'],
        [['@back'], 'FERMER, REVENIR AU MENU'], [['@mute'], 'COUPER / REMETTRE LE SON'], [['@help'], 'OUVRIR CETTE AIDE'],
        [['@pages'], 'FEUILLETER LES PAGES']
      ]
    },
    {
      title: 'DANS UN NIVEAU', rows: [
        [['@move'], 'COURIR'], [['@jump'], 'SAUTER ; MAINTENIR = PLUS HAUT'],
        [['@down'], "S'ACCROUPIR SOUS LES FLÈCHES"], [['@up'], 'GRIMPER AUX COLONNES, SE HISSER SUR UN REBORD'],
        [['@pause'], 'PAUSE'], [[], 'SUR TÉLÉPHONE : BOUTONS À L\'ÉCRAN, EN PAYSAGE']
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
        var x = 34, keys = [];
        row[0].forEach(function (k) {
          if (k.charAt(0) === '@') GP.Prompts.labels(k.slice(1)).forEach(function (label) { keys.push(label); });
          else keys.push(k);
        });
        keys.forEach(function (k) {
          if (k.charAt(0) === '#') { var im = addC(scene.add.image(x, y + 7, k.slice(1)).setOrigin(0, 0.5)); x += im.width + 4; }
          else {
            var arrows = { '←': '<', '→': '>', '↑': '^', '↓': 'v' };
            x += key(scene, addC, x, y, arrows[k] || k) + 4;
          }
        });
        var tx = keys.length ? Math.max(pg.icons ? 100 : 150, x + 6) : 34;
        var t = addC(txt(scene, tx, y + 4, row[1], P.w, { wordWrap: { width: 446 - tx }, lineSpacing: 4 }));
        y += Math.max(18, t.height + 10);
      });
      // points de pagination
      for (var i = 0; i < PAGES.length; i++)
        addC(scene.add.rectangle(GP.Config.DW / 2 - 15 + i * 10, 203, 6, 6, GP.int(i === cur ? P.g : P.e)).setOrigin(0.5));
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
        unwatch();
        evL.forEach(function (e) { kb.off(e, L); }); evR.forEach(function (e) { kb.off(e, R); });
        m.destroy();
        GP.Sfx.play('back');
        if (opts.onClose) opts.onClose();
      }
    };
    var unwatch = GP.Prompts.watch(scene, render);
    render();
    GP.Sfx.play('select');
    return handle;
  }

  /** Écran tactile (doigt) : les boutons à l'écran ne s'affichent que dans ce cas. */
  function isTouch() {
    try { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); } catch (e) { return false; }
  }

  /**
   * Manette tactile (niveaux) : un joystick flottant à gauche (il apparaît là où le doigt se pose : gauche, droite, haut pour grimper,
   * bas pour s'accroupir) ; saut à droite ; PAUSE en haut à droite (bouton du HUD).
   * Écrit l'état dans l'objet state ({ left, right, up, down, jump }) ; plusieurs doigts à la fois.
   * N'apparaît que sur écran tactile (pointer: coarse). Renvoie la liste des objets (ou []).
   */
  function touchPad(scene, state, onPause) {
    if (!isTouch()) return [];
    makeTextures(scene);
    scene.input.addPointer(3);
    var H = GP.Config.HEIGHT, W = GP.Config.WIDTH, objs = [];
    // saut
    var c = scene.add.circle(W - 32, H - 34, 24, GP.int(P.d), 0.55).setStrokeStyle(2, GP.int(P.k)).setScrollFactor(0).setDepth(55).setInteractive();
    var im = scene.add.image(W - 32, H - 34, 'ui_arr_u').setScale(2).setScrollFactor(0).setDepth(56).setTint(0xf4f7f2);
    function jOn() { state.jump = true; c.setFillStyle(GP.int(P.G), 0.8); }
    function jOff() { state.jump = false; c.setFillStyle(GP.int(P.d), 0.55); }
    c.on('pointerdown', jOn); c.on('pointerup', jOff); c.on('pointerout', jOff);
    objs.push(c, im);
    // joystick flottant : zone du bas à gauche ; la base se pose sous le doigt, le bouton suit dans un rayon limité
    var REST = { x: 52, y: H - 48 }, RADIUS = 26, DEAD = 8;
    var base = scene.add.circle(REST.x, REST.y, 28, GP.int(P.d), 0.45).setStrokeStyle(2, GP.int(P.k)).setScrollFactor(0).setDepth(55);
    var knob = scene.add.circle(REST.x, REST.y, 13, GP.int(P.m), 0.85).setStrokeStyle(2, GP.int(P.k)).setScrollFactor(0).setDepth(56);
    var zone = scene.add.zone(0, H * 0.3, W * 0.5, H * 0.7).setOrigin(0).setScrollFactor(0).setDepth(54).setInteractive();
    var active = null, ox = REST.x, oy = REST.y;
    function steer(p) {
      var dx = p.x - ox, dy = p.y - oy, d = Math.sqrt(dx * dx + dy * dy) || 1, k = d > RADIUS ? RADIUS / d : 1;
      knob.setPosition(ox + dx * k, oy + dy * k).setFillStyle(GP.int(P.g), 0.9);
      state.left = dx < -DEAD; state.right = dx > DEAD; state.up = dy < -DEAD * 1.6; state.down = dy > DEAD * 1.6;
    }
    function free() {
      active = null; state.left = state.right = state.up = state.down = false;
      base.setPosition(REST.x, REST.y); knob.setPosition(REST.x, REST.y).setFillStyle(GP.int(P.m), 0.85);
    }
    zone.on('pointerdown', function (p) {
      if (active !== null) return;
      active = p.id; ox = Math.max(36, Math.min(W * 0.5 - 20, p.x)); oy = Math.max(H * 0.45, Math.min(H - 36, p.y));
      base.setPosition(ox, oy); steer(p);
    });
    scene.input.on('pointermove', function (p) { if (active === p.id) steer(p); });
    scene.input.on('pointerup', function (p) { if (active === p.id) free(); });
    objs.push(base, knob, zone);
    var release = function () { Object.keys(state).forEach(function (k) { state[k] = false; }); free(); };
    window.addEventListener('blur', release);
    scene.input.on('gameout', release);
    scene.events.once('shutdown', function () { window.removeEventListener('blur', release); scene.input.off('gameout', release); });
    // Le bouton pause appartient au HUD commun, pas à une seconde surcouche tactile.
    return objs;
  }

  /** Fond des écrans fixes (menu, créateur, résultat) : le fond d'accueil de la planche « carte », sinon le décor généré. */
  function backdropKey(scene) { return scene.textures.exists('carte_fond_accueil') ? 'carte_fond_accueil' : 'lv_backdrop'; }

  /**
   * Prépare un écran à mise en page fixe (480×270) : on centre cette zone (la caméra est décalée de DX) et le fond,
   * répété, remplit toute la largeur de l'écran. Les textes et boutons de l'écran restent donc écrits en coordonnées 0-480.
   * dim : opacité d'un voile sombre sur le fond (0 = aucun).
   */
  function backdrop(scene, dim) {
    var W = GP.Config.WIDTH, H = GP.Config.HEIGHT, dx = GP.Config.DX;
    scene.cameras.main.setScroll(-dx, 0);
    var bg = scene.add.tileSprite(-dx, 0, W, H, backdropKey(scene)).setOrigin(0).setDepth(-100);
    if (dim) scene.add.rectangle(-dx, 0, W, H, GP.int(P.k), dim).setOrigin(0).setDepth(-99);
    return bg;
  }

  /** Découpe des paragraphes en pages qui tiennent dans une zone (largeur, hauteur en px) ; coupe entre deux phrases. */
  function paginate(scene, paragraphs, width, height, advanced) {
    var probe = txt(scene, -1000, -1000, '', P.w, { wordWrap: { width: width, useAdvancedWrap: !!advanced }, lineSpacing: 4 });
    function fits(t) { probe.setText(t); return probe.height <= height; }
    var pieces = [];
    paragraphs.forEach(function (p) {
      if (fits(p)) { pieces.push(p); return; }
      var cur = '';
      p.split(/(?<=[.!?])\s+/).forEach(function (s) {
        var next = cur ? cur + ' ' + s : s;
        if (cur && !fits(next)) { pieces.push(cur); cur = s; } else cur = next;
      });
      if (cur) pieces.push(cur);
    });
    var pages = [], page = '';
    pieces.forEach(function (p) {
      var next = page ? page + '\n\n' + p : p;
      if (page && !fits(next)) { pages.push(page); page = p; } else page = next;
    });
    if (page) pages.push(page);
    // Une phrase isolée peut dépasser une page : découper aux mots, sans en supprimer.
    var safe = [];
    pages.forEach(function (text) {
      if (fits(text)) { safe.push(text); return; }
      var buffer = '';
      (text.match(/\S+\s*/g) || ['']).forEach(function (word) {
        if (buffer && !fits(buffer + word)) { safe.push(buffer.trim()); buffer = ''; }
        buffer += word;
      });
      if (buffer.trim()) safe.push(buffer.trim());
    });
    probe.destroy();
    return safe;
  }

  /**
   * Fenêtre de texte en plusieurs pages (confidentialité…). Navigation : boutons, flèches ←/→ ; Échap ferme
   * (l'appelant gère Échap en appelant close()). Renvoie { objs, close() }.
   */
  function pagedText(scene, title, paragraphs, opts) {
    opts = opts || {};
    var pages = paginate(scene, paragraphs.map(function (p) { return GP.t(p); }), 412, 156), cur = 0, content = [];
    var m = modal(scene, title, '');
    function render() {
      content.forEach(function (o) { o.destroy(); }); content = [];
      m.titleRight.setText(pages.length > 1 ? (cur + 1) + '/' + pages.length : '');
      content.push(m.add(txt(scene, 34, 40, pages[cur], P.w, { wordWrap: { width: 412 }, lineSpacing: 4 })));
      if (pages.length > 1) for (var i = 0; i < pages.length; i++)
        content.push(m.add(scene.add.rectangle(GP.Config.DW / 2 - (pages.length - 1) * 5 + i * 10, 203, 6, 6, GP.int(i === cur ? P.g : P.e)).setOrigin(0.5)));
      prev.label.setAlpha(cur > 0 ? 1 : 0.35); next.label.setAlpha(cur < pages.length - 1 ? 1 : 0.35);
    }
    function go(d) { var n = Math.max(0, Math.min(pages.length - 1, cur + d)); if (n !== cur) { cur = n; GP.Sfx.play('step'); render(); } }
    var prev = button(scene, 34, 214, 110, '< PRÉCÉDENT', function () { go(-1); });
    var close = button(scene, 195, 214, 90, 'FERMER', function () { h.close(); });
    var next = button(scene, 336, 214, 110, 'SUIVANT >', function () { go(1); }, { primary: true });
    m.add(prev.objs); m.add(close.objs); m.add(next.objs);
    var kb = scene.input.keyboard, L = function () { go(-1); }, R = function () { go(1); };
    kb.on('keydown-LEFT', L); kb.on('keydown-RIGHT', R);
    var h = {
      objs: m.objs, open: true,
      close: function () {
        if (!h.open) return; h.open = false;
        kb.off('keydown-LEFT', L); kb.off('keydown-RIGHT', R);
        m.destroy(); GP.Sfx.play('back');
        if (opts.onClose) opts.onClose();
      }
    };
    render(); GP.Sfx.play('select');
    return h;
  }

  return { backdrop: backdrop, paginate: paginate, pagedText: pagedText, isTouch: isTouch, touchPad: touchPad, backdropKey: backdropKey, txt: txt, button: button, backIcon: backIcon, modal: modal, help: help, key: key, makeTextures: makeTextures, PAGES: PAGES };
})();
