#!/usr/bin/env node
/**
 * Postinstall: fix Vite Windows spawn EPERM in optimizeSafeRealPathSync.
 * Skips exec("net use") entirely and uses fs.realpathSync.native (no spawn).
 * Only runs on Windows.
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

const replacement = "\tsafeRealpathSync = fs.realpathSync.native;";

const unpatched = `\texec("net use", (error$1, stdout) => {
		if (error$1) return;
		const lines = stdout.split("\\n");
		for (const line of lines) {
			const m$2 = parseNetUseRE.exec(line);
			if (m$2) windowsNetworkMap.set(m$2[2], m$2[1]);
		}
		if (windowsNetworkMap.size === 0) safeRealpathSync = fs.realpathSync.native;
		else safeRealpathSync = windowsMappedRealpathSync;
	});`;

const tryCatchPatched = `\ttry {
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
  if (!content.includes("optimizeSafeRealPathSync") || !content.includes('exec("net use"')) {
    continue;
  }
  if (content.includes(replacement) && !content.includes("exec(\"net use\", (error$1, stdout)")) {
    process.exit(0);
  }
  if (content.includes(unpatched)) {
    content = content.replace(unpatched, replacement);
    fs.writeFileSync(filePath, content);
    break;
  }
  if (content.includes(tryCatchPatched)) {
    content = content.replace(tryCatchPatched, replacement);
    fs.writeFileSync(filePath, content);
    break;
  }
}

process.exit(0);
