# Prism design system changelog

`tokens.json` is the source of truth. `tokens.css` and the Figma variables are generated from it by `build_tokens.py`. Anyone building on `tokens.*` (for example the Storybook in `storybook/`) should check here before they rebuild.

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
