# Generated material masters

Built-in imagegen; no API-key CLI or external provider. Masters copied into this folder. Production maps are in `../../motexo-site/public/assets/textures/`. Color maps1024px; derived height512px and roughness256px. Total15 WebP maps1,698,036 bytes. Derived height/roughness are artistic approximations from luminance, not measured scans. Maps use standard PBR channels and face-projected UVs in Three.js; packed box-projected material setup is in the editable Blender source. Red wall, red cables and switch are intentionally smooth, with no generated texture on them.

## Mineral wall prompt

Use case: photorealistic-natural
Asset type: seamless PBR wall base-color texture for a cinematic 3D technical-services website.
Primary request: A square flat orthographic material scan of clean pale warm-grey painted mineral plaster / fine industrial concrete wall. Real subtle pores, fine trowel texture, tiny scattered mineral specks and soft uneven paint variation, well-maintained interior industrial wall. Neutral desaturated warm gray, modest variation. Entire image is surface, consistent physical scale about 1 metre wide.
Lighting: completely flat diffuse shadow-free illumination, no directional gradients, no highlights, no ambient occlusion baked in.
Constraints: seamlessly tileable all four edges, visually uniform large-scale brightness, no seams, no objects, no fixtures, no text, no cracks, no dramatic stains, no vignette, no perspective. Fine natural physical texture rather than exaggerated grunge. This is a material texture, not a photo of a room.

## Four-material atlas prompt

Use case: photorealistic-natural
Asset type: technical material texture atlas for realistic 3D industrial interior. Square canvas split precisely into four equal square quadrants, edge to edge with NO gutters, NO borders, NO labels. Each quadrant is an orthographic shadow-free PBR base-color material scan and independently seamless tileable.
TOP LEFT quadrant: clean light neutral-grey powder-coated steel, fine slightly pebbled orange-peel finish, very subtle natural coat variation, no large scratches.
TOP RIGHT quadrant: clean charcoal dark-grey flexible cable jacket rubber, very fine matte polymer grain, subtly uneven real surface, no cable shapes or objects.
BOTTOM LEFT quadrant: natural medium warm kraft corrugated cardboard surface, fine compressed paper fibres, subtle smooth cloudy tone variation, no tape, printing, lettering, folds or edges.
BOTTOM RIGHT quadrant: pale raw softwood pallet timber surface, fine lengthwise wood grain, tiny subtle natural knots, no board divisions, screws or seams.
Lighting: uniformly diffuse and shadow-free, absolutely no directional gradients, no highlights, no baked ambient occlusion. Camera normal to each surface, consistent detail scale. Entire image contains only these four material surfaces. High micro-detail, restrained realism, no dramatized grunge. Perfectly aligned quadrants meeting at the exact horizontal and vertical midpoint.
