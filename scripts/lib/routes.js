// خريطة التنقّل الجديدة (نصية ثابتة) — تحل محل المعرّفات الرقمية القديمة. راجع خطط/03.
'use strict';

const mainNav = [
  { label: 'الرئيسية', href: '/' },
  {
    label: 'عن الجمعية',
    href: '/about/',
    children: [
      { label: 'نبذة', href: '/about/overview.html' },
      { label: 'قيمنا', href: '/about/values.html' },
      { label: 'النشأة والتأسيس', href: '/about/history.html' },
      { label: 'مجلس الإدارة', href: '/about/board.html' },
      { label: 'كلمة رئيس مجلس الإدارة', href: '/about/chairman-word.html' },
      { label: 'المدير التنفيذي', href: '/about/ceo.html' },
      { label: 'أهداف الجمعية', href: '/about/goals.html' },
      { label: 'الرؤية والرسالة', href: '/about/vision-mission.html' },
      { label: 'السجل التجاري', href: '/about/commercial-register.html' },
      { label: 'ترخيص الجمعية', href: '/about/license.html' },
      { label: 'الجمعية والمجتمع', href: '/about/community.html' },
      { label: 'الهيكل التنظيمي', href: '/about/org-chart.html' },
    ],
  },
  {
    label: 'الجمعية العمومية',
    href: '/about/general-assembly.html',
    children: [
      { label: 'أعضاء الجمعية العمومية', href: '/about/general-assembly.html' },
      { label: 'تسجيل عضوية', href: '/about/membership.html' },
    ],
  },
  {
    label: 'الحوكمة',
    href: '/governance/',
    children: [
      { label: 'السياسات واللوائح والأنظمة', href: '/governance/policies.html' },
      { label: 'المدير التنفيذي', href: '/governance/executive-director.html' },
      { label: 'الرؤية والرسالة والأهداف', href: '/governance/vision-mission-goals.html' },
      { label: 'اللائحة الأساسية للجمعية', href: '/governance/basic-bylaw.html' },
      { label: 'الخطة الاستراتيجية', href: '/governance/strategic-plan.html' },
      { label: 'شهادة تسجيل الجمعية', href: '/governance/registration-certificate.html' },
      { label: 'التقارير المالية للجمعية', href: '/governance/financial-reports.html' },
      { label: 'التقارير السنوية والبرامج', href: '/governance/annual-reports.html' },
      { label: 'قائمة العقارات والاستثمارات', href: '/governance/properties-investments.html' },
    ],
  },
  {
    label: 'المركز الإعلامي',
    href: '/media/',
    children: [
      { label: 'الأخبار', href: '/news/' },
      { label: 'معرض الصور', href: '/media/gallery.html' },
      { label: 'المشاريع', href: '/media/projects.html' },
      { label: 'المبادرات', href: '/media/initiatives.html' },
      { label: 'مكتبة الفيديو', href: '/media/videos.html' },
      { label: 'شركاء النجاح', href: '/media/partners.html' },
      { label: 'التقارير الختامية', href: '/media/reports.html' },
      { label: 'المشاركات', href: '/media/participations.html' },
      { label: 'الجوائز', href: '/media/awards.html' },
      { label: 'حائط الختمات والتكريم', href: '/media/hall-of-completion.html' },
    ],
  },
  { label: 'التطوع', href: '/volunteer/' },
  { label: 'الاستبيانات', href: '/survey/' },
  { label: 'طلب توظيف', href: '/careers/' },
  { label: 'تواصل معنا', href: '/contact/' },
];

const quickLinks = [
  { label: 'التبرعات', href: '/donate/' },
  { label: 'الاستقطاع الشهري', href: '/donate/monthly.html' },
];

module.exports = { mainNav, quickLinks };
