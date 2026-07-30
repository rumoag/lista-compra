# Ciclo 3 — Lote 2: Componentes de listas

## Archivo modificado
- `css/style.css` — `.product-item .meta`/`.empty-state` (texto secundario), `.list-card-icon--create`/`.list-card-title`, `.dropdown-menu-list`, `.list-header-title`/`.avatar-button`, `.tabs-nav`/`.tab[aria-current]`, `.product-item.selected`, `.fab`, `.quantity-stepper` (button/input), `.selection-header`, `.icon-button`

## Cambios clave
- Texto secundario (metadatos, estado vacío): `opacity: 0.7` → `color: var(--md-sys-color-on-surface-variant)` (contraste garantizado también en oscuro)
- Avatar/icono "crear lista": `primary-container`/`on-primary-container`
- Menú desplegable: fondo `surface-container`, esquina `corner-extra-small` (patrón M3 Menu)
- Filas/tabs seleccionados: `secondary-container`/`on-secondary-container`
- **FAB**: pasa de circular (`50%`) a `corner-large` (16px) — forma oficial del FAB en M3, ya no circular
- Stepper e inputs de selección múltiple: bordes/fondos migrados a `outline`/`surface`

## Verificación
- `npm test`: 230/230 pasan
- Visual: pendiente de confirmación del usuario — atención especial al nuevo FAB (cuadrado redondeado en vez de circular) y al tab activo (antes azul, ahora `secondary-container`)
