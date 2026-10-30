import * as THREE from './assets/three.module.js';
// The photographic carving is the front texture of a solid hinged timber slab.
export function createEntrance(container) {
 const scene=new THREE.Scene();
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0,0);
 const canvas=renderer.domElement;canvas.className='solid-door-canvas';container.prepend(canvas);
 const backdrop=document.createElement('div');backdrop.className='door-backdrop';container.prepend(backdrop);
 const camera=new THREE.PerspectiveCamera(68,1,.025,30),resources=[];
 scene.add(new THREE.HemisphereLight('#fff0d5','#795336',2.0));
 const key=new THREE.DirectionalLight('#ffe1ab',2.5);key.position.set(-2,3,5);scene.add(key);
 const light=new THREE.SpotLight('#ffd69b',38,15,.7,.7,1.7);light.position.set(.8,2.7,2.8);light.target.position.set(0,-1.5,-2);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.bias=-.00015;light.shadow.normalBias=.015;scene.add(light,light.target);
 const fill=new THREE.PointLight('#ffc57f',3.5,10,2);fill.position.set(0,1.1,-2.5);scene.add(fill);
 const reliefSurfaces=[];
 let textureReady=false;
 const base=new THREE.TextureLoader().load('assets/carved-door.png',()=>{buildRelief(base.image);textureReady=true;resources.filter(r=>r.isTexture).forEach(t=>t.needsUpdate=true);render();});base.colorSpace=THREE.SRGBColorSpace;base.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());resources.push(base);
 function crop(x,y,w,h){const t=base.clone();t.repeat.set(w,h);t.offset.set(x,1-y-h);t.needsUpdate=true;resources.push(t);return t;}
 function basic(map){const m=new THREE.MeshBasicMaterial({map});resources.push(m);return m;}
 const grain=crop(.490,.18,.008,.65),edge=new THREE.MeshStandardMaterial({map:grain,color:'#a7794d',roughness:.64}),back=new THREE.MeshStandardMaterial({map:grain,color:'#85572e',roughness:.7}),brass=new THREE.MeshStandardMaterial({color:'#bb9347',metalness:.75,roughness:.36});resources.push(edge,back,brass);
 function box(w,h,d,x,y,z,m,parent=scene){const geo=new THREE.BoxGeometry(w,h,d);resources.push(geo);const mesh=new THREE.Mesh(geo,m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 const W=2.8,H=4.2,x0=.125,y0=.1172,x1=.875,y1=.8841;
 const leafW=W*.375,leafH=H*(y1-y0),doorY=H*(.5-(y0+y1)/2),thickness=.16;
 // Four fixed strips preserve the original frame and floral decorations around a real opening.
 function strip(x,y,w,h){const geo=new THREE.PlaneGeometry(w*W,h*H);resources.push(geo);const plane=new THREE.Mesh(geo,basic(crop(x,y,w,h)));plane.position.set((x+w/2-.5)*W,(.5-y-h/2)*H,.005);scene.add(plane);}
 strip(0,0,x0,1);strip(x1,0,1-x1,1);strip(x0,0,x1-x0,y0);strip(x0,y1,x1-x0,1-y1);
 // The frame has depth behind its photographic face, including a recessed threshold.
 for(const s of [-1,1])box(.065,leafH+.04,.27,s*(leafW+.033),doorY,-.15,edge);
 box(leafW*2+.13,.065,.27,0,doorY+leafH/2+.033,-.15,edge);
 const hinges=[];
 for(const s of [-1,1]){
  const pivot=new THREE.Group();pivot.position.set(s*leafW,doorY,-thickness/2);scene.add(pivot);hinges.push(pivot);
  const front=basic(crop(s===-1?x0:.5,y0,.375,y1-y0));
  // BoxGeometry: right, left, top, bottom, front, back. Every face is present.
  const slab=box(leafW,leafH,thickness,-s*leafW/2,0,0,[edge,edge,edge,edge,front,back],pivot);
  // Subdivided timber relief gives the floral face depth and changing surface normals.
  const reliefMap=crop(s===-1?x0:.5,y0,.375,y1-y0);
  const reliefMaterial=new THREE.MeshStandardMaterial({map:reliefMap,color:'#736254',emissiveMap:reliefMap,emissive:'#ffffff',emissiveIntensity:.66,roughness:.8,metalness:.025});
  const reliefGeometry=new THREE.PlaneGeometry(leafW,leafH,112,320);resources.push(reliefGeometry,reliefMaterial);
  const reliefMesh=new THREE.Mesh(reliefGeometry,reliefMaterial);reliefMesh.position.set(-s*leafW/2,0,thickness/2+.001);reliefMesh.castShadow=true;reliefMesh.receiveShadow=true;pivot.add(reliefMesh);reliefSurfaces.push({geo:reliefGeometry,start:s===-1?x0:.5});
  // The ring knocker projects beyond the carving and changes silhouette as the leaf turns.
  const ringGeo=new THREE.TorusGeometry(.126,.017,12,48);resources.push(ringGeo);const ring=new THREE.Mesh(ringGeo,brass);ring.position.set(-s*.4872,.0294-doorY,thickness/2+.055);ring.castShadow=true;ring.receiveShadow=true;pivot.add(ring);
  const bossGeo=new THREE.SphereGeometry(.038,16,12);resources.push(bossGeo);const boss=new THREE.Mesh(bossGeo,brass);boss.position.set(-s*.4872,.17-doorY,thickness/2+.04);boss.castShadow=true;pivot.add(boss);
  // A brass latch on the free edge and hinge barrels make the edge legible in motion.
  box(.009,.22,.070,-s*leafW,0,0,brass,pivot);
  for(const y of [-leafH*.35,0,leafH*.35]){const geo=new THREE.CylinderGeometry(.016,.016,.16,12);resources.push(geo);const pin=new THREE.Mesh(geo,brass);pin.position.set(0,y,0);pivot.add(pin);}
  // Recessed rear panels remain visible when a leaf rotates past ninety degrees.
  for(const y of [-leafH*.27,leafH*.23]){box(leafW*.78,leafH*.36,.012,-s*leafW/2,y,-thickness/2-.007,back,pivot);}
 }
 function buildRelief(image){
  const sampler=document.createElement('canvas');sampler.width=512;sampler.height=768;const ctx=sampler.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,512,768);const pixels=ctx.getImageData(0,0,512,768).data;
  const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
  function panelMask(x,y){let mask=0;for(const [l,r,t,b] of [[.16,.436,.128,.506],[.563,.84,.128,.506],[.16,.436,.55,.803],[.563,.84,.55,.803]])mask=Math.max(mask,smooth(l,l+.008,x)*(1-smooth(r-.008,r,x))*smooth(t,t+.008,y)*(1-smooth(b-.008,b,y)));return mask;}
  for(const {geo,start} of reliefSurfaces){const pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++){const x=start+uv.getX(i)*.375,y=y0+(1-uv.getY(i))*(y1-y0),px=Math.min(511,Math.max(0,Math.round(x*511))),py=Math.min(767,Math.max(0,Math.round(y*767))),idx=(py*512+px)*4,luma=(pixels[idx]*.2126+pixels[idx+1]*.7152+pixels[idx+2]*.0722)/255;const raised=panelMask(x,y)*smooth(.10,.60,luma)*.042;pos.setZ(i,raised);}pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();}
 }
 // The opening is transparent: the invitation sits immediately behind the doors.
 let progress=0,initialZ=6,focusY=0;
 const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>t*t*(3-2*t);
 function render(p=progress){progress=p;const zoom=ease(clamp(p/.22)),swing=ease(clamp((p-.12)/.88)),enter=0;
  const nearZ=initialZ*.84;camera.position.set(.11*Math.sin(swing*Math.PI)*(1-enter),THREE.MathUtils.lerp(0,doorY,enter),THREE.MathUtils.lerp(initialZ,nearZ,zoom)*(1-enter)-.38*enter);camera.lookAt(0,THREE.MathUtils.lerp(focusY,doorY,enter),-3);
  hinges[0].rotation.y=swing*Math.PI*.60;hinges[1].rotation.y=-swing*Math.PI*.60;
  // Keep the letter behind the frame until the doorway dissolves away.
  camera.updateMatrixWorld();
  const topLeft=new THREE.Vector3(-leafW,doorY+leafH/2,-.18).project(camera),bottomRight=new THREE.Vector3(leafW,doorY-leafH/2,-.18).project(camera),unmask=ease(clamp((p-.85)/.15));
  container.style.setProperty('--opening-clip',`inset(${Math.max(0,(1-topLeft.y)*50)*(1-unmask)}% ${Math.max(0,(1-bottomRight.x)*50)*(1-unmask)}% ${Math.max(0,(1+bottomRight.y)*50)*(1-unmask)}% ${Math.max(0,(1+topLeft.x)*50)*(1-unmask)}%)`);
  document.getElementById('experience').style.setProperty('--opening-clip',container.style.getPropertyValue('--opening-clip'));
  canvas.style.opacity=String(1-ease(clamp((p-.85)/.15)));backdrop.style.opacity=p>0?'0':'.8';if(textureReady)renderer.render(scene,camera);
 }
 function resize(){const artWidth=Math.min(innerHeight*2/3,innerWidth/.78),artHeight=artWidth*1.5,visibleHeight=H*innerHeight/artHeight;initialZ=visibleHeight/(2*Math.tan(THREE.MathUtils.degToRad(34)));focusY=-(innerWidth<600?.05:.03)*visibleHeight;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);render();}
 window.addEventListener('resize',resize);resize();return{render,dispose(){window.removeEventListener('resize',resize);resources.forEach(r=>r.dispose());renderer.dispose();canvas.remove();backdrop.remove();}};
}


