# Mapa del workshop en TypeScript

**Tu próximo equipo no es humano** es un recorrido práctico para construir cuatro agentes con Google ADK y conectarlos a una aplicación local. Golden Rentals es el caso ficticio usado en los ejercicios.

La [guía paso a paso](../workshop/guide/README.md) incluye 14 TODO comentados, fragmentos para completar y comprobaciones individuales.

## Módulos y objetivos

| Módulo | Objetivo | Dónde se practica |
| --- | --- | --- |
| Preparación | Instalar Node.js y pnpm, clonar starter y ejecutar la demo sin credenciales. | [Paso 1](../workshop/guide/01-preparacion.md) |
| Agente | Definir instrucciones y ejecutar al Estratega con Google ADK. | [Paso 2](../workshop/guide/02-strategist.md) |
| Herramientas | Registrar una FunctionTool y observar la solicitud del modelo. | [Paso 3](../workshop/guide/03-tools.md) |
| Skills | Cargar las instrucciones y recursos de Instagram para el Redactor. | [Paso 4](../workshop/guide/04-skills.md) |
| Imágenes | Conectar al Diseñador con Gemini y guardar imágenes localmente. | [Paso 5](../workshop/guide/05-images.md) |
| Validación | Revisar textos y metadatos con el Editor y validar el resultado con Zod. | [Paso 6](../workshop/guide/06-editor.md) |
| Orquestación | Pasar contexto entre agentes mediante un workflow TypeScript. | [Paso 7](../workshop/guide/07-workflow.md) |
| Campaña | Generar, editar, revisar, aprobar y descargar tres piezas. | [Paso 8](../workshop/guide/08-campana.md) |

A2A y MCP se explican como posibles extensiones. La aplicación ejecuta los agentes en el mismo proceso; no requiere infraestructura distribuida. Consulta la [decisión de arquitectura](decisions/001-arquitectura.md).

## Funciones de la aplicación

La aplicación incluye:

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

## Fuentes técnicas

- [ADK oficial para TypeScript](https://github.com/google/adk-js): paquete oficial y comandos de desarrollo.
- [Inicio de ADK TypeScript](https://adk.dev/get-started/typescript/): preparación y primeros agentes.
- [Skills](https://adk.dev/skills/): carga de instrucciones y recursos; función experimental.
- [Workflows](https://adk.dev/graphs/): referencia para orquestación; esta entrega utiliza control secuencial propio en TypeScript.
- [SDK JavaScript de Gemini](https://github.com/googleapis/js-genai): cliente para el proveedor de imágenes.

Las firmas implementadas se contrastan con los tipos del SDK instalado.
