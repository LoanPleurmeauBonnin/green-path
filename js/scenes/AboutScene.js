/** Trois rubriques distinctes, sous-pages uniquement lorsque le contenu dépasse la zone de lecture. */
GP.Scenes.About = class AboutScene extends Phaser.Scene {
  constructor() { super('About'); }
  init(data) {
    data = data || {};
    this.sectionIndex = Math.max(0, Math.min(2, Number(data.section) || 0));
    this.returnTo = data.returnTo === 'Options' ? 'Options' : 'Menu';
    this.returnData = data.returnData || {};
  }
  create() {
    var self = this, UI = GP.UI, P = GP.PAL, dx = GP.Config.DX;
    this.leaving = false; this.pageIndex = 0;
    UI.backdrop(this, 0.88);
    UI.txt(this, 240, 12, 'À PROPOS DE GREEN PATH', P.g).setOrigin(0.5, 0);
    // Chaque rubrique est une suite de groupes séparés par un filet ; un groupe est une suite de lignes :
    //   { p } paragraphe, { k, v } libellé vert + texte en deux colonnes, { h, p } intitulé vert puis paragraphe.
    this.sections = AboutScene.content().map(function (s) { s.pages = self.layout(s.groups); return s; });
    this.rules = [];
    this.tabs = this.sections.map(function (s, i) {
      return UI.button(self, 20 + i * 148 + dx, 32, 144, s.tab, function () { self.selectSection(i); }, { height: 20 });
    });
    this.add.rectangle(20, 60, 440, 158, GP.int(P.d), 0.98).setOrigin(0).setStrokeStyle(2, GP.int(P.k));
    this.heading = UI.txt(this, 32, 70, '', P.g);
    this.counter = UI.txt(this, 448, 70, '', P.m).setOrigin(1, 0);
    this.prev = UI.button(this, 20 + dx, 228, 120, '< PRÉCÉDENT', function () { self.page(-1); });
    this.back = UI.backIcon(this, function () { self.leave(); });
    this.next = UI.button(this, 340 + dx, 228, 120, 'SUIVANT >', function () { self.page(1); });
    GP.Prompts.bind(this, UI.txt(this, 240, 255, '', P.m).setOrigin(0.5), '{pages} PAGES  {navY} RUBRIQUES');
    var kb = this.input.keyboard;
    kb.on('keydown-LEFT', function () { self.page(-1); }); kb.on('keydown-RIGHT', function () { self.page(1); });
    kb.on('keydown-UP', function () { self.selectSection((self.sectionIndex + 2) % 3); });
    kb.on('keydown-DOWN', function () { self.selectSection((self.sectionIndex + 1) % 3); });
    kb.on('keydown-ESC', function () { self.leave(); });
    this.events.once('shutdown', function () { kb.removeAllListeners(); });
    this.render();
  }
  /** Crée les textes d'un groupe (invisibles) et mesure sa hauteur ; répartit ensuite les groupes en pages (jamais coupés). */
  layout(groups) {
    var self = this, UI = GP.UI, P = GP.PAL, X = 32, KW = 136, GAP = 5, RULE = 11, MAX = 120;
    function T(x, w, text, color) { return UI.txt(self, x, 0, text, color, { wordWrap: { width: w, useAdvancedWrap: true }, lineSpacing: 4 }).setDepth(5).setVisible(false); }
    var made = groups.map(function (items) {
      var rows = items.map(function (it) {
        var kind = it.k ? 'k' : it.h ? 'h' : 'p';
        if (it.k) { var l = T(X, KW - 8, it.k, P.g), v = T(X + KW, 416 - KW, it.v, P.w); return { kind: kind, objs: [l, v], h: Math.max(l.height, v.height), place: function (y) { l.setPosition(X, y); v.setPosition(X + KW, y); } }; }
        if (it.h) { var h = T(X, 416, it.h, P.g), b = T(X, 416, it.p, P.w); return { kind: kind, objs: [h, b], h: h.height + 3 + b.height, place: function (y) { h.setPosition(X, y); b.setPosition(X, y + h.height + 3); } }; }
        var t = T(X, 416, it.p, P.w); return { kind: kind, objs: [t], h: t.height, place: function (y) { t.setPosition(X, y); } };
      });
      rows.forEach(function (r, i) { r.gap = i ? (r.kind === rows[i - 1].kind ? GAP : 2 * GAP) : 0; });   // plus d'air quand on passe d'un type de ligne à l'autre
      return { rows: rows, h: rows.reduce(function (n, r) { return n + r.h + r.gap; }, 0) };
    });
    var pages = [], cur = null;
    made.forEach(function (g) {
      if (!cur || cur.h + RULE + g.h > MAX) { cur = { groups: [], h: 0 }; pages.push(cur); }
      cur.h += (cur.groups.length ? RULE : 0) + g.h; cur.groups.push(g);
    });
    return pages;
  }
  /** Affiche une page : lignes empilées, filet entre deux groupes. */
  showPage(page) {
    var self = this, P = GP.PAL, y = 92;
    this.sections.forEach(function (s) { s.pages.forEach(function (pg) { pg.groups.forEach(function (g) { g.rows.forEach(function (r) { r.objs.forEach(function (o) { o.setVisible(false); }); }); }); }); });
    this.rules.forEach(function (r) { r.destroy(); }); this.rules = [];
    page.groups.forEach(function (g, gi) {
      if (gi) { self.rules.push(self.add.rectangle(32, y + 4, 416, 1, GP.int(P.e)).setOrigin(0).setDepth(5)); y += 11; }
      g.rows.forEach(function (r) { y += r.gap; r.place(y); r.objs.forEach(function (o) { o.setVisible(true); }); y += r.h; });
    });
  }
  selectSection(index) { this.sectionIndex = index; this.pageIndex = 0; GP.Sfx.play('step'); this.render(); }
  page(dir) {
    var section = this.sections[this.sectionIndex], next = this.pageIndex + dir;
    if (next < 0 && this.sectionIndex > 0) { this.sectionIndex--; this.pageIndex = this.sections[this.sectionIndex].pages.length - 1; }
    else if (next >= section.pages.length && this.sectionIndex < 2) { this.sectionIndex++; this.pageIndex = 0; }
    else this.pageIndex = Math.max(0, Math.min(section.pages.length - 1, next));
    GP.Sfx.play('step'); this.render();
  }
  render() {
    var s = this.sections[this.sectionIndex], index = this.sectionIndex;
    this.heading.setText(s.title);
    this.counter.setText((index + 1) + '/3 · ' + (this.pageIndex + 1) + '/' + s.pages.length);
    this.showPage(s.pages[this.pageIndex]);
    this.tabs.forEach(function (tab, i) { tab.hover(i === index); });
    this.prev.label.setAlpha(index || this.pageIndex ? 1 : 0.35);
    this.next.label.setAlpha(index < 2 || this.pageIndex < s.pages.length - 1 ? 1 : 0.35);
  }
  leave() {
    if (this.leaving) return; this.leaving = true;
    GP.Sfx.play('back'); this.scene.start(this.returnTo, this.returnData);
  }
};

/** Contenu de « À propos » : français ici, anglais dans js/data/lang/en.js (les paragraphes de confidentialité viennent de GP.L). */
GP.Scenes.About.content = function () {
  return [
    { title: 'CRÉDITS', tab: 'CRÉDITS', groups: [
      [{ p: "Green Path - jeu de plateforme et d'exploration patrimoniale à Nantes." },
        { k: 'Florine RACINE', v: 'UX/UI Designer & Game Design' }, { k: 'Loan PLEURMEAU', v: 'Développeur web & IA Ops' },
        { p: 'Projet pédagogique ESD Nantes - PATRIMOINE.EXE, 2026.' }],
      [{ k: 'Technologies', v: 'Phaser 3.90, JavaScript, Canvas/WebGL & WebAudio' }, { k: 'Police', v: 'Press Start 2P' },
        { k: 'Services', v: 'Open-Meteo, sauvegarde Supabase & hébergement Vercel' }, { k: 'Assistance', v: 'Claude Code & Claude Design' }],
      [{ p: "Remerciements à l'ESD Nantes et aux auteurs des ressources citées dans Sources et licences." }]
    ] },
    { title: 'CONFIDENTIALITÉ', tab: 'CONFIDENTIALITÉ', groups: [
      [{ h: 'Mode invité', p: GP.L('privacy1') }], [{ h: 'Sur ton appareil', p: GP.L('privacy2') }], [{ h: 'Échanges réseau', p: GP.L('privacy3') }],
      [{ h: 'Pseudo (facultatif)', p: GP.L('privacy4') }], [{ h: 'Tout effacer', p: GP.L('privacy5') }], [{ h: 'Responsable', p: GP.L('privacy6') }]
    ] },
    { title: 'SOURCES ET LICENCES', tab: 'SOURCES', groups: [
      [{ k: 'Photo Palmarium', v: 'Pymouss44, via Wikimedia Commons (Jardin des plantes Nantes-serre.JPG), CC BY-SA 3.0. Recadrée, pixélisée en 48 × 32 et 16 couleurs, même licence.' },
        { k: 'Licence', v: 'creativecommons.org/licenses/by-sa/3.0/' }],
      [{ k: 'Météo', v: 'Open-Meteo.com, CC BY 4.0' }, { k: 'Phaser', v: 'MIT' }, { k: 'Police', v: 'Press Start 2P, licence OFL' },
        { k: 'Sprites de décor', v: 'Assistance Claude Design' }, { k: 'Détails', v: 'CREDITS.md dans le dossier du jeu' }],
      [{ h: 'Source patrimoniale principale', p: 'Château des ducs de Bretagne, site institutionnel, rubrique Histoire : chateaunantes.fr/le-chateau/histoire/. Les autres lieux constituent un corpus de variations.' }],
      [{ k: 'Parcours', v: "Le parcours du jeu n'est pas une numérotation officielle de la ligne verte." }, { k: 'Monuments', v: 'Sprites stylisés, pas des photographies.' }],
      [{ k: 'Avatar', v: "Base Figma fournie par l'équipe ; provenance et conditions de réutilisation dans CREDITS.md." },
        { k: 'Repérage', v: "Photos et références visuelles : observation seulement, non intégrées au jeu." }]
    ] }
  ];
};
