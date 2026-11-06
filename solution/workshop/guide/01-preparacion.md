# 1 Preparar entorno y valores personales

Objetivo: instalar el starter, ejecutar la interfaz y entender qué configuración pertenece a cada participante. Necesitas familiaridad básica con TypeScript, funciones asíncronas, JSON y una terminal.

## Instalar y ejecutar

1. Clona el repositorio público y abre la carpeta `starter` en tu editor. Ejecuta desde una terminal:

```sh
git clone https://github.com/mayrascript/golden-rentals-workshop.git
cd golden-rentals-workshop/starter
```

   Si descargaste el ZIP de GitHub, descomprímelo y abre igualmente `starter`. Para consultar la solución completa usa `solution`; `final` contiene el MVP de referencia. Cada carpeta se instala por separado.
2. Comprueba `node --version`: el proyecto requiere Node.js 24.13 o posterior. La preparación se verificó con 24.22.1 y pnpm 11.25.0.
3. Si falta pnpm, instálalo con `npm install --global pnpm@11.25.0`.
4. Desde la carpeta que contiene package.json, ejecuta:

```sh
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre la dirección que imprima el servidor. El paquete del participante usa el puerto 4319; la solución usa 4320. Puedes cambiarlos en `.env`. Ejecuta una campaña simulada para conocer el resultado que construirás.

## TODO 1.1 · Crear tu configuración local

Duplica `.env.example` y nombra la copia `.env`, si todavía no existe. Si ya tienes uno, conserva sus valores. Los comentarios de la plantilla explican para qué sirve cada campo.

| Valor | Qué significa | Qué debes completar |
| --- | --- | --- |
| `GENERATION_MODE` | Proveedor usado por la web | Mantén `simulated` durante la preparación |
| `GOOGLE_GENAI_API_KEY` | Credencial personal para Gemini | Se completa únicamente al probar el modo real |
| `TEXT_MODEL` | Modelo de los agentes | La plantilla trae el identificador seleccionado |
| `IMAGE_MODEL` | Modelo llamado por la tool de imágenes | La plantilla trae el identificador seleccionado |
| `PORT` | Dirección local del servidor | Cambia el número si el puerto está ocupado |

Esta edición usa Gemini mediante API key y guarda archivos localmente. No solicita nombre de proyecto de Google Cloud, región, bucket ni IDs de Notion. Esos campos corresponderían a módulos de nube o MCP.

## TODO 1.2 · Preparar la credencial cuando vayas a probar Gemini

Obtén tu propia clave desde Google AI Studio, en su sección de claves de API, y pégala en `GOOGLE_GENAI_API_KEY` dentro de `.env`. Este archivo permanece local y está excluido del ZIP y de Git. No se coloca la clave dentro de un prompt, una skill ni el código del navegador.

Ejecuta `pnpm workshop:check setup`: mostrará si hay una clave configurada, sin imprimirla. Es una comprobación local, no valida acceso con Google. `pnpm gemini:check` consulta el acceso a los modelos sin generar contenido.

## TODO 1.3 · Elegir el modo de prueba

Los ejercicios empiezan con `pnpm workshop:check NUMERO`, sin consumo de IA. Mantén `GENERATION_MODE=simulated` hasta completar los módulos. El [laboratorio](laboratorio.md) permite probar un agente real antes de integrar toda la web.

Resultado esperado: la interfaz abre y produce una campaña simulada, y la comprobación setup termina sin mostrar credenciales.
