# Mantener la guía web

La guía pública se sirve en https://mayrascript.github.io/multiagent-adk-workshop/ desde la carpeta **docs** de **main** en GitHub Pages.

El contenido sigue en `workshop/guide/*.md`. `workshop/site/steps.ts` define el orden y los títulos del menú; `style.css` y `client.ts` implementan el aspecto, la navegación, el progreso local y la copia de bloques.

El nombre del workshop es **Tu próximo equipo no es humano: workshop de orquestación de agentes con Google ADK**. Golden Rentals identifica únicamente el caso práctico. El nombre visible se configura en `workshop/site/steps.ts`; el repositorio y la guía pública usan la dirección `multiagent-adk-workshop`.

El selector de modo oscuro está en la cabecera. `workshop/site/theme.ts` aplica la preferencia guardada antes de dibujar la página; en la primera visita sigue el tema del dispositivo. La elección se guarda únicamente en ese navegador y el progreso del taller se conserva por separado.

## Branding de MayraScript

La guía consume la [skill pública de MayraScript](https://github.com/mayrascript/mayrascript-brand-skill), incluida en `.agents/skills/mayrascript-brand/`. `AGENTS.md` dirige a los agentes de desarrollo a sus instrucciones. La versión exacta está en `workshop/site/brand-source.json`.

`scripts/build-guide.ts` concatena las fuentes y los tokens CSS de la skill antes de `workshop/site/style.css`, y copia el isotipo, los dos archivos de IBM Plex Mono y su licencia a la salida pública. Por eso un clon del repositorio puede generar la guía sin descargar la skill ni las fuentes. Las reglas de los componentes permanecen en `workshop/site/style.css`.

El violeta profundo, el marfil, el cian y el degradado coral–rosa proceden de mayrascript.com. El modo claro y los ajustes de contraste están documentados como adaptaciones. Los títulos y la firma usan IBM Plex Mono; el cuerpo usa una fuente de sistema sin serifas para facilitar la lectura de guías largas. El diagrama conserva sus colores originales.

Para actualizar la skill, revisa el commit nuevo en su repositorio, sustituye la carpeta completa y actualiza `brand-source.json`. Regenera el sitio y comprueba claro/oscuro, móvil, navegación y copiado. No edites los archivos generados dentro de `docs/guide-assets/`. Esta skill guía el desarrollo visual; no se añade a los agentes de campaña ni sustituye `skills/instagram-copy/`.

## Contenido y generación

La introducción incluye la tabla de agentes, las diferencias entre ADK, tools, skills, MCP y A2A, y la adaptación del diagrama. La imagen está en `workshop/assets/workshop-architecture.png` y se copia a la salida pública al generar la guía. Se generó con la herramienta de imágenes integrada; las instrucciones del diagrama están en `workshop/assets/architecture-prompt.txt`. El texto alternativo y la explicación en Markdown describen el flujo sin depender de la imagen.

```sh
pnpm guide:build
pnpm guide:dev
```

Abre http://127.0.0.1:4321/multiagent-adk-workshop/. La vista previa usa el mismo subdirectorio que GitHub Pages. No necesita Gemini, una API key ni el servidor de campañas.

Al editar un paso, ejecuta `pnpm guide:build` y sube tanto el Markdown como `docs/index.html` y `docs/guide-assets/`. GitHub Pages publica esos archivos estáticos desde main; no necesita una tercera rama. `docs/.nojekyll` evita que GitHub transforme el HTML generado.

Solo se leen los once archivos enumerados en el temario: la introducción, ocho pasos, el laboratorio y la guía de facilitación. El generador no lee `.env`, campañas ni registros de consumo. El navegador guarda únicamente los IDs de los pasos marcados como completados, en almacenamiento local.

Si cambias una explicación que también aparece en Notion, actualiza allí el bloque correspondiente. La web se genera desde los Markdown; Notion es una copia editorial separada.

## Edición del 7 de noviembre de 2026

- Preparación con comprobación inicial de Node.js, npm, pnpm y Git; instalación y actualización en desplegables. El contenido usa `<details>` y `<summary>` sin atributos, procesados mediante una extensión limitada del renderizador. El resto del HTML continúa escapado.
- Las notas Markdown `[!TIP]`, `[!NOTE]`, `[!IMPORTANT]` y `[!WARNING]` se convierten en tarjetas accesibles.
- El QR se genera localmente con `qrcode` desde `siteUrl`, con margen de cuatro módulos y corrección M. No depende de un servicio externo.
- `agent-avatars.png` es una ilustración original generada con la herramienta de imágenes integrada, sin datos de personas reales. La analogía distingue agente, manual/skill e instrumento/tool. El texto accesible describe los roles.
- Se muestran tiempos estimados por sección. Por decisión de la organizadora, se conserva el progreso local sencillo; no se añaden login, seguimiento por bloque ni almacenamiento de participantes.
- El enlace de feedback abre Google Forms, sin recogida de correos ni límite de una respuesta. El formulario no identifica finalizadores; la facilitadora valida el cierre en 30–60 segundos por persona o equipo.
- `pnpm workshop:web --allow-paid-generation --budget-usd=IMPORTE` inicia el laboratorio ADK Web local. Se cargan los ejercicios del participante y las imágenes pueden aparecer como artefactos. El presupuesto acumulado es independiente del laboratorio CLI.
