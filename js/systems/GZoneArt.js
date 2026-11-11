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
    plan.masses.forEach(function (p) {
      var mat=(d.tuiles||{})[p.tuiles]||{}, top=p.top_sprite||(p.style==='herbe'?'gz_grass':mat.haut), fill=p.fill_sprite||mat.plein||'gz_soil';
      if(Array.isArray(top))top=top[0];if(Array.isArray(fill))fill=fill[0];
      var x=p.x*16,y=p.y*16,w=(p.w||1)*16,h=(p.bottom-p.y)*16;
      if(h<=0)return;
      // Une pile haute dans une infrastructure industrielle est une ossature, pas une aiguille de terre herbeuse.
      if([6,7,9].indexOf(d.num)>=0&&w<=48&&h>=64&&p.y<d.sol_y-2){
        c.fillStyle=GP.PAL.k;c.fillRect(x,y,w,h);c.fillStyle=GP.PAL.d;c.fillRect(x+2,y+2,w-4,h-2);
        c.fillStyle=GP.PAL.m;c.fillRect(x+2,y,2,h);c.fillRect(x+w-4,y,2,h);c.fillRect(x,y,w,3);
        for(var yy=y+12;yy<y+h-20;yy+=24){c.fillStyle=GP.PAL.e;c.fillRect(x+2,yy,w-4,2);
          for(var t=0;t<20;t++){var xx=Math.round((w-8)*t/20);c.fillRect(x+4+xx,yy+t,1,1);c.fillRect(x+w-5-xx,yy+t,1,1);}}
      }else if(p.style==='herbe'&&!p.top_sprite){
        // Sol d'herbe du Jardin : vraies tuiles de la planche « commun », variées colonne par colonne.
        for(var cx=0;cx<(p.w||1);cx++)for(var cy=0;cy*16<h;cy++){
          var v=((p.x+cx)*7+cy*3)%3+1;
          put(cy===0?'commun_herbe_haut_'+v:'commun_terre_'+v,x+cx*16,y+cy*16,16,16);
        }
      }else{put(fill,x,y,w,h);put(top||fill,x,y,w,Math.min(16,h));}
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
