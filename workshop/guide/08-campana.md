# 8 Crear la campaña y cerrar el ejercicio

Objetivo: comprobar que los bloques construidos trabajan juntos y explicar qué aprendiste.

1. Completa los módulos y ejecuta:

```sh
pnpm workshop:check all
pnpm typecheck
pnpm test
pnpm build
```

La prueba ADK de `pnpm test` usa el equipo conectado a la web con respuestas locales. Mientras haya TODO pendientes, esa prueba debe fallar. Las comprobaciones por módulo permiten avanzar de forma gradual.

2. Ejecuta la web con `pnpm dev`. Usa primero el modo simulado para recorrer formulario, revisión y descarga.
3. Para probar tus agentes reales, configura tu propia clave y presupuesto de cuenta, cambia `GENERATION_MODE=real` en `.env` y reinicia el servidor. La web conserva los límites por campaña; el presupuesto del laboratorio no se aplica a la web.
4. Crea una campaña ficticia: observa la estrategia, los textos, las imágenes, la revisión y el calendario. Edita una pieza y verifica que su aprobación anterior queda invalidada.
5. Revisa el contenido y descarga el borrador o la campaña aprobada. La aprobación humana es tu decisión.
6. Detén el servidor. Las campañas de la web permanecen en `.data/`; los ejercicios y tu configuración personal permanecen en tu carpeta.

## Explicar lo construido

- ¿Qué cambia entre definir un agente y ejecutarlo con un Runner?
- ¿Qué datos describe el esquema de una FunctionTool y qué ejecuta ADK?
- ¿Cómo comprobaste que el Redactor consultó la skill y un recurso?
- ¿Qué devuelve la herramienta de imágenes al agente?
- ¿Qué comprueba Zod que JSON.parse no comprueba?
- ¿Cómo recibe el Redactor la estrategia? ¿Quién decide el orden?
- ¿Qué demuestra la prueba offline y qué requiere una prueba real?

La solución local conserva cuatro agentes, workflow explícito y revisión humana. MCP, A2A, revisión automática de píxeles y despliegue son extensiones pedagógicas que requieren sus propios ejercicios y validaciones.
