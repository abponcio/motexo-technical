# Motexo scene craft

Editable source: `motexo-craft.blend`; deterministic construction: `build_craft.py`; runtime export: `../motexo-site/public/assets/motexo-craft.glb`.

Authored through the connected native Blender MCP, Blender5.2.1 LTS, addon1.8/protocol15, safe mode enabled and telemetry disabled. No asset library or external generation provider was enabled. The Blender-to-Web workflow and selected arjun988 Blender Skills camera/material/lighting guidance were read through GitHub; no global skill installation or demo project copy was needed.

The exported GLB has one active scene and three required assemblies:

| ID | Runtime role | Rest transform in cinematic world |
| --- | --- | --- |
| SwitchHousing | Static die-cast casing, bezel, gasket, fasteners and glands | (5,9,0) |
| SwitchRocker | Articulated red cap, indicator and molded return | (5,9,0.62) |
| WarehouseCraft | Batched structural kit, racks, pallets, varied cartons, workbench and practical fixtures | origin |

In the browser, electrical and networking assemblies have one fixed architectural transform: scale0.32, position(8,-7,0). Close camera keys use that same transform; the reveal moves only the camera. The imported warehouse containment meets those fixed endpoints, and duplicate macro-only cable routes were removed. The table lists asset-local positions before this runtime transform. Coordinates express the cinematic world, not a measured architectural or electrical design. Electrical and data remain separate assemblies; warehouse/event continuity is conceptual.

Export uses GLB, selected objects, active scene only, applied modifiers and default Y-up conversion. The fresh-import test checks IDs, finite geometry, axes, bounds, unrelated-scene exclusion, payload below3MiB and total browser scene budget. The export is about850KiB;23 authored meshes, with the complete browser world constrained by the tested mesh/triangle budget. Runtime draw calls include shadow/contact passes and are recorded separately in verification.

Blender base materials transfer through Principled BSDF; browser-specific micro-finish, studio environment, lights, contact shadows, tone mapping and camera score are recreated in Three.js. They are not a claim that Blender's renderer or shader graph runs in the browser. No offline image sequence is used.

The user accidentally selected New in Blender during the work. The saved .blend was verified on disk, reopened through MCP and all three assemblies were verified present. The current saved model includes the later normal/material refinements.

Sources of guidance:
- https://github.com/cth9191/blender-to-web/blob/codex/blender-to-web-workflow/SKILL.md
- https://github.com/arjun988/blender-skills/tree/main/.claude/skills/camera-cinematography
- https://github.com/arjun988/blender-skills/tree/main/.claude/skills/materials
- https://github.com/arjun988/blender-skills/tree/main/.claude/skills/lighting

Generated surface maps are packed into the saved .blend; `apply_textures.py` records the setup after geometry construction. Browser materials use standard maps and generated face UVs rather than assuming Blender node graphs transfer. Smooth switch materials are independent of the textured warehouse materials. Texture masters and exact built-in prompts: `textures/PROMPTS.md`. One .blend1 recovery backup is retained after the user New-file incident.


## Rebuild scripts after cloning

`build_craft.py` and `apply_textures.py` resolve paths relative to their own files. Run construction only in a fresh Blender session; it deliberately refuses to overwrite an existing Motexo_Craft assembly. Open/edit the saved .blend for ordinary model work. To execute construction from the repository root:

```sh
blender --background --python outputs/motexo-scene/build_craft.py
```

The existing GLB and production maps are sufficient to build/deploy the website; Blender is not required by npm or Vercel. The saved .blend is the editable final source; .blend1 recovery copies remain local and untracked.
