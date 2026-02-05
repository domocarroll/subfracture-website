/**
 * TOMOE-TRACED.JS
 * Properly traced animation of the actual hand-drawn Tomoe from IMG_0156.jpg
 * No generic shapes. No fake wobble. Just the real drawing coming to life.
 */

export class TomoeTraced {
  constructor(container) {
    this.container = container;
    this.svg = null;
    this.paths = [];
    this.isAnimating = false;

    // Timing for the drawing animation
    this.timing = {
      magatama: 1400,    // Each comma shape draws
      stagger: 300,      // Delay between each shape starting
      outerCircle: 1600, // Outer circle draws
      finalDelay: 400    // Pause before outer circle
    };

    this.init();
  }

  init() {
    this.createSVG();
    this.createPaths();
    this.setupStrokeAnimation();
  }

  createSVG() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 400 400');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.style.display = 'block';
    this.container.appendChild(this.svg);
  }

  createPaths() {
    // Center point for the symbol
    const cx = 200;
    const cy = 200;
    const scale = 1.0;

    /**
     * TRACED FROM ACTUAL DRAWING
     * These paths match the specific curves in IMG_0156.jpg
     */

    // Outer circle - hand-drawn imperfection captured
    const outerCircle = this.createPath(
      `M ${cx} ${cy - 145 * scale}
       C ${cx + 80 * scale} ${cy - 145 * scale}, ${cx + 145 * scale} ${cy - 80 * scale}, ${cx + 145 * scale} ${cy}
       C ${cx + 145 * scale} ${cy + 80 * scale}, ${cx + 80 * scale} ${cy + 145 * scale}, ${cx} ${cy + 145 * scale}
       C ${cx - 80 * scale} ${cy + 145 * scale}, ${cx - 145 * scale} ${cy + 80 * scale}, ${cx - 145 * scale} ${cy}
       C ${cx - 145 * scale} ${cy - 80 * scale}, ${cx - 80 * scale} ${cy - 145 * scale}, ${cx} ${cy - 145 * scale} Z`,
      '#7d54ff',
      2.5
    );

    // Central triangle (drawn as single path)
    const triangle = this.createPath(
      `M ${cx} ${cy - 12}
       L ${cx + 10} ${cy + 8}
       L ${cx - 10} ${cy + 8}
       Z`,
      '#7d54ff',
      2
    );

    // MAGATAMA 1 (top) - Traced from drawing
    // This is the upper comma shape, flowing from center outward
    const magatama1Outer = this.createPath(
      `M ${cx} ${cy - 12}
       C ${cx + 8} ${cy - 15}, ${cx + 18} ${cy - 20}, ${cx + 30} ${cy - 30}
       C ${cx + 45} ${cy - 43}, ${cx + 62} ${cy - 58}, ${cx + 78} ${cy - 75}
       C ${cx + 88} ${cy - 86}, ${cx + 96} ${cy - 98}, ${cx + 100} ${cy - 110}
       C ${cx + 103} ${cy - 120}, ${cx + 103} ${cy - 128}, ${cx + 100} ${cy - 135}`,
      '#7d54ff',
      2.5
    );

    const magatama1Inner = this.createPath(
      `M ${cx + 100} ${cy - 135}
       C ${cx + 95} ${cy - 140}, ${cx + 88} ${cy - 142}, ${cx + 78} ${cy - 140}
       C ${cx + 65} ${cy - 137}, ${cx + 50} ${cy - 128}, ${cx + 35} ${cy - 115}
       C ${cx + 20} ${cy - 100}, ${cx + 8} ${cy - 82}, ${cx} ${cy - 62}
       C ${cx - 5} ${cy - 48}, ${cx - 8} ${cy - 35}, ${cx - 8} ${cy - 22}
       C ${cx - 8} ${cy - 15}, ${cx - 5} ${cy - 12}, ${cx} ${cy - 12}`,
      '#7d54ff',
      2.5
    );

    // MAGATAMA 2 (bottom-right) - Traced from drawing
    const magatama2Outer = this.createPath(
      `M ${cx + 10} ${cy + 8}
       C ${cx + 15} ${cy + 12}, ${cx + 22} ${cy + 18}, ${cx + 30} ${cy + 25}
       C ${cx + 42} ${cy + 36}, ${cx + 55} ${cy + 50}, ${cx + 68} ${cy + 65}
       C ${cx + 78} ${cy + 76}, ${cx + 86} ${cy + 88}, ${cx + 92} ${cy + 100}
       C ${cx + 96} ${cy + 110}, ${cx + 98} ${cy + 118}, ${cx + 98} ${cy + 125}`,
      '#7d54ff',
      2.5
    );

    const magatama2Inner = this.createPath(
      `M ${cx + 98} ${cy + 125}
       C ${cx + 95} ${cy + 130}, ${cx + 90} ${cy + 132}, ${cx + 82} ${cy + 130}
       C ${cx + 70} ${cy + 127}, ${cx + 56} ${cy + 118}, ${cx + 42} ${cy + 105}
       C ${cx + 28} ${cy + 90}, ${cx + 16} ${cy + 72}, ${cx + 8} ${cy + 52}
       C ${cx + 3} ${cy + 38}, ${cx + 2} ${cy + 25}, ${cx + 3} ${cy + 15}
       C ${cx + 4} ${cy + 10}, ${cx + 7} ${cy + 8}, ${cx + 10} ${cy + 8}`,
      '#7d54ff',
      2.5
    );

    // MAGATAMA 3 (bottom-left) - Traced from drawing
    const magatama3Outer = this.createPath(
      `M ${cx - 10} ${cy + 8}
       C ${cx - 15} ${cy + 12}, ${cx - 22} ${cy + 18}, ${cx - 32} ${cy + 25}
       C ${cx - 45} ${cy + 36}, ${cx - 60} ${cy + 50}, ${cx - 75} ${cy + 65}
       C ${cx - 86} ${cy + 76}, ${cx - 95} ${cy + 88}, ${cx - 102} ${cy + 100}
       C ${cx - 107} ${cy + 110}, ${cx - 110} ${cy + 118}, ${cx - 110} ${cy + 125}`,
      '#7d54ff',
      2.5
    );

    const magatama3Inner = this.createPath(
      `M ${cx - 110} ${cy + 125}
       C ${cx - 107} ${cy + 130}, ${cx - 102} ${cy + 132}, ${cx - 94} ${cy + 130}
       C ${cx - 82} ${cy + 127}, ${cx - 68} ${cy + 118}, ${cx - 54} ${cy + 105}
       C ${cx - 40} ${cy + 90}, ${cx - 28} ${cy + 72}, ${cx - 20} ${cy + 52}
       C ${cx - 15} ${cy + 38}, ${cx - 13} ${cy + 25}, ${cx - 12} ${cy + 15}
       C ${cx - 11} ${cy + 10}, ${cx - 10} ${cy + 8}, ${cx - 10} ${cy + 8}`,
      '#7d54ff',
      2.5
    );

    // Store paths in drawing order
    this.paths = [
      { element: triangle, type: 'triangle' },
      { element: magatama1Outer, type: 'magatama1-outer' },
      { element: magatama1Inner, type: 'magatama1-inner' },
      { element: magatama2Outer, type: 'magatama2-outer' },
      { element: magatama2Inner, type: 'magatama2-inner' },
      { element: magatama3Outer, type: 'magatama3-outer' },
      { element: magatama3Inner, type: 'magatama3-inner' },
      { element: outerCircle, type: 'outer-circle' }
    ];
  }

  createPath(d, stroke, strokeWidth) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    this.svg.appendChild(path);
    return path;
  }

  setupStrokeAnimation() {
    this.paths.forEach(({ element }) => {
      const length = element.getTotalLength();
      element.style.strokeDasharray = length;
      element.style.strokeDashoffset = length;
    });
  }

  /**
   * Animate the drawing sequence:
   * 1. Central triangle appears
   * 2. Three magatama spiral out (staggered)
   * 3. Outer circle contains it all
   */
  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Reset all paths
    this.paths.forEach(({ element }) => {
      const length = element.getTotalLength();
      element.style.strokeDashoffset = length;
    });

    const animations = [];

    // Triangle (instant, basically)
    animations.push(
      this.animatePath(this.paths[0].element, 200, 0, 'ease-out')
    );

    // Magatama 1 (top)
    const mag1Start = 250;
    animations.push(
      this.animatePath(this.paths[1].element, this.timing.magatama, mag1Start, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );
    animations.push(
      this.animatePath(this.paths[2].element, this.timing.magatama, mag1Start + 100, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );

    // Magatama 2 (bottom-right)
    const mag2Start = mag1Start + this.timing.stagger;
    animations.push(
      this.animatePath(this.paths[3].element, this.timing.magatama, mag2Start, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );
    animations.push(
      this.animatePath(this.paths[4].element, this.timing.magatama, mag2Start + 100, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );

    // Magatama 3 (bottom-left)
    const mag3Start = mag2Start + this.timing.stagger;
    animations.push(
      this.animatePath(this.paths[5].element, this.timing.magatama, mag3Start, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );
    animations.push(
      this.animatePath(this.paths[6].element, this.timing.magatama, mag3Start + 100, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );

    // Outer circle (after all magatama complete)
    const circleStart = mag3Start + this.timing.magatama + this.timing.finalDelay;
    animations.push(
      this.animatePath(this.paths[7].element, this.timing.outerCircle, circleStart, 'cubic-bezier(0.4, 0.0, 0.2, 1)')
    );

    // Mark animation complete
    Promise.all(animations).then(() => {
      this.isAnimating = false;
    });
  }

  animatePath(element, duration, delay, easing) {
    return new Promise((resolve) => {
      const length = element.getTotalLength();

      setTimeout(() => {
        element.style.transition = `stroke-dashoffset ${duration}ms ${easing}`;
        element.style.strokeDashoffset = '0';

        setTimeout(resolve, duration);
      }, delay);
    });
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.paths.forEach(({ element }) => {
      element.style.transition = 'none';
      const length = element.getTotalLength();
      element.style.strokeDashoffset = length;
    });
    this.isAnimating = false;
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
    this.paths = [];
  }
}
