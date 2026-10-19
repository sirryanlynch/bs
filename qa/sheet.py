import sys
from PIL import Image, ImageDraw, ImageFont
pre, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 3
ims = [Image.open(f'/workspace/tripup/qa/deck/{pre}-{i:02d}.png').convert('RGB') for i in range(1, 10)]
w = 720 if pre == 'desk' else 300
ims = [im.resize((w, int(im.height * w / im.width))) for im in ims]
h = ims[0].height; pad = 24; lab = 30
sheet = Image.new('RGB', (cols * w + (cols + 1) * pad, 3 * (h + lab) + 4 * pad + 40), (238, 237, 242))
d = ImageDraw.Draw(sheet)
try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
except Exception: f = None
d.text((pad, 14), 'TripUp deck · ' + ('1440x900' if pre == 'desk' else '390x844'), fill=(40, 40, 50), font=f)
for i, im in enumerate(ims):
    x = pad + (i % cols) * (w + pad); y = 40 + pad + (i // cols) * (h + lab + pad)
    sheet.paste(im, (x, y + lab)); d.text((x, y + 6), f'{i+1:02d}', fill=(80, 70, 200), font=f)
sheet.save(out)
