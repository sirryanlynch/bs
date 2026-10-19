import{j as e}from"./jsx-runtime-BYYWji4R.js";import{useMDXComponents as s}from"./index-DUy19JZU.js";import{M as i,C as r}from"./index-24M5EQ5x.js";import{LiveAnimatedFill as l}from"./Polls.stories-CbnizwLE.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./iframe-D1sWaRwD.js";import"./index-Brl4xq4Y.js";import"./index-Bhelpi4i.js";import"./poll-B0_4SqwS.js";import"./core-BrVJte4Z.js";import"./PrismRoot-DCukcACG.js";import"./data-DZbUm-sK.js";import"./scenario-Bxu_Cc4P.js";import"./_helpers-vCys1M5J.js";function t(n){const o={h1:"h1",h2:"h2",p:"p",...s(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Components/Polls/Usage"}),`
`,e.jsx(o.h1,{id:"polls-usage",children:"Polls: usage"}),`
`,e.jsx(o.p,{children:"A poll answers one question for the group. Options carry a place photo when they come from the Saved list."}),`
`,e.jsx(r,{of:l}),`
`,e.jsx(o.h2,{id:"states",children:"States"}),`
`,e.jsx(o.p,{children:`| State | Visual | When |
|---|---|---|
| Default | Grey fill to share | Any open option |
| Your vote | Iris stroke and iris fill, filled check | The option you picked |
| Leading | Iris fill and a Leading tag | Strictly most votes, poll open |
| Winner | Spectrum border and fill, one sheen | Poll closed. The only spectrum element on the screen |`}),`
`,e.jsxs("div",{className:"doc-dodont",children:[e.jsxs("div",{className:"doc-do",children:[e.jsx("b",{children:"Do"}),"Let people change their vote until the poll closes. Show Change vote, never a confirm dialog."]}),e.jsxs("div",{className:"doc-dont",children:[e.jsx("b",{children:"Don't"}),"Mark a leader on a tie. Two options at 2 votes are both default."]}),e.jsxs("div",{className:"doc-do",children:[e.jsx("b",{children:"Do"}),"Show who voted unless the poll is anonymous."]}),e.jsxs("div",{className:"doc-dont",children:[e.jsx("b",{children:"Don't"}),"Show the winner treatment before the poll closes, even at 6 of 7 votes."]})]})]})}function S(n={}){const{wrapper:o}={...s(),...n.components};return o?e.jsx(o,{...n,children:e.jsx(t,{...n})}):t(n)}export{S as default};
