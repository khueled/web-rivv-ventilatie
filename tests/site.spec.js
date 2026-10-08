import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { readContent } from './content.js';
import { readBusinessContent } from './business-content.js';

const originalContent = JSON.parse(
  readFileSync(
    new URL('./fixtures/original-content.json', import.meta.url),
    'utf8',
  ),
);

const businessContent = JSON.parse(
  readFileSync(
    new URL('./fixtures/business-content.json', import.meta.url),
    'utf8',
  ),
);

test('preserves business copy and contact links and loads every local asset', async ({
  page,
}) => {
  const errors = [];
  const failedAssets = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (
      response.url().startsWith('http://127.0.0.1:4173') &&
      response.status() >= 400
    ) {
      failedAssets.push(response.url());
    }
  });
  await page.goto('/');
  await expect(page.locator('[data-check-cta]')).toHaveAttribute(
    'href',
    /\?text=/,
  );
  const content = await page.evaluate(readContent);
  for (const key of ['title', 'language', 'metadata', 'structuredData']) {
    expect(content[key]).toEqual(originalContent[key]);
  }
  expect(content.links.filter((link) => link.cta)).toEqual(
    originalContent.links.filter((link) => link.cta),
  );
  expect(await page.evaluate(readBusinessContent)).toEqual(businessContent);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (element) => element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
  const favicon = await page.request.get('/assets/favicon.svg');
  expect(favicon.ok()).toBe(true);
  expect(
    await page.request
      .get('/docs/PRODUCT.md')
      .then((response) => response.status()),
  ).toBe(404);
});

test('self-check updates its verdict and the encoded WhatsApp message', async ({
  page,
}) => {
  await page.goto('/');
  const boxes = page.locator('[data-check] input[type="checkbox"]');
  const verdict = page.locator('[data-verdict]');
  const cta = page.locator('[data-check-cta]');
  await boxes.nth(0).check();
  await expect(verdict).toHaveText(
    '1 teken dat je ventilatie aan een reiniging toe is.',
  );
  await boxes.nth(1).check();
  await expect(verdict).toHaveText(
    '2 tekens dat je ventilatie aan een reiniging toe is.',
  );
  const url = new URL(await cta.getAttribute('href'));
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/31644831515');
  expect(url.searchParams.get('text')).toBe(
    'Hoi Rivv! Ik wil graag mijn ventilatie laten reinigen (€149,99). Wat ik herken: muffe of vieze lucht, grijze of zwarte randen rond de ventielen. Mijn postcode is: ',
  );
  await boxes.nth(0).uncheck();
  await boxes.nth(1).uncheck();
  await expect(verdict).toHaveText('Vink aan wat je herkent.');
  await expect(verdict).not.toHaveClass(/is-alert/);
  expect(
    new URL(await cta.getAttribute('href')).searchParams.get('text'),
  ).not.toContain('Wat ik herken:');
});

test('hero and background stay static while illustrations are clearly identified', async ({
  page,
}) => {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    await expect(page.locator('.ba__note')).toContainText(
      "geen foto's van een Rivv-klus",
    );
    await expect(page.locator('.lens')).toHaveCount(2);
    await expect(page.locator('[data-timecode], [data-zoom]')).toHaveCount(0);
    await page.locator('#voor-na').scrollIntoViewIfNeeded();
    for (const image of await page.locator('.hero img, .tunnel img').all()) {
      await expect(image).toHaveCSS('transform', 'none');
      await expect(image).toHaveCSS('animation-name', 'none');
      await expect(image).toHaveCSS('mask-image', 'none');
    }
  }
});

test('circular comparisons sweep once and manual controls interrupt them', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const firstInput = page.locator('[data-lens] input').first();
  await page.locator('.lens__view').first().scrollIntoViewIfNeeded();
  await expect.poll(() => firstInput.inputValue()).not.toBe('50');
  await expect(firstInput).toHaveValue('50', { timeout: 4000 });
  for (const lens of await page.locator('[data-lens]').all()) {
    const input = lens.locator('input');
    const view = lens.locator('.lens__view');
    await view.scrollIntoViewIfNeeded();
    await expect(input).toBeEnabled();
    await expect(view).toHaveCSS('border-radius', '50%');
    await input.focus();
    await input.press('Home');
    await expect(input).toHaveValue('0');
    await expect(view).toHaveCSS('--a', '0deg');
    await input.press('End');
    await expect(input).toHaveAttribute('aria-valuetext', '100% schoon beeld');
    await expect(view).toHaveCSS('--a', '360deg');
  }
  await page.goto('/');
  const lens = page.locator('[data-lens]').first();
  const input = lens.locator('input');
  await lens.locator('.lens__view').scrollIntoViewIfNeeded();
  await expect.poll(() => input.inputValue()).not.toBe('50');
  await input.focus();
  await input.press('Home');
  await page.locator('.hero').scrollIntoViewIfNeeded();
  await lens.locator('.lens__view').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2300);
  await expect(input).toHaveValue('0');
  await expect(lens.locator('.lens__view')).toHaveCSS('--a', '0deg');
});

test('reduced motion keeps the comparison still and keyboard controls remain usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const lens of await page.locator('[data-lens]').all()) {
    const input = lens.locator('input');
    await lens.locator('.lens__view').scrollIntoViewIfNeeded();
    await expect(input).toHaveValue('50');
    await input.focus();
    await input.press('ArrowRight');
    await expect(input).toHaveValue('51');
    await expect(input).toHaveAttribute('aria-valuetext', '51% schoon beeld');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const input = page.locator('[data-lens] input').first();
  await page.locator('.lens__view').first().scrollIntoViewIfNeeded();
  await expect.poll(() => input.inputValue()).not.toBe('50');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(input).toHaveValue('50');
  await input.focus();
  await input.press('End');
  await expect(input).toHaveValue('100');
});

test('comparisons remain visible without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('noscript p')).toContainText(
    'Links zie je de vervuilde situatie',
  );
  for (const lens of await page.locator('[data-lens]').all()) {
    await expect(lens.locator('input')).toBeDisabled();
    await expect(lens.locator('.lens__view')).toHaveCSS('--a', '180deg');
    await expect(lens.locator('.lens__after')).toHaveCSS(
      'mask-image',
      /conic-gradient/,
    );
  }
  await context.close();
});

test('FAQ, header, analytics, and the mobile dock keep working', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    window.dataLayer = [];
  });
  await page.goto('/');
  const item = page.locator('.faq__item').nth(1);
  await item.locator('summary').click();
  await expect(item).toHaveAttribute('open', '');
  await item.locator('summary').click();
  await expect(item).not.toHaveAttribute('open');
  await expect(page.locator('.top')).toHaveClass(/is-scrolled/);
  await page.locator('[data-cta="hero-bel"]').evaluate((link) => {
    link.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    });
    link
      .querySelector('svg')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  expect(await page.evaluate(() => window.dataLayer)).toContainEqual({
    event: 'cta_click',
    cta: 'hero-bel',
    type: 'bellen',
  });
  if (testInfo.project.name !== 'desktop')
    await expect(page.locator('.dock')).toBeVisible();
  else await expect(page.locator('.dock')).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('self-check is balanced and section spacing is compact', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const layout = await page.evaluate(() => {
    const rect = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const intro = rect('.check__intro');
    const form = rect('.check__form');
    const log = rect('.log');
    return {
      introCenter: intro.top + intro.height / 2,
      formCenter: form.top + form.height / 2,
      introBottom: intro.bottom,
      formTop: form.top,
      gap: Math.min(intro.top, form.top) - log.bottom,
      tunnelHeight: rect('.tunnel').height,
    };
  });
  expect(layout.gap).toBeGreaterThan(60);
  expect(layout.gap).toBeLessThan(150);
  expect(layout.tunnelHeight).toBeLessThan(600);
  if (testInfo.project.name !== 'desktop') {
    expect(layout.formTop - layout.introBottom).toBeGreaterThan(16);
    expect(layout.formTop - layout.introBottom).toBeLessThan(40);
  } else {
    expect(Math.abs(layout.introCenter - layout.formCenter)).toBeLessThan(1);
  }
});
