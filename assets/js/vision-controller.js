/**
 * Vision Controller
 * Manages switching between creative visions for Subfracture
 *
 * Visions:
 * - living-ink: AI-breathing drawings + self-drawing SVGs
 * - ink-space: Three.js 3D gallery with particles
 * - fluid-canvas: WebGL fluid simulation
 * - generative-temple: Sacred geometry patterns
 */

class VisionController {
  constructor(options = {}) {
    this.options = {
      default: options.default || null,
      available: options.available || ['living-ink', 'ink-space', 'fluid-canvas', 'generative-temple'],
      mobileFirst: options.mobileFirst ?? true,
      ...options
    };

    this.currentVision = null;
    this.visionModules = {};
    this.isInitialized = false;
    this.isMobile = this.detectMobile();

    this.init();
  }

  detectMobile() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async init() {
    // Check URL parameter for vision override
    const urlParams = new URLSearchParams(window.location.search);
    const visionParam = urlParams.get('vision');

    if (visionParam && this.options.available.includes(visionParam)) {
      this.options.default = visionParam;
    }

    // Create UI controls
    this.createControls();

    // Bind keyboard shortcuts
    this.bindKeyboard();

    // Load default vision if specified
    if (this.options.default) {
      await this.activate(this.options.default);
    }

    this.isInitialized = true;
    console.log('[VisionController] Initialized', {
      mobile: this.isMobile,
      default: this.options.default
    });
  }

  createControls() {
    // Create vision switcher UI (hidden by default, toggle with 'V' key)
    const controls = document.createElement('div');
    controls.className = 'vision-controls';
    controls.innerHTML = `
      <div class="vision-controls__inner">
        <div class="vision-controls__label">Vision Mode</div>
        <div class="vision-controls__buttons">
          ${this.options.available.map((v, i) => `
            <button class="vision-btn" data-vision="${v}" title="Press ${i + 1}">
              ${this.getVisionLabel(v)}
            </button>
          `).join('')}
          <button class="vision-btn vision-btn--off" data-vision="none" title="Press 0">
            Off
          </button>
        </div>
        <div class="vision-controls__hint">Press 1-4 to switch, 0 to disable, V to toggle panel</div>
      </div>
    `;

    controls.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.95);
      padding: 16px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      color: #fff;
      display: none;
      backdrop-filter: blur(10px);
      border: 2px solid #7d54ff;
    `;

    document.body.appendChild(controls);
    this.controlsEl = controls;

    // Bind button clicks
    controls.querySelectorAll('.vision-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const vision = btn.dataset.vision;
        if (vision === 'none') {
          this.deactivate();
        } else {
          this.activate(vision);
        }
      });
    });

    // Add button styles
    const style = document.createElement('style');
    style.textContent = `
      .vision-controls__label {
        font-weight: 600;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.7;
      }
      .vision-controls__buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .vision-btn {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 11px;
      }
      .vision-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .vision-btn.active {
        background: #fff;
        color: #000;
      }
      .vision-controls__hint {
        margin-top: 12px;
        opacity: 0.5;
        font-size: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  getVisionLabel(vision) {
    const labels = {
      'living-ink': 'Living Ink',
      'ink-space': 'Ink Space',
      'fluid-canvas': 'Fluid Canvas',
      'generative-temple': 'Gen Temple'
    };
    return labels[vision] || vision;
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Toggle controls visibility with 'V'
      if (e.key.toLowerCase() === 'v') {
        this.toggleControls();
        return;
      }

      // Number keys to switch visions
      if (e.key >= '1' && e.key <= '4') {
        const index = parseInt(e.key) - 1;
        if (this.options.available[index]) {
          this.activate(this.options.available[index]);
        }
      }

      // 0 to disable
      if (e.key === '0') {
        this.deactivate();
      }
    });
  }

  toggleControls() {
    if (this.controlsEl) {
      this.controlsEl.style.display =
        this.controlsEl.style.display === 'none' ? 'block' : 'none';
    }
  }

  async activate(visionName) {
    if (!this.options.available.includes(visionName)) {
      console.warn(`[VisionController] Unknown vision: ${visionName}`);
      return;
    }

    // Deactivate current vision
    if (this.currentVision && this.currentVision !== visionName) {
      await this.deactivate();
    }

    // Check if already active
    if (this.currentVision === visionName) return;

    console.log(`[VisionController] Activating: ${visionName}`);

    try {
      // Lazy load the vision module
      if (!this.visionModules[visionName]) {
        this.visionModules[visionName] = await this.loadVision(visionName);
      }

      const module = this.visionModules[visionName];
      if (module && typeof module.init === 'function') {
        await module.init({
          mobile: this.isMobile,
          mobileFirst: this.options.mobileFirst
        });
      }

      this.currentVision = visionName;
      document.body.setAttribute('data-vision', visionName);

      // Update UI
      this.updateActiveButton(visionName);

    } catch (error) {
      console.error(`[VisionController] Failed to activate ${visionName}:`, error);
    }
  }

  async loadVision(visionName) {
    const modulePath = `/assets/js/visions/${visionName}.js`;
    try {
      const module = await import(/* @vite-ignore */ modulePath);
      return module.default || module;
    } catch (error) {
      console.error(`[VisionController] Failed to load ${modulePath}:`, error);
      return null;
    }
  }

  async deactivate() {
    if (!this.currentVision) return;

    console.log(`[VisionController] Deactivating: ${this.currentVision}`);

    const module = this.visionModules[this.currentVision];
    if (module && typeof module.destroy === 'function') {
      await module.destroy();
    }

    this.currentVision = null;
    document.body.removeAttribute('data-vision');
    this.updateActiveButton(null);
  }

  updateActiveButton(visionName) {
    if (!this.controlsEl) return;

    this.controlsEl.querySelectorAll('.vision-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.vision === visionName);
    });
  }

  // Get performance tier based on device
  getPerformanceTier() {
    if (this.isMobile) return 'low';

    // Check for high-end indicators
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) return 'low';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check for dedicated GPU
      if (/NVIDIA|AMD|Radeon/i.test(renderer)) {
        return 'high';
      }
    }

    return 'medium';
  }
}

// Export singleton instance
let instance = null;

export function initVisionController(options) {
  if (!instance) {
    instance = new VisionController(options);
  }
  return instance;
}

export function getVisionController() {
  return instance;
}

export default VisionController;
