# Plan de Code Generation — Unidad 5: Listado de listas activas

## Contexto de la unidad
- **Cubre**: Pantalla 1 del ciclo de mejora de usabilidad — listado de listas activas, crear/editar (modal compartido), ver QR (modal), eliminar con confirmación (modal).
- **Dependencias**: Unidad 1 (households/products/supabase-client), Unidad 4 (`renderQrView`, generación de QR)
- **Entidades propias**: extensión de `households` (`title`, `image_icon`)
- **Fuera de esta unidad**: cualquier otra pantalla del rediseño (se especificarán en ciclos posteriores)

## Pasos

1. [x] **Migración de esquema** — `supabase/schema.sql`: `alter table households add column title text, add column image_icon text`, backfill de filas existentes (BR-26), `not null` + constraints `CHECK` de longitud de `title` (BR-24) y pertenencia de `image_icon` al set cerrado (BR-25)
2. [x] **Componente genérico de modal** — `src/common/modal.js` (BR-33, `common/modal.js` de logical-components.md)
3. [x] **Capa de datos** — `src/home/households-api.js` + `src/home/participants.js` (extraído durante generación, ver desviación documentada en `code/frontend-summary.md`): `fetchAllHouseholdsWithParticipants()` (agregación en memoria, BR-27/BR-28/BR-29), `createHousehold`, `updateHousehold`, `deleteHousehold`
4. [x] **Tests de households-api.js** — Vitest, incluyendo casos de truncado de participantes (BR-28) y orden (BR-29)
5. [x] **Componentes de presentación** — `src/home/list-card.js`, `src/home/list-actions-menu.js`, `src/home/home-screen.js` (estado vacío BR-30, listado, botón "Crear nueva lista")
6. [x] **Tests de componentes de presentación** — Vitest + jsdom, siguiendo el patrón de mount() ya usado en Unidad 1
7. [x] **Modales especializados** — `src/home/list-form-modal.js` (crear/editar, BR-32, BR-24, BR-25), `src/home/qr-modal.js` (envuelve `renderQrView`), `src/home/delete-confirm-modal.js` (BR-31)
8. [x] **Tests de modales especializados** — Vitest + jsdom
9. [x] **Integración en main.js** — sustituir `renderCreateHousehold` por `home-screen.js` cuando no hay `householdId` en la URL
10. [x] **Eliminar código obsoleto** — `src/onboarding/create-household.js` (no existía test previo que actualizar)
11. [x] **Documentación** — actualizado `README.md` (nueva pantalla de inicio, nota de la excepción de seguridad BR-34) y creado resumen en `aidlc-docs/construction/unidad-5/code/frontend-summary.md`

## Trazabilidad
Todos los pasos cubren FR-1 a FR-6 y NFR-1 a NFR-4 de `requirements.md` (Ciclo 2), y BR-24 a BR-34 de `business-rules.md` (Unidad 5).

## Verificación
`npm test`: 126/126 tests pasan. `npm run build`: verificado con variables de prueba.
