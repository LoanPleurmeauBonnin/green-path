/** Composition des volumes et des matériaux des GZones. Dessin pixel, sans atlas ni image distante. */
GP.GZoneArt = (function () {
  function prepare(scene) {
    if (scene.textures.exists('gz_soil')) return;
    function tile(key, top) {
      var o = GP.PixelArt.canvas(16, 16), c = o.ctx;
      c.fillStyle = GP.LevelArt.C.dirt; c.fillRect(0, 0, 16, 16);
      c.fillStyle = GP.LevelArt.C.dirtD; c.fillRect(3, 8, 3, 2); c.fillRect(11, 13, 2, 1);
      if (top) { c.fillStyle = GP.PAL.k; c.fillRect(0, 0, 16, 1); c.fillStyle = GP.PAL.g; c.fillRect(0, 1, 16, 3); }
      GP.PixelArt.toTexture(scene, key, o.cv);
    }
    tile('gz_soil'); tile('gz_grass', true);
    var o = GP.PixelArt.canvas(64, 128), c = o.ctx, P = GP.PAL;
    function r(x,y,w,h,color) { c.fillStyle=color; c.fillRect(x,y,w,h); }
    r(12,40,40,88,P.k); r(14,42,36,86,P.r); r(17,44,30,82,P.c);
    for (var y=48;y<126;y+=16) { r(14,y,36,2,P.t); r(26,y+4,12,10,P.d); r(30,y+4,4,10,P.l); }
    for (y=4;y<42;y++) for(var x=5;x<59;x++) if(((x-32)*(x-32))/729+((y-39)*(y-39))/1225<1) r(x,y,1,1,x%9<2?P.y:P.l);
    r(29,0,6,9,P.y); r(5,39,54,4,P.y); r(20,50,24,24,P.k); r(23,53,18,18,P.w); r(31,55,2,8,P.k); r(31,62,7,2,P.k);
    GP.PixelArt.toTexture(scene,'gz_lu',o.cv);
  }
  function key(scene, id) { return id && scene.textures.exists(id) ? id : id === '!lu_monument_tour_lu' ? 'gz_lu' : null; }
  function build(scene, L, plan) {
    prepare(scene);
    var d = L.gzone, W = L.width*16, H = L.rows*16, o = GP.PixelArt.canvas(W,H), c=o.ctx;
    function put(id,x,y,w,h) {
      id=key(scene,id); if(!id)return;
      var im=scene.textures.get(id).getSourceImage(); c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip();
      for(var yy=y;yy<y+h;yy+=im.height)for(var xx=x;xx<x+w;xx+=im.width)c.drawImage(im,xx,yy);
      c.restore();
    }
    // Cases occupées par les masses : elles servent à repérer les bords visibles d'un bloc (côtés, dessous).
    // Hors du niveau = plein, pour ne pas dessiner de rebord sur le bord de l'écran.
    var cells={};
    plan.masses.forEach(function(p){
      for(var i=0;i<(p.w||1);i++)for(var j=Math.floor(p.y);j<Math.ceil(p.bottom);j++)cells[(p.x+i)+','+j]=true;
    });
    function solid(x,y){return x<0||x>=L.width||y<0||y>=L.rows||!!cells[x+','+y];}
    /** Matériau d'une masse : tuiles du dessus et du corps ; sprites de bord dédiés quand la planche en fournit. */
    function material(p){
      if(p.style==='herbe'&&!p.top_sprite)return {
        top:['commun_herbe_haut_1','commun_herbe_haut_2','commun_herbe_haut_3'],fill:['commun_terre_1','commun_terre_2','commun_terre_3'],
        cornerL:'commun_herbe_haut_gauche',cornerR:'commun_herbe_haut_droite',sideL:'commun_terre_gauche',sideR:'commun_terre_droite',under:'commun_terre_bas'};
      var mat=(d.tuiles||{})[p.tuiles]||{},top=p.top_sprite||mat.haut,fill=p.fill_sprite||mat.plein||'gz_soil';
      return {top:[].concat(top||fill),fill:[].concat(fill),under:p.bas_sprite};
    }
    /**
     * 1 si la première rangée de la tuile est presque vide (brins d'herbe) alors que la deuxième est pleine : le trait
     * visible du sol est alors 1 px sous la surface de collision, et l'avatar comme les décors paraissent flotter.
     */
    var lifts = {};
    function lift(id) {
      if (lifts[id] !== undefined) return lifts[id];
      var k = key(scene, id), v = 0;
      if (k) {
        var im = scene.textures.get(k).getSourceImage(), cv = document.createElement('canvas');
        cv.width = im.width; cv.height = Math.min(2, im.height);
        var cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
        var d0 = cx.getImageData(0, 0, cv.width, 1).data, d1 = cx.getImageData(0, 1, cv.width, 1).data, n0 = 0, n1 = 0;
        for (var i = 0; i < cv.width; i++) { if (d0[i * 4 + 3] > 0) n0++; if (d1[i * 4 + 3] > 0) n1++; }
        v = n0 < cv.width / 2 && n1 >= cv.width * 0.9 ? 1 : 0;
      }
      return (lifts[id] = v);
    }
    /** Liseré d'un côté sans sprite dédié : trait d'encre, puis reflet (gauche) ou ombre (droite), comme les bords des planches. */
    function rim(tx,ty,th,right,top){
      var y0=top?ty+1:ty;
      c.fillStyle=GP.PAL.k;c.fillRect(right?tx+15:tx,ty,1,th);
      c.fillStyle=right?'rgba(0,0,0,0.22)':'rgba(255,255,255,0.2)';c.fillRect(right?tx+14:tx+1,y0,1,th-(y0-ty));
    }
    /** Un bloc case par case : tuiles variées, dessus, côtés exposés et dessous arrondis au lieu d'une coupe franche. */
    function drawMass(p,m){
      var w=p.w||1,px=p.x*16,py=p.y*16,ph=(p.bottom-p.y)*16;
      for(var cx=0;cx<w;cx++)for(var cy=0;cy*16<ph;cy++){
        var X=p.x+cx,Y=Math.floor(p.y+cy),tx=px+cx*16,ty=py+cy*16,th=Math.min(16,ph-cy*16),top=cy===0;
        var exL=!solid(X-1,Y),exR=!solid(X+1,Y),exT=!solid(X,Y-1),exB=cy*16+16>=ph&&!solid(X,Y+1);
        var id=m.fill[(X*7+Y*3)%m.fill.length],spriteL=false,spriteR=false;
        if(top)id=m.top[(X*7+Y*3)%m.top.length];
        if(exL&&(top?m.cornerL:m.sideL)){id=top?m.cornerL:m.sideL;spriteL=true;}
        else if(exR&&(top?m.cornerR:m.sideR)){id=top?m.cornerR:m.sideR;spriteR=true;}
        if(exB&&m.under&&!top)id=m.under;
        // Tuile d'herbe : remontée d'un pixel (sur du terrain plein dessous) pour que le trait du sol soit à la hauteur de collision.
        if(top&&lift(id)){put(m.fill[(X*7+Y*3)%m.fill.length],tx,ty,16,th);put(id,tx,ty-1,16,th);}
        else put(id,tx,ty,16,th);
        if(exL&&!spriteL)rim(tx,ty,th,false,top);
        if(exR&&!spriteR)rim(tx,ty,th,true,top);
        // Coins du dessus arrondis (un pixel) là où le sprite n'a pas déjà son propre arrondi.
        if(top&&exT&&exL&&!spriteL)c.clearRect(tx,ty,1,1);
        if(top&&exT&&exR&&!spriteR)c.clearRect(tx+15,ty,1,1);
        // Dessous d'un bloc suspendu sans sprite dédié : trait d'encre et ombre.
        if(exB&&!m.under){c.fillStyle=GP.PAL.k;c.fillRect(tx,ty+th-1,16,1);c.fillStyle='rgba(0,0,0,0.22)';c.fillRect(tx,ty+th-2,16,1);}
      }
    }
    plan.masses.forEach(function (p) {
      var x=p.x*16,y=p.y*16,w=(p.w||1)*16,h=(p.bottom-p.y)*16;
      if(h<=0)return;
      // Une pile haute dans une infrastructure industrielle est une ossature, pas une aiguille de terre herbeuse.
      if([6,7,9].indexOf(d.num)>=0&&w<=48&&h>=64&&p.y<d.sol_y-2){
        c.fillStyle=GP.PAL.k;c.fillRect(x,y,w,h);c.fillStyle=GP.PAL.d;c.fillRect(x+2,y+2,w-4,h-2);
        c.fillStyle=GP.PAL.m;c.fillRect(x+2,y,2,h);c.fillRect(x+w-4,y,2,h);c.fillRect(x,y,w,3);
        for(var yy=y+12;yy<y+h-20;yy+=24){c.fillStyle=GP.PAL.e;c.fillRect(x+2,yy,w-4,2);
          for(var t=0;t<20;t++){var xx=Math.round((w-8)*t/20);c.fillRect(x+4+xx,yy+t,1,1);c.fillRect(x+w-5-xx,yy+t,1,1);}}
      }else drawMass(p,material(p));
    });
    L.roofs.forEach(function(r){
      c.fillStyle=GP.PAL.k;c.fillRect(r.x,r.y,r.w,r.h);
      c.fillStyle=d.num===10?GP.PAL.l:GP.PAL.e;c.fillRect(r.x,r.y+1,r.w,4);
      for(var x=r.x;x<r.x+r.w;x+=16){c.fillStyle=GP.PAL.t;c.fillRect(x,r.y,2,r.h);}
    });
    GP.LevelArt.chunks(scene,'gz_terrain',o.cv).forEach(function(k,i){scene.add.image(i*GP.LevelArt.CHUNK,0,k).setOrigin(0).setDepth(5);});

    // Motifs patrimoniaux de fond, portés par le sol et distincts des appuis jouables.
    if(d.num===2) {
      var roof=scene.add.graphics().setDepth(0);roof.fillStyle(GP.int(GP.PAL.d));roof.fillRect(17*16,32,78*16,(d.sol_y-2)*16);
      for(var col=20;col<95;col+=8){
        roof.fillStyle(GP.int(GP.PAL.e));roof.fillRect(col*16,36,5,(d.sol_y-2)*16);
        var k=key(scene,'cathedrale_vitrail_a');if(k)scene.add.image(col*16+20,90,k).setDepth(1);
      }
    }
    if(d.num===10||d.num===9||d.num===6) {
      var g=scene.add.graphics().setDepth(0), left=d.num===10?0:d.num===9?44:38, right=d.num===6?80:d.largeur;
      g.fillStyle(GP.int(GP.PAL.d));g.fillRect(left*16,32,(right-left)*16,H-32);
      for(var col=left;col<right;col+=8){g.fillStyle(GP.int(d.num===10?GP.PAL.t:GP.PAL.e));g.fillRect(col*16,32,3,H-32);
        g.fillRect(col*16,64,128,3);}
    }
    if(d.num===12) {
      var g=scene.add.graphics().setDepth(0);g.fillStyle(GP.int(GP.PAL.r));g.fillRect(146*16,64,(L.width-146)*16,H-64);
      g.lineStyle(2,GP.int(GP.PAL.y));
      for(var x=148*16;x<W;x+=64){g.lineBetween(x,64,x,H);g.lineBetween(x,64,(195+32)*16,20);}
      scene.add.image(182*16,100,'gz_lu').setScale(1).setDepth(1);
    }
    (plan.visuals||[]).forEach(function(p){
      var k=key(scene,p.sprite);if(!k)return;
      var img=scene.add.image(p.x*16,(p.y+1)*16,k).setOrigin(0,1).setDepth(p.layer==='inlay'?6:2);
      p.rendered=img;
    });
    plan.columns.forEach(function(p){
      var floor=p.sol_y*16, top=p.y_top*16;
      for(var y=top+16;y<floor;y+=16) {var k=key(scene,p.sprite_fut);if(k)scene.add.image(p.x*16,y,k).setOrigin(0).setDepth(3);}
      var k=key(scene,p.sprite_chapiteau);if(k)scene.add.image(p.x*16,top,k).setOrigin(0).setDepth(4);
    });
    plan.galleries.forEach(function(p){
      (p.piliers||[]).forEach(function(x){for(var y=p.y*16+12;y<p.sol_y*16;y+=16){var k=key(scene,p.sprite_fut);if(k)scene.add.image(x*16,y,k).setOrigin(0).setDepth(2);}});
    });
    // Une seule représentation du monument d'arrivée, pas une seconde copie étirée.
    var monument=d.arrivee.monument,k=key(scene,monument.sprite);
    if(k)scene.add.image(monument.x*16,(monument.y+1)*16,k).setOrigin(0,1).setDepth(1);
  }
  return { prepare:prepare,key:key,build:build };
})();
