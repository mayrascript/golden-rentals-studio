# 4 Conectar una skill y sus recursos

Objetivo: proporcionar conocimiento reutilizable mediante las herramientas de carga de ADK. Requisito: módulo 3.

Abre `skills/instagram-copy/SKILL.md` y `skills/instagram-copy/references/estructuras.md`. El primer archivo define la skill y sus instrucciones; el segundo contiene estructuras que el Redactor puede consultar cuando las necesita.

En `workshop/exercises/04-skills.ts`, completa tres pasos: leer la carpeta con `loadSkillFromDir`, crear un `SkillToolset` y registrarlo en `tools`. Los imports están preparados para que el archivo compile desde el inicio; sus usos aparecen en los bloques comentados.

La comprobación debe mostrar `load_skill` y luego `load_skill_resource`, antes de recibir tres textos. Cargar un archivo al arrancar Node y observar que el agente lo consulta son comprobaciones distintas; el laboratorio cubre ambas.

Después, personaliza una regla de tono en SKILL.md y compara resultados en una ejecución real. El modo offline utiliza respuestas fijas y no mide calidad de escritura.

Error frecuente: escribir mal el nombre `instagram-copy` o la ruta `references/estructuras.md`. La skill y sus recursos están incluidos en el repositorio.
