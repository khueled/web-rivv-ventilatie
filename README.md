# Rivv Ventilatie

Static Dutch marketing site built with semantic HTML, CSS, and JavaScript modules. Vite provides local development and an optimized production build; no client framework or backend is required. Existing copy, imagery, contact links, structured data, and visual design are preserved.

## Develop

Use Node.js 24 and npm. The lockfile pins dependencies for reproducible installs.

```sh
npm ci
npm run dev
```

## Structure

```text
index.html                 Page content, metadata, structured data, SVG icons
src/main.js                Browser entry point
src/features/              Header, camera, comparison, self-check, analytics
src/utils/                 Shared viewport and WhatsApp helpers
src/styles/                Foundations, components, sections, responsive rules
public/assets/             Original favicon and photographs
docs/                      Product/design notes and original reference documents
tests/                     Desktop/mobile browser regression checks
vercel.json                Explicit Vercel build settings
```

Keep page content in `index.html`. The stylesheet import order preserves the existing cascade. Each feature initializes itself from its own DOM hooks and tolerates missing elements. The site works as a static page without JavaScript; JavaScript enhances its interactions. Analytics events are forwarded only if the client supplies `dataLayer` or `gtag`.

Only `dist/` is published. Reference documents, local tooling, and tests are excluded from deployment.

## Validate

```sh
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm test
```

`npm run check` runs all project checks after browser installation. To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` (`$env:PLAYWRIGHT_CHANNEL = 'chrome'` in PowerShell). Browser tests run against the production build on desktop and mobile. The content fixture was captured from the original site before the refactor; update it intentionally only when the client requests content changes.

Use `npm run format` when editing. To inspect the built site locally:

```sh
npm run build
npm run preview
```

## Vercel preview

Import this directory as the project root. `vercel.json` selects **Vite**, installs with **npm ci**, builds with **npm run build**, and publishes **dist**. Select **Node.js 24.x** in project settings. No environment variables are needed.

For a client showcase, use a separate project such as `rivv-showcase`, without connecting the client's live domain. From this folder:

```sh
npx vercel login
npx vercel deploy --target=preview
```

The CLI prompts for your account and project selection, then returns a deployment URL. When creating the showcase project, use this directory (`./`) as its root.

Vercel labels the first deployment of a new project as Production, including when requesting Preview. Subsequent preview deployments use the Preview environment. A separate showcase project keeps this first deployment isolated from the client's live website. For a strictly Preview-labelled deployment, use a project that already has its initial deployment and verify the environment in Vercel's dashboard.

If Deployment Protection is enabled, open the deployment in Vercel and choose **Share → Anyone with the link**, then send that shareable link to the client. Test it in a private browser window before sharing.

With a connected Git repository, pushes to non-production branches create previews automatically. This folder was received without a Git repository or Vercel project link; those account connections must be set up when deploying.

References: [Vercel CLI deployment](https://vercel.com/docs/projects/deploy-from-cli), [Vercel deployment targets](https://vercel.com/docs/cli/deploy#target), [Sharing protected previews](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/sharable-links), [Vite static deployment](https://vite.dev/guide/static-deploy).
