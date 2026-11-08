const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const projects=await fetch('./projects.json').then(r=>{if(!r.ok)throw Error('Project directory unavailable');return r.json()}).catch(()=>{const notice=document.createElement('p');notice.className='script-notice';notice.innerHTML='The interactive layer could not load. <a href="#reading">All facts and projects are still readable below ↓</a>';$('#main').prepend(notice);return []});
const exhibit=$('main').dataset.exhibit;
const link=p=>`<a href="#project-${p.id}">Read ${p.name} ↓</a>`;
const choice=(attr,fn)=>{$$(`button[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{$$(`button[data-${attr}]`).forEach(n=>n.setAttribute('aria-pressed',String(n===b)));fn(Number(b.dataset[attr]));}));};
const motion=$('#motion');
let low=matchMedia('(prefers-reduced-motion: reduce)').matches;
try{low=low||sessionStorage.getItem('andrew-low-motion')==='true'}catch{}
function setMotion(){document.body.classList.toggle('low-motion',low);motion.setAttribute('aria-pressed',String(low));motion.textContent=low?'Low motion: on':'Low motion';}
setMotion();motion.addEventListener('click',()=>{low=!low;setMotion();try{sessionStorage.setItem('andrew-low-motion',String(low))}catch{}});
if(!projects.length)throw Error('Interactive data failed to load; reading fallback remains available.');
if(exhibit==='switchyard'){
 const routes=[[0,1,4],[3,4,2],[0,2,1]], names=['The toolmaker line','The curiosity line','The local-first line'];
 function render(i){$$('.route').forEach((p,j)=>p.style.opacity=i===j?'1':'.15');$('#itinerary').innerHTML=`<span class="eyebrow">YOUR TRANSFER TICKET</span><h2>${names[i]}</h2><ol>${routes[i].map(n=>`<li>${link(projects[n])}</li>`).join('')}</ol><p>${['Build a shared setup. Preserve the record of work. Make overload explicit.','Play with a world. Ask what its work costs. Let music become visible.','Keep reusable tools public, audio local, and task history on your own machine.'][i]}</p>`;}
 choice('route',render);render(0);
}
if(exhibit==='machine'){
 const parts=[['01 / A reusable outer shell',projects[0].description,projects[0]],['02 / Memory, not machinery',projects[1].description,projects[1]],['03 / The tools still do the work','Git, tmux and provider tools remain responsible for their own actions. A registry preserves identity and observations; it does not become a process launcher.',projects[1]]];
 function render(i){const [title,text,p]=parts[i];$('#reveal').innerHTML=`<h2>${title}</h2><p>${text}</p>${link(p)}<p class="caption">Conceptual assembly, not a literal diagram of Andrew’s hardware.</p>`;}
 $('#explode').addEventListener('input',e=>document.body.style.setProperty('--explode',e.target.value));choice('pick',render);render(0);
}
if(exhibit==='score'){
 let order=[0,1,2,3,4];const phrases=['Prepare the instruments: make a setup reusable.','Give the work memory: preserve task identity.','Listen closely: turn a sustained note into visible notation.','Let the rules play: see a world react.','Leave space: make the work budget explicit.'];
 function render(){$$('[data-slot]').forEach((el,i)=>el.textContent=projects[order[i]].name);$('#composition').innerHTML=`<span class="eyebrow">YOUR SILENT SCORE / FIVE PHRASES</span><ol>${order.map(n=>`<li>${phrases[n]} ${link(projects[n])}</li>`).join('')}</ol>`;}
 $('#rotate').addEventListener('click',()=>{order.push(order.shift());render()});$('#reverse').addEventListener('click',()=>{order.reverse();render()});$('#score-reset').addEventListener('click',()=>{order=[0,1,2,3,4];render()});$('#feature-phrase').addEventListener('click',()=>{const n=Number($('#featured-phrase').value);order=[n,...order.filter(x=>x!==n)];render()});render();
}
if(exhibit==='contours'){
 function render(i){const route=i?[3,4,2,0,1]:[0,1,4,3,2];$('#trail-list').innerHTML=route.map((n,j)=>`<li><h3>${projects[n].name}</h3><p>${projects[n].idea}</p>${link(projects[n])}</li>`).join('');$('.atlas .trail').setAttribute('d',i?'M130 500L390 230L610 180L880 130':'M130 500L320 400L760 300L880 130');}
 choice('trail',render);render(0);
}
if(exhibit==='press'){
 const sheets=[['Make the rules visible.','A small system gets more interesting when you can understand and change its rules.',3],['Keep personal data local.','A useful tool need not send your private input away. Make the boundary part of the design.',2],['Leave something to borrow.','Publish the reusable pieces. Keep private context separate. Let someone start with one module.',0]];
 function render(i){const [title,text,n]=sheets[i];$('#impression').innerHTML=`<span class="eyebrow">THE ANDREW KOFINK IDEA PRESS / EDITION 0${i+1}</span><h2>${title}</h2><p>${text}</p><div class="stamp" aria-hidden="true">TAKE AN<br>IDEA</div><p>Explore ${projects[n].name}:<br><a href="${projects[n].source}">${projects[n].source}</a></p><p class="caption">An editorial principle inspired by public work. Inspect source and licensing before reuse.</p>`;}
 choice('principle',render);$('#print').addEventListener('click',()=>window.print());render(0);
}
if(exhibit==='garden'){
 let cells,season=0;const grid=$('#garden-grid');
 for(let i=0;i<64;i++){const b=document.createElement('button');b.type='button';b.dataset.cell=i;b.tabIndex=i===0?0:-1;b.addEventListener('keydown',e=>{const moves={ArrowRight:1,ArrowLeft:-1,ArrowDown:8,ArrowUp:-8,Home:-(i%8),End:7-i%8};if(!(e.key in moves))return;e.preventDefault();const target=Math.max(0,Math.min(63,i+moves[e.key]));$$('[data-cell]').forEach((n,j)=>n.tabIndex=j===target?0:-1);$(`[data-cell="${target}"]`).focus()});b.setAttribute('aria-label',`Plant at row ${Math.floor(i/8)+1}, column ${i%8+1}`);b.addEventListener('click',()=>{cells[i]=!cells[i];render()});grid.append(b);}
 function render(){$$('[data-cell]').forEach((b,i)=>{b.textContent=cells[i]?'✳':'·';b.setAttribute('aria-pressed',String(cells[i]));});$('#garden-status').textContent=`Season ${season}. ${cells.filter(Boolean).length} of 64 squares planted. ${$('#rule').value==='spread'?'Each seed can grow into the square to its right; edges do not wrap.':'An empty square grows only with exactly two orthogonal neighbors.'}`;}
 function reset(){cells=Array.from({length:64},(_,i)=>[18,26,27,35,44].includes(i));season=0;render()}
 $('#season').addEventListener('click',()=>{const next=[...cells];for(let i=0;i<64;i++){const x=i%8,y=Math.floor(i/8);if($('#rule').value==='spread'){if(cells[i]&&x<7)next[i+1]=true;}else{const ns=[x>0?i-1:-1,x<7?i+1:-1,y>0?i-8:-1,y<7?i+8:-1].filter(n=>n>=0&&cells[n]).length;if(!cells[i]&&ns===2)next[i]=true;}}cells=next;season++;render()});$('#rule').addEventListener('change',render);$('#garden-reset').addEventListener('click',reset);reset();
}
if(exhibit==='xray'){
 function render(i){document.body.dataset.layer=i;$('#xray-reading').innerHTML=i?`<h2>The interesting part is the boundary.</h2><p>${projects[2].description}</p><p>Borrow this: show people what stays private and where the prototype stops being reliable.</p>${link(projects[2])}`:`<h2>A small piece of musical curiosity.</h2><p>Live Staff turns one sustained instrument or voice into live notation. This page is a silent illustration; it never requests your microphone.</p>${link(projects[2])}`;}
 choice('layer',render);render(0);
}
if(exhibit==='hearing'){
 let pending=16,done=0,step=0,comparison='';const budget=$('#budget');
 function render(){const visible=Math.min(pending,64);$('#queue').innerHTML=Array.from({length:visible},(_,i)=>`<span class="job" aria-hidden="true">${i+1+done}</span>`).join('');$('#queue').setAttribute('aria-label',`${pending} pending jobs`);$('#budget-value').textContent=budget.value;$('#verdict').textContent=`Step ${step}: ${done} completed, ${pending} waiting. ${comparison} ${pending?'The queue remains visible; the budget stays fixed.':'All admitted work is complete.'}`;$('#step').disabled=pending===0;$('#all-step').disabled=pending===0;$('#admit').disabled=pending>=56;}
 budget.addEventListener('input',render);$('#admit').addEventListener('click',()=>{pending+=8;render()});$('#step').addEventListener('click',()=>{comparison='';const count=Math.min(pending,Number(budget.value));pending-=count;done+=count;step++;render()});$('#all-step').addEventListener('click',()=>{const spent=pending;done+=pending;pending=0;step++;comparison=`Unbounded comparison spent ${spent} credits in one step, against a chosen budget of ${budget.value}. This illustrates accounting, not measured latency.`;render()});$('#queue-reset').addEventListener('click',()=>{pending=16;done=0;step=0;comparison='';budget.value=3;render()});render();
}
if(exhibit==='windows'){
 const stories=[['At the workbench','I work on Bitbucket Cloud at Atlassian in the NYC office. Outside that work, I build small tools and share reusable setup.',0],['In the music room','Music can be a thing to enjoy and a thing to investigate. Live Staff explores the meeting point: a sustained sound becoming notation.',2],['In the garden','Gardening is one of my off-screen interests. Systems that grow, react and surprise also show up in my game experiments.',3],['At the theater','Opera and ballet are part of my life beyond software. This window is a reminder that not every interest needs to become a productivity tool.',null],['Inside an experiment','Tinderbox and Cascade let me explore systems by playing with their rules, from materials to work budgets.',4],['On the street','New York is where I live and work. Cycling, cooking and finding good food are other ways I get away from the screen.',null]];
 function render(i){const [title,text,n]=stories[i];$('#window-story').innerHTML=`<span class="eyebrow">WINDOW 0${i+1}</span><h2>${title}</h2><p>${text}</p>${n===null?'<a href="#reading">Meet Andrew ↓</a>':link(projects[n])}`;}
 choice('window',render);choice('hour',i=>{document.body.dataset.hour=i});render(0);document.body.dataset.hour=0;
}
if(exhibit==='zine'){
 let page=0;const leaves=[['01 / A PERSON, NOT A TITLE','Make room for another interest.','I’m Andrew. I work on Bitbucket Cloud at Atlassian in New York. But a job title is not a table of contents. There is music, food, cycling, gardening, and always another small thing to investigate.',null],['02 / MAKE THE TOOLS YOUR OWN','Start with one useful piece.','My dots setup is modular. You don’t need to adopt someone else’s whole environment. A good shared tool should give you a place to start, not a new identity to wear.',0],['03 / LET THE WORK REMEMBER','A session ends. The work needn’t.','akagent-cli preserves task identity, observations and recovery records locally. Git, tmux and provider tools still do their own jobs. Memory is useful without becoming machinery.',1],['04 / FOLLOW A SMALL QUESTION','What does a note look like?','Live Staff turns one sustained voice or instrument into notation on your device. A proof of concept can be useful and honest about its limits at the same time.',2],['05 / KEEP A PLACE FOR PLAY','Build a world. Change a rule.','Tinderbox explores interacting materials. Cascade explores what happens when work has a budget. They are experiments you can inspect, not just finished things to admire.',3]];
 function render(){const [folio,title,text,n]=leaves[page];$('#leaf').innerHTML=`<span class="folio">${folio}</span><h2>${title}</h2><p>${text}</p>${n===null?'<a href="#reading">Meet the person behind the pages ↓</a>':link(projects[n])}`;$('#page-number').textContent=`${page+1} / 5`;$('#prev-leaf').disabled=page===0;$('#next-leaf').disabled=page===4;}
 $('#prev-leaf').addEventListener('click',()=>{if(page>0)page--;render()});$('#next-leaf').addEventListener('click',()=>{if(page<4)page++;render()});render();
}
