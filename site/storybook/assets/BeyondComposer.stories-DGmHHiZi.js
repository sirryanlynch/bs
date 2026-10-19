import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as S}from"./index-ClcD9ViR.js";import{P as N,F as A,a as E,b as q}from"./findplace-sBInXjwq.js";import{D as M,C as d}from"./beyond-Ck7teDFp.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./filterchips-aHUCT-Pg.js";import"./data-BDsxFIV6.js";import"./explore-IbnHbdVy.js";import"./navghost-B2h3RIy7.js";import"./PrismRoot-DCukcACG.js";const L={title:"Components/Full JTBD analysis/Poll composer and Find a place",tags:["autodocs"],parameters:{screen:"phone",docs:{description:{component:"New poll is one sentence with tappable tokens (type, when, closes). Options are photo tiles; swipe one left to remove it. One + Add option sheet takes a typed idea or an Explore pick. Find a place asks one question per screen with big tiles that answer and advance."}}}},T=d.map(s=>({id:s.id,name:s.name,kind:s.kind,photo:s.photos[0],meta:`${s.type} · ${s.price}`})),B=s=>({title:"",category:"food",day:"oct17",time:"8:30 PM",closes:"7:30 PM",options:d.slice(0,s).map(r=>({label:r.name,from:`From Explore · ${r.price}`,photo:r.photos[0]}))});function m({n:s=3}){const[r,o]=S.useState(B(s));return e.jsx("div",{className:"b-scr",style:{position:"relative",height:874},children:e.jsx(N,{value:r,onChange:P=>o(D=>({...D,...P})),days:M,today:"oct17",picks:T,onSend:()=>{},onBack:()=>{}})})}function v({start:s={}}){const[r,o]=S.useState(s);return e.jsxs("div",{className:"b-scr b-cmp",style:{position:"relative",height:874},children:[e.jsx("div",{className:"b-cmp-amb","aria-hidden":!0}),e.jsx(A,{answers:r,onBack:()=>o({})}),e.jsxs("div",{className:"b-scroll b-cmp-scroll is-q",children:[e.jsx(E,{answers:r,onAnswer:o}),r.budget!=null&&e.jsx(q,{answers:r,list:d.slice(0,6),onOpen:()=>{}})]})]})}const a={name:"Composer · Saturday dinner, 3 options",render:()=>e.jsx(m,{})},n={name:"Composer · from the feed, 1 option",render:()=>e.jsx(m,{n:1})},t={name:"Find a place · first question",render:()=>e.jsx(v,{})},i={name:"Find a place · picks",render:()=>e.jsx(v,{start:{mode:"walk",dur:1,after:0,budget:1}})},p={name:"Composer · dark",globals:{theme:"dark"},render:()=>e.jsx(m,{})};var c,l,u;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'Composer · Saturday dinner, 3 options',
  render: () => <Composer />
}`,...(u=(l=a.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var h,k,F;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Composer · from the feed, 1 option',
  render: () => <Composer n={1} />
}`,...(F=(k=n.parameters)==null?void 0:k.docs)==null?void 0:F.source}}};var x,f,b;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Find a place · first question',
  render: () => <Find />
}`,...(b=(f=t.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var g,C,j;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'Find a place · picks',
  render: () => <Find start={{
    mode: 'walk',
    dur: 1,
    after: 0,
    budget: 1
  } as CurateAnswers} />
}`,...(j=(C=i.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};var w,y,O;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Composer · dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Composer />
}`,...(O=(y=p.parameters)==null?void 0:y.docs)==null?void 0:O.source}}};const W=["ThreeOptions","OneOption","FindFirst","FindPicksDone","Dark"];export{p as Dark,t as FindFirst,i as FindPicksDone,n as OneOption,a as ThreeOptions,W as __namedExportsOrder,L as default};
