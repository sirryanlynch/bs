const { chromium } = require('playwright-core');
const fs = require('fs');
(async () => {
  const base = process.env.SB || 'http://localhost:6007';
  const out = process.argv[2] || 'screens';
  const only = process.argv[3];
  const idx = JSON.parse(fs.readFileSync('storybook-static/index.json', 'utf8')).entries;
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errs = [];
  const shot = async (id, file, { w = 470, h = 960, globals = '', full = false } = {}) => {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    p.on('pageerror', e => errs.push(id + ': ' + e.message));
    try {
      await p.goto(`${base}/iframe.html?id=${id}&viewMode=story${globals ? '&globals=' + globals : ''}`, { waitUntil: 'load', timeout: 30000 });
      await p.waitForTimeout(2600);
      const phone = await p.$('.phone-screen');
      if (phone && !full) await phone.screenshot({ path: `${out}/${file}.png`, timeout: 20000 });
      else await p.screenshot({ path: `${out}/${file}.png`, fullPage: true, timeout: 20000 });
      console.log('ok', file);
    } catch (e) { errs.push(id + ' shot: ' + e.message.split('\n')[0]); }
    await p.close();
  };
  fs.mkdirSync(out, { recursive: true });
  const stories = Object.values(idx).filter(e => e.type === 'story');
  for (const s of stories) {
    if (only && !s.id.includes(only)) continue;
    const name = s.id.replace(/--/g, '__');
    if (s.id.startsWith('foundations-live-demos')) await shot(s.id, name, { w: 1280, h: 900, full: true });
    else await shot(s.id, name);
    if (s.id.startsWith('patterns') || ['components-polls--card-closed', 'components-money--simplify', 'components-overlays--celebration'].includes(s.id))
      await shot(s.id, name + '__dark', { globals: 'theme:dark' });
  }
  if (!only) {
    const p = await b.newPage({ viewport: { width: 1440, height: 960 } });
    for (const [path, f] of [['story/patterns-lisbon-scenario--live-poll', 'desktop_live-poll'], ['story/components-polls--card', 'desktop_pollcard-controls'], ['docs/foundations-color--docs', 'desktop_color-docs'], ['docs/components-polls-usage--docs', 'desktop_polls-usage-docs']]) {
      try { await p.goto(`${base}/?path=/${path}`, { waitUntil: 'load' }); await p.waitForTimeout(4000); await p.screenshot({ path: `${out}/${f}.png` }); console.log('ok', f); } catch (e) { errs.push(f + ': ' + e.message.split('\n')[0]); }
    }
  }
  await b.close();
  console.log('errors:', errs.length ? errs.join('\n') : 'none');
  console.log('DONE');
})();
