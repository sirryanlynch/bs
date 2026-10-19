import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as I}from"./index-ClcD9ViR.js";import{S as o}from"./stepper-CIpl7I0F.js";import{L as n}from"./_helpers-vCys1M5J.js";import{B as x}from"./core-BmZpmJNA.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./Icon-BrJiqn4m.js";import"./PrismRoot-DCukcACG.js";const Z={title:"Components/Full JTBD analysis/Stepper",tags:["autodocs"],parameters:{docs:{description:{component:'One progress stepper for every multi-step flow: Explore (Find a place), Create trip and Add expense. A top row with a fixed Back slot, a centered "Step n of N" mono caption and a fixed Skip slot, then a thin segmented bar (4 px, 2 px radius, 4 px gaps). Iris fills completed and current steps over 200 ms, instantly with Reduce Motion. Completed segments are tappable to go back. In the app the nav bar already has Back, so screens pass Skip only, and only on optional steps. Back in the stepper is for hosts without a nav back.'}}}},t=["Getting there","How long","What kind","Picks ready"],z=["Where to","Dates","Cover photo","Starter budget","Invite crew"],_=["Line items","Assign to people","Split mode","Tip and tax","Review"];function r({steps:u,optional:F,withBack:N}){const[k,s]=I.useState(1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{steps:u,current:k,onStep:s,onBack:N?()=>s(a=>Math.max(0,a-1)):void 0,onSkip:F.includes(k)?()=>s(a=>Math.min(u.length-1,a+1)):void 0}),e.jsxs("div",{style:{display:"flex",gap:8,marginTop:16},children:[e.jsx(x,{label:"Next step",size:"small",variant:"secondary",onClick:()=>s(a=>Math.min(u.length-1,a+1))}),e.jsx(x,{label:"Reset",size:"small",variant:"plain",onClick:()=>s(0)})]})]})}const p={name:"Explore: 4 steps, Skip on 1 to 3",render:()=>e.jsx(r,{steps:t,optional:[0,1,2]})},i={name:"States",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{children:"Step 1 of 4, Skip"}),e.jsx(o,{steps:t,current:0,onSkip:()=>{}}),e.jsx(n,{children:"Step 2 of 4, Skip (nav bar has Back)"}),e.jsx(o,{steps:t,current:1,onSkip:()=>{},onStep:()=>{}}),e.jsx(n,{children:"Step 3 of 4, Back and Skip (host without nav back)"}),e.jsx(o,{steps:t,current:2,onBack:()=>{},onSkip:()=>{},onStep:()=>{}}),e.jsx(n,{children:"Step 4 of 4, Picks ready"}),e.jsx(o,{steps:t,current:3,onStep:()=>{}})]})},c={name:"Create trip: 5 steps, Skip on 3 to 5",render:()=>e.jsx(r,{steps:z,optional:[2,3,4]})},d={name:"Add expense: 5 steps, Skip on 2 to 4",render:()=>e.jsx(r,{steps:_,optional:[1,2,3]})},l={name:"With Back (no nav bar)",render:()=>e.jsx(r,{steps:t,optional:[0,1,2],withBack:!0})},m={name:"Reduce Motion: instant fill",globals:{motion:"reduce"},render:()=>e.jsx(r,{steps:t,optional:[0,1,2]})},S={name:"Dark",globals:{theme:"dark"},render:()=>e.jsx(r,{steps:t,optional:[0,1,2]})};var h,E,b;p.parameters={...p.parameters,docs:{...(h=p.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Explore: 4 steps, Skip on 1 to 3',
  render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} />
}`,...(b=(E=p.parameters)==null?void 0:E.docs)==null?void 0:b.source}}};var g,L,f;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'States',
  render: () => <>
  <Label>Step 1 of 4, Skip</Label><Stepper steps={EXPLORE} current={0} onSkip={() => {}} />
  <Label>Step 2 of 4, Skip (nav bar has Back)</Label><Stepper steps={EXPLORE} current={1} onSkip={() => {}} onStep={() => {}} />
  <Label>Step 3 of 4, Back and Skip (host without nav back)</Label><Stepper steps={EXPLORE} current={2} onBack={() => {}} onSkip={() => {}} onStep={() => {}} />
  <Label>Step 4 of 4, Picks ready</Label><Stepper steps={EXPLORE} current={3} onStep={() => {}} />
  </>
}`,...(f=(L=i.parameters)==null?void 0:L.docs)==null?void 0:f.source}}};var v,j,B;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Create trip: 5 steps, Skip on 3 to 5',
  render: () => <Live steps={CREATE} optional={[2, 3, 4]} />
}`,...(B=(j=c.parameters)==null?void 0:j.docs)==null?void 0:B.source}}};var R,P,C;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Add expense: 5 steps, Skip on 2 to 4',
  render: () => <Live steps={EXPENSE} optional={[1, 2, 3]} />
}`,...(C=(P=d.parameters)==null?void 0:P.docs)==null?void 0:C.source}}};var w,y,O;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'With Back (no nav bar)',
  render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} withBack />
}`,...(O=(y=l.parameters)==null?void 0:y.docs)==null?void 0:O.source}}};var X,A,T;m.parameters={...m.parameters,docs:{...(X=m.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Reduce Motion: instant fill',
  globals: {
    motion: 'reduce'
  },
  render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} />
}`,...(T=(A=m.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var D,M,W;S.parameters={...S.parameters,docs:{...(D=S.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} />
}`,...(W=(M=S.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};const $=["Explore","States","CreateTrip","AddExpense","WithBack","Reduce","Dark"];export{d as AddExpense,c as CreateTrip,S as Dark,p as Explore,m as Reduce,i as States,l as WithBack,$ as __namedExportsOrder,Z as default};
