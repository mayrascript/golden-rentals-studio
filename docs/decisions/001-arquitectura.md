# Decisión de arquitectura local en TypeScript

Fecha: 5 de noviembre de 2026. Decisión: implementar el workshop en TypeScript para trabajar con un mismo lenguaje en la interfaz, el servidor y los agentes.

## Objetivo

Una experiencia educativa con una interfaz React, un servidor Node.js y cuatro agentes de Google ADK dentro del mismo proceso. Un único paquete y lockfile reducen pasos de instalación; las carpetas mantienen separados los contratos, proveedores y persistencia.

## Decisiones

- Express atiende la API y Vite sirve la interfaz durante el desarrollo. La compilación produce interfaz estática y servidor JavaScript.
- ADK oficial `@google/adk` y `@google/adk-devtools`, con versiones exactas y lockfile. No se usa un paquete comunitario llamado ADK-TS.
- Modelos aceptados por la organizadora: `gemini-3.8-flash` para los cuatro agentes y `gemini-3.1-flash-image` (Nano Banana 2) para imágenes cuadradas `1K`. Se mantienen identificadores estables explícitos en `.env.example`, con modo simulado por defecto. Los agentes usan razonamiento `LOW`, sin parámetros de muestreo incompatibles, y las continuaciones automáticas del SDK están desactivadas. La prueba de transporte local no reemplaza la validación con la cuenta real. Referencias: [Flash 3.8](https://ai.google.dev/gemini-api/docs/latest-model), [imágenes](https://ai.google.dev/gemini-api/docs/image-generation).
- Zod valida las entradas y salidas en ejecución; TypeScript comprueba el código durante el desarrollo.
- El workflow en `service.ts` define cuatro etapas. El coordinador es código, no un agente adicional. No depende de que un prompt recuerde cancelar o exigir aprobación.
- Los proveedores simulado y real comparten contratos. El modo lo elige el servidor. El simulado usa plantillas y SVG originales, y se identifica en la interfaz y las exportaciones.
- Las campañas se guardan como JSON y archivos de imagen locales. No se requiere nube, base de datos externa ni cuentas de usuario.
- A2A y MCP se explican como posibles extensiones. El despliegue en Cloud Run o Agent Runtime queda fuera del alcance de esta aplicación local.
- La revisión visual es humana. El Editor real revisa texto y metadatos, y declara `HUMAN_REQUIRED`.
- La aprobación global se vincula al hash del contenido actual. Cambiar una pieza invalida su revisión y la aprobación global; cambiar el calendario invalida la aprobación global.

## Consecuencias y límites

La instalación sirve a una persona en su equipo y escucha solo en `127.0.0.1`. No es un servicio multiusuario. La etiqueta del revisor no es identidad autenticada. Los límites de llamadas se cuentan en callbacks y en la herramienta de imágenes; una llamada ya enviada puede finalizar después de una cancelación.

La persistencia conserva resultados completos y detecta interrupciones. No reanuda una conversación interna del modelo después de un reinicio. El informe público registra las comprobaciones reproducibles offline; las pruebas de recuperación siguen siendo locales.

La API seleccionada se verifica con los tipos del SDK instalado. La documentación oficial cambia; mantener el lockfile y repetir la validación antes de actualizar dependencias.
