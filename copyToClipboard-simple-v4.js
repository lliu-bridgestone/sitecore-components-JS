class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute("label") || "";
    const value = this.getAttribute("value") || "";

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .container {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          font-family: inherit;
        }

        .label {
          font-size: 14px;
          color: #6b7280;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .value {
          color: #374151;
          font-size: 20px;
          font-weight: 500;
        }

        button {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          color: #64748b;
          display: flex;
          align-items: center;
        }

        button:hover {
          color: #334155;
        }

        svg {
          width: 18px;
          height: 18px;
        }

        .success {
          color: #16a34a;
        }
      </style>

      <div class="container">
        <div class="label">${label}</div>

        <div class="row">
          <span class="value">${value}</span>

          <button type="button" aria-label="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="10" height="10"></rect>
              <path d="M5 15V5h10"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    const button = this.shadowRoot.querySelector("button");

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(value);

        const original = button.innerHTML;

        button.classList.add("success");
        button.innerHTML = "✓";

        setTimeout(() => {
          button.classList.remove("success");
          button.innerHTML = original;
        }, 1500);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

customElements.define("copy-to-clipboard", CopyToClipboard);
