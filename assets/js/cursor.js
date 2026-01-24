/**
 * SUBFRACTURE Custom Cursor System
 * A premium cursor experience with magnetic interactions
 *
 * Smooth, alive, never gimmicky—enhances without distracting
 */

// Cursor state
let cursor = {
  dot: null,
  ring: null,
  wrapper: null,
  mouse: { x: 0, y: 0 },
  dotPos: { x: 0, y: 0 },
  ringPos: { x: 0, y: 0 },
  magnetic: { x: 0, y: 0, active: false },
  isVisible: false,
  isClicking: false,
  currentState: 'default',
  rafId: null
};

// Configuration
const config = {
  dotLerp: 0.2,
  ringLerp: 0.1,
  magneticRadius: 50,
  magneticStrength: 0.3,
  clickScale: 0.85
};

/**
 * Linear interpolation helper
 */
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Calculate distance between two points
 */
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Get element center coordinates
 */
function getElementCenter(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

/**
 * Create cursor DOM elements
 */
function createCursorElements() {
  // Create wrapper
  cursor.wrapper = document.createElement('div');
  cursor.wrapper.className = 'sf-cursor';

  // Create dot
  cursor.dot = document.createElement('div');
  cursor.dot.className = 'sf-cursor__dot';

  // Create ring
  cursor.ring = document.createElement('div');
  cursor.ring.className = 'sf-cursor__ring';

  // Assemble
  cursor.wrapper.appendChild(cursor.dot);
  cursor.wrapper.appendChild(cursor.ring);
  document.body.appendChild(cursor.wrapper);
}

/**
 * Check if device supports hover (non-touch)
 */
function supportsHover() {
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Handle mouse movement
 */
function onMouseMove(e) {
  cursor.mouse.x = e.clientX;
  cursor.mouse.y = e.clientY;

  if (!cursor.isVisible) {
    cursor.isVisible = true;
    cursor.wrapper.classList.add('sf-cursor--visible');

    // Initialize positions to prevent jump on first appearance
    cursor.dotPos.x = cursor.mouse.x;
    cursor.dotPos.y = cursor.mouse.y;
    cursor.ringPos.x = cursor.mouse.x;
    cursor.ringPos.y = cursor.mouse.y;
  }
}

/**
 * Handle mouse leave (cursor exits viewport)
 */
function onMouseLeave() {
  cursor.isVisible = false;
  cursor.wrapper.classList.remove('sf-cursor--visible');
}

/**
 * Handle mouse enter (cursor enters viewport)
 */
function onMouseEnter(e) {
  cursor.mouse.x = e.clientX;
  cursor.mouse.y = e.clientY;
  cursor.isVisible = true;
  cursor.wrapper.classList.add('sf-cursor--visible');
}

/**
 * Handle mousedown for click feedback
 */
function onMouseDown() {
  cursor.isClicking = true;
  cursor.wrapper.classList.add('sf-cursor--clicking');
}

/**
 * Handle mouseup
 */
function onMouseUp() {
  cursor.isClicking = false;
  cursor.wrapper.classList.remove('sf-cursor--clicking');
}

/**
 * Set cursor state
 */
function setCursorState(state) {
  if (cursor.currentState === state) return;

  // Remove previous state
  cursor.wrapper.classList.remove(`sf-cursor--${cursor.currentState}`);

  // Add new state
  cursor.currentState = state;
  if (state !== 'default') {
    cursor.wrapper.classList.add(`sf-cursor--${state}`);
  }
}

/**
 * Handle element hover detection
 */
function onMouseOver(e) {
  const target = e.target;

  // Check for video cursor
  if (target.closest('[data-cursor="video"]') || target.closest('.hero__media')) {
    setCursorState('video');
    return;
  }

  // Check for link cursor
  if (target.closest('a') ||
      target.closest('button') ||
      target.closest('[data-cursor="link"]') ||
      target.closest('.magnetic')) {
    setCursorState('link');
    return;
  }

  // Default state
  setCursorState('default');
}

/**
 * Calculate magnetic pull effect
 */
function calculateMagnetic() {
  cursor.magnetic.active = false;
  cursor.magnetic.x = 0;
  cursor.magnetic.y = 0;

  // Get all magnetic elements
  const magneticElements = document.querySelectorAll('.magnetic, a, button');

  for (const element of magneticElements) {
    // Skip hidden elements
    if (element.offsetParent === null) continue;

    const center = getElementCenter(element);
    const distance = getDistance(cursor.mouse.x, cursor.mouse.y, center.x, center.y);

    if (distance < config.magneticRadius) {
      cursor.magnetic.active = true;

      // Calculate pull strength (stronger when closer)
      const strength = (1 - distance / config.magneticRadius) * config.magneticStrength;

      // Calculate pull direction
      cursor.magnetic.x = (center.x - cursor.mouse.x) * strength;
      cursor.magnetic.y = (center.y - cursor.mouse.y) * strength;

      // Only apply strongest magnetic effect (closest element)
      break;
    }
  }
}

/**
 * Animation loop
 */
function animate() {
  // Calculate magnetic effect
  calculateMagnetic();

  // Target position (with magnetic offset)
  const targetX = cursor.mouse.x + cursor.magnetic.x;
  const targetY = cursor.mouse.y + cursor.magnetic.y;

  // Interpolate dot position (faster)
  cursor.dotPos.x = lerp(cursor.dotPos.x, targetX, config.dotLerp);
  cursor.dotPos.y = lerp(cursor.dotPos.y, targetY, config.dotLerp);

  // Interpolate ring position (slower, more fluid)
  cursor.ringPos.x = lerp(cursor.ringPos.x, targetX, config.ringLerp);
  cursor.ringPos.y = lerp(cursor.ringPos.y, targetY, config.ringLerp);

  // Apply transforms (GPU accelerated)
  cursor.dot.style.transform = `translate3d(${cursor.dotPos.x}px, ${cursor.dotPos.y}px, 0)`;
  cursor.ring.style.transform = `translate3d(${cursor.ringPos.x}px, ${cursor.ringPos.y}px, 0)`;

  // Continue animation loop
  cursor.rafId = requestAnimationFrame(animate);
}

/**
 * Bind event listeners
 */
function bindEvents() {
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('mouseenter', onMouseEnter);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mouseover', onMouseOver, { passive: true });
}

/**
 * Unbind event listeners (cleanup)
 */
function unbindEvents() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseleave', onMouseLeave);
  document.removeEventListener('mouseenter', onMouseEnter);
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mouseover', onMouseOver);
}

/**
 * Destroy cursor (cleanup)
 */
export function destroyCursor() {
  if (cursor.rafId) {
    cancelAnimationFrame(cursor.rafId);
  }

  unbindEvents();

  if (cursor.wrapper && cursor.wrapper.parentNode) {
    cursor.wrapper.parentNode.removeChild(cursor.wrapper);
  }

  document.documentElement.classList.remove('has-custom-cursor');

  // Reset state
  cursor = {
    dot: null,
    ring: null,
    wrapper: null,
    mouse: { x: 0, y: 0 },
    dotPos: { x: 0, y: 0 },
    ringPos: { x: 0, y: 0 },
    magnetic: { x: 0, y: 0, active: false },
    isVisible: false,
    isClicking: false,
    currentState: 'default',
    rafId: null
  };
}

/**
 * Initialize custom cursor
 */
export function initCursor() {
  // Only initialize on devices that support hover (non-touch)
  if (!supportsHover()) {
    return;
  }

  // Create DOM elements
  createCursorElements();

  // Add indicator class to html
  document.documentElement.classList.add('has-custom-cursor');

  // Bind events
  bindEvents();

  // Start animation loop
  animate();

  return {
    destroy: destroyCursor
  };
}

export default initCursor;
