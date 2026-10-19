import{j as e}from"./jsx-runtime-BYYWji4R.js";import{E as s,r as z,s as H,P as a,R as K,S as Q,D as X,a as y}from"./untangle-solver-ADWayfP-.js";import{a as Z,I as ee,N as te,b as ne}from"./settle-CbeUVrWT.js";import{B as se}from"./overlays-B185WV6B.js";import{L as h}from"./core-BR5BZjX6.js";import{p as t,c as ae}from"./data-nxiCAWEG.js";import{w as oe}from"./scenario-DEvdkvjY.js";import{L as _}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-DqDER8CT.js";import"./PrismRoot-DCukcACG.js";import"./solver-assets-BvNkYNQl.js";const ve={title:"Components/Money",tags:["autodocs"],parameters:{docs:{description:{component:"Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up."}}}},o={name:"ExpenseRow",args:{title:"Vinho Verde (bottle) × 2",amount:38,share:7.6,date:"Fri",category:"wine",state:"default",splitCount:5},argTypes:{state:{control:"inline-radio",options:["default","youExcluded","pending","settled"]},category:{control:"select",options:["fork","wine","bed","tram","plane","receipt"]}},render:n=>e.jsxs(e.Fragment,{children:[e.jsx(h,{children:e.jsx(s,{...n,payer:t.ari,excluded:[t.ren,t.nic]})}),e.jsx(_,{children:"States"}),e.jsxs(h,{children:[e.jsx(s,{title:"Dinner, Taberna da Rua das Flores",payer:t.ari,amount:248.7,share:37.7,date:"Fri",category:"fork"}),e.jsx(s,{title:"Vinho Verde (bottle) × 2",payer:t.mara,amount:38,share:7.6,date:"Sat",category:"wine",excluded:[t.ren,t.nic],splitCount:5}),e.jsx(s,{title:"Ginjinha round",payer:t.joao,amount:14,date:"Fri",category:"wine",state:"youExcluded",excluded:[t.ari]}),e.jsx(s,{title:"Alfama flat, 3 nights",payer:t.sofia,amount:612,share:102,date:"Oct 2",category:"bed"}),e.jsx(s,{title:"Uber from LIS",payer:t.nic,amount:22.4,date:"Just now",category:"tram",state:"pending"}),e.jsx(s,{title:"Tram 28 day passes",payer:t.ren,amount:38.4,share:6.4,date:"Settled",category:"tram",state:"settled"})]})]})},r={name:"ReceiptSplit",args:{venue:"Taberna da Rua das Flores",tip:0},render:n=>e.jsx(K,{...n,lines:oe,members:ae})},i={name:"DebtSimplify",args:{simplified:!1,autoplay:!0},render:n=>e.jsx(X,{...n}),parameters:{docs:{description:{story:"Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only."}}}},l={name:"DebtUntangle (v5.1 Solver, default)",args:{solved:!1,controls:"steps",startButton:!0,skin:"solver"},argTypes:{controls:{control:"inline-radio",options:["steps","full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"]}},render:n=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(y,{...n})}),parameters:{docs:{description:{story:"The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star."}}}},d={name:"DebtUntangle, inline controls (Money screen)",args:{solved:!1,controls:"inline",startButton:!1,skin:"solver"},render:n=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(y,{...n})})},c={name:"DebtUntangle, solved",args:{solved:!0,controls:"inline",skin:"solver"},render:n=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(y,{...n})})},m={name:"Money v4 logs and rows",render:()=>e.jsxs("div",{style:{maxWidth:362,display:"grid",gap:12},children:[e.jsx(Z,{net:-23.7,caption:"2 IOUs: you owe Tomás $42.10. Ren owes you $18.40."}),e.jsx(ee,{raw:z,people:t}),e.jsx(te,{nets:{nic:42.1,joao:64,sofia:0,tomas:0,ren:-18.4,ari:-23.7,mara:-64},people:t}),e.jsx(ne,{plan:H,people:t})]})},p={name:"PaymentRow",args:{amount:42.1,state:"due",method:"MB WAY"},argTypes:{state:{control:"inline-radio",options:["due","sending","paid","requested"]}},render:n=>e.jsxs(e.Fragment,{children:[e.jsx(h,{children:e.jsx(a,{...n,from:t.nic,to:t.ari})}),e.jsx(_,{children:"States"}),e.jsxs(h,{children:[e.jsx(a,{from:t.nic,to:t.ari,amount:42.1,state:"due"}),e.jsx(a,{from:t.ari,to:t.joao,amount:12.5,state:"due",method:"Sintra train tickets"}),e.jsx(a,{from:t.mara,to:t.joao,amount:64,state:"sending"}),e.jsx(a,{from:t.ren,to:t.ari,amount:18.4,state:"paid",method:"Revolut"}),e.jsx(a,{from:t.nic,to:t.ari,amount:42.1,state:"requested"})]})]})},u={name:"SettleSheet",parameters:{screen:"full"},args:{amount:42.1,method:"MB WAY",state:"review"},argTypes:{method:{control:"inline-radio",options:["MB WAY","Apple Pay","Revolut","Cash"]},state:{control:"inline-radio",options:["review","sent"]}},render:n=>e.jsx("div",{className:"scr",children:e.jsx(se,{title:"Settle up",detent:"compact",children:e.jsx(Q,{...n,from:t.nic,to:t.ari})})})},g={name:"DebtUntangle, legacy v4 Instrument skin",args:{solved:!1,controls:"full",startButton:!0,skin:"instrument"},argTypes:{controls:{control:"inline-radio",options:["full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"],description:"Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin()."}},render:n=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(y,{...n})}),parameters:{docs:{description:{story:"Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step."}}}};var f,w,v;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(v=(w=o.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var x,b,S;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'ReceiptSplit',
  args: {
    venue: 'Taberna da Rua das Flores',
    tip: 0
  },
  render: a => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />
}`,...(S=(b=r.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var R,j,P;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(P=(j=i.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var k,U,T;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'DebtUntangle (v5.1 Solver, default)',
  args: {
    solved: false,
    controls: 'steps',
    startButton: true,
    skin: 'solver'
  },
  argTypes: {
    controls: {
      control: 'inline-radio',
      options: ['steps', 'full', 'inline', 'none']
    },
    skin: {
      control: 'inline-radio',
      options: ['solver', 'instrument']
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
}`,...(T=(U=l.parameters)==null?void 0:U.docs)==null?void 0:T.source}}};var L,D,I;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'DebtUntangle, inline controls (Money screen)',
  args: {
    solved: false,
    controls: 'inline',
    startButton: false,
    skin: 'solver'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(I=(D=d.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var M,W,E;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'DebtUntangle, solved',
  args: {
    solved: true,
    controls: 'inline',
    skin: 'solver'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(E=(W=c.parameters)==null?void 0:W.docs)==null?void 0:E.source}}};var B,F,N;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(N=(F=m.parameters)==null?void 0:F.docs)==null?void 0:N.source}}};var $,A,G;p.parameters={...p.parameters,docs:{...($=p.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(G=(A=p.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var O,V,C;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(C=(V=u.parameters)==null?void 0:V.docs)==null?void 0:C.source}}};var Y,q,J;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(J=(q=g.parameters)==null?void 0:q.docs)==null?void 0:J.source}}};const xe=["Expense","Receipt","Simplify","Untangle","UntangleInline","UntangleSolved","MoneyLogs","Payments","Settle","UntangleLegacyInstrument"];export{o as Expense,m as MoneyLogs,p as Payments,r as Receipt,u as Settle,i as Simplify,l as Untangle,d as UntangleInline,g as UntangleLegacyInstrument,c as UntangleSolved,xe as __namedExportsOrder,ve as default};
