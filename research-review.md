# TripUp: Research Review (Figma audit + market scan)
_Prepared Oct 16, 2026 (PT). Sources: the FigJam board `u2Ak20BVu3NUC4jMOSqMon` and the design file `z4TesJNPe6UfvgwmWtIA4y`, both read-only and unmodified, plus web research. Screenshots are in `/workspace/tripup/figma/`._

---

## 1. What's in Ryan's files

### FigJam "TripUp-Figjam" (one page)
- **PEOPLE.** Three user types:
  - Organizer: sets up the trip, invites people, manages status.
  - Participant: contributes options, votes, invites others, receives info.
  - **"Hater"**, a third persona that isn't in the brief: "aggressively anti-app, muddies the process, wants viz on spending / cash settle."
  - Pain points: "too many cooks", "info buried in text", "noisy busy texts", "messy Venmo", "analysis paralysis / decision regret", "buying other ppl's wine".
- **PRODUCT** matrix:
  - Emotional "get": common space for ideas, democratization, cost share, confirmation, explore/dream big.
  - Functional "do": chat, voting/polls, expense tracking, itinerary, home.
  - Wire-lite sketches and feature stickies:
    - **Polls:** tap to vote; long-press to deep-link (menu/Yelp); undo; transparent or anonymous? (open question); vote history; confirmation; timer?; "randomize".
    - **Expenses:** real-time snapshot; filterable history; settle (group or custom); receipt capture plus auto-itemize; Venmo/Cash App/Apple Pay; Apple Pay "trip card".
    - **Itinerary:** what/where/when; **"Objection" feature**; RSVP or pass; "new decision made".
    - **Chat:** familiar interface; SMS proxy; cross-platform.
- **DEEP FLOW** (Pre-Trip, then Trip):
  - Create trip, invite, accept, add itinerary, chat.
  - Explore, then suggestion or poll, then votes, then confirm/add to itinerary, then check in/out.
  - Add expense (with receipt photo), sub-categorize items/people, accept itemization, then settle up or defer.
  - During the trip: Suggestions (Like/Meh), then create a slot-based poll, then send.
  - Expenses: dashboard, view new charge (Accept / Object, then Propose), then Settle Up (select people/all), then pay in app or "confirm paid other".
- **CHALLENGE REFINEMENT** (the most scenario-specific part):
  - Path: //My Trips, then //MILAN, then //Explore, then **[Clippy mode]**, [Search mode] or (surprise me).
  - Clippy is a guided quiz: Food, then Dinner, then Vibe (boujie / 1% / dodgey / hipster / locals only), then Cost ($–$$$$), then Walkable/Uber, then "Which way" AR, then Summarize/Confirm.
  - Then options (swipe L/R?), Favorite, Create Poll, Invite friends, Suggest date/time, Share Clippy experience or "Send static".
  - Notification: PUSH, then "Remind me in a bit", then View Guide, Enter Poll, Vote, then Confirms / adds to itinerary.
  - Agenda, then Dinner "event": Click In / Audible / Skipped.
  - Pay with Primary Trip Card, or Custom (Cash/Other), or Split (+card / Assign).
  - Photo receipt [AR], confirm itemizations, Edit People, expand Wine section, **"Remove Ren + Nick"**, accept, add to charges.
  - Accept charge, then Settle Up (this bill only / whole trip), then click to pay, then balances.
  - Stickies:
    - Clippy is "tangled" when debts are messy and gets an "UNTANGLED" animation when they're settled.
    - Clippy hides "poorly" in costume behind notifications.
    - "3D immersive avatar."
    - "Force landscape."
    - "Intelligent interface … metamorphasizing."
    - "Brand opportunity: progressive disclosure flow."
- A pasted image of the **scenario text**. It confirms **Ari is a participant**, not the organizer.

### Design file "TripUp-Working"
- **Page 1** contains a copy of the FigJam: BRAIN DUMP (PEOPLE/PRODUCT), DEEP FLOW and CHALLENGE REFINEMENT.
- **Lo-Fi Slop** wires:
  - Titled blanks: Plan Trip, Trip Chat, +Users, Polls/Vote/Results, Itinerary, Event/Check-in/Add content/Photos.
  - Gray wires: My Trips (Coming up / Active), Interests, trip detail with itinerary list.
  - Clippy sketches and a "Lets Explore" Guided/Manual Clippy quiz. The paperclip gains a hat, bib and coat as filters stack up.
  - AR "Which way?", a map with a results list, a "Dinner Plans" poll builder (Available friends / Time / Options) and a "Success!" confirmation.
- **Designs:** about 13 frames at **402×874** (correct for iPhone 17).
  - Several Home variants with the greeting "Today's the day, Amy!" / "Good Evening, Amy".
  - A swipeable bottom card carousel: flight DL6544 SFO→"LSB", Hotel Avantina, Tacos Pastor, with Call/Drive.
  - A top pill nav (grid / chat / poll / $), plus globe and voice-wave buttons. Voice mode turns the mic into a waveform.
  - Poll notification sheet: "It's about dinner", 3 identical "Mondo's Pie Party" cards, "4/5 votes are in", a Vote button.
  - "Survey Says…": the winner plus call/map/reserve, and tall green **liquid-filled pill bars** with bubbles.
  - "Next up: Dinner": Los Gallos, 7:30pm.
  - Chat list ("Lisbon 2026", "IBIZA SQUADD") and chat thread ("Lets eat!" poll bubble, keyboard).
  - "Add new" sheet (Poll / Image / Charge) above a bottom nav: globe, map-search, route, cash, plus a green + FAB.
  - **"Lets square up"**: floating glass **bubbles sized by amount**, each with a pie ring (Ayla $323.75, Lisa $655.75 …), then a "Settle up with Lisa" teal CTA.
  - "new charge": an Add receipt slot, item rows with avatar stacks and toggles, "Pay with trip card" / "Split the bill" (still mostly placeholder bars).
  - "Options": a stacked swipe-card deck with a food-truck illustration.
- **INSPIRATION:**
  - Glassy fintech cards over a motion-blurred field photo.
  - Pastel purple-gradient dashboards.
  - A travel onboarding flow ("Name your trip", "Travel together?" share link/QR, photo collage).
  - A dark map app, food list UIs, a set of **sticker-style food illustrations**, a minimal "Create folder" sheet, B&W blurred portraits.
  - A mock bottom nav labeled HOME / EXPLORE / NEW / CHAT / TRIPS.
- **COMPONENTS:** a generic UI kit (cards, forms, calendar, keyboard, iPhone header) plus custom Top Nav, Chat / $ / Poll / Home / Explore / Itinerary / Cash Wrap icons, ADD, Mic Bubble, Poll Item, Poll Flash.
- **Icon Library MUI** page: Material icons, filled and outlined.

### The visual direction so far
- **Soft "Liquid Glass" glassmorphism:** frosted translucent cards on a cool gray-blue field with a warm amber glow; big bold black grotesk headlines (SF/Inter); circular glass buttons.
- **Playful layer:** the Clippy mascot, sticker illustrations, a liquid/bubble data viz, and bubbles sized by debt.
- **Mood:** calm, premium, Apple-native, "ambient assistant" (greeting, voice). Accents aren't set yet: green poll, iOS blue Vote, teal Settle, green FAB.

> Also on the box: a prior generated exploration at `/workspace/tripup/v2-*.png` (Oct 9), "TripUp v2: Map, Dial, Magnets, Pie, Chips, Plate". It is a sketchy wireflow with a day dial, magnet polls, pie-slice bill and chip-stack balances, and it already uses Ari/Ren/Nic/Lisbon. It is **not** in either Figma file. Confirm with Ryan whether it's still in play.

---

## 2. Market scan: what to borrow, where the gaps are

| App | Good UX to borrow | Gap TripUp can own |
|---|---|---|
| **Splitwise** | **Simplify debts**: never changes anyone's net and cuts transfers to at most N−1 (greedy). Clear "you owe / you're owed" color coding (orange/green). **Itemize** receipts with claim-your-items, and tax/tip spread proportionally. Non-users join via QR. Settle through Venmo/PayPal. | No planning or decisions. The free tier is capped at 4 expenses/day. Splitwise keeps simplify debts off by default because it "can cause confusion when people aren't expecting it" (https://feedback.splitwise.com/knowledgebase/articles/746853-my-dashboard-balances-are-different-than-my-group), so show *why*. |
| **Tricount** (bunq) | Free and unlimited, offline. Uneven shares. Suggested repayments. Payment requests. Clean single-ledger "trip" model. | No itinerary or polls. No receipt itemization (photo attach only). Pushes the bunq card. |
| **Splid** | No account needed, 150+ currencies, offline, PDF summary at the end of the trip. | Bare UI. No social layer or in-app payment. |
| **Wanderlog** | Itinerary and map in one view, live co-editing, collaborators edit without an account, booking import. | **No structured voting**: decisions are "whoever edits last". Mid-trip features (offline) are paywalled. |
| **TripIt** | Auto-built itinerary from emails, real-time flight alerts, Inner Circle auto-share. | Solo/business focus. No group decisions or money. |
| **Troupe** (JetBlue) | Suggest, vote, then favorites go into the itinerary. RSVPs. Polls on dates/stays/activities. | **Delisted / offline in 2026.** The voting-first slot is open (Limbo is the live claimant: sealed ballots, deadlines, browser-link voting). |
| **Lambus** | Map itinerary, chat, private/group expenses, automatic debt settling, push notifications. | A dense all-in-one. Little delight. |
| **Partiful** | Personality: Y2K gradients, glitter, memes, bold type, playful RSVP states ("Hyped"). **Guests act without downloading.** "Text Blast" instead of a group chat. The invite is a shareable social artifact. | Events, not trips or money. |
| **WhatsApp polls** | The **baseline TripUp must beat**: 2 taps from the chat, up to 12 options, single or multi answer, live results. Photo options exist in Channels. | No context: no maps, ratings, price, or time. No deadline or auto-close. Nothing flows into a plan or a bill. Gets buried in chat. |

**Takeaways for the ≤2-tap rule**
1. Voting has to be possible **from the notification**: an actionable push, Lock Screen, or a Live Activity in the Dynamic Island showing the live leader and countdown.
2. Ren is new and may not have the app, so give him a guest web-link or QR path (Partiful, Splitwise Itemize).
3. Polls need a **deadline that auto-closes** and **auto-adds the winner** to the itinerary (Limbo, Troupe). This is the core gap versus WhatsApp.
4. Expenses should use **item-level exclusion** (the wine line minus Ren and Nic), not whole-bill toggles. Then show balances with **direction and color**, then a simplified payment plan with an explainer ("3 payments instead of 6"), then pay in app (Apple Pay), then a group confirmation.

**Group-decision research**
- **Visible tallies create a bandwagon effect.** In an online experiment, showing 80% public support instead of 20% raised individual support by about 8 percentage points (Rothschild and Malhotra, "Are public opinion polls self-fulfilling prophecies?", Research & Politics, 2014, https://doi.org/10.1177/2053168014547667). Anonymous or sealed voting reduces conformity and dominant-member pressure.
  - A good middle ground for a fast dinner decision: show "**leading**" live (the brief requires it) but keep who voted for what private until close, or make it optional.
- **Three options suits a quick decision** (choice-overload logic). Make the options comparable by giving each card the same facts: vibe tag, price $–$$$$, walking time, rating, photo.
- **Decision regret / analysis paralysis** (Ryan's own pain point): use a hard deadline plus a tiebreak rule (organizer pick or random "spin"). Ryan's "randomize" idea fits here.
- **Simplify debts:** the greedy max-creditor/max-debtor pass guarantees at most N−1 transfers. Splitwise's rules: same net for everyone, no new debt edges, nobody owes more in total.

**Platform specs**
- **iPhone 17:** 6.3", **402×874 pt**, @3x (1206×2622), 460 ppi, Dynamic Island, ProMotion.
  - Top safe area: 62 pt per useyourloaf (status bar 54 pt); some tables say 59. Bottom: 34 pt home indicator.
  - In CSS, design at 402×874 with `viewport-fit=cover`.
- **iOS 26 Liquid Glass HIG:**
  - Glass is for the **navigation/controls layer**, floating above content, not for content cards.
  - Tab bars float and can minimize on scroll.
  - Don't put screen-specific actions in the tab bar.
  - Respect Reduce Transparency / Increase Contrast. Legibility over busy backgrounds was the main 2025–26 criticism, and iOS 26.1 added a "Tinted" glass option.
- **Hit targets:** at least 44 pt. Use SF Symbols, not Material icons.

**Visual trends 2026 (social/travel)**
- Oversized bold display type for destinations and amounts.
- Tactile soft cards and micro-interactions with haptics.
- Immersive photography.
- Sticker/collage illustration and personality (Partiful).
- Native-feeling glass chrome.
- Neo-brutalist hard shadows as a counter-trend.

---

## 3. Gaps and misalignments with the brief

1. **Wrong persona and role.** The designs use "Amy" and the cast Ayla/Evelyn/Karen/Anna/Lisa. The brief is **Ari (a participant)** plus **Ren** (new) and **Nic**; the FigJam even spells it "Nick".
   - Ari adds a friend and creates a poll, so participants need those rights (shared ownership). The Organizer still needs a visible role somewhere, for example as the poll's tiebreaker.
2. **Home ≠ "all trips."** Ryan's Home is a single-trip "today" dashboard; the brief's home lists **all trips**, then the current trip's **group view**.
   - The lo-fi My Trips wire has this, but it was never taken to hi-fi.
   - **The group view with members and "Add Ren" doesn't exist** (only a blank "+Users" wire).
3. **The poll flow is incomplete.** Missing pieces:
   - Creation: entering 3 restaurants with different vibes. The "Dinner Plans" wire is the start.
   - The notification itself.
   - A **live leading** state.
   - A close trigger (deadline or all voted).
   - "Added to itinerary" feedback.

   The existing cards are 3 identical placeholders. The liquid-bar viz is fun but has no labels, counts or time remaining.
4. **The expense flow is still placeholders.**
   - "new charge" has gray bars. The FigJam logic is right (expand Wine, remove Ren + Nic), but no screen shows it.
   - **"Lets square up" bubbles don't show direction** (does Ayla owe or is she owed?), and debt simplification isn't visualized.
   - **The confirmation ("everyone's squared up") screen is missing.**
5. **Scope creep against the 10-screen / 2-tap limits.** Clippy quiz, AR "Which way", 3D avatar, voice mode, force-landscape, Explore filters, Uber/street view, and full chat are all off the brief's path.
   - "Polls over chats" argues *against* building out chat; keep it as context only.
   - **Clippy is Microsoft's character** (IP risk) and the archetype of an annoying assistant. If Ryan keeps a mascot, make it an original one, used lightly (a "tangled/untangled" debt metaphor is a strong added-value idea).
6. **Visual-system issues:**
   - Glass is applied to *content* cards, giving low-contrast gray text on gray (an HIG/accessibility risk).
   - No defined palette or accent: green, blue, teal and amber all compete.
   - **Material (MUI) icons inside an iOS frame**; switch to SF Symbols style.
   - Placeholder avatars: the same woman everywhere.
7. **Real-content bugs:**
   - Lisbon is **LIS**, not "LSB".
   - "6/23–6/31" is not a real date.
   - "Lets / Its" should be "Let's / It's".
   - Prices appear in one currency with no conversion while abroad; show the local price with the home-currency equivalent.
   - The hotel's address "2366 Avantina Hwy" is reused for the restaurant Los Gallos.
   - Tacos/pizza parlors aren't Lisbon. Use real-feeling Lisbon spots, e.g. a tasca in Alfama, a Bairro Alto rooftop, a Cais do Sodré seafood place.
8. **Missing added-value features** that the evaluation rewards and Ryan already gestured at:
   - Vote from the push / Live Activity.
   - Guest web-vote for Ren.
   - Poll countdown plus tiebreak "spin".
   - The poll winner lands on the itinerary item, with its vote count ("Picked by poll, 5 of 7").
   - Item-level split with receipt itemize.
   - Simplified-debts explainer.
   - Apple Pay settle.
   - A shareable "squared up" recap card.
   - A cash-settle path for "the Hater".

---

## 4. Suggested ≤10-screen wireflow (maps to the brief)
1. Trips (all trips, Lisbon is "Now")
2. Lisbon group view (members, today's itinerary, balances chip, + actions)
3. Add Ren (contacts / invite link / QR)
4. New poll (3 restaurants with vibe/price/walk, deadline)
5. Push / Live Activity (vote inline)
6. Live poll (leading option, countdown, votes in)
7. Poll closed: winner added to itinerary
8. Log dinner expense (itemize; wine excludes Ren and Nic)
9. Balances and simplified payments (before/after, Settle with Apple Pay)
10. Squared up confirmation (group notified)

Best candidates for the 2 hi-fi screens: **#6 Live poll** and **#9 Balances/Simplify**. Together they show the poll and the money side of the app.
