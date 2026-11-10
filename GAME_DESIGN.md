# Green Path — game design et état de réalisation

Version auditée le 10 novembre 2026. **3 lieux jouables, 1 prototype détaché, 9 lieux à développer.** Les 12 étapes restent l'objectif ; aucune fin de parcours sur 12 niveaux n'est actuellement livrée.

## Concept et boucle

Un gardien invite le joueur à rendre ses couleurs à Nantes en suivant une ligne verte stylisée. **Explorer → collecter → reconstruire → découvrir → débloquer.** Le patrimoine fournit des structures de déplacement ; la météo fait varier les conditions. La carte est un sélecteur linéaire, pas une carte géographique fidèle. L'ordre est celui du projet, non une numérotation officielle du Voyage à Nantes.

Identité conservée : pixels nets, bleu nuit `#14182e`, vert signature `#2fbf71`, touches jaunes, police locale Press Start 2P, avatar de trois quarts. Base 480×270, jusqu'à 640×270 selon l'écran. Les niveaux utilisent des tuiles de 16 px, un monde de 17 lignes et un suivi horizontal.

## Contrôles

Les indications suivent maintenant le dernier périphérique réellement utilisé, sans fermer l'écran ouvert. `GP.Prompts` partage les correspondances avec les entrées ; les tutoriels et le livre reflètent le remapping. Les commandes de menus sont distinctes des actions de jeu. Y ouvre l'aide, LB/RB feuillettent ; X anime l'avatar, rejoue au résultat ou coupe le son sur carte/en jeu. Les dialogues HTML se parcourent à la manette ; la saisie textuelle reste au clavier. Voir `docs/UX_POLISH.md`.

| Contexte | Commandes |
|---|---|
| Menus | ↑/↓ et Entrée ; clic/touch ; A de manette = une validation |
| Carte | ←/→ ou A/D ; Entrée/Espace : fiche/jouer ; H : aide ; Échap : fermer/menu |
| Déplacement | ←/→, Q/A et D ; touches réaffectables dans Options |
| Saut | Espace/W/Z, maintenir pour monter davantage ; ↑ saute hors d'une zone d'escalade |
| Escalade | ↑/↓ ; saut + direction pour quitter une colonne ; ↑/saut pour se hisser ; ↓ pour lâcher |
| Accroupi | ↓/S quand la capacité est active ; impossible de se relever sous un plafond |
| Pause | Échap ou Start ; aide, reprendre, quitter vers la carte |
| Tactile | directions, bas, saut, pause ; saut immobile près d'une colonne sert à grimper ; paysage requis |

Jeu compréhensible sans son. Le canvas ne propose pas une expérience équivalente pour une personne aveugle ; aucune conformité WCAG globale revendiquée.

## Sensation et collisions

- Vitesse cible 110 px/s ; accélération sol 1100, air 700 px/s² hors météo.
- Gravité 950 px/s² ; saut −320 px/s ; chute plafonnée à 420 px/s ; relâchement du saut : vitesse ascendante ×0,45.
- Coyote time 90 ms, tampon de saut 110 ms. Hitbox debout 8×16, accroupie 8×10.
- Sols solides via Tilemap Arcade ; plateformes à sens unique ; plateformes mobiles par corps immobiles non soumis à gravité.
- Pièges et collecte par intersections AABB dans `checkWorld`, pas par analyse des pixels du sprite.
- Ronces, pointes, flèches, gouttes, tonneaux, chute : mort, retour lanterne, fragments conservés ; invulnérabilité 1 s à transparence fixe, sans clignotement.
- Pas d'ennemi doté d'IA, d'attaque du joueur, de système de vie limitée ni de boss livré.

## Progression, fragments et sauvegarde

Un fragment n'est pas une cellule : il révèle un **groupe** de cellules du monument. Le Jardin possède 32 fragments pour 1536 cellules. Les images du Château et de la Cathédrale sont des sprites de remplacement. L'image se colore à chaque collecte ; un fragment ne peut être compté deux fois. Tous les fragments sont obligatoires pour finir : simple à comprendre, mais risque de retours en arrière fastidieux si l'on en rate un.

La réussite est enregistrée au résultat : prochain niveau développé débloqué, meilleurs pixels/taux/temps/morts conservés, monument coloré sur la carte, fiche culturelle consultable. Étoiles : image complète, zéro mort, sous `parTime`. Les records par critère peuvent provenir de parties différentes ; le total enregistré est cohérent avec ces records. Les temps cibles restent provisoires.

**Reprise locale ajoutée :** fragments acquis, ordre de reconstruction, temps, morts et dernière lanterne sont conservés aux événements importants, au départ, à la perte de focus et toutes les 5 s. Après refresh : retour au dernier point sûr, pas à une coordonnée en plein saut. Un changement de disposition des pixels/checkpoints invalide uniquement la reprise concernée, jamais les résultats des niveaux terminés. La reprise intra-niveau n'est pas synchronisée vers Supabase. Une interruption brutale peut perdre jusqu'à 5 s de chrono, pas un fragment déjà enregistré ; stockage bloqué = session mémoire seulement.

## Identité des 12 niveaux

Dans la table : **livré** décrit le code ; **proposé** est une intention à prototyper et tester, pas une fonctionnalité existante. Les ennemis envisagés dans `docs/niveaux.md` ne sont pas programmés.

| # / lieu / état | Mécanique, obstacles et rythme | Relation patrimoniale et visuelle | Météo / évolution recommandée |
|---|---|---|---|
| 1 Jardin — livré | 136 tuiles, 32 fragments, 3 lanternes ; saut variable, ronces, topiaire solide, pont | départ gare puis jardin, Palmarium ; révélation végétale | ronces de pluie et raccourcis fleuris au soleil ; améliorer l'explication « un fragment = un groupe » |
| 2 Cathédrale — livré | 120 tuiles, 22 fragments, 3 lanternes ; colonnes, accroche, corniches fragiles, gouttes | répétition des supports et verticalité ; pierre claire, nef de fond | pluie accélère les gouttes ; proposer des zones intérieures abritées plutôt que glisse uniforme |
| 3 Château — livré | 120 tuiles, 26 fragments, 3 lanternes ; accroupi sous flèches, herses, tonneaux, douves | seuil, enceinte, masses et élévations ; tuffeau stylisé, Grand Logis | vent accélère les tonneaux ; ordre d'image assise/centre/côtés ; ajouter un défi de cadence du crénelage fondé sur relevé |
| 4 Feydeau — proposé | balcons décalés et plateformes légèrement penchées ; pas d'ennemi nécessaire | trame de façade, série de fenêtres/mascarons ; contextualiser le patrimoine des armateurs | pluie : dérive bornée ; conserver route sûre ; réutiliser seulement la mécanique mobile de Bouffay après adaptation, sans renommer son décor |
| 5 Graslin — proposé | monter sur des modules de portique, alternance de travées ; rebond optionnel sur auvent | rythmes du portique et du perron, plutôt que parasols génériques omniprésents | lumière : mise en évidence de l'axe ; vent seulement en extérieur |
| 6 Machines — proposé | chaînes cinématiques simples, pistons porteurs ; défi de régulation sans combat | transmission du mouvement dans la structure bois/acier | pluie : refroidissement réduisant la durée de vapeur ; boss de valves uniquement après prototype et vérification des droits |
| 7 Chantiers — proposé | palan activé par présence, déplacement sur rail, pauses sur les nœuds du treillis | levage, portée et triangulation d'une grue | vent : oscillation bornée, trajectoire toujours atteignable ; vue de la structure progressivement révélée |
| 8 Anneaux — proposé | cadrages successifs et impulsions directionnelles ; direction indiquée par forme/flèche, pas seulement couleur | séries, perspective et encadrement du paysage | brume : anneaux repères lumineux ; pas de clignotement ni d'éclair stroboscopique |
| 9 Hangar — proposé | portes et conteneurs en cycles synchronisés ; observer avant de traverser | répétition des travées, circulation et mémoire logistique | intérieur abrité ; condensation visible ; priorité aux cycles lisibles avant un boss de moisissure, qui manque de justification documentaire |
| 10 Mémorial — proposé | déambulation, lecture, empreintes lumineuses ; zéro combat, chemin sûr, possibilité de relire | verre, sol, textes, mémoire ; sources institutionnelles et contextualisation indispensables | pluie révélant des traces ; supprimer l'enjeu de vitesse dans ce futur niveau **à décider avec l'équipe**, pas encore implémenté |
| 11 Pommeraye — proposé | parcours à trois strates, escaliers et balustrades, raccourcis de galerie | différence d'altitude et répétition des travées sous verrière | pluie extérieure seulement ; éviter de transformer tout le verre en piège mortel gratuit |
| 12 Tour LU — proposé | synthèse courte de 2–3 règles apprises, puis composition finale | strates verticales et signal urbain de la tour ; ne pas supposer de machines historiques dans son intérieur sans source | lumière et vent orchestrent la composition finale ; boss final non nécessaire pour donner du sens |

**Bouffay :** 110 tuiles, 21 fragments, plateformes mobiles et tonneaux définis dans `levels.js`, mais aucun `GP.LOCATIONS` associé. Prototype technique conservé, non présenté comme « niveau 4 jouable ». Aucune suppression ni modification arbitraire des 12 lieux.

## Météo : un système perceptible, pas une punition

Voir les valeurs et la chaîne donnée → paramètre → transformation → feedback dans `HERITAGE_GRAMMAR.md`. Dernière observation reçue gardée en cache et signalée périmée hors ligne ; sinon météo neutre. Requêtes à 5 minutes, délai 4 s, valeurs validées, aucun réseau nécessaire au moteur. Les neuf diagnostics géométriques pluie/vent/neige ne remplacent pas un test de traversée humaine avec tous les dangers actifs.

## Évaluation du rythme

**Points forts :** saut variable déjà soigné, checkpoints généreux, feedback immédiat, météo annoncée, nouveaux verbes à la Cathédrale et au Château ; carte réversible et HUD réduit après polish. **Faiblesses :** la Cathédrale cumule deux apprentissages avant le Château, dont l'accroupi est déjà autorisé ; chaque image demande une collecte exhaustive ; les temps cibles ne sont pas réglés par tests utilisateurs ; les niveaux sont tous des couloirs de 17 lignes malgré leur identité verticale. Les améliorations restantes sont réévaluées dans `docs/GAMEPLAY_UPGRADES.md` sans être implémentées par défaut.

Améliorations sûres à tester ensuite : indicateur discret du dernier fragment manquant ; plan de lecture « fragments restants par zone » à une lanterne ; zones abritées ; ordre d'image annoté et animation localisée. Ne pas ajouter dash/double-saut global avant de réévaluer tous les sauts existants.

## Objectif final : trois directions possibles (non implémentées)

1. **Atlas des douze mémoires (préféré)** : les 12 images deviennent les pages d'un musée ; les fragments collectés composent un panorama relié par la ligne verte. Chaque page montre source, règle et variation météo. Une archive, pas un simple écran de victoire.
2. **Carte sensible exportable** : le joueur choisit une seed, un état météo et un rythme de révélation ; ses monuments terminés engendrent une composition PNG avec crédits incorporés. Toujours possible hors ligne.
3. **Promenade libérée** : la ligne complète devient un parcours sans dangers, où les gestes déclenchent les grammaires apprises et où l'on compare les sources aux traductions. Le Mémorial reste sobre et contextualisé, sans effets festifs appliqués indistinctement.

L'introduction évoque déjà une illustration spéciale : **cette récompense n'existe pas encore**. Le futur choix de fin et toute refonte majeure du parcours nécessitent validation créative de l'équipe.
