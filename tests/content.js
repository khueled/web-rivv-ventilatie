/** User-facing copy, links, metadata, and accessibility labels from the DOM. */
export function readContent() {
  const ignored = 'script, style, [data-timecode], [data-zoom], [data-year]';
  const walker = document.createTreeWalker(document.body, 4);
  const text = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest(ignored)) continue;
    const value = node.textContent.replace(/\s+/g, ' ').trim();
    if (value) text.push(value);
  }

  const attributes = [
    ...document.querySelectorAll('[alt], [aria-label], [aria-labelledby]'),
  ].map((element) => ({
    tag: element.tagName,
    alt: element.getAttribute('alt'),
    label: element.getAttribute('aria-label'),
    labelledby: element.getAttribute('aria-labelledby'),
  }));

  return {
    title: document.title,
    language: document.documentElement.lang,
    text,
    attributes,
    links: [...document.querySelectorAll('a')].map((link) => ({
      href: link.getAttribute('href'),
      target: link.getAttribute('target'),
      rel: link.getAttribute('rel'),
      cta: link.getAttribute('data-cta'),
    })),
    images: [...document.images].map((image) =>
      image.getAttribute('src').replace(/^\//, ''),
    ),
    metadata: [...document.querySelectorAll('meta[name], meta[property]')].map(
      (meta) => ({
        key: meta.getAttribute('name') || meta.getAttribute('property'),
        value: meta.getAttribute('content').replace(/^\/assets\//, 'assets/'),
      }),
    ),
    structuredData: [
      ...document.querySelectorAll('script[type="application/ld+json"]'),
    ].map((script) => JSON.parse(script.textContent)),
  };
}
