---
name: mayrascript-brand
description: Aplica la identidad visual y la voz de MayraScript a interfaces, guías de workshops, documentación y piezas de comunicación. Úsala cuando se solicite el branding de MayraScript o se edite una superficie que ya usa esta identidad. Incluye paleta, IBM Plex Mono, isotipo y tokens para temas claro y oscuro.
---

# MayraScript Brand

## Antes de diseñar

Lee [la guía de marca](references/brand-guide.md). Distingue los valores observados en mayrascript.com de las adaptaciones para accesibilidad y lectura. Esta es una guía derivada del sitio, no un manual corporativo aprobado.

Identifica la superficie: una portada puede tener más brillo; una guía extensa necesita fondos tranquilos, jerarquía y código legible. Conserva el nombre del producto o workshop, sus funciones y el contenido técnico. La marca de la autora no reemplaza las marcas ficticias utilizadas en ejercicios.

## Aplicar la identidad

1. Usa `assets/brand-tokens.css` como fuente de colores semánticos. Cárgalo antes de los estilos de la interfaz. `data-theme="dark"` en la raíz activa el tema oscuro; el tema claro es una adaptación documentada.
2. Para web, usa `assets/brand-fonts.css` y copia los dos archivos TTF al mismo directorio que la hoja de estilos final. Incluye `assets/OFL.txt`. No dependas de Google Fonts en tiempo de ejecución.
3. Usa IBM Plex Mono en la firma MayraScript, títulos, etiquetas y código. En documentación larga puede convivir con una fuente de sistema sin serifas para el cuerpo; documenta esa adaptación. No simules pesos no disponibles.
4. Reutiliza `assets/mayrascript-isotipo.png` sin estirarlo, recortarlo ni recolorearlo. Acompáñalo de la firma **MayraScript** cuando haya espacio. No reconstruyas el isotipo con emoji o letras.
5. Reserva el degradado coral–rosa para la acción principal y detalles destacados. Usa texto oscuro sobre él. Evita resplandores detrás de párrafos o código; limita violeta y cian luminosos a bordes o detalles de portada.
6. Sigue una voz cercana, concreta y práctica en español. Explica qué construir, qué observar y cómo verificarlo. Usa “tú”; invita a experimentar sin prometer resultados mágicos de la IA.

## Verificar antes de entregar

- Comprueba ambos temas, escritorio y móvil, foco visible y lectura del código.
- Mantén contraste de al menos 4.5:1 en texto normal y 3:1 en controles y estados esenciales. No uses solo color para indicar progreso.
- Respeta la preferencia de movimiento reducido; evita animaciones decorativas continuas en material didáctico.
- Conserva navegación, copiado, progreso y preferencia de tema existentes.
- No añadas dependencias, rastreadores o conexiones a Gemini por aplicar branding.

Para consumir la skill en otro repositorio, copia esta carpeta a `.agents/skills/mayrascript-brand/`, registra el commit de origen y enlaza sus recursos desde la compilación. Mantén las adaptaciones de cada producto fuera de esta carpeta para facilitar su actualización.
