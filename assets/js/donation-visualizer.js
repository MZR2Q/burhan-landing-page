// "الإطار الروحي": يُضيء بلمسة ذهبية عند اختيار مبلغ التبرع — يحوّل الاختيار من فعل نموذج إلى لحظة إحساس
(function () {
  document.querySelectorAll('[data-spiritual-frame]').forEach((wrap) => {
    const frame = wrap.querySelector('.spiritual-frame');
    const chips = wrap.querySelectorAll('.tiers-live .tier-chip');
    if (!frame || !chips.length) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        frame.classList.remove('is-lit');
        // إعادة تشغيل الحركة
        void frame.offsetWidth;
        frame.classList.add('is-lit');
        const link = chip.dataset.href;
        if (link) frame.querySelector('[data-donate-link]')?.setAttribute('href', link);
      });
    });
  });
})();
