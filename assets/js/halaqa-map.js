// خريطة مخصّصة بهوية الجمعية (Leaflet ذاتي الاستضافة + إحداثيات حقيقية مُصدَّرة من خريطة الجمعية) — لا Google iframe
(function () {
  const el = document.getElementById('halaqa-map');
  const panel = document.querySelector('[data-halaqa-panel]');
  if (!el || typeof L === 'undefined') return;

  const MAX_ZOOM = 21;
  const TILES = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };
  const ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  function currentTheme() {
    const forced = document.documentElement.getAttribute('data-theme');
    if (forced) return forced;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  const map = L.map(el, { scrollWheelZoom: false, attributionControl: true, maxZoom: MAX_ZOOM });
  let tileLayer = L.tileLayer(TILES[currentTheme()], { attribution: ATTRIB, maxZoom: MAX_ZOOM, maxNativeZoom: 20 }).addTo(map);

  // يفعّل التمرير بالعجلة فقط بعد نقرة، حتى لا يخطف تمرير الصفحة
  el.addEventListener('click', () => map.scrollWheelZoom.enable());
  document.addEventListener('click', (e) => {
    if (!el.contains(e.target)) map.scrollWheelZoom.disable();
  });

  // أيقونات بدل الدبابيس التقليدية — شارة دائرية مصمّتة بأيقونة تدل على نوع الموقع
  const CATEGORY_ICON_SVG = {
    hq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 21 12 17l-5.5 4L8 13.5 3 9l6.5-.5z"/></svg>',
    boys: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 1 3 3c0 1.5-1 2.5-1 2.5h-4S9 6.5 9 5a3 3 0 0 1 3-3z"/><path d="M12 7.5V11"/><path d="M3 21v-6a9 9 0 0 1 18 0v6"/><path d="M2 21h20"/><path d="M9 21v-4a3 3 0 0 1 6 0v4"/></svg>',
    girls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H2z"/><path d="M22 4.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H22z"/></svg>',
  };
  const CATEGORY_STAT_LABELS = {
    boys: ['عدد المستفيدين', 'عدد المعلمين', 'عدد الحلقات'],
    girls: ['عدد المستفيدات', 'عدد المعلمات', 'عدد الحلقات'],
  };

  function pinIcon(color, category, isHq) {
    const svg = CATEGORY_ICON_SVG[category] || CATEGORY_ICON_SVG.boys;
    return L.divIcon({
      className: '',
      html: `<div class="halaqa-pin${isHq ? ' hq-pin' : ''}" style="background:${color}">${svg}</div>`,
      iconSize: isHq ? [48, 48] : [40, 40],
      iconAnchor: isHq ? [24, 24] : [20, 20],
      popupAnchor: [0, -22],
    });
  }

  function openPanel(p) {
    if (!panel) return;
    const icon = CATEGORY_ICON_SVG[p.category] || CATEGORY_ICON_SVG.boys;

    let statsHtml;
    if (p.stats && p.stats.length) {
      // بيانات حقيقية (تتوفر للمقر الرئيسي فقط حالياً)
      statsHtml = p.stats
        .map((s) => `<div class="halaqa-info-stat"><div class="num">${Number(s.value.replace(/\./g, '')).toLocaleString('ar-SA')}</div><div class="label">${s.labelAr}</div></div>`)
        .join('');
    } else {
      // لا بيانات مستقلة موثّقة لهذا الموقع بعد — نعرض ذلك صراحة بدل اختلاق أرقام
      const labels = CATEGORY_STAT_LABELS[p.category] || CATEGORY_STAT_LABELS.boys;
      statsHtml = labels.map((l) => `<div class="halaqa-info-stat"><div class="num unavailable">—</div><div class="label">${l}</div></div>`).join('');
    }

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

    panel.innerHTML = `
      <button class="halaqa-info-close" data-halaqa-close aria-label="إغلاق">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="halaqa-info-photo">${icon}<span>${p.hasPhoto ? '' : 'لا تتوفر صورة لهذا الموقع حالياً'}</span></div>
      <span class="badge halaqa-info-cat">${p.categoryLabelAr}</span>
      <h3>${p.name}</h3>
      <div class="halaqa-info-stats">${statsHtml}</div>
      ${!p.stats ? '<p class="halaqa-info-note">بيانات هذا الموقع تحديداً غير موثّقة بعد لدى الجمعية.</p>' : ''}
      <a class="btn btn-primary btn-block halaqa-info-directions" href="${directionsUrl}" target="_blank" rel="noopener">الحصول على الاتجاهات</a>
    `;
    panel.setAttribute('data-open', 'true');
  }

  function closePanel() {
    if (panel) panel.removeAttribute('data-open');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-halaqa-close]')) closePanel();
  });

  fetch('/burhan-landing-page/data/halaqas.json')
    .then((r) => r.json())
    .then((points) => {
      const markers = {};
      const cityBounds = [];
      const HQ = [28.4391466, 45.9700987];
      let activePin = null;
      points.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: pinIcon(p.color, p.category, p.category === 'hq') });
        marker.on('click', () => {
          if (activePin) activePin.classList.remove('is-active');
          const el2 = marker.getElement();
          const pin = el2 && el2.querySelector('.halaqa-pin');
          if (pin) { pin.classList.add('is-active'); activePin = pin; }
          openPanel(p);
        });
        marker.addTo(map);
        (markers[p.category] ||= []).push(marker);
        // العرض الافتراضي يُركّز على تجمّع حفر الباطن؛ الفروع البعيدة (كسامودة/الذيبية) تبقى مُعلَّمة على الخريطة وتظهر بالتصغير اليدوي، بلا إخفاء بيانات
        if (Math.abs(p.lat - HQ[0]) < 0.15 && Math.abs(p.lng - HQ[1]) < 0.15) cityBounds.push([p.lat, p.lng]);
      });
      if (cityBounds.length) map.fitBounds(cityBounds, { padding: [28, 28], maxZoom: 14 });

      const countEl = document.querySelector('[data-halaqa-count]');
      if (countEl) countEl.textContent = `${points.length} موقعاً موثّقاً`;

      document.querySelectorAll('[data-map-filter]').forEach((chip) => {
        chip.addEventListener('click', () => {
          const cat = chip.dataset.mapFilter;
          document.querySelectorAll('[data-map-filter]').forEach((c) => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          Object.entries(markers).forEach(([key, list]) => {
            list.forEach((m) => {
              const show = cat === 'all' || cat === key;
              if (show && !map.hasLayer(m)) m.addTo(map);
              if (!show && map.hasLayer(m)) map.removeLayer(m);
            });
          });
        });
      });
    })
    .catch(() => {
      el.innerHTML = '<p style="padding:2rem;text-align:center;color:var(--text-muted)">تعذّر تحميل بيانات الخريطة حالياً.</p>';
    });

  // تبديل طبقة الخرائط مع الوضع الليلي
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    setTimeout(() => {
      map.removeLayer(tileLayer);
      tileLayer = L.tileLayer(TILES[currentTheme()], { attribution: ATTRIB, maxZoom: MAX_ZOOM, maxNativeZoom: 20 }).addTo(map);
    }, 50);
  });
})();
