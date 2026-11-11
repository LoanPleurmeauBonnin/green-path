/** Contrôleur de faisabilité des niveaux : le joueur peut-il aller du départ à l'arrivée, et ramasser chaque pixel ?
 * node tools/solvability.cjs [numéro de niveau]
 *
 * Méthode (skill « level-design ») : mesurer le vrai joueur, puis vérifier l'accessibilité au lieu de la supposer.
 * Le joueur est simulé avec les constantes du jeu (gravité, saut, vitesse, accélérations, demi-gravité d'apex, saut
 * variable) contre la géométrie des niveaux, au pixel : course, chute, sauts de toutes les sortes (maintenu ou court,
 * direction changée en vol), accroche et hissage sur un rebord, accroupi sous un plafond bas, colonnes à grimper, anneaux,
 * parasols. Les plateformes mobiles sont des surfaces posées à plusieurs positions de leur trajet (approximation
 * généreuse : « atteignable » veut dire « atteignable si le timing est bon »). Les courants d'air du niveau 12 ne sont
 * pas modélisés. Pièges et eau sont mortels ; les pièges cycliques et les ennemis sont ignorés (timing).
 * Résultat : un niveau « bloqué » l'est vraiment ; un niveau « faisable » l'est sous les hypothèses ci-dessus.
 */
'use strict';
const { load } = require('./balance.cjs');

const G = 950, JUMP = -320, SPEED = 110, ACC_AIR = 700, CUT = 0.45, MAXFALL = 420, APEX_M = 0.7, APEX_T = 90, DT = 1 / 60;
const BW = 8, BH = 16, CH = 10;   // corps debout 8×16, accroupi 8×10

function world(d) {
  const W = d.largeur * 16, H = d.hauteur * 16, solid = new Uint8Array(W * H), noGrab = new Uint8Array(W * H), haz = new Uint8Array(W * H);
  const ow = [], climbs = [], links = [], boosts = [], edges = [];
  const fill = (arr, x, y, w, h, v) => {
    for (let yy = Math.max(0, Math.floor(y)); yy < Math.min(H, Math.ceil(y + h)); yy++)
      for (let xx = Math.max(0, Math.floor(x)); xx < Math.min(W, Math.ceil(x + w)); xx++) arr[yy * W + xx] = v;
  };
  const surf = (x0, x1, y) => { ow.push({ x0: Math.round(x0), x1: Math.round(x1), y: Math.round(y) }); edges.push({ x: Math.round(x0), y: Math.round(y), side: 1 }); edges.push({ x: Math.round(x1), y: Math.round(y), side: -1 }); };
  const path = (a, b, w, n) => { for (let i = 0; i <= n; i++) { const t = i / n; surf((a[0] + (b[0] - a[0]) * t) * 16, (a[0] + (b[0] - a[0]) * t + w) * 16, (a[1] + (b[1] - a[1]) * t) * 16); } };
  for (const p of d.plateformes) {
    if (p.type === 'masse') {
      const bottom = p.fill_to !== undefined ? p.fill_to : (p.to !== undefined ? p.to : d.hauteur);
      if (p.pilier || p.fond) continue;
      const h = bottom - p.y;
      if ((p.w || 1) <= 1 && h > 4 || /façade.*pilier/.test(p.note || '')) { surf(p.x * 16, (p.x + (p.w || 1)) * 16, p.y * 16); continue; }   // pile fine ou pilier de façade : sens unique (comme le moteur)
      fill(solid, p.x * 16, p.y * 16, (p.w || 1) * 16, h * 16, 1);
      if (p.grab === false) fill(noGrab, p.x * 16, p.y * 16, (p.w || 1) * 16, h * 16, 1);
      else { edges.push({ x: p.x * 16, y: p.y * 16, side: 1, solid: true }); edges.push({ x: (p.x + (p.w || 1)) * 16, y: p.y * 16, side: -1, solid: true }); }
    } else if (p.type === 'rampe') {   // tranches de 4 px, comme GZoneRuntime.rampSlices ; pas d'accroche sur une rampe
      const n = Math.round((p.x1 - p.x0) * 16 / 4);
      for (let i = 0; i < n; i++) { const y = Math.round((p.y0 + (p.y1 - p.y0) * (i + 0.5) / n) * 16); fill(solid, p.x0 * 16 + i * 4, y, 4, d.hauteur * 16 - y, 1); fill(noGrab, p.x0 * 16 + i * 4, y, 4, d.hauteur * 16 - y, 1); }
    } else if (p.type === 'pont' || p.type === 'galerie') {
      const m = p.mecanique || {};
      if (m.type === 'chariot') path(m.de, m.vers, p.w || 1, 4);
      else surf(p.x * 16, (p.x + (p.w || 1)) * 16, p.y * 16);
    } else if (p.type === 'pad') {
      const m = p.mecanique || {}, w = p.w || 1;
      if (m.leurre || m.solide === false) continue;
      if (m.type === 'chariot' || m.type === 'ascenseur') { const a = m.de || [p.x, m.y_bas === undefined ? p.y : m.y_bas], b = m.vers || [p.x, m.y_haut === undefined ? p.y : m.y_haut]; path(a, b, w, 4); }
      else if (m.type === 'va-et-vient' || m.type === 'oscillation') {
        if (m.axe === 'diagonale' && m.vers) path(m.de, m.vers, w, 4);
        else if (m.axe === 'y') path([p.x, m.y_bas], [p.x, m.y_haut], w, 4);
        else path([p.x, p.y], [p.x + (m.course_tuiles || m.amplitude_tuiles || 3), p.y], w, 4);
      } else surf(p.x * 16, (p.x + w) * 16, p.y * 16);
    } else if (p.type === 'colonne') {
      climbs.push({ x0: p.x * 16, x1: (p.x + 2) * 16, top: p.y_top * 16, base: p.sol_y * 16, cx: p.x * 16 + 8 });
      surf(p.x * 16, (p.x + 2) * 16, p.y_top * 16);
    }
  }
  for (const m of d.mobiles || []) {
    if (m.kind === 'colonne') { if (!m.inner) surf(m.x1 * 16, (m.x1 + 1) * 16, (m.y1 + 1) * 16 - 64); continue; }
    if (m.kind === 'engrenage' || m.kind === 'dalle_verre') { surf(m.x1 * 16, (m.x1 + (m.w || 2)) * 16, m.y1 * 16); continue; }
    path([m.x1, m.y1], [m.x2, m.y2], m.w || 2, 4);
  }
  for (const r of d.roofs || []) fill(solid, r.x, r.y, r.w, r.h, 1);
  for (const h of d.dangers || []) {
    if (h.kind === 'mortel') fill(haz, h.x * 16 + 2, (h.y + 1) * 16 - 12, (h.w || 1) * 16 - 4, 12, 1);
    else if (h.kind === 'eau_mortelle') fill(haz, h.x * 16, h.y * 16 + 2, (h.w || 1) * 16, 14, 1);
  }
  for (const e of d.eau || []) fill(haz, e.x * 16, e.y * 16 + 2, e.w * 16, H, 1);
  for (const r of d.anneaux || []) if (r.de && r.vers) links.push({ from: [r.de[0] * 16, r.de[1] * 16], to: [r.vers[0] * 16 + 8, r.vers[1] * 16], c: [(r.cx === undefined ? r.x : r.cx) * 16, (r.cy === undefined ? r.y : r.cy) * 16], id: r.id });
  for (const b of d.boosts || []) boosts.push({ x0: b.x * 16, x1: (b.x + (b.w || 2)) * 16, y: (b.top === undefined ? b.y : b.top) * 16, v: Math.sqrt(2 * G * (b.hauteur || 4.5) * 16) });
  return { W, H, solid, noGrab, haz, ow, climbs, links, boosts, edges, d };
}

const S = (w, x, y) => x >= 0 && y >= 0 && x < w.W && y < w.H && w.solid[y * w.W + x] === 1;
function colSolid(w, x, y0, y1) { for (let y = y0; y < y1; y++) if (S(w, x, y)) return true; return false; }
function rowSolid(w, y, x0, x1) { for (let x = x0; x < x1; x++) if (S(w, x, y)) return true; return false; }
function deadAt(w, cx, bottom, h) {
  const xs = [cx - 3, cx, cx + 3], ys = [bottom - 1, bottom - h / 2, bottom - h + 1];
  for (const x of xs) for (const y of ys) { const xi = Math.floor(x), yi = Math.floor(y); if (xi >= 0 && yi >= 0 && xi < w.W && yi < w.H && w.haz[yi * w.W + xi]) return true; }
  return bottom > w.H + 24;
}
/** Y du sol sous les pieds si le joueur est posé (corps de largeur 8 centré en cx), sinon null. */
function groundAt(w, cx, bottom) {
  const x0 = Math.floor(cx - BW / 2), x1 = Math.floor(cx + BW / 2 - 1);
  for (let x = x0; x <= x1; x++) if (S(w, x, bottom)) return bottom;
  for (const s of w.ow) if (s.y === bottom && x1 >= s.x0 && x0 < s.x1) return bottom;
  return null;
}
const fits = (w, cx, bottom, h) => !rowSolid(w, bottom - h, Math.floor(cx - BW / 2), Math.floor(cx + BW / 2)) && !colSolid(w, Math.floor(cx - BW / 2), bottom - h, bottom) && !colSolid(w, Math.floor(cx + BW / 2 - 1), bottom - h, bottom);

/** Un saut ou une chute depuis (cx, bottom) : renvoie la liste des atterrissages ; marque les positions visitées. */
function flight(w, cx0, y0, vx0, vy0, plan, mark) {
  let cx = cx0, y = y0, vx = vx0, vy = vy0, hold = true;
  for (let f = 0; f < 260; f++) {
    const seg = plan.dirs.find(s => f < s[1]) || plan.dirs[plan.dirs.length - 1], dir = seg[0];
    vx += Math.max(-ACC_AIR * DT, Math.min(ACC_AIR * DT, dir * SPEED - vx));
    if (hold && f >= plan.hold) { hold = false; if (vy < 0) vy *= CUT; }
    vy = Math.min(MAXFALL, vy + G * DT * (hold && Math.abs(vy) < APEX_T ? APEX_M : 1));
    if (dir && vy > -80) { const res = ledge(w, cx, y, dir, vy); if (res) return res; }
    // horizontal, pixel par pixel
    const nx = Math.abs(vx * DT), sx = Math.sign(vx);
    for (let s = 0; s < Math.ceil(nx); s++) {
      const step = Math.min(1, nx - s) * sx, ncx = cx + step, front = Math.floor(ncx + sx * (BW / 2 - (sx > 0 ? 1 : 0)));
      if (colSolid(w, front, Math.floor(y) - BH, Math.floor(y))) {
        vx = 0;
        break;
      }
      cx = ncx;
    }
    cx = Math.max(BW / 2, Math.min(w.W - BW / 2, cx));
    // vertical
    const ny = Math.abs(vy * DT), sy = Math.sign(vy);
    for (let s = 0; s < Math.ceil(ny); s++) {
      const step = Math.min(1, ny - s) * sy, prev = y;
      y += step;
      if (sy < 0) {
        if (rowSolid(w, Math.floor(y) - BH, Math.floor(cx - BW / 2), Math.floor(cx + BW / 2))) { y = prev; vy = 0; break; }
      } else {
        const fy = Math.floor(y), x0 = Math.floor(cx - BW / 2), x1 = Math.floor(cx + BW / 2 - 1);
        let hit = rowSolid(w, fy, x0, x1 + 1);
        if (!hit) for (const o of w.ow) if (Math.floor(prev) <= o.y && fy >= o.y && x1 >= o.x0 && x0 < o.x1) { hit = true; break; }
        for (const b of w.boosts) if (fy >= b.y - 4 && fy <= b.y + 12 && x1 >= b.x0 && x0 < b.x1) return { boost: b, cx: Math.round(cx), y: Math.round(y), vx };
        if (hit) {
          const ly = Math.floor(prev) === y0 && f === 0 ? Math.floor(y) : Math.floor(y);
          // posé : le haut du sol est la première ligne pleine
          let top = ly; for (const o of w.ow) if (o.y <= fy && o.y >= Math.floor(prev) && x1 >= o.x0 && x0 < o.x1) top = Math.min(top, o.y);
          while (top > 0 && rowSolid(w, top - 1, x0, x1 + 1) && !fits(w, cx, top, 1)) top--;
          return { cx: Math.round(cx), y: top, vx };
        }
      }
    }
    mark(cx, y);
    if (deadAt(w, cx, Math.floor(y), BH)) return null;
  }
  return null;
}
/** Accroche (mains au sommet) ou rebord frôlé : en poussant vers un rebord à 7 px ou moins, on s'y hisse (comme le moteur). */
function ledge(w, cx0, y, sx, vy) {
  if (vy < -80) return null;
  const bodyTop = Math.floor(y) - BH, front = sx > 0 ? cx0 + BW / 2 : cx0 - BW / 2;
  for (const e of w.edges) {
    if (e.side !== sx || Math.abs(e.x - front) > 7 || bodyTop < e.y - 16 || bodyTop > e.y + 12) continue;
    const cx = e.x + sx * 8;
    if (!fits(w, cx, e.y, BH) || groundAt(w, cx, e.y) === null) continue;
    return { cx, y: e.y, vx: 0 };
  }
  return null;
}

function solve(d) {
  const w = world(d), seen = new Set(), queue = [], vis = new Uint8Array(Math.ceil(w.W / 2) * Math.ceil(w.H / 2)), hw = Math.ceil(w.W / 2);
  const mark = (cx, y) => { const xi = Math.floor(cx / 2), yi = Math.floor((y - 8) / 2); if (xi >= 0 && yi >= 0 && xi < hw && yi < Math.ceil(w.H / 2)) vis[yi * hw + xi] = 1; };
  const key = (cx, y) => y * (w.W + 1) + cx;
  let far = 0;
  const add = (cx, y) => {
    cx = Math.round(cx); y = Math.round(y);
    if (cx < 4 || cx > w.W - 4 || groundAt(w, cx, y) === null) return;
    if (deadAt(w, cx, y, BH)) return;
    const k = key(cx, y); if (seen.has(k)) return;
    seen.add(k); queue.push([cx, y]); mark(cx, y); far = Math.max(far, cx);
  };
  const sx0 = d.spawn.x * 16 + 8, sy0 = (d.spawn.y + 1) * 16;
  let sy = sy0; while (sy < w.H && groundAt(w, sx0, sy) === null && sy < sy0 + 200) sy++;
  add(sx0, sy);
  /** Atterrissage ou rebond sur un parasol (boost en vol : le joueur repart vers le haut avec la vitesse du parasol). */
  const bounced = new Set();
  const land = r => {
    if (!r.boost) { add(r.cx, r.y); return; }
    const k = key(r.cx >> 1, Math.round(r.y)) + ':' + r.boost.x0; if (bounced.has(k)) return; bounced.add(k);
    for (const p of dirsets) { const q = flight(w, r.cx, r.y, r.vx, -r.boost.v, { dirs: p.dirs, hold: 99 }, mark); if (q) land(q); }
  };
  const dirsets = [];
  for (const d1 of [-1, 0, 1]) dirsets.push({ dirs: [[d1, 999]] });
  for (const n of [10, 20, 32]) for (const [a, b] of [[1, 0], [1, -1], [-1, 0], [-1, 1], [0, 1], [0, -1]]) dirsets.push({ dirs: [[a, n], [b, 999]] });
  let guard = 0;
  while (queue.length && guard++ < 400000) {
    const [cx, y] = queue.shift();
    // marcher
    for (const dir of [-1, 1]) {
      const nx = cx + dir;
      if (!fits(w, nx, y, BH) && !fits(w, nx, y, CH)) continue;
      if (groundAt(w, nx, y) !== null) { add(nx, y); }
      else {
        // marche d'escalier d'1 px et chute depuis le bord
        for (const p of dirsets.slice(0, 3)) { const r = flight(w, nx, y, dir * SPEED, 0, { dirs: p.dirs, hold: 0 }, mark); if (r) land(r); }
      }
    }
    if (cx % 3 !== 0) continue;
    // sauter : maintenu ou court, élan à gauche, à droite ou sur place
    for (const hold of [99, 9]) for (const vx0 of [0, SPEED, -SPEED]) for (const p of dirsets) {
      if (vx0 !== 0 && p.dirs[0][0] !== Math.sign(vx0) && p.dirs[0][0] !== 0) continue;
      const r = flight(w, cx, y, vx0, JUMP, { dirs: p.dirs, hold }, mark); if (r) land(r);
    }
    // colonne à grimper
    for (const c of w.climbs) if (cx >= c.x0 - 6 && cx <= c.x1 + 6 && y <= c.base && y >= c.top) add(c.cx, c.top);
    // anneaux
    for (const l of w.links) if (Math.abs(cx - l.from[0]) <= 40 && Math.abs(y - l.from[1]) <= 40) { mark(l.c[0], l.c[1] + 8); add(l.to[0], l.to[1]); }
  }
  // résultats
  const near = (px, py, rx, ry) => { for (let yy = Math.floor((py - ry) / 2); yy <= Math.floor((py + ry) / 2); yy++) for (let xx = Math.floor((px - rx) / 2); xx <= Math.floor((px + rx) / 2); xx++) if (xx >= 0 && yy >= 0 && xx < hw && vis[yy * hw + xx]) return true; return false; };
  const ex = d.arrivee.declencheur, exit = near(ex.x * 16 + 8, ex.y * 16 + 8, 14, 14);
  const missing = d.pixels.filter(p => !near(p.x * 16 + 8, p.y * 16 + 8, 10, 12)).map(p => p.id + '@' + p.x + ',' + p.y);
  const lights = d.checkpoints.filter(c => !near(c.x * 16 + 8, c.y * 16 + 8, 14, 14)).map(c => c.x + ',' + c.y);
  return { exit, farthest: Math.round(far / 16), missing, lights, nodes: seen.size };
}

module.exports = { solve, world };

if (require.main === module) {
  const G_ = load(true), only = Number(process.argv[2]) || 0;
  console.log('Niveau                          arrivée  pixels hors d\'atteinte        points de contrôle  x max');
  G_.GZONES.forEach(d => {
    if (only && d.num !== only) return;
    if (d.num === 3) { console.log(String(d.num).padStart(2), d.nom.slice(0, 28).padEnd(28), '(Château : ancien moteur, non contrôlé)'); return; }
    const L = G_.LEVELS[G_.GZoneLevels.ids[d.num - 1]]; d.roofs = (L && L.roofs) || [];
    const r = solve(d);
    console.log(String(d.num).padStart(2), d.nom.slice(0, 28).padEnd(28), (r.exit ? 'OUI' : 'NON').padEnd(8), (r.missing.length + '/' + d.pixels.length + ' ' + r.missing.slice(0, 6).join(' ')).padEnd(34), (r.lights.length ? 'hors : ' + r.lights.join(' ') : 'ok').padEnd(18), r.farthest + '/' + d.largeur);
  });
}
