import { describe, it, expect, vi } from 'vitest';
import { renderDropdownMenu } from '../../src/common/dropdown-menu.js';

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

function makeActions(overrides = {}) {
  return [
    { testid: 'edit', label: 'Editar', onClick: vi.fn(), ...overrides.edit },
    { testid: 'delete', label: 'Eliminar', onClick: vi.fn(), ...overrides.delete },
  ];
}

describe('renderDropdownMenu', () => {
  it('el dropdown empieza oculto y se muestra al pulsar el toggle', () => {
    const container = mount();
    renderDropdownMenu(container, { actions: makeActions() });

    const dropdown = container.querySelector('[data-testid="dropdown-menu-list"]');
    expect(dropdown.hidden).toBe(true);

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    expect(dropdown.hidden).toBe(false);
  });

  it('renderiza una acción por entrada y llama a su onClick al pulsarla, cerrando el menú', () => {
    const container = mount();
    const actions = makeActions();
    renderDropdownMenu(container, { actions });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-edit"]').click();

    expect(actions[0].onClick).toHaveBeenCalled();
    expect(container.querySelector('[data-testid="dropdown-menu-list"]').hidden).toBe(true);
  });

  it('soporta un número arbitrario de acciones (ej. 3 para la cabecera)', () => {
    const container = mount();
    const onA = vi.fn();
    const onB = vi.fn();
    const onC = vi.fn();
    renderDropdownMenu(container, {
      actions: [
        { testid: 'a', label: 'A', onClick: onA },
        { testid: 'b', label: 'B', onClick: onB },
        { testid: 'c', label: 'C', onClick: onC },
      ],
    });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-c"]').click();

    expect(onC).toHaveBeenCalled();
    expect(onA).not.toHaveBeenCalled();
    expect(onB).not.toHaveBeenCalled();
  });

  it('cierra al hacer click fuera del menú', () => {
    const container = mount();
    renderDropdownMenu(container, { actions: makeActions() });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    document.body.click();

    expect(container.querySelector('[data-testid="dropdown-menu-list"]').hidden).toBe(true);
  });
});
