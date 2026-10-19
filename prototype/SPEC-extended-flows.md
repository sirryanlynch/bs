# TripUp: extended flows spec

Figma: TripUp-Working, page "AI Enabled", section **15 · Extended flows** (`261:8285`)
https://www.figma.com/design/z4TesJNPe6UfvgwmWtIA4y/TripUp-Working?node-id=261-8285

Updated Sun, Oct 18, 2026, 11:40 PM PT. **This file is the source of truth for the code worker.** It covers 12 flows: 63 light screens and 14 dark heroes, all iPhone 17 (402 × 874). Exports are in `/workspace/tripup/exports/extended/` (2x, 804 × 1748), with one `NN-<flow>-strip.png` per flow and `00-overview-ia.png`.


## Decisions (Oct 18, 11:11 PM PT): follow these in code

1. **Scuba poll:** Tuesday, Oct 13, 6:00 AM, sent Mon, Oct 12 in the evening. The poll closes at 10:00 PM. In the day picker, Mon 12 has the Today ring and Tue 13 is selected. The hint reads "Tuesday, Oct 13, 6:00 AM · sunrise is about 7:40 AM".
2. **Dinner poll:** on the last evening, Sat, Oct 17. It is called "Saturday dinner", closes at **7:30 PM**, and the winner, **Taberna da Rua das Flores**, is booked for **8:30 PM** (won 5 of 7). The Plan day view shows **Sat, Oct 17 · Day 6 of 6**:

   | Time | Item | Type | State |
   |---|---|---|---|
   | 10:30 AM | Tejo boat tour | Active | done |
   | 1:00 PM | Pastéis de Belém | Food | done |
   | 6:30 PM | Park Rooftop | Drinks | now |
   | 8:30 PM | Dinner · Taberna da Rua das Flores | Food | next; "Poll closes 7:30 PM · Taberna leading", then booked |
   | 11:00 PM | Fado at Tasca do Chico | Culture | next |

   - Chip counts are All 5 · Food 2 · Drinks 1 · Culture 1 · Active 1. Travel is hidden.
   - Scuba diving (6:00 AM) and grilled sardines at the harbor (1:30 PM) belong to **Tue, Oct 13**.
   - Status bar times are never earlier than the "now" item: 6:48 to 6:51 on the day view, and 7:31 after the poll closes.
3. **No double Back:** the Stepper shows the caption and Skip only. `Back` is a boolean that defaults to **off**, because every step screen already has a nav back (or Cancel on step 1).
4. **Add expense receipt:** this is a **different expense from the dinner**: *Zé da Mouraria · Lunch · Wed, Oct 14*.
   - The receipt header reads "ZÉ DA MOURARIA / OCT 14 2026 2:12 PM".
   - **$204.05** = $185.50 subtotal + $18.55 tip (10%), tax included.
   - The expense row reads "Zé da Mouraria · Lunch". The dinner at Taberna is a separate expense of $248.70, which is what code uses for dinner.
5. **Sample new trip:** Porto, wine weekend, Fri, Feb 12 to Mon, Feb 15, 2027.
6. **Empty and error states:** Flow 12 adds three light screens: receipt not read, poll with no votes, Explore offline.
7. **Receipt copy (Oct 18, 11:23 PM PT):**
   - Keep the Portuguese item name and add a short plain-English hint in parentheses.
   - Category labels are plain English: Starters · Meals · Wine · Drinks · Dessert · Tip.
   - Restaurant names stay as they are, with one word of context where it could be unclear ("Zé da Mouraria · Lunch").
   - Prices and totals do not change.
   - The printed receipt in the camera view stays in Portuguese, as a real paper receipt would; only the bread line becomes COUVERT so it matches.
   - Line items are grouped under the category headers: Starters (Couvert, Amêijoas), Meals (Polvo, Bacalhau), Wine (Vinho Verde), Drinks (Água), Dessert (Pastéis de nata). Tip is the "TIP" label on the Tip and tax step.

   | Where | Original | New | Price |
   |---|---|---|---|
   | 06 Line items, Assign | Pão e manteiga | Couvert (bread, butter) | $6.00 |
   | 06 Line items, Assign | Amêijoas à Bulhão Pato × 2 | Amêijoas à Bulhão Pato (clams) × 2 | $34.00 |
   | 06 Line items, Assign | Polvo à lagareiro | Polvo à lagareiro (octopus) | $26.00 |
   | 06 Line items, Assign | Bacalhau à Brás × 2 | Bacalhau à Brás (cod) × 2 | $38.00 |
   | 06 Line items, Assign | Vinho verde × 3 | Vinho Verde (bottle) × 3 | $54.00 |
   | 06 Line items, Assign | Água × 4 | Água (water) × 4 | $10.00 |
   | 06 Line items, Assign | Pastel de nata × 7 | Pastéis de nata (custard tarts) × 7 | $17.50 |
   | 06 Line items | tax (IVA, included) | IVA (sales tax), included | $0.00 |
   | 06 Line items check | Vinho verde × 3 read as $54.00. Looks right? | Vinho Verde (bottle) × 3 read as $54.00. Looks right? | |
   | 06 Tip and tax | Portugal includes IVA on the menu, so nothing to add. | Portugal includes IVA (sales tax) in menu prices, so nothing to add. | |
   | 06 Review (Mara, Sofia) | Polvo, wine | Polvo (octopus), wine | $42.76 |
   | 06 Receipt nav subtitle | Lunch · Zé da Mouraria · Wed, Oct 14 | Zé da Mouraria · Lunch · Wed, Oct 14 | |
   | 06 Review nav subtitle | Lunch at Zé da Mouraria · paid by you · by item | Zé da Mouraria · Lunch · paid by you · by item | $204.05 |
   | 06 Balances expense row | Lunch at Zé da Mouraria | Zé da Mouraria · Lunch | $204.05 |
   | 06 Balances | +$175.60 TONIGHT / Includes tonight | +$175.60 TODAY / Includes today | |
   | 06 Printed receipt | PÃO E MANTEIGA | COUVERT | 6.00 |
   | DS · Expense Row | Vinho Verde × 2 | Vinho Verde (bottle) × 2 | $38.00 |
   | DS · Receipt Split Item (3 variants + dark) | Vinho Verde, Quinta da Aveleda | Vinho Verde (bottle), Quinta da Aveleda (wraps to 2 lines) | $38.00 |
   | Deck (web) 08 bill card | Vinho Verde, split 5 ways | Vinho Verde (bottle), split 5 ways | $38.00 ÷ 5 = $7.60 |
   | Unchanged (already clear) | Dinner at Taberna · Split dinner / Taberna da Rua das Flores · $248.70 · Ari paid · Dinner at Taberna da Rua das Flores · Ari paid | (no change) | $248.70 |

   For code: the coded receipt lines (Peixinhos, Vinho Verde Quinta da Aveleda, and so on) should follow the same pattern, e.g. "Peixinhos da horta (green bean tempura)" and "Couvert (bread, olives)".

## 0. Ground rules

- **Look:** calm, premium, airy. Glass (L2 chrome, thick sheet, thin blur) is used only for the nav bar, tab bar, sheets, chips and controls. Content sits on solid `bg/surface` cards.
- **Accent:** Iris `#6E5BFF` (`accent/primary`). Spectrum gradients (blush, apricot, mint, sky, lilac) appear only for celebrations: the Explore ring when picks are ready, the recap hairline, and Welcome in.
- **Type:** Instrument Serif for display (`Prism/display/*`), SF Pro for UI (`Prism/ui/*`), JetBrains Mono for numbers and readouts (`Prism/mono/*`).
- **Imagery:** Pexels photos of real places (credits in `moodboards/photos/extended/CREDITS.md`), 3D isometric renders for empty and done states (`moodboards/icons/prism_*.png`), and Phosphor Regular line icons.
- **Copy:** US English, dollars, 12-hour times, month-first dates. No em dashes. The one exception is the Currency screen, which deliberately shows € to $ conversion.
- **Dark mode:** a frame-level explicit mode on `Prism / Color` set to Dark, with effect styles swapped to their `-dark` versions.
- **Story:** see Decisions above for the dates. The crew is Ari (you), Mara, Nic, João, Sofia, Tomás and Ren Matsuda. The current trip is Lisbon Crew, Oct 12 to 17, 2026. Other trips: Lisbon, New Year (Dec 31 to Jan 3, in 74 days), Porto, wine weekend (Feb 12 to 15, 2027, created in Flow 01), Azores, dive week (Jun 2027, idea), and Lisbon, spring (Apr 2026, settled).

## 1. Navigation and IA

Overview frame: `283:10422` (`00-overview-ia.png`).

- **Tab bar · 5:** Trips · Plan · **Explore** · Polls · Money. Explore is a new tab in the third slot. Icons are refined Phosphor icons. The component is `Tab Bar · 5` (`264:8560`) with `Active=Trips|Plan|Explore|Polls|Money`.
- **Global +:** a separate glass button next to the bar on every tab. It opens the create menu: **New poll** (any day, time or activity) · Add expense (scan or type it) · Add to plan (from Explore or your saves) · New trip.
- **Where each flow lives:**

| Lives under | Flows |
|---|---|
| Trips | 01 Create trip · 04 Shared album · 07 Invite and join · 08 Trip recap |
| Plan | 05 Plan day · 11 New poll (from an empty slot) |
| Explore | 02 Explore · 03 Place card |
| Polls | 11 New poll from anywhere · 02 Explore (Start a poll > Find options) |
| Money | 06 Add expense · 09 Confirm cash |
| + (every tab) | 11 New poll · 06 Add expense · 05 Add to plan · 01 New trip |
| States | 12 Empty and error states (Add expense > Scan, Polls > a poll, Explore tab) |
| Off tab | 09 Notifications (bell, Lock Screen) · 10 Profile (Trips > avatar) · 07 Guest web view (Safari) · 04 Album upload (Photos share sheet) |

- **Explore stays reachable from polls:** Polls > Start a poll > "Find more options in Explore", and Explore > Picks ready > "Add to poll".

## 2. Shared patterns

### 2.1 Experience filter chips (`Filter Chips · Experience`, `266:8717`)

- **Taxonomy:** All (default) · Food (dinner, lunch, cafes) · Drinks (bars, wine, rooftops) · Culture (museums, fado, landmarks) · Active (scuba, tours, hikes, beaches) · Travel (flights, stays, transfers).
- **Travel** appears only on Itinerary / Plan day. It is omitted in Explore and the poll composer.
- **Behavior:** one horizontal row, single select, scrolls horizontally (clipped). Neutral glass chips. Iris fills only the selected chip; there are no per-type colors. Each chip has a Phosphor line icon: squares-four, fork-knife, wine, bank, person-simple-hike, airplane-tilt.
- **Counts:** shown only on Itinerary, for example All 5 · Food 2 · Drinks 1 · Culture 1 · Active 1. Empty types are hidden, so Travel is hidden on Sat, Oct 17 (Day 6).
- **Variants:** 48, from Type × Selected (True/False) × Count (On/Off) × Theme (Light/Dark). `Count` is a text property.
- **Mapping:**

| Item | Type |
|---|---|
| Taberna da Rua das Flores | Food |
| Park Rooftop | Drinks |
| Fado in Alfama | Culture |
| Tejo boat tour, scuba at Sesimbra | Active |
| Flights, the flat | Travel |

- **Reuse:** Plan day filter (with counts), Explore feed and the "What kind of place?" step (no counts, no Travel), the poll composer category (Active selected for Scuba diving), the place card tag, and the type picker on Edit item.

### 2.2 Stepper (`Stepper`, `286:10097`), new

- **Anatomy:** a top row with three parts. A fixed 72 px slot on the left holds Back (chevron and "Back" in `accent/text`), which is hidden by default. The mono caption "Step n of N" (`mono/micro`, `text/secondary`) is centered. Skip (`text/secondary`) sits in a fixed 72 px slot on the right. Below the row is a thin segmented bar: N segments, 4 px tall, 2 px radius, 4 px gaps. Completed and current segments are Iris. Upcoming segments are `border/strong` at 60%.
- **Variants:** `Steps=4|5` × `Current=1..N`, 9 in total. Boolean properties: `Back` (default **off**) and `Skip`. The fixed slots keep the caption centered when either one is hidden. Color is variable-bound, so dark mode comes from the frame's mode.
- **Rules:**
  - Back is off everywhere in TripUp, because each step screen already has a nav back (or Cancel on step 1). Turn it on only for a step screen without a nav bar.
  - Skip appears only on optional steps.
  - The stepper replaces any "Step n of N" text in nav subtitles.
  - It is the first child of Content, directly under the nav bar.
- **Explore (4 steps):**
  - Step 1: How are you getting there? (Skip)
  - Step 2: How long, per path (Walk, Drive or Destination; Skip)
  - Step 3: What kind of place? Type, price and time (Skip)
  - Step 4: Picks ready (caption only)
  - The old "Question n of 5" ring and labels were removed from the question heads. The ring stays only on Picks ready as the celebration.
- **Create trip (5 steps):** Where to (1) · Dates (2) · Cover photo (3, Skip) · Starter budget (4, Skip) · Invite crew (5, Skip). Review and create has no stepper; it is the confirmation screen. The stepper replaces the earlier bare segment bar.
- **Add expense (5 steps):** Line items (1) · Assign to people (2, Skip = split evenly) · Split mode (3, Skip) · Tip and tax (4, Skip) · Review (5). Scan receipt is a camera view with no stepper. Balances updated is the result.
- **Interactions:**
  - The nav back goes to the previous step and keeps its answers.
  - Skip applies the default (Explore: any; Create trip: no cover, no budget, invite later; Add expense: even split, no tip) and advances.
  - Segments animate their fill over 200 ms. With Reduce Motion they change instantly.
  - VoiceOver label: "Step 2 of 4, How long".

### 2.3 Transport question (Explore step 1, then step 2)

- **Question:** "How are you getting there?" Walk (close by, on foot) · Drive (car, taxi or ride share) · Destination (worth a trip).
- **How long:**

| Path | Options |
|---|---|
| Walk | 5 min · 10 min · 20 min |
| Drive | 10 min · 20 min · 40 min |
| Destination | Under 1 hr · Half day · Day trip |

- Then step 3, which holds the existing questions: type (experience chips), price ($ · $$ · $$$ · Any) and open at (7:30 PM · 8:30 PM · 9:30 PM · Later).
- A live count pill updates with each answer: "61 places in Lisbon so far", then "38 places within a 10 min walk", then "14 places so far".

### 2.4 Global poll composer (Flow 11)

- **Entry points:** the + button on every tab > New poll; Plan > empty slot; Explore > Add to poll > Start a new poll.
- **Fields:**
  - What (free text): "Scuba diving"
  - Type: experience chips (Active)
  - Day: Tue, Oct 13
  - Time: 6:00 AM
  - Options: Dive Point Sesimbra (2 dives · $95 each · 50 min drive) and Arrábida coast dive (1 dive · $70 each · 45 min drive)
  - "Find more options in Explore"
  - CTA: "Send to crew · closes 10:00 PM"
- **Day and time sheet:** "When is it? Any day of the trip, any time." It has day pills Mon 12 to Sat 17 (Today ring on Mon 12, Tue 13 selected) and a 30-minute wheel. The mono hint reads "Tuesday, Oct 13, 6:00 AM · sunrise is about 7:40 AM".
- **Date (decided):** Tuesday, Oct 13, 6:00 AM. This matches the coded build.

## 3. Components added (Design System section 02 > "Extended components" `264:8380`)

| Set | Id | Variants / props |
|---|---|---|
| Tab Bar · 5 | 264:8560 | Active = Trips, Plan, Explore, Polls, Money |
| Choice Tile | 264:8581 | State = Default, Selected; Title, Sub text props; icon swap |
| Explore Feed Card | 264:8641 | Signal = Booked, Been here, Saved; Name, Meta, Review |
| Photo Tile | 264:8658 | Default, Selected, Uploading, Public |
| Review Snippet | 264:8681 | Text, With photo; Name, Body, Meta |
| Activity Row | 264:8717 | Vote, Cash, Expense, Photo, Joined |
| Day Pill | 264:8730 | Default, Selected, Today; Weekday, Day |
| Filter Chips · Experience | 266:8717 | 48: Type × Selected × Count × Theme; Count text prop |
| **Stepper** | **286:10097** | Steps = 4, 5 × Current; Back, Skip booleans |
| Icon+/… | 266:8386 to 266:8497 | 38 Phosphor Regular icons missing from the base set |

Fills, strokes, radii and spacing are bound to `Prism / Color` and spacing variables. Text uses `Prism/*` text styles, and effects use `Prism/*` effect styles.

## 4. Flows

Each flow row has a header with the flow's place in the IA, a JTBD card (functional, emotional and social, each marked **HYPOTHESIS**), and the states it covers. The wireflow strip runs left to right, with arrows labeled by trigger. Dark heroes sit after a divider.

### Flow 01 · Create trip

Row `267:8478` · strip `exports/extended/01-create-trip-strip.png`

- **Where it lives:** Trips tab · + button (global create menu) · Recap “Plan the next one”
- **What it does:** From a city name to a live trip in five short steps. Every step but the destination has a sensible default, so it never opens on a blank page.
- **JTBD (hypotheses):** functional: Set up a trip with dates, a budget and the right people in under a minute. Emotional: Feel the trip is real and started, before anyone has booked anything. Social: Bring the usual crew along without chasing people across chats.
- **States:** Search typing, past destinations, range selected, cover chosen, budget optional/skip, invite by link, QR, recent crew or contacts, review with edit links, created milestone. No empty state: step 1 suggests past places.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Where to | `267:8507` | `267:9105` | Pick Porto | Step 1 of 5 | `01-create-trip-01-where-to.png` |
| 02 | Dates | `267:8592` |  | Pick Feb 12 to 15 | Step 2 of 5 | `01-create-trip-02-dates.png` |
| 03 | Cover photo | `267:8714` |  | Choose a photo | Step 3 of 5 · Skip | `01-create-trip-03-cover-photo.png` |
| 04 | Starter budget | `267:8765` |  | Set $600 | Step 4 of 5 · Skip | `01-create-trip-04-starter-budget.png` |
| 05 | Invite crew | `267:8849` |  | Add Lisbon Crew | Step 5 of 5 · Skip | `01-create-trip-05-invite-crew.png` |
| 06 | Review and create | `267:8931` |  | Create trip |  | `01-create-trip-06-review-and-create.png` |
| 07 | New trip home | `267:9015` | `267:9186` | (end) |  | `01-create-trip-07-new-trip-home.png` |

<details><summary>On-screen copy (light)</summary>

- **01-01 Where to:** Port / PLACES / Porto, Portugal / City · 3 hr by train from Lisbon / Porto Covo, Portugal / Coastal village · Alentejo / Porto Santo, Madeira / Island · 1 hr 30 min flight / WHERE YOUR CREWS HAVE BEEN / Lisbon / 3 trips / Sesimbra / 1 day trip
- **01-02 Dates:** FROM / Fri, Feb 12 / TO / Mon, Feb 15 / February 2027 / M / T / W / F / S / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / 11 / 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 / 21 / 22 / 23 / 24 / 25 / 26 / 27 / 28 / 3 nights. Monday, Feb 15 is Presidents’ Day, so the US crew keeps the long weekend.
- **01-03 Cover photo:** Porto, wine weekend / FEB 12 TO 15, 2027 · 7 PEOPLE / TRIP NAME / COVER / Upload / PHOTO · PEDRO SOARES ON PEXELS
- **01-04 Starter budget:** PER PERSON · 3 NIGHTS / $600 / About $4,200 for the crew of 7. A guide, not a limit. / Stays / $280 / Food and drinks / $220 / Getting around / $60 / Activities / $40 / Only your crew sees the budget. You can skip this and add it later from Money.
- **01-05 Invite crew:** tripup.app/j/porto-7KQ2 / Anyone with the link can view and vote / RECENT CREWS / Lisbon Crew / 6 people · 2 trips together / CONTACTS / LP / Lena Park / Not on TripUp yet · gets a text / DA / Diego Alves / On TripUp
- **01-06 Review and create:** Porto, Portugal / Where / Edit / Fri, Feb 12 to Mon, Feb 15, 2027 / When · 3 nights / $600 per person / Starter budget / You and 6 invited / Lisbon Crew · link on / TRIP SETTINGS / currency / USD / votes / anyone with link / expenses / members only
- **01-07 New trip home:** Your trip is on the map / 6 invites sent. Mara and Nic are already in. / 3 OF 7 IN / GOOD FIRST STEPS / Start a poll for Friday dinner / Explore Porto / Add your flight or train

</details>

### Flow 02 · Explore

Row `268:18319` · strip `exports/extended/02-explore-strip.png`

- **Where it lives:** Explore tab (new, 3rd of 5) · Start a poll > Find options · Plan > Add item
- **What it does:** A calm feed of places other TripUp crews booked, visited or photographed, plus a 4-step guided finder. Now its own tab, and still one tap from Start a poll.
- **JTBD (hypotheses):** functional: Find a few good options that fit the crew’s distance, mood, price and time. Emotional: Feel confident the pick is good without reading 300 reviews. Social: Bring options the group can decide on, so nobody has to be the one who chose badly.
- **States:** Feed with experience chips (All, Food, Drinks, Culture, Active). Stepper with caption and Skip: Step 1 of 4 How are you getting there? Walk / Drive / Destination. Step 2 of 4 how long per path (Walk 5/10/20 min, Drive 10/20/40 min, Destination under 1 hr / half day / day trip). Step 3 of 4 type, price and time. Step 4 of 4 picks ready, ring turns spectrum. Save to trip, Add to poll (open poll or new). No likes, comments or followers.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Explore tab | `268:18348` | `268:18991` | Tap Find a place |  | `02-explore-01-explore-tab.png` |
| 02 | How are you getting there? | `268:18463` |  | Walk | Step 1 of 4 · Skip | `02-explore-02-how-are-you-getting-there.png` |
| 03 | Walk · how long | `268:18533` |  | 10 min | Step 2 of 4 · Skip | `02-explore-03-walk-how-long.png` |
| 04 | Drive · how long | `268:18604` |  | Alt path | Step 2 of 4 · Skip | `02-explore-04-drive-how-long.png` |
| 05 | Destination · how long | `268:18675` |  | Alt path | Step 2 of 4 · Skip | `02-explore-05-destination-how-long.png` |
| 06 | What kind of place? | `268:18749` |  | Food · $$ · 8:30 PM | Step 3 of 4 · Skip | `02-explore-06-what-kind-of-place.png` |
| 07 | Picks ready | `268:18835` | `268:19099` | Add to poll | Step 4 of 4 | `02-explore-07-picks-ready.png` |
| 08 | Add to poll | `268:18910` |  | (end) |  | `02-explore-08-add-to-poll.png` |

<details><summary>On-screen copy (light)</summary>

- **02-01 Explore tab:** Find a place for tonight / 5 quick questions, 6 picks for the crew
- **02-02 How are you getting there?:** How are you getting there? / This sets how far we look. / 61 places in Lisbon so far
- **02-03 Walk · how long:** How far are you happy to walk? / From Rua da Rosa, where you are now. / 38 places within a 10 min walk
- **02-04 Drive · how long:** How long a drive? / Door to door, at this time of day. / 112 places within 20 min
- **02-05 Destination · how long:** How much of the day? / Includes getting there and back. / 24 day-trip places
- **02-06 What kind of place?:** What are you in the mood for? / Pick one, then set price and time. / 14 places so far / PRICE PER PERSON / OPEN AT
- **02-07 Picks ready:** 6 / All answered / Sorted by how often crews like yours booked / Edit
- **02-08 Add to poll:** Add Taberna to a poll / Pick an open poll or start a new one. / Saturday dinner / Open · 3 options · closes 7:30 PM / Saturday lunch / Open · 2 options · closes tomorrow / Start a new poll / Any day, time and activity

</details>

### Flow 03 · Place card

Row `270:8379` · strip `exports/extended/03-place-card-strip.png`

- **Where it lives:** Explore feed > place · Poll option > tap photo · Plan item > details · Album photo > place
- **What it does:** One card per place: real photos from crews, a rating, how many people have been, and short reviews. Same card from Explore, Plan and a poll option.
- **JTBD (hypotheses):** functional: Judge a place in ten seconds: what it is, what it costs, is it good. Emotional: Trust that people like us went and liked it. Social: Add something back that helps the next crew, on my terms.
- **States:** Default, opened from poll (poll banner, Vote CTA), add photo and review sheet, privacy choice (crew only / public / public without name), posted with undo. Tags reuse the experience chip.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Place card | `270:8408` | `270:8802` | Add a review |  | `03-place-card-01-place-card.png` |
| 02 | From a poll option | `270:8483` |  | Alt entry |  | `03-place-card-02-from-a-poll-option.png` |
| 03 | Add photo and review | `270:8545` |  | Choose who sees it |  | `03-place-card-03-add-photo-and-review.png` |
| 04 | Who sees it | `270:8635` |  | Post |  | `03-place-card-04-who-sees-it.png` |
| 05 | Posted | `270:8728` |  | (end) |  | `03-place-card-05-posted.png` |

<details><summary>On-screen copy (light)</summary>

- **03-01 Place card:** Taberna da Rua das Flores / Tasca · Chiado · $$ · 6 min walk / 4.6 / RATING · 212 / 38 / BEEN HERE / 12 / CREWS BOOKED / PETISCOS / WALK-INS / SMALL ROOM / PHOTOS FROM TRIPUP CREWS · 126 / See all / REVIEWS
- **03-02 From a poll option:** Option in Saturday dinner / LEADING · 4 OF 7 VOTED · CLOSES 7:30 PM / Taberna da Rua das Flores / Tasca · Chiado · $$ · 6 min walk / 4.6 / RATING · 212 / 38 / BEEN HERE / 12 / CREWS BOOKED / PETISCOS / WALK-INS / SMALL ROOM
- **03-03 Add photo and review:** Taberna da Rua das Flores / Tasca · Chiado · $$ · 6 min walk / 4.6 / RATING · 212 / 38 / BEEN HERE / 12 / CREWS BOOKED / PETISCOS / WALK-INS / SMALL ROOM / Your take on Taberna / Visited Sat, Oct 17 with Lisbon Crew / 5 of 5 / Got there at 8:25 PM and the table was ready. The clams and the green wine were worth it. / 82 / 500 / PHOTOS · 2 SELECTED
- **03-04 Who sees it:** Taberna da Rua das Flores / Tasca · Chiado · $$ · 6 min walk / 4.6 / RATING · 212 / 38 / BEEN HERE / 12 / CREWS BOOKED / PETISCOS / WALK-INS / SMALL ROOM / Who can see this? / You can change it later from Profile > Privacy. / Faces of people not in your crew are blurred before posting.
- **03-05 Posted:** Taberna da Rua das Flores / Tasca · Chiado · $$ · 6 min walk / 4.6 / RATING · 212 / 38 / BEEN HERE / 12 / CREWS BOOKED / PETISCOS / WALK-INS / SMALL ROOM / Posted to the place card / Undo

</details>

### Flow 04 · Shared trip album

Row `272:8379` · strip `exports/extended/04-album-strip.png`

- **Where it lives:** Trips > trip > Album · Place card > photos · Recap > highlights
- **What it does:** Everyone’s photos in one place, sorted by day or by place. Each photo can also go to the place’s public card, one toggle per photo, off by default for people shots.
- **JTBD (hypotheses):** functional: Get everyone’s photos without a 400-message group chat. Emotional: Relive the trip day by day, without hunting. Social: Share the good ones publicly while keeping the crew’s private moments private.
- **States:** By day, by place, upload sheet with tag-all and per-photo day/place + public toggle, uploading tiles with progress, public badge, photo viewer with place link.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | By day | `272:8408` |  | By place |  | `04-album-01-by-day.png` |
| 02 | By place | `272:8468` |  | Tap + |  | `04-album-02-by-place.png` |
| 03 | Upload and tag | `272:8544` |  | Upload 6 |  | `04-album-03-upload-and-tag.png` |
| 04 | Uploading | `272:8626` |  | Open a photo |  | `04-album-04-uploading.png` |
| 05 | Photo viewer | `272:8698` | `272:8737` | (end) |  | `04-album-05-photo-viewer.png` |

<details><summary>On-screen copy (light)</summary>

- **04-01 By day:** Mon, Oct 12 · Day 1 / 48 PHOTOS / Tue, Oct 13 · Day 2 / 71 PHOTOS
- **04-02 By place:** Taberna da Rua das Flores / WED · 18 PHOTOS / Miradouro da Graça / TUE · 26 PHOTOS / Tejo boat tour / THU · 41 PHOTOS
- **04-03 Upload and tag:** Add 6 photos / Tag them so they land on the right day and place. / DAY 6 · SAT, OCT 17 / TABERNA DA RUA DAS FLORES / Sat, Oct 17 · Taberna da Rua das Flores / Also on the place card / Wed, Oct 14 · No place / Crew only / People not in Lisbon Crew are blurred on public photos. 3 more photos below.
- **04-04 Uploading:** Uploading to Day 6 / 4 OF 6 / Sat, Oct 17 · Day 6 / 6 NEW / Tue, Oct 13 · Day 2 / 71 PHOTOS
- **04-05 Photo viewer:** Sofia / WED, OCT 14 · 9:12 PM / PUBLIC / Taberna da Rua das Flores

</details>

### Flow 05 · Plan day view

Row `291:10137` · strip `exports/extended/05-plan-day-strip.png`

- **Where it lives:** Plan tab · Trip home > Tonight · Poll closed > Added to plan
- **What it does:** Last day, Sat, Oct 17. One day at a time: a timeline with what is done, what is now and what is next. Experience chips filter the day; counts only appear here.
- **JTBD (hypotheses):** functional: Know what is happening today, when, and where to be. Emotional: Feel the day is handled, so I can enjoy it. Social: Keep the crew moving together without being the group’s tour guide.
- **States:** Day pills, experience chips with counts (All 5, Food 2, Drinks 1, Culture 1, Active 1; Travel hidden when empty), done/now/next rows, add from Explore/Saved/Custom, edit item with type chips, drag to reorder, poll closes 7:30 PM, winner booked at 8:30 PM with toast. Scuba diving (6:00 AM) and sardines at the harbor sit on Tue, Oct 13.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Day view | `291:10166` | `291:11036` | Tap Food |  | `05-plan-day-01-day-view.png` |
| 02 | Filtered · Food | `291:10338` |  | Tap + |  | `05-plan-day-02-filtered-food.png` |
| 03 | Add item | `291:10469` |  | Pick from Saved |  | `05-plan-day-03-add-item.png` |
| 04 | Edit item | `291:10641` |  | Save |  | `05-plan-day-04-edit-item.png` |
| 05 | Reorder | `291:10791` |  | Drop |  | `05-plan-day-05-reorder.png` |
| 06 | Poll winner booked | `291:10887` |  | (end) |  | `05-plan-day-06-poll-winner-booked.png` |

<details><summary>On-screen copy (light)</summary>

- **05-01 Day view:** 10:30 AM / Tejo boat tour / From Cais do Sodré · 2 hr · $38 each / 1:00 PM / Pastéis de Belém / After the boat · $1.50 each / 6:30 PM / Park Rooftop / Bairro Alto · now · 9 min walk / 8:30 PM / Dinner · Taberna da Rua das Flores / Poll closes 7:30 PM · Taberna leading / 11:00 PM / Fado at Tasca do Chico / Rua do Diário de Notícias 39 · $10 each
- **05-02 Filtered · Food:** 1:00 PM / Pastéis de Belém / After the boat · $1.50 each / 8:30 PM / Dinner · Taberna da Rua das Flores / Poll closes 7:30 PM · Taberna leading / Travel is hidden today: no flights, stays or transfers on Day 6.
- **05-03 Add item:** 10:30 AM / Tejo boat tour / From Cais do Sodré · 2 hr · $38 each / 1:00 PM / Pastéis de Belém / After the boat · $1.50 each / Add to Sat, Oct 17 / Tasca do Chico / Culture · Fado · 4 min walk / Time Out Market / Food · Food hall · 14 min walk / LX Factory / Culture · Market · 15 min drive / Miradouro da Graça / Culture · Viewpoint · 12 min walk
- **05-04 Edit item:** Edit item / WHAT / Fado at Tasca do Chico / DAY / Sat, Oct 17 / TIME / 11:00 PM / TYPE / 5 going / NOTE / Cash only at the door. Arrive by 10:45 PM.
- **05-05 Reorder:** Drag to reorder. Times stay, order changes. / 6:30 PM / Park Rooftop / Bairro Alto · now · 9 min walk / 8:30 PM / Fado at Tasca do Chico / Rua do Diário de Notícias 39 · $10 each / 11:00 PM / Dinner · Taberna da Rua das Flores / Won the poll 5 of 7 · table for 7
- **05-06 Poll winner booked:** 6:30 PM / Park Rooftop / Bairro Alto · now · 9 min walk to dinner / 8:30 PM / Dinner · Taberna da Rua das Flores / Won the poll 5 of 7 · table for 7 / BOOKED · 8:30 PM / 11:00 PM / Fado at Tasca do Chico / Rua do Diário de Notícias 39 · $10 each / Taberna won, 5 of 7. Booked for 8:30 PM.

</details>

### Flow 06 · Add expense

Row `274:8983` · strip `exports/extended/06-add-expense-strip.png`

- **Where it lives:** + button > Add expense · Money tab > + · Plan item > Add expense
- **What it does:** Point the camera at the receipt, check what it read, tap who had what, add the tip, done. The split math stays visible in mono readouts.
- **JTBD (hypotheses):** functional: Log a shared bill in under 30 seconds, split fairly. Emotional: Not feel petty about who had the wine. Social: Keep it fair for everyone without someone doing math at the table.
- **States:** Viewfinder with auto capture, parsed items with a low-confidence line, assign by tapping faces, split modes (even, by item, shares, exclude), tip chips and tax toggle, review per person, balances updated with undo.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Scan receipt | `274:9012` |  | Auto capture |  | `06-add-expense-01-scan-receipt.png` |
| 02 | Line items | `274:9088` | `274:9603` | Assign | Step 1 of 5 | `06-add-expense-02-line-items.png` |
| 03 | Assign to people | `274:9172` |  | Split mode | Step 2 of 5 · Skip | `06-add-expense-03-assign-to-people.png` |
| 04 | Split mode | `274:9275` |  | By item | Step 3 of 5 · Skip | `06-add-expense-04-split-mode.png` |
| 05 | Tip and tax | `274:9348` |  | Review | Step 4 of 5 · Skip | `06-add-expense-05-tip-and-tax.png` |
| 06 | Review | `274:9422` |  | Add expense | Step 5 of 5 | `06-add-expense-06-review.png` |
| 07 | Balances updated | `274:9508` | `274:9683` | (end) |  | `06-add-expense-07-balances-updated.png` |

<details><summary>On-screen copy (light)</summary>

- **06-01 Scan receipt:** ZÉ DA MOURARIA / OCT 14 2026 2:12 PM / AMÊIJOAS BULHÃO PATO / 34.00 / POLVO LAGAREIRO / 26.00 / BACALHAU BRÁS × 2 / 38.00 / COUVERT / 6.00 / VINHO VERDE × 3 / 54.00 / ÁGUA × 4 / 10.00 / PASTEL DE NATA × 7 / 17.50 / SUBTOTAL / 185.50 / IVA INCL. / 21.34 / Hold steady · totals found / Manual / Photos
- **06-02 Line items:** 7 ITEMS FOUND / 1 TO CHECK / Retake / LINE ITEMS · TAP TO EDIT / Amêijoas à Bulhão Pato (clams) × 2 / $34.00 / Polvo à lagareiro (octopus) / $26.00 / Bacalhau à Brás (cod) × 2 / $38.00 / Couvert (bread, butter) / $6.00 / Vinho Verde (bottle) × 3 / $54.00 / Água (water) × 4 / $10.00 / Pastéis de nata (custard tarts) × 7 / $17.50 / subtotal / $185.50 / IVA (sales tax), included / $0.00 / Vinho Verde (bottle) × 3 read as $54.00. Looks right? / Paid by / You, Visa •• 4821
- **06-03 Assign to people:** Amêijoas à Bulhão Pato (clams) × 2 / $34.00 / Everyone / Polvo à lagareiro (octopus) / $26.00 / 2 people / Bacalhau à Brás (cod) × 2 / $38.00 / Couvert (bread, butter) / $6.00 / Vinho Verde (bottle) × 3 / $54.00 / 5 people · $10.80 each · Ren and Nic left out / Água (water) × 4 / $10.00 / Pastéis de nata (custard tarts) × 7 / $17.50
- **06-04 Split mode:** How should we split it?
- **06-05 Tip and tax:** TIP / 10% of $185.50 / $18.55 / Tax is in the prices / Portugal includes IVA (sales tax) in menu prices, so nothing to add. / TOTAL · USD / subtotal / $185.50 / tip 10% / tax / $0.00 / total / $204.05
- **06-06 Review:** You / Your share / $28.45 / Mara / Polvo (octopus), wine / $42.76 / Sofia / João / Shared items / $28.46 / Tomás / Nic / No wine / $16.58 / Ren / others owe you / $175.60 / rounding / 1¢ to you
- **06-07 Balances updated:** YOUR BALANCE / +$193.90 / +$175.60 TODAY / 6 people owe you. Simplified to 3 payments. / Zé da Mouraria · Lunch / Just now · by item · tip 10% / $204.05 / WHO PAYS WHOM / Mara pays you / Includes today / $71.30 / Sofia pays you / $64.10 / Ren pays you / Through Nic and Tomás / $58.50 / Added. Balances updated for 7. / Undo

</details>

### Flow 07 · Invite and join

Row `275:9198` · strip `exports/extended/07-invite-join-strip.png`

- **Where it lives:** Trip home > person+ · Create trip step 5 · Poll > Share
- **What it does:** A link or QR gets anyone into the trip in Safari. Guests view and vote with just a name; they upgrade to a full member when they want the plan, the album and the money.
- **JTBD (hypotheses):** functional: Get everyone’s vote, including the friend who will never install another app. Emotional: Not feel like a burden for being the last to join. Social: Be counted as part of the group from the first vote.
- **States:** Invite sheet (QR, link, share targets, guest permissions), guest web poll in mobile Safari, vote confirmed with live results and join prompt, upgrade with vote carried over, welcome moment.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Invite sheet | `275:9227` | `275:9591` | Ren opens link |  | `07-invite-join-01-invite-sheet.png` |
| 02 | Guest web view | `275:9319` |  | Vote |  | `07-invite-join-02-guest-web-view.png` |
| 03 | Guest voted | `275:9382` |  | Join the crew |  | `07-invite-join-03-guest-voted.png` |
| 04 | Upgrade to member | `275:9444` |  | Join |  | `07-invite-join-04-upgrade-to-member.png` |
| 05 | Welcome in | `275:9516` |  | (end) |  | `07-invite-join-05-welcome-in.png` |

<details><summary>On-screen copy (light)</summary>

- **07-01 Invite sheet:** Invite to Lisbon Crew / Guests can view the plan and vote. No app needed. / tripup.app/j/lisbon-crew-4FQ9 / Guests can vote / Guests can see expenses
- **07-02 Guest web view:** T / TripUp / LISBON CREW · OCT 12 TO 17 / GUEST / Ari invited you to vote / Saturday dinner · closes 7:30 PM · 4 of 7 voted / Taberna da Rua das Flores / Tasca · $$ · 6 min walk / Cervejaria Ramiro / Seafood · $$$ · 15 min drive / Tasca do Chico / Fado · $$ · 4 min walk / YOUR NAME / Ren / tripup.app
- **07-03 Guest voted:** T / TripUp / LISBON CREW · FRIDAY DINNER / GUEST / Your vote is in / We’ll text you when the poll closes at 7:30 PM. / Taberna da Rua das Flores / You and 4 others / 71% / Cervejaria Ramiro / 2 votes / 29% / Join as a full member / See the day plan, add photos and split costs. Your vote comes with you. / tripup.app
- **07-04 Upgrade to member:** Ari, Mara, Nic and 3 more / Your vote carries over / Taberna da Rua das Flores · Saturday dinner / See the plan, day by day / Oct 12 to 17 · 23 items / Split costs fairly / Your share starts from today / Add your photos / 412 already in the album / Joining shares your name and photo with the crew. You can leave any time.
- **07-05 Welcome in:** You’re in, Ren / The crew sees you as a member now. Your Saturday dinner vote is counted. / TONIGHT / 8:30 PM / Dinner · Saturday poll / Closes 7:30 PM · Taberna leading / Mara, Nic and 4 others can see you joined

</details>

### Flow 08 · Trip recap

Row `276:9386` · strip `exports/extended/08-recap-strip.png`

- **Where it lives:** Trips > past trip · push the morning after · Money > All squared up
- **What it does:** The day after, one screen sums it up: the best photos, where you went, and proof the money is done. A share card with amounts hidden by default, and a door to the next trip.
- **JTBD (hypotheses):** functional: Close the trip: confirm nothing is owed and keep the best photos. Emotional: Feel the trip was worth it, and remember it well. Social: Share the trip with friends outside the crew, without showing the money.
- **States:** Recap hero, highlights by saves, places with review marks, settled summary, share card with money toggle off, Plan the next one with upcoming trips (Lisbon, New Year in 74 days; Porto, wine weekend; Azores, dive week) and past (Lisbon, spring, settled).

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Recap | `276:9415` |  | Scroll |  | `08-recap-01-recap.png` |
| 02 | Places and money | `276:9467` |  | Make a card |  | `08-recap-02-places-and-money.png` |
| 03 | Share card | `276:9543` | `276:9679` | Share |  | `08-recap-03-share-card.png` |
| 04 | Plan the next one | `276:9604` |  | (end) |  | `08-recap-04-plan-the-next-one.png` |

<details><summary>On-screen copy (light)</summary>

- **08-01 Recap:** TRIP RECAP · ENDED YESTERDAY / Lisbon Crew / Oct 12 to 17, 2026 · 6 days · 7 people / 412 / PHOTOS / 23 / PLACES / 9 / POLLS / $0 / OWED / ALBUM HIGHLIGHTS · PICKED BY MOST SAVES / Album
- **08-02 Places and money:** PLACES YOU WENT · 23 / Taberna da Rua das Flores / Sat · won the dinner poll 5 of 7 · you reviewed / REVIEWED / Dive Point, Sesimbra / Tue · 4 of 7 went / Miradouro da Graça / Thu · 26 photos / All squared up / Settled Oct 17, 11:40 PM / spent together / $3,486.20 / per person, average / $498.03 / expenses / 41 / payments, simplified / 12 → 3 / you paid back / $0.00
- **08-03 Share card:** Lisbon Crew / OCT 12 TO 17, 2026 · 7 OF US / 412 / PHOTOS / 23 / PLACES / 9 / POLLS / Best night: Taberna, 5 of 7 votes / TRIPUP / Show money totals
- **08-04 Plan the next one:** Start a trip with these 7 / Budget, currency and invite link carry over / ALREADY ON THE WAY / Lisbon, New Year / Dec 31 to Jan 3 · in 74 days · 5 in / Porto, wine weekend / Feb 12 to 15, 2027 · planning · 3 of 7 in / Azores, dive week / Jun 2027 · idea · poll open on dates / BEFORE THIS ONE / Lisbon, spring / Apr 2026 · settled / SETTLED

</details>

### Flow 09 · Notifications and activity

Row `277:9461` · strip `exports/extended/09-notifications-strip.png`

- **Where it lives:** Trip home > bell · Profile > Notifications · Lock Screen
- **What it does:** Only two things interrupt: a vote that is closing and money that needs a yes. Everything else waits in a grouped activity feed. Actions work from the Lock Screen.
- **JTBD (hypotheses):** functional: Act on the two things that need me, in one tap, without opening the app. Emotional: Not feel nagged by a busy group. Social: Keep my promises to the group (vote, confirm) without being chased.
- **States:** Grouped feed (Needs you, Today, Yesterday), actionable vote and cash notifications with expanded actions, settings per type with quiet hours and a photo digest.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Activity | `277:9490` | `277:9713` | Vote from a push |  | `09-notifications-01-activity.png` |
| 02 | Vote from a push | `277:9557` |  | Tap Taberna |  | `09-notifications-02-vote-from-a-push.png` |
| 03 | Confirm cash | `277:9597` |  | Yes, got it |  | `09-notifications-03-confirm-cash.png` |
| 04 | Notification settings | `277:9635` |  | (end) |  | `09-notifications-04-notification-settings.png` |

<details><summary>On-screen copy (light)</summary>

- **09-01 Activity:** NEEDS YOU / TODAY / YESTERDAY
- **09-02 Vote from a push:** Saturday, October 17 / 5:42 / T / TRIPUP · LISBON CREW / now / Saturday dinner closes at 7:30 PM / 4 of 7 voted. Taberna is leading. Hold to vote here. / Taberna da Rua das Flores / Cervejaria Ramiro / Tasca do Chico / Open poll
- **09-03 Confirm cash:** Saturday, October 17 / 10:41 / T / TRIPUP · MONEY / now / Did Ari pay you $42.00 in cash? / For the Tejo boat tour. Your balance moves when you confirm. / Yes, I got $42.00 / Not yet / Open in TripUp / NIC’S PHONE
- **09-04 Notification settings:** POLLS / New polls / Vote right from the notification / Closing soon / 30 min before a poll closes / MONEY / Expenses that include you / Cash to confirm / Always on while money is open / PLAN AND PHOTOS / Plan changes today / New photos / One digest at 9:00 PM / Quiet hours / 11:00 PM to 8:00 AM · votes wait until morning

</details>

### Flow 10 · Profile and settings

Row `278:9581` · strip `exports/extended/10-profile-strip.png`

- **Where it lives:** Trips tab > avatar · Notifications from Activity > gear
- **What it does:** A short, honest settings area: how you pay, how amounts show, how it looks and moves, and what strangers can see.
- **JTBD (hypotheses):** functional: Set payments and currency once, then forget about them. Emotional: Feel in control of what is public. Social: Show up to the crew as myself, with the right name and photo.
- **States:** Profile with stats, payment methods (default card, Apple Pay, Venmo, cash), currency USD with conversion readout, appearance Light/Dark/System with previews, Reduce Motion and Reduce transparency, privacy defaults and data controls. Notification settings live in Flow 09.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Profile | `278:9610` |  | Payment methods |  | `10-profile-01-profile.png` |
| 02 | Payment methods | `278:9709` |  | Currency |  | `10-profile-02-payment-methods.png` |
| 03 | Currency | `278:9783` |  | Appearance |  | `10-profile-03-currency.png` |
| 04 | Appearance and motion | `278:9851` | `278:9996` | Privacy |  | `10-profile-04-appearance-and-motion.png` |
| 05 | Privacy | `278:9921` |  | (end) |  | `10-profile-05-privacy.png` |

<details><summary>On-screen copy (light)</summary>

- **10-01 Profile:** Ari / @ari · in TripUp since Mar 2026 / Edit / 3 / TRIPS / 6 / CREWMATES / 18 / PLACES REVIEWED / Payment methods / Visa •• 4821, Apple Pay, Venmo / Currency / USD / Appearance / System / Reduce Motion / Follows iOS / Privacy / Notifications / Sign out
- **10-02 Payment methods:** DEFAULT / Visa •• 4821 / Expires 09/29 · TripUp Pay / OTHERS / Apple Pay / Ari’s iPhone / V / Venmo / @ari-l · opens Venmo / Cash / Always available · the other person confirms / On / Add a payment method / Card numbers stay with Apple Pay and your bank. TripUp only keeps the last 4 digits.
- **10-03 Currency:** $ / US dollar / USD · $ / € / Euro / EUR · € / £ / British pound / GBP · £ / CONVERSION · EXAMPLE / tejo boat tour / €216.00 / shown to you as / $252.00 / rate, thu oct 15 / 1 EUR = 1.1667 USD / Expenses keep the currency they were paid in. Balances show in USD at that day’s rate.
- **10-04 Appearance and motion:** THEME / Light / Dark / System / MOTION / Reduce Motion / Follows iOS. Celebrations become a soft fade, no confetti. / Reduce transparency / Glass bars turn solid
- **10-05 Privacy:** NEW REVIEWS AND PHOTOS / Show my name on public reviews / Crews can find me by phone / Blur faces outside my crew / Always on for public photos / Download my data / Delete account

</details>

### Flow 11 · Start a poll from anywhere

Row `279:9703` · strip `exports/extended/11-new-poll-strip.png`

- **Where it lives:** Tab bar + (every tab) · Plan > empty slot · Explore > Add to poll > Start a new poll
- **What it does:** The + in the tab bar opens New poll from any tab. The composer takes any day, time and activity, uses the shared experience chips, and links to Explore for options.
- **JTBD (hypotheses):** functional: Put a decision to the group the moment it comes up. Emotional: Feel the group decided, so nobody is blamed for a 6:00 AM start. Social: Give everyone, including guests, an equal say.
- **States:** Global create menu over any tab, composer with what/type/day/time/options and an Explore link, day and time picker, sent poll on the Polls tab with toast. Example: Scuba diving, Tuesday, Oct 13, 6:00 AM.

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Create from anywhere | `279:9732` |  | New poll |  | `11-new-poll-01-create-from-anywhere.png` |
| 02 | Poll composer | `279:9818` | `279:10059` | Change day or time |  | `11-new-poll-02-poll-composer.png` |
| 03 | Pick day and time | `279:9896` |  | Done |  | `11-new-poll-03-pick-day-and-time.png` |
| 04 | Poll sent | `279:9966` |  | (end) |  | `11-new-poll-04-poll-sent.png` |

<details><summary>On-screen copy (light)</summary>

- **11-01 Create from anywhere:** YOUR BALANCE / +$18.30 / Ren pays you $18.40. / New poll / Any day, time or activity / Add expense / Scan or type it / Add to plan / From Explore or your saves / New trip / Start fresh
- **11-02 Poll composer:** WHAT / Scuba diving / DAY / Tue, Oct 13 / TIME / 6:00 AM / OPTIONS · 2 / Dive Point Sesimbra / 2 dives · $95 each · 50 min drive / Arrábida coast dive / 1 dive · $70 each · 45 min drive / Find more options in Explore
- **11-03 Pick day and time:** WHAT / Scuba diving / When is it? / Any day of the trip, any time. / 5:00 AM / 5:30 AM / 6:00 AM / 6:30 AM / 7:00 AM / Tuesday, Oct 13, 6:00 AM · sunrise is about 7:40 AM
- **11-04 Poll sent:** ACTIVE / OPEN · CLOSES 10:00 PM / Scuba diving / Tuesday, Oct 13, 6:00 AM / Dive Point Sesimbra / You voted / 1 / Arrábida coast dive / No votes yet / 0 / 1 of 7 voted / ALSO OPEN / Saturday dinner / Sat, Oct 17, 8:30 PM · 4 of 7 voted / Sent to 6 people

</details>

### Flow 12 · Empty and error states

Row `292:10086` · strip `exports/extended/12-states-strip.png`

- **Where it lives:** Add expense > Scan · Polls > a poll · Explore tab
- **What it does:** Three minimal states that say what happened and offer one clear next step. Same calm layout: a 3D render, a short line, and the way forward.
- **JTBD (hypotheses):** functional: Recover from a failed scan, a quiet poll or no signal without losing work. Emotional: Not feel stuck or blamed when something does not work. Social: Keep the crew moving even when one person is offline or slow to vote.
- **States:** Receipt read failed (retake or type it), poll with zero votes (nudge or share link), Explore offline (saved places still work, try again).

| # | Screen | Light id | Dark id | Next (trigger) | Stepper | Export |
|---|---|---|---|---|---|---|
| 01 | Receipt not read | `292:10115` |  | (end) |  | `12-states-01-receipt-not-read.png` |
| 02 | Poll with no votes | `292:10167` |  | (end) |  | `12-states-02-poll-with-no-votes.png` |
| 03 | Explore offline | `292:10225` |  | (end) |  | `12-states-03-explore-offline.png` |

<details><summary>On-screen copy (light)</summary>

- **12-01 Receipt not read:** We couldn’t read this one / The photo is too dark to find a total. Retake it in better light, or type the amount. / WHAT WE GOT / merchant / not found / total / items / 0 read / Tip: lay the receipt flat and fill the frame.
- **12-02 Poll with no votes:** No votes yet / You sent this 20 minutes ago. A nudge usually gets the first vote in. / Dive Point Sesimbra / 2 dives · $95 each / 0 / Arrábida coast dive / 1 dive · $70 each / STATUS / voted / 0 of 7 / closes / 10:00 PM
- **12-03 Explore offline:** You’re offline. Showing what’s saved on this phone. / New places need a connection / Your saved places and the plan still work. We’ll refresh when you’re back online. / SAVED · AVAILABLE OFFLINE / Tasca do Chico / Culture · Fado · 4 min walk / Time Out Market / Food · Food hall · 14 min walk

</details>

## 5. Interactions by flow

- **01 Create trip:**
  - Where to: typing filters results. Past destinations show first. Selecting one advances.
  - Dates: tap the first day, then the last. The range shows nights plus a holiday note (Presidents' Day).
  - Cover photo: pick from Pexels suggestions or upload. The name is editable inline. Skip keeps a gradient cover.
  - Starter budget: per person or total toggle, $ stepper, category breakdown. Skip means no budget.
  - Invite crew: link, QR, recent crew ("Lisbon Crew, 7 people") or contacts. Skip lets you invite later.
  - Review: edit links jump back to a step, then Create trip. New trip home shows a milestone with the 3D suitcase.
- **02 Explore:**
  - Feed chips filter the feed.
  - Find a place opens the 4-step stepper, with Back and Skip in the stepper. The live count updates on each choice.
  - Picks ready leads to Save to trip or Add to poll, which goes to an open poll or starts a new one (Flow 11).
- **03 Place card:**
  - Photos page horizontally.
  - Opened from a poll option, the card shows a poll banner and a Vote CTA.
  - Add a review opens a sheet with stars, text and up to 6 photos.
  - Who sees it: Crew only / Public / Public without my name.
  - Post shows a toast with Undo for 5 seconds.
- **04 Shared album:**
  - A By day / By place segmented control.
  - The + button opens an upload sheet with tag-all (day and place) and a per-photo Public toggle. Public is off by default for photos with faces.
  - Uploading tiles show progress.
  - The viewer swipes between photos, links to the place and has a share action.
- **05 Plan day (Sat, Oct 17):**
  - Day pills switch the day. The experience chips filter the timeline, with counts.
  - The + button opens Add item (Explore / Saved / Custom).
  - Tapping a row opens Edit item, with type chips and time.
  - Long-press and drag reorders items, with haptics.
  - When the dinner poll closes at 7:30 PM, Taberna is added and booked for 8:30 PM. A toast reads "Taberna won, 5 of 7. Booked for 8:30 PM."
- **06 Add expense:**
  - The camera auto-captures when the receipt is steady.
  - Parsed lines are editable. A low-confidence line shows a warning.
  - Assign: tap faces on each line.
  - Split mode: even, by item, shares or exclude.
  - Tip chips (0, 10, 15, 18%, custom) and a tax-included toggle.
  - Review lists each person's amount, then Add expense. Balances update, with Undo.
  - Example (Lunch · Zé da Mouraria, Wed, Oct 14): subtotal $185.50, 10% tip $18.55, total $204.05; others owe Ari $175.60.
- **07 Invite and join:**
  - The share sheet offers QR, link and targets, plus guest permissions.
  - Ren opens the link in Safari, enters only a name and votes. Live results follow, with a join prompt.
  - The upgrade carries the vote over. Welcome in is a spectrum moment.
- **08 Trip recap:**
  - Recap hero, then highlights ranked by saves, places, and proof the trip is settled.
  - Share card has amounts hidden by default and a toggle to show them.
  - Plan the next one lists upcoming and past trips.
- **09 Notifications:**
  - The grouped feed has Needs you, Today and Yesterday sections.
  - Lock Screen actions: vote options, and "Yes, got it" to confirm cash.
  - Settings per type, quiet hours and a photo digest.
- **10 Profile and settings:**
  - Payment methods: set default, reorder.
  - Currency shows a conversion readout (€216.00 to $252.00 at 1 EUR = 1.1667 USD).
  - Appearance: Light, Dark or System, plus Reduce Motion and Reduce transparency.
  - Privacy defaults, data download and account deletion.
- **11 New poll from anywhere (Scuba diving, Tue, Oct 13, 6:00 AM):**
  - The + button on any tab opens the create menu, then the composer.
  - Day and time open a sheet that accepts any trip day and any half hour.
  - Options can be typed or come from Explore.
  - Send to crew; the poll closes at 10:00 PM on Mon, Oct 12.
  - The Polls tab shows the open poll with a toast: "Sent to 6 people".
- **12 Empty and error states:**
  - **Receipt not read:** 3D receipt, "We couldn’t read this one" and a short reason. A mono "What we got" readout shows merchant, total and items as not found. Buttons: Type it in (secondary) and Retake photo (primary).
  - **Poll with no votes:** "No votes yet" plus a nudge hint. Options show 0 votes, with a status readout of 0 of 7 voted, closes 10:00 PM. Buttons: Share link and Nudge the crew.
  - **Explore offline:** an offline banner, then "New places need a connection". Saved places stay available offline, with a Try again button.

## 6. Mismatches with coded screens (`/workspace/tripup/qa/v4/`, checked 11:15 PM PT)

1. **Poll example weekday:** resolved. Both use Tuesday, Oct 13, 6:00 AM.
2. **Explore progress:** the code shows "Question 1 of 4" and a large 120-places ring on each question. The design now uses the **Stepper** ("Step 1 of 4", Back/Skip) and puts the count in a small live pill. The ring appears only on Picks ready.
3. **Create trip progress:** the code has a bare segment bar plus a "2 of 5" label and "Not sure yet / Next" buttons. The design uses the Stepper (caption, Skip on steps 3 to 5, no Back) and a single primary CTA.
4. **Poll composer category:** the code uses ad hoc chips (Dinner, Drinks, Activity, Scuba diving, Stay, Day trip). The design reuses the experience chips (Food, Drinks, Culture, Active). The CTA differs too: "Send to the crew" in code, "Send to crew · closes 10:00 PM" in the design. The option names differ: Sesimbra Dive Center / Arrábida boat dive in code, Dive Point Sesimbra / Arrábida coast dive in the design.
5. **Plan day:** code should switch to **Sat, Oct 17** with the five items in Decision 2 (All 5). Code currently shows All 7 with Coffee and pastéis, Tram 28, LX Factory and Sunset.
6. **Receipt:** these are two separate expenses. Code's $248.70 is dinner at Taberna. The design's $204.05 is lunch at Zé da Mouraria. Code should label its receipt as dinner at Taberna on Sat, Oct 17.
7. **Create trip sample:** decided on Porto, wine weekend (Feb 12 to 15, 2027). Code will follow.
8. The code worker's own QA (`flows.log`) also reports click failures in the create, place, polls, plan, invite and activity flows. Those are code issues, outside this design pass.

## 7. Known gaps

- Lock Screen clocks (5:42, 10:41) follow iOS and show no AM/PM.
- Spectrum hairlines use literal gradient colors, because gradient stops do not render variable bindings.
- Dark heroes cover 1 to 2 screens per flow, not every screen.
- Empty and error states are light-only, one screen each. Not yet covered: payment failure, an expired invite link, and upload failure.
- Icon+ components are flat Phosphor exports and are not wired to the Size/Style variants of the base icon set.
