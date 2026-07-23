# NFR Design Patterns — Unidad 4: Onboarding y acceso

## Patrón de resiliencia: fallo de generación de QR
- Si la librería `qrcode` falla al generar el código (caso excepcional, ej. entrada inválida), se muestra un mensaje de error simple en la vista de QR sin afectar al resto de la navegación (consistente con BR-15 de fail-fast ya establecido en unidades anteriores).

## Patrón de componente: reutilización sin duplicación
- Tal como definieron BR-20/BR-21, no se crean nuevas fuentes de verdad para el nombre local o el household — todo pasa por las funciones ya existentes de la Unidad 1 (`getLocalName`/`setLocalName`/`createHousehold`).

## Sin patrones de seguridad/escalabilidad nuevos
- Ya cubierto en `nfr-requirements.md` de esta unidad (sin cambios de RLS, sin datos sensibles nuevos en el QR).

## Logical Components
Ver `logical-components.md`.
