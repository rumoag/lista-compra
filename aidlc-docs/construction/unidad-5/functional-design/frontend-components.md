# Frontend Components — Unidad 5: Listado de listas activas

## Componente nuevo: `common/modal.js`
- **Responsabilidad**: componente genérico y reutilizable de modal — overlay + contenedor + botón "X" en esquina superior derecha (BR-33) + cierre al hacer click en el overlay/tecla Escape.
- **API**: `openModal({ title, bodyHtml | bodyRenderer, onClose })` → devuelve el contenedor del cuerpo del modal para que el llamante monte su contenido/listeners; `closeModal()`.
- **Reutilizado por**: `list-form-modal.js`, `qr-modal.js`, `delete-confirm-modal.js`.

## Componente nuevo: `home/home-screen.js`
- **Responsabilidad**: pantalla de inicio (sustituye la llamada directa a `renderCreateHousehold` en `main.js` cuando no hay `householdId` en la URL). Consulta todas las listas (Flujo 1), renderiza estado vacío o el listado de tarjetas, y el botón "Crear nueva lista".
- **Props**: `container`.
- **Hijos**: `list-card.js` (uno por household), botón que abre `list-form-modal.js` en modo `create`.

## Componente nuevo: `home/list-card.js`
- **Responsabilidad**: tarjeta individual — icono, título, participantes truncados (BR-28), botón de 3 puntos.
- **Props**: `household` (`{ id, title, image_icon, participants }`), callbacks `onEdit`, `onDelete`, `onViewQr`.
- **Interacción**: click en la tarjeta (fuera del menú) navega a `/{household.id}`; click en el botón de 3 puntos abre `list-actions-menu.js`.

## Componente nuevo: `home/list-actions-menu.js`
- **Responsabilidad**: menú desplegable de 3 puntos con las opciones Eliminar / Editar / Ver QR. Se cierra al seleccionar una opción o al hacer click fuera.
- **Props**: callbacks `onEdit`, `onDelete`, `onViewQr`.

## Componente nuevo: `home/list-form-modal.js`
- **Responsabilidad**: modal de crear/editar lista (BR-32), construido sobre `common/modal.js`. Formulario con input de título y selector visual del set de 12 iconos (`domain-entities.md`).
- **Props**: `mode` (`'create' | 'edit'`), `household` (solo en modo `edit`), `onSaved` (callback tras insertar/actualizar con éxito, para refrescar el listado).

## Componente nuevo: `home/qr-modal.js`
- **Responsabilidad**: envoltorio de modal alrededor de `renderQrView` (Unidad 4) — sin lógica nueva de QR.
- **Props**: `householdId`.

## Componente nuevo: `home/delete-confirm-modal.js`
- **Responsabilidad**: modal de confirmación de borrado (BR-31), construido sobre `common/modal.js`.
- **Props**: `household`, `onConfirmed` (callback tras borrado exitoso).

## Componente nuevo: `home/participants.js`
- **Responsabilidad**: funciones puras `buildParticipantsMap(products)` y `formatParticipants(participants)` (BR-27, BR-28), sin ninguna dependencia de red. Extraído de `households-api.js` durante Code Generation para que `list-card.js` (presentación pura) no arrastre una dependencia transitiva del cliente de Supabase.

## Componente nuevo: `home/households-api.js`
- **Responsabilidad**: capa de acceso a datos para esta unidad — `fetchAllHouseholdsWithParticipants()` (usa `participants.js` para la agregación), `createHousehold({ title, image_icon })` (sustituye la versión sin campos de Unidad 1/4), `updateHousehold(id, { title, image_icon })`, `deleteHousehold(id)`.
- **Nota**: `createHousehold` cambia de firma respecto a la Unidad 1 (antes `insert({})`, ahora requiere `title`/`image_icon`); se actualiza el único llamante existente.

## Cambios en `src/main.js`
- Cuando no hay `householdId` en la URL: renderizar `home/home-screen.js` en vez de `onboarding/create-household.js` directamente.
- `onboarding/create-household.js` queda **obsoleto para el flujo de UI** (su lógica de creación se sustituye por `households-api.js`); se elimina su uso desde `main.js`. Si no queda ninguna otra referencia tras el cambio, se elimina el archivo.

## Cambios en `supabase/schema.sql`
- `alter table households add column title text, add column image_icon text` + backfill de filas existentes (BR-26) + constraints `CHECK` de longitud de `title` y de pertenencia de `image_icon` al set cerrado (BR-24, BR-25) + `not null` tras el backfill.
