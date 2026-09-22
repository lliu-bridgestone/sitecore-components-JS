class SitecoreInviteModal extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "Invite teammate";
    const description = this.getAttribute("description") || "Send an invite by email and choose a role.";
    const triggerLabel = this.getAttribute("trigger-label") || "Invite teammate";

    this.innerHTML = `
      <style>
        :host { display: block; color: #222; font-family: Arial, "Segoe UI", sans-serif; }
        .trigger, .action, .close, .role { cursor: pointer; font: inherit; }
        .trigger, .action { border: 1px solid #222; border-radius: 6px; padding: 9px 14px; background: #222; color: #fff; font-size: 13px; font-weight: 600; }
        .trigger:hover, .action:hover { opacity: .88; }
        .backdrop { position: fixed; inset: 0; z-index: 40; background: rgba(0, 0, 0, .2); }
        .dialog-wrap { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px; }
        .dialog { width: min(100%, 480px); box-sizing: border-box; padding: 24px; border: 1px solid #ddd; border-radius: 12px; background: #fff; box-shadow: 0 14px 40px rgba(0, 0, 0, .18); }
        .header { display: flex; align-items: flex-start; gap: 12px; }
        .icon { display: grid; flex: 0 0 40px; width: 40px; height: 40px; place-items: center; border-radius: 50%; background: #f1f1f1; }
        .heading { flex: 1; min-width: 0; }
        h2 { margin: 0; font-size: 16px; }
        .description { margin: 5px 0 0; color: #666; font-size: 12px; }
        .close { width: 28px; height: 28px; border: 1px solid #ddd; border-radius: 6px; background: #fff; color: #555; font-size: 18px; line-height: 1; }
        .field { display: block; margin-top: 16px; color: #222; font-size: 12px; font-weight: 600; }
        input, select { display: block; box-sizing: border-box; width: 100%; height: 40px; margin-top: 5px; padding: 8px 12px; border: 1px solid #ccc; border-radius: 7px; background: #fff; color: #222; font: inherit; font-weight: 400; }
        input:focus, select:focus, button:focus-visible { outline: 2px solid #4a90e2; outline-offset: 2px; }
        .roles { display: flex; gap: 8px; margin-top: 5px; }
        .role { padding: 7px 10px; border: 1px solid #ccc; border-radius: 6px; background: #fff; color: #333; font-size: 12px; }
        .role[aria-pressed="true"] { border-color: #222; background: #222; color: #fff; }
        .selects { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .action.secondary { border-color: #ccc; background: #fff; color: #222; }
        .action.danger { border-color: #b42318; background: #b42318; }
        .action:disabled { cursor: not-allowed; opacity: .5; }
        .success { margin: 18px 0 0; color: #18794e; font-size: 14px; }
        [hidden] { display: none !important; }
        @media (max-width: 520px) { .dialog { padding: 18px; } .actions .action { flex: 1 1 auto; } }
      </style>
      <button class="trigger" type="button">${this.escapeHtml(triggerLabel)}</button>
      <div class="backdrop" hidden aria-hidden="true"></div>
      <div class="dialog-wrap" hidden role="dialog" aria-modal="true" aria-labelledby="invite-modal-title">
        <section class="dialog">
          <div class="header">
            <div class="icon" aria-hidden="true">&#128101;</div>
            <div class="heading">
              <h2 id="invite-modal-title">${this.escapeHtml(title)}</h2>
              <p class="description">${this.escapeHtml(description)}</p>
            </div>
            <button class="close" type="button" aria-label="Close">&times;</button>
          </div>
          <form class="invite-form" novalidate>
            <label class="field">Email
              <input class="email" name="email" type="email" placeholder="name@company.com" autocomplete="email" required>
            </label>
            <div class="field">Role
              <div class="roles" role="group" aria-label="Role">
                <button class="role" type="button" data-role="viewer" aria-pressed="true">Viewer</button>
                <button class="role" type="button" data-role="editor" aria-pressed="false">Editor</button>
                <button class="role" type="button" data-role="admin" aria-pressed="false">Admin</button>
              </div>
            </div>
            <div class="selects">
              <label class="field">Department
                <select name="department"><option>General</option><option>Engineering</option><option>Design</option><option>Marketing</option></select>
              </label>
              <label class="field">Expires
                <select name="expires"><option>7 days</option><option>30 days</option><option>Never</option></select>
              </label>
            </div>
            <div class="actions">
              <button class="action" type="submit">Send invite</button>
              <button class="action secondary copy" type="button">Copy invite link</button>
              <button class="action danger cancel" type="button">Cancel</button>
            </div>
          </form>
          <p class="success" hidden role="status">Invitation sent to <strong class="success-email"></strong>.</p>
        </section>
      </div>
    `;

    const trigger = this.querySelector(".trigger");
    const backdrop = this.querySelector(".backdrop");
    const dialogWrap = this.querySelector(".dialog-wrap");
    const dialog = this.querySelector(".dialog");
    const form = this.querySelector(".invite-form");
    const email = this.querySelector(".email");
    const success = this.querySelector(".success");
    let role = "viewer";

    const close = () => {
      dialogWrap.hidden = true;
      backdrop.hidden = true;
      trigger.focus();
    };
    const open = () => {
      form.reset();
      success.hidden = true;
      form.hidden = false;
      this.setRole("viewer");
      dialogWrap.hidden = false;
      backdrop.hidden = false;
      email.focus();
    };

    this.setRole = nextRole => {
      role = nextRole;
      this.querySelectorAll(".role").forEach(button => {
        button.setAttribute("aria-pressed", String(button.dataset.role === role));
      });
    };

    trigger.addEventListener("click", open);
    this.querySelector(".close").addEventListener("click", close);
    this.querySelector(".cancel").addEventListener("click", close);
    backdrop.addEventListener("click", close);
    dialogWrap.addEventListener("click", event => {
      if (event.target === dialogWrap) close();
    });
    this.addEventListener("keydown", event => {
      if (event.key === "Escape" && !dialogWrap.hidden) close();
    });
    this.querySelectorAll(".role").forEach(button => {
      button.addEventListener("click", () => this.setRole(button.dataset.role));
    });
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
      this.querySelector(".success-email").textContent = email.value;
      form.hidden = true;
      success.hidden = false;
      setTimeout(close, 1400);
    });
    this.querySelector(".copy").addEventListener("click", async event => {
      const button = event.currentTarget;
      const link = `${window.location.origin}/invite?role=${encodeURIComponent(role)}`;
      try {
        await navigator.clipboard.writeText(link);
        const originalText = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = originalText; }, 1500);
      } catch (error) {
        console.error("Unable to copy invite link:", error);
      }
    });
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    })[character]);
  }
}

if (!customElements.get("sitecore-invite-modal")) {
  customElements.define("sitecore-invite-modal", SitecoreInviteModal);
}