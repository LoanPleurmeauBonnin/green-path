/** Diagnostic physique des fragments : téléportations à des surfaces candidates, morts neutralisées.
 * Ne prouve ni le trajet connecté, ni une traversée sans danger, ni la difficulté humaine.
 */
'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();const results=[];
try{await page.goto('http://127.0.0.1:8130/?dev=1&level=jardin-des-plantes');await page.waitForFunction(()=>window.GP?.game?.scene.getScene('Game')?.player);
for(const file of ['bot','geometry-tests'])await page.addScriptTag({url:'http://127.0.0.1:8130/tools/'+file+'.js'});
for(let i=0;i<12;i++){const r=await page.evaluate(i=>GP.runGeometryTest(i,0),i);results.push(r);console.log(JSON.stringify(r));}
}finally{await browser.close();}
const target=process.env.GREENPATH_GEOMETRY_REPORT?path.resolve(process.env.GREENPATH_GEOMETRY_REPORT):path.join(__dirname,'..','docs','levels-geometry.json');
fs.writeFileSync(target,JSON.stringify({kind:'teleported-physics-diagnostic',weather:'SOLEIL',results},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
