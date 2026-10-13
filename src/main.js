import { initHeader } from './features/header.js';
import { initSelfCheck } from './features/self-check.js';
import { initAnalytics } from './features/analytics.js';
import { initHeroAnimation } from './features/hero-animation.js';

initHeader();
initSelfCheck();
initAnalytics();
initHeroAnimation();

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
