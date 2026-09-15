class SitecoreDatePicker extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <input type="date" id="picker" />
    `;

    this.querySelector("#picker")
      .addEventListener("change", e => {
        const value = e.target.value;

        this.dispatchEvent(
          new CustomEvent("change", {
            detail: {
              value,
              sitecoreValue:
                value.replaceAll("-", "") + "T000000Z"
            },
            bubbles: true
          })
        );
      });
  }
}

customElements.define(
  "sitecore-date-picker",
  SitecoreDatePicker
);