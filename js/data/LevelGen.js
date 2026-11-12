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
    (generate.themes = generate.themes || {})[spec.num] = T;   // l'éditeur s'en sert pour poser des motifs aux couleurs du lieu
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
        if (!lantern && n >= 3 && x - lastLantern >= 34) lantern = true;   // une lanterne au moins toutes les 45 tuiles : posée d'office si le plan l'oublie
        if (lantern && n >= 3) { b.lantern(x - Math.ceil(n / 2), g - 1); occ(x - Math.ceil(n / 2), x - Math.ceil(n / 2)); lastLantern = x; }
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
      /** Colonne grimpable (↑ maintenu), h ≥ 4 tuiles : le chapiteau est un appui en hauteur. */
      column: function (h) {
        teach('column', x); flat(2);
        b.plat.push({ id: b.uid('col'), type: 'colonne', x: x, y_top: g - h, sol_y: g, sprite_chapiteau: T.col.chap, sprite_fut: T.col.fut, sprite_base: T.col.base, grab: true });
        px(x, g - h - 1.5, true); occ(x, x + 2); seg(x, x + 2, g); x += 2; flatSince = 0; flat(4);
      },
      /** Rangée à 3 tuiles gardée par une gargouille qui crache vers la gauche à intervalles réguliers. */
      spout: function (n) {
        teach('spout', x); var x0 = x; flat(n + 4);
        b.row(x0 + 1, g - 3, n, T.rowSet);
        b.danger(T.spout, x0 + n, g - 4, 'cyclique', { cycle: { periode_s: 2.5, projectile: 'ciel_goutte_pluie', portee_tuiles: 3, direction: 'gauche' } });
        px(x0 + 2, g - 4.2); px(x0 + 4, g - 4.2, true);
      },
      /** Gabares : appuis flottants de 4 tuiles (ils s'enfoncent sous le poids), séparés de 3 tuiles d'eau. n = longueur du bras d'eau. */
      boats: function (n) {
        teach('boats', x); var x0 = x;
        for (var yy = g + 1; yy < H; yy++) b.water(x0, n, yy);
        for (var sx = x0 + 1; sx + 4 <= x0 + n; sx += 7) {
          var id = 'gabare' + (b.plat.length + 1);
          b.plat.push({ type: 'pad', id: id, x: sx, y: g, w: 4, solid: 'top', sur: id, mecanique: { type: 'flotteur', enfonce_tuiles: 1.5, duree_s: 1.5, remonte_s: 2 } });
          b.decor.push({ sprite: 'petit_bateau', x: sx, y: g + 0.25, id: id + 'a' }); b.decor.push({ sprite: 'petit_bateau', x: sx + 2, y: g + 0.25, id: id + 'b' });
          px(sx + 1, g - 1.5);
        }
        x += n; flatSince = 0; flat(3);
      },
      /** Balcon penché à 3 tuiles : il fait glisser (dir = +1 vers la droite, −1 vers la gauche). */
      slide: function (n, dir) {
        teach('slide', x); var x0 = x; flat(n + 2);
        b.row(x0 + 1, g - 3, n, T.rowSet, { glisse_tuiles_s: 1.2 * (dir || 1) });
        px(x0 + 2, g - 4.2); if (n >= 5) px(x0 + n - 1, g - 4.2, true);
      },
      /** Jet de vapeur : il s'arrête 1,8 s sur 3 s (annonce 0,6 s avant). */
      steam: function () {
        teach('steam', x); flat(2); seg(x, x + 2, g);
        b.danger('vapeur', x, g - 1, 'cyclique', { cycle: { periode_s: 3, actif_s: 1.2, preavis_s: 0.6, hauteur_tuiles: 3 } });
        px(x, g - 2.6); occ(x, x + 2); x += 2; flatSince = 0; flat(3);
      },
      /** Porte coulissante : se passe accroupi quand elle est basse, debout quand elle est ouverte. */
      door: function () {
        teach('door', x); flat(2); seg(x, x + 2, g);
        b.danger('hangar_porte_coulissante', x, g - 1, 'cyclique', { cycle: { periode_s: 3, libre_bas_s: 1.5, ouverte_s: 1.5, libre_bas_px: 12 }, decalage_y_px: -12 });
        occ(x, x + 2); x += 2; flatSince = 0; flat(4); px(x - 2, g - 1);
      },
      /** Trou de n tuiles (7 à 9) trop large pour un saut : l'anneau rouge au-dessus du bord donne l'élan. */
      ring: function (n) {
        teach('ring', x); var x0 = x;
        for (var yy = g + 1; yy < H; yy++) b.water(x0, n, yy);
        (b.anneaux = b.anneaux || []).push({ id: 'r' + (b.anneaux.length + 1), taille: 'grand', couleur: 'rouge', cx: x0 + 1, cy: g - 3, de: [x0 - 1, g], vers: [x0 + n + 1, g], effet: 'impulsion horizontale' });
        px(x0 + 1, g - 3, false); px(x0 + Math.floor(n / 2), g - 4.5, true);
        x += n; flatSince = 0; flat(3);
      },
      /** Marée : la flaque recouvre le sol 3 s sur 6 (elle ralentit, ne tue pas). */
      tide: function (n) {
        teach('tide', x); flat(2); seg(x, x + n, g);
        b.danger('memorial_obstacle_flaque_profonde', x, g - 1, 'cyclique', { w: n, cycle: { type: 'maree', periode_s: 6, haute_s: 3, basse_s: 3 } });
        occ(x, x + n); x += n; flatSince = 0; flat(3); px(x - 3, g - 1);
      },
      /** Complète le sol plat jusqu'à une abscisse donnée (début d'une arène conservée). */
      padTo: function (S) { if (x > S) throw new Error('le plan dépasse l’arène : x ' + x + ' > ' + S); if (x < S) chunks.rest(S - x); },
      bounce: function () {
        teach('bounce', x); flat(2); var x0 = x;
        (b.boosts = b.boosts || []).push({ sprite: T.bounceSprite, x: x0, y: g - 1, w: 2, hauteur: 4.5, top: g - 2 });
        b.deco(T.bounceSprite, x0, g - 1); occ(x0, x0 + 2);
        flat(2); b.row(x0 + 3, g - 7, 5, T.rowSet); px(x0 + 4, g - 8.2); px(x0 + 6, g - 8.2, true); flat(6);
      }
    };
    // le plan ; l'intensité (0 à 3) fait monter la difficulté : sols de respiration plus courts (4 tuiles au moins) et, après le premier
    // quart du plan, des tronçons supplémentaires du même vocabulaire, toujours séparés par 3 tuiles de sol plat
    var inten = spec.intensity || 0, tight = Math.max(0.45, 1 - 0.12 * inten), HAZ = { spikes: 1, block: 1, gap: 1, bird: 1, steam: 1, door: 1, spout: 1, stones: 1, ring: 1 };
    var pool = spec.pool || [['spikes', 3], ['spikes', 2], ['bird', 6], ['gap', 3], ['block', 2], ['spikes', 2]], quarter = Math.floor(spec.plan.length / 4), S0 = spec.tail ? spec.tail.from : null;
    var events = 0;
    function run(step) {
      if (HAZ[step[0]]) events++;
      var f = chunks[step[0]]; if (!f) throw new Error('tronçon inconnu : ' + step[0]);
      var lantern = step[0] === 'rest' && step[2] === 'lantern', n = step[1];
      if (step[0] === 'rest' && !lantern && n >= 5) n = Math.max(4, Math.round(n * tight));
      f.apply(null, step[0] === 'rest' ? [n, lantern] : step.slice(1));
      if (x - lastLantern >= 40 && flatSince >= 3 && step[0] !== 'mark') { b.lantern(x - 2, g - 1); occ(x - 2, x - 2); lastLantern = x; }   // jamais plus de 45 tuiles sans point de reprise
      if (x - lastLantern > 45) note('plus de 45 tuiles sans lanterne (x ' + x + ')');
    }
    /** Longueur approximative d'un tronçon (pour ne pas dépasser une arène imposée). */
    function cost(st) {
      var a = st[1] || 0;
      return ({ rest: a, gap: a + 3, stones: a + 3, up: 2 * a, down: 2 * a, block: 6, spikes: 7, wall: 7, row: a + 2, bird: a + 4, steam: 5, door: 6, column: 6, spout: a + 4, boats: a + 3, slide: a + 2, ring: a + 3, tide: a + 5, bounce: 12, padTo: 0, mark: 0 })[st[0]] || 0;
    }
    var remaining = spec.plan.map(cost).reduce(function (s, c) { return s + c; }, 0);
    spec.plan.forEach(function (step, i) {
      remaining -= cost(step); run(step);
      if (inten && i >= quarter && HAZ[step[0]] && rand() < Math.min(0.9, 0.3 * inten)) {
        var ex1 = pool[Math.floor(rand() * pool.length)], extra = 3 + cost(ex1);
        if ((!S0 || x + extra + remaining + 4 <= S0) && x + extra + remaining + 16 <= (spec.maxLen || 275)) { run(['rest', 4]); run(ex1); }
      }
    });
    if (spec.raw) {   // motif isolé (éditeur) : les objets du tronçon seulement, sans arrivée ni décor
      segs.forEach(function (s) { b.mass(s.x0, s.y, s.x1 - s.x0, T.ground, { note: 'sol' }); });
      var mo = { plateformes: b.plat, dangers: b.dang, ennemis: b.enn, signes: b.sig, checkpoints: b.chk, boosts: b.boosts || [], anneaux: b.anneaux || [], decor: b.decor, width: x,
        pixels: cand.map(function (p) { return { sprite: 'commun_pixel', x: Math.round(p.x), y: Math.round(p.y), difficulte: p.hard ? 'risque' : 'facile', detail_image: 1 }; }) };
      generate.notes = notes; return mo;
    }
    var tail = spec.tail, ex = W - 10;
    function xOf(o) { return o.x !== undefined ? o.x : (o.x1 !== undefined ? o.x1 : o.x0); }
    function clone(o) { return JSON.parse(JSON.stringify(o)); }
    if (tail) {
      // une arène (boss) est conservée telle quelle à partir de tail.from : le plan doit y arriver à la même hauteur de sol
      var S = tail.from, B = tail.doc;
      if (x !== S) throw new Error('le plan doit finir en x = ' + S + ' (x = ' + x + ')');
      var gb = B.plateformes.filter(function (p) { return p.type === 'masse' && p.x <= S && p.x + (p.w || 1) > S; }).map(function (p) { return p.y; });
      if (gb.length && Math.max.apply(null, gb) !== g) throw new Error('le sol à l’entrée de l’arène est à y = ' + Math.max.apply(null, gb) + ' (plan : ' + g + ')');
      B.plateformes.forEach(function (p) {
        if (p.type === 'masse') { if (p.x + (p.w || 1) <= S) return; var q = clone(p); if (q.x < S) { q.w = q.x + (q.w || 1) - S; q.x = S; } b.plat.push(q); }
        else if (xOf(p) >= S) b.plat.push(clone(p));
      });
      ['dangers', 'ennemis', 'checkpoints', 'signes', 'mobiles', 'anneaux', 'courants', 'boosts', 'eau', 'rails'].forEach(function (k) {
        var dst = k === 'dangers' ? b.dang : k === 'ennemis' ? b.enn : k === 'checkpoints' ? b.chk : k === 'signes' ? b.sig : k === 'decor' ? b.decor : (b[k] = b[k] || []);
        (B[k] || []).forEach(function (o) { if (xOf(o) >= S) dst.push(clone(o)); });
      });
      (B.pixels || []).forEach(function (p) { if (p.x >= S) b.pix.push({ x: p.x, y: p.y, difficulte: p.difficulte || 'facile' }); });
      if (!b.chk.some(function (c) { return c.x >= S && c.x < S + 25; })) b.lantern(S + 3, g - 1);
      W = B.largeur; ex = null;
    } else {
      if (W === 'auto') W = x + 16;
      ex = W - 10;
      if (x > W - 16) throw new Error('le plan dépasse la largeur : x ' + x + ' > ' + (W - 16));
      // arrivée : sol plat jusqu'au bord, monument et arche
      seg(x, W, g);
      if (W - 10 - lastLantern > 35) b.lantern(x + 2, g - 1);
      b.sign(Math.max(x, W - 20), g - 1, T.signs.fin || 'Franchis l’arche pour terminer.', T.signSprite);
    }
    // sols : un bloc par tronçon de même hauteur
    segs.forEach(function (s) { b.mass(s.x0, s.y, s.x1 - s.x0, T.ground, { note: 'sol' }); });
    // pixels : l'ensemble des candidats, éclairci régulièrement jusqu'au nombre voulu, complété sur le sol plat si besoin
    var chosen = cand.filter(function (p) { return p.x > 2 && p.x < W - 14; });
    while (chosen.length > spec.pixels) { var step = chosen.length / (chosen.length - spec.pixels), drop = []; for (var di = 0; di < chosen.length - spec.pixels; di++) drop.push(Math.floor(di * step + step / 2)); chosen = chosen.filter(function (_, i) { return drop.indexOf(i) < 0; }); }
    chosen.forEach(function (p) { b.px(Math.round(p.x), Math.round(p.y), p.hard); });
    b.pix.sort(function (p, q) { return p.x - q.x; });
    // décor le long des sols plats, sans recouvrir les objets
    var dc = 0;
    segs.forEach(function (s) { for (var dx = s.x0 + 1; dx < s.x1 - 2; dx += 3 + Math.floor(rand() * 4)) { if (occupied[dx] || occupied[dx + 1]) continue; var id = T.decor[Math.floor(rand() * T.decor.length)]; b.deco(id, dx, s.y - 1); occ(dx, dx + 1); dc++; } });
    if (T.decorFond) segs.forEach(function (s) {
      if (s.x1 - s.x0 < 10) return;
      for (var fx = s.x0 + 2; fx < s.x1 - 5; fx += 7 + Math.floor(rand() * 4)) b.deco(T.decorFond[Math.floor(rand() * T.decorFond.length)], fx, s.y - 1, { layer: 'fond' });
    });
    var d = b.out({
      largeur: W, hauteur: H, sol_y: spec.groundY, spawn: { x: 1, y: spec.groundY - 1 },
      boosts: b.boosts || [], anneaux: b.anneaux || [], courants: b.courants || [], eau: b.eau || [], mobiles: b.mobiles || [], rails: b.rails || [],
      temps_ref_s: spec.tempsRef || Math.round(W / 2)
    });
    if (!tail) d.arrivee = { monument: { sprite: T.monument, x: ex - 4, y: g - 1 }, arche: { sprite: 'signes_arche_arrivee', x: ex, y: g - 1 }, declencheur: { x: ex + 1, y: g - 1 } };
    // une arène conservée garde son boss, ses valves, ses lampes : tout ce qui n'est pas une liste d'objets du plan
    if (tail) ['boss', 'valves', 'lampes_uv', 'sequences'].forEach(function (k) { if (tail.doc[k] !== undefined) d[k] = clone(tail.doc[k]); });
    d.zones = marks.map(function (m, i) { return { n: i + 1, nom: m.nom, x: [m.x, i + 1 < marks.length ? marks[i + 1].x : W] }; });
    d.__events = events; generate.notes = notes; (generate.byNum = generate.byNum || {})[spec.num] = notes;
    return d;
  }
  /** Motifs proposés par l'éditeur : [identifiant, libellé, tronçon, arguments]. */
  var MOTIFS = [
    ['trou', 'Trou de 3', 'gap', [3]], ['trou4', 'Trou de 4 (difficile)', 'gap', [4]], ['pontons', 'Pontons sur l’eau', 'stones', [10]],
    ['escalier', 'Escalier montant (4)', 'up', [4]], ['descente', 'Escalier descendant (3)', 'down', [3]],
    ['bloc1', 'Bloc de 1', 'block', [1]], ['bloc2', 'Bloc de 2', 'block', [2]], ['bloc3', 'Bloc de 3', 'block', [3]], ['mur', 'Mur à accrocher (3,5)', 'wall', []],
    ['pointes2', 'Pointes (2)', 'spikes', [2]], ['pointes3', 'Pointes (3)', 'spikes', [3]], ['rangee', 'Rangée flottante (6)', 'row', [6, 3]], ['oiseau', 'Oiseau bas (6)', 'bird', [6]],
    ['colonne', 'Colonne grimpable', 'column', [5]], ['gargouille', 'Rangée à gargouille', 'spout', [7]], ['gabares', 'Gabares flottantes', 'boats', [15]], ['balcon', 'Balcon penché', 'slide', [5, 1]],
    ['vapeur', 'Jet de vapeur', 'steam', []], ['porte', 'Porte coulissante', 'door', []], ['anneau', 'Anneau sur grand trou', 'ring', [8]], ['maree', 'Marée', 'tide', [6]], ['parasol', 'Tremplin parasol', 'bounce', []]
  ];
  /** Un motif posé sur un sol à la hauteur groundY : { plateformes, dangers, … width } ou null si le lieu n'a pas de thème. */
  function stamp(num, motif, groundY, hauteur) {
    var T = (generate.themes || {})[num], m = MOTIFS.filter(function (e) { return e[0] === motif; })[0];
    if (!T || !m) return null;
    return generate({ num: num, largeur: 'auto', hauteur: hauteur, groundY: groundY, seed: 1, theme: T, pixels: 99, raw: true, plan: [['rest', 3], [m[2]].concat(m[3]), ['rest', 3]] });
  }
  /** Un thème pour les motifs de l'éditeur sur un niveau écrit à la main. */
  function registerTheme(num, theme) { (generate.themes = generate.themes || {})[num] = theme; }
  return { generate: generate, rng: rng, stamp: stamp, registerTheme: registerTheme, MOTIFS: MOTIFS, hasTheme: function (n) { return !!(generate.themes || {})[n]; }, notes: function (n) { return n ? ((generate.byNum || {})[n] || []) : (generate.notes || []); } };
})();
