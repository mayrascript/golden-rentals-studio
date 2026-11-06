import { modules } from './curriculum.js';

export function solutionBlocks(source: string) {
  return [...source.matchAll(/^([ \t]*)\/\/ @solution:start ([\d.]+)\n([\s\S]*?)^\1\/\/ @solution:end \2/gm)].map(match => ({
    id: match[2], code: match[3].trimEnd(), indent: match[1], original: match[0],
  }));
}

// Un solo origen para el código de solución, los bloques pegables de la guía y el starter.
// Los comentarios explicativos permanecen activos; el código del ejercicio se entrega comentado.
export function starterSource(source: string): string {
  let result = source;
  for (const block of solutionBlocks(source)) {
    const commented = block.code.split('\n').map(line => `${block.indent}// ${line.slice(block.indent.length)}`).join('\n');
    result = result.replace(block.original, `${block.indent}// @todo:start ${block.id}\n${block.indent}// Descomenta el bloque siguiente y elimina pending('${block.id}').\n${commented}\n${block.indent}pending('${block.id}');\n${block.indent}// @todo:end ${block.id}`);
  }
  return `import { pending } from '../support.js';\n${result}`;
}

export function assertSteps(file: string, source: string) {
  const expected = modules.find(module => module.file === file)?.steps;
  if (!expected || JSON.stringify(solutionBlocks(source).map(block => block.id)) !== JSON.stringify(expected)) throw new Error(`Los bloques de ${file} no coinciden con el temario.`);
}

// Conecta los ejercicios con el proveedor de la web; los controles y la persistencia permanecen preparados.
export function adaptProvider(source: string): string {
  function replaceOnce(old: string, next: string) {
    if (source.split(old).length !== 2) throw new Error(`Adaptador desactualizado: ${old.slice(0, 65)}`);
    source = source.replace(old, next);
  }
  source = `import { requestImage, extractImage, saveImage } from '../../workshop/exercises/05-images.js';\nimport { parseReview } from '../../workshop/exercises/06-editor.js';\nimport { buildAgentInput } from '../../workshop/exercises/07-workflow.js';\n${source}`;
  const request = source.split('\n').find(line => line.includes('const result = await client.models.generateContent('));
  if (!request) throw new Error('No se encontró la llamada de imágenes.');
  replaceOnce(request, "      const result = await requestImage(client, config.imageModel, photographicPrompt(prompt, ctx.campaign.brief.brand.facts.map(f => f.statement)));");
  const first = source.indexOf('      const data = result.candidates');
  const last = source.indexOf('      if (!size.width', first);
  if (first < 0 || last < first) throw new Error('No se encontró la lectura de imagen.');
  source = source.slice(0, first) + '      const { bytes, mimeType } = extractImage(result); const size = imageDimensions(bytes, mimeType);\n' + source.slice(last);
  source = source.replaceAll('data.mimeType', 'mimeType');
  replaceOnce('await store.writeAsset(ctx.campaign.id, relativePath, bytes);', 'await saveImage(store, ctx.campaign.id, relativePath, bytes);');
  replaceOnce('JSON.stringify({ task, data: { brief: ctx.campaign.brief, strategy: ctx.campaign.strategy, pieces: ctx.campaign.pieces.map(({ history: _history, humanApproval: _approval, ...p }) => p) } })', 'buildAgentInput(ctx.campaign, task)');
  const review = source.split('\n').find(line => line.includes('async review(ctx)'));
  if (!review) throw new Error('No se encontró la revisión.');
  replaceOnce(review, review.replace('editorSchema.parse(json(await run(', 'parseReview(await run(').replace('`))); },', '`)); },'));
  source = source.replace('strategySchema, copiesSchema, editorSchema, copySchema', 'strategySchema, copiesSchema, copySchema');
  return source;
}
