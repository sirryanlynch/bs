# python3 qa/v53/pairs.py  Builds before/after crops per v5.3 item into qa/v53/pairs/.
from PIL import Image, ImageDraw, ImageFont
import os
os.chdir('/workspace/tripup/qa/v53')
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
def load(p, box=None, h=None):
    im = Image.open(p).convert('RGB')
    if box:  # box in fractions of width/height
        W, H = im.size; im = im.crop((int(box[0]*W), int(box[1]*H), int(box[2]*W), int(box[3]*H)))
    if h: im = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
    return im
def pair(out, before, after, h=640):
    cols = [('BEFORE', [load(*b, h=h) if isinstance(b, tuple) else load(b, h=h) for b in before]),
            ('AFTER', [load(*a, h=h) if isinstance(a, tuple) else load(a, h=h) for a in after])]
    W = sum(sum(i.width for i in ims) + 12 * (len(ims) - 1) for _, ims in cols) + 48
    c = Image.new('RGB', (W, h + 44), 'white'); d = ImageDraw.Draw(c); x = 0
    for lab, ims in cols:
        d.text((x + 4, 8), lab, fill=(110, 91, 255) if lab == 'AFTER' else (120, 120, 128), font=F)
        for i in ims: c.paste(i, (x, 44)); x += i.width + 12
        x += 36
    c.save('pairs/' + out, quality=84); print('pairs/' + out, c.size)
R, B, A, D = 'ryan/', 'before/', 'after2/', 'deck-after/'
full = (0, 0, 1, 1)
pair('01-s5-moodboard.jpg', [(R+'s5.jpg', full)], [(D+'deck-s5.png', full)], 560)
pair('01b-s6-moment-in-motion.jpg', [(R+'s6.jpg', full)], [(D+'deck-s6.png', full)], 560)
pair('02-s6-chips.jpg', [(R+'s6.jpg', (0.03, 0.2, 0.55, 0.95))], [(D+'deck-s6.png', (0.03, 0.2, 0.55, 0.95))], 560)
pair('03-s7-panel.jpg', [(R+'s7.jpg', full)], [(D+'deck-s7.png', full)], 560)
pair('04-s8-stage1-hidden.jpg', [(R+'s8a.jpg', full), (R+'s8b.jpg', full)], [(D+'deck-s8.png', full)], 460)
pair('05-ren-web-vote.jpg', [B+'ren-msg.png'], [A+'ren-msg.png', A+'ren-web.png', A+'ren-voted.png', A+'ren-back.png'], 700)
pair('05b-s8-ren-embed.jpg', [(R+'s8c.jpg', full), (R+'s8d.jpg', full)], [D+'s8-ren-seq.png'], 460)
pair('06-s9-untangle.jpg', [(R+'s9.jpg', full)], [(D+'deck-s9.png', full)], 560)
pair('07-add-option-explore.jpg', [B+'add-option.png'], [A+'add-option.png'], 760)
pair('08-picks-plus.jpg', [B+'picks.png'], [A+'picks.png', A+'picks-added.png', A+'picks-open.png'], 760)
pair('09-flow-menu.jpg', [B+'composer-menu.png', B+'expense-menu.png', B+'settle-receipt-menu.png', B+'create-trip.png'], [A+'composer-menu.png', A+'expense-menu.png', A+'settle-receipt-menu.png', A+'create-trip.png'], 620)
pair('10-squared-dismiss.jpg', [B+'squared.png'], [A+'squared.png', A+'squared-dismiss.png'], 760)
pair('11-album-faces.jpg', [(R+'album.jpg', full), B+'album.png'], [A+'album.png', A+'album-person.png'], 620)
