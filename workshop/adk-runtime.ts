import { Gemini, type LlmAgent } from '@google/adk';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { CampaignStore } from '../packages/storage/index.js';
import { imageDimensions } from '../packages/providers/adk.js';
import { createStrategist } from './exercises/02-strategist.js';
import { createDesigner, createImageTool } from './exercises/03-tools.js';
import { createCopywriter } from './exercises/04-skills.js';
import { requestImage, extractImage, saveImage } from './exercises/05-images.js';
import { createEditor } from './exercises/06-editor.js';
import type { AgentSettings } from './support.js';

// ADK Web carga únicamente el agente elegido. No reemplazamos TODO pendientes.
export async function createWebAgent(role: 'strategist' | 'copywriter' | 'designer' | 'editor'): Promise<LlmAgent> {
  const settings: AgentSettings = {
    model: new Gemini({ model: process.env.TEXT_MODEL ?? 'gemini-3.8-flash', apiKey: process.env.GOOGLE_GENAI_API_KEY ?? 'not-configured' }),
    generateContentConfig: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }, maxOutputTokens: 4096, automaticContinuation: false, httpOptions: { timeout: 60000, retryOptions: { attempts: 1 } } },
    beforeModelCallback: async () => {
      if (process.env.WORKSHOP_ADK_AUTHORIZED !== 'yes') throw new Error('Inicia ADK Web con pnpm workshop:web --allow-paid-generation --budget-usd=IMPORTE.');
      return undefined;
    },
    afterModelCallback: () => undefined,
  };
  if (role === 'strategist') return createStrategist(settings);
  if (role === 'copywriter') return createCopywriter(settings, resolve('skills/instagram-copy'), () => {});
  if (role === 'editor') return createEditor(settings);
  const store = new CampaignStore(resolve('.workshop-data/adk-web/images'));
  const artifacts = new Map<string, { bytes: Buffer; mimeType: string }>();
  const tool = createImageTool(async input => {
    if (process.env.WORKSHOP_ADK_AUTHORIZED !== 'yes') throw new Error('Usa el comando autorizado del laboratorio.');
    const client = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
    const response = await requestImage(client, process.env.IMAGE_MODEL ?? 'gemini-3.1-flash-image', input.prompt);
    const image = extractImage(response);
    const dimensions = imageDimensions(image.bytes, image.mimeType);
    if (!dimensions.width || !dimensions.height || image.bytes.length > 20_000_000) throw new Error('El archivo recibido no es una imagen válida de menos de 20 MB.');
    const imageId = randomUUID();
    const path = `images/${input.pieceId}.${image.mimeType === 'image/png' ? 'png' : 'jpg'}`;
    await saveImage(store, imageId, path, image.bytes);
    artifacts.set(imageId, image);
    return { status: 'saved', imageId, path: resolve(store.directory(imageId), path), altText: input.altText };
  });
  const agent = createDesigner(settings, tool);
  agent.afterToolCallback = async ({ context, response }) => {
    const id = String(response.imageId ?? ''); const image = artifacts.get(id);
    if (image) {
      artifacts.delete(id);
      await context.saveArtifact(`${id}.${image.mimeType === 'image/png' ? 'png' : 'jpg'}`, { inlineData: { data: image.bytes.toString('base64'), mimeType: image.mimeType } });
    }
    return undefined;
  };
  return agent;
}
