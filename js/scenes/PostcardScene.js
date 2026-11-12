/**
 * PostcardScene — la carte postale de fin de partie : aperçu de la carte, sa phrase en texte normal, le champ du pseudo
 * (facultatif, saisi dans un vrai champ HTML posé sur le jeu pour le clavier tactile), TÉLÉCHARGER MA CARTE (PNG 1800 × 1200)
 * et RETOUR À LA CARTE (retour à la carte du jeu). Accessible depuis l'écran de fin et, plus tard, depuis le menu (MA CARTE).
 * Rien n'est envoyé : la carte est fabriquée dans le navigateur (voir GP.Postcard).
 */
GP.Scenes.Postcard = class PostcardScene extends Phaser.Scene {
  constructor() { super('Postcard'); }

  create() {
    var self = this, P = GP.PAL, UI = GP.UI, fin = GP.Postcard.record();
    this.leaving = false;
    this.cameras.main.fadeIn(350, 20, 24, 46);
    UI.backdrop(this, 0.72);
    if (!fin) { this.leave('Menu'); return; }   // pas de carte tant que la partie n'est pas terminée
    this.fin = fin;

    var DX = GP.Config.DX;   // l'écran est centré par UI.backdrop (caméra décalée de DX) : seuls les boutons (sans défilement) et le champ HTML ajoutent DX
    this.add.rectangle(20, 12, 440, 252, GP.int(P.k)).setOrigin(0);
    this.add.rectangle(22, 14, 436, 248, GP.int(P.d)).setOrigin(0);
    this.add.rectangle(22, 33, 436, 1, GP.int(P.G)).setOrigin(0);
    UI.txt(this, 32, 20, 'CARTE POSTALE', P.g);
    UI.txt(this, 450, 20, 'NANTES', P.y).setOrigin(1, 0);

    // aperçu de la carte, grand et centré (la vraie carte fait 1800 × 1200)
    this.card = GP.Postcard.render(this, fin, GP.Progression.data.character);
    GP.PixelArt.toTexture(this, 'postcard_preview', GP.Postcard.preview(this.card, 264, 176));
    this.add.rectangle(106, 36, 268, 180, GP.int(P.k)).setOrigin(0);
    this.add.image(108, 38, 'postcard_preview').setOrigin(0);

    // à gauche et à droite de la carte : changer la couleur de fond et le monument (ou l'avatar) au centre
    var bFond = UI.button(this, 26 + DX, 92, 76, 'FOND', function () { GP.Postcard.nextFond(); self.redraw(); }, { height: 18 });
    var bCentre = UI.button(this, 378 + DX, 92, 76, 'CENTRE', function () { GP.Postcard.nextCentre(); self.redraw(); }, { height: 18 });
    [bFond, bCentre].forEach(function (b) { b.objs.forEach(function (o) { o.setDepth(10); }); });
    this.fondTxt = UI.txt(this, 64, 114, '', P.y).setOrigin(0.5, 0);
    this.centreTxt = UI.txt(this, 416, 114, '', P.y).setOrigin(0.5, 0);
    this.labels();

    // en dessous : le pseudo (facultatif, la phrase est déjà sur la carte), TÉLÉCHARGER et RETOUR À LA CARTE
    this.makeInput(32, 224, 84, 18);
    var bDl = UI.button(this, 122 + DX, 224, 170, 'TÉLÉCHARGER MA CARTE', function () { self.download(); }, { primary: true, height: 18 });
    var bRe = UI.button(this, 298 + DX, 224, 150, 'RETOUR À LA CARTE', function () { self.leave('Map'); }, { height: 18 });
    [bDl, bRe].forEach(function (b) { b.objs.forEach(function (o) { o.setDepth(10); }); });
    this.status = UI.txt(this, 240, 245, '', P.g).setOrigin(0.5, 0);

    this.hint = UI.txt(this, 240, 254, '', P.m).setOrigin(0.5);
    GP.Prompts.bind(this, this.hint, '{confirm} TÉLÉCHARGER  {back} MENU');

    var kb = this.input.keyboard;
    kb.on('keydown-ENTER', function () { self.download(); });
    kb.on('keydown-SPACE', function () { self.download(); });
    kb.on('keydown-ESC', function () { self.leave('Menu'); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); self.removeInput(); });
  }

  /** Noms des choix en cours (fond, centre) sous les boutons. */
  labels() { this.fondTxt.setText(GP.Postcard.fondName()); this.centreTxt.setText(GP.Postcard.centreName()); }

  /** Redessine la carte après un choix de fond ou de centre. */
  redraw() {
    this.card = GP.Postcard.render(this, GP.Postcard.get() || this.fin, GP.Progression.data.character);
    GP.PixelArt.toTexture(this, 'postcard_preview', GP.Postcard.preview(this.card, 264, 176));
    this.labels();
    this.status.setText('');
    GP.Sfx.play('select');
  }

  /** Télécharge la carte et confirme. */
  download() {
    if (this.leaving || !this.card) return;
    GP.Postcard.download(this.card, GP.Postcard.get() || this.fin);
    GP.Sfx.play('confirm');
    this.status.setText('TA CARTE EST TÉLÉCHARGÉE !');
  }

  /** Redessine la carte avec le pseudo saisi (et le garde dans le navigateur seulement). */
  refresh() {
    var fin = GP.Postcard.setPseudo(this.pseudoInput.value);
    if (!fin) return;
    this.fin = fin;
    this.card = GP.Postcard.render(this, fin, GP.Progression.data.character);
    GP.PixelArt.toTexture(this, 'postcard_preview', GP.Postcard.preview(this.card, 264, 176));
    this.status.setText('');
  }

  /** Champ HTML du pseudo, posé sur le jeu à l'emplacement (x, y, largeur, hauteur) de l'écran 480 × 270. */
  makeInput(x, y, w, h) {
    var self = this, el = document.createElement('input'), timer = null;
    el.type = 'text'; el.maxLength = 16; el.value = this.fin.pseudo || '';
    el.placeholder = GP.t('TON NOM'); el.autocomplete = 'off'; el.spellcheck = false; el.setAttribute('aria-label', GP.t('TON NOM SUR LA CARTE (FACULTATIF)'));
    el.style.cssText = 'position:fixed;z-index:5;box-sizing:border-box;margin:0;padding:0 4px;border:2px solid ' + GP.PAL.g +
      ';background:' + GP.PAL.k + ';color:' + GP.PAL.w + ';outline:none;font-family:' + GP.Config.FONT + ';';
    document.body.appendChild(el);
    this.pseudoInput = el;
    function place() {
      var r = self.game.canvas.getBoundingClientRect(), k = r.width / GP.Config.WIDTH;
      el.style.left = (r.left + (x + GP.Config.DX) * k) + 'px'; el.style.top = (r.top + y * k) + 'px';
      el.style.width = (w * k) + 'px'; el.style.height = (h * k) + 'px'; el.style.fontSize = Math.max(8, 8 * k) + 'px';
    }
    // le clavier du jeu ne doit pas réagir quand on écrit : Entrée et Échap rendent la main au jeu
    el.addEventListener('keydown', function (ev) { ev.stopPropagation(); if (ev.key === 'Enter' || ev.key === 'Escape') { ev.preventDefault(); el.blur(); } });
    el.addEventListener('keyup', function (ev) { ev.stopPropagation(); });
    el.addEventListener('input', function () {
      var v = el.value.replace(/[^\p{L}\p{N} \-]/gu, '').slice(0, 16);
      if (v !== el.value) el.value = v;
      clearTimeout(timer); timer = setTimeout(function () { self.refresh(); }, 200);
    });
    this.placeInput = place;
    window.addEventListener('resize', place);
    this.scale.on('resize', place);
    place();
    setTimeout(place, 50);   // après la mise en page de l'écran
  }

  removeInput() {
    if (this.placeInput) { window.removeEventListener('resize', this.placeInput); this.scale.off('resize', this.placeInput); }
    if (this.pseudoInput) { this.pseudoInput.remove(); this.pseudoInput = null; }
  }

  leave(key) {
    var self = this;
    if (this.leaving) return;
    this.leaving = true;
    GP.Sfx.play('back');
    if (this.pseudoInput) this.pseudoInput.blur();
    this.cameras.main.fadeOut(300, 20, 24, 46);
    this.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start(key); });
  }
};
