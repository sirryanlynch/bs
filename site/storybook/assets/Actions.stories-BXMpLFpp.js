import{j as e}from"./jsx-runtime-BYYWji4R.js";import{B as a,I as t}from"./core-DQCcUhFo.js";import{i as x}from"./Icon-C50tt4eV.js";import{L as n,R as l}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./PrismRoot-DCukcACG.js";const I={title:"Components/Actions",component:a,tags:["autodocs"],args:{label:"Send to group",variant:"primary",size:"large"},argTypes:{icon:{control:"select",options:[void 0,...x]}},parameters:{docs:{description:{component:"Pill buttons. One primary per screen. Glass is for buttons that float over photos or the celebration wash."}}}},o={name:"Button"},i={render:()=>e.jsxs(e.Fragment,{children:[e.jsx(n,{children:"Variants"}),e.jsx(a,{label:"Send to group",fullWidth:!0}),e.jsx(a,{label:"Add expense",variant:"secondary",icon:"plus",fullWidth:!0}),e.jsx(a,{label:"Share the recap",variant:"glass",icon:"share",fullWidth:!0}),e.jsx(a,{label:"Remove from trip",variant:"destructive",fullWidth:!0}),e.jsx(a,{label:"Pay a different amount",variant:"plain",fullWidth:!0}),e.jsx(n,{children:"Sizes"}),e.jsxs(l,{children:[e.jsx(a,{label:"Large"}),e.jsx(a,{label:"Medium",size:"medium"}),e.jsx(a,{label:"Small",size:"small"})]}),e.jsx(n,{children:"States"}),e.jsxs(l,{children:[e.jsx(a,{label:"Disabled",disabled:!0,size:"medium"}),e.jsx(a,{label:"Save",loading:!0,size:"medium"}),e.jsx(a,{label:"Vote",icon:"check",size:"medium",variant:"secondary"})]})]})},s={render:g=>e.jsxs(e.Fragment,{children:[e.jsx(n,{children:"Playground"}),e.jsx(l,{children:e.jsx(t,{...g})}),e.jsx(n,{children:"Variants"}),e.jsxs(l,{children:[e.jsx(t,{icon:"share",label:"Share",variant:"glass"}),e.jsx(t,{icon:"more",label:"More",variant:"tinted"}),e.jsx(t,{icon:"plus",label:"Add",variant:"filled"}),e.jsx(t,{icon:"close",label:"Close",variant:"plain"})]}),e.jsx(n,{children:"Sizes and badge"}),e.jsxs(l,{children:[e.jsx(t,{icon:"bell",label:"Activity",variant:"tinted"}),e.jsx(t,{icon:"bell",label:"Activity",badge:3}),e.jsx(t,{icon:"camera",label:"Scan receipt",size:52,variant:"filled"}),e.jsx(t,{icon:"trash",label:"Delete",disabled:!0,variant:"tinted"})]})]}),args:{icon:"personAdd",label:"Invite",variant:"glass",size:44},argTypes:{icon:{control:"select",options:x},variant:{control:"inline-radio",options:["glass","tinted","filled","plain"]},size:{control:"inline-radio",options:[36,44,52]}}};var r,c,d;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
  name: 'Button'
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var u,b,m;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <>
      <Label>Variants</Label>
      <Button label="Send to group" fullWidth />
      <Button label="Add expense" variant="secondary" icon="plus" fullWidth />
      <Button label="Share the recap" variant="glass" icon="share" fullWidth />
      <Button label="Remove from trip" variant="destructive" fullWidth />
      <Button label="Pay a different amount" variant="plain" fullWidth />
      <Label>Sizes</Label>
      <Row><Button label="Large" /><Button label="Medium" size="medium" /><Button label="Small" size="small" /></Row>
      <Label>States</Label>
      <Row><Button label="Disabled" disabled size="medium" /><Button label="Save" loading size="medium" /><Button label="Vote" icon="check" size="medium" variant="secondary" /></Row>
    </>
}`,...(m=(b=i.parameters)==null?void 0:b.docs)==null?void 0:m.source}}};var p,v,h;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: a => <>
      <Label>Playground</Label>
      <Row><IconButton {...a} /></Row>
      <Label>Variants</Label>
      <Row><IconButton icon="share" label="Share" variant="glass" /><IconButton icon="more" label="More" variant="tinted" /><IconButton icon="plus" label="Add" variant="filled" /><IconButton icon="close" label="Close" variant="plain" /></Row>
      <Label>Sizes and badge</Label>
      <Row><IconButton icon="bell" label="Activity" variant="tinted" /><IconButton icon="bell" label="Activity" badge={3} /><IconButton icon="camera" label="Scan receipt" size={52} variant="filled" /><IconButton icon="trash" label="Delete" disabled variant="tinted" /></Row>
    </>,
  args: {
    icon: 'personAdd',
    label: 'Invite',
    variant: 'glass',
    size: 44
  } as any,
  argTypes: {
    icon: {
      control: 'select',
      options: iconNames
    },
    variant: {
      control: 'inline-radio',
      options: ['glass', 'tinted', 'filled', 'plain']
    },
    size: {
      control: 'inline-radio',
      options: [36, 44, 52]
    }
  } as any
}`,...(h=(v=s.parameters)==null?void 0:v.docs)==null?void 0:h.source}}};const R=["ButtonPlayground","ButtonVariants","IconButtons"];export{o as ButtonPlayground,i as ButtonVariants,s as IconButtons,R as __namedExportsOrder,I as default};
