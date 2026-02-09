/**
 * Pre-bundle the Vercel serverless API function with esbuild.
 * 
 * Vercel's ncc bundler does not properly inline local ESM imports when
 * the project uses "type": "module". By pre-bundling with esbuild, we
 * produce a single self-contained .mjs file that ncc can handle.
 */
import { build } from 'esbuild';
import { rmSync } from 'fs';

// Clean previous build
try { rmSync('api/index.mjs'); } catch {}

await build({
  entryPoints: ['api/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'api/index.mjs',
  // Keep node_modules as external (they're available at runtime in Vercel)
  packages: 'external',
  // Also keep dotenv external since it's side-effect-only
  external: ['dotenv', 'dotenv/config'],
  // Resolve TypeScript path aliases
  tsconfig: 'tsconfig.json',
  banner: {
    // Required for CJS modules used via require() in ESM context
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});

console.log('✓ api/index.mjs built successfully');
