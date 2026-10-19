import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as P}from"./index-ClcD9ViR.js";import{H as W,F as E}from"./headermenu-CRo5bDRn.js";import{A as I}from"./solver-assets-BvNkYNQl.js";import{a as H}from"./data-nxiCAWEG.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";const U={title:"Components/Full JTBD analysis/Header menu",tags:["autodocs"],parameters:{screen:"full",docs:{description:{component:"One-row header for top-level screens: avatar or Back, the page title, and one glass menu button. The button grows leftward into a capsule of five shortcuts (Notifications, Album, Add expense, Invite, Settings) while the title steps aside. Inset 12px from the screen edges with glass elevation, never full bleed. Escape, tap outside or scroll closes it; arrow keys move between shortcuts. Reduce Motion: crossfade only."}}}};function s({open:a,back:r,hero:o}){const[p,T]=P.useState("");return e.jsxs("div",{className:"scr",style:{position:"relative",height:260,overflow:"hidden",borderRadius:24,background:o?`center/cover url(${H.roofs})`:"var(--color-bg-canvas)"},children:[e.jsx(W,{title:o?void 0:r?"Money":"Trips",sub:r?"Whole trip · 7 people":void 0,avatar:r||o?void 0:I.ari,onBack:r||o?()=>{}:void 0,light:o,defaultOpen:a,onPick:T}),e.jsx("p",{style:{position:"absolute",left:20,bottom:16,margin:0,color:o?"#fff":void 0},children:p?`Picked: ${p}`:"Tap the menu button"})]})}const t={name:"Closed",render:()=>e.jsx(s,{})},n={name:"Open",render:()=>e.jsx(s,{open:!0})},c={name:"With Back and subtitle",render:()=>e.jsx(s,{back:!0})},i={name:"Over a photo hero",render:()=>e.jsx(s,{hero:!0,open:!0})},d={name:"Dark",globals:{theme:"dark"},render:()=>e.jsx(s,{open:!0})},l={name:"Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(s,{})};function L(){const[a,r]=P.useState("");return e.jsxs("div",{className:"scr",style:{position:"relative",height:260,borderRadius:24,background:"var(--color-bg-canvas)"},children:[e.jsxs("header",{className:"b-cmp-head",children:[e.jsx("button",{type:"button",className:"b-cmp-round tu-glass","aria-label":"Back",children:"‹"}),e.jsxs("div",{className:"b-cmp-headt",children:[e.jsx("b",{children:"New poll"}),e.jsx("small",{children:"Lisbon Crew · 7 people"})]}),e.jsx(E,{onPick:r})]}),e.jsx("p",{style:{position:"absolute",left:20,bottom:16,margin:0},children:a?`Picked: ${a}`:"Tap the menu button"})]})}const m={name:"FlowMenu · in-flow screens (v5.3)",render:()=>e.jsx(L,{})};var u,h,b;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Closed',
  render: () => <Demo />
}`,...(b=(h=t.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var v,g,f;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Open',
  render: () => <Demo open />
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var x,j,k;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'With Back and subtitle',
  render: () => <Demo back />
}`,...(k=(j=c.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};var w,D,O;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Over a photo hero',
  render: () => <Demo hero open />
}`,...(O=(D=i.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var S,y,F;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'Dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Demo open />
}`,...(F=(y=d.parameters)==null?void 0:y.docs)==null?void 0:F.source}}};var R,B,M;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Demo />
}`,...(M=(B=l.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var N,A,C;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'FlowMenu · in-flow screens (v5.3)',
  render: () => <FlowDemo />
}`,...(C=(A=m.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};const X=["Closed","Open","WithBack","OverPhoto","Dark","Reduce","InFlow"];export{t as Closed,d as Dark,m as InFlow,n as Open,i as OverPhoto,l as Reduce,c as WithBack,X as __namedExportsOrder,U as default};
