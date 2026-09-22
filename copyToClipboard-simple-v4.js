class CopyToClipboard extends HTMLElement {
  connectedCallback() {
    const copyText = this.getAttribute("copy-text") || "TEST-TEXT";

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
          line-height: inherit;
        }

        .copy-button:hover {
          color: #374151;
        }

        .copy-button.white {
          color: #ffffff;
        }

        .copy-button.white:hover {
          color: #e5e7eb;
        }

        .copy-button.grey {
          color: #6b7280;
        }

        .copy-button.grey:hover {
          color: #374151;
        }

        .copy-button.copied {
          color: #16a34a;
        }

        .copy-button svg {
          width: max(18px, var(--copy-icon-size, 18px));
          height: max(18px, var(--copy-icon-size, 18px));
          flex: 0 0 auto;
        }
      </style>

      <button
        class="copy-button ${this.classList.contains("white") ? "white" : this.classList.contains("grey") ? "grey" : ""}"
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

    const updateIconSize = () => {
      const styles = getComputedStyle(button);
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      const iconSize = Math.max(18, lineHeight || fontSize || 18);
      button.style.setProperty("--copy-icon-size", `${iconSize}px`);
    };

    updateIconSize();

    const resizeObserver = new ResizeObserver(updateIconSize);
    resizeObserver.observe(button);

    if (this.classList.contains("white")) {
      button.style.color = "#ffffff";
    } else if (this.classList.contains("grey")) {
      button.style.color = "#6b7280";
    }
    const originalColor = button.style.color;

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyText);

        const original = button.innerHTML;

        button.classList.add("copied");
        button.style.color = "#16a34a";
        button.innerHTML = "✓";

        setTimeout(() => {
          button.classList.remove("copied");
          button.style.color = originalColor;
          button.innerHTML = original;
        }, 1500);
      } catch (err) {
        console.error("Failed to copy text", err);
      }
    });
  }
}

customElements.define("copy-to-clipboard", CopyToClipboard);
