# TripUp site

Everything here is static and uses relative paths, so it works from a GitHub Pages project URL such as `https://sirryanlynch.github.io/bs/`.

| Path | What it is |
|---|---|
| `/` | The deck: 9 slides, research first, then decisions, then the product (`index.html` + `deck/`) |
| `/case-study/` | Long-form case study |
| `/prototype/` | Interactive prototype (React + Vite build) |
| `/storybook/` | Prism design system (Storybook static build) |

## Deck

- Keys: arrows, Space, Page Up/Down, Home/End, 1 to 9. `O` or `G` shows all slides, `T` labels the design tokens, `R` previews Reduce Motion.
- Each slide has a hash (`#1` to `#9`). Arrow keys, Space, the dock arrows, a horizontal swipe or a click on empty space move between slides. Scrolling never changes slides.
- The iPhone on slides 1, 7 and 9 is one live embed of `prototype/?embed=1` that moves between slides.
- Content and sources for the interactive parts live in `deck/data.js`. Overview thumbnails are in `deck/thumbs/` (regenerate with `qa/deck.cjs`).
- GA4: `analytics/sync.js` writes the measurement id into the `ga-measurement-id` meta tag. The default is `G-T7WTSRRSGT`. Slide changes send `slide_view`. Opening the jobs drawer sends `jtbd_drawer_open`. Links that open a new tab send `outbound_click`. Do Not Track keeps the loader off.

## Run locally

```bash
python3 -m http.server 8080 -d site
# open http://localhost:8080/
```

## Rebuild

From the repo root run `./build-site.sh`. It rebuilds the prototype and Storybook from source and leaves the deck and case study in place. `./build-site.sh --deck-only` refreshes deck assets when `moodboards/photos` and `exports/` are in the checkout.

## Publish to GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`. The workflow builds Storybook and the prototype, assembles this folder, and deploys it with GitHub Pages. Keep the `.nojekyll` file so folders that start with an underscore are served. Pages source is GitHub Actions.

## Prototype URLs

- Deep link to any step: `prototype/#/live`, `prototype/#/money`, and so on.
- Play as someone else: `prototype/#/live?as=ren` or `?as=nic`.
- Tie-break path: `prototype/#/closed?tie=1`.
- Autoplaying device only, for embeds: `prototype/?embed=1`.
