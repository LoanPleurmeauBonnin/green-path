/** Trois épreuves environnementales approuvées : aucune attaque du joueur, aucun point de vie artificiel.
 * Cycle : annonce visuelle → motifs → objectif actif sans limite de temps → phase suivante.
 */
GP.LevelBoss = (function () {
  function Boss(g,rt){
    this.g=g;this.rt=rt;this.def=g.L.boss;this.phase=0;this.clock=0;this.done=false;this.started=false;this.recovery=false;this.attacks=[];
    this.art=g.add.graphics().setDepth(11);this.fx=g.add.graphics().setDepth(12);
    this.hud=GP.UI.txt(g,GP.Config.WIDTH/2,58,'',GP.PAL.c,{backgroundColor:GP.PAL.k,padding:{x:4,y:3},align:'center',wordWrap:{width:GP.Config.WIDTH-24}}).setOrigin(0.5,0).setScrollFactor(0).setDepth(55);
    this.goals=this.def.goals.map(function(p,i){
      var goal={x:p.x*16+8,y:(p.y+1)*16,ladder:null};
      goal.img=g.add.graphics().setDepth(12);
      if(this.def.kind==='mould'){
        goal.ladder={x0:goal.x-4,x1:goal.x+16,y0:goal.y-8,y1:this.def.floor*16,cx:goal.x+6,active:false};g.climbZones.push(goal.ladder);
      }
      return goal;
    },this);
    if(this.def.kind==='vortex'){
      [216,232].forEach(function(x){rt.currents.push({x:x-1,w:3,y1:16,y2:4});rt.boosts.push({x:(x-1)*16,y:256,w:48,boost:6,cooldown:0});});
      this.goals.forEach(function(p){this.rt.solids.push(this.rt.box(p.x-16,p.y,32,5,true));},this);
    }
    if(this.def.kind==='elephant')this.elephant=g.add.image((172)*16,16*16,'machines_animal_mecanique').setOrigin(0,1).setDepth(2);
    var self=this;this.deathListener=function(e){if(e.type==='death'&&!self.done){self.clock=0;self.recovery=false;self.started=false;self.attacks=[];}};
    g.events.on('playtest-event',this.deathListener);g.events.once('shutdown',function(){g.events.off('playtest-event',self.deathListener);});
  }
  Boss.prototype.restore=function(saved){
    if(!saved)return;this.phase=Math.min(this.def.phases,Math.max(0,saved.phase));this.done=this.phase>=this.def.phases;
    if(this.phase>0){var p=this.goals[this.phase-1];this.g.respawn={x:p.x,y:p.y};this.g.player.body.reset(p.x,p.y);}
  };
  Boss.prototype.snapshot=function(){return {phase:this.phase};};
  Boss.prototype.patterns=function(){
    var D=this.def, x=D.start*16, end=D.end*16, floor=D.floor*16, width=end-x, phase=this.phase;
    var out=[];
    function attack(start,duration,box,kind){out.push({start:start*1000,end:(start+duration)*1000,warning:800,box:box,kind:kind});}
    if(D.kind==='elephant'){
      if(phase===0){[3,5,7].forEach(function(t,i){attack(t,1,{x:x+32+i*80,y:floor-48,w:24,h:48},'steam');});attack(10,2,{x:x,y:floor-12,w:width,h:12},'wave');}
      if(phase===1){[2,5,8].forEach(function(t,i){attack(t,1.3,{x:x,y:floor-32-i*48,w:width,h:21},'steam');});attack(11,1.5,{x:x,y:floor-12,w:width,h:12},'wave');}
      if(phase===2){[2,5,8].forEach(function(t){attack(t,1.4,{x:x,y:floor-16,w:width,h:16},'sweep');});attack(10,1.5,{x:x+width/2,y:floor-80,w:48,h:80},'steam');}
    }else if(D.kind==='mould'){
      attack(3,3,{x:x,y:floor-8,w:width,h:8},'mould');
      for(var i=0;i<5;i++)attack(2+i*2,1.2,{x:x+32+i*(width-64)/5,y:floor-160,w:20,h:160},'spore');
      if(phase>=1){for(i=0;i<3;i++)attack(4+i*3,1.5,{x:x+80+i*120,y:floor-64,w:64,h:8},'mould');}
      if(phase===2)attack(9,2,{x:x,y:floor-16,w:width,h:16},'mould');
    }else{
      if(phase===0||phase===3){for(var i=0;i<3;i++)attack(2+i*3,1.2,{x:x,y:floor-12,w:width,h:12},'wave');}
      if(phase===1||phase===3){for(i=0;i<4;i++)attack(2+i*2.5,1.2,{x:x+64+i*120,y:floor-64,w:24,h:64},'steam');}
      if(phase>=2){for(i=0;i<5;i++)attack(2+i*2,1.2,{x:x+80+i*140,y:32,w:20,h:floor-32},'spore');}
    }
    return out;
  };
  Boss.prototype.update=function(dt){
    var g=this.g,D=this.def,hero=g.player,inside=hero.x>=D.start*16&&hero.x<D.end*16;
    if(!this.done&&inside&&!this.started){this.started=true;this.clock=-1800;this.attacks=this.patterns();g.events.emit('playtest-event',{type:'boss-start',phase:this.phase});}
    if(this.started&&!this.recovery&&!this.done&&inside){this.clock+=dt;if(this.clock>=14000)this.recovery=true;}
    this.fx.clear();this.art.clear();
    var cx=(D.start+(D.end-D.start)/2)*16, cy=D.floor*16-100;
    if(D.kind==='mould'){
      this.art.fillStyle(GP.int(GP.PAL.h));this.art.fillEllipse(cx,cy+32,100,64);
      this.art.fillStyle(GP.int(GP.PAL.p));for(var i=0;i<9;i++)this.art.fillCircle(cx+(i%3-1)*24,cy+Math.floor(i/3)*14,12);
      this.art.fillStyle(GP.int(GP.PAL.y));this.art.fillRect(cx-18,cy+24,6,6);this.art.fillRect(cx+12,cy+24,6,6);
    }else if(D.kind==='vortex'){
      for(var i=0;i<32;i++){var a=i*Math.PI/8+(GP.reducedMotion?0:this.clock/1800),r=8+i;
        this.art.fillStyle(GP.int([GP.PAL.l,GP.PAL.y,GP.PAL.g,GP.PAL.w][i%4]));this.art.fillRect(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),4,4);}
    }
    if(this.done){this.hud.setVisible(inside).setText('ÉPREUVE RÉUSSIE · IMAGE COMPLÈTE PUIS ARCHE');}
    else this.hud.setVisible(inside).setText((D.kind==='elephant'?'ÉLÉPHANT':D.kind==='mould'?'MOISISSURE':'VORTEX')+' · '+(this.phase+1)+'/'+D.phases+'\n'+
      (this.recovery?(D.kind==='elephant'?'ACTIVE LA VALVE':D.kind==='mould'?'REJOINS LA LAMPE UV':'ALLUME LA LANTERNE'):this.clock<0?'OBSERVE LES SIGNAUX AU SOL':'ESQUIVE LES ZONES ANNONCÉES'));
    if(this.started&&!this.recovery&&!this.done&&inside){
      var self=this;this.attacks.forEach(function(a){
        var warning=g.env.fog?1200:a.warning, active=self.clock>=a.start&&self.clock<a.end;
        if(self.clock<a.start-warning||self.clock>=a.end)return;
        var box=a.box,color=active?(a.kind==='mould'?GP.PAL.p:a.kind==='spore'?GP.PAL.g:GP.PAL.c):GP.PAL.y;
        if(active){self.fx.fillStyle(GP.int(color),0.8);self.fx.fillRect(box.x,box.y,box.w,box.h);if(self.rt.hit(box))g.die('OBSERVE LE SIGNAL DU BOSS !');}
        else{self.fx.lineStyle(2,GP.int(color));self.fx.strokeRect(box.x,box.y,box.w,box.h);}
      });
      if(D.kind==='vortex'&&(this.phase===0||this.phase===3))g.phy.airPush+=Math.sin(this.clock/1800)*70*(1-(g.shelter.wind||0));
    }
    this.goals.forEach(function(p,i){
      p.img.clear();var active=this.recovery&&i===this.phase&&!this.done, lit=i<this.phase;
      p.img.fillStyle(GP.int(lit?GP.PAL.g:active?GP.PAL.y:GP.PAL.e));p.img.fillRect(p.x-5,p.y-22,10,18);
      p.img.fillStyle(GP.int(GP.PAL.k));p.img.fillRect(p.x-2,p.y-18,4,8);
      if(p.ladder){p.ladder.active=active;if(active){p.img.lineStyle(2,GP.int(GP.PAL.m));p.img.lineBetween(p.x,p.y,p.x,D.floor*16);p.img.lineBetween(p.x+12,p.y,p.x+12,D.floor*16);
        for(var y=p.y;y<D.floor*16;y+=10)p.img.lineBetween(p.x,y,p.x+12,y);}}
      if(active&&Math.abs(hero.x-p.x)<18&&Math.abs(hero.y-p.y)<26){
        this.phase++;this.done=this.phase>=D.phases;this.recovery=false;this.started=false;this.clock=0;
        g.respawn={x:p.x,y:p.y};g.saveRun();g.events.emit('playtest-event',{type:'boss-phase',phase:this.phase,done:this.done});g.toast(this.done?'ÉPREUVE RÉUSSIE':'OBJECTIF ACTIVÉ');
      }
    },this);
  };
  return Boss;
})();
