# Security Test Instructions

Dado que la extensión de Seguridad de AI-DLC está activa (bloqueante), esta etapa verifica el cumplimiento de las reglas SECURITY-* aplicables al proyecto.

## 1. Dependency Vulnerability Scanning (SECURITY-10)

### Comando
```bash
npm audit
```

### Resultado real verificado en este entorno
- **Hallazgo inicial**: `@supabase/supabase-js@2.45.4` dependía de una versión vulnerable de `@supabase/auth-js` ("Insecure Path Routing from Malformed User Input", severidad no especificada por npm pero con fix disponible). **Corregido**: actualizado a `@supabase/supabase-js@2.110.8` en `package.json` e `index.html` (import map). Re-ejecutado `npm audit`: la vulnerabilidad de `auth-js` ya no aparece.
- **Hallazgo restante (aceptado como excepción documentada)**: cadena `vitest → vite-node → vite → esbuild` con una vulnerabilidad moderada ("esbuild enables any website to send any requests to the development server and read the response"). Esta vulnerabilidad **solo afecta al servidor de desarrollo local de Vite/Vitest durante la ejecución de tests**, nunca al sitio desplegado en producción (que es HTML/JS estático servido por Vercel, sin ningún servidor Vite involucrado). Corregirla requeriría actualizar a `vitest@4.x`, un cambio mayor con riesgo de romper la suite de tests actual (88/88 pasando). Se documenta como **excepción aceptada**: riesgo real nulo en producción, coste de corrección desproporcionado para un proyecto personal.
- **Todas las demás dependencias**: sin vulnerabilidades conocidas tras la actualización.

### Verificación de SECURITY-10
- [x] Lockfile (`package-lock.json`) existe y debe commitearse al repositorio.
- [x] Escaneo de vulnerabilidades ejecutado (`npm audit`).
- [x] Sin dependencias no usadas.
- [x] Dependencias de fuentes oficiales (registro npm).
- [ ] SBOM: no generado (fuera de alcance para un proyecto personal; `package-lock.json` cumple una función equivalente básica).

## 2. Cabeceras de seguridad HTTP (SECURITY-04)

### Comando (tras desplegar en Vercel)
```bash
curl -sI https://tu-app.vercel.app/
```

### Verificación esperada
La respuesta debe incluir (configuradas en `vercel.json`):
- `Content-Security-Policy: default-src 'self'; script-src 'self' https://esm.sh; ...`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Nota**: no se ha podido verificar contra un despliegue real en este entorno (sin proyecto Vercel desplegado). El contenido de `vercel.json` se ha revisado manualmente y contiene las cabeceras requeridas — pendiente de verificación post-despliegue por el usuario.

## 3. Validación de inputs (SECURITY-05)

Ya cubierto por los tests unitarios/PBT ejecutados en Build:
- `validateProductName`, `validateQuantity`, `validateCategory` (Unidad 1) — 17 tests, incluyendo casos de puntuación no permitida y longitud límite.
- Constraints `CHECK` a nivel de Postgres en `schema.sql` como defensa en profundidad.

## 4. Control de acceso por household (SECURITY-08)

- **Diseño**: RLS permisivo + obscuridad del UUID (documentado y aceptado explícitamente en `aidlc-docs/construction/unidad-1/nfr-requirements/nfr-requirements.md`).
- **Verificación manual recomendada** (tras desplegar): confirmar que las tablas `households`/`products` tienen RLS **habilitado** en el dashboard de Supabase (Authentication → Policies), y que existen las 4 políticas por tabla definidas en `schema.sql`.

## Resumen de cumplimiento SECURITY-*
| Regla | Estado |
|---|---|
| SECURITY-01 (cifrado) | Compliant (gestionado por Supabase/Vercel) |
| SECURITY-04 (cabeceras) | Compliant (configurado en vercel.json, pendiente de verificación post-despliegue) |
| SECURITY-05 (validación) | Compliant (verificado con tests) |
| SECURITY-08 (autorización) | Excepción aceptada y documentada (sin autenticación por diseño) |
| SECURITY-09 (hardening) | Compliant |
| SECURITY-10 (cadena de suministro) | Compliant, con 1 excepción aceptada documentada (vulnerabilidad dev-only) |
| SECURITY-02, 03, 06, 07, 11-15 | N/A o Compliant según lo documentado en cada `nfr-requirements.md` por unidad |
