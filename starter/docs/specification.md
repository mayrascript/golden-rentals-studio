# Especificación de Content Creator Team para Golden Rentals

Versión 1.0 · 5 de noviembre de 2026

Documento de producto, implementación y workshop. Preparado para entregar a Antigravity u otra herramienta de desarrollo sin depender del historial de una conversación.

## 1 Propósito y alcance confirmado

Construir una aplicación web educativa con cuatro agentes de IA que produzca una campaña de Instagram con copies, imágenes y calendario editorial. El caso base es Golden Rentals, una marca ficticia de renta corta. Cada participante podrá adaptar la marca desde la interfaz sin modificar el código de los agentes.

La experiencia debe permitir comprender el flujo, generar contenido, revisarlo, editarlo y descargarlo. El resultado siempre será una propuesta revisable. El sistema no publicará en Instagram, programará publicaciones reales, tomará reservas ni enviará mensajes.

El alcance confirmado es una versión básica para workshop. No se implementará ni se prometerá una versión completa de seis agentes o microservicios. La orquestación será local, explícita y fácil de observar. A2A y MCP no forman parte de esta entrega porque no resuelven una necesidad del alcance acordado.

### Requisitos confirmados

- Interfaz web utilizable durante un workshop.
- Entre tres y cuatro agentes; esta especificación concreta cuatro para separar las responsabilidades.
- ADK oficial de Google para TypeScript como base de los agentes.
- Campaña de Instagram con copies, imágenes y calendario.
- Golden Rentals como ejemplo ficticio de renta corta.
- Marca adaptable por los participantes.
- Tutorial en español y repositorio descargable.
- Especificación autocontenida y portable a otra herramienta de desarrollo.
- Revisión humana antes de considerar aprobada una campaña.
- Ningún hecho, identidad, estilo personal o activo de propiedades reales en los materiales de ejemplo.

### Decisiones propuestas para implementar sin bloquear el inicio

- Tres publicaciones estáticas y tres imágenes por campaña.
- Calendario editorial de siete días con tres fechas sugeridas, nunca publicaciones programadas en una red social.
- Una instancia local por participante, sin cuentas ni servicio compartido multiusuario.
- Español como idioma inicial.
- React con Vite para la interfaz; Node.js y TypeScript para el servidor.
- Ejecución simulada disponible sin credenciales y modo real habilitado mediante configuración del servidor.
- Datos locales y archivos de salida, sin base de datos externa ni almacenamiento en nube.

Estas propuestas son parámetros de implementación, no preferencias permanentes de la propietaria del proyecto.

## 2 Resultados esperados

Al completar una campaña, la persona verá:

1. Brief de la marca y del objetivo.
2. Estrategia breve con tres ángulos de contenido.
3. Tres copies con gancho, cuerpo, CTA y hashtags propuestos.
4. Una imagen por pieza y su texto alternativo.
5. Revisión automática con observaciones concretas.
6. Calendario editorial de siete días.
7. Estado de revisión humana de cada pieza y de la campaña.
8. Paquete descargable con contenido y metadatos.

Al completar el workshop, la persona podrá explicar la diferencia entre agente, herramienta, skill, workflow y aprobación humana; cambiar la marca; modificar un prompt; ejecutar una prueba; y reproducir la demo desde una descarga limpia.

## 3 Caso ficticio y datos de demostración

Golden Rentals será el nombre del caso educativo. No se debe buscar una empresa con ese nombre ni reutilizar su identidad. La coincidencia con una organización real no autoriza importar sus datos o activos.

El encabezado de la demo y sus exportaciones mostrarán «Golden Rentals · Ejemplo educativo». Las piezas de prueba se identificarán como contenido de demostración.

### Ficha de ejemplo

- Actividad: alojamiento de renta corta.
- Alojamiento: Apartamento Demo Uno.
- Ubicación: no especificada.
- Capacidad de ejemplo: dos huéspedes.
- Características de ejemplo: una habitación, cocina equipada y escritorio.
- Tono inicial: cercano, claro y hospitalario.
- Paleta propuesta: crema, carbón y dorado suave, con contraste accesible en la interfaz.
- Audiencia: personas que planean una estancia corta por ocio o trabajo, sin segmentación por atributos sensibles.
- Objetivo: presentar la experiencia de alojamiento y explicar qué información revisar antes de reservar.
- Precio, disponibilidad, dirección, registro turístico y condiciones de cancelación: no proporcionados.
- CTA inicial: «Explora la propuesta de tu próxima estancia». No tendrá enlace ni contacto real.

Las características anteriores serán datos inventados de un archivo de prueba. Se marcarán como SYNTHETIC_CONFIRMED, que significa consistencia con el caso ficticio, no verificación del mundo real.

### Reglas de precisión

No inventar tarifas, descuentos, disponibilidad, distancias, velocidades de internet, vistas, accesibilidad, licencias, reseñas o políticas. No afirmar que el alojamiento existe. No presentar imágenes generadas como fotografías de una propiedad real.

El repositorio incluirá una fuente sintética identificada por archivo y localizador. Una prueba separada añadirá una característica contradictoria para comprobar que el sistema la bloquea o solicita aclaración. No se consultarán cuentas, documentos, fotografías ni guías de marca privadas para completar el ejemplo.

## 4 Arquitectura básica

La aplicación tendrá tres componentes: interfaz web, servidor TypeScript y proveedores de generación. Los cuatro agentes se ejecutarán dentro del mismo servidor mediante ADK. Una capa de orquestación determinista decidirá el orden, los límites, la persistencia y los puntos de revisión.

El navegador nunca llamará directamente a un proveedor con una clave secreta. El servidor expondrá una API propia para iniciar campañas, consultar estado, revisar piezas y descargar resultados.

Flujo principal: brief → validación → estrategia → copies → imágenes → revisión y calendario → revisión humana → exportación.

El orquestador es código de aplicación, no un quinto agente. Los cambios de estado y los permisos no dependerán exclusivamente de instrucciones escritas en un prompt.

### Cuatro agentes

**Estratega.** Convierte el brief y los hechos permitidos en objetivo, audiencia contextual, tono y tres ángulos. Recibe datos aportados; no necesita Google Search en esta versión. No fabrica investigación ni estadísticas.

**Redactor.** Produce los tres copies a partir de estrategia, marca y hechos. Usa una skill local versionada con reglas de escritura y criterios de Instagram. Devuelve salidas estructuradas y referencias a los hechos usados.

**Diseñador.** Produce un concepto visual por pieza y llama a una herramienta de generación de imágenes. La herramienta guarda el archivo y devuelve su referencia. El agente genera también texto alternativo y una descripción de la intención visual. En modo simulado devuelve activos de prueba claramente identificados.

**Editor y planificador.** Revisa coherencia, tono, afirmaciones, correspondencia entre copy e imagen y variedad de la campaña. Genera un calendario sugerido. Devuelve APPROVED o NEEDS_REVISION para la revisión automática, junto con observaciones por pieza. Su decisión no equivale a aprobación humana.

### Por qué no incluir A2A ni MCP

Los agentes comparten proceso y contratos. No existe una necesidad de comunicación remota que justifique A2A. El calendario se genera y descarga dentro de la aplicación; no requiere un agente que escriba en Notion. Notion se usará para el tutorial, no como dependencia de ejecución. No agregar servidores de protocolos, OAuth, microservicios ni un roadmap distribuido en esta entrega.

## 5 Experiencia web

### Pantalla de inicio

Explica en una frase el ejercicio y ofrece «Usar Golden Rentals» o «Personalizar marca». Muestra el modo activo, simulado o real, y un aviso de que no se publicará nada.

### Formulario de brief

Campos: nombre de marca, descripción, tono, audiencia contextual, objetivo, características permitidas, restricciones, paleta, fecha inicial del calendario y zona horaria. El número inicial de piezas es tres. Se permiten volver atrás y guardar cambios sin perder el formulario.

La personalización afecta prompts, encabezados y resultados. No cambia los límites de seguridad, ni las reglas sobre veracidad y aprobación. No se importan automáticamente logos, perfiles de redes o materiales de una marca.

### Progreso visible

Muestra agente activo, fase, piezas terminadas, tiempo transcurrido y errores recuperables. No muestra razonamiento interno del modelo. Incluye cancelar, deshabilita dobles inicios y explica si ya se produjo una imagen facturable antes de cancelar.

### Revisión de resultados

Cada tarjeta muestra copy editable, imagen, texto alternativo, hechos usados y observaciones. Permite copiar texto, editar, pedir una revisión dirigida o regenerar solo esa imagen. Una nueva versión invalida la aprobación previa de la pieza afectada y obliga a actualizar el calendario si cambia su contenido o propósito.

### Calendario

Vista simple de lista o tabla con fecha, hora opcional, zona horaria, tema, pieza y estado. Las fechas se pueden editar. La interfaz dirá «Sugerencia editorial», sin afirmar que son horarios óptimos ni que están programados en Instagram.

### Aprobación y descarga

La persona puede marcar cada pieza como revisada. La aprobación global se vincula a la versión exacta del paquete. Se permite descargar un borrador con marca DRAFT; un paquete aprobado requiere que no haya bloqueos y que todas sus piezas estén aprobadas.

### Accesibilidad y pantallas pequeñas

Usar etiquetas visibles, navegación con teclado, foco perceptible, mensajes anunciables y contraste suficiente. Los estados no dependerán solo de colores. La interfaz debe ser cómoda en portátil y funcional en una pantalla móvil. No requiere una app nativa.

## 6 Requisitos funcionales

**RF01 Marca configurable.** Cambiar nombre, tono y paleta desde la web sin editar código. Los resultados de otra campaña no se filtrarán a la nueva.

**RF02 Brief validado.** Rechazar campos indispensables vacíos y explicar los errores en el formulario. Las características no verificadas no se convertirán en afirmaciones.

**RF03 Campaña completa.** Crear exactamente tres piezas, tres referencias de imagen y tres entradas del calendario en la configuración inicial.

**RF04 Contratos de salida.** Validar las respuestas de los agentes con esquemas. Una respuesta inválida no avanzará silenciosamente.

**RF05 Revisión acotada.** Permitir una ronda automática de corrección textual, configurable, sin bucles indefinidos. La segunda revisión fallida requiere intervención humana.

**RF06 Imágenes reales o simuladas.** El modo real debe generar archivos mediante el proveedor configurado. Un placeholder o un prompt de imagen no cuenta como generación real. El modo simulado debe identificarse siempre.

**RF07 Revisión visual explícita.** Si el modelo revisor puede inspeccionar imágenes, registrar esa comprobación. Si no puede, dejar la revisión visual pendiente para el humano; no declarar que se revisaron los píxeles.

**RF08 Edición y versiones.** Conservar versión, fecha y relación con la pieza original. Nunca sobrescribir silenciosamente una edición manual.

**RF09 Calendario coherente.** Cada entrada enlaza a una pieza existente y respeta fecha inicial y zona horaria. El calendario no ejecuta acciones externas.

**RF10 Exportación.** Descargar un ZIP con campaign.json, copies.md, calendar.csv, manifest.json e imágenes. Incluir estado de aprobación y una advertencia de demostración cuando corresponda.

**RF11 Persistencia local.** Recuperar campañas existentes al recargar la página. Si se reinicia el servidor durante una ejecución, marcarla como interrumpida y permitir continuar desde resultados completos o iniciar una nueva; no afirmar reanudación transparente sin implementarla.

**RF12 Errores útiles.** Mostrar qué falló, qué se conservó y qué puede repetirse. No perder copies cuando falla una imagen.

**RF13 Cancelación y duplicados.** Detener nuevos pasos cuando se cancela. Una solicitud repetida con la misma clave no dispara una campaña adicional.

**RF14 Control del gasto.** Mostrar modo de ejecución, límites y consumo conocido. Avisar cuando el costo sea una estimación y no una factura.

## 7 Contratos de datos

Los siguientes nombres pertenecen a la aplicación. No son APIs supuestas de ADK. Implementar tipos TypeScript y validación Zod equivalentes.

### BrandProfile

brandId, name, description, tone, audience, objective, palette, allowedClaims, forbiddenClaims y locale. Cada campaña conserva una copia del perfil usado para evitar que un cambio posterior altere campañas históricas.

### FactRecord

factId, statement, value, unit opcional, sourceId, locator, status y note. Estados: SYNTHETIC_CONFIRMED, USER_PROVIDED, UNVERIFIED y CONFLICTING. USER_PROVIDED no significa verificación independiente. El ejemplo solo contiene hechos sintéticos identificados.

### CampaignBrief

campaignId, brandProfile, factIds, objective, startDate, timeZone, pieceCount, constraints, mode y limits. La fecha y la zona horaria se validan por separado. No inferir la zona horaria desde el idioma.

### Strategy

campaignId, summary, contentAngles, toneRules, factIds y openQuestions. Cada ángulo tiene angleId y propósito.

### ContentPiece

pieceId, version, angleId, hook, body, cta, hashtags, factIds, visualBrief, altText, imageId, reviewStatus y humanApproval. Los hashes se calculan en código.

### ImageAsset

imageId, pieceId, version, relativePath, mimeType, width, height, checksum, generationMode, modelId opcional, promptVersion y disclosure. No guardar credenciales ni URLs privadas con tokens permanentes.

### ReviewReport

reviewId, packageHash, overallStatus y findings. Cada hallazgo tiene pieceId, severity, category, description y suggestedFix. Categorías: factual, brand, copy, visual, calendar y technical. Incluir visualInspection como PERFORMED o HUMAN_REQUIRED.

### CalendarEntry

entryId, pieceId, date, localTime opcional, timeZone, contentAngle y status. El estado describe la revisión del contenido; no existe un estado PUBLISHED en esta versión.

### CampaignRun

runId, campaignId, state, activeAgent, startedAt, updatedAt, completedSteps, usage, limits y error. Estados: DRAFT, RUNNING, NEEDS_INPUT, NEEDS_REVIEW, APPROVED, FAILED, INTERRUPTED y CANCELLED.

### ApprovalRecord

reviewerLabel, approvedAt, packageHash y decision. En la aplicación local reviewerLabel es una etiqueta del usuario, no una identidad corporativa autenticada. No presentar este registro como firma legal.

## 8 API y límites entre componentes

API de aplicación propuesta:

- POST /api/campaigns crea un brief validado.
- POST /api/campaigns/:id/run inicia el flujo con clave de idempotencia.
- GET /api/campaigns/:id obtiene campaña, estado y resultados.
- GET /api/campaigns/:id/events entrega progreso por SSE o, como alternativa simple, polling.
- PATCH /api/campaigns/:id/pieces/:pieceId guarda una edición versionada.
- POST /api/campaigns/:id/pieces/:pieceId/revise solicita una revisión dirigida.
- POST /api/campaigns/:id/pieces/:pieceId/image regenera únicamente esa imagen.
- PATCH /api/campaigns/:id/calendar guarda fechas sugeridas.
- POST /api/campaigns/:id/approve registra aprobación de un hash vigente.
- POST /api/campaigns/:id/cancel evita nuevos pasos.
- GET /api/campaigns/:id/export descarga un borrador o paquete aprobado.

Adaptadores internos: ModelProvider, ImageProvider, CampaignStore, ArtifactStore y UsageTracker. Cada uno tendrá implementación simulada o real cuando corresponda. La selección del modo se hará en el servidor.

Todos los accesos a archivos validarán que la ruta pertenece a la carpeta de la campaña. Los errores devolverán código, mensaje seguro, posibilidad de reintento y estado de la operación. No devolver trazas internas o secretos al navegador.

## 9 Herramientas y skill del Redactor

La herramienta de imágenes recibe un prompt validado, formato de salida, campaignId y pieceId. Devuelve metadatos y una referencia de archivo. El servidor comprueba el límite antes de invocar al proveedor.

La skill del Redactor contendrá un SKILL.md con reglas de tono, estructura, variaciones, CTA, uso de hechos y ejemplos ficticios. Sus recursos adicionales no copiarán el estilo personal de la organizadora. Se cargarán mediante las capacidades oficiales disponibles en la versión fijada de ADK.

Skills figura como función experimental en la documentación actual. La implementación debe probar su API concreta y documentar la versión. No sustituir silenciosamente el uso de la skill por un archivo ignorado. Si existe una incompatibilidad real, reportarla y proponer una alternativa explícita antes de cambiar ese objetivo educativo. Referencia: https://adk.dev/skills/

## 10 Seguridad y privacidad

- Mantener claves solo en el servidor mediante variables de entorno. No usar variables públicas de Vite para secretos.
- Incluir .env.example sin valores y excluir .env de Git y de exportaciones.
- Vincular el servidor local a 127.0.0.1 por defecto. No exponerlo públicamente ni habilitar túneles sin una decisión separada.
- Permitir solo los orígenes locales esperados. Validar tamaño y formato de las solicitudes.
- No ofrecer una instalación compartida con datos de varias personas sin autenticación y aislamiento adecuados. Ese despliegue no forma parte de esta versión.
- Tratar el texto aportado como datos; no permitir que ordene leer secretos, cambiar herramientas o saltar aprobaciones.
- No ejecutar scripts proporcionados por participantes ni habilitar herramientas de shell para los agentes.
- Usar rutas y nombres de archivo saneados. Prevenir traversal y acceso a archivos ajenos a la campaña.
- Neutralizar fórmulas al exportar texto libre a CSV para evitar ejecución al abrirlo en una hoja de cálculo.
- No registrar claves, prompts con información privada innecesaria ni datos de pago.
- No incluir información de huéspedes, contactos, reservas o propiedades reales en fixtures, tests o tutorial.
- Las imágenes de demostración se identificarán como generadas o conceptuales. No fabricar reseñas ni testimonios.
- No incorporar herramientas para Instagram, pagos, reservas, email, mensajería o administración de cuentas.

## 11 Costos y límites de ejecución

El modo simulado no realiza llamadas a proveedores. Es la opción de inicio para comprobar instalación, enseñar el flujo y continuar si hay problemas de conexión.

El modo real requiere un modelo de texto y uno de imágenes compatibles, seleccionados durante la implementación. No fijar nombres antiguos sin verificar disponibilidad y condiciones. Los identificadores se configurarán en el servidor y quedarán registrados en los metadatos de ejecución.

Límites propuestos por campaña: tres imágenes iniciales, hasta tres regeneraciones explícitas, una ronda automática de corrección textual, un máximo de doce llamadas de modelo y una campaña concurrente por instancia. Las iteraciones internas de cada agente también cuentan en el límite.

Antes de una regeneración, la aplicación explica que puede tener costo. El servidor impone los límites y permite cancelación. No iniciar reintentos ilimitados después de un timeout.

Registrar tokens cuando el proveedor los reporte, cantidad de imágenes, llamadas y duración. Calcular costo solo con tarifas identificadas y fechadas; si faltan datos, mostrar «Costo no disponible». El presupuesto monetario para el workshop se define antes de habilitar llamadas reales a escala. Este documento no autoriza contratar servicios ni realizar cargos.

## 12 Repositorio y entregables de implementación

Estructura propuesta, ajustable si se conserva la separación de responsabilidades:

- README.md con instalación, demo y recorrido.
- package.json y lockfile con scripts reproducibles.
- .env.example y .gitignore.
- apps/web/src para formulario, progreso, tarjetas, calendario y descarga.
- apps/server/src/api para endpoints.
- apps/server/src/agents para los cuatro agentes.
- apps/server/src/workflow para control de estados y límites.
- packages/contracts para esquemas y tipos.
- packages/providers para modelos e imágenes, reales y simulados.
- packages/storage para campañas y archivos locales.
- skills/instagram-copy para la skill y ejemplos genéricos.
- examples/golden-rentals para marca y hechos ficticios.
- fixtures/images para activos simulados con licencia clara.
- tests/unit, tests/integration y tests/e2e.
- docs/tutorial para contenido versionado de los módulos.
- docs/decisions para decisiones técnicas y límites conocidos.
- docs/notion-map.md para correspondencia entre módulos y páginas del tutorial.
- scripts para validación y empaquetado.

Scripts esperados: dev, build, start, typecheck, lint, test, test:e2e y demo:validate. Documentar sus nombres definitivos y ejecutarlos antes de afirmar que funcionan.

La entrega de software incluirá código fuente, instrucciones, pruebas, datos ficticios y un ZIP limpio. Excluir node_modules, secretos, campañas personales y archivos temporales. No se requiere crear un repositorio público para entregar la descarga. Cualquier publicación de código o tutorial se decidirá por separado.

## 13 Tutorial y estructura en Notion

GitHub será la fuente de verdad del código, pruebas y documentación versionada cuando se disponga del repositorio. Notion será el recorrido de lectura para participantes. Durante la preparación se pueden mantener los capítulos en docs/tutorial sin crear páginas ni otorgar acceso público.

Cada módulo de Notion tendrá objetivo, conocimientos previos, conceptos, pasos, archivos modificados, comandos, resultado esperado, prueba de salida, errores frecuentes y enlace a un checkpoint. Los enlaces apuntarán a un tag o commit verificado, no a un código que cambie sin control. No inventar URLs antes de crear los recursos.

### Módulos del workshop

**Módulo 1 Preparación y demo.** Instalar, abrir la web y ejecutar Golden Rentals en modo simulado. Checkpoint: aparecen tres copies, tres imágenes de prueba y tres entradas de calendario.

**Módulo 2 Marca y brief.** Cambiar nombre, tono y objetivo. Checkpoint: la segunda campaña usa el perfil nuevo y conserva intacta la primera.

**Módulo 3 Primer agente y contratos.** Construir el Estratega y validar una salida. Checkpoint: una respuesta inválida se detecta y se muestra un error útil.

**Módulo 4 Redactor y skill.** Cargar la skill y generar piezas a partir de hechos permitidos. Checkpoint: no aparece una tarifa inexistente y cada afirmación factual tiene referencia.

**Módulo 5 Diseñador e imágenes.** Integrar la herramienta de imágenes y el almacenamiento local. Checkpoint: se abre un archivo real en modo real y la interfaz distingue ambos modos.

**Módulo 6 Editor y calendario.** Detectar una contradicción, corregir copy y proponer fechas. Checkpoint: el flujo se detiene al alcanzar el límite de revisión.

**Módulo 7 Revisión humana y exportación.** Editar, aprobar y descargar. Checkpoint: editar después de aprobar invalida la aprobación y el ZIP refleja la nueva versión.

**Módulo 8 Pruebas y cierre.** Ejecutar pruebas, revisar costos y reproducir desde una descarga limpia. Checkpoint: el informe indica pruebas pasadas, fallidas y no ejecutadas.

La duración de cada módulo se calibra con un ensayo del workshop. No prometer una duración total sin conocer el nivel del grupo. Las páginas del tutorial y las campañas de los participantes deben mantenerse separadas.

## 14 Fases de implementación

### Fase A Base funcional simulada

Construir web, contratos, persistencia, cuatro agentes o dobles de prueba equivalentes, orquestación y exportación. Salida: recorrido completo en modo simulado, sin credenciales ni llamadas externas. La documentación distinguirá los agentes reales de los dobles usados en tests.

### Fase B Integración real con ADK

Fijar SDK y modelos, implementar los cuatro agentes, cargar la skill y conectar la herramienta de imágenes. Salida: una campaña real de tres piezas con consumo registrado y resultados abiertos desde la interfaz.

### Fase C Revisión y robustez

Agregar edición versionada, aprobación, correcciones dirigidas, cancelación, errores, límites y recuperación tras recarga. Salida: pasan las pruebas críticas y no se pierden resultados completos en un fallo parcial.

### Fase D Material de workshop

Preparar tutorial, checkpoints, repositorio o paquete descargable, instrucciones y ensayo de instalación limpia. Salida: otra persona puede reproducir el ejercicio sin conocer el historial del proyecto.

Estas fases terminan en la aplicación web básica acordada. No incluyen A2A, MCP, seis agentes, Cloud Run, Agent Runtime, publicación social ni una extensión distribuida comprometida.

## 15 Pruebas y criterios de aceptación

### Pruebas unitarias

Validación de brief; referencias a hechos; fechas y zonas horarias; límites de llamadas; hashes de aprobación; selección de modo; saneamiento de rutas y CSV; cambios de estado.

### Pruebas de integración

Contratos entre agentes; herramienta de imágenes; persistencia; exportación; propagación de errores. Separar pruebas deterministas con mocks de las que requieren proveedores reales.

### Pruebas de interfaz

Carga de demo; personalización; botones repetidos; volver atrás; recarga durante ejecución; cancelación; edición manual; regeneración de una imagen; revisión; descarga; teclado y vista estrecha.

### Pruebas adversariales

Una instrucción en el brief pide revelar una clave. Un hecho contradictorio intenta introducir una piscina. Un copy incluye un precio ausente. Un nombre de archivo intenta escapar de la carpeta. Un campo CSV empieza con fórmula. Un texto afirma que el usuario ya aprobó. Ninguno debe saltar los controles.

### Criterios de aceptación obligatorios

- CA01 La web abre localmente siguiendo solo el README.
- CA02 La demo simulada funciona sin credenciales y sin llamadas externas.
- CA03 Existen exactamente cuatro agentes ADK en el modo real y un orquestador determinista.
- CA04 Una campaña produce tres copies, tres imágenes y tres entradas de calendario.
- CA05 La personalización cambia la marca sin editar código y no modifica campañas anteriores.
- CA06 No aparecen precios, disponibilidad ni amenidades fuera de los hechos permitidos del caso de prueba.
- CA07 Cada imagen real tiene archivo legible, metadatos y referencia desde su pieza.
- CA08 La aplicación permite editar texto y regenerar una sola imagen sin reiniciar toda la campaña.
- CA09 Cambiar contenido invalida su aprobación y el hash del paquete.
- CA10 Se exporta un ZIP que abre, conserva sus archivos y distingue borrador de aprobado.
- CA11 No hay credenciales en código, navegador, logs de prueba o exportaciones.
- CA12 Una repetición de solicitud no genera una campaña duplicada.
- CA13 La cancelación y el límite de revisiones impiden nuevos pasos.
- CA14 La interfaz muestra con claridad los errores y conserva resultados completos.
- CA15 Typecheck, lint, pruebas unitarias y pruebas principales de interfaz pasan, o se informa exactamente qué quedó sin verificar.
- CA16 El tutorial enlaza checkpoints existentes y la descarga limpia reproduce el ejemplo.

La revisión automática ayuda a detectar problemas; no se afirmará que garantiza exactitud absoluta. No establecer una promesa de latencia antes de medir el proveedor y el equipo usados en el workshop.

## 16 Compatibilidad y fuentes técnicas

Usar @google/adk y @google/adk-devtools del proyecto oficial. Fijar versiones probadas en el lockfile y registrar Node.js, npm, SDK, modelos y fecha de validación. No ejecutar npx adk sin identificar el paquete, porque el README oficial advierte de un paquete no relacionado con ese nombre.

El quickstart actual recomienda Node.js 24.13.0 o posterior y npm 11.8.0 o posterior; el README declara un mínimo distinto. Al implementar, verificar los requisitos de la versión seleccionada y documentar la combinación que realmente pase instalación y pruebas.

Graph Workflows está documentado para TypeScript desde ADK v2.0.0. Puede usarse para expresar el flujo básico si su API fijada queda probada. También es aceptable un workflow secuencial controlado en TypeScript que conserve los mismos estados, validación y límites. No introducir un grafo complejo solo para reproducir el diagrama original.

El codelab de Creative Studio es una referencia conceptual en Python. No copiar imports ni comandos como si fueran TypeScript, ni adoptar su infraestructura distribuida como requisito de este proyecto.

Fuentes oficiales consultadas:

- ADK TypeScript y advertencia sobre el paquete CLI: https://github.com/google/adk-js
- Preparación TypeScript: https://adk.dev/get-started/typescript/
- Graph Workflows: https://adk.dev/graphs/
- Skills y estado experimental: https://adk.dev/skills/
- Codelab de referencia conceptual: https://codelabs.developers.google.com/ai-creative-studio-adk-a2a?hl=es_419

## 17 Instrucciones para Antigravity u otra herramienta

Este documento es la especificación completa de la versión básica. No hace falta reconstruir conversaciones anteriores.

1. Inspeccionar el repositorio existente y sus instrucciones si se proporciona uno. Si no existe, preparar la estructura del proyecto dentro del directorio autorizado.
2. Mantener el alcance de cuatro agentes, una aplicación web y un proceso local de servidor. No añadir infraestructura distribuida ni herramientas externas de publicación.
3. Verificar dependencias y APIs oficiales, fijar versiones y registrar decisiones técnicas.
4. Implementar primero el recorrido simulado y sus pruebas, después integrar los proveedores reales.
5. Usar solo Golden Rentals y los datos sintéticos de esta especificación como material inicial. No buscar ni importar información de la organizadora o de propiedades reales.
6. Dejar la marca configurable desde la web y mantener prompts, esquemas y proveedores separados.
7. Hacer cumplir validación, costos, límites y aprobación en código, no solo con prompts.
8. No publicar repositorios, páginas, aplicaciones ni archivos. No desplegar, crear accesos persistentes, contratar servicios ni transmitir datos privados sin el permiso correspondiente.
9. Ante una incompatibilidad o falta de credenciales, informar el punto exacto, conservar los avances y continuar con el modo simulado cuando sea posible. No afirmar que se ejecutó una integración que solo está simulada.
10. Antes de entregar, ejecutar las comprobaciones, revisar la interfaz y producir una descarga limpia. Informar qué funciona, qué se probó y qué permanece pendiente.

## 18 Definición de terminado

La versión estará terminada cuando el recorrido web permita personalizar Golden Rentals, generar tres piezas con sus imágenes, revisar y editar contenido, preparar un calendario, aprobar una versión y descargarla. El código deberá estar acompañado por pruebas, tutorial y una instalación reproducible.

Los datos de demostración serán ficticios, las claves permanecerán fuera del cliente y no se habrá publicado ni programado contenido en servicios externos. Cualquier limitación del modo real quedará explícita. No quedan decisiones de producto que impidan comenzar el prototipo simulado; modelos, credenciales y presupuesto se resolverán antes de activar consumo real.
