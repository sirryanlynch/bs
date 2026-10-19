import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as d}from"./index-ClcD9ViR.js";import{T,C as E}from"./kit-Ce6bU6dr.js";import{T as O}from"./nav-vCTT9GUS.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./data-D7VP6L1L.js";import"./beyond-7yIgLQ0J.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";const q={title:"Components/Beyond tonight/Create menu",tags:["autodocs"],parameters:{screen:"full",docs:{description:{component:"The global + sits next to the 5-tab bar (Trips, Plan, Explore, Polls, Money) on every tab. It opens a glass menu: New poll, Add expense, Add to plan, New trip. Escape or the scrim closes it. Reduce Motion drops the scale-in."}}}};function t({open:k=!0}){const[p,n]=d.useState(k),[m,S]=d.useState("");return e.jsxs("div",{style:{position:"relative",height:520},children:[e.jsx("p",{style:{padding:16},children:m?`Picked: ${m}`:"Tap + to open"}),e.jsx(O,{active:"polls",tabs:T,accessory:"plus",accessoryLabel:"Create",accessoryExpanded:p,onAccessory:()=>n(c=>!c)}),p&&e.jsx(E,{onClose:()=>n(!1),onPick:c=>{S(c),n(!1)}})]})}const r={name:"Open",render:()=>e.jsx(t,{})},o={name:"Closed",render:()=>e.jsx(t,{open:!1})},s={name:"Dark",globals:{theme:"dark"},render:()=>e.jsx(t,{})},a={name:"Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(t,{})};var i,l,u;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'Open',
  render: () => <Demo />
}`,...(u=(l=r.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var x,g,b;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Closed',
  render: () => <Demo open={false} />
}`,...(b=(g=o.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var f,h,j;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'Dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Demo />
}`,...(j=(h=s.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var C,y,D;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Demo />
}`,...(D=(y=a.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};const z=["Open","Closed","Dark","Reduce"];export{o as Closed,s as Dark,r as Open,a as Reduce,z as __namedExportsOrder,q as default};
