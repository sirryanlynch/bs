import json,sys
from PIL import Image
for w in (390,430):
  cols=[]
  for i in range(1,11):
    m=json.load(open(f'/tmp/m-{w}-{i}.json')); H=m['H']; h=m['h']
    shots=m['shots']; S=2
    canvas=Image.new('RGB',(w*S,max(H,h)*S),'white')
    for k,(f,top) in enumerate(shots):
      im=Image.open(f).convert('RGB'); cut=0 if k==0 else 70*S
      canvas.paste(im.crop((0,cut,im.width,im.height)),(0,top*S+cut))
    canvas=canvas.crop((0,0,w*S,min(max(H,h),h*4)*S)); cols.append(canvas)
    if w==390: canvas.save(f'/workspace/tripup/qa/v55/mobile-{i:02d}-full.png')
  sc=0.25; tw=int(w*2*sc); hh=max(int(c.height*sc) for c in cols)
  sheet=Image.new('RGB',(tw*10+90,hh+60),(238,237,242))
  for k,c in enumerate(cols): sheet.paste(c.resize((tw,int(c.height*sc))),(10+k*(tw+8),50))
  sheet.save(f'/workspace/tripup/qa/v55/contact-{w}.jpg',quality=78)
print('ok')
