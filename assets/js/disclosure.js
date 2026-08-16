// تبويبات + أكورديون + شجرة الهيكل التنظيمي — كلها نمط "إظهار/إخفاء" واحد
(function () {
  // تبويبات
  document.querySelectorAll('[data-tabs]').forEach((wrap) => {
    const btns = [...wrap.querySelectorAll('.tab-btn')];
    const panels = [...wrap.querySelectorAll('.tab-panel')];
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.setAttribute('aria-selected', 'false'));
        panels.forEach((p) => (p.hidden = true));
        btn.setAttribute('aria-selected', 'true');
        panels[i].hidden = false;
      });
    });
  });

  // أكورديون
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  // شجرة الهيكل التنظيمي
  document.querySelectorAll('.org-node > .org-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const node = trigger.parentElement;
      const isOpen = node.getAttribute('data-open') === 'true';
      node.setAttribute('data-open', String(!isOpen));
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
})();
