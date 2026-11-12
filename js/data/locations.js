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
 *  anecdote        (facultatif) petit personnage de la carte : { who, text, source, look } (look = options du créateur d'avatar + `acc`, accessoire dessiné par-dessus, voir MapScene.personKey) ; `panneau` { who, text, source } pour le Mémorial (sources : docs/sources.md)
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
    playable: true, level: 'jardin-des-plantes', parTime: GP.Tuning.parTimes['jardin-des-plantes'],
    grammar: "VARIATION VÉGÉTALE : la photo se révèle du sol vers le ciel, au centre puis sur les côtés. C'est une métaphore de croissance, pas une simulation botanique. La pluie active les ronces ; le soleil ouvre des fleurs-plateformes.",
    notice: "Jardin botanique de Nantes, face à la gare. Serres, camélias et grands arbres en font un havre de verdure en plein centre-ville. Premier pas de la ligne verte.",
    summary: [
      "Le Jardin des Plantes est le jardin botanique de Nantes. Il s'ouvre juste en face de la gare : on y passe en quelques pas du parvis, de ses arrêts de tram et de ses façades de verre, à l'ombre des grands arbres.",
      "Ses serres abritent des plantes venues de climats plus chauds. La plus imposante, le Palmarium, est une grande serre de métal et de verre coiffée de dômes ; ses stores se baissent pour protéger les plantes du soleil. C'est elle que le niveau reconstruit, pixel après pixel, du sol vers le ciel, comme une plante qui pousse.",
      "Dans les allées : un bassin et son jet d'eau, des massifs de fleurs renouvelés au fil des saisons, des pelouses, et des œuvres contemporaines installées dans le jardin, dont de grandes topiaires et un personnage en bois.",
      "Premier pas de la ligne verte, le jardin est une respiration en plein centre-ville."
    ],
    element: { label: 'Palmarium (serre)', verify: true }, verify: true,
    anecdote: { who: "L'APOTHICAIRE", text: "Ici, tout a commencé en 1688 par un petit jardin de plantes médicinales. Aujourd'hui, le jardin compte l'une des plus grandes collections de camélias de France : environ 600 variétés.", source: "Ville de Nantes ; Wikipédia, Jardin des plantes de Nantes", look: {"hair": "courts", "hairColor": "gris", "eyes": "petits", "eyeColor": "marron", "skin": "clair", "top": "chemise", "topColor": "blanc", "bottom": "pantalon", "bottomColor": "marron", "shoes": "sombres", "acc": "toque"} }
  },
  {
    id: 'cathedrale', name: 'Cathédrale Saint-Pierre-et-Saint-Paul',
    sprite: 'cathedrale_monument_cathedrale',
    playable: true, level: 'cathedrale', parTime: GP.Tuning.parTimes.cathedrale,
    grammar: "VARIATION VERTICALE : les colonnes répétées deviennent des zones d'escalade et les corniches des appuis. L'image remonte ligne par ligne. Les gargouilles évoquent l'évacuation de l'eau : sous la pluie, les gouttes tombent plus souvent.",
    notice: "Édifice gothique dont la construction débute en 1434 et s'achève au XIXe siècle. Elle abrite le tombeau de François II. Sa nef de pierre blanche est très haute.",
    element: { label: 'Façade et deux tours', verify: false }, verify: false,
    anecdote: { who: "MICHEL COLOMBE, SCULPTEUR", text: "J'ai mis cinq ans, de 1502 à 1507, à sculpter le tombeau de François II, le dernier duc de Bretagne. Il a été sauvé de la destruction et installé dans la cathédrale en 1817.", source: "Ville de Nantes (histoire de la cathédrale) ; ministère de la Culture", look: {"hair": "courts", "hairColor": "chatain", "eyes": "ronds", "eyeColor": "marron", "skin": "clair", "top": "chemise", "topColor": "orange", "bottom": "pantalon", "bottomColor": "marron", "shoes": "sombres", "acc": "beret"} }
  },
  {
    id: 'chateau', name: 'Château des ducs de Bretagne',
    sprite: 'chateau_monument_chateau',
    playable: true, level: 'chateau', parTime: GP.Tuning.parTimes.chateau,
    grammar: "SOURCE PRINCIPALE : les murs, les tours et les portes du Château deviennent masse, élévation et seuils à franchir. La reconstruction révèle l'assise, la courtine centrale puis les tours latérales. Les herses imposent une alternance passage / attente. C'est une traduction ludique, pas une reconstitution historique.",
    notice: "Forteresse des ducs de Bretagne, reconstruite à la fin du XVe siècle par François II puis Anne de Bretagne. Ses remparts entourent un palais résidentiel. Le site abrite aujourd'hui le musée d'histoire de Nantes.",
    element: { label: 'Remparts et tours', verify: false }, verify: false,
    anecdote: { who: "ANNE DE BRETAGNE", text: "Je suis née ici, au château, en janvier 1477. Duchesse de Bretagne, je suis devenue deux fois reine de France.", source: "Ville de Nantes, « Anne, duchesse de Bretagne et reine de France »", look: {"hair": "milong", "hairColor": "brun", "eyes": "ronds", "eyeColor": "marron", "skin": "pale", "top": "veste", "topColor": "noir", "bottom": "jupe", "bottomColor": "noir", "shoes": "sombres", "acc": "coiffe"} }

  },
  {
    id: 'feydeau', name: 'Île Feydeau',
    sprite: 'feydeau_monument_feydeau',
    playable: true, level: 'feydeau', parTime: 120,
    notice: "Ancienne île de la Loire, rattachée à la ville au XXe siècle. Ses hôtels d'armateurs du XVIIIe siècle, aux façades ornées de mascarons, se penchent légèrement.",
    element: { label: 'Façades des hôtels d\'armateurs', verify: false }, verify: false,
    anecdote: { who: "JULES VERNE", text: "Enfant, je regardais passer les navires sur la Loire. Je me rêvais en Robinson, naufragé sur l'île Feydeau, au milieu du fleuve.", source: "Jules Verne, Souvenirs d'enfance et de jeunesse (1890)", look: {"hair": "courts", "hairColor": "gris", "eyes": "petits", "eyeColor": "bleu", "skin": "pale", "top": "veste", "topColor": "noir", "bottom": "pantalon", "bottomColor": "gris", "shoes": "sombres", "acc": "barbe"} }
  },
  {
    id: 'graslin', name: 'Place Graslin',
    sprite: 'graslin_monument_graslin',
    playable: true, level: 'graslin', parTime: 120,
    notice: "Place dominée par le Grand Théâtre, de style néoclassique, achevé en 1788. Sa façade à colonnes corinthiennes est couronnée de statues de muses.",
    element: { label: 'Façade du Grand Théâtre', verify: false }, verify: false,
    anecdote: { who: "J.-J.-L. GRASLIN", text: "Receveur des fermes du roi, j'ai lancé la construction de ce théâtre, inauguré en 1788. La place en demi-cercle rappelle l'intérieur de la salle.", source: "Presses universitaires de Rennes, J.-J.-L. Graslin et la place du théâtre (OpenEdition)", look: {"hair": "boucles", "hairColor": "gris", "eyes": "petits", "eyeColor": "gris", "skin": "pale", "top": "veste", "topColor": "violet", "bottom": "pantalon", "bottomColor": "blanc", "shoes": "sombres", "acc": "boutons"} }
  },
  {
    id: 'machines', name: "Machines de l'île",
    sprite: '',                                  // sur la carte : le Grand Éléphant dessiné par code (MapArt)
    playable: true, level: 'machines', parTime: 120,
    notice: "Atelier-spectacle installé dans les anciens chantiers navals. Le Grand Éléphant, géant mécanique de bois et d'acier, promène les visiteurs sur l'île.",
    element: { label: 'Grand Éléphant', verify: false }, verify: false,
    anecdote: { who: "LE MACHINISTE", text: "Le Grand Éléphant mesure 12 mètres de haut et 21 de long, pour environ 48 tonnes d'acier et de bois. Il a fait ses premiers pas sur l'île le 30 juin 2007.", source: "Les Machines de l'île, dossier de presse 2019", look: {"hair": "courts", "hairColor": "noir", "eyes": "ronds", "eyeColor": "noir", "skin": "hale", "top": "tshirt", "topColor": "orange", "bottom": "pantalon", "bottomColor": "bleu", "shoes": "sombres", "acc": "lunettes"} }
  },
  {
    id: 'chantiers', name: 'Parc des Chantiers',
    sprite: 'chantiers_monument_chantiers',
    playable: true, level: 'chantiers', parTime: 130,
    notice: "Parc aménagé sur l'ancien site des chantiers navals, au cœur de l'île de Nantes. Grues et vestiges industriels dialoguent avec les jardins.",
    element: { label: 'Grue jaune des chantiers', verify: true }, verify: true,
    anecdote: { who: "UN OUVRIER DE DUBIGEON", text: "Le 3 juillet 1987, le Bougainville a quitté le dernier grand chantier naval de Nantes. Des salariés ont occupé le navire pour retarder son départ. La grue jaune date de 1954 et mesure 43 mètres.", source: "Ministère de la Culture (grues Titan) ; INA, Dernier jour des chantiers Dubigeon", look: {"hair": "courts", "hairColor": "noir", "eyes": "ronds", "eyeColor": "noir", "skin": "clair", "top": "veste", "topColor": "ciel", "bottom": "pantalon", "bottomColor": "bleu", "shoes": "sombres", "acc": "casque"} }
  },
  {
    id: 'buren', name: 'Anneaux de Buren',
    sprite: 'buren_monument_buren',
    playable: true, level: 'buren', parTime: 110,
    notice: "Installation d'art public de Daniel Buren sur le quai des Antilles, composée d'anneaux lumineux qui scandent la rive de la Loire.",
    element: { label: 'Les anneaux', verify: true }, verify: true,
    anecdote: { who: "UNE PROMENEUSE", text: "Ces anneaux sont une œuvre de Daniel Buren et Patrick Bouchain, installée en 2007 pour Estuaire. La nuit, ils s'éclairent en rouge, en bleu et en vert.", source: "Estuaire ; Le Voyage à Nantes, fiche « Les Anneaux »", look: {"hair": "milong", "hairColor": "roux", "eyes": "ronds", "eyeColor": "vert", "skin": "pale", "top": "sweat", "topColor": "turquoise", "bottom": "pantalon", "bottomColor": "blanc", "shoes": "blanches", "acc": ""} }
  },
  {
    id: 'hangar', name: 'Hangar à Bananes',
    sprite: 'hangar_monument_hangar',
    playable: true, level: 'hangar', parTime: 140,
    notice: "Ancien entrepôt portuaire où transitaient les bananes venues des Antilles, reconverti en lieu de restaurants, de culture et de loisirs au bord de la Loire.",
    element: { label: 'Le hangar du quai', verify: true }, verify: true,
    anecdote: { who: "UN DOCKER", text: "Jusqu'aux années 1970, ce hangar servait à stocker et à faire mûrir les bananes venues des Antilles. Réaménagé vers 2007, il accueille aujourd'hui bars, restaurants et expositions.", source: "Base Mérimée / pss-archi (notice du hangar) ; Le Voyage à Nantes", look: {"hair": "courts", "hairColor": "noir", "eyes": "petits", "eyeColor": "noir", "skin": "brun", "top": "debardeur", "topColor": "blanc", "bottom": "pantalon", "bottomColor": "marron", "shoes": "sombres", "acc": "casquette"} }
  },
  {
    id: 'memorial', name: "Mémorial de l'abolition de l'esclavage",
    sprite: 'memorial_monument_memorial',
    playable: true, level: 'memorial', parTime: 150,
    notice: "Mémorial au bord de la Loire rappelant le rôle de Nantes dans la traite négrière et l'histoire de son abolition. Il mêle quai, verre et textes gravés.",
    element: { label: 'Plaques de verre du quai', verify: true }, verify: true,
    panneau: { who: "PANNEAU", text: "MÉMORIAL DE L'ABOLITION DE L'ESCLAVAGE. Inauguré le 25 mars 2012, quai de la Fosse. Œuvre de Krzysztof Wodiczko et Julian Bonder.", source: "Ville de Nantes, « Le Mémorial de l'abolition de l'esclavage »" }
  },
  {
    id: 'pommeraye', name: 'Passage Pommeraye',
    sprite: 'pommeraye_monument_pommeraye',
    playable: true, level: 'pommeraye', parTime: 150,
    notice: "Galerie commerçante ouverte en 1843, sur trois niveaux reliés par un escalier monumental. Verrière, statues et décors en font un passage couvert célèbre.",
    element: { label: 'Verrière et escalier', verify: false }, verify: false,
    anecdote: { who: "LOUIS POMMERAYE", text: "Notaire devenu promoteur, j'ai ouvert ce passage en 1843. Il m'a ruiné, mais il est classé monument historique depuis 1976.", source: "Wikipédia, Passage Pommeraye ; Routard", look: {"hair": "courts", "hairColor": "chatain", "eyes": "ronds", "eyeColor": "noir", "skin": "clair", "top": "veste", "topColor": "noir", "bottom": "pantalon", "bottomColor": "gris", "shoes": "sombres", "acc": "hautdeforme+favoris"} }
  },
  {
    id: 'tour-lu', name: 'Tour LU',
    sprite: '',
    playable: true, level: 'tour-lu', parTime: 200,
    notice: "Tour de l'ancienne biscuiterie LU, face au château. Avec sa coupole, elle signalait l'usine au bord de l'eau ; le bâtiment accueille aujourd'hui une scène culturelle, le Lieu Unique.",
    element: { label: 'La tour et sa coupole', verify: true }, verify: true,
    anecdote: { who: "LOUIS LEFÈVRE-UTILE", text: "J'ai imaginé le Petit-Beurre en 1886. Pour l'Exposition universelle de 1900, j'ai fait élever une tour de 36 mètres.", source: "Hérodote ; Ville de Nantes (Tour LU)", look: {"hair": "courts", "hairColor": "noir", "eyes": "ronds", "eyeColor": "noir", "skin": "clair", "top": "veste", "topColor": "noir", "bottom": "pantalon", "bottomColor": "noir", "shoes": "sombres", "acc": "moustache"} }
  }
];

/** Index du dernier niveau jouable (les suivants sont « À VENIR »). */
GP.LAST_PLAYABLE = (function () {
  var last = 0;
  GP.LOCATIONS.forEach(function (l, i) { if (l.playable) last = i; });
  return last;
})();
