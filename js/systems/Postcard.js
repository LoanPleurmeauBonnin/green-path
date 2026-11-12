/**
 * Postcard (GP.Postcard) — la carte postale de fin de partie.
 *
 * À la fin du dernier niveau, le jeu garde une « fin de partie » (date, météo réelle de Nantes, étoiles) dans le
 * navigateur du joueur, puis fabrique une carte postale PNG de 1800 × 1200 px : les monuments reconstruits le long de la
 * ligne verte, l'avatar, le ciel et le pictogramme de la météo du moment, une phrase et le pseudo (facultatif).
 *
 * - Tout reste sur l'appareil : la fin de partie vit dans sa propre clé (« greenpath.postcard »), hors de la sauvegarde
 *   envoyée au serveur ; le pseudo de la carte n'est jamais envoyé.
 * - La carte revue plus tard garde la météo du jour de la fin, pas celle du moment.
 * - Rendu net : l'illustration est dessinée en 600 × 400 px puis agrandie ×3 sans lissage ; le texte est dessiné
 *   directement en grand, par multiples de 8 px (la police pixel).
 * Les fonctions de texte (phrase, date, pseudo, nom du fichier) ne touchent ni Phaser ni le DOM : elles sont testées sous Node.
 */
GP.Postcard = (function () {
  var KEY = 'greenpath.postcard';
  var LW = 600, LH = 400, S = 3;               // illustration : 600 × 400 agrandie ×3 → 1800 × 1200
  var LINE_Y = 298, BAND_Y = 310;               // ligne verte et début du bandeau de texte (en pixels de l'illustration)
  var mem = null;

  // ---------- Données ----------
  function storage() { return GP.Save && GP.Save.storage ? GP.Save.storage() : null; }
  function levels() { return GP.LOCATIONS.filter(function (l) { return l.playable; }).length; }
  function allDone() { return GP.Progression.completedCount() >= levels(); }

  function num(v, min, max, fallback) {
    var n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
  }

  /** Pseudo de la carte : lettres, chiffres, espaces et tirets, 16 caractères au plus. */
  function cleanPseudo(s) {
    return String(s == null ? '' : s).replace(/[^\p{L}\p{N} \-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16).trim();
  }

  /** Vérifie une fin de partie lue ou construite ; renvoie null si elle n'est pas exploitable. */
  function clean(d) {
    if (!d || typeof d !== 'object' || typeof d.date !== 'string' || !Number.isFinite(new Date(d.date).getTime())) return null;
    var m = d.meteo || {}, code = Number(m.code);
    var ok = !!m.disponible && Number.isInteger(code) && code >= 0 && code <= 99;
    var k = num(d.niveauxTermines, 1, 99, 1), total = num(d.total, 1, 3 * 99, 3 * k);
    return {
      date: d.date,
      meteo: ok ? { disponible: true, code: code, temperature: num(m.temperature, -60, 60, 0), estJour: !!m.estJour } : { disponible: false },
      etoiles: num(d.etoiles, 0, total, 0), total: total, niveauxTermines: k, pseudo: cleanPseudo(d.pseudo)
    };
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /** « 2026-11-12T10:42:00 » : l'heure locale du joueur, sans fuseau. */
  function isoLocal(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function write(fin) {
    var raw = JSON.stringify(fin), st = storage();
    mem = raw;
    try { if (st) st.setItem(KEY, raw); } catch (e) { /* stockage indisponible : on garde en mémoire */ }
  }

  /** Fin de partie enregistrée, ou null. */
  function get() {
    var raw = null, st = storage();
    try { raw = mem !== null ? mem : (st ? st.getItem(KEY) : null); } catch (e) { raw = mem; }
    if (!raw) return null;
    try { return clean(JSON.parse(raw)); } catch (e) { return null; }
  }

  /** Photographie du moment : date, météo actuelle (si elle est vraie, pas de secours), étoiles. */
  function snapshot() {
    var P = GP.Progression, w = GP.Weather.get();
    // une météo de secours n'est jamais présentée comme réelle ; la dernière reçue hors ligne compte si elle est récente
    var avail = w.source === 'live' || w.source === 'sim' || (w.source === 'stale' && Date.now() - w.time < 3 * 3600000);
    return clean({ date: isoLocal(new Date()), meteo: { disponible: avail, code: w.code, temperature: w.temp, estJour: w.isDay },
      etoiles: P.totalStars(), total: 3 * levels(), niveauxTermines: P.completedCount(), pseudo: '' });
  }

  /**
   * Enregistre la fin de partie une seule fois, quand tous les niveaux sont terminés (la première fin fait foi).
   * Renvoie la fin de partie, ou null tant que la partie n'est pas finie.
   */
  function record() {
    if (!allDone()) return null;
    var cur = get();
    if (cur) return cur;
    var fin = snapshot();
    if (fin) write(fin);
    return fin;
  }

  function setPseudo(p) {
    var fin = get();
    if (!fin) return null;
    fin.pseudo = cleanPseudo(p);
    write(fin);
    return fin;
  }

  function clear() {
    mem = null;
    try { var st = storage(); if (st) st.removeItem(KEY); } catch (e) { /* ignoré */ }
  }

  // ---------- Texte ----------
  var SKY = {
    fr: { clearDay: 'sous un grand soleil', clearNight: 'sous un ciel étoilé', cloudy: 'sous un ciel voilé', overcast: 'sous un ciel couvert',
          fog: 'sous la brume', drizzle: 'sous la pluie', rain: 'sous la pluie', storm: "sous l'orage", snow: 'sous la neige' },
    en: { clearDay: 'under a bright sun', clearNight: 'under a starry sky', cloudy: 'under a hazy sky', overcast: 'under an overcast sky',
          fog: 'in the mist', drizzle: 'in the rain', rain: 'in the rain', storm: 'in the storm', snow: 'in the snow' }
  };

  /** Expression du ciel tirée de la météo réelle (vide si la météo n'est pas disponible : on n'en invente pas). */
  function skyPhrase(meteo, lang) {
    if (!meteo || !meteo.disponible) return '';
    var cat = GP.Weather.categorize(meteo.code).cat, t = SKY[lang === 'en' ? 'en' : 'fr'];
    if (cat === 'clear') return meteo.estJour ? t.clearDay : t.clearNight;
    return t[cat] || t.cloudy;
  }

  function dateWord(iso, lang) {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' });
  }

  /** La phrase de la carte (voir la spécification : date, ciel, étoiles ; variantes un seul lieu, partie courte, sans météo). */
  function sentence(fin, lang) {
    lang = lang === 'en' ? 'en' : 'fr';
    var d = dateWord(fin.date, lang), n = fin.etoiles, k = fin.niveauxTermines, sky = skyPhrase(fin.meteo, lang), head, stars;
    var partial = k < GP.LOCATIONS.length;
    if (lang === 'en') {
      head = partial ? k + (k > 1 ? ' places' : ' place') + ' of Nantes rebuilt on ' + d : 'Nantes rebuilt on ' + d;
      stars = n + (n > 1 ? ' stars' : ' star') + ' out of ' + fin.total;
    } else {
      head = partial ? k + (k > 1 ? ' lieux de Nantes reconstruits' : ' lieu de Nantes reconstruit') + ' le ' + d : 'Nantes reconstruite le ' + d;
      stars = n + (n > 1 ? ' étoiles' : ' étoile') + ' sur ' + fin.total;
    }
    return head + (sky ? ', ' + sky : '') + ', ' + stars + '.';
  }

  /** Nom du fichier téléchargé, avec la date de fin. */
  function fileName(fin) { return 'green-path-nantes-' + fin.date.slice(0, 10) + '.png'; }

  // ---------- Rendu ----------
  var SKY_FILE = { day: 'jour', cloudy: 'nuageux', grey: 'gris', storm: 'orage', night: 'nuit' };
  var CLOUDS = { day: ['ciel_nuage_blanc_a', 'ciel_nuage_blanc_b', 'ciel_nuage_blanc_c'], cloudy: ['ciel_nuage_blanc_b', 'ciel_nuage_gris_c', 'ciel_nuage_blanc_a'],
    grey: ['ciel_nuage_gris_a', 'ciel_nuage_gris_b', 'ciel_nuage_gris_c'], storm: ['ciel_nuage_orage_a', 'ciel_nuage_orage_b', 'ciel_nuage_gris_b'],
    night: ['ciel_nuage_nuit_a', 'ciel_nuage_nuit_b', 'ciel_nuage_nuit_a'] };
  var CLOUD_COUNT = { clear: 1, cloudy: 3, overcast: 6, fog: 4, drizzle: 6, rain: 6, snow: 6, storm: 7 };
  var SKYLINE = { day: '#7c8fb0', cloudy: '#6f7f9c', grey: '#5f6b82', storm: '#464e66', night: '#232c4a' };
  var STAR = ['....y....', '...yyy...', '...yyy...', 'yyyyyyyyy', '.yyyyyyy.', '..yyyyy..', '.yyy.yyy.', '.yy...yy.', '.y.....y.'];

  function luminance(ctx, x, y) {
    var p = ctx.getImageData(x, y, 1, 1).data;
    return (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255;
  }

  function wrap(ctx, text, maxWidth) {
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var test = cur ? cur + ' ' + w : w;
      if (cur && ctx.measureText(test).width > maxWidth) { lines.push(cur); cur = w; } else cur = test;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  // Planche de stickers : fond sombre, l'avatar en grand au centre, les monuments reconstruits en couronne autour de lui, des éclats de pixels
  var SPARK_COLORS = ['#f4d35e', '#6fb7ff', '#ff7eb6', '#7ddc8a', '#ffffff', '#ffa94d'];
  var SPARKS = {
    plus: ['..x..', '..x..', 'xxxxx', '..x..', '..x..'],
    diamond: ['..x..', '.xxx.', 'xxxxx', '.xxx.', '..x..'],
    dot: ['xx', 'xx'],
    cross: ['x.x', '.x.', 'x.x']
  };
  var SPARK_KEYS = ['plus', 'diamond', 'dot', 'cross', 'plus', 'dot'];
  function drawGrid(c, grid, x, y, color) { grid.forEach(function (row, yy) { for (var xx = 0; xx < row.length; xx++) if (row[xx] === 'x') { c.fillStyle = color; c.fillRect(x + xx, y + yy, 1, 1); } }); }

  // Choix du joueur : la couleur de fond (gardée dans le navigateur) ; l'avatar reste toujours au centre
  var FONDS = [{ n: 'NUIT', bg: '#12141d', dot: '#1b1e2b' }, { n: 'MARINE', bg: '#0c1830', dot: '#13264a' }, { n: 'FORÊT', bg: '#0f2218', dot: '#183626' },
    { n: 'BORDEAUX', bg: '#2a0f1a', dot: '#3b1626' }, { n: 'VIOLET', bg: '#1d1233', dot: '#2a1c4a' }];
  var OPT_KEY = 'greenpath.postcard.options', opts = { fond: 0 };
  try { var rawOpt = storage() && storage().getItem(OPT_KEY); if (rawOpt) opts.fond = num(JSON.parse(rawOpt).fond, 0, FONDS.length - 1, 0); } catch (e) { /* fond par défaut */ }
  function nextFond() { opts.fond = (opts.fond + 1) % FONDS.length; try { if (storage()) storage().setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) { /* ignoré */ } return FONDS[opts.fond].n; }
  function fondName() { return FONDS[opts.fond % FONDS.length].n; }

  /** Dessine la carte (1800 × 1200 px). scene : pour lire les textures du jeu (ciel, monuments, météo). */
  function render(scene, fin, character, variant) {
    var grand = (variant || GP.Postcard.style) === 'grand';   // « grand » : un grand personnage au centre et quatre grands monuments aux coins (planche de référence n° 2)
    var PA = GP.PixelArt, lo = PA.canvas(LW, LH), c = lo.ctx, rnd = PA.rng(20261112);
    var meteo = fin.meteo, lang = GP.I18n.lang;
    var st = meteo.disponible ? { isDay: !!meteo.estJour, cat: GP.Weather.categorize(meteo.code).cat } : { isDay: true, cat: 'clear' };
    var kind = GP.LevelArt.skyKind(st);
    function tex(key) { return scene.textures.exists(key) ? scene.textures.get(key).getSourceImage() : null; }
    function put(key, x, y) { var im = tex(key); if (im) c.drawImage(im, Math.round(x), Math.round(y)); return im; }

    // fond sombre légèrement grenu
    if (grand) {   // marine profond, semé de petits carrés
      c.fillStyle = '#0c1830'; c.fillRect(0, 0, LW, LH);
      for (var gx0 = 6; gx0 < LW; gx0 += 12) for (var gy0 = 6; gy0 < LH; gy0 += 12) if (rnd() < 0.55) { c.fillStyle = rnd() < 0.12 ? '#2c5a78' : '#13264a'; c.fillRect(gx0 + Math.floor(rnd() * 5) - 2, gy0 + Math.floor(rnd() * 5) - 2, 3, 3); }
    } else {
      var pal = FONDS[opts.fond % FONDS.length];
      c.fillStyle = pal.bg; c.fillRect(0, 0, LW, LH);
      c.fillStyle = pal.dot; for (var g = 0; g < 900; g++) c.fillRect(Math.floor(rnd() * LW), Math.floor(rnd() * LH), 1, 1);
    }

    // couronne des monuments reconstruits, dans l'ordre du parcours, autour de l'avatar
    var CX = 300, CY = 176, RX = 205, RY = 98, done = GP.Progression.data.completed;
    var list = GP.LOCATIONS.filter(function (l) { return done[l.id]; }), spots = [], n = list.length;
    var bigs = [];
    if (grand) {   // quatre grands monuments aux coins (×2), les autres en petit autour
      var wish = ['cathedrale', 'chateau', 'machines', 'graslin'], corners = [[104, 98], [496, 98], [104, 236], [496, 236]];
      wish.forEach(function (id, i) { var l = list.filter(function (q) { return q.id === id; })[0]; if (l) bigs.push({ l: l, x: corners[i][0], y: corners[i][1], rad: 56, big: true }); });
      var rest = list.filter(function (l) { return !bigs.some(function (q) { return q.l === l; }); });
      bigs.forEach(function (q) { spots.push(q); });
      rest.forEach(function (l) { spots.push({ l: l, x: -999, y: -999, rad: 30, pending: true }); });
    } else list.forEach(function (l, i) {
      var a = -Math.PI / 2 + i * Math.PI * 2 / n;
      spots.push({ l: l, x: Math.round(CX + RX * Math.cos(a)), y: Math.round(CY + RY * Math.sin(a)), rad: 30 });
    });
    // la ligne verte : un pointillé qui relie la couronne
    for (var an = 0; an < 360 && !grand; an += 1.2) if (Math.floor(an / 3.6) % 2) { c.fillStyle = '#2f8a52'; c.fillRect(Math.round(CX + RX * Math.cos(an * Math.PI / 180)), Math.round(CY + RY * Math.sin(an * Math.PI / 180)), 2, 2); }

    // éclats de pixels et petits décors (soleil ou lune, nuages), posés sans recouvrir le reste
    function free(x, y, r) {
      if (y < 44 && (x < 340 || x > 420)) return false;             // titre et météo
      if (r > 20 && y - r < 42) return false;                         // un monument ne recouvre pas le titre
      if (y + r > 306 || Math.abs(x - CX) < (grand ? 74 : 56) && Math.abs(y - CY) < (grand ? 112 : 100)) return false;   // bandeau de texte, avatar
      return spots.every(function (q) { return q.pending || Math.abs(q.x - x) > q.rad + r || Math.abs(q.y - y) > q.rad + r; });   // hors du carré de chaque monument
    }
    var placed = [], tries, k;
    function spot(r) { for (tries = 0; tries < 60; tries++) { var x = 12 + r + rnd() * (LW - 24 - 2 * r), y = 14 + r + rnd() * (LH - 28 - 2 * r); if (free(x, y, r) && placed.every(function (q) { return Math.hypot(q.x - x, q.y - y) > r + q.r + 6; })) { placed.push({ x: x, y: y, r: r }); return { x: x, y: y }; } } return null; }
    var deco = [kind === 'night' ? 'ciel_lune_croissant' : (st.cat === 'clear' || st.cat === 'cloudy') ? 'ciel_soleil' : null];
    var clouds = { day: ['ciel_nuage_blanc_a', 'ciel_nuage_blanc_b'], cloudy: ['ciel_nuage_blanc_b', 'ciel_nuage_gris_c'], grey: ['ciel_nuage_gris_a', 'ciel_nuage_gris_b'], storm: ['ciel_nuage_orage_a', 'ciel_nuage_gris_b'], night: ['ciel_nuage_nuit_a', 'ciel_nuage_nuit_b'] }[kind] || [];
    deco = deco.concat(clouds).filter(Boolean);
    deco.forEach(function (key) { var im = tex(key), p = im && spot(Math.max(im.width, im.height) / 2); if (im && p) c.drawImage(im, Math.round(p.x - im.width / 2), Math.round(p.y - im.height / 2)); });
    spots.forEach(function (q) { if (q.pending) { var pm = spot(28); if (pm) { q.x = Math.round(pm.x); q.y = Math.round(pm.y); q.pending = false; } } });
    var starGrid = STAR.map(function (row) { return row.replace(/y/g, 'x'); });                                 // une étoile autocollant par étoile gagnée
    for (k = 0; k < Math.min(36, fin.etoiles); k++) { var ps = spot(9); if (ps) { drawGrid(c, starGrid, Math.round(ps.x) - 1, Math.round(ps.y) - 1, '#2a1f0a'); drawGrid(c, starGrid, Math.round(ps.x), Math.round(ps.y), '#f4d35e'); } }
    for (k = 0; k < 90; k++) { var p = spot(5); if (p) drawGrid(c, SPARKS[SPARK_KEYS[k % SPARK_KEYS.length]], Math.round(p.x), Math.round(p.y), SPARK_COLORS[Math.floor(rnd() * SPARK_COLORS.length)]); }

    // les monuments en autocollants : contour crème, puis le dessin
    spots.forEach(function (q) {
      if (q.big || q.pending) return;
      var im = tex(GP.MapArt.monument(q.l, false));
      if (!im) return;
      var x = Math.round(q.x - im.width / 2), y = Math.round(q.y - im.height / 2), o = PA.canvas(im.width, im.height);
      o.ctx.drawImage(im, 0, 0); o.ctx.globalCompositeOperation = 'source-in'; o.ctx.fillStyle = '#fff4d8'; o.ctx.fillRect(0, 0, im.width, im.height);
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) { c.drawImage(o.cv, x + d[0], y + d[1]); });
      c.drawImage(im, x, y);
    });

    // agrandissement ×3 sans lissage, puis les éléments dessinés en grand : texte, avatar, étoile
    var cv = PA.canvas(LW * S, LH * S), ctx = cv.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lo.cv, 0, 0, LW * S, LH * S);
    var W = LW * S, H = LH * S, font = GP.Config.FONT, ink = '#f4f7f2';
    ctx.textBaseline = 'top';
    function text(s, x, y, px, color, align) { ctx.font = px + 'px ' + font; ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.fillText(s, x, y); }

    // les quatre grands monuments (×2), autocollants à contour crème
    bigs.forEach(function (q) {
      var im = tex(GP.MapArt.monument(q.l, false));
      if (!im) return;
      var K = 6, bw = im.width * K, bh = im.height * K, bx = Math.round(q.x * S - bw / 2), by = Math.round(q.y * S - bh / 2), o = PA.canvas(im.width, im.height);
      o.ctx.drawImage(im, 0, 0); o.ctx.globalCompositeOperation = 'source-in'; o.ctx.fillStyle = '#fff4d8'; o.ctx.fillRect(0, 0, im.width, im.height);
      [[-K, 0], [K, 0], [0, -K], [0, K]].forEach(function (d) { ctx.drawImage(o.cv, bx + d[0], by + d[1], bw, bh); });
      ctx.drawImage(im, bx, by, bw, bh);
    });

    // l'avatar du joueur, grand, au centre : c'est le sujet de la carte
    var cfg = GP.Character.sanitize(character || GP.Character.defaultConfig()), grid = GP.Character.compose(cfg, 'cheer0'), AS = grand ? 22 : 13;
    var aw = GP.Character.W * AS, ah = GP.Character.H * AS, ax = Math.round(CX * S - aw / 2), ay = Math.round(CY * S - ah / 2);
    ctx.fillStyle = 'rgba(255,244,216,0.10)'; ctx.fillRect(ax - 18, ay + ah + 4, aw + 36, 14);   // ombre au sol
    // contour crème : même style d'autocollant
    for (var gy = 0; gy < GP.Character.H; gy++) for (var gx = 0; gx < GP.Character.W; gx++) if (grid[gy][gx]) [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(function (d) { ctx.fillStyle = '#fff4d8'; ctx.fillRect(ax + (gx + d[0]) * AS, ay + (gy + d[1]) * AS, AS, AS); });
    for (gy = 0; gy < GP.Character.H; gy++) for (gx = 0; gx < GP.Character.W; gx++)
      if (grid[gy][gx]) { ctx.fillStyle = grid[gy][gx]; ctx.fillRect(ax + gx * AS, ay + gy * AS, AS, AS); }

    // titre et météo
    text('GREEN PATH · NANTES', 60, 54, 48, ink);
    if (meteo.disponible) {
      GP.WeatherFX.makeTextures(scene);
      var icon = GP.Weather.categorize(meteo.code).icon;
      if (!meteo.estJour && icon === 'sun') icon = 'moon';
      if (!meteo.estJour && icon === 'part') icon = 'moonpart';
      var temp = meteo.temperature + '°C', im = tex('wx_' + icon);
      ctx.font = '40px ' + font;
      var tw = ctx.measureText(temp).width;
      if (im) ctx.drawImage(im, W - 60 - tw - 24 - im.width * 6, 40, im.width * 6, im.height * 6);
      text(temp, W - 60, 62, 40, ink, 'right');
    }

    // bandeau de texte (comme la légende d'une planche d'autocollants) : sombre, liseré vert, phrase, pseudo et étoiles
    ctx.fillStyle = 'rgba(8,9,14,0.92)'; ctx.fillRect(0, BAND_Y * S, W, H - BAND_Y * S);
    ctx.fillStyle = GP.PAL.g; ctx.fillRect(0, BAND_Y * S, W, 6);
    ctx.font = '32px ' + font;
    wrap(ctx, sentence(fin, lang), W - 120).slice(0, 3).forEach(function (line, i) { text(line, 60, BAND_Y * S + 44 + i * 50, 32, ink); });
    var fy = H - 32 - 36;
    if (fin.pseudo) text(fin.pseudo, 60, fy, 32, ink);
    var label = fin.etoiles + ' / ' + fin.total;
    ctx.font = '32px ' + font;
    var lw = ctx.measureText(label).width, sx = W - 60 - lw - 20 - 9 * 4;
    STAR.forEach(function (row, yy) { for (var xx = 0; xx < 9; xx++) if (row[xx] === 'y') { ctx.fillStyle = '#e0a82e'; ctx.fillRect(sx + xx * 4, fy - 2 + yy * 4, 4, 4); } });
    text(label, W - 60, fy, 32, ink, 'right');
    return cv.cv;
  }

  /** Aperçu lissé à la taille de l'écran du jeu (la carte réelle reste en 1800 × 1200). */
  function preview(card, w, h) {
    var o = GP.PixelArt.canvas(w, h);
    o.ctx.imageSmoothingEnabled = true; o.ctx.imageSmoothingQuality = 'high';
    o.ctx.drawImage(card, 0, 0, w, h);
    return o.cv;
  }

  /** Télécharge la carte en PNG. */
  function download(card, fin) {
    var name = fileName(fin);
    function save(url, revoke) {
      var a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      if (revoke) setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }
    if (card.toBlob && window.URL && URL.createObjectURL) card.toBlob(function (b) { if (b) save(URL.createObjectURL(b), true); else save(card.toDataURL('image/png')); }, 'image/png');
    else save(card.toDataURL('image/png'));
  }

  return {
    W: LW * S, H: LH * S, levels: levels, allDone: allDone, get: get, record: record, setPseudo: setPseudo, clear: clear,
    clean: clean, cleanPseudo: cleanPseudo, isoLocal: isoLocal, skyPhrase: skyPhrase, sentence: sentence, fileName: fileName,
    render: render, preview: preview, download: download, style: 'planche', nextFond: nextFond, fondName: fondName
  };
})();
