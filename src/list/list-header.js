// Título de la lista (BR-46) — icono+título, centrado. El menú de 3 puntos vive ahora en
// greeting.js (topbar), y este título ya no se oculta cuando aparece el header de selección.
export function renderListHeader(container, { household }) {
  container.innerHTML = `
    <div class="list-header" data-testid="list-header">
      <div class="list-header-title" data-testid="list-header-title">
        <span data-testid="list-header-icon">${household.image_icon}</span>
        <span>${escapeHtml(household.title)}</span>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
