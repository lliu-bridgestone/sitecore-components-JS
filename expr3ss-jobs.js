class Expr3ssJobs extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<div id="expr3ss-jobs-widget"></div>';

    const existingScript = document.querySelector(
      'script[data-expr3ss-widget]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://widget.expr3ss.com.au/widget.min.js';
      script.async = true;
      script.setAttribute('data-expr3ss-widget', 'true');

      script.onload = () => {
        if (window.Expr3ss?.renderJobs) {
          window.Expr3ss.renderJobs();
        }
      };

      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        if (window.Expr3ss?.renderJobs) {
          window.Expr3ss.renderJobs();
        }
      }, 500);
    }
  }
}

customElements.define('expr3ss-jobs', Expr3ssJobs);