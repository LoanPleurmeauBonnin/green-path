# Confidentialité et données personnelles (RGPD)

*Résumé d'information pour un projet pédagogique (ESD Nantes, atelier PATRIMOINE.EXE). Ce document informe ; ce n'est pas un avis juridique.*
Le même texte est lu dans le jeu : **CRÉDITS → CONFIDENTIALITÉ** ou **OPTIONS → CONFIDENTIALITÉ** (français et anglais, `js/data/lang/fr.js` et `en.js`).

## Responsable
L'équipe Green Path (Florine RACINE, Loan PLEURMEAU). Questions et demandes d'effacement : *issues* du dépôt GitHub `LoanPleurmeauBonnin/green-path`.

## Ce que le jeu collecte
**Sans pseudo (mode invité, par défaut) : rien d'identifiant.** Pas de nom, pas d'e-mail, pas de publicité, pas de statistiques de visite, pas de cookies de suivi.
**Avec un pseudo (facultatif)** : voir « Pseudo, sauvegarde et classement » plus bas.

## Ce que le jeu garde sur l'appareil (stockage local du navigateur, jamais envoyé)
| Clé `localStorage` | Contenu | Finalité |
|---|---|---|
| `greenpath.save` | progression (niveaux terminés, étoiles, temps, morts), avatar, introduction vue, fragments et dernier checkpoint des niveaux en cours | reprendre la partie |
| `greenpath.settings` | langue, touches réaffectées | confort de jeu |
| `greenpath.weather` | dernière météo reçue | rester à jour hors ligne |
| `greenpath.postcard` | date et météo de la fin de partie, étoiles, et le pseudo facultatif écrit sur la carte postale | revoir sa carte postale telle qu'elle a été faite ; **jamais envoyé** (la carte est fabriquée dans le navigateur) |
| `greenpath.iostip` | l'astuce « plein écran » iPhone a été vue | ne pas la répéter |
| `greenpath.cloud` | choix invité/pseudo ; avec un pseudo : le pseudo et le **code de sauvegarde** | retrouver sa sauvegarde en ligne |
| `greenpath.scoreboard` | dernière version du classement vue | l'afficher hors ligne |

## Échanges réseau
- **Open-Meteo** (open-meteo.com, CC BY 4.0) : requête de la météo de Nantes (latitude/longitude fixes de la ville, aucune donnée du joueur) au démarrage puis toutes les 5 minutes. Comme pour tout site web, le service voit l'adresse IP de l'appareil.
- **Hébergement Vercel** : sert les fichiers du jeu ; Vercel garde des journaux techniques d'accès (adresse IP, date).
- **Supabase** (seulement avec un pseudo, et pour afficher le classement) : sauvegarde et classement, serveurs dans l'Union européenne (Paris). Voir plus bas.
- Aucun autre service tiers. Phaser et la police sont servis depuis le site (pas de CDN).

## Droits : accès, effacement
Toutes les données sont sur l'appareil du joueur : il les voit et les efface lui-même, à tout moment :
- **OPTIONS → EFFACER MES DONNÉES** (progression, avatar, langue, touches, météo mémorisée), ou **RÉINITIALISER** dans le menu (progression seulement) ;
- ou en vidant les données du site dans le navigateur.

## Pseudo, sauvegarde et classement (Supabase)
- **Facultatif**, sans e-mail, sans mot de passe. Proposé après le premier niveau terminé ; le mode invité reste possible à tout moment.
- **Consentement explicite** (case à cocher) avant la création, avec renvoi vers cette notice.
- **Données enregistrées** : pseudo (3 à 16 caractères), avatar, progression par niveau terminé (étoiles, pixels, meilleur temps, morts), **haché SHA-256 du code secret**, dates de création et de mise à jour. Le code est conservé sur l'appareil et **transmis dans le corps des requêtes HTTPS** pour retrouver, synchroniser ou supprimer la sauvegarde ; le serveur n'en conserve que le haché. Les fragments d'un niveau en cours restent locaux.
- **Finalités** : retrouver sa sauvegarde sur un autre appareil ; afficher le classement. **Base légale** : consentement.
- **Visibilité** : le classement public montre pseudo, rang, étoiles, nombre de niveaux et temps cumulé. Rien d'autre. Le pseudo est public : le jeu demande de ne pas utiliser son vrai nom.
- **Hébergement** : Supabase, région eu-west-3 (Paris). Aucune clé secrète dans le jeu ; les tables ne sont pas accessibles directement (voir `supabase/README.md`).
- **Durée** : tant que le compte existe ; projet pédagogique, supprimé après l'évaluation sauf demande contraire de l'équipe.
- **Droits** : accès (le joueur voit sa progression dans le jeu), effacement immédiat (**OPTIONS → COMPTE → SUPPRIMER MON COMPTE**) ou sur demande via les *issues* du dépôt GitHub. Le code perdu ne peut pas être récupéré (pas d'e-mail pour l'envoyer) : le compte reste inaccessible et peut être supprimé sur demande de l'équipe seulement avec le pseudo.
- **Mineurs** : le jeu ne demande aucune donnée d'identité ; un pseudo ne doit pas révéler d'information personnelle.

## Copie hors ligne
Après une première visite complète en HTTPS ou sur localhost, un service worker garde les fichiers publics du jeu en Cache Storage. Aucune réponse Open-Meteo/Supabase, aucun pseudo ni code n'entre dans ce cache. Le navigateur permet d'effacer cette copie via les données du site ; « EFFACER MES DONNÉES » efface les sauvegardes personnelles, pas les fichiers publics du jeu.
