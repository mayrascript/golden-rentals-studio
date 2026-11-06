# 7 Revisión humana y descarga

Objetivo: practicar edición, aprobación y exportación de una versión concreta. Parte de una campaña simulada completa.

## Pasos

1. Revisa texto, imagen, descripción y hechos de cada tarjeta. Pulsa «He revisado el texto y la imagen» en las tres piezas.
2. Abre el calendario. Cambia una fecha dentro de los siete días y guarda.
3. Introduce una etiqueta de revisor y aprueba la campaña. Esa etiqueta no es una identidad autenticada.
4. Descarga el ZIP. Abre `copies.md`, `calendar.csv`, `campaign.json`, `manifest.json` y la carpeta de imágenes.
5. Vuelve a una pieza, cambia una frase y guarda. Comprueba que la aprobación de esa pieza y la global se invalidan.
6. Descarga un borrador y verifica su estado `DRAFT`. La descarga no publica contenido.

Lee [export.ts](../../apps/server/src/api/export.ts) para entender el manifiesto y las sumas de verificación. El CSV escapa comillas y neutraliza valores que podrían interpretarse como fórmulas.

## Checkpoint

Ejecuta `pnpm demo:validate` y `pnpm test`. Las pruebas cubren versiones obsoletas, aprobación, exportación y cambios de calendario. Las pruebas de [interfaz](../../tests/e2e/workshop.spec.ts) recorren el mismo flujo en navegador.

Error frecuente: intentar aprobar una versión que cambió en otra pestaña. La aplicación rechaza esa aprobación; recarga y revisa la versión actual.
