#!/usr/bin/env node
/* Copy analytics/config.js and analytics/ga.js into the places the site, prototype, and Storybook serve.
   GA_MEASUREMENT_ID rewrites the id in those copies when it is a valid G- id.
   When the variable is unset, the public default is used.
   The same id is written into the deck's ga-measurement-id meta tag. */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const DEFAULT_ID = "G-T7WTSRRSGT";
const raw = String(process.env.GA_MEASUREMENT_ID || "").trim();
const valid = /^G-[A-Z0-9]+$/i.test(raw);
if (raw && !valid) {
  console.warn("GA_MEASUREMENT_ID is not a GA4 id (expected G- plus letters and numbers). Using " + DEFAULT_ID + ".");
}
const id = valid ? raw : DEFAULT_ID;

const config = fs
  .readFileSync(path.join(root, "analytics", "config.js"), "utf8")
  .replace(/window\.GA_MEASUREMENT_ID\s*=\s*(['"]).*?\1\s*;/, "window.GA_MEASUREMENT_ID = " + JSON.stringify(id) + ";");
const ga = fs.readFileSync(path.join(root, "analytics", "ga.js"));

for (const rel of ["storybook/public/analytics", "prototype/public/analytics", "site/analytics"]) {
  const dir = path.join(root, rel);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "config.js"), config);
  fs.writeFileSync(path.join(dir, "ga.js"), ga);
}

const deckPath = path.join(root, "site", "index.html");
if (fs.existsSync(deckPath)) {
  const html = fs.readFileSync(deckPath, "utf8");
  const meta = /(<meta\s+name=["']ga-measurement-id["']\s+content=["'])[^"']*(["'])/i;
  if (!meta.test(html)) {
    console.warn("site/index.html has no ga-measurement-id meta tag. The deck will not receive " + id + ".");
  } else {
    const next = html.replace(meta, function (_m, open, close) { return open + id + close; });
    if (next !== html) fs.writeFileSync(deckPath, next);
  }
}

console.log("Analytics enabled for " + id);
