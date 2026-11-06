# 3 Registrar y llamar una tool

Objetivo: exponer una función al modelo y observar el recorrido llamada → ejecución → resultado. Requisito: módulo 2.

Una función TypeScript tiene código ejecutable. Una `FunctionTool` agrega el nombre, la descripción y el esquema de argumentos que ADK entrega al modelo. Registrarla en `tools` permite que el agente solicite su ejecución. El modelo propone los argumentos; ADK valida el esquema y ejecuta la función.

Abre `workshop/exercises/03-tools.ts`. Lee `imageParameters`: los campos y sus descripciones explican qué debe entregar el modelo. Completa el TODO 3.1 para crear la herramienta y el TODO 3.2 para conectarla al Diseñador.

En este primer ejercicio `execute` devuelve un resultado técnico fijo. Es deliberado: permite aprender el protocolo antes de generar una imagen. En el módulo 5 se conecta la misma herramienta con Gemini y el almacenamiento.

Observa dos líneas en la terminal: `→ llamada generate_campaign_image` con `pieceId`, `prompt` y `altText`, y `← resultado generate_campaign_image` con `status: saved`. En modo offline la respuesta del modelo que solicita esa tool también está preparada; ADK sí ejecuta tu función.

Error frecuente: crear la herramienta y olvidar incluirla en `tools`. Otra comprobación rechaza un `pieceId` inexistente mediante el esquema preparado.
