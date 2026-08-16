// عدّ تصاعدي عند دخول العنصر نطاق الرؤية
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    const target = parseFloat(el.dataset.counter.replace(/,/g, ''));
    const suffix = el.dataset.counterSuffix || '';
    const duration = reduceMotion ? 0 : 1500;
    const start = performance.now();
    function frame(now) {
      const p = duration ? Math.min(1, (now - start) / duration) : 1;
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('ar-SA') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => io.observe(c));
})();
