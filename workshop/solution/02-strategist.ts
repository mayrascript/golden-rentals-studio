import { LlmAgent } from '@google/adk';
import { BASE_INSTRUCTION, type AgentSettings } from '../support.js';

export function strategistInstruction(): string {
  // TODO 2.1 · Definir las instrucciones del Estratega.
  // Qué hace: delimita su responsabilidad y el resultado que debe producir.
  // Recibe: las reglas comunes; el brief llegará como mensaje al ejecutar el agente.
  // Devuelve: instrucciones de sistema. La definición todavía no llama al modelo.
  // @solution:start 2.1
  return `${BASE_INSTRUCTION} Formula una estrategia breve y tres ángulos distintos. No hagas investigación de mercado.`;
  // @solution:end 2.1
}

export function createStrategist(settings: AgentSettings): LlmAgent {
  // TODO 2.2 · Crear el agente con nombre, modelo, instrucciones y descripción.
  // Qué hace: configura un LlmAgent que ADK podrá ejecutar con un Runner.
  // Recibe: modelo y límites compartidos; devuelve un agente listo para recibir un brief.
  // El nombre identifica al agente; description explica su función e instruction guía su respuesta.
  // @solution:start 2.2
  return new LlmAgent({
    ...settings,
    name: 'strategist',
    description: 'Propone tres ángulos a partir de los hechos del brief.',
    instruction: strategistInstruction(),
    tools: [],
  });
  // @solution:end 2.2
}
