import { describe, it, expect, vi } from 'vitest';
import { renderListActionsMenu } from '../../src/home/list-actions-menu.js';

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

describe('renderListActionsMenu', () => {
  it('el dropdown empieza oculto y se muestra al pulsar el toggle', () => {
    const container = mount();
    renderListActionsMenu(container, { onEdit: vi.fn(), onDelete: vi.fn(), onViewQr: vi.fn() });

    const dropdown = container.querySelector('[data-testid="list-actions-menu-dropdown"]');
    expect(dropdown.hidden).toBe(true);

    container.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    expect(dropdown.hidden).toBe(false);
  });

  it('llama a onEdit y cierra el menú', () => {
    const container = mount();
    const onEdit = vi.fn();
    renderListActionsMenu(container, { onEdit, onDelete: vi.fn(), onViewQr: vi.fn() });

    container.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    container.querySelector('[data-testid="list-actions-menu-edit"]').click();

    expect(onEdit).toHaveBeenCalled();
    expect(container.querySelector('[data-testid="list-actions-menu-dropdown"]').hidden).toBe(true);
  });

  it('llama a onDelete al pulsar Eliminar', () => {
    const container = mount();
    const onDelete = vi.fn();
    renderListActionsMenu(container, { onEdit: vi.fn(), onDelete, onViewQr: vi.fn() });

    container.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    container.querySelector('[data-testid="list-actions-menu-delete"]').click();

    expect(onDelete).toHaveBeenCalled();
  });

  it('llama a onViewQr al pulsar Ver QR', () => {
    const container = mount();
    const onViewQr = vi.fn();
    renderListActionsMenu(container, { onEdit: vi.fn(), onDelete: vi.fn(), onViewQr });

    container.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    container.querySelector('[data-testid="list-actions-menu-qr"]').click();

    expect(onViewQr).toHaveBeenCalled();
  });

  it('cerrar al hacer click fuera del menú', () => {
    const container = mount();
    renderListActionsMenu(container, { onEdit: vi.fn(), onDelete: vi.fn(), onViewQr: vi.fn() });

    container.querySelector('[data-testid="list-actions-menu-toggle"]').click();
    document.body.click();

    expect(container.querySelector('[data-testid="list-actions-menu-dropdown"]').hidden).toBe(true);
  });
});
