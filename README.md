# Green Path — Nantes en mille pixels

> *« Psst… par ici ! Je suis le gardien de la ligne verte. Cette nuit, un grand coup de vent a soufflé sur Nantes. Ses monuments se sont envolés en mille pixels ! »*

Un jeu de plateforme pixel art qui suit la **ligne verte** de Nantes. De lieu en lieu, tu cours, tu sautes, tu grimpes et tu ramasses les pixels qui reconstruisent, case après case, chaque monument. **La vraie météo de Nantes change le jeu** : s'il pleut à Nantes, il pleut dans Green Path, le sol glisse et les ronces poussent.

**▶ Jouer : https://green-path-sepia.vercel.app** (ordinateur, ou téléphone tenu en paysage)

![Écran d'accueil](docs/screenshots/menu.png)

| La carte du monde | 1 · Jardin des Plantes |
|---|---|
| ![Carte du monde](docs/screenshots/carte.png) | ![Niveau du Jardin des Plantes](docs/screenshots/niveau-jardin.png) |
| **2 · Château** : s'accroupir sous les flèches (ici sous la pluie) | **3 · Cathédrale** : grimper aux colonnes, s'accrocher aux rebords |
| ![Château sous la pluie](docs/screenshots/niveau-chateau-pluie.png) | ![Cathédrale](docs/screenshots/niveau-cathedrale.png) |
| **4 · Bouffay** : les étals bougent | **Sur téléphone, en paysage** |
| ![Bouffay](docs/screenshots/niveau-bouffay.png) | ![Contrôles tactiles](docs/screenshots/mobile-paysage.png) |

## Le concept
- **Une archive qui se reconstruit** : chaque niveau cache des pixels. Chacun ramassé révèle un morceau de la photo du lieu (48×32 cases, 16 couleurs), dans un ordre propre au lieu : le Jardin des Plantes pousse **du bas vers le haut**, comme une plante.
- **Une ligne verte à suivre** : sur la carte, le chemin s'allume en vert à chaque lieu terminé, et le monument passe du gris à la couleur.
- **Trois étoiles par niveau** : image complète, sans mourir, sous le temps cible.
- **La vraie météo de Nantes** (Open-Meteo, mise à jour toutes les 5 min) change l'environnement et les niveaux réagissent, avec une annonce à l'entrée de chaque niveau :

  | Météo à Nantes | Dans Green Path |
  |---|---|
  | Pluie, bruine, orage | pluie à l'écran, le sol glisse ; Jardin : des ronces poussent ; Cathédrale : les gargouilles coulent plus souvent |
  | Neige | flocons, on dérape (plus d'inertie) |
  | Vent fort | le vent pousse les sauts dans sa direction ; Château et Bouffay : les tonneaux roulent plus vite |
  | Brume | voile clair, les pixels ne se voient que de près |
  | Nuit | ciel étoilé, lanternes allumées, pixels visibles un peu moins loin |
  | Grand soleil | Jardin : des fleurs deviennent des plateformes (raccourcis) |

  Chaque effet est borné : on peut toujours contrer le vent, et chaque niveau reste finissable (vérifié par script sous pluie, vent et neige).
- **Ton avatar** : coiffure, yeux, peau, tenue, chaussures, ou un des 8 modèles.

## Les 12 lieux
L'ordre est une sélection pour le jeu : **ce n'est pas la numérotation officielle de la ligne verte du Voyage à Nantes.**

| # | Lieu | Statut |
|---|---|---|
| # | Lieu | Statut | Ce qu'on y apprend |
|---|---|---|---|
| 1 | Jardin des Plantes | ✅ jouable | courir, sauter, ronces, lanternes |
| 2 | Château des ducs de Bretagne | ✅ jouable | **s'accroupir** sous les flèches, tonneaux, herses, douves |
| 3 | Cathédrale Saint-Pierre-et-Saint-Paul | ✅ jouable | **grimper** aux colonnes, **s'accrocher** aux rebords, gargouilles, corniches qui s'effritent |
| 4 | Quartier du Bouffay | ✅ jouable | **étals qui bougent**, tout combiné |
| 5 | Île Feydeau | à venir | |
| 6 | Passage Pommeraye | à venir | |
| 7 | Place Graslin | à venir | |
| 8 | Mémorial de l'abolition de l'esclavage | à venir | |
| 9 | Machines de l'île | à venir | |
| 10 | Parc des Chantiers | à venir | |
| 11 | Anneaux de Buren | à venir | |
| 12 | Hangar à Bananes | à venir | |

## Commandes
| Carte | Niveau |
|---|---|
| ← → ou A D : lieu précédent / suivant | ← → ou Q/A D : courir |
| Entrée / Espace : fiche du lieu, JOUER | Espace, W ou Z : sauter (maintenir = plus haut) |
| Clic sur un piédestal : y aller | ↓ ou S : s'accroupir · ↑ : grimper, se hisser sur un rebord |
| H ou **COMMENT JOUER ?** : aide en 4 pages | Échap : pause (reprendre, aide, quitter) |
| Échap : menu · M : son | Téléphone : ← → ↓ et saut à l'écran (le saut sert aussi à grimper), PAUSE |

Ronces, pointes, flèches, gouttes, tonneaux ou chute = une mort : retour à la dernière lanterne allumée, les pixels ramassés sont gardés.

Sur téléphone, le jeu se joue **en paysage** : tenu en portrait, un écran demande de le tourner et le jeu se met en pause.

## Lancer en local
Aucun build, aucune dépendance : ouvrir `index.html` dans un navigateur (fonctionne en `file://`), ou servir le dossier :
```bash
python3 -m http.server 8123
```
puis http://localhost:8123. **Mode test** : ajouter `?dev=1` à l'adresse (W : météos simulées sur la carte, N dans un niveau ; K : ramasser tous les pixels).

## Fallback et limites connues
- **Hors ligne, le jeu reste entièrement jouable** : si le réseau coupe, le jeu garde **la dernière météo reçue** (widget « HORS LIGNE · IL Y A N MIN ») ; si aucune n'a jamais été reçue, météo neutre sans effet ([data/fallback.json](data/fallback.json)). La progression est gardée dans le navigateur (`localStorage`).
- La météo est redemandée toutes les 5 min, et dès que le réseau revient.
- Images à reconstruire : photo pixélisée validée pour le Jardin des Plantes ; pour les autres lieux, le monument de la planche de sprites en attendant des photos Commons validées.
- Niveaux 5 à 12 à venir.

## Stack
Phaser 3.90 (inclus en local), JavaScript natif en scripts classiques (pas de build, compatible `file://`), police Press Start 2P, résolution 480×270 agrandie sans lissage. Tout le décor vient de planches de sprites en texte (une lettre = une couleur d'une palette de 35) transformées en textures au démarrage. Déploiement statique sur Vercel.

```
index.html               page, icônes, écran « tournez votre téléphone »
js/config.js             réglages, palette, mode test (?dev=1)
js/data/                 locations.js (12 lieux), levels.js (niveaux), sprites/ (planches importées)
js/systems/              Sprites, MapArt (carte), LevelArt (ciel, décor), WeatherManager / WeatherFX / WeatherRules (météo en direct → règles de jeu),
                         PixelCollection (photo à reconstruire), Save / Progression / Stars, Ui (fenêtres, aide, tactile)
js/scenes/               Boot, Menu, Character (avatar), Map, Game (moteur de plateforme), Result
assets/                  police, logo et icônes, photos pixélisées (assets/locations/*.js)
tools/                   import-sprites.js, pixelize.swift, favicon.swift, compare-figma.js, bot.js (tests)
```

## Crédits et IA
- **Florine RACINE** — UX/UI Designer, Game Design · **Loan PLEURMEAU** — Développeur web, IA Ops (ESD Nantes, atelier PATRIMOINE.EXE).
- **Usage de l'IA** : le code a été écrit avec Claude Code (Anthropic) sous la direction de l'équipe, qui le relit et sait l'expliquer ; les planches de sprites de décor ont été générées avec Claude Design puis importées telles quelles ; le sprite de l'avatar vient du fichier Figma de l'équipe.
- Photo du Palmarium : Pymouss44, CC BY-SA 3.0, via Wikimedia Commons, recadrée et pixélisée. Données météo : Open-Meteo (CC BY 4.0). Police Press Start 2P (OFL). Phaser (MIT).
- Détails, licences et obligations : [CREDITS.md](CREDITS.md).
