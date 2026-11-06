export const repository = 'https://github.com/mayrascript/golden-rentals-workshop';
export const notionGuide = 'https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55';
export const siteUrl = 'https://mayrascript.github.io/golden-rentals-workshop/';

// Los números coinciden con los TODO y con la guía de Notion.
export const steps = [
  { id: 'inicio', file: 'README.md', label: 'Descripción general', title: 'Tu estudio creativo, paso a paso', number: 0 },
  { id: 'preparacion', file: '01-preparacion.md', label: 'Prepara tu entorno', title: 'Prepara tu entorno', number: 1 },
  { id: 'agente', file: '02-strategist.md', label: 'Configura tu primer agente', title: 'Configura tu primer agente', number: 2, exercise: '02-strategist.ts' },
  { id: 'tools', file: '03-tools.md', label: 'Registra y llama una tool', title: 'Dale una herramienta al agente', number: 3, exercise: '03-tools.ts' },
  { id: 'skills', file: '04-skills.md', label: 'Conecta una skill', title: 'Conecta una skill y sus recursos', number: 4, exercise: '04-skills.ts' },
  { id: 'imagenes', file: '05-images.md', label: 'Genera y guarda imágenes', title: 'Del concepto a la imagen', number: 5, exercise: '05-images.ts' },
  { id: 'editor', file: '06-editor.md', label: 'Revisa y valida respuestas', title: 'Revisa y valida las respuestas', number: 6, exercise: '06-editor.ts' },
  { id: 'equipo', file: '07-workflow.md', label: 'Conecta el equipo', title: 'Conecta tus cuatro agentes', number: 7, exercise: '07-workflow.ts' },
  { id: 'campana', file: '08-campana.md', label: 'Crea tu primera campaña', title: 'Crea tu primera campaña', number: 8 },
  { id: 'laboratorio', file: 'laboratorio.md', label: 'Laboratorio con Gemini', title: 'Prueba un agente por separado', number: null },
  { id: 'facilitacion', file: 'facilitadora.md', label: 'Guía de facilitación', title: 'Prepara y acompaña el taller', number: null },
] as const;

export function routeForFile(file: string) {
  return steps.find(step => step.file === file)?.id;
}
