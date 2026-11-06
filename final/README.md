# Golden Rentals Content Studio

[Guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) · [Elegir otra versión](../README.md)

Aplicación local para practicar un equipo creativo de cuatro agentes con TypeScript y Google ADK. Permite personalizar una marca, preparar tres publicaciones con imágenes, editar su contenido, revisar un calendario de siete días, aprobar una versión y descargarla.

Golden Rentals es un ejemplo ficticio. La aplicación no publica en Instagram ni hace reservas. El modo inicial es **simulado**: funciona sin claves y no llama a proveedores de IA.

Las imágenes de práctica son seis composiciones prediseñadas que usan la paleta de la marca: tres iniciales distintas y una alternativa nueva por cada regeneración permitida. No interpretan instrucciones visuales libres. Para imágenes generadas a partir del concepto de cada publicación, configura el modo real. Las campañas guardadas conservan sus archivos; para probar cambios del simulador, crea una campaña nueva o usa «Otra imagen» si quedan regeneraciones.

## Empezar

Requisitos: Node.js 24.13 o posterior y pnpm 11.25.0. La combinación usada durante la preparación es Node.js 24.22.1 y pnpm 11.25.0. Instala pnpm con `npm install --global pnpm@11.25.0` si aún no lo tienes; esa instalación es una acción manual en tu equipo.

Desde esta carpeta:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre **http://127.0.0.1:4317**. Usa Golden Rentals o cambia la marca, y pulsa **Crear mi campaña**. Revisa las tres piezas, edita un texto y pasa al calendario. Puedes descargar un borrador o aprobar las tres piezas y luego la campaña.

No necesitas crear `.env` para la demo. Los datos se guardan en `.data/` dentro de esta carpeta. Detén el servidor con Ctrl+C. El brief se conserva en el navegador y las campañas se conservan en el servidor local.

## Recorrido del workshop

Comienza por el [mapa del codelab](docs/codelab-map.md) y sigue el [codelab guiado en español](workshop/guide/README.md). El [informe de validación](docs/validation.md) distingue lo comprobado de lo pendiente.

| Componente | Ubicación |
| --- | --- |
| Interfaz React | `apps/web/src/` |
| API y servidor local | `apps/server/src/api/` e `index.ts` |
| Cuatro agentes ADK | `apps/server/src/agents/team.ts` |
| Orquestador y reglas | `apps/server/src/workflow/` |
| Contratos compartidos | `packages/contracts/` |
| Proveedor simulado y real | `packages/providers/` |
| Archivos y campañas | `packages/storage/` |
| Caso ficticio | `examples/golden-rentals/brand.json` |
| Skill del redactor | `skills/instagram-copy/` |
| Pruebas | `tests/` |

El código Python original está en [el repositorio de referencia](https://github.com/Saoussen-CH/mas-a2a-gcp). Esta carpeta contiene el MVP completo en TypeScript.

## Comprobaciones

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm demo:validate
pnpm adk:validate
pnpm build
pnpm start
```

`adk:validate` instancia los cuatro agentes, carga la skill y registra la herramienta sin invocar modelos. `demo:validate` recorre generación simulada, aprobación y exportación en una carpeta temporal.

Para pruebas de navegador:

```sh
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

La descarga del navegador solo se necesita una vez. También puedes indicar un navegador Chromium instalado mediante `PLAYWRIGHT_EXECUTABLE_PATH`. Las pruebas usan el puerto 4318 y datos temporales propios.

## Activar el proveedor real

Los modelos elegidos son **Gemini 3.8 Flash** (`gemini-3.8-flash`) para los cuatro agentes y **Gemini 3.1 Flash Image / Nano Banana 2** (`gemini-3.1-flash-image`) para las imágenes. La plantilla `.env.example` ya contiene ambos identificadores y mantiene `GENERATION_MODE=simulated`.

Copia `.env.example` a `.env` si todavía no existe; conserva una configuración local existente. Antes de activar el modo real, añade `GOOGLE_GENAI_API_KEY` solo en `.env`, comprueba el acceso de tu cuenta a ambos modelos y acuerda el presupuesto de prueba. Después cambia `GENERATION_MODE=real` y reinicia el servidor. La clave nunca se pega en el chat ni en la interfaz. Preparar estos valores no ejecuta llamadas reales por sí solo.

Flash 3.8 usa razonamiento `LOW` y no recibe `temperature`, `topP` ni `topK`. Las imágenes se solicitan en formato cuadrado y resolución `1K`. Se desactivan las continuaciones automáticas del SDK para que cada nueva petición pase por los límites de la aplicación. Estas opciones se comprueban sin red; la disponibilidad y calidad requieren la primera campaña real. Consulta la [guía oficial de Flash 3.8](https://ai.google.dev/gemini-api/docs/latest-model) y la [guía de imágenes](https://ai.google.dev/gemini-api/docs/image-generation).

`pnpm gemini:check` consulta los metadatos de los dos modelos, sin generar contenido ni mostrar la clave. Cada solicitud de generación tiene un máximo de 4096 tokens de salida.

Para una prueba real explícitamente autorizada: `pnpm real:validate --allow-paid-generation --budget-usd=10`. El importe es un ejemplo: utiliza solo el presupuesto autorizado. El script genera una campaña ficticia y exporta un borrador sin aprobarlo. Antes de cada llamada reserva una estimación conservadora, con tarifas y margen documentados en el script; persiste las reservas entre intentos en `.data/paid-test-ledger.json` y se detiene si la siguiente excedería el presupuesto. Puede continuar una campaña interrumpida con `--resume=ID`. La reserva no es el cargo real de Google. Este control corresponde al script de prueba; la interfaz conserva límites por campaña, sin un tope monetario global.

El modo real usa cuatro `LlmAgent`: Estratega, Redactor, Diseñador y Editor. El Redactor dispone de una skill local; el Diseñador llama a una herramienta que guarda ilustraciones generadas. El servidor decide orden, validación, límites y aprobación. Una regeneración reutiliza el concepto visual y ejecuta la misma función de generación de forma controlada.

Límites por campaña: tres imágenes iniciales, tres regeneraciones, una ronda de revisión textual (automática o solicitada) y doce llamadas de modelo, incluidas las de imágenes. Los intentos fallidos también pueden consumir presupuesto. Si falta configuración, el servidor informa el error; no cambia silenciosamente al modo simulado. No se incluye una estimación monetaria sin tarifas verificadas.

La validación factual combina referencias a hechos, comprobaciones de términos sensibles y revisión textual del Editor en modo real. No verifica exhaustivamente todas las afirmaciones ni sustituye la revisión humana. Las imágenes siempre requieren revisión visual humana.

## Preparar una descarga

```sh
pnpm package
```

Genera `release/golden-rentals-workshop.zip` con fuentes, lockfile, tutorial, datos ficticios, licencia y pruebas. Excluye dependencias instaladas, `.env`, campañas locales y archivos temporales. El ZIP de una campaña se descarga desde la interfaz y es diferente del ZIP del proyecto.

## Resolver problemas

- **No se encuentra node o pnpm:** instala los requisitos y vuelve a abrir la terminal. Vuelve a comprobar las versiones después de instalar.
- **Puerto ocupado:** cambia `PORT` en `.env`; abre la dirección que imprima el servidor.
- **Campaña interrumpida:** abre la campaña guardada y pulsa Continuar. Conserva pasos terminados; una llamada externa en curso puede haber tenido costo antes de la interrupción.
- **Límite alcanzado:** revisa y descarga lo ya generado. No hay reintentos ilimitados.
- **Una pieza cambió:** recarga antes de editar o aprobar. La aplicación rechaza guardar sobre una versión más reciente.
- **Cambio entre real y simulado:** las campañas conservan el modo con el que nacieron. Vuelve al modo correspondiente para regenerarlas, o crea una nueva.

## Referencia y licencia

Adaptación pedagógica del codelab de Saoussen Chaabnia y Mete Atamel. Consulta [NOTICE](NOTICE) y [LICENSE](LICENSE). Los activos simulados son ilustraciones originales generadas por código bajo la misma licencia; no son fotos de alojamientos reales.


## Edición del participante y solución comentada

El [codelab guiado en TypeScript](workshop/guide/README.md) organiza 14 TODO de código en seis módulos, además de preparación y campaña final. Cada TODO explica qué hace, qué recibe y qué devuelve, y trae el bloque para descomentar o pegar.

`workshop/exercises/` contiene el starter; `workshop/solution/` la solución comentada. La aplicación de referencia de esta carpeta conserva sus agentes originales. Las carpetas hermanas `starter/` y `solution/` conectan la web con los ejercicios para que completar el código cambie el comportamiento real. Los comandos de laboratorio de esta carpeta sirven para preparar el material; para realizar el taller, trabaja en `../starter/`.

- `pnpm workshop:check 2`: comprueba el ejercicio 2 con respuestas HTTP locales; un TODO pendiente devuelve su ID.
- `pnpm workshop:check all --solution`: comprueba la referencia completa sin inferencia.
- `pnpm package:workshop`: produce `release/golden-rentals-participant.zip` y `release/golden-rentals-solution.zip`, con interfaz, dependencias declaradas, guía y pruebas. El modo inicial es simulado y no se incluyen claves ni campañas.

La [guía de facilitación](workshop/guide/facilitadora.md) describe el recorrido y la recuperación por etapa. El ensayo con participantes y la medición de duración siguen pendientes.
