# Prompts Claude Design — sprites de décor de Green Path

Cible : **Claude Design avec Opus 5.5, effort moyen**. 11 prompts à lancer **dans une conversation séparée chacun**, toujours précédés du **PROMPT 0 (bible de style)** collé en premier. Chaque conversation livre une planche d'aperçu et un fichier de données que Claude (le développeur) intègre ensuite au jeu.

## Mode d'emploi
1. Ouvrir une nouvelle conversation Claude Design. Coller le **PROMPT 0**, puis directement le prompt voulu (1 à 10) à la suite, dans le même message.
2. Vérifier la livraison avec la **checklist** en bas de page. Si un sprite est refusé, répondre « corrige uniquement `<id>` » plutôt que de tout refaire.
3. Me renvoyer le **JSON complet** (et l'aperçu) de chaque conversation. Ordre conseillé : 1, 2, 3, puis 4 à 6, puis 7 à 10.
4. Ne rien déposer en ligne avant d'avoir validé les droits : les photos de référence servent uniquement de modèles de dessin.

---

## PROMPT 0 — Bible de style (à coller avant chaque prompt)

```
Tu es pixel artiste 2D pour « Green Path », un jeu de plateforme rétro 16 bits sur Nantes (vue de côté, défilement horizontal).
Tu dessines des SPRITES DE DÉCOR. Livre tout en matrices de pixels exactes, pas en vectoriel, pas d'image floue.

CONTRAINTES TECHNIQUES
- Écran du jeu : 480×270 px, affiché en agrandissement entier. Tuile de base : 16×16. Le personnage jouable mesure 15×19 px : les plateformes, marches et obstacles doivent être à son échelle.
- Pixel art net : pas d'anti-aliasing, pas de dégradé, pas de flou, pas de demi-pixel.
- Contour sombre de 1 px (couleur k) autour de chaque objet, sauf sur les bords de tuiles qui se raccordent entre elles.
- Lumière venant du haut à gauche. 3 tons par matière (clair, moyen, ombre), 8 couleurs au maximum par sprite hors contour.
- Lisibilité : le plan jouable (sol, plateformes, obstacles) est contrasté et saturé ; les arrière-plans sont moins saturés et moins contrastés (environ 25 % de moins) pour ne pas gêner la lecture.
- Éclairage neutre : le jeu applique ensuite un filtre jour/nuit/pluie par code, ne peins donc pas de nuit ni de pluie dans les sprites.
- Les sprites en bande horizontale répétable (« tile-x ») doivent se raccorder parfaitement : le dernier pixel de droite continue le premier de gauche.
- Interdit : copier un personnage, un décor ou un objet d'un jeu existant (Nintendo, Pokémon, etc.), un logo ou une marque. Les références fournies servent d'ambiance. Les œuvres d'artistes vivants (sculptures, installations) sont évoquées de façon stylisée et générique, jamais reproduites à l'identique.

PALETTE UNIQUE (une lettre par couleur ; « . » = transparent). N'utilise QUE ces lettres.
k #14182e contour/encre · d #2b3a55 bleu nuit · b #3b6ea5 bleu Loire · n #2f5a8c bleu profond · l #7fb3d5 bleu clair · f #d6eef5 écume
w #f4f7f2 blanc · c #efe3bd tuffeau clair · C #e0cf9c tuffeau ombre · t #d2b484 pierre dorée · a #c9b27a sable
r #b5523b brique/tuile · o #e8873a orange · y #f4d35e jaune · z #fff3a0 lumière pâle · p #7a5c8e violet ardoise
e #6b7280 gris · m #aab4c0 gris clair · R #c9c0ae roche · S #8f8878 roche sombre · T #ece6d4 roche claire
L #a6e04a vert lime · g #5cbf3f vert clair · G #2f8f45 vert moyen · H #1f6a3c vert profond · h #145a3a vert très sombre
V #2fbf71 vert « ligne verte » (signature du jeu) · P #8fbf6a vert prairie · Q #7aad5a vert prairie ombre
D #8a5a3a terre · E #6b4230 terre sombre · F #a77348 terre claire · W #b87a3e bois · X #7a4a28 bois sombre · Y #d9a35e bois clair

FORMAT DE LIVRAISON (obligatoire)
1. Une planche d'aperçu : chaque sprite agrandi ×4 sur fond quadrillé, avec son id, ses dimensions et son point d'ancrage.
2. Un unique bloc JSON, sans commentaire, de cette forme :
{ "sheet": "<nom de la planche>",
  "sprites": [
    { "id": "arbre_grand", "w": 52, "h": 64, "anchor": "bottom-center", "tile_x": false, "frames": 1,
      "rows": ["....kk....", "...kGGk...", "..."] }
  ] }
- « rows » contient exactement h chaînes de exactement w caractères. Pour une animation, mets « frames »: N et une clé « frames_rows »: [ [...], [...] ] (N tableaux de h chaînes) à la place de « rows ».
- « anchor » vaut « bottom-center » (objets posés au sol), « top-left » (tuiles) ou « center ».
- Nommage : minuscules, underscores, sans accent, préfixe de la planche (ex. « jardin_arbre_grand »).
3. Avant de répondre, vérifie toi-même : longueur de chaque ligne, lettres autorisées, raccords des tuiles, contour fermé. Corrige avant d'envoyer.
Ne me pose pas de question : si un détail manque, choisis le plus simple et note ton choix en une ligne après le JSON.
```

---

## PROMPT 1 — Éléments communs à tous les niveaux (planche « commun »)

```
Planche « commun » : les éléments partagés par tous les niveaux. Thème prairie ensoleillée, style jeu de plateforme 16 bits (sol d'herbe et de terre, liseré sombre, dessous en dents de scie).

À dessiner :
- Sol d'herbe, tuiles 16×16 : herbe_haut (3 variantes), herbe_haut_gauche, herbe_haut_droite, terre (3 variantes avec cailloux et points), terre_gauche, terre_droite, terre_bas. Les tuiles se raccordent horizontalement et verticalement.
- Plateformes fines 16×8 : rebord_herbe_g / _m / _d (herbe dessus, terre dessous), pont_planches_g / _m / _d (planches et clous).
- Bloc de pierre 16×16 : pierre_pleine, pierre_haut, pierre_gauche, pierre_droite.
- Obstacle « ronces » 16×16 (2 variantes) : touffe sombre hérissée d'épines claires, immédiatement lisible comme dangereuse, hauteur utile 10 px.
- Obstacle « pointes de fer » 16×16 (2 variantes) : rangée de pointes grises.
- Point de contrôle « lanterne » 10×26 : éteinte, puis allumée (2 images de flamme, lumière z et y).
- Pixel à ramasser 8×8 : carré brillant, 4 images d'une lueur qui tourne (pas de clignotement violent), couleurs y et z.
- Panneau en bois 14×14 (vide, le texte est ajouté par le jeu).
- Décor : arbre_grand 52×64, arbre_moyen 40×52, arbre_petit 30×40 (canopée ronde, 3 tons, contour), buisson_a 28×14, buisson_b 20×11, 4 fleurs 5×6 (rouge, jaune, rose, blanche), touffe_herbe 8×4, rocher 20×12, champignons 10×8, barriere_bois 32×16 (tile-x).
- Fond lointain, bandes tile-x : montagnes_bleues 480×110 (deux plans), collines_vertes 480×40.
- Nuages blancs : nuage_a 44×14, nuage_b 64×18, nuage_c 30×11.
Planche en 3 familles dans l'aperçu : sol, objets, fonds.
```

---

## PROMPT 2 — Carte du monde linéaire (sélecteur de niveaux, de gauche à droite)

```
Planche « carte » : décor de la carte du monde où l'avatar marche de niveau en niveau, de gauche à droite, avec une caméra qui le suit. Ambiance « carte de monde » de jeu de plateforme 16 bits : plateaux d'herbe aux bords en falaise, mer en dessous, chemin qui monte et descend doucement. Une « ligne verte » (couleur V) sera peinte par le jeu au milieu du chemin : laisse le chemin libre de toute ligne verte.

À dessiner :
- Plateau, tuiles 16×16 : plateau_herbe_haut (3 variantes), plateau_bord_gauche, plateau_bord_droite, falaise_a / falaise_b (couches de terre et de roche), falaise_pied (raccord avec l'eau), coin_interieur_g / _d.
- Chemin, tuiles 16×16 : chemin_plat (3 variantes pavé/terre), chemin_pente_montante, chemin_pente_descendante (dénivelé de 8 px), chemin_virage_g, chemin_virage_d, chemin_carrefour.
- Eau, tuiles 16×16 en 2 images d'animation (clapot lent) : eau_surface, eau_profonde, eau_bord_falaise.
- Pont de bois 48×16 (tile-x), passerelle, embarcadère 32×20, petit bateau 24×14 (2 images de balancement).
- Piédestal de niveau 28×14 (la base ronde sur laquelle se place un niveau), 4 états : disponible (vert), terminé (jaune), verrouillé (gris avec cadenas), à venir (violet).
- Décor : maisonnette de ville 32×32 (tuffeau et ardoise, 2 variantes), lampadaire 8×28, panneau directionnel 16×20, banc 20×12, barrières en bois 32×14, haie 16×16 (tile-x), arbres/buissons/rochers/fleurs (rappelle les noms de la planche « commun », ne les redessine pas), drapeau 12×24.
- Fonds en parallaxe, tile-x : ciel_degrade_jour (5 bandes 480×54 en aplats, du bleu sombre au bleu clair), montagnes_lointaines 480×110, collines_proches 480×40.
- Fond de l'écran d'accueil : un unique tableau 480×270 composé de ces éléments (plateau, chemin, ciel, collines) SANS le logo ni les boutons.
Ne dessine pas les monuments : ils font l'objet des prompts de chaque niveau.
```

---

## PROMPT 3 — Niveau 1 · Jardin des Plantes (planche « jardin ») — verdoyant, parvis de la gare puis parc

```
Planche « jardin » : décor du niveau 1, Jardin des Plantes de Nantes. Le niveau commence sur le parvis de la gare, puis entre dans le jardin et finit devant le Palmarium (serre). Très verdoyant. Les obstacles sont des ronces (déjà dans la planche « commun »).
Références visuelles (photos) à évoquer sans copier : arrêt de tram « Gare Nord – Jardin des Plantes » (panneaux de verre verts, grand auvent blanc en forme de champignon), gare de Nantes (grand volume de verre au porte-à-faux, façade en résille claire), pin parasol, bassin avec jet d'eau et massifs de fleurs rouges et blanches, topiaires géantes, personnage en bois, Palmarium (serre à dômes de verre, soubassement de brique).

À dessiner :
- Sol de parvis pavé, tuiles 16×16 : pave_haut (3 variantes), pave_gauche, pave_droite, pave_plein, bordure_trottoir.
- Gare (plans éloignés, saturation réduite) : gare_batiment 160×96 (verre bleuté, grand porte-à-faux, résille claire), gare_facade_tile_x 32×64 (module de façade répétable), quai_rail 32×8 (tile-x).
- Arrêt de tram : tram_arret 96×56 (auvent en champignon blanc, 3 panneaux verts translucides, banc), tram_panneau 16×40.
- Parc : pin_parasol 60×80, bassin_surface 16×16 (2 images d'eau), jet_eau 24×64 (3 images), massif_fleurs_a / _b / _c 32×20 (rouge, blanc argenté, jaune orangé), haie_taillee 16×16 (tile-x), pelouse_haut 16×16, banc_parc 22×14, lampadaire_parc 8×30.
- Topiaires (œuvres d'un artiste vivant : interprétation générique, ne copie pas) : topiaire_tete_endormie 64×48 (grosse butte ronde, yeux clos, sourcils en buis), topiaire_oiseau 48×40 (boule verte à bec orange et petite horloge).
- Statue_bois 24×64 (silhouette humaine en bois segmenté, stylisée).
- Palmarium : palmarium_serre 112×96 (serre à dômes de verre bleuté, charpente fine claire, soubassement de brique, porte voûtée), palmarium_silhouette 112×96 (version aplat bleu-vert pour fond lointain).
- Arbres : arbre_marronnier 56×72, arbre_feuillu_clair 44×56 (autres teintes que la planche « commun »).
- Monument de carte : monument_jardin 48×44 (le Palmarium en petit, très lisible, couleurs franches ; une version grise sera calculée par le jeu).
```

---

## PROMPT 4 — Niveau 2 · Château des ducs de Bretagne (planche « chateau »)

```
Planche « chateau » : décor du niveau 2, Château des ducs de Bretagne à Nantes : forteresse de tuffeau clair, tours rondes, courtines à créneaux, douves, grand logis aux lucarnes. Ambiance médiévale mais sobre, pas de pastiche de conte de fées ; les plateformes sont des remparts. Obstacles : pointes de fer (planche « commun »).

À dessiner :
- Sol et murs, tuiles 16×16 : mur_tuffeau_plein (3 variantes), mur_tuffeau_haut_creneaux (merlon / vide en alternance, 2 modules), mur_gauche, mur_droite, mur_bas, sol_pave_chateau, escalier_pierre_g / _d.
- Plateformes fines 16×8 : corniche_pierre_g / _m / _d, planche_echafaudage_g / _m / _d.
- Tours : tour_ronde_haut 48×32 (créneaux, toit d'ardoise optionnel), tour_ronde_milieu 48×32 (tile-y), tour_ronde_pied 48×32.
- Douves : douve_surface 16×16 (2 images), douve_profonde 16×16, bord_douve 16×16.
- Pont-levis 64×24 (bois, chaînes), herse 32×48 (grille de fer relevée), porte_cintree 32×48.
- Détails : meurtriere 8×16, torche_murale 8×16 (2 images de flamme), banniere_hermine 16×32 (fond clair, motif de mouchetures d'hermine stylisé, symbole héraldique breton), blason_simple 16×16, tonneau 14×16, caisse 16×16, barriere_chantier 32×16.
- Fond : chateau_silhouette_tile_x 480×120 (remparts et tours lointains, deux tons de bleu-gris), ciel_chateau (bandes tile-x en bleu plus pâle).
- Grand logis : grand_logis 128×80 (façade claire, lucarnes sculptées, toit d'ardoise), en décor d'arrière-plan.
- Monument de carte : monument_chateau 48×44 (deux tours et porte, couleurs franches).
```

---

## PROMPT 5 — Niveau 3 · Cathédrale Saint-Pierre-et-Saint-Paul (planche « cathedrale »)

```
Planche « cathedrale » : décor du niveau 3, cathédrale gothique de Nantes en pierre blanche. Thème : verticalité. Le niveau monte (clochers, contreforts, toits, intérieur de la nef). Plateformes : corniches, gargouilles, galeries. Obstacles : pointes de pierre et flammes de cierges (à dessiner ici).

À dessiner :
- Pierre, tuiles 16×16 : pierre_blanche_pleine (3 variantes), pierre_haut, pierre_gauche, pierre_droite, pierre_bas, dalle_nef (damier clair/gris), colonne_fut 16×16 (tile-y), colonne_base 24×16, colonne_chapiteau 24×16.
- Plateformes fines 16×8 : corniche_g / _m / _d, galerie_balustrade 16×16 (tile-x).
- Éléments gothiques : arc_brise_porte 48×64, arc_brise_fenetre 24×48, rosace 64×64 (vitrail rond aux couleurs franches : rouge, bleu, jaune, vert, plomb sombre), vitrail_haut 24×48 (2 variantes), contrefort 16×48 (tile-y), arc_boutant 48×32, pinacle 16×32, gargouille 20×20, clocheton 24×40, statue_niche 20×32 (silhouette générique).
- Tours : tour_facade 96×128 (façade ouest, deux tours carrées à créneaux, portail central) en arrière-plan, nef_fond_tile_x 64×128 (suite de colonnes et d'arcs, ton bleu-gris).
- Obstacles : pointes_pierre 16×16 (2 variantes), cierge_flamme 8×16 (4 images d'une flamme vacillante lente, danger au contact de la flamme).
- Lumière : rayon_vitrail 32×64 (rayon translucide représenté en motif tramé, pas de transparence partielle).
- Monument de carte : monument_cathedrale 48×44 (deux tours, rosace, portail, couleurs franches).
```

---

## PROMPT 6 — Niveau 4 · Quartier du Bouffay (planche « bouffay »)

```
Planche « bouffay » : décor du niveau 4, vieux quartier du Bouffay à Nantes : ruelles médiévales piétonnes, maisons à pans de bois (colombages en bois sombre, remplissage clair), toits d'ardoise, enseignes de commerçants, pavés. Ce niveau combine toutes les mécaniques : prévois plateformes à plusieurs hauteurs (balcons, auvents, étals). Obstacles : tonneaux et caisses qui encombrent, et tessons (pointes) au sol.

À dessiner :
- Pavé, tuiles 16×16 : pave_ruelle_haut (3 variantes), pave_gauche, pave_droite, pave_plein, caniveau.
- Maisons à pans de bois : maison_pans_a 64×96, maison_pans_b 56×112, maison_pans_c 72×88 (étages en surplomb, fenêtres à petits carreaux, volets, un étage bas avec devanture) en arrière-plan ; façade_module_tile_x 32×64 (module répétable colombage) ; toit_ardoise_tile_x 32×24, cheminee 12×24.
- Plateformes fines 16×8 : balcon_bois_g / _m / _d, auvent_ardoise_g / _m / _d, etal_marche_g / _m / _d.
- Objets : tonneau 14×16, caisse_bois 16×16 (2 variantes), pile_caisses 32×32, enseigne_potence 24×24 (fer forgé, 3 enseignes : pain, chope, livre), lanterne_murale 8×16, banc_pierre 24×12, fontaine_place 32×40, pot_fleurs 10×14, linge_etendu 48×16 (tile-x).
- Obstacles : tessons_sol 16×16 (pointes de verre), tonneau_roulant 14×16 (2 images).
- Fond : ruelle_fond_tile_x 480×120 (rangée de maisons lointaines en aplats, deux tons de brun-gris).
- Monument de carte : monument_bouffay 48×44 (maison à pans de bois très lisible).
```

---

## PROMPT 7 — Étapes 5 à 8 (planche « centre »)

```
Planche « centre » : décors des étapes 5 à 8 (niveaux à venir). Une sous-famille par lieu, avec sa propre ambiance, sur la même bible de style. Pour chaque lieu : 6 tuiles de sol et de bord 16×16, 3 plateformes fines 16×8, 6 à 8 éléments de décor, 1 fond tile-x 480×120, 1 obstacle 16×16, et 1 monument de carte 48×44.

5) Île Feydeau (id préfixe « feydeau_ ») : hôtels d'armateurs du XVIIIe, façades de pierre claire à balcons de fer forgé et mascarons (visages sculptés stylisés), quai pavé au bord de l'eau, ancres, bollards, petits bateaux, linéaire de maisons légèrement penchées.
6) Passage Pommeraye (« pommeraye_ ») : galerie commerçante à trois niveaux, verrière, grand escalier monumental à balustrade, statues, devantures chaleureuses, sol damier, lumière chaude.
7) Place Graslin (« graslin_ ») : grand théâtre néoclassique, rangée de colonnes corinthiennes, frontispice à statues de muses, perron, terrasse de café, lampadaires.
8) Mémorial de l'abolition de l'esclavage (« memorial_ ») : quai de la Loire, promenade de béton clair et de métal, dalles de verre encastrées, bassin d'eau, textes gravés (zones de pierre unies, sans lettres lisibles). Traitement SOBRE et respectueux : aucun obstacle ludique ni humoristique, obstacle = flaque profonde et rambardes ; ambiance calme, couleurs froides, pas d'éléments de fête.
Ne dessine aucun texte lisible. Indique pour chaque lieu en une ligne ce qui a été interprété librement.
```

---

## PROMPT 8 — Étapes 9 à 12 (planche « ile »)

```
Planche « ile » : décors des étapes 9 à 12 (niveaux à venir) sur l'île de Nantes, ancien site industriel. Même structure que la planche « centre » : par lieu, 6 tuiles de sol/bord 16×16, 3 plateformes fines 16×8, 6 à 8 éléments de décor, 1 fond tile-x 480×120, 1 obstacle 16×16, 1 monument de carte 48×44.

9) Machines de l'île (« machines_ ») : grande halle de nef industrielle, charpente métallique, engrenages, bielles, rails, grand animal mécanique en bois et acier (évocation GÉNÉRIQUE : n'imite pas à l'identique les créations existantes), vapeur (aplats clairs), cuivres, bois.
10) Parc des Chantiers (« chantiers_ ») : ancien chantier naval reconverti en parc : grande grue jaune à portique, rails, coques, tôles, pelouses entre les vestiges industriels, silhouettes de grues en fond.
11) Anneaux de Buren (« buren_ ») : quai le long de la Loire, anneaux lumineux sur de hauts mâts (évocation GÉNÉRIQUE d'une installation d'art contemporain : cercles clairs sur poteaux gris, sans reprise exacte), pavés, bornes, bord d'eau.
12) Hangar à Bananes (« hangar_ ») : long entrepôt portuaire en brique et tôle, portes coulissantes, caisses, palettes, grues de quai, terrasses, guirlandes lumineuses, conteneurs colorés.
Ne dessine aucun texte lisible ni logo. Indique pour chaque lieu en une ligne ce qui a été interprété librement.
```

---

## PROMPT 9 — Éléments d'ambiance météo et ciel (planche « ciel »)

```
Planche « ciel » : fonds et éléments de ciel pour la météo, en pixel art net (le jeu superpose en plus un filtre de couleur par code ; ne peins donc pas de nuit sur les sprites de jour).

À dessiner :
- Ciels en 5 bandes horizontales 480×54 en aplats, une série par ambiance : ciel_jour (bleu sombre en haut, bleu clair en bas), ciel_nuageux, ciel_gris (pluie), ciel_orage, ciel_nuit (bleu nuit profond).
- Nuages : nuage_blanc_a / _b / _c (3 formes), nuage_gris_a / _b / _c, nuage_orage_a / _b, nuage_nuit_a / _b (violacés).
- Astres : soleil 32×32, lune_croissant 32×32, etoile 3×3 (3 variantes), etoile_filante 12×4 (2 images, rare).
- Particules, petits sprites : goutte_pluie 1×4 (inclinée à droite), flocon 3×3, brume_bande_tile_x 480×40 (aplat clair tramé).
- Arc-en-ciel 160×48 (aplats nets, 7 bandes).
- Oiseaux 10×6 (3 images de vol), papillon 6×6 (2 images).
```

---

## PROMPT 10 — Éléments d'interface visibles dans le décor (planche « signes »)

```
Planche « signes » : petits objets d'orientation vus dans les niveaux et sur la carte, à l'échelle du personnage (15×19 px).
- Panneaux d'apprentissage en bois 16×18 (4 variantes de pictogramme, sans texte) : flèches gauche-droite, saut (flèche courbe), ronce (symbole d'épines), lanterne.
- Flèches : fleche_haut / bas / gauche / droite 10×10 (4 images d'une petite oscillation).
- Étoiles 12×12 : etoile_pleine, etoile_vide, etoile_brillante (4 images d'un éclat lent).
- Pièce-souvenir « pixel » 8×8 (carré rempli de couleur claire, 4 teintes : jaune, vert, bleu, rose).
- Écriteaux de niveau terminé : drapeau_final 16×32 (3 images de drapeau flottant), arche_arrivee 48×48.
- Cadenas 10×12, verrou fermé et ouvert.
- Cœur d'étoile : etoile_poussiere 5×5 (6 images d'une étincelle qui s'éteint).
```

---

## Checklist de validation d'une livraison
- Aperçu ×4 présent, avec id, dimensions et ancrage sous chaque sprite.
- JSON valide : chaque `rows` contient `h` chaînes de `w` caractères ; seules les lettres de la palette ; `.` pour le transparent.
- Tuiles : les bords gauche/droite et haut/bas se raccordent sans couture (surtout `tile_x`).
- Contour sombre fermé, pas d'anti-aliasing, 8 couleurs maximum par sprite.
- Échelle cohérente avec un personnage de 15×19 px (une marche = 16 px, un trou = 3 tuiles).
- Aucune ressemblance exacte avec un jeu existant, aucun texte lisible, œuvres contemporaines stylisées.
- Le décor d'arrière-plan est visiblement moins contrasté que le sol et les obstacles.

## Ce que je fais ensuite de vos JSON
J'écris un convertisseur `tools/import-sprites.js` qui transforme chaque JSON en `assets/sprites/<planche>.js` (données de pixels) chargé par le jeu, puis remplace les dessins générés par code par ces sprites planche par planche, en vérifiant le rendu dans le navigateur.
