import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  validateProductName,
  validateQuantity,
  validateCategory,
  normalizeWhitespace,
} from '../../src/common/validation.js';

describe('validateProductName — property-based (PBT-03 invariant)', () => {
  const validNameArbitrary = fc
    .stringMatching(/^[a-zA-Z0-9 ]{1,50}$/)
    .filter((s) => normalizeWhitespace(s).length > 0 && normalizeWhitespace(s).length <= 50);

  it('acepta cualquier nombre dentro del alfabeto permitido y longitud 1-50', () => {
    fc.assert(
      fc.property(validNameArbitrary, (name) => {
        const result = validateProductName(name);
        expect(result.valid).toBe(true);
      })
    );
  });

  it('rechaza cualquier nombre con caracteres fuera del alfabeto permitido', () => {
    const invalidCharArbitrary = fc
      .string({ minLength: 1, maxLength: 50 })
      .filter((s) => /[^\p{L}\p{N} ]/u.test(s));

    fc.assert(
      fc.property(invalidCharArbitrary, (name) => {
        const result = validateProductName(name);
        expect(result.valid).toBe(false);
      })
    );
  });

  it('rechaza cualquier nombre de más de 50 caracteres (tras normalizar espacios)', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z]{51,80}$/), (name) => {
        const result = validateProductName(name);
        expect(result.valid).toBe(false);
      })
    );
  });

  it('es determinista: la misma entrada siempre produce el mismo resultado', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 60 }), (name) => {
        const first = validateProductName(name);
        const second = validateProductName(name);
        expect(second).toEqual(first);
      })
    );
  });
});

describe('normalizeWhitespace — idempotencia (PBT-03)', () => {
  it('aplicar normalizeWhitespace dos veces produce el mismo resultado que aplicarlo una vez', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const once = normalizeWhitespace(value);
        const twice = normalizeWhitespace(once);
        expect(twice).toBe(once);
      })
    );
  });
});

describe('validateProductName — casos límite (example-based, PBT-10)', () => {
  it('rechaza nombre vacío', () => {
    expect(validateProductName('').valid).toBe(false);
  });

  it('rechaza nombre compuesto solo de espacios', () => {
    expect(validateProductName('    ').valid).toBe(false);
  });

  it('acepta nombre de exactamente 50 caracteres', () => {
    const name = 'a'.repeat(50);
    expect(validateProductName(name).valid).toBe(true);
  });

  it('rechaza nombre de 51 caracteres', () => {
    const name = 'a'.repeat(51);
    expect(validateProductName(name).valid).toBe(false);
  });

  it('acepta nombres con acentos y ñ', () => {
    expect(validateProductName('Aceite de oliva español').valid).toBe(true);
    expect(validateProductName('Piña').valid).toBe(true);
  });

  it('rechaza puntuación no permitida', () => {
    expect(validateProductName('Leche (2%)').valid).toBe(false);
    expect(validateProductName('Pan, integral').valid).toBe(false);
  });
});

describe('validateQuantity', () => {
  it('acepta valores vacíos/nulos como opcionales', () => {
    expect(validateQuantity(null).valid).toBe(true);
    expect(validateQuantity(undefined).valid).toBe(true);
    expect(validateQuantity('').valid).toBe(true);
  });

  it('acepta hasta 50 caracteres', () => {
    expect(validateQuantity('a'.repeat(50)).valid).toBe(true);
  });

  it('rechaza más de 50 caracteres', () => {
    expect(validateQuantity('a'.repeat(51)).valid).toBe(false);
  });
});

describe('validateCategory', () => {
  it('acepta valores vacíos/nulos como opcionales', () => {
    expect(validateCategory(null).valid).toBe(true);
  });

  it('acepta hasta 40 caracteres', () => {
    expect(validateCategory('a'.repeat(40)).valid).toBe(true);
  });

  it('rechaza más de 40 caracteres', () => {
    expect(validateCategory('a'.repeat(41)).valid).toBe(false);
  });
});
