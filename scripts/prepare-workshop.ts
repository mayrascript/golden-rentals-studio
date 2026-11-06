import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { modules } from '../workshop/curriculum.js';
import { starterSource, assertSteps, solutionBlocks } from '../workshop/source-generator.js';

// Herramienta de autoría. No sobrescribe ejercicios que alguien ya haya empezado a completar.
await mkdir('workshop/exercises', { recursive: true });
for (const module of modules) {
  const source = await readFile(`workshop/solution/${module.file}`, 'utf8'); assertSteps(module.file, source);
  const starter = starterSource(source); const path = `workshop/exercises/${module.file}`;
  try {
    const existing = await readFile(path, 'utf8');
    if (existing !== starter && !process.argv.includes('--replace-generated')) throw new Error(`Hay cambios en ${path}; no se sobrescribieron.`);
  } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  await writeFile(path, starter);
  const introduction = await readFile(`workshop/guide/${module.id}-intro.md`, 'utf8');
  let guide = `${introduction}\n\n## Bloques para completar\n\nAbre \`workshop/exercises/${module.file}\`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada \`pending('ID')\`, o reemplaza el tramo entre \`@todo:start\` y \`@todo:end\` por el bloque siguiente. Conserva los imports y las firmas.\n`;
  for (const block of solutionBlocks(source)) {
    const code = block.code.split('\n').map(line => line.slice(block.indent.length)).join('\n');
    guide += `\n### TODO ${block.id}\n\nPega dentro de la función correspondiente:\n\n\`\`\`ts\n${code}\n\`\`\`\n`;
  }
  guide += `\n## Comprobar\n\n\`\`\`sh\npnpm typecheck\npnpm workshop:check ${module.id}\n\`\`\`\n\nResultado esperado: ${module.expected}\n\nEsta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).\n\n[Volver al recorrido](README.md)\n`;
  await writeFile(`workshop/guide/${module.file.replace('.ts', '.md')}`, guide);
}
console.log('Se prepararon 6 módulos, 14 TODO comentados y sus bloques de guía desde la misma solución.');
