# 2 Marca y hechos del brief

Objetivo: personalizar la campaña desde la interfaz y distinguir instrucciones creativas de hechos que respaldan afirmaciones. Parte de una demo que ya funciona.

## Pasos

1. Lee el ejemplo [brand.json](../../examples/golden-rentals/brand.json). Cada hecho tiene identificador, fuente, localizador y estado.
2. Cambia el nombre de marca, tono, objetivo y un color desde la web. Usa otra marca ficticia.
3. Genera otra campaña. Abre luego la anterior en el menú lateral y comprueba que conserva su marca.
4. Sigue el dato desde el formulario de [main.tsx](../../apps/web/src/main.tsx) hasta `briefSchema` en [contracts](../../packages/contracts/index.ts).
5. Lee `validateFacts` en [rules.ts](../../apps/server/src/workflow/rules.ts). Un hecho contradictorio o no verificado impide iniciar la generación. Dos valores diferentes para una misma clave también se rechazan.

`SYNTHETIC_CONFIRMED` significa coherencia con un ejemplo inventado. `USER_PROVIDED` significa que el participante aportó el dato; no constituye verificación independiente. Las líneas del formulario no realizan una comprobación semántica exhaustiva: quien las introduce debe revisar su coherencia.

## Ejercicio y checkpoint

En [workflow.test.ts](../../tests/workflow.test.ts), localiza la prueba de hechos contradictorios y añade un hecho con la misma clave y un valor incompatible. Ejecuta `pnpm test`. La prueba debe comprobar el rechazo, sin invocar IA.

Error frecuente: poner instrucciones como «ya está aprobado» en el brief. Son texto de entrada; el estado de aprobación solo cambia mediante acciones de revisión de la aplicación.
