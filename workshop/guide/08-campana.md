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
3. Para probar tus agentes reales, sigue **“Vuelve al dashboard de edición con Gemini”** en [Laboratorio con Gemini](laboratorio.md). Allí se explica qué línea de `.env` editar, cómo reiniciar con `pnpm dev`, qué dirección abrir y cómo comprobar que aparece “Generación con IA”. La web conserva los límites por campaña; el presupuesto del laboratorio no se aplica a la web.
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


## Cierre express · 30–60 segundos por persona o equipo

**No hay un ejercicio adicional.** Mientras la facilitadora recorre las mesas:

1. Muestra la campaña que acabas de crear, con sus tres piezas y tu revisión.
2. Explica **una** decisión: qué aporta la skill, qué ejecuta la tool o cómo llega la estrategia al Redactor.
3. La facilitadora confirma el resultado y anota tu nombre o identificador para la entrega de premios.

> [!TIP]
> Prepara la campaña en pantalla mientras terminas el taller. No necesitas diapositivas, subir archivos ni volver a ejecutar Gemini. El modo simulado sirve para el cierre; debes poder mostrar y explicar tu código.

El feedback es opcional e independiente del premio. Marcar la guía como completada no acredita la finalización: la validación breve de la facilitadora es la referencia. Sin registro de identidad no existe una garantía automática de quién terminó.

## Tu opinión mejora el próximo taller

[Compartir feedback · 2 minutos](https://docs.google.com/forms/d/e/1FAIpQLSev_Fj0cqByC75TMAMUZPag1pSpk4iUmRMLcPKUb0stvRmR7g/viewform)

Cuéntanos qué te pareció, dónde encontraste dificultades y qué cambiarías. No pedimos nombre ni correo. La encuesta es voluntaria.
