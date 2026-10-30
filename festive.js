// Decorative layers are isolated from invitation content and never intercept a click.
(() => {
 const ns='http://www.w3.org/2000/svg';
 function svgNode(tag,attrs,parent){const el=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attrs))el.setAttribute(key,value);parent?.appendChild(el);return el;}
 const room=document.createElement('div');room.id='festive-room';room.setAttribute('aria-hidden','true');
 room.innerHTML='<div class="ceiling-glow"></div><div class="room-light room-light-left"></div><div class="room-light room-light-right"></div>';
 const canopy=svgNode('svg',{viewBox:'0 0 1440 320',class:'flower-canopy',preserveAspectRatio:'xMidYMin slice'},room);
 const defs=svgNode('defs',{},canopy);
 for(const [id,light,dark] of [['orange-flower','#ffc74e','#d95d0b'],['gold-flower','#ffe58a','#e6970c'],['jasmine-flower','#fff8e4','#cbbd85']]){const g=svgNode('radialGradient',{id,cx:'32%',cy:'25%',r:'75%'},defs);svgNode('stop',{offset:'0%','stop-color':light},g);svgNode('stop',{offset:'100%','stop-color':dark},g);}
 function flower(x,y,r,gold=false,jasmine=false){const g=svgNode('g',{transform:`translate(${x} ${y})`},canopy);const fill=`url(#${jasmine?'jasmine-flower':gold?'gold-flower':'orange-flower'})`;for(let k=0;k<9;k++){let a=k*Math.PI*2/9;svgNode('ellipse',{cx:Math.sin(a)*r*.42,cy:Math.cos(a)*r*.42,rx:r*.47,ry:r*.56,fill,transform:`rotate(${-k*40} ${Math.sin(a)*r*.42} ${Math.cos(a)*r*.42})`},g);}svgNode('circle',{r:r*.38,fill},g);}
 for(let swag=0;swag<4;swag++)for(let i=0;i<=34;i++){const t=i/34,x=swag*360+t*360,y=15+Math.sin(t*Math.PI)*62;flower(x,y,10,i%5===0);if(i%5===0)svgNode('path',{d:`M${x},${y+7} q-12,20 0,38 q14,-18 0,-38`,fill:'#426231'},canopy);}
 for(const x of [22,86,1354,1418]){const length=x===22||x===1418?21:14;for(let j=0;j<length;j++)flower(x,35+j*12,j%4===0?7:5,j%4===0,j%4!==0);}
 document.body.appendChild(room);
 const petals=document.createElement('div');petals.id='marigold-shower';petals.setAttribute('aria-hidden','true');
 const count=28;
 for(let i=0;i<count;i++){const p=document.createElement('span');p.className='petal-fall';p.style.cssText=`--x:${(i*37.13)%100}%;--duration:${17+i%9*1.25}s;--delay:${-(i*2.73)%26}s;--drift:${Math.sin(i*2.4)*70}px;--sway:${3+i%5}s;--size:${8+i%5}px;--turn:${i%2?1:-1};`;const leaf=document.createElement('i');leaf.className='marigold-petal';p.appendChild(leaf);petals.appendChild(p);}
 document.body.appendChild(petals);
 const toggle=document.createElement('button');toggle.type='button';toggle.id='petal-toggle';toggle.className='replay-button petal-toggle';toggle.textContent='Pause petals';toggle.setAttribute('aria-pressed','false');toggle.addEventListener('click',()=>{const paused=document.body.classList.toggle('petals-user-paused');toggle.textContent=paused?'Resume petals':'Pause petals';toggle.setAttribute('aria-pressed',String(paused));});document.body.appendChild(toggle);
 function visibility(){document.body.classList.toggle('petals-paused',document.hidden);}document.addEventListener('visibilitychange',visibility);visibility();
})();
