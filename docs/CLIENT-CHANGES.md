# Client changes — 10 October 2026

Implemented locally from the supplied RIVV change brief. The existing Vercel website has not been redeployed.

The user's latest clarification restores the original architectural blue house diagram in the opening section, with animated airflow and a rotating fan. The previous price update remains: €119.99 for ducts, €149.99 for the combination offer, €89.99 for fault investigation, €149.99 for WTW unit only and €229.99 for WTW with ducts.

## Completed

- Added a company details section with the known company and contact information, a header link (also visible on mobile), a footer link and an explicit advance-agreement notice for travel costs. The user has no address, KvK number or VAT identification number to add.
- Replaced the mint/red palette with navy, white, grey and blue; kept the established section sequence, typography, icons, buttons and FAQ interactions.
- Updated the hero, educational section, four information blocks, six checklist items, four services, third booking step, all eight FAQ answers, contact section and footer.
- Set prices to €119.99 for ducts and vents, €149.99 for ducts and mechanical ventilation box, €89.99 for fault investigation, €149.99 for WTW unit only and €229.99 for WTW unit plus ducts. Replacement uses a custom quote.
- Updated offer and service WhatsApp requests. The checklist requests advice with selected answers rather than assuming cleaning is required.
- Updated page title, social metadata, FAQ structured data and business offers to match the new copy and prices.
- Removed unsupported strong health, energy and fault-resolution claims.
- Restored the architectural blue house schematic in the hero, with animated airflow toward the ventilation box and outside, a rotating fan, a pause/start button, reduced-motion support and automatic pause outside the viewport. The supplied screenshots remain in the static Dutch before/after section with an editing note.
- Downloaded the original RIVV logo from the public TikTok profile and used it unchanged in the header, footer and favicon. Blue accents now follow the logo's blue. See [photo and logo notes](PHOTO-EDIT-PROMPTS.md).
- Kept phone, WhatsApp and email contacts. Removed the social contact link and its unused icon. Service area is now all of the Netherlands.
- Confirmed by the user on 19 October 2026: all displayed prices include VAT; extra costs apply only after prior agreement. Added this to the hero, action panel, service prices, FAQ, WhatsApp requests and search metadata.
- Updated regression fixtures intentionally to reflect the client brief.
- Made the before/after layout fill the content width with large equal photo panels, a compact centred heading, balanced captions and a compact CTA beneath. Photo height adapts to viewport height and the crops focus on the blower. Both photos remain side by side on mobile and fit together with the CTA. Verified at six viewport sizes without horizontal overflow or contact-dock overlap.

## Client items needed before publication

1. Confirm whether prices include VAT, then add the agreed label to the hero offer, action panel, service rates and pricing FAQ. VAT treatment has not been invented.
1. Confirm whether €149.99 includes airflow measurement and adjustment. The local draft follows the supplied publication copy, which includes both. Confirm the same scope wherever mentioned, including replacement and WTW maintenance.
1. Confirm whether any new vents, vent caps or filters are included. The draft promises cleaning of existing vents only and makes no promise of replacement filters.
1. No fixed travel, material or repair surcharges have been supplied. Do not invent amounts; the confirmed policy requires prior agreement for any extra costs.

The supplied socialmedia screenshots are used as supplied imagery rather than attributed to a specific RIVV job. Original screenshots and edited masters are archived outside the deployment. Higher-resolution original photos or a vector logo can replace these assets later, but are not required to complete this update.

The explicit services heading “Van reiniging tot vervanging.” follows the document's worked-out replacement copy. Every displayed price, prefilled WhatsApp request, FAQ answer and structured offer follows the latest 99-cent pricing instruction.

## Verification

Production build passed. All 27 Playwright checks passed in installed Chrome across desktop, iPhone-sized mobile and 360px mobile. Visual checks at 1440, 1100, 768, 390 and 360px confirmed readable layouts without horizontal overflow. Prices, service-specific requests, FAQ, structured data, assets, static contact destinations and operation without JavaScript were checked. No messages or calls were sent.
