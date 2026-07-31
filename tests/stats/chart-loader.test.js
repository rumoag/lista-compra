import { describe, it, expect, vi, beforeEach } from 'vitest';

const CHART_URL = 'https://esm.sh/chart.js@4.4.4/auto';

describe('loadChart', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('devuelve el export default del módulo importado', async () => {
    vi.doMock(CHART_URL, () => ({ default: class FakeChart {} }));
    const { loadChart } = await import('../../src/stats/chart-loader.js');

    const Chart = await loadChart();

    expect(Chart.name).toBe('FakeChart');
  });

  it('cachea la promesa: solo importa una vez aunque se llame varias veces', async () => {
    let importCount = 0;
    vi.doMock(CHART_URL, () => {
      importCount += 1;
      return { default: class FakeChart {} };
    });
    const { loadChart } = await import('../../src/stats/chart-loader.js');

    await loadChart();
    await loadChart();

    expect(importCount).toBe(1);
  });

  it('si la carga falla, limpia la caché para permitir reintentar en la siguiente llamada', async () => {
    vi.doMock(CHART_URL, () => {
      throw new Error('CDN caído');
    });
    const { loadChart } = await import('../../src/stats/chart-loader.js');

    await expect(loadChart()).rejects.toThrow();

    vi.doMock(CHART_URL, () => ({ default: class FakeChart {} }));
    const Chart = await loadChart();

    expect(Chart.name).toBe('FakeChart');
  });
});
