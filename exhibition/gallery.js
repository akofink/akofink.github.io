// Shortlist is convenience-only. Storage-disabled/private browsers remain usable.
const key = 'ak-design-shortlist-v1';
let favorites = new Set();
try { const stored=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(stored)) favorites=new Set(stored); } catch {}
let filtering=false;
const buttons=[...document.querySelectorAll('.favorite')];
function render(){
 for(const button of buttons){const selected=favorites.has(button.dataset.id);button.setAttribute('aria-pressed',String(selected));button.textContent=selected?'Shortlisted ✓':'Shortlist +';}
 for(const card of document.querySelectorAll('.design-card')) card.hidden=filtering&&!favorites.has(card.dataset.design);
 const empty=document.querySelector('#empty-shortlist');
 if(empty) empty.hidden=!filtering||document.querySelectorAll('.design-card:not([hidden])').length>0;
}
for(const button of buttons) button.addEventListener('click',()=>{
 favorites.has(button.dataset.id)?favorites.delete(button.dataset.id):favorites.add(button.dataset.id);
 try{localStorage.setItem(key,JSON.stringify([...favorites]));}catch{}
 render();
});
const filter=document.querySelector('#shortlist-filter');
filter?.addEventListener('click',()=>{filtering=!filtering;filter.setAttribute('aria-pressed',String(filtering));filter.textContent=filtering?'Show all designs':'Show shortlist';render();});
render();
const observer=new ResizeObserver(entries=>{for(const {target,contentRect} of entries) target.style.setProperty('--preview-scale',contentRect.width/1000);});
for(const item of document.querySelectorAll('.miniature')) observer.observe(item);
for(const [i,select] of [...document.querySelectorAll('select[data-frame]')].entries()){
 if(i===1) select.selectedIndex=1;
 const update=()=>{document.getElementById(select.dataset.frame).src=`/${select.value}/?embed=1`;document.getElementById(select.id.replace('pick','open')).href=`/${select.value}/`;};
 select.addEventListener('change',update); update();
}
