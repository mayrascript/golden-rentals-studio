import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { InMemoryRunner, type LlmAgent } from '@google/adk';
import { GoogleGenAI } from '@google/genai';
import { CampaignService } from '../apps/server/src/workflow/service.js';
import { SimulatedProvider } from '../packages/providers/simulated.js';
import { CampaignStore } from '../packages/storage/index.js';
import { strategySchema, copiesSchema, type Campaign } from '../packages/contracts/index.js';
import { imageDimensions } from '../packages/providers/adk.js';
import { photographicPrompt } from '../packages/providers/image-prompt.js';
import { createSettings, type TeamOptions } from './support.js';
import { FIXTURE_PNG, offlineTransport } from './offline.js';
import { budgetTransport } from './budget.js';
import * as student2 from './exercises/02-strategist.js';
import * as student3 from './exercises/03-tools.js';
import * as student4 from './exercises/04-skills.js';
import * as student5 from './exercises/05-images.js';
import * as student6 from './exercises/06-editor.js';
import * as student7 from './exercises/07-workflow.js';
import * as solution2 from './solution/02-strategist.js';
import * as solution3 from './solution/03-tools.js';
import * as solution4 from './solution/04-skills.js';
import * as solution5 from './solution/05-images.js';
import * as solution6 from './solution/06-editor.js';
import * as solution7 from './solution/07-workflow.js';

export type Trace = { kind: 'tool_call' | 'tool_result'; name: string; args?: unknown; result?: unknown };
export type LabOptions = { solution?: boolean; real?: { apiKey: string; textModel: string; imageModel: string; budget: number }; onTrace?: (event: Trace) => void };
const task: Record<string, string> = {
  '2': 'Devuelve JSON {summary:string,angles:[{angleId,title,purpose}]} con exactamente tres ángulos.',
  '3': 'Usa generate_campaign_image solo para piece-1. Devuelve {status:"done"}.',
  '4': 'Carga la skill y references/estructuras.md. Devuelve JSON {pieces:[{pieceId,angleId,hook,body,cta,hashtags,factIds}]} con tres publicaciones.',
  '5': 'Usa generate_campaign_image solo para piece-1. Devuelve {status:"done"}.',
  '6': 'Devuelve JSON {review:{status:"APPROVED"|"NEEDS_REVISION",findings:[{pieceId,severity,category,description}],visualInspection:"HUMAN_REQUIRED"},calendar:[{pieceId,date,localTime:"",topic}]}. Tres fechas del 2026-11-05 al 2026-11-11.',
};

export async function checkModule(id: string, options: LabOptions = {}) {
  if (!['2', '3', '4', '5', '6', '7'].includes(id)) throw new Error('Módulo desconocido. Usa 2, 3, 4, 5, 6 o 7.');
  if (options.real && !['2', '4', '5', '6'].includes(id)) throw new Error('Los módulos 3 y 7 se comprueban sin red. Prueba Gemini con 2, 4, 5 o 6.');
  const m2 = options.solution ? solution2 : student2; const m3 = options.solution ? solution3 : student3;
  const m4 = options.solution ? solution4 : student4; const m5 = options.solution ? solution5 : student5;
  const m6 = options.solution ? solution6 : student6; const m7 = options.solution ? solution7 : student7;
  const folder = await mkdtemp(join(tmpdir(), 'golden-workshop-')); const originalFetch = globalThis.fetch;
  const trace: Trace[] = []; let modelCalls = 0; let images = 0; let tokens = 0; let imagePath: string | undefined;
  const emit = (event: Trace) => { trace.push(event); options.onTrace?.(event); };
  try {
    // Semilla sintética: permite probar cada agente sin haber pagado por ejecutar los anteriores.
    const store = new CampaignStore(folder); const service = new CampaignService(store, 'simulated', async () => new SimulatedProvider(store, 0));
    await service.init();
    const brand = JSON.parse(await readFile('examples/golden-rentals/brand.json', 'utf8'));
    const campaign = await service.create({ brand, startDate: '2026-11-05', timeZone: 'America/Bogota' }, 'workshop-fixture');
    await service.start(campaign.id); await service.wait(campaign.id);
    const client = new GoogleGenAI({ apiKey: options.real?.apiKey ?? 'offline-workshop-no-credentials' });
    const countCall = () => { if (++modelCalls > 6) throw new Error('Límite del laboratorio: seis llamadas por ejecución.'); };
    const context = { campaign, check: () => {}, countCall, addTokens: (value: number) => { tokens += value; } };
    const teamOptions: TeamOptions = {
      apiKey: options.real?.apiKey ?? 'offline-workshop-no-credentials', textModel: options.real?.textModel ?? 'gemini-3.8-flash', context: () => context,
      generateImage: async input => {
        assert.equal(input.pieceId, 'piece-1', 'El laboratorio de herramientas genera solo la primera pieza.');
        if (id === '3') return { status: 'saved', imageId: 'fixture-piece-1', simulated: true };
        if (imagePath) return { status: 'saved', imageId: 'piece-1-lab', path: imagePath };
        assert.equal(images, 0, 'El laboratorio admite una sola imagen.'); images++; countCall();
        const response = await m5.requestImage(client, options.real?.imageModel ?? 'gemini-3.1-flash-image', photographicPrompt(input.prompt, campaign.brief.brand.facts.map(f => f.statement)));
        tokens += response.usageMetadata?.totalTokenCount ?? 0;
        const { bytes, mimeType } = m5.extractImage(response);
        const dimensions = imageDimensions(bytes, mimeType);
        assert.ok(dimensions.width && dimensions.height && bytes.length <= 20_000_000, 'La imagen debe ser válida y tener menos de 20 MB.');
        if (!options.real) assert.deepEqual(bytes, Buffer.from(FIXTURE_PNG, 'base64'), 'Se debe extraer la imagen final, no una parte interna.');
        const relativePath = `images/lab.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
        await m5.saveImage(store, campaign.id, relativePath, bytes);
        assert.deepEqual(await store.readAsset(campaign.id, relativePath), bytes);
        imagePath = join(folder, campaign.id, relativePath);
        return { status: 'saved', imageId: 'piece-1-lab', path: imagePath };
      },
    };
    globalThis.fetch = options.real ? await budgetTransport(originalFetch, resolve('.workshop-data'), options.real.budget) : offlineTransport(campaign, id);
    const settings = createSettings(teamOptions);
    if (id === '7') {
      const team = await m7.createWorkshopTeam(teamOptions);
      assert.deepEqual(Object.keys(team), ['strategist', 'copywriter', 'designer', 'editor']);
      campaign.pieces[0].humanApproval = { version: 1, approvedAt: '2026-11-05' };
      const input = JSON.parse(m7.buildAgentInput(campaign, 'Probar contexto'));
      assert.equal(input.task, 'Probar contexto'); assert.deepEqual(input.data.strategy, campaign.strategy);
      assert.deepEqual(input.data.brief, campaign.brief); assert.equal(input.data.pieces.length, 3);
      assert.ok(!('history' in input.data.pieces[0])); assert.ok(!('humanApproval' in input.data.pieces[0]));
      return { id, trace, modelCalls, images, tokens, result: { agents: Object.keys(team), context: 'brief + estrategia + piezas actuales' } };
    }
    let agent: LlmAgent;
    if (id === '2') agent = m2.createStrategist(settings);
    else if (id === '4') agent = await m4.createCopywriter(settings, resolve('skills/instagram-copy'), context.check);
    else if (id === '6') agent = m6.createEditor(settings);
    else {
      assert.equal(m3.imageParameters.safeParse({ pieceId: 'piece-4', prompt: '', altText: '' }).success, false);
      agent = m3.createDesigner(settings, m3.createImageTool(teamOptions.generateImage));
    }
    const data: Pick<Campaign, 'brief' | 'strategy' | 'pieces'> = { brief: campaign.brief, strategy: campaign.strategy, pieces: campaign.pieces };
    if (id === '3' || id === '5') data.pieces = campaign.pieces.slice(0, 1).map(piece => ({ ...piece, image: undefined }));
    const runner = new InMemoryRunner({ agent, appName: 'golden_workshop' });
    const session = await runner.sessionService.createSession({ appName: runner.appName, userId: 'workshop-participant' });
    let text = '';
    try {
      for await (const event of runner.runAsync({ userId: 'workshop-participant', sessionId: session.id, newMessage: { role: 'user', parts: [{ text: JSON.stringify({ task: task[id], data }) }] }, runConfig: { maxLlmCalls: 4 }, abortSignal: AbortSignal.timeout(180000) })) {
        if (event.errorCode) throw new Error('El agente no pudo completar esta ejecución.');
        for (const part of event.content?.parts ?? []) {
          if (part.thought) continue;
          if (part.functionCall) emit({ kind: 'tool_call', name: part.functionCall.name ?? '', args: part.functionCall.args });
          if (part.functionResponse) {
            if (part.functionResponse.response?.error) throw new Error(`La herramienta ${part.functionResponse.name} devolvió un error.`);
            emit({ kind: 'tool_result', name: part.functionResponse.name ?? '', result: part.functionResponse.response });
          }
          if (part.text) text = part.text;
        }
      }
    } finally { await runner.sessionService.deleteSession({ appName: runner.appName, userId: 'workshop-participant', sessionId: session.id }); }
    let result: unknown;
    const json = () => JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
    if (id === '2') result = strategySchema.parse(json());
    else if (id === '4') {
      for (const name of ['load_skill', 'load_skill_resource']) assert.ok(trace.some(event => event.kind === 'tool_call' && event.name === name), `No se observó ${name}. Revisa tools y las instrucciones.`);
      result = copiesSchema.parse(json());
    } else if (id === '6') {
      result = m6.parseReview(text);
      assert.throws(() => m6.parseReview('{"review":{"status":"APPROVED"},"calendar":[]}'), 'La validación debe rechazar una respuesta incompleta.');
    } else {
      assert.ok(trace.some(event => event.kind === 'tool_call' && event.name === 'generate_campaign_image'), 'No se observó la llamada a la herramienta.');
      assert.ok(trace.some(event => event.kind === 'tool_result' && event.name === 'generate_campaign_image'), 'La herramienta debe devolver un resultado a ADK.');
      if (id === '5') { assert.equal(images, 1); assert.ok(imagePath); }
      result = { image: id === '3' ? 'Resultado técnico de prueba, sin archivo de imagen.' : options.real ? imagePath : 'PNG de prueba de 1 píxel verificado y eliminado al terminar.' };
    }
    return { id, trace, modelCalls, images, tokens, result };
  } finally {
    globalThis.fetch = originalFetch;
    // Se conservan únicamente los artefactos de una ejecución real solicitada por el participante.
    if (!options.real) await rm(folder, { recursive: true, force: true });
  }
}
