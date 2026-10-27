# Motexo website

React/TypeScript/Vite multipage website with Three.js scene rendering, a paused20-second GSAP scroll composition and Motion UI interactions. Use Node.js22.

```sh
npm ci
NODE_OPTIONS=--max-old-space-size=1024 npm test
NODE_OPTIONS=--max-old-space-size=1024 npm run build
NODE_OPTIONS=--max-old-space-size=512 npm run preview
```

Preview:http://127.0.0.1:5187/. Routes:`/`,`/expertise/`,`/work/`,`/contact/`.

Vercel builds this directory using the committed vercel.json and the repository's main branch. No environment variables are required. See the repository root README for deployment details.

`Hero.tsx` drives the deterministic scroll clock; `camera-score.ts` interpolates camera poses; `story-model.ts` builds the service world; `story-scene.ts` loads the authored GLB, applies lighting/materials and follows the travelling light. The window.__timelines['motexo-hero-scroll'] composition supports hf-seek events with {time}. HyperFrames Animation's deterministic composition pattern is used; a video renderer is not running.

Equipment stays at one architectural transform throughout the macro/warehouse reveal. Power and data remain separate. The event thread reveals behind a travelling light; camera/head share the curve. The cabinet has a solid opaque hinged cover. Rendering responds to scroll/resize/visibility, with no idle loop. A live reduced-motion preference, chapter navigation, skip link and WebGL/model fallback are included.

Editable source and generated material masters are in ../motexo-scene. See ASSETS.md for provenance and DESIGN.md/PRODUCT.md for the visual/product constraints. Authentic social collages remain at original resolution. The 3D journey and service illustrations are conceptual, not surveyed client-work evidence.

Enquiries validate, review and prepare a WhatsApp draft. This app sends no message and stores no details remotely. Physical phones/Safari are not yet verified; Vite reports large chunks and the scene loads dynamically.
