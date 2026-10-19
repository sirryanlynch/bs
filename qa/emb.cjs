const { chromium } = require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--use-gl=swiftshader','--no-sandbox']});
const p=await b.newPage({viewport:{width:442,height:936}});
p.on('console',m=>console.log('C',m.type(),m.text()));p.on('pageerror',e=>console.log('E',e.message));p.on('requestfailed',r=>console.log('F',r.url()));
await p.goto('http://localhost:8471/prototype/?embed=1#/live');await p.waitForTimeout(3000);await p.screenshot({path:'/tmp/emb1.png'});
console.log(await p.evaluate(()=>document.body.innerHTML.slice(0,300)));
const r=await p.evaluate(()=>{const e=document.querySelector('.phone');if(!e)return null;const x=e.getBoundingClientRect();return [x.x,x.y,x.width,x.height, getComputedStyle(e).borderRadius]});console.log(r);
await b.close();})();
