/**
 * AVENUE D: THE GENERATIVE TEMPLE
 * Sacred geometry system - mathematical patterns as atmospheric background
 * Each section receives its own wallpaper group symmetry
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class GenerativeTemple {
  constructor() {
    this.container = null;
    this.patterns = new Map();
    this.animations = [];
    this.seed = this.generateDailySeed();
    this.isMobile = window.innerWidth < 768;
    this.complexity = this.isMobile ? 0.5 : 1.0;
  }

  /**
   * Generate seeded random - same day = same pattern
   */
  generateDailySeed() {
    const date = new Date();
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    return dayOfYear + date.getFullYear() * 1000;
  }

  /**
   * Seeded random number generator
   */
  random(seed = this.seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Initialize the temple
   */
  init(options = {}) {
    console.log('🕉️ Initializing Generative Temple...');

    // Create SVG container layer - ABSOLUTE positioning to scroll with page
    // Get document height for full coverage
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );

    this.container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.container.setAttribute('class', 'generative-temple');
    this.container.setAttribute('width', '100%');
    this.container.setAttribute('height', docHeight);
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: ${docHeight}px;
      pointer-events: none;
      z-index: 100;
      overflow: visible;
    `;

    document.body.appendChild(this.container);

    // DEBUG: Add visible confirmation
    console.log('🕉️ Temple container created:', this.container);

    // Create a visible debug indicator
    const debugDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    debugDot.setAttribute('cx', '50');
    debugDot.setAttribute('cy', '50');
    debugDot.setAttribute('r', '30');
    debugDot.setAttribute('fill', '#7d54ff');
    debugDot.setAttribute('opacity', '0.8');
    this.container.appendChild(debugDot);
    console.log('🕉️ Debug dot added - you should see a purple circle top-left');

    // Generate patterns for each section
    this.generateSectionPatterns();

    // Add resize handler
    this.handleResize = this.onResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    console.log('✨ Temple awakened');
  }

  /**
   * Generate patterns for each section
   */
  generateSectionPatterns() {
    // FIXED: Use actual Subfracture HTML selectors - HIGHLY VISIBLE
    const sections = [
      { selector: '.hero', type: 'breathing-dots', opacity: 0.6 },
      { selector: '.sf-what-we-do', type: 'p4m', opacity: 0.5 },
      { selector: '.sf-services', type: 'p6m', opacity: 0.5 },
      { selector: '.sf-ai-system', type: 'bagua', opacity: 0.7 },
      { selector: '.sf-approach', type: 'lissajous', opacity: 0.5 },
      { selector: '.sf-fight', type: 'fragmenting', opacity: 0.6 }
    ];

    sections.forEach(({ selector, type, opacity }) => {
      const element = document.querySelector(selector);
      if (!element) return;

      const pattern = this.createPattern(type, element, opacity);
      if (pattern) {
        this.patterns.set(selector, pattern);
        this.activatePattern(pattern, element);
      }
    });
  }

  /**
   * Create pattern based on type
   * Uses document coordinates (not viewport) for fixed SVG positioning
   */
  createPattern(type, element, opacity) {
    // Get document-relative coordinates (not viewport)
    const viewportRect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Convert viewport coords to document coords
    const rect = {
      top: viewportRect.top + scrollTop,
      left: viewportRect.left + scrollLeft,
      width: viewportRect.width,
      height: viewportRect.height,
      right: viewportRect.right + scrollLeft,
      bottom: viewportRect.bottom + scrollTop
    };

    console.log(`[Temple] Creating ${type} pattern at:`, { top: rect.top, left: rect.left, width: rect.width, height: rect.height });

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', `temple-pattern temple-${type}`);
    group.setAttribute('opacity', opacity);

    let content;
    switch (type) {
      case 'breathing-dots':
        content = this.generateBreathingDots(rect);
        break;
      case 'p4m':
        content = this.generateP4mPattern(rect);
        break;
      case 'p6m':
        content = this.generateP6mPattern(rect);
        break;
      case 'bagua':
        content = this.generateBaguaMandala(rect);
        break;
      case 'lissajous':
        content = this.generateLissajous(rect);
        break;
      case 'fragmenting':
        content = this.generateFragmenting(rect);
        break;
      default:
        return null;
    }

    group.appendChild(content);
    this.container.appendChild(group);

    return { group, element, type };
  }

  /**
   * HERO: Breathing dots - DRAMATIC, highly visible
   */
  generateBreathingDots(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const count = Math.floor(60 * this.complexity); // Even more dots

    for (let i = 0; i < count; i++) {
      const seed = this.seed + i;
      const x = rect.left + this.random(seed) * rect.width;
      const y = rect.top + this.random(seed + 1) * rect.height;
      const r = 8 + this.random(seed + 2) * 20; // Much larger dots (8-28px)

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', '#7d54ff');
      circle.setAttribute('fill-opacity', '0.8');
      circle.setAttribute('class', 'breathing-dot');

      // Stagger animation delays
      const delay = this.random(seed + 3) * 4;
      circle.style.animationDelay = `${delay}s`;

      group.appendChild(circle);
    }

    return group;
  }

  /**
   * WHAT WE DO: p4m symmetry (square/Islamic geometric)
   */
  generateP4mPattern(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const cellSize = this.isMobile ? 80 : 60;
    const cols = Math.ceil(rect.width / cellSize) + 2;
    const rows = Math.ceil(rect.height / cellSize) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = rect.left + col * cellSize;
        const y = rect.top + row * cellSize;

        // Create 4-fold rotational symmetric tile
        const tile = this.createP4mTile(x, y, cellSize);
        group.appendChild(tile);
      }
    }

    return group;
  }

  /**
   * Create single p4m tile with 4-fold symmetry
   */
  createP4mTile(x, y, size) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const half = size / 2;
    const quarter = size / 4;

    // Create fundamental domain (quarter of square)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Draw a simple curve pattern
    const d = `
      M ${x + half} ${y + half}
      Q ${x + half + quarter} ${y + half} ${x + size} ${y + half + quarter}
      L ${x + size} ${y + size}
      L ${x + half} ${y + size}
      Z
    `;

    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#7d54ff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-opacity', '0.8');

    // Apply 4-fold rotational symmetry
    for (let i = 0; i < 4; i++) {
      const clone = path.cloneNode();
      clone.setAttribute('transform', `rotate(${i * 90} ${x + half} ${y + half})`);
      group.appendChild(clone);
    }

    return group;
  }

  /**
   * SERVICES: p6m symmetry (hexagonal)
   */
  generateP6mPattern(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const size = this.isMobile ? 80 : 60;
    const h = size * Math.sqrt(3) / 2; // hexagon height

    const cols = Math.ceil(rect.width / (size * 1.5)) + 2;
    const rows = Math.ceil(rect.height / h) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = rect.left + col * size * 1.5;
        const y = rect.top + row * h + (col % 2) * h / 2;

        const hex = this.createP6mHexagon(x, y, size / 2);
        group.appendChild(hex);
      }
    }

    return group;
  }

  /**
   * Create hexagon with 6-fold symmetry
   */
  createP6mHexagon(cx, cy, r) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points.join(' '));
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#7d54ff');
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('stroke-opacity', '0.9');

    // Add inner pattern
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.appendChild(polygon);

    // Add center circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r / 4);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#7d54ff');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('stroke-opacity', '0.8');
    group.appendChild(circle);

    return group;
  }

  /**
   * AI SYSTEM: Animated Bagua Mandala
   */
  generateBaguaMandala(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'bagua-mandala');

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * 0.3;

    // Outer circle - PROMINENT
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', cx);
    outerCircle.setAttribute('cy', cy);
    outerCircle.setAttribute('r', radius);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#7d54ff');
    outerCircle.setAttribute('stroke-width', '3');
    outerCircle.setAttribute('stroke-opacity', '0.9');
    group.appendChild(outerCircle);

    // Inner yin-yang circle
    const yinYang = this.createYinYang(cx, cy, radius * 0.4);
    group.appendChild(yinYang);

    // 8 trigrams around the circle
    const trigrams = [
      [1, 1, 1], // Heaven ☰
      [0, 0, 0], // Earth ☷
      [1, 0, 0], // Thunder ☳
      [0, 1, 0], // Water ☵
      [1, 1, 0], // Mountain ☶
      [0, 0, 1], // Wind ☴
      [0, 1, 1], // Fire ☲
      [1, 0, 1]  // Lake ☱
    ];

    trigrams.forEach((lines, i) => {
      const angle = (Math.PI * 2 / 8) * i - Math.PI / 2;
      const tx = cx + radius * 0.75 * Math.cos(angle);
      const ty = cy + radius * 0.75 * Math.sin(angle);

      const trigram = this.createTrigram(tx, ty, lines, angle);
      trigram.setAttribute('class', 'bagua-trigram');
      trigram.style.transformOrigin = `${cx}px ${cy}px`;
      group.appendChild(trigram);
    });

    // Animate rotation
    gsap.to(group, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
      transformOrigin: `${cx}px ${cy}px`
    });

    return group;
  }

  /**
   * Create yin-yang symbol
   */
  createYinYang(cx, cy, r) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Outer circle
    const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outer.setAttribute('cx', cx);
    outer.setAttribute('cy', cy);
    outer.setAttribute('r', r);
    outer.setAttribute('fill', '#7d54ff');
    outer.setAttribute('fill-opacity', '0.2');
    group.appendChild(outer);

    // Dividing curve (simplified as two semicircles)
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = `
      M ${cx} ${cy - r}
      A ${r/2} ${r/2} 0 0 1 ${cx} ${cy}
      A ${r/2} ${r/2} 0 0 0 ${cx} ${cy + r}
      A ${r} ${r} 0 0 0 ${cx} ${cy - r}
    `;
    path.setAttribute('d', d);
    path.setAttribute('fill', '#0a0014');
    path.setAttribute('fill-opacity', '0.3');
    group.appendChild(path);

    // Small dots
    const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot1.setAttribute('cx', cx);
    dot1.setAttribute('cy', cy - r/2);
    dot1.setAttribute('r', r/6);
    dot1.setAttribute('fill', '#0a0014');
    dot1.setAttribute('fill-opacity', '0.5');
    group.appendChild(dot1);

    const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot2.setAttribute('cx', cx);
    dot2.setAttribute('cy', cy + r/2);
    dot2.setAttribute('r', r/6);
    dot2.setAttribute('fill', '#7d54ff');
    dot2.setAttribute('fill-opacity', '0.3');
    group.appendChild(dot2);

    return group;
  }

  /**
   * Create I-Ching trigram
   */
  createTrigram(x, y, lines, rotation) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const lineHeight = 4;
    const lineSpacing = 8;
    const lineWidth = 30;
    const gapWidth = 8;

    lines.forEach((solid, i) => {
      const ly = y - lineHeight - lineSpacing + i * lineSpacing;

      if (solid) {
        // Solid line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        line.setAttribute('x', x - lineWidth / 2);
        line.setAttribute('y', ly);
        line.setAttribute('width', lineWidth);
        line.setAttribute('height', lineHeight);
        line.setAttribute('fill', '#7d54ff');
        group.appendChild(line);
      } else {
        // Broken line (two segments)
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        line1.setAttribute('x', x - lineWidth / 2);
        line1.setAttribute('y', ly);
        line1.setAttribute('width', (lineWidth - gapWidth) / 2);
        line1.setAttribute('height', lineHeight);
        line1.setAttribute('fill', '#7d54ff');
        group.appendChild(line1);

        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        line2.setAttribute('x', x + gapWidth / 2);
        line2.setAttribute('y', ly);
        line2.setAttribute('width', (lineWidth - gapWidth) / 2);
        line2.setAttribute('height', lineHeight);
        line2.setAttribute('fill', '#7d54ff');
        group.appendChild(line2);
      }
    });

    // Subtle pulse animation
    gsap.to(group, {
      opacity: 0.6,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    return group;
  }

  /**
   * APPROACH: Lissajous curves - flowing, harmonic
   */
  generateLissajous(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const count = this.isMobile ? 2 : 4;

    for (let i = 0; i < count; i++) {
      const seed = this.seed + i * 100;
      const a = Math.floor(this.random(seed) * 5) + 1;
      const b = Math.floor(this.random(seed + 1) * 5) + 1;
      const delta = this.random(seed + 2) * Math.PI * 2;

      const path = this.createLissajousCurve(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        Math.min(rect.width, rect.height) * 0.3,
        a, b, delta
      );

      path.setAttribute('stroke', '#7d54ff');
      path.setAttribute('stroke-width', '3');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.8');

      group.appendChild(path);
    }

    return group;
  }

  /**
   * Create Lissajous curve path
   */
  createLissajousCurve(cx, cy, radius, a, b, delta) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const points = [];
    const steps = 1000;

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = cx + radius * Math.sin(a * t + delta);
      const y = cy + radius * Math.sin(b * t);
      points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
    }

    path.setAttribute('d', points.join(' ') + ' Z');
    return path;
  }

  /**
   * WHAT WE FIGHT: Fragmenting pattern
   */
  generateFragmenting(rect) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const count = Math.floor(30 * this.complexity);

    for (let i = 0; i < count; i++) {
      const seed = this.seed + i;
      const x = rect.left + this.random(seed) * rect.width;
      const y = rect.top + this.random(seed + 1) * rect.height;
      const size = 10 + this.random(seed + 2) * 30;

      // Create angular fragment
      const fragment = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = [];
      const sides = 3 + Math.floor(this.random(seed + 3) * 3);

      for (let j = 0; j < sides; j++) {
        const angle = (Math.PI * 2 / sides) * j + this.random(seed + j + 10);
        const r = size * (0.5 + this.random(seed + j + 20) * 0.5);
        points.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
      }

      fragment.setAttribute('points', points.join(' '));
      fragment.setAttribute('fill', 'none');
      fragment.setAttribute('stroke', '#7d54ff');
      fragment.setAttribute('stroke-width', '2');
      fragment.setAttribute('stroke-opacity', '0.9');

      // Fragment animation - scatter and reform
      gsap.to(fragment, {
        x: (this.random(seed + 50) - 0.5) * 100,
        y: (this.random(seed + 51) - 0.5) * 100,
        rotation: this.random(seed + 52) * 360,
        opacity: 0.2,
        duration: 3 + this.random(seed + 53) * 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: this.random(seed + 54) * 2
      });

      group.appendChild(fragment);
    }

    return group;
  }

  /**
   * Activate pattern with scroll trigger
   */
  activatePattern(pattern, element) {
    // Fade in when section enters viewport
    gsap.from(pattern.group, {
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    });
  }

  /**
   * Handle window resize
   */
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // Regenerate if mobile state changed
    if (wasMobile !== this.isMobile) {
      this.complexity = this.isMobile ? 0.5 : 1.0;
      this.destroy();
      this.init();
    }
  }

  /**
   * Clean destruction
   */
  destroy() {
    console.log('🕉️ Closing temple...');

    // Kill all GSAP animations
    this.animations.forEach(anim => anim.kill());
    this.animations = [];

    // Remove scroll triggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger && this.patterns.has(trigger.vars.trigger)) {
        trigger.kill();
      }
    });

    // Remove SVG container
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // Clear patterns map
    this.patterns.clear();

    // Remove resize listener
    window.removeEventListener('resize', this.handleResize);

    this.container = null;

    console.log('✨ Temple dissolved');
  }
}

// Export singleton instance
const temple = new GenerativeTemple();

export default {
  init: (options) => temple.init(options),
  destroy: () => temple.destroy()
};
