const config=window.INVITATION;
const $=id=>document.getElementById(id);
for(const [id,key] of Object.entries({'host-names':'hosts','welcome-hosts':'hosts','date-value':'date','time-value':'time','address-value':'address','dinner-note':'dinner','phone-value':'phone'}))$(id).textContent=config[key];
$('phone-value').href='tel:'+config.phoneDial;
let entrance=null,frame=0,generation=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function state(value){document.body.dataset.scene=value;}
function reveal(focus=true){generation++;cancelAnimationFrame(frame);entrance?.render(1);state('revealed');$('welcome').hidden=true;$('welcome').inert=true;$('invitation').hidden=false;$('replay-button').hidden=false;$('motion-skip').hidden=true;if(focus)$('invitation-title').focus({preventScroll:true});}
async function start(){if(document.body.dataset.scene!=='welcome')return;if(reduced.matches){reveal();return;}if(!entrance){const request=++generation;state('loading');$('enter-button').disabled=true;await entranceLoad;$('enter-button').disabled=false;if(request!==generation)return;state('welcome');if(!entrance){reveal();return;}}const token=++generation;state('approaching');$('welcome').inert=true;$('motion-skip').hidden=false;const started=performance.now();function tick(now){if(token!==generation)return;const p=Math.min((now-started)/2000,1);entrance.render(p);if(p>=1)reveal();else frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);}
function reset(){generation++;cancelAnimationFrame(frame);entrance?.render(0);$('invitation').hidden=true;$('replay-button').hidden=true;$('motion-skip').hidden=true;$('welcome').hidden=false;$('welcome').inert=false;state('welcome');$('enter-button').focus({preventScroll:true});}
$('enter-button').addEventListener('click',start);$('welcome').addEventListener('click',event=>{if(!event.target.closest('button,a'))start();});$('skip-button').addEventListener('click',()=>reveal());$('motion-skip').addEventListener('click',()=>reveal());$('replay-button').addEventListener('click',reset);
$('rsvp-button').addEventListener('click',()=>{if(config.googleFormUrl){location.assign(config.googleFormUrl);return;}$('rsvp-status').textContent='Please RSVP by calling '+config.phone+'.';$('rsvp-status').hidden=false;});
state('welcome');
const entranceLoad=import('./entrance.js?v=relief-door-3').then(({createEntrance})=>{try{entrance=createEntrance($('scene-stage'));entrance.render(document.body.dataset.scene==='revealed'?1:0);document.body.classList.add('scene-ready');}catch(error){console.warn('Door artwork unavailable',error);document.body.classList.add('scene-fallback');}}).catch(()=>document.body.classList.add('scene-fallback'));
