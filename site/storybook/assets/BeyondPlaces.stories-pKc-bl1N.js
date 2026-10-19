import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as s}from"./index-ClcD9ViR.js";import{P as ne,a as ce,b as re,R as ie,C as de,c as j,U as pe,d as le,e as me}from"./album-C7Fe1C3r.js";import{c as ue,r as ae,A as c,g as se,P as ge}from"./beyond-CtNlGMEr.js";import{L as v}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-GWNSd6eF.js";import"./Icon-C50tt4eV.js";import"./core-DQCcUhFo.js";import"./PrismRoot-DCukcACG.js";import"./data-D7VP6L1L.js";const Be={title:"Components/Beyond tonight/Places and album",tags:["autodocs"],parameters:{docs:{description:{component:"The place community card (gallery, ratings, been-here count, tags) opens from any place tap, including poll options. The shared album groups by day or place. Uploads tag a day and place, and each photo can also go to the public card."}}}},S=ue[0];function he(){const[r,a]=s.useState(4);return e.jsxs(e.Fragment,{children:[e.jsx(v,{children:"Display"}),e.jsx(j,{value:4.7}),e.jsx(v,{children:"Input"}),e.jsx(j,{value:r,onChange:a,size:28,label:"Your rating"})]})}const p={name:"RatingStars",render:()=>e.jsx(he,{})},l={name:"PlaceGallery",render:()=>e.jsx(ce,{photos:S.photos})},m={name:"ReviewItem",render:()=>e.jsx(e.Fragment,{children:ae(S.id).map(r=>e.jsx(ie,{r},r.id))})},u={name:"PlaceCommunityCard",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx("div",{className:"b-scroll",style:{padding:0},children:e.jsx(ne,{place:S,reviews:ae(S.id),beenThere:"You were here tonight"})})};function ye(){const[r,a]=s.useState([c[0].src]),[t,o]=s.useState(5),[n,i]=s.useState(""),[f,te]=s.useState("public");return e.jsx(de,{photos:c.slice(0,6).map(d=>d.src),picked:r,onPick:d=>a(C=>C.includes(d)?C.filter(oe=>oe!==d):[...C,d]),rating:t,onRating:o,text:n,onText:i,privacy:f,onPrivacy:te})}const g={name:"ContributeForm, privacy choice",render:()=>e.jsx(ye,{})},h={name:"PhotoGrid, by day",render:()=>e.jsx(re,{photos:c,groupBy:"day",fresh:[c[0].id]})},y={name:"PhotoGrid, by place",render:()=>e.jsx(re,{photos:c,groupBy:"place"})};function Pe(){const[r,a]=s.useState(1);return e.jsx(me,{photos:c,index:r,onIndex:a,people:ge})}const P={name:"PhotoViewer",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx(Pe,{})};function be(){const[r,a]=s.useState(["c1","c2"]);return e.jsx(pe,{roll:se,selected:r,onToggle:t=>a(o=>o.includes(t)?o.filter(n=>n!==t):[...o,t])})}const b={name:"UploadPicker",render:()=>e.jsx(be,{})};function xe(){const[r,a]=s.useState("Taberna da Rua das Flores"),[t,o]=s.useState(["c1"]);return e.jsx(le,{items:se.slice(0,3),place:r,places:["Taberna da Rua das Flores","Miradouro de Santa Catarina","Tasca do Chico"],onPlace:a,day:"Friday, Oct 16",publicIds:t,onPublic:n=>o(i=>i.includes(n)?i.filter(f=>f!==n):[...i,n])})}const x={name:"UploadTagger (upload sheet)",render:()=>e.jsx(xe,{})};var w,R,G;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'RatingStars',
  render: () => <Stars />
}`,...(G=(R=p.parameters)==null?void 0:R.docs)==null?void 0:G.source}}};var U,T,L;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'PlaceGallery',
  render: () => <PlaceGallery photos={tab.photos} />
}`,...(L=(T=l.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};var k,B,I;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'ReviewItem',
  render: () => <>{reviewsOf(tab.id).map(r => <ReviewItem key={r.id} r={r} />)}</>
}`,...(I=(B=m.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var F,M,V;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'PlaceCommunityCard',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <div className="b-scroll" style={{
    padding: 0
  }}><PlaceCommunityCard place={tab} reviews={reviewsOf(tab.id)} beenThere="You were here tonight" /></div>
}`,...(V=(M=u.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var A,O,_;g.parameters={...g.parameters,docs:{...(A=g.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'ContributeForm, privacy choice',
  render: () => <Contribute />
}`,...(_=(O=g.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var E,Y,N;h.parameters={...h.parameters,docs:{...(E=h.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'PhotoGrid, by day',
  render: () => <PhotoGrid photos={ALBUM} groupBy="day" fresh={[ALBUM[0].id]} />
}`,...(N=(Y=h.parameters)==null?void 0:Y.docs)==null?void 0:N.source}}};var z,D,q;y.parameters={...y.parameters,docs:{...(z=y.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'PhotoGrid, by place',
  render: () => <PhotoGrid photos={ALBUM} groupBy="place" />
}`,...(q=(D=y.parameters)==null?void 0:D.docs)==null?void 0:q.source}}};var H,J,K;P.parameters={...P.parameters,docs:{...(H=P.parameters)==null?void 0:H.docs,source:{originalSource:`{
  name: 'PhotoViewer',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <Viewer />
}`,...(K=(J=P.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,W,X;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'UploadPicker',
  render: () => <Picker />
}`,...(X=(W=b.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var Z,$,ee;x.parameters={...x.parameters,docs:{...(Z=x.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  name: 'UploadTagger (upload sheet)',
  render: () => <Tagger />
}`,...(ee=($=x.parameters)==null?void 0:$.docs)==null?void 0:ee.source}}};const Ie=["Rating","Gallery","Review","Card","Contribute_","Grid","GridPlace","Viewer_","Upload","UploadSheet"];export{u as Card,g as Contribute_,l as Gallery,h as Grid,y as GridPlace,p as Rating,m as Review,b as Upload,x as UploadSheet,P as Viewer_,Ie as __namedExportsOrder,Be as default};
