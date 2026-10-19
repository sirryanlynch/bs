import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as o}from"./index-ClcD9ViR.js";import{A as Re,E as k,a as ke,C as E,c as Me,b as Le,d as Ie,e as Ue,f as A,g as Ne,h as Ye}from"./explore-DjCsv6CO.js";import{S as We}from"./stepper-B6DDe-0u.js";import{F as Ae,a as _e}from"./filterchips-CzeY2OFg.js";import{C as Be,D as Ve,O as ze}from"./pollnew-BIrbp7GV.js";import{d as Qe,C as n,S as P,D as Je}from"./beyond-uSTt4T_4.js";import{L as D}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./navghost-B2h3RIy7.js";/* empty css               */import"./icons-C2-rqUCe.js";import"./Icon-DqDER8CT.js";import"./PrismRoot-DCukcACG.js";import"./data-nxiCAWEG.js";const mr={title:"Components/Full JTBD analysis/Explore and polls",tags:["autodocs"],parameters:{docs:{description:{component:"Explore shows what other crews booked, reviewed and photographed. No likes, comments or followers. The curated list starts with how you get there (Walk, Drive or Destination), then how long, then the rest. FilterChips use the shared experience-type taxonomy in src/data/experienceTypes.ts."}}}};function b({surface:r,counts:a}){const[t,s]=o.useState("all");return e.jsx(Ae,{value:t,onChange:s,surface:r,counts:a,showCounts:r==="itinerary"})}const d={name:"FilterChips",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(D,{children:"Explore: no Travel, no counts"}),e.jsx(b,{surface:"explore"}),e.jsx(D,{children:"Itinerary: Travel included, with counts; zero-count types hide"}),e.jsx(b,{surface:"itinerary",counts:{food:3,drinks:1,culture:3,active:1,travel:0}}),e.jsx(D,{children:"Album"}),e.jsx(b,{surface:"album"})]})};function Pe(){const[r,a]=o.useState("all");return e.jsxs(e.Fragment,{children:[e.jsx(Ae,{value:r,onChange:a,surface:"explore"}),n.slice(0,6).map(t=>e.jsx(_e,{show:r==="all"||t.kind===r,children:e.jsxs("p",{style:{padding:"10px 4px",margin:0,font:"var(--type-ui-body)"},children:[t.name," ",e.jsx("small",{style:{color:"var(--color-text-tertiary)"},children:t.kind})]})},t.id))]})}const i={name:"FilterChips with FilterItem",render:()=>e.jsx(Pe,{})},c={name:"FilterChips with FilterItem, Reduce Motion",globals:{motion:"reduce"},render:()=>e.jsx(Pe,{})},l={name:"ExploreCard",render:()=>e.jsx(k,{place:n[0]})},p={name:"ExploreCard, saved and in a poll",render:()=>e.jsx(k,{place:n[2],saved:!0,inPoll:!0})},m={name:"ExploreCard, drive distance",render:()=>e.jsx(k,{place:n.find(r=>r.id==="dive"),mode:"drive"})},u={name:"ExploreFeed",render:()=>e.jsx(ke,{places:n.slice(0,4),saved:["park"]})},x={name:"ExploreFeed, nothing matches",render:()=>e.jsx(ke,{places:[]})},C={name:"CurateRing",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(E,{done:0,total:4,count:120}),e.jsx(E,{done:2,total:4,count:22}),e.jsx(E,{done:4,total:4,count:6})]})};function w({start:r}){const[a,t]=o.useState(r),s=Me(a);return e.jsxs("div",{style:{display:"grid",gap:12},children:[e.jsx(We,{steps:Le,current:A(s),onStep:T=>t(Ue(a,T)),onSkip:s<4?()=>t(Ie(a)):void 0}),s<4?e.jsxs(e.Fragment,{children:[e.jsx(Ne,{answers:a}),e.jsx(Ye,{answers:a,onAnswer:t},A(s))]}):e.jsxs(e.Fragment,{children:[e.jsx(E,{done:4,total:4,count:6}),e.jsx("button",{type:"button",className:"b-textbtn",onClick:()=>t({}),children:"Start over"})]})]})}const h={name:"CurateFlow, how are you getting there",render:()=>e.jsx(w,{start:{}})},g={name:"CurateFlow, Walk: 5, 10, 20 min",render:()=>e.jsx(w,{start:{mode:"walk"}})},y={name:"CurateFlow, Drive: 10, 20, 40 min",render:()=>e.jsx(w,{start:{mode:"drive"}})},F={name:"CurateFlow, Destination: under 1 hr, half day, day trip",render:()=>e.jsx(w,{start:{mode:"destination"}})},v={name:"AddToPoll",render:()=>e.jsx(Re,{place:"Park Rooftop",polls:Qe.filter(r=>r.status==="open")})};function qe(){const[r,a]=o.useState(P.day),[t,s]=o.useState(P.time);return e.jsx(Ve,{days:Je,day:r,time:t,onDay:a,onTime:s})}const j={name:"DayTimePicker, Tuesday 6:00 AM",render:()=>e.jsx(qe,{})};function Ge(){const[r,a]=o.useState("active");return e.jsx(Be,{value:r,onChange:a})}const S={name:"CategoryPicker",render:()=>e.jsx(Ge,{})};function He(){const[r,a]=o.useState([{label:"Dive Point Sesimbra",from:"From Explore · 4.9 · 45 min drive",photo:"./photos/px_37296507.jpg"},{label:"Arrábida coast dive",from:"Typed by you"}]),[t,s]=o.useState("Sleep in, meet at 11:00 AM");return e.jsx(ze,{options:r,draft:t,onDraft:s,onAdd:()=>{a([...r,{label:t,from:"Typed by you"}]),s("")},onRemove:T=>a(r.filter((Ke,Oe)=>Oe!==T))})}const f={name:"OptionEditor",render:()=>e.jsx(He,{})};var O,R,M;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'FilterChips',
  render: () => <>
  <Label>Explore: no Travel, no counts</Label><Chips surface="explore" />
  <Label>Itinerary: Travel included, with counts; zero-count types hide</Label><Chips surface="itinerary" counts={{
      food: 3,
      drinks: 1,
      culture: 3,
      active: 1,
      travel: 0
    }} />
  <Label>Album</Label><Chips surface="album" />
  </>
}`,...(M=(R=d.parameters)==null?void 0:R.docs)==null?void 0:M.source}}};var L,I,U;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'FilterChips with FilterItem',
  render: () => <Filtered />
}`,...(U=(I=i.parameters)==null?void 0:I.docs)==null?void 0:U.source}}};var N,Y,W;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'FilterChips with FilterItem, Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  render: () => <Filtered />
}`,...(W=(Y=c.parameters)==null?void 0:Y.docs)==null?void 0:W.source}}};var _,B,V;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'ExploreCard',
  render: () => <ExploreCard place={COMMUNITY[0]} />
}`,...(V=(B=l.parameters)==null?void 0:B.docs)==null?void 0:V.source}}};var z,Q,J;p.parameters={...p.parameters,docs:{...(z=p.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'ExploreCard, saved and in a poll',
  render: () => <ExploreCard place={COMMUNITY[2]} saved inPoll />
}`,...(J=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:J.source}}};var q,G,H;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'ExploreCard, drive distance',
  render: () => <ExploreCard place={COMMUNITY.find(p => p.id === 'dive')!} mode="drive" />
}`,...(H=(G=m.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var K,X,Z;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`{
  name: 'ExploreFeed',
  render: () => <ExploreFeed places={COMMUNITY.slice(0, 4)} saved={['park']} />
}`,...(Z=(X=u.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var $,ee,re;x.parameters={...x.parameters,docs:{...($=x.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'ExploreFeed, nothing matches',
  render: () => <ExploreFeed places={[]} />
}`,...(re=(ee=x.parameters)==null?void 0:ee.docs)==null?void 0:re.source}}};var ae,te,se;C.parameters={...C.parameters,docs:{...(ae=C.parameters)==null?void 0:ae.docs,source:{originalSource:`{
  name: 'CurateRing',
  render: () => <><CurateRing done={0} total={4} count={120} /><CurateRing done={2} total={4} count={22} /><CurateRing done={4} total={4} count={6} /></>
}`,...(se=(te=C.parameters)==null?void 0:te.docs)==null?void 0:se.source}}};var oe,ne,de;h.parameters={...h.parameters,docs:{...(oe=h.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'CurateFlow, how are you getting there',
  render: () => <Curate start={{}} />
}`,...(de=(ne=h.parameters)==null?void 0:ne.docs)==null?void 0:de.source}}};var ie,ce,le;g.parameters={...g.parameters,docs:{...(ie=g.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  name: 'CurateFlow, Walk: 5, 10, 20 min',
  render: () => <Curate start={{
    mode: 'walk'
  }} />
}`,...(le=(ce=g.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var pe,me,ue;y.parameters={...y.parameters,docs:{...(pe=y.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  name: 'CurateFlow, Drive: 10, 20, 40 min',
  render: () => <Curate start={{
    mode: 'drive'
  }} />
}`,...(ue=(me=y.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var xe,Ce,he;F.parameters={...F.parameters,docs:{...(xe=F.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  name: 'CurateFlow, Destination: under 1 hr, half day, day trip',
  render: () => <Curate start={{
    mode: 'destination'
  }} />
}`,...(he=(Ce=F.parameters)==null?void 0:Ce.docs)==null?void 0:he.source}}};var ge,ye,Fe;v.parameters={...v.parameters,docs:{...(ge=v.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: 'AddToPoll',
  render: () => <AddToPoll place="Park Rooftop" polls={POLLS.filter(p => p.status === 'open')} />
}`,...(Fe=(ye=v.parameters)==null?void 0:ye.docs)==null?void 0:Fe.source}}};var ve,je,Se;j.parameters={...j.parameters,docs:{...(ve=j.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  name: 'DayTimePicker, Tuesday 6:00 AM',
  render: () => <DT />
}`,...(Se=(je=j.parameters)==null?void 0:je.docs)==null?void 0:Se.source}}};var fe,Ee,we;S.parameters={...S.parameters,docs:{...(fe=S.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  name: 'CategoryPicker',
  render: () => <Cat />
}`,...(we=(Ee=S.parameters)==null?void 0:Ee.docs)==null?void 0:we.source}}};var Te,De,be;f.parameters={...f.parameters,docs:{...(Te=f.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  name: 'OptionEditor',
  render: () => <Opts />
}`,...(be=(De=f.parameters)==null?void 0:De.docs)==null?void 0:be.source}}};const ur=["Filter","FilterAnimated","FilterReduce","Card","CardSaved","CardDrive","Feed","FeedEmpty","Ring","CurateQ1","CurateWalk","CurateDrive","CurateDest","AddPoll","DayTime","Category","Options"];export{v as AddPoll,l as Card,m as CardDrive,p as CardSaved,S as Category,F as CurateDest,y as CurateDrive,h as CurateQ1,g as CurateWalk,j as DayTime,u as Feed,x as FeedEmpty,d as Filter,i as FilterAnimated,c as FilterReduce,f as Options,C as Ring,ur as __namedExportsOrder,mr as default};
