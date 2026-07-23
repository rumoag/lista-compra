# Domain Entities — Unidad 2: Tiempo real y acciones en lote

No se añaden entidades nuevas. Se reutiliza `Product` (ver `aidlc-docs/construction/unidad-1/functional-design/domain-entities.md`), ejercitando ahora los campos `status = 'bought'`, `bought_by`, `bought_at` que ya existían en el esquema desde la Unidad 1.

## Concepto de dominio nuevo: Selección múltiple (transversal, no persistido)
- Representa el conjunto de `product.id` marcados por checkbox en la UI en un momento dado.
- **Efímero** (Question 3 = A): vive solo en memoria del cliente, se resetea al recargar la app. No se persiste en `localStorage` ni en Supabase.
