import json
# ---------- PRIMITIVES ----------
prim = {
 "pearl":{"0":"#FFFFFF","25":"#FBFAFD","50":"#F5F4F8","100":"#EEEDF2","200":"#E2E0E9","300":"#D9D7E1","400":"#B4B2C0","500":"#8D8C9A","600":"#6B6A78","700":"#565564","800":"#2E2D38","900":"#1E1D26","950":"#16161D"},
 "graphite":{"600":"#34343F","700":"#2A2A33","800":"#212128","850":"#1A1A20","900":"#131318","950":"#0D0D11"},
 "iris":{"50":"#F1EFFF","100":"#E4E0FF","200":"#C9C1FF","300":"#A99CFF","400":"#8F80FF","500":"#6E5BFF","600":"#5A46F0","700":"#4936CC","800":"#3A2BA3"},
 "jade":{"300":"#7FDDB8","400":"#3CC79A","500":"#1F9E74","600":"#17805E"},
 "rose":{"300":"#F7A3B2","400":"#F07087","500":"#D9485F","600":"#B8364C"},
 "spectrum":{"blush":"#FFB8D9","apricot":"#FFD9A8","mint":"#C8F2D9","sky":"#A8E0FF","lilac":"#C9B8FF",
             "blush-deep":"#D9418C","apricot-deep":"#E9802F","mint-deep":"#25A36F","sky-deep":"#2A8FD6","lilac-deep":"#6E5BFF"},
 "alpha":{"ink-04":"#16161D0A","ink-06":"#16161D0F","ink-09":"#16161D17","ink-14":"#16161D24","ink-40":"#16161D66",
          "white-12":"#FFFFFF1F","white-18":"#FFFFFF2E","white-42":"#FFFFFF6B","white-62":"#FFFFFF9E","white-75":"#FFFFFFBF","white-90":"#FFFFFFE6",
          "graphite-52":"#1A1A2085","graphite-72":"#1A1A20B8","iris-12":"#6E5BFF1F","iris-20":"#8F80FF33","jade-12":"#1F9E741F","jade-20":"#3CC79A33","rose-12":"#D9485F1F","rose-20":"#F0708733","black-50":"#00000080"}
}
# ---------- SEMANTIC COLOR (light, dark) as primitive refs ----------
sem = {
 "bg/canvas":("pearl/100","graphite/950"),
 "bg/surface":("pearl/0","graphite/850"),
 "bg/surface-raised":("pearl/25","graphite/800"),
 "bg/sunken":("pearl/200","graphite/700"),
 "bg/scrim":("alpha/ink-40","alpha/black-50"),
 "text/primary":("pearl/950","pearl/50"),
 "text/secondary":("pearl/700","pearl/400"),
 "text/tertiary":("pearl/600","pearl/500"),
 "text/on-accent":("pearl/0","pearl/950"),
 "text/inverse":("pearl/0","pearl/950"),
 "border/subtle":("alpha/ink-09","alpha/white-12"),
 "border/strong":("alpha/ink-14","alpha/white-18"),
 "accent/primary":("iris/500","iris/400"),
 "accent/pressed":("iris/600","iris/300"),
 "accent/subtle":("alpha/iris-12","alpha/iris-20"),
 "accent/text":("iris/600","iris/300"),
 "status/owed":("jade/600","jade/400"),
 "status/owed-subtle":("alpha/jade-12","alpha/jade-20"),
 "status/owe":("rose/600","rose/400"),
 "status/owe-subtle":("alpha/rose-12","alpha/rose-20"),
 "status/leading":("iris/500","iris/400"),
 "status/settled":("jade/600","jade/400"),
 "status/excluded":("pearl/600","pearl/500"),
 "glass/fill":("alpha/white-42","alpha/graphite-52"),
 "glass/fill-thick":("alpha/white-62","alpha/graphite-72"),
 "glass/stroke":("alpha/white-75","alpha/white-12"),
 "glass/highlight":("alpha/white-90","alpha/white-18"),
 "track/default":("alpha/ink-06","alpha/white-12"),
 "celebration/blush":("spectrum/blush","spectrum/blush"),
 "celebration/apricot":("spectrum/apricot","spectrum/apricot"),
 "celebration/mint":("spectrum/mint","spectrum/mint"),
 "celebration/sky":("spectrum/sky","spectrum/sky"),
 "celebration/lilac":("spectrum/lilac","spectrum/lilac"),
 "celebration/text-blush":("spectrum/blush-deep","spectrum/blush"),
 "celebration/text-apricot":("spectrum/apricot-deep","spectrum/apricot"),
 "celebration/text-mint":("spectrum/mint-deep","spectrum/mint"),
 "celebration/text-sky":("spectrum/sky-deep","spectrum/sky"),
 "celebration/text-lilac":("spectrum/lilac-deep","spectrum/lilac"),
}
roles = {
 "_contrast":"Verified WCAG AA (≥4.5:1) for text roles on bg/surface in both modes: on-accent 4.56 (light) / ink on iris-400 5.74 (dark); owed jade-600 4.9; owe rose-600 ≈5.6; tertiary pearl-600 ≈5.3.",
 "accent/primary":"The only acting colour: primary buttons, your vote, selected filter chips, and the active tab. Max one accent-filled element per view.",
 "status/leading":"The live leading poll option (bar fill + 'Leading' badge). Same hue as the accent, by design.",
 "status/owed":"Someone owes YOU. Always paired with a '+' sign and the words 'owes you'.",
 "status/owe":"YOU owe someone. Always paired with a '−' sign and the words 'you owe'.",
 "status/excluded":"A person excluded from a line item (strikethrough avatar + label 'not on wine').",
 "glass/*":"L2 chrome only (nav bar, tab bar, sheets, floating actions). Never behind body text over photos.",
 "celebration/*":"RESERVED. Only for poll won, all squared up, and trip milestones. Never a UI fill. The text-* variants are for spectrum text on light surfaces (AA).",
}
spacing = {"0":0,"0.5":2,"1":4,"2":8,"3":12,"4":16,"5":20,"6":24,"8":32,"10":40,"12":48,"16":64}
radius = {"xs":8,"sm":12,"md":16,"lg":20,"xl":26,"2xl":32,"sheet":38,"device":62,"pill":999}
blur = {"glass-thin":16,"glass":26,"glass-thick":40}
opacity = {"glass-fill-light":0.42,"glass-fill-thick-light":0.62,"glass-fill-dark":0.52,"disabled":0.38,"pressed":0.85,"reduce-transparency-fill":0.94}
layout = {"viewport-width":402,"viewport-height":874,"safe-top":62,"safe-bottom":34,"margin":20,"grid":4,"tabbar-height":62,"navbar-height":44,"min-hit":44}
shadows = {
 "card":{"light":[{"x":0,"y":1,"blur":0,"spread":0,"color":"#FFFFFFE6","inset":True},{"x":0,"y":18,"blur":40,"spread":-24,"color":"#3C326E38"}],
         "dark":[{"x":0,"y":1,"blur":0,"spread":0,"color":"#FFFFFF14","inset":True},{"x":0,"y":18,"blur":40,"spread":-20,"color":"#000000B3"}]},
 "float":{"light":[{"x":0,"y":1,"blur":0,"spread":0,"color":"#FFFFFFF2","inset":True},{"x":0,"y":20,"blur":40,"spread":-20,"color":"#3C326E59"}],
          "dark":[{"x":0,"y":1,"blur":0,"spread":0,"color":"#FFFFFF1F","inset":True},{"x":0,"y":24,"blur":48,"spread":-18,"color":"#000000CC"}]},
 "accent":{"light":[{"x":0,"y":10,"blur":24,"spread":-10,"color":"#6E5BFFB3"}],"dark":[{"x":0,"y":10,"blur":28,"spread":-10,"color":"#8F80FF99"}]},
}
font = {"ui":"SF Pro","ui-fallback-web":"-apple-system, 'SF Pro Text', 'SF Pro Display', system-ui, 'Inter', sans-serif","display":"Instrument Serif","display-fallback-web":"'Instrument Serif', 'New York', Georgia, serif","mono-numerals":"SF Pro (tabular figures, 'tnum')"}
# name: family role, weight, size, lineHeight, tracking(pt), extras
type_scale = [
 ("display/xl","display",400,56,56,-1.0,"Trip names on hero, e.g. 'Lisbon, tonight'"),
 ("display/l","display",400,44,48,-0.6,"Big amounts, e.g. €184.60 (tabular lining)"),
 ("display/m","display",400,34,38,-0.3,"Section heroes, poll winner name"),
 ("display/celebrate","display-italic",400,40,44,-0.4,"Celebration line only: 'All squared up.' (spectrum text allowed)"),
 ("ui/large-title","ui",700,34,41,0.4,"Screen title"),
 ("ui/title-1","ui",700,28,34,0.38,""),
 ("ui/title-2","ui",700,22,28,-0.26,"Section header"),
 ("ui/title-3","ui",600,20,25,-0.45,""),
 ("ui/headline","ui",600,17,22,-0.43,"Card titles, option names, buttons"),
 ("ui/body","ui",400,17,22,-0.43,"Body copy"),
 ("ui/callout","ui",400,16,21,-0.31,""),
 ("ui/subhead","ui",400,15,20,-0.23,"Meta lines"),
 ("ui/footnote","ui",400,13,18,-0.08,"Helper text, timestamps"),
 ("ui/caption-1","ui",500,12,16,0,"Tags, € · walk time"),
 ("ui/caption-2","ui",600,11,13,0.06,"Badges (uppercase +0.6 tracking)"),
 ("ui/amount","ui-tnum",600,17,22,-0.43,"Inline amounts in rows/chips (tabular)"),
]
motion = {
 "duration":{"instant":0,"quick":120,"base":240,"slow":400,"merge":700,"moment-max":1200},
 "easing":{"standard":"cubic-bezier(0.2, 0, 0, 1)","enter":"cubic-bezier(0.05, 0.7, 0.1, 1)","exit":"cubic-bezier(0.3, 0, 1, 1)","linear":"linear"},
 "spring":{"ui":{"response":0.35,"dampingFraction":0.85},"live":{"response":0.45,"dampingFraction":0.78},"moment":{"response":0.55,"dampingFraction":0.62},
           "css-approx":{"ui":"cubic-bezier(0.32, 0.72, 0, 1) 350ms","live":"cubic-bezier(0.34, 1.32, 0.64, 1) 450ms","moment":"cubic-bezier(0.34, 1.56, 0.64, 1) 550ms"}},
 "haptics":{"vote":"selection","live-vote-received":"light impact (max 1/s)","poll-closed":"success","settled":"success","object":"warning"},
 "patterns":{
   "poll-bar-fill":{"rich":"spring.live on width; leader gets one travelling glint (900ms, once per lead change); % digits roll","reduced":"200ms opacity crossfade to final width; digits swap without rolling"},
   "debt-simplify-merge":{"rich":"bubbles drift + metaball fuse over duration.merge; arrows redraw as light paths","reduced":"crossfade before→after (240ms) + label '6 → 3 payments'"},
   "settle-celebration":{"rich":"spectrum sweep across glass + 3D confetti, ≤ moment-max, once, success haptic","reduced":"static spectrum badge + success haptic, no particles"},
   "sheet-present":{"rich":"spring.ui slide + glass blur ramp","reduced":"240ms fade"},
   "explore-ring-advance":{"rich":"segment fills with spring.live; on ready, ring refracts into spectrum once","reduced":"segment appears filled; ready state = static spectrum ring"},
   "ambient-caustics":{"rich":"slow background caustic drift with device tilt","reduced":"off (static gradient)"},
 },
 "rules":["Respect UIAccessibility.isReduceMotionEnabled / prefers-reduced-motion: use the 'reduced' variant","Never flash more than 3 times per second","Celebrations run once, never loop, never block input"]
}
celebration_rules = {
 "allowed_moments":["poll-won","all-squared-up","trip-milestone (first poll, last night, trip wrapped; max 1/day)"],
 "forms":["light sheen across glass (L3 Moment layer)","1.5pt spectrum border on the celebrate button","spectrum text on display/celebrate (use celebration/text-* on light surfaces)","3D confetti renders"],
 "never":["UI fills, backgrounds of regular cards","status colours","more than one spectrum element per view","during a task in progress"],
 "gradient":"linear-gradient(90deg, blush 0%, apricot 25%, mint 50%, sky 75%, lilac 100%)",
 "gradient-text-light":"linear-gradient(90deg, blush-deep, apricot-deep 28%, mint-deep 52%, sky-deep 74%, lilac-deep)"
}
glass_layers = {
 "L0-canvas":{"what":"photo, map, ambient gradient","notes":"Ambient prism gradient: radial blush/apricot/mint/sky/lilac at 35–55% over bg/canvas"},
 "L1-content":{"what":"cards, lists, rows","fill":"bg/surface at ≥ 92% (light) / 100% (dark)","blur":0,"shadow":"card"},
 "L2-chrome":{"what":"nav bar, tab bar, sheets, floating actions, notification banners","fill":"glass/fill (sheets: glass/fill-thick)","blur":"blur/glass (26), saturate 180%","stroke":"1px glass/stroke inside + top glass/highlight","shadow":"float"},
 "L3-moment":{"what":"celebration overlays only","fill":"celebration gradient at 55–80% over glass","duration":"≤ moment-max"},
 "reduce-transparency":"L2 swaps to bg/surface-raised at opacity/reduce-transparency-fill (94%); blur 0"
}
def cssname(n): return n.replace('/','-')
def hexval(ref):
    g,k=ref.split('/',1); return prim[g][k]
out={"$schema":"TripUp Prism tokens v1 (DTCG-style)","meta":{"system":"TripUp · Prism","version":"1.0.0","date":"2026-10-16","modes":["light","dark (Graphite Pearl)"],"platform":"iOS 26 · iPhone 17 (402×874 pt)"},
 "color":{"primitive":{g:{k:{"$type":"color","$value":v} for k,v in d.items()} for g,d in prim.items()},
          "semantic":{n:{"$type":"color","light":{"$value":"{color.primitive."+l.replace('/','.')+"}","hex":hexval(l)},"dark":{"$value":"{color.primitive."+d.replace('/','.')+"}","hex":hexval(d)}} for n,(l,d) in sem.items()},
          "roles":roles},
 "celebration":celebration_rules,
 "font":font,
 "type":{n:{"family":f,"weight":w,"size":s,"lineHeight":lh,"tracking":tr,"use":u, **({"fontFeatures":["tnum","lnum"]} if f in("ui-tnum","display") else {}), **({"fontStyle":"italic"} if f=="display-italic" else {})} for n,f,w,s,lh,tr,u in type_scale},
 "spacing":{k:{"$type":"dimension","$value":v} for k,v in spacing.items()},
 "radius":{k:{"$type":"dimension","$value":v} for k,v in radius.items()},
 "blur":{k:{"$type":"dimension","$value":v} for k,v in blur.items()},
 "opacity":opacity,"layout":layout,"glass":glass_layers,"shadow":shadows,"motion":motion}
json.dump(out,open('tokens.json','w'),indent=2,ensure_ascii=False)
# ---------- CSS ----------
def rgba(h):
    h=h.lstrip('#');r,g,b=int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)
    if len(h)==8: return f"rgba({r}, {g}, {b}, {int(h[6:8],16)/255:.2f})"
    return '#'+h.upper()
L=[":root {","  /* ---------- Primitives ---------- */"]
for g,d in prim.items():
    for k,v in d.items(): L.append(f"  --prim-{g}-{k}: {rgba(v)};")
L.append("\n  /* ---------- Semantic colour · light ---------- */")
for n,(l,d) in sem.items(): L.append(f"  --color-{cssname(n)}: var(--prim-{cssname(l)});")
L.append("  --celebration-gradient: linear-gradient(90deg, var(--color-celebration-blush) 0%, var(--color-celebration-apricot) 25%, var(--color-celebration-mint) 50%, var(--color-celebration-sky) 75%, var(--color-celebration-lilac) 100%);")
L.append("  --celebration-gradient-text: linear-gradient(90deg, var(--color-celebration-text-blush), var(--color-celebration-text-apricot) 28%, var(--color-celebration-text-mint) 52%, var(--color-celebration-text-sky) 74%, var(--color-celebration-text-lilac));")
L.append("  --ambient-prism: radial-gradient(60% 40% at 88% 0%, rgba(201,184,255,.55), transparent 70%), radial-gradient(50% 40% at 0% 45%, rgba(168,224,255,.5), transparent 70%), radial-gradient(45% 35% at 75% 80%, rgba(255,217,168,.45), transparent 70%), radial-gradient(40% 30% at 15% 100%, rgba(255,184,217,.4), transparent 70%), var(--color-bg-canvas);")
L.append("\n  /* ---------- Type ---------- */")
L.append(f"  --font-ui: {font['ui-fallback-web']};\n  --font-display: {font['display-fallback-web']};")
for n,f,w,s,lh,tr,u in type_scale:
    fam="var(--font-display)" if f.startswith('display') else "var(--font-ui)"
    style="italic " if f=="display-italic" else ""
    L.append(f"  --type-{cssname(n)}: {style}{w} {s}px/{lh}px {fam}; --type-{cssname(n)}-tracking: {tr}px;")
L.append("\n  /* ---------- Spacing (4pt grid) ---------- */")
for k,v in spacing.items(): L.append(f"  --space-{k.replace('.','_')}: {v}px;")
L.append("\n  /* ---------- Radius ---------- */")
for k,v in radius.items(): L.append(f"  --radius-{k}: {v}px;")
L.append("\n  /* ---------- Glass & blur ---------- */")
for k,v in blur.items(): L.append(f"  --blur-{k}: {v}px;")
L.append("  --glass-backdrop: blur(var(--blur-glass)) saturate(180%);\n  --glass-backdrop-thick: blur(var(--blur-glass-thick)) saturate(180%);")
for k,v in opacity.items(): L.append(f"  --opacity-{k}: {v};")
L.append("\n  /* ---------- Layout ---------- */")
for k,v in layout.items(): L.append(f"  --layout-{k}: {v}px;")
L.append("  --safe-top: env(safe-area-inset-top, 62px); --safe-bottom: env(safe-area-inset-bottom, 34px);")
def sh(lst): return ', '.join(("inset " if s.get('inset') else "")+f"{s['x']}px {s['y']}px {s['blur']}px {s['spread']}px {rgba(s['color'])}" for s in lst)
L.append("\n  /* ---------- Shadows ---------- */")
for k,v in shadows.items(): L.append(f"  --shadow-{k}: {sh(v['light'])};")
L.append("\n  /* ---------- Motion ---------- */")
for k,v in motion['duration'].items(): L.append(f"  --duration-{k}: {v}ms;")
for k,v in motion['easing'].items(): L.append(f"  --ease-{k}: {v};")
for k,v in motion['spring']['css-approx'].items(): L.append(f"  --spring-{k}: {v};")
L.append("}\n")
L.append("/* ---------- Dark · Graphite Pearl ---------- */")
L.append(":root[data-theme=\"dark\"], .theme-dark {")
for n,(l,d) in sem.items(): L.append(f"  --color-{cssname(n)}: var(--prim-{cssname(d)});")
for k,v in shadows.items(): L.append(f"  --shadow-{k}: {sh(v['dark'])};")
L.append("  --ambient-prism: radial-gradient(60% 40% at 88% 0%, rgba(143,128,255,.28), transparent 70%), radial-gradient(50% 40% at 0% 45%, rgba(168,224,255,.16), transparent 70%), radial-gradient(45% 35% at 75% 80%, rgba(255,184,217,.12), transparent 70%), var(--color-bg-canvas);")
L.append("}\n@media (prefers-color-scheme: dark) { :root:not([data-theme=\"light\"]) { color-scheme: dark; } }\n")
L.append("""/* ---------- Accessibility fallbacks ---------- */
@media (prefers-reduced-transparency: reduce) {
  :root { --color-glass-fill: var(--color-bg-surface-raised); --color-glass-fill-thick: var(--color-bg-surface-raised); --glass-backdrop: none; --glass-backdrop-thick: none; }
}
@media (prefers-reduced-motion: reduce) {
  :root { --duration-merge: 240ms; --duration-moment-max: 0ms; --spring-ui: ease 240ms; --spring-live: ease 200ms; --spring-moment: ease 240ms; }
  *, *::before, *::after { animation-iteration-count: 1 !important; scroll-behavior: auto !important; }
}

/* ---------- Utility recipes ---------- */
.tu-glass { background: var(--color-glass-fill); -webkit-backdrop-filter: var(--glass-backdrop); backdrop-filter: var(--glass-backdrop); border: 1px solid var(--color-glass-stroke); box-shadow: var(--shadow-float); }
.tu-glass-thick { background: var(--color-glass-fill-thick); -webkit-backdrop-filter: var(--glass-backdrop-thick); backdrop-filter: var(--glass-backdrop-thick); border: 1px solid var(--color-glass-stroke); box-shadow: var(--shadow-float); }
.tu-surface { background: var(--color-bg-surface); border: 1px solid var(--color-border-subtle); box-shadow: var(--shadow-card); }
.tu-celebrate-text { background: var(--celebration-gradient-text); -webkit-background-clip: text; background-clip: text; color: transparent; }
.tu-num { font-variant-numeric: tabular-nums lining-nums; }
""")
open('tokens.css','w').write('\n'.join(L))
print('tokens', sum(len(d) for d in prim.values()), 'primitives,', len(sem),'semantic')
