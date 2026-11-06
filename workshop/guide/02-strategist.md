# 2 Configurar y probar un agente

Objetivo: construir un `LlmAgent` y distinguir definirlo de ejecutarlo. Requisito: completar la preparación.

## Antes del código: qué hace Google ADK

**Agent Development Kit (ADK)** es el framework que usamos para definir y ejecutar los agentes. Gemini es el modelo que genera las respuestas; ADK conecta ese modelo con instrucciones, herramientas, sesiones y el ciclo de ejecución. En este taller usamos su SDK de TypeScript, `@google/adk`.

| Pieza | Qué significa en este ejercicio |
| --- | --- |
| `LlmAgent` | La definición del Estratega: su nombre, modelo, instrucciones y herramientas disponibles. |
| `name` | Identificador del agente, por ejemplo `strategist`. |
| `model` | Modelo configurado en el servidor que atenderá las solicitudes. |
| `instruction` | Instrucciones de sistema: qué debe hacer y qué límites debe respetar. |
| `description` | Resumen de su responsabilidad. |
| `tools` | Herramientas disponibles. El Estratega empieza con una lista vacía. |
| `Runner` y sesión | Ejecutan al agente con un mensaje y organizan los eventos y el contexto de esa ejecución. |

El recorrido es **mensaje → Runner → modelo → respuesta**. Cuando hay tools, el modelo puede solicitar una llamada, ADK ejecuta la función y devuelve su resultado al modelo. Una herramienta disponible no se ejecuta automáticamente por estar registrada.

En el paso 7 verás cómo el backend construye el contexto para cada especialista. Las sesiones no hacen que dos agentes compartan automáticamente los resultados del otro.

**Comprueba la idea:** si creas `new LlmAgent(...)` sin ejecutarlo, ¿ya consumiste una llamada a Gemini? No: solo has definido el agente. La ejecución ocurre después mediante el Runner.

Documentación: [Google ADK](https://adk.dev/).

## Construye el Estratega

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
