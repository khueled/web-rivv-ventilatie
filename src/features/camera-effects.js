import { observeViewport } from '../utils/viewport.js';

const clampProgress = (value) => Math.min(1, Math.max(0, value));

export function initCameraEffects({ reducedMotion }) {
  initTimecode();
  if (reducedMotion) return;

  const feed = document.querySelector('[data-feed]');
  const feedImage = feed?.querySelector('.feed__img');
  const zoomOutput = document.querySelector('[data-zoom]');
  const tunnel = document.querySelector('[data-tunnel]');
  const tunnelImage = tunnel?.querySelector('.tunnel__img');
  if (!feedImage && !tunnelImage) return;

  observeViewport(() => {
    const viewportHeight = window.innerHeight;
    if (feedImage) {
      const rect = feed.getBoundingClientRect();
      const progress = clampProgress(
        (viewportHeight * 0.5 - (rect.top + rect.height / 2)) /
          (viewportHeight * 0.6) +
          0.15,
      );
      const zoom = 1 + progress * 0.9;
      feedImage.style.setProperty('--zoom', zoom.toFixed(3));
      feedImage.style.setProperty('--turn', `${(progress * 14).toFixed(2)}deg`);
      if (zoomOutput) zoomOutput.textContent = zoom.toFixed(1);
    }

    if (tunnelImage) {
      const rect = tunnel.getBoundingClientRect();
      const progress = clampProgress(
        (viewportHeight - rect.top) / (viewportHeight + rect.height),
      );
      tunnelImage.style.setProperty(
        '--push',
        (1.05 + progress * 0.35).toFixed(3),
      );
    }
  });
}

function initTimecode() {
  const timecode = document.querySelector('[data-timecode]');
  if (!timecode) return;

  const start = performance.now();
  const pad = (number) => String(number).padStart(2, '0');
  const update = () => {
    const seconds = Math.floor((performance.now() - start) / 1000);
    timecode.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
  };

  update();
  setInterval(update, 1000);
}
