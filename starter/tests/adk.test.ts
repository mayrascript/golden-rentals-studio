import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'dotenv';
import type { Content, GenerateContentConfig, Part } from '@google/genai';
import { CampaignStore, checksum } from '../packages/storage/index.js';
import { createAdkProvider } from '../packages/providers/adk.js';
import { CampaignService } from '../apps/server/src/workflow/service.js';
import { brandSchema } from '../packages/contracts/index.js';

let folder: string | undefined;
afterEach(async () => { vi.restoreAllMocks(); if (folder) await rm(folder, { recursive: true, force: true }); });

it('recorre ADK con respuestas HTTP locales: modelos elegidos, skill, herramientas e imágenes', async () => {
  const env = parse(await readFile('.env.example'));
  const brand = brandSchema.parse(JSON.parse(await readFile('examples/golden-rentals/brand.json', 'utf8')));
  const angles = ['welcome', 'details', 'plan'].map((angleId, i) => ({ angleId, title: `Historia ${i + 1}`, purpose: 'Presentar un hecho del ejemplo.' }));
  const pieces = angles.map((angle, i) => ({ pieceId: `piece-${i + 1}`, angleId: angle.angleId, hook: angle.title, body: brand.facts[i].statement, cta: 'Explora la propuesta.', hashtags: ['#Ejemplo'], factIds: [brand.facts[i].factId] }));
  // A real 1px PNG fixture tests decoding/storage. It is never a generated image.
  const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=';
  const jsonPart = (value: unknown): Part[] => [{ text: JSON.stringify(value) }];
  const call = (name: string, args: Record<string, unknown>, id: string): Part[] => [{ functionCall: { name, args, id }, thoughtSignature: 'dGVzdC1zaWduYXR1cmU=' }];
  let copyCalls = 0; let imageCalls = 0;
  type RequestBody = { contents: Content[]; generationConfig?: GenerateContentConfig; systemInstruction?: Content };
  const requests: { url: string; body: RequestBody }[] = [];
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    const body: RequestBody = JSON.parse(init?.body ? String(init.body) : await (input as Request).text());
    requests.push({ url, body });
    expect(body.generationConfig?.maxOutputTokens).toBe(4096);
    let parts: Part[];
    if (url.includes(`/models/${env.IMAGE_MODEL}:generateContent`)) {
      imageCalls++;
      expect(body.generationConfig?.imageConfig).toEqual({ aspectRatio: '1:1', imageSize: '1K' });
      const imagePrompt = body.contents.flatMap(content => content.parts ?? []).map(part => part.text ?? '').join('');
      expect(imagePrompt).toContain('imagen fotorrealista');
      expect(imagePrompt).toContain('tiene prioridad sobre el estilo del concepto guardado');
      expect(imagePrompt).toContain(brand.facts[0].statement);
      parts = [
        { thought: true, inlineData: { mimeType: 'image/png', data: 'bm90LWEtcmVhbC1pbWFnZQ==' } },
        { inlineData: { mimeType: 'image/png', data: png } },
      ];
    } else {
      expect(url).toContain(`/models/${env.TEXT_MODEL}:generateContent`);
      const config = body.generationConfig!;
      expect(config.thinkingConfig?.thinkingLevel).toBe('LOW');
      for (const field of ['temperature', 'topP', 'topK', 'candidateCount']) expect(config).not.toHaveProperty(field);
      const instruction = body.systemInstruction?.parts?.map(part => part.text).join('') ?? '';
      if (instruction.includes('Formula una estrategia')) parts = jsonPart({ summary: 'Tres historias para una marca ficticia.', angles });
      else if (instruction.includes('Carga la skill')) {
        copyCalls++;
        if (copyCalls === 1) parts = call('load_skill', { name: 'instagram-copy' }, 'skill-1');
        else if (copyCalls === 2) {
          const history = body.contents.flatMap(content => content.parts ?? []);
          expect(history.some(part => part.functionResponse?.id === 'skill-1' && part.functionResponse.name === 'load_skill')).toBe(true);
          expect(history.some(part => part.thoughtSignature === 'dGVzdC1zaWduYXR1cmU=')).toBe(true);
          expect(JSON.stringify(history)).toContain('instructions');
          parts = call('load_skill_resource', { skill_name: 'instagram-copy', path: 'references/estructuras.md' }, 'resource-1');
        } else {
          const result = body.contents.flatMap(content => content.parts ?? []).find(part => part.functionResponse?.id === 'resource-1')?.functionResponse;
          expect(result?.name).toBe('load_skill_resource');
          expect(result?.response).not.toHaveProperty('error');
          parts = jsonPart({ pieces });
        }
      } else if (instruction.includes('Crea escenas fotográficas')) {
        parts = pieces.flatMap(piece => call('generate_campaign_image', { pieceId: piece.pieceId, prompt: `Fotografía de interiores para ${piece.hook}, luz natural y texturas de lino.`, altText: 'Interior de un alojamiento ficticio generado por IA.' }, `image-${piece.pieceId}`));
      } else if (instruction.includes('Revisa coherencia')) parts = jsonPart({ review: { status: 'APPROVED', findings: [], visualInspection: 'HUMAN_REQUIRED' }, calendar: pieces.map((piece, i) => ({ pieceId: piece.pieceId, date: `2026-11-0${5 + i}`, localTime: '', topic: piece.hook })) });
      else throw new Error('Solicitud inesperada en la prueba local de ADK.');
    }
    return Response.json({ candidates: [{ content: { role: 'model', parts }, finishReason: 'STOP' }], usageMetadata: { totalTokenCount: 10 } });
  });
  folder = await mkdtemp(join(tmpdir(), 'golden-adk-offline-'));
  const store = new CampaignStore(folder);
  const service = new CampaignService(store, 'real', () => createAdkProvider(store, { apiKey: 'offline-test-no-credentials', textModel: env.TEXT_MODEL, imageModel: env.IMAGE_MODEL }));
  await service.init();
  const campaign = await service.create({ brand, startDate: '2026-11-05', timeZone: 'America/Bogota' }, 'offline-adk-flow');
  await service.start(campaign.id); await service.wait(campaign.id);
  expect(campaign.error).toBeUndefined();
  expect(campaign.state).toBe('NEEDS_REVIEW');
  expect(campaign.completedSteps).toHaveLength(4);
  expect(copyCalls).toBe(3); expect(imageCalls).toBe(3);
  expect(campaign.usage.modelCalls).toBe(fetch.mock.calls.length);
  expect(campaign.usage.modelCalls).toBeLessThanOrEqual(12);
  expect(campaign.approval).toBeUndefined();
  for (const piece of campaign.pieces) {
    expect(piece.image?.modelId).toBe('gemini-3.1-flash-image');
    expect(piece.image?.checksum).toBe(checksum(Buffer.from(png, 'base64')));
    expect(piece.image?.promptVersion).toBe('2-photoreal');
    expect(piece.image?.disclosure).toContain('No es una fotografía de una propiedad real');
    expect(await store.readAsset(campaign.id, piece.image!.relativePath)).toEqual(Buffer.from(png, 'base64'));
  }
  // Existing campaigns also receive the new photographic direction when regenerated.
  campaign.pieces[0].visualBrief = 'Ilustración conceptual de un dormitorio en formas geométricas planas.';
  campaign.pieces[0].altText = 'Ilustración conceptual antigua.';
  campaign.pieces[0].image!.promptVersion = '1';
  await store.save(campaign);
  const regenerated = await service.regenerate(campaign.id, 'piece-1');
  expect(regenerated.pieces[0].image?.promptVersion).toBe('2-photoreal');
  expect(regenerated.pieces[0].altText).toContain('Imagen fotorrealista generada por IA');
  expect(regenerated.pieces[0].history.at(-1)?.altText).toBe('Ilustración conceptual antigua.');
  expect(imageCalls).toBe(4);
  expect(new Set(requests.map(request => new URL(request.url).hostname))).toEqual(new Set(['generativelanguage.googleapis.com']));
});
