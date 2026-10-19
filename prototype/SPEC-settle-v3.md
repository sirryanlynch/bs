# Settle-up v3 parity spec (Figma file z4TesJNPe6UfvgwmWtIA4y, 18 Oct 2026)

These numbers come from `ledger.ts`: pairwise() and then simplify() run on baseExpenses plus tonight's dinner (Ari paid €248.70, with Ren and Nic taken off the wine). If the ledger changes, Figma has to change with it.

## Debt Simplification, 3 states (Figma set 121:4174, card 362×268)
- Node ring (centres, 30px circles): Ari 181,64 · Sofia 278,85 · Nic 302,132 · Mara 235,170 · Tomás 127,170 · João 60,132 · Ren 84,85.
- **Tangled** (6 IOUs, €190.60): Ari→Tomás 42.10, Tomás→Nic 42.10, Ren→Ari 18.40, Mara→João 40.00, Mara→Sofia 24.00, Sofia→João 24.00. Threads use text/secondary at 1.5px with arrowheads and mono amount tags. Counter: `6 IOUs`.
- **Netting**: threads fade to 25% with no arrows. Each node shows its net below it (Ari and Sofia above): Ari −23.70, Ren −18.40, Mara −64.00 (status/owe); Nic +42.10, João +64.00 (status/owed); Sofia 0.00, Tomás 0.00 (text/tertiary, grey node). Counter: `Σ 0.00`.
- **Solved** (3 payments, €124.50): Ari→Nic €42.10, Ren→Ari €18.40, Mara→João €64.00. Accent/primary at 2px with € tags. The arrows don't cross. Counter: `6 → 3`.
- Stepper: `1 Tangled — 2 Netting — 3 Solved` (the active step is accent).
- Readout strip (bg/sunken, mono 11/14):
  - Tangled: `in   6 IOUs · 7 people · €190.60` / `next sum each person: paid minus owed`
  - Netting: `net  +106.10 owed · −106.10 owe` / `2 creditors · 3 debtors · 2 at zero`
  - Solved: `out  3 payments · €124.50` / `saved 3 payments · €66.10 less moved`
- Mono stack: `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace` (token `font.mono`).
- Motion: Tangled→Netting→Solved at about 600ms per step, standard easing. Threads fade, nets count up, then payment arrows draw in. With Reduce Motion, cross-fade the three states at 200ms each with no path drawing.

## Screens
- 09a Tangled (201:9341). Caption: "2 IOUs: you owe Tomás €42.10. Ren owes you €18.40." Log card `IOUS · 6 · €190.60 MOVED` lists the 6 IOUs; rows that involve Ari use text/primary. Button: "Simplify 6 IOUs".
- 09b Netting (201:9484). Caption: "Every IOU becomes one net balance per person." Log `NET = PAID − SHARE · Σ 0.00`. The button "Finding the fewest payments" is disabled.
- 09 Balances (137:6808, dark 137:6901): Solved state. Row reasons: "Tejo boat tour, via Tomás" · "Dinner share minus Fado tickets" · "Flat deposit, via Sofia". CTA "Pay Nic €42.10".

## All squared up (104:3446, overlay 121:4318)
- Glass sheet: bg/surface at 90%, background blur 24, shadow/float, scrim bg/scrim with blur 12.
- One spectrum glow (angular gradient, 132px, layer blur 26, 85%) sits behind a 64px surface disc that holds a drawn check. That glow is the only colour moment. No confetti, no 3D render, no gradient text, no rainbow stripes.
- Mono eyebrow `22:41 · LISBON CREW · SETTLED`. Serif title "All squared up." in text/primary. Body "3 payments, €124.50 in total. Everyone in Lisbon Crew is at €0.00."
- Mono receipt (bg/sunken 80%): `Ari → Nic €42.10 22:39` / `Ren → Ari €18.40 22:40` / `Mara → João €64.00 cash ✓` / `total €124.50 3 of 3`. Primary button: "Share the recap".
- Reduce Motion: the glow is static and the sheet fades in.
