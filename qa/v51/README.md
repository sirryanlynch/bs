# v5.1 polish round

## Elevated screens (one hero each, photo/glass hierarchy, fewer stacked rows)
Before/after pairs in `qa/v51/pairs/` (before = v5 spacing-after capture, after = v5.1 built site, 2x).

| Pair | What changed |
|---|---|
| `create-where.jpg` | Best match is a 208px photo hero (serif city name, glass "Best match" tag, arrow in a glass circle). Other matches sit in one glass list instead of separate cards. |
| `create-crew.jpg` | Last crew is a photo hero with the avatar stack and one Iris "Add all 6" action. People are one glass row of six; share options are one row of glass circles. |
| `settle-pay-nic.jpg` | HeaderMenu replaces the full-width header. Pay hero: photo faces joined by an Iris thread, $42.10 at 72px. Five method rows become two featured glass tiles (TripUp Pay, Cash) plus one row of other apps; the mono "HOW YOU'LL PAY" label and "1 OF 3" pill are gone. |
| `settle-cash-for-nic.jpg` | One cash hero: a fanned stack of the actual bills (2 × $20, 2 × $1), the amount, and one sentence about the $0.10 carry. The mono COUNT IT OUT and CASH ledger cards are folded into it; round toggle is one glass row; "Paying part of it?" is a quiet link. |
| `poll-sent.jpg` | The poll as the crew sees it: dive photo, "Sent to 6 people" glass chip, real title (was blank), options with photo thumbs and "Your vote", faces of who still has to vote. NextSteps strip fills the empty space with what happens next. |
| `balances-updated.jpg` | $175.60 owed to you is the hero; the six people are faces with amounts in a 3 × 2 grid instead of a row list (shows all six, not "2 more"). NextSteps strip below. |
| `split-dinner.jpg` | Bill hero (Taberna photo, $248.70, live result line). The one decision, who had the wine, is its own card with photo faces that grey out and strike through when tapped off. Everything else is one quiet glass list. |
| `activity.jpg` | What is waiting on you (Tomás' drinks poll) is a photo hero with one-tap vote buttons. The feed is grouped glass with photo faces. Lock Screen preview and Mark all as read are quiet links at the end. |
| `profile.jpg` | Alfama cover photo, 88px photo face, stats on glass, "Your trips" photo rail, one settings group (Currency folded into Payment methods), Sign out as a quiet link. |
| `part1-explore-feed.jpg` | Part 1 step 04 now lands on the Explore feed (HeaderMenu, Find a place hero tile, place cards) before the questions. |

## Guided tour
* Part 1 Explore step: feed shows, cursor scrolls down 420px and back (eased), then taps the "Find a place for tonight" hero into the questions. Verified with `qa/v51/tourfeed.cjs` (feed → scroll 0→420→16 → questions).
* Self-guided step list caption/requirement updated to match.

## Motion
* Exit half of every screen change (`storybook/src/lib/navghost.ts`): the outgoing screen is cloned as an inert, aria-hidden ghost. Push: outgoing parallaxes 30% left and dims. Pop: outgoing slides off right. Tab/fade: fades out. Sheet: settles back to 94%. Reduce Motion: 160ms fade only. Used in the core prototype and every Beyond tonight route. Tour cursor ignores ghosts.
* Photo to hero: tapping a place photo in Explore FLIPs that photo into the place card gallery hero (460ms); the screen fades instead of pushing so the photo carries the motion. Skipped under Reduce Motion. Frames in `qa/v51/motion/`.

## Storybook audit (task 6)
* DebtUntangle default skin is now `solver` (v5.1). `components-money--untangle` (the id the deck slide 7 tab embeds) now renders Solver; v4 is kept as "legacy v4 Instrument skin" story.
* Lock screen story date fixed: Friday, October 16 → Saturday, October 17 (the prototype route already said Saturday).
* BeyondPatterns: the whole file failed to render (22 stories) because `story('place')` pointed at a flow cut from the step list. Fallback added; `qa/v4/stories.cjs`: 194 stories, 0 bad.
* New stories: Hero patterns (v5.1): NextSteps, PairHero, MethodPicker, CashCount. CrewPicker story uses the photo hero; DestinationSearch story searches "Port" so the hero shows.

## Image OCR (task 7)
`qa/v51/ocr.py` runs Tesseract on all 74 shipped images (deck, case study, Storybook, prototype public). Result in `qa/v51/ocr/result.json`.
* Real problems found and fixed: deck nav thumbnails `site/deck/thumbs/01–09.jpg` were from Oct 18 (pre US pass, pre renumber): "Votes close at 19:30", "12 to 17 Oct", € prices; and 10.jpg was missing (404). All 10 regenerated from the live deck (`qa/v51/thumbs.cjs`).
* Deck journey hi-fi shots (`hifi-04/05/07/08/10`) were pre-v5 (old All squared up ledger, old poll builder, old split). Recaptured from the current prototype (`qa/v51/hifi.cjs`).
* Remaining flags are false positives, checked by eye: "18.40"/"18.48" are dollar amounts with the $ dropped by OCR; the € hits on `px_16742072.jpg` (Bar Oslo photo) and slide 6/9 thumbnails are OCR noise on photos and swatches. `cash-4-confirmed.jpg` is no longer referenced by the deck.

## Copy pass (this round)
| Where | Before | After |
|---|---|---|
| Poll sent title | (blank) | Scuba diving, Tuesday at 6:00 AM? |
| Poll sent footer | You voted A. 6 people got a notification with one-tap voting. | Sent to 6 people · 1 of 7 voted · closes 10:00 PM, plus "Crew votes from the notification · Closes 10:00 PM · Winner lands on Tuesday" |
| Dive Point tag | Leaves 7:00 AM | Leaves 6:00 AM (matches the 6:00 AM poll and plan item) |
| Balances updated | Zé da Mouraria · Lunch, $204.05. 6 people owe you $175.60 in total. + "X owes you" rows | $175.60 / owed to you for lunch at Zé da Mouraria, $204.05 with tip, faces + amounts |
| Pay Nic | HOW YOU'LL PAY, 1 OF 3 | (removed; header says Payment 1 of 3) |
| Method tiles | Visa •• 4821 · arrives now / Hand it over in person | Arrives now / In person (full detail line under the picker) |
| Cash for Nic | HAND OVER, rounded from $42.10, $0.10 carried, COUNT IT OUT, CASH · YOU → NIC ledger | Hand Nic 2 × $20 + 2 × $1 · $42.00 · Rounded from $42.10. $0.10 rolls into the next split. |
| Round toggle | The $0.10 moves to the next split, so nobody counts coins tonight. | Nobody counts coins tonight. |
| Split dinner | Ren and Nic skipped the wine. Tap them off. (hint under list) | Who had the wine? card; note flips to "Ren and Nic are off the wine." |
| Create crew | Recent crews / People | Your last crew / Or pick people |
| Activity | Preview Lock Screen notifications (banner at top) | Tomás asks the crew / Drinks after fado? hero; "Preview Lock Screen" quiet link |
| Profile | Album and public posts | Album privacy |
| Step list, step 04 | Explore narrows the city with a progress ring | Explore feed, then four questions narrow the city |

## Checks run on the built site
* `qa/v5/spacing.cjs` → 2 findings, both the known false positives (add-to-poll sheet over tab bar; recap rail caption in a horizontal scroller). Screens in `qa/v51/spacing/`.
* `qa/v3/flow.cjs` (full Part 1 click-through incl. explore feed, wine split, cash slide, undo, Nic confirms, All squared up): pass, 0 errors.
* `qa/v5/hotfix.cjs` (Next through every step, drawer, Back to deck, slide links): pass.
* `qa/v51/tourfeed.cjs`, `qa/v51/motion.cjs`: pass, no page errors.
* `qa/v4/stories.cjs`: 194 stories, 0 bad.
* Contact sheet: `qa/v51/contact-sheet.jpg` (all 40 kept screens).
