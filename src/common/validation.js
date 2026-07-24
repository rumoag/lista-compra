// Validación de productos — BR-1, BR-2 (aidlc-docs/construction/unidad-1/functional-design/business-rules.md)
// Funciones puras: mismo input siempre produce el mismo resultado (ver Testable Properties en business-logic-model.md).

const NAME_MAX_LENGTH = 50;
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

// Unidad 5 — validación de listas (households con title/image_icon, BR-24/BR-25)
const HOUSEHOLD_TITLE_MAX_LENGTH = 50;

export const HOUSEHOLD_ICON_SET = ['🛒', '🥦', '🧴', '🍞', '🥛', '🧻', '🍎', '🧀', '🍗', '🧃', '🏠', '📦'];

export function validateHouseholdTitle(title) {
  if (typeof title !== 'string') {
    return { valid: false, error: 'El título es obligatorio.' };
  }
  const normalized = normalizeWhitespace(title);
  if (normalized.length === 0) {
    return { valid: false, error: 'El título es obligatorio.' };
  }
  if (normalized.length > HOUSEHOLD_TITLE_MAX_LENGTH) {
    return { valid: false, error: `El título no puede superar los ${HOUSEHOLD_TITLE_MAX_LENGTH} caracteres.` };
  }
  return { valid: true, value: normalized };
}

export function validateHouseholdIcon(icon) {
  if (!HOUSEHOLD_ICON_SET.includes(icon)) {
    return { valid: false, error: 'Elige un icono de la lista.' };
  }
  return { valid: true, value: icon };
}

// Unidad 6 — cantidad numérica de producto (BR-35/BR-36), sustituye validateQuantity
const QUANTITY_NUMBER_MIN = 1;
const QUANTITY_NUMBER_MAX = 999;
const QUANTITY_UNIT_MAX_LENGTH = 20;

export function validateQuantityNumber(value) {
  const number = typeof value === 'string' ? Number(value) : value;
  if (typeof number !== 'number' || !Number.isInteger(number)) {
    return { valid: false, error: 'La cantidad debe ser un número entero.' };
  }
  if (number < QUANTITY_NUMBER_MIN || number > QUANTITY_NUMBER_MAX) {
    return { valid: false, error: `La cantidad debe estar entre ${QUANTITY_NUMBER_MIN} y ${QUANTITY_NUMBER_MAX}.` };
  }
  return { valid: true, value: number };
}

export function validateQuantityUnit(unit) {
  if (unit === null || unit === undefined || unit === '') {
    return { valid: true, value: null };
  }
  if (typeof unit !== 'string') {
    return { valid: false, error: 'La unidad no es válida.' };
  }
  const normalized = normalizeWhitespace(unit);
  if (normalized.length > QUANTITY_UNIT_MAX_LENGTH) {
    return { valid: false, error: `La unidad no puede superar los ${QUANTITY_UNIT_MAX_LENGTH} caracteres.` };
  }
  return { valid: true, value: normalized || null };
}
