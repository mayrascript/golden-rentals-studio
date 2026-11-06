# Identidad de MayraScript

Fuente principal: [mayrascript.com](https://mayrascript.com/), revisada el **6 de noviembre de 2026**. Esta guía recoge señales públicas del sitio; no sustituye un manual oficial aportado por Mayra. Los valores siguientes se comprobaron en los estilos y elementos renderizados, no se estimaron desde una captura.

## Elementos observados

| Elemento | Valor / uso |
| --- | --- |
| Nombre visible | MayraScript, con M y S mayúsculas |
| Tipografía | IBM Plex Mono, pesos 400 y 700 |
| Fondo | `hsl(256 70% 8%)`, violeta casi negro |
| Tarjeta | `hsl(256 70% 10%)` |
| Superficie secundaria | `hsl(256 70% 12%)` |
| Texto | `hsl(40 43% 96%)`, marfil |
| Violeta principal | `hsl(267 67% 51%)` |
| Acento cian | `hsl(187 100% 50%)` |
| Acción principal | Degradado de `#ff3b3b` a `#ff6a9e` |
| Bordes | `hsl(256 70% 20%)` |
| Forma | Esquinas moderadamente redondeadas, 6–8 px en controles |
| Atmósfera | Fondo oscuro, luces violetas y cian, contraste coral–rosa |

La portada da protagonismo al nombre; el resto organiza contenidos de aprendizaje, tecnología y comunidad en secciones claras. El tratamiento luminoso es un acento, no un requisito para cada componente.

## Adaptaciones para productos y workshops

Estas decisiones se derivan de la marca y **no fueron observadas como variantes oficiales**:

- Tema claro: fondo marfil `#f9f6f0`, tarjetas `#fffdfb`, tinta violeta `#211333`, enlaces violeta oscuro. No invertir automáticamente los colores de imágenes o logos.
- Tema oscuro: conserva el fondo y las superficies del sitio; usa texto lavanda en contenido secundario, bordes más claros para controles y enlaces cian legibles.
- Cuerpo de guías: una pila sans-serif de sistema mejora la densidad de párrafos y tablas; IBM Plex Mono mantiene la identidad en encabezados, firma, etiquetas y código.
- Botones coral–rosa: tinta oscura `#240b25`, en lugar de texto claro, para legibilidad en todos los puntos del degradado.
- Una sola acción principal por zona. Usa superficies sobrias y espacio para respirar; no conviertas todos los enlaces en botones de neón.
- Las imágenes de arquitectura conservan sus colores y una base clara; la interfaz que las contiene sí sigue el tema.
- El tema inicial puede seguir al dispositivo y debe respetar la elección guardada. No fuerces oscuro solo por coincidir con la portada de referencia.

Los tokens semánticos en `../assets/brand-tokens.css` son la implementación de estas decisiones. La regla `:root` define claro y `[data-theme="dark"]` lo sobrescribe.

## Voz y contenido

Tono cercano y seguro, con interés por aprender construyendo y compartir conocimiento. Usa verbos concretos: “crea”, “conecta”, “prueba”, “revisa”. Define términos técnicos cuando aparecen por primera vez. En ejercicios, muestra la intención del bloque y el resultado que se debe comprobar.

Ejemplos originales para workshops:

- “Dale una herramienta a tu agente y observa cuándo decide usarla.”
- “Primero prueba la demo. Después conecta tu propia cuenta.”
- “Revisa la respuesta antes de continuar: ¿cumple el formato esperado?”

Evita promesas de éxito garantizado, exceso de jerga o instrucciones vagas. No atribuyas afiliaciones, certificaciones o recomendaciones a Mayra sin fuente.

## Activos y procedencia

- Isotipo: [archivo público original](https://mayrascript.com/logo-isotipo.png), copia sin modificaciones en `assets/mayrascript-isotipo.png`. Es la identidad de MayraScript; no usar como marca de terceros.
- Fuente: [IBM Plex Mono en Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono). Archivos regular y bold obtenidos de la hoja CSS pública usada por el sitio. Licencia SIL Open Font License en `assets/OFL.txt`.
- Colores: [hoja de estilos del sitio consultada](https://mayrascript.com/_next/static/css/39dc03dcccf8ae23.css). La ruta generada puede cambiar cuando se publique una nueva versión.

Cuando Mayra aporte un manual o cambios explícitos, estos prevalecen sobre las observaciones de esta versión. Actualiza la guía y los tokens juntos, manteniendo visible qué es fuente y qué es adaptación.
