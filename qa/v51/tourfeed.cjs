// Guided tour: Part 1 explore step shows the feed, scrolls, then taps the hero into the questions.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8080/prototype/?mode=tour#/explore'); const seen = [];
  for (let i = 0; i < 40; i++) { await p.waitForTimeout(500);
    const st = await p.evaluate(() => [location.hash, !!document.querySelector('.pt-anim:not(.mo-ghost) .b-findhero'), !!document.querySelector('.b-fp-photo, .b-fp-glass'), Math.round(document.querySelector('.pt-feed')?.scrollTop ?? -1)].join(' '));
    if (seen[seen.length - 1] !== st) seen.push(st); }
  console.log(seen.join('\n')); console.log('errors', errs); await b.close(); })();
