import { initHeader } from './features/header.js';
import { initSelfCheck } from './features/self-check.js';
import { initAnalytics } from './features/analytics.js';
import { initBeforeAfter } from './features/before-after.js';

initHeader();
initSelfCheck();
initAnalytics();
initBeforeAfter();

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
