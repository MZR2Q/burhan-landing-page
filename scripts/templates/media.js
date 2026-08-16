'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, emptyState, documentCard, newsCard } = require('../lib/components');

const LANDING_CARDS = [
  { label: 'الأخبار', href: '/news/', icon: icons.document },
  { label: 'معرض الصور', href: '/media/gallery.html', icon: icons.image },
  { label: 'المشاريع', href: '/media/projects.html', icon: icons.handHeart },
  { label: 'المبادرات', href: '/media/initiatives.html', icon: icons.handHeart },
  { label: 'مكتبة الفيديو', href: '/media/videos.html', icon: icons.play },
  { label: 'شركاء النجاح', href: '/media/partners.html', icon: icons.shieldCheck },
  { label: 'التقارير الختامية', href: '/media/reports.html', icon: icons.document },
  { label: 'المشاركات', href: '/media/participations.html', icon: icons.award },
  { label: 'الجوائز', href: '/media/awards.html', icon: icons.award },
  { label: 'حائط الختمات والتكريم', href: '/media/hall-of-completion.html', icon: icons.award },
];

function crumb(label) {
  return [{ label: 'الرئيسية', href: '/' }, { label: 'المركز الإعلامي', href: '/media/' }, { label }];
}

module.exports = function buildMedia(data, emit) {
  const { mediaCenter, mediaAssets, picture, asset, awardsFromNews, participationsFromNews } = data;
  const sub = (slug) => mediaCenter.subsections.find((s) => s.slug === slug);

  // --- الهبوط ---
  emit(
    'media/index.html',
    page({
      title: 'المركز الإعلامي',
      description: 'أخبار جمعية برهان، معرض الصور، مكتبة الفيديو، شركاء النجاح، والتقارير الختامية.',
      path: '/media/',
      body: `
      ${pageHero({ eyebrow: 'المركز الإعلامي', title: 'كل ما توثّقه عدستنا وأقلامنا', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'المركز الإعلامي' }] })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        <div class="grid grid-3">
          ${LANDING_CARDS.map(
            (c) => `
            <a class="card-person reveal" href="${c.href}" style="text-align:start;display:flex;align-items:center;gap:var(--space-4);padding:var(--space-5)">
              <span style="flex:none;width:44px;height:44px;border-radius:12px;background:var(--brand-50);color:var(--brand-600);display:flex;align-items:center;justify-content:center">${c.icon}</span>
              <strong style="font-family:var(--font-body)">${c.label}</strong>
            </a>`
          ).join('')}
        </div>
      </div></section>
      `,
    })
  );

  // --- معرض الصور: مبني من فهرس الأصول (لا مصدر مباشر) ---
  const galleryImages = mediaAssets.images.filter((im) => !/شعار|logo|favicon/i.test(im.labelAr || ''));
  emit(
    'media/gallery.html',
    page({
      title: 'معرض الصور',
      description: 'لقطات من فعاليات وأنشطة جمعية برهان لتحفيظ القرآن الكريم.',
      path: '/media/gallery.html',
      body: `
      ${pageHero({ title: 'معرض الصور', desc: 'لقطات موثّقة من فعاليات الجمعية وأنشطتها.', crumbs: crumb('معرض الصور') })}
      <section class="deco-host on-light">${icons.ornament('tr', 399)}<div class="container">
        <div class="grid grid-4">
          ${galleryImages
            .map(
              (im, i) => `
            <a href="#" data-lightbox-src="${asset(im.directEmbedUrl || im.url)}" data-lightbox-group="gallery" data-lightbox-alt="${im.labelAr || ''}" class="reveal" style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:1;display:block">
              ${picture(im.directEmbedUrl || im.url, im.labelAr || 'صورة من فعاليات الجمعية')}
            </a>`
            )
            .join('')}
        </div>
      </div></section>
      `,
    })
  );

  // --- المشاريع ---
  const projects = sub('projects');
  emit(
    'media/projects.html',
    page({
      title: 'المشاريع',
      description: 'مشاريع جمعية برهان التنموية والاستثمارية.',
      path: '/media/projects.html',
      body: `
      ${pageHero({ title: 'المشاريع', crumbs: crumb('المشاريع') })}
      <section class="deco-host on-light">${icons.ornament('bl', 456)}<div class="container">
        ${
          projects?.items?.length
            ? `<div class="grid grid-2">${projects.items
                .map(
                  (it) => `
              <div class="card-campaign reveal">
                <div class="thumb">${picture(it.coverImageUrl, it.titleAr)}</div>
                <div class="body">
                  <h3>${it.titleAr}</h3>
                  <p class="desc">${it.fullTextAr || it.summaryAr || ''}</p>
                  <a class="btn btn-primary" href="${it.detailUrl ? `/news/` : '/donate/'}">${icons.arrowStart}<span>التفاصيل</span></a>
                </div>
              </div>`
                )
                .join('')}</div>`
            : emptyState({ title: 'لا مشاريع منشورة حالياً', desc: 'تابع صفحة التبرعات لأحدث المشاريع والحملات.', icon: icons.handHeart })
        }
      </div></section>
      `,
    })
  );

  // --- المبادرات (فارغة فعلياً) ---
  emit(
    'media/initiatives.html',
    page({
      title: 'المبادرات',
      description: 'مبادرات جمعية برهان المجتمعية.',
      path: '/media/initiatives.html',
      body: `
      ${pageHero({ title: 'المبادرات', crumbs: crumb('المبادرات') })}
      <section class="deco-host on-light">${icons.ornament('br', 380)}<div class="container">
        ${emptyState({ title: 'قريباً', desc: 'نعمل على توثيق مبادرات الجمعية المجتمعية هنا. تابعونا في الأخبار للاطلاع على آخر الفعاليات.', icon: icons.handHeart })}
      </div></section>
      `,
    })
  );

  // --- مكتبة الفيديو ---
  const videos = sub('video-library') || sub('videos') || mediaCenter.subsections.find((s) => /فيديو/.test(s.titleAr));
  emit(
    'media/videos.html',
    page({
      title: 'مكتبة الفيديو',
      description: 'فيديوهات من فعاليات وحفلات تخريج جمعية برهان لتحفيظ القرآن الكريم.',
      path: '/media/videos.html',
      body: `
      ${pageHero({ title: 'مكتبة الفيديو', crumbs: crumb('مكتبة الفيديو') })}
      <section class="deco-host on-light">${icons.ornament('tl', 399)}<div class="container">
        <div class="grid grid-3">
          ${(videos?.items || [])
            .map(
              (v) => `
            <div class="reveal">
              <div class="card-video" data-yt-facade="${v.videoId}" role="button" tabindex="0" aria-label="تشغيل: ${v.titleAr}">
                <img src="${v.coverImageUrl}" data-yt-thumb-fallback="${v.thumbnailFallbackUrl || ''}" alt="${v.titleAr}" loading="lazy">
                <span class="play-btn">${icons.play}</span>
              </div>
              <h4 style="margin-top:var(--space-3);font-size:.95rem">${v.titleAr}</h4>
            </div>`
            )
            .join('')}
        </div>
      </div></section>
      `,
      extraJs: ['/assets/js/youtube-facade.js'],
    })
  );

  // --- شركاء النجاح ---
  const partners = sub('success-partners') || mediaCenter.subsections.find((s) => /شركاء/.test(s.titleAr));
  emit(
    'media/partners.html',
    page({
      title: 'شركاء النجاح',
      description: 'شركاء نجاح جمعية برهان لتحفيظ القرآن الكريم.',
      path: '/media/partners.html',
      body: `
      ${pageHero({ title: 'شركاء النجاح', desc: 'بفضل الله ثم بدعمهم نواصل الرسالة.', crumbs: crumb('شركاء النجاح') })}
      <section class="deco-host on-light">${icons.ornament('tr', 456)}<div class="container">
        <div class="partners-grid">
          ${(partners?.items || []).map((p) => `<div class="partner-tile reveal">${picture(p.coverImageUrl, 'شريك نجاح')}</div>`).join('')}
        </div>
      </div></section>
      `,
    })
  );

  // --- التقارير الختامية ---
  const reports = sub('final-reports') || mediaCenter.subsections.find((s) => /تقارير/.test(s.titleAr));
  emit(
    'media/reports.html',
    page({
      title: 'التقارير الختامية',
      description: 'التقارير السنوية الختامية لجمعية برهان لتحفيظ القرآن الكريم من 2015 حتى اليوم.',
      path: '/media/reports.html',
      body: `
      ${pageHero({ title: 'التقارير الختامية', desc: 'مسيرة عقد كامل من العمل الموثّق.', crumbs: crumb('التقارير الختامية') })}
      <section class="deco-host on-light">${icons.ornament('bl', 380)}<div class="container">
        <div class="grid grid-2">
          ${(reports?.items || [])
            .sort((a, b) => (b.dateAr || '').localeCompare(a.dateAr || ''))
            .map((r) => documentCard({ titleAr: r.titleAr, downloadUrl: r.fileUrl }))
            .join('')}
        </div>
      </div></section>
      `,
    })
  );

  // --- المشاركات (مُعاد بناؤها من الأخبار) ---
  emit(
    'media/participations.html',
    page({
      title: 'المشاركات',
      description: 'مشاركات جمعية برهان في المعارض والملتقيات والمؤتمرات.',
      path: '/media/participations.html',
      body: `
      ${pageHero({ title: 'المشاركات', desc: 'حضورنا في المعارض والملتقيات والمؤتمرات.', crumbs: crumb('المشاركات') })}
      <section class="deco-host on-light">${icons.ornament('br', 399)}<div class="container">
        ${
          participationsFromNews.length
            ? `<div class="grid grid-3">${participationsFromNews.map((a) => newsCard(a)).join('')}</div>`
            : emptyState({ title: 'لا مشاركات موثّقة بعد', desc: 'تابع الأخبار لآخر مشاركات الجمعية.', icon: icons.award })
        }
      </div></section>
      `,
    })
  );

  // --- الجوائز (مُعاد بناؤها من الأخبار) ---
  emit(
    'media/awards.html',
    page({
      title: 'الجوائز',
      description: 'جوائز وتكريمات جمعية برهان لتحفيظ القرآن الكريم بحفر الباطن.',
      path: '/media/awards.html',
      body: `
      ${pageHero({ title: 'الجوائز والتكريمات', desc: 'تقدير نعتز به ومسؤولية نحملها.', crumbs: crumb('الجوائز') })}
      <section class="deco-host on-light">${icons.ornament('tl', 456)}<div class="container">
        ${
          awardsFromNews.length
            ? `<div class="grid grid-3">${awardsFromNews.map((a) => newsCard(a)).join('')}</div>`
            : emptyState({ title: 'لا جوائز موثّقة بعد', desc: '', icon: icons.award })
        }
      </div></section>
      `,
    })
  );
};
