# Comparison image assets

The built-in imagegen tool created the following illustrative assets on 2026-10-08. They are not photographs of Rivv jobs. This is stated above the website gallery.

- `public/assets/img/kanaal-vergelijking.jpg`: ventilation duct, dirty left / clean right.
- `public/assets/img/waaier-vergelijking.jpg`: residential centrifugal blower, dirty left / clean right.

Each source was generated as a 1774 × 887 PNG diptych. The selected output was encoded as JPEG at quality 88 without altering its composition. CSS crops each square panel into its own layer; both layers share the same downloaded file. Native ranges reveal the clean layer with a conic mask. These files total approximately 0.8 MB.

For future real photographs, replace each illustration with paired pictures of the same equipment taken from the same angle and with consistent framing. Remove the AI illustration disclaimer when both comparisons actually use real photographs, and identify whose work the photos show accurately.

## Final prompts

### Duct

Use case: photorealistic-natural website illustration. Generate a clean horizontal 2:1 diptych, exactly two edge-to-edge square panels with NO gap, NO border, NO text, NO logos, NO dividing line. Both panels show EXACTLY THE SAME round galvanized rigid residential ventilation duct, photographed straight down its axis with identical camera, geometry, joints, perspective and lighting. The outer rim fits inside each square with a little margin for a circular crop; depth visible with a slight bend near the distant end. LEFT square: realistic accumulated grey household dust and lint coats the walls, thin fine fibres, visibly dirty but no leaves, no trash, no horror mould. RIGHT square: the IDENTICAL duct after cleaning, natural matte silver galvanised metal clearly visible, subtle scratches, slight remaining patina, not shiny CGI. Professional sharp industrial documentary photography, natural neutral soft inspection light, readable middle tones, no blown out bright exit, background charcoal. Composition invariant: corresponding features line up exactly across both square panels. This is an illustrative cleaning comparison, not a real job claim.

### Fan

Use case: photorealistic-natural website illustration. Generate a clean horizontal 2:1 diptych, exactly two edge-to-edge square panels with NO gap, NO border, NO text, NO logos, NO dividing line. Both panels show EXACTLY THE SAME centrifugal blower wheel from a residential mechanical ventilation unit, NOT a computer fan and NOT a propeller. Front-on view, entire round cage of many narrow radial blades around a central hub visible within a square matte grey metal mounting plate. Identical camera, blade count, geometry, central hub and mounting screws in both panels, the subject fits centrally in each square with margin so it is perfect for circular cropping. LEFT square: realistic grey lint and household dust accumulated across blades and hub. RIGHT square: the IDENTICAL blower after cleaning, blades are natural matte dark grey with fine texture, housing silver grey, no dust, slight age patina not pristine new. Neutral soft workshop photography, sharp readable details, medium toned background and natural color, no people or tools, no exaggerated cinematic shadows, no gleaming CGI. Corresponding structural details must align perfectly between panels so overlay works. This is an illustrative cleaning comparison, not evidence of a real customer job.

## Archived original images

The previous comparison photographs are preserved in `docs/references/images/` and excluded from the deployed site:

- Duct images: Achim Hering, [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Air_duct_cleaning_in_Canadian_residence), CC BY-SA 3.0, originally cropped by the supplied project.
- Dusty computer fan: McZusatz, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Dusty_computer_cooling_fan.JPG), CC BY-SA 3.0, originally cropped by the supplied project.
- Clean fan: [Pexels photo 6636472](https://www.pexels.com/photo/6636472/), originally cropped by the supplied project.

Existing hero and tunnel images remain unchanged. The original Pexels atmosphere-photo credit remains in the footer.
