# 1 Preparar entorno y valores personales

Objetivo: instalar el starter, ejecutar la interfaz y entender qué configuración pertenece a cada participante. Necesitas familiaridad básica con TypeScript, funciones asíncronas, JSON y una terminal.

## Requisitos iniciales

Prepara estas herramientas antes de clonar el proyecto. Si ya las tienes, comprueba las versiones y continúa con la instalación del workshop.

| Herramienta | Para qué sirve | Versión para el taller |
| --- | --- | --- |
| **Node.js** | Ejecuta el servidor y las herramientas de TypeScript. | Recomendamos **Node.js 24 LTS**, versión **24.13.0 o posterior** de esa línea. |
| **npm** | Permite instalar pnpm. | Viene incluido al instalar Node.js; conserva la versión que lo acompaña. |
| **pnpm** | Instala las dependencias y ejecuta los comandos del proyecto. | **11.25.0**, fijada en `package.json`. |

Necesitas una terminal, conexión a Internet para descargar las herramientas y un editor como VS Code. Para clonar con `git clone`, necesitas Git; también puedes descargar el ZIP de la rama starter desde GitHub y extraerlo.

### A. Instalar Node.js y npm

**Windows y macOS — instalador gráfico:**

1. Abre la [página oficial de descarga de Node.js](https://nodejs.org/en/download).
2. Selecciona la línea **24 LTS** y tu sistema operativo. El taller se preparó con Node.js 24.22.1; una versión posterior de la línea 24 también cumple el requisito.
3. Descarga el instalador **`.msi` en Windows** o **`.pkg` en macOS** y sigue el asistente. Conserva la instalación de npm y la opción de agregar los comandos al PATH si aparece.
4. Cierra y vuelve a abrir la terminal. Si utilizas la terminal integrada de VS Code, reinicia también el editor.

**Linux — instalación con nvm:**

nvm permite instalar Node.js para tu usuario. Este método también sirve en macOS, especialmente si una instalación global produce errores de permisos. En una terminal Bash o Zsh, instala nvm con el [comando de su documentación oficial](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
```

Cierra y vuelve a abrir la terminal para cargar nvm. Después instala y activa Node.js 24:

```sh
nvm install 24
nvm use 24
```

**Comprueba Node.js y npm en cualquier sistema:**

```sh
node --version
npm --version
```

Resultado esperado: Node.js muestra una versión `v24.x.x` igual o superior a `v24.13.0`, y npm muestra un número de versión. **npm ya está instalado con Node.js**; no necesitas instalarlo por separado. Si ya usas una versión posterior de Node.js, el proyecto declara un mínimo de 24.13.0; para seguir el entorno del taller recomendamos la línea 24.

### B. Instalar pnpm

Cuando `node` y `npm` funcionen, ejecuta:

```sh
npm install --global pnpm@11.25.0
pnpm --version
```

Resultado esperado: `11.25.0`. La instalación se realiza una vez por entorno de Node.js. El proyecto usa una versión concreta para que todos trabajemos con el mismo gestor de dependencias. Consulta la [instalación oficial de pnpm](https://pnpm.io/installation) si necesitas otra forma de instalarlo.

### C. Comprobar antes de continuar

Ejecuta estos tres comandos en la misma terminal que usarás para el workshop:

```sh
node --version
npm --version
pnpm --version
```

Si los tres muestran sus versiones, puedes pasar a **Instalar y ejecutar el proyecto**. La preparación todavía no requiere una API key de Gemini.

### Si aparece un error

| Mensaje o situación | Cómo resolverlo |
| --- | --- |
| `node`, `npm` o `pnpm` no se reconoce / `command not found` | Cierra y abre la terminal; reinicia VS Code si lo usas. Comprueba que terminaste la instalación de Node.js antes de instalar pnpm. |
| Node.js es anterior a 24.13.0 | Instala la línea 24 LTS. Si usas nvm, ejecuta `nvm install 24` y `nvm use 24`. |
| `nvm: command not found` | Abre una terminal nueva. Si continúa, sigue la sección de solución de problemas de la documentación de nvm para tu sistema. |
| `EACCES` / permiso denegado al instalar pnpm en macOS o Linux | Usa la instalación por usuario con nvm del apartado A, activa Node.js 24 y repite la instalación de pnpm. |
| PowerShell bloquea `npm.ps1` o `pnpm.ps1` | Abre **Símbolo del sistema (cmd)** y ejecuta allí los comandos del taller. |
| `git` no se reconoce | Descarga el ZIP: abre el repositorio en GitHub, selecciona **starter**, elige **Code → Download ZIP** y extrae la carpeta. Ábrela en tu editor y en la terminal. |

Referencia: [instalar Node.js y npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).

## Instalar y ejecutar el proyecto

1. Clona la rama `starter` para realizar el taller. Ejecuta desde una terminal:

```sh
git clone --branch starter https://github.com/mayrascript/multiagent-adk-workshop.git multiagent-adk-workshop
cd multiagent-adk-workshop
```

   El proyecto está en la raíz de la carpeta clonada. Si descargas un ZIP desde GitHub, selecciona primero la rama starter. Para consultar la solución completa con comentarios, abre la rama main.

2. Desde la carpeta que contiene `package.json`, ejecuta:

```sh
pnpm install --frozen-lockfile
pnpm workshop:check setup
pnpm dev
```

Abre la dirección que imprima el servidor. La rama starter usa el puerto 4319; main usa 4317. Puedes cambiarlos en `.env`. Ejecuta una campaña simulada para conocer el resultado que construirás.

Para ejecutar la solución sin modificar tus ejercicios, clónala en una carpeta distinta:

```sh
git clone --branch main https://github.com/mayrascript/multiagent-adk-workshop.git golden-rentals-solution
cd golden-rentals-solution
pnpm install --frozen-lockfile
pnpm dev
```

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
