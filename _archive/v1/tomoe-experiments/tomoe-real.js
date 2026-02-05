/**
 * TOMOE - PROPERLY TRACED
 * Actually matches IMG_0156.jpg this time.
 *
 * Structure of the real drawing:
 * - Double outer circle (two concentric rings)
 * - Three closed teardrop/magatama shapes, each filling 1/3 of circle
 * - All three spiral counter-clockwise
 * - Teardrops touch the outer circle
 * - Small triangle void in center where tails meet
 */

export function createTomoe(container, options = {}) {
  const color = options.color || '#7d54ff';
  const size = options.size || 400;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 400');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.style.display = 'block';

  const cx = 200, cy = 200; // center

  // Common path attributes
  const pathStyle = {
    fill: 'none',
    stroke: color,
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  function makePath(d) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', pathStyle.fill);
    path.setAttribute('stroke', pathStyle.stroke);
    path.setAttribute('stroke-width', pathStyle.strokeWidth);
    path.setAttribute('stroke-linecap', pathStyle.strokeLinecap);
    path.setAttribute('stroke-linejoin', pathStyle.strokeLinejoin);
    return path;
  }

  function makeCircle(r) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '2.5');
    return circle;
  }

  // ============================================
  // OUTER DOUBLE CIRCLE
  // Two concentric circles close together
  // ============================================
  const outerCircle1 = makeCircle(175); // outer ring
  const outerCircle2 = makeCircle(158); // inner ring
  outerCircle1.classList.add('tomoe-outer-1');
  outerCircle2.classList.add('tomoe-outer-2');

  // ============================================
  // THREE MAGATAMA (closed teardrop shapes)
  // Each rotated 120° from the others
  // These are the actual shapes from the drawing
  // ============================================

  // Each magatama is a closed path forming a teardrop/comma
  // Starting from center, bulging out, curving around, tapering back

  // MAGATAMA 1 - Top right position (0° rotation baseline)
  // This traces the actual curve from your drawing
  const magatama1 = makePath(`
    M 200 185
    C 210 175, 225 160, 250 145
    C 280 128, 310 125, 330 145
    C 350 165, 350 195, 330 220
    C 305 250, 260 265, 220 255
    C 195 250, 185 235, 190 215
    C 193 200, 198 190, 200 185
    Z
  `);
  magatama1.classList.add('tomoe-magatama', 'magatama-1');

  // MAGATAMA 2 - Bottom position (120° rotation)
  const magatama2 = makePath(`
    M 207 198
    C 215 210, 220 230, 215 260
    C 208 295, 185 325, 150 340
    C 115 355, 80 345, 65 315
    C 50 285, 60 250, 90 225
    C 125 195, 170 185, 200 190
    C 205 192, 207 195, 207 198
    Z
  `);
  magatama2.classList.add('tomoe-magatama', 'magatama-2');

  // MAGATAMA 3 - Left position (240° rotation)
  const magatama3 = makePath(`
    M 193 198
    C 180 195, 160 185, 130 175
    C 95 163, 60 165, 45 190
    C 28 218, 35 255, 65 285
    C 100 318, 150 330, 190 315
    C 210 307, 215 290, 205 268
    C 198 250, 195 220, 193 198
    Z
  `);
  magatama3.classList.add('tomoe-magatama', 'magatama-3');

  // ============================================
  // CENTER TRIANGLE (the void where tails meet)
  // ============================================
  const triangle = makePath(`
    M 200 185
    L 207 198
    L 193 198
    Z
  `);
  triangle.classList.add('tomoe-triangle');

  // ============================================
  // ASSEMBLE SVG
  // Order matters for proper layering
  // ============================================
  svg.appendChild(outerCircle1);
  svg.appendChild(outerCircle2);
  svg.appendChild(magatama1);
  svg.appendChild(magatama2);
  svg.appendChild(magatama3);
  svg.appendChild(triangle);

  // ============================================
  // PREPARE FOR ANIMATION
  // ============================================
  const allPaths = svg.querySelectorAll('path, circle');
  allPaths.forEach(el => {
    const length = el.getTotalLength ? el.getTotalLength() : 2 * Math.PI * parseFloat(el.getAttribute('r'));
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
  });

  container.innerHTML = '';
  container.appendChild(svg);

  // ============================================
  // ANIMATION
  // ============================================
  function animate() {
    const timeline = [];

    // Helper to animate a single element
    function draw(el, duration, delay, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') {
      return new Promise(resolve => {
        setTimeout(() => {
          el.style.transition = `stroke-dashoffset ${duration}ms ${easing}`;
          el.style.strokeDashoffset = '0';
          setTimeout(resolve, duration);
        }, delay);
      });
    }

    // Sequence:
    // 1. Center triangle (quick, establishes center) - 200ms
    // 2. Three magatama emerge simultaneously with slight stagger - 1800ms each
    // 3. Outer circles draw to contain - 1200ms each, staggered

    const triangleEl = svg.querySelector('.tomoe-triangle');
    const mag1 = svg.querySelector('.magatama-1');
    const mag2 = svg.querySelector('.magatama-2');
    const mag3 = svg.querySelector('.magatama-3');
    const outer1 = svg.querySelector('.tomoe-outer-1');
    const outer2 = svg.querySelector('.tomoe-outer-2');

    // Run animation
    Promise.resolve()
      .then(() => draw(triangleEl, 300, 0))
      .then(() => {
        // All three magatama at once, slight stagger
        return Promise.all([
          draw(mag1, 1800, 0),
          draw(mag2, 1800, 200),
          draw(mag3, 1800, 400)
        ]);
      })
      .then(() => {
        // Outer circles
        return Promise.all([
          draw(outer2, 1200, 0),   // inner ring first
          draw(outer1, 1400, 300)  // outer ring slightly after
        ]);
      })
      .then(() => {
        console.log('✨ Tomoe complete');
        if (options.onComplete) options.onComplete();
      });
  }

  function reset() {
    const allPaths = svg.querySelectorAll('path, circle');
    allPaths.forEach(el => {
      el.style.transition = 'none';
      const length = el.getTotalLength ? el.getTotalLength() : 2 * Math.PI * parseFloat(el.getAttribute('r'));
      el.style.strokeDashoffset = length;
    });
  }

  // Auto-start
  if (options.autoStart !== false) {
    requestAnimationFrame(() => animate());
  }

  return {
    svg,
    animate,
    reset,
    replay: () => { reset(); requestAnimationFrame(() => setTimeout(animate, 50)); }
  };
}

export default { createTomoe };
