# Build Instructions

## Prerequisites
- **Build Tool**: Node.js (probado con v24.18.0) + npm (v11.16.0)
- **Dependencies**: `@supabase/supabase-js` (runtime), `vitest`, `fast-check`, `jsdom`, `qrcode` (dev/test)
- **Environment Variables**: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (ver `.env.example`)
- **System Requirements**: cualquier SO con Node.js 18+; no requiere memoria/disco significativos (app estática)

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Exporta las variables de entorno de tu proyecto Supabase antes de construir
export SUPABASE_URL="https://tu-proyecto.supabase.co"
export SUPABASE_ANON_KEY="tu-anon-key"
```

### 3. Build
```bash
npm run build
```
Este comando ejecuta `scripts/generate-config.js`, que lee `SUPABASE_URL`/`SUPABASE_ANON_KEY` del entorno y genera `src/common/config.generated.js` (no versionado).

### 4. Verify Build Success
- **Expected Output**: `src/common/config.generated.js generado correctamente.`
- **Build Artifacts**: `src/common/config.generated.js` (único artefacto generado; el resto del sitio es estático y no requiere compilación — no hay bundler)
- **Verificado en este entorno**: build ejecutado con variables de entorno de prueba — funciona correctamente (ver `build-and-test-summary.md`)

## Troubleshooting

### Build Fails with "Faltan las variables de entorno"
- **Causa**: `SUPABASE_URL` y/o `SUPABASE_ANON_KEY` no están exportadas en el entorno donde se ejecuta `npm run build`.
- **Solución**: exportarlas antes de ejecutar el comando, o configurarlas en el panel de variables de entorno de Vercel para despliegues.

### Build Fails with Dependency Errors
- **Causa**: `node_modules` desactualizado o corrupto.
- **Solución**: borrar `node_modules` y `package-lock.json`, volver a ejecutar `npm install`.
