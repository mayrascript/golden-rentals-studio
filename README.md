# Golden Rentals · Workshop de agentes con TypeScript

Construye un estudio creativo con Google ADK y Gemini: un Estratega, un Redactor con una skill, un Diseñador que llama una herramienta y un Editor. El resultado es una campaña ficticia con tres publicaciones, imágenes, revisión humana, calendario y descarga.

## Elige tu versión

| Carpeta | Para qué sirve | Estado inicial | Puerto |
| --- | --- | --- | --- |
| [starter](starter/) | Seguir el taller paso a paso | 14 TODO comentados para completar | 4319 |
| [solution](solution/) | Consultar la solución explicada | 14 pasos resueltos y conectados a la web | 4320 |
| [final](final/) | Ejecutar o explorar el MVP completo | Aplicación terminada de referencia | 4317 |

Cada carpeta es una aplicación independiente. Instala las dependencias y ejecuta los comandos dentro de la versión elegida. Los cambios en `starter` no se copian automáticamente a las otras versiones.

## Comenzar el taller

Requisitos: Git, Node.js 24.13 o posterior y pnpm 11.25.0. Si falta pnpm, instala `npm install --global pnpm@11.25.0`.

```sh
git clone https://github.com/mayrascript/golden-rentals-workshop.git
cd golden-rentals-workshop/starter
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4319. La demo funciona en modo simulado sin API key ni consumo de IA.

Sigue [la guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) o [la guía en el repositorio](starter/workshop/guide/README.md). Descomenta o pega los bloques de cada TODO y elimina su llamada `pending('ID')`. Los comentarios explican el propósito, las entradas, las salidas y el resultado esperado. Comprueba cada módulo con `pnpm workshop:check 2` hasta `7`.

## Tu configuración

Cada versión incluye `.env.example`. Duplica esa plantilla como `.env` dentro de la carpeta elegida. `GOOGLE_GENAI_API_KEY` está vacío: cada participante usa su propia clave de Google AI Studio. Mantén `GENERATION_MODE=simulated` durante los ejercicios.

Los modelos se configuran con `TEXT_MODEL` e `IMAGE_MODEL`; el puerto con `PORT`. Comprueba el acceso a los modelos de tu cuenta antes de activar `real`. Las imágenes reales se generan con IA a partir de un prompt fotográfico y representan alojamientos ficticios.

`.env`, sus variantes, campañas y registros locales están excluidos de Git. Las pruebas offline no envían solicitudes a Gemini. El [laboratorio opcional](starter/workshop/guide/laboratorio.md) explica la prueba real y su presupuesto; su tope no se aplica a la interfaz web.

## Recorrido

1. Entorno y configuración personal.
2. Instrucciones y primer agente.
3. Definición, registro y llamada de una tool.
4. Skill y lectura de sus recursos.
5. Generación, extracción y guardado de imágenes.
6. Editor y validación de respuestas con Zod.
7. Equipo de agentes y paso de contexto.
8. Campaña completa y revisión humana.

La interfaz no publica en redes sociales. MCP, A2A y despliegue quedan como extensiones; no forman parte de los ejercicios implementados.

## Comprobar

En `solution`: `pnpm workshop:check all`, `pnpm typecheck`, `pnpm test` y `pnpm build`. En `starter`, las comprobaciones del agente y del equipo fallan mientras sus TODO sigan pendientes; la demo simulada y la compilación funcionan desde el inicio. Consulta [la validación](final/docs/validation.md) y [la guía de facilitación](starter/workshop/guide/facilitadora.md).

## Créditos

Adaptación educativa en TypeScript de [Build a Multi-Agent Creative Studio with Google's Agent Stack](https://codelabs.developers.google.com/ai-creative-studio-adk-a2a), de Saoussen Chaabnia y Mete Atamel. [Código Python original](https://github.com/Saoussen-CH/mas-a2a-gcp). Licencia Apache 2.0: [LICENSE](LICENSE) y [NOTICE](NOTICE).
