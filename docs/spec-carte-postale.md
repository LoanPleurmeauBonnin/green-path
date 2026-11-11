# Spec — Carte postale de fin de partie

**Projet :** Green Path — PATRIMOINE.EXE / Nantes 001
**Fonction :** le butin de fin de partie
**Priorité :** bonus, à faire après les 4 niveaux jouables et l'ordre d'apparition des pixels propre à chaque lieu
**Date limite :** avant le freeze du jeudi 12 novembre à midi

---

## 1. Le but

À la fin du jeu, le joueur reçoit une carte postale de Nantes reconstruite, à son nom, qu'il peut télécharger.

La carte est unique, car elle garde :

- l'avatar du joueur ;
- ses étoiles ;
- la date et la **météo réelle de Nantes** au moment où il a fini.

Exemple de phrase sur la carte :

> Nantes reconstruite le 12 novembre, sous un ciel couvert, 34 étoiles sur 36.

**Pourquoi c'est lié au projet :** la météo réelle de Nantes colore déjà l'ambiance du jeu. La carte garde la trace de ce lien : deux joueurs qui finissent à des moments différents n'ont pas la même carte.

---

## 2. Quand la carte apparaît

| Situation | Ce qui se passe |
|---|---|
| Tous les niveaux disponibles sont terminés | Écran de fin avec la carte et le bouton « Télécharger ma carte » |
| Version de jeudi (4 niveaux jouables) | Même écran, avec la phrase adaptée : « 4 lieux sur 12 reconstruits » |
| Le joueur revient plus tard | La carte peut être revue depuis le menu, avec la météo du moment où il a fini, pas celle du moment présent |

---

## 3. Ce qu'il y a sur la carte

### Format

- Paysage, **1800 × 1200 px**, en PNG. Ce format s'imprime en 15 × 10 cm à 300 dpi.
- Rendu en pixel art net : agrandissement par un nombre entier, sans lissage (`imageSmoothingEnabled = false` ou `noSmooth()`).

### Composition

```
┌──────────────────────────────────────────────┐
│  GREEN PATH · NANTES                [météo]  │
│                                              │
│      Illustration de Nantes reconstruite     │
│      (les monuments terminés, reliés         │
│       par la ligne verte)                    │
│                                   [avatar]   │
│                                              │
│  Nantes reconstruite le 12 novembre,         │
│  sous un ciel couvert, 34 étoiles sur 36.    │
│  [pseudo]                    ★ 34 / 36       │
└──────────────────────────────────────────────┘
```

| Élément | Contenu | Source dans le jeu |
|---|---|---|
| Titre | « GREEN PATH · NANTES » | Fixe |
| Illustration | Les monuments terminés, posés le long de la ligne verte | Niveaux terminés |
| Avatar | L'avatar personnalisé du joueur, à côté de la ligne verte | Écran « Personnaliser l'avatar » |
| Pictogramme météo | Soleil, nuages, pluie… en pixel art, avec la température | Météo au moment de la fin |
| Phrase | Voir la section 4 | Date, météo, étoiles |
| Étoiles | « ★ 34 / 36 » | 3 étoiles par niveau × nombre de niveaux |
| Pseudo | Facultatif, saisi par le joueur avant le téléchargement | Champ texte |

**Ciel de la carte :** sa couleur suit la même règle que l'ambiance du jeu, pour que la carte ressemble au moment où le joueur a fini.

---

## 4. La phrase

### Modèle

```
Nantes reconstruite le {date}, sous {ciel}, {étoiles} étoiles sur {total}.
```

- **{date} :** jour et mois en toutes lettres, en français, par exemple « 12 novembre ». En JavaScript : `date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })`.
- **{ciel} :** une expression tirée de la météo réelle, selon le tableau ci-dessous.
- **{étoiles} / {total} :** étoiles gagnées et étoiles possibles. Total = 3 × nombre de niveaux disponibles.

### Météo → mots

| Météo réelle | {ciel} |
|---|---|
| Ciel dégagé, le jour | un grand soleil |
| Ciel dégagé, la nuit | un ciel étoilé |
| Quelques nuages | un ciel voilé |
| Couvert | un ciel couvert |
| Brouillard | la brume |
| Pluie ou bruine | la pluie |
| Orage | l'orage |
| Neige | la neige |

### Cas particuliers

| Cas | Phrase affichée |
|---|---|
| Météo indisponible (pas d'Internet, API en panne) | « Nantes reconstruite le 12 novembre, 34 étoiles sur 36. » On ne mentionne pas la météo, pour ne pas en inventer une. |
| Version à 4 niveaux | « 4 lieux de Nantes reconstruits le 12 novembre, sous un ciel couvert, 11 étoiles sur 12. » |
| 1 seule étoile | « 1 étoile sur 36 », au singulier |

---

## 5. Le pseudo

- Champ facultatif juste avant le téléchargement : « Ton nom sur la carte (facultatif) ».
- 16 caractères maximum, lettres, chiffres, espaces et tirets.
- S'il est vide, la ligne du pseudo n'apparaît pas.
- **Rien n'est envoyé sur un serveur :** la carte est fabriquée dans le navigateur. Si le jeu sauvegarde la progression, le pseudo est gardé uniquement dans le navigateur du joueur.

---

## 6. Le téléchargement

- Bouton : **« Télécharger ma carte »**.
- La carte est dessinée sur un canvas caché de 1800 × 1200 px, puis téléchargée en PNG (`saveCanvas()` avec p5.js, ou `canvas.toBlob()` puis un lien de téléchargement).
- Nom du fichier : `green-path-nantes-2026-11-12.png`, avec la date de fin.
- Après le clic, message de confirmation : « Ta carte est téléchargée ! »
- Bouton secondaire : **« Rejouer »**.

---

## 7. Ce qu'il faut enregistrer à la fin de la partie

Au moment exact où le joueur termine le dernier niveau, on enregistre :

```js
const finDePartie = {
  date: "2026-11-12T10:42:00",   // date et heure de fin
  meteo: {
    disponible: true,            // false si la météo de secours était utilisée
    code: 3,                     // code météo renvoyé par l'API
    temperature: 14,
    estJour: true
  },
  etoiles: 34,
  total: 36,
  niveauxTermines: 12,
  pseudo: ""                     // rempli plus tard, avant le téléchargement
};
```

Si le joueur revoit sa carte plus tard, on utilise ces valeurs, pas la météo du moment.

---

## 8. Accessibilité

- Le bouton de téléchargement fonctionne au clavier (touche Entrée) et au clic.
- La phrase de la carte est aussi affichée en texte normal à l'écran, pas seulement dans l'image.
- Contraste suffisant entre le texte et le ciel de la carte : si le ciel est clair, le texte est foncé, et inversement.

---

## 9. Hors périmètre

- Pas d'impression depuis le jeu.
- Pas de partage direct sur les réseaux sociaux.
- Pas de compte joueur ni de serveur.
- L'illustration animée de fin et le passeport à tampons sont des fonctions séparées.

---

## 10. Critères de validation

- [ ] Après le dernier niveau, l'écran de fin affiche la carte et le bouton « Télécharger ma carte ».
- [ ] La carte téléchargée fait 1800 × 1200 px, en PNG net, sans flou.
- [ ] L'avatar sur la carte est celui que le joueur a personnalisé.
- [ ] La phrase contient la bonne date, la bonne météo et le bon nombre d'étoiles.
- [ ] Sans Internet, la carte se télécharge quand même, avec la phrase sans météo.
- [ ] Le pseudo apparaît s'il est rempli, et disparaît s'il est vide.
- [ ] Revoir la carte plus tard garde la météo du moment de la fin.
- [ ] Aucune erreur dans la console pendant la génération et le téléchargement.

---

## 11. Phrase pour l'oral

> « À la fin, le joueur repart avec une carte postale de Nantes reconstruite. Elle garde la météo réelle du moment où il a fini, donc chaque carte est unique, comme chaque passage sur la ligne verte. »
