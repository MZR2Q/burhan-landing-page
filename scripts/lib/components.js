// مقاطع HTML قابلة لإعادة الاستخدام عبر القوالب
'use strict';
const icons = require('./icons');

function breadcrumb(items) {
  // items: [{label, href?}] — آخر عنصر بلا href يُعامل كحالي
  const parts = items
    .map((it, i) => {
      const isLast = i === items.length - 1;
      const node = it.href && !isLast ? `<a href="${it.href}">${it.label}</a>` : `<span aria-current="page">${it.label}</span>`;
      return i === 0 ? node : `<span class="sep">/</span>${node}`;
    })
    .join('');
  return `<nav class="breadcrumb" aria-label="مسار التنقّل">${parts}</nav>`;
}

function pageHero({ eyebrow, title, desc, crumbs }) {
  return `
  <section class="page-hero deco-host on-dark">
    ${icons.ornament('tl', 480)}
    <div class="container">
      ${crumbs ? breadcrumb(crumbs) : ''}
      ${eyebrow ? `<div class="eyebrow" style="background:rgba(255,255,255,.12);color:#fff">${eyebrow}</div>` : ''}
      <h1>${title}</h1>
      ${desc ? `<p>${desc}</p>` : ''}
    </div>
  </section>`;
}

function wipBanner(text) {
  return `<div class="wip-banner">${icons.wrench}<span>${text || 'هذه الخدمة قيد التطوير حالياً. يمكنك التواصل معنا مباشرة بالوسائل أدناه وسنعاود التواصل معك في أقرب وقت.'}</span></div>`;
}

function contactFallback(contextMessage) {
  const waText = encodeURIComponent(contextMessage || 'مرحباً، أرغب بالاستفسار.');
  return `
  <div class="contact-fallback">
    <a class="btn btn-primary" href="https://api.whatsapp.com/send?phone=966556946333&text=${waText}" target="_blank" rel="noopener">${icons.whatsapp}<span>تواصل عبر واتساب</span></a>
    <a class="btn btn-secondary" href="tel:920005001">${icons.phone}<span>اتصل بنا: 920005001</span></a>
    <a class="btn btn-secondary" href="mailto:info@qran-alhafar.sa">${icons.mail}<span>راسلنا بالبريد</span></a>
  </div>`;
}

function emptyState({ title, desc, icon }) {
  return `
  <div class="empty-state reveal">
    <div class="icon">${icon || icons.image}</div>
    <h3>${title}</h3>
    <p>${desc}</p>
  </div>`;
}

function newsCard(a, { eager = false } = {}) {
  const { picture } = require('./data');
  return `
  <article class="card-news reveal" data-category="${a.categoryAr || ''}" data-search="${(a.titleAr + ' ' + (a.summaryAr || '')).replace(/"/g, '')}">
    <a class="thumb" href="/news/${a.slug}.html">
      ${picture(a.coverImageUrl, a.titleAr, { eager })}
      <span class="badge">${a.categoryAr || 'الأخبار'}</span>
    </a>
    <div class="body">
      <span class="date">${a.dateGregorianAr || a.dateAr}${a.dateHijriAr ? ' هـ · ' + a.dateHijriAr : ''}</span>
      <h3><a href="/news/${a.slug}.html">${a.titleAr}</a></h3>
      <p class="excerpt">${a.summaryAr || ''}</p>
      <span class="read-more">اقرأ المزيد ${icons.arrowStart}</span>
    </div>
  </article>`;
}

function documentCard(doc) {
  const { asset } = require('./data');
  const url = asset(doc.downloadUrl || doc.url || doc.localUrl);
  const sizeLabel = doc.fileSizeAr || '';
  return `
  <a class="card-document reveal" href="${url}" target="_blank" rel="noopener" data-search="${(doc.titleAr || '').replace(/"/g, '')}">
    <span class="cover">${icons.document}</span>
    <span class="doc-body">
      <h4>${doc.titleAr}</h4>
      <span class="meta"><span>PDF</span>${sizeLabel ? `<span>${sizeLabel}</span>` : ''}</span>
    </span>
    <span class="doc-actions">${icons.download}</span>
  </a>`;
}

function personCard(name, role) {
  const initials = (name || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  return `
  <div class="card-person reveal">
    <div class="avatar-initials">${initials}</div>
    <h4>${name}</h4>
    <div class="role">${role}</div>
  </div>`;
}

function renderBlocks(blocks = []) {
  return blocks
    .map((b) => {
      if (b.type === 'paragraph') return `<p>${b.textAr}</p>`;
      if (b.type === 'heading') return `<h3>${b.textAr}</h3>`;
      if (b.type === 'quote') return `<blockquote style="border-inline-start:4px solid var(--gold-500);padding-inline-start:var(--space-5);color:var(--text);font-style:normal;font-weight:600">${b.textAr}</blockquote>`;
      if (b.type === 'list') return `<ul>${(b.items || []).map((i) => `<li>${i}</li>`).join('')}</ul>`;
      if (b.type === 'table') {
        return `<ul style="list-style:none;padding:0;display:flex;flex-direction:column;gap:.5rem">${(b.items || [])
          .map((i) => {
            if (i.labelAr !== undefined) return `<li><strong>${i.labelAr}:</strong> ${i.valueAr || ''}</li>`;
            return `<li><strong>${i.nameAr}</strong>${i.roleAr ? ` — ${i.roleAr}` : ''}</li>`;
          })
          .join('')}</ul>`;
      }
      return '';
    })
    .join('');
}

module.exports = { breadcrumb, pageHero, wipBanner, contactFallback, emptyState, newsCard, documentCard, personCard, renderBlocks };
