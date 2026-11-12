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

## Mécaniques, ennemis et météo des niveaux 4 à 12
Chaque lieu a **une mécanique propre** (`js/systems/Dangers.js`, briques du constructeur de `js/data/levels-ville.js`) et **deux ou trois réactions à la météo** (réglées par `L.wxm`, annoncées par `L.weatherText`). Règle commune : un danger a toujours un **signe avant d'agir** (ombre, souffle, tremblement, eau qui monte), et chaque réaction est bornée.

| Lieu | Mécanique ou ennemi | Signe avant le danger | Pluie | Soleil | Vent |
|---|---|---|---|---|---|
| Jardin | ronces, mauvaises herbes | ronce visible avant de piquer | ronces qui poussent (1,2 s) | fleurs-plateformes | |
| Cathédrale | gargouilles | goutte qui se forme (0,5 s) | gouttes ×1,7 plus fréquentes | | |
| Château | esprits de la garde (patrouille, 24 à 28 px/s) | esprit visible, flotte | ×0,8 (plus lents) | ×1,2 (plus agités) | tonneaux ×1,25 |
| Île Feydeau | eau qui monte (marée, 9 s), bateaux qui s'enfoncent (14 px en 1,6 s), visages qui mentent et brouillent les pixels proches | la surface monte lentement ; le bateau descend | marée +1 ligne | marée −1 ligne | bateaux qui coulent ×1,5 |
| Place Graslin | Muses qui lancent des notes (85 px/s, à hauteur de tête : on s'accroupit ou on saute), parasols qui font rebondir (4,75 tuiles), projecteurs, rideau à séquence (< > V) | la statue s'éclaire 0,5 s avant la note ; faisceau visible ; séquence affichée | notes ×0,75 | projecteurs ×1,25 | rebond ×1,1 |
| Machines de l'île | jets de vapeur (3 s de cycle), **Grand Éléphant** qui traverse un canal (va-et-vient de 13 s) et sur lequel on grimpe par cinq plateformes qui le transportent, **araignées mécaniques** (au sol ou suspendues à un fil, accroupi on passe dessous) qui n'avancent (36 à 44 px/s, sous 170 px) que si le joueur ne les regarde pas : elles se figent, teintées de pierre, quand il leur fait face (principe des anges qui pleurent) | souffle 0,6 s avant le jet (1,2 s) | jets ×0,75 | araignées ×1,25 |  |
| Parc des Chantiers | conteneurs qui tombent de la grue, chariots qui avancent seulement quand on est dessus, cale qui entraîne en arrière (55 px/s) | ombre au sol 0,9 s avant la chute | tapis ×1,3 | chariots ×1,3 | conteneurs ×1,25 plus fréquents |
| Anneaux de Buren | **bornes de couleur** : marcher sur une borne allume les passerelles de sa couleur et éteint les autres (contour pâle) ; une île par borne au milieu des bras d'eau | halo de la borne, passerelle lumineuse ; fond de jour ou de nuit selon l'heure | sous la pluie, une couleur autre que le bleu ne dure que 5 s (clignote avant de s'éteindre) | | |
| Hangar à Bananes | pourriture : vert (1,6 s), jaune (5,2 s, récoltable), brun (1,8 s), effacé (3 s), puis repousse ; moisissure qui s'étend sur le sol puis recule (cycle de 8 s, dangereuse au-delà de 25 % de sa taille) | la couleur du pixel ; la plaque grandit à vue d'œil | pourriture ×0,8, moisissure ×1,3 | pourriture ×1,3, moisissure ×0,8 | |
| Mémorial | **aucun ennemi** : stèle à lire puis porte de lumière à rouvrir de mémoire (↓ = bas, saut = haut ; une erreur recommence sans rien coûter), dalles de verre (0,8 s puis 3 s), marée calme (6 s) | la séquence est écrite sur la stèle ; le verre tremble | marée +1 ligne, verre ×0,8 | marée −1 ligne, verre qui revient ×0,7 | |
| Passage Pommeraye | verre de la verrière (se fissure 0,8 s après qu'on s'y pose, revient 3 s plus tard), lustres qui balancent, escalier monumental | le verre tremble avant de céder | verre ×0,7 | verre qui revient ×0,6 | |
| Tour LU | reprise des mécaniques (parasol de café qui fait rebondir, petits-beurres flottants, bouches de vapeur, verre, chariot) ; **courant d'air ascendant** : gravité allégée de 63 %, le saut passe de 3,2 à 6,7 tuiles | colonne d'air turquoise avec des étincelles qui montent | jets ×0,8 | jets ×1,2 | parasol ×1,1 |

Au total, plus de 3 paramètres de la météo opèrent dans chaque niveau : la pluie (sol qui glisse + réaction du lieu), le vent (poussée des sauts + réaction du lieu), la brume (pixels visibles de près), la nuit, et le soleil. **Secours** : sans réseau, météo neutre, aucun de ces réglages ne s'applique et tous les niveaux restent finissables.

**Vérifications faites par script** (jeu piloté image par image avec la vraie physique) : parasol (rebond jusqu'à la corniche), anneau rouge (franchit 9 tuiles d'eau, un saut un peu tardif fait accrocher le rebord), anneau bleu (atteint la passerelle haute), alignement (un seul passage dans l'anneau bleu fait apparaître le pont), chaîne de trois anneaux, chariot, enfoncement des bateaux, marée (mort sur le bas quai à marée haute, pas sur un balcon), conteneur, jet, projecteur, rideau (séquence < > V), cycle de pourriture, fin de niveau jusqu'à l'écran de résultat, textes anglais. **Non fait** : aucun de ces niveaux n'a encore été joué à la main de bout en bout ; temps cibles et difficulté sont provisoires.

## Limite de temps
Chaque niveau s'arrête après **180 s** de jeu (`L.maxTime` : 200 s pour Feydeau, Graslin et Machines, 210 s pour les Chantiers, 240 s pour le Hangar où l'on attend parfois qu'un pixel jaunisse). Avertissement à 30 s de la fin (message fixe, pas de flash), puis écran « TEMPS ÉCOULÉ » : REJOUER ou CARTE, **sans rien enregistrer**. La pause n'est pas comptée. Ce n'est pas une règle de la grammaire du lieu : c'est une garde contre un niveau sans fin pendant l'évaluation.

## Étoiles (objectif de fin de niveau)
Règle (`js/systems/Stars.js`, à ajuster au playtest) : 1 étoile image complète, +1 sans mourir, +1 sous le temps cible du lieu (`parTime`). Sans image complète, 0 étoile. Le meilleur résultat est conservé.

## Monument « en mémoire »
Invariant de la carte : un monument reste gris (luminance, sans teinte) tant que son niveau n'est pas terminé ; il retrouve ses couleurs, une seule fois, au retour sur la carte après la réussite.

## Test de qualité
Une personne qui n'a pas vu le château doit pouvoir lire cette fiche et prédire dans quel ordre l'image apparaît. **À tester au test croisé.**

## À valider
- Régler les temps cibles au test croisé ; relever précisément le Château avant tout générateur de terrain patrimonial.
- Remplacer ultérieurement le masque géométrique stylisé par des régions annotées sur une source autorisée.
