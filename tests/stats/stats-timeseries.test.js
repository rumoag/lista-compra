import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderStatsTimeseries } from '../../src/stats/stats-timeseries.js';
import { loadChart } from '../../src/stats/chart-loader.js';

vi.mock('../../src/stats/chart-loader.js', () => ({ loadChart: vi.fn() }));

class FakeChart {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
  }
  destroy() {}
}

function makeProduct(overrides = {}) {
  return { bought_at: '2026-01-05T00:00:00.000Z', ...overrides };
}

describe('renderStatsTimeseries', () => {
  beforeEach(() => {
    loadChart.mockReset();
    loadChart.mockResolvedValue(FakeChart);
  });

  it('muestra "sin datos suficientes" cuando no hay productos', async () => {
    const container = document.createElement('div');
    await renderStatsTimeseries(container, { products: [] });
    expect(container.querySelector('[data-testid="stats-timeseries-empty"]')).not.toBeNull();
  });

  it('por defecto agrupa por mes', async () => {
    const container = document.createElement('div');
    await renderStatsTimeseries(container, {
      products: [makeProduct({ bought_at: '2026-01-05T00:00:00.000Z' }), makeProduct({ bought_at: '2026-03-01T00:00:00.000Z' })],
    });

    const list = container.querySelector('[data-testid="stats-timeseries-list"]');
    expect(list.textContent).toContain('ene 2026');
    expect(container.querySelector('[data-testid="stats-timeseries-tab-month"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
  });

  it('al pulsar "Semana" recalcula en memoria sin volver a pedir los productos', async () => {
    const products = [makeProduct({ bought_at: '2026-01-05T00:00:00.000Z' })];
    const container = document.createElement('div');
    await renderStatsTimeseries(container, { products });

    container.querySelector('[data-testid="stats-timeseries-tab-week"]').click();

    const list = container.querySelector('[data-testid="stats-timeseries-list"]');
    expect(list.textContent).toContain('05/01');
    expect(container.querySelector('[data-testid="stats-timeseries-tab-week"]').getAttribute('aria-pressed')).toBe(
      'true'
    );
    expect(container.querySelector('[data-testid="stats-timeseries-tab-month"]').getAttribute('aria-pressed')).toBe(
      'false'
    );
  });

  it('si Chart.js no carga, la alternativa textual pasa a ser el contenido visible', async () => {
    loadChart.mockRejectedValue(new Error('CDN caído'));
    const container = document.createElement('div');
    await renderStatsTimeseries(container, { products: [makeProduct()] });

    const list = container.querySelector('[data-testid="stats-timeseries-list"]');
    expect(list.classList.contains('sr-only')).toBe(false);
    expect(container.querySelector('[data-testid="stats-timeseries-canvas"]')).toBeNull();
  });
});
