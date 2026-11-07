export const repository = 'https://github.com/mayrascript/multiagent-adk-workshop';
export const notionGuide = 'https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55';
export const siteUrl = 'https://mayrascript.github.io/multiagent-adk-workshop/';
export const workshopName = 'Tu próximo equipo no es humano';
export const workshopSubtitle = 'Workshop de orquestación de agentes con Google ADK';
export const workshopTitle = `${workshopName}: ${workshopSubtitle.toLowerCase().replace('google adk', 'Google ADK')}`;

// Los números coinciden con los TODO y con la guía de Notion.
export const steps = [
  { id: 'inicio', file: 'README.md', label: 'Descripción general', title: workshopName, number: 0 },
  { id: 'preparacion', minutes: 20, file: '01-preparacion.md', label: 'Prepara tu entorno', title: 'Prepara tu entorno', number: 1 },
  { id: 'agente', minutes: 20, file: '02-strategist.md', label: 'Configura tu primer agente', title: 'Configura tu primer agente', number: 2, exercise: '02-strategist.ts' },
  { id: 'tools', minutes: 15, file: '03-tools.md', label: 'Registra y llama una tool', title: 'Dale una herramienta al agente', number: 3, exercise: '03-tools.ts' },
  { id: 'skills', minutes: 20, file: '04-skills.md', label: 'Conecta una skill', title: 'Conecta una skill y sus recursos', number: 4, exercise: '04-skills.ts' },
  { id: 'imagenes', minutes: 20, file: '05-images.md', label: 'Genera y guarda imágenes', title: 'Del concepto a la imagen', number: 5, exercise: '05-images.ts' },
  { id: 'editor', minutes: 15, file: '06-editor.md', label: 'Revisa y valida respuestas', title: 'Revisa y valida las respuestas', number: 6, exercise: '06-editor.ts' },
  { id: 'equipo', minutes: 15, file: '07-workflow.md', label: 'Conecta el equipo', title: 'Conecta tus cuatro agentes', number: 7, exercise: '07-workflow.ts' },
  { id: 'campana', minutes: 15, file: '08-campana.md', label: 'Crea tu primera campaña', title: 'Crea tu primera campaña', number: 8 },
  { id: 'laboratorio', file: 'laboratorio.md', label: 'Laboratorio con Gemini', title: 'Prueba un agente por separado', number: null },
  { id: 'facilitacion', file: 'facilitadora.md', label: 'Guía de facilitación', title: 'Prepara y acompaña el taller', number: null },
] as const;

export function routeForFile(file: string) {
  return steps.find(step => step.file === file)?.id;
}
