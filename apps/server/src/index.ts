import { config } from 'dotenv';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import express from 'express';
import { brandSchema } from '../../../packages/contracts/index.js';
import { CampaignStore } from '../../../packages/storage/index.js';
import { SimulatedProvider } from '../../../packages/providers/simulated.js';
import { CampaignService } from './workflow/service.js';
import { createApi } from './api/app.js';

config({ path: resolve('.env'), quiet: true });
const mode = process.env.GENERATION_MODE ?? 'simulated';
if (mode !== 'simulated' && mode !== 'real') throw new Error('GENERATION_MODE debe ser simulated o real.');
const realConfig = { apiKey: process.env.GOOGLE_GENAI_API_KEY ?? '', textModel: process.env.TEXT_MODEL ?? '', imageModel: process.env.IMAGE_MODEL ?? '' };
const store = new CampaignStore(resolve(process.env.CAMPAIGN_DATA_DIR ?? '.data'));
const service = new CampaignService(store, mode, async () => mode === 'simulated' ? new SimulatedProvider(store) : (await import('../../../packages/providers/adk.js')).createAdkProvider(store, realConfig));
await service.init();
const demo = brandSchema.parse(JSON.parse(await readFile(resolve('examples/golden-rentals/brand.json'), 'utf8')));
const app = createApi(service, demo, Object.values(realConfig).every(Boolean));
if (process.argv.includes('--production')) {
  app.use(express.static(resolve('dist/web')));
  app.get('/{*path}', (_req, res) => res.sendFile(resolve('dist/web/index.html')));
}
const port = Number(process.env.PORT ?? 4317);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT debe estar entre 1024 y 65535.');
const server = app.listen(port, '127.0.0.1', () => { console.log(`Golden Rentals · ${mode === 'simulated' ? 'Demo simulada' : 'Modo real'} · http://127.0.0.1:${port}`); });
async function stop() { server.close(() => process.exit(0)); }
process.once('SIGINT', () => void stop()); process.once('SIGTERM', () => void stop());
