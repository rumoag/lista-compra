# Clarificación — Extensión de Resiliencia

En la ronda anterior activaste la **extensión de Resiliencia** (Question 8 = A). Esa extensión obliga a hacer una serie de preguntas más (RTO/RPO, gestión de cambios, CI/CD, rollback, topología multi-región, respuesta a incidentes) porque está pensada para cargas de trabajo de negocio críticas.

Tu proyecto es una app personal para 2 personas, en capa gratuita de Supabase/Vercel, sin SLA. Antes de aplicarte reglas de nivel empresarial (multi-región, runbooks de DR, alertas de seguridad de incidentes...), quiero confirmar contigo si eso tiene sentido aquí.

## Question 0 — Reconsiderar la extensión de Resiliencia
¿Mantenemos activada la extensión de Resiliencia con todo su alcance (multi-región, DR, runbooks, gestión de cambios formal, etc.) para esta app personal?

A) No, desactivar la extensión de Resiliencia — es una app personal en capa gratuita, sobra el aparato de resiliencia empresarial (recomendado para este caso)

B) Sí, mantenerla activa pero solo en su nivel mínimo (single-region, backups automáticos de Supabase, sin runbooks formales ni multi-región) — respondería el resto de preguntas de esta extensión con las opciones de menor coste

C) Sí, mantenerla activa con todo el rigor tal cual está definida la extensión (multi-región, DR, runbooks, procesos de cambio formales)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

**Si eliges B o C**, responde también estas preguntas obligatorias de la extensión (si eliges A, puedes dejarlas en blanco, se marcarán como N/A):

## Question 1 — RTO/RPO y estrategia de Disaster Recovery
A) Horas — Backup & Restore, coste mínimo, adecuado para cargas no críticas (recomendado para este proyecto)

B) Decenas de minutos — Pilot Light

C) Minutos — Warm Standby

D) Casi tiempo real — Multi-site Active/Active

E) N/A — despliegue single-region es aceptable, sin DR cross-region

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2 — Gestión de cambios
A) Usar un proceso organizativo existente (indícalo)

B) No existe proceso formal — proponer uno ligero (registro de cambio + aprobación + nota de rollback)

C) N/A — exento de gestión de cambios formal (proyecto personal) (recomendado para este proyecto)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3 — CI/CD y despliegue
A) Usar pipeline existente (indícalo)

B) No existe pipeline — proponer uno apropiado (ej. GitHub Actions + deploy automático a Vercel/Netlify) (recomendado para este proyecto)

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4 — Mecanismo de rollback
A) Redeploy de la versión anterior (rollback por versión) (recomendado para este proyecto)

B) Blue/green swap

C) Canary con auto-rollback

D) Rollback consciente de base de datos (migraciones)

E) Usar procedimiento organizativo existente

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5 — Estilo de despliegue
A) Directo / in-place (coste mínimo, aceptable para carga no crítica) (recomendado para este proyecto)

B) Rolling

C) Blue/green

D) Canary

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6 — Topología regional
A) Single-region, multi-zona (recomendado para este proyecto)

B) Multi-región activo-pasivo

C) Multi-región activo-activo

X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 7 — Respuesta a incidentes
A) Usar proceso organizativo existente (indícalo)

B) No existe proceso formal — proponer uno ligero (ej. simplemente revisar logs de Supabase/Vercel si algo falla) (recomendado para este proyecto)

X) Other (please describe after [Answer]: tag below)

[Answer]: 
