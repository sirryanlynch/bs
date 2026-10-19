# TripUp site

Everything here is static and uses relative paths, so it works from a GitHub Pages project URL such as `https://sirryanlynch.github.io/bs/`.

| Path | What it is |
|---|---|
| `/` | The deck: 9 slides, research first, then decisions, then the product (`index.html` + `deck/`) |
| `/case-study/` | Long-form case study |
| `/prototype/` | Interactive prototype (React + Vite build) |
| `/storybook/` | Prism design system (Storybook static build) |

## Deck

- Keys: arrows, Space, Page Up/Down, Home/End, 1 to 9. `O` or `G` shows all slides, `T` labels the design tokens, `R` previews Reduce Motion. Slide 10 is End or the last arrow.
- Each slide has a hash (`#1` to `#10`). Arrow keys, Space, the dock arrows, a horizontal swipe or a click on empty space move between slides. Scrolling never changes slides.
- The iPhone on slides 1, 7 and 9 is one live embed of `prototype/?embed=1` that moves between slides.
- Content and sources for the interactive parts live in `deck/data.js`. Overview thumbnails are in `deck/thumbs/` (regenerate with `qa/deck.cjs`).
- GA4: `./build-site.sh` writes `G-T7WTSRRSGT` into the `ga-measurement-id` meta tag (a `GA_MEASUREMENT_ID` override replaces it). Each slide change sends a `slide_view` event. The deck, case study, and prototype share that id. Do Not Track keeps the loader off.

## Run locally

```bash
python3 -m http.server 8080 -d site
# open http://localhost:8080/
```

## Rebuild

From the `tripup/` folder run `./build-site.sh`. It rebuilds the prototype and Storybook and refreshes deck assets. `./build-site.sh --deck-only` refreshes only the deck assets. It never deletes the deck or the case study.

## Publish to GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`. The workflow builds the prototype and Storybook from source, keeps this deck and case study, and deploys `site/`. `.nojekyll` stays so folders that start with an underscore are served. Pages source is GitHub Actions.

## Prototype URLs

- Deep link to any step: `prototype/#/live`, `prototype/#/money`, and so on.
- Play as someone else: `prototype/#/live?as=ren` or `?as=nic`.
- Tie-break path: `prototype/#/closed?tie=1`.
- Autoplaying device only, for embeds: `prototype/?embed=1`.
