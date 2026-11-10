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
  var L = GP.LevelBuilder.create(132, function (L) {
    // 1. La place et ses terrasses : une Muse lance des notes, un premier parasol
    L.ground(0, 34, 3);
    L.start(2);
    L.hint(3, 'LES MUSES LANCENT DES NOTES : ACCROUPIS-TOI OU SAUTE');
    L.deco(5, 'graslin_table_cafe', { depth: 4 }); L.deco(9, 'graslin_lampadaire_ornemente', { depth: 3 }); L.deco(29, 'graslin_table_cafe', { depth: 4 });
    L.muse(16, -1, 2800, 0);                           // une Muse de la place lance ses notes vers toi
    L.pix(6, 13); L.pix(13, 11); L.pix(17, 13);
    L.hint(20, 'LE PARASOL FAIT REBONDIR : SAUTE DESSUS');
    L.spring(22); L.plat(25, 10, 4); L.pix(26, 9); L.pix(27, 9);
    L.check(31);
    // 2. Le perron : trois marches, trois Muses
    L.ground(34, 8, 3); L.ground(42, 8, 4); L.ground(50, 8, 5);
    L.muse(41, -1, 2500, 0); L.muse(49, -1, 2500, 900); L.muse(57, -1, 2500, 1700);
    L.pix(38, 13); L.pix(46, 12); L.pix(54, 11); L.pix(44, 10); L.pix(52, 9);
    // 3. Le portique : un parasol vers la corniche, puis les projecteurs balaient la nef
    L.ground(58, 72, 6);
    L.check(59);
    L.hint(61, 'LE PARASOL TE PROJETTE SUR LA CORNICHE');
    L.spring(64); L.plat(66, 7, 4); L.pix(67, 6); L.pix(68, 6);
    L.deco(72, 'graslin_colonne_corinthienne', { depth: 2 }); L.deco(88, 'graslin_colonne_corinthienne', { depth: 2 }); L.deco(104, 'graslin_colonne_corinthienne', { depth: 2 });
    L.hint(73, "LES PROJECTEURS BALAIENT : PASSE QUAND ILS S'ÉLOIGNENT");
    L.beam(77, 89, 0.45); L.beam(91, 103, 0.55);
    L.pix(78, 10); L.pix(82, 10); L.pix(86, 10); L.pix(93, 10); L.pix(97, 10); L.pix(100, 8);
    L.check(105);
    // 4. Le rideau : rejouer la séquence pour entrer sur scène, dernière Muse
    L.hint(107, 'REJOUE LA SÉQUENCE : < > V');
    L.seq(111, 'LRD');
    L.deco(122, 'graslin_muse_statue', { depth: 3 });
    L.muse(125, -1, 2300, 0);
    L.pix(113, 10); L.pix(117, 10); L.plat(118, 8, 3); L.pix(119, 7); L.pix(122, 10); L.pix(127, 10);
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
  L.backdrop = { x: 120, key: 'graslin_theatre_facade', scale: 1, tint: false };
  L.wxm = { rain: { note: 0.75 }, sun: { beam: 1.25 }, wind: { spring: 1.1 } };
  L.weatherText = { rain: 'LA PLUIE ÉTOUFFE LES NOTES : PLUS LENTES', sun: 'LES PROJECTEURS BALAIENT PLUS VITE', wind: 'LE VENT GONFLE LES PARASOLS : REBOND PLUS HAUT' };
  return L;
})();

/** NIVEAU 6 — MACHINES DE L'ÎLE : tapis et rails qui entraînent, jets de vapeur à contretemps, petits robots qui poursuivent. */
GP.LEVELS['machines'] = (function () {
  var L = GP.LevelBuilder.create(158, function (L) {
    // 1. Le parvis : les rails t'entraînent vers l'avant
    L.ground(0, 30, 3);
    L.start(2);
    L.hint(3, "LES RAILS T'ENTRAÎNENT VERS LA DROITE");
    L.deco(5, 'machines_charpente_module', { depth: 1 });
    L.deco(11, 'lv_carrousel', { depth: 2.5 });                  // le Carrousel des Mondes Marins
    L.belt(0, 30, 1, 45);
    L.pix(10, 13); L.pix(14, 13); L.pix(18, 13);
    L.thorn(26, 1); L.pix(26, 11);
    L.check(28);
    // 2. La galerie de vapeur : le souffle prévient, puis le jet monte
    L.ground(30, 32, 3);
    L.hint(32, 'LE SOUFFLE PRÉVIENT : ATTENDS, PUIS COURS');
    L.belt(30, 62, -1, 30);                           // un léger recul pendant qu'on attend le souffle
    L.jet(36, 4, 3200, 0); L.jet(43, 4, 3200, 1600); L.jet(51, 4, 3000, 800); L.jet(57, 4, 3000, 2200);
    L.deco(47, 'lv_arbre_herons', { depth: 2.5 });               // l'Arbre aux Hérons
    L.pix(34, 13); L.pix(40, 13); L.pix(47, 13); L.pix(54, 13); L.pix(60, 13);
    L.check(47);
    // 3. L'horlogerie : rails à contre-sens, des robots te poursuivent
    L.ground(62, 38, 3);
    L.hint(64, "LES ARAIGNÉES AVANCENT SI TU NE LES REGARDES PAS");
    L.deco(90, 'lv_gardienne', { depth: 2.5 });                  // la Gardienne des Ténèbres (l'araignée)
    L.belt(62, 80, -1, 50); L.belt(80, 100, 1, 60);
    L.patrol(66, 76, 'araignee', 40); L.patrol(82, 96, 'araignee', 44);
    L.plat(70, 12, 3); L.pix(71, 11); L.plat(86, 12, 3); L.pix(87, 11);
    L.thorn(78, 1); L.pix(78, 11); L.thorn(94, 1); L.pix(94, 11);
    L.pix(68, 13); L.pix(84, 13);
    L.check(79);
    // 4. La passerelle : jets sous les coursives
    L.ground(100, 22, 3);
    L.belt(100, 122, 1, 40);
    L.plat(104, 12, 3); L.pix(105, 11); L.plat(110, 11, 3); L.pix(111, 10); L.plat(116, 12, 3); L.pix(117, 11);
    L.jet(108, 4, 3000, 0); L.jet(114, 4, 3000, 1500);
    L.check(101);
    // 5. L'esplanade : le Grand Éléphant traverse le canal, on grimpe sur son dos (croupe, dos, toit, oreille, défenses)
    L.ground(122, 10, 3);
    L.belt(122, 132, -1, 35);
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
  L.maxTime = 200;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['machines_sol_haut_1', 'machines_sol_haut_2'], fill: 'machines_sol_plein', left: 'machines_sol_gauche', right: 'machines_sol_droite', block: 'machines_sol_plein',
    ledge: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d'], mover: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d']
  };
  L.thornKey = 'lv_toile'; L.thornText = 'COLLÉ DANS UNE TOILE D\'ARAIGNÉE !';      // des toiles d'araignée au sol
  L.sky = { farKey: 'machines_fond_tile_x', farBottom: 236 };
  L.wxm = { rain: { jet: 0.75 }, sun: { enemy: 1.25 }, wind: { belt: 1.3 } };
  L.weatherText = { rain: 'LA PLUIE REFROIDIT LES JETS : PLUS COURTS', sun: 'LE SOLEIL SURCHAUFFE LES ARAIGNÉES : PLUS RAPIDES', wind: 'LE VENT RELANCE LES TAPIS : PLUS VIFS' };
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
    L.hint(102, 'MONTE SUR LES CHARIOTS : ILS AVANCENT');
    L.cart(106, 12, 3, 6); L.cart(114, 11, 3, 6); L.cart(122, 12, 3, 6);
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
  L.sky = { farKey: 'chantiers_fond_tile_x', farBottom: 236 };
  L.wxm = { rain: { belt: 1.3 }, sun: { mover: 1.3 }, wind: { fall: 0.8 } };
  L.weatherText = { rain: 'LA PLUIE LUBRIFIE LA CALE : PENTE PLUS VIVE', sun: 'LE SOLEIL DILATE LES RAILS : CHARIOTS PLUS RAPIDES', wind: 'LE VENT AGITE LA GRUE : CONTENEURS PLUS VITE' };
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
    // 1. La terrasse de bois : apprendre à récolter au bon moment
    L.ground(0, 32, 3);
    L.start(2);
    L.hint(3, 'RÉCOLTE LES PIXELS QUAND ILS SONT JAUNES !');
    L.deco(6, 'hangar_palettes_caisses', { depth: 4 }); L.deco(14, 'hangar_grue_quai', { depth: 1 }); L.deco(24, 'hangar_conteneur_bleu', { depth: 3 });
    L.deco(14, 'hangar_guirlande_lumineuse', { depth: 2, dy: -38 });   // accrochée au sommet de la grue de quai
    L.pix(7, 13); L.pix(10, 13); L.pix(13, 13); L.pix(16, 13);
    L.plat(19, 12, 3); L.pix(20, 11);
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
    L.ground(100, 40, 3);
    L.check(101);
    L.plat(104, 12, 3); L.pix(105, 11); L.plat(109, 10, 3); L.pix(110, 9); L.plat(114, 8, 3); L.pix(115, 7);
    L.thorn(118, 2); L.pix(119, 11);
    // 5. La mûrisserie : un grand tas de pixels, tous à des moments différents
    L.deco(132, 'hangar_conteneur_bleu', { depth: 3 });
    L.pix(122, 13); L.pix(124, 13); L.pix(127, 13); L.pix(129, 13); L.pix(124, 11); L.pix(128, 11);
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
  L.sky = { farKey: 'hangar_fond_tile_x', farBottom: 236 };
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
    L.hint(12, 'LA STÈLE GARDE UNE SÉQUENCE : RETIENS-LA');
    L.memo(15, 24, 'DJD');
    L.check(27);
    L.pix(29, 13);
    // 2. La descente vers le passage bas : une deuxième séquence, puis des dalles de verre au-dessus de l'eau
    L.ground(36, 6, 3);
    L.check(38);
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
    L.memo(114, 126, 'DJJDJ');
    L.pix(118, 13); L.pix(124, 13);
    L.check(129);
    L.pond(132, 147, 15);
    L.glass(133, 14, 3); L.glass(138, 13, 3); L.glass(143, 14, 3);
    L.pix(134, 13); L.pix(139, 12); L.pix(144, 13);
    // 5. La remontée vers la lumière
    L.ground(147, 6, 3); L.ground(153, 6, 4); L.ground(159, 6, 5); L.ground(165, 11, 6);
    L.check(148);
    L.pix(150, 13); L.pix(155, 12); L.pix(161, 11); L.pix(168, 10); L.pix(172, 10);
    L.hint(166, 'LIBERTÉ');
  });
  L.id = 'memorial';
  L.maxTime = 210;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['memorial_sol_haut_1', 'memorial_sol_haut_2'], fill: 'memorial_sol_plein', left: 'memorial_sol_gauche', right: 'memorial_sol_droite', block: 'memorial_sol_plein',
    ledge: ['memorial_passerelle_metal_g', 'memorial_passerelle_metal_m', 'memorial_passerelle_metal_d'], mover: ['memorial_passerelle_metal_g', 'memorial_passerelle_metal_m', 'memorial_passerelle_metal_d']
  };
  L.sky = { farKey: 'memorial_fond_tile_x', farBottom: 236 };
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
    L.hint(3, "LE VERRE SE FISSURE : NE T'ARRÊTE PAS");
    L.deco(6, 'pommeraye_devanture_a', { depth: 1 }); L.deco(14, 'pommeraye_devanture_b', { depth: 1 }); L.deco(24, 'pommeraye_devanture_a', { depth: 1 }); L.deco(36, 'pommeraye_devanture_b', { depth: 1 });
    L.deco(10, 'pommeraye_pilier_galerie', { depth: 2 }); L.deco(30, 'pommeraye_pilier_galerie', { depth: 2 });
    L.pix(7, 13); L.pix(8, 13);
    L.glass(14, 12, 3); L.pix(15, 11);
    L.glass(20, 11, 3); L.pix(21, 10);
    L.thorn(27, 2); L.pix(27, 11); L.pix(28, 11);
    L.check(32);
    // 2. Le grand escalier : quatre volées, des statues, un lustre qui balance
    L.ground(40, 8, 4); L.ground(48, 8, 5); L.ground(56, 8, 6); L.ground(64, 8, 7);
    L.hint(41, 'LES LUSTRES BALANCENT : MONTE DESSUS');
    L.deco(52, 'pommeraye_statue', { depth: 3 }); L.deco(60, 'pommeraye_statue', { depth: 3 });
    L.mover(44, 10, 3, 4, 0, 3400);
    L.pix(42, 12); L.pix(50, 11); L.pix(58, 10); L.pix(66, 9); L.pix(46, 9);
    L.plat(58, 8, 3); L.pix(59, 7);
    L.check(49); L.check(56);
    // 3. La mezzanine : des ponts de verre au-dessus du vide, des balcons en fonte
    L.ground(64, 22, 7);
    L.deco(70, 'pommeraye_pilier_galerie', { depth: 2 }); L.deco(80, 'pommeraye_lustre', { depth: 3, dy: -64 });
    L.pix(74, 9); L.pix(80, 9);
    L.glass(87, 10, 3); L.glass(92, 10, 3);
    L.pix(88, 9); L.pix(93, 9);
    L.ground(96, 36, 7);
    L.check(98);
    L.plat(104, 8, 3); L.pix(105, 7);
    L.mover(112, 7, 3, 5, 0, 3600); L.pix(114, 6);
    L.pix(100, 9); L.pix(110, 9); L.pix(124, 9);
    // 4. Sous la verrière : on monte tout en haut, puis un dernier pont de verre
    L.ground(132, 6, 8); L.ground(138, 6, 9); L.ground(144, 6, 10); L.ground(150, 6, 11);
    L.check(134);
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
  L.sky = { farKey: 'lv_fond_pommeraye', farBottom: 236 };        // galerie à trois niveaux et verrière, dessinée d'après des vues du passage
  L.wxm = { rain: { glass: 0.7 }, sun: { glassback: 0.6 } };
  L.weatherText = { rain: 'LA PLUIE FRAGILISE LE VERRE : IL CÈDE PLUS VITE', sun: 'LE SOLEIL RÉCHAUFFE LE VERRE : IL REVIENT VITE', wind: 'LE VENT SOUFFLE DANS LA VERRIÈRE' };
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
    L.hint(131, "LE COURANT D'AIR T'ALLÈGE : SAUTE DEDANS"); L.deco(129, 'lv_feu', { depth: 3 }); L.deco(138, 'lv_pan_sens', { depth: 3 });
    L.draft(141, 146, 1, 14);
    L.plat(146, 8, 4);
    L.draft(147, 152, 1, 8);
    L.plat(152, 3, 4);
    L.pix(133, 13); L.pix(137, 13); L.pix(143, 9); L.pix(148, 7); L.pix(150, 3); L.pix(154, 2);
    // 5. La terrasse du sommet : un dernier jet, un dernier tapis
    L.ground(156, 44, 14);
    L.check(158);
    L.jet(166, 4, 3200, 0); L.jet(172, 4, 3200, 1600);
    L.deco(188, 'lv_pan_stop', { depth: 3 }); L.deco(184, 'lv_abribus', { depth: 3 });
    L.pix(162, 2); L.pix(169, 2); L.pix(176, 2); L.pix(182, 2); L.pix(190, 2);
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
