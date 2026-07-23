# Tech Stack Decisions — Unidad 3: Historial y estadísticas

| Decisión | Elección | Justificación |
|---|---|---|
| Límite de datos para estadísticas | Últimas 2000 compras (Question 1 = A) | Salvaguarda de rendimiento sin afectar el uso real esperado |
| Testing | Vitest + fast-check (heredado) | PBT-03 bloqueante en esta unidad para la lógica de agrupación/cadencia/filtros |
| Visualización | Listas/tablas HTML simples (sin librería de gráficos) | Ya decidido en Requirements Analysis; gráficos son mejora opcional futura |

No se añaden nuevas dependencias de proyecto en esta unidad.
