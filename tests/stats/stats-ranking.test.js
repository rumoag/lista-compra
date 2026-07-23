import { describe, it, expect } from 'vitest';
import { renderStatsRanking } from '../../src/stats/stats-ranking.js';

describe('renderStatsRanking', () => {
  it('muestra "sin datos suficientes" cuando no hay grupos', () => {
    const container = document.createElement('div');
    renderStatsRanking(container, { groups: [] });
    expect(container.querySelector('[data-testid="stats-ranking-empty"]')).not.toBeNull();
  });

  it('ordena por purchaseCount descendente', () => {
    const container = document.createElement('div');
    renderStatsRanking(container, {
      groups: [
        { displayName: 'Pan', purchaseCount: 2 },
        { displayName: 'Leche', purchaseCount: 5 },
      ],
    });

    const list = container.querySelector('[data-testid="stats-ranking-list"]');
    expect(list.textContent).toMatch(/Leche.*Pan/s);
  });
});
