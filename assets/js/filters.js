// فلترة/بحث فوري من جهة المتصفح لبطاقات موجودة أصلاً في HTML الساكن (تحسين تدريجي، لا يعتمد عليه المحتوى الأساسي)
(function () {
  const bars = document.querySelectorAll('[data-filter-bar]');
  bars.forEach((bar) => {
    const targetSelector = bar.dataset.filterBar;
    const items = [...document.querySelectorAll(targetSelector)];
    const chips = bar.querySelectorAll('.chip[data-filter-value]');
    const input = bar.querySelector('[data-filter-search]');
    const noResults = document.querySelector(bar.dataset.filterEmpty || '.no-results');
    let activeCategory = 'all';

    function apply() {
      const q = (input?.value || '').trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const cat = item.dataset.category || 'all';
        const text = (item.dataset.search || item.textContent || '').toLowerCase();
        const matchesCat = activeCategory === 'all' || cat === activeCategory;
        const matchesText = !q || text.includes(q);
        const show = matchesCat && matchesText;
        item.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        activeCategory = chip.dataset.filterValue;
        apply();
      });
    });
    input && input.addEventListener('input', apply);
  });
})();
