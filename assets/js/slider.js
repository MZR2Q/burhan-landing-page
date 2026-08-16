// سلايدر الهيرو: تبديل تلقائي، شريط تقدّم، لمس/سحب، يتوقف عند التركيز/التمرير
(function () {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;
  const slides = [...root.querySelectorAll('.hero-slide')];
  const dots = [...root.querySelectorAll('.hero-dot')];
  if (slides.length < 2) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 6500;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.setAttribute('data-active', String(n === index)));
    dots.forEach((d, n) => d.setAttribute('data-active', String(n === index)));
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }

  root.querySelector('.hero-arrow.next')?.addEventListener('click', () => { next(); start(); });
  root.querySelector('.hero-arrow.prev')?.addEventListener('click', () => { prev(); start(); });
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  // لمس/سحب
  let startX = 0;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    start();
  });

  show(0);
  start();
})();
