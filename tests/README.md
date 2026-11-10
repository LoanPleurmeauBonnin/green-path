# Vérifier Green Path

Utiliser une **origine locale de test**, pas une partie personnelle. Les scripts d'intégration sauvegardent/restaurent la progression locale et neutralisent les écritures cloud, mais un environnement de test séparé reste préférable.

## Automatique, sans dépendance

```bash
node --test tests/*.test.js
node tools/compare-figma.js
python3 -m http.server 8123
```

La suite Node teste validation, repli mémoire, météo, cloud simulé, import sécurisé, intégrité des assets et mapping. Elle n'exécute pas de SQL et ne simule pas le moteur Phaser.

## Intégration dans Chromium

Ouvrir http://localhost:8123/?dev=1 puis, dans la console :

```js
var script = document.createElement('script');
script.src = 'tools/browser-tests.js';
script.onload = function () { console.table(GP.runBrowserTests()); };
document.head.appendChild(script);
```

Les tests pilotent les vraies scènes et la physique image par image. La collecte finale est contrôlée par script : elle valide reconstruction/transitions/sauvegarde, **pas** la capacité d'un humain à finir sans danger. Les horloges simulées sont rétablies en fin de test. Utiliser un rechargement forcé et/ou une nouvelle origine si des scripts anciens restent en cache.

Pour l'accessibilité géométrique des fragments, charger `tools/bot.js`, puis `tools/geometry-tests.js` de la même façon ; lancer `GP.runGeometryTest(index, sim)` : index 0 Jardin, 1 Cathédrale, 2 Château ; sim 2 pluie, 4 vent, 6 neige. `unreachable: []` signifie chaque fragment atteignable depuis une surface candidate. Le robot **téléporte**, ignore les morts et ne prouve pas une trajectoire complète avec obstacles.

## Offline réel

1. Sur une origine sans `?dev=1`, attendre `await GP.offlineReady` → `true`.
2. Vérifier DevTools → Application → Service Workers / Cache Storage : fichiers locaux seulement.
3. Arrêter le serveur local (ou mettre le navigateur hors ligne), puis recharger.
4. Nouvelle partie, collecte, résultat, rechargement : les ressources doivent provenir du service worker ; les API peuvent échouer sans bloquer le jeu.
5. Tester aussi cache météo absent, invalide et périmé. Les tests Node couvrent ces variantes par mocks ; conserver un essai manuel réseau réel.

La copie est propre au protocole/hôte/port et nécessite une visite préalable. Le service worker reste désactivé à l'installation en mode dev, mais une copie déjà active sur la même origine contrôle également les onglets dev : utiliser un autre port ou désinscrire ce worker dans DevTools pour éditer les fichiers.

## Responsive, clavier, tactile

- `tools/exposure.html?w=1920&h=1080` : iframe aux dimensions CSS internes 1920×1080 ; mise à l'échelle dans la fenêtre de test.
- `tools/exposure.html?w=844&h=390` : même principe pour paysage étroit.
- Ces cadres **n'émulent pas** le pointeur tactile, le navigateur mobile, l'encoche ni la densité de pixels d'un vrai appareil.
- Parcourir réellement les menus au clavier, réaffecter une touche, rejouer ; vérifier le dialogue de compte (Tab/Shift+Tab, Échap, consentement) avec réseau simulé, sans créer de compte réel inutile.
- Sur téléphone réel : portrait = pause ; paysage = reprise ; maintenir direction+saut avec deux doigts, puis sortir le doigt du bouton / changer d'application ; vérifier qu'aucune commande ne reste collée.

## Limites de certification

Aucun test automatisé ne remplace un test silencieux avec un autre groupe, une vérification de droits ou un audit de la base réellement déployée. Les critères de fin des 12 niveaux ne sont pas testables tant que neuf niveaux n'existent pas.

## Recette du polish UX/UI

Charger `tools/polish-tests.js` sur une origine locale dédiée en `?dev=1`, comme `browser-tests.js`, puis exécuter :

```js
console.table(GP.runPolishTests());
```

Le runner utilise un état temporaire et les touches par défaut, teste ensuite un remapping, puis restaure les données/réglages originaux. **Ne pas lancer les recettes en parallèle dans plusieurs onglets de même origine** : ils partagent `localStorage`. Les contrôles clavier passent par des événements DOM synthétiques et la manette par une substitution temporaire de `navigator.getGamepads`, pas par du matériel physique.

Formats : `tools/exposure.html?w=1920&h=1080`, `?w=1366&h=768`, `?w=844&h=390`. Dans la console de l'iframe, charger le runner puis :

```js
await GP.capturePolishSheet();     // écrans principaux ; export PNG du rendu Phaser
await GP.capturePolishSheet(true); // avatar, résultat, clavier configurable et classement simulé
GP.captureSlopeSheet();           // tous les raccords des textures de carte
```

Ces exports sont assemblés depuis les pixels Phaser et ne capturent ni les barres du navigateur ni un appareil réel. Les données de classement et la météo des planches sont simulées, sans écriture cloud. Le détail de la recette et les planches inspectées se trouvent dans `docs/UX_POLISH.md`.

## Régressions, abris et test silencieux

Charger `tools/playtest.js`, puis `tools/regression-tests.js` sur l'origine locale dédiée en `?dev=1`. Dans la console du jeu (celle de l'iframe si le cadre est utilisé) :

```js
console.table(GP.runRegressionTests()); // 73 contrôles
await GP.captureRegressionSheet();     // 11 vues, export PNG
```

Exécuter séparément et séquentiellement les trois runners, jamais en parallèle sur la même origine. Leurs helpers transmettent explicitement `{}` pour ne pas hériter des anciennes données d'initialisation Phaser. Les données de progression, météo et API Gamepad temporaires sont restaurées en fin de recette.

Dernier passage : Node 39/39 ; pour chacun des trois formats, régression 73/73, polish 97/97, socle 24/24 ; neuf diagnostics géométriques sans fragment inaccessible. L'instrumentation locale n'est pas chargée en jeu public et ne transmet rien. Protocole humain et limites : [PLAYTEST_REPORT.md](../docs/PLAYTEST_REPORT.md). Architecture des abris : [WEATHER_SHELTERS.md](../docs/WEATHER_SHELTERS.md). Aucun playtest humain ni essai matériel n'a été réalisé par ces scripts.
