# Green Path — protocole de test silencieux et état de validation

10 novembre 2026 · branche `fix/audit-green-path` · Phaser 3.90 conservé.

## Statut et limites

**Aucun playtest humain n'a été réalisé pendant cette intervention.** Aucun temps de complétion, avis de joueur ou taux de réussite humain n'est inventé. Les résultats ci-dessous sont des tests Node et des simulations dans Chromium. Les essais physiques manette, iOS et Android restent à effectuer. Aucun commit, push ni déploiement.

## Protocole humain reproductible

1. Recruter 3–5 volontaires, si possible avec des niveaux d'expérience différents et ne connaissant pas Green Path. Leur expliquer le relevé local et demander leur accord ; employer des identifiants P01, P02… sans nom ni e-mail. Pas de vidéo/audio sans accord distinct. Convenir de la durée de conservation des exports et les supprimer après analyse.
2. Utiliser une origine de test distincte et une partie vierge ; noter version du code, `GP.Tuning.version`, périphérique réel, dimensions, langue et météo. Garder les mêmes conditions pour comparer une variation ; les résultats sous météo simulée ne sont pas des observations live de Nantes.
3. Consigne unique : « Découvre le jeu et essaie de reconstruire le lieu. Tu peux arrêter à tout moment. » Laisser 30–60 secondes de découverte sans expliquer les commandes au-delà des indications du jeu. Ne pas demander de verbalisation continue, qui changerait ce test silencieux.
4. Observer un premier niveau puis, si possible, les deux autres. Alterner l'ordre des niveaux pour éviter de confondre apprentissage et difficulté. Prévoir 10 minutes par niveau ; autoriser abandon/pause. Intervenir uniquement pour la sécurité, un problème technique ou à la demande ; noter toute aide et son heure.
5. Relever : première action, compréhension de l'objectif, consultations de l'aide, échecs répétés par obstacle, aller-retour pour un fragment, hésitations, passages traversés trop facilement, pauses et durée active. Ne pas interpréter automatiquement une immobilité comme un blocage : elle peut correspondre à une lecture.
6. Après le jeu, demander « Quel était ton objectif ? », « Où as-tu hésité ? », « Qu'as-tu remarqué sous la couverture ? », « Quel passage semblait injuste ou sans intérêt ? ». Ne pas suggérer les réponses.
7. Analyser séparément faits observés, verbatim, signaux du log et hypothèses de conception. Comparer les médianes et dispersions des temps **des parties terminées**, sans exclure silencieusement les abandons. Avec 3–5 personnes, ces résultats sont exploratoires, pas une preuve statistique.

### Scénarios à observer

| Scénario | Indices recherchés |
|---|---|
| Accueil, Options, À propos | Découverte des trois rubriques, retour, compréhension des groupes et du remapping |
| Carte, aller/retour | Compréhension des marches, changement d'avis en mouvement, arrivée sur piédestal, fiche centrée |
| Jardin | Premier saut, ronces, objectif de collecte, dernier fragment, lanterne, auvents partiels |
| Cathédrale | Compréhension grimper/se hisser, rythme des corniches et gargouilles, surcharge de verbes |
| Château | Accroupissement, lecture des flèches/herses, passages couverts, différence vent/pluie |
| Reprise | Fermeture puis retour au dernier checkpoint, conservation collecte/temps/morts |
| Météo comparée | Pluie, vent puis neige, uniquement après la découverte non guidée ; remarquer la protection sans la suggérer |

### Fiche vierge

```text
ID / version / tuning / date :
Matériel réel / expérience / viewport / langue / météo :
Niveau / terminé ou abandon / durée active / morts / fragments restants :
Faits observés avec horodatage :
Aides données et raison :
Verbatim après partie :
Signaux automatiques à examiner :
Hypothèse / une variation proposée / critère de comparaison :
```

## Instrumentation volontaire, locale

`tools/playtest.js` n'est pas chargé par `index.html` et n'est pas publié avec les outils QA. Sur une origine locale dédiée, ouvrir `?dev=1`, démarrer un niveau et charger le script dans la console du jeu :

```js
var script = document.createElement('script');
script.src = 'tools/playtest.js';
document.head.appendChild(script); // attendre son chargement avant la suite
var scene = GP.game.scene.getScene('Game');
var session = GP.Playtest.start(scene, { id: 'P01', kind: 'human' });
// kind:'human' est une déclaration de l'opérateur, pas une certification.
session.note('Observation factuelle à saisir par l’observateur.');
session.stop();
session.download(); // JSON local, aucune télémétrie ni écriture réseau
```

Le relevé garde en mémoire paramètres, événements (saut, collecte, mort, checkpoint, abri, fin), échantillons espacés de 250 ms, temps actifs par tranche de 320 px et signaux d'immobilité de 15 s. Introduction, pause, mort en cours et fin sont exclus du temps actif ; `levelTimeMs` reste le chrono du jeu. Un signal n'est pas une note humaine. Les notes portent l'origine `observer-entered` ; les essais non déclarés humains sont marqués `simulation`. L'arrêt et le changement de scène détachent les écouteurs. Exporter à la fin de chaque niveau ; pas d'archivage automatique ni d'interface de supervision permanente.

## Résultats effectivement exécutés

| Catégorie | Résultat |
|---|---|
| Node `node --test tests/*.test.js` | **39/39** : sauvegarde, données, commandes, intégrité, piédestaux, décor, abris, configuration et instrumentation |
| Régression dans Chromium | **73/73 par format** : 1920×1080, 1366×768 et 844×390 |
| Polish existant dans Chromium | **97/97 par format**, remapping et commandes adaptatives compris |
| Socle Phaser dans Chromium | **24/24 par format** |
| Diagnostic géométrique | **9/9 configurations** : Jardin/Cathédrale/Château × pluie/vent/neige, aucun fragment inaccessible parmi les 80 |
| Inspection visuelle | 11 vues exportées par format ; rubriques, Options, piédestal, fiche, transition, abris et terminaisons |
| Humains / matériel mobile et manette | **Non effectués** |

Les recettes sont exécutées séquentiellement : leur origine partage `localStorage`. Les commandes clavier sont des événements DOM synthétiques et la manette est une substitution temporaire de l'API Gamepad. Le diagnostic géométrique téléporte depuis des surfaces candidates et neutralise les morts : il ne prouve ni parcours complet sans danger, ni rythme, ni compréhension, ni difficulté humaine. Le format 844×390 est une fenêtre CSS, pas une émulation iPhone.

Captures : `docs/screenshots/regressions-1920x1080.png`, `regressions-1366x768.png`, `regressions-844x390.png`. Météo et progression temporaires simulées, données restaurées ensuite ; les anciennes planches `polish-*` sont conservées comme historique.

## Difficultés trouvées et corrections

- Crédits : trois boutons ajoutés dans la place de l'ancien écran ; séparation en trois rubriques avec pages de lecture sans perte de texte, en FR/EN.
- Options : lignes de 20 px espacées de seulement 22 ; groupes 5/3 et pas de 28. Les anciennes données de démarrage Phaser pouvaient aussi réouvrir un groupe inattendu : initialisation explicite des transitions sans données.
- Carte : hauteur calculée depuis le chemin seulement, puis décalage graphique +4 récent aggravant l'enfoncement. `walkY` dérive les marches de l'asset ; modèle et sprite partagent X/Y, inversion conservée.
- Haie/barrière : modules répétables ouverts employés seuls ; textures dérivées fermées, sources et autres végétaux intacts.
- Transition : ancien ancrage haut concurrençant le HUD ; carte centrée. Une capture a révélé le fond créé après les textes à même profondeur : fond 80/textes 81 et test dédié.
- Deux erreurs de recette ont été corrigées, sans les confondre avec des défauts de sauvegarde : une collecte automatique invalidait le nombre attendu de fragments, et un helper réutilisait les données d'une précédente ouverture d'Options.

## Équilibrage : décisions prises et non prises

`js/data/tuning.js` centralise la référence `baseline-1` : gravité **950**, vitesse **110**, saut **−320**, coyote **90 ms**, buffer **110 ms**, accélérations **1100/700** ; temps cibles Jardin **90 s**, Cathédrale **110 s**, Château **100 s**. Ces valeurs sont **conservées**, pas prétendument validées par des humains. Les collectibles, obstacles, checkpoints et tolérances de collision n'ont pas été déplacés pour faciliter arbitrairement le jeu.

La seule variation gameplay livrée est la protection météo locale approuvée : sol sec sous couverture complète, vent atténué, auvents partiels. Voir [WEATHER_SHELTERS.md](WEATHER_SHELTERS.md).

Après observations : si plusieurs personnes échouent au même geste, distinguer lisibilité, apprentissage et portée physique ; corriger d'abord la cause confirmée. Pour un réglage, ne changer qu'une variable, nommer la nouvelle référence, comparer aux mêmes scénarios et conserver les résultats avant/après. Revoir les temps cibles uniquement avec des temps réels, sans rendre toutes les étoiles triviales. Aucun ajustement global supplémentaire n'est justifié à ce stade.
