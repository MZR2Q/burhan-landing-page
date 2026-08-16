'use strict';
// حائط الختمات والتكريم — يجمع أخبار التخريج والتكريم المتناثرة في سردية بصرية واحدة
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero } = require('../lib/components');

// شارة العدد تُعرض فقط للمقالات التي رقمها الحقيقي "عدد أشخاص/دفعة" — لا أي رقم أول يصادفنا (كي لا نعرض سنة هجرية كأنها إنجاز)
const KNOWN_COUNTS = {
  1275: '250 حافظاً',
  3413: '11 طالباً',
};
function extractCount(id) {
  return KNOWN_COUNTS[id] || null;
}

module.exports = function buildHallmark(data, emit) {
  const { hallOfCompletionArticles, picture } = data;

  emit(
    'media/hall-of-completion.html',
    page({
      title: 'حائط الختمات والتكريم',
      description: 'محطات تخريج وختم وتكريم حفظة القرآن الكريم في جمعية برهان — سردية بصرية لمسيرة الحفظ.',
      path: '/media/hall-of-completion.html',
      body: `
      ${pageHero({
        eyebrow: 'نفتخر بهم',
        title: 'حائط الختمات والتكريم',
        desc: 'كل ميدالية هنا قصة حقيقية — طالب أتمّ حفظه، أو دفعة احتفلت بتخريجها، أو تكريم استحقّته الجمعية. اضغط لتقرأ القصة كاملة.',
        crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'المركز الإعلامي', href: '/media/' }, { label: 'حائط الختمات' }],
      })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        <div class="medallion-grid">
          ${hallOfCompletionArticles
            .map((a) => {
              const count = extractCount(a.id);
              return `
              <a class="medallion reveal" href="/news/${a.slug}.html">
                <div class="medallion-badge">
                  <div class="inner">${picture(a.coverImageUrl, a.titleAr)}</div>
                  ${count ? `<span class="count">${count}</span>` : ''}
                </div>
                <h3>${a.titleAr}</h3>
                <div class="date">${a.dateGregorianAr || a.dateAr}</div>
              </a>`;
            })
            .join('')}
        </div>
      </div></section>
      `,
    })
  );
};
