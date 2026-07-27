# Deployment Architecture — Unidad 7: Historial en Tickets

Sin cambios en la arquitectura de despliegue respecto a unidades anteriores:

```
[Móvil A] ──┐
            ├──> Vercel (estático) ──> Supabase (Postgres + Realtime + RLS)
[Móvil B] ──┘
```

## Pasos de despliegue para esta unidad (Question 2 = A)
1. Ejecutar manualmente el bloque nuevo de `supabase/schema.sql` (tabla `purchases` + columna `products.purchase_id` + políticas RLS + `alter publication supabase_realtime add table purchases`) en el SQL Editor del proyecto Supabase ya desplegado — migración aditiva, sin riesgo de pérdida de datos (a diferencia del flujo de "solo el bloque nuevo, con cuidado" de la Unidad 6, aquí no hay paso destructivo que aislar, pero se sigue el mismo hábito de ejecutar solo el bloque nuevo para no reprocesar migraciones ya aplicadas).
2. Desplegar el código (Vercel, mismo pipeline ya existente — build estático, sin pasos nuevos).
3. Verificar manualmente (post-despliegue): marcar productos como comprados desde un móvil y comprobar que el otro ve el ticket nuevo en el historial en vivo (BR-59); deshacer/eliminar un ticket desde un móvil y comprobar que desaparece en vivo en el otro.
