// Modal de QR (FR-4, Unidad 5; movido a common/ en Unidad 6 para reutilizarlo también
// desde la cabecera de la lista) — envuelve renderQrView (Unidad 4) sin lógica nueva.
import { openModal } from './modal.js';
import { renderQrView } from '../onboarding/qr-view.js';

export function openQrModal({ householdId }) {
  const { body } = openModal({ title: 'Código QR de la lista' });
  renderQrView(body, { householdId });
}
