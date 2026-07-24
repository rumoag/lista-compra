import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/home/households-api.js', () => ({
  fetchAllHouseholdsWithParticipants: vi.fn(),
  deleteHousehold: vi.fn(),
  formatParticipants: (participants) => participants.join(', '),
}));

vi.mock('../../src/home/list-form-modal.js', () => ({
  openListFormModal: vi.fn(),
}));

vi.mock('../../src/common/qr-modal.js', () => ({
  openQrModal: vi.fn(),
}));

vi.mock('../../src/common/confirm-modal.js', () => ({
  openConfirmModal: vi.fn(),
}));

const { fetchAllHouseholdsWithParticipants, deleteHousehold } = await import('../../src/home/households-api.js');
const { openListFormModal } = await import('../../src/home/list-form-modal.js');
const { openConfirmModal } = await import('../../src/common/confirm-modal.js');
const { renderHomeScreen } = await import('../../src/home/home-screen.js');

function mount() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('renderHomeScreen', () => {
  it('muestra el estado vacío si no hay listas (BR-30)', async () => {
    fetchAllHouseholdsWithParticipants.mockResolvedValue([]);
    const container = mount();

    await renderHomeScreen(container);

    expect(container.querySelector('[data-testid="home-empty-state"]').hidden).toBe(false);
    expect(container.querySelector('[data-testid="home-create-list-button"]')).not.toBeNull();
  });

  it('renderiza una tarjeta por cada lista (BR-29 orden ya viene de la API)', async () => {
    fetchAllHouseholdsWithParticipants.mockResolvedValue([
      { id: 'h1', title: 'Casa', image_icon: '🛒', participants: ['Ana'] },
      { id: 'h2', title: 'Piso', image_icon: '🏠', participants: [] },
    ]);
    const container = mount();

    await renderHomeScreen(container);

    expect(container.querySelector('[data-testid="list-card-h1"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="list-card-h2"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="home-empty-state"]').hidden).toBe(true);
  });

  it('abre el modal de creación al pulsar "Crear nueva lista"', async () => {
    fetchAllHouseholdsWithParticipants.mockResolvedValue([]);
    const container = mount();
    await renderHomeScreen(container);

    container.querySelector('[data-testid="home-create-list-button"]').click();

    expect(openListFormModal).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'create', onSaved: expect.any(Function) })
    );
  });

  it('muestra un error genérico si falla la carga', async () => {
    fetchAllHouseholdsWithParticipants.mockRejectedValue(new Error('boom'));
    const container = mount();

    await renderHomeScreen(container);

    expect(container.querySelector('[data-testid="home-load-error"]').hidden).toBe(false);
  });

  it('eliminar una lista abre el modal de confirmación genérico y borra al confirmar', async () => {
    fetchAllHouseholdsWithParticipants.mockResolvedValue([
      { id: 'h1', title: 'Casa', image_icon: '🛒', participants: [] },
    ]);
    deleteHousehold.mockResolvedValue(undefined);
    const container = mount();
    await renderHomeScreen(container);

    container.querySelector('[data-testid="dropdown-menu-toggle"]').click();
    container.querySelector('[data-testid="dropdown-menu-delete"]').click();

    expect(openConfirmModal).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Eliminar lista', onConfirm: expect.any(Function) })
    );

    await openConfirmModal.mock.calls[0][0].onConfirm();
    expect(deleteHousehold).toHaveBeenCalledWith('h1');
  });
});
