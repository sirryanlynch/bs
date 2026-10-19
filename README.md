# TripUp

TripUp is a group trip app for the two arguments every trip has: where to eat, and who owes what. I designed one night in Lisbon, from Ren joining on a guest link through a dinner poll to a bill that squares up. This repo holds a ten-slide deck, the long case study, the clickable prototype, and Prism, the design system behind both.

## See it

- [Deck](https://sirryanlynch.github.io/bs/)
- [Case study](https://sirryanlynch.github.io/bs/case-study/)
- [Prototype](https://sirryanlynch.github.io/bs/prototype/)
- [Storybook](https://sirryanlynch.github.io/bs/storybook/)
- [Figma](https://www.figma.com/design/z4TesJNPe6UfvgwmWtIA4y/TripUp-Working)

The prototype is one scenario with seven friends. You can play as Ari, Nic, or Ren, walk the 13 steps, or let the guided tour play. Settle-up screens are `#/settle/cash` and `#/settle/confirm?as=nic`. Full JTBD analysis screens are `#/beyond/explore` and the other beyond routes. `?mode=self` and `?mode=tour` choose self guided or the guided tour.

## Repo

| Path | What it is |
| --- | --- |
| `site/` | The published site. The deck is `index.html`, the case study is `case-study/`, and the built prototype and Storybook sit beside them. Paths are relative, so the folder works at `/bs/`. |
| `prototype/` | React, Vite, and TypeScript. It imports Prism from `storybook/src`. |
| `storybook/` | Storybook 8 for Prism. |
| `design-system/` | `tokens.json`, `tokens.css`, and `build_tokens.py`. |
| `deck-src/` | `build_deck_assets.py` refreshes deck images when the source photos and exports are present. |
| `moodboards/` | Direction boards: Prism, Golden Hour, Night Out, and shared foundations. |
| `analytics/` | The GA4 loader. Builds write `G-T7WTSRRSGT` unless `GA_MEASUREMENT_ID` is set. |
| `qa/` | Checks I used while building the deck and the prototype. |
| `research-review.md` | Desk research notes from the take-home. |
| `build-site.sh` | Rebuilds `site/prototype` and `site/storybook` from source and keeps the deck and case study. |

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

GA4 uses one measurement id. The public default is `G-T7WTSRRSGT`. `./build-site.sh` writes that id into the deck meta tag, the case study, the prototype, and Storybook. A repository variable named `GA_MEASUREMENT_ID` (Settings → Secrets and variables → Actions → Variables) overrides it on the next push to `main`. A local override works the same way:

```bash
GA_MEASUREMENT_ID=G-XXXXXXXX ./build-site.sh
```

The value has to look like `G-` plus letters and numbers. Anything else is ignored and the build keeps `G-T7WTSRRSGT`.

The deck, the case study, the prototype, and Storybook (manager and preview) load gtag.js for that property. Do Not Track and Global Privacy Control still keep the loader off: no gtag script, no cookie.

Events:

- `slide_view` on the deck, with the slide number and title
- `jtbd_drawer_open` when the deck opens the jobs drawer
- `page_view` for each prototype step, using the hash route (`#/live`, `#/settle/cash`, and the rest)
- `guided_mode_select` when someone chooses self guided or the guided tour
- `guided_tour_start` and `guided_tour_complete`
- `step_jump` from the step list, next, or previous
- `play_as` when the person changes (Ari, Nic, Ren)
- `theme_toggle` and `reduce_motion_toggle` in the prototype and in Storybook
- `tie_break` when the tie-break path is switched
- `poll_vote`, `expense_added`, and `settle_complete`
- `outbound_click` for new-tab links on the deck and case study, and for Figma, prototype, and Storybook links in the prototype
- `scroll_depth` on the case study at 25, 50, 75, and 100 percent

Consent mode starts denied for analytics and ads. `analytics_storage` is granted only when a measurement id is set and Do Not Track is off. `anonymize_ip` is on. A cookie banner is unnecessary: with Do Not Track on, gtag.js never loads.

## Publish

Pushes to `main` run `.github/workflows/pages.yml`. The workflow installs dependencies, builds Storybook and the prototype, assembles `site/`, and deploys that folder with GitHub Pages. If the source build fails, the workflow uploads the `site/` folder already in the repo.

The workflow also asks GitHub to enable Pages and set the source to GitHub Actions. The default Actions token cannot create the Pages site. If the run reports "Create Pages site failed", open the repo Settings, choose Pages, set the source to GitHub Actions, and re-run the workflow.
