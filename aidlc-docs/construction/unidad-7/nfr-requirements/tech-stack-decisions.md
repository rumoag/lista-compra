# Tech Stack Decisions — Unidad 7: Historial en Tickets

**Decisión (Question 4 = A)**: sin cambios de stack.

- Base de datos: Supabase (Postgres) — nueva tabla `purchases` + FK `products.purchase_id`, mismo patrón de esquema y RLS ya usado en el proyecto.
- Frontend: vanilla JS/CSS, sin librerías de UI externas, mismo patrón de componentes que Unidades 1-6.
- Sin dependencias nuevas en `package.json`.
- Sin APIs del navegador nuevas.
