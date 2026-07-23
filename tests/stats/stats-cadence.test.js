import { describe, it, expect } from 'vitest';
import { renderStatsCadence } from '../../src/stats/stats-cadence.js';

describe('renderStatsCadence', () => {
  it('muestra "sin datos suficientes" cuando no hay grupos', () => {
    const container = document.createElement('div');
    renderStatsCadence(container, { groups: [] });
    expect(container.querySelector('[data-testid="stats-cadence-empty"]')).not.toBeNull();
  });

  it('muestra la cadencia redondeada en días', () => {
    const container = document.createElement('div');
    renderStatsCadence(container, { groups: [{ displayName: 'Leche', averageCadenceDays: 6.7 }] });

    expect(container.querySelector('[data-testid="stats-cadence-list"]').textContent).toContain('cada 7 días');
  });

  it('muestra "sin datos suficientes" para un producto con una sola compra (averageCadenceDays null)', () => {
    const container = document.createElement('div');
    renderStatsCadence(container, { groups: [{ displayName: 'Pan', averageCadenceDays: null }] });

    expect(container.querySelector('[data-testid="stats-cadence-list"]').textContent).toContain(
      'sin datos suficientes'
    );
  });
});
