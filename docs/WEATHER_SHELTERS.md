# Green Path — météo abritée

## État actuel : les douze GZones

La demande ultérieure de réaliser les douze niveaux remplace le périmètre initial limité au Château. Les passages ci-dessous sont les couvertures actives, rendues dans le décor et utilisées par le masque pluie/neige et la physique. Les protections sont indépendantes ; elles ne suppriment pas la météo globale de Nantes.

| Lieu | Rectangle x/y/w/h (pixels monde) | Pluie/neige | Vent | Structure |
|---|---|---:|---:|---|
| Cathédrale | 272 / 40 / 1248 / 344 | 1 | 1 | Nef sous voûte |
| Château 1 | 640 / 192 / 64 / 49 | 1 | 0.5 | Premier passage sous linteau |
| Château 2 | 896 / 192 / 64 / 49 | 1 | 0.5 | Second passage sous linteau |
| Machines | 608 / 24 / 672 / 296 | 1 | 0.75 | Travée couverte de l'atelier |
| Hangar | 704 / 24 / 2976 / 328 | 1 | 0.9 | Entrepôt couvert |
| Pommeraye | 0 / 24 / 3360 / 392 | 1 | 1 | Verrière et galeries |
| Mémorial | 1408 / 72 / 736 / 216 | 1 | 1 | Galerie intérieure |
| Tour LU | 768 / 24 / 1568 / 424 | 1 | 0.9 | Section intérieure |

Le nouveau Jardin est celui du JSON : les anciens auvents de tram ne sont pas inventés dans ce parcours. Les cales, quais, remparts et autres espaces ouverts restent exposés. Les jets du Jardin peuvent geler en appuis ; les flotteurs s'enfoncent moins sous neige ; les parasols et mécanismes ont leurs réactions locales. Les jets de vapeur ne sont raccourcis par la pluie que s'ils sont réellement exposés. Aucun effet de foudre magnétique, aucune humidification magique d'un intérieur couvert.

Recette récente : [levels-qa.json](levels-qa.json), suivi et limites : [LEVEL_REDESIGN.md](LEVEL_REDESIGN.md). Aucune validation humaine globale ni mesure météo réelle d'un intérieur. Le reste de ce document conserve le descriptif du système et des premiers abris comme **historique**, notamment les deux auvents de l'ancien Jardin.

## Historique du premier lot

Système initial du 10 novembre 2026, Phaser **3.90**. Rectangles du Château actualisés le 11 novembre pour sa refonte locale ; voir [LEVEL_REDESIGN.md](LEVEL_REDESIGN.md). Le système d'abris n'ajoute pas lui-même de collider ni de champ de sauvegarde.

## Données et zones activées

`js/data/levels.js` expose `L.shelter(id, x, y, w, h, protection)`. Coordonnées en **pixels monde**, rectangles semi-ouverts `[x,x+w[ × [y,y+h[`. Les coefficients `rain`, `snow`, `wind` sont des **protections** : 0 = aucune, 0.5 = partielle, 1 = complète.

| Zone existante | Rectangle x/y/w/h | Pluie | Neige | Vent | Justification |
|---|---|---:|---:|---:|---|
| Jardin, `gare-auvent-1` | 66 / 188 / 44 / 36 | 0.5 | 0.5 | 0.25 | Sous le toit du premier décor de tram déjà dessiné, côtés ouverts |
| Jardin, `gare-auvent-2` | 418 / 172 / 44 / 36 | 0.5 | 0.5 | 0.25 | Second auvent existant, adapté à sa hauteur de sol |
| Château, `chateau-passage-1` | 640 / 192 / 64 / 49 | 1 | 1 | 0.5 | Baie sous le linteau solide des colonnes 40–43 du nouveau châtelet |
| Château, `chateau-passage-2` | 896 / 192 / 64 / 49 | 1 | 1 | 0.5 | Baie sous le linteau solide des colonnes 56–59 du nouveau châtelet |

Les coefficients ont été validés par l'utilisateur et sont conservés. Ils traduisent les structures **dessinées et construites dans le jeu**, pas une mesure météorologique ni un relevé architectural certifié du monument réel. Le nouveau châtelet appartient à la refonte architecturale approuvée ; seuls ses deux passages réellement couverts sont protégés, pas les échafaudages ni le chemin de ronde. Pas d'abri actif à la Cathédrale ni dans le prototype Bouffay : ces niveaux restent inchangés.

```js
L.shelter('passage', 640, 192, 64, 49,
  { rain: 1, snow: 1, wind: 0.5 });
```

## Architecture

- `js/systems/WeatherShelters.js` : fonctions sans dépendance au moteur pour inclusion spatiale, bornage, maximum par canal, transition et exposition visuelle.
- `js/data/tuning.js` : valeurs physiques existantes et transition centralisées ; 300 ms pour passer de 0 à 1, delta borné à 50 ms.
- `GameScene.updateShelter` : échantillonne au centre horizontal du corps ; pluie/neige aux pieds (`bottom−1`), vent au centre du corps. Applique une interpolation linéaire bornée, sans modifier vitesse/saut/gravité.
- `WeatherRules.physics(env, base, cover)` : calcule la physique depuis l'environnement global et la protection locale. Le widget conserve la donnée météo réelle/simulée globale ; un abri ne change pas la météo de Nantes.
- `WeatherFX` : masque pluie/neige avec la même géométrie, en convertissant écran → monde par le défilement caméra. Les segments de gouttes sont testés pixel par pixel pour éviter qu'une longue goutte traverse une limite.

En chevauchement, prendre **le maximum de chaque canal**, jamais la somme. Deux couvertures de 0.5 ne deviennent pas artificiellement étanches. L'identifiant renvoyé sert au relevé/feedback, pas au calcul des coefficients.

## Effets

Pour l'accélération : `valeur = météo + (sec − météo) × protection`. Sous pluie normale, le sol extérieur garde 650 ; auvent du Jardin 875 ; passage couvert 1100. Sous neige : extérieur 430 au sol et 520 en l'air, retour vers 1100/700 selon protection. Sous orage, la référence extérieure reste 560.

La poussée du vent est multipliée par `1 − protectionVent` : 50 % de poussée sous les passages, 75 % sous les auvents. L'excès de vitesse météo des tonneaux est aussi modulé localement. Les ronces sensibles à la pluie ne poussent pas sous une protection complète ; la fréquence de gargouille tient compte de l'exposition locale (aucune zone active ajoutée à la Cathédrale).

Le brouillard, la nuit, les lanternes et les raccourcis de grand soleil ne sont pas supprimés par un toit. Pas de nouvelle accumulation de neige ni de simulation d'humidité persistante : le système existant ne les modélise pas. La convention validée considère le sol sec sous couverture complète ; il n'y a pas de séchage retardé après une pluie passée.

## Rendu et feedback

Les précipitations des niveaux sont à la profondeur 4.5, derrière les murs/linteaux solides et devant le fond ; la carte garde son ordre de couches précédent. Le masque supprime les gouttes sous couverture complète et réduit leur opacité sous couverture partielle. Aucune texture source ni collision n'est modifiée.

Le retour physique et l'indication discrète « ABRI · AU SEC » / « ABRI · PROTECTION PARTIELLE » progressent sur 300 ms. La couverture spatiale des particules reste attachée au toit (pas au déplacement du héros), donc ses limites sont fixes et cohérentes. Le brouillard et le ciel ne changent pas brutalement en entrant. Pas d'éclair/flash ajouté.

## Sauvegarde et reprise

L'exposition n'est **pas sérialisée**. Après `restoreRun` et à la réapparition, elle est recalculée immédiatement depuis le point sûr et la météo courante. Une reprise normale se fait à la dernière lanterne, pas à la position exacte où l'onglet a été fermé. Les checkpoints du Château ont été repositionnés avec son parcours, pas pour forcer un abri à leur emplacement. Le test d'un checkpoint couvert utilise une zone fixture temporaire, retirée en fin de recette.

Les rectangles sont des métadonnées, pas des corps Arcade. Un changement météo dans l'abri recalcule la physique avec la protection courante. Les nouvelles collisions, herses et conditions de sortie du Château sont un chantier distinct ; le format de sauvegarde reste inchangé et seule la reprise de son ancien parcours est invalidée par sa révision.

## Validation et limites

- Tests Node : entrée/sortie, bords, coefficients indépendants, chevauchement, bornage, transition, masque, valeurs de physique et contour des données.
- Recette Chromium : entrée/sortie progressive, pluie sec/partiel, vent et neige, changement météo en cours, caméra décalée, chevauchement, reprise à checkpoint couvert en fixture et reprise extérieure sans état résiduel, collision au sol/linteau.
- Trois formats : 1920×1080, 1366×768 et 844×390, exports inspectés. Bilan chiffré et distinction humain/simulation dans [PLAYTEST_REPORT.md](PLAYTEST_REPORT.md).
- Aucun essai humain ni appareil mobile physique ; aucune mesure de performance sur téléphone. Le rendu évite les allocations par pixel du masque et les changements de couleur inutiles, sans revendiquer un budget FPS matériel validé.

Pour ajouter une zone : identifier une couverture déjà dessinée et justifiée, relever son rectangle monde, choisir séparément les trois protections, tester pieds/centre du corps et caméra, puis inspecter entrée/sortie et sauvegarde. Toute nouvelle structure ou modification sensible des coefficients demande une validation de design.
