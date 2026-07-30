import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/common/qr-modal.js', () => ({
  openQrModal: vi.fn(),
}));

const { openQrModal } = await import('../../src/common/qr-modal.js');
const { renderGreeting } = await import('../../src/list/greeting.js');
const { setLocalName } = await import('../../src/onboarding/name-prompt.js');

function makeHousehold(overrides = {}) {
  return { id: 'h1', title: 'Casa', image_icon: '🛒', ...overrides };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('renderGreeting (topbar: título + avatar con menú de opciones, BR-45/BR-46)', () => {
  it('muestra el icono y el título de la lista', () => {
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName: vi.fn(), onEditList: vi.fn() });

    expect(container.querySelector('[data-testid="list-header-icon"]').textContent).toBe('🛒');
    expect(container.querySelector('[data-testid="list-header-title"]').textContent).toContain('Casa');
  });

  it('el avatar muestra la inicial en mayúscula del nombre local', () => {
    setLocalName('ana');
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName: vi.fn(), onEditList: vi.fn() });

    expect(container.querySelector('[data-testid="dropdown-menu-toggle"]').textContent).toBe('A');
  });

  it('abre el mismo menú que antes usaban los "3 puntos" al pulsar el avatar', () => {
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName: vi.fn(), onEditList: vi.fn() });

    const dropdown = container.querySelector('[data-testid="dropdown-menu-list"]');
    expect(dropdown.hidden).toBe(true);

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    expect(dropdown.hidden).toBe(false);
  });

  it('el saludo "Hola, {nombre}" vive dentro del menú y llama a onChangeName al pulsarlo', () => {
    setLocalName('Ana');
    const onChangeName = vi.fn();
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    const greetingAction = container.querySelector('[data-testid="dropdown-menu-change-name"]');

    expect(greetingAction.textContent).toBe('Hola, Ana');
    greetingAction.click();
    expect(onChangeName).toHaveBeenCalled();
  });

  it('"Editar lista de la compra" vive justo después del saludo y llama a onEditList al pulsarlo (seguimiento)', () => {
    setLocalName('Ana');
    const onEditList = vi.fn();
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName: vi.fn(), onEditList });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    const editAction = container.querySelector('[data-testid="dropdown-menu-edit-list"]');

    expect(editAction.textContent).toBe('Editar lista de la compra');
    editAction.click();
    expect(onEditList).toHaveBeenCalled();
  });

  it('el menú abre el QR con el householdId', () => {
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold({ id: 'h9' }), onChangeName: vi.fn(), onEditList: vi.fn() });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-qr"]').click();

    expect(openQrModal).toHaveBeenCalledWith({ householdId: 'h9' });
  });
});
