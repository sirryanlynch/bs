import{j as t}from"./jsx-runtime-BYYWji4R.js";import{c as o}from"./beyond-BM1Zjxx7.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./data-nxiCAWEG.js";const x={title:"Patterns/Full JTBD analysis/Photo credits",tags:["autodocs"],parameters:{docs:{description:{component:"Every photo in the Full JTBD analysis flows is from Pexels (free license). The list is the single source used by the code."}}}},e={name:"Photo credits",render:()=>t.jsxs("table",{style:{font:"13px/1.5 Inter, system-ui, sans-serif",borderCollapse:"collapse"},children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{textAlign:"left",padding:6},children:"Photo"}),t.jsx("th",{style:{textAlign:"left",padding:6},children:"Photographer"}),t.jsx("th",{style:{textAlign:"left",padding:6},children:"Subject"})]})}),t.jsx("tbody",{children:o.map(([s,l,i])=>t.jsxs("tr",{children:[t.jsx("td",{style:{padding:6},children:t.jsx("img",{src:`./photos/${s}.jpg`,alt:"",width:56,height:40,style:{objectFit:"cover",borderRadius:6}})}),t.jsxs("td",{style:{padding:6},children:[l,", Pexels #",s.replace("px_","")]}),t.jsx("td",{style:{padding:6},children:i})]},s))})]})};var n,r,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: 'Photo credits',
  render: () => <table style={{
    font: '13px/1.5 Inter, system-ui, sans-serif',
    borderCollapse: 'collapse'
  }}>
    <thead><tr><th style={{
          textAlign: 'left',
          padding: 6
        }}>Photo</th><th style={{
          textAlign: 'left',
          padding: 6
        }}>Photographer</th><th style={{
          textAlign: 'left',
          padding: 6
        }}>Subject</th></tr></thead>
    <tbody>{PHOTO_CREDITS.map(([id, who, what]) => <tr key={id}><td style={{
          padding: 6
        }}><img src={\`./photos/\${id}.jpg\`} alt="" width={56} height={40} style={{
            objectFit: 'cover',
            borderRadius: 6
          }} /></td>
        <td style={{
          padding: 6
        }}>{who}, Pexels #{id.replace('px_', '')}</td><td style={{
          padding: 6
        }}>{what}</td></tr>)}</tbody>
  </table>
}`,...(d=(r=e.parameters)==null?void 0:r.docs)==null?void 0:d.source}}};const y=["Credits"];export{e as Credits,y as __namedExportsOrder,x as default};
