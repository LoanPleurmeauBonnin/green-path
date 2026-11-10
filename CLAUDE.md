# Green Path — consignes pour Claude

Projet noté (ESD Nantes B3, atelier PATRIMOINE.EXE / NANTES 001). **Gel fonctionnel : jeudi 12 novembre 2026 à midi.**
Équipe : Florine RACINE (UX/UI, game design), Loan PLEURMEAU (dev web, IA Ops).

## Conventions de code
- Phaser 3.90 local (`js/vendor/phaser.min.js`), JavaScript natif, **scripts classiques sans modules ES** (le jeu doit marcher en `file://`). Tout vit dans l'espace de noms global `GP`. L'ordre des `<script>` dans `index.html` compte ; les scènes sont listées dans `js/main.js`.
- Résolution de base **480×270**, agrandie sans lissage (`pixelArt: true`). Police Press Start 2P à 8 px, **jamais de `setScale` sur un texte** (flou).
- Pas de nouvelle dépendance, pas de CDN, pas de lecture réseau bloquante (la météo a un délai de 4 s et un secours).
- Style existant : `var`, fonctions courtes, commentaires en français. Code simple et explicable par l'équipe (notation individuelle).
- Visuels : planches de sprites (`js/data/sprites/*.js`, importées par `node tools/import-sprites.js`) transformées en textures par `GP.Sprites` ; le reste est dessiné par code (`GP.PixelArt`).

## Textes
- Interface en **français avec accents**, en majuscules dans le jeu.
- **Jamais « À VÉRIFIER » à l'écran** : les doutes historiques vont dans `docs/` (fiche-source, images-candidates), pas dans l'interface.
- L'ordre des 12 étapes n'est **pas** la numérotation officielle du Voyage à Nantes : le dire dans le README.

## Droits et images
- Images patrimoniales : **Wikimedia Commons uniquement**, licence relue sur la page `File:`, **jamais téléchargées sans validation de l'utilisateur**. Chaque image est documentée dans `CREDITS.md` et `docs/sources.md` (auteur, licence, lien, modifications). Pixéliser avec `tools/pixelize.swift`.
- Références visuelles fournies (captures de jeux, photos de repérage, planches avec filigrane) : inspiration seulement, rien n'est repris.

## Contraintes du cours
- L'évaluation ne dépend jamais du réseau : jeu jouable hors ligne, météo de secours, mode invité local.
- La météo doit avoir un effet justifié et perceptible, documenté dans `docs/grammaire.md` (≥ 3 paramètres opérants), avec secours.
- Livrables à tenir à jour : README (dont « Fallback / limites connues »), CREDITS, manifest, cartel, carnet de bord (`docs/carnet-de-bord.md`), déclaration d'usage de l'IA, test croisé documenté.
- Accessibilité : pas de flash, `prefers-reduced-motion` respecté, clavier + tactile, jouable sans son, réinitialisation possible.

## Règle de mise à jour
**À chaque évolution notable du jeu, mettre à jour `README.md` (fonctionnalités, captures `docs/screenshots/`, statut des niveaux) et `CREDITS.md`.**

## Tester
```bash
python3 -m http.server 8123
```
Puis http://localhost:8123 (ajouter `?dev=1` pour les raccourcis de test : W/N météo simulée, K tout ramasser). Vérifier aussi l'ouverture directe d'`index.html` en `file://`, la console sans erreur, un mobile en paysage (et l'écran « tournez votre téléphone » en portrait).
`node tools/compare-figma.js` contrôle l'avatar ; `tools/bot.js` (console) parcourt un niveau.

## Déploiement
Vercel, projet `green-path` (https://green-path-sepia.vercel.app). `.vercelignore` exclut `docs` et `tools`. **Ne déployer qu'avec l'accord de l'utilisateur** (`npx vercel --prod`). Ne jamais commiter ni pousser sans accord.
