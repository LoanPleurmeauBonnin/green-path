/**
 * English (GP.EN) : dictionnaire phrase française exacte → anglais, modèles pour les textes à nombres,
 * et textes longs par identifiant. Une phrase absente reste en français (voir js/systems/I18n.js).
 * Les noms de lieux, éléments, notices et résumés des lieux sont dans GP.EN.places (par identifiant de lieu).
 */
window.GP = window.GP || {};
GP.EN = {
  texts: {
    intro: "Psst… over here! I'm the keeper of the green line. Last night, a great gust of wind swept over Nantes. Its monuments flew away in a thousand pixels! The castle, the cathedral, the garden… 12 places are waiting to be rebuilt. Follow the green line, collect the pixels and give Nantes its monuments back to unlock a special illustration.",
    privacy1: "Green Path asks for no personal information: no name, no e-mail, no account. There are no ads, no visit statistics and no tracking cookies.",
    privacy2: "On your device, in the browser's local storage, the game keeps: your progress, your avatar, the language, your keys and the last weather received. None of this is sent to a server.",
    privacy3: "One single network exchange: the weather in Nantes, requested from Open-Meteo (open-meteo.com) every 5 minutes. As with any website, that service sees your device's IP address. The site is hosted by Vercel, which keeps technical access logs.",
    privacy4: "You can erase everything at any time: OPTIONS then ERASE MY DATA, or RESET in the menu. Clearing the browser's storage does the same.",
    privacy5: "If accounts and a scoreboard are ever added, they will be optional (guest mode will remain) and this page will be updated before any data is collected.",
    privacy6: "Controller: the Green Path team (educational project, ESD Nantes). Questions and requests: issues on the GitHub repository LoanPleurmeauBonnin/green-path. This text informs; it is not legal advice."
  },
  words: {
    // --- menu, options, crédits ---
    'HAUT/BAS + ENTRÉE  -  OU CLIC': 'UP/DOWN + ENTER  -  OR CLICK', 'CONTINUER': 'CONTINUE', 'COMMENCER': 'START', "PERSONNALISER L'AVATAR": 'CUSTOMIZE AVATAR',
    'RÉINITIALISER': 'RESET', 'CRÉDITS': 'CREDITS', 'OPTIONS': 'OPTIONS', 'OUI, EFFACER': 'YES, ERASE', 'ANNULER': 'CANCEL', 'EFFACER TOUTE LA PROGRESSION ?': 'ERASE ALL PROGRESS?',
    'RETOUR': 'BACK', 'DÉVELOPPEUR WEB, IA OPS': 'WEB DEVELOPER, AI OPS', 'CONFIDENTIALITÉ': 'PRIVACY', 'LANGUE': 'LANGUAGE', 'FRANÇAIS': 'FRANÇAIS', 'SON': 'SOUND',
    'ACTIVÉ': 'ON', 'COUPÉ': 'OFF', 'PLEIN ÉCRAN': 'FULLSCREEN', 'ACTIVER': 'TURN ON', 'DÉSACTIVER': 'TURN OFF', 'TOUCHES': 'KEYS', 'MANETTE': 'GAMEPAD', 'EFFACER MES DONNÉES': 'ERASE MY DATA',
    'EFFACER LES DONNÉES DE CE NAVIGATEUR ?': 'ERASE THIS BROWSER\'S DATA?', 'DONNÉES EFFACÉES': 'DATA ERASED', 'DÉTECTÉE': 'DETECTED', 'NON DÉTECTÉE': 'NOT DETECTED', 'APPUIE SUR UN BOUTON DE LA MANETTE.': 'PRESS A BUTTON ON THE GAMEPAD.',
    'NON DISPONIBLE ICI': 'NOT AVAILABLE HERE', 'IPHONE : PARTAGER > SUR L\'ÉCRAN D\'ACCUEIL': 'IPHONE: SHARE > ADD TO HOME SCREEN',
    'ACTION': 'ACTION', 'TOUCHE 1': 'KEY 1', 'TOUCHE 2': 'KEY 2', 'TOUCHE 3': 'KEY 3', 'GAUCHE': 'LEFT', 'DROITE': 'RIGHT', 'SAUTER': 'JUMP', 'GRIMPER': 'CLIMB', "S'ACCROUPIR": 'CROUCH',
    'HAUT': 'UP', 'BAS': 'DOWN', 'ESPACE': 'SPACE', 'MAJ': 'SHIFT', 'EFFACER': 'BACKSPACE', 'SUPPR': 'DEL',
    'APPUIE SUR UNE TOUCHE (ÉCHAP : ANNULER)': 'PRESS A KEY (ESC: CANCEL)', 'TOUCHES PAR DÉFAUT': 'DEFAULT KEYS', 'TOUCHE RÉSERVÉE': 'RESERVED KEY', 'DERNIÈRE TOUCHE DE CETTE ACTION': 'LAST KEY OF THIS ACTION',
    'ENTRÉE : CHANGER   SUPPR : VIDER': 'ENTER: CHANGE   DEL: CLEAR', 'HAUT/BAS  < > CHANGER  ENTRÉE': 'UP/DOWN  < > CHANGE  ENTER', 'APPUIE SUR UN BOUTON DE LA MANETTE.  MANETTE : STICK OU CROIX = BOUGER, A = SAUTER / VALIDER, START = PAUSE, B = RETOUR': 'PRESS A BUTTON ON THE GAMEPAD.  GAMEPAD: STICK OR D-PAD = MOVE, A = JUMP / CONFIRM, START = PAUSE, B = BACK',
    'MANETTE : STICK OU CROIX = BOUGER, A = SAUTER / VALIDER, START = PAUSE, B = RETOUR': 'GAMEPAD: STICK OR D-PAD = MOVE, A = JUMP / CONFIRM, START = PAUSE, B = BACK',
    'FLORINE RACINE': 'FLORINE RACINE', 'ESD NANTES - PATRIMOINE.EXE': 'ESD NANTES - PATRIMOINE.EXE', 'PRÉCÉDENT': 'PREVIOUS', 'SUIVANT': 'NEXT',
    // --- avatar ---
    'TON AVATAR': 'YOUR AVATAR', "IL T'ACCOMPAGNE TOUT LE PARCOURS": 'WALKING WITH YOU ALL THE WAY', 'MODÈLE': 'MODEL', 'ALÉATOIRE': 'RANDOM', 'VALIDER': 'CONFIRM',
    'HAUT/BAS  < > CHANGER  ESPACE ANIMER': 'UP/DOWN  < > CHANGE  SPACE ANIMATE',
    'COIFFURE': 'HAIRSTYLE', 'CHEVEUX': 'HAIR', 'YEUX': 'EYES', 'COUL. YEUX': 'EYE COLOR', 'PEAU': 'SKIN', 'COUL. HAUT': 'TOP COLOR', 'COUL. BAS': 'BOTTOM COLOR', 'CHAUSSURES': 'SHOES',
    'COURTS': 'SHORT', 'FRANGE': 'FRINGE', 'BOUCLÉS': 'CURLY', 'MI-LONG': 'MID-LENGTH', 'CHIGNON': 'BUN', 'RASÉ': 'SHAVED', 'CRÊTE': 'MOHAWK', 'CHAUVE': 'BALD',
    'NOIR': 'BLACK', 'BRUN': 'BROWN', 'CHÂTAIN': 'CHESTNUT', 'BLOND': 'BLOND', 'ROUX': 'RED', 'GRIS': 'GREY', 'VERT': 'GREEN',
    'RONDS': 'ROUND', 'PETITS': 'SMALL', 'FERMÉS': 'CLOSED', 'ENDORMIS': 'SLEEPY', 'MARRON': 'BROWN', 'BLEU': 'BLUE', 'NOISETTE': 'HAZEL',
    'PÂLE': 'PALE', 'CLAIR': 'LIGHT', 'HÂLÉ': 'TANNED', 'FONCÉ': 'DARK',
    'TORSE NU': 'BARE CHEST', 'DÉBARDEUR': 'TANK TOP', 'T-SHIRT': 'T-SHIRT', 'SWEAT': 'SWEATSHIRT', 'VESTE': 'JACKET', 'CHEMISE': 'SHIRT',
    'CORAIL': 'CORAL', 'BLEU CIEL': 'SKY BLUE', 'VIOLET': 'PURPLE', 'BLANC': 'WHITE', 'JAUNE': 'YELLOW', 'ORANGE': 'ORANGE', 'ROSE': 'PINK', 'TURQUOISE': 'TURQUOISE',
    'SLIP': 'BRIEFS', 'SHORT': 'SHORTS', 'PANTALON': 'TROUSERS', 'JUPE': 'SKIRT', 'BEIGE': 'BEIGE', 'ROUGE': 'RED',
    'SOMBRES': 'DARK', 'BLANCHES': 'WHITE', 'ROUGES': 'RED', 'PIEDS NUS': 'BAREFOOT',
    // --- carte ---
    'SON COUPÉ': 'SOUND OFF', 'SON ACTIVÉ': 'SOUND ON', 'COMMENT JOUER ?': 'HOW TO PLAY?', "< > CHANGER D'ÉTAPE   ENTRÉE FICHE   H AIDE": '< > CHANGE STAGE   ENTER INFO   H HELP',
    'MÉTÉO RÉELLE': 'REAL WEATHER', 'BILAN': 'RESULTS', 'NIVEAUX': 'LEVELS', 'FICHE DU LIEU': 'ABOUT THE PLACE', 'À DÉCOUVRIR': 'TO DISCOVER', 'REJOUER': 'REPLAY', 'JOUER': 'PLAY', 'FERMER': 'CLOSE',
    'À RECONSTRUIRE': 'TO REBUILD', 'ÉTOILES': 'STARS', 'NIVEAU PAS ENCORE DISPONIBLE': 'LEVEL NOT AVAILABLE YET', "TERMINE L'ÉTAPE PRÉCÉDENTE": 'FINISH THE PREVIOUS STAGE',
    'IMAGE RECONSTRUITE': 'IMAGE REBUILT', 'PIXELS': 'PIXELS', 'RECONSTRUCTION': 'REBUILT', 'MEILLEUR TEMPS': 'BEST TIME', 'MORTS (MINIMUM)': 'DEATHS (MIN.)', 'IMAGE COMPLÈTE': 'IMAGE COMPLETE',
    'SANS MOURIR': 'NO DEATHS', 'SOUS LE TEMPS CIBLE': 'UNDER TARGET TIME', 'NIVEAU EN CONSTRUCTION': 'LEVEL UNDER CONSTRUCTION', 'TERMINÉ': 'DONE', 'VERROUILLÉ': 'LOCKED', 'À VENIR': 'COMING SOON',
    // --- niveau, résultat ---
    'CHUTE !': 'FALL!', 'AÏE, LES RONCES !': 'OUCH, BRAMBLES!', 'LES RONCES ONT POUSSÉ !': 'THE BRAMBLES GREW!', 'UNE FLÈCHE ! ACCROUPIS-TOI': 'AN ARROW! CROUCH', "LA GARGOUILLE T'A EU !": 'THE GARGOYLE GOT YOU!',
    'ATTENTION AU TONNEAU !': 'WATCH THE BARREL!', 'POINT DE CONTRÔLE': 'CHECKPOINT', 'IMAGE COMPLÈTE !': 'IMAGE COMPLETE!', 'PAUSE': 'PAUSE', 'ÉCHAP : REPRENDRE': 'ESC: RESUME', 'REPRENDRE': 'RESUME',
    'QUITTER VERS LA CARTE': 'QUIT TO MAP', 'ÉTAPE SUIVANTE DÉBLOQUÉE !': 'NEXT STAGE UNLOCKED!', 'TEMPS': 'TIME', 'MORTS': 'DEATHS', 'CARTE (ENTRÉE)': 'MAP (ENTER)', 'REJOUER (R)': 'REPLAY (R)',
    'AÏE, LES POINTES !': 'OUCH, SPIKES!', 'AÏE, LES POINTES DE PIERRE !': 'OUCH, STONE SPIKES!', 'AÏE, DES TESSONS !': 'OUCH, BROKEN GLASS!',
    // --- aide ---
    'LA CARTE': 'THE MAP', 'CHANGER DE NIVEAU (OU A / D)': 'CHANGE LEVEL (OR A / D)', 'CLIC': 'CLICK', "ALLER JUSQU'À UNE ÉTAPE": 'GO TO A STAGE', 'ENTRÉE': 'ENTER', 'OUVRIR LA FICHE DU LIEU, JOUER': 'OPEN THE PLACE SHEET, PLAY',
    'ÉCHAP': 'ESC', 'FERMER, REVENIR AU MENU': 'CLOSE, BACK TO MENU', 'COUPER / REMETTRE LE SON': 'MUTE / UNMUTE', 'OUVRIR CETTE AIDE': 'OPEN THIS HELP', 'DANS UN NIVEAU': 'IN A LEVEL',
    'COURIR (OU Q/A ET D)': 'RUN (OR Q/A AND D)', 'SAUTER (OU W, Z) ; MAINTENIR = PLUS HAUT': 'JUMP (OR W, Z); HOLD = HIGHER', "S'ACCROUPIR SOUS LES FLÈCHES (OU S)": 'CROUCH UNDER ARROWS (OR S)',
    'GRIMPER AUX COLONNES, SE HISSER SUR UN REBORD': 'CLIMB COLUMNS, PULL UP ONTO A LEDGE', "SUR TÉLÉPHONE : BOUTONS À L'ÉCRAN, EN PAYSAGE": 'ON PHONE: ON-SCREEN BUTTONS, LANDSCAPE',
    'BUT DU JEU': 'GOAL', 'RAMASSE LES PIXELS : CHACUN RÉVÈLE UNE PARTIE DE LA PHOTO DU LIEU.': 'COLLECT THE PIXELS: EACH ONE REVEALS PART OF THE PLACE\'S PICTURE.',
    'RONCES, POINTES, FLÈCHES, TONNEAUX, CHUTE = UNE MORT : RETOUR À LA LANTERNE.': 'BRAMBLES, SPIKES, ARROWS, BARRELS, FALLS = A DEATH: BACK TO THE LANTERN.',
    'LANTERNE ALLUMÉE = POINT DE CONTRÔLE.': 'LIT LANTERN = CHECKPOINT.', 'IMAGE COMPLÈTE, SANS MOURIR, SOUS LE TEMPS CIBLE.': 'COMPLETE IMAGE, NO DEATHS, UNDER THE TARGET TIME.', 'MÉTÉO': 'WEATHER',
    'LA VRAIE MÉTÉO DE NANTES CHANGE LE JEU : ANNONCÉ À CHAQUE NIVEAU.': 'NANTES\'S REAL WEATHER CHANGES THE GAME: ANNOUNCED IN EACH LEVEL.',
    'PLUIE : LE SOL GLISSE, LES RONCES POUSSENT. NEIGE : ON DÉRAPE.': 'RAIN: THE GROUND IS SLIPPERY, BRAMBLES GROW. SNOW: YOU SKID.',
    'VENT : IL POUSSE LES SAUTS. BRUME, NUIT : PIXELS VISIBLES DE PRÈS.': 'WIND: IT PUSHES YOUR JUMPS. FOG, NIGHT: PIXELS ONLY SHOW UP CLOSE.', 'SOLEIL : DES FLEURS FONT DES PLATEFORMES.': 'SUN: FLOWERS BECOME PLATFORMS.',
    'EN DIRECT TOUTES LES 5 MIN ; HORS LIGNE, LA DERNIÈRE MÉTÉO REÇUE.': 'LIVE EVERY 5 MIN; OFFLINE, THE LAST WEATHER RECEIVED.', '< PRÉCÉDENT': '< PREVIOUS', 'SUIVANT >': 'NEXT >',
    // --- météo ---
    'EN DIRECT': 'LIVE', 'HORS LIGNE': 'OFFLINE', 'MÉTÉO NEUTRE': 'NEUTRAL WEATHER', 'MÉTÉO NEUTRE (HORS LIGNE)': 'NEUTRAL WEATHER (OFFLINE)',
    'DÉGAGÉ': 'CLEAR', 'NUAGEUX': 'CLOUDY', 'COUVERT': 'OVERCAST', 'BRUME': 'FOG', 'BRUINE': 'DRIZZLE', 'PLUIE': 'RAIN', 'AVERSES': 'SHOWERS', 'NEIGE': 'SNOW', 'ORAGE': 'STORM',
    'ORAGE SUR NANTES': 'STORM OVER NANTES', 'IL PLEUT SUR NANTES': 'IT IS RAINING IN NANTES', 'IL NEIGE SUR NANTES': 'IT IS SNOWING IN NANTES', 'BRUME SUR NANTES': 'FOG OVER NANTES',
    'GRAND SOLEIL SUR NANTES': 'BRIGHT SUN OVER NANTES', 'GRAND VENT SUR NANTES': 'STRONG WIND OVER NANTES', 'NUIT SUR NANTES': 'NIGHT OVER NANTES', 'CIEL NUAGEUX SUR NANTES': 'CLOUDY SKY OVER NANTES',
    'LE SOL GLISSE': 'THE GROUND IS SLIPPERY', 'LA NEIGE FAIT DÉRAPER': 'SNOW MAKES YOU SKID', 'LE VENT POUSSE LES SAUTS VERS LA DROITE': 'THE WIND PUSHES JUMPS TO THE RIGHT', 'LE VENT POUSSE LES SAUTS VERS LA GAUCHE': 'THE WIND PUSHES JUMPS TO THE LEFT',
    'LES PIXELS SE VOIENT DE PRÈS': 'PIXELS ONLY SHOW UP CLOSE', 'LES LANTERNES ÉCLAIRENT LA NUIT': 'LANTERNS LIGHT THE NIGHT',
    // --- panneaux et réactions des niveaux ---
    '< > OU Q/D : COURIR': '< > OR Q/D: RUN', 'ESPACE : SAUTER': 'SPACE: JUMP', 'LANTERNE = POINT DE CONTRÔLE': 'LANTERN = CHECKPOINT', 'ATTENTION AUX RONCES !': 'WATCH OUT FOR BRAMBLES!',
    'MAINTIENS ESPACE : PLUS HAUT': 'HOLD SPACE: HIGHER', 'LES RONCES POUSSENT': 'BRAMBLES GROW', 'DES FLEURS FONT DES PLATEFORMES': 'FLOWERS BECOME PLATFORMS', "BAS OU S : S'ACCROUPIR": 'DOWN OR S: CROUCH',
    'LES FLÈCHES VISENT LA TÊTE : ACCROUPIS-TOI': 'ARROWS AIM AT YOUR HEAD: CROUCH', 'SAUTE PAR-DESSUS LES TONNEAUX': 'JUMP OVER THE BARRELS', 'LA HERSE SE LÈVE : PASSE AU BON MOMENT': 'THE PORTCULLIS RISES: TIME YOUR PASS',
    'LE VENT FAIT ROULER LES TONNEAUX': 'THE WIND MAKES BARRELS ROLL', 'HAUT : GRIMPE AUX COLONNES': 'UP: CLIMB THE COLUMNS', 'SAUTE CONTRE LE MUR ET ACCROCHE-TOI': 'JUMP AGAINST THE WALL AND HOLD ON',
    'UNE GOUTTE SE FORME : ATTENDS': 'A DROP IS FORMING: WAIT', "LES CORNICHES S'EFFRITENT : AVANCE": 'THE LEDGES CRUMBLE: KEEP MOVING', 'LES GARGOUILLES COULENT PLUS SOUVENT': 'GARGOYLES DRIP MORE OFTEN',
    'MONTE SUR LES ÉTALS QUI BOUGENT': 'HOP ON THE MOVING STALLS', 'CERTAINS ÉTALS MONTENT': 'SOME STALLS GO UP',
    // --- lieux : noms et éléments (en majuscules) ---
    'JARDIN DES PLANTES': 'JARDIN DES PLANTES', 'CHÂTEAU DES DUCS DE BRETAGNE': 'CASTLE OF THE DUKES OF BRITTANY', 'CATHÉDRALE SAINT-PIERRE-ET-SAINT-PAUL': 'ST PETER AND ST PAUL CATHEDRAL',
    'QUARTIER DU BOUFFAY': 'BOUFFAY QUARTER', 'ÎLE FEYDEAU': 'FEYDEAU ISLAND', 'PASSAGE POMMERAYE': 'PASSAGE POMMERAYE', 'PLACE GRASLIN': 'PLACE GRASLIN',
    "MÉMORIAL DE L'ABOLITION DE L'ESCLAVAGE": 'MEMORIAL TO THE ABOLITION OF SLAVERY', "MACHINES DE L'ÎLE": 'MACHINES OF THE ISLE', 'PARC DES CHANTIERS': 'SHIPYARDS PARK', 'ANNEAUX DE BUREN': 'BUREN RINGS',
    'HANGAR À BANANES': 'HANGAR À BANANES', 'TOUR LU': 'TOUR LU',
    'PALMARIUM (SERRE)': 'PALMARIUM (GREENHOUSE)', 'REMPARTS ET TOURS': 'RAMPARTS AND TOWERS', 'FAÇADE ET DEUX TOURS': 'FACADE AND TWO TOWERS', 'MAISON DU 7 RUE DE LA JUIVERIE': 'HOUSE AT 7 RUE DE LA JUIVERIE',
    "FAÇADES DES HÔTELS D'ARMATEURS": "SHIPOWNERS' TOWNHOUSE FACADES", 'VERRIÈRE ET ESCALIER': 'GLASS ROOF AND STAIRCASE', 'FAÇADE DU GRAND THÉÂTRE': 'GRAND THÉÂTRE FACADE', 'PLAQUES DE VERRE DU QUAI': 'GLASS PLATES OF THE QUAY',
    'GRAND ÉLÉPHANT': 'GREAT ELEPHANT', 'GRUE JAUNE DES CHANTIERS': 'YELLOW SHIPYARD CRANE', 'LES ANNEAUX': 'THE RINGS', 'LE HANGAR DU QUAI': 'THE QUAYSIDE HANGAR', 'LA TOUR ET SA COUPOLE': 'THE TOWER AND ITS DOME'
  },
  patterns: [
    [/^> (.+)$/, function (m, t) { return '> ' + t(m[1]); }],
    [/^< (.+) >$/, function (m, t) { return '< ' + t(m[1]) + ' >'; }],
    [/^FICHE DU LIEU (\d+)$/, function (m) { return 'ABOUT THE PLACE ' + m[1]; }],
    [/^ÉTAPE (\d+) \/ 12$/, function (m) { return 'STAGE ' + m[1] + ' / 12'; }],
    [/^ÉTAPE (\d+) · (.+)$/, function (m, t) { return 'STAGE ' + m[1] + ' · ' + t(m[2]); }],
    [/^(\d+)\/(\d+) (.+)$/, function (m, t) { return m[1] + '/' + m[2] + ' ' + t(m[3]); }],
    [/^PIXELS (\d+)\/(\d+)$/, function (m) { return 'PIXELS ' + m[1] + '/' + m[2]; }],
    [/^TEMPS (\d+:\d\d)$/, function (m) { return 'TIME ' + m[1]; }],
    [/^MORTS (\d+)$/, function (m) { return 'DEATHS ' + m[1]; }],
    [/^(\d+)\/(\d+) NIVEAUX$/, function (m) { return m[1] + '/' + m[2] + ' LEVELS'; }],
    [/^IL Y A (\d+) (MIN|H)$/, function (m) { return m[1] + ' ' + m[2] + ' AGO'; }],
    [/^MODÈLE (\d+)\/(\d+)$/, function (m) { return 'MODEL ' + m[1] + '/' + m[2]; }],
    [/^(-?\d+)° (.+)$/, function (m, t) { return m[1] + '° ' + t(m[2]); }],
    [/^(\d\d) (.+?)( ?\.)?$/, function (m, t) { return m[1] + ' ' + t(m[2]) + (m[3] || ''); }],
    [/^(MÉTÉO TEST|TEST) : (.+)$/, function (m) { return (m[1] === 'TEST' ? 'TEST' : 'TEST WEATHER') + ' : ' + m[2]; }]
  ],
  /** Lieux : nom, élément, notice courte et résumé (paragraphes), par identifiant de lieu. */
  places: {
    'jardin-des-plantes': {
      notice: "Botanical garden of Nantes, facing the station. Greenhouses, camellias and tall trees make it a haven of greenery in the city centre. First step of the green line.",
      summary: [
        "The Jardin des Plantes is Nantes's botanical garden. It opens right opposite the station: in a few steps you go from the forecourt, its tram stops and glass facades, to the shade of tall trees.",
        "Its greenhouses shelter plants from warmer climates. The most impressive, the Palmarium, is a large greenhouse of metal and glass crowned with domes; its blinds come down to protect the plants from the sun. This is what the level rebuilds, pixel by pixel, from the ground up, like a growing plant.",
        "Along the paths: a pond and its fountain, flower beds renewed with the seasons, lawns, and contemporary artworks set in the garden, including large topiaries and a wooden figure.",
        "First step of the green line, the garden is a breath of fresh air in the heart of the city."
      ]
    },
    'cathedrale': { notice: "Gothic building whose construction began in 1434 and ended in the 19th century. It holds the tomb of Francis II. Its white stone nave is very tall." },
    'chateau': { notice: "Fortress of the Dukes of Brittany, rebuilt in the late 15th century by Francis II then Anne of Brittany. Its tuffeau ramparts now house the Nantes history museum." },
    'feydeau': { notice: "Former island of the Loire, joined to the city in the 20th century. Its 18th-century shipowners' townhouses, with mascaron-decorated facades, lean slightly." },
    'pommeraye': { notice: "Shopping arcade opened in 1843, on three levels linked by a monumental staircase. Glass roof, statues and decoration make it a famous covered passage." },
    'graslin': { notice: "Square dominated by the Grand Théâtre, neoclassical, completed in 1788. Its Corinthian-columned facade is crowned with statues of muses." },
    'memorial': { notice: "Memorial on the banks of the Loire recalling Nantes's role in the slave trade and the story of its abolition. It combines quay, glass and engraved texts." },
    'machines': { notice: "Workshop-show set in the former shipyards. The Great Elephant, a mechanical giant of wood and steel, carries visitors around the island." },
    'chantiers': { notice: "Park laid out on the former shipyard site, in the heart of the Île de Nantes. Cranes and industrial remains dialogue with the gardens." },
    'buren': { notice: "Public art installation by Daniel Buren on the Quai des Antilles, made of luminous rings that punctuate the bank of the Loire." },
    'hangar': { notice: "Former port warehouse where bananas from the Antilles passed through, converted into a place for restaurants, culture and leisure on the Loire." },
    'tour-lu': { notice: "Tower of the former LU biscuit factory, opposite the castle. With its dome, it signalled the factory by the water; the building now houses a cultural venue, the Lieu Unique." }
  }
};
