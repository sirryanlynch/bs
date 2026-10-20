import sys,glob,os
from PIL import Image, ImageChops
a,b=sys.argv[1],sys.argv[2]; bad=0
for f in sorted(glob.glob(f'/workspace/tripup/qa/v55/desk/{a}-*.png')):
  g=f.replace(f'/{a}-',f'/{b}-'); x=Image.open(f).convert('RGB'); y=Image.open(g).convert('RGB')
  d=ImageChops.difference(x,y); bb=d.getbbox(); n=sum(1 for px in d.getdata() if max(px)>24) if bb else 0
  print(os.path.basename(g), 'identical' if not bb else f'diff px>{24}: {n} bbox {bb}'); bad+= n>0
print('SLIDES WITH DIFF', bad)
