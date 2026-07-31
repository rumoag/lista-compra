import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  normalizeProductKey,
  groupByNormalizedName,
  computeAverageCadenceDays,
  computeRanking,
  computeDistributionByWeekday,
  computeDistributionByPerson,
  computeTimeSeries,
} from '../../src/stats/calculations.js';

function makeProduct(overrides = {}) {
  return { id: 'p', name: 'Leche', bought_by: 'Yo', bought_at: '2026-01-01T00:00:00.000Z', ...overrides };
}

describe('normalizeProductKey — idempotencia', () => {
  it('aplicar dos veces produce el mismo resultado que aplicar una vez', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        const once = normalizeProductKey(name);
        const twice = normalizeProductKey(once);
        expect(twice).toBe(once);
      })
    );
  });
});

describe('groupByNormalizedName — invariante (PBT-03, bloqueante)', () => {
  it('la suma de purchaseCount de todos los grupos es igual al total de productos de entrada', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            name: fc.constantFrom('Leche', 'leche', ' LECHE ', 'Pan', 'pan'),
            bought_by: fc.constantFrom('Yo', 'Mi pareja'),
            bought_at: fc.constant('2026-01-01T00:00:00.000Z'),
          })
        ),
        (products) => {
          const groups = groupByNormalizedName(products);
          const total = groups.reduce((sum, g) => sum + g.purchaseCount, 0);
          expect(total).toBe(products.length);
        }
      )
    );
  });

  it('agrupa variantes de mayúsculas/espacios como el mismo producto (BR-14)', () => {
    const products = [
      makeProduct({ id: '1', name: 'Leche' }),
      makeProduct({ id: '2', name: 'leche' }),
      makeProduct({ id: '3', name: ' LECHE ' }),
    ];
    const groups = groupByNormalizedName(products);
    expect(groups).toHaveLength(1);
    expect(groups[0].purchaseCount).toBe(3);
  });

  it('el displayName del grupo es el de la compra más reciente', () => {
    const products = [
      makeProduct({ id: '1', name: 'leche', bought_at: '2026-01-01T00:00:00.000Z' }),
      makeProduct({ id: '2', name: 'Leche', bought_at: '2026-02-01T00:00:00.000Z' }),
    ];
    const groups = groupByNormalizedName(products);
    expect(groups[0].displayName).toBe('Leche');
  });
});

describe('computeAverageCadenceDays — invariante (PBT-03, bloqueante)', () => {
  it('devuelve null con menos de 2 fechas', () => {
    expect(computeAverageCadenceDays([])).toBeNull();
    expect(computeAverageCadenceDays(['2026-01-01'])).toBeNull();
  });

  it('el resultado está entre el intervalo mínimo y máximo observado', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 3650 }), { minLength: 2, maxLength: 20 }),
        (dayOffsets) => {
          const base = new Date('2020-01-01').getTime();
          const dates = dayOffsets.map((offset) => new Date(base + offset * 86400000).toISOString());
          const sorted = [...dates].map((d) => new Date(d).getTime()).sort((a, b) => a - b);
          const intervals = [];
          for (let i = 1; i < sorted.length; i++) {
            intervals.push((sorted[i] - sorted[i - 1]) / 86400000);
          }

          const result = computeAverageCadenceDays(dates);
          if (intervals.length === 0) {
            expect(result).toBeNull();
          } else {
            expect(result).toBeGreaterThanOrEqual(Math.min(...intervals) - 1e-9);
            expect(result).toBeLessThanOrEqual(Math.max(...intervals) + 1e-9);
          }
        }
      )
    );
  });

  it('el resultado no depende del orden de entrada (independiente de permutación)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 3650 }), { minLength: 2, maxLength: 10 }), (dayOffsets) => {
        const base = new Date('2020-01-01').getTime();
        const dates = dayOffsets.map((offset) => new Date(base + offset * 86400000).toISOString());
        const shuffled = [...dates].reverse();

        expect(computeAverageCadenceDays(dates)).toBeCloseTo(computeAverageCadenceDays(shuffled), 9);
      })
    );
  });

  it('caso concreto: compras cada 6 y 8 días → media de 7', () => {
    const dates = ['2026-01-01T00:00:00.000Z', '2026-01-07T00:00:00.000Z', '2026-01-15T00:00:00.000Z'];
    expect(computeAverageCadenceDays(dates)).toBe(7);
  });
});

describe('computeRanking', () => {
  it('ordena de mayor a menor purchaseCount', () => {
    const groups = [
      { normalizedName: 'pan', purchaseCount: 2 },
      { normalizedName: 'leche', purchaseCount: 5 },
    ];
    const ranking = computeRanking(groups);
    expect(ranking.map((g) => g.normalizedName)).toEqual(['leche', 'pan']);
  });
});

describe('computeDistributionByWeekday', () => {
  it('cuenta las compras por día de la semana', () => {
    const products = [
      makeProduct({ bought_at: '2026-01-05T00:00:00.000Z' }), // lunes
      makeProduct({ bought_at: '2026-01-12T00:00:00.000Z' }), // lunes
    ];
    const distribution = computeDistributionByWeekday(products);
    const monday = distribution.find((d) => d.weekday === 'Lunes');
    expect(monday.count).toBe(2);
  });
});

describe('computeDistributionByPerson', () => {
  it('cuenta las compras por persona', () => {
    const products = [
      makeProduct({ bought_by: 'Yo' }),
      makeProduct({ bought_by: 'Yo' }),
      makeProduct({ bought_by: 'Mi pareja' }),
    ];
    const distribution = computeDistributionByPerson(products);
    expect(distribution).toEqual(
      expect.arrayContaining([
        { person: 'Yo', count: 2 },
        { person: 'Mi pareja', count: 1 },
      ])
    );
  });
});

describe('computeTimeSeries — casos concretos (FR-36, BR-67, BR-68)', () => {
  it('devuelve [] sin productos', () => {
    expect(computeTimeSeries([], 'month')).toEqual([]);
  });

  it('agrupa por mes y rellena el mes sin compras con count 0 (BR-68)', () => {
    const products = [
      makeProduct({ bought_at: '2026-01-05T00:00:00.000Z' }),
      makeProduct({ bought_at: '2026-01-20T00:00:00.000Z' }),
      makeProduct({ bought_at: '2026-03-01T00:00:00.000Z' }),
    ];
    const series = computeTimeSeries(products, 'month');
    expect(series.map((b) => b.periodKey)).toEqual(['2026-01', '2026-02', '2026-03']);
    expect(series.map((b) => b.count)).toEqual([2, 0, 1]);
    expect(series[0].label).toBe('ene 2026');
  });

  it('agrupa por semana ISO (lunes a domingo) y rellena la semana sin compras (BR-68)', () => {
    const products = [
      makeProduct({ bought_at: '2026-01-05T00:00:00.000Z' }), // lunes, semana 2
      makeProduct({ bought_at: '2026-01-19T00:00:00.000Z' }), // lunes, semana 4
    ];
    const series = computeTimeSeries(products, 'week');
    expect(series.map((b) => b.periodKey)).toEqual(['2026-W02', '2026-W03', '2026-W04']);
    expect(series.map((b) => b.count)).toEqual([1, 0, 1]);
    expect(series[0].label).toBe('05/01');
  });

  it('un producto comprado un domingo cuenta en la semana ISO que empezó el lunes anterior', () => {
    const products = [makeProduct({ bought_at: '2026-01-11T00:00:00.000Z' })]; // domingo, semana 2
    const series = computeTimeSeries(products, 'week');
    expect(series).toEqual([{ periodKey: '2026-W02', label: '05/01', count: 1 }]);
  });
});

describe('computeTimeSeries — invariantes (PBT-03, bloqueante)', () => {
  const productsArbitrary = fc.array(
    fc.record({
      id: fc.uuid(),
      name: fc.constant('Leche'),
      bought_by: fc.constant('Yo'),
      bought_at: fc
        .date({ min: new Date('2023-01-01T00:00:00.000Z'), max: new Date('2027-12-31T00:00:00.000Z') })
        .map((d) => d.toISOString()),
    })
  );

  it('la suma de count de todos los buckets es igual al total de productos de entrada', () => {
    fc.assert(
      fc.property(productsArbitrary, fc.constantFrom('month', 'week'), (products, granularity) => {
        const series = computeTimeSeries(products, granularity);
        const total = series.reduce((sum, b) => sum + b.count, 0);
        expect(total).toBe(products.length);
      })
    );
  });

  it('el array devuelto está ordenado ascendentemente por periodKey sin huecos', () => {
    fc.assert(
      fc.property(productsArbitrary, fc.constantFrom('month', 'week'), (products, granularity) => {
        const series = computeTimeSeries(products, granularity);
        const keys = series.map((b) => b.periodKey);
        expect(keys).toEqual([...keys].sort());
        expect(new Set(keys).size).toBe(keys.length);
      })
    );
  });

  it('ningún count es negativo', () => {
    fc.assert(
      fc.property(productsArbitrary, fc.constantFrom('month', 'week'), (products, granularity) => {
        const series = computeTimeSeries(products, granularity);
        expect(series.every((b) => b.count >= 0)).toBe(true);
      })
    );
  });

  it('el resultado no depende del orden de entrada', () => {
    fc.assert(
      fc.property(productsArbitrary, fc.constantFrom('month', 'week'), (products, granularity) => {
        const shuffled = [...products].reverse();
        expect(computeTimeSeries(products, granularity)).toEqual(computeTimeSeries(shuffled, granularity));
      })
    );
  });
});
