# 7 Conectar agentes y pasar contexto

> [!TIP]
> **Tu objetivo:** integrar los agentes construidos con el workflow y la interfaz del MVP. Requisitos: módulos 2 a 6.

Abre `workshop/exercises/07-workflow.ts`. En el TODO 7.1 construyes los cuatro agentes usando las funciones de los módulos anteriores. La función de imágenes viene del proveedor y se registra como herramienta del Diseñador.

En el TODO 7.2 preparas el mensaje de cada etapa. El Redactor recibe la estrategia porque el workflow la incluye explícitamente. El Editor recibe las piezas actuales. El modelo no recibe el historial de versiones ni la aprobación humana.

El orden ya está preparado en `apps/server/src/workflow/service.ts`: estrategia → textos → imágenes → revisión y calendario. Ese código conserva persistencia, cancelación y límites. El workflow coordina a los cuatro agentes dentro del mismo proceso local.

En ambos paquetes del taller, `apps/server/src/agents/team.ts` y `packages/providers/adk.ts` están conectados a estos ejercicios. Los cambios sí llegan al modo real de la web. El modo simulado usa sus propias plantillas y permite recorrer la interfaz antes de terminar los TODO.

> [!WARNING]
> **Error frecuente:** construir todos los agentes pero enviarles únicamente el brief, perdiendo la estrategia y los textos anteriores.

## Bloques para completar

Abre `workshop/exercises/07-workflow.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 7.1

Pega dentro de la función correspondiente:

```ts
return {
  strategist: createStrategist(settings),
  copywriter: await createCopywriter(settings, options.skillRoot ?? resolve('skills/instagram-copy'), () => options.context().check()),
  designer: createDesigner(settings, createImageTool(options.generateImage)),
  editor: createEditor(settings),
};
```

### TODO 7.2

Pega dentro de la función correspondiente:

```ts
return JSON.stringify({
  task,
  data: {
    brief: campaign.brief,
    strategy: campaign.strategy,
    pieces: campaign.pieces.map(({ history: _history, humanApproval: _approval, ...piece }) => piece),
  },
});
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 7
```

> [!IMPORTANT]
> **Resultado esperado:** Cuatro agentes conectados, estrategia y piezas en el mensaje, sin historial ni aprobación humana.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
