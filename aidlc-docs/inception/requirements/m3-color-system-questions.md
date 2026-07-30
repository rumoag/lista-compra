# Cambio de dirección — Sistema de Color (Material Design 3) — Preguntas de Aclaración

Contexto: en Requirements Analysis del Ciclo 3 se aprobó adoptar las escalas planas de **Radix Colors** (12 pasos por color, Lime + Sand), ya implementadas en los Lotes 0-1 (tokens `--accent-1`…`--accent-12`, `--sand-1`…`--sand-12` y su uso en tarjetas/botones/chips/inputs).

El sistema de color de [Material Design 3](https://m3.material.io/styles/color/system/how-the-system-works) funciona de forma **distinta**: en vez de una escala plana de 12 pasos por color, genera **paletas tonales** (tonos 0-100) a partir de uno o varios "colores semilla", y de ahí deriva **roles semánticos** con pares texto/fondo ya emparejados para contraste (`primary` / `on-primary` / `primary-container` / `on-primary-container`, y lo mismo para `secondary`, `tertiary`, `error`, más `surface`/`on-surface`/`outline`, etc.), con un esquema claro y otro oscuro derivados de las mismas paletas.

Antes de tocar lo ya generado, necesito precisar el alcance del cambio.

## Question 1
¿Qué quieres cambiar exactamente?

A) Sustituir por completo el sistema de color: abandonar Radix Colors (Lime/Sand) y adoptar la arquitectura de color de Material Design 3 (paletas tonales + roles semánticos) desde un color semilla nuevo

B) Mantener el verde Lime como base, pero reestructurar los tokens de color para que sigan el patrón de **roles semánticos** de M3 (primary/on-primary/primary-container/on-primary-container, surface/on-surface, etc.) generados a partir de ese verde, en vez de la escala plana de 12 pasos de Radix

C) Mantener Radix Colors tal cual está (Lotes 0-1 ya generados), y solo tomar de M3 la idea de tener también pares "on-*"/"container" ya resueltos por conveniencia, sin generar paletas tonales completas

D) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 2
Si se adopta la arquitectura de M3 (paletas tonales), ¿qué color semilla debe usarse?

A) El mismo verde Lime ya usado (`#bdee63` aprox., Lime-9 de Radix) como color semilla del esquema M3

B) Otro color semilla — indícalo en "Other"

C) No aplica (si en la Pregunta 1 elegiste C)

D) Other (please describe after [Answer]: tag below — indica el color semilla, ej. un hex concreto)

[Answer]: A

## Question 3
M3 define además colores secundarios/terciarios derivados automáticamente del color semilla (armonía tonal), y un color `error` fijo (rojo) con su propia paleta. ¿Cómo lo abordamos?

A) Generar los tres (primary/secondary/tertiary) + error, siguiendo el algoritmo de M3 (derivación automática de armonía a partir del color semilla)

B) Solo `primary` (a partir de Lime u otro semilla) + `error`; sin secondary/tertiary por ahora — mantiene el alcance más simple

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
Esto implica rehacer parte de lo ya generado en los Lotes 0-1 (los tokens `--accent-*` y su uso en `.card`, `button`, `.chip`, inputs). ¿Qué prefieres?

A) Rehacer los Lotes 0-1 con la nueva arquitectura de color antes de continuar con el resto de componentes (Lotes 2-4 no generados aún)

B) Seguir adelante con Lotes 2-4 usando el sistema actual (Radix) y migrar todo a M3 en un lote de migración aparte al final

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
¿Se mantiene todo lo demás ya decidido en Requirements Analysis (Ciclo 3): neutro **Sand** para superficies/bordes, tipografía **Inter** + escala Radix, escala de **radios** de Radix, modo oscuro automático por `prefers-color-scheme`? (Esto solo pregunta por el sistema de *color*, no por radios/tipografía)

A) Sí, esas decisiones se mantienen sin cambios — solo cambia cómo se estructura el color

B) No, también quiero revisar algo más — indícalo en "Other"

C) Other (please describe after [Answer]: tag below)

[Answer]: C, quiero cambiar como base a material io que me gusta más aunque la tipografia quiero la inter
