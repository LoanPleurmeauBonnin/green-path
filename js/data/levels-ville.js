/**
 * Niveaux de la ville : Île Feydeau, Place Graslin, Machines de l'île, Parc des Chantiers, Anneaux de Buren, Hangar à Bananes.
 * Même constructeur que js/data/levels.js (L.ground, L.plat, L.pix…), plus les briques de js/systems/Dangers.js :
 *   L.patrol(x0, x1, 'esprit' | 'robot' | 'danseur', vitesse)   L.tide(x0, x1, ligne basse, ligne haute, période)   L.boat(x, y, w)
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
  L.sky = { farKey: 'feydeau_fond_tile_x', farBottom: 236 };
  L.wxm = { rain: { tide: 1 }, sun: { tide: -1 }, wind: { boat: 1.5 } };
  L.weatherText = { rain: 'LA MARÉE MONTE PLUS HAUT', sun: 'LA MARÉE RESTE BASSE', wind: 'LA LOIRE EST AGITÉE : LES BATEAUX COULENT VITE' };
  return L;
})();

/** NIVEAU 5 — PLACE GRASLIN : danseurs masqués qui barrent la place, parasols qui font rebondir, projecteurs, rideau à ouvrir. */
GP.LEVELS['graslin'] = (function () {
  var L = GP.LevelBuilder.create(132, function (L) {
    // 1. La place et ses terrasses : un danseur masqué, un premier parasol
    L.ground(0, 34, 3);
    L.start(2);
    L.hint(3, 'UN DANSEUR MASQUÉ BARRE LA PLACE : SAUTE-LE');
    L.deco(5, 'graslin_table_cafe', { depth: 4 }); L.deco(9, 'graslin_lampadaire_ornemente', { depth: 3 }); L.deco(29, 'graslin_table_cafe', { depth: 4 });
    L.patrol(8, 18, 'danseur', 38);
    L.pix(6, 13); L.pix(13, 11); L.pix(17, 13);
    L.hint(20, 'LE PARASOL FAIT REBONDIR : SAUTE DESSUS');
    L.spring(22); L.plat(25, 10, 4); L.pix(26, 9); L.pix(27, 9);
    L.check(31);
    // 2. Le perron : trois marches, trois danseurs
    L.ground(34, 8, 3); L.ground(42, 8, 4); L.ground(50, 8, 5);
    L.patrol(35, 41, 'danseur', 34); L.patrol(43, 49, 'danseur', 40); L.patrol(51, 57, 'danseur', 36);
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
    // 4. Le rideau : rejouer la séquence pour entrer sur scène, dernier danseur
    L.hint(107, 'REJOUE LA SÉQUENCE : < > V');
    L.seq(111, 'LRD');
    L.deco(122, 'graslin_muse_statue', { depth: 3 });
    L.patrol(114, 125, 'danseur', 44);
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
  L.sky = { farKey: 'graslin_fond_tile_x', farBottom: 236 };
  L.backdrop = { x: 120, key: 'graslin_theatre_facade', scale: 1, tint: false };
  L.wxm = { rain: { enemy: 0.75 }, sun: { beam: 1.25 }, wind: { spring: 1.1 } };
  L.weatherText = { rain: 'LES DANSEURS GLISSENT : PLUS LENTS', sun: 'LES PROJECTEURS BALAIENT PLUS VITE', wind: 'LE VENT GONFLE LES PARASOLS : REBOND PLUS HAUT' };
  return L;
})();

/** NIVEAU 6 — MACHINES DE L'ÎLE : tapis et rails qui entraînent, jets de vapeur à contretemps, petits robots qui poursuivent. */
GP.LEVELS['machines'] = (function () {
  var L = GP.LevelBuilder.create(142, function (L) {
    // 1. Le parvis : les rails t'entraînent vers l'avant
    L.ground(0, 30, 3);
    L.start(2);
    L.hint(3, "LES RAILS T'ENTRAÎNENT VERS LA DROITE");
    L.deco(5, 'machines_charpente_module', { depth: 1 }); L.deco(16, 'machines_engrenage_grand', { depth: 3 });
    L.belt(8, 20, 1, 50);
    L.pix(10, 13); L.pix(14, 13); L.pix(18, 13);
    L.thorn(26, 1); L.pix(26, 11);
    L.check(28);
    // 2. La galerie de vapeur : le souffle prévient, puis le jet monte
    L.ground(30, 32, 3);
    L.hint(32, 'LE SOUFFLE PRÉVIENT : ATTENDS, PUIS COURS');
    L.jet(36, 4, 3200, 0); L.jet(43, 4, 3200, 1600); L.jet(51, 4, 3000, 800); L.jet(57, 4, 3000, 2200);
    L.deco(40, 'machines_tuyau_cuivre', { depth: 3 }); L.deco(54, 'machines_tuyau_cuivre', { depth: 3 });
    L.pix(34, 13); L.pix(40, 13); L.pix(47, 13); L.pix(54, 13); L.pix(60, 13);
    L.check(47);
    // 3. L'horlogerie : rails à contre-sens, des robots te poursuivent
    L.ground(62, 38, 3);
    L.hint(64, 'LES ROBOTS TE POURSUIVENT : SAUTE-LES');
    L.belt(64, 76, -1, 50); L.belt(80, 92, 1, 60);
    L.patrol(66, 76, 'robot', 40); L.patrol(82, 96, 'robot', 44);
    L.plat(70, 12, 3); L.pix(71, 11); L.plat(86, 12, 3); L.pix(87, 11);
    L.thorn(78, 1); L.pix(78, 11); L.thorn(94, 1); L.pix(94, 11);
    L.pix(68, 13); L.pix(84, 13);
    L.check(79);
    // 4. La passerelle : jets sous les coursives
    L.ground(100, 22, 3);
    L.plat(104, 12, 3); L.pix(105, 11); L.plat(110, 11, 3); L.pix(111, 10); L.plat(116, 12, 3); L.pix(117, 11);
    L.jet(108, 4, 3000, 0); L.jet(114, 4, 3000, 1500);
    L.check(101);
    // 5. L'esplanade du Grand Éléphant : les jets de sa trompe, un dernier robot
    L.ground(122, 20, 3);
    L.deco(136, 'machines_animal_mecanique', { depth: 3 });
    L.jet(128, 4, 3600, 0); L.jet(131, 4, 3600, 1800);
    L.patrol(123, 127, 'robot', 36);
    L.pix(124, 13); L.pix(126, 11); L.pix(134, 13); L.pix(138, 13); L.pix(139, 11);
    L.check(122);
  });
  L.id = 'machines';
  L.maxTime = 200;
  L.reveal = 'bottomUp';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['machines_sol_haut_1', 'machines_sol_haut_2'], fill: 'machines_sol_plein', left: 'machines_sol_gauche', right: 'machines_sol_droite', block: 'machines_sol_plein',
    ledge: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d'], mover: ['machines_passerelle_acier_g', 'machines_passerelle_acier_m', 'machines_passerelle_acier_d']
  };
  L.thornKey = 'machines_obstacle_engrenage_dents'; L.thornText = 'AÏE, LES DENTS DU ROUAGE !';
  L.sky = { farKey: 'machines_fond_tile_x', farBottom: 236 };
  L.wxm = { rain: { jet: 0.75 }, sun: { enemy: 1.25 }, wind: { belt: 1.3 } };
  L.weatherText = { rain: 'LA PLUIE REFROIDIT LES JETS : PLUS COURTS', sun: 'LE SOLEIL SURCHAUFFE LES ROBOTS : PLUS RAPIDES', wind: 'LE VENT RELANCE LES TAPIS : PLUS VIFS' };
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

/** NIVEAU 8 — ANNEAUX DE BUREN : anneaux d'élan (rouge : en avant, bleu : en haut), chaque passage change la couleur ; les aligner fait apparaître le paysage. */
GP.LEVELS['buren'] = (function () {
  var L = GP.LevelBuilder.create(150, function (L) {
    // 1. Le quai des Antilles : premier anneau rouge au-dessus de l'eau
    L.ground(0, 18, 3);
    L.start(2);
    L.hint(3, "SAUTE DANS L'ANNEAU ROUGE : ÉLAN VERS L'AVANT");
    L.deco(6, 'buren_banc_quai', { depth: 4 }); L.deco(10, 'buren_garde_corps_quai', { depth: 4 });
    L.pix(7, 13); L.pix(12, 13);
    L.pond(18, 27, 15);
    L.ring(20, 10, 'red');
    // 2. L'anneau bleu : une impulsion vers le haut pour atteindre une passerelle
    L.ground(27, 48, 3);
    L.check(28);
    L.pix(31, 13); L.pix(35, 13);
    L.hint(34, 'ANNEAU BLEU : IMPULSION VERS LE HAUT');
    L.ring(38, 9, 'blue'); L.plat(40, 8, 4); L.pix(41, 7); L.pix(42, 7);
    L.pix(46, 13); L.pix(50, 13);
    L.check(48);
    // 3. L'alignement : trois anneaux de même couleur, et le paysage apparaît
    L.hint(52, 'ALIGNE LES ANNEAUX (MÊME COULEUR) : UN PONT APPARAÎT');
    var a = L.ring(58, 9, 'red'), b = L.ring(62, 9, 'blue'), c = L.ring(66, 9, 'red');
    L.align([a, b, c], 75, 14, 13);
    L.pond(75, 88, 15);
    L.pix(60, 13); L.pix(64, 13); L.pix(70, 13);
    L.pix(80, 13); L.pix(85, 13);
    // 4. La chaîne d'anneaux au-dessus de la Loire
    L.ground(88, 20, 3);
    L.check(89);
    L.hint(94, 'ENCHAÎNE LES ANNEAUX ROUGES SANS TOUCHER TERRE');
    L.pix(92, 13); L.pix(100, 13);
    L.pond(108, 124, 15);
    L.ring(111, 10, 'red'); L.ring(116, 11, 'red'); L.ring(121, 12, 'red');
    L.pix(111, 10); L.pix(116, 11); L.pix(121, 12);
    // 5. Le grand envol final
    L.ground(124, 26, 3);
    L.check(125);
    L.deco(132, 'buren_borne', { depth: 4 }); L.deco(140, 'buren_banc_quai', { depth: 4 });
    L.pix(127, 13); L.pix(131, 13); L.pix(135, 13); L.pix(139, 13); L.pix(144, 13);
  });
  L.id = 'buren';
  L.reveal = 'topDown';
  L.abilities = { crouch: true, grab: true };
  L.skin = {
    top: ['buren_sol_haut_1', 'buren_sol_haut_2'], fill: 'buren_sol_plein', left: 'buren_sol_gauche', right: 'buren_sol_droite', block: 'buren_sol_plein',
    ledge: ['buren_passerelle_inox_g', 'buren_passerelle_inox_m', 'buren_passerelle_inox_d'], bridge: ['buren_passerelle_inox_g', 'buren_passerelle_inox_m', 'buren_passerelle_inox_d']
  };
  L.thornKey = 'buren_obstacle_bornes_pointes'; L.thornText = 'AÏE, LES BORNES À POINTES !';
  L.sky = { farKey: 'buren_fond_tile_x', farBottom: 236 };
  L.wxm = { rain: { ring: 0.92 }, sun: { ring: 1.08 } };
  L.weatherText = { rain: "L'INOX EST MOUILLÉ : ÉLAN RÉDUIT", sun: "LE SOLEIL CHAUFFE L'INOX : ÉLAN PLUS FORT", wind: 'LE VENT SOUFFLE SUR LA LOIRE' };
  return L;
})();

/** NIVEAU 9 — HANGAR À BANANES : la pourriture. Chaque pixel mûrit : vert, puis jaune (récoltable), puis brun, puis il s'efface avant de repousser. */
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
    L.thorn(68, 3); L.pix(69, 11); L.thorn(76, 2); L.pix(76, 11); L.thorn(84, 3); L.pix(85, 11); L.thorn(92, 2); L.pix(92, 11);
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
  L.wxm = { sun: { rot: 1.3 }, rain: { rot: 0.8 } };
  L.weatherText = { sun: 'LA CHALEUR FAIT POURRIR PLUS VITE', rain: "L'HUMIDITÉ RALENTIT LA POURRITURE" };
  return L;
})();
