import{j as e}from"./jsx-runtime-BYYWji4R.js";import{E as s,r as x,s as r,P as n,R as ce,S as pe,D as me,a as S,b}from"./untangle-receipt-Dl9-mMnV.js";import{a as ue,I as ge,N as he,b as ye}from"./settle-wNtvRkyH.js";import{B as fe}from"./overlays-B185WV6B.js";import{L as w}from"./core-BR5BZjX6.js";import{p as t,c as ve}from"./data-nxiCAWEG.js";import{w as we}from"./scenario-DEvdkvjY.js";import{L as de}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./solver-assets-BvNkYNQl.js";import"./Icon-DqDER8CT.js";import"./PrismRoot-DCukcACG.js";const Ie={title:"Components/Money",tags:["autodocs"],parameters:{docs:{description:{component:"Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up."}}}},o={name:"ExpenseRow",args:{title:"Vinho Verde (bottle) × 2",amount:38,share:7.6,date:"Fri",category:"wine",state:"default",splitCount:5},argTypes:{state:{control:"inline-radio",options:["default","youExcluded","pending","settled"]},category:{control:"select",options:["fork","wine","bed","tram","plane","receipt"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(w,{children:e.jsx(s,{...a,payer:t.ari,excluded:[t.ren,t.nic]})}),e.jsx(de,{children:"States"}),e.jsxs(w,{children:[e.jsx(s,{title:"Dinner, Taberna da Rua das Flores",payer:t.ari,amount:248.7,share:37.7,date:"Fri",category:"fork"}),e.jsx(s,{title:"Vinho Verde (bottle) × 2",payer:t.mara,amount:38,share:7.6,date:"Sat",category:"wine",excluded:[t.ren,t.nic],splitCount:5}),e.jsx(s,{title:"Ginjinha round",payer:t.joao,amount:14,date:"Fri",category:"wine",state:"youExcluded",excluded:[t.ari]}),e.jsx(s,{title:"Alfama flat, 3 nights",payer:t.sofia,amount:612,share:102,date:"Oct 2",category:"bed"}),e.jsx(s,{title:"Uber from LIS",payer:t.nic,amount:22.4,date:"Just now",category:"tram",state:"pending"}),e.jsx(s,{title:"Tram 28 day passes",payer:t.ren,amount:38.4,share:6.4,date:"Settled",category:"tram",state:"settled"})]})]})},i={name:"ReceiptSplit",args:{venue:"Taberna da Rua das Flores",tip:0},render:a=>e.jsx(ce,{...a,lines:we,members:ve})},l={name:"DebtSimplify",args:{simplified:!1,autoplay:!0},render:a=>e.jsx(me,{...a}),parameters:{docs:{description:{story:"Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only."}}}},d={name:"DebtUntangle (v5.6 Receipt to stacks, default)",args:{solved:!1,controls:"steps",startButton:!0,skin:"receipt"},argTypes:{controls:{control:"inline-radio",options:["steps","full","inline","none"]},skin:{control:"inline-radio",options:["receipt","solver","instrument"]}},render:a=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(b,{...a})}),parameters:{docs:{description:{story:"The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star."}}}},c={name:"DebtUntangle, inline controls (Money screen)",args:{solved:!1,controls:"inline",startButton:!1,skin:"receipt"},render:a=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(b,{...a})})},p={name:"DebtUntangle, solved",args:{solved:!0,controls:"inline",skin:"receipt"},render:a=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(b,{...a})})},m={name:"Money v4 logs and rows",render:()=>e.jsxs("div",{style:{maxWidth:362,display:"grid",gap:12},children:[e.jsx(ue,{net:-23.7,caption:"2 IOUs: you owe Tomás $42.10. Ren owes you $18.40."}),e.jsx(ge,{raw:x,people:t}),e.jsx(he,{nets:{nic:42.1,joao:64,sofia:0,tomas:0,ren:-18.4,ari:-23.7,mara:-64},people:t}),e.jsx(ye,{plan:r,people:t})]})},u={name:"PaymentRow",args:{amount:42.1,state:"due",method:"MB WAY"},argTypes:{state:{control:"inline-radio",options:["due","sending","paid","requested"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(w,{children:e.jsx(n,{...a,from:t.nic,to:t.ari})}),e.jsx(de,{children:"States"}),e.jsxs(w,{children:[e.jsx(n,{from:t.nic,to:t.ari,amount:42.1,state:"due"}),e.jsx(n,{from:t.ari,to:t.joao,amount:12.5,state:"due",method:"Sintra train tickets"}),e.jsx(n,{from:t.mara,to:t.joao,amount:64,state:"sending"}),e.jsx(n,{from:t.ren,to:t.ari,amount:18.4,state:"paid",method:"Revolut"}),e.jsx(n,{from:t.nic,to:t.ari,amount:42.1,state:"requested"})]})]})},g={name:"SettleSheet",parameters:{screen:"full"},args:{amount:42.1,method:"MB WAY",state:"review"},argTypes:{method:{control:"inline-radio",options:["MB WAY","Apple Pay","Revolut","Cash"]},state:{control:"inline-radio",options:["review","sent"]}},render:a=>e.jsx("div",{className:"scr",children:e.jsx(fe,{title:"Settle up",detent:"compact",children:e.jsx(pe,{...a,from:t.nic,to:t.ari})})})},h={name:"DebtUntangle, legacy v4 Instrument skin",args:{solved:!1,controls:"full",startButton:!0,skin:"instrument"},argTypes:{controls:{control:"inline-radio",options:["full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"],description:"Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin()."}},render:a=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(b,{...a})}),parameters:{docs:{description:{story:"Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step."}}}},R={docs:{description:{story:"ReceiptStacksLive sits above the plan rows on Money once a payment exists. Stacks only move when a payment is paid (app or cash), never while pending. Transform and opacity only; Reduce Motion cross-fades."}}},y={name:"Receipt stacks · 0 of 3 paid",parameters:R,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(S,{raw:x,simple:r,people:t,me:"ari",paid:[!1,!1,!1]})})},f={name:"Receipt stacks · 1 of 3 paid",parameters:R,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(S,{raw:x,simple:r,people:t,me:"ari",paid:r.map(a=>a.from==="ari")})})},v={name:"Receipt stacks · all squared",parameters:R,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(S,{raw:x,simple:r,people:t,me:"ari",paid:[!0,!0,!0]})})};var j,k,P;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'ExpenseRow',
  args: {
    title: 'Vinho Verde (bottle) × 2',
    amount: 38,
    share: 7.6,
    date: 'Fri',
    category: 'wine',
    state: 'default',
    splitCount: 5
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'youExcluded', 'pending', 'settled']
    },
    category: {
      control: 'select',
      options: ['fork', 'wine', 'bed', 'tram', 'plane', 'receipt']
    }
  },
  render: a => <>
    <ListGroup><ExpenseRow {...a} payer={P.ari} excluded={[P.ren, P.nic]} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <ExpenseRow title="Dinner, Taberna da Rua das Flores" payer={P.ari} amount={248.7} share={37.7} date="Fri" category="fork" />
      <ExpenseRow title="Vinho Verde (bottle) × 2" payer={P.mara} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
      <ExpenseRow title="Ginjinha round" payer={P.joao} amount={14} date="Fri" category="wine" state="youExcluded" excluded={[P.ari]} />
      <ExpenseRow title="Alfama flat, 3 nights" payer={P.sofia} amount={612} share={102} date="Oct 2" category="bed" />
      <ExpenseRow title="Uber from LIS" payer={P.nic} amount={22.4} date="Just now" category="tram" state="pending" />
      <ExpenseRow title="Tram 28 day passes" payer={P.ren} amount={38.4} share={6.4} date="Settled" category="tram" state="settled" />
    </ListGroup>
  </>
}`,...(P=(k=o.parameters)==null?void 0:k.docs)==null?void 0:P.source}}};var D,U,L;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'ReceiptSplit',
  args: {
    venue: 'Taberna da Rua das Flores',
    tip: 0
  },
  render: a => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />
}`,...(L=(U=i.parameters)==null?void 0:U.docs)==null?void 0:L.source}}};var T,W,M;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'DebtSimplify',
  args: {
    simplified: false,
    autoplay: true
  },
  render: a => <DebtSimplify {...a} />,
  parameters: {
    docs: {
      description: {
        story: 'Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only.'
      }
    }
  }
}`,...(M=(W=l.parameters)==null?void 0:W.docs)==null?void 0:M.source}}};var I,E,B;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'DebtUntangle (v5.6 Receipt to stacks, default)',
  args: {
    solved: false,
    controls: 'steps',
    startButton: true,
    skin: 'receipt'
  },
  argTypes: {
    controls: {
      control: 'inline-radio',
      options: ['steps', 'full', 'inline', 'none']
    },
    skin: {
      control: 'inline-radio',
      options: ['receipt', 'solver', 'instrument']
    }
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>,
  parameters: {
    docs: {
      description: {
        story: 'The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star.'
      }
    }
  }
}`,...(B=(E=d.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};var O,F,N;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'DebtUntangle, inline controls (Money screen)',
  args: {
    solved: false,
    controls: 'inline',
    startButton: false,
    skin: 'receipt'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(N=(F=c.parameters)==null?void 0:F.docs)==null?void 0:N.source}}};var $,A,G;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'DebtUntangle, solved',
  args: {
    solved: true,
    controls: 'inline',
    skin: 'receipt'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(G=(A=p.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var V,C,q;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'Money v4 logs and rows',
  render: () => <div style={{
    maxWidth: 362,
    display: 'grid',
    gap: 12
  }}>
    <MoneyBalance net={-23.7} caption="2 IOUs: you owe Tomás $42.10. Ren owes you $18.40." />
    <IouLog raw={rawDebts} people={P} />
    <NetLog nets={{
      nic: 42.1,
      joao: 64,
      sofia: 0,
      tomas: 0,
      ren: -18.4,
      ari: -23.7,
      mara: -64
    }} people={P} />
    <PairRows plan={simplifiedDebts} people={P} />
  </div>
}`,...(q=(C=m.parameters)==null?void 0:C.docs)==null?void 0:q.source}}};var Y,J,_;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  name: 'PaymentRow',
  args: {
    amount: 42.1,
    state: 'due',
    method: 'MB WAY'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['due', 'sending', 'paid', 'requested']
    }
  },
  render: a => <>
    <ListGroup><PaymentRow {...a} from={P.nic} to={P.ari} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="due" />
      <PaymentRow from={P.ari} to={P.joao} amount={12.5} state="due" method="Sintra train tickets" />
      <PaymentRow from={P.mara} to={P.joao} amount={64} state="sending" />
      <PaymentRow from={P.ren} to={P.ari} amount={18.4} state="paid" method="Revolut" />
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="requested" />
    </ListGroup>
  </>
}`,...(_=(J=u.parameters)==null?void 0:J.docs)==null?void 0:_.source}}};var z,H,K;g.parameters={...g.parameters,docs:{...(z=g.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'SettleSheet',
  parameters: {
    screen: 'full'
  },
  args: {
    amount: 42.1,
    method: 'MB WAY',
    state: 'review'
  },
  argTypes: {
    method: {
      control: 'inline-radio',
      options: ['MB WAY', 'Apple Pay', 'Revolut', 'Cash']
    },
    state: {
      control: 'inline-radio',
      options: ['review', 'sent']
    }
  },
  render: a => <div className="scr"><BottomSheet title="Settle up" detent="compact"><SettleContent {...a} from={P.nic} to={P.ari} /></BottomSheet></div>
}`,...(K=(H=g.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var Q,X,Z;h.parameters={...h.parameters,docs:{...(Q=h.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'DebtUntangle, legacy v4 Instrument skin',
  args: {
    solved: false,
    controls: 'full',
    startButton: true,
    skin: 'instrument'
  },
  argTypes: {
    controls: {
      control: 'inline-radio',
      options: ['full', 'inline', 'none']
    },
    skin: {
      control: 'inline-radio',
      options: ['solver', 'instrument'],
      description: 'Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin().'
    }
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>,
  parameters: {
    docs: {
      description: {
        story: 'Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step.'
      }
    }
  }
}`,...(Z=(X=h.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,te,ae;y.parameters={...y.parameters,docs:{...(ee=y.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'Receipt stacks · 0 of 3 paid',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[false, false, false]} /></div>
}`,...(ae=(te=y.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var se,ne,re;f.parameters={...f.parameters,docs:{...(se=f.parameters)==null?void 0:se.docs,source:{originalSource:`{
  name: 'Receipt stacks · 1 of 3 paid',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={simplifiedDebts.map(e => e.from === 'ari')} /></div>
}`,...(re=(ne=f.parameters)==null?void 0:ne.docs)==null?void 0:re.source}}};var oe,ie,le;v.parameters={...v.parameters,docs:{...(oe=v.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'Receipt stacks · all squared',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[true, true, true]} /></div>
}`,...(le=(ie=v.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};const Ee=["Expense","Receipt","Simplify","Untangle","UntangleInline","UntangleSolved","MoneyLogs","Payments","Settle","UntangleLegacyInstrument","StacksOpen","StacksOne","StacksSquared"];export{o as Expense,m as MoneyLogs,u as Payments,i as Receipt,g as Settle,l as Simplify,f as StacksOne,y as StacksOpen,v as StacksSquared,d as Untangle,c as UntangleInline,h as UntangleLegacyInstrument,p as UntangleSolved,Ee as __namedExportsOrder,Ie as default};
