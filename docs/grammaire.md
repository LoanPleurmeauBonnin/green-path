# Grammaire — Green Path

Chaîne : SOURCE (Château des ducs de Bretagne) → GRAMMAIRE → ALGORITHME → DATA / INTERACTION → ŒUVRE.
Statut : brouillon J1. Les valeurs chiffrées sont des paramètres de départ, à ajuster au prototype.

## Fiche de grammaire (niveau de référence : Château)

| Champ | Contenu |
|---|---|
| **Primitives** | Cellule (1 pixel de l'image), grille 48×32, module « dent » (merlon) et module « ouverture » (créneau), segment de courtine, tour. |
| **Relations** | Une cellule collectée en révèle une dans la grille. L'ordre de révélation suit la logique du lieu : d'abord la masse (courtines), puis la cadence (dents / ouvertures qui alternent), enfin la verticalité (tours). |
| **Invariants** | Grille 48×32 ; 1 pixel collecté = 1 cellule ; l'ordre de révélation du lieu ; image complète à 100 % ; le niveau se termine à 100 %. |
| **Variables** | Position des pixels dans le niveau ; température (teinte de la palette) ; précipitations (densité des particules de pluie) ; vent (direction de dérive des particules) ; taux de reconstruction. |
| **Temps** | Évolution par la collecte (événement), météo lue à l'ouverture du niveau et rafraîchie toutes les 30 min (évolution lente). |
| **Déclencheur** | Collecte d'un pixel (action du joueur) ; donnée Open-Meteo. |
| **Limites** | Température bornée à 0–35 °C pour la palette ; vent borné à 0–80 km/h ; précipitations bornées ; **la météo ne modifie jamais la physique du jeu** ; reset de la sauvegarde ; valeurs de secours si l'API est indisponible. |

## Règle en une phrase
« Un pixel collecté révèle une cellule, dans l'ordre qui rebâtit la structure du lieu : masse, cadence, verticalité. »

## Un ordre par lieu (la variation entre niveaux)
| Lieu | Propriété traduite | Ordre de révélation (hypothèse) |
|---|---|---|
| Château | Cadence plein / vide, masse puis tours | Courtines → alternance dents / ouvertures → tours |
| Cathédrale | Verticalité, symétrie des deux tours | Du bas vers le haut, côtés gauche et droit en miroir |
| Jardin des Plantes (Palmarium) | Croissance | Du bas vers le haut, depuis le sol ; dans une ligne, du centre vers les bords (**implémenté** sur la photo 48×32, `PixelCollection.js`, ordre `bottomUp`) |
| Bouffay (maison à pans de bois) | Ossature puis remplissage | Poutres d'abord, panneaux ensuite |

Les ordres des trois autres lieux sont à valider après observation de leurs images ; je ne les ai pas encore vérifiés sur Nantes Patrimonia.

## Mapping météo (entrée → règle → sortie perceptible)
Implémenté dans `js/systems/WeatherFX.js`, sur la carte et dans le niveau 1 (où le ciel en bandes, les nuages et les lanternes suivent aussi la météo).

| Entrée Open-Meteo | Règle | Sortie visible |
|---|---|---|
| `is_day` | nuit → filtre MULTIPLY bleu profond ; lampadaires et fenêtres allumés | Ambiance jour / nuit |
| `weather_code` (WMO) | catégorie : dégagé, nuageux, couvert, brume, bruine, pluie, neige, orage → teinte du filtre et type de particules | Couleur générale, pluie ou neige, voile de brume |
| `cloud_cover` | 0–100 % → 0 à 6 ombres de nuages | Ombres qui passent sur la carte |
| `precipitation` | 0–10 mm (borné) → 45 à 170 gouttes (÷ 3 si mouvement réduit) | Densité de pluie / neige |
| `wind_speed_10m` + `wind_direction_10m` | 0–80 km/h (borné) → vitesse de dérive des nuages (3–35 px/s) et inclinaison de la pluie, dans la direction où souffle le vent | Mouvement et pente |
| `temperature_2m` | affichée dans le widget ; teinte de la palette du niveau en Phase 2 (0–35 °C) | Chiffre, puis couleur |

**Limites** : effet purement visuel (jamais sur la physique) ; pas de flash ni d'éclair ; transitions en fondu (0,9 s).
**Fallback** : délai 4 s puis valeurs de secours codées dans `WeatherManager.js` (13 °C, nuageux, jour 7 h–19 h selon l'horloge de l'appareil) ; cache de 30 min. Le widget affiche la source : EN DIRECT, IL Y A N MIN (copie en cache), HORS LIGNE ou TEST.
**Vérifié** : la hauteur de saut mesurée est la même de jour et par nuit pluvieuse (51,25 px).

## Niveau : règles
- Un pixel ramassé = un groupe de cases révélé (le nombre de groupes est égal au nombre de pixels du niveau : 32 pour le Jardin).
- Ronce ou chute = **une mort** : compteur MORTS +1, retour à la dernière lanterne allumée, pixels gardés (le compteur sert à l'étoile « sans mourir »).
- L'image reconstruite est une **vraie photo pixélisée** (48×32 cases, 16 couleurs) : un pixel ramassé révèle un groupe de cases ; les cases cachées restent en gris très sombre (l'image « en mémoire »).
- Les mécaniques sont introduites une à une dans le niveau 1 (courir, sauter, sauter plus haut, lanternes, ronces), puis combinées.

## Étoiles (objectif de fin de niveau)
Règle (`js/systems/Stars.js`, à ajuster au playtest) : 1 étoile image complète, +1 sans mourir, +1 sous le temps cible du lieu (`parTime`). Sans image complète, 0 étoile. Le meilleur résultat est conservé.

## Monument « en mémoire »
Invariant de la carte : un monument reste gris (luminance, sans teinte) tant que son niveau n'est pas terminé ; il retrouve ses couleurs, une seule fois, au retour sur la carte après la réussite.

## Test de qualité
Une personne qui n'a pas vu le château doit pouvoir lire cette fiche et prédire dans quel ordre l'image apparaît. **À tester au test croisé.**

## À valider
- Les valeurs chiffrées (bornes, 30 min de cache) doivent être confirmées dans le moteur (Phase 2–3).
- L'ordre « courtine → dents → tours » est une hypothèse d'observation, à confirmer sur la photo choisie.
