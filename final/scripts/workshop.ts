import { readFile, mkdir, open, unlink } from 'node:fs/promises';
import { parse } from 'dotenv';
import { modules } from '../workshop/curriculum.js';
import { checkModule } from '../workshop/lab.js';

const args = process.argv.slice(2); const target = args.find(arg => !arg.startsWith('--')) ?? 'all';
const live = args.includes('--real'); let key = ''; let lock: Awaited<ReturnType<typeof open>> | undefined;
try {
  if (live && (!args.includes('--allow-paid-generation') || !args.some(arg => arg.startsWith('--budget-usd=')))) throw new Error('Una prueba real requiere --real --allow-paid-generation --budget-usd=IMPORTE.');
  const example = parse(await readFile('.env.example'));
  let personal: Record<string, string> = {};
  try { personal = parse(await readFile('.env')); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
  if (target === 'setup') {
    console.log(`Node: ${process.version}. Modelos de la plantilla: ${example.TEXT_MODEL}, ${example.IMAGE_MODEL}.`);
    console.log(`Archivo .env personal: ${Object.keys(personal).length ? 'encontrado' : 'opcional para la práctica offline'}. Clave configurada: ${personal.GOOGLE_GENAI_API_KEY?.trim() ? 'sí' : 'no'}.`);
    console.log('Las comprobaciones offline y la demo simulada funcionan sin clave. No se consultó Gemini.');
  } else {
    const selected = target === 'all' ? modules : modules.filter(module => module.id === target || module.command === target);
    if (!selected.length) throw new Error('Usa setup, all, 2, 3, 4, 5, 6 o 7.');
    if (live && selected.length !== 1) throw new Error('Prueba un solo agente real a la vez: 2, 4, 5 o 6.');
    key = personal.GOOGLE_GENAI_API_KEY?.trim() ?? '';
    if (live && (!key || /TU_|YOUR_|PEGA_/i.test(key))) throw new Error('Configura tu clave en .env antes de solicitar una prueba real.');
    if (live) {
      // Un único laboratorio real por carpeta evita carreras al reservar presupuesto.
      await mkdir('.workshop-data', { recursive: true });
      lock = await open('.workshop-data/lab.lock', 'wx');
      console.log('Modo real: se enviará el ejemplo ficticio a Gemini. El presupuesto solo cubre este laboratorio y se conserva entre ejecuciones.');
    } else console.log('Modo offline: ADK se ejecuta con respuestas HTTP preparadas. Sin inferencia ni consumo de IA.');
    for (const module of selected) {
      const result = await checkModule(module.id, {
        solution: args.includes('--solution'),
        real: live ? { apiKey: key, textModel: personal.TEXT_MODEL ?? example.TEXT_MODEL, imageModel: personal.IMAGE_MODEL ?? example.IMAGE_MODEL, budget: Number(args.find(arg => arg.startsWith('--budget-usd='))?.split('=')[1]) } : undefined,
        onTrace: event => console.log(`${event.kind === 'tool_call' ? '→ llamada' : '← resultado'} ${event.name}: ${JSON.stringify(event.kind === 'tool_call' ? event.args : event.result).slice(0, 260)}`),
      });
      console.log(`✓ Módulo ${module.id}: ${module.expected}`);
      console.log(JSON.stringify({ result: result.result, modelCalls: result.modelCalls, images: result.images, tokens: result.tokens }, null, 2));
    }
  }
} catch (error) {
  const message = (error instanceof Error ? error.message : String(error));
  console.error((key ? message.split(key).join('[clave oculta]') : message).replace(/AIza[\w-]+/g, '[clave oculta]'));
  process.exitCode = 1;
} finally { if (lock) { await lock.close(); await unlink('.workshop-data/lab.lock'); } }
