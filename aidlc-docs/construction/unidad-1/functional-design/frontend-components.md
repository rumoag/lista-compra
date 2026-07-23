# Frontend Components — Unidad 1: Fundaciones

## Jerarquía de componentes (módulo `list/`, vanilla JS)

```
index.html
  └── app-root (contenedor principal)
        ├── name-prompt (stopgap identidad local, se muestra solo si no hay localName)
        └── list-view
              ├── product-form (alta de producto)
              └── product-list
                    └── product-item (uno por producto pendiente)
```

## Componente: `name-prompt`
- **Props/estado**: ninguno externo; lee/escribe `localStorage.localName`.
- **Interacción**: input de texto + botón "Guardar"; al confirmar, guarda en `localStorage` y oculta el prompt.
- **Validación**: nombre no vacío (sin límite de caracteres estricto en este stopgap; la Unidad 4 puede refinarlo).
- **Visibilidad**: se muestra en cada carga de página mientras `localStorage.localName` no exista.

## Componente: `product-form`
- **Props/estado**: `name` (string), `quantity` (string, opcional), `category` (string, opcional, seleccionable vía chips + texto libre).
- **Interacción**: input de nombre (obligatorio), input de cantidad (opcional), selector de categoría con chips predefinidos + opción "otra" (texto libre).
- **Validación de formulario**: aplica BR-1 y BR-2 antes de habilitar el botón "Añadir"; muestra mensaje de error inline si no se cumplen.
- **Integración con datos**: al confirmar, invoca el flujo "Añadir producto" (ver `business-logic-model.md`), que inserta contra la tabla `products` de Supabase.

## Componente: `product-list`
- **Props/estado**: lista de productos con `status = pending` del `household_id` actual.
- **Interacción**: renderiza un `product-item` por producto; en la Unidad 1 la lista se carga al entrar (fetch inicial), sin Realtime todavía (se añade en Unidad 2).

## Componente: `product-item`
- **Props/estado**: `id`, `name`, `quantity`, `category`.
- **Interacción**: botones "Editar" (abre `product-form` prellenado) y "Eliminar" (confirmación simple antes de borrar).
- **Integración con datos**: invoca los flujos "Editar producto pendiente" y "Eliminar producto pendiente".

## Flujo de estado optimista (BR-6)
Todos los componentes que mutan datos (`product-form`, acciones de `product-item`) aplican el cambio a la vista antes de confirmar con Supabase, y revierten mostrando un error genérico si la operación falla. Este comportamiento se centraliza en el módulo `common/` para reutilizarse también en las Unidades 2, 3 y 4.
