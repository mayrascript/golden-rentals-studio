# Tu próximo equipo no es humano: workshop de orquestación de agentes con Google ADK

**Solución completa con comentarios.** Caso práctico: Golden Rentals, una marca ficticia de alojamientos.

Esta es la rama **main**: los 14 pasos están resueltos y activos, con comentarios que explican qué hace cada bloque, qué recibe y qué devuelve. La aplicación usa estas mismas funciones para ejecutar al Estratega, Redactor, Diseñador y Editor.

[Guía web con menú lateral](https://mayrascript.github.io/multiagent-adk-workshop/) · [Guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) · [Guía en el repositorio](workshop/guide/README.md)

## Las dos ramas

| Rama | Contenido | Puerto predeterminado |
| --- | --- | --- |
| [main](https://github.com/mayrascript/multiagent-adk-workshop/tree/main) | Solución completa, funcional y explicada | 4317 |
| [starter](https://github.com/mayrascript/multiagent-adk-workshop/tree/starter) | Interfaz y backend preparados; 14 bloques para descomentar o completar | 4319 |

Cada rama contiene el proyecto directamente en la raíz. Ya no hay carpetas de versiones ni una tercera rama solution. Los comentarios explicativos se conservan tanto en la solución como en los ejercicios.

## Ejecutar esta solución

Requisitos: Node.js 24 LTS (24.13.0 o posterior), npm incluido con Node.js y pnpm 11.25.0. Antes de ejecutar los comandos, sigue [la instalación de Node.js, npm y pnpm](workshop/guide/01-preparacion.md), con instrucciones para Windows, macOS y Linux y comprobación de versiones.

```sh
git clone --branch main https://github.com/mayrascript/multiagent-adk-workshop.git golden-rentals-solution
cd golden-rentals-solution
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4317. La demo inicia en modo simulado, sin clave ni consumo de IA. El código de los agentes está completo; para generar con Gemini configura tu propia cuenta siguiendo la guía.

## Realizar el taller

Clona starter en otra carpeta para conservar tus ejercicios y tu configuración por separado:

```sh
git clone --branch starter https://github.com/mayrascript/multiagent-adk-workshop.git multiagent-adk-workshop
cd multiagent-adk-workshop
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4319 y sigue [la preparación](workshop/guide/01-preparacion.md). En `workshop/exercises/` descomenta o pega cada bloque y elimina su llamada `pending('ID')`. Comprueba los módulos con `pnpm workshop:check 2` hasta `7`. En main los bloques ya están activos.

## Tu configuración

Duplica `.env.example` como `.env` dentro de la carpeta elegida. La clave `GOOGLE_GENAI_API_KEY` está vacía: cada participante usa la suya. `GENERATION_MODE=simulated` permite practicar sin consumo; `real` activa Gemini en la web después de configurar la clave y reiniciar el servidor. También puedes ajustar `TEXT_MODEL`, `IMAGE_MODEL` y `PORT`.

El archivo .env, las campañas y los registros locales están excluidos de Git. El [laboratorio](workshop/guide/laboratorio.md) explica las pruebas reales opcionales y su presupuesto; ese tope no se aplica a la interfaz web.

## Comprobar la solución

```sh
pnpm workshop:check all
pnpm typecheck
pnpm test
pnpm build
```

Las comprobaciones usan respuestas locales, sin inferencia real. En starter, un ejercicio pendiente devuelve su ID y la prueba del equipo completo falla hasta terminar los TODO; la demo simulada, la comprobación de tipos y la compilación funcionan desde el inicio.

Consulta [la validación](docs/validation.md) y [la guía de facilitación](workshop/guide/facilitadora.md). La marca y los alojamientos son ficticios; las imágenes reales son generadas con IA y requieren revisión visual humana. La aplicación no publica en redes sociales.

## Licencia

Consulta [LICENSE](LICENSE) y [NOTICE](NOTICE) para los avisos de licencia.

## Guía web del workshop

La [guía navegable](https://mayrascript.github.io/multiagent-adk-workshop/) incluye menú lateral, navegación entre pasos, copia de código y progreso guardado en el navegador. Para mantenerla o abrirla localmente, consulta [guide-site.md](docs/guide-site.md).

Su identidad visual usa la [skill reutilizable de MayraScript](https://github.com/mayrascript/mayrascript-brand-skill), incluida y consumida desde `.agents/skills/mayrascript-brand/`: isotipo original, IBM Plex Mono y paleta compartida para los temas claro y oscuro.
