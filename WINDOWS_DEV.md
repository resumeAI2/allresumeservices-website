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
