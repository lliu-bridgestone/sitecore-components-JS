# Copy to Clipboard Sitecore Component

## Overview

The `copy-to-clipboard` component is a custom HTML element that renders a copy icon button. When the button is clicked, it copies the value from the `copy-text` attribute to the user's clipboard and temporarily changes the icon to indicate success.

## Component Files

- JavaScript: `copyToClipboard-simple-v4.js`
- Public script URL: `https://lliu-bridgestone.github.io/sitecore-components-JS/copyToClipboard-simple-v4.js`
- Custom element name: `copy-to-clipboard`

## How It Works

1. The browser loads `copyToClipboard-simple-v4.js`.
2. The script registers the `copy-to-clipboard` custom element.
3. When the browser finds a `<copy-to-clipboard>` element, `connectedCallback()` runs.
4. The component reads the `copy-text` attribute.
5. The component replaces its contents with a styled copy button.
6. Clicking the button calls `navigator.clipboard.writeText()`.
7. On success, the button changes to a green check mark for 1.5 seconds, then returns to the copy icon.

## Required Script

Load the JavaScript file once on the page. The `defer` attribute allows the HTML to be parsed before the script runs.

```html
<script
  src="https://lliu-bridgestone.github.io/sitecore-components-JS/copyToClipboard-simple-v4.js"
  defer>
</script>
```

The script must be loaded before the component can work. A bare `<copy-to-clipboard>` tag will not function if the script has not been loaded.

## Basic HTML Usage

```html
<copy-to-clipboard copy-text="Text to copy"></copy-to-clipboard>
```

The `copy-text` attribute contains the exact text that will be copied.

## Icon Color

The icon is grey by default. Add a class to the custom element to choose the icon color:

```html
<copy-to-clipboard class="grey" copy-text="Grey icon"></copy-to-clipboard>

<copy-to-clipboard class="white" copy-text="White icon"></copy-to-clipboard>
```

Supported classes:

- `grey`: grey icon with a darker grey hover state
- `white`: white icon with a light grey hover state

The copied tick keeps the selected color. If no color class is provided, the copied state is green.

## Sitecore Usage

In Sitecore, configure the component so the rendered HTML includes the `copy-text` attribute:

```html
<copy-to-clipboard copy-text="{CopyText}"></copy-to-clipboard>
```

After rendering, the output should look similar to:

```html
<copy-to-clipboard copy-text="Meow"></copy-to-clipboard>
```

The value must be present on the rendered custom element. If the field is empty or the attribute is omitted, the component falls back to `TEST-TEXT` in the current v4 implementation.

## Example Rendered Markup

```html
<copy-to-clipboard
  class="-component -dimensions--"
  data-embed-src="https://lliu-bridgestone.github.io/sitecore-components-JS/copyToClipboard-simple-v4.js"
  data-embed-title="copy-to-clipboard"
  copy-text="Meow">
</copy-to-clipboard>
```

The `data-embed-*` and `data-path-*` attributes are Sitecore/editor metadata. The component uses the `copy-text` attribute for the clipboard value.

## Styling and Accessibility

The component creates its own styles and renders a native `<button>` element. The button includes:

- `type="button"` to prevent accidental form submission
- An accessible `aria-label`
- A tooltip through the `title` attribute
- A visible success state after copying

## Browser Requirements

The component uses the Clipboard API. Clipboard access generally requires:

- A secure context such as HTTPS or localhost
- A direct user action, such as clicking the button
- Browser permission to write to the clipboard

If clipboard access fails, the component logs `Failed to copy text` in the browser console.

## Troubleshooting

### Nothing happens when clicking

Verify that the script is loaded:

```js
customElements.get("copy-to-clipboard")
```

Expected result: the registered `CopyToClipboard` class. If the result is `undefined`, the script has not loaded or the URL is incorrect.

### The copy value is missing

Inspect the rendered element and verify that it contains `copy-text`:

```js
$0.getAttribute("copy-text")
```

For example, the expected result is:

```js
"Meow"
```

Also check for component instances that do not contain the attribute:

```js
document.querySelectorAll("copy-to-clipboard:not([copy-text])")
```

### The component works in one location but not another

The JavaScript file may only be loaded by the original Sitecore component instance. Ensure the script is loaded once at the page level, or ensure the Sitecore embed mechanism loads it for the new location as well.

### Clipboard errors appear in the console

Confirm that the page is running over HTTPS or localhost and that the click is coming directly from the rendered button. Some browsers block clipboard access on insecure pages or outside a user-initiated action.

## Maintenance Notes

- Keep the custom element name unchanged: `copy-to-clipboard`.
- Keep the attribute name unchanged: `copy-text`.
- Load the script only once per page when possible.
- If the public script URL changes, update the URL wherever the Sitecore component embeds it.
