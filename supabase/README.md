# Supabase — comptes « pseudo seul », sauvegarde et classement

Projet `green-path` (région eu-west-3, Paris). Le jeu n'utilise **pas** Supabase Auth : pas d'e-mail, pas de mot de passe.
Chaque joueur qui le souhaite choisit un **pseudo** (3 à 16 caractères `A-Z a-z 0-9 _ -`) et reçoit un **code secret** de 20 caractères,
généré dans son navigateur (100 bits). Le serveur ne garde que le **haché SHA-256** du code ; le code sert de clé pour retrouver sa sauvegarde sur un autre appareil.

## Sécurité
- Les tables `profiles` et `progress` ont la RLS activée **sans aucune politique** et aucun droit pour `anon` : l'API publique ne peut ni les lire ni les écrire.
- Tout passe par cinq fonctions `SECURITY DEFINER` (`search_path` vide) : `gp_register`, `gp_login`, `gp_save`, `gp_scoreboard`, `gp_delete`. Seul `anon` peut les exécuter.
- `gp_save` ne dégrade jamais un résultat (meilleures étoiles, pixels, temps, moins de morts) et borne toutes les valeurs.
- Le classement n'expose que : rang, pseudo, étoiles, nombre de niveaux, temps cumulé.
- Conseillers Supabase (security) : 2 *INFO* « RLS sans politique » (voulu : aucun accès direct) et 5 *WARN* « fonction SECURITY DEFINER exécutable par anon » (voulu : c'est l'API du jeu).
- La clé publique (`sb_publishable_…`) est dans `js/config.js` : elle est faite pour être publique. **Aucune clé secrète (service_role) n'est utilisée ni stockée.**

## Éditeur de niveaux et de textures (migration 20261111)
`supabase/migrations/20261111_editor.sql` ajoute le rôle admin (`profiles.is_admin`), les tables fermées `gp_levels`, `gp_levels_history` (30 versions par niveau) et `gp_textures`, et huit fonctions : `gp_content_get` (lecture publique du contenu publié), `gp_admin_check`, `gp_level_save`, `gp_level_reset`, `gp_level_history`, `gp_level_history_get`, `gp_texture_save`, `gp_texture_delete`. **Chaque écriture revérifie le code secret d'un compte admin** (`gp_admin_id`) ; `gp_login` renvoie aussi `admin`. Donner le rôle : `update public.profiles set is_admin = true where lower(pseudo) = lower('MON_PSEUDO');` après avoir créé le compte dans le jeu. Le jeu valide tout contenu publié avant de l'appliquer (`GP.Content`) : un document invalide est ignoré. **Non appliquée sur le serveur au moment de l'écriture de cette note.**

## Limites connues
Classement de confiance, pas anti-triche (les résultats viennent du navigateur du joueur). Pas de limitation de débit ni de filtre de pseudos. Projet gratuit : mis en pause après environ une semaine d'inactivité (le jeu retombe alors en mode invité / hors ligne, sans erreur).

## Fichiers
`schema.sql` : le schéma de référence. **L'audit du 10 novembre a renforcé localement `gp_save`** (taille, identifiants de lieux, erreurs de conversion et annulation atomique). Ces changements n'ont **pas été exécutés sur le serveur**. Ne pas rejouer le schéma complet sur une base existante : après accord de l'équipe, préparer un `CREATE OR REPLACE FUNCTION public.gp_save…` à partir de cette définition et le tester sur une base de staging. Les tables et sauvegardes existantes ne sont pas migrées par ce travail.

Le serveur déployé n'a pas été réaudité par des écritures réelles pendant cette session. RLS et permissions ci-dessus sont constatées dans le schéma, pas certifiées en production. L'absence de limitation de débit reste un risque avant ouverture à grande audience : prévoir un point d'entrée serveur protégé, plutôt qu'une limitation côté navigateur contournable.
