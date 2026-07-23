# Business Logic Model — Unidad 2: Tiempo real y acciones en lote

## Flujo: Suscripción Realtime
1. Al montar la vista de lista (tras la carga inicial paginada de la Unidad 1), suscribirse a un canal de Supabase Realtime filtrado por `household_id`.
2. Al recibir `INSERT` de un producto `pending` no presente localmente → `paginator.prependItem` (BR-8).
3. Al recibir `UPDATE` que cambia `status` a `bought` → `paginator.removeItem` + quitar de la selección si estaba seleccionado (BR-10).
4. Al recibir `DELETE` → `paginator.removeItem` + quitar de la selección si estaba seleccionado.
5. Al desmontar la vista (navegación fuera), cancelar la suscripción (`channel.unsubscribe()`).

## Flujo: Selección múltiple
1. Cada `product-item` pendiente muestra un checkbox.
2. Marcar/desmarcar un checkbox añade/quita el `id` de un `Set` de selección en memoria (BR-10).
3. La UI muestra el recuento de seleccionados y habilita "Marcar como comprados" solo si el `Set` no está vacío (US-2.1).

## Flujo: Marcar como comprados (BR-11)
1. Capturar el `Set` de ids seleccionados.
2. Aplicar de forma optimista: mover los N productos de la vista de pendientes (desaparecen de la lista), limpiar la selección.
3. Ejecutar una única llamada `update({status:'bought', bought_by: localName, bought_at: now}).in('id', ids)`.
4. Si falla, revertir: reinsertar los N productos en la vista de pendientes (posiciones no garantizadas exactamente iguales, pero presentes) y restaurar su selección; mostrar un único error genérico.
5. Si tiene éxito, no se requiere acción adicional — los productos ya no están en la vista de pendientes (pertenecen ahora al historial, Unidad 3).

## Testable Properties (PBT-01 — orientativo, modo parcial)

| Función | Categoría | Propiedad |
|---|---|---|
| `toggleSelection(selectionSet, id)` | Round-trip (auto-inversa) | Aplicar `toggleSelection` dos veces sobre el mismo `id` devuelve un conjunto equivalente al original: `toggle(toggle(S, id), id) == S`. |
| `selectAll(ids)` / `clearSelection()` | Invariante | Tras `selectAll(ids)`, el tamaño del conjunto de selección es igual al número de ids pasados (sin duplicados); tras `clearSelection()`, el conjunto está siempre vacío independientemente del estado previo. |
| `applyBulkOptimistic` (aplicación en lote de BR-11) | Invariante | El número de productos removidos de la vista de pendientes al aplicar de forma optimista es exactamente igual al tamaño del conjunto de selección en el momento de la acción. |

**Componentes sin propiedades PBT identificadas**: la suscripción Realtime en sí (wrapper sobre el canal de Supabase) es I/O de red, no una transformación pura — se marca **N/A** para PBT-02/03, se prueba mediante simulación de eventos (ver tests, no PBT) en Code Generation.
