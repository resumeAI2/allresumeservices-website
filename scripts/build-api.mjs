/**
 * Pre-bundle the Vercel serverless API function with esbuild.
 * 
 * Vercel's ncc bundler has issues resolving local imports in certain
 * configurations. By pre-bundling with esbuild, we produce a single
 * self-contained .js file that Vercel can serve directly as a
 * serverless function without needing ncc to bundle it further.
 */
import { build } from 'esbuild';
import { rmSync } from 'fs';

// Clean previous build
try { rmSync('api/index.js'); } catch {}

await build({
  entryPoints: ['server/api/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'api/index.js',
  // Keep node_modules as external (they're available at runtime in Vercel)
  packages: 'external',
  // Also keep dotenv external since it's side-effect-only
  external: ['dotenv', 'dotenv/config'],
  // Resolve TypeScript path aliases
  tsconfig: 'tsconfig.json',
});

console.log('✓ api/index.js built successfully');
