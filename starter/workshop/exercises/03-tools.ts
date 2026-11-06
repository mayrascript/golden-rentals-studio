import { pending } from '../support.js';
import { FunctionTool, LlmAgent, type BaseTool } from '@google/adk';
import { z } from 'zod';
import { PHOTO_STYLE } from '../../packages/providers/image-prompt.js';
import { BASE_INSTRUCTION, type AgentSettings, type ImageInput } from '../support.js';

// Esquema preparado: se conserva en ejecución, a diferencia de los tipos TypeScript.
// ADK lo usa para describir la herramienta al modelo y validar sus argumentos.
export const imageParameters = z.object({
  pieceId: z.enum(['piece-1', 'piece-2', 'piece-3']).describe('Publicación existente que recibirá la imagen.'),
  prompt: z.string().min(20).max(2000).describe('Escena, encuadre, iluminación y materiales.'),
  altText: z.string().min(5).max(500).describe('Descripción accesible que identifica el alojamiento como ficticio y generado por IA.'),
});

export function createImageTool(execute: (input: ImageInput) => Promise<unknown>): BaseTool {
  // TODO 3.1 · Convertir una función en una herramienta que el agente pueda llamar.
  // Recibe: execute, la función del servidor que genera y guarda el archivo.
  // Devuelve: una FunctionTool con nombre, descripción y argumentos conocidos por el modelo.
  // Registrar una tool no la ejecuta: ADK invoca execute cuando recibe una llamada válida.
  // @todo:start 3.1
  // Descomenta el bloque siguiente y elimina pending('3.1').
  // return new FunctionTool({
  //   name: 'generate_campaign_image',
  //   description: 'Genera y guarda una imagen fotorrealista de un alojamiento ficticio para una pieza existente. Una llamada por pieza; no documenta una propiedad real.',
  //   parameters: imageParameters,
  //   execute,
  // });
  pending('3.1');
  // @todo:end 3.1
}

export function createDesigner(settings: AgentSettings, imageTool: BaseTool): LlmAgent {
  // TODO 3.2 · Dar acceso a la herramienta desde el Diseñador.
  // Recibe: configuración del modelo de texto y la FunctionTool del paso anterior.
  // Devuelve: un agente que redacta conceptos y puede pedir imágenes mediante tools.
  // El modelo de texto decide los argumentos; la tool llama al modelo de imágenes en el módulo 5.
  // @todo:start 3.2
  // Descomenta el bloque siguiente y elimina pending('3.2').
  // return new LlmAgent({
  //   ...settings,
  //   name: 'designer',
  //   description: 'Diseña escenas fotográficas y solicita su generación mediante una herramienta.',
  //   instruction: `${BASE_INSTRUCTION} Crea escenas fotográficas distintas y coherentes con cada pieza, los hechos y la paleta. ${PHOTO_STYLE} Usa generate_campaign_image una vez por cada pieza que no tenga imagen. Entrega un altText que describa la escena y la identifique como imagen generada por IA de un alojamiento ficticio.`,
  //   tools: [imageTool],
  // });
  pending('3.2');
  // @todo:end 3.2
}
