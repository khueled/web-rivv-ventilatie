export function initHeroAnimation() {
  const visual = document.querySelector('[data-hero-animation]');
  const toggle = visual?.querySelector('[data-animation-toggle]');
  const label = visual?.querySelector('[data-animation-label]');
  const icon = toggle?.querySelector('use');
  if (!visual || !toggle || !label || !icon) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let visible = false;

  const update = () => {
    visual.classList.toggle(
      'is-animating',
      !paused && !motion.matches && visible && !document.hidden,
    );
    toggle.disabled = motion.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    label.textContent = motion.matches
      ? 'Animatie uit'
      : paused
        ? 'Animatie starten'
        : 'Animatie pauzeren';
    toggle.setAttribute(
      'aria-label',
      motion.matches
        ? 'Ventilatieanimatie uit vanwege je bewegingsvoorkeur'
        : paused
          ? 'Ventilatieanimatie starten'
          : 'Ventilatieanimatie pauzeren',
    );
    icon.setAttribute(
      'href',
      paused || motion.matches ? '#i-play' : '#i-pause',
    );
  };

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    update();
  });
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      update();
    },
    { threshold: 0.15 },
  ).observe(visual);
  update();
}
