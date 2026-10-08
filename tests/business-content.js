/** Protect commercial copy independently of the site's presentation. */
export function readBusinessContent() {
  const sections = [
    '.top',
    '.hero__copy',
    '#why-title',
    '.why__intro',
    '.log',
    '.check',
    '.price',
    '.svc',
    '.how',
    '.faq',
    '.close',
    '.foot',
    '.dock',
  ];
  return Object.fromEntries(
    sections.map((selector) => {
      const element = document.querySelector(selector).cloneNode(true);
      const year = element.querySelector('[data-year]');
      if (year) year.textContent = 'YEAR';
      return [selector, element.textContent.replace(/\s+/g, ' ').trim()];
    }),
  );
}
