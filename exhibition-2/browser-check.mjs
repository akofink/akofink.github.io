import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.PREVIEW_URL||'http://127.0.0.1:4174';
const evidence=process.env.EVIDENCE_DIR;
assert(evidence,'Set EVIDENCE_DIR to an ignored local evidence directory');await mkdir(evidence,{recursive:true});
const ids=['switchyard','machine','score','contours','press','garden','xray','hearing','windows','zine'];
const browser=await chromium.launch({headless:true});
const failures=[],results=[];
try{
 for(const size of [{name:'desktop',width:1440,height:1100},{name:'mobile',width:390,height:844}]){
  const context=await browser.newContext({viewport:{width:size.width,height:size.height},isMobile:size.name==='mobile',hasTouch:size.name==='mobile',reducedMotion:'reduce'});
  for(const id of ['index',...ids]){
   const page=await context.newPage();const errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base))requests.push(r.url())});
   await page.goto(`${base}/${id}.html`);if(id!=='index')await page.waitForSelector('#motion[aria-pressed=true]');
   await page.screenshot({path:`${evidence}/${id}-${size.name}-initial.png`,fullPage:true});
   const initialAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   if(initialAxe.violations.length)failures.push({id,size:size.name,state:'initial',violations:initialAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert(!overflow,`${id} ${size.name} horizontal overflow`);
   await page.keyboard.press('Tab');assert(await page.locator('.skip').evaluate(e=>e===document.activeElement),`${id} skip link not first`);
   if(id!=='index'){
    await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
    assert(await page.locator('body').evaluate(b=>b.classList.contains('low-motion')));
    assert(await page.locator('body').evaluate(()=>[...document.querySelectorAll('*')].every(e=>getComputedStyle(e).transitionDuration.split(',').every(t=>parseFloat(t)===0))),'reduced motion leaves active transitions');
    if(id==='switchyard'){await page.locator('[data-route="1"]').click();await page.locator('#itinerary').getByText('The curiosity line').waitFor();}
    if(id==='machine'){await page.locator('#explode').fill('100');await page.locator('[data-pick="1"]').click();assert((await page.locator('#reveal').innerText()).includes('Memory, not machinery'));}
    if(id==='score'){await page.locator('#rotate').click();assert.equal(await page.locator('[data-slot="0"]').innerText(),'akagent-cli');await page.locator('#reverse').click();assert.equal(await page.locator('[data-slot="0"]').innerText(),'dots');await page.locator('#featured-phrase').selectOption('3');await page.locator('#feature-phrase').click();assert.equal(await page.locator('[data-slot="0"]').innerText(),'Tinderbox');}
    if(id==='contours'){await page.locator('[data-trail="1"]').click();assert.equal(await page.locator('#trail-list h3').first().innerText(),'Tinderbox');}
    if(id==='press'){await page.locator('[data-principle="1"]').click();assert((await page.locator('#impression').textContent()).includes('Keep personal data local.'));await page.evaluate(()=>{window.print=()=>{window.__printed=true}});await page.locator('#print').click();assert(await page.evaluate(()=>window.__printed));await page.emulateMedia({media:'print'});await page.screenshot({path:`${evidence}/press-${size.name}-print.png`,fullPage:true});if(size.name==='desktop')await page.pdf({path:`${evidence}/idea-sheet.pdf`,format:'A4',margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});await page.emulateMedia({media:'screen'});}
    if(id==='garden'){await page.locator('#season').click();assert((await page.locator('#garden-status').innerText()).includes('Season 1.'));assert((await page.locator('#garden-status').innerText()).includes('9 of 64'));await page.locator('#rule').selectOption('shelter');await page.locator('[data-cell="0"]').click();assert.equal(await page.locator('[data-cell="0"]').getAttribute('aria-pressed'),'true');await page.locator('[data-cell="0"]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.dataset.cell),'1');await page.keyboard.press('Space');assert.equal(await page.locator('[data-cell="1"]').getAttribute('aria-pressed'),'true');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'rule');}
    if(id==='xray'){await page.locator('[data-layer="1"]').click();assert(await page.locator('#underlay').isVisible());assert((await page.locator('#xray-reading').innerText()).includes('proof of concept'));}
    if(id==='hearing'){await page.locator('#step').click();assert((await page.locator('#verdict').innerText()).includes('3 completed, 13 waiting'));await page.locator('#budget').fill('8');await page.locator('#step').click();assert((await page.locator('#verdict').innerText()).includes('11 completed, 5 waiting'));await page.locator('#admit').click();assert((await page.locator('#verdict').innerText()).includes('13 waiting'));await page.locator('#all-step').click();assert((await page.locator('#verdict').innerText()).includes('spent 13 credits'));}
    if(id==='windows'){await page.locator('[data-hour="2"]').click();await page.locator('[data-window="3"]').click();assert((await page.locator('#window-story').innerText()).includes('not every interest needs to become a productivity tool'));}
    if(id==='zine'){await page.locator('#next-leaf').click();assert((await page.locator('#leaf').innerText()).includes('Start with one useful piece.'));for(let i=0;i<3;i++)await page.locator('#next-leaf').click();assert(await page.locator('#next-leaf').isDisabled());await page.locator('#prev-leaf').click();assert.equal(await page.locator('#page-number').innerText(),'4 / 5');}
    await page.locator('.experience').screenshot({path:`${evidence}/${id}-${size.name}-interacted.png`});
    // Keyboard activate motion switch and first experience control, then restore reduced mode.
    await page.locator('#motion').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#motion').getAttribute('aria-pressed'),'false');await page.keyboard.press('Space');
    const first=page.locator('.experience button').first();await first.focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('.project-directory article').count(),5);
   }
   const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
   if(violations.length)failures.push({id,size:size.name,violations});
   assert.deepEqual(errors,[],`${id} browser errors`);assert.deepEqual(requests,[],`${id} remote runtime requests`);
   results.push({id,size:size.name,overflow,axeViolations:violations.length,pageErrors:errors.length,remoteRequests:requests.length});await page.close();
  }await context.close();
 }
 const normal=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'no-preference'});
 for(const id of ids){const p=await normal.newPage();await p.goto(`${base}/${id}.html`);await p.waitForSelector('#motion[aria-pressed=false]');if(id==='machine'){await p.locator('#explode').fill('100');await p.waitForTimeout(400)}await p.locator('.experience').screenshot({path:`${evidence}/${id}-standard-motion.png`});await p.close()}await normal.close();
 const plain=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 for(const id of ids){const p=await plain.newPage();await p.goto(`${base}/${id}.html`);assert.equal(await p.locator('.project-directory article').count(),5);assert(await p.locator('.bio').isVisible());await p.close()}await plain.close();
 // 200% zoom equivalent: half desktop CSS width, maintaining desktop physical viewport.
 const zoom=await browser.newContext({viewport:{width:720,height:550},deviceScaleFactor:2});
 for(const id of ids){const p=await zoom.newPage();await p.goto(`${base}/${id}.html`);assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));await p.close()}await zoom.close();
 await writeFile(`${evidence}/browser-results.json`,JSON.stringify({results,failures,noScriptPages:10,zoomEquivalentPages:10,scope:'Chromium headless; automated keyboard interactions, reduced motion, axe, overflow, interactions; not a screen-reader or cross-browser audit'},null,2));
 if(failures.length){console.log(JSON.stringify(failures,null,2));throw Error(`${failures.length} pages with axe findings`)}
 console.log(`PASS: ${results.length} rendered viewport/page checks, 10 no-script directories, 10 zoom-equivalent checks. Evidence: ${evidence}`);
}finally{await browser.close()}
