(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers / non-secure contexts
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  function showFeedback(wrapper) {
    wrapper.classList.add('copy-to-clipboard--copied');
    window.clearTimeout(wrapper._copyFeedbackTimer);
    wrapper._copyFeedbackTimer = window.setTimeout(function () {
      wrapper.classList.remove('copy-to-clipboard--copied');
    }, 1800);
  }

  function handleActivate(icon) {
    var wrapper = icon.closest('.copy-to-clipboard');
    if (!wrapper) return;
    var textEl = wrapper.querySelector('.copy-to-clipboard-text');
    var text = ((textEl && textEl.textContent) || wrapper.dataset.copyText || '').trim();
    if (!text) return;
    copyText(text)
      .then(function () { showFeedback(wrapper); })
      .catch(function (err) { console.error('Copy to clipboard failed:', err); });
  }

  document.addEventListener('click', function (event) {
    var icon = event.target.closest('.copy-to-clipboard-icon');
    if (icon) handleActivate(icon);
  });

  // Keyboard support in case the icon markup isn't a native <button>
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var icon = event.target.closest('.copy-to-clipboard-icon');
    if (icon) {
      event.preventDefault();
      handleActivate(icon);
    }
  });
})();