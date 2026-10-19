# Prism design system changelog

`tokens.json` is the source of truth. `tokens.css` and the Figma variables are generated from it by `build_tokens.py`. Anyone building on `tokens.*` (for example the Storybook in `/workspace/tripup/storybook/`) should check here before they rebuild.

## v5.4.9 (Oct 19, 2026)

- **Money keeps the in-trip tab bar** (Plan / Explore / Photos / Money and +, with Money selected). Simplify, Pay and Request sit above the bar with a 34px gap. Toasts sit above the button.
- **Photos** gets the master header card (Back, title, layers and grid). Add photos moves to a small button under it. The tab bar was already there.
- **Home Explore (#/beyond/explore)** gets the master header card, the same as Home: avatar, title, layers and grid.
- **GA4 (G-T7WTSRRSGT)** on the deck, the prototype (page_view on load and on every hash route change) and the Storybook manager page. Page views only; no other tracking.

## v5.4.7 (Oct 19, 2026)

- **Trip home header:** the layers (Up next) button is back. It's the same circular icon button as on Home, with the same color and contrast; it had been rendered white-on-white. Its count badge shows when items are pending. The Lisbon Crew hero now sits 12px below the header, like Home. Plan, Explore, Photos and Money checked. Nothing else changed.

## v5.4.7 (Oct 19, 2026)

- **Trip home header:** the Up next (layers) button is restored, the same as on Home. The hero sits 12px below the header.
- **Start a poll** on the Dinner card opens Find a place, not the invite sheet.
- **Find a place picks:** "Start a poll with N" opens the composer, and Send goes to Poll sent.
- **Price point:** the $ / $$ / $$$ / Any labels are smaller (26px).
- **Find a place:** the master header card on every step, with the step dots and Skip under it.
- **Guided tour:** no on-screen cursor, ripple or Scroll hints; it still acts and advances.
- **Deck embeds:** a small pointer glides to each tap and presses; it hides once you tap in.

## v5.4.6 (Oct 19, 2026)

- **Slide 1 polish:** all 8 screens recaptured the same way, each with the status bar and Dynamic Island. The top fade is stronger, so no card sits under the Tokens and 01/10 pill. The side fade is removed and the grid fades only at the top and bottom, so the cards stay crisp. The Lisbon photo keeps its own fade into the text. Nothing else changed.

## v5.4.5 (Oct 19, 2026)

- **Slide 1 only:** the angled showcase is replaced by a flat masonry of 8 real screens (Home, Trip home, live poll, Find a place, the plan, By item split, Money, Pay Nic). It's three columns in the right half with 18px gutters, staggered vertically and running off the top and bottom. Every card shows the full screen at 402:874, with a 28px radius, a 1px white inner border and a soft shadow, and no device frame. The edges fade into the text and above the bottom nav. The columns drift very slowly in alternating directions; Reduce Motion keeps them still. No 3D.

## v5.4.4 (Oct 19, 2026)

- **Toasts sit low everywhere,** just above the bottom action, centered. They never cover the You / Whole trip switch or a title. On Waiting for Nic, the "Marked $42.00 paid · Undo" toast sits above the Done / Nudge Nic stack, never over it. 
- **Slide 1 showcase:** the cards sit on one tilted 3D plane (perspective 1600px, rotateX 18°, rotateZ −12°) at different depths. Every card has a 30px radius, clips cleanly, and has a frosted bezel and soft shadow. Back cards are at 90% opacity and the front card is opaque. The block fades out softly instead of a hard-cut bottom. Cards stagger in 80ms apart when the slide opens, then drift gently; Reduce Motion shows a static end state.

## v5.4.3 (Oct 19, 2026)

- **Slide 1:** the live phone is replaced by a static showcase of six real screens (Trip home, live poll, Find a place, the plan, By item split, Money). Staggered glass cards, feathered edges, a gentle drift that stops under Reduce Motion. Nothing is clickable.
- **Top nav:** the v5.4.2 white elevated header card is restored exactly (avatar or Back, the serif title, then the layers icon for Up next and the grid icon with the Iris dot). One component on Home, Plan, Explore, Photos and Money; the peach variant over the trip photo is gone. When it's open, the screen dims behind it. The Up next scrim no longer blocks taps.
- **Trip home hero:** an inset rounded card with elevation, no longer full width.
- **Toasts** sit low, above the bottom action, so they no longer cover the You / Whole trip switch.
- **Who had what, redesigned:** a compact header (place, date, total, per-person range), one "Who was there" face row that sets the default for every line, and Even / By item as a small toggle in the Items header. Rows are fixed height (name, price, a small face stack with a −n exceptions marker). Tap a row to edit its people in a bottom sheet; no accordions. Even split hides per-item people. Items start at about 41% of the screen, and Save expense stays pinned. Lisbon numbers unchanged.
- **Case study unlinked:** removed from slide 10 (Figma and Storybook now sit in two columns, no gap) and from the prototype footer. The /case-study/ files stay in place.
- **WCAG:** the + menu, the open top nav and Up next cards are near-opaque frosted (94% white, strong blur) over a 36% dark scrim. Tap the scrim to dismiss. Titles and subtitles meet 4.5:1.
- Slide 10's dimmed overlay re-checked; it's clean.

## v5.4.2 (Oct 19, 2026)

- **Deck:** top-bar Reduce motion toggle removed (the OS setting still gives a crossfade). Any autoplaying embed stops the moment you click or tap into it. Phone glass no longer clips at the device corners (slide 10 and every deck phone).
- **Slide 8:** Stage 1 is one Explore demo (Find a place, picks, Start a poll, Poll sent) with no composer toggle. The "Hidden until you vote" badge is gone everywhere; the behavior stays. Stage 2 "In the app" opens at Trip home with the open-poll card highlighted, taps into the vote, and loops. Stage 3 is one flow (poll closes, Taberna wins, lands on the plan) with no toggle. "See tonight" is now "See the plan".
- **New poll starts from Find a place** everywhere (+ menu, Dinner card, Explore). The composer comes last, with your picks.
- **Plan:** the big "Add the dinner bill" CTA is gone. Add the bill from a quiet action on the Dinner card.
- **Add expense:** receipt photo first, then itemization.
- **Who had what:** Even split or By item. Pick "Who was there" once. By item starts from that group, so you only edit the exceptions. Receipt hero, glass rows with tappable photo stacks, live per-person totals. Lisbon numbers kept ($248.70; Ren and Nic off the wine). Storybook: Beyond/SplitEditor.
- **Money:** You / Whole trip switch, one count per view. The IOU sentence and table sit behind "How TripUp got here".
- **Netting engine:** an animation layer (Σ, √, ± amounts, collapsing arrows, one quip, about 2.5 s) that lands on Solved, 3 payments. In the prototype, slide 9 and the Storybook DebtUntangle. Reduce Motion crossfades.
- **Request payment:** a Request button on lines where someone owes you ("Request sent to Ren"), in Up next and in settle.
- **Waiting for Nic:** no longer a dead end. Done returns to Money, plus a quiet "Nudge Nic". Back and swipe-down work, and the path to Nic confirming stays in the tour. The meta line reads "Cash · marked 10:39 PM". Added to the every-screen-has-exit check.
- Tour, Storybook, thumbnails and QA updated for all of the above.

## v5.4.1 (Oct 19, 2026)

- **Find a place, new order:** what kind (Food, Drinks, Culture, Activity, the same set as the Explore chips), then Price point, then how you're getting there, then how long. Counts narrow from the first answer.
- **Price per person is now Price point** everywhere.
- **Picks chips jump back:** on the 6 picks screen the chips (Food · $$ · Walk · 5 min) follow the question order. Tap one to go back to that question with your answer preselected. Each later question comes prefilled with Next, then the picks refresh. The Part 1 picks screen gets the same chips (in place of the old Stepper).
- Tour copy and taps follow the new order. Storybook: Find a place stories for price point and getting there.

## v5.4 (Oct 19, 2026)

Navigation restructure. Builds on v5.3.1 (folded in: Back and swipe down only in flows, no in-flow menu, Poll sent exits fixed).

- **Two nav levels.** Home (no trip open): Trips · Explore · You, plus the + with New trip first. Trip (inside Lisbon Crew): Plan · Explore · Photos · Money, plus the +. Back to Trips leaves the trip. The bar crossfades between sets (360 ms, a fade under Reduce Motion).
- **Home Explore** (`discover`): a photo-led screen for the next trip. Hero, destination rail and trips other crews took. Plan a trip like this opens New trip prefilled.
- **No Polls tab.** Polls start from the dinner slot, Find a place, the + or a notification. `TripPollCard` on Trip home while a poll is open, then the result. Old `polls` routes redirect, with no dead ends.
- **Up next** (`actioninbox.tsx`): an Iris pill beside the menu with a count. It lists only things that need you (vote, pay), and each card taps straight into the action. When there is nothing, it shows a quiet glass pill and "You’re all caught up". At home level, cards name their trip.
- **HeaderMenu:** Notifications and Settings only. Album moved to the Photos tab.
- **Explore:** the header + is gone. Find a place is the single entry.
- **Empty states** (`emptystate.tsx`): Trips with no trips, and a new trip's Plan, Photos, Money and Notifications, plus Up next. All are reachable from Create trip, then Open the trip.
- **PollOption `hidden`:** no 0% before you vote.
- Storybook: two-level TabBar stories, Up next stories (HeaderMenu and ActionInbox), EmptyState stories, Home Explore and the empty-state flows. Tour: Home Explore step; Find a place replaces the feed's new-poll button.

## v5.3.1 (Oct 19, 2026)
Top nav, as decided with Ryan. No token changes.
- `HeaderMenu`: three shortcuts, **Notifications · Album · Settings**. Add expense (the + menu covers it) and Invite (Add people on the trip screen covers it) are gone. A new `menu={false}` drops the button on in-flow screens that use this header (Pay, Cash).
- `FlowMenu` and `MenuNav` from v5.3 are removed. In-flow screens (New poll, Find a place, Add expense, New trip, settle steps, place cards) have no menu button. You leave them with Back or a swipe down.
- Swipe down to dismiss (prototype `useSwipeDismiss`): on any screen without a tab bar or header menu, drag down from the header (or anywhere when the page is at the top). The screen follows your finger. Past 110 pt, or with a quick flick, it slides away and runs that screen's own Back, so the swipe and Back always land in the same place. Under Reduce Motion it fades instead. Sheets, dialogs and sideways drags are left alone.
- Poll sent: Back and Done used to loop back to the same screen because the polls list was cut. Both now leave the flow. "See all polls" is removed.
- Find a place: a selected pick gets the same Iris ring as a voted poll tile (3 pt Iris outline plus an Iris lift).
- Deck slide 5: the eyebrow fits on one line at 1280 px and wider ("From slide 3: jobs 3, 4").

## v5.3 (Oct 19, 2026)
No token changes. New and changed components:
- `FlowMenu` (components/beyond/headermenu): a 44 pt glass menu button for in-flow screens, next to Back. Same five items as the top-nav menu. `MenuNav` context routes the picks. (Removed in v5.3.1.)
- `Composer` Add an option sheet: a light glass Explore button beside the field (`onExplore`) opens Find a place.
- `FindPicks`: rank badges replaced by + buttons (`picked`, `onToggle`). The card body still opens the place. CTA reads "Start a poll with N".
- `SquaredSheet`: `onDismiss`. Tap the scrim, swipe down past 80 pt or press Escape to close. 44 pt grabber.
- `PhotoGrid`: an avatar badge on each photo (`onPerson`). The album filters to one person, with a header you can dismiss.
- `DebtUntangle`: `controls="steps"` starts on Tangled, then Next goes Tangled → Netting → Solved and ends on a small Start over. Metric labels are numbers only. This is the default in Storybook.
- Polls: counts stay hidden until you vote, everywhere. The Counts visible option is gone.
- Ren's guest vote (prototype `RenVote`): an iMessage link preview, then the web poll with photo tiles and hidden counts, then the vote, "Your vote is in. Results at 7:30 PM.", then back to Messages.
- Deck: slide 5 has a bigger mood board. The All squared up moment moved into slide 6's Motion card. Slide 6 chips wrap. Slide 7 opens the Storybook with the addons panel collapsed. Slide 8 starts on stage 1. Slide 9 has less text and a Next stepper.

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
