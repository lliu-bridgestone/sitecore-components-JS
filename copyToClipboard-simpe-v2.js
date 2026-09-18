class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.handleClick);
    this.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('keydown', this.handleKeydown);
  }

  handleClick = (event) => {
    var icon = event.target.closest('.copy-to-clipboard-icon');
    if (icon && this.contains(icon)) this.handleActivate(icon);
  };

  handleKeydown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var icon = event.target.closest('.copy-to-clipboard-icon');
    if (icon && this.contains(icon)) {
      event.preventDefault();
      this.handleActivate(icon);
    }
  };

  copyText(text) {
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

  showFeedback(icon) {
    var feedback = icon.parentElement && icon.parentElement.querySelector('.copy-to-clipboard-feedback');
    if (!feedback) return;
    feedback.classList.add('copy-to-clipboard-feedback--visible');
    window.clearTimeout(feedback._copyFeedbackTimer);
    feedback._copyFeedbackTimer = window.setTimeout(function () {
      feedback.classList.remove('copy-to-clipboard-feedback--visible');
    }, 1800);
  }

  // The Component builder gives no way to add a custom class to a native
  // Text element or container, so instead of looking for a specific class,
  // walk up from the icon through whatever wrapper <div>s the builder
  // generated, until an ancestor's previous sibling contains text. That
  // sibling holds the mapped copy text, as long as the text element and
  // the icon's HTML block sit next to each other (text first) in the layout.
  findCopyText(icon) {
    var node = icon;
    for (var i = 0; i < 6 && node && node.parentElement; i++) {
      var sib = node.previousElementSibling;
      if (sib && sib.textContent && sib.textContent.trim()) {
        return sib.textContent.trim();
      }
      node = node.parentElement;
    }
    return '';
  }

  handleActivate(icon) {
    var text = this.findCopyText(icon);
    if (!text) return;
    this.copyText(text)
      .then(() => this.showFeedback(icon))
      .catch(function (err) { console.error('Copy to clipboard failed:', err); });
  }
}

customElements.define('copy-to-clipboard', CopyToClipboard);
