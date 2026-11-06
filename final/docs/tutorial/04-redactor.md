# 4 Redactor y skill

Objetivo: separar instrucciones de escritura reutilizables de la lógica de ejecución. Necesitas conocer el contrato de una pieza.

## Pasos

1. Lee [SKILL.md](../../skills/instagram-copy/SKILL.md) y su [recurso de estructuras](../../skills/instagram-copy/references/estructuras.md).
2. Localiza `loadSkillFromDir` y `SkillToolset` en [team.ts](../../apps/server/src/agents/team.ts). El nombre del directorio coincide con el nombre del frontmatter.
3. Revisa cómo el Redactor recibe la estrategia, usa `factIds` y devuelve gancho, cuerpo, CTA y hashtags.
4. Observa la lista permitida de herramientas: carga de la skill y de su recurso. No se permite ejecutar scripts del participante.
5. Cambia un criterio de escritura en la skill. Conserva las restricciones sobre datos y el formato de salida.

Las skills de ADK están documentadas como experimentales. El proyecto fija una versión del SDK y verifica la carga. Una ejecución real debe comprobar también que el modelo invoque la skill; el modo simulado no interpreta su contenido con IA.

## Checkpoint

Ejecuta `pnpm adk:validate` y `pnpm typecheck`. Después prueba la defensa de hechos con `pnpm test`: un precio o una piscina no aportados deben impedir aprobar la pieza.

Error frecuente: esperar que editar la skill cambie las plantillas de la demo. Para observar su efecto en un modelo debes activar y probar el modo real; para cambiar la demo edita explícitamente el proveedor simulado.
