/** Adaptations explicites des documents de conception au moteur existant, sans exécuter leurs textes. */
GP.GZoneLevels = (function () {
  var ids = ['jardin-des-plantes', 'cathedrale', 'chateau', 'feydeau', 'graslin', 'machines', 'chantiers', 'buren', 'hangar', 'pommeraye', 'memorial', 'tour-lu'];

  /**
   * ÉQUILIBRAGE DE LA DIFFICULTÉ (novembre 2026). Ajustements d'obstacles par-dessus les documents importés :
   * gzones.js est un fichier généré, on n'y touche pas. Mesure et détail : tools/balance.cjs et docs/equilibrage.md.
   *   retirer : obstacles supprimés { sprite, x, y }   ajouter : obstacles posés sur un sol plat et dégagé (vérifié par tests/balance.test.js)
   *   vitesse : facteur sur la vitesse des ennemis en patrouille (oiseaux, tonneaux)
   * Intention : un début plus doux (1 à 3), le pic du niveau 6 écrêté, des niveaux 7 à 12 plus vifs. Le Mémorial (11) reste
   * sans ennemi ni pointe : sa difficulté vient des séquences de dalles et de la marée (GZoneRuntime).
   */
  var BALANCE = {
    1: { vitesse: 0.85, retirer: [{ sprite: 'commun_ronces_2', x: 44, y: 14 }, { sprite: 'commun_pointes_fer_1', x: 102, y: 14 }] },
    2: { vitesse: 0.85, retirer: [{ sprite: 'cathedrale_cierge_flamme', x: 28, y: 21 }, { sprite: 'cathedrale_cierge_flamme', x: 40, y: 21 }] },
    3: { vitesse: 0.9 },
    6: { retirer: [{ sprite: 'vapeur', x: 61, y: 10 }, { sprite: 'vapeur', x: 139, y: 13 }] },
    7: { vitesse: 1.1, ajouter: [{ sprite: 'chantiers_obstacle_ferraille', x: 194, y: 14, kind: 'mortel' },
      { sprite: 'chantiers_obstacle_ferraille', x: 204, y: 14, kind: 'mortel' }] },
    8: { vitesse: 1.1 },
    9: { vitesse: 1.1, ajouter: [{ sprite: 'hangar_obstacle_tole_coupante', x: 92, y: 12, kind: 'mortel' }] },
    10: { vitesse: 1.1 },
    12: { vitesse: 1.1 }
  };
  function balance(d) {
    var b = BALANCE[d.num];
    if (!b || d.equilibre) return;
    d.equilibre = true;
    (b.retirer || []).forEach(function (r) {
      d.dangers = d.dangers.filter(function (h) { return !(h.sprite === r.sprite && h.x === r.x && h.y === r.y); });
    });
    (b.ajouter || []).forEach(function (h) { d.dangers.push(Object.assign({}, h)); });
    if (b.vitesse) (d.ennemis || []).forEach(function (e) { if (e.vitesse) e.vitesse = Math.round(e.vitesse * b.vitesse * 100) / 100; });
  }
  /**
   * RETOUCHES DE GÉOMÉTRIE : corrections de faisabilité et de lisibilité par-dessus les documents importés (gzones.js reste
   * intact). Chaque retouche est vérifiée par `node tools/solvability.cjs` : un niveau doit être finissable, pixels compris.
   *   retirer : ids de plateformes supprimées · modifier : { id: propriétés } · ajouter : plateformes ajoutées
   */
  var REPAIRS = {
    // Jardin : chaque danger est présenté par un panneau AVANT sa première rencontre (skill level-design : enseigner avant de tester).
    1: { signes: [{ x: 26, y: 14, texte: 'Les ronces piquent : saute !' }, { x: 59, y: 14, texte: "Les jets d'eau montent puis retombent : traverse quand ils sont bas." }] },
    // Cathédrale : les montants de la porte des toits étaient des murs pleins de 4 tuiles sur le chemin du joueur (la porte
    // se traverse entre eux, elle ne se contourne pas). Ils deviennent des jambages de décor ; le linteau reste au-dessus.
    // + panneaux avant les cierges, les colonnes et les gargouilles.
    2: { modifier: { p23: { fond: true }, p24: { fond: true } },
      signes: [{ x: 24, y: 21, texte: 'Cierges et pointes : saute par-dessus.' }, { x: 27, y: 21, texte: 'Maintiens ↑ contre une colonne pour y grimper.' },
        { x: 92, y: 7, texte: 'La gargouille crache : passe entre deux jets.' }] },
    // Feydeau : le pilier du balcon secret (une colonne pleine de 3 tuiles posée sur le tablier) barrait l'entrée du balcon depuis
    // les bateaux, donc le niveau était infinissable après x=132. Il devient un pilier de décor.
    // + panneaux avant les pointes du quai et avant la première mouette (à passer accroupi).
    4: { modifier: { p37: { fond: true } },
      signes: [{ x: 26, y: 13, texte: 'Les pointes piquent : saute par-dessus.' }, { x: 39, y: 10, texte: 'Les mouettes rasent les balcons : maintiens ↓ pour passer dessous.' }] },
    // Graslin : aucun panneau dans le document d'origine. Un par idée, avant sa première rencontre : parasol, chaises, tonneau, lustre.
    5: { signes: [{ x: 11, y: 19, texte: 'Saute sur un parasol : il te fait rebondir.' }, { x: 22, y: 13, texte: 'Chaises et pointes piquent : saute par-dessus.' },
      { x: 62, y: 14, texte: 'Le tonneau roule : saute au bon moment.' }, { x: 117, y: 7, texte: 'Le lustre oscille : saute dessus quand il approche.' }] },
    // Machines : dents (avant la première), vapeur cyclique, piston.
    6: { signes: [{ x: 22, y: 13, texte: 'Les dents des engrenages piquent : saute par-dessus.' }, { x: 33, y: 11, texte: 'La vapeur jaillit par intermittence : passe quand elle retombe.' },
      { x: 77, y: 8, texte: 'Les pistons montent et descendent : saute dessus quand il est bas.' }] }
  };
  function repair(d) {
    var r = REPAIRS[d.num];
    if (!r || d.retouche) return;
    d.retouche = true;
    (r.retirer || []).forEach(function (id) { d.plateformes = d.plateformes.filter(function (p) { return p.id !== id; }); });
    Object.keys(r.modifier || {}).forEach(function (id) {
      d.plateformes.forEach(function (p) { if (p.id === id) Object.assign(p, r.modifier[id]); });
    });
    (r.ajouter || []).forEach(function (p) { d.plateformes.push(Object.assign({}, p)); });
    (r.signes || []).forEach(function (s) { d.signes.push(Object.assign({ sprite: 'signes_panneau_saut' }, s)); });
  }
  GP.GZONES.forEach(repair);
  GP.GZONES.forEach(balance);
  function make(d, id) {
    var L = GP.LevelBuilder.create(d.largeur, function () {}, d.hauteur);
    L.id = id; L.gzone = d; L.revision = 'gzones-1-' + d.sourceHash.slice(0, 12);
    L.startX = d.spawn.x; L.startRow = d.spawn.y;
    // Les objets du document sont bas-gauche ; le moteur historique centre les objets en X.
    L.pixels = d.pixels.map(function (p) { return { x: p.x, y: p.y }; });
    // Rapprocher d'une tuile le dernier anneau du petit palier : marge de déclenchement cohérente avec le corps 8×16.
    if(d.num===8)L.pixels.forEach(function(p){if(p.x===176&&p.y===5)p.x=175;});
    L.checks = d.checkpoints.map(function (p) { return { x: p.x, y: p.y }; });
    L.hints = d.signes.map(function (p) {
      var text=p.texte||'OBSERVE LE PASSAGE AVANT DE T’ENGAGER';
      text=text.replace(/↓/g,'{down}').replace(/↑/g,'{up}');
      if(/Saute/.test(text))text='{jump} : '+text;
      return {x:p.x,y:p.y,text:text};
    });
    L.abilities = { crouch: true, grab: d.num >= 2, climb: d.num >= 2 };
    L.reveal = id === 'cathedrale' ? 'bottomUp' : id === 'jardin-des-plantes' ? 'bottomUp' : 'bottomUp';
    L.zones = d.zones.map(function (z) { return { x: z.x[0], end: z.x[1], name: z.nom.toUpperCase() }; });
    L.exit = { x: d.arrivee.declencheur.x, y: d.arrivee.declencheur.y + 1, key: 'signes_arche_arrivee' };
    L.water = d.dangers.filter(function (p) { return p.kind === 'eau_mortelle'; }).map(function (p) { return { x: p.x, y: p.y, w: p.w || 1, h: 1 }; });
    (d.eau || []).forEach(function (p) { L.water.push({ x: p.x, y: p.y, w: p.w, h: d.hauteur - p.y }); });
    L.sky = { farKey: d.num === 12 ? 'carte_batiments_lointains' : (d.fond.couches[0] || {}).sprite, farBottom: 236 };
    L.roofs = [];
    function roof(x, end, y, wind) {
      var r = { x: x * 16, y: y * 16, w: (end - x) * 16, h: 8 };
      L.roofs.push(r); L.shelters.push({ id: id + '-couvert-' + L.roofs.length, x: r.x, y: r.y + r.h, w: r.w,
        h: d.hauteur * 16 - r.y - r.h, rain: 1, snow: 1, wind: wind });
    }
    // Couvertures bâties visibles, pas un cercle sec suivant le héros.
    if (d.num === 2) roof(17, 95, 2, 1);
    if (d.num === 6) roof(38, 80, 1, 0.75);
    if (d.num === 9) roof(44, 230, 1, 0.9);
    if (d.num === 10) roof(0, 210, 1, 1);
    if (d.num === 11) roof(88, 134, 4, 1);
    if (d.num === 12) { roof(48, 146, 1, 0.9); }
    if (d.boss) {
      var n = d.num === 12 ? 4 : 3;
      L.boss = { kind: d.num === 6 ? 'elephant' : d.num === 9 ? 'mould' : 'vortex', phases: n,
        start: d.num === 6 ? 160 : d.num === 9 ? 176 : 195, end: d.largeur,
        floor: d.num === 9 ? 19 : 16,
        goals: d.num === 6 ? d.valves : d.num === 9 ? d.lampes_uv :
          [{ x: 202, y: 6 }, { x: 248, y: 6 }, { x: 216, y: 5 }, { x: 232, y: 5 }] };
    }
    return L;
  }
  var old = {}; GP.LOCATIONS.forEach(function (l) { old[l.id] = l; });
  GP.LevelPrototypes = Object.assign({}, GP.LEVELS); // socle conservé, pas supprimé
  GP.LOCATIONS = ids.map(function (id, i) {
    var loc = old[id], d = GP.GZONES[i];
    loc.playable = true; loc.level = id;
    GP.Tuning.parTimes[id] = GP.Tuning.parTimes[id] || d.temps_ref_s;
    loc.parTime = GP.Tuning.parTimes[id];
    var rules = [
      'VARIATION VÉGÉTALE : allées, bassins et topiaires deviennent des appuis. Les jets sont cycliques et peuvent geler sous la neige. L’image se reconstruit par groupes de cellules.',
      'VARIATION VERTICALE : parvis, nef, galeries et toits. Colonnes et rebords permettent de monter ; la nef couverte protège des précipitations et du vent.',
      null,
      'SÉRIE DE FAÇADES : balcons portés, quais et bateaux flotteurs. Les balcons inclinés entraînent le joueur et les bateaux s’enfoncent sous son poids.',
      'RYTHME NÉOCLASSIQUE : perron, colonnes et fronton. Les parasols donnent un rebond et les lustres oscillent ; une interprétation ludique, pas une restitution du théâtre.',
      'MOUVEMENT INDUSTRIEL : passerelles, engrenages et bielles. Esquiver les jets puis activer trois valves calme l’Éléphant mécanique.',
      'LEVAGE : cales, rails, pylônes et flèche de grue. Les chariots démarrent sous le poids du joueur ; les tôles restent exposées aux intempéries.',
      'SÉRIE ET ÉLAN : les anneaux cadrent le quai et donnent des impulsions annoncées par des flèches. Leur propulsion est une convention de jeu, pas une propriété de l’œuvre.',
      'TRAVÉES ET CIRCULATION : portes et conteneurs mobiles structurent le hangar couvert. Trois lampes UV neutralisent une moisissure fictive dans l’épreuve finale.',
      'TROIS STRATES : galerie, escalier et coursives sous une verrière. Lustres mobiles et dalles fragiles sont des conventions ludiques ; le passage est abrité.',
      'MÉMOIRE ET LECTURE : des séquences de hauteurs indiquent les dalles solides. La montée d’eau est une métaphore lente, pas une simulation de la marée réelle.',
      'ASCENSION FINALE : strates de la tour, horloge et coupole. Les courants ascendants donnent accès aux quatre lanternes qui dissipent le Vortex fictif.'
    ];
    if (rules[i]) loc.grammar = rules[i];
    if (id !== 'chateau') GP.LEVELS[id] = make(d, id); // conserver le Château déjà adapté et testé
    return loc;
  });
  GP.LAST_PLAYABLE = 11;
  GP.Config.ROUTE_VERSION = 'gzones-1';
  return { ids: ids, make: make, balance: BALANCE, repairs: REPAIRS };
})();
