# 7 Conectar agentes y pasar contexto

Objetivo: integrar los agentes construidos con el workflow y la interfaz del MVP. Requisitos: módulos 2 a 6.

Abre `workshop/exercises/07-workflow.ts`. En el TODO 7.1 construyes los cuatro agentes usando las funciones de los módulos anteriores. La función de imágenes viene del proveedor y se registra como herramienta del Diseñador.

En el TODO 7.2 preparas el mensaje de cada etapa. El Redactor recibe la estrategia porque el workflow la incluye explícitamente. El Editor recibe las piezas actuales. El modelo no recibe el historial de versiones ni la aprobación humana.

El orden ya está preparado en `apps/server/src/workflow/service.ts`: estrategia → textos → imágenes → revisión y calendario. Ese código conserva persistencia, cancelación y límites. El workflow coordina a los cuatro agentes dentro del mismo proceso local.

En ambos paquetes del taller, `apps/server/src/agents/team.ts` y `packages/providers/adk.ts` están conectados a estos ejercicios. Los cambios sí llegan al modo real de la web. El modo simulado usa sus propias plantillas y permite recorrer la interfaz antes de terminar los TODO.

Error frecuente: construir todos los agentes pero enviarles únicamente el brief, perdiendo la estrategia y los textos anteriores.
