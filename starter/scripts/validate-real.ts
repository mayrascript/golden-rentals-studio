import { config } from 'dotenv';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { CampaignStore, checksum } from '../packages/storage/index.js';
import { CampaignService } from '../apps/server/src/workflow/service.js';
import { createAdkProvider } from '../packages/providers/adk.js';
import { exportCampaign } from '../apps/server/src/api/export.js';

// Paid integration check: must be explicitly requested. Never run from pnpm test/build.
if (!process.argv.includes('--allow-paid-generation')) throw new Error('Esta prueba genera contenido facturable. Requiere --allow-paid-generation y un presupuesto autorizado.');
const budget = Number(process.argv.find(arg => arg.startsWith('--budget-usd='))?.split('=')[1]);
if (!Number.isFinite(budget) || budget <= 0) throw new Error('Indica --budget-usd con el presupuesto autorizado.');
config({ path: '.env', quiet: true });
const apiKey = process.env.GOOGLE_GENAI_API_KEY?.trim() ?? '';
const textModel = process.env.TEXT_MODEL ?? ''; const imageModel = process.env.IMAGE_MODEL ?? '';
if (!apiKey || textModel !== 'gemini-3.8-flash' || imageModel !== 'gemini-3.1-flash-image') throw new Error('Esta prueba requiere la clave y los dos modelos seleccionados.');
// Conservative standard prices include the post-introductory Flash text rates.
// https://ai.google.dev/gemini-api/docs/pricing — checked 2026-11-05.
const prices: Record<string, { input: number; output: number }> = { [textModel]: { input: 1.5, output: 7.5 }, [imageModel]: { input: 0.5, output: 60 } };
const folder = resolve(process.env.CAMPAIGN_DATA_DIR ?? '.data'); await mkdir(folder, { recursive: true });
const ledgerPath = join(folder, 'paid-test-ledger.json');
type Ledger = { reservedUsd: number; requests: { model: string; reservedUsd: number; at: string; status?: number; totalTokens?: number }[] };
let ledger: Ledger;
try { ledger = JSON.parse(await readFile(ledgerPath, 'utf8')); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; ledger = { reservedUsd: 0, requests: [] }; }
const originalFetch = globalThis.fetch;
let writeQueue = Promise.resolve();
function saveLedger() { const snapshot = JSON.stringify(ledger, null, 2); writeQueue = writeQueue.then(() => writeFile(ledgerPath, snapshot)); return writeQueue; }
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  const model = url.pathname.match(/\/models\/([^/:]+):generateContent$/)?.[1];
  if (url.hostname !== 'generativelanguage.googleapis.com' || !model || !prices[model]) throw new Error('La prueba solo admite generación con los dos modelos seleccionados.');
  const payload = init?.body ? String(init.body) : await (input as Request).clone().text();
  const request = JSON.parse(payload);
  const outputLimit = request.generationConfig?.maxOutputTokens;
  if (outputLimit !== 4096) throw new Error('La llamada necesita el límite de 4096 tokens de salida.');
  // UTF-8 bytes overestimate text tokens; reserve extra margin for service overhead.
  // All image output tokens use the higher image rate, even when they are text/thoughts.
  const reserve = ((Buffer.byteLength(payload) + 8192) * prices[model].input + outputLimit * prices[model].output) / 1_000_000;
  if (ledger.reservedUsd + reserve > budget) throw new Error('Se alcanzó el presupuesto conservador de esta prueba.');
  ledger.reservedUsd += reserve;
  const entry: Ledger['requests'][number] = { model, reservedUsd: reserve, at: new Date().toISOString() };
  ledger.requests.push(entry); await saveLedger();
  console.log(JSON.stringify({ request: ledger.requests.length, model, reservedTotalUsd: Number(ledger.reservedUsd.toFixed(4)), budgetUsd: budget }));
  const response = await originalFetch(input, init); entry.status = response.status;
  try { const body = await response.clone().json(); entry.totalTokens = body.usageMetadata?.totalTokenCount; } catch { /* An HTTP error may not contain JSON. Keep its full reservation. */ }
  await saveLedger(); return response;
};
try {
  const store = new CampaignStore(folder);
  const service = new CampaignService(store, 'real', async () => {
    const provider = await createAdkProvider(store, { apiKey, textModel, imageModel });
    for (const method of Object.keys(provider) as (keyof typeof provider)[]) {
      const action = provider[method];
      Object.assign(provider, { [method]: async (...args: never[]) => {
        try { return await (action as (...args: never[]) => Promise<unknown>)(...args); }
        catch (error) {
          const message = (error instanceof Error ? error.message : String(error)).split(apiKey).join('[redacted]').replace(/AIza[\w-]+/g, '[redacted]').slice(0, 1200);
          console.error(JSON.stringify({ failedStep: method, message })); throw error;
        }
      } });
    }
    return provider;
  });
  await service.init();
  const resume = process.argv.find(arg => arg.startsWith('--resume='))?.split('=')[1];
  const campaign = resume ? service.get(resume) : await service.create({ brand: JSON.parse(await readFile('examples/golden-rentals/brand.json', 'utf8')), startDate: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date()), timeZone: 'America/Bogota' }, `real-test-${randomUUID()}`);
  console.log(JSON.stringify({ campaignId: campaign.id, starting: true }));
  await service.start(campaign.id, `real-run-${randomUUID()}`); await service.wait(campaign.id);
  console.log(JSON.stringify({ campaignId: campaign.id, state: campaign.state, error: campaign.error, usage: campaign.usage, completedSteps: campaign.completedSteps, review: campaign.review, reservedTotalUsd: Number(ledger.reservedUsd.toFixed(4)) }));
  if (campaign.state !== 'NEEDS_REVIEW') process.exitCode = 1;
  else {
    for (const piece of campaign.pieces) {
      if (!piece.image) throw new Error('Falta una imagen.');
      const bytes = await store.readAsset(campaign.id, piece.image.relativePath);
      if (checksum(bytes) !== piece.image.checksum) throw new Error('El archivo no coincide con su checksum.');
      console.log(JSON.stringify({ pieceId: piece.pieceId, width: piece.image.width, height: piece.image.height, imagePath: join(folder, campaign.id, piece.image.relativePath) }));
    }
    const draft = await exportCampaign(campaign, store); await writeFile(join(folder, campaign.id, draft.filename), draft.bytes);
    console.log('Campaña real guardada y exportada como borrador. La aprobación humana sigue pendiente.');
  }
} finally { globalThis.fetch = originalFetch; await writeQueue; }
