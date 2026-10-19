# Prism design system changelog

`tokens.json` is the source of truth. `tokens.css` and the Figma variables are generated from it by `build_tokens.py`. Anyone building on `tokens.*` (for example the Storybook in `/workspace/tripup/storybook/`) should check here before they rebuild.

## v5.2 (Oct 19, 2026)
- Sheets stop below the header. New layout tokens: `--layout-header-bottom` (safe top + 48 = 110) and `--layout-sheet-top` (header bottom + 10). Every bottom sheet (p-sheet, b-sheet, composer sheets) is capped at that top, so its grabber and title are always visible and nothing slides under the back and menu buttons. Sheet layers sit above the header, so the scrim dims header and screen together (no filled glass slab over the sheet). Add people opens at the medium detent.
- Toasts (island toast, flow toasts) sit under the header, clear of the Dynamic Island, the status bar and any open sheet.
- Deck slide 1 title: "Let’s do / *Lisbon.*"
- Renamed "Beyond tonight" to "Full JTBD analysis" across the deck, prototype step list and tour, Storybook groups, case study and docs. Routes stay at `#/beyond/*`. Storybook IDs change from `*-beyond-tonight-*` to `*-full-jtbd-analysis-*`.

## v5.1 (Oct 19, 2026)
- Elevation pass: one hero per screen on Create trip (Where to, Invite your crew), Pay Nic, Cash for Nic, Poll sent, Balances updated, Split dinner, Activity and Profile. New patterns: pay hero (photo faces + Iris thread), featured method tiles, cash bills hero, NextSteps strip, photo hero tiles, trip rail.
- Motion: exit half of every transition (outgoing ghost: push parallax, pop slide-off, fade, sheet settle) and photo-to-hero FLIP from Explore into the place card. Reduce Motion: fades only.
- Part 1 tour lands on the Explore feed before the questions.
- DebtUntangle default skin is Solver (v5.1); Instrument kept as a legacy story.
- Deck: nav thumbnails and journey hi-fi shots regenerated (US formats, current screens).

## v5 · Oct 19, 2026

- **HeaderMenu**: one-row inset glass header (avatar or Back, title, glass menu that grows into Notifications, Album, Add expense, Invite, Settings). Used on Trips, Lisbon Crew, Tonight and Money.
- **Insets**: GlassHeader and every sheet sit 12 px from the screen edges with full radius and float shadow. No full-bleed rounded cards.
- **All squared up**: simplified to check, title, one summary line, face stack, Share the recap, and See payments for the list. The mono ledger and eyebrow are gone.
- **Core poll and Find a place** use the same sentence composer and one-question tiles as flows in the Full JTBD analysis.
- **Glass surfaces** replace flat white cards on the extended screens; section labels are sentence case; the create-trip stepper shows only the kept steps.
- **Motion tokens** (`storybook/src/lib/motion.ts`, `motion.css`): tab crossfade with gliding lens and one icon bounce, push from the right, pop with parallax, sheets rise on a spring. Reduce Motion: 160 ms crossfades.
- **Guided tour pacing** (`prototype/src/flows/pacing.ts`): glide, hover, press, hold, dwell; slow eased scrolls; a small "Tap ..." caption by the cursor. The tour now goes Explore feed, Add to poll, Start a new poll.
- **Spacing audit**: all gaps on the 4 px grid, every tap target at least 44 px (see `qa/v5/spacing-audit.md`).

## 2026-10-18 (PDT), 11:10 PM: removed "How we got here"

No token values changed. Figma only: AI Enabled, Walkthrough deck and Deck (web). Pages 0:1 and 3:402 untouched.

- Itinerary Item (123:4375), State=From poll: the poll icon and link are gone. What's left is a plain caption, "Picked by poll, 5 of 7", in `text/tertiary`. That matches the 5 to 1 to 1 result; the old text said 4 of 7. All 10 instances follow the component, and 8 text overrides were reset.
- Docs: Usage, anatomy item 4 ("Poll caption, optional, text only") and the Don't rule were rewritten. Anatomy item 1 now reads "Time (12-hour)".
- Removed: Hi-fi E07 sheet frame with its label and caption (E08 to E10 moved left 482 to close the gap), feature tree node (scope note now 24 MVP), click flow tag on screen 7, walkthrough slide 07 third phone and third point (the two remaining points moved to x 938, 640 wide), and the Deck (web) slide 07 "Value adds" tab.
- Copy: research gap and pillar, journey map cell 4, Start here checklist ("09 · Hi-fi 07"). Deck (web) Wanderlog answer now reads "A poll with a deadline, and the winner lands on the itinerary."
- Hi-fi 09a IOU table (and its walkthrough copy): "Ari (you)" in both columns, with padding widened to keep the mono columns aligned.
- Exports: re-exported hifi-07-poll-closed.png and hifi-09a-tangled.png. edge-07-how-we-got-here.png was removed from exports (kept at /tmp/fig/removed/).
- Rescan: 0 nodes on the 3 pages match "how we got here".

## 2026-10-18 (PDT), 10:45 PM: Debt Simplification v5.1 restraint pass

No token values changed. This entry covers style usage on the Debt Simplification component (121:4174, all 3 variants, light and dark through modes).

- Removed: source chips, money tokens, 12-tick gauge rings and balance arcs, the HUD dot grid and edge ticks, on-thread $ tags in Tangled, knot beads and twist glyphs, ribbon glow, gradient and sheen, the iridescent rim on You and the photo highlights. The solver core now shows only in Netting.
- Tangled threads use one paint, `text/secondary` at 72%, and two stroke weights: 2 pt for IOUs of $30 and up, 1.25 pt below. Curves are skewed cubics that pass through the middle of the card. The 4 crossings are 6 pt `bg/surface` dots with a 0.75 pt `text/tertiary` ring at 55%.
- Medallion: 36 pt `bg/surface-raised`, 1 pt `border/subtle`, one shadow at 10%. Photo 32 pt. Zero-net people at 40% in Solved. Avatar photos are unchanged.
- Netting: 40 pt core, 1.25 pt `accent/primary` spokes at 45%, Σ 0.00 pill. Solved: 3 arcs at 2.25 pt `accent/primary` with 3 tags and the single glint.
- Iris is the only accent in every state. `status/owe` and `status/owed` appear only in label text.
- Labels: `bg/surface` 85% plate, no shadow. Panel: `bg/surface` 70%, background blur 12. Layout check: 0 label overlaps.
- Propagated to hi-fi 09a, 09b, 09 light and dark, the walkthrough slide 08 and Deck (web) slide 08. Dark core image overrides reapplied on the 29 instances.
- Spec: `prototype/SPEC-settle-v3.md`, section "Debt Simplification v5.1 restraint pass". Build script: `figma-scripts/v5/run51.js`.

## 2026-10-18 (PDT), 10:30 PM: Figma US pass and Debt Simplification v5 "Solver"

**US English pass in Figma** (AI Enabled 108:3229, Walkthrough deck 158:8442, Deck (web) 225:81; pages 0:1 and 3:402 untouched):

- Text was rewritten in place with style-preserving range edits, first on plain text and then as overrides on instances. Rules: US spelling (color, behavior, center, favorite, organize, canceled, traveler, gray), € to $ with the same numbers, EUR to USD, 24-hour to 12-hour (10:39 PM, 10:39:04 PM), month-first dates (Oct 12 to 17, Fri, Oct 16, Oct 18, 2026). Proper nouns and quoted source titles kept. Countdown timers stay mm:ss.
- Rescan after the pass: 0 euro signs, 0 UK spellings, 0 day-first dates and 0 times from 13:00 to 23:59 across 7,632 text nodes. The 12:xx and 10:xx strings left are 12-hour status bars and countdowns.
- Status bars use 12-hour time without AM/PM, as iOS does, and are never earlier than the screen's own timestamp: S1 and S2 10:38, S3 to S5 10:39, S6 10:40, S7 10:41, E1 10:39, E2 10:41, E3 10:39, E02 10:38, light and dark, plus the 7 strip clones. 117:3887 reads "7:30 PM · 7 of 7 voted".
- Cash copy follows US money: bill pills read $20 × 2 and $1 × 2 (7 nodes). The dispute reads "Got two twenties, nothing else." and "Hand over the missing $2.00" (4 nodes).
- Descriptions: 2 text styles and the Balance Chip and Debt Simplification component descriptions now use US spelling and $. No variable, style or component was renamed.
- Deck (web): the 8 baked screenshots that showed euros (slide 1 phone, slide 4 thumbnails x5, slide 7 Lock Screen, slide 9 recap) are now live clones of the hi-fi frames. The old images are hidden and named "(old capture, hidden)".
- Layout check after the pass: 302 frames, 0 sibling text overlaps, 0 clipped text.

**Debt Simplification v5 "Solver"** (component set 121:4174, same 362×268 card, same data):

- Photo avatars in 44 pt glass medallions with a 12-tick balance gauge. The current user gets an iridescent rim. Photos uploaded to Figma: ari, sofia, mara, ren, nic, tomas, joao (Pexels, see `exports/settle-v5/avatars/CREDITS.md`).
- Glass ribbons: glow, gradient body, white sheen and arrowhead, width by amount. Money tokens on each path. Crossings are graphite knots that untie in Netting.
- A 3D solver core (three.js render, 6 PNGs uploaded: tangled, netting and solved in light and dark). The dark instances override the core image, because image fills do not follow variable modes.
- Prism light field, a faint HUD at 60% and a glass panel. Source chips in Tangled (Dinner, Boat tour, Flat, Fado). Netting spokes run into the core. The Solved state has a single spectrum glint.
- Fix in `prelude5.js`: `solid()` now writes the resolved light value into the placeholder color and applies paint opacity after binding. Before this fix, bound paints exported as black and lost their opacity.
- Instances update everywhere (29 across the three pages). Deck (web) slide 08: the Graph art images 242:15340, 242:15413 and 242:15462 and their 61 text overlays are hidden and replaced with v5 instances scaled 1.276x. The hi-fi 09 settle-up rows (137:6808, 137:6901, 178:14588, 178:10597) now show photos in place of initials.
- Spec: `prototype/SPEC-settle-v3.md`, section "Debt Simplification v5". Render source: `render-v5/core.html`. Assets: `exports/settle-v5/`.

## 2026-10-18 (PDT): settle-up v3, DebtUntangle v4 and US English

- **US English and US formats everywhere.** All UI copy, stories, docs and the deck use US spelling (color, behavior, center, gray, canceled, traveler). Money is formatted with `Intl.NumberFormat('en-US', { currency: 'USD' })` through `usd()` in `lib/data.ts` (it replaces `eur()`). Times are 12-hour (10:39 PM) and dates month-first (Oct 12 to 17). The status bar shows the time without AM/PM, as iOS does. Older entries below keep their original wording.
- **New: settle-up cash flow** (`components/settle.tsx`): MethodPicker, CashCount with US bills and coins, cash rounding with a carried remainder, SlideToSettle and LongPressSettle, PendingMark, UndoToast (always inverse: text/primary fill), ReceiverConfirm, PaymentSuccess, SettleProgress, PlanRows, ReceiptView, PartialCash, DisputeView, OfflineView, plus Money logs (IouLog, NetLog, PairRows, MoneyBalance).
- **New: SquaredSheet** for the All squared up recap, with a mono receipt table. `CelebrationOverlay kind="squared"` uses it.
- **DebtUntangle v4 "Instrument":** graphite threads, Iris arcs for the solved payments, computed knots, balance rings, dot grid and a mono stats panel. The visual layer is now a skin: `registerUntangleSkin(name, Component)` receives an `UntangleFrame` (positions, phase, graph, stats) while replay, scrubber, the net-unchanged check and the screen-reader summary stay shared.
- **DebtUntangle skin "solver" (v5.1 restraint pass, SPEC-settle-v3.md)**, now on the Money screen: photo medallions, six graphite threads (2 pt from $30, 1.25 pt below) with computed hollow crossing dots and no amounts, a 40 pt solver core with Iris spokes and a Σ pill only in Netting, three Iris arcs with tags and one glint in Solved. Rose and jade appear only in balance text. No source chips, money tokens, gauge rings, grid or ribbon effects. v4 stays available as `skin="instrument"`. The IOU log labels the user "Ari (you)". Deck slide 8 drops its dot grid, Tangled tags, Iris knots and balance rings to match.
- **Type:** JetBrains Mono added for readouts (`--font-mono`).
- Icons: `globe`, `bank`, `warningCircle`. Button variant `surface`.

## 2026-10-18 (PDT): celebration and settle-up rework

- **CelebrationOverlay** is now calm pearl glass. The 3D party render, confetti and gradient title are gone. A crafted mark plays instead: seven threads let go, the ring closes, a check draws in. The celebration spectrum appears once, as light sweeping the card edge (1.4 s), then rests as a faint rim. Hierarchy: mono eyebrow, Instrument Serif title in ink, callout line, stats, one primary action. Reduce Motion shows the settled state.
- **Rule change:** the spectrum is never used as text color. `tu-celebrate-text` is no longer used by any component.
- **New: DebtUntangle** replaces DebtSimplify on the Money screen. Six IOUs start as crossing threads; the solve nets balances, matches debtors to creditors and redraws three payments, with a step counter, mono readouts (transfers 6 to 3, money moved 190.60 to 124.50, every net unchanged), Untangle, Replay and a scrubber. Reduce Motion jumps to the result and the scrubber steps by stage.
- Icons: `replay` (ArrowCounterClockwise) and `play` (Play) added.

## 2026-10-16 (PDT): v2 icon set and touch targets

**Icon set: Phosphor Icons** (`@phosphor-icons/react` 2.1.10). The Figma file is being refined in parallel with the same direction.

- Weights: `regular` by default and `fill` for selected states (the active tab, chosen options). Glyphs drawn at 14 px or smaller switch to `bold`, so strokes stay visible.
- Optical sizes: 20 inline (rows, buttons, back chevrons) and 24 in navigation (tab bar, toolbar, FAB). 14 only for badges and check marks. Callers no longer pass a custom stroke; the old `stroke` prop now only picks the weight.
- Alignment: `.p-icon` is `inline-block`, `flex: none`, `vertical-align: -0.18em`, so inline glyphs sit on the text baseline.
- Hit targets: every icon-only control is 44 x 44 pt (sheet close, remove option, back, add person, reviewer FAB).
- Why Phosphor over Lucide: rounded joins and terminals that read closest to SF Symbols, plus matching regular, bold and fill weights, so the active tab can be filled without mixing sets.
- `AppMark` replaces the 3D `prism_poll.png` wherever it acted as an app icon (notification, Live Activity, island, guest web page, landing favicon). It is an Iris squircle with a white bar-chart glyph.
- The 3D Prism renders stay, only for milestones and empty states (poll won, all squared up). The hand-drawn SVG paths in `Icon.tsx` are gone.

**Component changes in the same pass**

- `TabBar`: the active tab icon is filled.
- `PaymentRow`: the inline Nudge and Pay pills (26 pt tall) are removed; each screen owns one primary action. "Done" now reads "Paid".
- `DebtSimplify`: new `toggle` prop to hide the in-card switch when the screen's primary button does the job. The header now shows the total that moves.
- `PollOption`: the detail line wraps instead of truncating.
- `BottomSheet` close and `PollComposer` remove buttons go from 36 to 44 pt. `Banner` actions get a 44 pt row.

## 2026-10-16 (PDT): contrast pass

These changes were made in `build_tokens.py` and regenerated into `tokens.json`, `tokens.css` and the Figma "Prism / Color" collection. Only the light-mode values moved, plus one dark-mode value. Primitives did not change.

| Semantic token | Mode | Before | Now | Why |
|---|---|---|---|---|
| `color.semantic.text.tertiary` | light | pearl.500 (#8D8C9A) | pearl.600 (#6B6A78) | 3.3:1 on bg/surface failed AA for small text; now about 5.3:1 |
| `color.semantic.text.on-accent` | dark | pearl.0 (#FFFFFF) | pearl.950 (#16161D) | white on iris.400 was about 3.1:1; ink on iris.400 is 5.74:1 |
| `color.semantic.status.owed` | light | jade.500 | jade.600 (#17805E) | AA for amounts and captions, about 4.9:1 |
| `color.semantic.status.settled` | light | jade.500 | jade.600 (#17805E) | matches owed |
| `color.semantic.status.owe` | light | rose.500 | rose.600 (#B8364C) | AA, about 5.6:1 |
| `color.semantic.status.excluded` | light | pearl.500 | pearl.600 (#6B6A78) | matches text/tertiary |

A `color.roles._contrast` note records the measured ratios.

The "Before" column is reconstructed from the earlier build. Check git or the Storybook's last token import if you need the exact old hex values.

## 2026-10-16 (PDT): component library (Figma only, no token changes)

The library on the Figma page "AI Enabled" (`108:3229`) grew from 18 to 40 component sets, plus 20 standalone components. Every new component uses existing semantic tokens only, so `tokens.json` did not change.

- Raw fills in Live Activity, Toggle and Trip Card are now bound to primitives (`pearl.0`, `iris.300`). The one exception is the pure black Live Activity background, which stays unbound because it is iOS system chrome.
- Gradients (trip card scrim, celebration) are not variable-bound. Figma can't bind gradient stops.


## 2026-10-16 (PDT): wireflow and hi-fi screens (Figma only, no token changes)

- Sections 08 Wireflow (`114:3600`) and 09 Hi-fi (`114:3619`) are now built from library instances. `tokens.json` did not change.
- Component content changed so the crew is 7 people throughout (Ari, Mara, Nic, João, Sofia, Tomás, plus Ren):
  - Receipt Split Item has a seventh face (T).
  - The Everyone line now reads "Split 7 · €5.43 each".
  - The Excluded line now reads "Split 5 · €7.60 each · Ren & Nic not on wine".
  - Expense Row now reads "Split 5 · €7.60 each".
- On the two lock-screen mockups, the Live Activity is detached from its component. Its bar widths can't be overridden on an instance, and they need to show the 50/50/0 split at 19:02.

## 2026-10-16 · Section 09 edge cases and extras (no token changes)
- Added 10 hi-fi edge-case screens E01 to E10 in section 09 (tie, cash mark paid, Member Picker, web vote, Explore ring and 6 picks, how we got here, two empty states, share recap). Built from library instances only.
- Trips home (wire and hi-fi 01): third trip card moved out from under the tab bar; past trips now render as a List Row.
- Sheet grabber row now hugs its height (was a fixed 100 px frame); wire and hi-fi 08 rebuilt with the fix. Build-script change only, no component or token change.
- Section 09 resized to 4016 x 5210; section 10 moved to y=32505.

## 2026-10-16 · Review pass (no token changes)
- Live Activity (118:4059): added Split variant property and new "Size=Expanded, Split=Even" (50/50/0). Track fills rebound to alpha/white-18 (paint opacity had been lost).
- New Status Bar component 149:6832 (Time text, Show time boolean). 32 hand-drawn status bars swapped to instances; lock screens hide time.
- e.js tie builder now swaps LEADING badge to TIED.
- New boards on AI Enabled: 00 Start here, 11 Design decisions, 12 Before and after, 13 Success metrics, 14 Accessibility; section 10 Prototype rebuilt. New page "Walkthrough deck" (12 slides, 1920x1080).
- Section subtitles rewritten in first person; sections 09 to 14 normalized to 4368 wide; one en dash removed from 109:3837.

## 2026-10-16 · Claims audit (no token changes)
- No research with groups has been run. Section 13, slide 11 and slide 3 now frame baselines and targets as proposed and untested; the diary study is labelled "not run yet".
- Persona and journey-map quotes, ages and scores labelled illustrative. Bandwagon figure corrected to Rothschild and Malhotra (2014), about 8 points; Splitwise confusion claim now quotes the Splitwise help center. Journey map numbers aligned to the story (€248.70, 60%).

## 2026-10-18 · Settle-up and celebration redesign
Token changes (tokens.json):
- Added `font.mono` = JetBrains Mono, web fallback `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace`. Figma text styles `Prism/mono/readout` (Medium 11/14) and `Prism/mono/tag` (Medium 10/12). Needed for the algorithm readouts; SF Mono is not available in Figma.
- `celebration.forms`: removed "3D confetti renders", added "spectrum light" (one blurred angular glow behind the check). `celebration.never`: added 3D renders/clip-art/confetti and gradient text on the squared-up title.
No colour, spacing or radius values changed.

Components (Figma):
- Debt Simplification 121:4174 now has State=Tangled (121:4135), State=Netting (197:8975, new), State=Solved (121:4153). Old Before/After renamed, so every instance followed. 362×268.
- Confirmation / All squared up 104:3446 rebuilt: glass sheet, drawn check on a disc, one spectrum glow, serif title in text/primary, mono receipt. Removed the rainbow sheen and the 3D popper.
- Celebration Overlay 121:4318: rainbow sheen removed, scrim with background blur 12, sheet centred.
Screens: new Hi-fi 09a Tangled (201:9341) and 09b Netting (201:9484); 09/09 dark shifted right. Section 12 and deck slide 04 rebuilt as 3 equal pairs; deck slide 08 now shows Tangled, Netting, Solved.
- The IOUs in the Tangled state now come from the prototype ledger (pairwise output): Ari→Tomás 42.10, Tomás→Nic 42.10, Ren→Ari 18.40, Mara→João 40.00, Mara→Sofia 24.00, Sofia→João 24.00 (€190.60). The node ring was reordered so the 3 solved payments don't cross.
- Settle-up Row reasons now follow the ledger: "Tejo boat tour, via Tomás", "Dinner share minus Fado tickets", "Flat deposit, via Sofia".
- Poll Builder and Invite Sheet: the Grabber frame was 100px tall and is now hug (13). Spacer now fills, so the primary action clears the home indicator.
- E07 address shortened. AI Enabled section gaps are back to 240.

## 2026-10-18 (evening) · Tangled graph v4 and the cash settle flow
Token changes: none in tokens.json. Two Figma text styles added for the instrument readouts, both on `font.mono`:
- `Prism/mono/value`: JetBrains Mono Medium 13/16, for panel values.
- `Prism/mono/micro`: JetBrains Mono Medium 10/12, +0.4 tracking, uppercase captions. Started at 9px and moved to 10 because 9 was hard to read at 1x.

Components (Figma):
- Debt Simplification 121:4174 rebuilt as v4 "Instrument" in all 3 states: chips with balance rings, weighted gradient threads, crossing knots, dot grid and orbit, stepper, and a 3-cell instrument panel. Same ledger data. Ari's label stacks name over net in Netting and Solved, and Sofia's label is clamped right, so they no longer touch.
- New board "Explore · Tangled graph directions" in Design System next to the component: Direction A (Instrument, chosen) and Direction B (Flow) in light and dark, with a decision note.

Screens:
- Section 09: 10 new settle frames (light y 7800, dark y 8800) covering choose method, cash count and round, slide, pending with undo, Nic's confirm, confirmed 1 of 3, receipt, and edge states for partial cash, dispute and offline. Plus a "Settle notes" text block. The section is now 4880 × about 9900.
- Edge E02 (143:6885) rebuilt from the new cash count and round screen.
- Section 07: "Settle flow strip" (227:7989) with 8 scaled frames and mono captions. Section 07 is now 2818 tall.
- Sections 08 to 14 reflowed with 240 gaps.
- Spec: prototype/SPEC-settle-v3.md now has the v4 graph spec and a full spec for the settle flow.
