# NFR Design Plan — Unidad 1: Fundaciones

## Checklist de ejecución

- [ ] Confirmar respuestas a las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/construction/unidad-1/nfr-design/nfr-design-patterns.md`
- [ ] Generar `aidlc-docs/construction/unidad-1/nfr-design/logical-components.md`

## Categorías evaluadas

- **Scalability Patterns**: N/A — carga trivial (2 usuarios), sin mecanismos de escalado necesarios (ya justificado en `nfr-requirements.md`). No se generan preguntas para esta categoría.
- **Resilience Patterns**: aplica parcialmente (ver Question 3) aunque la extensión de Resiliencia esté desactivada — el manejo de errores básico (BR-6) sigue siendo relevante a nivel de diseño.
- **Performance Patterns**: aplica parcialmente (ver Question 2).
- **Security Patterns**: aplica directamente (ver Question 1) — diseño concreto de políticas RLS.
- **Logical Components**: aplica directamente (ver Question 4).

## Preguntas de contexto

### Question 1 — Diseño concreto de políticas RLS
Dado que no hay autenticación (RLS no puede filtrar por identidad real, según lo documentado en NFR Requirements), ¿qué alcance quieres para las políticas RLS de `households` y `products`?

A) Políticas permisivas (`USING (true)` / `WITH CHECK (true)`) para SELECT/INSERT/UPDATE/DELETE en ambas tablas — el control de acceso real es la obscuridad del UUID, RLS solo evita que las tablas queden completamente sin políticas

B) Políticas permisivas para SELECT/INSERT/UPDATE en `products`, pero **sin permitir DELETE directo vía API** (los borrados de productos, si se necesitan, pasarían por una función controlada) — más restrictivo

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Paginación de la lista de pendientes
La lista de pendientes de un hogar de 2 personas normalmente será pequeña (decenas de productos como mucho). ¿Necesitamos paginación en la Unidad 1?

A) No, cargar todos los productos pendientes del household de una vez (sin paginación) — suficiente para el volumen esperado

B) Sí, implementar paginación desde el principio por si acaso

X) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Reintentos ante fallo de red
BR-6 ya define que se revierte la UI optimista y se muestra error ante un fallo de escritura. ¿Añadimos algún reintento automático antes de darlo por fallido?

A) No, un solo intento; si falla, revertir y mostrar error inmediatamente (más simple, consistente con el resto de decisiones de bajo overhead del proyecto)

B) Sí, 1-2 reintentos automáticos con backoff antes de revertir

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Componente lógico: cliente Supabase y validación compartida
Se propone un módulo `common/` con: (a) instancia única del cliente Supabase, (b) funciones de validación (`validateProductName`, etc.), (c) helper de "optimistic update" reutilizable. ¿Confirmas esta agrupación o prefieres separarlos en módulos distintos?

A) Confirmo la agrupación en un único módulo `common/` (más simple para un proyecto de este tamaño)

B) Prefiero separar en submódulos distintos, ej. `common/supabase-client.js`, `common/validation.js`, `common/optimistic.js`

X) Other (please describe after [Answer]: tag below)

[Answer]: B
