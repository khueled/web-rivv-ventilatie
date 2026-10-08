/** Forward existing CTA events when the client adds an analytics provider. */
export function initAnalytics() {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-cta]');
    if (!link) return;

    const type = link.href.startsWith('tel:')
      ? 'bellen'
      : link.href.startsWith('mailto:')
        ? 'mail'
        : 'whatsapp';
    const detail = { event: 'cta_click', cta: link.dataset.cta, type };
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        cta: detail.cta,
        method: detail.type,
      });
    }
  });
}
