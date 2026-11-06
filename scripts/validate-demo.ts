import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { unzipSync } from 'fflate';
import { CampaignStore } from '../packages/storage/index.js';
import { SimulatedProvider } from '../packages/providers/simulated.js';
import { CampaignService } from '../apps/server/src/workflow/service.js';
import { exportCampaign } from '../apps/server/src/api/export.js';
const folder = await mkdtemp(join(tmpdir(), 'golden-demo-'));
try {
  const store = new CampaignStore(folder); const service = new CampaignService(store, 'simulated', async () => new SimulatedProvider(store, 0)); await service.init();
  const c = await service.create({ brand: JSON.parse(await readFile('examples/golden-rentals/brand.json', 'utf8')), startDate: '2026-11-05', timeZone: 'America/Bogota' }, 'demo-validation');
  await service.start(c.id); await service.wait(c.id); assert.equal(c.state, 'NEEDS_REVIEW'); assert.equal(c.pieces.length, 3); assert.equal(c.calendar.length, 3);
  for (const p of c.pieces) { assert.ok(p.image); await service.approvePiece(c.id, p.pieceId, p.version); }
  await service.approve(c.id, c.packageHash, 'Prueba automatizada'); const zip = unzipSync((await exportCampaign(c, store)).bytes); assert.equal(Object.keys(zip).length, 7);
  console.log('Demo verificada: cuatro etapas, tres piezas, tres imágenes, calendario, aprobación y ZIP. Sin llamadas externas.');
} finally { await rm(folder, { recursive: true, force: true }); }
