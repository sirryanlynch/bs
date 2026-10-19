import{j as e}from"./jsx-runtime-BYYWji4R.js";import{r as at,a as ot,E as H,b as it,s as lt,P as z,R as ct,S as dt,c as mt,D as ge}from"./untangle-CkJVSUHu.js";import{r as K}from"./index-ClcD9ViR.js";import{C as ut,a as pt,A as we}from"./solver-assets-BvNkYNQl.js";import{k as ht,I as yt,N as gt,l as xt}from"./settle-s3IQ9SJw.js";import{B as ft}from"./overlays-BdHu0JRK.js";import{L as ye}from"./core-BmZpmJNA.js";import{a as i,c as bt}from"./data-D7VP6L1L.js";import{w as vt}from"./scenario-D4CcUfgj.js";import{L as et}from"./_helpers-vCys1M5J.js";import"./Icon-BrJiqn4m.js";import"./PrismRoot-DCukcACG.js";import"./_commonjsHelpers-Cpj98o6Y.js";const R=(t,s=0,m=1)=>Math.min(m,Math.max(s,t)),U=t=>(t=R(t),1-Math.pow(1-t,3)),wt=t=>t>.004?"+":t<-.004?"−":"",jt=t=>wt(t)+Math.abs(t).toFixed(2),Q=(t,s)=>Math.hypot(t[0]-s[0],t[1]-s[1]),je=(t,s,m,b,n)=>{const c=1-n;return[c*c*c*t[0]+3*c*c*n*s[0]+3*c*n*n*m[0]+n*n*n*b[0],c*c*c*t[1]+3*c*c*n*s[1]+3*c*n*n*m[1]+n*n*n*b[1]]};function kt(t,s,m,b){const n=(s[0]-t[0])*(b[1]-m[1])-(s[1]-t[1])*(b[0]-m[0]);if(Math.abs(n)<1e-9)return null;const c=((m[0]-t[0])*(b[1]-m[1])-(m[1]-t[1])*(b[0]-m[0]))/n,u=((m[0]-t[0])*(s[1]-t[1])-(m[1]-t[1])*(s[0]-t[0]))/n;return c>=0&&c<=1&&u>=0&&u<=1?[t[0]+c*(s[0]-t[0]),t[1]+c*(s[1]-t[1])]:null}const re=(t,s)=>Math.max(0,Math.min(t.x+t.w,s.x+s.w)-Math.max(t.x,s.x))*Math.max(0,Math.min(t.y+t.h,s.y+s.h)-Math.max(t.y,s.y));function St(t){const{graph:s,pos:m,ids:b,W:n,CX:c,CY:u}=t,$=[],P=14,N=b.map(h=>({x:m[h][0]-21,y:m[h][1]-21,w:42,h:42})),g=s.lab1.map(h=>({x:h.x-2,y:h.y-2,w:h.w+4,h:h.h+4})),E={x:c-11,y:u-17,w:22,h:22},k=s.solvedG.map(({g:h})=>h.poly);return s.solvedG.map(({e:h,g:v})=>{const w=`$${h.amt.toFixed(2)}`,x=w.length*6+12;let y=null,d=1/0;for(let T=0;T<=8;T++){const F=Math.round((.38+T*.03)*(v.poly.length-1)),W=v.poly[F],A=v.poly[Math.min(v.poly.length-1,F+1)],G=v.poly[Math.max(0,F-1)],C=A[0]-G[0],D=A[1]-G[1],L=Math.hypot(C,D)||1,B=-D/L,S=C/L;for(const X of[1,-1])for(const _ of[10,12,15,18]){const q=Math.abs(B)*x/2+Math.abs(S)*P/2,J=W[0]+B*X*(_+q-6),I=W[1]+S*X*(_+q-6),a={x:J-x/2,y:I-P/2,w:x,h:P};let j=Math.abs(T-4)*.6+_*.15;N.forEach(f=>j+=re(a,f)*50),g.forEach(f=>j+=re(a,f)*50),$.forEach(f=>j+=re(a,{x:f.x-3,y:f.y-3,w:f.w+6,h:f.h+6})*50),j+=re(a,E)*20,k.forEach(f=>f.forEach(M=>{M[0]>a.x-2&&M[0]<a.x+x+2&&M[1]>a.y-2&&M[1]<a.y+P+2&&(j+=40)})),(a.x<6||a.x+x>n-6||a.y<28||a.y+P>202)&&(j+=1e3),j<d&&(d=j,y=a)}}return $.push(y),{x:y.x,y:y.y,w:x,label:w}})}const ke=[6,-5,4,-7,5,-4],ne=40;function Rt(t){const{raw:s,pos:m,ids:b,CX:n,CY:c}=t,u=[n,c],$=s.map((g,E)=>{const k=m[g.from],h=m[g.to],v=Q(k,h)||1,w=[(h[0]-k[0])/v,(h[1]-k[1])/v],x=[-w[1],w[0]],y=[k[0]+w[0]*21,k[1]+w[1]*21],d=[h[0]-w[0]*21,h[1]-w[1]*21],T=b.filter(a=>a!==g.from&&a!==g.to).map(a=>m[a]),F=ke[E%ke.length],W=a=>{const j=[(y[0]+d[0])/2,(y[1]+d[1])/2],f=[j[0]+(u[0]-j[0])*a,j[1]+(u[1]-j[1])*a],M=[y[0]+(f[0]-y[0])*.667+x[0]*F,y[1]+(f[1]-y[1])*.667+x[1]*F],O=[d[0]+(f[0]-d[0])*.667-x[0]*F*.5,d[1]+(f[1]-d[1])*.667-x[1]*F*.5];return[M,O]};let A=null,G=1/0;for(let a=.6;a>=-.301;a-=.05){const[j,f]=W(a);let M=!0,O=1/0;for(let Y=1;Y<40;Y++){const se=je(y,j,f,d,Y/40);if(T.some(xe=>Q(xe,se)<25)){M=!1;break}O=Math.min(O,Q(se,u))}if(!M)continue;const te=O+Math.abs(a-.45)*10;te<G&&(G=te,A=[j,f])}const[C,D]=A??W(.1),L=[d[0]-D[0],d[1]-D[1]],B=Math.hypot(L[0],L[1])||1,S=[L[0]/B,L[1]/B],X=[d[0]-S[0]*5,d[1]-S[1]*5],_=[D[0]-S[0]*5,D[1]-S[1]*5],q=[];for(let a=0;a<=48;a++)q.push(je(y,C,D,d,a/48));let J=0;for(let a=1;a<q.length;a++)J+=Q(q[a-1],q[a]);const I=a=>`${a[0].toFixed(2)} ${a[1].toFixed(2)}`;return{d:`M${I(y)} C${I(C)} ${I(_)} ${I(X)}`,tip:d,dir:S,w:g.amt>=30?2:1.25,len:J,poly:q}}),P=b.map(g=>m[g]),N=[];for(let g=0;g<$.length;g++)for(let E=g+1;E<$.length;E++){const k=$[g].poly,h=$[E].poly;for(let v=1;v<k.length;v++)for(let w=1;w<h.length;w++){const x=kt(k[v-1],k[v],h[w-1],h[w]);x&&!P.some(y=>Q(y,x)<24)&&!N.some(y=>Q(y,x)<4)&&N.push(x)}}return{threads:$,knots:N}}function Nt(t,s,m){const b=m>=2?3.2:2.6,n=t[0]-s[0]*6,c=t[1]-s[1]*6,u=-s[1],$=s[0];return`M${t[0].toFixed(2)} ${t[1].toFixed(2)} L${(n+u*b).toFixed(2)} ${(c+$*b).toFixed(2)} L${(n-u*b).toFixed(2)} ${(c-$*b).toFixed(2)} Z`}function tt({frame:t}){const{t:s,intro:m,phase:b,reduce:n,playing:c,uid:u,W:$,H:P,CX:N,CY:g,ids:E,pos:k,people:h,net:v,raw:w,simple:x,graph:y,stats:d}=t,T=K.useMemo(()=>Rt(t),[w,k]),F=K.useMemo(()=>St(t),[x,k]),[W,A]=K.useState(0),G=K.useRef(s);K.useEffect(()=>{const r=n?1.99:1.83;c&&G.current<r&&s>=r&&A(o=>o+1),s<1.5&&A(0),G.current=s},[s,c,n]);const[C,D]=K.useState(!1),L=K.useRef(null);K.useEffect(()=>{var o;const r=!!((o=L.current)!=null&&o.closest(".theme-dark"));r!==C&&D(r)});const B=n?1-R(s):1-U(s/.31),S=n?R(s)*(1-R(s-1)):U((s-.19)/.3)*(1-U((s-1)/.22)),X=n?1:.9+.1*U((s-.19)/.4),_=r=>n?1:U((s-.31-r*.067)/.5),q=n?S:R((s-.81)/.15)*(1-U((s-1)/.22)),J=r=>n?R(s-1):s>=1.999?1:U((s-1.2-r*.1)/.55),I=r=>n?R(s-1):s>=1.999?1:R((s-1.2-r*.1-.55)/.05),a=n?R(s-1):U((s-1.2)/.6),j=r=>n?1:U((m*840-r*40)/400),f=n?1:R((m*840-600)/200),M=n?1:U((s-.31)/.6),O=r=>Math.abs(v[r]??0)<.005?1-.6*a:1,te=E.filter(r=>Math.abs(v[r]??0)>.004).sort((r,o)=>Math.abs(v[o])-Math.abs(v[r])),Y=g-4,se=r=>{const[o,p]=k[r],l=N-o,V=Y-p,Z=Math.hypot(l,V)||1,be=l/Z,ve=V/Z;return{x1:o+be*22,y1:p+ve*22,x2:N-be*20,y2:Y-ve*20,len:Math.max(1,Z-42)}},xe=[[["IOUS",e.jsxs(e.Fragment,{children:[e.jsx("tspan",{children:d.ious}),e.jsxs("tspan",{className:"p-ut-sub",dx:"6",children:[d.people," people"]})]})],["CROSSINGS",e.jsxs(e.Fragment,{children:[e.jsx("tspan",{children:T.knots.length}),e.jsx("tspan",{className:"p-ut-sub",dx:"6",children:"knots"})]})],["FLOW",e.jsxs("tspan",{children:["$",d.flowRaw.toFixed(2)]})]],[["Σ NET",e.jsxs(e.Fragment,{children:[e.jsx("tspan",{children:Math.abs(d.sigma).toFixed(2)}),e.jsx("tspan",{className:"p-ut-ok",dx:"5",children:Math.abs(d.sigma)<.005?"✓":"!"})]})],["OWED",e.jsxs("tspan",{className:"p-ut-owed",children:["+",d.owed.toFixed(2)]})],["OWE",e.jsxs("tspan",{className:"p-ut-owe",children:["−",d.owed.toFixed(2)]})]],[["PAYMENTS",e.jsxs(e.Fragment,{children:[e.jsx("tspan",{children:x.length}),e.jsxs("tspan",{className:"p-ut-sub",dx:"6",children:["was ",w.length]})]})],["FLOW",e.jsxs("tspan",{children:["$",d.flowSimple.toFixed(2)]})],["SAVED",e.jsxs(e.Fragment,{children:[e.jsxs("tspan",{className:"p-ut-acc",children:[d.saved,"%"]}),e.jsxs("tspan",{className:"p-ut-sub",dx:"6",children:[w.length-x.length," fewer"]})]})]]],fe=[1-R((s-.3)/.4),R((s-.3)/.4)*(1-R((s-1.3)/.4)),R((s-1.3)/.4)],st=["TANGLED","NETTING","SOLVED"],ee=[16,125,236],rt=1-R(s/.4),nt=R(s/.4);return e.jsxs("svg",{ref:L,viewBox:`0 0 ${$} ${P}`,width:"100%",className:"p-ut-svg p-us",role:"img","aria-label":t.summary,children:[e.jsxs("defs",{children:[e.jsx("clipPath",{id:`card${u}`,children:e.jsx("rect",{width:$,height:P,rx:20})}),e.jsx("clipPath",{id:`cp${u}`,children:e.jsx("circle",{r:16})}),e.jsx("filter",{id:`b40${u}`,x:"-50%",y:"-50%",width:"200%",height:"200%",children:e.jsx("feGaussianBlur",{stdDeviation:"20"})}),e.jsx("filter",{id:`b16${u}`,x:"-50%",y:"-50%",width:"200%",height:"200%",children:e.jsx("feGaussianBlur",{stdDeviation:"8"})}),e.jsx("filter",{id:`b50${u}`,x:"-50%",y:"-50%",width:"200%",height:"200%",children:e.jsx("feGaussianBlur",{stdDeviation:"25"})}),e.jsx("filter",{id:`b5${u}`,x:"-80%",y:"-80%",width:"260%",height:"260%",children:e.jsx("feGaussianBlur",{stdDeviation:"2.5"})}),e.jsx("filter",{id:`md${u}`,x:"-40%",y:"-40%",width:"180%",height:"180%",children:e.jsx("feDropShadow",{dx:"0",dy:"2",stdDeviation:"3",floodColor:"#141233",floodOpacity:".10"})})]}),e.jsxs("g",{clipPath:`url(#card${u})`,className:"p-us-field","aria-hidden":!0,children:[e.jsx("ellipse",{cx:N,cy:64,rx:110,ry:60,className:"p-us-pearl",filter:`url(#b40${u})`}),S>.01&&e.jsx("circle",{cx:N,cy:Y,r:32,className:"p-us-halo",opacity:S,filter:`url(#b16${u})`}),a>.01&&e.jsx("ellipse",{cx:N,cy:g,rx:120,ry:75,className:"p-us-solglow",opacity:a,filter:`url(#b50${u})`})]}),B>.01&&e.jsxs("g",{opacity:B,children:[T.threads.map((r,o)=>{const p=j(o);return e.jsxs("g",{children:[e.jsx("path",{d:r.d,className:"p-us-thread",strokeWidth:r.w,strokeDasharray:p<1?`${r.len*p} ${r.len}`:void 0}),p>=.98&&e.jsx("path",{d:Nt(r.tip,r.dir,r.w),className:"p-us-head"})]},`t${o}`)}),T.knots.map((r,o)=>e.jsx("circle",{cx:r[0],cy:r[1],r:3,className:"p-us-knot",opacity:f},`k${o}`))]}),S>.01&&e.jsx("g",{opacity:S,children:te.map((r,o)=>{const p=se(r),l=_(o);return l>.01&&e.jsx("line",{x1:p.x1,y1:p.y1,x2:p.x2,y2:p.y2,className:"p-us-spoke",strokeDasharray:l<1?`${p.len*l} ${p.len}`:void 0},`sp${r}`)})}),y.solvedG.map(({g:r},o)=>{const p=J(o);return p>.001&&e.jsxs("g",{opacity:n?p:1,children:[e.jsx("path",{d:r.d,className:"p-us-arc",strokeDasharray:!n&&p<1?`${r.len*p} ${r.len}`:void 0}),(n||p>=.99)&&e.jsx("path",{d:ot(r.tip,r.dir,2.25),className:"p-us-arrow"})]},`s${o}`)}),S>.01&&e.jsx("g",{opacity:S,transform:`translate(${N} ${Y}) scale(${X})`,children:e.jsx("image",{href:C?ut:pt,x:-ne/2,y:-ne/2,width:ne,height:ne,className:n?"":"p-us-core"})}),E.map(r=>{const[o,p]=k[r];return e.jsxs("g",{transform:`translate(${o} ${p})`,opacity:O(r),children:[e.jsx("circle",{r:18,className:"p-us-disc",filter:`url(#md${u})`}),we[r]?e.jsx("image",{href:we[r],x:-16,y:-16,width:32,height:32,clipPath:`url(#cp${u})`,preserveAspectRatio:"xMidYMid slice"}):e.jsx("text",{dy:"4.3",textAnchor:"middle",className:"p-ut-mono",children:h[r].initials}),e.jsx("circle",{r:17.5,className:"p-us-ring"})]},r)}),[[y.lab0,rt],[y.lab1,nt]].map(([r,o],p)=>o>.01&&e.jsx("g",{opacity:o,children:r.map(l=>{const V=l.net?jt((v[l.id]??0)*M):"",Z=`p-ut-net is-${l.tone}`;return e.jsxs("g",{opacity:O(l.id),children:[e.jsx("rect",{x:l.x,y:l.y,width:l.w,height:l.h,rx:4,className:"p-us-plate"}),l.stacked?e.jsxs(e.Fragment,{children:[e.jsx("text",{x:l.x+4,y:l.y+11,className:"p-us-name",children:l.name}),e.jsx("text",{x:l.x+4,y:l.y+23,className:Z,children:V})]}):e.jsxs("text",{x:l.x+4,y:l.y+10.5,className:"p-us-name",children:[l.name,l.net&&e.jsx("tspan",{dx:"6",className:Z,children:V})]})]},l.id)})},`L${p}`)),q>.01&&e.jsxs("g",{opacity:q,children:[e.jsx("rect",{x:N-26,y:g+20-1,width:52,height:15,rx:7.5,className:"p-us-sigbg"}),e.jsxs("text",{x:N,y:g+30,textAnchor:"middle",className:"p-us-sigma",children:["Σ ",Math.abs(d.sigma).toFixed(2)]})]}),F.map((r,o)=>I(o)>.01&&e.jsxs("g",{opacity:I(o),children:[e.jsx("rect",{x:r.x,y:r.y,width:r.w,height:14,rx:7,className:"p-us-tag"}),e.jsx("text",{x:r.x+r.w/2,y:r.y+10.3,textAnchor:"middle",className:"p-us-tagtx",children:r.label})]},`tg${o}`)),W>0&&e.jsx("g",{transform:`translate(${N} ${g-6})`,"aria-hidden":!0,children:e.jsxs("g",{className:n?"p-us-glint is-static":"p-us-glint",children:[e.jsxs("g",{filter:`url(#b5${u})`,opacity:".85",children:[e.jsx("circle",{cx:-3,cy:-2,r:6,fill:"#FFB8D9"}),e.jsx("circle",{cx:3,cy:-2,r:6,fill:"#FFD6B0"}),e.jsx("circle",{cx:0,cy:3,r:6,fill:"#B8E6FF"})]}),e.jsx("path",{d:"M0 -7 L1.96 -1.96 L7 0 L1.96 1.96 L0 7 L-1.96 1.96 L-7 0 L-1.96 -1.96 Z",className:"p-us-star"})]})},W),e.jsx("g",{className:"p-ut-stepper",children:st.map((r,o)=>e.jsxs("g",{className:b===o?"is-on":"",transform:`translate(${ee[o]} 18)`,children:[e.jsx("circle",{cx:3,cy:0,r:2.5,className:"p-ut-stepdot"}),e.jsx("text",{x:10,y:3.6,className:"p-ut-steptx",children:`0${o+1} ${r}`}),o<2&&e.jsx("line",{x1:ee[o+1]-ee[o]-20,x2:ee[o+1]-ee[o]-8,y1:0,y2:0,className:"p-ut-hair"})]},r))}),e.jsxs("g",{transform:"translate(16 206)",children:[e.jsx("rect",{width:330,height:50,rx:12,className:"p-ut-panel p-us-panel"}),e.jsx("line",{x1:110,x2:110,y1:8,y2:42,className:"p-ut-div"}),e.jsx("line",{x1:220,x2:220,y1:8,y2:42,className:"p-ut-div"}),xe.map((r,o)=>fe[o]>.01&&e.jsx("g",{opacity:fe[o],children:r.map(([p,l],V)=>e.jsxs("g",{transform:`translate(${V*110+17} 0)`,children:[e.jsx("text",{y:20,className:"p-ut-cap",children:p}),e.jsx("text",{y:38,className:"p-ut-val",children:l})]},V))},o))]})]})}at("solver",tt);tt.__docgenInfo={description:"",methods:[],displayName:"SolverSkin",props:{frame:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  t: number; intro: number; phase: UntanglePhase; reduce: boolean; playing: boolean; uid: string; W: number; H: number; CX: number; CY: number;
  ids: string[]; pos: Record<string, Pt>; people: Record<string, Person>; net: Record<string, number>; maxNet: number;
  raw: Edge[]; simple: Edge[]; graph: { tangled: { e: Edge; g: any }[]; solvedG: { e: Edge; g: any }[]; knots: Pt[]; lab0: any; lab1: any; tags0: any; tags2: any };
  stats: { ious: number; people: number; crossings: number; flowRaw: number; flowSimple: number; sigma: number; owed: number; saved: number; netsHold: boolean };
  summary: string;
}`,signature:{properties:[{key:"t",value:{name:"number",required:!0}},{key:"intro",value:{name:"number",required:!0}},{key:"phase",value:{name:"union",raw:"0 | 1 | 2",elements:[{name:"literal",value:"0"},{name:"literal",value:"1"},{name:"literal",value:"2"}],required:!0}},{key:"reduce",value:{name:"boolean",required:!0}},{key:"playing",value:{name:"boolean",required:!0}},{key:"uid",value:{name:"string",required:!0}},{key:"W",value:{name:"number",required:!0}},{key:"H",value:{name:"number",required:!0}},{key:"CX",value:{name:"number",required:!0}},{key:"CY",value:{name:"number",required:!0}},{key:"ids",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!0}},{key:"pos",value:{name:"Record",elements:[{name:"string"},{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}],raw:"Record<string, Pt>",required:!0}},{key:"people",value:{name:"Record",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ id: string; name: string; initials: string; you?: boolean; tone: number }",signature:{properties:[{key:"id",value:{name:"string",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"initials",value:{name:"string",required:!0}},{key:"you",value:{name:"boolean",required:!1}},{key:"tone",value:{name:"number",required:!0}}]}}],raw:"Record<string, Person>",required:!0}},{key:"net",value:{name:"Record",elements:[{name:"string"},{name:"number"}],raw:"Record<string, number>",required:!0}},{key:"maxNet",value:{name:"number",required:!0}},{key:"raw",value:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ from: string; to: string; amt: number }",signature:{properties:[{key:"from",value:{name:"string",required:!0}},{key:"to",value:{name:"string",required:!0}},{key:"amt",value:{name:"number",required:!0}}]},required:!0}],raw:"Edge[]",required:!0}},{key:"simple",value:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ from: string; to: string; amt: number }",signature:{properties:[{key:"from",value:{name:"string",required:!0}},{key:"to",value:{name:"string",required:!0}},{key:"amt",value:{name:"number",required:!0}}]},required:!0}],raw:"Edge[]",required:!0}},{key:"graph",value:{name:"signature",type:"object",raw:"{ tangled: { e: Edge; g: any }[]; solvedG: { e: Edge; g: any }[]; knots: Pt[]; lab0: any; lab1: any; tags0: any; tags2: any }",signature:{properties:[{key:"tangled",value:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ e: Edge; g: any }",signature:{properties:[{key:"e",value:{name:"signature",type:"object",raw:"{ from: string; to: string; amt: number }",signature:{properties:[{key:"from",value:{name:"string",required:!0}},{key:"to",value:{name:"string",required:!0}},{key:"amt",value:{name:"number",required:!0}}]},required:!0}},{key:"g",value:{name:"any",required:!0}}]}}],raw:"{ e: Edge; g: any }[]",required:!0}},{key:"solvedG",value:{name:"Array",elements:[{name:"signature",type:"object",raw:"{ e: Edge; g: any }",signature:{properties:[{key:"e",value:{name:"signature",type:"object",raw:"{ from: string; to: string; amt: number }",signature:{properties:[{key:"from",value:{name:"string",required:!0}},{key:"to",value:{name:"string",required:!0}},{key:"amt",value:{name:"number",required:!0}}]},required:!0}},{key:"g",value:{name:"any",required:!0}}]}}],raw:"{ e: Edge; g: any }[]",required:!0}},{key:"knots",value:{name:"Array",elements:[{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}],raw:"Pt[]",required:!0}},{key:"lab0",value:{name:"any",required:!0}},{key:"lab1",value:{name:"any",required:!0}},{key:"tags0",value:{name:"any",required:!0}},{key:"tags2",value:{name:"any",required:!0}}]},required:!0}},{key:"stats",value:{name:"signature",type:"object",raw:"{ ious: number; people: number; crossings: number; flowRaw: number; flowSimple: number; sigma: number; owed: number; saved: number; netsHold: boolean }",signature:{properties:[{key:"ious",value:{name:"number",required:!0}},{key:"people",value:{name:"number",required:!0}},{key:"crossings",value:{name:"number",required:!0}},{key:"flowRaw",value:{name:"number",required:!0}},{key:"flowSimple",value:{name:"number",required:!0}},{key:"sigma",value:{name:"number",required:!0}},{key:"owed",value:{name:"number",required:!0}},{key:"saved",value:{name:"number",required:!0}},{key:"netsHold",value:{name:"boolean",required:!0}}]},required:!0}},{key:"summary",value:{name:"string",required:!0}}]}},description:""}}};const Gt={title:"Components/Money",tags:["autodocs"],parameters:{docs:{description:{component:"Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up."}}}},ae={name:"ExpenseRow",args:{title:"Vinho Verde (bottle) × 2",amount:38,share:7.6,date:"Fri",category:"wine",state:"default",splitCount:5},argTypes:{state:{control:"inline-radio",options:["default","youExcluded","pending","settled"]},category:{control:"select",options:["fork","wine","bed","tram","plane","receipt"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(ye,{children:e.jsx(H,{...t,payer:i.ari,excluded:[i.ren,i.nic]})}),e.jsx(et,{children:"States"}),e.jsxs(ye,{children:[e.jsx(H,{title:"Dinner, Taberna da Rua das Flores",payer:i.ari,amount:248.7,share:37.7,date:"Fri",category:"fork"}),e.jsx(H,{title:"Vinho Verde (bottle) × 2",payer:i.mara,amount:38,share:7.6,date:"Sat",category:"wine",excluded:[i.ren,i.nic],splitCount:5}),e.jsx(H,{title:"Ginjinha round",payer:i.joao,amount:14,date:"Fri",category:"wine",state:"youExcluded",excluded:[i.ari]}),e.jsx(H,{title:"Alfama flat, 3 nights",payer:i.sofia,amount:612,share:102,date:"Oct 2",category:"bed"}),e.jsx(H,{title:"Uber from LIS",payer:i.nic,amount:22.4,date:"Just now",category:"tram",state:"pending"}),e.jsx(H,{title:"Tram 28 day passes",payer:i.ren,amount:38.4,share:6.4,date:"Settled",category:"tram",state:"settled"})]})]})},oe={name:"ReceiptSplit",args:{venue:"Taberna da Rua das Flores",tip:0},render:t=>e.jsx(ct,{...t,lines:vt,members:bt})},ie={name:"DebtSimplify",args:{simplified:!1,autoplay:!0},render:t=>e.jsx(mt,{...t}),parameters:{docs:{description:{story:"Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only."}}}},le={name:"DebtUntangle (v4 Instrument)",args:{solved:!1,controls:"full",startButton:!0,skin:"instrument"},argTypes:{controls:{control:"inline-radio",options:["full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"],description:"Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin()."}},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(ge,{...t})}),parameters:{docs:{description:{story:"Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step."}}}},ce={name:"DebtUntangle (v5.1 Solver, restraint pass)",args:{solved:!1,controls:"full",startButton:!0,skin:"solver"},argTypes:{controls:{control:"inline-radio",options:["full","inline","none"]},skin:{control:"inline-radio",options:["solver","instrument"]}},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(ge,{...t})}),parameters:{docs:{description:{story:"The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star."}}}},de={name:"DebtUntangle, inline controls (Money screen)",args:{solved:!1,controls:"inline",startButton:!1,skin:"solver"},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(ge,{...t})})},me={name:"DebtUntangle, solved",args:{solved:!0,controls:"inline",skin:"solver"},render:t=>e.jsx("div",{style:{maxWidth:362},children:e.jsx(ge,{...t})})},ue={name:"Money v4 logs and rows",render:()=>e.jsxs("div",{style:{maxWidth:362,display:"grid",gap:12},children:[e.jsx(ht,{net:-23.7,caption:"2 IOUs: you owe Tomás $42.10. Ren owes you $18.40."}),e.jsx(yt,{raw:it,people:i}),e.jsx(gt,{nets:{nic:42.1,joao:64,sofia:0,tomas:0,ren:-18.4,ari:-23.7,mara:-64},people:i}),e.jsx(xt,{plan:lt,people:i})]})},pe={name:"PaymentRow",args:{amount:42.1,state:"due",method:"MB WAY"},argTypes:{state:{control:"inline-radio",options:["due","sending","paid","requested"]}},render:t=>e.jsxs(e.Fragment,{children:[e.jsx(ye,{children:e.jsx(z,{...t,from:i.nic,to:i.ari})}),e.jsx(et,{children:"States"}),e.jsxs(ye,{children:[e.jsx(z,{from:i.nic,to:i.ari,amount:42.1,state:"due"}),e.jsx(z,{from:i.ari,to:i.joao,amount:12.5,state:"due",method:"Sintra train tickets"}),e.jsx(z,{from:i.mara,to:i.joao,amount:64,state:"sending"}),e.jsx(z,{from:i.ren,to:i.ari,amount:18.4,state:"paid",method:"Revolut"}),e.jsx(z,{from:i.nic,to:i.ari,amount:42.1,state:"requested"})]})]})},he={name:"SettleSheet",parameters:{screen:"full"},args:{amount:42.1,method:"MB WAY",state:"review"},argTypes:{method:{control:"inline-radio",options:["MB WAY","Apple Pay","Revolut","Cash"]},state:{control:"inline-radio",options:["review","sent"]}},render:t=>e.jsx("div",{className:"scr",children:e.jsx(ft,{title:"Settle up",detent:"compact",children:e.jsx(dt,{...t,from:i.nic,to:i.ari})})})};var Se,Re,Ne;ae.parameters={...ae.parameters,docs:{...(Se=ae.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: 'ExpenseRow',
  args: {
    title: 'Vinho Verde (bottle) × 2',
    amount: 38,
    share: 7.6,
    date: 'Fri',
    category: 'wine',
    state: 'default',
    splitCount: 5
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['default', 'youExcluded', 'pending', 'settled']
    },
    category: {
      control: 'select',
      options: ['fork', 'wine', 'bed', 'tram', 'plane', 'receipt']
    }
  },
  render: a => <>
    <ListGroup><ExpenseRow {...a} payer={P.ari} excluded={[P.ren, P.nic]} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <ExpenseRow title="Dinner, Taberna da Rua das Flores" payer={P.ari} amount={248.7} share={37.7} date="Fri" category="fork" />
      <ExpenseRow title="Vinho Verde (bottle) × 2" payer={P.mara} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
      <ExpenseRow title="Ginjinha round" payer={P.joao} amount={14} date="Fri" category="wine" state="youExcluded" excluded={[P.ari]} />
      <ExpenseRow title="Alfama flat, 3 nights" payer={P.sofia} amount={612} share={102} date="Oct 2" category="bed" />
      <ExpenseRow title="Uber from LIS" payer={P.nic} amount={22.4} date="Just now" category="tram" state="pending" />
      <ExpenseRow title="Tram 28 day passes" payer={P.ren} amount={38.4} share={6.4} date="Settled" category="tram" state="settled" />
    </ListGroup>
  </>
}`,...(Ne=(Re=ae.parameters)==null?void 0:Re.docs)==null?void 0:Ne.source}}};var $e,qe,Me;oe.parameters={...oe.parameters,docs:{...($e=oe.parameters)==null?void 0:$e.docs,source:{originalSource:`{
  name: 'ReceiptSplit',
  args: {
    venue: 'Taberna da Rua das Flores',
    tip: 0
  },
  render: a => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />
}`,...(Me=(qe=oe.parameters)==null?void 0:qe.docs)==null?void 0:Me.source}}};var Pe,Ee,Te;ie.parameters={...ie.parameters,docs:{...(Pe=ie.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  name: 'DebtSimplify',
  args: {
    simplified: false,
    autoplay: true
  },
  render: a => <DebtSimplify {...a} />,
  parameters: {
    docs: {
      description: {
        story: 'Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only.'
      }
    }
  }
}`,...(Te=(Ee=ie.parameters)==null?void 0:Ee.docs)==null?void 0:Te.source}}};var Fe,De,Le;le.parameters={...le.parameters,docs:{...(Fe=le.parameters)==null?void 0:Fe.docs,source:{originalSource:`{
  name: 'DebtUntangle (v4 Instrument)',
  args: {
    solved: false,
    controls: 'full',
    startButton: true,
    skin: 'instrument'
  },
  argTypes: {
    controls: {
      control: 'inline-radio',
      options: ['full', 'inline', 'none']
    },
    skin: {
      control: 'inline-radio',
      options: ['solver', 'instrument'],
      description: 'Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin().'
    }
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>,
  parameters: {
    docs: {
      description: {
        story: 'Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step.'
      }
    }
  }
}`,...(Le=(De=le.parameters)==null?void 0:De.docs)==null?void 0:Le.source}}};var Ue,Ie,We;ce.parameters={...ce.parameters,docs:{...(Ue=ce.parameters)==null?void 0:Ue.docs,source:{originalSource:`{
  name: 'DebtUntangle (v5.1 Solver, restraint pass)',
  args: {
    solved: false,
    controls: 'full',
    startButton: true,
    skin: 'solver'
  },
  argTypes: {
    controls: {
      control: 'inline-radio',
      options: ['full', 'inline', 'none']
    },
    skin: {
      control: 'inline-radio',
      options: ['solver', 'instrument']
    }
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>,
  parameters: {
    docs: {
      description: {
        story: 'The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star.'
      }
    }
  }
}`,...(We=(Ie=ce.parameters)==null?void 0:Ie.docs)==null?void 0:We.source}}};var Ae,Ge,Ce;de.parameters={...de.parameters,docs:{...(Ae=de.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
  name: 'DebtUntangle, inline controls (Money screen)',
  args: {
    solved: false,
    controls: 'inline',
    startButton: false,
    skin: 'solver'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(Ce=(Ge=de.parameters)==null?void 0:Ge.docs)==null?void 0:Ce.source}}};var Be,Oe,Ye;me.parameters={...me.parameters,docs:{...(Be=me.parameters)==null?void 0:Be.docs,source:{originalSource:`{
  name: 'DebtUntangle, solved',
  args: {
    solved: true,
    controls: 'inline',
    skin: 'solver'
  },
  render: a => <div style={{
    maxWidth: 362
  }}><DebtUntangle {...a} /></div>
}`,...(Ye=(Oe=me.parameters)==null?void 0:Oe.docs)==null?void 0:Ye.source}}};var Ve,Ke,_e;ue.parameters={...ue.parameters,docs:{...(Ve=ue.parameters)==null?void 0:Ve.docs,source:{originalSource:`{
  name: 'Money v4 logs and rows',
  render: () => <div style={{
    maxWidth: 362,
    display: 'grid',
    gap: 12
  }}>
    <MoneyBalance net={-23.7} caption="2 IOUs: you owe Tomás $42.10. Ren owes you $18.40." />
    <IouLog raw={rawDebts} people={P} />
    <NetLog nets={{
      nic: 42.1,
      joao: 64,
      sofia: 0,
      tomas: 0,
      ren: -18.4,
      ari: -23.7,
      mara: -64
    }} people={P} />
    <PairRows plan={simplifiedDebts} people={P} />
  </div>
}`,...(_e=(Ke=ue.parameters)==null?void 0:Ke.docs)==null?void 0:_e.source}}};var He,Xe,Je;pe.parameters={...pe.parameters,docs:{...(He=pe.parameters)==null?void 0:He.docs,source:{originalSource:`{
  name: 'PaymentRow',
  args: {
    amount: 42.1,
    state: 'due',
    method: 'MB WAY'
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['due', 'sending', 'paid', 'requested']
    }
  },
  render: a => <>
    <ListGroup><PaymentRow {...a} from={P.nic} to={P.ari} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="due" />
      <PaymentRow from={P.ari} to={P.joao} amount={12.5} state="due" method="Sintra train tickets" />
      <PaymentRow from={P.mara} to={P.joao} amount={64} state="sending" />
      <PaymentRow from={P.ren} to={P.ari} amount={18.4} state="paid" method="Revolut" />
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="requested" />
    </ListGroup>
  </>
}`,...(Je=(Xe=pe.parameters)==null?void 0:Xe.docs)==null?void 0:Je.source}}};var Ze,ze,Qe;he.parameters={...he.parameters,docs:{...(Ze=he.parameters)==null?void 0:Ze.docs,source:{originalSource:`{
  name: 'SettleSheet',
  parameters: {
    screen: 'full'
  },
  args: {
    amount: 42.1,
    method: 'MB WAY',
    state: 'review'
  },
  argTypes: {
    method: {
      control: 'inline-radio',
      options: ['MB WAY', 'Apple Pay', 'Revolut', 'Cash']
    },
    state: {
      control: 'inline-radio',
      options: ['review', 'sent']
    }
  },
  render: a => <div className="scr"><BottomSheet title="Settle up" detent="compact"><SettleContent {...a} from={P.nic} to={P.ari} /></BottomSheet></div>
}`,...(Qe=(ze=he.parameters)==null?void 0:ze.docs)==null?void 0:Qe.source}}};const Ct=["Expense","Receipt","Simplify","Untangle","UntangleSolver","UntangleInline","UntangleSolved","MoneyLogs","Payments","Settle"];export{ae as Expense,ue as MoneyLogs,pe as Payments,oe as Receipt,he as Settle,ie as Simplify,le as Untangle,de as UntangleInline,me as UntangleSolved,ce as UntangleSolver,Ct as __namedExportsOrder,Gt as default};
