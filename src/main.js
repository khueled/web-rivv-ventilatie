import { initHeader } from './features/header.js';
import { initCameraEffects } from './features/camera-effects.js';
import { initBeforeAfter } from './features/before-after.js';
import { initSelfCheck } from './features/self-check.js';
import { initAnalytics } from './features/analytics.js';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

initHeader();
initCameraEffects({ reducedMotion });
initBeforeAfter({ reducedMotion });
initSelfCheck();
initAnalytics();

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
