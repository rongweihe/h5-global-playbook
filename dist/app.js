document.getElementById('print').addEventListener('click',()=>window.print());
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  document.querySelectorAll('.product').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.type!==button.dataset.filter);
}));
const presets={low:{dau:'10000',sessions:'1.3',slots:'2',fill:'50',ecpm:'3'},base:{dau:'50000',sessions:'1.6',slots:'3',fill:'70',ecpm:'6'},high:{dau:'150000',sessions:'1.8',slots:'3.5',fill:'80',ecpm:'10'}};
const form=document.getElementById('calc-form');
form.addEventListener('submit',e=>e.preventDefault());
function renderCalculation(){
  const error=document.getElementById('calc-error');
  try{
    const m=H5Model.calculate(Object.fromEntries(new FormData(form)));const fmt=H5Model.decimal;
    document.getElementById('revenue').textContent='¥'+fmt(m.cnyN,m.cnyD);
    document.getElementById('usd').textContent='US$'+fmt(m.usdN,m.usdD);
    document.getElementById('surplus').textContent=(m.surplusN<0n?'−¥':'¥')+fmt(m.surplusN<0n?-m.surplusN:m.surplusN,m.surplusD);
    document.getElementById('surplus').classList.toggle('negative',m.surplusN<0n);
    document.getElementById('break-even').textContent=m.breakEven===null?'当前参数无法覆盖成本':fmt(m.breakEven,1n,0);
    document.getElementById('runway').textContent=m.hasBurn?fmt(m.runwayN,m.runwayD,1)+' 个月':'此稳态假设下不消耗现金';
    error.textContent='';
  }catch(e){error.textContent=e.message;for(const id of ['revenue','usd','surplus','break-even','runway'])document.getElementById(id).textContent='—';}
}
form.addEventListener('input',()=>{document.querySelectorAll('[data-preset]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});renderCalculation();});
document.querySelectorAll('[data-preset]').forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')));b.addEventListener('click',()=>{
  const values={...presets[b.dataset.preset],share:'50',fx:'7',cost:'220000',ua:'0',cash:'2000000'};
  for(const [key,value]of Object.entries(values))form.elements.namedItem(key).value=value;
  document.querySelectorAll('[data-preset]').forEach(p=>{p.classList.toggle('active',p===b);p.setAttribute('aria-pressed',String(p===b));});renderCalculation();
});});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)document.querySelectorAll('.sidebar nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));},{rootMargin:'-10% 0px -75% 0px'});document.querySelectorAll('section[id]').forEach(s=>observer.observe(s));}
renderCalculation();
