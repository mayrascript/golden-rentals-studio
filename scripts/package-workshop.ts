import { mkdir, writeFile } from 'node:fs/promises';
import { zipSync, strToU8, strFromU8 } from 'fflate';
import { collectProjectFiles } from './package-files.js';
import { modules } from '../workshop/curriculum.js';
import { assertSteps, starterSource, adaptProvider } from '../workshop/source-generator.js';

const original = await collectProjectFiles();
await mkdir('release', { recursive: true });
for (const edition of ['participant', 'solution'] as const) {
  const files = { ...original }; const port = edition === 'participant' ? 4319 : 4320;
  for (const module of modules) {
    const source = strFromU8(files[`workshop/solution/${module.file}`]); assertSteps(module.file, source);
    files[`workshop/exercises/${module.file}`] = strToU8(edition === 'participant' ? starterSource(source) : source);
  }
  files['apps/server/src/agents/team.ts'] = files['workshop/templates/team.ts.txt'];
  files['packages/providers/adk.ts'] = strToU8(adaptProvider(strFromU8(files['packages/providers/adk.ts'])));
  files['apps/server/src/index.ts'] = strToU8(strFromU8(files['apps/server/src/index.ts']).replace('process.env.PORT ?? 4317', `process.env.PORT ?? ${port}`));
  files['.env.example'] = strToU8(strFromU8(files['workshop/templates/participant-env.txt']).replace('PORT=4319', `PORT=${port}`));
  // Las pruebas de autoría verifican archivos originales; cada edición conserva las pruebas del producto.
  delete files['tests/workshop.test.ts'];
  const manifest = JSON.parse(strFromU8(files['package.json']));
  delete manifest.scripts['workshop:prepare']; delete manifest.scripts['package:workshop'];
  files['package.json'] = strToU8(JSON.stringify(manifest, null, 2) + '\n');
  files['README.md'] = strToU8(`# Golden Rentals · ${edition === 'participant' ? 'Edición del participante' : 'Solución comentada'}\n\n${edition === 'participant' ? 'Completa los 14 TODO de código en workshop/exercises siguiendo la guía. Cada paso explica qué hace, qué recibe y qué devuelve.' : 'Los 14 pasos están completos y conservan sus comentarios explicativos. La web usa estas mismas funciones.'}\n\nEmpieza por [la guía paso a paso](workshop/guide/README.md). Requisitos: Node.js 24.13 o posterior y pnpm 11.25.0.\n\n\`\`\`sh\npnpm install --frozen-lockfile\npnpm workshop:check setup\npnpm dev\n\`\`\`\n\nAbre http://127.0.0.1:${port}. La demo inicia en modo simulado, sin claves. Sigue [la preparación](workshop/guide/01-preparacion.md) para configurar tu .env.\n\nLos agentes se prueban por separado con \`pnpm workshop:check 2\` hasta \`7\`. Estos comandos usan respuestas HTTP locales preparadas. El [laboratorio](workshop/guide/laboratorio.md) explica la prueba real opcional.\n\n${edition === 'participant' ? 'Un TODO pendiente debe dar un error claro al comprobar ese módulo. La demo simulada y typecheck funcionan desde el inicio. pnpm test y el modo real completo requieren terminar todos los ejercicios.' : 'Puedes ejecutar pnpm workshop:check all, pnpm test y pnpm build para comprobar esta solución.'}\n\nLa aprobación humana sigue pendiente al generar contenido. La aplicación no publica en redes sociales.\n\nConsulta [LICENSE](LICENSE) y [NOTICE](NOTICE) para los avisos de licencia.\n`);
  const root = `golden-rentals-${edition}`;
  const packed = Object.fromEntries(Object.entries(files).map(([path, bytes]) => [`${root}/${path}`, bytes]));
  const output = `release/${root}.zip`; await writeFile(output, zipSync(packed, { level: 6 }));
  console.log(`${output}: ${Object.keys(files).length} archivos; ${edition === 'participant' ? '14 TODO pendientes' : '14 pasos resueltos'}, modo simulado, puerto ${port}.`);
}
