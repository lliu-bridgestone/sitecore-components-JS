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

  function showFeedback(icon) {
    icon.classList.add('is-copied');
    var feedback = icon.parentElement && icon.parentElement.querySelector('.copy-to-clipboard-feedback');
    if (feedback) feedback.classList.add('copy-to-clipboard-feedback--visible');

    window.clearTimeout(icon._copyFeedbackTimer);
    icon._copyFeedbackTimer = window.setTimeout(function () {
      icon.classList.remove('is-copied');
      if (feedback) feedback.classList.remove('copy-to-clipboard-feedback--visible');
    }, 1800);
  }

  function handleActivate(icon) {
    // The text to copy is mapped directly onto the button's own
    // data-copy-text attribute (via the {CopyText} token in the HTML
    // block's Content field), so no DOM traversal is needed at all.
    var text = (icon.getAttribute('data-copy-text') || '').trim();
    if (!text) return;
    copyText(text)
      .then(function () { showFeedback(icon); })
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