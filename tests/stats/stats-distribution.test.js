import { describe, it, expect } from 'vitest';
import { renderStatsDistribution } from '../../src/stats/stats-distribution.js';

describe('renderStatsDistribution', () => {
  it('muestra "sin datos suficientes" cuando no hay productos', () => {
    const container = document.createElement('div');
    renderStatsDistribution(container, { products: [] });
    expect(container.querySelector('[data-testid="stats-distribution-empty"]')).not.toBeNull();
  });

  it('muestra distribución por día de la semana y por persona', () => {
    const container = document.createElement('div');
    renderStatsDistribution(container, {
      products: [
        { bought_at: '2026-01-05T00:00:00.000Z', bought_by: 'Yo' },
        { bought_at: '2026-01-06T00:00:00.000Z', bought_by: 'Mi pareja' },
      ],
    });

    expect(container.querySelector('[data-testid="stats-distribution-weekday-list"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="stats-distribution-person-list"]').textContent).toContain('Yo');
  });
});
