import os, sys
from PIL import Image

IMG_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')
MAX_W = 1920
JPEG_Q = 82
WEBP_Q = 78

total_before = 0
total_after = 0
converted = 0

for name in os.listdir(IMG_DIR):
    path = os.path.join(IMG_DIR, name)
    if not os.path.isfile(path):
        continue
    ext = name.rsplit('.', 1)[-1].lower()
    if ext not in ('jpg', 'jpeg', 'png'):
        continue
    try:
        size_before = os.path.getsize(path)
        total_before += size_before
        im = Image.open(path)
        im.load()
        has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
        w, h = im.size
        if w > MAX_W:
            new_h = int(h * (MAX_W / w))
            im = im.resize((MAX_W, new_h), Image.LANCZOS)

        # أعد حفظ النسخة الأصلية مضغوطة (لا نغيّر الامتداد، حفاظاً على روابط المصدر)
        if ext in ('jpg', 'jpeg'):
            rgb = im.convert('RGB')
            rgb.save(path, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
        else:  # png
            im.save(path, 'PNG', optimize=True)

        # نسخة WebP إضافية بجانب كل صورة (لعنصر <picture>)
        webp_path = os.path.splitext(path)[0] + '.webp'
        webp_im = im if has_alpha else im.convert('RGB')
        webp_im.save(webp_path, 'WEBP', quality=WEBP_Q, method=6)

        size_after = os.path.getsize(path) + os.path.getsize(webp_path)
        total_after += size_after
        converted += 1
    except Exception as e:
        print(f'  تخطّي {name}: {e}')

print(f'تمت معالجة {converted} صورة')
print(f'قبل: {total_before/1024/1024:.1f}MB  بعد (أصلي+webp): {total_after/1024/1024:.1f}MB')
