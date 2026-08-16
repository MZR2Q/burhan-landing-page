'use strict';
const { page } = require('../lib/layout');
const icons = require('../lib/icons');
const { pageHero, wipBanner, contactFallback, personCard, renderBlocks } = require('../lib/components');

const SUBPAGES = [
  { slug: 'overview', srcSlug: 'intro', file: 'overview.html' },
  { slug: 'history', srcSlug: 'history', file: 'history.html' },
  { slug: 'chairman-word', srcSlug: 'chairman-statement', file: 'chairman-word.html' },
  { slug: 'ceo', srcSlug: 'executive-director', file: 'ceo.html' },
  { slug: 'goals', srcSlug: 'objectives', file: 'goals.html' },
  { slug: 'vision-mission', srcSlug: 'vision-mission', file: 'vision-mission.html' },
  { slug: 'commercial-register', srcSlug: 'commercial-register', file: 'commercial-register.html' },
  { slug: 'license', srcSlug: 'license', file: 'license.html' },
];

const LANDING_CARDS = [
  { label: 'نبذة', href: '/about/overview.html', icon: icons.document },
  { label: 'قيمنا', href: '/about/values.html', icon: icons.handHeart },
  { label: 'النشأة والتأسيس', href: '/about/history.html', icon: icons.award },
  { label: 'مجلس الإدارة', href: '/about/board.html', icon: icons.image },
  { label: 'كلمة رئيس مجلس الإدارة', href: '/about/chairman-word.html', icon: icons.document },
  { label: 'المدير التنفيذي', href: '/about/ceo.html', icon: icons.document },
  { label: 'أهداف الجمعية', href: '/about/goals.html', icon: icons.shieldCheck },
  { label: 'الرؤية والرسالة', href: '/about/vision-mission.html', icon: icons.handHeart },
  { label: 'السجل التجاري', href: '/about/commercial-register.html', icon: icons.document },
  { label: 'ترخيص الجمعية', href: '/about/license.html', icon: icons.shieldCheck },
  { label: 'الجمعية والمجتمع', href: '/about/community.html', icon: icons.handHeart },
  { label: 'الهيكل التنظيمي', href: '/about/org-chart.html', icon: icons.image },
];

function findPage(about, slug) {
  return about.pages.find((p) => p.slug === slug);
}

function linkCardsGrid(cards) {
  return `<div class="grid grid-4">${cards
    .map(
      (c) => `
      <a class="card-person reveal" href="${c.href}" style="text-align:start;display:flex;align-items:center;gap:var(--space-4);padding:var(--space-5)">
        <span style="flex:none;width:44px;height:44px;border-radius:12px;background:var(--brand-50);color:var(--brand-600);display:flex;align-items:center;justify-content:center">${c.icon}</span>
        <strong style="font-family:var(--font-body)">${c.label}</strong>
      </a>`
    )
    .join('')}</div>`;
}

module.exports = function buildAbout(data, emit) {
  const { about, boardPage, findings, drafts } = data;

  // --- صفحة الهبوط ---
  emit(
    'about/index.html',
    page({
      title: 'عن الجمعية',
      description: 'تعرّف على جمعية برهان لتحفيظ القرآن الكريم بحفر الباطن: نشأتها، رؤيتها، مجلس إدارتها، وحوكمتها.',
      path: '/about/',
      body: `
      ${pageHero({ eyebrow: 'عن الجمعية', title: 'من نحن', desc: 'الجمعية الخيرية لتحفيظ القرآن الكريم بحفر الباطن — أربعة عقود من العطاء المستمر.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية' }] })}
      <section class="deco-host on-light">${icons.ornament('br', 456)}<div class="container">${linkCardsGrid(LANDING_CARDS)}</div></section>
      `,
    })
  );

  // --- الصفحات الفرعية النصية البسيطة ---
  SUBPAGES.forEach(({ slug, srcSlug, file }) => {
    const src = findPage(about, srcSlug);
    if (!src) return;
    emit(
      `about/${file}`,
      page({
        title: src.titleAr,
        description: (src.fullTextAr || '').slice(0, 155),
        path: `/about/${file}`,
        body: `
        ${pageHero({ title: src.titleAr, crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: src.titleAr }] })}
        <section class="deco-host on-light">${icons.ornament('tl', 380)}<div class="container"><div class="prose reveal">${renderBlocks(src.contentBlocks) || `<p>${src.fullTextAr}</p>`}</div></div></section>
        `,
      })
    );
  });

  // --- قيمنا (مسودة) ---
  emit(
    'about/values.html',
    page({
      title: drafts.values.titleAr,
      description: 'قيم جمعية برهان: الإتقان، الأمانة والشفافية، العطاء المستدام، الشراكة، الاحتساب.',
      path: '/about/values.html',
      body: `
      ${pageHero({ title: 'قيمنا', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: 'قيمنا' }] })}
      <section class="deco-host on-light">${icons.ornament('tr', 399)}<div class="container">
        <span class="badge badge-draft" style="margin-bottom:var(--space-5);display:inline-flex">مسودة بانتظار اعتماد الجمعية</span>
        <div class="prose reveal">${drafts.values.bodyHtml}</div>
      </div></section>
      `,
    })
  );

  // --- الجمعية والمجتمع (مسودة) ---
  emit(
    'about/community.html',
    page({
      title: drafts.community.titleAr,
      description: 'أثر جمعية برهان في مجتمع حفر الباطن: الانتشار، الشراكات، التطوع، والتقدير.',
      path: '/about/community.html',
      body: `
      ${pageHero({ title: 'الجمعية والمجتمع', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: 'الجمعية والمجتمع' }] })}
      <section class="deco-host on-light">${icons.ornament('bl', 456)}<div class="container">
        <span class="badge badge-draft" style="margin-bottom:var(--space-5);display:inline-flex">مسودة بانتظار اعتماد الجمعية</span>
        <div class="prose reveal">${drafts.community.bodyHtml}</div>
      </div></section>
      `,
    })
  );

  // --- مجلس الإدارة ---
  const boardMembers = (boardPage?.people || []);
  emit(
    'about/board.html',
    page({
      title: 'مجلس الإدارة',
      description: 'أعضاء مجلس إدارة جمعية برهان لتحفيظ القرآن الكريم بحفر الباطن.',
      path: '/about/board.html',
      body: `
      ${pageHero({ title: 'مجلس الإدارة', desc: 'تسعة أعضاء يقودون مسيرة العطاء.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: 'مجلس الإدارة' }] })}
      <section class="deco-host on-light">${icons.ornament('br', 380)}<div class="container">
        <div class="grid grid-3">${boardMembers.map((m) => personCard(m.nameAr, m.roleAr)).join('')}</div>
      </div></section>
      `,
    })
  );

  // --- الهيكل التنظيمي ---
  const org = findings.orgChart || {};
  const orgDepts = org.departmentsAr || [
    'الموارد البشرية', 'المالية', 'التواصل الإداري', 'التحول الرقمي',
    'التطوع', 'الموارد المالية والشراكات', 'البرامج التعليمية للبنين', 'البرامج التعليمية للبنات',
  ];
  emit(
    'about/org-chart.html',
    page({
      title: 'الهيكل التنظيمي',
      description: 'الهيكل التنظيمي لجمعية برهان: من الجمعية العمومية إلى الإدارات التنفيذية الثماني.',
      path: '/about/org-chart.html',
      body: `
      ${pageHero({ title: 'الهيكل التنظيمي', desc: 'من الجمعية العمومية إلى الإدارات التنفيذية.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: 'الهيكل التنظيمي' }] })}
      <section class="deco-host on-light">${icons.ornament('tl', 399)}<div class="container">
        <div class="timeline reveal" style="max-width:640px;margin:0 auto var(--space-10)">
          <div class="timeline-item"><h4>الجمعية العمومية</h4></div>
          <div class="timeline-item"><h4>مجلس الإدارة</h4></div>
          <div class="timeline-item"><h4>المدير العام</h4></div>
        </div>
        <h2 class="reveal" style="text-align:center;margin-bottom:var(--space-6)">الإدارات التنفيذية الثماني</h2>
        <div class="org-tree reveal" style="max-width:760px;margin:0 auto">
          ${orgDepts
            .map(
              (d) => `
            <div class="org-node">
              <button class="org-trigger" aria-expanded="false">
                <span>${d}</span>${icons.chevronDown}
              </button>
              <div class="org-children"><span class="org-chip">تفاصيل الفرق والمسمّيات ضمن اللائحة التنظيمية الكاملة</span></div>
            </div>`
            )
            .join('')}
        </div>
        <p class="reveal" style="text-align:center;margin-top:var(--space-8);color:var(--text-muted);font-size:var(--fs-sm)">
          المصدر الكامل: وثيقة «لائحة الهيكلة التنظيمية» ضمن
          <a href="/governance/policies.html" style="color:var(--brand-600);font-weight:700">مكتبة الحوكمة</a>.
        </p>
      </div></section>
      `,
    })
  );

  // --- الجمعية العمومية ---
  emit(
    'about/general-assembly.html',
    page({
      title: 'الجمعية العمومية',
      description: 'الجمعية العمومية لجمعية برهان لتحفيظ القرآن الكريم — الانضمام والعضوية.',
      path: '/about/general-assembly.html',
      body: `
      ${pageHero({ title: 'الجمعية العمومية', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'عن الجمعية', href: '/about/' }, { label: 'الجمعية العمومية' }] })}
      <section class="deco-host on-light">${icons.ornament('tr', 456)}<div class="container">
        <div class="prose reveal">
          <p>الجمعية العمومية هي السلطة العليا في جمعية برهان، وتضم أعضاءها المسجَّلين رسمياً، ويتفرّع عنها مجلس الإدارة المنتخب المسؤول عن الإدارة التنفيذية للجمعية.</p>
        </div>
        <h2 class="reveal" style="margin-top:var(--space-8)">مجلس الإدارة المنتخب</h2>
        <div class="grid grid-3">${boardMembers.map((m) => personCard(m.nameAr, m.roleAr)).join('')}</div>
        <div class="empty-state reveal" style="margin-top:var(--space-8)">
          <div class="icon">${icons.handHeart}</div>
          <h3>هل تودّ الانضمام للجمعية العمومية؟</h3>
          <p>سجّل طلب عضويتك الآن وسينظر مجلس الإدارة في طلبك وفق اللائحة الأساسية للجمعية.</p>
          <a class="btn btn-primary" style="margin-top:var(--space-4)" href="/about/membership.html">${icons.arrowStart}<span>تسجيل عضوية</span></a>
        </div>
      </div></section>
      `,
    })
  );

  // --- تسجيل عضوية (نموذج) ---
  const membership = findPage(about, 'membership-registration');
  emit(
    'about/membership.html',
    page({
      title: 'تسجيل عضوية',
      description: 'سجّل طلب عضويتك في الجمعية العمومية لجمعية برهان لتحفيظ القرآن الكريم.',
      path: '/about/membership.html',
      body: `
      ${pageHero({ title: 'تسجيل عضوية', desc: 'انضم للجمعية العمومية وكن جزءاً من قرارها.', crumbs: [{ label: 'الرئيسية', href: '/' }, { label: 'الجمعية العمومية', href: '/about/general-assembly.html' }, { label: 'تسجيل عضوية' }] })}
      <section><div class="container" style="max-width:760px">
        ${wipBanner()}
        <div class="prose reveal" style="margin-bottom:var(--space-6)">
          <p><strong>شروط العضوية:</strong> أن يكون المتقدم سعودي الجنسية، ألا يقل عمره عن 18 عاماً، كامل الأهلية، وغير محكوم عليه في جريمة مخلة بالشرف أو الأمانة ما لم يُرد إليه اعتباره، مع سداد الحد الأدنى للاشتراك السنوي.</p>
        </div>
        <form data-wip-form novalidate>
          <div class="form-grid">
            <div class="field"><label>الاسم الرباعي <span class="req">*</span></label><input type="text" required><span class="field-error">هذا الحقل مطلوب</span></div>
            <div class="field"><label>تاريخ الميلاد <span class="req">*</span></label><input type="date" required><span class="field-error">هذا الحقل مطلوب</span></div>
            <div class="field"><label>المهنة</label><input type="text"></div>
            <div class="field"><label>المؤهل</label><input type="text"></div>
            <div class="field"><label>رقم الجوال <span class="req">*</span></label><input type="tel" required><span class="field-error">هذا الحقل مطلوب</span></div>
            <div class="field"><label>البريد الإلكتروني <span class="req">*</span></label><input type="email" required><span class="field-error">هذا الحقل مطلوب</span></div>
            <div class="field full"><label>عنوان الإقامة</label><input type="text"></div>
            <div class="field field-checkbox full"><input type="checkbox" id="agree" required><label for="agree">أوافق على الأحكام والشروط <span class="req">*</span></label></div>
          </div>
          <button class="btn btn-primary btn-block" style="margin-top:var(--space-6)" type="submit">${icons.arrowStart}<span>إرسال الطلب</span></button>
          <div data-wip-result hidden style="margin-top:var(--space-5)">${wipBanner('استقبال الطلبات إلكترونياً قيد التفعيل. لإتمام طلبك الآن، تواصل معنا مباشرة:')}${contactFallback('أرغب بتسجيل عضوية في الجمعية العمومية')}</div>
        </form>
      </div></section>
      `,
      extraJs: ['/assets/js/forms.js'],
    })
  );
};
