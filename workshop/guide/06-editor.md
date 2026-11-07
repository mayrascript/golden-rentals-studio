# 6 Revisar y validar una salida estructurada

> [!TIP]
> **Tu objetivo:** convertir la respuesta del Editor en datos que la aplicación pueda usar. Requisito: módulo 2; el laboratorio aporta textos de ejemplo sin ejecutar los módulos anteriores.

Abre `packages/contracts/index.ts` y localiza `editorSchema`. Define una revisión y exactamente tres entradas del calendario. TypeScript ayuda al escribir código; Zod valida valores que llegan durante la ejecución.

En `workshop/exercises/06-editor.ts`, configura el agente (6.1) y completa el parseo y validación (6.2). `JSON.parse` rechaza JSON mal formado; `editorSchema.parse` rechaza datos con campos o valores incorrectos. El laboratorio prueba también un JSON sintácticamente válido pero incompleto.

La aplicación solicita JSON mediante instrucciones y valida la respuesta con Zod al recibirla. Enviar un esquema al proveedor para restringir la generación es una técnica adicional; no sustituye la validación de la respuesta en la aplicación.

El Editor revisa textos y metadatos. `HUMAN_REQUIRED` deja explícito que la persona revisa los píxeles. `APPROVED` en la respuesta automática todavía no constituye aprobación humana.

> [!WARNING]
> **Error frecuente:** confiar en que pedir JSON garantiza su estructura o aceptar una revisión con cero fechas.

## Bloques para completar

Abre `workshop/exercises/06-editor.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 6.1

Pega dentro de la función correspondiente:

```ts
return new LlmAgent({
  ...settings,
  name: 'editor',
  description: 'Revisa hechos y textos y propone un calendario de siete días.',
  instruction: `${BASE_INSTRUCTION} Revisa coherencia, hechos y variedad; propone tres fechas dentro de siete días. No inspeccionas píxeles: visualInspection siempre es HUMAN_REQUIRED. APPROVED significa solo revisión automática textual, nunca aprobación humana.`,
});
```

### TODO 6.2

Pega dentro de la función correspondiente:

```ts
const json = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
return editorSchema.parse(json);
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 6
```

> [!IMPORTANT]
> **Resultado esperado:** Una revisión y tres fechas válidas; un JSON con forma incorrecta es rechazado.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
