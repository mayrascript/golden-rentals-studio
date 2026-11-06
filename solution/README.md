# Golden Rentals · Solución comentada

[Guía paso a paso en Notion](https://app.notion.com/p/410f59a74a4e8141a98ccc9b3e160c55) · [Elegir otra versión](../README.md)

Los 14 pasos están completos y conservan sus comentarios explicativos. La web usa estas mismas funciones.

Empieza por [el codelab en español](workshop/guide/README.md). Requisitos: Node.js 24.13 o posterior y pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre http://127.0.0.1:4320. La demo inicia en modo simulado, sin claves. Sigue [la preparación](workshop/guide/01-preparacion.md) para configurar tu .env.

Los agentes se prueban por separado con `pnpm workshop:check 2` hasta `7`. Estos comandos usan respuestas HTTP locales preparadas. El [laboratorio](workshop/guide/laboratorio.md) explica la prueba real opcional.

Puedes ejecutar pnpm workshop:check all, pnpm test y pnpm build para comprobar esta solución.

La aprobación humana sigue pendiente al generar contenido. La aplicación no publica en redes sociales.

Consulta [NOTICE](NOTICE) y [LICENSE](LICENSE) para la atribución del codelab original.
