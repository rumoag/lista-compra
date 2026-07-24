// Categorías frecuentes con icono (BR-38) — mapa fijo, con icono genérico de fallback.
// Se usa un Map (no un objeto plano) para que categorías como "valueOf" o "constructor"
// no resuelvan accidentalmente a propiedades heredadas de Object.prototype.
export const CATEGORY_ICON_MAP = new Map([
  ['Lácteos', '🥛'],
  ['Limpieza', '🧴'],
  ['Fruta', '🍎'],
  ['Verdura', '🥦'],
  ['Panadería', '🍞'],
]);

export const GENERIC_CATEGORY_ICON = '📦';

export const FREQUENT_CATEGORIES = [...CATEGORY_ICON_MAP.keys()];

export function getCategoryIcon(category) {
  if (!category) return GENERIC_CATEGORY_ICON;
  return CATEGORY_ICON_MAP.get(category) ?? GENERIC_CATEGORY_ICON;
}
