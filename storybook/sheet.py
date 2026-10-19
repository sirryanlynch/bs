import sys,glob
from PIL import Image
fs=sorted(glob.glob(sys.argv[1]));cols=int(sys.argv[3]) if len(sys.argv)>3 else 5
ims=[Image.open(f) for f in fs];w=402;h=874
S=Image.new('RGB',(cols*w,((len(ims)+cols-1)//cols)*h),'white')
for i,im in enumerate(ims):
  im=im.convert('RGB').resize((w,int(im.height*w/im.width)));S.paste(im,((i%cols)*w,(i//cols)*h))
S.save(sys.argv[2])
