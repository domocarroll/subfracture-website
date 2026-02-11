<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let animationId: number;
  let renderer: THREE.WebGLRenderer | null = null;
  let mouseTarget = { x: 0, y: 0 };
  let mouseCurrent = { x: 0, y: 0 };

  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uReveal;

    varying vec2 vUv;

    // ── Noise ──

    vec2 hash22(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)),
               dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(dot(hash22(i), f),
            dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
      );
    }

    float fbm(vec2 p) {
      float f = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        f += a * noise(p);
        p *= 2.03;
        a *= 0.48;
      }
      return f;
    }

    // ── SDF: line segment ──

    float sdSeg(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }

    // ── Crack SDF ──

    float crackSDF(vec2 uv) {
      // Work entirely in UV space (0-1) — no aspect correction
      vec2 p = uv;

      // Mouse parallax
      p += uMouse * 0.01;

      float d = 100.0;

      // Position in bottom-right quadrant
      // Main trunk runs from top-right (0.75, 0.75) down to bottom-right (0.85, 0.05)
      float bx = 0.75;

      // ── Main trunk: sharp zig-zag, top to bottom in bottom-right area ──
      vec2 t0 = vec2(bx + 0.01,   0.80);  // Start higher in frame
      vec2 t1 = vec2(bx + 0.025,  0.72);
      vec2 t2 = vec2(bx - 0.015,  0.64);
      vec2 t3 = vec2(bx + 0.030,  0.56);
      vec2 t4 = vec2(bx - 0.010,  0.48);
      vec2 t5 = vec2(bx + 0.020,  0.40);
      vec2 t6 = vec2(bx - 0.020,  0.32);
      vec2 t7 = vec2(bx + 0.015,  0.24);
      vec2 t8 = vec2(bx - 0.008,  0.16);
      vec2 t9 = vec2(bx + 0.010,  0.05);  // End near bottom

      d = min(d, sdSeg(p, t0, t1));
      d = min(d, sdSeg(p, t1, t2));
      d = min(d, sdSeg(p, t2, t3));
      d = min(d, sdSeg(p, t3, t4));
      d = min(d, sdSeg(p, t4, t5));
      d = min(d, sdSeg(p, t5, t6));
      d = min(d, sdSeg(p, t6, t7));
      d = min(d, sdSeg(p, t7, t8));
      d = min(d, sdSeg(p, t8, t9));

      // ── Branch A: left divergence from t3 ──
      vec2 a1 = t3 + vec2(-0.06, -0.08);
      vec2 a2 = a1 + vec2(-0.05, -0.10);
      vec2 a3 = a2 + vec2(-0.06, -0.07);

      d = min(d, sdSeg(p, t3, a1));
      d = min(d, sdSeg(p, a1, a2));
      d = min(d, sdSeg(p, a2, a3));

      // ── Branch B: right divergence from t5 ──
      vec2 b1 = t5 + vec2(0.06, -0.07);
      vec2 b2 = b1 + vec2(0.07, -0.09);
      vec2 b3 = b2 + vec2(0.04, -0.06);

      d = min(d, sdSeg(p, t5, b1));
      d = min(d, sdSeg(p, b1, b2));
      d = min(d, sdSeg(p, b2, b3));

      // ── Sub-branches: hairlines ──
      d = min(d, sdSeg(p, a1, a1 + vec2(-0.03, -0.04)));
      d = min(d, sdSeg(p, t1, t1 + vec2(0.04, -0.03)));
      d = min(d, sdSeg(p, t7, t7 + vec2(-0.03, -0.04)));
      d = min(d, sdSeg(p, b1, b1 + vec2(0.03, -0.04)));

      // Jagged micro-displacement
      d += abs(noise(p * 50.0)) * 0.002;
      d += abs(noise(p * 100.0)) * 0.0008;

      return d;
    }

    // ── Psychedelic interior ──

    vec3 psychedelic(vec2 uv, float time) {
      vec2 q = vec2(
        fbm(uv + time * 0.06),
        fbm(uv + vec2(5.2, 1.3) + time * 0.09)
      );
      vec2 r = vec2(
        fbm(uv + q * 4.0 + vec2(1.7, 9.2) + time * 0.07),
        fbm(uv + q * 4.0 + vec2(8.3, 2.8) + time * 0.05)
      );
      float f = fbm(uv + r * 2.0);

      vec3 col = mix(
        vec3(0.88, 0.15, 0.50),
        vec3(0.06, 0.70, 0.58),
        clamp(f * 2.2, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.96, 0.70, 0.10),
        clamp(length(q) * 0.75, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.28, 0.35, 0.90),
        clamp(length(r) * 0.5, 0.0, 1.0)
      );
      col = mix(col,
        vec3(0.60, 0.85, 0.15),
        clamp(f * f * 1.8, 0.0, 1.0) * 0.20
      );
      col *= 0.85 + 0.45 * f;
      return col;
    }

    // ── Main ──

    void main() {
      vec2 uv = vUv;
      float dist = crackSDF(uv);

      // Crack width: WIDE enough to see psychedelic interior clearly
      // Wider at middle, narrower at ends (top/bottom)
      // Since crack is positioned at y=0.05 to 0.80, center is around y=0.42
      float crackCenter = 0.42;
      float yVar = 1.0 - abs(uv.y - crackCenter) * 1.2;
      yVar = clamp(yVar, 0.3, 1.0);
      float baseWidth = 0.015 + yVar * 0.012;  // 0.015 to 0.027 in UV space

      // Subtle breathing
      baseWidth *= 1.0 + sin(uTime * 0.4) * 0.03;

      // Reveal: grows from center outward along the crack
      float revealDist = abs(uv.y - crackCenter) * 2.0;
      float revealMask = smoothstep(
        uReveal * 1.5 - 0.5,
        uReveal * 1.5,
        1.0 - revealDist
      );
      float crackW = baseWidth * uReveal * revealMask;

      // Depth zones
      float bevelW = crackW * 1.8;
      float shadowW = crackW * 4.0;

      // Surface: parchment with concrete grain
      vec3 surface = vec3(0.961, 0.941, 0.910);
      float grain = noise(uv * 25.0) * 0.012 + noise(uv * 55.0) * 0.006;
      surface += vec3(grain * 0.8, grain * 0.6, grain * 0.3);

      vec3 color = surface;

      if (crackW > 0.001) {
        if (dist < crackW) {
          // ── INTERIOR: psychedelic world ──
          vec2 psychUv = uv * 3.0 + uMouse * 0.25;
          color = psychedelic(psychUv, uTime);

          // Depth shadow at edges
          float edgeT = dist / crackW;
          color = mix(color * 0.12, color, smoothstep(0.0, 0.65, edgeT));

          // Bright center seam
          float centerBright = 1.0 - smoothstep(0.0, crackW * 0.3, dist);
          color += centerBright * 0.12;

        } else if (dist < bevelW) {
          // ── BEVEL: 3D concrete edge ──
          // Use UV-space gradient for directional light instead of expensive normal calc
          float bevelT = (dist - crackW) / (bevelW - crackW);

          // Directional lighting: top-left light source
          // Left side of crack gets shadow, right gets light
          float crackCenterX = 0.75; // crack is in bottom-right quadrant
          float side = sign(uv.x - crackCenterX);

          // Dark side vs lit side
          vec3 darkEdge = vec3(0.22, 0.20, 0.18);
          vec3 litEdge = vec3(0.80, 0.76, 0.70);
          float lightMix = side * 0.4 + 0.5 + uv.y * 0.15;
          vec3 bevelColor = mix(darkEdge, litEdge, clamp(lightMix, 0.0, 1.0));

          color = mix(bevelColor, surface, smoothstep(0.0, 1.0, bevelT));

        } else if (dist < shadowW) {
          // ── SHADOW: ambient occlusion ──
          float t = (dist - bevelW) / (shadowW - bevelW);
          t = 1.0 - t;
          t = t * t;
          color = mix(surface, surface * 0.88, t * 0.5 * uReveal);
        }
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  onMount(() => {
    if (!browser) return;

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance'
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uReveal: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    scene.add(new THREE.Mesh(geometry, material));

    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer!.setSize(w, h);
      renderer!.setPixelRatio(dpr);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouse = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouse);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const startTime = performance.now();
    const revealDuration = prefersReducedMotion ? 0 : 3000;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      const lerpFactor = 0.06;
      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * lerpFactor;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * lerpFactor;

      uniforms.uTime.value = prefersReducedMotion ? 0 : elapsed;
      uniforms.uMouse.value.set(mouseCurrent.x, mouseCurrent.y);

      const rawReveal = Math.min((now - startTime) / revealDuration, 1);
      uniforms.uReveal.value = prefersReducedMotion
        ? 1
        : 1 - Math.pow(1 - rawReveal, 3);

      renderer!.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
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
