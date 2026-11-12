# Frises des niveaux (export pour relecture par une IA)

Un PNG par niveau, de gauche à droite, du départ (x=0) à l'arrivée : `niveau-01-…png` à `niveau-12-…png`.
Chaque pixel de jeu = 2 pixels d'image ; 1 tuile = 16 pixels de jeu = **32 pixels d'image**. Sans interface (ni HUD, ni textes, ni héros).
Le ciel (soleil, nuages) se répète à chaque écran : c'est un décor en parallaxe, pas des éléments de jeu.
`niveaux.json` donne les mêmes niveaux en coordonnées de tuiles (départ, arrivée, pixels à ramasser, lanternes, plateformes, dangers, ennemis, panneaux). Le niveau 3 (Château) n'y est pas : il est dans l'ancien moteur (`js/data/levels.js`).

## Capacités du héros (pour juger la faisabilité)
Saut maintenu ≈ 3,4 tuiles de haut, ≈ 4,6 tuiles de portée ; vitesse 110 px/s ; accroupi (passe sous 10 px) ; s'accroche aux rebords et colonnes à partir du niveau 2 ; monte les marches de 6 px ou moins sans sauter (rampes).

## Consigne type à donner à l'IA
« Voici la frise d'un niveau de plateforme 2D (PNG) et sa description (niveaux.json). Propose une variante plus fonctionnelle « à la Mario » : une seule idée nouvelle à la fois, mécanique enseignée dans un endroit sans risque avant d'être testée, courbe de difficulté en dents de scie (un répit avant chaque pic), pas de piège sur le chemin d'un autre, pixels à ramasser atteignables sans danger caché. Conserve le lieu, la longueur et le nombre de pixels. Rends un dessin (frise annotée) ET un tableau JSON au même format que niveaux.json, en tuiles de 16 px. »
