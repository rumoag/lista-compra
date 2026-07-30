# Code Generation Plan — Ciclo 3, Lote 4: Onboarding/QR, detalles finales y modo oscuro

Último lote del Ciclo 3. Cierra FR-25 (modo oscuro automático) y hace una pasada final de consistencia.

## Contexto de la unidad
- Requisitos: FR-25 (modo oscuro, pendiente de activar), FR-28 a FR-32
- Depende de los Lotes 0-1 v2, 2 y 3 (todos los componentes ya usan tokens M3)
- Verificado: no quedan colores hardcodeados de marca en `css/style.css` (solo `box-shadow` con negro puro, ya coincide con `--md-sys-color-shadow`, y el receipt, excluido intencionalmente)

## Pasos

### Step 1: Activar modo oscuro end-to-end (FR-25)
- [x] Cambiar `:root { color-scheme: light; }` por `color-scheme: light dark;` en `css/style.css` — hasta ahora esta declaración pisaba la de `tokens.css` y mantenía la app en claro aunque el sistema estuviera en oscuro; con este cambio, `@media (prefers-color-scheme: dark)` en `tokens.css` pasa a aplicarse de verdad (controles nativos del navegador incluidos: inputs, scrollbars)

### Step 2: Onboarding y QR — pulido menor
- [x] Añadir regla genérica `.meta` (sin combinar con `.product-item`) con `color: var(--md-sys-color-on-surface-variant)`, para que `qr-view.js` (que usa `class="meta"` de forma independiente) tenga el mismo tratamiento de texto secundario que el resto de la app — hoy no tenía ningún color asignado

### Step 3: Verificación final de consistencia
- [x] Búsqueda final en `css/style.css` de colores hardcodeados fuera de `--md-sys-*`/`--font-family-base`/`--spacing`: confirmado que solo quedan sombras (`rgba(0,0,0,...)`, coherente con `--md-sys-color-shadow`) y el receipt (exclusión documentada en el Lote 3)
- [x] Confirmar visualmente (petición al usuario) que `index.html`/`qr-view.js`/`name-prompt.js`/`participants.js` (que reutilizan `.card`/`.error-message`/`.meta`) se ven coherentes con el resto de la app — pendiente de que el usuario lo confirme

### Step 4: Documentación del lote y cierre del Ciclo 3
- [x] Crear `aidlc-docs/construction/ciclo-3-design-system/code/lote-4-onboarding-modo-oscuro-summary.md`
- [x] Actualizar `aidlc-docs/aidlc-state.md` marcando el Ciclo 3 (Design System M3) como completo, a falta de la verificación visual final del usuario y del paso a Build and Test

## Criterio de verificación de este lote
- `npm test` en verde (230/230)
- Verificación visual del usuario: cambiar la preferencia de tema del sistema operativo/navegador a oscuro y comprobar que toda la app (no solo algunos componentes) cambia de paleta correctamente, incluyendo controles nativos (inputs, scrollbar)
