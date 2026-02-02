#!/usr/bin/env node
/**
 * Postinstall: fix Vite Windows spawn error in optimizeSafeRealPathSync.
 * Wraps exec("net use", ...) in try/catch so spawn failures (e.g. paths with spaces)
 * fall back to fs.realpathSync.native. Only runs on Windows.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.platform !== "win32") {
  process.exit(0);
}

const chunksDir = path.join(
  __dirname,
  "..",
  "node_modules",
  "vite",
  "dist",
  "node",
  "chunks"
);

if (!fs.existsSync(chunksDir)) {
  process.exit(0);
}

const original = `\texec("net use", (error$1, stdout) => {
		if (error$1) return;
		const lines = stdout.split("\\n");
		for (const line of lines) {
			const m$2 = parseNetUseRE.exec(line);
			if (m$2) windowsNetworkMap.set(m$2[2], m$2[1]);
		}
		if (windowsNetworkMap.size === 0) safeRealpathSync = fs.realpathSync.native;
		else safeRealpathSync = windowsMappedRealpathSync;
	});`;

const patched = `\ttry {
		exec("net use", (error$1, stdout) => {
			if (error$1) return;
			const lines = stdout.split("\\n");
			for (const line of lines) {
				const m$2 = parseNetUseRE.exec(line);
				if (m$2) windowsNetworkMap.set(m$2[2], m$2[1]);
			}
			if (windowsNetworkMap.size === 0) safeRealpathSync = fs.realpathSync.native;
			else safeRealpathSync = windowsMappedRealpathSync;
		});
	} catch (e) {
		safeRealpathSync = fs.realpathSync.native;
	}`;

const files = fs.readdirSync(chunksDir);
for (const name of files) {
  if (!name.startsWith("dep-") || !name.endsWith(".js")) continue;
  const filePath = path.join(chunksDir, name);
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("optimizeSafeRealPathSync") && content.includes('exec("net use"')) {
    if (content.includes("} catch (e) {") && content.includes("safeRealpathSync = fs.realpathSync.native;")) {
      process.exit(0);
    }
    if (!content.includes(original)) {
      continue;
    }
    content = content.replace(original, patched);
    fs.writeFileSync(filePath, content);
    break;
  }
}

process.exit(0);
