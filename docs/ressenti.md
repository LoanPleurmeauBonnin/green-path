# Ressenti des déplacements — réglage `feel-1` (11 novembre 2026)

**Statut : réglage de conception, jamais joué par un autre humain que l'équipe.** Il vient du dossier d'analyse `REA/` (Hollow Knight et Celeste, hors dépôt) : Green Path avait déjà les tolérances de Celeste (coyote 90 ms, buffer 110 ms, contrôle aérien 0,64) ; ce réglage ajoute celles qui manquaient. Toutes les valeurs sont dans `js/data/tuning.js`, chacune se neutralise seule.

| Aide | Valeur | Effet |
|---|---|---|
| Demi-gravité à l'apex (`apexGravityMult`, `apexThreshold`) | × 0,7 sous 90 px/s, saut maintenu | +1,5 px de hauteur, +85 ms de temps en l'air, environ +0,6 tuile de portée |
| Coin de plafond (`headCorner`) | 4 px | la tête glisse de côté au lieu de buter ; vérifié : montée de 48 px (bloquée) à 52,8 px (apex complet) |
| Rebord frôlé (`ledgeAssist`) | 8 px | pieds à moins de 8 px sous un rebord, poussé contre le mur : on monte dessus (l'accroche prend le relais plus bas) |
| Saut depuis l'accroupi | — | le personnage se relève d'abord (s'il y a la place), puis saute |
| Hisser depuis l'accroche | — | en plus de ↑ et du saut : pousser de nouveau vers le mur après l'avoir relâché |

## Essayé et écarté
Conserver la vitesse d'une plateforme mobile au saut : sa part horizontale s'efface en 0,1 s (contrôle aérien) et sa part verticale ajoute jusqu'à 1,1 tuile aux sauts depuis un conteneur qui monte, ce qui casserait des niveaux.

## Garde-fous
`tests/feel.test.js` : valeurs d'origine inchangées ; le saut gagne au plus 8 px de hauteur et 1 tuile de portée par rapport à avant ; les aides restent plus petites que la zone morte de l'accroche.

## Limites
Aucun playtest humain ; les niveaux 7 à 12 n'ont pas été rejoués avec ce réglage. La portée un peu plus longue rend certains écarts de 5 tuiles franchissables sans anneau (niveau 8) : à surveiller.
