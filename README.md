# Green Path — Nantes en mille pixels

> *« Psst… par ici ! Je suis le gardien de la ligne verte. Cette nuit, un grand coup de vent a soufflé sur Nantes. Ses monuments se sont envolés en mille pixels ! »*

Un jeu de plateforme pixel art qui suit la **ligne verte** de Nantes. De lieu en lieu, tu cours, tu sautes, tu grimpes et tu ramasses les pixels qui reconstruisent, case après case, chaque monument. **La vraie météo de Nantes change le jeu** : s'il pleut à Nantes, il pleut dans Green Path, le sol glisse et les ronces poussent.

**▶ Jouer : https://green-path-sepia.vercel.app** (ordinateur, ou téléphone tenu en paysage)

![Écran d'accueil](docs/screenshots/menu.png)

| La carte du monde | 1 · Jardin des Plantes |
|---|---|
| ![Carte du monde](docs/screenshots/carte.png) | ![Niveau du Jardin des Plantes](docs/screenshots/niveau-jardin.png) |
| **2 · Cathédrale** : grimper aux colonnes, s'accrocher aux rebords | **3 · Château** : du châtelet aux herses à la salle des gardes, en intérieur |
| ![Cathédrale](docs/screenshots/niveau-cathedrale.png) | ![Château, salle des herses](docs/screenshots/niveau-chateau.png) |
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
- **Un décor propre à chaque lieu** : le **Jardin des Plantes** est un vrai parc (rangées d'arbres, magnolias, massifs, hortensias, hautes herbes) où l'on croise des silhouettes colorées inspirées des sculptures de l'été au jardin ; le **Château** se traverse de la cour, avec ses tours de schiste et son logis blanc en tuffeau, jusqu'aux **salles intérieures** (châtelet aux herses, puis salle des gardes avec sa cheminée). Tout est dessiné par code, sans image externe.
- **Ton avatar** : coiffure, yeux, peau, tenue, chaussures, ou un des 8 modèles.

## Les 12 lieux
L'ordre suit la séquence de la page [« Arpenter la ligne verte »](https://www.levoyageanantes.fr/les-parcours/arpenter-la-ligne-verte/) du Voyage à Nantes pour les lieux qui y figurent (Jardin des Plantes, Cathédrale, Château, Machines, Chantiers, Buren, Mémorial, Pommeraye), complétée pour les autres. Cette page ne donne aucune numérotation : **l'ordre des 12 étapes est une sélection pour le jeu, ce n'est pas la numérotation officielle de la ligne verte.**

| # | Lieu | Statut | Ce qu'on y apprend |
|---|---|---|---|
| 1 | Jardin des Plantes | ✅ jouable | courir, sauter, ronces, lanternes |
| 2 | Cathédrale Saint-Pierre-et-Saint-Paul | ✅ jouable | **grimper** aux colonnes, **s'accrocher** aux rebords, gargouilles, corniches qui s'effritent |
| 3 | Château des ducs de Bretagne | ✅ jouable | **s'accroupir** sous les flèches, tonneaux, herses, douves |
| 4 | Île Feydeau | à venir | |
| 5 | Place Graslin | à venir | |
| 6 | Machines de l'île (Grand Éléphant) | à venir | |
| 7 | Parc des Chantiers (Grue Titan) | à venir | |
| 8 | Anneaux de Buren | à venir | |
| 9 | Hangar à Bananes | à venir | |
| 10 | Mémorial de l'abolition de l'esclavage | à venir | |
| 11 | Passage Pommeraye | à venir | |
| 12 | Tour LU (Lieu Unique) | à venir | |

*Un niveau « Bouffay » (étals mobiles) existe dans `js/data/levels.js` mais n'est rattaché à aucun lieu pour l'instant.*

## Commandes
| Carte | Niveau |
|---|---|
| ← → ou A D : lieu précédent / suivant | ← → ou Q/A D : courir |
| Entrée / Espace : fiche du lieu, JOUER | Espace, W ou Z : sauter (maintenir = plus haut) |
| Clic sur un piédestal : y aller | ↓ ou S : s'accroupir · ↑ : grimper, se hisser sur un rebord |
| H ou **COMMENT JOUER ?** : aide en 4 pages | Échap : pause (reprendre, aide, quitter) |
| Échap : menu · M : son | Téléphone : ← → ↓ et saut à l'écran (le saut sert aussi à grimper), PAUSE |
| **Manette** : croix ou stick, A valider | **Manette** : croix ou stick = bouger, A = sauter, ↓ = s'accroupir, ↑ = grimper, Start = pause |

Ronces, pointes, flèches, gouttes, tonneaux ou chute = une mort : retour à la dernière lanterne allumée, les pixels ramassés sont gardés.

Sur téléphone, le jeu se joue **en paysage** : tenu en portrait, un écran demande de le tourner et le jeu se met en pause.

## Options, langues, manette, plein écran
- **Langues** : français (source) et anglais. Bouton **FR/EN** en haut à droite de l'accueil (touche L), ou **OPTIONS → LANGUE**. Un navigateur non français démarre en anglais.
- **OPTIONS** : langue, son, plein écran, **touches réaffectables** (3 emplacements par action : gauche, droite, sauter, grimper, s'accroupir ; Échap, Entrée, H et M restent réservées), état de la manette, confidentialité, effacement de ses données.
- **Manette** (API Gamepad, aucune installation) : branche-la et appuie sur un bouton. Croix ou stick = bouger ; A = sauter / valider ; B = retour ; Start = pause. Elle pilote aussi les menus.
- **Téléphone, plein écran** : la zone de jeu s'élargit pour remplir tout l'écran (de 16:9 jusqu'à 21:9, sans bandes noires). Android et iPad : plein écran au premier toucher (ou OPTIONS → PLEIN ÉCRAN). **iPhone** : Safari n'a pas de plein écran ; touche Partager puis « Sur l'écran d'accueil » (le jeu est installable, `manifest.webmanifest`).
- **Pseudo, sauvegarde en ligne et classement** (facultatifs, **sans e-mail**) : après le premier niveau terminé, le jeu propose **créer un pseudo**, **retrouver une sauvegarde avec son code** ou **jouer en invité** (mode par défaut, tout reste sur l'appareil). Avec un pseudo, tu reçois un **code secret de 20 caractères** (à noter : seul moyen de retrouver ta sauvegarde sur un autre appareil) ; ta progression et ton avatar sont enregistrés après chaque niveau, et le **CLASSEMENT** (menu) affiche pseudo, étoiles et temps. Gestion dans **OPTIONS → COMPTE** (synchroniser, se déconnecter, supprimer son compte). Hors ligne ou serveur indisponible : le jeu continue, le classement affiche la dernière version vue. Détails techniques : [supabase/README.md](supabase/README.md).
- **Confidentialité (RGPD)** : aucune donnée personnelle sans pseudo ; avec pseudo, seulement pseudo, avatar, progression et haché du code, avec accord explicite, serveurs dans l'UE (Paris). Page dans le jeu (CRÉDITS ou OPTIONS) et détail dans [docs/confidentialite.md](docs/confidentialite.md).

![Options](docs/screenshots/options.png)

## Lancer en local
Aucun build, aucune dépendance : ouvrir `index.html` dans un navigateur (fonctionne en `file://`), ou servir le dossier :
```bash
python3 -m http.server 8123
```
puis http://localhost:8123. **Mode test** : ajouter `?dev=1` à l'adresse (W : météos simulées sur la carte, N dans un niveau ; K : ramasser tous les pixels).

## Fallback et limites connues
- **Hors ligne, le jeu reste entièrement jouable** (météo, sauvegarde locale ; le classement affiche la dernière version vue ; la sauvegarde en ligne repart au retour du réseau) : si le réseau coupe, le jeu garde **la dernière météo reçue** (widget « HORS LIGNE · IL Y A N MIN ») ; si aucune n'a jamais été reçue, météo neutre sans effet ([data/fallback.json](data/fallback.json)). La progression est gardée dans le navigateur (`localStorage`).
- La météo est redemandée toutes les 5 min, et dès que le réseau revient.
- Images à reconstruire : **9 photos Wikimedia Commons** pixélisées (48×32, 16 couleurs, validées une à une : Jardin des Plantes, Cathédrale, Château, Île Feydeau, Graslin, Chantiers, Hangar à Bananes, Pommeraye, Tour LU ; crédits dans [CREDITS.md](CREDITS.md)). Les 3 lieux dont le sujet est une œuvre d'artiste protégée (Machines de l'île, Anneaux de Buren, Mémorial) gardent le monument dessiné par code, sans photo.
- Niveaux 5 à 12 à venir.

## Stack
Phaser 3.90 (inclus en local), JavaScript natif en scripts classiques (pas de build, compatible `file://`), police Press Start 2P, résolution 480×270 agrandie sans lissage. Le décor vient de planches de sprites en texte (une lettre = une couleur d'une palette de 35) transformées en textures au démarrage ; les fonds du Jardin et du Château, les silhouettes, les plantes et les salles intérieures sont dessinés par code (`GP.PixelArt`, `js/systems/LevelArt.js`). Déploiement statique sur Vercel.

```
index.html               page, icônes, écran « tournez votre téléphone »
js/config.js             réglages, palette, mode test (?dev=1)
js/data/                 locations.js (12 lieux), levels.js (niveaux), sprites/ (planches importées), lang/ (fr.js, en.js)
js/systems/              I18n (FR/EN), Settings (langue, touches), Controls (clavier réaffectable, manette), Cloud + Account (pseudo, sauvegarde, classement Supabase), Sprites, MapArt (carte), LevelArt (ciel, décors, fonds de parc et de château, salles intérieures), WeatherManager / WeatherFX / WeatherRules (météo en direct → règles de jeu),
                         PixelCollection (photo à reconstruire), Save / Progression / Stars, Ui (fenêtres, aide, tactile)
js/scenes/               Boot, Menu, Character (avatar), Options, Score (classement), Map, Game (moteur de plateforme), Result
assets/                  police, logo et icônes, photos pixélisées (assets/locations/*.js)
supabase/                schema.sql et README (base du pseudo, de la sauvegarde et du classement)
tools/                   import-sprites.js, pixelize.swift, favicon.swift, compare-figma.js, bot.js (tests)
```

## Crédits et IA
- **Florine RACINE** — UX/UI Designer, Game Design · **Loan PLEURMEAU** — Développeur web, IA Ops (ESD Nantes, atelier PATRIMOINE.EXE).
- **Usage de l'IA** : le code a été écrit avec Claude Code (Anthropic) sous la direction de l'équipe, qui le relit et sait l'expliquer (des *skills* Phaser, lus avant installation, servent de référence pour éviter les bugs 2D courants) ; les planches de sprites de décor ont été générées avec Claude Design puis importées telles quelles ; le sprite de l'avatar vient du fichier Figma de l'équipe.
- Photo du Palmarium : Pymouss44, CC BY-SA 3.0, via Wikimedia Commons, recadrée et pixélisée. Données météo : Open-Meteo (CC BY 4.0). Police Press Start 2P (OFL). Phaser (MIT).
- Silhouettes du Jardin : dessins originaux de l'équipe, **inspirés** des sculptures colorées de l'été au Jardin des Plantes (personnages de Jean Jullien, oiseau en topiaire) ; aucune photo ni image des œuvres n'est reprise.
- Détails, licences et obligations : [CREDITS.md](CREDITS.md).
