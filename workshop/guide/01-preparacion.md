# 1 Preparar entorno y valores personales

> [!TIP]
> **Tu objetivo:** verificar las herramientas, abrir el proyecto y ejecutar una campaña de práctica. Comienza sin API key.

## Primero, verifica tus herramientas

**Verifica que tengas instalados estos paquetes y las versiones recomendadas.** Ejecuta cada comando en la terminal que usarás durante el taller. Si ya cumples los requisitos, pasa a instalar el proyecto.

| Herramienta | Comando | Versión recomendada | Para qué sirve |
| --- | --- | --- | --- |
| **Node.js** | `node --version` | **24 LTS**, mínimo **24.13.0** | Ejecuta TypeScript y el servidor. |
| **npm** | `npm --version` | La incluida con Node.js 24 | Instala pnpm. No necesita instalación aparte. |
| **pnpm** | `pnpm --version` | **11.25.0** | Instala y ejecuta este proyecto. |
| **Git** | `git --version` | **2.43 o posterior** | Clona el starter y permite guardar cambios. |

El proyecto fija Node.js y pnpm; Git 2.43 es una recomendación del taller. También necesitas un editor, una terminal y conexión a Internet para las descargas.


<details>
<summary>Me falta instalar una o más herramientas</summary>

### A. Instalar Node.js y npm

**Windows y macOS — instalador gráfico:**

1. Abre la [página oficial de descarga de Node.js](https://nodejs.org/en/download).
2. Selecciona la línea **24 LTS** y tu sistema operativo. El taller se preparó con Node.js 24.22.1; una versión posterior de la línea 24 también cumple el requisito.
3. Descarga el instalador **`.msi` en Windows** o **`.pkg` en macOS** y sigue el asistente. Conserva la instalación de npm y la opción de agregar los comandos al PATH si aparece.
4. Cierra y vuelve a abrir la terminal. Si utilizas la terminal integrada de VS Code, reinicia también el editor.

**Linux — instalación con nvm:**

Si ya instalaste Node.js con el instalador gráfico, continúa en **Comprueba Node.js y npm**. Los comandos `nvm install` y `nvm use` corresponden a la alternativa con nvm.

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

### C. Instalar Git

- **Windows:** descarga y ejecuta [Git for Windows](https://git-scm.com/downloads/win). Conserva la opción que permite usar Git desde la terminal.
- **macOS:** ejecuta `xcode-select --install` y completa el asistente. Si ya usas Homebrew, puedes instalar Git con `brew install git`.
- **Ubuntu / Debian:** ejecuta `sudo apt update` y después `sudo apt install git`.
- **Otros Linux:** usa el gestor de tu distribución siguiendo la [guía oficial](https://git-scm.com/downloads/linux).

Abre una terminal nueva y ejecuta `git --version`. Recomendamos Git 2.43 o posterior para el taller; no hay un mínimo específico impuesto por el código. Git descarga y versiona los archivos; no necesitas configurar tu correo para clonar el repositorio público.

### D. Comprobar antes de continuar

Ejecuta estos cuatro comandos en la misma terminal que usarás para el workshop:

```sh
node --version
npm --version
pnpm --version
git --version
```

Si los cuatro muestran sus versiones, puedes pasar a **Instalar y ejecutar el proyecto**. La preparación todavía no requiere una API key de Gemini.

### Si aparece un error

| Mensaje o situación | Cómo resolverlo |
| --- | --- |
| `node`, `npm` o `pnpm` no se reconoce / `command not found` | Cierra y abre la terminal; reinicia VS Code si lo usas. Comprueba que terminaste la instalación de Node.js antes de instalar pnpm. |
| Node.js es anterior a 24.13.0 | Instala la línea 24 LTS. Si usas nvm, ejecuta `nvm install 24` y `nvm use 24`. |
| `nvm: command not found` / `zsh: command not found: nvm` | En MacBook, sigue el apartado **MacBook: Zsh no encuentra nvm**, debajo de esta tabla. También encontrarás enlaces para otros entornos. |
| `EACCES` / permiso denegado al instalar pnpm en macOS o Linux | Usa la instalación por usuario con nvm del apartado A, activa Node.js 24 y repite la instalación de pnpm. |
| PowerShell bloquea `npm.ps1` o `pnpm.ps1` | Abre **Símbolo del sistema (cmd)** y ejecuta allí los comandos del taller. |
| `git` no se reconoce | Termina la instalación del apartado C y abre una terminal nueva. El ZIP sirve como alternativa temporal para descargar el código. |

### MacBook: Zsh no encuentra nvm

Si al ejecutar `nvm use 24` aparece:

```text
zsh: command not found: nvm
```

La terminal no tiene nvm disponible: puede faltar la instalación o su carga en Zsh. **El instalador `.pkg` de Node.js no instala nvm.** Si `node --version` cumple el requisito y `npm --version` funciona, puedes continuar instalando pnpm.

**Si elegiste usar nvm:**

1. Carga la configuración de Zsh y comprueba si reconoce nvm. `touch` crea el archivo si falta y conserva su contenido si existe:

```sh
touch "$HOME/.zshrc"
source "$HOME/.zshrc"
command -v nvm
```

2. Si no imprime `nvm`, ejecuta el instalador oficial indicando el archivo que Zsh debe cargar:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | PROFILE="$HOME/.zshrc" bash
source "$HOME/.zshrc"
command -v nvm
```

Si falla por Git o las herramientas de Xcode, ejecuta `xcode-select --install`, completa el asistente y repite el paso 2.

3. **Cuando imprima `nvm`**, instala y activa Node.js; después prepara pnpm:

```sh
nvm install 24
nvm use 24
node --version
npm --version
npm install --global pnpm@11.25.0
pnpm --version
git --version
```

Abre una terminal nueva y comprueba otra vez `command -v nvm`. Si utilizas VS Code, reinícialo.

**Ayuda por entorno:**

- [macOS y Zsh: solución oficial de nvm](https://github.com/nvm-sh/nvm#troubleshooting-on-macos).
- [Linux, Bash y Zsh: solución oficial de nvm](https://github.com/nvm-sh/nvm#troubleshooting-on-linux).
- [Windows con PowerShell o cmd: problemas frecuentes de NVM for Windows](https://github.com/nvm-windows/nvm/wiki/Common-Issues). Es una herramienta distinta; el bloque de Zsh no se usa allí.

Referencia: [instalar Node.js y npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).

</details>

<details>
<summary>Ya las tengo, pero mis versiones son antiguas</summary>

### Actualiza Node.js y npm

Con **nvm en macOS o Linux**, ejecuta `nvm install 24` y `nvm use 24`. Si usaste un instalador gráfico, descarga de nuevo la línea **24 LTS** desde [Node.js](https://nodejs.org/en/download) y completa el asistente. No necesitas instalar nvm para actualizar con el instalador. npm se actualiza junto con Node.js.

### Alinea pnpm con el proyecto

```sh
npm install --global pnpm@11.25.0
pnpm --version
```

Repite este paso después de cambiar de versión de Node.js si pnpm deja de aparecer.

### Actualiza Git

En Windows, usa el instalador oficial de Git; en macOS, actualiza las herramientas de línea de comandos de Apple o usa `brew upgrade git` si tu instalación pertenece a Homebrew. En Ubuntu / Debian, usa `sudo apt update` y `sudo apt install --only-upgrade git`.

Abre una terminal nueva y repite los cuatro comandos de la tabla. Si falla alguno, abre el desplegable anterior: conserva las soluciones de permisos, PowerShell y nvm en Zsh.

</details>

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


<details>
<summary>Consultar la solución en una carpeta separada</summary>

Para ejecutar la solución sin modificar tus ejercicios, clónala en una carpeta distinta:

```sh
git clone --branch main https://github.com/mayrascript/multiagent-adk-workshop.git golden-rentals-solution
cd golden-rentals-solution
pnpm install --frozen-lockfile
pnpm dev
```

</details>

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


> [!NOTE]
> **La llave de Gemini se configura al probar un agente real.** Encontrarás cómo obtenerla y guardarla en [Prueba un agente por separado](laboratorio.md). Puedes completar esta preparación sin ella.

## TODO 1.2 · Elegir el modo de prueba

Los ejercicios empiezan con `pnpm workshop:check NUMERO`, sin consumo de IA. Mantén `GENERATION_MODE=simulated` hasta completar los módulos. El [laboratorio](laboratorio.md) permite probar un agente real antes de integrar toda la web.

Resultado esperado: la interfaz abre y produce una campaña simulada, y la comprobación setup termina sin mostrar credenciales.
