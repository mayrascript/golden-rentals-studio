import { resolve } from 'node:path';
import type { LlmAgent } from '@google/adk';
import type { Campaign, AgentId } from '../../packages/contracts/index.js';
import { createSettings, type TeamOptions } from '../support.js';
import { createStrategist } from './02-strategist.js';
import { createImageTool, createDesigner } from './03-tools.js';
import { createCopywriter } from './04-skills.js';
import { createEditor } from './06-editor.js';

export async function createWorkshopTeam(options: TeamOptions): Promise<Record<AgentId, LlmAgent>> {
  const settings = createSettings(options);
  // TODO 7.1 · Conectar las cuatro fábricas con la aplicación preparada.
  // Recibe: configuración del servidor y la función que genera y guarda imágenes.
  // Devuelve: agentes identificados por las cuatro etapas del workflow.
  // service.ts mantiene el orden, la cancelación, los límites y la persistencia.
  // @solution:start 7.1
  return {
    strategist: createStrategist(settings),
    copywriter: await createCopywriter(settings, options.skillRoot ?? resolve('skills/instagram-copy'), () => options.context().check()),
    designer: createDesigner(settings, createImageTool(options.generateImage)),
    editor: createEditor(settings),
  };
  // @solution:end 7.1
}

export function buildAgentInput(campaign: Campaign, task: string): string {
  // TODO 7.2 · Pasar explícitamente los resultados anteriores al siguiente agente.
  // Recibe: campaña actual y tarea concreta de la etapa.
  // Devuelve: un mensaje JSON con brief, estrategia y piezas disponibles.
  // Se omiten historial y aprobaciones: el modelo trabaja con la versión actual y la persona conserva la decisión final.
  // @solution:start 7.2
  return JSON.stringify({
    task,
    data: {
      brief: campaign.brief,
      strategy: campaign.strategy,
      pieces: campaign.pieces.map(({ history: _history, humanApproval: _approval, ...piece }) => piece),
    },
  });
  // @solution:end 7.2
}
