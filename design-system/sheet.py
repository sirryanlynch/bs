import json
T=json.load(open('tokens.json'))
sem=T['color']['semantic']
def sw(name):
    d=sem[name];return f'<div class="tok"><div class="pair"><i style="background:{d["light"]["hex"]}"></i><i style="background:{d["dark"]["hex"]}"></i></div><div><b>{name}</b><small>{d["light"]["hex"]} · {d["dark"]["hex"]}</small></div></div>'
groups=[('Surfaces',['bg/canvas','bg/surface','bg/surface-raised','bg/sunken']),('Text',['text/primary','text/secondary','text/tertiary','text/on-accent']),
        ('Accent & status',['accent/primary','accent/subtle','status/leading','status/owed','status/owe','status/excluded']),('Glass & lines',['glass/fill','glass/fill-thick','glass/stroke','border/subtle'])]
colors=''.join(f'<div class="cg"><h6>{g}</h6>{"".join(sw(n) for n in names)}</div>' for g,names in groups)
types=''
for n,v in T['type'].items():
    fam='var(--font-display)' if v['family'].startswith('display') else 'var(--font-ui)'
    st='italic' if v.get('fontStyle')=='italic' else 'normal'
    sample={'display/xl':'Lisbon, tonight','display/l':'€184.60','display/m':'Taberna wins','display/celebrate':'All squared up.','ui/large-title':'Lisbon Crew','ui/title-1':'Tonight','ui/title-2':'Dinner poll','ui/title-3':'Balances','ui/headline':'Taberna da Rua das Flores','ui/body':'Ari added Ren to the trip','ui/callout':'Votes close at 19:30','ui/subhead':'Tasca · €€ · 6 min walk','ui/footnote':'Updated just now','ui/caption-1':'4 VOTES · 57%','ui/caption-2':'LEADING','ui/amount':'+€18.40'}[n]
    size=min(v['size'],46)
    cls=' class="tu-celebrate-text"' if n=='display/celebrate' else ''
    tf='font-variant-numeric:tabular-nums;' if 'fontFeatures' in v else ''
    up='text-transform:uppercase;letter-spacing:.06em;' if n=='ui/caption-2' else f'letter-spacing:{v["tracking"]}px;'
    types+=f'<div class="ty"><code>{n}<br><span>{v["size"]}/{v["lineHeight"]} · {v["weight"]}{" · italic" if st=="italic" else ""}</span></code><span{cls} style="font:{st} {v["weight"]} {size}px/{min(v["lineHeight"],50)}px {fam};{up}{tf}">{sample}</span></div>'
spacing=''.join(f'<div class="spc"><i style="width:{v["$value"]}px"></i><code>{k} · {v["$value"]}</code></div>' for k,v in T['spacing'].items() if v['$value']>0)
radius=''.join(f'<div class="rad"><i style="border-radius:{min(v["$value"],40)}px"></i><code>{k}<br>{v["$value"]}</code></div>' for k,v in T['radius'].items())
m=T['motion']
dur=''.join(f'<tr><td><b>{k}</b></td><td class="mono">{v} ms</td></tr>' for k,v in m['duration'].items())
spr=''.join(f'<tr><td><b>spring/{k}</b></td><td class="mono">response {v["response"]} · damping {v["dampingFraction"]}</td></tr>' for k,v in m['spring'].items() if k!='css-approx')
eas=''.join(f'<tr><td><b>ease/{k}</b></td><td class="mono">{v}</td></tr>' for k,v in m['easing'].items())
pat=''.join(f'<tr><td><b>{k}</b></td><td>{v["rich"]}</td><td>{v["reduced"]}</td></tr>' for k,v in m['patterns'].items())

AV={'A':'linear-gradient(135deg,#C9C1FF,#6E5BFF)','R':'linear-gradient(135deg,#D9D7E1,#8D8C9A)','N':'linear-gradient(135deg,#E2E0E9,#565564)','M':'linear-gradient(135deg,#B4B2C0,#2E2D38)','J':'linear-gradient(135deg,#EEEDF2,#6B6A78)','S':'linear-gradient(135deg,#D9D7E1,#565564)'}
def av(i,size=32,cls=''): return f'<span class="av {cls}" style="width:{size}px;height:{size}px;font-size:{size*0.4:.0f}px;background:{AV.get(i,AV["J"])}">{i}</span>'
def ico(name,s=20):
    P={'chev':'<path d="M15 6l-6 6 6 6"/>','plus':'<path d="M12 5v14M5 12h14"/>','person+':'<circle cx="10" cy="8" r="4"/><path d="M3 20c1-4 4-6 7-6s6 2 7 6M19 8v6M16 11h6"/>','trips':'<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"/>','plan':'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>','poll':'<path d="M6 20V11M12 20V5M18 20v-6"/>','money':'<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5a2.5 2 0 00-5 0c0 2.5 5 1.5 5 4a2.5 2 0 01-5 0M12 6.5v11"/>','check':'<path d="M5 12.5l4.5 4.5L19 7.5"/>','bell':'<path d="M6 16V11a6 6 0 1112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>','wine':'<path d="M8 3h8l-1 6a3 3 0 01-6 0zM12 12v8M8.5 20h7"/>','fork':'<path d="M7 3v8a2 2 0 002 2v8M11 3v8M15 3c-1.5 2-2 4-2 7h3V3zM16 13v8"/>','arrow':'<path d="M5 12h14M13 6l6 6-6 6"/>','x':'<path d="M6 6l12 12M18 6L6 18"/>','apple':'<path d="M15.5 4c-1 .1-2.2.7-2.9 1.6-.6.7-1.1 1.8-.9 2.8 1.1.1 2.2-.6 2.9-1.4.6-.8 1-1.9.9-3zM18.5 16.4c-.5 1.1-.7 1.6-1.4 2.6-.9 1.4-2.2 3-3.8 3-1.4 0-1.8-.9-3.7-.9s-2.3.9-3.7.9c-1.6 0-2.8-1.5-3.7-2.9C-.3 15.300 1.6 9.8 4.9 9.7c1.4 0 2.6 1 3.5 1s2.400-1.200 4-1c.7 0 2.600.300 3.800 2.100-3.300 1.800-2.800 6.500.300 4.600z"/>'}
    fill='none' if name!='apple' else 'currentColor'
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="{fill}" stroke="{"currentColor" if name!="apple" else "none"}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">{P[name]}</svg>'

def ring(state):
    import math
    n=5;r=40;cx=cy=52;segs=''
    filled={'s1':1,'s3':3,'ready':5}[state]
    for k in range(n):
        a0=-90+k*72+5;a1=a0+62
        x0=cx+r*math.cos(math.radians(a0));y0=cy+r*math.sin(math.radians(a0));x1=cx+r*math.cos(math.radians(a1));y1=cy+r*math.sin(math.radians(a1))
        col=('url(#spec)' if state=='ready' else 'url(#irisg)') if k<filled else 'var(--color-track-default)'
        segs+=f'<path d="M{x0:.1f},{y0:.1f} A{r},{r} 0 0 1 {x1:.1f},{y1:.1f}" stroke="{col}" stroke-width="10" fill="none" stroke-linecap="round"/>'
    num={'s1':'214','s3':'38','ready':'6'}[state];lab={'s1':'SPOTS','s3':'SPOTS','ready':'PICKS'}[state]
    return f'''<svg width="104" height="104" viewBox="0 0 104 104"><defs><linearGradient id="irisg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#A99CFF"/><stop offset="1" stop-color="#6E5BFF"/></linearGradient>
    <linearGradient id="spec" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB8D9"/><stop offset=".25" stop-color="#FFD9A8"/><stop offset=".5" stop-color="#C8F2D9"/><stop offset=".75" stop-color="#A8E0FF"/><stop offset="1" stop-color="#C9B8FF"/></linearGradient></defs>{segs}
    <text x="52" y="56" text-anchor="middle" font-family="Instrument Serif" font-size="30" fill="var(--color-text-primary)">{num}</text><text x="52" y="72" text-anchor="middle" font-family="Inter" font-weight="600" font-size="8.5" letter-spacing="1" fill="var(--color-text-tertiary)">{lab}</text></svg>'''

PH='../moodboards/photos/px_{}.jpg'.format
def pollcard(dark=False):
    return f'''<div class="poll tu-glass">
  <div class="ph"><div><div class="t-headline">Dinner tonight?</div><div class="t-footnote sec">Ari’s poll · 5 of 7 voted</div></div><span class="timer tu-num">{ico('bell',13)} 12:40</span></div>
  <div class="opt lead"><span class="badge">Leading</span><img src="{PH(34110274)}"><div class="oc"><div class="t-headline">Taberna da Rua das Flores</div><div class="t-subhead sec">Tasca · €€ · 6 min walk</div><div class="bar"><i style="width:57%"></i></div></div><div class="pct"><b class="tu-num">57%</b><div class="stack">{av('A',20)}{av('M',20)}{av('J',20)}{av('S',20)}</div></div></div>
  <div class="opt mine"><img src="{PH(6314564)}"><div class="oc"><div class="t-headline">Cervejaria Ramiro <span class="myvote">{ico('check',12)} Your vote</span></div><div class="t-subhead sec">Seafood · €€€ · 14 min</div><div class="bar"><i style="width:29%"></i></div></div><div class="pct"><b class="tu-num">29%</b><div class="stack">{av('R',20)}{av('N',20)}</div></div></div>
  <div class="opt"><img src="{PH(20594880)}"><div class="oc"><div class="t-headline">Park Rooftop</div><div class="t-subhead sec">Drinks &amp; bites · €€ · 9 min</div><div class="bar"><i style="width:14%"></i></div></div><div class="pct"><b class="tu-num">14%</b><div class="stack">{av('J',20)}</div></div></div>
</div>'''
def chips():
    return f'''<div class="chip tu-surface">{av('R',36)}<div><b>Ren</b><small>owes you</small></div><span class="amt owed tu-num">+€18.40</span></div>
<div class="chip tu-surface">{av('N',36)}<div><b>Nic</b><small>you owe</small></div><span class="amt owe tu-num">−€42.10</span></div>
<div class="chip tu-surface settled">{av('M',36)}<div><b>Mara</b><small>settled</small></div><span class="amt tu-num" style="color:var(--color-status-settled)">{ico('check',16)} €0.00</span></div>'''
def tabbar():
    return f'''<div class="tabwrap"><div class="tabbar tu-glass">
  <span class="tab on">{ico('trips',22)}<em>Trips</em></span><span class="tab">{ico('plan',22)}<em>Plan</em></span><span class="tab">{ico('poll',22)}<em>Polls</em></span><span class="tab">{ico('money',22)}<em>Money</em></span></div>
  <span class="fab tu-glass">{ico('plus',24)}</span></div>'''
def settle():
    return f'''<div class="sheet tu-glass-thick"><i class="grab"></i>
  <div class="sh-h"><div><div class="t-title-2">Settle up</div><div class="t-subhead sec">Lisbon Crew · whole trip</div></div><span class="pill-acc">{ico('check',13)} Simplified</span></div>
  <div class="simp"><span class="tu-num"><s>6</s> → <b>3</b> payments</span><small>Same totals, fewer transfers</small></div>
  <div class="pay">{av('A',30)}<span class="ar">{ico('arrow',14)}</span>{av('N',30)}<div><b>You → Nic</b><small>Dinner, tram, wine</small></div><b class="tu-num owe">€42.10</b></div>
  <div class="pay">{av('R',30)}<span class="ar">{ico('arrow',14)}</span>{av('A',30)}<div><b>Ren → You</b><small>Dinner (no wine)</small></div><b class="tu-num owed">€18.40</b></div>
  <div class="pay">{av('M',30)}<span class="ar">{ico('arrow',14)}</span>{av('J',30)}<div><b>Mara → João</b><small>Airbnb</small></div><b class="tu-num">€64.00</b></div>
  <span class="btn primary full">{ico('apple',18)} Pay Nic €42.10</span>
  <span class="btn ghost full">Mark paid another way</span></div>'''

html=f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="tokens.css"><style>
@font-face{{font-family:"Inter";src:url(../moodboards/src/fonts/Inter-VariableFont_opsz,wght.ttf);font-weight:100 900}}
@font-face{{font-family:"Instrument Serif";src:url(../moodboards/src/fonts/InstrumentSerif-Regular.ttf)}}
@font-face{{font-family:"Instrument Serif";src:url(../moodboards/src/fonts/InstrumentSerif-Italic.ttf);font-style:italic}}
@font-face{{font-family:"Geist Mono";src:url(../moodboards/src/fonts/GeistMono-VariableFont_wght.ttf);font-weight:100 900}}
:root{{--font-ui:"Inter",system-ui;--font-display:"Instrument Serif",serif}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1920px;background:var(--ambient-prism);color:var(--color-text-primary);font-family:var(--font-ui);-webkit-font-smoothing:antialiased;padding:56px 60px 60px}}
.sec{{color:var(--color-text-secondary)}} .ter{{color:var(--color-text-tertiary)}}
.t-headline{{font:var(--type-ui-headline);letter-spacing:-.43px}} .t-subhead{{font:var(--type-ui-subhead);letter-spacing:-.23px}} .t-footnote{{font:var(--type-ui-footnote)}} .t-title-2{{font:var(--type-ui-title-2);letter-spacing:-.26px}}
code,.mono{{font-family:"Geist Mono",monospace;font-size:11px}}
header{{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:34px}}
.eyebrow{{font:700 12px/1 var(--font-ui);letter-spacing:.14em;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:12px}} .eyebrow b{{color:var(--color-accent-primary)}}
h1{{font:400 96px/.9 var(--font-display);letter-spacing:-2px}} h1 em{{font-style:italic}}
.lede{{max-width:640px;font:400 18px/1.45 var(--font-ui);color:var(--color-text-secondary)}}
h2{{font:700 12px/1 var(--font-ui);letter-spacing:.14em;text-transform:uppercase;color:var(--color-text-tertiary);margin:0 0 14px;display:flex;gap:10px;align-items:center}}
h2 span{{font-weight:500;letter-spacing:0;text-transform:none}}
.sectitle{{font:400 44px/1 var(--font-display);margin:38px 0 18px;display:flex;align-items:baseline;gap:16px}} .sectitle small{{font:500 14px/1 var(--font-ui);color:var(--color-text-tertiary)}}
.grid{{display:grid;gap:18px}}
.card{{background:var(--color-bg-surface);border:1px solid var(--color-border-subtle);border-radius:var(--radius-xl);box-shadow:var(--shadow-card);padding:22px 24px}}
.cg h6{{font:600 12px/1 var(--font-ui);color:var(--color-text-secondary);margin:4px 0 10px}}
.tok{{display:flex;gap:10px;align-items:center;margin-bottom:9px}} .pair{{display:flex;border-radius:12px;overflow:hidden;border:1px solid var(--color-border-subtle);flex:none;background:repeating-conic-gradient(#e6e6ea 0 25%,#fff 0 50%) 0 0/10px 10px}}
.pair i{{width:30px;height:34px;display:block}} .tok b{{font:600 12px/1.2 var(--font-ui);display:block}} .tok small{{font:500 10.5px/1.3 "Geist Mono";color:var(--color-text-tertiary)}}
.spectrum{{height:44px;border-radius:14px;background:var(--celebration-gradient);position:relative}}
.ty{{display:grid;grid-template-columns:150px 1fr;align-items:baseline;padding:7px 0;border-bottom:1px solid var(--color-border-subtle);white-space:nowrap;overflow:hidden}}
.ty code{{color:var(--color-text-secondary);line-height:1.3}} .ty code span{{color:var(--color-text-tertiary);font-size:10px}}
.spc{{display:flex;align-items:center;gap:10px;margin:5px 0}} .spc i{{height:14px;background:var(--color-accent-subtle);border:1px solid var(--color-accent-primary);border-radius:3px;display:block}} .spc code{{color:var(--color-text-secondary)}}
.rads{{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}} .rad{{text-align:center}} .rad i{{display:block;height:58px;border:1.5px solid var(--color-text-primary);border-right:0;border-bottom:0;margin-bottom:6px;background:var(--color-bg-surface-raised)}} .rad code{{color:var(--color-text-secondary);font-size:10.5px}}
table{{border-collapse:collapse;width:100%;font-size:12px}} td,th{{text-align:left;padding:6px 6px;border-bottom:1px solid var(--color-border-subtle);vertical-align:top;color:var(--color-text-secondary);line-height:1.35}} th{{font:700 10px/1 var(--font-ui);letter-spacing:.1em;text-transform:uppercase;color:var(--color-text-tertiary)}} td b{{color:var(--color-text-primary);font-weight:600}}
.layers{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}}
.layer{{border-radius:20px;height:150px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}}
.layer b{{font:700 13px/1.2 var(--font-ui)}} .layer small{{font:500 11px/1.35 var(--font-ui);color:var(--color-text-secondary)}}
.stage{{border-radius:40px;padding:34px;background:var(--ambient-prism);border:1px solid var(--color-border-subtle);position:relative;overflow:hidden}}
.stage.photo{{background:url({PH(33793961)}) center/cover}}
.lbl{{font:700 11px/1 var(--font-ui);letter-spacing:.12em;text-transform:uppercase;color:var(--color-text-tertiary);margin-bottom:12px}}
.btn{{height:52px;border-radius:999px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px;font:600 17px/1 var(--font-ui);letter-spacing:-.43px;white-space:nowrap}}
.btn.m{{height:44px;font-size:15px;padding:0 18px}} .btn.s{{height:32px;font-size:13px;padding:0 13px;letter-spacing:0}}
.btn.primary{{background:var(--color-accent-primary);color:var(--color-text-on-accent);box-shadow:var(--shadow-accent)}}
.btn.pressed{{background:var(--color-accent-pressed);transform:scale(.97);box-shadow:none}}
.btn.disabled{{opacity:var(--opacity-disabled);box-shadow:none}}
.btn.glass{{background:var(--color-glass-fill);backdrop-filter:var(--glass-backdrop);border:1px solid var(--color-glass-stroke);box-shadow:var(--shadow-float);color:var(--color-text-primary)}}
.btn.ghost{{color:var(--color-accent-text);background:transparent}}
.btn.celebrate{{position:relative;background:var(--color-bg-surface);color:var(--color-text-primary)}}
.btn.celebrate::before{{content:"";position:absolute;inset:0;border-radius:999px;padding:2px;background:var(--celebration-gradient);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}}
.btn.full{{width:100%}}
.ib{{width:44px;height:44px;border-radius:50%;display:inline-grid;place-items:center}}
.av{{border-radius:50%;display:inline-grid;place-items:center;color:#fff;font-weight:700;flex:none;border:2px solid var(--color-bg-surface);position:relative}}
.av.excl{{filter:grayscale(1);opacity:.45}} .av.excl::after{{content:"";position:absolute;left:-2px;right:-2px;top:50%;height:2px;background:var(--color-status-owe);transform:rotate(-35deg)}}
.av.new{{box-shadow:0 0 0 2px var(--color-bg-surface),0 0 0 4px var(--color-accent-primary)}}
.stack{{display:flex}} .stack .av{{margin-left:-7px}} .stack .av:first-child{{margin-left:0}}
.more{{border-radius:50%;display:inline-grid;place-items:center;background:var(--color-bg-sunken);color:var(--color-text-secondary);font:700 12px/1 var(--font-ui);border:2px solid var(--color-bg-surface);margin-left:-7px}}
.poll{{border-radius:30px;padding:18px;width:100%}}
.ph{{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}}
.timer{{display:inline-flex;gap:5px;align-items:center;font:600 13px/1 var(--font-ui);padding:8px 11px;border-radius:999px;background:var(--color-bg-surface);border:1px solid var(--color-border-subtle)}}
.opt{{position:relative;display:grid;grid-template-columns:56px 1fr auto;gap:12px;align-items:center;padding:10px;border-radius:20px;margin-top:8px;background:var(--color-bg-surface);border:1px solid var(--color-border-subtle)}}
.opt img{{width:56px;height:56px;border-radius:14px;object-fit:cover}}
.opt.lead{{border:1.5px solid var(--color-status-leading);box-shadow:0 12px 30px -16px rgba(110,91,255,.55)}}
.opt.lead::after{{content:"";position:absolute;inset:0;border-radius:20px;background:linear-gradient(105deg,transparent 30%,var(--color-glass-highlight) 45%,transparent 60%);pointer-events:none}}
.badge{{position:absolute;top:-9px;left:66px;font:700 10px/1 var(--font-ui);letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px;background:var(--color-status-leading);color:var(--color-text-on-accent)}}
.bar{{height:6px;border-radius:9px;background:var(--color-track-default);margin-top:8px;overflow:hidden}} .bar i{{display:block;height:100%;border-radius:9px;background:var(--color-text-tertiary);opacity:.55}}
.opt.lead .bar i{{background:var(--color-status-leading);opacity:1}}
.pct{{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:6px}} .pct b{{font:600 15px/1 var(--font-ui)}}
.myvote{{display:inline-flex;align-items:center;gap:3px;font:600 11px/1 var(--font-ui);color:var(--color-accent-text);background:var(--color-accent-subtle);padding:4px 7px;border-radius:999px;margin-left:6px;vertical-align:2px}}
.chip{{display:flex;align-items:center;gap:10px;border-radius:999px;padding:7px 16px 7px 7px;box-shadow:none}}
.chip b{{font:600 15px/1.1 var(--font-ui);display:block}} .chip small{{font:500 12px/1.2 var(--font-ui);color:var(--color-text-secondary)}}
.amt{{margin-left:auto;font:600 17px/1 var(--font-ui);display:inline-flex;gap:4px;align-items:center}} .owed{{color:var(--color-status-owed)}} .owe{{color:var(--color-status-owe)}}
.navbar{{border-radius:28px;padding:10px 12px 16px}} .navrow{{display:flex;justify-content:space-between;align-items:center}}
.tabwrap{{display:flex;gap:10px;align-items:center}} .tabbar{{flex:1;height:62px;border-radius:999px;display:flex;justify-content:space-around;align-items:center;padding:0 8px}}
.tab{{display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--color-text-secondary);padding:6px 14px;border-radius:999px}} .tab em{{font:600 10px/1 var(--font-ui);font-style:normal}}
.tab.on{{color:var(--color-accent-primary);background:var(--color-accent-subtle)}}
.fab{{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;color:var(--color-accent-primary)}}
.notif{{border-radius:26px;padding:13px 14px;display:grid;grid-template-columns:38px 1fr auto;gap:11px;align-items:start}}
.appicon{{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#FBFAFD,#D9D7E1);border:1px solid var(--color-border-subtle);display:grid;place-items:center;font:400 22px/1 var(--font-display);color:#6E5BFF}}
.quick{{display:flex;gap:6px;margin-top:9px}} .quick span{{font:600 13px/1 var(--font-ui);padding:9px 12px;border-radius:999px;background:var(--color-bg-surface);border:1px solid var(--color-border-subtle)}}
.quick span.on{{background:var(--color-accent-primary);color:var(--color-text-on-accent);border-color:transparent}}
.island{{height:37px;border-radius:999px;background:#000;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 10px 0 6px;width:250px;font:600 12px/1 var(--font-ui)}}
.island .mini{{width:26px;height:26px;border-radius:50%;background:url({PH(34110274)}) center/cover}} .island .lv{{color:#A99CFF}}
.erow{{display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--color-border-subtle)}}
.eic{{width:40px;height:40px;border-radius:12px;background:var(--color-bg-sunken);display:grid;place-items:center;color:var(--color-text-secondary)}}
.excl-tag{{display:inline-flex;align-items:center;gap:6px;margin-top:6px;font:600 11.5px/1 var(--font-ui);color:var(--color-status-excluded);background:var(--color-bg-sunken);padding:5px 8px 5px 5px;border-radius:999px}}
.sheet{{border-radius:38px 38px 30px 30px;padding:12px 20px 18px;display:flex;flex-direction:column;gap:10px}}
.grab{{width:38px;height:5px;border-radius:9px;background:var(--color-border-strong);display:block;margin:0 auto 6px}}
.sh-h{{display:flex;justify-content:space-between;align-items:center}}
.pill-acc{{display:inline-flex;gap:4px;align-items:center;font:600 12px/1 var(--font-ui);color:var(--color-accent-text);background:var(--color-accent-subtle);padding:7px 10px;border-radius:999px}}
.simp{{background:var(--color-bg-surface);border:1px solid var(--color-border-subtle);border-radius:18px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center}}
.simp span{{font:400 26px/1 var(--font-display)}} .simp s{{color:var(--color-text-tertiary)}} .simp small{{font:500 12px/1.3 var(--font-ui);color:var(--color-text-secondary)}}
.pay{{display:grid;grid-template-columns:30px 18px 30px 1fr auto;gap:6px;align-items:center;padding:8px 2px;border-bottom:1px solid var(--color-border-subtle)}}
.pay .ar{{color:var(--color-text-tertiary);display:grid;place-items:center}} .pay div{{margin-left:6px}} .pay div b{{font:600 14px/1.2 var(--font-ui);display:block}} .pay small{{font:500 11.5px/1.2 var(--font-ui);color:var(--color-text-secondary)}} .pay>b{{font:600 15px/1 var(--font-ui)}}
.toast{{border-radius:999px;padding:9px 16px 9px 9px;display:inline-flex;align-items:center;gap:10px;font:600 14px/1.2 var(--font-ui)}}
.toast .ok{{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--color-accent-primary);color:var(--color-text-on-accent)}}
.toast small{{display:block;font:500 12px/1.2 var(--font-ui);color:var(--color-text-secondary)}}
.confirm{{border-radius:32px;padding:22px;text-align:center;position:relative;overflow:hidden}}
.confirm::before{{content:"";position:absolute;inset:0;background:var(--celebration-gradient);opacity:.35}}
.confirm>*{{position:relative}}
.dark{{background:radial-gradient(60% 40% at 88% 0%,rgba(143,128,255,.28),transparent 70%),radial-gradient(50% 40% at 0% 45%,rgba(168,224,255,.16),transparent 70%),#0D0D11}}
.note{{font:500 12px/1.45 var(--font-ui);color:var(--color-text-secondary);margin-top:10px}} .note b{{color:var(--color-text-primary)}}
</style></head><body>
<header><div><div class="eyebrow">TripUp · Design system · <b>Prism v1.0</b> · iPhone 17 (402×874 pt) · iOS 26</div><h1>Prism <em>system</em></h1></div>
<p class="lede">Pearl-white Liquid Glass that refracts into colour only on the big moments. The tokens live in <code>tokens.json</code> and <code>tokens.css</code>. SF Pro (Inter shown as a stand-in here) runs the UI; Instrument Serif carries trip names, amounts and celebrations. Light mode is “Pearl”, dark mode is “Graphite Pearl”.</p></header>

<div class="sectitle">Foundations <small>colour roles · type · space · radius · glass · shadow · motion</small></div>
<div class="grid" style="grid-template-columns:1.25fr 1fr">
 <div class="card"><h2>Semantic colour <span>each swatch: light | dark</span></h2>
  <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:14px">{colors}</div>
  <h2 style="margin-top:14px">Celebration spectrum <span>reserved: poll won · all squared up · trip milestones</span></h2>
  <div class="spectrum"></div>
  <div class="grid" style="grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px">{''.join(f'<code style="color:var(--color-text-secondary)"><i style="display:inline-block;width:9px;height:9px;border-radius:9px;background:{T["color"]["primitive"]["spectrum"][k]["$value"]};margin-right:5px"></i>{k} {T["color"]["primitive"]["spectrum"][k]["$value"]}</code>' for k in ['blush','apricot','mint','sky','lilac'])}</div>
  <p class="note"><b>Allowed forms:</b> a light sheen over glass, the 1.5 pt celebrate-button border, spectrum text on <code>display/celebrate</code> (use the <code>text-*</code> deep stops on light surfaces), and 3D confetti. <b>Never</b> as a UI fill, as a status colour, more than once per view, or while a task is in progress. <b>Contrast:</b> all text roles pass AA in both modes (on-accent 4.56; owed jade-600 4.9; owe rose-600 5.7; tertiary 5.3).</p>
 </div>
 <div class="card"><h2>Type scale <span>SF Pro UI · Instrument Serif display · tabular numerals</span></h2>{types}</div>
</div>
<div class="grid" style="grid-template-columns:.8fr 1fr 1.3fr 1.2fr;margin-top:18px">
 <div class="card"><h2>Spacing <span>4 pt grid</span></h2>{spacing}<p class="note">Margins 20 · card padding 16–20 · stack gaps 8/12 · section gaps 24/32. Minimum hit target 44 pt.</p></div>
 <div class="card"><h2>Radius <span>concentric</span></h2><div class="rads">{radius}</div><p class="note">Inner radius = outer radius − padding: sheet 38 → card 26 → thumbnail 14 → chip/pill 999. Device corner ≈ 62.</p></div>
 <div class="card"><h2>Glass layers <span>glass is for chrome only</span></h2>
  <div class="layers">
   <div class="layer" style="background:url({PH(29743109)}) center/cover"><b style="color:#fff">L0 Canvas</b><small style="color:rgba(255,255,255,.9)">Photo, map, ambient prism</small></div>
   <div class="layer tu-surface"><b>L1 Content</b><small>bg/surface ≥ 92% · shadow/card · no blur</small></div>
   <div class="layer" style="background:url({PH(29743109)}) center/cover;padding:8px"><div class="layer tu-glass" style="height:100%;border-radius:14px"><b>L2 Chrome</b><small>glass/fill 42% · blur 26 · sat 180% · 1 px stroke</small></div></div>
   <div class="layer" style="background:var(--celebration-gradient)"><b>L3 Moment</b><small style="color:#16161D">Spectrum sheen · ≤ 1.2 s · reserved</small></div>
  </div>
  <table style="margin-top:10px"><tr><td><b>blur</b></td><td class="mono">thin 16 · glass 26 · thick 40 (sheets)</td></tr><tr><td><b>fill</b></td><td class="mono">light 42% / 62% thick · dark graphite 52% / 72%</td></tr><tr><td><b>Reduce Transparency</b></td><td>L2 → bg/surface-raised at 94%, blur 0</td></tr></table></div>
 <div class="card"><h2>Shadows <span>light · dark has deeper black</span></h2>
  <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px;margin:6px 0 14px">
   <div style="height:80px;border-radius:20px;background:var(--color-bg-surface);box-shadow:var(--shadow-card);display:grid;place-items:center"><code>shadow/card</code></div>
   <div style="height:80px;border-radius:20px" class="tu-glass"><div style="height:100%;display:grid;place-items:center"><code>shadow/float</code></div></div>
   <div style="height:80px;border-radius:20px;background:var(--color-accent-primary);box-shadow:var(--shadow-accent);display:grid;place-items:center;color:#fff"><code>shadow/accent</code></div></div>
  <table><tr><td><b>card</b></td><td class="mono">inset 0 1 0 white 90% · 0 18 40 −24 #3C326E 22%</td></tr><tr><td><b>float</b></td><td class="mono">inset 0 1 0 white 95% · 0 20 40 −20 #3C326E 35%</td></tr><tr><td><b>accent</b></td><td class="mono">0 10 24 −10 iris 70% (primary button only)</td></tr></table></div>
</div>
<div class="grid" style="grid-template-columns:.9fr 2.1fr;margin-top:18px">
 <div class="card"><h2>Motion tokens</h2><table>{dur}{spr}{eas}</table><p class="note"><b>Haptics:</b> selection on vote · light tap per live vote (max 1/s) · success on poll close and on settle · warning on “object”.</p></div>
 <div class="card"><h2>Motion patterns <span>rich by default · Reduce Motion fallback</span></h2><table><tr><th>Pattern</th><th>Rich</th><th>Reduce Motion</th></tr>{pat}</table><p class="note">Celebrations run once, never loop, and never block input. Nothing flashes more than 3 times per second. Use <code>UIAccessibility.isReduceMotionEnabled</code> on iOS and <code>prefers-reduced-motion</code> on web.</p></div>
</div>

<div class="sectitle">Core components <small>shown in Pearl (light); a dark-mode strip follows</small></div>
<div class="stage">
<div class="grid" style="grid-template-columns:1fr 1.15fr 1fr 1fr;align-items:start;gap:26px">
 <div class="grid" style="gap:22px">
  <div><div class="lbl">Buttons · primary</div><div style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn primary">Vote for Taberna</span><span class="btn primary pressed">Pressed</span><span class="btn primary disabled">Disabled</span></div></div>
  <div><div class="lbl">Secondary glass · ghost · celebrate</div><div style="display:flex;gap:10px;flex-wrap:wrap"><span class="btn glass">{ico('plus',18)} Add option</span><span class="btn ghost">Not now</span><span class="btn celebrate">{ico('check',18)} All squared up</span></div></div>
  <div><div class="lbl">Sizes L 52 · M 44 · S 32 · icon 44</div><div style="display:flex;gap:10px;align-items:center"><span class="btn primary">Large</span><span class="btn primary m">Medium</span><span class="btn glass s">Small</span><span class="ib tu-glass">{ico('person+',20)}</span><span class="ib tu-glass">{ico('x',18)}</span></div></div>
  <div><div class="lbl">Avatars · 24 / 32 / 40 / 56 · states</div><div style="display:flex;gap:12px;align-items:center">{av('A',24)}{av('R',32)}{av('N',40)}{av('M',56)}<span style="width:12px"></span>{av('R',40,'new')}{av('N',40,'excl')}</div>
   <div class="t-footnote ter" style="margin-top:6px">Ring = new member (Ren) · struck = excluded from an item</div></div>
  <div><div class="lbl">Group stack</div><div style="display:flex;align-items:center;gap:12px"><div class="stack">{av('A',36)}{av('R',36)}{av('N',36)}{av('M',36)}<span class="more" style="width:36px;height:36px">+3</span></div><span class="t-subhead sec">Lisbon Crew · 7</span></div></div>
 </div>
 <div class="grid" style="gap:12px"><div class="lbl">Poll option card · live leading</div>{pollcard()}
  <div class="t-footnote ter">Leading = iris stroke, badge and bar, plus a glint sweep on lead change. “Your vote” = a subtle iris tag. Others = neutral bars. Live bars use spring/live.</div></div>
 <div class="grid" style="gap:22px">
  <div><div class="lbl">Nav bar · glass, large title</div><div class="navbar tu-glass"><div class="navrow"><span class="ib" style="width:36px;height:36px;color:var(--color-accent-primary)">{ico('chev',22)}</span><span class="t-headline" style="opacity:0">x</span><div style="display:flex;gap:6px"><span class="ib tu-glass" style="width:36px;height:36px">{ico('person+',18)}</span></div></div>
   <div style="font:var(--type-display-m);letter-spacing:-.3px;padding:2px 6px 0">Lisbon Crew</div><div class="t-subhead sec" style="padding:2px 6px 0">Oct 12–17 · 7 people · last night</div></div></div>
  <div><div class="lbl">Tab bar · floating glass + action</div>{tabbar()}</div>
  <div><div class="lbl">Balance chips</div><div class="grid" style="gap:8px">{chips()}</div></div>
 </div>
 <div class="grid" style="gap:22px">
  <div><div class="lbl">Notification · actionable</div><div class="notif tu-glass"><span class="appicon">T</span><div><b class="t-headline" style="font-size:15px">Ari started a poll</b><div class="t-subhead sec" style="font-size:14px">Dinner tonight? 3 spots · closes 19:30</div><div class="quick"><span class="on">Taberna</span><span>Ramiro</span><span>Rooftop</span></div></div><span class="t-footnote ter">now</span></div></div>
  <div><div class="lbl">Live Activity · Dynamic Island</div><div class="island"><span style="display:flex;gap:8px;align-items:center"><span class="mini"></span>Taberna leads</span><span class="lv tu-num">57% · 12:40</span></div></div>
  <div><div class="lbl">Explore progress ring · 1/5 · 3/5 · ready</div><div style="display:flex;gap:8px">{ring('s1')}{ring('s3')}{ring('ready')}</div><div class="t-footnote ter">Each filter lights a segment and the count narrows live. When ready, the ring refracts into the spectrum once (a moment).</div></div>
 </div>
</div>
<div class="grid" style="grid-template-columns:1fr 1fr 1fr;gap:26px;margin-top:30px;align-items:start">
 <div><div class="lbl">Expense row · with exclusion</div><div class="card" style="padding:6px 18px">
   <div class="erow"><span class="eic">{ico('fork',20)}</span><div><b class="t-headline">Dinner at Taberna</b><div class="t-subhead sec">Paid by Ari · split 6 ways</div></div><b class="tu-num" style="font:600 17px/1 var(--font-ui)">€146.60</b></div>
   <div class="erow" style="border:0"><span class="eic" style="color:var(--color-accent-primary);background:var(--color-accent-subtle)">{ico('wine',20)}</span><div><b class="t-headline">Vinho Verde × 2</b><div class="t-subhead sec">Split 4 · €9.50 each</div><span class="excl-tag"><span class="stack">{av('R',20,'excl')}{av('N',20,'excl')}</span>Ren &amp; Nic not on wine</span></div><b class="tu-num" style="font:600 17px/1 var(--font-ui)">€38.00</b></div></div></div>
 <div><div class="lbl">Settle sheet · simplified debts</div>{settle()}</div>
 <div class="grid" style="gap:16px"><div class="lbl">Toasts · confirmation</div>
  <span class="toast tu-glass"><span class="ok">{ico('check',16)}</span><span>Ren’s in<small>Added to Lisbon Crew · he’ll see tonight’s poll</small></span></span>
  <span class="toast tu-glass"><span class="ok">{ico('plan',16)}</span><span>Taberna is on tonight<small>Added to itinerary · 20:30</small></span></span>
  <div class="confirm tu-glass-thick"><img src="../moodboards/icons/prism_celebrate.png" style="width:150px;height:150px;margin:-18px auto -14px;display:block;transform:scale(1.5)"><div class="tu-celebrate-text" style="font:italic 400 40px/44px var(--font-display)">All squared up.</div><div class="t-subhead sec" style="margin:6px 0 14px">3 payments · €124.50 settled · everyone’s notified</div><span class="btn glass m">Share the recap</span></div>
 </div>
</div>
</div>

<div class="sectitle">Dark · Graphite Pearl <small>same tokens, dark mode values</small></div>
<div class="stage dark theme-dark" style="color:var(--color-text-primary)">
<div class="grid" style="grid-template-columns:1.15fr 1fr 1fr;gap:26px;align-items:start">
 <div>{pollcard(True)}</div>
 <div class="grid" style="gap:14px">{tabbar()}<div class="grid" style="gap:8px">{chips()}</div><div style="display:flex;gap:10px"><span class="btn primary">Vote</span><span class="btn glass">{ico('plus',18)} Add</span><span class="btn celebrate">{ico('check',18)} Squared up</span></div></div>
 <div>{settle()}</div>
</div></div>
</body></html>'''
open('design-system-sheet.html','w').write(html)
print('ok')
