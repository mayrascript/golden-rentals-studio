import { LlmAgent } from '@google/adk';
import { editorSchema, type Review, type CalendarEntry } from '../../packages/contracts/index.js';
import { BASE_INSTRUCTION, type AgentSettings } from '../support.js';

export function createEditor(settings: AgentSettings): LlmAgent {
  // TODO 6.1 · Configurar el Editor y delimitar qué puede revisar.
  // Recibe: el modelo compartido; devuelve el agente que revisa textos y propone fechas.
  // La salida esperada se describe en el mensaje; luego se valida contra el contrato Zod.
  // El Editor actual no inspecciona píxeles. Su revisión automática no aprueba la campaña por la persona.
  // @solution:start 6.1
  return new LlmAgent({
    ...settings,
    name: 'editor',
    description: 'Revisa hechos y textos y propone un calendario de siete días.',
    instruction: `${BASE_INSTRUCTION} Revisa coherencia, hechos y variedad; propone tres fechas dentro de siete días. No inspeccionas píxeles: visualInspection siempre es HUMAN_REQUIRED. APPROVED significa solo revisión automática textual, nunca aprobación humana.`,
  });
  // @solution:end 6.1
}

export function parseReview(text: string): { review: Review; calendar: CalendarEntry[] } {
  // TODO 6.2 · Convertir JSON en datos validados para la aplicación.
  // Recibe: texto de la respuesta; devuelve review y calendar con forma comprobada.
  // JSON.parse comprueba sintaxis; Zod comprueba campos, valores y cardinalidad.
  // Pedir JSON en un prompt no garantiza que cumpla el contrato: una respuesta inválida debe fallar aquí.
  // @solution:start 6.2
  const json = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  return editorSchema.parse(json);
  // @solution:end 6.2
}
