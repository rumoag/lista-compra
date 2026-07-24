import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openConfirmModal } from '../../src/common/confirm-modal.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('openConfirmModal', () => {
  it('muestra el título y el mensaje', () => {
    openConfirmModal({ title: 'Eliminar lista', message: '¿Eliminar esta lista?', onConfirm: vi.fn() });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Eliminar lista');
    expect(document.querySelector('[data-testid="confirm-modal-message"]').textContent).toBe('¿Eliminar esta lista?');
  });

  it('cancelar cierra el modal sin llamar a onConfirm', () => {
    const onConfirm = vi.fn();
    openConfirmModal({ title: 'T', message: 'M', onConfirm });

    document.querySelector('[data-testid="confirm-modal-cancel-button"]').click();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('confirmar llama a onConfirm y cierra el modal si tiene éxito', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    openConfirmModal({ title: 'T', message: 'M', onConfirm });

    document.querySelector('[data-testid="confirm-modal-confirm-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(onConfirm).toHaveBeenCalled();
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('muestra error genérico si onConfirm falla, sin cerrar el modal', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('boom'));
    openConfirmModal({ title: 'T', message: 'M', onConfirm });

    document.querySelector('[data-testid="confirm-modal-confirm-button"]').click();
    await new Promise((r) => setTimeout(r, 0));

    expect(document.querySelector('[data-testid="confirm-modal-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });

  it('usa el confirmLabel personalizado', () => {
    openConfirmModal({ title: 'T', message: 'M', confirmLabel: 'Eliminar 3 productos', onConfirm: vi.fn() });

    expect(document.querySelector('[data-testid="confirm-modal-confirm-button"]').textContent).toBe(
      'Eliminar 3 productos'
    );
  });
});
