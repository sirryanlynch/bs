"""Copies and resizes the images, fonts and tokens the deck uses into site/deck/. Safe to re-run."""
import shutil, glob, pathlib
from PIL import Image
root = pathlib.Path(__file__).resolve().parent.parent
out = root / 'site/deck'
(out / 'img').mkdir(parents=True, exist_ok=True); (out / 'fonts').mkdir(exist_ok=True)
photos = ['33659321', '20594880', '12400863', '16742072', '19721743', '6760852']
for p in photos:
    im = Image.open(root / f'moodboards/photos/px_{p}.jpg').convert('RGB'); im.thumbnail((1600, 1600))
    im.save(out / f'img/px_{p}.jpg', quality=80, optimize=True, progressive=True)
for b in ['prism', 'golden', 'night']:
    im = Image.open(root / f'moodboards/board_{b}.png').convert('RGB'); im.thumbnail((1600, 900))
    im.save(out / f'img/board_{b}.jpg', quality=84, optimize=True, progressive=True)
for e in ['hifi-04-create-poll', 'hifi-05-vote-from-push', 'hifi-07-poll-closed', 'hifi-08-wine-split', 'hifi-10-squared-up']:
    im = Image.open(root / f'exports/{e}.png').convert('RGB'); im.thumbnail((420, 920))
    im.save(out / f'img/{e}.jpg', quality=84, optimize=True)
shutil.copy(root / 'design-system/tokens.css', out / 'tokens.css')
inter = sorted(glob.glob(str(root / 'site/prototype/assets/Inter-*.woff2')) + glob.glob(str(root / 'storybook/storybook-static/**/Inter*.woff2'), recursive=True))
if inter: shutil.copy(inter[0], out / 'fonts/Inter.woff2')
for f in ['InstrumentSerif-Regular.woff2', 'InstrumentSerif-Italic.woff2']:
    shutil.copy(root / 'site/assets' / f, out / 'fonts' / f)
print('deck assets ready')
