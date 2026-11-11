/** Géométrie exacte en pixels et mécanismes des GZones. Les chaînes de conception ne sont jamais évaluées. */
GP.GZoneRuntime = (function () {
  function identifier(value) { return typeof value === 'string' && value.length > 0; }
  function associate(surfaces, visuals) {
    surfaces.forEach(function (surface) {
      var keys = [surface.sur, surface.id].filter(identifier);
      surface.visuals = visuals.filter(function (visual) {
        return keys.some(function (key) {
          if (identifier(visual.surfaceId) && visual.surfaceId === key) return true;
          if (!identifier(visual.id)) return false;
          if (visual.id === key) return true;
          // Pièces déclarées « gabare1a/b », « gear1a/b » : jamais gear10 ni un préfixe arbitraire.
          return /\d$/.test(key) && visual.id.indexOf(key) === 0 && /^[a-z]$/.test(visual.id.slice(key.length));
        });
      });
    });
    visuals.forEach(function (visual) {
      var owners = surfaces.filter(function (s) { return s.visuals.indexOf(visual) >= 0; });
      // Une serre peut avoir plusieurs pads STATIQUES sur une silhouette unique, pas deux propriétaires animés.
      if (owners.length > 1 && owners.some(function (s) { return s.mecanique && s.mecanique.type; })) {
        throw new Error('Un décor mobile appartient à plusieurs plateformes : ' + (visual.id || visual.surfaceId));
      }
    });
  }
  function plan(L) {
    var d=L.gzone, p={masses:[],surfaces:[],visuals:[],columns:[],galleries:[]}, all=d.plateformes, ids={};
    all.forEach(function(a){if(a.id&&a.type)ids[a.id]=a;});
    all.forEach(function(a){
      if(!a.type){p.visuals.push(Object.assign({},a));return;}
      if(a.type==='masse'){
        var b=Object.assign({},a,{bottom:a.fill_to===undefined?(a.to===undefined?d.hauteur:a.to):a.fill_to});
        b.decorative=!!a.fond||!!a.pilier;
        b.material=GP.LevelStyles.material(d,b);
        b.oneWay=!!a.pilier||((a.w||1)<=1&&b.bottom-a.y>4)||/façade.*pilier/.test(a.note||'');
        p.masses.push(b);return;
      }
      if(a.sur&&a.sur!==a.id&&ids[a.sur])return; // _fin/_haut : guides, jamais un deuxième corps fantôme
      if(a.type==='colonne'){
        p.columns.push(a);var info=GP.Sprites.info(a.sprite_chapiteau);
        p.surfaces.push({x:a.x,y:a.y_top,w:info?info.w/16:2,sprite:a.sprite_chapiteau,id:a.id,column:true});return;
      }
      if(a.type==='galerie')p.galleries.push(a);
      p.surfaces.push(Object.assign({},a));
    });
    p.visuals=p.visuals.concat((d.decor||[]).map(function(a){return Object.assign({},a);}));
    (d.mobiles||[]).forEach(function(a){
      if(a.kind==='colonne'){
        p.visuals.push({sprite:a.sprite,x:a.x1,y:a.y1,id:a.id});
        var info=GP.Sprites.info(a.sprite);
        if(!a.inner&&info)p.surfaces.push({id:a.id,x:a.x1,y:a.y1+1-info.h/16,w:info.w/16,sur:a.id,sprite:a.sprite});
        return;
      }
      p.surfaces.push({id:a.id,x:a.x1,y:a.y1,w:a.w||2,sprite:a.sprite,sprite_set:a.sprite_set,
        mecanique:{type:a.kind==='dalle_verre'?'fragile':a.kind==='chariot_grue'?'chariot':a.kind==='engrenage'?'rotation':'va-et-vient',
          de:[a.x1,a.y1],vers:[a.x2,a.y2],vitesse_tuiles_s:a.v||2,periode_s:a.periode_s,
          sens:a.rotation,fragile:a.fragile_s?{cede_apres_s:a.fragile_s,regenere_apres_s:3}:null},raw:a});
    });
    p.visuals.forEach(function(v){GP.LevelStyles.decorate(d,v);});
    p.surfaces.forEach(function(s){GP.LevelStyles.surface(d,s,p.visuals);});
    GP.LevelStyles.bindVisuals(d,p.visuals);
    associate(p.surfaces,p.visuals);
    L.plats=p.surfaces.filter(function(s){return Number.isFinite(s.y)&&!(s.mecanique&&s.mecanique.leurre);}).concat(p.masses.filter(function(p){return !p.decorative;})).map(function(s){return {x:s.x,y:s.y,w:s.w||1};});
    return p;
  }
  function Runtime(g) {
    this.g=g;this.d=g.L.gzone;this.plan=g.gzPlan;this.surfaces=[];this.solids=[];this.hazards=[];this.enemies=[];this.time=0;this.immune=0;this.impulseMs=0;this.impulseVX=0;
    this.make();
  }
  Runtime.prototype.box=function(x,y,w,h,oneWay){
    var o=this.g.add.zone(x,y,w,h).setOrigin(0),b=this.g.platformBody(o,oneWay);
    return {obj:o,body:b,x:x,y:y,w:w,h:h,oneWay:!!oneWay};
  };
  Runtime.prototype.solidAt=function(x,y){return this.solids.some(function(s){return !s.oneWay&&s.body.enable&&x>=s.body.x&&x<s.body.right&&y>=s.body.y&&y<s.body.bottom;});};
  Runtime.prototype.make=function(){
    var self=this,g=this.g,L=g.L,d=this.d;
    this.plan.masses.forEach(function(p){
      if(p.bottom<=p.y||p.decorative)return;
      var b=self.box(p.x*16,p.y*16,(p.w||1)*16,(p.bottom-p.y)*16,p.oneWay);b.grab=p.grab!==false;self.solids.push(b);
    });
    L.roofs.forEach(function(r){self.solids.push(self.box(r.x,r.y,r.w,r.h,false));});
    this.plan.surfaces.forEach(function(p,i){
      if(!Number.isFinite(p.y))return;
      var s=self.box(p.x*16,p.y*16,(p.w||1)*16,6,true);s.def=p;s.mechanic=p.mecanique||{};s.progress=0;s.timer=0;s.gone=0;s.imageOffsetX=0;
      if(p.sprite_set){s.img=g.add.image(s.x,s.y,g.rowTexture('gz_surface_'+i,p.sprite_set,Math.ceil(p.w||1))).setOrigin(0).setDepth(9);}
      else if(!p.visuals.length){
        var key=GP.GZoneArt.key(g,p.sprite);
        if(key){
          var im=g.textures.get(key).getSourceImage(),info=GP.Sprites.info(p.sprite);
          if(p.type==='galerie'||(info&&info.tile_x)){
            var o=GP.PixelArt.canvas(s.w,im.height);
            for(var x=0;x<s.w;x+=im.width)o.ctx.drawImage(im,x,0);
            GP.PixelArt.toTexture(g,'gz_single_surface_'+i,o.cv);
            s.img=g.add.image(s.x,s.y,'gz_single_surface_'+i).setOrigin(0).setDepth(9);
          }else{
            s.imageOffsetX=(s.w-im.width)/2;
            s.img=g.add.image(s.x+s.imageOffsetX,s.y,key).setOrigin(0).setDepth(9);
          }
        }
      }
      if(!s.img&&!p.visuals.length){s.placeholder=true;s.img=g.add.rectangle(s.x,s.y,s.w,5,GP.int(GP.PAL.p)).setOrigin(0).setDepth(9);}
      if(s.mechanic.leurre||s.mechanic.solide===false){s.body.enable=false;if(s.img)s.img.setAlpha(0.25);}
      s.visuals=p.visuals.map(function(v){return {img:v.rendered,dx:(v.x-p.x)*16,dy:(v.y+1-p.y)*16};}).filter(function(v){return v.img;});
      if(s.mechanic.type&&s.visuals.length){
        var left=Math.min.apply(null,s.visuals.map(function(v){return s.x+v.dx;}));
        var right=Math.max.apply(null,s.visuals.map(function(v){return s.x+v.dx+v.img.width;}));
        var top=Math.min.apply(null,s.visuals.map(function(v){return s.y+v.dy-v.img.height;}));
        var shiftX=s.x+s.w/2-(left+right)/2,shiftY=s.y-top;
        s.visuals.forEach(function(v){v.dx+=shiftX;v.dy+=shiftY;v.img.setPosition(s.x+v.dx,s.y+v.dy);});
      }
      if(s.mechanic.type==='rotation')s.visuals.forEach(function(v){v.dx+=v.img.width/2;v.dy-=v.img.height/2;v.img.setOrigin(0.5);});
      var rail=p.raw&&p.raw.rail_y;
      if(Number.isFinite(rail))s.railY=rail*16;
      else if(s.mechanic.type==='oscillation'){
        var roof=L.roofs.find(function(r){return s.x>=r.x&&s.x+s.w<=r.x+r.w&&r.y+r.h<s.y;});
        if(roof)s.railY=roof.y+roof.h;
      }
      if(Number.isFinite(s.railY))s.cable=g.add.graphics().setDepth(4);
      self.surfaces.push(s);
    });
    this.plan.columns.forEach(function(p){
      g.climbZones.push({x0:p.x*16,x1:(p.x+2)*16,y0:p.y_top*16-4,y1:p.sol_y*16,cx:p.x*16+8});
    });
    d.dangers.forEach(function(p,i){
      if(p.kind==='eau_mortelle')return;
      var key=GP.GZoneArt.key(g,p.sprite), info=key&&GP.Sprites.info(key), w=(p.w||1)*16;
      var h={def:p,x:p.x*16,y:(p.y+1)*16,w:w,h:Math.min(info?info.h:12,16),phase:i*0.37};
      h.graphics=g.add.graphics().setDepth(10);
      if(key)h.img=g.add.image(h.x,h.y,key).setOrigin(0,1).setDepth(8);
      self.hazards.push(h);
    });
    (d.ennemis||[]).forEach(function(e){
      var key=GP.GZoneArt.key(g,e.sprite);if(!key)return;
      var img=g.add.image((e.x===undefined?e.x1:e.x)*16,(e.y===undefined?e.y1:e.y)*16+16,key).setOrigin(0,1).setDepth(10);
      self.enemies.push({def:e,img:img,dir:1});
    });
    this.boosts=(d.boosts||[]).map(function(b){var key=GP.GZoneArt.key(g,b.sprite);if(key)g.add.image(b.x*16,(b.y+1)*16,key).setOrigin(0,1).setDepth(8);return {x:b.x*16,y:(b.top===undefined?b.y:b.top)*16,w:(b.w||2)*16,boost:b.hauteur||4.5,cooldown:0};});
    this.rings=(d.anneaux||[]).map(function(r){
      var x=(r.cx===undefined?r.x:r.cx)*16,y=(r.cy===undefined?r.y:r.cy)*16;
      if(r.id==='r12'&&d.num===8)x=175*16;
      var graphic=g.add.graphics().setDepth(32);return {def:r,x:x,y:y,g:graphic,cooldown:0};
    });
    this.currents=(d.courants||[]).slice();
    // Déployer le rebond prévu par les GZones v2 sur leurs parasols, pas sur tout décor arbitraire.
    this.plan.visuals.forEach(function(v){if(v.sprite==='graslin_parasol_cafe'&&!self.boosts.some(function(b){return b.x===v.x*16;})) self.boosts.push({x:v.x*16,y:v.y*16,w:32,boost:4.5,cooldown:0});});
    this.currentFX=g.add.graphics().setDepth(32);
    this.signs=(d.sequences||[]).map(function(s){
      var x=typeof s.stele==='string'?Number((/\d+/.exec(s.stele)||[0])[0]):0;
      return GP.UI.txt(g,x*16,120,s.valeurs.map(function(v){return v==='Haut'?'↑':v==='Bas'?'↓':'→';}).join('  '),GP.PAL.c,{backgroundColor:GP.PAL.k,padding:{x:4,y:4}}).setDepth(40);
    });
    this.boss=L.boss?new GP.LevelBoss(g,this):null;
  };
  Runtime.prototype.on=function(s){var b=this.g.player.body;return s.body.enable&&b.right>s.body.x+1&&b.x<s.body.right-1&&Math.abs(b.bottom-s.body.y)<4&&(b.blocked.down||b.touching.down);};
  Runtime.prototype.update=function(dt){
    var self=this,g=this.g,b=g.player.body,env=g.env,d=this.d;this.time+=dt;this.immune=Math.max(0,this.immune-dt);this.impulseMs=Math.max(0,this.impulseMs-dt);this.justBoosted=false;g.surfaceMotion=0;
    this.surfaces.forEach(function(s){
      var m=s.mechanic,on=self.on(s), nx=s.x,ny=s.y;
      if(m.type==='flotteur'){
        var max=(env.snow?0.5:m.enfonce_tuiles||1.5)*16;s.progress=Phaser.Math.Clamp(s.progress+(on?dt/(m.duree_s||1.5)/1000:-dt/(m.remonte_s||2)/1000),0,1);ny+=max*s.progress;
      } else if(m.type==='rotation'){
        if(on)g.surfaceMotion=(m.sens==='anti-horaire'?-1:1)*(m.vitesse_tuiles_s||1.5)*16*(env.sun?1.15:env.snow?0.75:1);
        s.visuals.forEach(function(v){if(!GP.reducedMotion)v.img.rotation+=dt/1000*(m.sens==='anti-horaire'?-1:1);});
      } else if(m.type==='va-et-vient'||m.type==='oscillation'||m.type==='chariot'||m.type==='ascenseur'){
        var from=m.de||[s.def.x,m.y_bas===undefined?s.def.y:m.y_bas], to=m.vers||[from[0]+(m.axe==='x'?(m.course_tuiles||m.amplitude_tuiles||3):0),m.y_haut===undefined?from[1]:m.y_haut];
        if(m.axe==='diagonale'&&m.vers)to=m.vers;
        var speed=(m.vitesse_tuiles_s||2)*16*(env.snow?0.85:env.sun?1.1:1),length=Math.max(1,Math.hypot((to[0]-from[0])*16,(to[1]-from[1])*16));
        var t;if(m.type==='chariot'||m.type==='ascenseur'){s.progress=Phaser.Math.Clamp(s.progress+(on?1:-0.5)*speed*dt/1000/length,0,1);t=s.progress;}
        else t=0.5-0.5*Math.cos(this.time/((m.periode_s||length/speed*2)*1000)*Math.PI*2);
        nx=from[0]*16+(to[0]-from[0])*16*t;ny=from[1]*16+(to[1]-from[1])*16*t;
      }
      // Transport explicite, puis corps synchronisé : le collider reste exactement sous l'image.
      var dx=nx-s.body.x,dy=ny-s.body.y;
      if(on&&(Math.abs(dx)>0.001||Math.abs(dy)>0.001)){
        var vx=b.velocity.x,vy=b.velocity.y;
        b.reset(g.player.x+dx,g.player.y+dy);b.setVelocity(vx,vy);b.touching.down=true;
      }
      s.obj.setPosition(nx,ny);s.body.updateFromGameObject();if(s.img)s.img.setPosition(nx+s.imageOffsetX,ny);
      s.visuals.forEach(function(v){v.img.setPosition(nx+v.dx,ny+v.dy);});
      if(s.cable){s.cable.clear();s.cable.lineStyle(1,GP.int(GP.PAL.m));s.cable.lineBetween(nx+s.w/2,s.railY,nx+s.w/2,ny);}
      var fragile=m.fragile||(m.type==='fragile'?{cede_apres_s:0.8,regenere_apres_s:3}:null);
      if(fragile){
        if(s.gone>0){s.gone-=dt;if(s.gone<=0){s.body.enable=true;s.timer=0;if(s.img)s.img.setAlpha(1);}}
        else if(on){s.timer+=dt;if(s.img)s.img.setTint(GP.int(GP.PAL.y));if(s.timer>fragile.cede_apres_s*1000){s.body.enable=false;s.gone=fragile.regenere_apres_s*1000;if(s.img)s.img.setAlpha(0.15);}}
      }
      if(on&&s.def.glisse_tuiles_s)g.surfaceMotion+=s.def.glisse_tuiles_s*16*(env.rain?1.2:1);
    },this);
    this.boosts.forEach(function(p){
      p.cooldown-=dt;if(p.cooldown>0)return;
      if(b.velocity.y>=0&&b.right>p.x&&b.x<p.x+p.w&&b.bottom>=p.y-4&&b.bottom<=p.y+12){
        var height=p.boost;
        if(d.num===5){height=env.sun?5:env.rain?3.8:p.boost;if(env.snow&&!p.snowCleared){height=2.5;p.snowCleared=true;}}
        b.setVelocityY(-Math.sqrt(2*GP.Tuning.worldGravity*height*16));g.jumping=true;self.justBoosted=true;p.cooldown=400;
      }
    });
    this.rings.forEach(function(r){
      r.cooldown-=dt;var a=r.def,color=a.couleur||'rouge';if(a.alternant||a.couleur==='alternant')color=Math.floor(self.time/(env.snow?3500:2500))%2?'bleu':'rouge';
      var col=color==='bleu'?GP.PAL.l:color==='vert'?GP.PAL.g:GP.PAL.r;r.g.clear();r.g.lineStyle(2,GP.int(col));r.g.strokeCircle(r.x,r.y,16);
      r.g.lineStyle(1,GP.int(GP.PAL.w));
      if(color==='bleu'){r.g.lineBetween(r.x,r.y+5,r.x,r.y-6);r.g.lineBetween(r.x,r.y-6,r.x-4,r.y-2);}
      else {r.g.lineBetween(r.x-5,r.y,r.x+6,r.y);r.g.lineBetween(r.x+6,r.y,r.x+2,r.y-4);}
      if(r.cooldown<=0&&Math.hypot(b.center.x-r.x,b.center.y-r.y)<18){
        // Le fragment central appartient à l'interaction, pas à une seconde cible après propulsion.
        g.pixels.forEach(function(p){if(!p.taken&&Math.hypot(p.x-r.x,p.y-r.y)<20)g.collect(p);});
        self.lastRing={x:r.x,y:r.y};
        if(a.vers){
          var next=self.rings.find(function(n){return n.x>r.x+16&&n.x<=a.vers[0]*16&&n.def.vers&&n.def.vers[0]===a.vers[0]&&n.def.vers[1]===a.vers[1];});
          var targetX=next?next.x:a.vers[0]*16+8,targetY=next?next.y+8:a.vers[1]*16;
          var dx=targetX-g.player.x,dy=targetY-b.bottom,t=Math.max(color==='bleu'?0.7:0.55,Math.abs(dx)/390);
          self.impulseVX=dx/t;self.impulseMs=t*1000;b.setVelocity(self.impulseVX,dy/t-GP.Tuning.worldGravity*t/2);
        }
        else b.setVelocityY(-Math.sqrt(2*GP.Tuning.worldGravity*(a.haut||4)*16));
        r.cooldown=1000;self.immune=650;g.jumping=true;
      }
    });
    var current=this.currents.find(function(c){return b.center.x>=c.x*16&&b.center.x<(c.x+c.w)*16&&b.bottom>=Math.min(c.y1,c.y2)*16&&b.y<=Math.max(c.y1,c.y2)*16;});
    b.setGravityY(current?-GP.Tuning.worldGravity*0.5:0);b.setMaxVelocity(400,current?650:g.TUNE.maxFall);
    if(current&&b.velocity.y>160)b.setVelocityY(160); // borne de descente, pas de limitation du saut ascendant
    this.currentFX.clear();this.currents.forEach(function(c){self.currentFX.fillStyle(GP.int(GP.PAL.y),0.7);for(var i=0;i<12;i++){var y=Math.min(c.y1,c.y2)*16+(i*17+(GP.reducedMotion?0:-self.time/40))%Math.max(1,Math.abs(c.y1-c.y2)*16);self.currentFX.fillRect(c.x*16+4+i%3*12,y,2,2);}});
    if(this.immune)g.phy.airPush=0;
    this.hazards.forEach(function(h){self.hazard(h,dt);});
    this.enemies.forEach(function(e){
      var p=e.def,img=e.img, speed=(p.vitesse||2)*16;
      if(p.type==='patrouille_verticale'){img.y+=e.dir*speed*dt/1000;if(img.y>p.y2*16+16){img.y=p.y2*16+16;e.dir=-1;}if(img.y<p.y1*16+16){img.y=p.y1*16+16;e.dir=1;}}
      else if(p.x1!==undefined){img.x+=e.dir*speed*dt/1000;if(img.x>p.x2*16){img.x=p.x2*16;e.dir=-1;}if(img.x<p.x1*16){img.x=p.x1*16;e.dir=1;}}
      img.setFlipX(e.dir<0);
      if(!p.inoffensif&&p.type!=='ambiance'&&self.hit({x:img.x+2,y:img.y-10,w:Math.min(12,img.width-2),h:8}))g.die('ATTENTION AU PASSAGE !');
    });
    if(this.boss)this.boss.update(dt);
  };
  Runtime.prototype.hit=function(r){var b=this.g.player.body;return this.g.invuln<=0&&!this.g.dying&&b.x<r.x+r.w&&b.right>r.x&&b.y<r.y+r.h&&b.bottom>r.y;};
  Runtime.prototype.hazard=function(h,dt){
    var g=this.g,p=h.def,c=p.cycle||{},cyc=p.kind==='cyclique',period=(c.periode_s||3)*1000;
    var active=(c.actif_s||c.haute_s||1)*1000;if(g.env.rain&&p.sprite==='vapeur'&&g.coverAt(h.x,h.y-8).rain<1)active*=0.7;
    var phase=(this.time+(c.decalage_s||h.phase)*1000)%period,warning=(c.preavis_s||c.alerte_s||0.6)*1000;
    h.graphics.clear();
    if(p.sprite==='hangar_porte_coulissante'){
      var low=phase<1500, height=h.img?h.img.height:48;
      if(h.img)h.img.y=h.y-(low?12:height);
      // Porte non létale : passage accroupi conservé, pas de guillotine invisible.
      if(!h.door){h.door=this.box(h.x,h.y-height,h.img?h.img.width:h.w,height,false);h.door.grab=false;this.solids.push(h.door);}
      h.door.obj.setPosition(h.x,h.y-height-(low?12:height));h.door.body.updateFromGameObject();return;
    }
    if(c.type==='maree'){
      // Métaphore lente annoncée : ralentissement, jamais mise à mort pour une lecture au Mémorial.
      var rise=(1-Math.cos(phase/period*Math.PI*2))*4;
      h.graphics.fillStyle(GP.int(GP.PAL.b),0.5);h.graphics.fillRect(h.x,h.y-rise,h.w,4+rise);
      if(this.hit({x:h.x,y:h.y-12,w:h.w,h:16}))g.phy.accelGround=Math.min(g.phy.accelGround,700);return;
    }
    var on=!cyc||phase<active;
    if(cyc){
      var height=(c.hauteur_tuiles||3)*16,y=c.top_y===undefined?h.y-height:c.top_y*16;
      var box=c.direction?{x:h.x-(c.portee_tuiles||3)*16,y:h.y-15,w:(c.portee_tuiles||3)*16,h:4}:{x:h.x+3,y:y,w:10,h:height};
      if(p.sprite==='jardin_jet_eau'&&g.env.snow){
        if(!h.ice)h.ice=this.box(h.x,y,32,5,true);h.ice.body.enable=true;h.graphics.fillStyle(GP.int(GP.PAL.l));h.graphics.fillRect(h.x,y,32,5);on=false;
      }else if(h.ice)h.ice.body.enable=false;
      if(on){h.graphics.fillStyle(GP.int(p.sprite==='vapeur'?GP.PAL.c:GP.PAL.l),0.85);h.graphics.fillRect(box.x,box.y,box.w,box.h);if(this.hit(box))g.die('OBSERVE LE SIGNAL AVANT LE JET !');}
      else if(phase>period-warning){h.graphics.fillStyle(GP.int(GP.PAL.y));h.graphics.fillRect(h.x,h.y-4,10,3);}
      return;
    }
    if(this.hit({x:h.x+2,y:h.y-8,w:Math.max(8,h.w-4),h:8}))g.die('ATTENTION À L’OBSTACLE !');
  };
  return Object.assign(Runtime,{plan:plan,associate:associate});
})();
