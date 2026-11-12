/**
 * Niveaux de la ville : Île Feydeau, Place Graslin, Machines de l'île, Parc des Chantiers, Anneaux de Buren, Hangar à Bananes.
 * Même constructeur que js/data/levels.js (L.ground, L.plat, L.pix…), plus les briques de js/systems/Dangers.js :
 *   L.patrol(x0, x1, 'esprit' | 'robot', vitesse)   L.muse(x, sens, période, décalage)   L.mold(x, w, période, décalage)   L.glass(x, y, w)   L.memo(stèle, porte, 'DJD')   L.draft(x0, x1, y0, y1)   L.tide(x0, x1, ligne basse, ligne haute, période)   L.boat(x, y, w)
 *   L.liar(x, y, texte)  L.faller(x, y, période, décalage)  L.jet(x, hauteur, période, décalage)  L.beam(x0, x1, vitesse)
 *   L.spring(x)  L.seq(x, 'LRD')  L.belt(x0, x1, sens, vitesse)  L.cart(x, y, w, dx)  L.ring(x, y, couleur)  L.align([anneaux], x, y, w)
 *   L.pond(x0, x1, ligne)  L.rotting()
 * Repères : 17 lignes, un sol de hauteur 3 a sa surface à la ligne 14. Saut normal : 3 tuiles de haut, 4 de long.
 * Chaque niveau a UNE mécanique propre, un décor propre au lieu (planches de sprites + fond), et 2 ou 3 réactions à la météo
 * (L.wxm règle les nombres, L.weatherText les annonce). Un signe précède toujours un danger (ombre, souffle, tremblement).
 */

/** NIVEAU 4 — ÎLE FEYDEAU : l'eau monte (marée), les bateaux s'enfoncent, les visages des façades mentent. */
GP.LEVELS['feydeau'] = (function () {
  var L = GP.LevelBuilder.create(132, function (L) {
    // 1. Le quai : sauter, un balcon, une ancre à pointes, et un premier visage qui ment
    L.ground(0, 26, 3);
    L.start(2);
    L.hint(4, 'LE QUAI EST SOLIDE : COURS ET SAUTE');
    L.deco(6, 'feydeau_bollard', { depth: 4 }); L.deco(10, 'feydeau_hotel_armateur_b_penchee', { depth: 1 });
    L.deco(17, 'feydeau_hotel_armateur_a', { depth: 1 }); L.deco(23, 'feydeau_ancre', { depth: 4 });
    L.pixRow(7, 13, 3);
    L.plat(12, 12, 3); L.pix(13, 11);
    L.thorn(16, 1); L.pix(16, 11);
    L.liar(17, 10, "SAUTE DANS L'EAU !");
    L.check(24);
    // 2. La marée : le bas quai est noyé à marée haute, les balcons restent au sec
    L.hint(25, 'LA MARÉE MONTE : GRIMPE SUR LES BALCONS');
    L.ground(26, 36, 2);
    L.tide(26, 62, 17, 14, 9000);
    [30, 38, 46, 54].forEach(function (x) { L.plat(x, 13, 3); L.pix(x + 1, 12); });
    [28, 34, 42, 50, 58].forEach(function (x) { L.pix(x, 14); });
    L.deco(34, 'feydeau_hotel_armateur_a', { depth: 1 }); L.deco(50, 'feydeau_hotel_armateur_b_penchee', { depth: 1 });
    // 3. Les gabares : des bateaux qui s'enfoncent si on reste dessus, un qui glisse
    L.ground(62, 5, 3);
    L.check(63);
    L.hint(64, "LES BATEAUX COULENT SI TU RESTES");
    L.pond(67, 104, 15);
    L.boat(68, 14, 2); L.boat(72, 14, 2); L.boat(76, 13, 2);
    L.mover(80, 14, 2, 4, 0, 4400);
    L.boat(86, 14, 2);
    L.pix(69, 12); L.pix(73, 12); L.pix(77, 11); L.pix(82, 12); L.pix(87, 12);
    L.ground(90, 6, 3);
    L.check(91);
    L.deco(94, 'feydeau_hotel_armateur_a', { depth: 1 });
    L.liar(94, 10, 'RETOURNE EN ARRIÈRE !');
    L.pix(93, 13);
    L.boat(97, 14, 2); L.boat(101, 14, 2);
    L.pix(98, 12); L.pix(102, 12);
    // 4. La cour : balcons penchés, un visage qui dit « fonce » devant des pointes
    L.ground(104, 28, 3);
    L.hint(106, 'ATTENTION AUX VISAGES DES FAÇADES');
    L.deco(109, 'feydeau_hotel_armateur_a', { depth: 1 }); L.deco(119, 'feydeau_hotel_armateur_b_penchee', { depth: 1 }); L.deco(127, 'feydeau_hotel_armateur_a', { depth: 1 });
    L.plat(108, 12, 3); L.pix(109, 11);
    L.thorn(112, 1); L.pix(112, 11);
    L.plat(114, 11, 3); L.pix(115, 10);
    L.check(117);
    L.liar(119, 9, "FONCE, IL N'Y A RIEN !");
    L.thorn(121, 2); L.pix(121, 11); L.pix(122, 11);
    L.plat(124, 12, 3); L.pix(125, 11);
    L.pixRow(127, 13, 2);
  });
  L.id = 'feydeau';
  L.maxTime = 200;                // limite douce (s) : 3 min par défaut, un peu plus pour les niveaux longs
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['feydeau_sol_haut_1', 'feydeau_sol_haut_2'], fill: 'feydeau_sol_plein', left: 'feydeau_sol_gauche', right: 'feydeau_sol_droite', block: 'feydeau_sol_plein',
    ledge: ['feydeau_balcon_fer_g', 'feydeau_balcon_fer_m', 'feydeau_balcon_fer_d'], mover: ['feydeau_balcon_fer_g', 'feydeau_balcon_fer_m', 'feydeau_balcon_fer_d']
  };
  L.thornKey = 'feydeau_obstacle_ancre_pointes'; L.thornText = 'AÏE, UNE ANCRE À POINTES !';
  L.sky = { farKey: 'lv_fond_feydeau', farBottom: 236 };         // hôtels d'armateurs en tuffeau, d'après des vues de l'île
  L.wxm = { rain: { tide: 1 }, sun: { tide: -1 }, wind: { boat: 1.5 } };
  L.weatherText = { rain: 'LA MARÉE MONTE PLUS HAUT', sun: 'LA MARÉE RESTE BASSE', wind: 'LA LOIRE EST AGITÉE : LES BATEAUX COULENT VITE' };
  return L;
})();

/** NIVEAU 5 — PLACE GRASLIN : les Muses du théâtre lancent des notes, parasols qui font rebondir, projecteurs, rideau à ouvrir. */
GP.LEVELS['graslin'] = (function () {
  // Parcours dans l'ordre du théâtre : parvis, escalier d'honneur à double révolution, foyer, salle (balcons en arc), scène et rideau.
  var L = GP.LevelBuilder.create(184, function (L) {
    // 1. Le parvis et ses terrasses : un premier parasol
    L.ground(0, 34, 3);
    L.start(2);
    L.hint(3, 'BIENVENUE À L\'OPÉRA GRASLIN : MONTE VERS LE THÉÂTRE');
    L.deco(5, 'graslin_table_cafe', { depth: 4 }); L.deco(9, 'graslin_lampadaire_ornemente', { depth: 3 }); L.deco(29, 'graslin_table_cafe', { depth: 4 });
    L.deco(12, 'lv_fountain', { depth: 3 });                                  // la fontaine de la place Graslin
    [1, 4, 8, 15, 19, 26, 32].forEach(function (bx) { L.deco(bx, 'feydeau_bollard', { depth: 4 }); });   // les bornes noires du parvis
    L.pix(6, 13); L.pix(13, 11); L.pix(17, 13);
    L.hint(20, 'LE PARASOL FAIT REBONDIR : SAUTE DESSUS');
    L.spring(22); L.plat(25, 10, 4); L.pix(26, 9); L.pix(27, 9);
    L.check(31);
    // 2. Le péristyle et le perron : les marches montent vers l'escalier d'honneur
    L.ground(34, 6, 4); L.ground(40, 6, 5); L.ground(46, 6, 6);
    L.pix(38, 12); L.pix(44, 11); L.pix(50, 10);
    // 3. L'escalier à double révolution : deux volées symétriques, on choisit son côté, elles se rejoignent au foyer
    L.ground(52, 8, 7);
    L.check(54);
    L.hint(55, "DEUX VOLÉES SYMÉTRIQUES : CHOISIS TON CÔTÉ");
    L.deco(56, 'lv_portes_theatre', { depth: 1 });                // les portes de l'Opéra Graslin : on entre dans le théâtre
    L.ground(60, 16, 5);                                    // volée basse : la plus sûre, une Muse la garde
    L.pix(62, 11); L.pix(66, 11); L.pix(72, 11);
    L.plat(61, 8, 3); L.plat(66, 7, 3); L.plat(71, 8, 3);   // volée haute : en l'air, plus de pixels
    L.pix(62, 7); L.pix(67, 6); L.pix(72, 7);
    // 4. Le foyer : longue galerie de promenade, les projecteurs balaient
    L.ground(76, 36, 7);
    L.deco(76, 'lv_sol_foyer', { dx: 35 * 8, dy: 15, depth: 5 });   // dallage et tapis rouge du foyer
    L.check(78);
    L.hint(77, "LES PROJECTEURS S'ALLUMENT : ARRÊTE-TOI ! ÉTEINTS : AVANCE");   // 1-2-3 soleil
    L.spots(76, 184);
    L.deco(84, 'graslin_colonne_corinthienne', { depth: 2 }); L.deco(98, 'graslin_colonne_corinthienne', { depth: 2 }); L.deco(108, 'graslin_colonne_corinthienne', { depth: 2 });
    L.pix(82, 9); L.pix(88, 9); L.pix(94, 9); L.pix(101, 9); L.pix(107, 9);
    L.check(110);
    // 5. La salle : le parterre, et les balcons en arc de cercle au-dessus (le haut rapporte plus)
    L.ground(112, 48, 5);
    L.deco(112, 'lv_sol_salle', { dx: 47 * 8, dy: 15, depth: 5 });   // moquette rouge de la salle
    L.deco(156, 'lv_rampe', { depth: 6 }); L.deco(158, 'lv_rampe', { depth: 6 });   // lampes de rampe, au pied de la scène
    L.hint(113, "LES BALCONS FORMENT UN ARC : LE HAUT RAPPORTE PLUS");
    L.balcon(116, 10, 3); L.balcon(120, 8, 3); L.balcon(124, 6, 3); L.balcon(130, 5, 5); L.balcon(137, 6, 3); L.balcon(141, 8, 3); L.balcon(145, 10, 3);   // les balcons du théâtre : on saute d'un balcon à l'autre
    L.pix(117, 9); L.pix(121, 7); L.pix(125, 5); L.pix(132, 4); L.pix(138, 5); L.pix(142, 7); L.pix(146, 9);
    L.pix(114, 11); L.pix(128, 11); L.pix(135, 11); L.pix(153, 11);
    L.check(130);
    // 6. La scène : rejouer la séquence pour ouvrir le rideau, dernière Muse
    L.ground(160, 24, 6);
    L.deco(160, 'lv_sol_scene', { dx: 23 * 8, dy: 15, depth: 5 });   // le plancher de la scène
    L.check(161);
    L.hint(162, 'REJOUE LA SÉQUENCE : < > V');
    L.seq(168, 'LRD');
    L.deco(178, 'graslin_muse_statue', { depth: 3 });
    L.pix(165, 10); L.pix(172, 10); L.pix(176, 10); L.pix(182, 9);
  });
  L.id = 'graslin';
  L.maxTime = 200;
  L.reveal = 'topDown';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['graslin_sol_haut_1', 'graslin_sol_haut_2'], fill: 'graslin_sol_plein', left: 'graslin_sol_gauche', right: 'graslin_sol_droite', block: 'graslin_sol_plein',
    ledge: ['graslin_terrasse_cafe_g', 'graslin_terrasse_cafe_m', 'graslin_terrasse_cafe_d'], mover: ['graslin_terrasse_cafe_g', 'graslin_terrasse_cafe_m', 'graslin_terrasse_cafe_d']
  };
  L.thornKey = 'graslin_obstacle_chaises'; L.thornText = 'AÏE, DES CHAISES RENVERSÉES !';
  L.sky = { farKey: 'lv_fond_graslin', farBottom: 236 };         // immeubles de la place, d'après des vues de Graslin
  L.farSwitch = [[0, 'lv_fond_graslin'], [58, 'lv_fond_foyer', 'OPÉRA GRASLIN : ON ENTRE DANS LE THÉÂTRE'], [112, 'lv_fond_salle', 'LA SALLE : LES BALCONS ET LES FAUTEUILS'], [160, 'lv_fond_scene', 'LA SCÈNE']];   // le foyer crème et or, la salle aux balcons, la scène aux rideaux rouges
  L.backdrop = { x: 27, key: 'lv_facade_graslin', scale: 1, tint: false };   // la façade à huit colonnes derrière le parvis
  L.wxm = { rain: { spot: 1.2 }, sun: { spot: 0.8 }, wind: { spring: 1.1 } };
  L.weatherText = { rain: 'LA PLUIE ÉTOUFFE LES PROJECTEURS : PLUS ESPACÉS', sun: 'LES PROJECTEURS S\'ALLUMENT PLUS SOUVENT', wind: 'LE VENT GONFLE LES PARASOLS : REBOND PLUS HAUT' };
  return L;
})();

/** NIVEAU 6 — MACHINES DE L'ÎLE : tapis et rails qui entraînent, jets de vapeur à contretemps, petits robots qui poursuivent. */
GP.LEVELS['machines'] = (function () {
  var L = GP.LevelBuilder.create(158, function (L) {
    // 1. Le parvis : les rails t'entraînent vers l'avant
    L.ground(0, 30, 3);
    L.start(2);
    L.hint(3, "LA GALERIE DES MACHINES : AVANCE VERS L'ÉLÉPHANT");
    L.deco(5, 'machines_charpente_module', { depth: 1 });
    L.deco(11, 'lv_carrousel', { depth: 2.5 });                  // le Carrousel des Mondes Marins
    L.pix(10, 13); L.pix(14, 13); L.pix(18, 13);
    L.thorn(26, 1); L.pix(26, 11);
    L.check(28);
    // 2. La galerie de vapeur : le souffle prévient, puis le jet monte
    L.ground(30, 32, 3);
    L.hint(32, 'LE SOUFFLE PRÉVIENT : ATTENDS, PUIS COURS');
    L.jet(36, 4, 3200, 0); L.jet(43, 4, 3200, 1600); L.jet(51, 4, 3000, 800); L.jet(57, 4, 3000, 2200);
    L.deco(47, 'lv_arbre_herons', { depth: 2.5 });               // l'Arbre aux Hérons
    L.pix(34, 13); L.pix(40, 13); L.pix(47, 13); L.pix(54, 13); L.pix(60, 13);
    L.check(47);
    L.hanger(40); L.hanger(54);
    L.hint(38, "UNE ARAIGNÉE DESCEND : REGARDE-LA POUR LA FIGER OU ACCROUPIS-TOI");
    // 3. L'horlogerie : rails à contre-sens, des robots te poursuivent
    L.ground(62, 38, 3);
    L.hint(64, "LES ARAIGNÉES AVANCENT SI TU NE LES REGARDES PAS");
    L.deco(90, 'lv_gardienne', { depth: 2.5 });                  // la Gardienne des Ténèbres (l'araignée)
    L.patrol(66, 76, 'araignee', 40); L.patrol(82, 96, 'araignee', 44);
    L.patrol(70, 92, 'oiseau', 55);                       // un héron mécanique plonge au-dessus du quai
    L.plat(70, 12, 3); L.pix(71, 11); L.plat(86, 12, 3); L.pix(87, 11);
    L.thorn(78, 1); L.pix(78, 11); L.thorn(94, 1); L.pix(94, 11);
    L.pix(68, 13); L.pix(84, 13);
    L.check(79);
    // 4. La passerelle : jets sous les coursives
    L.ground(100, 22, 3);
    L.plat(104, 12, 3); L.pix(105, 11); L.plat(110, 11, 3); L.pix(111, 10); L.plat(116, 12, 3); L.pix(117, 11);
    L.jet(108, 4, 3000, 0); L.jet(114, 4, 3000, 1500);
    L.check(101);
    L.hanger(120);
    L.patrol(103, 119, 'oiseau', 50);
    L.hint(100, 'DES HÉRONS PLONGENT : ATTENDS QU\'ILS REMONTENT');
    // 5. L'esplanade : le Grand Éléphant traverse le canal, on grimpe sur son dos (croupe, dos, toit, oreille, défenses)
    L.ground(122, 10, 3);
    L.jet(125, 4, 3600, 0); L.jet(128, 4, 3600, 1800);
    L.patrol(123, 127, 'araignee', 36);
    L.hint(129, "MONTE SUR LE GRAND ÉLÉPHANT : IL TRAVERSE LE CANAL");
    L.pix(124, 13); L.pix(126, 11);
    L.check(122);
    L.pond(132, 150, 15);
    L.elephant(132, 150, 13000);
    L.pix(139, 8); L.pix(143, 8); L.pix(147, 9);
    L.ground(150, 8, 3);
    L.check(150);
    L.pix(152, 13); L.pix(155, 13); L.pix(157, 11);
  });
  L.id = 'machines';
  L.noWind = true;                // pas de vent aux Machines (il gênait)
  L.maxTime = 200;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['machines_sol_haut_1', 'machines_sol_haut_2'], fill: 'machines_sol_plein', left: 'machines_sol_gauche', right: 'machines_sol_droite', block: 'machines_sol_plein',
    ledge: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d'], mover: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d']
  };
  L.thornKey = 'lv_toile'; L.thornText = 'COLLÉ DANS UNE TOILE D\'ARAIGNÉE !';      // des toiles d'araignée au sol
  L.sky = { farKey: 'lv_fond_hangar', farBottom: 236 };         // la Galerie des Machines : verrière, portiques de béton, plancher clair
  L.wxm = { rain: { jet: 0.75 }, sun: { enemy: 1.25 } };
  L.weatherText = { rain: 'LA PLUIE REFROIDIT LES JETS : PLUS COURTS', sun: 'LE SOLEIL SURCHAUFFE LES ARAIGNÉES : PLUS RAPIDES' };
  return L;
})();

/** NIVEAU 7 — PARC DES CHANTIERS : conteneurs qui tombent de la grue (l'ombre prévient), chariots qui avancent quand on monte dessus. */
GP.LEVELS['chantiers'] = (function () {
  var L = GP.LevelBuilder.create(152, function (L) {
    // 1. La friche : un conteneur tombe ; un chariot passe la fosse
    L.ground(0, 18, 3);
    L.start(2);
    L.hint(3, "LES CONTENEURS TOMBENT : L'OMBRE PRÉVIENT");
    L.deco(5, 'chantiers_buisson_friche', { depth: 3 }); L.deco(14, 'chantiers_poteau_amarrage', { depth: 3 });
    L.faller(10, 1, 4200, 0);
    L.pix(7, 13); L.pix(13, 13);
    L.hint(15, 'MONTE SUR LE CHARIOT : IL AVANCE');
    L.ground(24, 46, 3);
    L.cart(18, 14, 3, 5);
    L.pix(21, 13);
    L.check(26);
    // 2. La cale de lancement : la pente t'entraîne en arrière, les conteneurs tombent
    L.hint(37, "LA CALE T'ENTRAÎNE EN ARRIÈRE : AVANCE QUAND MÊME");
    L.belt(36, 58, -1, 55);
    L.faller(42, 1, 3800, 0); L.faller(50, 1, 3800, 1900); L.faller(56, 1, 3800, 900);
    L.deco(46, 'chantiers_coque_navire', { depth: 3 });
    L.pix(40, 13); L.pix(46, 13); L.pix(53, 13); L.pix(60, 13);
    L.thorn(62, 1); L.pix(62, 11);
    L.check(65);
    // 3. Les pylônes de la grue : monter de tôle en tôle, les conteneurs tombent entre les pylônes
    L.ground(70, 36, 3);
    L.hint(72, 'GRIMPE LES TÔLES POUR LES PIXELS');
    L.deco(74, 'chantiers_grue_portique', { depth: 1 });
    L.plat(76, 12, 3); L.pix(77, 11); L.plat(82, 10, 3); L.pix(83, 9); L.plat(88, 8, 3); L.pix(89, 7); L.plat(94, 10, 3); L.pix(95, 9); L.plat(100, 12, 3); L.pix(101, 11);
    L.faller(80, 1, 3600, 0); L.faller(86, 1, 3600, 1800); L.faller(92, 1, 3600, 900);
    L.pix(79, 13); L.pix(97, 13);
    L.check(104);
    // 4. La flèche : trois chariots à la suite au-dessus du vide
    L.hint(102, 'LA GRUE PORTE DES CONTENEURS : MONTE DESSUS');
    L.crane(106, 12, 6, 0, 7000, 0); L.crane(114, 11, 6, 0, 7000, 3500); L.crane(122, 12, 6, 0, 7000, 0);   // la flèche de la grue jaune : trois conteneurs suspendus
    L.pix(110, 10); L.pix(118, 9); L.pix(126, 10);
    // 5. Le belvédère de la proue
    L.ground(130, 22, 3);
    L.check(131);
    L.deco(142, 'chantiers_grue_portique', { depth: 1 });
    L.faller(139, 1, 3600, 0);
    L.pix(133, 13); L.pix(137, 13); L.pix(143, 13); L.plat(145, 12, 3); L.pix(146, 11);
  });
  L.id = 'chantiers';
  L.maxTime = 210;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['chantiers_sol_pelouse_haut_1', 'chantiers_sol_pelouse_haut_2'], fill: 'chantiers_sol_plein', left: 'chantiers_sol_gauche', right: 'chantiers_sol_droite', block: 'chantiers_sol_plein',
    ledge: ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d'], mover: ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d'], cart: ['chantiers_tole_g', 'chantiers_tole_m', 'chantiers_tole_d']
  };
  L.thornKey = 'chantiers_obstacle_ferraille'; L.thornText = 'AÏE, DE LA FERRAILLE !';
  L.sky = { farKey: 'lv_fond_chantiers', farBottom: 236 };         // le parc des anciens chantiers navals : grues Titan jaune et grise, cales de lancement, Loire
  L.wxm = { rain: { belt: 1.3 }, sun: { mover: 1.3 }, wind: { fall: 0.8 } };
  L.weatherText = { rain: 'LA PLUIE LUBRIFIE LA CALE : PENTE PLUS VIVE', sun: 'LE SOLEIL ÉCHAUFFE LES CÂBLES : LA GRUE VA PLUS VITE', wind: 'LE VENT AGITE LA GRUE : CONTENEURS PLUS VITE' };
  return L;
})();

/** NIVEAU 8 — ANNEAUX DE BUREN : de nuit comme de jour, des bornes de couleur (bleu, vert, rouge) allument les passerelles néon de leur couleur au-dessus de la Loire. */
GP.LEVELS['buren'] = (function () {
  var L = GP.LevelBuilder.create(150, function (L) {
    // 1. Le quai des Antilles : on apprend la borne ; une île au milieu du bras d'eau porte la borne rouge
    L.ground(0, 18, 3);
    L.start(2);
    L.hint(3, "MARCHE SUR UNE BORNE : LES PASSERELLES DE SA COULEUR S'ALLUMENT");
    L.deco(6, 'buren_banc_quai', { depth: 4 });
    L.pix(7, 13); L.pix(12, 13);
    L.borne(15, 'blue');
    L.pond(18, 27, 15);
    L.cplat(19, 13, 3, 'blue'); L.ground(23, 2, 3); L.borne(23, 'red'); L.cplat(25, 13, 2, 'red');
    L.pix(20, 11);
    // 2. Un escalier vert vers une passerelle en inox (pixels en prime)
    L.ground(27, 48, 3);
    L.check(28);
    L.pix(31, 13); L.pix(35, 13);
    L.hint(30, "BORNE VERTE : L'ESCALIER VERT S'ALLUME");
    L.borne(30, 'green'); L.cplat(33, 12, 3, 'green'); L.cplat(36, 10, 3, 'green'); L.plat(40, 8, 4); L.pix(41, 7); L.pix(42, 7);
    L.pix(46, 13); L.pix(50, 13);
    L.check(48);
    // 3. Le quai se poursuit, puis un grand bras d'eau : bleu, puis vert depuis l'île
    L.pix(60, 13); L.pix(64, 13); L.pix(70, 13);
    L.hint(68, 'PRENDS LA COULEUR DE LA PROCHAINE PASSERELLE');
    L.borne(72, 'blue');
    L.pond(75, 88, 15);
    L.cplat(76, 13, 3, 'blue'); L.ground(80, 2, 3); L.borne(80, 'green'); L.cplat(83, 12, 3, 'green');
    L.pix(77, 11); L.pix(84, 10);
    // 4. La traversée finale de la Loire : bleu, vert, rouge
    L.ground(88, 20, 3);
    L.check(89);
    L.hint(94, 'BLEU, PUIS VERT, PUIS ROUGE : UNE BORNE PAR ÎLE');
    L.pix(92, 13); L.pix(100, 13);
    L.borne(105, 'blue');
    L.pond(108, 124, 15);
    L.cplat(109, 13, 3, 'blue'); L.ground(113, 2, 3); L.borne(113, 'green'); L.cplat(116, 12, 3, 'green'); L.ground(120, 2, 3); L.borne(120, 'red'); L.cplat(122, 13, 2, 'red');
    L.pix(110, 11); L.pix(117, 10); L.pix(122, 11);
    // 5. Le grand quai final
    L.ground(124, 26, 3);
    L.check(125);
    L.deco(132, 'buren_borne', { depth: 4 }); L.deco(140, 'buren_banc_quai', { depth: 4 });
    L.pix(127, 13); L.pix(131, 13); L.pix(135, 13); L.pix(139, 13); L.pix(144, 13);
  });
  L.id = 'buren';
  L.railing = true;               // garde-corps le long du quai (décor)
  L.nightFond = true;             // le fond a une version de jour et une de nuit (néon allumé), selon l'heure de la météo
  L.reveal = 'topDown';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['buren_sol_haut_1', 'buren_sol_haut_2'], fill: 'buren_sol_plein', left: 'buren_sol_gauche', right: 'buren_sol_droite', block: 'buren_sol_plein',
    ledge: ['buren_passerelle_inox_g', 'buren_passerelle_inox_m', 'buren_passerelle_inox_d'], bridge: ['buren_passerelle_inox_g', 'buren_passerelle_inox_m', 'buren_passerelle_inox_d']
  };
  L.thornKey = 'buren_obstacle_bornes_pointes'; L.thornText = 'AÏE, LES BORNES À POINTES !';
  L.sky = { farKey: 'lv_fond_buren_jour', farNightKey: 'lv_fond_buren_nuit', farBottom: 236 };       // la file d'anneaux néon en perspective, au-dessus de la Loire
    L.weatherText = { rain: 'LA PLUIE ÉTEINT LES BORNES : LA COULEUR NE DURE QUE 5 S', wind: 'LE VENT SOUFFLE SUR LA LOIRE' };
  return L;
})();

/** NIVEAU 9 — HANGAR À BANANES : la pourriture. Chaque pixel mûrit (vert, jaune récoltable, brun, effacé) et la moisissure gagne du terrain sur le sol. */
GP.LEVELS['hangar'] = (function () {
  var L = GP.LevelBuilder.create(140, function (L) {
    L.rotting(true);
    // décor du quai des Antilles : rails dans le pavage, garde-corps en acier corten, bollards, flèche de la grue grise
    [[1, 31], [64, 99], [101, 139]].forEach(function (seg) { for (var rx = seg[0]; rx <= seg[1]; rx++) L.deco(rx, 'lv_rails', { depth: 5, dy: 1 }); });
    [8, 17, 66, 90, 103, 121, 135].forEach(function (cx) { L.deco(cx, 'lv_corten', { depth: 3 }); });
    [12, 28, 70, 96, 110, 130].forEach(function (bx) { L.deco(bx, 'feydeau_bollard', { depth: 4 }); });
    [22, 107, 112, 125].forEach(function (fx) { L.deco(fx, 'lv_fleche_grue', { depth: 8, dy: -209 }); });
    // 1. La terrasse de bois : apprendre à récolter au bon moment
    L.ground(0, 32, 3);
    L.start(2);
    L.hint(3, 'RÉCOLTE LES PIXELS QUAND ILS SONT JAUNES !');
    L.deco(6, 'hangar_palettes_caisses', { depth: 4 }); L.deco(14, 'hangar_grue_quai', { depth: 1 }); L.deco(24, 'hangar_conteneur_bleu', { depth: 3 });
    L.deco(14, 'hangar_guirlande_lumineuse', { depth: 2, dy: -38 });   // accrochée au sommet de la grue de quai
    L.pix(7, 13); L.pix(10, 13); L.pix(13, 13); L.pix(16, 13);
    L.plat(19, 12, 3); L.pix(20, 11);
    L.faller(22, 1, 4200, 0, 'lv_caisse_bananes', 'UNE CAISSE DE BANANES T\'A ÉCRASÉ !');
    L.check(28);
    // 2. Le dock : des conteneurs qui glissent et qui montent
    L.ground(32, 6, 3);
    L.hint(33, 'LES CONTENEURS BOUGENT : MONTE DESSUS');
    L.mover(38, 13, 3, 5, 0, 4200); L.pix(41, 11);
    L.ground(46, 5, 3); L.pix(48, 13);
    L.mover(52, 13, 3, 0, -3, 4400);
    L.ground(55, 8, 6);
    L.check(56);
    L.pix(58, 10); L.pix(61, 10);
    // 3. La halle : de la tôle coupante pourrie, des pixels à cueillir entre deux
    L.ground(63, 37, 3);
    L.deco(70, 'hangar_hangar_facade', { depth: 1 }); L.deco(88, 'hangar_conteneur_rouge', { depth: 3 });
    L.mold(66, 5, 8000, 0); L.mold(76, 4, 8000, 2500); L.mold(86, 5, 8000, 5000); L.mold(94, 4, 8000, 1200);   // la moisissure gagne du terrain, puis recule
    L.pix(69, 11); L.pix(76, 11); L.pix(85, 11); L.pix(92, 11);
    L.pix(72, 13); L.pix(80, 13); L.pix(88, 13); L.pix(96, 13);
    L.check(78);
    // 4. Les palettes en hauteur
    L.ground(100, 16, 3);
    L.check(101);
    L.hint(102, "LA GRUE DU QUAI LÂCHE DES CAISSES DE BANANES : L'OMBRE PRÉVIENT");
    L.faller(128, 1, 3800, 0, 'lv_caisse_bananes', 'UNE CAISSE DE BANANES T\'A ÉCRASÉ !'); L.faller(134, 1, 3600, 1800, 'lv_caisse_bananes', 'UNE CAISSE DE BANANES T\'A ÉCRASÉ !');
    L.hint(103, 'LES CAISSES FONT UN ESCALIER : MONTE !');
    L.caisse(103, 1); L.caisse(105, 2); L.caisse(107, 3); L.caisse(109, 2); L.caisse(111, 1);           // escalier de caisses de bananes
    L.pix(103, 12); L.pix(105, 10); L.pix(107, 9); L.pix(109, 10); L.pix(111, 12);
    L.hint(113, 'LA GRUE PORTE DES CAISSES : TRAVERSE');
    L.pond(116, 124, 15);
    L.crane(116, 12, 4, 0, 7000, 0, 'lv_caisse_bananes'); L.crane(120, 12, 4, 0, 7000, 3500, 'lv_caisse_bananes');   // deux caisses suspendues à la grue traversent le vide
    L.pix(118, 10); L.pix(122, 10);
    L.ground(124, 16, 3);
    L.check(125);
    // 5. La mûrisserie : un grand tas de pixels, tous à des moments différents
    L.deco(132, 'hangar_conteneur_bleu', { depth: 3 });
    L.pix(124, 13); L.pix(127, 13); L.pix(129, 13); L.pix(124, 11); L.pix(128, 11);
  });
  L.id = 'hangar';
  L.maxTime = 240;                // il faut parfois attendre qu'un pixel jaunisse
  L.reveal = 'topDown';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['hangar_sol_haut_1', 'hangar_sol_haut_2'], fill: 'hangar_sol_plein', left: 'hangar_sol_gauche', right: 'hangar_sol_droite', block: 'hangar_sol_plein',
    ledge: ['hangar_terrasse_bois_g', 'hangar_terrasse_bois_m', 'hangar_terrasse_bois_d'], mover: ['hangar_terrasse_bois_g', 'hangar_terrasse_bois_m', 'hangar_terrasse_bois_d']
  };
  L.thornKey = 'hangar_obstacle_tole_coupante'; L.thornText = 'AÏE, DE LA TÔLE COUPANTE !';
  L.sky = { farKey: 'lv_fond_hangar_quai', farBottom: 236 };       // le quai des Antilles : long hangar blanc, grue Titan grise, anneaux, Loire
  L.wxm = { sun: { rot: 1.3, mold: 0.8 }, rain: { rot: 0.8, mold: 1.3 } };
  L.weatherText = { sun: 'LA CHALEUR FAIT POURRIR LES PIXELS PLUS VITE', rain: "L'HUMIDITÉ FAIT POUSSER LA MOISISSURE" };
  return L;
})();

/** NIVEAU 10 — MÉMORIAL DE L'ABOLITION DE L'ESCLAVAGE : sobre et sans ennemi. On lit une stèle, puis on rejoue sa séquence (BAS, HAUT) devant une porte de lumière ; dalles de verre qui se fissurent, marée calme. */
GP.LEVELS['memorial'] = (function () {
  var L = GP.LevelBuilder.create(176, function (L) {
    // 1. L'esplanade du quai de la Fosse : lire la première stèle
    L.ground(0, 36, 3);
    L.start(2);
    L.hint(3, 'ICI, ON SE SOUVIENT : PRENDS TON TEMPS');
    L.deco(5, 'memorial_banc_beton', { depth: 4 }); L.deco(9, 'memorial_lampadaire_sobre', { depth: 3 }); L.deco(30, 'memorial_lampadaire_sobre', { depth: 3 }); L.deco(20, 'memorial_banc_beton', { depth: 4 });
    L.pix(7, 13); L.pix(11, 13); L.pix(18, 13);
    L.hint(12, 'LIS LA STÈLE, PUIS REJOUE-LA : BAS = FLÈCHE BAS, HAUT = SAUT');
    L.memo(15, 24, 'DJD');
    L.check(27);
    L.pix(29, 13);
    L.plaque(28, "Le mémorial est inauguré le 25 mars 2012, quai de la Fosse, à Nantes.");
    L.plaque(33, "Un escalier à ciel ouvert descend vers un espace souterrain.");
    // 2. La descente vers le passage bas : une deuxième séquence, puis des dalles de verre au-dessus de l'eau
    L.ground(36, 6, 3);
    L.check(38);
    L.plaque(37, "Le Grand Passage est un mur de verre de 90 mètres, gravé de citations.");
    L.ground(42, 6, 2);
    L.ground(48, 8, 1);
    L.memo(44, 52, 'JJDJ');
    L.pond(56, 66, 16);
    L.hint(46, 'LE VERRE SE FISSURE : NE T\'ARRÊTE PAS');
    L.glass(57, 15, 2); L.glass(61, 15, 3);
    L.ground(66, 10, 2);
    L.check(70);
    L.pix(40, 13); L.pix(46, 14); L.pix(54, 15); L.pix(58, 14); L.pix(62, 14); L.pix(69, 14);
    // 3. Le couloir de la marée calme : l'eau respire (6 s), les bancs sont au sec
    L.ground(76, 36, 2);
    L.hint(78, 'LA MARÉE RESPIRE : MONTE SUR LES BANCS');
    L.tide(76, 112, 17, 14, 6000);
    [80, 88, 96, 104].forEach(function (x) { L.plat(x, 13, 3); });
    L.pix(81, 12); L.pix(97, 12); L.pix(105, 12);
    L.pix(84, 14); L.pix(92, 14); L.pix(100, 14); L.pix(108, 14);
    L.check(111);
    // 4. La traversée des stèles : une longue séquence, puis des dalles de verre
    L.ground(112, 20, 3);
    L.memo(113, 117, 'DJJDJ');
    L.plaque(129, "Article 4 : nul ne sera tenu en esclavage ni en servitude ; l'esclavage et la traite des esclaves sont interdits sous toutes leurs formes.");
    L.pix(120, 13); L.pix(123, 13); L.pix(126, 13); L.pix(129, 13);
    L.hint(119, "FRAPPE LES DATES DANS L'ORDRE : 1777, 1794, 1848, 1888");
    // la frise : quatre blocs datés (mélangés) au-dessus du sol ; on les frappe de la tête, dans l'ordre de l'histoire ; la porte s'ouvre quand elle est complète
    L.frise({ blocs: [[121, 11, 1848], [124, 11, 1777], [127, 11, 1888], [130, 11, 1794]], porte: 131 });
    L.check(129);
    L.pond(132, 147, 15);
    L.hint(133, "LA LOIRE, SOUS LE QUAI");
    L.plat(133, 14, 2); L.plat(137, 13, 2); L.plat(141, 14, 2); L.plat(145, 13, 2);   // en quinconce
    L.pix(138, 10); L.pix(146, 10); L.pix(142, 11);
    // 5. La remontée vers la lumière
    L.ground(147, 6, 3); L.ground(153, 6, 4); L.ground(159, 6, 5); L.ground(165, 11, 6);
    L.check(148);
    L.plaque(150, "Le mot « liberté » est écrit en 47 langues, dont le créole et des langues africaines.");
    L.plaque(168, "Une chronologie de l'abolition court de 1777 à 1888.");
    L.pix(150, 13); L.pix(155, 12); L.pix(161, 11); L.pix(168, 10); L.pix(172, 10);
    L.hint(160, 'LIBERTÉ');
  });
  L.id = 'memorial';
  L.maxTime = 210;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['memorial_sol_haut_1', 'memorial_sol_haut_2'], fill: 'memorial_sol_plein', left: 'memorial_sol_gauche', right: 'memorial_sol_droite', block: 'memorial_sol_plein',
    ledge: ['memorial_passerelle_metal_g', 'memorial_passerelle_metal_m', 'memorial_passerelle_metal_d'], mover: ['memorial_passerelle_metal_g', 'memorial_passerelle_metal_m', 'memorial_passerelle_metal_d']
  };
  L.sky = { farKey: 'lv_fond_memorial_corten', farBottom: 236 };         // tout le long : le grand mur d'acier corten
  L.bandeaux = [{ key: 'lv_titre_memorial_a', x: 3, y: 6 }, { key: 'lv_titre_memorial_b', suit: true, y: 6 }];   // le titre, en très grandes lettres, sur toute la longueur du niveau
  L.wxm = { rain: { tide: 1, glass: 0.8 }, sun: { tide: -1, glassback: 0.7 } };
  L.weatherText = { rain: 'LA MARÉE MONTE UN PEU ; LE VERRE CÈDE PLUS VITE', sun: 'LA MARÉE RESTE BASSE ; LE VERRE REVIENT VITE', wind: 'LE VENT SOUFFLE SUR LA LOIRE' };
  return L;
})();

/** NIVEAU 11 — PASSAGE POMMERAYE : un niveau vertical sur trois étages reliés par l'escalier monumental ; dalles de verre de la verrière qui se fissurent, lustres qui balancent. */
GP.LEVELS['pommeraye'] = (function () {
  var L = GP.LevelBuilder.create(172, function (L) {
    // 1. La galerie basse : des devantures, un premier lanterneau de verre
    L.ground(0, 40, 3);
    L.start(2);
    for (var tx = 1; tx < 40; tx++) L.deco(tx, 'lv_tapis_rouge', { depth: 5, dy: 1 });                                   // tapis rouge de la galerie basse
    L.hint(3, "LE VERRE SE FISSURE : NE T'ARRÊTE PAS");
    L.deco(3, 'lv_boutique_boulangerie', { depth: 1 }); L.deco(9, 'lv_boutique_vetements', { depth: 1 }); L.deco(18, 'lv_boutique_chaussettes', { depth: 1 }); L.deco(24, 'lv_boutique_chapeaux', { depth: 1 }); L.deco(30, 'lv_boutique_sacs', { depth: 1 }); L.deco(36, 'lv_boutique_vetements', { depth: 1 });   // les boutiques du passage
    L.deco(12, 'pommeraye_pilier_galerie', { depth: 2 }); L.deco(21, 'pommeraye_pilier_galerie', { depth: 2 }); L.deco(27, 'pommeraye_pilier_galerie', { depth: 2 });
    L.pix(7, 13); L.pix(8, 13);
    L.glass(14, 12, 3); L.pix(15, 11);
    L.glass(20, 11, 3); L.pix(21, 10);
    L.thorn(27, 2); L.pix(27, 11); L.pix(28, 11);
    L.check(32);
    // 2. Le grand escalier : quatre volées, des statues, un lustre qui balance
    L.ground(40, 8, 4); L.ground(48, 8, 5); L.ground(56, 8, 6); L.ground(64, 8, 7);
    for (var sx = 40; sx < 72; sx++) L.deco(sx, 'lv_tapis_rouge', { depth: 5, dy: 1 });                              // tapis rouge sur les marches du grand escalier
    L.hint(41, 'LES LUSTRES BALANCENT : MONTE DESSUS');
    L.deco(52, 'pommeraye_statue', { depth: 3 }); L.deco(60, 'pommeraye_statue', { depth: 3 });
    L.mover(44, 10, 3, 4, 0, 3400);
    L.pix(42, 12); L.pix(50, 11); L.pix(58, 10); L.pix(66, 9); L.pix(46, 9);
    L.plat(58, 8, 3); L.pix(59, 7);
    L.check(49); L.check(56);
    L.patrol(49, 54, 'statue', 30);                       // les statues du passage s'animent quand on ne les regarde pas
    // 3. La mezzanine : des ponts de verre au-dessus du vide, des balcons en fonte
    L.ground(64, 22, 7);
    L.hint(69, 'LES STATUES AVANCENT SI TU NE LES REGARDES PAS');
    L.patrol(72, 84, 'statue', 32);
    L.deco(70, 'pommeraye_pilier_galerie', { depth: 2 }); L.deco(76, 'lv_boutique_sacs', { depth: 1 }); L.deco(82, 'lv_boutique_chapeaux', { depth: 1 }); L.deco(80, 'pommeraye_lustre', { depth: 3, dy: -64 });
    L.pix(74, 9); L.pix(80, 9);
    L.glass(87, 10, 3); L.glass(92, 10, 3);
    L.pix(88, 9); L.pix(93, 9);
    L.ground(96, 36, 7);
    for (var mx = 97; mx < 131; mx++) L.deco(mx, 'lv_tapis_rouge', { depth: 5, dy: 1 });                                // tapis rouge de la mezzanine
    L.deco(99, 'lv_boutique_vetements', { depth: 1 }); L.deco(105, 'lv_boutique_boulangerie', { depth: 1 }); L.deco(115, 'lv_boutique_chaussettes', { depth: 1 }); L.deco(121, 'lv_boutique_chapeaux', { depth: 1 }); L.deco(127, 'lv_boutique_sacs', { depth: 1 });
    L.check(98);
    L.patrol(106, 122, 'statue', 34);
    // Le « Y » : un escalier de marches flottantes au centre ; en haut la galerie sous la verrière (pont de verre, plus de pixels), en bas les devantures (statues)
    L.hint(98, "AU CENTRE, L'ESCALIER : GALERIE HAUTE EN VERRE, OU DEVANTURES EN BAS");
    L.plat(100, 9, 2); L.plat(102, 8, 2); L.plat(104, 7, 2); L.plat(106, 6, 2);
    L.plat(108, 5, 6); L.glass(114, 5, 3); L.plat(117, 5, 5);
    L.plat(122, 6, 2); L.plat(124, 7, 2); L.plat(126, 8, 2); L.plat(128, 9, 2);
    L.pix(110, 4); L.pix(112, 4); L.pix(115, 4); L.pix(119, 4); L.pix(121, 4);
    L.pix(98, 9); L.pix(110, 9); L.pix(124, 9);
    // 4. Sous la verrière : on monte tout en haut, puis un dernier pont de verre
    L.ground(132, 6, 8); L.ground(138, 6, 9); L.ground(144, 6, 10); L.ground(150, 6, 11);
    for (var ux = 132; ux < 156; ux++) L.deco(ux, 'lv_tapis_rouge', { depth: 5, dy: 1 });                              // tapis rouge sur la dernière montée
    L.check(134);
    L.gargoyle(100, 0, 2400); L.gargoyle(120, 0, 2000); L.gargoyle(140, 0, 2200); L.gargoyle(160, 0, 2600);   // vitres cassées de la verrière : l'eau goutte sous la pluie
    L.pix(135, 7); L.pix(141, 6); L.pix(147, 5); L.pix(152, 4);
    L.glass(157, 6, 3); L.glass(162, 6, 3);
    L.pix(158, 5); L.pix(163, 5);
    L.ground(166, 6, 11);
    L.pix(168, 4);
  });
  L.id = 'pommeraye';
  L.maxTime = 210;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['pommeraye_sol_haut_1', 'pommeraye_sol_haut_2'], fill: 'pommeraye_sol_plein', left: 'pommeraye_sol_gauche', right: 'pommeraye_sol_droite', block: 'pommeraye_sol_plein',
    ledge: ['pommeraye_balcon_galerie_g', 'pommeraye_balcon_galerie_m', 'pommeraye_balcon_galerie_d'], mover: ['pommeraye_balcon_galerie_g', 'pommeraye_balcon_galerie_m', 'pommeraye_balcon_galerie_d']
  };
  L.thornKey = 'pommeraye_obstacle_grille_pointes'; L.thornText = 'AÏE, UNE GRILLE À POINTES !';
  L.sky = { farKey: 'lv_fond_pommeraye', farBottom: 272 };        // galerie à trois niveaux et verrière, dessinée d'après des vues du passage
  L.gargoyleKey = 'lv_fuite'; L.rainOnly = true;   // la verrière laisse passer la pluie par ses vitres cassées
  L.wxm = { rain: { glass: 0.7 }, sun: { glassback: 0.6 } };
  L.weatherText = { rain: 'LA PLUIE FRAGILISE LE VERRE ET GOUTTE PAR LES VITRES CASSÉES', sun: 'LE SOLEIL RÉCHAUFFE LE VERRE : IL REVIENT VITE', wind: 'LE VENT SOUFFLE DANS LA VERRIÈRE' };
  return L;
})();

/** NIVEAU 12 — TOUR LU : toutes les mécaniques reprises, puis la nouveauté : le courant d'air ascendant de la coupole (gravité allégée de moitié). Pas de boss. */
GP.LEVELS['tour-lu'] = (function () {
  var L = GP.LevelBuilder.create(200, function (L) {
    // 1. La rue devant la tour : un parasol de café (ressort), puis des petits-beurres flottants au-dessus du canal
    L.ground(0, 30, 3);
    L.start(2);
    L.hint(3, 'LA TOUR LU : TOUT CE QUE TU AS APPRIS SERT ICI');
    L.deco(5, 'lv_pan_stop', { depth: 3 }); L.deco(17, 'lv_pan_sens', { depth: 3 }); L.deco(23, 'lv_feu', { depth: 3 });
    L.pix(6, 13); L.pix(18, 13); L.pix(25, 13);
    L.hint(8, 'SAUTE SUR LE PARASOL DU CAFÉ');
    L.spring(10); L.plat(13, 10, 4); L.pix(14, 9); L.pix(15, 9);
    L.check(27);
    L.pond(30, 39, 15);
    L.plat(31, 13, 3); L.plat(35, 12, 3); L.pix(32, 11); L.pix(36, 10);
    // 2. La rue de la biscuiterie : jets de vapeur
    L.ground(39, 56, 3);
    L.check(41);
    L.hint(43, 'LA RUE DE LA BISCUITERIE : ATTENTION AUX BOUCHES DE VAPEUR'); L.deco(42, 'lv_pan_cedez', { depth: 3 }); L.deco(58, 'lv_pan_stop', { depth: 3 }); L.deco(77, 'lv_abribus', { depth: 3 });
    [9, 14, 46, 62, 84, 92, 133, 146, 162, 178, 196].forEach(function (tx) { L.deco(tx, 'lv_arbre_rue', { depth: 3 }); });   // arbres d'alignement posés au sol
    L.jet(48, 4, 3200, 0); L.jet(54, 4, 3200, 1600); L.jet(66, 4, 3000, 800); L.jet(72, 4, 3000, 2200);
    L.pix(44, 13); L.pix(51, 13); L.pix(57, 13); L.pix(63, 13); L.pix(69, 13); L.pix(76, 13);
    L.plat(84, 12, 3); L.pix(85, 11);
    L.check(88);
    // 3. La galerie : des dalles de verre et un chariot au-dessus du canal
    L.pond(95, 127, 15);
    L.glass(96, 14, 3); L.glass(101, 13, 3); L.glass(106, 14, 3);
    L.mover(111, 12, 3, 5, 0, 3600);
    L.glass(118, 13, 3); L.glass(123, 14, 3);
    L.pix(97, 13); L.pix(102, 12); L.pix(107, 13); L.pix(119, 12); L.pix(124, 13);
    // 4. La soufflerie du dôme : des courants d'air qui allègent la gravité
    L.ground(127, 22, 3);
    L.check(129);
    L.hint(131, "MONTE LA TOUR : LE COURANT D'AIR T'ALLÈGE");
    L.deco(147, 'lv_tour_lu', { depth: 1 });                       // la vraie tour : on la grimpe, du courant d'air jusqu'au belvédère
    L.deco(129, 'lv_feu', { depth: 3 }); L.deco(138, 'lv_pan_sens', { depth: 3 });
    L.draft(141, 146, 1, 14);
    L.plat(146, 8, 4);
    L.draft(147, 152, 1, 8);
    L.plat(152, 3, 4);
    L.pix(133, 13); L.pix(137, 13); L.pix(143, 9); L.pix(148, 7); L.pix(150, 3); L.pix(154, 2);
    // 5. La terrasse du sommet : un dernier jet, un dernier tapis
    L.ground(156, 10, 14);                                          // le belvédère, puis la descente par les paliers de l'escalier de la tour
    L.check(158);
    L.ground(166, 5, 12); L.ground(171, 5, 10); L.ground(176, 5, 8); L.ground(181, 5, 6); L.ground(186, 6, 4); L.ground(192, 8, 3);
    [[156, 10, 3], [166, 5, 5], [171, 5, 7], [176, 5, 9], [181, 5, 11], [186, 6, 13], [192, 8, 14]].forEach(function (b) { L.deco(b[0], 'lv_tcorps_' + b[1] + '_' + (16 - b[2]), { dx: (b[1] - 1) * 8, dy: 271 - b[2] * 16, depth: 5 }); });   // la tour habille ses paliers (briques, fenêtres)
    L.jet(168, 4, 3200, 0); L.jet(178, 4, 3200, 1600);
    L.deco(184, 'lv_abribus', { depth: 3 }); L.deco(195, 'lv_pan_stop', { depth: 3 });
    L.pix(162, 2); L.pix(168, 4); L.pix(173, 6); L.pix(178, 8); L.pix(183, 10); L.pix(188, 12); L.pix(196, 12);
    L.hint(160, "LE BELVÉDÈRE : DESCENDS PAR L'ESCALIER DE LA TOUR");
  });
  L.id = 'tour-lu';
  L.backdrop = { x: 28, key: 'lv_tour_lu', scale: 1, tint: false };   // la tour se dresse derrière le quai de départ
  L.maxTime = 240;
  L.reveal = 'topDown';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['lv_bit_h1', 'lv_bit_h2', 'lv_bit_h1'], fill: 'lv_bit_plein', left: 'lv_bit_g', right: 'lv_bit_d', block: 'lv_bit_plein',       // bitume de la rue
    ledge: ['lv_pb_g', 'lv_pb_m', 'lv_pb_d'], mover: ['lv_pb_g', 'lv_pb_m', 'lv_pb_d']       // des petits-beurres
  };
  L.sky = { farKey: 'lv_fond_quartier', farBottom: 236 };        // le quartier : immeubles et arbres d'alignement
  L.wxm = { rain: { jet: 0.8 }, sun: { jet: 1.2 }, wind: { spring: 1.1 } };
  L.weatherText = { rain: 'LA PLUIE REFROIDIT LA VAPEUR : JETS PLUS COURTS', sun: 'LA CHALEUR ALLONGE LES JETS DE VAPEUR', wind: 'LE VENT GONFLE LE PARASOL : REBOND PLUS HAUT' };
  return L;
})();
