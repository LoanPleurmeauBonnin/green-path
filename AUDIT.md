# Green Path — audit, corrections et validation

**Date : 10 novembre 2026.** Intervention locale sur `fix/audit-green-path`. Dépôt initial propre ; aucun commit, push, déploiement, migration distante ni suppression de fonctionnalité. Assistance GPT-6.1 Sol via OpenCode. Ce rapport décrit une revue du dépôt et des tests de prototype, **pas une certification de sécurité ou d'accessibilité**.

## 1. Périmètre et méthode

Exploration avant modification : fichiers versionnés de code applicatif, définitions de niveaux/lieux/langues, systèmes graphiques et données de sprites, photo, HTML/CSS, outils, SQL, configuration Vercel et documentation. Les 447 sprites ont en plus été contrôlés automatiquement (dimensions, palette, lignes). Le binaire Phaser a été comparé à la distribution officielle ; le contenu ignoré de `.git`, `.vercel` ou des outils personnels n'a pas été publié. Aucun secret privé détecté dans les sources examinées ; la clé Supabase est une clé **publique publishable**, pas une clé d'administration.

Le [brief complet](https://kamelghabte.me/patrimoine-exe/nantes-001/cours/) a été lu **des sections 00 à 16**, et pas seulement l'introduction : mission, patrimoine, géométrie, creative coding, génératif, API, interaction, corpus, territoires, protocole, livrables, notation, éthique/droits/IA/accessibilité, debug et annexes. Source institutionnelle du Château et page File: de la photo du Palmarium consultées également. Les relevés personnels et le test croisé de groupe ne peuvent pas être remplacés par cet audit.

## 2. Cartographie de l'architecture

```text
index.html (scripts classiques ordonnés, fichiers tous locaux)
  config → langues/I18n → Settings/Controls → Cloud/Account
  données sprites/lieux → Save/Progression/Stars → dessin/Weather/UI
  LevelBuilder + LEVELS + image Palmarium → scènes → main.js

main.js : police prête (ou délai de secours), Phaser.Game, orientation, manette
  Boot : progression + génération des textures → Menu
  Menu → Character → Map → Game(index de lieu) → Result → Map
       ↘ Options / Score            ↘ pause + aide

Game : Tilemap Arcade + contrôleur + AABB pièges/collecte
       → PixelCollection (texture de reconstruction)
       → Progression → Save (localStorage / mémoire)
                    ↘ Cloud (RPC HTTPS facultatives, résultats terminés)

WeatherManager : Open-Meteo → validation/cache/fallback
              → WeatherRules (physique) + WeatherFX/LevelArt (rendu)
sw.js : copie de fichiers publics pour les prochaines visites sans réseau
```

### Responsabilités et choix techniques

| Élément | État réel |
|---|---|
| Stack | Phaser **3.90.0 local**, JavaScript natif, scripts globaux `GP` ; ni npm, ni bundler, ni framework UI |
| Rendu | WebGL avec repli Canvas ; textures dessinées depuis matrices de lettres ; 480–640×270, pixel art, police locale |
| États | instances de scènes réutilisées ; `create` doit réinitialiser les références ; événements Phaser, clavier, timers et callbacks réseau |
| Niveaux | `js/data/levels.js` : constructeur de grille 17 lignes, 4 définitions ; `locations.js` : 12 étapes, 3 jouables |
| Collision | Tilemap Arcade pour sols/plateformes ; corps dynamiques immobiles pour plateformes spéciales ; boîtes AABB manuelles pour dangers et fragments |
| Interface | objets Phaser et fenêtres `Ui.js` ; seul le dialogue de compte est en HTML sémantique |
| Assets | 447 sprites générés au boot, photo encodée en JS, fontes/icônes locales ; pas de CDN ni d'import utilisateur dans le navigateur |
| Persistance | `greenpath.save`, réglages, météo, compte et classement ; reprise locale ajoutée sans changer la version ni les résultats existants |
| API | fetch Open-Meteo et Supabase facultatives, délai 4 s ; caches locaux ; pas de SDK distant |
| Serveur | jeu statique ; Supabase SQL/RPC facultatif, RLS décrite dans le schéma ; **état réel du serveur non certifié ici** |
| Déploiement | Vercel, sans build ; `.vercelignore` exclut docs/outils/SQL ; en-têtes ajoutés à la configuration, non déployés |

### Maintenabilité

Bon découpage des systèmes, données de niveaux explicables et absence de dépendances de build. Fragilités : espace global et ordre des scripts, `GameScene` monolithique (~750 lignes après ajouts), callbacks de scène nombreux, traduction par remplacement global de `Text.setText`, deux palettes et des commentaires historiques parfois périmés. Une extraction future du contrôleur et des pièges est pertinente, mais une réécriture du moteur ou migration Phaser 4 n'est pas justifiée pour cette mission.

## 3. État initial vérifié, sans confusion interface/fonction

| Fonction | Au départ | Après intervention |
|---|---|---|
| Menu, création d'avatar, carte à 12 étapes | implémentés | conservés ; états périmés et double validation manette corrigés |
| Jardin / Cathédrale / Château | accessibles, 32 / 22 / 26 fragments | conservés, reprise et diagnostics testés |
| Bouffay | définition + sprites + mécaniques mobiles, mais aucun lieu associé | conservé hors parcours ; pas maquillé en Feydeau |
| Neuf autres lieux | monuments/fiches de carte ; **pas de niveaux** | toujours à développer |
| Collecte / victoire | tous les fragments → image complète → résultat | flux testé pour les 3 lieux ; collecte rendue idempotente |
| Reconstruction photo | uniquement Palmarium 48×32, 16 couleurs ; autres images = sprites | même périmètre, ordre Château spécialisé ; crédit visible dans le jeu |
| Grammaire patrimoniale | intentions contradictoires dans les docs ; tous les niveaux en `bottomUp` | Château `fortification`, médiation dans les fiches ; relevés toujours à compléter |
| Météo | **déjà opérante**, pas seulement décorative | validation renforcée, concurrence et réponses tardives corrigées |
| Sauvegarde terminée | locale, fusion de records, cloud facultatif | conservée et validée contre corruption |
| Sauvegarde en cours | aucune après fermeture/refresh | fragments, lanterne, morts et chrono locaux |
| Offline | moteur autonome une fois chargé ou avec dossier local ; aucun cache applicatif de rechargement du site | service worker après première visite complète ; 56 ressources publiques observées en cache |
| Comptes/classement | code client et SQL présents, tests historiques consignés | client testé avec mocks ; aucun compte créé/supprimé sur le service réel |
| Boss, IA ennemie, musée, illustration finale | prévus dans textes/propositions, pas livrés | toujours non livrés, roadmap explicite |
| Tests | comparaison avatar et robot manuel ; pas de suite automatisée | 17 tests Node, 24 contrôles Phaser, runner géométrique documenté |

## 4. Registre priorisé des problèmes

**CRITICAL** = fonctionnement global bloqué ou risque majeur ; **HIGH** = important ; **MEDIUM** = correction nécessaire ; **LOW** = secondaire. Aucun problème CRITICAL confirmé dans le périmètre testé. Les références `fichier :: fonction` désignent l'emplacement exact ; les anciens numéros de ligne seraient instables après refactoring.

| ID / gravité | Emplacement et cause probable | Impact / reproduction non destructive | Solution et état |
|---|---|---|---|
| S01 **HIGH** | `tools/import-sprites.js` : `Function` sur la palette d'une planche HTML ; nom de planche utilisé comme chemin | une planche fournie par un tiers pouvait exécuter du JS dans Node avec les droits du développeur ; `../` pouvait viser un autre fichier | **corrigé** : parseur de littéraux sans exécution, nom restreint, dimensions bornées, validation avant écriture ; tests d'expression et de chemin |
| F01 **HIGH** | `js/scenes/GameScene.js :: create/pause/quit`, références conservées par les instances Phaser | pause → quitter → revenir : ancien `pauseMenu` truthy alors que `paused=false`, première interaction Échap incohérente ; reproduit avant correction | **corrigé** : remise à zéro de pause/aide/toast/verrou ; réentrée testée |
| F02 **HIGH** | `js/systems/SaveManager.js :: sanitize`, dictionnaire `{}` et test `id in ids` | clé JSON `toString` reconnue à tort, accès à un lieu inexistant ; `load` se repliait sur défauts, progression potentiellement perdue | **corrigé** : dictionnaire sans prototype ; tests des clés héritées ; pas d'affirmation de pollution de prototype exploitable à distance |
| F03 **HIGH** | `SaveManager :: load/save`, priorité au stockage même après échec d'écriture | après quota dépassé, la lecture revenait à une ancienne progression malgré le repli mémoire annoncé | **corrigé** : priorité à la dernière copie mémoire ; test quota avec ancien état |
| S02 **MEDIUM** | `SaveManager :: sanitize` et `WeatherManager :: readCache/refresh` : coercitions numériques et validations incomplètes | `"Infinity"`, valeurs manquantes ou nulles pouvaient produire données incohérentes, directions NaN ou comportement inattendu | **corrigé** : nombres finis, types obligatoires météo, bornes, temps cache valide ; rejet des réponses invalides |
| S03 **HIGH** | `js/systems/Cloud.js :: rpc/register/restore/scoreboard`, réponses directement supposées correctes | `null` ou lignes sans pseudo provoquaient exception ; fusion invalide pouvait détériorer les records | **corrigé** : enveloppes typées, pseudos/codes validés, lignes bornées et fusion filtrée ; tests sans écriture distante |
| F04 **MEDIUM** | `Cloud :: push/schedulePush/deleteAccount` : état asynchrone non versionné, succès HTTP confondu avec succès métier | une ancienne synchronisation pouvait marquer propre un nouvel état non envoyé ; suppression refusée pouvait déconnecter quand même | **corrigé** : révision de synchronisation + code de compte vérifié, succès métier requis ; tests de course/refus |
| F05 **MEDIUM** | `WeatherManager :: refresh/load` : appels simultanés et réponse après délai | requêtes doublées à l'ouverture des scènes ; vieux résultat susceptible d'écraser le cache après fallback | **corrigé** : une requête en cours partagée, callbacks regroupés et réponse tardive ignorée ; tests |
| F06 **MEDIUM** | `Controls.js :: poll` : émission Enter **et** Space pour A ; état précédent non nettoyé | saut de deux actions de menu, personnage/créateur aussi affectés ; nouvel appui perdu après déconnexion | **corrigé** : Enter seul, remise à zéro, capture bloquant aussi les entrées de gameplay ; test manette simulée |
| F07 **MEDIUM** | `GameScene :: checkWorld`, lanterne activée sur simple abscisse dépassée | checkpoint validé sans proximité verticale, éventuellement pendant une chute | **corrigé** : rayon horizontal/vertical ; test de lanterne distante |
| F08 **MEDIUM** | `GameScene :: applyWeather`, tweens concurrents de croissance/disparition | alternance pluie/soleil rapide pouvait masquer une ronce dangereuse ou conserver un ancien callback | **corrigé** : état désiré, annulation des tweens concurrents ; test pluie → soleil → pluie |
| F09 **MEDIUM** | `ProgressionManager :: complete` : étoiles max d'une seule partie mais records fusionnés séparément | bilan affichant trois critères obtenus alors que le total restait à deux | **corrigé** : recomposition cohérente à partir des meilleurs critères, anciennes étoiles conservées ; test |
| U01 **MEDIUM** | `Account.js :: open/close`, dialogue sans boucle de focus/nom accessible, fermeture possible pendant une requête | navigation clavier hors dialogue et callback tardif sur interface fermée | **corrigé** : label, Tab/Shift+Tab cycliques, fermeture bloquée pendant opération bornée à 4 s, focus restauré ; test clavier réel du dialogue |
| U02 **MEDIUM** | `MenuScene :: create`, animations décoratives ignorant le mouvement réduit | titre oscillant et avatar traversant malgré la préférence système | **corrigé** pour ces deux déplacements ; d'autres petites animations de sprites restent, pas de conformité globale revendiquée |
| U03 **MEDIUM** | `Ui.js :: touchPad`, pas de remise à zéro sur perte de focus | commande tactile potentiellement collée après sortie de fenêtre | **corrigé** : blur/gameout ; pression/relâchement synthétiques testés ; multitouch réel à vérifier |
| P01 **MEDIUM** | `MapArt :: build` : texture de carte de 2330 px en un seul bloc | risque de rendu absent sur matériel limité à 2048 px | **corrigé** : deux morceaux ≤2048 via `LevelArt.chunks`, vérifiés dans Phaser |
| S04 **MEDIUM** | `index.html`, `vercel.json` : absence de CSP/en-têtes | surface d'injection et de chargement externe plus large ; ce n'était pas en soi une XSS démontrée | **durci** : scripts locaux sans unsafe-eval, connexions limitées aux deux API, objets/base/formulaires interdits, anti-framing côté Vercel ; runtime local sans violation CSP observée |
| F10 **HIGH** | `main.js` / absence de worker : promesse « hors ligne » plus large que le cache navigateur garanti | recharger le site hébergé sans Internet pouvait échouer | **amélioré** : worker/cache cohérent après première visite ; rechargement testé serveur arrêté, puis API simulées indisponibles |
| G01 **MEDIUM** | `GameScene` / `SaveManager` : collecte perdue après sortie ou refresh | boucle de reconstruction cassée en interrompant une partie | **implémenté** : reprise locale additive, indices validés et signature du niveau ; résultats antérieurs conservés |
| H01 **HIGH** | `docs/grammaire.md`, `README.md`, `docs/niveaux.md` | promesses non codées (1 fragment=1 cellule, température→teinte, 4 niveaux accessibles, grille photo partout), confusion critères pédagogiques | **actualisé** : état réel, limites du robot, source principale/corpus secondaire, documentation racine et médiation dans les fiches |
| L01 **LOW** | `Settings :: clearAll`, oubli de `greenpath.iostip` | « effacer mes données » incomplet | **corrigé** ; les fichiers publics Cache Storage sont documentés séparément |

### Risques restant ouverts

| ID / gravité | Emplacement / impact / cause | Suite recommandée |
|---|---|---|
| R01 **HIGH** | `CREDITS.md`, `CharacterSprite.js`, provenance de la référence Adobe Stock non résolue | validation documentaire par l'équipe ou remplacement créatif **après accord**, pas suppression arbitraire du personnage |
| R02 **HIGH** | `supabase/schema.sql :: gp_register` / API publique sans limite de débit | inscriptions automatisées et consommation des quotas possibles. Ajouter protection serveur et vérifier le déploiement ; ne pas prétendre qu'un throttle navigateur protège l'API |
| R03 **MEDIUM** | `supabase/schema.sql :: gp_save`, conversions SQL et identifiants arbitraires de niveau | définition locale renforcée (taille, whitelist, erreurs métier atomiques), **non appliquée et non testée PostgreSQL**. Staging + accord avant migration ; base existante préservée |
| R04 **MEDIUM** | `Cloud`/SQL, résultats calculés côté navigateur | classement de confiance manipulable ; pas d'anti-triche garanti. Ne pas utiliser pour récompenses à valeur réelle |
| R05 **HIGH** fonctionnel | `locations.js`, neuf `playable:false`, fin promise dans `lang/fr.js` | aucune complétion des 12 ni illustration finale possible ; développement progressif et récompense de sens dans la roadmap |
| R06 **MEDIUM** | `locations.js`, notices secondaires ; `docs/niveaux.md` | sources historiques et droits d'œuvres contemporaines à préciser ; pas de diffusion large sur la seule foi de la génération IA |
| R07 **MEDIUM** | canvas, HUD, `Ui.js`, langues | lecteurs d'écran non équivalents, petits textes sur téléphone, aide citant des touches par défaut même après réaffectation ; tester utilisateurs et médiation HTML complémentaire |
| R08 **MEDIUM** | `sw.js`, version de cache manuelle | augmenter le nom de cache à chaque livraison ; fermer les anciens onglets pour activation ; ne pas mélanger dev et origine installée ; première visite réseau indispensable |
| R09 **LOW** | `GameScene`, globals et traduction globale | extraire par petits modules après freeze ; pas de refonte opportuniste maintenant |

## 5. Sécurité : conclusions par surface

- **XSS/HTML/JS** : aucun `innerHTML`, `document.write` ou rendu HTML d'entrée externe dans le runtime. `Account.el` utilise `textContent` et des attributs statiques. Les pseudos/classements sont maintenant filtrés. Pas de XSS démontrée ; CSP est une défense supplémentaire, non une « faille corrigée » inventée.
- **Import de fichiers** : risque avéré dans l'outil développeur, pas un upload web public ; exécution dynamique et traversée de chemin retirées, aucune charge destructive exécutée.
- **SQL** : pas de SQL dynamique concaténé dans le schéma, pas d'injection SQL identifiée. RLS/revocations et `SECURITY DEFINER set search_path=''` visibles dans le fichier. Les casts d'entrées invalides pouvaient divulguer des erreurs PostgreSQL ; retour métier prévu dans la nouvelle définition locale, à tester en staging.
- **Secrets** : aucun secret privé découvert dans les fichiers examinés ; aucune valeur de code de compte ou donnée personnelle copiée dans le rapport. Le code de reprise est un jeton porteur de 100 bits généré avec Crypto ; SHA-256 adapté à un secret aléatoire, pas à un mot de passe humain.
- **Stockage** : code de compte en clair dans `localStorage` par conception (nécessaire à la synchro). Un script malveillant de même origine pourrait le lire ; CSP réduit la surface sans chiffrer le navigateur. Les sauvegardes ne sont pas une frontière anti-triche. Aucun changement irréversible de format effectué.
- **Réseau/CORS** : API HTTPS autorisées, pas de proxy ouvert ni de CORS serveur modifié ; aucune permission caméra/micro/géolocalisation nécessaire. En-têtes de restriction Vercel configurés, non déployés. Pas de ressources runtime sur CDN.
- **Réponses externes** : validation du schéma, bornes et timeout ; cache météo à âge signalé, fallback neutre. Cache de classement filtré. Worker limité à l'origine et aux fichiers publics.
- **Confidentialité** : correction de l'affirmation erronée « code jamais renvoyé » : il est envoyé dans les corps HTTPS des RPC d'authentification/sauvegarde/suppression, tandis que le serveur ne stocke que le haché. Pas d'affirmation globale « aucune donnée personnelle » avec compte/IP.
- **Dépendances** : unique moteur local, aucun arbre npm à auditer. SHA-256 Phaser local `e92ddef111ba42e92d316979c732311757093688ea1810591cb7aa2858eba7a7`, identique au fichier officiel `phaserjs/phaser/v3.90.0/dist/phaser.min.js` récupéré pendant la revue. Recherche publique Snyk : aucune vulnérabilité directe répertoriée pour cette version consultée ; cela ne prouve pas l'absence de vulnérabilité. Phaser 3 est ancien face à Phaser 4, mais aucune migration de préférence n'a été faite.

## 6. Performance, rendu et UX

Le runtime JS représente environ **3,67 Mo non compressés**, dont ~1,15 Mo de moteur ; l'essentiel du reste est constitué de matrices de sprites, pas de photographies lourdes. Assets classiques ~164 Ko. Les textures et animations sont précalculées au boot ; 447 sprites plus leurs frames chargés d'un coup peuvent peser davantage en GPU que leur taille texte ne le suggère. Pas de streaming d'assets nécessaire à ce stade, mais mesurer sur le téléphone d'exposition avant d'ajouter neuf familles d'ennemis.

Les niveaux étaient déjà découpés à 2048 px, la carte ne l'était pas : correction apportée. Pas de collider créé dans la boucle principale. Pluie plafonnée à 170 particules et mouvement réduit ; reconstruction petite (1536 cellules au Jardin), redessin événementiel. Pas de preuve de fuite mémoire après comparaison de heaps effectuée, donc aucune promesse « zéro fuite ». Les warnings Chromium `willReadFrequently` viennent du rendu canvas Phaser ; ne pas modifier le vendor pour les faire taire. Aucun benchmark de FPS soutenus sur mobile ni profil GPU réalisé.

Direction artistique cohérente et légère, contraste des panneaux globalement lisible ; les sprite-palettes et certains verts diffèrent de la palette UI, mais sans rupture majeure. Les montagnes génériques du Jardin évoquent un décor de plateforme plus qu'un paysage nantais : arbitrage créatif futur, non modifié ici. Le HUD reste encombrant en haut à gauche ; aides et panneaux restent parfois trop longs pour un écran tactile réduit. La page SOURCE → RÈGLE a été inspectée visuellement dans un cadre 1920×1080 ; capture `docs/screenshots/audit-grammaire.png`.

## 7. Game design et amélioration patrimoniale

Le jeu possédait déjà de bonnes bases de sensation : accélération, saut variable, coyote/buffer, hitbox resserrée, respawn généreux, feedback de collecte et annonce météo. Aucun besoin d'ajouter un double saut global qui invaliderait tous les parcours. La correction des lanternes et des états de pause améliore la confiance ; la reprise évite la perte de motivation après interruption.

La variété réelle est concentrée dans trois niveaux : croissance/ronces au Jardin, verticalité/colonnes/eau à la Cathédrale, seuils/herses/flèches au Château. Les dangers sont déterministes, pas des ennemis intelligents. Le changement de météo est réel mais global (même à l'intérieur), et la direction des tonneaux n'est pas modulée finement par le vent.

La reconstruction est gratifiante mais sémantiquement faible : elle recolore des groupes triés et ne restitue pas encore des éléments architecturaux annotés. L'ordre `fortification` spécialise le Château en assise, région centrale, côtés ; **ce n'est ni une photo du Château, ni un crénelage généré, ni une segmentation automatique de monument**. Les trois fiches expliquent maintenant leur règle. Le Château reste la source principale déjà choisie dans les premiers documents, les onze autres lieux deviennent un corpus secondaire ; les 12 étapes n'ont pas été supprimées.

Descriptions des 12 lieux, rythme, ennemis/obstacles livrés versus proposés, trois récompenses finales originales, difficultés et estimations : `GAME_DESIGN.md` et `ROADMAP.md`. Priorité à l'atlas culturel, aux fragments liés à des travées et à une lanterne de lecture, pas à l'empilement de boss. Le Mémorial doit être traité comme espace de mémoire contextualisé, non automatiquement comme une course chronométrée.

## 8. Validation réellement exécutée

| Vérification | Résultat et limites |
|---|---|
| Installation / build | aucun build/package à installer ; serveur Python local lancé ; scripts chargés dans Chromium |
| `node --test tests/*.test.js` | **17/17** réussis ; mocks réseau ; toutes les sources JS runtime parsées et assets vérifiés |
| `node tools/compare-figma.js` | **285/285** cellules identiques, régression visuelle non détectée ; ne valide pas les droits |
| `GP.runBrowserTests()` | **24/24** contrôles réussis avec vrai Phaser : intro/avatar/carte/fiche, sol/saut, collecte idempotente, lanterne, reprise, mort, pause/aide/réentrée, météo alternée, image/résultat/carte, déblocage, résultats des 3 lieux, relecture sauvegarde, carte découpée |
| Géométrie pluie/vent/neige | **9 diagnostics**, 32 Jardin +22 Cathédrale +26 Château =80 fragments par météo, **aucun inaccessible détecté** ; dangers neutralisés, points de départ téléportés, pas un playthrough humain |
| API réelle | Open-Meteo `source:'live'` observée sur la carte ; pas de test d'écriture Supabase réel |
| API indisponible / valeurs invalides | HTTP 503, rejet réseau, JSON incomplet/null/types incorrects/cache corrompu/délai dépassé testés via mocks ; stale/fallback attendus |
| Offline applicatif | installation contrôlée, **56 ressources locales**, police incluse, zéro réponse externe/Supabase en cache ; serveur local arrêté, rechargement réussi ; appels fetch ensuite rejetés, reprise puis second fragment collecté et sauvegardé, météo stale |
| Refresh et retour | vrai reload du navigateur après arrêt serveur : 1 fragment restauré, puis 2 acquis ; reprise de scène et relecture des 3 résultats dans le runner |
| Clavier | vraies touches Échap/Entrée : pause/reprise ; dialogue compte : Shift+Tab boucle sur Retour, Tab revient au pseudo, Échap ferme et libère la capture |
| Tactile | pression/relâchement **synthétiques** sur boutons, lectures de commandes correctes ; aucun essai physique multitouch/iOS/Android effectué |
| Responsive | iframe de viewport interne **1920×1080** : jeu 480×270 ; **844×390** : 584×270, canvas CSS ~843,56×390 ; inspection visuelle de médiation ; ce n'est pas un test de moniteur plein écran ou de navigateur mobile réel |
| Console | aucune exception applicative non interceptée ni violation CSP constatée sur les scénarios réussis ; warnings Canvas2D ; le cadre de test seul a demandé un favicon absent, sans effet sur le jeu |
| SQL / hébergement | inspection statique seulement, pas de PostgreSQL, pas d'application des headers Vercel en production |
| `file://`, Safari, Firefox, téléphones réels | **non exécutés** pendant cet audit ; compatibilité par conception non assimilée à une validation |
| Fin des 12 niveaux | **impossible à tester** : neuf niveaux absents ; aucun succès inventé |
| Test croisé et soutenance | non effectués : doivent impliquer les étudiants et un autre groupe |

Les premiers essais d'intégration ont exposé un mélange de ressources anciennes dans le cache du navigateur de test ; ils ont été relancés sur une origine neuve. Ces échecs de harnais ne sont pas présentés comme des bugs corrigés du jeu. Procédures reproductibles : `tests/README.md`.

## 9. Fichiers modifiés : pourquoi

- **Persistance/gameplay** : `js/systems/SaveManager.js`, `ProgressionManager.js`, `Stars.js`, `js/scenes/GameScene.js` — validation, reprise, records cohérents, checkpoints, météo concurrente, pause et collecte.
- **Réseau/compte/contrôles** : `WeatherManager.js`, `Cloud.js`, `Account.js`, `Controls.js`, `Settings.js`, `Ui.js` — frontières d'entrée, timeout/concurrence, clavier/manette/touch et focus.
- **Patrimoine/UI/rendu** : `PixelCollection.js`, `MapArt.js`, `LevelArt.js`, `I18n.js`, `js/scenes/MapScene.js`, `MenuScene.js`, `js/data/levels.js`, `locations.js`, `lang/fr.js`, `lang/en.js` — ordre du Château, médiation/traductions/crédits, textures compatibles, notice précisée.
- **Infrastructure/accessibilité** : `index.html`, `js/main.js`, `css/style.css`, `css/game.css`, `vercel.json`, nouveau `sw.js` — copie offline, CSP, instructions/focus/zoom.
- **Outils/tests** : `tools/import-sprites.js`, nouveau `tools/lib/sprite-input.js`, `tests/core.test.js`, `tools/browser-tests.js`, `tools/geometry-tests.js`, `tools/exposure.html/js` et `tests/README.md` — import sûr et tests reproductibles.
- **SQL** : `supabase/schema.sql`, `supabase/README.md` — durcissement préparé uniquement ; aucun changement distant.
- **Documentation** : cinq documents racine demandés, `CREDITS.md`, sources/grammaire/fiche-source/conception/confidentialité/carnet de bord, capture de médiation ; métadonnées et cartel pédagogiques ajoutés sans confondre avec le manifeste PWA.

## 10. Conformité pédagogique et livrables

Chaîne explicitée : **source réelle Château → relations masse/seuil/élévation → primitives et régions → tri/groupes + mécanismes → collecte/météo → reconstruction/jeu**. Au moins trois paramètres opérants démontrés, feedback et fallback. API optionnelle selon le cours ; p5.js n'est pas imposé comme remplacement de Phaser. Source principale unique et variations secondaires constituent **notre interprétation cohérente du projet**, pas une obligation de conserver 12 lieux prescrite par le cours.

Le travail reste partiel sur la précision du relevé patrimonial et la génération depuis une règle observée. Le test croisé étudiant, les contributions individuelles détaillées, les PDF/diagrammes de source, la captation finale et la défense orale restent à produire. `manifest.webmanifest` est l'installation navigateur ; le nouveau `manifest.json` est le livrable pédagogique, distinct. Le cartel décrit le prototype à trois étapes, pas une campagne achevée.

## 11. État final et appréciation

Prototype stabilisé, architecture conservée, aucun blocage connu dans les scénarios exécutés, aucun risque critique confirmé laissé sans traitement dans le code examiné. **Ne pas traduire cela par « jeu complet » ou « service production sécurisé ».** Il reste neuf niveaux, une fin, la validation humaine et juridique, et du durcissement serveur.

Appréciation indicative du projet commun, inspirée de la grille réelle du cours : recherche/provenance **6/10**, grammaire/concept **10/15**, prototype **12/15**, data/interaction **8/10**, design/expérience **8/10**, processus/tests/documentation **7/10** = **51/70**, soit environ **73/100 ramené à la seule qualité du projet**. Les 30 points individuels ne sont pas évaluables par cet audit : ni maîtrise orale ni contributions personnelles ne sont déductibles de ces seuls fichiers.

Lecture par dimension (indicateurs qualitatifs, pas deuxième barème officiel) : technique **82/100**, gameplay **65/100**, artistique **78/100**, cohérence patrimoniale **60/100**, mapping **80/100**, robustesse/documentation **78/100**. Le socle est sérieux ; le potentiel artistique et culturel reste supérieur à sa réalisation effective.

**Les cinq suites les plus rentables** : (1) relevé annoté + test croisé silencieux ; (2) droits et préflight matériel/serveur ; (3) lanterne de lecture + réglage de difficulté ; (4) atlas culturel et fragments sémantiques ; (5) une vraie tranche Feydeau avant extension du reste du parcours.

## 12. Complément — passe de finition UX/UI

La passe suivante conserve les corrections et les données de l'audit non commité. Elle livre : `Prompts` (périphérique/commandes centralisés), adaptation du livre/tutoriels/menus/dialogues, retarget immédiat de la carte via `MapTravel`, herbe/chemin/terre suivant le même profil par bandes de 1 px, HUD/contexte/météo compacts et boutons résultat/classement alignés en format large. Aucun nouveau niveau ni nouvelle mécanique patrimoniale, aucune migration.

Résultats : **28 tests Node**, **97 assertions de polish dans chacun des formats 1920×1080, 1366×768, 844×390** (dont 50 inversions rapides), **24 contrôles de régression**, avatar **285/285**, neuf diagnostics géométriques sans fragment inaccessible détecté. Clavier DOM et API manette simulés ; exports Phaser inspectés, pas de test matériel ni de capture desktop réussie pendant cette passe. Détail, inventaire et limites : [docs/UX_POLISH.md](docs/UX_POLISH.md). Bilan des évolutions à valider avant implémentation : [docs/GAMEPLAY_UPGRADES.md](docs/GAMEPLAY_UPGRADES.md).

Le risque R07 est partiellement traité : aides réaffectables et HUD moins encombrant ; le canvas reste non équivalent pour les lecteurs d'écran. L'âge météo n'est plus affiché en troisième ligne : le secours est signalé par NEUTRE et HORS LIGNE, tandis que provenance et date restent dans l'état. Les captures historiques précédentes restent des traces, pas l'état visuel le plus récent.
