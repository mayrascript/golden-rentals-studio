# Laboratorio por agente

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

## Ejecutar un agente con Gemini

Completa los TODO necesarios y configura tu `.env`. Elige un presupuesto máximo para las pruebas de este laboratorio. Después sustituye `IMPORTE` en este comando por ese número:

```sh
pnpm workshop:run 2 --real --allow-paid-generation --budget-usd=IMPORTE
```

Puedes usar 2 (Estratega), 4 (Redactor), 5 (Diseñador, una imagen) o 6 (Editor). Cada ejecución tiene un máximo de seis llamadas contando la imagen. El Diseñador requiere los módulos 3 y 5. La salida real varía; aquí sí puedes comparar el efecto de tus instrucciones.

El laboratorio reserva una estimación conservadora antes de cada llamada y conserva el acumulado en `.workshop-data/lab-budget.json`. El presupuesto indicado es un tope acumulado para ese laboratorio, no un monto adicional por ejecución. El registro usa las tarifas documentadas al preparar el piloto y debe revisarse antes de impartir el workshop; no es una factura de Google. La interfaz web y el script `real:validate` tienen controles separados. `--solution` selecciona expresamente la solución, nunca se usa como recuperación automática de un TODO pendiente.

Una ejecución real conserva sus archivos en la carpeta temporal indicada en la salida; el Diseñador muestra la ruta de la imagen. Los módulos 3 y 7 se comprueban offline. La campaña completa se prueba después desde la web.

Si se cerró a la fuerza un laboratorio real, puede quedar `.workshop-data/lab.lock`. Comprueba que no haya otra ejecución activa antes de eliminar ese archivo. El registro de reservas debe conservarse.

## Conversa con cada agente en ADK Web

> [!IMPORTANT]
> **Práctica opcional con Gemini real.** ADK Web permite escribir mensajes y observar eventos de herramientas. Necesitas tu propia clave en `.env`. El modo `simulated` de la aplicación no convierte ADK Web en un chat simulado.

### 1. Abre el laboratorio

Completa los TODO del especialista que quieres probar y ejecuta su comprobación offline. Después, en la raíz del proyecto, sustituye `IMPORTE` por el presupuesto que hayas elegido:

```sh
pnpm workshop:web --allow-paid-generation --budget-usd=IMPORTE
```

Abre **http://127.0.0.1:8000**. En el selector de agentes encontrarás **strategist**, **copywriter**, **designer** y **editor**. Elige uno y crea una sesión nueva. No hace falta tener terminados todos los agentes para probar el Estratega.

El laboratorio usa tus funciones de `workshop/exercises/`. Si falta un TODO, muestra el error; no sustituye tu código por la solución.

### 2. Elige un especialista y envía una instrucción

<details>
<summary>Estratega · Genera tres ángulos a partir de un brief</summary>

Requiere el módulo 2. Selecciona **strategist** y pega:

```text
Marca ficticia: Golden Rentals. Audiencia: parejas que buscan una escapada tranquila. Objetivo: dar a conocer la marca.
Hechos permitidos: fact-1 = marca de alojamientos ficticia para este taller; fact-2 = comunicación cálida y cercana. No se conocen precios, ubicación ni amenidades.
Propón tres ángulos distintos basados solo en estos hechos. Devuelve JSON con summary y angles: [{angleId, title, purpose}]. Usa angle-1, angle-2 y angle-3.
```

**Observa:** tres enfoques distintos, ninguna búsqueda externa y ningún precio inventado. Cambia la audiencia y compara una nueva respuesta.

</details>

<details>
<summary>Redactor · Observa cómo consulta su skill</summary>

Requiere el módulo 4. Selecciona **copywriter** y pega:

```text
Marca ficticia: Golden Rentals. Audiencia: parejas. Tono cálido.
Hechos: fact-1 = marca ficticia del taller; fact-2 = comunicación cercana.
Estrategia: invitar a imaginar una pausa sin prometer características del alojamiento.
Ángulos: angle-1 = hacer una pausa; angle-2 = imaginar una escapada; angle-3 = compartir un deseo de viaje.
Carga instagram-copy y references/estructuras.md. Escribe tres publicaciones. Devuelve JSON {pieces:[{pieceId,angleId,hook,body,cta,hashtags,factIds}]}, con piece-1, piece-2 y piece-3. No inventes precios ni servicios.
```

**Observa:** eventos `load_skill` y `load_skill_resource`, seguidos de tres textos. Pega los resultados del Estratega si quieres trabajar con tu propia estrategia: el Redactor no los recibe automáticamente al cambiar el selector.

</details>

<details>
<summary>Diseñador · Ejecuta una tool y revisa la imagen</summary>

Requiere los módulos 3 y 5. Selecciona **designer** y pega:

```text
Diseña una única imagen conceptual para piece-1 de una marca de alojamientos ficticia. Concepto: la sensación de una pausa, luz suave y paleta arena y coral. No representes una propiedad real ni incluyas texto o logotipos.
Usa generate_campaign_image una sola vez para piece-1. Incluye un altText que indique que es una imagen generada por IA de un alojamiento ficticio. Devuelve la referencia obtenida de la herramienta.
```

**Observa:** nombre y argumentos de la tool, resultado con ruta local y un artefacto de imagen en ADK Web. Esta prueba consume una generación de imagen además de las llamadas de texto. Inspecciona la imagen tú; el Editor no hace revisión de píxeles.

</details>

<details>
<summary>Editor · Prueba una afirmación que no está respaldada</summary>

Requiere el módulo 6. Selecciona **editor** y pega:

```text
Revisa este ejemplo ficticio. Hechos permitidos: fact-1 = Golden Rentals es una marca ficticia del taller.
Pieza piece-1, ángulo angle-1: “Reserva hoy por $50 con piscina privada”. Esos datos no están en los hechos.
Pieza piece-2, ángulo angle-2: “Imagina tu próxima pausa”.
Pieza piece-3, ángulo angle-3: “¿Con quién compartirías una escapada?”.
Devuelve JSON {review:{status,findings:[{pieceId,severity,category,description}],visualInspection:"HUMAN_REQUIRED"},calendar:[{pieceId,date,localTime:"",topic}]} con tres fechas entre 2026-11-07 y 2026-11-13. Señala las afirmaciones sin respaldo; no apruebes imágenes.
```

**Observa:** debería señalar el precio y la piscina como datos no respaldados. La respuesta del modelo puede fallar: compárala con el contrato del módulo 6 y con tu criterio.

</details>

### 3. Cambia la instrucción y compara

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
