import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as d}from"./index-ClcD9ViR.js";import{T as S,C as E}from"./kit-CfUsLwvw.js";import{T as O}from"./nav-POsIvLXM.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./headermenu-CRo5bDRn.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./data-nxiCAWEG.js";import"./beyond-uSTt4T_4.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";const $={title:"Components/Full JTBD analysis/Create menu",tags:["autodocs"],parameters:{screen:"full",docs:{description:{component:"The global + sits next to the 5-tab bar (Trips, Plan, Explore, Polls, Money) on every tab. It opens a glass menu: New poll, Add expense, Add to plan, New trip. Escape or the scrim closes it. Reduce Motion drops the scale-in."}}}};function t({open:k=!0}){const[p,n]=d.useState(k),[m,T]=d.useState("");return e.jsxs("div",{style:{position:"relative",height:520},children:[e.jsx("p",{style:{padding:16},children:m?`Picked: ${m}`:"Tap + to open"}),e.jsx(O,{active:"polls",tabs:S,accessory:"plus",accessoryLabel:"Create",accessoryExpanded:p,onAccessory:()=>n(c=>!c)}),p&&e.jsx(E,{onClose:()=>n(!1),onPick:c=>{T(c),n(!1)}})]})}const r={name:"Open",render:()=>e.jsx(t,{})},s={name:"Closed",render:()=>e.jsx(t,{open:!1})},o={name:"Dark",globals:{theme:"dark"},render:()=>e.jsx(t,{})},a={name:"Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(t,{})};var l,i,u;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: 'Open',
  render: () => <Demo />
}`,...(u=(i=r.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var x,g,b;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'Closed',
  render: () => <Demo open={false} />
}`,...(b=(g=s.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var f,h,j;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'Dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Demo />
}`,...(j=(h=o.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var C,D,y;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Demo />
}`,...(y=(D=a.parameters)==null?void 0:D.docs)==null?void 0:y.source}}};const q=["Open","Closed","Dark","Reduce"];export{s as Closed,o as Dark,r as Open,a as Reduce,q as __namedExportsOrder,$ as default};
