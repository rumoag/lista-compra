import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/home/households-api.js', () => ({
  deleteHousehold: vi.fn(),
}));

const { deleteHousehold } = await import('../../src/home/households-api.js');
const { openDeleteConfirmModal } = await import('../../src/home/delete-confirm-modal.js');

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('openDeleteConfirmModal (FR-5, BR-31)', () => {
  it('muestra el mensaje de confirmación', () => {
    openDeleteConfirmModal({ household: { id: 'h1' }, onConfirmed: vi.fn() });

    expect(document.querySelector('[data-testid="delete-confirm-message"]').textContent).toContain(
      'Se borrarán todos sus productos e historial'
    );
  });

  it('cancelar cierra el modal sin borrar', () => {
    openDeleteConfirmModal({ household: { id: 'h1' }, onConfirmed: vi.fn() });

    document.querySelector('[data-testid="delete-confirm-cancel-button"]').click();

    expect(deleteHousehold).not.toHaveBeenCalled();
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('confirmar borra la lista y llama a onConfirmed', async () => {
    deleteHousehold.mockResolvedValue(undefined);
    const onConfirmed = vi.fn();

    openDeleteConfirmModal({ household: { id: 'h1' }, onConfirmed });
    document.querySelector('[data-testid="delete-confirm-delete-button"]').click();

    await new Promise((r) => setTimeout(r, 0));

    expect(deleteHousehold).toHaveBeenCalledWith('h1');
    expect(onConfirmed).toHaveBeenCalled();
  });

  it('muestra error genérico si falla el borrado, sin cerrar el modal', async () => {
    deleteHousehold.mockRejectedValue(new Error('boom'));

    openDeleteConfirmModal({ household: { id: 'h1' }, onConfirmed: vi.fn() });
    document.querySelector('[data-testid="delete-confirm-delete-button"]').click();

    await new Promise((r) => setTimeout(r, 0));

    expect(document.querySelector('[data-testid="delete-confirm-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });
});
