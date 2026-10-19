# TripUp case study site

Everything here is static and uses relative paths, so it works from a GitHub Pages project URL such as `https://<user>.github.io/<repo>/`.

| Path | What it is |
|---|---|
| `/` | Case study landing page (`index.html`, no build step) |
| `/prototype/` | Interactive prototype (React + Vite build) |
| `/storybook/` | Prism design system (Storybook static build) |

## Run locally

```bash
python3 -m http.server 8080 -d site
# open http://localhost:8080/
```

## Rebuild

From the repo root run `./build-site.sh`. It builds Storybook and the prototype and copies both into this folder.

## Publish to GitHub Pages

Pushes to `main` run `.github/workflows/pages.yml`. The workflow rebuilds this folder from source and deploys it. `.nojekyll` stays in place so files whose names start with an underscore are served.

## Prototype URLs

- Deep link to any step: `prototype/#/live`, `prototype/#/money`, and so on.
- Play as someone else: `prototype/#/live?as=ren` or `?as=nic`.
- Tie-break path: `prototype/#/closed?tie=1`.
- Autoplaying device only, for embeds: `prototype/?embed=1`.
