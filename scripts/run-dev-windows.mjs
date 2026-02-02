#!/usr/bin/env node
/**
 * Windows dev launcher: automatically creates a junction (symlink) to a path
 * without spaces so spawn EPERM is avoided. On Mac/Linux, runs tsx directly.
 */
import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const serverEntry = "server/_core/index.ts";

// On Mac/Linux: just run tsx directly
if (process.platform !== "win32") {
  const child = spawn("pnpm", ["exec", "tsx", "watch", serverEntry], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  // On Windows: use a junction to avoid path-with-spaces spawn EPERM
  const junctionPath = "C:\\ars-dev";

  // Check if path has spaces - if not, run directly
  if (!projectRoot.includes(" ")) {
    const child = spawn("pnpm", ["exec", "tsx", "watch", serverEntry], {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true,
    });
    child.on("exit", (code) => process.exit(code ?? 0));
  } else {
    // Create junction if it doesn't exist or points elsewhere
    let needsJunction = true;
    try {
      const stat = fs.lstatSync(junctionPath);
      if (stat.isSymbolicLink() || stat.isDirectory()) {
        const target = fs.realpathSync(junctionPath);
        if (target.toLowerCase() === projectRoot.toLowerCase()) {
          needsJunction = false;
        } else {
          // Junction exists but points elsewhere - remove it
          execSync(`rmdir "${junctionPath}"`, { stdio: "ignore" });
        }
      }
    } catch {
      // Junction doesn't exist
    }

    if (needsJunction) {
      try {
        console.log(`Creating junction: ${junctionPath} -> ${projectRoot}`);
        execSync(`mklink /J "${junctionPath}" "${projectRoot}"`, {
          stdio: "inherit",
          shell: true,
        });
      } catch (err) {
        console.error(
          `Failed to create junction. Run as Administrator once, or manually run:`
        );
        console.error(`  mklink /J "${junctionPath}" "${projectRoot}"`);
        process.exit(1);
      }
    }

    // Run from the junction path (no spaces)
    console.log(`Running dev server from ${junctionPath} (no spaces in path)`);
    const child = spawn("pnpm", ["exec", "tsx", "watch", serverEntry], {
      cwd: junctionPath,
      stdio: "inherit",
      shell: true,
    });
    child.on("exit", (code) => process.exit(code ?? 0));
  }
}
