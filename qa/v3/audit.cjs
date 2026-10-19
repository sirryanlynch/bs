// node audit.cjs <label> [proto|landing|sb|all]
const { chromium } = require('playwright-core');
const fs = require('fs');
const DET = fs.readFileSync(__dirname + '/detect.js', 'utf8');
const label = process.argv[2] || 'run'; const which = process.argv[3] || 'all';
const OUT = `${__dirname}/${label}`; fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:8090/site/';
const steps = ['home', 'trip', 'invite', 'explore', 'create', 'push', 'live', 'closed', 'plan', 'expense', 'money', 'settle', 'squared'];
const extra = [
  ['invite-tripup', '#/invite', async p => p.locator('.phone-screen, .pt-mobile').getByText('From TripUp', { exact: true }).first().click()],
  ['explore-picks', '#/create', async p => { await p.evaluate(() => { location.hash = '#/explore'; }); }],
  ['push-open', '#/push', async p => p.locator('.pt-notifbtn').click()],
  ['live-toast', '#/live', async p => p.waitForTimeout(1500)],
  ['closed-tie', '#/closed?tie=1', null],
  ['money-untangling', '#/money', async p => { await p.getByRole('button', { name: /Simplify 6 IOUs/ }).first().click(); await p.waitForTimeout(1500); }],
  ['money-simplified', '#/money', async p => { await p.getByRole('button', { name: /Simplify 6 IOUs/ }).first().click(); await p.waitForTimeout(5000); }],
  ...['choose', 'cash', 'partial', 'pending', 'handoff', 'confirmed', 'receipt', 'dispute', 'offline'].map(v => ['settle-' + v, '#/settle/' + v, null]),
  ['settle-confirm-nic', '#/settle/confirm?as=nic', null],
  ['settle-notyet', '#/settle/confirm?as=nic', async p => p.locator('.phone-screen, .pt-mobile').getByRole('button', { name: 'Not yet' }).first().click()],
  ['settle-why', '#/settle/choose', async p => p.locator('.phone-screen, .pt-mobile').getByRole('button', { name: /^Why/ }).first().click()],
  ['squared-recap', '#/squared', async p => p.locator('.phone-screen, .pt-mobile').getByRole('button', { name: /recap/i }).first().click()],
  ['ren-live', '#/live?as=ren', null], ['ren-money', '#/money?as=ren', null], ['nic-money', '#/money?as=nic', null], ['nic-push', '#/push?as=nic', null],
];
async function scrollEnd(p) { return p.evaluate(() => { let any = false; document.querySelectorAll('.scr-scroll, .pt-web-scroll, .p-sheet-body').forEach(s => { if (s.scrollHeight > s.clientHeight + 4) { s.scrollTop = s.scrollHeight; any = true; } }); return any; }); }
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const report = {}; const errs = [];
  const run = async (p, key, root, opts, shot) => {
    await p.addScriptTag({ content: DET });
    const h = await p.evaluate(([r, o]) => window.__detect(r, o), [root, opts]);
    if (shot) await p.screenshot({ path: `${OUT}/${key}.png`, ...(shot === true ? {} : { clip: shot }) });
    report[key] = h;
  };
  if (which === 'all' || which === 'proto') {
    for (const [mode, vp, root] of [['frame', { width: 1440, height: 960 }, '.phone-screen'], ['phone', { width: 402, height: 874 }, '.pt-mobile']]) {
      const c = await b.newContext({ viewport: vp, isMobile: mode === 'phone', hasTouch: mode === 'phone', deviceScaleFactor: mode === 'phone' ? 2 : 1 });
      const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
      await p.goto(BASE + 'prototype/'); await p.waitForTimeout(600);
      const list = [...steps.map(s => [s, '#/' + s, null]), ...extra];
      for (const [k, hash, act] of list) {
        await p.goto(BASE + 'prototype/' + hash); await p.waitForTimeout(1300);
        if (act) { try { await act(p); } catch (e) { errs.push(`${k}: ${e.message.split('\n')[0]}`); } await p.waitForTimeout(900); }
        const clip = mode === 'frame' ? await p.locator('.phone-screen').boundingBox() : true;
        await run(p, `p-${mode}-${k}`, root, { phone: true }, clip);
        if (await scrollEnd(p)) { await p.waitForTimeout(300); await run(p, `p-${mode}-${k}-end`, root, { phone: true, scrolledEnd: true }, clip); }
      }
      await c.close();
    }
  }
  if (which === 'all' || which === 'landing') {
    for (const w of [1440, 390]) {
      const c = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 844 }, isMobile: w < 500, hasTouch: w < 500 }); const p = await c.newPage();
      p.on('pageerror', e => errs.push(e.message));
      await p.goto(BASE + (process.env.LANDING || '')); await p.waitForTimeout(1500);
      const H = await p.evaluate(() => document.body.scrollHeight); let i = 0;
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      for (let y = 0; y < H; y += (w > 500 ? 900 : 844)) {
        await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(350);
        await run(p, `l-${w}-${String(i++).padStart(2, '0')}`, 'body', {}, true);
      }
      report[`l-${w}-hscroll`] = ov > 0 ? [{ type: 'h-overflow', a: `${ov}px` }] : [];
      await c.close();
    }
  }
  if (which === 'all' || which === 'sb') {
    const idx = JSON.parse(fs.readFileSync('/workspace/tripup/site/storybook/index.json', 'utf8'));
    const ids = Object.values(idx.entries).filter(e => e.type === 'story').map(e => e.id);
    const c = await b.newContext({ viewport: { width: 1000, height: 960 } }); const p = await c.newPage();
    p.on('pageerror', e => errs.push(e.message));
    for (const id of ids) {
      await p.goto(`${BASE}storybook/iframe.html?id=${id}&viewMode=story`); await p.waitForTimeout(1200);
      const has = await p.locator('.phone-screen').count();
      await run(p, `sb-${id}`, has ? '.phone-screen' : '#storybook-root', { phone: !!has }, true);
    }
    await c.close();
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
  const tot = {}; let n = 0; Object.entries(report).forEach(([k, v]) => v.forEach(h => { tot[h.type] = (tot[h.type] || 0) + 1; n++; }));
  const byArea = {}; Object.entries(report).forEach(([k, v]) => { const a = k.split('-')[0]; byArea[a] = (byArea[a] || 0) + v.length; });
  console.log('TOTAL', n, JSON.stringify(tot), JSON.stringify(byArea)); console.log('ERRORS', JSON.stringify(errs.slice(0, 10)));
  await b.close();
})();
