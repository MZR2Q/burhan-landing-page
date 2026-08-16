'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { newsCard } = require('../lib/components');

module.exports = function buildHome(data) {
  const { site, asset, picture, newsArticles, awardsFromNews, seasonArticles, HALAQA_CATEGORY_META } = data;

  const seasonPayload = {
    ramadan: {
      greeting: 'رمضان مبارك — شهر الجود ومضاعفة الأجر، وحلقاتنا تفتح أبوابها لختمة جديدة',
      icon: icons.moon,
      article: seasonArticles.ramadan ? { slug: seasonArticles.ramadan.slug, titleAr: seasonArticles.ramadan.titleAr } : null,
    },
    eidFitr: {
      greeting: 'عيد فطر مبارك — كل عام وضيوف الرحمن بخير',
      icon: icons.award,
      article: seasonArticles.eidFitr ? { slug: seasonArticles.eidFitr.slug, titleAr: seasonArticles.eidFitr.titleAr } : null,
    },
    hajjEidAdha: {
      greeting: 'عيد أضحى مبارك — تقبّل الله من الحجاج ومنّا ومنكم صالح الأعمال',
      icon: icons.handHeart,
      article: seasonArticles.hajjEidAdha ? { slug: seasonArticles.hajjEidAdha.slug, titleAr: seasonArticles.hajjEidAdha.titleAr } : null,
    },
    muharram: {
      greeting: 'عام هجري جديد مبارك — عام جديد من العطاء والحفظ بإذن الله',
      icon: icons.moon,
      article: seasonArticles.muharram ? { slug: seasonArticles.muharram.slug, titleAr: seasonArticles.muharram.titleAr } : null,
    },
  };
  const sections = site.homepage.sections;
  const hero = sections.find((s) => s.type === 'hero-slider');
  const stats = sections.find((s) => s.type === 'stats-counters');
  const teaser = sections.find((s) => s.type === 'about-teaser');
  const video = sections.find((s) => s.type === 'video');
  const projects = sections.find((s) => s.type === 'projects');
  const partners = sections.find((s) => s.type === 'partners-logos');

  const heroSlides = hero.items
    .filter((it) => it.imageUrl)
    .map(
      (it, i) => `
      <div class="hero-slide" data-active="${i === 0}">
        ${picture(it.imageUrl, it.titleAr || 'جمعية برهان', { eager: i === 0 })}
        ${
          it.titleAr
            ? `<div class="hero-caption"><div class="container">
                 <h2>${it.titleAr}</h2>
                 <div class="actions">
                   ${it.linkUrl ? `<a class="btn btn-on-dark" href="${it.linkUrl}" target="_blank" rel="noopener">${icons.arrowStart}<span>عرض التفاصيل</span></a>` : ''}
                   <a class="btn btn-donate" href="/donate/">${icons.handHeart}<span>ساهم معنا</span></a>
                 </div>
               </div></div>`
            : ''
        }
      </div>`
    )
    .join('');

  const heroDots = hero.items
    .filter((it) => it.imageUrl)
    .map((_, i) => `<span class="hero-dot" data-active="${i === 0}"><span></span></span>`)
    .join('');

  const statsHtml = stats.stats
    .map(
      (s) => `
      <div class="stat-counter reveal">
        <img class="icon" src="${asset(s.iconUrl)}" alt="" loading="lazy">
        <div class="num" data-counter="${s.value.replace('.', '')}">0</div>
        <div class="label">${s.labelAr}</div>
      </div>`
    )
    .join('');

  const latestNews = newsArticles.slice(0, 6);

  const videoIds = video.items.map((it) => (it.linkUrl.match(/embed\/([\w-]+)/) || [])[1]).filter(Boolean);
  const videosHtml = videoIds
    .map(
      (id) => `
      <div class="card-video reveal" data-yt-facade="${id}" role="button" tabindex="0" aria-label="تشغيل الفيديو">
        <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg" alt="فيديو جمعية برهان" loading="lazy">
        <span class="play-btn">${icons.play}</span>
      </div>`
    )
    .join('');

  const proj = projects.items[0];
  const projectHtml = proj
    ? `
    <div class="project-feature reveal">
      ${picture(proj.imageUrl, proj.titleAr)}
      <div class="body">
        <div class="eyebrow">مشروع قائم</div>
        <h3>${proj.titleAr.replace(/\s*\.\.\.$/, '')}</h3>
        <p>تعلن الجمعية عن هذا المشروع ضمن جهودها لتنمية مواردها المستدامة، بما يخدم استمرارية حلقات التحفيظ ورواتب المعلمين.</p>
        <a class="btn btn-primary" href="/media/projects.html">${icons.arrowStart}<span>تفاصيل المشروع</span></a>
      </div>
    </div>`
    : '';

  const awardPills = awardsFromNews
    .slice(0, 3)
    .map((a) => `<a class="award-pill" href="/news/${a.slug}.html">${icons.award}<span>${a.titleAr}</span></a>`)
    .join('');

  const partnersHtml = (partners.images || [])
    .filter((im) => im.url)
    .map((im) => `<div class="partner-tile reveal">${picture(im.url, im.altAr || 'شريك نجاح')}</div>`)
    .join('');

  const body = `
  <script id="season-data" type="application/json">${JSON.stringify(seasonPayload)}</script>
  <div class="season-strip" data-season-strip data-active="false"></div>

  <section class="hero-slider" data-hero-slider aria-roledescription="سلايدر" aria-label="أبرز أخبار وإنجازات الجمعية">
    ${heroSlides}
    <button class="hero-arrow prev" aria-label="الشريحة السابقة">${icons.arrowStart}</button>
    <button class="hero-arrow next" aria-label="الشريحة التالية">${icons.arrowEnd}</button>
    <div class="hero-controls">${heroDots}</div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="stats-band deco-host on-dark">
        ${icons.ornament('bl', 440)}
        <div class="grid stats-grid">
          ${statsHtml}
        </div>
      </div>
    </div>
  </section>

  <section class="about-teaser deco-host on-light">
    ${icons.ornament('br', 494)}
    <div class="container teaser-grid">
      <div class="reveal">
        <div class="eyebrow">رؤيتنا ورسالتنا</div>
        <h2>نُعلّم كتاب الله، ونبني أثراً يمتد في المجتمع</h2>
        <p class="prose">${(site.homepage.sections.find(s=>s.type==='about-teaser').textAr) || 'الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن تعمل منذ أكثر من أربعة عقود على تحفيظ كتاب الله لأبناء وبنات المحافظة، عبر شبكة من الحلقات والمجمعات التعليمية، وبرامج نوعية تُعنى بإتقان الحفظ لا كمّه فحسب.'}</p>
        <a class="btn btn-primary" href="/about/">${icons.arrowStart}<span>المزيد عن الجمعية</span></a>
      </div>
      <div class="bento reveal">
        <a href="/about/vision-mission.html">${picture(hero.items[2]?.imageUrl || hero.items[0].imageUrl, 'الرؤية والرسالة')}</a>
        <a href="/about/history.html">${picture(hero.items[3]?.imageUrl || hero.items[0].imageUrl, 'النشأة والتأسيس')}</a>
        <a href="/about/board.html">${picture(hero.items[4]?.imageUrl || hero.items[0].imageUrl, 'مجلس الإدارة')}</a>
      </div>
    </div>
  </section>

  <section class="halaqa-section deco-host on-light" style="background:var(--brand-50)">
    ${icons.ornament('tl', 440)}
    <div class="container">
      <div class="section-head center">
        <div class="eyebrow">أقرب حلقة لك</div>
        <h2>حلقاتنا منتشرة في كل حي بحفر الباطن</h2>
        <p>خريطة الجمعية الخاصة — إحداثيات حقيقية موثّقة لكل مجمع ومدرسة، لا نقطة واحدة مُقرَّبة.</p>
      </div>
    </div>
    <div class="halaqa-map-wrap full-bleed reveal">
      <div class="halaqa-map-toolbar">
        <div class="halaqa-map-legend">
          <button class="chip" aria-pressed="true" data-map-filter="all">الكل</button>
          ${Object.values(HALAQA_CATEGORY_META)
            .map(
              (m) => `<button class="chip" aria-pressed="false" data-map-filter="${m.key}"><span class="dot" style="background:${m.color}"></span>${m.labelAr}</button>`
            )
            .join('')}
        </div>
        <span class="halaqa-map-count" data-halaqa-count>...</span>
      </div>
      <div id="halaqa-map"></div>
      <div class="halaqa-info-backdrop" data-halaqa-close></div>
      <div class="halaqa-info-panel" data-halaqa-panel></div>
    </div>
  </section>

  <section class="deco-host on-light">
    ${icons.ornament('tr', 418)}
    <div class="container">
      <div class="section-header-row">
        <div class="section-head">
          <div class="eyebrow">المركز الإعلامي</div>
          <h2>أخبار الجمعية</h2>
        </div>
        <a class="btn btn-secondary" href="/news/">${icons.arrowStart}<span>كل الأخبار</span></a>
      </div>
      <div class="news-scroller">
        ${latestNews.map((a) => newsCard(a)).join('')}
      </div>
    </div>
  </section>

  <section class="section-tight deco-host on-light" style="background:var(--brand-50)">
    ${icons.ornament('bl', 456)}
    <div class="container">
      <div class="section-header-row">
        <div class="section-head">
          <div class="eyebrow">مكتبة الفيديو</div>
          <h2>لحظات نعتز بها</h2>
        </div>
        <a class="btn btn-secondary" href="/media/videos.html">${icons.arrowStart}<span>كل الفيديوهات</span></a>
      </div>
      <div class="video-strip">${videosHtml}</div>
    </div>
  </section>

  <section class="deco-host on-light">
    ${icons.ornament('tl', 380)}
    <div class="container">
      ${projectHtml}
    </div>
  </section>

  <section class="section-tight deco-host on-light">
    ${icons.ornament('tr', 418)}
    <div class="container">
      <div class="section-head">
        <div class="eyebrow">جوائز الجمعية</div>
        <h2>تقديرٌ نعتز به</h2>
      </div>
      <div class="awards-strip reveal">
        ${awardPills || `<p>${icons.award} تكريمات وشهادات تقدير — التفاصيل في صفحة الجوائز.</p>`}
        <a class="btn btn-ghost" href="/media/awards.html">${icons.arrowStart}<span>كل الجوائز</span></a>
        <a class="btn btn-ghost" href="/media/hall-of-completion.html">${icons.arrowStart}<span>حائط الختمات والتكريم</span></a>
      </div>
    </div>
  </section>

  <section class="section-tight deco-host on-light" style="background:var(--brand-50)">
    ${icons.ornament('bl', 440)}
    <div class="container">
      <div class="section-head center">
        <div class="eyebrow">بفضل الله ثم بدعمهم</div>
        <h2>شركاء النجاح</h2>
      </div>
      <div class="partners-grid">${partnersHtml}</div>
    </div>
  </section>
  `;

  return page({
    title: '',
    description: 'الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن — جمعية برهان. نُعلّم كتاب الله ونخدم المجتمع منذ أكثر من أربعة عقود.',
    path: '/',
    activePath: '/',
    transparentHeader: true,
    body,
    extraCss: ['/assets/vendor/leaflet/leaflet.css', '/assets/vendor/leaflet/MarkerCluster.css', '/assets/vendor/leaflet/MarkerCluster.Default.css', '/assets/css/map.css', '/assets/css/home.css'],
    extraJs: ['/assets/vendor/leaflet/leaflet.js', '/assets/vendor/leaflet/leaflet.markercluster.js', '/assets/js/halaqa-map.js', '/assets/js/slider.js', '/assets/js/counters.js', '/assets/js/youtube-facade.js', '/assets/js/season.js'],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'NGO',
      name: 'الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن (جمعية برهان)',
      url: 'https://qran-alhfar.sa/',
      logo: 'https://qran-alhfar.sa/assets/img/logo.png',
      address: { '@type': 'PostalAddress', addressLocality: 'حفر الباطن', addressRegion: 'حي العزيزية', addressCountry: 'SA' },
      telephone: '+966556946333',
    },
  });
};
