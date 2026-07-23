# Functional Design Plan — Unidad 4: Onboarding y acceso

## Contexto de la unidad
- **Responsabilidades**: pulir onboarding de nombre local (US-5.1), pulir creación de hogar (US-5.2), acceso vía QR (US-5.3), UI/UX mobile-first, PWA opcional.
- **Depende de**: Unidad 1 (stopgaps `name-prompt.js`, `create-household.js` a sustituir/extender)

## Checklist de ejecución
- [ ] Confirmar respuestas a las preguntas de contexto
- [ ] Generar `business-rules.md`, `business-logic-model.md`, `frontend-components.md` (sin `domain-entities.md` nuevo — no hay entidades de datos nuevas)

## Preguntas de contexto

### Question 1 — Generación del QR
¿Cómo se genera el QR que se pega en la nevera?

A) Generado dentro de la propia app (librería JS de generación de QR client-side) en una pantalla "Tu código QR", a partir de la URL del household — el usuario lo imprime desde ahí

B) Fuera de la app: el usuario copia la URL y usa una herramienta externa (ej. un generador de QR online) para crear el QR

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Cambiar el nombre local más adelante
US-5.1 menciona poder cambiar el nombre más adelante. ¿Dónde se ubica esa opción?

A) Un pequeño botón/enlace "Cambiar nombre" visible en la barra de navegación o pie de página, accesible en todo momento

B) Sin acceso directo en el MVP — si el usuario quiere cambiarlo, borra manualmente el `localStorage` (fuera de la UI)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3 — Sustituir vs extender los stopgaps de la Unidad 1
¿Sustituimos completamente `name-prompt.js`/`create-household.js` de la Unidad 1 por versiones nuevas, o los extendemos en el mismo archivo?

A) Extender los mismos archivos (`name-prompt.js`, `create-household.js`), añadiendo la UI pulida y reutilizando la lógica ya existente (`getLocalName`/`setLocalName`, `createHousehold`) — evita duplicar lógica

B) Crear archivos nuevos separados y dejar los de la Unidad 1 sin tocar

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Alcance de la PWA en esta unidad
El brief marca la PWA como "opcional". ¿Qué incluimos?

A) Solo lo mínimo instalable: `manifest.json` + icono, sin service worker (permite "Añadir a pantalla de inicio" en el móvil, sin funcionalidad offline)

B) Nada de PWA en esta unidad — queda fuera de alcance por completo

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 5 — Pulido visual general
¿Algún ajuste visual/UX específico que quieras además de lo ya implementado (chips, formularios, cards), o el pulido se limita a los flujos de onboarding/acceso (nombre, hogar, QR)?

A) Limitar el pulido a los flujos de onboarding/acceso — el resto de la UI ya generada en Unidades 1-3 es suficiente para el MVP

B) Quiero ajustes visuales adicionales (descríbelos)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
