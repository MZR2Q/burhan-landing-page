// تحقق بصري من الحقول + رسالة "قيد التطوير" عند الإرسال (لا خادم يستقبل البيانات بعد — راجع خطط/08)
(function () {
  document.querySelectorAll('form[data-wip-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      form.querySelectorAll('[required]').forEach((input) => {
        const field = input.closest('.field');
        const empty = input.type === 'checkbox' ? !input.checked : !input.value.trim();
        if (field) field.classList.toggle('has-error', empty);
        if (empty) valid = false;
      });
      if (!valid) {
        form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
        return;
      }

      const note = form.querySelector('[data-wip-result]');
      if (note) {
        note.hidden = false;
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('input', () => input.closest('.field')?.classList.remove('has-error'));
    });
  });
})();
