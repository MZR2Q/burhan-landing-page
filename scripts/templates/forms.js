'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, wipBanner, contactFallback, emptyState } = require('../lib/components');

function field(label, type, { required = true, options = [], full = false, name = '' } = {}) {
  const id = 'f-' + Math.random().toString(36).slice(2, 8);
  const req = required ? ' required' : '';
  const star = required ? ' <span class="req">*</span>' : '';
  let control = '';
  if (type === 'select') {
    control = `<select id="${id}"${req}><option value="">اختر...</option>${options.map((o) => `<option>${o}</option>`).join('')}</select>`;
  } else if (type === 'textarea') {
    control = `<textarea id="${id}"${req}></textarea>`;
  } else if (type === 'checkbox') {
    return `<div class="field field-checkbox${full ? ' full' : ''}"><input type="checkbox" id="${id}"${req}><label for="${id}">${label}${star}</label></div>`;
  } else if (type === 'file') {
    control = `<input type="file" id="${id}"${req}>`;
  } else {
    control = `<input type="${type}" id="${id}"${req}>`;
  }
  return `<div class="field${full ? ' full' : ''}"><label for="${id}">${label}${star}</label>${control}<span class="field-error">هذا الحقل مطلوب</span></div>`;
}

module.exports = function buildForms(data, emit) {
  // --- التطوع ---
  emit(
    'volunteer/index.html',
    page({
      title: 'التطوع',
      description: 'انضم لفريق متطوعي جمعية برهان لتحفيظ القرآن الكريم بحفر الباطن.',
      path: '/volunteer/',
      body: `
      ${pageHero({ eyebrow: 'كن شريكاً في الأثر', title: 'بوابة التطوع', desc: 'المتطوع عندنا شريك في الأثر لا يد عاملة إضافية.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'التطوع' }] })}
      <section><div class="container" style="max-width:820px">
        ${wipBanner()}
        <form data-wip-form novalidate>
          <div class="form-grid">
            ${field('الاسم الرباعي', 'text')}
            ${field('الجنس', 'select', { options: ['ذكر', 'أنثى'] })}
            ${field('تاريخ الميلاد', 'date')}
            ${field('الحالة الاجتماعية', 'select', { options: ['أعزب', 'متزوج', 'مطلق', 'أرمل'] })}
            ${field('رقم الجوال', 'tel')}
            ${field('الجنسية', 'select', { options: ['سعودي', 'مقيم'] })}
            ${field('رقم السجل المدني', 'text')}
            ${field('المؤهل العلمي', 'select', { options: ['ثانوي', 'دبلوم', 'بكالوريوس', 'ماجستير فأعلى'] })}
            ${field('البريد الإلكتروني', 'email')}
            ${field('التخصص', 'text', { required: false })}
            ${field('جهة العمل', 'text', { required: false })}
            ${field('الفترة المفضلة', 'select', { options: ['صباحية', 'مسائية'] })}
            ${field('ساعات العمل', 'select', { options: ['1-3 ساعات أسبوعياً', '4-6 ساعات أسبوعياً', 'أكثر من 6 ساعات'] })}
            ${field('اختر المجمع الأقرب', 'select', { options: ['العزيزية', 'النهضة', 'الخالدية', 'أي مجمع'] })}
            ${field('السيرة الذاتية (اختياري)', 'textarea', { required: false, full: true })}
            ${field('اقتراحاتك (اختياري)', 'textarea', { required: false, full: true })}
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:var(--space-6)" type="submit">${icons.arrowStart}<span>إرسال طلب التطوع</span></button>
          <div data-wip-result hidden style="margin-top:var(--space-5)">${wipBanner('استقبال الطلبات إلكترونياً قيد التفعيل. للتسجيل كمتطوع الآن، تواصل معنا مباشرة:')}${contactFallback('أرغب بالتسجيل كمتطوع في الجمعية')}</div>
        </form>
      </div></section>
      `,
      extraJs: ['/assets/js/forms.js'],
    })
  );

  // --- التوظيف: بوابة (فارغة) + تقديم ---
  emit(
    'careers/index.html',
    page({
      title: 'طلب توظيف',
      description: 'الوظائف الشاغرة في جمعية برهان لتحفيظ القرآن الكريم، والتقديم المفتوح.',
      path: '/careers/',
      body: `
      ${pageHero({ title: 'بوابة التوظيف', desc: 'انضم لفريق العمل في جمعية برهان.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'طلب توظيف' }] })}
      <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container">
        ${emptyState({ title: 'لا توجد وظائف شاغرة معلنة حالياً', desc: 'تابع هذه الصفحة أولاً بأول — وحتى بلا وظيفة معلنة، يمكنك تقديم طلبك وسيراجَع عند توفّر شاغر مناسب.', icon: icons.document })}
        <div style="text-align:center;margin-top:var(--space-8)">
          <a class="btn btn-primary" href="/careers/apply.html">${icons.arrowStart}<span>قدّم طلبك الآن</span></a>
        </div>
      </div></section>
      `,
    })
  );

  emit(
    'careers/apply.html',
    page({
      title: 'تقديم على وظيفة',
      description: 'قدّم طلب التوظيف الخاص بك لجمعية برهان لتحفيظ القرآن الكريم.',
      path: '/careers/apply.html',
      body: `
      ${pageHero({ title: 'تقديم على وظيفة', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'طلب توظيف', href: '/careers/' }, { label: 'التقديم' }] })}
      <section><div class="container" style="max-width:820px">
        ${wipBanner()}
        <form data-wip-form novalidate>
          <div class="form-grid">
            ${field('اسم المتقدم', 'text')}
            ${field('البريد الإلكتروني', 'email')}
            ${field('الهاتف المحمول', 'tel')}
            ${field('التخصص', 'text')}
            ${field('المؤهلات', 'text')}
            ${field('الدرجة العلمية', 'text')}
            ${field('السيرة الذاتية (ملف PDF)', 'file')}
            ${field('الشهادة (ملف PDF)', 'file', { required: false })}
            ${field('نبذة عن خبرتك', 'textarea', { full: true })}
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:var(--space-6)" type="submit">${icons.arrowStart}<span>إرسال الطلب</span></button>
          <div data-wip-result hidden style="margin-top:var(--space-5)">${wipBanner('استقبال طلبات التوظيف إلكترونياً قيد التفعيل. لإرسال طلبك الآن، راسلنا مباشرة وأرفق سيرتك الذاتية:')}${contactFallback('أرغب بالتقديم على وظيفة في الجمعية')}</div>
        </form>
      </div></section>
      `,
      extraJs: ['/assets/js/forms.js'],
    })
  );

  // --- تواصل معنا ---
  emit(
    'contact/index.html',
    page({
      title: 'تواصل معنا',
      description: 'تواصل مع الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن.',
      path: '/contact/',
      body: `
      ${pageHero({ title: 'تواصل معنا', desc: 'يسعدنا استقبال استفساراتكم ومقترحاتكم.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'تواصل معنا' }] })}
      <section class="deco-host on-light">${icons.ornament('tr', 399)}<div class="container">
        <div class="grid grid-2" style="align-items:start">
          <div class="reveal">
            <form data-wip-form novalidate>
              <div class="form-grid">
                ${field('الاسم الكامل', 'text')}
                ${field('البريد الإلكتروني', 'email')}
                ${field('رقم الجوال', 'tel')}
                ${field('نوع الطلب', 'select', { options: ['مقترحات', 'شكاوى', 'الإبلاغ عن مخالفة', 'استفسار', 'طلب انضمام للجمعية العمومية'] })}
                ${field('الرسالة', 'textarea', { full: true })}
              </div>
              <button class="btn btn-primary btn-block" style="margin-top:var(--space-6)" type="submit">${icons.arrowStart}<span>إرسال</span></button>
              <div data-wip-result hidden style="margin-top:var(--space-5)">${wipBanner()}${contactFallback()}</div>
            </form>
          </div>
          <div class="reveal">
            <div style="border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-sm);margin-bottom:var(--space-5)">
              <iframe src="//maps.google.com/maps?q=28.439242+45.970183&z=15&output=embed" width="100%" height="320" style="border:0" loading="lazy" title="موقع الجمعية"></iframe>
            </div>
            <ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:var(--space-4)">
              <li style="display:flex;gap:var(--space-3)">${icons.mapPin}<span>حفر الباطن — حي العزيزية</span></li>
              <li style="display:flex;gap:var(--space-3)">${icons.phone}<a href="tel:920005001">920005001</a></li>
              <li style="display:flex;gap:var(--space-3)">${icons.whatsapp}<a href="https://api.whatsapp.com/send?phone=966556946333" target="_blank" rel="noopener">966556946333</a></li>
              <li style="display:flex;gap:var(--space-3)">${icons.mail}<a href="mailto:info@qran-alhafar.sa">info@qran-alhafar.sa</a></li>
            </ul>
          </div>
        </div>
      </div></section>
      `,
      extraJs: ['/assets/js/forms.js'],
    })
  );

  // --- استبيان رضا المستفيدين ---
  const surveyResults = [
    { q: 'ما مدى رضاك عن الخدمات التي تقدمها الجمعية؟', bars: [['راضٍ جداً', 31.58], ['راضٍ', 36.84], ['راضٍ نوعاً ما', 10.53], ['غير راضٍ', 21.05]] },
    { q: 'ما مدى رضاك عن الاتصال والتواصل مع الجمعية؟', bars: [['راضٍ جداً', 36.36], ['راضٍ', 36.36], ['غير راضٍ', 27.27]] },
  ];
  emit(
    'survey/index.html',
    page({
      title: 'استبيان رضا المستفيدين',
      description: 'شاركنا رأيك — نتائج استبيان رضا المستفيدين من خدمات جمعية برهان.',
      path: '/survey/',
      body: `
      ${pageHero({ title: 'استبيان رضا المستفيدين', desc: 'رأيك يهمّنا في تطوير خدماتنا باستمرار.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'الاستبيانات' }] })}
      <section><div class="container" style="max-width:760px">
        <h2 class="reveal">نتائج آخر استبيان</h2>
        ${surveyResults
          .map(
            (r) => `
          <div class="reveal" style="margin-bottom:var(--space-8)">
            <h3 style="font-size:1.05rem">${r.q}</h3>
            ${r.bars
              .map(
                ([label, pct]) => `
              <div style="margin-bottom:var(--space-3)">
                <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:4px"><span>${label}</span><span>${pct}%</span></div>
                <div class="bar" style="height:10px;border-radius:var(--radius-full);background:var(--brand-50);overflow:hidden"><span style="display:block;height:100%;width:${pct}%;background:var(--brand-500);border-radius:var(--radius-full)"></span></div>
              </div>`
              )
              .join('')}
          </div>`
          )
          .join('')}

        <h2 class="reveal" style="margin-top:var(--space-10)">شاركنا رأيك الآن</h2>
        ${wipBanner()}
        <form data-wip-form novalidate>
          <div class="field full">
            <label>ما مدى رضاك عن خدمات الجمعية؟ <span class="req">*</span></label>
            <select required><option value="">اختر...</option><option>راضٍ جداً</option><option>راضٍ</option><option>راضٍ نوعاً ما</option><option>غير راضٍ</option></select>
            <span class="field-error">هذا الحقل مطلوب</span>
          </div>
          <div class="field full" style="margin-top:var(--space-4)">
            <label>ملاحظاتك ومقترحاتك</label>
            <textarea></textarea>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:var(--space-6)" type="submit">${icons.arrowStart}<span>إرسال</span></button>
          <div data-wip-result hidden style="margin-top:var(--space-5)">${wipBanner()}${contactFallback('أرغب بمشاركة رأيي في استبيان رضا المستفيدين')}</div>
        </form>
      </div></section>
      `,
      extraJs: ['/assets/js/forms.js'],
    })
  );
};
