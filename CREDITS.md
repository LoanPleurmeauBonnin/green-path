# Crédits

## Services en ligne
- **Supabase** (Apache-2.0 pour le logiciel ; service gratuit) : sauvegarde et classement facultatifs (pseudo seul), région Paris. Aucune bibliothèque Supabase n'est incluse : le jeu appelle l'API avec `fetch`.

## Confidentialité
Aucune donnée personnelle n'est collectée ; voir [docs/confidentialite.md](docs/confidentialite.md) (et CRÉDITS → CONFIDENTIALITÉ dans le jeu).

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

Les autres lieux utilisent encore le monument dessiné par code. Candidates : `docs/images-candidates.md`.

## Sprites de décor (planches)
Les 10 planches de sprites (`js/data/sprites/*.js` : commun, carte, ciel, signes, jardin, cathédrale, château, centre, île, bouffay ; 447 sprites, palette de 35 couleurs) ont été **générées avec Claude Design** (Anthropic) à partir des consignes de l'équipe, puis importées sans retouche par `tools/import-sprites.js`. Elles sont déclarées dans l'usage de l'IA du projet.

## Logo et icônes
Logo « N » pixel art fourni par l'équipe (`assets/brand/logo.png`) ; icônes du site générées à partir de lui (`tools/favicon.swift`, agrandissement sans lissage).

## Sprite du personnage
Base : sprite « Personnage » du fichier Figma Green Path (nœud 6:19, grille 15×19, pose de trois quarts) ; le modèle par défaut le reproduit case par case. La planche d'inspiration jointe dans Figma porte un filigrane **Adobe Stock** : son origine et sa licence sont **À VÉRIFIER** avant toute diffusion. Les autres options du créateur (coiffures, yeux, tenues) sont dessinées par code sur cette pose, sans reprise de la planche.

## Visuels du jeu
Carte du monde, décor des niveaux (sol, pavés, arbres, ronces, lanternes, ciel, montagnes), décor de la gare et du jardin, monuments, icônes météo, touches de clavier dessinées et personnage : générés par code, sans source externe.
Les photos de repérage de la gare de Nantes et du Jardin des Plantes (arrêt de tram, bâtiment de verre, pin, bassin, massifs, topiaires, personnage en bois) ont servi de **référence de dessin uniquement** ; aucune n'est intégrée au jeu.
Les **topiaires** et le personnage en bois du jardin sont des œuvres d'artistes vivants, protégées : le jeu les évoque par des formes génériques (butte de feuillage arrondie, silhouette de bois simple) **sans les copier**.
**Silhouettes du niveau 1** (`lv_sil_orange`, `lv_sil_jaune`, `lv_sil_ruban`, `lv_sil_oiseau`) : dessins originaux de l'équipe, en pixel art, **inspirés** des sculptures colorées installées au Jardin des Plantes (personnages de **Jean Jullien**, oiseau en topiaire évoquant l'univers de **Claude Ponti**). Ce sont des formes très simplifiées, redessinées de zéro : aucune photo ni aucune image des œuvres n'est reprise ni intégrée. Ces rapprochements (artistes, titres exacts des œuvres) sont à confirmer dans `docs/sources.md` avant la présentation.
**Fond et salles du Château** (`lv_fond_chateau`, `lv_salle_herses`, `lv_salle_gardes`) : dessinés par code, d'après des descriptions de l'architecture du château (Wikipédia) et des vues consultées sur Wikimedia Commons, utilisées comme **référence de dessin uniquement** : aucune image n'est téléchargée ni intégrée.
**Niveaux 4 à 12** (Île Feydeau, Place Graslin, Machines de l'île, Parc des Chantiers, Anneaux de Buren, Hangar à Bananes, Mémorial, Passage Pommeraye, Tour LU) : décors tirés des planches de sprites existantes (voir « Sprites de décor ») ; les personnages et accessoires ajoutés (esprit de la garde, petit robot, note de musique, conteneur, rideau, tapis roulant) et le dessin de la Tour LU et de sa coupole (forme générale uniquement) sont des dessins originaux de l'équipe, générés par code (`js/systems/LevelArt.js`), sans source externe. Les fonds de Feydeau (hôtels d'armateurs), de Graslin (immeubles de la place), de la Tour LU (ancienne biscuiterie) et du Passage Pommeraye (`lv_fond_feydeau`, `lv_fond_graslin`, `lv_fond_lu`, `lv_fond_pommeraye`) est dessiné par code d'après des vues du passage consultées sur Wikipédia (**référence de dessin uniquement**). Le fond de la nef de la Cathédrale (`lv_fond_nef` : vitraux, rosace, piliers) et les bancs d'église (`lv_banc_eglise`) sont dessinés par code d'après des vues de l'intérieur (référence de dessin uniquement). Le fond du niveau des Machines de l'île (`lv_fond_hangar` : la Galerie des Machines, verrière à treillis et portiques de béton) est dessiné par code d'après des photos de Wikimédia Commons (référence de dessin uniquement). Les machines du niveau des Machines de l'île (`lv_elephant`, `lv_carrousel`, `lv_arbre_herons`, `lv_gardienne`) sont des dessins originaux en pixel art, inspirés de photos de Wikimédia Commons (Grand Éléphant, Carrousel des Mondes Marins, Arbre aux Hérons, La Gardienne des Ténèbres) : **référence de dessin uniquement**, aucune image reprise ; ces œuvres sont celles de La Machine / Les Machines de l'île (François Delarozière, Pierre Orefice). Le fond du niveau du Hangar à Bananes (`lv_fond_hangar_quai`, rails, garde-corps corten, flèche de grue) est dessiné par code d'après des photos du quai des Antilles sur Wikimédia Commons (référence de dessin uniquement). La peau de banane du Hangar est un dessin original, inspiré de la banane des jeux Mario Kart (forme générale et couleurs seulement, rien n'est repris). La façade du théâtre Graslin (`lv_facade_graslin`) est dessinée par code d'après des photos de la place sur Wikimédia Commons (référence de dessin uniquement). La façade et le passage du Mémorial (`lv_facade_memorial`, `lv_fond_memorial_passage`) sont dessinés par code d'après des photos du lieu sur Wikimédia Commons (référence de dessin uniquement ; aucune photo de personne n'est utilisée). Les petits-beurres, le bitume, les panneaux de rue, les feux et l'abribus du niveau de la Tour LU (`lv_pb_*`, `lv_bit_*`, `lv_pan_*`, `lv_feu`, `lv_abribus`, `lv_fond_quartier`) sont des dessins originaux en pixel art ; les panneaux suivent le code de la route de façon très simplifiée, sans reprise du graphisme de la marque LU. Les mécaniques (marée, projecteurs, anneaux, pourriture…) sont codées dans `js/systems/Dangers.js`. Les anneaux de Buren s'inspirent de l'œuvre *Les Anneaux* de Daniel Buren (Quai des Antilles) par une forme générique, sans reproduire l'œuvre ; l'éléphant et les machines évoquent les Machines de l'île sans reprendre leurs dessins.
**Personnages des anecdotes** (carte du monde, `GP.Scenes.Map.personKey`) : même sprite que l'avatar du joueur (`GP.Character`) avec des accessoires dessinés par code, d'après des portraits et photos d'époque vus sur Wikipédia/Wikimédia Commons (Anne de Bretagne, Jean-Joseph-Louis Graslin, Louis Lefèvre-Utile, Jules Verne : couleurs et silhouette uniquement, **référence de dessin, aucune image reprise**) ; les anecdotes sont des textes reformulés par l'équipe à partir des sources patrimoniales listées dans `docs/sources.md`.
Les captures de référence fournies (cartes de monde et niveaux de jeux de plateforme, jeux en vue de dessus, planches de touches de clavier) ont servi **d'inspiration uniquement** : aucun élément n'en est repris. Certaines portent des filigranes de banques d'images : elles ne sont ni intégrées au jeu ni diffusées.
