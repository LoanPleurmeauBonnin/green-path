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
