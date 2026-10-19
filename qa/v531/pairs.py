# python3 qa/v531/pairs.py  Before (v5.3 build) / after (v5.3.1) crops into qa/v531/pairs/.
import os, sys
sys.path.insert(0, '/workspace/tripup/qa/v53'); os.chdir('/workspace/tripup/qa/v531')
from PIL import Image, ImageDraw, ImageFont
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
def load(p, box=None, h=640):
    im = Image.open(p).convert('RGB')
    if box: W, H = im.size; im = im.crop((int(box[0]*W), int(box[1]*H), int(box[2]*W), int(box[3]*H)))
    return im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
def pair(out, before, after, h=640, box=None):
    cols = [c for c in [('BEFORE (v5.3)', [load(b, box, h) for b in before]), ('AFTER (v5.3.1)', [load(a, box, h) for a in after])] if c[1]]
    W = sum(sum(i.width for i in ims) + 12 * (len(ims) - 1) for _, ims in cols) + 48
    c = Image.new('RGB', (W, h + 44), 'white'); d = ImageDraw.Draw(c); x = 0
    for lab, ims in cols:
        d.text((x + 4, 8), lab, fill=(110, 91, 255) if 'AFTER' in lab else (120, 120, 128), font=F)
        for i in ims: c.paste(i, (x, 44)); x += i.width + 12
        x += 36
    c.save('pairs/' + out, quality=80); print('pairs/' + out, c.size)
B, A = 'before/', 'after/'
top = (0, 0, 1, 0.42)
pair('01-menu-three-items.jpg', [B+'trip-menu.png', B+'money-menu.png'], [A+'trip-menu.png', A+'money-menu.png'], 360, top)
pair('02-inflow-no-menu.jpg', [B+n+'.png' for n in ['composer-menu', 'find-menu', 'expense-menu', 'create-trip']], [A+n+'.png' for n in ['composer-menu', 'find-menu', 'expense-menu', 'create-trip']], 300, top)
pair('03-settle-no-menu.jpg', [B+n+'.png' for n in ['settle-pay', 'settle-cash', 'settle-receipt-menu']], [A+n+'.png' for n in ['settle-pay', 'settle-cash', 'settle-receipt-menu']], 300, top)
pair('04-swipe-down-new.jpg', [], [A+'swipe-composer-mid.png', A+'swipe-composer-done.png', A+'swipe-cash-mid.png', A+'swipe-cash-done.png'], 560)
pair('05-poll-sent-exit.jpg', [B+'poll-sent.png'], [A+'poll-sent.png'], 640)
pair('06-picked-ring.jpg', [B+'picks-added.png'], [A+'picks-added.png'], 640, (0, 0.18, 1, 0.62))
pair('07-slide5-eyebrow.jpg', ['/workspace/tripup/qa/v53/deck-after/deck-s5.png'], [A+'deck-s5.png'], 300, (0.6, 0.22, 1, 0.42))
