import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderStatsDistribution } from '../../src/stats/stats-distribution.js';
import { loadChart } from '../../src/stats/chart-loader.js';

vi.mock('../../src/stats/chart-loader.js', () => ({ loadChart: vi.fn() }));

class FakeChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
  }
  destroy() {}
}

describe('renderStatsDistribution', () => {
  beforeEach(() => {
    loadChart.mockReset();
    loadChart.mockResolvedValue(FakeChart);
  });

  it('muestra "sin datos suficientes" cuando no hay productos', async () => {
    const container = document.createElement('div');
    await renderStatsDistribution(container, { products: [] });
    expect(container.querySelector('[data-testid="stats-distribution-empty"]')).not.toBeNull();
  });

  it('muestra distribución por día de la semana y por persona', async () => {
    const container = document.createElement('div');
    await renderStatsDistribution(container, {
      products: [
        { bought_at: '2026-01-05T00:00:00.000Z', bought_by: 'Yo' },
        { bought_at: '2026-01-06T00:00:00.000Z', bought_by: 'Mi pareja' },
      ],
    });

    expect(container.querySelector('[data-testid="stats-distribution-weekday-list"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="stats-distribution-person-list"]').textContent).toContain('Yo');
  });

  it('si Chart.js no carga, ambas alternativas textuales pasan a ser visibles', async () => {
    loadChart.mockRejectedValue(new Error('CDN caído'));
    const container = document.createElement('div');
    await renderStatsDistribution(container, {
      products: [{ bought_at: '2026-01-05T00:00:00.000Z', bought_by: 'Yo' }],
    });

    expect(container.querySelector('[data-testid="stats-distribution-weekday-list"]').classList.contains('sr-only')).toBe(
      false
    );
    expect(container.querySelector('[data-testid="stats-distribution-person-list"]').classList.contains('sr-only')).toBe(
      false
    );
    expect(container.querySelectorAll('canvas')).toHaveLength(0);
  });
});
