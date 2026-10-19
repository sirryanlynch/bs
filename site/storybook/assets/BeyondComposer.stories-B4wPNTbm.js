import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as u}from"./index-ClcD9ViR.js";import{P as T,F as q,a as M,b as B}from"./findplace-CsQ6_B2L.js";import{D as $,C as h}from"./beyond-uSTt4T_4.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./headermenu-CRo5bDRn.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./filterchips-C1kLRK4K.js";import"./data-nxiCAWEG.js";import"./explore-DdCR-1Kg.js";import"./navghost-B2h3RIy7.js";import"./PrismRoot-DCukcACG.js";const ee={title:"Components/Full JTBD analysis/Poll composer and Find a place",tags:["autodocs"],parameters:{screen:"phone",docs:{description:{component:"New poll is one sentence with tappable tokens (type, when, closes). Options are photo tiles; swipe one left to remove it. One + Add option sheet takes a typed idea or an Explore pick. Find a place asks one question per screen with big tiles that answer and advance."}}}},Y=h.map(s=>({id:s.id,name:s.name,kind:s.kind,photo:s.photos[0],meta:`${s.type} · ${s.price}`})),_=s=>({title:"",category:"food",day:"oct17",time:"8:30 PM",closes:"7:30 PM",options:h.slice(0,s).map(r=>({label:r.name,from:`From Explore · ${r.price}`,photo:r.photos[0]}))});function k({n:s=3}){const[r,o]=u.useState(_(s));return e.jsx("div",{className:"b-scr",style:{position:"relative",height:874},children:e.jsx(T,{value:r,onChange:d=>o(m=>({...m,...d})),days:$,today:"oct17",picks:Y,onSend:()=>{},onBack:()=>{}})})}function A({start:s={}}){const[r,o]=u.useState(s),[d,m]=u.useState([]);return e.jsxs("div",{className:"b-scr b-cmp",style:{position:"relative",height:874},children:[e.jsx("div",{className:"b-cmp-amb","aria-hidden":!0}),e.jsx(q,{answers:r,onBack:()=>o({})}),e.jsxs("div",{className:"b-scroll b-cmp-scroll is-q",children:[e.jsx(M,{answers:r,onAnswer:o}),r.budget!=null&&e.jsx(B,{answers:r,list:h.slice(0,6),onOpen:()=>{},picked:d,onToggle:c=>m(l=>l.includes(c)?l.filter(E=>E!==c):[...l,c])})]})]})}const n={name:"Composer · Saturday dinner, 3 options",render:()=>e.jsx(k,{})},a={name:"Composer · from the feed, 1 option",render:()=>e.jsx(k,{n:1})},t={name:"Find a place · first question",render:()=>e.jsx(A,{})},i={name:"Find a place · picks",render:()=>e.jsx(A,{start:{mode:"walk",dur:1,after:0,budget:1}})},p={name:"Composer · dark",globals:{theme:"dark"},render:()=>e.jsx(k,{})};var F,f,g;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'Composer · Saturday dinner, 3 options',
  render: () => <Composer />
}`,...(g=(f=n.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var x,b,C;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Composer · from the feed, 1 option',
  render: () => <Composer n={1} />
}`,...(C=(b=a.parameters)==null?void 0:b.docs)==null?void 0:C.source}}};var j,w,y;t.parameters={...t.parameters,docs:{...(j=t.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Find a place · first question',
  render: () => <Find />
}`,...(y=(w=t.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var S,O,v;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Find a place · picks',
  render: () => <Find start={{
    mode: 'walk',
    dur: 1,
    after: 0,
    budget: 1
  } as CurateAnswers} />
}`,...(v=(O=i.parameters)==null?void 0:O.docs)==null?void 0:v.source}}};var P,D,N;p.parameters={...p.parameters,docs:{...(P=p.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Composer · dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Composer />
}`,...(N=(D=p.parameters)==null?void 0:D.docs)==null?void 0:N.source}}};const se=["ThreeOptions","OneOption","FindFirst","FindPicksDone","Dark"];export{p as Dark,t as FindFirst,i as FindPicksDone,a as OneOption,n as ThreeOptions,se as __namedExportsOrder,ee as default};
