'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, documentCard } = require('../lib/components');

const CATEGORIES = [
  { slug: 'policies', label: 'السياسات واللوائح والأنظمة' },
  { slug: 'executive-director', label: 'المدير التنفيذي' },
  { slug: 'vision-mission-goals', label: 'الرؤية والرسالة والأهداف' },
  { slug: 'basic-bylaw', label: 'اللائحة الأساسية للجمعية' },
  { slug: 'strategic-plan', label: 'الخطة الاستراتيجية' },
  { slug: 'registration-certificate', label: 'شهادة تسجيل الجمعية' },
  { slug: 'financial-reports', label: 'التقارير المالية للجمعية' },
  { slug: 'annual-reports', label: 'التقارير السنوية والبرامج' },
  { slug: 'properties-investments', label: 'قائمة العقارات والاستثمارات' },
];

module.exports = function buildGovernance(data, emit) {
  const { governance } = data;

  emit(
    'governance/index.html',
    page({
      title: 'الحوكمة',
      description: 'وثائق حوكمة جمعية برهان: السياسات، اللوائح، التقارير المالية والسنوية، وأكثر من 59 وثيقة رسمية.',
      path: '/governance/',
      body: `
      ${pageHero({ eyebrow: 'الشفافية أولاً', title: 'الحوكمة والالتزام', desc: 'أكثر من 59 وثيقة رسمية — نُشرت بالكامل لأن من حق كل متبرّع أن يعرف كيف تُدار الجمعية.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'الحوكمة' }] })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        <div class="grid grid-3">
          ${CATEGORIES.map((c) => {
            const src = governance.pages.find((p) => p.slug === c.slug);
            const count = src ? (src.documents || []).length : 0;
            return `
            <a class="card-document reveal" href="/governance/${c.slug}.html" style="align-items:center">
              <span class="cover" style="width:56px;height:56px;border-radius:50%">${count}</span>
              <span class="doc-body"><h4>${c.label}</h4><span class="meta">${count} ${count === 1 ? 'وثيقة' : 'وثائق'}</span></span>
            </a>`;
          }).join('')}
        </div>
      </div></section>
      `,
    })
  );

  CATEGORIES.forEach((c) => {
    const src = governance.pages.find((p) => p.slug === c.slug);
    const docs = src ? src.documents || [] : [];
    emit(
      `governance/${c.slug}.html`,
      page({
        title: c.label,
        description: `${c.label} — وثائق حوكمة جمعية برهان لتحفيظ القرآن الكريم.`,
        path: `/governance/${c.slug}.html`,
        body: `
        ${pageHero({ title: c.label, crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'الحوكمة', href: '/governance/' }, { label: c.label }] })}
        <section class="deco-host on-light">${icons.ornament('tr', 399)}<div class="container">
          ${
            docs.length
              ? `<div class="filter-bar">
                   <div class="search-box">${icons.search}<input type="search" placeholder="ابحث في الوثائق..." data-filter-search aria-label="بحث في الوثائق"></div>
                 </div>
                 <div class="grid grid-2" data-filter-bar=".doc-item">
                   ${docs.map((d) => `<div class="doc-item">${documentCard(d)}</div>`).join('')}
                 </div>
                 <p class="no-results">لا توجد وثائق مطابقة لبحثك.</p>`
              : `<p style="color:var(--text-muted)">لا توجد وثائق منشورة ضمن هذه الفئة حالياً.</p>`
          }
        </div></section>
        `,
        extraJs: ['/assets/js/filters.js'],
      })
    );
  });
};
