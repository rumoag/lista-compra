// Modal de QR (FR-4) — envuelve renderQrView (Unidad 4) sin lógica nueva de generación de QR.
import { openModal } from '../common/modal.js';
import { renderQrView } from '../onboarding/qr-view.js';

export function openQrModal({ householdId }) {
  const { body } = openModal({ title: 'Código QR de la lista' });
  renderQrView(body, { householdId });
}
