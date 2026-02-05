/**
 * TOMOE-ACCURATE.JS
 * Carefully traced from IMG_0156.jpg
 *
 * Key observations from the source drawing:
 * - Three magatama with LARGE bulbous heads (nearly circular)
 * - Thin curved tails flowing to center
 * - Heads touch the inner ring of the double circle
 * - Small triangular void at center where tails meet
 * - Counter-clockwise flow
 */

export function createTomoe(container, options = {}) {
  const color = options.color || '#7d54ff';
  const size = options.size || 400;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 400 400');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.style.display = 'block';

  // Center point
  const cx = 200, cy = 200;

  // Path helper
  function makePath(d, className) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '2.5');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    if (className) path.classList.add(className);
    return path;
  }

  function makeCircle(r, className) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '2.5');
    if (className) circle.classList.add(className);
    return circle;
  }

  // ============================================
  // DOUBLE OUTER CIRCLE
  // ============================================
  const outerCircle = makeCircle(175, 'tomoe-outer-1');
  const innerCircle = makeCircle(155, 'tomoe-outer-2');

  // ============================================
  // CENTER TRIANGLE (the void where tails meet)
  // Small triangle at center - vertices at ~(200,180), (215,205), (185,205)
  // ============================================
  const triangle = makePath(`
    M 200 178
    L 216 206
    L 184 206
    Z
  `, 'tomoe-triangle');

  // ============================================
  // THREE MAGATAMA - Traced from IMG_0156.jpg
  //
  // Each magatama has:
  // - Large nearly-circular head (~80-90px diameter)
  // - Thin tail flowing to center triangle vertex
  // - Counter-clockwise arrangement
  // ============================================

  // MAGATAMA 1 - UPPER RIGHT
  // Head center ~(290, 110), bulging into upper-right
  // Outer edge touches inner circle at top-right
  // Tail emerges from bottom-left of head, curves to triangle top vertex
  const magatama1 = makePath(`
    M 200 178
    C 195 160, 200 130, 225 100
    C 255 65, 295 50, 330 65
    C 360 80, 370 115, 355 150
    C 340 185, 305 210, 260 220
    C 230 228, 215 218, 216 206
    L 200 178
    Z
  `, 'magatama-1');

  // MAGATAMA 2 - BOTTOM
  // Head center ~(195, 320), bulging into bottom area
  // Outer edge touches inner circle at bottom
  // Tail emerges from top of head, curves to triangle right vertex
  const magatama2 = makePath(`
    M 216 206
    C 230 220, 250 250, 255 290
    C 260 330, 240 360, 200 370
    C 155 380, 110 355, 90 315
    C 75 280, 80 245, 105 220
    C 130 195, 165 195, 184 206
    L 216 206
    Z
  `, 'magatama-2');

  // MAGATAMA 3 - LEFT
  // Head center ~(75, 175), bulging into left side
  // Outer edge touches inner circle on left
  // Tail emerges from right of head, curves down to triangle left vertex
  const magatama3 = makePath(`
    M 184 206
    C 165 190, 130 165, 95 145
    C 55 120, 40 90, 50 60
    C 65 30, 105 25, 145 45
    C 185 65, 205 105, 205 145
    C 205 165, 200 178, 200 178
    L 184 206
    Z
  `, 'magatama-3');

  // ============================================
  // ASSEMBLE
  // ============================================
  svg.appendChild(outerCircle);
  svg.appendChild(innerCircle);
  svg.appendChild(magatama1);
  svg.appendChild(magatama2);
  svg.appendChild(magatama3);
  svg.appendChild(triangle);

  // Add to DOM FIRST (required for getTotalLength to work)
  container.innerHTML = '';
  container.appendChild(svg);

  // ============================================
  // ANIMATION SETUP (must be after DOM insertion)
  // ============================================
  const allPaths = svg.querySelectorAll('path, circle');
  allPaths.forEach(el => {
    let length;
    if (el.tagName.toLowerCase() === 'circle') {
      const r = parseFloat(el.getAttribute('r'));
      length = 2 * Math.PI * r;
    } else {
      length = el.getTotalLength();
    }
    el.style.strokeDasharray = length;
    el.style.strokeDashoffset = length;
  });

  // ============================================
  // ANIMATION FUNCTIONS
  // ============================================
  function draw(el, duration, delay, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') {
    return new Promise(resolve => {
      setTimeout(() => {
        el.style.transition = `stroke-dashoffset ${duration}ms ${easing}`;
        el.style.strokeDashoffset = '0';
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  function animate() {
    const tri = svg.querySelector('.tomoe-triangle');
    const mag1 = svg.querySelector('.magatama-1');
    const mag2 = svg.querySelector('.magatama-2');
    const mag3 = svg.querySelector('.magatama-3');
    const outer1 = svg.querySelector('.tomoe-outer-1');
    const outer2 = svg.querySelector('.tomoe-outer-2');

    // Sequence:
    // 1. Triangle appears (200ms)
    // 2. Three magatama draw simultaneously with stagger (1600ms each)
    // 3. Double circle draws (1200ms)

    Promise.resolve()
      .then(() => draw(tri, 200, 0))
      .then(() => Promise.all([
        draw(mag1, 1600, 0),
        draw(mag2, 1600, 150),
        draw(mag3, 1600, 300)
      ]))
      .then(() => Promise.all([
        draw(outer2, 1000, 0),
        draw(outer1, 1200, 200)
      ]))
      .then(() => {
        console.log('✨ Tomoe complete');
        if (options.onComplete) options.onComplete();
      });
  }

  function reset() {
    allPaths.forEach(el => {
      el.style.transition = 'none';
      if (el.getTotalLength) {
        el.style.strokeDashoffset = el.getTotalLength();
      } else {
        const r = parseFloat(el.getAttribute('r'));
        el.style.strokeDashoffset = 2 * Math.PI * r;
      }
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
    replay: () => {
      reset();
      requestAnimationFrame(() => setTimeout(animate, 50));
    }
  };
}

export default { createTomoe };
