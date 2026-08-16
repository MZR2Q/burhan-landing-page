// نافذة صور/فيديو مكبَّرة — قابلة للاستخدام مع أي مجموعة [data-lightbox-group]
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML = `
    <div class="lightbox-backdrop" data-close></div>
    <div class="lightbox-content" role="dialog" aria-modal="true">
      <button class="lightbox-close" data-close aria-label="إغلاق">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <button class="lightbox-nav prev" data-prev aria-label="السابق">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
      </button>
      <div class="lightbox-media"></div>
      <button class="lightbox-nav next" data-next aria-label="التالي">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
      </button>
    </div>`;
  document.body.appendChild(overlay);
  const mediaHost = overlay.querySelector('.lightbox-media');

  let group = [];
  let idx = 0;
  let lastFocused = null;

  function render() {
    const item = group[idx];
    if (!item) return;
    if (item.type === 'video') {
      mediaHost.innerHTML = `<iframe src="${item.src}" title="فيديو" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    } else {
      mediaHost.innerHTML = `<img src="${item.src}" alt="${item.alt || ''}">`;
    }
    overlay.querySelector('.lightbox-nav.prev').style.display = group.length > 1 ? '' : 'none';
    overlay.querySelector('.lightbox-nav.next').style.display = group.length > 1 ? '' : 'none';
  }

  function open(items, startIndex) {
    group = items;
    idx = startIndex;
    lastFocused = document.activeElement;
    render();
    overlay.setAttribute('data-open', 'true');
    overlay.querySelector('.lightbox-close').focus();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.setAttribute('data-open', 'false');
    mediaHost.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  overlay.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(); });
  overlay.querySelector('[data-prev]').addEventListener('click', () => { idx = (idx - 1 + group.length) % group.length; render(); });
  overlay.querySelector('[data-next]').addEventListener('click', () => { idx = (idx + 1) % group.length; render(); });
  document.addEventListener('keydown', (e) => {
    if (overlay.getAttribute('data-open') !== 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') overlay.querySelector('[data-next]').click();
    if (e.key === 'ArrowRight') overlay.querySelector('[data-prev]').click();
  });

  // تفويض الأحداث: أي عنصر يحمل data-lightbox-src ينضم لأقرب مجموعة data-lightbox-group
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-src]');
    if (!trigger) return;
    e.preventDefault();
    const groupName = trigger.dataset.lightboxGroup || 'default';
    const all = [...document.querySelectorAll(`[data-lightbox-src][data-lightbox-group="${groupName}"]`)];
    const items = all.map((el) => ({
      src: el.dataset.lightboxSrc,
      alt: el.dataset.lightboxAlt || '',
      type: el.dataset.lightboxType || 'image',
    }));
    const startIndex = all.indexOf(trigger);
    open(items, Math.max(0, startIndex));
  });
})();
