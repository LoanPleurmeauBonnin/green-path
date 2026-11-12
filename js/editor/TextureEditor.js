/**
 * TextureEditor (GP.TexEd) — l'éditeur de textures de l'éditeur (editor.html) : dessin pixel par pixel d'un sprite (1 à 64 px de côté,
 * 16×16 pour une tuile) avec la palette du jeu (GP.SPRITE_PAL), à partir d'un sprite existant ou d'une page vide.
 *  - modifier un sprite existant : la version publiée REMPLACE l'original partout dans le jeu (on peut revenir à l'original) ;
 *  - créer une texture : « Nouvelle texture » (ou « Dupliquer ») ajoute un sprite « perso_… » utilisable dans les niveaux.
 * Les textures sont publiées dans Supabase (admin) puis appliquées par GP.Content au démarrage du jeu.
 */
GP.TexEd = (function () {
  var E = null;               // GP.Ed (chargé après)
  var host = null, left = null, right = null;
  var cur = null;             // { id, w, h, frames: [grille de lettres], f, anchor, tile_x, label, isNew, existing }
  var tool = 'pencil', color = 'g', mirror = false, undo = [], zoom = 16, painting = false, canvas = null, lastCell = null, previewTimer = null;
  var drafts = {};            // textures modifiées non publiées (pour l'essai)
  var filter = '', sheetFilter = '';

  function el() { return E.el.apply(null, arguments); }
  function btn() { return E.btn.apply(null, arguments); }
  function grid(rows, w, h) { var g = []; for (var y = 0; y < h; y++) { var r = []; for (var x = 0; x < w; x++) r.push(rows && rows[y] ? rows[y].charAt(x) || '.' : '.'); g.push(r); } return g; }
  function rowsOf(g) { return g.map(function (r) { return r.join(''); }); }
  function snapshot() { return JSON.stringify({ w: cur.w, h: cur.h, frames: cur.frames, f: cur.f }); }
  function pushUndo() { undo.push(snapshot()); if (undo.length > 40) undo.shift(); }
  function doUndo() { if (!undo.length || !cur) return; var s = JSON.parse(undo.pop()); cur.w = s.w; cur.h = s.h; cur.frames = s.frames; cur.f = s.f; redraw(); refreshRight(); }

  /** Ouvre un sprite existant (copie) ou une texture vide. */
  function open(spriteOrNew) {
    undo = [];
    if (spriteOrNew.s) {
      var s = spriteOrNew.s, frames = (s.frames_rows || [s.rows]).map(function (r) { return grid(r, s.w, s.h); });
      cur = { id: s.id, w: s.w, h: s.h, frames: frames, f: 0, anchor: s.anchor || 'top-left', tile_x: !!s.tile_x, label: s.label || s.id, isNew: false, custom: !!s.custom, sheet: spriteOrNew.sheet };
      var d = drafts[s.id]; if (d) { cur.w = d.w; cur.h = d.h; cur.frames = (d.frames_rows || [d.rows]).map(function (r) { return grid(r, d.w, d.h); }); }
    } else cur = spriteOrNew;
    zoom = Math.max(4, Math.min(24, Math.floor(560 / Math.max(cur.w, cur.h))));
    refreshAll();
  }
  function newTexture() {
    var id = el('input', { type: 'text', value: 'perso_', placeholder: 'perso_ma_tuile', style: 'width:100%' }), w = el('input', { type: 'number', value: '16', min: '1', max: '64' }), h = el('input', { type: 'number', value: '16', min: '1', max: '64' });
    var body = el('div', {}, [el('p', { class: 'hint', text: 'Identifiant : lettres minuscules, chiffres et _ (3 à 60). Une tuile fait 16 × 16.' }), id, el('div', { class: 'row' }, [el('span', { text: 'Largeur' }), w, el('span', { text: 'Hauteur' }), h])]);
    var m = E.modal('Nouvelle texture', body, [btn('Créer', function () {
      var ident = id.value.trim(), W = parseInt(w.value, 10), H = parseInt(h.value, 10);
      if (!/^[a-z0-9_]{3,60}$/.test(ident)) { E.say('Identifiant invalide.', 'warn'); return; }
      if (E.allSprites().some(function (s) { return s.id === ident; })) { E.say('Cet identifiant existe déjà.', 'warn'); return; }
      if (!(W >= 1 && W <= 64 && H >= 1 && H <= 64)) { E.say('Taille entre 1 et 64.', 'warn'); return; }
      m.close(); open({ id: ident, w: W, h: H, frames: [grid(null, W, H)], f: 0, anchor: 'top-left', tile_x: false, label: ident, isNew: true, custom: true });
    }, 'primary')]);
  }
  function duplicate() {
    var id = el('input', { type: 'text', value: 'perso_' + cur.id.replace(/^perso_/, '').slice(0, 40) + '_2', style: 'width:100%' });
    var m = E.modal('Dupliquer en nouvelle texture', el('div', {}, [el('p', { class: 'hint', text: 'La copie reçoit un nouvel identifiant ; l’original ne change pas.' }), id]), [btn('Dupliquer', function () {
      var ident = id.value.trim();
      if (!/^[a-z0-9_]{3,60}$/.test(ident) || E.allSprites().some(function (s) { return s.id === ident; })) { E.say('Identifiant invalide ou déjà pris.', 'warn'); return; }
      m.close(); var c = JSON.parse(JSON.stringify(cur)); c.id = ident; c.label = ident; c.isNew = true; c.custom = true; undo = []; cur = c; refreshAll();
    }, 'primary')]);
  }

  // ---------- Dessin ----------
  function cellAt(ev) {
    var r = canvas.getBoundingClientRect(), x = Math.floor((ev.clientX - r.left) / (r.width / cur.w)), y = Math.floor((ev.clientY - r.top) / (r.height / cur.h));
    return x >= 0 && y >= 0 && x < cur.w && y < cur.h ? { x: x, y: y } : null;
  }
  function setCell(x, y, ch) {
    var g = cur.frames[cur.f]; g[y][x] = ch;
    if (mirror) g[y][cur.w - 1 - x] = ch;
  }
  function fill(x, y, ch) {
    var g = cur.frames[cur.f], from = g[y][x]; if (from === ch) return;
    var stack = [[x, y]];
    while (stack.length) {
      var p = stack.pop(), px = p[0], py = p[1];
      if (px < 0 || py < 0 || px >= cur.w || py >= cur.h || g[py][px] !== from) continue;
      g[py][px] = ch; stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
  }
  function paint(c) {
    if (!c) return;
    var g = cur.frames[cur.f];
    if (tool === 'pencil') setCell(c.x, c.y, color);
    else if (tool === 'eraser') setCell(c.x, c.y, '.');
    else if (tool === 'fill') fill(c.x, c.y, color);
    else if (tool === 'pick') { var ch = g[c.y][c.x]; if (ch !== '.') color = ch; tool = 'pencil'; refreshRight(); }
    redraw();
  }
  function redraw() {
    if (!canvas || !cur) return;
    canvas.width = cur.w; canvas.height = cur.h;
    canvas.style.width = (cur.w * zoom) + 'px'; canvas.style.height = (cur.h * zoom) + 'px';
    var ctx = canvas.getContext('2d'), img = ctx.createImageData(cur.w, cur.h), g = cur.frames[cur.f];
    for (var y = 0; y < cur.h; y++) for (var x = 0; x < cur.w; x++) {
      var ch = g[y][x]; if (ch === '.' || !GP.SPRITE_PAL[ch]) continue;
      var n = parseInt(GP.SPRITE_PAL[ch].slice(1), 16), i = (y * cur.w + x) * 4; img.data[i] = n >> 16 & 255; img.data[i + 1] = n >> 8 & 255; img.data[i + 2] = n & 255; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    drawPreviews();
  }
  function drawPreviews() {
    var box = right && right.querySelector('#tx-prev'); if (!box || !cur) return;
    box.textContent = '';
    var rows = rowsOf(cur.frames[cur.f]), t1 = E.thumb(rows, cur.w, cur.h);
    box.appendChild(t1);
    // tuile répétée 3×3 : pour juger les raccords
    var c = document.createElement('canvas'); c.width = cur.w * 3; c.height = cur.h * 3; var ctx = c.getContext('2d');
    for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) ctx.drawImage(t1, 0, 0, cur.w, cur.h, i * cur.w, j * cur.h, cur.w, cur.h);
    c.style.cssText = 'image-rendering:pixelated;width:' + Math.min(144, c.width * 2) + 'px;margin-left:8px;border:1px solid #14182e';
    box.appendChild(c);
  }

  // ---------- Document ----------
  function docOf() {
    var d = { w: cur.w, h: cur.h, rows: rowsOf(cur.frames[0]), anchor: cur.anchor, tile_x: cur.tile_x, label: cur.label };
    if (cur.frames.length > 1) d.frames_rows = cur.frames.map(rowsOf);
    return d;
  }
  function saveLocal() { drafts[cur.id] = docOf(); try { localStorage.setItem('greenpath.editor.tex', JSON.stringify(drafts)); } catch (e) { /* ignoré */ } E.say('Texture gardée dans le brouillon.', 'ok'); }
  function applyHere(d) {
    GP.Content.applyTextures((function () { var o = {}; o[cur.id] = d; return o; })());
    GP.Sprites.build(E.scene); if (E.scene) E.scene.rebuild();
  }
  function publish() {
    var d = docOf(), why = GP.Content.checkSprite(d);
    if (why) { E.say('Texture invalide : ' + why, 'warn'); return; }
    if (!E.online) { E.say('Hors ligne : impossible de publier.', 'warn'); return; }
    if (!cur.isNew && !confirm('Remplacer le sprite « ' + cur.id + ' » pour tous les joueurs ?')) return;
    GP.Cloud.rpc('gp_texture_save', { p_code: GP.Cloud.code, p_id: cur.id, p_doc: d }).then(function (r) {
      if (!r.ok) { E.say('Erreur serveur : la migration Supabase est-elle appliquée ?', 'warn'); return; }
      if (!r.data.ok) { E.say(r.data.error === 'forbidden' ? 'Refusé : ce compte n’est pas admin.' : 'Texture refusée (' + r.data.error + ').', 'warn'); return; }
      var cache = GP.Content.cached(); cache.textures[cur.id] = d; GP.Content.setCached(cache);
      delete drafts[cur.id]; applyHere(d); cur.isNew = false; E.say('Texture publiée.', 'ok'); refreshAll();
    });
  }
  function revertOriginal() {
    if (!E.online || !confirm('Supprimer la version publiée de « ' + cur.id + ' » ?')) return;
    GP.Cloud.rpc('gp_texture_delete', { p_code: GP.Cloud.code, p_id: cur.id }).then(function (r) {
      if (!r.ok || !r.data.ok) { E.say('Échec.', 'warn'); return; }
      var cache = GP.Content.cached(); delete cache.textures[cur.id]; GP.Content.setCached(cache);
      var o = GP.Content.originalSprite(cur.id);
      if (o) { GP.Content.applyTextures((function () { var x = {}; x[cur.id] = { w: o.w, h: o.h, rows: o.rows, frames_rows: o.frames_rows }; return x; })()); GP.Sprites.build(E.scene); if (E.scene) E.scene.rebuild(); }
      E.say(o ? 'Original rétabli.' : 'Texture supprimée (le jeu l’oubliera au prochain chargement).', 'ok'); cur = null; refreshAll();
    });
  }
  function resize() {
    var w = parseInt(right.querySelector('#tx-w').value, 10), h = parseInt(right.querySelector('#tx-h').value, 10);
    if (!(w >= 1 && w <= 64 && h >= 1 && h <= 64)) { E.say('Taille entre 1 et 64.', 'warn'); return; }
    pushUndo();
    cur.frames = cur.frames.map(function (g) { return grid(g.map(function (r) { return r.join(''); }), w, h); });
    cur.w = w; cur.h = h; zoom = Math.max(4, Math.min(24, Math.floor(560 / Math.max(w, h)))); refreshAll();
  }

  // ---------- Panneaux ----------
  function refreshLeft() {
    left.textContent = '';
    left.appendChild(el('h3', { text: 'Textures' }));
    left.appendChild(btn('+ Nouvelle texture', newTexture, 'primary'));
    var search = el('input', { type: 'text', placeholder: 'Chercher…', value: filter, style: 'width:100%;margin:8px 0 4px' });
    var sheets = {}; E.allSprites().forEach(function (s) { sheets[s.sheet] = 1; });
    var sel = el('select', { style: 'width:100%' }, [el('option', { value: '', text: 'Toutes les planches' })].concat(Object.keys(sheets).map(function (k) { var o = el('option', { value: k, text: k }); if (k === sheetFilter) o.selected = true; return o; })));
    var pal = el('div', { class: 'palette', style: 'max-height:none' });
    function render() {
      pal.textContent = '';
      E.allSprites().filter(function (s) { return (!filter || s.id.indexOf(filter) >= 0) && (!sheetFilter || s.sheet === sheetFilter); }).slice(0, 300).forEach(function (s) {
        pal.appendChild(el('div', { class: 'sw' + (cur && cur.id === s.id ? ' on' : ''), title: s.id + ' ' + s.w + '×' + s.h, onclick: function () { open(s); } }, [E.thumb(s.rows, s.w, s.h), el('span', { text: s.id })]));
      });
    }
    search.addEventListener('input', function () { filter = search.value.toLowerCase(); render(); });
    sel.addEventListener('change', function () { sheetFilter = sel.value; render(); });
    left.appendChild(search); left.appendChild(sel); left.appendChild(pal); render();
  }
  function refreshRight() {
    right.textContent = '';
    if (!cur) { right.appendChild(el('h3', { text: 'Texture' })); right.appendChild(el('p', { class: 'hint', text: 'Choisis un sprite à gauche pour le modifier, ou crée une nouvelle texture.' })); return; }
    right.appendChild(el('h3', { text: cur.id }));
    right.appendChild(el('p', { class: 'hint', text: cur.isNew ? 'Nouvelle texture (non publiée)' : cur.custom ? 'Texture créée' : 'Sprite du jeu : publier le remplace partout' }));
    var tools = el('div', { class: 'row' });
    [['pencil', 'Crayon'], ['eraser', 'Gomme'], ['fill', 'Pot'], ['pick', 'Pipette']].forEach(function (t) { tools.appendChild(btn(t[1], function () { tool = t[0]; refreshRight(); }, tool === t[0] ? 'on' : '')); });
    right.appendChild(tools);
    right.appendChild(el('div', { class: 'row' }, [btn('Miroir', function () { mirror = !mirror; refreshRight(); }, mirror ? 'on' : '', 'Dessine aussi le côté opposé'), btn('↶ Annuler', doUndo), btn('Effacer', function () { pushUndo(); cur.frames[cur.f] = grid(null, cur.w, cur.h); redraw(); })]));
    right.appendChild(el('h3', { text: 'Couleur' }));
    var pal = el('div', { class: 'pal' });
    pal.appendChild(el('button', { type: 'button', title: 'Transparent', style: 'background:repeating-conic-gradient(#888 0 25%,#ccc 0 50%) 50%/8px 8px', class: tool === 'eraser' ? 'on' : '', onclick: function () { tool = 'eraser'; refreshRight(); } }));
    Object.keys(GP.SPRITE_PAL).forEach(function (k) { pal.appendChild(el('button', { type: 'button', title: k + ' ' + GP.SPRITE_PAL[k], class: color === k && tool !== 'eraser' ? 'on' : '', style: 'background:' + GP.SPRITE_PAL[k], onclick: function () { color = k; if (tool === 'eraser' || tool === 'pick') tool = 'pencil'; refreshRight(); } })); });
    right.appendChild(pal);
    right.appendChild(el('h3', { text: 'Aperçu' })); right.appendChild(el('div', { id: 'tx-prev', class: 'row' }));
    right.appendChild(el('h3', { text: 'Propriétés' }));
    var g = el('div', { class: 'grid2' });
    var w = el('input', { type: 'number', id: 'tx-w', value: String(cur.w), min: '1', max: '64' }), h = el('input', { type: 'number', id: 'tx-h', value: String(cur.h), min: '1', max: '64' });
    [['largeur', w], ['hauteur', h]].forEach(function (p) { g.appendChild(el('label', { text: p[0] })); g.appendChild(p[1]); });
    var anchor = el('select', {}, ['top-left', 'bottom-center', 'center'].map(function (a) { var o = el('option', { value: a, text: a }); if (a === cur.anchor) o.selected = true; return o; }));
    anchor.addEventListener('change', function () { cur.anchor = anchor.value; });
    g.appendChild(el('label', { text: 'ancrage' })); g.appendChild(anchor);
    var tile = el('input', { type: 'checkbox' }); tile.checked = cur.tile_x; tile.addEventListener('change', function () { cur.tile_x = tile.checked; });
    g.appendChild(el('label', { text: 'se répète en x' })); g.appendChild(tile);
    right.appendChild(g);
    right.appendChild(btn('Appliquer la taille', resize));
    right.appendChild(el('h3', { text: 'Images (' + cur.frames.length + ')' }));
    var fr = el('div', { class: 'row' });
    cur.frames.forEach(function (_, i) { fr.appendChild(btn(String(i + 1), function () { cur.f = i; redraw(); refreshRight(); }, i === cur.f ? 'on' : '')); });
    fr.appendChild(btn('+', function () { if (cur.frames.length >= 8) return; pushUndo(); cur.frames.push(JSON.parse(JSON.stringify(cur.frames[cur.f]))); cur.f = cur.frames.length - 1; redraw(); refreshRight(); }, '', 'Ajouter une image (copie de celle-ci)'));
    fr.appendChild(btn('−', function () { if (cur.frames.length < 2) return; pushUndo(); cur.frames.splice(cur.f, 1); cur.f = Math.max(0, cur.f - 1); redraw(); refreshRight(); }, '', 'Supprimer cette image'));
    right.appendChild(fr);
    right.appendChild(el('h3', { text: 'Enregistrer' }));
    right.appendChild(el('div', { class: 'row' }, [btn('Brouillon', saveLocal, '', 'Garde la texture pour l’essai (▶ Tester), sans publier'), btn('Publier', publish, 'primary'), btn('Dupliquer', duplicate)]));
    if (!cur.isNew && (cur.custom || GP.Content.originalSprite(cur.id))) right.appendChild(btn(cur.custom ? 'Supprimer la texture' : 'Revenir à l’original', revertOriginal, 'danger'));
    drawPreviews();
  }
  function refreshAll() { if (!host) return; refreshLeft(); refreshRight(); mountCanvas(); }
  function mountCanvas() {
    host.textContent = '';
    if (!cur) { host.appendChild(el('p', { class: 'hint', text: 'Aucune texture ouverte.' })); return; }
    canvas = document.createElement('canvas');
    canvas.addEventListener('pointerdown', function (ev) { ev.preventDefault(); canvas.setPointerCapture(ev.pointerId); pushUndo(); painting = true; lastCell = cellAt(ev); paint(lastCell); });
    canvas.addEventListener('pointermove', function (ev) { if (!painting || tool === 'fill' || tool === 'pick') return; var c = cellAt(ev); if (c && (!lastCell || c.x !== lastCell.x || c.y !== lastCell.y)) { lastCell = c; paint(c); } });
    canvas.addEventListener('pointerup', function () { painting = false; refreshRight(); });
    host.appendChild(canvas); redraw();
  }

  return {
    mount: function (l, r, h) {
      E = GP.Ed; left = l; right = r; host = h;
      try { drafts = JSON.parse(localStorage.getItem('greenpath.editor.tex')) || {}; } catch (e) { drafts = {}; }
      document.addEventListener('keydown', GP.TexEd._key);
      refreshAll();
    },
    openSprite: function (entry) { open(entry); },
    newTexture: function () { newTexture(); },
    unmount: function () { document.removeEventListener('keydown', GP.TexEd._key); host = null; },
    _key: function (ev) { if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return; if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'z') { ev.preventDefault(); doUndo(); } },
    statusText: function () { return cur ? cur.id + ' · ' + cur.w + '×' + cur.h + ' · image ' + (cur.f + 1) + '/' + cur.frames.length + ' · outil ' + tool : 'aucune texture ouverte'; },
    /** Textures modifiées mais pas publiées, à joindre à l'essai d'un niveau. */
    drafts: function () { if (!drafts || !Object.keys(drafts).length) { try { drafts = JSON.parse(localStorage.getItem('greenpath.editor.tex')) || {}; } catch (e) { drafts = {}; } } return drafts; }
  };
})();
