import * as THREE from './assets/three.module.js';
export function createEntrance(container) {
 const scene=new THREE.Scene();scene.background=new THREE.Color('#a89578');
 const camera=new THREE.PerspectiveCamera(46,1,.04,40);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;container.prepend(renderer.domElement);
 const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const white=mat('#efe1c2'),navy=mat('#273f42'),doorMat=mat('#193336',.55),panel=mat('#244348',.6),metal=mat('#bda05e',.28,.8),concrete=mat('#c7b999'),foliage=mat('#355337'),plaster=mat('#cdbb9b');
 const warm=new THREE.MeshStandardMaterial({color:'#ffe5a6',emissive:'#ffb658',emissiveIntensity:1.3});const geoBox=new THREE.BoxGeometry(1,1,1);
 function box(w,h,d,x,y,z,m,parent=scene){const o=new THREE.Mesh(geoBox,m);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function sphere(r,x,y,z,m,parent=scene){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 scene.add(new THREE.HemisphereLight('#fff2d6','#9e7a4f',2));const key=new THREE.DirectionalLight('#ffe9bb',2.1);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5});key.shadow.normalBias=.02;scene.add(key);
 const indoor=new THREE.PointLight('#ffd38c',20,9,2);indoor.position.set(1.55,2.6,-2);scene.add(indoor);
 // An intimate doorway fills the first view. No facade, garage, lawn or approach.
 box(12,8,.25,-5.14,3,-.48,plaster);box(12,8,.25,8.24,3,-.48,plaster);box(1.4,5,.25,1.55,5.25,-.48,plaster);
 box(16,.15,14,1.55,.1,1,mat('#bcaa8c'));
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


 // Brass sconces and restrained raised trim flank the opening.
 for(const x of [.55,2.55]){box(.09,.40,.09,x,1.98,-.04,metal);box(.17,.24,.13,x,2.01,.04,warm);for(const dx of [-.10,.10])box(.02,.30,.025,x+dx,2.01,.12,metal);box(.25,.055,.21,x,2.18,.04,metal);box(.22,.045,.2,x,1.84,.04,metal);const light=new THREE.PointLight('#ffca74',3,3,2);light.position.set(x,2.05,.3);scene.add(light);}
 for(const x of [.75,2.35])box(.025,2.82,.025,x,1.65,-.30,metal);
 let progress=0;const ease=t=>t*t*(3-2*t),clamp=t=>Math.max(0,Math.min(1,t));
 function render(p=progress){progress=p;const pass=ease(clamp((p-.43)/.57));const distance=Math.max(4.3,1.85/(2*Math.tan(THREE.MathUtils.degToRad(23))*camera.aspect));camera.position.set(doorX,THREE.MathUtils.lerp(1.65,1.65,pass),THREE.MathUtils.lerp(distance,-1.4,pass));camera.lookAt(doorX,THREE.MathUtils.lerp(1.18,1.65,pass),-3);hinge.rotation.y=ease(clamp(p/.66))*1.72;renderer.render(scene,camera);}
 function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);render();}window.addEventListener('resize',resize);resize();return{render,dispose(){renderer.dispose();window.removeEventListener('resize',resize);}};
}
