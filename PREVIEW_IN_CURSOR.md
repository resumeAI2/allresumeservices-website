# Preview the site in Cursor (no GitHub push needed)

Use **HTTP** so the preview opens in Cursor’s panel with no certificate warning.

## 1. Start the dev server (HTTP)

- **Ctrl+Shift+P** → **Run Task** → **Start dev server (HTTP – use in Cursor panel)**
- Leave the terminal running. Note the URL, e.g. `http://localhost:3000` or `http://localhost:3001` (if 3000 is busy).

## 2. Open the preview in the panel

- **Ctrl+Shift+P** → **Simple Browser: Show**
- Enter the URL from the terminal (e.g. `http://localhost:3000` or `http://localhost:3001`)
- The page should load in the panel with no certificate error.

Then edit your code, save, and refresh the Simple Browser tab to see changes. No need to push to GitHub.
