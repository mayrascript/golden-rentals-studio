# Prueba un agente por separado

El laboratorio crea una campaña ficticia temporal. Aporta estrategia y textos de ejemplo para que puedas probar un agente por separado. No lee tus campañas personales.

## Comprobaciones sin red

```sh
pnpm workshop:check setup
pnpm workshop:check 2
pnpm workshop:check 3
pnpm workshop:check 4
pnpm workshop:check 5
pnpm workshop:check 6
pnpm workshop:check 7
pnpm workshop:check all
```

Los módulos 2 a 6 ejecutan agentes ADK con respuestas HTTP preparadas. Las tools y la lectura de archivos sí se ejecutan. La salida del modelo es una fixture: cambiar el prompt no modifica ese texto fijo. La comprobación de imágenes usa un PNG de 1 píxel y elimina sus archivos temporales al terminar. El módulo 7 verifica la conexión del equipo y el mensaje de contexto.

Las líneas `→ llamada` muestran nombre y argumentos; `← resultado` muestra un extracto del resultado. Las partes internas de razonamiento no se imprimen. El módulo 4 exige observar tanto `load_skill` como `load_skill_resource`; crear el toolset por sí solo no basta.

## Obtén y configura tu llave de Gemini

**Necesitas una llave de API para conversar con Gemini real**, tanto desde la terminal como desde ADK Web. Las comprobaciones sin red de arriba funcionan sin ella. Si ya tienes una llave válida, pasa a guardarla en `.env`.

### 1. Obtén la llave en Google AI Studio

1. Abre [Google AI Studio](https://aistudio.google.com/) e inicia sesión con tu cuenta de Google. Si es tu primera visita, completa la bienvenida y revisa los términos que te presente Google.
2. Entra en **Get API key / API keys**. Para cuentas nuevas, AI Studio puede haber creado un proyecto y una llave inicial.
3. Si necesitas una llave nueva, pulsa **Create API key / Crear clave de API** y selecciona el proyecto que usarás para el taller. Sigue el diálogo para crear o elegir el proyecto.
4. Copia la llave. La pegarás únicamente en tu archivo local `.env`.

Cada llave está asociada a un proyecto de Google Cloud, pero este taller solo necesita la llave en su configuración. [Guía oficial de llaves de Gemini](https://ai.google.dev/gemini-api/docs/api-key).

<details>
<summary>No veo mi proyecto o no puedo crear una llave</summary>

Si ya tienes proyectos de Google Cloud y no aparecen, abre **Dashboard → Projects → Import projects** en AI Studio. Importa el proyecto que tengas autorizado usar y vuelve a **API keys**.

Si el botón para crear la llave está deshabilitado por permisos, consulta con quien administra ese proyecto. [Permisos y solución de problemas en AI Studio](https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio).

</details>

### 2. Guarda la llave en tu proyecto

Abre `.env` en la raíz del proyecto, junto a `package.json`. Si no existe, duplica `.env.example` y nombra la copia `.env`; si ya existe, conserva sus otros valores. Reemplaza el valor de esta línea por tu llave:

```sh
GOOGLE_GENAI_API_KEY=PEGA_TU_LLAVE_AQUI
```

Guarda el archivo. Mantén los valores de `TEXT_MODEL` e `IMAGE_MODEL` de la plantilla. Después de comprobar la llave, sigue el apartado **Cambia de simulated a real** para elegir cómo probar Gemini.

> [!IMPORTANT]
> **Tu llave permanece en `.env`.** Ese archivo está excluido de Git y del ZIP del proyecto. No pegues la llave en el chat del agente, una skill, una captura ni el código del navegador.

### 3. Comprueba la configuración

Desde la raíz del proyecto, ejecuta:

```sh
pnpm workshop:check setup
```

Debe mostrar **Clave configurada: sí**, sin imprimirla. Esta comprobación solo detecta que escribiste un valor; todavía no valida la llave con Google.

Después comprueba el acceso a los modelos:

```sh
pnpm gemini:check
```

**Resultado esperado:** `accessible: true` para los modelos configurados. Este comando contacta con Google y consulta sus metadatos; no genera contenido ni garantiza cuota para generar. Si ADK Web ya estaba abierto, detenlo con **Ctrl+C** y vuelve a iniciarlo para cargar la llave nueva.

<details>
<summary>La comprobación no reconoce la llave o falla</summary>

- **Clave configurada: no:** comprueba el nombre `.env`, que guardaste el archivo y que completaste `GOOGLE_GENAI_API_KEY` en la carpeta desde la que ejecutas el comando.
- **`invalid-key`:** vuelve a copiar la llave completa desde AI Studio y reemplaza el texto de ejemplo.
- **`permission-denied`:** revisa el proyecto asociado y los permisos de tu cuenta en AI Studio.
- **`model-not-found-or-unsupported`:** revisa `TEXT_MODEL` e `IMAGE_MODEL` y el acceso de tu proyecto a esos modelos.
- **`network-unavailable`:** comprueba tu conexión a Internet y vuelve a ejecutar la comprobación.

</details>

## Cambia de simulated a real

**La opción correcta para usar Gemini en la aplicación de campañas es `real`.** Se cambia en el archivo **`.env`**, en la raíz del proyecto, junto a `package.json`. El indicador “Demo simulada” de la aplicación muestra el modo actual; no es un selector.

### Activa Gemini en la aplicación de campañas

1. Con tu llave ya configurada, abre **`.env`** en tu editor. Busca esta línea:

```sh
GENERATION_MODE=simulated
```

2. Reemplázala por esta y guarda el archivo. Edita la línea existente; no agregues una segunda:

```sh
GENERATION_MODE=real
```

3. En la terminal donde ejecutaste `pnpm dev`, detén el servidor con **Ctrl+C**. Vuelve a iniciarlo desde la raíz del proyecto:

```sh
pnpm dev
```

4. Abre la dirección que imprime esa terminal y recarga la aplicación. Comprueba **“Modo real”** en la terminal y **“Generación con IA”** en la parte superior de la aplicación.
5. Elige **“Nueva campaña”** si tenías una abierta. Las campañas simuladas ya guardadas conservan su modo; el cambio se aplica a las campañas nuevas.

> [!IMPORTANT]
> **Las generaciones en modo real consumen la API de tu cuenta.** Los límites de la aplicación son por campaña; el presupuesto del laboratorio no se aplica a esta web.

### ¿Y si quiero probar solo un agente?

| Entorno | Cómo se activa Gemini |
| --- | --- |
| **Aplicación de campañas** (`pnpm dev`) | Usa `GENERATION_MODE=real` en `.env` y reinicia el servidor. |
| **Chat de ADK Web** (puerto 8000) | El comando `pnpm workshop:web` con autorización y presupuesto que aparece más abajo usa Gemini real. Puedes mantener `GENERATION_MODE=simulated` para la aplicación de campañas. |
| **Un agente desde la terminal** | Usa el comando de abajo con `--real`, autorización y presupuesto. No depende de `GENERATION_MODE`. |
| **Comprobaciones sin red** (`pnpm workshop:check`) | Usan respuestas preparadas, incluso si `.env` tiene `GENERATION_MODE=real`. |

<details>
<summary>Sigue apareciendo Demo simulada, o quiero volver al modo de práctica</summary>

- Confirma que editaste **`.env`**, no `.env.example`, y que guardaste el archivo en la misma carpeta desde la que inicias el servidor.
- Detén y vuelve a ejecutar `pnpm dev`; recargar el navegador por sí solo no vuelve a leer `.env`.
- Usa la dirección de la terminal que acabas de iniciar. Si tienes abiertas las versiones `main` y `starter`, cada carpeta tiene su propio `.env` y puerto.
- Si la cabecera dice **“Generación con IA”** pero la campaña dice **“Contenido simulado”**, crea una campaña nueva.
- Para volver a la práctica sin llamadas a Gemini, cambia la línea a `GENERATION_MODE=simulated`, reinicia `pnpm dev` y crea una campaña nueva. Este cambio solo controla la aplicación de campañas.

</details>

## Ejecutar un agente con Gemini: abre ADK Web

**Este es el entorno para conversar con cada agente en tu navegador.** Abre una terminal en la raíz de tu copia del workshop, donde está `package.json`. Puedes dejar la aplicación de campañas abierta en otra terminal.

> [!IMPORTANT]
> **Práctica opcional con Gemini real.** ADK Web permite escribir mensajes y observar eventos de herramientas. Necesitas tu propia clave en `.env`. El modo `simulated` de la aplicación no convierte ADK Web en un chat simulado.

### 1. Comprueba que tu copia incluye ADK Web

Ejecuta:

```sh
pnpm run
```

En la lista debe aparecer **`workshop:web`**. Este comando arranca el chat de ADK; `workshop:run` ejecuta una prueba por terminal.

<details>
<summary>Me aparece Command "workshop:web" not found</summary>

Ese mensaje significa que `package.json` no tiene registrado el comando en la carpeta actual. Comprueba que abriste la raíz del workshop y que existen `scripts/workshop-web.ts` y `workshop/adk-agents/`.

Si faltan, tu copia es anterior al laboratorio ADK Web. Actualiza a una versión que incluya esos archivos y el script `workshop:web`, conservando tus ejercicios y `.env`. Reinstalar dependencias por sí solo no agrega ese comando. Si ya modificaste ejercicios, pide ayuda a la facilitadora para actualizar la infraestructura sin reemplazar tu trabajo.

</details>

### 2. Instala las dependencias y arranca ADK Web

Completa los TODO del especialista que quieres probar y ejecuta su comprobación offline. Con la llave ya guardada en `.env`, instala las dependencias si aún no lo hiciste:

```sh
pnpm install --frozen-lockfile
```

Después ejecuta:

```sh
# 5 = presupuesto estimado acumulado de 5 USD para ADK Web.
pnpm workshop:web --allow-paid-generation --budget-usd=5
```

**`--budget-usd=5` reserva un presupuesto estimado de 5 USD para las pruebas de ADK Web.** El consumo estimado se acumula entre reinicios. ADK Web lleva un registro separado del laboratorio por terminal; no comparten un único presupuesto de 5 USD. Este valor no establece un límite de facturación en Google.

Mantén esa terminal abierta y espera a que el servidor termine de arrancar. Abre **http://127.0.0.1:8000** en tu navegador; `pnpm dev` abre la aplicación de campañas, que es otra interfaz.

En el selector de agentes encontrarás **strategist**, **copywriter**, **designer** y **editor**. Elige uno y crea una sesión nueva. No hace falta tener terminados todos los agentes para probar el Estratega.

El laboratorio usa tus funciones de `workshop/exercises/`. Si falta un TODO, muestra el error; no sustituye tu código por la solución.

### 3. Elige un especialista y envía una instrucción

**Los nombres del taller están en español; el selector de ADK muestra los identificadores del código.** El Redactor se llama **`copywriter`**. El Editor (`editor`) revisa los textos.

| Agente del workshop | Nombre en el selector de ADK | Completa antes | Qué vas a comprobar |
| --- | --- | --- | --- |
| **Estratega** | `strategist` | Módulo 2 | Una estrategia y tres ángulos. |
| **Redactor** | `copywriter` | Módulo 4 | Lectura de la skill y tres publicaciones. |
| **Diseñador** | `designer` | Módulos 3 y 5 | Una llamada a la tool y una imagen. |
| **Editor** | `editor` | Módulo 6 | Revisión textual y tres fechas propuestas. |

Selecciona el agente, pulsa **NEW SESSION**, abre su bloque de abajo y copia el mensaje completo con **Copiar**. Cada ejemplo trae su propio contexto; no necesitas ejecutar los otros primero. Las conversaciones no se comparten al cambiar de agente.

<details>
<summary>Estratega · strategist · Instrucción lista para copiar</summary>

Requiere el módulo 2. Selecciona **strategist** y pega:

```prompt
Marca ficticia: Golden Rentals. Audiencia: parejas que buscan una escapada tranquila. Objetivo: dar a conocer la marca.
Hechos permitidos: fact-1 = marca de alojamientos ficticia para este taller; fact-2 = comunicación cálida y cercana. No se conocen precios, ubicación ni amenidades.
Propón tres ángulos distintos basados solo en estos hechos. Devuelve JSON con summary y angles: [{angleId, title, purpose}]. Usa angle-1, angle-2 y angle-3.
```

**Observa:** tres enfoques distintos, ninguna búsqueda externa y ningún precio inventado. Cambia la audiencia y compara una nueva respuesta.

</details>

<details>
<summary>Redactor · copywriter · Instrucción lista para copiar</summary>

Requiere el módulo 4. Selecciona **copywriter** y pega:

```prompt
Marca ficticia: Golden Rentals. Audiencia: parejas. Tono cálido.
Hechos: fact-1 = marca ficticia del taller; fact-2 = comunicación cercana.
Estrategia: invitar a imaginar una pausa sin prometer características del alojamiento.
Ángulos: angle-1 = hacer una pausa; angle-2 = imaginar una escapada; angle-3 = compartir un deseo de viaje.
Carga instagram-copy y references/estructuras.md. Escribe tres publicaciones. Devuelve JSON {pieces:[{pieceId,angleId,hook,body,cta,hashtags,factIds}]}, con piece-1, piece-2 y piece-3. No inventes precios ni servicios.
```

**Observa:** eventos `load_skill` y `load_skill_resource`, seguidos de tres textos. Pega los resultados del Estratega si quieres trabajar con tu propia estrategia: el Redactor no los recibe automáticamente al cambiar el selector.

</details>

<details>
<summary>Diseñador · designer · Instrucción lista para copiar</summary>

Requiere los módulos 3 y 5. Selecciona **designer** y pega:

**Entrega un brief completo:** indica la pieza, los hechos del escenario y la paleta. En ADK Web, el Diseñador no recibe automáticamente lo que hablaste con el Estratega o el Redactor. Su configuración actual crea fotografías de interiores de alojamientos ficticios.

```prompt
Ejercicio ficticio de Golden Rentals; no representa una propiedad real.
Pieza: piece-1. Todavía no tiene imagen.
Datos del escenario ficticio:
- fact-1: la escena es el interior de una cabaña ficticia, con una ventana amplia.
- fact-2: desde esa ventana se ve una playa imaginaria de arena blanca, agua turquesa y palmeras. No corresponde a una ubicación real.
- fact-3: el interior contiene una silla de madera y una cortina de lino; no se conocen otros servicios o amenidades.
Paleta: arena, turquesa y coral.
Concepto: una pausa tranquila frente a una playa paradisíaca.
Crea una fotografía fotorrealista desde el interior, con la playa visible por la ventana y luz natural suave. Usa únicamente los elementos descritos, sin texto ni logotipos.
Usa generate_campaign_image una sola vez para piece-1. Incluye un altText que indique que es una imagen generada por IA de un alojamiento ficticio. Devuelve la referencia obtenida de la herramienta.
```

**Observa:** nombre y argumentos de la tool, resultado con ruta local y un artefacto de imagen en ADK Web. Esta prueba consume una generación de imagen además de las llamadas de texto. Inspecciona la imagen tú; el Editor no hace revisión de píxeles.

**Si responde que faltan hechos o una pieza:** es una respuesta del agente a un brief incompleto. Comprueba que incluiste `piece-1`, los datos con sus `factId` y la paleta. Esos identificadores etiquetan los datos del ejercicio; no certifican una propiedad real.

Una petición como “crea una playa paradisíaca” omite ese contexto. Además, pedir solo un paisaje exterior requiere ampliar la dirección visual de `PHOTO_STYLE` en `packages/providers/image-prompt.ts`, que actualmente pide interiores. Si cambias esa configuración, conserva la distinción entre escenas ficticias y hechos de propiedades reales, reinicia ADK Web y crea una sesión nueva.

</details>

<details>
<summary>Editor · editor · Detecta un problema y aprueba la corrección</summary>

Requiere el módulo 6. Selecciona **editor** y crea una sesión nueva. Esta prueba tiene dos mensajes: primero revisas un texto con datos inventados; después envías una versión corregida.

**Prueba A · Detecta la afirmación sin respaldo.** Copia este primer mensaje:

```prompt
Revisa este ejemplo ficticio. Hechos permitidos: fact-1 = Golden Rentals es una marca ficticia del taller.
Pieza piece-1, ángulo angle-1: “Reserva hoy por $50 con piscina privada”. Esos datos no están en los hechos.
Pieza piece-2, ángulo angle-2: “Imagina tu próxima pausa”.
Pieza piece-3, ángulo angle-3: “¿Con quién compartirías una escapada?”.
Devuelve JSON {review:{status,findings:[{pieceId,severity,category,description}],visualInspection:"HUMAN_REQUIRED"},calendar:[{pieceId,date,localTime:"",topic}]} con tres fechas entre 2026-11-07 y 2026-11-13. Señala las afirmaciones sin respaldo; no apruebes imágenes.
Respeta estos valores exactos del contrato: review.status solo puede ser "APPROVED" o "NEEDS_REVISION"; severity solo "blocking" o "note"; category solo "factual", "brand", "copy", "visual", "calendar" o "technical".
Usa NEEDS_REVISION cuando haya afirmaciones sin respaldo y APPROVED cuando la revisión textual no encuentre problemas que bloqueen su aprobación. Cada entrada de calendar debe corresponder a una pieza distinta. Las fechas pertenecen a este caso didáctico; no se publicará nada.
```

**Resultado esperado:** `review.status: "NEEDS_REVISION"`, con una observación `blocking` de categoría `factual` para `piece-1`, por el precio y la piscina. También debe devolver tres fechas y `visualInspection: "HUMAN_REQUIRED"`.

**Prueba B · Revisa la versión corregida.** En la misma sesión de **editor**, envía este segundo mensaje completo:

```prompt
Esta es la versión corregida de las tres piezas del ejercicio ficticio. Revisa estos textos actuales; los textos anteriores han sido reemplazados.
Marca: Golden Rentals. Audiencia: parejas. Tono: cálido y cercano. Objetivo: presentar el ejemplo del taller e invitar a imaginar una pausa.
Hechos permitidos: fact-1 = Golden Rentals es una marca ficticia creada para este taller. No se conocen precios, promociones, ubicación, disponibilidad ni amenidades.

Pieza piece-1, ángulo angle-1, presentación:
"Conoce Golden Rentals: una marca ficticia creada para este taller. Explora el ejemplo con nosotros."
Pieza piece-2, ángulo angle-2, pausa imaginada:
"Imagina una pausa a tu ritmo. ¿Qué te gustaría hacer en ese momento?"
Pieza piece-3, ángulo angle-3, compañía:
"Soñar una escapada también puede empezar con una conversación. ¿Con quién compartirías esa idea?"

Evalúa hechos, tono, coherencia y variedad con los mismos criterios. Decide el estado a partir de los textos; no des por aprobada la revisión solo porque se presenta como corregida.
Devuelve únicamente JSON {review:{status,findings:[{pieceId,severity,category,description}],visualInspection:"HUMAN_REQUIRED"},calendar:[{pieceId,date,localTime:"",topic}]}.
review.status solo puede ser "APPROVED" o "NEEDS_REVISION". Usa NEEDS_REVISION si encuentras un problema que bloquee la aprobación textual; usa APPROVED si no lo encuentras. Si no hay observaciones, findings debe ser [].
En cada observación usa severity "blocking" o "note" y category "factual", "brand", "copy", "visual", "calendar" o "technical".
Propón exactamente tres entradas de calendar, una por pieza, con fechas distintas entre 2026-11-07 y 2026-11-13, localTime "" y un topic breve. Son fechas del ejercicio, no una solicitud de publicación. No inspecciones ni apruebes imágenes.
```

**Resultado esperado:** `review.status: "APPROVED"`, sin observaciones `blocking`, tres entradas en `calendar` y `visualInspection: "HUMAN_REQUIRED"`. Lo que cambió fue el texto: se retiraron el precio y la piscina inventados.

> [!IMPORTANT]
> **APPROVED significa revisión automática textual.** La revisión de imágenes y la aprobación humana de la campaña siguen pendientes. En ADK Web esta respuesta no cambia ni publica una campaña en la otra aplicación.

Si obtienes `NEEDS_REVISION` en la segunda prueba, lee `findings`, corrige el problema señalado y vuelve a enviar las tres piezas completas. El objetivo es satisfacer los criterios, no pedir al agente que ignore sus observaciones. La respuesta de Gemini puede variar: verifica el formato y el contenido.

</details>

### 4. Cambia la instrucción y compara

Edita la función que construye `instruction` en tu ejercicio. Detén ADK Web con **Ctrl+C**, vuelve a iniciarlo y crea una sesión nueva. Así comparas la instrucción nueva sin arrastrar la conversación anterior. Cambiar el mensaje del chat prueba una petición del usuario; cambiar `instruction` modifica las reglas del agente.

<details>
<summary>Límites y errores del laboratorio</summary>

- El servidor escucha solo en tu equipo, en el puerto 8000. No necesita `--allow_origins='*'`.
- Reserva presupuesto antes de cada llamada, con las estimaciones del laboratorio; guarda el acumulado en `.workshop-data/adk-web/lab-budget.json`. El importe indicado es un tope acumulado y no un crédito que se renueva al reiniciar. No representa el cobro real del proveedor.
- Se permiten hasta 24 llamadas por apertura y 4096 tokens de salida por llamada. Las imágenes también cuentan. Revisa las tarifas del piloto antes de impartir el taller.
- Las conversaciones están en memoria y desaparecen al cerrar. Las imágenes quedan en `.workshop-data/adk-web/images/`. No se leen campañas de `.data/`.
- Si ves un error de TODO, completa ese ejercicio. Si falla la clave o la cuota, revisa `.env` y tu cuenta. Si el puerto está ocupado, cierra la otra instancia.
- Si el proceso se interrumpió a la fuerza, puede quedar `server.lock`. Elimínalo únicamente después de comprobar que no hay otro laboratorio abierto. Conserva el registro de presupuesto.

</details>

Referencia: [interfaz web oficial de ADK](https://adk.dev/get-started/typescript/#run-with-web-interface).

## Vuelve al dashboard de edición con Gemini

Después de probar los agentes por separado, puedes ejecutar el equipo completo y editar su campaña en la aplicación. Necesitas haber completado los módulos 2 a 7.

1. En el **`.env` de esa misma carpeta**, conserva tu llave de Gemini y comprueba esta línea:

```sh
GENERATION_MODE=real
```

2. Abre **otra terminal** en la raíz del proyecto, donde está `package.json`. Si el dashboard ya estaba corriendo, detén su proceso anterior con **Ctrl+C** para que vuelva a leer `.env`. Inícialo con:

```sh
pnpm dev
```

3. Abre la dirección que imprima esa terminal. Con los puertos de las plantillas, será **http://127.0.0.1:4319** en `starter` o **http://127.0.0.1:4317** en `main`. Si cambiaste `PORT`, usa el valor que aparece en la terminal. **El puerto 8000 corresponde al chat de ADK Web.**
4. Comprueba que la cabecera del dashboard diga **“Generación con IA”**. Si tenías una campaña simulada abierta, elige **“Nueva campaña”**. Completa el brief ficticio y pulsa **“Crear mi campaña”** para ejecutar el equipo con Gemini.
5. Cuando termine la generación, abre las piezas: **“Editar texto”** permite cambiar el contenido manualmente; **“Pedir ajuste”** solicita una revisión con Gemini; **“Otra imagen”** permite generar una alternativa. Después revisa el calendario y descarga la campaña.

> [!NOTE]
> **Las pruebas de ADK Web son independientes del dashboard.** Sus conversaciones e imágenes no se incorporan automáticamente a una campaña. La campaña nueva se genera con el brief que completes en la aplicación.

Las generaciones y los ajustes con Gemini consumen tu API. El presupuesto de **5 USD del laboratorio** no se aplica al dashboard, que utiliza sus propios límites por campaña. La revisión y aprobación final siguen siendo tuyas.

## Alternativa: probar un agente desde la terminal

Esta opción muestra el resultado en la terminal y termina; no abre ADK Web. Úsala cuando quieras ejecutar el ejemplo preparado de un módulo.

Con la llave configurada y los TODO necesarios completos, ejecuta este comando desde la raíz del proyecto:

```sh
# 5 = presupuesto estimado acumulado de 5 USD para el laboratorio por terminal.
pnpm workshop:run 2 --real --allow-paid-generation --budget-usd=5
```

**¿Qué significa `--budget-usd=5`?** El laboratorio permite llamadas mientras sus reservas estimadas acumuladas quepan dentro de **5 USD**. Puedes cambiar el número para elegir otro presupuesto. Es un control local basado en estimaciones; no carga 5 USD por adelantado ni establece un límite de facturación en Google.

Puedes usar 2 (Estratega), 4 (Redactor), 5 (Diseñador, una imagen) o 6 (Editor). Cada ejecución tiene un máximo de seis llamadas contando la imagen. El Diseñador requiere los módulos 3 y 5. La salida real varía; aquí sí puedes comparar el efecto de tus instrucciones.

El laboratorio reserva una estimación conservadora antes de cada llamada y conserva el acumulado en `.workshop-data/lab-budget.json`. El presupuesto indicado es un tope acumulado para ese laboratorio, no un monto adicional por ejecución. El registro usa las tarifas documentadas al preparar el piloto y debe revisarse antes de impartir el workshop; no es una factura de Google. La interfaz web y el script `real:validate` tienen controles separados. `--solution` selecciona expresamente la solución, nunca se usa como recuperación automática de un TODO pendiente.

Una ejecución real conserva sus archivos en la carpeta temporal indicada en la salida; el Diseñador muestra la ruta de la imagen. Los módulos 3 y 7 se comprueban offline. La campaña completa se prueba después desde la web.

Si se cerró a la fuerza un laboratorio real, puede quedar `.workshop-data/lab.lock`. Comprueba que no haya otra ejecución activa antes de eliminar ese archivo. El registro de reservas debe conservarse.
