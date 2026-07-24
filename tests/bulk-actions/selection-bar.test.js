import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderSelectionBar } from '../../src/bulk-actions/selection-bar.js';

function render(container, overrides = {}) {
  renderSelectionBar(container, {
    selectedCount: 2,
    onDeselectAll: vi.fn(),
    onMarkAsBought: vi.fn(),
    onDeleteSelected: vi.fn(),
    onSelectAll: vi.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  document.body.classList.remove('has-selection');
});

describe('renderSelectionBar', () => {
  it('se oculta cuando no hay productos seleccionados (US-2.1)', () => {
    const container = document.createElement('div');
    render(container, { selectedCount: 0 });

    expect(container.hidden).toBe(true);
    expect(container.innerHTML).toBe('');
    expect(document.body.classList.contains('has-selection')).toBe(false);
  });

  it('muestra el contador de seleccionados y marca body.has-selection', () => {
    const container = document.createElement('div');
    render(container, { selectedCount: 3 });

    expect(container.hidden).toBe(false);
    expect(container.querySelector('[data-testid="selection-bar-count"]').textContent).toContain('3');
    expect(document.body.classList.contains('has-selection')).toBe(true);
  });

  it('la X llama a onDeselectAll', () => {
    const container = document.createElement('div');
    const onDeselectAll = vi.fn();
    render(container, { onDeselectAll });

    container.querySelector('[data-testid="selection-bar-close-button"]').click();

    expect(onDeselectAll).toHaveBeenCalledOnce();
  });

  it('llama a onMarkAsBought al pulsar "Comprados"', () => {
    const container = document.createElement('div');
    const onMarkAsBought = vi.fn();
    render(container, { onMarkAsBought });

    container.querySelector('[data-testid="selection-bar-mark-bought-button"]').click();

    expect(onMarkAsBought).toHaveBeenCalledOnce();
  });

  it('llama a onDeleteSelected al pulsar el icono de eliminar (FR-17)', () => {
    const container = document.createElement('div');
    const onDeleteSelected = vi.fn();
    render(container, { onDeleteSelected });

    container.querySelector('[data-testid="selection-bar-delete-button"]').click();

    expect(onDeleteSelected).toHaveBeenCalledOnce();
  });

  it('el icono de eliminar tiene tooltip nativo (title) para desktop', () => {
    const container = document.createElement('div');
    render(container);

    expect(container.querySelector('[data-testid="selection-bar-delete-button"]').title).toBe(
      'Eliminar seleccionados'
    );
  });

  it('"Seleccionar todos" está dentro del menú de 3 puntos y llama a onSelectAll', () => {
    const container = document.createElement('div');
    const onSelectAll = vi.fn();
    render(container, { onSelectAll });

    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-select-all"]')
      .click();

    expect(onSelectAll).toHaveBeenCalledOnce();
  });

  it('sin onEditSelected, el menú no incluye "Editar"', () => {
    const container = document.createElement('div');
    render(container, { onEditSelected: null });

    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();

    expect(
      container.querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-edit"]')
    ).toBeNull();
  });

  it('con onEditSelected (exactamente 1 seleccionado), el menú incluye "Editar" y lo llama', () => {
    const container = document.createElement('div');
    const onEditSelected = vi.fn();
    render(container, { selectedCount: 1, onEditSelected });

    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-toggle"]')
      .click();
    container
      .querySelector('[data-testid="selection-bar-menu-container"] [data-testid="dropdown-menu-edit"]')
      .click();

    expect(onEditSelected).toHaveBeenCalledOnce();
  });
});
