# TripUp · Prism design system v1.0 (Oct 16, 2026)

Pure Prism. Light mode = "Pearl"; dark mode = "Graphite Pearl" (Prism's own dark mode, nothing borrowed from Golden Hour).

## Files
- `build_tokens.py`: the single source. Run `python3 build_tokens.py` to regenerate the two token files.
- `tokens.json`: DTCG-style tokens.
  - color primitives (66) and semantic tokens (38, light/dark refs + hex)
  - roles, celebration rules, fonts, 16 type styles, spacing (4 pt), radius, blur, opacity, layout/safe areas, glass layers, shadows
  - motion: durations, easings, springs, haptics, and the rich vs Reduce Motion patterns
- `tokens.css`: CSS custom properties.
  - `:root` (light), `[data-theme=dark]` / `.theme-dark`
  - `prefers-reduced-motion` and `prefers-reduced-transparency` fallbacks
  - utilities: `.tu-glass`, `.tu-glass-thick`, `.tu-surface`, `.tu-celebrate-text`, `.tu-num`
- `sheet.py` → `design-system-sheet.html` → `design-system-sheet.png` (1920×4105): foundations + all core components + a dark strip.
- Rendering: run `node shot.js http://localhost:8766/design-system/design-system-sheet.html design-system-sheet.png 1920 1080 1500`. This needs an http server rooted at /workspace/tripup on port 8766, with playwright-core from moodboards/src/node_modules.

## Contrast (WCAG AA verified)
| Role | Contrast |
|---|---|
| on-accent white on iris-500 | 4.56 |
| dark on-accent (ink on iris-400) | 5.74 |
| owed jade-600 | 4.9 |
| owe rose-600 | 5.7 |
| tertiary pearl-600 | 5.3 |

## Figma (TripUp-Working, z4TesJNPe6UfvgwmWtIA4y)
- Everything now lives on page `108:3229` "AI Enabled", in section `108:3233` "02 · Design System · Prism v1". The earlier pages 98:3229 and 101:3229 were removed after their contents moved. Ryan's pages (0:1, 3:402) were not touched.
- Variables: Prism / Primitives (66), Prism / Color (38, Light/Dark), Prism / Spacing (12), Prism / Radius (9), Prism / Effects (15).
- Styles: 16 text styles and 11 effect styles.
- Library: 40 component sets and 20 standalone components, each on a "Component / X" board with usage, anatomy, specs, do/don't, a variant matrix and a dark-mode example. Boards are grouped by category: Actions, Inputs, People, Polls and plan, Lists and cards, Money, Navigation and layout, Feedback, Overlays, System surfaces. IDs are in `figma-state.json`.
- Token changes: see `CHANGELOG.md`.
- Photos are from Pexels: Arti.tic/Andrés Vélez 34110274, Kampus Production 6314564, Bento Justin 20594880, Lara 33793961, Naimish Verma 29743109, plus 33794158 and 33659321 from moodboards/photos (credits in moodboards/README.md).
- Beyond tonight photos (Pexels, free license): Joan Costa (Pexels 12232125, Pastel de nata on the table); Pexels contributor (Pexels 12221772, Hand holding a pastry, Lisbon); Marcelo Verfe (Pexels 16335878, Belém Tower); Joan Costa (Pexels 11717754, Tower of Belém with visitors); Atlantic Ambience (Pexels 12955617, Friends at a restaurant); Sebastian Coman Photography (Pexels 3755084, Dinner table toast); Julia M Cameron (Pexels 8841431, Toast at dinner with friends); Hazel Montero (Pexels 17359340, Palacio de Bellas Artes facade); Arthur Brognoli (Pexels 33745931, Palacio de Bellas Artes); Pexels contributor (Pexels 37739301, Street in Coyoacán); Pexels contributor (Pexels 29696337, Doorway in Coyoacán); Travel Photographer (Pexels 35340134, Ribeira, Porto); maria Chaile (Pexels 35349860, Boats on the Douro); Pedro Soares (Pexels 35716780, Ribeira and the Douro, Porto); Abdulmomen Bsruki (Pexels 29693824, Coast at Sesimbra); Pexels contributor (Pexels 3113225, Scuba diver); Jo Kassis (Pexels 10805104, LX Factory from above); Jose Cruz (Pexels 32561233, Grilled sardines, Lisbon); Kampus Production (Pexels 8720138, Friends under the 25 de Abril bridge); Niklas Jeromin (Pexels 35999359, Friends at sunset over Lisbon); Pexels contributor (Pexels 37442559, Sunset crowd over Lisbon); Pexels contributor (Pexels 37296507, Riverside at golden hour). Source of truth: storybook/src/lib/beyond.ts PHOTO_CREDITS, shown in Storybook under Patterns/Beyond tonight/Photo credits.
