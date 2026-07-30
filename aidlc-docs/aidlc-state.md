# AI-DLC State Tracking

## Project Information
- **Project Name**: Lista de la Compra Compartida
- **Project Type**: Greenfield
- **Start Date**: 2026-07-23
- **Current Stage**: OPERATIONS (placeholder) — CONSTRUCTION PHASE completa

## Workspace State
- **Existing Code**: No
- **Reverse Engineering Needed**: No
- **Workspace Root**: C:/Users/rumoa/Documents/proyectos/lista-compra

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only

## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis |
| Resiliency Baseline | No (reconsidered and disabled — disproportionate for a free-tier personal 2-person app) | Requirements Analysis |
| Property-Based Testing | Partial (only PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 enforced; rest advisory) | Requirements Analysis |

## Stage Progress

### INCEPTION PHASE
- [x] Workspace Detection — Greenfield, no existing code
- [ ] Reverse Engineering — N/A (greenfield)
- [x] Requirements Analysis — clarifying questions answered, extension decisions made, requirements.md approved by user
- [x] User Stories — 1 persona, 13 historias en 5 features, aprobadas por el usuario
- [x] Workflow Planning — execution-plan.md aprobado por el usuario
- [x] Application Design — SKIP (sin capa de servicios propia; backend es Supabase gestionado)
- [x] Units Generation — 4 unidades generadas (Fundaciones, Tiempo real+lote, Historial+Estadísticas, Onboarding+Acceso), aprobadas por el usuario

**INCEPTION PHASE: COMPLETE**

## Execution Plan Summary
- **Stages to Execute**: Units Generation, Functional Design (per unit), NFR Requirements (per unit), NFR Design (per unit), Infrastructure Design (per unit), Code Generation, Build and Test
- **Stages to Skip**: Application Design (no service layer of its own — Supabase is the managed backend)

### CONSTRUCTION PHASE

#### Unidad 1 — Fundaciones
- [x] Functional Design — domain-entities, business-rules, business-logic-model (con Testable Properties), frontend-components; aprobado
- [x] NFR Requirements — Vercel/Vitest/fast-check/RLS decididos; SECURITY-08 documentado como excepción aceptada; aprobado
- [x] NFR Design — RLS permisivo, paginación por cursor, fail-fast, common/ en submódulos; aprobado
- [x] Infrastructure Design — Vercel (prod+previews) + Supabase (proyecto único), aprobado
- [x] Code Generation — código y tests generados; 37/37 tests verificados (npm test); aprobado

**UNIDAD 1: COMPLETA**

#### Unidad 2 — Tiempo real y acciones en lote
- [x] Functional Design — BR-8 a BR-12, Testable Properties, componentes selection-bar/realtime-subscription; aprobado
- [x] NFR Requirements — sin indicador de conexión, RLS reutilizado, habilitar Realtime en products; aprobado
- [x] NFR Design — selection-state.js aislado, sin dedup de ecos, ciclo de vida de desuscripción; aprobado
- [x] Infrastructure Design — Realtime habilitado vía SQL versionado en schema.sql; aprobado
- [x] Code Generation — código y tests generados; 57/57 tests verificados (npm test); aprobado

**UNIDAD 2: COMPLETA**

#### Unidad 3 — Historial y estadísticas
- [x] Functional Design — BR-13 a BR-18, Testable Properties (PBT-03 bloqueante en esta unidad), componentes history/stats; aprobado
- [x] NFR Requirements — límite de 2000 compras, PBT-03 bloqueante; aprobado
- [x] NFR Design — filters.js/calculations.js aislados, recálculo sin caché; aprobado
- [x] Infrastructure Design — sin cambios (todo N/A); aprobado
- [x] Code Generation — código y tests generados; 82/82 tests verificados (npm test); aprobado

**UNIDAD 3: COMPLETA**

#### Unidad 4 — Onboarding y acceso
- [x] Functional Design — BR-19 a BR-23, extensión de stopgaps, qr-view.js, manifest.json; aprobado
- [x] NFR Requirements — QR vía esm.sh, sin icono PWA (pendiente); aprobado
- [x] NFR Design — patrones de error simples, reutilización sin duplicación; aprobado
- [x] Infrastructure Design — sin cambios (manifest.json estático, CSP ya permite esm.sh); aprobado
- [x] Code Generation — código y tests generados; 88/88 tests verificados (npm test); aprobado

**UNIDAD 4: COMPLETA**
**TODAS LAS UNIDADES: COMPLETAS**

- [x] Build and Test — build success, 88/88 tests, 1 vulnerabilidad real corregida (npm audit), integration tests documentados como pendientes de verificación manual del usuario; aprobado

**CONSTRUCTION PHASE: COMPLETE**

### OPERATIONS PHASE
- [ ] Placeholder (sin trabajo activo — despliegue real y verificación manual quedan como próximos pasos del usuario)

---

## CICLO 2 — Mejora de Usabilidad (iniciado 2026-07-24)

**Contexto**: Nueva solicitud del usuario tras CONSTRUCTION PHASE COMPLETE, para rediseñar la UX de la app "pantalla a pantalla". Se reabre Requirements Analysis solo para el alcance de cada pantalla nueva, sin reabrir las unidades 1-4 ya completas.

### Pantalla 1 — Listado de listas activas (Unidad 5)
- [x] Requirements Analysis — contradicción detectada y resuelta (alcance ampliado más allá de "solo UI/UX"); excepción de seguridad aceptada (BR-34); requirements.md ampliado con sección "Ciclo 2"; aprobado
- [x] Functional Design — domain-entities, business-rules (BR-24 a BR-34), business-logic-model (6 flujos + Testable Properties), frontend-components; aprobado
- [x] NFR Requirements — consulta agregada para participantes, sin cambios de RLS; aprobado
- [x] NFR Design — patrones de rendimiento/seguridad/fiabilidad, componentes lógicos; aprobado
- [x] Infrastructure Design — sin cambios reales, migración de esquema aditiva; aprobado
- [x] Code Generation — código y tests generados; 126/126 tests verificados (npm test); aprobado
- [x] Build and Test (incremental) — build success, integration-test-instructions.md/security-test-instructions.md/build-and-test-summary.md actualizados con el Scenario 6 y la excepción SECURITY-08 ampliada

**UNIDAD 5 (Pantalla 1): COMPLETA** — próximo paso del usuario: reejecutar `supabase/schema.sql` en el proyecto Supabase ya desplegado y verificar manualmente el Scenario 6 de `integration-test-instructions.md`.

### Pantalla 2 — Vista de lista de la compra (Unidad 6)
- [x] Requirements Analysis — 8 dudas resueltas (cambio de tipo de dato de quantity, sugeridos, iconos de categoría, scroll infinito, redundancia de cambiar nombre, confirmación en lote, navegación del wizard); requirements.md ampliado con sección "Pantalla 2"; aprobado
- [x] Functional Design — domain-entities, business-rules (BR-35 a BR-49), business-logic-model (9 flujos + Testable Properties), frontend-components (generaliza 3 componentes de Unidad 5 a common/); aprobado
- [x] NFR Requirements — migración destructiva de quantity asumida explícitamente, límite de 2000 filas para sugeridos; aprobado
- [x] NFR Design — patrones de rendimiento/seguridad/fiabilidad/mantenibilidad, componentes lógicos; aprobado
- [x] Infrastructure Design — sin cambios reales, migración de esquema aditiva-y-destructiva; aprobado
- [x] Code Generation — código y tests generados; 174/174 tests verificados (npm test); 2 bugs reales detectados y corregidos (getCategoryIcon con objeto plano, falta de re-render en handleAdd); aprobado
- [x] Build and Test (incremental) — build success, integration-test-instructions.md/security-test-instructions.md/build-and-test-summary.md actualizados con el Scenario 7

**UNIDAD 6 (Pantalla 2): COMPLETA Y APROBADA** — próximo paso del usuario: reejecutar el bloque de migración de la Unidad 6 en `supabase/schema.sql` (destructivo, revisar antes) y verificar manualmente el Scenario 7 de `integration-test-instructions.md`.

### Próximas pantallas
Pendientes de que el usuario las describa una a una (a petición explícita: "vamos a ir 1 a 1").

### Historial en Tickets (Unidad 7)
- [x] Requirements Analysis — 8 preguntas de aclaración respondidas (modelo con tabla `purchases` + FK, sin migración retroactiva, acciones individuales dentro del modal permitidas, filtros por "al menos un producto coincide", paginación/límite por ticket, estadísticas sin cambios); requirements.md ampliado con sección "Ciclo 2 — Historial en Tickets"; aprobado
- [x] Functional Design — 10 preguntas de aclaración respondidas (hack de `created_at` para reutilizar paginador, confirmación antes de deshacer/eliminar ticket completo, join completo purchases+products al cargar la lista, conteo siempre total, filtro reutilizando `filters.js` sobre productos, cascade de borrado, limpieza de huérfano en cliente); domain-entities/business-rules (BR-50 a BR-58)/business-logic-model/frontend-components generados; aprobado
- [x] NFR Requirements — migración aditiva sin riesgo, sin límites nuevos, RLS permisivo reutilizado, sin cambios de stack; aprobado
- [x] NFR Design — fail-fast sin compensación en operaciones multi-paso, sin componentes de infraestructura nuevos; aprobado
- [x] Infrastructure Design — mismo entorno Vercel+Supabase, migración manual aditiva, Realtime habilitado en `purchases` (alcance completo INSERT+DELETE, BR-59 añadida retroactivamente a Functional Design + generalización de `realtime-subscription.js` a `common/` en NFR Design); aprobado
- [x] Code Generation — migración de esquema, `common/realtime-subscription.js` generalizado, `ticket-row.js`/`ticket-product-row.js`/`ticket-modal.js` nuevos, `history-list.js` reescrito, `product-list.js` crea el ticket (BR-50); 214/214 tests pasan (36 nuevos/actualizados); `npm run build` verificado

- [x] Build and Test (incremental) — build success, 214/214 tests, integration-test-instructions.md/security-test-instructions.md/build-and-test-summary.md/unit-test-instructions.md actualizados con el Scenario 8

**UNIDAD 7 (Historial en Tickets): COMPLETA Y APROBADA** — próximo paso del usuario: ejecutar el bloque nuevo de `supabase/schema.sql` (`-- Unidad 7 — Historial en tickets`) en el proyecto Supabase ya desplegado, y verificar manualmente el Scenario 8 de `integration-test-instructions.md` (historial en vivo entre los dos móviles).

### Unidad 7 — Seguimiento: scroll infinito (BR-60)
- [x] Petición del usuario tras la aprobación: sustituir el botón "Cargar más" del historial por scroll infinito (mismo patrón que BR-48, Unidad 6). Implementado directamente en `history-list.js` (sin ambigüedad de diseño, reutiliza un patrón ya aprobado) + tests actualizados; 216/216 tests pasan; build verificado. Documentado como BR-60 en `functional-design/business-rules.md` y reflejado en `frontend-components.md`, `code/frontend-summary.md` y `build-and-test/*`.
- [ ] NFR Requirements
- [ ] NFR Design
- [ ] Infrastructure Design
- [ ] Code Generation
- [ ] Build and Test (incremental)

## CICLO 3 — Design System basado en Radix UI (iniciado 2026-07-29)

**Contexto**: Nueva solicitud del usuario tras Ciclo 2, para adoptar el lenguaje visual de Radix UI (Radix Colors + Radix Themes) como design system: color de acento Lime, neutro Sand, modo oscuro completo, tipografía Inter + escala Radix, escala completa de radios, remaquetado de todos los componentes visuales existentes.

- [x] Requirements Analysis — 7 preguntas de aclaración respondidas (alcance = remaquetar todo; acento Lime; neutro Sand; dark mode completo por `prefers-color-scheme`; tipografía Inter + escala Radix; escala completa de radios; verificación visual manual del usuario); requirements.md ampliado con sección "Ciclo 3"; aprobado
- [x] Workflow Planning — User Stories/Application Design/Units Generation/Functional Design/NFR Requirements/NFR Design/Infrastructure Design SKIP (cambio puramente visual, sin lógica de negocio ni infraestructura nueva); Code Generation en 5 lotes con checkpoints visuales; aprobado
- [x] Code Generation — Lote 0 (Fundaciones: tokens color/tipografía/radio) — `css/tokens.css` creado, `style.css`/`index.html` actualizados; 230/230 tests pasan; sin cambio visual todavía
- [x] Code Generation — Lote 1 (Componentes base: tarjetas/botones/chips/inputs) — `style.css` remaquetado (tipografía/fondo global, tarjetas, botones, chips, inputs); botón danger mantiene rojo hardcodeado (excepción documentada); 230/230 tests pasan; pendiente revisión visual del usuario

### REVISIÓN — Cambio de base a Material Design 3 (color + forma), Inter se mantiene
- [x] Requirements Analysis (reapertura) — usuario prefiere el sistema de color de M3; contradicción detectada y resuelta (alcance ampliado a color+forma, no solo color); requirements.md ampliado con sección "REVISIÓN Ciclo 3" (FR-29 a FR-32); valores oficiales calculados (HCT real vía `@material/material-color-utilities`, semilla Lime; shape/type scale desde tokens de `material-web` v0.192); aprobado
- [x] Code Generation — Lote 0-1 v2 (Fundaciones M3 + Componentes base, reemplaza Lotes 0-1 con Radix) — `css/tokens.css` reescrito (color/forma/tipografía M3), `style.css` remigrado; danger ya no es excepción (usa rol error M3); 230/230 tests pasan; pendiente revisión visual del usuario
- [x] Code Generation — Lote 2 (Componentes de listas) — `style.css` remaquetado (list-card, menú, cabecera/avatar/tabs, filas seleccionadas, FAB ahora corner-large, stepper, barra de selección); 230/230 tests pasan; pendiente revisión visual del usuario
- [x] Code Generation — Lote 3 (Modales e historial) — scrim y elevación por superficie reales de M3; último uso de tokens legacy (`--color-primary`/`--color-secondary`/`--radius`) eliminado; receipt/ticket-row excluidos (skeuomórfico, intencional); 230/230 tests pasan; pendiente revisión visual del usuario
- [x] Code Generation — Lote 4 (Onboarding/QR, detalles finales, modo oscuro) — `color-scheme: light dark` activado (modo oscuro end-to-end, FR-25 cerrado); `.meta` genérico añadido; verificación final sin colores hardcodeados fuera de sombras/receipt; 230/230 tests pasan; pendiente revisión visual del usuario

**CICLO 3 (Design System basado en Material Design 3): TODOS LOS LOTES COMPLETOS** — próximo paso: verificación visual final del usuario y Build and Test

- [x] Build and Test (incremental) — build success (falla solo por falta de env vars Supabase locales, no relacionado), 230/230 tests (sin cambios, es un cambio puramente de CSS/HTML), `npm audit` sin hallazgos nuevos; Scenario 9 (verificación visual manual M3 claro/oscuro) añadido a `integration-test-instructions.md`; `build-and-test-summary.md` actualizado

**CICLO 3: BUILD AND TEST COMPLETO** — pendiente: confirmación visual final del usuario (Scenario 9)

**CICLO 3 (Design System basado en Material Design 3): COMPLETO Y APROBADO** — próximo paso del usuario: confirmar visualmente el Scenario 9 (modo claro/oscuro, botón danger, receipt) de `integration-test-instructions.md`.
- [ ] Build and Test

### Unidad 5 — Seguimiento: tarjeta "Crear nueva lista" (BR-66)
- [x] Petición del usuario: la "Crear nueva lista" pasa de botón de cabecera a tarjeta con forma de `list-card`, primera del listado, icono "+" en contenedor gris redondeado, subtítulo "Toca para empezar"; estado vacío se mantiene debajo. 3 dudas de diseño resueltas por el usuario antes de implementar (estado vacío, subtítulo, forma del icono). Implementado directamente en `home/list-card.js` (nueva función `renderCreateListCard`) y `home/home-screen.js` + estilos en `css/style.css`; 228/228 tests pasan (sin cambios de test necesarios, mismo `data-testid`); build verificado (falla únicamente por falta de variables de entorno Supabase locales, no relacionado). Documentado como BR-66 en `functional-design/business-rules.md` y reflejado en `frontend-components.md`.

### Unidad 7 — Seguimiento: título de ticket (dónde se compró)
- [x] Petición del usuario: añadir un título opcional al ticket (dónde se compró), mostrado delante de la fecha en la fila del historial, y en la cabecera del modal de detalle en vez de la fecha/hora. 3 preguntas de aclaración resueltas (se puede indicar tanto al marcar como comprado como editar después desde el modal; título y fecha en la misma línea en la fila; placeholder "Sin título" cuando falta). Implementado: migración aditiva `purchases.title` en `supabase/schema.sql` (constraint `purchases_title_length`, 1-50 opcional); `validatePurchaseTitle` en `common/validation.js`; `history/purchases-api.js` nuevo (`updatePurchaseTitle`); `history/purchase-title-modal.js` nuevo (formulario opcional antes de crear el ticket); `list/product-list.js` reestructurado (`handleMarkAsBought` abre el modal de título, `performMarkAsBought` ejecuta la operación); `history/ticket-row.js` muestra "título · fecha"; `history/ticket-modal.js` cabecera del modal (`setTitle`, nuevo en `common/modal.js`) muestra el título en vez de fecha/hora, con edición inline (lápiz) dentro del recibo; `history/history-list.js` añade `onUpdate` a Realtime para reflejar ediciones desde otro dispositivo. 247/247 tests pasan (incluye nuevos/actualizados en `ticket-row`, `ticket-modal`, `product-list`, `history-list`, `validation`, `purchase-title-modal`); build verificado (falla únicamente por falta de variables de entorno Supabase locales, no relacionado).

**UNIDAD 7 (Seguimiento — título de ticket): IMPLEMENTADA** — próximo paso del usuario: ejecutar el nuevo bloque de `supabase/schema.sql` ("Unidad 7 (seguimiento) — título de ticket") en el proyecto Supabase ya desplegado, y verificar manualmente el flujo (crear ticket con/sin título, editar título desde el modal, comprobar que se refleja en la fila y en vivo en otro dispositivo).

### Unidad 7 — Seguimiento: mover la edición del título a la cabecera del modal
- [x] Petición del usuario tras revisar la Unidad 7 (seguimiento) anterior: no editar el título dentro del "papel" del recibo — el recibo vuelve a mostrar siempre el texto fijo "TICKET DE COMPRA" (sin el título del ticket). La edición pasa a la cabecera del modal (el `<h2>` genérico de `common/modal.js`): click/tap sobre ella abre un input inline (Enter/blur guarda, Escape cancela). `common/modal.js` expone ahora `titleEl` (el nodo `<h2>`) en vez de `setTitle`, para que `ticket-modal.js` pueda hacerlo interactivo sin acoplar ese comportamiento al componente genérico. Eliminado el lápiz y el formulario que vivían dentro del recibo (`receipt-store-row`, CSS asociado). 250/250 tests pasan (7 tests de edición de título reescritos/añadidos en `ticket-modal.test.js`).

**UNIDAD 7 (Seguimiento): AJUSTE COMPLETO** — próximo paso del usuario: verificación manual (click en la cabecera del modal para editar el título, Enter/blur guarda, Escape cancela, el recibo muestra siempre "TICKET DE COMPRA").

## CICLO 4 — Motion physics (M3) y skeletons de carga (iniciado 2026-07-30)

**Contexto**: Nueva solicitud del usuario para adoptar el sistema de movimiento de M3 (m3.material.io/styles/motion/overview/how-it-works) en transiciones entre pantallas y feedback de acciones, y añadir skeletons de carga (M3) donde hoy el contenido aparece de golpe. 3 preguntas de aclaración respondidas: esquema **Expressive** (curvas "emphasized", más marcadas); alcance de motion ampliado a "todo lo que se te ocurra" (cambios de tab, modales, filas de lista, navegación inicio→lista, feedback táctil de botones/FAB); skeletons en las 4 pantallas con carga inicial (inicio, lista, historial, estadísticas). Cambio puramente visual/UX sin lógica de negocio ni infraestructura nueva (mismo patrón que Ciclo 3) — se salta Requirements/User Stories/Application Design/Units Generation formales y se ejecuta directamente como Code Generation.

- [x] Code Generation:
  - `css/tokens.css`: tokens de movimiento M3 (duraciones short/medium/long, curvas standard/emphasized decelerate-accelerate).
  - `css/style.css`: `@view-transition` (cross-document, home→lista, progressive enhancement), `prefers-reduced-motion` global (colapsa toda animación/transición), entrada escalonada de filas/tarjetas (`.motion-row-enter` + `--stagger-index`), skeletons con shimmer (`.skeleton-block` + variantes list-row/list-card/stat-block), animación de entrada/salida de modal, transición de cambio de tab (`#app-view.view-transition-in/out`), feedback táctil (`:active` scale) en fab/button/icon-button/tab/list-card, entrada animada de la selection-header (solo al activarse, no en cada cambio de contador).
  - `src/common/skeleton.js` (nuevo): `renderSkeleton()`, 3 variantes.
  - `src/common/modal.js`: `close()` ahora anima la salida antes de eliminar el overlay — espera `getAnimations()[].finished` (vacío en jsdom, por lo que los tests siguen siendo síncronos) con un timeout de seguridad de 500ms (cubre pestaña en segundo plano/animación cancelada, sin lo cual el overlay se queda bloqueando la pantalla para siempre — detectado durante la verificación visual, ver más abajo).
  - `src/list/tabs.js`: transición de entrada en el contenedor de vista al cambiar de tab, sin retrasar la llamada real a `render()`.
  - `src/home/home-screen.js`, `src/list/product-list.js`, `src/history/history-list.js`, `src/stats/stats-page.js`: skeleton antes del primer fetch + entrada escalonada de filas/tarjetas; añadido manejo de error que limpia el skeleton si el fetch inicial falla (antes de los skeletons este caso no tenía ningún indicador, así que el hueco pasaba desapercibido — sin el fix, el skeleton se quedaría animando para siempre).
  - `src/bulk-actions/selection-bar.js`: animación de entrada de la barra de selección solo en la transición 0→N seleccionados.
  - 251/251 tests pasan (sin tests nuevos — es un cambio de motion/CSS + fixes de manejo de errores, cubierto por los tests existentes de cada pantalla); `npm run build` falla solo por falta de variables de entorno Supabase locales (no relacionado, mismo patrón que ciclos anteriores).
  - Verificación visual manual en el navegador embebido: tokens de movimiento presentes (`getComputedStyle`), sin errores de consola, skeleton se limpia correctamente en error, `openModal()`/`close()` verificado directamente (detectó y corrigió el bug del timeout de seguridad descrito arriba). La navegación real a una lista concreta y el cambio de tab con datos reales no se pudieron verificar end-to-end en este entorno (sin backend Supabase local ni SPA-fallback en el servidor estático de preview) — pendiente de verificación manual del usuario.

**CICLO 4: IMPLEMENTADO** — próximo paso del usuario: verificar manualmente en un móvil/navegador real con la app desplegada — abrir/cerrar modales, cambiar de tab, marcar productos como comprados (entrada/salida de filas), activar la selección múltiple, cargar cada pantalla con conexión lenta (skeletons) y comprobar `prefers-reduced-motion` si lo tiene activado.

### Unidad 6 — Seguimiento: "Editar lista de la compra" en el menú del avatar
- [x] Petición del usuario: en el menú del avatar (topbar de `list/greeting.js`), justo después de "Hola, X", añadir una opción "Editar lista de la compra" que abra el mismo modal de crear/editar lista (título+icono, `home/list-form-modal.js`) que ya usa `home/list-card.js`. Implementado: `greeting.js` acepta un nuevo `onEditList` y añade la entrada `edit-list` al menú; `main.js` define `handleEditList` (abre `openListFormModal({ mode: 'edit', household, onSaved })`, y tras guardar refresca `household.title`/`household.image_icon` locales vía `fetchHousehold` y vuelve a pintar la topbar sin recargar la página). 251/251 tests pasan (1 test nuevo en `greeting.test.js`).

**UNIDAD 6 (Seguimiento): COMPLETA** — próximo paso del usuario: verificación manual (abrir el menú del avatar, pulsar "Editar lista de la compra", cambiar título/icono, comprobar que la topbar se actualiza).

### Common — Seguimiento: modal y teclado virtual en móvil
- [x] Petición del usuario: al enfocar un input dentro de un modal en móvil, el modal debe subir al tope de la pantalla y el footer con los botones debe quedar siempre por encima del teclado virtual (antes, `position: fixed` con `align-items: center` se centraba sobre el layout viewport completo, quedando detrás del teclado o con el footer tapado). 2 preguntas de aclaración resueltas: aplica a todos los modales (centrados y el fullscreen del wizard); enfoque VisualViewport API (JS) en vez de `interactive-widget=resizes-content` porque este último no funciona en iOS Safari. Implementado en `src/common/modal.js` (listeners `resize`/`scroll` de `window.visualViewport` que anclan el overlay al área visual real vía `top`/`height` inline y activan `.modal-overlay--keyboard-open`; `focusin` en inputs/textarea/select recalcula tras 50ms y hace `scrollIntoView`) y `css/style.css` (`.modal-overlay--keyboard-open { align-items: flex-start }` + `.modal-panel { max-height: 100% }` dentro de esa clase). 251/251 tests pasan (guard `scrollIntoView?.()` necesario porque jsdom no lo implementa); build verificado (falla únicamente por falta de variables de entorno Supabase locales, no relacionado).

**COMMON (Seguimiento — modal y teclado virtual): IMPLEMENTADA** — próximo paso del usuario: verificación manual en móvil real (iOS Safari y Android Chrome) — abrir varios modales (crear/editar lista, título de ticket, wizard de producto), tocar un input y comprobar que el modal sube arriba y el footer/botones quedan siempre visibles por encima del teclado.

## Notes
- User supplied a pre-written Project Brief (docs style AI-DLC Inception brief) covering intent, actors, MVP scope, out-of-scope, assumptions, NFRs, draft data model, proposed bolts, success criteria, and open questions.
- This will be used as the primary input to Requirements Analysis rather than starting from scratch.
- Ciclo 2 (mejora de usabilidad): el usuario actúa como experto en usabilidad/flujos de usuario y describe el rediseño pantalla a pantalla; cada pantalla se trata como una unidad incremental (Unidad 5+) con su propio ciclo Functional Design → Code Generation, sin reabrir las unidades 1-4.
