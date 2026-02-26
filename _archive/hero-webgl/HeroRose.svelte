<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    scrollProgress?: number;
  }

  let { scrollProgress = 0 }: Props = $props();

  let canvas: HTMLCanvasElement;
  let animationId: number = 0;
  let renderer: import('three').WebGLRenderer | null = null;

  // Slab surface Y — clip plane hides geometry below this
  const SLAB_Y = 0.55;
  // Rose position in world coords (mapped from crack UV 0.66, 0.52)
  const ROSE_X = 0.448;
  const ROSE_Z = 0.04;
  const ROSE_BASE_Y = 0.10;

  onMount(async () => {
    if (!browser) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const THREE = await import('three');

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera — match crack shader exactly ──
    // Crack shader: fwd*1.8 focal length → FOV ≈ 31°
    const fov = 2 * Math.atan(0.5 / 1.8) * (180 / Math.PI);
    const camera = new THREE.PerspectiveCamera(
      fov,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );

    // ── Renderer — transparent background ──
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;

    // Clipping is handled per-material via soft fade (stem) or hard clip (calyx/thorns)
    renderer.localClippingEnabled = true;
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SLAB_Y);

    // ── Lights — match crack shader's ldir ──
    // Crack: ldir = normalize(vec3(-0.4, 0.9, 0.5))
    const sun = new THREE.DirectionalLight(0xfff0dd, 3.5);
    sun.position.set(-4, 9, 5);
    const ambient = new THREE.AmbientLight(0xfff5ee, 0.10);
    const backLight = new THREE.DirectionalLight(0xffe0cc, 0.8);
    backLight.position.set(2, 3, -3);
    scene.add(sun, ambient, backLight);

    const isMobile = window.innerWidth < 768;

    // ── Shared time uniform ──
    const tU = { value: 0 };

    // ── Rose group ──
    const rose = new THREE.Group();
    rose.position.set(ROSE_X, ROSE_BASE_Y, ROSE_Z);
    rose.scale.setScalar(isMobile ? 0.35 : 0.55);
    scene.add(rose);

    // ── Stem ──
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.12, 0.75, 0.06),
      new THREE.Vector3(-0.06, 1.5, -0.06),
      new THREE.Vector3(0.1, 2.25, 0.04),
      new THREE.Vector3(0, 3, 0)
    ]);

    // Stem material — lit, with color gradient and normal variation
    const stemMat = new THREE.ShaderMaterial({
      uniforms: { clipY: { value: SLAB_Y } },
      vertexShader: `
        varying vec3 vWorldPos;
        varying vec3 vN;
        varying float vHeight;
        void main(){
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vN = normalize(normalMatrix * normal);
          vHeight = position.y;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float clipY;
        varying vec3 vWorldPos;
        varying vec3 vN;
        varying float vHeight;
        void main(){
          float fade = smoothstep(clipY, clipY + 0.08, vWorldPos.y);
          // Height-based color gradient: darker base → brighter tip
          float hNorm = clamp(vHeight / 3.0, 0.0, 1.0);
          vec3 baseC = vec3(0.07, 0.22, 0.05);
          vec3 tipC = vec3(0.13, 0.32, 0.09);
          vec3 c = mix(baseC, tipC, hNorm);
          // Directional light (match sun)
          vec3 N = normalize(vN);
          vec3 L = normalize(vec3(-4.0, 9.0, 5.0));
          float diff = max(dot(N, L), 0.0);
          c *= 0.20 + 0.80 * diff;
          // Subtle rim for cylindrical volume
          vec3 V = normalize(cameraPosition - vWorldPos);
          float rim = 1.0 - max(dot(N, V), 0.0);
          rim = pow(rim, 3.0);
          c += vec3(0.02, 0.06, 0.01) * rim * 0.5;
          gl_FragColor = vec4(c, fade);
        }`,
      transparent: true,
      side: THREE.DoubleSide
    });

    const stemGeo = new THREE.TubeGeometry(stemCurve, 64, 0.035, 8, false);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.geometry.setDrawRange(0, 0);
    const stemIdxCount = stemGeo.index!.count;
    rose.add(stem);

    // ── Leaf geometry + material ──
    function leafShape() {
      const s = new THREE.Shape();
      s.moveTo(0, 0);
      s.quadraticCurveTo(0.16, 0.22, 0.05, 0.5);
      s.quadraticCurveTo(0, 0.55, -0.05, 0.5);
      s.quadraticCurveTo(-0.16, 0.22, 0, 0);
      return s;
    }

    const leafMat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vWP;
        void main(){
          vUv=uv;
          vN=normalize(normalMatrix*normal);
          vec4 wp=modelMatrix*vec4(position,1.);
          vWP=wp.xyz;
          gl_Position=projectionMatrix*viewMatrix*wp;
        }`,
      fragmentShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vWP;
        void main(){
          vec3 N=normalize(vN);
          // Flip normal for backface so lighting works from both sides
          if(!gl_FrontFacing) N=-N;
          vec3 base=vec3(.08,.25,.06);
          float cv=exp(-pow((vUv.x-.5)/.012,2.));
          float sv=0.;
          for(float i=1.;i<5.;i++){
            float y=i*.18+.1,dx=(vUv.y-y)*.55;
            float mask=smoothstep(y-.02,y,vUv.y)*smoothstep(y+.12,y+.02,vUv.y);
            sv+=exp(-pow((vUv.x-.5-dx)/.008,2.))*mask;
            sv+=exp(-pow((vUv.x-.5+dx)/.008,2.))*mask;
          }
          vec3 c=base+vec3(.015,.05,.01)*(cv+sv*.4);
          vec3 L=normalize(vec3(-4,9,5));
          float diff=max(dot(N,L),0.);
          c*=.15+.85*diff;
          // Subsurface scattering — light passes through thin leaf
          vec3 V=normalize(cameraPosition-vWP);
          vec3 backL=normalize(vec3(2,3,-3));
          float sss=pow(max(dot(V,normalize(-N+backL*.4)),0.),3.);
          float edgeThin=1.-smoothstep(0.,.12,vUv.x)*smoothstep(1.,.88,vUv.x);
          c+=vec3(.06,.18,.04)*sss*(edgeThin*.5+.5)*.35;
          // Backface gets a warmer, brighter tint (sunlight through leaf)
          if(!gl_FrontFacing){
            c=mix(c,c*vec3(1.1,1.15,0.95),.4);
            c*=.88;
          }
          gl_FragColor=vec4(c,1.);
        }`
    });

    function mkLeaf(t: number, yAng: number, zLean: number) {
      const geo = new THREE.ShapeGeometry(leafShape(), 10);
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        (p as InstanceType<typeof THREE.BufferAttribute>).setZ(i, Math.sin(p.getY(i) * 8) * 0.018);
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, leafMat);
      m.position.copy(stemCurve.getPointAt(t));
      m.rotation.set(0, yAng, zLean);
      m.scale.set(0, 0, 0);
      rose.add(m);
      return m;
    }

    const leaves = [
      mkLeaf(0.25, 0.3, 0.5),
      mkLeaf(0.45, Math.PI + 0.5, -0.65),
      mkLeaf(0.65, 1.2, 0.85)
    ];

    // ── Petal shaders ──
    const PV = `
      varying vec2 vUv; varying vec3 vN; varying vec3 vWorldPos;
      void main(){
        vUv=uv; vN=normalize(normalMatrix*normal);
        vec4 wp=modelMatrix*vec4(position,1.);
        vWorldPos=wp.xyz;
        gl_Position=projectionMatrix*viewMatrix*wp;
      }`;

    const PF = `
      uniform float time, seed, darkness, hueShift;
      varying vec2 vUv; varying vec3 vN; varying vec3 vWorldPos;
      float H(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float N(vec2 p){
        vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(H(i),H(i+vec2(1,0)),f.x),mix(H(i+vec2(0,1)),H(i+vec2(1,1)),f.x),f.y);
      }
      float fbm(vec2 p){
        float v=0.,a=.5; mat2 r=mat2(.8,.6,-.6,.8);
        for(int i=0;i<5;i++){v+=a*N(p);p=r*p*2.;a*=.5;} return v;
      }
      void main(){
        vec2 uv=vUv*3.+seed;
        vec2 q=vec2(fbm(uv+time*.05),fbm(uv+vec2(5.2,1.3)));
        float f=fbm(uv+q*4.);
        vec3 c=mix(vec3(.65,.02,.04),vec3(.30,.01,.02),f);
        c=mix(c,vec3(.45,.02,.03),length(q)*.5);
        c=mix(c,vec3(.12,.005,.01),length(q)*.35);
        float hs=hueShift*.12;
        c.r+=hs*.04; c.b+=hs*.015;
        vec2 cellUV=vUv*vec2(18.,25.)+seed;
        float nx=N(cellUV+vec2(.5,0.))-N(cellUV-vec2(.5,0.));
        float ny=N(cellUV+vec2(0.,.5))-N(cellUV-vec2(0.,.5));
        vec2 cellUV2=vUv*vec2(45.,60.)+seed*1.3;
        nx+=.4*(N(cellUV2+vec2(.5,0.))-N(cellUV2-vec2(.5,0.)));
        ny+=.4*(N(cellUV2+vec2(0.,.5))-N(cellUV2-vec2(0.,.5)));
        vec3 nPerturbed=normalize(vN+vec3(nx,ny,0.)*.08);
        float grad=smoothstep(0.,.25,vUv.x)*smoothstep(1.,.55,vUv.x);
        float edgeAO=smoothstep(0.,.08,vUv.y)*smoothstep(1.,.92,vUv.y);
        c*=(.58+.42*grad)*(.85+.15*edgeAO);
        vec3 lDir=normalize(vec3(-4,9,5));
        float diff=max(dot(nPerturbed,lDir),0.);
        c*=.15+.85*diff;
        vec3 vDir=normalize(cameraPosition-vWorldPos);
        float rim=1.-max(dot(nPerturbed,vDir),0.);
        rim=pow(rim,4.0);
        c+=vec3(.55,.04,.03)*rim*.35;
        vec3 bDir=normalize(vec3(2,3,-3));
        vec3 scatterDir=normalize(bDir+nPerturbed*.4);
        float sss=pow(max(dot(vDir,scatterDir),0.),4.);
        float edgeThin=1.-smoothstep(0.,.15,vUv.y)*smoothstep(1.,.85,vUv.y);
        float tipThin=smoothstep(.6,1.,vUv.x);
        float thinness=max(edgeThin,tipThin)*.6+.4;
        c+=vec3(.65,.04,.02)*sss*thinness*.28;
        float trans=max(dot(-nPerturbed,bDir),0.);
        trans=pow(trans,3.0);
        c+=vec3(.55,.05,.03)*trans*.18;
        float vt=vUv.y*2.-1.;
        float vu=vUv.x;
        float veinMask=smoothstep(0.,.12,vu)*smoothstep(.85,.5,vu);
        float vein=0.;
        for(float i=0.;i<5.;i++){
          float off=(i-2.)/5.*vu*.7;
          vein+=exp(-pow((vt-off)/.018,2.));
        }
        c+=vec3(.06,.008,.005)*vein*veinMask;
        vec3 T=normalize(cross(nPerturbed,vec3(0.,0.,1.)));
        vec3 B=cross(nPerturbed,T);
        vec3 Hl=normalize(lDir+vDir);
        float TdH=dot(T,Hl), BdH=dot(B,Hl), NdH=dot(nPerturbed,Hl);
        float alphaT=.25, alphaB=.06;
        float anisoD=exp(-2.*(TdH*TdH/(alphaT*alphaT)+BdH*BdH/(alphaB*alphaB))/(1.+NdH));
        c+=vec3(.18,.02,.015)*anisoD*max(dot(nPerturbed,lDir),0.)*.35;
        vec3 R=reflect(-vDir,nPerturbed);
        float envSpec=pow(max(R.y,0.),16.);
        c+=vec3(.10,.012,.008)*envSpec*.5;
        vec3 dNx=dFdx(nPerturbed), dNy=dFdy(nPerturbed);
        float edgeCurvature=length(dNx)+length(dNy);
        float edgeCatch=smoothstep(.8,2.5,edgeCurvature)*max(dot(nPerturbed,lDir),0.);
        c+=vec3(.25,.025,.02)*edgeCatch*.4;
        c*=.50+.50*darkness;
        c*=gl_FrontFacing?1.:.78;
        gl_FragColor=vec4(c,1.);
      }`;

    // ── Petal geometry factory ──
    function petalGeo(
      h: number, r: number, arcAngle: number, tipCurl: number,
      lean: number, seg = 20, ruffleAmt = 0
    ) {
      const v: number[] = [], uv: number[] = [], ix: number[] = [];
      const stride = seg + 1;

      for (let i = 0; i <= seg; i++) {
        const u = i / seg;
        const pinch = Math.pow(Math.min(u * 3.5, 1), 2);
        const profile = pinch * Math.sin(u * Math.PI * 0.85 + 0.12) * (1 - u * 0.12);
        const arc = arcAngle * profile;
        const cr = r * (1 - u * 0.12);
        const curl = tipCurl * u * u * u;
        const rBase = u > 0.45 ? (u - 0.45) * (0.025 + ruffleAmt) : 0;

        for (let j = 0; j <= seg; j++) {
          const t = j / seg;
          const theta = (t - 0.5) * arc;
          let x = cr * Math.sin(theta);
          let y = cr * Math.cos(theta) - cr;
          let z = u * h - curl;
          const edge = Math.abs(t - 0.5) * 2;
          const wave = Math.sin(t * Math.PI * 5) * 0.6 + Math.sin(t * Math.PI * 11 + 0.7) * 0.4;
          y += rBase * wave * edge;

          const lu = Math.max(0, Math.min(1, (u - 0.40) / 0.50));
          const leanAngle = lean * lu * lu * (3 - 2 * lu);
          const cosL = Math.cos(leanAngle);
          const sinL = Math.sin(leanAngle);
          const y2 = y * cosL - z * sinL;
          const z2 = y * sinL + z * cosL;

          v.push(x, y2, z2);
          uv.push(u, t);
        }
      }

      for (let i = 0; i < seg; i++) {
        for (let j = 0; j < seg; j++) {
          const a = i * stride + j, b = a + stride;
          ix.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }

      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(ix);
      g.computeVertexNormals();
      return g;
    }

    // ── Petal creation ──
    const GOLDEN_ANGLE = 2.3999632;
    const PETAL_COUNT = 18;

    function mkPetal(
      h: number, r: number, arc: number, curl: number, lean: number,
      yR: number, radialOff: number, sd: number, dk: number, yOff: number,
      ruffleAmt = 0, hueShift = 0, seg = 20
    ) {
      const mesh = new THREE.Mesh(
        petalGeo(h, r, arc, curl, lean, seg, ruffleAmt),
        new THREE.ShaderMaterial({
          uniforms: {
            time: tU,
            seed: { value: sd },
            darkness: { value: dk },
            hueShift: { value: hueShift }
          },
          vertexShader: PV,
          fragmentShader: PF,
          side: THREE.DoubleSide
        })
      );
      mesh.scale.set(0, 0, 0);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.z = radialOff;
      const wrapper = new THREE.Group();
      wrapper.position.y = 3 + yOff;
      wrapper.rotation.y = yR;
      wrapper.add(mesh);
      rose.add(wrapper);
      return mesh;
    }

    // 18 petals in Vogel spiral
    const petals = Array.from({ length: PETAL_COUNT }, (_, n) => {
      const t = n / (PETAL_COUNT - 1);
      const tSmooth = t * t * (3 - 2 * t);
      const tEaseOut = 1 - (1 - t) * (1 - t);
      const rotY = n * GOLDEN_ANGLE;
      const radialOff = 0.04 * Math.sqrt(n);
      const yOff = 0.18 * Math.pow(1 - t, 1.4);
      const innerBlend = Math.max(0, 1 - n / 5);
      const innerS = innerBlend * innerBlend * (3 - 2 * innerBlend);
      const h = 0.30 + 0.28 * tEaseOut + 0.18 * innerS;
      const outerBlend = Math.max(0, (n - 12) / 5);
      const r = 0.14 + 0.28 * tEaseOut - 0.03 * innerS + 0.08 * outerBlend;
      const arc = Math.PI * (1.40 - 0.50 * tSmooth + 0.25 * innerS);
      const curl = 0.001 + 0.05 * t * t + 0.10 * outerBlend * outerBlend;
      const lean = 0.04 + 0.52 * tSmooth - 0.04 * innerS;
      const dk = 0.30 + 0.70 * t;
      const ruffleAmt = 0.02 + 0.06 * outerBlend;
      const hueShift = Math.sin(n * 2.7 + 0.3);
      const seg = n < 5 ? 20 : n < 12 ? 24 : 28;
      return mkPetal(h, r, arc, curl, lean, rotY, radialOff, n * 1.7 + n * n * 0.3, dk, yOff, ruffleAmt, hueShift, seg);
    });

    // ── Center bud ──
    const budMesh = new THREE.Mesh(
      petalGeo(0.25, 0.07, Math.PI * 1.9, 0.0, 0.0, 12),
      new THREE.ShaderMaterial({
        uniforms: { time: tU, seed: { value: 99.0 }, darkness: { value: 0.20 }, hueShift: { value: 0.0 } },
        vertexShader: PV, fragmentShader: PF, side: THREE.DoubleSide
      })
    );
    budMesh.rotation.x = Math.PI / 2;
    budMesh.scale.set(0, 0, 0);
    const budWrap = new THREE.Group();
    budWrap.position.y = 3 + 0.22;
    budWrap.rotation.y = -0.5;
    budWrap.add(budMesh);
    rose.add(budWrap);

    // ── Calyx — 5 green sepals (hidden initially, grow with scroll) ──
    const sepalGeo = petalGeo(0.50, 0.08, Math.PI * 0.35, 0.04, 0.15, 10);
    const sepals: import('three').Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const sepal = new THREE.Mesh(sepalGeo, new THREE.MeshStandardMaterial({
        color: 0x1a4a12, side: THREE.DoubleSide, roughness: 0.6,
        clippingPlanes: [clipPlane]
      }));
      sepal.rotation.x = Math.PI / 2;
      sepal.scale.set(0, 0, 0);
      const sw = new THREE.Group();
      sw.position.y = 2.92;
      sw.rotation.y = i * Math.PI * 2 / 5 + 0.3;
      sw.add(sepal);
      rose.add(sw);
      sepals.push(sepal);
    }

    // ── Thorns ──
    const thornGeo = new THREE.ConeGeometry(0.015, 0.08, 5);
    thornGeo.translate(0, 0.04, 0);
    const thornMat = new THREE.MeshStandardMaterial({ color: 0x2a3a15, roughness: 0.4, clippingPlanes: [clipPlane] });
    const thorns = Array.from({ length: 8 }, (_, i) => {
      const t = 0.10 + i * 0.085;
      const pt = stemCurve.getPointAt(t);
      const ang = i * GOLDEN_ANGLE;
      const mesh = new THREE.Mesh(thornGeo, thornMat);
      mesh.rotation.x = Math.PI / 2 + 0.4;
      mesh.position.z = 0.035;
      mesh.scale.setScalar(0);
      const tw = new THREE.Group();
      tw.position.copy(pt);
      tw.rotation.y = ang;
      tw.add(mesh);
      rose.add(tw);
      return { mesh, t };
    });

    // ── Dew drops ──
    const dewGeo = new THREE.SphereGeometry(0.014, 10, 8);
    const dewMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      vertexShader: `
        varying vec3 vN; varying vec3 vWP;
        void main(){
          vN=normalize(normalMatrix*normal);
          vec4 wp=modelMatrix*vec4(position,1.);
          vWP=wp.xyz;
          gl_Position=projectionMatrix*viewMatrix*wp;
        }`,
      fragmentShader: `
        varying vec3 vN; varying vec3 vWP;
        void main(){
          vec3 N=normalize(vN);
          vec3 V=normalize(cameraPosition-vWP);
          vec3 L=normalize(vec3(-4,9,5));
          vec3 H=normalize(L+V);
          float spec=pow(max(dot(N,H),0.),180.);
          float fres=pow(1.-max(dot(N,V),0.),4.);
          vec3 c=vec3(1.,.98,.95)*spec*2.5+vec3(.8,.85,1.)*fres*.25;
          float a=spec*.9+fres*.12+.04;
          gl_FragColor=vec4(c,a);
        }`
    });

    function sRand(seed: number) {
      let s = (Math.abs(seed) * 16807 + 1) % 2147483647;
      return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    }

    petals.forEach((mesh, n) => {
      const rng = sRand(n * 137 + 42);
      const dropCount = n < 5 ? 2 : n < 12 ? 4 : 5;
      const pos = mesh.geometry.attributes.position;
      const nrm = mesh.geometry.attributes.normal;
      const uvs = mesh.geometry.attributes.uv;
      const cands: number[] = [];
      for (let i = 0; i < uvs.count; i++) {
        const u = uvs.getX(i), t = uvs.getY(i);
        if (u > 0.2 && u < 0.65 && t > 0.25 && t < 0.75) cands.push(i);
      }
      for (let d = 0; d < dropCount && cands.length > 0; d++) {
        const idx = cands[Math.floor(rng() * cands.length)];
        const drop = new THREE.Mesh(dewGeo, dewMat);
        drop.position.set(
          pos.getX(idx) + nrm.getX(idx) * 0.006,
          pos.getY(idx) + nrm.getY(idx) * 0.006,
          pos.getZ(idx) + nrm.getZ(idx) * 0.006
        );
        drop.scale.setScalar(0.6 + rng() * 0.9);
        mesh.add(drop);
      }
    });

    // ── Mouse tracking — identical to crack shader ──
    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;
    const handleMouse = (e: MouseEvent) => {
      mx = e.clientX / innerWidth;
      my = e.clientY / innerHeight;
    };
    document.addEventListener('mousemove', handleMouse);

    // ── Camera: overview position (matches crack shader) ──
    function getOverviewCamera(smxV: number, smyV: number) {
      const D = 3.8;
      const aY = (smxV - 0.5) * 0.22;
      const aX = 0.52 + (smyV - 0.5) * 0.15;
      return {
        x: Math.sin(aY) * Math.cos(aX) * D,
        y: Math.sin(aX) * D,
        z: Math.cos(aY) * Math.cos(aX) * D,
        tx: 0, ty: 0, tz: 0
      };
    }

    // ── Camera journey — tracks rose growth ──
    const roseWorldY = (localY: number) => ROSE_BASE_Y + localY * 0.50;
    const roseWorldX = (localX: number) => ROSE_X + localX * 0.50;
    const roseWorldZ = (localZ: number) => ROSE_Z + localZ * 0.50;

    // Camera follows the growth: crack surface → up stem → above bloom
    // With ROSE_BASE_Y=0.10, scale=0.55: stem base=0.10, clip=0.55, head≈1.75
    const journeyPositions = new THREE.CatmullRomCurve3([
      // 0.00: Wide overview matching crack shader
      new THREE.Vector3(0, 1.89, 3.30),
      // 0.12: Push toward crack impact, stem just piercing slab
      new THREE.Vector3(0.4, 1.0, 2.2),
      // 0.25: Close to slab, watching stem grow upward
      new THREE.Vector3(roseWorldX(0.2), 0.75, roseWorldZ(0) + 1.3),
      // 0.40: Rising alongside stem
      new THREE.Vector3(roseWorldX(-0.1), roseWorldY(1.2), roseWorldZ(0.06) + 0.85),
      // 0.55: Mid-stem, leaves unfurling
      new THREE.Vector3(roseWorldX(-0.15), roseWorldY(2.0), roseWorldZ(0.1) + 0.6),
      // 0.70: Approaching bloom from side, rising above
      new THREE.Vector3(roseWorldX(-0.25), roseWorldY(3.3), roseWorldZ(0.12) + 0.42),
      // 0.85: Above and to side — classic 3/4 overhead view of petal spiral
      new THREE.Vector3(roseWorldX(-0.15), roseWorldY(3.8), roseWorldZ(0.06) + 0.28),
      // 1.00: Intimate overhead, looking down into the spiral heart
      new THREE.Vector3(roseWorldX(-0.04), roseWorldY(3.65), roseWorldZ(0.02) + 0.14),
    ]);

    // Camera look-at targets track the growth tip, then settle on bloom center
    const journeyTargets = new THREE.CatmullRomCurve3([
      // 0.00: Whole scene overview
      new THREE.Vector3(0, 0, 0),
      // 0.12: Crack impact / slab surface
      new THREE.Vector3(ROSE_X, 0.55, ROSE_Z),
      // 0.25: Stem just above slab
      new THREE.Vector3(ROSE_X, roseWorldY(0.8), ROSE_Z),
      // 0.40: Mid-stem growth tip
      new THREE.Vector3(ROSE_X, roseWorldY(1.5), ROSE_Z),
      // 0.55: Upper stem
      new THREE.Vector3(ROSE_X, roseWorldY(2.2), ROSE_Z),
      // 0.70: Bloom area — look at center of bloom
      new THREE.Vector3(ROSE_X, roseWorldY(3.0), ROSE_Z),
      // 0.85: Bloom center (looking down into spiral)
      new THREE.Vector3(ROSE_X, roseWorldY(3.0), ROSE_Z),
      // 1.00: Spiral center
      new THREE.Vector3(ROSE_X, roseWorldY(2.95), ROSE_Z),
    ]);

    function getJourneyFOV(t: number) {
      return fov + t * t * 19; // 31° → ~50°
    }

    function updateCamera() {
      const sp = scrollProgress;

      if (sp <= 0.001) {
        const ov = getOverviewCamera(smx, smy);
        camera.position.set(ov.x, ov.y, ov.z);
        camera.lookAt(ov.tx, ov.ty, ov.tz);
        camera.fov = fov;
        camera.updateProjectionMatrix();
      } else {
        const t = Math.max(0, Math.min(1, sp));
        const pos = journeyPositions.getPointAt(t);
        const target = journeyTargets.getPointAt(t);

        // Blend mouse parallax out (gone by 30%)
        const mouseBlend = 1 - Math.min(1, t / 0.3);
        if (mouseBlend > 0) {
          const ov = getOverviewCamera(smx, smy);
          const restOv = getOverviewCamera(0.5, 0.5);
          pos.x += (ov.x - restOv.x) * mouseBlend;
          pos.y += (ov.y - restOv.y) * mouseBlend;
          pos.z += (ov.z - restOv.z) * mouseBlend;
        }

        camera.position.copy(pos);
        camera.lookAt(target);
        camera.fov = getJourneyFOV(t);
        camera.updateProjectionMatrix();
      }
    }

    // ── Scroll-driven growth helpers ──
    // Maps scrollProgress ranges to 0→1 growth values
    function growthAt(sp: number, start: number, end: number) {
      return Math.max(0, Math.min(1, (sp - start) / (end - start)));
    }

    // ── Resize ──
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = isMobile ? Math.min(devicePixelRatio, 1.5) : Math.min(devicePixelRatio, 2);
      renderer!.setPixelRatio(dpr);
      renderer!.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    // ── Animation helpers ──
    const easeOutCubic = (t: number) => {
      const c = Math.max(0, Math.min(1, t));
      return 1 - (1 - c) * (1 - c) * (1 - c);
    };

    const t0 = performance.now();

    // ── Reduced motion: render one static frame at full bloom ──
    if (prefersReducedMotion) {
      tU.value = 10;
      stem.geometry.setDrawRange(0, stemIdxCount);
      thorns.forEach(th => th.mesh.scale.setScalar(1));
      leaves.forEach(l => l.scale.setScalar(1));
      sepals.forEach(s => s.scale.setScalar(1));
      budMesh.scale.setScalar(1);
      petals.forEach(m => m.scale.setScalar(1));
      updateCamera();
      renderer!.render(scene, camera);
      document.removeEventListener('mousemove', handleMouse);
      return;
    }

    // ── Intersection Observer — pause when off-screen ──
    let visible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !animationId) {
          animationId = requestAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // ── Scroll-driven growth + render loop ──
    const frame = (now: number) => {
      if (!visible) {
        animationId = 0;
        return;
      }

      const elapsed = (now - t0) / 1000;
      tU.value = elapsed;

      // Smooth mouse
      smx += (mx - smx) * 0.04;
      smy += (my - smy) * 0.04;
      updateCamera();

      const sp = scrollProgress;

      // ── Growth driven by scroll progress ──
      // Stem: emerges from crack between 5-40% scroll
      const stemP = easeOutCubic(growthAt(sp, 0.05, 0.40));
      stem.geometry.setDrawRange(0, Math.floor(stemP * stemIdxCount));

      // Thorns appear as stem grows past their position
      thorns.forEach(th => {
        const tp = Math.max(0, Math.min(1, (stemP - th.t) * 10));
        th.mesh.scale.setScalar(tp);
      });

      // Leaves: staggered unfurl between 30-55% scroll
      leaves.forEach((l, i) => {
        const leafStart = 0.30 + i * 0.06;
        const leafEnd = leafStart + 0.18;
        const p = easeOutCubic(growthAt(sp, leafStart, leafEnd));
        l.scale.setScalar(p);
        l.rotation.x = (1 - p) * 0.7;
        // Gentle sway once grown
        if (p > 0.9) {
          const ph = i * 1.9 + 0.5;
          l.rotation.z += Math.sin(elapsed * 0.6 + ph) * 0.015;
          l.rotation.x += Math.cos(elapsed * 0.4 + ph * 0.7) * 0.008;
        }
      });

      // Calyx sepals: appear between 42-55% scroll
      sepals.forEach((sepal, i) => {
        const sepalP = easeOutCubic(growthAt(sp, 0.42 + i * 0.02, 0.52 + i * 0.02));
        sepal.scale.setScalar(sepalP);
      });

      // Bud: forms between 45-60% scroll
      const budP = easeOutCubic(growthAt(sp, 0.45, 0.60));
      budMesh.scale.setScalar(budP);

      // Petals: staggered bloom between 50-85% scroll
      petals.forEach((m, n) => {
        const petalStart = 0.50 + n * 0.018;
        const petalEnd = petalStart + 0.15;
        const p = easeOutCubic(growthAt(sp, petalStart, petalEnd));
        m.scale.setScalar(p);
        m.rotation.x = Math.PI / 2 + (1 - p) * 0.15;
        // Idle breeze once open
        if (p > 0.9) {
          const ph = n * 0.73;
          m.rotation.z = Math.sin(elapsed * 0.5 + ph) * 0.006 * (0.4 + n / 17 * 0.6);
          m.rotation.y = Math.cos(elapsed * 0.35 + ph * 1.3) * 0.004;
        }
      });

      // Whole-group idle sway once fully bloomed
      if (sp > 0.85) {
        rose.rotation.z = Math.sin(elapsed * 0.4) * 0.012;
        rose.rotation.x = Math.cos(elapsed * 0.3) * 0.008;
      } else {
        rose.rotation.z = 0;
        rose.rotation.x = 0;
      }

      renderer!.render(scene, camera);
      animationId = requestAnimationFrame(frame);
    };

    animationId = requestAnimationFrame(frame);

    // Cleanup returned from onMount is not used in Svelte 5
    // Cleanup is handled by onDestroy below
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="hero-rose"
  aria-hidden="true"
></canvas>

<style>
  .hero-rose {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
