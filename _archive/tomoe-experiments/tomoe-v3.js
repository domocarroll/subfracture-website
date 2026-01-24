/**
 * TOMOE V3 - Clean geometric approach
 *
 * Structure based on careful observation of IMG_0156.jpg:
 * - Three magatama arranged 120° apart
 * - Each has a large circular head and thin tail
 * - Heads touch the inner circle
 * - Tails meet at center triangle
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

  const cx = 200, cy = 200;

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

  // Double outer circle
  const outerCircle = makeCircle(175, 'tomoe-outer-1');
  const innerCircle = makeCircle(155, 'tomoe-outer-2');

  // Center triangle - the small void at center
  const triangle = makePath(`
    M 200 180
    L 213 205
    L 187 205
    Z
  `, 'tomoe-triangle');

  // ============================================
  // MAGATAMA - Elongated teardrop shapes
  // Each follows the inner circle arc, then curves back to center
  // ============================================

  // MAGATAMA 1 - Upper right quadrant
  // Outer edge follows inner circle from ~11 o'clock to ~3 o'clock
  // Inner edge curves back to center
  const magatama1 = makePath(`
    M 200 180
    C 200 160, 220 130, 260 100
    C 300 70, 345 90, 345 140
    C 345 180, 310 220, 260 235
    C 230 245, 213 220, 213 205
    L 200 180
  `, 'magatama-1');

  // MAGATAMA 2 - Bottom section
  // Outer edge follows inner circle from ~3 o'clock to ~7 o'clock
  const magatama2 = makePath(`
    M 213 205
    C 235 215, 260 260, 255 310
    C 250 355, 200 375, 150 355
    C 100 335, 75 280, 100 240
    C 115 215, 160 205, 187 205
    L 213 205
  `, 'magatama-2');

  // MAGATAMA 3 - Left section
  // Head at ~9 o'clock, not upper-left
  const magatama3 = makePath(`
    M 187 205
    C 160 200, 110 185, 65 155
    C 30 130, 35 80, 70 60
    C 115 40, 170 60, 195 110
    C 205 140, 200 165, 200 180
    L 187 205
  `, 'magatama-3');

  // Assemble
  svg.appendChild(outerCircle);
  svg.appendChild(innerCircle);
  svg.appendChild(magatama1);
  svg.appendChild(magatama2);
  svg.appendChild(magatama3);
  svg.appendChild(triangle);

  // Add to DOM first
  container.innerHTML = '';
  container.appendChild(svg);

  // Animation setup
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

    Promise.resolve()
      .then(() => draw(tri, 200, 0))
      .then(() => Promise.all([
        draw(mag1, 1400, 0),
        draw(mag2, 1400, 120),
        draw(mag3, 1400, 240)
      ]))
      .then(() => Promise.all([
        draw(outer2, 900, 0),
        draw(outer1, 1100, 150)
      ]))
      .then(() => {
        console.log('✨ Tomoe complete');
        if (options.onComplete) options.onComplete();
      });
  }

  function reset() {
    allPaths.forEach(el => {
      el.style.transition = 'none';
      let length;
      if (el.tagName.toLowerCase() === 'circle') {
        const r = parseFloat(el.getAttribute('r'));
        length = 2 * Math.PI * r;
      } else {
        length = el.getTotalLength();
      }
      el.style.strokeDashoffset = length;
    });
  }

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
