# Golden Rentals · Paso a paso del participante

Estás en la rama **starter**. La interfaz y el backend están preparados; completa los 14 bloques de agentes, tools, skills, imágenes, validación y coordinación. Cada TODO incluye el código para descomentar o pegar y comentarios sobre su propósito, entradas y salidas.

[Guía web con menú lateral](https://mayrascript.github.io/golden-rentals-workshop/) · [Guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) · [Codelab en el repositorio](workshop/guide/README.md)

## Las dos ramas

| Rama | Contenido | Puerto predeterminado |
| --- | --- | --- |
| [main](https://github.com/mayrascript/golden-rentals-workshop/tree/main) | Solución completa, activa y con comentarios explicativos | 4317 |
| [starter](https://github.com/mayrascript/golden-rentals-workshop/tree/starter) | Paso a paso con 14 bloques pendientes | 4319 |

Starter nace de main. Ambas ramas tienen el proyecto directamente en la raíz. No necesitas entrar en una subcarpeta de versión.

## Empezar

Requisitos: Node.js 24.13 o posterior y pnpm 11.25.0. Si falta pnpm, instala `npm install --global pnpm@11.25.0`.

```sh
git clone --branch starter https://github.com/mayrascript/golden-rentals-workshop.git golden-rentals-workshop
cd golden-rentals-workshop
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4319. La demo simulada funciona desde el inicio, sin clave ni consumo de IA.

## Completar los ejercicios

1. Sigue [la preparación](workshop/guide/01-preparacion.md) y luego los módulos del codelab.
2. Abre el archivo indicado en `workshop/exercises/`.
3. Lee los comentarios, descomenta o pega el bloque y elimina su llamada `pending('ID')`.
4. Ejecuta `pnpm workshop:check 2` hasta `7` conforme avances. Un TODO pendiente devuelve su ID.
5. Al terminar, ejecuta `pnpm workshop:check all`, `pnpm typecheck`, `pnpm test` y `pnpm build`.

Las comprobaciones por módulo usan ADK y respuestas HTTP locales. La demo simulada, la comprobación de tipos y la compilación funcionan antes de completar los TODO; la prueba del equipo completo y el modo real requieren terminarlos. La solución de consulta está en main y también en `workshop/solution/`.

## Tu configuración

Duplica `.env.example` como `.env`. La clave está vacía para que uses tu propia cuenta. Mantén `GENERATION_MODE=simulated` durante la preparación. El [laboratorio](workshop/guide/laboratorio.md) explica cómo probar un agente real de forma explícita y con presupuesto. Su tope no se aplica a la interfaz web.

Los archivos de configuración personal, campañas y registros locales están excluidos de Git. Para consultar main sin modificar tus ejercicios, clónala en otra carpeta como se indica en la preparación.

Consulta [la validación](docs/validation.md) y [la guía de facilitación](workshop/guide/facilitadora.md). Los alojamientos son ficticios; las imágenes reales son generadas con IA y requieren revisión humana. La aplicación no publica en redes sociales.

## Créditos

Adaptación educativa en TypeScript del [codelab de Saoussen Chaabnia y Mete Atamel](https://codelabs.developers.google.com/ai-creative-studio-adk-a2a). [Código Python original](https://github.com/Saoussen-CH/mas-a2a-gcp). Licencia Apache 2.0: [LICENSE](LICENSE) y [NOTICE](NOTICE).

## Guía web del workshop

La [guía navegable](https://mayrascript.github.io/golden-rentals-workshop/) incluye menú lateral, navegación entre pasos, copia de código y progreso guardado en el navegador. Para mantenerla o abrirla localmente, consulta [guide-site.md](docs/guide-site.md).
