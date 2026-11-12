/** Référence d'équilibrage. Valeurs existantes conservées faute de playtest humain.
 * Une variation doit être isolée, nommée et comparée avant d'être livrée.
 */
GP.Tuning = {
  version: 'feel-1',
  worldGravity: 950,
  player: { speed: 110, accelGround: 1100, accelAir: 880, jump: -320, cut: 0.45, coyote: 110, buffer: 130,
    maxFall: 420, invuln: 1000, crouchSpeed: 50, climbSpeed: 75,
    // « feel-1 » : tolérances invisibles inspirées de Celeste (dossier REA). Chaque valeur est isolée : 1 / 0 les neutralise.
    apexGravityMult: 0.7,   // gravité × 0,7 près du sommet du saut, tant que le saut est maintenu (1 = désactivé)
    apexThreshold: 90,      // … quand |vitesse verticale| est sous ce seuil (px/s)
    headCorner: 4,          // coin de plafond : décalage latéral de 1 à 4 px au lieu d'un arrêt net (0 = désactivé)
    ledgeAssist: 8,
    stepUp: 6,
    // « move-1 » : déplacements plus amples. Chaque valeur est isolée ; neutre = valeur d'avant.
    airBrake: 520,          // décélération en l'air quand on lâche la direction (px/s²) : l'élan se conserve mieux (neutre : accelAir)
    airTurn: 1.35,          // × l'accélération en l'air quand on inverse la direction : demi-tour aérien plus vif (neutre : 1)
    fallGravityMult: 1,     // × la gravité en descente (> 1 = plus lourd ; 1 = désactivé)
    // Dash (touche Maj / K, RB ou RT à la manette, bouton tactile) : 8 directions, une charge, rechargée au sol, sur une colonne ou un mur
    // Niveau (n° de l'étape) où chaque capacité est débloquée ; avant, elle est coupée (L.abilities.dash / .wall = true|false force le choix d'un niveau)
    unlock: { dash: 4, wall: 5 },
    dash: { enabled: true, speed: 300, ms: 140, cooldown: 220, charges: 1, endSpeed: 0.55, buffer: 90 },
    // Murs marqués seulement (L.wall dans un niveau) : accroche, glisse et saut mural
    wall: { slideSpeed: 55, stickMs: 180, jumpX: 150, jumpY: -300, lockMs: 170, jumpDelay: 220, coyote: 90 } },       // marche de 6 px au plus (rampe en petites marches) : franchie en marchant, sans saut       // pieds à moins de 8 px sous un rebord, poussé contre le mur : on monte dessus (0 = désactivé)
    // Essayé et écarté : conserver la vitesse d'une plateforme mobile au saut. Sa part horizontale s'efface en 0,1 s (contrôle
    // aérien) et sa part verticale ajoute jusqu'à 1,1 tuile aux sauts depuis un conteneur qui monte : trop de niveaux cassés.
  weather: { rainGround: 650, stormGround: 560, snowGround: 430, snowAir: 520, maxAirPush: 110, windFactor: 2.5,
    fogSight: 90, nightSight: 130 },
  parTimes: { 'jardin-des-plantes': 90, cathedrale: 110, chateau: 100 },
  shelter: { transitionMs: 300, maxDeltaMs: 50 }
};
