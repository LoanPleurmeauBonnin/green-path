# Méthode de conception et de contrôle des niveaux

Issue des skills `level-design` et `platformer` (gamedev-skills/awesome-gamedev-agent-skills, installés dans `.claude/skills`, non versionnés), adaptée à Green Path. Un niveau n'est « fini » que s'il passe **toutes** les étapes.

1. **Mesurer le vrai joueur** (`js/data/tuning.js`, `docs/ressenti.md`) : saut 3,4 à 3,6 tuiles, portée ~5 tuiles à 110 px/s, corps 8×16 (accroupi 8×10), accroche à 7 px d'un rebord. Chaque écart obligatoire mesure au plus 0,7 de la portée ; les écarts à 0,95 sont des défis facultatifs.
2. **Blockout** : routes et plateformes en volumes simples avant tout décor. Un décor ne porte jamais de collision, une collision n'est jamais un décor (cause du niveau 2 : les montants de la porte étaient des murs).
3. **Contrôle de faisabilité** : `node tools/solvability.cjs [n°]` simule le joueur au pixel (course, chute, sauts, accroche, accroupi, colonnes, anneaux, parasols, plateformes mobiles) et dit si l'arrivée, chaque pixel et chaque lanterne sont atteignables, avec l'abscisse où le niveau est bloqué sinon. `tests/solvability.test.js` le lance sur chaque niveau. Limites : timing des pièges, ennemis, courants d'air et ancien moteur (Château) ne sont pas modélisés.
4. **Rythme en dents de scie** : mesuré par `node tools/balance.cjs` ; une zone de répit avant chaque pic, un pic plus haut que le précédent.
5. **Enseigner avant de tester** : une mécanique apparaît seule dans un endroit où l'échec ne coûte rien (fosse sèche, sol sûr dessous), se combine, puis se teste sous pression. Une mécanique nouvelle par niveau, reprise ensuite.
6. **Habiller en dernier** : textures, décors, signalétique (lumière, lignes de fuite, repères) ; refaire les contrôles 3 et 4 après toute modification de géométrie.
7. **Playtest humain** avec des questions précises (où étiez-vous perdu ? combien d'essais pour le saut le plus dur ?). Aucun contrôle automatique ne le remplace.

Les corrections de géométrie vivent dans `js/data/GZoneLevels.js` (tableau `REPAIRS`), jamais dans `gzones.js` (généré).
