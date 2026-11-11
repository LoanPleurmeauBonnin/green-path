/** Référence d'équilibrage. Valeurs existantes conservées faute de playtest humain.
 * Une variation doit être isolée, nommée et comparée avant d'être livrée.
 */
GP.Tuning = {
  version: 'feel-1',
  worldGravity: 950,
  player: { speed: 110, accelGround: 1100, accelAir: 700, jump: -320, cut: 0.45, coyote: 90, buffer: 110,
    maxFall: 420, invuln: 1000, crouchSpeed: 50, climbSpeed: 75,
    // « feel-1 » : tolérances invisibles inspirées de Celeste (dossier REA). Chaque valeur est isolée : 1 / 0 les neutralise.
    apexGravityMult: 0.7,   // gravité × 0,7 près du sommet du saut, tant que le saut est maintenu (1 = désactivé)
    apexThreshold: 90,      // … quand |vitesse verticale| est sous ce seuil (px/s)
    headCorner: 4,          // coin de plafond : décalage latéral de 1 à 4 px au lieu d'un arrêt net (0 = désactivé)
    ledgeAssist: 8 },       // pieds à moins de 8 px sous un rebord, poussé contre le mur : on monte dessus (0 = désactivé)
    // Essayé et écarté : conserver la vitesse d'une plateforme mobile au saut. Sa part horizontale s'efface en 0,1 s (contrôle
    // aérien) et sa part verticale ajoute jusqu'à 1,1 tuile aux sauts depuis un conteneur qui monte : trop de niveaux cassés.
  weather: { rainGround: 650, stormGround: 560, snowGround: 430, snowAir: 520, maxAirPush: 110, windFactor: 2.5,
    fogSight: 90, nightSight: 130 },
  parTimes: { 'jardin-des-plantes': 90, cathedrale: 110, chateau: 100 },
  shelter: { transitionMs: 300, maxDeltaMs: 50 }
};
