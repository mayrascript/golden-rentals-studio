import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import type { Campaign } from '../contracts/index.js';

export function safePath(root: string, relative: string): string {
  const base = resolve(root); const result = resolve(base, relative);
  if (!result.startsWith(base + sep) || relative.includes('\0')) throw new Error('Ruta de archivo no permitida.');
  return result;
}
export function checksum(bytes: string | Uint8Array) { return createHash('sha256').update(bytes).digest('hex'); }
export class CampaignStore {
  private writes = new Map<string, Promise<void>>();
  constructor(readonly root: string) {}
  directory(id: string) { if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Identificador inválido.'); return safePath(this.root, id); }
  async load(id: string): Promise<Campaign> { return JSON.parse(await readFile(join(this.directory(id), 'campaign.json'), 'utf8')); }
  async save(campaign: Campaign) {
    const folder = this.directory(campaign.id); const snapshot = JSON.stringify(campaign, null, 2);
    const operation = (this.writes.get(campaign.id) ?? Promise.resolve()).catch(() => {}).then(async () => {
      await mkdir(folder, { recursive: true }); const temp = join(folder, `${randomUUID()}.tmp`);
      await writeFile(temp, snapshot); await rename(temp, join(folder, 'campaign.json'));
    });
    this.writes.set(campaign.id, operation);
    try { await operation; } finally { if (this.writes.get(campaign.id) === operation) this.writes.delete(campaign.id); }
  }
  async list(): Promise<Campaign[]> {
    await mkdir(this.root, { recursive: true });
    const campaigns: Campaign[] = [];
    for (const entry of await readdir(this.root, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^[a-f0-9-]{36}$/.test(entry.name)) continue;
      try { campaigns.push(await this.load(entry.name)); } catch { /* A damaged record must not hide the remaining campaigns. */ }
    }
    return campaigns.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async writeAsset(id: string, relative: string, bytes: Uint8Array) {
    const folder = this.directory(id); await mkdir(join(folder, 'images'), { recursive: true });
    await writeFile(safePath(folder, relative), bytes);
  }
  async readAsset(id: string, relative: string) { return readFile(safePath(this.directory(id), relative)); }
}
