#!/usr/bin/env bash
# Builds Storybook and the prototype, then assembles the GitHub Pages folder in site/.
# Paths are relative to this script, so it works from any working directory.
#
# site/ layout (all links relative, so it works under /bs/ on GitHub Pages):
#   index.html        the deck (entry page). Hand-written, no build step.
#   deck/             deck CSS, JS, data, thumbnails, and images
#   case-study/       the long-form case study. Hand-written, no build step.
#   assets/           images and fonts used by the case study
#   prototype/        built here from prototype/dist
#   storybook/        built here from storybook/storybook-static
#
# Only prototype/ and storybook/ are deleted and rebuilt. index.html, deck/, case-study/ and assets/ stay.
# Pass --deck-only to refresh just the deck assets (tokens, photos, mood boards, exports) without rebuilding anything else.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

refresh_deck() {
  if [[ ! -d "$ROOT/moodboards/photos" || ! -d "$ROOT/exports" ]]; then
    echo "Deck source images are not in this checkout (moodboards/photos and exports/). Keeping site/deck/ as it is."
    return 0
  fi
  python3 "$ROOT/deck-src/build_deck_assets.py"
}

if [[ "${1:-}" == "--deck-only" ]]; then
  refresh_deck
  node "$ROOT/analytics/sync.js"
else
  if [[ ! -d "$ROOT/storybook/node_modules" ]]; then
    echo "Install dependencies first: (cd \"$ROOT/storybook\" && npm ci)" >&2
    exit 1
  fi
  if [[ ! -e "$ROOT/prototype/node_modules" ]]; then
    ln -sfn ../storybook/node_modules "$ROOT/prototype/node_modules"
  fi

  node "$ROOT/analytics/sync.js"
  (cd "$ROOT/storybook" && npm run build-storybook)
  (cd "$ROOT/prototype" && npm run build)
  rm -rf "$ROOT/site/prototype" "$ROOT/site/storybook"
  cp -a "$ROOT/prototype/dist" "$ROOT/site/prototype"
  cp -a "$ROOT/storybook/storybook-static" "$ROOT/site/storybook"
  refresh_deck
fi

for f in site/index.html site/deck/deck.js site/deck/deck.css site/deck/data.js site/case-study/index.html; do
  [[ -f "$ROOT/$f" ]] || { echo "Missing $f. Restore it from git; the build does not generate it." >&2; exit 1; }
done
touch "$ROOT/site/.nojekyll"
echo "site/ is ready. Serve it with: python3 -m http.server 8080 -d \"$ROOT/site\""
