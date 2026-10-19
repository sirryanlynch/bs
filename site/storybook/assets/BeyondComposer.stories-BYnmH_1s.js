import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as g}from"./index-ClcD9ViR.js";import{P as H,F as I,a as J,f as Q,b as R}from"./findplace-CcRtEGIo.js";import{D as U,C as k}from"./beyond-BM1Zjxx7.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-C2-rqUCe.js";import"./Icon-DqDER8CT.js";import"./filterchips-DUsg8kyW.js";import"./headermenu-s7AQhpLQ.js";import"./actioninbox-BCdI7c0j.js";import"./data-nxiCAWEG.js";import"./explore-fCCkt0lw.js";import"./navghost-B2h3RIy7.js";import"./PrismRoot-DCukcACG.js";const ce={title:"Components/Full JTBD analysis/Poll composer and Find a place",tags:["autodocs"],parameters:{screen:"phone",docs:{description:{component:"New poll is one sentence with tappable tokens (type, when, closes). Options are photo tiles; swipe one left to remove it. One + Add option sheet takes a typed idea or an Explore pick. Find a place asks one question per screen with big tiles that answer and advance."}}}},V=k.map(r=>({id:r.id,name:r.name,kind:r.kind,photo:r.photos[0],meta:`${r.type} · ${r.price}`})),z=r=>({title:"",category:"food",day:"oct17",time:"8:30 PM",closes:"7:30 PM",options:k.slice(0,r).map(s=>({label:s.name,from:`From Explore · ${s.price}`,photo:s.photos[0]}))});function f({n:r=3}){const[s,a]=g.useState(z(r));return e.jsx("div",{className:"b-scr",style:{position:"relative",height:874},children:e.jsx(H,{value:s,onChange:l=>a(u=>({...u,...l})),days:U,today:"oct17",picks:V,onSend:()=>{},onBack:()=>{}})})}function m({start:r={}}){const[s,a]=g.useState(r),[l,u]=g.useState([]);return e.jsxs("div",{className:"b-scr b-cmp",style:{position:"relative",height:874},children:[e.jsx("div",{className:"b-cmp-amb","aria-hidden":!0}),e.jsx(I,{answers:s,onBack:()=>a({})}),e.jsxs("div",{className:"b-scroll b-cmp-scroll is-q",children:[e.jsx(J,{answers:s,onAnswer:a}),Q(s)>=4&&e.jsx(R,{answers:s,list:k.slice(0,6),onOpen:()=>{},picked:l,onToggle:F=>u(h=>h.includes(F)?h.filter(_=>_!==F):[...h,F])})]})]})}const n={name:"Composer · Saturday dinner, 3 options",render:()=>e.jsx(f,{})},o={name:"Composer · from the feed, 1 option",render:()=>e.jsx(f,{n:1})},t={name:"Find a place · first question: what kind",render:()=>e.jsx(m,{})},i={name:"Find a place · price point",render:()=>e.jsx(m,{start:{after:0}})},p={name:"Find a place · getting there",render:()=>e.jsx(m,{start:{after:0,budget:1}})},d={name:"Find a place · picks",render:()=>e.jsx(m,{start:{mode:"walk",dur:1,after:0,budget:1}})},c={name:"Composer · dark",globals:{theme:"dark"},render:()=>e.jsx(f,{})};var x,C,b;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Composer · Saturday dinner, 3 options',
  render: () => <Composer />
}`,...(b=(C=n.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var j,w,S;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Composer · from the feed, 1 option',
  render: () => <Composer n={1} />
}`,...(S=(w=o.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var y,O,P;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'Find a place · first question: what kind',
  render: () => <Find />
}`,...(P=(O=t.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var v,A,D;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Find a place · price point',
  render: () => <Find start={{
    after: 0
  } as CurateAnswers} />
}`,...(D=(A=i.parameters)==null?void 0:A.docs)==null?void 0:D.source}}};var N,E,T;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'Find a place · getting there',
  render: () => <Find start={{
    after: 0,
    budget: 1
  } as CurateAnswers} />
}`,...(T=(E=p.parameters)==null?void 0:E.docs)==null?void 0:T.source}}};var q,M,B;d.parameters={...d.parameters,docs:{...(q=d.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'Find a place · picks',
  render: () => <Find start={{
    mode: 'walk',
    dur: 1,
    after: 0,
    budget: 1
  } as CurateAnswers} />
}`,...(B=(M=d.parameters)==null?void 0:M.docs)==null?void 0:B.source}}};var $,G,Y;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Composer · dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Composer />
}`,...(Y=(G=c.parameters)==null?void 0:G.docs)==null?void 0:Y.source}}};const me=["ThreeOptions","OneOption","FindFirst","FindPrice","FindGetting","FindPicksDone","Dark"];export{c as Dark,t as FindFirst,p as FindGetting,d as FindPicksDone,i as FindPrice,o as OneOption,n as ThreeOptions,me as __namedExportsOrder,ce as default};
