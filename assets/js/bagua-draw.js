/**
 * BAGUA SELF-DRAWING ANIMATION
 *
 * The ancient symbol of balance, revealing itself line by line.
 * Center to periphery, simplicity to complexity, the way all systems grow.
 */

export class BaguaDraw {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    this.options = {
      size: options.size || 500,
      strokeColor: options.strokeColor || '#7d54ff',
      strokeWidth: options.strokeWidth || 2.5,
      backgroundColor: options.backgroundColor || 'transparent',
      autoStart: options.autoStart !== false,
      onComplete: options.onComplete || null,
      enableRotation: options.enableRotation !== false
    };

    this.svg = null;
    this.elements = {};
    this.timeline = null;
    this.rotationAnimation = null;
  }

  init() {
    this._createSVG();
    this._createElements();
    if (this.options.autoStart) {
      this.start();
    }
    return this;
  }

  _createSVG() {
    const { size, backgroundColor } = this.options;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('viewBox', '0 0 500 500');
    this.svg.setAttribute('width', size);
    this.svg.setAttribute('height', size);
    this.svg.style.display = 'block';

    if (backgroundColor !== 'transparent') {
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '500');
      bg.setAttribute('height', '500');
      bg.setAttribute('fill', backgroundColor);
      this.svg.appendChild(bg);
    }

    this.container.appendChild(this.svg);
  }

  _createElements() {
    const { strokeColor, strokeWidth } = this.options;
    const center = 250;
    const yinYangRadius = 80;

    // Group for yin-yang
    const yinYangGroup = this._createGroup('yinyang');

    // Yin-yang S-curve (the defining moment)
    const sCurve = this._createPath(
      `M ${center},${center - yinYangRadius}
       Q ${center + 40},${center - 40} ${center},${center}
       Q ${center - 40},${center + 40} ${center},${center + yinYangRadius}`,
      { id: 's-curve', group: yinYangGroup }
    );

    // Yin-yang outer circle
    const outerCircle = this._createPath(
      `M ${center},${center - yinYangRadius}
       A ${yinYangRadius},${yinYangRadius} 0 1,1 ${center},${center + yinYangRadius}
       A ${yinYangRadius},${yinYangRadius} 0 1,1 ${center},${center - yinYangRadius}`,
      { id: 'outer-circle', group: yinYangGroup }
    );

    // Upper dot (yang within yin)
    const upperDot = this._createCircle(center, center - 40, 8, {
      id: 'upper-dot',
      fill: strokeColor,
      group: yinYangGroup
    });

    // Lower dot (yin within yang)
    const lowerDot = this._createCircle(center, center + 40, 8, {
      id: 'lower-dot',
      fill: strokeColor,
      group: yinYangGroup
    });

    // Inner octagon (the frame that contains)
    const innerOctagon = this._createOctagon(center, 130, 'inner-octagon');

    // Eight trigrams (the I-Ching encoded in geometry)
    const trigramGroup = this._createGroup('trigrams');
    this._createTrigrams(center, trigramGroup);

    // Outer octagon (the boundary that completes)
    const outerOctagon = this._createOctagon(center, 190, 'outer-octagon');

    // Store references
    this.elements = {
      yinYangGroup,
      sCurve,
      outerCircle,
      upperDot,
      lowerDot,
      innerOctagon,
      trigramGroup,
      outerOctagon
    };
  }

  _createGroup(id) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', id);
    this.svg.appendChild(group);
    return group;
  }

  _createPath(d, options = {}) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', options.fill || 'none');
    path.setAttribute('stroke', options.stroke || this.options.strokeColor);
    path.setAttribute('stroke-width', options.strokeWidth || this.options.strokeWidth);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    if (options.id) path.setAttribute('id', options.id);

    const target = options.group || this.svg;
    target.appendChild(path);

    return path;
  }

  _createCircle(cx, cy, r, options = {}) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', options.fill || 'none');
    circle.setAttribute('stroke', options.stroke || this.options.strokeColor);
    circle.setAttribute('stroke-width', options.strokeWidth || this.options.strokeWidth);

    if (options.id) circle.setAttribute('id', options.id);

    const target = options.group || this.svg;
    target.appendChild(circle);

    return circle;
  }

  _createOctagon(centerX, radius, id) {
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI / 4) * i - Math.PI / 8;
      const x = centerX + radius * Math.cos(angle);
      const y = centerX + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const d = `M ${points[0]} L ${points.slice(1).join(' L ')} Z`;
    return this._createPath(d, { id });
  }

  _createTrigrams(center, group) {
    // The eight trigrams of the I-Ching, each positioned around the octagon
    const trigramConfigs = [
      { angle: 0, lines: [1, 1, 1] },        // Heaven (☰) - top
      { angle: 45, lines: [0, 1, 1] },       // Wind (☴) - top-right
      { angle: 90, lines: [1, 0, 1] },       // Fire (☲) - right
      { angle: 135, lines: [1, 1, 0] },      // Earth (☷) - bottom-right
      { angle: 180, lines: [0, 0, 0] },      // Earth (☷) - bottom
      { angle: 225, lines: [0, 0, 1] },      // Mountain (☶) - bottom-left
      { angle: 270, lines: [0, 1, 0] },      // Water (☵) - left
      { angle: 315, lines: [1, 0, 0] }       // Thunder (☳) - top-left
    ];

    const trigramRadius = 160;
    const lineLength = 25;
    const lineSpacing = 8;
    const lineThickness = 6;

    trigramConfigs.forEach((config, index) => {
      const angleRad = (config.angle - 90) * Math.PI / 180;
      const trigramX = center + trigramRadius * Math.cos(angleRad);
      const trigramY = center + trigramRadius * Math.sin(angleRad);

      const trigramGroup = this._createGroup(`trigram-${index}`);
      trigramGroup.style.opacity = '0';
      group.appendChild(trigramGroup);

      // Draw three lines (or broken lines)
      config.lines.forEach((solid, lineIndex) => {
        const yOffset = (lineIndex - 1) * lineSpacing;

        if (solid) {
          // Solid line
          const line = this._createPath(
            `M ${trigramX - lineLength/2},${trigramY + yOffset}
             L ${trigramX + lineLength/2},${trigramY + yOffset}`,
            {
              strokeWidth: lineThickness,
              group: trigramGroup
            }
          );
        } else {
          // Broken line (two short segments)
          const gap = 6;
          const segmentLength = (lineLength - gap) / 2;

          this._createPath(
            `M ${trigramX - lineLength/2},${trigramY + yOffset}
             L ${trigramX - lineLength/2 + segmentLength},${trigramY + yOffset}`,
            {
              strokeWidth: lineThickness,
              group: trigramGroup
            }
          );

          this._createPath(
            `M ${trigramX + lineLength/2 - segmentLength},${trigramY + yOffset}
             L ${trigramX + lineLength/2},${trigramY + yOffset}`,
            {
              strokeWidth: lineThickness,
              group: trigramGroup
            }
          );
        }
      });

      this.elements[`trigram-${index}`] = trigramGroup;
    });
  }

  _getPathLength(path) {
    return path.getTotalLength();
  }

  _preparePath(path) {
    const length = this._getPathLength(path);
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    return length;
  }

  start() {
    // Set up all paths for drawing animation
    const sCurveLength = this._preparePath(this.elements.sCurve);
    const circleLength = this._preparePath(this.elements.outerCircle);
    const innerOctLength = this._preparePath(this.elements.innerOctagon);
    const outerOctLength = this._preparePath(this.elements.outerOctagon);

    // Hide dots initially
    this.elements.upperDot.style.opacity = '0';
    this.elements.lowerDot.style.opacity = '0';

    // Create GSAP timeline
    if (!window.gsap) {
      console.error('GSAP not loaded. Please include GSAP library.');
      return;
    }

    this.timeline = gsap.timeline({
      onComplete: () => {
        if (this.options.onComplete) {
          this.options.onComplete();
        }
        if (this.options.enableRotation) {
          this._startRotation();
        }
        console.log('✨ Bagua drawing complete - balance achieved');
      }
    });

    // Animation sequence: meditation in motion
    this.timeline
      // 1. The S-curve - the heart of duality
      .to(this.elements.sCurve, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      // Outer circle completes the yin-yang
      .to(this.elements.outerCircle, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power1.inOut'
      }, '-=0.4')
      // 2. The dots appear - unity within duality
      .to([this.elements.upperDot, this.elements.lowerDot], {
        opacity: 1,
        duration: 0.4,
        stagger: 0.15,
        ease: 'power2.out'
      })
      // 3. Inner octagon - the first container
      .to(this.elements.innerOctagon, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power1.inOut'
      }, '-=0.1')
      // 4. Eight trigrams - complexity emerges
      .to(
        Array.from({ length: 8 }, (_, i) => this.elements[`trigram-${i}`]),
        {
          opacity: 1,
          duration: 0.3,
          stagger: {
            amount: 1.2,
            from: 'start',
            ease: 'power1.inOut'
          }
        }
      )
      // 5. Outer octagon - completion, the frame that holds all
      .to(this.elements.outerOctagon, {
        strokeDashoffset: 0,
        duration: 1,
        ease: 'power1.inOut'
      }, '-=0.5');

    return this;
  }

  _startRotation() {
    // Subtle eternal rotation - the wheel that never stops
    this.rotationAnimation = gsap.to(this.elements.yinYangGroup, {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1,
      transformOrigin: '250px 250px'
    });
  }

  destroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
    if (this.rotationAnimation) {
      this.rotationAnimation.kill();
    }
    if (this.svg && this.svg.parentNode) {
      this.svg.parentNode.removeChild(this.svg);
    }
  }

  reset() {
    if (this.timeline) {
      this.timeline.seek(0).pause();
    }
    return this;
  }

  replay() {
    this.reset();
    this.start();
    return this;
  }
}

// Convenience init function
export function init(container, options) {
  const bagua = new BaguaDraw(container, options);
  bagua.init();
  return bagua;
}

export default { BaguaDraw, init };
