import assert from 'node:assert/strict';
import type { Content, GenerateContentConfig, Part } from '@google/genai';
import type { Campaign } from '../packages/contracts/index.js';

// PNG de 1 píxel para comprobar decodificación y archivos; nunca se presenta como generación real.
export const FIXTURE_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=';
export function offlineTransport(campaign: Campaign, module: string): typeof fetch {
  const call = (name: string, args: Record<string, unknown>, id: string): Part[] => [{ functionCall: { name, args, id }, thoughtSignature: 'dGVzdC1zaWduYXR1cmU=' }];
  return async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert.equal(url.hostname, 'generativelanguage.googleapis.com', 'La comprobación offline no permite solicitudes externas.');
    const body: { contents: Content[]; generationConfig?: GenerateContentConfig; systemInstruction?: Content } = JSON.parse(init?.body ? String(init.body) : await (input as Request).text());
    assert.equal(body.generationConfig?.maxOutputTokens, 4096);
    let parts: Part[];
    if (url.pathname.includes('flash-image:generateContent')) {
      assert.deepEqual(body.generationConfig?.imageConfig, { aspectRatio: '1:1', imageSize: '1K' });
      parts = [{ thought: true, inlineData: { mimeType: 'image/png', data: 'aW50ZXJuYWw=' } }, { inlineData: { mimeType: 'image/png', data: FIXTURE_PNG } }];
    } else {
      const results = body.contents.flatMap(content => content.parts ?? []).flatMap(part => part.functionResponse ? [part.functionResponse] : []);
      for (const result of results) assert.ok(!result.response?.error, `La herramienta ${result.name} devolvió un error.`);
      if (module === '2') parts = [{ text: JSON.stringify(campaign.strategy) }];
      else if (module === '4') {
        if (!results.some(result => result.name === 'load_skill')) parts = call('load_skill', { name: 'instagram-copy' }, 'skill-1');
        else if (!results.some(result => result.name === 'load_skill_resource')) parts = call('load_skill_resource', { skill_name: 'instagram-copy', path: 'references/estructuras.md' }, 'resource-1');
        else parts = [{ text: JSON.stringify({ pieces: campaign.pieces.map(({ pieceId, angleId, hook, body, cta, hashtags, factIds }) => ({ pieceId, angleId, hook, body, cta, hashtags, factIds })) }) }];
      } else if (module === '3' || module === '5') {
        if (!results.some(result => result.name === 'generate_campaign_image')) parts = call('generate_campaign_image', { pieceId: 'piece-1', prompt: 'Fotografía de un dormitorio ficticio con escritorio, luz natural y texturas de lino.', altText: 'Dormitorio con escritorio generado por IA para un alojamiento ficticio.' }, 'image-1');
        else parts = [{ text: JSON.stringify({ status: 'done' }) }];
      } else if (module === '6') parts = [{ text: JSON.stringify({ review: campaign.review, calendar: campaign.calendar }) }];
      else throw new Error('No se reconoció la instrucción del agente. Compara tu bloque con la guía antes de personalizarlo.');
    }
    return Response.json({ candidates: [{ content: { role: 'model', parts }, finishReason: 'STOP' }], usageMetadata: { totalTokenCount: 10 } });
  };
}
