// node qa/v531/flows.cjs  Every screen: tab bar or Back (no dead ends), no in-flow menu, and swipe down lands where Back does.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
const CORE = ['home', 'trip', 'invite', 'explore', 'create', 'push', 'live', 'closed', 'plan', 'expense', 'money', 'settle/choose', 'settle/cash', 'settle/pending', 'settle/confirm', 'squared'];
const BEYOND = ['create/where', 'create/when', 'create/crew', 'create/done', 'explore', 'explore/curate', 'place/taberna', 'explore/addpoll', 'poll/new', 'poll/new/sent', 'plan/day', 'plan/add',
  'expense/scan', 'expense/assign', 'expense/done', 'album', 'album/viewer', 'invite', 'guest', 'guest/welcome', 'activity', 'recap', 'recap/card', 'profile',
  'discover', 'trips/empty', 'trip/porto', 'trip/porto/photos', 'trip/porto/money', 'trip/porto/activity', 'polls'];
const ROUTES = ['#/polls', ...CORE.map(r => '#/' + r), ...BEYOND.map(r => r.startsWith('poll/new') ? '#/' + r : '#/beyond/' + r)];
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const info = () => p.evaluate(() => { const S = document.querySelector('.pt-screen-inner'); const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('[aria-hidden="true"],[inert],[hidden]'); };
    const back = [...S.querySelectorAll('button[aria-label^="Back"], a[aria-label^="Back"], [data-flow-back]')].filter(vis); const hmb = [...S.querySelectorAll('.b-hm-btn')].some(vis);
    const tab = S.querySelector('.p-tabbar'); const r = S.getBoundingClientRect();
    return { top: hmb, tab: !!(tab && vis(tab)), back: back.length, close: [...S.querySelectorAll('button[aria-label="Close"], button[aria-label^="Done"], .b-cs-x, button.p-btn, button.b-pillbtn')].filter(e => /^(Done|Close|Open|Vote|Get|See)/.test((e.getAttribute('aria-label') || e.textContent).trim())).filter(vis).length, fm: S.querySelectorAll('.b-fm-btn').length, hm: [...S.querySelectorAll('.b-hm-item')].map(e => e.getAttribute('aria-label')).join('/'), box: [r.left, r.top, r.width] }; });
  const load = async h => { await p.goto(B + '?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1300); };
  const rows = []; let bad = 0;
  for (const h of ROUTES) {
    await load(h); const i = await info(); let row = `${h.padEnd(26)} tab=${+i.tab} back=${i.back} fm=${i.fm}${i.hm ? ' menu=' + i.hm : ''}`;
    if (i.fm) { row += '  IN-FLOW MENU'; bad++; }
    if (!i.tab && !i.back) { row += i.close ? '  (no Back; has Close/Done)' : h === '#/push' ? '  (Lock Screen: tap the notification)' : '  DEAD END?'; if (!i.close && h !== '#/push') bad++; }
    if (!i.tab && i.back) {
      await p.click('.pt-screen-inner button[aria-label^="Back"], .pt-screen-inner [data-flow-back]', { timeout: 3000 }).catch(() => {}); await p.waitForTimeout(900); const viaBack = await p.evaluate(() => location.hash);
      await load(h); const [x, y, w] = i.box; const sx = x + w / 2, sy = y + 90;
      await p.mouse.move(sx, sy); await p.mouse.down(); for (let k = 1; k <= 12; k++) { await p.mouse.move(sx, sy + k * 22); await p.waitForTimeout(16); } await p.mouse.up(); await p.waitForTimeout(1000);
      const viaSwipe = await p.evaluate(() => location.hash);
      if (i.top) { row += `  top-level: back->${viaBack}, swipe ${viaSwipe === h ? 'ignored (ok)' : 'MOVED ' + viaSwipe}`; if (viaSwipe !== h) bad++; }
      else { row += `  back->${viaBack}  swipe->${viaSwipe}` + (viaSwipe === viaBack && viaBack !== h ? '  ok' : viaSwipe === viaBack ? '  same (layered screen, see Close/Done)' : '  MISMATCH'); if (viaSwipe !== viaBack) bad++; }
    }
    rows.push(row); console.log(row);
  }
  // v5.4 C: Poll sent, explicit
  await load('#/poll/new/sent'); const si = await info(); console.log(`POLL SENT fm=${si.fm} menuBtn=${si.top} back=${si.back}`); if (si.fm || si.top) bad++;
  await p.click('.pt-screen-inner button[aria-label^="Back"]'); await p.waitForTimeout(900); const sb = await p.evaluate(() => location.hash); console.log('POLL SENT Back ->', sb); if (sb.includes('sent')) bad++;
  await load('#/poll/new/sent'); await p.click('.pt-screen-inner button:has-text("Done")'); await p.waitForTimeout(900); const sd = await p.evaluate(() => location.hash); console.log('POLL SENT Done ->', sd); if (sd.includes('sent')) bad++;
  console.log('BAD', bad, 'errors', JSON.stringify(errs)); await b.close(); })();
