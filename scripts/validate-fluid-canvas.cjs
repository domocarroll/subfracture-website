#!/usr/bin/env node

/**
 * Validation Script for Fluid Canvas Implementation
 * Checks structure, dependencies, and code quality
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Fluid Canvas Implementation...\n');

const checks = [];

// Check 1: Core files exist
console.log('✓ Checking core files...');
const coreFiles = [
  './assets/js/visions/fluid-canvas.js',
  './assets/css/visions/fluid-canvas.css',
  './fluid-canvas-demo.html',
  './FLUID-CANVAS-GUIDE.md'
];

coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`  ✓ ${file} (${Math.round(stats.size / 1024)}KB)`);
    checks.push({ name: `File exists: ${file}`, passed: true });
  } else {
    console.log(`  ✗ ${file} - MISSING`);
    checks.push({ name: `File exists: ${file}`, passed: false });
  }
});

// Check 2: JavaScript module structure
console.log('\n✓ Checking JavaScript module structure...');
const jsContent = fs.readFileSync('./assets/js/visions/fluid-canvas.js', 'utf8');

const requiredMethods = [
  'init',
  'destroy',
  'splat',
  'emergeDrawing',
  'animate',
  'step',
  'createPrograms',
  'initFramebuffers'
];

requiredMethods.forEach(method => {
  if (jsContent.includes(`${method}(`)) {
    console.log(`  ✓ Method: ${method}()`);
    checks.push({ name: `Method exists: ${method}`, passed: true });
  } else {
    console.log(`  ✗ Method: ${method}() - MISSING`);
    checks.push({ name: `Method exists: ${method}`, passed: false });
  }
});

// Check 3: Shader programs
console.log('\n✓ Checking shader programs...');
const shaders = [
  'display',
  'splat',
  'advection',
  'divergence',
  'curl',
  'vorticity',
  'pressure',
  'gradientSubtract'
];

shaders.forEach(shader => {
  if (jsContent.includes(`${shader}:`)) {
    console.log(`  ✓ Shader: ${shader}`);
    checks.push({ name: `Shader exists: ${shader}`, passed: true });
  } else {
    console.log(`  ✗ Shader: ${shader} - MISSING`);
    checks.push({ name: `Shader exists: ${shader}`, passed: false });
  }
});

// Check 4: WebGL2 usage
console.log('\n✓ Checking WebGL2 implementation...');
const webgl2Features = [
  'webgl2',
  'RGBA16F',
  'RG16F',
  'R16F',
  'HALF_FLOAT',
  'createFramebuffer',
  'vertexAttribPointer'
];

webgl2Features.forEach(feature => {
  if (jsContent.includes(feature)) {
    console.log(`  ✓ WebGL2 feature: ${feature}`);
    checks.push({ name: `WebGL2 feature: ${feature}`, passed: true });
  } else {
    console.log(`  ⚠ WebGL2 feature: ${feature} - NOT FOUND`);
    checks.push({ name: `WebGL2 feature: ${feature}`, passed: false });
  }
});

// Check 5: CSS responsive design
console.log('\n✓ Checking CSS responsive design...');
const cssContent = fs.readFileSync('./assets/css/visions/fluid-canvas.css', 'utf8');

const cssFeatures = [
  '@media (max-width: 768px)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (prefers-contrast: high)',
  'pointer-events: none',
  'z-index: -1',
  'position: fixed'
];

cssFeatures.forEach(feature => {
  if (cssContent.includes(feature)) {
    console.log(`  ✓ CSS feature: ${feature}`);
    checks.push({ name: `CSS feature: ${feature}`, passed: true });
  } else {
    console.log(`  ✗ CSS feature: ${feature} - MISSING`);
    checks.push({ name: `CSS feature: ${feature}`, passed: false });
  }
});

// Check 6: Demo HTML structure
console.log('\n✓ Checking demo HTML structure...');
const htmlContent = fs.readFileSync('./fluid-canvas-demo.html', 'utf8');

const htmlFeatures = [
  'type="module"',
  'gsap',
  'ScrollTrigger',
  'drawing-trigger',
  'data-drawing=',
  'fluidCanvas.init',
  'fluidCanvas.emergeDrawing'
];

htmlFeatures.forEach(feature => {
  if (htmlContent.includes(feature)) {
    console.log(`  ✓ HTML feature: ${feature}`);
    checks.push({ name: `HTML feature: ${feature}`, passed: true });
  } else {
    console.log(`  ✗ HTML feature: ${feature} - MISSING`);
    checks.push({ name: `HTML feature: ${feature}`, passed: false });
  }
});

// Check 7: Drawing assets
console.log('\n✓ Checking drawing assets...');
const drawings = ['IMG_0154.jpg', 'IMG_0161.jpg', 'IMG_0159.jpg'];

drawings.forEach(drawing => {
  const drawingPath = `./assets/drawings/${drawing}`;
  if (fs.existsSync(drawingPath)) {
    const stats = fs.statSync(drawingPath);
    console.log(`  ✓ Drawing: ${drawing} (${Math.round(stats.size / 1024)}KB)`);
    checks.push({ name: `Drawing exists: ${drawing}`, passed: true });
  } else {
    console.log(`  ⚠ Drawing: ${drawing} - NOT FOUND`);
    checks.push({ name: `Drawing exists: ${drawing}`, passed: false });
  }
});

// Check 8: Code quality
console.log('\n✓ Checking code quality...');

const qualityChecks = [
  { name: 'ES6 modules', pattern: /export default/ },
  { name: 'Arrow functions', pattern: /=>\s*{/ },
  { name: 'Const/let usage', pattern: /const |let / },
  { name: 'Template literals', pattern: /`.*\${/ },
  { name: 'Comments', pattern: /\/\*\*/ },
  { name: 'Error handling', pattern: /console\.(warn|error)/ }
];

qualityChecks.forEach(check => {
  if (check.pattern.test(jsContent)) {
    console.log(`  ✓ ${check.name}`);
    checks.push({ name: check.name, passed: true });
  } else {
    console.log(`  ⚠ ${check.name} - LOW USAGE`);
    checks.push({ name: check.name, passed: false });
  }
});

// Check 9: Performance considerations
console.log('\n✓ Checking performance optimizations...');

const perfChecks = [
  'isMobile',
  'requestAnimationFrame',
  'performance.now()',
  'visibilitychange',
  'devicePixelRatio',
  'beforeunload'
];

perfChecks.forEach(check => {
  if (jsContent.includes(check) || htmlContent.includes(check)) {
    console.log(`  ✓ Performance: ${check}`);
    checks.push({ name: `Performance: ${check}`, passed: true });
  } else {
    console.log(`  ⚠ Performance: ${check} - NOT IMPLEMENTED`);
    checks.push({ name: `Performance: ${check}`, passed: false });
  }
});

// Check 10: Documentation completeness
console.log('\n✓ Checking documentation...');
const docContent = fs.readFileSync('./FLUID-CANVAS-GUIDE.md', 'utf8');

const docSections = [
  '## Overview',
  '## Quick Start',
  '## API Reference',
  '## Configuration',
  '## Performance Optimization',
  '## Accessibility',
  '## Debugging',
  '## Common Issues'
];

docSections.forEach(section => {
  if (docContent.includes(section)) {
    console.log(`  ✓ Doc section: ${section}`);
    checks.push({ name: `Doc section: ${section}`, passed: true });
  } else {
    console.log(`  ✗ Doc section: ${section} - MISSING`);
    checks.push({ name: `Doc section: ${section}`, passed: false });
  }
});

// Summary
console.log('\n' + '='.repeat(60));
const passed = checks.filter(c => c.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n📊 VALIDATION SUMMARY: ${passed}/${total} checks passed (${percentage}%)\n`);

if (percentage === 100) {
  console.log('✅ ALL CHECKS PASSED - Implementation is complete!\n');
} else if (percentage >= 90) {
  console.log('⚠️  MOSTLY COMPLETE - Minor issues detected\n');
} else {
  console.log('❌ INCOMPLETE - Major issues detected\n');
}

// Code statistics
console.log('📈 CODE STATISTICS:');
console.log(`  JavaScript: ${jsContent.split('\n').length} lines`);
console.log(`  CSS: ${cssContent.split('\n').length} lines`);
console.log(`  HTML: ${htmlContent.split('\n').length} lines`);
console.log(`  Documentation: ${docContent.split('\n').length} lines`);

const totalLines = jsContent.split('\n').length +
                   cssContent.split('\n').length +
                   htmlContent.split('\n').length +
                   docContent.split('\n').length;

console.log(`  Total: ${totalLines} lines\n`);

// Next steps
console.log('🚀 NEXT STEPS:');
console.log('  1. Open fluid-canvas-demo.html in a browser');
console.log('  2. Verify fluid simulation runs at 60 FPS');
console.log('  3. Test drawing emergence on scroll');
console.log('  4. Test mobile responsiveness');
console.log('  5. Verify accessibility features');
console.log('\n  Start server: python3 -m http.server 8000');
console.log('  Open: http://localhost:8000/fluid-canvas-demo.html\n');

process.exit(percentage === 100 ? 0 : 1);
