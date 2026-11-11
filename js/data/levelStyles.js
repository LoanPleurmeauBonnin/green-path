/** Habillage explicite des parcours, indépendant de leur géométrie et des JSON sources.
 * Une largeur de pilier n'est PAS un matériau. Les exceptions sont nommées par leur identifiant source.
 */
GP.LevelStyles = (function () {
  var natural = {
    kind: 'natural', top: ['commun_herbe_haut_1', 'commun_herbe_haut_2', 'commun_herbe_haut_3'],
    fill: ['commun_terre_1', 'commun_terre_2', 'commun_terre_3'],
    left: 'commun_terre_gauche', right: 'commun_terre_droite', bottom: 'commun_terre_bas',
    topLeft: 'commun_herbe_haut_gauche', topRight: 'commun_herbe_haut_droite'
  };
  function family(kind, prefix) {
    return { kind: kind, top: prefix + '_sol_haut_1', fill: prefix + '_sol_plein',
      left: prefix + '_sol_gauche', right: prefix + '_sol_droite' };
  }
  var concrete = { kind: 'quay', top: 'gz_quay_top', fill: 'gz_quay_fill', left: 'gz_quay_left', right: 'gz_quay_right' };
  var stone = { kind: 'masonry', top: 'commun_pierre_haut', fill: 'commun_pierre_pleine', left: 'commun_pierre_gauche', right: 'commun_pierre_droite' };
  var metal = { kind: 'metal' };
  var profiles = {
    1: { base: natural, groups: { quay: 'p1', masonry: 'p8 p9' } },
    2: { base: { kind: 'masonry', top: 'cathedrale_pierre_haut', fill: ['cathedrale_pierre_blanche_pleine_1', 'cathedrale_pierre_blanche_pleine_2', 'cathedrale_pierre_blanche_pleine_3'], left: 'cathedrale_pierre_gauche', right: 'cathedrale_pierre_droite', bottom: 'cathedrale_pierre_bas' } },
    3: { base: stone },
    4: { base: family('quay', 'feydeau'), groups: { masonry: 'p2 p4 p6 p8 p10 p13 p30 p35 p37 p39 p42' } },
    5: { base: family('masonry', 'graslin') },
    6: { base: family('masonry', 'machines'), groups: {
      metal: 'p6 p7 p11 p12 p15 p16 p22 p23 p25 p26 p37 p38 p44 p45 p51 p52 p55 p56 p58 p59 p61 p63 p64 p72 p73 p75 p76 p82 p83 p85 p86 p88 p89'
    } },
    7: { base: metal, groups: { natural: 'p1 p2 p3 p43', quay: 'p7 p8 p9 p10' } },
    8: { base: family('quay', 'buren') },
    9: { base: family('quay', 'hangar'), groups: {
      masonry: 'p15 p16 p19 p23 p25 p28 p38 p41 p45',
      metal: 'p21 p34 p43 p44 p53 p54 p56 p57 p59 p60'
    } },
    10: { base: family('masonry', 'pommeraye') },
    11: { base: family('quay', 'memorial'), groups: { masonry: 'p4 p7 p10 p14 p17 p20 p23 p25 p26 p39 p43 p47 p51 p55' } },
    12: { base: stone, groups: { metal: 'm35 m36 m37 m38 m39 m40 m41 m42 m43 m44 m45 m46' } }
  };
  function material(d, p) {
    var profile = profiles[d.num];
    if (!profile) throw new Error('Profil de matériau absent : ' + d.num);
    var kind = profile.base.kind, group = profile.groups || {};
    Object.keys(group).forEach(function (name) { if (group[name].split(' ').indexOf(p.id) >= 0) kind = name; });
    var result = kind === profile.base.kind ? Object.assign({}, profile.base) :
      Object.assign({}, kind === 'natural' ? natural : kind === 'metal' ? metal : kind === 'quay' ? concrete : stone);
    // Les textures explicites du document restent utilisées dans leur famille, jamais pour changer la sémantique.
    if (kind === profile.base.kind && kind !== 'natural' && kind !== 'metal') {
      var source = (d.tuiles || {})[p.tuiles] || {};
      result.top = p.top_sprite || source.haut || result.top;
      result.fill = p.fill_sprite || source.plein || result.fill;
      result.left = source.gauche || result.left;
      result.right = source.droite || result.right;
    }
    if (d.num === 1 && p.id === 'p1') return { kind: 'quay', top: ['jardin_pave_haut_1', 'jardin_pave_haut_2', 'jardin_pave_haut_3'], fill: 'jardin_pave_plein', left: 'jardin_pave_gauche', right: 'jardin_pave_droite' };
    return result;
  }

  /** Groupes de pièces sans identifiant dans les documents : sélection par coordonnées SOURCE explicites. */
  var groups = [];
  function group(level, owner, sprite, x, w, ys) { groups.push({ level: level, owner: owner, sprite: sprite, x: x, end: x + w, ys: ys }); }
  group(7, 'empile1', 'chantiers_toles_empilees', 32, 3, [15, 16]);
  group(7, 'empile2', 'chantiers_toles_empilees', 197, 5, [13, 14]);
  group(8, 'banc', 'buren_banc_quai', 12, 1.5, [13]);
  group(11, 'banc3', 'memorial_banc_beton', 202, 1.5, [7]);
  [['pal1',14,[16.75,18]], ['pal2',45,[16.75,18]], ['pal3',106,[11]], ['pal4',154,[11]], ['pal5',180,[15.5,16.75,18]]]
    .forEach(function (v) { group(9, v[0], 'hangar_palettes_caisses', v[1], 3, v[2]); });
  [['c1',19,[15,16.5,18]], ['c2',27,[15]], ['c4',56,[12.5]], ['c6',77,[9,10.5,12,13.5,15,16.5,18]], ['c7',113,[10]], ['c9',142,[8.5]], ['cc',196,[11.5]]]
    .forEach(function (v) { group(9, v[0], 'hangar_conteneur_bleu', v[1], 5, v[2]); });
  [['c3',50,16.5], ['c5',70,14.5], ['c8',134,12.5], ['c10',159,14.5], ['cg',186,15.5], ['cd',214,15.5]]
    .forEach(function (v) { group(9, v[0], 'hangar_conteneur_rouge', v[1], 5, [v[2]]); });
  var pipes = { tuyau1: ['p18','p19','p20','p21'], tuyau2: ['p28','p29','p30','p31','p32'], tuyau3: ['p66','p67','p68','p69'] };
  function bindVisuals(d, visuals) {
    visuals.forEach(function (v) {
      var match = groups.filter(function (g) { return g.level === d.num && g.sprite === v.sprite && v.x >= g.x && v.x < g.end && g.ys.indexOf(v.y) >= 0; });
      if (match.length > 1) throw new Error('Décor associé à plusieurs groupes : ' + v.sprite);
      if (match.length) v.surfaceId = match[0].owner;
      if (d.num === 6 && v.id) Object.keys(pipes).forEach(function (owner) { if (pipes[owner].indexOf(v.id) >= 0) v.surfaceId = owner; });
    });
  }
  function surface(d, p, visuals) {
    if (d.num === 10 && /^lustre[123]$/.test(p.id || '')) {
      var info = GP.Sprites.info('pommeraye_lustre'), width = info.w / 16;
      p.x += ((p.w || 1) - width) / 2; // garder le centre et la hauteur du chemin, retirer les ailes de collision invisibles
      p.w = width;
    }
    if (d.num === 7 && /^coque[12]$/.test(p.id || '')) p.sprite = 'chantiers_coque_navire';
    if (d.num === 7 && p.id === 'ascenseur') p.sprite_set = ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d'];
    if (d.num === 7 && p.id === 'empile2') p.sprite_set = ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d']; // le tablier visible porte toute la largeur du corps
    if (d.num === 6 && ['bielle1','piston','diag'].indexOf(p.id) >= 0) p.sprite = 'machines_bielle';
    if (d.num === 6 && /^gearp2?$/.test(p.id || '')) {
      [0,1].forEach(function (i) { visuals.push({ surfaceId: p.id, sprite: 'machines_engrenage_petit', x: p.x + i, y: p.y }); });
    }
  }
  function apply(L) {
    if (L.id === 'jardin-des-plantes') {
      L.sky = Object.assign({}, L.sky, { farKey: 'lv_fond_parc' });
      L.artDecor = [
        { key: 'lv_sil_orange', x: 84 * 16 + 8, y: 240 },
        { key: 'lv_sil_jaune', x: 113 * 16 + 8, y: 240 },
        { key: 'lv_sil_ruban', x: 130 * 16 + 8, y: 240 }
      ];
    }
    if (L.id === 'chateau') {
      L.sky = Object.assign({}, L.sky, { farKey: 'lv_fond_chateau' });
      // Réutiliser les salles sans inventer une couverture dans l'avant-cour ouverte : cadrage des deux seules baies.
      L.rooms = (L.rooms || []).filter(function (r) { return !r.id || r.id.indexOf('style-') !== 0; }).concat([
        { id: 'style-passage-1', x: 40, y: 192, w: 64, h: 48, key: 'lv_salle_herses', sourceX: 16, sourceY: 72, depth: 2 },
        { id: 'style-passage-2', x: 56, y: 192, w: 64, h: 48, key: 'lv_salle_gardes', sourceX: 128, sourceY: 144, depth: 2 }
      ]);
    }
  }
  var replacements = { jardin_massif_fleurs_a: 'lv_massif_rouge', jardin_massif_fleurs_b: 'lv_hortensia', jardin_massif_fleurs_c: 'lv_herbes_hautes' };
  function decorate(d, v) {
    if (d.num === 1 && replacements[v.sprite]) v.sprite = replacements[v.sprite];
  }
  return { material: material, bindVisuals: bindVisuals, surface: surface, apply: apply, decorate: decorate };
})();
