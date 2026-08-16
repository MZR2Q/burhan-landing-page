'use strict';
const fs = require('fs');
const path = require('path');
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { contactFallback } = require('../lib/components');

const OLD_TO_NEW = {
  '/AboutUs/Index/1556': '/about/',
  '/WhoUs/Index/1557': '/about/overview.html',
  '/WhoUs/Index/2256': '/about/values.html',
  '/WhoUs/Index/1558': '/about/history.html',
  '/WhoUs/Index/1559': '/about/board.html',
  '/WhoUs/Index/1560': '/about/chairman-word.html',
  '/WhoUs/Index/1561': '/about/ceo.html',
  '/WhoUs/Index/1562': '/about/goals.html',
  '/WhoUs/Index/1563': '/about/vision-mission.html',
  '/WhoUs/Index/1564': '/about/commercial-register.html',
  '/WhoUs/Index/1565': '/about/license.html',
  '/WhoUs/Index/2162': '/about/community.html',
  '/WhoUs/Index/6271': '/about/org-chart.html',
  '/WhoUs/Index/1582': '/about/general-assembly.html',
  '/WhoUs/Index/1584': '/about/general-assembly.html',
  '/MemberApplay/Index/1885': '/about/membership.html',
  '/TransDocument/Index/1571': '/governance/',
  '/TransDocument/Index/755': '/governance/policies.html',
  '/TransDocument/Index/3032': '/governance/executive-director.html',
  '/TransDocument/Index/772': '/governance/vision-mission-goals.html',
  '/TransDocument/Index/3273': '/governance/basic-bylaw.html',
  '/TransDocument/Index/940': '/governance/strategic-plan.html',
  '/TransDocument/Index/1234': '/governance/registration-certificate.html',
  '/TransDocument/Index/3244': '/governance/financial-reports.html',
  '/TransDocument/Index/2780': '/governance/annual-reports.html',
  '/TransDocument/Index/3243': '/governance/properties-investments.html',
  '/WhoUs/Index/1572': '/media/',
  '/WhoUs/Index/1574': '/media/gallery.html',
  '/WhoUs/Index/3408': '/media/projects.html',
  '/WhoUs/Index/3409': '/media/initiatives.html',
  '/WhoUs/Index/1575': '/media/videos.html',
  '/WhoUs/Index/1576': '/media/partners.html',
  '/WhoUs/Index/1577': '/media/reports.html',
  '/WhoUs/Index/3410': '/media/participations.html',
  '/WhoUs/Index/3411': '/media/awards.html',
  '/WhoUs/Index/1573': '/news/',
  '/Volunteer/Home/1580': '/volunteer/',
  '/WhoUs/Index/4553': '/careers/apply.html',
  '/About/Index/1578': '/survey/',
  '/Question/Index/6589': '/survey/',
  '/ConnectUs/Contact/1585': '/contact/',
  '/Store/Index': '/donate/',
  '/Store/Deduction': '/donate/monthly.html',
  '/Recruitment/Portal': '/careers/',
  '/Recruitment/Apply': '/careers/apply.html',
  '/EStore/Home': '/',
};

module.exports = function buildSeo(data, emit, pages) {
  const SITE = data.SITE;

  // --- 404 ---
  emit(
    '404.html',
    page({
      title: 'الصفحة غير موجودة',
      description: 'الصفحة المطلوبة غير موجودة.',
      path: '/404.html',
      body: `
      <section style="padding-block:var(--space-12)"><div class="container" style="text-align:center;max-width:520px">
        <div class="eyebrow">خطأ 404</div>
        <h1>هذه الصفحة انتقلت أو لم تعد موجودة</h1>
        <p>قد يكون الرابط الذي وصلت منه قديماً. جرّب البحث من القائمة الرئيسية أو الصفحات التالية:</p>
        <div style="display:flex;gap:var(--space-3);justify-content:center;flex-wrap:wrap;margin-top:var(--space-6)">
          <a class="btn btn-primary" href="/">الرئيسية</a>
          <a class="btn btn-secondary" href="/news/">الأخبار</a>
          <a class="btn btn-secondary" href="/donate/">التبرعات</a>
        </div>
        ${contactFallback()}
      </div></section>
      `,
    })
  );

  // --- sitemap.xml ---
  const urlPaths = ['/', ...pages.filter((p) => p !== 'index.html' && p !== '404.html').map((p) => '/' + p.replace(/index\.html$/, ''))];
  const uniquePaths = [...new Set(urlPaths)];
  const SITE_URL = require('../lib/layout').SITE_URL;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePaths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), sitemap, 'utf8');

  // --- robots.txt ---
  fs.writeFileSync(
    path.join(SITE, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf8'
  );

  // --- _redirects (صيغة Netlify/Cloudflare Pages) ---
  const redirectLines = Object.entries(OLD_TO_NEW).map(([oldPath, newPath]) => `${oldPath}\t${newPath}\t301`);
  // كل صفحة خبر قديمة → الجديدة (نستخدم معرّف الخبر إن توفّر)
  data.newsArticles.forEach((a) => {
    redirectLines.push(`/News/Details/${a.id}\t/news/${a.slug}.html\t301`);
  });
  fs.writeFileSync(path.join(SITE, '_redirects'), redirectLines.join('\n') + '\n', 'utf8');

  console.log(`  خريطة الموقع: ${uniquePaths.length} رابطاً — ملف التحويلات: ${redirectLines.length} قاعدة`);
};
