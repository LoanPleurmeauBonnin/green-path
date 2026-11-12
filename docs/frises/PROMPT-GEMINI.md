# Prompt à donner à Gemini (niveau 1, puis à répéter pour les autres)

Pièces jointes : `niveau-01-jardin-des-plantes.png`, `niveaux.json`, `LISEZMOI.md`.

---

Tu es level designer de jeux de plateforme 2D (références : Super Mario Bros., Super Mario World, Celeste).
Je te joins : (1) la frise PNG du **niveau 1** de mon jeu (le Jardin des Plantes de Nantes, vue de gauche à droite, 1 tuile = 32 px d'image) ; (2) `niveaux.json`, qui décrit les niveaux en coordonnées de tuiles ; **ne travaille que sur l'entrée `"niveau": 1`** ; (3) `LISEZMOI.md`, qui donne les capacités du héros.

**Mission** : rends la structure du niveau plus logique, plus lisible et plus « à la Mario », sans changer le lieu ni sa longueur (140 tuiles) et en gardant 15 pixels à ramasser.

**Règles de conception à appliquer**
1. **Une idée nouvelle à la fois**, dans l'ordre : course → saut simple → obstacle fixe (ronces) → trou/eau → plateforme en hauteur → ennemi (oiseau) → danger cyclique (jets d'eau) → combinaison des acquis.
2. **Enseigner avant de tester** : chaque mécanique apparaît d'abord dans un endroit sans risque (échec sans mort), puis sous pression, puis combinée.
3. **Courbe en dents de scie** : tension qui monte, puis un répit (zone plate, pixels faciles, lanterne) avant chaque pic. Le niveau finit sur un pic net, pas sur un plateau.
4. **Lisibilité** : un danger est toujours visible avant d'être atteint ; aucun piège caché derrière un obstacle ; aucun pixel placé au-dessus d'un piège inévitable. Une seule menace à la fois sur un même saut.
5. **Chemin d'or** : un parcours évident, avec des pixels qui le guident (comme les pièces de Mario), et quelques pixels optionnels demandant un peu plus d'habileté, sans danger caché.
6. **Faisabilité** : respecte le saut du héros (≈ 3,4 tuiles de haut, ≈ 4,6 de portée). Tout écart ou rebord obligatoire doit rester à 70 % maximum de ces valeurs.
7. **Décor cohérent** : le sol, les plateformes et les décors doivent avoir un sens architectural (un jardin : allées, bassins, massifs, serre), pas des blocs posés au hasard.

**Ce que je veux en retour**
- **A. Diagnostic** : 5 à 8 défauts de la version actuelle, avec leur position (x en tuiles).
- **B. Plan en « beats »** : tableau (x début–fin, idée enseignée, intensité 0 à 10, type : enseigne / teste / répit / pic).
- **C. Frise annotée** : une image de la nouvelle structure, de gauche à droite, avec les zones et les numéros de beats.
- **D. Données** : le niveau 1 réécrit **au même format JSON que `niveaux.json`** (tuiles de 16 px, mêmes noms de champs : `plateformes`, `dangers`, `ennemis`, `pixels_a_ramasser`, `lanternes_points_de_controle`, `panneaux`, `depart`, `arrivee`). Ne pas inventer de nouveaux types d'objets ; si tu en veux un, propose-le à part.
- **E. Justification** : 3 phrases par changement important (pourquoi c'est plus clair ou plus fun).

Contraintes : ne dépasse pas 15 pixels ; au moins une lanterne (point de contrôle) tous les 40 à 45 tuiles ; texte des panneaux en français, une phrase courte ; pas de mécanique absente du JSON actuel (sol, ronces, eau, jets d'eau cycliques, oiseaux, buissons à escalader, petites plateformes).
