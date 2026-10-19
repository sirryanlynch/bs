import{j as e}from"./jsx-runtime-BYYWji4R.js";import{A as N,B as b,H as _,I as k,L as F,P as O,S as z,a as D,T as J}from"./screens-C-IjCjFX.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./nav-8hB8Vv4g.js";import"./Icon-DqDER8CT.js";import"./core-BR5BZjX6.js";import"./PrismRoot-DCukcACG.js";import"./trip-D9cq3WOX.js";import"./index-Co2B3eTX.js";import"./poll-B3Z7zCQy.js";import"./untangle-solver-DexWaXx6.js";import"./data-nxiCAWEG.js";import"./solver-assets-BvNkYNQl.js";import"./feedback-DwjjURHA.js";import"./overlays-B185WV6B.js";import"./scenario-DEvdkvjY.js";import"./itinerary-BVTkVXmg.js";const me={title:"Patterns/Lisbon scenario",parameters:{screen:"full",docs:{description:{component:"Full iPhone 17 screens for one trip: seven friends, one dinner poll, one bottle of wine Ren and Nic skipped, and the settle-up."}}}},r={name:"1 · Home, all trips",render:()=>e.jsx(_,{})},a={name:"2 · Trip group, add Ren",parameters:{statusLight:!0},render:()=>e.jsx(J,{})},n={name:"3 · Create a poll",render:()=>e.jsx(O,{})},s={name:"4 · Live poll",render:()=>e.jsx(F,{})},o={name:"5 · Itinerary with winner",render:()=>e.jsx(k,{})},t={name:"6 · Add expense, wine without Ren and Nic",render:()=>e.jsx(N,{})},p={name:"7 · Balances, simplified",render:()=>e.jsx(b,{})},c={name:"8 · Settle",render:()=>e.jsx(z,{})},i={name:"9 · All squared up",render:()=>e.jsx(D,{})};var m,d,l;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: '1 · Home, all trips',
  render: () => <S.HomeScreen />
}`,...(l=(d=r.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var u,S,x;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: '2 · Trip group, add Ren',
  parameters: {
    statusLight: true
  },
  render: () => <S.TripGroupScreen />
}`,...(x=(S=a.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var g,j,P;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: '3 · Create a poll',
  render: () => <S.PollCreateScreen />
}`,...(P=(j=n.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var L,f,w;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: '4 · Live poll',
  render: () => <S.LivePollScreen />
}`,...(w=(f=s.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var A,h,v;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: '5 · Itinerary with winner',
  render: () => <S.ItineraryWinnerScreen />
}`,...(v=(h=o.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var B,H,I;t.parameters={...t.parameters,docs:{...(B=t.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: '6 · Add expense, wine without Ren and Nic',
  render: () => <S.AddExpenseScreen />
}`,...(I=(H=t.parameters)==null?void 0:H.docs)==null?void 0:I.source}}};var T,q,y;p.parameters={...p.parameters,docs:{...(T=p.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: '7 · Balances, simplified',
  render: () => <S.BalancesScreen />
}`,...(y=(q=p.parameters)==null?void 0:q.docs)==null?void 0:y.source}}};var C,E,R;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: '8 · Settle',
  render: () => <S.SettleScreen />
}`,...(R=(E=c.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var G,U,W;i.parameters={...i.parameters,docs:{...(G=i.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: '9 · All squared up',
  render: () => <S.SquaredUpScreen />
}`,...(W=(U=i.parameters)==null?void 0:U.docs)==null?void 0:W.source}}};const de=["Home","TripGroup","PollCreate","LivePoll","ItineraryWinner","AddExpense","Balances","Settle","SquaredUp"];export{t as AddExpense,p as Balances,r as Home,o as ItineraryWinner,s as LivePoll,n as PollCreate,c as Settle,i as SquaredUp,a as TripGroup,de as __namedExportsOrder,me as default};
