# Design — RIVV Ventilatie

The 10 October 2026 client brief retains the established section order, typography, icons, checklist, contact actions and native expandable FAQ. The revised design uses white and light grey panels, navy contrast sections and restrained blue accents.

## Colour and typography

Navy `#0B1930`, white `#FFFFFF`, light grey `#F3F6FA`, logo blue `#0878BD` on light backgrounds and light blue `#83B9FF` on dark backgrounds. Archivo carries headings and body text; JetBrains Mono is reserved for compact labels.

The `light` section theme provides dark text and blue actions on white surfaces. The header, educational section, checklist, contact area and footer use navy with white text. The featured €149.99 package uses a pale blue panel and an understated action badge.

## Imagery

The original logo is downloaded from the company's public TikTok profile and used unchanged, with CSS framing that trims the surrounding white space. The opening section uses the original architectural blue house diagram, as clarified by the user. The supplied ventilation-box screenshots remain in the before/after section; interface removal is disclosed there.

The diagram shows the house, vents, ducts and mechanical ventilation box, with all labels in Dutch. Its caption identifies it as a schematic. The static before/after section retains the supplied photos with Dutch captions. Neither photograph is attributed to a specific RIVV job.

The diagram uses inline SVG and CSS animation. Moving blue dashes follow the actual duct routes toward the box and then outside. Only the fan blades rotate; the house and box stay fixed. The visitor can pause and restart both animations together. They stop outside the viewport or in a hidden tab, and reduced-motion preferences disable them. Without JavaScript the diagram stays still and the unused pause button is hidden. No new raster image or ImageGen asset was needed.

## Layout and interaction

Content width remains 1240px. The hero, checklist, services, FAQ and contact area use two columns on desktop and one column at 860px and below. Service and FAQ introductions follow the viewport on desktop. The mobile contact dock remains available.

The before/after section fills the full content width with two equally sized photo panels. Their height adapts to viewport height, up to 520px on desktop, and the crops focus on the blower. A compact centred heading and introduction sit above them, with balanced captions and a compact CTA row beneath. Mobile keeps both photos side by side and wraps the CTA beneath its prompt. Photos and CTA remain visible together at six checked desktop, tablet and mobile sizes, including 1280 × 720 and 360 × 800.

All four services have visible prices and prefilled WhatsApp requests. The checklist sends selected answers for advice without assuming cleaning is necessary. Native details elements make the FAQ usable without JavaScript. Reduced-motion preferences disable smooth scrolling and shorten transitions. Existing CTA analytics hooks remain available.

## Verification

The production build and 27 browser checks pass on desktop, iPhone-sized mobile and 360px mobile with installed Chrome. Screenshots were reviewed at 1440, 1100, 768, 390 and 360px widths, with no horizontal overflow.
