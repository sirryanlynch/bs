import{j as e}from"./jsx-runtime-BYYWji4R.js";import{R as Ge}from"./index-ClcD9ViR.js";import{E as d,D as g,r as N,s as y,P as p,R as Ye,S as _e,a as Je,b as I}from"./untangle-receipt-tiBlyU4e.js";import{B as E,a as ze,L as W}from"./core-BR5BZjX6.js";import{B as Be}from"./overlays-B185WV6B.js";import{k as He,I as Ke,N as Qe,l as Xe}from"./settle-BtIO9AcC.js";import{p as a,c as Ee}from"./data-nxiCAWEG.js";import{w as Ze}from"./scenario-DEvdkvjY.js";import{L as Oe}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./solver-assets-BvNkYNQl.js";import"./Icon-DqDER8CT.js";import"./PrismRoot-DCukcACG.js";const c=t=>`$${t.toFixed(2)}`,et={open:"",pending:"Pending",sent:"Sent",paid:"Paid"};function O({a:t,onAct:o,onNudge:s}){var r,n;const l=t.kind==="pay"?`Pay ${t.who.name}`:t.kind==="request"?`Request from ${t.who.name}`:`${t.who.name} → ${(r=t.to)==null?void 0:r.name}`,i=t.kind==="pay"?"You owe":t.kind==="request"?"Owes you":"Not you",u=t.status==="open"?t.kind==="pay"?"Pay":t.kind==="request"?"Request":t.nudged?"":"Nudge":"";return e.jsxs("li",{className:`p-sa-row is-${t.kind} is-${t.status}`,"data-key":t.key,children:[e.jsx(ze,{person:t.who,size:36,ring:"none"}),e.jsxs("span",{className:"p-sa-t",children:[e.jsx("b",{children:l}),e.jsxs("small",{children:[e.jsx("span",{className:"tu-num",children:c(t.amt)})," · ",i]})]}),u?e.jsx("button",{type:"button",className:`p-sa-btn pt-myrow-btn ${t.kind==="pay"?"is-pay":t.kind==="other"?"is-quiet":""}`,"aria-label":`${u} ${t.kind==="other"?`${t.who.name}, ${c(t.amt)} to ${(n=t.to)==null?void 0:n.name}`:`${t.who.name} ${c(t.amt)}`}`,onClick:()=>t.kind==="other"?s==null?void 0:s(t):o==null?void 0:o(t),children:u}):e.jsxs("span",{className:`p-sa-st is-${t.status}`,role:"status",children:[t.status==="paid"&&e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,children:e.jsx("path",{d:"M2.5 7.5l3 3 6-6.5",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),t.status==="open"?"Nudged":et[t.status]]})]})}function B({mine:t,others:o=[],onAct:s,onNudge:l,title:i="Your actions"}){const u=t.filter(r=>r.status==="open"||r.status==="sent"||r.status==="pending").length;return e.jsxs("section",{className:"p-sa","aria-label":"Settle actions",children:[e.jsxs("p",{className:"p-sa-h",children:[e.jsx("span",{children:i}),e.jsx("span",{className:"tu-num",children:t.length?u?`${t.length-u} of ${t.length} done`:"All done":"Nothing for you"})]}),t.length>0&&e.jsx("ul",{className:"p-sa-list",children:t.map(r=>e.jsx(O,{a:r,onAct:s},r.key))}),o.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"p-sa-h is-sub",children:e.jsx("span",{children:"Between others"})}),e.jsx("ul",{className:"p-sa-list is-others",children:o.map(r=>e.jsx(O,{a:r,onNudge:l},r.key))})]})]})}function Fe({actions:t,onApprove:o,onClose:s}){const l=t.filter(n=>n.kind==="pay"),i=t.filter(n=>n.kind==="request"),u=l.reduce((n,M)=>n+M.amt,0),r=i.reduce((n,M)=>n+M.amt,0);return e.jsx(Be,{title:"Settle all",detent:"medium",onClose:s,children:e.jsxs("div",{className:"p-sa-sheet",children:[e.jsxs("div",{className:"p-sa-tot",children:[e.jsxs("div",{children:[e.jsx("small",{children:"You pay"}),e.jsx("b",{className:"tu-num",children:c(u)}),e.jsxs("span",{children:[l.length," ",l.length===1?"person":"people"]})]}),e.jsxs("div",{children:[e.jsx("small",{children:"You request"}),e.jsx("b",{className:"tu-num is-in",children:c(r)}),e.jsxs("span",{children:[i.length," ",i.length===1?"person":"people"]})]})]}),e.jsx("ul",{className:"p-sa-mini",children:t.map(n=>e.jsxs("li",{children:[e.jsx("span",{children:n.kind==="pay"?`Pay ${n.who.name}`:`Request from ${n.who.name}`}),e.jsx("span",{className:"tu-num",children:c(n.amt)})]},n.key))}),e.jsx("p",{className:"p-sa-note",children:"Payments go with TripUp Pay. Requests send a notification."}),e.jsx(E,{label:`Approve all (${t.length})`,fullWidth:!0,onClick:o}),e.jsx(E,{label:"Not now",variant:"plain",fullWidth:!0,onClick:s})]})})}B.__docgenInfo={description:"",methods:[],displayName:"SettleActions",props:{mine:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean }",signature:{properties:[{key:"key",value:{name:"string",required:!0}},{key:"kind",value:{name:"union",raw:"'pay' | 'request' | 'other'",elements:[{name:"literal",value:"'pay'"},{name:"literal",value:"'request'"},{name:"literal",value:"'other'"}],required:!0}},{key:"who",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"to",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"amt",value:{name:"number",required:!0}},{key:"status",value:{name:"union",raw:"'open' | 'pending' | 'sent' | 'paid'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'sent'"},{name:"literal",value:"'paid'"}],required:!0}},{key:"nudged",value:{name:"boolean",required:!1}}]}}],raw:"SettleAction[]"},description:""},others:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean }",signature:{properties:[{key:"key",value:{name:"string",required:!0}},{key:"kind",value:{name:"union",raw:"'pay' | 'request' | 'other'",elements:[{name:"literal",value:"'pay'"},{name:"literal",value:"'request'"},{name:"literal",value:"'other'"}],required:!0}},{key:"who",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"to",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"amt",value:{name:"number",required:!0}},{key:"status",value:{name:"union",raw:"'open' | 'pending' | 'sent' | 'paid'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'sent'"},{name:"literal",value:"'paid'"}],required:!0}},{key:"nudged",value:{name:"boolean",required:!1}}]}}],raw:"SettleAction[]"},description:"",defaultValue:{value:"[]",computed:!1}},onAct:{required:!1,tsType:{name:"signature",type:"function",raw:"(a: SettleAction) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean }",signature:{properties:[{key:"key",value:{name:"string",required:!0}},{key:"kind",value:{name:"union",raw:"'pay' | 'request' | 'other'",elements:[{name:"literal",value:"'pay'"},{name:"literal",value:"'request'"},{name:"literal",value:"'other'"}],required:!0}},{key:"who",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"to",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"amt",value:{name:"number",required:!0}},{key:"status",value:{name:"union",raw:"'open' | 'pending' | 'sent' | 'paid'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'sent'"},{name:"literal",value:"'paid'"}],required:!0}},{key:"nudged",value:{name:"boolean",required:!1}}]}},name:"a"}],return:{name:"void"}}},description:""},onNudge:{required:!1,tsType:{name:"signature",type:"function",raw:"(a: SettleAction) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean }",signature:{properties:[{key:"key",value:{name:"string",required:!0}},{key:"kind",value:{name:"union",raw:"'pay' | 'request' | 'other'",elements:[{name:"literal",value:"'pay'"},{name:"literal",value:"'request'"},{name:"literal",value:"'other'"}],required:!0}},{key:"who",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"to",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"amt",value:{name:"number",required:!0}},{key:"status",value:{name:"union",raw:"'open' | 'pending' | 'sent' | 'paid'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'sent'"},{name:"literal",value:"'paid'"}],required:!0}},{key:"nudged",value:{name:"boolean",required:!1}}]}},name:"a"}],return:{name:"void"}}},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Your actions'",computed:!1}}}};Fe.__docgenInfo={description:"Batch approve: one sheet with the totals out and in, then Approve all.",methods:[],displayName:"SettleAllSheet",props:{actions:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean }",signature:{properties:[{key:"key",value:{name:"string",required:!0}},{key:"kind",value:{name:"union",raw:"'pay' | 'request' | 'other'",elements:[{name:"literal",value:"'pay'"},{name:"literal",value:"'request'"},{name:"literal",value:"'other'"}],required:!0}},{key:"who",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"to",value:{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]},required:!1}},{key:"amt",value:{name:"number",required:!0}},{key:"status",value:{name:"union",raw:"'open' | 'pending' | 'sent' | 'paid'",elements:[{name:"literal",value:"'open'"},{name:"literal",value:"'pending'"},{name:"literal",value:"'sent'"},{name:"literal",value:"'paid'"}],required:!0}},{key:"nudged",value:{name:"boolean",required:!1}}]}}],raw:"SettleAction[]"},description:""},onApprove:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const ht={title:"Components/Money",tags:["autodocs"],parameters:{docs:{description:{component:"Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up."}}}},h={name:"ExpenseRow",args:{title:"Vinho Verde (bottle) × 2",amount:38,share:7.6,date:"Fri",category:"wine",state:"default",splitCount:5},argTypes:{state:{control:"inline-radio",options:["default","youExcluded","pending","settled"]},category:{control:"select",options:["fork","wine","bed","tram","plane","receipt"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(W,{children:e.jsx(d,{...t,payer:a.ari,excluded:[a.ren,a.nic]})}),e.jsx(Oe,{children:"States"}),e.jsxs(W,{children:[e.jsx(d,{title:"Dinner, Taberna da Rua das Flores",payer:a.ari,amount:248.7,share:37.7,date:"Fri",category:"fork"}),e.jsx(d,{title:"Vinho Verde (bottle) × 2",payer:a.mara,amount:38,share:7.6,date:"Sat",category:"wine",excluded:[a.ren,a.nic],splitCount:5}),e.jsx(d,{title:"Ginjinha round",payer:a.joao,amount:14,date:"Fri",category:"wine",state:"youExcluded",excluded:[a.ari]}),e.jsx(d,{title:"Alfama flat, 3 nights",payer:a.sofia,amount:612,share:102,date:"Oct 2",category:"bed"}),e.jsx(d,{title:"Uber from LIS",payer:a.nic,amount:22.4,date:"Just now",category:"tram",state:"pending"}),e.jsx(d,{title:"Tram 28 day passes",payer:a.ren,amount:38.4,share:6.4,date:"Settled",category:"tram",state:"settled"})]})]})},v={name:"ReceiptSplit",args:{venue:"Taberna da Rua das Flores",tip:0},render:t=>e.jsx(Ye,{...t,lines:Ze,members:Ee})},k={name:"DebtSimplify",args:{simplified:!1,autoplay:!0},render:t=>e.jsx(Je,{...t}),parameters:{docs:{description:{story:"Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only."}}}},f={name:"DebtUntangle (v5.6 Receipt to stacks, default)",args:{solved:!1,controls:"steps",startButton:!0,skin:"receipt"},argTypes:{controls:{control:"inline-radio",options:["steps","full","inline","none"]},skin:{control:"inline-radio",options:["receipt","solver","instrument"]}},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(g,{...t})}),parameters:{docs:{description:{story:"The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star."}}}},b={name:"DebtUntangle, inline controls (Money screen)",args:{solved:!1,controls:"inline",startButton:!1,skin:"receipt"},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(g,{...t})})},w={name:"DebtUntangle, solved",args:{solved:!0,controls:"inline",skin:"receipt"},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(g,{...t})})},x={name:"Money v4 logs and rows",render:()=>e.jsxs("div",{style:{maxWidth:362,display:"grid",gap:12},children:[e.jsx(He,{net:-23.7,caption:"2 IOUs: you owe Tomás $42.10. Ren owes you $18.40."}),e.jsx(Ke,{raw:N,people:a}),e.jsx(Qe,{nets:{nic:42.1,joao:64,sofia:0,tomas:0,ren:-18.4,ari:-23.7,mara:-64},people:a}),e.jsx(Xe,{plan:y,people:a})]})},q={name:"PaymentRow",args:{amount:42.1,state:"due",method:"MB WAY"},argTypes:{state:{control:"inline-radio",options:["due","sending","paid","requested"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(W,{children:e.jsx(p,{...t,from:a.nic,to:a.ari})}),e.jsx(Oe,{children:"States"}),e.jsxs(W,{children:[e.jsx(p,{from:a.nic,to:a.ari,amount:42.1,state:"due"}),e.jsx(p,{from:a.ari,to:a.joao,amount:12.5,state:"due",method:"Sintra train tickets"}),e.jsx(p,{from:a.mara,to:a.joao,amount:64,state:"sending"}),e.jsx(p,{from:a.ren,to:a.ari,amount:18.4,state:"paid",method:"Revolut"}),e.jsx(p,{from:a.nic,to:a.ari,amount:42.1,state:"requested"})]})]})},j={name:"SettleSheet",parameters:{screen:"full"},args:{amount:42.1,method:"MB WAY",state:"review"},argTypes:{method:{control:"inline-radio",options:["MB WAY","Apple Pay","Revolut","Cash"]},state:{control:"inline-radio",options:["review","sent"]}},render:t=>e.jsx("div",{className:"scr",children:e.jsx(Be,{title:"Settle up",detent:"compact",children:e.jsx(_e,{...t,from:a.nic,to:a.ari})})})},S={name:"DebtUntangle, legacy v4 Instrument skin",args:{solved:!1,controls:"full",startButton:!0,skin:"instrument"},argTypes:{controls:{control:"inline-radio",options:["full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"],description:"Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin()."}},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(g,{...t})}),parameters:{docs:{description:{story:"Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step."}}}},$={docs:{description:{story:"ReceiptStacksLive sits above the plan rows on Money once a payment exists. Stacks only move when a payment is paid (app or cash), never while pending. Transform and opacity only; Reduce Motion cross-fades."}}},R={name:"Receipt stacks · 0 of 3 paid",parameters:$,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(I,{raw:N,simple:y,people:a,me:"ari",paid:[!1,!1,!1]})})},P={name:"Receipt stacks · 1 of 3 paid",parameters:$,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(I,{raw:N,simple:y,people:a,me:"ari",paid:y.map(t=>t.from==="ari")})})},A={name:"Receipt stacks · all squared",parameters:$,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(I,{raw:N,simple:y,people:a,me:"ari",paid:[!0,!0,!0]})})},tt=[{from:"mara",to:"joao",amt:12},{from:"mara",to:"nic",amt:9.5},{from:"ari",to:"nic",amt:21},{from:"ari",to:"tomas",amt:6},{from:"sofia",to:"joao",amt:14},{from:"tomas",to:"mara",amt:8.2},{from:"nic",to:"sofia",amt:5},{from:"joao",to:"ari",amt:7.75},{from:"ari",to:"sofia",amt:11},{from:"tomas",to:"nic",amt:4.4}],at=[{from:"ari",to:"nic",amt:29.9},{from:"mara",to:"joao",amt:13.3},{from:"tomas",to:"joao",amt:4.95},{from:"tomas",to:"sofia",amt:1.65},{from:"ari",to:"sofia",amt:.35}],T={name:"Receipt · 10 IOUs fit the card",parameters:$,render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(g,{raw:tt,simple:at,people:a,controls:"inline",startButton:!1,skin:"receipt"})})},m=(t,o,s,l,i,u)=>({key:t,kind:o,who:s,amt:l,status:i,to:u}),Ce=[m("ari>nic","pay",a.nic,42.1,"open"),m("ari>tomas","pay",a.tomas,12.4,"open"),m("ren>ari","request",Ee.find(t=>t.id==="ren")??a.ren,18.4,"open")],Ve=[m("mara>joao","other",a.mara,64,"open",a.joao)],U={name:"SettleActions · your actions",render:()=>{const[t,o]=Ge.useState(Ce);return e.jsx("div",{style:{maxWidth:370},children:e.jsx(B,{mine:t,others:Ve,onAct:s=>o(l=>l.map(i=>i.key===s.key?{...i,status:s.kind==="pay"?"paid":"sent"}:i))})})}},D={name:"SettleActions · statuses",render:()=>e.jsx("div",{style:{maxWidth:370},children:e.jsx(B,{mine:[m("a","pay",a.nic,42.1,"pending"),m("b","request",a.ren,18.4,"sent"),m("c","pay",a.tomas,12.4,"paid")],others:[{...Ve[0],nudged:!0}]})})},L={name:"SettleAllSheet · confirm batch",render:()=>e.jsx(Fe,{actions:Ce,onApprove:()=>{},onClose:()=>{}})};var F,C,V;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
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
}`,...(V=(C=h.parameters)==null?void 0:C.docs)==null?void 0:V.source}}};var G,Y,_;v.parameters={...v.parameters,docs:{...(G=v.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'ReceiptSplit',
  args: {
    venue: 'Taberna da Rua das Flores',
    tip: 0
  },
  render: a => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />
}`,...(_=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var J,z,H;k.parameters={...k.parameters,docs:{...(J=k.parameters)==null?void 0:J.docs,source:{originalSource:`{
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
}`,...(H=(z=k.parameters)==null?void 0:z.docs)==null?void 0:H.source}}};var K,Q,X;f.parameters={...f.parameters,docs:{...(K=f.parameters)==null?void 0:K.docs,source:{originalSource:`{
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
}`,...(X=(Q=f.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Z,ee,te;b.parameters={...b.parameters,docs:{...(Z=b.parameters)==null?void 0:Z.docs,source:{originalSource:`{
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
}`,...(te=(ee=b.parameters)==null?void 0:ee.docs)==null?void 0:te.source}}};var ae,ne,re;w.parameters={...w.parameters,docs:{...(ae=w.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'DebtUntangle, solved',
  args: {
    solved: true,
    controls: 'inline',
    skin: 'receipt'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(re=(ne=w.parameters)==null?void 0:ne.docs)==null?void 0:re.source}}};var se,ie,oe;x.parameters={...x.parameters,docs:{...(se=x.parameters)==null?void 0:se.docs,source:{originalSource:`{
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
}`,...(oe=(ie=x.parameters)==null?void 0:ie.docs)==null?void 0:oe.source}}};var le,ue,de;q.parameters={...q.parameters,docs:{...(le=q.parameters)==null?void 0:le.docs,source:{originalSource:`{
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
}`,...(de=(ue=q.parameters)==null?void 0:ue.docs)==null?void 0:de.source}}};var me,pe,ce;j.parameters={...j.parameters,docs:{...(me=j.parameters)==null?void 0:me.docs,source:{originalSource:`{
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
}`,...(ce=(pe=j.parameters)==null?void 0:pe.docs)==null?void 0:ce.source}}};var ye,ge,he;S.parameters={...S.parameters,docs:{...(ye=S.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
}`,...(he=(ge=S.parameters)==null?void 0:ge.docs)==null?void 0:he.source}}};var ve,ke,fe;R.parameters={...R.parameters,docs:{...(ve=R.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'Receipt stacks · 0 of 3 paid',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[false, false, false]} /></div>
}`,...(fe=(ke=R.parameters)==null?void 0:ke.docs)==null?void 0:fe.source}}};var be,we,xe;P.parameters={...P.parameters,docs:{...(be=P.parameters)==null?void 0:be.docs,source:{originalSource:`{
  name: 'Receipt stacks · 1 of 3 paid',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={simplifiedDebts.map(e => e.from === 'ari')} /></div>
}`,...(xe=(we=P.parameters)==null?void 0:we.docs)==null?void 0:xe.source}}};var qe,je,Se;A.parameters={...A.parameters,docs:{...(qe=A.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  name: 'Receipt stacks · all squared',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[true, true, true]} /></div>
}`,...(Se=(je=A.parameters)==null?void 0:je.docs)==null?void 0:Se.source}}};var Re,Pe,Ae;T.parameters={...T.parameters,docs:{...(Re=T.parameters)==null?void 0:Re.docs,source:{originalSource:`{
  name: 'Receipt · 10 IOUs fit the card',
  parameters: liveDoc,
  render: () => <div style={{
    maxWidth: 362
  }}><DebtUntangle raw={manyRaw} simple={manySimple} people={P} controls="inline" startButton={false} skin="receipt" /></div>
}`,...(Ae=(Pe=T.parameters)==null?void 0:Pe.docs)==null?void 0:Ae.source}}};var Te,Ue,De;U.parameters={...U.parameters,docs:{...(Te=U.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'SettleActions · your actions',
  render: () => {
    const [mine, setMine] = React.useState(myActs);
    return <div style={{
      maxWidth: 370
    }}><SettleActions mine={mine} others={others} onAct={a => setMine(m => m.map(x => x.key === a.key ? {
        ...x,
        status: a.kind === 'pay' ? 'paid' : 'sent'
      } : x))} /></div>;
  }
}`,...(De=(Ue=U.parameters)==null?void 0:Ue.docs)==null?void 0:De.source}}};var Le,We,Ne;D.parameters={...D.parameters,docs:{...(Le=D.parameters)==null?void 0:Le.docs,source:{originalSource:`{
  name: 'SettleActions · statuses',
  render: () => <div style={{
    maxWidth: 370
  }}><SettleActions mine={[sa('a', 'pay', P.nic, 42.1, 'pending'), sa('b', 'request', P.ren, 18.4, 'sent'), sa('c', 'pay', P.tomas, 12.4, 'paid')]} others={[{
      ...others[0],
      nudged: true
    }]} /></div>
}`,...(Ne=(We=D.parameters)==null?void 0:We.docs)==null?void 0:Ne.source}}};var $e,Me,Ie;L.parameters={...L.parameters,docs:{...($e=L.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  name: 'SettleAllSheet · confirm batch',
  render: () => <SettleAllSheet actions={myActs} onApprove={() => {}} onClose={() => {}} />
}`,...(Ie=(Me=L.parameters)==null?void 0:Me.docs)==null?void 0:Ie.source}}};const vt=["Expense","Receipt","Simplify","Untangle","UntangleInline","UntangleSolved","MoneyLogs","Payments","Settle","UntangleLegacyInstrument","StacksOpen","StacksOne","StacksSquared","ManyIous","ActionList","ActionStatuses","SettleAll"];export{U as ActionList,D as ActionStatuses,h as Expense,T as ManyIous,x as MoneyLogs,q as Payments,v as Receipt,j as Settle,L as SettleAll,k as Simplify,P as StacksOne,R as StacksOpen,A as StacksSquared,f as Untangle,b as UntangleInline,S as UntangleLegacyInstrument,w as UntangleSolved,vt as __namedExportsOrder,ht as default};
