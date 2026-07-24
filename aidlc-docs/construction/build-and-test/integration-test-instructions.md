# Integration Test Instructions

## Purpose
Esta app es un único frontend (sin microservicios) que integra con Supabase (Postgres + RLS + Realtime). Las "integraciones" relevantes son entre el cliente y Supabase, y entre dos dispositivos/pestañas compartiendo el mismo household vía Realtime. No hay otros servicios que integrar.

**Nota**: estas pruebas requieren un proyecto Supabase real y no se han podido ejecutar en este entorno de trabajo (sin acceso a un proyecto Supabase provisto). Quedan documentadas como pasos manuales para que el usuario las ejecute tras desplegar.

## Test Scenarios

### Scenario 1: Alta de producto → visible en tiempo real en otro dispositivo
- **Setup**: abrir la misma URL de household en dos pestañas/dispositivos distintos, cada uno con un nombre local distinto.
- **Test Steps**: en la pestaña A, pulsar el botón flotante (+) y completar el asistente de 3 pasos (producto, cantidad, categoría).
- **Expected Results**: el producto aparece en la pestaña B en segundos, sin recargar (US-1.1, US-1.2).
- **Cleanup**: eliminar el producto de prueba.

### Scenario 2: Selección múltiple → marcar como comprados → aparece en historial
- **Setup**: tener 3+ productos pendientes.
- **Test Steps**: seleccionar 3 productos, pulsar "Marcar como comprados".
- **Expected Results**: los 3 desaparecen de la lista de pendientes (en ambos dispositivos vía Realtime) y aparecen en el Historial con `bought_by`/`bought_at` correctos (US-2.1, US-2.2, US-3.1).
- **Cleanup**: desmarcar o eliminar del historial.

### Scenario 3: Corrección de historial no afecta estadísticas incorrectamente
- **Setup**: historial con al menos un producto comprado por error.
- **Test Steps**: desmarcarlo desde el Historial.
- **Expected Results**: vuelve a la lista de pendientes y desaparece del historial y de las estadísticas (US-3.3).

### Scenario 4: Estadísticas reflejan datos reales
- **Setup**: varias compras del mismo producto en fechas distintas (ej. "Leche" comprada 3 veces con ~6-7 días de diferencia).
- **Test Steps**: abrir la pestaña Estadísticas.
- **Expected Results**: el ranking muestra "Leche" con el conteo correcto; la cadencia media es aproximadamente el intervalo real entre compras (US-4.1, US-4.2).

### Scenario 5: Creación de hogar → QR → acceso desde otro dispositivo
- **Setup**: entrar a la URL raíz del sitio desplegado (sin household).
- **Test Steps**: pulsar "Crear nueva lista", luego abrir la pestaña "QR" y escanear el código con la cámara de otro móvil.
- **Expected Results**: el segundo dispositivo accede directamente a la misma lista, se le pide un nombre local, y puede interactuar con la lista compartida (US-5.2, US-5.3).

### Scenario 6 (Unidad 5): Pantalla de inicio — crear, editar, ver QR y eliminar una lista
- **Setup**: entrar a la URL raíz del sitio desplegado, con al menos una lista ya existente y con productos añadidos por 2+ nombres distintos.
- **Test Steps**:
  1. Verificar que la pantalla de inicio muestra una tarjeta por cada lista existente, con título, icono y participantes correctos.
  2. Pulsar "Crear nueva lista", rellenar título e icono, confirmar → aparece una tarjeta nueva.
  3. Abrir el menú de 3 puntos de una tarjeta → "Editar" → cambiar título/icono → confirmar → la tarjeta refleja el cambio.
  4. Abrir el menú de 3 puntos → "Ver QR" → confirmar que se muestra el QR correcto para esa lista.
  5. Abrir el menú de 3 puntos → "Eliminar" → confirmar en el modal → la tarjeta desaparece y sus productos/historial dejan de existir.
  6. Click en el área principal de una tarjeta (fuera del menú) → navega a `/{householdId}` y muestra esa lista.
- **Expected Results**: todos los pasos anteriores funcionan sin errores, y los modales se cierran correctamente con la "X" y con "Cancelar" (BR-31 a BR-33).
- **⚠️ Nota de privacidad esperada (comportamiento intencional, BR-34)**: en este escenario, la pantalla de inicio debe mostrar **todas** las listas existentes en el proyecto Supabase, no solo las creadas/visitadas desde este dispositivo — esto es el comportamiento diseñado, no un bug.
- **Cleanup**: eliminar la lista de prueba creada en el paso 2 si no se eliminó ya en el paso 5.

### Scenario 7 (Unidad 6): Vista de lista de la compra rediseñada
- **Setup**: entrar a una lista con al menos 25 productos pendientes (para forzar scroll infinito con `PAGE_SIZE = 20`) y localStorage con un nombre local ya guardado.
- **Test Steps**:
  1. Verificar que la cabecera muestra el icono+título de la lista (no el `<h1>` genérico) y que el saludo "Hola, {nombre}" aparece debajo.
  2. Pulsar el saludo → se abre el modal de cambiar nombre, precargado; guardar un nombre nuevo → el saludo se actualiza.
  3. Abrir el menú de 3 puntos de la cabecera → verificar "Cambiar nombre" (misma acción que el paso 2), "Ver QR" (abre modal con el QR correcto) y "Volver al listado de listas" (navega a `/`).
  4. En el tab "Lista", hacer scroll hasta el final → se cargan automáticamente más productos sin pulsar ningún botón (BR-48).
  5. Pulsar el botón flotante (+) → completar los 3 pasos (elegir un chip sugerido en el paso 1, ajustar el stepper de cantidad tocando el número para abrir el teclado numérico en el paso 2, elegir una categoría con icono en el paso 3) → Guardar → el producto aparece con su icono de categoría.
  6. Repetir la creación de un producto con nombre nuevo vía "Otros" y categoría vía "Otra…" → validar que también funciona.
  7. Click sobre el cuerpo de un item (no el menú) → se marca su checkbox; aparece la barra de selección con "Seleccionar todos", "Marcar como comprados" y "Eliminar seleccionados".
  8. Pulsar "Seleccionar todos" → deben seleccionarse **todos** los pendientes, incluso los que no se habían cargado aún por scroll infinito (BR-43) → el botón cambia a "Deseleccionar todos".
  9. Pulsar "Eliminar seleccionados" → aparece el modal de confirmación con el conteo correcto → confirmar → todos desaparecen.
  10. Abrir el menú de 3 puntos de un item individual → "Editar" abre el wizard precargado con sus valores → "Eliminar" pide confirmación individual antes de borrar.
  11. Vaciar la lista por completo → verificar el nuevo mensaje de estado vacío ("No hay nada en tu cesta de la compra todavía...").
- **Expected Results**: todos los pasos funcionan sin errores; el wizard nunca deja avanzar sin un producto/categoría válidos; cerrar el wizard con la "X" en cualquier paso descarta el progreso sin pedir confirmación (BR-44).
- **Cleanup**: eliminar los productos de prueba creados.

## Setup Integration Test Environment

### 1. Requisitos
- Proyecto Supabase real con `supabase/schema.sql` ejecutado. **Importante (Unidades 5 y 6)**: si el proyecto Supabase ya existía de un despliegue anterior, **NO reejecutes el archivo completo** — falla porque `create policy` no soporta `IF NOT EXISTS` en Postgres y las políticas de Unidad 1/2 ya existen. Ejecuta únicamente, en orden, el bloque `-- Unidad 5 — título e icono de lista` (si no lo hiciste ya) y después el bloque `-- Unidad 6 — cantidad numérica en productos`. **Este último elimina la columna `quantity`** — es irreversible, revísalo antes de ejecutarlo si tienes datos reales que te importen.
- Variables de entorno configuradas (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- Sitio desplegado en Vercel (o servido localmente con `npx serve .` tras `npm run build`).

### 2. Ejecución
Seguir manualmente los 7 escenarios anteriores, usando dos pestañas/dispositivos.

## Limitación en este entorno de trabajo
No se dispone de un proyecto Supabase real conectado en este entorno para ejecutar estos escenarios automáticamente. **Quedan pendientes de verificación manual por el usuario** tras el despliegue.
