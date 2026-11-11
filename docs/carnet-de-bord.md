# Carnet de bord — Green Path

## Lundi 9 novembre 2026 — retouches J1 (après la Phase 1)
**Demandes** : accents partout, menu « PERSONNALISER L'AVATAR », aide « COMMENT JOUER ? », suppression du triangle vert, monuments gris dévoilés à la réussite, objectif de fin (étoiles), météo réelle (jour/nuit, pluie, nuages, vent), avatar sur la pose Figma, carte refaite en tuiles.

**Décisions**
- Objectif de fin : **étoiles par niveau** (image complète / sans obstacle / sous le temps cible). Règle isolée dans `Stars.js` pour être réglée au playtest.
- Avatar : pose de trois quarts du sprite Figma pour tout le jeu ; miroir pour marcher vers la gauche. Contrôle objectif : `node tools/compare-figma.js` → 285/285 pixels identiques (tolérance ±4 par canal pour les arrondis d'export).
- Carte : plan ASCII en tuiles (`mapLayout.js`), dessin original ; les captures fournies servent d'ambiance uniquement.
- Météo : purement visuelle, partagée carte / niveaux (`WeatherFX`), avec cache 30 min et secours hors ligne.

**Vérifications faites** (serveur local + navigateur) : glyphes accentués présents dans Press Start 2P (majuscules accentuées un peu tassées mais lisibles) ; aide ouverte et fermée au clic et à Échap ; TEST:FINI → dévoilement, 3 étoiles sous le nœud et « 3/12 » dans le bandeau, état conservé au rechargement ; ancienne sauvegarde sans étoiles chargée (1 étoile par niveau) ; météo live, cache, échec réseau et délai dépassé (4 s) → SECOURS ; météos simulées (W) : soleil, nuit, pluie, brume ; mouvement réduit : 50 gouttes au lieu de 150 ; plein écran 1920×1080 ; aucune erreur console.

**Reste à faire** : Phase 2 (moteur de plateforme), où `GameScene` appellera `GP.WeatherFX.apply` et `GP.Stars.compute` ; régler `parTime` au playtest ; décider du sort de la planche Adobe Stock (À VÉRIFIER).

## Lundi 9 novembre 2026 (suite) — correctifs d'interface et premier niveau jouable
**Correctifs** : titre « NANTES » seul ; créateur sans ombre ni libellé de pose ; pieds fermés (dessus de chaussure ligne 17, semelle sombre ligne 18) ; fenêtres au style de l'accueil (bleu nuit, texte blanc, titres verts) ; bouton « COMMENT JOUER ? » en bas à droite ; « À JOUER » supprimé ; météo : EN DIRECT / IL Y A N MIN / HORS LIGNE.
**Aide** : 4 pages (carte, niveau, but, météo), touches dessinées en pixel, navigation souris et clavier, ouverte aussi depuis la pause.
**Niveau 1 — Jardin des Plantes** : moteur Arcade (`GameScene`), décor « plateforme » généré par code, ronces et lanternes, 32 pixels révélant le Palmarium du bas vers le haut, écran de résultat avec étoiles, enregistrement et dévoilement sur la carte.

**Décisions** : un contact avec une ronce renvoie à la dernière lanterne (et compte pour l'étoile « sans toucher ») ; W reste la touche de météo de test, donc le saut se fait avec Espace, ↑ ou Z.

**Vérifications** (jeu piloté image par image depuis la console, `tools/bot.js`) : traversée complète des 136 tuiles sans touché ; 32 pixels sur 32 atteignables avec la vraie physique ; premier rebord inaccessible avec un appui bref (oblige à « sauter plus haut ») ; ronce et chute → retour à la lanterne et compteur +1 ; saut identique de jour et par nuit pluvieuse ; pause, aide depuis la pause, retour ; fin → résultat 3 étoiles → carte → dévoilement → étape 2 débloquée. Ajustement fait après mesure : des pixels placés hors de l'arc réel du saut ont été déplacés, et le deuxième rebord a été abaissé (marge de 3 px seulement).

**Reste à faire** : régler `parTime` au playtest (le robot met 20 s pour traverser le niveau, sans tout ramasser) ; niveaux Château, Cathédrale, Bouffay ; `DEV_TOOLS` à `false` avant le gel.

## Lundi 9 novembre 2026 (soir) — carte du monde, photo réelle, morts
**Fait** : le sélecteur de niveaux devient une carte du monde à défilement horizontal (héros suivi par la caméra, monuments posés derrière les nœuds, ponts au-dessus de l'eau) ; l'ancienne carte vue de dessus est supprimée (menu et créateur utilisent le décor de plateforme). Menu : CRÉDITS (Florine RACINE, Loan PLEURMEAU) et introduction montrée une seule fois. Fiche de lieu en pages après réussite : BILAN (photo reconstruite, chiffres, étoiles par critère) et FICHE DU LIEU (texte complet). « Touchés » devient « Morts », avec une courte animation de mort. Niveau 1 redécoré : parvis de la gare puis jardin (bassin, massifs, topiaire-plateforme, personnage en bois). Mode test seulement avec `?dev=1` ; TEST:FINI et mentions « À VÉRIFIER » retirés de l'écran.
**Photo** : Palmarium, Pymouss44, CC BY-SA 3.0 (validée par l'équipe avant téléchargement), recadrée et pixélisée en 48×32, 16 couleurs (`tools/pixelize.swift`).
**Vérifications** : flux complet par script (introduction → créateur → carte → niveau → résultat → carte → dévoilement → étape 2 débloquée) ; 32 pixels sur 32 atteignables ; robot sur 136 tuiles sans mourir ; mort sur ronce → retour lanterne, compteur ; résultat enregistré avec les morts ; aucune erreur console.
**Décision** : W sert au saut dans les niveaux (demande du plan), donc la météo simulée y passe sur N en mode test.

## Mardi 10 novembre 2026 — vague 1 (socle) puis vague 2 (niveaux 2 à 4)
**Vague 1** : favicon tiré du logo, écran « tournez votre téléphone » avec pause, contrôles tactiles, introduction du gardien, import des 10 planches de sprites (447 sprites Claude Design), carte refaite avec la planche « carte », README et CLAUDE.md, dépôt GitHub public `Tailung-dev/green-path`.
**Retours de l'équipe** : tête de l'avatar qui passait derrière le torse (corrigé : dessinée après), bandes de terre au-dessus du chemin sur les pentes (corrigé : couches découpées), halo vert des piédestaux (retiré), météo vraiment en direct (corrigé : toutes les 5 min, dernière météo gardée hors ligne). Retour à l'ancien ordre des 12 lieux (Bouffay revient, Tour LU retirée).
**Vague 2** : la météo de Nantes devient une règle de jeu (sol qui glisse, vent qui pousse les sauts, brume, nuit, ronces qui poussent, fleurs-plateformes), toujours annoncée. Moteur : s'accroupir, grimper, s'accrocher aux rebords, plateformes mobiles, flèches, herses, tonneaux, gargouilles, corniches qui s'effritent. Niveaux 2 Château, 3 Cathédrale, 4 Bouffay.
**Vérifications** (jeu piloté par script) : tous les pixels des 4 niveaux atteignables avec la vraie physique, aussi sous pluie, vent et neige ; s'accroupir évite les flèches (0 mort contre 24 debout sur 4 s) ; mur de 64 px infranchissable sans s'accrocher, franchi en s'accrochant ; colonne → rebord ; corniches qui tombent puis reviennent ; herses franchies ; 4 étals portent le joueur sans à-coup.

## Mardi 10 novembre 2026 (soir) — branche fix/ux-socle
**Retours de l'équipe traités** : (1) téléphone en plein écran : zone de jeu élargie à l'écran (480 à 640 px), fenêtres centrées, manifeste installable, plein écran au premier toucher, astuce iPhone ; (2) écran noir après RÉINITIALISER : le menu supprimait les textures et l'animation de l'avatar qu'il affichait encore, ce qui faisait planter le rendu → textures mises à jour sur place ; (3) langues FR/EN avec bouton sur l'accueil et écran OPTIONS (touches réaffectables, son, plein écran, effacement des données) ; (4) RGPD : page CONFIDENTIALITÉ (crédits et options) + docs/confidentialite.md ; (5) manette (jeu et menus) ; (6) skills Phaser lus et installés en local, terrain des longs niveaux découpé en morceaux de 2048 px (limite des textures sur téléphone), parallaxe arrondie.
**Décisions** : comptes Supabase = pseudo seul, sans e-mail (vague 3, après validation) ; ordre des 12 lieux calé sur la séquence de la page « Arpenter la ligne verte » (qui ne donne aucune numérotation) : Jardin, Cathédrale, Château, Feydeau, Graslin, Machines, Chantiers, Buren, Hangar, Mémorial, Pommeraye, Tour LU ; le niveau Bouffay reste dans le dépôt, sans lieu.
**Vérifications** (script) : réinitialisation → retour à l'accueil sans erreur ; touches réaffectées prises en compte ; manette simulée (déplacement, saut, événements de menu) ; tous les pixels des 3 niveaux restent atteignables ; zone 584×270 sur un écran 844×390 sans bandes ; terrain de 300 tuiles découpé en 3 morceaux.

## Mardi 10 novembre 2026 (nuit) — vague 3 : pseudo, sauvegarde en ligne, classement (branche feat/supabase)
**Choix** : comptes « pseudo seul » sans e-mail. Supabase Auth anonyme est désactivé par défaut et ne permettrait pas de retrouver sa sauvegarde sur un autre appareil : le jeu utilise un **pseudo + un code secret de 20 caractères** généré dans le navigateur ; le serveur ne garde que le haché. Tables fermées au public, cinq fonctions `SECURITY DEFINER` (inscription, connexion, sauvegarde qui ne dégrade jamais un résultat, classement, suppression). Projet gratuit `green-path` (Paris) créé avec l'accord de l'équipe.
**Interface** : proposition après le premier niveau terminé (créer un pseudo, retrouver avec un code, jouer en invité), fenêtre HTML (vrai champ de saisie, copier-coller), consentement explicite, CLASSEMENT dans le menu, OPTIONS → COMPTE (synchroniser, déconnecter, supprimer), notice de confidentialité mise à jour (FR/EN).
**Vérifications** (contre le vrai projet) : inscription, pseudo déjà pris / invalide, sauvegarde, classement, reprise « sur un autre appareil » avec fusion (pire résultat jamais écrasé), mauvais code refusé, accès direct aux tables refusé, réseau coupé (classement en cache, création et envoi qui échouent proprement, reprise au retour), suppression du compte ; fenêtre : touches du champ non vues par le jeu, Échap, consentement requis. Conseillers Supabase : 2 INFO et 5 WARN, tous voulus (voir `supabase/README.md`). Comptes de test supprimés.
**Limites** : classement de confiance (pas anti-triche), pas de limitation de débit ni de filtre de pseudos ; projet gratuit mis en pause après environ une semaine sans activité.

## Mardi 10 novembre 2026 — audit et stabilisation (branche `fix/audit-green-path`)

**État constaté** : 12 lieux, mais 3 accessibles (Jardin, Cathédrale, Château). Bouffay est une définition détachée ; neuf niveaux et la récompense finale ne sont pas livrés. Le brief intégral (sections 00–16) a été relu. Source principale conservée : Château ; autres lieux comme variations secondaires, pas suppression du parcours.

**Corrections** : import de sprites sans exécuter de JS ni accepter de chemin libre ; sauvegardes malformées et quota disque ; validation météo/cloud ; courses de synchronisation ; états de pause périmés ; double validation manette ; lanternes de proximité ; croissance de ronces concurrente ; cohérence des records d'étoiles ; focus du dialogue ; commandes tactiles relâchées au blur ; carte découpée à 2048 px. CSP et en-têtes Vercel préparés.

**Ajouts** : reprise locale des fragments/lanterne/temps/morts, service worker après première visite complète, ordre de révélation `fortification` pour le Château et pages « SOURCE → RÈGLE », crédits/licences dans le jeu. Notice du Château précisée à partir du site institutionnel. Documents racine, cartel (102 mots de concept), manifest pédagogique et procédures de tests ajoutés. Aucun nouveau téléchargement de photographie.

**Vérifications réellement exécutées** : 17 tests Node, comparaison avatar 285/285, 24 contrôles d'intégration Phaser, 9 diagnostics géométriques (3 lieux × pluie/vent/neige, aucun des 80 fragments inaccessible par météo). Ces diagnostics ignorent les morts et utilisent plusieurs points de départ : ils ne prouvent pas une traversée humaine. Cache de 56 fichiers contrôlé, serveur local arrêté puis vrai rechargement réussi ; appels API ensuite rejetés, reprise d'un fragment et collecte du suivant sauvegardée. Clavier Échap/Entrée et boucle de focus compte testés. Cadres de dimensions internes 1920×1080 et 844×390 contrôlés ; tactile testé seulement de façon synthétique.

**Non réalisé / réserves** : pas de playtest par un autre groupe, pas de test sur téléphone physique ni Safari/Firefox/file://, pas d'exécution SQL ni de déploiement. La définition `gp_save` est renforcée uniquement dans le dépôt. Limitation de débit serveur, provenance de l'avatar, relevés et notices secondaires, neuf niveaux, fin et captation restent à traiter. Assistance IA déclarée dans README/CREDITS ; aucune contribution individuelle inventée. Voir `AUDIT.md` pour le détail.

## Mardi 10 novembre 2026 — finition UX/UI, même branche

**Livré** : commandes adaptatives à chaud à partir d'une source centrale (remapping compris), protection contre drift/connexion/répétitions, livre/tutoriels/menus/dialogues synchronisés, navigation du dialogue de compte à la manette sans fuite vers le jeu. Carte retargetable depuis la position courante, décalage d'affichage du héros/ombre sans modifier la physique, huit pentes corrigées par bandes de 1 px. Contexte paginé 416×140, introduction 384×100, HUD 186×48, météo à deux lignes de hauteur 26, pause dans le HUD et boutons fixes recentrés en format large.

**Recette** : 28 tests Node ; 97 assertions par format (1920×1080, 1366×768, 844×390, dont 50 inversions rapides) ; 24 contrôles de régression ; avatar 285/285 ; neuf diagnostics géométriques sans fragment inaccessible détecté. Exports du rendu Phaser inspectés et archivés dans `docs/screenshots/polish-*`. La capture desktop exigeait une fenêtre visible et n'a pas abouti ; aucun essai physique de manette/téléphone revendiqué. Les tests de formats sont séquentiels sur une origine dédiée, car `localStorage` est partagé entre onglets.

**Choix** : pas d'upgrade gameplay nouveau implémenté par défaut. Atlas, régions architecturales, lanterne de lecture, météo abritée, carte reconstruite et fin générative sont réévalués avec intérêts, coûts et priorités dans `docs/GAMEPLAY_UPGRADES.md`. Aucun commit/push/déploiement ni changement de format de progression ; le travail d'audit non commité reste conservé.

## Mardi 10 novembre 2026 — régressions et upgrades autorisés, même branche

**Demandes et décisions** : trois rubriques distinctes sans perte de contenu ; Options aéré ; piédestaux et inversion compatibles ; terminaisons ciblées de haie/barrière validées par l'équipe ; transition **et** fiche centrées (la fiche peut recouvrir le héros). Météo abritée validée : passages existants du Château, pluie/neige 1 et vent 0.5 ; auvents du Jardin, pluie/neige 0.5 et vent 0.25. Aucun ajout arbitraire de structure à la Cathédrale.

**Causes corrigées** : crédits empilés dans l'ancien espace ; lignes Options séparées de 2 px ; hauteur de héros basée sur le chemin sans contour de piédestal, aggravée par le décalage récent ; modules répétables ouverts employés seuls. Le panneau d'entrée centré a aussi nécessité une profondeur de texte distincte de son fond, défaut trouvé à l'inspection des captures. Les données d'initialisation Phaser sont explicitement vidées lors des transitions sans paramètres pour éviter un ancien groupe Options.

**Livré** : `AboutScene`, groupes Options, `walkY` et Y logique de `MapTravel`, textures dérivées `MapDecor`, centrage commun des fiches, quatre zones météo à coefficients indépendants, masque spatial, interpolation 300 ms et recalcul à la reprise. `GP.Tuning` centralise les valeurs existantes sans changer vitesse/saut/gravité/temps cibles. Relevé volontaire de playtest en mémoire avec export JSON, jamais chargé par défaut ni envoyé au réseau.

**Recette exécutée** : 39 tests Node réussis ; pour chacun des formats 1920×1080, 1366×768 et 844×390, 73 contrôles régression + 97 polish + 24 socle réussis ; neuf diagnostics géométriques sans fragment inaccessible. Onze vues inspectées par format et archivées dans `docs/screenshots/regressions-*` sans remplacer les planches précédentes. Console sans erreur relevée en fin de recette. Les contrôles sont synthétiques, pas matériels.

**Limites** : aucun testeur humain disponible, donc aucun temps de complétion humain, aucune observation inventée ni réglage global arbitraire. Protocole reproductible dans `docs/PLAYTEST_REPORT.md`, architecture dans `docs/WEATHER_SHELTERS.md`, causes/fichiers dans `docs/UX_POLISH.md`. Manette/téléphone réels et essais multi-navigateurs restent nécessaires. Atlas, carte reconstruite, fin générative, fragments architecturaux, nouveaux niveaux/ennemis/boss non implémentés. Aucun commit, push, déploiement ni migration ; tous les changements non commités précédents conservés.

## Mercredi 11 novembre 2026 — retours de jeu, même branche

**Demandes** : menu d'accueil et onglets mal centrés ; avatar de l'accueil figé ; avatar de la carte à recentrer sur le piédestal ; bouton PAUSE à retirer sur ordinateur ; sprites de terrain « tronqués » ; difficulté à rééquilibrer.

**Causes et corrections** : le libellé du menu était centré avec sa flèche de sélection (le mot se décalait de 8 px) → flèche séparée ; les boutons de hauteur 20 plaçaient le texte 2 px trop haut → centrage vertical dans `GP.UI.button` ; l'avatar de l'accueil ne marchait pas parce que le système demandait moins d'animations (`prefers-reduced-motion`) → option **OPTIONS → ANIMATIONS** (Auto, Activées, Réduites), et en mouvement réduit l'avatar attend au milieu de la ligne au lieu de marcher sur place ; sur la carte les pieds descendent au centre du disque (chiffre derrière l'avatar), progressivement près de chaque étape ; le bouton PAUSE n'existe plus que sur écran tactile (la météo se cale alors sur le bord droit) ; les blocs de terrain étaient peints en coupe franche → rebords (sprites d'herbe et de terre dédiés au Jardin, liseré, reflet, ombre et coins arrondis ailleurs, dessous des blocs suspendus), tuiles variées.

**Équilibrage** : voir [equilibrage.md](equilibrage.md). Début plus doux, pic du niveau 6 écrêté, ennemis +10 % aux niveaux 7 à 12, Mémorial durci sans ennemi ni pointe (leurres de plus en plus lisibles à retenir, marée plus lourde). `tools/balance.cjs` et `tests/balance.test.js`.

**Recette exécutée** : 57 tests Node ; contrôles dans le navigateur local (menu, onglets, Options, carte, Jardin, Chantiers). **Non réalisé** : aucun playtest humain, pas de test sur téléphone physique ; les neuf diagnostics géométriques n'ont pas été relancés (Playwright absent) ; les douze niveaux n'ont pas tous été revus à l'écran.

## Mercredi 11 novembre 2026 (soir) — chargement, compte, cache, sol, ressenti

**Demandes** : écran de chargement et fenêtre de compte hors direction artistique ; ancienne version qui restait en cache ; sprites tronqués ; avatar et décors qui flottent ; revoir les déplacements avec le dossier `REA`.

**Causes et corrections** : le service worker servait son cache d'abord et son nom ne changeait pas → réseau d'abord (copie locale hors ligne ou après 4 s), nom de cache changé à chaque publication (`tools/bump-sw.cjs`), rechargement unique à la mise à jour ; chargement et compte étaient en pixels fixes → échelle `--u` (un pixel de jeu en pixels d'écran) pour avoir la taille de texte du reste du jeu ; les tuiles d'herbe ont leur première rangée presque vide, donc le trait du sol était 1 px sous la collision (vérifié pixel par pixel : un pixel vide entre les pieds et l'herbe) → tuile remontée d'un pixel ; sur la carte, un arbre recouvrait le monument (tronqué) → distance minimale aux monuments.

**Ressenti** : réglage `feel-1`, voir [ressenti.md](ressenti.md) : demi-gravité à l'apex, correction de coin de plafond, rebord frôlé, saut depuis l'accroupi, hisser en poussant vers le mur ; conservation de la vitesse des plateformes essayée et écartée.

**Recette exécutée** : 60 tests Node ; essais scriptés dans le navigateur (saut, coin de plafond, rebord, accroupi, marche de la Cathédrale). **Non réalisé** : aucun playtest humain ; niveaux 7 à 12 non rejoués ; la « troncature » exacte vue sur les captures n'a pas pu être identifiée au-delà du décor sur la carte.

## Mercredi 11 novembre 2026 (nuit) — niveaux bloqués, son, méthode

**Demandes** : plus d'icône check sur les niveaux finis (le piédestal doré suffit) ; plantage en coupant le son ; niveau 2 infinissable ; une méthode (skills) pour des niveaux cohérents à la Mario.

**Corrections** : la méthode `sound()` de l'écran Options était masquée par `scene.sound` de Phaser (« self.sound is not a function ») → `toggleSound()` ; icône check retirée de la carte. Skills `level-design` et `platformer` installés (non versionnés). Nouveau **contrôleur de faisabilité** (`tools/solvability.cjs`, [methode-niveaux.md](methode-niveaux.md)) : il simule le joueur au pixel contre la géométrie. Il a retrouvé exactement le blocage du niveau 2 (x=95 : les montants de la porte des toits étaient des murs de 4 tuiles sur le chemin) et un second, au niveau 4 (x=132 : une colonne de balcon barrait l'accès depuis les bateaux). Corrigés par des retouches (`REPAIRS` dans `GZoneLevels.js`). Les 11 niveaux du moteur actuel passent (arrivée, pixels, lanternes).

**Recette exécutée** : 72 tests Node (dont un test de faisabilité par niveau). **Non réalisé** : refonte « à la Mario » des 12 niveaux (rythme, mécaniques une à une, textures et décor du niveau 2) ; le Château (ancien moteur), les timings de pièges, les ennemis et les courants d'air du niveau 12 ne sont pas contrôlés ; aucun playtest humain.

## Mercredi 11 novembre 2026 (nuit, suite) — niveaux 1 à 3 : apprendre avant d'être testé

**Demande** : refonte « à la Mario » en commençant par les niveaux 1 à 3 (une idée à la fois, danger appris là où l'échec est sans risque).

**Constat** (audit des premiers obstacles de chaque zone) : au Jardin, les premières ronces (x=31), l'eau (x=38) et les jets d'eau cycliques (x=67, 74) n'étaient précédés d'aucun panneau ; dans la Cathédrale, les cierges, pointes, colonnes à grimper et gargouilles de la nef n'étaient annoncés nulle part. Le Château avait déjà ses indications (pont-levis, herse, flèches, planches, tonneau).

**Corrections** : cinq panneaux d'apprentissage ajoutés avant le premier danger de chaque famille (Jardin : ronces, jets d'eau ; Cathédrale : cierges et pointes, colonne à grimper, gargouille), via un nouveau champ `signes` des retouches (`GZoneLevels.js`), avec leur traduction anglaise. Géométrie inchangée : le contrôleur de faisabilité donne toujours 0 pixel hors d'atteinte aux niveaux 1 et 2. Le Château a été relu à l'écran (départ, herse) : rien à reprendre.

**Recette exécutée** : 72 tests Node ; contrôle à l'écran du panneau de la Cathédrale en français et en anglais. **Non réalisé** : niveaux 4 à 12 ; aucun playtest humain.

## Mercredi 11 novembre 2026 (nuit, suite 2) — niveaux 4 à 6 : un panneau par idée

**Constat** : Feydeau n'annonçait ni les pointes du quai ni la première mouette (à passer accroupi) ; Graslin n'avait aucun panneau (parasol-rebond, chaises, tonneau roulant, lustre oscillant découverts sans explication) ; aux Machines, ni les dents, ni la vapeur cyclique, ni le piston n'étaient annoncés.

**Corrections** : neuf panneaux (2 + 4 + 3) placés sur sol plat avant la première rencontre, avec traduction anglaise. Géométrie inchangée, faisabilité toujours à 0 pixel hors d'atteinte pour les niveaux 4, 5 et 6.

**Recette exécutée** : tests Node ; contrôle à l'écran de Graslin (parasol, français) et de Feydeau (mouette, anglais). **Non réalisé** : densité de pointes des Machines (zones 2 et 3) non retouchée ; aucun playtest humain ; niveaux 7 à 12 non repris.

## Mercredi 11 novembre 2026 (nuit, suite 3) — niveaux 7 à 9 : un panneau par idée

**Constat** : aux Chantiers, ni la ferraille, ni l'oiseau bas (accroupi), ni l'ascenseur, ni la vapeur cyclique n'étaient annoncés ; à Buren, le sens des anneaux (rouge en avant, bleu vers le haut), les bornes, l'oiseau bas et l'anneau clignotant étaient à deviner ; au Hangar, ni la tôle, ni les portes coulissantes, ni le tonneau roulant.

**Corrections** : onze panneaux (4 + 4 + 3) sur sol plat avant la première rencontre, avec traduction anglaise. Géométrie inchangée, faisabilité à 0 pixel hors d'atteinte pour les niveaux 7, 8 et 9.

**Recette exécutée** : tests Node ; contrôle à l'écran du panneau de l'ascenseur (Chantiers, anglais). **Non réalisé** : les autres panneaux de 7 à 9 non vérifiés à l'écran ; la densité de tôles du Hangar (zones 2 et 4) non retouchée ; niveaux 10 à 12 non repris ; aucun playtest humain.

## Mercredi 11 novembre 2026 (nuit, suite 4) — niveaux 10 à 12 : un panneau par idée

**Constat** : Pommeraye annonçait les dalles de verre mais pas l'oiseau bas ni le lustre qui se balance ; le Mémorial n'annonçait pas la marée qui recouvre le sol ; la Tour LU n'avait aucun panneau, alors que le courant d'air (seule mécanique nouvelle du dernier niveau) se découvrait sans explication.

**Corrections** : cinq panneaux (2 + 1 + 2) sur sol plat, avec traduction anglaise : oiseau bas et lustre (Pommeraye), marée (Mémorial, un seul panneau sobre pour garder le recueillement), courant d'air et but de l'arène (Tour LU). Un panneau placé très haut dans le niveau (courant d'air, x=145) passait sous le HUD : le texte se place maintenant sous le panneau quand il n'y a pas la place au-dessus (`GameScene`, 4 lignes). Géométrie inchangée, faisabilité à 0 pixel hors d'atteinte pour les niveaux 10, 11 et 12.

**Bilan des douze niveaux** : chaque idée (pointes, oiseau bas, ressort, anneau, engrenage, vapeur, ascenseur, portes, courant d'air…) est désormais annoncée avant sa première rencontre. **Non réalisé** : aucun playtest humain ; densités de pointes des Machines et de tôles du Hangar non retouchées ; Château, ennemis, pièges cycliques et courants d'air toujours hors du contrôleur de faisabilité.
