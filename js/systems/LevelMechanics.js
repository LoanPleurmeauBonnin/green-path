/** Petites règles déterministes des ouvrages de niveau ; pas de modification de la physique du héros. */
GP.LevelMechanics = {
  /** Un pont ne se relève jamais sous les pieds du joueur. Horloge locale, arrêtée avec la scène. */
  bridge: function (bridge, delta, occupied) {
    var cycle = bridge.open + bridge.closed;
    bridge.clock = ((bridge.clock || 0) + delta) % cycle;
    var lowered = bridge.clock < bridge.open;
    if (!lowered && occupied) { bridge.clock = 0; lowered = true; }
    bridge.lowered = lowered;
    bridge.warned = lowered && bridge.clock >= bridge.open - bridge.warning;
    var target = lowered ? 0 : -90, step = delta * 90 / 350;
    bridge.angle = (bridge.angle || 0) + Math.max(-step, Math.min(step, target - (bridge.angle || 0)));
    return lowered && bridge.angle === 0;
  },
  /** Requête de fin explicite : les niveaux sans arche gardent leur fonctionnement initial. */
  canFinish: function (level, complete, atExit, bossDone) { return complete && (!level.exit || !!atExit) && (!level.boss || !!bossDone); }
};
