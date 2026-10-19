import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as f}from"./index-ClcD9ViR.js";import{b as l,M as x,P as i,E as j,a as T,T as s,I as V}from"./trip-T2n8l6Mq.js";import{B as X}from"./overlays-BdHu0JRK.js";import{a as t,b as o,c as n,d as b,p as Y}from"./data-BDsxFIV6.js";import{f as Z,s as $}from"./itinerary-L5BazSJq.js";import{L as r}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Co2B3eTX.js";import"./Icon-BrJiqn4m.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";import"./solver-assets-BvNkYNQl.js";const ye={title:"Components/Trips & Places",tags:["autodocs"]},d={name:"TripCard",args:{name:"Lisbon",dates:"Oct 12 to 17",status:"upcoming",balance:-23.7,nextUp:"Poll closes 7:30 PM",size:"hero",photo:o.alfama},argTypes:{status:{control:"inline-radio",options:["upcoming","live","planning","past"]},size:{control:"inline-radio",options:["hero","compact"]},photo:{control:"select",options:Object.values(o)}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(s,{...a,people:n}),e.jsx(r,{children:"Compact"}),e.jsx(s,{size:"compact",name:"Porto",dates:"Dec 5 to 8 · planning",photo:o.tiles,people:b.slice(0,4)}),e.jsx(s,{size:"compact",name:"Sintra day",dates:"Sun Oct 25",photo:o.facade,people:b,balance:-12.5}),e.jsx(s,{size:"compact",name:"Madrid",dates:"March · wrapped",photo:o.chiado,people:b.slice(1),balance:0})]})},c={name:"TripCard · live",render:()=>e.jsx(s,{name:"Lisbon",dates:"Day 2 of 4",status:"live",photo:o.tram,people:n,nextUp:"Tram 28 in 25 min",balance:-23.7})},p={name:"PlaceCard",args:{...t.taberna,saved:!0,inPoll:!0,layout:"tall"},argTypes:{layout:{control:"inline-radio",options:["tall","row"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(i,{...a}),e.jsx(r,{children:"Grid"}),e.jsxs("div",{className:"p-place-grid",children:[e.jsx(i,{...t.ramiro}),e.jsx(i,{...t.eurico,saved:!0})]}),e.jsx(r,{children:"Row"}),e.jsx(i,{...t.graca,layout:"row"}),e.jsx(i,{...t.pink,layout:"row"})]})},m={name:"ItineraryItem",args:{time:"8:30 PM",title:"Dinner at Taberna da Rua das Flores",place:"Chiado · booked for 7",icon:"fork",kind:"decided",decidedBy:"71%",photo:t.taberna.photo},argTypes:{kind:{control:"inline-radio",options:["plan","decided","tentative","now"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx("ol",{style:{listStyle:"none",margin:0,padding:0},children:e.jsx(l,{...a,last:!0})}),e.jsx(r,{children:"Kinds"}),e.jsxs("ol",{style:{listStyle:"none",margin:0,padding:0},children:[e.jsx(l,{time:"9:30 AM",title:"Tram 28 from Martim Moniz",place:"Board at the first stop",icon:"tram",kind:"now"}),e.jsx(l,{time:"1:00 PM",title:"Lunch at Cervejaria Ramiro",place:"Intendente",icon:"fork",kind:"plan"}),e.jsx(l,{time:"11:00 PM",title:"Drinks on Pink Street",place:"Cais do Sodré",icon:"wine",kind:"tentative",last:!0})]})]})},u={name:"Timeline",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(T,{day:"Friday",date:"Oct 16",items:Z}),e.jsx(T,{day:"Saturday",date:"Oct 17",items:$})]})},y={name:"MemberPicker",args:{mode:"split"},argTypes:{mode:{control:"inline-radio",options:["split","payer"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(x,{...a,people:n}),e.jsx(r,{children:"Wine excludes Ren and Nic"}),e.jsx(x,{people:n,selected:["ari","mara","joao","sofia","tomas"]}),e.jsx(r,{children:"Who paid"}),e.jsx(x,{people:n,mode:"payer",selected:["ari"]})]})};function ee({joined:a}){const[q,v]=f.useState(!1);return f.useEffect(()=>{if(!a){v(!1);return}const H=setTimeout(()=>v(!0),1600);return()=>clearTimeout(H)},[a]),e.jsx(X,{title:"Invite",detent:"large",children:e.jsx(V,{invited:q?Y.ren:void 0})})}const h={name:"InviteSheet with QR",parameters:{screen:"full"},args:{joined:!0},render:a=>e.jsx("div",{className:"scr",children:e.jsx(ee,{joined:a.joined})})},g={name:"ExploreRing",args:{visited:7,total:12,label:"Lisbon explored",size:132},argTypes:{visited:{control:{type:"range",min:0,max:12}}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"flex",justifyContent:"center"},children:e.jsx(j,{...a})}),e.jsx(r,{children:"Progress and the completed milestone"}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-around"},children:[e.jsx(j,{visited:2,total:12,size:100,label:"Day 1"}),e.jsx(j,{visited:12,total:12,size:100,label:"All of Alfama"})]})]})};var P,C,k;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'TripCard',
  args: {
    name: 'Lisbon',
    dates: 'Oct 12 to 17',
    status: 'upcoming',
    balance: -23.7,
    nextUp: 'Poll closes 7:30 PM',
    size: 'hero',
    photo: photo.alfama
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['upcoming', 'live', 'planning', 'past']
    },
    size: {
      control: 'inline-radio',
      options: ['hero', 'compact']
    },
    photo: {
      control: 'select',
      options: Object.values(photo)
    }
  },
  render: a => <>
    <TripCard {...a} people={crewWithRen} />
    <Label>Compact</Label>
    <TripCard size="compact" name="Porto" dates="Dec 5 to 8 · planning" photo={photo.tiles} people={crew.slice(0, 4)} />
    <TripCard size="compact" name="Sintra day" dates="Sun Oct 25" photo={photo.facade} people={crew} balance={-12.5} />
    <TripCard size="compact" name="Madrid" dates="March · wrapped" photo={photo.chiado} people={crew.slice(1)} balance={0} />
  </>
}`,...(k=(C=d.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var w,I,M;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'TripCard · live',
  render: () => <TripCard name="Lisbon" dates="Day 2 of 4" status="live" photo={photo.tram} people={crewWithRen} nextUp="Tram 28 in 25 min" balance={-23.7} />
}`,...(M=(I=c.parameters)==null?void 0:I.docs)==null?void 0:M.source}}};var L,S,R;p.parameters={...p.parameters,docs:{...(L=p.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'PlaceCard',
  args: {
    ...places.taberna,
    saved: true,
    inPoll: true,
    layout: 'tall'
  },
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: ['tall', 'row']
    }
  },
  render: a => <>
    <PlaceCard {...a} />
    <Label>Grid</Label>
    <div className="p-place-grid"><PlaceCard {...places.ramiro} /><PlaceCard {...places.eurico} saved /></div>
    <Label>Row</Label>
    <PlaceCard {...places.graca} layout="row" /><PlaceCard {...places.pink} layout="row" />
  </>
}`,...(R=(S=p.parameters)==null?void 0:S.docs)==null?void 0:R.source}}};var z,D,E;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'ItineraryItem',
  args: {
    time: '8:30 PM',
    title: 'Dinner at Taberna da Rua das Flores',
    place: 'Chiado · booked for 7',
    icon: 'fork',
    kind: 'decided',
    decidedBy: '71%',
    photo: places.taberna.photo
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['plan', 'decided', 'tentative', 'now']
    }
  },
  render: a => <>
    <ol style={{
      listStyle: 'none',
      margin: 0,
      padding: 0
    }}><ItineraryItem {...a} last /></ol>
    <Label>Kinds</Label>
    <ol style={{
      listStyle: 'none',
      margin: 0,
      padding: 0
    }}>
      <ItineraryItem time="9:30 AM" title="Tram 28 from Martim Moniz" place="Board at the first stop" icon="tram" kind="now" />
      <ItineraryItem time="1:00 PM" title="Lunch at Cervejaria Ramiro" place="Intendente" icon="fork" kind="plan" />
      <ItineraryItem time="11:00 PM" title="Drinks on Pink Street" place="Cais do Sodré" icon="wine" kind="tentative" last />
    </ol>
  </>
}`,...(E=(D=m.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var O,F,W;u.parameters={...u.parameters,docs:{...(O=u.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'Timeline',
  render: () => <><Timeline day="Friday" date="Oct 16" items={friday} /><Timeline day="Saturday" date="Oct 17" items={saturday} /></>
}`,...(W=(F=u.parameters)==null?void 0:F.docs)==null?void 0:W.source}}};var A,B,N;y.parameters={...y.parameters,docs:{...(A=y.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'MemberPicker',
  args: {
    mode: 'split'
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['split', 'payer']
    }
  },
  render: a => <>
    <MemberPicker {...a} people={crewWithRen} />
    <Label>Wine excludes Ren and Nic</Label>
    <MemberPicker people={crewWithRen} selected={['ari', 'mara', 'joao', 'sofia', 'tomas']} />
    <Label>Who paid</Label>
    <MemberPicker people={crewWithRen} mode="payer" selected={['ari']} />
  </>
}`,...(N=(B=y.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var U,G,K;h.parameters={...h.parameters,docs:{...(U=h.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'InviteSheet with QR',
  parameters: {
    screen: 'full'
  },
  args: {
    joined: true
  },
  render: a => <div className="scr"><InviteDemo joined={a.joined} /></div>
}`,...(K=(G=h.parameters)==null?void 0:G.docs)==null?void 0:K.source}}};var Q,_,J;g.parameters={...g.parameters,docs:{...(Q=g.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  name: 'ExploreRing',
  args: {
    visited: 7,
    total: 12,
    label: 'Lisbon explored',
    size: 132
  },
  argTypes: {
    visited: {
      control: {
        type: 'range',
        min: 0,
        max: 12
      }
    }
  },
  render: a => <>
    <div style={{
      display: 'flex',
      justifyContent: 'center'
    }}><ExploreRing {...a} /></div>
    <Label>Progress and the completed milestone</Label>
    <div style={{
      display: 'flex',
      justifyContent: 'space-around'
    }}><ExploreRing visited={2} total={12} size={100} label="Day 1" /><ExploreRing visited={12} total={12} size={100} label="All of Alfama" /></div>
  </>
}`,...(J=(_=g.parameters)==null?void 0:_.docs)==null?void 0:J.source}}};const he=["Trip","TripLive","Place","Itinerary","Timelines","Members","Invite","Ring"];export{h as Invite,m as Itinerary,y as Members,p as Place,g as Ring,u as Timelines,d as Trip,c as TripLive,he as __namedExportsOrder,ye as default};
