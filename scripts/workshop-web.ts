import { readFile, mkdir, open, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { parse } from 'dotenv';

const args = process.argv.slice(2);
const budget = Number(args.find(arg => arg.startsWith('--budget-usd='))?.split('=')[1]);
let lock: Awaited<ReturnType<typeof open>> | undefined;
try {
  if (!args.includes('--allow-paid-generation') || !Number.isFinite(budget) || budget <= 0) throw new Error('Usa pnpm workshop:web --allow-paid-generation --budget-usd=IMPORTE. ADK Web usa Gemini real; indica un presupuesto positivo.');
  const config = { ...parse(await readFile('.env.example')), ...parse(await readFile('.env')) };
  if (!config.GOOGLE_GENAI_API_KEY?.trim() || /TU_|YOUR_|PEGA_/i.test(config.GOOGLE_GENAI_API_KEY)) throw new Error('Configura tu clave personal en .env.');
  await mkdir('.workshop-data/adk-web', { recursive: true });
  lock = await open('.workshop-data/adk-web/server.lock', 'wx');
  const entry = resolve(dirname(fileURLToPath(import.meta.resolve('@google/adk-devtools'))), 'cli_entrypoint.js');
  console.log('ADK Web: http://127.0.0.1:8000 · Elige un especialista y abre una sesión nueva.');
  console.log('El presupuesto es una reserva acumulada de este laboratorio. No cubre la web de campañas ni representa una factura.');
  const child = spawn(process.execPath, ['--import', 'tsx', '--import', resolve('workshop/adk-bootstrap.ts'), entry, 'web', 'workshop/adk-agents', '--host', '127.0.0.1', '--port', '8000', '--file_type', 'esm'], {
    stdio: 'inherit', env: { ...process.env, ...config, WORKSHOP_ADK_AUTHORIZED: 'yes', WORKSHOP_ADK_BUDGET: String(budget) },
  });
  const stop = () => child.kill('SIGTERM');
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
  try { process.exitCode = await new Promise<number>((resolveExit, reject) => { child.on('error', reject); child.on('exit', code => resolveExit(code ?? 0)); }); }
  finally { process.off('SIGINT', stop); process.off('SIGTERM', stop); }
} catch (error) {
  // No imprimir errores del proveedor o credenciales.
  if ((error as NodeJS.ErrnoException).code === 'EEXIST') console.error('Ya hay un laboratorio ADK Web abierto. Ciérralo antes de iniciar otro.');
  else if ((error as NodeJS.ErrnoException).code === 'ENOENT') console.error('Falta .env o una dependencia. Completa la preparación.');
  else console.error(error instanceof Error ? error.message.replace(/AIza[\w-]+/g, '[clave oculta]') : 'No se pudo iniciar el laboratorio.');
  process.exitCode = 1;
} finally { if (lock) { await lock.close(); await unlink('.workshop-data/adk-web/server.lock'); } }
