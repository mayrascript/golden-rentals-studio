# Guía para la facilitadora

## Preparar la sesión

Comparte la rama starter con el grupo. Conserva una copia de main, la solución completa con comentarios, para demostrar el objetivo y ayudar en un bloqueo. Recorre primero la interfaz y luego abre el TODO 2.1. Los archivos incluyen las explicaciones que se deben leer junto al código.

El grupo debe tener bases de TypeScript, funciones asíncronas y JSON. Comprueba Node y pnpm antes del día del taller. El modo offline evita que una credencial o una cuota bloquee el aprendizaje de tools y skills.

## Facilitar cada módulo

1. Explica el concepto con el caso de Golden Rentals.
2. Identifica el archivo y el TODO exacto.
3. Pide leer entradas y salidas antes de descomentar.
4. Ejecuta la comprobación y observa el resultado con el grupo.
5. Haz la pregunta de comprensión y registra dónde necesitaron ayuda.

| Módulo | Pregunta de comprensión | Señal para avanzar |
| --- | --- | --- |
| 2 | ¿Se llamó a Gemini al crear el objeto? | Identifica definición, sesión y ejecución |
| 3 | ¿Quién propone argumentos y quién ejecuta la función? | Observa llamada y resultado de la tool |
| 4 | ¿Leer SKILL.md desde Node demuestra que el modelo lo consultó? | Observa las dos herramientas de carga |
| 5 | ¿Un prompt o texto en la respuesta equivale a una imagen? | Extrae y guarda los bytes finales |
| 6 | ¿JSON válido significa datos válidos para la aplicación? | Rechaza la respuesta incompleta |
| 7 | ¿Cómo llega la estrategia al Redactor? | Identifica el contexto explícito del workflow |

## Recuperación

Un error `Completa el TODO X` indica qué bloque falta. Si hay un error de TypeScript, comprueba que se eliminó la llamada pending y se descomentó el bloque entero conservando sus llaves. La guía contiene el código para pegar y `workshop/solution/` la referencia completa.

En una prueba offline, un resultado de texto fijo es esperado. En una prueba real, confirma que la persona eligió un presupuesto y que conoce la separación entre laboratorio y web. No distribuyas tu .env ni las campañas personales.

## Ensayo pendiente

Esta edición se valida con pruebas técnicas y recorrido de instalación. Mide por separado el tiempo de instalación, cada módulo y la campaña final con participantes del público objetivo antes de anunciar una duración. Registra también errores frecuentes y gasto observado.

## Mantener el material

Main es la referencia completa y starter nace de main con los 14 bloques desactivados. Mantén alineados los comentarios, los bloques de la guía y los contratos al actualizar los ejercicios. El archivo workshop/source-generator.ts contiene la transformación de solución a código comentado. Comprueba main con los seis módulos y las pruebas de producto; comprueba starter también como proyecto incompleto antes de distribuirlo.

Para distribuir un ZIP de una rama, ejecuta pnpm package desde esa copia. El paquete excluye las credenciales, las campañas guardadas y las dependencias instaladas.
