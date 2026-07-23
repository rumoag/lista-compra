# Requirements Clarification Questions — Lista de la Compra Compartida

Tu Project Brief ya es muy completo. Estas preguntas cubren: (1) las preguntas abiertas que tú mismo planteaste en la sección 10, (2) un par de vacíos funcionales menores, y (3) los opt-in de extensiones estándar de AI-DLC (seguridad, resiliencia, testing basado en propiedades).

Responde rellenando la letra tras cada `[Answer]:`.

## Question 1 — Stack de frontend
¿Qué stack de frontend prefieres?

A) React + Vite (más código boilerplate, pero más mantenible/escalable a futuro)

B) HTML/JS simple (vanilla) + Supabase JS client (mínimo, rápido de lanzar, menos abstracciones)

C) Otro framework (Vue, Svelte, etc. — indícalo)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2 — Categorías de producto
¿Cómo quieres manejar la categoría del producto al añadirlo?

A) Texto totalmente libre siempre (tal como dice el brief, sin restricciones)

B) Chips rápidos con categorías frecuentes (lácteos, limpieza, fruta...) + opción de escribir una nueva

C) Sin categoría en el MVP (se puede añadir más adelante)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3 — Visualización de estadísticas
¿Cómo prefieres ver las estadísticas en el MVP?

A) Gráficos (barras/líneas) para frecuencia y cadencia

B) Listas numéricas simples (tablas/rankings, sin librería de gráficos)

C) Combinación: listas simples primero, gráficos si da tiempo (nice-to-have, no bloqueante)

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 4 — Edición/borrado de productos ya comprados
El brief cubre editar/eliminar productos *pendientes*, pero no dice si un producto ya marcado como "comprado" se puede editar o eliminar del historial.

A) El historial es inmutable: una vez comprado, no se puede editar ni borrar (solo consultar)

B) Se puede corregir errores (ej. desmarcar "comprado" por error) o eliminar entradas del historial

C) Otro criterio (indícalo)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5 — Conflictos de edición simultánea
Con dos personas editando la misma lista en tiempo real, ¿qué pasa si ambos intentan marcar/eliminar el mismo producto casi a la vez?

A) No importa gestionarlo de forma especial: "el último que actúa gana" (last write wins), es un caso raro y de bajo impacto

B) Hay que evitar duplicados/errores visibles aunque sea con una solución simple (ej. ignorar la segunda acción sobre un producto ya movido de estado)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6 — Creación del "hogar" (household)
¿Cómo se crea el primer registro `household` (el que genera el UUID del QR)?

A) Un botón "Crear nueva lista" en una pantalla inicial genérica (sin UUID en la URL) que crea el household y redirige a la URL con su UUID, lista para generar el QR

B) Se ejecuta manualmente (ej. script/consola de Supabase) antes de usar la app — no hace falta UI para esto en el MVP

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7 — Extensión: Seguridad (Security Baseline)
¿Aplicamos la línea base de reglas de seguridad de AI-DLC como restricciones obligatorias durante el diseño y generación de código?

A) Sí — aplicar todas las reglas de SEGURIDAD como restricciones bloqueantes (recomendado incluso para proyectos personales que exponen datos por URL no adivinable)

B) No — omitir las reglas de seguridad extendidas (proyecto personal de bajo riesgo, sin datos sensibles)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8 — Extensión: Resiliencia (Resiliency Baseline)
¿Aplicamos la línea base de resiliencia (alta disponibilidad, recuperación ante fallos, observabilidad) de AI-DLC?

A) Sí — aplicar como guía de diseño (recomendado para cargas de trabajo críticas de negocio)

B) No — omitir (adecuado para PoCs/prototipos/proyectos personales como este, donde iterar rápido importa más que la resiliencia formal)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9 — Extensión: Testing basado en propiedades (Property-Based Testing)
¿Aplicamos reglas de testing basado en propiedades (PBT)?

A) Sí — aplicar como restricciones obligatorias (recomendado si hay lógica de negocio compleja, transformaciones de datos o componentes con estado)

B) Parcial — solo para funciones puras y round-trips de serialización (ej. cálculo de cadencia media entre compras)

C) No — omitir (adecuado para apps CRUD simples o capas de integración finas, como es este proyecto)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
