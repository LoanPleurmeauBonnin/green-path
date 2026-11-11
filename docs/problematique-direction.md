# Problématique et direction créative — Green Path

> Trace de direction initiale. État effectif et limites actualisées : [HERITAGE_GRAMMAR.md](../HERITAGE_GRAMMAR.md), [GAME_DESIGN.md](../GAME_DESIGN.md). La palette n'est pas teintée par la température ; le masque du Château est géométrique, pas une segmentation sémantique ; le terrain n'est pas généré depuis les relevés.

## Problématique
Comment transformer un geste de jeu (collecter des pixels) en reconstruction de la mémoire d'un lieu, de sorte que **l'ordre dans lequel l'image réapparaît traduise la structure du patrimoine** plutôt que son apparence ?

## Formule (modèle de la bible)
Je transforme le **Château des ducs de Bretagne** en **grille de cellules à reconstituer** en traduisant **son rythme plein / vide et sa masse**, pilotée par **la collecte du joueur et la météo de Nantes**, afin de produire une œuvre **interactive** qui rend perceptible **la mémoire d'un lieu comme une structure qu'on rebâtit**.

## Direction créative

| Élément | Choix |
|---|---|
| Territoire | **Generative Archive** (une collection qui produit), proche de **Pixel before Pixel** (mosaïque et image numérique). |
| Régimes visuels (bible) | **Grille computationnelle** (cellules et tuiles) ; **cartographie sensible** (la carte de Nantes et la ligne verte). |
| Univers | Pixel art assumé, 480×270 mis à l'échelle par multiples entiers ; palette unique d'une vingtaine de couleurs, avec le vert de la ligne verte comme signature. |
| Mapping data | Open-Meteo : température → teinte, pluie → particules, vent → dérive. Toujours un fallback local. |
| Interaction | Clavier (←→ / A D, espace), tactile ; feedback immédiat à chaque pixel collecté. |

## Pièges de la bible que le projet cherche à éviter
- *Le monument dessiné tel quel* : l'image n'est pas dévoilée par un simple masque, c'est son **ordre de révélation** qui porte la grammaire.
- *La météo ajoutée à la fin* : elle est dans la grammaire, avec un mapping perceptible.
- *Le projet impossible à relancer hors ligne* : tout fonctionne en local, l'API a un secours.
- *La citation historique sans vérification* : tout fait non confirmé est marqué « À VÉRIFIER ».
- *La surcharge d'effets* : peu d'effets, tous liés à la collecte ou à la météo.

## Limite assumée
Les silhouettes de monuments actuellement sur la carte sont des **repères illustratifs générés par code**. L'enjeu artistique se joue dans la reconstruction de l'image dans les niveaux (Phase 2–3), pas dans ces silhouettes.
