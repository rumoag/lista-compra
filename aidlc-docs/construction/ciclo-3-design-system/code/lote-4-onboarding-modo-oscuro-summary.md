# Ciclo 3 — Lote 4: Onboarding/QR, detalles finales y modo oscuro

## Archivo modificado
- `css/style.css` — `color-scheme: light` → `color-scheme: light dark` en `:root`; nueva regla genérica `.meta`

## Cambios clave
- **Modo oscuro activado end-to-end (FR-25)**: hasta este lote, `style.css` declaraba `color-scheme: light` en `:root`, que por cascada pisaba el `light dark` ya presente en `tokens.css` desde el Lote 0. La app nunca llegó a activar el `@media (prefers-color-scheme: dark)` de verdad pese a tener toda la paleta oscura calculada desde el principio. Con este cambio, cambiar el tema del sistema operativo/navegador ahora recolorea toda la app (todos los componentes ya migrados a `--md-sys-color-*` responden automáticamente) y los controles nativos (inputs, scrollbars).
- `.meta` genérico con `on-surface-variant`: `qr-view.js` usa esta clase de forma independiente (no anidada en `.product-item`) y no tenía ningún color asignado hasta ahora.

## Verificación final de consistencia
- Búsqueda de colores hardcodeados en `css/style.css`: solo quedan `box-shadow` con negro (`rgba(0,0,0,...)`, coincide con `--md-sys-color-shadow`) y las reglas de `.receipt-*` (exclusión documentada en el Lote 3). No queda ningún color de marca hardcodeado.
- Onboarding (`name-prompt.js`, `participants.js`, `qr-view.js`) reutiliza `.card`/`.error-message`/`.meta`, ya tokenizados — coherente con el resto de la app sin cambios adicionales de código.

## Verificación
- `npm test`: 230/230 pasan
- Visual: pendiente de confirmación del usuario — cambiar la preferencia de tema del sistema/navegador a oscuro y comprobar el resultado en toda la app

## Cierre del Ciclo 3
Con este lote se completan los 5 lotes planificados (0 al 4) del design system basado en Material Design 3. Queda pendiente: verificación visual final del usuario y el paso a Build and Test (aidlc-state.md).
