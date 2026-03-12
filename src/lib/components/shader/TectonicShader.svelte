<script lang="ts">
  /**
   * TectonicShader — WebGL2 tectonic parchment shader
   *
   * GEPA-optimized domain-warped FBM with fracture detection, terracotta bleed,
   * and film grain. Two variants: "light" (hero) and "dark" (background texture).
   *
   * Lifecycle: WebGL2 context created on mount, fully cleaned up on destroy.
   * Pauses rendering when off-screen via IntersectionObserver.
   * DPI-aware with mobile/low-power cap at 1.5x.
   */

  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { prefersReducedMotion } from '$lib/utils/motion';

  interface Props {
    variant?: 'light' | 'dark';
    opacity?: number;
    interactive?: boolean;
    class?: string;
  }

  let {
    variant = 'light',
    opacity = variant === 'dark' ? 0.15 : 1.0,
    interactive = true,
    class: className = ''
  }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let supported = $state(true);

  // --- Shader Sources ---

  const VERT_SRC = `#version 300 es
out vec2 v_uv;
void main() {
  float x = float((gl_VertexID & 1) << 2) - 1.0;
  float y = float((gl_VertexID & 2) << 1) - 1.0;
  v_uv = vec2(x, y) * 0.5 + 0.5;
  gl_Position = vec4(x, y, 0.0, 1.0);
}`;

  const FRAG_SRC = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_speed;
uniform float u_warpStrength;
uniform float u_fractureIntensity;
uniform float u_terracottaBleed;
uniform float u_grainAmount;
uniform float u_vignetteStrength;
uniform float u_flowAngle;
uniform float u_contrastBoost;
uniform vec3 u_parchment;
uniform vec3 u_parchmentWarm;
uniform vec3 u_parchmentCool;
uniform vec3 u_terracotta;

vec3 mod289v3(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289v2(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289v3(((x*34.0)+1.0)*x);}

float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;
  x12.xy-=i1;
  i=mod289v2(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;
  g.x=a0.x*x0.x+h.x*x0.y;
  g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}

float fbm(vec2 st, int octaves){
  float value=0.0,amplitude=0.5,frequency=1.0,maxVal=0.0;
  for(int i=0;i<8;i++){
    if(i>=octaves)break;
    value+=amplitude*snoise(st*frequency);
    maxVal+=amplitude;
    amplitude*=0.5;
    frequency*=2.0;
  }
  return value/maxVal;
}

void main(){
  vec2 uv=v_uv;
  float aspect=u_resolution.x/u_resolution.y;
  vec2 p=vec2(uv.x*aspect,uv.y);
  vec2 mouseOffset=(u_mouse-0.5)*0.012;
  p+=mouseOffset;
  float t=u_time*u_speed;
  float flowAngle=u_flowAngle;
  vec2 flowDir=vec2(cos(flowAngle),sin(flowAngle));
  vec2 flowOffset=flowDir*t*0.08;
  p+=flowOffset;
  vec2 q=vec2(
    fbm(p*2.2+vec2(0.0,t*0.42),5),
    fbm(p*2.6+vec2(5.2,t*0.38),5)
  );
  vec2 r=vec2(
    fbm(p*2.3+u_warpStrength*q+vec2(1.7,9.2+t*0.35),5),
    fbm(p*2.8+u_warpStrength*q+vec2(8.3,2.8+t*0.28),5)
  );
  float n=fbm(p*2.4+u_warpStrength*r,6);
  float fracture=fwidth(n)*u_fractureIntensity;
  fracture=smoothstep(0.025,0.38,fracture);
  float fineFracture=fwidth(fbm(p*6.5+0.75*r,4))*u_fractureIntensity*0.65;
  fineFracture=smoothstep(0.04,0.42,fineFracture);
  float microFracture=fwidth(fbm(p*12.0+0.5*q,3))*u_fractureIntensity*0.35;
  microFracture=smoothstep(0.06,0.48,microFracture);
  float totalFracture=max(fracture,max(fineFracture*0.55,microFracture*0.25));
  float colorShift=n*0.55+0.5;
  vec3 baseColor=mix(u_parchmentCool,u_parchmentWarm,colorShift);
  float strata=smoothstep(-0.35,0.25,n)*0.072;
  baseColor-=strata;
  float depth=smoothstep(-0.55,0.55,n);
  baseColor=mix(baseColor,u_parchmentWarm*0.96,depth*0.16);
  float elevation=smoothstep(0.25,0.75,n);
  baseColor=mix(baseColor,u_parchmentCool*1.015,elevation*0.08);
  float shadowAmount=totalFracture*0.062;
  baseColor-=shadowAmount;
  float terracottaAmount=pow(totalFracture,1.85)*u_terracottaBleed;
  vec3 color=mix(baseColor,u_terracotta,terracottaAmount);
  float catchLight=pow(fracture,2.2)*0.14;
  color+=catchLight;
  vec2 focalCenter=vec2(0.68,0.48);
  float focalDist=length(uv-focalCenter);
  float focalGlow=smoothstep(0.6,0.0,focalDist)*0.035;
  color+=focalGlow;
  float focalContrast=smoothstep(0.7,0.2,focalDist)*u_contrastBoost;
  color=mix(color,color*1.08,focalContrast);
  vec2 vigUV=(uv-vec2(0.52,0.5))*vec2(aspect*0.95,1.0);
  float vignette=1.0-smoothstep(0.25,1.15,length(vigUV));
  color*=mix(1.0,vignette,u_vignetteStrength);
  float grain=(fract(sin(dot(uv*u_resolution+u_time*100.0,vec2(12.9898,78.233)))*43758.5453)-0.5)*2.0;
  color+=grain*u_grainAmount;
  float micro=snoise(uv*85.0+u_time*2.8)*0.0025;
  color+=micro;
  float colorSep=totalFracture*0.008;
  color.r+=colorSep;
  color.b-=colorSep*0.6;
  fragColor=vec4(clamp(color,0.0,1.0),1.0);
}`;

  // --- Uniform Presets ---

  const LIGHT_UNIFORMS: Record<string, number | number[]> = {
    u_speed: 0.025,
    u_warpStrength: 2.1,
    u_fractureIntensity: 22.0,
    u_terracottaBleed: 0.18,
    u_grainAmount: 0.022,
    u_vignetteStrength: 0.14,
    u_flowAngle: 0.35,
    u_contrastBoost: 0.12,
    u_parchment: [0.961, 0.941, 0.910],
    u_parchmentWarm: [0.942, 0.905, 0.852],
    u_parchmentCool: [0.955, 0.942, 0.925],
    u_terracotta: [0.773, 0.353, 0.239]
  };

  const DARK_UNIFORMS: Record<string, number | number[]> = {
    u_speed: 0.018,
    u_warpStrength: 1.8,
    u_fractureIntensity: 16.0,
    u_terracottaBleed: 0.10,
    u_grainAmount: 0.015,
    u_vignetteStrength: 0.08,
    u_flowAngle: 0.35,
    u_contrastBoost: 0.06,
    u_parchment: [0.102, 0.102, 0.102],
    u_parchmentWarm: [0.12, 0.11, 0.095],
    u_parchmentCool: [0.09, 0.09, 0.095],
    u_terracotta: [0.55, 0.25, 0.17]
  };

  // --- WebGL State ---

  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  let uniformLocs: Record<string, WebGLUniformLocation | null> = {};
  let animFrameId: number | null = null;
  let intersectionObs: IntersectionObserver | null = null;
  let resizeObs: ResizeObserver | null = null;
  let isVisible = true;
  let startTime = 0;
  let frame = 0;
  let stateWidth = 0;
  let stateHeight = 0;
  let dpi = 1;
  let mouseX = 0.5;
  let mouseY = 0.5;
  const mouseTarget = { x: 0.5, y: 0.5 };
  const MOUSE_SMOOTH = 0.055;

  // --- Lifecycle ---

  onMount(() => {
    if (!browser || !canvasEl) return;
    if (prefersReducedMotion()) {
      supported = false;
      return;
    }

    initWebGL();
  });

  onDestroy(() => {
    cleanup();
  });

  function initWebGL() {
    if (!canvasEl) return;

    const ctx = canvasEl.getContext('webgl2', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    });

    if (!ctx) {
      supported = false;
      return;
    }

    gl = ctx;

    // DPI detection with mobile/low-power cap
    dpi = Math.min(window.devicePixelRatio || 1, 2.0);
    const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency <= 4;
    if (isMobile || isLowPower) {
      dpi = Math.min(dpi, 1.5);
    }

    // Compile shaders
    try {
      program = createProgram(VERT_SRC, FRAG_SRC);
    } catch (e) {
      console.warn('[TectonicShader] Shader compilation failed:', e);
      supported = false;
      return;
    }

    // Cache uniform locations
    const uniforms = variant === 'dark' ? DARK_UNIFORMS : LIGHT_UNIFORMS;
    const standardNames = ['u_time', 'u_resolution', 'u_mouse'];
    const customNames = Object.keys(uniforms);
    const allNames = [...standardNames, ...customNames];

    for (const name of allNames) {
      uniformLocs[name] = gl.getUniformLocation(program, name);
    }

    // VAO
    vao = gl.createVertexArray();

    // Initial sizing
    resize();

    // Observers
    intersectionObs = new IntersectionObserver(
      (entries) => { isVisible = entries[0].isIntersecting; },
      { threshold: 0.0 }
    );
    intersectionObs.observe(canvasEl);

    resizeObs = new ResizeObserver(() => { resize(); });
    resizeObs.observe(canvasEl);

    // Mouse tracking
    if (interactive) {
      canvasEl.addEventListener('mousemove', onMouseMove);
      canvasEl.addEventListener('mouseleave', onMouseLeave);
      canvasEl.addEventListener('touchmove', onTouchMove, { passive: true });
      canvasEl.addEventListener('touchend', onTouchEnd);
    }

    // Start render loop
    startTime = performance.now();
    animFrameId = requestAnimationFrame(render);
  }

  function createProgram(vertSrc: string, fragSrc: string): WebGLProgram {
    if (!gl) throw new Error('No GL context');

    const vert = compileShader(gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl.FRAGMENT_SHADER, fragSrc);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      throw new Error('Program link error: ' + log);
    }

    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return prog;
  }

  function compileShader(type: number, source: string): WebGLShader {
    if (!gl) throw new Error('No GL context');

    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('Shader compile error: ' + log);
    }

    return shader;
  }

  function resize() {
    if (!gl || !canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const w = Math.floor(rect.width * dpi);
    const h = Math.floor(rect.height * dpi);
    if (w === stateWidth && h === stateHeight) return;

    canvasEl.width = w;
    canvasEl.height = h;
    stateWidth = w;
    stateHeight = h;
    gl.viewport(0, 0, w, h);
  }

  function render(now: number) {
    animFrameId = requestAnimationFrame(render);
    if (!isVisible || !gl || !program || !vao) return;

    const time = (now - startTime) * 0.001;
    frame++;

    // Smooth mouse interpolation
    mouseX += (mouseTarget.x - mouseX) * MOUSE_SMOOTH;
    mouseY += (mouseTarget.y - mouseY) * MOUSE_SMOOTH;

    // Set uniforms
    gl.bindVertexArray(vao);
    gl.useProgram(program);

    if (uniformLocs.u_time !== null) gl.uniform1f(uniformLocs.u_time, time);
    if (uniformLocs.u_resolution !== null) gl.uniform2f(uniformLocs.u_resolution, stateWidth, stateHeight);
    if (uniformLocs.u_mouse !== null) gl.uniform2f(uniformLocs.u_mouse, mouseX, mouseY);

    const uniforms = variant === 'dark' ? DARK_UNIFORMS : LIGHT_UNIFORMS;
    for (const [name, value] of Object.entries(uniforms)) {
      const loc = uniformLocs[name];
      if (loc === null || loc === undefined) continue;
      if (typeof value === 'number') {
        gl.uniform1f(loc, value);
      } else if (Array.isArray(value)) {
        if (value.length === 2) gl.uniform2fv(loc, value);
        else if (value.length === 3) gl.uniform3fv(loc, value);
        else if (value.length === 4) gl.uniform4fv(loc, value);
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // --- Input Handlers ---

  function onMouseMove(e: MouseEvent) {
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    mouseTarget.x = (e.clientX - rect.left) / rect.width;
    mouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
  }

  function onMouseLeave() {
    mouseTarget.x = 0.5;
    mouseTarget.y = 0.5;
  }

  function onTouchMove(e: TouchEvent) {
    if (!canvasEl) return;
    const touch = e.touches[0];
    const rect = canvasEl.getBoundingClientRect();
    mouseTarget.x = (touch.clientX - rect.left) / rect.width;
    mouseTarget.y = 1.0 - (touch.clientY - rect.top) / rect.height;
  }

  function onTouchEnd() {
    mouseTarget.x = 0.5;
    mouseTarget.y = 0.5;
  }

  // --- Cleanup ---

  function cleanup() {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    if (canvasEl && interactive) {
      canvasEl.removeEventListener('mousemove', onMouseMove);
      canvasEl.removeEventListener('mouseleave', onMouseLeave);
      canvasEl.removeEventListener('touchmove', onTouchMove);
      canvasEl.removeEventListener('touchend', onTouchEnd);
    }

    if (intersectionObs) {
      intersectionObs.disconnect();
      intersectionObs = null;
    }

    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }

    if (gl) {
      if (program) {
        gl.deleteProgram(program);
        program = null;
      }
      if (vao) {
        gl.deleteVertexArray(vao);
        vao = null;
      }
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      gl = null;
    }
  }
</script>

<div
  class="tectonic-shader {className}"
  class:tectonic-shader--hidden={!supported}
  style:opacity={opacity}
>
  {#if supported}
    <canvas
      bind:this={canvasEl}
      class="tectonic-shader__canvas"
      aria-hidden="true"
    ></canvas>
  {/if}
</div>

<style>
  .tectonic-shader {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .tectonic-shader--hidden {
    display: none;
  }

  .tectonic-shader__canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
