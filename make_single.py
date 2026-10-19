import base64,re,io,os,glob
from PIL import Image
os.chdir('/workspace/tripup/site/prototype')
def b64(p,mime): return f"data:{mime};base64,"+base64.b64encode(open(p,'rb').read()).decode()
def jpg(p,q=82):
    im=Image.open(p).convert('RGB'); b=io.BytesIO(); im.save(b,'JPEG',quality=q,optimize=True)
    return "data:image/jpeg;base64,"+base64.b64encode(b.getvalue()).decode()
html=open('index.html').read()
js=open(glob.glob('assets/index-*.js')[0]).read()
css=open(glob.glob('assets/index-*.css')[0]).read()
for f in glob.glob('assets/*.woff2'):
    css=css.replace('./'+os.path.basename(f),b64(f,'font/woff2')).replace(os.path.basename(f),b64(f,'font/woff2'))
amap={}
for f in glob.glob('icons/*.png'): amap['./'+f]=b64(f,'image/png')
for f in glob.glob('hifi/*.png'): amap['./'+f]=jpg(f)
for f in glob.glob('photos/*'):
    js=js.replace('"./'+f+'"','"'+b64(f,'image/jpeg')+'"'); css=css.replace('./'+f,b64(f,'image/jpeg'))
js=re.sub(r'`\./icons/prism_\$\{(\w+)\}\.png`',lambda m:'window.__A[`./icons/prism_${'+m.group(1)+'}.png`]',js)
js=re.sub(r'`\./hifi/\$\{(\w+)\}\.png`',lambda m:'window.__A[`./hifi/${'+m.group(1)+'}.png`]',js)
import json
left=re.findall(r'(?<!__A\[`)\./(?:photos|hifi|icons)/',js)
print('leftover refs',len(left))
js=js.replace('</script','<\\/script')
html=re.sub(r'<script type="module"[^>]*></script>','',html)
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<link rel="modulepreload"[^>]*>','',html)
html=html.replace('href="./icons/prism_poll.png"','href="'+amap.get('./icons/prism_poll.png','')+'"')
head=f"<style>{css}</style><script>window.__A={json.dumps(amap)};</script>"
html=html.replace('</head>',head+'</head>').replace('</body>',f'<script type="module">{js}</script></body>')
os.makedirs('/workspace/tripup/deliver',exist_ok=True)
open('/workspace/tripup/deliver/TripUp-prototype.html','w').write(html)
print(len(html)/1e6,'MB')
