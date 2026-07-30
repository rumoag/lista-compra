# Design System basado en Radix UI — Preguntas de Aclaración

Contexto: la app actual es HTML/CSS/JS vanilla (sin React), con estilos en un único `css/style.css` con algunas variables CSS (`--spacing`, `--radius`, `--color-primary`, `--color-secondary`) y colores puntuales hardcodeados. Radix UI como tal (los primitivos React) no aplica directamente sin React; el candidato natural es adoptar el **lenguaje visual de Radix** (escalas de color de Radix Colors, escala de radios, escala tipográfica y de espaciado de Radix Themes) como tokens CSS reutilizables, y remaquetar los componentes existentes para usarlos.

Por favor responde rellenando la letra tras cada `[Answer]:`. Si ninguna opción encaja, usa la última opción (Other) y describe tu preferencia.

## Question 1
¿Cuál es el alcance de este design system?

A) Solo fundamentos (tokens de color, radio, espaciado y tipografía como variables CSS), sin tocar el CSS de los componentes existentes todavía

B) Fundamentos + remaquetar todos los componentes visuales existentes (botones, chips, tarjetas, inputs, modales, barra de selección) para que usen los nuevos tokens

C) Fundamentos + remaquetar solo los componentes más visibles/reutilizados (botones, tarjetas, inputs) y dejar el resto para iteraciones futuras

D) Other (please describe after [Answer]: tag below)

[Answer]: b

## Question 2
Radix Colors ofrece escalas de 12 pasos por color (fondo sutil → borde → texto → texto de alto contraste) pensadas para accesibilidad. La app hoy usa un azul (`#2563eb`) como color primario y un violeta (`#7c3aed`) como secundario. ¿Qué color de acento de Radix quieres usar como base?

A) Blue (el más cercano al azul actual, mantiene la identidad visual)

B) Indigo

C) Violet/Iris (cercano al secundario actual)

D) Other (please describe after [Answer]: tag below — puedes indicar otro color de la paleta de Radix, ej. Teal, Grass, Crimson)

[Answer]: Lime

## Question 3
¿Qué escala de grises (neutral) de Radix quieres usar para fondos, bordes y texto?

A) Gray (neutro puro, sin matiz de color)

B) Slate (gris con matiz azulado, el más usado por defecto en Radix Themes)

C) Sand (gris con matiz cálido)

D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 4
¿Se debe añadir soporte de modo oscuro (dark mode) como parte de este design system? Hoy la app solo declara `color-scheme: light`, y Radix Colors incluye una escala oscura equivalente para cada color.

A) Sí, implementar modo oscuro completo (tokens claros + oscuros, con detección de preferencia del sistema `prefers-color-scheme`)

B) No, solo modo claro por ahora — dejar los tokens preparados en estructura pero sin generar/aplicar la escala oscura todavía

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
Radix Themes define una escala tipográfica (tamaños 1-9) y usa Inter como fuente por defecto. La app actual usa `system-ui` sin escala definida. ¿Qué prefieres?

A) Adoptar Inter como fuente principal (vía Google Fonts o self-hosted) + escala tipográfica de Radix

B) Mantener la fuente del sistema (`system-ui`) pero adoptar la escala tipográfica de tamaños de Radix

C) No tocar tipografía en este ciclo, solo colores/radios/espaciado

D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
Radix usa una escala de radios (`radius-1` a `radius-6`, más "full" para píldoras) en vez de un único valor. Hoy la app usa un `--radius: 10px` fijo para casi todo. ¿Qué prefieres?

A) Adoptar la escala completa de radios de Radix y aplicar el radio que corresponda según el tipo de elemento (botón pequeño, tarjeta, modal, chip tipo píldora, etc.)

B) Mantener un único radio global (ajustado al valor por defecto de Radix, ~8px) por simplicidad

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
¿Cómo quieres verificar que el resultado final "se ve como Radix"? (puedes elegir más de una opción escribiéndolas juntas, ej. "AB")

A) Verificación visual manual tuya en el navegador tras cada componente remaquetado (yo te aviso cuándo revisar)

B) Basta con que los tokens (colores/radios/tipografía) coincidan con los valores oficiales de la paleta de Radix Colors/Themes; no hace falta pixel-perfect en cada componente

C) Other (please describe after [Answer]: tag below)

[Answer]: A
