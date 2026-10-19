import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as K}from"./index-ClcD9ViR.js";import{H as a}from"./headermenu-BeS1_Nqq.js";import{A as v}from"./solver-assets-BvNkYNQl.js";import{a as Q}from"./data-nxiCAWEG.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./actioninbox-BCdI7c0j.js";import"./Icon-DqDER8CT.js";import"./icons-C2-rqUCe.js";const de={title:"Components/Full JTBD analysis/Header menu",tags:["autodocs"],parameters:{screen:"full",docs:{description:{component:"One-row header for top-level screens: avatar or Back, the page title, and one glass menu button. The button grows leftward into a capsule of three shortcuts (Notifications, Album, Settings) while the title steps aside. Inset 12px from the screen edges with glass elevation, never full bleed. Escape, tap outside or scroll closes it; arrow keys move between shortcuts. Reduce Motion: crossfade only."}}}};function o({open:x,back:t,hero:r}){const[g,G]=K.useState("");return e.jsxs("div",{className:"scr",style:{position:"relative",height:260,overflow:"hidden",borderRadius:24,background:r?`center/cover url(${Q.roofs})`:"var(--color-bg-canvas)"},children:[e.jsx(a,{title:r?void 0:t?"Money":"Trips",sub:t?"Whole trip · 7 people":void 0,avatar:t||r?void 0:v.ari,onBack:t||r?()=>{}:void 0,light:r,defaultOpen:x,onPick:G}),e.jsx("p",{style:{position:"absolute",left:20,bottom:16,margin:0,color:r?"#fff":void 0},children:g?`Picked: ${g}`:"Tap the menu button"})]})}const s={name:"Closed",render:()=>e.jsx(o,{})},n={name:"Open",render:()=>e.jsx(o,{open:!0})},c={name:"With Back and subtitle",render:()=>e.jsx(o,{back:!0})},i={name:"Over a photo hero",render:()=>e.jsx(o,{hero:!0,open:!0})},d={name:"Dark",globals:{theme:"dark"},render:()=>e.jsx(o,{open:!0})},l={name:"Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(o,{})},p={name:"In a flow: Back only, no menu",render:()=>e.jsxs("div",{className:"scr",style:{position:"relative",height:200,overflow:"hidden",borderRadius:24,background:"var(--color-bg-canvas)"},children:[e.jsx(a,{title:"Cash for Nic",sub:"Count it out, then slide",onBack:()=>{},backLabel:"Back to Pay Nic",menu:!1}),e.jsx("p",{style:{position:"absolute",left:20,bottom:16,margin:0},children:"Tap Back or swipe down to leave."})]})},z=[{id:"vote",kind:"vote",title:"Vote: Dinner tonight",meta:"Closes 7:30 PM · 3 places",cta:"Vote"},{id:"pay",kind:"pay",title:"Pay Nic $42.10",meta:"Your one payment · settles your share",cta:"Pay",avatar:v.nic}],b=({children:x})=>e.jsx("div",{className:"scr",style:{position:"relative",height:420,overflow:"hidden",borderRadius:24,background:"var(--color-bg-canvas)"},children:x}),m={name:"Up next: pill with count",render:()=>e.jsx(b,{children:e.jsx(a,{title:"Lisbon Crew",onBack:()=>{},actions:z})})},u={name:"Up next: open",render:()=>e.jsx(b,{children:e.jsx(a,{title:"Lisbon Crew",onBack:()=>{},actions:z,defaultUpNext:!0})})},h={name:"Up next: all caught up",render:()=>e.jsx(b,{children:e.jsx(a,{title:"Trips",avatar:v.ari,actions:[],defaultUpNext:!0})})};var f,k,B;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'Closed',
  render: () => <Demo />
}`,...(B=(k=s.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var w,y,N;n.parameters={...n.parameters,docs:{...(w=n.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'Open',
  render: () => <Demo open />
}`,...(N=(y=n.parameters)==null?void 0:y.docs)==null?void 0:N.source}}};var j,U,C;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'With Back and subtitle',
  render: () => <Demo back />
}`,...(C=(U=c.parameters)==null?void 0:U.docs)==null?void 0:C.source}}};var D,O,T;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'Over a photo hero',
  render: () => <Demo hero open />
}`,...(T=(O=i.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};var P,R,S;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Dark',
  globals: {
    theme: 'dark'
  },
  render: () => <Demo open />
}`,...(S=(R=d.parameters)==null?void 0:R.docs)==null?void 0:S.source}}};var M,E,A;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Demo />
}`,...(A=(E=l.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var H,L,I;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'In a flow: Back only, no menu',
  render: () => <div className="scr" style={{
    position: 'relative',
    height: 200,
    overflow: 'hidden',
    borderRadius: 24,
    background: 'var(--color-bg-canvas)'
  }}>
    <HeaderMenu title="Cash for Nic" sub="Count it out, then slide" onBack={() => {}} backLabel="Back to Pay Nic" menu={false} />
    <p style={{
      position: 'absolute',
      left: 20,
      bottom: 16,
      margin: 0
    }}>Tap Back or swipe down to leave.</p>
  </div>
}`,...(I=(L=p.parameters)==null?void 0:L.docs)==null?void 0:I.source}}};var W,V,F;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'Up next: pill with count',
  render: () => <Box><HeaderMenu title="Lisbon Crew" onBack={() => {}} actions={UPNEXT} /></Box>
}`,...(F=(V=m.parameters)==null?void 0:V.docs)==null?void 0:F.source}}};var X,$,_;u.parameters={...u.parameters,docs:{...(X=u.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'Up next: open',
  render: () => <Box><HeaderMenu title="Lisbon Crew" onBack={() => {}} actions={UPNEXT} defaultUpNext /></Box>
}`,...(_=($=u.parameters)==null?void 0:$.docs)==null?void 0:_.source}}};var J,Y,q;h.parameters={...h.parameters,docs:{...(J=h.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'Up next: all caught up',
  render: () => <Box><HeaderMenu title="Trips" avatar={AVATAR.ari} actions={[]} defaultUpNext /></Box>
}`,...(q=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:q.source}}};const le=["Closed","Open","WithBack","OverPhoto","Dark","Reduce","InFlow","UpNext","UpNextOpen","UpNextEmpty"];export{s as Closed,d as Dark,p as InFlow,n as Open,i as OverPhoto,l as Reduce,m as UpNext,h as UpNextEmpty,u as UpNextOpen,c as WithBack,le as __namedExportsOrder,de as default};
