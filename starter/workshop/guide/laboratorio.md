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
