# Design — Rivv Ventilatie

The site presents a ventilation cleaning service through clear typography, a transparent price, relevant images, and direct contact options. Its layout works with the current photographs and comparison illustrations; it does not require future client images to feel complete.

## Colour and typography

The existing palette and type system remain: camera black `#0A0C0D`, off-white `#E9ECEA`, mint `#7CFFB2` for primary actions, and red `#FF3B2F` for health concerns. Archivo carries headings and body text; JetBrains Mono is reserved for compact brand, contact, and step labels.

## Photography

- The hero uses the existing photograph of a dirty ventilation fan in a simple rectangular frame, without scanlines, camera overlays, glow, or moving crops.
- The duct photograph provides a static background for a shorter health section. A dark overlay maintains text contrast.
- Two circular comparisons show paired dirty/clean views of a residential ventilation duct and centrifugal fan. The images have clearer details and corresponding framing. They are AI-generated illustrations, with a visible disclaimer above the gallery, and are not evidence of a Rivv job.
- Original comparison photographs are archived under `references/images/` and are not published. Their provenance is recorded in `IMAGE-ASSETS.md`; existing atmosphere-photo attribution stays in the footer.
- Real photographs may replace these images later, but the current layout is a complete presentation without them.

## Spacing and layout

The maximum content width remains 1240px. Desktop uses a two-column hero and self-check. The self-check introduction is vertically centred beside its longer checklist to avoid an empty area below the heading. The health section's bottom padding and self-check's top padding provide one compact transition, with a subtle background change.

At 860px and below, the page uses one column, the hero copy precedes the photograph, and the self-check introduction stays directly above its checklist. The fixed contact dock remains available. The price panel, services, booking steps, FAQ, and contact section retain their content and established styling.

## Interaction

The circular reveal makes a single sweep when each comparison enters the viewport and its images are ready, then settles at half-and-half. Touch, mouse, or keyboard input immediately takes control and prevents replay. Reduced-motion preferences suppress the sweep, including when changed during animation. Native range controls provide keyboard access and announce the percentage of clean image shown. Without JavaScript, the two halves remain visible and the controls are disabled.

The rest of the page uses restrained hover, focus, and press feedback. There is no recording timer, blinking REC indicator, scroll zoom, or photo rotation. Reduced-motion preferences also disable smooth scrolling and shorten transitions.

The self-check still sends selected symptoms through WhatsApp. Existing CTA analytics hooks remain available without adding a provider.
