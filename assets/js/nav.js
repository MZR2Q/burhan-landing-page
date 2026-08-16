// الهيدر: تحوّل عند التمرير + قائمة جانبية للموبايل
(function () {
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const drawer = document.querySelector('.nav-drawer');
  if (!drawer) return;
  const openBtn = document.querySelector('[data-nav-open]');
  const closeBtn = drawer.querySelector('[data-nav-close]');
  const backdrop = drawer.querySelector('.nav-drawer-backdrop');
  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    drawer.setAttribute('data-open', 'true');
    drawer.querySelector('.nav-drawer-panel').focus();
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.setAttribute('data-open', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }
  openBtn && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  backdrop && backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.getAttribute('data-open') === 'true') close();
  });

  // طي/فتح الفروع داخل القائمة الجانبية
  drawer.querySelectorAll('[data-sub-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const isOpen = sub.style.display === 'block';
      sub.style.display = isOpen ? 'none' : 'block';
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
