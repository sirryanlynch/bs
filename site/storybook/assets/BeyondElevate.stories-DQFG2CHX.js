import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as v}from"./index-ClcD9ViR.js";import{N as d}from"./elevate-BYBjVP3R.js";import{P as S,C as M,M as W}from"./settle-Cq2nEsYp.js";import{p as a}from"./data-nxiCAWEG.js";import{L as p}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css                */import"./headermenu-CRo5bDRn.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./solver-assets-BvNkYNQl.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";const z={title:"Components/Full JTBD analysis/Hero patterns (v5.1)",tags:["autodocs"],parameters:{docs:{description:{component:"v5.1 elevation pass. Each confirmation or decision screen gets one hero element (photo or glass, display-type number) instead of a stack of rows. NextSteps ends a confirmation on what happens next instead of empty space."}}}},t={name:"NextSteps",render:()=>e.jsxs("div",{style:{maxWidth:362},children:[e.jsx(p,{children:"Poll sent"}),e.jsx(d,{steps:["Crew votes from the notification","Closes 10:00 PM","Winner lands on Tuesday"]}),e.jsx(p,{children:"Balances updated"}),e.jsx(d,{steps:["Logged to Money","On the plan for Wed, Oct 14","Settle up any time"]})]})},o={name:"PairHero (pay hero)",render:()=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(S,{from:{...a.ari,you:!0},to:a.nic,amount:42.1,caption:"For the Tejo boat tour, routed through Tomás.",link:"Why $42.10"})})};function b(){const[n,i]=v.useState("cash");return e.jsx("div",{style:{maxWidth:362},children:e.jsx(W,{value:n,onChange:i})})}const r={name:"MethodPicker (featured tiles + other apps)",render:()=>e.jsx(b,{})};function H(){const[n,i]=v.useState(!0);return e.jsx("div",{style:{maxWidth:362,display:"flex",flexDirection:"column",gap:12},children:e.jsx(M,{due:42.1,round:n,onRound:i,from:{...a.ari,you:!0},to:a.nic})})}const s={name:"CashCount (bills hero)",render:()=>e.jsx(H,{})};var m,c,l;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'NextSteps',
  render: () => <div style={{
    maxWidth: 362
  }}>
  <Label>Poll sent</Label><NextSteps steps={['Crew votes from the notification', 'Closes 10:00 PM', 'Winner lands on Tuesday']} />
  <Label>Balances updated</Label><NextSteps steps={['Logged to Money', 'On the plan for Wed, Oct 14', 'Settle up any time']} /></div>
}`,...(l=(c=t.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var u,h,x;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'PairHero (pay hero)',
  render: () => <div style={{
    maxWidth: 362
  }}><PairHero from={{
      ...P.ari,
      you: true
    }} to={P.nic} amount={42.1} caption="For the Tejo boat tour, routed through Tomás." link="Why $42.10" /></div>
}`,...(x=(h=o.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var f,y,j;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'MethodPicker (featured tiles + other apps)',
  render: () => <Methods />
}`,...(j=(y=r.parameters)==null?void 0:y.docs)==null?void 0:j.source}}};var C,P,g;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'CashCount (bills hero)',
  render: () => <Cash />
}`,...(g=(P=s.parameters)==null?void 0:P.docs)==null?void 0:g.source}}};const A=["Next","PayHero","Method","CashHero"];export{s as CashHero,r as Method,t as Next,o as PayHero,A as __namedExportsOrder,z as default};
