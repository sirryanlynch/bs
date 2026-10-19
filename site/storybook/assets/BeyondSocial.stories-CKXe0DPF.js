import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as h}from"./index-ClcD9ViR.js";import{A as ae,a as Q,S as re,G as oe,L as se,N as Z,P as ie,R as ne,b as ce,c as g,d as v,C as pe,e as le,f as S}from"./settings-CpBtPlPM.js";import{m as de,P as f,i as me,b as ue}from"./beyond-Ck7teDFp.js";import{b as ee}from"./data-BDsxFIV6.js";import{L as ge}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Co2B3eTX.js";import"./kit-3HP1EHdz.js";/* empty css               */import"./icons-BP_9ZH0s.js";import"./Icon-BrJiqn4m.js";import"./nav-POsIvLXM.js";import"./core-BmZpmJNA.js";import"./PrismRoot-DCukcACG.js";import"./settle-Bkzny66W.js";import"./solver-assets-BvNkYNQl.js";const Ie={title:"Components/Beyond tonight/Invite, recap, activity, settings",tags:["autodocs"],parameters:{docs:{description:{component:"Guest web view in a Safari frame, the recap card and map, the activity feed and actionable Lock Screen notifications, and settings rows."}}}},he=ue.map(t=>({...f[t],you:t==="ari"})),r={name:"GuestWebView in SafariFrame",parameters:{screen:"full"},render:()=>e.jsx(re,{url:"tripup.app",banner:e.jsx(Q,{}),children:e.jsx("div",{style:{paddingTop:74},children:e.jsx(oe,{children:e.jsx("p",{style:{margin:0,font:"var(--type-ui-body)"},children:"Lisbon Crew · Oct 12 to 17. Vote without installing anything."})})})})},o={name:"AppBanner",render:()=>e.jsx("div",{style:{position:"relative",height:120},children:e.jsx(Q,{})})},s={name:"RecapCard",render:()=>e.jsx(ne,{title:"Lisbon Crew",dates:"Oct 12 to 17, 2026",cover:ee.alfama,photos:me.slice(0,3).map(t=>t.src),stats:[["places","14"],["photos","212"],["spent together","$872.20"]],people:he})};function ve(){const[t,a]=h.useState(5);return e.jsx(le,{pins:S,active:t,onOpen:()=>a(te=>te%S.length+1)})}const i={name:"PlacesMap",render:()=>e.jsx(ve,{})},n={name:"StatTile",render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:8},children:[e.jsx(v,{icon:"pinLine",label:"places",value:"14"}),e.jsx(v,{icon:"images",label:"photos",value:"212"}),e.jsx(v,{icon:"poll",label:"polls decided",value:"4"})]})},c={name:"ActivityItem",render:()=>e.jsx("ul",{style:{listStyle:"none",margin:0,padding:0},children:de.slice(0,5).map(t=>e.jsx(ae,{act:t,person:f[t.who]},t.id))})};function fe(){const[t,a]=h.useState(!0);return e.jsx(Z,{title:"Tomás: Drinks after fado?",body:"Park Rooftop, Rua Nova do Carvalho, or home early. Closes 11:15 PM.",time:"9:40 PM",expanded:t,onToggle:()=>a(!t),actions:["Park Rooftop","Rua Nova do Carvalho","Home, early night"]})}const p={name:"NotificationBanner, vote actions",render:()=>e.jsx(fe,{})},l={name:"LockScreen",parameters:{screen:"full",statusLight:!0},render:()=>e.jsx(se,{time:"10:39",date:"Saturday, October 17",wallpaper:ee.alfama,children:e.jsx(Z,{title:"Ari paid you $42.00 in cash",body:"Tap to confirm you got it. The last $0.10 carries over to the next split.",time:"now",expanded:!0,actions:["Confirm $42.00","Not yet"]})})};function Se(){const[t,a]=h.useState(!0);return e.jsx(g,{icon:"sparkleX",title:"Reduce Motion",sub:"Fades instead of movement",toggle:t,onToggle:a})}const d={name:"SettingsRow",render:()=>e.jsxs(ce,{title:"App",footer:"Settings rows: value, toggle, chevron and destructive.",children:[e.jsx(g,{icon:"cardX",tone:"accent",title:"Payment methods",value:"Apple Pay",chevron:!0}),e.jsx(Se,{}),e.jsx(g,{icon:"dollar",title:"Currency",value:"USD, $"}),e.jsx(g,{icon:"signOut",title:"Sign out",destructive:!0})]})},m={name:"ProfileHeader",render:()=>e.jsx(ie,{person:f.ari,full:"Ari Lindqvist",sub:"San Francisco · on TripUp since 2024",stats:[["trips","6"],["crews","3"],["places reviewed","11"]]})};function ye(){const[t,a]=h.useState("crew");return e.jsx(pe,{label:"Default audience",value:t,onChange:a,options:[{id:"crew",title:"Crew album only",sub:"You choose public for each post",icon:"lockX"},{id:"public",title:"Ask each time",sub:"A toggle on every upload",icon:"globeX"}]})}const u={name:"ChoiceList",render:()=>e.jsxs(e.Fragment,{children:[e.jsx(ge,{children:"Privacy"}),e.jsx(ye,{})]})};var y,b,x;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'GuestWebView in SafariFrame',
  parameters: {
    screen: 'full'
  },
  render: () => <SafariFrame url="tripup.app" banner={<AppBanner />}><div style={{
      paddingTop: 74
    }}><GuestWebView><p style={{
          margin: 0,
          font: 'var(--type-ui-body)'
        }}>Lisbon Crew · Oct 12 to 17. Vote without installing anything.</p></GuestWebView></div></SafariFrame>
}`,...(x=(b=r.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var w,j,C;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'AppBanner',
  render: () => <div style={{
    position: 'relative',
    height: 120
  }}><AppBanner /></div>
}`,...(C=(j=o.parameters)==null?void 0:j.docs)==null?void 0:C.source}}};var L,A,T;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  name: 'RecapCard',
  render: () => <RecapCard title="Lisbon Crew" dates="Oct 12 to 17, 2026" cover={photo.alfama} photos={ALBUM.slice(0, 3).map(a => a.src)} stats={[['places', '14'], ['photos', '212'], ['spent together', '$872.20']]} people={ppl} />
}`,...(T=(A=s.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var P,R,k;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'PlacesMap',
  render: () => <Map />
}`,...(k=(R=i.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var B,N,G;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  name: 'StatTile',
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8
  }}><StatTile icon="pinLine" label="places" value="14" /><StatTile icon="images" label="photos" value="212" /><StatTile icon="poll" label="polls decided" value="4" /></div>
}`,...(G=(N=n.parameters)==null?void 0:N.docs)==null?void 0:G.source}}};var M,O,V;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'ActivityItem',
  render: () => <ul style={{
    listStyle: 'none',
    margin: 0,
    padding: 0
  }}>{ACTIVITY.slice(0, 5).map(a => <ActivityItem key={a.id} act={a} person={P[a.who]} />)}</ul>
}`,...(V=(O=c.parameters)==null?void 0:O.docs)==null?void 0:V.source}}};var I,$,F;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  name: 'NotificationBanner, vote actions',
  render: () => <Notif />
}`,...(F=($=p.parameters)==null?void 0:$.docs)==null?void 0:F.source}}};var U,W,H;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  name: 'LockScreen',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  render: () => <LockScreen time="10:39" date="Saturday, October 17" wallpaper={photo.alfama}><NotificationBanner title="Ari paid you $42.00 in cash" body="Tap to confirm you got it. The last $0.10 carries over to the next split." time="now" expanded actions={['Confirm $42.00', 'Not yet']} /></LockScreen>
}`,...(H=(W=l.parameters)==null?void 0:W.docs)==null?void 0:H.source}}};var X,D,E;d.parameters={...d.parameters,docs:{...(X=d.parameters)==null?void 0:X.docs,source:{originalSource:`{
  name: 'SettingsRow',
  render: () => <SettingsGroup title="App" footer="Settings rows: value, toggle, chevron and destructive."><SettingsRow icon="cardX" tone="accent" title="Payment methods" value="Apple Pay" chevron /><Toggle /><SettingsRow icon="dollar" title="Currency" value="USD, $" /><SettingsRow icon="signOut" title="Sign out" destructive /></SettingsGroup>
}`,...(E=(D=d.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var _,Y,q;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  name: 'ProfileHeader',
  render: () => <ProfileHeader person={P.ari} full="Ari Lindqvist" sub="San Francisco · on TripUp since 2024" stats={[['trips', '6'], ['crews', '3'], ['places reviewed', '11']]} />
}`,...(q=(Y=m.parameters)==null?void 0:Y.docs)==null?void 0:q.source}}};var z,J,K;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'ChoiceList',
  render: () => <><Label>Privacy</Label><Choice /></>
}`,...(K=(J=u.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};const $e=["Guest","Banner","Recap","Map_","Stats","Activity","Notification","Lock","Row","Profile","Choices"];export{c as Activity,o as Banner,u as Choices,r as Guest,l as Lock,i as Map_,p as Notification,m as Profile,s as Recap,d as Row,n as Stats,$e as __namedExportsOrder,Ie as default};
