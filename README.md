# Green Path — Nantes en mille pixels

**État vérifié : 3 étapes jouables sur 12** (Jardin, Cathédrale, Château). Un prototype Bouffay existe hors parcours ; les neuf autres niveaux et la récompense finale restent à développer. Audit local du 10 novembre 2026 : [AUDIT.md](AUDIT.md), [GAME_DESIGN.md](GAME_DESIGN.md), [HERITAGE_GRAMMAR.md](HERITAGE_GRAMMAR.md), [ROADMAP.md](ROADMAP.md).

**Finition UX/UI et corrections** : commandes adaptatives, remapping, carte réversible avec montée sur les piédestaux, terminaisons ciblées, trois rubriques À propos, Options aéré, fiche et transition centrées. Détail : [docs/UX_POLISH.md](docs/UX_POLISH.md). **Météo abritée livrée localement** : [docs/WEATHER_SHELTERS.md](docs/WEATHER_SHELTERS.md). Protocole silencieux, relevé volontaire et configuration d'équilibrage : [docs/PLAYTEST_REPORT.md](docs/PLAYTEST_REPORT.md) ; aucun playtest humain revendiqué. Les autres évolutions de [docs/GAMEPLAY_UPGRADES.md](docs/GAMEPLAY_UPGRADES.md) restent des propositions.

> *« Psst… par ici ! Je suis le gardien de la ligne verte. Cette nuit, un grand coup de vent a soufflé sur Nantes. Ses monuments se sont envolés en mille pixels ! »*

Un jeu de plateforme pixel art qui suit la **ligne verte** de Nantes. De lieu en lieu, tu cours, tu sautes, tu grimpes et tu ramasses les pixels qui reconstruisent, case après case, chaque monument. **La vraie météo de Nantes change le jeu** : s'il pleut à Nantes, il pleut dans Green Path, le sol glisse et les ronces poussent.

**▶ Jouer : https://green-path-game.vercel.app** (ordinateur, ou téléphone tenu en paysage)

![Écran d'accueil](docs/screenshots/menu.png)

| La carte du monde | 1 · Jardin des Plantes |
|---|---|
| ![Carte du monde](docs/screenshots/carte.png) | ![Niveau du Jardin des Plantes](docs/screenshots/niveau-jardin.png) |
| **3 · Château** : s'accroupir sous les flèches (ici sous la pluie) | **2 · Cathédrale** : grimper aux colonnes, s'accrocher aux rebords |
| ![Château sous la pluie](docs/screenshots/niveau-chateau-pluie.png) | ![Cathédrale](docs/screenshots/niveau-cathedrale.png) |
| **Prototype Bouffay (hors parcours)** : les étals bougent | **Sur téléphone, en paysage** |
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

  Chaque effet est borné et le vent reste contrable. Les 80 fragments des trois niveaux sont géométriquement atteignables sous pluie, vent et neige dans les tests automatisés ; ces essais neutralisent les dangers et ne prouvent pas à eux seuls une traversée complète par un humain.
- **Abris existants** : les deux passages couverts du Château bloquent pluie/neige et divisent la poussée du vent par deux ; les deux auvents de tram au Jardin protègent partiellement. Transition physique progressive et masque spatial des précipitations ; aucune structure ajoutée à la Cathédrale.
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

**Reprise locale** : les fragments d'un niveau en cours et la dernière lanterne sont maintenant sauvegardés. Après fermeture ou rafraîchissement, le niveau reprend à ce point sûr, image partiellement reconstruite, temps et morts conservés. Une partie terminée se rejoue depuis le début. Les reprises intra-niveau restent sur cet appareil, contrairement aux résultats terminés qui peuvent être synchronisés avec un compte facultatif.

Sur téléphone, le jeu se joue **en paysage** : tenu en portrait, un écran demande de le tourner et le jeu se met en pause.

## Options, langues, manette, plein écran
- **Langues** : français (source) et anglais. Bouton **FR/EN** en haut à droite de l'accueil (touche L), ou **OPTIONS → LANGUE**. Un navigateur non français démarre en anglais.
- **OPTIONS** : langue, son, plein écran, **touches réaffectables** (3 emplacements par action : gauche, droite, sauter, grimper, s'accroupir ; Échap, Entrée, H et M restent réservées), état de la manette, confidentialité, effacement de ses données.
- **Deux groupes Options** : JEU ET COMMANDES / DONNÉES ET AIDE, clic ou Tab (LB/RB à la manette). **À propos** propose trois rubriques distinctes : Crédits, Confidentialité, Sources et licences, avec pages de lecture et retour à l'écran d'origine.
- **Manette** (API Gamepad, aucune installation) : branche-la et appuie sur un bouton. Croix ou stick = bouger ; A = sauter / valider ; B = retour ; Start = pause. Elle pilote aussi les menus.
- **Dernier périphérique utilisé** : une vraie touche ou un clic réaffiche le clavier ; une nouvelle pression manette ou un stick engagé réaffiche ses boutons, sans fermer l'écran ouvert. Connexion seule et dérive du stick ne basculent pas l'interface. Y = aide, LB/RB = pages ; X = son sur la carte/en jeu, aperçu dans l'avatar, rejouer au résultat. Les libellés Sony sont adaptés si le modèle est reconnu. Le livre affiche les touches de jeu réellement configurées ; les menus gardent leur navigation propre.
- **OPTIONS → COMMANDES** : vue clavier avec les 3 emplacements configurables ou vue manette des correspondances fixes. Les dialogues de compte se parcourent à la manette (invité compris) ; taper pseudo/code requiert toujours un clavier ou le clavier système.
- **Carte** : gauche/droite inverse le trajet dès la frame suivante, même entre deux étapes. Un clic peut changer la destination sans saut de position.
- **Téléphone, plein écran** : la zone de jeu s'élargit pour remplir tout l'écran (de 16:9 jusqu'à 21:9, sans bandes noires). Android et iPad : plein écran au premier toucher (ou OPTIONS → PLEIN ÉCRAN). **iPhone** : Safari n'a pas de plein écran ; touche Partager puis « Sur l'écran d'accueil » (le jeu est installable, `manifest.webmanifest`).
- **Pseudo, sauvegarde en ligne et classement** (facultatifs, **sans e-mail**) : après le premier niveau terminé, le jeu propose **créer un pseudo**, **retrouver une sauvegarde avec son code** ou **jouer en invité** (mode par défaut, tout reste sur l'appareil). Avec un pseudo, tu reçois un **code secret de 20 caractères** (à noter : seul moyen de retrouver ta sauvegarde sur un autre appareil) ; ta progression et ton avatar sont enregistrés après chaque niveau, et le **CLASSEMENT** (menu) affiche pseudo, étoiles et temps. Gestion dans **OPTIONS → COMPTE** (synchroniser, se déconnecter, supprimer son compte). Hors ligne ou serveur indisponible : le jeu continue, le classement affiche la dernière version vue. Détails techniques : [supabase/README.md](supabase/README.md).
- **Confidentialité (RGPD)** : aucune donnée personnelle sans pseudo ; avec pseudo, seulement pseudo, avatar, progression et haché du code, avec accord explicite, serveurs dans l'UE (Paris). Page dans le jeu (CRÉDITS ou OPTIONS) et détail dans [docs/confidentialite.md](docs/confidentialite.md).

![Options](docs/screenshots/options.png)

## Lancer en local
Aucun gestionnaire de paquets ni build à installer. Phaser 3.90 et la police sont déjà inclus. Ouvrir `index.html` directement (compatibilité `file://` prévue par les scripts classiques ; non retestée lors de cet audit), ou, de préférence, servir le dossier avec Python 3 :
```bash
python3 -m http.server 8123
```
puis http://localhost:8123. **Mode test** : ajouter `?dev=1` à l'adresse (W : météos simulées sur la carte, N dans un niveau ; K : ramasser tous les pixels).

## Fallback et limites connues
- **Hors ligne** : le dossier complet lancé avec un serveur local ne dépend pas d'Internet. Sur le site hébergé en HTTPS, une **première visite complète** prépare une copie locale (service worker, `sw.js`) qui permet ensuite le rechargement sans réseau. Il est impossible de charger un site jamais visité sans réseau. Le cache ne contient que les fichiers publics, jamais les échanges météo/compte. Attendre la fin de l'installation avant de passer en mode avion ; vérifier avec `await GP.offlineReady` dans la console. `?dev=1` ne lance pas cette installation.
- Si l'API coupe, le jeu garde **la dernière météo reçue** (widget « HORS LIGNE ») ; sinon météo **NEUTRE** sans effet ([data/fallback.json](data/fallback.json), copie documentaire des valeurs JS, non chargée par le moteur). Le widget affiche deux lignes ; le mode test indique « TEST · SIMULATION ». Les réponses incomplètes ou non numériques sont rejetées. Progression dans `localStorage`, ou en mémoire jusqu'à fermeture si le stockage est bloqué.
- La météo est redemandée toutes les 5 min, et dès que le réseau revient.
- Images à reconstruire : photo pixélisée validée pour le Jardin des Plantes ; pour les autres lieux, le monument de la planche de sprites en attendant des photos Commons validées.
- Niveaux **4 à 12** à venir ; Bouffay détaché. Aucun boss ni illustration finale livré.
- La provenance/licence de la référence de l'avatar reste à clarifier avant diffusion large. Les notices secondaires demandent encore une vérification documentaire.
- Le mode tactile est conçu pour le paysage ; le canvas n'est pas entièrement accessible aux lecteurs d'écran. Les tests de fenêtre responsive ne remplacent pas un vrai essai iOS/Android.

## Source, grammaire et mapping
Le **Château des ducs de Bretagne** est la source patrimoniale principale, les onze autres lieux un corpus de variations. Masse → murs, seuil → herse, élévation → tours ; reconstruction géométrique assise → centre → côtés. Ce masque stylisé ne constitue pas un relevé architectural. Les fiches des trois lieux expliquent désormais la relation **SOURCE → RÈGLE** (clavier ou boutons de pagination).

Au moins trois paramètres ont un effet réel : collecte → groupes de cellules révélés ; pluie/neige → accélération et réactions locales ; vent normalisé → poussée aérienne ; brume/nuit → visibilité. Valeurs, limites, références et droits : [HERITAGE_GRAMMAR.md](HERITAGE_GRAMMAR.md). La température est affichée, pas utilisée pour teinter le jeu.

## Tester
Node.js 18+ pour les tests seulement (aucune installation npm) :
```bash
node --test tests/*.test.js
node tools/compare-figma.js
```
Tests Phaser reproductibles et procédures offline/responsive : [tests/README.md](tests/README.md). Il n'existe pas de commande de build : le livrable est le dossier statique. Aucun déploiement ni changement de base distant n'a été exécuté pendant l'audit. Pour Vercel : conserver `vercel.json`, publier uniquement avec l'accord de l'équipe ; augmenter la version de cache de `sw.js` lors d'une nouvelle livraison de fichiers. Un ancien onglet doit être fermé pour laisser la nouvelle copie s'activer.

Dernière recette locale : 39 tests Node ; par format 1920×1080, 1366×768 et 844×390, 73 contrôles de régression + 97 de polish + 24 du socle, tous réussis. Neuf diagnostics géométriques réussis. Les simulations DOM/Gamepad et fenêtres CSS ne remplacent ni un test humain ni un appareil réel. `js/data/tuning.js` centralise les valeurs existantes sans changer arbitrairement la difficulté.

## Stack
Phaser 3.90 (inclus en local), JavaScript natif en scripts classiques (pas de build, compatible `file://`), police Press Start 2P, résolution 480×270 agrandie sans lissage. Tout le décor vient de planches de sprites en texte (une lettre = une couleur d'une palette de 35) transformées en textures au démarrage. Déploiement statique sur Vercel.

```
index.html               page, icônes, écran « tournez votre téléphone »
js/config.js             réglages, palette, mode test (?dev=1)
js/data/                 locations.js (12 lieux), levels.js (niveaux), sprites/ (planches importées), lang/ (fr.js, en.js)
js/systems/              I18n (FR/EN), Settings (langue, touches), Controls (entrées), Prompts (périphérique et commandes affichées), MapTravel (trajet réversible), Cloud + Account (pseudo, sauvegarde, classement Supabase), Sprites, MapArt (carte), LevelArt (ciel, décor), WeatherManager / WeatherFX / WeatherRules (météo en direct → règles de jeu),
                         PixelCollection (photo à reconstruire), Save / Progression / Stars, Ui (fenêtres, aide, tactile)
js/scenes/               Boot, Menu, Character (avatar), Options, Score (classement), Map, Game (moteur de plateforme), Result
assets/                  police, logo et icônes, photos pixélisées (assets/locations/*.js)
supabase/                schema.sql et README (base du pseudo, de la sauvegarde et du classement)
tools/                   import-sprites.js, pixelize.swift, favicon.swift, compare-figma.js, bot.js (tests)
```

## Contributions
- **Florine RACINE** — UX/UI Designer, Game Design · **Loan PLEURMEAU** — Développeur web, IA Ops (ESD Nantes, atelier PATRIMOINE.EXE).

## AI usage
Le code initial a été assisté par Claude Code sous la direction de l'équipe ; les planches de décor ont été générées avec Claude Design, l'avatar provient du fichier Figma fourni.
GPT-6.1 Sol via OpenCode a réalisé l'audit puis le polish UX/UI, écrit les correctifs, les tests et la documentation ; les skills Phaser ont servi de référence sans migration vers Phaser 4.
Les vérifications réellement exécutées et leurs limites figurent dans `AUDIT.md` ; aucune contribution individuelle ni observation d'utilisateur n'a été inventée.
L'équipe doit relire, comprendre et pouvoir défendre le code livré ; les informations historiques et les droits restant incertains sont explicitement signalés.

## Sources et droits
- Photo du Palmarium : Pymouss44, CC BY-SA 3.0, via Wikimedia Commons, recadrée et pixélisée. Données météo : Open-Meteo (CC BY 4.0). Police Press Start 2P (OFL). Phaser (MIT).
- Détails, licences et obligations : [CREDITS.md](CREDITS.md).

![Médiation de la grammaire du Château, dans un cadre de test 1920×1080](docs/screenshots/audit-grammaire.png)
