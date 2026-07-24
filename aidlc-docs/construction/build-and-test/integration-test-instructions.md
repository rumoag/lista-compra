# Integration Test Instructions

## Purpose
Esta app es un único frontend (sin microservicios) que integra con Supabase (Postgres + RLS + Realtime). Las "integraciones" relevantes son entre el cliente y Supabase, y entre dos dispositivos/pestañas compartiendo el mismo household vía Realtime. No hay otros servicios que integrar.

**Nota**: estas pruebas requieren un proyecto Supabase real y no se han podido ejecutar en este entorno de trabajo (sin acceso a un proyecto Supabase provisto). Quedan documentadas como pasos manuales para que el usuario las ejecute tras desplegar.

## Test Scenarios

### Scenario 1: Alta de producto → visible en tiempo real en otro dispositivo
- **Setup**: abrir la misma URL de household en dos pestañas/dispositivos distintos, cada uno con un nombre local distinto.
- **Test Steps**: añadir un producto desde la pestaña A.
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

## Setup Integration Test Environment

### 1. Requisitos
- Proyecto Supabase real con `supabase/schema.sql` ejecutado. **Importante (Unidad 5)**: si el proyecto Supabase ya existía de un despliegue anterior a la Unidad 5, hay que volver a ejecutar `supabase/schema.sql` (o al menos el bloque final de migración de `households`) para aplicar las columnas `title`/`image_icon` — no es un esquema nuevo, es aditivo sobre el existente.
- Variables de entorno configuradas (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
- Sitio desplegado en Vercel (o servido localmente con `npx serve .` tras `npm run build`).

### 2. Ejecución
Seguir manualmente los 6 escenarios anteriores, usando dos pestañas/dispositivos.

## Limitación en este entorno de trabajo
No se dispone de un proyecto Supabase real conectado en este entorno para ejecutar estos escenarios automáticamente. **Quedan pendientes de verificación manual por el usuario** tras el despliegue.
