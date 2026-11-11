# Refonte des 12 niveaux — diagnostic et suivi

## Correctif 0.5.1-rendering — suite à l'audit du site publié

**Livraison autorisée : l'utilisateur a demandé commit, push et déploiement du correctif.** Cible : branche `fix/audit-green-path`, sans modification de `main`, projet Vercel `green-path`, domaine officiel `green-path-game.vercel.app`. La branche de travail, propre avant intervention, a été avancée sans commit de fusion jusqu'à `55549c7` (`main`) pour conserver les photos et décors récemment intégrés. Les originaux JSON sont inchangés. Les mentions de corrections uniquement locales décrivent la phase précédant cette autorisation ; la section 0.5-gzones concerne la livraison antérieure.

### Défauts reproduits dans la production

- 14 masses du Jardin remplies par `gz_soil` générique ; aux Chantiers, des piles de 4/6 tuiles restaient en terre parce que le remplacement par acier était limité à une largeur de 3.
- Comparaison `undefined === undefined` dans l'association des visuels : décors anonymes attribués à des plateformes sans lien ; galeries et certains mobiles sans leur sprite propre.
- Pièces `gabare1a/b` non suivies par la gabare ; groupes de conteneurs anonymes non déclarés ; pads se contentant d'un rectangle de secours.
- Le chemin GZone contournait le terrain de `LevelArt` ; bordures latérales/angles des jeux de tuiles ignorés, fonds du parc/Château et salles présents mais inutilisés.

### Corrections effectuées

1. **Associations et corps visibles** — identifiants non vides obligatoires ; suffixes de pièces a/b bornés (jamais `gear10` capturé par `gear1`) ; groupes anonymes explicitement déclarés par sprite/coordonnées source dans `js/data/levelStyles.js`. Une image ne peut pas avoir deux propriétaires mobiles ; les trois pads statiques de la serre peuvent partager sa silhouette. Les galeries ont leur bande native répétée sur toute la portée, les sprites non répétables ne sont plus coupés arbitrairement à la largeur du pad. Les bateaux, caisses, tubes et engrenages sont des assemblages suivis par leurs vrais corps. Les lustres de Pommeraye ont un collider de 20 px, largeur native du sprite, en conservant centre, hauteur et amplitude du trajet ; retrait des ailes de collision invisibles de l'ancien pad 48 px. Câbles dessinés vers les rails ou la couverture explicitement présents.
2. **Matériaux** — profils `natural`, `quay`, `masonry`, `metal`, déclarés par rôle et identifiant source, sans heuristique de largeur dans le renderer. Aux Chantiers : pelouses de la friche/belvédère conservées, cales en quai minéral et toutes les piles structurelles en acier, y compris `p16`, `p18`, `p41`, `p42`. Le Jardin utilise les textures de terre/herbe, variantes et angles des planches existantes, pas `gz_soil`. Une texture de matériau inconnue est signalée au lieu d'être silencieusement effacée ou remplacée par de la terre.
3. **Rendu actif et décors** — `GameScene.makeTerrain` passe toujours par `LevelArt.renderTerrain`, qui délègue au terrain GZone exact si nécessaire : un seul terrain affiché par scène. Les contours sont calculés sur l'union des masses : sommet, côtés, dessous et coins uniquement exposés, sans joint artificiel entre blocs contigus. Supports de fond à une profondeur distincte. Fonds `lv_fond_parc` et `lv_fond_chateau`, plantes/sculptures du Jardin, rails sources et deux salles recadrées du Château effectivement affichés. Les salles restent limitées aux deux baies couvertes, sans rendre sèche l'avant-cour ouverte. Les photos et autres ajouts de `main` sont conservés.

### Vérifications du correctif

- Node : **62/62**, dont dix nouveaux tests ciblés d'associations, matériaux, contours et largeur/centre des lustres ; avatar **285/285**.
- Chrome, **pour chaque format 1920×1080, 1366×768 et 844×390** : rendu **104/104**, régression **73/73**, polish **97/97**, flux **44/44** ; aucune erreur JavaScript/console, ressource manquante ou écriture cloud. Rapport : [rendering-qa.json](rendering-qa.json). Ces contrôles incluent le pixel d'un coin réellement dessiné, les couleurs des piles industrielles, la portée visuelle des corps et le suivi pendant le mouvement.
- Diagnostic solaire : **275/275 fragments** toujours atteignables depuis des surfaces candidates ; [rendering-geometry.json](rendering-geometry.json). Téléportations, morts neutralisées et interaction des anneaux prises en compte : pas une traversée connectée ni un essai humain.
- Avant : [production](screenshots/render-before-production.png). Après : [1920×1080](screenshots/render-fix-1920x1080.png), [1366×768](screenshots/render-fix-1366x768.png), [844×390](screenshots/render-fix-844x390.png). Trois premiers points de terrain comparables ; autres vues dédiées aux galeries, flotteurs et salles. Positions de capture imposées, physique arrêtée et météo simulée ; pas des parcours humains.
- Aucun temps cible, contrôle ou format de sauvegarde changé ; mêmes positions de fragments/checkpoints. La correction de largeur des lustres est couverte par le diagnostic physique. Cache préparé pour une publication ultérieure : `greenpath-offline-v6-rendering`, manifeste `0.5.1-rendering`.
- Vérification hors ligne locale dans un contexte Chrome neuf : `levelStyles.js` présent dans le cache v6, serveur rendu inaccessible au navigateur puis rechargement du menu et création du niveau Chantiers réussis. Ce contrôle ne certifie pas tous les niveaux hors ligne ni un appareil physique.

Accès local : **http://127.0.0.1:8130/tools/levels.html** ; ce sélecteur reste exclu de la publication, tout comme les outils, tests, rapports QA, fichiers d'environnement et schéma Supabase. La production utilise la carte normale. Aucune migration Supabase. La validation humaine et les essais matériels restent à faire ; ce correctif ne marque aucun niveau « Validé » du fait de sa publication.

## Livraison 0.5-gzones — autorisation de publication

L'utilisateur a explicitement demandé **commit, push et déploiement Vercel** après la réalisation des douze niveaux. Cible : branche `fix/audit-green-path`, sans fusion dans `main`, projet Vercel existant `green-path`, domaine officiel `green-path-game.vercel.app`. Pas de migration Supabase. L'ancien domaine supprimé n'est pas rétabli. Les mentions « aucun commit/déploiement » des sections suivantes décrivent les phases précédentes, avant cette autorisation.

Recette finale terminée : **52/52 Node**, avatar **285/285** ; pour chacun des trois formats **1920×1080, 1366×768, 844×390**, niveaux **269/269**, régression **73/73**, polish **97/97**, flux **44/44**. Aucune erreur JavaScript/console, ressource locale en erreur HTTP ou écriture cloud dans ces recettes. Diagnostic solaire : **275/275 fragments**, avec téléportations et morts neutralisées ; aucune certification de traversée humaine des douze niveaux. Les résultats détaillés sont dans `levels-qa.json` et `levels-geometry.json`.

Publication : fichiers d'environnement, outils, tests, documents QA et schéma Supabase exclus. Le sélecteur `tools/levels.html` est réservé au développement local ; la production utilise la carte normale. Version du manifeste : `0.5-gzones` ; cache applicatif : `greenpath-offline-v5-gzones`. Les états « Prêt à tester » ne deviennent pas « Validé » du fait d'une publication.

## Périmètre actuel — les douze niveaux, puis retouches

L'utilisateur a remplacé explicitement le travail niveau par niveau par **la réalisation des douze niveaux, retouches ensuite**. Il a confirmé les concepts des boss **Éléphant/valves (6), Moisissure/lampes UV (9), Vortex/quatre lanternes (12)** avant leur développement. Ces accords ne constituent pas une validation humaine des parcours réalisés.

Les douze parcours sont implémentés localement. Jardin et Cathédrale utilisent leurs GZones ; le Château conserve son adaptation précédente. Le socle antérieur reste dans `GP.LevelPrototypes`, sans suppression de ses définitions. **Aucun commit, push, déploiement ou SQL exécuté.**

**Sélecteur : http://127.0.0.1:8130/tools/levels.html**. Chaque lien lance le vrai niveau dans Phaser avec une sauvegarde de test distincte et sans charger de compte cloud. Le parcours normal conserve son déverrouillage progressif.

| # | Lieu | Dimensions / fragments | Mécanismes réalisés | Statut |
|---|---|---|---|---|
| 1 | Jardin | 140×17 / 15 | Bassins, topiaires, jets cycliques et gel porteur sous neige | Prêt à tester |
| 2 | Cathédrale | 158×24 / 18 | Nef couverte, colonnes, galeries, accroche et toits | Prêt à tester |
| 3 | Château | 170×20 / 20 | Ponts-levis, herses, échafaudage, rempart et cour | Prêt à tester |
| 4 | Feydeau | 180×18 / 20 | Balcons à entraînement et bateaux s'enfonçant sous le poids | Prêt à tester |
| 5 | Graslin | 190×22 / 22 | Perron, colonnes, parasols rebondissants et lustres | Prêt à tester |
| 6 | Machines | 210×20 / 24 | Engrenages, bielles, vapeur, boss Éléphant en trois phases | Prêt à tester |
| 7 | Chantiers | 220×22 / 24 | Chariots au poids, ascenseur, cales et passerelles | Prêt à tester |
| 8 | Anneaux | 240×18 / 25 | Propulsions, chaînes et alternances indiquées aussi par des flèches | Prêt à tester |
| 9 | Hangar | 230×22 / 26 | Conteneurs, portes basses, intérieur abrité, boss Moisissure | Prêt à tester |
| 10 | Pommeraye | 210×26 / 26 | Trois strates, coursives, lustres et dalles fragiles sous verrière | Prêt à tester |
| 11 | Mémorial | 220×18 / 25 | Dalles solides/leurres, séquences lisibles, eau cyclique ralentissante | Prêt à tester |
| 12 | Tour LU | 260×28 / 30 | Courants ascendants, coupole stylisée, boss Vortex en quatre phases | Prêt à tester |

**Prêt à tester ≠ validé.** Aucun de ces douze niveaux n'a reçu de validation humaine. Le bilan et les limites des vérifications récentes figurent à la fin de ce document. Les sections suivantes conservent l'audit et la première phase du Château comme historique ; les consignes initiales d'arrêt après chaque niveau y sont désormais remplacées par la décision ci-dessus.

## Cadre initial (historique)

Audit initial du 11 novembre 2026, sur `fix/audit-green-path`, base `e57f7a7`. Dépôt propre avant intervention. L'audit était en lecture seule, hormis ce document. Après les décisions D1–D4 et la précision sur les références JSON, réalisation locale du Château uniquement (voir fin du document). Aucun commit, push ni déploiement.

Mission : concevoir puis réaliser **un niveau à la fois**, à partir des GZones, avec validation de conception, mise à disposition pour essai humain, corrections puis accord explicite avant le suivant. Chantier actif : Château (niveau 3). Les boss 6, 9 et 12 sont requis par la nouvelle mission, mais aucun concept joint n'est validé automatiquement. Les anciennes pistes de `GAME_DESIGN.md` ne constituent pas une décision pour cette refonte.

Les GZones sont des documents de conception, pas du code exécutable ni une preuve de fidélité historique ou de franchissabilité. Les assertions « vérifié par script » qu'elles contiennent n'ont pas été reproduites avec un import dans Phaser.

## Sources examinées

Douze pièces jointes JSON, dans le répertoire fourni `Downloads/Niveaux`. Elles ne sont ni modifiées ni importées dans le jeu. Empreintes SHA-256 pour identifier exactement la version étudiée :

| Fichier | SHA-256 |
|---|---|
| `niveau_01_jardin.json` | `41314febd46480b8a40d3fe2ae2634b1178159315af73f7a7989d748ad5b5e32` |
| `niveau_02_cathedrale.json` | `be38d5da8152ec5e083b4dc0e072fb213a2d4dc50b94e5f7db5131ba125b1695` |
| `niveau_03_chateau.json` | `b60ff9b85e52ec0b18e0a55965abfbe5dcffa879a024175036fea4c8042a1add` |
| `niveau_04_ile_feydeau.json` | `10004b7db2ebf78a7e8d1bbc0995a9d6151af0d8bba14b2b2ae7357c130cc488` |
| `niveau_05_graslin.json` | `bbfc2cd81b2cf5c6658641fe2a752b504faf5ec77496eec58c0199214a5119b4` |
| `niveau_06_machines_ile.json` | `8d30e47152e59752243bc0fbfb6b3c793591cd26d8a7e0d55a7db2a886f92f35` |
| `niveau_07_chantiers_navals.json` | `9348f19ca891d19d1e061fb95a7f30dc263d44114ba542a9e3bc32a92d14eef9` |
| `niveau_08_anneaux_buren.json` | `cdfa626f79a6e95a47f8b257f33b90c415c108e6e5c9669979c01ef53cea232e` |
| `niveau_09_hangar_a_bananes.json` | `e8215eae2aec3b42a9ee404e77ec559a1521402094181e48329518712af64c07` |
| `niveau_10_passage_pommeraye.json` | `e8e4d62cf8081f51d7cc8e1d2929647aa0717f4bd22f320dad1ed2d939d2527a` |
| `niveau_11_memorial_abolition.json` | `c06e83bb4cd31000ba21680a432d74cf561d4b0620da809d3f9283f4ae3227ea` |
| `niveau_12_tour_lu.json` | `92c0e9d6dffa9ec125c9f91ef263235b8f413d3c979006ae64d110cf45e8fba5` |

Code et documents de référence : `js/data/levels.js`, `js/data/locations.js`, `js/data/tuning.js`, `js/main.js`, `js/config.js`, `js/scenes/BootScene.js`, `js/scenes/GameScene.js`, entrée Game depuis `MapScene.js`, `js/systems/LevelArt.js`, `Sprites.js`, `WeatherManager.js`, `WeatherRules.js`, `WeatherShelters.js`, points d'intégration de `WeatherFX.js`, `SaveManager.js`, `ProgressionManager.js`, `GAME_DESIGN.md`, `HERITAGE_GRAMMAR.md`, `tests/README.md`. Inspection de captures existantes Jardin/Cathédrale/Château : documents historiques, pas captures d'une nouvelle exécution des GZones.

## État au diagnostic initial, avant l'extension (historique)

Numéros ci-dessous = **pièces jointes**, désormais retenus par l'utilisateur comme ordre cible : Pommeraye en 10, Mémorial en 11. Le code place encore le Mémorial en 10 et Pommeraye en 11 ; aucun réordonnancement n'a été exécuté. Les anciens commentaires inversant Cathédrale/Château dans `levels.js` ont été corrigés sans changer leur ordre réel.

Les douze documents ont reçu une analyse structurelle et une première lecture de conception. « À analyser » signifie que l'étude détaillée et la conception de réalisation restent à faire, pas que le fichier n'a pas été ouvert. **Aucun niveau n'est validé dans ce nouveau cycle.**

| # | Lieu | Dimensions GZone / fragments | État du code | Statut de refonte | Intention à préserver / principal point à revoir |
|---|---|---|---|---|---|
| 1 | Jardin | 140×17 / 15 | Jouable, 136×17 / 32, inchangé | À analyser | Référence documentaire retenue : JSON uniquement, confirmé par l'utilisateur. Pas d'autre version jouable ou capture disponible ; pas de refonte/import dans ce chantier. |
| 2 | Cathédrale | 158×24 / 18 | Jouable, 120×17 / 22, inchangé | À analyser | Référence documentaire retenue : JSON uniquement. Nef, galerie et passage vers les toits à préserver comme principes de composition ; pas de refonte/import dans ce chantier. |
| 3 | Château | 170×20 / 20 | Nouvelle réalisation locale, 170×20 / 20 | Prêt à tester | Recette automatisée passée, trois planches inspectées ; attend l'essai et les retours de l'utilisateur. Aucune validation humaine du niveau. |
| 4 | Île Feydeau | 180×18 / 20 | Pas de parcours | À analyser | Trame des hôtels, balcons et quais ; arbitrer évocation historique des bras de Loire et état actuel, justifier les bateaux et l'inclinaison des appuis. |
| 5 | Graslin | 190×22 / 22 | Pas de parcours | À analyser | Perron, huit colonnes, frise et fronton ; parasols à grande hauteur, rails de chantier et lustres peuvent transformer le théâtre en mécanisme artificiel. |
| 6 | Machines | 210×20 / 24 | Pas de parcours ni boss | À analyser | Nefs, passerelles, mécanismes bois/métal ; boss Éléphant proposé à discuter au niveau 6, effets vapeur et refuges à justifier. |
| 7 | Chantiers | 220×22 / 24 | Pas de parcours | À analyser | Friche → cales → pylônes → flèche → belvédère ; bon potentiel structure/jeu, mais portées, treillis, suspensions et cales à composer comme une infrastructure. |
| 8 | Anneaux | 240×18 / 25 | Pas de parcours | À analyser | Série et perspective du quai ; propulsion chromatique fantastique à valider, trajectoires à lire autrement que par la couleur seule. |
| 9 | Hangar | 230×22 / 26 | Pas de parcours ni boss | À analyser | Travées, portes et logistique ; 79 entrées de dangers (pas 79 épreuves distinctes), moisissure/UV et intérieurs à discuter. |
| 10 | Pommeraye | 210×26 / 26 | Pas de parcours ; étape 11 du code | À analyser | Trois niveaux, escalier, coursives, verrière ; 102 entrées de dangers (beaucoup de cellules répétées), verre fragile et lustres risquent de supplanter l'architecture. |
| 11 | Mémorial | 220×18 / 25 | Pas de parcours ; étape 10 du code | À analyser | Descente → passage → remontée ; sobriété à préserver, chutes mortelles/leurres/marée rapide à arbitrer et dates à sourcer/contextualiser. |
| 12 | Tour LU | 260×28 / 30 | Pas de parcours ni boss | À analyser | Tour, horloge et coupole ; accumulation de pièces d'autres lieux, fond Graslin et documentation incohérente du boss à reprendre avant réalisation. |

Le prototype Bouffay reste conservé hors parcours ; ses plateformes mobiles peuvent informer la technique, pas fournir arbitrairement l'architecture de Feydeau ou d'un autre lieu.

## Références 1 et 2 : ce qu'on peut en extraire

### Jardin

- Séquence du minéral vers le végétal, repères nommés, silhouette du Palmarium, masses de feuillage et respirations.
- Dans le code actuel : tutoriel course/saut variable, checkpoints, topiaire solide, pluie activant des ronces, raccourcis solaires non indispensables, deux auvents partiels.
- Dans la GZone : bassins/jets cycliques, dômes porteurs, oiseaux à esquiver accroupi, arche finale, 15 fragments et deux checkpoints. Ce n'est pas une description exacte du niveau existant (32 fragments, trois checkpoints).
- La note « saut + corps 2 tuiles » ne doit pas servir de preuve physique : le corps debout réel mesure une tuile (16 px). Le sprite mesure 19 px de haut, pas deux tuiles de hitbox.

### Cathédrale

- Séquence explicitement construite : parvis → nef au sol → escalier → galerie → porte → toits → terrasse. Le retour inférieur vers l'escalier évite de transformer chaque chute en mort.
- Les notions de façade, linteau, voûte, vitraux incrustés et appuis portés constituent une référence plus forte qu'une simple succession de corniches.
- Le code actuel possède colonnes grimpables, accroche, rebords friables et gouttes verticales de gargouilles, sans cette géométrie complète. La GZone ne doit pas être considérée comme déjà implémentée.
- Les propositions de rayons porteurs, réduction du temps d'accroche par le froid, pluie intérieure et flashs ne sont pas nécessaires à cette qualité architecturale ; ne pas les importer automatiquement.

**Décision D1 de l'utilisateur : les références sont les versions correspondant aux JSON, et non les niveaux actuellement jouables dans ce dépôt.** Précision ultérieure explicite : **seuls leurs JSON existent**, aucun lien, projet jouable ou capture n'est disponible. La recommandation initiale de prendre les niveaux jouables comme références est donc écartée. Leur analyse reste documentaire, sans prétendre avoir observé leur rendu. Cela n'autorise pas une refonte ou un import de 1/2 : la réalisation porte sur le Château.

## Diagnostic technique transversal (état avant réalisation)

### Socle à conserver

- Phaser 3.90, namespace `GP`, scripts locaux, rendu pixel art, remapping et contrôles clavier/tactile/manette.
- `LevelBuilder` sépare grille, plateformes, dangers, objets et abris ; `LevelArt` produit le terrain en morceaux de 2048 px. Les sprites sont construits depuis les matrices locales au démarrage.
- Arcade : tuiles pleines, appuis à sens unique, corps mobiles pour plateformes ; dangers et collecte via intersections AABB. Saut variable, coyote 90 ms, buffer 110 ms ; physique centralisée dans `GP.Tuning`.
- Progression et résultats identifiés par `loc.id`, reprise aux checkpoints, fragments conservés après mort. Aucun besoin établi de changer le format de sauvegarde.

### Adaptations nécessaires, à limiter au niveau traité

1. **Pas d'importeur de ces GZones.** Formats `niveau/2` et `niveau/3`, champs différents (`fill_to`/`to`, sprites directs/jeux de tuiles), objets visuels parfois dans `plateformes`, supports liés par `sur`, positions finales `_fin`/`_haut`. Une position finale n'est pas une deuxième plateforme permanente.
2. **Hauteur et caméra.** Le constructeur actuel fixe 17 lignes ; les GZones montent à 28. La caméra est bornée à la hauteur écran. Préférer une hauteur de monde configurable et un suivi adapté au niveau 3, pas une réduction globale qui rendrait le pixel art illisible. Garder la base écran 270 px et les autres niveaux inchangés.
3. **Coordonnées/ancrages.** Le moteur actuel place beaucoup d'objets au centre d'une colonne ; les documents annoncent un ancrage bas-gauche de cellule. Les coordonnées fractionnaires nécessitent des corps en pixels ou une représentation adaptée, pas un arrondi silencieux dans la grille entière.
4. **Architecture.** Le choix actuel des tuiles par voisinage ne connaît ni travée ni bâtiment. Définir volumes, supports, couronnements et ouvertures avant les détails ; distinguer explicitement structure visuelle et obstacle solide.
5. **Mécaniques manquantes.** Pont-levis cycliques, eau mortelle dédiée, glisse de surface, flotteurs, rebonds, transport par engrenage, chariots au poids, anneaux, séquences et boss ne sont pas pris en charge par une simple lecture JSON. Développer seulement le sous-ensemble approuvé pour le niveau courant.
6. **Fin du niveau.** Le dernier fragment déclenche actuellement `finish()`. Les GZones prévoient une arche, et les boss une condition supplémentaire. Discuter collecte + arrivée, et collecte + boss + arrivée, sans modifier les niveaux 1/2 par effet de bord.
7. **Reprise.** La signature actuelle couvre largeur, fragments et checkpoints, pas toute la géométrie. Pour une refonte, vérifier l'invalidation ciblée de reprise ; préserver résultats, avatar et paramètres. Le réordonnancement 10/11 touche aussi les indices `current`/`unlocked`, pas seulement les identifiants de résultats.
8. **Difficulté.** Les temps de référence joints ne sont pas des temps validés par essai humain. Les nombres d'entrées de dangers ne sont pas comparables directement : plusieurs fichiers développent un même fond de fosse en nombreuses cellules.

### Incohérences vérifiables des documents

- Château : le texte du pic de difficulté mentionne une torche mortelle ; `dangers` ne contient aucune torche. La météo prétend en supprimer deux et cite deux vitesses de tonneaux, mais un seul tonneau est déclaré dans `ennemis`.
- Château : le premier pont-levis couvre une fosse de 4 tuiles de large et 2 de profondeur ; la pédagogie mentionne un escalier absent des données. Une sortie par saut paraît envisageable, mais ce n'est pas une preuve de franchissabilité.
- Château : des piliers de herses sont annoncés convertis en décor ; certains petits volumes `pilier` restent dans `plateformes`. Leur rôle de linteau ou support et leur collision doivent être explicités.
- Graslin : une transition météo annonce `y=14` vers `y=8` avec rebond 3,8 et accroche ; les parasols concernés ont un champ `top` différent de leur `y`. Il faut déterminer la surface de départ réelle avant de valider la hauteur, pas additionner des nombres textuels.
- Pommeraye : `lustre1/2/3` apparaissent chacun comme pad et comme objet visuel dans la même liste. Ce sont vraisemblablement des associations à normaliser, pas trois nouveaux objets à supprimer comme doublons.
- Tour LU : le texte cite quatre checkpoints (`48,98,144,193`), mais les données en déclarent trois (`48,100,192`). Le boss narratif cite des anneaux à `216/232`, tandis que la liste `anneaux` n'en déclare qu'à `43/133`. Sa durée annoncée 65 s ne correspond pas à 57 s d'attaques + 12 s de répit = 69 s, hors déplacements/activations.
- Tour LU : `image_a_reconstituer` contient trois détails d'image suivis d'un catalogue de mécaniques des douze niveaux ; ne pas traiter toute cette liste comme des étapes de reconstruction.
- Les mentions « moteur absent » dans certains JSON décrivent leur contexte d'écriture, pas l'état du dépôt actuel.

## Météo : existant et propositions

### Ce qui existe réellement

`WeatherManager` normalise Open-Meteo (Nantes), rafraîchit toutes les cinq minutes, conserve la dernière observation hors réseau et utilise un secours neutre s'il n'y a pas de donnée. Le mode dev proposait huit états simulés à l'audit initial ; la réalisation du Château ajoute une neuvième simulation, **orage**. En niveau, touche **N**, pas W (certains anciens commentaires ne sont plus à jour).

`WeatherRules` transforme la pluie/neige en accélération/freinage modifiés, le vent en accélération horizontale en l'air et la brume/nuit en visibilité réduite des fragments. La température n'a pas d'effet mécanique. Les valeurs sont bornées dans `GP.Tuning`.

`WeatherShelters` définit manuellement des rectangles monde avec protections pluie/neige/vent indépendantes ; maximum en chevauchement, transition de 300 ms, exposition des précipitations à partir de la même géométrie. Deux auvents partiels au Jardin, deux passages couverts au Château, aucun abri déclaré à la Cathédrale. La protection n'est pas automatiquement déduite des collisions.

### Ce qu'il ne faut pas importer tel quel

- Les coefficients `friction` des JSON ne correspondent pas directement à un coefficient du moteur, qui ajuste l'accélération. Les unités de vent en tuiles/s ne sont pas une accélération en px/s² ; le texte du boss 6 confond ces grandeurs.
- Ni accumulation d'eau, ni marée, ni gel porteur, ni ruissellement, ni dépôt neigeux ne sont implémentés par ces fichiers.
- Ne pas mouiller l'intérieur parce qu'il pleut dehors ; les changements des cierges, lustres et dalles sous toiture nécessitent une cause architecturale explicite.
- Aimantation des herses par la foudre, arc électrique automatique sur les lampadaires, fragilisation instantanée du verre intérieur, hyper-propulsion des anneaux : propositions fantastiques à valider, pas conséquences naturelles établies.
- La météo peut rester perceptible depuis un intérieur (bruit, lumière, vues extérieures) sans infliger une variation physique arbitraire.
- Chaque parcours approuvé devra rester réalisable sans soleil ni bonus rare, sous vent opposé et avec les dangers actifs. Les télégraphes doivent être visuels et ne pas dépendre du son ou de flashs plein écran.

## Niveau 3 — Château : préconception à discuter

### Intentions retenues comme base, non encore approuvées pour réalisation

1. Douves / franchissement : apprentissage d'un cycle dans une fosse sèche avant un franchissement exposé.
2. Châtelet : épaisseur de maçonnerie, tours reliées, passages couverts et herses lisibles.
3. Ascension : échafaudage attaché à une courtine, corniches continues, appuis reliés à une structure identifiable.
4. Chemin de ronde : assise et parapet continus ; séquence combinée courte avec palier sûr avant chaque attente.
5. Cour / Grand Logis : redescente compréhensible, façade résidentielle, respiration et arrivée.

### Points architecturaux à corriger avant implantation

- Quatre ponts-levis sont actuellement utilisés, dont deux sur le chemin de ronde : fidélité littérale au fichier ou remplacement de certains par des passerelles/ponts de chantier structurellement justifiés ? Recommandation : conserver la mécanique cyclique et la pédagogie, mais réduire le recours au pont-levis là où un seuil fortifié n'est pas représenté.
- Les piliers « enracinés » jusqu'au bas ne suffisent pas à former un échafaudage : proposer une ossature bois et des consoles liées au mur, pas six aiguilles de tuffeau isolées dans les douves.
- Distinguer visuellement maçonnerie défensive et façade du Grand Logis ; le document patrimonial existant avertit de ne pas présenter toute l'enceinte comme du tuffeau uniforme. Les proportions exactes demandent des références sourcées.
- Les sprites ont des dimensions réelles à respecter : pont-levis 64×24, herse 32×48, Grand Logis 128×80. Un champ `w:1` pour une herse ne définit pas à lui seul sa hitbox ni une baie architecturale correcte.
- L'oiseau et le tonneau restent des intentions de danger, pas des obligations : éviter leur emploi comme bouche-trou dans un parcours déjà rythmé par l'eau et les seuils.

### Proposition météo sobre

- Douves et remparts ouverts : pluie/neige visibles, freinage modifié sur surfaces exposées ; vent sur les sauts, signalé par bannières.
- Châtelet et vrais passages couverts : protections calculées sur leur géométrie, pluie/neige bloquées, vent atténué selon les ouvertures.
- Échafaudages : bois exposé différencié, paliers d'attente et marges suffisantes même mouillés.
- Cour : alternance d'espace ouvert et de vrais porches si le dessin approuvé en comporte.
- Pas d'aimantation des herses par l'orage ni de plateforme de glace obligatoire. Les nouvelles interactions éventuelles restent soumises à décision.

### Décisions de conception approuvées par l'utilisateur

Réponses explicites reçues après l'audit initial. Ces accords portent sur la direction de conception ; **ils ne valident pas un niveau réalisé ni un parcours testé**.

| ID | Choix confirmé | Conséquence |
|---|---|---|
| D1 | « Autres versions correspondant aux JSON », puis « Non seulement leurs JSON » | Jardin et Cathédrale joints deviennent les seules références documentaires ; aucun autre rendu à attendre et aucun import de 1/2 dans ce chantier. |
| D2 | « Retiens cet ordre » | Ordre cible = pièces jointes, dont Pommeraye 10 et Mémorial 11 ; pas de migration immédiate des indices de progression. |
| D3 | « Une adaptation architecturale crédible » | Concevoir le Château comme un ensemble cohérent, en adaptant les cinq zones ; retenir la direction proposée avec herses non létales et météo liée à l'exposition, pas les effets fantastiques du JSON. |
| D4 | « Collecte complète puis arche de sortie » | Le dernier fragment ne termine plus automatiquement le Château ; l'arrivée est une condition distincte. Préserver le comportement de 1/2 pendant ce chantier. |

### Plan spatial de travail du Château

Proposition détaillant D3, **pas implantation définitive approuvée**. Les limites des cinq zones sont reprises comme repères du fichier source ; les positions exactes seront ajustées selon volumes, champs de vision et vraie physique.

| Zone source | Composition proposée | Parcours et sûreté | Exposition météo |
|---|---|---|---|
| 1, x=0..34 | Abord du château puis ouvrage de franchissement adossé au châtelet ; eau en contrebas, rives et culées visibles | Premier cycle au-dessus de fosse sèche avec sortie clairement praticable ; second franchissement au-dessus de l'eau ; palier avant checkpoint | Extérieur exposé ; abri seulement sous un volume réellement couvert |
| 2, x=34..70 | Deux masses de tours reliées par une maçonnerie continue, baies sous linteaux et couloir de passage | Apprendre l'attente puis le passage sous herse ; pas de fermeture écrasante, pas de décor solide condamnant le couloir ; appuis sûrs avant/après les seuils | Passage couvert protégé de pluie/neige ; vent atténué selon les ouvertures |
| 3, x=70..106 | Courtine identifiable et échafaudage bois lié au mur, avec montants/consoles cohérents ; corniches comme éléments du même ensemble | Ascension par paliers, appuis visibles avant engagement, retour ou récupération lorsque possible ; pas de piliers minces transformant les douves en forêt de tours | Bois et corniches exposés ; un appui fin n'est pas à lui seul un abri |
| 4, x=106..142 | Chemin de ronde porté par la courtine, parapet et ponctuations verticales cohérentes ; les coupures doivent avoir une cause lisible | Combinaison courte des gestes appris ; remplacer certains ponts-levis par des liaisons adaptées si nécessaire, sans dupliquer arbitrairement un châtelet en altitude ; attendre sur un palier sûr | Vent plus sensible sur les parties ouvertes, protection locale seulement justifiée par un passage bâti |
| 5, x=142..170 | Descente depuis l'enceinte vers une cour dégagée, Grand Logis en fond ; différenciation résidence/défense | Respiration et arche identifiable ; signaler la collecte incomplète sans remettre les fragments acquis à zéro ; ne pas créer un blocage irréversible en fin de parcours | Cour exposée, éventuel porche protégé uniquement s'il est effectivement composé et visible |

Contrats techniques de cette réalisation : hauteur configurable sans toucher aux définitions 1/2 ; une même géométrie d'abri pour effets et physique ; pas de changement global des contrôles ou de `GP.Tuning` ; réutilisation des identifiants de lieux ; reprise du Château traitée sans effacer les résultats terminés. Les cycles, comptes de fragments et temps cibles joints restent des valeurs de conception à éprouver, pas de l'équilibrage humain validé.

## Boss : inventaire, pas validation de concepts

- **6 / Éléphant** : trois phases, esquives puis activation de valves pour calmer la machine. Base non offensive intéressante. La source fournit des marges analytiques et une reprise par valve, mais elles ne sont pas des mesures dans Phaser ; une phase annoncée 13 s contient une attaque finissant à 13,3 s. Décider apparence, lien au lieu, refuge, télégraphes, persistance de phase et collecte au moment du niveau 6.
- **9 / Moisissure** : trois phases et lampes UV ; sprites dédiés manquants selon le fichier. Lien avec l'histoire de stockage et registre de fiction à documenter ; ne pas laisser le thème fongique effacer les travées du hangar. Revoir la lisibilité et l'échappatoire d'un sol rendu mortel.
- **12 / Vortex** : quatre phases et lanternes, reprise de gestes antérieurs. Réduire les emprunts visuels au profit d'une identité LU ; clarifier incohérences de géométrie, durées et objectifs avant toute réalisation.

Le sprite `machines_animal_mecanique` 80×64 existe déjà ; ses animations requises et les assets valve/vapeur/onde doivent être vérifiés individuellement. La chaîne littérale `machines_animal_mecanique (provisoire : ciel_oiseau)` n'est pas une clé d'asset valide. La référence `!lu_monument_tour_lu` n'existe pas dans les sprites du dépôt. Le contrôle des références structurelles n'est pas un inventaire exhaustif des assets décrits seulement en prose.

## Contrôles de l'audit initial (avant réalisation)

- Branche et état Git vérifiés avant intervention ; travail précédent conservé.
- Douze JSON décodés avec succès ; inventaire de leurs dimensions, zones, listes, mécanismes et références de sprites. Contrôle statique des clés de sprites structurées contre les planches du dépôt, sans importer ni exécuter les documents.
- Socle du jeu vérifié pendant l'audit initial : `node --test tests/*.test.js` **39/39**, comparaison avatar **285/285**. Ces résultats portent sur le code existant, pas sur les GZones ni sur un boss.
- **Aucune GZone n'a été exécutée dans le navigateur.** Aucune nouvelle simulation de parcours, aucun playtest humain, aucun test matériel, aucune certification de fidélité architecturale.
- Les captures consultées sont des archives ; elles ne prouvent pas le rendu complet des documents joints.

## Recette à préparer pour chaque niveau implémenté

1. Test local dédié, sans progression personnelle ni écriture cloud, lancement direct du niveau en développement sans modifier le déverrouillage normal.
2. Vérification JavaScript/assets ; collisions cohérentes avec volumes et appuis ; checkpoints et reprise ; fragments et arrivée ; régression des niveaux préservés.
3. Essais distincts : analyse statique, simulations géométriques explicitement limitées, exécution dans le navigateur avec dangers actifs, puis parcours humain par l'utilisateur.
4. Météo : neutre, pluie, neige, brume, nuit, vent dans les deux sens et orage ; combinaisons critiques, transition météo en cours de jeu, reprise dans/sortie d'un abri. Pas de raccourci solaire indispensable.
5. Rendu 1920×1080, 1366×768 et 844×390 ; inspection des raccords, volumes, supports, parallaxes et télégraphes. Les essais matériels restent séparés.
6. Livrer URL locale, commandes réelles, conditions à tester et limites connues ; statut **Prêt à tester**, jamais **Validé** automatiquement.
7. Attendre les retours, corriger le même niveau et demander l'accord avant le suivant. Aucun commit/push/déploiement sans nouvelle autorisation explicite.

## Réalisation locale — Château, première version pour essai humain

### Ce qui a été construit

- Parcours **170×20 tuiles**, cinq zones reprenant les séquences du JSON, **20 fragments** et **trois lanternes**. Adaptation manuelle documentée, pas chargement direct du format joint.
- Deux ponts-levis sur les abords : fosse sèche avec marche de récupération, puis vraies douves. Préavis visuel de 500 ms, rotation de 350 ms, cycle 3 s baissé / 2 s relevé. Aucun relevage sous les pieds ; corps de collision séparé de l'image pivotante.
- Deux baies couvertes au châtelet avec linteaux solides et herses non létales. Fermeture différée si le joueur entre sous une herse encore en mouvement ; cycles et mouvement arrêtés par la pause. Une meurtrière annoncée conserve l'usage de l'accroupissement sans ajouter d'ennemi nouveau.
- Échafaudages bois reliés visuellement à la courtine, corniche liée au mur ; les piliers isolés en tuffeau du JSON ne sont pas repris littéralement.
- Chemin de ronde porté par des masses continues et deux tabliers fixes de réparation, au lieu de deux ponts-levis supplémentaires sans seuil fortifié. Un tonneau roulant réutilise la mécanique existante.
- Descente en marches de hauteur unitaire vers la cour : retour possible. Grand Logis de la planche existante, arche en fin de parcours, indication de la première zone contenant encore des fragments.
- Le dernier fragment complète l'image sans terminer le Château : présence dans l'arche également requise, y compris après rechargement d'une partie ayant déjà tous ses fragments.
- Maçonnerie défensive grise, encadrements clairs, pavés et tabliers horizontaux dans `CastleArt.js` ; dessin original par code avec palette existante, aucune nouvelle photographie. Le Grand Logis conserve son contraste résidentiel. Les volumes restent une interprétation stylisée, pas un relevé historique.

### Météo réellement intégrée

Les deux abris sont exactement sous les linteaux des colonnes 40–43 et 56–59 : pluie/neige 1, vent 0,5. Les parties ouvertes, échafaudages et remparts restent exposés. Le même espace monde sert au masque des particules et au calcul physique, avec transition existante de 300 ms. Les bannières indiquent le sens du vent ; mouvement réduit respecté. Aucune aimantation de herse, gel porteur ou autre conséquence fantastique du fichier n'est ajoutée.

### Adaptations techniques limitées et préservation

- `LevelBuilder.create(width, fn, rows)` : hauteur optionnelle, 17 par défaut ; `gate` accepte une ligne de sol explicite sous un linteau. Le Château active le suivi vertical sur 320 px ; les niveaux de 17 lignes gardent leur caméra antérieure.
- `LevelMechanics.js` : cycle de pont déterministe et condition de fin optionnelle. Les niveaux sans `exit` gardent leur fin à la dernière collecte.
- `CastleArt.js` : dessin et textures du Château uniquement ; planches sources intactes. Les tabliers sont horizontaux et alignés sur leurs appuis.
- Correction observée dans la recette : petit accrochage au flanc de rive avec deux colliders distincts, surtout sous neige. Recouvrement vertical de 2 px du tablier dynamique pour résoudre la couture, sans changer les valeurs du joueur.
- `Save.runSignature` préfixe seulement les niveaux déclarant une `revision`. L'ancienne reprise du Château est invalidée ; résultats terminés, avatar, réglages et reprises des autres niveaux conservés. Version de sauvegarde toujours 1 ; aucune migration Supabase.
- Les définitions sérialisées de Jardin, Cathédrale et Bouffay ont exactement les mêmes empreintes qu'au commit `e57f7a7`, vérifiées par tests. Aucun autre niveau réalisé.
- Ne pas comparer directement les records historiques du Château à ce nouveau parcours : ils sont conservés sans remise à zéro, et le temps cible de 100 s reste provisoire, pas rééquilibré d'après un robot.
- Cache hors ligne distinct `greenpath-offline-v4-chateau` pour éviter de servir un assemblage de scripts anciens/nouveaux lors d'une future publication. Cela ne constitue pas un déploiement ; l'offline réel n'est pas recertifié par cette recette.

### Accès pour l'utilisateur

```bash
python3 -m http.server 8130 --bind 127.0.0.1
```

**http://127.0.0.1:8130/?dev=1&level=chateau**

Le lancement direct n'existe que sur localhost avec les deux paramètres explicites. Sauvegarde `greenpath.dev.chateau`, compte cloud personnel non chargé, cloud désactivé ; progression normale non débloquée par l'essai. **R** recommence la reprise de test, **N** change de simulation météo (neuf états, puis retour au réel), **V** inverse le vent courant. **K** force la collecte pour tester l'arche, pas pour évaluer la jouabilité.

### Recette et preuves

- Node **47/47**, dont huit tests dédiés ; avatar **285/285**.
- Dans Chrome automatisé, pour chacun des formats **1920×1080, 1366×768 et 844×390** : socle **25/25**, régression **73/73**, polish **97/97**, composants Château **29/29**. Les fixtures de composants téléportent, contrairement au contrôleur de parcours.
- **Onze traversées scriptées** avec les dangers actifs, sans téléportation après le départ ni collecte forcée : neutre, les neuf simulations météo et vent inversé. Toutes collectent **20/20**, zéro mort, puis déclenchent la réussite par l'arche. Ce sont des contrôleurs connaissant leurs objectifs, pas des joueurs humains.
- Un **aller jusqu'à la cour puis retour au départ**, sans entrer dans l'arche : vingt fragments conservés et zéro mort. La réussite n'est pas attendue dans cette épreuve de réversibilité.
- Neuf diagnostics géométriques Jardin/Cathédrale/Château × pluie/vent/neige sans fragment inaccessible. Ces diagnostics téléportent et neutralisent les morts : ils ne remplacent pas les traversées ci-dessus.
- Planches de composition de huit vues par format : [1920×1080](screenshots/chateau-1920x1080.png), [1366×768](screenshots/chateau-1366x768.png), [844×390](screenshots/chateau-844x390.png). Positions imposées et physique arrêtée pour les captures ; météo simulée. Ne pas les présenter comme des parcours humains.
- Résultat reproductible et contrôles de clavier/isolation de l'accès direct : [chateau-qa.json](chateau-qa.json), via `tools/run-chateau-qa.cjs`. Les données témoins de compte sont fictives et tous les appels Supabase sont interceptés.
- Accès direct : **9/9 contrôles par format** (sauvegarde distincte, compte non chargé, déplacement/saut par événements clavier du navigateur, sélection de l'orage, inversion du vent, arche, redémarrage, données témoins intactes). Les appuis clavier sont espacés pour que Phaser consomme appui et relâchement sur des frames distinctes.
- Dernier passage de la recette : **aucune erreur JavaScript ou console, aucune ressource locale en erreur HTTP, aucune écriture cloud**. `git diff --check` et comparaison de l'avatar passent. Les planches des trois formats ont été inspectées ; la qualité architecturale et l'équilibrage restent à apprécier humainement.

### Points réservés au retour humain

Proportions et silhouettes des tours, lisibilité de l'épaisseur des passages, fréquence des motifs de pierre, qualité des raccords entre les cinq espaces, visibilité des appuis, intérêt du rythme et difficulté ressentie. Aucun test matériel, Safari ou Firefox, aucune validation humaine de l'équilibrage ou de la fidélité patrimoniale. Ne pas passer à Feydeau avant accord de l'utilisateur.

## Extension des douze niveaux — réalisation actuelle

La demande ultérieure de l'utilisateur remplace l'arrêt après Château : **réaliser les douze niveaux, puis retouches**. Les trois boss décrits dans la proposition ont reçu son accord explicite avant programmation. Tous les niveaux restent au statut **Prêt à tester**, jamais « Validé » sans son retour.

### Architecture technique et sources

- `tools/import-levels.cjs` compile les douze documents JSON strictement parsés dans `js/data/gzones.js`. Ce sont des données de conception, jamais des expressions exécutées. Les noms et empreintes des fichiers sources sont conservés ; les originaux joints restent inchangés.
- `js/data/GZoneLevels.js` adapte les conventions de coordonnées, références de contrôles, dimensions, sorties, couvertures, ordre et boss. Le Château n'est pas remplacé par un import littéral : son adaptation précédente est conservée.
- `js/systems/GZoneArt.js` compose matériaux, volumes, façades et couvertures à partir des planches existantes, en morceaux de 2048 px. Les graphismes complémentaires (coupole LU notamment) sont dessinés par code, pas téléchargés.
- `js/systems/GZoneRuntime.js` utilise des colliders exacts en pixels pour les coordonnées fractionnaires. Les objets de fond et supports décoratifs ne bloquent pas les couloirs ; les positions finales `_fin`/`_haut` sont des guides, pas des plateformes supplémentaires.
- `js/systems/LevelBoss.js` contient la machine à états commune et les motifs distincts des trois boss. Aucune attaque du héros ni barre de vie artificielle n'est ajoutée.
- Les définitions antérieures et Bouffay restent accessibles comme prototypes de référence ; aucun nouveau niveau au-delà des douze n'est créé. Pas d'atlas ou de récompense générative.

### Gameplay effectivement réalisé

- Appuis portés, plateformes mobiles horizontales/verticales/diagonales, transport réel, accroche sur leurs rebords et colonnes d'escalade.
- Bateaux à enfoncement progressif sous le poids, remontée à vide ; la neige limite cet enfoncement. Balcons à entraînement latéral accentué sous pluie.
- Parasols à rebond automatique ; à Graslin, rebond solaire plus haut, rebond pluvieux plus faible, premier rebond déneigeant avant le rebond normal.
- Engrenages à entraînement, bielles, jets temporisés avec avertissement visuel ; chariots au poids et ascenseur.
- Anneaux à trajectoire balistique, chaînes passant par les anneaux intermédiaires, alternances et flèches distinctes des couleurs. Le fragment central est collecté à l'activation réelle de l'anneau, pas après avoir été propulsé hors de sa cible.
- Conteneurs mobiles, portes avec passage bas de 12 px et boîtes accroupies de 10 px ; pas de porte-guillotine mortelle invisible.
- Dalles fragiles temporisées puis régénérées ; au Mémorial, solides/leurres et séquences de hauteurs, sans ennemi agressif. L'eau cyclique du couloir ralentit mais ne tue pas : métaphore, pas marée historique simulée.
- Courants ascendants avec gravité réduite et descente bornée séparément de la montée ; cinq courants de parcours LU et deux accès complémentaires aux lanternes du boss.

### Boss approuvés et implémentés

| Niveau | Apparence et lien au lieu | Motifs et accès | Victoire / reprise |
|---|---|---|---|
| 6 | Éléphant mécanique de la planche existante, passerelles et engrenages | Trois phases : jets, salves à différentes hauteurs, ondes et balayages ; refuges et accroupissement | Après chaque séquence, valve active sans limite de temps ; trois valves calment l'Éléphant |
| 9 | Moisissure fictive dessinée en pixels dans l'arène de stockage | Spores, contamination basse puis appuis contaminés ; conteneurs et accès d'entretien visibles vers les projecteurs | Trois lampes UV ; chaque phase conserve un objectif atteignable pendant une récupération sans limite |
| 12 | Vortex coloré sous une coupole LU stylisée | Quatre phases : bourrasques/ondes, jets, éclats, combinaison ; courants ascendants et plateformes des lanternes | Quatre lanternes dissipent le Vortex |

Les attaques ont un avertissement visuel d'au moins 800 ms, porté à 1200 ms dans la brume. Aucun flash blanc plein écran n'est nécessaire. Les graphismes respectent le mouvement réduit. Une mort recommence la phase en cours, pas les phases déjà résolues. Les objets activés constituent des points de reprise prédéfinis ; leur indice de phase est sauvegardé localement, jamais une coordonnée libre lue depuis le stockage. La neutralisation du boss ne termine pas seule le niveau : **image complète + boss neutralisé + arche**. K force seulement la collecte et ne contourne pas cette condition.

### Météo et sauvegardes

Les couvertures sont construites et visibles : nef, atelier, hangar, verrière, galerie du Mémorial et section intérieure LU, en plus des passages du Château. Les espaces ouverts restent exposés. Les auvents de l'ancien Jardin ne sont pas inventés dans son nouveau JSON. Les conditions communes (freinage, poussée, visibilité) et réactions spécifiques sont conservées sans implémenter chaque effet fantastique des textes sources.

Les résultats sont toujours associés à leurs identifiants de lieux. Le nouvel ordre Pommeraye/Mémorial permute seulement l'ancienne sélection d'indice 9/10, une fois, grâce au marqueur de route. Les anciennes reprises de parcours remplacés sont invalidées par révision ; résultats, avatar et paramètres restent conservés. Version de sauvegarde 1 ; champ optionnel de phase de boss borné ; aucune migration Supabase. Les temps cibles des nouveaux niveaux sont des références initiales, pas un équilibrage validé.

### Corrections issues des vérifications

- Suppression des contacts et vitesses effacés inutilement sur les plateformes statiques ; sur un transport mobile, vitesse du héros et contact au sol sont conservés. Le saut reste disponible après embarquement.
- La borne de vitesse descendante d'un courant ne limite plus le saut ascendant ; les rebonds ont priorité sur le saut tamponné de la même frame.
- Les impulsions d'anneau ne sont plus annulées immédiatement par l'accélération standard ; les chaînes utilisent leurs anneaux intermédiaires au lieu de sauter directement à leur destination finale.
- L'anneau `r12` de Buren et son fragment sont rapprochés d'une tuile (`176 → 175`) pour conserver une marge compatible avec le vrai corps 8×16. Ajustement explicite, source originale non réécrite.
- Les montants indiqués « fond » du Mémorial restent décoratifs ; pas de plateforme physique sur un support d'arrière-plan.
- Les rails et galeries sont répétés à largeur native sur toute la portée du collider, pas une petite image laissant un appui invisible.

### Vérifications récentes et limites

- Node : **52 contrôles** couvrant socle conservé et douze définitions actives, ordre, révisions et reprise de boss ; comparaison avatar 285/285.
- Recette Chrome contrôlée des douze niveaux, aux formats 1920×1080, 1366×768, 844×390 : [levels-qa.json](levels-qa.json), via `tools/run-levels-qa.cjs`. Chargement, collisions, saut depuis un appui, mouvements, neuf météos, couvertures, contrats de collecte/arche, phases et contact d'attaque des boss sont testés. Les tests de boss forcent leurs horloges et les positions des objectifs : **ils ne prouvent pas une victoire humaine ni une survie complète**.
- Diagnostic physique des fragments sous soleil : [levels-geometry.json](levels-geometry.json), via `tools/run-level-geometry.cjs`. Le contrôleur essaie plusieurs sauts et attentes sur appuis mobiles. Il téléporte, neutralise les morts et reconnaît l'activation des anneaux portant un fragment : **ce n'est pas une traversée connectée depuis le départ**.
- Dernier diagnostic solaire : **275/275 fragments**, aucune cible signalée inaccessible dans les douze niveaux, avec les limites ci-dessus. Ce résultat n'est pas une certification sous pluie, neige ou vent ni une observation humaine.
- Douze planches de cinq vues `docs/screenshots/level-<identifiant>.png`, positions imposées et physique arrêtée pour lire la composition ; pas des parcours humains.
- Les onze traversées complètes avec dangers du lot Château restent un résultat du Château, pas des onze autres niveaux. Aucune certification des douze parcours sous toutes les combinaisons météo. Aucun essai physique téléphone/manette, Safari ou Firefox ; aucune validation humaine d'architecture ou d'équilibrage.
- Contrôles supplémentaires sur l'horloge réelle de Chrome : contact d'attaque de l'Éléphant puis réapparition au départ avec phase conservée ; activations forcées des trois/trois/quatre objectifs et transitions réelles vers Résultat pour Machines/Hangar/Tour LU. Ces fixtures confirment les contrats, **pas** la capacité d'un humain à vaincre les boss.

### Accès et retouches

Serveur : `python3 -m http.server 8130 --bind 127.0.0.1`. Sélecteur : **http://127.0.0.1:8130/tools/levels.html**. N = météo, V = vent inversé, R = recommencer, K = collecte de diagnostic. Les sauvegardes de développement sont séparées par lieu. Les étapes normales se débloquent par les résultats ; la Tour LU affiche la complétion du parcours lorsque les douze lieux sont terminés, sans inventer une nouvelle récompense.

Attendre maintenant les retours sur les niveaux choisis par l'utilisateur. Priorités de relecture : proportions et raccords, architecture intérieure, portée/lisibilité des mécanismes, difficulté des boss et contextualisation patrimoniale. Aucun niveau n'est marqué « Validé » et aucune publication n'est effectuée automatiquement.
