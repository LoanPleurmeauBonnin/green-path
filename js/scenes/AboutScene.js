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
    this.sections = [
      { title: 'CRÉDITS', tab: 'CRÉDITS', paragraphs: GP.L('credits').split('\n\n') },
      { title: 'CONFIDENTIALITÉ', tab: 'CONFIDENTIALITÉ', paragraphs: [1, 2, 3, 4, 5, 6].map(function (i) { return GP.L('privacy' + i); }) },
      { title: 'SOURCES ET LICENCES', tab: 'SOURCES', paragraphs: [GP.L('sources'), GP.L('heritageSources')] }
    ];
    this.sections.forEach(function (s) { s.pages = UI.paginate(self, s.paragraphs, 416, 114, true); });
    this.tabs = this.sections.map(function (s, i) {
      return UI.button(self, 20 + i * 148 + dx, 32, 144, s.tab, function () { self.selectSection(i); }, { height: 20 });
    });
    this.add.rectangle(20, 60, 440, 158, GP.int(P.d), 0.98).setOrigin(0).setStrokeStyle(2, GP.int(P.k));
    this.heading = UI.txt(this, 32, 70, '', P.g);
    this.counter = UI.txt(this, 448, 70, '', P.m).setOrigin(1, 0);
    this.body = UI.txt(this, 32, 92, '', P.w, { wordWrap: { width: 416, useAdvancedWrap: true }, lineSpacing: 4 });
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
    this.body.setText(s.pages[this.pageIndex]);
    this.tabs.forEach(function (tab, i) { tab.hover(i === index); });
    this.prev.label.setAlpha(index || this.pageIndex ? 1 : 0.35);
    this.next.label.setAlpha(index < 2 || this.pageIndex < s.pages.length - 1 ? 1 : 0.35);
  }
  leave() {
    if (this.leaving) return; this.leaving = true;
    GP.Sfx.play('back'); this.scene.start(this.returnTo, this.returnData);
  }
};
