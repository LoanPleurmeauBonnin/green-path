# Green Path — Nantes en mille pixels

Jeu de plateforme pixel art qui suit la **ligne verte** de Nantes : de lieu en lieu, on court, on saute et on ramasse des pixels qui reconstruisent, case après case, chaque monument. **La vraie météo de Nantes change le jeu.**
Projet noté ESD Nantes (B3), atelier PATRIMOINE.EXE / NANTES 001 — Florine RACINE (UX/UI, game design) et Loan PLEURMEAU (développement web, IA Ops).

**▶ Jouer : https://green-path-game.vercel.app** (ordinateur, ou téléphone tenu en paysage) · Dépôt : https://github.com/LoanPleurmeauBonnin/green-path
Version **0.6** — gel fonctionnel le jeudi 12 novembre 2026, midi. Les douze niveaux sont jouables ; aucun playtest humain n'est revendiqué au-delà de ce qui figure dans le [carnet de bord](docs/carnet-de-bord.md).

> *« Psst… par ici ! Je suis le gardien de la ligne verte. Cette nuit, un grand coup de vent a soufflé sur Nantes. Ses monuments se sont envolés en mille pixels ! »*

![Écran d'accueil](docs/screenshots/menu.png)

| La carte du monde | 1 · Jardin des Plantes |
|---|---|
| ![Carte du monde](docs/screenshots/carte.png) | ![Niveau du Jardin des Plantes](docs/screenshots/niveau-jardin.png) |
| **3 · Château** sous la pluie | **2 · Cathédrale** |
| ![Château sous la pluie](docs/screenshots/niveau-chateau-pluie.png) | ![Cathédrale](docs/screenshots/niveau-cathedrale.png) |

## Livrables PATRIMOINE.EXE
| Livrable | Où |
|---|---|
| Webapp (principal) | https://green-path-game.vercel.app |
| Fiche-source patrimoniale | [docs/fiche-source.md](docs/fiche-source.md) |
| Grammaire extraite et 3 paramètres opératoires | [docs/grammaire.md](docs/grammaire.md), [HERITAGE_GRAMMAR.md](HERITAGE_GRAMMAR.md) |
| Problématique et direction créative | [docs/problematique-direction.md](docs/problematique-direction.md) |
| Sketch minimal p5.js | [sketch/](sketch/) |
| Architecture du code | section « Architecture du code » ci-dessous |
| Mapping data / API | section « Source, grammaire et mapping » |
| Fallback local (hors ligne) | section « Fallback et limites connues » |
| Test croisé silencieux | [docs/test-croise.md](docs/test-croise.md) |
| Manifest, cartel | [manifest.json](manifest.json), [CARTEL.md](CARTEL.md) |
| Droits, crédits, sources | [CREDITS.md](CREDITS.md), [docs/sources.md](docs/sources.md), [docs/images-candidates.md](docs/images-candidates.md) |
| Carnet de bord (décisions, itérations) | [docs/carnet-de-bord.md](docs/carnet-de-bord.md) |

## Le concept
- **Une archive qui se reconstruit** : chaque niveau cache des pixels. Chacun ramassé révèle un morceau de l'image du lieu (48×32 cases, 16 couleurs), dans un ordre propre au lieu : le Jardin des Plantes pousse **du bas vers le haut**, comme une plante ; le Château se bâtit assise, centre, puis côtés.
- **Une ligne verte à suivre** : sur la carte, le chemin s'allume en vert à chaque lieu terminé, et le monument passe du gris à la couleur.
- **Des rencontres** : une fois un niveau terminé, un petit personnage se tient sur le chemin près du monument. Quand le héros passe devant, une bulle raconte une anecdote « Savais-tu que… » (sources dans [docs/sources.md](docs/sources.md)). Au Mémorial, un simple panneau.
- **Trois étoiles par niveau** : image complète, sans mourir, sous le temps cible.
- **La carte postale de fin** : une fois les 12 lieux terminés, une carte postale PNG de Nantes reconstruite (monuments, avatar, ciel et météo du moment).
- **Ton avatar** : coiffure, yeux, peau, tenue, chaussures, ou l'un des 8 modèles.
- **Pseudo, sauvegarde et classement** (facultatifs, sans e-mail) : voir [docs/confidentialite.md](docs/confidentialite.md). Le jeu fonctionne sans compte et hors ligne.
- **Admin** : un compte admin (bouton compte de l'accueil) débloque l'éditeur de niveaux et de textures (`editor.html`) et la **météo de test en niveau** (ligne MÉTÉO du menu pause, ou touche N ; touche W sur la carte).

## Les 12 lieux
L'ordre suit la séquence de la page [« Arpenter la ligne verte »](https://www.levoyageanantes.fr/les-parcours/arpenter-la-ligne-verte/) du Voyage à Nantes pour les lieux qui y figurent, complétée pour les autres. **L'ordre des 12 étapes est une sélection pour le jeu : ce n'est pas la numérotation officielle du Voyage à Nantes.**

| # | Lieu | Ce qu'on y apprend |
|---|---|---|
| 1 | Jardin des Plantes | allées, bassins, jets et topiaires |
| 2 | Cathédrale Saint-Pierre-et-Saint-Paul | colonnes, accroche, nef couverte, galeries |
| 3 | Château des ducs de Bretagne | s'accroupir sous les flèches, tonneaux, herses, douves |
| 4 | Île Feydeau | balcons inclinés et bateaux flotteurs |
| 5 | Place Graslin | parasols rebondissants et lustres |
| 6 | Machines de l'île (Grand Éléphant) | engrenages, vapeur, boss à valves |
| 7 | Parc des Chantiers (Grue Titan) | chariots au poids, ascenseur |
| 8 | Anneaux de Buren | impulsions et chaînes d'anneaux |
| 9 | Hangar à Bananes | conteneurs, portes basses, boss à lampes UV |
| 10 | Passage Pommeraye | trois strates, dalles fragiles |
| 11 | Mémorial de l'abolition de l'esclavage | séquences de dalles, eau lente |
| 12 | Tour LU (Lieu Unique) | courants ascendants, boss à quatre lanternes |

Chaque niveau a un temps limité (3 min par défaut, plus pour les niveaux longs).

## Commandes
| Carte | Niveau |
|---|---|
| ← → ou A D : lieu précédent / suivant | ← → ou Q/A D : courir |
| Entrée / Espace : fiche du lieu, JOUER | Espace, W ou Z : sauter (maintenir = plus haut) |
| Clic sur un piédestal : y aller | ↓ ou S : s'accroupir · ↑ : grimper, se hisser |
| H : aide en 4 pages | Échap : pause (reprendre, point de contrôle, rejouer, aide, quitter) |
| Échap : menu · M : son | Téléphone : ← → ↓ et saut à l'écran, bouton PAUSE |
| Manette : croix ou stick, A valider | Manette : stick = bouger, A = sauter, Start = pause |

Ronces, pointes, flèches, gouttes, tonneaux ou chute = une mort : retour à la dernière lanterne allumée, pixels conservés. Le niveau en cours est sauvegardé (reprise après fermeture).

## Options, langues, accessibilité
- **Français et anglais** (FR/EN en haut à droite de l'accueil, touche L). Un navigateur non français démarre en anglais.
- **Options** : langue, son, plein écran, animations (Auto suit le système, Activées ou Réduites), touches réaffectables, manette, confidentialité, effacement des données.
- **Accessibilité** : pas de flash, `prefers-reduced-motion` respecté, clavier + tactile + manette, jouable sans son, réinitialisation possible. Le canvas n'est pas lisible par les lecteurs d'écran.
- **À propos** : Crédits, Confidentialité, Sources et licences.

## Lancer en local
Aucun gestionnaire de paquets ni build. Phaser 3.90 et la police sont inclus. Ouvrir `index.html` directement (scripts classiques, compatible `file://`) ou servir le dossier :
```bash
python3 -m http.server 8123
```
puis http://localhost:8123. **Mode test** : ajouter `?dev=1` (tous les niveaux ouverts ; W météo simulée sur la carte, N en niveau, K ramasse tous les pixels ; `?dev=1&level=chateau` lance un niveau, sur localhost seulement).

Publication : `node tools/bump-sw.cjs` (change le nom du cache hors ligne) puis `npx vercel --prod`.

## Source, grammaire et mapping
Le **Château des ducs de Bretagne** est la source patrimoniale principale, les onze autres lieux un corpus de variations. Masse → murs, seuil → herse, élévation → tours ; reconstruction assise → centre → côtés. Ce masque stylisé n'est pas un relevé architectural. Chaîne : SOURCE → OBSERVATION → GRAMMAIRE → ALGORITHME → DATA / INTERACTION → ŒUVRE.

**Mapping data → jeu** (Open-Meteo, Nantes, toutes les 5 min, délai 4 s) — au moins trois paramètres ont un effet réel :

| Donnée | Effet dans Green Path |
|---|---|
| Précipitations (pluie, bruine, orage, neige) | sol exposé plus glissant, inertie accrue, mécanismes qui réagissent ; masqué sous les couvertures |
| Vent (vitesse, direction) | poussée des sauts dans la direction du vent ; tonneaux plus rapides |
| Brume, couverture nuageuse | voile clair, pixels visibles de près seulement |
| Jour / nuit | ciel étoilé, lanternes allumées, pixels visibles moins loin |
| Température | affichée seulement, ne teinte pas le jeu |

Abris : passages du Château, nef de la Cathédrale, verrière de Pommeraye, galerie du Mémorial, atelier et hangar protègent de la pluie, de la neige et du vent. Valeurs, limites, références et droits : [HERITAGE_GRAMMAR.md](HERITAGE_GRAMMAR.md) et [docs/grammaire.md](docs/grammaire.md).

## Fallback et limites connues
- **Hors ligne** : le dossier lancé avec un serveur local ne dépend pas d'Internet. Sur le site hébergé, une première visite complète prépare une copie locale (`sw.js`) qui permet de recharger sans réseau. Un site jamais visité ne se charge pas sans réseau.
- **Météo** : si l'API coupe, le jeu garde la dernière météo reçue (widget « HORS LIGNE ») ; sinon météo neutre sans effet ([data/fallback.json](data/fallback.json)). Réponses incomplètes ou non numériques rejetées. Le mode test indique « TEST · SIMULATION ».
- **Compte** : tout appel réseau passe par `GP.Cloud` (délai 4 s, échec silencieux) ; le mode invité est local.
- **Carte postale** : se télécharge sans Internet, sans mention de la météo.
- **Difficulté** : réglée sur les données (contrôle de faisabilité du joueur simulé), jamais validée par des joueurs.
- **Droits** : la provenance de la référence de l'avatar reste à clarifier avant diffusion large ; les notices secondaires demandent une vérification documentaire.
- **Tactile** : pensé pour le paysage ; pas testé sur un vrai iOS/Android ; l'éditeur est conçu pour ordinateur.

## Architecture du code
Scripts classiques sans modules ni build, tout dans l'espace de noms global `GP` ; l'ordre des `<script>` de `index.html` compte, les scènes sont listées dans `js/main.js`. Résolution 270 px de haut, agrandie sans lissage.
```
index.html, editor.html  pages (jeu, éditeur admin)
sw.js, manifest*.json    copie hors ligne, installation, manifeste du projet
css/                     styles de la page (chargement, compte)
js/config.js             réglages, palette, mode test (?dev=1)
js/data/                 locations.js (12 lieux), levels*.js / gzones.js / Redesigns.js (niveaux), sprites/ (planches), lang/ (fr.js, en.js)
js/systems/              météo (WeatherManager / FX / Rules / Shelters), Cloud + Account (Supabase), Controls, I18n, Sprites, MapArt,
                         LevelArt, Solvability, Progression / Save, Ui, CharacterSprite, Postcard…
js/scenes/               Boot, Menu, Character, Options, About, Score, Map, Game, Result, Postcard
js/editor/               éditeur de niveaux et de textures (admin)
assets/                  police, logo, images pixélisées des lieux
supabase/                schema.sql et migrations (pseudo, sauvegarde, classement, éditeur)
sketch/                  sketch p5.js (livrable J1)
```

## Contributions
**Florine RACINE** — UX/UI Designer, Game Design · **Loan PLEURMEAU** — Développeur web, IA Ops (ESD Nantes, atelier PATRIMOINE.EXE).

## AI usage
Le code a été assisté par Claude Code sous la direction de l'équipe ; les planches de décor ont été générées avec Claude Design ; l'avatar provient du fichier Figma fourni. Une partie de l'audit initial, des correctifs, des tests et de la documentation a été réalisée avec GPT-6.1 Sol via OpenCode. L'équipe relit, comprend et doit pouvoir défendre le code livré ; aucune contribution individuelle ni observation d'utilisateur n'a été inventée.

## Sources et droits
Photo du Palmarium : Pymouss44, CC BY-SA 3.0, via Wikimedia Commons, recadrée et pixélisée. Données météo : Open-Meteo (CC BY 4.0). Police Press Start 2P (OFL). Phaser (MIT). Détails, licences et obligations : [CREDITS.md](CREDITS.md).
