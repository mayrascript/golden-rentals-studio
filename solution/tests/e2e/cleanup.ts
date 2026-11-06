import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, sep } from 'node:path';
export default async function cleanup() {
  const folder = process.env.GOLDEN_E2E_DATA_DIR;
  if (folder && resolve(folder).startsWith(resolve(tmpdir()) + sep + 'golden-e2e-')) await rm(folder, { recursive: true, force: true });
}
