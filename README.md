# Golden Rentals Studio

Aplicación del workshop **Tu próximo equipo no es humano**, de MayraScript. Golden Rentals es un caso ficticio.

[Seguir la guía paso a paso](https://mayrascript.github.io/multiagent-adk-workshop/) · [Repositorio de la guía](https://github.com/mayrascript/multiagent-adk-workshop)

## Empezar

Requisitos: Node.js 24.13.0 o posterior y pnpm 11.25.0.

```sh
git clone --branch starter https://github.com/mayrascript/golden-rentals-studio.git
cd golden-rentals-studio
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

La rama `starter` contiene los 14 TODO del participante; `main` contiene la solución comentada. La demo simulada funciona sin claves. Configura tu `.env` siguiendo la [preparación](https://mayrascript.github.io/multiagent-adk-workshop/#/preparacion) antes de activar Gemini.

## Estructura

- `apps/web`: interfaz Angular de campañas.
- `apps/server`: API local y coordinación.
- `packages`: contratos, proveedores y persistencia.
- `workshop/exercises`: código que ejecutan la app y el laboratorio ADK Web.
- `workshop/solution`: referencia comentada.
- `skills/instagram-copy`: skill didáctica del Redactor.

## Comprobar

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm demo:validate
```

En `starter`, las pruebas de agentes requieren completar los TODO. Usa `pnpm workshop:check NUMERO` para comprobar cada módulo. Las pruebas offline no consumen IA. Consulta el [laboratorio](https://mayrascript.github.io/multiagent-adk-workshop/#/laboratorio) para las pruebas reales con presupuesto.

La aplicación conserva la aprobación humana y no publica en redes. Los datos y las imágenes del ejemplo son ficticios. `.env`, campañas y credenciales no se incluyen en Git ni en los paquetes.

## Versión del taller

La edición Angular corresponde a las etiquetas `workshop-v2-angular-solution` y `workshop-v2-angular-starter`. La guía vive y se publica de forma independiente en `multiagent-adk-workshop`.

Se conserva el historial del repositorio original. Consulta [LICENSE](LICENSE) y [NOTICE](NOTICE).

## Desarrollo de la interfaz

La interfaz usa Angular 21 LTS, componentes standalone y signals, compatible con Node.js 24.13 y TypeScript 5.9 del taller. `pnpm dev` inicia Angular CLI y la API local; conserva el puerto de `.env` (4319 en starter, 4317 en main). La API usa un puerto interno libre. `pnpm build` genera la interfaz y el servidor; `pnpm start` sirve ambos desde Express. `pnpm typecheck` comprueba también las plantillas Angular.
