# 3 Registrar y llamar una tool

> [!TIP]
> **Tu objetivo:** exponer una función al modelo y observar el recorrido llamada → ejecución → resultado. Requisito: módulo 2.

> [!NOTE]
> **La tool es un instrumento de trabajo:** el Diseñador decide qué necesita y pide usarlo. La función ejecuta la acción y devuelve un resultado; no es otro agente.

![El Diseñador recibe un encargo, elige una cámara de su caja de herramientas y obtiene una imagen. La ilustración representa el recorrido llamada, ejecución y resultado de una tool.](../assets/tool-illustration.png)

Una función TypeScript tiene código ejecutable. Una `FunctionTool` agrega el nombre, la descripción y el esquema de argumentos que ADK entrega al modelo. Registrarla en `tools` permite que el agente solicite su ejecución. El modelo propone los argumentos; ADK valida el esquema y ejecuta la función.

Abre `workshop/exercises/03-tools.ts`. Lee `imageParameters`: los campos y sus descripciones explican qué debe entregar el modelo. Completa el TODO 3.1 para crear la herramienta y el TODO 3.2 para conectarla al Diseñador.

En este primer ejercicio `execute` devuelve un resultado técnico fijo. Es deliberado: permite aprender el protocolo antes de generar una imagen. En el módulo 5 se conecta la misma herramienta con Gemini y el almacenamiento.

Observa dos líneas en la terminal: `→ llamada generate_campaign_image` con `pieceId`, `prompt` y `altText`, y `← resultado generate_campaign_image` con `status: saved`. En modo offline la respuesta del modelo que solicita esa tool también está preparada; ADK sí ejecuta tu función.

> [!WARNING]
> **Error frecuente:** crear la herramienta y olvidar incluirla en `tools`. Otra comprobación rechaza un `pieceId` inexistente mediante el esquema preparado.

## Bloques para completar

Abre `workshop/exercises/03-tools.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 3.1

Pega dentro de la función correspondiente:

```ts
return new FunctionTool({
  name: 'generate_campaign_image',
  description: 'Genera y guarda una imagen fotorrealista de un alojamiento ficticio para una pieza existente. Una llamada por pieza; no documenta una propiedad real.',
  parameters: imageParameters,
  execute,
});
```

### TODO 3.2

Pega dentro de la función correspondiente:

```ts
return new LlmAgent({
  ...settings,
  name: 'designer',
  description: 'Diseña escenas fotográficas y solicita su generación mediante una herramienta.',
  instruction: `${BASE_INSTRUCTION} Crea escenas fotográficas distintas y coherentes con cada pieza, los hechos y la paleta. ${PHOTO_STYLE} Usa generate_campaign_image una vez por cada pieza que no tenga imagen. Entrega un altText que describa la escena y la identifique como imagen generada por IA de un alojamiento ficticio.`,
  tools: [imageTool],
});
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 3
```

> [!IMPORTANT]
> **Resultado esperado:** Una llamada generate_campaign_image, sus argumentos y el resultado devuelto a ADK.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
