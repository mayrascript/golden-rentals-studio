# 6 Revisar y validar una salida estructurada

Objetivo: convertir la respuesta del Editor en datos que la aplicación pueda usar. Requisito: módulo 2; el laboratorio aporta textos de ejemplo sin ejecutar los módulos anteriores.

Abre `packages/contracts/index.ts` y localiza `editorSchema`. Define una revisión y exactamente tres entradas del calendario. TypeScript ayuda al escribir código; Zod valida valores que llegan durante la ejecución.

En `workshop/exercises/06-editor.ts`, configura el agente (6.1) y completa el parseo y validación (6.2). `JSON.parse` rechaza JSON mal formado; `editorSchema.parse` rechaza datos con campos o valores incorrectos. El laboratorio prueba también un JSON sintácticamente válido pero incompleto.

La aplicación actual solicita JSON mediante instrucciones y valida al recibirlo. El codelab original también enseña a enviar un esquema al proveedor: esa restricción durante la generación es una técnica adicional y no equivale a validar con Zod al final. Esta edición mantiene el comportamiento probado del MVP.

El Editor revisa textos y metadatos. `HUMAN_REQUIRED` deja explícito que la persona revisa los píxeles. `APPROVED` en la respuesta automática todavía no constituye aprobación humana.

Error frecuente: confiar en que pedir JSON garantiza su estructura o aceptar una revisión con cero fechas.
