# Contribuer à Green Path

Guide court pour modifier le jeu sans casser la chaîne **source → grammaire → système → œuvre** (voir [README.md](README.md)).

## Règles communes
- **Aucune donnée inventée.** Un fait patrimonial vient d'une source citée dans [docs/sources.md](docs/sources.md) ; ce qui est incertain va dans les docs, **jamais** à l'écran du jeu.
- **Aucun secret** dans le dépôt : la clé publique Supabase est dans `js/config.js`, jamais de clé `service_role` ni de fichier `.env`.
- Le jeu doit rester **jouable hors ligne**, sans compte, et s'ouvrir directement (`index.html` en `file://`) : scripts classiques sans modules, pas de CDN, pas de dépendance.
- **Accessibilité** : pas de flash, `prefers-reduced-motion` respecté, clavier + tactile + manette, jouable sans son.
- Tout texte ajouté dans le jeu est en français avec **sa traduction anglaise** dans `js/data/lang/en.js`.
- **Images** : Wikimedia Commons uniquement, licence relue sur la page `File:`, jamais téléchargée sans validation ; chaque image est ajoutée à [CREDITS.md](CREDITS.md) et à `docs/credits.json` (voir ci-dessous).

## Flux de travail
1. Une branche `feat/...` ou `fix/...` depuis `main` à jour ; une pull request vers `main`.
2. Avant chaque push : `node tools/smoke.cjs` (scripts, JSON, liens, secrets) et `node tools/verify-credits.cjs`. Ces deux contrôles tournent aussi en CI (`.github/workflows/smoke.yml`).
3. Après tout changement de fichiers servis : `node tools/bump-sw.cjs` (nouveau nom du cache hors ligne), puis déploiement sur Vercel avec l'accord de l'équipe.
4. Une ligne au carnet de bord ([docs/carnet-de-bord.md](docs/carnet-de-bord.md)) pour toute évolution notable, et mise à jour du README, de ses captures et de CREDITS.md.

## Ajouter une image patrimoniale
1. Choisir un fichier Commons, lire sa page, noter auteur, licence et lien.
2. Pixéliser (48×32, 16 couleurs) et placer le résultat dans `assets/locations/`.
3. Ajouter l'entrée dans `docs/credits.json` (auteur, licence, SHA-1 de l'original donné par l'API Commons, SHA-1 du fichier du jeu) et dans le tableau de [CREDITS.md](CREDITS.md) ; lancer `node tools/verify-credits.cjs --online`.

## Licence
Le code est sous licence MIT ([LICENSE](LICENSE)) ; les éléments tiers gardent leur licence (voir CREDITS.md).
