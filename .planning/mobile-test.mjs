import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const viewports = [
  { name: '320px', width: 320, height: 568 },
  { name: '375px', width: 375, height: 812 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1440px', width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch();
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    // Home page
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Check horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalScroll = scrollWidth > clientWidth;

    // Full page screenshot
    await page.screenshot({
      path: `.planning/screenshots/home-${vp.name}.png`,
      fullPage: true,
    });

    // Check specific elements at 375px
    if (vp.width === 375) {
      // Hero text overflow check
      const heroOverflow = await page.evaluate(() => {
        const hero = document.querySelector('.hero-content');
        if (!hero) return 'hero-content not found';
        const heroRect = hero.getBoundingClientRect();
        const culture = hero.querySelector('.hero-culture');
        const studio = hero.querySelector('.hero-studio');
        const issues = [];
        if (culture) {
          const r = culture.getBoundingClientRect();
          if (r.right > heroRect.right + 1) issues.push(`Culture overflows by ${(r.right - heroRect.right).toFixed(0)}px`);
        }
        if (studio) {
          const r = studio.getBoundingClientRect();
          if (r.right > heroRect.right + 1) issues.push(`Studio overflows by ${(r.right - heroRect.right).toFixed(0)}px`);
        }
        return issues.length ? issues.join(', ') : 'OK';
      });

      // Touch target check on carousel arrows
      const touchTargets = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a[href]');
        const small = [];
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            if (rect.width < 44 || rect.height < 44) {
              const id = btn.id || btn.className?.split(' ')[0] || btn.tagName;
              small.push(`${id}: ${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`);
            }
          }
        });
        return small.length ? small.join(' | ') : 'All ≥ 44px';
      });

      // Contact form inputs
      const formCheck = await page.evaluate(() => {
        const inputs = document.querySelectorAll('#contact input, #contact textarea');
        const issues = [];
        inputs.forEach(input => {
          const rect = input.getBoundingClientRect();
          if (rect.width < 300) {
            issues.push(`${input.id}: ${rect.width.toFixed(0)}px wide`);
          }
        });
        return issues.length ? issues.join(', ') : 'OK (full width)';
      });

      results.push({
        viewport: vp.name,
        horizontalScroll: hasHorizontalScroll ? `YES (${scrollWidth} > ${clientWidth})` : 'NONE',
        heroOverflow,
        touchTargets,
        formInputs: formCheck,
      });
    } else {
      results.push({
        viewport: vp.name,
        horizontalScroll: hasHorizontalScroll ? `YES (${scrollWidth} > ${clientWidth})` : 'NONE',
      });
    }

    // Detail page at 375px
    if (vp.width === 375) {
      await page.goto(`${BASE}/work/sprite`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: `.planning/screenshots/detail-375px.png`,
        fullPage: true,
      });

      const detailOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth
          ? `YES (${document.documentElement.scrollWidth} > ${document.documentElement.clientWidth})`
          : 'NONE';
      });
      results.push({ viewport: '375px-detail', horizontalScroll: detailOverflow });
    }

    await context.close();
  }

  console.log('\n=== MOBILE RESPONSIVENESS RESULTS ===\n');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

run().catch(console.error);
