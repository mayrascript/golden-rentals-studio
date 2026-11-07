// Recursos locales revisados: la guía nunca carga imágenes arbitrarias del Markdown.
export const illustrations = {
  'workshop-architecture.png': {
    width: 2048, height: 1152,
    caption: 'Arquitectura del proyecto en TypeScript.',
    label: 'diagrama de arquitectura',
  },
  'agent-avatars.png': {
    width: 2172, height: 724,
    caption: 'Los cuatro especialistas que construirás.',
    label: 'avatares del equipo',
  },
  'team-collaboration.png': {
    width: 1672, height: 941,
    caption: 'Tu lugar en el equipo: das contexto, revisas las imágenes y apruebas la campaña. Human in the loop significa que participas en las decisiones.',
    label: 'equipo trabajando contigo',
  },
  'tool-illustration.png': {
    width: 1672, height: 941,
    caption: 'Tool = una acción. El agente la solicita; ADK ejecuta la función y devuelve el resultado. La cámara es una analogía: aquí la tool genera una imagen con Gemini.',
    label: 'ilustración de una tool',
  },
  'skill-illustration.png': {
    width: 1672, height: 941,
    caption: 'Skill = un manual reutilizable. El Redactor consulta instrucciones, reglas y ejemplos para orientar su trabajo.',
    label: 'ilustración de una skill',
  },
} as const;
