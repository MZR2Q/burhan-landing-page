// ينزّل كل صورة/وثيقة موثّقة في الدليل مرة واحدة، ويكتب خريطة (رابط أصلي → مسار محلي)
// يُستخدم أثناء البناء فقط — لا يُشحن للمتصفح. راجع خطط/09-الوسائط-والأصول.md
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT = path.join(__dirname, '..', '..');
const GUIDE = path.join(ROOT, 'الدليل');
const SITE = path.join(__dirname, '..');
const IMG_DIR = path.join(SITE, 'assets', 'img');
const DOC_DIR = path.join(SITE, 'assets', 'docs');
const MAP_FILE = path.join(SITE, 'data', 'asset-map.json');

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(DOC_DIR, { recursive: true });

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(GUIDE, file), 'utf8'));
}

function slugify(str) {
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^ء-يa-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'item';
}

function extOf(url, fallback) {
  const m = url.split('?')[0].match(/\.([a-zA-Z0-9]{2,4})$/);
  return m ? m[1].toLowerCase() : fallback;
}

// --- 1. اجمع كل الأصول من كل ملفات الدليل مع تسمية سياقية ---
const assets = new Map(); // url -> { label, kind, ext }

function addAsset(url, label, kind) {
  if (!url || typeof url !== 'string' || !/^https?:\/\//.test(url)) return;
  if (assets.has(url)) return;
  const ext = extOf(url, kind === 'doc' ? 'pdf' : 'jpg');
  assets.set(url, { label: slugify(label), kind, ext });
}

// شعار وهوية
const site = readJSON('01-site-and-homepage.json');
addAsset(site.site.logoUrl, 'logo', 'img');
addAsset(site.site.faviconUrl, 'favicon', 'img');

// فهرس الوسائط الجاهز (المصدر الأشمل)
const mediaIndex = readJSON('07-media-assets-index.json');
(mediaIndex.images || []).forEach((im, i) =>
  addAsset(im.directEmbedUrl || im.url, `${im.labelAr || im.usedInAr || 'image'}-${i}`, 'img')
);
(mediaIndex.documents || []).forEach((doc, i) =>
  addAsset(doc.directEmbedUrl || doc.url, `${doc.labelAr || 'document'}-${i}`, 'doc')
);

// السلايدر والصفحة الرئيسية
(site.homepage.sections || []).forEach((sec) => {
  (sec.items || []).forEach((it, i) => addAsset(it.imageUrl, `home-${sec.type}-${i}`, 'img'));
  (sec.stats || []).forEach((s, i) => addAsset(s.iconUrl, `stat-icon-${i}`, 'img'));
  (sec.images || []).forEach((im, i) =>
    addAsset(typeof im === 'string' ? im : im.url, `home-${sec.type}-img-${i}`, 'img')
  );
});

// الأخبار
const news = readJSON('05-news.json');
news.articles.forEach((a) => {
  addAsset(a.coverImageUrl, `news-${a.slug}-cover`, 'img');
  (a.galleryImages || []).forEach((g, i) => addAsset(g, `news-${a.slug}-g${i}`, 'img'));
  (a.attachments || []).forEach((at, i) =>
    addAsset(typeof at === 'string' ? at : at.url, `news-${a.slug}-att${i}`, 'doc')
  );
});

// الحوكمة
const gov = readJSON('03-governance-documents.json');
gov.pages.forEach((p) => {
  (p.documents || []).forEach((d, i) => addAsset(d.url || d.directEmbedUrl, `gov-${p.slug}-${i}`, 'doc'));
  (p.images || []).forEach((im, i) => addAsset(im.url, `gov-${p.slug}-img-${i}`, 'img'));
});

// المركز الإعلامي
const media = readJSON('04-media-center.json');
media.subsections.forEach((sub) => {
  (sub.items || []).forEach((it, i) => {
    addAsset(it.coverImageUrl, `media-${sub.slug}-${i}`, 'img');
    addAsset(it.fileUrl, `media-${sub.slug}-${i}-file`, 'doc');
  });
});

// حملات التبرع
const donations = readJSON('10-donation-campaigns.json');
(donations.campaigns || []).forEach((c) => addAsset(c.imageUrl, `donate-${c.slug}`, 'img'));

// عن الجمعية
const about = readJSON('02-about-and-identity.json');
about.pages.forEach((p) => {
  (p.images || []).forEach((im, i) => addAsset(im.url, `about-${p.slug}-img-${i}`, 'img'));
});

console.log(`إجمالي الأصول المكتشفة: ${assets.size}`);

// --- 2. نزّل كل أصل (تسلسلي، بمهلة ومحاولات إعادة) ---
function download(url, dest, tries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      const lib = url.startsWith('https') ? https : http;
      const req = lib.get(url, { timeout: 20000 }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          return download(res.headers.location, dest, tries).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          if (n > 1) return setTimeout(() => attempt(n - 1), 1000);
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', reject);
      });
      req.on('timeout', () => req.destroy(new Error('timeout')));
      req.on('error', (err) => {
        if (n > 1) setTimeout(() => attempt(n - 1), 1000);
        else reject(err);
      });
    };
    attempt(tries);
  });
}

async function main() {
  const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {};
  const used = new Set();
  let done = 0;
  let failed = 0;
  const total = assets.size;

  for (const [url, meta] of assets) {
    const dir = meta.kind === 'doc' ? DOC_DIR : IMG_DIR;
    let base = `${meta.label}.${meta.ext}`;
    let n = 1;
    while (used.has(base)) base = `${meta.label}-${++n}.${meta.ext}`;
    used.add(base);
    const dest = path.join(dir, base);
    const relPath = `/assets/${meta.kind === 'doc' ? 'docs' : 'img'}/${base}`;

    if (fs.existsSync(dest) && map[url] === relPath) {
      done++;
      continue;
    }
    try {
      await download(url, dest);
      map[url] = relPath;
      done++;
      if (done % 10 === 0) console.log(`  ${done}/${total} ...`);
    } catch (err) {
      failed++;
      console.warn(`فشل تنزيل: ${url} — ${err.message}`);
    }
  }

  fs.mkdirSync(path.dirname(MAP_FILE), { recursive: true });
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), 'utf8');
  console.log(`تم: ${done} نجح، ${failed} فشل. الخريطة محفوظة في ${MAP_FILE}`);
}

main();
