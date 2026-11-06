import { config } from 'dotenv';
import { GoogleGenAI } from '@google/genai';

config({ path: '.env', quiet: true });
const apiKey = process.env.GOOGLE_GENAI_API_KEY?.trim();
const models = [process.env.TEXT_MODEL, process.env.IMAGE_MODEL];
if (!apiKey || models.some(model => !model?.trim())) throw new Error('Falta la clave o uno de los modelos en .env.');
const client = new GoogleGenAI({ apiKey });
for (const model of models) {
  try {
    const result = await client.models.get({ model: model!, config: { httpOptions: { timeout: 20000, retryOptions: { attempts: 1 } } } });
    console.log(JSON.stringify({ model, accessible: true, name: result.name, actions: result.supportedActions, inputTokenLimit: result.inputTokenLimit, outputTokenLimit: result.outputTokenLimit }));
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'status' in error ? error.status : undefined;
    const detail = error instanceof Error ? error.message : '';
    const reason = /api.key.not.valid|api_key_invalid/i.test(detail) ? 'invalid-key' : /not found|not supported/i.test(detail) ? 'model-not-found-or-unsupported' : /permission|forbidden/i.test(detail) ? 'permission-denied' : /fetch failed|ENOTFOUND|EAI_AGAIN/i.test(detail) ? 'network-unavailable' : 'request-failed';
    console.log(JSON.stringify({ model, accessible: false, status, reason })); process.exitCode = 1;
  }
}
