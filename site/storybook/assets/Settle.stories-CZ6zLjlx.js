import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r}from"./index-ClcD9ViR.js";import{B as n}from"./core-BmZpmJNA.js";import{u as Se,C as he,S as P,P as ge,c as xe,O as ve,M as ke,d as Pe,e as c,D as we,L as je,f as Ne,g as Ce,h as Me,U as fe,R as Re,i as Fe,j as Te,k as $e,l as Ae,G as We}from"./settle-Cq2nEsYp.js";import{p as i}from"./data-nxiCAWEG.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-BrJiqn4m.js";import"./PrismRoot-DCukcACG.js";import"./headermenu-CRo5bDRn.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./solver-assets-BvNkYNQl.js";const _e={title:"Patterns/Settle up (cash)",tags:["autodocs"],parameters:{screen:"full",docs:{description:{component:"The cash path from Figma section 09 (S1 to S7, E1 to E3). Every frame uses the glass nav card, a content column at x 20, y 214, width 362, and a CTA at y 788 (or 724 when two stack). Amounts are stored in cents and shown in US dollars with tabular figures; negatives use U+2212. Balances only move when the receiver confirms."}}}};function a({back:t,title:s,sub:o,children:w,bottom:j,slide:ye,two:be}){return e.jsxs("div",{className:"scr",style:{background:"var(--color-bg-canvas)"},children:[e.jsx("div",{className:`p-sscroll ${be?"has-two":""}`,children:w}),e.jsx(We,{back:t,title:s,subtitle:o}),j&&e.jsx("div",{className:`p-sbottom ${ye?"is-slide":""}`,children:j})]})}const d={name:"S1 Method picker",parameters:{docs:{description:{story:'Five methods in one list card. The CTA label follows the selection. MB WAY and Revolut hand off by deep link with the amount and reference prefilled; on return the app asks "Did it go through?" because those apps do not confirm back.'}}},render:()=>{const[t,s]=r.useState("cash");return e.jsxs(a,{back:"Money",title:"Pay Nic",sub:"Payment 1 of 3 · simplified",bottom:e.jsx(n,{label:Pe.find(o=>o.id===t).cta("$42.10"),fullWidth:!0}),children:[e.jsx(ge,{amount:42.1,caption:"For the Tejo boat tour, routed through Tomás.",pill:e.jsx(xe,{tone:"accent",children:"1 OF 3"}),link:"Why $42.10"}),e.jsx(ve,{children:"HOW YOU'LL PAY"}),e.jsx(ke,{value:t,onChange:s})]})}},l={name:"S2 Cash count, round and carry",parameters:{docs:{description:{story:"Cash rounds to the nearest $1.00, so the change is never more than $0.50 either way. $42.10 becomes $42.00 and the $0.10 is carried on the same pair into the next split. Bills come from a greedy split over US denominations. Toggle off to hand over the exact amount, coins included."}}},render:()=>{const[t,s]=r.useState(!0),[o,w]=r.useState(!1);return e.jsx(a,{back:"Pay Nic",title:"Cash for Nic",sub:"Count it out, then slide",slide:!0,bottom:e.jsx(P,{amount:t?42:42.1,onHold:w}),children:e.jsx("div",{style:{display:"contents",opacity:o?.55:1},children:e.jsx(he,{due:42.1,round:t,onRound:s})})})}},m={name:"SlideToSettle",args:{amount:42,initial:0,forceButton:!1},argTypes:{initial:{control:{type:"range",min:0,max:1,step:.01}}},parameters:{screen:"component",docs:{description:{story:'Track 362 × 64. Haptic ticks at 25, 50 and 75 percent; past 50 percent "Release to confirm" shows; past 92 percent the knob turns into a check. Release early and it springs back. Keyboard: press Enter twice. With Reduce Motion (or forceButton) it becomes a 600 ms press-and-hold button with a circular fill.'}}},render:t=>e.jsx("div",{style:{width:362},children:r.createElement(P,{...t,key:`${t.initial}-${t.forceButton}`})})},u={name:"SlideToSettle, Reduce Motion",args:{amount:42},parameters:{screen:"component"},render:t=>e.jsx("div",{style:{width:362},children:e.jsx(je,{...t})})},p={name:"S3 Slider held at 78%",render:()=>e.jsx(a,{back:"Pay Nic",title:"Cash for Nic",sub:"Count it out, then slide",slide:!0,bottom:e.jsx(P,{amount:42,initial:.78}),children:e.jsx("div",{style:{display:"contents"},children:e.jsx(he,{due:42.1})})})},h={name:"S4 Pending with undo",parameters:{docs:{description:{story:"The mark is pending until Nic confirms; your balance does not move yet. Undo stays open for 5 s with a countdown ring (a plain number under Reduce Motion). After that, cancel lives in the receipt until Nic confirms."}}},render:()=>{const[t,s]=r.useState(0);return e.jsxs(a,{back:"Money",title:"Cash for Nic",sub:"Waiting for Nic",bottom:e.jsx(n,{label:"Back to balances",variant:"plain",fullWidth:!0}),children:[e.jsx(Me,{s:c()}),e.jsx(fe,{amount:42,onUndo:()=>s(t+1),onExpire:()=>setTimeout(()=>s(o=>o+1),1200)},t)]})}},f={name:"UndoToast",args:{amount:42,seconds:5},parameters:{screen:"component"},render:t=>e.jsx("div",{style:{position:"relative",width:402,height:120},children:e.jsx(fe,{...t})})},y={name:"S5 Receiver confirm (Nic)",parameters:{docs:{description:{story:"Nic's phone. Yes confirms the cash and both balances update. Not yet opens a sheet with the amount he counted and a note, which becomes the dispute on Ari's phone."}}},render:()=>e.jsx(a,{back:"Lisbon Crew",title:"Did Ari pay you?",sub:"Nic's phone · cash · 10:39 PM",two:!0,bottom:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"Yes, I got $42.00",fullWidth:!0}),e.jsx(n,{label:"Not yet",variant:"secondary",fullWidth:!0})]}),children:e.jsx(Fe,{s:c()})})},b={name:"S6 Payment success, 1 of 3",parameters:{docs:{description:{story:"On arrival the check disc springs from 0.8 to 1, a success haptic fires and the first progress segment fills in 400 ms. Reduce Motion: a 200 ms fade, no scale."}}},render:()=>e.jsxs(a,{back:"Lisbon Crew",title:"Money",sub:"Whole trip · 7 people",bottom:e.jsx(n,{label:"Ask Ren for $18.40",fullWidth:!0}),children:[e.jsxs("section",{className:"p-mbal is-compact",children:[e.jsx("p",{className:"p-overline-s",children:"YOUR BALANCE"}),e.jsx("p",{className:"p-mbal-amt tu-num is-owed",children:"+$18.30"}),e.jsx("p",{className:"p-mbal-cap",children:"Ren pays you $18.40. $0.10 carried to your next split."})]}),e.jsx(Te,{title:"Nic confirmed $42.00",meta:"cash · 10:40:12 PM · stl_7Q2K-0042"}),e.jsx($e,{done:1,total:3,paid:42,sum:124.5}),e.jsx(Ae,{rows:[{from:i.ari,to:i.nic,amount:42.1,reason:"Cash · confirmed 10:40 PM",state:"paid",paidLabel:"$42.00 ✓",perspective:"out"},{from:i.ren,to:i.ari,amount:18.4,reason:"Dinner minus Fado tickets",state:"due",perspective:"in"},{from:i.mara,to:i.joao,amount:64,reason:"Flat deposit, via Sofia",state:"due",perspective:"other"}]})]})},S={name:"S7 Receipt and provenance",render:()=>e.jsx(a,{back:"Money",title:"Receipt",sub:"You → Nic · cash",bottom:e.jsx(n,{label:"Share receipt",icon:"share",variant:"surface",fullWidth:!0}),children:e.jsx(Re,{s:c({status:"confirmed",confirmedAt:"10:40:12 PM"})})})},g={name:"E1 Partial cash",parameters:{docs:{description:{story:"Rounding is off for partial payments. The rest stays open on the plan and keeps the original reference with the suffix -b."}}},render:()=>{const[t,s]=r.useState(20);return e.jsx(a,{back:"Pay Nic",title:"Cash for Nic",sub:"Paying part now",slide:!0,bottom:e.jsx(P,{amount:t},t),children:e.jsx(Ce,{due:42.1,amount:t,onAmount:s})})}},x={name:"E2 Dispute",parameters:{docs:{description:{story:"Balances stay as they were until both phones agree. Pick a fix and send it to Nic."}}},render:()=>{const[t,s]=r.useState("coin"),o=c({status:"disputed",dispute:{counted:40,note:"Got two twenties, nothing else.",at:"10:41 PM"}});return e.jsx(a,{back:"Money",title:"Pay Nic",sub:"Cash · needs a look",bottom:e.jsx(n,{label:t==="cancel"?"Cancel the cash mark":"Send to Nic",fullWidth:!0}),children:e.jsx(we,{s:o,fix:t,onFix:s})})}},v={name:"E3 Offline",parameters:{docs:{description:{story:"The mark is saved on the phone with a client id, so a retry cannot post it twice. It goes to Nic on reconnect."}}},render:()=>e.jsx(a,{back:"Money",title:"Pay Nic",sub:"Cash · offline",bottom:e.jsx(n,{label:"Cancel the cash mark",variant:"plain",fullWidth:!0}),children:e.jsx(Ne,{s:c({status:"queued"})})})},k={name:"Formatting",parameters:{screen:"component"},render:()=>e.jsx("p",{className:"tu-num",style:{font:"var(--type-mono-readout)"},children:[42.1,-23.7,.1,1234.5].map(Se).join(" · ")})};var N,C,M;d.parameters={...d.parameters,docs:{...(N=d.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'S1 Method picker',
  parameters: {
    docs: {
      description: {
        story: 'Five methods in one list card. The CTA label follows the selection. MB WAY and Revolut hand off by deep link with the amount and reference prefilled; on return the app asks "Did it go through?" because those apps do not confirm back.'
      }
    }
  },
  render: () => {
    const [m, setM] = useState<SettleMethod>('cash');
    return <Frame back="Money" title="Pay Nic" sub="Payment 1 of 3 · simplified" bottom={<Button label={METHODS.find(x => x.id === m)!.cta('$42.10')} fullWidth />}>
      <PairHero amount={42.1} caption="For the Tejo boat tour, routed through Tomás." pill={<SPill tone="accent">1 OF 3</SPill>} link="Why $42.10" />
      <Overline>HOW YOU'LL PAY</Overline>
      <MethodPicker value={m} onChange={setM} />
    </Frame>;
  }
}`,...(M=(C=d.parameters)==null?void 0:C.docs)==null?void 0:M.source}}};var R,F,T;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'S2 Cash count, round and carry',
  parameters: {
    docs: {
      description: {
        story: 'Cash rounds to the nearest $1.00, so the change is never more than $0.50 either way. $42.10 becomes $42.00 and the $0.10 is carried on the same pair into the next split. Bills come from a greedy split over US denominations. Toggle off to hand over the exact amount, coins included.'
      }
    }
  },
  render: () => {
    const [round, setRound] = useState(true);
    const [held, setHeld] = useState(false);
    return <Frame back="Pay Nic" title="Cash for Nic" sub="Count it out, then slide" slide bottom={<SlideToSettle amount={round ? 42 : 42.1} onHold={setHeld} />}>
      <div style={{
        display: 'contents',
        opacity: held ? 0.55 : 1
      }}><CashCount due={42.1} round={round} onRound={setRound} /></div>
    </Frame>;
  }
}`,...(T=(F=l.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};var $,A,W;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'SlideToSettle',
  args: {
    amount: 42,
    initial: 0,
    forceButton: false
  },
  argTypes: {
    initial: {
      control: {
        type: 'range',
        min: 0,
        max: 1,
        step: 0.01
      }
    }
  },
  parameters: {
    screen: 'component',
    docs: {
      description: {
        story: 'Track 362 × 64. Haptic ticks at 25, 50 and 75 percent; past 50 percent "Release to confirm" shows; past 92 percent the knob turns into a check. Release early and it springs back. Keyboard: press Enter twice. With Reduce Motion (or forceButton) it becomes a 600 ms press-and-hold button with a circular fill.'
      }
    }
  },
  render: a => <div style={{
    width: 362
  }}><SlideToSettle {...a} key={\`\${a.initial}-\${a.forceButton}\`} /></div>
}`,...(W=(A=m.parameters)==null?void 0:A.docs)==null?void 0:W.source}}};var B,O,E;u.parameters={...u.parameters,docs:{...(B=u.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'SlideToSettle, Reduce Motion',
  args: {
    amount: 42
  },
  parameters: {
    screen: 'component'
  },
  render: a => <div style={{
    width: 362
  }}><LongPressSettle {...a} /></div>
}`,...(E=(O=u.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var U,L,D;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'S3 Slider held at 78%',
  render: () => <Frame back="Pay Nic" title="Cash for Nic" sub="Count it out, then slide" slide bottom={<SlideToSettle amount={42} initial={0.78} />}>
      <div style={{
      display: 'contents'
    }}><CashCount due={42.1} /></div>
    </Frame>
}`,...(D=(L=p.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};var H,Y,K;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'S4 Pending with undo',
  parameters: {
    docs: {
      description: {
        story: 'The mark is pending until Nic confirms; your balance does not move yet. Undo stays open for 5 s with a countdown ring (a plain number under Reduce Motion). After that, cancel lives in the receipt until Nic confirms.'
      }
    }
  },
  render: () => {
    const [k, setK] = useState(0);
    return <Frame back="Money" title="Cash for Nic" sub="Waiting for Nic" bottom={<Button label="Back to balances" variant="plain" fullWidth />}>
      <PendingMark s={demoSettlement()} />
      <UndoToast key={k} amount={42} onUndo={() => setK(k + 1)} onExpire={() => setTimeout(() => setK(x => x + 1), 1200)} />
    </Frame>;
  }
}`,...(K=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:K.source}}};var V,G,I;f.parameters={...f.parameters,docs:{...(V=f.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'UndoToast',
  args: {
    amount: 42,
    seconds: 5
  },
  parameters: {
    screen: 'component'
  },
  render: a => <div style={{
    position: 'relative',
    width: 402,
    height: 120
  }}><UndoToast {...a} /></div>
}`,...(I=(G=f.parameters)==null?void 0:G.docs)==null?void 0:I.source}}};var _,q,Q;y.parameters={...y.parameters,docs:{...(_=y.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'S5 Receiver confirm (Nic)',
  parameters: {
    docs: {
      description: {
        story: "Nic's phone. Yes confirms the cash and both balances update. Not yet opens a sheet with the amount he counted and a note, which becomes the dispute on Ari's phone."
      }
    }
  },
  render: () => <Frame back="Lisbon Crew" title="Did Ari pay you?" sub="Nic's phone · cash · 10:39 PM" two bottom={<><Button label="Yes, I got $42.00" fullWidth /><Button label="Not yet" variant="secondary" fullWidth /></>}>
      <ReceiverConfirm s={demoSettlement()} />
    </Frame>
}`,...(Q=(q=y.parameters)==null?void 0:q.docs)==null?void 0:Q.source}}};var z,J,X;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'S6 Payment success, 1 of 3',
  parameters: {
    docs: {
      description: {
        story: 'On arrival the check disc springs from 0.8 to 1, a success haptic fires and the first progress segment fills in 400 ms. Reduce Motion: a 200 ms fade, no scale.'
      }
    }
  },
  render: () => <Frame back="Lisbon Crew" title="Money" sub="Whole trip · 7 people" bottom={<Button label="Ask Ren for $18.40" fullWidth />}>
      <section className="p-mbal is-compact"><p className="p-overline-s">YOUR BALANCE</p><p className="p-mbal-amt tu-num is-owed">+$18.30</p><p className="p-mbal-cap">Ren pays you $18.40. $0.10 carried to your next split.</p></section>
      <PaymentSuccess title="Nic confirmed $42.00" meta="cash · 10:40:12 PM · stl_7Q2K-0042" />
      <SettleProgress done={1} total={3} paid={42} sum={124.5} />
      <PlanRows rows={[{
      from: P.ari,
      to: P.nic,
      amount: 42.1,
      reason: 'Cash · confirmed 10:40 PM',
      state: 'paid',
      paidLabel: '$42.00 ✓',
      perspective: 'out'
    }, {
      from: P.ren,
      to: P.ari,
      amount: 18.4,
      reason: 'Dinner minus Fado tickets',
      state: 'due',
      perspective: 'in'
    }, {
      from: P.mara,
      to: P.joao,
      amount: 64,
      reason: 'Flat deposit, via Sofia',
      state: 'due',
      perspective: 'other'
    }]} />
    </Frame>
}`,...(X=(J=b.parameters)==null?void 0:J.docs)==null?void 0:X.source}}};var Z,ee,te;S.parameters={...S.parameters,docs:{...(Z=S.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'S7 Receipt and provenance',
  render: () => <Frame back="Money" title="Receipt" sub="You → Nic · cash" bottom={<Button label="Share receipt" icon="share" variant="surface" fullWidth />}>
      <ReceiptView s={demoSettlement({
      status: 'confirmed',
      confirmedAt: '10:40:12 PM'
    })} />
    </Frame>
}`,...(te=(ee=S.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var se,ae,oe;g.parameters={...g.parameters,docs:{...(se=g.parameters)==null?void 0:se.docs,source:{originalSource:`{
  name: 'E1 Partial cash',
  parameters: {
    docs: {
      description: {
        story: 'Rounding is off for partial payments. The rest stays open on the plan and keeps the original reference with the suffix -b.'
      }
    }
  },
  render: () => {
    const [amt, setAmt] = useState(20);
    return <Frame back="Pay Nic" title="Cash for Nic" sub="Paying part now" slide bottom={<SlideToSettle key={amt} amount={amt} />}>
      <PartialCash due={42.1} amount={amt} onAmount={setAmt} />
    </Frame>;
  }
}`,...(oe=(ae=g.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var ne,re,ie;x.parameters={...x.parameters,docs:{...(ne=x.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  name: 'E2 Dispute',
  parameters: {
    docs: {
      description: {
        story: 'Balances stay as they were until both phones agree. Pick a fix and send it to Nic.'
      }
    }
  },
  render: () => {
    const [fix, setFix] = useState<DisputeFix>('coin');
    const s = demoSettlement({
      status: 'disputed',
      dispute: {
        counted: 40,
        note: 'Got two twenties, nothing else.',
        at: '10:41 PM'
      }
    });
    return <Frame back="Money" title="Pay Nic" sub="Cash · needs a look" bottom={<Button label={fix === 'cancel' ? 'Cancel the cash mark' : 'Send to Nic'} fullWidth />}>
      <DisputeView s={s} fix={fix} onFix={setFix} />
    </Frame>;
  }
}`,...(ie=(re=x.parameters)==null?void 0:re.docs)==null?void 0:ie.source}}};var ce,de,le;v.parameters={...v.parameters,docs:{...(ce=v.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  name: 'E3 Offline',
  parameters: {
    docs: {
      description: {
        story: 'The mark is saved on the phone with a client id, so a retry cannot post it twice. It goes to Nic on reconnect.'
      }
    }
  },
  render: () => <Frame back="Money" title="Pay Nic" sub="Cash · offline" bottom={<Button label="Cancel the cash mark" variant="plain" fullWidth />}>
      <OfflineView s={demoSettlement({
      status: 'queued'
    })} />
    </Frame>
}`,...(le=(de=v.parameters)==null?void 0:de.docs)==null?void 0:le.source}}};var me,ue,pe;k.parameters={...k.parameters,docs:{...(me=k.parameters)==null?void 0:me.docs,source:{originalSource:`{
  name: 'Formatting',
  parameters: {
    screen: 'component'
  },
  render: () => <p className="tu-num" style={{
    font: 'var(--type-mono-readout)'
  }}>{[42.1, -23.7, 0.1, 1234.5].map(usd2).join(' · ')}</p>
}`,...(pe=(ue=k.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};const qe=["ChooseMethod","CashCountRound","Slide","LongPress","SlideHeld","Pending","Undo","ReceiverConfirmStory","Success","Receipt","Partial","Dispute","Offline","Amounts"];export{k as Amounts,l as CashCountRound,d as ChooseMethod,x as Dispute,u as LongPress,v as Offline,g as Partial,h as Pending,S as Receipt,y as ReceiverConfirmStory,m as Slide,p as SlideHeld,b as Success,f as Undo,qe as __namedExportsOrder,_e as default};
