# Golden Rentals · Edición del participante

[Guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) · [Elegir otra versión](../README.md)

Completa los 14 TODO de código en workshop/exercises siguiendo la guía. Cada paso explica qué hace, qué recibe y qué devuelve.

Empieza por [el codelab en español](workshop/guide/README.md). Requisitos: Node.js 24.13 o posterior y pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4319. La demo inicia en modo simulado, sin claves. Sigue [la preparación](workshop/guide/01-preparacion.md) para configurar tu .env.

Los agentes se prueban por separado con `pnpm workshop:check 2` hasta `7`. Estos comandos usan respuestas HTTP locales preparadas. El [laboratorio](workshop/guide/laboratorio.md) explica la prueba real opcional.

Un TODO pendiente debe dar un error claro al comprobar ese módulo. La demo simulada y typecheck funcionan desde el inicio. pnpm test y el modo real completo requieren terminar todos los ejercicios.

La aprobación humana sigue pendiente al generar contenido. La aplicación no publica en redes sociales.

Consulta [NOTICE](NOTICE) y [LICENSE](LICENSE) para la atribución del codelab original.
