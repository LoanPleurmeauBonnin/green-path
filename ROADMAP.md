# Green Path — roadmap priorisée

État : 10 novembre 2026, après corrections locales. Estimations en **jours-personne de 6–7 h**, incluant développement et tests, hors attente de droits. Il ne s'agit ni d'un engagement ni d'une exigence du cours. Les ajouts majeurs restent à valider avec l'équipe.

**Actualisation après polish et corrections** : contrôles adaptatifs, pentes/inversion/piédestaux, rubriques À propos, Options et centrage livrés (`docs/UX_POLISH.md`). Météo abritée implémentée sur quatre zones existantes (`docs/WEATHER_SHELTERS.md`) ; protocole et instrumentation locale prêts, valeurs physiques conservées en attendant de vrais testeurs (`docs/PLAYTEST_REPORT.md`). Le [bilan gameplay](docs/GAMEPLAY_UPGRADES.md) conserve les autres propositions : atlas, fragments sémantiques, lanterne de lecture et fin générative ne sont pas livrés et demandent autorisation.

## P0 — exposer honnêtement et en sécurité

| Action / concept | Fonctionnement, intérêt joueur et lien au patrimoine | Difficulté / estimation | Validation |
|---|---|---|---|
| Vérifier les droits de l'avatar | prouver l'origine Figma et l'autorisation de la référence Adobe Stock, ou décider ensemble d'une création originale ; évite une diffusion juridiquement fragile | documentaire, 0,5–1 j hors délai externe | accord avant tout remplacement visuel |
| Relevé du Château + test croisé | 5–10 détails annotés, 3 paramètres comparés ; 30–60 s sans consigne orale, 3 observations, une correction ; rend source → système défendable | faible, 0,5–1 j | **à faire par les étudiants** |
| Sécuriser le service public | vérifier RLS réelle, tester la définition renforcée de `gp_save` en staging, point d'entrée limité en débit contre inscriptions abusives ; aucune gêne en mode invité | moyenne, 1–2 j | autorisation avant migration/déploiement ; ne pas rejouer le schéma complet |
| Préflight matériel et archive | vrais Safari/iOS/Android, clavier/touch, mode avion après installation, ouverture directe des fichiers ; produire manifest, cartel, captation et contributions individuelles | faible, 0,5–1 j | export final et démonstration ; aucune vidéo inventée |
| Régler la difficulté | 3–5 joueurs, observer les sauts et les retours pour fragment oublié ; ajuster `parTime`, checkpoints et panneaux | faible, 0,5–1 j | garder une version avant/après |

## P1 — forte valeur ajoutée, propre à Green Path

| Upgrade | Fonctionnement / intérêt / patrimoine | Difficulté / estimation |
|---|---|---|
| **Atlas des mémoires** | galerie des images terminées, source et licence visibles, comparaison avant/après quand la photo originale est autorisée ; donne une récompense culturelle durable à la collecte | moyenne, 2–3 j ; sans nouveau réseau |
| **Un fragment, une travée** | associer chaque collectible à une région documentée (mur, ouverture, tour) et animer cette région ; le joueur comprend *ce qu'il reconstruit*, non seulement un pourcentage | moyenne, 1–2 j par source, annotation comprise |
| **Lanterne de lecture** | à une lanterne, montrer fragments restants par zone et un détail de structure ; pas de flèche permanente ; limite les retours frustrants sans supprimer l'exploration | faible/moyenne, 1 j |
| **Micro-parcours de crénelage** | courtine générée à partir d'une alternance mesurée merlon/ouverture, seed stable, plateformes avec marges sûres ; transforme une propriété réelle en règle jouable | moyenne, 2–3 j après relevé ; ne pas générer aléatoirement les sauts obligatoires |
| **Feydeau, prototype complet** | une séquence de façades en série + balcon mobile ; reprendre la technique de Bouffay en dessinant une identité adaptée ; débloque la suite sans tricher sur le lieu | moyenne, 2–4 j avec tests ; contextualiser armateurs/traite |
| **Météo abritée — livrée localement** | deux passages Château et deux auvents Jardin, coefficients indépendants, masque spatial et transition ; aucune verrière inventée | recette automatisée effectuée ; perception à vérifier avec des humains |
| **Modes d'exposition** | mouvement réduit cohérent, pause automatique au focus perdu, mode découverte sans pression de chrono ; facilite la prise en main au clavier/touch | moyenne, 1–2 j ; scores distincts si assistance change la difficulté |

## P2 — enrichir après stabilisation

| Upgrade | Fonctionnement / intérêt / patrimoine | Difficulté / estimation |
|---|---|---|
| Défis de mécanisme sans combat | Machines : réguler trois valves reliées par une transmission lisible ; Chantiers : conduire un palan ; donne un objectif spatial plutôt qu'un boss générique | élevée, 3–5 j chacun ; provenance/droits à traiter |
| Archives de détail et secrets | chemin optionnel donne un motif de ferronnerie ou une relation structurelle, pas un fragment obligatoire caché ; stimule l'observation plutôt que le ratissage | moyenne, 1–2 j par niveau |
| Anneaux de cadrage | impulsions de direction indiquées aussi par des flèches ; plusieurs cadres révèlent des détails du quai ; nouvelle sensation de flow justifiée par la perspective | élevée, 3–4 j ; aucun flash et droits de l'œuvre vérifiés |
| Pommeraye à trois strates | paliers reliés par escaliers/galeries ; caméra verticale et bascule entre strates visibles ; structure réelle devient carte de circulation | élevée, 3–5 j ; changement du moteur à expliquer avant travaux |
| Mémorial, promenade de traces | lecture accessible, lumière sur des empreintes, chemin sûr, retour volontaire aux textes ; récompense la compréhension sans transformer une mémoire sensible en course punitive | moyenne, 2–4 j + revue documentaire et sensible |
| Fin « carte sensible » | météo, seed et monuments obtenus produisent une affiche exportable avec attributions ; valorise une archive générative personnelle, sans compte obligatoire | moyenne, 2–3 j |

## P3 — expérimentations, pas nécessaires au diplôme

| Piste | Fonctionnement / valeur / patrimoine | Difficulté / estimation |
|---|---|---|
| Herbier génératif local | échantillon de patrimoine arboré documenté, espèce/distribution → motifs de croissance ; ajouter Nantes Open Data seulement si le relevé botanique devient le sujet | élevée, 3–5 j ; dataset local obligatoire |
| Promenade finale sans danger | jouer librement les 12 grammaires comme un instrument visuel, puis archiver une variation ; récompense différente de la victoire classique | élevée, 3–5 j après les niveaux |
| Défi collectif d'exposition | plusieurs visiteurs contribuent à une fresque locale persistante, sans identité ; explore une mémoire partagée | élevée, 4–6 j ; protocole de reset, consentement et conservation à définir |

## Ce qui a déjà été livré dans cette intervention

Validation des sauvegardes et réponses externes, import sans exécution JS, CSP/en-têtes, gestion des états de scène et de manette, reprise intra-niveau locale, copie hors ligne après première visite, grammaire de reconstruction du Château, médiation dans les fiches, crédits dans le jeu, découpage des textures de carte et tests reproductibles. Voir `AUDIT.md` : **les neuf futurs niveaux et les trois fins ci-dessus ne sont pas livrés**.

## Ordre conseillé pour la prochaine semaine

1. Relevé patrimonial + test silencieux.
2. Droits, sécurité serveur et préflight sur les appareils de l'exposition.
3. Lanterne de lecture et réglage des trois niveaux.
4. Atlas + régions de reconstruction annotées.
5. Une vraie tranche Feydeau, avant d'engager les huit autres niveaux.
