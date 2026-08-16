// قالب الصفحة الشامل: <head> + الهيدر + القائمة الجانبية + التذييل + سكربتات
'use strict';
const icons = require('./icons');
const { mainNav, quickLinks } = require('./routes');

const SITE_NAME = 'جمعية برهان لتحفيظ القرآن الكريم';
const SITE_URL = 'https://qran-alhfar.sa'; // النطاق الموحَّد المقترح — راجع خطط/11 القسم 5

function escapeHtml(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function navHtml(activePath) {
  const isActive = (href) => (href === '/' ? activePath === '/' : activePath.startsWith(href));
  const items = mainNav
    .map((item) => {
      const active = isActive(item.href);
      if (!item.children) {
        return `<li><a class="nav-link" href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
      }
      return `<li class="has-children"><a class="nav-link" href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
    })
    .join('');
  return items;
}

function drawerHtml(activePath) {
  const isActive = (href) => (href === '/' ? activePath === '/' : activePath.startsWith(href));
  const items = mainNav
    .map((item, i) => {
      const active = isActive(item.href);
      const sub = item.children
        ? `<button class="accordion-trigger" data-sub-toggle aria-expanded="false" style="padding:var(--space-2) var(--space-4);font-size:var(--fs-sm)">
             <span>الفروع</span>${icons.chevronDown}
           </button>
           <ul class="sub-links" style="display:none">
             ${item.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join('')}
           </ul>`
        : '';
      return `<li>
        <a class="nav-link" href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a>
        ${sub}
      </li>`;
    })
    .join('');
  return items;
}

function header({ activePath, transparent }) {
  return `
  <a class="skip-link" href="#main">تجاوز إلى المحتوى</a>
  <header class="site-header${transparent ? ' is-transparent' : ''}">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="${SITE_NAME} — الرئيسية">
        <img src="/assets/img/logo.png" alt="شعار جمعية برهان" width="44" height="44">
        <span class="brand-name">جمعية برهان<small>لتحفيظ القرآن الكريم</small></span>
      </a>
      <nav class="main-nav" aria-label="القائمة الرئيسية">
        <ul>${navHtml(activePath)}</ul>
      </nav>
      <div class="header-actions">
        <a class="btn btn-donate btn-sm" href="/donate/">${icons.handHeart}<span>تبرّع الآن</span></a>
        <button class="theme-toggle" data-theme-toggle aria-label="تبديل الوضع الليلي">
          <span class="icon-sun">${icons.sun}</span><span class="icon-moon">${icons.moon}</span>
        </button>
        <button class="nav-toggle" data-nav-open aria-label="فتح القائمة">${icons.menu}</button>
      </div>
    </div>
  </header>

  <div class="nav-drawer" data-open="false">
    <div class="nav-drawer-backdrop"></div>
    <div class="nav-drawer-panel" role="dialog" aria-modal="true" aria-label="القائمة" tabindex="-1">
      <button class="nav-drawer-close" data-nav-close aria-label="إغلاق القائمة">${icons.close}</button>
      <ul>${drawerHtml(activePath)}
        <li style="margin-top:var(--space-4);border-top:1px solid var(--border);padding-top:var(--space-4)">
          <a class="nav-link" href="/donate/monthly.html">الاستقطاع الشهري</a>
        </li>
      </ul>
    </div>
  </div>`;
}

function footer() {
  return `
  <footer class="site-footer deco-host on-dark">
    ${icons.ornament('bl', 520)}
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="/assets/img/logo.png" alt="شعار جمعية برهان">
        <p>الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن — نعمل منذ أكثر من أربعة عقود على تعليم كتاب الله وخدمة المجتمع.</p>
        <div class="footer-social">
          <a href="https://x.com/qranalhfar" aria-label="حسابنا على إكس" target="_blank" rel="noopener">${icons.x}</a>
          <a href="https://www.youtube.com/user/qranalhfar/videos" aria-label="قناتنا على يوتيوب" target="_blank" rel="noopener">${icons.youtube}</a>
          <a href="https://instagram.com/qranalhfar" aria-label="حسابنا على إنستغرام" target="_blank" rel="noopener">${icons.instagram}</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>روابط هامة</h4>
        <ul>
          <li><a href="/about/history.html">النشأة والتأسيس</a></li>
          <li><a href="/governance/">الحوكمة</a></li>
          <li><a href="/donate/monthly.html">الاستقطاع الشهري</a></li>
          <li><a href="/media/">المركز الإعلامي</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>روابط سريعة</h4>
        <ul>
          <li><a href="/about/general-assembly.html">الجمعية العمومية</a></li>
          <li><a href="/volunteer/">التطوع</a></li>
          <li><a href="/careers/">طلب توظيف</a></li>
          <li><a href="/survey/">استبيان رضا المستفيدين</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>تواصل معنا</h4>
        <ul>
          <li><span>${icons.mapPin} حفر الباطن — حي العزيزية</span></li>
          <li><a href="https://api.whatsapp.com/send?phone=966556946333" target="_blank" rel="noopener">${icons.whatsapp} 966556946333</a></li>
          <li><a href="mailto:info@qran-alhafar.sa">${icons.mail} info@qran-alhafar.sa</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} جميع الحقوق محفوظة لجمعية برهان لتحفيظ القرآن</span>
      <span class="license-badge">${icons.shieldCheck} ترخيص رقم 3393 — المركز الوطني لتنمية القطاع غير الربحي — 2024/12/12</span>
    </div>
  </footer>`;
}

function page({
  title,
  description,
  path: pagePath,
  body,
  activePath,
  transparentHeader = false,
  ogImage = '/assets/img/logo.png',
  jsonLd = null,
  extraCss = [],
  extraJs = [],
  bodyClass = '',
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const canonical = `${SITE_URL}${pagePath}`;
  const desc = escapeHtml(description || 'الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن — جمعية برهان.');

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<link rel="icon" href="/assets/img/favicon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE_URL}${ogImage}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/layout.css">
<link rel="stylesheet" href="/assets/css/components.css">
${extraCss.map((h) => `<link rel="stylesheet" href="${h}">`).join('\n')}
<noscript><style>.reveal{opacity:1!important;transform:none!important}.hero-slide{opacity:1!important;visibility:visible!important;position:relative!important}</style></noscript>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body class="${bodyClass}">
${header({ activePath: activePath || pagePath, transparent: transparentHeader })}
<main id="main">
${body}
</main>
${footer()}
<script src="/assets/js/theme-toggle.js" defer></script>
<script src="/assets/js/nav.js" defer></script>
<script src="/assets/js/reveal.js" defer></script>
<script src="/assets/js/disclosure.js" defer></script>
<script src="/assets/js/lightbox.js" defer></script>
${extraJs.map((h) => `<script src="${h}" defer></script>`).join('\n')}
</body>
</html>`;
}

module.exports = { page, SITE_NAME, SITE_URL, escapeHtml };
