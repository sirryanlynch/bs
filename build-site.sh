#!/usr/bin/env bash
# Rebuild site/prototype and site/storybook from this repo.
# Paths are relative to this script, so it works from any working directory.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

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
touch "$ROOT/site/.nojekyll"
echo "site/ is ready. Serve it with: python3 -m http.server 8080 -d \"$ROOT/site\""
