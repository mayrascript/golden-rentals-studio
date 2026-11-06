import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Mismos valores conservadores del piloto, documentados el 5-11-2026.
// Es una reserva de la prueba, no la factura. Revisar tarifas antes de impartir el taller.
const prices: Record<string, { input: number; output: number }> = {
  'gemini-3.8-flash': { input: 1.5, output: 7.5 },
  'gemini-3.1-flash-image': { input: 0.5, output: 60 },
};
type Ledger = { reservedUsd: number; calls: { model: string; reserve: number; at: string }[] };

export async function budgetTransport(original: typeof fetch, folder: string, budget: number): Promise<typeof fetch> {
  if (!Number.isFinite(budget) || budget <= 0) throw new Error('Indica un presupuesto positivo con --budget-usd=IMPORTE.');
  await mkdir(folder, { recursive: true }); const path = join(folder, 'lab-budget.json');
  let ledger: Ledger;
  try { ledger = JSON.parse(await readFile(path, 'utf8')); } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    ledger = { reservedUsd: 0, calls: [] };
  }
  if (!Number.isFinite(ledger.reservedUsd) || ledger.reservedUsd < 0 || !Array.isArray(ledger.calls)) throw new Error('El registro de presupuesto no es válido; revísalo antes de continuar.');
  let writeQueue = Promise.resolve();
  return async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const model = url.pathname.match(/\/models\/([^/:]+):generateContent$/)?.[1];
    if (url.hostname !== 'generativelanguage.googleapis.com' || !model || !prices[model]) throw new Error('El laboratorio solo admite los modelos y el proveedor configurados en el taller.');
    const payload = init?.body ? String(init.body) : await (input as Request).clone().text();
    const request = JSON.parse(payload);
    if (request.generationConfig?.maxOutputTokens !== 4096) throw new Error('Conserva el límite de 4096 tokens por llamada.');
    const reserve = ((Buffer.byteLength(payload) + 8192) * prices[model].input + 4096 * prices[model].output) / 1_000_000;
    if (ledger.reservedUsd + reserve > budget) throw new Error('La siguiente llamada excedería el presupuesto reservado del laboratorio.');
    ledger.reservedUsd += reserve; ledger.calls.push({ model, reserve, at: new Date().toISOString() });
    const snapshot = JSON.stringify(ledger, null, 2);
    writeQueue = writeQueue.then(() => writeFile(path, snapshot));
    await writeQueue;
    return original(input, init);
  };
}
