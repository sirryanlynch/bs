// node qa/v53/proto.cjs outdir [names]  v5.3 prototype states: each row is name, hash, actions (click:/wait:/shot:), phone-only 2x shots.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
const S = [
  ['add-option', '/poll/new/dinner', 'click:.b-cmp-add'],
  ['picks', '/beyond/explore/curate', 'click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:900'],
  ['picks-added', '/beyond/explore/curate', 'click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:900;click:.b-fp-add >> nth=0;click:.b-fp-add >> nth=2'],
  ['find-menu', '/beyond/explore/curate', 'click:.b-fm-btn'],
  ['picks-open', '/beyond/explore/curate', 'click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=0;wait:500;click:.b-fp-photo, .b-fp-glass >> nth=1;wait:900;click:.b-fp-pick >> nth=1;wait:900'],
  ['composer-menu', '/poll/new/dinner', 'click:.b-fm-btn'],
  ['expense-menu', '/expense', 'click:.b-fm-btn'],
  ['settle-cash', '/settle/cash', ''],
  ['settle-receipt-menu', '/settle/pending', 'click:.b-fm-btn'],
  ['create-trip', '/beyond/create/where', ''],
  ['squared', '/squared', ''],
  ['squared-dismiss', '/squared', 'wait:1500;clickpos:200,140;wait:900'],
  ['album', '/beyond/album', ''],
  ['album-person', '/beyond/album', 'click:.b-pcell-who >> nth=1'],
  ['trip-menu', '/trip', 'click:.b-hm-btn;wait:700'],
  ['money-menu', '/money', 'click:.b-hm-btn;wait:700'],
  ['settle-pay', '/settle/choose', ''],
  ['poll-sent', '/poll/new/sent', ''],
  ['ren-msg', '/live?as=ren', 'wait:1200'],
  ['ren-web', '/live?as=ren', 'wait:1200;click:.rv-link;wait:900'],
  ['ren-voted', '/live?as=ren', 'wait:1200;click:.rv-link;wait:900;click:.rv-tile >> nth=0;wait:1600'],
  ['ren-back', '/live?as=ren', 'wait:1200;click:.rv-link;wait:900;click:.rv-tile >> nth=0;wait:1600;click:.rv-ok-btn;wait:1300'],
];
(async () => {
  const out = process.argv[2]; const only = process.argv[3] ? process.argv[3].split(',') : null;
  const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 }); const res = [];
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  for (const [n, r, act] of S) { if (only && !only.includes(n)) continue;
    await p.goto(B + '?mode=self&v=' + Date.now() + '#' + r); await p.waitForTimeout(1500);
    for (const a of act.split(';').filter(Boolean)) {
      if (a.startsWith('wait:')) { await p.waitForTimeout(+a.slice(5)); continue; }
      if (a.startsWith('clickpos:')) { const [x, y] = a.slice(9).split(',').map(Number); const bb = await p.locator('.pt-screen-inner').boundingBox(); await p.mouse.click(bb.x + x, bb.y + y); continue; }
      try { await p.locator(a.slice(6)).first().click({ timeout: 3000 }); } catch (e) { res.push(n + ' noclick ' + a); } await p.waitForTimeout(700); }
    await p.waitForTimeout(400);
    res.push(`${n} hash=${await p.evaluate(() => location.hash)} fm=${await p.locator('.b-fm-btn:visible, .b-hm-btn:visible').count()}`);
    await p.locator('.pt-device').screenshot({ path: `${out}/${n}.png` });
  }
  console.log(res.join('\n')); console.log('errors', JSON.stringify(errs)); await br.close();
})();
