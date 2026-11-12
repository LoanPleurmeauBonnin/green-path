/**
 * Green Path — sketch minimal (J1, PATRIMOINE.EXE / NANTES 001)
 *
 * SOURCE : un lieu du corpus de 12 patrimoines de Green Path, ici le Château des ducs de Bretagne (masse, seuils, élévations),
 *          pris comme exemple de la règle commune ; chaque autre lieu a sa propre règle (docs/grammaire.md).
 * GRAMMAIRE : une grille de cellules 48×32 ; chaque pixel « collecté » révèle un groupe de cellules,
 *             dans l'ordre assise basse → centre → côtés (le rythme plein / vide du château).
 * DATA : la météo de Nantes (Open-Meteo) pilote la pluie (précipitations), la dérive (vent) et le ciel (jour / nuit).
 *        Hors ligne ou si l'API échoue : valeurs neutres de secours.
 * INTERACTION : clic, touche ESPACE ou ↑ = collecter un pixel ; R = recommencer ; M = météo simulée suivante.
 *
 * Coller ce fichier tel quel dans l'éditeur p5.js ou sur OpenProcessing (aucune autre dépendance).
 */
var COLS = 48, ROWS = 32, CELL = 12;
var cells = [];            // cellules pleines du château, triées dans l'ordre de révélation
var revealed = 0;          // nombre de cellules déjà révélées
var STEP = 40;             // cellules révélées à chaque pixel collecté
var drops = [];
var weather = { precip: 0, wind: 0, day: true, label: 'MÉTÉO NEUTRE (secours)' };
var SIMS = [
  { precip: 0, wind: 8, day: true, label: 'SOLEIL' },
  { precip: 2.5, wind: 18, day: true, label: 'PLUIE' },
  { precip: 6, wind: 60, day: true, label: 'ORAGE (vent fort)' },
  { precip: 0, wind: 5, day: false, label: 'NUIT' }
];
var sim = -1;

/** Forme du château : tours, courtine, logis central avec toit, porte (seuil vide). */
function solid(x, y) {
  var tourG = x >= 3 && x <= 12 && y >= 9, tourD = x >= 35 && x <= 44 && y >= 9;
  var crenG = tourG && y <= 10 && x % 2 === 1, crenD = tourD && y <= 10 && x % 2 === 0;
  var tour = (tourG || tourD) && (y > 10 || crenG || crenD);
  var courtine = x >= 12 && x <= 35 && y >= 20;
  var logis = x >= 17 && x <= 30 && y >= 13;
  var toit = y >= 8 && y < 13 && abs(x - 23.5) <= (y - 8) * 1.4 + 1;
  var porte = x >= 21 && x <= 26 && y >= 25;
  return (tour || courtine || logis || toit) && !porte;
}

function setup() {
  createCanvas(COLS * CELL, ROWS * CELL).parent(document.querySelector('main'));
  noStroke(); textFont('monospace'); textSize(12);
  for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) if (solid(x, y)) cells.push({ x: x, y: y, key: -y * 100 + abs(x - 23.5) });
  cells.sort(function (a, b) { return a.key - b.key; });   // bas d'abord (assise), puis du centre vers les côtés
  loadWeather();
}

/** Open-Meteo avec délai de 4 s ; en cas d'échec on garde la météo de secours. */
function loadWeather() {
  var url = 'https://api.open-meteo.com/v1/forecast?latitude=47.2184&longitude=-1.5536&current=precipitation,wind_speed_10m,is_day&timezone=Europe%2FParis';
  var timer = new AbortController(); setTimeout(function () { timer.abort(); }, 4000);
  fetch(url, { signal: timer.signal }).then(function (r) { return r.json(); }).then(function (j) {
    var c = j.current;
    if (typeof c.precipitation !== 'number' || typeof c.wind_speed_10m !== 'number') throw new Error('réponse incomplète');
    weather = { precip: c.precipitation, wind: c.wind_speed_10m, day: c.is_day === 1, label: 'NANTES EN DIRECT' };
  }).catch(function () { /* secours : météo neutre déjà en place */ });
}

function draw() {
  background(weather.day ? '#8fc4ec' : '#141830');
  if (!weather.day) { fill('#efe3bd'); for (var s = 0; s < 40; s++) rect((s * 97) % width, (s * 53) % (height / 2), 2, 2); }
  fill('#2f8f45'); rect(0, 31 * CELL, width, CELL);                         // sol
  for (var i = 0; i < revealed && i < cells.length; i++) {                  // cellules révélées
    var c = cells[i];
    fill(c.y < 11 && c.x > 16 && c.x < 31 ? '#4a5a8a' : '#e8dcb0');          // ardoise du toit, tuffeau ailleurs
    rect(c.x * CELL, c.y * CELL, CELL, CELL);
  }
  for (var k = 0; k < cells.length && k >= revealed; k += 7) {              // fantôme des cellules à venir
    fill(255, 255, 255, 25); rect(cells[k].x * CELL, cells[k].y * CELL, CELL, CELL);
  }
  rain();
  fill('#efe3bd'); rect(0, 0, width, 22);
  fill('#141830'); text(weather.label + ' · pluie ' + nf(weather.precip, 1, 1) + ' mm · vent ' + round(weather.wind) + ' km/h · ' + round(100 * revealed / cells.length) + ' %', 8, 15);
}

/** Précipitations → nombre de gouttes ; vent → dérive horizontale. Sous le toit du logis la pluie est arrêtée (abri). */
function rain() {
  var target = weather.precip <= 0 ? 0 : min(250, 40 + weather.precip * 30), drift = constrain(weather.wind / 10, -8, 8);
  while (drops.length < target) drops.push({ x: random(width), y: random(-height, 0), v: random(5, 9) });
  if (drops.length > target) drops.length = target;
  stroke(weather.day ? '#3b6ea5' : '#8fc4ec');
  drops.forEach(function (d) {
    var gx = floor(d.x / CELL), gy = floor(d.y / CELL), covered = solid(gx, gy) && gy >= 13 && gx >= 17 && gx <= 30;
    if (!covered) line(d.x, d.y, d.x + drift * 0.6, d.y + 6);
    d.x += drift * 0.5; d.y += d.v;
    if (d.y > height || d.x > width + 20 || d.x < -20) { d.y = random(-40, 0); d.x = random(width); }
  });
  noStroke();
}

function collect() { revealed = min(cells.length, revealed + STEP); }
function mousePressed() { collect(); }
function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW) collect();
  if (key === 'r' || key === 'R') revealed = 0;
  if (key === 'm' || key === 'M') { sim = (sim + 1) % (SIMS.length + 1); weather = sim < SIMS.length ? Object.assign({}, SIMS[sim]) : weather; if (sim === SIMS.length) { sim = -1; loadWeather(); } }
}
