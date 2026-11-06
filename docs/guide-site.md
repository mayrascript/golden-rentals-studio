# Mantener la guía web

La guía pública se sirve en https://mayrascript.github.io/golden-rentals-workshop/ desde la carpeta **docs** de **main** en GitHub Pages.

El contenido sigue en `workshop/guide/*.md`. `workshop/site/steps.ts` define el orden y los títulos del menú; `style.css` y `client.ts` implementan el aspecto, la navegación, el progreso local y la copia de bloques.

El nombre del workshop es **Tu próximo equipo no es humano: workshop de orquestación de agentes con Google ADK**. Golden Rentals identifica únicamente el caso práctico. El nombre visible se configura en `workshop/site/steps.ts`; la dirección del repositorio se mantiene para conservar los enlaces compartidos.

El selector de modo oscuro está en la cabecera. `workshop/site/theme.ts` aplica la preferencia guardada antes de dibujar la página; en la primera visita sigue el tema del dispositivo. La elección se guarda únicamente en ese navegador y el progreso del taller se conserva por separado. Los colores del modo oscuro están al final de `style.css`.

La introducción incluye la tabla de agentes, las diferencias entre ADK, tools, skills, MCP y A2A, y la adaptación del diagrama. La imagen está en `workshop/assets/workshop-architecture.png` y se copia a la salida pública al generar la guía. Se adaptó con la herramienta de generación de imágenes integrada; el prompt reproducible está en `workshop/assets/architecture-prompt.txt`. El texto alternativo y la explicación en Markdown describen el flujo sin depender de la imagen.

```sh
pnpm guide:build
pnpm guide:dev
```

Abre http://127.0.0.1:4321/golden-rentals-workshop/. La vista previa usa el mismo subdirectorio que GitHub Pages. No necesita Gemini, una API key ni el servidor de campañas.

Al editar un paso, ejecuta `pnpm guide:build` y sube tanto el Markdown como `docs/index.html` y `docs/guide-assets/`. GitHub Pages publica esos archivos estáticos desde main; no necesita una tercera rama. `docs/.nojekyll` evita que GitHub transforme el HTML generado.

Solo se leen los once archivos enumerados en el temario: la introducción, ocho pasos, el laboratorio y la guía de facilitación. El generador no lee `.env`, campañas ni registros de consumo. El navegador guarda únicamente los IDs de los pasos marcados como completados, en almacenamiento local.

Si cambias una explicación que también aparece en Notion, actualiza allí el bloque correspondiente. La web se genera desde los Markdown; Notion es una copia editorial separada.
