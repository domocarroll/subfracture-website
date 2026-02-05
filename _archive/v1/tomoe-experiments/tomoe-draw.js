/**
 * TOMOE SELF-DRAWING ANIMATION
 * Subfracture's hero symbol - three-way spiral representing cycles and flow
 */

// Brand colors
const COLORS = {
  primary: '#7d54ff',
  background: '#0a0014',
  white: '#ffffff'
};

// Animation timings (in seconds)
const TIMING = {
  outerCircle: 1.2,
  spirals: 2.0,
  triangle: 0.4,
  pulseDelay: 0.3
};

/**
 * Creates the Tomoe SVG with precise paths traced from the source drawing
 */
function createTomoeSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Outer circle
  const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerCircle.setAttribute('cx', '150');
  outerCircle.setAttribute('cy', '150');
  outerCircle.setAttribute('r', '140');
  outerCircle.setAttribute('fill', 'none');
  outerCircle.setAttribute('stroke', COLORS.primary);
  outerCircle.setAttribute('stroke-width', '2.5');
  outerCircle.setAttribute('class', 'tomoe-outer');

  // Three comma/teardrop shapes (magatama) - each rotated 120 degrees
  const spiral1 = createMagatama(0);
  const spiral2 = createMagatama(120);
  const spiral3 = createMagatama(240);

  // Center triangle - small but distinct
  const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  triangle.setAttribute('d', 'M 150 140 L 158 156 L 142 156 Z');
  triangle.setAttribute('fill', 'none');
  triangle.setAttribute('stroke', COLORS.primary);
  triangle.setAttribute('stroke-width', '2.5');
  triangle.setAttribute('stroke-linejoin', 'round');
  triangle.setAttribute('class', 'tomoe-triangle');

  // Glow filter for pulse effect
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  filter.setAttribute('id', 'tomoe-glow');
  filter.innerHTML = `
    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  `;
  defs.appendChild(filter);
  svg.appendChild(defs);

  // Assemble SVG
  svg.appendChild(outerCircle);
  svg.appendChild(spiral1);
  svg.appendChild(spiral2);
  svg.appendChild(spiral3);
  svg.appendChild(triangle);

  return svg;
}

/**
 * Creates a single magatama (comma/teardrop spiral) shape
 * Rotated around center point
 * Hand-traced to match the organic flow of the source drawing
 */
function createMagatama(rotationDegrees) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('transform', `rotate(${rotationDegrees} 150 150)`);
  g.setAttribute('class', 'tomoe-spiral');

  // The magatama is a teardrop/comma shape that spirals outward from center
  // Outer edge - starts from center, curves out to the tail, then back in
  const outer = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  outer.setAttribute('d', `
    M 150 150
    C 150 120, 155 90, 180 70
    C 200 55, 225 50, 238 65
    C 248 78, 250 95, 243 115
    C 235 140, 215 160, 185 168
    C 165 173, 150 168, 150 150
    Z
  `);
  outer.setAttribute('fill', 'none');
  outer.setAttribute('stroke', COLORS.primary);
  outer.setAttribute('stroke-width', '2.5');
  outer.setAttribute('stroke-linejoin', 'round');
  outer.setAttribute('stroke-linecap', 'round');

  // Inner curve - creates the hollow center of the comma
  const inner = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  inner.setAttribute('d', `
    M 165 152
    C 165 125, 170 100, 188 85
    C 205 73, 220 72, 228 82
    C 235 92, 235 105, 230 120
    C 223 138, 208 150, 188 155
    C 175 158, 165 156, 165 152
    Z
  `);
  inner.setAttribute('fill', 'none');
  inner.setAttribute('stroke', COLORS.primary);
  inner.setAttribute('stroke-width', '2.5');
  inner.setAttribute('stroke-linejoin', 'round');
  inner.setAttribute('stroke-linecap', 'round');

  g.appendChild(outer);
  g.appendChild(inner);

  return g;
}

/**
 * Calculates total path length for an element
 */
function getPathLength(element) {
  if (element.getTotalLength) {
    return element.getTotalLength();
  }

  // For groups, sum all children
  let total = 0;
  const paths = element.querySelectorAll('path, circle');
  paths.forEach(path => {
    if (path.getTotalLength) {
      total += path.getTotalLength();
    }
  });
  return total;
}

/**
 * Sets up stroke-dasharray/dashoffset for drawing animation
 */
function preparePath(element) {
  if (element.getTotalLength) {
    const length = element.getTotalLength();
    element.style.strokeDasharray = length;
    element.style.strokeDashoffset = length;
  } else {
    // For groups, prepare all children
    const paths = element.querySelectorAll('path, circle');
    paths.forEach(path => {
      if (path.getTotalLength) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      }
    });
  }
}

/**
 * Animates a path being drawn with organic easing
 */
function animatePath(element, duration, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (element.getTotalLength) {
        element.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`;
        element.style.strokeDashoffset = '0';
        setTimeout(resolve, duration * 1000);
      } else {
        // For groups, animate all children simultaneously
        const paths = element.querySelectorAll('path, circle');
        paths.forEach(path => {
          if (path.getTotalLength) {
            path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`;
            path.style.strokeDashoffset = '0';
          }
        });
        setTimeout(resolve, duration * 1000);
      }
    }, delay * 1000);
  });
}

/**
 * Creates subtle pulse/glow effect after drawing completes
 */
function createPulseEffect(svg) {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes tomoe-pulse {
      0%, 100% {
        filter: drop-shadow(0 0 3px ${COLORS.primary}55);
        opacity: 1;
      }
      50% {
        filter: drop-shadow(0 0 8px ${COLORS.primary}88);
        opacity: 0.95;
      }
    }

    .tomoe-pulsing {
      animation: tomoe-pulse 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    svg.classList.add('tomoe-pulsing');
  }, TIMING.pulseDelay * 1000);
}

/**
 * Main animation sequence
 */
async function animateDrawing(svg, options = {}) {
  const outer = svg.querySelector('.tomoe-outer');
  const spirals = svg.querySelectorAll('.tomoe-spiral');
  const triangle = svg.querySelector('.tomoe-triangle');

  // Prepare all paths for animation
  preparePath(outer);
  spirals.forEach(spiral => preparePath(spiral));
  preparePath(triangle);

  // Sequence:
  // 1. Draw outer circle
  await animatePath(outer, TIMING.outerCircle);

  // 2. Draw three spirals simultaneously (emerging from center)
  await Promise.all([
    animatePath(spirals[0], TIMING.spirals),
    animatePath(spirals[1], TIMING.spirals),
    animatePath(spirals[2], TIMING.spirals)
  ]);

  // 3. Draw center triangle
  await animatePath(triangle, TIMING.triangle);

  // 4. Start pulse effect
  createPulseEffect(svg);

  // Notify completion
  if (options.onComplete) {
    options.onComplete();
  }
}

/**
 * PUBLIC API: Initialize Tomoe animation in a container
 * @param {HTMLElement} container - DOM element to render into
 * @param {Object} options - Configuration options
 * @param {Function} options.onComplete - Callback when animation finishes
 * @param {String} options.color - Override primary color (default: #7d54ff)
 * @param {Boolean} options.autoStart - Auto-start animation (default: true)
 * @returns {Object} - API object with svg and replay method
 */
export function initTomoe(container, options = {}) {
  // Apply custom color if provided
  if (options.color) {
    const originalColor = COLORS.primary;
    COLORS.primary = options.color;
  }

  const svg = createTomoeSVG();
  container.innerHTML = '';
  container.appendChild(svg);

  const autoStart = options.autoStart !== false;

  // Start animation
  if (autoStart) {
    requestAnimationFrame(() => {
      animateDrawing(svg, options);
    });
  }

  return {
    svg,
    replay: () => {
      // Reset all paths before replaying
      const outer = svg.querySelector('.tomoe-outer');
      const spirals = svg.querySelectorAll('.tomoe-spiral');
      const triangle = svg.querySelector('.tomoe-triangle');

      preparePath(outer);
      spirals.forEach(spiral => preparePath(spiral));
      preparePath(triangle);

      // Remove pulsing class
      svg.classList.remove('tomoe-pulsing');

      // Start animation again
      requestAnimationFrame(() => {
        animateDrawing(svg, options);
      });
    },
    play: () => {
      if (!autoStart) {
        animateDrawing(svg, options);
      }
    }
  };
}

/**
 * PUBLIC API: Clean up animation
 */
export function destroyTomoe(container) {
  container.innerHTML = '';
}

export default {
  initTomoe,
  destroyTomoe
};
