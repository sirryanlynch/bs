# TripUp prototype

React + Vite + TypeScript. It imports the Prism components and tokens straight from `../storybook/src` (alias `@sb`), so the prototype and Storybook share one source.

```bash
npm run dev      # http://localhost:5174
npm run build    # outputs dist/ with relative paths (base './')
```

`node_modules` is a symlink to `../storybook/node_modules`. On a fresh clone, run `npm install` in `storybook/` first.

## How it works

- `src/ledger.ts` holds the seven trip expenses. Balances, the six pairwise IOUs and the three simplified payments are all computed from them.
- `src/store.tsx` is the state machine: steps, actions, the vote stream, the scenario checklist, and `stateAt()`, which replays the path so deep links land in a consistent state.
- `src/screens*.tsx` and `src/renweb.tsx` are the screens. `src/App.tsx` is the device frame, reviewer panel, guided tour, shortcuts and hash routing.
- `public/hifi/` holds the Figma frames used by "Compare with hi-fi".

## Keyboard

Left and right arrows step through, Space plays the tour, 1 2 3 switch between Ari, Nic and Ren, C compares with hi-fi, D toggles dark mode, M toggles Reduce Motion, R resets.
