// node flow.cjs [cash|app] : full click-through as Ari, ending on All squared up
const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8090/site/prototype/';
const OUT = __dirname + '/flow';
const mode = process.argv[2] || 'cash';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const errs = []; const log = [];
  const p = await (await b.newContext({ viewport: { width: 1440, height: 960 } })).newPage();
  p.on('console', m => m.type() === 'error' && !/vibrate/.test(m.text()) && errs.push(m.text())); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  const ph = p.locator('.phone-screen');
  globalThis.__p = p; globalThis.__log = log;
  const click = async (role, name) => { const l = typeof name !== 'undefined' ? ph.getByRole(role, { name }).first() : ph.locator(role).first(); await l.click({ timeout: 8000 }); await p.waitForTimeout(500); };
  const step = async () => p.evaluate(() => location.hash);
  const shot = n => p.screenshot({ path: `${OUT}/${mode}-${n}.png`, clip: { x: 0, y: 0, width: 1440, height: 960 } });
  await p.goto(BASE + '#/home'); await p.waitForTimeout(800);
  await click('.pt-cardbtn'); log.push(await step());
  await click('button', 'Add people'); await click('button', /Simulate Ren scanning/); await click('button', 'Done'); log.push(await step());
  await click('button', 'Start a poll'); await p.waitForTimeout(900); log.push(await step());
  // Explore questions change often; answer each with its first option (rows end in a spot count) until the picks appear.
  for (let q = 0; q < 6; q++) {
    if (await ph.getByRole('button', { name: /Taberna da Rua/ }).count()) break;
    // v5: the questions are photo or glass tiles (Find a place); older builds used rows ending in a count.
    let opts = ph.locator('.b-fp-photo, .b-fp-glass'); if (!(await opts.count())) opts = ph.locator('button').filter({ hasText: /\d\s*$/ }); if (!(await opts.count())) break;
    await opts.first().click(); await p.waitForTimeout(600);
  }
  log.push('explore answered');
  for (const n of ['Taberna da Rua', 'Cervejaria Ramiro', 'Park Rooftop']) await click('button', new RegExp(n));
  await click('button', 'Start a poll with these 3'); log.push(await step());
  await click('button', /Send to (7 people|crew)/); log.push(await step());
  await click('button', /Ari started a poll/); await click('button', /Taberna da Rua das Flores/); await p.waitForTimeout(1200); log.push(await step());
  await click('button', /Cervejaria Ramiro/); log.push('ari voted');
  await p.waitForFunction(() => location.hash.includes('closed'), null, { timeout: 30000 }); await p.waitForTimeout(800); log.push(await step());
  await click('button', 'See tonight'); log.push(await step());
  await click('button', 'Add the dinner bill'); log.push(await step());
  await click('button', /Ren shares Vinho/); await click('button', /Nic shares Vinho/);
  log.push((await ph.locator('.pt-summary').textContent()).trim());
  await click('button', 'Save expense'); await p.waitForTimeout(800); log.push(await step());
  await click('button', 'Simplify 6 IOUs'); await p.waitForTimeout(5000); log.push('summary ' + (await ph.locator('.p-untangle .sr-only, [class*=p-ut] .sr-only, .sr-only').allTextContents()).join(' | ').slice(0, 300));
  await shot('1-money-solved');
  await click('button', /Pay Nic \$42\.10/); log.push(await step());
  if (mode === 'cash') {
    await click('radio', /Cash/); await click('button', 'Continue with cash'); log.push(await step());
    log.push('count ' + (await ph.locator('.p-cashcount').innerText()).replace(/\s+/g, ' ').slice(0, 120));
    const k = ph.locator('.p-slide-knob'); const bb = await k.boundingBox(); const tb = await ph.locator('.p-slide').boundingBox();
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down();
    for (let i = 1; i <= 20; i++) { await p.mouse.move(bb.x + bb.width / 2 + (tb.width - 60) * i / 20, bb.y + bb.height / 2); await p.waitForTimeout(16); }
    await p.mouse.up(); await p.waitForTimeout(900); log.push(await step()); await shot('2-pending');
    // Undo, then redo, to prove the undo path
    await click('button', 'Undo'); await p.waitForTimeout(500); log.push('after undo ' + await step());
    if (!(await step()).includes('cash')) await click('button', 'Continue with cash').catch(() => {});
    const bb2 = await ph.locator('.p-slide-knob').boundingBox();
    await p.mouse.move(bb2.x + 30, bb2.y + 30); await p.mouse.down();
    for (let i = 1; i <= 20; i++) { await p.mouse.move(bb2.x + 30 + (tb.width - 60) * i / 20, bb2.y + 30); await p.waitForTimeout(16); }
    await p.mouse.up(); await p.waitForTimeout(5200); log.push('pending ' + await step());
    await p.getByRole('button', { name: "Switch to Nic's phone" }).click(); await p.waitForTimeout(800); log.push('as nic ' + await step()); await shot('3-nic');
    await click('button', 'Yes, I got $42.00'); await p.waitForTimeout(1500); log.push(await step()); await shot('4-confirmed');
  } else {
    await click('radio', /TripUp Pay/); await click('button', 'Pay $42.10 with TripUp Pay'); await p.waitForTimeout(1500); log.push(await step()); await shot('2-paid');
  }
  await click('button', /Ask Ren for \$18\.40/);
  await p.waitForFunction(() => location.hash.includes('squared'), null, { timeout: 20000 }); await p.waitForTimeout(1600); log.push(await step());
  log.push('sheet ' + (await ph.locator('.p-sq-card, .p-sq').first().innerText()).replace(/\s+/g, ' ').slice(0, 260));
  await shot('5-squared');
  await click('button', 'Share the recap'); await p.waitForTimeout(800); await shot('6-recap');
  log.push('missing ' + JSON.stringify(await p.locator('.pt-checklist li:not(.is-ok)').allTextContents()));
  log.push('checks ' + (await p.locator('.pt-checklist li.is-ok').count()) + '/' + (await p.locator('.pt-checklist li').count()));
  console.log(log.join('\n')); console.log('ERRORS', JSON.stringify(errs));
  await b.close();
})().catch(async e => { console.error('FAIL', e.message, JSON.stringify(globalThis.__log)); try { await globalThis.__p.screenshot({ path: OUT + '/FAIL.png' }); } catch {} process.exit(1); });
