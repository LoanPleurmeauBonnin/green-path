/**
 * EditorHub — la page d'accueil de l'éditeur : un contrôle segmenté « Niveaux / Textures », les 12 niveaux en cartes (aperçu dessiné,
 * statut original / brouillon / publié) et la galerie des textures. Un clic sur une carte ouvre le niveau dans l'éditeur (GP.Ed).
 * GP.EdThumb dessine l'aperçu d'un niveau (carte et mini-carte de l'éditeur) à partir de son document, sans Phaser.
 */
GP.EdThumb = (function () {
  var avg = {};
  /** Couleur moyenne d'un sprite (les pixels opaques de sa première image). */
  function color(id, fallback) {
    if (avg[id]) return avg[id];
    var s = GP.Kit && GP.Kit.sprite(id), out = fallback || '#8a7a6a';
    if (s) {
      var rows = s.frames_rows ? s.frames_rows[0] : s.rows, r = 0, g = 0, b = 0, n = 0;
      rows.forEach(function (row) { for (var x = 0; x < row.length; x++) { var ch = row.charAt(x); if (ch === '.' || !GP.SPRITE_PAL[ch]) continue; var v = parseInt(GP.SPRITE_PAL[ch].slice(1), 16); r += v >> 16 & 255; g += v >> 8 & 255; b += v & 255; n++; } });
      if (n) out = 'rgb(' + Math.round(r / n) + ',' + Math.round(g / n) + ',' + Math.round(b / n) + ')';
    }
    return (avg[id] = out);
  }
  /** Aperçu dessiné d'un niveau : ciel, eau, blocs (dessus et matière), rangées, colonnes, dangers, ennemis, pixels, lanternes, départ, arrivée. */
  function draw(d, o) {
    var w = o.w, h = o.h, c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'), sx = w / d.largeur, sy = h / d.hauteur;
    var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#79aed3'); g.addColorStop(1, '#d4e8f4'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    function rect(tx, ty, tw, th, col, minPx) { x.fillStyle = col; x.fillRect(tx * sx, ty * sy, Math.max(minPx || 0, tw * sx), Math.max(minPx || 0, th * sy)); }
    (d.dangers || []).forEach(function (hz) { if (hz.kind === 'eau_mortelle') rect(hz.x, hz.y, hz.w || 1, 1, '#3b6ea5'); });
    (d.eau || []).forEach(function (e) { rect(e.x, e.y, e.w, d.hauteur - e.y, '#3b6ea5'); });
    (d.plateformes || []).forEach(function (p) {
      if (p.fond || p.pilier) return;
      if (p.type === 'masse') {
        var bottom = p.fill_to !== undefined ? p.fill_to : (p.to !== undefined ? p.to : d.hauteur);
        var herbe = p.style === 'herbe' && !p.top_sprite;
        rect(p.x, p.y, p.w || 1, bottom - p.y, herbe ? '#8a5a3a' : color(p.fill_sprite || (d.tuiles && d.tuiles[p.tuiles] && d.tuiles[p.tuiles].plein[0]) || '', '#9a8a78'));
        rect(p.x, p.y, p.w || 1, 1, herbe ? '#5cbf3f' : color(p.top_sprite || (d.tuiles && d.tuiles[p.tuiles] && d.tuiles[p.tuiles].haut[0]) || '', '#b8a890'), 1);
      } else if (p.type === 'rampe') {
        x.fillStyle = color(p.fill_sprite || '', '#9a8a78'); x.beginPath();
        x.moveTo(p.x0 * sx, (p.bottom || d.hauteur) * sy); x.lineTo(p.x0 * sx, p.y0 * sy); x.lineTo(p.x1 * sx, p.y1 * sy); x.lineTo(p.x1 * sx, (p.bottom || d.hauteur) * sy); x.closePath(); x.fill();
      } else if (p.type === 'colonne') rect(p.x, p.y_top, 1.5, p.sol_y - p.y_top, '#d8cdb4', 1);
      else if (p.type === 'pont' || p.type === 'galerie') rect(p.x, p.y, p.w || 1, 0.5, color((p.sprite_set && p.sprite_set[1]) || p.sprite || '', '#c9a063'), 1);
      else if (p.type === 'pad' && p.mecanique) rect(p.x, p.y, p.w || 1, 0.5, '#7fb3d5', 1);
    });
    (d.mobiles || []).forEach(function (m) { rect(m.x1, m.y1, m.w || 2, 0.5, '#7fb3d5', 1); });
    (d.dangers || []).forEach(function (hz) { if (hz.kind !== 'eau_mortelle') rect(hz.x, hz.y, hz.w || 1, 1, hz.kind === 'mortel' ? '#b5523b' : '#e8873a', 1.5); });
    (d.ennemis || []).forEach(function (e) { rect(e.x !== undefined ? e.x : e.x1, e.y !== undefined ? e.y : e.y1, 1, 1, '#e8873a', 2); });
    (d.checkpoints || []).forEach(function (cp) { rect(cp.x, cp.y - 1, 0.7, 2, '#f4f7f2', 1.5); });
    (d.pixels || []).forEach(function (p) { rect(p.x, p.y, 1, 1, '#f4d35e', 2); });
    if (d.spawn) rect(d.spawn.x, d.spawn.y - 1, 1, 2, '#5cbf3f', 2.5);
    if (d.arrivee && d.arrivee.declencheur) rect(d.arrivee.declencheur.x, d.arrivee.declencheur.y - 2, 1.5, 3, '#c04ad6', 3);
    return c;
  }
  /** Aperçu d'un niveau réellement joué (GP.LEVELS : grille, ronces, pics, murs, pixels, lanternes, ennemis), à `k` pixels par tuile. */
  function drawLevel(L, k) {
    var c = document.createElement('canvas'); c.width = L.width * k; c.height = L.rows * k;
    var x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, c.height); g.addColorStop(0, '#79aed3'); g.addColorStop(1, '#d4e8f4'); x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    function cell(tx, ty, tw, th, col) { x.fillStyle = col; x.fillRect(tx * k, ty * k, Math.max(1, tw * k), Math.max(1, th * k)); }
    var COL = { 1: '#8a5a3a', 2: '#9a8a78', 3: '#7fb3d5', 4: '#4a9a3a', 5: '#b8a890' };
    for (var ty = 0; ty < L.rows; ty++) for (var tx = 0; tx < L.width; tx++) {
      var v = L.grid[ty * L.width + tx]; if (!v) continue;
      cell(tx, ty, 1, v === 3 ? 0.4 : 1, COL[v] || '#9a8a78');
      if (v === 1 && !L.grid[(ty - 1) * L.width + tx]) cell(tx, ty, 1, 0.4, '#5cbf3f');   // dessus d'herbe
    }
    (L.walls || []).forEach(function (w) { cell(w.x, w.top, 1, w.bottom - w.top + 1, '#2f4a6a'); });
    (L.thorns || []).forEach(function (t) { cell(t.x, t.y, 1, 1, '#b5523b'); });
    (L.spikes || []).forEach(function (sp) { cell(sp.x, L.top(sp.x) - 1, sp.w, 1, '#e8873a'); });
    ['patrols', 'muses', 'molds', 'gardes', 'fallers', 'jets', 'barrels', 'gargoyles', 'slits', 'hangers', 'cranes', 'drafts', 'elephants'].forEach(function (key) {
      (L[key] || []).forEach(function (o) {
        var ox = o.x !== undefined ? o.x : (o.x0 !== undefined ? o.x0 : o.west);
        if (ox === undefined) return;
        var oy = o.y !== undefined ? o.y : (o.y0 !== undefined ? o.y0 : L.top(Math.floor(ox)) - 1);
        cell(ox, oy, 1, 1, '#e8873a');
      });
    });
    (L.checks || []).forEach(function (p) { cell(p.x, p.y - 1, 0.7, 2, '#f4f7f2'); });
    (L.pixels || []).forEach(function (p) { cell(p.x, p.y, 1, 1, '#f4d35e'); });
    cell(L.startX, L.startRow - 1, 1, 2, '#5cbf3f');
    return c;
  }
  return { draw: draw, drawLevel: drawLevel, color: color };
})();

GP.EdHub = (function () {
  var which = 'levels', texFilter = '', texSheet = '';
  function el() { return GP.Ed.el.apply(null, arguments); }

  /** Le document montré sur une carte : le brouillon s'il y en a un, sinon la version publiée ou l'original. */
  function docOf(id, idx) {
    var d = null; try { d = JSON.parse(localStorage.getItem('greenpath.editor.draft.' + id)); } catch (e) { d = null; }
    if (d && d.doc && !GP.Content.checkLevel(d.doc, idx)) return d.doc;
    return GP.GZONES[idx];
  }
  function levelCard(id, idx) {
    var d = docOf(id, idx), st = GP.Ed.statusOf(id);
    var cw = Math.min(640, d.largeur * 4), cv = GP.EdThumb.draw(d, { w: cw, h: Math.max(24, Math.round(cw * d.hauteur / d.largeur)) });
    cv.className = 'thumb';
    var chip = st.draft ? ['warn', 'Brouillon'] : st.version ? ['ok', 'Publié v' + st.version] : ['', 'Original'];
    var card = el('button', { type: 'button', class: 'card', 'aria-label': 'Ouvrir ' + d.nom, onclick: function () { GP.Ed.openLevel(id); } }, [
      el('div', { class: 'thumbwrap' }, [cv]),
      el('div', { class: 'cap' }, [
        el('span', { class: 'num', text: String(idx + 1).padStart(2, '0') }),
        el('span', { class: 'name', text: d.nom }),
        el('span', { class: 'chip ' + chip[0], text: chip[1] })
      ]),
      el('div', { class: 'meta', text: d.largeur + '×' + d.hauteur + ' tuiles · ' + (d.pixels || []).length + ' pixels · ' + (d.checkpoints || []).length + ' lanternes' + (id === 'chateau' ? ' · ancien moteur' : '') })
    ]);
    return card;
  }
  /** Les niveaux réellement joués, dans l'ordre du jeu, plus le niveau bonus. */
  function playedIds() {
    var ids = GP.LOCATIONS.map(function (l) { return l.id; });
    if (GP.LEVELS['ligne-verte']) ids.push('ligne-verte');
    return ids.filter(function (id) { return GP.LEVELS[id]; });
  }
  function levelName(id) { var l = GP.LOCATIONS.filter(function (x) { return x.id === id; })[0]; return l ? l.name : 'La Ligne Verte (bonus)'; }
  /** Compte les éléments d'un niveau joué, pour la ligne de détail. */
  function levelStats(L) {
    var ab = L.abilities || {}, caps = Object.keys(ab).filter(function (k) { return ab[k]; });
    return L.width + '×' + L.rows + ' tuiles · ' + (L.pixels || []).length + ' pixels · ' + (L.checks || []).length + ' lanternes · ' +
      (L.thorns || []).length + ' ronces · ' + (L.spikes || []).length + ' pics à cycle · ' + (L.walls || []).length + ' murs' + (caps.length ? ' · capacités : ' + caps.join(', ') : '');
  }
  /** Fenêtre en lecture seule : le niveau tel que le jeu le joue, en grand. */
  function viewPlayed(id, n) {
    var L = GP.LEVELS[id], cv = GP.EdThumb.drawLevel(L, 8);
    cv.className = 'thumb'; cv.style.maxWidth = '100%'; cv.style.imageRendering = 'pixelated';
    var wrap = el('div', {}, [el('div', { class: 'thumbwrap', style: 'overflow:auto' }, [cv]), el('p', { class: 'hint', text: levelStats(L) }),
      el('p', { class: 'hint', text: 'Lecture seule : ce niveau est défini dans js/data/levels-ville.js (modifié par code, pas dans l’éditeur).' })]);
    var buttons = [];
    if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && id !== 'ligne-verte') buttons.push(el('a', { class: 'btn primary', href: 'index.html?dev=1&level=' + id, text: 'Essayer dans le jeu' }));
    GP.Ed.modal(String(n).padStart(2, '0') + ' · ' + levelName(id), wrap, buttons);
  }
  function playedCard(id, n) {
    var L = GP.LEVELS[id], cw = Math.min(640, L.width * 4), cv = GP.EdThumb.drawLevel(L, cw / L.width);
    cv.className = 'thumb';
    return el('button', { type: 'button', class: 'card', 'aria-label': 'Voir ' + levelName(id), onclick: function () { viewPlayed(id, n); } }, [
      el('div', { class: 'thumbwrap' }, [cv]),
      el('div', { class: 'cap' }, [el('span', { class: 'num', text: String(n).padStart(2, '0') }), el('span', { class: 'name', text: levelName(id) }), el('span', { class: 'chip', text: 'Lecture seule' })]),
      el('div', { class: 'meta', text: levelStats(L) })
    ]);
  }
  function texturesView(body) {
    var sheets = {}; GP.Ed.allSprites().forEach(function (s) { sheets[s.sheet] = 1; });
    var search = el('input', { type: 'text', placeholder: 'Chercher une texture…', value: texFilter });
    var sel = el('select', {}, [el('option', { value: '', text: 'Toutes les planches' })].concat(Object.keys(sheets).map(function (k) { var o = el('option', { value: k, text: k }); if (k === texSheet) o.selected = true; return o; })));
    var grid = el('div', { class: 'texgrid' });
    function fill() {
      grid.textContent = '';
      var list = GP.Ed.allSprites().filter(function (s) { return (!texFilter || s.id.indexOf(texFilter) >= 0) && (!texSheet || s.sheet === texSheet); });
      list.slice(0, 500).forEach(function (s) {
        grid.appendChild(el('button', { type: 'button', class: 'texcard', title: s.id + ' · ' + s.w + '×' + s.h, onclick: function () { GP.Ed.openTexture(s); } }, [GP.Ed.thumb(s.rows, s.w, s.h), el('span', { text: s.id })]));
      });
      if (list.length > 500) grid.appendChild(el('p', { class: 'hint', text: list.length - 500 + ' autres : affine la recherche.' }));
    }
    search.addEventListener('input', function () { texFilter = search.value.toLowerCase(); fill(); });
    sel.addEventListener('change', function () { texSheet = sel.value; fill(); });
    body.appendChild(el('div', { class: 'toolrow' }, [GP.Ed.btn('+ Nouvelle texture', function () { GP.Ed.openTexture(null, true); }, 'primary'), search, sel]));
    body.appendChild(grid); fill();
  }
  function render(w) {
    if (w) which = w;
    var root = document.getElementById('hub'); root.textContent = '';
    var seg = el('div', { class: 'seg', role: 'tablist' });
    [['levels', 'Niveaux'], ['tex', 'Textures']].forEach(function (t) {
      seg.appendChild(el('button', { type: 'button', role: 'tab', 'aria-selected': which === t[0] ? 'true' : 'false', class: which === t[0] ? 'on' : '', text: t[1], onclick: function () { which = t[0]; render(); } }));
    });
    var head = el('header', { class: 'hub-head' }, [
      el('a', { href: 'index.html', class: 'btn', text: '← Jeu' }),
      el('h1', { text: which === 'levels' ? 'Éditeur de niveaux' : 'Éditeur de textures' }),
      seg, el('span', { class: 'grow' }),
      el('span', { class: 'hint', text: (GP.Cloud.pseudo || '') + (GP.Ed.online ? ' · en ligne' : ' · hors ligne (brouillons seulement)') })
    ]);
    var body = el('main', { class: 'hub-body' });
    root.appendChild(head); root.appendChild(body);
    if (which === 'levels') {
      body.appendChild(el('p', { class: 'hint lead', text: 'Les niveaux ci-dessous sont ceux que le jeu joue réellement (12 niveaux et « La Ligne Verte »). Ils sont en lecture seule : clique sur un niveau pour le voir en grand.' }));
      var played = el('div', { class: 'cards' });
      playedIds().forEach(function (id, i) { played.appendChild(playedCard(id, i + 1)); });
      body.appendChild(played);
      // anciens documents GZones : l'édition ne change plus le niveau joué (Content.applyLevel les remplace seulement dans l'ancien moteur)
      var grid = el('div', { class: 'cards' });
      GP.Ed.order.forEach(function (id, i) { grid.appendChild(levelCard(id, i)); });
      body.appendChild(el('details', {}, [
        el('summary', { text: 'Anciens documents GZones (obsolète)' }),
        el('p', { class: 'hint lead', text: 'Obsolète : ces documents ne correspondent plus aux niveaux joués (réécrits dans js/data/levels-ville.js). Ne les modifie plus ; ils restent là pour l’historique.' }),
        grid
      ]));
    } else texturesView(body);
  }
  return { render: render };
})();
