# Motexo Technical

A cinematic, scroll-driven technical-services website built with React, TypeScript, Vite, Three.js, GSAP and Motion. The service journey moves from a wall switch through electrical distribution and networking into a warehouse and illustrative tennis venue.

## Project structure

- `outputs/motexo-site/` — website source, tests and runtime assets; Vercel root directory.
- `outputs/motexo-scene/` — editable Blender scene, construction/material scripts and generated texture masters.

## Run locally

Use Node.js22 and npm.

```sh
cd outputs/motexo-site
npm ci
NODE_OPTIONS=--max-old-space-size=1024 npm test
NODE_OPTIONS=--max-old-space-size=1024 npm run build
NODE_OPTIONS=--max-old-space-size=512 npm run preview
```

The preview uses http://127.0.0.1:5187/. Development: `npm run dev`.

## Deploy

Import this repository into Vercel with root directory `outputs/motexo-site`. The committed `vercel.json` selects Vite, installs with `npm ci`, builds with `npm run build` and serves `dist`. Production branch: `main`. No environment variables or backend service are required.

Routes: `/`, `/expertise/`, `/work/`, `/contact/`. Enquiries validate and prepare a WhatsApp draft; visitors choose whether to send it.

## Assets and editing

See the site's `ASSETS.md`, `DESIGN.md` and `PRODUCT.md`, and the scene's `README.md`. The company mark and authentic social archive are distinct from generated illustrative materials/3D scenes. Original low-resolution social collages are preserved; the venue is illustrative, not an exact surveyed reconstruction.

The20-second paused GSAP composition follows scroll; it has no idle animation loop. A live reduced-motion preference uses chapter views, and a skip link reaches the service content. WebGL/model failure retains the headline/contact path. Generated texture channels are artistic approximations, not calibrated scans.

A physical-device/Safari matrix remains to be completed. Vite currently reports large JavaScript chunks; 3D rendering is dynamically loaded.
