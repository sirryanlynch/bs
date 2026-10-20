import{j as e}from"./jsx-runtime-BYYWji4R.js";import{T as i,N as l}from"./nav-DIrFENz4.js";import{a as x}from"./data-nxiCAWEG.js";import{L as n}from"./_helpers-vCys1M5J.js";import{a as L,b as j}from"./kit-C-YhQBx-.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-DqDER8CT.js";import"./core-BR5BZjX6.js";import"./PrismRoot-DCukcACG.js";/* empty css               */import"./icons-C2-rqUCe.js";import"./beyond-BM1Zjxx7.js";const O={title:"Components/Navigation",tags:["autodocs"],parameters:{docs:{description:{component:"Chrome floats as Liquid Glass above content. The large title collapses to the inline bar on scroll."}}}},a={name:"NavBar",args:{title:"Lisbon Crew",subtitle:"Oct 12 to 17",large:!0,displayTitle:!0,back:"Trips"},render:o=>e.jsxs(e.Fragment,{children:[e.jsx(l,{...o,actions:[{icon:"personAdd",label:"Invite"},{icon:"more",label:"More"}]}),e.jsx(n,{children:"Large, UI title"}),e.jsx(l,{title:"Trips",actions:[{icon:"bell",label:"Activity",badge:2}]}),e.jsx(n,{children:"Inline"}),e.jsx(l,{title:"Saturday dinner",subtitle:"5 of 7 voted",large:!1,back:"Polls",actions:[{icon:"share",label:"Share"}]})]})},r={name:"TabBar (glass)",parameters:{screen:"full",statusLight:!0},args:{active:"plan",accessory:"plus",floating:!0},argTypes:{active:{control:"inline-radio",options:["plan","explore","photos","money"]},accessory:{control:"inline-radio",options:["plus","search","none"]}},render:o=>e.jsxs("div",{className:"scr",children:[e.jsx("img",{src:x.tram,alt:"",style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}),e.jsx("div",{style:{position:"absolute",left:20,right:20,top:72,color:"#fff",font:"var(--type-ui-footnote)",textShadow:"0 1px 8px rgba(0,0,0,.4)"},children:"Glass refracts the photo underneath. Toggle Glass in the toolbar to see the Reduce Transparency fill."}),e.jsx(i,{...o})]})},s={name:"Tab bar, Home level: Trips · Explore · You",render:()=>e.jsx(i,{active:"trips",tabs:L,accessory:"plus",accessoryLabel:"Create"})},t={name:"Tab bar, Trip level: Plan · Explore · Photos · Money",render:()=>e.jsx(i,{active:"plan",tabs:j,accessory:"plus",accessoryLabel:"Create"})};var c,p,m;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'NavBar',
  args: {
    title: 'Lisbon Crew',
    subtitle: 'Oct 12 to 17',
    large: true,
    displayTitle: true,
    back: 'Trips'
  },
  render: a => <>
    <NavBar {...a} actions={[{
      icon: 'personAdd',
      label: 'Invite'
    }, {
      icon: 'more',
      label: 'More'
    }]} />
    <Label>Large, UI title</Label>
    <NavBar title="Trips" actions={[{
      icon: 'bell',
      label: 'Activity',
      badge: 2
    }]} />
    <Label>Inline</Label>
    <NavBar title="Saturday dinner" subtitle="5 of 7 voted" large={false} back="Polls" actions={[{
      icon: 'share',
      label: 'Share'
    }]} />
  </>
}`,...(m=(p=a.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var b,d,u;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'TabBar (glass)',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  args: {
    active: 'plan',
    accessory: 'plus',
    floating: true
  },
  argTypes: {
    active: {
      control: 'inline-radio',
      options: ['plan', 'explore', 'photos', 'money']
    },
    accessory: {
      control: 'inline-radio',
      options: ['plus', 'search', 'none']
    }
  },
  render: a => <div className="scr">
      <img src={photo.tram} alt="" style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }} />
      <div style={{
      position: 'absolute',
      left: 20,
      right: 20,
      top: 72,
      color: '#fff',
      font: 'var(--type-ui-footnote)',
      textShadow: '0 1px 8px rgba(0,0,0,.4)'
    }}>Glass refracts the photo underneath. Toggle Glass in the toolbar to see the Reduce Transparency fill.</div>
      <TabBar {...a} />
    </div>
}`,...(u=(d=r.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var h,v,g;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Tab bar, Home level: Trips · Explore · You',
  render: () => <TabBar active="trips" tabs={TABS_HOME as any} accessory="plus" accessoryLabel="Create" />
}`,...(g=(v=s.parameters)==null?void 0:v.docs)==null?void 0:g.source}}};var T,y,f;t.parameters={...t.parameters,docs:{...(T=t.parameters)==null?void 0:T.docs,source:{originalSource:`{
  name: 'Tab bar, Trip level: Plan · Explore · Photos · Money',
  render: () => <TabBar active="plan" tabs={TABS_TRIP as any} accessory="plus" accessoryLabel="Create" />
}`,...(f=(y=t.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};const R=["Nav","Tabs","HomeLevel","TripLevel"];export{s as HomeLevel,a as Nav,r as Tabs,t as TripLevel,R as __namedExportsOrder,O as default};
