'use strict';
const fs = require('fs');
const path = require('path');

const data = require('./lib/data');
const SITE = data.SITE;

// تنظيف مجلدات الصفحات المولَّدة قبل كل بناء (لا يمس assets/ ولا data/asset-map.json)
['about', 'governance', 'media', 'news', 'donate', 'volunteer', 'careers', 'survey', 'contact'].forEach((dir) => {
  fs.rmSync(path.join(SITE, dir), { recursive: true, force: true });
});
['index.html', '404.html', 'sitemap.xml', 'robots.txt', '_redirects'].forEach((f) => {
  fs.rmSync(path.join(SITE, f), { force: true });
});

function write(relPath, html) {
  const full = path.join(SITE, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, 'utf8');
}

const pages = [];
function emit(relPath, html) {
  pages.push(relPath);
  write(relPath, html);
}

console.log('▶ بناء الموقع...');

// بيانات خريطة الحلقات للاستخدام في المتصفح (Leaflet يجلبها عبر fetch)
fs.mkdirSync(path.join(SITE, 'data'), { recursive: true });
fs.writeFileSync(path.join(SITE, 'data', 'halaqas.json'), JSON.stringify(data.halaqas), 'utf8');

// الرئيسية
emit('index.html', require('./templates/home')(data));

// عن الجمعية + الجمعية العمومية
require('./templates/about')(data, emit);

// الحوكمة
require('./templates/governance')(data, emit);

// المركز الإعلامي + الأخبار
require('./templates/media')(data, emit);
require('./templates/hallmark')(data, emit);
require('./templates/news')(data, emit);

// التبرعات
require('./templates/donate')(data, emit);

// النماذج (تطوع، توظيف، تواصل، استبيان)
require('./templates/forms')(data, emit);

// خرائط السيو
require('./templates/seo')(data, emit, pages);

console.log(`✔ تم توليد ${pages.length} صفحة.`);
