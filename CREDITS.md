# Crédits

## Services en ligne
- **Supabase** (Apache-2.0 pour le logiciel ; service gratuit) : sauvegarde et classement facultatifs (pseudo seul), région Paris. Aucune bibliothèque Supabase n'est incluse : le jeu appelle l'API avec `fetch`.

## Confidentialité
Le mode invité ne demande aucune identité ; un compte facultatif enregistre un pseudo et la progression. Les services réseau voient l'adresse IP. Voir [docs/confidentialite.md](docs/confidentialite.md) (et CRÉDITS → CONFIDENTIALITÉ dans le jeu).

## Outils de développement
Skills Phaser (`phaser-core`, `phaser-arcade-physics`) du dépôt gamedev-skills/awesome-gamedev-agent-skills, licence Apache-2.0 : lus avant installation, utilisés comme référence de bonnes pratiques ; non inclus dans le jeu ni dans le dépôt.

## Équipe
- **Florine RACINE** — UX/UI Designer, Game Design
- **Loan PLEURMEAU** — Développeur web, IA Ops

## Logiciels et polices
- **Phaser 3.90.0** — MIT — https://phaser.io — `js/vendor/phaser.min.js`
- **Press Start 2P** — SIL Open Font License 1.1 — The Press Start 2P Project Authors — `assets/fonts/` (licence : `OFL.txt`)

## Données
- **Open-Meteo** — données météo sous licence CC BY 4.0 — « Weather data by Open-Meteo.com » — https://open-meteo.com — appelées en direct depuis le navigateur (sans clé), avec cache et valeurs de secours.

## Images patrimoniales
### Palmarium du Jardin des Plantes (niveau 1)
- **Fichier** : « Jardin des plantes Nantes-serre.JPG » — https://commons.wikimedia.org/wiki/File:Jardin_des_plantes_Nantes-serre.JPG
- **Auteur** : Pymouss44 (travail personnel, 30 avril 2006), via Wikimedia Commons.
- **Licence retenue** : **CC BY-SA 3.0** — https://creativecommons.org/licenses/by-sa/3.0/ (l'auteur propose au choix GFDL 1.2+ ou CC BY-SA 3.0, 2.5, 2.0, 1.0). La page indique aussi que la serre elle-même (1895, Ets. Guillot-Pelletier) est dans le domaine public en France ; cela concerne le bâtiment, pas la photo.
- **Modifications** : recadrage 3:2 autour de la serre (1320×880 px depuis 1600×1200), réduction à **48×32 cases** par moyenne de zones, léger renfort du contraste et de la saturation, **16 couleurs** (k-means) — `tools/pixelize.swift`. Fichier produit : `assets/locations/jardin-des-plantes.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et **diffuser l'image pixélisée sous la même licence (CC BY-SA 3.0)**. Le reste du jeu (code, dessins) n'est pas concerné.
- Crédit court affiché dans la documentation : « Palmarium, photo Pymouss44, CC BY-SA 3.0, via Wikimedia Commons, recadrée et pixélisée ».
- Téléchargée le 9 novembre 2026 après validation de l'équipe. Les personnes visibles au loin sur la photo ne sont pas identifiables à 48×32.

### Cathédrale Saint-Pierre-et-Saint-Paul (lieu 2)
- **Fichier** : « Cathédrale Saint-Pierre de Nantes - façade.jpg » — https://commons.wikimedia.org/wiki/File:Cathédrale_Saint-Pierre_de_Nantes_-_façade.jpg
- **Auteur** : Eusebius, via Wikimedia Commons.
- **Licence** : **CC BY 3.0 (la page indique aussi le domaine public et GFDL ; on retient CC BY 3.0, attribution obligatoire)** — https://creativecommons.org/licenses/by/3.0/
- **Modifications** : recadrage 3:2 sur la rosace et les portails (1488×992 depuis 1488×2000), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/cathedrale.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Château des ducs de Bretagne (lieu 3)
- **Fichier** : « Château des Ducs de Bretagne façade.JPG » — https://commons.wikimedia.org/wiki/File:Château_des_Ducs_de_Bretagne_façade.JPG
- **Auteur** : JoévinB, via Wikimedia Commons.
- **Licence** : **CC BY-SA 3.0** — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications** : recadrage 3:2 sur les deux tours, les douves et le Grand Logis (1600×1067 depuis 1920×1440 ; personnes sur la pelouse exclues), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/chateau.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Île Feydeau (lieu 4)
- **Fichier** : « Feydeau Nantes 2.JPG » — https://commons.wikimedia.org/wiki/File:Feydeau_Nantes_2.JPG
- **Auteur** : Jibi44 (téléverseur ; la page ne nomme pas d'auteur), via Wikimedia Commons.
- **Licence** : **CC BY-SA 3.0** — https://creativecommons.org/licenses/by-sa/3.0/
- **Modifications** : recadrage 3:2 sur les façades (1480×987 depuis 1920×1440), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/feydeau.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Place Graslin (théâtre) (lieu 5)
- **Fichier** : « Nantes 2018 Façade du théâtre Graslin 02.jpg » — https://commons.wikimedia.org/wiki/File:Nantes_2018_Façade_du_théâtre_Graslin_02.jpg
- **Auteur** : François de Dijon, via Wikimedia Commons.
- **Licence** : **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications** : recadrage 3:2 sur la façade (1060×707 depuis 1920×1282), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/graslin.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Parc des Chantiers (Grue Titan) (lieu 7)
- **Fichier** : « Grue Titan jaune, Nantes-5147.jpg » — https://commons.wikimedia.org/wiki/File:Grue_Titan_jaune,_Nantes-5147.jpg
- **Auteur** : Raimond Spekking, via Wikimedia Commons.
- **Licence** : **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications** : recadrage 3:2 sur la grue (1700×1133 depuis 1920×1920), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/chantiers.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Hangar à Bananes (lieu 9)
- **Fichier** : « W5618 Nantes HangarBanane 42780EOS.jpg » — https://commons.wikimedia.org/wiki/File:W5618_Nantes_HangarBanane_42780EOS.jpg
- **Auteur** : Llann Wé², via Wikimedia Commons.
- **Licence** : **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications** : image entière (960×640 téléchargés), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/hangar.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Passage Pommeraye (lieu 11)
- **Fichier** : « Galerie Régnier du passage Pommeraye.jpg » — https://commons.wikimedia.org/wiki/File:Galerie_Régnier_du_passage_Pommeraye.jpg
- **Auteur** : Tgllyn, via Wikimedia Commons.
- **Licence** : **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications** : recadrage 3:2 sur la partie haute (1280×853 depuis 1280×1707 ; foule du bas exclue), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/pommeraye.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Tour LU (Lieu Unique) (lieu 12)
- **Fichier** : « Nantes-TourLU.jpg » — https://commons.wikimedia.org/wiki/File:Nantes-TourLU.jpg
- **Auteur** : Selbymay, via Wikimedia Commons.
- **Licence** : **CC BY-SA 4.0** — https://creativecommons.org/licenses/by-sa/4.0/
- **Modifications** : recadrage 3:2 sur le dôme et la fresque (1920×1280 depuis 1920×2791), réduction à **48×32 cases**, léger renfort du contraste et de la saturation, **16 couleurs** — `tools/pixelize.swift`. Fichier produit : `assets/locations/tour-lu.js`.
- **Obligations** : créditer l'auteur, donner le lien vers la licence, indiquer les modifications, et diffuser l'image pixélisée sous la même licence.
- Téléchargée le 10 novembre 2026 après validation de l'équipe, image par image. Personnes éventuelles non identifiables à 48×32. Aucune œuvre d'artiste contemporain dans le cadre.

### Lieux sans photo (6 Machines de l'île, 8 Anneaux de Buren, 10 Mémorial)
Leur sujet est une œuvre d'artiste protégée (Grand Éléphant, anneaux de Buren, mémorial) : **aucune photo n'est utilisée**, le monument reste dessiné par code, pour ne prendre aucun risque de droit d'auteur. Décision de l'équipe du 10 novembre 2026.

Point à confirmer : le décor sculpté de la Tour LU (1909) est supposé dans le domaine public (auteurs morts depuis plus de 70 ans) ; dates de décès non vérifiées.
Les autres lieux utilisent encore le monument de la planche de sprites, ou le dessin par code en repli. Candidates : `docs/images-candidates.md`.
La licence et l'attribution du Palmarium ont été relues sur la page File: le 10 novembre 2026 pendant l'audit. Le jeu affiche aussi ces crédits dans CRÉDITS → SOURCES ET LICENCES. Aucun nouveau téléchargement photographique n'a été effectué.

## Sprites de décor (planches)
Les 10 planches de sprites (`js/data/sprites/*.js` : commun, carte, ciel, signes, jardin, cathédrale, château, centre, île, bouffay ; 447 sprites, palette de 35 couleurs) ont été **générées avec Claude Design** (Anthropic) à partir des consignes de l'équipe, puis importées sans retouche par `tools/import-sprites.js`. Elles sont déclarées dans l'usage de l'IA du projet.

Le rendu du sélecteur dérive désormais deux textures finies (`MapDecor.js`) : silhouette fermée de la haie et poteaux de la barrière isolée, avec la palette existante. Les matrices importées, arbres, lampadaires et buissons déjà corrects restent inchangés. Aucun asset tiers ajouté.

## Logo et icônes
Logo « N » pixel art fourni par l'équipe (`assets/brand/logo.png`) ; icônes du site générées à partir de lui (`tools/favicon.swift`, agrandissement sans lissage).

## Sprite du personnage
Base : sprite « Personnage » du fichier Figma Green Path (nœud 6:19, grille 15×19, pose de trois quarts) ; le modèle par défaut le reproduit case par case. La planche d'inspiration jointe dans Figma porte un filigrane **Adobe Stock** : son origine et sa licence sont **À VÉRIFIER** avant toute diffusion. Les autres options du créateur (coiffures, yeux, tenues) sont dessinées par code sur cette pose, sans reprise de la planche.

## Visuels du jeu
Carte du monde, décor des niveaux (sol, pavés, arbres, ronces, lanternes, ciel, montagnes), décor de la gare et du jardin, monuments, icônes météo, touches de clavier dessinées et personnage : générés par code, sans source externe.

Refonte locale du Château (11 novembre 2026) : maçonnerie défensive, pavés, tabliers, tours stylisées et ossature d'échafaudage dessinés par code dans `js/systems/CastleArt.js`, avec assistance de GPT-6.1 Sol via OpenCode. Aucun nouvel asset externe ni photographie intégrée. Grand Logis, herses, corniches, bannières et arche réutilisent les planches déclarées ci-dessus. Il s'agit d'une interprétation ludique, pas d'un relevé certifié du monument. Les planches QA `docs/screenshots/chateau-*` utilisent une météo simulée et ne sont pas des essais humains ou matériels.

Extension aux douze GZones : documents JSON de conception fournis par l'utilisateur, compilés avec leur nom et empreinte dans `js/data/gzones.js`. Interprétation et mécanismes développés avec assistance de GPT-6.1 Sol via OpenCode ; les planches existantes sont réutilisées sans retouche. Compléments de dessin par code dans `GZoneArt.js` et `LevelBoss.js` (coupole LU, signaux et créatures fictives) : aucune nouvelle photographie ni ressource tierce. Les boss Éléphant, Moisissure et Vortex sont des conventions ludiques approuvées, pas des faits patrimoniaux. Les réserves de droits sur les œuvres contemporaines et la référence de l'avatar ne sont pas levées par cette réalisation locale. Les exports `level-*.png` sont des compositions de test, pas des essais humains.
Les photos de repérage de la gare de Nantes et du Jardin des Plantes (arrêt de tram, bâtiment de verre, pin, bassin, massifs, topiaires, personnage en bois) ont servi de **référence de dessin uniquement** ; aucune n'est intégrée au jeu.
Les **topiaires** et le personnage en bois du jardin sont des œuvres d'artistes vivants, protégées : le jeu les évoque par des formes génériques (butte de feuillage arrondie, silhouette de bois simple) **sans les copier**.
**Silhouettes du niveau 1** (`lv_sil_orange`, `lv_sil_jaune`, `lv_sil_ruban`, `lv_sil_oiseau`) : dessins originaux de l'équipe, en pixel art, **inspirés** des sculptures colorées installées au Jardin des Plantes (personnages de **Jean Jullien**, oiseau en topiaire évoquant l'univers de **Claude Ponti**). Ce sont des formes très simplifiées, redessinées de zéro : aucune photo ni aucune image des œuvres n'est reprise ni intégrée. Ces rapprochements (artistes, titres exacts des œuvres) sont à confirmer dans `docs/sources.md` avant la présentation.
**Fond et salles du Château** (`lv_fond_chateau`, `lv_salle_herses`, `lv_salle_gardes`) : dessinés par code, d'après des descriptions de l'architecture du château (Wikipédia) et des vues consultées sur Wikimedia Commons, utilisées comme **référence de dessin uniquement** : aucune image n'est téléchargée ni intégrée.
**Niveaux 4 à 12** (Île Feydeau, Place Graslin, Machines de l'île, Parc des Chantiers, Anneaux de Buren, Hangar à Bananes, Mémorial, Passage Pommeraye, Tour LU) : décors tirés des planches de sprites existantes (voir « Sprites de décor ») ; les personnages et accessoires ajoutés (esprit de la garde, petit robot, note de musique, conteneur, rideau, tapis roulant) et le dessin de la Tour LU et de sa coupole (forme générale uniquement) sont des dessins originaux de l'équipe, générés par code (`js/systems/LevelArt.js`), sans source externe. Les fonds de Feydeau (hôtels d'armateurs), de Graslin (immeubles de la place), de la Tour LU (ancienne biscuiterie) et du Passage Pommeraye (`lv_fond_feydeau`, `lv_fond_graslin`, `lv_fond_lu`, `lv_fond_pommeraye`) est dessiné par code d'après des vues du passage consultées sur Wikipédia (**référence de dessin uniquement**). Le fond de la nef de la Cathédrale (`lv_fond_nef` : vitraux, rosace, piliers) et les bancs d'église (`lv_banc_eglise`) sont dessinés par code d'après des vues de l'intérieur (référence de dessin uniquement). Le fond du niveau des Machines de l'île (`lv_fond_hangar` : la Galerie des Machines, verrière à treillis et portiques de béton) est dessiné par code d'après des photos de Wikimédia Commons (référence de dessin uniquement). Les machines du niveau des Machines de l'île (`lv_elephant`, `lv_carrousel`, `lv_arbre_herons`, `lv_gardienne`) sont des dessins originaux en pixel art, inspirés de photos de Wikimédia Commons (Grand Éléphant, Carrousel des Mondes Marins, Arbre aux Hérons, La Gardienne des Ténèbres) : **référence de dessin uniquement**, aucune image reprise ; ces œuvres sont celles de La Machine / Les Machines de l'île (François Delarozière, Pierre Orefice). Le fond du niveau du Hangar à Bananes (`lv_fond_hangar_quai`, rails, garde-corps corten, flèche de grue) est dessiné par code d'après des photos du quai des Antilles sur Wikimédia Commons (référence de dessin uniquement). La peau de banane du Hangar est un dessin original, inspiré de la banane des jeux Mario Kart (forme générale et couleurs seulement, rien n'est repris). La façade du théâtre Graslin (`lv_facade_graslin`) est dessinée par code d'après des photos de la place sur Wikimédia Commons (référence de dessin uniquement). La façade et le passage du Mémorial (`lv_facade_memorial`, `lv_fond_memorial_passage`) sont dessinés par code d'après des photos du lieu sur Wikimédia Commons (référence de dessin uniquement ; aucune photo de personne n'est utilisée). Les petits-beurres, le bitume, les panneaux de rue, les feux et l'abribus du niveau de la Tour LU (`lv_pb_*`, `lv_bit_*`, `lv_pan_*`, `lv_feu`, `lv_abribus`, `lv_fond_quartier`) sont des dessins originaux en pixel art ; les panneaux suivent le code de la route de façon très simplifiée, sans reprise du graphisme de la marque LU. Les mécaniques (marée, projecteurs, anneaux, pourriture…) sont codées dans `js/systems/Dangers.js`. Les anneaux de Buren s'inspirent de l'œuvre *Les Anneaux* de Daniel Buren (Quai des Antilles) par une forme générique, sans reproduire l'œuvre ; l'éléphant et les machines évoquent les Machines de l'île sans reprendre leurs dessins.
**Personnages des anecdotes** (carte du monde, `GP.Scenes.Map.personKey`) : même sprite que l'avatar du joueur (`GP.Character`) avec des accessoires dessinés par code, d'après des portraits et photos d'époque vus sur Wikipédia/Wikimédia Commons (Anne de Bretagne, Jean-Joseph-Louis Graslin, Louis Lefèvre-Utile, Jules Verne : couleurs et silhouette uniquement, **référence de dessin, aucune image reprise**) ; les anecdotes sont des textes reformulés par l'équipe à partir des sources patrimoniales listées dans `docs/sources.md`.
Les captures de référence fournies (cartes de monde et niveaux de jeux de plateforme, jeux en vue de dessus, planches de touches de clavier) ont servi **d'inspiration uniquement** : aucun élément n'en est repris. Certaines portent des filigranes de banques d'images : elles ne sont ni intégrées au jeu ni diffusées.

## Assistance d'audit (10 novembre 2026)
GPT-6.1 Sol via OpenCode : exploration, lecture du brief, correctifs de robustesse et de sécurité, reprise locale, copie hors ligne, médiation de la grammaire, tests et documentation. Les tests exécutés et leurs limites sont détaillés dans `AUDIT.md`. Cette assistance ne constitue ni une validation juridique des assets ni un test croisé par des étudiants.

Passe suivante : contrôles adaptatifs, retarget du sélecteur, rendu des pentes par bandes de pixels, HUD/météo/contexte compacts et recette UX. Pastilles de boutons dessinées par code avec la palette existante, aucun pack d'icônes ni asset tiers ajouté. Les planches `docs/screenshots/polish-*` sont des exports QA du rendu Phaser (météo et manette simulées), pas des captures matérielles ni de nouvelles photographies patrimoniales. Voir `docs/UX_POLISH.md` et `docs/GAMEPLAY_UPGRADES.md`.

Lot correctif : rubriques Crédits/Confidentialité/Sources distinctes sans retrait du contenu antérieur, Options aéré, piédestaux logiques, terminaisons ciblées, fiche et transition centrées, météo abritée et instrumentation volontaire de playtest. Les exports `docs/screenshots/regressions-*` sont des planches QA du rendu Phaser, avec météo simulée ; aucun test humain ni matériel n'est revendiqué. Voir `docs/PLAYTEST_REPORT.md` et `docs/WEATHER_SHELTERS.md`.
