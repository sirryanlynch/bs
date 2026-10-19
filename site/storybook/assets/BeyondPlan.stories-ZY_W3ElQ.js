import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as p}from"./index-ClcD9ViR.js";import{T as k,D as v,a as Y}from"./plan-B6NwDTn_.js";import{F as L}from"./filterchips-BMMFXHEy.js";import{h as E,d as N}from"./beyond-CtNlGMEr.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-GWNSd6eF.js";import"./Icon-C50tt4eV.js";import"./PrismRoot-DCukcACG.js";import"./data-D7VP6L1L.js";const Z={title:"Components/Beyond tonight/Day plan",tags:["autodocs"],parameters:{docs:{description:{component:"Morning, afternoon and evening. Drag the grip to reorder, or focus it and use the up and down arrow keys. The poll winner lands as a booked item at 8:30 PM."}}}},u=E.oct17;function O(){const[r,d]=p.useState("oct16");return e.jsx(Y,{days:N,value:r,today:"oct16",onChange:d})}const s={name:"DayTabs",render:()=>e.jsx(O,{})},t={name:"TimelineItem",render:()=>e.jsx(e.Fragment,{children:u.slice(0,3).map(r=>e.jsx(k,{item:r},r.id))})},o={name:"TimelineItem, poll winner landed",render:()=>e.jsx(k,{item:u.find(r=>r.id==="p5"),landed:!0})};function B(){const[r,d]=p.useState(u),[n,P]=p.useState("all"),l={};return r.forEach(a=>l[a.xt]=(l[a.xt]??0)+1),e.jsxs(e.Fragment,{children:[e.jsx(L,{value:n,onChange:P,surface:"itinerary",counts:l,showCounts:!0}),e.jsx(v,{items:n==="all"?r:r.filter(a=>a.xt===n),onReorder:a=>n==="all"&&d(a),landedId:"p5"})]})}const i={name:"DayTimeline with FilterChips",render:()=>e.jsx(B,{})},m={name:"DayTimeline, Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(B,{})},c={name:"DayTimeline, Tuesday scuba at 6:00 AM",render:()=>e.jsx(v,{items:E.oct13})};var T,y,x;s.parameters={...s.parameters,docs:{...(T=s.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'DayTabs',
  render: () => <Tabs />
}`,...(x=(y=s.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var D,f,g;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'TimelineItem',
  render: () => <>{fri.slice(0, 3).map(i => <TimelineItem key={i.id} item={i} />)}</>
}`,...(g=(f=t.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var h,j,I;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'TimelineItem, poll winner landed',
  render: () => <TimelineItem item={fri.find(i => i.id === 'p5')!} landed />
}`,...(I=(j=o.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};var b,S,w;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'DayTimeline with FilterChips',
  render: () => <Timeline />
}`,...(w=(S=i.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var A,C,F;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'DayTimeline, Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Timeline />
}`,...(F=(C=m.parameters)==null?void 0:C.docs)==null?void 0:F.source}}};var M,R,_;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'DayTimeline, Tuesday scuba at 6:00 AM',
  render: () => <DayTimeline items={DAY_PLAN.oct13} />
}`,...(_=(R=c.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};const $=["Days","Item","ItemBooked","Timeline_","TimelineReduce","TimelineTue"];export{s as Days,t as Item,o as ItemBooked,m as TimelineReduce,c as TimelineTue,i as Timeline_,$ as __namedExportsOrder,Z as default};
