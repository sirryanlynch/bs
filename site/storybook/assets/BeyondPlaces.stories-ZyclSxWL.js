import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as t,R as pe}from"./index-ClcD9ViR.js";import{P as le,a as me,b as w,R as ue,C as he,c as C,U as ge,d as ye,e as Pe}from"./album-wqswbgim.js";import{C as be,r as ne,i as n,j as ce,P as xe}from"./beyond-BM1Zjxx7.js";import{L as G}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./navghost-B2h3RIy7.js";/* empty css               */import"./icons-C2-rqUCe.js";import"./Icon-DqDER8CT.js";import"./core-BR5BZjX6.js";import"./PrismRoot-DCukcACG.js";import"./solver-assets-BvNkYNQl.js";import"./data-nxiCAWEG.js";const Ee={title:"Components/Full JTBD analysis/Places and album",tags:["autodocs"],parameters:{docs:{description:{component:"The place community card (gallery, ratings, been-here count, tags) opens from any place tap, including poll options. The shared album groups by day or place. Uploads tag a day and place, and each photo can also go to the public card."}}}},S=be[0];function fe(){const[r,o]=t.useState(4);return e.jsxs(e.Fragment,{children:[e.jsx(G,{children:"Display"}),e.jsx(C,{value:4.7}),e.jsx(G,{children:"Input"}),e.jsx(C,{value:r,onChange:o,size:28,label:"Your rating"})]})}const p={name:"RatingStars",render:()=>e.jsx(fe,{})},l={name:"PlaceGallery",render:()=>e.jsx(me,{photos:S.photos})},m={name:"ReviewItem",render:()=>e.jsx(e.Fragment,{children:ne(S.id).map(r=>e.jsx(ue,{r},r.id))})},u={name:"PlaceCommunityCard",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx("div",{className:"b-scroll",style:{padding:0},children:e.jsx(le,{place:S,reviews:ne(S.id),beenThere:"You were here tonight"})})};function Se(){const[r,o]=t.useState([n[0].src]),[a,s]=t.useState(5),[c,i]=t.useState(""),[j,ie]=t.useState("public");return e.jsx(he,{photos:n.slice(0,6).map(d=>d.src),picked:r,onPick:d=>o(v=>v.includes(d)?v.filter(de=>de!==d):[...v,d]),rating:a,onRating:s,text:c,onText:i,privacy:j,onPrivacy:ie})}const h={name:"ContributeForm, privacy choice",render:()=>e.jsx(Se,{})},g={name:"PhotoGrid, by day",render:()=>e.jsx(w,{photos:n,groupBy:"day",fresh:[n[0].id]})};function je(){const[r,o]=pe.useState();return e.jsxs(e.Fragment,{children:[e.jsx("p",{style:{margin:"0 0 8px",font:"13px var(--font-ui)"},children:r?`Showing ${r}'s photos. Tap again for all.`:"Tap a face to filter by who took it."}),e.jsx(w,{photos:r?n.filter(a=>a.who===r):n,groupBy:"day",onPerson:a=>o(s=>s===a?void 0:a)})]})}const y={name:"PhotoGrid, who took it (v5.3)",render:()=>e.jsx(je,{})},P={name:"PhotoGrid, by place",render:()=>e.jsx(w,{photos:n,groupBy:"place"})};function ve(){const[r,o]=t.useState(1);return e.jsx(Pe,{photos:n,index:r,onIndex:o,people:xe})}const b={name:"PhotoViewer",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx(ve,{})};function we(){const[r,o]=t.useState(["c1","c2"]);return e.jsx(ge,{roll:ce,selected:r,onToggle:a=>o(s=>s.includes(a)?s.filter(c=>c!==a):[...s,a])})}const x={name:"UploadPicker",render:()=>e.jsx(we,{})};function Ce(){const[r,o]=t.useState("Taberna da Rua das Flores"),[a,s]=t.useState(["c1"]);return e.jsx(ye,{items:ce.slice(0,3),place:r,places:["Taberna da Rua das Flores","Miradouro de Santa Catarina","Tasca do Chico"],onPlace:o,day:"Friday, Oct 16",publicIds:a,onPublic:c=>s(i=>i.includes(c)?i.filter(j=>j!==c):[...i,c])})}const f={name:"UploadTagger (upload sheet)",render:()=>e.jsx(Ce,{})};var R,T,U;p.parameters={...p.parameters,docs:{...(R=p.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'RatingStars',
  render: () => <Stars />
}`,...(U=(T=p.parameters)==null?void 0:T.docs)==null?void 0:U.source}}};var k,B,L;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'PlaceGallery',
  render: () => <PlaceGallery photos={tab.photos} />
}`,...(L=(B=l.parameters)==null?void 0:B.docs)==null?void 0:L.source}}};var F,I,M;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'ReviewItem',
  render: () => <>{reviewsOf(tab.id).map(r => <ReviewItem key={r.id} r={r} />)}</>
}`,...(M=(I=m.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var V,O,_;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'PlaceCommunityCard',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <div className="b-scroll" style={{
    padding: 0
  }}><PlaceCommunityCard place={tab} reviews={reviewsOf(tab.id)} beenThere="You were here tonight" /></div>
}`,...(_=(O=u.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var A,E,Y;h.parameters={...h.parameters,docs:{...(A=h.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'ContributeForm, privacy choice',
  render: () => <Contribute />
}`,...(Y=(E=h.parameters)==null?void 0:E.docs)==null?void 0:Y.source}}};var N,D,z;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'PhotoGrid, by day',
  render: () => <PhotoGrid photos={ALBUM} groupBy="day" fresh={[ALBUM[0].id]} />
}`,...(z=(D=g.parameters)==null?void 0:D.docs)==null?void 0:z.source}}};var J,W,$;y.parameters={...y.parameters,docs:{...(J=y.parameters)==null?void 0:J.docs,source:{originalSource:`{
  name: 'PhotoGrid, who took it (v5.3)',
  render: () => <ByPeople />
}`,...($=(W=y.parameters)==null?void 0:W.docs)==null?void 0:$.source}}};var q,H,K;P.parameters={...P.parameters,docs:{...(q=P.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'PhotoGrid, by place',
  render: () => <PhotoGrid photos={ALBUM} groupBy="place" />
}`,...(K=(H=P.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var Q,X,Z;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'PhotoViewer',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <Viewer />
}`,...(Z=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,re,ae;x.parameters={...x.parameters,docs:{...(ee=x.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  name: 'UploadPicker',
  render: () => <Picker />
}`,...(ae=(re=x.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var oe,se,te;f.parameters={...f.parameters,docs:{...(oe=f.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  name: 'UploadTagger (upload sheet)',
  render: () => <Tagger />
}`,...(te=(se=f.parameters)==null?void 0:se.docs)==null?void 0:te.source}}};const Ye=["Rating","Gallery","Review","Card","Contribute_","Grid","GridPeople","GridPlace","Viewer_","Upload","UploadSheet"];export{u as Card,h as Contribute_,l as Gallery,g as Grid,y as GridPeople,P as GridPlace,p as Rating,m as Review,x as Upload,f as UploadSheet,b as Viewer_,Ye as __namedExportsOrder,Ee as default};
