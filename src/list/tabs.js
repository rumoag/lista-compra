// Tabs de navegación (BR-47) — sustituye la barra de botones de navegación de las Unidades 1-4.
// El QR ya no es un tab (se movió al menú de la cabecera, BR-46).
// Floating toolbar estilo M3: flota junto al FAB; el icono solo se muestra en el tab activo.
export function renderTabs(navContainer, viewContainer, { views, householdId, initialView }) {
  let currentCleanup = null;

  function renderNav(activeView) {
    navContainer.innerHTML = Object.entries(views)
      .map(([key, view]) => {
        const active = key === activeView;
        return `<button type="button" class="tab" data-testid="tabs-${key}-button" ${
          active ? 'aria-current="true"' : ''
        }>${active ? `<span class="tab-icon" aria-hidden="true">${view.icon}</span>` : ''}<span class="tab-label">${view.label}</span></button>`;
      })
      .join('');

    Object.keys(views).forEach((key) => {
      navContainer.querySelector(`[data-testid="tabs-${key}-button"]`).addEventListener('click', () => {
        activate(key);
      });
    });
  }

  // Sin esto, cada visita a un tab con suscripción propia (ej. "Lista": Realtime +
  // IntersectionObserver) queda huérfana al cambiar de tab — el canal de Realtime del
  // household sigue abierto y una nueva visita crea otro canal con el mismo topic, lo
  // que puede impedir que la nueva suscripción (o incluso la carga inicial) funcione.
  async function activate(viewKey) {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
    renderNav(viewKey);
    const cleanup = await views[viewKey].render(viewContainer, { householdId });
    if (typeof cleanup === 'function') currentCleanup = cleanup;
  }

  activate(initialView);
}
