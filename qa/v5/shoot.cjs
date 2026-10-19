// node shoot.cjs outdir name=route [name=route ...]  : 2x phone-only PNGs from the local site (self guided)
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
(async () => {
  const [out, ...pairs] = process.argv.slice(2);
  const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  for (const pr of pairs) {
    const i1 = pr.indexOf('='), i2 = pr.indexOf('=', i1 + 1); const name = pr.slice(0, i1), route = i2 < 0 ? pr.slice(i1 + 1) : pr.slice(i1 + 1, i2), act = i2 < 0 ? '' : pr.slice(i2 + 1);
    await p.goto(B + '?mode=self&v=' + Date.now() + '#' + route); await p.waitForTimeout(1300);
    if (act) { for (const a of act.split(';')) { if (a.startsWith('wait:')) await p.waitForTimeout(+a.slice(5)); else if (a.startsWith('click:')) await p.locator(a.slice(6)).first().click({ timeout: 4000 }).catch(e => console.log('noclick', a)); else if (a.startsWith('scroll:')) await p.evaluate(y => { const s = document.querySelector('.pt-device .b-scroll, .pt-device .scr-scroll'); if (s) s.scrollTop = +y; }, a.slice(7)); await p.waitForTimeout(700); } }
    await p.locator('.pt-device').screenshot({ path: `${out}/${name}.png` });
    console.log('shot', name);
  }
  await br.close();
})();
