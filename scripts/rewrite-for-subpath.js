// يُشغَّل فوق ناتج البناء لتحويل كل المسارات المطلقة من جذر النطاق (/assets/...)
// إلى مسار فرعي (BASE_PATH/assets/...) — ضروري فقط لاستضافة GitHub Pages لمستودع مشروع
// (project pages تُستضاف تحت /repo-name/ لا الجذر). لا يُستخدم عند النشر على نطاق مخصّص لاحقاً.
//
// آمن التشغيل أكثر من مرة (idempotent): يتخطّى أي مسار مُسبَّق أصلاً بـ BASE_PATH
// بدل مضاعفته — مهم لأن assets/css و assets/js ملفات ثابتة لا يعيد build.js توليدها،
// فقد تكون مُصحَّحة من تشغيل سابق حتى بعد إعادة بناء ملفات HTML من الجذر.
'use strict';
const fs = require('fs');
const path = require('path');

// لا نقرأ المسار من argv عمداً: Git Bash على ويندوز يحوّل أي وسيط يبدأ بـ "/" تلقائياً
// إلى مسار ويندوز حقيقي (مثال: /burhan-landing-page → C:/Program Files/Git/burhan-landing-page)
// فيفسد كل الاستبدالات. القيمة ثابتة هنا عمداً لتفادي هذا الفخ.
const BASE_PATH = '/burhan-landing-page';
const BASE_ESCAPED = BASE_PATH.replace(/\//g, '\\/');
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'scripts', 'node_modules']);

function walk(dir, exts, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), exts, cb);
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      cb(path.join(dir, entry.name));
    }
  }
}

// النفي الاستباقي (?!burhan-landing-page\/) يمنع إعادة البادئة لمسار مُسبَّق مسبقاً
const NEG = `(?!/)(?!${BASE_ESCAPED.slice(2)}/)`;

let htmlCount = 0, cssCount = 0, jsCount = 0;

walk(ROOT, ['.html'], (file) => {
  let c = fs.readFileSync(file, 'utf8');
  const before = c;
  c = c.replace(new RegExp(`(href|src|srcset|data-lightbox-src)="/${NEG}`, 'g'), `$1="${BASE_PATH}/`);
  if (c !== before) { fs.writeFileSync(file, c); htmlCount++; }
});

walk(path.join(ROOT, 'assets', 'css'), ['.css'], (file) => {
  let c = fs.readFileSync(file, 'utf8');
  const before = c;
  c = c.replace(new RegExp(`url\\((['"]?)/${NEG}`, 'g'), `url($1${BASE_PATH}/`);
  if (c !== before) { fs.writeFileSync(file, c); cssCount++; }
});

walk(path.join(ROOT, 'assets', 'js'), ['.js'], (file) => {
  let c = fs.readFileSync(file, 'utf8');
  const before = c;
  c = c.replace(new RegExp(`(fetch|loadImage)\\((['"])/${NEG}`, 'g'), `$1($2${BASE_PATH}/`);
  // روابط تُبنى وقت التشغيل داخل قوالب نصية بجافاسكربت (مثال: season.js يبني <a href="/news/...">)
  c = c.replace(new RegExp(`(href|src)="/${NEG}`, 'g'), `$1="${BASE_PATH}/`);
  if (c !== before) { fs.writeFileSync(file, c); jsCount++; }
});

console.log(`تم: ${htmlCount} ملف HTML، ${cssCount} ملف CSS، ${jsCount} ملف JS — بادئة المسار: ${BASE_PATH}`);
