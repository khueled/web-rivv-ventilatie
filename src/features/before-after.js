const SWEEP_DURATION = 2200;
const RESTING_ANGLE = 180;
const easeOut = (progress) => 1 - Math.pow(1 - progress, 4);

export function initBeforeAfter({ reducedMotion }) {
  document.querySelectorAll('[data-lens]').forEach((lens) => {
    const view = lens.querySelector('.lens__view');
    const input = lens.querySelector('input[type="range"]');
    if (!view || !input) return;

    let touched = false;
    const setAngle = (degrees) => {
      view.style.setProperty('--a', `${degrees}deg`);
      input.style.setProperty('--fill', `${(degrees / 360) * 100}%`);
    };

    input.addEventListener('input', () => {
      touched = true;
      setAngle(Number(input.value));
    });
    setAngle(Number(input.value));

    if (reducedMotion || !('IntersectionObserver' in window)) {
      input.value = RESTING_ANGLE;
      setAngle(RESTING_ANGLE);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();

        const step = (now) => {
          if (touched) return;
          const progress = Math.min(1, (now - start) / SWEEP_DURATION);
          // Sweep a full turn, then settle halfway, as in the original design.
          const degrees =
            progress < 0.7
              ? easeOut(progress / 0.7) * 360
              : 360 - easeOut((progress - 0.7) / 0.3) * (360 - RESTING_ANGLE);
          input.value = Math.round(degrees);
          setAngle(degrees);
          if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.55 },
    );

    observer.observe(view);
  });
}
