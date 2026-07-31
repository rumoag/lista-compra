import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderStatsRanking } from '../../src/stats/stats-ranking.js';
import { loadChart } from '../../src/stats/chart-loader.js';

vi.mock('../../src/stats/chart-loader.js', () => ({ loadChart: vi.fn() }));

class FakeChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
  }
  destroy() {}
}

describe('renderStatsRanking', () => {
  beforeEach(() => {
    loadChart.mockReset();
    loadChart.mockResolvedValue(FakeChart);
  });

  it('muestra "sin datos suficientes" cuando no hay grupos', async () => {
    const container = document.createElement('div');
    await renderStatsRanking(container, { groups: [] });
    expect(container.querySelector('[data-testid="stats-ranking-empty"]')).not.toBeNull();
  });

  it('ordena por purchaseCount descendente', async () => {
    const container = document.createElement('div');
    await renderStatsRanking(container, {
      groups: [
        { displayName: 'Pan', purchaseCount: 2 },
        { displayName: 'Leche', purchaseCount: 5 },
      ],
    });

    const list = container.querySelector('[data-testid="stats-ranking-list"]');
    expect(list.textContent).toMatch(/Leche.*Pan/s);
  });

  it('limita el gráfico a los 10 productos con más compras (BR-69)', async () => {
    const groups = Array.from({ length: 15 }, (_, i) => ({ displayName: `Producto ${i}`, purchaseCount: i + 1 }));
    const container = document.createElement('div');
    await renderStatsRanking(container, { groups });

    const items = container.querySelectorAll('[data-testid^="stats-ranking-item-"]');
    expect(items).toHaveLength(10);
    expect(container.querySelector('[data-testid="stats-ranking-item-0"]').textContent).toContain('Producto 14');
  });

  it('si Chart.js no carga, la alternativa textual pasa a ser el contenido visible', async () => {
    loadChart.mockRejectedValue(new Error('CDN caído'));
    const container = document.createElement('div');
    await renderStatsRanking(container, { groups: [{ displayName: 'Pan', purchaseCount: 1 }] });

    const list = container.querySelector('[data-testid="stats-ranking-list"]');
    expect(list.classList.contains('sr-only')).toBe(false);
    expect(container.querySelector('[data-testid="stats-ranking-canvas"]')).toBeNull();
  });
});
