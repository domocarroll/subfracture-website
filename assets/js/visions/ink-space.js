/**
 * AVENUE B: THE INK SPACE
 *
 * An ethereal 3D gallery where drawings float through fog like memories.
 * Scroll becomes movement through consciousness - organic, breathing, mysterious.
 *
 * Inspired by Gaia Alari's aesthetic: contemplative, atmospheric, not clinical.
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default {
  // Core Three.js objects
  scene: null,
  camera: null,
  renderer: null,
  canvas: null,

  // Drawing planes and particles
  drawingPlanes: [],
  particleSystem: null,

  // Animation state
  animationFrameId: null,
  scrollTrigger: null,
  time: 0,

  // Noise function for organic particle movement
  noiseSeeds: [],

  /**
   * Initialize the ink space experience
   * @param {Object} options - Configuration options
   * @param {HTMLElement} options.container - Container element
   * @param {boolean} options.mobile - Whether on mobile device
   */
  init(options = {}) {
    console.log('[InkSpace] Initializing ethereal gallery...');

    this.options = {
      mobile: options.mobile || window.innerWidth < 768,
      container: options.container || document.body,
      particleCount: options.mobile ? 10000 : 30000,
      scrollDistance: 100, // Camera travels 100 units on Z axis
      ...options
    };

    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.setupFog();
    this.loadDrawings();
    this.setupParticles();
    this.setupScrollBinding();
    this.setupResize();
    this.animate();

    console.log('[InkSpace] Scene initialized. Begin the drift...');
  },

  /**
   * Setup Three.js scene with dark background
   */
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a); // Almost black
  },

  /**
   * Setup perspective camera
   */
  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 200);
    this.camera.position.z = 0; // Start at origin
    this.camera.position.y = 0;
  },

  /**
   * Setup WebGL renderer with performance optimizations
   */
  setupRenderer() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'ink-space-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';

    this.options.container.appendChild(this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.options.mobile,
      alpha: false,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  },

  /**
   * Setup subtle ambient lighting
   */
  setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    // Soft directional light from above-front
    const directional = new THREE.DirectionalLight(0xffffff, 0.4);
    directional.position.set(0, 10, 5);
    this.scene.add(directional);
  },

  /**
   * Setup atmospheric fog that increases with depth
   */
  setupFog() {
    // Exponential fog for atmospheric depth
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);
  },

  /**
   * Load and position drawing planes at various Z depths
   */
  loadDrawings() {
    const textureLoader = new THREE.TextureLoader();

    // Drawing configurations: path, position, rotation, scale
    const drawings = [
      // z = -100: Brisbane/Meanjin map (horizontal ground plane)
      {
        path: '/assets/drawings/IMG_0240.jpg',
        position: [0, -8, -100],
        rotation: [-Math.PI / 2, 0, 0], // Horizontal
        scale: [20, 15, 1]
      },

      // z = -70: Workshop tools, strategy diagrams
      {
        path: '/assets/drawings/IMG_0154.jpg', // Bagua diagram
        position: [-10, 2, -70],
        rotation: [0, 0.2, 0],
        scale: [6, 6, 1]
      },
      {
        path: '/assets/drawings/IMG_0155.jpg', // Additional depth
        position: [12, -3, -75],
        rotation: [0, -0.3, 0],
        scale: [5, 7, 1]
      },

      // z = -40: Hip-hop icons (eye level feeling)
      {
        path: '/assets/drawings/IMG_0133.jpg', // Hip-hop portrait
        position: [8, 3, -40],
        rotation: [0, -0.4, 0],
        scale: [7, 9, 1]
      },
      {
        path: '/assets/drawings/IMG_0165.jpg', // Jimi Hendrix
        position: [-12, 0, -45],
        rotation: [0, 0.3, 0],
        scale: [6, 8, 1]
      },

      // z = -20: Eastern philosophy, Shaolin
      {
        path: '/assets/drawings/IMG_0159.jpg', // Sadhu meditation
        position: [-7, 4, -20],
        rotation: [0, 0.1, 0],
        scale: [6, 8, 1]
      },
      {
        path: '/assets/drawings/IMG_0161.jpg', // Shaolin monk
        position: [10, -2, -25],
        rotation: [0, -0.2, 0],
        scale: [5, 7, 1]
      },

      // z = 0 to -15: Starting area
      {
        path: '/assets/drawings/IMG_0176.jpg', // Contemporary figure
        position: [0, 2, -10],
        rotation: [0, 0, 0],
        scale: [8, 10, 1]
      },

      // Additional atmospheric pieces
      {
        path: '/assets/drawings/IMG_0152.jpg',
        position: [15, 5, -60],
        rotation: [0, -0.5, 0],
        scale: [5, 6, 1]
      },
      {
        path: '/assets/drawings/IMG_0174.jpg',
        position: [-15, -5, -35],
        rotation: [0, 0.4, 0],
        scale: [6, 7, 1]
      }
    ];

    drawings.forEach((config, index) => {
      textureLoader.load(
        config.path,
        (texture) => {
          // Create plane with texture
          const geometry = new THREE.PlaneGeometry(config.scale[0], config.scale[1]);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            roughness: 0.8,
            metalness: 0.1
          });

          const plane = new THREE.Mesh(geometry, material);
          plane.position.set(...config.position);
          plane.rotation.set(...config.rotation);

          // Subtle floating animation
          plane.userData.initialY = config.position[1];
          plane.userData.floatOffset = index * 0.5;
          plane.userData.floatSpeed = 0.3 + Math.random() * 0.2;
          plane.userData.floatAmplitude = 0.3 + Math.random() * 0.3;

          this.scene.add(plane);
          this.drawingPlanes.push(plane);
        },
        undefined,
        (error) => {
          console.warn(`[InkSpace] Failed to load ${config.path}:`, error);
        }
      );
    });
  },

  /**
   * Create curl noise particle system for atmospheric drift
   */
  setupParticles() {
    const particleCount = this.options.particleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Initialize particles in a volume around the camera path
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Spread particles throughout the space
      positions[i3] = (Math.random() - 0.5) * 60; // x: -30 to 30
      positions[i3 + 1] = (Math.random() - 0.5) * 40; // y: -20 to 20
      positions[i3 + 2] = -Math.random() * 120; // z: 0 to -120

      // Initial velocities (will be updated by curl noise)
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Store noise seeds for each particle
      this.noiseSeeds.push({
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        z: Math.random() * 1000
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Particle material with soft glow
    const material = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: this.options.mobile ? 0.08 : 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  },

  /**
   * Simple 3D noise function (Perlin-like)
   */
  noise3D(x, y, z) {
    // Simplified noise using sine waves for organic movement
    const nx = Math.sin(x * 0.1) * Math.cos(y * 0.1);
    const ny = Math.sin(y * 0.1) * Math.cos(z * 0.1);
    const nz = Math.sin(z * 0.1) * Math.cos(x * 0.1);
    return (nx + ny + nz) / 3;
  },

  /**
   * Curl noise for fluid-like particle flow
   */
  curlNoise(x, y, z, time) {
    const epsilon = 0.01;

    // Sample noise at neighboring points
    const n1 = this.noise3D(x, y + epsilon, z + time);
    const n2 = this.noise3D(x, y - epsilon, z + time);
    const n3 = this.noise3D(x + epsilon, y, z + time);
    const n4 = this.noise3D(x - epsilon, y, z + time);
    const n5 = this.noise3D(x, y, z + epsilon + time);
    const n6 = this.noise3D(x, y, z - epsilon + time);

    // Compute curl (rotation of the field)
    return {
      x: (n1 - n2) - (n5 - n6),
      y: (n5 - n6) - (n3 - n4),
      z: (n3 - n4) - (n1 - n2)
    };
  },

  /**
   * Update particle positions using curl noise
   */
  updateParticles(deltaTime) {
    const positions = this.particleSystem.geometry.attributes.position.array;
    const particleCount = positions.length / 3;
    const scale = 0.05; // Noise scale
    const speed = 0.5; // Movement speed

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const seed = this.noiseSeeds[i];

      // Get curl noise vector
      const curl = this.curlNoise(
        (positions[i3] + seed.x) * scale,
        (positions[i3 + 1] + seed.y) * scale,
        (positions[i3 + 2] + seed.z) * scale,
        this.time * 0.1
      );

      // Apply curl force to position
      positions[i3] += curl.x * speed * deltaTime;
      positions[i3 + 1] += curl.y * speed * deltaTime;
      positions[i3 + 2] += curl.z * speed * deltaTime;

      // Wrap particles that drift too far
      if (positions[i3] > 30) positions[i3] = -30;
      if (positions[i3] < -30) positions[i3] = 30;
      if (positions[i3 + 1] > 20) positions[i3 + 1] = -20;
      if (positions[i3 + 1] < -20) positions[i3 + 1] = 20;
      if (positions[i3 + 2] > 0) positions[i3 + 2] = -120;
      if (positions[i3 + 2] < -120) positions[i3 + 2] = 0;
    }

    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  },

  /**
   * Update floating animation on drawing planes
   */
  updateDrawings(deltaTime) {
    this.drawingPlanes.forEach(plane => {
      const { initialY, floatOffset, floatSpeed, floatAmplitude } = plane.userData;
      plane.position.y = initialY + Math.sin(this.time * floatSpeed + floatOffset) * floatAmplitude;
    });
  },

  /**
   * Bind camera Z position to scroll progress
   */
  setupScrollBinding() {
    const scrollDistance = this.options.scrollDistance;

    // Create a scroll-triggered camera animation
    this.scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        // Move camera from z=0 to z=-100 based on scroll progress
        const targetZ = -self.progress * scrollDistance;

        // Smooth camera movement with GSAP
        gsap.to(this.camera.position, {
          z: targetZ,
          duration: 0.5,
          ease: 'power2.out'
        });

        // Subtle camera sway for organic feel
        this.camera.position.x = Math.sin(self.progress * Math.PI * 2) * 2;
        this.camera.position.y = Math.cos(self.progress * Math.PI * 3) * 1.5;
      }
    });
  },

  /**
   * Handle window resize
   */
  setupResize() {
    this.resizeHandler = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    };

    window.addEventListener('resize', this.resizeHandler);
  },

  /**
   * Main animation loop
   */
  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const deltaTime = 0.016; // Approximate 60fps
    this.time += deltaTime;

    // Update systems
    this.updateParticles(deltaTime);
    this.updateDrawings(deltaTime);

    // Render scene
    this.renderer.render(this.scene, this.camera);
  },

  /**
   * Clean up and dispose of all resources
   */
  destroy() {
    console.log('[InkSpace] Dissolving the space...');

    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Kill scroll trigger
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    // Remove resize listener
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    // Dispose of drawing planes
    this.drawingPlanes.forEach(plane => {
      if (plane.geometry) plane.geometry.dispose();
      if (plane.material) {
        if (plane.material.map) plane.material.map.dispose();
        plane.material.dispose();
      }
    });
    this.drawingPlanes = [];

    // Dispose of particle system
    if (this.particleSystem) {
      if (this.particleSystem.geometry) this.particleSystem.geometry.dispose();
      if (this.particleSystem.material) this.particleSystem.material.dispose();
    }

    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
    }

    // Remove canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // Clear scene
    if (this.scene) {
      while(this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }

    // Reset references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.particleSystem = null;
    this.noiseSeeds = [];

    console.log('[InkSpace] Space dissolved. Memory freed.');
  }
};
