# NFR Design Patterns — Unidad 1: Fundaciones

## Security Pattern: RLS permisivo + obscuridad de UUID
- Políticas RLS en `households` y `products`: `USING (true)` y `WITH CHECK (true)` para SELECT/INSERT/UPDATE/DELETE (Question 1 = A).
- **Justificación de diseño**: sin autenticación, RLS no puede filtrar por identidad. Su función aquí es puramente evitar el estado por defecto inseguro de Supabase (tabla sin ninguna política = sin acceso), no aislar por household. El aislamiento real es la obscuridad del UUID del household (ya aceptado como supuesto de seguridad en `requirements.md`).
- **Defensa en profundidad complementaria**: constraints `CHECK` a nivel de columna (longitud/formato de `name`, `quantity`, `category`) y FK `household_id` con `ON DELETE CASCADE` o restricción equivalente, para que RLS + constraints trabajen juntos (SECURITY-11).

## Performance Pattern: Paginación de la lista de pendientes
- Se implementa paginación desde la Unidad 1 (Question 2 = B), aunque el volumen esperado sea bajo.
- **Patrón**: paginación basada en cursor por `created_at` (más robusto que offset ante inserciones concurrentes), tamaño de página fijo (ej. 20 productos), con botón "Cargar más" en vez de scroll infinito (más simple de implementar en vanilla JS).
- **Nota de diseño**: al activarse Realtime en la Unidad 2, los nuevos productos deben insertarse al principio de la vista actual (no forzar recarga de todas las páginas) para no romper la paginación ya cargada.

## Resilience Pattern: Fail-fast sin reintentos
- Un solo intento de escritura contra Supabase (Question 3 = A); si falla, se revierte el cambio optimista inmediatamente y se muestra un error genérico (BR-6, SECURITY-15).
- **Justificación**: consistente con el resto de decisiones de bajo overhead del proyecto (sin extensión de Resiliencia activa); los reintentos automáticos añadirían complejidad sin beneficio claro para 2 usuarios en una red doméstica/móvil normal.

## Logical Components
Ver detalle completo en `logical-components.md`. Resumen: módulo `common/` dividido en submódulos (Question 4 = B): `supabase-client.js`, `validation.js`, `optimistic.js`, y nuevo `pagination.js` (derivado de la decisión de Question 2).
