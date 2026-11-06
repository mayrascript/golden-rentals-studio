# 2 Configurar y probar un agente

Objetivo: construir un `LlmAgent` y distinguir definirlo de ejecutarlo. Requisito: completar la preparación.

ADK necesita un modelo, un nombre y unas instrucciones. La descripción resume su responsabilidad. El `Runner` crea una sesión, envía el brief y recoge la respuesta. Crear el objeto del agente no envía solicitudes al proveedor.

Abre `workshop/exercises/02-strategist.ts` y lee los comentarios de los TODO 2.1 y 2.2. Completa primero la instrucción y luego el agente. El laboratorio aportará un brief ficticio; el código de la sesión ya está preparado en `workshop/lab.ts`.

Después de comprobar el bloque base, cambia la instrucción para pedir tres ángulos más distintos. El laboratorio offline verifica la conexión y el contrato con respuestas fijas. Para evaluar el efecto de tu nueva instrucción necesitas una ejecución real.

Error frecuente: confundir `description` con `instruction`. La primera describe la responsabilidad del agente; la segunda orienta lo que el modelo debe hacer.


## Bloques para completar

Abre `workshop/exercises/02-strategist.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 2.1

Pega dentro de la función correspondiente:

```ts
return `${BASE_INSTRUCTION} Formula una estrategia breve y tres ángulos distintos. No hagas investigación de mercado.`;
```

### TODO 2.2

Pega dentro de la función correspondiente:

```ts
return new LlmAgent({
  ...settings,
  name: 'strategist',
  description: 'Propone tres ángulos a partir de los hechos del brief.',
  instruction: strategistInstruction(),
  tools: [],
});
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 2
```

Resultado esperado: Un agente llamado strategist y una estrategia con tres ángulos.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
