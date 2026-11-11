# Green Path — bilan gameplay après polish

Ce document conserve les propositions de la passe UX/UI. **Actualisation : seuls le protocole/relevé de test silencieux, la configuration d'équilibrage et la météo abritée ont été autorisés et implémentés lors du lot suivant.** Aucun playtest humain n'est revendiqué et les valeurs physiques/temps cibles restent inchangés. Voir [PLAYTEST_REPORT.md](PLAYTEST_REPORT.md) et [WEATHER_SHELTERS.md](WEATHER_SHELTERS.md). Les autres propositions restent non livrées. Références : `AUDIT.md`, `GAME_DESIGN.md`, `HERITAGE_GRAMMAR.md`, `ROADMAP.md`. Estimations historiques en jours-personne (6–7 h), hors attente documentaire ou juridique.

## Diagnostic réévalué

- **Déplacement** : le saut variable, le coyote time et le buffer constituent déjà un bon socle. Le sélecteur est maintenant réversible ; ajouter un dash universel détruirait les marges des parcours sans apporter nécessairement une relation au patrimoine.
- **Rythme/difficulté** : les trois niveaux ont un vocabulaire différent, mais la Cathédrale introduit plusieurs verbes à la fois. Les temps cibles ne sont pas validés par un panel de joueurs. Corriger la compréhension avant de durcir les sauts.
- **Collecte** : chaque fragment a un effet visible et la reprise évite la perte de travail. En revanche, la collecte exhaustive rend le dernier fragment raté coûteux et la relation fragment/élément architectural reste faible.
- **Progression** : étoiles et coloration de la carte fonctionnent. Il manque une archive durable qui relie ces récompenses à une découverte culturelle. Neuf niveaux et la récompense finale n'existent toujours pas.
- **Météo** : effets perceptibles et bornés ; le lot suivant a remplacé l'application uniforme par quatre zones justifiées dans les décors existants (deux passages Château, deux auvents Jardin). La Cathédrale reste sans zone abritée faute de couverture validée.
- **Patrimoine** : la grammaire du Château est explicite mais encore approximative, et les terrains restent composés à la main. Les nouvelles mécaniques devraient traduire une relation observée, pas recevoir un simple nom de monument.
- **Expérience** : les indications adaptatives et les fiches compactes réduisent la friction. Le reste de la valeur viendra du playtest, de la découverte et des récompenses, pas d'un empilement de systèmes.

## P0 — avant exposition

| Proposition / fonctionnement | Intérêt joueur | Intérêt pédagogique | Intérêt artistique | Difficulté / temps |
|---|---|---|---|---|
| **Test silencieux + réglage** : 3–5 joueurs, observer 30–60 s sans explication puis un niveau ; ajuster panneaux, temps cibles et checkpoints à partir des hésitations | apprentissage plus fluide, objectifs réalistes | preuve de test croisé et itération, encore à produire par les étudiants | préserver les moments de respiration et la lisibilité du décor | faible ; 0,5–1 j |
| **Relevé de la source principale** : 5–10 détails annotés du Château, invariants/variables, comparaison avec le masque actuel | comprendre ce que l'image révèle | rendre source → règle vérifiable, sans inventer des mesures | donner un vocabulaire singulier aux formes du jeu | documentaire ; 0,5–1 j |
| **Préflight droits/matériel/serveur** : provenance avatar, essais manette/téléphone réels, droits des futures images, limitation de débit et staging SQL après autorisation | confiance, aucune mauvaise surprise d'exposition | archive honnête et contraintes comprises | diffusion maîtrisée des créations et des œuvres citées | moyenne ; 1–2 j + vérifications externes |

## P1 — meilleur rapport valeur / coût

| Proposition / fonctionnement | Intérêt joueur | Intérêt pédagogique | Intérêt artistique | Difficulté / temps |
|---|---|---|---|---|
| **Lanterne de lecture** : en approchant d'une lanterne, montrer les fragments restants dans les zones qui l'entourent et un détail de structure ; aucune flèche permanente | limite le ratissage et propose un objectif intermédiaire | fait lire l'espace par zones et relations | petit diagramme du lieu, intégré à l'identité des lanternes | faible/moyenne ; 1–1,5 j |
| **Atlas culturel des monuments** : galerie persistante des images terminées, source, licence, règle et détail observé ; comparaison photo/traduction seulement si les droits sont validés | récompense consultable et motivation à continuer | conserve la chaîne de transformation et les sources | un musée de mosaïques nantaises plutôt qu'une simple liste de scores | moyenne ; 2–3 j pour les trois lieux, hors nouvelles photos |
| **Un fragment, une région architecturale** : chaque collectible identifie un groupe annoté (assise, ouverture, tour) ; la région correspondante apparaît avec une animation courte et son nom | la collecte devient signifiante et plus satisfaisante | observation → segmentation → ordre algorithmique explicable | révèle la logique constructive de l'image | moyenne ; 1–2 j par source, annotation comprise |
| **Météo abritée** : zones de niveau déclarées intérieur/extérieur ; contrôle sec dans la nef ou sous verrière, pluie visible dehors et ruissellement aux limites | peut lire l'espace et choisir un itinéraire stratégique | donnée → matière → transformation cohérente, trois paramètres bornés | ambiance distincte sans surcharger l'écran | moyenne ; 1–2 j pour les niveaux existants |
| **Une tranche patrimoniale suivante** : réaliser Feydeau en trois séquences courtes (apprentissage sûr, variation, combinaison), avec trame de façade et balcons décalés | vraie nouveauté après les trois premières étapes | une règle observée, testée avant de la généraliser | identité urbaine propre, pas un Bouffay simplement renommé | moyenne ; 2–4 j + documentation |
| **Mode découverte à discuter** : pas de pression de chrono, aides de zones facultatives, sons non indispensables ; conserver les résultats normaux et distinguer l'assistance | ouvre le jeu à plus de visiteurs | accessibilité et mapping compréhensible | une temporalité contemplative compatible avec le patrimoine | moyenne ; 1–2 j ; validation du traitement des scores requise |

## P2 — approfondir la progression et la signature

| Proposition / fonctionnement | Intérêt joueur | Intérêt pédagogique | Intérêt artistique | Difficulté / temps |
|---|---|---|---|---|
| **Carte de Nantes progressivement reconstruite** : conserver le sélecteur lisible ; dans l'atlas, une seconde vue fondée sur une source cartographique autorisée assemble les quartiers et relie les lieux terminés | voit une ville se compléter, pas seulement 12 badges | distinguer géographie réelle et rail ludique ; documenter les données | mosaïque territoriale liée à la ligne verte | moyenne/élevée ; 2–4 j + source/licence ; le rail actuel n'est pas une carte exacte |
| **Récompense finale générative** : après les 12 lieux, combiner leurs motifs en affiche avec seed, état météo, ordre de révélation et crédits intégrés ; export PNG local | trace personnelle du parcours, rejouabilité sans compte | invariants, variables, déterminisme et provenance démontrables | une œuvre issue des règles apprises, pas un écran « Félicitations » | moyenne ; 2–3 j pour l'outil, disponible après réalisation des lieux |
| **Micro-parcours de crénelage** : générer une courte séquence depuis un rythme plein/vide réellement relevé, avec contraintes de portée et seed reproductible | nouveau défi lisible propre au Château | transforme une observation en algorithme, pas en décoration | rythme architectural visible dans le terrain | moyenne ; 2–3 j après relevé |
| **Défis de mécanisme sans combat** : transmission/valves aux Machines, palan aux Chantiers, seuils au Hangar ; signaux anticipés et solution spatiale | objectifs variés, climax sans système d'attaque superflu | lire un mécanisme et le traduire en états | mouvements cohérents avec charpentes et structures | élevée ; 3–5 j par défi |
| **Secrets de lecture** : une branche optionnelle révèle ferronnerie, trame ou archive contextualisée ; ne pas y cacher un fragment obligatoire sans indice | exploration volontaire et découverte | observation des détails, citation documentée | enrichissement discret des environnements | moyenne ; 1–2 j par niveau |
| **Rejouer les conditions** : mode entraînement avec météo choisie et seed fixe, clairement séparé des observations live et des scores comparables | apprend une route et compare ses stratégies | expérimentation d'un paramètre à la fois | variantes d'une même grammaire, pas accumulation d'API | moyenne ; 1–2 j ; règles de classement à valider |

## P3 — recherche future

| Proposition / fonctionnement | Intérêt joueur | Intérêt pédagogique | Intérêt artistique | Difficulté / temps |
|---|---|---|---|---|
| **Promenade finale libérée** : parcours sans dangers, où les gestes déclenchent les grammaires apprises et leurs variations | prolongement apaisé après la complétion | comparaison source / interprétation / paramètre | jeu comme instrument de motifs | élevée ; 3–5 j après les niveaux |
| **Herbier génératif documenté** : dataset local d'arbres, distribution et espèces → familles de croissance ; API seulement si elle sert ce sujet | découvrir une autre lecture de Nantes | pertinence du dataset, normalisation et fallback | patrimoine vivant, variations organiques | élevée ; 3–5 j + recherche |
| **Fresque collective locale** : les visites ajoutent un motif à une composition commune, sans identité, avec reset explicite | voit une mémoire se construire à plusieurs | protocole, temporalité, intégrité des traces | œuvre collective d'exposition | élevée ; 4–6 j ; consentement et conservation à cadrer |

## Identité des neuf niveaux à développer : une règle forte chacun

Ces directions ne sont pas des annonces d'implémentation et demandent observation et validation. Réutiliser les briques du moteur, pas le même parcours rebadgé.

| Lieu | Relation patrimoniale à étudier | Mécanique dominante / environnement / météo | Priorité et prototype estimé |
|---|---|---|---|
| Feydeau | série de façades, ouvertures et balcons décalés ; contextualiser armateurs et traite | appuis en série à légère dérive ; pluie bornée, route basse sûre ; pas d'ennemi indispensable | P1 ; 2–4 j |
| Graslin | rythme du portique et perron | travées à franchir, seuils d'ombre et lumière ; rebond optionnel seulement s'il est justifié, pas des parasols partout | P2 ; 2–3 j |
| Machines | transmission du mouvement, bielles et charpentes | chaîne cinématique, vapeur annoncée, refroidissement ; défi de régulation sans copie non autorisée du Grand Éléphant | P2 ; 3–5 j |
| Chantiers | levage, portée et nœuds du treillis | palan déclenché par présence ; vent annoncé, points sûrs sur la structure | P2 ; 3–4 j |
| Anneaux | série, cadrage et perspective ; droits de l'œuvre à vérifier | impulsions directionnelles lisibles par forme/flèche et couleur ; brume laissant les repères lumineux visibles, aucun flash | P2 ; 3–4 j |
| Hangar | répétition des travées et circulation de l'entrepôt | conteneurs et portes synchronisés ; intérieur abrité ; préférer cette logique au boss de moisissure peu documenté | P2 ; 3–4 j |
| Mémorial | relation sol/verre/textes/Loire, mémoire de la traite et de l'abolition | marche, lecture et traces ; aucune violence ni mémoire punitive, pas de chronomètre serré ; contextualisation sensible prioritaire | P2 ; 2–4 j + revue documentaire |
| Pommeraye | trois strates, escaliers, verrière et balustrades | circulation entre galeries, lumière filtrée, pluie extérieure ; caméra verticale à prototyper avant niveau complet | P2 ; 3–5 j |
| Tour LU | signal vertical, strates et coupole | synthèse courte de règles maîtrisées puis composition finale ; ne pas inventer l'intérieur historique pour justifier une soufflerie | P2 ; 3–5 j |

## Recommandation de décision

**État après décision utilisateur :** protocole/relevé silencieux et météo abritée livrés localement ; réaliser maintenant les tests humains puis décider des réglages. Lanterne de lecture, atlas, régions architecturales, nouveaux niveaux et récompense finale restent à autoriser séparément. Aucun de ces éléments n'a été implémenté automatiquement.

Pas de nouveau système d'ennemis intelligents ou de boss par défaut : leur intérêt doit dépasser celui d'un mécanisme patrimonial lisible et justifier le coût d'assets, d'équilibrage et de tests.
