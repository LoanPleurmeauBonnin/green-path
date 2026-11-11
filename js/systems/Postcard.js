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

  /** Dessine la carte (1800 × 1200 px). scene : pour lire les textures du jeu (ciel, monuments, météo). */
  function render(scene, fin, character) {
    var PA = GP.PixelArt, lo = PA.canvas(LW, LH), c = lo.ctx, rnd = PA.rng(20261112);
    var meteo = fin.meteo, lang = GP.I18n.lang;
    var st = meteo.disponible ? { isDay: !!meteo.estJour, cat: GP.Weather.categorize(meteo.code).cat } : { isDay: true, cat: 'clear' };
    var kind = GP.LevelArt.skyKind(st), file = SKY_FILE[kind];
    function tex(key) { return scene.textures.exists(key) ? scene.textures.get(key).getSourceImage() : null; }
    function put(key, x, y) { var im = tex(key); if (im) c.drawImage(im, Math.round(x), Math.round(y)); return im; }

    // ciel en bandes (comme dans le jeu), puis soleil ou lune, étoiles et nuages
    c.fillStyle = GP.PAL.d; c.fillRect(0, 0, LW, LH);
    for (var b = 1; b <= 5; b++) { put('ciel_' + file + '_' + b, 0, (b - 1) * 54); put('ciel_' + file + '_' + b, 480, (b - 1) * 54); }
    put('ciel_' + file + '_5', 0, 270); put('ciel_' + file + '_5', 480, 270);
    var k;
    if (kind === 'night' && st.cat !== 'overcast') for (k = 0; k < 46; k++) put('ciel_etoile_' + (1 + k % 3), rnd() * LW, rnd() * 150);
    if (kind === 'night') put('ciel_lune_croissant', 440, 62);
    else if (st.cat === 'clear' || st.cat === 'cloudy') put('ciel_soleil', 440, 62);
    var clouds = CLOUDS[kind];
    for (k = 0; k < (CLOUD_COUNT[st.cat] || 2); k++) put(clouds[k % clouds.length], rnd() * (LW - 50), 24 + rnd() * 150);

    // les immeubles de Nantes au loin
    c.fillStyle = SKYLINE[kind];
    for (var bx = -4; bx < LW; ) {
      var bw = 14 + Math.floor(rnd() * 14), bh = 30 + Math.floor(rnd() * 34);
      c.fillStyle = SKYLINE[kind]; c.fillRect(bx, LINE_Y - bh, bw, bh);
      c.fillStyle = kind === 'night' ? '#f4d35e' : 'rgba(255,255,255,0.22)';
      for (var wy = LINE_Y - bh + 6; wy < LINE_Y - 8; wy += 9) for (var wx = bx + 3; wx < bx + bw - 3; wx += 6) if (kind !== 'night' || rnd() < 0.4) c.fillRect(wx, wy, 2, 3);
      bx += bw + 1 + Math.floor(rnd() * 3);
    }

    // sol d'herbe, et la ligne verte
    c.fillStyle = GP.PAL.G; c.fillRect(0, LINE_Y - 4, LW, BAND_Y - LINE_Y + 4);
    c.fillStyle = GP.PAL.g; c.fillRect(0, LINE_Y - 4, LW, 1);
    for (var lx = 0; lx < LW; lx += 8) { c.fillStyle = GP.PAL.h; c.fillRect(lx, LINE_Y, 6, 4); c.fillStyle = GP.PAL.g; c.fillRect(lx + 1, LINE_Y + 1, 4, 2); }

    // les monuments reconstruits, dans l'ordre du parcours (un sur deux un peu en retrait pour qu'ils ne se cachent pas)
    var done = GP.Progression.data.completed, list = GP.LOCATIONS.filter(function (l) { return done[l.id]; });
    var x0 = 24, x1 = 500, step = list.length > 1 ? Math.min(52, (x1 - x0 - 48) / (list.length - 1)) : 0;
    [1, 0].forEach(function (parity) {
      list.forEach(function (l, i) {
        if (i % 2 !== parity) return;
        var key = GP.MapArt.monument(l, false), im = tex(key);
        if (!im) return;
        c.drawImage(im, Math.round(x0 + i * step + (48 - im.width) / 2), LINE_Y - 1 - im.height - (parity ? 6 : 0));
      });
    });

    // précipitations et brume, devant le décor
    var n;
    if (st.cat === 'rain' || st.cat === 'drizzle' || st.cat === 'storm') {
      c.fillStyle = st.cat === 'storm' ? 'rgba(150,175,215,0.8)' : 'rgba(180,210,240,0.75)';
      for (n = st.cat === 'drizzle' ? 50 : 110; n > 0; n--) c.fillRect(Math.floor(rnd() * LW), Math.floor(rnd() * LINE_Y), 1, 3);
    } else if (st.cat === 'snow') {
      c.fillStyle = 'rgba(255,255,255,0.9)';
      for (n = 80; n > 0; n--) c.fillRect(Math.floor(rnd() * LW), Math.floor(rnd() * LINE_Y), 2, 2);
    } else if (st.cat === 'fog') {
      c.fillStyle = 'rgba(232,236,240,0.38)'; c.fillRect(0, 150, LW, LINE_Y - 150);
      c.fillStyle = 'rgba(232,236,240,0.25)'; c.fillRect(0, 100, LW, 60);
    }

    // agrandissement ×3 sans lissage, puis les éléments dessinés en grand : texte, avatar, étoile
    var cv = PA.canvas(LW * S, LH * S), ctx = cv.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(lo.cv, 0, 0, LW * S, LH * S);
    var W = LW * S, H = LH * S, font = GP.Config.FONT;
    ctx.textBaseline = 'top';
    function text(s, x, y, px, color, align) { ctx.font = px + 'px ' + font; ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.fillText(s, x, y); }

    // avatar du joueur, à côté de la ligne verte
    var cfg = GP.Character.sanitize(character || GP.Character.defaultConfig()), grid = GP.Character.compose(cfg, 'cheer0'), AS = 8;
    var ax = 540 * S, ay = (LINE_Y - 1) * S - GP.Character.H * AS;
    ctx.fillStyle = 'rgba(20,24,46,0.35)'; ctx.fillRect(ax - 4, (LINE_Y - 1) * S - 4, GP.Character.W * AS + 8, 10);
    for (var gy = 0; gy < GP.Character.H; gy++) for (var gx = 0; gx < GP.Character.W; gx++)
      if (grid[gy][gx]) { ctx.fillStyle = grid[gy][gx]; ctx.fillRect(ax + gx * AS, ay + gy * AS, AS, AS); }

    // titre et météo : dark sur ciel clair, clair sur ciel sombre
    var ink = luminance(c, 8, 8) > 0.55 ? '#23233a' : '#f4f7f2';
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

    // bandeau de texte : clair sous un ciel clair (texte foncé), sombre sous un ciel sombre (texte clair)
    var light = luminance(c, 8, 200) > 0.55, band = light ? '#f1ead6' : '#14182e', fg = light ? '#23233a' : '#f4f7f2';
    ctx.fillStyle = band; ctx.fillRect(0, BAND_Y * S, W, H - BAND_Y * S);
    ctx.fillStyle = GP.PAL.g; ctx.fillRect(0, BAND_Y * S, W, 6);
    ctx.font = '32px ' + font;
    wrap(ctx, sentence(fin, lang), W - 120).slice(0, 3).forEach(function (line, i) { text(line, 60, BAND_Y * S + 44 + i * 50, 32, fg); });
    var fy = H - 32 - 36;
    if (fin.pseudo) text(fin.pseudo, 60, fy, 32, fg);
    var label = fin.etoiles + ' / ' + fin.total;
    ctx.font = '32px ' + font;
    var lw = ctx.measureText(label).width, sx = W - 60 - lw - 20 - 9 * 4;
    STAR.forEach(function (row, yy) { for (var xx = 0; xx < 9; xx++) if (row[xx] === 'y') { ctx.fillStyle = '#e0a82e'; ctx.fillRect(sx + xx * 4, fy - 2 + yy * 4, 4, 4); } });
    text(label, W - 60, fy, 32, fg, 'right');
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
    render: render, preview: preview, download: download
  };
})();
