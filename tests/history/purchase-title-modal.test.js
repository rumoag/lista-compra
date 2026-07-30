import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openPurchaseTitleModal } from '../../src/history/purchase-title-modal.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('openPurchaseTitleModal (seguimiento)', () => {
  it('confirmar con el campo vacío invoca onConfirm con null y cierra el modal', async () => {
    const onConfirm = vi.fn().mockResolvedValue();
    openPurchaseTitleModal({ onConfirm });

    document.querySelector('[data-testid="purchase-title-form"]').dispatchEvent(new Event('submit'));
    await Promise.resolve();
    await Promise.resolve();

    expect(onConfirm).toHaveBeenCalledWith(null);
    expect(document.querySelector('[data-testid="modal-overlay"]')).toBeNull();
  });

  it('confirmar con un título válido lo normaliza e invoca onConfirm', async () => {
    const onConfirm = vi.fn().mockResolvedValue();
    openPurchaseTitleModal({ onConfirm });

    document.querySelector('[data-testid="purchase-title-input"]').value = '  Mercadona  ';
    document.querySelector('[data-testid="purchase-title-form"]').dispatchEvent(new Event('submit'));
    await Promise.resolve();
    await Promise.resolve();

    expect(onConfirm).toHaveBeenCalledWith('Mercadona');
  });

  it('un título demasiado largo muestra un error y no invoca onConfirm', async () => {
    const onConfirm = vi.fn();
    openPurchaseTitleModal({ onConfirm });

    document.querySelector('[data-testid="purchase-title-input"]').value = 'a'.repeat(51);
    document.querySelector('[data-testid="purchase-title-form"]').dispatchEvent(new Event('submit'));
    await Promise.resolve();

    expect(onConfirm).not.toHaveBeenCalled();
    expect(document.querySelector('[data-testid="purchase-title-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });

  it('si onConfirm falla, muestra un error genérico y mantiene el modal abierto', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('boom'));
    openPurchaseTitleModal({ onConfirm });

    document.querySelector('[data-testid="purchase-title-form"]').dispatchEvent(new Event('submit'));
    await Promise.resolve();
    await Promise.resolve();

    expect(document.querySelector('[data-testid="purchase-title-error"]').hidden).toBe(false);
    expect(document.querySelector('[data-testid="modal-overlay"]')).not.toBeNull();
  });
});
