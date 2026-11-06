import { pending } from '../support.js';
import type { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import type { CampaignStore } from '../../packages/storage/index.js';
import { AppError } from '../../apps/server/src/workflow/rules.js';

export async function requestImage(client: GoogleGenAI, model: string, prompt: string): Promise<GenerateContentResponse> {
  // TODO 5.1 · Llamar al modelo de imágenes desde una función del servidor.
  // Recibe: cliente autenticado, modelo y prompt fotográfico ya construido.
  // Devuelve: la respuesta multimodal de Gemini, que puede contener texto y bytes de imagen.
  // En modo real esta es una llamada facturable. Los ejercicios offline sustituyen el transporte HTTP.
  // @todo:start 5.1
  // Descomenta el bloque siguiente y elimina pending('5.1').
  // return await client.models.generateContent({
  //   model, contents: prompt,
  //   config: {
  //     responseModalities: ['TEXT', 'IMAGE'],
  //     imageConfig: { aspectRatio: '1:1', imageSize: '1K' },
  //     maxOutputTokens: 4096, automaticContinuation: false,
  //     httpOptions: { timeout: 120000, retryOptions: { attempts: 1 } },
  //   },
  // });
  pending('5.1');
  // @todo:end 5.1
}

export function extractImage(response: GenerateContentResponse): { bytes: Buffer; mimeType: string } {
  // TODO 5.2 · Encontrar la imagen final y convertir sus datos a bytes.
  // Recibe: la respuesta multimodal; devuelve bytes y tipo MIME para guardarlos.
  // Se descartan las partes internas de razonamiento. Una respuesta de solo texto no es una imagen.
  // @todo:start 5.2
  // Descomenta el bloque siguiente y elimina pending('5.2').
  // const data = response.candidates?.[0]?.content?.parts?.find(part => !part.thought && part.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
  // if (!data?.data || !data.mimeType || !['image/png', 'image/jpeg'].includes(data.mimeType)) {
  //   throw new AppError('El modelo no entregó una imagen PNG o JPEG.');
  // }
  // return { bytes: Buffer.from(data.data, 'base64'), mimeType: data.mimeType };
  pending('5.2');
  // @todo:end 5.2
}

export async function saveImage(store: CampaignStore, campaignId: string, relativePath: string, bytes: Buffer): Promise<void> {
  // TODO 5.3 · Persistir el archivo dentro de la campaña.
  // Recibe: almacenamiento local, identificador de campaña, ruta relativa y bytes validados.
  // Devuelve: una promesa que termina cuando el archivo está guardado.
  // El proveedor preparado calcula dimensiones, checksum y metadatos y devuelve la referencia al agente.
  // @todo:start 5.3
  // Descomenta el bloque siguiente y elimina pending('5.3').
  // await store.writeAsset(campaignId, relativePath, bytes);
  pending('5.3');
  // @todo:end 5.3
}
