import{j as e}from"./jsx-runtime-BYYWji4R.js";import{a as n,b as r,A as l}from"./core-BmZpmJNA.js";import{p as s,c as p}from"./data-nxiCAWEG.js";import{R as o,L as t}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Icon-BrJiqn4m.js";import"./PrismRoot-DCukcACG.js";const f={title:"Components/Identity",tags:["autodocs"],parameters:{docs:{description:{component:"Initials on a quiet tinted pearl. Tints are neutral on purpose so the iris ring can mark you without competing."}}}},c={name:"Avatar",render:a=>e.jsxs(e.Fragment,{children:[e.jsx(o,{children:e.jsx(n,{person:s[a.person],size:a.size,ring:a.ring,status:a.status})}),e.jsx(t,{children:"Everyone"}),e.jsx(o,{gap:14,children:p.map(i=>e.jsx(n,{person:i,size:44},i.id))}),e.jsx(t,{children:"Sizes"}),e.jsx(o,{gap:14,children:[24,28,36,44,56,72].map(i=>e.jsx(n,{person:s.mara,size:i},i))}),e.jsx(t,{children:"Rings and status"}),e.jsxs(o,{gap:16,children:[e.jsx(n,{person:s.ari,size:44}),e.jsx(n,{person:s.mara,size:44,ring:"leading"}),e.jsx(n,{person:s.joao,size:44,ring:"settled"}),e.jsx(n,{person:s.nic,size:44,status:"voted"}),e.jsx(n,{person:s.ren,size:44,status:"pending"})]})]}),args:{person:"ari",size:56,ring:void 0,status:"none"},argTypes:{person:{control:"select",options:Object.keys(s)},size:{control:"select",options:[24,28,36,44,56,72]},ring:{control:"select",options:[void 0,"none","you","leading","settled"]},status:{control:"inline-radio",options:["none","voted","pending"]}}},m={name:"AvatarStack",render:a=>e.jsxs(e.Fragment,{children:[e.jsx(o,{children:e.jsx(l,{people:p.slice(0,a.count),max:a.max,size:a.size})}),e.jsx(t,{children:"Sizes"}),e.jsx(l,{people:p,size:24,max:4}),e.jsx(l,{people:p,size:28,max:5}),e.jsx(l,{people:p,size:36,max:6})]}),args:{count:6,max:4,size:28},argTypes:{count:{control:{type:"range",min:1,max:6}},max:{control:{type:"range",min:1,max:6}},size:{control:"inline-radio",options:[24,28,36]}}},d={name:"BalanceChip",render:a=>e.jsxs(e.Fragment,{children:[e.jsx(o,{children:e.jsx(r,{...a})}),e.jsx(t,{children:"States"}),e.jsxs(o,{children:[e.jsx(r,{amount:42.1}),e.jsx(r,{amount:-18.4}),e.jsx(r,{amount:0})]}),e.jsx(t,{children:"Small, on cards"}),e.jsxs(o,{children:[e.jsx(r,{amount:42.1,size:"small"}),e.jsx(r,{amount:-18.4,size:"small"}),e.jsx(r,{amount:0,size:"small"})]})]}),args:{amount:42.1,size:"medium"}};var u,x,g;c.parameters={...c.parameters,docs:{...(u=c.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'Avatar',
  render: (a: any) => <>
      <Row><Avatar person={people[a.person as keyof typeof people]} size={a.size} ring={a.ring} status={a.status} /></Row>
      <Label>Everyone</Label>
      <Row gap={14}>{crewWithRen.map(p => <Avatar key={p.id} person={p} size={44} />)}</Row>
      <Label>Sizes</Label>
      <Row gap={14}>{([24, 28, 36, 44, 56, 72] as const).map(s => <Avatar key={s} person={people.mara} size={s} />)}</Row>
      <Label>Rings and status</Label>
      <Row gap={16}><Avatar person={people.ari} size={44} /><Avatar person={people.mara} size={44} ring="leading" /><Avatar person={people.joao} size={44} ring="settled" /><Avatar person={people.nic} size={44} status="voted" /><Avatar person={people.ren} size={44} status="pending" /></Row>
    </>,
  args: {
    person: 'ari',
    size: 56,
    ring: undefined,
    status: 'none'
  } as any,
  argTypes: {
    person: {
      control: 'select',
      options: Object.keys(people)
    },
    size: {
      control: 'select',
      options: [24, 28, 36, 44, 56, 72]
    },
    ring: {
      control: 'select',
      options: [undefined, 'none', 'you', 'leading', 'settled']
    },
    status: {
      control: 'inline-radio',
      options: ['none', 'voted', 'pending']
    }
  } as any
}`,...(g=(x=c.parameters)==null?void 0:x.docs)==null?void 0:g.source}}};var z,j,h;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  name: 'AvatarStack',
  render: (a: any) => <>
      <Row><AvatarStack people={crewWithRen.slice(0, a.count)} max={a.max} size={a.size} /></Row>
      <Label>Sizes</Label>
      <AvatarStack people={crewWithRen} size={24} max={4} />
      <AvatarStack people={crewWithRen} size={28} max={5} />
      <AvatarStack people={crewWithRen} size={36} max={6} />
    </>,
  args: {
    count: 6,
    max: 4,
    size: 28
  } as any,
  argTypes: {
    count: {
      control: {
        type: 'range',
        min: 1,
        max: 6
      }
    },
    max: {
      control: {
        type: 'range',
        min: 1,
        max: 6
      }
    },
    size: {
      control: 'inline-radio',
      options: [24, 28, 36]
    }
  } as any
}`,...(h=(j=m.parameters)==null?void 0:j.docs)==null?void 0:h.source}}};var v,y,R;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'BalanceChip',
  render: a => <>
      <Row><BalanceChip {...a} /></Row>
      <Label>States</Label>
      <Row><BalanceChip amount={42.1} /><BalanceChip amount={-18.4} /><BalanceChip amount={0} /></Row>
      <Label>Small, on cards</Label>
      <Row><BalanceChip amount={42.1} size="small" /><BalanceChip amount={-18.4} size="small" /><BalanceChip amount={0} size="small" /></Row>
    </>,
  args: {
    amount: 42.1,
    size: 'medium'
  }
}`,...(R=(y=d.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};const W=["AvatarPlayground","Stack","Balance"];export{c as AvatarPlayground,d as Balance,m as Stack,W as __namedExportsOrder,f as default};
