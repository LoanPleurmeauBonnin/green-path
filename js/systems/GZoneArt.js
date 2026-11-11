/** Composition des volumes et des matériaux des GZones. Dessin pixel, sans atlas ni image distante. */
GP.GZoneArt = (function () {
  function prepare(scene) {
    if (scene.textures.exists('gz_lu') && scene.textures.exists('gz_quay_fill')) return;
    ['fill', 'top', 'left', 'right'].forEach(function (side) {
      var o = GP.PixelArt.canvas(16, 16), c = o.ctx, P = GP.PAL;
      c.fillStyle = P.e; c.fillRect(0, 0, 16, 16);
      c.fillStyle = P.m; c.fillRect(2, 3, 8, 1); c.fillRect(10, 12, 4, 1);
      if (side === 'top') { c.fillStyle = P.k; c.fillRect(0, 0, 16, 1); c.fillStyle = P.m; c.fillRect(0, 1, 16, 3); }
      if (side === 'left' || side === 'right') { c.fillStyle = P.k; c.fillRect(side === 'left' ? 0 : 15, 0, 1, 16); }
      GP.PixelArt.toTexture(scene, 'gz_quay_' + side, o.cv);
    });
    var o = GP.PixelArt.canvas(64, 128), c = o.ctx, P = GP.PAL;
    function r(x,y,w,h,color) { c.fillStyle=color; c.fillRect(x,y,w,h); }
    r(12,40,40,88,P.k); r(14,42,36,86,P.r); r(17,44,30,82,P.c);
    for (var y=48;y<126;y+=16) { r(14,y,36,2,P.t); r(26,y+4,12,10,P.d); r(30,y+4,4,10,P.l); }
    for (y=4;y<42;y++) for(var x=5;x<59;x++) if(((x-32)*(x-32))/729+((y-39)*(y-39))/1225<1) r(x,y,1,1,x%9<2?P.y:P.l);
    r(29,0,6,9,P.y); r(5,39,54,4,P.y); r(20,50,24,24,P.k); r(23,53,18,18,P.w); r(31,55,2,8,P.k); r(31,62,7,2,P.k);
    GP.PixelArt.toTexture(scene,'gz_lu',o.cv);
  }
  function key(scene, id) { return id && scene.textures.exists(id) ? id : id === '!lu_monument_tour_lu' ? 'gz_lu' : null; }

  /** Contours EXPOSES de l'union des masses : aucune couture noire/herbe entre deux blocs contigus. */
  function edges(rect, side, all) {
    var horizontal = side === 'top' || side === 'bottom', length = horizontal ? rect.w : rect.h;
    var segments = [], start = null;
    for (var t = 0; t < length; t++) {
      var x = horizontal ? rect.x + t + 0.5 : side === 'left' ? rect.x - 0.5 : rect.x + rect.w + 0.5;
      var y = horizontal ? (side === 'top' ? rect.y - 0.5 : rect.y + rect.h + 0.5) : rect.y + t + 0.5;
      var occupied = all.some(function (r) { return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h; });
      if (!occupied && start === null) start = t;
      if (occupied && start !== null) { segments.push([start, t]); start = null; }
    }
    if (start !== null) segments.push([start, length]);
    return segments;
  }
  function paint(scene, canvas, masses, stats) {
    var c = canvas.getContext('2d'), sources = Object.create(null);
    var rects = masses.map(function (p) { return { x: p.x * 16, y: p.y * 16, w: (p.w || 1) * 16, h: (p.bottom - p.y) * 16, def: p }; }).filter(function (r) { return r.h > 0; });
    function image(id) {
      if (!sources[id]) {
        var k = key(scene, id);
        if (!k) throw new Error('Texture de matériau absente : ' + id);
        sources[id] = scene.textures.get(k).getSourceImage();
      }
      return sources[id];
    }
    function tile(ids, x, y, w, h) {
      var list = Array.isArray(ids) ? ids : [ids];
      c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
      for (var yy = Math.floor(y / 16) * 16; yy < y + h; yy += 16) for (var xx = Math.floor(x / 16) * 16; xx < x + w; xx += 16) {
        var n = ((xx / 16 * 7 + yy / 16 * 3) % list.length + list.length) % list.length;
        c.drawImage(image(list[n]), xx, yy);
      }
      c.restore();
    }
    // D'abord tous les remplissages, ensuite les contours : les rectangles qui se recouvrent forment un seul terrain.
    rects.forEach(function (r) {
      var m = r.def.material;
      if (m.kind !== 'metal') { tile(m.fill, r.x, r.y, r.w, r.h); return; }
      c.fillStyle = GP.PAL.d; c.fillRect(r.x, r.y, r.w, r.h);
      c.fillStyle = GP.PAL.e;
      for (var x = r.x + 3; x < r.x + r.w; x += 32) c.fillRect(x, r.y, 3, r.h);
      for (var y = r.y + 12; y < r.y + r.h; y += 24) {
        c.fillRect(r.x, y, r.w, 2);
        for (x = r.x + 3; x < r.x + r.w - 3; x += 32) for (var t = 0; t < 20 && y + t < r.y + r.h; t++) {
          var width = Math.min(26, r.x + r.w - x - 3), dx = Math.round(width * t / 20);
          c.fillRect(x + dx, y + t, 1, 1); c.fillRect(x + width - dx, y + t, 1, 1);
        }
      }
    });
    rects.forEach(function (r) {
      var m = r.def.material, exposed = {};
      ['top', 'left', 'right', 'bottom'].forEach(function (side) { exposed[side] = edges(r, side, rects); });
      if (m.kind === 'metal') {
        c.fillStyle = GP.PAL.m;
        exposed.top.forEach(function (s) { c.fillRect(r.x + s[0], r.y, s[1] - s[0], Math.min(3, r.h)); });
      } else {
        exposed.top.forEach(function (s) { tile(m.top || m.fill, r.x + s[0], r.y, s[1] - s[0], Math.min(16, r.h)); });
      }
      ['left', 'right'].forEach(function (side) {
        var border = m[side], width = Math.min(3, r.w);
        exposed[side].forEach(function (s) {
          var x = side === 'left' ? r.x : r.x + r.w - width;
          c.save(); c.beginPath(); c.rect(x, r.y + s[0], width, s[1] - s[0]); c.clip();
          if (border) {
            var im = image(border);
            for (var y = Math.floor((r.y + s[0]) / 16) * 16; y < r.y + s[1]; y += 16) {
              c.drawImage(im, side === 'left' ? 0 : im.width - width, 0, width, im.height, x, y, width, im.height);
            }
          } else { c.fillStyle = GP.PAL.e; c.fillRect(x, r.y + s[0], width, s[1] - s[0]); }
          c.fillStyle = GP.PAL.k; c.fillRect(side === 'left' ? r.x : r.x + r.w - 1, r.y + s[0], 1, s[1] - s[0]);
          c.restore();
        });
      });
      if (m.bottom) exposed.bottom.forEach(function (s) {
        var im = image(m.bottom), height = Math.min(3, r.h);
        c.save(); c.beginPath(); c.rect(r.x + s[0], r.y + r.h - height, s[1] - s[0], height); c.clip();
        for (var x = Math.floor((r.x + s[0]) / 16) * 16; x < r.x + s[1]; x += 16) c.drawImage(im, 0, im.height - height, im.width, height, x, r.y + r.h - height, im.width, height);
        c.restore();
      });
      [['left', 'topLeft'], ['right', 'topRight']].forEach(function (entry) {
        var side = entry[0], id = m[entry[1]], offset = side === 'left' ? 0 : r.w - 1;
        if (!id || !exposed.top.some(function (s) { return offset >= s[0] && offset < s[1]; }) || !exposed[side].some(function (s) { return s[0] === 0; })) return;
        var im = image(id), width = Math.min(16, r.w / 2), height = Math.min(16, r.h);
        var x = side === 'left' ? r.x : r.x + r.w - width;
        c.clearRect(x, r.y, width, height);
        c.drawImage(im, side === 'left' ? 0 : im.width - width, 0, width, height, x, r.y, width, height);
      });
      stats.push({ id: r.def.id, material: m.kind, decorative: !!r.def.decorative, rect: [r.x, r.y, r.w, r.h], edges: exposed });
    });
  }
  function renderTerrain(scene, textureKey, L, plan) {
    prepare(scene);
    var d = L.gzone, o = GP.PixelArt.canvas(L.width * 16, L.rows * 16), c = o.ctx;
    scene.terrainArt = { renderer: 'gz-materials', masses: [] };
    paint(scene, o.cv, plan.masses.filter(function (p) { return !p.decorative; }), scene.terrainArt.masses);
    L.roofs.forEach(function(r){
      c.fillStyle=GP.PAL.k;c.fillRect(r.x,r.y,r.w,r.h);
      c.fillStyle=d.num===10?GP.PAL.l:GP.PAL.e;c.fillRect(r.x,r.y+1,r.w,4);
      for(var x=r.x;x<r.x+r.w;x+=16){c.fillStyle=GP.PAL.t;c.fillRect(x,r.y,2,r.h);}
    });
    return GP.LevelArt.chunks(scene, textureKey, o.cv);
  }
  function rooms(scene, L) {
    (L.rooms || []).forEach(function (r, i) {
      var im = scene.textures.get(r.key).getSourceImage(), w = r.w || im.width, h = r.h || im.height;
      var o = GP.PixelArt.canvas(w, h);
      o.ctx.drawImage(im, r.sourceX || 0, r.sourceY || 0, w, h, 0, 0, w, h);
      var k = 'level_room_' + i;
      GP.PixelArt.toTexture(scene, k, o.cv);
      scene.add.image(r.x * 16, r.y || 0, k).setOrigin(0).setDepth(r.depth === undefined ? -20 : r.depth).setData('sourceArt', r.key);
    });
  }
  function build(scene, L, plan) {
    prepare(scene);
    var d = L.gzone, W = L.width * 16, H = L.rows * 16;
    var background = GP.PixelArt.canvas(W, H);
    scene.structureArt = [];
    paint(scene, background.cv, plan.masses.filter(function (p) { return p.decorative; }), scene.structureArt);
    GP.LevelArt.chunks(scene, 'gz_structure', background.cv).forEach(function (k, i) {
      scene.add.image(i * GP.LevelArt.CHUNK, 0, k).setOrigin(0).setDepth(2);
    });
    (d.rails || []).forEach(function (rail, i) {
      var k = key(scene, rail.sprite); if (!k) throw new Error('Rail sans texture : ' + rail.sprite);
      var im = scene.textures.get(k).getSourceImage(), w = Math.ceil((rail.x2 - rail.x1) * 16), o = GP.PixelArt.canvas(w, im.height);
      for (var x = 0; x < w; x += im.width) o.ctx.drawImage(im, x, 0);
      GP.PixelArt.toTexture(scene, 'gz_rail_' + i, o.cv);
      scene.add.image(rail.x1 * 16, rail.y * 16, 'gz_rail_' + i).setOrigin(0).setDepth(4).setData('sourceArt', k);
    });

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
  return { prepare: prepare, key: key, build: build, renderTerrain: renderTerrain, rooms: rooms, edges: edges };
})();
