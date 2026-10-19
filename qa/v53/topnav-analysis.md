# Top nav menu vs tab bar: analysis (v5.3)

For discussion with Ryan. Nothing in the top nav changed in v5.3, except that the same menu button now also shows on in-flow screens (item 9).

## What exists today

- **Tab bar** (bottom, on tab screens): Trips · Plan · Explore · Polls · Money, plus the global **+**. The + opens: New poll, Add expense, Add photos, Add to plan, New trip.
- **Header menu** (top right, a round glass button): Notifications · Album · Add expense · Invite · Settings. It shows on top-level screens (Trips, Lisbon Crew, Explore feed, Tonight, Money, Pay, Cash). Since v5.3 it also shows on in-flow screens (Find a place, New poll, Split dinner, New trip, settle steps, place cards, Album) so you can leave a flow at any time.

## Item by item

| Header item | Duplicates the tab bar? | Why it is there | When it shows | Recommendation |
|---|---|---|---|---|
| Notifications | No. Nothing else reaches Activity. | Votes, payments and joins land here; the dot is the only "something happened" signal. | Every screen with the menu | **Keep.** It is the reason the menu exists. |
| Album | Partly. The + has Add photos, but no tab opens the album. | After the trip, the album becomes the main thing people open. | Every screen with the menu | **Keep for now.** Move it into the trip screen (a photo strip) if the menu gets cut. |
| Add expense | **Yes.** It is the same as + → Add expense. | It was added so you can log a bill from anywhere. The + is already everywhere the tab bar is. | Every screen with the menu | **Cut.** It is a straight duplicate. In flows, the menu could offer + instead. |
| Invite | Partly. The trip screen has Add people next to the faces. | Adding people mid-trip (Ren) is a key job. | Every screen with the menu | **Move.** Keep it on the trip screen (it is already there) and drop it from the menu. |
| Settings | No. The avatar on Trips also opens Profile. | It is the standard place for account and trip settings. | Every screen with the menu | **Keep, low priority.** It could live only behind the avatar. |

## Overlap in one line

Only Add expense is a true duplicate (of + → Add expense). Invite is a near duplicate (of Add people on the trip screen). The tab bar and the menu do not share any destinations.

## Proposed minimal option

Three items behind the menu button: **Notifications · Album · Settings**.

- Add expense lives only in the +.
- Invite lives only on the trip screen.
- On in-flow screens, the same three, plus a **Home** item (Trips), because the tab bar is hidden there.
- Fewer icons means the capsule is shorter and each item can show a label, which helps since icon-only items are the weakest part today.

Open questions for Ryan:
1. Should Notifications become a bell with a dot on its own, instead of sitting behind a menu?
2. Do in-flow screens need the menu at all, or is Back plus a swipe-down to dismiss enough?
