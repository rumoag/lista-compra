# Sistema de Color (M3) — Preguntas de Clarificación

Detecté una ambigüedad entre dos de tus respuestas en `m3-color-system-questions.md`:

## Ambigüedad 1: Alcance del cambio — ¿solo color, o todo el design system?
En la Pregunta 1 elegiste la opción **B**: "Mantener el verde Lime como base, pero reestructurar los **tokens de color** para que sigan el patrón de roles semánticos de M3" — es decir, un cambio acotado solo al sistema de color, manteniendo el resto (radios, escala tipográfica) tal como se decidió con Radix Themes.

Pero en la Pregunta 5 escribiste: *"quiero cambiar como base a material io que me gusta más aunque la tipografia quiero la inter"* — esto suena a un cambio más amplio: adoptar **Material Design 3 como base general** del design system (no solo el color), manteniendo únicamente Inter como excepción tipográfica.

Estas dos respuestas apuntan a alcances distintos (solo color vs. todo el sistema), así que necesito que lo confirmes antes de tocar código.

### Clarification Question 1
¿Cuál es el alcance real del cambio?

A) Solo el **sistema de color** cambia a la arquitectura de M3 (paletas tonales + roles semánticos, semilla Lime). Radios (escala de Radix Themes) y tipografía (Inter + escala de tamaños de Radix) se mantienen tal como estaban aprobados

B) **Todo el design system** pasa a basarse en Material Design 3: color (paletas tonales + roles), **forma/radios** siguiendo la escala de "shape" de M3 (`--md-sys-shape-corner-*`, distinta a la de Radix), y la **escala tipográfica** de M3 (roles display/headline/title/body/label, cada uno con tamaño/peso/line-height propios) — pero usando la fuente **Inter** en vez de Roboto (la fuente por defecto de M3) como única excepción

C) Todo el design system pasa a M3 (color + forma), pero la tipografía se queda tal cual estaba (Inter + escala de tamaños de Radix, sin adoptar los "roles" tipográficos de M3)

D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Ambigüedad 2: Elevación/superficies (si el alcance es "todo M3")
Si eliges B o C arriba: M3 también define un sistema de **elevación mediante superposición de color** (surface tint) en vez de sombras tradicionales, con 6 niveles de superficie (`surface`, `surface-container-low`, `surface-container`, `surface-container-high`, etc.). Hoy la app usa `box-shadow` simple (modales, tabs flotantes, FAB).

### Clarification Question 2
¿Adoptamos también el sistema de elevación por superficies de M3, o mantenemos las sombras (`box-shadow`) actuales para elementos flotantes (modales, barra de tabs, FAB)?

A) Adoptar el sistema de superficies con tinte de color de M3 (sustituye las sombras por variaciones de `surface-container-*`)

B) Mantener las sombras (`box-shadow`) actuales — solo cambia el color de fondo/texto de esas superficies a los tokens M3, no el mecanismo de elevación

C) Other (please describe after [Answer]: tag below)

[Answer]: A
