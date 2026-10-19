#!/usr/bin/env python3
# compare.py <shotdir> <outdir> [scheme] : Figma export left, build right, both 804x1748, plus a 1x preview
import sys, os
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; scheme = sys.argv[3] if len(sys.argv) > 3 else 'light'
os.makedirs(out, exist_ok=True)
PAIRS = {'money-tangled': 'hifi-09a-tangled', 'money-solved': 'hifi-09-balances', 'settle-01-choose': 'settle-01-choose-method', 'settle-02-cash': 'settle-02-cash-count-round',
  'settle-03-slide': 'settle-03-cash-slide', 'settle-04-pending': 'settle-04-cash-pending-undo', 'settle-05-nic-confirm': 'settle-05-nic-confirm',
  'settle-06-confirmed': 'settle-06-confirmed-1-of-3', 'settle-07-receipt': 'settle-07-receipt', 'settle-08-partial': 'settle-08-edge-partial-cash',
  'settle-09-dispute': 'settle-09-edge-dispute', 'settle-10-offline': 'settle-10-edge-offline', 'squared': 'hifi-10-squared-up'}
for k, v in PAIRS.items():
    a = f'/workspace/tripup/exports/{v}{"-dark" if scheme == "dark" else ""}.png'; b = f'{src}/{k}-{scheme}.png'
    if not (os.path.exists(a) and os.path.exists(b)): continue
    A = Image.open(a).convert('RGB').resize((804, 1748)); B = Image.open(b).convert('RGB').resize((804, 1748))
    W = Image.new('RGB', (804 * 2 + 24, 1748 + 60), (250, 250, 252)); W.paste(A, (0, 60)); W.paste(B, (828, 60))
    d = ImageDraw.Draw(W); d.text((10, 20), f'Figma: {v}', fill=(40, 40, 50)); d.text((838, 20), f'Build: {k} ({scheme})', fill=(40, 40, 50))
    W.save(f'{out}/{k}-{scheme}.png'); W.resize((W.width // 2, W.height // 2)).save(f'{out}/{k}-{scheme}-1x.png')
print('ok')
