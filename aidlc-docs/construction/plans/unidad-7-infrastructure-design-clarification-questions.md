# Infrastructure Design — Aclaración sobre Realtime en `purchases`

Elegiste B en la Question 3 ("Sí quiero Realtime también en `purchases`"), pero esa opción pedía describir el motivo en un campo "Other" que no llegó a rellenarse. Antes de diseñar el alcance de Realtime en `purchases`, necesito precisar el comportamiento esperado.

## Contexto
Hoy, `products` ya emite eventos Realtime (Unidad 2) que ambos móviles escuchan para mantener sincronizada la lista de pendientes en vivo. El historial (Unidad 3), en cambio, nunca se diseñó como una vista en vivo — se recarga al entrar, filtrar o paginar. Marcar como comprados ya se refleja en el otro móvil porque **el producto desaparece de la lista de pendientes vía Realtime de `products`** (no hace falta Realtime en `purchases` para eso).

Lo que Realtime en `purchases` añadiría específicamente es: si un usuario tiene el historial abierto en su móvil, y el otro usuario (en su propio móvil) marca productos como comprados, deshace un ticket o lo elimina, la lista de historial del primero se actualizaría sola, sin que tenga que recargar/reentrar a la pantalla.

## Question 1
¿Qué alcance quieres para Realtime en el historial de tickets?

A) Alcance completo: la lista de historial (mientras está abierta) se actualiza en vivo ante cualquier cambio remoto — ticket nuevo (alguien marcó productos como comprados), ticket deshecho o eliminado (por el otro usuario, desde su propio móvil) — igual que ya ocurre hoy con la lista de pendientes.

B) Alcance parcial: solo los tickets **nuevos** aparecen en vivo en la parte superior de la lista (mismo patrón que "INSERT" de la lista de pendientes); si el otro usuario deshace o elimina un ticket en su móvil, el primero lo vería reflejado recién al recargar/reentrar (sin Realtime para UPDATE/DELETE de `purchases`).

C) Sin Realtime — mantener el comportamiento original de esta unidad (Q3=A original): el historial se recarga manualmente (entrar/filtrar/paginar), sin sincronización en vivo entre los dos móviles.

D) Other (please describe after [Answer]: tag below)

[Answer]: A
