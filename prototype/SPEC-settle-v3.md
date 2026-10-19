# Settle-up v3 parity spec (Figma file z4TesJNPe6UfvgwmWtIA4y, Oct 18, 2026)

These numbers come from `ledger.ts`: pairwise() and then simplify() run on baseExpenses plus tonight's dinner (Ari paid $248.70, with Ren and Nic taken off the wine). If the ledger changes, Figma has to change with it.

## Debt Simplification v4 "Instrument" (superseded by v5.1 below, kept for reference)
I built two directions on the board "Explore · Tangled graph directions" next to the component in Design System. A (Instrument) uses graphite threads, a dot grid, crossing knots and a mono panel. B (Flow) tints every IOU Iris and adds particles. I chose A because Iris stays reserved for the answer: in Solved the three payment arcs are the only purple lines on the card, so the eye lands on them. B made the mess look like the answer.

All coordinates are inside the 362×268 card (radius 20, bg/surface, shadow/card). Graph center CX 181, CY 112.

### Nodes
| key | name | center | net |
|---|---|---|---|
| A | You (Ari) | 181,58 | −23.70 |
| S | Sofia | 278,80 | 0.00 |
| N | Nic | 306,126 | +42.10 |
| M | Mara | 236,166 | −64.00 |
| T | Tomás | 126,166 | 0.00 |
| J | João | 56,126 | +64.00 |
| R | Ren | 84,80 | −18.40 |

- Chip: 32px circle, bg/surface-raised, 1px border/subtle, shadow rgba(20,18,51,0.10) y1 blur3. Monogram SF Pro Semibold 12, text/primary. Ari's chip is filled accent/primary with text/on-accent.
- Ring: 40px track around the chip, arc inner radius 0.93, border/subtle.
- Balance arc (Netting and Solved only): inner radius 0.90, sweep = |net| / 64.00 × 360°. Positive nets sweep clockwise from 12 o'clock in status/owed. Negative nets sweep counter-clockwise in status/owe. Zero nets show the track only.
- In Solved, zero-net nodes (Sofia, Tomás) drop to 38% opacity and their labels to 45%.

### Labels
- Frame with horizontal auto layout, gap 4, padding 1/4, radius 4, bg/surface at 88%. Name in mono/tag (JetBrains Mono 10), text/tertiary in Tangled and text/secondary after. Netting and Solved add the signed net in mono/tag, colored status/owed, status/owe or text/tertiary.
- Placement: centered above the node when its y < CY − 20, otherwise centered below, 3px off the 40px ring.
- Ari: right of the chip at x + 25, vertically centered. In Netting and Solved the label stacks name over net (vertical, gap 0) so it stays clear of Sofia's.
- Sofia in Netting and Solved: x is clamped to at least 256 and at most 354 − width.

### Technical layer (all states)
- Dot grid: 12px pitch, x 13 to 349, y 34 to 194, 1.25px dots, radial gradient border/strong at the center to border/subtle at 60% to transparent.
- Orbit: dashed ellipse 250×108 centered on CX, CY, border/strong 0.75px, dash 1.5 / 3.5.
- Side ticks every 12px, every 4th one longer, text/tertiary at 45%.
- Crosshair at the center in Solved only.
- Stepper at 16,11 in mono/micro (10/12, +0.4 tracking): `01 TANGLED`, `02 NETTING`, `03 SOLVED`, joined by 12px hairlines. The active step is accent/text with a filled dot. The others are text/tertiary with a hollow dot.

### Edge geometry
- Each edge is a quadratic bezier. Control = midpoint + (center − midpoint) × bend. It starts 24px from the source center and ends 23px from the target center.
- Bend search: try |bend| from 0.46 down to 0.06 in the preferred sign, keep the first value that clears every other node by at least 27px, then try the opposite sign. Preferred bends: Ari→Tomás 0.12, Ren→Ari 0.25, Mara→João 0.15, Mara→Sofia 0.10, Sofia→João 0.10, Tomás→Nic 0.28. In Solved: Ari→Nic 0.30, Ren→Ari 0.30, Mara→João 0.35.
- Tags: pill, width = characters × 6 + 10, height 14, radius 7, mono/tag. They are placed by searching t from 0.22 to 0.78 and perpendicular offsets 0, ±6, ±11, ±14, scoring overlap with nodes, labels, other tags, other curves and the card bounds. No tag may overlap anything.

### Tangled
- 6 threads. Weight = 1 + 1.5 × min(amount, 42.10) / 42.10, so 42.10 is 2.5px and 18.40 is 1.66px.
- Stroke gradient along the flow: border/strong at 0, text/tertiary at 0.22, text/secondary at 1. Round caps.
- Arrowhead: filled triangle in text/secondary, base 7px behind the tip, half-width max(3, 1.35 × weight). The curve is shortened by 5.5px so it doesn't poke through.
- Crossings are computed from 48-segment polylines, ignoring points within 26px of a node. That gives 4. Each one gets a 12px glow (accent/primary at 10%, layer blur 4) under a 5px knot (bg/surface fill, 1px accent/primary at 60%).
- Tags: bg/surface at 96%, 1px border/strong, text/secondary.
- Panel: `IOUS 6 · 7 people` | `CROSSINGS 4` | `FLOW $190.60`.

### Netting
- Threads go dashed 2/3, 1px, text/tertiary at 35%, with no arrowheads or tags.
- Endpoint dots, 5px: status/owe where money leaves, status/owed where it lands.
- Center pill `Σ 0.00` in mono/tag.
- Balance arcs appear on every ring.
- Panel: `Σ NET 0.00 ✓` | `OWED +106.10` | `OWE −106.10`.

### Solved
- 3 arcs: Ari→Nic 42.10, Ren→Ari 18.40, Mara→João 64.00. Weight 3px when the amount is ≥ 40, otherwise 2.25px. None cross.
- Gradient along the flow: accent/subtle at 0, accent/primary at 0.35, accent/primary at 1. Arrowheads in accent/primary.
- Tags: bg/surface, 1px accent/subtle, accent/text, `$42.10` style.
- Panel: `PAYMENTS 3 was 6` | `FLOW $124.50` | `SAVED 50% 3 fewer`.

### Instrument panel
- At 16,206, 330×50, radius 12, bg/sunken at 55%, 1px border/subtle inside. Three equal cells with 1px border/subtle dividers. Each cell has a caption in mono/micro text/tertiary over a value in mono/value (JetBrains Mono Medium 13/16) text/primary. Status values use status colors.

### Motion
| step | duration | easing | what moves |
|---|---|---|---|
| Tangled in | 400ms | cubic-bezier(0.2,0,0,1) | Threads draw from source to target (stroke-dashoffset), staggered 40ms. Knots scale from 0.6 to 1 after their threads land. |
| Tangled → Netting | 600ms | cubic-bezier(0.2,0,0,1) | Threads fade to 35% and switch to dashed over the first 200ms. Arrowheads, tags and knots fade out. Balance arcs sweep from 0 to their angle over 600ms. Nets count up from 0.00 in tabular figures. The Σ pill fades in at 400ms. |
| Netting → Solved | 600ms | cubic-bezier(0.2,0,0,1) | Dashed threads fade out over 200ms. The 3 payment arcs draw on, staggered 80ms, then arrowheads and tags fade in. Zero-net nodes dim to 38%. Panel values cross-fade. |
| Haptics | | | `.light` impact when each payment arc lands, `.success` notification when Solved settles. |

Reduce Motion: no path drawing and no count-up. Each state cross-fades at 200ms linear. Rings show at their final sweep. Haptics stay.

## Debt Simplification v5.1 restraint pass (Figma set 121:4174, card 362×268)

v5 looked busy in a way that made you work. Each element was decorated: ribbons, tokens, gauges, chips, knot glyphs, a grid. v5.1 keeps the same card, node positions, data, netting math and panel copy, and strips the decoration back out. The mess in Tangled now comes from composition alone: threads that cross through the middle of the card, with slightly uneven curves. The calm comes from the palette. Solved is sparse, so the contrast between the two states is the point of the feature: TripUp is the thing that untangles it.

Variants: State=Tangled 121:4135, State=Netting 197:8975, State=Solved 121:4153. Used by hi-fi 09a 201:9341, 09b 201:9484, 09 137:6808, 09 dark 137:6901 and 178:14588, the walkthrough slide 08 and Deck (web) slide 08.

### What v5.1 removed

| Removed | Why |
|---|---|
| Source chips (Dinner, Boat tour, Flat, Fado) | They added four more labels to a state that is already dense. The IOU table under the card says where each debt came from. |
| Money tokens and their motion | The motion competed with the threads for attention and said nothing new. |
| 12-tick gauge rings and balance arcs | Rose and jade now appear only in the balance text, as in the rest of the app. |
| HUD dot grid and edge ticks | Background noise behind the graph. |
| On-thread $ tags in Tangled | The table directly below the card lists all six amounts. |
| Knot beads, twist glyphs and the untie spring | Replaced by a small hollow dot. |
| Ribbon glow, gradient body and sheen | One flat stroke per thread. |
| The iridescent rim on You, photo highlights | Avatars stay as photos, unchanged in style. |
| Solver core in Tangled and Solved | The core only appears while the work is happening. |

### Layers (back to front)

| # | Layer | Contents |
|---|---|---|
| 1 | Light field | Pearl highlight (`bg/surface`, 220×120, blur 40, 50%) in every state. Netting adds a 64 pt Iris core halo at 10%, blur 16. Solved adds one Iris glow, 240×150 at 5%, blur 50. Clipped to the card. |
| 2 | Threads | IOU threads and crossing dots (Tangled), spokes (Netting), payment arcs (Solved). |
| 3 | Core | Netting only: solver core, 40×40, centered at (CX, CY − 4). Solved: the glint. |
| 4 | Nodes | Medallions. |
| 5 | Labels and tags | Name and net labels, Σ pill, the 3 Solved tags. |
| 6 | Stepper and panel | Panel is glass, `bg/surface` 70% with background blur 12. |

No parallax. Labels and tags are placed so that nothing overlaps a medallion or another label (checked in the build script: 0 label hits, at least 25 pt between a thread and any node it doesn't connect).

### Medallion (44 pt node)

- 36 pt circle, `bg/surface-raised`, 1 pt inside stroke `border/subtle`, one shadow `0 2 6 rgba(20,18,51,.10)`.
- Photo: 32 pt circle, `object-fit: cover`, inset 2 pt from the medallion edge.
- Zero-net people (Sofia, Tomás) drop to 40% opacity in Solved.
- Photos: `/workspace/tripup/exports/settle-v5/avatars/{ari,sofia,mara,ren,nic,tomas,joao}.jpg` (192 px, Pexels, credits in `CREDITS.md`).

```css
.node { width: 44px; height: 44px; position: relative; }
.node .disc { position: absolute; inset: 4px; border-radius: 50%;
  background: var(--bg-surface-raised); box-shadow: inset 0 0 0 1px var(--border-subtle), 0 2px 6px rgb(20 18 51 / .10); }
.node img { position: absolute; inset: 6px; width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.node.zero.solved { opacity: .4; }
```

### Labels

SF Mono name in `text/secondary`, net in `status/owed` or `status/owe` (Netting and Solved only), on a `bg/surface` 85% plate with no shadow and no blur. You sits to the right of its node, vertically centered. Nodes in the top half sit their label 2 pt above the medallion, the rest 1 pt below.

### Tangled

- Six threads, one color: `text/secondary` at 72%. Two weights only: 2 pt for IOUs of $30 and up, 1.25 pt below.
- Geometry: a cubic Bézier from 21 pt outside each node center. The control point is pulled toward the card center (bend 0.45 preferred, searched from 0.6 to −0.3) and each curve gets a small sideways skew (6, −5, 4, −7, 5, −4 pt) so the curves look hand drawn. The search prefers the path that passes closest to the center, which puts the density in the middle of the card.
- Arrowhead: filled triangle 6 pt deep, half-width 3.2 pt on 2 pt threads and 2.6 pt on 1.25 pt threads, same color.
- Crossings: a 6 pt dot, `bg/surface` fill and a 0.75 pt `text/tertiary` ring at 55%, at each computed crossing. This data has 4, and the panel shows the computed count.
- No amounts on the threads. Panel: IOUS 6 · 7 people, CROSSINGS 4 · knots, FLOW $190.60.

```svg
<path d="M sx sy C c1x c1y c2x c2y ex ey" fill="none" stroke="var(--text-secondary)" stroke-opacity=".72" stroke-width="2" stroke-linecap="round"/>
<circle cx="kx" cy="ky" r="3" fill="var(--bg-surface)" stroke="var(--text-tertiary)" stroke-opacity=".55" stroke-width=".75"/>
```

### Netting

- Threads are gone. The solver core (40 pt) sits at the center with a soft halo.
- Spokes: straight 1.25 pt lines in `accent/primary` at 45%, from 22 pt outside each nonzero node to the core rim (r 20). No status color on the spokes; the net amounts in the labels carry rose and jade.
- Σ 0.00 pill under the core at CY + 20, `accent/text` on `bg/surface` 92%.
- Panel: Σ NET 0.00 ✓, OWED +106.10, OWE −106.10.
- Core assets (transparent, 384 px, 48 frames at 24 fps): `/workspace/tripup/exports/settle-v5/solver-core/core-netting-{light,dark}.webm` and the PNG sequence `solver-core/{light,dark}/netting/000.png` to `047.png`. Safari doesn't play VP9 alpha, so web uses the PNG sequence on a canvas there. The dark core is an image override on the dark instances. Source: `/workspace/tripup/render-v5/core.html`.

### Solved

- Three Iris arcs, 2.25 pt `accent/primary`, quadratic, with arrowheads: You → Nic $42.10, Ren → You $18.40, Mara → João $64.00.
- One $ tag per arc, `accent/text` on `bg/surface` with a 1 pt `accent/subtle` border, placed along the arc away from nodes, labels and the glint.
- Glint: the one moment of delight and the only place the spectrum shows. A 20 pt spectrum halo with a 14 pt four-point white star at (CX, CY − 6).
- Panel: PAYMENTS 3 · was 6, FLOW $124.50, SAVED 50% · 3 fewer.

### Color rule

Iris is the only accent in every state: the active step, the core, the spokes, the arcs and their tags. Graphite carries Tangled. Rose (`status/owe`) and jade (`status/owed`) appear only in balance text.

### Timeline

| Step | Time | Easing | What happens |
|---|---|---|---|
| Tangled in | 0 to 500 ms | cubic-bezier(0.2,0,0,1) | Threads draw on (dashoffset), staggered 40 ms. Crossing dots fade in when both threads have landed. |
| Tangled to Netting | 0 to 800 ms | cubic-bezier(0.2,0,0,1) | 0 to 250 ms: threads and dots fade out. 150 ms: core fades in at 0.9 scale and settles to 1. 250 to 650 ms: spokes draw from each node to the core, staggered 40 ms. Nets count up in the labels. 650 ms: Σ pill fades in. |
| Netting to Solved | 0 to 900 ms | cubic-bezier(0.2,0,0,1) | 0 to 200 ms: spokes, Σ pill and core fade. 200 ms on: 3 Iris arcs draw, staggered 80 ms, 420 ms each. Tags fade in as each arc lands. Zero-net nodes dim to 40%. 750 ms: glint, scale 0.4 to 1 and rotate 0 to 45° over 400 ms, hold 400 ms, fade over 600 ms. Plays once per solve. |
| Haptics | | | `.light` when each arc lands, `.success` with the glint. |

### Reduce Motion

- Each state cross-fades in 200 ms linear. No draw-on, no core loop (the core shows its still).
- The glint shows as a static star for 1.2 s, then fades over 200 ms. Haptics stay.
- `prefers-reduced-transparency`: the panel and labels go to solid `bg/surface`, the light field is hidden.

### Performance

Six paths and four dots in Tangled. One canvas for the core in Netting. Animate only `stroke-dashoffset`, `opacity` and transforms. Target 60 fps on iPhone 12 and later, 120 fps on ProMotion.

## Screens
- 09a Tangled (201:9341). Caption: "2 IOUs: you owe Tomás $42.10. Ren owes you $18.40." Log card `IOUS · 6 · $190.60 MOVED` lists the 6 IOUs; rows that involve Ari use text/primary. Button: "Simplify 6 IOUs".
- 09b Netting (201:9484). Caption: "Every IOU becomes one net balance per person." Log `NET = PAID − SHARE · Σ 0.00`. The button "Finding the fewest payments" is disabled.
- 09 Balances (137:6808, dark 137:6901): Solved state. Row reasons: "Tejo boat tour, via Tomás" · "Dinner share minus Fado tickets" · "Flat deposit, via Sofia". CTA "Pay Nic $42.10".

## All squared up (104:3446, overlay 121:4318)
- Glass sheet: bg/surface at 90%, background blur 24, shadow/float, scrim bg/scrim with blur 12.
- One spectrum glow (angular gradient, 132px, layer blur 26, 85%) sits behind a 64px surface disc that holds a drawn check. That glow is the only color moment. No confetti, no 3D render, no gradient text, no rainbow stripes.
- Mono eyebrow `10:41 PM · LISBON CREW · SETTLED`. Serif title "All squared up." in text/primary. Body "3 payments, $124.50 in total. Everyone in Lisbon Crew is at $0.00."
- Mono receipt (bg/sunken 80%): `Ari → Nic $42.10 10:39 PM` / `Ren → Ari $18.40 10:40 PM` / `Mara → João $64.00 cash ✓` / `total $124.50 3 of 3`. Primary button: "Share the recap".
- Reduce Motion: the glow is static and the sheet fades in.

## Settle-up flow, cash path end to end (Figma section 09, y 7800 light, y 8800 dark)
Ten frames at 402×874, built from the 09 Balances chrome: Status Bar, glass Nav Bar (back label, serif title, subtitle), Content column at x 20, y 214, width 362, and the Home indicator. Dark frames are clones with the Semantic collection set to Dark and card/float/accent shadows swapped for their -dark styles. Edge E02 (143:6885) now uses S2.

| # | frame (light / dark) | nav back · title · subtitle | export |
|---|---|---|---|
| S1 | 226:6928 / 227:7211 | Money · Pay Nic · Payment 1 of 3 · simplified | settle-01-choose-method |
| S2 | 226:7018 / 227:7301 | Pay Nic · Cash for Nic · Count it out, then slide | settle-02-cash-count-round |
| S3 | 226:7100 / 227:7383 | same as S2, slider held at 78% | settle-03-cash-slide |
| S4 | 226:7183 / 227:7466 | Money · Cash for Nic · Waiting for Nic | settle-04-cash-pending-undo |
| S5 | 226:7245 / 227:7528 | Lisbon Crew · Did Ari pay you? · Nic's phone · cash · 10:39 PM | settle-05-nic-confirm |
| S6 | 226:7310 / 227:7593 | Lisbon Crew · Money · Whole trip · 7 people | settle-06-confirmed-1-of-3 |
| S7 | 226:7385 / 227:7668 | Money · Receipt · You → Nic · cash | settle-07-receipt |
| E1 | 226:7489 / 227:7772 | Pay Nic · Cash for Nic · Paying part now | settle-08-edge-partial-cash |
| E2 | 226:7563 / 227:7846 | Money · Pay Nic · Cash · needs a look | settle-09-edge-dispute |
| E3 | 226:7637 / 227:7920 | Money · Pay Nic · Cash · offline | settle-10-edge-offline |

### Shared parts
- Card: bg/surface, radius 20, padding 16, gap 12, shadow/card. Tone variants: rose uses status/owe-subtle fill with a status/owe 1px stroke.
- Pill: radius 999, padding 2/8, mono/tag. Tones: owed (status/owed-subtle on status/owed), owe, accent (accent/subtle on accent/text), neutral (bg/sunken on text/secondary).
- Pair hero: two 32px chips joined by a 56px Iris gradient arrow, amount in display/l (44), caption in ui/subhead text/secondary, pill top right.
- Mono readout: bg/sunken at 70%, radius 14, padding 12/14, gap 4. Header row in mono/micro text/tertiary with an optional pill. Rows are label left in mono/readout text/secondary, value right in mono/readout text/primary, tabular figures. Carried amounts use accent/text, gaps use status/owe.
- Overline: mono/micro, uppercase, text/tertiary.
- Primary CTA: Button Primary L, x 20, y 788, width 362. When a second button stacks, the primary sits at y 724.
- Every frame keeps a 16px gap between the last content block and the CTA or slider. Checked with an overlap audit on all 20 frames.

### S1 Choose how
- Hero: Ari → Nic, $42.10, caption "For the Tejo boat tour, routed through Tomás.", pill `1 OF 3`, link "Why $42.10" (opens S7's provenance block).
- Overline "HOW YOU'LL PAY", then a list card with 5 rows (36px tile, title ui/callout, meta ui/footnote, 22px radio on the right):
  - TripUp Pay · Visa •• 4821 · arrives now
  - MB WAY · +351 912 ••• 214 · opens MB WAY
  - Revolut · @nicmendes · opens Revolut
  - Bank transfer · PT50 •••• 0457 · 1 business day
  - Cash · Hand it over in person (selected in this flow)
- CTA label follows the selection: "Pay $42.10 with TripUp Pay", "Open MB WAY", "Open Revolut", "Copy bank details", "Continue with cash".
- MB WAY and Revolut hand off by deep link with the amount and reference `STL_7Q2K-0042` prefilled. On return, the app shows S4 with the copy "Did it go through?" and buttons "Yes, I sent it" and "Not yet", because those apps don't confirm back to us.

### S2 Count and round
- Hero card: overline HAND OVER, $42.00 in display/xl (56), pills `rounded from $42.10` (neutral) and `$0.10 carried` (accent).
- Round toggle card: "Round to $42.00" / "The $0.10 moves to the next split, so nobody counts coins tonight." Toggle on by default for cash.
- Count it out: bill pills `$20 × 2`, `$1 × 2` and `= $42.00`. Bills and coins come from a greedy split over US denominations: 100, 50, 20, 10, 5, 1, then 25¢, 10¢, 5¢, 1¢.
- Readout `CASH · YOU → NIC`: due 42.10 / hand over 42.00 / carry → next split 0.10.
- Row "Paying part of it?" opens E1.
- Slider "Slide to mark $42.00 paid".

### Rounding rules
- Cash only. Round to the nearest $1.00, so the change is never more than $0.50 either way. $42.10 becomes $42.00.
- The difference becomes a carry entry on the same pair (Ari ↔ Nic). It joins the next simplify() run. If the trip closes with a carry under $0.50 left, it is written off and shown as "rounded" in the recap.
- With the toggle off, hand over is the exact amount and the count includes coins.

### Slide to settle (S2, S3)
- Track 362×64, radius 32, bg/surface, 1px border/strong, shadow/card. Knob 56px accent/primary with shadow/accent, 4px inset, arrow icon 24 in text/on-accent.
- Progress fill from the left edge to knob + 60, linear gradient accent/subtle to accent/primary at 55%.
- Haptic ticks: 2×10 marks at 25%, 50%, 75% of travel. Each fires `.selection` haptic once per crossing and turns text/on-accent at 80% when passed.
- Past 50% the label fades and "Release to confirm" shows in text/on-accent. Past 92% the knob icon becomes a check and a `.medium` impact fires once.
- Release past 92%: the knob snaps to the end in 180ms ease-out, `.success` notification, go to S4. Release earlier: spring back to 0 (stiffness 400, damping 30), no haptic.
- Content above dims to 55% while the knob is held (S3).
- Reduce Motion or VoiceOver: the track becomes a button "Mark $42.00 paid" that needs a 600ms long press with a circular fill, or a VoiceOver double tap followed by a confirm alert.

### S4 Pending and undo
- 72px check disc (accent/subtle with a 1.5px accent/primary stroke), "Marked as paid", body "Nic gets a request to confirm $42.00 in cash. Your balance moves when he does."
- Readout TIMELINE with pill `PENDING`: `10:39:04 PM you marked cash $42.00 ✓`, `10:39:04 PM request sent to Nic ✓`, `--:--:-- Nic confirms pending`. Summary chip `due 42.10 · paid 42.00 · carried 0.10`.
- Undo toast at y 716: text/primary fill, 20px countdown ring, "Marked $42.00 paid · 4s", action "Undo". The window is 5s. Undo deletes the mark and withdraws Nic's request. After 5s the toast slides away and undo moves into the receipt as "Cancel the cash mark" until Nic confirms.
- Ghost button "Back to balances".
- Your balance doesn't change while pending. The 09 row for You → Nic shows a `PENDING` pill.

### S5 Nic confirms (receiver)
- Push to Nic: "Ari marked $42.00 cash for you. Tap to confirm." Opens S5.
- Hero $42.00, caption "Ari marked this as cash, handed over in person.", pill `NEEDS YOU`.
- Readout `RECEIPT · STL_7Q2K-0042`: due 42.10 / Ari gave 42.00 / carried → next split 0.10 / for "Tejo boat tour, via Tomás".
- Note: "Your balance updates when you confirm. If the count is off, tap Not yet and say what you got."
- Buttons "Yes, I got $42.00" (Primary, y 724) and "Not yet" (Secondary, y 788). Not yet opens a sheet with an amount field and a note, which leads to E2 on Ari's phone.
- If Nic does nothing for 24h, Ari gets "Nic hasn't confirmed $42.00 yet" with Remind and Cancel.

### S6 Confirmed, 1 of 3
- YOUR BALANCE +$18.30 in status/owed, "Ren pays you $18.40. $0.10 carried to your next split."
- Success card: 40px owed check disc, "Nic confirmed $42.00", meta `cash · 10:40:12 PM · stl_7Q2K-0042`.
- Progress: overline `1 OF 3 SETTLED`, right `$42.00 of $124.50`, a 3-segment bar (filled segments accent/primary, others bg/sunken, 4px tall, 4px gaps).
- Rows: You → Nic with pill `$42.00 ✓`, Ren → You $18.40 (status/owed), Mara → João $64.00.
- CTA "Ask Ren for $18.40".
- Micro-moment on arrival: the check disc scales 0.8 → 1 over 320ms with spring (stiffness 300, damping 20), `.success` haptic, the first bar segment fills in 400ms. Reduce Motion: 200ms fade, no scale.

### S7 Receipt and provenance
- Hero $42.00 with pill `CONFIRMED`, caption "Tejo boat tour, routed through Tomás".
- Readout PAYMENT: id stl_7Q2K-0042 · from Ari (you) · to Nic · method cash · in person · due $42.10 · paid $42.00 · carried $0.10 → next split · marked 10:39:04 PM · Ari · confirmed 10:40:12 PM · Nic · sync both phones ✓.
- Readout WHERE IT CAME FROM: LX Factory lunch · Tomás paid +79.80 / Dinner · you paid −37.70 / you owe Tomás 42.10 / Tomás owes Nic · boat tour 42.10 / simplified: you → Nic 42.10.
- Secondary "Share receipt" exports a PNG of the two readouts.

### E1 Partial cash
- Hero: overline HAND OVER NOW, $20.00, "of $42.10 due". Quick pills $10, $20 (selected, accent), $40, All $42.10. Custom amount by tapping the hero.
- Bar: filled 20.00 / 42.10, labels `now 20.00` and `left 22.10`.
- Readout PARTIAL · YOU → NIC: due 42.10 / hand over now 20.00 / stays open on the plan 22.10.
- Note: "The other $22.10 stays on your plan. Pay it in cash or in the app later."
- Slider "Slide to mark $20.00 paid". Rounding is off for partial payments, and the remainder keeps the original reference with suffix `-b`.

### E2 Dispute
- Rose card: "Nic counted $40.00", pill `DISPUTED`, "Nic tapped Not yet at 10:41 PM: “Got two twenties, nothing else.”"
- Readout COUNT CHECK: you marked 42.00 / Nic counted 40.00 / gap 2.00 (status/owe).
- WHAT NOW (radio list): Hand over the missing $2.00 (Nic confirms $42.00, same as before) · Change it to $40.00 ($2.10 stays on your plan) · Cancel the cash mark (back to $42.10 open).
- CTA "Send to Nic". Balances stay as they were until both phones agree.

### E3 Offline
- Card: "No connection", "Saved on this phone. It goes to Nic as soon as you're back online."
- Hero $42.00 with pill `QUEUED`, "Marked 10:39 PM, not sent yet."
- Readout SYNC: queue 1 payment / last sync 10:31:48 PM / retry on reconnect, then every 30 s / balances pending until Nic confirms.
- Ghost "Cancel the cash mark". The mark is stored with a client id so a retry can't double-post.

### States and data
```ts
type SettleMethod = 'tripup' | 'mbway' | 'revolut' | 'bank' | 'cash';
type SettleStatus = 'draft' | 'queued' | 'pending' | 'confirmed' | 'disputed' | 'canceled';
interface Settlement {
  id: string;            // 'stl_7Q2K-0042'
  clientId: string;      // idempotency key for offline retries
  from: PersonId; to: PersonId;
  due: number;           // 42.10, from simplify()
  paid: number;          // 42.00
  carry: number;         // due - paid when rounded, 0.10
  method: SettleMethod;
  status: SettleStatus;
  markedAt?: string; confirmedAt?: string;
  dispute?: { counted: number; note: string; at: string };
  provenance: { label: string; amount: number }[];
}
```
- draft → (slide) → pending, or queued when offline. queued → pending on reconnect.
- pending → confirmed when the receiver taps yes. pending → disputed when they tap Not yet. Either side can cancel while pending.
- disputed → pending after the payer picks a fix and sends it. disputed → canceled.
- Balances and the 1 of 3 counter only change on confirmed. App payments (TripUp Pay) go straight to confirmed when the processor returns success.
- Money is stored in cents as integers. Display uses tabular figures and the $ prefix, with the minus sign U+2212.

### Recap variant with cash
The All squared up recap (hi-fi 10) shows the app path: $124.50 across 3 payments. When cash rounding happens, the receipt row reads `Ari → Nic $42.00 cash ✓` and the body reads "3 payments, $124.40 handed over, $0.10 carried to your next split."

### Reduce Motion for the flow
- Screen transitions become 200ms cross-fades.
- The slider becomes the long-press button described above.
- The undo countdown ring is replaced by a static "5s" number that updates each second.
- The success check and bar fill appear without scaling or sweeping. Haptics stay.
