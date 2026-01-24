/**
 * TOMOE SELF-DRAWING ANIMATION v2
 * Rebuilt with soul - hand-drawn feel, center-outward flow, organic timing
 */

const COLORS = {
  primary: '#7d54ff',
  white: '#ffffff'
};

/**
 * Add subtle wobble to a path point for hand-drawn feel
 */
function wobble(value, amount = 2) {
  return value + (Math.random() - 0.5) * amount;
}

/**
 * Creates the Tomoe SVG with hand-drawn imperfection
 * Sequence: center triangle is part of the spiral origins, not separate
 */
function createTomoeSVG(options = {}) {
  const color = options.color || COLORS.primary;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.overflow = 'visible';

  // Create all paths with slight hand-drawn wobble
  const paths = [];

  // THREE MAGATAMA (comma spirals) - these are the soul of the Tomoe
  // Each starts from center and spirals outward
  // Slight variation in each for organic feel

  // Spiral 1 - flows to upper right
  const spiral1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  spiral1.setAttribute('d', `
    M ${wobble(150, 1)} ${wobble(150, 1)}
    C ${wobble(148)} ${wobble(125)}, ${wobble(152)} ${wobble(95)}, ${wobble(178)} ${wobble(72)}
    C ${wobble(198)} ${wobble(56)}, ${wobble(222)} ${wobble(52)}, ${wobble(236)} ${wobble(67)}
    C ${wobble(247)} ${wobble(80)}, ${wobble(248)} ${wobble(98)}, ${wobble(240)} ${wobble(118)}
    C ${wobble(230)} ${wobble(145)}, ${wobble(200)} ${wobble(165)}, ${wobble(170)} ${wobble(160)}
    C ${wobble(155)} ${wobble(158)}, ${wobble(150)} ${wobble(155)}, ${wobble(150)} ${wobble(150)}
  `);
  spiral1.setAttribute('class', 'tomoe-spiral spiral-1');
  spiral1.dataset.duration = '1.9';
  paths.push(spiral1);

  // Spiral 2 - flows to lower left (rotated 120°)
  const spiral2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  spiral2.setAttribute('d', `
    M ${wobble(150, 1)} ${wobble(150, 1)}
    C ${wobble(168)} ${wobble(162)}, ${wobble(185)} ${wobble(185)}, ${wobble(175)} ${wobble(215)}
    C ${wobble(168)} ${wobble(238)}, ${wobble(148)} ${wobble(252)}, ${wobble(125)} ${wobble(250)}
    C ${wobble(105)} ${wobble(248)}, ${wobble(90)} ${wobble(235)}, ${wobble(88)} ${wobble(212)}
    C ${wobble(86)} ${wobble(182)}, ${wobble(105)} ${wobble(158)}, ${wobble(135)} ${wobble(155)}
    C ${wobble(145)} ${wobble(152)}, ${wobble(150)} ${wobble(150)}, ${wobble(150)} ${wobble(150)}
  `);
  spiral2.setAttribute('class', 'tomoe-spiral spiral-2');
  spiral2.dataset.duration = '2.1';
  paths.push(spiral2);

  // Spiral 3 - flows to lower right (rotated 240°)
  const spiral3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  spiral3.setAttribute('d', `
    M ${wobble(150, 1)} ${wobble(150, 1)}
    C ${wobble(135)} ${wobble(162)}, ${wobble(108)} ${wobble(178)}, ${wobble(78)} ${wobble(168)}
    C ${wobble(55)} ${wobble(160)}, ${wobble(42)} ${wobble(140)}, ${wobble(48)} ${wobble(118)}
    C ${wobble(54)} ${wobble(98)}, ${wobble(72)} ${wobble(82)}, ${wobble(95)} ${wobble(80)}
    C ${wobble(125)} ${wobble(78)}, ${wobble(145)} ${wobble(100)}, ${wobble(148)} ${wobble(130)}
    C ${wobble(149)} ${wobble(142)}, ${wobble(150)} ${wobble(148)}, ${wobble(150)} ${wobble(150)}
  `);
  spiral3.setAttribute('class', 'tomoe-spiral spiral-3');
  spiral3.dataset.duration = '2.0';
  paths.push(spiral3);

  // OUTER CIRCLE - draws last, contains the energy
  // Slight imperfection - not a perfect circle
  const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  // Draw as path, not circle, so we can add wobble and control draw direction
  const r = 138;
  const cx = 150, cy = 150;
  outerCircle.setAttribute('d', `
    M ${cx} ${cy - r}
    C ${cx + r * 0.55 + wobble(0, 3)} ${cy - r + wobble(0, 2)},
      ${cx + r + wobble(0, 2)} ${cy - r * 0.55 + wobble(0, 3)},
      ${cx + r} ${cy}
    C ${cx + r + wobble(0, 2)} ${cy + r * 0.55 + wobble(0, 3)},
      ${cx + r * 0.55 + wobble(0, 3)} ${cy + r + wobble(0, 2)},
      ${cx} ${cy + r}
    C ${cx - r * 0.55 + wobble(0, 3)} ${cy + r + wobble(0, 2)},
      ${cx - r + wobble(0, 2)} ${cy + r * 0.55 + wobble(0, 3)},
      ${cx - r} ${cy}
    C ${cx - r + wobble(0, 2)} ${cy - r * 0.55 + wobble(0, 3)},
      ${cx - r * 0.55 + wobble(0, 3)} ${cy - r + wobble(0, 2)},
      ${cx} ${cy - r}
  `);
  outerCircle.setAttribute('class', 'tomoe-outer');
  outerCircle.dataset.duration = '1.4';
  paths.push(outerCircle);

  // Apply common styles to all paths
  paths.forEach(path => {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  });

  return svg;
}

/**
 * Prepare a path for drawing animation
 */
function preparePath(path) {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.opacity = '1';
}

/**
 * Animate a single path with organic easing
 * Returns a promise that resolves when complete
 */
function drawPath(path, duration) {
  return new Promise(resolve => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;

    // Use CSS transition with custom easing
    // This curve: slow start (pen touching), faster middle, gentle end
    path.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0.0, 0.2, 1)`;

    // Trigger the animation
    requestAnimationFrame(() => {
      path.style.strokeDashoffset = '0';
    });

    setTimeout(resolve, duration * 1000);
  });
}

/**
 * Main animation sequence
 * Center-outward flow: spirals emerge first, then circle contains
 */
async function animate(svg, options = {}) {
  const spirals = svg.querySelectorAll('.tomoe-spiral');
  const outer = svg.querySelector('.tomoe-outer');

  // Prepare all paths (hidden, ready to draw)
  spirals.forEach(preparePath);
  preparePath(outer);

  // Small pause before we begin - the breath before creation
  await sleep(200);

  // PHASE 1: Three spirals emerge from center simultaneously
  // But each with slightly different timing for organic feel
  const spiralPromises = Array.from(spirals).map(spiral => {
    const duration = parseFloat(spiral.dataset.duration);
    return drawPath(spiral, duration);
  });

  // Wait for all spirals to complete
  await Promise.all(spiralPromises);

  // Small breath between phases
  await sleep(150);

  // PHASE 2: Outer circle draws to contain the energy
  const outerDuration = parseFloat(outer.dataset.duration);
  await drawPath(outer, outerDuration);

  // Complete. No pulse. Just stillness.
  // The drawing is enough.

  console.log('✨ Tomoe complete — cycles revealed');

  if (options.onComplete) {
    options.onComplete();
  }
}

/**
 * Simple sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reset animation to beginning
 */
function reset(svg) {
  const allPaths = svg.querySelectorAll('path');
  allPaths.forEach(path => {
    path.style.transition = 'none';
    preparePath(path);
  });
}

/**
 * PUBLIC: Initialize Tomoe in a container
 */
export function init(container, options = {}) {
  const svg = createTomoeSVG(options);
  container.innerHTML = '';
  container.appendChild(svg);

  // Auto-start unless disabled
  if (options.autoStart !== false) {
    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      animate(svg, options);
    });
  }

  return {
    svg,
    replay: () => {
      reset(svg);
      // Force reflow
      void svg.offsetWidth;
      requestAnimationFrame(() => {
        animate(svg, options);
      });
    },
    play: () => animate(svg, options)
  };
}

/**
 * PUBLIC: Clean up
 */
export function destroy(container) {
  container.innerHTML = '';
}

export default { init, destroy };
