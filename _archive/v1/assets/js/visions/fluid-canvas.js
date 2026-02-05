/**
 * AVENUE C: THE FLUID CANVAS
 * WebGL-based fluid simulation with ink-in-water aesthetic
 * Implements Jos Stam's "Stable Fluids" algorithm
 */

export default {
  // Core state
  canvas: null,
  gl: null,
  isRunning: false,
  isMobile: false,

  // Simulation parameters
  simWidth: 512,
  simHeight: 512,
  dyeResolution: 512,

  // Fluid properties
  config: {
    simResolution: 512,
    dyeResolution: 512,
    densityDissipation: 0.98,
    velocityDissipation: 0.99,
    pressure: 0.8,
    pressureIterations: 20,
    curl: 25,
    splatRadius: 0.003,
    velocityScale: 0.6,
    baseFlow: 0.0001, // Ambient flow for ink-in-water effect
  },

  // WebGL resources
  programs: {},
  framebuffers: {},
  textures: {},

  // Interaction state
  pointers: [],

  // Animation state
  lastTime: 0,
  animationFrame: null,

  // Drawing emergence system
  drawings: new Map(),

  /**
   * Initialize the fluid canvas
   */
  init(options = {}) {
    console.log('🌊 Initializing Fluid Canvas...');

    this.isMobile = options.mobile || window.innerWidth < 768;

    // Adjust resolution for mobile
    if (this.isMobile) {
      this.config.simResolution = 256;
      this.config.dyeResolution = 256;
      this.config.pressureIterations = 10;
    }

    this.simWidth = this.config.simResolution;
    this.simHeight = this.config.simResolution;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fluid-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    `;
    document.body.prepend(this.canvas);

    // Get WebGL2 context
    const gl = this.canvas.getContext('webgl2', {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.warn('WebGL2 not available, falling back to static background');
      this.canvas.style.background = '#f5f5f0';
      return;
    }

    this.gl = gl;

    // Setup WebGL extensions
    this.setupExtensions();

    // Compile shaders and create programs
    this.createPrograms();

    // Initialize framebuffers
    this.initFramebuffers();

    // Setup event listeners
    this.setupEventListeners();

    // Handle resize
    this.resize();

    // Start simulation
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();

    // Setup drawing emergence system
    this.setupDrawingSystem();

    console.log('✓ Fluid Canvas initialized');
  },

  /**
   * Setup WebGL extensions
   */
  setupExtensions() {
    const gl = this.gl;
    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) {
      console.warn('EXT_color_buffer_float not available');
    }
  },

  /**
   * Create shader programs
   */
  createPrograms() {
    const gl = this.gl;

    // Base vertex shader (used by all programs)
    const baseVertexShader = `#version 300 es
      precision highp float;

      in vec2 aPosition;
      out vec2 vUv;
      out vec2 vL;
      out vec2 vR;
      out vec2 vT;
      out vec2 vB;
      uniform vec2 texelSize;

      void main() {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Display shader - renders density as ink on cream background
    const displayFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      uniform sampler2D uTexture;
      out vec4 fragColor;

      void main() {
        vec3 density = texture(uTexture, vUv).rgb;
        // Ink on cream (#f5f5f0 = 245,245,240)
        vec3 background = vec3(0.961, 0.961, 0.941);
        vec3 ink = vec3(0.02, 0.02, 0.02);
        vec3 color = mix(background, ink, density);
        fragColor = vec4(color, 1.0);
      }
    `;

    // Splat shader - injects density/velocity
    const splatFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      out vec4 fragColor;

      void main() {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture(uTarget, vUv).rgb;
        fragColor = vec4(base + splat, 1.0);
      }
    `;

    // Advection shader - move values by velocity field
    const advectionFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      out vec4 fragColor;

      void main() {
        vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
        vec4 result = texture(uSource, coord);
        fragColor = dissipation * result;
      }
    `;

    // Divergence shader - calculate divergence of velocity field
    const divergenceFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      in vec2 vL;
      in vec2 vR;
      in vec2 vT;
      in vec2 vB;
      uniform sampler2D uVelocity;
      out vec4 fragColor;

      void main() {
        float L = texture(uVelocity, vL).x;
        float R = texture(uVelocity, vR).x;
        float T = texture(uVelocity, vT).y;
        float B = texture(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        fragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    // Curl shader - calculate curl of velocity field
    const curlFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      in vec2 vL;
      in vec2 vR;
      in vec2 vT;
      in vec2 vB;
      uniform sampler2D uVelocity;
      out vec4 fragColor;

      void main() {
        float L = texture(uVelocity, vL).y;
        float R = texture(uVelocity, vR).y;
        float T = texture(uVelocity, vT).x;
        float B = texture(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    // Vorticity shader - apply vorticity confinement
    const vorticityFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      in vec2 vL;
      in vec2 vR;
      in vec2 vT;
      in vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      out vec4 fragColor;

      void main() {
        float L = texture(uCurl, vL).x;
        float R = texture(uCurl, vR).x;
        float T = texture(uCurl, vT).x;
        float B = texture(uCurl, vB).x;
        float C = texture(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        fragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    // Pressure shader - iteratively solve for pressure
    const pressureFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      in vec2 vL;
      in vec2 vR;
      in vec2 vT;
      in vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      out vec4 fragColor;

      void main() {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        float C = texture(uPressure, vUv).x;
        float divergence = texture(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        fragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    // Gradient subtraction shader - make velocity divergence-free
    const gradientSubtractFragmentShader = `#version 300 es
      precision highp float;

      in vec2 vUv;
      in vec2 vL;
      in vec2 vR;
      in vec2 vT;
      in vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      out vec4 fragColor;

      void main() {
        float L = texture(uPressure, vL).x;
        float R = texture(uPressure, vR).x;
        float T = texture(uPressure, vT).x;
        float B = texture(uPressure, vB).x;
        vec2 velocity = texture(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        fragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    // Compile programs
    this.programs = {
      display: this.createProgram(baseVertexShader, displayFragmentShader),
      splat: this.createProgram(baseVertexShader, splatFragmentShader),
      advection: this.createProgram(baseVertexShader, advectionFragmentShader),
      divergence: this.createProgram(baseVertexShader, divergenceFragmentShader),
      curl: this.createProgram(baseVertexShader, curlFragmentShader),
      vorticity: this.createProgram(baseVertexShader, vorticityFragmentShader),
      pressure: this.createProgram(baseVertexShader, pressureFragmentShader),
      gradientSubtract: this.createProgram(baseVertexShader, gradientSubtractFragmentShader)
    };
  },

  /**
   * Create shader program
   */
  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compile error:', gl.getShaderInfoLog(vertexShader));
      return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compile error:', gl.getShaderInfoLog(fragmentShader));
      return null;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }

    // Get uniform locations
    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }

    return { program, uniforms };
  },

  /**
   * Initialize framebuffers for simulation
   */
  initFramebuffers() {
    const gl = this.gl;

    // Helper to create double framebuffer (ping-pong)
    const createDoubleFBO = (w, h, internalFormat, format, type, filtering) => {
      const fbo1 = this.createFBO(w, h, internalFormat, format, type, filtering);
      const fbo2 = this.createFBO(w, h, internalFormat, format, type, filtering);
      return {
        width: w,
        height: h,
        read: fbo1,
        write: fbo2,
        swap() {
          const temp = this.read;
          this.read = this.write;
          this.write = temp;
        }
      };
    };

    const simRes = this.config.simResolution;
    const dyeRes = this.config.dyeResolution;

    const filtering = gl.LINEAR;
    const halfFloat = gl.HALF_FLOAT;
    const rgba = gl.RGBA;
    const rg = gl.RG;
    const r = gl.RED;

    // Density field (RGB)
    this.framebuffers.density = createDoubleFBO(
      dyeRes,
      dyeRes,
      gl.RGBA16F,
      rgba,
      halfFloat,
      filtering
    );

    // Velocity field (RG)
    this.framebuffers.velocity = createDoubleFBO(
      simRes,
      simRes,
      gl.RG16F,
      rg,
      halfFloat,
      filtering
    );

    // Divergence (R)
    this.framebuffers.divergence = this.createFBO(
      simRes,
      simRes,
      gl.R16F,
      r,
      halfFloat,
      gl.NEAREST
    );

    // Curl (R)
    this.framebuffers.curl = this.createFBO(
      simRes,
      simRes,
      gl.R16F,
      r,
      halfFloat,
      gl.NEAREST
    );

    // Pressure (R)
    this.framebuffers.pressure = createDoubleFBO(
      simRes,
      simRes,
      gl.R16F,
      r,
      halfFloat,
      gl.NEAREST
    );

    // Setup geometry
    this.setupGeometry();
  },

  /**
   * Create framebuffer object
   */
  createFBO(w, h, internalFormat, format, type, filtering) {
    const gl = this.gl;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h
    };
  },

  /**
   * Setup quad geometry
   */
  setupGeometry() {
    const gl = this.gl;

    const vertices = new Float32Array([
      -1, -1,
      -1,  1,
       1,  1,
       1, -1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.quadBuffer = buffer;
  },

  /**
   * Setup event listeners for interaction
   */
  setupEventListeners() {
    // Mouse/touch interaction
    this.canvas.addEventListener('mousemove', this.handlePointerMove.bind(this));
    this.canvas.addEventListener('touchmove', this.handlePointerMove.bind(this), { passive: false });
    this.canvas.addEventListener('mousedown', this.handlePointerDown.bind(this));
    this.canvas.addEventListener('touchstart', this.handlePointerDown.bind(this));

    // Window resize
    window.addEventListener('resize', this.resize.bind(this));

    // Add subtle ambient motion
    this.addAmbientFlow();
  },

  /**
   * Handle pointer move
   */
  handlePointerMove(e) {
    e.preventDefault();
    const pointer = this.getPointerData(e);
    if (pointer) {
      this.updatePointer(pointer);
    }
  },

  /**
   * Handle pointer down
   */
  handlePointerDown(e) {
    const pointer = this.getPointerData(e);
    if (pointer) {
      this.pointers.push(pointer);
    }
  },

  /**
   * Get pointer data from event
   */
  getPointerData(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return {
      x: x / rect.width,
      y: 1.0 - y / rect.height,
      dx: 0,
      dy: 0,
      down: true
    };
  },

  /**
   * Update pointer
   */
  updatePointer(pointer) {
    const existing = this.pointers.find(p => p.id === pointer.id);
    if (existing) {
      pointer.dx = pointer.x - existing.x;
      pointer.dy = pointer.y - existing.y;
      Object.assign(existing, pointer);
    }
  },

  /**
   * Add ambient flow for ink-in-water effect
   */
  addAmbientFlow() {
    setInterval(() => {
      if (!this.isRunning) return;

      const x = Math.random();
      const y = Math.random();
      const dx = (Math.random() - 0.5) * 0.001;
      const dy = (Math.random() - 0.5) * 0.001;

      this.splat(x, y, dx, dy, { r: 0.1, g: 0.1, b: 0.1 });
    }, 2000);
  },

  /**
   * Splat density and velocity
   */
  splat(x, y, dx, dy, color) {
    const gl = this.gl;
    const aspectRatio = this.canvas.width / this.canvas.height;

    // Splat velocity
    this.splatProgram(
      this.framebuffers.velocity.read,
      this.framebuffers.velocity.write,
      x, y,
      dx, dy, 0,
      aspectRatio,
      this.config.splatRadius * this.config.velocityScale
    );
    this.framebuffers.velocity.swap();

    // Splat density
    this.splatProgram(
      this.framebuffers.density.read,
      this.framebuffers.density.write,
      x, y,
      color.r, color.g, color.b,
      aspectRatio,
      this.config.splatRadius
    );
    this.framebuffers.density.swap();
  },

  /**
   * Execute splat program
   */
  splatProgram(target, dest, x, y, colorR, colorG, colorB, aspectRatio, radius) {
    const gl = this.gl;
    const program = this.programs.splat;

    gl.bindFramebuffer(gl.FRAMEBUFFER, dest.fbo);
    gl.viewport(0, 0, dest.width, dest.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uTarget, 0);
    gl.uniform1f(program.uniforms.aspectRatio, aspectRatio);
    gl.uniform2f(program.uniforms.point, x, y);
    gl.uniform3f(program.uniforms.color, colorR, colorG, colorB);
    gl.uniform1f(program.uniforms.radius, radius);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, target.texture);

    this.drawQuad();
  },

  /**
   * Draw fullscreen quad
   */
  drawQuad() {
    const gl = this.gl;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  },

  /**
   * Main simulation step
   */
  step(dt) {
    const gl = this.gl;

    // Apply curl and vorticity confinement
    this.curl(this.framebuffers.velocity.read, this.framebuffers.curl);
    this.vorticity(this.framebuffers.velocity.read, this.framebuffers.curl, this.framebuffers.velocity.write, dt);
    this.framebuffers.velocity.swap();

    // Compute divergence
    this.divergence(this.framebuffers.velocity.read, this.framebuffers.divergence);

    // Clear pressure
    this.clear(this.framebuffers.pressure.read);

    // Solve pressure (iterative)
    for (let i = 0; i < this.config.pressureIterations; i++) {
      this.pressure(this.framebuffers.pressure.read, this.framebuffers.divergence, this.framebuffers.pressure.write);
      this.framebuffers.pressure.swap();
    }

    // Subtract pressure gradient from velocity
    this.gradientSubtract(this.framebuffers.pressure.read, this.framebuffers.velocity.read, this.framebuffers.velocity.write);
    this.framebuffers.velocity.swap();

    // Advect velocity
    this.advect(this.framebuffers.velocity.read, this.framebuffers.velocity.read, this.framebuffers.velocity.write, dt, this.config.velocityDissipation);
    this.framebuffers.velocity.swap();

    // Advect density
    this.advect(this.framebuffers.velocity.read, this.framebuffers.density.read, this.framebuffers.density.write, dt, this.config.densityDissipation);
    this.framebuffers.density.swap();
  },

  /**
   * Curl calculation
   */
  curl(velocity, output) {
    const gl = this.gl;
    const program = this.programs.curl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uVelocity, 0);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velocity.texture);

    this.drawQuad();
  },

  /**
   * Vorticity confinement
   */
  vorticity(velocity, curl, output, dt) {
    const gl = this.gl;
    const program = this.programs.vorticity;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uVelocity, 0);
    gl.uniform1i(program.uniforms.uCurl, 1);
    gl.uniform1f(program.uniforms.curl, this.config.curl);
    gl.uniform1f(program.uniforms.dt, dt);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, curl.texture);

    this.drawQuad();
  },

  /**
   * Divergence calculation
   */
  divergence(velocity, output) {
    const gl = this.gl;
    const program = this.programs.divergence;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uVelocity, 0);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velocity.texture);

    this.drawQuad();
  },

  /**
   * Pressure iteration
   */
  pressure(pressure, divergence, output) {
    const gl = this.gl;
    const program = this.programs.pressure;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uPressure, 0);
    gl.uniform1i(program.uniforms.uDivergence, 1);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / pressure.width, 1.0 / pressure.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pressure.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, divergence.texture);

    this.drawQuad();
  },

  /**
   * Gradient subtraction
   */
  gradientSubtract(pressure, velocity, output) {
    const gl = this.gl;
    const program = this.programs.gradientSubtract;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uPressure, 0);
    gl.uniform1i(program.uniforms.uVelocity, 1);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / velocity.width, 1.0 / velocity.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, pressure.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, velocity.texture);

    this.drawQuad();
  },

  /**
   * Advection
   */
  advect(velocity, source, output, dt, dissipation) {
    const gl = this.gl;
    const program = this.programs.advection;

    gl.bindFramebuffer(gl.FRAMEBUFFER, output.fbo);
    gl.viewport(0, 0, output.width, output.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uVelocity, 0);
    gl.uniform1i(program.uniforms.uSource, 1);
    gl.uniform2f(program.uniforms.texelSize, 1.0 / source.width, 1.0 / source.height);
    gl.uniform1f(program.uniforms.dt, dt);
    gl.uniform1f(program.uniforms.dissipation, dissipation);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, velocity.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, source.texture);

    this.drawQuad();
  },

  /**
   * Clear framebuffer
   */
  clear(target) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    gl.viewport(0, 0, target.width, target.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  },

  /**
   * Display density field to canvas
   */
  display() {
    const gl = this.gl;
    const program = this.programs.display;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.useProgram(program.program);
    gl.uniform1i(program.uniforms.uTexture, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.framebuffers.density.read.texture);

    this.drawQuad();
  },

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    let dt = Math.min((currentTime - this.lastTime) / 1000, 0.016); // Cap at 60fps
    this.lastTime = currentTime;

    // Process pointer interactions
    this.pointers.forEach(pointer => {
      if (pointer.moved) {
        this.splat(
          pointer.x,
          pointer.y,
          pointer.dx * 10,
          pointer.dy * 10,
          { r: 0.3, g: 0.3, b: 0.3 }
        );
      }
      pointer.moved = false;
    });

    // Run simulation step
    this.step(dt);

    // Display result
    this.display();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  },

  /**
   * Handle canvas resize
   */
  resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
    const displayWidth = Math.floor(window.innerWidth * pixelRatio);
    const displayHeight = Math.floor(window.innerHeight * pixelRatio);

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
    }
  },

  /**
   * Setup drawing emergence system
   */
  setupDrawingSystem() {
    // This will be called by external system via emergeDrawing()
    console.log('✓ Drawing emergence system ready');
  },

  /**
   * Emerge a drawing into the fluid
   */
  emergeDrawing(imagePath, intensity = 1.0) {
    console.log(`🎨 Emerging drawing: ${imagePath}`);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create offscreen canvas to process image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Size to match density resolution
      const size = this.config.dyeResolution;
      canvas.width = size;
      canvas.height = size;

      // Draw and threshold to create mask
      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(0, 0, size, size);

      const scale = Math.min(size / img.width, size / img.height) * 0.6;
      const x = (size - img.width * scale) / 2;
      const y = (size - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Get pixel data and inject as density
      const imageData = ctx.getImageData(0, 0, size, size);
      this.injectDrawingData(imageData, intensity);
    };

    img.onerror = () => {
      console.warn(`Failed to load drawing: ${imagePath}`);
    };

    img.src = imagePath;
  },

  /**
   * Inject drawing data as density splats
   */
  injectDrawingData(imageData, intensity) {
    const size = this.config.dyeResolution;
    const data = imageData.data;
    const threshold = 150; // Brightness threshold for ink

    // Sample grid and inject density
    const step = this.isMobile ? 8 : 4;

    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const i = (y * size + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

        if (brightness < threshold) {
          const densityValue = (1 - brightness / 255) * intensity;
          const nx = x / size;
          const ny = 1 - y / size;

          this.splat(
            nx,
            ny,
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001,
            { r: densityValue, g: densityValue, b: densityValue }
          );
        }
      }
    }
  },

  /**
   * Cleanup and destroy
   */
  destroy() {
    console.log('🌊 Destroying Fluid Canvas...');

    this.isRunning = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    // Cleanup WebGL resources
    if (this.gl) {
      const gl = this.gl;

      // Delete framebuffers
      Object.values(this.framebuffers).forEach(fb => {
        if (fb.read) {
          gl.deleteTexture(fb.read.texture);
          gl.deleteFramebuffer(fb.read.fbo);
          gl.deleteTexture(fb.write.texture);
          gl.deleteFramebuffer(fb.write.fbo);
        } else {
          gl.deleteTexture(fb.texture);
          gl.deleteFramebuffer(fb.fbo);
        }
      });

      // Delete programs
      Object.values(this.programs).forEach(p => {
        if (p && p.program) {
          gl.deleteProgram(p.program);
        }
      });

      // Delete buffer
      if (this.quadBuffer) {
        gl.deleteBuffer(this.quadBuffer);
      }
    }

    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    console.log('✓ Fluid Canvas destroyed');
  }
};
