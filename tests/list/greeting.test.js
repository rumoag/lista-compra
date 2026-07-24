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

describe('renderGreeting (topbar: saludo + menú de 3 puntos de la lista, BR-45/BR-46)', () => {
  it('muestra "Hola, {nombre}"', () => {
    setLocalName('Ana');
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName: vi.fn() });

    expect(container.querySelector('[data-testid="greeting"]').textContent).toBe('Hola, Ana');
  });

  it('llama a onChangeName al pulsar el saludo', () => {
    setLocalName('Ana');
    const onChangeName = vi.fn();
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName });

    container.querySelector('[data-testid="greeting"]').click();

    expect(onChangeName).toHaveBeenCalled();
  });

  it('el menú de 3 puntos llama a onChangeName (acceso redundante intencional)', () => {
    const onChangeName = vi.fn();
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold(), onChangeName });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-change-name"]').click();

    expect(onChangeName).toHaveBeenCalled();
  });

  it('el menú de 3 puntos abre el QR con el householdId', () => {
    const container = document.createElement('div');
    renderGreeting(container, { household: makeHousehold({ id: 'h9' }), onChangeName: vi.fn() });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-qr"]').click();

    expect(openQrModal).toHaveBeenCalledWith({ householdId: 'h9' });
  });
});
