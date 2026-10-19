#!/usr/bin/env python3
"""US English, USD and 12-hour/month-first pass over TripUp source and docs. Usage: usify.py [--dry] files..."""
import re, sys
dry = '--dry' in sys.argv
files = [f for f in sys.argv[1:] if f != '--dry']
WORDS = {'colours': 'colors', 'coloured': 'colored', 'colour': 'color', 'centres': 'centers', 'centred': 'centered', 'centre': 'center',
  'greys': 'grays', 'grey': 'gray', 'travelling': 'traveling', 'travellers': 'travelers', 'traveller': 'traveler', 'cancelled': 'canceled', 'cancelling': 'canceling',
  'labelled': 'labeled', 'labelling': 'labeling', 'organisers': 'organizers', 'organiser': 'organizer', 'organised': 'organized', 'organise': 'organize', 'organising': 'organizing',
  'organisation': 'organization', 'favourites': 'favorites', 'favourite': 'favorite', 'behaviours': 'behaviors', 'behaviour': 'behavior', 'euros': 'dollars', 'euro': 'dollar'}
def case(src, rep):
    if src.isupper(): return rep.upper()
    if src[0].isupper(): return rep[0].upper() + rep[1:]
    return rep
wre = re.compile(r'\b(' + '|'.join(sorted(WORDS, key=len, reverse=True)) + r')\b', re.I)
MON = 'Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|January|February|March|April|June|July|August|September|October|November|December'
def t12(m):
    h, mi, sec = int(m.group(1)), m.group(2), m.group(3) or ''
    ap = 'AM' if h < 12 else 'PM'; h12 = h % 12 or 12
    return f'{h12}:{mi}{sec} {ap}'
tre = re.compile(r'(?<![\w:./#-])([01]?\d|2[0-3]):([0-5]\d)(:[0-5]\d)?(?![\w:]| ?[AP]M)')
total = 0
for f in files:
    s = open(f, encoding='utf-8').read(); o = s
    s = wre.sub(lambda m: case(m.group(0), WORDS[m.group(0).lower()]), s)
    s = s.replace('en-IE', 'en-US').replace("value=\"EUR\"", "value=\"USD\"")
    s = s.replace('€', '$')
    if not f.endswith(('.css', '.py')) or f.endswith('sheet.py'):
        lines = s.split('\n')
        for i, L in enumerate(lines):
            if re.search(r'https?:|localhost|viewBox|aspect|ratio|\d+:\d+:\d+:\d+', L): continue
            lines[i] = tre.sub(t12, L)
        s = '\n'.join(lines)
        s = re.sub(r'\b(\d{1,2})( to |–)(\d{1,2}) (' + MON + r')\b', r'\4 \1\2\3', s)
        s = re.sub(r'\b(\d{1,2}) (' + MON + r')\b(,? (\d{4}))?', lambda m: f'{m.group(2)} {m.group(1)}' + (f', {m.group(4)}' if m.group(4) else ''), s)
    if s != o:
        n = sum(1 for a, b in zip(o.split('\n'), s.split('\n')) if a != b); total += n
        print(f'{n:4d}  {f}')
        if not dry: open(f, 'w', encoding='utf-8').write(s)
print('changed lines', total)
