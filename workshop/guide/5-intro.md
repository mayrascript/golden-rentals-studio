# 5 Generar, extraer y guardar una imagen

Objetivo: completar la función que conecta el Diseñador con el modelo de imágenes. Requisitos: módulos 2 y 3.

El agente de texto elabora el concepto y llama a `generate_campaign_image`. La función del servidor construye el prompt fotográfico, solicita la imagen, lee la respuesta y guarda el archivo. La referencia del archivo vuelve a ADK como resultado de la tool.

Abre `workshop/exercises/05-images.ts`. Completa la llamada al modelo (5.1), la extracción de bytes (5.2) y el guardado (5.3). Las imágenes se guardan en disco local. El cálculo de dimensiones, checksum, historial y límites está preparado en el proveedor de la aplicación.

La respuesta puede incluir texto, partes internas y una imagen final. La prueba incluye una parte interna deliberadamente distinta: extraer la primera imagen sin comprobar `thought` hará fallar el ejercicio. El PNG offline tiene un solo píxel; comprueba el mecanismo, no el aspecto fotográfico.

En una prueba real se solicita solo una imagen. Se aplica el prompt de `packages/providers/image-prompt.ts`: luz natural, materiales con textura, proporciones plausibles y aviso de alojamiento ficticio fuera de la imagen.

Error frecuente: devolver un prompt como si fuera la imagen, o no esperar el guardado con `await` antes de devolver la referencia.
