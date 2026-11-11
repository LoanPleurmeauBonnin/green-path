'use strict';
const { test } = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
function tuning() {
  const c = { console }; c.window = c; vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/data/tuning.js'), 'utf8').replace(/^/, 'var GP = {};\n'), c);
  return vm.runInContext('GP.Tuning', c);
}
/** Saut maintenu, intégration fine : hauteur (px) et portée horizontale (px) à vitesse de course constante. */
function jump(T) {
  const P = T.player, g = T.worldGravity, dt = 1 / 1000;
  let y = 0, vy = P.jump, x = 0, top = 0, t = 0;
  while (t < 3) {
    const apex = Math.abs(vy) < P.apexThreshold;
    vy += g * (apex ? P.apexGravityMult : 1) * dt; y += vy * dt; x += P.speed * dt; t += dt;
    top = Math.min(top, y);
    if (y >= 0 && t > 0.05) break;
  }
  return { rise: -top, reach: x, air: t };
}

test('Ressenti : les valeurs d’origine du saut et des tolérances ne bougent pas', () => {
  const T = tuning();
  assert.equal(T.worldGravity, 950); assert.equal(T.player.jump, -320); assert.equal(T.player.speed, 110);
  assert.equal(T.player.coyote, 90); assert.equal(T.player.buffer, 110);
});

test('Ressenti : la demi-gravité à l’apex reste dans les bornes que les niveaux supportent', () => {
  const T = tuning(), j = jump(T), base = jump({ worldGravity: 950, player: Object.assign({}, T.player, { apexGravityMult: 1 }) });
  // Les niveaux sont dessinés pour 3,37 tuiles de saut et ~4,6 de portée : on ne gagne pas plus d'une demi-tuile.
  assert.ok(j.rise >= base.rise && j.rise - base.rise <= 8, 'hauteur +' + (j.rise - base.rise).toFixed(1) + ' px');
  assert.ok(j.rise / 16 <= 3.6, 'saut de ' + (j.rise / 16).toFixed(2) + ' tuiles');
  assert.ok((j.reach - base.reach) / 16 <= 1, 'portée +' + ((j.reach - base.reach) / 16).toFixed(2) + ' tuile');
});

test('Ressenti : les aides restent plus petites que la zone morte de l’accroche', () => {
  const P = tuning().player;
  assert.ok(P.headCorner >= 0 && P.headCorner <= 4);
  assert.ok(P.ledgeAssist >= 0 && P.ledgeAssist <= 8, 'l’accroche commence à 8 px sous le rebord');
  assert.ok(P.apexGravityMult > 0 && P.apexGravityMult <= 1 && P.apexThreshold <= 120);
});
