import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { readContent } from './content.js';

const originalContent = JSON.parse(
  readFileSync(
    new URL('./fixtures/original-content.json', import.meta.url),
    'utf8',
  ),
);

test('preserves original content and loads every local asset', async ({
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
  expect(await page.evaluate(readContent)).toEqual(originalContent);
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

test('sliders work with the keyboard and reduced motion stays static', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const lens of await page.locator('[data-lens]').all()) {
    const slider = lens.locator('input[type="range"]');
    await expect(slider).toHaveValue('180');
    await slider.focus();
    await slider.press('Home');
    await expect(slider).toHaveValue('0');
    await expect(lens.locator('.lens__view')).toHaveCSS('--a', '0deg');
    await slider.press('End');
    await expect(slider).toHaveValue('360');
    await expect(lens.locator('.lens__view')).toHaveCSS('--a', '360deg');
  }
  expect(
    await page
      .locator('.feed__img')
      .evaluate((image) => image.style.getPropertyValue('--zoom')),
  ).toBe('');
  await expect(page.locator('.osd__rec i').first()).toHaveCSS(
    'animation-name',
    'none',
  );
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
  if (testInfo.project.name === 'mobile')
    await expect(page.locator('.dock')).toBeVisible();
  else await expect(page.locator('.dock')).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test('camera motion and automatic brush reveal still run', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const image = page.locator('.feed__img');
  const initialZoom = Number(
    await image.evaluate((element) => element.style.getPropertyValue('--zoom')),
  );
  await page.locator('#waarom').scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      image.evaluate((element) =>
        Number(element.style.getPropertyValue('--zoom')),
      ),
    )
    .toBeGreaterThan(initialZoom);
  for (const lens of await page.locator('[data-lens]').all()) {
    await lens.locator('.lens__view').scrollIntoViewIfNeeded();
    await expect(lens.locator('input[type="range"]')).toHaveValue('180', {
      timeout: 6000,
    });
  }
});
