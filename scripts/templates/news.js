'use strict';
const { page, SITE_URL } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, newsCard, breadcrumb } = require('../lib/components');

module.exports = function buildNews(data, emit) {
  const { newsArticles, relatedFor, asset, picture } = data;

  // --- القائمة ---
  const categories = [...new Set(newsArticles.map((a) => a.categoryAr || 'الأخبار'))];
  emit(
    'news/index.html',
    page({
      title: 'الأخبار',
      description: `${newsArticles.length} خبراً من فعاليات وأنشطة جمعية برهان لتحفيظ القرآن الكريم بحفر الباطن.`,
      path: '/news/',
      body: `
      ${pageHero({ eyebrow: 'المركز الإعلامي', title: 'أخبار الجمعية', desc: `${newsArticles.length} خبراً يوثّقون مسيرة العطاء.`, crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'المركز الإعلامي', href: '/media/' }, { label: 'الأخبار' }] })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        <div class="filter-bar" data-filter-bar=".news-item" data-filter-empty=".no-results">
          <div class="search-box">${icons.search}<input type="search" placeholder="ابحث في الأخبار..." data-filter-search aria-label="بحث في الأخبار"></div>
          <div class="filter-chips">
            <button class="chip" aria-pressed="true" data-filter-value="all">الكل</button>
            ${categories.map((c) => `<button class="chip" aria-pressed="false" data-filter-value="${c}">${c}</button>`).join('')}
          </div>
        </div>
        <div class="grid grid-3">
          ${newsArticles.map((a) => `<div class="news-item">${newsCard(a)}</div>`).join('')}
        </div>
        <p class="no-results">لا توجد أخبار مطابقة لبحثك.</p>
      </div></section>
      `,
      extraJs: ['/assets/js/filters.js'],
    })
  );

  // --- التفاصيل ---
  newsArticles.forEach((a) => {
    const related = relatedFor(a);
    const gallery = a.galleryImages || [];
    emit(
      `news/${a.slug}.html`,
      page({
        title: a.titleAr,
        description: (a.summaryAr || a.bodyAr || '').slice(0, 155),
        path: `/news/${a.slug}.html`,
        ogImage: asset(a.coverImageUrl),
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: a.titleAr,
          datePublished: a.dateIso,
          image: [`${SITE_URL}${asset(a.coverImageUrl)}`],
          publisher: { '@type': 'Organization', name: 'جمعية برهان لتحفيظ القرآن الكريم' },
        },
        body: `
        <article>
          <header class="page-hero" style="padding-block:var(--space-6) var(--space-8)">
            <div class="container">
              ${breadcrumb([{ label: 'الرئيسية', href: '/' }, { label: 'الأخبار', href: '/news/' }, { label: a.titleAr }])}
              <span class="badge" style="background:rgba(255,255,255,.15);color:#fff">${a.categoryAr || 'الأخبار'}</span>
              <h1 style="margin-top:var(--space-3)">${a.titleAr}</h1>
              <p style="color:rgba(255,255,255,.75)">${a.dateGregorianAr || a.dateAr}${a.dateHijriAr ? ' الموافق ' + a.dateHijriAr : ''}</p>
            </div>
          </header>

          ${a.coverImageUrl ? `<div class="container" style="margin-top:calc(var(--space-8) * -1);position:relative;z-index:2"><div class="reveal news-cover-frame">${picture(a.coverImageUrl, a.titleAr, { eager: true })}</div></div>` : ''}

          <div class="container" style="margin-top:var(--space-10)">
            <div class="prose reveal" style="margin-inline:auto">
              ${(a.paragraphsAr && a.paragraphsAr.length ? a.paragraphsAr : [a.bodyAr]).map((p) => `<p>${p}</p>`).join('')}
            </div>

            ${
              gallery.length
                ? `<h2 class="reveal" style="margin-top:var(--space-10)">معرض الصور</h2>
                   <div class="grid grid-3 reveal">
                     ${gallery
                       .map(
                         (g, i) => `
                       <a href="#" data-lightbox-src="${asset(g)}" data-lightbox-group="news-${a.id}" data-lightbox-alt="${a.titleAr}" style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:4/3">
                         ${picture(g, a.titleAr)}
                       </a>`
                       )
                       .join('')}
                   </div>`
                : ''
            }

            <div class="reveal" style="display:flex;gap:var(--space-3);margin-top:var(--space-10);padding-top:var(--space-6);border-top:1px solid var(--border)">
              <span style="font-weight:700;color:var(--text-muted)">شارك الخبر:</span>
              <a class="btn btn-sm btn-secondary" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.titleAr)}&url=${SITE_URL}/news/${a.slug}.html" target="_blank" rel="noopener">${icons.x}</a>
              <a class="btn btn-sm btn-secondary" href="https://api.whatsapp.com/send?text=${encodeURIComponent(a.titleAr + ' ' + SITE_URL + '/news/' + a.slug + '.html')}" target="_blank" rel="noopener">${icons.whatsapp}</a>
            </div>

            ${
              related.length
                ? `<h2 class="reveal" style="margin-top:var(--space-10)">أخبار ذات صلة</h2>
                   <div class="grid grid-3">${related.map((r) => newsCard(typeof r === 'object' ? r : newsArticles.find((n) => n.id === r) || {})).join('')}</div>`
                : ''
            }
          </div>
        </article>
        `,
      })
    );
  });
};
