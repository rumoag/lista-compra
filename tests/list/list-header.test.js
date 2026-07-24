import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/common/qr-modal.js', () => ({
  openQrModal: vi.fn(),
}));

const { openQrModal } = await import('../../src/common/qr-modal.js');
const { renderListHeader } = await import('../../src/list/list-header.js');

function makeHousehold(overrides = {}) {
  return { id: 'h1', title: 'Casa', image_icon: '🛒', ...overrides };
}

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('renderListHeader (BR-46)', () => {
  it('muestra el icono y el título de la lista', () => {
    const container = document.createElement('div');
    renderListHeader(container, { household: makeHousehold(), onChangeName: vi.fn() });

    expect(container.querySelector('[data-testid="list-header-icon"]').textContent).toBe('🛒');
    expect(container.querySelector('[data-testid="list-header-title"]').textContent).toContain('Casa');
  });

  it('el menú de 3 puntos llama a onChangeName', () => {
    const onChangeName = vi.fn();
    const container = document.createElement('div');
    renderListHeader(container, { household: makeHousehold(), onChangeName });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-change-name"]').click();

    expect(onChangeName).toHaveBeenCalled();
  });

  it('el menú de 3 puntos abre el QR con el householdId', () => {
    const container = document.createElement('div');
    renderListHeader(container, { household: makeHousehold({ id: 'h9' }), onChangeName: vi.fn() });

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-qr"]').click();

    expect(openQrModal).toHaveBeenCalledWith({ householdId: 'h9' });
  });
});
