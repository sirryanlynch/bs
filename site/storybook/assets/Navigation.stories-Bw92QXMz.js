import{j as e}from"./jsx-runtime-BYYWji4R.js";import{N as s,T as b}from"./nav-GP5maQ94.js";import{p as m}from"./data-DZbUm-sK.js";import{L as r}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./core-BrVJte4Z.js";import"./PrismRoot-DCukcACG.js";const j={title:"Components/Navigation",tags:["autodocs"],parameters:{docs:{description:{component:"Chrome floats as Liquid Glass above content. The large title collapses to the inline bar on scroll."}}}},t={name:"NavBar",args:{title:"Lisbon Crew",subtitle:"12 to 17 Oct",large:!0,displayTitle:!0,back:"Trips"},render:o=>e.jsxs(e.Fragment,{children:[e.jsx(s,{...o,actions:[{icon:"personAdd",label:"Invite"},{icon:"more",label:"More"}]}),e.jsx(r,{children:"Large, UI title"}),e.jsx(s,{title:"Trips",actions:[{icon:"bell",label:"Activity",badge:2}]}),e.jsx(r,{children:"Inline"}),e.jsx(s,{title:"Dinner tonight?",subtitle:"5 of 7 voted",large:!1,back:"Polls",actions:[{icon:"share",label:"Share"}]})]})},a={name:"TabBar (glass)",parameters:{screen:"full",statusLight:!0},args:{active:"polls",accessory:"plus",floating:!0},argTypes:{active:{control:"inline-radio",options:["trips","polls","plan","money"]},accessory:{control:"inline-radio",options:["plus","search","none"]}},render:o=>e.jsxs("div",{className:"scr",children:[e.jsx("img",{src:m.tram,alt:"",style:{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}),e.jsx("div",{style:{position:"absolute",left:20,right:20,top:72,color:"#fff",font:"var(--type-ui-footnote)",textShadow:"0 1px 8px rgba(0,0,0,.4)"},children:"Glass refracts the photo underneath. Toggle Glass in the toolbar to see the Reduce Transparency fill."}),e.jsx(b,{...o})]})};var i,l,n;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  name: 'NavBar',
  args: {
    title: 'Lisbon Crew',
    subtitle: '12 to 17 Oct',
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
    <NavBar title="Dinner tonight?" subtitle="5 of 7 voted" large={false} back="Polls" actions={[{
      icon: 'share',
      label: 'Share'
    }]} />
  </>
}`,...(n=(l=t.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};var c,p,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'TabBar (glass)',
  parameters: {
    screen: 'full',
    statusLight: true
  },
  args: {
    active: 'polls',
    accessory: 'plus',
    floating: true
  },
  argTypes: {
    active: {
      control: 'inline-radio',
      options: ['trips', 'polls', 'plan', 'money']
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
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};const L=["Nav","Tabs"];export{t as Nav,a as Tabs,L as __namedExportsOrder,j as default};
