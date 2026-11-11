# Équilibrage de la difficulté — 11 novembre 2026

**Statut : réglage de conception mesuré sur les données, pas validé par des joueurs.** Aucun testeur humain n'a joué ces réglages ; le jeu n'a pas de traversée automatique des douze niveaux (le robot `tools/bot.js` ne vise que l'ancien socle). À confirmer par un essai croisé avant diffusion.

## Méthode

`node tools/balance.cjs` calcule un **indice d'obstacles pour 100 tuiles** à partir des documents de niveau : obstacle isolé 1, ennemi 1,5, jet cyclique 1,5, fosse 0,7 (eau ou pointes de 3 cases et plus, comptées une fois), plateforme mobile 0,3, dalle fragile ou de mémoire 0,5, anneau 0,5 (alternant 1,5). Les rangées de pointes au fond d'un gouffre ne comptent que comme une fosse. C'est un repère de conception : il ne mesure ni la précision des sauts, ni les mécaniques (anneaux, courants d'air, boss).

Constat de départ : la courbe n'était pas croissante (pics aux niveaux 6 et 10, niveaux 7, 9 et 12 plus légers que le niveau 1).

## Ce qui a changé

Les réglages vivent dans `js/data/GZoneLevels.js` (tableau `BALANCE`) : `js/data/gzones.js` est généré et reste intact. `tests/balance.test.js` vérifie que chaque obstacle ajouté est sur un sol plat et dégagé (sol plat sur 3 cases de chaque côté, 4 cases libres au-dessus, loin des autres dangers, points de contrôle, pixels, appuis, anneaux, départ et arrivée).

| Niveau | Avant | Après | Changement |
|---|---|---|---|
| 1 Jardin des Plantes | 9,9 | 9,1 | ronces au pied de la première marche (x=44) et pointes collées aux ronces (x=102) retirées ; oiseaux −15 % |
| 2 Cathédrale | 9,4 | 8,2 | deux cierges de la nef retirés (x=28 et x=40) ; pigeons −15 % |
| 3 Château | 9,4 | 9,4 | tonneau et oiseau −10 % |
| 4 Feydeau, 5 Graslin | 10,9 · 11,7 | inchangés | |
| 6 Machines (boss) | 17,3 | 15,9 | deux jets de vapeur qui doublaient d'autres dangers retirés (x=61, x=139) |
| 7 Chantiers | 9,5 | 10,5 | deux obstacles ajoutés sur le quai d'arrivée (x=194 et x=204) ; ennemis +10 % |
| 8 Buren, 10 Pommeraye, 12 Tour LU | | | ennemis +10 % (pas de place sûre pour de nouveaux obstacles : tout est sur des passerelles, des anneaux ou l'arène du boss) |
| 9 Hangar (boss) | 9,3 | 9,8 | un obstacle ajouté avant la première porte coulissante (x=92) ; ennemis +10 % |
| 11 Mémorial | 5,4 | 5,4 | **toujours sans ennemi ni pointe**, voir ci-dessous |

### Mémorial : durcir sans trahir le ton

- **Dalles** : les leurres sont traversables, comme avant, mais leur lisibilité diminue de série en série. Première série (apprentissage, au-dessus d'un sol sûr) : leurres fantômes. Deuxième : leurres à peine voilés. Troisième (cinq stèles au-dessus de l'eau) : identiques aux vraies dalles, il faut avoir retenu la stèle. Un leurre touché s'efface doucement sous les pieds puis revient.
- **Marée** : le ralentissement dans les flaques passe de 700 à 600 d'accélération au sol (le sol normal est à 1100) ; elle ne tue toujours pas.

## Limites

- Les niveaux 9 et 12 restent bas sur l'indice : leur difficulté vient des mécaniques et du boss, et leur géométrie laisse peu de sol plat pour de nouveaux obstacles sans risque d'injustice. Les rendre plus durs demande de retoucher leurs parcours, avec des joueurs.
- Les vitesses d'ennemis sont des facteurs globaux par niveau, bornés entre 2 et 5,5 tuiles par seconde (testé).
- Aucun temps de complétion ni nombre de morts humain n'est affirmé.
