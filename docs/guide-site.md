# Mantener la guía web

La guía pública se sirve en https://mayrascript.github.io/golden-rentals-workshop/ desde la carpeta **docs** de **main** en GitHub Pages.

El contenido sigue en `workshop/guide/*.md`. `workshop/site/steps.ts` define el orden y los títulos del menú; `style.css` y `client.ts` implementan el aspecto, la navegación, el progreso local y la copia de bloques.

```sh
pnpm guide:build
pnpm guide:dev
```

Abre http://127.0.0.1:4321/golden-rentals-workshop/. La vista previa usa el mismo subdirectorio que GitHub Pages. No necesita Gemini, una API key ni el servidor de campañas.

Al editar un paso, ejecuta `pnpm guide:build` y sube tanto el Markdown como `docs/index.html` y `docs/guide-assets/`. GitHub Pages publica esos archivos estáticos desde main; no necesita una tercera rama. `docs/.nojekyll` evita que GitHub transforme el HTML generado.

Solo se leen los once archivos enumerados en el temario: la introducción, ocho pasos, el laboratorio y la guía de facilitación. El generador no lee `.env`, campañas ni registros de consumo. El navegador guarda únicamente los IDs de los pasos marcados como completados, en almacenamiento local.

Si cambias una explicación que también aparece en Notion, actualiza allí el bloque correspondiente. La web se genera desde los Markdown; Notion es una copia editorial separada.
