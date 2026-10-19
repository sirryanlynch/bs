import{j as e}from"./jsx-runtime-BYYWji4R.js";import{M as v,C as b,B as w}from"./overlays-J1XlEogg.js";import{c as o,R as r}from"./core-BrVJte4Z.js";import{H as i}from"./screens-B9XvHkFo.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./PrismRoot-DCukcACG.js";import"./nav-GP5maQ94.js";import"./itinerary-CsoWdN48.js";import"./data-DZbUm-sK.js";import"./poll-B0_4SqwS.js";import"./untangle-DYzcEUoY.js";import"./feedback-DwpTmKgK.js";import"./scenario-Bxu_Cc4P.js";const O={title:"Components/Overlays",tags:["autodocs"],parameters:{screen:"full"}},a={name:"BottomSheet",args:{detent:"medium",title:"Add to Lisbon",scrim:!0},argTypes:{detent:{control:"inline-radio",options:["compact","medium","large"]}},render:t=>e.jsxs("div",{className:"scr",children:[e.jsx(i,{}),e.jsx(w,{...t,children:e.jsxs("div",{className:"p-group-body",children:[e.jsx(o,{leading:e.jsx(r,{icon:"receipt",tone:"owed"}),title:"Expense",subtitle:"Scan a receipt or type it in",chevron:!0}),e.jsx(o,{leading:e.jsx(r,{icon:"poll",tone:"accent"}),title:"Poll",subtitle:"Let the group decide",chevron:!0}),e.jsx(o,{leading:e.jsx(r,{icon:"calendar"}),title:"Plan item",subtitle:"Time, place, who is in",chevron:!0}),e.jsx(o,{leading:e.jsx(r,{icon:"personAdd"}),title:"Person",subtitle:"Share a code or link",chevron:!0})]})})]})},s={name:"Modal",args:{title:"Remove Ren from Lisbon?",body:"Ren owes you €18.40. Settle that first or it stays on your balance.",primary:"Remove",secondary:"Cancel",destructive:!0},render:t=>e.jsxs("div",{className:"scr",children:[e.jsx(i,{}),e.jsx(v,{...t})]})},n={name:"CelebrationOverlay",args:{kind:"squared",replayKey:0,secondaryLabel:"Share the recap"},argTypes:{kind:{control:"inline-radio",options:["squared","pollWon","milestone"]},replayKey:{control:{type:"number"},description:"Change to replay the moment"}},parameters:{docs:{description:{story:"Pearl glass card with a crafted mark: the seven threads let go, the ring closes, a check draws in. The celebration spectrum appears once, as light sweeping the card edge, then settles to a faint rim. Plays once in about 1.4 s and never blocks input. Reduce Motion shows the settled state with no movement."}}},render:t=>e.jsxs("div",{className:"scr",children:[e.jsx(i,{}),e.jsx(b,{...t})]})};var c,l,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: 'BottomSheet',
  args: {
    detent: 'medium',
    title: 'Add to Lisbon',
    scrim: true
  },
  argTypes: {
    detent: {
      control: 'inline-radio',
      options: ['compact', 'medium', 'large']
    }
  },
  render: a => <div className="scr"><HomeScreen />
      <BottomSheet {...a}>
        <div className="p-group-body">
          <ListRow leading={<RowIcon icon="receipt" tone="owed" />} title="Expense" subtitle="Scan a receipt or type it in" chevron />
          <ListRow leading={<RowIcon icon="poll" tone="accent" />} title="Poll" subtitle="Let the group decide" chevron />
          <ListRow leading={<RowIcon icon="calendar" />} title="Plan item" subtitle="Time, place, who is in" chevron />
          <ListRow leading={<RowIcon icon="personAdd" />} title="Person" subtitle="Share a code or link" chevron />
        </div>
      </BottomSheet>
    </div>
}`,...(d=(l=a.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,p,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  name: 'Modal',
  args: {
    title: 'Remove Ren from Lisbon?',
    body: 'Ren owes you €18.40. Settle that first or it stays on your balance.',
    primary: 'Remove',
    secondary: 'Cancel',
    destructive: true
  },
  render: a => <div className="scr"><HomeScreen /><Modal {...a} /></div>
}`,...(h=(p=s.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var u,y,g;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  name: 'CelebrationOverlay',
  args: {
    kind: 'squared',
    replayKey: 0,
    secondaryLabel: 'Share the recap'
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['squared', 'pollWon', 'milestone']
    },
    replayKey: {
      control: {
        type: 'number'
      },
      description: 'Change to replay the moment'
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Pearl glass card with a crafted mark: the seven threads let go, the ring closes, a check draws in. The celebration spectrum appears once, as light sweeping the card edge, then settles to a faint rim. Plays once in about 1.4 s and never blocks input. Reduce Motion shows the settled state with no movement.'
      }
    }
  },
  render: a => <div className="scr"><HomeScreen /><CelebrationOverlay {...a} /></div>
}`,...(g=(y=n.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};const H=["Sheet","Alert","Celebration"];export{s as Alert,n as Celebration,a as Sheet,H as __namedExportsOrder,O as default};
