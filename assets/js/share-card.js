// يولّد بطاقة "نيّة خير" قابلة للتنزيل/المشاركة — بالكامل داخل المتصفح (Canvas API)، بلا خادم
(function () {
  const modal = document.createElement('div');
  modal.className = 'share-modal';
  modal.innerHTML = `
    <div class="share-modal-backdrop" data-close></div>
    <div class="share-modal-panel">
      <button class="share-modal-close" data-close aria-label="إغلاق">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <canvas width="1200" height="675"></canvas>
      <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:var(--space-4)">شارك نيّتك مع من حولك — فالدال على الخير كفاعله</p>
      <div class="share-modal-actions">
        <button class="btn btn-secondary btn-block" data-download>تنزيل الصورة</button>
        <button class="btn btn-primary btn-block" data-share>مشاركة</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const canvas = modal.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach((w) => {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async function draw({ title, quote, category }) {
    const W = canvas.width, H = canvas.height;

    // خلفية متدرّجة بألوان الهوية
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#12293D');
    grad.addColorStop(1, '#423E78');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // زخرفة زوايا خفيفة
    ctx.strokeStyle = 'rgba(212,197,150,0.55)';
    ctx.lineWidth = 2;
    [
      [40, 40, 1, 1], [W - 40, 40, -1, 1], [40, H - 40, 1, -1], [W - 40, H - 40, -1, -1],
    ].forEach(([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y + 60 * sy);
      ctx.lineTo(x, y);
      ctx.lineTo(x + 60 * sx, y);
      ctx.stroke();
    });

    // إطار داخلي
    ctx.strokeStyle = 'rgba(212,197,150,0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, W - 48, H - 48);

    await document.fonts.load('800 40px Tajawal');
    await document.fonts.load('700 32px Tajawal');
    await document.fonts.load('400 28px "IBM Plex Sans Arabic"');
    await document.fonts.ready;

    // شعار نصي
    try {
      const logo = await loadImage('/assets/img/logo.png');
      ctx.save();
      ctx.beginPath();
      ctx.arc(W / 2, 110, 46, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.clip();
      ctx.drawImage(logo, W / 2 - 40, 70, 80, 80);
      ctx.restore();
    } catch {
      /* تجاهل فشل تحميل الشعار — البطاقة تبقى صالحة بدونه */
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#D9C88F';
    ctx.font = '700 26px Tajawal';
    ctx.fillText(category || 'جمعية برهان لتحفيظ القرآن الكريم', W / 2, 200);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 46px Tajawal';
    const titleLines = wrapText(title, W - 200);
    let y = 270;
    titleLines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, W / 2, y);
      y += 58;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '400 28px "IBM Plex Sans Arabic"';
    const quoteLines = wrapText(quote || '', W - 280);
    y += 20;
    quoteLines.slice(0, 3).forEach((line) => {
      ctx.fillText(line, W / 2, y);
      y += 40;
    });

    ctx.fillStyle = '#D9C88F';
    ctx.font = '700 22px Tajawal';
    ctx.fillText('qran-alhfar.sa  ·  تبرّع الآن', W / 2, H - 55);
  }

  let currentUrl = '';
  let currentTitle = '';

  document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('[data-share-card]');
    if (!trigger) return;
    currentUrl = trigger.dataset.url || location.href;
    currentTitle = trigger.dataset.title || '';
    modal.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    await draw({ title: trigger.dataset.title, quote: trigger.dataset.quote, category: trigger.dataset.category });
  });

  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      modal.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
    }
  });

  modal.querySelector('[data-download]').addEventListener('click', () => {
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'نيتي-الخيرية-جمعية-برهان.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, 'image/png');
  });

  modal.querySelector('[data-share]').addEventListener('click', () => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'نيتي-الخيرية.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: currentTitle, text: `${currentTitle} — ${currentUrl}` });
          return;
        } catch {
          /* المستخدم ألغى المشاركة أو فشلت — نكمل بالبديل أدناه */
        }
      }
      const text = encodeURIComponent(`${currentTitle}\n${currentUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener');
    }, 'image/png');
  });
})();
