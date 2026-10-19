// Reduce Motion checks: untangle jumps to result, slider becomes hold button, celebration static, undo ring becomes a number.
const { chromium } = require('playwright-core');
const B = 'http://localhost:8090/site/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
 const c = await b.newContext({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
 const p = await c.newPage(); const out = [];
 await p.goto(B + 'prototype/#/money'); await p.waitForTimeout(1200);
 await p.getByRole('button', { name: /Simplify 6 IOUs/ }).click(); await p.waitForTimeout(200);
 await p.screenshot({ path: 'rm/money-200ms.png' }); out.push('money@200ms: ' + (await p.locator('.sr-only').allTextContents()).join(' ').slice(0, 60));
 await p.goto(B + 'prototype/#/settle/cash'); await p.waitForTimeout(800);
 out.push('slider present: ' + await p.locator('.p-slide').count() + ', hold button: ' + await p.locator('.p-longpress').count());
 await p.screenshot({ path: 'rm/cash.png' });
 await p.goto(B + 'prototype/#/settle/pending'); await p.waitForTimeout(600);
 out.push('undo ring svg: ' + await p.locator('.p-undo svg').count() + ', number: ' + await p.locator('.p-undo-num').count());
 await p.goto(B + 'prototype/#/squared'); await p.waitForTimeout(150); await p.screenshot({ path: 'rm/squared-150ms.png' });
 const anims = await p.evaluate(() => document.getAnimations().filter(a => a.playState === 'running' && (a.effect?.getComputedTiming().duration || 0) > 300).length);
 out.push('running animations > 300ms on squared: ' + anims);
 await p.goto(B + 'storybook/iframe.html?id=components-money--untangle&viewMode=story'); await p.waitForTimeout(1500);
 const btn = p.getByRole('button', { name: /Untangle|Simplify|Solve/ }).first(); if (await btn.count()) { await btn.click(); await p.waitForTimeout(100); }
 out.push('sb untangle: ' + (await p.locator('.sr-only').allTextContents()).join(' ').slice(0, 60));
 await p.goto(B + '#8'); await p.waitForTimeout(800); await p.screenshot({ path: 'rm/deck8.png' });
 console.log(out.join('\n')); await b.close(); })();
