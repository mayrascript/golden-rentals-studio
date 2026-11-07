# 1 Preparación y primera campaña

Objetivo: ejecutar el recorrido completo antes de modificar agentes. Necesitas Node.js y pnpm indicados en el README; no necesitas una cuenta de Google para la simulación.

Antes de continuar, completa [los requisitos iniciales y la instalación de Node.js, npm y pnpm](../../workshop/guide/01-preparacion.md). npm se instala junto con Node.js; el workshop usa pnpm 11.25.0.

## Pasos

1. Abre una terminal en la carpeta que contiene [package.json](../../package.json).
2. Ejecuta `pnpm install --frozen-lockfile` y después `pnpm dev`.
3. Abre la dirección local impresa. Conserva la marca Golden Rentals y revisa el aviso de ejemplo educativo.
4. Pulsa Crear mi campaña. Observa las cuatro etapas y las tres ilustraciones identificadas como simuladas.
5. Abre el calendario. Comprueba que hay tres fechas dentro de siete días y una zona horaria explícita.

La simulación usa [SimulatedProvider](../../packages/providers/simulated.ts). Sus textos son plantillas y sus imágenes son SVG generados por código. No representa respuestas de un modelo.

## Checkpoint

Ejecuta `pnpm demo:validate`. Debe confirmar tres piezas, tres imágenes, calendario, aprobación y ZIP, sin llamadas externas. El código de la comprobación está en [validate-demo.ts](../../scripts/validate-demo.ts).

Si el servidor no arranca, revisa Node.js y el puerto. Si ves un error de credenciales, comprueba que `GENERATION_MODE` esté en `simulated`. Configura tus propios valores en `.env` cuando actives el modo real.
