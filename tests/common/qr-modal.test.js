import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/onboarding/qr-view.js', () => ({
  renderQrView: vi.fn(),
}));

const { renderQrView } = await import('../../src/onboarding/qr-view.js');
const { openQrModal } = await import('../../src/common/qr-modal.js');

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('openQrModal (FR-4)', () => {
  it('abre un modal y delega en renderQrView con el householdId', () => {
    openQrModal({ householdId: 'h1' });

    expect(document.querySelector('[data-testid="modal-title"]').textContent).toBe('Código QR de la lista');
    expect(renderQrView).toHaveBeenCalledWith(expect.any(HTMLElement), { householdId: 'h1' });
  });
});
