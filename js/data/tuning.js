/** Référence d'équilibrage. Valeurs existantes conservées faute de playtest humain.
 * Une variation doit être isolée, nommée et comparée avant d'être livrée.
 */
GP.Tuning = {
  version: 'baseline-1',
  worldGravity: 950,
  player: { speed: 110, accelGround: 1100, accelAir: 700, jump: -320, cut: 0.45, coyote: 90, buffer: 110,
    maxFall: 420, invuln: 1000, crouchSpeed: 50, climbSpeed: 75 },
  weather: { rainGround: 650, stormGround: 560, snowGround: 430, snowAir: 520, maxAirPush: 110, windFactor: 2.5,
    fogSight: 90, nightSight: 130 },
  parTimes: { 'jardin-des-plantes': 90, cathedrale: 110, chateau: 100 },
  shelter: { transitionMs: 300, maxDeltaMs: 50 }
};
