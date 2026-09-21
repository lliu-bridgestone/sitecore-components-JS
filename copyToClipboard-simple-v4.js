export default function (element) {
  const button = element.querySelector(".copy-button");

  if (!button) return;

  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue;

    try {
      await navigator.clipboard.writeText(value);

      const original = button.innerHTML;

      button.classList.add("copied");

      button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      `;

      setTimeout(() => {
        button.classList.remove("copied");
        button.innerHTML = original;
      }, 1500);

    } catch (err) {
      console.error("Copy failed", err);
    }
  });
}
`
