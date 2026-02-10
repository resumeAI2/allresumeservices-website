# Windows Development

On Windows, if your project path contains spaces (e.g. `ARS WEBSITE CODE`), running `pnpm dev` would normally fail with **spawn EPERM**.

## Automatic Fix

The `pnpm dev` command now **automatically creates a junction** (Windows symlink) at `C:\ars-dev` pointing to your project folder. The dev server then runs from that junction path (no spaces), avoiding the spawn error.

**First run:** You may see "Creating junction: C:\ars-dev -> ..." - this is normal and only happens once.

**Subsequent runs:** The junction already exists, so `pnpm dev` starts immediately.

## Manual Cleanup

If you move/rename the project and want to remove the old junction:
```cmd
rmdir C:\ars-dev
```

## How It Works

1. Script detects Windows + path with spaces
2. Creates `C:\ars-dev` junction → your project folder (one-time)
3. Runs `tsx watch server/_core/index.ts` with cwd = `C:\ars-dev`
4. All child process spawns see paths without spaces → no EPERM

The Vite postinstall patch also fixes the browser-side Vite spawn error.

---

## Cursor in-editor preview (avoid HTTP 426)

Cursor’s Simple Browser often shows **HTTP 426** for plain **http://localhost**. To use the preview inside Cursor:

**If you see ERR_EMPTY_RESPONSE:** you may be using `http://` while the server is running with HTTPS. Use **https://localhost:3000/** (or the port shown in the terminal) when you started the server with `pnpm run dev:https`.

1. **Start the dev server with HTTPS:**  
   `pnpm run dev:https`  
   (Uses a self-signed certificate; the server will log something like `Server running on https://localhost:3000/`.)

2. **Open the preview in Cursor:**  
   Simple Browser / Preview → enter **https://localhost:3000/** (or **https://localhost:3001/** if that’s the port shown).

3. **Accept the certificate** when the browser warns about the self-signed cert (e.g. “Advanced” → “Proceed to localhost”). After that, the preview should load.

**If you prefer not to use HTTPS:** run `pnpm dev` and use **Terminal → Run Task → Preview Home Page** (or **Preview Home Page (port 3001)**) to open the site in your system browser instead.
