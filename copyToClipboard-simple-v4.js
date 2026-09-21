class CopyToClipboard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  async copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");

      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  render() {
    this.innerHTML = `
      <button
        type="button"
        class="copy-to-clipboard-button"
      >
        Copy to Clipboard
      </button>
    `;

    var button = this.querySelector(
      ".copy-to-clipboard-button"
    );

    button.addEventListener("click", async () => {
      var text =
        this.copyText ||
        this.getAttribute("copy-text") ||
        "";

      if (!text.trim()) {
        return;
      }

      try {
        await this.copyTextToClipboard(text);

        var originalText = button.textContent;

        button.textContent = "Copied!";

        setTimeout(function () {
          button.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error(
          "Copy to clipboard failed:",
          err
        );
      }
    });
  }

  copyTextToClipboard(text) {
    return this.copyText(text);
  }
}

customElements.define(
  "copy-to-clipboard",
  CopyToClipboard
);
``
