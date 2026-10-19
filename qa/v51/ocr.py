# OCR every image shipped by the deck, case study, Storybook and prototype; flag euro, 24-hour times, day-first dates.
import subprocess, re, sys, os, json
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
roots = ['site', 'prototype/public', 'storybook/public', 'deck-src']
skip = ('node_modules', '/photos/', '/assets/', 'qa/')
files = []
for r in roots:
    for d, _, fs in os.walk(r):
        for f in fs:
            p = os.path.join(d, f)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and not any(s in p for s in skip): files.append(p)
files = sorted(set(os.path.realpath(f) for f in files))
PAT = [('euro', re.compile(r'€|\bEUR\b')), ('24h', re.compile(r'\b(1[3-9]|2[0-3]|0\d)[:h.][0-5]\d\b(?!\s?(AM|PM|am|pm))')),
       ('dayfirst', re.compile(r'\b\d{1,2}\s+(Oct|October|Feb|Apr|Dec|Jan|Jun)\b')), ('active', re.compile(r'\bActive\b'))]
def ocr(p):
    im = Image.open(p).convert('L')
    if im.width < 1200: im = im.resize((im.width * 2, im.height * 2))
    elif im.width > 2600: im = im.resize((2600, int(im.height * 2600 / im.width)))
    tmp = '/workspace/tripup/qa/v51/ocr/_' + str(abs(hash(p))) + '.png'; im.save(tmp)
    t = subprocess.run(['tesseract', tmp, '-', '--psm', '11'], capture_output=True, text=True, timeout=120, env={**os.environ, 'OMP_THREAD_LIMIT': '1'}).stdout
    os.remove(tmp)
    hits = [(k, m.group(0)) for k, rx in PAT for m in rx.finditer(t)]
    print('.', end='', flush=True); return p, hits
with ThreadPoolExecutor(6) as ex: res = list(ex.map(ocr, files))
bad = [(p, h) for p, h in res if h]
print(len(files), 'images,', len(bad), 'flagged')
for p, h in bad: print(os.path.relpath(p, '/workspace/tripup'), h)
json.dump({'checked': [os.path.relpath(p, '/workspace/tripup') for p in files], 'flagged': [[os.path.relpath(p, '/workspace/tripup'), h] for p, h in bad]}, open('qa/v51/ocr/result.json', 'w'), indent=1)
