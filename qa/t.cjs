const { chromium } = require('playwright-core');
(async()=>{const b=await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///workspace/tripup/deliver/TripUp-prototype.html');await p.waitForTimeout(2500);await p.screenshot({path:'/workspace/tripup/deliver/check.png'});
await p.goto('file:///workspace/tripup/deliver/TripUp-prototype.html#/money');await p.waitForTimeout(2000);await p.screenshot({path:'/workspace/tripup/deliver/check2.png'});
console.log('errors',JSON.stringify(errs));await b.close();})();
