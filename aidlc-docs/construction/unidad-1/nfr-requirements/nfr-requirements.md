# NFR Requirements — Unidad 1: Fundaciones

## Scalability
- Carga esperada: 2 usuarios concurrentes como máximo. Sin requisitos de escalado — la capa gratuita de Supabase/Vercel es más que suficiente.

## Performance
- Sin benchmarks formales de latencia. Se espera que las operaciones CRUD respondan en el orden de cientos de milisegundos (típico de Supabase en capa gratuita), suficiente para uso interactivo de 2 personas.

## Availability
- Sin SLA (extensión de Resiliencia desactivada). Se acepta la disponibilidad por defecto de Supabase/Vercel en capa gratuita, sin redundancia adicional ni objetivos de RTO/RPO.

## Security (Extensión Security Baseline — bloqueante)
Reglas aplicables a la Unidad 1 y cómo se cumplen:

- **SECURITY-01 (cifrado)**: Cubierto por defecto — Supabase fuerza TLS y cifra en reposo; Vercel sirve todo por HTTPS. **Compliant**.
- **SECURITY-04 (cabeceras de seguridad)**: Se configuran vía `vercel.json` (sección `headers`), sin código de servidor propio (Question 4 = A). **Compliant** (a implementar en Infrastructure Design).
- **SECURITY-05 (validación de inputs)**: Validación de `name`/`quantity`/`category` en el cliente (BR-1, BR-2) + constraints `CHECK` en Postgres como defensa en profundidad. **Compliant**.
- **SECURITY-08 (autorización a nivel de aplicación)**: **Nota importante** — este proyecto no tiene autenticación, por lo que RLS no puede aislar el acceso por identidad del llamante (no existe `auth.uid()` ni sesión). El modelo de seguridad aceptado (ver `requirements.md`, Supuesto "seguridad por oscuridad") es que cualquiera con el UUID del household puede leer/escribir sus datos. RLS se habilita igualmente (Question 5 = A) para: (a) evitar que las tablas queden expuestas sin ninguna política (comportamiento por defecto inseguro de Supabase si RLS está deshabilitado), y (b) forzar invariantes de esquema (ej. no se puede insertar un producto con `household_id` inexistente). Se documenta esto como **excepción aceptada y justificada**, no como incumplimiento.
- **SECURITY-09 (hardening)**: mensajes de error genéricos al usuario (BR-6); sin credenciales por defecto (la única credencial es la `anon key` pública de Supabase, diseñada para exponerse en el cliente). **Compliant**.
- **SECURITY-10 (cadena de suministro)**: usar `package-lock.json` (o equivalente), sin dependencias no usadas. **Compliant** (a verificar en Code Generation).
- **SECURITY-12, 14 (autenticación, alertas de seguridad)**: **N/A** — no hay autenticación de usuarios en el MVP (confirmado en requirements.md).
- **SECURITY-02 (logging de acceso en intermediarios de red)**: cubierto por defecto por los logs de Vercel/Supabase; no se añade infraestructura adicional (Question 6 = A). **Compliant** (nivel básico).
- **SECURITY-03 (logging de aplicación)**: sin logging estructurado propio (Question 6 = A) — se documenta como **N/A / mínimo** para un proyecto personal de este tamaño, confiando en los logs nativos del hosting/Supabase.
- **SECURITY-06, 07 (IAM de mínimo privilegio, red restrictiva)**: **N/A** — no hay infraestructura de red/IAM propia gestionada por el proyecto (Supabase/Vercel gestionan esto).
- **SECURITY-11 (diseño seguro)**: la validación está centralizada en `common/` (no dispersa), y BR-1/BR-2 son defensa en profundidad. **Compliant**.
- **SECURITY-13 (integridad de software/datos)**: no hay deserialización de datos no confiables más allá de JSON estándar del cliente Supabase (seguro por defecto). **Compliant**.
- **SECURITY-15 (manejo de errores)**: UI optimista con reversión y mensajes genéricos ante fallo (BR-6). **Compliant**.

## Reliability
- Manejo de errores: toda operación de escritura contra Supabase debe capturarse (try/catch o `.catch()`) y revertir el estado optimista (BR-6). Sin reintentos automáticos en el MVP.

## Maintainability
- Framework de testing: **Vitest** (Question 3 = A).
- Framework de PBT: **fast-check** (Question 2 = A), aplicado a `validateProductName`, `validateQuantity`, `validateCategory` (PBT-02/03/07/08/09 bloqueantes en modo parcial).
- Código organizado por módulo/feature (ya definido en `unit-of-work.md`).

## Usability
- Mobile-first; formularios simples con validación inline y mensajes de error claros en español.
