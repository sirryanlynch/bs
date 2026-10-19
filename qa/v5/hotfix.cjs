const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = 'http://localhost:8080/';
const O = __dirname + '/hotfix/';
(async () => {
  const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const log = [];
  // 1. Walk Next through every step in self guided mode
  { const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + 'prototype/?mode=self#/home'); await p.waitForTimeout(800);
    await p.click('.fl-steps').catch(() => {}); await p.waitForTimeout(400);
    const seen = []; let last = '';
    for (let i = 0; i < 90; i++) {
      const h = await p.evaluate(() => location.hash.split('?')[0]); const line = await p.locator('.pt-stepline').textContent().catch(() => '');
      if (h === last) break; seen.push(h + '  |  ' + line); last = h;
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(350);
    }
    log.push('ROUTE ORDER (' + seen.length + '):\n' + seen.join('\n'));
    // Back from first Beyond route returns to squared
    await p.goto(B + 'prototype/?mode=self#/beyond/create/where'); await p.waitForTimeout(500); await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(400);
    log.push('Back from create/where -> ' + await p.evaluate(() => location.hash));
    await p.close(); }
  // 2. Drawer collapse animation: tour -> self
  { const p = await br.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + 'prototype/?mode=tour#/trip'); await p.waitForTimeout(800);
    await p.evaluate(() => window.dispatchEvent(new Event('x')));
    const devX = () => p.evaluate(() => Math.round(document.querySelector('.pt-device').getBoundingClientRect().x));
    const x0 = await devX();
    await p.locator('.fl-panelmode button, .fl-panelmode [role=radio]').filter({ hasText: /Self/ }).first().click();
    await p.waitForTimeout(150); const xm = await devX(); await p.waitForTimeout(400); const x1 = await devX();
    log.push(`Drawer collapse: phone x ${x0} -> ${xm} (150ms) -> ${x1} (550ms)`);
    await p.screenshot({ path: O + 'self-collapsed.png' });
    await p.locator('.fl-float [role=radio], .fl-float button').filter({ hasText: /Guided|Tour/ }).first().click();
    await p.waitForTimeout(150); const ym = await devX(); await p.waitForTimeout(400); log.push(`Reopen: ${x1} -> ${ym} (150ms) -> ${await devX()} (550ms)`);
    await p.screenshot({ path: O + 'tour-open.png' });
    log.push('Back to deck in tour: ' + await p.locator('.fl-backwrap a').getAttribute('href'));
    await p.close(); }
  // 3. Deck links: slide 7 tabs, open full screen, slide 8, slide 9
  { const ctx = await br.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
    await p.goto(B + '#8'); await p.waitForTimeout(1500);
    const tabs = p.locator('.s7-stages [role=tab]');
    for (let i = 0; i < await tabs.count(); i++) {
      await tabs.nth(i).click(); await p.waitForTimeout(2600);
      await p.screenshot({ path: O + `s7-tab${i + 1}.png` });
      const fh = await p.evaluate(() => { const f = document.querySelector('iframe#proto, .device iframe, iframe[src*="prototype"]'); try { return f.contentWindow.location.hash; } catch (e) { return f && f.src; } });
      log.push(`slide8 stage ${i + 1} "${(await tabs.nth(i).locator('b').textContent())}" iframe=${fh} link=${await p.locator('#addOpen').getAttribute('href')}`);
    }
    const links = [['#8', '#addOpen'], ['#9', '.cashlink'], ['#10', '.s9 a.btn-hero']];
    for (const [sl, sel] of links) {
      await p.goto(B + sl); await p.waitForTimeout(1200);
      const [np] = await Promise.all([ctx.waitForEvent('page'), p.locator(sel).first().click()]);
      await np.waitForLoadState(); await np.waitForTimeout(1500);
      const deckHash = await p.evaluate(() => location.hash);
      await np.screenshot({ path: O + `newtab-${sl.slice(1)}.png` });
      const back = np.locator('.fl-backwrap a'); const bh = await back.getAttribute('href');
      await back.click(); await np.waitForTimeout(1200);
      log.push(`${sl} ${sel}: deck stays ${deckHash}; new tab ${np.url().replace(B, '')}... back href ${bh} -> ${np.url().replace(B, '')}`);
      await np.close();
    }
    await p.goto(B + '#10'); await p.waitForTimeout(2500); await p.screenshot({ path: O + 's10.png' });
    await p.goto(B + '#1'); await p.waitForTimeout(2500); await p.screenshot({ path: O + 's1.png' });
    await p.goto(B + '#9'); await p.waitForTimeout(2500); await p.screenshot({ path: O + 's9.png' });
  }
  // 4. Trip home without shortcut row
  { const p = await br.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto(B + 'prototype/?mode=self#/trip'); await p.waitForTimeout(900); await p.screenshot({ path: O + 'trip.png' });
    log.push('shortcut rows on trip: ' + await p.locator('.fl-shortcuts').count());
    await p.locator('[aria-label*="Create"], .b-tabs-plus, button[aria-label="New"]').first().click().catch(e => log.push('plus click fail')); await p.waitForTimeout(500); await p.screenshot({ path: O + 'trip-plus.png' }); }
  console.log(log.join('\n')); await br.close();
})();
