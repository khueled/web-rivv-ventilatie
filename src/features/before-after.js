const DURATION = 2200;
const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);

export function initBeforeAfter() {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-lens]').forEach((lens) => {
    const view = lens.querySelector('.lens__view');
    const input = lens.querySelector('input[type="range"]');
    if (!view || !input) return;

    let touched = false;
    let frame;
    let observer;
    const setValue = (value) => {
      input.value = Math.round(value);
      input.setAttribute(
        'aria-valuetext',
        `${Math.round(value)}% schoon beeld`,
      );
      view.style.setProperty('--a', `${value * 3.6}deg`);
      input.style.setProperty('--fill', `${value}%`);
    };
    const stop = () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
    const takeControl = () => {
      touched = true;
      stop();
    };
    input.disabled = false;
    setValue(Number(input.value));
    input.addEventListener('pointerdown', takeControl);
    input.addEventListener('keydown', takeControl);
    input.addEventListener('input', () => {
      takeControl();
      setValue(Number(input.value));
    });
    motion.addEventListener('change', () => {
      if (!motion.matches) return;
      stop();
      if (!touched) setValue(50);
    });

    if (motion.matches || !('IntersectionObserver' in window)) return;

    // Start once the comparison is visible and both image layers are ready.
    const images = [...view.querySelectorAll('img')];
    Promise.all(images.map((image) => image.decode().catch(() => {}))).then(
      () => {
        if (touched || motion.matches) return;
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const start = performance.now();
            const step = (now) => {
              const progress = Math.min(1, (now - start) / DURATION);
              const value =
                progress < 0.7
                  ? easeOut(progress / 0.7) * 100
                  : 100 - easeOut((progress - 0.7) / 0.3) * 50;
              setValue(value);
              if (progress < 1) frame = requestAnimationFrame(step);
            };
            frame = requestAnimationFrame(step);
          },
          { threshold: 0.55 },
        );
        observer.observe(view);
      },
    );
  });
}
