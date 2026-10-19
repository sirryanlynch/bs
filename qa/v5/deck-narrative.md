# Deck narrative pass (v5)

The arc: problem and who it's for, evidence, jobs, journey, direction, system, Storybook, the decision, settle-up, the product and what's next.
Each slide has one takeaway headline, an eyebrow in the same `NN · Section · Topic` form, and (from slide 3 on) a small
"From slide N" link back to the slide it builds on. Research claims are unchanged: only sources already cited in the deck.

| # | Eyebrow | Headline | The one-line story | Changed |
|---|---|---|---|---|
| 1 | Design take-home · Ryan Lynch · Oct 2026 | The last evening in Lisbon. | Seven friends, one dinner, one bill: who it's for and what has to happen tonight. | No |
| 2 | 02 · Research · Competitive landscape | Every app covers half the night. | Planners skip the money, splitters skip the decision; each gap links to the slide that answers it. | "Go to slide" links renumbered (9 to 8, 10 to 9) |
| 3 | 03 · Research · Jobs to be done | One dinner, four jobs. | The functional, emotional and social jobs behind the night, with the three people who feel them. | Headline was "The jobs behind one dinner."; tie to slide 2 |
| 4 | 04 · Research · Journey | One evening, five moments. | Spark, decide, book, dine and log, settle: where each job shows up. | Tie to slide 3 |
| 5 | 05 · Direction · Color system | Three color directions. We picked Prism. | Calm by default, color saved for the moments the jobs say matter. | Section "Decision" to "Direction"; tie to slide 3; the moment card drops the mono eyebrow and reads like the app |
| 6 | 06 · System · Design system | Prism starts as tokens. | Color, type, spacing, elevation, components and motion, rendered from the real tokens. | Headline was "Prism, the essentials."; tie to slide 5 |
| 7 | 07 · System · Storybook | One Storybook feeds the prototype. | 190 stories, 24 components and patterns, 32 docs pages, live in the frame. | **Merged** the Storybook intro and "Components, live" slides, which repeated each other: counts, story tabs, Open Storybook and the live frame now sit on one slide |
| 8 | 08 · Execution · The dinner poll | Feel the decision: create, vote, land on the plan. | The three stages of the poll; the vote card is the center, with the research note on stage 2. | Was 09; tie to slide 7 |
| 9 | 09 · Execution · Settle up | Six IOUs, three payments. | The untangling shown every time, then the cash path. | Was 10; tie to slide 8 |
| 10 | 10 · Product · Prototype and next steps | See it on screen. | The Lisbon evening in 13 steps, then 10 flows beyond tonight; what we would test next. | Was 11; copy now matches the real step count; refined glass link cards; Figma card no longer promises edge cases; phone holds on the new All squared up |

## Renumbering (11 slides to 10)
- Slide counter `/ 10`, progress dots (generated), `aria-label` "of 10", `data-field`, ambient light table in `deck.js`.
- `data.js` go links, the slide 8 "Open this step full screen" link (`from=deck&slide=8`), and the prototype's Back to deck range (1 to 10).
- GA `slide_view` sends `slide_number` and `slide_title` from the DOM, so it follows automatically. Slide 7's title is now "Storybook".
- Case study: no deck slide numbers in it; step-count headline updated to "13 steps tonight, 10 flows beyond."
- Figma Deck page note: not edited from here (needs the Figma worker): it should say 10 slides and the merged Storybook slide.

## Fixes found during the pass
- Slides 10 and 11 threw on load (`FIELD[i]` had 9 entries for 11 slides), so the phone never appeared. Fixed and guarded.
- The image lightbox kept an invisible full-screen layer that blocked clicks on the whole deck (`.zoom` set `display: grid` over `[hidden]`). Fixed.
- Slide 8's stage views were loading into the shared phone before you reached slide 8, and the embedded tour advanced the phone away from the chosen view. The phone now holds on the chosen view (`hold=1`) and on All squared up on slide 10.
