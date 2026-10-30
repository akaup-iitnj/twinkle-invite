import * as THREE from './assets/three.module.js';
export function createEntrance(container) {
 const scene=new THREE.Scene(); scene.background=new THREE.Color('#88b9ef');scene.fog=new THREE.Fog('#a6c8e9',32,85);
 const camera=new THREE.PerspectiveCamera(46,1,.04,100);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.prepend(renderer.domElement);
 const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const navy=mat('#243344'),lap=mat('#2c3e51'),white=mat('#f0efdf'),gray=mat('#bcc3c6'),roof=mat('#36414b'),doorMat=mat('#152331'),panel=mat('#1d2e3d'),metal=mat('#b9b7aa',.28,.8),concrete=mat('#bdc0bb'),grass=mat('#527844'),foliage=mat('#254a35'),glass=mat('#345d79',.22,.25);
 const warm=new THREE.MeshStandardMaterial({color:'#fff1cd',emissive:'#ffb658',emissiveIntensity:1.5});
 const geoBox=new THREE.BoxGeometry(1,1,1);
 function box(w,h,d,x,y,z,m,parent=scene){const o=new THREE.Mesh(geoBox,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function sphere(r,x,y,z,m,parent=scene){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 scene.add(new THREE.HemisphereLight('#d7e9ff','#64744e',2.1));
 const sun=new THREE.DirectionalLight('#fff2d3',3.2);sun.position.set(-7,15,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:16,bottom:-15});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
 const porchLight=new THREE.PointLight('#ffd395',8,5,2);porchLight.position.set(.55,2.4,.75);scene.add(porchLight);
 const indoor=new THREE.PointLight('#ffdeb1',20,8,2);indoor.position.set(1.25,2,-3);scene.add(indoor);
 box(100,.15,100,0,-.17,0,grass);
 // Concrete driveway sits to the left; the narrow walk turns toward the recessed porch.
 box(4.15,.06,17,-1.95,-.045,8,concrete);
 for(const z of [3.5,7,10.5,14])box(4.15,.007,.018,-1.95,-.01,z,mat('#929c98'));
 box(2.9,.065,1.25,1.40,-.025,2.05,concrete);box(3.9,.19,2.15,2.13,.07,.65,concrete);box(1.35,.08,.55,1.35,.205,-.15,white);
 // Two-storey navy garage volume, with a separate recessed porch wing.
 box(4.9,6.85,4.4,-1.85,3.425,-2.1,navy);
 box(3.6,3.38,4.05,2.4,5.08,-2.28,gray);
 box(.35,3.4,3.8,.78,1.7,-2.35,navy);
 box(2.15,3.4,3.8,3.18,1.7,-2.35,navy);
 box(1.6,.72,3.8,1.60,3.04,-2.35,navy);
 // Horizontal clapboard siding has real overlap and thin shadow lines.
 function siding(x,w,y0,y1,z,material=lap){for(let y=y0;y<y1;y+=.135){const b=box(w,.121,.065,x,y+.06,z,material);b.rotation.x=-.055;}}
 siding(-1.85,4.9,.05,6.85,.135);
 siding(.78,.35,.1,3.4,-.41);siding(3.18,2.15,.1,3.4,-.41);siding(1.60,1.6,2.68,3.4,-.41);
 // White corner boards and board-and-batten on the pale upper porch wing.
 for(const x of [-4.33,.61])box(.14,6.9,.17,x,3.45,.18,white);
 for(let x=.69;x<4.21;x+=.22)box(.025,3.10,.055,x,5.04,-.205,white);
 box(.14,3.38,.13,4.21,5.08,-.17,white);
 // Front gable, projecting white fascia and dark shingled roof.
 const gable=new THREE.Shape();gable.moveTo(-4.45,6.85);gable.lineTo(-1.85,8.48);gable.lineTo(.75,6.85);gable.closePath();
 const gableMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(gable,{depth:4.55,bevelEnabled:false}),navy);gableMesh.position.z=-4.35;gableMesh.castShadow=true;scene.add(gableMesh);
 for(let y=6.9;y<8.45;y+=.135){const half=(8.48-y)/1.63*2.6;box(half*2,.12,.045,-1.85,y,.235,lap);}
 const slope=Math.atan2(1.63,2.6),roofLen=Math.hypot(2.6,1.63)+.28;
 for(const s of [-1,1]){const r=box(roofLen,.13,4.95,-1.85+s*1.32,7.69,-2.05,roof);r.rotation.z=-s*slope;const fascia=box(roofLen,.19,.16,-1.85+s*1.32,7.61,.50,white);fascia.rotation.z=-s*slope;}
 // Shingle courses stay within each sloped roof face.
 for(const s of [-1,1])for(let i=0;i<11;i++){const t=(i+.5)/11;const x=-1.85+s*(t*2.75),y=8.56-t*1.72;const row=box(.018,.025,4.9,x,y,-2.05,mat(i%2?'#46515a':'#3e4953'));row.rotation.z=-s*slope;}
 box(3.9,.18,4.55,2.42,6.85,-2.2,roof);box(3.95,.17,.20,2.42,6.76,.12,white);box(3.95,.13,.24,2.42,6.61,.15,white);
 // Low porch roof, substantial white beam and the square end column.
 const porchRoof=box(4.15,.15,2.1,2.4,3.52,.25,roof);porchRoof.rotation.x=-.11;
 box(4.15,.22,.24,2.4,3.35,1.22,white);box(4.15,.14,.23,2.4,3.13,1.22,white);box(.19,3.03,.19,4.30,1.63,1.20,white);box(.27,.14,.27,4.30,.20,1.20,white);
 // Stone veneer along the lower facade, each block varies gently in tone.
 const stoneMats=['#9b9387','#aaa396','#8b8a82','#b5ada1','#92988f'].map(c=>mat(c));
 function masonry(x,w,z){for(let row=0;row<5;row++){const h=.18;for(let col=0;col<Math.ceil(w/.48);col++){let left=-w/2+col*.48+(row%2)*.23;let right=Math.min(left+.46,w/2);left=Math.max(left,-w/2);if(right>left)box(right-left,h,.095,x+(left+right)/2,.12+row*.195,z,stoneMats[(row*7+col*3)%5]);}}box(w+.05,.08,.15,x,1.04,z+.02,concrete);}
 // Garage opening is inset over the siding; white rails and embossed sectional panels.
 const gx=-1.85;box(3.78,2.89,.12,gx,1.5,.22,white);box(3.45,2.62,.12,gx,1.45,.31,mat('#daddd5'));
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=gx-1.29+col*.86,y=.48+row*.63;box(.78,.50,.025,x,y,.385,white);box(.66,.38,.015,x,y,.405,mat('#d6dbd5'));}
 for(let row=0;row<4;row++)box(3.45,.018,.02,gx,.17+row*.64,.42,mat('#aeb7b5'));
 box(.11,2.9,.23,gx-1.83,1.5,.32,white);box(.11,2.9,.23,gx+1.83,1.5,.32,white);box(3.78,.18,.23,gx,2.98,.32,white);
 masonry(-4.02,.52,.23);masonry(.28,.63,.23);masonry(3.18,2.15,-.30);
 // Double-hung windows with the photo's six-over-six white grids and dark shutters.
 function windowAt(x,y,w,h,z,shutters=false){box(w+.19,h+.20,.13,x,y,z,white);box(w,h,.07,x,y,z+.09,glass);box(w+.24,.09,.23,x,y-h/2-.08,z+.07,white);for(const dx of [-w/2,w/2])box(.055,h,.09,x+dx,y,z+.16,white);for(const dy of [-h/2,0,h/2])box(w,.055,.09,x,y+dy,z+.16,white);for(const dx of [-w/6,w/6])box(.022,h,.04,x+dx,y,z+.16,white);for(const dy of [-h/4,h/4])box(w,.022,.04,x,y+dy,z+.16,white);if(shutters)for(const s of [-1,1]){box(.34,h+.10,.09,x+s*(w/2+.27),y,z+.04,doorMat);for(let i=0;i<13;i++)box(.27,.045,.045,x+s*(w/2+.27),y-h/2+i*h/12,z+.10,navy);}}
 windowAt(-2.57,5.24,1.14,1.95,.26,true);windowAt(-1.13,5.24,1.14,1.95,.26,true);
 windowAt(2.42,5.18,.97,1.68,-.11);windowAt(3.35,2.03,.68,1.72,-.29);
 // Single navy six-panel door recessed beneath the porch, on a working hinge.
 const doorX=1.55,doorZ=-.34;const hinge=new THREE.Group();hinge.position.set(doorX-.56,.24,doorZ);scene.add(hinge);
 box(1.1,2.44,.115,.55,1.22,0,doorMat,hinge);
 for(const [cy,h] of [[.55,.68],[1.45,.75],[2.08,.32]])for(const cx of [.29,.81]){box(.39,h,.045,cx,cy,.08,panel,hinge);for(const dx of [-.2,.2])box(.022,h+.04,.018,cx+dx,cy,.11,navy,hinge);for(const dy of [-h/2,h/2])box(.41,.022,.018,cx,cy+dy,.11,navy,hinge);}
 box(.075,.29,.045,.99,1.17,.12,metal,hinge);sphere(.042,.99,1.25,.17,metal,hinge);sphere(.036,.99,1.48,.15,metal,hinge);
 for(const x of [doorX-.64,doorX+.64])box(.10,2.62,.20,x,1.49,doorZ+.015,white);box(1.38,.1,.20,doorX,2.80,doorZ+.015,white);
 box(1.18,.10,.30,doorX,.25,doorZ+.04,concrete);
 // Interior volume behind the doorway is open, with continuous flooring.
 const interior=mat('#e9ddc7');box(2.6,.12,8,doorX,.18,-4.2,mat('#b49b76'));box(2.6,3.4,.15,doorX,1.7,-7.8,interior);for(const s of [-1,1])box(.15,3.4,7,doorX+s*1.31,1.7,-4.1,interior);

 // Warm festive interior: ceiling torans, mango leaves, jasmine and brass lamps.
 const saffron=mat('#a74820'), ochre=mat('#d58d39'), brass=mat('#b78a3c',.3,.7);
 const roomGlow=new THREE.PointLight('#ffbd66',38,10,2);roomGlow.position.set(doorX,2.9,-4.4);scene.add(roomGlow);
 box(2.6,.10,7,doorX,3.36,-4.2,mat('#e7c38a'));
 for(let i=0;i<22;i++){const x=doorX-1.24+i*.118;box(.13,2.95,.06,x,1.7,-7.67,i%2?saffron:ochre);}
 const flowers=[[],[],[]];
 function floret(x,y,z,r,color){for(let k=0;k<7;k++){const a=k*Math.PI*2/7;flowers[color].push([x+Math.cos(a)*r*.53,y+Math.sin(a)*r*.53,z+Math.sin(k*2)*r*.18,r*.55]);}flowers[color].push([x,y,z+r*.3,r*.58]);}
 for(const z of [-.21,-2.8,-5.15,-7.45]){
  for(let i=0;i<=34;i++){const t=i/34,x=doorX-1.24+t*2.48,y=3.06-Math.sin(t*Math.PI)*.46;floret(x,y,z,.073,i%4===0?1:0);if(i%4===0){const leaf=sphere(.07,x,y-.20,z-.02,foliage);leaf.scale.set(.6,2.2,.24);leaf.rotation.z=Math.sin(i)*.25;}}
  for(const s of [-1,1])for(let i=0;i<16;i++)floret(doorX+s*1.15,3.02-i*.115,z,.068,i%4===0?2:0);
 }
 // Jasmine strands and tiny warm ceiling lights run down both sides of the room.
 for(const s of [-1,1])for(let i=0;i<12;i++){const z=-1.8-i*.46;const top=3.05;for(let j=0;j<6;j++)floret(doorX+s*1.16,top-j*.065,z,.031,2);sphere(.022,doorX+s*1.17,3.18,z,warm);}
 const colors=['#e98612','#f2b32a','#f7ebcb'];
 flowers.forEach((items,index)=>{const geo=new THREE.SphereGeometry(1,7,5),mesh=new THREE.InstancedMesh(geo,mat(colors[index]),items.length),matrix=new THREE.Matrix4();items.forEach(([x,y,z,r],i)=>{matrix.makeScale(r,r,r*.75);matrix.setPosition(x,y,z);mesh.setMatrixAt(i,matrix);});mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);});
 function diya(x,z){const bowl=new THREE.Mesh(new THREE.TorusGeometry(.12,.035,8,20),brass);bowl.rotation.x=Math.PI/2;bowl.position.set(x,.42,z);scene.add(bowl);const flame=sphere(.04,x,.51,z,warm);flame.scale.set(.6,1.8,.6);box(.20,.05,.20,x,.38,z,brass);}
 for(const s of [-1,1])for(const z of [-2.5,-4.4,-6.3])diya(doorX+s*1.03,z);
 for(const z of [-3.2,-6.1]){box(.015,.38,.015,doorX,3.12,z,brass);const lamp=sphere(.16,doorX,2.83,z,warm);lamp.scale.set(1,1.35,1);for(const y of [2.6,3.02])box(.30,.04,.30,doorX,y,z,brass);}

 // Wall lantern by the garage and house number centered over the porch.
 box(.12,.42,.1,.77,2.3,.14,doorMat);box(.16,.24,.16,.77,2.25,.27,warm);box(.23,.07,.23,.77,2.43,.27,doorMat);
 const plaqueCanvas=document.createElement('canvas');plaqueCanvas.width=256;plaqueCanvas.height=96;const ctx=plaqueCanvas.getContext('2d');ctx.fillStyle='#efefdf';ctx.fillRect(0,0,256,96);ctx.fillStyle='#273845';ctx.font='44px Georgia';ctx.textAlign='center';ctx.fillText('100',128,64);const tex=new THREE.CanvasTexture(plaqueCanvas);tex.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(.65,.24),new THREE.MeshBasicMaterial({map:tex}));sign.position.set(2.4,3.25,1.35);scene.add(sign);
 // Low foundation shrubs and an uncluttered lawn, as in the reference.
 for(let i=0;i<17;i++){const x=2.4+(i%5)*.51,z=2.1+Math.floor(i/5)*.39;if(x>4.4)continue;const shrub=sphere(.29,x,.25,z,foliage);shrub.scale.set(1,.8,1);}
 for(let i=0;i<9;i++)sphere(.27,-4.65+(i%2)*.3,.24,.2+Math.floor(i/2)*.55,foliage);
 let progress=0;const ease=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
 function render(p=progress){progress=p;const narrow=innerWidth<650;const a=ease(clamp(p/.53)),pass=ease(clamp((p-.68)/.32));camera.position.set(THREE.MathUtils.lerp(narrow?4.2:6.5,doorX,a),THREE.MathUtils.lerp(narrow?4.6:4.3,1.65,a),THREE.MathUtils.lerp(narrow?25:17,3.1,a)-pass*4.5);camera.lookAt(THREE.MathUtils.lerp(0,doorX,a),THREE.MathUtils.lerp(narrow?3.6:3.25,1.65,a),-3);hinge.rotation.y=ease(clamp((p-.46)/.34))*1.72;renderer.render(scene,camera);}
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);render();}window.addEventListener('resize',resize);resize();return{render,dispose(){renderer.dispose();window.removeEventListener('resize',resize);}};
}

