// Validación de productos — BR-1, BR-2 (aidlc-docs/construction/unidad-1/functional-design/business-rules.md)
// Funciones puras: mismo input siempre produce el mismo resultado (ver Testable Properties en business-logic-model.md).

const NAME_MAX_LENGTH = 50;
const QUANTITY_MAX_LENGTH = 50;
const CATEGORY_MAX_LENGTH = 40;

// Letras (incluye acentos/ñ vía \p{L}), dígitos y espacios únicamente.
const NAME_ALLOWED_PATTERN = /^[\p{L}\p{N} ]+$/u;

/**
 * Colapsa espacios repetidos y recorta los extremos.
 * Idempotente: normalizeWhitespace(normalizeWhitespace(x)) === normalizeWhitespace(x)
 */
export function normalizeWhitespace(value) {
  return value.trim().replace(/\s+/g, ' ');
}

export function validateProductName(name) {
  if (typeof name !== 'string') {
    return { valid: false, error: 'El nombre es obligatorio.' };
  }
  const normalized = normalizeWhitespace(name);
  if (normalized.length === 0) {
    return { valid: false, error: 'El nombre es obligatorio.' };
  }
  if (normalized.length > NAME_MAX_LENGTH) {
    return { valid: false, error: `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres.` };
  }
  if (!NAME_ALLOWED_PATTERN.test(normalized)) {
    return { valid: false, error: 'El nombre solo puede contener letras, números y espacios.' };
  }
  return { valid: true, value: normalized };
}

export function validateQuantity(quantity) {
  if (quantity === null || quantity === undefined || quantity === '') {
    return { valid: true, value: null };
  }
  if (typeof quantity !== 'string') {
    return { valid: false, error: 'La cantidad no es válida.' };
  }
  const normalized = normalizeWhitespace(quantity);
  if (normalized.length > QUANTITY_MAX_LENGTH) {
    return { valid: false, error: `La cantidad no puede superar los ${QUANTITY_MAX_LENGTH} caracteres.` };
  }
  return { valid: true, value: normalized || null };
}

export function validateCategory(category) {
  if (category === null || category === undefined || category === '') {
    return { valid: true, value: null };
  }
  if (typeof category !== 'string') {
    return { valid: false, error: 'La categoría no es válida.' };
  }
  const normalized = normalizeWhitespace(category);
  if (normalized.length > CATEGORY_MAX_LENGTH) {
    return { valid: false, error: `La categoría no puede superar los ${CATEGORY_MAX_LENGTH} caracteres.` };
  }
  return { valid: true, value: normalized || null };
}
