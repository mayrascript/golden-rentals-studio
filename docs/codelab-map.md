# Del codelab original al workshop TypeScript

Esta adaptación usa el codelab **Build a Multi-Agent Creative Studio** de Saoussen Chaabnia y Mete Atamel como referencia pedagógica. El objetivo de Golden Rentals es una aplicación local con cuatro agentes, revisión humana y descarga. El lenguaje elegido por la organizadora es TypeScript.

Referencia original: [código Python y codelab](https://github.com/Saoussen-CH/mas-a2a-gcp). [Codelab de Google](https://codelabs.developers.google.com/ai-creative-studio-adk-a2a). La copia local fue consultada el 5 de noviembre de 2026; la estructura y los ejemplos siguientes son una adaptación, no una traducción literal.

La edición guiada está disponible en [workshop/guide](../workshop/guide/README.md), con 14 TODO comentados y comprobaciones individuales. La tabla siguiente conserva las equivalencias con la guía de lectura del MVP.

## Correspondencia de pasos

| Paso del codelab | Decisión para Golden Rentals | Dónde se practica |
| --- | --- | --- |
| Overview | Presentar cuatro agentes y el recorrido completo; distinguir simulación e inferencia real. | [Módulo 1](tutorial/01-preparacion.md) |
| Set Up Your Environment | Cambiar Cloud Shell, Python y uv por Node.js, pnpm y TypeScript; empezar sin credenciales. | [Módulo 1](tutorial/01-preparacion.md) |
| Understand Google ADK | Usar el SDK oficial `@google/adk`; explicar agente, herramienta, skill, workflow y aprobación. | [Módulo 3](tutorial/03-agentes.md) |
| Build and Test the Brand Strategist | Convertir el brief en tres ángulos; usar hechos aportados en lugar de investigación externa. | [Módulos 2](tutorial/02-marca.md) y [3](tutorial/03-agentes.md) |
| Build the Copywriter — ADK Skills | Cargar `instagram-copy` mediante `loadSkillFromDir` y `SkillToolset`; validar JSON. | [Módulo 4](tutorial/04-redactor.md) |
| Build the Designer — Multimodal Image Generation | Registrar `FunctionTool`, invocar Gemini en modo real, guardar archivos locales y metadatos. | [Módulo 5](tutorial/05-imagenes.md) |
| Build the Critic — Structured Output | Integrar crítica textual en el Editor; validar contratos con Zod. La revisión visual queda explícitamente a cargo del humano. | [Módulo 6](tutorial/06-editor.md) |
| Build the Project Manager Agent with MCP | Incorporar calendario al Editor. Sustituir la escritura en Notion por calendario editable y CSV. | [Módulo 6](tutorial/06-editor.md) |
| Understand the A2A Protocol | Explicar el concepto como comparación, fuera del código de esta entrega. Los agentes comparten proceso. | [Decisión de arquitectura](decisions/001-arquitectura.md) |
| Expose agents as A2A services | Sustituir los servicios remotos por una API local que atiende a la interfaz. | [Módulo 7](tutorial/07-revision.md) |
| Build the Creative Director Orchestrator | Sustituir el quinto/sexto agente coordinador por un workflow explícito en TypeScript. | [Módulo 6](tutorial/06-editor.md) |
| Deploy and Test the Specialist Agents | Sustituir despliegue por pruebas locales, contratos, límites y errores. | [Módulo 8](tutorial/08-pruebas.md) |
| Deploy the Creative Director to Agent Runtime | Sustituir por compilación e inicio local de la aplicación. | [Módulo 8](tutorial/08-pruebas.md) |
| Run an end-to-end campaign | Generar, editar, revisar, aprobar y descargar tres piezas desde la web. | [Módulos 1](tutorial/01-preparacion.md) y [7](tutorial/07-revision.md) |
| Clean Up | Detener el servidor; campañas guardadas en `.data/`; evitar incluirlas en el paquete del workshop. | [Módulo 8](tutorial/08-pruebas.md) |
| Summary | Recapitular responsabilidades, diferencia entre simulación y modelo real y próximos ejercicios. | [Módulo 8](tutorial/08-pruebas.md) |

## Pasos añadidos a partir de los requisitos

Estos pasos no quedan resueltos por completar los TODO del proyecto Python:

- Formulario de marca, tono, audiencia, objetivo, hechos, restricciones, paleta, fechas y zona horaria.
- Modo simulado sin llamadas de red; activos SVG de prueba identificados como tales.
- Contratos compartidos entre servidor e interfaz; comprobación de referencias a hechos y piezas.
- Persistencia de campañas y detección de ejecuciones interrumpidas.
- Edición con historial, regeneración de una sola imagen y solicitud de ajuste textual.
- Aprobación por pieza y por hash del paquete; cambios invalidan la aprobación correspondiente.
- Calendario editable y exportación ZIP con manifiesto y sumas de verificación.
- Límites de llamadas, imágenes y correcciones; cancelación y control de solicitudes repetidas.
- Pruebas de flujo, casos adversariales, navegación web y adaptación a pantalla pequeña.

## Estado y lo que todavía falta validar

El código de la demo y los adaptadores reales se encuentran en esta carpeta. El estado de las comprobaciones ejecutadas se registra en [validation.md](validation.md).

- **Proveedor real:** la distribución incluye comprobaciones offline con ADK. Cada participante debe comprobar acceso y calidad con su cuenta antes de activar Gemini. Las pruebas de recuperación siguen siendo locales.
- **Revisión visual automática:** esta entrega marca `HUMAN_REQUIRED`. Añadir un modelo que inspeccione píxeles sería una ampliación explícita, no una capacidad ya implementada.
- **Material docente:** la edición del participante contiene 14 TODO de código, comentarios sobre entradas y salidas, bloques para pegar y un laboratorio por módulo. La solución completa y comentada está en main; el paso a paso está en la rama starter. La interfaz usa las funciones de los ejercicios en ambas ramas. Se comprobó la instalación y el recorrido pegando los bloques de la guía. No hay ramas o tags Git por módulo.
- **Ensayo:** medir duración y dificultad con una persona del público objetivo. No se ha prometido una duración fija.
- **Publicación:** el tutorial está disponible en Markdown y en [Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55). El repositorio público contiene las ramas main y starter. El despliegue queda fuera de esta edición.

## Fuentes técnicas para la adaptación

- [ADK oficial para TypeScript](https://github.com/google/adk-js): paquete oficial y comandos de desarrollo.
- [Inicio de ADK TypeScript](https://adk.dev/get-started/typescript/): preparación y primeros agentes.
- [Skills](https://adk.dev/skills/): carga de instrucciones y recursos; función experimental.
- [Workflows](https://adk.dev/graphs/): referencia para orquestación; esta entrega utiliza control secuencial propio en TypeScript.
- [SDK JavaScript de Gemini](https://github.com/googleapis/js-genai): cliente para el proveedor de imágenes.

Las firmas implementadas se contrastan con los tipos del SDK instalado, no con imports de Python.
