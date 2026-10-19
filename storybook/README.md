# TripUp · Prism Storybook

Storybook 8 (React, Vite, TypeScript) for the Prism design system. Components read CSS variables from `src/tokens/tokens.css`, which is copied from `../design-system/` on every run.

## Run

    cd /workspace/tripup/storybook
    npm install
    npm run storybook          # dev server on :6006, syncs tokens first
    npm run build-storybook    # static build in storybook-static/, syncs tokens first
    python3 -m http.server 6007 -d storybook-static

## Screenshots

    node shoot.cjs screens            # every story at 402x874 in the phone frame, dark variants for patterns, plus desktop shots
    node shoot.cjs screens patterns   # only ids that contain "patterns"

Needs the static server on :6007 and playwright-core (symlinked from ../moodboards/src/node_modules).

## Layout

- `.storybook/` config, toolbar globals (Theme, Motion, Glass), iPhone 17 frame decorator
- `src/components/` components and `prism.css`
- `src/foundations/` live foundation pages that read `tokens.json`
- `src/docs/` MDX docs with usage do and don't
- `src/patterns/screens.tsx` full scenario screens
- `src/stories/` component stories
