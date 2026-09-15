/**
 * Sitecore Date Picker Web Component
 * Tag: <sitecore-date-picker>
 * Version: 1.0.0
 */
class SitecoreDatePicker extends HTMLElement {
  static get observedAttributes() {
    return ["label", "value", "min", "max", "required", "disabled", "help-text"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  get value() {
    return this.shadowRoot?.querySelector("input")?.value || this.getAttribute("value") || "";
  }

  set value(nextValue) {
    if (nextValue) this.setAttribute("value", nextValue);
    else this.removeAttribute("value");
  }

  get sitecoreValue() {
    return this.value ? `${this.value.replaceAll("-", "")}T000000Z` : "";
  }

  get formattedValue() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.value)) return "";
    const [year, month, day] = this.value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(new Date(year, month - 1, day));
  }

  validate() {
    const input = this.shadowRoot.querySelector("input");
    const error = this.shadowRoot.querySelector(".error");
    const valid = input.checkValidity();

    input.setAttribute("aria-invalid", String(!valid));
    error.textContent = valid ? "" : this.validationMessage(input);
    return valid;
  }

  validationMessage(input) {
    if (input.validity.valueMissing) return "Please select a date.";
    if (input.validity.rangeUnderflow) return `Select a date on or after ${input.min}.`;
    if (input.validity.rangeOverflow) return `Select a date on or before ${input.max}.`;
    return "Please select a valid date.";
  }

  emitChange() {
    const valid = this.validate();
    this.dispatchEvent(new CustomEvent("date-change", {
      bubbles: true,
      composed: true,
      detail: {
        value: this.value,
        sitecoreValue: this.sitecoreValue,
        formattedValue: this.formattedValue,
        valid
      }
    }));
  }

  render() {
    const label = this.getAttribute("label") || "Select a date";
    const value = this.getAttribute("value") || "";
    const min = this.getAttribute("min") || "";
    const max = this.getAttribute("max") || "";
    const helpText = this.getAttribute("help-text") || "";
    const required = this.hasAttribute("required");
    const disabled = this.hasAttribute("disabled");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family: Arial, "Segoe UI", sans-serif;
          color: #222;
        }
        .field { display: grid; gap: 7px; }
        label { font-size: 14px; font-weight: 600; }
        .required { color: #c62828; }
        input {
          width: 100%;
          min-height: 44px;
          padding: 9px 12px;
          box-sizing: border-box;
          border: 1px solid #757575;
          border-radius: 4px;
          background: #fff;
          color: #222;
          font: inherit;
        }
        input:focus {
          border-color: #005a9e;
          outline: 2px solid rgba(0, 90, 158, .22);
          outline-offset: 1px;
        }
        input[aria-invalid="true"] { border-color: #c62828; }
        input:disabled { background: #eee; cursor: not-allowed; }
        .help, .error { min-height: 17px; margin: 0; font-size: 12px; }
        .help { color: #555; }
        .error { color: #c62828; }
      </style>
      <div class="field">
        <label for="date-input">
          ${this.escapeHtml(label)}${required ? ' <span class="required">*</span>' : ""}
        </label>
        <input
          id="date-input"
          type="date"
          value="${this.escapeHtml(value)}"
          min="${this.escapeHtml(min)}"
          max="${this.escapeHtml(max)}"
          ${required ? "required" : ""}
          ${disabled ? "disabled" : ""}
          aria-describedby="help error"
        />
        <p id="help" class="help">${this.escapeHtml(helpText)}</p>
        <p id="error" class="error" role="alert"></p>
      </div>
    `;

    const input = this.shadowRoot.querySelector("input");
    input.addEventListener("change", () => {
      if (input.value) this.setAttribute("value", input.value);
      else this.removeAttribute("value");
      this.emitChange();
    });
    input.addEventListener("blur", () => this.validate());
    input.addEventListener("invalid", event => {
      event.preventDefault();
      this.validate();
    });
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    })[character]);
  }
}

if (!customElements.get("sitecore-date-picker")) {
  customElements.define("sitecore-date-picker", SitecoreDatePicker);
}
