# Green Path — météo abritée

Implémentation locale du 10 novembre 2026, Phaser **3.90**, sans migration de sauvegarde ni nouveau collider.

## Données et zones activées

`js/data/levels.js` expose `L.shelter(id, x, y, w, h, protection)`. Coordonnées en **pixels monde**, rectangles semi-ouverts `[x,x+w[ × [y,y+h[`. Les coefficients `rain`, `snow`, `wind` sont des **protections** : 0 = aucune, 0.5 = partielle, 1 = complète.

| Zone existante | Rectangle x/y/w/h | Pluie | Neige | Vent | Justification |
|---|---|---:|---:|---:|---|
| Jardin, `gare-auvent-1` | 66 / 188 / 44 / 36 | 0.5 | 0.5 | 0.25 | Sous le toit du premier décor de tram déjà dessiné, côtés ouverts |
| Jardin, `gare-auvent-2` | 418 / 172 / 44 / 36 | 0.5 | 0.5 | 0.25 | Second auvent existant, adapté à sa hauteur de sol |
| Château, `chateau-passage-1` | 912 / 176 / 48 / 49 | 1 | 1 | 0.5 | Passage sous le bloc plein des colonnes 57–59, au-dessus de la herse |
| Château, `chateau-passage-2` | 1008 / 176 / 48 / 49 | 1 | 1 | 0.5 | Passage sous le bloc plein des colonnes 63–65 |

Les coefficients ont été validés par l'utilisateur. Ils traduisent les structures **du décor de jeu existant**, pas une mesure météorologique ni un relevé architectural certifié du monument réel. Aucun porche ou toit n'a été inventé pour étendre la mécanique. Pas d'abri actif à la Cathédrale ni dans le prototype Bouffay : aucune couverture pertinente n'a été validée ici. Pas de verrière inventée, ni de nef entièrement sèche par défaut.

```js
L.shelter('passage', 912, 176, 48, 49,
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

L'exposition n'est **pas sérialisée**. Après `restoreRun`, elle est recalculée immédiatement depuis le point sûr restauré et la météo courante. Une reprise normale se fait à la dernière lanterne, pas à la position exacte où l'onglet a été fermé. Les checkpoints n'ont pas été déplacés pour les placer sous les nouveaux abris. Le test d'un checkpoint couvert utilise une zone fixture temporaire, retirée en fin de recette.

Les rectangles sont des métadonnées, pas des corps Arcade : collisions, herses, collecte et format de sauvegarde restent inchangés. Un changement météo dans l'abri recalcule la physique avec la protection courante.

## Validation et limites

- Tests Node : entrée/sortie, bords, coefficients indépendants, chevauchement, bornage, transition, masque, valeurs de physique et contour des données.
- Recette Chromium : entrée/sortie progressive, pluie sec/partiel, vent et neige, changement météo en cours, caméra décalée, chevauchement, reprise à checkpoint couvert en fixture et reprise extérieure sans état résiduel, collision au sol/linteau.
- Trois formats : 1920×1080, 1366×768 et 844×390, exports inspectés. Bilan chiffré et distinction humain/simulation dans [PLAYTEST_REPORT.md](PLAYTEST_REPORT.md).
- Aucun essai humain ni appareil mobile physique ; aucune mesure de performance sur téléphone. Le rendu évite les allocations par pixel du masque et les changements de couleur inutiles, sans revendiquer un budget FPS matériel validé.

Pour ajouter une zone : identifier une couverture déjà dessinée et justifiée, relever son rectangle monde, choisir séparément les trois protections, tester pieds/centre du corps et caméra, puis inspecter entrée/sortie et sauvegarde. Toute nouvelle structure ou modification sensible des coefficients demande une validation de design.
