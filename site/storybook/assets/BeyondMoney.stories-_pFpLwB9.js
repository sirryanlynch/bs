import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as a}from"./index-ClcD9ViR.js";import{P as K,a as Q,R as z,L as U,S as V,b as X,T as Y}from"./expense-4g7vKspp.js";import{R as E,e as c,b as G,P as ee}from"./beyond-uSTt4T_4.js";import{L as ne}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";import"./data-nxiCAWEG.js";const fe={title:"Components/Full JTBD analysis/Add expense",tags:["autodocs"],parameters:{docs:{description:{component:"Receipt scan, parsed lines, assignment and split modes. Lunch at Zé da Mouraria is $185.50 plus a 10% tip ($204.05), and Ren and Nic skip the wine, so with Polvo for Mara and João they pay $16.58, and the crew owes Ari $175.60."}}}},f=G.map(n=>({...ee[n],you:n==="ari"})),x=G;function se(){const[n,s]=a.useState("aim");return a.useEffect(()=>{const o=setTimeout(()=>s("scanning"),900),i=setTimeout(()=>s("done"),3400);return()=>{clearTimeout(o),clearTimeout(i)}},[]),e.jsx(z,{phase:n,lines:c,total:E})}const d={name:"ReceiptScanner, scanning",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx("div",{style:{position:"absolute",inset:0,background:"#0E0E12"},children:e.jsx(se,{})})},m={name:"ReceiptScanner, Reduce Motion",globals:{motion:"reduce"},parameters:{screen:"full",statusLight:!0},render:()=>e.jsx("div",{style:{position:"absolute",inset:0,background:"#0E0E12"},children:e.jsx(z,{phase:"scanning",lines:c,total:E})})},u={name:"ParsedLines",render:()=>e.jsx(K,{lines:c,total:E})};function re(){const[n,s]=a.useState("item");return e.jsx(V,{value:n,onChange:s})}const l={name:"SplitModeControl",render:()=>e.jsx(re,{})};function ae(){const[n,s]=a.useState(Object.fromEntries(c.map(r=>[r.id,r.id==="wine"?x.filter(t=>t!=="ren"&&t!=="nic"):x]))),[o,i]=a.useState("wine");return e.jsx(U,{lines:c,assign:n,people:f,open:o,onOpen:i,onToggle:(r,t)=>s(p=>({...p,[r]:p[r].includes(t)?p[r].filter(H=>H!==t):[...p[r],t]}))})}const g={name:"LineItemAssigner, wine without Ren and Nic",render:()=>e.jsx(ae,{})};function te(){const[n,s]=a.useState({ari:1,mara:2,nic:1,joao:1,sofia:1,tomas:1,ren:1});return e.jsx(X,{people:f,shares:n,onChange:(o,i)=>s(r=>({...r,[o]:i}))})}const S={name:"SharesEditor",render:()=>e.jsx(te,{})};function oe(){const[n,s]=a.useState(10);return e.jsx(Y,{subtotal:E,tip:n,onTip:s})}const h={name:"TipTax",render:()=>e.jsx(oe,{})},T={name:"PerPerson",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(ne,{children:"By item, wine excluded for Ren and Nic"}),e.jsx(Q,{people:f,amounts:{ari:28.45,mara:42.76,nic:16.58,joao:42.76,sofia:28.46,tomas:28.46,ren:16.58},highlight:["nic","ren"]})]})};var R,P,L;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'ReceiptScanner, scanning',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <div style={{
    position: 'absolute',
    inset: 0,
    background: '#0E0E12'
  }}><Scan /></div>
}`,...(L=(P=d.parameters)==null?void 0:P.docs)==null?void 0:L.source}}};var j,b,A;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'ReceiptScanner, Reduce Motion',
  globals: {
    motion: 'reduce'
  },
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <div style={{
    position: 'absolute',
    inset: 0,
    background: '#0E0E12'
  }}><ReceiptScanner phase="scanning" lines={RECEIPT} total={RECEIPT_TOTAL} /></div>
}`,...(A=(b=m.parameters)==null?void 0:b.docs)==null?void 0:A.source}}};var C,M,w;u.parameters={...u.parameters,docs:{...(C=u.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'ParsedLines',
  render: () => <ParsedLines lines={RECEIPT} total={RECEIPT_TOTAL} />
}`,...(w=(M=u.parameters)==null?void 0:M.docs)==null?void 0:w.source}}};var y,I,v;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'SplitModeControl',
  render: () => <Mode />
}`,...(v=(I=l.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var O,k,N;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'LineItemAssigner, wine without Ren and Nic',
  render: () => <Assign />
}`,...(N=(k=g.parameters)==null?void 0:k.docs)==null?void 0:N.source}}};var _,$,B;S.parameters={...S.parameters,docs:{...(_=S.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'SharesEditor',
  render: () => <Shares />
}`,...(B=($=S.parameters)==null?void 0:$.docs)==null?void 0:B.source}}};var F,J,D;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'TipTax',
  render: () => <Tip />
}`,...(D=(J=h.parameters)==null?void 0:J.docs)==null?void 0:D.source}}};var W,Z,q;T.parameters={...T.parameters,docs:{...(W=T.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'PerPerson',
  render: () => <><Label>By item, wine excluded for Ren and Nic</Label><PerPerson people={ppl} amounts={{
      ari: 28.45,
      mara: 42.76,
      nic: 16.58,
      joao: 42.76,
      sofia: 28.46,
      tomas: 28.46,
      ren: 16.58
    }} highlight={['nic', 'ren']} /></>
}`,...(q=(Z=T.parameters)==null?void 0:Z.docs)==null?void 0:q.source}}};const xe=["Scanner","ScannerReduce","Lines","Modes","Assigner","SharesEd","TipAndTax","People"];export{g as Assigner,u as Lines,l as Modes,T as People,d as Scanner,m as ScannerReduce,S as SharesEd,h as TipAndTax,xe as __namedExportsOrder,fe as default};
