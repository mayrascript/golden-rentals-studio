import { pending } from '../support.js';
import { LlmAgent, SkillToolset, loadSkillFromDir } from '@google/adk';
import { BASE_INSTRUCTION, type AgentSettings } from '../support.js';

type LoadedSkill = Awaited<ReturnType<typeof loadSkillFromDir>>;

export async function loadCopySkill(directory: string): Promise<LoadedSkill> {
  // TODO 4.1 · Leer la skill desde el disco.
  // Recibe: la ruta de skills/instagram-copy, que contiene SKILL.md y references/.
  // Devuelve: la definición de la skill. Cargarla en Node todavía no demuestra que el modelo la consulte.
  // @todo:start 4.1
  // Descomenta el bloque siguiente y elimina pending('4.1').
  // return await loadSkillFromDir(directory);
  pending('4.1');
  // @todo:end 4.1
}

export function createCopyToolset(skill: LoadedSkill): SkillToolset {
  // TODO 4.2 · Exponer la skill mediante las herramientas de carga de ADK.
  // Recibe: una skill; devuelve un SkillToolset que permite consultar instrucciones y recursos.
  // En este workshop las skills aportan texto; la ejecución de scripts permanece desactivada.
  // @todo:start 4.2
  // Descomenta el bloque siguiente y elimina pending('4.2').
  // return new SkillToolset([skill], { allowInlineScripts: false });
  pending('4.2');
  // @todo:end 4.2
}

export async function createCopywriter(settings: AgentSettings, directory: string, check: () => void): Promise<LlmAgent> {
  const skill = await loadCopySkill(directory);
  const skillTools = createCopyToolset(skill);
  // TODO 4.3 · Conectar el toolset con el Redactor y pedir la lectura del recurso.
  // Recibe: modelo, carpeta de skill y comprobación del estado de la campaña.
  // Devuelve: un agente con acceso a load_skill y load_skill_resource.
  // La estrategia se entrega en el mensaje del workflow; los agentes no comparten contexto automáticamente.
  // @todo:start 4.3
  // Descomenta el bloque siguiente y elimina pending('4.3').
  // return new LlmAgent({
  //   ...settings,
  //   name: 'copywriter',
  //   description: 'Redacta tres publicaciones usando la estrategia y la skill de Instagram.',
  //   instruction: `${BASE_INSTRUCTION} Carga la skill instagram-copy y su recurso references/estructuras.md antes de redactar. Produce gancho, cuerpo, CTA, hashtags y referencias a hechos.`,
  //   tools: [skillTools],
  //   beforeToolCallback: ({ tool }) => {
  //     check();
  //     if (!['load_skill', 'load_skill_resource'].includes(tool.name)) throw new Error('Herramienta no disponible en este workshop.');
  //     return undefined;
  //   },
  // });
  pending('4.3');
  // @todo:end 4.3
}
