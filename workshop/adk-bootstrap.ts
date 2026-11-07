import { resolve } from 'node:path';
import { budgetTransport } from './budget.js';
if (process.env.WORKSHOP_ADK_AUTHORIZED !== 'yes') throw new Error('Usa pnpm workshop:web para iniciar el laboratorio.');
const original = globalThis.fetch;
const limited = await budgetTransport(original, resolve('.workshop-data/adk-web'), Number(process.env.WORKSHOP_ADK_BUDGET));
// Un solo contador compartido por todos los especialistas de este servidor.
let calls = 0;
globalThis.fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input));
  if (url.hostname !== 'generativelanguage.googleapis.com') return original(input, init);
  if (++calls > 24) throw new Error('Límite de ADK Web: 24 llamadas por apertura. Revisa tu presupuesto antes de continuar.');
  return limited(input, init);
};
