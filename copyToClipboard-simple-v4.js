(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

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

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.copy-to-clipboard-button');

    if (!button) return;

    var text = button.getAttribute('data-copy-text');

    if (!text) return;

    copyText(text)
      .then(function () {
        var originalText = button.innerHTML;

        button.innerHTML = 'Copied!';

        setTimeout(function () {
          button.innerHTML = originalText;
        }, 2000);
      })
      .catch(function (err) {
        console.error('Copy failed:', err);
      });
  });
})();
