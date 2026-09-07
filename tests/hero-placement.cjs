const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public');
const baseline=process.env.QA_BASELINE_HTML;
const out=process.env.QA_OUTPUT_DIR;
(async()=>{const results=[];for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]){
 const browser=await type.launch({headless:true,...(engine==='chromium'?{channel:'chrome'}:{})});
 try{for(const width of [320,390,430,768,1100,1101,1440]){
  const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
  await context.route('**/*',r=>{const req=r.request(),u=new URL(req.url());if(req.method()!=='GET'||!['candidate.test','baseline.test'].includes(u.hostname))return r.abort();let file=path.join(root,u.pathname);if(u.pathname==='/')file=u.hostname==='baseline.test'&&baseline?baseline:path.join(root,'index.html');if(!fs.existsSync(file)||!fs.statSync(file).isFile())return r.fulfill({status:404,body:''});return r.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream'});});
  const page=await context.newPage();
  async function measure(host){await page.goto('https://'+host+'/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);return page.evaluate(()=>{const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,bottom:r.bottom}};return {form:rect('#form'),field:rect('#property_use'),intro:rect('h1'),proof:rect('.bullets'),metrics:rect('.hero-metrics'),overflow:document.documentElement.scrollWidth>innerWidth,fields:[...document.querySelectorAll('#lead-form [name]')].map(x=>[x.tagName,x.name,x.type,x.required]),proofText:document.querySelector('.bullets').textContent.replace(/\s+/g,' ').trim(),headline:document.querySelector('h1').textContent.replace(/\s+/g,' ').trim()};});}
  const before=baseline?await measure('baseline.test'):null;const after=await measure('candidate.test');if(after.overflow) console.log(JSON.stringify({engine,width,beforeOverflow:before?.overflow,form:after.form,offenders:await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1 && getComputedStyle(e).position!=='fixed').slice(0,12).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})))},null,2));assert.equal(after.overflow,false,engine+' '+width+' overflow');
  if(width<=1100){assert.ok(after.form.y>after.intro.bottom);assert.ok(after.proof.y>=after.form.bottom,engine+' proof follows form');if(width>=390&&width<=430)assert.ok(after.field.bottom<844,engine+' first field visible in mobile viewport');if(before)assert.ok(after.form.y<before.form.y-200,engine+' form meaningfully earlier');}
  else{assert.ok(after.form.x>after.intro.x);assert.ok(after.proof.y>after.intro.bottom);if(before)for(const key of ['form','intro','proof']){assert.ok(Math.abs(before[key].x-after[key].x)<1,engine+' desktop '+key+' x');assert.ok(Math.abs(before[key].y-after[key].y)<1,engine+' desktop '+key+' y');}}
  if(before){assert.deepEqual(after.fields,before.fields);assert.equal(after.proofText,before.proofText);assert.equal(after.headline,before.headline);}
  if(out&&[390,1440].includes(width))await page.screenshot({path:path.join(out,'pbw-form-placement-'+engine+'-'+width+'.png')});
  results.push({engine,width,before,after});await context.close();
 }}finally{await browser.close();}}
 if(out)fs.writeFileSync(path.join(out,'pbw-form-placement.json'),JSON.stringify(results,null,2)+'\n');console.log('PASS: '+results.length+' viewport/browser cases; earlier mobile form, unchanged desktop positions, same qualifiers and proof. No network writes.');
})().catch(e=>{console.error(e);process.exit(1)});
