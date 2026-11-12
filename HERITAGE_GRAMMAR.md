# Green Path — patrimoine et grammaire

État vérifié le 10 novembre 2026. **Source principale : Château des ducs de Bretagne.** Les 11 autres étapes restent un corpus secondaire : variations végétales, verticales, sérielles ou industrielles. Cette organisation est notre réponse de design à l'ambition des 12 lieux ; le cours n'impose ni 12 niveaux ni ce choix de monument.

## Références et provenance

- Brief intégral, sections 00 à 16 : https://kamelghabte.me/patrimoine-exe/nantes-001/cours/ — consulté le 10/11/2026.
- Institution : Château des ducs de Bretagne / Musée d'histoire de Nantes, « Histoire » : https://www.chateaunantes.fr/le-chateau/histoire/ — consulté le 10/11/2026. Confirme François II, Anne de Bretagne, les remparts, les douves, le palais résidentiel et l'ouverture du musée actuel en 2007.
- La page distingue les façades en tuffeau du Grand Logis de l'ensemble de la forteresse : **ne pas qualifier indistinctement tous les remparts de tuffeau**. La notice du jeu a été précisée pendant l'audit.
- Les photographies institutionnelles sont créditées à leurs auteurs : consultation documentaire uniquement, **aucune réutilisation ni nouvelle photo intégrée**.
- Image candidate du Château, non intégrée : John Samuel, CC BY-SA 4.0, référence dans `docs/images-candidates.md`. Un relevé de terrain ou sur photographie validée reste nécessaire.

## Observation : ce qui est établi et ce qui ne l'est pas

Il s'agit d'une observation **documentaire et d'une formalisation du dessin stylisé existant**, pas d'une campagne de relevés métriques. Les proportions ci-dessous sont celles de notre algorithme, pas celles du monument.

| Détail retenu | Propriété | Traduction / limite |
|---|---|---|
| Remparts | continuité, masse horizontale | sol et blocs contigus ; parcours écrit à la main |
| Tours | ponctuation verticale de l'enceinte | élévation latérale dans la reconstruction du sprite |
| Courtine | liaison entre volumes | région centrale de l'image |
| Crénelage évoqué par le dessin | répétition plein / vide | tuiles de crénelage ; pas encore un générateur de parcours |
| Porte | interruption et seuil | herse : alternance passage / attente |
| Douves | séparation et franchissement | vide entre deux sols ; pas de simulation hydrologique |
| Grand Logis | contraste résidence / défense | décor d'arrivée ; information documentaire, pas mécanique générative |

Les meurtrières et les tonneaux sont des **conventions ludiques**, pas une restitution du fonctionnement historique précis du Château. Les formes exactes, le nombre de merlons, les proportions et les phases de construction ne sont pas mesurés. L'ornement des façades est volontairement laissé de côté.

## Fiche de grammaire principale

| Champ | Règle actuelle |
|---|---|
| Source | enceinte, seuils et élévations du Château |
| Primitives | cellule colorée, rectangle de mur, bande centrale, volume latéral, intervalle de passage |
| Relations | assise sous élévations ; courtine entre deux régions latérales ; seuil alternant ouvert/fermé |
| Invariants | toutes les cellules opaques sont révélées une fois ; collecte totale = image complète ; portes ne blessant pas le joueur ; parcours non dépendant d'un bonus solaire |
| Variables | nombre de fragments collectés ; ordre de révélation ; état de pluie ; composante horizontale du vent ; visibilité |
| Algorithme d'image | `PixelCollection.sortCells(cells, 'fortification')` : assise (`y ≥ 0,60 h`), puis centre (`0,28 w ≤ x < 0,72 w`), puis côtés ; dans chaque région, bas → haut et gauche → droite |
| Répartition | tri déterministe ; groupe g = cellules entre `floor(g*N/F)` et `floor((g+1)*N/F)` ; F collectibles révèlent N cellules sans reste |
| Interaction | courir / sauter / s'accroupir ; ramasser un fragment révèle le groupe suivant ; herse ouverte = passage, fermée = attente |
| Feedback | groupe coloré dans le HUD, son facultatif, image au bilan, monument de carte recoloré |
| Résultat | une reconstruction en trois régions géométriques explicitée dans la fiche « SOURCE → RÈGLE » |

**Limite essentielle :** le masque est une approximation géométrique du **sprite**, pas une segmentation sémantique d'une photographie. Le moteur ne reconnaît ni pierre ni tours. Le terrain est composé manuellement avec `LevelBuilder`, non généré depuis des relevés. C'est une traduction partielle, désormais explicite, qu'il faut encore renforcer par des observations annotées.

## Trois paramètres effectivement opérants (et davantage)

| Entrée | Normalisation / bornes | Paramètre | Transformation | Feedback |
|---|---|---|---|---|
| Collecte | `count / total`, 0–1 | groupes révélés | recoloration de l'image | aperçu puis bilan |
| Vent | 0–80 km/h ; direction modulo 360° ; seuil 20, composante horizontale > 0,3 | poussée en l'air, max ±110 px/s² | déplacement latéral ; tonneaux ×1,25 | particules inclinées, bandeau, saut déporté |
| Code WMO pluie/orage | catégories validées | accélération au sol : 650 / 560 au lieu de 1100 px/s² | freinage plus long ; ronces au Jardin ; gargouilles à 60 % de leur période | pluie, pousse annoncée en 1,2 s, gouttes plus fréquentes |
| Code WMO neige | état discret | accélération sol 430, air 520 | inertie accrue | flocons et bandeau |
| Code WMO brume | état discret | distance de visibilité : 90 px | lueur des pixels distants réduite à 15 % minimum | voile, apparition de proximité |
| Jour/nuit | booléen validé | visibilité 130 px la nuit | éclairage et perception | lanternes, ciel étoilé si peu couvert |
| Précipitations | 0–10 mm | densité des particules plafonnée | pluie plus dense | 170 particules maximum, environ /3 en mouvement réduit |
| Nébulosité | 0–100 % | nombre de nuages | ciel plus ou moins occupé | dérive et couverture |

La température est **affichée seulement** : aucune teinte pilotée par la température n'est implémentée. Le vent n'est pas un modèle géographique du parcours réel : l'est est conventionnellement associé à la droite de l'écran.

## Variations et droits des images

- **Jardin** : photo réelle du Palmarium, 48×32 = 1536 cellules, 16 couleurs ; 32 collectibles. Pymouss44, CC BY-SA 3.0, page relue le 10/11/2026 : https://commons.wikimedia.org/wiki/File:Jardin_des_plantes_Nantes-serre.JPG. Recadrage, réduction par moyenne, contraste/saturation, quantification k-means déterministe (`tools/pixelize.swift`). L'adaptation reste CC BY-SA 3.0 : https://creativecommons.org/licenses/by-sa/3.0/. Révélation bas → haut, centre → côtés : métaphore végétale, pas croissance botanique simulée.
- **Cathédrale** : sprite, pas photo ; colonnes → escalade, corniches → appuis, évacuation de l'eau → fréquence de gouttes. Ordre `bottomUp`, sans reconstruction sémantique des deux tours.
- **Château** : sprite, pas photo ; ordre `fortification` ci-dessus.
- **Bouffay** : prototype hors parcours ; ordre `bottomUp`. « Ossature puis remplissage » n'est **pas implémenté**.
- Neuf lieux futurs : principes détaillés dans le README, sans annoncer de sources photographiques validées.

Les planches de sprites assistées par IA ne sont pas des preuves patrimoniales. La provenance du personnage Figma, potentiellement liée à une référence Adobe Stock, reste à clarifier avant diffusion large (`CREDITS.md`). Les œuvres contemporaines (Machines, Anneaux…) demandent un examen distinct des droits ; une stylisation n'est pas automatiquement une autorisation.

## Preuves à compléter par l'équipe

1. Relevé annoté de 5 à 10 détails du Château, source et date, sans fausse précision.
2. Comparaison graphique relevé → primitives → règles, avec deux variantes contrôlées.
3. Test croisé silencieux de 30–60 secondes, observations et itération réellement effectuées par les étudiants.
4. Sources institutionnelles des notices secondaires, contextualisation du Mémorial et de l'histoire des armateurs.

Les documents historiques `docs/fiche-source.md` et `docs/grammaire.md` sont complétés par ce document ; leurs anciennes promesses ne doivent pas être présentées comme du code livré.
