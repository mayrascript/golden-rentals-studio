# 8 Pruebas y cierre

Objetivo: entregar una demo reproducible y describir con precisión qué se comprobó. Necesitas haber recorrido los módulos anteriores.

## Pasos

1. Ejecuta `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm demo:validate` y `pnpm adk:validate`.
2. Ejecuta `pnpm build` y `pnpm start` para comprobar la versión compilada.
3. Instala Chromium para las pruebas con `pnpm exec playwright install chromium`, o indica un ejecutable instalado mediante `PLAYWRIGHT_EXECUTABLE_PATH`. Ejecuta `pnpm test:e2e`.
4. Ejecuta `pnpm package`. Descomprime el ZIP en otra carpeta, instala con el lockfile y vuelve a ejecutar `pnpm demo:validate`.
5. Consulta y actualiza [validation.md](../validation.md) con resultados reales, versiones y limitaciones.
6. Detén el servidor con Ctrl+C. Las campañas personales permanecen en `.data/` y no se incluyen en la descarga del proyecto. Si deseas eliminarlas, hazlo de forma explícita después de guardar lo necesario.

## Checkpoint final

Una instalación limpia debe producir la campaña simulada y su descarga sin claves. El paquete debe contener la skill, los hechos ficticios, el tutorial y las pruebas. El informe debe distinguir pruebas con dobles de proveedor de llamadas reales.

Antes de impartir el workshop, falta ensayar con participantes, medir la duración del taller y ampliar las pruebas reales a fallos y recuperación. Cada participante debe configurar su propia cuenta y presupuesto si activa el modo real. La [edición del participante](../../workshop/guide/README.md) ya incluye ejercicios con código comentado y comprobaciones por módulo. Los checkpoints Git por etapa siguen siendo una posible ampliación.

Preguntas de cierre: ¿qué decide cada agente?, ¿qué impone el workflow?, ¿cómo se comprueba un hecho?, ¿qué invalida una aprobación?, ¿qué demuestra una prueba simulada y qué queda por probar con el proveedor real?
