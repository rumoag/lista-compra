import { describe, it, expect, vi } from 'vitest';

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,fakepng'),
  },
}));

const { renderQrView } = await import('../../src/onboarding/qr-view.js');
const QRCode = (await import('qrcode')).default;

describe('renderQrView', () => {
  it('muestra la URL del household', async () => {
    const container = document.createElement('div');
    await renderQrView(container, { householdId: 'abc-123' });

    expect(container.querySelector('[data-testid="qr-view-url"]').textContent).toContain('abc-123');
  });

  it('genera el QR a partir de la URL completa del household', async () => {
    const container = document.createElement('div');
    await renderQrView(container, { householdId: 'abc-123' });

    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      expect.stringContaining('/abc-123'),
      expect.any(Object)
    );
    expect(container.querySelector('[data-testid="qr-view-image"]')).not.toBeNull();
  });

  it('muestra un error si falla la generación del QR', async () => {
    QRCode.toDataURL.mockRejectedValueOnce(new Error('boom'));
    const container = document.createElement('div');

    await renderQrView(container, { householdId: 'abc-123' });

    expect(container.querySelector('[data-testid="qr-view-error"]')).not.toBeNull();
  });
});
