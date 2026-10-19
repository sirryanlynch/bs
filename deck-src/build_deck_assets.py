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
    # Prefer the 2x US-English render from qa/v5/render-boards.cjs; the 1920 px PNGs still show euros and 24-hour times.
    hi = out / f'img/board_{b}@2x.jpg'
    im = Image.open(hi if hi.exists() else root / f'moodboards/board_{b}.png').convert('RGB'); im.thumbnail((1600, 900))
    im.save(out / f'img/board_{b}.jpg', quality=84, optimize=True, progressive=True)
# Journey shots. The Figma exports still show euros and the 24-hour clock, so the deck uses US-English captures of the
# built prototype from deck-src/shots/ (made by qa/v3/usshots.cjs) when they exist, and falls back to the exports.
shots = root / 'deck-src/shots'
for e in ['hifi-04-create-poll', 'hifi-05-vote-from-push', 'hifi-07-poll-closed', 'hifi-08-wine-split', 'hifi-10-squared-up']:
    src = shots / f'{e}.jpg' if (shots / f'{e}.jpg').exists() else root / f'exports/{e}.png'
    im = Image.open(src).convert('RGB'); im.thumbnail((420, 920))
    im.save(out / f'img/{e}.jpg', quality=84, optimize=True)
# Slide 8 cash-flow thumbnails.
for c in ['cash-1-count', 'cash-2-pending', 'cash-3-confirm', 'cash-4-confirmed']:
    if (shots / f'{c}.jpg').exists():
        im = Image.open(shots / f'{c}.jpg').convert('RGB'); im.thumbnail((280, 608))
        im.save(out / f'img/{c}.jpg', quality=84, optimize=True)
shutil.copy(root / 'design-system/tokens.css', out / 'tokens.css')
inter = sorted(glob.glob(str(root / 'site/prototype/assets/Inter-*.woff2')) + glob.glob(str(root / 'storybook/storybook-static/**/Inter*.woff2'), recursive=True))
if inter: shutil.copy(inter[0], out / 'fonts/Inter.woff2')
for f in ['InstrumentSerif-Regular.woff2', 'InstrumentSerif-Italic.woff2']:
    shutil.copy(root / 'site/assets' / f, out / 'fonts' / f)
shutil.copy(root / 'storybook/src/assets/fonts/JetBrainsMono.woff2', out / 'fonts/JetBrainsMono.woff2')
# Slide 8 photo avatars (Pexels, credits in storybook/src/assets/avatars/CREDITS.md), same crops as the prototype.
for _p in ['ari', 'sofia', 'mara', 'ren', 'nic', 'tomas', 'joao']:
    shutil.copy(root / f'storybook/src/assets/avatars/{_p}.jpg', out / f'img/av-{_p}.jpg')
print('deck assets ready')
