/** Adaptations explicites des documents de conception au moteur existant, sans exécuter leurs textes. */
GP.GZoneLevels = (function () {
  var ids = ['jardin-des-plantes', 'cathedrale', 'chateau', 'feydeau', 'graslin', 'machines', 'chantiers', 'buren', 'hangar', 'pommeraye', 'memorial', 'tour-lu'];

  /**
   * ÉQUILIBRAGE DE LA DIFFICULTÉ (novembre 2026). Ajustements d'obstacles par-dessus les documents importés :
   * gzones.js est un fichier généré, on n'y touche pas. Mesure et détail : tools/balance.cjs et docs/equilibrage.md.
   *   retirer : obstacles supprimés { sprite, x, y }   ajouter : obstacles posés sur un sol plat et dégagé (vérifié par tests/balance.test.js)
   *   vitesse : facteur sur la vitesse des ennemis en patrouille (oiseaux, tonneaux)
   * Intention : un début plus doux (1 à 3), le pic du niveau 6 écrêté, des niveaux 7 à 12 plus vifs. Le Mémorial (11) reste
   * sans ennemi ni pointe : sa difficulté vient des séquences de dalles et de la marée (GZoneRuntime).
   */
  var BALANCE = {
    1: {},   // refonte : obstacles et vitesses réglés dans REDESIGNS
    2: { vitesse: 0.85, retirer: [{ sprite: 'cathedrale_cierge_flamme', x: 28, y: 21 }, { sprite: 'cathedrale_cierge_flamme', x: 40, y: 21 }] },
    3: { vitesse: 0.9 },
    // Feydeau : les pointes se superposaient aux mouettes (îlot x=56, balcons x=137 et 145) ou aux piliers (x=68) : retirées.
    4: { retirer: [56, 68].map(function (x) { return { sprite: 'feydeau_obstacle_ancre_pointes', x: x, y: x === 56 ? 7 : 13 }; }).concat([{ sprite: 'feydeau_obstacle_ancre_pointes', x: 137, y: 10 }, { sprite: 'feydeau_obstacle_ancre_pointes', x: 145, y: 8 }]) },
    5: { retirer: [{ sprite: 'commun_pointes_fer_1', x: 155, y: 5 }] },
    6: { retirer: [{ sprite: 'vapeur', x: 61, y: 10 }, { sprite: 'vapeur', x: 139, y: 13 }] },
    7: { vitesse: 1.1, ajouter: [{ sprite: 'chantiers_obstacle_ferraille', x: 194, y: 14, kind: 'mortel' },
      { sprite: 'chantiers_obstacle_ferraille', x: 204, y: 14, kind: 'mortel' }] },
    8: { vitesse: 1.1 },
    9: { vitesse: 1.1, ajouter: [{ sprite: 'hangar_obstacle_tole_coupante', x: 92, y: 12, kind: 'mortel' }] },
    10: { vitesse: 1.1 },
    12: { vitesse: 1.1 }
  };
  function balance(d) {
    var b = BALANCE[d.num];
    if (!b || d.equilibre) return;
    d.equilibre = true;
    (b.retirer || []).forEach(function (r) {
      d.dangers = d.dangers.filter(function (h) { return !(h.sprite === r.sprite && h.x === r.x && h.y === r.y); });
    });
    (b.ajouter || []).forEach(function (h) { d.dangers.push(Object.assign({}, h)); });
    if (b.vitesse) (d.ennemis || []).forEach(function (e) { if (e.vitesse) e.vitesse = Math.round(e.vitesse * b.vitesse * 100) / 100; });
  }
  /**
   * RETOUCHES DE GÉOMÉTRIE : corrections de faisabilité et de lisibilité par-dessus les documents importés (gzones.js reste
   * intact). Chaque retouche est vérifiée par `node tools/solvability.cjs` : un niveau doit être finissable, pixels compris.
   *   retirer : ids de plateformes supprimées · modifier : { id: propriétés } · ajouter : plateformes ajoutées
   */
  var REPAIRS = {
    // Jardin : entièrement redessiné, voir REDESIGNS (ses panneaux sont dans la refonte).
    // Cathédrale : les montants de la porte des toits étaient des murs pleins de 4 tuiles sur le chemin du joueur (la porte
    // se traverse entre eux, elle ne se contourne pas). Ils deviennent des jambages de décor ; le linteau reste au-dessus.
    // + panneaux avant les cierges, les colonnes et les gargouilles.
    // + l'escalier (p9 à p16) était fait de piles d'une tuile, traitées comme des plateformes à sens unique : on les traversait. Il devient
    // une vraie pente continue (rampe, 45°) qui se monte en marchant.
    2: { retirer: ['p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16'], ajouter: [{ type: 'rampe', id: 'rampe1', x0: 50, y0: 22, x1: 58, y1: 14, top_sprite: 'cathedrale_pierre_haut', fill_sprite: 'cathedrale_pierre_blanche_pleine_2' }],
      modifier: { p23: { fond: true }, p24: { fond: true } },
      signes: [{ x: 24, y: 21, texte: 'Cierges et pointes : saute par-dessus.' }, { x: 27, y: 21, texte: 'Maintiens ↑ contre une colonne pour y grimper.' },
        { x: 92, y: 7, texte: 'La gargouille crache : passe entre deux jets.' }] },
    // Feydeau : le pilier du balcon secret (une colonne pleine de 3 tuiles posée sur le tablier) barrait l'entrée du balcon depuis
    // les bateaux, donc le niveau était infinissable après x=132. Il devient un pilier de décor.
    // + panneaux avant les pointes du quai et avant la première mouette (à passer accroupi).
    4: { modifier: { p37: { fond: true } },
      signes: [{ x: 26, y: 13, texte: 'Les pointes piquent : saute par-dessus.' }, { x: 39, y: 10, texte: 'Les mouettes rasent les balcons : maintiens ↓ pour passer dessous.' }] },
    // Graslin : aucun panneau dans le document d'origine. Un par idée, avant sa première rencontre : parasol, chaises, tonneau, lustre.
    // Les pixels des fosses à pointes (x=123 et 144, au fond) sont remontés sur les lustres ; celui de x=30 s'éloigne des chaises.
    5: { deplacer: [{ de: { x: 123, y: 19.25 }, vers: { x: 123, y: 6.25 } }, { de: { x: 144, y: 19.25 }, vers: { x: 144, y: 4.25 } }, { de: { x: 30, y: 16.25 }, vers: { x: 29, y: 16.25 } }],
      signes: [{ x: 11, y: 19, texte: 'Saute sur un parasol : il te fait rebondir.' }, { x: 22, y: 13, texte: 'Chaises et pointes piquent : saute par-dessus.' },
      { x: 62, y: 14, texte: 'Le tonneau roule : saute au bon moment.' }, { x: 117, y: 7, texte: 'Le lustre oscille : saute dessus quand il approche.' }] },
    // Machines : dents (avant la première), vapeur cyclique, piston.
    6: { signes: [{ x: 22, y: 13, texte: 'Les dents des engrenages piquent : saute par-dessus.' }, { x: 33, y: 11, texte: 'La vapeur jaillit par intermittence : passe quand elle retombe.' },
      { x: 77, y: 8, texte: 'Les pistons montent et descendent : saute dessus quand il est bas.' }] },
    // Chantiers : ferraille, oiseaux bas, ascenseur, vapeur cyclique.
    7: { signes: [{ x: 30, y: 16, texte: 'La ferraille coupe : saute par-dessus.' }, { x: 46, y: 15, texte: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.' },
      { x: 90, y: 9, texte: "L'ascenseur monte quand tu montes dessus : attends-le." }, { x: 101, y: 5, texte: 'La vapeur jaillit par intermittence : passe quand elle retombe.' }] },
    // Buren : bornes, sens des anneaux (rouge, bleu), oiseaux bas, anneau clignotant.
    8: { signes: [{ x: 17, y: 13, texte: 'Les bornes piquent : saute par-dessus.' }, { x: 27, y: 10, texte: "Anneau rouge : élan vers l'avant. Anneau bleu : élan vers le haut." },
      { x: 56, y: 11, texte: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.' }, { x: 149, y: 9, texte: "L'anneau change de couleur : attends la bonne avant de sauter." }] },
    // Hangar : tôle coupante, portes coulissantes, tonneau roulant.
    9: { signes: [{ x: 21, y: 18, texte: 'La tôle coupe : saute par-dessus.' }, { x: 93, y: 12, texte: 'La porte se ferme par intermittence : passe quand elle est ouverte.' },
      { x: 124, y: 8, texte: 'Le tonneau roule : saute au bon moment.' }] },
    // Pommeraye : oiseau bas et lustre qui se balance, annoncés avant le grand escalier.
    10: { signes: [{ x: 58, y: 14, texte: 'Les oiseaux volent bas : maintiens ↓ pour passer dessous.' }, { x: 62, y: 13, texte: 'Le lustre se balance : saute dessus quand il approche.' }] },
    // Mémorial : la marée recouvre le sol par moments (le recueillement reste : un seul panneau, sobre).
    11: { signes: [{ x: 84, y: 12, texte: 'La marée recouvre le sol par moments : avance quand elle est basse.' }] },
    // Tour LU : seule mécanique nouvelle, le courant d'air ; puis le but de l'arène. (Le reste est un rappel des niveaux précédents.)
    12: { signes: [{ x: 145, y: 4, texte: "Courant d'air : entre dedans pour t'élever, tu retomberas tout doucement." }, { x: 190, y: 5, texte: "Allume les quatre lanternes hautes avec les courants d'air pour dissiper le Vortex." }] }
  };
  /**
   * REFONTES : un niveau entièrement redessiné remplace ici la géométrie du document importé (gzones.js reste intact : fond,
   * météo et image à reconstruire sont conservés). Contrôle : `node tools/solvability.cjs 1` et tests/levels.test.js.
   *
   * 1 · Jardin des Plantes (11 novembre 2026). Ordre d'apprentissage : course → saut → ronces → eau (d'abord sous un pont) →
   * plateformes hautes sans danger (Palmarium) → oiseau (accroupi) → jet d'eau (d'abord au sec) → combinaison finale.
   * Trois lanternes (x = 42, 85, 115). Les collisions des décors (buisson, topiaires, serre) sont mesurées sur les sprites.
   */
  var PONT = ['commun_pont_planches_g', 'commun_pont_planches_m', 'commun_pont_planches_d'];
  function herbe(id, x, y, w) { return { id: id, type: 'masse', style: 'herbe', x: x, y: y, w: w, grab: false }; }
  function sol(id, x, w) { return { id: id, type: 'masse', style: 'herbe', x: x, y: 15, w: w }; }
  function pave(id, x, y, w, note) { return { id: id, type: 'masse', x: x, y: y, w: w, top_sprite: 'jardin_pave_haut_1', fill_sprite: 'jardin_pave_plein', note: note }; }
  function pont(id, x, w) { return { id: id, type: 'pont', x: x, y: 15, w: w, sprite_set: PONT }; }
  function pad(id, x, y, w) { return { id: id + '_pad', type: 'pad', x: x, y: y, w: w, solid: 'top', sur: id }; }
  function eau(x, w) { return { sprite: 'jardin_bassin_surface', x: x, y: 16, w: w, kind: 'eau_mortelle', note: 'chute = retour checkpoint' }; }
  function jet(x, y, decalage) { return { sprite: 'jardin_jet_eau', x: x, y: y, kind: 'cyclique', cycle: { periode_s: 3, actif_s: 1, decalage_s: decalage, hauteur_tuiles: 4, top_y: y - 3, frame_actif: 1 } }; }
  // Un oiseau touche le joueur debout et passe au-dessus du joueur accroupi : il vole 1,625 tuile au-dessus de la surface
  // (zone de contact de l'oiseau : 4 px dans la tête du joueur debout, 2 px au-dessus du joueur accroupi).
  function oiseau(id, x1, x2, surface) { return { id: id, sprite: 'ciel_oiseau', type: 'patrouille_horizontale', x1: x1, x2: x2, y: surface - 1.625, vitesse: 2.6, touche: 'debout', esquive: 'accroupi' }; }
  var REDESIGNS = {
    1: {
      temps_ref_s: 75,
      spec: { pixels: 15, checkpoints: 3, obstacles_mortels: 3, boss: null },
      zones: [{ n: 1, nom: 'Sortie de Gare & Entrée du Parc', x: [0, 24] }, { n: 2, nom: 'Les Allées Fleuries & Petits Bassins', x: [24, 55] },
        { n: 3, nom: 'Le Palmarium et les Topiaires', x: [55, 86] }, { n: 4, nom: "Les Bassins à Jets d'Eau", x: [86, 114] },
        { n: 5, nom: 'Le Grand Marronnier & Arche Finale', x: [114, 140] }],
      plateformes: [
        pave('p1', 0, 15, 14), sol('p2', 14, 23), pont('p3', 37, 3), sol('p4', 40, 5), sol('p5', 47, 4), sol('p6', 53, 37),
        pave('p7', 90, 15, 3, 'margelle du jet au sec'), sol('p8', 93, 3),
        pont('p9', 96, 4), pave('p10', 100, 16, 2, "pilier du jet d'eau"), pont('p11', 104, 4), pave('p12', 108, 16, 2, "pilier du jet d'eau"), pont('p13', 111, 3),
        sol('p14', 114, 26),
        herbe('m1', 19, 13, 3), herbe('m2', 31, 13, 3), herbe('m3', 81, 13, 3),
        herbe('m4', 120, 14, 2), herbe('m5', 122, 12, 7), herbe('m6', 129, 13, 2), herbe('m7', 131, 11, 3),
        pad('buisson1', 15.25, 14.2, 1.25), pad('topiaire_tete', 57.5, 12.3125, 1.25),
        { id: 'serre1_g', type: 'pad', x: 61, y: 10.625, w: 1.25, solid: 'top', sur: 'serre1' },
        { id: 'serre1_c', type: 'pad', x: 63.25, y: 9, w: 1.5, solid: 'top', sur: 'serre1' },
        { id: 'serre1_d', type: 'pad', x: 65.9, y: 10.625, w: 1.25, solid: 'top', sur: 'serre1' },
        pad('topiaire_oiseau', 68.875, 12.5625, 1.25)
      ],
      dangers: [
        { sprite: 'commun_ronces_1', x: 27, y: 14, kind: 'mortel' }, { sprite: 'commun_ronces_1', x: 30, y: 14, kind: 'mortel' },
        eau(37, 3), eau(45, 2), eau(51, 2),
        jet(91, 14, 0),
        eau(96, 4), jet(100.25, 15, 0), eau(102, 2), eau(104, 4), jet(108.25, 15, 1.5), eau(110, 1), eau(111, 3),
        { sprite: 'commun_ronces_2', x: 123, y: 11, kind: 'mortel' }, jet(129.25, 12, 0.75)
      ],
      ennemis: [
        oiseau('oiseau_sol', 75, 79, 15), oiseau('oiseau_massif', 80, 84, 13), oiseau('oiseau_final', 125, 128, 12),
        { id: 'papillon_serre', sprite: 'ciel_papillon', type: 'ambiance', x: 64, y: 5, inoffensif: true }
      ],
      pixels: [[16, 13], [20, 11], [27, 12], [32, 11], [46, 12], [52, 12], [60, 11], [64, 7], [68, 9], [77, 14], [82, 10], [98, 13], [106, 13], [117, 13], [131, 9]]
        .map(function (p, i) { return { id: i + 1, sprite: 'commun_pixel', x: p[0], y: p[1], difficulte: [7, 8, 10].indexOf(i) >= 0 ? 'risque' : 'facile', detail_image: Math.floor(i / 5) + 1 }; }),
      checkpoints: [42, 85, 115].map(function (x, i) { return { id: i + 1, x: x, y: 14, sprite_off: 'commun_lanterne_eteinte', sprite_on: 'commun_lanterne_allumee' }; }),
      signes: [
        { sprite: 'signes_panneau_saut', x: 13, y: 14, texte: 'Saute sur les buissons et les massifs pour attraper les pixels.' },
        { sprite: 'signes_panneau_saut', x: 24, y: 14, texte: 'Attention aux ronces : saute par-dessus !' },
        { sprite: 'signes_panneau_fleches', x: 72, y: 14, texte: 'Maintiens ↓ pour passer sous les oiseaux.' },
        { sprite: 'signes_panneau_fleches', x: 88, y: 14, texte: "Observe le jet d'eau et passe quand il retombe." }
      ],
      decor: [
        { sprite: 'jardin_gare_batiment', x: 0, y: 14, layer: 'sol' },
        { sprite: 'commun_buisson_a', x: 15, y: 14, id: 'buisson1' }, { sprite: 'commun_fleur_rouge', x: 17.5, y: 14 },
        { sprite: 'jardin_massif_fleurs_a', x: 19.5, y: 12 }, { sprite: 'jardin_lampadaire_parc', x: 22.75, y: 14 },
        { sprite: 'commun_touffe_herbe', x: 28.5, y: 14 }, { sprite: 'jardin_massif_fleurs_b', x: 31.5, y: 12 },
        { sprite: 'jardin_banc_parc', x: 34.75, y: 14 }, { sprite: 'commun_fleur_jaune', x: 40.5, y: 14 }, { sprite: 'jardin_massif_fleurs_c', x: 43, y: 14 },
        { sprite: 'jardin_pin_parasol', x: 47.1, y: 14 }, { sprite: 'jardin_arbre_feuillu_clair', x: 53.2, y: 14 },
        { sprite: 'jardin_topiaire_tete_endormie', x: 56, y: 14, id: 'topiaire_tete' }, { sprite: 'jardin_palmarium_serre', x: 60.5, y: 14, id: 'serre1' },
        { sprite: 'jardin_topiaire_oiseau', x: 68, y: 14, id: 'topiaire_oiseau' },
        { sprite: 'commun_fleur_rouge', x: 73.5, y: 14 }, { sprite: 'jardin_massif_fleurs_a', x: 81.5, y: 12 },
        { sprite: 'jardin_lampadaire_parc', x: 86.5, y: 14 }, { sprite: 'commun_touffe_herbe', x: 94, y: 14 },
        { sprite: 'jardin_arbre_marronnier', x: 116.25, y: 14 }, { sprite: 'commun_fleur_jaune', x: 119.2, y: 14 },
        { sprite: 'commun_touffe_herbe', x: 126.5, y: 11 }, { sprite: 'commun_fleur_rouge', x: 134.5, y: 14 }
      ],
      pedagogie: [{ x: [72, 80], texte: 'Oiseau à hauteur de tête sur sol plat : apprendre ↓ (panneau x=72).' }, { x: [86, 93], texte: "Jet d'eau au sec avant la traversée des pontons." }]
    }
  };
  // niveaux 2 à 12 redessinés : js/data/Redesigns.js (GP.Redesigns), chargé avant ce fichier
  Object.keys(GP.Redesigns || {}).forEach(function (n) { if (!REDESIGNS[n]) REDESIGNS[n] = GP.Redesigns[n]; });
  function redesign(d) {
    var r = REDESIGNS[d.num];
    if (!r || d.refonte) return;
    // un niveau redessiné n'a plus besoin des retouches ni de l'équilibrage du document importé
    d.refonte = true; d.retouche = true; d.equilibre = true; Object.assign(d, JSON.parse(JSON.stringify(r)));
    d.sourceHash = 'refonte' + d.num + '-20261111-' + d.sourceHash;   // nouvelle révision : les parties en cours de l'ancien tracé sont écartées
  }
  function repair(d) {
    var r = REPAIRS[d.num];
    if (!r || d.retouche) return;
    d.retouche = true;
    (r.retirer || []).forEach(function (id) { d.plateformes = d.plateformes.filter(function (p) { return p.id !== id; }); });
    Object.keys(r.modifier || {}).forEach(function (id) {
      d.plateformes.forEach(function (p) { if (p.id === id) Object.assign(p, r.modifier[id]); });
    });
    (r.ajouter || []).forEach(function (p) { d.plateformes.push(Object.assign({}, p)); });
    (r.deplacer || []).forEach(function (m) { d.pixels.forEach(function (p) { if (p.x === m.de.x && p.y === m.de.y) { p.x = m.vers.x; p.y = m.vers.y; } }); });
    (r.signes || []).forEach(function (s) { d.signes.push(Object.assign({ sprite: 'signes_panneau_saut' }, s)); });
  }
  GP.GZONES.forEach(redesign);
  GP.GZONES.forEach(repair);
  GP.GZONES.forEach(balance);
  function make(d, id) {
    var L = GP.LevelBuilder.create(d.largeur, function () {}, d.hauteur);
    L.id = id; L.gzone = d; L.revision = 'gzones-1-' + d.sourceHash.slice(0, 12);
    L.startX = d.spawn.x; L.startRow = d.spawn.y;
    // Les objets du document sont bas-gauche ; le moteur historique centre les objets en X.
    L.pixels = d.pixels.map(function (p) { return { x: p.x, y: p.y }; });
    // Rapprocher d'une tuile le dernier anneau du petit palier : marge de déclenchement cohérente avec le corps 8×16.
    if(d.num===8)L.pixels.forEach(function(p){if(p.x===176&&p.y===5)p.x=175;});
    L.checks = d.checkpoints.map(function (p) { return { x: p.x, y: p.y }; });
    L.hints = d.signes.map(function (p) {
      var text=p.texte||'OBSERVE LE PASSAGE AVANT DE T’ENGAGER';
      text=text.replace(/↓/g,'{down}').replace(/↑/g,'{up}');
      if(/Saute/.test(text))text='{jump} : '+text;
      return {x:p.x,y:p.y,text:text};
    });
    L.abilities = { crouch: true, grab: d.num >= 2, climb: d.num >= 2 };
    L.reveal = id === 'cathedrale' ? 'bottomUp' : id === 'jardin-des-plantes' ? 'bottomUp' : 'bottomUp';
    L.zones = d.zones.map(function (z) { return { x: z.x[0], end: z.x[1], name: z.nom.toUpperCase() }; });
    L.exit = { x: d.arrivee.declencheur.x, y: d.arrivee.declencheur.y + 1, key: 'signes_arche_arrivee' };
    L.water = d.dangers.filter(function (p) { return p.kind === 'eau_mortelle'; }).map(function (p) { return { x: p.x, y: p.y, w: p.w || 1, h: 1 }; });
    (d.eau || []).forEach(function (p) { L.water.push({ x: p.x, y: p.y, w: p.w, h: d.hauteur - p.y }); });
    L.sky = { farKey: d.num === 12 ? 'carte_batiments_lointains' : (d.fond.couches[0] || {}).sprite, farBottom: 236 };
    L.roofs = [];
    function roof(x, end, y, wind) {
      var r = { x: x * 16, y: y * 16, w: (end - x) * 16, h: 8 };
      L.roofs.push(r); L.shelters.push({ id: id + '-couvert-' + L.roofs.length, x: r.x, y: r.y + r.h, w: r.w,
        h: d.hauteur * 16 - r.y - r.h, rain: 1, snow: 1, wind: wind });
    }
    // Couvertures bâties visibles, pas un cercle sec suivant le héros.
    if (d.num === 2) roof(17, 95, 2, 1);
    if (d.num === 6) roof(38, 80, 1, 0.75);
    if (d.num === 9) roof(44, 230, 1, 0.9);
    if (d.num === 10) roof(0, 210, 1, 1);
    if (d.num === 11) roof(88, 134, 4, 1);
    if (d.num === 12) { roof(48, 146, 1, 0.9); }
    if (d.boss) {
      var n = d.num === 12 ? 4 : 3;
      L.boss = { kind: d.num === 6 ? 'elephant' : d.num === 9 ? 'mould' : 'vortex', phases: n,
        start: d.num === 6 ? 160 : d.num === 9 ? 176 : 195, end: d.largeur,
        floor: d.num === 9 ? 19 : 16,
        goals: d.num === 6 ? d.valves : d.num === 9 ? d.lampes_uv :
          [{ x: 202, y: 6 }, { x: 248, y: 6 }, { x: 216, y: 5 }, { x: 232, y: 5 }] };
    }
    return L;
  }
  var old = {}; GP.LOCATIONS.forEach(function (l) { old[l.id] = l; });
  GP.LevelPrototypes = Object.assign({}, GP.LEVELS); // socle conservé, pas supprimé
  GP.LOCATIONS = ids.map(function (id, i) {
    var loc = old[id], d = GP.GZONES[i];
    loc.playable = true; loc.level = id;
    GP.Tuning.parTimes[id] = GP.Tuning.parTimes[id] || d.temps_ref_s;
    loc.parTime = GP.Tuning.parTimes[id];
    var rules = [
      'VARIATION VÉGÉTALE : allées, bassins et topiaires deviennent des appuis. Les jets sont cycliques et peuvent geler sous la neige. L’image se reconstruit par groupes de cellules.',
      'VARIATION VERTICALE : parvis, nef, galeries et toits. Colonnes et rebords permettent de monter ; la nef couverte protège des précipitations et du vent.',
      null,
      'SÉRIE DE FAÇADES : balcons portés, quais et bateaux flotteurs. Les balcons inclinés entraînent le joueur et les bateaux s’enfoncent sous son poids.',
      'RYTHME NÉOCLASSIQUE : perron, colonnes et fronton. Les parasols donnent un rebond et les lustres oscillent ; une interprétation ludique, pas une restitution du théâtre.',
      'MOUVEMENT INDUSTRIEL : passerelles, engrenages et bielles. Esquiver les jets puis activer trois valves calme l’Éléphant mécanique.',
      'LEVAGE : cales, rails, pylônes et flèche de grue. Les chariots démarrent sous le poids du joueur ; les tôles restent exposées aux intempéries.',
      'SÉRIE ET ÉLAN : les anneaux cadrent le quai et donnent des impulsions annoncées par des flèches. Leur propulsion est une convention de jeu, pas une propriété de l’œuvre.',
      'TRAVÉES ET CIRCULATION : portes et conteneurs mobiles structurent le hangar couvert. Trois lampes UV neutralisent une moisissure fictive dans l’épreuve finale.',
      'TROIS STRATES : galerie, escalier et coursives sous une verrière. Lustres mobiles et dalles fragiles sont des conventions ludiques ; le passage est abrité.',
      'MÉMOIRE ET LECTURE : des séquences de hauteurs indiquent les dalles solides. La montée d’eau est une métaphore lente, pas une simulation de la marée réelle.',
      'ASCENSION FINALE : strates de la tour, horloge et coupole. Les courants ascendants donnent accès aux quatre lanternes qui dissipent le Vortex fictif.'
    ];
    if (rules[i]) loc.grammar = rules[i];
    if (id !== 'chateau') GP.LEVELS[id] = make(d, id); // conserver le Château déjà adapté et testé
    return loc;
  });
  GP.LAST_PLAYABLE = 11;
  GP.Config.ROUTE_VERSION = 'gzones-1';
  return { ids: ids, make: make, balance: BALANCE, repairs: REPAIRS, redesigns: REDESIGNS };
})();
