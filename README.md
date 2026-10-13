# Rivv Ventilatie

Static Dutch marketing site built with semantic HTML, CSS, and JavaScript modules. Vite provides local development and an optimized production build; no client framework or backend is required. The October 2026 client update introduces navy, blue and white styling, four revised services, consistent prices, the original RIVV logo and cleaned-up supplied ventilation-box screenshots. See [client changes and outstanding items](docs/CLIENT-CHANGES.md).

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
src/features/              Header, self-check, before/after comparisons, analytics
src/utils/                 WhatsApp message helper
src/styles/                Foundations, components, sections, responsive rules
public/assets/             Original logo and edited supplied photographs
docs/                      Product/design notes and original reference documents
tests/                     Desktop/mobile browser regression checks
vercel.json                Explicit Vercel build settings
```

Keep page content in `index.html`. The stylesheet import order preserves the existing cascade; `client-update.css` adds the light section theme and revised service pricing. Each feature initializes itself from its own DOM hooks and tolerates missing elements. The page, contact links and FAQ work without JavaScript; JavaScript enhances the checklist and header. Analytics events are forwarded only if the client supplies `dataLayer` or `gtag`.

Only `dist/` is published. Reference documents, local tooling, and tests are excluded from deployment.

## Validate

```sh
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm test
```

`npm run check` runs all project checks after browser installation. To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome` (`$env:PLAYWRIGHT_CHANNEL = 'chrome'` in PowerShell). Browser tests run against the production build on desktop and mobile. Both content fixtures reflect the 10 October 2026 client brief. Update these intentionally only when the client requests business content changes. Tests cover service prices, prefilled contact requests, careful claims, FAQ metadata, asset loading and use without JavaScript.

## Photography

The hero uses the original architectural blue house schematic, with animated airflow through the ducts and a rotating fan. Its inline SVG is enhanced with pause/start controls, reduced-motion support and automatic pause outside the viewport. Without JavaScript it remains still. The static Dutch before/after section retains the two supplied ventilation-box screenshots with interface removal disclosed. The original logo comes from the company's public TikTok profile and is used unchanged. See [source and edit notes](docs/PHOTO-EDIT-PROMPTS.md).

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
