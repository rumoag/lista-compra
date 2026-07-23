# Story Generation Plan — Lista de la Compra Compartida

## Metodología

Dado que hay solo 2 personas con **los mismos permisos** (sin roles diferenciados), el enfoque más natural es:
- **Breakdown approach**: Feature-Based (agrupar por capacidad: Alta de productos, Selección múltiple/Marcar comprados, Historial, Estadísticas, Onboarding/Acceso), en vez de Persona-Based (ya que ambas personas son funcionalmente idénticas) ni Epic-Based (el alcance es demasiado pequeño para justificar epics).
- **Personas**: Un único arquetipo genérico "Miembro del hogar" en vez de personas diferenciadas, ya que el brief confirma "sin roles diferenciados, mismos permisos".
- **Formato de historia**: "Como [persona], quiero [acción], para [beneficio]" + criterios de aceptación en formato Given/When/Then.
- **Granularidad**: Historias pequeñas por acción concreta (ej. "añadir producto" separada de "editar producto"), agrupadas bajo el feature correspondiente.

## Checklist de ejecución

- [ ] Confirmar metodología y respuestas de las preguntas de contexto (abajo)
- [ ] Generar `aidlc-docs/inception/user-stories/personas.md` con el arquetipo "Miembro del hogar"
- [ ] Generar `aidlc-docs/inception/user-stories/stories.md` con historias agrupadas por feature:
  - [ ] Feature: Onboarding y acceso (nombre local, creación de hogar, QR)
  - [ ] Feature: Lista de pendientes (añadir, editar, eliminar, ver en tiempo real)
  - [ ] Feature: Selección múltiple y marcar comprados
  - [ ] Feature: Historial (ver, filtrar, corregir)
  - [ ] Feature: Estadísticas (ranking, cadencia, distribución)
- [ ] Cada historia cumple INVEST (Independiente, Negociable, Valiosa, Estimable, Pequeña, Testable)
- [ ] Cada historia incluye criterios de aceptación Given/When/Then
- [ ] Mapear la persona única a todas las historias (aplica a todas por igual)

## Preguntas de contexto

### Question 1 — Nivel de detalle de los criterios de aceptación
¿Qué nivel de detalle quieres en los criterios de aceptación de cada historia?

A) Detallado: cubrir casos límite explícitos (lista vacía, sin conexión momentánea, nombre local no configurado, etc.) en cada historia relevante

B) Básico: solo el camino feliz (happy path) por historia, sin listar casos límite

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Historias de casos límite como historias separadas
¿Prefieres que los casos límite importantes (ej. "lista vacía", "historial vacío") sean historias independientes, o criterios de aceptación dentro de la historia principal?

A) Criterios de aceptación dentro de la historia principal (menos historias, más detalle por historia)

B) Historias independientes para casos límite relevantes (más historias, más granularidad)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Prioridad relativa de las features
Para ordenar las historias (útil de cara a los "Bolts" del brief), ¿confirmas este orden de prioridad?

A) Sí: 1) Lista de pendientes, 2) Selección múltiple/marcar comprados, 3) Historial y estadísticas, 4) Onboarding/QR — tal como sugieren los Bolts 1-4 del brief

B) No, prefiero otro orden (descríbelo)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
