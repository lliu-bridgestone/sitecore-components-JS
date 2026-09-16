document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-button");

  if (!button || !event.currentTarget.contains(button)) {
    return;
  }

  const component = button.closest(".copy-button-component");
  const valueElement = component?.querySelector(".copy-value");

  if (!valueElement) {
    return;
  }

  const value = valueElement.value ?? valueElement.textContent;

  try {
    await navigator.clipboard.writeText(value);

    const originalLabel = button.textContent;
    button.textContent = "Copied";
    button.setAttribute("aria-label", "Copied");

    setTimeout(() => {
      button.textContent = originalLabel;
      button.removeAttribute("aria-label");
    }, 1500);
  } catch (error) {
    console.error("Unable to copy text:", error);
  }
});