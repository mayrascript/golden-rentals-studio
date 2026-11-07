# 5 Generar, extraer y guardar una imagen

> [!TIP]
> **Tu objetivo:** completar la función que conecta el Diseñador con el modelo de imágenes. Requisitos: módulos 2 y 3.

El agente de texto elabora el concepto y llama a `generate_campaign_image`. La función del servidor construye el prompt fotográfico, solicita la imagen, lee la respuesta y guarda el archivo. La referencia del archivo vuelve a ADK como resultado de la tool.

Abre `workshop/exercises/05-images.ts`. Completa la llamada al modelo (5.1), la extracción de bytes (5.2) y el guardado (5.3). Las imágenes se guardan en disco local. El cálculo de dimensiones, checksum, historial y límites está preparado en el proveedor de la aplicación.

La respuesta puede incluir texto, partes internas y una imagen final. La prueba incluye una parte interna deliberadamente distinta: extraer la primera imagen sin comprobar `thought` hará fallar el ejercicio. El PNG offline tiene un solo píxel; comprueba el mecanismo, no el aspecto fotográfico.

En una prueba real se solicita solo una imagen. Se aplica el prompt de `packages/providers/image-prompt.ts`: luz natural, materiales con textura, proporciones plausibles y aviso de alojamiento ficticio fuera de la imagen.

> [!WARNING]
> **Error frecuente:** devolver un prompt como si fuera la imagen, o no esperar el guardado con `await` antes de devolver la referencia.

## Bloques para completar

Abre `workshop/exercises/05-images.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 5.1

Pega dentro de la función correspondiente:

```ts
return await client.models.generateContent({
  model, contents: prompt,
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: { aspectRatio: '1:1', imageSize: '1K' },
    maxOutputTokens: 4096, automaticContinuation: false,
    httpOptions: { timeout: 120000, retryOptions: { attempts: 1 } },
  },
});
```

### TODO 5.2

Pega dentro de la función correspondiente:

```ts
const data = response.candidates?.[0]?.content?.parts?.find(part => !part.thought && part.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
if (!data?.data || !data.mimeType || !['image/png', 'image/jpeg'].includes(data.mimeType)) {
  throw new AppError('El modelo no entregó una imagen PNG o JPEG.');
}
return { bytes: Buffer.from(data.data, 'base64'), mimeType: data.mimeType };
```

### TODO 5.3

Pega dentro de la función correspondiente:

```ts
await store.writeAsset(campaignId, relativePath, bytes);
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 5
```

> [!IMPORTANT]
> **Resultado esperado:** Una imagen final decodificada y guardada; las partes de razonamiento se descartan.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
