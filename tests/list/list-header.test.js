import { describe, it, expect } from 'vitest';
import { renderListHeader } from '../../src/list/list-header.js';

function makeHousehold(overrides = {}) {
  return { id: 'h1', title: 'Casa', image_icon: '🛒', ...overrides };
}

describe('renderListHeader (solo título; el menú vive ahora en greeting.js)', () => {
  it('muestra el icono y el título de la lista', () => {
    const container = document.createElement('div');
    renderListHeader(container, { household: makeHousehold() });

    expect(container.querySelector('[data-testid="list-header-icon"]').textContent).toBe('🛒');
    expect(container.querySelector('[data-testid="list-header-title"]').textContent).toContain('Casa');
  });

  it('no incluye ningún menú de 3 puntos', () => {
    const container = document.createElement('div');
    renderListHeader(container, { household: makeHousehold() });

    expect(container.querySelector('[data-testid="dropdown-menu-toggle"]')).toBeNull();
  });
});
