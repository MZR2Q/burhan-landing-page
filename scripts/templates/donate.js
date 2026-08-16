'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, breadcrumb } = require('../lib/components');

function progressBlock(c) {
  const m = (c.raisedAmountAr || '').match(/(\d+)\s*%/);
  if (!m) return '';
  const pct = Math.min(100, parseInt(m[1], 10));
  return `
  <div class="progress-donation">
    <div class="bar"><span style="width:${pct}%"></span></div>
    <div class="label">تم تحقيق ${pct}% من الهدف</div>
  </div>`;
}

function tiersHtml(c) {
  return `<div class="tiers">${(c.donationTiers || [])
    .map((t) => `<a class="tier-chip" href="${c.checkoutUrl}" target="_blank" rel="noopener">${t.labelAr}</a>`)
    .join('')}${c.allowsCustomAmount ? `<span class="tier-chip" style="border-style:dashed">مبلغ حر</span>` : ''}</div>`;
}

// الإطار الروحي: يحوّل اختيار المبلغ من نموذج جاف إلى لحظة تُضيء فيها كلمات الحديث/الآية المرتبطة بالحملة
function spiritualFrame(c) {
  const tiers = (c.donationTiers || [])
    .map((t, i) => `<button class="tier-chip" aria-pressed="${i === 0}" data-href="${c.checkoutUrl}">${t.labelAr}</button>`)
    .join('');
  return `
  <div data-spiritual-frame>
    <div class="spiritual-frame">
      <span class="corner tl">${icons.cornerOrnament}</span>
      <span class="corner tr">${icons.cornerOrnament}</span>
      <span class="corner bl">${icons.cornerOrnament}</span>
      <span class="corner br">${icons.cornerOrnament}</span>
      <p class="quote">${c.descriptionAr}</p>
      <p class="hint">اختر مبلغاً ليُضيء نيّتك ✨</p>
    </div>
    <div class="tiers-live">${tiers}${c.allowsCustomAmount ? `<button class="tier-chip" style="border-style:dashed" data-href="${c.checkoutUrl}">مبلغ حر</button>` : ''}</div>
    <a class="btn btn-donate btn-block" style="margin-top:var(--space-6)" data-donate-link href="${c.checkoutUrl}" target="_blank" rel="noopener">${icons.handHeart}<span>تبرّع الآن</span></a>
    <button class="btn btn-secondary btn-block" style="margin-top:var(--space-3)"
      data-share-card
      data-url="https://qran-alhfar.sa/donate/${c.slug}.html"
      data-title="${c.titleAr.replace(/"/g, '&quot;')}"
      data-quote="${(c.descriptionAr || '').replace(/"/g, '&quot;')}"
      data-category="${c.categoryAr}">
      ${icons.share}<span>شارك نيّتك</span>
    </button>
    <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:var(--space-3);text-align:center">${icons.shieldCheck} سيتم تحويلك لإتمام الدفع بأمان عبر منصة زد</p>
  </div>`;
}

module.exports = function buildDonate(data, emit) {
  const { donationCampaigns, donationCategories, picture } = data;
  const categories = [...new Set(donationCampaigns.map((c) => c.categoryAr))];

  emit(
    'donate/index.html',
    page({
      title: 'التبرعات',
      description: `${donationCampaigns.length} حملة تبرع نشطة لجمعية برهان لتحفيظ القرآن الكريم — كفالات، أوقاف، ومشاريع.`,
      path: '/donate/',
      body: `
      ${pageHero({
        eyebrow: 'ساهم معنا',
        title: 'اختر ما يُثقل ميزانك',
        desc: 'كل تبرع فرصة لحفظ كتاب الله. الدفع آمن بالكامل عبر منصة زد المعتمدة للجمعية.',
        crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'التبرعات' }],
      })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        <div style="text-align:center;margin-bottom:var(--space-8)">
          <a class="btn btn-secondary" href="/donate/monthly.html">${icons.handHeart}<span>تفضّل التبرع الشهري المتكرر بدل مرة واحدة؟</span></a>
        </div>
        <div class="filter-bar" data-filter-bar=".campaign-item">
          <div class="filter-chips">
            <button class="chip" aria-pressed="true" data-filter-value="all">الكل</button>
            ${categories.map((c) => `<button class="chip" aria-pressed="false" data-filter-value="${c}">${c}</button>`).join('')}
          </div>
        </div>
        <div class="grid grid-3">
          ${donationCampaigns
            .map(
              (c) => `
            <div class="campaign-item" data-category="${c.categoryAr}">
              <div class="card-campaign reveal">
                <a class="thumb" href="/donate/${c.slug}.html">${picture(c.imageUrl, c.titleAr)}</a>
                <div class="body">
                  <span class="badge badge-gold">${c.categoryAr}</span>
                  <h3><a href="/donate/${c.slug}.html">${c.titleAr}</a></h3>
                  <p class="desc">${c.descriptionAr}</p>
                  ${tiersHtml(c)}
                  ${progressBlock(c)}
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);margin-top:var(--space-2)">
                    <span class="secure-badge">${icons.shieldCheck}<span>دفع آمن عبر زد</span></span>
                    <a class="btn btn-donate btn-sm" href="${c.checkoutUrl}" target="_blank" rel="noopener">${icons.handHeart}<span>تبرّع</span></a>
                  </div>
                </div>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div></section>
      `,
      extraJs: ['/assets/js/filters.js'],
    })
  );

  donationCampaigns.forEach((c) => {
    const related = donationCampaigns.filter((x) => x.slug !== c.slug && x.categoryAr === c.categoryAr).slice(0, 3);
    emit(
      `donate/${c.slug}.html`,
      page({
        title: c.titleAr,
        description: c.descriptionAr,
        path: `/donate/${c.slug}.html`,
        ogImage: data.asset(c.imageUrl),
        body: `
        <header class="page-hero" style="padding-block:var(--space-6) var(--space-8)">
          <div class="container">
            ${breadcrumb([{ label: 'الرئيسية', href: '/' }, { label: 'التبرعات', href: '/donate/' }, { label: c.titleAr }])}
            <span class="badge" style="background:rgba(255,255,255,.15);color:#fff">${c.categoryAr}</span>
            <h1 style="margin-top:var(--space-3)">${c.titleAr}</h1>
          </div>
        </header>
        <section class="deco-host on-light">${icons.ornament('tr', 399)}<div class="container">
          <div class="grid grid-2" style="align-items:start">
            <div class="reveal" style="border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg)">${data.picture(c.imageUrl, c.titleAr, { eager: true })}</div>
            <div class="reveal">
              ${progressBlock(c)}
              ${spiritualFrame(c)}
            </div>
          </div>

          ${
            related.length
              ? `<h2 class="reveal" style="margin-top:var(--space-12)">حملات ذات صلة</h2>
                 <div class="grid grid-3">
                   ${related
                     .map(
                       (r) => `
                     <div class="card-campaign reveal">
                       <a class="thumb" href="/donate/${r.slug}.html">${data.picture(r.imageUrl, r.titleAr)}</a>
                       <div class="body"><h3><a href="/donate/${r.slug}.html">${r.titleAr}</a></h3></div>
                     </div>`
                     )
                     .join('')}
                 </div>`
              : ''
          }
        </div></section>
        `,
        extraJs: ['/assets/js/donation-visualizer.js', '/assets/js/share-card.js'],
      })
    );
  });

  // --- الاستقطاع الشهري ---
  emit(
    'donate/monthly.html',
    page({
      title: 'الاستقطاع الشهري',
      description: 'تبرّع شهرياً متكرراً يضمن استمرار حلقات التحفيظ ورواتب المعلمين.',
      path: '/donate/monthly.html',
      body: `
      ${pageHero({ title: 'الاستقطاع الشهري', desc: 'تبرّع صغير كل شهر يصنع أثراً كبيراً ومستمراً.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'التبرعات', href: '/donate/' }, { label: 'الاستقطاع الشهري' }] })}
      <section><div class="container" style="max-width:640px">
        ${require('../lib/components').wipBanner('الاستقطاع الشهري الإلكتروني قيد الربط التقني حالياً. لتفعيل استقطاعك الشهري الآن، تواصل معنا مباشرة:')}
        ${require('../lib/components').contactFallback('أرغب بالتسجيل في التبرع الشهري المتكرر')}
      </div></section>
      `,
    })
  );
};
