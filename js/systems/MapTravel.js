/** Déplacement sur un rail 1D : cible modifiable sans repartir du dernier nœud atteint.
 * Pas de physique de niveau ici. Le modèle partage le profil y (MapArt.walkY) avec le rendu.
 */
GP.MapTravel = function (index, count, origin, gap, heightAt) {
  this.count = count; this.origin = origin; this.gap = gap;
  this.x = origin + index * gap; this.target = index; this.moving = false; this.open = false;
  this.heightAt = heightAt || function () { return 0; }; this.y = this.heightAt(this.x);
};
GP.MapTravel.prototype.to = function (index, open) {
  this.target = Math.max(0, Math.min(this.count - 1, index));
  this.open = !!open;
  this.moving = Math.abs(this.origin + this.target * this.gap - this.x) > 0.001;
  if (!this.moving) this.x = this.origin + this.target * this.gap;
  this.y = this.heightAt(this.x);
};
GP.MapTravel.prototype.step = function (dir) {
  var position = (this.x - this.origin) / this.gap, targetX = this.origin + this.target * this.gap;
  // Une répétition dans la même direction ne saute pas de nœud ; l'autre sens retourne immédiatement.
  if (this.moving && Math.sign(targetX - this.x) === dir) return;
  var next = dir > 0 ? Math.floor(position + 0.00001) + 1 : Math.ceil(position - 0.00001) - 1;
  this.to(next, false);
};
GP.MapTravel.prototype.tick = function (delta) {
  if (!this.moving) return false;
  var target = this.origin + this.target * this.gap, distance = target - this.x;
  var amount = Math.min(Math.abs(distance), 95 * Math.min(delta, 50) / 1000);
  this.x += Math.sign(distance) * amount;
  this.moving = Math.abs(target - this.x) > 0.001;
  if (!this.moving) this.x = target;
  this.y = this.heightAt(this.x);
  return !this.moving;
};
