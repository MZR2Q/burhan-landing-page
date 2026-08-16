// واجهة يوتيوب كسولة: صورة مصغّرة فقط حتى الضغط، ثم تحميل iframe الحقيقي
(function () {
  document.querySelectorAll('[data-yt-facade]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.ytFacade;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.style.cssText = 'width:100%;height:100%;border:0;position:absolute;inset:0;';
      el.style.position = 'relative';
      el.appendChild(iframe);
    });
  });

  // fallback لصورة maxresdefault المفقودة على بعض الفيديوهات القديمة
  document.querySelectorAll('img[data-yt-thumb-fallback]').forEach((img) => {
    img.addEventListener('error', function handler() {
      img.removeEventListener('error', handler);
      img.src = img.dataset.ytThumbFallback;
    });
  });
})();
