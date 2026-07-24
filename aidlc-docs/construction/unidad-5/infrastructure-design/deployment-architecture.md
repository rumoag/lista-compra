# Deployment Architecture — Unidad 5: Listado de listas activas

Sin cambios respecto al diagrama de la Unidad 1/2 (Vercel + Supabase, un único proyecto para producción y previews). El único cambio de infraestructura de esta unidad es una migración de esquema aditiva (`alter table households add column ...`) sobre la base de datos ya existente, aplicada mediante el mismo flujo de SQL versionado en `supabase/schema.sql` ya usado en la Unidad 2.

```
┌────────────┐        HTTPS        ┌──────────────────┐
│  Navegador │ ───────────────────▶│  Vercel (estático)│
│  (móvil)   │                     │  index.html + JS  │
└────────────┘                     └─────────┬─────────┘
                                              │ REST/WSS (supabase-js)
                                              ▼
                                    ┌──────────────────┐
                                    │     Supabase      │
                                    │  households (+2   │
                                    │  columnas nuevas)  │
                                    │  products          │
                                    └────────────────────┘
```
