// الصفحة الرئيسية "تعيش" مع التقويم الهجري: تكتشف رمضان/الأعياد/محرم تلقائياً وتُبرز خبراً حقيقياً مطابقاً
// بلا خادم وبلا لوحة تحكم — راجع فكرة "الموسم الهجري" في المحادثة
(function () {
  const strip = document.querySelector('[data-season-strip]');
  const dataEl = document.getElementById('season-data');
  if (!strip || !dataEl) return;

  let seasons;
  try {
    seasons = JSON.parse(dataEl.textContent);
  } catch {
    return;
  }

  function hijriParts(date) {
    try {
      const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { year: 'numeric', month: 'numeric', day: 'numeric' });
      const parts = fmt.formatToParts(date);
      const get = (t) => parseInt(parts.find((p) => p.type === t).value, 10);
      return { month: get('month'), day: get('day') };
    } catch {
      return null;
    }
  }

  function detectSeason(month, day) {
    if (month === 9) return 'ramadan';
    if (month === 10 && day <= 4) return 'eidFitr';
    if (month === 12 && day >= 8 && day <= 13) return 'hajjEidAdha';
    if (month === 1 && day <= 10) return 'muharram';
    return null;
  }

  // دعم معاينة يدوية للاختبار: ?season=ramadan
  const forced = new URLSearchParams(location.search).get('season');
  let key = forced;
  if (!key) {
    const parts = hijriParts(new Date());
    if (!parts) return;
    key = detectSeason(parts.month, parts.day);
  }

  const season = key && seasons[key];
  if (!season) return;

  document.body.setAttribute('data-season', key);
  strip.innerHTML = `
    <span class="icon" aria-hidden="true">${season.icon || ''}</span>
    <span>${season.greeting}</span>
    ${season.article ? `<a href="/news/${season.article.slug}.html">${season.article.titleAr} ←</a>` : ''}
  `;
  strip.setAttribute('data-active', 'true');
})();
