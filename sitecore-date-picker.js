class SitecoreDatePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      "value",
      "label",
      "name",
      "min",
      "max",
      "placeholder",
      "disabled",
      "readonly",
      "required"
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          font-family:
            "Segoe UI",
            Arial,
            sans-serif;
          color: #1f1f1f;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #323130;
        }

        .required-indicator {
          color: #c50f1f;
          margin-left: 3px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        input {
          width: 100%;
          min-height: 42px;
          box-sizing: border-box;
          padding: 8px 12px;
          border: 1px solid #8a8886;
          border-radius: 4px;
          background-color: #ffffff;
          color: #201f1e;
          font-family: inherit;
          font-size: 15px;
          outline: none;
          transition:
            border-color 120ms ease,
            box-shadow 120ms ease;
        }

        input:hover:not(:disabled) {
          border-color: #323130;
        }

        input:focus {
          border-color: #005a9e;
          box-shadow: 0 0 0 2px rgba(0, 90, 158, 0.2);
        }

        input:disabled {
          cursor: not-allowed;
          background-color: #f3f2f1;
          color: #a19f9d;
          border-color: #c8c6c4;
        }

        input.invalid {
          border-color: #c50f1f;
        }

        input.invalid:focus {
          box-shadow: 0 0 0 2px rgba(197, 15, 31, 0.18);
        }

        .help-text {
          min-height: 18px;
          margin: 0;
          font-size: 12px;
          line-height: 18px;
          color: #605e5c;
        }

        .help-text.error {
          color: #c50f1f;
        }
      </style>

      <div class="field">
        <label part="label">
          <span id="labelText"></span>
          <span
            id="requiredIndicator"
            class="required-indicator"
            hidden
          >*</span>
        </label>

        <div class="input-wrapper">
          <input
            id="dateInput"
            part="input"
            type="date"
            aria-describedby="helpText"
          />
        </div>

        <p
          id="helpText"
          class="help-text"
          part="help-text"
        ></p>
      </div>
    `;

    this.input = this.shadowRoot.getElementById("dateInput");
    this.labelText = this.shadowRoot.getElementById("labelText");
    this.helpText = this.shadowRoot.getElementById("helpText");

    this.requiredIndicator = this.shadowRoot.getElementById(
      "requiredIndicator"
    );

    this.handleInput = this.handleInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
  }

  connectedCallback() {
    this.render();

    this.input.addEventListener("input", this.handleInput);
    this.input.addEventListener("change", this.handleChange);
    this.input.addEventListener("invalid", this.handleInvalid);
  }

  disconnectedCallback() {
    this.input.removeEventListener("input", this.handleInput);
    this.input.removeEventListener("change", this.handleChange);
    this.input.removeEventListener("invalid", this.handleInvalid);
  }

  attributeChangedCallback() {
    if (this.input) {
      this.render();
    }
  }

  render() {
    const label = this.getAttribute("label") || "Date";
    const name = this.getAttribute("name") || "date";
    const value = this.getAttribute("value") || "";
    const min = this.getAttribute("min") || "";
    const max = this.getAttribute("max") || "";
    const placeholder = this.getAttribute("placeholder") || "";

    const disabled = this.hasAttribute("disabled");
    const readonly = this.hasAttribute("readonly");
    const required = this.hasAttribute("required");

    this.labelText.textContent = label;
    this.requiredIndicator.hidden = !required;

    this.input.name = name;
    this.input.value = value;
    this.input.min = min;
    this.input.max = max;
    this.input.placeholder = placeholder;
    this.input.disabled = disabled;
    this.input.readOnly = readonly;
    this.input.required = required;

    this.input.setAttribute(
      "aria-label",
      required ? `${label}, required` : label
    );
  }

  handleInput() {
    this.clearError();

    this.dispatchEvent(
      new CustomEvent("date-input", {
        detail: this.getEventDetail(),
        bubbles: true,
        composed: true
      })
    );
  }

  handleChange() {
    this.setAttribute("value", this.input.value);
    this.validate();

    this.dispatchEvent(
      new CustomEvent("date-change", {
        detail: this.getEventDetail(),
        bubbles: true,
        composed: true
      })
    );
  }

  handleInvalid(event) {
    event.preventDefault();
    this.showValidationError();
  }

  getEventDetail() {
    return {
      name: this.name,
      value: this.value,
      formattedValue: this.formattedValue,
      sitecoreValue: this.sitecoreValue,
      date: this.date,
      valid: this.input.validity.valid
    };
  }

  validate() {
    const isValid = this.input.checkValidity();

    if (!isValid) {
      this.showValidationError();
      return false;
    }

    this.clearError();
    return true;
  }

  showValidationError() {
    let message = "Please select a valid date.";

    if (this.input.validity.valueMissing) {
      message = "Please select a date.";
    } else if (this.input.validity.rangeUnderflow) {
      message = `Please select a date on or after ${this.formatDate(
        this.min
      )}.`;
    } else if (this.input.validity.rangeOverflow) {
      message = `Please select a date on or before ${this.formatDate(
        this.max
      )}.`;
    } else if (this.input.validity.badInput) {
      message = "The entered date is not valid.";
    }

    this.input.classList.add("invalid");
    this.input.setAttribute("aria-invalid", "true");

    this.helpText.textContent = message;
    this.helpText.classList.add("error");
  }

  clearError() {
    this.input.classList.remove("invalid");
    this.input.removeAttribute("aria-invalid");

    this.helpText.textContent = "";
    this.helpText.classList.remove("error");
  }

  clear() {
    this.input.value = "";
    this.removeAttribute("value");
    this.clearError();

    this.dispatchEvent(
      new CustomEvent("date-change", {
        detail: this.getEventDetail(),
        bubbles: true,
        composed: true
      })
    );
  }

  focus() {
    this.input.focus();
  }

  formatDate(value) {
    if (!value || !this.isValidDateString(value)) {
      return "";
    }

    const [year, month, day] = value.split("-").map(Number);

    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  isValidDateString(value) {
    return /^\\d{4}-\\d{2}-\\d{2}$/.test(value);
  }

  get value() {
    return this.input?.value || "";
  }

  set value(newValue) {
    const value = newValue || "";

    if (value) {
      this.setAttribute("value", value);
    } else {
      this.removeAttribute("value");
    }

    if (this.input) {
      this.input.value = value;
    }
  }

  get name() {
    return this.getAttribute("name") || "date";
  }

  set name(newValue) {
    this.setAttribute("name", newValue);
  }

  get min() {
    return this.getAttribute("min") || "";
  }

  set min(newValue) {
    if (newValue) {
      this.setAttribute("min", newValue);
    } else {
      this.removeAttribute("min");
    }
  }

  get max() {
    return this.getAttribute("max") || "";
  }

  set max(newValue) {
    if (newValue) {
      this.setAttribute("max", newValue);
    } else {
      this.removeAttribute("max");
    }
  }

  get date() {
    if (!this.value || !this.isValidDateString(this.value)) {
      return null;
    }

    const [year, month, day] = this.value.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  get formattedValue() {
    return this.formatDate(this.value);
  }

  /*
   * Converts 2026-09-16 into the Sitecore-style value:
   * 20260916T000000Z
   */
  get sitecoreValue() {
    if (!this.value || !this.isValidDateString(this.value)) {
      return "";
    }

    return `${this.value.replaceAll("-", "")}T000000Z`;
  }
}

if (!customElements.get("sitecore-date-picker")) {
  customElements.define(
    "sitecore-date-picker",
    SitecoreDatePicker
  );
}

export default SitecoreDatePicker;