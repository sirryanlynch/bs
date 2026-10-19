import{j as e}from"./jsx-runtime-BYYWji4R.js";import{useMDXComponents as r}from"./index-DUy19JZU.js";import{M as i}from"./index-Cp5hQWeB.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./iframe-6YIDaQFT.js";import"./index-Brl4xq4Y.js";import"./index-Bhelpi4i.js";function s(o){const n={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Introduction"}),`
`,e.jsx(n.h1,{id:"tripup--prism",children:"TripUp · Prism"}),`
`,e.jsx(n.p,{children:"Prism is the design system for TripUp, a group trip app for iPhone. Groups decide with polls, keep one shared plan, and split costs down to the bottle of wine."}),`
`,e.jsxs(n.p,{children:["The direction is calm and native: pearl white on a soft prismatic gray, Liquid Glass for chrome only, and a single accent, ",e.jsx(n.strong,{children:"Iris #6E5BFF"}),". The celebration spectrum is held back for three moments: a poll is won, the group is all squared up, a trip milestone lands."]}),`
`,e.jsx(n.h2,{id:"how-this-storybook-is-organized",children:"How this Storybook is organized"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Foundations"})," cover color roles in both modes, the type scale, spacing, radius, glass layers, elevation, motion, icons and photography. Every swatch and sample reads straight from ",e.jsx(n.code,{children:"tokens.json"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Components"})," list each building block with controls for every variant and state. Stories render inside an iPhone 17 frame at 402 by 874 pt."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Patterns"})," compose full screens from one scenario: seven friends in Lisbon, a dinner poll, a bottle of Vinho Verde that Ren and Nic skipped, and the settle-up."]}),`
`]}),`
`,e.jsx(n.h2,{id:"toolbar",children:"Toolbar"}),`
`,e.jsxs(n.p,{children:[`| Control | What it does |
|---|---|
| Theme | Pearl (light) or Graphite Pearl (dark). Sets `,e.jsx(n.code,{children:"data-theme"}),` on the root. |
| Motion | Rich motion or Reduce Motion. Mirrors `,e.jsx(n.code,{children:"prefers-reduced-motion"}),`. |
| Glass | Liquid Glass or Reduce Transparency. Mirrors `,e.jsx(n.code,{children:"prefers-reduced-transparency"}),". |"]}),`
`,e.jsx(n.h2,{id:"tokens",children:"Tokens"}),`
`,e.jsxs(n.p,{children:["The single source is ",e.jsx(n.code,{children:"design-system/build_tokens.py"}),", which writes ",e.jsx(n.code,{children:"tokens.json"})," and ",e.jsx(n.code,{children:"tokens.css"}),". This Storybook copies both on every run (",e.jsx(n.code,{children:"npm run sync-tokens"}),"), so a change rebuilt there shows up here on the next build. Check ",e.jsx(n.code,{children:"design-system/CHANGELOG.md"})," for what moved."]}),`
`,e.jsx(n.h2,{id:"the-cast",children:"The cast"}),`
`,e.jsx(n.p,{children:"Ari (you, the organizer), Mara, Nic, João, Sofia, Tomás, and Ren, who joins halfway through planning. Prices are in dollars and every place is real."})]})}function u(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(s,{...o})}):s(o)}export{u as default};
