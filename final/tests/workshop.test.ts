import { afterEach, expect, it, vi } from 'vitest';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import type { GenerateContentResponse } from '@google/genai';
import { modules } from '../workshop/curriculum.js';
import { checkModule } from '../workshop/lab.js';
import { budgetTransport } from '../workshop/budget.js';
import { assertSteps, solutionBlocks, starterSource, adaptProvider } from '../workshop/source-generator.js';
import { extractImage } from '../workshop/solution/05-images.js';

const folders: string[] = [];
afterEach(async () => { vi.restoreAllMocks(); for (const folder of folders.splice(0)) await rm(folder, { recursive: true, force: true }); });

it.each(modules)('el módulo $id ejecuta ADK y los bloques resueltos sin salir a la red', async module => {
  const external = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No se permite red en esta prueba.'));
  const result = await checkModule(module.id, { solution: true });
  expect(external).not.toHaveBeenCalled();
  if (module.id === '4') {
    expect(result.trace.filter(event => event.kind === 'tool_call').map(event => event.name)).toEqual(['load_skill', 'load_skill_resource']);
    expect(JSON.stringify(result.trace)).toContain('Tres estructuras para practicar');
  }
  if (module.id === '5') { expect(result.images).toBe(1); expect(result.modelCalls).toBe(3); }
  if (module.id === '7') expect(result.modelCalls).toBe(0);
});

it('el starter incompleto explica el TODO pendiente y no sustituye la solución', async () => {
  const external = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('No se permite red.'));
  await expect(checkModule('2')).rejects.toThrow('Completa el TODO 2.2');
  expect(external).not.toHaveBeenCalled();
});

it('los 14 bloques comentados y sus fragmentos de guía coinciden con la solución', async () => {
  let count = 0;
  for (const module of modules) {
    const solution = await readFile(`workshop/solution/${module.file}`, 'utf8'); assertSteps(module.file, solution);
    expect(await readFile(`workshop/exercises/${module.file}`, 'utf8')).toBe(starterSource(solution));
    const guide = await readFile(`workshop/guide/${module.file.replace('.ts', '.md')}`, 'utf8');
    for (const block of solutionBlocks(solution)) {
      const code = block.code.split('\n').map(line => line.slice(block.indent.length)).join('\n');
      expect(guide).toContain(`### TODO ${block.id}`); expect(guide).toContain(code); count++;
    }
  }
  expect(count).toBe(14);
  for (const file of await readdir('workshop/guide')) {
    const path = resolve('workshop/guide', file); const text = await readFile(path, 'utf8');
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(match[1])) continue;
      await expect(readFile(resolve(dirname(path), match[1].split('#')[0]))).resolves.toBeDefined();
    }
  }
});

it('la adaptación de la web usa los ejercicios y detecta cambios de estructura', async () => {
  const source = await readFile('packages/providers/adk.ts', 'utf8'); const adapted = adaptProvider(source);
  expect(adapted).toContain('await requestImage(client, config.imageModel');
  expect(adapted).toContain('await saveImage(store,');
  expect(adapted).toContain('parseReview(await run(');
  expect(adapted).toContain('buildAgentInput(ctx.campaign, task)');
  expect(() => adaptProvider(source.replace('const result = await client.models.generateContent(', 'const response = await client.models.generateContent('))).toThrow('No se encontró la llamada');
});

it('no acepta texto ni imágenes internas como imagen final', () => {
  expect(() => extractImage({ candidates: [{ content: { parts: [{ text: 'Aquí estaría la imagen.' }] } }] } as GenerateContentResponse)).toThrow('no entregó');
  expect(() => extractImage({ candidates: [{ content: { parts: [{ thought: true, inlineData: { mimeType: 'image/png', data: 'dGVzdA==' } }] } }] } as GenerateContentResponse)).toThrow('no entregó');
});

it('reserva presupuesto antes de enviar y conserva la reserva de una respuesta fallida', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'golden-budget-test-')); folders.push(folder);
  const send = vi.fn<typeof fetch>().mockResolvedValue(new Response('No disponible', { status: 503 }));
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent';
  const init = { method: 'POST', body: JSON.stringify({ contents: [], generationConfig: { maxOutputTokens: 4096 } }) };
  const tooSmall = await budgetTransport(send, folder, 0.01);
  await expect(tooSmall(url, init)).rejects.toThrow('excedería'); expect(send).not.toHaveBeenCalled();
  const enoughForOne = await budgetTransport(send, folder, 0.3);
  expect((await enoughForOne(url, init)).status).toBe(503); expect(send).toHaveBeenCalledTimes(1);
  const resumed = await budgetTransport(send, folder, 0.3);
  await expect(resumed(url, init)).rejects.toThrow('excedería'); expect(send).toHaveBeenCalledTimes(1);
  const ledger = JSON.parse(await readFile(join(folder, 'lab-budget.json'), 'utf8'));
  expect(ledger.calls).toHaveLength(1); expect(ledger.reservedUsd).toBeGreaterThan(0.24);
});

it('rechaza destinos y registros de presupuesto inválidos sin enviar solicitudes', async () => {
  const folder = await mkdtemp(join(tmpdir(), 'golden-budget-test-')); folders.push(folder);
  const send = vi.fn<typeof fetch>(); const guarded = await budgetTransport(send, folder, 1);
  await expect(guarded('https://example.org/generate', {})).rejects.toThrow('solo admite');
  await writeFile(join(folder, 'lab-budget.json'), JSON.stringify({ reservedUsd: 'desconocido', calls: [] }));
  await expect(budgetTransport(send, folder, 1)).rejects.toThrow('no es válido'); expect(send).not.toHaveBeenCalled();
});
