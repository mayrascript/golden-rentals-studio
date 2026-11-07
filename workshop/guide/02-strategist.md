# 2 Configurar y probar un agente

> [!TIP]
> **Tu objetivo:** construir un `LlmAgent` y distinguir definirlo de ejecutarlo. Requisito: completar la preparación.

## Antes del código: qué hace Google ADK

**ADK conecta un modelo con instrucciones, herramientas y una sesión.** Primero entiende la estructura de cualquier agente; luego la adaptaremos al Estratega.

### Características principales

- **Enfoque modular y de software.** Defines agentes, herramientas y flujos mediante código, con componentes que puedes reutilizar y probar. Hay SDK para **Python, TypeScript, Go, Java y Kotlin**. [Lenguajes y ejemplos oficiales](https://adk.dev/).
- **Flexibilidad de modelos y despliegue.** Puedes usar **Gemini** u otros modelos mediante las integraciones compatibles, como **LiteLLM en ADK Python** o modelos disponibles en Vertex AI. Puedes ejecutar los agentes en local, empaquetarlos con **Docker** y desplegarlos en **Cloud Run o GKE**. [Modelos](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/) · [Despliegue](https://adk.dev/deploy/).
- **Orquestación y flujos de trabajo.** Combina especialistas en secuencia, en paralelo o en bucle. También admite delegación y enrutamiento dinámico mediante un LLM. [Orquestación en ADK](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/).
- **Herramientas y MCP.** Conecta funciones propias, búsqueda web, ejecución de código y herramientas o fuentes de datos externas mediante **Model Context Protocol (MCP)**, según el SDK y el modelo utilizados. [Herramientas MCP](https://adk.dev/tools-custom/mcp-tools/).
- **Pruebas y depuración local.** La CLI y la **Web UI** permiten conversar con los agentes e inspeccionar eventos, llamadas a herramientas, estado y trazas de ejecución. Encontrarás comandos como `adk run` y `adk web`; la forma de invocarlos depende del SDK. [Interfaz web de ADK](https://adk.dev/runtime/web-interface/).

> [!TIP]
> **Pruébalo en este workshop:** usamos TypeScript y Gemini. El [laboratorio con ADK Web](laboratorio.md) explica cómo iniciar `pnpm workshop:web`, abrir **http://127.0.0.1:8000** y conversar con cada especialista por separado.

<details>
<summary>Qué capacidades usamos aquí y cuáles puedes explorar después</summary>

En este taller defines cuatro agentes con `LlmAgent`, conectas una tool y una skill, y ejecutas un workflow coordinado por código TypeScript. La persona revisa las imágenes y aprueba la campaña: participa en el proceso como **human in the loop**.

Los agentes de flujo de ADK, la delegación dinámica, MCP y el despliegue en la nube son posibilidades del framework que puedes explorar después. El workflow de este proyecto fija el orden en código; no usa `SequentialAgent`, `ParallelAgent` ni `LoopAgent`.

Las capacidades no son idénticas en todos los lenguajes. Por ejemplo, el [conector LiteLLM documentado por ADK](https://adk.dev/agents/models/litellm/) corresponde a Python; este proyecto TypeScript conecta directamente con Gemini. Revisa siempre la compatibilidad del SDK que uses.

</details>

### La ficha de un agente, sin un caso de negocio

```ts
import { LlmAgent } from '@google/adk';

export const rootAgent = new LlmAgent({
  name: 'asistente',
  model: process.env.TEXT_MODEL!,
  description: 'Explica conceptos al usuario con ejemplos breves.',
  instruction: 'Explica el concepto solicitado en español. Usa un ejemplo y señala lo que no sabes.',
  tools: [],
});
```

Este ejemplo muestra la definición. Para ejecutarlo necesitas un modelo válido en `TEXT_MODEL`, una credencial configurada y un Runner o ADK Web. El signo `!` de TypeScript no valida una variable de entorno: en el proyecto, la configuración se comprueba antes de ejecutar.

| Parámetro | Analogía | ¿Es obligatorio en ADK TypeScript 2.4? | Qué debes decidir |
| --- | --- | --- | --- |
| `name` | Credencial del especialista | **Sí** | Identificador válido, único en el árbol de agentes; no uses `user`. |
| `model` | Motor con el que piensa | **Necesario al ejecutar**, aquí lo configuramos explícitamente | Puede omitirse al construir y resolverse por herencia o configuración admitida por ADK. Un agente independiente necesita un modelo resuelto. |
| `description` | Cargo en el directorio del equipo | Opcional; muy útil para delegar | Una frase que permita decidir cuándo llamar a este especialista. |
| `instruction` | Encargo y reglas de trabajo | Opcional en la API; **necesario para orientar este taller** | Rol, tarea, límites, formato esperado y uso de herramientas. |
| `tools` | Caja de herramientas | Opcional; por defecto vacía | Funciones o toolsets que podrá solicitar. Registrarlas no las ejecuta. |
| `generateContentConfig` | Ajustes de trabajo | Opcional | Límites de salida y opciones compatibles con el modelo. |
| Callbacks | Controles antes y después | Opcionales | Registrar consumo, comprobar límites o revisar resultados. |

> [!IMPORTANT]
> **Definir no es ejecutar.** `new LlmAgent(...)` crea la ficha del agente. El Runner y la sesión permiten enviar un mensaje y recibir su respuesta; no son parámetros obligatorios de esa ficha.

### De mensaje a resultado

**Tu mensaje → Runner + sesión → agente y modelo → respuesta.**

Si el modelo necesita una herramienta: **solicita la tool → ADK ejecuta la función → el resultado vuelve al modelo**. Las skills aportan instrucciones y recursos mediante un `SkillToolset`; no existe un parámetro `skills` en este ejemplo.

<details>
<summary>Qué va en description y qué va en instruction</summary>

`description` resume la responsabilidad del agente en una frase. `instruction` desarrolla el encargo: incluye especialidad, restricciones, pasos y formato de salida.

La diferencia no es la longitud, sino la función: `description` permite identificar al especialista y `instruction` guía su trabajo. En un sistema con delegación, otro agente puede leer esa descripción para seleccionar a quién llamar. En este proyecto el workflow fija el orden, así que la descripción no decide el enrutamiento.

El Estratega de este workshop trabaja con los hechos del brief, usa TypeScript y configura `tools: []`. Su descripción resume esa responsabilidad y sus instrucciones especifican cómo producir la estrategia.

</details>

### Ahora sí: la ficha del Estratega

| Ficha genérica | En este workshop | Por qué |
| --- | --- | --- |
| Identidad: `name` | `strategist` | El workflow identifica a este especialista. |
| Motor: `model` | Viene de `...settings` | Comparte configuración y límites preparados. |
| Cargo: `description` | Propone tres ángulos a partir de los hechos del brief. | Resume su responsabilidad. |
| Encargo: `instruction` | `BASE_INSTRUCTION` + estrategia breve + tres ángulos | Combina reglas comunes con su tarea específica. |
| Herramientas: `tools` | `[]` | Trabaja con información aportada, sin buscar en Internet. |

> [!TIP]
> Lee `BASE_INSTRUCTION` en `workshop/support.ts`: ahí están las reglas sobre datos ficticios, hechos permitidos, secretos y formato JSON. El texto corto del TODO se suma a esas reglas.

Documentación: [primer agente en TypeScript](https://adk.dev/get-started/typescript/) y [agentes LLM](https://adk.dev/agents/llm-agents/). La obligatoriedad anterior se contrastó con los tipos de `@google/adk` 2.4.0 instalados en este proyecto.

## Construye el Estratega

En este taller configuramos un modelo, un nombre y unas instrucciones. La descripción resume su responsabilidad. El `Runner` crea una sesión, envía el brief y recoge la respuesta. Crear el objeto del agente no envía solicitudes al proveedor.

Abre `workshop/exercises/02-strategist.ts` y lee los comentarios de los TODO 2.1 y 2.2. Completa primero la instrucción y luego el agente. El laboratorio aportará un brief ficticio; el código de la sesión ya está preparado en `workshop/lab.ts`.

Después de comprobar el bloque base, cambia la instrucción para pedir tres ángulos más distintos. El laboratorio offline verifica la conexión y el contrato con respuestas fijas. Para evaluar el efecto de tu nueva instrucción necesitas una ejecución real.

> [!WARNING]
> **Error frecuente:** confundir `description` con `instruction`. La primera describe la responsabilidad del agente; la segunda orienta lo que el modelo debe hacer.

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

> [!IMPORTANT]
> **Resultado esperado:** Un agente llamado strategist y una estrategia con tres ángulos.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

## Prueba con tus propias instrucciones

Abre el [laboratorio con ADK Web](laboratorio.md), selecciona **strategist** y envía el prompt de ejemplo. Modifica la instrucción, reinicia el laboratorio y compara en una sesión nueva. Esta práctica real es opcional: requiere tu credencial y consume API.

[Volver al recorrido](README.md)
