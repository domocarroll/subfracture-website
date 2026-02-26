<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let animationId: number;
  let gl: WebGLRenderingContext | null = null;

  const VS = `attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}`;

  const FS = `precision highp float;
uniform float T;
uniform vec2 S,M;
uniform float Sd;

float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
}
float fb(vec2 p){
  float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.;a*=.5;}return v;
}

vec3 parch(vec2 wc,float lit){
  vec2 uv=wc*.45+.5;
  vec3 p=vec3(.961,.941,.910);
  p+=n(uv*500.)*.03+n(uv*250.)*.018+fb(uv*4.)*.022-.028;
  p+=vec3(.007,.003,-.004)*fb(uv*3.+1.);
  return p*lit;
}

vec2 crk(vec2 p){
  float md=1e10,mp=0.;
  #define L(ax,ay,bx,by,ps,pe){vec2 ab=vec2(bx-ax,by-ay);float t=clamp(dot(p-vec2(ax,ay),ab)/dot(ab,ab),0.,1.);float dd=length(p-vec2(ax,ay)-ab*t);float pp=mix(ps,pe,t);if(dd<md){md=dd;mp=pp;}}

  L(.72,-.10, .71,.02,    0.,.03)
  L(.71,.02, .68,.12,     .03,.07)
  L(.68,.12, .72,.22,     .07,.11)
  L(.72,.22, .67,.34,     .11,.16)
  L(.67,.34, .70,.44,     .16,.20)
  L(.70,.44, .66,.52,     .20,.24)

  L(.66,.52, .62,.60,     .24,.28)
  L(.62,.60, .58,.70,     .28,.33)
  L(.58,.70, .55,.80,     .33,.38)
  L(.55,.80, .53,.90,     .38,.43)
  L(.53,.90, .52,.96,     .43,.47)
  L(.52,.96, .515,1.00,   .47,.50)
  L(.515,1.00, .51,1.12,  .50,.55)
  L(.51,1.12, .505,1.28,  .55,.62)
  L(.505,1.28, .50,1.46,  .62,.70)
  L(.50,1.46, .495,1.64,  .70,.78)
  L(.495,1.64, .49,1.82,  .78,.86)
  L(.49,1.82, .485,2.00,  .86,.92)

  L(.66,.52, .72,.54,     .24,.28)
  L(.72,.54, .78,.48,     .28,.32)
  L(.78,.48, .84,.55,     .32,.37)
  L(.84,.55, .88,.50,     .37,.41)
  L(.88,.50, .94,.56,     .41,.46)
  L(.94,.56, .99,.52,     .46,.50)
  L(.99,.52, 1.05,.57,    .50,.54)
  L(.84,.55, .86,.66,     .37,.44)
  L(.86,.66, .84,.76,     .44,.50)
  L(.84,.76, .85,.86,     .50,.56)

  L(.66,.52, .60,.48,     .24,.28)
  L(.60,.48, .54,.55,     .28,.33)
  L(.54,.55, .48,.50,     .33,.38)
  L(.48,.50, .42,.56,     .38,.43)
  L(.42,.56, .36,.52,     .43,.48)
  L(.36,.52, .30,.58,     .48,.53)
  L(.30,.58, .24,.54,     .53,.58)
  L(.24,.54, .18,.60,     .58,.63)
  L(.48,.50, .46,.62,     .38,.45)
  L(.46,.62, .44,.74,     .45,.52)

  L(.72,.22, .78,.18,     .11,.17)
  L(.78,.18, .82,.24,     .17,.23)

  L(.505,1.28, .47,1.36,  .62,.70)
  L(.47,1.36, .44,1.30,   .70,.76)

  return vec2(md,mp);
}

vec2 warpUV(vec2 uv){
  vec2 w=uv;
  vec2 s=vec2(Sd,Sd*1.37);
  w.x+=(n(uv*6.+s+vec2(3.7,8.1))-.5)*.045;
  w.y+=(n(uv*6.+s+vec2(12.3,1.9))-.5)*.045;
  w.x+=(n(uv*14.+s+vec2(7.2,4.5))-.5)*.022;
  w.y+=(n(uv*14.+s+vec2(2.8,11.6))-.5)*.022;
  w.x+=(n(uv*32.+s+vec2(5.1,9.3))-.5)*.011;
  w.y+=(n(uv*32.+s+vec2(14.7,3.2))-.5)*.011;
  w.x+=(n(uv*70.+s+vec2(1.4,6.8))-.5)*.005;
  w.y+=(n(uv*70.+s+vec2(9.5,2.1))-.5)*.005;
  w.x+=(n(uv*150.+s+vec2(8.3,4.7))-.5)*.0025;
  w.y+=(n(uv*150.+s+vec2(3.6,13.1))-.5)*.0025;
  return w;
}

vec3 psych(vec2 p,float t){
  vec2 q=vec2(fb(p*3.+t*.12),fb(p*3.+vec2(5.2,1.3)+t*.1));
  vec2 r=vec2(fb(p*3.+q*4.+vec2(1.7,9.2)+t*.08),fb(p*3.+q*4.+vec2(8.3,2.8)+t*.06));
  float f=fb(p*2.5+r*2.5);
  vec3 c=mix(vec3(.89,.24,.50),vec3(.05,.54,.55),smoothstep(0.,.45,f));
  c=mix(c,vec3(.83,.63,.19),smoothstep(.25,.65,f));
  c=mix(c,vec3(.29,.17,.63),smoothstep(.5,.85,f));
  return c*1.2;
}

vec2 boxHit(vec3 ro,vec3 rd,vec3 mn,vec3 mx,out vec3 nm){
  vec3 t1=(mn-ro)/rd,t2=(mx-ro)/rd;
  vec3 tN=min(t1,t2),tF=max(t1,t2);
  float tNr=max(max(tN.x,tN.y),tN.z);
  float tFr=min(min(tF.x,tF.y),tF.z);
  nm=-sign(rd)*step(tN.yzx,tN.xyz)*step(tN.zxy,tN.xyz);
  return vec2(tNr,tFr);
}

vec3 renderCrack(vec2 fuv, vec2 worldXZ, float fLit, vec3 nm){
  float rawF=clamp((T-.05)/2.8,0.,1.);
  float front=pow(rawF,.55);

  vec2 wuv=warpUV(fuv);

  vec2 cr=crk(wuv);
  float d=cr.x;
  float prop=cr.y;

  float age=max(0.,front-prop);
  float act=step(prop,front);
  float opn=smoothstep(0.,.22,age);
  float lft=smoothstep(0.,.32,age);

  float centeredness=1.-abs(prop-.5)*2.;
  float bW=.022+.020*smoothstep(0.,.6,centeredness);
  float bth=opn>.98?sin(T*.6)*.002:0.;
  float w=bW*opn+bth;

  float e2=.002;
  float gxx=crk(warpUV(fuv+vec2(e2,0.))).x-crk(warpUV(fuv-vec2(e2,0.))).x;
  float gyy=crk(warpUV(fuv+vec2(0.,e2))).x-crk(warpUV(fuv-vec2(0.,e2))).x;
  vec2 cn=normalize(vec2(gxx,gyy)+1e-6);

  float prox=smoothstep(w+.06,w+.004,d)*act;
  float disp=prox*lft*.006;
  vec2 dWC=worldXZ+cn*disp*1.5;
  vec3 pch=parch(dWC,fLit);

  float bvl=dot(cn,normalize(vec2(-.5,.7)));
  float litB=clamp(bvl,0.,1.);

  float hair=smoothstep(.005,0.,d)*act*(1.-opn)*.6;
  float tipD=abs(front-prop);
  float tipG=smoothstep(.05,0.,tipD)*act*smoothstep(.005,0.,d)*(1.-opn);

  float impD=length(fuv-vec2(.66,.52));
  float impF=smoothstep(.10,0.,impD)*smoothstep(0.,.06,T)*smoothstep(.5,.10,T);

  float lipZ=smoothstep(w+.005,w+.001,d)*(1.-smoothstep(w+.001,max(0.,w-.002),d));
  float lip=lipZ*act;
  vec3 lipC=mix(vec3(.22,.20,.16),vec3(.55,.50,.44),litB)*fLit;
  lipC+=vec3(pow(max(0.,litB),16.)*.15*lft);

  float ctch=smoothstep(w+.004,w+.001,d)*(1.-smoothstep(w+.001,w,d))*act;
  vec3 ctchC=mix(vec3(.32,.28,.24),vec3(.60,.55,.48),litB)*lft*fLit;

  vec2 shO=vec2(.005,-.006)*lft;
  float dSh=crk(warpUV(fuv-shO)).x;
  float shLp=smoothstep(w+.008,w+.001,dSh)*(1.-smoothstep(w+.001,max(0.,w-.002),dSh));
  float drop=shLp*act*lft;
  float soft=smoothstep(w+.06,w+.01,d)*act*lft*.30;

  float wallZ=smoothstep(w+.002,w,d)*(1.-smoothstep(w*.40,w*.15,d))*act;
  vec3 wallC=mix(vec3(.10,.08,.06),vec3(.35,.31,.26),litB*.3)*fLit;
  wallC+=(n(fuv*130.)-.5)*.04;
  float band=sin(fuv.y*160.+fb(fuv*6.)*4.)*.5+.5;
  wallC=mix(wallC,wallC*vec3(1.03,.93,.87),band*.1);

  float inner=smoothstep(w*.32,w*.08,d)*act;
  vec2 px=(M-.5);
  vec3 ic=psych(fuv+px*.04,T);
  vec3 ic2=psych(fuv+px*.08,T+12.);
  float innerD=1.-smoothstep(0.,w*.35,d);
  ic=mix(ic,ic2,smoothstep(.3,.8,innerD));
  float occ=smoothstep(0.,w*.4,d);
  ic*=mix(.04,1.,1.-occ);
  float bloom=smoothstep(0.,.18,age);
  ic*=bloom;
  ic+=vec3(.05,.025,.04)*innerD*bloom;

  float stZ=smoothstep(w+.012,w+.045,d)*smoothstep(w+.10,w+.045,d)*act;
  float stN=n(fuv*40.)*n(fuv*25.);
  float stress=stZ*step(.68,stN)*lft;

  vec3 col=pch;
  col+=vec3(.08,.06,.03)*impF*fLit;
  col*=1.-drop*.5;
  col*=1.-soft;
  col*=1.-prox*lft*.08;
  col=mix(col,col*vec3(.74,.72,.68),stress*.45);
  col=mix(col,vec3(.12,.10,.07)*fLit,hair);
  col=mix(col,ctchC,ctch*lft*.7);
  col=mix(col,lipC,lip*lft);
  col=mix(col,wallC,wallZ*lft);
  col=mix(col,ic,inner*opn);
  float blZ=smoothstep(w+.015,w+.002,d)*(1.-smoothstep(w+.002,w,d))*act;
  col+=psych(fuv+px*.01,T)*.08*blZ*bloom*.3;
  col+=vec3(.18,.12,.06)*tipG*fLit;
  return col;
}

void main(){
  vec2 sc=(gl_FragCoord.xy-S*.5)/S.y;

  float aY=(M.x-.5)*.22;
  float aX=.52+(M.y-.5)*.15;
  float D=3.8;
  vec3 ro=vec3(sin(aY)*cos(aX),sin(aX),cos(aY)*cos(aX))*D;
  vec3 fwd=normalize(-ro);
  vec3 rt=normalize(cross(fwd,vec3(0,1,0)));
  vec3 up=cross(rt,fwd);
  vec3 rd=normalize(fwd*1.8+rt*sc.x+up*sc.y);

  vec3 bn=vec3(-6.0,-.55,-6.0), bx=vec3(6.0,.55,1.0);

  float crU0=-1.4, crU1=1.4;
  float crV0=-1.0, crV1=1.0;
  float crSx=crU1-crU0, crSz=crV1-crV0;
  float sy=bx.y-bn.y;

  vec3 nm;
  vec2 tb=boxHit(ro,rd,bn,bx,nm);

  vec3 col=vec3(.942,.922,.890);

  bool slabHit=tb.x<tb.y&&tb.x>0.;

  if(slabHit){
    vec3 hit=ro+rd*tb.x;

    if(nm.y>.5){
      vec2 fuv=vec2((hit.x-crU0)/crSx,(hit.z-crV0)/crSz);
      vec3 ldir=normalize(vec3(-.4,.9,.5));
      float fLit=.30+max(dot(nm,ldir),0.)*.70;
      col=renderCrack(fuv,hit.xz,fLit,nm);

    } else if(nm.z>.5){
      vec2 fuv=vec2(
        (hit.x-crU0)/crSx,
        1.0 + (bx.y-hit.y)/sy
      );
      vec3 ldir=normalize(vec3(-.4,.9,.5));
      float fLit=.25+max(dot(nm,ldir),0.)*.75;

      vec2 fwc=vec2(hit.x, hit.y*2.0);
      col=renderCrack(fuv,fwc,fLit,nm);

    } else if(nm.y<-.5){
      vec3 ldir=normalize(vec3(-.4,.9,.5));
      float fLit=.20+max(dot(abs(nm),ldir),0.)*.30;
      col=parch(hit.xz,fLit);

    } else {
      vec3 ldir=normalize(vec3(-.4,.9,.5));
      float fLit=.28+max(dot(nm,ldir),0.)*.55;
      col=parch(vec2(hit.z,hit.y),fLit);

      float edgeDark=smoothstep(0.,.08,abs(hit.y-bx.y));
      col*=mix(.92,1.,edgeDark);
    }
  }

  col*=1.-.05*length(sc);
  gl_FragColor=vec4(col,1.);
}`;

  onMount(() => {
    if (!browser) return;

    const maybeGL = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!maybeGL) return;
    const G = maybeGL;
    gl = G;

    const SEED = Math.random() * 1000;

    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5;

    const handleMouse = (e: MouseEvent) => {
      mx = e.clientX / innerWidth;
      my = e.clientY / innerHeight;
    };
    document.addEventListener('mousemove', handleMouse);

    const resize = () => {
      const d = Math.min(devicePixelRatio, 2);
      canvas.width = innerWidth * d;
      canvas.height = innerHeight * d;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      G.viewport(0, 0, canvas.width, canvas.height);
    };

    function mkS(t: number, s: string) {
      const sh = G.createShader(t)!;
      G.shaderSource(sh, s);
      G.compileShader(sh);
      if (!G.getShaderParameter(sh, G.COMPILE_STATUS)) {
        console.error('Shader:', G.getShaderInfoLog(sh));
      }
      return sh;
    }

    const vs = mkS(G.VERTEX_SHADER, VS);
    const fs = mkS(G.FRAGMENT_SHADER, FS);
    const P = G.createProgram()!;
    G.attachShader(P, vs);
    G.attachShader(P, fs);
    G.linkProgram(P);
    if (!G.getProgramParameter(P, G.LINK_STATUS)) {
      console.error('Link:', G.getProgramInfoLog(P));
    }
    G.useProgram(P);

    const buf = G.createBuffer();
    G.bindBuffer(G.ARRAY_BUFFER, buf);
    G.bufferData(G.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), G.STATIC_DRAW);
    const aP = G.getAttribLocation(P, 'a');
    G.enableVertexAttribArray(aP);
    G.vertexAttribPointer(aP, 2, G.FLOAT, false, 0, 0);

    const uT = G.getUniformLocation(P, 'T');
    const uS = G.getUniformLocation(P, 'S');
    const uM = G.getUniformLocation(P, 'M');
    const uSd = G.getUniformLocation(P, 'Sd');

    resize();
    window.addEventListener('resize', resize);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const t0 = performance.now();

    if (prefersReducedMotion) {
      // Render one static frame
      G.uniform1f(uT, 3.0); // fully revealed
      G.uniform2f(uS, canvas.width, canvas.height);
      G.uniform2f(uM, 0.5, 0.5);
      G.uniform1f(uSd, SEED);
      G.drawArrays(G.TRIANGLE_STRIP, 0, 4);
    } else {
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

      const frame = (now: number) => {
        if (!visible) {
          animationId = 0;
          return;
        }
        const el = (now - t0) / 1000;
        smx += (mx - smx) * 0.04;
        smy += (my - smy) * 0.04;
        G.uniform1f(uT, el);
        G.uniform2f(uS, canvas.width, canvas.height);
        G.uniform2f(uM, smx, smy);
        G.uniform1f(uSd, SEED);
        G.drawArrays(G.TRIANGLE_STRIP, 0, 4);
        animationId = requestAnimationFrame(frame);
      };
      animationId = requestAnimationFrame(frame);
    }

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', handleMouse);
    };
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (gl) {
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      gl = null;
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="hero-crack"
  aria-hidden="true"
></canvas>

<style>
  .hero-crack {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
