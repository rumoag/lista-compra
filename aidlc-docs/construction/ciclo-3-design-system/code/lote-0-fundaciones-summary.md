# Ciclo 3 — Lote 0: Fundaciones (tokens)

## Archivos
- **Creado**: `css/tokens.css` — tokens de color (Lime/Sand, claro+oscuro), radios y tipografía
- **Modificado**: `css/style.css` — añade `@import url("tokens.css");` como primera línea
- **Modificado**: `index.html` — añade carga de la fuente Inter (Google Fonts, preconnect + stylesheet)

## Fuente de los valores
Obtenidos vía WebFetch de los paquetes npm publicados (consulta 2026-07-29):
- `@radix-ui/colors`: `lime.css`, `lime-dark.css`, `sand.css`, `sand-dark.css` (valores hex sRGB)
- `@radix-ui/themes`: `tokens/base.css` (`--radius-1`…`--radius-6`, `--font-size-1`…`--font-size-9`, `--line-height-1`…`--line-height-9`)

## Tokens definidos
- `--accent-1` … `--accent-12` (Lime)
- `--sand-1` … `--sand-12`
- `--radius-1` … `--radius-6`, `--radius-full`
- `--font-family-base`, `--font-size-1` … `--font-size-9`, `--line-height-1` … `--line-height-9`

## Nota sobre modo oscuro en este lote
`tokens.css` declara `color-scheme: light dark` en `:root`, pero `style.css` sigue declarando `color-scheme: light` justo después (cascada: la regla que aparece después gana), por lo que el modo oscuro del navegador para controles nativos **no se activa todavía** en este lote — se activará en un lote posterior cuando se elimine esa declaración de `style.css` y se verifique el modo oscuro end-to-end (ver plan, Lote 4).

## Alcance
Ningún componente visual (`.card`, `.chip`, `.button`, etc.) usa estos tokens todavía — siguen usando `--color-primary`, `--color-secondary`, `--radius`, `--spacing` y valores hardcodeados existentes. El remaquetado llega en los Lotes 1-4.

## Verificación
- `npm test`: pendiente de ejecutar (ver mensaje de completitud)
- Visual: la app debe verse exactamente igual que antes de este lote (pendiente de confirmación del usuario)
