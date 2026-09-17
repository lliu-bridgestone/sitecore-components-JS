document.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy-button");

  if (!button || !event.currentTarget.contains(button)) {
    return;
  }

  const component = button.closest(".copy-button-component");
  const variable = component?.querySelector("var[data-path]");
  const textToCopy = variable?.textContent.trim();

  if (!textToCopy) {
    return;
  }

  try {
    await navigator.clipboard.writeText(textToCopy);

    button.setAttribute("aria-label", "Copied");
    button.setAttribute("title", "Copied");

    setTimeout(() => {
      button.setAttribute("aria-label", "Copy text");
      button.setAttribute("title", "Copy text");
    }, 1500);
  } catch (error) {
    console.error("Unable to copy text:", error);
  }
});