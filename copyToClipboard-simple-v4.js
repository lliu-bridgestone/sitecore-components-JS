class CopyToClipboard extends HTMLElement {
  connectedCallback() {

    const copyText = this.getAttribute("copy-text") || "";
    const copyText = "TEST123";

    this.innerHTML = `
      <style>
        .copy-button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .copy-button:hover {
          color: #374151;
        }

        .copy-button.copied {
          color: #16a34a;
        }

        svg {
          width: 18px;
          height: 18px;
        }
      </style>

      <button
        class="copy-button"
        type="button"
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
      >
        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
          <rect x="9" y="9" width="10" height="10"></rect>
          <path d="M5 15V5h10"></path>
        </svg>
      </button>
    `;

    const button = this.querySelector(".copy-button");

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyText);

        const original = button.innerHTML;

        button.classList.add("copied");
        button.innerHTML = "✓";

        setTimeout(() => {
          button.classList.remove("copied");
          button.innerHTML = original;
        }, 1500);
      } catch (err) {
        console.error("Failed to copy text", err);
      }
    });
  }
}

customElements.define("copy-to-clipboard", CopyToClipboard);
`
