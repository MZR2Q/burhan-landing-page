// يحمّل كل ملفات الدليل ويجهّزها لقوالب البناء. لا يُشحن للمتصفح.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..', '..');
const GUIDE = path.join(ROOT, 'الدليل');
const SITE = path.join(__dirname, '..', '..');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(GUIDE, file), 'utf8'));
}

// خريطة الأصول المحلية (تُبنى بواسطة download-assets.js)
const assetMapFile = path.join(SITE, 'data', 'asset-map.json');
const assetMap = fs.existsSync(assetMapFile) ? JSON.parse(fs.readFileSync(assetMapFile, 'utf8')) : {};

function asset(url) {
  if (url && typeof url === 'object') url = url.url || url.directEmbedUrl || '';
  if (!url || typeof url !== 'string') return '';
  return assetMap[url] || url; // يرجع المسار المحلي إن توفّر، وإلا الرابط الأصلي كاحتياط
}

const fsSync = fs;
function localFileExists(relPath) {
  return fsSync.existsSync(path.join(SITE, relPath.replace(/^\//, '')));
}

// يبني <picture> بمصدر WebP + احتياط أصلي — يتدهور بأناقة لرابط بعيد إن لم يتوفر محلياً
function picture(url, alt, opts = {}) {
  const { eager = false, className = '', sizes = '' } = opts;
  const src = asset(url);
  const loading = eager ? 'eager' : 'lazy';
  const fetchPriority = eager ? ' fetchpriority="high"' : '';
  const cls = className ? ` class="${className}"` : '';
  const safeAlt = (alt || '').replace(/"/g, '&quot;');
  const isLocal = src.startsWith('/assets/img/');
  if (isLocal && /\.(jpg|jpeg|png)$/i.test(src)) {
    const webp = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const hasWebp = localFileExists(webp);
    return `<picture>${hasWebp ? `<source srcset="${webp}" type="image/webp">` : ''}<img src="${src}" alt="${safeAlt}" loading="${loading}"${fetchPriority}${cls}></picture>`;
  }
  return `<img src="${src}" alt="${safeAlt}" loading="${loading}"${fetchPriority}${cls}>`;
}

function hijriApprox(dateIso) {
  // تقريب بسيط للتاريخ الهجري لغرض العرض فقط (بلا مكتبة خارجية)
  if (!dateIso) return '';
  try {
    const d = new Date(dateIso);
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

function gregorianAr(dateIso) {
  if (!dateIso) return '';
  try {
    const d = new Date(dateIso);
    return new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
const site = readJSON('01-site-and-homepage.json');
const about = readJSON('02-about-and-identity.json');
const governance = readJSON('03-governance-documents.json');
const mediaCenter = readJSON('04-media-center.json');
const newsRaw = readJSON('05-news.json');
const services = readJSON('06-services-forms-and-gapfill.json');
const mediaAssets = readJSON('07-media-assets-index.json');
const rebuildSchema = readJSON('08-rebuild-schema.json');
const findings = readJSON('09-additional-findings.json');
const donationsRaw = readJSON('10-donation-campaigns.json');

// المسودات (11-draft-content.md) — استُخرج نصها يدوياً هنا كـ HTML جاهز (نفس المحتوى المعتمد بالضبط)
const drafts = require('./drafts-content.js');

// --- الأخبار: أحدث أولاً، ذات صلة تلقائية، تصنيف الأقسام الفارغة ---
const newsArticles = [...newsRaw.articles].sort((a, b) => (b.dateIso || '').localeCompare(a.dateIso || ''));
newsArticles.forEach((a) => {
  a.dateHijriAr = hijriApprox(a.dateIso);
  a.dateGregorianAr = gregorianAr(a.dateIso) || a.dateAr;
  a.coverLocal = asset(a.coverImageUrl);
  a.galleryImages = (a.galleryImages || []).map((g) => (typeof g === 'string' ? g : g && g.url)).filter(Boolean);
  a.galleryLocal = a.galleryImages.map(asset);
});
function relatedFor(article, count = 3) {
  // حقل relatedNews في المصدر يحتوي روابط عامة غير موثوقة (سلايدر جانبي)، لا مقالات فعلية — نتجاهله
  // ونشتق "ذات صلة" تلقائياً بنفس التصنيف، الأقرب تاريخياً
  return newsArticles.filter((a) => a.id !== article.id && a.categoryAr === article.categoryAr).slice(0, count);
}

// --- الموسم الهجري: مطابقة أخبار حقيقية لكل موسم (لا نص مُختلق) — فكرة "الصفحة الرئيسية الحيّة" ---
const SEASON_KEYWORDS = {
  ramadan: ['رمضان', 'غبقة'],
  eidFitr: ['عيد الفطر'],
  hajjEidAdha: ['الأضحى', 'يوم عرفة'],
  muharram: ['محرم', 'رأس السنة الهجرية'],
};
function findSeasonArticle(keywords) {
  return newsArticles.find((a) => keywords.some((k) => (a.titleAr + a.bodyAr).includes(k))) || null;
}
const seasonArticles = {
  ramadan: findSeasonArticle(SEASON_KEYWORDS.ramadan),
  eidFitr: findSeasonArticle(SEASON_KEYWORDS.eidFitr),
  hajjEidAdha: findSeasonArticle(SEASON_KEYWORDS.hajjEidAdha),
  muharram: findSeasonArticle(SEASON_KEYWORDS.muharram),
};

// --- حائط الختمات: أخبار حقيقية موثّقة عن تخريج/ختم/تكريم حفظة (معرّفات محدَّدة يدوياً بعد مراجعة المحتوى) ---
const HALL_OF_COMPLETION_IDS = [1275, 3413, 2917, 2821, 1829, 3185];
const hallOfCompletionArticles = HALL_OF_COMPLETION_IDS.map((id) => newsArticles.find((a) => a.id === id)).filter(Boolean);

// --- خريطة الحلقات الحقيقية: إحداثيات مُصدَّرة فعلياً من خريطة My Maps التي تملكها الجمعية (KML حقيقي، لا إحداثيات مُختلقة) ---
const halaqaMapEmbedUrl = 'https://www.google.com/maps/d/embed?mid=1AtCK5QhZNZG0c09ZI4EusSw9mPvRC4A';
const HALAQA_CATEGORY_META = {
  'مقر الجمعية الرئيسي': { key: 'hq', labelAr: 'المقر الرئيسي', color: '#635FAB' },
  'المجمعات القرآنية - بنين': { key: 'boys', labelAr: 'مجمعات البنين', color: '#3A6D98' },
  'المدارس النسائية': { key: 'girls', labelAr: 'مدارس البنات', color: '#B4A66F' },
};
// إحصاءات حقيقية على مستوى الجمعية كاملة — تُعرض فقط لعلامة المقر الرئيسي (لا بيانات مستقلة لكل مجمع/مدرسة بعد)
const orgWideStats = site.homepage.sections.find((s) => s.type === 'stats-counters').stats;
const findStat = (labelPart) => (orgWideStats.find((s) => s.labelAr.includes(labelPart)) || {}).value || null;
const HQ_STATS = [
  { labelAr: 'طالب وطالبة', value: findStat('طالب') },
  { labelAr: 'معلم ومعلمة', value: findStat('معلم') },
  { labelAr: 'حلقة (بنين وبنات)', value: findStat('حلقة') },
  { labelAr: 'المستفيدون من خدماتنا', value: findStat('المستفيدين') },
];

const halaqasRaw = require('./../data/halaqas.json');
const halaqas = halaqasRaw.flatMap((folder) => {
  const meta = HALAQA_CATEGORY_META[folder.name] || { key: 'other', labelAr: folder.name, color: '#3A6D98' };
  return folder.placemarks.map((p) => ({
    name: p.name.trim(),
    lat: p.lat,
    lng: p.lng,
    category: meta.key,
    categoryLabelAr: meta.labelAr,
    color: meta.color,
    // بيانات حقيقية للمقر فقط؛ لا بيانات مستقلة موثّقة لكل موقع فرعي بعد — تُعرض بواجهة "غير متوفرة" صراحة، لا أرقام مُختلقة
    stats: meta.key === 'hq' ? HQ_STATS : null,
    hasPhoto: false,
  }));
});

// معرّفات مُعاد تصنيفها من الأخبار (اكتشاف الجولة الثانية) لأقسام الجوائز/المشاركات
const AWARD_IDS = [1329, 1871, 1478, 1662];
const PARTICIPATION_KEYWORDS = ['معرض', 'ملتقى', 'مؤتمر', 'مشارك'];
const awardsFromNews = newsArticles.filter((a) => AWARD_IDS.includes(a.id));
const participationsFromNews = newsArticles.filter(
  (a) => !AWARD_IDS.includes(a.id) && PARTICIPATION_KEYWORDS.some((k) => (a.titleAr + a.bodyAr).includes(k))
).slice(0, 12);

// --- التبرعات: تصنيف الفجوات + إزالة التكرار المعروف ---
// روابط نصية إنجليزية قصيرة بدل شرائح عربية أو معرّفات رقمية مبهمة — راجع خطط/03
const SLUG_OVERRIDES = {
  '004': 'halaqa-sponsorship',
  '005': 'student-sponsorship',
  '006': 'fatiha-for-kids',
  sbraam: 'sabr-project',
  zakah: 'zakat-in-charity',
  'معلم-الخير': 'teacher-of-good',
  'معلمة-الخير': 'female-teacher-of-good',
  'تحفيظ-سورة-الفاتحة': 'fatiha-memorization',
  'مدرسة-أمي': 'my-mother-school',
  waldin: 'parents-project',
  qraan: 'endow-and-sponsor',
  borhaan: 'endow-and-sponsor-2',
  wafaa: 'wafaa-initiative',
  kolah: 'khawla-initiative',
  thamara: 'thamara-project',
  alnoor: 'zid-hafithan',
};

const donationCampaigns = donationsRaw.campaigns
  .filter((c) => c.slug !== 'Donate-school' && !/نسخة أخرى/.test(c.titleAr))
  .map((c) => ({
    ...c,
    slug: SLUG_OVERRIDES[c.slug] || c.slug,
    imageLocal: asset(c.imageUrl),
    categoryAr: c.categoryAr && c.categoryAr !== 'غير مصنف تحت قسم رئيسي' ? c.categoryAr : 'فرص العطاء',
  }));

// --- الحوكمة: مرفقة بروابط أصول محلية ---
governance.pages.forEach((p) => {
  (p.documents || []).forEach((d) => (d.localUrl = asset(d.url)));
});

// --- المجتمع الأهلي: مجلس الإدارة + الجمعية العمومية ---
const boardPage = about.pages.find((p) => p.slug === 'board');
const assemblyMembersPage = about.pages.find((p) => p.titleAr === 'الأعضاء');

module.exports = {
  site,
  about,
  governance,
  mediaCenter,
  services,
  mediaAssets,
  rebuildSchema,
  findings,
  drafts,
  newsArticles,
  relatedFor,
  awardsFromNews,
  participationsFromNews,
  donationCampaigns,
  donationCategories: donationsRaw.categories,
  boardPage,
  assemblyMembersPage,
  seasonArticles,
  hallOfCompletionArticles,
  halaqaMapEmbedUrl,
  halaqas,
  HALAQA_CATEGORY_META,
  asset,
  picture,
  hijriApprox,
  gregorianAr,
  ROOT,
  SITE,
  GUIDE,
};
