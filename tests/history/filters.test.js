import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { filterByDateRange, filterByName } from '../../src/history/filters.js';

function makeProduct(overrides = {}) {
  return { id: 'p', name: 'Leche', bought_at: '2026-01-01T00:00:00.000Z', ...overrides };
}

const isoDateArbitrary = fc
  .integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-01-01').getTime() })
  .map((ms) => new Date(ms).toISOString());

describe('filterByDateRange — invariante (PBT-03, bloqueante)', () => {
  it('todo producto en el resultado tiene bought_at dentro del rango [start, end]', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ id: fc.uuid(), name: fc.constant('x'), bought_at: isoDateArbitrary })),
        isoDateArbitrary,
        isoDateArbitrary,
        (products, dateA, dateB) => {
          const start = dateA < dateB ? dateA : dateB;
          const end = dateA < dateB ? dateB : dateA;
          const result = filterByDateRange(products, start, end);

          for (const product of result) {
            const t = new Date(product.bought_at).getTime();
            expect(t).toBeGreaterThanOrEqual(new Date(start).getTime());
            expect(t).toBeLessThanOrEqual(new Date(end).getTime());
          }
        }
      )
    );
  });

  it('ningún producto fuera de rango aparece en el resultado', () => {
    const products = [
      makeProduct({ id: '1', bought_at: '2026-01-01T00:00:00.000Z' }),
      makeProduct({ id: '2', bought_at: '2026-02-01T00:00:00.000Z' }),
      makeProduct({ id: '3', bought_at: '2026-03-01T00:00:00.000Z' }),
    ];
    const result = filterByDateRange(products, '2026-01-15', '2026-02-15');
    expect(result.map((p) => p.id)).toEqual(['2']);
  });
});

describe('filterByName — invariante (PBT-03, bloqueante)', () => {
  it('todo producto en el resultado contiene la query (insensible a mayúsculas)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ id: fc.uuid(), name: fc.string({ minLength: 1 }), bought_at: fc.constant('2026-01-01') })),
        fc.string({ minLength: 1, maxLength: 5 }),
        (products, query) => {
          const result = filterByName(products, query);
          for (const product of result) {
            expect(product.name.toLowerCase()).toContain(query.trim().toLowerCase());
          }
        }
      )
    );
  });

  it('con query vacía devuelve todos los productos sin cambios', () => {
    const products = [makeProduct({ id: '1' }), makeProduct({ id: '2' })];
    expect(filterByName(products, '')).toEqual(products);
  });

  it('es insensible a mayúsculas', () => {
    const products = [makeProduct({ id: '1', name: 'Leche desnatada' })];
    expect(filterByName(products, 'LECHE')).toHaveLength(1);
  });
});
