import{j as e}from"./jsx-runtime-BYYWji4R.js";import{B as a,E as g,L as y,N as z,S as u,T as s}from"./feedback-DwjjURHA.js";import{a as h,p as U}from"./data-nxiCAWEG.js";import{L as m}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-DqDER8CT.js";import"./core-BR5BZjX6.js";import"./PrismRoot-DCukcACG.js";const X={title:"Components/Feedback",tags:["autodocs"]},r={name:"Toast",args:{message:"Vote changed to Cervejaria Ramiro",tone:"neutral",action:"Undo"},argTypes:{tone:{control:"inline-radio",options:["neutral","success","error"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(s,{...t}),e.jsx(m,{children:"Tones"}),e.jsx(s,{message:"Ren joined Lisbon Crew",tone:"success"}),e.jsx(s,{message:"Expense saved. Ren and Nic skip the wine.",tone:"success",action:"View"}),e.jsx(s,{message:"Could not reach MB WAY. Try again.",tone:"error",action:"Retry"})]})},o={name:"Banner",args:{title:"Nic and Ren have not voted",body:"Dinner poll closes at 7:30 PM.",tone:"accent",action:"Nudge them",onDismiss:!0},argTypes:{tone:{control:"inline-radio",options:["info","accent","warning","success"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(a,{...t}),e.jsx(m,{children:"Tones"}),e.jsx(a,{tone:"info",title:"Ramiro does not take bookings",body:"Arrive before 7:00 PM or expect a 40 minute queue."}),e.jsx(a,{tone:"warning",title:"Receipt total does not match",body:"Items add up to $248.70. You entered $284.70.",action:"Review items"}),e.jsx(a,{tone:"success",title:"João marked $64.00 received",body:"Mara is all paid up."})]})},n={name:"Notification",parameters:{screen:"full",statusLight:!0},args:{title:"Lisbon Crew",body:"Mara: Taberna is winning 3 to 1. Poll closes in 2 hours.",time:"now",stacked:2},render:t=>e.jsxs("div",{className:"scr",children:[e.jsx("div",{className:"p-lock",style:{backgroundImage:`url(${h.alfama})`}}),e.jsxs("div",{className:"p-lock-inner",children:[e.jsx("p",{className:"p-lock-date",children:"Friday October 16"}),e.jsx("p",{className:"p-lock-time",children:"9:41"}),e.jsx(z,{...t,person:U.mara})]})]})},i={name:"LiveActivity",parameters:{screen:"full",statusLight:!0},args:{kind:"poll"},argTypes:{kind:{control:"inline-radio",options:["poll","trip","settle"]}},render:t=>e.jsxs("div",{className:"scr",children:[e.jsx("div",{className:"p-lock",style:{backgroundImage:`url(${h.bridge})`}}),e.jsxs("div",{className:"p-lock-inner",children:[e.jsx("p",{className:"p-lock-date",children:"Friday October 16"}),e.jsx("p",{className:"p-lock-time",style:{marginBottom:200},children:"7:02 PM"}),e.jsx(y,{...t}),t.kind!=="trip"&&e.jsx(y,{kind:"trip"})]})]})},l={name:"EmptyState",args:{render:"itinerary",title:"Nothing planned yet",body:"Add a place, or start a poll and let the group pick the first dinner.",action:"Add to plan",secondary:"Start a poll"},argTypes:{render:{control:"inline-radio",options:["celebrate","dining","itinerary","pin","poll","settle"]}},render:t=>e.jsx(g,{...t})},c={name:"EmptyState · variants",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(g,{render:"poll",title:"No open polls",body:"When someone asks the group, it shows up here."}),e.jsx(g,{render:"settle",title:"No expenses yet",body:"Log the first one and TripUp keeps the running balance.",action:"Add expense"})]})},d={name:"Skeleton",args:{variant:"tripCard"},argTypes:{variant:{control:"inline-radio",options:["tripCard","row","poll","text"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(u,{...t}),e.jsx(m,{children:"Poll"}),e.jsx(u,{variant:"poll"}),e.jsx(m,{children:"Rows"}),e.jsx(u,{variant:"row"})]})},p={name:"LiveActivity · Dynamic Island",parameters:{screen:"full",statusLight:!0},render:()=>e.jsxs("div",{className:"scr",style:{background:"#111"},children:[e.jsx("div",{className:"p-lock",style:{backgroundImage:`url(${h.alfama})`}}),e.jsx("div",{style:{position:"absolute",top:11,left:0,right:0,zIndex:60},children:e.jsx(y,{compact:!0})}),e.jsx("p",{style:{position:"absolute",zIndex:3,left:24,right:24,bottom:120,color:"#fff",font:"var(--type-ui-footnote)",textAlign:"center"},children:"Compact Live Activity: the poll stays in the Dynamic Island while you use other apps."})]})};var v,b,x;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'Toast',
  args: {
    message: 'Vote changed to Cervejaria Ramiro',
    tone: 'neutral',
    action: 'Undo'
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'success', 'error']
    }
  },
  render: a => <>
    <Toast {...a} />
    <Label>Tones</Label>
    <Toast message="Ren joined Lisbon Crew" tone="success" />
    <Toast message="Expense saved. Ren and Nic skip the wine." tone="success" action="View" />
    <Toast message="Could not reach MB WAY. Try again." tone="error" action="Retry" />
  </>
}`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var k,j,f;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'Banner',
  args: {
    title: 'Nic and Ren have not voted',
    body: 'Dinner poll closes at 7:30 PM.',
    tone: 'accent',
    action: 'Nudge them',
    onDismiss: true
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['info', 'accent', 'warning', 'success']
    }
  },
  render: a => <>
    <Banner {...a} />
    <Label>Tones</Label>
    <Banner tone="info" title="Ramiro does not take bookings" body="Arrive before 7:00 PM or expect a 40 minute queue." />
    <Banner tone="warning" title="Receipt total does not match" body="Items add up to $248.70. You entered $284.70." action="Review items" />
    <Banner tone="success" title="João marked $64.00 received" body="Mara is all paid up." />
  </>
}`,...(f=(j=o.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};var N,L,T;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`{
  name: 'Notification',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  args: {
    title: 'Lisbon Crew',
    body: 'Mara: Taberna is winning 3 to 1. Poll closes in 2 hours.',
    time: 'now',
    stacked: 2
  },
  render: a => <div className="scr">
      <div className="p-lock" style={{
      backgroundImage: \`url(\${photo.alfama})\`
    }} />
      <div className="p-lock-inner">
        <p className="p-lock-date">Friday October 16</p>
        <p className="p-lock-time">9:41</p>
        <Notification {...a} person={P.mara} />
      </div>
    </div>
}`,...(T=(L=n.parameters)==null?void 0:L.docs)==null?void 0:T.source}}};var w,S,A;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'LiveActivity',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  args: {
    kind: 'poll'
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['poll', 'trip', 'settle']
    }
  },
  render: a => <div className="scr">
      <div className="p-lock" style={{
      backgroundImage: \`url(\${photo.bridge})\`
    }} />
      <div className="p-lock-inner">
        <p className="p-lock-date">Friday October 16</p>
        <p className="p-lock-time" style={{
        marginBottom: 200
      }}>7:02 PM</p>
        <LiveActivity {...a} />
        {a.kind !== 'trip' && <LiveActivity kind="trip" />}
      </div>
    </div>
}`,...(A=(S=i.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var R,I,E;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'EmptyState',
  args: {
    render: 'itinerary',
    title: 'Nothing planned yet',
    body: 'Add a place, or start a poll and let the group pick the first dinner.',
    action: 'Add to plan',
    secondary: 'Start a poll'
  },
  argTypes: {
    render: {
      control: 'inline-radio',
      options: ['celebrate', 'dining', 'itinerary', 'pin', 'poll', 'settle']
    }
  },
  render: a => <EmptyState {...a} />
}`,...(E=(I=l.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var C,B,M;c.parameters={...c.parameters,docs:{...(C=c.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: 'EmptyState · variants',
  render: () => <>
  <EmptyState render="poll" title="No open polls" body="When someone asks the group, it shows up here." />
  <EmptyState render="settle" title="No expenses yet" body="Log the first one and TripUp keeps the running balance." action="Add expense" />
  </>
}`,...(M=(B=c.parameters)==null?void 0:B.docs)==null?void 0:M.source}}};var $,P,F;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
  name: 'Skeleton',
  args: {
    variant: 'tripCard'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['tripCard', 'row', 'poll', 'text']
    }
  },
  render: a => <><Skeleton {...a} /><Label>Poll</Label><Skeleton variant="poll" /><Label>Rows</Label><Skeleton variant="row" /></>
}`,...(F=(P=d.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};var D,V,O;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'LiveActivity · Dynamic Island',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <div className="scr" style={{
    background: '#111'
  }}>
      <div className="p-lock" style={{
      backgroundImage: \`url(\${photo.alfama})\`
    }} />
      <div style={{
      position: 'absolute',
      top: 11,
      left: 0,
      right: 0,
      zIndex: 60
    }}><LiveActivity compact /></div>
      <p style={{
      position: 'absolute',
      zIndex: 3,
      left: 24,
      right: 24,
      bottom: 120,
      color: '#fff',
      font: 'var(--type-ui-footnote)',
      textAlign: 'center'
    }}>Compact Live Activity: the poll stays in the Dynamic Island while you use other apps.</p>
    </div>
}`,...(O=(V=p.parameters)==null?void 0:V.docs)==null?void 0:O.source}}};const Z=["Toasts","Banners","Notifications","Live","Empty","EmptyVariants","Skeletons","Island"];export{o as Banners,l as Empty,c as EmptyVariants,p as Island,i as Live,n as Notifications,d as Skeletons,r as Toasts,Z as __namedExportsOrder,X as default};
