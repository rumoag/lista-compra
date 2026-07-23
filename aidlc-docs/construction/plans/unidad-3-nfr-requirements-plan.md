# NFR Requirements Plan — Unidad 3: Historial y estadísticas

## Contexto ya decidido (heredado)
- Vercel, Supabase, Vitest, fast-check (modo parcial, PBT-03 bloqueante en esta unidad), RLS permisivo ya cubre lectura de `products` con `status='bought'`.

## Checklist de ejecución
- [ ] Confirmar respuesta a la pregunta de contexto
- [ ] Generar `aidlc-docs/construction/unidad-3/nfr-requirements/nfr-requirements.md`
- [ ] Generar `aidlc-docs/construction/unidad-3/nfr-requirements/tech-stack-decisions.md`

## Pregunta de contexto

### Question 1 — Límite de tamaño para el cálculo de estadísticas
BR-15 calcula las estadísticas sobre **todo** el histórico. Tras años de uso esto podría ser miles de filas cargadas y procesadas en el cliente. ¿Ponemos un límite de seguridad?

A) Sí, cargar como máximo las últimas 2000 compras para el cálculo de estadísticas (suficiente para años de uso de 2 personas, evita que el cliente cargue un dataset ilimitado)

B) No, sin límite — cargar siempre el histórico completo tal como decidiste en Functional Design (Question 3 = A), es un proyecto personal y el volumen real será bajo

X) Other (please describe after [Answer]: tag below)

[Answer]: A
