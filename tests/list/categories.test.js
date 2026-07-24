import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { getCategoryIcon, CATEGORY_ICON_MAP, FREQUENT_CATEGORIES, GENERIC_CATEGORY_ICON } from '../../src/list/categories.js';

describe('getCategoryIcon (BR-38)', () => {
  it('devuelve el icono fijo de cada categoría frecuente', () => {
    FREQUENT_CATEGORIES.forEach((category) => {
      expect(getCategoryIcon(category)).toBe(CATEGORY_ICON_MAP.get(category));
    });
  });

  it('devuelve el icono genérico para una categoría no reconocida', () => {
    expect(getCategoryIcon('Bricolaje')).toBe(GENERIC_CATEGORY_ICON);
  });

  it('devuelve el icono genérico para categoría nula o vacía', () => {
    expect(getCategoryIcon(null)).toBe(GENERIC_CATEGORY_ICON);
    expect(getCategoryIcon('')).toBe(GENERIC_CATEGORY_ICON);
    expect(getCategoryIcon(undefined)).toBe(GENERIC_CATEGORY_ICON);
  });

  it('invariante: siempre devuelve exactamente un icono no vacío (PBT-03)', () => {
    fc.assert(
      fc.property(fc.option(fc.string(), { nil: null }), (category) => {
        const icon = getCategoryIcon(category);
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      })
    );
  });
});
