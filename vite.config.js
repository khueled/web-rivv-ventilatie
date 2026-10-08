import { defineConfig } from 'vite';

export default defineConfig({
  // This is a static page, so unknown paths should return 404.
  appType: 'mpa',
});
