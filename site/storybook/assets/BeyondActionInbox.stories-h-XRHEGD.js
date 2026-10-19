import{j as e}from"./jsx-runtime-BYYWji4R.js";import{A as U,a as T,U as p}from"./actioninbox-BCdI7c0j.js";import{E as I}from"./emptystate-_NMp2jEn.js";import{A as M}from"./solver-assets-BvNkYNQl.js";import{p as i}from"./beyond-uSTt4T_4.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-DqDER8CT.js";import"./core-BR5BZjX6.js";import"./PrismRoot-DCukcACG.js";import"./data-nxiCAWEG.js";const J={title:"Components/Full JTBD analysis/Up next and empty states",tags:["autodocs"],parameters:{docs:{description:{component:"Up next holds only things that need you: a vote, a payment. Each card taps straight into the action. Updates stay in the bell. EmptyState: one clear action, plain copy."}}}},f=[{id:"vote",kind:"vote",title:"Vote: Dinner tonight",meta:"Lisbon Crew · Closes 7:30 PM · 3 places",cta:"Vote"},{id:"pay",kind:"pay",title:"Pay Nic $42.10",meta:"Lisbon Crew · Your one payment",cta:"Pay",avatar:M.nic}],t={name:"UpNextPill",render:()=>e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(p,{count:2}),e.jsx("span",{className:"b-un is-zero",children:e.jsx(p,{count:0})})]})},o={name:"ActionList",render:()=>e.jsx("div",{style:{maxWidth:380},children:e.jsx(U,{items:f,inline:!0})})},s={name:"ActionList, all caught up",render:()=>e.jsx("div",{style:{maxWidth:380},children:e.jsx(U,{items:[],inline:!0})})},a={name:"ActionInbox (interactive)",render:()=>e.jsx(T,{items:f})},r={name:"EmptyState, photos",render:()=>e.jsx(I,{art:"photos",photos:[i.portoBoats,i.portoRibeira,i.porto],title:"No photos yet",body:"Everyone’s shots land here, sorted by day and place.",action:"Add photos"})},n={name:"EmptyState, render",render:()=>e.jsx(I,{render:"settle",title:"No expenses yet",body:"Log a bill once and TripUp keeps everyone’s balance.",action:"Add expense"})};var c,d,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'UpNextPill',
  render: () => <div style={{
    display: 'flex',
    gap: 12
  }}><UpNextPill count={2} /><span className="b-un is-zero"><UpNextPill count={0} /></span></div>
}`,...(m=(d=t.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};var l,y,x;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: 'ActionList',
  render: () => <div style={{
    maxWidth: 380
  }}><ActionList items={ITEMS} inline /></div>
}`,...(x=(y=o.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var u,h,b;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'ActionList, all caught up',
  render: () => <div style={{
    maxWidth: 380
  }}><ActionList items={[]} inline /></div>
}`,...(b=(h=s.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var E,A,v;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'ActionInbox (interactive)',
  render: () => <ActionInbox items={ITEMS} />
}`,...(v=(A=a.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var S,g,j;r.parameters={...r.parameters,docs:{...(S=r.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'EmptyState, photos',
  render: () => <EmptyState art="photos" photos={[px.portoBoats, px.portoRibeira, px.porto]} title="No photos yet" body="Everyone’s shots land here, sorted by day and place." action="Add photos" />
}`,...(j=(g=r.parameters)==null?void 0:g.docs)==null?void 0:j.source}}};var L,N,P;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'EmptyState, render',
  render: () => <EmptyState render="settle" title="No expenses yet" body="Log a bill once and TripUp keeps everyone’s balance." action="Add expense" />
}`,...(P=(N=n.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};const O=["Pill","List","Empty","Inbox","EmptyPhotos","EmptyMoney"];export{s as Empty,n as EmptyMoney,r as EmptyPhotos,a as Inbox,o as List,t as Pill,O as __namedExportsOrder,J as default};
