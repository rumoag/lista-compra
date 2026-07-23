# Tech Stack Decisions — Unidad 2: Tiempo real y acciones en lote

| Decisión | Elección | Justificación |
|---|---|---|
| Mecanismo de tiempo real | Supabase Realtime (Postgres Changes) sobre `products` | Ya decidido en Requirements Analysis |
| Indicador de conexión | Ninguno (Question 1 = A) | Reconexión transparente suficiente para 2 usuarios |
| Políticas RLS para Realtime | Reutilizar las de `SELECT` ya creadas (Question 2 = A) | Sin necesidad de políticas específicas adicionales |
| Publicación Realtime | Añadir `products` a `supabase_realtime` (Question 3 = A) | Requisito de Supabase para emitir eventos |
| Testing | Vitest + fast-check (heredado de Unidad 1) | Sin cambios de stack |

No se añaden nuevas dependencias de proyecto en esta unidad (Realtime ya forma parte de `@supabase/supabase-js`).
