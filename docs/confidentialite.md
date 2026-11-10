# Confidentialité et données personnelles (RGPD)

*Résumé d'information pour un projet pédagogique (ESD Nantes, atelier PATRIMOINE.EXE). Ce document informe ; ce n'est pas un avis juridique.*
Le même texte est lu dans le jeu : **CRÉDITS → CONFIDENTIALITÉ** ou **OPTIONS → CONFIDENTIALITÉ** (français et anglais, `js/data/lang/fr.js` et `en.js`).

## Responsable
L'équipe Green Path (Florine RACINE, Loan PLEURMEAU). Questions et demandes d'effacement : *issues* du dépôt GitHub `LoanPleurmeauBonnin/green-path`.

## Ce que le jeu collecte : rien d'identifiant
Pas de compte, pas de nom, pas d'e-mail, pas de publicité, pas de statistiques de visite, pas de cookies de suivi.

## Ce que le jeu garde sur l'appareil (stockage local du navigateur, jamais envoyé)
| Clé `localStorage` | Contenu | Finalité |
|---|---|---|
| `greenpath.save` | progression (niveaux terminés, étoiles, temps, morts), avatar, introduction vue | reprendre la partie |
| `greenpath.settings` | langue, touches réaffectées | confort de jeu |
| `greenpath.weather` | dernière météo reçue | rester à jour hors ligne |
| `greenpath.iostip` | l'astuce « plein écran » iPhone a été vue | ne pas la répéter |

## Échanges réseau
- **Open-Meteo** (open-meteo.com, CC BY 4.0) : requête de la météo de Nantes (latitude/longitude fixes de la ville, aucune donnée du joueur) au démarrage puis toutes les 5 minutes. Comme pour tout site web, le service voit l'adresse IP de l'appareil.
- **Hébergement Vercel** : sert les fichiers du jeu ; Vercel garde des journaux techniques d'accès (adresse IP, date).
- Aucun autre service tiers. Phaser et la police sont servis depuis le site (pas de CDN).

## Droits : accès, effacement
Toutes les données sont sur l'appareil du joueur : il les voit et les efface lui-même, à tout moment :
- **OPTIONS → EFFACER MES DONNÉES** (progression, avatar, langue, touches, météo mémorisée), ou **RÉINITIALISER** dans le menu (progression seulement) ;
- ou en vidant les données du site dans le navigateur.

## Si des comptes et un classement sont ajoutés (vague 3, Supabase)
Décision de l'équipe : **pseudo seul, sans e-mail**, facultatif, avec un mode invité toujours possible. Avant toute collecte : cette page et le jeu seront mis à jour (données stockées : identifiant anonyme, pseudo ≤ 16 caractères, avatar, progression ; finalité : sauvegarde et classement ; effacement sur demande) et un consentement explicite sera demandé. Le classement n'affichera que le pseudo.
