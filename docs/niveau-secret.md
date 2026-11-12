# Niveau secret — « La Ligne Verte » (spécification)

Décidé avec Florine le 12 novembre 2026. **Pas encore construit** : à faire après le gel fonctionnel (jeudi 12 novembre 2026, midi).

## Déverrouillage
- Condition : **36 étoiles**, c'est-à-dire **3 étoiles dans chacun des 12 niveaux** (`GP.Progression.totalStars() >= 36`).
- Le niveau est **optionnel** : il n'est jamais nécessaire pour finir le jeu ni pour la carte postale de fin.
- Avant le déverrouillage, rien n'apparaît à l'écran (pas de cadenas ni de texte « secret »).

## Idée
Un niveau très difficile qui **remet toutes les mécaniques du jeu**, dans l'ordre du voyage, comme un parcours d'examen sur la ligne verte.

| Section | Monument | Mécanique reprise |
|---|---|---|
| 1 | Jardin des Plantes | lanternes, plantes à franchir |
| 2 | Cathédrale | colonnes à grimper, gouttes des fissures, corniches qui s'effritent |
| 3 | Château | garde : regard haut (s'accroupir), regard bas (sauter) |
| 4 | Feydeau | quais, bateaux, pointes d'ancre |
| 5 | Graslin | projecteurs « 1-2-3 soleil » |
| 6 | Machines de l'île | Grand Éléphant qui porte, araignées au plafond |
| 7 | Chantiers | grue qui porte les conteneurs, conteneurs qui tombent |
| 8 | Buren | bornes de couleur et passerelles néon |
| 9 | Hangar à Bananes | caisses en escalier, grue |
| 10 | Pommeraye | statues qui avancent, verre qui se fissure, escalier en Y |
| 11 | Mémorial | frise de dates à frapper dans l'ordre, marée |
| 12 | Tour LU | courants d'air, jets de vapeur, descente de la tour |

## Ce qui le rend difficile
- Pas de panneaux d'aide ; un seul point de contrôle tous les trois monuments.
- Limite de temps courte (6 minutes).
- Météo qui change toute seule toutes les 20 secondes (effets documentés dans `docs/grammaire.md`).
- Tous les pixels à prendre, puis l'arche d'arrivée (comme les autres niveaux).

## Récompense
- Badge « Maître de la Ligne Verte » sur la carte et sur l'écran de résultat.
- Carte postale spéciale (même mécanique que la carte postale de fin).

## Accessibilité (règles du cours)
Pas de flash, `prefers-reduced-motion` respecté, jouable au clavier, au tactile et à la manette, jouable sans son, réinitialisation possible.

## Plan technique (isolé pour ne rien casser chez Loan)
- Le niveau secret n'est **pas** un 13e lieu de `GP.LOCATIONS` : cela changerait le compteur « 12 niveaux », `GP.LAST_PLAYABLE` (fin du jeu et carte postale) et la sauvegarde.
- Un bouton « LIGNE VERTE » apparaît sur la carte quand `totalStars() >= 36` et lance `Game` avec un lieu spécial `GP.SECRET_LOCATION` défini à part.
- Le niveau (`GP.LEVELS['ligne-verte']`) est assemblé à partir des sections des niveaux existants (même constructeur `GP.LevelBuilder`), dans `js/data/levels-ville.js`.
- Sa progression (meilleur temps, badge) est sauvegardée dans une clé à part, sans toucher à `completed`, `unlocked` ni aux étoiles.
- Tests : déverrouillage à 35 puis 36 étoiles, arche, limite de temps, reprise, console sans erreur, `file://`.
