# python3 qa/v53/strip.py out.jpg dir name1,name2,...  side-by-side strip of phone shots
import sys
from PIL import Image
out, d, names = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
ims = [Image.open(f'{d}/{n}.png').convert('RGB') for n in names]
for i in ims: i.thumbnail((420, 900))
W = sum(i.width for i in ims) + 10 * (len(ims) - 1); H = max(i.height for i in ims)
c = Image.new('RGB', (W, H), 'white'); x = 0
for i in ims: c.paste(i, (x, 0)); x += i.width + 10
c.save(out, quality=85)
