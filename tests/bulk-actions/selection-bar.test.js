import { describe, it, expect, vi } from 'vitest';
import { renderSelectionBar } from '../../src/bulk-actions/selection-bar.js';

describe('renderSelectionBar', () => {
  it('se oculta cuando no hay productos seleccionados (US-2.1)', () => {
    const container = document.createElement('div');
    renderSelectionBar(container, { selectedCount: 0, onMarkAsBought: vi.fn() });

    expect(container.hidden).toBe(true);
    expect(container.innerHTML).toBe('');
  });

  it('muestra el contador de seleccionados', () => {
    const container = document.createElement('div');
    renderSelectionBar(container, { selectedCount: 3, onMarkAsBought: vi.fn() });

    expect(container.hidden).toBe(false);
    expect(container.querySelector('[data-testid="selection-bar-count"]').textContent).toContain('3');
  });

  it('llama a onMarkAsBought al pulsar el botón', () => {
    const container = document.createElement('div');
    const onMarkAsBought = vi.fn();
    renderSelectionBar(container, { selectedCount: 2, onMarkAsBought });

    container.querySelector('[data-testid="selection-bar-mark-bought-button"]').click();

    expect(onMarkAsBought).toHaveBeenCalledOnce();
  });
});
