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

  // The Component builder gives no way to add a custom class to a native
  // Text element or container, so instead of looking for a specific class,
  // walk up from the icon through whatever wrapper <div>s the builder
  // generated, until an ancestor's previous sibling contains text. That
  // sibling holds the mapped copy text, as long as the text element and
  // the icon's HTML block sit next to each other (text first) in the layout.
  var MAX_LEVELS = 6;
  function findCopySibling(icon) {
    var node = icon;
    for (var i = 0; i < MAX_LEVELS && node && node.parentElement; i++) {
      var sib = node.previousElementSibling;
      if (sib && sib.textContent && sib.textContent.trim()) {
        return sib;
      }
      node = node.parentElement;
    }
    return null;
  }

  function handleActivate(icon) {
    var sibling = findCopySibling(icon);
    var text = sibling ? sibling.textContent.trim() : '';
    if (!text) return;
    copyText(text)
      .then(function () { showFeedback(icon); })
      .catch(function (err) { console.error('Copy to clipboard failed:', err); });
  }

  // Match the icon's size to the font-size of the text it sits next to,
  // rather than whatever font-size the icon's own block happens to inherit
  // from the Style Guide. Runs once per icon on load.
  function sizeIconToSibling(icon) {
    var sibling = findCopySibling(icon);
    if (!sibling) return;
    var fontSize = window.getComputedStyle(sibling).fontSize;
    if (fontSize) icon.style.fontSize = fontSize;
  }

  function initIcons() {
    var icons = document.querySelectorAll('.copy-to-clipboard-icon');
    for (var i = 0; i < icons.length; i++) sizeIconToSibling(icons[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIcons);
  } else {
    initIcons();
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
