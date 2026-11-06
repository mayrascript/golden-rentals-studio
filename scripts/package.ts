import { mkdir, writeFile } from 'node:fs/promises';
import { zipSync } from 'fflate';
import { collectProjectFiles } from './package-files.js';

const source = await collectProjectFiles();
const files = Object.fromEntries(Object.entries(source).map(([path, bytes]) => [`golden-rentals/${path}`, bytes]));
await mkdir('release', { recursive: true });
const output = 'release/multiagent-adk-workshop.zip'; await writeFile(output, zipSync(files, { level: 6 }));
console.log(`${output}: ${Object.keys(files).length} archivos; fuentes y tutorial, sin claves, campañas ni dependencias instaladas.`);
