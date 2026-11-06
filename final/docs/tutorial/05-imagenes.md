# 5 Diseñador e imágenes

Objetivo: comprender el límite entre un concepto visual y una imagen generada. Parte del contrato de pieza y de los hechos del brief.

## Pasos

1. Localiza `imageParameters` y `generate_campaign_image` en [team.ts](../../apps/server/src/agents/team.ts).
2. Sigue la implementación en [adk.ts](../../packages/providers/adk.ts): valida la pieza, reserva consumo, llama al proveedor y comprueba el formato de imagen.
3. Observa los metadatos: archivo relativo, tipo, dimensiones, versión, modelo, checksum y aviso de imagen generada.
4. Compara con la ilustración SVG de [simulated.ts](../../packages/providers/simulated.ts). Es un activo de prueba original y se identifica como tal.
5. Desde la web genera otra imagen para una sola pieza. Comprueba que las otras se mantienen y que esa pieza vuelve a requerir revisión.

En el flujo real el Diseñador llama a la herramienta. La regeneración explícita reutiliza la escena del concepto guardado y llama a la misma función desde el workflow. La dirección fotográfica central tiene prioridad sobre estilos antiguos de ilustración, también al regenerar campañas existentes. El almacenamiento local reemplaza a Cloud Storage del codelab.

## Checkpoint

Ejecuta `pnpm test`: las pruebas verifican que cambiar una imagen conserva las demás, impide superar tres regeneraciones y mantiene el historial. `pnpm demo:validate` comprueba que los archivos existan.

El modelo seleccionado es `gemini-3.1-flash-image` (Nano Banana 2), con relación `1:1` y resolución `1K`. Para generar se necesita configurar la clave, comprobar acceso al modelo y acordar el presupuesto. El prompt `2-photoreal` solicita fotografía de interiores: luz natural, texturas reales, proporciones plausibles y escenas distintas. Los hechos del brief acompañan cada solicitud. Un prompt o una imagen SVG de prueba nunca se presentan como evidencia de generación real. Aunque tengan apariencia fotográfica, las imágenes representan un alojamiento ficticio y mantienen el aviso visible de generación con IA. Los archivos existentes se conservan hasta que la persona solicite otra imagen.
