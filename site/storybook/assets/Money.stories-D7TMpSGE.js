import{j as e}from"./jsx-runtime-BYYWji4R.js";import{E as r,P as s,R as M,S as C,D as O,a as A}from"./untangle-B9Rntwn6.js";import{B as I}from"./overlays-Di7yYi-Y.js";import{L as c}from"./core-BrVJte4Z.js";import{a as t,c as k}from"./data-DZbUm-sK.js";import{w as Y}from"./scenario-Bxu_Cc4P.js";import{L as G}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./PrismRoot-DCukcACG.js";const Z={title:"Components/Money",tags:["autodocs"],parameters:{docs:{description:{component:"Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up."}}}},o={name:"ExpenseRow",args:{title:"Douro tinto, 2 bottles",amount:38,share:7.6,date:"Fri",category:"wine",state:"default",splitCount:5},argTypes:{state:{control:"inline-radio",options:["default","youExcluded","pending","settled"]},category:{control:"select",options:["fork","wine","bed","tram","plane","receipt"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(c,{children:e.jsx(r,{...a,payer:t.ari,excluded:[t.ren,t.nic]})}),e.jsx(G,{children:"States"}),e.jsxs(c,{children:[e.jsx(r,{title:"Dinner, Taberna da Rua das Flores",payer:t.ari,amount:248.7,share:37.7,date:"Fri",category:"fork"}),e.jsx(r,{title:"Douro tinto, 2 bottles",payer:t.mara,amount:38,share:7.6,date:"Sat",category:"wine",excluded:[t.ren,t.nic],splitCount:5}),e.jsx(r,{title:"Ginjinha round",payer:t.joao,amount:14,date:"Fri",category:"wine",state:"youExcluded",excluded:[t.ari]}),e.jsx(r,{title:"Alfama flat, 3 nights",payer:t.sofia,amount:612,share:102,date:"Oct 2",category:"bed"}),e.jsx(r,{title:"Uber from LIS",payer:t.nic,amount:22.4,date:"Just now",category:"tram",state:"pending"}),e.jsx(r,{title:"Tram 28 day passes",payer:t.ren,amount:38.4,share:6.4,date:"Settled",category:"tram",state:"settled"})]})]})},n={name:"ReceiptSplit",args:{venue:"Taberna da Rua das Flores",tip:0},render:a=>e.jsx(M,{...a,lines:Y,members:k})},i={name:"DebtSimplify",args:{simplified:!1,autoplay:!0},render:a=>e.jsx(O,{...a}),parameters:{docs:{description:{story:"Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only."}}}},d={name:"DebtUntangle",args:{solved:!1,compact:!1,startButton:!0},render:a=>e.jsx("div",{style:{maxWidth:402},children:e.jsx(A,{...a})}),parameters:{docs:{description:{story:"The settle-up solve, shown as a graph. Six IOUs between seven people start as crossing threads. Step 1 nets each balance, step 2 matches debtors to creditors and the people who net to zero drop out, step 3 redraws the money as three payments: €190.60 of IOUs becomes €124.50 of payments, and every net balance is unchanged. Untangle plays it in 3.6 s, Replay runs it again, and the scrubber moves through it by hand. With Reduce Motion, Untangle jumps to the result and the scrubber steps through the three stages."}}}},m={name:"DebtUntangle, solved",args:{solved:!0,compact:!0},render:a=>e.jsx("div",{style:{maxWidth:402},children:e.jsx(A,{...a})})},p={name:"PaymentRow",args:{amount:42.1,state:"due",method:"MB WAY"},argTypes:{state:{control:"inline-radio",options:["due","sending","paid","requested"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(c,{children:e.jsx(s,{...a,from:t.nic,to:t.ari})}),e.jsx(G,{children:"States"}),e.jsxs(c,{children:[e.jsx(s,{from:t.nic,to:t.ari,amount:42.1,state:"due"}),e.jsx(s,{from:t.ari,to:t.joao,amount:12.5,state:"due",method:"Sintra train tickets"}),e.jsx(s,{from:t.mara,to:t.joao,amount:64,state:"sending"}),e.jsx(s,{from:t.ren,to:t.ari,amount:18.4,state:"paid",method:"Revolut"}),e.jsx(s,{from:t.nic,to:t.ari,amount:42.1,state:"requested"})]})]})},l={name:"SettleSheet",parameters:{screen:"full"},args:{amount:42.1,method:"MB WAY",state:"review"},argTypes:{method:{control:"inline-radio",options:["MB WAY","Apple Pay","Revolut","Cash"]},state:{control:"inline-radio",options:["review","sent"]}},render:a=>e.jsx("div",{className:"scr",children:e.jsx(I,{title:"Settle up",detent:"compact",children:e.jsx(C,{...a,from:t.nic,to:t.ari})})})};var u,h,y;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'ExpenseRow',
  args: {
    title: 'Douro tinto, 2 bottles',
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
      <ExpenseRow title="Douro tinto, 2 bottles" payer={P.mara} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
      <ExpenseRow title="Ginjinha round" payer={P.joao} amount={14} date="Fri" category="wine" state="youExcluded" excluded={[P.ari]} />
      <ExpenseRow title="Alfama flat, 3 nights" payer={P.sofia} amount={612} share={102} date="Oct 2" category="bed" />
      <ExpenseRow title="Uber from LIS" payer={P.nic} amount={22.4} date="Just now" category="tram" state="pending" />
      <ExpenseRow title="Tram 28 day passes" payer={P.ren} amount={38.4} share={6.4} date="Settled" category="tram" state="settled" />
    </ListGroup>
  </>
}`,...(y=(h=o.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};var g,x,f;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'ReceiptSplit',
  args: {
    venue: 'Taberna da Rua das Flores',
    tip: 0
  },
  render: a => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var b,w,S;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(S=(w=i.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var R,j,P;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'DebtUntangle',
  args: {
    solved: false,
    compact: false,
    startButton: true
  },
  render: a => <div style={{
    maxWidth: 402
  }}><DebtUntangle {...a} /></div>,
  parameters: {
    docs: {
      description: {
        story: 'The settle-up solve, shown as a graph. Six IOUs between seven people start as crossing threads. Step 1 nets each balance, step 2 matches debtors to creditors and the people who net to zero drop out, step 3 redraws the money as three payments: €190.60 of IOUs becomes €124.50 of payments, and every net balance is unchanged. Untangle plays it in 3.6 s, Replay runs it again, and the scrubber moves through it by hand. With Reduce Motion, Untangle jumps to the result and the scrubber steps through the three stages.'
      }
    }
  }
}`,...(P=(j=d.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var v,U,E;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'DebtUntangle, solved',
  args: {
    solved: true,
    compact: true
  },
  render: a => <div style={{
    maxWidth: 402
  }}><DebtUntangle {...a} /></div>
}`,...(E=(U=m.parameters)==null?void 0:U.docs)==null?void 0:E.source}}};var D,L,W;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(W=(L=p.parameters)==null?void 0:L.docs)==null?void 0:W.source}}};var T,B,F;l.parameters={...l.parameters,docs:{...(T=l.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(F=(B=l.parameters)==null?void 0:B.docs)==null?void 0:F.source}}};const $=["Expense","Receipt","Simplify","Untangle","UntangleSolved","Payments","Settle"];export{o as Expense,p as Payments,n as Receipt,l as Settle,i as Simplify,d as Untangle,m as UntangleSolved,$ as __namedExportsOrder,Z as default};
