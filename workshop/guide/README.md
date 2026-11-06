# Golden Rentals · Codelab en TypeScript

[Abrir la guía web con menú lateral](https://mayrascript.github.io/golden-rentals-workshop/) · [Seguir este recorrido en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55)

Construye cuatro agentes con Google ADK y conecta sus resultados con una aplicación de contenido. La interfaz, la API, el guardado y los límites están preparados. Trabajarás en archivos pequeños con TODO numerados, comentarios explicativos y bloques para descomentar o pegar.

## Recorrido

1. [Preparar entorno y valores personales](01-preparacion.md).
2. [Configurar y probar un agente](02-strategist.md).
3. [Registrar y llamar una tool](03-tools.md).
4. [Conectar una skill y sus recursos](04-skills.md).
5. [Generar, extraer y guardar una imagen](05-images.md).
6. [Revisar y validar una salida estructurada](06-editor.md).
7. [Conectar agentes y pasar contexto](07-workflow.md).
8. [Crear la campaña y cerrar el ejercicio](08-campana.md).

Los comentarios de cada TODO indican qué hace, qué recibe, qué devuelve y qué debería suceder después. Cada página identifica el archivo, los bloques, la comprobación y un error frecuente. Las explicaciones permanecen en el código después de completar el ejercicio.

## Cómo trabajar

Realiza este recorrido en la rama `starter`. La rama `main` contiene la solución completa con los comentarios explicativos. En ambas, el proyecto está en la raíz del repositorio.

Abre `workshop/exercises/`. Descomenta el código del TODO indicado y elimina su llamada `pending('ID')`, o pega el bloque equivalente de la guía. Conserva las firmas y los imports preparados. Ejecuta la comprobación del módulo antes de avanzar.

`pnpm workshop:check 4`, por ejemplo, ejecuta tu Redactor con respuestas HTTP locales preparadas. Verás las llamadas a la skill; no se contacta a Gemini. Un TODO sin completar devuelve su ID y no se oculta usando la solución.

`workshop/solution/` contiene la referencia comentada. Puedes consultarla para recuperarte de un error. `--solution` prueba explícitamente esa referencia; no certifica los ejercicios que estás completando. Las pruebas normales usan `workshop/exercises/`.

Consulta [el laboratorio](laboratorio.md) para entender qué demuestra cada modo y cómo ejecutar un agente real de forma explícita. Las pruebas offline funcionan sin credenciales. La duración y dificultad del taller deben ajustarse después de un ensayo con participantes.

Para la organizadora: [guía de facilitación](facilitadora.md).
