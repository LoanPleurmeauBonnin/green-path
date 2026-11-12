# Test croisé silencieux — Green Path

Test réalisé avec la **team Sowam** (retours relevés dans la présentation du processus créatif). Les propos sont cités tels que notés par l'équipe ; la date exacte du test et le détail de leur protocole (durée, appareil) ne sont pas consignés : `[À COMPLÉTER]`. Le protocole du cours prévoit ce test le mardi 10 novembre (J2).

## Protocole (rappel du cours)
1. Une personne **extérieure au projet** ouvre https://green-path-game.vercel.app sans explication.
2. Elle joue quelques minutes ; l'équipe ne parle pas et note ce qu'elle observe.
3. Les changements décidés après le test vont dans le carnet de bord (itération post-test).

## Observations (3 testeurs de la team Sowam)
| Testeur | Retour (cité) | Ce que cela révèle |
|---|---|---|
| Maxime | « Vous pourriez faire un personnage genre le maire de Nantes, ou des personnages historiques de Nantes pour pousser le truc (ex Jules Verne) » | Le patrimoine gagne à être incarné : les lieux manquent de voix. |
| Maxime | « Top ! Si jamais on a un bug sur un niveau, ça serait cool de pouvoir retourner au début du niveau ou au dernier point de contrôle ! » | Le joueur veut pouvoir repartir sans tout perdre, même en cas de bug. |
| Camille L. | « Trop bien !!! Je voudrais pouvoir changer la couleur de fond ou choisir le monument au centre » | Envie de personnaliser la carte postale de fin. |
| Camille T. | `[À COMPLÉTER : retour de Camille T., non recopié dans la présentation]` | |

## Itérations décidées après le test
| Retour | Décision | Où dans le jeu |
|---|---|---|
| Personnages historiques (Jules Verne) | Un personnage par lieu sur la carte, qui raconte une anecdote sourcée « Savais-tu que… » ; les figures historiques (Michel Colombe, Anne de Bretagne, Jules Verne, Graslin, Pommeraye, Lefèvre-Utile) parlent en leur nom | Carte du monde, bulle d'anecdote, `docs/sources.md` |
| Retourner au début ou au dernier point de contrôle | Menu pause avec « Au point de contrôle » (pixels conservés) et « Rejouer le niveau » ; reprise du niveau après fermeture | Menu pause, sauvegarde locale |
| Couleur de fond et monument au centre | Carte postale de fin : choix du fond et du centre (monument ou avatar) | Écran de la carte postale |

Les dates et détails de chaque changement sont dans [le carnet de bord](carnet-de-bord.md).

## Limites
- Le test porte sur trois personnes d'une seule équipe : il ne valide ni la difficulté ni l'accessibilité.
- Les temps cibles et la difficulté restent à confirmer par d'autres joueurs.
