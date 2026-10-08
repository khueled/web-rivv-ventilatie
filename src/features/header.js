export function initHeader() {
  const header = document.querySelector('.top');
  if (!header) return;

  const update = () =>
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
}
