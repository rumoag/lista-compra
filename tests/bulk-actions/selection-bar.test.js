import { describe, it, expect, vi } from 'vitest';
import { renderSelectionBar } from '../../src/bulk-actions/selection-bar.js';

function render(container, overrides = {}) {
  renderSelectionBar(container, {
    selectedCount: 2,
    allSelected: false,
    onMarkAsBought: vi.fn(),
    onToggleSelectAll: vi.fn(),
    onDeleteSelected: vi.fn(),
    ...overrides,
  });
}

describe('renderSelectionBar', () => {
  it('se oculta cuando no hay productos seleccionados (US-2.1)', () => {
    const container = document.createElement('div');
    render(container, { selectedCount: 0 });

    expect(container.hidden).toBe(true);
    expect(container.innerHTML).toBe('');
  });

  it('muestra el contador de seleccionados', () => {
    const container = document.createElement('div');
    render(container, { selectedCount: 3 });

    expect(container.hidden).toBe(false);
    expect(container.querySelector('[data-testid="selection-bar-count"]').textContent).toContain('3');
  });

  it('llama a onMarkAsBought al pulsar el botón', () => {
    const container = document.createElement('div');
    const onMarkAsBought = vi.fn();
    render(container, { onMarkAsBought });

    container.querySelector('[data-testid="selection-bar-mark-bought-button"]').click();

    expect(onMarkAsBought).toHaveBeenCalledOnce();
  });

  it('muestra "Seleccionar todos" cuando allSelected es false, y llama a onToggleSelectAll', () => {
    const container = document.createElement('div');
    const onToggleSelectAll = vi.fn();
    render(container, { allSelected: false, onToggleSelectAll });

    const button = container.querySelector('[data-testid="selection-bar-toggle-all-button"]');
    expect(button.textContent).toBe('Seleccionar todos');

    button.click();
    expect(onToggleSelectAll).toHaveBeenCalledOnce();
  });

  it('muestra "Deseleccionar todos" cuando allSelected es true (FR-17)', () => {
    const container = document.createElement('div');
    render(container, { allSelected: true });

    expect(container.querySelector('[data-testid="selection-bar-toggle-all-button"]').textContent).toBe(
      'Deseleccionar todos'
    );
  });

  it('llama a onDeleteSelected al pulsar "Eliminar seleccionados" (FR-17)', () => {
    const container = document.createElement('div');
    const onDeleteSelected = vi.fn();
    render(container, { onDeleteSelected });

    container.querySelector('[data-testid="selection-bar-delete-button"]').click();

    expect(onDeleteSelected).toHaveBeenCalledOnce();
  });
});
