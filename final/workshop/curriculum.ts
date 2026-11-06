// Cada ID aparece exactamente igual en el archivo, la guía y los mensajes de comprobación.
export const modules = [
  { id: '2', file: '02-strategist.ts', title: 'Configurar y probar un agente', steps: ['2.1', '2.2'], command: 'strategist', expected: 'Un agente llamado strategist y una estrategia con tres ángulos.' },
  { id: '3', file: '03-tools.ts', title: 'Registrar y llamar una tool', steps: ['3.1', '3.2'], command: 'tools', expected: 'Una llamada generate_campaign_image, sus argumentos y el resultado devuelto a ADK.' },
  { id: '4', file: '04-skills.ts', title: 'Conectar una skill y sus recursos', steps: ['4.1', '4.2', '4.3'], command: 'copywriter', expected: 'Llamadas load_skill y load_skill_resource antes de recibir tres textos.' },
  { id: '5', file: '05-images.ts', title: 'Generar, extraer y guardar una imagen', steps: ['5.1', '5.2', '5.3'], command: 'designer', expected: 'Una imagen final decodificada y guardada; las partes de razonamiento se descartan.' },
  { id: '6', file: '06-editor.ts', title: 'Revisar y validar una salida estructurada', steps: ['6.1', '6.2'], command: 'editor', expected: 'Una revisión y tres fechas válidas; un JSON con forma incorrecta es rechazado.' },
  { id: '7', file: '07-workflow.ts', title: 'Conectar agentes y pasar contexto', steps: ['7.1', '7.2'], command: 'workflow', expected: 'Cuatro agentes conectados, estrategia y piezas en el mensaje, sin historial ni aprobación humana.' },
] as const;
export type ModuleId = typeof modules[number]['id'];
