const { chromium } = require('playwright-core');
(async()=>{
 const [,, url, out, w='1920', h='1080', wait='800', transparent=''] = process.argv;
 const b = await chromium.launch({executablePath:'/usr/bin/google-chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p = await b.newPage({viewport:{width:+w,height:+h}, deviceScaleFactor:1});
 p.on('console', m=>console.log('console:', m.text()));
 p.on('pageerror', e=>console.log('pageerror:', e.message));
 await p.goto(url, {waitUntil:'networkidle'});
 await p.waitForTimeout(+wait);
 if (await p.evaluate(()=>typeof window.__ready!=='undefined')) await p.waitForFunction(()=>window.__ready===true,{timeout:120000});
 await p.screenshot({path:out, fullPage:true, omitBackground: !!transparent});
 await b.close();
})();
