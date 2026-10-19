import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as f}from"./index-ClcD9ViR.js";import{a as K,P,b as l,C as t}from"./poll-B0_4SqwS.js";import{d as Q,a as o}from"./data-DZbUm-sK.js";import{v as b,a as H,d as C}from"./scenario-Bxu_Cc4P.js";import{L as n}from"./_helpers-vCys1M5J.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./core-BrVJte4Z.js";import"./PrismRoot-DCukcACG.js";const le={title:"Components/Polls",tags:["autodocs"],parameters:{docs:{description:{component:"Group decisions. Fills spring to the vote share on every change. Iris marks your vote and the leader. The spectrum only appears once a poll closes on a winner."}}}},i={name:"PollOption",args:{label:"Taberna da Rua das Flores",detail:"Chiado · petiscos · €€",votes:3,total:6,state:"leading",photo:Q.taberna.photo},argTypes:{state:{control:"inline-radio",options:["default","yourVote","leading","winner"]},votes:{control:{type:"range",min:0,max:6}}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(l,{...a,voters:[o.mara,o.joao,o.sofia].slice(0,a.votes)}),e.jsx(n,{children:"Default"}),e.jsx(l,{label:"O Velho Eurico",detail:"Alfama · tasca · €€",votes:1,total:6}),e.jsx(n,{children:"Your vote"}),e.jsx(l,{label:"Cervejaria Ramiro",detail:"Intendente · seafood · €€€",votes:2,total:6,state:"yourVote",voters:[o.ari,o.nic]}),e.jsx(n,{children:"Leading"}),e.jsx(l,{label:"Taberna da Rua das Flores",detail:"Chiado · petiscos · €€",votes:3,total:6,state:"leading",voters:[o.mara,o.joao,o.sofia]}),e.jsx(n,{children:"Winner, after close"}),e.jsx(l,{label:"Taberna da Rua das Flores",detail:"Booked Fri 20:30",votes:5,total:7,state:"winner",closed:!0,voters:[o.mara,o.joao,o.sofia,o.nic,o.ren]})]})};function X(){const[a,J]=f.useState([1,0,0]);f.useEffect(()=>{const s=[[1,0,0],[2,0,0],[2,1,0],[2,1,1],[3,1,1],[3,2,1],[4,2,0]];let r=0;const h=setInterval(()=>{r=(r+1)%s.length,J(s[r])},1100);return()=>clearInterval(h)},[]);const j=a.reduce((s,r)=>s+r,0),x=Math.max(...a);return e.jsxs(e.Fragment,{children:[C.options.map((s,r)=>e.jsx(l,{label:s.label,detail:s.detail,photo:s.photo,votes:a[r],total:j,state:r===1?"yourVote":a[r]===x&&a.filter(h=>h===x).length===1?"leading":"default"},s.label)),e.jsxs("p",{className:"scr-hint tu-num",children:[j," votes in. Fills use spring.live; Reduce Motion swaps to a 200 ms ease."]})]})}const d={name:"PollOption · live fill",render:()=>e.jsx(X,{})},c={name:"PollCard",args:{status:"open",live:!1,anonymous:!1,endsInMinutes:135},argTypes:{status:{control:"inline-radio",options:["open","closed"]}},render:a=>e.jsx(P,{...a,...a.status==="closed"?H:C,voters:b,author:o.mara,yourVote:a.status==="closed"?void 0:1})},u={name:"PollCard · live votes",render:()=>e.jsx(P,{...C,voters:b,author:o.mara,live:!0,endsInMinutes:18})},m={name:"PollCard · closing soon, anonymous",render:()=>e.jsx(P,{question:"Sintra on Sunday or a beach day?",options:[{label:"Sintra, Pena Palace",detail:"40 min train from Rossio",votes:2},{label:"Costa da Caparica",detail:"35 min by bus",votes:2}],voters:b,anonymous:!0,endsInMinutes:42})},p={name:"PollCard · winner",render:()=>e.jsx(P,{...H,voters:b,author:o.mara,status:"closed"})},v={name:"PollBuilder",args:{question:"Dinner tonight?",anonymous:!1,multi:!1,closesIn:"6 hours"},render:a=>e.jsx(K,{...a})},g={name:"Countdown",args:{endsInMinutes:135,variant:"pill"},argTypes:{variant:{control:"inline-radio",options:["pill","large","inline"]}},render:a=>e.jsxs(e.Fragment,{children:[e.jsx(t,{...a}),e.jsx(n,{children:"Pill"}),e.jsx("div",{children:e.jsx(t,{endsInMinutes:135})}),e.jsx(n,{children:"Urgent, under an hour"}),e.jsx("div",{children:e.jsx(t,{endsInMinutes:18})}),e.jsx(n,{children:"Large"}),e.jsx(t,{endsInMinutes:135,variant:"large"}),e.jsx(n,{children:"Large, urgent"}),e.jsx(t,{endsInMinutes:18,variant:"large"}),e.jsx(n,{children:"Closed"}),e.jsx("div",{children:e.jsx(t,{endsInMinutes:0})})]})};var y,L,I;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  name: 'PollOption',
  args: {
    label: 'Taberna da Rua das Flores',
    detail: 'Chiado · petiscos · €€',
    votes: 3,
    total: 6,
    state: 'leading',
    photo: places.taberna.photo
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'yourVote', 'leading', 'winner']
    },
    votes: {
      control: {
        type: 'range',
        min: 0,
        max: 6
      }
    }
  },
  render: a => <>
    <PollOption {...a} voters={[P.mara, P.joao, P.sofia].slice(0, a.votes)} />
    <Label>Default</Label><PollOption label="O Velho Eurico" detail="Alfama · tasca · €€" votes={1} total={6} />
    <Label>Your vote</Label><PollOption label="Cervejaria Ramiro" detail="Intendente · seafood · €€€" votes={2} total={6} state="yourVote" voters={[P.ari, P.nic]} />
    <Label>Leading</Label><PollOption label="Taberna da Rua das Flores" detail="Chiado · petiscos · €€" votes={3} total={6} state="leading" voters={[P.mara, P.joao, P.sofia]} />
    <Label>Winner, after close</Label><PollOption label="Taberna da Rua das Flores" detail="Booked Fri 20:30" votes={5} total={7} state="winner" closed voters={[P.mara, P.joao, P.sofia, P.nic, P.ren]} />
  </>
}`,...(I=(L=i.parameters)==null?void 0:L.docs)==null?void 0:I.source}}};var M,w,F;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  name: 'PollOption · live fill',
  render: () => <LiveFill />
}`,...(F=(w=d.parameters)==null?void 0:w.docs)==null?void 0:F.source}}};var O,S,T;c.parameters={...c.parameters,docs:{...(O=c.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'PollCard',
  args: {
    status: 'open',
    live: false,
    anonymous: false,
    endsInMinutes: 135
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['open', 'closed']
    }
  },
  render: a => <PollCard {...a} {...a.status === 'closed' ? dinnerPollClosed : dinnerPoll} voters={voters} author={P.mara} yourVote={a.status === 'closed' ? undefined : 1} />
}`,...(T=(S=c.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var R,V,B;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`{
  name: 'PollCard · live votes',
  render: () => <PollCard {...dinnerPoll} voters={voters} author={P.mara} live endsInMinutes={18} />
}`,...(B=(V=u.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};var E,q,A;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  name: 'PollCard · closing soon, anonymous',
  render: () => <PollCard question="Sintra on Sunday or a beach day?" options={[{
    label: 'Sintra, Pena Palace',
    detail: '40 min train from Rossio',
    votes: 2
  }, {
    label: 'Costa da Caparica',
    detail: '35 min by bus',
    votes: 2
  }]} voters={voters} anonymous endsInMinutes={42} />
}`,...(A=(q=m.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};var D,U,k;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  name: 'PollCard · winner',
  render: () => <PollCard {...dinnerPollClosed} voters={voters} author={P.mara} status="closed" />
}`,...(k=(U=p.parameters)==null?void 0:U.docs)==null?void 0:k.source}}};var W,Y,_;v.parameters={...v.parameters,docs:{...(W=v.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'PollBuilder',
  args: {
    question: 'Dinner tonight?',
    anonymous: false,
    multi: false,
    closesIn: '6 hours'
  },
  render: a => <PollBuilder {...a} />
}`,...(_=(Y=v.parameters)==null?void 0:Y.docs)==null?void 0:_.source}}};var G,N,z;g.parameters={...g.parameters,docs:{...(G=g.parameters)==null?void 0:G.docs,source:{originalSource:`{
  name: 'Countdown',
  args: {
    endsInMinutes: 135,
    variant: 'pill'
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['pill', 'large', 'inline']
    }
  },
  render: a => <>
    <Countdown {...a} />
    <Label>Pill</Label><div><Countdown endsInMinutes={135} /></div>
    <Label>Urgent, under an hour</Label><div><Countdown endsInMinutes={18} /></div>
    <Label>Large</Label><Countdown endsInMinutes={135} variant="large" />
    <Label>Large, urgent</Label><Countdown endsInMinutes={18} variant="large" />
    <Label>Closed</Label><div><Countdown endsInMinutes={0} /></div>
  </>
}`,...(z=(N=g.parameters)==null?void 0:N.docs)==null?void 0:z.source}}};const ie=["Option","LiveAnimatedFill","Card","CardLive","CardUrgent","CardClosed","Builder","Timer"];export{v as Builder,c as Card,p as CardClosed,u as CardLive,m as CardUrgent,d as LiveAnimatedFill,i as Option,g as Timer,ie as __namedExportsOrder,le as default};
