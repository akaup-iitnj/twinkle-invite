// One photographic doorway, with both moving leaves sampled from the same image.
export function createEntrance(container) {
 const art='assets/carved-door.png';
 const backdrop=document.createElement('div');backdrop.className='door-backdrop';container.prepend(backdrop);
 const world=document.createElement('div');world.className='photo-door-world';
 const interior=document.createElement('div');interior.className='door-interior';world.appendChild(interior);
 const frame=document.createElement('img');frame.className='photo-door-frame';frame.src=art;frame.alt='';frame.decoding='async';frame.fetchPriority='high';world.appendChild(frame);
 const leaves=[];
 for(const side of ['left','right']){const leaf=document.createElement('div');leaf.className='photo-door-leaf photo-door-'+side;world.appendChild(leaf);leaves.push(leaf);}
 container.prepend(world);
 let progress=0,width=0,height=0;const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>t*t*(3-2*t);
 function render(p=progress){progress=p;const zoom=ease(clamp(p/.34)),open=ease(clamp((p-.30)/.52)),exit=ease(clamp((p-.83)/.17));
  world.style.transform=`translate(-50%,-50%) scale(${1+zoom*.19+exit*.06})`;
  leaves[0].style.transform=`rotateY(${-open*103}deg)`;leaves[1].style.transform=`rotateY(${open*103}deg)`;
  world.style.opacity=String(1-exit);backdrop.style.opacity=String(.8-exit*.35);
 }
 function resize(){width=Math.min(innerHeight*2/3,innerWidth/.78);height=width*1.5;world.style.width=width+'px';world.style.height=height+'px';world.style.setProperty('--art-width',width+'px');world.style.setProperty('--art-height',height+'px');leaves[0].style.backgroundPosition=(-width*.125)+'px '+(-height*.1172)+'px';leaves[1].style.backgroundPosition=(-width*.5)+'px '+(-height*.1172)+'px';render();}
 window.addEventListener('resize',resize);resize();return{render,dispose(){world.remove();backdrop.remove();window.removeEventListener('resize',resize);}};
}
