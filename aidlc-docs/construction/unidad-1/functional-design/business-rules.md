# Business Rules — Unidad 1: Fundaciones

## BR-1: Validación de nombre de producto
- **Regla**: `name` es obligatorio, máximo 50 caracteres, y debe contener solo letras (incluye acentos/ñ), números y espacios.
- **Rechazo**: cualquier intento de guardar con `name` vacío, mayor a 50 caracteres, o con caracteres fuera del conjunto permitido debe rechazarse antes de llegar a Supabase (validación en cliente) y también debe estar protegido a nivel de base de datos (constraint `CHECK`) como defensa en profundidad (SECURITY-11).
- **Sanitización**: independientemente de la restricción de caracteres, el valor debe tratarse como texto plano al renderizar (no interpretarlo como HTML) para prevenir XSS (SECURITY-05).

## BR-2: Validación de cantidad y categoría
- **Regla**: `quantity` y `category` son opcionales; si se proporcionan, `quantity` ≤ 50 caracteres y `category` ≤ 40 caracteres.
- **Rechazo**: valores que excedan el límite se rechazan en el cliente antes de enviarse.

## BR-3: Pertenencia a un household
- **Regla**: todo `Product` debe tener un `household_id` válido y existente. No se permite crear productos sin household asociado.
- **Control de acceso**: las políticas RLS de Supabase deben restringir las operaciones sobre `products` a filas cuyo `household_id` coincida con el de la URL actual (SECURITY-08 — autorización a nivel de aplicación, adaptada al modelo sin autenticación de este proyecto).

## BR-4: Identidad local obligatoria antes de escribir
- **Regla**: no se puede crear ni editar un producto sin que exista un `localName` en `localStorage` del dispositivo. Si no existe, se solicita antes de permitir la acción (stopgap de Unidad 1, ver Question 1).
- **Idempotencia del nombre**: una vez elegido, el nombre persiste entre sesiones en el mismo dispositivo/navegador; cambiarlo no reescribe registros históricos ya creados con el nombre anterior.

## BR-5: Estado por defecto
- **Regla**: todo producto nuevo se crea con `status = pending`. La transición a `bought` no es responsabilidad de la Unidad 1 (se implementa en Unidad 2), por lo que ningún flujo de la Unidad 1 debe cambiar `status`.

## BR-6: Comportamiento ante fallo de escritura (UI optimista)
- **Regla** (Question 5 = B): las acciones de añadir, editar y eliminar un producto se reflejan de inmediato en la UI (optimista) antes de confirmar la escritura en Supabase.
- **Reversión**: si la escritura falla (ej. sin conexión, error del servidor), la UI debe revertir el cambio optimista (volver al estado anterior) y mostrar un mensaje de error genérico al usuario, sin exponer detalles técnicos (SECURITY-09, SECURITY-15 — fail closed y mensajes de error genéricos).

## BR-7: Creación de household mínima (Unidad 1)
- **Regla** (Question 2 = B): existe una función mínima para crear un nuevo `household` (genera fila + UUID) y navegar a su URL, sin la pantalla pulida de onboarding. Esta función se reutiliza y se envuelve con la UI real en la Unidad 4 (US-5.2).
