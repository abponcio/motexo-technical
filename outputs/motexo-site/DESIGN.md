---
name: Motexo
description: Built right. Wired clean.
colors:
  red: "#de2018"
  red-hover: "#bb180f"
  ink: "#111211"
  muted: "#555d5a"
  line: "#d5dadb"
  paper: "#fff"
  white: "#ffffff"
  expertise-surface: "#f2f2ed"
  approach-surface: "#171a18"
  inverse-muted: "#c4cbc6"
  field-border: "#aeb9bf"
  field-error: "#ad241d"
  selected-field: "#fff7f6"
  white-hover: "#e8eae5"
typography:
  display:
    fontFamily: "Russo One, sans-serif"
    fontSize: "clamp(58px, 7vw, 104px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Russo One, sans-serif"
    fontSize: "clamp(45px, 5.2vw, 76px)"
    fontWeight: 400
    lineHeight: 1.03
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "32px"
    fontWeight: 620
    letterSpacing: "-0.035em"
  body:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  square: "0"
  field: "8px"
  dialog: "4px"
  pill: "999px"
spacing:
  control-gap: "12px"
  field-gap: "18px"
  content-gap: "24px"
  section-desktop: "110px"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
  button-header:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "14px 26px"
    height: "48px"
  button-header-hover:
    backgroundColor: "{colors.red-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-white:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "14px 24px"
  button-white-hover:
    backgroundColor: "{colors.white-hover}"
    textColor: "{colors.ink}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "13px 14px"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  inspection-tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    padding: "12px 0"
    height: "44px"
---

# Design System: Motexo

## Overview

**Creative North Star: "Built right. Wired clean."**

Signal red, pale architectural surfaces and graphite hardware express organized workmanship. Angular Russo One headlines support the existing wordmark. IBM Plex Sans keeps descriptions and controls readable. The approved continuation uses actual dimensional geometry and a camera journey through multiple services; the rack-only concept is superseded.

**Key Characteristics:**
- Saturated red, white, pale mineral walls and dark hardware.
- Angular display lettering, open composition and square primary actions.
- Scroll connects electrical work, networking, a warehouse and an event.
- Illustrations explain services; authentic source photos provide the work archive.

## Colors

Signal Red is the brand accent for actions and the opening environment. Ink carries copy over pale surfaces; white carries copy over red and dark scenes. Scene materials are lit Three.js surfaces, so their rendered values vary with illumination. The networking and electrical text use a pale protective field where routes pass behind the copy. Venue annotation panels use a dark blue-gray field for contrast.

## Typography

Self-hosted Russo One is the display face; Archivo Variable remains the component heading face and IBM Plex Sans the body/control face. Hero display size follows the frontmatter; mobile uses a separate 38–66px clamp, with 36px wide-scene titles. Hero descriptions use 15px on mobile and a 17–23px desktop range. Utility labels stay at least 12px in the new story.

**The Brand Asset Rule.** Display type supports the existing logo artwork; it never replaces or redraws the wordmark. Header and footer use the same enhanced raster, cropped to the wordmark in the header and shown complete in the footer.

## Layout

The shared header remains 84px tall on desktop and 72px in the story's mobile layout. The hero is a sticky stage under that header; 820svh of desktop document space and 720svh on mobile map onto a finite 20-second clock. Story copy sits on the left on desktop and above the subject on phones. Wide scene camera distance grows on phones so the architecture fits below the copy. Native chapter buttons and a skip link keep direct navigation available.

Existing service, archive, approach and contact layouts remain in styles.css and red-design.css. Content containers retain their existing maximum widths and responsive gutters; this hero replacement does not re-author the rest of the site.

## Elevation & Depth

Dimensional depth comes from real mesh geometry, cable curves, articulated switch and cabinet door, architectural framing, shadows and camera parallax. The switch housing/rocker and warehouse are authored in Blender, exported as named, material-batched GLB assemblies and combined with procedural infrastructure/event geometry. Fine wood, paper, concrete and coating finish is reconstructed in the browser shader. Screen-space contact shadows and four-sample offscreen antialiasing supply close-shot depth; AO renders at 70 percent of CSS viewport resolution. One renderer draws only when the timeline, resize or visibility changes; device pixel ratio is capped at 1.25. There is no idle animation loop.

**The Separate Systems Rule.** Electrical and data installations are distinct assemblies. The red motif links services visually; it is not a wiring diagram or proof that the spaces share a circuit or geographic site.

## Shapes

Primary actions and evidence frames remain square. Fields, archive chips and dialogs retain their established softer shapes. Infrastructure labels use small rectangular panels and Phosphor Light pictograms. Physical hardware uses rounded machined edges; canopy panels curve as architectural surfaces.

## Components

### Scroll story

The camera has a strong switch macro/orbit, cable descent, network inspection, an interior-to-wide warehouse crane and a sweeping event approach. The main copy exits during macro travel and becomes inert; native chapter navigation remains available. FOV changes stay within33–45 degrees, with small motivated banking.

One paused GSAP timeline registered as window.__timelines['motexo-hero-scroll'] drives camera, switch action, enclosure opening, light levels, chapter copy and progress. ScrollTrigger seeks that clock through natural scrolling with a 0.65-second scrub. The data-duration is 20. The scene is loaded asynchronously before timeline registration. A single post-commit refresh measures the complete scroll range. A matching hf-seek event seeks the completed composition with update callbacks enabled, so camera and visible copy reflect the requested frame. This applies HyperFrames Animation's deterministic composition pattern; the HyperFrames video renderer is not installed or running.

Chapter controls seek the corresponding scroll location. Only the active copy is keyboard available; each copy links to its matching service. The stadium carries five possible 3D anchor positions; labels project into HTML and cull when outside the frame, behind copy or overlapping another label. Activating a marker opens a small inline explanatory panel. The stage is visibly labeled illustrative.

Full camera choreography is the default, as requested. A system reduced-motion preference switches to stable chapter views with direct controls and a shorter scroll track; a persistent skip link reaches service content. Motion's separate navigation, service and form UI retains its existing system preference behavior. A generated opening poster supports loading and WebGL initialization failure.

### Shared components

Shared buttons, menu, service controls, archive dialog, enquiry fields and review/edit flow are preserved. Primary actions are square, with visible hover/pressed/focus treatments. White story actions use dark text. Keyboard focus becomes white on red/dark fields and ink on pale story fields. Archive images retain source proportions and source links. Enquiry details are validated, reviewed and editable before the visitor deliberately opens a WhatsApp draft; no message is sent by the site.

## Do's and Don'ts

### Do:

- Do keep the actual logo artwork and authentic social source pixels.
- Do label the service journey illustrative and keep source project evidence separate.
- Do own all story motion with one seek-safe timeline and dispose scene resources on unmount.
- Do frame hardware and wide architecture separately for mobile.
- Do preserve direct service navigation, visible focus and the editable enquiry review.

### Don't:

- Don't turn the multi-service story into a rack product advertisement.
- Don't add promotional diagonal arrows or unrelated decorative cable-line backgrounds.
- Don't depict a breaker conductor terminating in an Ethernet port.
- Don't claim the illustrative venue is an exact survey or an actual project photograph.
- Don't replace blurry authentic work with generated faces, signs or installation details.


### Final continuity and UX constraints

Keep electrical/network assemblies fixed at architectural scale0.32 with position(8,-7,0). Close camera keys share this transform; scale change comes from camera motion, never an independently shrinking installation or backdrop. Keep Blender containment connected and remove duplicate cut-off routes. Loading/failure uses clean brand red, with no unrelated concept-poster flash. Red surfaces and all switch parts remain smooth; generated image texture belongs to concrete, structural coatings, rubber, timber and paper. The work preview fills aligned columns with48px gap and no artificial stagger/width cap. Story controls must remain within short landscape viewports; the Dubai footer location remains visible on mobile/tablet.

The warehouse/event route reveals behind a travelling light originating at the existing containment tip. Camera and pulse follow the same curve; no complete detached line may appear abruptly. The route interlude has no scene copy; event copy returns on arrival. The cabinet cover is solid opaque metal, opening outward on the right hinge to expose its internals.
