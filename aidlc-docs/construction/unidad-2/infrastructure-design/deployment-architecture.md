# Deployment Architecture — Unidad 2: Tiempo real y acciones en lote

Sin cambios sobre el diagrama de la Unidad 1, con la adición del canal WebSocket de Realtime:

```
[Móvil pareja] --HTTPS/WSS--> [Vercel: sitio estático]
                                 |
                                 |-- fetch (REST, alta/edición/borrado, marcar en lote)
                                 |-- WebSocket (Realtime: INSERT/UPDATE/DELETE en products)
                                 v
                        [Supabase: Postgres + RLS + Realtime]
```

No se requiere ningún cambio en el flujo de despliegue (mismo `vercel.json`, mismas variables de entorno, mismo `npm run build`).
