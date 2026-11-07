# 4 Conectar una skill y sus recursos

> [!TIP]
> **Tu objetivo:** proporcionar conocimiento reutilizable mediante las herramientas de carga de ADK. Requisito: módulo 3.

> [!NOTE]
> **La skill es el manual del especialista:** el Redactor consulta reglas y ejemplos cuando los necesita. El manual aporta conocimiento; una tool ejecuta una acción. ADK expone este manual mediante herramientas de lectura.

![El Redactor consulta un manual con reglas de tono, una lista de comprobación y ejemplos mientras escribe una publicación. La skill reúne ese conocimiento reutilizable.](../assets/skill-illustration.png)

Abre `skills/instagram-copy/SKILL.md` y `skills/instagram-copy/references/estructuras.md`. El primer archivo define la skill y sus instrucciones; el segundo contiene estructuras que el Redactor puede consultar cuando las necesita.

En `workshop/exercises/04-skills.ts`, completa tres pasos: leer la carpeta con `loadSkillFromDir`, crear un `SkillToolset` y registrarlo en `tools`. Los imports están preparados para que el archivo compile desde el inicio; sus usos aparecen en los bloques comentados.

La comprobación debe mostrar `load_skill` y luego `load_skill_resource`, antes de recibir tres textos. Cargar un archivo al arrancar Node y observar que el agente lo consulta son comprobaciones distintas; el laboratorio cubre ambas.

Después, personaliza una regla de tono en SKILL.md y compara resultados en una ejecución real. El modo offline utiliza respuestas fijas y no mide calidad de escritura.

> [!WARNING]
> **Error frecuente:** escribir mal el nombre `instagram-copy` o la ruta `references/estructuras.md`. La skill y sus recursos están incluidos en el repositorio.

## Bloques para completar

Abre `workshop/exercises/04-skills.ts`. Para cada TODO, lee los comentarios sobre entradas y salidas. Descomenta el bloque que ya aparece en el archivo y elimina su llamada `pending('ID')`, o reemplaza el tramo entre `@todo:start` y `@todo:end` por el bloque siguiente. Conserva los imports y las firmas.

### TODO 4.1

Pega dentro de la función correspondiente:

```ts
return await loadSkillFromDir(directory);
```

### TODO 4.2

Pega dentro de la función correspondiente:

```ts
return new SkillToolset([skill], { allowInlineScripts: false });
```

### TODO 4.3

Pega dentro de la función correspondiente:

```ts
return new LlmAgent({
  ...settings,
  name: 'copywriter',
  description: 'Redacta tres publicaciones usando la estrategia y la skill de Instagram.',
  instruction: `${BASE_INSTRUCTION} Carga la skill instagram-copy y su recurso references/estructuras.md antes de redactar. Produce gancho, cuerpo, CTA, hashtags y referencias a hechos.`,
  tools: [skillTools],
  beforeToolCallback: ({ tool }) => {
    check();
    if (!['load_skill', 'load_skill_resource'].includes(tool.name)) throw new Error('Herramienta no disponible en este workshop.');
    return undefined;
  },
});
```

## Comprobar

```sh
pnpm typecheck
pnpm workshop:check 4
```

> [!IMPORTANT]
> **Resultado esperado:** Llamadas load_skill y load_skill_resource antes de recibir tres textos.

Esta comprobación usa respuestas HTTP locales preparadas, sin clave ni consumo de IA. Ejecuta ADK y las funciones que completaste; no evalúa la calidad de Gemini. Para probar ese agente con el proveedor real, consulta [el laboratorio](laboratorio.md).

[Volver al recorrido](README.md)
