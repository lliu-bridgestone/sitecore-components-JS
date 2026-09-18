class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    const button = this.querySelector(".copy-button");

    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      const variable = this.querySelector("var[data-path]");
      const textToCopy = variable?.textContent.trim() || this.dataset.copyText;

      if (!textToCopy) {
        return;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);

        button.setAttribute("aria-label", "Copied");
        button.setAttribute("title", "Copied");

        setTimeout(() => {
          button.setAttribute("aria-label", "Copy text");
          button.setAttribute("title", "Copy text");
        }, 1500);
      } catch (error) {
        console.error("Unable to copy text:", error);
      }
    });
  }
}

customElements.define("copy-to-clipboard", CopyToClipboard);