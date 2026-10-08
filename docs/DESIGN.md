# Design — Rivv Ventilatie

World: **Inspectiecamera**. The visitor looks through the technician's inspection camera into their own ventilation. The dirt is the argument; the camera makes it visible.

## Color (Committed, dark — the inside of a duct is dark)

| Token                      | Value             | Role                                                                                       |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| `--ink`                    | #0A0C0D           | Page ground (camera black)                                                                 |
| `--ink-2`                  | #111517           | Alternate band (voor/na, werkwijze), feature panel                                         |
| `--ink-3`                  | #1A2023           | Scrollbar thumb                                                                            |
| `--line` / `--line-strong` | bone at 13% / 26% | Hairlines, outlines                                                                        |
| `--bone`                   | #E9ECEA           | Text; the one calm price panel                                                             |
| `--dim`                    | #A5AEAB           | Secondary text on ink                                                                      |
| `--rec`                    | #FF3B2F           | Only for "dirty / recording / health risk": REC dot, VOOR tag, health icons, warning lines |
| `--led`                    | #7CFFB2           | Only for "clean / act": primary CTA, NA tag, LED ring, brush, service icons                |
| `--led-ink`                | #04210F           | Text on LED                                                                                |

Rule: red never appears on a positive action; mint never marks a problem.

## Type

- **Archivo** 400–900 (Bunny Fonts, GDPR-friendly). Display 800–900, tracking −0.03 to −0.04em, max 6rem (price), hero 4.75rem.
- **JetBrains Mono** 500/700 only for camera OSD and measurement-like labels (timecode, zoom, VOOR/NA, chips, contact labels). Uppercase, tracked 0.08–0.32em.

## Components

- **Lens**: circular viewport, inset shadow rings (1px line, 8–10px ink gap, 1px line), vignette + scanlines + faint noise overlay, OSD inset 15%.
- **LED ring**: 12 mint arcs around the hero lens (repeating conic gradient masked to a 5px annulus, glow).
- **Brush reveal**: after-image masked by `conic-gradient(#000 var(--a), transparent var(--a))`; a mint brush line rotates at `--a`; driven by a range input (accessible), auto-sweeps once on first view (unless reduced motion).
- **Buttons**: 56px pill. LED (primary), ghost (outline), ink (on bone).
- **Rows, not cards**: health log, services, contact are hairline-separated rows. Only exceptions: the bone price panel and the "vervangen" feature panel.
- **Tunnel band**: full-bleed stock photo of a pipe interior (camera looking into the duct), left ink gradient for text, scanlines, small REC OSD top-right; image scales 1.05→1.4 as the band crosses the viewport.
- Stock photos are atmosphere only — never presented as Rivv's work.
- **Conversion layer**: offer block (price in LED + what's included) above the hero CTA; trust row with LED checks; self-check ticks (red when checked) that write the WhatsApp message; inline CTA bars after voor/na and steps; per-service WhatsApp asks; FAQ as hairline <details> rows. Every CTA carries `data-cta` for analytics. Never add invented reviews, counts or guarantees.
- **Dock** (≤860px): fixed bottom bar with WhatsApp + Bellen.

## Motion

One authored moment: hero camera zooms 1→1.9× and turns 14° as it scrolls away (ZOOM readout follows); lenses get one brush sweep. REC dot blinks. Everything else is hover feedback only. `prefers-reduced-motion` disables all of it.

## Layout

Max width 1240px, gutter clamp(16px, 4vw, 44px), section padding clamp(5rem, 10vw, 9rem). Breakpoints 1020 (nav hides), 860 (single column, dock), 520 (full-width buttons).
