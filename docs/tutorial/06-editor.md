# 6 Editor y workflow

Objetivo: distinguir decisiones del modelo de reglas obligatorias del programa. Necesitas conocer los cuatro contratos de salida.

## Pasos

1. Lee las cuatro llamadas a `phase` en [service.ts](../../apps/server/src/workflow/service.ts): Estratega, Redactor, Diseñador y Editor.
2. Observa que el Editor revisa textos y metadatos, y propone el calendario de la campaña.
3. Sigue `audit` y `validateCalendar` en [rules.ts](../../apps/server/src/workflow/rules.ts). La aplicación comprueba referencias, piezas, fechas y algunas afirmaciones de riesgo.
4. Localiza el contador de revisiones. Una revisión fallida puede provocar una sola corrección automática. Si vuelve a fallar, el resultado queda para intervención humana.
5. Observa la cancelación y `completedSteps`: se dejan de iniciar pasos y se conservan los ya terminados. Una llamada externa enviada antes de cancelar puede tener costo.

`APPROVED` en la revisión automática no significa que la campaña esté aprobada por una persona. El Editor no recibe píxeles; su resultado mantiene `visualInspection: HUMAN_REQUIRED`.

## Ejercicio y checkpoint

Abre la prueba «acota a una la ronda automática de corrección» en [workflow.test.ts](../../tests/workflow.test.ts). El proveedor de prueba pide cambios siempre. Ejecuta `pnpm test` y confirma que el flujo termina después de dos revisiones, en vez de continuar indefinidamente.

El workflow controla orden y permisos en código. A2A y MCP no son necesarios para estas llamadas dentro del mismo proceso.
