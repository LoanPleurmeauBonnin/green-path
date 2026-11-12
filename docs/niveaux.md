> **Document de propositions, pas état d'implémentation.** Conservé comme matériau de conception. Les longueurs, ennemis, boss, effets météo, références historiques et affirmations de faisabilité ci-dessous ne sont pas des fonctionnalités ni des validations. Le code courant, les limites et l'ordre des lieux font foi dans GAME_DESIGN.md (document retiré du dépôt, voir l\'historique git) et AUDIT.md (document retiré du dépôt, voir l\'historique git). En particulier : aucun flash d'orage n'est livré ; Mémorial = étape 10, Pommeraye = étape 11 ; seuls Jardin, Cathédrale et Château sont accessibles. Les différences avec cette proposition restent à arbitrer par l'équipe.

## Niveau 1 — Jardin des Plantes — difficulté 1/12

1. **Intention** : Apprendre le déplacement de base (`←`/`→`), le saut court vs saut long, et l'accroupissement (`↓`) pour éviter des obstacles en hauteur. La sensation recherchée est celle d'une promenade bucolique, sécurisante et lumineuse à la sortie de la gare, où le joueur prend ses marques sans pression.
2. **Fiche chiffrée** :
* **Longueur** : 140 tuiles
* **Hauteur** : 17 tuiles (sol de référence à `y=15`)
* **Temps de référence** : 60 s
* **Nombre de pixels à collecter** : 15
* **Nombre de checkpoints** : 2 (`lanterne_eteinte` → `lanterne_allumee`)
* **Nombre d'obstacles mortels** : 6


3. **Découpage en zones** :
* **Zone 1 (x=0 à 28) — Sortie de Gare & Entrée du Parc** : Départ devant `gare_batiment` (`x=3, y=14`). Sol plat continu pour tester la marche et le premier saut par-dessus un massif inoffensif. Panneau (`panneau_saut` à `x=12, y=14`) : *« Saute par-dessus les buissons et ramasse les pixels envolés ! »*
* *Plateformes* : `pave_haut_1` (`x=0, y=15, L=14`), `pelouse_haut` (`x=14, y=15, L=14`), `banc_parc` (`x=18, y=14, L=2`, plateforme traversable par le bas).
* *Obstacles* : Aucun obstacle mortel (un simple `buisson_a` bloquant mais non mortel à `x=15, y=14` pour forcer un saut de 1 tuile de haut).
* *Ennemis* : Aucun.
* *Pixels (3)* : `(10,14)` [facile], `(19,12)` [facile, au-dessus du banc], `(25,14)` [facile].
* *Checkpoint* : Aucun.


* **Zone 2 (x=28 à 56) — Les Allées Fleuries** : Premiers petits fossés (largeur 2 tuiles max) et premiers ronces mortelles au sol, bien entourées de fleurs pour attirer l'œil.
* *Plateformes* : `pelouse_haut` (`x=28, y=15, L=10`), vide de 2 tuiles, `pelouse_haut` (`x=40, y=15, L=16`), `rebord_herbe_g/m/d` (`x=33, y=13, L=3`), `rebord_herbe_g/m/d` (`x=46, y=12, L=4`).
* *Obstacles* : `ronces_1` (`x=34, y=14`), `ronces_2` (`x=48, y=14`).
* *Ennemis* : Aucun.
* *Pixels (3)* : `(34,11)` [facile, sur le rebord au-dessus de la ronce], `(39,13)` [facile, dans l'arc du saut au-dessus du fossé], `(48,10)` [risqué, sur la plateforme haute au-dessus de la ronce].
* *Checkpoint* : `lanterne_eteinte` à `x=54, y=14`.


* **Zone 3 (x=56 à 86) — Les Bassins à Jets d'Eau** : Traversée d'un grand bassin (`bassin_surface`) sur des pontons de bois, rythmé par des jets d'eau verticaux (`jet_eau`) et l'introduction du mouvement accroupi (`↓`) sous une branche basse / topiaire.
* *Plateformes* : `pelouse_haut` (`x=56, y=15, L=6`), `bassin_surface` (décor non solide à `x=62..80, y=16`), `pont_planches_g/m/d` (`x=63, y=14, L=4`), `pont_planches_g/m/d` (`x=70, y=14, L=4`), `pont_planches_g/m/d` (`x=77, y=14, L=3`), `pelouse_haut` (`x=81, y=15, L=5`), `haie_taillee` en arche basse (`x=82, y=13, L=3`, laisse 1 seule tuile de haut à `y=14`, obligeant à s'accroupir).
* *Obstacles* : `jet_eau` (`x=68, y=15`, monte jusqu'à `y=12` toutes les 3 s pendant 1 s — mortel ou repoussant), `jet_eau` (`x=75, y=15`, idem en décalé).
* *Ennemis* : `oiseau` (`x=81` à `x=85`, `y=13`, vitesse 3 tuiles/s, vole horizontalement à hauteur de tête : touché si debout, esquivé si accroupi `↓`).
* *Pixels (3)* : `(65,12)` [facile], `(68,11)` [risqué, au sommet du jet d'eau quand il est éteint], `(83,14)` [caché/pédagogique, sous l'arche de haie en s'accroupissant].
* *Checkpoint* : Aucun.


* **Zone 4 (x=86 à 116) — Le Palmarium et les Topiaires** : Ascension légère sur les toits arrondis des serres (`palmarium_serre`) et des sculptures végétales (`topiaire_tete_endormie`, `topiaire_oiseau`). Pic du niveau combinant saut de 3 tuiles et esquive accroupie.
* *Plateformes* : `pelouse_haut` (`x=86, y=15, L=8`), `topiaire_tete_endormie` (`x=91, y=13, L=3`), `palmarium_serre` (`x=96, y=11, L=6`), `palmarium_serre` (`x=104, y=10, L=5`), `topiaire_oiseau` (`x=111, y=12, L=3`), `pelouse_haut` (`x=114, y=15, L=2`).
* *Obstacles* : `ronces_1` (`x=95, y=14`), `ronces_2` (`x=96, y=14`), `pointes_fer_1` (`x=103, y=14`), `ronces_1` (`x=110, y=14`).
* *Ennemis* : `oiseau` (`x=96` à `x=102`, `y=9`, vitesse 3,5 tuiles/s, rase le toit du premier Palmarium : oblige à s'accroupir au milieu du toit avant de sauter vers le suivant).
* *Pixels (4)* : `(92,11)` [facile], `(99,9)` [risqué, sur la trajectoire de l'oiseau], `(106,8)` [facile], `(98,14)` [caché, au sol sous le Palmarium entre deux ronces, accessible en tombant doucement depuis `x=94`].
* *Checkpoint* : `lanterne_eteinte` à `x=115, y=14`.


* **Zone 5 (x=116 à 140) — Le Grand Marronnier & Arche Finale** : Descente apaisée à travers des paliers fleuris jusqu'au monument du Jardin.
* *Plateformes* : `pelouse_haut` (`x=116, y=15, L=24`), `rebord_herbe_g/m/d` (`x=120, y=13, L=4`), `rebord_herbe_g/m/d` (`x=126, y=11, L=4`).
* *Obstacles* : Aucun.
* *Ennemis* : `papillon` (ambiance/inoffensif autour de `x=125, y=10`).
* *Pixels (2)* : `(122,11)` [facile], `(128,9)` [facile].
* *Arrivée* : `monument_jardin` à `x=133, y=12` et `arche_arrivee` à `x=136, y=13`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (découverte pure sans danger mortel), fin de Zone 3 autour du checkpoint 1 (`x=54`), et toute la Zone 5 (récompense visuelle et cueillette des 2 derniers pixels sans piège).
* **Pic de difficulté** : Zone 4 (`x=96 à 109`), sur le toit du `palmarium_serre`, où le joueur doit enchaîner un saut de 2 tuiles de haut, s'accroupir (`↓`) pour laisser passer l'oiseau en rase-mottes, puis sauter par-dessus un vide de 2 tuiles vers la serre suivante.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=81 à 85`)** : Un panneau `fleches_bas` est placé devant une `haie_taillee` basse et un `oiseau` qui vole à `y=13` au-dessus d'un sol totalement plat et sans ronces. Même si le joueur hésite, il a toute la place de reculer, observer la hauteur de vol de l'oiseau, maintenir `↓` pour passer sous la haie et voir l'oiseau passer au-dessus de sa tête sans le toucher.
* **Test (`x=96 à 102`)** : Sur le toit du Palmarium, l'oiseau arrive pendant une phase de plateforme en hauteur. Le joueur doit appliquer le réflexe d'accroupissement sur une surface réduite (6 tuiles de large) avant de repartir.


6. **Météo → gameplay** (Niveau 1 : effets doux, jamais bloquants) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Friction au sol `×0,85` (léger patinage de 0,3 tuile à l'arrêt) ; `jet_eau` monte +0,5 tuile plus haut (`y=11,5`). | Glissade accroupie (`↓` en courant) couvre 1,5 tuile sous la haie de la Zone 3. | Freinage légèrement moins sec sur les pontons de la Zone 3. | Rideau de `goutte_pluie`, `ciel_gris`, bruit de pluie douce sur le feuillage. | Les pontons font 3 à 4 tuiles de large ; 0,3 tuile de glisse laisse plus de 3 tuiles de marge. |
| **Soleil** | Vitesse de marche `×1,05` (7,2 tuiles/s) ; des `papillon` dorés tournent autour des pixels cachés. | Sauts horizontaux un peu plus amples et repérage immédiat du pixel caché `(98,14)`. | Les `oiseau` volent 10 % plus vite (`3,3` et `3,8` tuiles/s). | `ciel_jour` éclatant, `soleil` haut, chant d'oiseaux et bourdonnement d'abeilles. | S'accroupir annule totalement la hitbox haute : la vitesse de l'oiseau ne change pas la sécurité de la posture accroupie. |
| **Neige** | Friction sur `pont_planches` et `palmarium_serre` `×0,75` ; les `jet_eau` sont gelés (deviennent des plateformes solides fixes de 2 tuiles de haut). | La Zone 3 devient beaucoup plus simple : on peut marcher sur les jets d'eau gelés ! | Le toit en verre du Palmarium (Zone 4) glisse légèrement. | `flocon` qui tombent lentement, `ciel_nuageux` blanc, sons feutrés et craquement sous les pas. | Le toit du Palmarium fait 6 tuiles de large et l'oiseau s'esquive sur place avec `↓` sans bouger. |
| **Brume** | Visibilité nette à 10 tuiles autour du joueur (bandes de `brume_bande_tile_x` semi-transparentes au-delà, opacité 50 %). | Les `oiseau` sont ralentis (`×0,8`, soit 2,4 tuiles/s) car ils volent prudemment. | Moins d'anticipation visuelle sur la serre suivante en Zone 4. | Nappes de `brume_bande_tile_x` au ras des bassins, sifflement lointain du tramway. | Aucun saut du niveau ne dépasse 3 tuiles de long ; à 10 tuiles de visibilité, la plateforme d'arrivée est toujours 100 % visible. |
| **Vent** | Vent léger de dos (vers la droite) de `+0,4 tuile/s` en l'air par rafales de 3 s toutes les 6 s. | Facilite tous les sauts vers la droite (Zones 2, 3 et 4). | Sauter vers la gauche (pour récupérer le pixel caché sous la serre) demande de sauter pendant l'accalmie. | `touffe_herbe` et feuilles qui penchent à droite, souffle doux dans les arbres. | Même à contre-vent, un saut de 2 tuiles passe largement (portée réduite à 3,4 tuiles contre 2 requises). |
| **Orage** | Éclair toutes les 8 s : `ciel_orage` s'illumine 0,5 s, puis coup de tonnerre qui fait s'envoler les `oiseau` 1 tuile plus haut pendant 2 s. | Pendant 2 s après l'éclair, les oiseaux passent trop haut pour toucher le joueur même debout. | Ambiance plus sombre (`ciel_orage`) et jets d'eau actifs 1,2 s au lieu de 1 s. | Flash blanc, grondement sourd 1 s après, `lanterne_allumee` qui brille fort. | Aucun effet létal ajouté ; l'éclair aide même à passer la Zone 4 sans s'accroupir. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `rebord_herbe_g`, `rebord_herbe_m`, `rebord_herbe_d`, `pont_planches_g`, `pont_planches_m`, `pont_planches_d`, `ronces_1`, `ronces_2`, `pointes_fer_1`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`, `buisson_a`, `fleur_rouge`, `fleur_jaune`, `touffe_herbe`.
* *Jardin* : `pave_haut_1`, `gare_batiment`, `tram_arret`, `pin_parasol`, `bassin_surface`, `jet_eau`, `massif_fleurs_a`, `haie_taillee`, `pelouse_haut`, `banc_parc`, `lampadaire_parc`, `topiaire_tete_endormie`, `topiaire_oiseau`, `palmarium_serre`, `palmarium_silhouette`, `monument_jardin`, `arbre_marronnier`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_nuageux`, `ciel_orage`, `soleil`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `papillon`, `panneau_saut`, `fleches_bas`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun (défi environnemental uniquement).
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 5)** : La silhouette verte géante du *Dodo / Topiaire Oiseau* (œuvre de Claude Ponti) au premier plan, immédiatement identifiable.
* **2e détail (pixels 6 à 10)** : La coupole vitrée blanche du *Palmarium* juste derrière.
* **3e détail (pixels 11 à 15)** : Les allées fleuries, les bassins et le feuillage des grands magnolias et marronniers en arrière-plan.



---

## Niveau 2 — Cathédrale Saint-Pierre-et-Saint-Paul — difficulté 2/12

1. **Intention** : Introduire l'accroche aux rebords (`↑` près d'un rebord pour se hisser) et la verticalité, permettant d'atteindre des corniches situées à 3,5 tuiles de haut (inaccessibles par un simple saut de 3 tuiles). La sensation recherchée est l'élévation solennelle et vertigineuse, du sol froid de la nef jusqu'à la lumière colorée des vitraux et de la rosace.
2. **Fiche chiffrée** :
* **Longueur** : 150 tuiles
* **Hauteur** : 24 tuiles (sol de la nef à `y=22`, sommet vers `y=4`)
* **Temps de référence** : 75 s
* **Nombre de pixels à collecter** : 18
* **Nombre de checkpoints** : 2
* **Nombre d'obstacles mortels** : 9


3. **Découpage en zones** :
* **Zone 1 (x=0 à 30) — Le Parvis et le Portail Gothique** : Départ sur le parvis devant `arc_brise_porte`. Les marches sont trop hautes pour un saut standard (3,5 tuiles) : le joueur découvre qu'il doit maintenir `↑` au sommet de son saut pour s'agripper à la corniche et grimper.
* *Plateformes* : `pierre_haut` (`x=0, y=22, L=18`), socle haut `pierre_blanche_pleine_1` (`x=18, y=18.5, L=12` — soit 3,5 tuiles plus haut, franchissable uniquement via accroche `↑`), `corniche_g/m/d` (`x=24, y=15, L=5`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (3)* : `(12,21)` [facile], `(18,17)` [facile, posé juste sur le rebord d'accroche], `(26,13)` [facile, sur la première corniche].
* *Checkpoint* : Aucun.


* **Zone 2 (x=30 à 62) — La Grande Nef et ses Colonnes** : Progression à mi-hauteur de pilier en pilier (`colonne_chapiteau`) au-dessus des dalles de la nef. Tomber au sol à `y=22` n'est pas mortel au début (une échelle de corniches permet de remonter), puis des `cierge_flamme` apparaissent en bas.
* *Plateformes* : `dalle_nef` (`x=30, y=22, L=32`), `colonne_chapiteau` (`x=33, y=15, L=3`), `colonne_chapiteau` (`x=39, y=13, L=3`), `galerie_balustrade` (`x=45, y=13, L=6`), `corniche_g/m/d` (`x=54, y=10, L=6`), paliers de secours à `x=31, y=18.5, L=2`.
* *Obstacles* : `cierge_flamme` (`x=42, y=21`), `cierge_flamme` (`x=48, y=21`), `pointes_pierre_1` (`x=53, y=21`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(34,13)` [facile], `(40,11)` [facile], `(45,20)` [risqué, en bas entre les deux cierges, oblige à redescendre puis remonter par les corniches], `(57,8)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=58, y=9`.


* **Zone 3 (x=62 à 92) — La Galerie des Vitraux** : Le joueur longe d'immenses `vitrail_haut_1-2` traversés par des faisceaux de lumière diagonaux (`rayon_vitrail`). Des chauves-souris / oiseaux de pierre patrouillent et quelques dalles de corniche s'effritent 1 s après qu'on y pose le pied.
* *Plateformes* : `galerie_balustrade` (`x=62, y=10, L=8`), `corniche_g/m/d` (`x=73, y=9, L=3`), `corniche_g/m/d` (`x=79, y=7, L=3`), `galerie_balustrade` (`x=85, y=7, L=7`), `corniche_g/m/d` haute secrète (`x=78, y=4, L=4`).
* *Obstacles* : `pointes_pierre_2` en contrebas sur une poutre (`x=70..84, y=14`), `cierge_flamme` (`x=88, y=6`).
* *Ennemis* : `oiseau` (pigeon des tours, `x=71` à `x=78`, `y=8`, vitesse 3 tuiles/s).
* *Pixels (4)* : `(66,8)` [facile], `(74,7)` [risqué, à saisir avant que l'oiseau ne revienne], `(80,3)` [caché, en s'accrochant à la corniche supérieure à `y=4`], `(88,4)` [risqué, saut au-dessus du cierge].
* *Checkpoint* : Aucun.


* **Zone 4 (x=92 à 124) — Les Arcs-Boutants Extérieurs & Gargouilles** : Sortie sur les toits de la cathédrale. Le joueur grimpe le long des `arc_boutant` et `contrefort` en utilisant l'accroche (`↑`) tout en évitant les gouttes d'eau/plomb crachées périodiquement par chaque `gargouille`.
* *Plateformes* : `arc_boutant` (`x=92, y=8, L=5`), `contrefort` (`x=99, y=5, L=3`, accroche `↑` requise), `arc_boutant` (`x=105, y=7, L=5`), `pinacle` (`x=112, y=5, L=2`), `corniche_g/m/d` (`x=117, y=4, L=7`).
* *Obstacles* : `gargouille` à `x=98, y=5` (crache un jet horizontal `goutte_pluie` sur 3 tuiles vers la gauche toutes les 2,5 s), `gargouille` à `x=111, y=5` (idem), `pointes_pierre_1` (`x=96, y=12`), `pointes_pierre_2` (`x=109, y=12`).
* *Ennemis* : `oiseau` (`x=104` à `x=110`, `y=5`, vitesse 3,5 tuiles/s).
* *Pixels (4)* : `(95,6)` [facile], `(100,3)` [risqué, juste au-dessus de la gargouille], `(107,5)` [facile], `(113,3)` [risqué, au sommet du pinacle].
* *Checkpoint* : `lanterne_eteinte` à `x=122, y=3`.


* **Zone 5 (x=124 à 150) — La Grande Rosace & Le Clocheton** : Couronnement lumineux devant la `rosace` monumentale, avant de rejoindre l'arche sur la terrasse de la tour.
* *Plateformes* : `tour_facade` (`x=124, y=6, L=26`), `corniche_g/m/d` (`x=130, y=4, L=6` devant la `rosace`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (3)* : `(131,2)` [facile], `(133,2)` [facile], `(135,2)` [facile, en arc de cercle devant la rosace].
* *Arrivée* : `monument_cathedrale` à `x=142, y=3` et `arche_arrivee` à `x=146, y=4`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (parvis sans aucun abîme ni piège), début de Zone 3 après le checkpoint (`x=58..68`), et Zone 5 devant la rosace.
* **Pic de difficulté** : Zone 4 (`x=97 à 115`), où le joueur doit chronométrer son accroche (`↑`) sur le `contrefort` entre deux crachats de `gargouille`, puis sauter sur un `pinacle` étroit de 2 tuiles.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=16 à 20`)** : Un mur de `pierre_blanche_pleine_1` de 3,5 tuiles de haut barre toute la route. Aucun ennemi, aucun trou. Un panneau `fleches_haut` indique : *« Maintiens ↑ près d'un rebord en l'air pour t'y accrocher et grimper ! »*. Le joueur peut sauter autant de fois qu'il veut jusqu'à réussir la manipulation.
* **Test (`x=33 à 42`)** : Enchaînement de deux `colonne_chapiteau` en hauteur où la dernière corniche (`x=54, y=10`) exige une accroche au-dessus du vide.


6. **Météo → gameplay** (Niveau 2 : effets doux, jamais bloquants) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | En Zone 4 (extérieure), les `gargouille` crachent toutes les 2 s au lieu de 2,5 s ; en intérieur (Zones 2–3), aucun effet de glisse. | L'eau des gargouilles éteint le `cierge_flamme` de `x=88` (1 obstacle mortel en moins). | Fenêtre d'accroche réduite de 2,5 s à 2 s sur les deux gargouilles de la Zone 4. | Pluie visible derrière les fenêtres en ogive, crépitement sur les vitraux, gargouilles actives. | Monter un rebord avec `↑` prend 0,4 s ; une fenêtre de 2 s laisse 1,6 s de marge. |
| **Soleil** | Les `rayon_vitrail` en Zones 2 et 3 sont solides/porteurs : y sauter donne un rebond vertical doux de `+0,5 tuile`. | Permet d'atteindre la corniche secrète `(80,3)` d'un seul bond sans même s'accrocher. | Les `cierge_flamme` brillent plus fort (+20 % de hauteur de flamme, soit 1,2 tuile). | Faisceaux `rayon_vitrail` multicolores intenses, chœurs d'orgue lumineux en fond. | Les cierges au sol s'évitent par les colonnes hautes ; celui de `x=88` laisse 1,8 tuile de marge en saut normal (3 tuiles). |
| **Neige** | Les corniches extérieures (Zone 4) ont une friction `×0,8` ; l'accroche (`↑`) prend 0,5 s au lieu de 0,4 s (mains froides). | Les `gargouille` ont un glaçon : leur jet ne porte plus qu'à 1,5 tuile au lieu de 3. | Léger patinage à la réception sur les `arc_boutant` de la Zone 4. | Flocons en Zone 1 et 4, buée près des cierges, son de cloches cristallines. | Les `arc_boutant` font 5 tuiles de large, absorbant largement la glisse de 0,4 tuile. |
| **Brume** | Le fond de la nef (en bas à `y=20..22`) est noyé dans `brume_bande_tile_x` ; visibilité réduite à 9 tuiles en Zone 4. | Les `oiseau` des tours restent perchés la moitié du temps (pause de 2 s à chaque bout de ronde). | On distingue moins bien les cierges tout en bas de la nef si l'on cherche le pixel `(45,20)`. | Encens/brume dans la nef, halo autour des `lanterne_allumee`, écho caverneux. | Le chemin principal est en hauteur (hors brume épaisse) et chaque saut fait 3 tuiles max. |
| **Vent** | En Zone 4 (toits), vent latéral de `-0,3 tuile/s` (face au joueur) avec accalmie de 3 s toutes les 5 s. En intérieur (Zones 2–3), abrité (effet `×0`). | L'accroche `↑` verrouille immédiatement la position du joueur contre le mur, annulant le vent. | Saut entre `arc_boutant` et `pinacle` (`x=110..112`) un peu plus court (portée max 3,5 tuiles au lieu de 4). | Sifflement aigu dans les clochetons, bannières/poussières qui volent. | L'écart max en Zone 4 est de 2 tuiles (`x=110` à `112`), très inférieur aux 3,5 tuiles disponibles. |
| **Orage** | Éclair toutes les 7 s illuminant les `vitrail_haut_1-2` : pendant 1,5 s après l'éclair, tous les pixels du niveau scintillent à travers les murs. | Révèle instantanément le pixel caché `(80,3)` et le timing des gargouilles en silhouette. | Le souffle du tonnerre fait vaciller les `cierge_flamme` horizontalement sur 0,5 tuile. | Flash à travers la `rosace` et les vitraux, orgue dramatique + tonnerre. | Les cierges ne sont pas sur la route haute principale, et leur oscillation laisse 2,5 tuiles d'espace libre. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Cathédrale* : `pierre_blanche_pleine_1`, `pierre_haut`, `dalle_nef`, `colonne_fut`, `colonne_base`, `colonne_chapiteau`, `corniche_g`, `corniche_m`, `corniche_d`, `galerie_balustrade`, `arc_brise_porte`, `arc_brise_fenetre`, `vitrail_haut_1`, `vitrail_haut_2`, `rosace`, `contrefort`, `arc_boutant`, `pinacle`, `gargouille`, `clocheton`, `statue_niche`, `tour_facade`, `nef_fond_tile_x`, `pointes_pierre_1`, `pointes_pierre_2`, `cierge_flamme`, `rayon_vitrail`, `monument_cathedrale`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `fleches_haut`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 6)** : La grande *Rosace centrale* en façade et le portail gothique à triple arc brisé.
* **2e détail (pixels 7 à 12)** : Les deux *Tours carrées symétriques* de la façade blanche.
* **3e détail (pixels 13 à 18)** : Les *Arcs-boutants*, les pinacles finement sculptés et la haute voûte de la nef.



---

## Niveau 3 — Château des Ducs de Bretagne — difficulté 3/12

1. **Intention** : Introduire les plateformes à cycle rythmique (`pont_levis` qui s'abaisse/se relève et `herse` qui monte/descend), demandant au joueur d'observer un tempo avant de s'engager. La sensation recherchée est l'assaut agile d'une forteresse médiévale : franchir les douves, courir sur les chemins de ronde crénelés et se faufiler sous les herses jusqu'au Grand Logis.
2. **Fiche chiffrée** :
* **Longueur** : 170 tuiles
* **Hauteur** : 20 tuiles (niveau de l'eau des douves à `y=18`, cour du château à `y=15`, remparts à `y=9`)
* **Temps de référence** : 80 s
* **Nombre de pixels à collecter** : 20
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 11


3. **Découpage en zones** :
* **Zone 1 (x=0 à 34) — Les Douves et le Premier Pont-Levis** : Approche face aux tours rondes (`tour_ronde_pied/milieu/haut`). Un premier petit pont-levis au-dessus d'une rigole peu profonde (non mortelle) montre comment le tablier s'abaisse pendant 3 s puis se relève pendant 2 s, suivi du vrai `pont_levis` au-dessus de `douve_surface` (mortelle).
* *Plateformes* : `sol_pave_chateau` (`x=0, y=15, L=12`), fosse sèche `sol_pave_chateau` (`x=12, y=17, L=4`, non mortelle pour le tutoriel), `pont_levis` #1 (`x=12, y=15, L=4`), `sol_pave_chateau` (`x=16, y=15, L=6`), `pont_levis` #2 (`x=22, y=15, L=4`), `sol_pave_chateau` (`x=26, y=15, L=8`).
* *Obstacles* : `douve_surface` (`x=22..25, y=18`, mortelle en cas de chute quand le pont #2 est levé).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(8,14)` [facile], `(14,13)` [facile, au-dessus du pont #1], `(24,12)` [risqué, à prendre quand le pont #2 commence à se relever pour gagner 1 tuile de hauteur], `(30,14)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=32, y=14`.


* **Zone 2 (x=34 à 70) — Le Châtelet d'Entrée et les Herses** : Entrée sous `porte_cintree` gardée par des `herse` verticales qui descendent jusqu'au sol toutes les 3 s (restent en bas 1 s, remontent 2 s, en laissant d'abord 1 tuile libre en bas où l'on peut passer accroupi `↓`).
* *Plateformes* : `sol_pave_chateau` (`x=34, y=15, L=36`), `caisse` (`x=44, y=14, L=2`), `planche_echafaudage_g/m/d` (`x=52, y=12, L=5`), `corniche_pierre_g/m/d` (`x=60, y=10, L=5`).
* *Obstacles* : `herse` #1 (`x=40, y=12..15`), `herse` #2 (`x=50, y=12..15`), `pointes_fer_1` (`x=56, y=14`), `herse` #3 (`x=66, y=12..15`).
* *Ennemis* : `tonneau` roulant (`x=64` vers `x=45`, `y=14`, vitesse 3,5 tuiles/s, apparaît toutes les 4 s et se brise contre la caisse en `x=45` : le joueur saute par-dessus ou grimpe sur l'échafaudage).
* *Pixels (4)* : `(40,14)` [facile, sous la herse #1], `(54,10)` [facile, sur l'échafaudage], `(62,8)` [caché, sur la corniche haute au-dessus du passage des tonneaux], `(66,14)` [risqué, sous la herse #3].
* *Checkpoint* : `lanterne_eteinte` à `x=69, y=14`.


* **Zone 3 (x=70 à 106) — L'Ascension des Échafaudages de Tuffeau** : Dans la cour intérieure, des travaux de restauration (`barriere_chantier`, `planche_echafaudage_g/m/d`) permettent de grimper le long des murs de tuffeau (`mur_tuffeau_plein_1-3`) en combinant saut et accroche (`↑`) jusqu'au chemin de ronde.
* *Plateformes* : `sol_pave_chateau` (`x=70, y=15, L=12`), `escalier_pierre_g/d` (`x=75, y=13, L=4`), `planche_echafaudage_g/m/d` (`x=81, y=11, L=4`), `corniche_pierre_g/m/d` (`x=88, y=9, L=4`), `planche_echafaudage_g/m/d` (`x=95, y=11, L=4`), `mur_tuffeau_haut_creneaux_a` (`x=101, y=9, L=5`).
* *Obstacles* : `douve_surface` intérieure (`x=82..100, y=18`), `torche_murale` ardente (`x=89, y=8` — blesse au contact), `pointes_fer_2` (`x=97, y=10`, sur 1 tuile au milieu de l'échafaudage).
* *Ennemis* : `oiseau` (`x=84` à `x=94`, `y=8`, vitesse 3,5 tuiles/s).
* *Pixels (4)* : `(77,11)` [facile], `(83,9)` [facile], `(90,6)` [risqué, saut par-dessus la torche murale], `(97,8)` [risqué, saut par-dessus les pointes d'échafaudage].
* *Checkpoint* : `lanterne_eteinte` à `x=104, y=8`.


* **Zone 4 (x=106 à 142) — Le Chemin de Ronde Crénelé** : Course en hauteur sur les remparts (`mur_tuffeau_haut_creneaux_a-b`) coupés par deux `pont_levis` suspendus et une `herse` de courtine, avec des `tonneau` qui dévalent les créneaux.
* *Plateformes* : `mur_tuffeau_haut_creneaux_a` (`x=106, y=9, L=8`), `pont_levis` #3 (`x=114, y=9, L=3`), `mur_tuffeau_haut_creneaux_b` (`x=117, y=9, L=9`), `pont_levis` #4 (`x=126, y=9, L=3`), `mur_tuffeau_haut_creneaux_a` (`x=129, y=9, L=13`), `corniche_pierre_g/m/d` (`x=120, y=6, L=4`).
* *Obstacles* : `douve_surface` tout en bas (`x=106..142, y=18`), `herse` #4 (`x=121, y=6..9`), `torche_murale` (`x=134, y=8`).
* *Ennemis* : `tonneau` (`x=140` vers `x=129`, `y=8`, vitesse 4 tuiles/s, tombe dans le vide à `x=129`).
* *Pixels (5)* : `(115,7)` [risqué, au-dessus du pont-levis #3], `(122,4)` [caché, sur la corniche au-dessus de la herse #4], `(127,7)` [risqué, pont-levis #4], `(134,6)` [risqué, au-dessus de la torche et des tonneaux], `(139,8)` [facile].
* *Checkpoint* : Aucun.


* **Zone 5 (x=142 à 170) — La Cour du Grand Logis** : Descente par un grand escalier d'honneur devant la façade Renaissance blanche du `grand_logis` orné de `banniere_hermine`.
* *Plateformes* : `escalier_pierre_g/d` (`x=142, y=11, L=6`), `sol_pave_chateau` (`x=148, y=13, L=22`), `corniche_pierre_g/m/d` (`x=154, y=10, L=5`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (3)* : `(145,9)` [facile], `(156,8)` [facile], `(161,12)` [facile].
* *Arrivée* : `monument_chateau` à `x=163, y=10` et `arche_arrivee` à `x=167, y=11`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Début de Zone 1 (`x=0..16`, fosse sèche sans danger), paliers des checkpoints 2 (`x=69`) et 3 (`x=104`), et toute la Zone 5 devant le Grand Logis.
* **Pic de difficulté** : Zone 4 (`x=114 à 138`), où le joueur doit enchaîner deux ponts-levis suspendus, passer une herse, puis sauter par-dessus une torche et un tonneau roulant sur le chemin de ronde.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=12 à 16`)** : Le `pont_levis` #1 enjambe une fosse sèche de 2 tuiles de profondeur avec un escalier pour remonter. Si le joueur avance quand le pont se relève, il tombe simplement dans la fosse sans mourir et comprend le rythme (3 s ouvert / 2 s fermé + cliquetis de chaînes 0,5 s avant de bouger).
* **Test (`x=22 à 26` puis `Zone 4`)** : Le `pont_levis` #2 surplombe les vraies douves mortelles, puis la Zone 4 combine le timing du pont-levis avec celui d'une herse.


6. **Météo → gameplay** (Niveau 3 : effets doux, jamais bloquants) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Les `planche_echafaudage` glissent légèrement (friction `×0,8`) ; les `torche_murale` sont éteintes par la pluie ! | 2 obstacles mortels supprimés (`torche_murale` en Zones 3 et 4 deviennent inoffensives). | Réception un peu glissante sur les échafaudages de la Zone 3. | `goutte_pluie`, `ciel_gris`, clapotis dans la `douve_surface` et fumée sur les torches éteintes. | Les échafaudages font 4 à 5 tuiles de large, offrant plus de 3 tuiles de marge d'arrêt. |
| **Soleil** | Les chaînes des `pont_levis` sont sèches : ils restent abaissés 3,5 s au lieu de 3 s. | Fenêtre de passage plus généreuse sur les 4 ponts-levis du niveau. | Les `tonneau` roulent sur pavé sec un peu plus vite (`×1,1`, soit 3,8 et 4,4 tuiles/s). | `ciel_chateau_1` lumineux, reflets sur le tuffeau blanc, trompettes lointaines. | Les tonneaux restent esquivables par un saut standard de 2,5 tuiles de haut ou via l'échafaudage. |
| **Neige** | La `douve_surface` en Zone 1 (`x=22..25`) est partiellement gelée (1 bloc de glace flottant au milieu à `x=23, y=18`). | Si le joueur rate le pont-levis #2 en Zone 1, il peut rebondir sur le bloc de glace au lieu de mourir. | Le `mur_tuffeau_haut_creneaux` en Zone 4 a une friction `×0,75`. | `flocon`, neige sur les créneaux et les bannières, son étouffé des chaînes. | Le chemin de ronde en Zone 4 a des sections de 8 à 13 tuiles de long entre les ponts. |
| **Brume** | Nappe de `brume_bande_tile_x` au-dessus des douves et visibilité à 10 tuiles autour du joueur. | Les `herse` rouillées par l'humidité descendent 20 % moins vite (plus facile de glisser dessous avec `↓`). | On voit les `tonneau` de la Zone 4 à 10 tuiles (soit 2,5 s avant impact au lieu de 3,5 s). | Brume sortant des douves, lueur orange des `torche_murale` dans le brouillard. | 2,5 s de préavis suffisent largement pour un saut qui prend 0,6 s. |
| **Vent** | Vent d'ouest poussant vers la droite (`+0,5 tuile/s` en l'air) ; fait claquer les `banniere_hermine`. | Ralentit les `tonneau` qui roulent vers la gauche (`×0,8`, soit 2,8 et 3,2 tuiles/s) ! | Pousse légèrement le joueur vers les herses s'il saute trop près d'elles. | `banniere_hermine` horizontales, souffle dans les meurtrières. | On passe les herses au sol (en marchant ou accroupi), où le vent aérien n'a aucun impact. |
| **Orage** | Éclair toutes les 8 s : l'électricité bloque magnétiquement les `herse` en position haute pendant 2 s après chaque éclair. | Permet de franchir n'importe quelle herse sans risque juste après un coup de tonnerre. | L'onde de choc du tonnerre fait trembler les `pont_levis` 0,3 s avant qu'ils ne se relèvent. | `ciel_orage`, éclairs derrière les `tour_ronde_haut`, tonnerre + cliquetis métallique. | Le tremblement de 0,3 s sert même d'indicateur visuel supplémentaire avant la fermeture du pont. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `pointes_fer_1`, `pointes_fer_2`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Château* : `mur_tuffeau_plein_1`, `mur_tuffeau_plein_2`, `mur_tuffeau_plein_3`, `mur_tuffeau_haut_creneaux_a`, `mur_tuffeau_haut_creneaux_b`, `sol_pave_chateau`, `escalier_pierre_g`, `escalier_pierre_d`, `corniche_pierre_g`, `corniche_pierre_m`, `corniche_pierre_d`, `planche_echafaudage_g`, `planche_echafaudage_m`, `planche_echafaudage_d`, `tour_ronde_haut`, `tour_ronde_milieu`, `tour_ronde_pied`, `douve_surface`, `douve_profonde`, `bord_douve`, `pont_levis`, `herse`, `porte_cintree`, `meurtriere`, `torche_murale`, `banniere_hermine`, `blason_simple`, `tonneau`, `caisse`, `barriere_chantier`, `chateau_silhouette_tile_x`, `ciel_chateau_1`, `grand_logis`, `monument_chateau`.
* *Ciel & Signes* : `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 7)** : Les deux grosses *Tours rondes du Châtelet d'entrée* et le *Pont-levis* au-dessus des douves.
* **2e détail (pixels 8 à 14)** : La façade blanche immaculée de style Renaissance du *Grand Logis* avec ses lucarnes sculptées.
* **3e détail (pixels 15 à 20)** : Les courtines à mâchicoulis, le reflet dans l'eau des douves et les bannières à hermines.



---

## Niveau 4 — Île Feydeau — difficulté 4/12

1. **Intention** : Introduire les surfaces inclinées / instables (façades penchées sur terrain sablonneux `feydeau_hotel_armateur_b_penchee` qui font glisser le joueur vers le bas de la pente) et les plateformes flottantes (`petit_bateau` qui s'enfonce de 1 tuile sous le poids du joueur). La sensation recherchée est le tangage maritime du Nantes des armateurs du XVIIIe siècle, entre balcons en fer forgé gondolés et quais de Loire.
2. **Fiche chiffrée** :
* **Longueur** : 180 tuiles
* **Hauteur** : 18 tuiles (eau de la Loire à `y=16`, quai à `y=14`, balcons hauts vers `y=7`)
* **Temps de référence** : 85 s
* **Nombre de pixels à collecter** : 20
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 12


3. **Découpage en zones** :
* **Zone 1 (x=0 à 36) — Le Quai Turenne et les Premiers Balcons Penchés** : Départ sur le quai pavé bordé de `feydeau_bollard` et `feydeau_ancre`. Le joueur grimpe sur un premier `feydeau_balcon_fer_g/m/d` légèrement incliné au-dessus du quai sec : il sent que le sol le tire doucement vers la droite ou la gauche (`±1,2 tuile/s`) et que sauter dans le sens de la pente allonge le saut à 4 tuiles.
* *Plateformes* : `feydeau_sol_plein` (`x=0, y=14, L=36`), `feydeau_balcon_fer_g/m/d` incliné (`x=14, y=11, L=6`, pente douce descendante vers la droite), `feydeau_balcon_fer_g/m/d` (`x=23, y=10, L=5`).
* *Obstacles* : `feydeau_obstacle_ancre_pointes` (`x=29, y=13`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(10,13)` [facile], `(17,9)` [facile, sur le balcon penché], `(21,8)` [facile, dans l'élan du saut depuis la pente], `(29,11)` [risqué, saut au-dessus de l'ancre à pointes].
* *Checkpoint* : `lanterne_eteinte` à `x=34, y=13`.


* **Zone 2 (x=36 à 74) — Les Hôtels d'Armateurs Gondolés** : Le quai s'interrompt ; le joueur progresse de balcon en balcon le long de `feydeau_hotel_armateur_b_penchee` (les célèbres immeubles qui penchent à cause des fondations dans les alluvions de la Loire).
* *Plateformes* : `feydeau_balcon_fer_g/m/d` (`x=38, y=11, L=5`, pente vers la droite), `feydeau_balcon_fer_g/m/d` (`x=46, y=10, L=5`, pente vers la gauche — ralentit un peu la montée), `feydeau_balcon_fer_g/m/d` (`x=54, y=8, L=6`, pente vers la droite), `feydeau_sol_plein` (`x=63, y=14, L=11`), `feydeau_balcon_fer_g/m/d` (`x=65, y=11, L=4`).
* *Obstacles* : Eau profonde / vase mortelle (`bassin_eau` en bas de `x=36..63, y=16`), `feydeau_obstacle_ancre_pointes` (`x=56, y=7`, posé sur le balcon), `feydeau_obstacle_ancre_pointes` (`x=68, y=13`).
* *Ennemis* : `oiseau` (mouette de Loire, `x=44` à `x=53`, `y=8`, vitesse 3,5 tuiles/s).
* *Pixels (4)* : `(41,9)` [facile], `(48,8)` [risqué, sous la mouette sur balcon à contre-pente], `(58,6)` [risqué, après l'ancre sur le balcon penché], `(67,9)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=72, y=13`.


* **Zone 3 (x=74 à 112) — La Traversée des Gabares (`petit_bateau`)** : Le joueur descend au ras de l'eau et traverse un bras de Loire en sautant sur des `petit_bateau` amarrés. Quand le joueur atterrit sur un `petit_bateau`, celui-ci s'enfonce progressivement de 1,5 tuile en 1,5 s avant de toucher l'eau mortelle : il ne faut pas rester immobile dessus.
* *Plateformes* : `feydeau_quai_bord` (`x=74, y=14, L=4`), `petit_bateau` #1 (`x=80, y=14, L=4`), `petit_bateau` #2 (`x=87, y=14, L=4`), `feydeau_sol_plein` îlot (`x=94, y=14, L=5`), `petit_bateau` #3 (`x=101, y=14, L=4`), `petit_bateau` #4 (`x=107, y=13, L=4`).
* *Obstacles* : `bassin_eau` (`x=78..112, y=16`), `feydeau_obstacle_ancre_pointes` suspendue à une chaîne (`x=85, y=12`, oblige à un saut bas et tendu entre les bateaux #1 et #2), `feydeau_obstacle_ancre_pointes` (`x=105, y=11`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(82,12)` [facile], `(89,15)` [risqué, oblige à laisser le bateau #2 s'enfoncer d'1 tuile pendant 1 s avant de sauter au dernier moment], `(96,12)` [facile], `(109,11)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=114, y=13` (sur le quai suivant).


* **Zone 4 (x=112 à 152) — La Cour du Temple du Goût (Balcons & Bateaux combinés)** : Séquence alternant balcons penchés en hauteur (avec `feydeau_mascaron` sculptés en décor) et rebonds sur `petit_bateau` en contrebas.
* *Plateformes* : `feydeau_sol_plein` (`x=112, y=14, L=6`), `feydeau_balcon_fer_g/m/d` (`x=120, y=11, L=5`, pente droite), `petit_bateau` #5 (`x=128, y=14, L=4`), `feydeau_balcon_fer_g/m/d` (`x=134, y=11, L=5`, accroche `↑` requise depuis le saut du bateau), `feydeau_balcon_fer_g/m/d` (`x=142, y=9, L=5`, pente droite), `feydeau_balcon_fer_g/m/d` secret (`x=134, y=7, L=4`).
* *Obstacles* : `bassin_eau` (`x=118..152, y=16`), `feydeau_obstacle_ancre_pointes` (`x=122, y=10`), `feydeau_obstacle_ancre_pointes` (`x=137, y=10`), `feydeau_obstacle_ancre_pointes` (`x=145, y=8`).
* *Ennemis* : `oiseau` (`x=126` à `x=133`, `y=11`, vitesse 3,5 tuiles/s), `oiseau` (`x=140` à `x=148`, `y=7`, vitesse 3,5 tuiles/s).
* *Pixels (5)* : `(124,9)` [facile], `(130,12)` [risqué, au-dessus du bateau #5 sous la mouette], `(136,5)` [caché, en grimpant sur le balcon secret à `y=7`], `(144,7)` [risqué, saut par-dessus l'ancre en pente], `(149,8)` [facile].
* *Checkpoint* : Aucun.


* **Zone 5 (x=152 à 180) — La Proue de Pierre de l'Île Feydeau** : Retour sur la pointe pavée de l'ancienne île, ornée de mascarons et de lanternes.
* *Plateformes* : `feydeau_sol_plein` (`x=152, y=14, L=28`), `feydeau_balcon_fer_g/m/d` (`x=158, y=11, L=6`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (3)* : `(160,9)` [facile], `(163,9)` [facile], `(168,13)` [facile].
* *Arrivée* : `feydeau_monument_feydeau` à `x=172, y=11` et `arche_arrivee` à `x=176, y=12`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (quai continu sous les premiers balcons penchés), îlot central de la Zone 3 (`x=94..99`), et Zone 5.
* **Pic de difficulté** : Zone 4 (`x=128 à 147`), lorsqu'il faut sauter depuis le `petit_bateau` #5 (avant qu'il ne s'enfonce trop bas !) pour réussir l'accroche (`↑`) sur le balcon à `y=11`, puis négocier la pente avec une ancre à pointes.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=14 à 20` pour la pente, `x=78 à 84` pour le bateau)** : En `x=14`, le premier balcon penché surplombe un quai large et sans trou : glisser n'entraîne aucune mort. En `x=80`, le `petit_bateau` #1 est placé à seulement 2 tuiles du quai de départ (`x=77`) : si le joueur voit le bateau s'enfoncer, il peut immédiatement revenir d'un pas sur le quai.
* **Test (`x=128 à 136`)** : Le joueur doit sauter depuis le bateau #5 dès l'atterrissage (tant qu'il est encore à `y=14`) pour avoir les 3 tuiles de hauteur nécessaires afin d'agripper (`↑`) le balcon situé à `y=11`.


6. **Météo → gameplay** (Niveau 4 : derniers effets doux, jamais bloquants) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | La pente des balcons penchés glisse un peu plus (`±1,5 tuile/s` au lieu de `1,2`) ; la Loire monte de `+0,5 tuile` (`y=15,5`), mais élève aussi les `petit_bateau` de `+0,5 tuile` (`y=13,5`). | En Zone 4, le bateau #5 étant 0,5 tuile plus haut, le saut vers le balcon `y=11` passe même sans accroche ! | Sur le balcon à contre-pente (`x=46`), le joueur progresse un peu plus lentement (`5,4 tuiles/s`). | `goutte_pluie`, clapotis sur les coques des bateaux, reflets sur le fer forgé. | Même à 5,4 tuiles/s, traverser un balcon de 5 tuiles prend moins d'1 s et le saut garde >3 tuiles de portée. |
| **Soleil** | Le fer forgé est sec (glisse de pente réduite à `±0,9 tuile/s`) ; les `petit_bateau` flottent plus longtemps (s'enfoncent en 2 s au lieu de 1,5 s). | Plus de temps pour récupérer le pixel bas `(89,15)` en Zone 3 et moins de dérive sur les balcons. | Les mouettes (`oiseau`) volent 10 % plus vite (`3,8 tuiles/s`). | `ciel_jour`, reflets dorés sur le tuffeau des hôtels d'armateurs, cri des mouettes. | Les mouettes s'esquivent facilement en s'accroupissant (`↓`) ou en attendant leur demi-tour. |
| **Neige** | Les `petit_bateau` sont pris dans la glace de Loire : ils ne s'enfoncent plus que de `0,5 tuile` max (impossible de couler !). | Toute la Zone 3 devient ultra-sécurisante : les bateaux deviennent des plateformes quasi fixes. | Les quais pavés ont une friction `×0,8`. | `flocon`, givre sur les mascarons et les ancres, grincement sourd du bois gelé. | Le pixel bas `(89,15)` reste atteignable en s'accroupissant (`↓`) au bord du bateau #2. |
| **Brume** | Brouillard de Loire (`brume_bande_tile_x`) réduisant la visibilité lointaine à 10 tuiles ; mouettes ralenties (`×0,8`). | Mouettes très lentes (`2,8 tuiles/s`), faciles à anticiper. | Moins de vue d'ensemble sur l'alignement des bateaux en Zone 3. | Brouillard dense sur l'eau, corne de brume grave au loin. | Les bateaux sont espacés de 3 tuiles max, donc le bateau suivant est toujours visible à moins de 4 tuiles. |
| **Vent** | Brise d'estuaire vers la droite (`+0,4 tuile/s` en l'air) ; fait tanguer légèrement les `petit_bateau` horizontalement (`±0,5 tuile`). | Sauts dans le sens des pentes droites (Zones 1, 2, 4) très confortables. | Le léger roulis horizontal (`±0,5 tuile`) demande de sauter quand le bateau est proche du suivant. | Claquement de cordages sur les mâts/anneaux, vagues à la surface de l'eau. | Même à l'écart maximal du roulis, le vide entre deux bateaux ne dépasse jamais 3 tuiles. |
| **Orage** | Éclair toutes les 7 s suivi d'une houle qui soulève tous les `petit_bateau` de `+1 tuile` vers le haut pendant 1,5 s. | Sauter au moment de la houle offre un tremplin naturel vers les balcons hauts (Zone 4). | Ambiance sombre (`ciel_orage`) et houle à prendre en compte sous les ancres suspendues (`x=85`). | Éclairs se reflétant dans les fenêtres des hôtels penchés, tonnerre et clapotis fort. | L'ancre à `x=85, y=12` laisse encore 1 tuile de passage même au sommet de la houle si l'on saute en bout de bateau. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Centre (Feydeau & commun)* : `feydeau_sol_plein`, `feydeau_sol_haut_1`, `feydeau_quai_bord`, `feydeau_balcon_fer_g`, `feydeau_balcon_fer_m`, `feydeau_balcon_fer_d`, `feydeau_hotel_armateur_a`, `feydeau_hotel_armateur_b_penchee`, `feydeau_mascaron`, `feydeau_ancre`, `feydeau_bollard`, `feydeau_obstacle_ancre_pointes`, `feydeau_fond_tile_x`, `feydeau_monument_feydeau`, `petit_bateau`, `bassin_eau`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 7)** : Les *Façades en tuffeau visiblement penchées* et leurs grands balcons ventrus en fer forgé noir.
* **2e détail (pixels 8 à 14)** : Les *Mascarons* sculptés au-dessus des portes cochères (visages de divinités marines et de négociants).
* **3e détail (pixels 15 à 20)** : Les anciens quais de pierre et le reflet de la proue de l'île comme un navire ancré dans la ville.



---

## Niveau 5 — Théâtre Graslin & Place Graslin — difficulté 5/12

1. **Intention** : Introduire les plateformes à rebond élastique (`graslin_parasol_cafe` qui propulsent le joueur à **4,5 tuiles de haut** sans perte d'élan horizontal) combinées aux projecteurs / lustres oscillants et à la verticalité des colonnes corinthiennes. La sensation recherchée est l'effervescence théâtrale et mondaine d'une soirée d'opéra, bondissant des terrasses de café type *La Cigale* jusqu'au fronton des huit Muses.
2. **Fiche chiffrée** :
* **Longueur** : 190 tuiles
* **Hauteur** : 22 tuiles (pavés de la place à `y=20`, perron et terrasses à `y=17`, sommet des colonnes et statues des Muses vers `y=5`)
* **Temps de référence** : 90 s
* **Nombre de pixels à collecter** : 22
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 14


3. **Découpage en zones** :
* **Zone 1 (x=0 à 38) — Les Terrasses de Café de la Place Graslin** : Départ sur l'hémicycle pavé de la place. Les `graslin_table_cafe` et le premier `graslin_parasol_cafe` sont posés devant un mur-terrasse : sauter sur le parasol propulse le joueur à 4,5 tuiles de haut vers le balcon supérieur (`graslin_terrasse_cafe_g/m/d`).
* *Plateformes* : `graslin_sol_plein` (`x=0, y=20, L=38`), `graslin_table_cafe` (`x=12, y=19, L=2`), `graslin_parasol_cafe` #1 (`x=16, y=18, L=3` — rebond de 4,5 tuiles jusqu'à `y=13.5`), `graslin_terrasse_cafe_g/m/d` (`x=20, y=14, L=7`), `graslin_parasol_cafe` #2 (`x=29, y=18, L=3`), `graslin_terrasse_cafe_g/m/d` (`x=33, y=14, L=5`).
* *Obstacles* : `graslin_obstacle_chaises` (empilement de chaises en fer renversées et pointues, `x=27, y=19`, `x=31, y=19`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(16,15)` [facile, au-dessus du parasol #1], `(23,12)` [facile], `(29,14)` [facile, dans le rebond du parasol #2], `(30,19)` [risqué, au sol entre les deux amas de chaises renversées].
* *Checkpoint* : `lanterne_eteinte` à `x=36, y=13`.


* **Zone 2 (x=38 à 78) — Le Grand Perron de 20 Marches** : Montée sur les larges degrés de `graslin_perron_marche` menant au portique du théâtre. Des `tonneau` (accessoires de décor roulants) dévalent les marches tandis que des `graslin_lampadaire_ornemente` servent de perchoirs hauts accessibles via des parasols.
* *Plateformes* : `graslin_perron_marche` en paliers montants (`x=38..50, y=19`, `x=50..62, y=17`, `x=62..78, y=15`), `graslin_parasol_cafe` #3 (`x=44, y=17, L=3`), sommet de `graslin_lampadaire_ornemente` (`x=49, y=13, L=2`), `graslin_terrasse_cafe_g/m/d` (`x=55, y=12, L=5`), `graslin_lampadaire_ornemente` (`x=64, y=11, L=2`).
* *Obstacles* : `graslin_obstacle_chaises` (`x=47, y=18`), `graslin_obstacle_chaises` (`x=58, y=16`), `pointes_fer_1` (`x=69, y=14`).
* *Ennemis* : `tonneau` de décor (`x=75` vers `x=39`, descend les marches à vitesse 4 tuiles/s toutes les 3,5 s).
* *Pixels (4)* : `(49,11)` [facile, sur le lampadaire], `(57,10)` [facile], `(64,9)` [risqué, saut précis sur le 2e lampadaire], `(71,13)` [risqué, saut par-dessus les pointes et le tonneau sur le perron].
* *Checkpoint* : `lanterne_eteinte` à `x=76, y=14`.


* **Zone 3 (x=78 à 116) — Les Huit Colonnes Corinthiennes** : Ascension verticale et horizontale entre les fûts géants de `graslin_colonne_corinthienne`. Le joueur rebondit sur des auvents/parasols d'entracte et s'accroche (`↑`) aux chapiteaux sculptés jusqu'à la corniche des Muses (`graslin_muse_statue`).
* *Plateformes* : `graslin_colonne_corinthienne` chapiteau #1 (`x=80, y=12, L=3`), `graslin_parasol_cafe` #4 (`x=85, y=14, L=3`), chapiteau #2 (`x=90, y=10, L=3`), chapiteau #3 (`x=96, y=10, L=3`), `graslin_parasol_cafe` #5 (`x=101, y=12, L=3`), chapiteau #4 (`x=106, y=8, L=3`), corniche du fronton (`x=111, y=8, L=5`).
* *Obstacles* : Vide / chute sur `pointes_fer_2` au pied des colonnes (`x=80..112, y=19`), `graslin_obstacle_chaises` sur chapiteau (`x=97, y=9`, sur 1 tuile à droite).
* *Ennemis* : `oiseau` (`x=89` à `x=97`, `y=8`, vitesse 4 tuiles/s, rase les chapiteaux #2 et #3 : oblige à s'accroupir `↓` sur le chapiteau #2 avant de sauter).
* *Pixels (5)* : `(85,10)` [facile, dans le rebond #4], `(93,8)` [risqué, en l'air entre deux chapiteaux sous l'oiseau], `(101,8)` [facile, rebond #5], `(106,6)` [facile], `(90,15)` [caché, sur une bague médiane de la colonne #2 à `y=15`, accessible en se laissant tomber puis en rebondissant sur le parasol #4].
* *Checkpoint* : `lanterne_eteinte` à `x=114, y=7`.


* **Zone 4 (x=116 à 158) — La Frise des Huit Muses & Les Lustres de Foyer** : Traversée au sommet du `graslin_theatre_facade` entre les statues de `graslin_muse_statue` et les grands `pommeraye_lustre` visibles dans le vestibule ouvert qui se balancent en pendule (servent de plateformes mobiles horizontales sur 3 tuiles d'amplitude toutes les 3 s, mais leurs bougies latérales `cierge_flamme` brûlent si on touche les bords).
* *Plateformes* : Socle `graslin_muse_statue` #1 (`x=116, y=8, L=4`), `pommeraye_lustre` #1 oscillant (`x=122..125, y=8, L=3`), socle Muse #2 (`x=128, y=8, L=3`), `graslin_parasol_cafe` #6 sur balconnet (`x=133, y=10, L=3`), socle Muse #3 (`x=138, y=6, L=3`), `pommeraye_lustre` #2 oscillant (`x=143..146, y=6, L=3`), corniche haute (`x=149, y=6, L=9`).
* *Obstacles* : Chute mortelle en bas (`y=19`), `cierge_flamme` aux extrémités hautes des lustres (oblige à atterrir au centre du lustre ou à s'accroupir `↓`), `pointes_fer_1` (`x=152, y=5`), `pointes_fer_1` (`x=155, y=5`).
* *Ennemis* : `oiseau` (`x=136` à `x=143`, `y=4`, vitesse 4 tuiles/s).
* *Pixels (6)* : `(123,6)` [risqué, au centre du lustre #1], `(129,6)` [facile], `(133,6)` [facile, au sommet du rebond #6], `(139,4)` [risqué, sous l'oiseau], `(144,4)` [risqué, au centre du lustre #2], `(153,3)` [risqué, saut entre les deux pointes de la corniche finale].
* *Checkpoint* : Aucun.


* **Zone 5 (x=158 à 190) — Le Fronton Néoclassique & Rideau Final** : Descente majestueuse le long des terrasses latérales illuminées jusqu'au monument de Graslin.
* *Plateformes* : `graslin_terrasse_cafe_g/m/d` (`x=158, y=9, L=8`), `graslin_perron_marche` (`x=166, y=12, L=24`), `graslin_parasol_cafe` #7 (`x=172, y=11, L=3` — pour cueillir une couronne de pixels en hauteur).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (3)* : `(172,7)` [facile], `(173,6)` [facile], `(174,7)` [facile, en arche au-dessus du parasol #7].
* *Arrivée* : `graslin_monument_graslin` à `x=181, y=9` et `arche_arrivee` à `x=185, y=10`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (`x=0..25`, sol continu sous le premier parasol), paliers des checkpoints 2 (`x=76`) et 3 (`x=114`), et Zone 5 (bouquet final sur parasol sans danger).
* **Pic de difficulté** : Zone 4 (`x=122 à 148`), où il faut combiner le rebond de 4,5 tuiles d'un parasol, l'atterrissage au centre d'un lustre oscillant et l'esquive d'un oiseau au niveau des statues des Muses.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=15 à 22`)** : Le `graslin_parasol_cafe` #1 est posé sur le pavé plat de la place devant un balcon de 6 tuiles de haut (inatteignable par un saut de 3 tuiles + accroche). Sauter dessus fait rebondir le joueur automatiquement à 4,5 tuiles de haut avec un bruit de toile tendue (« *boing* ») et une animation de pliage de la toile. Aucun trou ni ennemi autour.
* **Test (`x=85 à 108` en Zone 3)** : Les parasols #4 et #5 sont placés au-dessus du vide entre les colonnes corinthiennes : le joueur doit orienter sa trajectoire aérienne pendant le rebond de 4,5 tuiles pour atterrir sur le chapiteau suivant.


6. **Météo → gameplay** (À partir du niveau 5 : effets météo plus marqués et stratégiques, toujours 100 % finissables) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Toile des `graslin_parasol_cafe` alourdie par l'eau : rebond réduit de `4,5` à `3,8 tuiles` (mais permet d'utiliser l'accroche `↑` au sommet) ; pavés et marbre ont une friction `×0,75`. | Les `cierge_flamme` des lustres en Zone 4 sont éteints par l'humidité (atterrissage libre sur toute la largeur du lustre). | Pour monter de `y=14` à `y=8` en Zone 4 (`x=133`), il faut rebondir (`3,8 tuiles`) PUIS maintenir `↑` pour s'accrocher au socle de la Muse #3. | `goutte_pluie` rebondissant sur les parasols, reflets brillants sur le perron de Graslin. | `3,8 tuiles` de rebond + `0,5 tuile` d'accroche `↑` couvrent `4,3 tuiles`, alors que l'écart max (socle Muse #3 à `y=6` depuis parasol à `y=10`) est exactement de `4 tuiles`. |
| **Soleil** | Toile sèche et tendue : rebond des parasols poussé à `5 tuiles` ; terrasses animées. | Tous les chapiteaux et socles de Muses sont atteints avec 1 tuile de marge au-dessus des rebords. | En Zone 3 (`x=85`), rebondir à 5 tuiles monte à hauteur du vol de l'`oiseau` (`y=8`) : il faut décaler son saut de 0,5 s. | `ciel_jour`, terrasses dorées, musique de violons et brouhaha joyeux de café. | Le joueur contrôle sa dérive horizontale en l'air et peut rebondir sur place sur le parasol #4 en attendant que l'oiseau passe. |
| **Neige** | Couche de neige sur les parasols : le 1er rebond sur chaque parasol secoue la neige et ne monte qu'à `2,5 tuiles`, le 2e rebond (toile dégagée) monte normalement à `4,5 tuiles`. | Les `tonneau` de la Zone 2 sont freinés par la neige sur les marches (`vitesse ×0,7`, soit 2,8 tuiles/s). | Oblige à faire un « double rebond » sur place sur chaque parasol avant de s'élancer vers la plateforme haute. | `flocon`, petits tas de neige qui volent quand on saute sur un parasol, valse d'hiver feutrée. | Les parasols sont fixes et larges de 3 tuiles : rebondir deux fois dessus sur place est 100 % sûr. |
| **Brume** | Visibilité réduite à 8 tuiles ; les `graslin_lampadaire_ornemente` et les `pommeraye_lustre` créent un halo de visibilité de 5 tuiles autour d'eux. | Les `oiseau` volent plus lentement (`×0,75`, soit 3 tuiles/s). | Le chapiteau cible en haut d'un rebond de parasol n'apparaît clairement qu'à mi-ascension (à moins d'être près d'un lampadaire). | Brouillard nocturne théâtral, halos jaunes chauds autour des lampadaires de la place. | L'écart horizontal max après un parasol est de 2 à 3 tuiles (et la visibilité est de 8 tuiles, donc supérieure au saut). |
| **Vent** | Rafales latérales vers la gauche (`-0,8 tuile/s` en l'air pendant 2,5 s toutes les 5 s) ; les `pommeraye_lustre` de la Zone 4 oscillent sur `4 tuiles` au lieu de `3`. | Quand le lustre oscille à `4 tuiles`, il vient toucher quasiment le socle des Muses (écart réduit à `1 tuile` !). | Pendant un grand rebond de parasol (qui dure 1,1 s en l'air), sauter face à la rafale fait perdre ~0,9 tuile de portée horizontale. | Parasols qui vibrent, fanions du théâtre qui claquent, sifflement dans les colonnades. | Les parasols sont à 2 tuiles horizontalement des chapiteaux ; même avec `-0,9 tuile` de dérive, le joueur couvre `3,1 tuiles` (> 2 requises), ou saute pendant l'accalmie de 2,5 s. |
| **Orage** | Éclair toutes les 6 s : un projecteur / arc électrique parcourt les `graslin_lampadaire_ornemente` métalliques pendant 1 s après le tonnerre (les rendant électrifiés pendant 1 s). | Le souffle du tonnerre détruit les `tonneau` roulants actifs en Zone 2 ! | En Zone 2, il ne faut pas rester immobile sur les 2 lampadaires (`x=49` et `x=64`) pendant la seconde qui suit un éclair. | `ciel_orage`, arcs bleutés sur les lampadaires après le flash, roulement de timbales + tonnerre. | Les lampadaires de la Zone 2 sont optionnels (voie haute) ou se franchissent en 0,3 s entre deux éclairs espacés de 6 s. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `pointes_fer_1`, `pointes_fer_2`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Centre (Graslin & Pommeraye)* : `graslin_sol_plein`, `graslin_perron_marche`, `graslin_terrasse_cafe_g`, `graslin_terrasse_cafe_m`, `graslin_terrasse_cafe_d`, `graslin_colonne_corinthienne`, `graslin_muse_statue`, `graslin_table_cafe`, `graslin_parasol_cafe`, `graslin_lampadaire_ornemente`, `graslin_theatre_facade`, `graslin_obstacle_chaises`, `graslin_fond_tile_x`, `graslin_monument_graslin`, `pommeraye_lustre`.
* *Château & Cathédrale (réemploi cohérent)* : `tonneau`, `cierge_flamme`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 8)** : Les *Huit colonnes corinthiennes* monumentales et le grand perron de pierre.
* **2e détail (pixels 9 à 15)** : Les *Huit statues des Muses* alignées tout en haut de la façade au-dessus de l'entablement.
* **3e détail (pixels 16 à 22)** : L'hémicycle de la *Place Graslin*, ses lampadaires ouvragés et les terrasses Art nouveau de *La Cigale* en bordure.



---

## Niveau 6 — Les Machines de l'Île (Le Grand Éléphant) — difficulté 6/12

1. **Intention** : Introduire les rouages rotatifs (`machines_engrenage_grand/petit` qui font avancer ou reculer le joueur sur leur circonférence), les pistons (`machines_bielle`) et les jets de `vapeur` temporisés, avant le **1er Boss du jeu** (le Grand Éléphant mécanique devenu fou). La sensation recherchée est l'émerveillement steampunk au cœur d'une cathédrale d'acier et de bois en mouvement perpétuel.
2. **Fiche chiffrée** :
* **Longueur** : 210 tuiles (dont arène de Boss de `x=160` à `x=210`)
* **Hauteur** : 20 tuiles (sol des nefs à `y=18`, passerelles hautes vers `y=7`)
* **Temps de référence** : 110 s (dont 45 s de Boss)
* **Nombre de pixels à collecter** : 24
* **Nombre de checkpoints** : 3 (dont 1 juste devant l'arène du Boss à `x=158`)
* **Nombre d'obstacles mortels** : 15 (hors attaques du Boss)


3. **Découpage en zones** :
* **Zone 1 (x=0 à 38) — Le Parvis des Nefs et les Premiers Engrenages** : Départ sur les rails de `machines_rail` sous la grande `machines_charpente_module`. Un premier `machines_engrenage_grand` tourne dans le sens horaire au-dessus d'un sol sûr : marcher dessus entraîne le joueur à `+1,5 tuile/s` vers la droite.
* *Plateformes* : `machines_sol_plein` (`x=0, y=18, L=38`), `machines_engrenage_grand` (`x=14, y=15, L=4`, rotation horaire `+1,5 tuile/s`), `machines_passerelle_acier_g/m/d` (`x=20, y=14, L=6`), `machines_engrenage_petit` (`x=29, y=13, L=2`, rotation anti-horaire `-1,5 tuile/s`), `machines_passerelle_acier_g/m/d` (`x=33, y=12, L=5`).
* *Obstacles* : `machines_obstacle_engrenage_dents` (engrenage denté rouge/aiguisé mortel au sol à `x=28, y=17`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(16,13)` [facile, sur le grand engrenage], `(23,12)` [facile], `(29,11)` [facile], `(28,15)` [risqué, juste entre le petit engrenage et les dents mortelles en bas].
* *Checkpoint* : `lanterne_eteinte` à `x=36, y=11`.


* **Zone 2 (x=38 à 80) — La Galerie des Tuyaux de Cuivre et Jets de Vapeur** : Progression sur des `machines_tuyau_cuivre` d'où jaillissent des jets de `vapeur` (sifflement + petit nuage d'alerte 0,6 s avant un jet brûlant de 3 tuiles pendant 1,2 s toutes les 3 s).
* *Plateformes* : `machines_tuyau_cuivre` (`x=40, y=13, L=8`), `machines_bielle` mobile horizontale (`x=50` à `x=55`, `y=13, L=3`, vitesse 2 tuiles/s), `machines_tuyau_cuivre` (`x=58, y=11, L=9`), `machines_engrenage_grand` (`x=70, y=10, L=4`), `machines_passerelle_acier_g/m/d` (`x=76, y=9, L=4`).
* *Obstacles* : Chute mortelle dans la fosse aux mécanismes (`x=38..80, y=19`), `vapeur` verticale (`x=44, y=12`, `x=61, y=10`), `vapeur` horizontale (`x=66, y=10` vers la gauche sur 2 tuiles, oblige à s'accroupir `↓`), `machines_obstacle_engrenage_dents` (`x=72, y=14`).
* *Ennemis* : Mini `machines_animal_mecanique` (araignée/fourmi mécanique qui marche de `x=58` à `x=66` sur le tuyau à `y=10`, vitesse 2,5 tuiles/s).
* *Pixels (5)* : `(44,10)` [risqué, au-dessus du jet de vapeur #1], `(52,11)` [facile, sur la bielle], `(63,9)` [risqué, entre l'animal mécanique et la vapeur], `(72,8)` [facile], `(72,12)` [caché, sous le grand engrenage juste au-dessus des dents mortelles].
* *Checkpoint* : `lanterne_eteinte` à `x=78, y=8`.


* **Zone 3 (x=80 à 120) — L'Horlogerie Géante (Bielles & Engrenages synchronisés)** : Cœur mécanique de la Galerie où plusieurs `machines_engrenage_grand` et `machines_bielle` verticales s'imbriquent.
* *Plateformes* : `machines_engrenage_grand` (`x=82, y=10, L=4`, horaire), `machines_bielle` verticale (`x=89, y=12` ↔ `y=8, L=3`, cycle de 3 s), `machines_engrenage_grand` (`x=95, y=8, L=4`, anti-horaire), `machines_passerelle_acier_g/m/d` (`x=102, y=8, L=5`), `machines_bielle` diagonale (`x=109, y=11` ↔ `x=113, y=8, L=3`), `machines_passerelle_acier_g/m/d` (`x=116, y=8, L=4`).
* *Obstacles* : `machines_obstacle_engrenage_dents` (`x=87, y=14`, `x=97, y=12`, `x=104, y=7`), `vapeur` (`x=111, y=7`).
* *Ennemis* : `machines_animal_mecanique` (oiseau-héron mécanique en vol stationnaire vertical de `y=6` à `y=10` en `x=100`, vitesse 2 tuiles/s).
* *Pixels (5)* : `(84,8)` [facile], `(89,6)` [risqué, au point haut de la bielle verticale], `(97,6)` [risqué, sur engrenage anti-horaire], `(104,5)` [risqué, saut par-dessus l'engrenage denté], `(112,6)` [facile].
* *Checkpoint* : Aucun.


* **Zone 4 (x=120 à 160) — La Passerelle d'Embarquement sous les Nefs** : Descente rythmée le long des coursives d'embarquement menant à l'esplanade de l'Éléphant, avec une brève zone d'accalmie avant le Boss.
* *Plateformes* : `machines_passerelle_acier_g/m/d` (`x=120, y=10, L=8`), `machines_engrenage_petit` (`x=131, y=12, L=2`), `machines_tuyau_cuivre` (`x=136, y=14, L=8`), `machines_sol_plein` (`x=146, y=16, L=14`).
* *Obstacles* : `vapeur` (`x=124, y=9`, `x=139, y=13`), `machines_obstacle_engrenage_dents` (`x=142, y=13`).
* *Ennemis* : `machines_animal_mecanique` (`x=120` à `x=127`, `y=9`, vitesse 3 tuiles/s).
* *Pixels (5)* : `(124,7)` [facile], `(131,10)` [facile], `(139,11)` [risqué, dans le timing de la vapeur], `(143,11)` [facile], `(152,15)` [facile, devant l'arène].
* *Checkpoint* : `lanterne_eteinte` à `x=158, y=15` (Checkpoint de Boss).


* **Zone 5 (x=160 à 210) — Arène du Boss : Le Grand Éléphant Déchaîné** : Grande esplanade de 50 tuiles sur 3 niveaux de hauteur (sol `machines_rail` à `y=16`, passerelles d'acier latérales à `y=13` et `y=10`, et valve d'arrêt d'urgence au sommet de l'échafaudage droit à `x=204, y=8`).
* *Plateformes* : `machines_sol_plein` + `machines_rail` (`x=160, y=16, L=50`), `machines_passerelle_acier_g/m/d` gauche (`x=164, y=13, L=6`, `x=166, y=10, L=5`), `machines_engrenage_grand` central (`x=178, y=12, L=4`), `machines_passerelle_acier_g/m/d` droite (`x=188, y=13, L=6`, `x=194, y=10, L=6`), plateforme de la Valve finale (`x=202, y=8, L=6`).
* *Pixels (5, intégrés à la survie du Boss)* : `(168,8)` [facile, sur la passerelle haute gauche], `(180,10)` [risqué, sur l'engrenage central], `(191,11)` [facile], `(197,8)` [facile], `(204,7)` [facile, sur la valve finale].
* *Arrivée* : `machines_monument_machines` à `x=205, y=5` et `arche_arrivee` à `x=208, y=14` (déverrouillée dès que le Boss est calmé).




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (`x=0..25`), fin de Zone 4 (`x=146..160` devant le checkpoint de Boss), et les fenêtres de répit de 4 s entre chaque phase du Boss.
* **Pic de difficulté** : Zone 3 (`x=82..115`, horlogerie géante) et Phase 3 du Boss en Zone 5.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=14 à 18`)** : Le premier `machines_engrenage_grand` est posé à 3 tuiles au-dessus du sol continu de la Zone 1. Le joueur monte dessus et sent sa vitesse modifiée (`+1,5 tuile/s` vers la droite), puis teste le petit engrenage anti-horaire (`-1,5 tuile/s`) en `x=29` avant d'aborder la fosse de la Zone 2.
* **Test (`Zone 3`)** : Sauter d'un engrenage horaire à une bielle verticale puis à un engrenage anti-horaire au-dessus du vide.


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Les `machines_passerelle_acier` et `tuyau_cuivre` mouillés ont une friction `×0,75` ; la pluie refroidit la chaudière : les jets de `vapeur` durent `0,8 s` au lieu de `1,2 s`. | Jets de vapeur 33 % plus courts dans tout le niveau et pendant la Phase 2 du Boss ! | Réception plus glissante sur les tuyaux de cuivre de la Zone 2. | Pluie tambourinant sur le toit métallique des Nefs, condensation blanche autour des tuyaux. | Les tuyaux de cuivre font 8 à 9 tuiles de long, absorbant largement la glisse. |
| **Soleil** | Chaudières à pleine pression : les `machines_engrenage` tournent `25 %` plus vite (`±1,9 tuile/s` au lieu de `1,5`). | Les engrenages horaires propulsent le joueur très loin vers la droite (sauts jusqu'à `4,4 tuiles`). | L'engrenage anti-horaire de `x=95` demande de courir sans s'arrêter avant de sauter. | Rayons de soleil à travers la charpente des Nefs, cuivres étincelants. | À `6,9 - 1,9 = 5,0 tuiles/s` de vitesse nette sur l'engrenage anti-horaire, le saut couvre encore `3,1 tuiles` (écart requis : `3 tuiles`). |
| **Neige** | Mécanismes engourdis par le gel : les `machines_bielle` et `machines_animal_mecanique` bougent `25 %` moins vite ; l'eau crachée par l'Éléphant (Boss Phase 1) laisse une plaque glissante (`friction ×0,7`) au sol pendant 3 s. | Zones 2 et 3 beaucoup plus lisibles grâce au ralentissement des bielles et automates. | Le sol de l'arène du Boss glisse après le jet de trompe. | Flocons tombant à travers les côtés ouverts des Nefs, givre sur les poutrelles d'acier. | En Phase 1 du Boss, le joueur peut monter sur les passerelles `y=13` et `y=10` qui restent totalement sèches. |
| **Brume** | La `vapeur` se mêle à `brume_bande_tile_x` : visibilité réduite à 8 tuiles, mais chaque jet de vapeur s'annonce par un sifflement sonore `1,0 s` à l'avance (au lieu de `0,6 s`) et une lueur orange du foyer. | Préavis d'alerte des jets de vapeur plus long (`1,0 s`). | Moins de visibilité lointaine sur le fond de l'arène du Boss. | Nefs noyées dans un brouillard de vapeur steampunk, sirène de brume du port. | L'Éléphant est massif et ses yeux/lanternes brillent à travers la brume à plus de 12 tuiles. |
| **Vent** | Vent d'ouest dans la Nef ouverte (`+0,7 tuile/s` vers la droite en l'air) ; dévie les jets de `vapeur` verticaux de `1 tuile` en diagonale vers la droite au sommet. | Aide tous les grands sauts vers la droite (Zones 2, 3 et montée vers la valve finale du Boss). | Il faut sauter un peu plus tôt devant un jet de vapeur vertical car son panache penche à droite. | Tourbillons de vapeur soufflés à l'horizontale, grincement de la charpente métallique. | La base du jet de vapeur fait 1 tuile et son panache dévié ne couvre que 2 tuiles sur des tuyaux qui en font 8. |
| **Orage** | Éclair toutes les 6 s : surcharge électrique qui inverse le sens de rotation de tous les `machines_engrenage` pendant `2 s` après le tonnerre. | Permet d'attendre l'éclair devant l'engrenage anti-horaire (`x=95`) pour qu'il tourne dans le bon sens (horaire) ! | Demande de ne pas être surpris par l'inversion en plein saut sur un engrenage. | Arcs électriques sur la charpente des Nefs, grondement métallique avant l'inversion. | Les engrenages clignotent en jaune 0,5 s pendant le flash avant d'inverser leur rotation. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Île (Machines)* : `machines_sol_plein`, `machines_rail`, `machines_passerelle_acier_g`, `machines_passerelle_acier_m`, `machines_passerelle_acier_d`, `machines_engrenage_grand`, `machines_engrenage_petit`, `machines_bielle`, `machines_charpente_module`, `machines_animal_mecanique`, `machines_tuyau_cuivre`, `machines_obstacle_engrenage_dents`, `machines_fond_tile_x`, `machines_monument_machines`, `vapeur`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `arche_arrivee`.
* *SPRITE MANQUANT* :
* `SPRITE MANQUANT : machines_boss_elephant (96×80 px soit 6×5 tuiles, le Grand Éléphant mécanique de bois et d'acier avec sa trompe articulée et son howdah/balcon sur le dos)`.
* `SPRITE MANQUANT : machines_valve_arret (16×16 px, volant de vanne rouge en cuivre à activer par contact pour calmer la pression du Boss)`.




8. **Boss — Le Grand Éléphant en Surchauffe (Zone 5, durée totale ~45 s)** :
* *Principe* : La tempête de pixels a déréglé le régulateur de pression du Grand Éléphant (`machines_boss_elephant`, placé entre `x=175` et `x=190`). Le joueur ne le blesse pas : à la fin de chaque phase, une **valve de décompression** (`machines_valve_arret`) s'ouvre dans l'arène ; le joueur doit survivre au pattern puis toucher la valve pour faire baisser la pression d'un tiers (3 phases = 3 valves).
* **Phase 1 — La Trompe d'Eau (12 s + 4 s de répit)** :
* *Pattern* : L'Éléphant avance de 6 tuiles vers la gauche (`3 tuiles/s`, `0 à 2 s`), lève sa trompe (barrissement d'alerte `1 s`), puis balaie un jet d'eau (`jet_eau` / `vapeur`) du sol (`y=16`) vers la passerelle médiane (`y=13`) pendant `4 s` (`3 à 7 s`), recule (`7 à 9 s`) et frappe du pied (onde de choc au sol `y=16` à sauter entre `9 et 12 s`).
* *Fenêtre de répit (4 s)* : L'Éléphant s'arrête pour reprendre sa vapeur ; la **Valve #1** s'allume sur la passerelle haute gauche (`x=168, y=9`). Le joueur grimpe la toucher.


* **Phase 2 — La Purge de Vapeur Brûlante (13 s + 4 s de répit)** :
* *Pattern* : Les flancs de l'Éléphant relâchent 3 salves de `vapeur` horizontales à hauteur de passerelle (`y=13`, durée `2 s` chacune avec `1,5 s` d'intervalle, obligeant à s'accroupir `↓` ou à bondir sur l'`machines_engrenage_grand` central à `x=178, y=12`), suivies de deux pas lourds au sol (`9 à 13 s`).
* *Fenêtre de répit (4 s)* : La **Valve #2** s'ouvre sur le dos/balcon avant de l'Éléphant ou sur la passerelle droite (`x=191, y=12`). Le joueur la touche.


* **Phase 3 — Emballement Mécanique Final (12 s + ouverture de l'Arche)** :
* *Pattern* : L'engrenage central tourne plus vite (`+2,5 tuiles/s`), l'Éléphant combine un balayage de trompe (`0 à 5 s`) et lâche 2 petits `machines_animal_mecanique` au sol (`5 à 12 s`).
* *Objectif final* : La **Valve #3** finale s'active tout en haut à droite (`x=204, y=8`). Le joueur utilise l'élan de l'engrenage central (`x=178`) vers les passerelles droites (`x=188` puis `x=194`) et s'accroche (`↑`) à la plateforme `x=202, y=8`. Toucher la Valve #3 apaise l'Éléphant qui salue d'un barrissement joyeux et ouvre l'`arche_arrivee`.




9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 8)** : La *Tête, les défenses blanches et la trompe articulée* du Grand Éléphant de bois et d'acier.
* **2e détail (pixels 9 à 16)** : Le corps massif avec ses vérins hydrauliques apparents et le *Kiosque/balcon à passagers* sur son dos.
* **3e détail (pixels 17 à 24)** : Les grandes voûtes métalliques des *Nefs des Chantiers* en arrière-plan.



---

**SUITE** *(Réponds « continue » pour afficher les niveaux 7 à 12 ainsi que les 4 sections récapitulatives finales dans le strict respect du gabarit).*

## Niveau 7 — Les Chantiers Navals (Grue Titan & Cales de Lancement) — difficulté 7/12

1. **Intention** : Introduire les plateformes suspendues à des chariots de grue (`chantiers_tole_g/m/d` qui se déplacent sur un rail horizontal aérien uniquement lorsque le joueur pose le pied dessus, avec retour lent quand il les quitte) combinées aux plans inclinés des cales de lancement (`chantiers_coque_navire`). La sensation recherchée est le vertige industriel et portuaire face aux géants d'acier des anciens chantiers navals de la Loire.
2. **Fiche chiffrée** :
* **Longueur** : 220 tuiles
* **Hauteur** : 22 tuiles (eau de la Loire à `y=20`, quai à `y=17`, sommet de la Grue Titan vers `y=4`)
* **Temps de référence** : 105 s
* **Nombre de pixels à collecter** : 24
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 16


3. **Découpage en zones** :
* **Zone 1 (x=0 à 42) — La Friche Industrielle et les Rails de Quai** : Départ sur le béton envahi de `chantiers_buisson_friche` et de rails (`chantiers_rails_tile_x`). Un premier palan de `chantiers_grue_portique` porte une `chantiers_tole_g/m/d` au-dessus d'une fosse peu profonde : dès que le joueur saute dessus, la tôle avance de 8 tuiles vers la droite à `3 tuiles/s`.
* *Plateformes* : `chantiers_sol_plein` (`x=0, y=17, L=16`), fosse basse `chantiers_sol_plein` (`x=16, y=19, L=10` — non mortelle), `chantiers_tole_g/m/d` mobile #1 (`x=17` → `x=25, y=16, L=3`), `chantiers_sol_plein` (`x=26, y=17, L=16`), `chantiers_toles_empilees` (`x=32, y=15, L=4`).
* *Obstacles* : `chantiers_obstacle_ferraille` (`x=37, y=16`).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(12,16)` [facile], `(21,14)` [facile, sur la trajectoire de la tôle mobile #1], `(34,13)` [facile], `(37,14)` [risqué, saut par-dessus la ferraille].
* *Checkpoint* : `lanterne_eteinte` à `x=40, y=16`.


* **Zone 2 (x=42 à 88) — Les Cales de Lancement Inclinées** : Le joueur progresse sur les plans inclinés en béton qui descendent vers la Loire et sur des structures de `chantiers_coque_navire`. Sur la cale, la pente pousse vers l'eau (`+1,5 tuile/s`) tandis que des chariots sur `chantiers_sol_rail_bord` remontent ou descendent.
* *Plateformes* : Cale inclinée #1 (`x=42, y=16` descendant à `x=52, y=18`), `chantiers_coque_navire` (`x=55, y=15, L=6`), `chantiers_tole_g/m/d` mobile #2 (`x=63` → `x=73, y=14, L=3`), `chantiers_coque_navire` (`x=76, y=12, L=6`), `chantiers_sol_plein` (`x=84, y=12, L=4`).
* *Obstacles* : `bassin_eau` en bas de cale (`x=50..84, y=20`), `chantiers_obstacle_ferraille` (`x=48, y=16` sur la pente, `x=58, y=14` sur la coque, `x=79, y=11`), `pointes_fer_1` suspendues à une poutrelle (`x=68, y=12` — oblige à s'accroupir `↓` sur la tôle mobile #2 pendant qu'elle avance !).
* *Ennemis* : `oiseau` (goéland industriel, `x=54` à `x=62`, `y=13`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(48,14)` [risqué, saut en pleine pente par-dessus la ferraille], `(58,12)` [risqué, sous le goéland], `(68,13)` [risqué, accroupi sous les pointes sur la tôle mobile #2], `(79,9)` [facile], `(56,18)` [caché, sur un `chantiers_poteau_amarrage` sous la première coque à `x=56, y=19`].
* *Checkpoint* : `lanterne_eteinte` à `x=86, y=11`.


* **Zone 3 (x=88 à 136) — L'Ascension des Pylônes de la Grue Titan** : Montée verticale et en zigzag dans le treillis métallique de `chantiers_grue_portique` en combinant accroche (`↑`), sauts précis et tôles suspendues verticales.
* *Plateformes* : Poutrelle `chantiers_tole_g/m/d` (`x=90, y=10, L=4`), `chantiers_tole_g/m/d` ascenseur #3 (`x=96, y=10` → monte à `y=6` quand on est dessus, `L=3`), poutrelle (`x=102, y=6, L=5`), `chantiers_tole_g/m/d` mobile #4 (`x=109` → `x=119, y=6, L=3`), poutrelle (`x=122, y=5, L=6`), poutrelle (`x=130, y=5, L=6`).
* *Obstacles* : Chute mortelle (`y=20`), `chantiers_obstacle_ferraille` (`x=104, y=5`, `x=125, y=4`), `vapeur` de soudure/tuyau (`x=114, y=5` — traverse la trajectoire de la tôle #4, obligeant à sauter sur place pendant que la tôle continue d'avancer sous les pieds du joueur).
* *Ennemis* : `oiseau` (`x=120` à `x=129`, `y=3`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(92,8)` [facile], `(97,5)` [facile, au sommet de l'ascenseur #3], `(114,3)` [risqué, au sommet du saut par-dessus le jet de vapeur sur la tôle mobile #4], `(125,2)` [risqué, entre ferraille et goéland], `(133,3)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=134, y=4`.


* **Zone 4 (x=136 à 186) — La Grande Flèche de la Grue Titan (Haute Altitude)** : Traversée spectaculaire tout en haut de la flèche jaune/grise de la Grue Titan, avec deux chariots suspendus successifs et des obstacles aériens qui exigent de sauter d'un chariot en mouvement à un autre.
* *Plateformes* : `chantiers_tole_g/m/d` mobile #5 (`x=138` → `x=150, y=5, L=3`, vitesse 3,5 tuiles/s), poutrelle relais (`x=153, y=5, L=3`), `chantiers_tole_g/m/d` mobile #6 (`x=158` → `x=172, y=5, L=3`, vitesse 3,5 tuiles/s), poutrelle (`x=175, y=6, L=5`), descente sur `chantiers_toles_empilees` (`x=182, y=9, L=4`).
* *Obstacles* : Chute mortelle (`y=20`), barre métallique `pointes_fer_2` à `x=143, y=3` (s'accroupir `↓`), barre `chantiers_obstacle_ferraille` à `x=147, y=5` (sauter par-dessus), double obstacle en Zone du chariot #6 : `pointes_fer_2` haute à `x=163, y=3` puis `chantiers_obstacle_ferraille` basse à `x=168, y=5`.
* *Ennemis* : `oiseau` (`x=152` à `x=159`, `y=3`, vitesse 4 tuiles/s), `oiseau` (`x=174` à `x=182`, `y=5`, vitesse 4 tuiles/s).
* *Pixels (6)* : `(143,4)` [facile, accroupi], `(147,2)` [risqué, saut sur chariot #5], `(154,3)` [facile], `(163,4)` [risqué], `(168,2)` [risqué, saut sur chariot #6], `(177,4)` [facile].
* *Checkpoint* : Aucun.


* **Zone 5 (x=186 à 220) — Le Belvédère de la Proue de l'Île** : Descente par paliers métalliques vers l'esplanade finale au pied de la Grue Titan.
* *Plateformes* : `chantiers_tole_g/m/d` (`x=186, y=12, L=6`), `chantiers_sol_plein` (`x=192, y=15, L=28`), `chantiers_toles_empilees` (`x=198, y=13, L=5`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (4)* : `(189,10)` [facile], `(200,11)` [facile], `(202,11)` [facile], `(208,14)` [facile].
* *Arrivée* : `chantiers_monument_chantiers` à `x=211, y=12` et `arche_arrivee` à `x=216, y=13`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (`x=0..26`, fosse non mortelle), paliers des checkpoints 2 (`x=86`) et 3 (`x=134`), et Zone 5.
* **Pic de difficulté** : Zone 4 (`x=138 à 174`), tout en haut de la flèche de la Grue Titan, où le joueur doit alterner accroupissement (`↓`) et saut vertical sur une plateforme de 3 tuiles qui avance toute seule sous ses pieds.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=16 à 26`)** : La `chantiers_tole_g/m/d` #1 surplombe une fosse sèche de 2 tuiles de profondeur. Quand le joueur monte dessus, une flèche peinte et un bruit de poulie indiquent qu'elle démarre vers la droite ; s'il saute et tombe à côté, il atterrit dans la fosse sans perdre de vie et remonte recommencer.
* **Test (`x=63 à 73` puis `Zone 4`)** : Rester sur la tôle en mouvement au-dessus du vide tout en esquivant des obstacles hauts (`↓`) et bas (saut).


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Les tôles d'acier (`chantiers_tole`) ont une friction `×0,7` ; la pente de la cale en Zone 2 glisse davantage (`+2,0 tuiles/s`). | L'élan accru en bas de la cale (`x=52`) donne un saut ultra-long vers la coque de navire (`x=55`). | Lorsqu'on saute verticalement sur les chariots #5 et #6 en Zone 4, il faut corriger de 0,3 tuile à l'atterrissage. | Pluie battante sur la tôle (son métallique sourd), ruissellement sur les cales. | Les tôles font 3 tuiles de large : atterrir au centre laisse 1,5 tuile de chaque côté. |
| **Soleil** | Dilatation et rails secs : les chariots de grue avancent `15 %` plus vite (`3,4` et `4,0 tuiles/s`). | Traversée des Zones 3 et 4 plus rapide (gain de ~6 s pour l'étoile de temps !). | Le rythme entre l'obstacle bas et l'obstacle haut en Zone 4 passe de `1,4 s` à `1,2 s`. | Ciel bleu industriel, reflets éblouissants sur l'acier et la Loire. | Un saut dure `0,6 s` et s'accroupir est instantané (`0,05 s`) : `1,2 s` laisse le double du temps requis. |
| **Neige** | Rails givrés : les chariots de grue démarrent avec un délai de `0,4 s` mais avancent de façon très régulière (`×0,85` vitesse, soit `2,5` et `3,0 tuiles/s`). | Plus de temps pour anticiper les obstacles hauts/bas pendant le trajet des chariots en Zone 4. | Les `chantiers_toles_empilees` fixes glissent légèrement (`friction ×0,75`). | Flocons sur les poutrelles de la Grue Titan, grincement de câble gelé. | Une vitesse de chariot plus douce (`3,0 tuiles/s`) facilite le saut vertical en mouvement. |
| **Brume** | Brouillard d'estuaire dense (`visibilité 7 tuiles`) ; projecteurs jaunes de chantier aux checkpoints et à chaque poulie de grue. | Les goélands (`oiseau`) volent `25 %` moins vite (`3 tuiles/s`). | En haut de la Grue Titan (Zone 4), on ne voit plus le sol ni l'eau tout en bas (sensation de vide absolu). | Nappe de brume cachant le bas de l'écran, corne de brume des remorqueurs. | Sur les chariots #5 et #6, les obstacles sont à 4–5 tuiles les uns des autres, donc toujours dans le rayon de 7 tuiles. |
| **Vent** | Fort vent d'altitude en Zones 3 et 4 (`-0,9 tuile/s` de face en l'air pendant 3 s toutes les 6 s) ; fait osciller légèrement les tôles suspendues (`±0,3 tuile`). | Si le joueur saute verticalement sur un chariot qui avance vers la droite pendant le vent de face, le vent le ramène vers l'arrière de la tôle (utile s'il avait sauté trop en avant). | Sauter verticalement sans avancer avec `→` sur un chariot en plein vent de face ferait atterrir 0,5 tuile plus en arrière. | Sifflement puissant dans le treillis de la Grue Titan, câbles qui vibrent. | En maintenant `→` à la même vitesse que le chariot (`3,5 tuiles/s` sur `6,9` disponibles), le joueur compense 100 % du vent. |
| **Orage** | Éclair toutes les 6 s : la Grue Titan agit comme paratonnerre ! `0,8 s` après le flash, les poutrelles fixes clignotent, mais les chariots suspendus (isolés par poulie) gagnent un boost de vitesse (`×1,2` pendant 2 s) et aimantent les pixels proches (rayon de 2 tuiles). | Les pixels risqués en haut des sauts de chariots (`(147,2)`, `(168,2)`) sont aspirés automatiquement à `2 tuiles` de distance pendant l'orage ! | Visibilité sombre entre deux éclairs et bruit de tonnerre métallique impressionnant. | Éclair frappant le sommet de la Grue Titan en arrière-plan, crépitement d'étincelles inoffensives. | L'aimantation des pixels évite même les sauts les plus risqués en Zone 4. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `pointes_fer_1`, `pointes_fer_2`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Île (Chantiers & commun)* : `chantiers_sol_plein`, `chantiers_sol_rail_bord`, `chantiers_tole_g`, `chantiers_tole_m`, `chantiers_tole_d`, `chantiers_grue_portique`, `chantiers_coque_navire`, `chantiers_rails_tile_x`, `chantiers_toles_empilees`, `chantiers_buisson_friche`, `chantiers_poteau_amarrage`, `chantiers_obstacle_ferraille`, `chantiers_fond_tile_x`, `chantiers_monument_chantiers`, `vapeur`, `bassin_eau`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 8)** : La silhouette jaune monumentale de la *Grue Titan* se découpant sur le ciel de l'estuaire.
* **2e détail (pixels 9 à 16)** : Les *Cales de lancement inclinées* en béton plongeant directement dans la Loire.
* **3e détail (pixels 17 à 24)** : Les rails de portiques, les coques de navires en mémoire et le panorama industriel de la pointe ouest de l'île.



---

## Niveau 8 — Les Anneaux de Buren (Quai des Antilles) — difficulté 8/12

1. **Intention** : Introduire les portails d'élan chromatiques (`buren_mat_anneau_grand/moyen/petit` : traverser un anneau en plein saut donne une impulsion aérienne horizontale de `+3 tuiles` et change de couleur — Rouge = boost horizontal, Bleu = boost vertical de `+2,5 tuiles`, Vert = inversion temporaire du courant d'air). La sensation recherchée est la fluidité acrobatique (« *flow* » aérien) le long de la perspective lumineuse du Quai des Antilles en bord de Loire.
2. **Fiche chiffrée** :
* **Longueur** : 240 tuiles
* **Hauteur** : 18 tuiles (Loire à `y=16`, quai à `y=14`, anneaux hauts vers `y=5`)
* **Temps de référence** : 95 s
* **Nombre de pixels à collecter** : 25
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 17


3. **Découpage en zones** :
* **Zone 1 (x=0 à 45) — L'Alignement du Quai des Antilles** : Départ sur le quai bordé de `buren_garde_corps_quai` et de `buren_banc_quai`. Le premier `buren_mat_anneau_grand` (Rouge) est placé au-dessus du quai continu : sauter au centre de l'anneau propulse le joueur de `+3 tuiles` vers l'avant (total du saut = 6,5 tuiles) dans un halo coloré.
* *Plateformes* : `buren_sol_plein` (`x=0, y=14, L=45`), `buren_banc_quai` (`x=12, y=13, L=3`), `buren_mat_anneau_grand` Rouge #1 (`x=18, y=11`), `buren_passerelle_inox_g/m/d` (`x=25, y=11, L=6`), `buren_mat_anneau_moyen` Bleu #2 (`x=34, y=10` — propulse de `+2,5 tuiles` vers le haut), `buren_passerelle_inox_g/m/d` (`x=37, y=7, L=6`).
* *Obstacles* : `buren_obstacle_bornes_pointes` (`x=22, y=13`, au sol sous la trajectoire de l'anneau #1).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(18,11)` [facile, au cœur de l'anneau #1], `(22,10)` [facile, dans le trait de propulsion], `(34,10)` [facile, au cœur de l'anneau #2], `(39,5)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=43, y=13`.


* **Zone 2 (x=45 à 95) — Les Passerelles d'Inox au-dessus de l'Estuaire** : Le quai s'ouvre sur des darses d'eau (`bassin_eau`). Le joueur enchaîne des sauts de `buren_passerelle_inox_g/m/d` en utilisant des anneaux Rouges (longueur) et Bleus (hauteur) pour franchir des brèches de 5 à 6 tuiles (infranchissables sans passer dans l'anneau).
* *Plateformes* : `buren_bord_eau` (`x=45, y=14, L=5`), `buren_mat_anneau_grand` Rouge #3 (`x=52, y=12`), `buren_passerelle_inox_g/m/d` (`x=58, y=12, L=5`), `buren_mat_anneau_moyen` Rouge #4 (`x=65, y=10`), `buren_passerelle_inox_g/m/d` (`x=71, y=10, L=5`), `buren_mat_anneau_petit` Bleu #5 (`x=78, y=9`), `buren_passerelle_inox_g/m/d` (`x=81, y=6, L=6`), `buren_sol_plein` (`x=89, y=14, L=6`).
* *Obstacles* : `bassin_eau` (`x=50..89, y=16`), `buren_obstacle_bornes_pointes` (`x=60, y=11`, `x=73, y=9`, `x=84, y=5`).
* *Ennemis* : `oiseau` (`x=66` à `x=74`, `y=8`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(55,11)` [facile, dans le boost #3], `(68,9)` [risqué, dans le boost #4 sous l'oiseau], `(78,9)` [facile], `(84,3)` [risqué, saut par-dessus les bornes à pointes], `(60,14)` [caché, sur une `buren_borne` isolée au ras de l'eau à `x=60, y=15`, d'où un anneau Bleu secret à `x=62, y=13` remonte sur la passerelle].
* *Checkpoint* : `lanterne_eteinte` à `x=93, y=13`.


* **Zone 3 (x=95 à 148) — La Chaîne d'Anneaux Sans Toucher Terre** : Séquence emblématique où le joueur enchaîne **3 anneaux consécutifs en plein vol** au-dessus de la Loire avant de retrouver une passerelle.
* *Plateformes* : `buren_sol_plein` (`x=95, y=14, L=6`), chaîne aérienne : `buren_mat_anneau_grand` Rouge #6 (`x=103, y=11`) → `buren_mat_anneau_moyen` Bleu #7 (`x=109, y=11`) → `buren_mat_anneau_moyen` Rouge #8 (`x=112, y=8`), atterrissage sur `buren_passerelle_inox_g/m/d` (`x=118, y=8, L=6`), puis `buren_passerelle_inox_g/m/d` (`x=127, y=10, L=5`), `buren_mat_anneau_petit` Rouge #9 (`x=134, y=8`), `buren_sol_plein` (`x=140, y=10, L=8`).
* *Obstacles* : `bassin_eau` (`x=101..140, y=16`), `buren_obstacle_bornes_pointes` (`x=120, y=7`, `x=129, y=9`, `x=143, y=9`).
* *Ennemis* : `oiseau` (`x=117` à `x=125`, `y=6`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(103,11)` [facile], `(109,11)` [facile], `(112,8)` [facile — les 3 jalonnent la trajectoire de la triple chaîne], `(120,5)` [risqué, entre les bornes et l'oiseau], `(137,7)` [facile], `(143,7)` [risqué].
* *Checkpoint* : `lanterne_eteinte` à `x=146, y=9`.


* **Zone 4 (x=148 à 204) — La Perspective Nocturne (Anneaux Alternants)** : Les `buren_mat_anneau_petit` de cette zone alternent entre **Rouge** (propulsion horizontale `+3 tuiles`) et **Bleu** (propulsion verticale `+2,5 tuiles`) toutes les `2,5 s` (un clignotement de 0,4 s prévient du changement de couleur). Le joueur doit sauter dans l'anneau au moment où il affiche la couleur menant à la bonne plateforme.
* *Plateformes* : `buren_passerelle_inox_g/m/d` (`x=148, y=10, L=5`), Anneau Alternant #10 (`x=155, y=9` : il faut le prendre en **Rouge** pour atteindre `x=161, y=9`), `buren_passerelle_inox_g/m/d` (`x=161, y=9, L=5`), Anneau Alternant #11 (`x=168, y=8` : il faut le prendre en **Bleu** pour monter à `x=170, y=5`, ou en **Rouge** pour aller chercher un pixel caché à `x=174, y=8`), `buren_passerelle_inox_g/m/d` haute (`x=170, y=5, L=6`), `buren_passerelle_inox_g/m/d` secrète (`x=174, y=8, L=4`), Anneau Rouge #12 (`x=179, y=6`), `buren_passerelle_inox_g/m/d` (`x=185, y=6, L=6`), Anneau Alternant #13 (`x=193, y=6` — prendre en **Rouge**), `buren_sol_plein` (`x=199, y=8, L=5`).
* *Obstacles* : `bassin_eau` (`x=153..199, y=16`), `buren_obstacle_bornes_pointes` (`x=163, y=8`, `x=172, y=4`, `x=187, y=5`, `x=189, y=5`).
* *Ennemis* : `oiseau` (`x=160` à `x=167`, `y=7`, vitesse 4,5 tuiles/s), `oiseau` (`x=184` à `x=191`, `y=4`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(158,8)` [facile], `(163,6)` [risqué], `(172,2)` [risqué], `(176,6)` [caché, en prenant l'Anneau #11 quand il est Rouge vers la passerelle secrète], `(188,3)` [risqué, entre deux bornes à pointes sous l'oiseau], `(196,5)` [facile].
* *Checkpoint* : Aucun.


* **Zone 5 (x=204 à 240) — Le Grand Envol Chromatique Final** : Une rampe finale de 4 anneaux alignés en perspective (Rouge → Bleu → Rouge → Vert) qui fait voler le joueur d'un trait joyeux au-dessus du quai jusqu'à l'arche d'arrivée.
* *Plateformes* : `buren_sol_plein` (`x=204, y=12, L=36`), alignement de 4 `buren_mat_anneau_grand` (`x=210, y=10`, `x=216, y=10`, `x=219, y=7`, `x=225, y=7`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (4)* : `(210,10)`, `(216,10)`, `(219,7)`, `(225,7)` [4 pixels faciles pris en une seule trajectoire fluide à travers les 4 anneaux].
* *Arrivée* : `buren_monument_buren` à `x=231, y=9` et `arche_arrivee` à `x=236, y=10`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (quai continu sous les 2 premiers anneaux), paliers des checkpoints 2 (`x=93`) et 3 (`x=146`), et Zone 5 (récompense de *flow* pur sans abîme).
* **Pic de difficulté** : Zone 4 (`x=155 à 198`), où il faut lire le rythme de changement de couleur des `buren_mat_anneau_petit` tout en esquivant les bornes à pointes et les mouettes sur les passerelles en inox.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=16 à 40`)** : Les anneaux #1 (Rouge, horizontal) et #2 (Bleu, vertical) sont placés au-dessus du grand quai pavé continu de la Zone 1. Même si le joueur rate le centre de l'anneau, il retombe sur le quai sans aucun dégât et voit les flèches lumineuses qui indiquent la direction du boost.
* **Test (`Zone 3 : x=103 à 118`)** : La triple chaîne d'anneaux au-dessus de la Loire exige de faire confiance à la trajectoire automatique d'un anneau à l'autre sans paniquer.


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Les `buren_passerelle_inox` mouillées ont une friction `×0,65` (très glissantes), mais les anneaux lumineux remettent la vitesse horizontale à une valeur fixe et propre dès qu'on les traverse. | Enchaîner les anneaux dès l'atterrissage (« *bunny hop* ») permet d'ignorer totalement la glisse de l'inox ! | Si l'on s'arrête sur une passerelle en inox près d'une `buren_obstacle_bornes_pointes`, il faut freiner 0,5 tuile plus tôt. | Pluie fine se reflétant en néons multicolores (rouge, bleu, vert) sur le quai mouillé. | Chaque passerelle d'inox fait 5 à 6 tuiles de large et les bornes sont au centre, laissant 2,5 tuiles d'arrêt dès la réception. |
| **Soleil** | Les anneaux en pleine lumière ont une hitbox d'activation élargie de `+25 %` (`1,5 tuile` de rayon au lieu de `1,2`) et donnent `+0,5 tuile` de boost bonus. | Impossible ou presque de rater un anneau en sautant vers lui. | Le boost légèrement plus long (`+3,5 tuiles`) fait atterrir 0,5 tuile plus près du centre des passerelles. | Reflets argentés sur les anneaux d'inox, ciel dégagé sur l'estuaire. | Les passerelles de 5–6 tuiles absorbent largement les `+0,5 tuile` de portée. |
| **Neige** | Le froid stabilise les LED des anneaux alternants de la Zone 4 : ils changent de couleur toutes les `3,5 s` au lieu de `2,5 s`. | Fenêtre de timing beaucoup plus confortable (+40 % de temps) en Zone 4 ! | Le quai et les passerelles d'inox ont une friction `×0,7`. | Flocons illuminés en rouge et bleu autour des anneaux, ambiance nocturne polaire. | Le ralentissement du cycle des anneaux rend le pic de difficulté de la Zone 4 plus accessible. |
| **Brume** | Visibilité de la pierre/route réduite à 6 tuiles, **MAIS** les anneaux LED de Buren percent la brume et restent visibles à `14 tuiles` de distance ! | Les anneaux servent de phares lumineux dans le brouillard, guidant exactement la trajectoire du joueur. | Les `buren_obstacle_bornes_pointes` sombres sur les passerelles ne se voient qu'à 6 tuiles. | Magnifique halo néon rouge/vert/bleu diffus dans `brume_bande_tile_x`. | 6 tuiles de visibilité à la réception d'un anneau laissent toujours voir toute la passerelle d'atterrissage (large de 5–6 tuiles). |
| **Vent** | Fort vent d'estuaire de face (`-1,0 tuile/s` en l'air hors anneau), **MAIS** la propulsion à l'intérieur du flux d'un anneau ignore 100 % du vent pendant `0,6 s`. | Tant que le joueur utilise les anneaux, ses trajectoires restent exactes au pixel près. | Les petits sauts normaux sur les passerelles (par-dessus les bornes à pointes) sont raccourcis de 0,5 tuile. | Clapotis nerveux de la Loire contre le `buren_bord_eau`, sifflement dans les anneaux. | Sauter par-dessus une borne de 1 tuile ne demande que 1,5 tuile de longueur (contre 3,4 disponibles même face au vent). |
| **Orage** | Éclair toutes les 5 s : la surtension fait passer temporairement tous les anneaux en mode **Hyper-Arc-en-Ciel** pendant `1,5 s` (portée `+4 tuiles` et destruction de l'oiseau le plus proche si on le touche pendant le boost). | Permet de traverser un oiseau sans subir de dégât pendant les 1,5 s qui suivent un éclair ! | Les anneaux alternants de la Zone 4 changent immédiatement de couleur au moment précis du coup de tonnerre. | Éclairs se reflétant dans les 18 anneaux alignés, synthé électro + tonnerre. | Le flash de l'éclair précède le tonnerre de 0,5 s, avertissant toujours du changement de couleur. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Île (Buren & commun)* : `buren_sol_plein`, `buren_bord_eau`, `buren_passerelle_inox_g`, `buren_passerelle_inox_m`, `buren_passerelle_inox_d`, `buren_mat_anneau_grand`, `buren_mat_anneau_moyen`, `buren_mat_anneau_petit`, `buren_borne`, `buren_garde_corps_quai`, `buren_banc_quai`, `buren_obstacle_bornes_pointes`, `buren_fond_tile_x`, `buren_monument_buren`, `bassin_eau`.
* *Ciel & Signes* : `ciel_nuit`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun (le moteur teinte simplement le halo de `buren_mat_anneau_*` en rouge, bleu ou vert).


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 9)** : L'enfilade en perspective des *Anneaux lumineux rouges, verts et bleus* (œuvre de Daniel Buren et Patrick Bouchain).
* **2e détail (pixels 10 à 17)** : Le *Quai des Antilles*, sa rambarde en bord de Loire et les reflets néon dans l'eau sombre du fleuve.
* **3e détail (pixels 18 à 25)** : La silhouette lointaine des grues Titan et le ciel crépusculaire de l'estuaire.



---

## Niveau 9 — Le Hangar à Bananes — difficulté 9/12

1. **Intention** : Introduire les conteneurs maritimes suspendus à des portiques (`hangar_conteneur_bleu` à mouvement horizontal et `hangar_conteneur_rouge` à mouvement vertical) ainsi que les portes d'entrepôt coulissantes (`hangar_porte_coulissante`), avant d'affronter le **2e Boss du jeu** (la Moisissure Géante / Spores Tropicales dans la mûrisserie abandonnée). La sensation recherchée est l'exploration industrielle rythmée entre les quais festifs illuminés de guirlandes et les profondeurs humides de l'ancien entrepôt fruitier.
2. **Fiche chiffrée** :
* **Longueur** : 230 tuiles (dont arène de Boss de `x=175` à `x=230`)
* **Hauteur** : 22 tuiles (sol du hangar à `y=19`, sommet des empilements de conteneurs et grues à `y=5`)
* **Temps de référence** : 120 s (dont 50 s de Boss)
* **Nombre de pixels à collecter** : 26
* **Nombre de checkpoints** : 3 (dont 1 devant l'entrée de la mûrisserie du Boss à `x=173`)
* **Nombre d'obstacles mortels** : 16 (hors Boss)


3. **Découpage en zones** :
* **Zone 1 (x=0 à 44) — La Terrasse de Bois et les Guirlandes du Quai** : Départ sur `hangar_terrasse_bois_g/m/d` sous `hangar_guirlande_lumineuse`. Un premier `hangar_conteneur_bleu` est posé puis soulevé par une `hangar_grue_quai` : le joueur apprend à monter sur le toit du conteneur (hauteur 3 tuiles, accessible via accroche `↑` ou depuis une pile de `hangar_palettes_caisses`).
* *Plateformes* : `hangar_terrasse_bois_g/m/d` (`x=0, y=19, L=20`), `hangar_palettes_caisses` (`x=14, y=17, L=3`), `hangar_conteneur_bleu` fixe #1 (`x=19, y=15, L=6`), `hangar_conteneur_bleu` mobile horizontal #2 (`x=27` ↔ `x=33, y=15, L=5`, vitesse 2,5 tuiles/s), `hangar_sol_plein` (`x=36, y=19, L=8`).
* *Obstacles* : `hangar_obstacle_tole_coupante` (`x=25, y=18`, au sol sous les conteneurs).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(15,15)` [facile], `(22,13)` [facile], `(30,13)` [facile, sur le conteneur mobile #2], `(25,16)` [risqué, entre le conteneur et la tôle coupante].
* *Checkpoint* : `lanterne_eteinte` à `x=42, y=18`.


* **Zone 2 (x=44 à 90) — Le Dock aux Conteneurs (Bleus vs Rouges)** : Le joueur navigue dans un labyrinthe aérien de `hangar_conteneur_bleu` (qui coulissent horizontalement) et de `hangar_conteneur_rouge` (qui montent et descendent sur des câbles de `hangar_grue_quai`), en évitant de se faire coincer entre deux conteneurs.
* *Plateformes* : `hangar_palettes_caisses` (`x=45, y=17, L=3`), `hangar_conteneur_rouge` vertical #3 (`x=50, y=17` ↔ `y=12, L=5`, cycle 4 s), `hangar_conteneur_bleu` horizontal #4 (`x=57` ↔ `x=64, y=12, L=5`), `hangar_conteneur_rouge` vertical #5 (`x=69, y=14` ↔ `y=9, L=5`), `hangar_conteneur_bleu` fixe #6 (`x=77, y=9, L=6`), `hangar_sol_rail` (`x=85, y=13, L=5`).
* *Obstacles* : Chute sur `hangar_obstacle_tole_coupante` en bas (`x=48..84, y=18`), `hangar_obstacle_tole_coupante` sur le toit du conteneur #6 (`x=80, y=8`).
* *Ennemis* : `oiseau` (`x=65` à `x=75`, `y=8`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(52,10)` [facile, au point haut du conteneur rouge #3], `(61,10)` [facile], `(71,7)` [risqué, au point haut du conteneur #5 sous l'oiseau], `(80,6)` [risqué, saut par-dessus la tôle coupante], `(59,15)` [caché, sur une palette suspendue sous le conteneur bleu #4 à `x=59, y=16`].
* *Checkpoint* : `lanterne_eteinte` à `x=88, y=12`.


* **Zone 3 (x=90 à 132) — Les Portes Coulissantes du Hangar** : Entrée dans `hangar_facade`. Des `hangar_porte_coulissante` s'ouvrent et se referment horizontalement ou verticalement toutes les 3 s : il faut sprinter ou glisser accroupi (`↓`) dans l'ouverture avant la fermeture tout en sautant de palette en conteneur.
* *Plateformes* : `hangar_sol_plein` (`x=90, y=13, L=14`), `hangar_porte_coulissante` #1 (`x=98, y=10..13` — laisse 1 tuile en bas pendant 1,5 s puis s'ouvre complètement 1,5 s), `hangar_palettes_caisses` (`x=106, y=11, L=4`), `hangar_conteneur_bleu` #7 (`x=113, y=9, L=5`), `hangar_porte_coulissante` #2 (`x=118, y=6..9`), `hangar_sol_plein` (`x=120, y=9, L=12`).
* *Obstacles* : `hangar_obstacle_tole_coupante` (`x=102, y=12`, `x=110, y=12`, `x=125, y=8`), fermeture complète des portes coulissantes (repousse ou écrase si on reste dans le rail).
* *Ennemis* : `tonneau` (fût métallique roulant de `x=130` vers `x=120` à `y=8`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(98,12)` [facile, sous la porte #1], `(108,9)` [facile], `(115,7)` [facile], `(118,8)` [risqué, juste dans le rail de la porte #2], `(125,6)` [risqué, saut par-dessus la tôle et le fût roulant].
* *Checkpoint* : Aucun.


* **Zone 4 (x=132 à 175) — La Chaîne de Levage sous les Guirlandes** : Grande halle intérieure où les conteneurs rouges et bleus se croisent au-dessus de fosses de fret, éclairés par `hangar_guirlande_lumineuse`, avant la porte blindée de l'ancienne mûrisserie.
* *Plateformes* : `hangar_conteneur_rouge` #8 (`x=134, y=12` ↔ `y=8, L=5`), `hangar_conteneur_bleu` #9 (`x=142` ↔ `x=149, y=8, L=5`), `hangar_palettes_caisses` (`x=153, y=10, L=3`), `hangar_conteneur_rouge` #10 (`x=159, y=14` ↔ `y=9, L=5`), `hangar_sol_plein` (`x=167, y=14, L=8`).
* *Obstacles* : `hangar_obstacle_tole_coupante` en bas (`x=132..167, y=18`), `hangar_obstacle_tole_coupante` (`x=145, y=7` au milieu du conteneur #9), `hangar_porte_coulissante` #3 (`x=169, y=11..14`).
* *Ennemis* : `oiseau` (`x=150` à `x=158`, `y=8`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(136,6)` [facile], `(145,5)` [risqué, saut par-dessus la tôle sur le conteneur #9 en mouvement], `(154,8)` [risqué, sous l'oiseau], `(161,7)` [facile], `(161,15)` [caché, tout en bas du cycle du conteneur #10 juste au-dessus des tôles du fond], `(170,13)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=173, y=13` (Checkpoint de Boss).


* **Zone 5 (x=175 à 230) — Arène du Boss : La Mûrisserie Infectée (La Moisissure Géante)** : Salle industrielle de 55 tuiles de large et 16 tuiles de haut (`y=4` à `y=19`). Le cœur de la Moisissure occupe le fond central et fait monter un tapis fongique toxique au sol, tandis que 3 grands ventilateurs/projecteurs thermiques sous le plafond (`x=184, y=7`, `x=202, y=6`, `x=220, y=7`) permettent de l'assécher et de la vaincre.
* *Plateformes* : `hangar_sol_plein` (`x=175, y=19, L=55`), `hangar_palettes_caisses` (`x=180, y=16, L=4`, `x=222, y=16, L=4`), `hangar_conteneur_rouge` vertical Gauche (`x=186, y=15` ↔ `y=9, L=5`), `hangar_conteneur_bleu` horizontal Central (`x=196` ↔ `x=206, y=11, L=5`), `hangar_conteneur_rouge` vertical Droit (`x=214, y=15` ↔ `y=9, L=5`), passerelles des 3 Extracteurs/Lampes UV (`x=182, y=7, L=4`, `x=200, y=6, L=5`, `x=218, y=7, L=4`).
* *Pixels (6, dans l'arène)* : `(181,14)` [facile], `(188,8)` [facile], `(202,9)` [risqué, sur le conteneur central], `(216,8)` [facile], `(202,4)` [risqué, au-dessus de l'extracteur central], `(225,17)` [facile, une fois le Boss purifié].
* *Arrivée* : `hangar_monument_hangar` à `x=224, y=16` et `arche_arrivee` à `x=228, y=17`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (`x=0..24`), paliers des checkpoints 2 (`x=88`) et 3 (`x=173`), et les fenêtres de répit de 4 s après chaque lampe UV allumée contre le Boss.
* **Pic de difficulté** : Zone 4 (`x=134..166`) et Phase 3 du Boss de la Moisissure en Zone 5.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=14 à 35`)** : Le joueur utilise les `hangar_palettes_caisses` pour monter sur un premier `hangar_conteneur_bleu` fixe, puis sur un second qui coulisse doucement au-dessus d'un sol majoritairement sûr, observant la différence de code couleur (Bleu = horizontal, Rouge en Zone 2 = vertical).
* **Test (`Zone 2` et `Zone 5`)** : Sauter d'un conteneur rouge vertical au sommet de sa course vers un conteneur bleu horizontal en mouvement.


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Humidité ambiante : pendant le Boss (Zone 5), le tapis de moisissure au sol monte de `+0,5 tuile` plus haut (`y=16,5` au lieu de `y=17`) ; en extérieur (Zones 1–2), le toit des conteneurs a une friction `×0,75`. | La pluie nettoie les spores aériennes : en Phases 2 et 3 du Boss, les spores tombent verticalement sans dériver horizontalement. | Il faut quitter le sol de l'arène du Boss 0,5 s plus tôt en montant sur les palettes (`y=16`). | Pluie sur la tôle des conteneurs, gouttières du hangar qui débordent. | Les palettes à `y=16` et les conteneurs entre `y=15` et `y=9` restent toujours hors d'atteinte du tapis fongique (`y=16,5`). |
| **Soleil** | L'air chaud et sec affaiblit naturellement la Moisissure : chaque phase du Boss dure `2 s` de moins (`10 s` au lieu de `12 s`) ! | Boss sensiblement plus court et visibilité parfaite dans tout le hangar. | Les grues portuaire tournent à plein régime : conteneurs mobiles `+15 %` plus rapides (`2,9 tuiles/s`). | Rayons de soleil dorés sur la terrasse en bois du quai, guirlandes éteintes le jour. | Les conteneurs font 5 tuiles de large : à `2,9 tuiles/s`, on dispose de près de 2 s complètes par traversée. |
| **Neige** | Le gel fige les spores : la Moisissure met `1,2 s` (au lieu de `0,8 s`) avant de faire éclore ses bulles toxiques ; la terrasse en bois (Zone 1) et les conteneurs extérieurs (Zone 2) ont une friction `×0,7`. | Temps de réaction très généreux contre les attaques du Boss en Zone 5 (qui est en intérieur, donc sans glisse !). | Léger patinage sur les conteneurs de la Zone 2. | Neige posée sur les conteneurs bleus et rouges, buée dans l'entrepôt. | L'intérieur du hangar (Zones 3, 4 et 5) est abrité de la neige au sol, donc le Boss profite du bonus sans le malus de glisse. |
| **Brume** | Nappe de brume + nuage de spores (`visibilité 7 tuiles`), mais les `hangar_guirlande_lumineuse` éclairent le chemin principal sur 5 tuiles. | Les `hangar_porte_coulissante` sont ralenties par la condensation (`cycle de 4 s` au lieu de `3 s`). | En Zone 5, on ne voit le côté opposé de l'arène qu'en s'approchant du conteneur central. | Halos multicolores des guirlandes de fête dans la brume portuaire. | L'Extracteur UV à activer pendant le Boss émet un puissant faisceau lumineux visible à travers toute la brume. |
| **Vent** | En Zones 1 et 2 (quai ouvert), rafales de `+0,8 tuile/s` vers la droite ; en Zone 5, les courants d'air du hangar poussent les spores du Boss de `1 tuile` vers la droite. | Facilite les grands sauts entre conteneurs en Zone 2. | Lors du Boss, il faut se placer `1 tuile` à gauche de l'ombre d'une spore qui tombe du plafond. | Guirlandes lumineuses qui se balancent, sifflement dans les portes coulissantes. | Les conteneurs de l'arène font 5 tuiles de large, laissant 4 tuiles sûres à côté de chaque spore. |
| **Orage** | Éclair toutes les 5 s : la surtension fait clignoter les `hangar_guirlande_lumineuse` et déclenche un flash UV gratuit qui étourdit la Moisissure pendant `1,5 s` ! | Pendant 1,5 s après chaque éclair, le Boss cesse de lancer des spores. | Les `hangar_porte_coulissante` électriques en Zones 3 et 4 se ferment 20 % plus vite après un coup de tonnerre. | Flash électrique sur les grues du quai, bourdonnement de transformateur. | Les portes coulissantes laissent toujours 1,5 s d'ouverture pleine par cycle. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Île (Hangar)* : `hangar_sol_plein`, `hangar_sol_rail`, `hangar_terrasse_bois_g`, `hangar_terrasse_bois_m`, `hangar_terrasse_bois_d`, `hangar_facade`, `hangar_porte_coulissante`, `hangar_conteneur_bleu`, `hangar_conteneur_rouge`, `hangar_palettes_caisses`, `hangar_grue_quai`, `hangar_guirlande_lumineuse`, `hangar_obstacle_tole_coupante`, `hangar_fond_tile_x`, `hangar_monument_hangar`.
* *Château (réemploi)* : `tonneau`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* :
* `SPRITE MANQUANT : hangar_boss_moisissure (80×64 px soit 5×4 tuiles, amas organique violet/vert luminescent de moisissure tropicale envahissant le fond de la mûrisserie)`.
* `SPRITE MANQUANT : hangar_spore_toxique (16×16 px, bulle de spore flottante verte/violette lancée par le Boss)`.
* `SPRITE MANQUANT : hangar_lampe_uv (32×16 px soit 2×1 tuiles, projecteur thermique / ventilateur UV de plafond à allumer pour purifier la moisissure)`.




8. **Boss — La Moisissure Géante de la Mûrisserie (Zone 5, durée totale ~50 s)** :
* *Principe* : Une colonie fongique géante (`hangar_boss_moisissure`) a envahi l'ancienne chambre de mûrissement des bananes. Le joueur ne frappe pas : il doit utiliser les conteneurs mobiles de l'arène pour atteindre et allumer **3 projecteurs UV / ventilateurs d'assèchement** (`hangar_lampe_uv`) situés en haut de la salle.
* **Phase 1 — Le Tapis Fongique & Pluie de Spores (12 s + 4 s de répit)** :
* *Pattern* : La Moisissure recouvre le sol (`y=19` puis `y=18` deviennent mortels en `2 s`, obligeant le joueur à grimper sur les `hangar_palettes_caisses` à `y=16` puis sur les conteneurs). Toutes les `3 s`, elle relâche une salve de 3 `hangar_spore_toxique` qui tombent lentement (`2,5 tuiles/s`) depuis le plafond en laissant des brèches de 4 tuiles entre elles (`2 à 12 s`).
* *Fenêtre de répit (4 s)* : Le **Projecteur UV #1** (gauche, `x=184, y=7`) clignote en vert. Le joueur prend le `hangar_conteneur_rouge` gauche (`x=186`) jusqu'à `y=9` et saute toucher le projecteur. Le faisceau lumineux brûle un tiers de la Moisissure.


* **Phase 2 — Les Racines Rampantes sur Conteneurs (14 s + 4 s de répit)** :
* *Pattern* : La Moisissure tente d'envahir un conteneur sur deux : un contour violet clignote `1,5 s` sur le toit du conteneur avant que des filaments mortels n'en sortent pendant `3 s`. Le joueur doit sauter du conteneur infecté vers le `hangar_conteneur_bleu` central (`x=196..206`) tout en évitant 2 vagues de spores diagonales (`0 à 14 s`).
* *Fenêtre de répit (4 s)* : Le **Projecteur UV #2** (droite, `x=220, y=7`) s'active. Le joueur utilise le conteneur central vers le `hangar_conteneur_rouge` droit (`x=214`) pour l'allumer.


* **Phase 3 — Tempête de Spores & Purification Finale (14 s + ouverture de l'Arche)** :
* *Pattern* : Les deux conteneurs rouges montent et descendent en opposition de phase tandis que la Moisissure émet deux anneaux expansifs de spores espacés de 5 tuiles (que l'on franchit en passant sous l'anneau sur un conteneur bas, puis en remontant avec le conteneur).
* *Objectif final* : Au bout de `14 s`, le **Projecteur UV #3 Central** (`x=202, y=6`) se déverrouille. Le joueur saute depuis le sommet du conteneur rouge (`y=9`) vers le conteneur bleu central (`y=11`), puis bondit vers la passerelle haute (`x=200, y=6`). L'illumination finale dissout complètement la Moisissure, nettoie le sol (`y=19`) et ouvre l'`arche_arrivee`.




9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 9)** : La longue *Façade industrielle du Hangar à Bananes* bordée de ses terrasses en bois et de ses guirlandes lumineuses.
* **2e détail (pixels 10 à 18)** : Les *Grues de quai* historiques et les conteneurs colorés du port.
* **3e détail (pixels 19 à 26)** : Le reflet des lumières de la vie nocturne nantaise sur les eaux de la Loire.



---

## Niveau 10 — Passage Pommeraye (Monument provisoire) — difficulté 10/12

1. **Intention** : Exploiter un niveau **100 % vertical ascendant et descendant** sur 3 étages de galeries reliés par le célèbre `pommeraye_escalier_monumental`, introduisant les dalles de verre fragiles de la verrière (`memorial_sol_dalle_verre` / vitrage qui se fissure au contact et cède après `0,8 s`) et les balcons à statues. La sensation recherchée est l'élégance vertigineuse d'un joyau architectural du XIXe siècle où la précision des appuis compte à chaque marche.
2. **Fiche chiffrée** :
* **Longueur** : 210 tuiles (structurée en grands paliers étagés de la rue de la Fosse à la rue Santeuil)
* **Hauteur** : 26 tuiles (Niveau Inférieur à `y=23`, Mezzanine à `y=16`, Galerie Supérieure et Verrière à `y=8`)
* **Temps de référence** : 105 s
* **Nombre de pixels à collecter** : 26
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 18


3. **Découpage en zones** :
* **Zone 1 (x=0 à 42) — La Galerie Inférieure (Entrée Rue de la Fosse)** : Départ entre les boutiques élégantes (`pommeraye_devanture_a-b`) et les `pommeraye_pilier_galerie`. Un premier lanterneau en verre (`memorial_sol_dalle_verre`) est posé à 2 tuiles au-dessus du sol : marcher dessus le fait craquer après `0,8 s` (et il se régénère après `3 s`), apprenant au joueur à ne jamais s'arrêter sur le verre.
* *Plateformes* : `pommeraye_sol_plein` (`x=0, y=23, L=42`), auvent `pommeraye_balcon_galerie_g/m/d` (`x=12, y=20, L=5`), dalle fragile `memorial_sol_dalle_verre` (`x=20, y=19, L=3` — cède après 0,8 s), `pommeraye_balcon_galerie_g/m/d` (`x=26, y=18, L=6`), `pommeraye_marche` (`x=35, y=21, L=5`).
* *Obstacles* : `pommeraye_obstacle_grille_pointes` (`x=29, y=17` sur le balcon, `x=33, y=22` au sol).
* *Ennemis* : Aucun.
* *Pixels (4)* : `(14,18)` [facile], `(21,17)` [facile, sur la dalle de verre tutorielle], `(29,15)` [risqué, saut par-dessus la grille à pointes], `(37,19)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=40, y=20`.


* **Zone 2 (x=42 à 86) — Le Grand Escalier Central de Bois et de Fonte** : Ascension le long des volées de `pommeraye_escalier_monumental` ornées de `pommeraye_statue` (les célèbres statues d'enfants et d'allégories) et surplombées de `pommeraye_lustre` oscillants.
* *Plateformes* : Volées de `pommeraye_escalier_monumental` (`x=42..52, y=20` → `y=17`, `x=55..65, y=17` → `y=14`), socle de `pommeraye_statue` (`x=53, y=15, L=2`), `pommeraye_lustre` oscillant #1 (`x=68..71, y=13, L=3`), `pommeraye_balcon_galerie_g/m/d` Mezzanine (`x=74, y=14, L=12`), balcon haut (`x=76, y=10, L=6`).
* *Obstacles* : Chute dans la cage d'escalier (`x=52..74, y=24`), `pommeraye_obstacle_grille_pointes` (`x=48, y=18`, `x=60, y=15`, `x=80, y=13`), `cierge_flamme` sur les bords du lustre.
* *Ennemis* : `oiseau` (moineau entré sous la verrière, `x=64` à `x=73`, `y=11`, vitesse 4 tuiles/s).
* *Pixels (5)* : `(48,16)` [facile], `(53,13)` [facile, sur la statue], `(69,11)` [risqué, sur le lustre sous le moineau], `(79,8)` [caché, sur le balcon haut à `y=10` accessible via accroche `↑` depuis le lustre], `(82,12)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=84, y=13`.


* **Zone 3 (x=86 à 132) — La Mezzanine & les Coursives à Colonnes** : Traversée à mi-hauteur (`y=14` à `y=10`) en alternant balcons en fonte (`pommeraye_balcon_galerie_g/m/d`) et ponts de verre (`memorial_sol_dalle_verre`) qui obligent à un rythme de saut continu sans hésitation.
* *Plateformes* : `memorial_sol_dalle_verre` #1 (`x=88, y=13, L=3`), `memorial_sol_dalle_verre` #2 (`x=94, y=12, L=3`), `pommeraye_balcon_galerie_g/m/d` (`x=100, y=12, L=6`), `pommeraye_lustre` #2 (`x=109..112, y=11, L=3`), `memorial_sol_dalle_verre` #3 (`x=115, y=10, L=3`), `memorial_sol_dalle_verre` #4 (`x=121, y=9, L=3`), `pommeraye_balcon_galerie_g/m/d` (`x=126, y=9, L=6`).
* *Obstacles* : Chute mortelle (`y=24`), `pommeraye_obstacle_grille_pointes` (`x=103, y=11`, `x=128, y=8`), `pointes_fer_1` suspendues à un arceau (`x=91, y=10` — oblige à un saut rasant entre les dalles de verre #1 et #2).
* *Ennemis* : `oiseau` (`x=114` à `x=123`, `y=7`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(89,11)` [facile], `(95,10)` [risqué, après le saut rasant], `(103,9)` [risqué, au-dessus de la grille], `(110,9)` [facile, sur le lustre #2], `(116,8)` [risqué, sur dalle de verre sous l'oiseau], `(122,7)` [risqué].
* *Checkpoint* : `lanterne_eteinte` à `x=130, y=8`.


* **Zone 4 (x=132 à 178) — Sous la Grande Verrière (`pommeraye_verriere_tile_x`)** : Point culminant du niveau, tout en haut sous la verrière métallique. Le joueur court sur une succession de panneaux de verre fragiles, de chapiteaux de `pommeraye_pilier_galerie` et de lustres, où chaque arrêt de plus de `0,8 s` sur le verre est fatal.
* *Plateformes* : `memorial_sol_dalle_verre` (`x=134, y=8, L=3`), chapiteau `pommeraye_pilier_galerie` (`x=140, y=8, L=2` — solide ! sert d'îlot de repos), `memorial_sol_dalle_verre` (`x=145, y=7, L=3`), `pommeraye_lustre` #3 (`x=151..154, y=7, L=3`), `memorial_sol_dalle_verre` (`x=157, y=6, L=3`), chapiteau `pommeraye_pilier_galerie` (`x=163, y=6, L=2`), `memorial_sol_dalle_verre` (`x=168, y=7, L=3`), `pommeraye_balcon_galerie_g/m/d` (`x=173, y=8, L=5`).
* *Obstacles* : Chute mortelle (`y=24`), `pommeraye_obstacle_grille_pointes` (`x=138, y=11`, `x=160, y=9`, `x=175, y=7`), `cierge_flamme` sur le lustre #3.
* *Ennemis* : `oiseau` (`x=144` à `x=152`, `y=5`, vitesse 4,5 tuiles/s), `oiseau` (`x=162` à `x=170`, `y=4`, vitesse 4,5 tuiles/s).
* *Pixels (7)* : `(135,6)` [facile], `(140,6)` [facile], `(146,5)` [risqué], `(152,5)` [risqué, sur le lustre #3], `(158,4)` [risqué], `(169,5)` [risqué], `(163,11)` [caché, sur une corniche intermédiaire du pilier à `x=163, y=12`, d'où l'on remonte par un escalier de service à `x=166, y=10`].
* *Checkpoint* : Aucun.


* **Zone 5 (x=178 à 210) — La Galerie Supérieure (Sortie Rue Santeuil)** : Arrivée lumineuse sur le palier noble du haut du passage, bordé de devantures en bois sculpté.
* *Plateformes* : `pommeraye_sol_plein` (`x=178, y=8, L=32`), `pommeraye_marche` (`x=184, y=7, L=10`).
* *Obstacles* : Aucun.
* *Ennemis* : Aucun.
* *Pixels (4)* : `(186,5)`, `(188,5)`, `(190,5)`, `(192,5)` [faciles, alignés sous la dernière arche de la galerie].
* *Arrivée* : `pommeraye_monument_pommeraye` à `x=200, y=5` et `arche_arrivee` à `x=205, y=6`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Zone 1 (`x=0..25`), paliers des checkpoints 2 (`x=84`) et 3 (`x=130`), les 2 chapiteaux solides (`x=140` et `x=163`) en Zone 4, et la Zone 5.
* **Pic de difficulté** : Zone 4 (`x=134 à 173`), sous la verrière, où il faut enchaîner dalles de verre de `0,8 s` et lustres oscillants sans jamais perdre son rythme.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=20 à 23`)** : La première `memorial_sol_dalle_verre` est posée à seulement 4 tuiles au-dessus du sol continu de la Galerie Inférieure. Quand le joueur marche dessus, un son cristallin de fissure retentit et la dalle disparaît au bout de `0,8 s`, faisant tomber le joueur sur le carrelage sans aucun dégât avant de réapparaître `3 s` plus tard.
* **Test (`Zones 3 et 4`)** : Traverser des ponts de dalles de verre successives au-dessus du grand vide central du passage.


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Le Passage Pommeraye est **couvert par sa verrière** : aucune glisse sur les balcons et escaliers intérieurs ! En revanche, le poids de l'eau sur la verrière en Zone 4 réduit la durée des dalles de verre de `0,8 s` à `0,65 s`. | Zéro patinage dans tout le niveau malgré la pluie extérieure. | Il faut sauter dès le contact sur les dalles de verre de la Zone 4 (`0,65 s`). | Pluie ruisselant sur `pommeraye_verriere_tile_x` tout en haut de l'écran, tambourinement feutré. | Traverser 3 tuiles en courant à `6,9 tuiles/s` ne prend que `0,43 s` (soit `0,22 s` de marge avant que le verre ne cède). |
| **Soleil** | La lumière traverse la verrière (`rayon_vitrail` dorés) : les dalles de verre chauffées mais sèches tiennent `1,0 s` au lieu de `0,8 s`. | +25 % de temps sur toutes les dalles de verre des Zones 3 et 4 ! | Les moineaux (`oiseau`) sous la verrière volent `10 %` plus vite (`5 tuiles/s`). | Faisceaux de soleil obliques illuminant les statues et les boiseries. | Les chapiteaux solides en `x=140` et `x=163` permettent d'attendre que le moineau passe avant de s'élancer sur le verre. |
| **Neige** | Couche de neige visible par transparence sur la verrière : assombrit légèrement le passage, mais alourdit les `pommeraye_lustre` qui oscillent plus lentement (`cycle de 4 s` au lieu de `3 s`). | Les lustres oscillants des Zones 2, 3 et 4 sont beaucoup plus faciles à cibler. | Les dalles de verre de la Zone 4 (directement sous le toit enneigé) glissent légèrement (`friction ×0,8`). | Ombre blanche de la neige sur la verrière haute, ambiance feutrée de galerie d'hiver. | Comme on ne s'arrête pas sur les dalles de verre (on court et on saute en continu), la friction réduite n'entrave pas l'élan. |
| **Brume** | Le passage étant intérieur, la brume est deux fois moins dense qu'en extérieur (`visibilité 10 tuiles` au lieu de 6–7), et chaque `pommeraye_lustre` et devanture éclaire à `6 tuiles`. | Visibilité très confortable pour un niveau 10 par temps de brume. | Le fond tout en bas de la cage d'escalier (`y=24`) est masqué par une fine brume. | Lueur chaude des boutiques anciennes et des lustres en fonte. | Avec 10 tuiles de visibilité, les 2 prochaines dalles de verre et le prochain pilier sont toujours visibles. |
| **Vent** | Le passage étant fermé, le vent extérieur ne pousse pas le joueur en Zones 1–3 (`effet ×0`), mais les courants d'air sous la verrière (Zone 4) font osciller les `pommeraye_lustre` de `+1 tuile` d'amplitude. | Aucun vent gênant les sauts de précision en Zones 1, 2 et 3 ! | En Zone 4, le lustre #3 (`x=151..154`) balaie 4 tuiles au lieu de 3. | Verrière qui vibre légèrement sous les rafales, tintement des pampilles des lustres. | Une amplitude de 4 tuiles rapproche le lustre #3 à seulement 1 tuile des dalles de verre voisines ! |
| **Orage** | Éclair toutes les 5 s illuminant toute la `pommeraye_verriere_tile_x` : le coup de tonnerre fait vibrer les dalles de verre (elles clignotent), **MAIS** fige les `oiseau` sur place pendant `1,5 s`. | Les moineaux de la Zone 4 s'immobilisent après chaque éclair, offrant un boulevard libre. | Si le joueur est déjà debout sur une dalle de verre au moment exact du tonnerre, il lui reste `0,5 s` pour sauter. | Spectaculaire silhouette noire des ferronneries se découpant sur le flash de la verrière. | Le flash lumineux précède le tonnerre de `0,6 s`, donnant un signal visuel clair pour sauter vers un pilier ou un balcon. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `pointes_fer_1`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Centre (Pommeraye & Mémorial)* : `pommeraye_sol_plein`, `pommeraye_marche`, `pommeraye_balcon_galerie_g`, `pommeraye_balcon_galerie_m`, `pommeraye_balcon_galerie_d`, `pommeraye_escalier_monumental`, `pommeraye_statue`, `pommeraye_devanture_a`, `pommeraye_devanture_b`, `pommeraye_verriere_tile_x`, `pommeraye_pilier_galerie`, `pommeraye_lustre`, `pommeraye_fond_tile_x`, `pommeraye_obstacle_grille_pointes`, `pommeraye_monument_pommeraye`, `memorial_sol_dalle_verre`.
* *Cathédrale (réemploi)* : `cierge_flamme`, `rayon_vitrail`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun.
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 9)** : Le *Grand escalier monumental en bois et fonte* au cœur du passage.
* **2e détail (pixels 10 à 18)** : Les *Statues allégoriques d'enfants*, les grands lustres et les colonnades de la mezzanine.
* **3e détail (pixels 19 à 26)** : La *Haute verrière lumineuse* et les devantures des boutiques historiques sur trois niveaux.



---

## Niveau 11 — Mémorial de l'abolition de l'esclavage (Monument provisoire) — difficulté 11/12

1. **Intention** : Proposer un niveau **sobre, contemplatif et respectueux** (aucun ennemi, aucune violence, aucun combat ni spectacle tapageur) fondé sur la **lecture, la mémoire et l'exploration** : le joueur lit l'ordre de symboles/dates sur une `memorial_stele_gravee` éclairée, puis doit emprunter la bonne série de dalles de verre (`memorial_sol_dalle_verre`) et de passerelles (`memorial_passerelle_metal_g/m/d`) au-dessus du ressac calme de la Loire (`bassin_eau`). La sensation recherchée est le recueillement, la concentration intérieure et le cheminement de l'ombre souterraine du quai vers la lumière de la liberté.
2. **Fiche chiffrée** :
* **Longueur** : 220 tuiles
* **Hauteur** : 18 tuiles (eau de la Loire à `y=16`, passage souterrain et esplanade à `y=14`, passerelles hautes à `y=9`)
* **Temps de référence** : 110 s
* **Nombre de pixels à collecter** : 25
* **Nombre de checkpoints** : 3
* **Nombre d'obstacles mortels** : 10 (uniquement des `memorial_obstacle_flaque_profonde` et l'eau profonde du fleuve `bassin_eau` en cas d'oubli du chemin mémorisé — aucune pointe, aucune lame, aucun ennemi)


3. **Découpage en zones** :
* **Zone 1 (x=0 à 44) — L'Esplanade du Quai de la Fosse (Comprendre la Stèle de Mémoire)** : Départ sur le béton clair bordé de `memorial_rambarde_metal`, `memorial_banc_beton` et `memorial_lampadaire_sobre`. Devant la première `memorial_stele_gravee` (`x=14, y=13`), un panneau sobre affiche : *« Retiens les hauteurs illuminées sur la stèle : Bas — Haut — Bas »*. Plus loin, 2 colonnes de `memorial_sol_dalle_verre` superposées se présentent : seules celles correspondant à la séquence lue restent solides (les autres s'effacent doucement en transparence au contact, faisant tomber sur un sol sûr 2 tuiles plus bas).
* *Plateformes* : `memorial_sol_plein` (`x=0, y=14, L=44`), `memorial_banc_beton` (`x=10, y=13, L=3`), séquence tutorielle au-dessus du sol sûr : dalle Bas (`x=22, y=12, L=3`) vs dalle Haut leurre (`x=22, y=9, L=3`), puis dalle Haut (`x=28, y=9, L=3`) vs dalle Bas leurre (`x=28, y=12, L=3`), puis dalle Bas (`x=34, y=12, L=3`).
* *Obstacles* : Aucun obstacle mortel en Zone 1 (respect du temps d'apprentissage).
* *Ennemis* : Aucun (dans tout le niveau).
* *Pixels (4)* : `(14,11)` [facile, au-dessus de la 1re stèle], `(23,10)` [facile, sur la dalle Bas], `(29,7)` [facile, sur la dalle Haut], `(35,10)` [facile, sur la dalle Bas].
* *Checkpoint* : `lanterne_eteinte` à `x=42, y=13`.


* **Zone 2 (x=44 à 88) — La Descente vers le Passage Souterrain** : Le joueur descend par `memorial_escalier_beton` sous le quai, là où les parois côtoient la Loire. Une `memorial_stele_gravee` (`x=48, y=13`) indique la séquence de mémoire #2 : **« Haut — Haut — Bas — Haut »** (`1794 — 1848 — 1948`). Le joueur franchit un bras d'eau calme (`bassin_eau`) en choisissant à chaque pilier la bonne `memorial_sol_dalle_verre` (`y=10` pour Haut, `y=13` pour Bas).
* *Plateformes* : `memorial_escalier_beton` (`x=44, y=14, L=6`), Palier #1 : dalle Haut solide (`x=53, y=11, L=3`) / Bas leurre (`x=53, y=14, L=3`), Palier #2 : dalle Haut solide (`x=59, y=10, L=3`) / Bas leurre (`x=59, y=13, L=3`), Palier #3 : dalle Bas solide (`x=65, y=13, L=3`) / Haut leurre (`x=65, y=10, L=3`), Palier #4 : dalle Haut solide (`x=71, y=10, L=3`) / Bas leurre (`x=71, y=13, L=3`), `memorial_sol_plein` (`x=77, y=13, L=11`), passerelle d'exploration basse (`x=65, y=15, L=4`).
* *Obstacles* : `bassin_eau` calme (`x=50..77, y=16` — 3 obstacles/bassins profonds si l'on se trompe de dalle).
* *Ennemis* : Aucun.
* *Pixels (5)* : `(54,9)` [facile], `(60,8)` [facile], `(66,11)` [facile], `(72,8)` [facile], `(66,14)` [caché/exploration, sous le Palier #3 sur une poutre d'estacade à `y=15`, accessible en se laissant descendre depuis la dalle Bas `x=65, y=13` puis en remontant par accroche `↑`].
* *Checkpoint* : `lanterne_eteinte` à `x=86, y=12`.


* **Zone 3 (x=88 à 134) — Le Couloir des 2 000 Plaques Commémoratives (Mémoire & Marée Calme)** : Longue galerie sobre sous le niveau du quai où l'eau de la Loire (`memorial_obstacle_flaque_profonde`) monte et descend lentement au rythme d'une respiration paisible (cycle de `6 s` : 3 s basse laissant le sol `y=14` praticable, 3 s haute recouvrant `y=14` et invitant à se poser sur les `memorial_banc_beton` ou les `memorial_passerelle_metal_g/m/d` tout en lisant les stèles).
* *Plateformes* : `memorial_sol_plein` (`x=88, y=14, L=46`), `memorial_banc_beton` (`x=94, y=12, L=3`), `memorial_passerelle_metal_g/m/d` (`x=101, y=11, L=5`), `memorial_stele_gravee` centrale sur îlot (`x=110, y=11, L=4`), `memorial_passerelle_metal_g/m/d` (`x=118, y=11, L=5`), `memorial_banc_beton` (`x=126, y=12, L=3`), alcôve haute de lecture (`x=110, y=8, L=4`).
* *Obstacles* : `memorial_obstacle_flaque_profonde` (3 sections d'eau montante à `x=91..99`, `x=103..115`, `x=119..129` lorsque la marée est haute).
* *Ennemis* : Aucun.
* *Pixels (5)* : `(95,10)` [facile], `(103,9)` [facile], `(112,9)` [facile, devant la stèle centrale], `(112,6)` [caché, dans l'alcôve haute au-dessus de la stèle centrale via accroche `↑`], `(120,9)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=132, y=13`.


* **Zone 4 (x=134 à 184) — La Grande Traversée de la Déclaration Universelle (Séquence à 5 Stèles)** : Le moment de mémoire le plus exigeant du niveau. À l'entrée (`x=136..142`), le joueur marche devant **5 petites stèles lumineuses** (`memorial_stele_gravee`) qui s'allument l'une après l'autre à sa hauteur : **Bas (1) → Milieu (2) → Haut (3) → Milieu (2) → Haut (3)**. Il s'engage ensuite au-dessus du grand bassin sur 5 colonnes comportant chacune 3 niveaux de `memorial_sol_dalle_verre` (`y=13` Bas, `y=10` Milieu, `y=7` Haut). S'il a retenu la mélodie visuelle des 5 hauteurs, la traversée est fluide et sereine.
* *Plateformes* : Esplanade de lecture (`x=134, y=14, L=10`), Colonne 1 (`x=147` : **Bas `y=13**` solide ; `y=10` et `y=7` leurres), Colonne 2 (`x=153` : **Milieu `y=10**` solide ; `y=13` et `y=7` leurres), Colonne 3 (`x=159` : **Haut `y=7**` solide ; `y=13` et `y=10` leurres), Colonne 4 (`x=165` : **Milieu `y=10**` solide ; `y=13` et `y=7` leurres), Colonne 5 (`x=171` : **Haut `y=7**` solide ; `y=13` et `y=10` leurres), `memorial_passerelle_metal_g/m/d` d'arrivée (`x=177, y=7, L=7`).
* *Obstacles* : `bassin_eau` (`x=144..177, y=16` — 4 sections d'eau profonde sous les colonnes).
* *Ennemis* : Aucun.
* *Pixels (6)* : `(148,11)` [facile, sur la bonne dalle 1], `(154,8)` [facile, sur la bonne dalle 2], `(160,5)` [facile, sur la bonne dalle 3], `(166,8)` [facile, sur la bonne dalle 4], `(172,5)` [facile, sur la bonne dalle 5], `(179,12)` [caché/exploration, sur un balconnet de recueillement sous la passerelle d'arrivée à `x=178, y=13`, avec un `memorial_escalier_beton` remontant à `x=182`].
* *Checkpoint* : Aucun.


* **Zone 5 (x=184 à 220) — La Remontée vers la Lumière** : Ascension calme par un large `memorial_escalier_beton` sortant du passage souterrain vers l'esplanade arborée inondée de lumière, où les derniers pixels forment le mot « LIBERTÉ » dans le ciel.
* *Plateformes* : `memorial_escalier_beton` (`x=184, y=10` montant vers `x=196, y=8`), `memorial_sol_plein` (`x=196, y=8, L=24`), `memorial_banc_beton` (`x=202, y=7, L=4`).
* *Obstacles* : Aucun.
* *Ennemis* : `papillon` blancs (symbole d'apaisement autour de `x=205, y=5`).
* *Pixels (5)* : `(190,7)`, `(198,6)`, `(201,5)`, `(204,5)`, `(207,6)` [5 pixels faciles en douce courbe ascendante].
* *Arrivée* : `memorial_monument_memorial` à `x=212, y=5` et `arche_arrivee` à `x=216, y=6`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Toute la Zone 1 (sans aucun obstacle mortel), les larges esplanades de lecture devant les stèles (`x=44..50`, `x=134..144`), et la remontée lumineuse de la Zone 5.
* **Pic de difficulté (cognitif et mémoriel, jamais brutal)** : Zone 4 (`x=147 à 177`), où le joueur doit restituer de mémoire la séquence de 5 hauteurs sur 3 étages de dalles de verre tout en exécutant des sauts propres de 3 tuiles de haut (avec accroche `↑` si besoin).


5. **Moment pédagogique** :
* **Introduction sans risque (`x=14 à 37` en Zone 1)** : Le joueur passe devant la première `memorial_stele_gravee` dont 3 glyphes s'allument (Bas — Haut — Bas) avec trois notes de piano douces (Do — Sol — Do). Juste après, les dalles correspondantes sont testées au-dessus d'un sol de béton plein : toucher une mauvaise dalle ne fait que descendre de 2 tuiles sur le sol sans jamais tuer.
* **Test (`Zone 2` puis `Zone 4`)** : Mémoriser 4 puis 5 positions avant de s'élancer au-dessus du bassin de la Loire.


6. **Météo → gameplay** (Effets intégralement pensés pour préserver la sobriété et le thème de la mémoire) :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Pluie fine et silencieuse : les gouttes tombant sur les `memorial_sol_dalle_verre` révèlent un léger reflet pendant `0,3 s` toutes les `4 s` sur les dalles **solides** (et passent à travers les dalles leurres). | Si le joueur a un doute de mémoire en Zone 4, il peut s'arrêter et observer la pluie pendant 4 s pour repérer la vraie dalle ! | La marée calme de la Zone 3 reste haute `3,5 s` au lieu de `3 s`. | Rideau de pluie très doux, son apaisant de l'eau sur le verre et la Loire. | Les `memorial_passerelle_metal` et `banc_beton` en Zone 3 restent toujours au sec au-dessus de la marée. |
| **Soleil** | La lumière traverse la paroi vitrée du Mémorial : les `memorial_stele_gravee` restent illuminées en permanence en arrière-plan à distance réduite. | Lecture ultra-claire des stèles et ambiance lumineuse d'espoir. | Le reflet du soleil sur les dalles de verre les rend visuellement toutes identiques (aucun indice visuel hors mémoire pure). | Rayons de lumière blanche sur le béton clair et le verre dépoli, piano acoustique doux. | Les séquences de 4 et 5 dalles sont directement lisibles sur les stèles situées juste avant chaque traversée. |
| **Neige** | Une fine couche de neige blanche repose uniquement sur les dalles de verre **solides** lors du premier passage (les dalles leurres n'ont que des flocons qui les traversent). | Aide visuelle poétique pour distinguer les vraies dalles des leurres. | Les `memorial_passerelle_metal` et le béton ont une friction douce `×0,8`. | Flocons lents et silencieux, acoustique feutrée et recueillie. | Les dalles de verre font 3 tuiles de large et le joueur a tout le temps de s'stabiliser entre chaque saut (aucun ennemi ni chronomètre serré). |
| **Brume** | Nappe de `brume_bande_tile_x` sur la Loire (`visibilité 7 tuiles`) ; les `memorial_lampadaire_sobre` et les `memorial_stele_gravee` diffusent un halo blanc pur de `5 tuiles`. | Lorsqu'on lit une stèle, les notes de piano de la séquence résonnent plus fort dans la brume et se répètent une fois à mi-parcours (mémoire auditive). | En Zone 4, on ne voit que les 2 prochaines colonnes de verre à la fois. | Brouillard matinal paisible sur le Quai de la Fosse, clapotis lent du fleuve. | On saute toujours d'une colonne à la colonne immédiatement suivante (distante de 3 tuiles, donc bien dans les 7 tuiles visibles). |
| **Vent** | Brise régulière venant du fleuve (`+0,4 tuile/s` vers la droite en extérieur Zones 1, 4, 5 ; `×0` dans le passage souterrain des Zones 2 et 3). | Accompagne doucement les sauts vers l'avant en Zone 4. | Demande de ne pas sauter trop tard du bord droit d'une dalle en Zone 4. | Souffle léger de l'estuaire, ondulation à la surface de `bassin_eau`. | À `+0,4 tuile/s`, la dérive sur un saut de 0,6 s n'est que de `0,24 tuile` sur des dalles de 3 tuiles de large. |
| **Orage** | Orage lointain et respectueux (pas de fracas agressif : grondement sourd au loin et lueur blanche dans le ciel toutes les `7 s`). Chaque lueur fait briller pendant `1 s` les glyphes de la stèle en haut de l'écran en rappel mémoire. | L'éclair sert de « pense-bête » lumineux discret si le joueur a oublié la 4e ou 5e position en Zone 4 ! | Ciel plus sombre (`ciel_orage`), demandant de s'appuyer sur la lueur des `memorial_lampadaire_sobre`. | Lueur blanche lointaine sur la Loire, reflet sur les plaques de verre du Mémorial. | Aucun effet punitif ajouté : l'orage accompagne la dramaturgie historique du lieu sans jamais brusquer le joueur. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Centre (Mémorial)* : `memorial_sol_plein`, `memorial_sol_dalle_verre`, `memorial_passerelle_metal_g`, `memorial_passerelle_metal_m`, `memorial_passerelle_metal_d`, `memorial_rambarde_metal`, `memorial_stele_gravee`, `memorial_banc_beton`, `memorial_lampadaire_sobre`, `memorial_escalier_beton`, `memorial_fond_tile_x`, `memorial_obstacle_flaque_profonde`, `memorial_monument_memorial`, `bassin_eau`.
* *Ciel & Signes* : `ciel_jour`, `ciel_gris`, `ciel_orage`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `papillon`, `arche_arrivee`.
* *SPRITE MANQUANT* : Aucun pour ce niveau.


8. **Boss** : Aucun (conformément à la consigne absolue de sobriété et de respect du lieu).
9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 8)** : La grande *Paroi vitrée inclinée* du passage souterrain gravée des textes universels d'abolition et de liberté.
* **2e détail (pixels 9 à 17)** : L'*Esplanade du Quai de la Fosse* ponctuée des plaques commémoratives en verre insérées dans le sol.
* **3e détail (pixels 18 à 25)** : L'ouverture lumineuse sur la *Loire* et la perspective vers le palais de justice et l'estuaire.



---

## Niveau 12 — La Tour LU / Le Lieu Unique (Monument provisoire) — difficulté 12/12

1. **Intention** : Mobiliser **toutes les compétences acquises dans les 11 niveaux précédents** (accroupi, accroche, timing rythmique, pentes, rebonds, engrenages d'horloge, chariots suspendus, anneaux d'élan et dalles de verre) au cours d'une grande ascension de la Tour LU (avec une mécanique inédite de **courant ascendant / gravité allégée** dans la soufflerie du dôme qui double la hauteur de saut à `6 tuiles`), culminant avec le **Boss Final en 4 phases** (Le Cœur de la Tempête de Pixels). La sensation recherchée est l'apothéose flamboyante, colorée et vertigineuse au sommet de l'icône Art nouveau de Nantes.
2. **Fiche chiffrée** :
* **Longueur** : 260 tuiles (combinant progression horizontale et haute ascension de la tour, dont arène du Boss Final de `x=195` à `x=260`)
* **Hauteur** : 28 tuiles (quai du canal Saint-Félix à `y=25`, sommet de la lanterne de la Tour LU et du dôme vers `y=4`)
* **Temps de référence** : 150 s (dont 65 s de Boss Final en 4 phases)
* **Nombre de pixels à collecter** : 30
* **Nombre de checkpoints** : 4 (dont 1 juste devant le dôme du Boss Final à `x=193`)
* **Nombre d'obstacles mortels** : 20 (hors attaques du Boss Final)


3. **Découpage en zones** :
* **Zone 1 (x=0 à 48) — Le Quai Ferdinand-Favre & L'Entrée du Lieu Unique (Rappel Accroupi, Rebond & Conteneurs)** : Départ au bord du canal devant les briques et les conteneurs culturels du Lieu Unique. Le joueur combine un `hangar_conteneur_bleu`, un rebond de `graslin_parasol_cafe` de terrasse et un `buren_mat_anneau_grand` pour atteindre le premier étage de la tour.
* *Plateformes* : `pierre_haut` (`x=0, y=25, L=20`), `hangar_conteneur_bleu` mobile (`x=22` ↔ `x=28, y=23, L=5`), `graslin_parasol_cafe` (`x=33, y=23, L=3` — rebond de 4,5 tuiles), `corniche_pierre_g/m/d` (`x=38, y=19, L=4`), `buren_mat_anneau_grand` Rouge (`x=43, y=17`), `pierre_haut` palier de la Tour (`x=46, y=17, L=4`).
* *Obstacles* : `bassin_eau` du canal (`x=20..46, y=26`), `pointes_fer_1` (`x=15, y=24`), barre basse `pointes_fer_2` (`x=25, y=21` — s'accroupir `↓` sur le conteneur).
* *Ennemis* : `oiseau` (`x=36` à `x=44`, `y=17`, vitesse 4,5 tuiles/s).
* *Pixels (5)* : `(15,22)` [facile], `(25,22)` [facile, accroupi sur conteneur], `(33,19)` [facile, dans le rebond], `(40,17)` [risqué, sous l'oiseau], `(44,16)` [facile, dans l'anneau].
* *Checkpoint* : `lanterne_eteinte` à `x=48, y=16`.


* **Zone 2 (x=48 à 98) — Les Fours et l'Horlogerie de la Biscuiterie (Rappel Engrenages, Vapeur & Herses)** : À l'intérieur du fût de la Tour LU, les anciens mécanismes de biscuiterie et l'horloge monumentale mêlent `machines_engrenage_grand`, `machines_bielle`, jets de `vapeur` des fours et `herse` / portes cadencées.
* *Plateformes* : `machines_passerelle_acier_g/m/d` (`x=48, y=17, L=6`), `machines_engrenage_grand` horaire (`x=56, y=15, L=4`), `machines_bielle` verticale (`x=63, y=15` ↔ `y=11, L=3`), `machines_tuyau_cuivre` (`x=69, y=11, L=7`), `machines_engrenage_grand` anti-horaire (`x=79, y=10, L=4`), `chantiers_tole_g/m/d` chariot suspendu (`x=86` → `x=94, y=9, L=3`), palier (`x=95, y=9, L=5`).
* *Obstacles* : Chute mortelle (`y=26`), `vapeur` (`x=72, y=10`, `x=90, y=8` sur le trajet du chariot), `machines_obstacle_engrenage_dents` (`x=58, y=18`, `x=81, y=13`), `herse` (`x=74, y=8..11`).
* *Ennemis* : `machines_animal_mecanique` (`x=69` à `x=75`, `y=10`, vitesse 3,5 tuiles/s).
* *Pixels (6)* : `(58,13)` [facile], `(64,9)` [facile], `(72,8)` [risqué, entre vapeur et automate], `(81,8)` [risqué, sur engrenage anti-horaire], `(90,6)` [risqué, saut par-dessus la vapeur sur le chariot], `(96,7)` [facile].
* *Checkpoint* : `lanterne_eteinte` à `x=98, y=8`.


* **Zone 3 (x=98 à 146) — La Galerie des Renommées et ses Vitraux Art Nouveau (Rappel Dalles de Verre, Pentes & Lustres)** : Le joueur sort sur les balcons sculptés des angelots/Renommées dorées, traversant des verrières fragiles (`memorial_sol_dalle_verre`), des corniches inclinées et des `pommeraye_lustre`.
* *Plateformes* : `feydeau_balcon_fer_g/m/d` incliné (`x=100, y=9, L=5`, pente droite), `memorial_sol_dalle_verre` (`x=108, y=8, L=3`), `memorial_sol_dalle_verre` (`x=114, y=7, L=3`), `pommeraye_lustre` oscillant (`x=120..123, y=7, L=3`), `corniche_g/m/d` (`x=126, y=7, L=5`), `buren_mat_anneau_moyen` Bleu (`x=133, y=6`), `memorial_sol_dalle_verre` (`x=136, y=4, L=3`), `corniche_g/m/d` (`x=141, y=5, L=5`).
* *Obstacles* : Chute mortelle (`y=26`), `pointes_pierre_1` (`x=128, y=6`), `cierge_flamme` sur le lustre, `gargouille` / trompette de Renommée crachant une onde toutes les `2,5 s` (`x=141, y=4`).
* *Ennemis* : `oiseau` (`x=112` à `x=120`, `y=5`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(103,7)` [facile], `(109,6)` [facile], `(115,5)` [risqué, sur dalle de verre sous l'oiseau], `(121,5)` [facile], `(133,6)` [facile, dans l'anneau Bleu], `(137,2)` [risqué, sur la dalle de verre haute].
* *Checkpoint* : `lanterne_eteinte` à `x=144, y=4`.


* **Zone 4 (x=146 à 195) — La Soufflerie du Dôme Turquoise et Or (Nouvelle mécanique : Courant Ascendant / Gravité Allégée)** : Autour de la coupole ajourée de la Tour LU, des colonnes d'air étoilées (`etoile_poussiere` ascendantes) allègent la gravité de `50 %` : dans ces colonnes, le saut du joueur monte à **6 tuiles de haut** et flotte doucement, permettant de franchir les grands étages de la flèche turquoise et or.
* *Plateformes* : Palier d'essai avec sol continu (`x=146, y=12, L=10` après une descente sécurisée dans la coupole) + Colonne d'Air #1 (`x=150..153, y=12..5` — propulse un saut de `y=12` jusqu'à `y=6`), `corniche_g/m/d` (`x=155, y=6, L=4`), Colonne d'Air #2 au-dessus du vide (`x=161..164, y=14..5`), `memorial_sol_dalle_verre` (`x=166, y=6, L=3`), Colonne d'Air #3 (`x=171..174, y=14..4`), `corniche_g/m/d` (`x=176, y=5, L=5`), `buren_mat_anneau_grand` Rouge (`x=183, y=5`), esplanade du Dôme (`x=188, y=6, L=7`).
* *Obstacles* : Chute mortelle (`x=159..188, y=18`), anneaux d'`pointes_fer_2` flottants en bordure des colonnes d'air (`x=162, y=9`, `x=172, y=7`, `x=179, y=4`).
* *Ennemis* : `oiseau` (`x=165` à `x=175`, `y=4`, vitesse 4,5 tuiles/s).
* *Pixels (6)* : `(151,8)` [facile, dans la colonne d'air #1], `(162,6)` [risqué, au-dessus des pointes dans la colonne #2], `(167,4)` [risqué, sur dalle de verre], `(172,4)` [risqué, au sommet de la colonne #3], `(183,5)` [facile], `(162,13)` [caché, tout en bas de la colonne d'air #2 à `y=13` : le joueur se laisse descendre en flottant, prend le pixel, puis saute en gravité allégée pour remonter !].
* *Checkpoint* : `lanterne_eteinte` à `x=193, y=5` (Checkpoint du Boss Final).


* **Zone 5 (x=195 à 260) — Arène du Boss Final : Le Vortex de la Tempête de Pixels (4 Phases)** : Grande terrasse circulaire au sommet de la Tour LU (`x=195` à `x=260`, sol principal à `y=16`), entourée de 2 colonnes d'air à gravité allégée (`x=200..203` et `x=246..249`), de 2 `machines_engrenage_grand` (`x=210, y=12` et `x=238, y=12`), d'un pont central de `memorial_sol_dalle_verre` (`x=222, y=10, L=6`), de 2 `buren_mat_anneau_moyen` (`x=216, y=8` et `x=232, y=8`) et des **4 Lanternes-Phares du Dôme** (`x=202, y=6`, `x=216, y=5`, `x=232, y=5`, `x=248, y=6`).
* *Pixels (7, couronnant le Boss Final)* : `(201,9)` [facile], `(211,10)` [facile], `(225,8)` [risqué, sur le verre central], `(239,10)` [facile], `(247,9)` [facile], `(225,4)` [risqué, au zénith entre les deux anneaux], `(254,14)` [facile, devant l'arche finale].
* *Arrivée* : Monument de la Tour LU (`lu_monument_tour_lu`) à `x=253, y=12` et `arche_arrivee` + `drapeau_final` à `x=257, y=14`.




4. **Courbe de difficulté** :
* **Zones de respiration** : Début de Zone 1 (`x=0..18`), chaque checkpoint (`x=48`, `x=98`, `x=144`, `x=193`), le palier d'essai de gravité allégée (`x=146..155`), et les `4 s` d'accalmie entre chacune des 4 phases du Boss Final.
* **Pic de difficulté** : Zone 4 (`x=160..185`) et Phase 4 du Boss Final en Zone 5.


5. **Moment pédagogique** :
* **Introduction sans risque (`x=146 à 156`)** : Le joueur arrive dans un puits fermé en bas (`y=12`) traversé par la Colonne d'Air #1 (`etoile_poussiere` qui montent). Un simple saut à l'intérieur le fait décoller de `6 tuiles` de haut avec une descente plume très douce, lui permettant de tester le contrôle aérien en gravité allégée sans aucun gouffre.
* **Test (`x=161 à 176` et `Boss Final`)** : Utiliser les colonnes d'air au-dessus du vide et sur les côtés de l'arène du Boss pour atteindre les lanternes hautes.


6. **Météo → gameplay** :

| Météo | Règle précise (valeurs chiffrées) | Avantage joueur | Inconvénient joueur | Annonce visuelle & sonore | Preuve de faisabilité |
| --- | --- | --- | --- | --- | --- |
| **Pluie** | Courants d'air alourdis par l'averse : en Zone 4 et 5, la hauteur de saut en colonne d'air passe de `6,0` à `5,2 tuiles` ; corniches extérieures avec friction `×0,75`. | La pluie éteint les `cierge_flamme` du lustre en Zone 3 et refroidit les jets de `vapeur` en Zone 2 (`0,8 s` au lieu de `1,2 s`). | En Zone 4 (`x=171`), il faut utiliser l'accroche (`↑`) au sommet du saut de `5,2 tuiles` pour hisser le joueur sur la corniche `y=5`. | Pluie oblique au sommet de la tour, reflets dorés sur le dôme mouillé. | `5,2 tuiles` + `0,5 tuile` d'accroche couvrent `5,7 tuiles`, franchissant tous les écarts verticaux de la Zone 4. |
| **Soleil** | Courants thermiques ascendants puissants : les colonnes d'air montent à `6,5 tuiles` et les `buren_mat_anneau` donnent `+0,5 tuile` de portée. | Ascension de la Zone 4 et accès aux 4 Lanternes-Phares du Boss Final extrêmement fluides ! | Le Boss Final (Phase 2) fait tourner ses engrenages `15 %` plus vite. | Dôme turquoise et or étincelant dans `ciel_jour`, `arc_en_ciel` en fin de combat. | Les engrenages de l'arène font 4 tuiles de large et mènent directement vers les anneaux de Buren. |
| **Neige** | Les `memorial_sol_dalle_verre` gelées en Zones 3, 4 et 5 mettent `1,1 s` (au lieu de `0,8 s`) à céder sous le poids du joueur ! | Le pont de verre central de l'arène du Boss (`x=222, y=10`) devient un refuge beaucoup plus stable. | Les corniches de pierre ont une friction `×0,7`. | Flocons tourbillonnant dans les colonnes d'air avec les `etoile_poussiere`. | Dans les colonnes d'air et les anneaux, tout se joue en l'air où la friction au sol n'a aucun impact. |
| **Brume** | Mer de nuages au pied de la Tour LU (`visibilité 7 tuiles`), mais les 4 Lanternes-Phares du Boss, les anneaux et les colonnes d'`etoile_poussiere` brillent à `12 tuiles`. | Le Vortex du Boss Final télégraphie ses attaques avec un halo lumineux `0,4 s` plus tôt pour percer la brume ! | En Zones 2 et 3, il faut rester attentif aux obstacles sombres à 7 tuiles. | Sommet de la Tour LU émergeant au-dessus d'une mer de `brume_bande_tile_x` épique. | Le préavis accru de `+0,4 s` sur le Boss Final compense largement la brume. |
| **Vent** | Vent de haute altitude (`±0,9 tuile/s` qui change de sens toutes les `6 s`), **MAIS** les colonnes d'air verticales et les anneaux de Buren stabilisent la trajectoire. | Lorsque le vent souffle dans le sens de marche du joueur, les sauts entre corniches atteignent `4,5 tuiles`. | Pendant la descente en gravité allégée (flottement), il faut maintenir la direction opposée au vent pour rester dans l'axe. | Bannières et nuages défilant vite derrière le dôme, souffle symphonique. | La vitesse de marche/contrôle aérien du joueur (`6,9 tuiles/s`) est près de 8 fois supérieure à la dérive du vent (`0,9 tuile/s`). |
| **Orage** | Météo signature du Boss Final ! Éclair toutes les `5 s` : chaque éclair charge la prochaine `lanterne_eteinte` du Boss d'un halo magnétique (le joueur l'allume à `1,5 tuile` de distance sans avoir besoin de la toucher au pixel près). | Facilite l'activation des 4 Lanternes-Phares en fin de chaque phase du Boss Final ! | Le tonnerre crée une petite onde au sol (`y=16`) en Phase 4 qu'il suffit de sauter. | `ciel_orage` grandiose autour de la Tour LU, éclairs illuminant les Renommées dorées. | Le sol `y=16` peut être quitté à tout moment via les 2 colonnes d'air ou les 2 engrenages. |

7. **Sprites utilisés et SPRITE MANQUANT** :
* *Commun* : `pierre_haut`, `pointes_fer_1`, `pointes_fer_2`, `lanterne_eteinte`, `lanterne_allumee`, `pixel`, `panneau`.
* *Réemploi multi-monuments (Synthèse de la Ligne Verte)* : `corniche_pierre_g/m/d`, `herse` (Château) ; `corniche_g/m/d`, `pointes_pierre_1`, `gargouille`, `cierge_flamme` (Cathédrale) ; `feydeau_balcon_fer_g/m/d`, `graslin_parasol_cafe`, `pommeraye_lustre`, `memorial_sol_dalle_verre`, `bassin_eau` (Centre) ; `machines_passerelle_acier_g/m/d`, `machines_engrenage_grand`, `machines_bielle`, `machines_tuyau_cuivre`, `machines_obstacle_engrenage_dents`, `machines_animal_mecanique`, `vapeur`, `chantiers_tole_g/m/d`, `buren_mat_anneau_grand`, `buren_mat_anneau_moyen`, `hangar_conteneur_bleu` (Île).
* *Ciel & Signes* : `ciel_jour`, `ciel_orage`, `arc_en_ciel`, `goutte_pluie`, `flocon`, `brume_bande_tile_x`, `oiseau`, `etoile_poussiere`, `drapeau_final`, `arche_arrivee`.
* *SPRITE MANQUANT* :
* `SPRITE MANQUANT : lu_dome_coupole (96×96 px soit 6×6 tuiles, le dôme ajouré turquoise et or de la Tour LU avec sa lanterne sommitale et ses Renommées à trompette)`.
* `SPRITE MANQUANT : lu_monument_tour_lu (48×64 px soit 3×4 tuiles, sprite complet du monument de la Tour LU pour l'arrivée)`.
* `SPRITE MANQUANT : boss_vortex_tempete (64×64 px soit 4×4 tuiles, le Cœur de la Tempête de Pixels : tourbillon venteux entouré de fragments de pixels multicolores au centre du dôme)`.




8. **Boss Final — Le Cœur de la Tempête de Pixels (Zone 5, 4 Phases, durée totale ~65 s)** :
* *Principe* : Le grand coup de vent qui a éparpillé les 12 monuments de Nantes tourne au centre du dôme (`boss_vortex_tempete` à `x=225, y=9`). Le joueur ne frappe pas le Vortex : à la fin de chacune des **4 phases**, l'une des **4 grandes Lanternes-Phares du Dôme** (`lanterne_eteinte` → `lanterne_allumee`) devient accessible ; allumer les 4 lanternes stabilise définitivement les pixels de la ville et dissipe la tempête.
* **Phase 1 — Les Bourrasques Horizontales (12 s + 4 s de répit)** :
* *Pattern* : Le Vortex souffle vers la gauche (`0 à 5 s`, poussée de `-2,0 tuiles/s` au sol) tout en envoyant 3 ondes basses à sauter (`y=15`), puis souffle vers la droite (`6 à 12 s`, `+2,0 tuiles/s`) avec une barre de débris à mi-hauteur (`y=14`, à esquiver accroupi `↓`).
* *Fenêtre de répit (4 s)* : Le vent tombe ; la **Lanterne-Phare #1** (`x=202, y=6`, haut gauche) s'ouvre. Le joueur emprunte la Colonne d'Air gauche (`x=200..203`) en gravité allégée pour monter d'un bond l'allumer (`1/4`).


* **Phase 2 — L'Engrenage du Temps Détraqué (14 s + 4 s de répit)** :
* *Pattern* : Le Vortex active les deux `machines_engrenage_grand` (`x=210` et `x=238`) et fait jaillir des colonnes de `vapeur` rythmiques au sol (`y=16`) toutes les `3 s`, obligeant le joueur à rester en mouvement sur les engrenages et le pont central tout en sautant par-dessus 2 ondes circulaires issues du centre (`0 à 14 s`).
* *Fenêtre de répit (4 s)* : La **Lanterne-Phare #2** (`x=248, y=6`, haut droite) se déverrouille. Le joueur saute de l'engrenage droit (`x=238`) vers la Colonne d'Air droite (`x=246..249`) et allume la 2e lanterne (`2/4`).


* **Phase 3 — Pluie d'Éclats & Pont de Verre (15 s + 4 s de répit)** :
* *Pattern* : Le sol bas (`y=16`) est balayé par un tourbillon continu : le joueur doit survivre en hauteur (`y=12` à `y=8`) en bondissant entre les deux engrenages, le pont central de `memorial_sol_dalle_verre` (`x=222, y=10`, qui cède après `0,8 s` et se régénère après `2,5 s`) et les colonnes d'air latérales, tandis que le Vortex lâche des salves verticales d'éclats annoncées `1 s` à l'avance par des ombres verticales (`0 à 15 s`).
* *Fenêtre de répit (4 s)* : La **Lanterne-Phare #3** (`x=216, y=5`, centre-gauche haut) brille. Depuis la colonne d'air gauche ou le pont de verre, le joueur traverse le `buren_mat_anneau_moyen` Bleu (`x=216, y=8`) qui le propulse directement sur la 3e lanterne (`3/4`).


* **Phase 4 — Le Cyclone Chromatique Final (16 s + Victoire)** :
* *Pattern* : Synthèse finale : le Vortex alterne une aspiration douce vers le centre (`0 à 6 s`) et une répulsion vers les bords (`6 à 12 s`), puis lance une ultime double vague d'anneaux expansifs (`12 à 16 s`) que l'on franchit en utilisant les colonnes d'air latérales.
* *Objectif final* : À `16 s`, le Vortex s'essouffle et la **Lanterne-Phare #4** (`x=232, y=5`, centre-droit haut) s'active. Le joueur monte par la Colonne d'Air gauche (`x=201`), traverse l'Anneau #1 (`x=216, y=8`), rebondit sur le pont de verre central (`x=225, y=10`) et traverse l'Anneau #2 (`x=232, y=8`) pour allumer la 4e lanterne (`4/4`). Les 4 phares convergent vers le Vortex, qui éclate en une pluie d'`etoile_poussiere` et un grand `arc_en_ciel`, ouvrant l'`arche_arrivee` et hissant le `drapeau_final`.




9. **Image à reconstituer** :
* **1er détail révélé (pixels 1 à 10)** : Le *Dôme ajouré bleu turquoise et or* surmonté de son lanternon.
* **2e détail (pixels 11 à 20)** : Les *Renommées dorées soufflant dans leurs trompettes*, la grande horloge et les initiales **LU** entrelacées.
* **3e détail (pixels 21 à 30)** : Le fût coloré de la tour Art nouveau, les briques du *Lieu Unique* au bord du canal Saint-Félix et la ligne verte complète reliant les 12 monuments de Nantes.



---

# ANNEXES RÉCAPITULATIVES DU GAME DESIGN

## 1. Tableau récapitulatif des 12 niveaux

| Niv. | Monument | Mécanique principale | Nouveauté introduite | Diff. | Temps réf. | Pixels | Boss |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **1** | **Jardin des Plantes** | Marche, saut court/long & esquive basse | S'accroupir (`↓`) sous haies basses et oiseaux + jets d'eau cycliques | 1/12 | 60 s | 15 | Non |
| **2** | **Cathédrale St-Pierre-et-St-Paul** | Ascension verticale & corniches | Accroche aux rebords (`↑` près d'un bord) pour franchir 3,5 tuiles + gargouilles | 2/12 | 75 s | 18 | Non |
| **3** | **Château des Ducs de Bretagne** | Obstacles et ponts à cycle rythmique | `pont_levis` (ouvert/fermé) + `herse` verticale + tonneaux roulants | 3/12 | 80 s | 20 | Non |
| **4** | **Île Feydeau** | Surfaces inclinées & portance sur l'eau | Balcons penchés (dérive de pente) + `petit_bateau` qui s'enfonce sous le poids | 4/12 | 85 s | 20 | Non |
| **5** | **Théâtre Graslin & Place Graslin** | Rebond élastique & pendules aériens | `graslin_parasol_cafe` (rebond à 4,5 tuiles) + lustres oscillants | 5/12 | 90 s | 22 | Non |
| **6** | **Les Machines de l'Île (Éléphant)** | Tapis roulants circulaires & pistons | `machines_engrenage` rotatifs (`±1,5 tuile/s`) + bielles + jets de `vapeur` | 6/12 | 110 s | 24 | **Oui** (L'Éléphant, 3 phases) |
| **7** | **Les Chantiers Navals (Grue Titan)** | Chariots déclenchés au contact | `chantiers_tole` sur rail aérien qui démarre sous les pieds du joueur + cales inclinées | 7/12 | 105 s | 24 | Non |
| **8** | **Les Anneaux de Buren** | Propulsion aérienne directionnelle | `buren_mat_anneau` (Rouge = boost horizontal `+3`, Bleu = vertical `+2,5`, et alternants) | 8/12 | 95 s | 25 | Non |
| **9** | **Le Hangar à Bananes** | Croisement de conteneurs & portes | `hangar_conteneur_bleu` (horizontal) / `rouge` (vertical) + `hangar_porte_coulissante` | 9/12 | 120 s | 26 | **Oui** (La Moisissure, 3 phases) |
| **10** | **Passage Pommeraye** | Niveau étagé sur 3 galeries & fragilité | Dalles de verrière fragiles (`0,8 s` avant fissure) combinées aux lustres et escaliers | 10/12 | 105 s | 26 | Non |
| **11** | **Mémorial de l'abolition de l'esclavage** | Lecture, mémoire & exploration sobre | Mémorisation de séquences sur `memorial_stele_gravee` (vraies dalles vs leurres) + marée calme | 11/12 | 110 s | 25 | Non |
| **12** | **La Tour LU / Le Lieu Unique** | Synthèse générale & gravité allégée | Colonnes d'air ascendantes (gravité `×0,5`, saut de `6 tuiles`) + examen final de toutes les mécaniques | 12/12 | 150 s | 30 | **Oui** (Tempête de Pixels, 4 phases) |

---

## 2. Liste des nouvelles mécaniques à programmer (classées par niveau d'apparition)

* **Niveau 1 (Jardin des Plantes)** :
* **Accroupissement (`↓`)** : Réduit la boîte de collision (hitbox) verticale du joueur de moitié, permettant de passer dans des passages d'1 tuile de haut ou d'esquiver un oiseau volant à hauteur de tête.
* **Jet d'eau cyclique (`jet_eau`)** : Colonne verticale active pendant `1 s` toutes les `3 s` (précédée de `0,5 s` de bouillonnement à la surface) qui blesse ou repousse au contact.


* **Niveau 2 (Cathédrale)** :
* **Accroche aux rebords (`↑`)** : Maintenir `↑` lorsque le haut du joueur frôle le coin supérieur d'une plateforme solide permet de s'y suspendre puis de se hisser dessus en `0,4 s` (augmente la portée verticale utile de `3` à `3,5 tuiles`).
* **Crachat de gargouille (`gargouille`)** : Projectile ou jet horizontal de `3 tuiles` de long émis toutes les `2,5 s` après un clignotement d'alerte de `0,5 s`.


* **Niveau 3 (Château des Ducs)** :
* **Pont-levis cyclique (`pont_levis`)** : Plateforme de 3 à 4 tuiles qui alterne entre état horizontal solide (`3 s`) et état relevé non praticable (`2 s`), annoncé `0,5 s` avant par un son de chaîne.
* **Herse verticale (`herse`)** : Grille mortelle par sa pointe basse qui descend jusqu'au sol pendant `1 s` toutes les `3 s`, laissant d'abord 1 tuile libre en bas (franchissable accroupi `↓`) avant de remonter.


* **Niveau 4 (Île Feydeau)** :
* **Surface inclinée / Balcon penché** : Applique une vitesse tangentielle constante (`±1,2 tuile/s`) au joueur lorsqu'il est posé dessus et conserve cet élan s'il saute dans le sens de la pente.
* **Bateau à flottabilité limitée (`petit_bateau`)** : Plateforme flottante qui s'enfonce de `1,5 tuile` en `1,5 s` sous le poids du joueur avant de toucher l'eau mortelle, puis remonte quand il la quitte.


* **Niveau 5 (Théâtre Graslin)** :
* **Parasol-tremplin (`graslin_parasol_cafe`)** : Plateforme élastique qui propulse automatiquement le joueur à `4,5 tuiles` de haut dès l'atterrissage.
* **Lustre pendulaire (`pommeraye_lustre`)** : Plateforme mobile décrivant un mouvement sinusoïdal horizontal de `3 tuiles` d'amplitude sur une période de `3 s`, avec bords latéraux dangereux (`cierge_flamme`).


* **Niveau 6 (Machines de l'Île)** :
* **Engrenage rotatif (`machines_engrenage_grand/petit`)** : Plateforme circulaire qui ajoute `+1,5 tuile/s` (sens horaire) ou `-1,5 tuile/s` (sens anti-horaire) à la vitesse horizontale du joueur.
* **Bielle mobile (`machines_bielle`) & Jet de vapeur (`vapeur`)** : Plateforme à translation linéaire (horizontale, verticale ou diagonale) et jet gazeux temporisé annoncé par un sifflement de `0,6 s`.
* **Valve d'objectif de Boss (`machines_valve_arret`)** : Interrupteur déclenché par simple contact physique du joueur pendant la fenêtre de répit d'un Boss pour valider une phase sans combat.


* **Niveau 7 (Chantiers Navals)** :
* **Chariot de grue déclenché au contact (`chantiers_tole`)** : Plateforme suspendue immobile qui démarre à `3` ou `3,5 tuiles/s` le long de son rail dès que le joueur atterrit dessus (et revient lentement à son origine s'il la quitte).


* **Niveau 8 (Anneaux de Buren)** :
* **Anneau de propulsion chromatique (`buren_mat_anneau_*`)** : Déclencheur aérien qui, lorsqu'on le traverse en sautant, réinitialise le saut et applique un vecteur de vitesse fixe (**Rouge** = `+3 tuiles` horizontal, **Bleu** = `+2,5 tuiles` vertical ; version alternante qui permute toutes les `2,5 s`).


* **Niveau 9 (Hangar à Bananes)** :
* **Conteneurs codés par couleur (`hangar_conteneur_bleu/rouge`)** : Grandes plateformes solides en mouvement continu suivant un code visuel strict (Bleu = va-et-vient horizontal, Rouge = ascenseur vertical).
* **Porte coulissante (`hangar_porte_coulissante`)** : Cloison mobile ouvrant et fermant un passage de 1 à 3 tuiles selon un cycle régulier.


* **Niveau 10 (Passage Pommeraye)** :
* **Dalle de verre fragile (`memorial_sol_dalle_verre` sous verrière)** : Plateforme qui se fissure dès que le joueur la touche, disparaît au bout de `0,8 s` et réapparaît `3 s` plus tard.


* **Niveau 11 (Mémorial de l'abolition de l'esclavage)** :
* **Stèle de mémoire & Dalles vraies/leurres (`memorial_stele_gravee`)** : La stèle affiche et joue une courte séquence de hauteurs (Bas / Milieu / Haut) ; dans la traversée qui suit, seules les dalles correspondant à la séquence sont solides, tandis que les leurres deviennent immatériels au contact.
* **Marée calme (`memorial_obstacle_flaque_profonde`)** : Niveau d'eau qui monte et descend doucement d'1 tuile sur un cycle lent de `6 s`.


* **Niveau 12 (Tour LU)** :
* **Colonne d'air à gravité allégée (`etoile_poussiere` ascendante)** : Zone verticale où la gravité du joueur est divisée par 2, portant la hauteur d'un saut à `6 tuiles` et ralentissant la vitesse de chute.



---

## 3. Liste consolidée de tous les `SPRITE MANQUANT`

Grâce à la richesse des planches fournies dans l'énoncé, **les 9 niveaux sans boss ainsi que l'intégralité des décors des 12 niveaux utilisent 100 % des identifiants existants**. Seuls les 3 Boss (niveaux 6, 9, 12) et les éléments spécifiques de la Tour LU (niveau 12, monument provisoire non listé dans la planche `centre`/`ile`) nécessitent les **8 sprites suivants** :

| Niveau | Identifiant proposé | Taille (px / tuiles) | Description précise pour le pixel artist |
| --- | --- | --- | --- |
| **6** | `machines_boss_elephant` | `96×80 px` (6×5 tuiles) | Le Grand Éléphant mécanique en bois et acier des Machines de l'Île, avec sa trompe articulée (2 poses : haute/basse) et son balcon sur le dos. |
| **6** | `machines_valve_arret` | `16×16 px` (1×1 tuile) | Volant de vanne en cuivre et rouge (2 états : fermé clignotant / ouvert tourné) servant d'objectif à toucher pendant le Boss du niveau 6. |
| **9** | `hangar_boss_moisissure` | `80×64 px` (5×4 tuiles) | Masse organique fongique violette et verte luminescente tapissant le fond de la mûrisserie du Hangar à Bananes. |
| **9** | `hangar_spore_toxique` | `16×16 px` (1×1 tuile) | Bulle de spore verte/violette flottante émise par le Boss du niveau 9. |
| **9** | `hangar_lampe_uv` | `32×16 px` (2×1 tuiles) | Projecteur thermique / ventilateur UV industriel de plafond (2 états : éteint / allumé avec faisceau lumineux) pour purifier le Boss du niveau 9. |
| **12** | `lu_dome_coupole` | `96×96 px` (6×6 tuiles) | Le dôme ajouré bleu turquoise et or de la Tour LU avec ses Renommées dorées soufflant dans une trompette, utilisable en décor de sommet (Zones 4–5). |
| **12** | `lu_monument_tour_lu` | `48×64 px` (3×4 tuiles) | Le sprite de monument final de la Tour LU (à l'image de `monument_jardin`, `monument_cathedrale`, etc.) posé devant l'arche d'arrivée du niveau 12. |
| **12** | `boss_vortex_tempete` | `64×64 px` (4×4 tuiles) | Le Cœur de la Tempête de Pixels (Boss Final) : tourbillon venteux semi-transparent constellé d'éclats de pixels colorés en rotation. |

*(Note : Si l'équipe graphique manque de temps, un palliatif 100 % sans nouveau sprite consiste à composer `boss_vortex_tempete` par code en faisant tourbillonner les sprites existants `nuage_orage`, `etoile_poussiere` et `pixel`.)*

---

## 4. Liste des incohérences ou risques détectés dans le GDD (et solutions appliquées)

1. **Absence du texte collé sous `[COLLER ICI LE GDD]**` :
* *Risque* : Le marqueur `[COLLER ICI LE GDD]` est resté générique dans le prompt, mais la liste des **Sprites disponibles** et les **Décisions déjà prises** citaient explicitement 11 des 12 monuments (`jardin`, `cathedrale`, `chateau`, `feydeau`, `graslin`, `machines`, `chantiers`, `buren`, `hangar`, `pommeraye`, `memorial`) ainsi que le 12e (`Tour LU`).
* *Solution appliquée* : Les 12 niveaux ont été ordonnés selon la progression géographique réelle de la Ligne Verte et l'ordre exact des planches de sprites (Jardin → Cathédrale → Château → Feydeau → Graslin → Machines [Boss 6] → Chantiers → Buren → Hangar [Boss 9] → Pommeraye [Provisoire 10] → Mémorial [Provisoire 11] → Tour LU [Provisoire 12 + Boss Final]).


2. **Contrôles sans bouton d'action/interaction dédié (`←`, `→`, `Saut`, `↓`, `↑`) face à des Boss sans attaque** :
* *Risque* : Dans les niveaux 6, 9 et 12, le joueur ne possède ni bouton d'attaque ni bouton « Utiliser / Interagir » (car `↑` sert déjà à s'accrocher aux rebords et `↓` à s'accroupir).
* *Solution appliquée* : Tous les objectifs de Boss (les 3 valves du niveau 6, les 3 projecteurs UV du niveau 9 et les 4 lanternes-phares du niveau 12) ainsi que la lecture des stèles du niveau 11 s'activent **automatiquement par simple contact de la hitbox du joueur** (exactement comme un checkpoint `lanterne_eteinte`). Aucune touche supplémentaire n'est requise.


3. **Risque de « Softlock » (blocage) avec la météo réelle (Vent fort ou Pluie/Neige) sur une physique à saut limité (4 tuiles max)** :
* *Risque* : Comme le joueur ne choisit pas la météo (API temps réel de Nantes), un vent de face de `-1 tuile/s` sur un saut de `0,6 s` réduit la portée maximale du saut de `4,0 tuiles` à `3,4 tuiles`. Si un niveau comportait un saut obligatoire de `3,5` ou `4 tuiles`, le jeu deviendrait **impossible à finir les jours de vent à Nantes**.
* *Solution appliquée* : Tous les écarts obligatoires sans aide ont été plafonnés à **3 tuiles de large maximum** (et `2,5 tuiles` de haut hors accroche `↑`). Lorsque des brèches plus larges existent (ex. Niveau 8 avec les Anneaux de Buren ou Niveau 12 avec les Colonnes d'Air), la propulsion de l'anneau ou de la colonne d'air est programmée pour ignorer ou surcompenser le vent.


4. **Hauteur des niveaux verticaux (Cathédrale, Grue Titan, Passage Pommeraye, Tour LU) vs écran fixe de `480×270 px` (30×17 tuiles)** :
* *Risque* : La contrainte indique *« défilement horizontal, écran ≈ 30×17 tuiles »*. Or, une cathédrale, le Passage Pommeraye sur 3 étages ou la Tour LU perdraient toute leur identité dans un couloir de 17 tuiles de haut, et un saut en aveugle vers le bas serait injuste.
* *Solution appliquée* : Les niveaux verticaux montent jusqu'à `22–28 tuiles` de hauteur totale avec un léger suivi vertical de caméra (ou changement de palier), **MAIS** aucune réception de saut ne se fait jamais à plus de `3 tuiles` en dessous du joueur (toujours largement visible dans les 17 tuiles de hauteur d'écran).


5. **Étoile « Zéro Mort » vs Dalles leurres au Niveau 11 (Mémorial)** :
* *Risque* : Si une erreur de mémoire au Niveau 11 tuait systématiquement dès la Zone 1, l'étoile « Zéro Mort » serait frustrante et trahirait l'intention sobre et bienveillante du niveau.
* *Solution appliquée* : La Zone 1 (apprentissage) place un sol continu sous les dalles leurres, et les stèles des Zones 2 et 4 restent consultables sans limite de temps juste avant la traversée (avec un rappel visuel/sonore).


6. **Absence de planche de sprites dédiée à la Tour LU dans la liste d'assets** :
* *Risque* : Le niveau 12 porte sur la Tour LU (monument provisoire), mais la liste de sprites ne contient pas de préfixe `lu_`.
* *Solution appliquée* : Le niveau 12 assume un rôle de « Niveau Final Synthèse » réutilisant intelligemment les briques, engrenages, verrières et anneaux des niveaux 1 à 11, tout en isolant les **3 seuls sprites indispensables** (`lu_dome_coupole`, `lu_monument_tour_lu`, `boss_vortex_tempete`) dans la section `SPRITE MANQUANT`.

## Règle de conception : le patrimoine est un système, pas un décor
Pour chaque monument, on se demande **ce qu'il fait dans la vraie vie** (lever, défendre, relier, mûrir, se souvenir…) et on en fait la mécanique du niveau.

| Lieu | Ce que fait le monument | Mécanique |
|---|---|---|
| Château | défendre | herses, flèches |
| Cathédrale | élever, laisser suinter | grimper aux colonnes, corniches qui s'effritent, fissures de voûte qui gouttent |
| Machines de l'île | porter, marcher | Grand Éléphant qui traverse le canal avec le joueur sur le dos ; araignées qui se figent quand on les regarde |
| Chantiers | lever des blocs de navires | grue jaune : conteneurs suspendus qui transportent le joueur |
| Graslin | jouer, ouvrir le rideau | parcours dans l'ordre du théâtre (parvis, escalier à double révolution, foyer, salle à balcons en arc, scène), séquence du rideau, Muses qui lancent des notes |
| Pommeraye | abriter sous une verrière, exposer des statues | statues qui s'animent hors du regard, pluie par les vitres cassées |
| Buren | colorer la perspective | bornes de couleur qui allument les passerelles |
| Hangar à Bananes | recevoir, stocker et faire mûrir des primeurs (bananes, ananas) en hangar climatisé | pixels qui pourrissent, moisissure ; caisses de bananes qui tombent de la grue du quai, qui forment un escalier et que la grue porte au-dessus d'un vide |
| Tour LU | faire monter, cuire | courant d'air ascendant, petits-beurres-plateformes |
| Mémorial | se souvenir | stèle et porte de lumière, plaques de verre qui s'allument et affichent un fait sourcé, rien d'hostile |
| Feydeau | une île dans la Loire | marée qui monte, balcons de fer en refuge, bateaux, visages qui mentent |
| Jardin des Plantes | faire pousser | fleurs-plateformes qui poussent au soleil |
