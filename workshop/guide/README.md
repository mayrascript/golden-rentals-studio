# Tu próximo equipo no es humano: workshop de orquestación de agentes con Google ADK

[Abrir la guía web con menú lateral](https://mayrascript.github.io/multiagent-adk-workshop/) · [Seguir este recorrido en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55)

Construye cuatro agentes con Google ADK y conecta sus resultados con una aplicación de contenido. La interfaz, la API, el guardado y los límites están preparados. Trabajarás en archivos pequeños con TODO numerados, comentarios explicativos y bloques para descomentar o pegar.

El caso práctico es **Golden Rentals**, una marca ficticia de alojamientos. El nombre del taller es **Tu próximo equipo no es humano**: lo que aprenderás se puede aplicar a otras marcas y equipos de agentes.

## Requisitos iniciales

Antes de empezar, instala **Node.js 24 LTS** (24.13.0 o posterior), **npm** (incluido con Node.js) **pnpm 11.25.0** y **Git**. Necesitarás una terminal, un editor de código y conexión a Internet para la instalación.

Sigue [la verificación e instalación de Node.js, npm, pnpm y Git](01-preparacion.md), con instrucciones para Windows, macOS y Linux, comprobación de versiones y soluciones a errores frecuentes. Puedes realizar la preparación y la demo sin una API key de Gemini.

## Los agentes que construirás

![Los cuatro especialistas del equipo: Estratega con brújula, Redactor con manual, Diseñador con herramientas y Editor con lupa.](../assets/agent-avatars.png)

Un agente combina un modelo, instrucciones y herramientas disponibles para una responsabilidad concreta. En el modo real de este proyecto, el backend ejecuta cada agente con ADK y le entrega el contexto que necesita.

| Agente | Rol | Qué recibe | Qué produce |
| --- | --- | --- | --- |
| **Estratega de marca** | Propone una dirección creativa usando los hechos del brief. | Marca, audiencia, objetivo y hechos disponibles. | Una estrategia y tres ángulos de contenido. |
| **Redactor creativo** | Redacta publicaciones y consulta la skill de Instagram y sus recursos. | Brief, estrategia e instrucciones de la skill. | Tres textos con gancho, cuerpo, CTA, hashtags y referencias a los hechos. |
| **Diseñador** | Crea conceptos visuales y solicita imágenes fotorrealistas mediante una tool. | Brief, estrategia y textos de cada pieza. | Prompts, texto alternativo e imágenes generadas con Gemini y guardadas localmente. |
| **Editor** | Revisa coherencia, hechos y textos; propone un calendario. | Brief, estrategia y piezas actuales. | Revisión textual con `APPROVED` o `NEEDS_REVISION`, observaciones y tres fechas dentro de siete días. |

El **workflow del backend** coordina el orden, pasa el contexto y aplica límites. Es código TypeScript; no es un quinto agente. La persona revisa las imágenes y aprueba la campaña. El Editor no inspecciona píxeles y su `APPROVED` no sustituye esa aprobación humana.

> [!NOTE]
> **Piensa en un equipo creativo:** cada avatar representa una responsabilidad. El manual del Redactor es una skill; la caja del Diseñador contiene tools. El workflow entrega el encargo al siguiente especialista y tú revisas el resultado.

## Así se conecta el equipo

![El participante usa React para enviar un brief al workflow local. El servidor TypeScript coordina cuatro agentes ADK: Estratega, Redactor con una skill, Diseñador con una tool de imágenes y Editor. En modo real, los cuatro usan el modelo de texto de Gemini; la tool usa el modelo de imágenes y guarda archivos localmente.](../assets/workshop-architecture.png)

<details>
<summary>Leer el diagrama paso a paso</summary>

Lee el diagrama de izquierda a derecha:

1. **Participante e interfaz:** introduces el brief y después revisas, editas y descargas la campaña.
2. **Workflow TypeScript:** ejecuta estrategia → textos → imágenes → revisión y calendario. También controla el guardado, la cancelación y los límites de ejecución.
3. **Cuatro agentes ADK:** cada uno recibe instrucciones y contexto explícito. El Redactor consulta la skill; el Diseñador solicita la tool de imágenes.
4. **Modelos y archivos:** en modo real, los cuatro agentes llaman a Gemini para texto y la tool llama al modelo de imágenes. Las campañas y las imágenes se guardan en tu computadora. En modo simulado, la demo usa resultados preparados sin contactar a Gemini.

La flecha discontinua hacia el modelo de texto representa al conjunto de los cuatro agentes. El diagrama muestra componentes y conexiones; el orden y las posibles revisiones los decide el workflow.

</details>

<details>
<summary>Diccionario rápido: ADK, tools, skills, MCP y A2A</summary>

## ADK, tools, skills, MCP y A2A

| Concepto | Para qué sirve | Dónde lo verás |
| --- | --- | --- |
| **Google ADK** | Framework para definir y ejecutar agentes, gestionar sesiones y conectar sus herramientas. | Construyes un `LlmAgent` en el paso 2 y lo ejecutas con un `Runner`. |
| **Tool** | Función con nombre, descripción y argumentos que el modelo puede solicitar ejecutar. | El Diseñador llama a `generate_campaign_image` en los pasos 3 y 5. |
| **Skill** | Instrucciones y recursos reutilizables que se cargan cuando hacen falta. | El Redactor consulta `SKILL.md` y sus referencias en el paso 4. |
| **MCP** | Protocolo para conectar aplicaciones de IA con herramientas y datos ofrecidos por servidores externos. | Extensión conceptual: consultar o guardar tareas en Notion mediante un servidor MCP. |
| **A2A** | Protocolo para que agentes independientes anuncien sus capacidades e intercambien trabajo y resultados. | Extensión conceptual: delegar una tarea en un especialista que corre como servicio separado. |

MCP y A2A son complementarios. Registrar una función local como tool no implica usar MCP; ejecutar varios agentes dentro del mismo proceso no implica usar A2A. Esta edición implementa ADK, tools, skills y orquestación local. Las conexiones A2A, MCP y el despliegue en Cloud Run quedan como posibles ampliaciones.

Consulta las fuentes: [ADK](https://adk.dev/), [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) y [A2A](https://a2a-protocol.org/latest/topics/what-is-a2a/).

</details>

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
