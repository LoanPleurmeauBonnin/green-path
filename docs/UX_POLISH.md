# Green Path — finition UX/UI et contrôles adaptatifs

Interventions du 10 novembre 2026 sur `fix/audit-green-path`, **à partir de l'audit non commité existant, conservé**. Aucun commit, push, déploiement, migration ni changement du format de progression. Phaser 3.90 conservé. Les sections 1–6 décrivent la première passe ; **la section 7 la complète et remplace les anciennes positions/limites corrigées**. Seuls le protocole/relevé silencieux et la météo abritée ont ensuite été autorisés ; les autres propositions de [GAMEPLAY_UPGRADES.md](GAMEPLAY_UPGRADES.md) ne sont pas implémentées automatiquement.

## 1. Contrôles : une source de vérité

`js/systems/Prompts.js` possède le périphérique actif, le profil de libellés, les actions affichées, les boutons standard et les modèles de texte. `Controls.js` utilise **les mêmes indices de boutons** pour les actions réelles. Les scènes demandent un modèle (`{jump}`, `{confirm}`, `{pause}`…), sans maintenir leurs propres conditions clavier/manette.

- Les actions de jeu lisent les touches réaffectées de `Settings`. Le livre et les tutoriels affichent la première touche valide de chaque action ; les trois emplacements complets restent consultables et modifiables dans Options.
- Navigation de menu et actions de jeu sont distinctes : remapper le saut ne remappe pas Entrée pour les menus.
- Les modèles sont traduits **avant** substitution des touches. Les libellés de touches sont également traduits.
- `bind`/`watch` mettent à jour les objets déjà affichés, sans relancer la scène ni refermer le livre ; désabonnement à la destruction de l'objet ou de la scène.
- L'état clavier/manette n'est pas persisté dans la sauvegarde. Aucun champ de progression ajouté par cette passe.

### Détection d'une intention réelle

| Événement | Résultat |
|---|---|
| Connexion seule d'une manette | aucun changement d'indications |
| Stick au repos ou dérive sous 0,65 | aucune activation de direction ni bascule |
| Direction dépassant 0,65 | intention ; activation et indications manette |
| Stick déjà engagé entre 0,35 et 0,65 | hystérésis : direction conservée sans oscillation de détection |
| Retour sous 0,35 | relâchement ; nouvel engagement nécessaire |
| Nouveau bouton pressé | bascule manette ; pas les répétitions d'un bouton tenu |
| Nouvelle touche clavier | bascule clavier ; répétition d'une ancienne touche ignorée pour le choix du périphérique |
| Stick tenu après reprise au clavier | ne reprend pas les indications ni le déplacement ; les répétitions manette ne volent pas la navigation |
| Clic de souris | retour aux indications clavier ; pas de bascule sur simple survol |
| Toucher | indications tactiles ; commandes à l'écran conservées |
| Déconnexion de la manette active | repli clavier |

Libellés standard A/B/X/Y et variantes textuelles Sony si l'identifiant les reconnaît (CROIX/ROND/CARRÉ/TRIANGLE, OPTIONS, L1/R1). Ce n'est pas une certification de tous les modèles : un contrôleur non standard peut exiger une adaptation après test réel. Les directions restent des symboles ; les boutons du livre utilisent des pastilles/contours distincts des touches clavier.

### Inventaire synchronisé

| Écran / élément | Source et comportement |
|---|---|
| Menu / introduction | choisir, valider, retour ; texte d'introduction paginé sans suppression |
| Créateur d'avatar | navigation, validation, aperçu animé et retour sur deux lignes ; X déclenche effectivement l'aperçu |
| Options | COMMANDES reflète le périphérique actif ; vue manette en lecture seule, vue clavier conserve les 3 emplacements de remapping |
| Capture d'une nouvelle touche | validation initiale non recapturée ; saisie explicitement clavier ; B permet d'annuler la capture |
| Carte | indications persistantes de navigation, fiche, aide ; A valide, Y ouvre le livre, LB/RB feuillettent |
| Fiche du lieu | bouton JOUER/REJOUER avec la commande de validation courante |
| Livre / Comment jouer | pages de commandes actualisées à chaud ; objectifs et météo inchangés ; page courante conservée |
| Tutoriels du niveau | modèles d'action dans `levels.js`, y compris maintien du saut et escalade ; bulles bornées au viewport |
| HUD / pause | bouton pause et instruction de reprise ; Start pause, B ferme/reprend, A valide l'option sélectionnée |
| Résultat | A = carte, X = rejouer ; retour immédiat aux libellés Entrée/R au clavier |
| Classement | retour B/Échap actualisé |
| Dialogues de compte HTML | indications TAB/Entrée/Échap ou croix/A/B ; navigation de focus à la manette, invité et fermeture accessibles ; aucune commande transmise au jeu derrière |
| Instructions associées au canvas | texte DOM d'accessibilité issu des mêmes modèles, incluant le remapping ; aucune promesse d'équivalence lecteur d'écran |

La saisie du pseudo et du code nécessite toujours un clavier ou le clavier système : aucun clavier virtuel pilotable à la manette n'a été ajouté. Le dialogue le précise. Les boutons natifs et les cases à cocher restent utilisables au clavier ; la navigation manette ne contourne ni le consentement ni les validations réseau.

## 2. Placement et dimensions

Toutes les mesures sont en pixels de conception Phaser (hauteur 270), pas en pixels physiques de moniteur.

| Élément | Avant | Maintenant |
|---|---|---|
| Avatar décoratif du menu | pieds à y=96 | y=99 ; ligne conservée |
| Avatar et ombre de carte | y du rail −1, variation pendant le tween | y du rail +3, constant à l'arrêt et pendant le trajet ; **aucun corps physique de niveau déplacé** |
| HUD collecte | 214×72 | 186×48 ; aperçu conservé, chiffres à 8 px, bilan grand format inchangé |
| Pause | bouton tactile sous le widget, séparé du HUD | bouton commun 62×28 en haut à droite, commande sur seconde ligne ; accessible aussi à la souris |
| Météo | 154×38, jusqu'à trois lignes | hauteur **26**, deux textes, largeur mesurée après traduction, ancrage droit ; séparation de 6 px avec pause |
| Contexte de lieu non terminé | 440×226, recouvre le personnage/rail | **416×140, y=8**, contenu paginé ; bas du panneau y=148, au-dessus du personnage et du rail |
| Introduction du menu | 420×118 | **384×100**, y haut=118 ; deux pages en français, contenu complet conservé |
| Bandeau d'entrée de niveau | centré au milieu, espacements larges | ancré sous le HUD à y=60, largeur bornée et interlignes réduits, effets météo toujours annoncés |
| Indications carte | toast temporaire sur fond du décor | texte persistant sur petit fond encre au-dessus de la barre basse ; autres toasts déplacés en haut |
| Résultat et classement en format large | boutons fixes à gauche de leur zone de conception | décalage DX appliqué aux boutons fixes, alignés sur le panneau / centrés dans le viewport |

Les bilans complets et le livre gardent l'espace nécessaire à la lecture : la réduction ne s'applique pas aveuglément à toutes les modales. Les notices et la grammaire ne sont pas tronquées pour tenir dans la fiche courte.

### Météo sans ambiguïté

- Observation reçue : température et condition / **EN DIRECT**.
- Dernière observation gardée en cache : température et condition / **HORS LIGNE**.
- Aucune observation utilisable : température locale et **NEUTRE** / **HORS LIGNE**.
- Outil de test : température et condition / **TEST · SIMULATION**.

L'âge n'occupe plus de troisième ligne ; `GP.Weather.state.source/time` restent disponibles. Aucun changement de parsing, cache, fréquence des appels ou effets de gameplay par ce redesign.

## 3. Pentes : un même profil géométrique

Cause : l'herbe était découpée dans une bande à `col.top - 6`, à hauteur constante, même si le chemin variait sur cette tuile. Réduire seulement la quantité de terre visible ne pouvait pas résoudre ce décalage.

Correction dans `MapArt.drawWorld` : chaque colonne de texture est dessinée par bandes verticales de **1 px**, translatées selon `MapArt.vergeY(x)`, lui-même dérivé de `pathY(x)`. Herbe, chemin et début du remplissage de terre utilisent le même profil. Les textures plates existantes sont réutilisées ; aucun shader ni asset supplémentaire, aucun lissage. Les huit pentes montantes/descendantes et leurs raccords plats sont traités, pas seulement la pente initiale. La carte reste découpée en textures ≤2048 px.

Le travail est effectué **une fois au boot**, pas à chaque frame. La planche [polish-pentes.png](screenshots/polish-pentes.png) relit les textures produites, sans décor masquant les raccords : quatre montées (x=208,400,1344,2112) et quatre descentes (x=592,960,1728,1920).

## 4. Inversion immédiate sur la carte

Le tween précédent refusait toute commande tant que `moving` était vrai. Il est remplacé par `MapTravel`, petit système indépendant du rendu : position courante, cible, vitesse 95 px/s, bornes du rail et demande de fiche à l'arrivée.

Une nouvelle direction choisit le prochain nœud dans ce sens **depuis la position courante**. Aucun retour au centre de l'ancien nœud, aucune téléportation et aucune attente de fin d'animation. La frame suivante avance dans le nouveau sens ; le sprite se retourne immédiatement. Un clic peut aussi retargeter un trajet en cours. Une inversion annule la fiche programmée pour l'ancienne cible. Le nœud courant est enregistré à l'arrivée, y compris si un clic vise un nœud déjà rejoint pendant un trajet plus long.

La carte est un rail **1D** : pas de diagonale ou déplacement vertical libre. Le y suit le profil et les ponts existants ; les collisions des niveaux ne sont pas concernées.

## 5. Recette et preuves

**Résultats finaux : 28/28 tests Node ; 97/97 assertions de polish dans chacun des trois formats ; 24/24 contrôles de régression du socle ; 285/285 pixels identiques pour l'avatar.** Les 97 assertions comprennent 50 inversions rapides : ce ne sont pas 97 scénarios humains distincts. Neuf diagnostics géométriques ont aussi été relancés, avec leurs limites ci-dessous.

- `node --test tests/*.test.js` : tests de robustesse précédents + détection, hystérésis, remapping, traduction, cycle de vie, retarget et continuité du rail.
- `GP.runPolishTests()` : parcours simulé avec le vrai moteur ; connexions/drift, clavier DOM, API manette simulée, livre ouvert, remapping, 50 inversions rapides, 12 fiches compactes, tutoriels, pause, compte invité sans requête, résultat/rejeu, avatar et classement.
- `GP.runBrowserTests()` : régression du socle ; collecte finale contrôlée par script, pas un playthrough humain.
- Diagnostics géométriques des 3 niveaux sous pluie/vent/neige relancés : zéro fragment inaccessible détecté ; morts neutralisées et départs téléportés, limites inchangées.

Les fenêtres internes contrôlées sont **1920×1080**, **1366×768**, **844×390** ; résolutions du jeu respectivement 480×270, 480×270 et 584×270. Les planches primaires et complémentaires de `docs/screenshots/polish-*` ont été inspectées visuellement (menu/contexte, carte, livre clavier/manette, commandes, HUD/pause, avatar, résultat et classement).

Ce sont des **exports du rendu Phaser dans ces viewports CSS**, assemblés en planches et agrandis sans lissage, pas des captures desktop ni des essais sur moniteurs/contrôleurs/téléphones physiques. La capture desktop a échoué parce que la fenêtre de l'application n'était pas visible. Les connexions et pressions manette sont simulées via l'API ; les frappes de recette sont des événements DOM synthétiques.

Voir [tests/README.md](../tests/README.md) pour reproduire. Les scripts QA restaurent les sauvegardes/réglages de leur origine, mais doivent toujours être lancés sur une origine locale dédiée. Pas de nouvelle mécanique d'atlas, de météo abritée ou de génération de niveaux dans cette livraison.

Le harnais a été rendu indépendant du remapping préexistant après qu'un contrôle supposant « ESPACE » a rencontré une configuration F pourtant correctement affichée. Les recettes de formats sont exécutées séquentiellement : des onglets d'une même origine partagent `localStorage` et ne doivent pas restaurer des snapshots en parallèle.

### Planches inspectées

| Format interne | Menu, carte, contexte, livre, commandes manette, HUD/pause | Avatar, commandes clavier, résultat, classement |
|---|---|---|
| 1920×1080 | [principale](screenshots/polish-1920x1080.png) | [complément](screenshots/polish-1920x1080-extras.png) |
| 1366×768 | [principale](screenshots/polish-1366x768.png) | [complément](screenshots/polish-1366x768-extras.png) |
| 844×390 | [principale](screenshots/polish-844x390.png) | [complément](screenshots/polish-844x390-extras.png) |

## 6. Limites restantes

Essais matériels manette standard/Sony et téléphone, Firefox/Safari, `file://`, netteté réelle sur dalle 1366×768 et multitouch à effectuer. Le canvas reste visuel et les petits textes peuvent demander un réglage après playtest. Le service worker doit être mis à jour sur un site installé : cache désormais `greenpath-offline-v3-shelters`, activation après fermeture des anciens onglets. Pas de benchmark FPS mobile ni de certification d'accessibilité. Les limites patrimoniales, juridiques et serveur de l'audit restent ouvertes.

## 7. Lot correctif et upgrades explicitement validés

### Causes, antériorité et traitement

| Problème | Cause et lien aux changements récents | Correction à la source |
|---|---|---|
| Crédits recroquevillés | Navigation Confidentialité/Sources ajoutée au bloc fixe existant ; troisième bouton sans réserve de hauteur | `AboutScene`, trois rubriques distinctes avec pagination de lecture, retour Menu/Options, contenu précédent conservé |
| Options tassé | Mise en page préexistante à pas 22 pour lignes 20 ; ajout de lignes rendant le défaut plus visible | Deux groupes de 5/3 lignes, pas 28, retour commun ; Tab ou LB/RB pour changer de groupe |
| Héros enfoncé dans les piédestaux | Profil limité au chemin dans `MapTravel`/`MapScene` ; récent décalage graphique +4 aggravant un manque de surface logique | `MapArt.walkY` dérive les marches de l'asset ; modèle et rendu partagent `travel.y`, sans retirer l'inversion |
| Haie/barrière tronquées | Modules `tile_x` ouverts utilisés comme objets isolés ; défaut d'usage des assets, pas clipping global récent | `MapDecor` dérive seulement deux textures fermées ; dessin central/palette et matrices sources conservés |
| Étape/fiche concurrençant l'interface | Ancrages hauts de la fiche compacte et du bandeau de niveau | Les deux sont centrés selon décision utilisateur ; la fiche peut temporairement recouvrir le héros |
| Textes de transition masqués pendant la recette | Fond créé après les textes au même depth dans le nouveau panneau | Fond depth 80, textes 81 ; assertion de superposition et inspection visuelle |
| Options rouvert avec un ancien groupe | Phaser peut conserver les anciennes données de démarrage si aucune donnée explicite n'est fournie | `Menu.goTo` et helpers de recette transmettent `data || {}` |

Le profil de déplacement reste un rail 1D en X, mais le **Y logique est désormais explicite** et suit les marches pixelisées. Les quatre états du piédestal ont le même contour. Les pentes, ponts et inversion rapide restent testés. Aucun arbre, lampadaire ni buisson arrondi déjà correct n'est retouché.

### Navigation et transition

- À propos : trois rubriques indépendantes ; Haut/Bas ou croix pour choisir, Gauche/Droite ou LB/RB pour lire, Échap/B pour revenir ; onglets et boutons cliquables. Conservation intégrale des anciens textes Confidentialité/Sources testée en FR/EN, y compris les longues URL. Le nombre de pages est distinct de celui des rubriques.
- Options : zones de 20 px, espacées par un pas de 28 px (8 px libres), retour séparé ; clavier configurable et vue manette conservés. Retour de Confidentialité vers le même groupe/ligne.
- Entrée de niveau : `ÉTAPE nn / 12`, nom et annonce météo dans une carte légère centrée, largeur plafonnée à 400 px. Durées existantes 1,9/2,6 s conservées, apparition 180 ms (1 ms en mouvement réduit), disparition 300 ms. Le HUD reste en haut, sans intersection avec la carte d'entrée.
- Fiche : décalage vertical central commun au fond, textes et boutons (57 px compact, 10 px bilan). Pas de décalage du seul titre.

### Gameplay autorisé et validation

`GP.Tuning` conserve les valeurs de déplacement/saut/gravité/temps ; protocole humain et instrumentation volontaire en mémoire : [PLAYTEST_REPORT.md](PLAYTEST_REPORT.md). Quatre rectangles de couverture à canaux indépendants, masque de précipitations et transition physique : [WEATHER_SHELTERS.md](WEATHER_SHELTERS.md). Pas d'atlas, carte reconstruite, récompense générative, fragments sémantiques, nouveau niveau ou ennemi.

**Recette finale : 39/39 Node ; par format 1920×1080, 1366×768 et 844×390 : 73/73 régression, 97/97 polish, 24/24 socle.** Neuf diagnostics géométriques sans fragment inaccessible. Console Chromium sans erreur relevée en fin de recette. Aucun humain ni appareil physique testé ; fenêtres CSS, clavier DOM et Gamepad simulés. Les tests de reprise couverte utilisent une zone fixture temporaire autour d'une lanterne, sans changer les vrais checkpoints.

| Format | Nouvelles planches inspectées (11 vues) |
|---|---|
| 1920×1080 | [régressions](screenshots/regressions-1920x1080.png) |
| 1366×768 | [régressions](screenshots/regressions-1366x768.png) |
| 844×390 | [régressions](screenshots/regressions-844x390.png) |

### Fichiers de ce lot (sans attribuer le travail antérieur à cette mission)

- Configuration/intégration : `index.html`, `js/main.js`, `js/data/tuning.js`, `js/data/locations.js`, `manifest.json`, `sw.js`.
- Navigation/texte : `js/scenes/AboutScene.js`, `MenuScene.js`, `OptionsScene.js` ; `js/data/lang/fr.js`, `en.js` ; `js/systems/Ui.js`, `Controls.js`, `Prompts.js`.
- Carte : `js/scenes/MapScene.js` ; `js/systems/MapArt.js`, `MapTravel.js`, `MapDecor.js`.
- Météo/gameplay : `js/data/levels.js`, `js/scenes/GameScene.js` ; `js/systems/WeatherRules.js`, `WeatherShelters.js`, `WeatherFX.js`.
- QA : `tools/playtest.js`, `tools/regression-tests.js`, `tools/polish-tests.js`, `tests/core.test.js`, `tests/regressions.test.js`, `tests/README.md` ; trois nouvelles planches `docs/screenshots/regressions-*`.
- Documentation : `README.md`, `CREDITS.md`, `ROADMAP.md`, `docs/UX_POLISH.md`, `GAMEPLAY_UPGRADES.md`, `PLAYTEST_REPORT.md`, `WEATHER_SHELTERS.md`, `carnet-de-bord.md`, `grammaire.md`.

Tous les autres changements non commités de l'audit et du polish précédent restent conservés ; l'état Git global ne représente pas uniquement ce lot.
