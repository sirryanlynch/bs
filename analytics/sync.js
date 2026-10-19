#!/usr/bin/env node
/* Copy analytics/config.js and analytics/ga.js into the places the site, prototype, and Storybook serve.
   GA_MEASUREMENT_ID rewrites the id in those copies. The source file stays empty. */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const raw = String(process.env.GA_MEASUREMENT_ID || "").trim();
const valid = /^G-[A-Z0-9]+$/i.test(raw);
if (raw && !valid) {
  console.warn("GA_MEASUREMENT_ID is not a GA4 id (expected G- plus letters and numbers). Analytics stays off.");
}
const id = valid ? raw : "";

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

if (id) console.log("Analytics enabled for " + id);
else console.log("Analytics copies written with an empty measurement id.");
