# Deployment Architecture — Unidad 6: Vista de lista de la compra

Sin cambios respecto al diagrama de la Unidad 5 (Vercel + Supabase, un único proyecto). Único cambio: migración de esquema aditiva-y-destructiva sobre `products` (nuevas columnas `quantity_number`/`quantity_unit`, eliminación de `quantity`), aplicada manualmente por el usuario en el SQL Editor de Supabase ejecutando solo el bloque nuevo de `supabase/schema.sql`.
