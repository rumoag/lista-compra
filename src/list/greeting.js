// Saludo con nombre local, clicable (BR-45, BR-8 del ciclo de requisitos: acceso redundante
// e intencional a cambiar nombre, junto con el menú de la cabecera).
import { getLocalName } from '../onboarding/name-prompt.js';

export function renderGreeting(container, { onChangeName }) {
  container.innerHTML = `
    <button type="button" class="greeting" data-testid="greeting">Hola, ${escapeHtml(getLocalName() ?? '')}</button>
  `;
  container.querySelector('[data-testid="greeting"]').addEventListener('click', onChangeName);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
