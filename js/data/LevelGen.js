/**
 * LevelGen (GP.LevelGen) — assemble un niveau à partir de « tronçons » de conception aux règles explicites, à la manière des
 * générateurs de niveaux de plateforme (MarioGPT : un niveau est une suite de motifs lisibles, puis un agent vérifie qu'il se joue).
 * Ici les règles sont dans le code, et le contrôle est GP.Solvability (le joueur simulé) + GP.Lint.
 *
 * Un niveau = un plan : une suite de tronçons qui suivent le rythme « respirer → enseigner → tester → combiner ».
 *   rest(n)          sol plat sans danger ; lanterne optionnelle
 *   gap(n)           trou de n tuiles (3 confortable, 4 difficile) rempli d'eau ; arc de pixels ; 3 tuiles d'atterrissage garanties
 *   stones(n)        trou franchi par des pontons de 2 tuiles espacés de 2
 *   up(k) / down(k)  escalier : k marches d'1 tuile (2 tuiles de large) ; jamais plus d'1 tuile de dénivelé par marche
 *   block(h)         bloc plein de h tuiles (1 à 3) à sauter
 *   wall()           mur de 3,5 tuiles : enseigne l'accroche (↑ maintenu)
 *   spikes(n)        n tuiles de pointes (3 au plus)
 *   row(n, rise)     rangée flottante au-dessus d'un sol plat ; rise ≤ 3 tuiles
 *   bird(n)          oiseau qui patrouille sur n tuiles de sol plat (se passe accroupi)
 *   bounce()         tremplin (parasol) vers une rangée haute
 * Règles tenues par construction : un seul nouvel élément à la fois, au moins 3 tuiles de sol plat avant chaque danger et après
 * chaque trou, un panneau avant la première rencontre de chaque nouveauté, une lanterne au plus toutes les 45 tuiles.
 */
GP.LevelGen = (function () {
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /** spec : { num, largeur, hauteur, groundY, seed, theme, plan:[[tronçon, …args]], pixels, zones:[[nom, x0, x1]], monument } */
  function generate(spec) {
    var K = GP.Kit, T = spec.theme, rand = rng(spec.seed || 1), H = spec.hauteur, W = spec.largeur;
    var b = new K.Builder({ sol_y: spec.groundY, hauteur: H });
    var x = 0, g = spec.groundY, segs = [], cand = [], taught = {}, lastLantern = 0, flatSince = 0, occupied = {}, blocks = [], notes = [];
    function note(m) { notes.push(m); }
    function occ(x0, x1) { for (var i = Math.floor(x0); i <= Math.ceil(x1); i++) occupied[i] = true; }
    function seg(x0, x1, y) { var last = segs[segs.length - 1]; if (last && last.y === y && last.x1 === x0) last.x1 = x1; else segs.push({ x0: x0, x1: x1, y: y }); }
    function px(cx, cy, hard) { cand.push({ x: cx, y: cy, hard: !!hard }); }
    /** Panneau avant la première rencontre d'une nouveauté : posé sur le sol plat, 4 tuiles avant (au plus loin que le début du sol plat). */
    function teach(kind, at) {
      if (taught[kind] || !T.signs[kind]) return; taught[kind] = true;
      var sx = Math.max(x - flatSince, Math.min(at - 4, at - 1)); sx = Math.max(2, Math.floor(sx));
      b.sign(sx, g - 1, T.signs[kind], T.signSprite); occ(sx, sx);
    }
    function flat(n) { seg(x, x + n, g); x += n; flatSince += n; }

    var marks = [];
    var chunks = {
      mark: function (nom) { marks.push({ nom: nom, x: x }); },
      rest: function (n, lantern) {
        flat(n);
        if (lantern && n >= 4) { b.lantern(x - Math.ceil(n / 2), g - 1); occ(x - Math.ceil(n / 2), x - Math.ceil(n / 2)); lastLantern = x; }
        for (var i = 2; i < n - 1; i += 3) px(x - n + i, g - 1);
      },
      gap: function (n) {
        if (flatSince < 3) note('trou après moins de 3 tuiles de sol plat (x ' + x + ')');
        teach('gap', x);
        var x0 = x; for (var yy = g + 1; yy < H; yy++) b.water(x0, n, yy);
        x += n; flatSince = 0; flat(3);
        px(x0, g - 2); px(x0 + Math.floor(n / 2), g - 3.5, n >= 4); px(x0 + n - 1, g - 2);
      },
      stones: function (n) {
        teach('stones', x);
        var x0 = x, k = 0;
        for (var yy = g + 1; yy < H; yy++) b.water(x0, n, yy);
        for (var sx = x0 + 2; sx + 2 <= x0 + n - 1; sx += 4) { b.row(sx, g, 2, T.rowSet); px(sx, g - 1.5); k++; }
        x += n; flatSince = 0; flat(3);
      },
      up: function (k) { teach('up', x); for (var i = 0; i < k; i++) { g -= 1; flat(2); px(x - 1, g - 1); } },
      down: function (k) { for (var i = 0; i < k; i++) { g += 1; flat(2); } },
      block: function (h, w) {
        w = w || 1; if (flatSince < 3) note('bloc après moins de 3 tuiles de sol plat (x ' + x + ')');
        teach('block', x); flat(2);
        b.mass(x, g - h, w, T.block || T.ground, { note: 'bloc de ' + h, grab: true }); blocks.push({ x: x, h: h, w: w });
        px(x, g - h - 1.2, h >= 3); occ(x, x + w);
        x += w; flatSince = 0; flat(3);
      },
      wall: function () {
        teach('wall', x); flat(2);
        b.mass(x, g - 3.5, 2, T.block || T.ground, { note: 'mur de 3,5 tuiles : accroche ↑', grab: true });
        px(x, g - 4.7); occ(x, x + 2); x += 2; flatSince = 0; flat(3);
      },
      spikes: function (n) {
        n = Math.min(3, n); if (flatSince < 3) note('pointes après moins de 3 tuiles de sol plat (x ' + x + ')');
        teach('spikes', x); flat(2);
        b.danger(T.spikes, x, g - 1, 'mortel', { w: n }); occ(x, x + n);
        px(x, g - 2.2); px(x + n - 1, g - 2.2, n >= 3);
        seg(x, x + n, g); x += n; flatSince = 0; flat(3);
      },
      row: function (n, rise) {
        rise = Math.min(3, rise || 3); teach('row', x); var x0 = x; flat(n + 2);
        b.row(x0 + 1, g - rise, n, T.rowSet); for (var i = 0; i < n; i += 2) px(x0 + 1 + i, g - rise - 1.2, rise >= 3 && i === 0 ? false : false);
        if (n >= 5) px(x0 + 1 + Math.floor(n / 2), g - rise - 1.2, true);
      },
      bird: function (n) {
        teach('bird', x); var x0 = x; flat(n + 4);
        b.bird('oiseau' + (b.enn.length + 1), x0 + 2, x0 + 2 + n, g, 2.6);
        px(x0 + 1, g - 1); px(x0 + n + 3, g - 1);
      },
      bounce: function () {
        teach('bounce', x); flat(2); var x0 = x;
        (b.boosts = b.boosts || []).push({ sprite: T.bounceSprite, x: x0, y: g - 1, w: 2, hauteur: 4.5, top: g - 2 });
        b.deco(T.bounceSprite, x0, g - 1); occ(x0, x0 + 2);
        flat(2); b.row(x0 + 3, g - 7, 5, T.rowSet); px(x0 + 4, g - 8.2); px(x0 + 6, g - 8.2, true); flat(6);
      }
    };
    // le plan
    spec.plan.forEach(function (step) {
      var f = chunks[step[0]]; if (!f) throw new Error('tronçon inconnu : ' + step[0]);
      var lantern = step[0] === 'rest' && step[2] === 'lantern';
      f.apply(null, step[0] === 'rest' ? [step[1], lantern] : step.slice(1));
      if (x - lastLantern > 45) note('plus de 45 tuiles sans lanterne (x ' + x + ')');
    });
    if (x > W - 16) throw new Error('le plan dépasse la largeur : x ' + x + ' > ' + (W - 16));
    // arrivée : sol plat jusqu'au bord, monument et arche
    seg(x, W, g); var ex = W - 10;
    b.sign(Math.max(x, W - 20), g - 1, T.signs.fin || 'Franchis l’arche pour terminer.', T.signSprite);
    // sols : un bloc par tronçon de même hauteur
    segs.forEach(function (s) { b.mass(s.x0, s.y, s.x1 - s.x0, T.ground, { note: 'sol' }); });
    // pixels : l'ensemble des candidats, éclairci régulièrement jusqu'au nombre voulu, complété sur le sol plat si besoin
    var chosen = cand.filter(function (p) { return p.x > 2 && p.x < W - 14; });
    while (chosen.length > spec.pixels) { var step = chosen.length / (chosen.length - spec.pixels), drop = []; for (var di = 0; di < chosen.length - spec.pixels; di++) drop.push(Math.floor(di * step + step / 2)); chosen = chosen.filter(function (_, i) { return drop.indexOf(i) < 0; }); }
    chosen.forEach(function (p) { b.px(Math.round(p.x), Math.round(p.y), p.hard); });
    // décor le long des sols plats, sans recouvrir les objets
    var dc = 0;
    segs.forEach(function (s) { for (var dx = s.x0 + 1; dx < s.x1 - 2; dx += 3 + Math.floor(rand() * 4)) { if (occupied[dx] || occupied[dx + 1]) continue; var id = T.decor[Math.floor(rand() * T.decor.length)]; b.deco(id, dx, s.y - 1); occ(dx, dx + 1); dc++; } });
    var d = b.out({
      largeur: W, hauteur: H, sol_y: spec.groundY, spawn: { x: 1, y: spec.groundY - 1 },
      arrivee: { monument: { sprite: T.monument, x: ex - 4, y: g - 1 }, arche: { sprite: 'signes_arche_arrivee', x: ex, y: g - 1 }, declencheur: { x: ex + 1, y: g - 1 } },
      boosts: b.boosts || [], temps_ref_s: spec.tempsRef || Math.round(W / 2)
    });
    d.zones = marks.map(function (m, i) { return { n: i + 1, nom: m.nom, x: [m.x, i + 1 < marks.length ? marks[i + 1].x : W] }; });
    generate.notes = notes;
    return d;
  }
  return { generate: generate, rng: rng, notes: function () { return generate.notes || []; } };
})();
