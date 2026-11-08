import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {designs} from './content.mjs';
const output=process.env.EVIDENCE_DIR;
if(!output) throw new Error('Set EVIDENCE_DIR to a local evidence directory.');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
const context=await browser.newContext({reducedMotion:'reduce'});
const page=await context.newPage();
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const results=[];const failures=[];const external=[];
page.on('pageerror',error=>failures.push(`pageerror: ${error.message}`));
page.on('response',response=>{if(response.status()>=400)failures.push(`${response.status()}: ${response.url()}`);});
context.on('request',request=>{if(!request.url().startsWith(base)&&!request.url().startsWith('data:'))external.push(request.url());});
try{
 for(const [size,width,height] of [['desktop',1440,1000],['mobile',390,844],['tablet',768,1024],['narrow',320,740]]){
  await page.setViewportSize({width,height});
  for(const [i,d] of designs.entries()){
   await page.goto(`${base}/${d.id}/`,{waitUntil:'networkidle'});
   await page.locator('h1').waitFor();
   assert.equal(await page.locator('h1').count(),1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)failures.push(`${d.id} ${size}: horizontal overflow`);
   if(size==='narrow'&&d.id==='03-city-grid') await page.screenshot({path:`${output}/${d.id}-320-after-fix.png`,fullPage:true});
   if(size!=='narrow'){
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
    if(violations.length)failures.push(`${d.id} ${size}: ${violations.map(v=>v.id).join(', ')}`);
    results.push({route:d.id,size,width,height,overflow,violations});
    await page.screenshot({path:`${output}/${d.id}-${size}.png`,fullPage:true});
   }
   await page.keyboard.press('Tab');
   const focused=await page.evaluate(()=>document.activeElement.textContent);
   assert.equal(focused,'Skip to content',d.id+' keyboard skip');
   await page.keyboard.press('Enter');
   assert.equal(await page.evaluate(()=>location.hash),'#main');
  }
 }
 for(const [size,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  await page.setViewportSize({width,height});
  for(const [name,route] of [['gallery','/'],['comparison','/compare/'],['baseline','/baseline/']]){
   await page.goto(base+route,{waitUntil:'networkidle'});
   if(name==='gallery'){
    for(const card of await page.locator('.design-card').all()) {await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(80);}
    for(const frame of page.frames().slice(1)) await frame.waitForLoadState('load');
    await page.evaluate(()=>scrollTo(0,0));
   }
   await page.screenshot({path:`${output}/${name}-${size}.png`,fullPage:true});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow)failures.push(`${name} ${size}: horizontal overflow`);
   if(name!=='baseline'){
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    results.push({route,size,overflow,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    if(axe.violations.length)failures.push(`${name} ${size}: ${axe.violations.map(v=>v.id).join(', ')}`);
   }
  }
 }
 await page.goto(base);
 const favorite=page.locator('.favorite').first();
 await favorite.click();assert.equal(await favorite.getAttribute('aria-pressed'),'true');
 await page.reload();assert.equal(await page.locator('.favorite').first().getAttribute('aria-pressed'),'true');
 await page.locator('#shortlist-filter').click();assert.equal(await page.locator('.design-card:visible').count(),1);
 await page.locator('.favorite:visible').click();assert.equal(await page.locator('#empty-shortlist').isVisible(),true);
 await page.goto(base+'/compare/');
 await page.locator('#pickA').selectOption('08-swiss');
 assert.equal(await page.locator('#openA').getAttribute('href'),'/08-swiss/');
 assert.match(await page.locator('#frameA').getAttribute('src'),/08-swiss/);
 await page.goto(base+'/04-terminal/');
 await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');
 assert.equal(external.length,0,'No third-party requests');
}finally{
 await writeFile(`${output}/browser-results.json`,JSON.stringify({results,failures,external},null,2));
 await browser.close();
}
console.log(JSON.stringify({pages:results.length,failures,external},null,2));
assert.equal(failures.length,0,'Browser checks have failures; inspect browser-results.json');
