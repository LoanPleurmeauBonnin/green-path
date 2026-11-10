/**
 * CharacterSprite — générateur de personnage pixel art, vue de trois quarts (regard à droite), grille 15×19.
 *
 * Le personnage est assemblé par calques (jambes, bas, cou, haut, bras, tête, cheveux) à partir
 * d'une configuration d'options (cheveux, yeux, peau, haut, bas, chaussures). Le contour sombre
 * est calculé automatiquement autour de la silhouette. Les animations (repos, marche, saut, joie)
 * sont obtenues en décalant les calques d'un pixel : aucun fichier image n'est nécessaire.
 *
 * Base : sprite « Personnage » du fichier Figma Green Path (nœud 6:19, grille 15×19, cases de 20 px).
 * La configuration par défaut reproduit ce sprite ; les autres options sont dessinées sur la même pose.
 * Vers la gauche, le jeu retourne simplement l'image (flipX).
 */
GP.Character = (function () {
  var W = 15, H = 19, OUTLINE = '#170e3b';

  // ---------- Options et palettes ----------
  var HAIRS = [
    { id: 'courts', name: 'COURTS' }, { id: 'frange', name: 'FRANGE' }, { id: 'boucles', name: 'BOUCLÉS' },
    { id: 'milong', name: 'MI-LONG' }, { id: 'chignon', name: 'CHIGNON' }, { id: 'rase', name: 'RASÉ' },
    { id: 'crete', name: 'CRÊTE' }, { id: 'chauve', name: 'CHAUVE' }
  ];
  var HAIR_COLORS = [
    { id: 'noir', name: 'NOIR', H: '#1d1a3a', h: '#2f2b52', l: '#5b5688' },
    { id: 'brun', name: 'BRUN', H: '#5a2539', h: '#894648', l: '#c17958' },
    { id: 'chatain', name: 'CHÂTAIN', H: '#6b3b26', h: '#a5683f', l: '#d09a68' },
    { id: 'blond', name: 'BLOND', H: '#c9893a', h: '#f0c75a', l: '#fff0b0' },
    { id: 'roux', name: 'ROUX', H: '#8a3b2a', h: '#e07a2f', l: '#f4b24a' },
    { id: 'gris', name: 'GRIS', H: '#6b7280', h: '#a0a8b4', l: '#d8dde4' },
    { id: 'vert', name: 'VERT', H: '#1e8a4f', h: '#2fbf71', l: '#8ae6b0' }
  ];
  var EYES = [
    { id: 'ronds', name: 'RONDS' }, { id: 'petits', name: 'PETITS' },
    { id: 'fermes', name: 'FERMÉS' }, { id: 'endormis', name: 'ENDORMIS' }
  ];
  var EYE_COLORS = [
    { id: 'marron', name: 'MARRON', c: '#7a4a2a' }, { id: 'noir', name: 'NOIR', c: '#170e3b' },
    { id: 'bleu', name: 'BLEU', c: '#3f7fd0' }, { id: 'vert', name: 'VERT', c: '#3fa564' },
    { id: 'noisette', name: 'NOISETTE', c: '#b07a2a' }, { id: 'gris', name: 'GRIS', c: '#7d8794' }
  ];
  var SKINS = [
    { id: 'pale', name: 'PÂLE', s: '#f6d3b8', S: '#d9a07f', L: '#fde6d4' },
    { id: 'clair', name: 'CLAIR', s: '#e8b485', S: '#c17958', L: '#fcd0a1' },
    { id: 'hale', name: 'HÂLÉ', s: '#cf9566', S: '#a8704a', L: '#e6b07f' },
    { id: 'brun', name: 'BRUN', s: '#a8683f', S: '#80482b', L: '#c1824f' },
    { id: 'fonce', name: 'FONCÉ', s: '#6e4129', S: '#4e2a1a', L: '#8a5636' }
  ];
  var TOPS = [
    { id: 'nu', name: 'TORSE NU', sleeve: 0, hem: false }, { id: 'debardeur', name: 'DÉBARDEUR', sleeve: 0, hem: false },
    { id: 'tshirt', name: 'T-SHIRT', sleeve: 1, hem: false }, { id: 'sweat', name: 'SWEAT', sleeve: 2, hem: true },
    { id: 'veste', name: 'VESTE', sleeve: 2, hem: true }, { id: 'chemise', name: 'CHEMISE', sleeve: 2, hem: false }
  ];
  var TOP_COLORS = [
    { id: 'vert', name: 'VERT', t: '#438a6a', T: '#2e5153', u: '#6bb894' },
    { id: 'corail', name: 'CORAIL', t: '#f26b5e', T: '#d94a52', u: '#f7a8a0' },
    { id: 'ciel', name: 'BLEU CIEL', t: '#8fc4ec', T: '#5b8fcb', u: '#c4e0f6' },
    { id: 'violet', name: 'VIOLET', t: '#8b6bb8', T: '#5e458f', u: '#c4a8e8' },
    { id: 'blanc', name: 'BLANC', t: '#f4f4fa', T: '#b8bde0', u: '#ffffff' },
    { id: 'jaune', name: 'JAUNE', t: '#f4d35e', T: '#d1a53a', u: '#fff0a0' },
    { id: 'orange', name: 'ORANGE', t: '#e8873a', T: '#b5532a', u: '#f7b574' },
    { id: 'noir', name: 'NOIR', t: '#3b3b4f', T: '#23233a', u: '#6a6a85' },
    { id: 'rose', name: 'ROSE', t: '#f2a1c0', T: '#d46a95', u: '#fad0e0' },
    { id: 'turquoise', name: 'TURQUOISE', t: '#3fbfb0', T: '#2a8a82', u: '#8ae6da' }
  ];
  var BOTTOMS = [
    { id: 'slip', name: 'SLIP' }, { id: 'short', name: 'SHORT' },
    { id: 'pantalon', name: 'PANTALON' }, { id: 'jupe', name: 'JUPE' }
  ];
  var BOTTOM_COLORS = [
    { id: 'bleu', name: 'BLEU', p: '#536ab6', P: '#39417f', q: '#7f96dc' },
    { id: 'marron', name: 'MARRON', p: '#7a4a3a', P: '#5a2f26', q: '#a56e58' },
    { id: 'gris', name: 'GRIS', p: '#6a7088', P: '#4a4f66', q: '#9aa0b8' },
    { id: 'vert', name: 'VERT', p: '#438a6a', P: '#2e5153', q: '#6bb894' },
    { id: 'noir', name: 'NOIR', p: '#3b3b4f', P: '#23233a', q: '#6a6a85' },
    { id: 'beige', name: 'BEIGE', p: '#d9bd8c', P: '#b39560', q: '#f0dcb4' },
    { id: 'rouge', name: 'ROUGE', p: '#c0504d', P: '#8a3a2a', q: '#e08a74' },
    { id: 'violet', name: 'VIOLET', p: '#5a4a9e', P: '#3f3375', q: '#8a7ac8' },
    { id: 'blanc', name: 'BLANC', p: '#f4f4fa', P: '#b8bde0', q: '#ffffff' }
  ];
  var SHOES = [
    { id: 'sombres', name: 'SOMBRES', c: '#2b2850' }, { id: 'blanches', name: 'BLANCHES', c: '#f4f4fa' },
    { id: 'rouges', name: 'ROUGES', c: '#c0453a' }, { id: 'nus', name: 'PIEDS NUS', c: null }
  ];

  /** Lignes de l'écran de création : clé de config, libellé, liste, couleur d'aperçu. */
  var OPTIONS = [
    { key: 'hair', label: 'COIFFURE', list: HAIRS },
    { key: 'hairColor', label: 'CHEVEUX', list: HAIR_COLORS, sw: 'h' },
    { key: 'eyes', label: 'YEUX', list: EYES },
    { key: 'eyeColor', label: 'COUL. YEUX', list: EYE_COLORS, sw: 'c' },
    { key: 'skin', label: 'PEAU', list: SKINS, sw: 's' },
    { key: 'top', label: 'HAUT', list: TOPS },
    { key: 'topColor', label: 'COUL. HAUT', list: TOP_COLORS, sw: 't' },
    { key: 'bottom', label: 'BAS', list: BOTTOMS },
    { key: 'bottomColor', label: 'COUL. BAS', list: BOTTOM_COLORS, sw: 'p' },
    { key: 'shoes', label: 'CHAUSSURES', list: SHOES, sw: 'c' }
  ];

  /** 8 modèles de départ ; le n° 1 est exactement le sprite Figma. */
  var PRESETS = [
    { hair: 'courts', hairColor: 'brun', eyes: 'ronds', eyeColor: 'noir', skin: 'clair', top: 'veste', topColor: 'vert', bottom: 'pantalon', bottomColor: 'bleu', shoes: 'sombres' },
    { hair: 'milong', hairColor: 'chatain', eyes: 'ronds', eyeColor: 'marron', skin: 'clair', top: 'sweat', topColor: 'corail', bottom: 'short', bottomColor: 'rouge', shoes: 'sombres' },
    { hair: 'courts', hairColor: 'roux', eyes: 'ronds', eyeColor: 'vert', skin: 'pale', top: 'chemise', topColor: 'ciel', bottom: 'pantalon', bottomColor: 'gris', shoes: 'sombres' },
    { hair: 'frange', hairColor: 'roux', eyes: 'petits', eyeColor: 'noisette', skin: 'pale', top: 'tshirt', topColor: 'blanc', bottom: 'pantalon', bottomColor: 'gris', shoes: 'blanches' },
    { hair: 'courts', hairColor: 'noir', eyes: 'ronds', eyeColor: 'noir', skin: 'hale', top: 'tshirt', topColor: 'violet', bottom: 'pantalon', bottomColor: 'marron', shoes: 'sombres' },
    { hair: 'milong', hairColor: 'noir', eyes: 'endormis', eyeColor: 'noir', skin: 'brun', top: 'debardeur', topColor: 'blanc', bottom: 'pantalon', bottomColor: 'marron', shoes: 'sombres' },
    { hair: 'boucles', hairColor: 'blond', eyes: 'ronds', eyeColor: 'bleu', skin: 'clair', top: 'tshirt', topColor: 'ciel', bottom: 'pantalon', bottomColor: 'vert', shoes: 'blanches' },
    { hair: 'frange', hairColor: 'blond', eyes: 'ronds', eyeColor: 'bleu', skin: 'pale', top: 'sweat', topColor: 'violet', bottom: 'pantalon', bottomColor: 'violet', shoes: 'sombres' }
  ];

  // ---------- Calques : coordonnées [ligne, colonne, motif] sur la grille 15×19 ----------
  // Lettres : h cheveux, H cheveux sombres, l reflet ; s peau, S ombre, L lumière ; d contour ;
  // t/T/u haut (base, ombre, clair) ; p/P/q bas ; x chaussures ; w blanc des yeux ; i iris.
  // Pose de trois quarts vers la droite, relevée case par case sur le sprite Figma (nœud 6:19).

  /** Tête nue (visage, oreille à gauche, cou). */
  var HEAD = [
    [1, 4, 'ssssssss'], [2, 3, 'ssssssssss'], [3, 2, 'ssssssssssss'], [4, 1, 'sssssssssssss'],
    [5, 1, 'sssssssssssss'], [6, 1, 'ssssssssssss'], [6, 13, 'd'],
    [7, 1, 'ssSsssssssss'], [8, 2, 'sSsLssLLssL'], [9, 4, 'SsssssssS'], [10, 4, 'SSSSSSSS']
  ];

  var HAIR_SHAPES = {
    // « courts » = coiffure du sprite Figma, recopiée telle quelle
    courts: [[1, 4, 'hhhHdHhh'], [2, 3, 'hllhhHdHhl'], [3, 2, 'hllhhHHHHHhl'], [4, 1, 'hlhhHH'], [4, 7, 'SSSSS'], [4, 12, 'Hh'],
      [5, 1, 'hhHH'], [5, 5, 'SS'], [5, 12, 'SH'], [6, 1, 'HHSS'], [7, 1, 'H']],
    frange: [[1, 4, 'hhhhhhhh'], [2, 3, 'hllhhhhhhh'], [3, 2, 'hllhhhhhhhhl'], [4, 1, 'hlhhhhhhhhhhh'], [5, 1, 'hhHHhHhHhHhHH'],
      [6, 1, 'HHSS'], [6, 5, 'S'], [6, 8, 'SS'], [6, 12, 'S'], [7, 1, 'H']],
    boucles: [[1, 4, 'hlhhlhhh'], [2, 3, 'hhhlhhhlhh'], [3, 2, 'lhhhhlhhhlhh'], [4, 1, 'hhlhhHHhlhHhh'], [5, 1, 'hlhHS'], [5, 6, 'S'],
      [5, 12, 'Hh'], [6, 1, 'hhl'], [6, 13, 'h'], [7, 1, 'hl'], [8, 1, 'h']],
    milong: [[1, 4, 'hhhHdHhh'], [2, 3, 'hllhhHdHhl'], [3, 2, 'hllhhHHHHHhl'], [4, 1, 'hlhhHH'], [4, 7, 'SSSSS'], [4, 12, 'Hh'],
      [5, 1, 'hhHH'], [5, 5, 'SS'], [5, 12, 'SH'], [6, 1, 'HHHS'], [6, 13, 'H'], [7, 1, 'hHH'], [8, 1, 'hhH'], [9, 1, 'hhH'], [10, 1, 'hhh'], [11, 1, 'hh']],
    chignon: [[1, 1, 'hl'], [2, 1, 'hh'], [1, 4, 'hhhhHHhh'], [2, 3, 'hllhhhHHhl'], [3, 2, 'hllhhhhHHHhl'], [4, 1, 'hlhhHH'], [4, 7, 'SSSSS'],
      [4, 12, 'Hh'], [5, 1, 'hhHH'], [5, 5, 'SS'], [5, 12, 'SH'], [6, 1, 'HHSS'], [7, 1, 'H']],
    rase: [[1, 4, 'HHHHHHHH'], [2, 3, 'HHHHHHHHHH'], [3, 2, 'HHHHHHHHHHHH'], [4, 1, 'HHHH'], [4, 12, 'HH'], [5, 1, 'HH'], [5, 13, 'H']],
    crete: [[1, 5, 'hlhhh'], [2, 3, 'SSShlhhh'], [3, 2, 'SSSSSShhhh'], [4, 1, 'SSSS'], [4, 8, 'hH']],
    chauve: [[2, 5, 'LL'], [3, 4, 'L']]
  };

  // Yeux : 3 lignes × 2 colonnes, posés aux colonnes 6 et 10 (blanc à gauche, pupille à droite : regard vers la droite).
  // « . » = on garde la peau.
  var EYE_SHAPES = {
    ronds: ['dd', 'wi', 'wi'],
    petits: ['..', 'wi', '..'],
    fermes: ['..', 'dd', '..'],
    endormis: ['dd', 'wi', '..']
  };

  // ---------- Poses (animations) ----------
  var POSES = {
    idle0: { head: 0, legs: 'stand', armL: 'down', armR: 'down' },
    idle1: { head: 1, legs: 'stand', armL: 'down', armR: 'down' },
    walk0: { head: 0, legs: 'stand', armL: 'swingUp', armR: 'swingDown' },
    walk1: { head: 1, legs: 'stepL', armL: 'down', armR: 'down' },
    walk2: { head: 0, legs: 'stand', armL: 'swingDown', armR: 'swingUp' },
    walk3: { head: 1, legs: 'stepR', armL: 'down', armR: 'down' },
    jump: { head: 0, legs: 'tuck', armL: 'raised', armR: 'raised' },
    cheer0: { head: 0, legs: 'stand', armL: 'raised', armR: 'raised' },
    cheer1: { head: 1, legs: 'stand', armL: 'raised', armR: 'raised' },
    // escalade (colonnes) et accroche à un rebord : bras levés, jambes qui alternent
    climb0: { head: 0, legs: 'stepL', armL: 'raised', armR: 'raised' },
    climb1: { head: 0, legs: 'stepR', armL: 'raised', armR: 'raised' },
    hang: { head: 0, legs: 'stand', armL: 'raised', armR: 'raised' },
    // accroupi : la pose de repos tassée (voir squash)
    crouch: { head: 0, legs: 'stand', armL: 'down', armR: 'down', squash: true }
  };
  // Bras : cases de l'épaule vers la main [ligne, colonne], puis cases de la main (mains asymétriques, comme sur Figma).
  var ARMS = {
    L: {
      down: { arm: [[12, 2], [13, 2]], hand: [[14, 2], [14, 3]] },
      swingUp: { arm: [[11, 2], [12, 2]], hand: [[13, 1], [13, 2]] },
      swingDown: { arm: [[12, 2], [13, 3]], hand: [[14, 3], [14, 4]] },
      raised: { arm: [[11, 2], [10, 1]], hand: [[9, 0], [9, 1]] }
    },
    R: {
      down: { arm: [[12, 13], [13, 13]], hand: [[14, 13]] },
      swingUp: { arm: [[11, 13], [12, 13]], hand: [[13, 13]] },
      swingDown: { arm: [[12, 13], [13, 13]], hand: [[14, 12], [14, 13]] },
      raised: { arm: [[11, 13], [10, 13]], hand: [[9, 13]] }
    }
  };

  // ---------- Utilitaires ----------
  function find(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  }
  function palette(cfg) {
    var sk = find(SKINS, cfg.skin), hc = find(HAIR_COLORS, cfg.hairColor), ec = find(EYE_COLORS, cfg.eyeColor),
        tc = find(TOP_COLORS, cfg.topColor), bc = find(BOTTOM_COLORS, cfg.bottomColor), sh = find(SHOES, cfg.shoes);
    return { s: sk.s, S: sk.S, L: sk.L, h: hc.h, H: hc.H, l: hc.l, t: tc.t, T: tc.T, u: tc.u, p: bc.p, P: bc.P, q: bc.q,
             x: sh.c || sk.s, w: '#fffdfe', d: OUTLINE, i: ec.c };
  }
  function blank() { var g = []; for (var y = 0; y < H; y++) g.push(new Array(W).fill(null)); return g; }
  function put(g, pal, y, x, str, dy) {
    y += dy || 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charAt(i), xx = x + i;
      if (ch === '.' || y < 0 || y >= H || xx < 0 || xx >= W) continue;
      if (pal[ch]) g[y][xx] = pal[ch];
    }
  }
  function layer(g, pal, list, dy) { list.forEach(function (seg) { put(g, pal, seg[0], seg[1], seg[2], dy); }); }

  // ---------- Calques ----------
  /** Bas : ceinture (ligne 14), bassin (15), entrejambe (16), jambes (17). */
  function drawBottom(g, pal, cfg, legs) {
    var b = cfg.bottom;
    var lift = legLift(legs), dyL = lift.L, dyR = lift.R;
    var legL = 'Pp', legR = 'Pp';
    if (b === 'pantalon') {
      put(g, pal, 14, 4, 'PPPPPPPPP'); put(g, pal, 15, 4, 'PpppppppP'); put(g, pal, 16, 4, 'PpPPPPPp');
    } else if (b === 'short') {
      put(g, pal, 14, 4, 'PPPPPPPPP'); put(g, pal, 15, 4, 'PpppppppP'); put(g, pal, 16, 4, 'Pp'); put(g, pal, 16, 10, 'Pp');
      legL = legR = 'sS';
    } else if (b === 'jupe') {
      put(g, pal, 14, 4, 'PPPPPPPPP'); put(g, pal, 15, 3, 'pppppppppp'); put(g, pal, 16, 3, 'pPppPppPpP');
      legL = legR = 'sS';
    } else { // slip
      put(g, pal, 14, 4, 'qqqqqqqqq'); put(g, pal, 15, 4, 'PpppppppP'); put(g, pal, 16, 4, 'sS'); put(g, pal, 16, 10, 'sS');
      legL = legR = 'sS';
    }
    // jambe levée : la case de la jambe disparaît (la chaussure remonte d'une ligne)
    if (dyL === 0) put(g, pal, 17, 4, legL);
    if (dyR === 0) put(g, pal, 17, 10, legR);
  }

  /**
   * Chaussures en deux temps :
   *  - dessus (avant le contour) : couleur de la chaussure ou pied nu sur la dernière ligne de jambe (17),
   *    pour que le contour entoure bien le pied ; la paire sombre garde la jambe du sprite Figma ;
   *  - semelle sombre « dddd » (après le contour) sur la ligne 18, toujours, qui ferme le pied.
   * Jambe levée (marche, saut) : tout remonte d'une ligne.
   */
  function legLift(legs) {
    return { L: (legs === 'stepL' || legs === 'tuck') ? -1 : 0, R: (legs === 'stepR' || legs === 'tuck') ? -1 : 0 };
  }
  function drawShoeTops(g, pal, cfg, legs) {
    if (cfg.shoes === 'sombres') return;
    var d = legLift(legs), top = cfg.shoes === 'nus' ? 'sS' : 'xx';
    put(g, pal, 17 + d.L, 4, top); put(g, pal, 17 + d.R, 10, top);
  }
  function drawSoles(g, pal, cfg, legs) {
    var d = legLift(legs);
    put(g, pal, 18 + d.L, 3, 'dddd'); put(g, pal, 18 + d.R, 9, 'dddd');
  }

  function drawTorso(g, pal, cfg) {
    var t = cfg.top, rows;
    if (t === 'nu') rows = ['ssssssssss', 'sssSsssSss', 'ssssSsssss'];
    else if (t === 'debardeur') rows = ['sstsssstss', 'tttttttttt', 'tttttttttt'];
    else if (t === 'tshirt') rows = ['ttttTTTttt', 'tttttttttt', 'tttttttttt'];
    else if (t === 'sweat') rows = ['tttuuuuttt', 'tttttttttt', 'tTtTTTTttT'];
    else if (t === 'veste') rows = ['ttttttTttt', 'ttttttTttt', 'tTttttTttT'];
    else rows = ['tttussuttt', 'tttttTtttt', 'tTtttTtttT']; // chemise
    rows.forEach(function (r, i) { put(g, pal, 11 + i, 3, r); });
    if (t === 'tshirt') { put(g, pal, 13, 4, 'T'); put(g, pal, 13, 12, 'T'); }
  }

  function drawArm(g, pal, cfg, side, pose) {
    var a = ARMS[side][pose] || ARMS[side].down, sleeve = find(TOPS, cfg.top).sleeve;
    a.arm.forEach(function (c, i) { put(g, pal, c[0], c[1], i < sleeve ? 't' : 's'); });
    a.hand.forEach(function (c) { put(g, pal, c[0], c[1], 's'); });
  }

  function drawHead(g, pal, cfg, dy) {
    layer(g, pal, HEAD, dy);
    var eye = EYE_SHAPES[cfg.eyes] || EYE_SHAPES.ronds;
    eye.forEach(function (row, i) { put(g, pal, 6 + i, 6, row, dy); put(g, pal, 6 + i, 10, row, dy); });
    layer(g, pal, HAIR_SHAPES[cfg.hair] || [], dy);
  }

  /** Ajoute le contour sombre (4 voisins) autour de la silhouette. */
  function outline(g) {
    var o = blank();
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      if (g[y][x]) { o[y][x] = g[y][x]; continue; }
      if ((y > 0 && g[y - 1][x]) || (y < H - 1 && g[y + 1][x]) || (x > 0 && g[y][x - 1]) || (x < W - 1 && g[y][x + 1])) o[y][x] = OUTLINE;
    }
    return o;
  }

  /** Accroupi : on retire le cou (lignes 9 à 11) et le haut des jambes (15-16), puis on recale l'image en bas (14 lignes visibles). */
  function squash(g) {
    var keep = g.filter(function (row, y) { return [9, 10, 11, 15, 16].indexOf(y) < 0; }), out = blank();
    keep.forEach(function (row, i) { out[H - keep.length + i] = row; });
    return out;
  }

  /** Assemble une image de la pose (grille 15×19 de couleurs CSS ou null). */
  function compose(cfg, pose) {
    cfg = sanitize(cfg);
    pose = typeof pose === 'string' ? POSES[pose] : (pose || POSES.idle0);
    var g = blank(), pal = palette(cfg);
    drawBottom(g, pal, cfg, pose.legs);
    drawTorso(g, pal, cfg);
    drawHead(g, pal, cfg, pose.head);   // la tête passe DEVANT le torse quand elle s'abaisse (respiration)
    drawArm(g, pal, cfg, 'L', pose.armL);
    drawArm(g, pal, cfg, 'R', pose.armR);
    drawShoeTops(g, pal, cfg, pose.legs);
    var o = outline(g);
    drawSoles(o, pal, cfg, pose.legs);
    return pose.squash ? squash(o) : o;
  }

  function toCanvas(grid) {
    var o = GP.PixelArt.canvas(W, H);
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++)
      if (grid[y][x]) { o.ctx.fillStyle = grid[y][x]; o.ctx.fillRect(x, y, 1, 1); }
    return o.cv;
  }

  // ---------- API publique ----------
  function sanitize(cfg) {
    var out = {};
    OPTIONS.forEach(function (o) { out[o.key] = find(o.list, cfg && cfg[o.key]).id; });
    return out;
  }
  function defaultConfig() { return Object.assign({}, PRESETS[0]); }
  function randomConfig() {
    var c = {};
    OPTIONS.forEach(function (o) { c[o.key] = o.list[Math.floor(Math.random() * o.list.length)].id; });
    return c;
  }

  /**
   * Crée les textures <prefix><pose> (ex. hero_walk0). Avec le préfixe « hero_ », crée aussi les
   * alias hero_idle / hero_cheer et les animations hero-idle, hero-walk, hero-jump, hero-cheer.
   */
  function build(scene, cfg, prefix) {
    prefix = prefix || 'hero_';
    cfg = sanitize(cfg);
    Object.keys(POSES).forEach(function (k) {
      GP.PixelArt.toTexture(scene, prefix + k, toCanvas(compose(cfg, POSES[k])));
    });
    if (prefix !== 'hero_') return;
    GP.PixelArt.toTexture(scene, 'hero_idle', toCanvas(compose(cfg, POSES.idle0)));
    GP.PixelArt.toTexture(scene, 'hero_cheer', toCanvas(compose(cfg, POSES.cheer0)));
    var anims = {
      'hero-idle': { frames: ['idle0', 'idle1'], rate: 2 },
      'hero-walk': { frames: ['walk0', 'walk1', 'walk2', 'walk3'], rate: 8 },
      'hero-jump': { frames: ['jump'], rate: 1 },
      'hero-cheer': { frames: ['cheer0', 'cheer1'], rate: 4 },
      'hero-climb': { frames: ['climb0', 'climb1'], rate: 6 },
      'hero-hang': { frames: ['hang'], rate: 1 },
      'hero-crouch': { frames: ['crouch'], rate: 1 }
    };
    Object.keys(anims).forEach(function (key) {
      if (scene.anims.exists(key)) scene.anims.remove(key);
      scene.anims.create({
        key: key, frameRate: anims[key].rate, repeat: -1,
        frames: anims[key].frames.map(function (f) { return { key: 'hero_' + f }; })
      });
    });
  }

  return {
    W: W, H: H, OPTIONS: OPTIONS, PRESETS: PRESETS, POSES: POSES,
    sanitize: sanitize, defaultConfig: defaultConfig, randomConfig: randomConfig, build: build, compose: compose,
    swatch: function (opt, id) {
      var e = find(opt.list, id); return opt.sw ? (e[opt.sw] || null) : null;
    }
  };
})();
