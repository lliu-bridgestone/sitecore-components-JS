class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    const label =
      this.label ||
      this.getAttribute("label") ||
      "";

    const value =
      this.value ||
      this.getAttribute("value") ||
      "";

    const copyValue =
      this.copyValue ||
      this.getAttribute("copy-value") ||
      value;

    this.innerHTML = `
      <style>
        .copy-container {
          display: inline-flex;
          flex-direction: column;
          font-family: inherit;
        }

        .copy-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .copy-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .copy-value {
          font-size: 20px;
          font-weight: 500;
          color: #374151;
        }

        .copy-button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .copy-button:hover {
          color: #1f2937;
        }

        .copy-button svg {
          width: 18px;
          height: 18px;
        }

        .copied {
          color: #16a34a;
        }
      </style>

      <div class="copy-container">
        <div class="copy-label">${label}</div>

        <div class="copy-row">
          <span class="copy-value">${value}</span>

          <button
            class="copy-button"
            aria-label="Copy"
            title="Copy"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="10" height="10"></rect>
              <path d="M5 15V5h10"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    const button = this.querySelector(".copy-button");

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyValue);

        button.classList.add("copied");

        setTimeout(() => {
          button.classList.remove("copied");
        }, 1500);
      } catch (err) {
        console.error("Copy failed", err);
      }
    });
  }
}

customElements.define(
  "copy-to-clipboard",
  CopyToClipboard
);