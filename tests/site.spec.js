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

test('preserves approved client copy and contact links and loads every local asset', async ({
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
  await expect(page.locator('[data-cta="contact-bel"]')).toHaveAttribute(
    'href',
    'tel:+31644831515',
  );
  await expect(page.locator('[data-cta="contact-mail"]')).toHaveAttribute(
    'href',
    'mailto:rivventilatie@outlook.com?subject=Afspraak%20ventilatie%20reinigen',
  );
  await expect(page.locator('.contact a[href*="snapchat"]')).toHaveAttribute(
    'href',
    'https://www.snapchat.com/add/rivventilatie',
  );
  for (const image of await page.locator('img').all()) {
    // A continuously rotating image never meets Playwright's stability check.
    // Scroll directly so asset loading can also verify animated layers.
    await image.evaluate((element) =>
      element.scrollIntoView({ block: 'center', behavior: 'instant' }),
    );
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
    '1 antwoord geselecteerd. Wij kijken graag met je mee.',
  );
  await boxes.nth(1).check();
  await expect(verdict).toHaveText(
    '2 antwoorden geselecteerd. Wij kijken graag met je mee.',
  );
  const url = new URL(await cta.getAttribute('href'));
  expect(url.hostname).toBe('wa.me');
  expect(url.pathname).toBe('/31644831515');
  expect(url.searchParams.get('text')).toBe(
    'Hoi Rivv! Ik wil graag vrijblijvend advies over mijn ventilatie. Wat ik herken: Muffe of bedompte lucht in huis, Stofophoping rond ventilatieventielen. Mijn postcode is: ',
  );
  await boxes.nth(0).uncheck();
  await boxes.nth(1).uncheck();
  await expect(verdict).toHaveText(
    'Vink aan wat je herkent en ontvang vrijblijvend advies.',
  );
  await expect(verdict).not.toHaveClass(/is-alert/);
  expect(
    new URL(await cta.getAttribute('href')).searchParams.get('text'),
  ).not.toContain('Wat ik herken:');
});

test('supplied photos use Dutch labels and disclose the interface cleanup', async ({
  page,
}) => {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    await page.emulateMedia({ reducedMotion });
    await page.goto('/');
    await expect(page.locator('.hero__diagram-svg')).toHaveAttribute(
      'role',
      'img',
    );
    await expect(page.locator('.hero__photo-cap')).toContainText(
      'Schematische weergave van mechanische ventilatie.',
    );
    await expect(page.locator('.brand__image')).toHaveCount(2);
    await expect(page.locator('.brand__image').first()).toHaveAttribute(
      'src',
      '/assets/rivv-logo.jpg',
    );
    await expect(page.locator('.work__figure')).toHaveCount(2);
    await expect(page.locator('.work__label')).toHaveText([
      'Voor reiniging',
      'Na reiniging',
    ]);
    await expect(page.locator('.work__note')).toContainText(
      'digitaal bewerkt om de socialmedia-interface te verwijderen',
    );
    await expect(
      page.locator('[data-lens], [data-timecode], [data-zoom]'),
    ).toHaveCount(0);
    await expect(page.locator('.diagram__house')).toHaveCSS(
      'animation-name',
      'none',
    );
    await expect(page.locator('.work img[src*="vergelijking"]')).toHaveCount(0);
  }
});

test('diagram airflow and fan move, can be paused and respect reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const fan = page.locator('[data-hero-animation]');
  const rotor = fan.locator('.diagram__fan');
  const flow = fan.locator('.diagram__flow').first();
  const toggle = fan.locator('[data-animation-toggle]');
  await fan.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveCSS('animation-play-state', 'running');
  await expect(flow).toHaveCSS('animation-play-state', 'running');
  const firstOffset = await flow.evaluate(
    (element) => window.getComputedStyle(element).strokeDashoffset,
  );
  await expect
    .poll(() =>
      flow.evaluate(
        (element) => window.getComputedStyle(element).strokeDashoffset,
      ),
    )
    .not.toBe(firstOffset);
  const firstTransform = await rotor.evaluate(
    (element) => window.getComputedStyle(element).transform,
  );
  await expect
    .poll(() =>
      rotor.evaluate((element) => window.getComputedStyle(element).transform),
    )
    .not.toBe(firstTransform);
  await expect(fan.locator('.diagram__house')).toHaveCSS('transform', 'none');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(rotor).toHaveCSS('animation-play-state', 'paused');
  await expect(flow).toHaveCSS('animation-play-state', 'paused');
  await page.locator('#vragen').scrollIntoViewIfNeeded();
  await fan.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveCSS('animation-play-state', 'paused');
  await toggle.click();
  await expect(rotor).toHaveCSS('animation-play-state', 'running');
  await page.locator('#vragen').scrollIntoViewIfNeeded();
  await expect(rotor).toHaveCSS('animation-play-state', 'paused');
  await fan.scrollIntoViewIfNeeded();
  await expect(rotor).toHaveCSS('animation-play-state', 'running');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(rotor).toHaveCSS('animation-name', 'none');
  await expect(flow).toHaveCSS('animation-name', 'none');
  await expect(toggle).toBeDisabled();
  await expect(toggle).toContainText('Animatie uit');
});

test('four ordered services have the correct prices and matching WhatsApp requests', async ({
  page,
}) => {
  await page.goto('/');
  const services = page.locator('.svc__row');
  await expect(services.locator('h3')).toHaveText([
    'Ventilatiekanalen reinigen',
    'Ventilatiekanalen reinigen + ventilatiebox onderhoud',
    'Ventilatiestoringen & vervanging',
    'WTW-reiniging & onderhoud',
  ]);
  const expectedPrices = [
    ['€ 119,99'],
    ['€ 149,99'],
    ['€ 89,99', 'Offerte op maat'],
    ['€ 149,99', '€ 229,99'],
  ];
  const expectedMessages = [
    'ventilatiekanalen en ventielen laten reinigen voor € 119,99',
    'mechanische ventilatiebox laten reinigen voor de actieprijs van € 149,99',
    'offerte op maat',
    'alleen de unit (€ 149,99)',
  ];
  for (let i = 0; i < 4; i++) {
    await expect(services.nth(i).locator('.svc__rate strong')).toHaveText(
      expectedPrices[i],
    );
    const request = new URL(
      await services.nth(i).locator('a').getAttribute('href'),
    );
    expect(request.hostname).toBe('wa.me');
    expect(request.pathname).toBe('/31644831515');
    expect(request.searchParams.get('text')).toContain(expectedMessages[i]);
    expect(request.searchParams.get('text')).toContain('Mijn postcode is: ');
  }
  await expect(services.nth(3)).toContainText(
    'Bij het eerste pakket is kanaalreiniging niet inbegrepen.',
  );
  for (const key of [
    'header-whatsapp',
    'hero-whatsapp',
    'voorna-whatsapp',
    'prijs-whatsapp',
    'stappen-whatsapp',
    'contact-whatsapp',
    'dock-whatsapp',
  ]) {
    const request = new URL(
      await page.locator('[data-cta="' + key + '"]').getAttribute('href'),
    );
    expect(request.searchParams.get('text')).toContain('€ 149,99');
    expect(request.searchParams.get('text')).toContain(
      'mechanische ventilatiebox',
    );
  }
});

test('visible FAQ and search metadata agree with the new prices and careful claims', async ({
  page,
}) => {
  await page.goto('/');
  const schemas = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const faq = JSON.parse(schemas[0]);
  const items = page.locator('.faq__item');
  await expect(items).toHaveCount(8);
  for (let i = 0; i < faq.mainEntity.length; i++) {
    await expect(items.nth(i).locator('summary')).toHaveText(
      faq.mainEntity[i].name,
    );
    for (const paragraph of await items.nth(i).locator('p').allTextContents()) {
      expect(faq.mainEntity[i].acceptedAnswer.text).toContain(
        paragraph.replace(/\s+/g, ' ').trim(),
      );
    }
  }
  const business = JSON.parse(schemas[1]);
  expect(
    business.makesOffer
      .filter((offer) => offer.price)
      .map((offer) => offer.price),
  ).toEqual(['119.99', '149.99', '89.99', '149.99', '229.99']);
  for (const offer of business.makesOffer.filter((offer) => offer.price)) {
    expect(offer.price).toMatch(/\.99$/);
  }
  await expect(page).toHaveTitle(/€ 149,99/);
  const claims = [...schemas, await page.locator('body').innerText()].join(' ');
  expect(claims).not.toMatch(
    /huisstofmijt|bacteriën|schimmels|energiezuinig|lager energieverbruik|zonder rommel/i,
  );
  await expect(page.locator('.foot')).toContainText(
    'Den Haag en omgeving. Landelijk op aanvraag.',
  );
});

test('pricing, contact links and the FAQ work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.locator('.hero__diagram-svg')).toBeVisible();
  await expect(page.locator('[data-animation-toggle]')).toBeHidden();
  await expect(page.locator('.diagram__fan')).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await expect(page.locator('.svc__row')).toHaveCount(4);
  await expect(page.locator('.price__amount')).toHaveAttribute(
    'aria-label',
    '149 euro 99',
  );
  const faq = page.locator('.faq__item').nth(6);
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
  const request = new URL(
    await page.locator('[data-check-cta]').getAttribute('href'),
  );
  expect(request.searchParams.get('text')).toContain('vrijblijvend advies');
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
