/**
 * Les 12 étapes de Green Path — SOURCE UNIQUE de données.
 * Ajouter / modifier un lieu = éditer ce fichier (le moteur n'a pas à changer).
 *
 * L'ordre suit la séquence de la page « Arpenter la ligne verte » du Voyage à Nantes pour les lieux qui y figurent
 * (Jardin des Plantes, Cathédrale, Château, Machines, Chantiers, Buren, Mémorial, Pommeraye), complétée pour les autres.
 * Cette page ne donne pas de numérotation : ce n'est PAS la numérotation officielle de la ligne verte.
 * Le niveau « bouffay » (js/data/levels.js) est conservé mais n'est plus rattaché à un lieu.
 *
 * Champs :
 *  id, name        identifiant et nom affiché
 *  sprite          monument de la carte (planches de sprites) ; vide = monument dessiné par code (MapArt)
 *  playable        true = niveau jouable dans la version courante
 *  level           (Phase 2+) identifiant de la description de niveau
 *  parTime         temps cible en secondes pour la 3e étoile (valeurs PROVISOIRES, à régler au playtest)
 *  notice          texte patrimonial court (fiche avant réussite, écran de résultat)
 *  summary         (facultatif) texte complet du lieu, en paragraphes, lu après réussite (FICHE DU LIEU)
 * La position sur la carte est calculée (GP.MapArt.nodeX : une étape tous les 190 px).
 *  element         élément patrimonial à reconstruire { label, verify }
 *  verify          true = notice à recouper avec Nantes Patrimonia
 *
 * Les notices sont des BROUILLONS rédigés de mémoire : tout ce qui est marqué
 * « verify » doit être confirmé avant publication.
 */
GP.LOCATIONS = [
  {
    id: 'jardin-des-plantes', name: 'Jardin des Plantes',
    sprite: 'jardin_monument_jardin',
    playable: true, level: 'jardin-des-plantes', parTime: 90,
    notice: "Jardin botanique de Nantes, face à la gare. Serres, camélias et grands arbres en font un havre de verdure en plein centre-ville. Premier pas de la ligne verte.",
    summary: [
      "Le Jardin des Plantes est le jardin botanique de Nantes. Il s'ouvre juste en face de la gare : on y passe en quelques pas du parvis, de ses arrêts de tram et de ses façades de verre, à l'ombre des grands arbres.",
      "Ses serres abritent des plantes venues de climats plus chauds. La plus imposante, le Palmarium, est une grande serre de métal et de verre coiffée de dômes ; ses stores se baissent pour protéger les plantes du soleil. C'est elle que le niveau reconstruit, pixel après pixel, du sol vers le ciel, comme une plante qui pousse.",
      "Dans les allées : un bassin et son jet d'eau, des massifs de fleurs renouvelés au fil des saisons, des pelouses, et des œuvres contemporaines installées dans le jardin, dont de grandes topiaires et un personnage en bois.",
      "Premier pas de la ligne verte, le jardin est une respiration en plein centre-ville."
    ],
    element: { label: 'Palmarium (serre)', verify: true }, verify: true
  },
  {
    id: 'cathedrale', name: 'Cathédrale Saint-Pierre-et-Saint-Paul',
    sprite: 'cathedrale_monument_cathedrale',
    playable: true, level: 'cathedrale', parTime: 110,
    notice: "Édifice gothique dont la construction débute en 1434 et s'achève au XIXe siècle. Elle abrite le tombeau de François II. Sa nef de pierre blanche est très haute.",
    element: { label: 'Façade et deux tours', verify: false }, verify: false
  },
  {
    id: 'chateau', name: 'Château des ducs de Bretagne',
    sprite: 'chateau_monument_chateau',
    playable: true, level: 'chateau', parTime: 100,
    notice: "Forteresse des ducs de Bretagne, reconstruite à la fin du XVe siècle par François II puis Anne de Bretagne. Ses remparts de tuffeau abritent aujourd'hui le musée d'histoire de Nantes.",
    element: { label: 'Remparts et tours', verify: false }, verify: false
  },
  {
    id: 'feydeau', name: 'Île Feydeau',
    sprite: 'feydeau_monument_feydeau',
    playable: true, level: 'feydeau', parTime: 120,
    notice: "Ancienne île de la Loire, rattachée à la ville au XXe siècle. Ses hôtels d'armateurs du XVIIIe siècle, aux façades ornées de mascarons, se penchent légèrement.",
    element: { label: 'Façades des hôtels d\'armateurs', verify: false }, verify: false
  },
  {
    id: 'graslin', name: 'Place Graslin',
    sprite: 'graslin_monument_graslin',
    playable: true, level: 'graslin', parTime: 120,
    notice: "Place dominée par le Grand Théâtre, de style néoclassique, achevé en 1788. Sa façade à colonnes corinthiennes est couronnée de statues de muses.",
    element: { label: 'Façade du Grand Théâtre', verify: false }, verify: false
  },
  {
    id: 'machines', name: "Machines de l'île",
    sprite: 'machines_monument_machines',
    playable: true, level: 'machines', parTime: 120,
    notice: "Atelier-spectacle installé dans les anciens chantiers navals. Le Grand Éléphant, géant mécanique de bois et d'acier, promène les visiteurs sur l'île.",
    element: { label: 'Grand Éléphant', verify: false }, verify: false
  },
  {
    id: 'chantiers', name: 'Parc des Chantiers',
    sprite: 'chantiers_monument_chantiers',
    playable: true, level: 'chantiers', parTime: 130,
    notice: "Parc aménagé sur l'ancien site des chantiers navals, au cœur de l'île de Nantes. Grues et vestiges industriels dialoguent avec les jardins.",
    element: { label: 'Grue jaune des chantiers', verify: true }, verify: true
  },
  {
    id: 'buren', name: 'Anneaux de Buren',
    sprite: 'buren_monument_buren',
    playable: true, level: 'buren', parTime: 110,
    notice: "Installation d'art public de Daniel Buren sur le quai des Antilles, composée d'anneaux lumineux qui scandent la rive de la Loire.",
    element: { label: 'Les anneaux', verify: true }, verify: true
  },
  {
    id: 'hangar', name: 'Hangar à Bananes',
    sprite: 'hangar_monument_hangar',
    playable: true, level: 'hangar', parTime: 140,
    notice: "Ancien entrepôt portuaire où transitaient les bananes venues des Antilles, reconverti en lieu de restaurants, de culture et de loisirs au bord de la Loire.",
    element: { label: 'Le hangar du quai', verify: true }, verify: true
  },
  {
    id: 'memorial', name: "Mémorial de l'abolition de l'esclavage",
    sprite: 'memorial_monument_memorial',
    playable: false,
    notice: "Mémorial au bord de la Loire rappelant le rôle de Nantes dans la traite négrière et l'histoire de son abolition. Il mêle quai, verre et textes gravés.",
    element: { label: 'Plaques de verre du quai', verify: true }, verify: true
  },
  {
    id: 'pommeraye', name: 'Passage Pommeraye',
    sprite: 'pommeraye_monument_pommeraye',
    playable: false,
    notice: "Galerie commerçante ouverte en 1843, sur trois niveaux reliés par un escalier monumental. Verrière, statues et décors en font un passage couvert célèbre.",
    element: { label: 'Verrière et escalier', verify: false }, verify: false
  },
  {
    id: 'tour-lu', name: 'Tour LU',
    sprite: '',
    playable: false,
    notice: "Tour de l'ancienne biscuiterie LU, face au château. Avec sa coupole, elle signalait l'usine au bord de l'eau ; le bâtiment accueille aujourd'hui une scène culturelle, le Lieu Unique.",
    element: { label: 'La tour et sa coupole', verify: true }, verify: true
  }
];

/** Index du dernier niveau jouable (les suivants sont « À VENIR »). */
GP.LAST_PLAYABLE = (function () {
  var last = 0;
  GP.LOCATIONS.forEach(function (l, i) { if (l.playable) last = i; });
  return last;
})();
