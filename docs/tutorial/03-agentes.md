# 3 Primer agente y contratos

Objetivo: reconocer un agente ADK y validar su salida. Necesitas entender funciones asíncronas y objetos TypeScript.

## Pasos

1. Abre [team.ts](../../apps/server/src/agents/team.ts) y sigue su exportación a [07-workflow.ts](../../workshop/exercises/07-workflow.ts). La fábrica reúne cuatro agentes definidos en los archivos de ejercicios.
2. Abre [02-strategist.ts](../../workshop/exercises/02-strategist.ts) e identifica el nombre, modelo e instrucción del Estratega. La configuración compartida está en workshop/support.ts. El modelo se configura en el servidor; el navegador no recibe la clave.
3. Lee `strategySchema` en [contracts](../../packages/contracts/index.ts). La salida contiene un resumen y exactamente tres ángulos.
4. Sigue `strategy` en [adk.ts](../../packages/providers/adk.ts): el Runner crea una sesión aislada, recoge la salida y el contrato la valida.
5. Compara con `strategy` en el proveedor simulado. Comparten forma de salida; solo el modo real invoca ADK.

Un agente combina modelo e instrucciones y puede disponer de herramientas. Una herramienta ejecuta una operación delimitada. Una skill contiene conocimiento reutilizable. El workflow decide los pasos del proceso. La aprobación humana es un cambio de estado realizado desde la interfaz.

## Ejercicio y checkpoint

Cambia la instrucción del Estratega para solicitar ángulos más diferenciados, conservando el contrato. Ejecuta `pnpm typecheck` y `pnpm adk:validate`. Esta última comprueba la construcción local, no la calidad de una respuesta real.

Los cuatro agentes usan `gemini-3.8-flash`, con razonamiento `LOW`. Para probar inferencia hace falta configurar la clave y definir el presupuesto siguiendo el README. Usa siempre el paquete oficial para las herramientas de desarrollo: `pnpm exec adk --help` después de instalar las dependencias. No uses un `npx adk` que pueda descargar otro paquete.
