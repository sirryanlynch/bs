// node sheets.cjs outdir : every sheet open, phone-only 2x, plus geometry check (sheet top >= header bottom + 8, toast clear of island/header/sheet).
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
const S = [
  ['invite-scanned', '/invite', 'click:.pt-qr'],
  ['invite', '/invite', ''],
  ['create-menu', '/beyond/plan/day', "click:.p-tabbar-acc"],
  ['addpoll', '/beyond/explore/addpoll', ''],
  ['poll-token-when', '/poll/new/dinner', "click:.b-tok >> nth=1"],
  ['poll-add-option', '/poll/new/dinner', "click:.b-cmp-add"],
  ['why', '/settle/choose', "click:.p-payhero-link"],
  
  ['plan-add', '/beyond/plan/add', ''],
  ['album-upload', '/beyond/album/upload', ''],
];
(async () => {
  const out = process.argv[2]; const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 }); const res = [];
  for (const [n, r, act] of S) {
    await p.goto(B + '?mode=self&v=' + Date.now() + '#' + r); await p.waitForTimeout(1400);
    for (const a of act.split(';').filter(Boolean)) { try { await p.locator(a.slice(6)).first().click({ timeout: 3000 }); } catch (e) { res.push(n + ' noclick ' + a); } await p.waitForTimeout(700); }
    await p.waitForTimeout(500);
    const g = await p.evaluate(() => {
      const scr = document.querySelector('.pt-screen-inner').getBoundingClientRect();
      const r = (sel) => { const e = [...document.querySelectorAll(sel)].filter(x => !x.closest('.mo-ghost')).find(x => x.getBoundingClientRect().height > 0); return e ? e.getBoundingClientRect() : null; };
      const hm = r('.b-hm-bar') || r('.b-top') || r('.b-cmp-head'); const sh = r('.p-sheet') || r('.b-sheet') || r('.b-cs') || r('.b-cmenu') || r('.p-sq'); const t = r('.pt-itoast') || r('.b-toast');
      const f = x => x && [Math.round(x.top - scr.top), Math.round(x.bottom - scr.top)];
      return { header: f(hm), sheet: f(sh), toast: f(t) };
    });
    const bad = []; if (g.header && g.sheet && g.sheet[0] < g.header[1] + 8) bad.push('sheet under header');
    if (g.toast && g.toast[0] < 50) bad.push('toast in island'); if (g.toast && g.header && g.toast[0] < g.header[1] && g.toast[1] > g.header[0]) bad.push('toast over header');
    if (g.toast && g.sheet && g.toast[1] > g.sheet[0] && g.toast[0] < g.sheet[1]) bad.push('toast over sheet');
    res.push(`${n} ${JSON.stringify(g)} ${bad.join(', ') || 'ok'}`);
    await p.locator('.pt-device').screenshot({ path: `${out}/${n}.png` });
  }
  console.log(res.join('\n')); await br.close();
})();
