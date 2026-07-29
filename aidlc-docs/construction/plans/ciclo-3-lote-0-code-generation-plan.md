# Code Generation Plan — Ciclo 3, Lote 0: Fundaciones (tokens)

**Fuente de verdad para los valores**: obtenidos vía WebFetch de los paquetes npm publicados el 2026-07-29:
- `@radix-ui/colors` → `lime.css`, `lime-dark.css`, `sand.css`, `sand-dark.css` (hex sRGB, 12 pasos)
- `@radix-ui/themes` → `tokens/base.css` (escala de radios, font-size, line-height, letter-spacing)

## Contexto de la unidad
- Requisitos: FR-24 a FR-27, NFR-12 a NFR-14 (`aidlc-docs/inception/requirements/requirements.md`, sección Ciclo 3)
- Plan de workflow: `aidlc-docs/inception/plans/execution-plan-ciclo-3.md` (Lote 0 de 5)
- No hay dependencias de otras unidades — es el primer lote
- Este lote NO cambia el aspecto visual de ningún componente todavía: solo define los tokens. El aspecto visual actual se mantiene igual hasta el Lote 1 (`--color-primary`/`--color-secondary`/`--radius` actuales se preservan sin tocar en este lote).

## Pasos

### Step 1: Cargar fuente Inter en `index.html`
- [x] Añadir `<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` y `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">` en el `<head>` de `index.html`, antes del `<link rel="stylesheet" href="/css/style.css" />`

### Step 2: Crear archivo de tokens `css/tokens.css`
- [x] Crear `css/tokens.css` con:
  - Bloque `:root` (modo claro): 12 variables `--accent-1`…`--accent-12` (valores de `lime.css`), 12 variables `--sand-1`…`--sand-12` (valores de `sand.css`)
  - Bloque `@media (prefers-color-scheme: dark) { :root { ... } }`: mismas 24 variables sobrescritas con los valores de `lime-dark.css`/`sand-dark.css`, y `color-scheme: light dark` declarado en `:root` base (no dentro del media query) para que el navegador entienda que ambos esquemas están soportados
  - Escala de radios: `--radius-1: 3px; --radius-2: 4px; --radius-3: 6px; --radius-4: 8px; --radius-5: 12px; --radius-6: 16px; --radius-full: 9999px;`
  - Escala tipográfica: `--font-size-1` a `--font-size-9` (12/14/16/18/20/24/28/35/60 px) y `--line-height-1` a `--line-height-9` (16/20/24/26/28/30/36/40/60 px) correspondientes
  - Variable `--font-family-base: 'Inter', system-ui, -apple-system, "Segoe UI", sans-serif;`
- [x] No se eliminan aún `--spacing`, `--radius`, `--color-primary`, `--color-secondary` (siguen viviendo en `style.css`, se migran/retiran en lotes posteriores conforme cada componente adopte los tokens nuevos)

### Step 3: Importar tokens desde `style.css`
- [x] Añadir `@import url("tokens.css");` como primera línea de `css/style.css`

### Step 4: Enlazar archivo de tokens en `index.html`
- [x] No hace falta `<link>` adicional — `tokens.css` se carga vía `@import` desde `style.css` (Step 3), que ya está enlazado

### Step 5: Documentación del lote
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-0-fundaciones-summary.md` con: lista de tokens creados, fuente de los valores (paquetes npm + versión/fecha de consulta), y nota de que ningún componente visual cambia todavía en este lote

## Criterio de verificación de este lote
- `npm test` sigue en verde (228/228) — no se toca ningún componente ni su CSS aplicado
- Verificación visual del usuario: la app se ve **exactamente igual** que antes de este lote (los tokens existen pero no se usan todavía)
