# v5 spacing and visual QA audit

Run: `node qa/v5/spacing.cjs [outdir]` against the built site (`python3 -m http.server 8080 -d site`).
It opens all 40 kept prototype screens (16 Lisbon evening + 24 beyond tonight) at 2x, light, and checks:
CTA height and radius, icon-in-container centering (more than 1 px off is a bug), card insets against the 12 px gutter,
gaps off the 4 px grid, text clipping and overflow, tap targets under 44 px, collisions with the status bar, home indicator
and tab bar, and chip row alignment. Screens are saved next to `report.json`.

Before: `qa/v5/spacing/` · After: `qa/v5/spacing-after/` · Pairs: `qa/v5/spacing-audit/*.png` · Contact sheet: `qa/v5/contact-sheet.png`

## Automated findings

| Check | Found | Fixed | Notes |
|---|---|---|---|
| Gaps off the 4 px grid | 44 | 44 | 5 px, 7 px, 9 px and 1.5 px gaps moved to 4, 8 and 2 px (pills, counts, list groups, live bars, receipt readout, progress dots, Safari bar, settle progress) |
| Tap targets under 44 px | 16 | 16 | HeaderMenu avatar/Back (40 px, hit area now 44), iOS toggle (63x28, hit area 63x44), stepper segments (28 px tall, hit area 44), app banner close (28x44, now 44x44) |
| Text clipping | 3 | 0 real | 2 were screen-reader-only text (`.sr-only`); 1 is the recap Highlights rail, which scrolls sideways by design |
| Collisions | 1 | 0 real | Add to a poll sheet sits above the tab bar on purpose (it is a modal) |
| Icon centering | 0 | - | |
| Card insets | 0 | - | |
| CTA height/radius | 0 | - | |
| Chip rows | 0 | - | |
| **Total** | **64** | **60 fixed, 4 false positives** | Re-run after fixes: 2 findings, both the known false positives above |

## Eyeball pass (every kept screen at 2x)

| Screen | Problem | Fix |
|---|---|---|
| Core 5, New poll | Old form: flat white rows on gray, a Closes row, a toggle row | Same sentence composer as beyond tonight (tokens for type, when, closes; photo option tiles; Add option; one Send to crew). Seeded with the 3 Explore picks, default title Saturday dinner. See `spacing-audit/core_create.png` |
| Core 4, Find a place | Text rows ending in counts, mono step counter | One question per screen with the big photo and glass tiles from Find a place; progress dots in the header; auto-advance. See `core_explore.png` |
| Core 13, All squared up | Dense mono ledger, mono eyebrow, crowded bottom | Check with glow, title, one line `3 payments · $124.50 · everyone at $0.00`, face stack, Share the recap, quiet See payments that opens the list. See `squared-after.png` |
| Trips, Lisbon Crew, Tonight, Money | Two-row headers; full-width header card on Money | One-row inset HeaderMenu (avatar or Back, title, glass menu that grows into 5 shortcuts) |
| Settle screens | Header card ran edge to edge | GlassHeader inset 12 px with full radius and float shadow |
| All sheets | 8 px inset | 12 px inset, matching the content gutter |
| Recap, Profile, Create crew, When, Where, Assign, Invite, Plan day, Plan add, Guest, Place reviews | Flat white cards on gray | Prism glass surfaces over a quiet ambient light (Reduce Transparency falls back to solid) |
| Profile, Create, Plan | Caps section labels | Sentence case, 13 px secondary |
| Create trip | Stepper said Step 5 of 5 after cover and budget were cut; header repeated the step name | Stepper shows only kept steps (`Invite crew · 3 of 3`); header subtitle removed |
| Add expense, Assign | A 5-step stepper for a 1-step happy path | Stepper hidden on the kept path |
| Recap highlights | Rail snapped to the screen edge, not the gutter | `scroll-padding-inline` matches the 20 px margin |
| Composer | Add option sat under the Send button with 3 options | Option tiles 104 to 92 px, CTA and Add option 52 px (matches every other primary button) |
| Core data | Cervejaria Ramiro was `$$` in the core story and `$$$` everywhere else | `$$$` everywhere |

Still open, noted for a later pass: Poll sent and Balances updated have some empty space under their card; the deck hero phone loops the tour by design.
