# TripUp

TripUp is a group trip app for the two arguments every trip has: where to eat, and who owes what. I designed one night in Lisbon, from Ren joining on a guest link through a dinner poll to a bill that squares up. This repo holds the case study, the clickable prototype, and Prism, the design system behind both.

## See it

- [Case study](https://sirryanlynch.github.io/bs/)
- [Prototype](https://sirryanlynch.github.io/bs/prototype/)
- [Storybook](https://sirryanlynch.github.io/bs/storybook/)
- [Figma](https://www.figma.com/design/z4TesJNPe6UfvgwmWtIA4y/TripUp-Working)

The prototype is one scenario with seven friends. You can play as Ari, Nic, or Ren, walk the 13 steps, or let the guided tour play.

## Repo

| Path | What it is |
| --- | --- |
| `site/` | The published site: case study, built prototype, built Storybook. Paths are relative, so the folder works at `/bs/`. |
| `prototype/` | React, Vite, and TypeScript. It imports Prism from `storybook/src`. |
| `storybook/` | Storybook 8 for Prism. |
| `design-system/` | `tokens.json`, `tokens.css`, and `build_tokens.py`. |
| `moodboards/` | Direction boards: Prism, Golden Hour, Night Out, and shared foundations. |
| `analytics/` | The GA4 loader. The measurement id ships empty, so analytics stays off until you set one. |
| `research-review.md` | Desk research notes from the take-home. |
| `build-site.sh` | Rebuilds `site/prototype` and `site/storybook` from source. |

## Run locally

Storybook and the prototype share one `node_modules`. Install it in `storybook/`, then point the prototype at it.

```bash
cd storybook
npm ci
cd ../prototype
ln -sfn ../storybook/node_modules node_modules
npm run dev
```

Prototype: http://localhost:5174

Storybook:

```bash
cd storybook
npm run storybook
```

Storybook: http://localhost:6006

Rebuild the static site from the repo root. The script finds its own directory, so the working directory does not matter.

```bash
./build-site.sh
python3 -m http.server 8080 -d site
```

Open http://localhost:8080 . `site/.nojekyll` is included so GitHub Pages serves Storybook files whose names start with an underscore.

## Analytics

GA4 is wired through one value, `GA_MEASUREMENT_ID`. It is empty in `analytics/config.js`. Leave it empty and the loader does nothing: no gtag script, no cookie.

To turn it on for the published site, add a repository variable named `GA_MEASUREMENT_ID` (Settings → Secrets and variables → Actions → Variables) with your `G-` id. The next push to `main` rebuilds the site with that id. For a local build:

```bash
GA_MEASUREMENT_ID=G-XXXXXXXX ./build-site.sh
```

The value has to look like `G-` plus letters and numbers. Anything else is ignored and analytics stays off.

Once an id is set, the case study, the prototype, and Storybook (manager and preview) load gtag.js. Do Not Track and Global Privacy Control still keep it off.

Events:

- `page_view` for each prototype step, using the hash route (`#/live` and the rest)
- `guided_tour_start` and `guided_tour_complete`
- `step_jump` from the step list, next, or previous
- `play_as` when the person changes (Ari, Nic, Ren)
- `compare_hifi` when the Figma compare mode changes
- `theme_toggle` and `reduce_motion_toggle` in the prototype and in Storybook
- `tie_break` when the tie-break path is switched
- `poll_vote`, `expense_added`, and `settle_complete`
- `outbound_click` for links to the Figma file and to Storybook
- `scroll_depth` on the case study at 25, 50, 75, and 100 percent

Consent mode starts denied for analytics and ads. `analytics_storage` is granted only when a measurement id is set and Do Not Track is off. `anonymize_ip` is on. A cookie banner is unnecessary: with the id empty, or with Do Not Track on, gtag.js never loads.

## Publish

Pushes to `main` run `.github/workflows/pages.yml`. The workflow installs dependencies, builds Storybook and the prototype, assembles `site/`, and deploys that folder with GitHub Pages. If the source build fails, the workflow uploads the `site/` folder already in the repo.
