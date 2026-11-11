/** Recette navigateur des 12 niveaux : composants contrôlés et captures, PAS des traversées humaines. */
'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8130',dir=path.join(__dirname,'..','docs','screenshots');
const ids=['jardin-des-plantes','cathedrale','chateau','feydeau','graslin','machines','chantiers','buren','hangar','pommeraye','memorial','tour-lu'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),report={kind:'controlled-browser-components',formats:[],errors:[],consoleErrors:[],missing:[],cloudWrites:[]};
 try{
 for(const [width,height] of [[1920,1080],[1366,768],[844,390]]){
  const context=await browser.newContext({viewport:{width,height}});await context.route('**/rest/v1/**',r=>{report.cloudWrites.push(r.request().method());return r.abort();});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});
  page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.missing.push(r.url());});
  const format={width,height,levels:[]};
  await page.goto(base+'/?dev=1');await page.waitForFunction(()=>window.GP?.game?.scene.isActive('Menu'));
  format.suites={};
  for(const file of ['playtest','regression-tests','polish-tests','browser-tests'])await page.addScriptTag({url:base+'/tools/'+file+'.js'});
  for(const [name,fn] of [['regression','runRegressionTests'],['polish','runPolishTests'],['flow','runBrowserTests']]){
    const checks=await page.evaluate(fn=>GP[fn](),fn);format.suites[name]={passed:checks.filter(c=>c.ok).length,total:checks.filter(c=>c.name).length,failed:checks.filter(c=>c.name&&!c.ok)};
  }
  for(const id of ids){
   await page.goto(base+'/?dev=1&level='+id);await page.waitForFunction(()=>window.GP?.game?.scene.getScene('Game')?.player);
   const result=await page.evaluate(()=>{
    const game=GP.game,g=game.scene.getScene('Game');game.loop.sleep();let now=performance.now(),elapsed=0;
    const originalNow=Date.now,epoch=originalNow();Date.now=()=>epoch+elapsed;
    const tick=n=>{for(let i=0;i<n;i++){elapsed+=1000/60;game.step(now+elapsed,1000/60);}};
    const checks=[];function check(name,ok){checks.push({name,ok:!!ok});}
    g.introMs=0;g.invuln=1e9;g.Progression=null;tick(20);
    check('charged',g.pc.total>0&&g.L.rows>=17&&!!g.exit);
    check('isolated',GP.Config.SAVE_KEY==='greenpath.dev.'+g.loc.id&&!GP.Cloud.enabled&&!GP.Cloud.isAccount);
    const startY=g.player.y;g.bot={step:()=>({jump:true})};tick(12);g.bot=null;check('physical-jump',g.player.y<startY-8);
    for(let i=0;i<GP.Weather.SIMS.length;i++){
      g.player.body.reset(8,16);GP.Weather.simIndex=i-1;g.applyWeather(GP.Weather.nextSim(),true);g.updateShelter(0,true);
      const expected=GP.WeatherRules.physics(g.env,g.TUNE,{rain:0,snow:0,wind:0});
      check('weather-'+i,g.phy.accelGround===expected.accelGround&&g.phy.airPush===expected.airPush&&g.wx.exposureAt(8-g.cameras.main.scrollX,8-g.cameras.main.scrollY,false)===1);
    }
    if(g.gz){
     check('exact-collision',g.gz.solids.length>0&&g.gz.solids.every(s=>Number.isFinite(s.body.x)&&s.body.width>0));
     for(const z of g.L.shelters){g.player.body.reset(z.x+Math.min(24,z.w/2),Math.min(g.H-16,z.y+48));GP.Weather.simIndex=1;g.applyWeather(GP.Weather.nextSim(),true);g.updateShelter(0,true);
      check('shelter-'+z.id,g.shelter.rain===1&&g.phy.accelGround===1100&&g.wx.exposureAt(z.x+8-g.cameras.main.scrollX,z.y+8-g.cameras.main.scrollY,false)===0);}
     const moving=g.gz.surfaces.find(s=>['va-et-vient','oscillation'].includes(s.mechanic.type));
     if(moving){const x=moving.body.x,y=moving.body.y;g.player.body.reset(40,0);tick(60);check('moving-body',Math.abs(moving.body.x-x)+Math.abs(moving.body.y-y)>1);}
     check('no-endpoint-ghosts',g.gz.surfaces.every(s=>!s.def.sur||s.def.sur===s.def.id||!g.gz.surfaces.some(other=>other!==s&&other.def.id===s.def.sur)));
     const stationary=g.gz.surfaces.find(s=>!s.mechanic.type&&!s.mechanic.leurre&&s.body.enable);
     if(stationary){
      g.player.body.reset(stationary.body.x+Math.min(16,stationary.w/2),stationary.body.y-1);tick(12);
      const y=g.player.y;g.bot={step:()=>({jump:true})};tick(12);g.bot=null;
      check('jump-from-platform',g.player.y<y-8);
     }
    }
    if(g.gz?.boss){
      const boss=g.gz.boss,attack=boss.patterns()[0],box=attack.box;
      g.invuln=0;g.player.body.reset(box.x+box.w/2,box.y+Math.min(12,box.h));
      boss.started=true;boss.attacks=boss.patterns();boss.clock=attack.start-1;boss.update(0);
      check('boss-telegraph-safe',!g.dying);
      boss.clock=attack.start+1;boss.update(0);check('boss-attack-contact',g.dying&&g.deaths===1);
      tick(50);check('boss-retry-phase',!g.dying&&boss.phase===0&&!boss.recovery);g.invuln=1e9;
    }
    // Collecte, objectifs de boss et sortie forcés : vérifie les contrats, pas la réalisation humaine du trajet.
    g.pixels.forEach(p=>g.collect(p,true));check('collection-not-finish',g.pc.done()&&!g.finished);
    g.player.body.reset(g.L.exit.x*16+8,g.L.exit.y*16);g.checkWorld();
    if(g.gz?.boss){
     const boss=g.gz.boss;check('boss-blocks-exit',!g.finished);
     for(let i=0;i<boss.def.phases;i++){
      g.player.body.reset((boss.def.start+2)*16,boss.def.floor*16);boss.started=true;boss.clock=13990;boss.attacks=boss.patterns();tick(2);
      check('boss-recovery-'+i,boss.recovery);const p=boss.goals[i];g.player.body.reset(p.x,p.y);g.gz.update(0);
      check('boss-goal-'+i,boss.phase===i+1);g.saveRun();check('boss-saved-'+i,GP.Save.load().runs[g.loc.id].boss.phase===i+1);
     }
     check('boss-complete',boss.done&&!g.finished);
     g.player.body.reset(g.L.exit.x*16+8,g.L.exit.y*16);g.checkWorld();
    }
    check('exit',g.finished);tick(160);check('result',game.scene.isActive('Result')&&!!GP.Progression.data.completed[g.loc.id]);
    Date.now=originalNow;
    return {id:g.loc.id,checks,boss:g.L.boss?.kind||null,fragments:g.L.pixels.length};
   });
   format.levels.push(result);
   if(width===1366){
    await page.goto(base+'/?dev=1&level='+id);await page.waitForFunction(()=>window.GP?.game?.scene.getScene('Game')?.player);
    const png=await page.evaluate(()=>{
     const game=GP.game,g=game.scene.getScene('Game');game.loop.sleep();let now=performance.now();const tick=n=>{for(let i=0;i<n;i++)game.step(now+=1000/60,1000/60);};
     g.introMs=0;g.introCard.objects.forEach(o=>{g.tweens.killTweensOf(o);o.destroy();});g.physics.pause();g.paused=true;g.invuln=1e9;g.cameras.main.stopFollow();
     const W=game.canvas.width,H=game.canvas.height,cv=document.createElement('canvas');cv.width=W*2;cv.height=(H+20)*3;const ctx=cv.getContext('2d');ctx.fillStyle='#14182e';ctx.fillRect(0,0,cv.width,cv.height);ctx.imageSmoothingEnabled=false;
     const zones=g.L.zones||[{x:0,end:g.L.width,name:g.loc.name}];zones.forEach((z,i)=>{
      const pixels=g.L.pixels.filter(p=>p.x>=z.x&&p.x<z.end),p=pixels[Math.floor(pixels.length/2)]||{x:z.x+3,y:12};
      g.player.body.reset(p.x*16+8,(p.y+1)*16);GP.Weather.simIndex=i%2?1:-1;g.applyWeather(GP.Weather.nextSim(),true);g.updateShelter(0,true);if(g.gz)g.gz.update(0);else g.updateMechanics(0);
      g.cameras.main.centerOn(g.player.x+50,g.player.y-70);g.sky.update(g.cameras.main,16);tick(60);
      const x=i%2*W,y=Math.floor(i/2)*(H+20);ctx.fillStyle='#f4f7f2';ctx.font='10px monospace';ctx.fillText(z.name,x+6,y+14);ctx.drawImage(game.canvas,x,y+20);
     });return cv.toDataURL('image/png').split(',')[1];
    });
    fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'level-'+id+'.png'),Buffer.from(png,'base64'));
   }
  }
  report.formats.push(format);await context.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(__dirname,'..','docs','levels-qa.json'),JSON.stringify(report,null,2)+'\n');
 const failures=report.formats.flatMap(f=>f.levels.flatMap(l=>l.checks.filter(c=>!c.ok).map(c=>({width:f.width,level:l.id,check:c.name}))));
 console.log(JSON.stringify({levels:report.formats.map(f=>({width:f.width,levels:f.levels.length,checks:f.levels.reduce((n,l)=>n+l.checks.length,0),suites:f.suites})),failures,errors:report.errors,consoleErrors:report.consoleErrors,missing:report.missing,cloudWrites:report.cloudWrites},null,2));
 if(failures.length||report.errors.length||report.consoleErrors.length||report.missing.length||report.cloudWrites.length||report.formats.some(f=>Object.values(f.suites).some(s=>s.failed.length)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
