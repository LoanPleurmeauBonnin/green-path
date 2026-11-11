# Grammaire — Green Path

Chaîne : SOURCE (Château des ducs de Bretagne) → GRAMMAIRE → ALGORITHME → DATA / INTERACTION → ŒUVRE.
Statut : fiche J1 actualisée par l'audit du 10/11. Référence complète : [HERITAGE_GRAMMAR.md](../HERITAGE_GRAMMAR.md). Les règles de terrain restent écrites à la main ; aucun relevé métrique n'a été inventé.

## Fiche de grammaire (niveau de référence : Château)

| Champ | Contenu |
|---|---|
| **Primitives** | Cellule colorée ; photo 48×32 uniquement au Jardin ; ailleurs sprite de monument ; rectangle de mur, bande centrale, volume latéral, seuil. |
| **Relations** | Un fragment collecté révèle un groupe de cellules. Château : assise basse, centre, élévations latérales (`fortification`), interprétation géométrique du sprite. |
| **Invariants** | Toutes les cellules opaques révélées une fois ; nombre de groupes égal au nombre de collectibles ; image complète à 100 % ; niveau terminé à 100 %. |
| **Variables** | Taux de reconstruction, ordre des cellules, précipitations/densité, vent/poussée, accélération au sol et visibilité. La température est seulement affichée. |
| **Temps** | Collecte événementielle ; météo rafraîchie toutes les 5 min, délai maximal 4 s. |
| **Déclencheur** | Collecte d'un pixel (action du joueur) ; donnée Open-Meteo. |
| **Limites** | Vent 0–80 km/h, précipitations 0–10 mm, données numériques finies ; **météo réellement opérante sur la physique** ; reset et fallback neutre. |

## Règle en une phrase
« Un fragment collecté révèle un groupe de cellules, dans l'ordre géométrique choisi pour le lieu. »

## Un ordre par lieu (la variation entre niveaux)
| Lieu | Propriété traduite | Ordre de révélation (hypothèse) |
|---|---|---|
| Château | Masse puis élévations | Assise → région centrale → régions latérales, implémenté ; ce n'est pas une segmentation architecturale mesurée |
| Cathédrale | Verticalité | Bas → haut, centre → côtés ; aucun ordre sémantique de tours implémenté |
| Jardin des Plantes (Palmarium) | Croissance | Du bas vers le haut, depuis le sol ; dans une ligne, du centre vers les bords (**implémenté** sur la photo 48×32, `PixelCollection.js`, ordre `bottomUp`) |
| Bouffay (maison à pans de bois) | Ossature puis remplissage | Poutres d'abord, panneaux ensuite |

Les interprétations doivent être étayées par les relevés de l'équipe ; Bouffay conserve `bottomUp` et reste hors parcours.

## Mapping météo (entrée → règle → sortie perceptible)
La météo réelle de Nantes change l'environnement de Green Path et les niveaux y réagissent (`js/systems/WeatherRules.js`, rendu `WeatherFX.js` et `LevelArt.sky`). Données demandées au démarrage puis toutes les 5 min.

| Entrée Open-Meteo | Règle (bornée) | Sortie perceptible |
|---|---|---|
| `weather_code` pluie / bruine / orage | accélération au sol 1100 → 650 (orage 560) ; niveau : ronces qui poussent (Jardin), gargouilles ×1,7 plus fréquentes (Cathédrale) | pluie, ciel gris, on glisse en s'arrêtant, ronces qui sortent de terre (1,2 s d'annonce) |
| `weather_code` neige | accélération au sol 430, en l'air 520 | flocons, dérapage |
| `wind_speed_10m` ≥ 20 km/h + `wind_direction_10m` | poussée horizontale en l'air : (vent − 15) × 2,5 px/s², max 110 (toujours inférieure au contrôle du joueur, 700) ; tonneaux ×1,25 | sauts déportés, nuages et pluie inclinés |
| `weather_code` brume | les pixels ne se voient qu'à 90 px (une lueur reste à 15 %) | voile clair, pixels qui apparaissent de près |
| `is_day` = 0 | pixels visibles à 130 px ; lanternes et lampadaires allumés | ciel de nuit étoilé, halos |
| `weather_code` dégagé + jour | Jardin : fleurs-plateformes (raccourcis, jamais indispensables) | soleil, fleurs géantes |
| `cloud_cover` | 0–100 % → 0 à 8 nuages | ciel plus ou moins chargé |
| `temperature_2m` | affichée | widget |

**Limites** : chaque effet est annoncé à l'entrée du niveau (et par un message si la météo change en cours de partie). Les 80 fragments des 3 niveaux accessibles sont atteignables sous pluie, vent et neige selon le diagnostic géométrique, qui ignore les morts ; aucune garantie de traversée humaine ne doit être déduite de ce seul test. Pas de flash, pas d'éclair.
**Fallback** : réseau coupé → dernière météo reçue, gardée dans le navigateur (« HORS LIGNE · IL Y A N MIN ») ; jamais rien reçu → météo neutre sans effet (`data/fallback.json`, valeurs codées dans `WeatherManager.js`).

**Modulation locale livrée** : `WeatherShelters` associe des rectangles aux deux passages couverts du Château (pluie/neige 1, vent 0.5) et aux deux auvents du Jardin (pluie/neige 0.5, vent 0.25). Maximum par canal en chevauchement, transition physique 300 ms, précipitations masquées spatialement. La donnée globale reste identique ; c'est l'exposition qui change. Les zones correspondent aux structures du décor, pas à un relevé certifié du monument. Architecture et limites : [WEATHER_SHELTERS.md](WEATHER_SHELTERS.md). Valeurs physiques et temps cibles centralisés sans retouche globale : [PLAYTEST_REPORT.md](PLAYTEST_REPORT.md).

## Niveau : règles
- Un pixel ramassé = un groupe de cases révélé (le nombre de groupes est égal au nombre de pixels du niveau : 32 pour le Jardin).
- Ronce, pointes, flèche, goutte, tonneau ou chute = **une mort** : compteur MORTS +1, retour à la dernière lanterne allumée, pixels gardés (le compteur sert à l'étoile « sans mourir »).
- Au Jardin, l'image reconstruite est une **photo pixélisée** (48×32 cases, 16 couleurs). Ailleurs, sprite de remplacement ; cases cachées en gris très sombre.
- Une capacité nouvelle par niveau, puis combinées : Jardin (courir, sauter, ronces), Château (s'accroupir : flèches, herses, tonneaux), Cathédrale (grimper aux colonnes, s'accrocher aux rebords : gargouilles, corniches qui s'effritent), Bouffay (étals mobiles, tout combiné).

## Étoiles (objectif de fin de niveau)
Règle (`js/systems/Stars.js`, à ajuster au playtest) : 1 étoile image complète, +1 sans mourir, +1 sous le temps cible du lieu (`parTime`). Sans image complète, 0 étoile. Le meilleur résultat est conservé.

## Monument « en mémoire »
Invariant de la carte : un monument reste gris (luminance, sans teinte) tant que son niveau n'est pas terminé ; il retrouve ses couleurs, une seule fois, au retour sur la carte après la réussite.

## Test de qualité
Une personne qui n'a pas vu le château doit pouvoir lire cette fiche et prédire dans quel ordre l'image apparaît. **À tester au test croisé.**

## À valider
- Régler les temps cibles au test croisé ; relever précisément le Château avant tout générateur de terrain patrimonial.
- Remplacer ultérieurement le masque géométrique stylisé par des régions annotées sur une source autorisée.
