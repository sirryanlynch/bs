import{j as e}from"./jsx-runtime-BYYWji4R.js";import{F as t,T as i,L as o,c as s,R as r,S as m,d as n,e as g,A as x}from"./core-BrVJte4Z.js";import{a as b}from"./data-DZbUm-sK.js";import{R as j,L as l}from"./_helpers-vCys1M5J.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./PrismRoot-DCukcACG.js";const J={title:"Components/Inputs",tags:["autodocs"]},c={name:"SegmentedControl",args:{options:["Balances","Activity","Settle"],glass:!1},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(m,{...a}),e.jsx(l,{children:"Two options"}),e.jsx(m,{options:["Upcoming","Past"]}),e.jsx(l,{children:"Glass, over content"}),e.jsx(m,{options:["List","Map","Day"],value:"Map",glass:!0})]})},d={name:"FilterChip",args:{label:"Food",selected:!0,count:8,dismissible:!1},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(j,{children:e.jsx(t,{...a})}),e.jsx(l,{children:"Filter row"}),e.jsxs("div",{className:"p-chips",children:[e.jsx(t,{label:"All",selected:!0}),e.jsx(t,{label:"Food",icon:"fork",count:8}),e.jsx(t,{label:"Drinks",icon:"wine",count:3}),e.jsx(t,{label:"Stay",icon:"bed"}),e.jsx(t,{label:"Getting around",icon:"tram"})]}),e.jsx(l,{children:"Selected, dismissible"}),e.jsxs(j,{children:[e.jsx(t,{label:"Paid by Mara",selected:!0,dismissible:!0}),e.jsx(t,{label:"Excludes me",selected:!0,dismissible:!0})]})]})},p={name:"TextField & Search",args:{label:"What was it for?",placeholder:"Dinner, taxi, tickets",kind:"text"},argTypes:{kind:{control:"inline-radio",options:["text","search","amount"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(i,{...a}),e.jsx(l,{children:"Search"}),e.jsx(i,{kind:"search",placeholder:"Search Lisbon places"}),e.jsx(i,{kind:"search",value:"Ramiro"}),e.jsx(l,{children:"States"}),e.jsx(i,{label:"Trip name",value:"Lisbon Crew",helper:"Everyone sees this name"}),e.jsx(i,{label:"Amount",prefix:"€",value:"186,40",error:"That is more than the receipt total of €162.40"}),e.jsx(i,{label:"Booking ref",value:"TP-4471",disabled:!0}),e.jsx(l,{children:"Amount entry"}),e.jsx(i,{kind:"amount",prefix:"€",value:"186.40",helper:"Dinner at O Velho Eurico"})]})},u={name:"Toggle & Stepper",args:{checked:!0,label:"Anonymous votes"},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(j,{children:e.jsx(n,{...a})}),e.jsxs(o,{header:"Poll settings",children:[e.jsx(s,{title:"Anonymous votes",subtitle:"Hide who picked what",trailing:e.jsx(n,{checked:!0,label:"Anonymous votes"})}),e.jsx(s,{title:"Allow several picks",trailing:e.jsx(n,{label:"Allow several picks"})}),e.jsx(s,{title:"Lock after close",trailing:e.jsx(n,{checked:!0,disabled:!0,label:"Lock after close"})})]}),e.jsxs(o,{header:"Split by shares",children:[e.jsx(s,{leading:e.jsx(x,{person:b.mara,size:36,ring:"none"}),title:"Mara",subtitle:"Brought her sister",trailing:e.jsx(g,{value:2,label:"Mara shares"})}),e.jsx(s,{leading:e.jsx(x,{person:b.joao,size:36,ring:"none"}),title:"João",trailing:e.jsx(g,{value:1,min:0,label:"João shares"})}),e.jsx(s,{leading:e.jsx(x,{person:b.nic,size:36,ring:"none"}),title:"Nic",subtitle:"Skipping this one",trailing:e.jsx(g,{value:0,label:"Nic shares"})})]})]})},h={name:"ListRow",args:{title:"Notifications",subtitle:"Polls, payments and plan changes",chevron:!0},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(o,{children:e.jsx(s,{...a,leading:e.jsx(r,{icon:"bell"})})}),e.jsxs(o,{header:"Trip",footer:"Members can add plans and expenses. Only Ari can remove people.",children:[e.jsx(s,{leading:e.jsx(r,{icon:"calendar",tone:"accent"}),title:"Dates",value:"12 to 17 Oct",chevron:!0}),e.jsx(s,{leading:e.jsx(r,{icon:"pin"}),title:"Base",value:"Alfama",chevron:!0}),e.jsx(s,{leading:e.jsx(r,{icon:"wallet",tone:"owed"}),title:"Currency",value:"EUR",chevron:!0}),e.jsx(s,{leading:e.jsx(r,{icon:"personAdd"}),title:"Invite people",chevron:!0})]}),e.jsx(o,{children:e.jsx(s,{title:"Leave trip",destructive:!0,onClick:()=>{}})})]})};var v,L,w;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  name: 'SegmentedControl',
  args: {
    options: ['Balances', 'Activity', 'Settle'],
    glass: false
  },
  render: a => <>
    <SegmentedControl {...a} />
    <Label>Two options</Label><SegmentedControl options={['Upcoming', 'Past']} />
    <Label>Glass, over content</Label><SegmentedControl options={['List', 'Map', 'Day']} value="Map" glass />
  </>
}`,...(w=(L=c.parameters)==null?void 0:L.docs)==null?void 0:w.source}}};var S,k,R;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'FilterChip',
  args: {
    label: 'Food',
    selected: true,
    count: 8,
    dismissible: false
  },
  render: a => <>
    <Row><FilterChip {...a} /></Row>
    <Label>Filter row</Label>
    <div className="p-chips"><FilterChip label="All" selected /><FilterChip label="Food" icon="fork" count={8} /><FilterChip label="Drinks" icon="wine" count={3} /><FilterChip label="Stay" icon="bed" /><FilterChip label="Getting around" icon="tram" /></div>
    <Label>Selected, dismissible</Label>
    <Row><FilterChip label="Paid by Mara" selected dismissible /><FilterChip label="Excludes me" selected dismissible /></Row>
  </>
}`,...(R=(k=d.parameters)==null?void 0:k.docs)==null?void 0:R.source}}};var F,f,T;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`{
  name: 'TextField & Search',
  args: {
    label: 'What was it for?',
    placeholder: 'Dinner, taxi, tickets',
    kind: 'text'
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['text', 'search', 'amount']
    }
  },
  render: a => <>
    <TextField {...a} />
    <Label>Search</Label>
    <TextField kind="search" placeholder="Search Lisbon places" />
    <TextField kind="search" value="Ramiro" />
    <Label>States</Label>
    <TextField label="Trip name" value="Lisbon Crew" helper="Everyone sees this name" />
    <TextField label="Amount" prefix="€" value="186,40" error="That is more than the receipt total of €162.40" />
    <TextField label="Booking ref" value="TP-4471" disabled />
    <Label>Amount entry</Label>
    <TextField kind="amount" prefix="€" value="186.40" helper="Dinner at O Velho Eurico" />
  </>
}`,...(T=(f=p.parameters)==null?void 0:f.docs)==null?void 0:T.source}}};var A,y,C;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: 'Toggle & Stepper',
  args: {
    checked: true,
    label: 'Anonymous votes'
  },
  render: a => <>
    <Row><Toggle {...a} /></Row>
    <ListGroup header="Poll settings">
      <ListRow title="Anonymous votes" subtitle="Hide who picked what" trailing={<Toggle checked label="Anonymous votes" />} />
      <ListRow title="Allow several picks" trailing={<Toggle label="Allow several picks" />} />
      <ListRow title="Lock after close" trailing={<Toggle checked disabled label="Lock after close" />} />
    </ListGroup>
    <ListGroup header="Split by shares">
      <ListRow leading={<Avatar person={people.mara} size={36} ring="none" />} title="Mara" subtitle="Brought her sister" trailing={<Stepper value={2} label="Mara shares" />} />
      <ListRow leading={<Avatar person={people.joao} size={36} ring="none" />} title="João" trailing={<Stepper value={1} min={0} label="João shares" />} />
      <ListRow leading={<Avatar person={people.nic} size={36} ring="none" />} title="Nic" subtitle="Skipping this one" trailing={<Stepper value={0} label="Nic shares" />} />
    </ListGroup>
  </>
}`,...(C=(y=u.parameters)==null?void 0:y.docs)==null?void 0:C.source}}};var G,M,D;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'ListRow',
  args: {
    title: 'Notifications',
    subtitle: 'Polls, payments and plan changes',
    chevron: true
  },
  render: a => <>
    <ListGroup><ListRow {...a} leading={<RowIcon icon="bell" />} /></ListGroup>
    <ListGroup header="Trip" footer="Members can add plans and expenses. Only Ari can remove people.">
      <ListRow leading={<RowIcon icon="calendar" tone="accent" />} title="Dates" value="12 to 17 Oct" chevron />
      <ListRow leading={<RowIcon icon="pin" />} title="Base" value="Alfama" chevron />
      <ListRow leading={<RowIcon icon="wallet" tone="owed" />} title="Currency" value="EUR" chevron />
      <ListRow leading={<RowIcon icon="personAdd" />} title="Invite people" chevron />
    </ListGroup>
    <ListGroup>
      <ListRow title="Leave trip" destructive onClick={() => {}} />
    </ListGroup>
  </>
}`,...(D=(M=h.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};const U=["Segmented","Chips","Fields","Switches","Rows"];export{d as Chips,p as Fields,h as Rows,c as Segmented,u as Switches,U as __namedExportsOrder,J as default};
