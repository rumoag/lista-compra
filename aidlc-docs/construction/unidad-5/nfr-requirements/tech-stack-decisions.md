# Tech Stack Decisions — Unidad 5: Listado de listas activas

| Decisión | Elección | Justificación |
|---|---|---|
| Cálculo de participantes | Consulta agregada única (`products` agrupado por `household_id` en JS) | Evita N+1 desde el diseño inicial (Question 1 = B) |
| RLS | Sin cambios — políticas permisivas ya existentes | Coherente con BR-34, ya cubre las columnas nuevas (Question 2 = A) |
| Modal | Componente genérico propio (`common/modal.js`), sin librería externa | Consistente con NFR-4 (sin librerías de UI externas) y con el resto del proyecto (vanilla JS) |
| Generación de QR | Reutiliza `qrcode` vía esm.sh (ya presente desde Unidad 4) | Sin dependencia nueva |
| Cliente de datos | Reutiliza `@supabase/supabase-js` (ya presente) | Sin dependencia nueva |
| Componente de creación de household | `onboarding/create-household.js` se elimina, sustituido por `home/households-api.js` + `home/list-form-modal.js` | Evita dos caminos distintos de creación coexistiendo tras el cambio de firma de `createHousehold` |

Sin nuevas dependencias de `package.json`.
