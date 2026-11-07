import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function collectProjectFiles() {
  const files: Record<string, Uint8Array> = {};
  async function collect(path: string) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.isSymbolicLink() || ['node_modules', 'dist', 'release', 'test-results', 'playwright-report'].includes(entry.name)) continue;
      const child = join(path, entry.name);
      if (entry.isDirectory()) await collect(child);
      else files[child] = await readFile(child);
    }
  }
  for (const folder of ['apps', 'packages', 'examples', 'skills', 'scripts', 'tests', 'workshop']) await collect(folder);
  for (const file of ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.env.example', '.npmrc', '.gitignore', 'tsconfig.json', 'tsconfig.server.json', 'angular.json', 'vitest.config.ts', 'playwright.config.ts', 'eslint.config.js', 'README.md', 'LICENSE', 'NOTICE']) files[file] = await readFile(file);
  return files;
}
