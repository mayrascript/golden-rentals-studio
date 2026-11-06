# 2 Configurar y probar un agente

Objetivo: construir un `LlmAgent` y distinguir definirlo de ejecutarlo. Requisito: completar la preparación.

ADK necesita un modelo, un nombre y unas instrucciones. La descripción resume su responsabilidad. El `Runner` crea una sesión, envía el brief y recoge la respuesta. Crear el objeto del agente no envía solicitudes al proveedor.

Abre `workshop/exercises/02-strategist.ts` y lee los comentarios de los TODO 2.1 y 2.2. Completa primero la instrucción y luego el agente. El laboratorio aportará un brief ficticio; el código de la sesión ya está preparado en `workshop/lab.ts`.

Después de comprobar el bloque base, cambia la instrucción para pedir tres ángulos más distintos. El laboratorio offline verifica la conexión y el contrato con respuestas fijas. Para evaluar el efecto de tu nueva instrucción necesitas una ejecución real.

Error frecuente: confundir `description` con `instruction`. La primera describe la responsabilidad del agente; la segunda orienta lo que el modelo debe hacer.
