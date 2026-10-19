import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as o}from"./index-ClcD9ViR.js";import{B as te,D as se,a as ae,M as oe,T as h,C as ie,b as pe}from"./create-BKQAmJFy.js";import{a as x,p as me,b as ne,P as ue}from"./beyond-Ck7teDFp.js";import{L as D}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               *//* empty css                */import"./stepper-CIpl7I0F.js";import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";import"./data-BDsxFIV6.js";const Be={title:"Components/Full JTBD analysis/Create trip",tags:["autodocs"],parameters:{docs:{description:{component:"The pieces of Create trip: a five-step stepper, destination search with crew-aware suggestions, a date range calendar that blocks past days, cover photos, an optional per-person budget, crew picker and the milestone moment."}}}},P=ne.map(r=>({...ue[r],you:r==="ari"})),j=["Where","When","Cover","Budget","Crew"],n={name:"TripCreateStepper",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{children:"Step 1"}),e.jsx(h,{steps:j,current:0}),e.jsx(D,{children:"Step 4"}),e.jsx(h,{steps:j,current:3})]})};function de(){const[r,s]=o.useState("Port"),[t,a]=o.useState();return e.jsx(ae,{query:r,onQuery:s,results:x,selected:t,onPick:a})}const c={name:"DestinationSearch",render:()=>e.jsx(de,{})},i={name:"DestinationSearch, suggestions",render:()=>e.jsx(ae,{query:"",results:x})};function le(){const[r,s]=o.useState({y:2027,m:2,d:11}),[t,a]=o.useState({y:2027,m:2,d:15});return e.jsx(se,{start:r,end:t,onChange:(M,ce)=>{s(M),a(ce)}})}const p={name:"DateRangePicker",render:()=>e.jsx(le,{})},m={name:"DateRangePicker, past days off",render:()=>e.jsx(se,{})};function ge(){const[r,s]=o.useState(x[0].photos[0]);return e.jsx(ie,{photos:x[0].photos,value:r,onChange:s,credit:"Photo: Hazel Montero, Pexels"})}const u={name:"CoverPicker",render:()=>e.jsx(ge,{})};function Se(){const[r,s]=o.useState(900);return e.jsx(te,{value:r,onChange:s})}const d={name:"BudgetInput",render:()=>e.jsx(Se,{})},l={name:"BudgetInput, no budget",render:()=>e.jsx(te,{value:void 0})};function Ce(){const[r,s]=o.useState(["mara","nic"]);return e.jsx(pe,{crews:[{id:"lisbon",name:"Lisbon Crew",members:P,last:"Oct 2026",photo:me.sunsetCrew}],people:P.filter(t=>t.id!=="ari"),selected:r,onToggle:t=>s(a=>a.includes(t)?a.filter(M=>M!==t):[...a,t]),onCrew:()=>s(ne.filter(t=>t!=="ari"))})}const g={name:"CrewPicker",render:()=>e.jsx(Ce,{})},S={name:"MilestoneMoment",render:()=>e.jsx(oe,{title:"Mexico City is on",sub:"Mar 11 to 15, 2027 · 7 people"})},C={name:"MilestoneMoment, Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(oe,{title:"Mexico City is on",sub:"Mar 11 to 15, 2027 · 7 people"})};var f,b,y;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  name: 'TripCreateStepper',
  render: () => <><Label>Step 1</Label><TripCreateStepper steps={STEPS} current={0} /><Label>Step 4</Label><TripCreateStepper steps={STEPS} current={3} /></>
}`,...(y=(b=n.parameters)==null?void 0:b.docs)==null?void 0:y.source}}};var R,T,k;c.parameters={...c.parameters,docs:{...(R=c.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'DestinationSearch',
  render: () => <Search />
}`,...(k=(T=c.parameters)==null?void 0:T.docs)==null?void 0:k.source}}};var v,w,B;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'DestinationSearch, suggestions',
  render: () => <DestinationSearch query="" results={DESTINATIONS} />
}`,...(B=(w=i.parameters)==null?void 0:w.docs)==null?void 0:B.source}}};var E,I,L;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'DateRangePicker',
  render: () => <Range />
}`,...(L=(I=p.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};var N,_,q;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'DateRangePicker, past days off',
  render: () => <DateRangePicker />
}`,...(q=(_=m.parameters)==null?void 0:_.docs)==null?void 0:q.source}}};var O,W,A;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'CoverPicker',
  render: () => <Cover />
}`,...(A=(W=u.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var F,Q,V;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'BudgetInput',
  render: () => <Budget />
}`,...(V=(Q=d.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var z,H,J;l.parameters={...l.parameters,docs:{...(z=l.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'BudgetInput, no budget',
  render: () => <BudgetInput value={undefined} />
}`,...(J=(H=l.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var G,K,U;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'CrewPicker',
  render: () => <Crew />
}`,...(U=(K=g.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var X,Y,Z;S.parameters={...S.parameters,docs:{...(X=S.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'MilestoneMoment',
  render: () => <MilestoneMoment title="Mexico City is on" sub="Mar 11 to 15, 2027 · 7 people" />
}`,...(Z=(Y=S.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,re;C.parameters={...C.parameters,docs:{...($=C.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'MilestoneMoment, Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <MilestoneMoment title="Mexico City is on" sub="Mar 11 to 15, 2027 · 7 people" />
}`,...(re=(ee=C.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};const Ee=["Stepper","Destination","DestinationEmpty","DateRange","DateRangeToday","CoverPhoto","Budget_","BudgetNone","CrewPicker_","Milestone","MilestoneReduce"];export{l as BudgetNone,d as Budget_,u as CoverPhoto,g as CrewPicker_,p as DateRange,m as DateRangeToday,c as Destination,i as DestinationEmpty,S as Milestone,C as MilestoneReduce,n as Stepper,Ee as __namedExportsOrder,Be as default};
