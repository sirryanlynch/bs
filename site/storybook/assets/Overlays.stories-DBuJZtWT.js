import{j as e}from"./jsx-runtime-BYYWji4R.js";import{M as k,C as M,B as A,S as q}from"./overlays-zrBl8dVf.js";import{d as t,R as s}from"./core-DQCcUhFo.js";import{H as o}from"./screens-UxZa1BCb.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./PrismRoot-DCukcACG.js";import"./Icon-C50tt4eV.js";import"./nav-D8uPjhDa.js";import"./trip-Bss2ENuY.js";import"./index-Co2B3eTX.js";import"./poll-CrDwzyjZ.js";import"./untangle-Dh809sOn.js";import"./data-D7VP6L1L.js";import"./feedback-DbDhNK59.js";import"./scenario-BoN5LhaZ.js";import"./itinerary-DyeHMkyj.js";const D={title:"Components/Overlays",tags:["autodocs"],parameters:{screen:"full"}},a={name:"BottomSheet",args:{detent:"medium",title:"Add to Lisbon",scrim:!0},argTypes:{detent:{control:"inline-radio",options:["compact","medium","large"]}},render:r=>e.jsxs("div",{className:"scr",children:[e.jsx(o,{}),e.jsx(A,{...r,children:e.jsxs("div",{className:"p-group-body",children:[e.jsx(t,{leading:e.jsx(s,{icon:"receipt",tone:"owed"}),title:"Expense",subtitle:"Scan a receipt or type it in",chevron:!0}),e.jsx(t,{leading:e.jsx(s,{icon:"poll",tone:"accent"}),title:"Poll",subtitle:"Let the group decide",chevron:!0}),e.jsx(t,{leading:e.jsx(s,{icon:"calendar"}),title:"Plan item",subtitle:"Time, place, who is in",chevron:!0}),e.jsx(t,{leading:e.jsx(s,{icon:"personAdd"}),title:"Person",subtitle:"Share a code or link",chevron:!0})]})})]})},i={name:"Modal",args:{title:"Remove Ren from Lisbon?",body:"Ren owes you $18.40. Settle that first or it stays on your balance.",primary:"Remove",secondary:"Cancel",destructive:!0},render:r=>e.jsxs("div",{className:"scr",children:[e.jsx(o,{}),e.jsx(k,{...r})]})},n={name:"CelebrationOverlay",args:{kind:"pollWon",replayKey:0},argTypes:{kind:{control:"inline-radio",options:["squared","pollWon","milestone"]},replayKey:{control:{type:"number"},description:"Change to replay the moment"}},parameters:{docs:{description:{story:'Pearl glass card with a crafted mark. kind="squared" renders the SquaredSheet below (hi-fi 10). Plays once and never blocks input. Reduce Motion shows the settled state with no movement.'}}},render:r=>e.jsxs("div",{className:"scr",children:[e.jsx(o,{}),e.jsx(M,{...r})]})},c={name:"SquaredSheet (All squared up)",args:{replayKey:0},parameters:{docs:{description:{story:'Figma hi-fi 10. A glass sheet at 90% over a blurred scrim. The only color moment is one soft spectrum glow behind the 72 px check disc: it blooms in about 900 ms, then holds still while the check draws in. Mono receipt of the three payments, then "Share the recap". Reduce Motion: the glow is static and the sheet fades in over 200 ms.'}}},render:r=>e.jsxs("div",{className:"scr",children:[e.jsx(o,{}),e.jsx(q,{...r})]})},d={name:"SquaredSheet, cash rounding",args:{body:"3 payments, $124.40 handed over, $0.10 carried to your next split.",rows:[["Ari","Nic","$42.00","cash ✓"],["Ren","Ari","$18.40","10:40 PM"],["Mara","João","$64.00","cash ✓"]],total:["$124.40","3 of 3"]},render:r=>e.jsxs("div",{className:"scr",children:[e.jsx(o,{}),e.jsx(q,{...r})]})};var l,m,p;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var h,u,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Modal',
  args: {
    title: 'Remove Ren from Lisbon?',
    body: 'Ren owes you $18.40. Settle that first or it stays on your balance.',
    primary: 'Remove',
    secondary: 'Cancel',
    destructive: true
  },
  render: a => <div className="scr"><HomeScreen /><Modal {...a} /></div>
}`,...(y=(u=i.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var S,g,v;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  name: 'CelebrationOverlay',
  args: {
    kind: 'pollWon',
    replayKey: 0
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
        story: 'Pearl glass card with a crafted mark. kind="squared" renders the SquaredSheet below (hi-fi 10). Plays once and never blocks input. Reduce Motion shows the settled state with no movement.'
      }
    }
  },
  render: a => <div className="scr"><HomeScreen /><CelebrationOverlay {...a} /></div>
}`,...(v=(g=n.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var b,w,x;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'SquaredSheet (All squared up)',
  args: {
    replayKey: 0
  },
  parameters: {
    docs: {
      description: {
        story: 'Figma hi-fi 10. A glass sheet at 90% over a blurred scrim. The only color moment is one soft spectrum glow behind the 72 px check disc: it blooms in about 900 ms, then holds still while the check draws in. Mono receipt of the three payments, then "Share the recap". Reduce Motion: the glow is static and the sheet fades in over 200 ms.'
      }
    }
  },
  render: a => <div className="scr"><HomeScreen /><SquaredSheet {...a} /></div>
}`,...(x=(w=c.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var j,R,f;d.parameters={...d.parameters,docs:{...(j=d.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'SquaredSheet, cash rounding',
  args: {
    body: '3 payments, $124.40 handed over, $0.10 carried to your next split.',
    rows: [['Ari', 'Nic', '$42.00', 'cash ✓'], ['Ren', 'Ari', '$18.40', '10:40 PM'], ['Mara', 'João', '$64.00', 'cash ✓']],
    total: ['$124.40', '3 of 3']
  },
  render: a => <div className="scr"><HomeScreen /><SquaredSheet {...a} /></div>
}`,...(f=(R=d.parameters)==null?void 0:R.docs)==null?void 0:f.source}}};const G=["Sheet","Alert","Celebration","Squared","SquaredCash"];export{i as Alert,n as Celebration,a as Sheet,c as Squared,d as SquaredCash,G as __namedExportsOrder,D as default};
